'use client';

/**
 * Tab "Evaluación (editar)" · Docente · Campus v2 (FASE 3 · stub).
 *
 * En FASE 5: editor de quiz (opción múltiple, V/F, completar) con auto-grading.
 */

import { Plus, CheckSquare } from 'lucide-react';
import StubCard from './_StubCard';
import type { TabDocenteProps } from './types';

export default function EvaluacionEditarTab(_props: TabDocenteProps) {
  void _props; // FASE 3 stub: props se usan en FASE 5.
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold">Quiz de la sesión</h3>
        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold opacity-60"
          style={{
            backgroundColor: 'var(--itseia-gold)',
            color: 'var(--itseia-navy-dark)',
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Nueva pregunta
        </button>
      </div>

      <div
        className="rounded-xl border border-dashed p-6 text-center"
        style={{ borderColor: 'rgba(255,255,255,0.20)' }}
      >
        <CheckSquare className="mx-auto h-8 w-8 opacity-40" />
        <p className="mt-2 text-sm opacity-75">
          Esta sesión aún no tiene quiz configurado.
        </p>
      </div>

      <StubCard
        title="Editor de quiz / autoevaluación"
        description="Opción múltiple, V/F, completar. Banco de preguntas reusable entre cohortes. Calificación automática + retroalimentación por pregunta. Threshold para considerar la sesión 'completada'."
      />
    </div>
  );
}
