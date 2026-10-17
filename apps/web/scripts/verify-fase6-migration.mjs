/**
 * Verificación FASE 6 · migración cohortes activas
 * ----------------------------------------------------------------------------
 * Cuenta y valida que:
 *   1. enrollments tiene columnas cohorte_slug y producto (migración 020)
 *   2. enrollments preuni vinculados a producto=preuni, cohorte_slug=cohorte-jun-2026
 *   3. cohorte_sesiones preuni = 20 sesiones · cohorte_id = cohorte-jun-2026
 *   4. cohorte_sesiones gisela = 8 sesiones · cohorte_id = inca-gisela
 *   5. 7 alumnos del preuni tienen enrollment correcto
 *   6. 2 alumnas admin-salud tienen enrollment activo en cursos_pro_enrollments
 *
 * Exit code 0 = PASS · 1 = FAIL
 *
 * Uso: node scripts/verify-fase6-migration.mjs
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUP_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUP_SR  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUP_URL || !SUP_SR) {
  console.error('Faltan envs');
  process.exit(1);
}

const admin = createClient(SUP_URL, SUP_SR, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PREUNI_PROGRAM_ID = '958d9795-8958-450e-828a-ff24eb4b0f00';
const ADMIN_SALUD_COURSE_ID = '81377222-84e4-46e9-a4a3-82a578257b1e';

let passed = 0;
let failed = 0;
const errors = [];

function check(name, condition, detail = '') {
  if (condition) {
    console.log(`  [PASS] ${name}${detail ? ' · ' + detail : ''}`);
    passed++;
  } else {
    console.log(`  [FAIL] ${name}${detail ? ' · ' + detail : ''}`);
    failed++;
    errors.push(name);
  }
}

console.log('\n=== Verificación FASE 6 · Campus v2 ===\n');

// ───────────────────────────────────────────────────────────────────────────
// 1. Migración 020: columnas en enrollments
// ───────────────────────────────────────────────────────────────────────────
console.log('[1] Migración 020 — columnas en enrollments');
let migration020Applied = false;
{
  const { error } = await admin
    .from('enrollments')
    .select('id, cohorte_slug, producto')
    .limit(1);
  migration020Applied = !error;
  check('enrollments.cohorte_slug existe', migration020Applied, error?.message ?? 'OK');
  check('enrollments.producto existe', migration020Applied, error?.message ?? 'OK');
}

// ───────────────────────────────────────────────────────────────────────────
// 2. cohorte_metadata: 2 cohortes activas registradas
// ───────────────────────────────────────────────────────────────────────────
console.log('\n[2] cohorte_metadata');
{
  const { data, error } = await admin
    .from('cohorte_metadata')
    .select('producto, cohorte_slug, nombre_publico, estado')
    .order('producto');
  if (error) {
    check('cohorte_metadata accesible', false, error.message);
  } else {
    check('cohorte preuni/cohorte-jun-2026 existe',
      data.some((c) => c.producto === 'preuni' && c.cohorte_slug === 'cohorte-jun-2026'));
    check('cohorte cursos-pro/inca-gisela existe',
      data.some((c) => c.producto === 'cursos-pro' && c.cohorte_slug === 'inca-gisela'));
    data.forEach((c) => console.log(`        · ${c.producto}/${c.cohorte_slug} (${c.estado}) "${c.nombre_publico}"`));
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 3. cohorte_sesiones · preuni (20)
// ───────────────────────────────────────────────────────────────────────────
console.log('\n[3] cohorte_sesiones · preuni');
{
  const { data: meta } = await admin
    .from('cohorte_metadata')
    .select('id')
    .eq('producto', 'preuni')
    .eq('cohorte_slug', 'cohorte-jun-2026')
    .maybeSingle();
  if (!meta) {
    check('cohorte preuni en cohorte_metadata', false);
  } else {
    const { data, error, count } = await admin
      .from('cohorte_sesiones')
      .select('numero, titulo, fecha_programada, meet_url', { count: 'exact' })
      .eq('cohorte_id', meta.id)
      .order('numero');
    check('cohorte_sesiones preuni accesible', !error, error?.message ?? '');
    check('cohorte_sesiones preuni = 20 filas', count === 20, `count=${count}`);
    if (data) {
      const nums = data.map((s) => s.numero);
      const expectedNums = Array.from({ length: 20 }, (_, i) => i + 1);
      check('cohorte_sesiones preuni numeradas 1..20',
        JSON.stringify(nums) === JSON.stringify(expectedNums),
        `nums=${nums.join(',')}`);
      const allHaveMeet = data.every((s) => s.meet_url === 'https://meet.google.com/qox-bghu-mbe');
      check('todas las sesiones preuni tienen meet_url correcto', allHaveMeet);
    }
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 4. cohorte_sesiones · gisela (8)
// ───────────────────────────────────────────────────────────────────────────
console.log('\n[4] cohorte_sesiones · inca-gisela');
{
  const { data: meta } = await admin
    .from('cohorte_metadata')
    .select('id')
    .eq('producto', 'cursos-pro')
    .eq('cohorte_slug', 'inca-gisela')
    .maybeSingle();
  if (!meta) {
    check('cohorte inca-gisela en cohorte_metadata', false);
  } else {
    const { data, error, count } = await admin
      .from('cohorte_sesiones')
      .select('numero, titulo', { count: 'exact' })
      .eq('cohorte_id', meta.id)
      .order('numero');
    check('cohorte_sesiones gisela accesible', !error, error?.message ?? '');
    check('cohorte_sesiones gisela = 8 filas', count === 8, `count=${count}`);
    if (data) {
      const nums = data.map((s) => s.numero);
      const expectedNums = Array.from({ length: 8 }, (_, i) => i + 1);
      check('cohorte_sesiones gisela numeradas 1..8',
        JSON.stringify(nums) === JSON.stringify(expectedNums));
    }
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 5. enrollments preuni vinculados a la cohorte (sólo si 020 aplicada)
// ───────────────────────────────────────────────────────────────────────────
console.log('\n[5] enrollments preuni → cohorte');
if (migration020Applied) {
  const { data, error } = await admin
    .from('enrollments')
    .select('user_id, producto, cohorte_slug, status')
    .eq('program_id', PREUNI_PROGRAM_ID);
  if (error) {
    check('select enrollments preuni', false, error.message);
  } else {
    check('hay enrollments preuni', data.length >= 7, `count=${data.length}`);
    const linked = data.filter(
      (e) => e.producto === 'preuni' && e.cohorte_slug === 'cohorte-jun-2026',
    );
    check('todos los enrollments preuni vinculados a producto=preuni, cohorte=cohorte-jun-2026',
      linked.length === data.length,
      `linked=${linked.length}/${data.length}`);
  }
} else {
  console.log('  [SKIP] migración 020 no aplicada. Aplicar 020 y reintentar.');
  failed++;
  errors.push('migración 020 pendiente');
}

// ───────────────────────────────────────────────────────────────────────────
// 6. cursos_pro_enrollments admin-salud (2 alumnas)
// ───────────────────────────────────────────────────────────────────────────
console.log('\n[6] cursos_pro_enrollments admin-salud');
{
  const { data, error } = await admin
    .from('cursos_pro_enrollments')
    .select('profile_id, status, profiles!inner(email, full_name)')
    .eq('course_id', ADMIN_SALUD_COURSE_ID);
  if (error) {
    check('select cursos_pro_enrollments', false, error.message);
  } else {
    check('hay 2 enrollments admin-salud', data.length === 2, `count=${data.length}`);
    const active = data.filter((e) => e.status === 'active');
    check('ambos enrollments admin-salud activos', active.length === 2, `active=${active.length}`);
    data.forEach((e) => {
      const p = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles;
      console.log(`        · ${p?.email ?? '?'} (${p?.full_name ?? '?'}) status=${e.status}`);
    });
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 7. docente_cohorte_assignments — Héctor tiene 2 cohortes
// ───────────────────────────────────────────────────────────────────────────
console.log('\n[7] docente_cohorte_assignments · Héctor');
{
  const { data: hector } = await admin
    .from('profiles')
    .select('id, email')
    .eq('email', 'administracion@itseia.ai')
    .maybeSingle();
  if (!hector) {
    check('profile administracion@itseia.ai existe', false);
  } else {
    const { data } = await admin
      .from('docente_cohorte_assignments')
      .select('producto, cohorte_slug, activo')
      .eq('docente_id', hector.id)
      .eq('activo', true);
    check('Héctor tiene assignment para preuni/cohorte-jun-2026',
      (data ?? []).some((a) => a.producto === 'preuni' && a.cohorte_slug === 'cohorte-jun-2026'));
    check('Héctor tiene assignment para cursos-pro/inca-gisela',
      (data ?? []).some((a) => a.producto === 'cursos-pro' && a.cohorte_slug === 'inca-gisela'));
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Resumen
// ───────────────────────────────────────────────────────────────────────────
console.log(`\n=== Resumen ===`);
console.log(`  PASS: ${passed}`);
console.log(`  FAIL: ${failed}`);
if (failed > 0) {
  console.log(`\nErrores:`);
  errors.forEach((e) => console.log(`  · ${e}`));
  process.exit(1);
}
console.log('\nTODO OK.\n');
process.exit(0);
