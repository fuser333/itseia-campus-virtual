/**
 * Descubre ITSEIA · Cross-promo para alumnos del campus v2.
 *
 * Server Component. Muestra los 8 productos en formato grid, excluyendo el
 * producto activo del alumno (regla 5 SPEC · sidebar no se autopublicita).
 *
 * El query param `?p=<producto>` indica cuál es el producto activo a excluir.
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { listProductos } from '@/lib/productos/loader';
import { getEnrollmentPrincipal } from '@/lib/alumno/enrollments';
import type { ProductoId } from '@/lib/productos/types';

interface PageProps {
  searchParams: Promise<{ p?: string }>;
}

export default async function DescubrePage({ searchParams }: PageProps) {
  const { p } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/descubre');

  // Producto activo: el del query, o el enrollment principal del alumno
  let activoId: ProductoId | undefined = p as ProductoId | undefined;
  if (!activoId) {
    const enrollment = await getEnrollmentPrincipal(user.id);
    activoId = enrollment?.producto;
  }

  const productos = listProductos();
  // Excluir el producto activo si está definido (regla "no autopromo")
  const otros = productos.filter((prod) => prod.producto.id !== activoId);

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs uppercase tracking-wider opacity-60">
          ITSEIA Academy
        </div>
        <h1 className="font-heading text-3xl font-bold">
          Descubre los otros programas
        </h1>
        <p className="mt-2 max-w-2xl text-sm opacity-70">
          Tu formación no termina aquí. Estos son los demás productos de ITSEIA
          que pueden complementar tu carrera profesional en IA.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {otros.map((prod) => {
          const accentVar = `var(--producto-${prod.producto.id})`;
          return (
            <Link
              key={prod.producto.id}
              href={
                prod.producto.url_publica ??
                `/descubre/${prod.producto.id.replace('cursos-pro', 'cursos-pro')}`
              }
              target={prod.producto.url_publica ? '_blank' : undefined}
              rel={prod.producto.url_publica ? 'noopener noreferrer' : undefined}
              className="group rounded-xl border p-5 transition hover:border-white/20 hover:bg-white/[0.02]"
              style={{
                backgroundColor: 'var(--itseia-navy)',
                borderColor: 'var(--sidebar-border)',
                borderLeft: `3px solid ${accentVar}`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-heading text-lg"
                  style={{
                    backgroundColor: accentVar,
                    color: 'var(--itseia-navy-dark)',
                  }}
                >
                  {prod.producto.icono}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold">
                    {prod.producto.nombre}
                  </div>
                  {prod.producto.descripcion && (
                    <p className="mt-1 text-xs opacity-70 line-clamp-3">
                      {prod.producto.descripcion}
                    </p>
                  )}
                  <div
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold transition group-hover:gap-2"
                    style={{ color: accentVar }}
                  >
                    Conocer más
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
