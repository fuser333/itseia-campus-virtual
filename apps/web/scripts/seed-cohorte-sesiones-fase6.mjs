/**
 * Seed sesiones de cohortes · Campus v2 FASE 6
 * ----------------------------------------------------------------------------
 * Inserta las sesiones de las 2 cohortes activas en `cohorte_sesiones`:
 *   1) preuni / cohorte-jun-2026 → 20 sesiones (lun-vie, 4 semanas desde 3 jun)
 *   2) cursos-pro / inca-gisela  → 8 sesiones (calendario Gisela)
 *
 * Idempotente: UNIQUE(cohorte_id, numero) en migración 019 garantiza no
 * duplicar. Hace upsert por (cohorte_id, numero).
 *
 * Requisitos: migración 019 aplicada (cohorte_sesiones existe). Ya verificado.
 *
 * Uso:
 *   node scripts/seed-cohorte-sesiones-fase6.mjs            # dry-run
 *   node scripts/seed-cohorte-sesiones-fase6.mjs --commit   # escribe
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
console.log(COMMIT ? 'MODO COMMIT' : 'DRY-RUN');

const admin = createClient(SUP_URL, SUP_SR, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PREUNI_MEET = 'https://meet.google.com/qox-bghu-mbe';

// ─── PREUNI · 20 sesiones (4 semanas × 5 días) ───────────────────────────────
// Inicio: miércoles 3 jun 2026 17:30 EC (UTC-5) = 22:30 UTC mismo día.
// Lun-vie hábiles. La cohorte arranca el mié 3 jun = Día 1.
//
// Semana 1: mié 3, jue 4, vie 5, lun 8, mar 9
// Semana 2: mié 10, jue 11, vie 12, lun 15, mar 16
// Semana 3: mié 17, jue 18, vie 19, lun 22, mar 23
// Semana 4: mié 24, jue 25, vie 26, lun 29, mar 30
//
// Cada día a las 17:30 EC = 22:30 UTC.
function preuniDateISO(year, month, day, hour = 22, minute = 30) {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0)).toISOString();
}

const PREUNI_SESIONES = [
  // Semana 1
  { num: 1,  titulo: 'Día 1: Bienvenida al Futuro con IA',                         fecha: preuniDateISO(2026, 6, 3) },
  { num: 2,  titulo: 'Día 2: Prompt Engineering — Habla Como Experto',             fecha: preuniDateISO(2026, 6, 4) },
  { num: 3,  titulo: 'Día 3: IA para Productividad Extrema',                       fecha: preuniDateISO(2026, 6, 5) },
  { num: 4,  titulo: 'Día 4: Python con IA como Copiloto',                         fecha: preuniDateISO(2026, 6, 8) },
  { num: 5,  titulo: 'Día 5: Diseño Visual con IA Generativa',                     fecha: preuniDateISO(2026, 6, 9) },
  // Semana 2
  { num: 6,  titulo: 'Día 6: Excel + IA = Superpoderes',                           fecha: preuniDateISO(2026, 6, 10) },
  { num: 7,  titulo: 'Día 7: Python para Datos (Pandas con IA)',                   fecha: preuniDateISO(2026, 6, 11) },
  { num: 8,  titulo: 'Día 8: Visualización de Datos con IA',                       fecha: preuniDateISO(2026, 6, 12) },
  { num: 9,  titulo: 'Día 9: Streamlit — Apps de Datos Interactivas',              fecha: preuniDateISO(2026, 6, 15) },
  { num: 10, titulo: 'Día 10: Mini-Proyecto 1 — Dashboard de Datos Ecuador',       fecha: preuniDateISO(2026, 6, 16) },
  // Semana 3
  { num: 11, titulo: 'Día 11: Introducción a Machine Learning',                    fecha: preuniDateISO(2026, 6, 17) },
  { num: 12, titulo: 'Día 12: Google AI Studio — Crea Apps con Gemini',            fecha: preuniDateISO(2026, 6, 18) },
  { num: 13, titulo: 'Día 13: Lovable.dev — Apps Sin Código',                      fecha: preuniDateISO(2026, 6, 19) },
  { num: 14, titulo: 'Día 14: Replit — Programación Colaborativa con IA',          fecha: preuniDateISO(2026, 6, 22) },
  { num: 15, titulo: 'Día 15: Automatización con IA',                              fecha: preuniDateISO(2026, 6, 23) },
  // Semana 4
  { num: 16, titulo: 'Día 16: Planificación del Proyecto Final',                   fecha: preuniDateISO(2026, 6, 24) },
  { num: 17, titulo: 'Día 17: Desarrollo Sprint 1',                                fecha: preuniDateISO(2026, 6, 25) },
  { num: 18, titulo: 'Día 18: Desarrollo Sprint 2',                                fecha: preuniDateISO(2026, 6, 26) },
  { num: 19, titulo: 'Día 19: Finalización y Preparación de Presentación',        fecha: preuniDateISO(2026, 6, 29) },
  { num: 20, titulo: 'Día 20: Presentaciones Finales y Certificación',             fecha: preuniDateISO(2026, 6, 30) },
];

// ─── GISELA (cursos-pro/inca-gisela) · 8 sesiones ────────────────────────────
// Calendario que ya está en cursos_pro_sessions (seed-curso-gisela-josselin.mjs).
// Replicamos en cohorte_sesiones — UI v2 lee de esta tabla genérica.
// scheduled_at UTC ya canonicalizado allá: 8 PM EC = 01:00 UTC día siguiente.
const GISELA_MEET_PLACEHOLDER = 'https://meet.google.com/lookup/admin-salud';
const GISELA_SESIONES = [
  { num: 1, titulo: 'Fundamentos de IA + LOPDP Ecuador',                fecha: '2026-06-07T01:00:00.000Z', duracion: 120 },
  { num: 2, titulo: 'ChatGPT y Claude Pro — Parte 1',                   fecha: '2026-06-12T01:00:00.000Z', duracion: 60 },
  { num: 3, titulo: 'Gemini + Copilot + Canva IA — Cierre M2',          fecha: '2026-06-14T01:00:00.000Z', duracion: 120 },
  { num: 4, titulo: 'Gestión Hospitalaria con IA — Parte 1',            fecha: '2026-06-19T01:00:00.000Z', duracion: 60 },
  { num: 5, titulo: 'Gestión Hospitalaria con IA — Cierre M3',          fecha: '2026-06-21T01:00:00.000Z', duracion: 120 },
  { num: 6, titulo: 'Facturación + Tributario Salud con IA — Parte 1',  fecha: '2026-06-26T01:00:00.000Z', duracion: 60 },
  { num: 7, titulo: 'KPIs e indicadores con IA — Cierre M4',            fecha: '2026-06-28T01:00:00.000Z', duracion: 120 },
  { num: 8, titulo: 'Proyecto Final con Héctor',                        fecha: '2026-07-03T01:00:00.000Z', duracion: 60 },
];

// ─────────────────────────────────────────────────────────────────────────────

async function getCohorteId(producto, cohorte_slug) {
  const { data, error } = await admin
    .from('cohorte_metadata')
    .select('id, nombre_publico')
    .eq('producto', producto)
    .eq('cohorte_slug', cohorte_slug)
    .maybeSingle();
  if (error || !data) {
    throw new Error(`Cohorte ${producto}/${cohorte_slug} no existe en cohorte_metadata: ${error?.message ?? 'not found'}`);
  }
  return data;
}

async function seedCohort({ label, producto, cohorte_slug, sesiones, meetUrl, defaultDuracion }) {
  console.log(`\n══ ${label} ══`);
  const cohorte = await getCohorteId(producto, cohorte_slug);
  console.log(`  cohorte_id = ${cohorte.id.slice(0, 8)}... · ${cohorte.nombre_publico}`);

  let inserted = 0, updated = 0;
  for (const s of sesiones) {
    const payload = {
      cohorte_id: cohorte.id,
      numero: s.num,
      titulo: s.titulo,
      fecha_programada: s.fecha,
      duracion_minutos: s.duracion ?? defaultDuracion,
      meet_url: meetUrl,
      status: 'scheduled',
    };

    if (!COMMIT) {
      console.log(`  · S${s.num} ${s.titulo.slice(0, 50)} | ${s.fecha} | dur=${payload.duracion_minutos}`);
      continue;
    }

    // upsert por (cohorte_id, numero) — UNIQUE constraint definido en 019
    const { data: existing } = await admin
      .from('cohorte_sesiones')
      .select('id')
      .eq('cohorte_id', cohorte.id)
      .eq('numero', s.num)
      .maybeSingle();

    if (existing) {
      // No sobrescribimos recording_url / status si ya fueron seteados manualmente
      const { error } = await admin
        .from('cohorte_sesiones')
        .update({
          titulo: payload.titulo,
          fecha_programada: payload.fecha_programada,
          duracion_minutos: payload.duracion_minutos,
          meet_url: payload.meet_url,
        })
        .eq('id', existing.id);
      if (error) {
        console.error(`  ❌ S${s.num} update:`, error.message);
      } else {
        updated++;
      }
    } else {
      const { error } = await admin.from('cohorte_sesiones').insert(payload);
      if (error) {
        console.error(`  ❌ S${s.num} insert:`, error.message);
      } else {
        inserted++;
      }
    }
  }
  console.log(`  resumen · insertados=${inserted} · actualizados=${updated}`);
  return { inserted, updated };
}

const resA = await seedCohort({
  label: 'Preuni · cohorte-jun-2026 (20 sesiones)',
  producto: 'preuni',
  cohorte_slug: 'cohorte-jun-2026',
  sesiones: PREUNI_SESIONES,
  meetUrl: PREUNI_MEET,
  defaultDuracion: 240, // 4 horas (17:30-21:30 ECT)
});

const resB = await seedCohort({
  label: 'Cursos-pro · inca-gisela (8 sesiones)',
  producto: 'cursos-pro',
  cohorte_slug: 'inca-gisela',
  sesiones: GISELA_SESIONES,
  meetUrl: GISELA_MEET_PLACEHOLDER,
  defaultDuracion: 120,
});

console.log(`\n${COMMIT ? 'OK.' : 'Dry-run OK. Pasa --commit para aplicar.'}`);
console.log(`  preuni: ${resA.inserted} ins / ${resA.updated} upd`);
console.log(`  gisela: ${resB.inserted} ins / ${resB.updated} upd`);
