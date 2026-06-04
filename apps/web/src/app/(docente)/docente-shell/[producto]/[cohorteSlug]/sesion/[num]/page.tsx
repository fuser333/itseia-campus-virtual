/**
 * Vista de sesión (docente) · Campus v2 (FASE 3).
 *
 * URL: /[producto]/[cohorteSlug]/sesion/[num]
 *
 * Server Component. Verifica que el docente esté asignado (o admin-level) a
 * la cohorte y renderiza:
 *  · Breadcrumb a la cohorte.
 *  · Header con tema, fecha, duración, estado y link Meet.
 *  · RecordButton sticky (botón GRABAR del SPEC).
 *  · `<SessionTabsDocente>` con las 9 pestañas declaradas en el YAML.
 */

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Video, Radio } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getProductoSafe } from '@/lib/productos/loader';
import {
  getCohorteAsignada,
  getSesionCohorte,
  type CohorteDocente,
} from '@/lib/docente/cohortes';
import type { ProductoId } from '@/lib/productos/types';
import RecordButton from '@/components/docente/RecordButton';
import SessionTabsDocente from '@/components/docente/SessionTabsDocente';

const ADMIN_ROLES = new Set(['super_admin', 'admin', 'coordinacion']);

interface PageProps {
  params: Promise<{
    producto: string;
    cohorteSlug: string;
    num: string;
  }>;
}

export default async function SesionDocentePage({ params }: PageProps) {
  const { producto: productoParam, cohorteSlug, num: numParam } = await params;
  const numero = parseInt(numParam, 10);
  if (Number.isNaN(numero)) notFound();

  const cfg = getProductoSafe(productoParam);
  if (!cfg) notFound();
  const productoId = cfg.producto.id as ProductoId;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      `/login?redirect=/${productoId}/${cohorteSlug}/sesion/${numero}`
    );
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';
  const isAdminLevel = ADMIN_ROLES.has(role);

  let cohorte: CohorteDocente | null = await getCohorteAsignada(
    user.id,
    productoId,
    cohorteSlug
  );

  if (!cohorte && isAdminLevel) {
    // admin-level puede ver cualquier cohorte (lee directo de cohorte_metadata)
    const { data: meta } = await supabaseAdmin
      .from('cohorte_metadata')
      .select(
        'cohorte_slug, nombre_publico, fecha_inicio, fecha_fin, meet_url, estado, cliente_referencia'
      )
      .eq('producto', productoId)
      .eq('cohorte_slug', cohorteSlug)
      .maybeSingle();
    if (meta) {
      cohorte = {
        assignment_id: '',
        producto: productoId,
        cohorte_slug: meta.cohorte_slug as string,
        nombre_publico:
          (meta.nombre_publico as string | null) ?? (meta.cohorte_slug as string),
        rol_en_cohorte: 'titular',
        fecha_inicio: (meta.fecha_inicio as string | null) ?? null,
        fecha_fin: (meta.fecha_fin as string | null) ?? null,
        meet_url: (meta.meet_url as string | null) ?? null,
        estado: (meta.estado as string | null) ?? 'planificada',
        cliente_referencia: (meta.cliente_referencia as string | null) ?? null,
      };
    }
  }

  if (!cohorte) {
    redirect(`/${productoId}`);
  }

  const sesion = await getSesionCohorte(productoId, cohorteSlug, numero);
  if (!sesion) notFound();

  const accent = `var(--producto-${productoId})`;
  const meetUrl = sesion.meet_url ?? cohorte.meet_url ?? undefined;
  const isLive = sesion.status === 'live';

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <Link
        href={`/${productoId}/${cohorteSlug}`}
        className="inline-flex items-center gap-1 text-sm opacity-60 transition hover:opacity-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la cohorte
      </Link>

      {/* ── Sticky RecordButton ────────────────────────────── */}
      {cfg.docente.boton_grabar && (
        <div className="sticky top-2 z-30">
          <RecordButton
            producto={productoId}
            cohorteSlug={cohorteSlug}
            sesionNumero={sesion.numero}
            meetUrl={meetUrl}
            initialLive={isLive}
          />
        </div>
      )}

      {/* ── Header de sesión ───────────────────────────────── */}
      <header
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
          borderLeft: `4px solid ${accent}`,
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-60">
              Sesión #{sesion.numero} · {cohorte.nombre_publico}
              <StatusBadge status={sesion.status} />
            </div>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
              {sesion.titulo}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm opacity-70">
              {sesion.fecha_programada && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(sesion.fecha_programada).toLocaleDateString(
                    'es-EC',
                    {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}{' '}
                  EC
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {sesion.duracion_minutos} min
              </span>
            </div>
          </div>

          {meetUrl && (
            <a
              href={meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
              style={{
                borderColor: accent,
                color: accent,
              }}
            >
              {isLive ? (
                <>
                  <Radio className="h-4 w-4 animate-pulse" />
                  Reabrir Meet
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  Link de Meet
                </>
              )}
            </a>
          )}
        </div>
      </header>

      {/* ── 9 pestañas docente ─────────────────────────────── */}
      <SessionTabsDocente
        producto={productoId}
        cohorteSlug={cohorteSlug}
        pestañas={cfg.docente.pestañas_sesion}
        sesionData={{
          numero: sesion.numero,
          titulo: sesion.titulo,
          fecha_programada: sesion.fecha_programada,
          duracion_minutos: sesion.duracion_minutos,
          meet_url: sesion.meet_url,
          recording_url: sesion.recording_url,
          status: sesion.status,
          contenido_path: sesion.contenido_path,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UI helpers
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    scheduled: {
      label: 'Programada',
      bg: 'var(--itseia-navy-light)',
      fg: 'var(--itseia-text)',
    },
    live: {
      label: 'En vivo',
      bg: 'var(--itseia-coral)',
      fg: 'var(--itseia-navy-dark)',
    },
    done: {
      label: 'Completada',
      bg: 'var(--itseia-gold)',
      fg: 'var(--itseia-navy-dark)',
    },
    cancelled: {
      label: 'Cancelada',
      bg: 'rgba(255,255,255,0.10)',
      fg: 'var(--itseia-text)',
    },
  };
  const v = map[status] ?? map.scheduled;
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: v.bg, color: v.fg }}
    >
      {v.label}
    </span>
  );
}
