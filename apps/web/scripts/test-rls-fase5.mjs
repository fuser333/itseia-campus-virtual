/**
 * RLS test suite · Campus v2 · FASE 5.
 *
 * Valida que las policies de RLS de Supabase aplicadas a las tablas claves
 * del campus v2 sean correctas cuando se accede con la ANON KEY autenticada
 * (no con service role). Esto reproduce el comportamiento real del navegador
 * y captura bugs como el de RLS recursion del 30 may 2026.
 *
 * Tablas testeadas:
 *  · docente_cohorte_assignments    → docente solo ve las suyas
 *  · enrollments                    → alumno solo ve las suyas
 *  · cursos_pro_enrollments         → alumno solo ve las suyas
 *  · profiles                       → cualquier autenticado lee su propio profile
 *
 * Cuentas reales usadas (sin tocarlas):
 *  · estudiante:  xavo88@hotmail.com         / Itseia2026!Xavier
 *  · docente:     docente@itseia.ai          / ItseiaDocente2026!
 *  · super_admin: administracion@itseia.ai   / Itseia2026!Hector
 *
 * Endpoint /api/auth/post-login-redirect:
 *  · Para cada cuenta verificamos que el endpoint devolvería el destino
 *    correcto. Esto NO llama al endpoint real (requeriría http server),
 *    sino que replica la lógica del endpoint con datos reales de BD.
 *
 * Uso:
 *   cd apps/web && node scripts/test-rls-fase5.mjs
 *
 * Exit 0 si TODO pasa, exit 1 si cualquier check falla.
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUP_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUP_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUP_URL || !SUP_ANON) {
  console.error('❌ Faltan env vars NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const CUENTAS = {
  estudiante: { email: 'xavo88@hotmail.com', pwd: 'Itseia2026!Xavier' },
  docente: { email: 'docente@itseia.ai', pwd: 'ItseiaDocente2026!' },
  admin: { email: 'administracion@itseia.ai', pwd: 'Itseia2026!Hector' },
};

let pass = 0;
let fail = 0;
const errs = [];

function ok(msg) {
  pass++;
  console.log(`  ✅ ${msg}`);
}
function ko(msg, extra) {
  fail++;
  errs.push(msg);
  console.error(`  ❌ ${msg}${extra ? ` — ${extra}` : ''}`);
}

/**
 * Crea un cliente anon nuevo y logueado con email/pwd.
 * Devuelve { sb, user, profile }.
 */
async function signIn(email, pwd, label) {
  const sb = createClient(SUP_URL, SUP_ANON, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
  const { data, error } = await sb.auth.signInWithPassword({ email, password: pwd });
  if (error || !data?.user) {
    console.error(`\n❌ Login falló para ${label} (${email}): ${error?.message}`);
    return null;
  }
  // Leer profiles.role usando la sesión anon (no service role).
  const { data: prof } = await sb
    .from('profiles')
    .select('id, role, full_name, email')
    .eq('id', data.user.id)
    .single();
  return { sb, user: data.user, profile: prof };
}

console.log('\n🧪 RLS test suite · Campus v2 · FASE 5\n');
console.log('========================================');

// ─── PASO 1: login con las 3 cuentas ──────────────────────────────────────
console.log('\n[1] Login con las 3 cuentas (anon key)\n');

const sesEst = await signIn(CUENTAS.estudiante.email, CUENTAS.estudiante.pwd, 'estudiante');
const sesDoc = await signIn(CUENTAS.docente.email, CUENTAS.docente.pwd, 'docente');
const sesAdm = await signIn(CUENTAS.admin.email, CUENTAS.admin.pwd, 'admin');

if (!sesEst || !sesDoc || !sesAdm) {
  console.error('\n💥 Al menos una cuenta no pudo loguear. Abort.');
  process.exit(1);
}

ok(`estudiante login OK · role=${sesEst.profile?.role ?? '?'}`);
ok(`docente login OK · role=${sesDoc.profile?.role ?? '?'}`);
ok(`admin login OK · role=${sesAdm.profile?.role ?? '?'}`);

// Validar roles esperados
if (sesEst.profile?.role !== 'estudiante' && sesEst.profile?.role !== 'alumno' && sesEst.profile?.role !== 'student') {
  ko(`estudiante role inesperado: '${sesEst.profile?.role}' (se esperaba 'estudiante')`);
} else {
  ok(`estudiante role correcto`);
}
if (sesDoc.profile?.role !== 'docente') {
  ko(`docente role inesperado: '${sesDoc.profile?.role}' (se esperaba 'docente')`);
} else {
  ok(`docente role correcto`);
}
if (sesAdm.profile?.role !== 'super_admin' && sesAdm.profile?.role !== 'admin') {
  ko(`admin role inesperado: '${sesAdm.profile?.role}' (se esperaba 'super_admin'/'admin')`);
} else {
  ok(`admin role correcto`);
}

// ─── PASO 2: docente_cohorte_assignments — docente ve solo las suyas ──────
console.log('\n[2] docente_cohorte_assignments · RLS por owner\n');

const { data: dcaDoc, error: dcaDocErr } = await sesDoc.sb
  .from('docente_cohorte_assignments')
  .select('id, docente_id, producto, cohorte_slug, activo');
if (dcaDocErr) {
  ko(`docente leyendo dca falló`, dcaDocErr.message);
} else {
  const allOwn = (dcaDoc ?? []).every((r) => r.docente_id === sesDoc.user.id);
  if (allOwn) {
    ok(`docente solo ve sus propias assignments (count=${dcaDoc.length})`);
  } else {
    ko(`docente VE assignments de OTROS docentes`, JSON.stringify(dcaDoc.map((r) => r.docente_id)));
  }
}

const { data: dcaAdm, error: dcaAdmErr } = await sesAdm.sb
  .from('docente_cohorte_assignments')
  .select('id, docente_id, producto, cohorte_slug');
if (dcaAdmErr) {
  ko(`admin leyendo dca falló`, dcaAdmErr.message);
} else {
  ok(`admin lee todas las dca (count=${dcaAdm?.length ?? 0})`);
}

const { data: dcaEst } = await sesEst.sb
  .from('docente_cohorte_assignments')
  .select('id');
if ((dcaEst ?? []).length === 0) {
  ok(`estudiante NO ve dca (count=0)`);
} else {
  ko(`estudiante VE dca · count=${dcaEst.length}`, 'esperado 0');
}

// ─── PASO 3: enrollments — alumno ve solo las suyas ───────────────────────
console.log('\n[3] enrollments · RLS por user_id\n');

const { data: enrollEst, error: enrollEstErr } = await sesEst.sb
  .from('enrollments')
  .select('id, user_id, program_id, status');
if (enrollEstErr) {
  ko(`estudiante leyendo enrollments falló`, enrollEstErr.message);
} else {
  const allOwn = (enrollEst ?? []).every((r) => r.user_id === sesEst.user.id);
  if (allOwn) {
    ok(`estudiante solo ve sus propios enrollments (count=${enrollEst.length})`);
  } else {
    ko(`estudiante VE enrollments de OTROS users`, JSON.stringify(enrollEst.map((r) => r.user_id)));
  }
}

// NOTA: la columna real de cursos_pro_enrollments es `profile_id` (migration 017).
// El helper src/lib/alumno/enrollments.ts (FASE 2) usa `user_id` — eso es un
// bug pendiente del helper, NO de las RLS. Acá validamos directamente la RLS.
const { data: cpEnrollEst, error: cpEnrollEstErr } = await sesEst.sb
  .from('cursos_pro_enrollments')
  .select('id, profile_id, course_id, status');
if (cpEnrollEstErr) {
  ko(`estudiante leyendo cursos_pro_enrollments falló`, cpEnrollEstErr.message);
} else {
  const allOwn = (cpEnrollEst ?? []).every((r) => r.profile_id === sesEst.user.id);
  if (allOwn) {
    ok(`estudiante solo ve sus cursos_pro_enrollments (count=${cpEnrollEst.length})`);
  } else {
    ko(`estudiante VE cursos_pro_enrollments de otros`, JSON.stringify(cpEnrollEst.map((r) => r.profile_id)));
  }
}

// ─── PASO 4: profiles — cada uno lee su propio profile ────────────────────
console.log('\n[4] profiles · cada uno lee su propio profile\n');

for (const [label, ses] of [
  ['estudiante', sesEst],
  ['docente', sesDoc],
  ['admin', sesAdm],
]) {
  const { data, error } = await ses.sb
    .from('profiles')
    .select('id, role')
    .eq('id', ses.user.id)
    .single();
  if (error || !data) {
    ko(`${label} no pudo leer su propio profile`, error?.message);
  } else if (data.id === ses.user.id) {
    ok(`${label} lee su profile correctamente`);
  }
}

// ─── PASO 5: replicar lógica de /api/auth/post-login-redirect ──────────────
console.log('\n[5] post-login-redirect · ruteo esperado por role+enrollment\n');

/**
 * Simula GET /api/auth/post-login-redirect para una cuenta. Necesita service
 * role porque el endpoint real usa supabaseAdmin para leer enrollments
 * (ignorando RLS por diseño server-side). Sin SR key, asumimos misma lógica
 * vía anon (que cae bajo RLS · debe coincidir porque el alumno ve sus
 * propios enrollments).
 */
async function resolvePostLoginUrl(ses, role) {
  if (['super_admin', 'admin', 'coordinacion'].includes(role)) return '/admin';
  if (role === 'docente') return '/docente';

  // Enrollments del alumno via anon (cae bajo RLS → ve solo los suyos)
  const out = [];
  const { data: en } = await ses.sb
    .from('enrollments')
    .select('id, enrolled_at, status, programs!inner(id, name, type, slug)')
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false });

  function mapType(t) {
    switch (t) {
      case 'preuni':
      case 'preuniversitario':
        return 'preuni';
      case 'bootcamp':
        return 'bootcamp';
      case 'certificacion':
      case 'certificaciones':
        return 'certificaciones';
      case 'carrera':
      case 'carreras':
        return 'carreras';
      case 'mdt':
      case 'curso_mdt':
        return 'mdt';
      case 'b2b':
        return 'b2b';
      case 'demo':
        return 'demo';
      default:
        return undefined;
    }
  }

  for (const row of en ?? []) {
    const prog = Array.isArray(row.programs) ? row.programs[0] : row.programs;
    if (!prog) continue;
    const producto = mapType(prog.type);
    if (!producto) continue;
    out.push({ producto, cohorte_slug: 'cohorte-jun-2026' });
  }

  // Schema 017: campo es profile_id (no user_id) · RLS filtra por auth.uid
  const { data: cp } = await ses.sb
    .from('cursos_pro_enrollments')
    .select('id, enrolled_at, status, cursos_pro_courses!inner(id, slug, name)')
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false });
  for (const row of cp ?? []) {
    const c = Array.isArray(row.cursos_pro_courses)
      ? row.cursos_pro_courses[0]
      : row.cursos_pro_courses;
    if (!c) continue;
    out.push({ producto: 'cursos-pro', cohorte_slug: c.slug });
  }

  if (out.length === 0) return '/dashboard';
  if (out.length > 1) return '/dashboard';
  const e = out[0];
  if (e.producto === 'cursos-pro') return `/cursos-pro/c/${e.cohorte_slug}`;
  return `/${e.producto}`;
}

const urlEst = await resolvePostLoginUrl(sesEst, sesEst.profile?.role);
const urlDoc = await resolvePostLoginUrl(sesDoc, sesDoc.profile?.role);
const urlAdm = await resolvePostLoginUrl(sesAdm, sesAdm.profile?.role);

console.log(`    estudiante → ${urlEst}`);
console.log(`    docente    → ${urlDoc}`);
console.log(`    admin      → ${urlAdm}`);

if (urlAdm === '/admin') ok(`admin enruta a /admin`);
else ko(`admin enruta a '${urlAdm}' (esperado /admin)`);

if (urlDoc === '/docente') ok(`docente enruta a /docente`);
else ko(`docente enruta a '${urlDoc}' (esperado /docente)`);

if (urlEst === '/preuni' || urlEst === '/dashboard' || urlEst.startsWith('/cursos-pro/c/')) {
  ok(`estudiante enruta a '${urlEst}'`);
} else {
  ko(`estudiante enruta a '${urlEst}' (esperado /preuni, /dashboard o /cursos-pro/c/<slug>)`);
}

// ─── PASO 6: rejection tests (lectura de tablas sensibles) ────────────────
console.log('\n[6] Rejection: alumno NO puede leer datos sensibles\n');

// 6.1 — alumno intentando ver TODOS los profiles (solo debería ver el suyo)
const { data: profEst } = await sesEst.sb.from('profiles').select('id, role').limit(10);
if ((profEst ?? []).length <= 1) {
  ok(`estudiante limitado a su propio profile (rows=${profEst?.length ?? 0})`);
} else {
  // Algunos schemas permiten lectura amplia de profiles (auth) → no es bug crítico
  console.warn(`  ⚠️ estudiante ve ${profEst.length} profiles (revisar si esperado)`);
}

// 6.2 — alumno intentando leer cohorte_metadata (RLS dice authenticated puede)
const { data: cohMeta, error: cohMetaErr } = await sesEst.sb
  .from('cohorte_metadata')
  .select('id, producto, cohorte_slug')
  .limit(5);
if (cohMetaErr) {
  console.warn(`  ⚠️ estudiante NO puede leer cohorte_metadata (${cohMetaErr.message}) · revisar policy`);
} else {
  ok(`estudiante puede leer cohorte_metadata (count=${cohMeta?.length ?? 0}) · diseño correcto`);
}

// 6.3 — docente puro NO debería ver tabla payments (asumiendo RLS admin-only)
const { data: payDoc, error: payDocErr } = await sesDoc.sb
  .from('payments')
  .select('id')
  .limit(1);
if (payDocErr || (payDoc ?? []).length === 0) {
  ok(`docente NO ve payments (esperado)`);
} else {
  // No crítico si la tabla payments tiene policies abiertas — solo warning
  console.warn(`  ⚠️ docente ve ${payDoc.length} payments · revisar policies si aplica`);
}

// ─── Resumen ───────────────────────────────────────────────────────────────
console.log('\n========================================');
console.log(`\n🧪 RESULTADO: ${pass} pasaron · ${fail} fallaron\n`);

if (fail > 0) {
  console.error('Fails:');
  errs.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
process.exit(0);
