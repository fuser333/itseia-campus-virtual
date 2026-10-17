/* eslint-disable no-console */
/**
 * seed-video-summaries.ts
 *
 * Genera resúmenes IA de los videos de las 20 sesiones del preuni IGNITE
 * usando YouTube transcripts + Kimi (moonshot-v1-32k), y los guarda en la
 * tabla video_summaries (cache).
 *
 * Uso:
 *   npx tsx scripts/seed-video-summaries.ts                # DRY RUN
 *   npx tsx scripts/seed-video-summaries.ts --commit       # genera y guarda
 *   npx tsx scripts/seed-video-summaries.ts --commit --force-regenerate
 *   npx tsx scripts/seed-video-summaries.ts --commit --only D1,D5
 *
 * Lee KIMI_API_KEY y SUPABASE_SERVICE_ROLE_KEY de .env.local.
 *
 * Seguridad post-revisor:
 *  - Discovery con 4-semanas pattern (igual a seed-teaching-meta)
 *  - Dry-run default; --commit para escribir
 *  - --force-regenerate sobrescribe el cache existente (default: respeta cache)
 *  - --only Dx,Dy para procesar un subset (utilidad de reintentos)
 *  - Service role limpio de process.env tras bootstrap
 *  - fail-fast opcional con --fail-fast
 *  - Rate limit: 1 segundo de pausa entre llamadas a Kimi (evitar 429)
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { resolve } from "node:path";

// ─── 1. Bootstrap env ───
const envPath = resolve(process.cwd(), ".env.local");
const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  console.error(`❌ No se pudo leer ${envPath}: ${dotenvResult.error.message}`);
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_LOCAL = process.env.SUPABASE_SERVICE_ROLE_KEY;
const KIMI_API_KEY_LOCAL = process.env.KIMI_API_KEY;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;
delete process.env.KIMI_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_LOCAL) {
  console.error("❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!KIMI_API_KEY_LOCAL) {
  console.error("❌ Falta KIMI_API_KEY en .env.local");
  process.exit(1);
}

const COMMIT = process.argv.includes("--commit");
const FAIL_FAST = process.argv.includes("--fail-fast");
const FORCE = process.argv.includes("--force-regenerate");

const onlyArgIdx = process.argv.indexOf("--only");
let ONLY_IDS: Set<string> | null = null;
if (onlyArgIdx >= 0) {
  const onlyValue = process.argv[onlyArgIdx + 1];
  if (!onlyValue || onlyValue.startsWith("--")) {
    console.error("❌ --only requiere lista de IDs (ej. --only D1,D5)");
    process.exit(1);
  }
  ONLY_IDS = new Set(onlyValue.split(",").map((s) => s.trim()).filter(Boolean));
  if (ONLY_IDS.size === 0) {
    console.error("❌ --only recibió lista vacía");
    process.exit(1);
  }
}

// Tope de seguridad por ejecución para evitar runaway cost
const MAX_CALLS_PER_RUN = 25; // 20 sesiones + 5 reintentos manuales máx

// Timeouts de red
const YOUTUBE_TIMEOUT_MS = 10000;
const KIMI_TIMEOUT_MS = 60000;

const MODE = `${COMMIT ? "COMMIT" : "DRY-RUN"}${FORCE ? " +force" : ""}${FAIL_FAST ? " +fail-fast" : ""}`;

// ─── 2. Kimi config ───
const KIMI_URL = "https://api.moonshot.ai/v1/chat/completions";
const KIMI_MODEL = "moonshot-v1-32k";

const SYSTEM_PROMPT = `Eres un asistente pedagógico que ayuda a docentes a preparar sus clases en ITSEIA (Instituto Ecuatoriano de Inteligencia Artificial). Recibirás la transcripción de un video de una sesión del preuniversitario. Devuelve un resumen para el docente en formato Markdown con esta estructura exacta:

## Resumen ejecutivo
3 frases que capturan la idea central del video.

## 5-7 hitos clave (con timestamp aproximado)
Lista con bullets, cada uno con \`[mm:ss]\` al inicio. Solo los momentos donde el video introduce un concepto, una demo, o un cambio de tema importante.

## Conceptos que el docente debe dominar antes de la clase
Lista de 3-5 bullets concretos.

## Preguntas que probablemente harán los alumnos
3 preguntas reales y específicas (no genéricas).

Tono: directo, profesional, en español ecuatoriano neutro. Sin saludos ni cierre.`;

// ─── 3. Tipos ───
interface DbSubject { id: string; slug: string; name: string; }
interface DbSession {
  id: string;
  number: number;
  title: string;
  subject_id: string;
  video_url: string | null;
}

const SESSIONS_PER_WEEK = 5;
const TOTAL_WEEKS = 4;

// ─── 4. Helpers ───
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// Trunca transcript respetando límite de palabras (no corta en medio)
function truncateAtBoundary(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  // Buscar el último delimitador natural (punto, salto, espacio)
  const lastPeriod = cut.lastIndexOf(".");
  const lastNewline = cut.lastIndexOf("\n");
  const lastSpace = cut.lastIndexOf(" ");
  const boundary = Math.max(lastPeriod, lastNewline, lastSpace);
  return boundary > maxLen * 0.8 ? cut.slice(0, boundary + 1) : cut;
}

async function fetchYoutubeTranscript(videoId: string): Promise<string | null> {
  for (const lang of ["es", "en"]) {
    try {
      const res = await fetch(
        `https://video.google.com/timedtext?lang=${lang}&v=${videoId}`,
        { signal: AbortSignal.timeout(YOUTUBE_TIMEOUT_MS) }
      );
      if (!res.ok) continue;
      const xml = await res.text();
      if (xml && xml.length > 50) {
        return xml
          .replace(/<[^>]+>/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, " ")
          .trim();
      }
    } catch {
      // timeout, network error, etc. → continue al siguiente idioma o devuelve null
    }
  }
  return null;
}

async function callKimi(transcriptOrUrl: string, hasTranscript: boolean): Promise<string> {
  const userMsg = hasTranscript
    ? `Transcripción del video:\n\n${truncateAtBoundary(transcriptOrUrl, 24000)}`
    : `No hay transcripción extraíble del video. URL: ${transcriptOrUrl}. Genera un resumen genérico para el docente basado en el título de la sesión y advierte explícitamente en el resumen ejecutivo que la transcripción no se pudo extraer y que el docente debe verificar el contenido en el video original antes de la clase.`;

  const res = await fetch(KIMI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KIMI_API_KEY_LOCAL}`,
    },
    body: JSON.stringify({
      model: KIMI_MODEL,
      temperature: 0.3,
      max_tokens: 2048,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMsg },
      ],
    }),
    signal: AbortSignal.timeout(KIMI_TIMEOUT_MS),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Kimi API ${res.status}: ${errBody.slice(0, 300)}`);
  }
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Kimi devolvió respuesta vacía");
  }
  return content.trim();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── 5. Discovery (idéntico patrón al seed-teaching-meta) ───
const STOPWORDS = new Set([
  "para", "como", "tipo", "con", "que", "este", "esta", "una", "unos", "unas",
  "los", "las", "del", "por", "sin", "sobre", "entre", "hacia",
  "inteligencia", "artificial", "curso", "clase", "datos", "data",
  "session", "sesion", "tema", "modulo",
]);

const SUBJECT_NAME_HINTS_RAW = ["ignite", "preuniversitario", "preuni"];
const SUBJECT_NAME_HINTS = SUBJECT_NAME_HINTS_RAW.map((h) =>
  h.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
);

type WeekSubject = { subject: DbSubject; sessions: DbSession[]; weekNumber: number };

async function discoverPreuniWeeks(supabase: ReturnType<typeof createClient>): Promise<WeekSubject[]> {
  const { data: programs } = await supabase
    .from("programs").select("id, slug, name, type").eq("type", "preuni");
  if (!programs || programs.length === 0) throw new Error("No hay programs preuni");

  const programIds = programs.map((p) => p.id);
  const { data: semesters } = await supabase
    .from("semesters").select("id, program_id, number").in("program_id", programIds);
  const semesterIds = (semesters ?? []).map((s) => s.id);
  if (semesterIds.length === 0) throw new Error("No hay semesters bajo programs preuni");

  const { data: candidates } = await supabase
    .from("subjects").select("id, slug, name, semester_id").in("semester_id", semesterIds);
  if (!candidates || candidates.length === 0) throw new Error("No hay subjects preuni");

  const weekSubjects: WeekSubject[] = [];
  for (const c of candidates) {
    const slugLower = (c.slug ?? "").toLowerCase();
    const nameLower = (c.name ?? "").toLowerCase();
    const score = SUBJECT_NAME_HINTS.reduce(
      (acc, hint) => acc + (slugLower.includes(hint) ? 2 : 0) + (nameLower.includes(hint) ? 1 : 0),
      0
    );
    if (score === 0) continue;

    const weekFromSlug = (c.slug ?? "").match(/semana[-_ ]?(\d+)/i)?.[1];
    const weekFromName = (c.name ?? "").match(/semana[-_ ]?(\d+)/i)?.[1];
    const weekNumber = parseInt(weekFromSlug ?? weekFromName ?? "0", 10);
    if (!weekNumber || weekNumber < 1 || weekNumber > TOTAL_WEEKS) continue;

    const { data: sess } = await supabase
      .from("sessions")
      .select("id, number, title, subject_id, video_url")
      .eq("subject_id", c.id)
      .order("number", { ascending: true });
    const sessList = (sess ?? []) as DbSession[];
    if (sessList.length !== SESSIONS_PER_WEEK) continue;

    weekSubjects.push({ subject: c, sessions: sessList, weekNumber });
  }

  if (weekSubjects.length !== TOTAL_WEEKS) {
    throw new Error(`Esperaba ${TOTAL_WEEKS} semanas, encontré ${weekSubjects.length}`);
  }

  // Validar mismo program
  const subjIds = weekSubjects.map((w) => w.subject.id);
  const { data: ownSems } = await supabase
    .from("subjects").select("id, semester_id").in("id", subjIds);
  const semSet = new Set((ownSems ?? []).map((s) => s.semester_id));
  const { data: progs } = await supabase
    .from("semesters").select("id, program_id").in("id", Array.from(semSet));
  const progSet = new Set((progs ?? []).map((p) => p.program_id));
  if (progSet.size !== 1) {
    throw new Error(`Las semanas pertenecen a ${progSet.size} programs distintos`);
  }

  // Validar weekNumbers únicos [1,2,3,4]
  const weekNumbers = weekSubjects.map((w) => w.weekNumber).sort();
  const expected = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);
  if (JSON.stringify(weekNumbers) !== JSON.stringify(expected)) {
    throw new Error(`Semanas mal numeradas: ${weekNumbers.join(",")}`);
  }

  weekSubjects.sort((a, b) => a.weekNumber - b.weekNumber);
  return weekSubjects;
}

function dCodeForSession(weekNumber: number, sessionInWeek: number): string {
  return `D${(weekNumber - 1) * SESSIONS_PER_WEEK + sessionInWeek}`;
}

// ─── 6. Main ───
async function main() {
  console.log(`\n=== seed-video-summaries — modo ${MODE} ===\n`);

  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_LOCAL!, {
    auth: { persistSession: false },
  });

  console.log("Discovery del preuni IGNITE…");
  const weeks = await discoverPreuniWeeks(supabase);
  console.log(`✅ ${weeks.length} semanas × ${SESSIONS_PER_WEEK} sesiones = 20 sessions\n`);

  // Listar TODAS las sessions con D code
  const allSessions: Array<{ dCode: string; session: DbSession; week: number }> = [];
  for (const w of weeks) {
    for (const s of w.sessions) {
      allSessions.push({ dCode: dCodeForSession(w.weekNumber, s.number), session: s, week: w.weekNumber });
    }
  }

  // Cargar resúmenes existentes
  const { data: existing } = await supabase
    .from("video_summaries").select("session_id, generado_at");
  const existingMap = new Map((existing ?? []).map((e) => [e.session_id as string, e.generado_at as string]));

  // Determinar qué procesar
  const toProcess = allSessions.filter((x) => {
    if (ONLY_IDS && !ONLY_IDS.has(x.dCode)) return false;
    if (!x.session.video_url) return false;
    if (!FORCE && existingMap.has(x.session.id)) return false;
    return true;
  });

  const skipped = allSessions.length - toProcess.length;
  console.log(`Plan:`);
  console.log(`  Total sesiones: ${allSessions.length}`);
  console.log(`  Sin video_url: ${allSessions.filter((x) => !x.session.video_url).length}`);
  console.log(`  Con resumen cacheado (skip salvo --force): ${existingMap.size}`);
  console.log(`  A procesar: ${toProcess.length}`);
  console.log(`  Skip: ${skipped}\n`);

  for (const item of toProcess) {
    console.log(`  ${item.dCode} (S${item.week}.${item.session.number}) ${item.session.title.slice(0, 50)}`);
  }
  console.log();

  if (toProcess.length === 0) {
    console.log("Nada que hacer. Saliendo.");
    process.exit(0);
  }

  // Tope de seguridad de costo
  if (toProcess.length > MAX_CALLS_PER_RUN) {
    console.error(`\n❌ Más de ${MAX_CALLS_PER_RUN} videos a procesar (${toProcess.length}). Aborto por seguridad de costo.`);
    console.error(`   Usa --only para subset específico, o ajusta MAX_CALLS_PER_RUN en el script.`);
    process.exit(1);
  }

  if (!COMMIT) {
    console.log(`[DRY-RUN] Pasaría a Kimi ${toProcess.length} videos. No se generó nada.\n`);
    process.exit(0);
  }

  console.log(`Generando ${toProcess.length} resúmenes con Kimi (pausa 1s entre cada uno)…\n`);
  let ok = 0;
  let fail = 0;
  let noTranscript = 0;
  const failures: Array<{ dCode: string; error: string }> = [];

  for (const item of toProcess) {
    const t0 = Date.now();
    try {
      const videoId = extractVideoId(item.session.video_url!);
      let transcript: string | null = null;
      if (videoId) transcript = await fetchYoutubeTranscript(videoId);
      if (!transcript) noTranscript++;

      const resumen_md = transcript
        ? await callKimi(transcript, true)
        : await callKimi(item.session.video_url!, false);

      const { error } = await supabase
        .from("video_summaries")
        .upsert(
          {
            session_id: item.session.id,
            video_url: item.session.video_url!,
            resumen_md,
            timestamps: [],
            modelo: KIMI_MODEL,
            generado_at: new Date().toISOString(),
          },
          { onConflict: "session_id" }
        );
      if (error) throw new Error(error.message);

      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`  ✅ ${item.dCode} (${dt}s${transcript ? "" : " · sin transcript"})`);
      ok++;
    } catch (e) {
      const msg = (e as Error).message;
      console.error(`  ❌ ${item.dCode} → ${msg}`);
      failures.push({ dCode: item.dCode, error: msg });
      fail++;
      if (FAIL_FAST) {
        console.error(`\n🛑 fail-fast activo. Aborto.`);
        break;
      }
    }

    // Rate limit: 1s entre llamadas
    if (toProcess.indexOf(item) < toProcess.length - 1) await sleep(1000);
  }

  console.log(`\n=== RESUMEN ===`);
  console.log(`OK:             ${ok}/${toProcess.length}`);
  console.log(`Sin transcript: ${noTranscript} (resumen genérico con warning)`);
  console.log(`FAIL:           ${fail}/${toProcess.length}`);
  if (failures.length > 0) {
    console.log(`\nFallos (reintenta con --only ${failures.map((f) => f.dCode).join(",")}):`);
    failures.forEach((f) => console.log(`  - ${f.dCode}: ${f.error}`));
  }
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(`❌ Excepción: ${(e as Error).message}`);
  process.exit(1);
});
