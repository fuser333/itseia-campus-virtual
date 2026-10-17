"use client";

import { useEffect, useState } from "react";
import { Loader2, Target, BookOpen, Brain, Workflow, AlertCircle } from "lucide-react";

interface BloomObjective {
  nivel: string;
  verbo: string;
  descripcion: string;
}

interface SecuenciaFase {
  fase: string;
  que_hace_docente: string;
  que_hace_alumno: string;
}

interface Metodologia {
  modalidad_optima?: string;
  razon?: string;
  secuencia?: SecuenciaFase[];
  carga_cognitiva?: string;
  kolb_ciclo?: string[];
}

interface TeachingMeta {
  proposito: string;
  objetivos_bloom: BloomObjective[];
  habilidades: string[];
  metodologia: Metodologia;
  transferencia_real?: string;
  fuentes: string[];
}

interface Props {
  sessionId: string;
}

export default function PropositoMetodologiaTab({ sessionId }: Props) {
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<TeachingMeta | null>(null);
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
          setError(json.error ?? "Error cargando metodología");
        } else {
          setMeta(json.meta);
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

  if (!meta) {
    return (
      <div className="rounded-lg border border-white/20 bg-[#0A1628]/60 p-6 text-center text-sm text-white/65">
        Esta sesión todavía no tiene metadatos pedagógicos cargados.
        <br />
        Coordinación académica los seedeará desde <code className="text-xs">METODOLOGIA_POR_SESION.json</code>.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Propósito */}
      <section className="rounded-xl border border-[#73B8E7]/30 bg-gradient-to-br from-[#73B8E7]/5 to-transparent p-5">
        <div className="mb-2 flex items-center gap-2">
          <Target className="size-5 text-[#73B8E7]" />
          <h3 className="text-base font-bold text-[#73B8E7]">Propósito pedagógico</h3>
        </div>
        <p className="text-sm leading-relaxed text-white/85">{meta.proposito}</p>
      </section>

      {/* Objetivos Bloom */}
      {meta.objetivos_bloom?.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="size-5 text-[#73B8E7]" />
            <h3 className="text-base font-bold text-[#73B8E7]">Objetivos de aprendizaje (Bloom)</h3>
          </div>
          <ul className="space-y-2">
            {meta.objetivos_bloom.map((o, i) => (
              <li key={i} className="rounded-lg border border-white/20 bg-[#0A1628]/80 p-3">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-[#FBBC0C]/20 px-2 py-0.5 font-semibold text-[#73B8E7]">
                    {o.nivel}
                  </span>
                  <span className="font-mono text-white/65">{o.verbo}</span>
                </div>
                <p className="text-sm text-white/85">{o.descripcion}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Habilidades */}
      {meta.habilidades?.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Brain className="size-5 text-[#73B8E7]" />
            <h3 className="text-base font-bold text-[#73B8E7]">Habilidades que se desarrollan</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {meta.habilidades.map((h, i) => (
              <span
                key={i}
                className="rounded-full border border-[#73B8E7]/40 bg-[#0A1628]/80 px-3 py-1 text-xs font-medium text-[#73B8E7]"
              >
                {h}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Metodología */}
      {meta.metodologia?.modalidad_optima && (
        <section className="rounded-xl border-2 border-[#FBBC0C]/40 bg-[#FBBC0C]/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Workflow className="size-5 text-[#73B8E7]" />
            <h3 className="text-base font-bold text-[#73B8E7]">Metodología recomendada</h3>
          </div>
          <p className="mb-2 text-sm font-semibold text-white">
            {meta.metodologia.modalidad_optima}
          </p>
          {meta.metodologia.razon && (
            <p className="mb-4 text-xs italic leading-relaxed text-white/75">
              {meta.metodologia.razon}
            </p>
          )}

          {meta.metodologia.secuencia && meta.metodologia.secuencia.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#73B8E7]">
                Secuencia paso a paso (30 min)
              </h4>
              {meta.metodologia.secuencia.map((f, i) => (
                <div key={i} className="rounded-lg border border-white/20 bg-[#0A1628]/80 p-3">
                  <div className="mb-2 font-semibold text-sm text-[#73B8E7]">{f.fase}</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-[#73B8E7]">Docente</div>
                      <p className="text-xs text-white/85">{f.que_hace_docente}</p>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-[#FBBC0C]">Alumno</div>
                      <p className="text-xs text-white/85">{f.que_hace_alumno}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {meta.metodologia.carga_cognitiva && (
            <div className="mt-4 rounded-md bg-[#0A1628]/80/50 p-3 text-xs">
              <span className="font-semibold text-[#73B8E7]">Carga cognitiva:</span>{" "}
              <span className="text-white/85">{meta.metodologia.carga_cognitiva}</span>
            </div>
          )}

          {meta.metodologia.kolb_ciclo && meta.metodologia.kolb_ciclo.length > 0 && (
            <div className="mt-3 rounded-md bg-[#0A1628]/80/50 p-3">
              <div className="mb-2 text-xs font-semibold text-[#73B8E7]">Ciclo de Kolb</div>
              <ol className="ml-4 list-decimal space-y-1 text-xs text-white/85">
                {meta.metodologia.kolb_ciclo.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}

      {/* Transferencia real */}
      {meta.transferencia_real && (
        <section className="rounded-xl border border-[#F0846D]/30 bg-[#F0846D]/5 p-5">
          <h3 className="mb-2 text-base font-bold text-[#73B8E7]">Transferencia a la vida real</h3>
          <p className="text-sm leading-relaxed text-white/85">{meta.transferencia_real}</p>
        </section>
      )}

      {/* Fuentes */}
      {meta.fuentes?.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white/65">
            Fuentes citadas
          </h3>
          <ul className="space-y-1 text-xs text-white/75">
            {meta.fuentes.map((f, i) => (
              <li key={i} className="border-l-2 border-white/20 pl-2">{f}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
