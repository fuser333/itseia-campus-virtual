'use client';

/**
 * Tab "Prompts" · Docente · Campus v2 (FASE 3 · stub).
 *
 * Banco de prompts IA que se usan en la sesión.
 * FASE 5: librería compartida + import/export + categorías.
 */

import { Sparkles, Copy } from 'lucide-react';
import StubCard from './_StubCard';
import type { TabDocenteProps } from './types';

const PROMPTS_EJEMPLO = [
  {
    titulo: 'Análisis exploratorio rápido',
    contenido:
      'Eres un analista de datos senior. Dado el dataset adjunto, identifica las 3 anomalías más importantes y explica cómo investigarlas.',
  },
  {
    titulo: 'Code review pedagógico',
    contenido:
      'Revisa el código del alumno y devuelve 3 sugerencias: 1) Bug crítico, 2) Mejora de estilo, 3) Concepto avanzado para profundizar.',
  },
];

export default function PromptsTab(_props: TabDocenteProps) {
  void _props; // FASE 3 stub: props se usan en FASE 5.
  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl border p-4"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
          <Sparkles className="h-3 w-3" />
          Prompts de la sesión (ejemplo)
        </div>
        <ul className="mt-3 space-y-3">
          {PROMPTS_EJEMPLO.map((p) => (
            <li
              key={p.titulo}
              className="rounded-lg border p-3"
              style={{
                borderColor: 'var(--sidebar-border)',
                backgroundColor: 'rgba(255,255,255,0.02)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold">{p.titulo}</h4>
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed opacity-50"
                  title="Copiar (próximamente)"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1 text-xs opacity-70 leading-relaxed">
                {p.contenido}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <StubCard
        title="Banco de prompts"
        description="Librería de prompts categorizada (exploración, code review, debate socrático, etc.). Reusable entre cohortes. Versionado. Métricas de uso por prompt."
      />
    </div>
  );
}
