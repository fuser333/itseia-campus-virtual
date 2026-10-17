/**
 * Mi progreso · Vista Alumno · Campus v2.
 *
 * Muestra una barra de progreso simple (sesiones completadas / total) y
 * stub para futuras métricas (asistencia, calificaciones).
 */

import { notFound, redirect } from 'next/navigation';
import { TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProductoSafe } from '@/lib/productos/loader';
import { getEnrollmentDelProducto } from '@/lib/alumno/enrollments';
import { getSesionesCohorte } from '@/lib/alumno/sesiones';
import type { ProductoId } from '@/lib/productos/types';

interface PageProps {
  params: Promise<{ producto: string }>;
}

export default async function ProgresoProductoPage({ params }: PageProps) {
  const { producto: productoParam } = await params;

  const cfg = getProductoSafe(productoParam);
  if (!cfg) notFound();
  const productoId = cfg.producto.id as ProductoId;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/${productoId}/progreso`);

  const enrollment = await getEnrollmentDelProducto(user.id, productoId);
  if (!enrollment) redirect('/dashboard');

  const sesiones = await getSesionesCohorte(productoId, enrollment.cohorte_slug);
  const total = sesiones.length || cfg.cohorte.sesiones_totales;
  const done = sesiones.filter((s) => s.status === 'done').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const accentVar = `var(--producto-${productoId})`;

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs uppercase tracking-wider opacity-60">
          {cfg.producto.nombre}
        </div>
        <h1 className="font-heading text-3xl font-bold">Mi progreso</h1>
      </header>

      <section
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" style={{ color: accentVar }} />
            <div className="font-semibold">Avance de la cohorte</div>
          </div>
          <div
            className="font-heading text-2xl font-bold"
            style={{ color: accentVar }}
          >
            {pct}%
          </div>
        </div>

        <div
          className="mt-4 h-3 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="h-full transition-all"
            style={{
              width: `${pct}%`,
              backgroundColor: accentVar,
            }}
          />
        </div>

        <div className="mt-3 text-sm opacity-70">
          {done} de {total} sesiones completadas
        </div>
      </section>

      <section
        className="rounded-xl border p-6 text-sm opacity-70"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        Métricas detalladas (asistencia, calificación promedio, badges) se
        habilitarán en una próxima fase del Campus v2.
      </section>
    </div>
  );
}
