'use client';

/**
 * Tab "Ejercicios (editar)" · Docente · Campus v2 (FASE 3 · stub).
 *
 * En FASE 5: CRUD de ejercicios con rubrics y submission opcional del alumno.
 */

import { Plus, ListChecks } from 'lucide-react';
import StubCard from './_StubCard';
import type { TabDocenteProps } from './types';

export default function EjerciciosEditarTab(_props: TabDocenteProps) {
  void _props; // FASE 3 stub: props se usan en FASE 5.
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold">Ejercicios de la sesión</h3>
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
          Nuevo ejercicio
        </button>
      </div>

      <div
        className="rounded-xl border border-dashed p-6 text-center"
        style={{ borderColor: 'rgba(255,255,255,0.20)' }}
      >
        <ListChecks className="mx-auto h-8 w-8 opacity-40" />
        <p className="mt-2 text-sm opacity-75">
          Aún no hay ejercicios para esta sesión.
        </p>
        <p className="mt-1 text-xs opacity-50">
          Los ejercicios se cargan desde ejercicios.md o se crean acá.
        </p>
      </div>

      <StubCard
        title="Editor de ejercicios"
        description="CRUD con título, enunciado markdown, archivos adjuntos, rúbrica de calificación y submission opcional. Soporta auto-grading para ejercicios de código."
      />
    </div>
  );
}
