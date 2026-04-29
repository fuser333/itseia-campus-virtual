"use client";

// ============================================================
// ITSEIA Academy — JoinClassButton
// Botón contextual para clases sincrónicas
//
// Estados según rol y estado de sala:
//   Docente + sin sala activa   → "Iniciar Clase"
//   Docente + sala activa       → "Unirse" + "Terminar Clase"
//   Estudiante + sala activa    → "Unirse a Clase"
//   Sala terminada con grab.    → "Ver Grabación"
//   No matriculado              → mensaje de restricción
// ============================================================

import { useState } from "react";
import { Video, PlayCircle, StopCircle, MonitorPlay, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LiveSession } from "@/types/database";

interface JoinClassButtonProps {
  sessionId: string;
  userRole: "docente" | "estudiante" | "admin" | "coordinacion" | null;
  isEnrolled: boolean;
  activeLiveSession: LiveSession | null;
  lastRecordingUrl?: string | null;
  onRoomCreated?: (liveSession: LiveSession) => void;
  onRoomEnded?: () => void;
  onJoin?: (roomUrl: string) => void;
}

export default function JoinClassButton({
  sessionId,
  userRole,
  isEnrolled,
  activeLiveSession,
  lastRecordingUrl,
  onRoomCreated,
  onRoomEnded,
  onJoin,
}: JoinClassButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTeacher = userRole === "docente" || userRole === "admin" || userRole === "coordinacion";
  const canAccess = isTeacher || isEnrolled;

  // ── Handler: Iniciar clase ──
  async function handleStartClass() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/daily/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, plannedDurationMinutes: 90 }),
      });

      const data = await res.json() as { liveSession?: LiveSession; error?: string };

      if (!res.ok) {
        setError(data.error || "Error al crear la sala.");
        return;
      }

      if (data.liveSession) {
        onRoomCreated?.(data.liveSession);
        onJoin?.(data.liveSession.daily_room_url);
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // ── Handler: Terminar clase ──
  async function handleEndClass() {
    if (!activeLiveSession) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/daily/end-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liveSessionId: activeLiveSession.id }),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setError(data.error || "Error al terminar la sala.");
        return;
      }

      onRoomEnded?.();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // ── Handler: Unirse a sala ──
  function handleJoin() {
    if (activeLiveSession) {
      onJoin?.(activeLiveSession.daily_room_url);
    }
  }

  // ── Sin acceso ──
  if (!canAccess) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-[#F9F6E7]/10 bg-[#1F2F58]/30 px-4 py-3">
        <Lock className="size-4 shrink-0 text-[#F9F6E7]/40" />
        <p className="text-sm text-[#F9F6E7]/60">
          Debes estar matriculado para acceder a las clases sincrónicas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Error message */}
      {error && (
        <p className="rounded-lg bg-[#F0846D]/10 border border-[#F0846D]/30 px-3 py-2 text-sm text-[#F0846D]">
          {error}
        </p>
      )}

      {/* Sala activa */}
      {activeLiveSession && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Badge "En vivo" */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-xs font-semibold text-red-400">
            <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
            Clase en vivo
          </span>

          {/* Botón Unirse */}
          <Button
            onClick={handleJoin}
            disabled={loading}
            className="gap-2 bg-[#FBBC0C] text-[#0A1628] font-semibold hover:bg-[#FBBC0C]/90 shadow-md shadow-[#FBBC0C]/20"
          >
            <Video className="size-4" />
            Unirse a la Clase
          </Button>

          {/* Botón Terminar (solo docente) */}
          {isTeacher && (
            <Button
              onClick={handleEndClass}
              disabled={loading}
              variant="outline"
              className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <StopCircle className="size-4" />
              )}
              Terminar Clase
            </Button>
          )}
        </div>
      )}

      {/* Sin sala activa */}
      {!activeLiveSession && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Docente: botón iniciar */}
          {isTeacher && (
            <Button
              onClick={handleStartClass}
              disabled={loading}
              className="gap-2 bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold shadow-md shadow-[#FBBC0C]/20"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <PlayCircle className="size-4" />
              )}
              {loading ? "Creando sala..." : "Iniciar Clase Sincrónica"}
            </Button>
          )}

          {/* Estudiante: mensaje de espera */}
          {!isTeacher && (
            <div className="flex items-center gap-2 rounded-lg border border-[#73B8E7]/25 bg-[#73B8E7]/10 px-4 py-2.5">
              <Video className="size-4 shrink-0 text-[#73B8E7]" />
              <p className="text-sm text-[#F9F6E7]/70">
                La clase sincrónica aún no ha comenzado. El docente la iniciará cuando sea el momento.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Grabación disponible */}
      {lastRecordingUrl && (
        <div className="flex items-center gap-2">
          <a
            href={lastRecordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/50 bg-[#1F2F58]/30 px-3 py-2 text-sm font-medium text-[#F9F6E7] transition-colors hover:bg-[#1F2F58]/50 hover:border-[#73B8E7]/30"
          >
            <MonitorPlay className="size-4 text-[#73B8E7]" />
            Ver grabación de clase anterior
          </a>
        </div>
      )}
    </div>
  );
}
