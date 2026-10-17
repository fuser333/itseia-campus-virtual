/**
 * Materiales globales del producto · Vista Alumno · Campus v2.
 *
 * Stub FASE 2: lista placeholder. FASE 4 cargará los materiales agregados
 * de todas las sesiones de la cohorte activa del alumno.
 */

import { notFound, redirect } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProductoSafe } from '@/lib/productos/loader';
import { getEnrollmentDelProducto } from '@/lib/alumno/enrollments';
import type { ProductoId } from '@/lib/productos/types';

interface PageProps {
  params: Promise<{ producto: string }>;
}

export default async function MaterialesProductoPage({ params }: PageProps) {
  const { producto: productoParam } = await params;

  const cfg = getProductoSafe(productoParam);
  if (!cfg) notFound();
  const productoId = cfg.producto.id as ProductoId;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/${productoId}/materiales`);

  const enrollment = await getEnrollmentDelProducto(user.id, productoId);
  if (!enrollment) redirect('/dashboard');

  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-wider opacity-60">
          {cfg.producto.nombre}
        </div>
        <h1 className="font-heading text-3xl font-bold">Materiales</h1>
        <p className="mt-1 text-sm opacity-70">
          Recursos descargables agregados de todas las sesiones de tu cohorte.
        </p>
      </header>

      <div
        className="rounded-xl border p-8 text-center"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <BookOpen className="mx-auto h-10 w-10 opacity-30" />
        <div className="mt-3 font-heading text-lg font-semibold">
          Materiales próximamente
        </div>
        <p className="mx-auto mt-1 max-w-md text-sm opacity-70">
          Aquí encontrarás los PDFs, slides y lecturas de toda la cohorte una
          vez que el docente los suba.
        </p>
      </div>
    </div>
  );
}
