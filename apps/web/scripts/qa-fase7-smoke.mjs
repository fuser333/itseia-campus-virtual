/**
 * QA Smoke Test FASE 7 · Campus v2 ITSEIA
 * ----------------------------------------------------------------------------
 * Verifica el estado end-to-end del campus v2 antes de mergear FASE 7:
 *
 *  A. Login + redirect via /api/auth/post-login-redirect (3 roles)
 *  B. Rutas críticas Preuni (alumno + docente + Héctor super_admin)
 *  C. Rutas críticas Cursos-Pro (alumno Gisela + docente admin-salud)
 *  D. Verificaciones BD (enrollments activos + contenido cohorte_sesiones)
 *
 * Modo:
 *  · BASE_URL=http://localhost:3000 (default) · usa el dev server local
 *  · BASE_URL=https://tecnologico.itseia.ai · sondea producción real
 *
 * Uso:
 *  cd apps/web && npm run dev &  # esperar que arranque
 *  node scripts/qa-fase7-smoke.mjs
 *  # o contra prod:
 *  BASE_URL=https://tecnologico.itseia.ai node scripts/qa-fase7-smoke.mjs
 *
 * Exit 0 = todos PASS · Exit 1 = al menos 1 FAIL
 *
 * Cuentas usadas (reales en producción):
 *   · xavo88@hotmail.com / Itseia2026!Xavier            → estudiante preuni
 *   · docente@itseia.ai / ItseiaDocente2026!            → docente puro
 *   · administracion@itseia.ai / Itseia2026!Hector      → super_admin
 *
 * NOTA: este script NO modifica datos. Sólo lee BD + hace requests GET con
 * cookies de sesión.
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SUP_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUP_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUP_SR = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUP_URL || !SUP_ANON || !SUP_SR) {
  console.error('Faltan envs NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const admin = createClient(SUP_URL, SUP_SR, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const COHORTE_HECTOR_MATERIA = '28c2bfd1-0300-46d4-a741-3962eacf58ab';
const PREUNI_PROGRAM_ID = '958d9795-8958-450e-828a-ff24eb4b0f00';
const ADMIN_SALUD_COURSE_ID = '81377222-84e4-46e9-a4a3-82a578257b1e';
// UUIDs reales en cohorte_metadata (FASE 6)
const PREUNI_COHORTE_UUID = '83459c2f-96f1-4fc9-a83b-5f3e3a7a72ed';
const ADMIN_SALUD_COHORTE_UUID = 'cb47f718-d8d7-4d85-ba52-71cef18d1158';

const USERS = {
  xavier: { email: 'xavo88@hotmail.com', pwd: 'Itseia2026!Xavier', label: 'Xavier (alumno preuni)' },
  docente: { email: 'docente@itseia.ai', pwd: 'ItseiaDocente2026!', label: 'docente@itseia.ai (docente puro)' },
  hector: { email: 'administracion@itseia.ai', pwd: 'Itseia2026!Hector', label: 'Héctor (super_admin)' },
  // Gisela e2e: best-effort, password puede no estar seteado. Fallback: usar Xavier en mismas pruebas si Gisela no tiene login.
  gisela: { email: 'gisela.castro@itseia.ai', pwd: 'GiselaCurso2026!', label: 'Gisela (alumna cursos-pro)' },
};

const results = [];
let passed = 0;
let failed = 0;
let skipped = 0;

function record(name, statusOrBool, detail = '') {
  // Accept boolean for ergonomic call sites: record('x', condition, detail)
  const status =
    typeof statusOrBool === 'boolean'
      ? statusOrBool ? 'PASS' : 'FAIL'
      : statusOrBool;
  results.push({ name, status, detail });
  if (status === 'PASS') passed++;
  else if (status === 'FAIL') failed++;
  else skipped++;
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️ ';
  console.log(`  ${icon} [${status}] ${name}${detail ? ' · ' + detail : ''}`);
}

async function loginAndBuildCookie(creds) {
  const sb = createClient(SUP_URL, SUP_ANON, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await sb.auth.signInWithPassword({
    email: creds.email,
    password: creds.pwd,
  });
  if (error || !data?.session) {
    return { ok: false, error: error?.message ?? 'sin sesión' };
  }
  const ref = new URL(SUP_URL).hostname.split('.')[0];
  const cookieName = `sb-${ref}-auth-token`;
  const sessionObj = {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in,
    expires_at: data.session.expires_at,
    token_type: data.session.token_type,
    user: data.session.user,
  };
  const cookieValue =
    'base64-' + Buffer.from(JSON.stringify(sessionObj)).toString('base64');
  return {
    ok: true,
    cookieHeader: `${cookieName}=${cookieValue}`,
    user: data.user,
  };
}

async function fetchWithCookie(url, cookieHeader) {
  try {
    const res = await fetch(url, {
      headers: { cookie: cookieHeader, accept: 'text/html' },
      redirect: 'manual',
      cache: 'no-store',
    });
    return { status: res.status, location: res.headers.get('location') };
  } catch (e) {
    return { status: 0, error: e.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// A. Login + redirect resolver
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n=== QA FASE 7 · Campus v2 ITSEIA ===');
console.log(`Base URL: ${BASE_URL}\n`);

console.log('[A] Login + post-login-redirect resolver');
const sessions = {};
const expectedRedirects = {
  xavier: '/preuni',
  docente: '/docente',
  hector: '/admin',
};

for (const key of ['xavier', 'docente', 'hector']) {
  const u = USERS[key];
  const session = await loginAndBuildCookie(u);
  if (!session.ok) {
    record(`login · ${u.label}`, 'FAIL', session.error);
    continue;
  }
  record(`login · ${u.label}`, 'PASS', `uid=${session.user.id.slice(0, 8)}`);
  sessions[key] = session;

  const res = await fetch(`${BASE_URL}/api/auth/post-login-redirect`, {
    headers: { cookie: session.cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok) {
    record(`redirect · ${u.label}`, 'FAIL', `HTTP ${res.status}`);
    continue;
  }
  const body = await res.json();
  const expected = expectedRedirects[key];
  const ok = body.url === expected;
  record(
    `redirect · ${u.label} → ${body.url}`,
    ok ? 'PASS' : 'FAIL',
    `esperado=${expected} reason=${body.reason}`,
  );
}

// Login Gisela best-effort (no requerido pero útil)
{
  const g = USERS.gisela;
  const session = await loginAndBuildCookie(g);
  if (session.ok) {
    record(`login · ${g.label}`, 'PASS', `uid=${session.user.id.slice(0, 8)}`);
    sessions.gisela = session;
  } else {
    record(`login · ${g.label}`, 'SKIP', session.error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// B. Rutas críticas Preuni
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[B] Rutas críticas Preuni');

const PREUNI_ROUTES = [
  { path: '/preuni', who: 'xavier', desc: 'alumno preuni → dashboard preuni' },
  { path: `/teacher/materias/${COHORTE_HECTOR_MATERIA}/sesion/1`, who: 'hector', desc: 'Héctor → vista clase legacy /teacher (debe seguir vivo)' },
  { path: '/docente', who: 'docente', desc: 'docente puro → dashboard docente' },
  { path: '/docente/preuni', who: 'docente', desc: 'docente puro → preuni docente shell' },
];

for (const r of PREUNI_ROUTES) {
  const s = sessions[r.who];
  if (!s) {
    record(`GET ${r.path}`, 'SKIP', 'sin sesión para ' + r.who);
    continue;
  }
  const out = await fetchWithCookie(`${BASE_URL}${r.path}`, s.cookieHeader);
  const ok = out.status === 200 || (out.status >= 300 && out.status < 400);
  record(
    `GET ${r.path}`,
    ok ? 'PASS' : 'FAIL',
    `${r.desc} · HTTP ${out.status}${out.location ? ' → ' + out.location : ''}${out.error ? ' err=' + out.error : ''}`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// C. Rutas críticas Cursos-Pro (Gisela + Josselin viernes 6 jun)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[C] Rutas críticas Cursos-Pro');

const CURSOSPRO_ROUTES = [
  { path: '/cursos-pro', who: 'gisela', fallback: 'xavier', desc: 'alumna cursos-pro → hub cursos-pro' },
  { path: '/cursos-pro/docente/admin-salud', who: 'docente', desc: 'docente → vista curso admin-salud legacy' },
  { path: '/cursos-pro/docente/admin-salud/sesion/1', who: 'docente', desc: 'docente → sesión 1 admin-salud legacy' },
];

for (const r of CURSOSPRO_ROUTES) {
  let s = sessions[r.who];
  let usedFallback = '';
  if (!s && r.fallback && sessions[r.fallback]) {
    s = sessions[r.fallback];
    usedFallback = ` (fallback ${r.fallback})`;
  }
  if (!s) {
    record(`GET ${r.path}`, 'SKIP', 'sin sesión disponible');
    continue;
  }
  const out = await fetchWithCookie(`${BASE_URL}${r.path}`, s.cookieHeader);
  const ok = out.status === 200 || (out.status >= 300 && out.status < 400);
  record(
    `GET ${r.path}${usedFallback}`,
    ok ? 'PASS' : 'FAIL',
    `${r.desc} · HTTP ${out.status}${out.location ? ' → ' + out.location : ''}${out.error ? ' err=' + out.error : ''}`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// D. Verificaciones BD
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[D] Verificaciones BD');

// D.1 — 7 alumnos preuni con enrollment activo
{
  const { data, error } = await admin
    .from('enrollments')
    .select('id, user_id, status, program_id')
    .eq('program_id', PREUNI_PROGRAM_ID)
    .eq('status', 'active');
  if (error) {
    record('preuni · enrollments activos', 'FAIL', error.message);
  } else {
    const count = data?.length ?? 0;
    record(
      'preuni · enrollments activos',
      count >= 7 ? 'PASS' : 'FAIL',
      `count=${count} (esperado ≥ 7)`,
    );
  }
}

// D.2 — 2 alumnas admin-salud con enrollment activo (tabla cursos_pro_enrollments.profile_id)
{
  const { data, error } = await admin
    .from('cursos_pro_enrollments')
    .select('id, profile_id, status')
    .eq('course_id', ADMIN_SALUD_COURSE_ID)
    .eq('status', 'active');
  if (error) {
    record('admin-salud · cursos_pro_enrollments activos', 'FAIL', error.message);
  } else {
    const count = data?.length ?? 0;
    record(
      'admin-salud · cursos_pro_enrollments activos',
      count >= 2 ? 'PASS' : 'FAIL',
      `count=${count} (esperado ≥ 2)`,
    );
  }
}

// D.3 — Calendario preuni: 20 sesiones en cohorte_sesiones (vista calendario FASE 6)
{
  const { data, error } = await admin
    .from('cohorte_sesiones')
    .select('numero, titulo, status, contenido_path')
    .eq('cohorte_id', PREUNI_COHORTE_UUID)
    .order('numero');
  if (error) {
    record('preuni · cohorte_sesiones calendario', 'FAIL', error.message);
  } else {
    record(
      'preuni · cohorte_sesiones count',
      (data?.length ?? 0) === 20 ? 'PASS' : 'FAIL',
      `count=${data?.length ?? 0} (esperado 20)`,
    );
    const s1 = data?.find((x) => x.numero === 1);
    const s20 = data?.find((x) => x.numero === 20);
    record(
      'preuni · S1 título seteado',
      !!s1?.titulo && s1.titulo.length > 5,
      `titulo="${s1?.titulo ?? ''}"`,
    );
    record(
      'preuni · S20 título seteado',
      !!s20?.titulo && s20.titulo.length > 5,
      `titulo="${s20?.titulo ?? ''}"`,
    );
  }
}

// D.3b — Contenido preuni: tabla `sessions` (per-week) — semana 1 (Hector) debe tener 5 sesiones con theory_markdown
{
  const { data, error } = await admin
    .from('sessions')
    .select('number, title, theory_markdown')
    .eq('subject_id', COHORTE_HECTOR_MATERIA)
    .order('number');
  if (error) {
    record('preuni · sessions Semana 1 (Hector)', 'FAIL', error.message);
  } else {
    record(
      'preuni · sessions S1-S5 Hector count',
      (data?.length ?? 0) === 5 ? 'PASS' : 'FAIL',
      `count=${data?.length ?? 0} (esperado 5)`,
    );
    const s1 = data?.find((x) => x.number === 1);
    const s5 = data?.find((x) => x.number === 5);
    record(
      'preuni · Hector S1 tiene theory_markdown',
      !!s1?.theory_markdown && s1.theory_markdown.length > 500 ? 'PASS' : 'FAIL',
      `len=${s1?.theory_markdown?.length ?? 0}`,
    );
    record(
      'preuni · Hector S5 tiene theory_markdown',
      !!s5?.theory_markdown && s5.theory_markdown.length > 500 ? 'PASS' : 'FAIL',
      `len=${s5?.theory_markdown?.length ?? 0}`,
    );
  }
}

// D.4 — Calendario admin-salud: 8 sesiones en cohorte_sesiones
{
  const { data, error } = await admin
    .from('cohorte_sesiones')
    .select('numero, titulo, status')
    .eq('cohorte_id', ADMIN_SALUD_COHORTE_UUID)
    .order('numero');
  if (error) {
    record('admin-salud · cohorte_sesiones calendario', 'FAIL', error.message);
  } else {
    record(
      'admin-salud · cohorte_sesiones count',
      (data?.length ?? 0) === 8 ? 'PASS' : 'FAIL',
      `count=${data?.length ?? 0} (esperado 8)`,
    );
  }
}

// D.4b — Contenido admin-salud: tabla `cursos_pro_sessions` debe tener 8 sesiones con theory_md + quiz_json
{
  const { data, error } = await admin
    .from('cursos_pro_sessions')
    .select('num, title, theory_md, quiz_json')
    .eq('course_id', ADMIN_SALUD_COURSE_ID)
    .order('num');
  if (error) {
    record('admin-salud · cursos_pro_sessions contenido', 'FAIL', error.message);
  } else {
    record(
      'admin-salud · cursos_pro_sessions count',
      (data?.length ?? 0) === 8 ? 'PASS' : 'FAIL',
      `count=${data?.length ?? 0} (esperado 8)`,
    );
    const s1 = data?.find((x) => x.num === 1);
    const s8 = data?.find((x) => x.num === 8);
    record(
      'admin-salud · S1 tiene theory_md + quiz',
      !!s1?.theory_md && s1.theory_md.length > 500 && !!s1?.quiz_json ? 'PASS' : 'FAIL',
      `theory_len=${s1?.theory_md?.length ?? 0} quiz=${s1?.quiz_json ? 'sí' : 'no'}`,
    );
    record(
      'admin-salud · S8 tiene theory_md + quiz',
      !!s8?.theory_md && s8.theory_md.length > 500 && !!s8?.quiz_json ? 'PASS' : 'FAIL',
      `theory_len=${s8?.theory_md?.length ?? 0} quiz=${s8?.quiz_json ? 'sí' : 'no'}`,
    );
  }
}

// D.5 — Roles correctos
{
  for (const key of ['xavier', 'docente', 'hector']) {
    const s = sessions[key];
    if (!s) continue;
    const { data, error } = await admin
      .from('profiles')
      .select('role, email')
      .eq('id', s.user.id)
      .single();
    if (error) {
      record(`profiles.role · ${USERS[key].label}`, 'FAIL', error.message);
    } else {
      const expectedRole =
        key === 'xavier' ? 'estudiante'
        : key === 'docente' ? 'docente'
        : 'super_admin';
      record(
        `profiles.role · ${USERS[key].label}`,
        data.role === expectedRole ? 'PASS' : 'FAIL',
        `role=${data.role} (esperado ${expectedRole})`,
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Resumen
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n=== Resumen QA FASE 7 ===`);
console.log(`PASS: ${passed}   FAIL: ${failed}   SKIP: ${skipped}   TOTAL: ${results.length}`);
console.log(`Base URL: ${BASE_URL}`);

if (failed > 0) {
  console.log('\n--- FAILS ---');
  for (const r of results.filter((x) => x.status === 'FAIL')) {
    console.log(`  ❌ ${r.name} · ${r.detail}`);
  }
}

process.exit(failed > 0 ? 1 : 0);
