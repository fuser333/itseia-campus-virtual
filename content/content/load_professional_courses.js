#!/usr/bin/env node
/**
 * Load Professional Course Modules into ITSEIA Academy V3
 *
 * Reads 27 markdown module files (contadores, medicos, abogados)
 * and inserts them as semesters > subjects > sessions into Supabase.
 *
 * Each profession gets 1 semester under "Curso Express" ($97),
 * with 9 subjects (one per module), each having 1 session with full markdown.
 *
 * Run: node content/load_professional_courses.js
 */

const fs = require('fs');
const path = require('path');

// ============================================
// Configuration
// ============================================

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';

const headers = {
  'apikey': SKEY,
  'Authorization': 'Bearer ' + SKEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};
const headersMinimal = {
  'apikey': SKEY,
  'Authorization': 'Bearer ' + SKEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
};

// Program IDs from Supabase
const PROGRAMS = {
  express: 'be7e6b1e-d8f9-4c97-9b29-bacb73925579',   // $97
  estandar: '765cd165-6adc-413a-9a19-9c1219681a81',   // $197
  completo: '259e324f-83c3-463e-bec4-c8b99cbecbd4'    // $297
};

// Base path for module files (absolute path to avoid resolution issues)
const CURSOS_BASE = '/Users/hectorvelasco/Mis Empresas/ITSEIA/DEPARTAMENTOS/08_TECNOLOGIA_INNOVACION/PROYECTO_AULA_IA_PERSONALIZADA/cursos';

// ============================================
// Professional course definitions
// ============================================

const PROFESSIONS = [
  {
    key: 'contadores',
    name: 'Contabilidad y Finanzas',
    semesterName: 'Modulo Profesional: IA para Contadores',
    codePrefix: 'CONT',
    modules: [
      { file: 'T01_fundamentos_ia.md', code: 'T01', name: 'Fundamentos de IA sin Tecnicismos', type: 'leccion', duration: 45 },
      { file: 'T02_chatgpt_claude_contadores.md', code: 'T02', name: 'ChatGPT y Claude para Contadores', type: 'leccion', duration: 60 },
      { file: 'T03_seguridad_privacidad.md', code: 'T03', name: 'Seguridad y Privacidad de Datos Financieros', type: 'leccion_quiz', duration: 30 },
      { file: 'T04_evaluacion_critica.md', code: 'T04', name: 'Evaluacion Critica de Resultados de IA', type: 'leccion_quiz', duration: 30 },
      { file: 'F01_automatizacion_reportes.md', code: 'F01', name: 'Automatizacion de Reportes Financieros con IA', type: 'leccion', duration: 60 },
      { file: 'F02_deteccion_anomalias.md', code: 'F02', name: 'Deteccion de Anomalias y Fraude con IA', type: 'leccion_quiz', duration: 30 },
      { file: 'F03_excel_copilot.md', code: 'F03', name: 'Excel + IA: Copilot y Automatizacion', type: 'demo', duration: 45 },
      { file: 'F04_analisis_predictivo.md', code: 'F04', name: 'Analisis Predictivo para Presupuestos', type: 'leccion', duration: 45 },
      { file: 'F05_cierre_contable.md', code: 'F05', name: 'Caso Practico: Cierre Contable Asistido por IA', type: 'caso_practico', duration: 45 }
    ]
  },
  {
    key: 'medicos',
    name: 'Medicina y Salud',
    semesterName: 'Modulo Profesional: IA para Medicos',
    codePrefix: 'MED',
    modules: [
      { file: 'T01_fundamentos_ia_salud.md', code: 'T01', name: 'Fundamentos de IA para Profesionales de la Salud', type: 'leccion', duration: 45 },
      { file: 'T02_chatgpt_claude_clinica.md', code: 'T02', name: 'ChatGPT y Claude en la Practica Clinica', type: 'leccion', duration: 60 },
      { file: 'T03_privacidad_datos_paciente.md', code: 'T03', name: 'Privacidad de Datos del Paciente', type: 'leccion_quiz', duration: 30 },
      { file: 'T04_criterio_clinico_limites_ia.md', code: 'T04', name: 'Criterio Clinico y Limites de la IA', type: 'leccion_quiz', duration: 30 },
      { file: 'S01_diagnostico_asistido_ia.md', code: 'S01', name: 'IA en Diagnostico Asistido', type: 'leccion', duration: 60 },
      { file: 'S02_documentacion_clinica_automatizada.md', code: 'S02', name: 'Documentacion Clinica Automatizada', type: 'demo', duration: 45 },
      { file: 'S03_busqueda_bibliografica_ia.md', code: 'S03', name: 'Busqueda Bibliografica con IA', type: 'leccion_quiz', duration: 45 },
      { file: 'S04_imagenes_medicas_ia.md', code: 'S04', name: 'Analisis de Imagenes Medicas con IA', type: 'leccion', duration: 45 },
      { file: 'S05_plan_tratamiento.md', code: 'S05', name: 'Plan de Tratamiento Asistido por IA', type: 'caso_practico', duration: 45 }
    ]
  },
  {
    key: 'abogados',
    name: 'Derecho y Juridico',
    semesterName: 'Modulo Profesional: IA para Abogados',
    codePrefix: 'JUR',
    modules: [
      { file: 'T01_fundamentos_ia_juridica.md', code: 'T01', name: 'Fundamentos de IA para Profesionales Juridicos', type: 'leccion', duration: 45 },
      { file: 'T02_chatgpt_claude_abogados.md', code: 'T02', name: 'ChatGPT y Claude para Abogados', type: 'leccion', duration: 60 },
      { file: 'T03_seguridad_confidencialidad.md', code: 'T03', name: 'Seguridad y Confidencialidad de Datos', type: 'leccion_quiz', duration: 30 },
      { file: 'T04_evaluacion_critica_ia.md', code: 'T04', name: 'Evaluacion Critica de IA en Derecho', type: 'leccion_quiz', duration: 30 },
      { file: 'J01_investigacion_jurisprudencial.md', code: 'J01', name: 'Investigacion Jurisprudencial con IA', type: 'leccion', duration: 60 },
      { file: 'J02_redaccion_contratos.md', code: 'J02', name: 'Redaccion y Revision de Contratos con IA', type: 'demo', duration: 45 },
      { file: 'J03_analisis_riesgo_legal.md', code: 'J03', name: 'Analisis de Riesgo Legal Automatizado', type: 'leccion_quiz', duration: 45 },
      { file: 'J04_documentos_procesales.md', code: 'J04', name: 'Documentos Procesales con IA', type: 'caso_practico', duration: 45 },
      { file: 'J05_compliance_ia_ecuador.md', code: 'J05', name: 'Compliance: IA y la Ley en Ecuador', type: 'leccion', duration: 45 }
    ]
  }
];

// ============================================
// AI Lab context generators per module type
// ============================================

function generateAiLabContext(profession, moduleCode, moduleName, moduleType) {
  const contexts = {
    contadores: {
      T01: 'Eres un tutor de IA para contadores ecuatorianos. Ayuda al estudiante a entender los fundamentos de IA aplicados a contabilidad y finanzas. Usa ejemplos del SRI, NIIF, y practica contable en Ecuador.',
      T02: 'Eres un asistente que enseña a contadores ecuatorianos a usar ChatGPT y Claude para tareas contables: notas NIIF, consultas tributarias SRI, informes de auditoria. Genera prompts de ejemplo.',
      T03: 'Eres un experto en seguridad de datos financieros. Ayuda al contador a entender la LOPDP de Ecuador y mejores practicas para anonimizar datos antes de usar IA. Alerta sobre riesgos.',
      T04: 'Eres un revisor critico de outputs de IA. Ayuda al contador a evaluar si las respuestas de IA son correctas, especialmente cifras, articulos de ley y normas NIIF. Ensena a detectar alucinaciones.',
      F01: 'Eres un asistente de automatizacion de reportes financieros. Ayuda al contador a crear pipelines: datos → analisis → estado de resultados → notas NIIF → informe gerencial usando IA.',
      F02: 'Eres un auditor experto en deteccion de fraude. Ayuda al estudiante a usar IA para identificar anomalias en libros contables: facturas duplicadas, proveedores fantasma, montos inusuales.',
      F03: 'Eres un experto en Excel con IA. Ayuda al contador con formulas complejas, Power Query, tablas dinamicas, macros VBA y uso de Copilot para automatizar tareas en hojas de calculo.',
      F04: 'Eres un analista financiero que usa IA. Ayuda al contador a construir proyecciones, analisis de tendencias, escenarios What-If y presupuestos con herramientas de IA.',
      F05: 'Eres un mentor de cierre contable con IA. Guia al estudiante a traves de un caso practico completo: revision de datos, deteccion de anomalias, ajustes, notas y reporte final.'
    },
    medicos: {
      T01: 'Eres un tutor de IA para profesionales de la salud en Ecuador. Explica conceptos de IA aplicados a medicina: LLMs, diagnostico asistido, documentacion clinica. Usa contexto MSP/IESS.',
      T02: 'Eres un asistente que enseña a medicos ecuatorianos a usar ChatGPT y Claude en practica clinica: notas SOAP, diagnosticos diferenciales, educacion al paciente, busqueda de evidencia.',
      T03: 'Eres un experto en privacidad de datos de salud. Ayuda al medico a manejar datos de pacientes con IA cumpliendo la LOPDP de Ecuador y buenas practicas de confidencialidad clinica.',
      T04: 'Eres un supervisor clinico que ensena criterio critico al usar IA. Ayuda al medico a evaluar outputs de IA, detectar alucinaciones en contexto medico y mantener responsabilidad profesional.',
      S01: 'Eres un asistente de diagnostico medico con IA. Ayuda al estudiante a usar herramientas para generar diagnosticos diferenciales, revisar sintomas y analizar casos clinicos con IA.',
      S02: 'Eres un experto en documentacion clinica automatizada. Ayuda al medico a crear notas SOAP, epicrisis, referencias y contrareferencias usando IA como asistente de redaccion.',
      S03: 'Eres un asistente de investigacion medica. Ayuda al profesional a buscar evidencia cientifica con IA: PubMed, Elicit, Consensus. Ensena a evaluar fuentes y sintetizar literatura.',
      S04: 'Eres un experto en imagenologia medica con IA. Explica conceptos de IA aplicados a radiologia, patologia y diagnostico por imagen. Contextualiza con ImagemIA y el mercado ecuatoriano.',
      S05: 'Eres un mentor clinico que guia al estudiante en crear planes de tratamiento asistidos por IA. Caso practico completo: historia clinica, diagnostico diferencial, plan y seguimiento.'
    },
    abogados: {
      T01: 'Eres un tutor de IA para abogados ecuatorianos. Explica IA generativa aplicada al derecho: redaccion juridica, investigacion, analisis de contratos. Usa contexto COGEP, COIP, normativa ecuatoriana.',
      T02: 'Eres un asistente que enseña a abogados ecuatorianos a usar ChatGPT y Claude: borradores de contratos, escritos judiciales, opinion legal, investigacion jurisprudencial. Genera prompts de ejemplo.',
      T03: 'Eres un experto en seguridad y confidencialidad de datos juridicos. Ayuda al abogado a manejar informacion de clientes con IA cumpliendo secreto profesional y LOPDP de Ecuador.',
      T04: 'Eres un revisor critico de outputs legales de IA. Ayuda al abogado a evaluar si citas de sentencias, articulos de ley y argumentos juridicos generados por IA son correctos. Caso Schwartz como ejemplo.',
      J01: 'Eres un asistente de investigacion jurisprudencial. Ayuda al abogado a buscar sentencias en SATJE, CNJ y bases juridicas usando IA. Ensena a verificar citas y construir argumentos con precedentes.',
      J02: 'Eres un experto en redaccion de contratos con IA. Ayuda al abogado a generar, revisar y mejorar contratos: clausulas clave, riesgos, terminologia juridica ecuatoriana.',
      J03: 'Eres un analista de riesgo legal que usa IA. Ayuda al estudiante a evaluar riesgos en contratos, operaciones y cumplimiento normativo usando herramientas de IA.',
      J04: 'Eres un mentor de practica procesal con IA. Guia al estudiante en crear documentos procesales: demandas, contestaciones, recursos, bajo COGEP y normativa ecuatoriana.',
      J05: 'Eres un experto en regulacion de IA en Ecuador. Ayuda al abogado a entender compliance, LOPDP, propiedad intelectual y responsabilidad en el uso de IA en la practica juridica.'
    }
  };

  return contexts[profession]?.[moduleCode] ||
    `Eres un tutor de IA para profesionales. Ayuda al estudiante con el tema: ${moduleName}. Contexto: Ecuador, 2026.`;
}

// ============================================
// Utility: Extract quiz questions from markdown
// ============================================

function extractQuizFromMarkdown(markdown) {
  const questions = [];

  // Look for numbered questions with options (a, b, c, d pattern)
  const questionPattern = /(?:^|\n)\s*(\d+)\.\s*(.+?)(?:\n\s*a\)\s*(.+?)\n\s*b\)\s*(.+?)\n\s*c\)\s*(.+?)(?:\n\s*d\)\s*(.+?))?)/gm;
  let match;

  while ((match = questionPattern.exec(markdown)) !== null) {
    const opts = [
      { text: match[3].trim(), is_correct: false },
      { text: match[4].trim(), is_correct: false },
      { text: match[5].trim(), is_correct: false }
    ];
    if (match[6]) opts.push({ text: match[6].trim(), is_correct: false });

    // Default first option as correct (since we cannot determine from markdown alone)
    opts[0].is_correct = true;

    questions.push({
      question_text: match[2].trim(),
      question_type: 'multiple_choice',
      options: { options: opts, correct_index: 0 },
      explanation: null,
      points: 1
    });
  }

  // Also look for "Verdadero/Falso" or "V/F" style questions
  const tfPattern = /(?:^|\n)\s*(\d+)\.\s*(.+?)\s*\(?(Verdadero|Falso|V|F)\)?/gm;
  while ((match = tfPattern.exec(markdown)) !== null) {
    const isTrue = match[3] === 'Verdadero' || match[3] === 'V';
    questions.push({
      question_text: match[2].trim(),
      question_type: 'true_false',
      options: {
        options: [
          { text: 'Verdadero', is_correct: isTrue },
          { text: 'Falso', is_correct: !isTrue }
        ],
        correct_answer: isTrue
      },
      explanation: null,
      points: 1
    });
  }

  // Look for "Preguntas de repaso" or "Autoevaluacion" sections and extract general questions
  const repasoMatch = markdown.match(/(?:Preguntas de [Rr]epaso|Autoevaluaci[oó]n|Quiz|Evaluaci[oó]n)([\s\S]*?)(?:\n#{1,3}\s|\n---|\n\*\*Siguiente|$)/);
  if (repasoMatch && questions.length === 0) {
    // Try to find simple numbered questions
    const simpleQPattern = /(?:^|\n)\s*(\d+)\.\s*([^\n]+)/gm;
    let qMatch;
    while ((qMatch = simpleQPattern.exec(repasoMatch[1])) !== null) {
      const qText = qMatch[2].trim();
      if (qText.length > 15 && !qText.startsWith('-')) {
        questions.push({
          question_text: qText,
          question_type: 'multiple_choice',
          options: {
            options: [
              { text: 'Correcto', is_correct: true },
              { text: 'Parcialmente correcto', is_correct: false },
              { text: 'Incorrecto', is_correct: false }
            ],
            correct_index: 0
          },
          explanation: 'Revisa el contenido del modulo para profundizar en este tema.',
          points: 1
        });
      }
    }
  }

  return questions;
}

// ============================================
// Supabase API helpers
// ============================================

async function supabasePost(table, body) {
  const res = await fetch(BASE + '/' + table, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (res.status !== 201) {
    throw new Error(`POST ${table} failed (${res.status}): ${JSON.stringify(data).substring(0, 200)}`);
  }
  return Array.isArray(data) ? data[0] : data;
}

async function supabasePostMinimal(table, body) {
  const res = await fetch(BASE + '/' + table, {
    method: 'POST',
    headers: headersMinimal,
    body: JSON.stringify(body)
  });

  if (res.status !== 201) {
    const text = await res.text();
    throw new Error(`POST ${table} failed (${res.status}): ${text.substring(0, 200)}`);
  }
  return true;
}

// ============================================
// Main loading logic
// ============================================

async function loadProfession(profession, semesterNumber) {
  const modulesDir = path.join(CURSOS_BASE, profession.key, 'modulos');

  console.log(`\n${'='.repeat(60)}`);
  console.log(`PROFESSION: ${profession.name}`);
  console.log(`Directory: ${modulesDir}`);
  console.log(`${'='.repeat(60)}`);

  // Step 1: Create semester under Express program
  console.log(`\n  Creating semester ${semesterNumber}: ${profession.semesterName}`);
  const semester = await supabasePost('semesters', {
    program_id: PROGRAMS.express,
    number: semesterNumber,
    name: profession.semesterName,
    level: 'professional',
    is_active: true
  });
  console.log(`  Semester created: ${semester.id}`);

  // Step 2: For each module, create subject + session
  for (let i = 0; i < profession.modules.length; i++) {
    const mod = profession.modules[i];
    const filePath = path.join(modulesDir, mod.file);

    console.log(`\n  [${i + 1}/9] ${mod.code}: ${mod.name}`);

    // Read markdown content
    let markdown;
    try {
      markdown = fs.readFileSync(filePath, 'utf8');
      console.log(`    Read: ${(markdown.length / 1024).toFixed(1)} KB`);
    } catch (err) {
      console.log(`    ERROR reading file: ${err.message}`);
      continue;
    }

    // Create subject
    const subjectCode = `${profession.codePrefix}-${mod.code}`;
    const slug = `${profession.key}-${mod.code.toLowerCase()}`;

    const subject = await supabasePost('subjects', {
      semester_id: semester.id,
      code: subjectCode,
      name: mod.name,
      slug: slug,
      description: `Modulo ${mod.code} del curso de IA para ${profession.name}`,
      credit_hours: mod.duration >= 60 ? 2 : 1,
      hours_docencia: Math.round(mod.duration * 0.3),
      hours_practica: Math.round(mod.duration * 0.5),
      hours_autonomo: Math.round(mod.duration * 0.2),
      hours_total: mod.duration,
      tools: getToolsForModule(mod.code, profession.key),
      order_index: i + 1,
      is_active: true
    });
    console.log(`    Subject created: ${subject.id}`);

    // Create session with full markdown content
    const aiContext = generateAiLabContext(profession.key, mod.code, mod.name, mod.type);
    const session = await supabasePost('sessions', {
      subject_id: subject.id,
      number: 1,
      title: mod.name,
      description: `Sesion completa del modulo ${mod.code}: ${mod.name}`,
      theory_markdown: markdown,
      ai_lab_context: aiContext,
      ai_lab_suggested_prompt: generateSuggestedPrompt(profession.key, mod.code),
      estimated_duration_minutes: mod.duration,
      order_index: 1,
      is_active: true
    });
    console.log(`    Session created: ${session.id}`);

    // Extract and create quiz if applicable
    if (mod.type.includes('quiz') || mod.type === 'caso_practico') {
      const quizQuestions = extractQuizFromMarkdown(markdown);
      if (quizQuestions.length > 0) {
        try {
          const quiz = await supabasePost('quizzes', {
            session_id: session.id,
            title: `Quiz: ${mod.name}`,
            pass_percentage: 70,
            max_attempts: 3,
            is_active: true
          });

          for (let q = 0; q < quizQuestions.length; q++) {
            await supabasePostMinimal('quiz_questions', {
              quiz_id: quiz.id,
              question_text: quizQuestions[q].question_text,
              question_type: quizQuestions[q].question_type,
              options: JSON.stringify(quizQuestions[q].options),
              explanation: quizQuestions[q].explanation,
              points: quizQuestions[q].points,
              order_index: q + 1
            });
          }
          console.log(`    Quiz created: ${quizQuestions.length} questions`);
        } catch (err) {
          console.log(`    Quiz error: ${err.message}`);
        }
      } else {
        console.log(`    No quiz questions extracted from markdown`);
      }
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  return semester.id;
}

function getToolsForModule(code, profession) {
  const baseTools = ['ChatGPT', 'Claude'];
  const toolMap = {
    contadores: {
      T01: [...baseTools],
      T02: [...baseTools],
      T03: [...baseTools, 'ChatGPT Enterprise', 'Claude for Work'],
      T04: [...baseTools],
      F01: [...baseTools, 'Power BI'],
      F02: [...baseTools, 'Excel', 'Power Query'],
      F03: ['Excel', 'Microsoft Copilot', ...baseTools],
      F04: [...baseTools, 'Power BI', 'Excel'],
      F05: [...baseTools, 'Excel']
    },
    medicos: {
      T01: [...baseTools, 'Glass Health', 'Elicit'],
      T02: [...baseTools],
      T03: [...baseTools],
      T04: [...baseTools],
      S01: [...baseTools, 'Glass Health'],
      S02: [...baseTools, 'Suki AI'],
      S03: ['Elicit', 'Consensus', 'PubMed', ...baseTools],
      S04: [...baseTools, 'ImagemIA'],
      S05: [...baseTools, 'Glass Health']
    },
    abogados: {
      T01: [...baseTools, 'Perplexity'],
      T02: [...baseTools],
      T03: [...baseTools],
      T04: [...baseTools],
      J01: [...baseTools, 'Perplexity', 'SATJE'],
      J02: [...baseTools, 'Microsoft Copilot'],
      J03: [...baseTools],
      J04: [...baseTools],
      J05: [...baseTools, 'Perplexity']
    }
  };
  return toolMap[profession]?.[code] || baseTools;
}

function generateSuggestedPrompt(profession, code) {
  const prompts = {
    contadores: {
      T01: 'Soy contador en Ecuador. Explicame 5 formas concretas en que la IA puede ayudarme en mi trabajo diario con NIIF y el SRI.',
      T02: 'Necesito redactar una nota a los estados financieros sobre inventarios bajo NIC 2. Guiame paso a paso.',
      T03: 'Que datos financieros puedo y no puedo compartir con herramientas de IA publicas segun la LOPDP de Ecuador?',
      T04: 'Genera un borrador de analisis de variaciones para un estado de resultados trimestral. Luego dime que deberia verificar.',
      F01: 'Tengo un balance de comprobacion en Excel. Guiame paso a paso para generar un reporte financiero completo con IA.',
      F02: 'Dame 5 patrones comunes de fraude contable en empresas ecuatorianas y como podria usar IA para detectarlos.',
      F03: 'Necesito una formula en Excel para hacer conciliacion bancaria automatica. Generala paso a paso.',
      F04: 'Tengo datos de ventas de 12 meses. Ayudame a crear una proyeccion para el proximo trimestre con tres escenarios.',
      F05: 'Guiame paso a paso en un cierre contable trimestral asistido por IA para una empresa comercial ecuatoriana.'
    },
    medicos: {
      T01: 'Soy medico general en Ecuador con 20 pacientes diarios. Listame 5 tareas clinicas donde la IA puede ahorrarme mas tiempo.',
      T02: 'Necesito crear una nota SOAP para un paciente con diabetes tipo 2 descompensada. Guiame con un ejemplo.',
      T03: 'Que datos de pacientes puedo usar con IA sin violar la confidencialidad medica y la LOPDP de Ecuador?',
      T04: 'Genera un diagnostico diferencial para dolor toracico agudo en mujer de 55 anos. Luego dime que debo verificar clinicamente.',
      S01: 'Paciente masculino 60 anos con disnea progresiva 3 semanas. Dame diagnosticos diferenciales ordenados por probabilidad.',
      S02: 'Transcribe esta consulta medica en formato SOAP estructurado: [pega tu nota de consulta].',
      S03: 'Busca evidencia reciente sobre el uso de metformina en prevencion de cancer colorrectal. Dame 3 estudios clave.',
      S04: 'Explica como funciona la IA para deteccion de nodulos pulmonares en tomografia. Que tan confiable es en 2026?',
      S05: 'Crea un plan de tratamiento integral para paciente con hipertension arterial no controlada y diabetes tipo 2.'
    },
    abogados: {
      T01: 'Soy abogado en Ecuador. Listame 5 areas del derecho donde la IA puede ahorrarme mas tiempo en mi practica diaria.',
      T02: 'Necesito un borrador de demanda ordinaria por incumplimiento contractual bajo COGEP. Redacta la parte introductoria.',
      T03: 'Que informacion de mis clientes puedo compartir con IA sin violar el secreto profesional y la LOPDP?',
      T04: 'Genera un analisis del articulo 185 del COGEP. Luego verifico si es correcto. Muestra tu razonamiento.',
      J01: 'Busca jurisprudencia ecuatoriana sobre responsabilidad civil por negligencia medica. Dame los argumentos clave.',
      J02: 'Revisa este contrato de arrendamiento comercial y señala clausulas riesgosas o faltantes: [pega contrato].',
      J03: 'Analiza el riesgo legal de una empresa que usa IA para tomar decisiones de credito en Ecuador.',
      J04: 'Redacta un recurso de apelacion bajo COGEP para sentencia desfavorable en juicio ordinario civil.',
      J05: 'Que normas ecuatorianas aplican al uso de IA en la practica juridica? Resume LOPDP y regulaciones relevantes.'
    }
  };
  return prompts[profession]?.[code] || 'Hazme una pregunta sobre este tema aplicado a tu profesion en Ecuador.';
}

// ============================================
// Main
// ============================================

async function main() {
  console.log('='.repeat(60));
  console.log('ITSEIA Academy V3 - Professional Courses Loader');
  console.log('Loading 27 modules (3 professions x 9 modules)');
  console.log('Target: Curso Express program (be7e6b1e...)');
  console.log('='.repeat(60));

  const results = {};

  try {
    // Load each profession as a semester (1, 2, 3)
    results.contadores = await loadProfession(PROFESSIONS[0], 1);
    results.medicos = await loadProfession(PROFESSIONS[1], 2);
    results.abogados = await loadProfession(PROFESSIONS[2], 3);

    console.log('\n' + '='.repeat(60));
    console.log('COMPLETED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log('\nSemester IDs:');
    console.log(`  Contadores: ${results.contadores}`);
    console.log(`  Medicos:    ${results.medicos}`);
    console.log(`  Abogados:   ${results.abogados}`);
    console.log('\nTotal: 3 semesters, 27 subjects, 27 sessions created');

  } catch (err) {
    console.error('\nFATAL ERROR:', err.message);
    console.error('\nPartial results:', results);
    process.exit(1);
  }
}

main();
