/**
 * Aplica migración 022 (cursos_pro_module_slug_and_num_in_module) a la DB de Supabase.
 *
 * Modos:
 *   · Con SUPABASE_DB_URL en .env.local o env → corre vía `pg` directo.
 *   · Sin SUPABASE_DB_URL → imprime el SQL y pide aplicar manualmente en
 *     Supabase SQL Editor (proyecto wqlselfapnggxxeziruo).
 *
 * Después de aplicar, corre la verificación integrada al final del script.
 *
 * Uso:
 *   cd apps/web/apps/web
 *   node scripts/apply-migration-022.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '../../.env.local' });
dotenv.config({ path: '../../.env.local.bak' });

const __dirname = dirname(fileURLToPath(import.meta.url));
// Script está en apps/web/apps/web/scripts/
// Migración está en apps/web/supabase/migrations/
// Ruta relativa: scripts → apps/web → apps/ → apps/web (arriba) → supabase/migrations
const MIGRATION_PATH = resolve(
  __dirname,
  '../../../supabase/migrations/022_cursos_pro_module_slug_and_num_in_module.sql'
);

const SUP_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUP_SR  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DB_URL  = process.env.SUPABASE_DB_URL;

if (!SUP_URL || !SUP_SR) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const sql = readFileSync(MIGRATION_PATH, 'utf-8');

const admin = createClient(SUP_URL, SUP_SR, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function alreadyApplied() {
  // Verifica si las columnas ya existen consultando vía REST
  const { error } = await admin
    .from('cursos_pro_modules')
    .select('id, slug')
    .limit(1);
  // Si no hay error, la columna slug existe (migration ya aplicada)
  if (!error) {
    // Verificar también num_in_module
    const { error: e2 } = await admin
      .from('cursos_pro_sessions')
      .select('id, num_in_module')
      .limit(1);
    return !e2;
  }
  return false;
}

console.log('Verificando si la migración 022 ya fue aplicada...');
if (await alreadyApplied()) {
  console.log('Migración 022 YA está aplicada (columnas slug y num_in_module existen).');
  console.log('Corriendo solo la verificación de datos...');
  await runVerification();
  process.exit(0);
}

if (DB_URL) {
  console.log('Aplicando 022 vía SUPABASE_DB_URL (psql direct)...');
  const { default: pg } = await import('pg');
  const client = new pg.Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(sql);
    console.log('Migración 022 aplicada exitosamente.');
  } catch (err) {
    console.error('ERROR al aplicar migración:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
  await runVerification();
} else {
  console.log('');
  console.log('==============================================================');
  console.log(' SUPABASE_DB_URL no definida.');
  console.log(' Aplicar 022 manualmente vía Supabase SQL Editor:');
  console.log('==============================================================');
  console.log('');
  console.log(' 1. Abrir: https://supabase.com/dashboard/project/wqlselfapnggxxeziruo/sql/new');
  console.log(' 2. Pegar el contenido del archivo:');
  console.log(`    ${MIGRATION_PATH}`);
  console.log(' 3. Click "Run".');
  console.log(' 4. Correr verificación:');
  console.log('    node scripts/apply-migration-022.mjs');
  console.log('');
  process.exit(2);
}

async function runVerification() {
  console.log('\n── Verificación post-022 ──────────────────────────────────');

  // a) Módulos de admin-salud
  const { data: modulos, error: em } = await admin
    .from('cursos_pro_modules')
    .select('num, name, slug, course_id')
    .order('num', { ascending: true });

  if (em) { console.error('Error al consultar módulos:', em.message); return; }

  // Filtrar solo admin-salud (course_id del curso slug=admin-salud)
  const { data: curso } = await admin
    .from('cursos_pro_courses')
    .select('id')
    .eq('slug', 'admin-salud')
    .single();

  const adminSaludId = curso?.id;
  const modAdminSalud = modulos.filter(m => m.course_id === adminSaludId);

  console.log(`\nMódulos de admin-salud (${modAdminSalud.length} filas):`);
  modAdminSalud.forEach(m => {
    const ok = m.slug ? 'OK' : 'NULL!';
    console.log(`  M${m.num}  slug="${m.slug || 'NULL'}"  [${ok}]`);
  });
  const modNulls = modAdminSalud.filter(m => !m.slug).length;

  // b) Sesiones con num_in_module
  const { data: sesiones, error: es } = await admin
    .from('cursos_pro_sessions')
    .select('num, num_in_module, title, module_id')
    .eq('course_id', adminSaludId)
    .order('num', { ascending: true });

  if (es) { console.error('Error al consultar sesiones:', es.message); return; }

  console.log(`\nSesiones de admin-salud con num_in_module (${sesiones.length} filas):`);

  // Agrupar por módulo
  const byModule = {};
  sesiones.forEach(s => {
    if (!byModule[s.module_id]) byModule[s.module_id] = [];
    byModule[s.module_id].push(s);
  });
  Object.entries(byModule).forEach(([mid, ss]) => {
    const m = modAdminSalud.find(m => m.id === mid || mid.startsWith(m.course_id?.slice(0,4)));
    ss.forEach(s => {
      const ok = s.num_in_module != null ? 'OK' : 'NULL!';
      console.log(`  num=${s.num}  num_in_module=${s.num_in_module ?? 'NULL'}  [${ok}]  ${s.title.slice(0, 50)}`);
    });
  });

  const sesNulls = sesiones.filter(s => s.num_in_module == null).length;

  // Resumen
  console.log('\n── Resumen ────────────────────────────────────────────────');
  console.log(`  Módulos sin slug    : ${modNulls} (debe ser 0)`);
  console.log(`  Sesiones sin num    : ${sesNulls} (debe ser 0)`);
  console.log(`  Total módulos       : ${modAdminSalud.length} (debe ser 5)`);
  console.log(`  Total sesiones      : ${sesiones.length} (debe ser 20)`);

  if (modNulls === 0 && sesNulls === 0 && modAdminSalud.length === 5 && sesiones.length === 20) {
    console.log('\n  VERIFICACION EXITOSA — Migration 022 aplicada y datos correctos.');
  } else {
    console.log('\n  ATENCION: Hay datos incorrectos. Revisar backfill.');
    process.exit(1);
  }
}
