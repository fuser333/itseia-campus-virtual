"use client";

// ============================================================
// ITSEIA Academy — RecordingPlayer
// Muestra la grabacion de una clase sincronica despues de terminar
// Soporta URLs de Daily.co y cualquier URL de video embebible
// ============================================================

import { useState } from "react";
import { MonitorPlay, Clock, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LiveSession } from "@/types/database";

interface RecordingPlayerProps {
  pastSessions: Array<
    Pick<LiveSession, "id" | "started_at" | "ended_at" | "recording_url" | "planned_duration_minutes">
  >;
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-EC", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Guayaquil",
  });
}

function formatDuration(startedAt: string, endedAt: string | null): string {
  if (!endedAt) return "—";
  const diffMs = new Date(endedAt).getTime() - new Date(startedAt).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) return `${hours}h ${mins}min`;
  return `${mins}min`;
}

export default function RecordingPlayer({ pastSessions }: RecordingPlayerProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    // Auto-seleccionar la mas reciente con grabacion
    pastSessions.find((s) => s.recording_url)?.id || null
  );
  const [showAll, setShowAll] = useState(false);

  const sessionsWithRecording = pastSessions.filter((s) => s.recording_url);
  const sessionsWithoutRecording = pastSessions.filter((s) => !s.recording_url);

  const selectedSession = pastSessions.find((s) => s.id === selectedSessionId);

  if (pastSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#1F2F58]/15 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#1F2F58]/5">
          <MonitorPlay className="size-7 text-[#1F2F58]/30" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#1F2F58]/60">
            Sin grabaciones disponibles
          </p>
          <p className="mt-1 text-xs text-[#1F2F58]/40">
            Las grabaciones apareceran aqui despues de cada clase sincronica.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Lista de sesiones grabadas */}
      <div className="space-y-2">
        {sessionsWithRecording.map((session) => (
          <button
            key={session.id}
            onClick={() =>
              setSelectedSessionId(
                selectedSessionId === session.id ? null : session.id
              )
            }
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
              selectedSessionId === session.id
                ? "border-[#FBBC0C] bg-[#FBBC0C]/5"
                : "border-[#1F2F58]/10 bg-white hover:border-[#1F2F58]/20 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                  selectedSessionId === session.id
                    ? "bg-[#FBBC0C]/20"
                    : "bg-[#1F2F58]/5"
                }`}
              >
                <MonitorPlay
                  className={`size-4 ${
                    selectedSessionId === session.id
                      ? "text-[#FBBC0C]"
                      : "text-[#1F2F58]/40"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F2F58]">
                  {formatDateTime(session.started_at)}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#1F2F58]/50">
                  <Clock className="size-3" />
                  <span>{formatDuration(session.started_at, session.ended_at)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Grabacion lista
              </span>
            </div>
          </button>
        ))}

        {/* Sesiones sin grabacion (plegadas) */}
        {sessionsWithoutRecording.length > 0 && (
          <div>
            <button
              onClick={() => setShowAll((v) => !v)}
              className="flex w-full items-center gap-2 py-1 text-xs text-[#1F2F58]/40 hover:text-[#1F2F58]/60"
            >
              {showAll ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
              {showAll ? "Ocultar" : "Ver"} {sessionsWithoutRecording.length} sesion
              {sessionsWithoutRecording.length !== 1 ? "es" : ""} sin grabacion disponible
            </button>

            {showAll &&
              sessionsWithoutRecording.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/5 bg-gray-50 px-4 py-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <MonitorPlay className="size-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-[#1F2F58]/50">
                      {formatDateTime(session.started_at)}
                    </p>
                    <p className="text-xs text-[#1F2F58]/30">
                      Grabacion procesando o no disponible
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Reproductor embebido */}
      {selectedSession?.recording_url && (
        <div className="overflow-hidden rounded-xl border border-[#1F2F58]/10 bg-[#0A1628]">
          {/* Header del reproductor */}
          <div className="flex items-center justify-between bg-[#1F2F58] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <MonitorPlay className="size-4 text-[#FBBC0C]" />
              <span className="text-sm font-medium text-white">
                Clase del {formatDateTime(selectedSession.started_at)}
              </span>
            </div>
            <a
              href={selectedSession.recording_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <ExternalLink className="size-3.5" />
                <span className="hidden sm:inline">Abrir en nueva pestana</span>
              </Button>
            </a>
          </div>

          {/* Video */}
          <div className="relative w-full" style={{ minHeight: "400px", aspectRatio: "16/9" }}>
            {/* Daily.co genera URLs que se pueden usar en video tag o iframe */}
            {selectedSession.recording_url.startsWith("https://api.daily.co") ? (
              // URL de API de Daily.co: abrir en nueva pestana
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                <MonitorPlay className="size-12 text-[#73B8E7]" />
                <p className="text-center text-sm text-white/60">
                  La grabacion esta disponible en el servidor de Daily.co.
                </p>
                <a
                  href={selectedSession.recording_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-4 py-2 text-sm font-semibold text-[#1F2F58] hover:bg-[#FBBC0C]/90"
                >
                  <ExternalLink className="size-4" />
                  Ver Grabacion
                </a>
              </div>
            ) : (
              // URL directa de video (mp4, etc.)
              <video
                src={selectedSession.recording_url}
                controls
                className="absolute inset-0 size-full"
                title="Grabacion de clase"
              >
                <track kind="captions" />
                Tu navegador no soporta la reproduccion de video.
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
