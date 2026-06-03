// Crea curso "IA Aplicada a Administración del Área de Salud" + 2 alumnas
// (Gisela Inca + Josselin Montero) en cursos_pro_* (migration 017).
//
// MODO PRUEBA: email_confirm:true → NO envía email de confirmación.
// El CEO comunica credenciales manualmente a las alumnas.
//
// Uso:
//   node scripts/seed-curso-gisela-josselin.mjs              # dry-run
//   node scripts/seed-curso-gisela-josselin.mjs --commit     # escribe

import { config as loadDotenv } from 'dotenv';
loadDotenv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
  console.error('❌ Faltan envs en .env.local (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const COMMIT = process.argv.includes('--commit');
console.log(COMMIT ? '🚀 MODO COMMIT (escribe en producción)' : '🧪 DRY-RUN (no escribe)');
console.log('');

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── 1. Datos del curso ──────────────────────────────────────────────────

const COURSE = {
  slug: 'admin-salud',
  name: 'IA Aplicada a Administración del Área de Salud',
  subtitle: 'Cohorte junio 2026 · 5 módulos · 8 sesiones · 40 horas',
  description:
    'Domina ChatGPT, Claude, Gemini, Copilot y Canva IA para gestión hospitalaria, facturación, tributario salud y KPIs. Incluye fundamentos LOPDP Ecuador y proyecto final aplicado a tu área.',
  category: 'Administración de salud',
  price_usd: 99.0,
  total_hours: 40.0,
  total_sessions: 8,
  total_modules: 5,
  start_date: '2026-06-06',
  end_date: '2026-07-02',
  is_active: true,
};

const MODULES = [
  { num: 1, name: 'Fundamentos IA + LOPDP Ecuador',                              hours: 8 },
  { num: 2, name: 'Herramientas Pro: ChatGPT + Claude + Gemini + Copilot + Canva IA', hours: 8 },
  { num: 3, name: 'Gestión Hospitalaria con IA',                                 hours: 8 },
  { num: 4, name: 'Facturación + Tributario Salud + KPIs',                       hours: 8 },
  { num: 5, name: 'Proyecto Final con Héctor',                                   hours: 8 },
];

// Helper Meet placeholder — Héctor reemplaza después con URLs reales.
function placeholderMeet(num) {
  return `https://meet.google.com/lookup/admin-salud-s${num}`;
}

// IMPORTANTE: 8 PM Ecuador (UTC-5) = 01:00 UTC del día SIGUIENTE.
// Ej: "vie 6 jun 8 PM ECT" → 2026-06-07T01:00:00.000Z
const SESSIONS = [
  {
    num: 1, moduleNum: 1,
    title: 'Fundamentos de IA + LOPDP Ecuador',
    description: 'Qué es IA generativa, casos reales en administración de salud, marco legal LOPDP y datos sensibles.',
    scheduled_at: '2026-06-07T01:00:00.000Z', // vie 6 jun 8 PM ECT
    duration_minutes: 120,
  },
  {
    num: 2, moduleNum: 2,
    title: 'ChatGPT y Claude Pro — Parte 1',
    description: 'Prompts profesionales, sesiones largas, project management con LLMs.',
    scheduled_at: '2026-06-12T01:00:00.000Z', // mié 11 jun 8 PM ECT
    duration_minutes: 60,
  },
  {
    num: 3, moduleNum: 2,
    title: 'Gemini + Copilot + Canva IA — Cierre M2',
    description: 'Stack completo: cuándo usar cada herramienta. Casos prácticos para administración.',
    scheduled_at: '2026-06-14T01:00:00.000Z', // vie 13 jun 8 PM ECT
    duration_minutes: 120,
  },
  {
    num: 4, moduleNum: 3,
    title: 'Gestión Hospitalaria con IA — Parte 1',
    description: 'Agendamiento inteligente, predicción de inasistencias, comunicación con pacientes.',
    scheduled_at: '2026-06-19T01:00:00.000Z', // mié 18 jun 8 PM ECT
    duration_minutes: 60,
  },
  {
    num: 5, moduleNum: 3,
    title: 'Gestión Hospitalaria con IA — Cierre M3',
    description: 'Casos ARMADA, ADIUM, ImagemIA. Diseño de workflow propio.',
    scheduled_at: '2026-06-21T01:00:00.000Z', // vie 20 jun 8 PM ECT
    duration_minutes: 120,
  },
  {
    num: 6, moduleNum: 4,
    title: 'Facturación + Tributario Salud con IA — Parte 1',
    description: 'Automatización de facturas, retenciones, reportes SRI. Bots de cobranza.',
    scheduled_at: '2026-06-26T01:00:00.000Z', // mié 25 jun 8 PM ECT
    duration_minutes: 60,
  },
  {
    num: 7, moduleNum: 4,
    title: 'KPIs e indicadores con IA — Cierre M4',
    description: 'Dashboards inteligentes, alertas automáticas, reportes ejecutivos.',
    scheduled_at: '2026-06-28T01:00:00.000Z', // vie 27 jun 8 PM ECT
    duration_minutes: 120,
  },
  {
    num: 8, moduleNum: 5,
    title: 'Proyecto Final con Héctor',
    description: 'Presentación del proyecto aplicado de cada alumna. Mentoría 1:1 con Héctor.',
    scheduled_at: '2026-07-03T01:00:00.000Z', // mié 2 jul 8 PM ECT
    duration_minutes: 60,
  },
];

// ─── 2. Alumnas ──────────────────────────────────────────────────────────

const ALUMNAS = [
  {
    full_name: 'Jisela Estefanía Inca Pontón',
    email: 'estefaniaponton47@gmail.com',
    password: 'Itseia2026!Gisela',
    phone: '0964141359',
    amount_paid: 99.0,
    payment_ref: 'Produbanco 27059145711 · transferencia manual jun 2026',
    notes: 'Gisela (apodo). Ciudad: Riobamba. Sector salud.',
  },
  {
    full_name: 'Josselin Montero',
    email: 'josselin.montero@espoch.edu.ec',
    password: 'Itseia2026!Josselin',
    phone: '',
    amount_paid: 99.0,
    payment_ref: 'Produbanco 27059145711 · transferencia manual jun 2026',
    notes: 'Estudiante ESPOCH · sector finanzas-salud.',
  },
];

const ACCESS_UNTIL = '2026-10-05'; // 3 meses post-curso

const results = {
  course: null,
  modules: [],
  sessions: [],
  enrollments: [],
};

// ─── 3. Upsert curso ─────────────────────────────────────────────────────

console.log('──── Curso ────');
console.log(`  ${COURSE.slug} · ${COURSE.name}`);

if (COMMIT) {
  // ¿Ya existe?
  const { data: existing } = await admin
    .from('cursos_pro_courses')
    .select('id, slug')
    .eq('slug', COURSE.slug)
    .maybeSingle();

  let courseId;
  if (existing) {
    courseId = existing.id;
    console.log(`  ↻ ya existía (${courseId.slice(0, 8)}). Actualizando datos...`);
    const { error } = await admin
      .from('cursos_pro_courses')
      .update(COURSE)
      .eq('id', courseId);
    if (error) {
      console.error(`  ❌ update course:`, error.message);
      process.exit(1);
    }
  } else {
    const { data, error } = await admin
      .from('cursos_pro_courses')
      .insert(COURSE)
      .select('id')
      .single();
    if (error) {
      console.error(`  ❌ insert course:`, error.message);
      process.exit(1);
    }
    courseId = data.id;
    console.log(`  ✅ creado (${courseId.slice(0, 8)})`);
  }
  results.course = { id: courseId, ...COURSE };

  // ─── 4. Módulos ──────────────────────────────────────────────────
  console.log('\n──── Módulos (5) ────');
  for (const m of MODULES) {
    const { data: existingM } = await admin
      .from('cursos_pro_modules')
      .select('id')
      .eq('course_id', courseId)
      .eq('num', m.num)
      .maybeSingle();
    let moduleId;
    if (existingM) {
      moduleId = existingM.id;
      await admin.from('cursos_pro_modules').update(m).eq('id', moduleId);
      console.log(`  ↻ M${m.num} actualizado`);
    } else {
      const { data, error } = await admin
        .from('cursos_pro_modules')
        .insert({ ...m, course_id: courseId })
        .select('id')
        .single();
      if (error) {
        console.error(`  ❌ M${m.num}:`, error.message);
        continue;
      }
      moduleId = data.id;
      console.log(`  ✅ M${m.num} · ${m.name}`);
    }
    results.modules.push({ id: moduleId, ...m });
  }

  // ─── 5. Sesiones ─────────────────────────────────────────────────
  console.log('\n──── Sesiones (8) ────');
  for (const s of SESSIONS) {
    const mod = results.modules.find((m) => m.num === s.moduleNum);
    const payload = {
      course_id: courseId,
      module_id: mod?.id ?? null,
      num: s.num,
      title: s.title,
      description: s.description,
      scheduled_at: s.scheduled_at,
      duration_minutes: s.duration_minutes,
      meet_url: placeholderMeet(s.num),
      status: 'scheduled',
      quiz_json: [],
      resources_json: [],
      ailab_config_json: {},
    };
    const { data: existingS } = await admin
      .from('cursos_pro_sessions')
      .select('id')
      .eq('course_id', courseId)
      .eq('num', s.num)
      .maybeSingle();
    let sessionId;
    if (existingS) {
      sessionId = existingS.id;
      // No sobreescribimos meet_url / status / json si ya fueron seteados por Héctor.
      const { error } = await admin
        .from('cursos_pro_sessions')
        .update({
          module_id: payload.module_id,
          title: payload.title,
          description: payload.description,
          scheduled_at: payload.scheduled_at,
          duration_minutes: payload.duration_minutes,
        })
        .eq('id', sessionId);
      if (error) {
        console.error(`  ❌ update S${s.num}:`, error.message);
      } else {
        console.log(`  ↻ S${s.num} actualizada`);
      }
    } else {
      const { data, error } = await admin
        .from('cursos_pro_sessions')
        .insert(payload)
        .select('id')
        .single();
      if (error) {
        console.error(`  ❌ S${s.num}:`, error.message);
        continue;
      }
      sessionId = data.id;
      console.log(`  ✅ S${s.num} · ${s.title} (${s.scheduled_at})`);
    }
    results.sessions.push({ id: sessionId, ...s });
  }
} else {
  console.log('  + (dry-run) crearía curso, 5 módulos, 8 sesiones');
}

// ─── 6. Alumnas ──────────────────────────────────────────────────────────

console.log('\n──── Alumnas (2) ────');
for (const a of ALUMNAS) {
  console.log(`\n  ${a.full_name} (${a.email})`);

  if (!COMMIT) {
    console.log(`    + (dry-run) crearía usuario + enrollment`);
    results.enrollments.push({ ...a, status: 'DRY_RUN' });
    continue;
  }

  // Paso 1: auth.user
  const { data: list } = await admin.auth.admin.listUsers();
  const existing = list?.users?.find(
    (u) => u.email?.toLowerCase() === a.email.toLowerCase()
  );
  let userId;
  if (existing) {
    userId = existing.id;
    console.log(`    ↻ auth.user ya existía (${userId.slice(0, 8)})`);
    await admin.auth.admin.updateUserById(userId, {
      password: a.password,
      email_confirm: true,
    });
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: a.email,
      password: a.password,
      email_confirm: true,
      user_metadata: {
        full_name: a.full_name,
        phone: a.phone,
        track: 'curso_pro',
      },
    });
    if (error) {
      console.error(`    ❌ createUser:`, error.message);
      results.enrollments.push({ ...a, status: 'ERR_CREATE', error: error.message });
      continue;
    }
    userId = data.user.id;
    console.log(`    ✅ auth.user creado (${userId.slice(0, 8)})`);
  }

  // Paso 2: upsert profile
  const { error: pErr } = await admin.from('profiles').upsert({
    id: userId,
    email: a.email,
    full_name: a.full_name,
    role: 'estudiante',
  });
  if (pErr) {
    console.error(`    ❌ profile:`, pErr.message);
    results.enrollments.push({ ...a, userId, status: 'ERR_PROFILE', error: pErr.message });
    continue;
  }

  // Paso 3: enrollment
  const { data: existingEnr } = await admin
    .from('cursos_pro_enrollments')
    .select('id, status')
    .eq('profile_id', userId)
    .eq('course_id', results.course.id)
    .maybeSingle();
  if (existingEnr) {
    if (existingEnr.status !== 'active') {
      await admin
        .from('cursos_pro_enrollments')
        .update({ status: 'active' })
        .eq('id', existingEnr.id);
      console.log(`    ↻ enrollment reactivado`);
    } else {
      console.log(`    ↻ enrollment ya activo`);
    }
  } else {
    const { error: eErr } = await admin
      .from('cursos_pro_enrollments')
      .insert({
        course_id: results.course.id,
        profile_id: userId,
        paid_at: new Date().toISOString(),
        amount_paid: a.amount_paid,
        payment_ref: a.payment_ref,
        access_until: ACCESS_UNTIL,
        status: 'active',
        notes: a.notes,
      });
    if (eErr) {
      console.error(`    ❌ enrollment:`, eErr.message);
      results.enrollments.push({ ...a, userId, status: 'ERR_ENROLL', error: eErr.message });
      continue;
    }
    console.log(`    ✅ enrollment activo (access_until=${ACCESS_UNTIL})`);
  }

  results.enrollments.push({ ...a, userId, status: 'OK' });
}

if (!COMMIT) {
  console.log('\n📋 DRY-RUN OK. Para escribir corré:\n  node scripts/seed-curso-gisela-josselin.mjs --commit');
  process.exit(0);
}

// ─── 7. Verificación con anon key + RLS ──────────────────────────────────

console.log('\n\n══════ VERIFICACIÓN con anon key + signInWithPassword ══════');
const anon = createClient(SUPABASE_URL, ANON_KEY);

for (const r of results.enrollments) {
  if (r.status !== 'OK') continue;
  console.log(`\n  → ${r.email}`);
  const { data: sess, error: sErr } = await anon.auth.signInWithPassword({
    email: r.email,
    password: r.password,
  });
  if (sErr) {
    console.error(`    ❌ login:`, sErr.message);
    r.verify = 'LOGIN_FAIL';
    continue;
  }
  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: {
      headers: { Authorization: `Bearer ${sess.session.access_token}` },
    },
  });
  // Lee profile.role (regla blindada #1)
  const { data: prof, error: pErr } = await userClient
    .from('profiles')
    .select('role')
    .eq('id', sess.user.id)
    .single();
  if (pErr) {
    console.error(`    ❌ select profile (RLS recursion?):`, pErr.message);
    r.verify = 'RLS_FAIL';
    await anon.auth.signOut();
    continue;
  }
  // Lee enrollment propio
  const { data: enr, error: eErr } = await userClient
    .from('cursos_pro_enrollments')
    .select('course_id, status')
    .eq('profile_id', sess.user.id);
  if (eErr) {
    console.error(`    ❌ select enrollment:`, eErr.message);
    r.verify = 'RLS_ENR_FAIL';
    await anon.auth.signOut();
    continue;
  }
  // Lee sesiones del curso (RLS solo permite si tiene enrollment activo)
  const { data: sessions, error: ssErr } = await userClient
    .from('cursos_pro_sessions')
    .select('id, num, title');
  if (ssErr) {
    console.error(`    ❌ select sessions:`, ssErr.message);
    r.verify = 'RLS_SESS_FAIL';
    await anon.auth.signOut();
    continue;
  }
  console.log(
    `    ✅ login OK · role=${prof.role} · enrollments=${enr?.length ?? 0} · sesiones visibles=${sessions?.length ?? 0}`
  );
  r.verify = 'OK';
  await anon.auth.signOut();
}

// ─── 8. MD de credenciales (fuera de git) ────────────────────────────────

const secretsDir = path.resolve(__dirname, '../../../../../.secrets');
fs.mkdirSync(secretsDir, { recursive: true });
const credPath = path.join(secretsDir, 'credenciales_curso_admin_salud_jun2026.md');

const md = `# 🔐 Credenciales curso "${COURSE.name}" — ${new Date().toISOString().slice(0, 10)}

⚠️ NO COMPARTIR sin permiso explícito de Héctor. NO commitear este archivo.

URL login: https://tecnologico.itseia.ai/login?module=cursos-pro
URL curso: https://tecnologico.itseia.ai/cursos-pro/c/${COURSE.slug}
URL docente: https://tecnologico.itseia.ai/cursos-pro/docente/${COURSE.slug}

Curso: ${COURSE.name}
Slug: ${COURSE.slug}
Inicio: ${COURSE.start_date}  ·  Fin: ${COURSE.end_date}
Sesiones: 8 · Módulos: 5 · Horas: 40

| # | Nombre | Email | Password | WhatsApp | Status | Login test |
|---|--------|-------|----------|----------|--------|------------|
${results.enrollments
  .map(
    (r, i) =>
      `| ${i + 1} | ${r.full_name} | ${r.email} | \`${r.password}\` | ${r.phone || '-'} | ${r.status} | ${r.verify ?? '-'} |`
  )
  .join('\n')}

## Sesiones programadas
${results.sessions
  .map((s) => `- S${s.num} · ${s.title} · ${s.scheduled_at} · ${s.duration_minutes} min`)
  .join('\n')}

## Recordatorio del CEO
Estas cuentas se crearon con \`email_confirm: true\` → NO se envió email
automático de Supabase a las alumnas. Héctor las comunica manualmente
cuando decida (regla "modo prueba, sin envíos automáticos").
`;

fs.writeFileSync(credPath, md);
console.log(`\n\n✅ Credenciales guardadas en: ${credPath}`);
console.log('\nResultado final:');
console.log(`  Curso: ${results.course?.id?.slice(0, 8) ?? 'NO'}`);
console.log(`  Módulos: ${results.modules.length}`);
console.log(`  Sesiones: ${results.sessions.length}`);
results.enrollments.forEach((r) =>
  console.log(`  ${r.status === 'OK' ? '✅' : '❌'} ${r.email} · status=${r.status} · login=${r.verify ?? '-'}`)
);
