'use client';

/**
 * StubCard · Helper interno para las pestañas docente FASE 3.
 * Cada pestaña real (FASE 5+) reemplaza este stub por su implementación.
 */

import type { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  children?: ReactNode;
  fase?: number;
}

export default function StubCard({ title, description, children, fase = 5 }: Props) {
  return (
    <div
      className="rounded-2xl border p-8"
      style={{
        backgroundColor: 'var(--itseia-navy)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
        Próximamente · FASE {fase}
      </div>
      <h3 className="mt-2 font-heading text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-xl text-sm opacity-70">{description}</p>
      {children}
    </div>
  );
}
