"use client";

// ============================================================
// ITSEIA Academy — LiveClassRoom
// Iframe Daily.co embebido con controles de sesion
//
// - Muestra iframe responsive (min 480px) con la sala activa
// - Controles: nombre de materia, docente, duracion transcurrida
// - Boton "Salir" para estudiante (sale del iframe, no termina sala)
// - Boton "Terminar Clase" para docente (cierra sala para todos)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { X, StopCircle, Clock, Video, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LiveSession } from "@/types/database";

interface LiveClassRoomProps {
  liveSession: LiveSession;
  subjectName: string;
  teacherName?: string;
  userRole: "docente" | "estudiante" | "admin" | "coordinacion" | null;
  onLeave?: () => void;
  onEnded?: () => void;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function LiveClassRoom({
  liveSession,
  subjectName,
  teacherName,
  userRole,
  onLeave,
  onEnded,
}: LiveClassRoomProps) {
  const [elapsed, setElapsed] = useState(0);
  const [ending, setEnding] = useState(false);
  const [endError, setEndError] = useState<string | null>(null);

  const isTeacher =
    userRole === "docente" || userRole === "admin" || userRole === "coordinacion";

  // ── Cronometro de duracion ──
  useEffect(() => {
    const startTime = new Date(liveSession.started_at).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      setElapsed(Math.floor((now - startTime) / 1000));
    }, 1000);

    // Valor inicial inmediato
    setElapsed(Math.floor((Date.now() - startTime) / 1000));

    return () => clearInterval(interval);
  }, [liveSession.started_at]);

  // ── Terminar clase (docente) ──
  const handleEndClass = useCallback(async () => {
    setEnding(true);
    setEndError(null);

    try {
      const res = await fetch("/api/daily/end-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liveSessionId: liveSession.id }),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setEndError(data.error || "Error al terminar la clase.");
        setEnding(false);
        return;
      }

      onEnded?.();
    } catch {
      setEndError("Error de conexion. Intenta de nuevo.");
      setEnding(false);
    }
  }, [liveSession.id, onEnded]);

  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-[#1F2F58]/10 bg-[#0A1628] shadow-2xl">
      {/* ── Barra de controles superior ── */}
      <div className="flex items-center justify-between bg-[#1F2F58] px-4 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Indicador en vivo */}
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-400">
            <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
            EN VIVO
          </span>

          {/* Info de la clase */}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {subjectName}
            </p>
            {teacherName && (
              <p className="truncate text-xs text-[#73B8E7]">{teacherName}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Cronometro */}
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
            <Clock className="size-3.5 text-[#73B8E7]" />
            <span className="font-mono text-xs font-medium text-white">
              {formatDuration(elapsed)}
            </span>
          </div>

          {/* Boton salir (estudiante) */}
          {!isTeacher && (
            <Button
              onClick={onLeave}
              size="sm"
              variant="ghost"
              className="gap-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          )}

          {/* Boton terminar (docente) */}
          {isTeacher && (
            <Button
              onClick={handleEndClass}
              disabled={ending}
              size="sm"
              className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
            >
              {ending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <StopCircle className="size-4" />
              )}
              <span className="hidden sm:inline">
                {ending ? "Terminando..." : "Terminar Clase"}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Error al terminar ── */}
      {endError && (
        <div className="flex items-center gap-2 bg-red-900/50 px-4 py-2">
          <AlertCircle className="size-4 shrink-0 text-red-400" />
          <p className="text-xs text-red-300">{endError}</p>
        </div>
      )}

      {/* ── Iframe de Daily.co ── */}
      <div className="relative w-full" style={{ minHeight: "480px", height: "60vh" }}>
        <iframe
          src={liveSession.daily_room_url}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          allowFullScreen
          title={`Clase en vivo: ${subjectName}`}
          className="absolute inset-0 size-full border-0"
        />

        {/* Overlay de carga mientras el iframe inicia */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0A1628] transition-opacity duration-500"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#1F2F58]">
            <Video className="size-8 text-[#FBBC0C]" />
          </div>
          <p className="text-sm text-white/60">Conectando a la sala...</p>
        </div>
      </div>

      {/* ── Nota inferior ── */}
      <div className="bg-[#1F2F58]/80 px-4 py-2 text-center">
        <p className="text-xs text-white/40">
          Esta sesion esta siendo grabada automaticamente para cumplimiento CES.
        </p>
      </div>
    </div>
  );
}
