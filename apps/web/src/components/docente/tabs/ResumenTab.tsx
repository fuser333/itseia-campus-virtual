'use client';

/**
 * Tab "Resumen ejecutivo de la sesión" · Docente · Campus v2 (FASE 3 · stub).
 *
 * Muestra los metadatos básicos de la sesión (tema, fecha, duración, estado)
 * en formato resumen. El editor de resumen pedagógico vive en FASE 5.
 */

import { Calendar, Clock, BookOpen, FileText } from 'lucide-react';
import StubCard from './_StubCard';
import type { TabDocenteProps } from './types';

export default function ResumenTab({ sesionData }: TabDocenteProps) {
  const fecha = sesionData.fecha_programada
    ? new Date(sesionData.fecha_programada).toLocaleDateString('es-EC', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Por programar';

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
          <BookOpen className="h-3 w-3" />
          Sesión #{sesionData.numero}
        </div>
        <h3 className="mt-2 font-heading text-xl font-bold">
          {sesionData.titulo}
        </h3>
        <ul className="mt-4 space-y-2 text-sm opacity-80">
          <li className="flex items-center gap-2">
            <Calendar className="h-4 w-4 opacity-60" />
            <span>{fecha} EC</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 opacity-60" />
            <span>{sesionData.duracion_minutos ?? 120} minutos</span>
          </li>
          <li className="flex items-center gap-2">
            <FileText className="h-4 w-4 opacity-60" />
            <span>
              Estado: <span className="font-semibold">{sesionData.status ?? 'scheduled'}</span>
            </span>
          </li>
        </ul>
      </div>

      <StubCard
        title="Resumen pedagógico"
        description="Editor rico (markdown + checklist de objetivos de aprendizaje) para que el docente capture el resumen ejecutivo que verá el alumno."
      />
    </div>
  );
}
