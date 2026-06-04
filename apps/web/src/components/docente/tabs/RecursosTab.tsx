'use client';

/**
 * Tab "Recursos extra" · Docente · Campus v2 (FASE 3 · stub).
 *
 * Lecturas avanzadas, papers, links útiles que NO son material obligatorio
 * para el alumno pero que el docente quiere tener a mano.
 */

import { BookOpen, ExternalLink } from 'lucide-react';
import StubCard from './_StubCard';
import type { TabDocenteProps } from './types';

const RECURSOS_EJEMPLO = [
  {
    titulo: 'The Anthropic Cookbook (GitHub)',
    url: 'https://github.com/anthropics/anthropic-cookbook',
    tipo: 'Repositorio',
  },
  {
    titulo: 'OpenAI API best practices',
    url: 'https://platform.openai.com/docs/guides/production-best-practices',
    tipo: 'Guía oficial',
  },
];

export default function RecursosTab(_props: TabDocenteProps) {
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
          <BookOpen className="h-3 w-3" />
          Recursos sugeridos (ejemplo)
        </div>
        <ul className="mt-3 space-y-2">
          {RECURSOS_EJEMPLO.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-lg border p-3 transition hover:bg-white/5"
                style={{
                  borderColor: 'var(--sidebar-border)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
              >
                <div>
                  <div className="text-sm font-semibold">{r.titulo}</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-60">
                    {r.tipo}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 opacity-60" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <StubCard
        title="Editor de recursos extra"
        description="Catálogo de papers, videos, repos. Tags por nivel. Solo visibles al docente y opcionalmente publicables al alumno como ‘profundizar’."
      />
    </div>
  );
}
