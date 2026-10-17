/**
 * Lista de sesiones de la cohorte · Vista Alumno · Campus v2.
 *
 * Server Component. Verifica enrollment del alumno en la cohorte específica
 * y muestra todas las sesiones en orden con estado.
 */

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, CheckCircle2, Circle, Play, Radio } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProductoSafe } from '@/lib/productos/loader';
import { isEnrolledIn } from '@/lib/alumno/enrollments';
import { getCohorte, getSesionesCohorte } from '@/lib/alumno/sesiones';
import type { ProductoId } from '@/lib/productos/types';

interface PageProps {
  params: Promise<{ producto: string; cohorteSlug: string }>;
}

export default async function CohorteSesionesPage({ params }: PageProps) {
  const { producto: productoParam, cohorteSlug } = await params;

  const cfg = getProductoSafe(productoParam);
  if (!cfg) notFound();
  const productoId = cfg.producto.id as ProductoId;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/${productoId}/c/${cohorteSlug}`);

  const enrolled = await isEnrolledIn(user.id, productoId, cohorteSlug);
  if (!enrolled) {
    redirect(`/${productoId}`);
  }

  const cohorte = await getCohorte(productoId, cohorteSlug);
  if (!cohorte) notFound();

  const sesiones = await getSesionesCohorte(productoId, cohorteSlug);
  const accentVar = `var(--producto-${productoId})`;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Link
          href={`/${productoId}`}
          className="text-sm opacity-60 hover:opacity-100"
        >
          ← Volver al dashboard
        </Link>
        <h1 className="font-heading text-3xl font-bold">
          {cohorte.nombre_publico}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm opacity-70">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Inicio:{' '}
            {new Date(cohorte.fecha_inicio).toLocaleDateString('es-EC', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          {cohorte.fecha_fin && (
            <span className="flex items-center gap-1.5">
              Fin:{' '}
              {new Date(cohorte.fecha_fin).toLocaleDateString('es-EC', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{
              backgroundColor:
                cohorte.estado === 'activa'
                  ? 'var(--itseia-gold)'
                  : 'var(--itseia-navy-light)',
              color:
                cohorte.estado === 'activa'
                  ? 'var(--itseia-navy-dark)'
                  : 'var(--itseia-text)',
            }}
          >
            {cohorte.estado}
          </span>
        </div>
      </header>

      {sesiones.length === 0 ? (
        <div
          className="rounded-xl border p-8 text-center"
          style={{
            backgroundColor: 'var(--itseia-navy)',
            borderColor: 'var(--sidebar-border)',
          }}
        >
          <p className="opacity-70">
            Las sesiones de esta cohorte aún no se han publicado. Vuelve pronto.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {sesiones.map((s) => {
            const isLive = s.status === 'live';
            const isDone = s.status === 'done';
            const StatusIcon = isLive
              ? Radio
              : isDone
                ? CheckCircle2
                : s.status === 'cancelled'
                  ? Circle
                  : Play;

            return (
              <li key={s.id}>
                <Link
                  href={`/${productoId}/c/${cohorteSlug}/sesion/${s.numero}`}
                  className="flex items-center gap-4 rounded-xl border p-4 transition hover:border-white/20 hover:bg-white/[0.02]"
                  style={{
                    backgroundColor: isLive
                      ? 'var(--itseia-coral)'
                      : 'var(--itseia-navy)',
                    borderColor: isLive ? accentVar : 'var(--sidebar-border)',
                    color: isLive ? 'var(--itseia-navy-dark)' : undefined,
                  }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading font-bold"
                    style={{
                      backgroundColor: isLive
                        ? 'var(--itseia-navy-dark)'
                        : isDone
                          ? 'var(--itseia-gold)'
                          : 'var(--itseia-navy-light)',
                      color: isLive
                        ? 'var(--itseia-coral)'
                        : isDone
                          ? 'var(--itseia-navy-dark)'
                          : 'var(--itseia-text)',
                    }}
                  >
                    {s.numero}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4 shrink-0" />
                      <div className="font-semibold truncate">{s.titulo}</div>
                    </div>
                    {s.fecha_programada && (
                      <div
                        className="mt-0.5 text-xs"
                        style={{
                          opacity: isLive ? 0.85 : 0.6,
                        }}
                      >
                        {new Date(s.fecha_programada).toLocaleDateString(
                          'es-EC',
                          {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}{' '}
                        · {s.duracion_minutos} min
                      </div>
                    )}
                  </div>
                  {isLive && (
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold uppercase">
                      En vivo ahora
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
