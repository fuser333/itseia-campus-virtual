'use client';

/**
 * Switch a Docente · Campus v2 (FASE 4).
 *
 * Botón flotante (sticky bottom-right) que aparece solo si el usuario tiene
 * role super_admin o admin. Al hacer clic redirige al dashboard del shell
 * docente. Sirve para alternar entre ambas vistas sin pasar por el header.
 *
 * Coexistencia: render condicional. El layout admin decide si lo monta.
 */

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

interface Props {
  /** Rol del usuario. Solo aparece si super_admin | admin. */
  role: string;
}

const ALLOWED = new Set(['super_admin', 'admin']);

export default function SwitchToDocente({ role }: Props) {
  if (!ALLOWED.has(role)) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-40 hidden sm:block"
      aria-hidden={false}
    >
      <Link
        href="/dashboard-docente"
        className="pointer-events-auto group flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold uppercase tracking-wider shadow-lg transition hover:scale-105"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--itseia-sky)',
          color: 'var(--itseia-sky)',
        }}
      >
        <GraduationCap className="h-4 w-4" />
        <span>Cambiar a Docente →</span>
      </Link>
    </div>
  );
}
