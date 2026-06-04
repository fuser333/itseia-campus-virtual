import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * POST /api/docente/grabaciones/iniciar
 *
 * Stub FASE 3 del rediseño Campus v2.
 *
 * Recibe { producto, cohorte_slug, sesion_numero, started_at } y:
 *   1. Verifica que el caller sea docente/admin con assignment a la cohorte.
 *   2. Marca la sesión como `live` en `cohorte_sesiones` (o legacy
 *      `cursos_pro_sessions` cuando aplica).
 *   3. Devuelve 200 con eco del payload.
 *
 * La integración real con un provider de grabación (Daily.co / Stream.io /
 * Restream / Drive recorder local) se implementa en FASE 5/6.
 * Mientras tanto este endpoint solo cambia el status para que el alumno
 * vea el badge "En vivo" en la página de la sesión.
 *
 * NUNCA tocar producción legacy desde acá: si la sesión no existe, devolvemos
 * 404 sin crear nada.
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
  started_at?: string;
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

  const startedAt = payload.started_at ?? new Date().toISOString();

  // Validación de assignment (solo docentes — admin/coordinación pueden todo)
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

  // Rama legacy cursos-pro
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

    const { error: updateErr } = await supabaseAdmin
      .from('cursos_pro_sessions')
      .update({ status: 'live' })
      .eq('course_id', course.id as string)
      .eq('num', sesion_numero);

    if (updateErr) {
      return NextResponse.json(
        { error: updateErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      provider: 'manual',
      producto,
      cohorte_slug,
      sesion_numero,
      started_at: startedAt,
      message:
        'Sesión marcada en vivo (cursos-pro legacy). El cron Drive→YouTube asociará la grabación al finalizar.',
    });
  }

  // Rama Campus v2: cohorte_sesiones
  const { data: cohorte } = await supabaseAdmin
    .from('cohorte_metadata')
    .select('id')
    .eq('producto', producto)
    .eq('cohorte_slug', cohorte_slug)
    .maybeSingle();

  if (!cohorte) {
    return NextResponse.json(
      { error: 'Cohorte no encontrada en cohorte_metadata' },
      { status: 404 }
    );
  }

  const { error: updateErr } = await supabaseAdmin
    .from('cohorte_sesiones')
    .update({ status: 'live' })
    .eq('cohorte_id', cohorte.id as string)
    .eq('numero', sesion_numero);

  if (updateErr) {
    return NextResponse.json(
      { error: updateErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    provider: 'manual',
    producto,
    cohorte_slug,
    sesion_numero,
    started_at: startedAt,
    message:
      'Sesión marcada en vivo. El provider de grabación se integrará en FASE 5/6.',
  });
}
