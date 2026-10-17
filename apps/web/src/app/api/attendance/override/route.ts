// ============================================================
// ITSEIA Academy — POST/PATCH /api/attendance/override
// Feature: 007-attendance-tracking
//
// Permite al docente/admin ajustar manualmente el status de
// un registro de asistencia con justificacion.
//
// POST  { live_session_id, user_id, status, override_reason } — crea registro
// PATCH { attendance_id, status, override_reason }             — actualiza existente
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AttendanceStatus } from "@/types/database";

const VALID_STATUSES: AttendanceStatus[] = ["present", "partial", "absent"];

/** PATCH: actualiza status e is_manual_override de un registro existente */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const allowedRoles = ["super_admin", "admin", "coordinacion", "docente"];
  if (!profile || !allowedRoles.includes(profile.role)) {
    return Response.json({ error: "Sin permiso." }, { status: 403 });
  }

  const body = await request.json() as {
    attendance_id?: string;
    status?: string;
    override_reason?: string;
    is_manual_override?: boolean;
  };

  if (!body.attendance_id || !body.status) {
    return Response.json({ error: "attendance_id y status son requeridos." }, { status: 400 });
  }

  if (!VALID_STATUSES.includes(body.status as AttendanceStatus)) {
    return Response.json({ error: "status invalido." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("attendance")
    .update({
      status: body.status,
      is_manual_override: body.is_manual_override ?? true,
      override_reason: body.override_reason || null,
    })
    .eq("id", body.attendance_id);

  if (error) {
    console.error("[API] Error actualizando override:", error);
    return Response.json({ error: "Error actualizando registro." }, { status: 500 });
  }

  return Response.json({ ok: true });
}

/** POST: crea un nuevo registro de asistencia con override manual */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const allowedRoles = ["super_admin", "admin", "coordinacion", "docente"];
  if (!profile || !allowedRoles.includes(profile.role)) {
    return Response.json({ error: "Sin permiso." }, { status: 403 });
  }

  const body = await request.json() as {
    live_session_id?: string;
    user_id?: string;
    status?: string;
    override_reason?: string;
    is_manual_override?: boolean;
  };

  if (!body.live_session_id || !body.user_id || !body.status) {
    return Response.json(
      { error: "live_session_id, user_id y status son requeridos." },
      { status: 400 }
    );
  }

  if (!VALID_STATUSES.includes(body.status as AttendanceStatus)) {
    return Response.json({ error: "status invalido." }, { status: 400 });
  }

  // Upsert: si ya hay un registro para esta sesion+usuario, actualizar
  const { data: existing } = await supabaseAdmin
    .from("attendance")
    .select("id")
    .eq("live_session_id", body.live_session_id)
    .eq("user_id", body.user_id)
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseAdmin
      .from("attendance")
      .update({
        status: body.status,
        is_manual_override: body.is_manual_override ?? true,
        override_reason: body.override_reason || null,
      })
      .eq("id", existing.id);

    if (error) {
      console.error("[API] Error actualizando override (upsert):", error);
      return Response.json({ error: "Error actualizando registro." }, { status: 500 });
    }
    return Response.json({ ok: true, updated: true });
  }

  // Crear nuevo registro manual
  const { error } = await supabaseAdmin.from("attendance").insert({
    live_session_id: body.live_session_id,
    user_id: body.user_id,
    joined_at: new Date().toISOString(),
    was_present: body.status !== "absent",
    status: body.status,
    is_manual_override: body.is_manual_override ?? true,
    override_reason: body.override_reason || null,
  });

  if (error) {
    console.error("[API] Error insertando override:", error);
    return Response.json({ error: "Error creando registro." }, { status: 500 });
  }

  return Response.json({ ok: true, created: true });
}
