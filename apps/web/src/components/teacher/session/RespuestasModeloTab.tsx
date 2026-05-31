"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertTriangle, MessageCircle, AlertCircle } from "lucide-react";

interface EjercicioModelo {
  enunciado: string;
  respuesta_modelo: string;
  criterio_evaluacion?: string;
}

interface TeachingMeta {
  ejercicio_modelo: EjercicioModelo | null;
  errores_tipicos: string[] | null;
  intervencion_docente: string | null;
}

interface Props {
  sessionId: string;
}

export default function RespuestasModeloTab({ sessionId }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TeachingMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/teacher/teaching-meta/${sessionId}`);
        const json = await res.json();
        if (!alive) return;
        if (!res.ok) {
          setError(json.error ?? "Error cargando respuestas");
        } else if (json.meta) {
          setData({
            ejercicio_modelo: json.meta.ejercicio_modelo ?? null,
            errores_tipicos: json.meta.errores_tipicos ?? null,
            intervencion_docente: json.meta.intervencion_docente ?? null,
          });
        }
      } catch (e) {
        if (alive) setError((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="mr-2 inline size-4" />
        {error}
      </div>
    );
  }

  const hasContent = data?.ejercicio_modelo || data?.errores_tipicos?.length;

  if (!hasContent) {
    return (
      <div className="rounded-lg border border-white/20 bg-[#0A1628]/60 p-6 text-center text-sm text-white/65">
        Esta sesión no tiene respuestas modelo cargadas todavía.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data?.ejercicio_modelo && (
        <>
          <section className="rounded-xl border border-white/20 bg-[#0A1628]/80 p-5">
            <h3 className="mb-2 text-base font-bold text-[#73B8E7]">Enunciado del ejercicio</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
              {data.ejercicio_modelo.enunciado}
            </p>
          </section>

          <section className="rounded-xl border-2 border-green-300 bg-green-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-700" />
              <h3 className="text-base font-bold text-green-900">Respuesta modelo</h3>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white">
              {data.ejercicio_modelo.respuesta_modelo}
            </p>
          </section>

          {data.ejercicio_modelo.criterio_evaluacion && (
            <section className="rounded-xl border border-[#FBBC0C]/40 bg-[#FBBC0C]/10 p-5">
              <h3 className="mb-2 text-base font-bold text-[#73B8E7]">Criterio de evaluación</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-white">
                {data.ejercicio_modelo.criterio_evaluacion}
              </p>
            </section>
          )}
        </>
      )}

      {data?.errores_tipicos && data.errores_tipicos.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-600" />
            <h3 className="text-base font-bold text-[#73B8E7]">Errores típicos del alumno</h3>
          </div>
          <ul className="space-y-2">
            {data.errores_tipicos.map((e, i) => (
              <li key={i} className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-white/85">
                {e}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data?.intervencion_docente && (
        <section className="rounded-xl border border-[#73B8E7]/30 bg-[#73B8E7]/5 p-5">
          <div className="mb-2 flex items-center gap-2">
            <MessageCircle className="size-5 text-[#73B8E7]" />
            <h3 className="text-base font-bold text-[#73B8E7]">Intervención docente recomendada</h3>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
            {data.intervencion_docente}
          </p>
        </section>
      )}
    </div>
  );
}
