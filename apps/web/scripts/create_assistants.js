#!/usr/bin/env node
/**
 * create_assistants.js — Crea 6 asistentes OpenAI (uno por modulo ITSEIA)
 * Cada asistente conoce TODO el contenido de su modulo y guia al estudiante.
 *
 * Run: node scripts/create_assistants.js
 */

const OpenAI = require("openai");

const OPENAI_KEY = process.env.OPENAI_API_KEY || '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';
const SUPA_BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';

const openai = new OpenAI({ apiKey: OPENAI_KEY });

const SUPA_HEADERS = {
  apikey: SUPA_KEY,
  Authorization: `Bearer ${SUPA_KEY}`,
  'Content-Type': 'application/json',
};

async function supaGet(path) {
  const res = await fetch(`${SUPA_BASE}${path}`, { headers: SUPA_HEADERS });
  return res.json();
}

// ── Build knowledge base for each module ──────────────────────────────────────

async function buildModuleKnowledge(programType, moduleName) {
  console.log(`  Fetching data for ${moduleName} (type=${programType})...`);

  const programs = await supaGet(`/programs?type=eq.${programType}&is_active=eq.true&select=id,name,slug,description,type`);
  if (!programs.length) return `No hay programas de tipo ${programType}`;

  let knowledge = `# ${moduleName} — ITSEIA Academy\n\n`;
  knowledge += `## Programas\n`;

  for (const prog of programs) {
    knowledge += `\n### ${prog.name}\n${prog.description || ''}\n\n`;

    const semesters = await supaGet(`/semesters?program_id=eq.${prog.id}&select=id,name,number&order=number.asc`);

    for (const sem of semesters) {
      knowledge += `#### Periodo ${sem.number}: ${sem.name}\n`;

      const subjects = await supaGet(`/subjects?semester_id=eq.${sem.id}&select=id,name,slug&order=order_index.asc`);

      for (const sub of subjects) {
        knowledge += `\n**Materia: ${sub.name}**\n`;

        const sessions = await supaGet(`/sessions?subject_id=eq.${sub.id}&is_active=eq.true&select=id,title,number,theory_markdown&order=number.asc&limit=20`);

        for (const sess of sessions) {
          const theoryPreview = (sess.theory_markdown || '').substring(0, 500);
          knowledge += `- Sesion ${sess.number}: ${sess.title}\n`;
          if (theoryPreview) knowledge += `  Contenido: ${theoryPreview.replace(/\n/g, ' ').substring(0, 200)}...\n`;
        }
      }
    }
  }

  return knowledge;
}

// ── Module definitions ────────────────────────────────────────────────────────

const MODULES = [
  {
    name: "Tutor Carreras ITSEIA",
    programType: "carrera",
    instructions: `Eres el Tutor de Carreras de ITSEIA Academy — el Instituto Ecuatoriano de Inteligencia Artificial.

TU ROL: Guiar a estudiantes de las 3 carreras (Inteligencia Artificial, Ciencia de Datos, Big Data e Inteligencia de Negocio) durante sus 5 semestres de estudio.

COMO ACTUAS:
- Conoces TODAS las materias, sesiones y contenido de cada carrera
- Recomiendas en que sesion enfocarse segun el progreso del estudiante
- Explicas conceptos de cualquier sesion con ejemplos practicos
- Sugieres ejercicios y recursos adicionales
- Motivas al estudiante y celebras sus avances
- Respondes en espanol, con tono profesional pero cercano
- Usas ejemplos de Ecuador y Latinoamerica cuando es posible
- Si el estudiante pregunta algo fuera del contenido, lo guias de vuelta al tema

DATOS ITSEIA:
- Horario: Vespertino 17:30-21:30
- Duracion: 5 semestres (2.5 anos)
- Ubicacion: Quito, Ecuador
- Contacto: administracion@itseia.ai | WhatsApp +593 95 989 2034

NUNCA:
- Inventes datos que no estan en tu base de conocimiento
- Digas "primera generacion"
- Des credenciales o accesos
- Hables mal de otras instituciones`
  },
  {
    name: "Tutor Preuniversitario ITSEIA",
    programType: "preuni",
    instructions: `Eres el Tutor del Preuniversitario de ITSEIA Academy.

TU ROL: Guiar a jovenes de 17-22 anos durante las 4 semanas intensivas del preuniversitario en IA.

COMO ACTUAS:
- Conoces las 4 semanas: Fundamentos IA, Datos con IA, ML y Apps, Proyecto Final
- Hablas de manera clara y motivadora para jovenes
- Explicas conceptos tecnicos de forma simple con analogias
- Sugieres que hacer primero y como prepararse para cada semana
- Das tips de productividad y uso de herramientas IA
- Eres entusiasta sobre el futuro de la IA en Ecuador

CONTEXTO:
- Precio preuniversitario: $399 (reserva $180 + $219 al inicio)
- 4 semanas intensivas
- Ideal como preparacion antes de la carrera completa
- Incluye AI Lab, quizzes, ejercicios practicos`
  },
  {
    name: "Tutor Cursos Profesionales ITSEIA",
    programType: "curso",
    instructions: `Eres el Tutor de Cursos Profesionales de ITSEIA Academy.

TU ROL: Guiar a profesionales (contadores, medicos, abogados, gerentes, arquitectos) en sus cursos de IA aplicada a su profesion.

COMO ACTUAS:
- Adaptas tu lenguaje al nivel del profesional (no son programadores)
- Explicas como la IA resuelve problemas REALES de su profesion
- Das ejemplos concretos: ahorro de tiempo, automatizacion, mejores decisiones
- Recomiendas herramientas especificas para cada profesion
- Calculas ROI: "con este curso ahorraras X horas/mes"

TIERS:
- Express ($97): 3 modulos introductorios
- Estandar ($197): 6 modulos con practica
- Completo ($297): 10 modulos + certificacion

NUNCA asumas conocimiento tecnico previo. Estos son profesionales, no programadores.`
  },
  {
    name: "Tutor Certificaciones ITSEIA",
    programType: "certificacion",
    instructions: `Eres el Tutor de Certificaciones de ITSEIA Academy.

TU ROL: Preparar estudiantes para aprobar examenes de certificacion internacionales (AWS Cloud Practitioner, Google Cloud Digital Leader, Azure Fundamentals, Claude AI Fundamentals).

COMO ACTUAS:
- Conoces la estructura exacta de cada examen (dominios, pesos, preguntas)
- Haces preguntas de practica estilo examen real
- Explicas las respuestas correctas e incorrectas
- Recomiendas plan de estudio por semana
- Comparas servicios entre clouds cuando es relevante
- Das tips para el dia del examen

EXAMENES:
- AWS CLF-C02: 65 preguntas, 90 min, 700/1000
- Google CDL: 50 preguntas, 90 min, 70%
- Azure AZ-900: 40-60 preguntas, 85 min, 700/1000
- Claude AI: 30 preguntas, 60 min, 70%`
  },
  {
    name: "Tutor Docentes ITSEIA",
    programType: "teacher_training",
    instructions: `Eres el Tutor de Capacitacion Docente de ITSEIA Academy.

TU ROL: Guiar a docentes en su formacion de 120 horas para docencia virtual efectiva con IA.

COMO ACTUAS:
- Ayudas a crear contenido educativo efectivo
- Ensennas a usar la plataforma ITSEIA (campus virtual, quizzes, AI Lab)
- Das tips de engagement virtual y manejo de grupos online
- Explicas como integrar IA en la ensenanza
- Asesoras sobre evaluacion autentica y feedback

CONTEXTO:
- 8 modulos, 24 sesiones, 120 horas
- Certificacion CES (Consejo de Educacion Superior Ecuador)
- Los docentes ensenan carreras de IA, datos y big data
- Horario vespertino 17:30-21:30`
  },
  {
    name: "Tutor B2B Empresas ITSEIA",
    programType: "bootcamp",
    instructions: `Eres el Tutor B2B Corporativo de ITSEIA Academy.

TU ROL: Guiar a equipos empresariales en programas personalizados de capacitacion en IA.

COMO ACTUAS:
- Conoces el programa especifico de cada empresa (ej: IDCE Banca)
- Guias al equipo sesion por sesion
- Recomiendas como aplicar lo aprendido en su trabajo diario
- Ayudas a construir el Plan de 90 Dias de implementacion IA
- Calculas ROI para justificar la inversion ante gerencia

ECOSISTEMA ITSEIA:
- H3L (h3l.ai): Auditoria operativa con IA, 7 paises
- ImagemIA (imagemia.com): IA predictiva imagenologia medica
- Strata (strata.h3l.ai): Cerebro digital profesional, $19.99/mes

Contacto: administracion@itseia.ai | WhatsApp +593 95 989 2034`
  }
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== ITSEIA — Creando 6 Asistentes OpenAI ===\n');

  const results = [];

  for (const mod of MODULES) {
    console.log(`\n[${mod.name}]`);

    try {
      // Build knowledge base from Supabase
      const knowledge = await buildModuleKnowledge(mod.programType, mod.name);
      console.log(`  Knowledge: ${knowledge.length} chars`);

      // Create a file with the knowledge for the assistant
      const file = await openai.files.create({
        file: new File([knowledge], `${mod.programType}_knowledge.md`, { type: 'text/markdown' }),
        purpose: 'assistants',
      });
      console.log(`  File uploaded: ${file.id}`);

      // Create the assistant with file search
      const assistant = await openai.beta.assistants.create({
        name: mod.name,
        instructions: mod.instructions,
        model: "gpt-4o-mini",
        tools: [{ type: "file_search" }],
        tool_resources: {
          file_search: {
            vector_stores: [{
              file_ids: [file.id],
            }],
          },
        },
      });

      console.log(`  Assistant created: ${assistant.id}`);
      results.push({ name: mod.name, id: assistant.id, fileId: file.id, status: 'ok' });

    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      results.push({ name: mod.name, id: null, status: 'error', error: err.message });
    }
  }

  // Print results
  console.log('\n\n=== RESULTADOS ===\n');
  const config = {};
  for (const r of results) {
    const mark = r.status === 'ok' ? 'OK' : 'ERROR';
    console.log(`[${mark}] ${r.name}: ${r.id || r.error}`);
    if (r.id) {
      const key = r.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      config[key] = r.id;
    }
  }

  console.log('\n\n=== CONFIGURACION PARA .env.local ===\n');
  for (const [key, id] of Object.entries(config)) {
    console.log(`OPENAI_ASSISTANT_${key.toUpperCase()}=${id}`);
  }
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
