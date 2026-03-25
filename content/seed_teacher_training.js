#!/usr/bin/env node
// ============================================================
// seed_teacher_training.js
// Seeds the "Docencia Virtual Efectiva" teacher training program
// into the ITSEIA Supabase database.
//
// Usage:
//   SUPABASE_URL=https://wqlselfapnggxxeziruo.supabase.co \
//   SUPABASE_SERVICE_KEY=<service_role_key> \
//   node apps/web/content/seed_teacher_training.js
//
// PREREQUISITE: Run supabase/migrations/013_teacher_module.sql in the
// Supabase SQL Editor FIRST. That migration:
//   1. ALTERs programs_type_check to add 'teacher_training'
//   2. Creates all 8 new tables
//   3. Includes a DO block that also seeds the program data
//
// This script is the JS alternative for the seed step only.
// Run it if the SQL DO block's NOTICE says it was already skipped.
// ============================================================

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://wqlselfapnggxxeziruo.supabase.co";
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const MODULES = [
  {
    order: 1,
    code: "CAP101",
    name: "Fundamentos de la Educacion Virtual y el Marco CES",
    hours: 12,
    description:
      "Principios de la educacion en linea, marco normativo CES Ecuador, Art. 61 RRA 2022, modalidades de aprendizaje virtual y roles del docente en entornos digitales.",
    sessions: [
      {
        number: 1,
        title: "Paradigmas de la Educacion Virtual",
        description:
          "Historia, modelos y evidencia de efectividad de la educacion en linea. Diferencias con modalidad presencial.",
      },
      {
        number: 2,
        title: "Marco Normativo CES para Modalidad en Linea",
        description:
          "Art. 57, 61, 62 RRA 2022. Requisitos de horas sincronicas, contenido y capacitacion docente.",
      },
      {
        number: 3,
        title: "El Rol del Docente Virtual Efectivo",
        description:
          "Competencias digitales, gestion del tiempo, comunicacion asincronica y presencia docente online.",
      },
    ],
  },
  {
    order: 2,
    code: "CAP102",
    name: "Uso Efectivo del LMS ITSEIA (Navegacion y Contenido)",
    hours: 16,
    description:
      "Navegacion completa del campus ITSEIA: crear sesiones, subir video y teoria, gestionar quizzes, revisar entregas y usar el AI Lab como docente.",
    sessions: [
      {
        number: 1,
        title: "Navegacion y Configuracion del Campus",
        description:
          "Tour completo del LMS ITSEIA: dashboard, materias, sesiones, herramientas del docente.",
      },
      {
        number: 2,
        title: "Creacion y Edicion de Sesiones Academicas",
        description:
          "Subir video, presentacion, teoria markdown, configurar quiz y ejercicio. Indicadores de calidad CES.",
      },
      {
        number: 3,
        title: "Gestion de Entregas y Retroalimentacion",
        description:
          "Panel de entregas, calificacion, feedback escrito, seguimiento del progreso estudiantil en el LMS.",
      },
    ],
  },
  {
    order: 3,
    code: "CAP103",
    name: "Diseno de Contenido Interactivo y Evaluaciones Online",
    hours: 20,
    description:
      "Estrategias de diseno instruccional para entornos virtuales: microlearning, contenido multimedia, rubricas de evaluacion, quizzes adaptativos y feedback efectivo.",
    sessions: [
      {
        number: 1,
        title: "Principios de Diseno Instruccional para e-Learning",
        description:
          "Modelo ADDIE adaptado a entornos virtuales. Objetivos de aprendizaje verificables y alineacion curricular.",
      },
      {
        number: 2,
        title: "Creacion de Contenido Multimedia Efectivo",
        description:
          "Video educativo de calidad, presentaciones interactivas, teoria estructurada en markdown. Estandar 1500 palabras.",
      },
      {
        number: 3,
        title: "Evaluaciones Online y Rubricas de Calificacion",
        description:
          "Tipos de evaluacion, diseno de quizzes anti-trampa, rubricas con criterios y pesos, feedback automatizado.",
      },
    ],
  },
  {
    order: 4,
    code: "CAP104",
    name: "Facilitacion de Clases Sincronicas con Videoconferencia",
    hours: 14,
    description:
      "Tecnicas de facilitacion en videoconferencia: dinamicas de participacion, control del aula virtual, gestion del tiempo, grabacion de clases y seguimiento post-sesion.",
    sessions: [
      {
        number: 1,
        title: "Configuracion Tecnica de Videoconferencia",
        description:
          "Setup de camara, microfono, fondo virtual. Herramientas de participacion: sondeos, salas de trabajo, pizarra.",
      },
      {
        number: 2,
        title: "Facilitacion Activa en Clase Sincronica",
        description:
          "Tecnicas para mantener atencion, dinamicas de participacion, manejo de imprevistos tecnicos, cierre efectivo.",
      },
      {
        number: 3,
        title: "Grabacion, Edicion y Publicacion de Clases",
        description:
          "Flujo de trabajo: grabar, editar lo esencial, subir a YouTube privado, vincular en el LMS para clase asincronica.",
      },
    ],
  },
  {
    order: 5,
    code: "CAP105",
    name: "Evaluacion Formativa y Retroalimentacion Efectiva",
    hours: 16,
    description:
      "Diseno de evaluaciones continuas, retroalimentacion constructiva por escrito, criterios de calificacion transparentes, prevencion del plagio y etica academica online.",
    sessions: [
      {
        number: 1,
        title: "Evaluacion Continua y Aprendizaje Formativo",
        description:
          "Diferencia evaluacion formativa vs sumativa. Estrategias de check-in rapido: exit tickets, kahoot, quizzes cortos.",
      },
      {
        number: 2,
        title: "Retroalimentacion Escrita de Alto Impacto",
        description:
          "Modelo SBI (Situacion-Comportamiento-Impacto). Feedback especifico, accionable y oportuno por plataforma.",
      },
      {
        number: 3,
        title: "Integridad Academica en Entornos Digitales",
        description:
          "Prevencion del plagio, configuracion de deteccion en quizzes, politica de integridad ITSEIA, consecuencias.",
      },
    ],
  },
  {
    order: 6,
    code: "CAP106",
    name: "Seguimiento del Progreso Estudiantil y Tutoria Virtual",
    hours: 14,
    description:
      "Uso de analytics del LMS para identificar estudiantes en riesgo, estrategias de intervencion temprana, comunicacion proactiva y documentacion de tutoria virtual.",
    sessions: [
      {
        number: 1,
        title: "Lectura de Analytics del LMS",
        description:
          "Interpretar reportes de progreso, tasas de completitud, tiempo en sesion y patrones de acceso de los estudiantes.",
      },
      {
        number: 2,
        title: "Identificacion Temprana de Estudiantes en Riesgo",
        description:
          "Criterios de riesgo: 30% sesiones incompletas, quiz promedio menor 60%, 2+ inasistencias consecutivas. Protocolo de intervencion.",
      },
      {
        number: 3,
        title: "Comunicacion y Tutoria Virtual Proactiva",
        description:
          "Mensajes de seguimiento efectivos, frecuencia recomendada, registro de intervenciones, escalacion a coordinacion.",
      },
    ],
  },
  {
    order: 7,
    code: "CAP107",
    name: "Inteligencia Artificial como Herramienta Pedagogica",
    hours: 16,
    description:
      "Aplicaciones practicas de IA generativa (ChatGPT, Claude, Gemini) para preparar clases, crear ejercicios, personalizar contenido y dar retroalimentacion automatizada.",
    sessions: [
      {
        number: 1,
        title: "Fundamentos de IA Generativa para Docentes",
        description:
          "Como funcionan LLMs (ChatGPT, Claude, Gemini). Prompt engineering basico aplicado a preparacion de clases.",
      },
      {
        number: 2,
        title: "IA para Creacion de Contenido Educativo",
        description:
          "Prompts para generar quizzes, ejercicios, resumenes, casos de estudio y retroalimentacion personalizada.",
      },
      {
        number: 3,
        title: "IA para Personalizacion y Seguimiento",
        description:
          "Usar IA para analizar respuestas de estudiantes, identificar patrones de error, sugerir recursos adicionales.",
      },
    ],
  },
  {
    order: 8,
    code: "CAP108",
    name: "Etica, Privacidad y Normativa en la Educacion Online",
    hours: 12,
    description:
      "Proteccion de datos personales (LOPDP Ecuador), derechos de autor en contenido digital, accesibilidad e inclusion, etica en el uso de IA y politicas institucionales ITSEIA.",
    sessions: [
      {
        number: 1,
        title: "Proteccion de Datos en la Educacion Online",
        description:
          "LOPDP Ecuador: datos que se recopilan en el LMS, derechos de los estudiantes, politica de privacidad ITSEIA.",
      },
      {
        number: 2,
        title: "Derechos de Autor y Contenido Digital",
        description:
          "Creative Commons, uso justo, citar correctamente, crear contenido original vs curado, politica de copyright.",
      },
      {
        number: 3,
        title: "Accesibilidad, Inclusion y Etica Docente",
        description:
          "Diseno universal para el aprendizaje, subtitulos en videos, texto alternativo, conducta etica en entornos digitales.",
      },
    ],
  },
];

async function seed() {
  console.log("Starting teacher training program seed...\n");

  // Check if already exists
  const { data: existing } = await supabase
    .from("programs")
    .select("id")
    .eq("slug", "docencia-virtual-efectiva")
    .maybeSingle();

  if (existing) {
    console.log(
      "Program 'docencia-virtual-efectiva' already exists. Skipping.\n" +
        "To re-seed, delete the program from Supabase first."
    );
    return;
  }

  // 1. Create program
  const { data: program, error: progError } = await supabase
    .from("programs")
    .insert({
      name: "Docencia Virtual Efectiva",
      slug: "docencia-virtual-efectiva",
      description:
        "Programa de capacitacion de 120 horas para docentes de modalidad en linea. Requisito Art. 61 RRA 2022 (CES Ecuador).",
      type: "teacher_training",
      price: 0,
      duration_months: 3,
      is_active: true,
      total_semesters: 1,
    })
    .select("id")
    .single();

  if (progError) {
    console.error("Error creating program:", progError.message);
    process.exit(1);
  }

  console.log(`Program created: ${program.id}`);

  // 2. Create semester
  const { data: semester, error: semError } = await supabase
    .from("semesters")
    .insert({
      program_id: program.id,
      number: 1,
      name: "Capacitacion Completa 120h",
      level: "professional",
      is_active: true,
    })
    .select("id")
    .single();

  if (semError) {
    console.error("Error creating semester:", semError.message);
    process.exit(1);
  }

  console.log(`Semester created: ${semester.id}`);

  // 3. Create subjects and sessions
  for (const mod of MODULES) {
    const slug = mod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const { data: subject, error: subjError } = await supabase
      .from("subjects")
      .insert({
        semester_id: semester.id,
        code: mod.code,
        name: mod.name,
        slug,
        description: mod.description,
        credit_hours: 0,
        hours_docencia: Math.floor(mod.hours / 2),
        hours_practica: Math.floor(mod.hours / 4),
        hours_autonomo: Math.floor(mod.hours / 4),
        hours_total: mod.hours,
        order_index: mod.order,
        is_active: true,
      })
      .select("id")
      .single();

    if (subjError) {
      console.error(`Error creating subject ${mod.code}:`, subjError.message);
      continue;
    }

    console.log(`  Subject ${mod.code}: ${mod.name} (${mod.hours}h)`);

    for (const sess of mod.sessions) {
      const theoryMarkdown = `# ${sess.title}\n\n${sess.description}\n\n## Contenido en Desarrollo\n\nEl equipo de coordinacion academica de ITSEIA esta completando el contenido de este modulo. Podras acceder al material completo proximamente.\n\n## Objetivo de Aprendizaje\n\nAl completar esta sesion podras aplicar los conceptos de **${sess.title}** en tu practica docente dentro del campus ITSEIA.\n\n## Actividades Sugeridas\n\n- Revisa la documentacion oficial del campus en la seccion de ayuda.\n- Explora las materias de ejemplo disponibles en tu panel docente.\n- Comparte dudas con el coordinador academico por WhatsApp: +593 95 989 2034`;

      const { error: sessError } = await supabase.from("sessions").insert({
        subject_id: subject.id,
        number: sess.number,
        title: sess.title,
        description: sess.description,
        theory_markdown: theoryMarkdown,
        estimated_duration_minutes: Math.floor((mod.hours * 60) / 3),
        order_index: sess.number,
        is_active: true,
      });

      if (sessError) {
        console.error(
          `    Error creating session ${sess.number} for ${mod.code}:`,
          sessError.message
        );
      } else {
        console.log(`    Session ${sess.number}: ${sess.title}`);
      }
    }
  }

  console.log(
    "\nSeed completed successfully!\n" +
      "Teachers can now access /teacher/capacitacion to start their 120h training."
  );
}

seed().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
