"use client";

// ============================================================
// ITSEIA Academy — LiveClassPanel
// Panel completo de clase sincronica para la pagina de sesion
// Orquesta: JoinClassButton + LiveClassRoom + RecordingPlayer
// Carga datos de /api/sessions/[id]/live y refresca en polling
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { Loader2, Video } from "lucide-react";
import JoinClassButton from "@/components/session/JoinClassButton";
import LiveClassRoom from "@/components/session/LiveClassRoom";
import RecordingPlayer from "@/components/session/RecordingPlayer";
import type { LiveSession } from "@/types/database";
import type { UserRole } from "@/types/database";

interface LiveSessionHistory {
  id: string;
  started_at: string;
  ended_at: string | null;
  recording_url: string | null;
  planned_duration_minutes: number;
}

interface LiveClassPanelProps {
  sessionId: string;
  subjectName: string;
  teacherName?: string;
  userRole: UserRole | null;
  isEnrolled: boolean;
}

const POLLING_INTERVAL_MS = 15000; // 15 segundos

export default function LiveClassPanel({
  sessionId,
  subjectName,
  teacherName,
  userRole,
  isEnrolled,
}: LiveClassPanelProps) {
  const [loading, setLoading] = useState(true);
  const [activeLiveSession, setActiveLiveSession] = useState<LiveSession | null>(null);
  const [history, setHistory] = useState<LiveSessionHistory[]>([]);
  const [showRoom, setShowRoom] = useState(false);

  const normalizedRole =
    userRole === "docente" ||
    userRole === "admin" ||
    userRole === "coordinacion" ||
    userRole === "super_admin"
      ? (userRole === "super_admin" ? "admin" : userRole)
      : userRole === "estudiante"
      ? "estudiante"
      : null;

  // ── Cargar estado de sala ──
  const fetchLiveState = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/live`);
      if (!res.ok) return;

      const data = await res.json() as {
        active: LiveSession | null;
        history: LiveSessionHistory[];
      };

      setActiveLiveSession(data.active);
      setHistory(data.history);

      // Si ya no hay sala activa, cerrar el iframe
      if (!data.active) {
        setShowRoom(false);
      }
    } catch {
      // Silently fail on polling
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchLiveState();

    // Polling mientras el componente esta montado
    const interval = setInterval(fetchLiveState, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchLiveState]);

  // ── Callbacks ──
  function handleRoomCreated(liveSession: LiveSession) {
    setActiveLiveSession(liveSession);
    setShowRoom(true);
  }

  function handleRoomEnded() {
    setActiveLiveSession(null);
    setShowRoom(false);
    // Refrescar historial despues de un momento (recording puede tardar)
    setTimeout(fetchLiveState, 3000);
  }

  function handleJoin(roomUrl: string) {
    // Verificar que la URL es valida antes de mostrar el iframe
    if (roomUrl) {
      setShowRoom(true);
    }
  }

  function handleLeave() {
    setShowRoom(false);
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center gap-2 text-[#1F2F58]/40">
        <Loader2 className="size-5 animate-spin" />
        <span className="text-sm">Verificando estado de la clase...</span>
      </div>
    );
  }

  const lastRecording = history.find((s) => s.recording_url)?.recording_url;

  return (
    <div className="space-y-6">
      {/* ── Sala activa embebida ── */}
      {activeLiveSession && showRoom ? (
        <LiveClassRoom
          liveSession={activeLiveSession}
          subjectName={subjectName}
          teacherName={teacherName}
          userRole={normalizedRole as "docente" | "estudiante" | "admin" | "coordinacion" | null}
          onLeave={handleLeave}
          onEnded={handleRoomEnded}
        />
      ) : (
        <>
          {/* ── Header del panel ── */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#1F2F58]/8">
              <Video className="size-5 text-[#1F2F58]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1F2F58]">
                Clase Sincronica
              </h3>
              <p className="text-xs text-[#1F2F58]/50">
                {activeLiveSession
                  ? "Clase en progreso — conéctate ahora"
                  : "Videoconferencia en tiempo real con tu docente"}
              </p>
            </div>
          </div>

          {/* ── Boton de accion ── */}
          <JoinClassButton
            sessionId={sessionId}
            userRole={normalizedRole as "docente" | "estudiante" | "admin" | "coordinacion" | null}
            isEnrolled={isEnrolled}
            activeLiveSession={activeLiveSession}
            lastRecordingUrl={lastRecording}
            onRoomCreated={handleRoomCreated}
            onRoomEnded={handleRoomEnded}
            onJoin={handleJoin}
          />
        </>
      )}

      {/* ── Grabaciones anteriores ── */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[#1F2F58]">
            Grabaciones de clases anteriores
          </h4>
          <RecordingPlayer pastSessions={history} />
        </div>
      )}

      {/* Estado sin sala y sin historial para estudiante */}
      {!activeLiveSession && history.length === 0 && normalizedRole === "estudiante" && (
        <div className="rounded-xl border border-[#73B8E7]/20 bg-[#73B8E7]/5 px-4 py-6 text-center">
          <Video className="mx-auto mb-3 size-8 text-[#73B8E7]/50" />
          <p className="text-sm text-[#1F2F58]/60">
            Aun no se han realizado clases sincronicas para esta sesion.
          </p>
          <p className="mt-1 text-xs text-[#1F2F58]/40">
            Las clases programadas y grabaciones apareceran aqui automaticamente.
          </p>
        </div>
      )}
    </div>
  );
}
