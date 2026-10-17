'use client';

/**
 * Tab "Materiales (editar)" · Docente · Campus v2 (FASE 3 · stub).
 *
 * En FASE 5: upload de PDFs/slides + lista actual + reordenar drag-and-drop.
 */

import { FileText, Upload } from 'lucide-react';
import StubCard from './_StubCard';
import type { TabDocenteProps } from './types';

export default function MaterialesEditarTab(_props: TabDocenteProps) {
  void _props; // FASE 3 stub: props se usan en FASE 5.
  return (
    <div className="space-y-4">
      <div
        className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-8 text-center"
        style={{
          borderColor: 'rgba(255,255,255,0.20)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        <Upload className="h-10 w-10 opacity-40" />
        <div>
          <div className="font-semibold">Arrastra archivos aquí</div>
          <div className="text-xs opacity-60">
            PDFs, slides, lecturas (máx 50MB por archivo)
          </div>
        </div>
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg px-4 py-2 text-sm font-semibold opacity-60"
          style={{
            backgroundColor: 'var(--itseia-gold)',
            color: 'var(--itseia-navy-dark)',
          }}
        >
          Subir material (próximamente)
        </button>
      </div>

      <div
        className="rounded-xl border p-4"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
          Materiales actuales
        </div>
        <div className="flex items-center gap-3 text-sm opacity-70">
          <FileText className="h-4 w-4 opacity-60" />
          Aún no hay materiales subidos para esta sesión.
        </div>
      </div>

      <StubCard
        title="Editor de materiales"
        description="Upload directo a Supabase Storage, vista previa PDF embebida, reordenar con drag-and-drop, visibilidad por fecha de release."
      />
    </div>
  );
}
