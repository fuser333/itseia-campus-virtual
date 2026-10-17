'use client';

/**
 * Tab "Notas privadas" · Docente · Campus v2 (FASE 3 · stub).
 *
 * Notas que SOLO ve el docente. Útiles para recordar qué pasó en la clase,
 * qué alumnos estuvieron flojos, qué cambiar la próxima vez.
 *
 * En FASE 5 se conecta con `teacher_notes` (tabla legacy) o se migra a una
 * tabla genérica unificada con clave (cohorte, sesion, docente).
 */

import { Lock, NotebookPen } from 'lucide-react';
import StubCard from './_StubCard';
import type { TabDocenteProps } from './types';

export default function NotasPrivadasTab(_props: TabDocenteProps) {
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
          <Lock className="h-3 w-3" />
          Solo visible para ti
        </div>
        <textarea
          disabled
          placeholder="Anota qué tal estuvo la clase, qué alumnos brillaron, qué replantear la próxima vez…"
          className="mt-3 h-40 w-full resize-none rounded-lg border bg-transparent p-3 text-sm opacity-60 placeholder:text-white/40 focus:outline-none"
          style={{ borderColor: 'var(--sidebar-border)' }}
        />
        <div className="mt-2 flex items-center gap-1.5 text-[10px] opacity-50">
          <NotebookPen className="h-3 w-3" />
          Autoguardado cada 5 segundos (FASE 5)
        </div>
      </div>

      <StubCard
        title="Notas privadas del docente"
        description="Editor markdown con autoguardado, búsqueda full-text en todas las sesiones, exportable a PDF. Migración desde teacher_notes existente."
      />
    </div>
  );
}
