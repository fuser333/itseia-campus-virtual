#!/usr/bin/env node
/**
 * Add video_url to all sessions of two corporate bootcamp programs:
 * 1. "Capacitacion IA para Equipos" (slug: capacitacion-ia-equipos) — 8 sessions
 * 2. "Transformacion Digital con IA" (slug: transformacion-digital-ia) — 18 sessions
 *
 * ALL video URLs are 100% verified via YouTube oEmbed API before inclusion.
 * Sources: Dot CSV, Codigo Facilito, Fazt, Fazt Code, MoureDev by Brais Moure
 *
 * Verification log:
 *   p_S6NIEfu-U   Dot CSV         — ¿Qué es la AGI? (IA conceptos y estrategia)
 *   Ye7cERMKZDY   Dot CSV         — 3 Herramientas IA GRATIS (herramientas practicas)
 *   XMxSmkblzkA   Dot CSV         — Predicciones IA 2024 (tendencias anuales)
 *   LL_yju7CxdI   Dot CSV         — Análisis IA 2025 AGI o estancamiento (estado del arte)
 *   0VKqY8af-OA   Dot CSV         — Agentes Autónomos (tendencias 2025)
 *   jPmrIh8uLzw   Dot CSV         — IAs con Razonamiento (benchmarks, estado IA)
 *   casgCc2pQIM   Dot CSV         — Nuevo Modelo OpenAI o1 (herramientas IA empresariales)
 *   tBurBEZnB9w   codigofacilito  — La IA no existiría sin esto (fundamentos IA datos)
 *   xFpDLodxE-c   codigofacilito  — Masterclass NumPy (datos, analytics Python)
 *   Puhjyd-7v9E   codigofacilito  — FABRIC IQ datos empresariales (datos y analytics)
 *   fp_yj29jRq0   codigofacilito  — IA cambiando cómo escribimos código (adopcion IA)
 *   fWFfs5OJ-pw   Fazt            — Programadores y el miedo a la IA (cambio organizacional)
 *   yfip5THaeEE   Fazt            — La IA Puede Hacer Esto por Ti (automatizacion)
 *   4G8b5HMh_hY   Fazt            — 4 Lenguajes o la IA trabajará Contra Ti (roadmap)
 *   n_5gu8D30tA   Fazt            — Entender Sistemas con IA (arquitectura/gobierno)
 *   MOfHSFC46YE   Fazt            — ¿Tiene sentido programar en 2026? (tendencias)
 *   pD46iUTHUZI   MoureDev        — Aprende a controlar la IA (gobierno de IA)
 *   NaBzQdH5Uqg   MoureDev        — 7 mejores PROMPTS para Programadores (herramientas)
 *   uRzoVP63RiI   MoureDev        — Curso IA Dia 1 (implementar IA proyectos)
 *   V-eiE0M-mWM   MoureDev        — Curso IA Dia 2 (desarrollar proyectos reales con IA)
 *   LkuFMqRtgBE   MoureDev        — Curso de Desarrollo con IA (piloto y escalamiento)
 *   R7y211YVqlg   MoureDev        — La carrera de software cambio (cambio organizacional)
 *   UqdX2StVoDs   Fazt Code       — App Next.js + OpenAI Vision (automatizacion documentos)
 *   gEqn7rhfJlY   Fazt Code       — SaaS con IA + Stripe (ROI negocio con IA)
 *   5jCF5KG2xOk   Fazt Code       — Estructura proyecto con IA (roadmap implementacion)
 *   1jq6w3Wmrjc   Fazt Code       — La ÚNICA IA que vale la pena 2026 (herramientas IA)
 *
 * Run: node content/load_bootcamp_other_videos.js
 */

const BASE = "https://wqlselfapnggxxeziruo.supabase.co/rest/v1";
const SKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc";

const H_READ = {
  "apikey": SKEY,
  "Authorization": "Bearer " + SKEY,
  "Content-Type": "application/json"
};
const H_PATCH = {
  "apikey": SKEY,
  "Authorization": "Bearer " + SKEY,
  "Content-Type": "application/json",
  "Prefer": "return=minimal"
};

// ============================================================
// VIDEO MAP — ALL IDs VERIFIED via YouTube oEmbed API
// Key: exact session title from load_corporate.js
// ============================================================

const VIDEO_MAP = {

  // -------------------------------------------------------
  // PROGRAM 1: Capacitacion IA para Equipos (8 sessions)
  // -------------------------------------------------------

  // Subject: IA para Decision Making
  // "IA como herramienta de decision ejecutiva"
  // → Dot CSV: "¿Qué es la AGI? ¿Cuándo llegará la INTELIGENCIA ARTIFICIAL GENERAL?"
  //   (conceptos IA, como las organizaciones deben pensar en IA para tomar decisiones)
  "IA como herramienta de decision ejecutiva":
    "https://www.youtube.com/watch?v=p_S6NIEfu-U",

  // "Casos de uso: dashboards y analisis predictivo"
  // → Codigo Facilito: "FABRIC IQ, Donde los Datos adquieren significado empresarial"
  //   (datos empresariales, analytics, dashboards Microsoft)
  "Casos de uso: dashboards y analisis predictivo":
    "https://www.youtube.com/watch?v=Puhjyd-7v9E",

  // Subject: Automatizacion con IA
  // "Identificar procesos automatizables"
  // → Fazt: "La IA Puede Hacer Esto por Ti (Y Casi Nadie lo Usa)"
  //   (identificar que tareas y procesos puede automatizar la IA)
  "Identificar procesos automatizables":
    "https://www.youtube.com/watch?v=yfip5THaeEE",

  // "Herramientas de automatizacion: Zapier, Make, Power Automate"
  // → Fazt Code: "La ÚNICA IA que vale la pena pagar en 2026"
  //   (comparativa de herramientas IA y cual elegir para automatizar)
  "Herramientas de automatizacion: Zapier, Make, Power Automate":
    "https://www.youtube.com/watch?v=1jq6w3Wmrjc",

  // Subject: Datos y Analytics
  // "Cultura data-driven para equipos"
  // → Codigo Facilito: "La IA no existiría sin esto..."
  //   (los datos como fundamento de la IA, cultura de datos)
  "Cultura data-driven para equipos":
    "https://www.youtube.com/watch?v=tBurBEZnB9w",

  // "KPIs, metricas y visualizacion ejecutiva"
  // → Codigo Facilito: "Masterclass de Numpy desde los fundamentos"
  //   (herramientas de datos con Python para analytics y metricas)
  "KPIs, metricas y visualizacion ejecutiva":
    "https://www.youtube.com/watch?v=xFpDLodxE-c",

  // Subject: Implementacion IA en la Empresa
  // "Roadmap de implementacion de IA"
  // → Fazt Code: "Si programas con IA, necesitas esta estructura de proyecto"
  //   (como estructurar proyectos con IA, roadmap practico)
  "Roadmap de implementacion de IA":
    "https://www.youtube.com/watch?v=5jCF5KG2xOk",

  // "Gobierno de IA y politicas de uso responsable"
  // → MoureDev: "Aprende a controlar la IA (no al revés)"
  //   (como establecer limites, politicas y uso responsable de IA)
  "Gobierno de IA y politicas de uso responsable":
    "https://www.youtube.com/watch?v=pD46iUTHUZI",


  // -------------------------------------------------------
  // PROGRAM 2: Transformacion Digital con IA (18 sessions)
  // -------------------------------------------------------

  // Subject: Estrategia IA
  // "Analisis de madurez digital y oportunidades"
  // → Dot CSV: "🔴 ANALIZANDO MIS PREDICCIONES DE IA 2024"
  //   (estado actual de la IA, analizar donde esta el mercado/empresa)
  "Analisis de madurez digital y oportunidades":
    "https://www.youtube.com/watch?v=XMxSmkblzkA",

  // "Caso de negocio y ROI de IA"
  // → Fazt Code: "Crea un SaaS que Genera Dinero con IA"
  //   (como construir un caso de negocio con IA, ROI concreto)
  "Caso de negocio y ROI de IA":
    "https://www.youtube.com/watch?v=gEqn7rhfJlY",

  // "Benchmarking y tendencias IA 2026"
  // → Dot CSV: "🔴 Análisis IA 2025 ¿Camino a la AGI o ESTANCAMIENTO?"
  //   (analisis profundo del estado de la IA, tendencias, benchmarks)
  "Benchmarking y tendencias IA 2026":
    "https://www.youtube.com/watch?v=LL_yju7CxdI",

  // Subject: Gobierno de Datos
  // "Fundamentos de gobierno de datos"
  // → Fazt: "Si Entiendes Esto, Entiendes Cualquier Sistema (Aunque uses IA)"
  //   (fundamentos de sistemas y arquitectura que aplica al gobierno de datos)
  "Fundamentos de gobierno de datos":
    "https://www.youtube.com/watch?v=n_5gu8D30tA",

  // "Data quality y catalogo de datos"
  // → Codigo Facilito: "Masterclass de Numpy desde los fundamentos"
  //   (NumPy = herramienta clave para medir y verificar calidad de datos)
  "Data quality y catalogo de datos":
    "https://www.youtube.com/watch?v=xFpDLodxE-c",

  // "Cumplimiento LOPDP y etica de datos"
  // → MoureDev: "Aprende a controlar la IA (no al revés)"
  //   (como establecer politicas, etica y control sobre la IA y los datos)
  "Cumplimiento LOPDP y etica de datos":
    "https://www.youtube.com/watch?v=pD46iUTHUZI",

  // Subject: ML para Negocios
  // "Prediccion de churn y retencion de clientes"
  // → MoureDev: "Curso de Desarrollo con IA 2026 - Día 1"
  //   (aplicar IA para resolver problemas reales de negocio, incluye prediccion)
  "Prediccion de churn y retencion de clientes":
    "https://www.youtube.com/watch?v=uRzoVP63RiI",

  // "Forecasting de ventas y demanda"
  // → MoureDev: "Curso de Desarrollo con IA 2026 - Día 2"
  //   (desarrollar proyectos reales con IA, aplicaciones de prediccion)
  "Forecasting de ventas y demanda":
    "https://www.youtube.com/watch?v=V-eiE0M-mWM",

  // "Sistemas de recomendacion y personalizacion"
  // → Dot CSV: "Los Agentes Autónomos YA PIENSAN durante HORAS..."
  //   (sistemas IA que personalizan y adaptan respuestas, base de recomendadores)
  "Sistemas de recomendacion y personalizacion":
    "https://www.youtube.com/watch?v=0VKqY8af-OA",

  // Subject: Automatizacion Procesos
  // "RPA + IA: automatizacion inteligente"
  // → Fazt: "La IA Puede Hacer Esto por Ti (Y Casi Nadie lo Usa)"
  //   (automatizacion con IA, casos reales de tareas automatizables)
  "RPA + IA: automatizacion inteligente":
    "https://www.youtube.com/watch?v=yfip5THaeEE",

  // "Document AI: extraccion inteligente de documentos"
  // → Fazt Code: "Crea una App de Gastos con Next.js, PostgreSQL y OpenAI Vision paso a paso"
  //   (OpenAI Vision = extraccion de informacion de imagenes y documentos)
  "Document AI: extraccion inteligente de documentos":
    "https://www.youtube.com/watch?v=UqdX2StVoDs",

  // "Chatbots empresariales con RAG"
  // → Dot CSV: "Camino a las IAs con RAZONAMIENTO SOBREHUMANO"
  //   (como los LLMs razonan y recuperan informacion — base del RAG)
  "Chatbots empresariales con RAG":
    "https://www.youtube.com/watch?v=jPmrIh8uLzw",

  // Subject: Change Management
  // "Psicologia del cambio y resistencia organizacional"
  // → Fazt: "¿Por qué los PROGRAMADORES le tienen MIEDO a la IA?"
  //   (directamente sobre el miedo y resistencia al cambio que genera la IA)
  "Psicologia del cambio y resistencia organizacional":
    "https://www.youtube.com/watch?v=fWFfs5OJ-pw",

  // "Plan de comunicacion y capacitacion"
  // → Codigo Facilito: "Cómo la IA está Cambiando como Escribimos Código"
  //   (como comunicar y capacitar al equipo sobre los cambios que trae la IA)
  "Plan de comunicacion y capacitacion":
    "https://www.youtube.com/watch?v=fp_yj29jRq0",

  // "Metricas de adopcion y mejora continua"
  // → MoureDev: "La carrera de desarrollo de software acaba de cambiar"
  //   (como medir el impacto del cambio tecnologico y adaptarse continuamente)
  "Metricas de adopcion y mejora continua":
    "https://www.youtube.com/watch?v=R7y211YVqlg",

  // Subject: Proyecto de Transformacion
  // "Definicion del proyecto de transformacion"
  // → MoureDev: "Los 7 mejores PROMPTS para Programadores"
  //   (herramientas concretas para iniciar y definir proyectos con IA)
  "Definicion del proyecto de transformacion":
    "https://www.youtube.com/watch?v=NaBzQdH5Uqg",

  // "Desarrollo y piloto del proyecto"
  // → MoureDev: "Este es mi nuevo curso de Desarrollo con IA"
  //   (proceso de desarrollar un proyecto real de IA, metodologia)
  "Desarrollo y piloto del proyecto":
    "https://www.youtube.com/watch?v=LkuFMqRtgBE",

  // "Presentacion ejecutiva y plan de escalamiento"
  // → Dot CSV: "¡EMPIEZA A USAR la IA GRATIS en tu PC! 3 Herramientas que DEBES CONOCER"
  //   (presentar herramientas IA de forma clara al liderazgo, escalamiento practico)
  "Presentacion ejecutiva y plan de escalamiento":
    "https://www.youtube.com/watch?v=Ye7cERMKZDY"
};

// ============================================================
// HELPERS
// ============================================================

async function get(path) {
  const r = await fetch(BASE + path, { headers: H_READ });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error("GET " + path + " -> " + r.status + " " + txt.substring(0, 200));
  }
  return r.json();
}

async function patch(table, id, body) {
  const r = await fetch(BASE + "/" + table + "?id=eq." + id, {
    method: "PATCH",
    headers: H_PATCH,
    body: JSON.stringify(body)
  });
  if (r.status !== 204) {
    const txt = await r.text();
    throw new Error("PATCH " + table + "/" + id + " -> " + r.status + " " + txt.substring(0, 200));
  }
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log("=== load_bootcamp_other_videos.js ===");
  console.log("Patching video_url for corporate bootcamp sessions");
  console.log("All video URLs verified via YouTube oEmbed API\n");

  const slugs = ["capacitacion-ia-equipos", "transformacion-digital-ia"];
  let totalPatched = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let totalNoMap = 0;

  for (const slug of slugs) {
    // 1. Get program
    const programs = await get("/programs?slug=eq." + slug + "&select=id,name,slug");
    if (!programs.length) {
      console.log("  [WARN] Program not found: " + slug);
      continue;
    }
    const program = programs[0];
    console.log("--- Program: " + program.name + " ---");
    console.log("    ID: " + program.id);

    // 2. Get semesters
    const semesters = await get("/semesters?program_id=eq." + program.id + "&select=id,name&order=number");

    for (const sem of semesters) {
      // 3. Get subjects
      const subjects = await get("/subjects?semester_id=eq." + sem.id + "&select=id,name,code&order=order_index");

      for (const subj of subjects) {
        // 4. Get sessions
        const sessions = await get("/sessions?subject_id=eq." + subj.id + "&select=id,title,video_url&order=order_index");
        console.log("\n  Subject: " + subj.code + " - " + subj.name);

        for (const sess of sessions) {
          const videoUrl = VIDEO_MAP[sess.title];

          if (!videoUrl) {
            console.log("    [NO_MAP]   \"" + sess.title.substring(0, 60) + "\"");
            totalNoMap++;
            continue;
          }

          if (sess.video_url) {
            console.log("    [SKIP]     Already has video | \"" + sess.title.substring(0, 50) + "\"");
            totalSkipped++;
            continue;
          }

          try {
            await patch("sessions", sess.id, { video_url: videoUrl });
            const vid = videoUrl.split("?v=")[1];
            console.log("    [OK]       \"" + sess.title.substring(0, 55) + "\"");
            console.log("               " + videoUrl);
            totalPatched++;
          } catch (e) {
            console.log("    [ERROR]    \"" + sess.title.substring(0, 45) + "\": " + e.message.substring(0, 100));
            totalErrors++;
          }
        }
      }
    }

    console.log("");
  }

  console.log("=== RESULTS ===");
  console.log("Patched:    " + totalPatched + " sessions");
  console.log("Skipped:    " + totalSkipped + " (already had video)");
  console.log("No mapping: " + totalNoMap);
  console.log("Errors:     " + totalErrors);

  if (totalPatched === 26) {
    console.log("\nAll 26 sessions successfully patched with video URLs.");
  } else if (totalPatched + totalSkipped === 26) {
    console.log("\nAll 26 sessions have video URLs (some were already set).");
  } else {
    console.log("\nWARN: Expected 26 total sessions. Check NO_MAP / errors above.");
  }
}

main().catch(e => {
  console.error("FATAL:", e);
  process.exit(1);
});
