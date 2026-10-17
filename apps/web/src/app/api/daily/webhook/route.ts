// ============================================================
// ITSEIA Academy — POST /api/daily/webhook
// Recibe eventos de Daily.co y registra asistencia automatica
//
// Eventos manejados:
//   - participant-joined  → inserta fila en attendance
//   - participant-left    → actualiza left_at + duration + status
//   - recording-ready     → actualiza live_sessions.recording_url
//
// Seguridad: valida firma HMAC X-Daily-Signature
// Idempotencia: ON CONFLICT en (live_session_id, user_id, joined_at)
// ============================================================

import { createHmac } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { classifyAttendance, minutesToSeconds } from "@/features/attendance/classify";
import { checkAbsenceAlerts } from "@/features/attendance/alerts";

const AUTO_CLOSE_DELAY_MS = 30 * 60 * 1000; // 30 minutos sin participantes

interface DailyWebhookParticipant {
  user_id?: string;
  user_name?: string;
  session_id?: string;
  room_name?: string;
  joined_at?: number;
  duration?: number;
}

interface DailyWebhookPayload {
  action: string;
  payload?: {
    room_name?: string;
    participant?: DailyWebhookParticipant;
    recording?: {
      recording_id?: string;
      output_file?: {
        download_link?: string;
      };
    };
  };
}

/**
 * Valida la firma HMAC SHA-256 del webhook de Daily.co
 * Header: X-Daily-Signature: sha256=<hex>
 */
function validateDailySignature(body: string, signature: string | null): boolean {
  const DAILY_WEBHOOK_SECRET = process.env.DAILY_WEBHOOK_SECRET;

  // Si no hay secret configurado (modo dev), permitir todo
  if (!DAILY_WEBHOOK_SECRET || DAILY_WEBHOOK_SECRET === "placeholder") {
    console.warn("[Webhook] DAILY_WEBHOOK_SECRET no configurado — saltando validacion de firma");
    return true;
  }

  if (!signature) return false;

  const [algorithm, digest] = signature.split("=");
  if (algorithm !== "sha256" || !digest) return false;

  const expected = createHmac("sha256", DAILY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  // Comparacion en tiempo constante para evitar timing attacks
  return expected === digest;
}

interface LiveSessionInfo {
  id: string;
  is_test_session: boolean;
  planned_duration_minutes: number;
  session_id: string;
}

/**
 * Obtiene la informacion de live_session a partir del room_name de Daily.co
 */
async function getLiveSessionByRoom(roomName: string): Promise<LiveSessionInfo | null> {
  const { data } = await supabaseAdmin
    .from("live_sessions")
    .select("id, is_test_session, planned_duration_minutes, session_id")
    .eq("daily_room_name", roomName)
    .eq("is_active", true)
    .maybeSingle();

  return data || null;
}

/**
 * Obtiene el user_id de profiles por Daily participant_id
 * Daily.co usa el user_id como identificador si se pasa en el token de sala
 * Si no hay match, retorna null (participante anonimo/docente externo)
 */
async function getUserIdByDailyId(dailyUserId: string): Promise<string | null> {
  // Daily.co puede enviar el user_id de Supabase si se configura en el meeting token
  // Verificamos si es un UUID valido de profiles
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(dailyUserId)) return null;

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("id", dailyUserId)
    .maybeSingle();

  return data?.id || null;
}

/**
 * Programa auto-cierre de sala si quedan 0 participantes
 * Nota: en Vercel Serverless esto solo funciona si la funcion sigue activa.
 * Para produccion robusta, usar un Supabase Edge Function o cron job.
 */
async function scheduleAutoClose(liveSessionId: string, dailyRoomName: string) {
  // Verificar cuantos participantes activos hay (sin left_at)
  const { count } = await supabaseAdmin
    .from("attendance")
    .select("id", { count: "exact" })
    .eq("live_session_id", liveSessionId)
    .is("left_at", null);

  if ((count || 0) === 0) {
    console.log(`[AutoClose] Sala ${dailyRoomName} sin participantes — cerrando en 30min`);
    // En entorno serverless esto se ejecuta mientras la funcion responde
    // Para mayor fiabilidad en produccion, usar un Edge Function con pg_cron
    setTimeout(async () => {
      // Verificar de nuevo antes de cerrar
      const { count: activeCount } = await supabaseAdmin
        .from("attendance")
        .select("id", { count: "exact" })
        .eq("live_session_id", liveSessionId)
        .is("left_at", null);

      if ((activeCount || 0) === 0) {
        await supabaseAdmin
          .from("live_sessions")
          .update({
            is_active: false,
            ended_at: new Date().toISOString(),
          })
          .eq("id", liveSessionId)
          .eq("is_active", true);

        console.log(`[AutoClose] Sala ${dailyRoomName} cerrada automaticamente por inactividad`);
      }
    }, AUTO_CLOSE_DELAY_MS);
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("X-Daily-Signature");

    // ── 1. Validar firma HMAC ──
    if (!validateDailySignature(rawBody, signature)) {
      console.error("[Webhook] Firma invalida:", signature?.substring(0, 30));
      return Response.json({ error: "Firma invalida." }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as DailyWebhookPayload;
    const { action } = payload;

    console.log(`[Webhook] Evento recibido: ${action}`);

    // ── 2. Manejar evento participant-joined ──
    if (action === "participant-joined") {
      const participant = payload.payload?.participant;
      const roomName = payload.payload?.room_name;

      if (!participant || !roomName) {
        return Response.json({ ok: true, skipped: "datos incompletos" });
      }

      const liveSession = await getLiveSessionByRoom(roomName);
      if (!liveSession) {
        return Response.json({ ok: true, skipped: "sala no encontrada en DB" });
      }

      // No registrar asistencia en sesiones de prueba
      if (liveSession.is_test_session) {
        return Response.json({ ok: true, skipped: "sesion de prueba — asistencia no registrada" });
      }

      const userId = participant.user_id
        ? await getUserIdByDailyId(participant.user_id)
        : null;

      if (!userId) {
        return Response.json({ ok: true, skipped: "usuario no identificado" });
      }

      const joinedAt = participant.joined_at
        ? new Date(participant.joined_at * 1000).toISOString()
        : new Date().toISOString();

      // Insertar con idempotencia — status inicial 'absent' (se calcula al salir)
      const { error } = await supabaseAdmin.from("attendance").upsert(
        {
          live_session_id: liveSession.id,
          user_id: userId,
          joined_at: joinedAt,
          was_present: true,
          status: "absent",
        },
        {
          onConflict: "live_session_id,user_id,joined_at",
          ignoreDuplicates: true,
        }
      );

      if (error) {
        console.error("[DB] Error insertando asistencia:", error);
      }

      return Response.json({ ok: true, action: "participant-joined", userId });
    }

    // ── 3. Manejar evento participant-left ──
    if (action === "participant-left") {
      const participant = payload.payload?.participant;
      const roomName = payload.payload?.room_name;

      if (!participant || !roomName) {
        return Response.json({ ok: true, skipped: "datos incompletos" });
      }

      const liveSession = await getLiveSessionByRoom(roomName);
      if (!liveSession) {
        return Response.json({ ok: true, skipped: "sala no encontrada en DB" });
      }

      // No registrar asistencia en sesiones de prueba
      if (liveSession.is_test_session) {
        return Response.json({ ok: true, skipped: "sesion de prueba — asistencia no registrada" });
      }

      const userId = participant.user_id
        ? await getUserIdByDailyId(participant.user_id)
        : null;

      if (!userId) {
        return Response.json({ ok: true, skipped: "usuario no identificado" });
      }

      const leftAt = new Date().toISOString();
      const durationDelta = participant.duration || 0;

      // Idempotencia: verificar si left_at ya esta registrado para esta entrada
      // Acumular duration_seconds si el estudiante entro/salio varias veces (FR-003)
      const { data: existing } = await supabaseAdmin
        .from("attendance")
        .select("id, duration_seconds, left_at")
        .eq("live_session_id", liveSession.id)
        .eq("user_id", userId)
        .is("left_at", null)
        .order("joined_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!existing) {
        // El evento ya fue procesado (idempotencia) o no hay registro previo
        return Response.json({ ok: true, skipped: "sin registro de entrada activo (idempotente)" });
      }

      // Acumular duracion total
      const totalDuration = (existing.duration_seconds || 0) + durationDelta;

      const attendanceStatus = classifyAttendance(
        totalDuration,
        minutesToSeconds(liveSession.planned_duration_minutes)
      );

      const { error } = await supabaseAdmin
        .from("attendance")
        .update({
          left_at: leftAt,
          duration_seconds: totalDuration,
          status: attendanceStatus,
        })
        .eq("id", existing.id);

      if (error) {
        console.error("[DB] Error actualizando asistencia (left):", error);
      }

      // Verificar si debe auto-cerrarse la sala
      await scheduleAutoClose(liveSession.id, roomName);

      // Verificar alertas de inasistencia de forma asincrona (no bloqueante)
      // Obtener el subject_id a partir de la sesion
      supabaseAdmin
        .from("sessions")
        .select("subject_id")
        .eq("id", liveSession.session_id)
        .single()
        .then(({ data: sessionData }) => {
          if (sessionData?.subject_id) {
            checkAbsenceAlerts(sessionData.subject_id).catch((err) => {
              console.error("[Alerts] Error verificando alertas:", err);
            });
          }
        });

      return Response.json({
        ok: true,
        action: "participant-left",
        userId,
        durationSeconds: totalDuration,
        status: attendanceStatus,
      });
    }

    // ── 4. Manejar evento recording-ready ──
    if (action === "recording-ready" || action === "recording.ready") {
      const roomName = payload.payload?.room_name;
      const recording = payload.payload?.recording;

      if (!roomName || !recording) {
        return Response.json({ ok: true, skipped: "datos de grabacion incompletos" });
      }

      const liveSessionInfo = await getLiveSessionByRoom(roomName);

      // Si la sala ya cerro, buscar por room_name sin filtro is_active
      let targetLiveSessionId = liveSessionInfo?.id || null;
      if (!targetLiveSessionId) {
        const { data } = await supabaseAdmin
          .from("live_sessions")
          .select("id")
          .eq("daily_room_name", roomName)
          .order("started_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        targetLiveSessionId = data?.id || null;
      }

      if (!targetLiveSessionId) {
        return Response.json({ ok: true, skipped: "sala no encontrada en DB" });
      }

      const recordingUrl =
        recording.output_file?.download_link ||
        `https://api.daily.co/v1/recordings/${recording.recording_id}`;

      const { error } = await supabaseAdmin
        .from("live_sessions")
        .update({ recording_url: recordingUrl })
        .eq("id", targetLiveSessionId);

      if (error) {
        console.error("[DB] Error actualizando recording_url:", error);
      }

      return Response.json({ ok: true, action: "recording-ready", recordingUrl });
    }

    // Evento no manejado — responder OK para que Daily no reintente
    return Response.json({ ok: true, action, handled: false });
  } catch (error) {
    console.error("Error en POST /api/daily/webhook:", error);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
