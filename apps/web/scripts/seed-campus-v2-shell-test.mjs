/**
 * Seed test · Campus v2 FASE 2 (shell alumno)
 *
 * Crea infraestructura mínima para probar el shell `/[producto]/...` del v2:
 *  · cohorte_metadata "mdt / cohorte-test-mdt" (producto sin legacy → la
 *    ruta dinámica [producto] sí captura este path).
 *  · 3 sesiones en cohorte_sesiones (1 done · 1 live · 1 scheduled).
 *
 * NO crea enrollment (los enrollments del alumno viven en `enrollments`
 * para preuni y `cursos_pro_enrollments` para cursos-pro · MDT aún no tiene
 * su propia tabla de enrollment formalizada en BD).
 *
 * Para QA manual del shell v2:
 *  · Usar la ruta `/mdt` mientras Xavier/Gisela ven sus rutas legacy normales.
 *  · El smoke test real de fase 6 unificará los enrollments.
 *
 * Uso:
 *   node scripts/seed-campus-v2-shell-test.mjs              # dry-run
 *   node scripts/seed-campus-v2-shell-test.mjs --commit     # escribe
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUP_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUP_SR  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const COMMIT  = process.argv.includes('--commit');

if (!SUP_URL || !SUP_SR) {
  console.error('❌ Faltan env vars NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const admin = createClient(SUP_URL, SUP_SR, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log(COMMIT ? '🚀 MODO COMMIT' : '🧪 DRY-RUN');

const cohorte = {
  producto: 'mdt',
  cohorte_slug: 'cohorte-test-mdt',
  nombre_publico: 'Cohorte Test MDT — Campus v2 Shell',
  fecha_inicio: '2026-06-10',
  fecha_fin: '2026-09-10',
  meet_url: 'https://meet.google.com/test-mdt-shell',
  estado: 'activa',
  cliente_referencia: null,
};

if (!COMMIT) {
  console.log(`\n[DRY] cohorte_metadata: ${cohorte.producto}/${cohorte.cohorte_slug}`);
  console.log(`[DRY] cohorte_sesiones: 3 sesiones (1 done, 1 live, 1 scheduled)`);
  console.log(`\nOK. Re-correr con --commit para escribir.\n`);
  process.exit(0);
}

// ── 1. Upsert cohorte_metadata ────────────────────────────────────────────
const { data: cohorteRow, error: cErr } = await admin
  .from('cohorte_metadata')
  .upsert(cohorte, { onConflict: 'producto,cohorte_slug' })
  .select('id')
  .single();

if (cErr) {
  console.error(`❌ cohorte_metadata: ${cErr.message}`);
  process.exit(1);
}
console.log(`✅ cohorte_metadata ${cohorte.producto}/${cohorte.cohorte_slug} id=${cohorteRow.id}`);

// ── 2. Sesiones ───────────────────────────────────────────────────────────
const sesiones = [
  {
    cohorte_id: cohorteRow.id,
    numero: 1,
    titulo: 'Introducción al curso MDT',
    fecha_programada: '2026-06-10T22:30:00Z', // 17:30 EC
    duracion_minutos: 120,
    meet_url: cohorte.meet_url,
    status: 'done',
  },
  {
    cohorte_id: cohorteRow.id,
    numero: 2,
    titulo: 'Sesión en vivo — IA aplicada',
    fecha_programada: new Date().toISOString(),
    duracion_minutos: 120,
    meet_url: cohorte.meet_url,
    status: 'live',
  },
  {
    cohorte_id: cohorteRow.id,
    numero: 3,
    titulo: 'Caso práctico',
    fecha_programada: '2026-06-17T22:30:00Z',
    duracion_minutos: 120,
    meet_url: cohorte.meet_url,
    status: 'scheduled',
  },
];

for (const s of sesiones) {
  const { error } = await admin
    .from('cohorte_sesiones')
    .upsert(s, { onConflict: 'cohorte_id,numero' });
  if (error) {
    console.error(`❌ sesion ${s.numero}: ${error.message}`);
    process.exit(1);
  }
  console.log(`✅ sesion #${s.numero} (${s.status}) · ${s.titulo}`);
}

console.log(`\n🎉 Seed test FASE 2 listo.\n`);
console.log(`Para probar el shell v2:`);
console.log(`  · Loguearse con cualquier estudiante`);
console.log(`  · Visitar /mdt (no tiene legacy → renderiza shell v2)`);
console.log(`  · NOTA: el alumno necesita un enrollment en programs.type='mdt'`);
console.log(`    para que el dashboard cargue. Si no, redirige a /dashboard.\n`);
