import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * POST /api/docente/grabaciones/detener
 *
 * Stub FASE 3. Cambia el status de la sesión de `live` → `done` y devuelve OK.
 * Mismo contrato de seguridad que `/iniciar`.
 */

const DOCENTE_ROLES = new Set([
  'docente',
  'admin',
  'super_admin',
  'coordinacion',
]);

interface Payload {
  producto?: string;
  cohorte_slug?: string;
  sesion_numero?: number;
  stopped_at?: string;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';
  if (!DOCENTE_ROLES.has(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { producto, cohorte_slug, sesion_numero } = payload;
  if (!producto || !cohorte_slug || typeof sesion_numero !== 'number') {
    return NextResponse.json(
      {
        error:
          'Faltan campos requeridos: producto, cohorte_slug, sesion_numero',
      },
      { status: 400 }
    );
  }

  const stoppedAt = payload.stopped_at ?? new Date().toISOString();

  if (role === 'docente') {
    const { data: assignment } = await supabaseAdmin
      .from('docente_cohorte_assignments')
      .select('id')
      .eq('docente_id', user.id)
      .eq('producto', producto)
      .eq('cohorte_slug', cohorte_slug)
      .eq('activo', true)
      .maybeSingle();

    if (!assignment) {
      return NextResponse.json(
        { error: 'No estás asignado a esta cohorte' },
        { status: 403 }
      );
    }
  }

  if (producto === 'cursos-pro') {
    const { data: course } = await supabaseAdmin
      .from('cursos_pro_courses')
      .select('id')
      .eq('slug', cohorte_slug)
      .maybeSingle();

    if (!course) {
      return NextResponse.json(
        { error: 'Cohorte no encontrada' },
        { status: 404 }
      );
    }

    await supabaseAdmin
      .from('cursos_pro_sessions')
      .update({ status: 'done' })
      .eq('course_id', course.id as string)
      .eq('num', sesion_numero);

    return NextResponse.json({
      ok: true,
      producto,
      cohorte_slug,
      sesion_numero,
      stopped_at: stoppedAt,
      message: 'Sesión marcada como completada (cursos-pro legacy).',
    });
  }

  const { data: cohorte } = await supabaseAdmin
    .from('cohorte_metadata')
    .select('id')
    .eq('producto', producto)
    .eq('cohorte_slug', cohorte_slug)
    .maybeSingle();

  if (!cohorte) {
    return NextResponse.json(
      { error: 'Cohorte no encontrada' },
      { status: 404 }
    );
  }

  await supabaseAdmin
    .from('cohorte_sesiones')
    .update({ status: 'done' })
    .eq('cohorte_id', cohorte.id as string)
    .eq('numero', sesion_numero);

  return NextResponse.json({
    ok: true,
    producto,
    cohorte_slug,
    sesion_numero,
    stopped_at: stoppedAt,
    message:
      'Sesión marcada como completada. La grabación se asocia vía cron Drive→YouTube.',
  });
}
