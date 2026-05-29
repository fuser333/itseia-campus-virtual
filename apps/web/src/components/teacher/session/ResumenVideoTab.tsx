"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, RefreshCw, Youtube, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface VideoSummary {
  session_id: string;
  video_url: string;
  resumen_md: string;
  generado_at: string;
  modelo: string;
}

interface Props {
  sessionId: string;
  canGenerate: boolean; // true si rol es coordinacion/admin/super_admin
}

export default function ResumenVideoTab({ sessionId, canGenerate }: Props) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<VideoSummary | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/teacher/video-summary?sessionId=${sessionId}`);
      const json = await res.json();
      if (res.ok) {
        setSummary(json.summary);
      } else {
        setError(json.error ?? "Error cargando resumen");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleGenerate = async (force: boolean) => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/teacher/video-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, force }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error generando resumen");
      setSummary(json.summary);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Youtube className="size-5 text-red-600" />
          <h3 className="text-base font-bold text-[#1F2F58]">Resumen del video con IA</h3>
        </div>
        {canGenerate && (
          <div className="flex gap-2">
            {!summary && (
              <button
                onClick={() => handleGenerate(false)}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1F2F58] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2A3F6E] disabled:opacity-50"
              >
                {generating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {generating ? "Generando…" : "Generar con Kimi"}
              </button>
            )}
            {summary && (
              <button
                onClick={() => handleGenerate(true)}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                {generating ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                Regenerar
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mr-2 inline size-4" />
          {error}
        </div>
      )}

      {!summary && !error && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
          {canGenerate ? (
            <>
              Aún no se ha generado un resumen del video. Click en{" "}
              <span className="font-semibold">Generar con Kimi</span> para crear uno (intenta
              extraer la transcripción del video y resumirla en hitos accionables).
            </>
          ) : (
            <>
              Aún no se ha generado un resumen. Pide a coordinación académica que lo genere.
            </>
          )}
        </div>
      )}

      {summary && (
        <>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Generado: {new Date(summary.generado_at).toLocaleString("es-EC")}</span>
            <span>·</span>
            <span>Modelo: {summary.modelo}</span>
          </div>
          <article className="prose prose-sm max-w-none rounded-xl border border-gray-200 bg-white p-5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary.resumen_md}</ReactMarkdown>
          </article>
        </>
      )}
    </div>
  );
}
