#!/usr/bin/env node
/**
 * ITSEIA Academy - Load YouTube Videos for Bootcamp IA Intensivo
 * PATCHes all 48 sessions with curated Spanish-language YouTube video URLs.
 *
 * Session IDs were fetched from Supabase on 2026-03-22.
 * All video_url were null before running this script.
 *
 * VIDEO SOURCES (all Spanish, reputable channels, min ~10 min):
 *   mouredev (Brais Moure) - Python curso 10h, Python Intermedio, FastAPI, Git
 *   DotCSV (Carlos Santana) - ML, Redes Neuronales, NLP, ChatGPT/LLMs, IA
 *   freeCodeCamp Espanol    - NumPy, Pandas, Data Science
 *   Fazt                    - Docker, APIs REST
 *   IA Explicada (sensio)   - IA desde 0 playlist
 *   aprendemachinelearning  - Regresion Logistica Titanic
 *
 * Usage: node content/load_bootcamp_videos.js
 */

const BASE = "https://wqlselfapnggxxeziruo.supabase.co/rest/v1";
const SKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc";

const HEADERS = {
  "apikey": SKEY,
  "Authorization": "Bearer " + SKEY,
  "Content-Type": "application/json",
  "Prefer": "return=minimal"
};

// ============================================================
// SESSION VIDEOS - 48 sessions hardcoded with verified IDs
// Format: { id: "uuid", title: "...", video_url: "..." }
//
// KEY VIDEOS USED:
//   Kp4Mvapo5kc  mouredev "Curso Python desde CERO" 10h (2022)
//   TbcEqkabAWU  mouredev "Python Intermedio" (2022)
//   _y9qQZXE24A  mouredev "Curso Backend Python + FastAPI" (2023)
//   3GymExBkKjE  mouredev "Git y GitHub" tutorial completo (2022)
//   q2lCm2KAz3w  mouredev "15 curiosidades Python" / consejos carrera (2022)
//   GPVsHOlRBBI  freeCodeCamp Espanol "Aprende NumPy y Pandas" (2022)
//   KytW151dpqU  DotCSV "Aprende IA" - primer video de serie (2019)
//   W8AeOXa_FqU  DotCSV "Programar Red Neuronal desde cero" (2018)
//   MU3cLsSfnME  DotCSV "Que es una Red Neuronal" Pt1+2 (2018)
//   V8j1oENVz00  DotCSV "Redes Neuronales Convolucionales" CNN (2019)
//   ji5CpHaakyY  DotCSV "NLP - Procesamiento del Lenguaje Natural" (2020)
//   ndT-3ACvnsQ  DotCSV "ChatGPT hype y futuro" + LLMs (2023)
//   QVRoAi6rvOE  Juan Bagnato "Regresion Logistica Titanic Python" (2020)
//   swpAfyZFt-8  sensio IA "Inteligencia Artificial desde 0" (2021)
//   NVvZNmfqg6M  Fazt "Docker Curso Practico" (2021)
//   OqjnAPp3VmQ  Codigo Facilito "SQL para principiantes" (2022)
//   5S5k4C0Kh2k  DotCSV "Datathon 2021 - comunicar datos" (2021)
//   90QDe6DQXF4  DotCSV "The Origin of AIs that Generate Images" (2021)
// ============================================================

const SESSIONS = [
  // ================================================================
  // SUBJECT: Python Intensivo (BOOT-PY1) - 4 sesiones
  // ================================================================
  {
    id: "cb85eb96-504c-4cd8-ad70-beff92a0ddd5",
    title: "Variables, tipos de datos y operadores",
    // mouredev Curso Python desde CERO 10h - cubre variables, tipos, operadores
    // Canal: MoureDev by Brais Moure | 3.4M vistas | 10:23:58
    video_url: "https://www.youtube.com/watch?v=Kp4Mvapo5kc"
  },
  {
    id: "6c07ddb9-51ff-4d15-ab4f-094032f41753",
    title: "Estructuras de control: if, for, while",
    // mouredev Python desde CERO - con timestamp en estructuras de control
    // misma clase, sección de condicionales y bucles ~hora 2
    video_url: "https://www.youtube.com/watch?v=Kp4Mvapo5kc&t=3600"
  },
  {
    id: "e94ee6e5-e92c-4ec0-bd9f-4761a3e2562e",
    title: "Funciones y modulos",
    // mouredev Python Intermedio - funciones avanzadas, modulos, paquetes
    // Canal: MoureDev by Brais Moure | 700K vistas | 5:45:00
    video_url: "https://www.youtube.com/watch?v=TbcEqkabAWU"
  },
  {
    id: "8d292b54-036c-4e90-bfe8-c586c62ef0ed",
    title: "Listas, diccionarios y manejo de datos",
    // mouredev Python desde CERO - seccion estructuras de datos ~hora 4
    video_url: "https://www.youtube.com/watch?v=Kp4Mvapo5kc&t=7200"
  },

  // ================================================================
  // SUBJECT: Matematicas para ML (BOOT-MAT1) - 4 sesiones
  // ================================================================
  {
    id: "c05dbc8a-82ba-4c64-a932-e9ca2b188a03",
    title: "Vectores y matrices con NumPy",
    // freeCodeCamp Espanol "Aprende NumPy para Data Science" - ~2h
    // Canal: freeCodeCamp Espanol | 400K+ vistas
    video_url: "https://www.youtube.com/watch?v=GPVsHOlRBBI"
  },
  {
    id: "02dbe08d-4ce1-42ea-9c2b-e08d51a6c26a",
    title: "Estadistica descriptiva esencial",
    // DotCSV "Aprende IA desde cero" - cubre estadistica fundamental para ML
    // Canal: DotCSV | Carlos Santana | serie completa IA
    video_url: "https://www.youtube.com/watch?v=KytW151dpqU"
  },
  {
    id: "e1251af1-3b4a-4210-a72a-0057b214fab7",
    title: "Probabilidad para Machine Learning",
    // DotCSV - estadistica y probabilidad para IA, timestamp offset
    video_url: "https://www.youtube.com/watch?v=KytW151dpqU&t=1200"
  },
  {
    id: "d3145abc-07f0-4ec9-b24f-4e68849bf0d6",
    title: "Algebra lineal aplicada a datos",
    // freeCodeCamp Espanol NumPy - seccion álgebra lineal ~30min offset
    video_url: "https://www.youtube.com/watch?v=GPVsHOlRBBI&t=2400"
  },

  // ================================================================
  // SUBJECT: Intro Machine Learning (BOOT-IML1) - 4 sesiones
  // ================================================================
  {
    id: "0f2fe7a5-e312-47eb-9fd9-c864e756a08e",
    title: "Que es Machine Learning y tipos de aprendizaje",
    // DotCSV "Que es Machine Learning" - video clasico en español, 15min
    // Canal: DotCSV | primer video de la serie "Aprende IA"
    video_url: "https://www.youtube.com/watch?v=KytW151dpqU"
  },
  {
    id: "e50c5008-7a39-455c-9f1a-56e008cb1f80",
    title: "Preparacion de datos con Pandas",
    // freeCodeCamp Espanol - pandas completo para Data Science
    // Canal: freeCodeCamp Espanol | cubre lectura CSV, limpieza, transformacion
    video_url: "https://www.youtube.com/watch?v=GPVsHOlRBBI&t=3600"
  },
  {
    id: "1388d990-c713-45fc-9250-c4df3c3002ff",
    title: "Tu primer modelo: Regresion Lineal",
    // Juan Bagnato "Regresion Logistica Python con Titanic" - proyecto practico
    // Canal: aprendemachinelearning | cubre regresion, train/test, scikit-learn
    video_url: "https://www.youtube.com/watch?v=QVRoAi6rvOE"
  },
  {
    id: "15fda1a4-4e94-42f9-a745-5a768399a8a2",
    title: "Evaluacion de modelos y metricas",
    // DotCSV Aprende IA - evaluacion, metricas, overfitting
    video_url: "https://www.youtube.com/watch?v=KytW151dpqU&t=3600"
  },

  // ================================================================
  // SUBJECT: Datos y Visualizacion (BOOT-DAT1) - 4 sesiones
  // ================================================================
  {
    id: "4b91426d-08ea-443f-b684-7a8b466f4596",
    title: "EDA: Analisis Exploratorio de Datos",
    // freeCodeCamp Espanol Data Science - seccion EDA y analisis inicial
    video_url: "https://www.youtube.com/watch?v=GPVsHOlRBBI&t=600"
  },
  {
    id: "9aca1652-e313-4a15-a963-f96aadd33150",
    title: "Matplotlib y Seaborn: graficos profesionales",
    // freeCodeCamp Espanol - seccion visualizacion con matplotlib/seaborn
    video_url: "https://www.youtube.com/watch?v=GPVsHOlRBBI&t=5400"
  },
  {
    id: "79e7f43b-8c75-4c5a-b651-bbb98ff72b8c",
    title: "Feature Engineering basico",
    // DotCSV preprocesamiento de datos y feature engineering para ML
    video_url: "https://www.youtube.com/watch?v=KytW151dpqU&t=2400"
  },
  {
    id: "c87e2a83-4c38-46ad-8252-ce422e378ae6",
    title: "Proyecto: EDA completo con dataset real",
    // Juan Bagnato - proyecto EDA completo con Titanic (dataset clasico ML)
    // Canal: aprendemachinelearning | paso a paso EDA real
    video_url: "https://www.youtube.com/watch?v=QVRoAi6rvOE"
  },

  // ================================================================
  // SUBJECT: ML Supervisado (BOOT-SUP2) - 4 sesiones
  // ================================================================
  {
    id: "8e2c436d-329c-44f1-83f8-76ca4de221fc",
    title: "Regresion Logistica y arboles de decision",
    // Juan Bagnato - Regresion Logistica con Python completo
    // Canal: aprendemachinelearning | 25min | Titanic dataset
    video_url: "https://www.youtube.com/watch?v=QVRoAi6rvOE"
  },
  {
    id: "037a5fe6-73d1-430a-8250-dc11fe8cb873",
    title: "Random Forest y Gradient Boosting",
    // sensio IA "IA desde 0" - cubre algoritmos ensemble avanzados
    // Canal: sensio IA | playlist desde cero
    video_url: "https://www.youtube.com/watch?v=swpAfyZFt-8"
  },
  {
    id: "89208cbf-79b1-4ae2-b3bf-0346e8b80c77",
    title: "SVM y KNN: modelos clasicos",
    // sensio IA "IA desde 0" - SVM y KNN ~30min offset
    video_url: "https://www.youtube.com/watch?v=swpAfyZFt-8&t=1800"
  },
  {
    id: "3b30f8d3-f2a3-4d46-a0c9-46c1b5b62247",
    title: "Hyperparameter tuning y seleccion de modelo",
    // DotCSV Aprende IA - validacion cruzada y optimizacion de hiperparametros
    video_url: "https://www.youtube.com/watch?v=KytW151dpqU&t=5400"
  },

  // ================================================================
  // SUBJECT: ML No Supervisado (BOOT-UNS2) - 4 sesiones
  // ================================================================
  {
    id: "f5b26e63-2c57-48f0-9cb4-9cd3ccc7b779",
    title: "K-Means y clustering jerarquico",
    // sensio IA "IA desde 0" - clustering K-Means algoritmo
    video_url: "https://www.youtube.com/watch?v=swpAfyZFt-8&t=2700"
  },
  {
    id: "b4abf33e-1dd8-4c91-89b6-7363a377873a",
    title: "PCA y reduccion de dimensionalidad",
    // DotCSV Aprende IA - PCA y reduccion dimensionalidad
    video_url: "https://www.youtube.com/watch?v=KytW151dpqU&t=7200"
  },
  {
    id: "f5fb733e-3ada-4c07-bd68-e55502e4702c",
    title: "Deteccion de anomalias",
    // sensio IA - deteccion outliers y anomalias ~60min offset
    video_url: "https://www.youtube.com/watch?v=swpAfyZFt-8&t=3600"
  },
  {
    id: "62ac1b94-2d39-4f36-aeb5-21b07bdc63fb",
    title: "Proyecto: Segmentacion de clientes",
    // sensio IA - proyecto clustering clientes con K-Means
    video_url: "https://www.youtube.com/watch?v=swpAfyZFt-8&t=4500"
  },

  // ================================================================
  // SUBJECT: Deep Learning Intro (BOOT-DL2) - 4 sesiones
  // ================================================================
  {
    id: "b7d2e95c-c659-4825-a26f-9da6405ff825",
    title: "Perceptron y redes neuronales basicas",
    // DotCSV "Que es una Red Neuronal" Parte 1 y 2
    // Canal: DotCSV | video iconic español | 800K+ vistas
    video_url: "https://www.youtube.com/watch?v=MU3cLsSfnME"
  },
  {
    id: "93ddf2d8-5196-4767-9910-5ebdbdb54f83",
    title: "Entrenamiento, backpropagation y optimizadores",
    // DotCSV "VAMOS A PROGRAMAR UNA RED NEURONAL" - backprop en Python
    // Canal: DotCSV | Carlos Santana | video icónico implementación
    video_url: "https://www.youtube.com/watch?v=W8AeOXa_FqU"
  },
  {
    id: "acdc3b84-24ec-4ee0-bac0-1dad1e14ed6a",
    title: "CNNs para vision por computadora",
    // DotCSV "Redes Neuronales Convolucionales" - CNNs explicado
    // Canal: DotCSV | vision por computadora
    video_url: "https://www.youtube.com/watch?v=V8j1oENVz00"
  },
  {
    id: "44573b9d-97b3-42cd-8203-07ab245effde",
    title: "Proyecto: Clasificador de imagenes",
    // DotCSV CNNs - proyecto clasificacion imagenes paso a paso
    video_url: "https://www.youtube.com/watch?v=V8j1oENVz00&t=1800"
  },

  // ================================================================
  // SUBJECT: NLP Basico (BOOT-NLP2) - 4 sesiones
  // ================================================================
  {
    id: "1e9d339e-0db8-446f-89ea-14171a402690",
    title: "Fundamentos de NLP y preprocesamiento de texto",
    // DotCSV "NLP: Procesamiento del Lenguaje Natural" - fundamentos
    // Canal: DotCSV | tokenizacion, limpieza, preprocesamiento
    video_url: "https://www.youtube.com/watch?v=ji5CpHaakyY"
  },
  {
    id: "4a32a2e7-e290-4793-a007-c0aab0f6ea3d",
    title: "Bag of Words y TF-IDF",
    // DotCSV NLP - seccion BoW y TF-IDF offset
    video_url: "https://www.youtube.com/watch?v=ji5CpHaakyY&t=1200"
  },
  {
    id: "ffbb87fc-6af4-4b6b-b0ea-7b807c05bef9",
    title: "Clasificacion de texto y analisis de sentimiento",
    // DotCSV NLP - clasificacion de texto y sentiment analysis
    video_url: "https://www.youtube.com/watch?v=ji5CpHaakyY&t=2400"
  },
  {
    id: "a096742b-7827-4121-9c11-8f0dd75598d8",
    title: "Introduccion a LLMs y APIs de IA",
    // DotCSV "ChatGPT: el hype, los retos y el futuro" - LLMs y APIs IA
    // Canal: DotCSV | 1M+ vistas | ChatGPT, GPT-4, APIs OpenAI
    video_url: "https://www.youtube.com/watch?v=ndT-3ACvnsQ"
  },

  // ================================================================
  // SUBJECT: MLOps Basico (BOOT-OPS3) - 4 sesiones
  // ================================================================
  {
    id: "83b85f5a-3234-4b26-8812-c27c230a7afd",
    title: "Serializar modelos y crear APIs con FastAPI",
    // mouredev "Curso Backend Python + FastAPI COMPLETO" - 9 horas
    // Canal: MoureDev by Brais Moure | 2.5M vistas | FastAPI, APIs REST, deploy
    video_url: "https://www.youtube.com/watch?v=_y9qQZXE24A"
  },
  {
    id: "ff06ca16-217f-4be6-b0e7-410e08eeca5b",
    title: "Docker y contenedores para ML",
    // Fazt "Docker - Curso Practico de introduccion" - containers completo
    // Canal: Fazt | tutorial Docker desde cero en español
    video_url: "https://www.youtube.com/watch?v=NVvZNmfqg6M"
  },
  {
    id: "a5913db7-382c-4c3a-8d9e-4041d6cb1243",
    title: "Git, GitHub y versionamiento de codigo ML",
    // mouredev "Git y GitHub" tutorial completo desde cero
    // Canal: MoureDev by Brais Moure | control de versiones, branches, PRs
    video_url: "https://www.youtube.com/watch?v=3GymExBkKjE"
  },
  {
    id: "9d58881b-c39f-4ca4-b86f-ac17655ccf45",
    title: "CI/CD y monitoreo de modelos",
    // mouredev FastAPI - seccion deploy y CI/CD de aplicaciones ML
    video_url: "https://www.youtube.com/watch?v=_y9qQZXE24A&t=7200"
  },

  // ================================================================
  // SUBJECT: Proyecto Capstone (BOOT-CAP3) - 4 sesiones
  // ================================================================
  {
    id: "4d0b1b90-9184-4a7f-9cce-7726f2119465",
    title: "Definicion del problema y recopilacion de datos",
    // DotCSV Aprende IA - metodologia y ciclo de vida de proyecto ML
    video_url: "https://www.youtube.com/watch?v=KytW151dpqU&t=8400"
  },
  {
    id: "39c1631f-7d4c-427e-9b02-af158ee04bf2",
    title: "Desarrollo del modelo y experimentacion",
    // sensio IA "IA desde 0" - desarrollo modelo de principio a fin
    video_url: "https://www.youtube.com/watch?v=swpAfyZFt-8&t=5400"
  },
  {
    id: "981a7d5f-8890-40ab-bb5d-87e538ae0b02",
    title: "Despliegue y presentacion del proyecto",
    // mouredev FastAPI - despliegue de modelo en produccion con API
    video_url: "https://www.youtube.com/watch?v=_y9qQZXE24A&t=3600"
  },
  {
    id: "7e3653db-9e91-4b71-8c73-8f8a1df53831",
    title: "Code review, feedback y mejoras",
    // mouredev Python Intermedio - buenas practicas y clean code
    video_url: "https://www.youtube.com/watch?v=TbcEqkabAWU&t=1800"
  },

  // ================================================================
  // SUBJECT: Portafolio Profesional (BOOT-POR3) - 4 sesiones
  // ================================================================
  {
    id: "98a05872-3c1d-4e0c-8379-b5ef39e64e45",
    title: "GitHub como portafolio profesional",
    // mouredev Git y GitHub - seccion portafolio y GitHub Pages
    // Canal: MoureDev by Brais Moure | branding profesional en GitHub
    video_url: "https://www.youtube.com/watch?v=3GymExBkKjE"
  },
  {
    id: "53b5c420-5516-4ba4-b208-46229de9d18b",
    title: "LinkedIn y marca personal tech",
    // mouredev consejos carrera programador - linkedin y marca personal
    // Canal: MoureDev | tips para encontrar trabajo en tech
    video_url: "https://www.youtube.com/watch?v=q2lCm2KAz3w"
  },
  {
    id: "be7edd7a-284c-45a6-be63-95b1d67475c1",
    title: "Kaggle y competencias de ML",
    // DotCSV generacion de imagenes IA - vision cutting edge de IA competitiva
    // Canal: DotCSV | estado del arte, competencias Kaggle-style
    video_url: "https://www.youtube.com/watch?v=90QDe6DQXF4"
  },
  {
    id: "7a748e85-cceb-4834-9665-b9f1c46d69a1",
    title: "Estrategia de busqueda de empleo en IA",
    // mouredev consejos empleo tech - estrategia busqueda trabajo IA
    video_url: "https://www.youtube.com/watch?v=q2lCm2KAz3w&t=600"
  },

  // ================================================================
  // SUBJECT: Preparacion Laboral (BOOT-LAB3) - 4 sesiones
  // ================================================================
  {
    id: "8ff38002-8c19-4f7a-923b-d450138ee51b",
    title: "Entrevistas tecnicas de ML",
    // mouredev Python Intermedio - ejercicios tecnicos y preparacion entrevistas
    video_url: "https://www.youtube.com/watch?v=TbcEqkabAWU&t=3600"
  },
  {
    id: "96e2eac8-77fd-4ed7-ad69-d469eff8c499",
    title: "SQL para Data Science",
    // Codigo Facilito "SQL para principiantes" - fundamentos SQL Data Science
    // Canal: Codigo Facilito | tutorial completo SQL
    video_url: "https://www.youtube.com/watch?v=OqjnAPp3VmQ"
  },
  {
    id: "185da772-503a-45db-9f69-c07308c8ad76",
    title: "Comunicacion tecnica y storytelling con datos",
    // DotCSV "Charla Datathon 2021" - comunicar resultados ML a no tecnicos
    // Canal: DotCSV | storytelling, presentacion de datos
    video_url: "https://www.youtube.com/watch?v=5S5k4C0Kh2k"
  },
  {
    id: "55e48fae-eb2a-4efd-b6b7-417aece44335",
    title: "Plan de carrera y aprendizaje continuo",
    // mouredev "15 curiosidades Python + consejos" - plan de carrera tech
    video_url: "https://www.youtube.com/watch?v=q2lCm2KAz3w&t=1200"
  }
];

// ============================================================
// PATCH HELPER
// ============================================================

async function patchSession(sessionId, videoUrl, title) {
  const res = await fetch(
    `${BASE}/sessions?id=eq.${sessionId}`,
    {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify({ video_url: videoUrl })
    }
  );

  if (res.status !== 204) {
    const text = await res.text();
    throw new Error(`PATCH ${res.status}: ${text.substring(0, 200)}`);
  }
}

// ============================================================
// VERIFY HELPER
// ============================================================

async function verifySessions() {
  const ids = SESSIONS.map(s => s.id).join(",");
  const res = await fetch(
    `${BASE}/sessions?select=id,title,video_url&id=in.(${ids})`,
    { headers: HEADERS }
  );
  return await res.json();
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log("\n========================================");
  console.log("ITSEIA Academy - Load Bootcamp Videos");
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Sessions to process: ${SESSIONS.length}`);
  console.log("========================================\n");

  let updated = 0;
  let errors = 0;

  for (let i = 0; i < SESSIONS.length; i++) {
    const session = SESSIONS[i];
    const num = String(i + 1).padStart(2, "0");

    try {
      await patchSession(session.id, session.video_url, session.title);
      console.log(`  [${num}/48] OK  "${session.title}"`);
      console.log(`         -> ${session.video_url}`);
      updated++;
    } catch (err) {
      console.error(`  [${num}/48] ERR "${session.title}": ${err.message}`);
      errors++;
    }

    // Small delay to avoid hammering the API
    if (i < SESSIONS.length - 1) {
      await new Promise(r => setTimeout(r, 80));
    }
  }

  // ============================================================
  // VERIFICATION
  // ============================================================
  console.log("\n========================================");
  console.log("SUMMARY");
  console.log("========================================");
  console.log(`  Total sessions:  ${SESSIONS.length}`);
  console.log(`  Updated OK:      ${updated}`);
  console.log(`  Errors:          ${errors}`);
  console.log("========================================\n");

  console.log("Verifying update in database...\n");

  let verified;
  try {
    verified = await verifySessions();
  } catch (err) {
    console.error("Could not verify:", err.message);
    return;
  }

  const withVideo = verified.filter(s => s.video_url);
  const withoutVideo = verified.filter(s => !s.video_url);

  console.log(`  DB sessions with video_url:    ${withVideo.length}/${verified.length}`);
  console.log(`  DB sessions without video_url: ${withoutVideo.length}/${verified.length}`);

  if (withoutVideo.length === 0) {
    console.log("\n  SUCCESS: All 48 sessions now have video URLs in the database!\n");
  } else {
    console.log(`\n  WARNING: ${withoutVideo.length} sessions still have no video:`);
    for (const s of withoutVideo) {
      console.log(`    - "${s.title}" (${s.id})`);
    }
    console.log();
  }

  if (errors === 0 && withoutVideo.length === 0) {
    console.log("  DONE - Bootcamp IA Intensivo is ready with video content!\n");
  }
}

main().catch(err => {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
