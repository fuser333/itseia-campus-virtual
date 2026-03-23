#!/usr/bin/env node
/**
 * ITSEIA Academy - Setup Database
 * Ejecuta el schema SQL en Supabase
 * Uso: node setup_database.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const REGIONS = ['us-east-1', 'sa-east-1', 'us-west-1', 'us-east-2', 'eu-west-1'];
const PROJECT_REF = 'wqlselfapnggxxeziruo';
const DB_PASSWORD = 'kabjaG-canjod-6qabxi';

async function tryConnect() {
  // Try direct connection first
  const directHost = `db.${PROJECT_REF}.supabase.co`;
  console.log(`Intentando conexion directa: ${directHost}...`);

  try {
    const client = new Client({
      host: directHost,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });
    await client.connect();
    console.log('✓ Conectado via conexion directa');
    return client;
  } catch (e) {
    console.log(`✗ Directa fallo: ${e.message}`);
  }

  // Try pooler connections
  for (const region of REGIONS) {
    const connStr = `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-${region}.pooler.supabase.com:5432/postgres`;
    console.log(`Intentando pooler ${region}...`);
    try {
      const client = new Client({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
      });
      await client.connect();
      console.log(`✓ Conectado via pooler ${region}`);
      return client;
    } catch (e) {
      console.log(`✗ ${region} fallo: ${e.message}`);
    }
  }

  return null;
}

async function main() {
  console.log('\n=== ITSEIA Academy - Setup Database ===\n');

  const client = await tryConnect();
  if (!client) {
    console.error('\n✗ No se pudo conectar. El proyecto puede estar aun provisionandose.');
    console.log('  Espera 2-3 minutos y ejecuta de nuevo: node setup_database.js');
    process.exit(1);
  }

  // Read SQL file
  const sqlPath = path.join(__dirname, 'supabase_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('\nEjecutando schema SQL...');

  try {
    await client.query(sql);
    console.log('✓ Schema ejecutado exitosamente');

    // Verify tables
    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('\nTablas creadas:');
    rows.forEach(r => console.log(`  ✓ ${r.table_name}`));

    // Count programs
    const { rows: progs } = await client.query('SELECT COUNT(*) as count FROM public.programs');
    console.log(`\nProgramas cargados: ${progs[0].count}`);

    // Count lessons
    const { rows: lessons } = await client.query('SELECT COUNT(*) as count FROM public.lessons');
    console.log(`Lecciones cargadas: ${lessons[0].count}`);

    console.log('\n=== Setup completado ===\n');
  } catch (e) {
    console.error('\n✗ Error ejecutando SQL:', e.message);
    if (e.position) {
      const lines = sql.substring(0, parseInt(e.position)).split('\n');
      console.error(`  Linea aproximada: ${lines.length}`);
    }
  }

  await client.end();
}

main();
