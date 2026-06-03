/**
 * Seed inicial · Campus v2 FASE 1 (foundations)
 *
 * Crea:
 *   · 1 assignment Héctor → preuni → cohorte-jun-2026
 *   · 1 assignment Héctor → cursos-pro → inca-gisela
 *   · cohorte_metadata para "preuni / cohorte-jun-2026"
 *   · cohorte_metadata para "cursos-pro / inca-gisela"
 *
 * ⚠️ NO se corre automáticamente. CEO lo corre después de aplicar
 *    la migration 019 en Supabase SQL Editor.
 *
 * Uso (después de migration aplicada):
 *   cd apps/web && node scripts/seed-campus-v2-foundations.mjs
 *
 * Dry-run (no hace inserts, solo valida que encuentra a Héctor):
 *   DRY_RUN=1 node scripts/seed-campus-v2-foundations.mjs
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUP_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUP_SR  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.env.DRY_RUN === '1';

if (!SUP_URL || !SUP_SR) {
  console.error('❌ Faltan env vars NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const admin = createClient(SUP_URL, SUP_SR, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const HECTOR_EMAIL = 'administracion@itseia.ai';

const cohortes = [
  {
    producto: 'preuni',
    cohorte_slug: 'cohorte-jun-2026',
    nombre_publico: 'Cohorte Junio 2026',
    fecha_inicio: '2026-06-03',
    fecha_fin: '2026-07-03',
    meet_url: 'https://meet.google.com/qox-bghu-mbe',
    estado: 'activa',
    cliente_referencia: null,
  },
  {
    producto: 'cursos-pro',
    cohorte_slug: 'inca-gisela',
    nombre_publico: 'Gisela Inca + Josselin Montero - Admin Salud',
    fecha_inicio: '2026-06-06',
    fecha_fin: '2026-08-06',
    meet_url: 'https://meet.google.com/placeholder-inca-gisela',
    estado: 'planificada',
    cliente_referencia: 'Gisela Estefanía Inca Pontón',
  },
];

console.log(`\n🌱 Seed Campus v2 · FASE 1 foundations · ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

// ─────────────────────────────────────────────────────────────────────────────
// Paso 1: encontrar a Héctor en profiles
// ─────────────────────────────────────────────────────────────────────────────
const { data: hector, error: hErr } = await admin
  .from('profiles')
  .select('id, email, full_name, role')
  .eq('email', HECTOR_EMAIL)
  .maybeSingle();

if (hErr) {
  console.error(`❌ Error buscando a Héctor: ${hErr.message}`);
  process.exit(1);
}
if (!hector) {
  console.error(`❌ No se encontró profile con email ${HECTOR_EMAIL}`);
  console.error(`   ¿Está creado el usuario? Crear en Supabase Auth + profiles primero.`);
  process.exit(1);
}

console.log(`✅ Héctor encontrado · id=${hector.id.slice(0, 8)}... · role=${hector.role}`);

if (DRY_RUN) {
  console.log(`\n[DRY RUN] No se hicieron inserts. Cohortes a crear:`);
  cohortes.forEach((c) => console.log(`  · ${c.producto} / ${c.cohorte_slug} → "${c.nombre_publico}"`));
  console.log(`\n[DRY RUN] Assignments a crear:`);
  cohortes.forEach((c) => console.log(`  · Héctor → ${c.producto} / ${c.cohorte_slug}`));
  console.log(`\nOK. Quita DRY_RUN=1 para ejecutar.\n`);
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Paso 2: upsert cohorte_metadata (idempotente por UNIQUE(producto, cohorte_slug))
// ─────────────────────────────────────────────────────────────────────────────
for (const c of cohortes) {
  const { error } = await admin
    .from('cohorte_metadata')
    .upsert(c, { onConflict: 'producto,cohorte_slug' });

  if (error) {
    console.error(`❌ cohorte_metadata ${c.producto}/${c.cohorte_slug}: ${error.message}`);
    process.exit(1);
  }
  console.log(`✅ cohorte_metadata · ${c.producto} / ${c.cohorte_slug}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Paso 3: upsert assignments Héctor → ambas cohortes
// ─────────────────────────────────────────────────────────────────────────────
for (const c of cohortes) {
  const row = {
    docente_id: hector.id,
    producto: c.producto,
    cohorte_slug: c.cohorte_slug,
    rol_en_cohorte: 'titular',
    activo: true,
  };
  const { error } = await admin
    .from('docente_cohorte_assignments')
    .upsert(row, { onConflict: 'docente_id,producto,cohorte_slug' });

  if (error) {
    console.error(`❌ assignment ${c.producto}/${c.cohorte_slug}: ${error.message}`);
    process.exit(1);
  }
  console.log(`✅ assignment Héctor → ${c.producto} / ${c.cohorte_slug}`);
}

console.log(`\n🎉 Seed Campus v2 FASE 1 listo.\n`);
