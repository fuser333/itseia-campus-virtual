/* eslint-disable no-console */
/**
 * seed-teaching-meta.ts
 *
 * Carga METODOLOGIA_POR_SESION.json en la tabla session_teaching_meta.
 *
 * Uso:
 *   npx tsx scripts/seed-teaching-meta.ts              # DRY RUN (no escribe)
 *   npx tsx scripts/seed-teaching-meta.ts --commit     # escribe a Supabase
 *   npx tsx scripts/seed-teaching-meta.ts --commit --fail-fast   # para al primer error
 *
 * Lee SUPABASE_SERVICE_ROLE_KEY de .env.local via dotenv.
 *
 * Seguridad implementada (post-revisión adversarial):
 *  - Discovery con MULTIPLE filtros (slug + nombre + recuento) y aborta si ambiguo
 *  - Validación de similitud titulo_meta vs titulo_session antes de aceptar mapping
 *  - dotenv formal (no parser manual)
 *  - SERVICE_ROLE se limpia de process.env tras crear el cliente
 *  - Validación de shape JSON campo por campo
 *  - Flag opcional --fail-fast para detener al primer error
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";

// ─── 1. Cargar .env.local con dotenv (parser robusto) ───
const envPath = resolve(process.cwd(), ".env.local");
const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  console.error(`❌ No se pudo leer ${envPath}: ${dotenvResult.error.message}`);
  process.exit(1);
}

// Capturar credenciales en variables locales y eliminar de process.env de inmediato
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_LOCAL = process.env.SUPABASE_SERVICE_ROLE_KEY;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_LOCAL) {
  console.error("❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const COMMIT = process.argv.includes("--commit");
const FAIL_FAST = process.argv.includes("--fail-fast");
const MODE = COMMIT ? `COMMIT${FAIL_FAST ? " (fail-fast)" : ""}` : "DRY-RUN";

const META_JSON_PATH =
  "/Users/hectorvelasco/Mis Empresas/ITSEIA/DEPARTAMENTOS/08_TECNOLOGIA_INNOVACION/PROYECTO_PLATAFORMA_DOCENTES/METODOLOGIA_POR_SESION.json";

interface SessionMeta {
  id: string; // "D1" .. "D20"
  titulo: string;
  proposito: string;
  objetivos_bloom: Array<{ nivel: string; verbo: string; descripcion: string }>;
  habilidades: string[];
  // El JSON usa 'metodologia_recomendada' y 'errores_tipicos_alumno' (formato del agente).
  // El script los mapea a 'metodologia' y 'errores_tipicos' (formato de la tabla SQL).
  metodologia_recomendada: Record<string, unknown>;
  ejercicio_modelo?: Record<string, unknown> | null;
  errores_tipicos_alumno?: string[] | null;
  intervencion_docente?: string | null;
  transferencia_real?: string | null;
  fuentes: string[];
}

interface MetaFile {
  version: string;
  fecha: string;
  total_sesiones: number;
  sesiones: SessionMeta[];
}

interface DbSubject {
  id: string;
  slug: string;
  name: string;
}
interface DbSession {
  id: string;
  number: number;
  title: string;
  subject_id: string;
}

function dnum(id: string): number {
  return parseInt(id.replace(/^D/, ""), 10);
}

// ─── Validación de shape de UN objeto SessionMeta ───
function validateSessionShape(s: unknown, idx: number): string[] {
  const errors: string[] = [];
  const obj = s as Partial<SessionMeta>;
  const prefix = `sesiones[${idx}] (${obj.id ?? "?"}):`;
  if (typeof obj.id !== "string" || !/^D\d+$/.test(obj.id)) errors.push(`${prefix} id ausente o mal formado`);
  if (typeof obj.titulo !== "string" || obj.titulo.length < 3) errors.push(`${prefix} titulo ausente`);
  if (typeof obj.proposito !== "string" || obj.proposito.length < 10) errors.push(`${prefix} proposito vacío o muy corto`);
  if (!Array.isArray(obj.objetivos_bloom)) errors.push(`${prefix} objetivos_bloom no es array`);
  if (!Array.isArray(obj.habilidades)) errors.push(`${prefix} habilidades no es array`);
  if (typeof obj.metodologia_recomendada !== "object" || obj.metodologia_recomendada === null) errors.push(`${prefix} metodologia_recomendada no es objeto`);
  if (!Array.isArray(obj.fuentes)) errors.push(`${prefix} fuentes no es array`);
  return errors;
}

// ─── Similitud aproximada de títulos (palabras clave) ───
// Stopwords ampliadas tras revisión: incluye términos comunes del dominio
// (inteligencia, artificial, curso, clase, datos) para evitar false positives.
const STOPWORDS = new Set([
  "para", "como", "tipo", "con", "que", "este", "esta", "una", "unos", "unas",
  "los", "las", "del", "por", "sin", "sobre", "entre", "hacia",
  "inteligencia", "artificial", "curso", "clase", "datos", "data",
  "session", "sesion", "tema", "modulo",
]);

function normalizeForCompare(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // tildes fuera
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w))
    .slice(0, 12)
    .join(" ");
}

function titleSimilarityOk(metaTitulo: string, dbTitle: string): boolean {
  const a = new Set(normalizeForCompare(metaTitulo).split(" ").filter(Boolean));
  const b = new Set(normalizeForCompare(dbTitle).split(" ").filter(Boolean));
  if (a.size === 0 || b.size === 0) return false;
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  // Tras revisión: subir el umbral a 2 para evitar matches con una sola palabra común.
  // Excepción: si uno de los sets tiene solo 1 palabra significativa, basta con 1 compartida.
  const minPool = Math.min(a.size, b.size);
  return minPool === 1 ? shared >= 1 : shared >= 2;
}

// Hints normalizados con la misma función para capturar variantes
// como "PRE-UNI", "PRE_UNI", "Ignite_2026", etc.
const SUBJECT_NAME_HINTS_RAW = ["ignite", "preuniversitario", "preuni"];
const SUBJECT_NAME_HINTS = SUBJECT_NAME_HINTS_RAW.map((h) =>
  h.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
);

async function main() {
  console.log(`\n=== seed-teaching-meta — modo ${MODE} ===\n`);

  // 2. Cargar JSON
  let meta: MetaFile;
  try {
    meta = JSON.parse(readFileSync(META_JSON_PATH, "utf-8"));
  } catch (e) {
    console.error(`❌ No pude leer ${META_JSON_PATH}: ${(e as Error).message}`);
    process.exit(1);
  }

  if (!Array.isArray(meta.sesiones) || meta.sesiones.length !== 20) {
    console.error(`❌ Esperaba 20 sesiones, encontré ${meta.sesiones?.length}.`);
    process.exit(1);
  }

  // Validar IDs D1-D20 sin duplicados
  const ids = meta.sesiones.map((s) => s.id).sort((a, b) => dnum(a) - dnum(b));
  const expected = Array.from({ length: 20 }, (_, i) => `D${i + 1}`);
  if (JSON.stringify(ids) !== JSON.stringify(expected)) {
    console.error(`❌ IDs mal formados. Esperado D1..D20, recibí: ${ids.join(",")}`);
    process.exit(1);
  }

  // Validar shape de cada sesión
  const shapeErrors: string[] = [];
  meta.sesiones.forEach((s, i) => shapeErrors.push(...validateSessionShape(s, i)));
  if (shapeErrors.length > 0) {
    console.error(`❌ Shape JSON inválido (${shapeErrors.length} errores):`);
    shapeErrors.slice(0, 10).forEach((e) => console.error(`  - ${e}`));
    if (shapeErrors.length > 10) console.error(`  ... y ${shapeErrors.length - 10} más`);
    process.exit(1);
  }
  console.log(`✅ JSON validado: 20 sesiones D1..D20 con campos requeridos.\n`);

  // 3. Cliente Supabase con service role (capturado en variable local arriba,
  //    ya eliminado de process.env desde el bootstrap)
  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_LOCAL!, {
    auth: { persistSession: false },
  });

  // 4. Discovery con MÚLTIPLES filtros del subject preuni
  console.log(`Buscando subject del preuniversitario IGNITE…`);
  const { data: programs, error: progErr } = await supabase
    .from("programs")
    .select("id, slug, name, type")
    .eq("type", "preuni");
  if (progErr) {
    console.error(`❌ Error consultando programs: ${progErr.message}`);
    process.exit(1);
  }
  if (!programs || programs.length === 0) {
    console.error(`❌ No hay programs con type=preuni.`);
    process.exit(1);
  }
  console.log(`  Programs preuni encontrados: ${programs.length}`);
  for (const p of programs) console.log(`    - ${p.slug} :: ${p.name}`);

  const programIds = programs.map((p) => p.id);
  const { data: semesters } = await supabase
    .from("semesters")
    .select("id, program_id, number")
    .in("program_id", programIds);
  const semesterIds = (semesters ?? []).map((s) => s.id);
  if (semesterIds.length === 0) {
    console.error(`❌ No hay semesters bajo programs preuni.`);
    process.exit(1);
  }

  const { data: candidates, error: subjErr } = await supabase
    .from("subjects")
    .select("id, slug, name, semester_id")
    .in("semester_id", semesterIds);
  if (subjErr) {
    console.error(`❌ Error consultando subjects: ${subjErr.message}`);
    process.exit(1);
  }
  if (!candidates || candidates.length === 0) {
    console.error(`❌ No hay subjects bajo programs preuni.`);
    process.exit(1);
  }

  console.log(`  Subjects candidatos: ${candidates.length}`);

  // El preuni IGNITE está dividido en 4 SEMANAS = 4 subjects × 5 sessions cada uno.
  // Estructura esperada: D1-D5 → semana 1, D6-D10 → semana 2, etc.
  const SESSIONS_PER_WEEK = 5;
  const TOTAL_WEEKS = 4;

  type WeekSubject = { subject: DbSubject; sessions: DbSession[]; weekNumber: number };
  const weekSubjects: WeekSubject[] = [];

  for (const c of candidates) {
    const slugLower = (c.slug ?? "").toLowerCase();
    const nameLower = (c.name ?? "").toLowerCase();
    const nameMatchScore = SUBJECT_NAME_HINTS.reduce(
      (acc, hint) => acc + (slugLower.includes(hint) ? 2 : 0) + (nameLower.includes(hint) ? 1 : 0),
      0
    );
    if (nameMatchScore === 0) continue;

    // Detectar el número de semana del slug o name (1..4)
    const weekFromSlug = (c.slug ?? "").match(/semana[-_ ]?(\d+)/i)?.[1];
    const weekFromName = (c.name ?? "").match(/semana[-_ ]?(\d+)/i)?.[1];
    const weekNumber = parseInt(weekFromSlug ?? weekFromName ?? "0", 10);
    if (!weekNumber || weekNumber < 1 || weekNumber > TOTAL_WEEKS) {
      console.log(`    ${c.slug} → no se pudo extraer número de semana, ignorado`);
      continue;
    }

    const { data: sess } = await supabase
      .from("sessions")
      .select("id, number, title, subject_id")
      .eq("subject_id", c.id)
      .order("number", { ascending: true });
    const sessList = (sess ?? []) as DbSession[];

    console.log(`    semana ${weekNumber}: ${c.slug} :: ${c.name} → ${sessList.length} sessions, score=${nameMatchScore}`);

    if (sessList.length !== SESSIONS_PER_WEEK) {
      console.log(`      ⚠ esperaba ${SESSIONS_PER_WEEK} sessions, ignorada`);
      continue;
    }
    weekSubjects.push({ subject: c, sessions: sessList, weekNumber });
  }

  if (weekSubjects.length !== TOTAL_WEEKS) {
    console.error(`\n❌ Esperaba ${TOTAL_WEEKS} semanas con ${SESSIONS_PER_WEEK} sessions c/u, encontré ${weekSubjects.length}.`);
    process.exit(1);
  }

  // Validar que TODOS los weekSubjects pertenezcan al MISMO program (vía semester).
  // Si hay 2 programs preuni con sus propias semanas, evita escribir al equivocado.
  const subjectIdsByWeek = weekSubjects.map((w) => w.subject.id);
  const { data: ownSemesters } = await supabase
    .from("subjects")
    .select("id, semester_id")
    .in("id", subjectIdsByWeek);
  const semsetByWeek = new Set((ownSemesters ?? []).map((s) => s.semester_id));
  const { data: programLink } = await supabase
    .from("semesters")
    .select("id, program_id")
    .in("id", Array.from(semsetByWeek));
  const programIdsByWeek = new Set((programLink ?? []).map((p) => p.program_id));
  if (programIdsByWeek.size !== 1) {
    console.error(`\n❌ Las ${weekSubjects.length} semanas pertenecen a ${programIdsByWeek.size} programs distintos.`);
    console.error(`   Aborto: no se puede determinar el preuni "verdadero" sin ambigüedad.`);
    process.exit(1);
  }

  // Detectar duplicados de número de semana con mensaje explícito
  const weekNumbers = weekSubjects.map((w) => w.weekNumber).sort();
  const expectedWeeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);
  if (JSON.stringify(weekNumbers) !== JSON.stringify(expectedWeeks)) {
    // Detectar específicamente si hay duplicados
    const seen = new Map<number, string[]>();
    for (const w of weekSubjects) {
      const arr = seen.get(w.weekNumber) ?? [];
      arr.push(w.subject.slug);
      seen.set(w.weekNumber, arr);
    }
    const dupes = [...seen.entries()].filter(([, slugs]) => slugs.length > 1);
    if (dupes.length > 0) {
      console.error(`\n❌ Hay DUPLICADOS de número de semana entre subjects:`);
      for (const [n, slugs] of dupes) {
        console.error(`   Semana ${n}: ${slugs.join(", ")}`);
      }
    } else {
      console.error(`\n❌ Semanas mal numeradas. Esperado [1,2,3,4], recibí: ${weekNumbers.join(",")}`);
    }
    process.exit(1);
  }
  console.log(`\n✅ 4 semanas detectadas correctamente (5 sessions c/u, total ${4 * SESSIONS_PER_WEEK}, mismo program).\n`);

  // Ordenar por número de semana para iterar predecible
  weekSubjects.sort((a, b) => a.weekNumber - b.weekNumber);

  // 5. Validar numeración interna por semana (1..5)
  for (const w of weekSubjects) {
    for (let i = 0; i < SESSIONS_PER_WEEK; i++) {
      if (w.sessions[i].number !== i + 1) {
        console.error(`❌ Semana ${w.weekNumber}: numeración no es 1-${SESSIONS_PER_WEEK}. number[${i}] = ${w.sessions[i].number}`);
        process.exit(1);
      }
    }
  }

  // 6. Construir mapping D{N} → (semana, session_number_en_semana) → session.id
  // D1..D5  → semana 1, sessions 1..5
  // D6..D10 → semana 2, sessions 1..5
  // D11..D15 → semana 3, sessions 1..5
  // D16..D20 → semana 4, sessions 1..5
  function mapDtoSession(dn: number): { week: number; idx: number; session: DbSession } | null {
    const week = Math.ceil(dn / SESSIONS_PER_WEEK); // 1..4
    const idx = ((dn - 1) % SESSIONS_PER_WEEK) + 1; // 1..5
    const w = weekSubjects.find((x) => x.weekNumber === week);
    if (!w) return null;
    const s = w.sessions.find((x) => x.number === idx);
    if (!s) return null;
    return { week, idx, session: s };
  }

  // 7. Validar similitud de títulos antes de aceptar mapping
  console.log(`Verificando coherencia titulos meta ↔ titulos DB…`);
  const titleMismatches: Array<{ meta: SessionMeta; session: DbSession; week: number; idx: number }> = [];
  for (const m of meta.sesiones) {
    const mapping = mapDtoSession(dnum(m.id));
    if (!mapping) {
      console.error(`❌ No pude mapear ${m.id} a una session`);
      process.exit(1);
    }
    if (!titleSimilarityOk(m.titulo, mapping.session.title)) {
      titleMismatches.push({ meta: m, session: mapping.session, week: mapping.week, idx: mapping.idx });
    }
  }
  if (titleMismatches.length > 0) {
    console.error(`\n❌ TÍTULOS NO COINCIDEN entre META y DB (${titleMismatches.length} mismatches):`);
    titleMismatches.forEach((mm) => {
      console.error(`   ${mm.meta.id} (semana ${mm.week}, sesion ${mm.idx}):`);
      console.error(`     META: ${mm.meta.titulo}`);
      console.error(`     DB:   ${mm.session.title}`);
    });
    console.error(`\n   Aborto por seguridad: podría asignar metadatos a la sesión equivocada.`);
    console.error(`   Revisa el syllabus de la DB o el JSON antes de continuar.`);
    process.exit(1);
  }
  console.log(`✅ Todos los títulos coinciden (palabras clave compartidas).\n`);

  // 8. Construir operaciones
  const ops: Array<{
    sessionId: string;
    sessionTitle: string;
    metaId: string;
    metaTitulo: string;
    week: number;
    idx: number;
    payload: Record<string, unknown>;
  }> = meta.sesiones.map((m) => {
    const mapping = mapDtoSession(dnum(m.id))!;
    return {
      sessionId: mapping.session.id,
      sessionTitle: mapping.session.title,
      metaId: m.id,
      metaTitulo: m.titulo,
      week: mapping.week,
      idx: mapping.idx,
      payload: {
        session_id: mapping.session.id,
        proposito: m.proposito,
        objetivos_bloom: m.objetivos_bloom ?? [],
        habilidades: m.habilidades ?? [],
        // Mapping JSON → SQL: metodologia_recomendada → metodologia
        metodologia: m.metodologia_recomendada ?? {},
        ejercicio_modelo: m.ejercicio_modelo ?? null,
        // Mapping JSON → SQL: errores_tipicos_alumno → errores_tipicos
        errores_tipicos: m.errores_tipicos_alumno ?? null,
        intervencion_docente: m.intervencion_docente ?? null,
        transferencia_real: m.transferencia_real ?? null,
        fuentes: m.fuentes ?? [],
      },
    };
  });

  console.log(`Mapping aprobado (20 sesiones distribuidas en 4 semanas):\n`);
  for (const o of ops) {
    console.log(`  ${o.metaId} (S${o.week}.${o.idx})  ${o.metaTitulo.slice(0, 44).padEnd(44)} → ${o.sessionTitle.slice(0, 40)}`);
  }
  console.log();

  if (!COMMIT) {
    console.log(`\n[DRY-RUN] No se escribió nada. Ejecuta con --commit para escribir.\n`);
    process.exit(0);
  }

  // 8. UPSERT
  console.log(`Ejecutando UPSERTs (fail-fast=${FAIL_FAST})…\n`);
  let ok = 0;
  let fail = 0;
  const failures: Array<{ metaId: string; error: string }> = [];
  for (const o of ops) {
    const { error } = await supabase
      .from("session_teaching_meta")
      .upsert(o.payload, { onConflict: "session_id" });
    if (error) {
      console.error(`  ❌ ${o.metaId} → ${error.message}`);
      failures.push({ metaId: o.metaId, error: error.message });
      fail++;
      if (FAIL_FAST) {
        console.error(`\n🛑 fail-fast activo. Aborto tras primer error.\n`);
        break;
      }
    } else {
      console.log(`  ✅ ${o.metaId}`);
      ok++;
    }
  }

  console.log(`\n=== RESUMEN ===`);
  console.log(`OK:   ${ok}/20`);
  console.log(`FAIL: ${fail}/20`);
  if (failures.length > 0) {
    console.log(`\nFallos:`);
    failures.forEach((f) => console.log(`  - ${f.metaId}: ${f.error}`));
  }
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(`❌ Excepción: ${(e as Error).message}`);
  process.exit(1);
});
