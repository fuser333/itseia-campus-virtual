"use client";

// ============================================================
// ITSEIA Academy — GrabacionesTab
// Pestaña de grabaciones YouTube para sesiones de carreras.
// Fuente de datos: tabla Supabase `recordings` (session_id UUID)
// Fallback: estado vacío elegante si no hay grabaciones.
// ============================================================

import { useState, useEffect } from "react";
import {
  Youtube,
  Clock,
  Calendar,
  Loader2,
  Play,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface Recording {
  id: string;
  session_id: string;
  youtube_url: string;
  youtube_id: string;
  title: string;
  description: string | null;
  duration_seconds: number | null;
  recorded_at: string | null;
  created_at: string;
}

export interface GrabacionesTabProps {
  /** UUID de la sesión en la tabla sessions */
  sessionId: string;
  className?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m > 0 ? `${m}min` : ""}`.trim();
  if (m > 0) return `${m}min ${s > 0 ? `${s}s` : ""}`.trim();
  return `${s}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Guayaquil",
  });
}

function youtubeThumb(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
}

function youtubeEmbed(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`;
}

/** Extrae el YouTube ID de cualquier formato de URL */
function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function GrabacionesTab({
  sessionId,
  className,
}: GrabacionesTabProps) {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from("recordings")
          .select("*")
          .eq("session_id", sessionId)
          .order("recorded_at", { ascending: false });

        if (!cancelled) {
          if (dbError) {
            // Si la tabla aún no existe (pre-migración), mostrar vacío sin error
            if (dbError.code === "42P01") {
              setRecordings([]);
            } else {
              console.warn("GrabacionesTab error:", dbError.message);
              setRecordings([]);
            }
          } else {
            const lista = (data ?? []).map((r) => ({
              ...r,
              // Normalizar: si youtube_id está vacío, intentar extraerlo de la URL
              youtube_id: r.youtube_id || extractYoutubeId(r.youtube_url) || "",
            }));
            setRecordings(lista);
            if (lista.length > 0 && lista[0]) {
              setActiveId(lista[0].id);
            }
          }
        }
      } catch {
        if (!cancelled) {
          setRecordings([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // ── Estado de carga ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2">
        <Loader2 className="size-5 animate-spin text-[#FBBC0C]" />
        <span className="text-sm text-[#F9F6E7]/60">Cargando grabaciones...</span>
      </div>
    );
  }

  // ── Estado vacío ──
  if (recordings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center px-4">
        <div className="flex size-16 items-center justify-center rounded-3xl bg-[#1F2F58]/50 border border-white/8 mb-5">
          <Youtube className="size-8 text-[#F9F6E7]/25" />
        </div>
        <h3 className="text-base font-semibold text-[#F9F6E7]">
          Aún no hay grabaciones
        </h3>
        <p className="mt-2 text-sm text-[#F9F6E7]/55 max-w-sm leading-relaxed">
          Las clases en vivo se graban y se publican aquí dentro de las 24 horas posteriores a cada sesión sincrónica.
        </p>
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-[#73B8E7]/20 bg-[#73B8E7]/8 px-4 py-2.5">
          <Youtube className="size-4 text-[#73B8E7]" />
          <span className="text-xs text-[#73B8E7]">
            Las grabaciones aparecerán automáticamente cuando estén listas
          </span>
        </div>
      </div>
    );
  }

  const activeRecording = recordings.find((r) => r.id === activeId) ?? recordings[0];

  return (
    <div className={cn("space-y-4", className)}>

      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <Youtube className="size-4 text-[#FBBC0C]" />
        <h3 className="text-sm font-semibold text-[#FBBC0C]">
          Grabaciones de clase
        </h3>
        <span className="rounded-full bg-[#FBBC0C]/15 px-2 py-0.5 text-[10px] font-semibold text-[#FBBC0C]">
          {recordings.length}
        </span>
      </div>

      {/* ── Reproductor activo ── */}
      {activeRecording && activeRecording.youtube_id && (
        <div className="overflow-hidden rounded-xl border border-[#1F2F58]/50 bg-[#0D1B30] shadow-xl shadow-black/30">
          {/* Header del reproductor */}
          <div className="flex items-center justify-between bg-[#1F2F58] px-4 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <Play className="size-3.5 text-[#FBBC0C] shrink-0" />
              <span className="text-sm font-semibold text-[#F9F6E7] truncate">
                {activeRecording.title}
              </span>
            </div>
            <a
              href={activeRecording.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#F9F6E7]/55 hover:text-[#FBBC0C] transition-colors shrink-0 ml-2"
            >
              <ExternalLink className="size-3" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
          </div>

          {/* iframe YouTube — 16:9 */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={youtubeEmbed(activeRecording.youtube_id)}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={activeRecording.title}
            />
          </div>

          {/* Descripción e info */}
          <div className="px-4 py-3 space-y-2 border-t border-[#1F2F58]/40">
            {activeRecording.description && (
              <p className="text-xs text-[#F9F6E7]/60 leading-relaxed">
                {activeRecording.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-[10px] text-[#F9F6E7]/35">
              {activeRecording.recorded_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formatDate(activeRecording.recorded_at)}
                </span>
              )}
              {activeRecording.duration_seconds && activeRecording.duration_seconds > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {formatDuration(activeRecording.duration_seconds)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Lista de grabaciones (cuando hay más de una) ── */}
      {recordings.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#F9F6E7]/40 px-1">
            Todas las grabaciones
          </h4>
          {recordings.map((rec) => {
            const isActive = rec.id === activeId;
            return (
              <button
                key={rec.id}
                onClick={() => setActiveId(rec.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                  isActive
                    ? "border-[#FBBC0C]/40 bg-[#FBBC0C]/8"
                    : "border-white/8 bg-[#1F2F58]/25 hover:border-white/15 hover:bg-[#1F2F58]/35"
                )}
              >
                {/* Thumbnail */}
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[#0D1B30]">
                  {rec.youtube_id ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={youtubeThumb(rec.youtube_id)}
                      alt={rec.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Youtube className="size-5 text-[#F9F6E7]/20" />
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#FBBC0C]/30">
                      <Play className="size-5 text-[#FBBC0C]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold truncate",
                      isActive ? "text-[#FBBC0C]" : "text-[#F9F6E7]"
                    )}
                  >
                    {rec.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-[#F9F6E7]/45">
                    {rec.recorded_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(rec.recorded_at)}
                      </span>
                    )}
                    {rec.duration_seconds && rec.duration_seconds > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatDuration(rec.duration_seconds)}
                      </span>
                    )}
                  </div>
                </div>

                {isActive && (
                  <span className="shrink-0 text-[10px] font-semibold text-[#FBBC0C] bg-[#FBBC0C]/15 rounded-full px-2 py-0.5">
                    Activa
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
