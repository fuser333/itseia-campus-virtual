/**
 * Aplica migración 022 directamente usando la Management API de Supabase.
 * No requiere SUPABASE_DB_URL. Usa el service role key y la REST API.
 *
 * La Supabase Management API tiene un endpoint de SQL:
 *   POST https://api.supabase.com/v1/projects/{ref}/database/query
 *   Authorization: Bearer {management_api_token}
 *
 * Si no hay management token, intentamos via pg directo con la URL de pooler.
 * La URL del pooler de Supabase es:
 *   postgresql://postgres.{ref}:{db_password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres
 *
 * Uso:
 *   node scripts/apply-migration-022-via-pg.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '../../.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUP_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUP_SR  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUP_URL || !SUP_SR) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extraer project ref del URL
const PROJECT_REF = SUP_URL.replace('https://', '').split('.')[0];
console.log(`Proyecto Supabase: ${PROJECT_REF}`);

const admin = createClient(SUP_URL, SUP_SR, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Verificación previa ──────────────────────────────────────
async function checkColumnExists(table, column) {
  const res = await fetch(
    `${SUP_URL}/rest/v1/${table}?select=${column}&limit=1`,
    {
      headers: {
        'apikey': SUP_SR,
        'Authorization': `Bearer ${SUP_SR}`,
      },
    }
  );
  const body = await res.text();
  // Si el cuerpo contiene "does not exist", la columna no existe
  return !body.includes('does not exist');
}

const slugExiste = await checkColumnExists('cursos_pro_modules', 'slug');
const numExiste  = await checkColumnExists('cursos_pro_sessions', 'num_in_module');

console.log(`slug columna existe: ${slugExiste}`);
console.log(`num_in_module columna existe: ${numExiste}`);

if (slugExiste && numExiste) {
  console.log('\nAmbigas columnas ya existen. Corriendo solo verificación de datos...');
  await runVerification();
  process.exit(0);
}

// ─── Aplicar via Supabase pg proxy (API de Management) ───────
const MGMT_TOKEN = process.env.SUPABASE_MANAGEMENT_API_TOKEN;

if (MGMT_TOKEN) {
  console.log('\nAplicando vía Management API...');
  const MIGRATION_PATH = resolve(
    __dirname,
    '../../../supabase/migrations/022_cursos_pro_module_slug_and_num_in_module.sql'
  );
  const sql = readFileSync(MIGRATION_PATH, 'utf-8');

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MGMT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  const body = await res.json();
  if (!res.ok) {
    console.error('Error Management API:', JSON.stringify(body, null, 2));
    process.exit(1);
  }
  console.log('Migración aplicada via Management API.');
  await runVerification();
  process.exit(0);
}

// ─── Aplicar sentencia por sentencia via RPC custom ──────────
// Como no tenemos DB directo, aplicamos los cambios DML posibles con el SDK
// y marcamos los DDL que deben hacerse manualmente.

console.log('\nNo hay SUPABASE_MANAGEMENT_API_TOKEN ni SUPABASE_DB_URL.');
console.log('Aplicando DDL (ALTER TABLE) vía llamadas HTTP directas al query endpoint...\n');

// Supabase expone un endpoint de SQL solo en el plan Team/Pro con management token.
// Plan gratuito: solo via psql o SQL Editor.
// En este caso, los pasos DDL deben aplicarse manualmente.

const MIGRATION_PATH = resolve(
  __dirname,
  '../../../supabase/migrations/022_cursos_pro_module_slug_and_num_in_module.sql'
);

console.log('==============================================================');
console.log('INSTRUCCION MANUAL (30 segundos):');
console.log('==============================================================');
console.log('');
console.log('1. Ir a: https://supabase.com/dashboard/project/' + PROJECT_REF + '/sql/new');
console.log('');
console.log('2. Pegar este SQL y presionar "Run":');
console.log('');
console.log('─'.repeat(60));

// Imprimir solo las sentencias clave (sin comentarios)
const sqlLines = readFileSync(MIGRATION_PATH, 'utf-8')
  .split('\n')
  .filter(l => !l.trim().startsWith('--') && l.trim() !== '')
  .join('\n');
console.log(sqlLines);

console.log('─'.repeat(60));
console.log('');
console.log('3. Después de aplicar, correr:');
console.log('   node scripts/apply-migration-022-via-pg.mjs');
console.log('   (verificará automáticamente los datos)');
process.exit(2);

async function runVerification() {
  console.log('\n── Verificación post-022 ──────────────────────────────────');

  const { data: curso } = await admin
    .from('cursos_pro_courses')
    .select('id')
    .eq('slug', 'admin-salud')
    .single();

  if (!curso) {
    console.error('ERROR: No se encontró el curso admin-salud.');
    return;
  }
  const adminSaludId = curso.id;

  // Módulos
  const { data: modulos, error: em } = await admin
    .from('cursos_pro_modules')
    .select('num, name, slug')
    .eq('course_id', adminSaludId)
    .order('num', { ascending: true });

  if (em) { console.error('Error módulos:', em.message); return; }

  console.log(`\nMódulos de admin-salud (${modulos.length}):`);
  modulos.forEach(m => {
    const st = m.slug ? `OK  slug="${m.slug}"` : 'FALLO null slug';
    console.log(`  M${m.num}: ${st}`);
  });

  // Sesiones
  const { data: sesiones, error: es } = await admin
    .from('cursos_pro_sessions')
    .select('num, num_in_module, module_id, title')
    .eq('course_id', adminSaludId)
    .order('num', { ascending: true });

  if (es) { console.error('Error sesiones:', es.message); return; }

  console.log(`\nSesiones de admin-salud (${sesiones.length}):`);
  sesiones.forEach(s => {
    const st = s.num_in_module != null ? `num_in_module=${s.num_in_module}` : 'FALLO null';
    console.log(`  S${String(s.num).padStart(2,'0')}:  ${st}  |  ${s.title.slice(0,50)}`);
  });

  const modNulls = modulos.filter(m => !m.slug).length;
  const sesNulls = sesiones.filter(s => s.num_in_module == null).length;

  console.log('\n── Resumen ─────────────────────────────────────────────────');
  console.log(`  Módulos sin slug  : ${modNulls}  (esperado: 0)`);
  console.log(`  Sesiones sin num  : ${sesNulls}  (esperado: 0)`);
  console.log(`  Total módulos     : ${modulos.length}  (esperado: 5)`);
  console.log(`  Total sesiones    : ${sesiones.length}  (esperado: 20)`);

  if (modNulls === 0 && sesNulls === 0 && modulos.length === 5 && sesiones.length === 20) {
    console.log('\n  VERIFICACION EXITOSA.');
  } else {
    console.error('\n  FALLO: Revisar datos.');
    process.exit(1);
  }
}
