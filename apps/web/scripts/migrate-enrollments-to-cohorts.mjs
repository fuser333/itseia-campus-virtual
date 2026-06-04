/**
 * Migración de datos · Campus v2 FASE 6
 * ----------------------------------------------------------------------------
 * Vincula los enrollments existentes (preuni + cursos-pro) a sus cohortes
 * de cohorte_metadata.
 *
 * Es IDEMPOTENTE: correr N veces produce el mismo resultado.
 * NO modifica columnas existentes (program_id, user_id, status, enrolled_at).
 * Solo setea las 2 columnas nuevas: producto + cohorte_slug.
 *
 * Para cursos profesionales: cursos_pro_enrollments NO usa la columna nueva
 * (la cohorte está implícita en course_id). Solo enriquecemos enrollments
 * (la tabla genérica) que NO contiene a Gisela. Para Gisela el linkage ya
 * existe vía course_id → slug = 'admin-salud' → cohorte_slug 'inca-gisela'.
 *
 * REQUISITO: migración 020 aplicada (columnas cohorte_slug, producto
 * existen en enrollments). El script verifica al inicio.
 *
 * Uso:
 *   node scripts/migrate-enrollments-to-cohorts.mjs            # dry-run
 *   node scripts/migrate-enrollments-to-cohorts.mjs --commit   # escribe
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

const COMMIT = process.argv.includes('--commit');
console.log(COMMIT ? 'MODO COMMIT (escribe en producción)' : 'DRY-RUN (no escribe)');

const admin = createClient(SUP_URL, SUP_SR, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// IDs canónicos
const PREUNI_PROGRAM_ID = '958d9795-8958-450e-828a-ff24eb4b0f00';
const PREUNI_COHORTE_SLUG = 'cohorte-jun-2026';
const PREUNI_PRODUCTO = 'preuni';

// 1) Verificar que migración 020 está aplicada
console.log('\n[1] Verificando columnas nuevas en enrollments...');
{
  const { error } = await admin
    .from('enrollments')
    .select('id, cohorte_slug, producto')
    .limit(1);
  if (error) {
    console.error('   ❌ Columnas cohorte_slug/producto NO existen. Aplicar migración 020 primero.');
    console.error('   Mensaje:', error.message);
    process.exit(1);
  }
  console.log('   ✅ Columnas existen.');
}

// 2) Verificar que cohorte_metadata tiene la cohorte preuni
console.log('\n[2] Verificando cohorte_metadata...');
{
  const { data, error } = await admin
    .from('cohorte_metadata')
    .select('producto, cohorte_slug')
    .eq('producto', PREUNI_PRODUCTO)
    .eq('cohorte_slug', PREUNI_COHORTE_SLUG)
    .maybeSingle();
  if (error || !data) {
    console.error(`   ❌ Cohorte ${PREUNI_PRODUCTO}/${PREUNI_COHORTE_SLUG} NO existe en cohorte_metadata. Correr seed-campus-v2-foundations.mjs primero.`);
    process.exit(1);
  }
  console.log(`   ✅ Cohorte ${PREUNI_PRODUCTO}/${PREUNI_COHORTE_SLUG} existe.`);
}

// 3) Listar enrollments preuni
console.log('\n[3] Enrollments preuni a migrar:');
const { data: enrollPre, error: eErr } = await admin
  .from('enrollments')
  .select('id, user_id, program_id, status, producto, cohorte_slug, enrolled_at')
  .eq('program_id', PREUNI_PROGRAM_ID);

if (eErr) {
  console.error('   ❌', eErr.message);
  process.exit(1);
}
console.log(`   total = ${enrollPre.length}`);

let toUpdate = 0;
let alreadyDone = 0;
for (const e of enrollPre) {
  if (e.producto === PREUNI_PRODUCTO && e.cohorte_slug === PREUNI_COHORTE_SLUG) {
    alreadyDone++;
  } else {
    toUpdate++;
    console.log(`   · ${e.id.slice(0, 8)} user=${e.user_id.slice(0, 8)} producto=${e.producto ?? 'null'} cohorte=${e.cohorte_slug ?? 'null'} → ${PREUNI_PRODUCTO}/${PREUNI_COHORTE_SLUG}`);
  }
}
console.log(`   ya migrados: ${alreadyDone} · a migrar: ${toUpdate}`);

// 4) Update (si COMMIT)
if (COMMIT && toUpdate > 0) {
  console.log(`\n[4] Aplicando UPDATE en ${toUpdate} enrollments...`);
  const { error: uErr, count } = await admin
    .from('enrollments')
    .update({ producto: PREUNI_PRODUCTO, cohorte_slug: PREUNI_COHORTE_SLUG }, { count: 'exact' })
    .eq('program_id', PREUNI_PROGRAM_ID)
    .is('cohorte_slug', null);
  if (uErr) {
    console.error('   ❌', uErr.message);
    process.exit(1);
  }
  console.log(`   ✅ filas actualizadas: ${count}`);
} else if (toUpdate > 0) {
  console.log(`\n[4] (DRY-RUN) actualizaría ${toUpdate} enrollments.`);
} else {
  console.log(`\n[4] Nada que actualizar.`);
}

// 5) Re-verificar
console.log('\n[5] Estado final enrollments preuni:');
{
  const { data, error } = await admin
    .from('enrollments')
    .select('producto, cohorte_slug')
    .eq('program_id', PREUNI_PROGRAM_ID);
  if (error) { console.error(error.message); process.exit(1); }
  const buckets = {};
  for (const r of data) {
    const k = `${r.producto ?? 'null'} / ${r.cohorte_slug ?? 'null'}`;
    buckets[k] = (buckets[k] ?? 0) + 1;
  }
  Object.entries(buckets).forEach(([k, v]) => console.log(`   · ${k}: ${v}`));
}

// 6) Nota Gisela: NO se migra a enrollments — su tabla es cursos_pro_enrollments
// y el binding lógico es course.slug = 'admin-salud' → cohorte_metadata.cohorte_slug = 'inca-gisela'.
console.log('\n[6] cursos_pro_enrollments (Gisela/Josselin): no requiere migración.');
console.log('    El mapeo course.slug = "admin-salud" ↔ cohorte_metadata "cursos-pro/inca-gisela"');
console.log('    está manejado por el front (src/lib/alumno/enrollments.ts).');

console.log(`\n${COMMIT ? '✅ Migración aplicada.' : 'Dry-run OK. Pasa --commit para aplicar.'}\n`);
