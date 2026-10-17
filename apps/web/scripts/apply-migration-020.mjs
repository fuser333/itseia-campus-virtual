/**
 * Aplica migración 020 (enrollments_cohorte_id) a la DB de Supabase.
 *
 * Modos:
 *   · Con SUPABASE_DB_URL en .env.local o env → corre via `pg` directo.
 *   · Sin SUPABASE_DB_URL → imprime el SQL y pide aplicar manualmente en
 *     Supabase SQL Editor (proyecto wqlselfapnggxxeziruo).
 *
 * Después de aplicar, corre:
 *   node scripts/verify-fase6-migration.mjs
 *
 * Uso:
 *   node scripts/apply-migration-020.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATION_PATH = resolve(__dirname, '../../../supabase/migrations/020_enrollments_cohorte_id.sql');

const SUP_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUP_SR  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DB_URL  = process.env.SUPABASE_DB_URL;

if (!SUP_URL || !SUP_SR) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sql = readFileSync(MIGRATION_PATH, 'utf-8');

async function alreadyApplied() {
  const admin = createClient(SUP_URL, SUP_SR, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await admin
    .from('enrollments')
    .select('id, cohorte_slug, producto')
    .limit(1);
  return !error;
}

if (await alreadyApplied()) {
  console.log('Migración 020 YA está aplicada (columnas cohorte_slug y producto existen). Nada que hacer.');
  process.exit(0);
}

if (DB_URL) {
  console.log('Aplicando 020 vía SUPABASE_DB_URL...');
  const { default: pg } = await import('pg');
  const client = new pg.Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(sql);
    console.log('Migración 020 aplicada exitosamente.');
  } catch (err) {
    console.error('ERROR al aplicar migración:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
  // Re-verificar
  if (await alreadyApplied()) {
    console.log('Verificación OK · enrollments.cohorte_slug y enrollments.producto disponibles.');
  } else {
    console.error('FALLO de verificación post-aplicación.');
    process.exit(1);
  }
} else {
  console.log('==============================================================');
  console.log(' SUPABASE_DB_URL no definida. Aplicar 020 manualmente:');
  console.log('==============================================================');
  console.log('');
  console.log(' 1. Abrir: https://supabase.com/dashboard/project/wqlselfapnggxxeziruo/sql/new');
  console.log(' 2. Pegar el contenido del archivo:');
  console.log(`    ${MIGRATION_PATH}`);
  console.log(' 3. Click Run.');
  console.log(' 4. Verificar con:');
  console.log('    node scripts/verify-fase6-migration.mjs');
  console.log('');
  console.log(' Alternativa: setear SUPABASE_DB_URL=postgresql://... en .env.local y re-correr este script.');
  console.log('');
  process.exit(2);
}
