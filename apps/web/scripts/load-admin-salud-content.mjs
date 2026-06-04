#!/usr/bin/env node
/**
 * load-admin-salud-content.mjs
 *
 * Carga el contenido educativo del curso profesional
 * "IA Aplicada a Administración del Área de Salud" (slug: admin-salud)
 * en la tabla `cursos_pro_sessions` de Supabase.
 *
 * Curso ID:    81377222-84e4-46e9-a4a3-82a578257b1e
 * Arranca:     viernes 6 jun 2026, 20:00 EC (Google Meet del campus)
 * Alumnas:     Gisela Inca + Josselin Montero (2 matriculadas)
 *
 * Idempotente: hace UPDATE por num de sesión. Se puede re-correr sin duplicar.
 *
 * Campos que llena por sesión:
 *   - theory_md           (markdown con contexto sector salud Ecuador)
 *   - exercise_md         (ejercicio + rúbrica)
 *   - quiz_json           (array 5 preguntas con a/b/c/d + correct + rationale)
 *   - resources_json      (array 3-5 recursos con title/url/type)
 *   - ailab_config_json   ({ suggested_prompt, context, model_recommendation })
 *
 * Marca:
 *   - Sin "Instituto Superior Tecnológico"
 *   - Sin "MERKANOVA"
 *   - Sin promesas de salario individual
 *   - Tildes y ñ correctas, español ecuatoriano
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const COURSE_ID = '81377222-84e4-46e9-a4a3-82a578257b1e';

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

// ============================================================
// CONTENIDO DE LAS 8 SESIONES
// ============================================================

const sessions = [
  // ------------------------------------------------------------
  // SESIÓN 1 — Fundamentos de IA + LOPDP Ecuador (M1, 120min)
  // ------------------------------------------------------------
  {
    num: 1,
    theory_md: `# Sesión 1 — Fundamentos de IA + LOPDP Ecuador

## La IA administrativa hospitalaria no es la IA clínica

La IA aplicada a la administración del área de salud es una categoría distinta de la IA clínica. La IA clínica apoya al médico, a enfermería o al tecnólogo en diagnóstico y tratamiento. La IA administrativa hospitalaria apoya a quienes hacen que el hospital opere: facturación, agenda, reportes a gerencia, atención al paciente no clínica, compliance regulatorio, inventario farmacéutico, costeo de procedimientos. Ustedes no firman diagnósticos. Hacen que el hospital funcione, y ahí la IA cambia la vida del rol.

## La oportunidad en cifras del sector salud ecuatoriano

PwC Ecuador 2026 reporta que el 41% de las instituciones de salud planifica integrar IA en procesos administrativos antes de 2027, pero solo el 9% cuenta con personal capacitado. La brecha es la oportunidad. En Quito y Guayaquil, los hospitales privados grandes ya pilotan facturación automatizada al IESS, gestión de citas con chatbots y dashboards de KPIs en Power BI. Las administrativas que dominan estas herramientas se vuelven la persona clave para la gerencia hospitalaria.

## Tres casos reales que ya operan en hospitales privados

**Caso 1 — Facturación médica automatizada.** Sin IA, una administrativa procesa 30-50 facturas por día revisando códigos CIE-10, validando convenios con seguros, identificando errores. Con un GPT especializado en facturación SOAT/IESS, la misma persona procesa 200-300 facturas por día con menor tasa de error y mayor velocidad de cobro al IESS o al seguro privado. **Caso 2 — Chatbot de citas.** Pacientes piden cita, reagendan, confirman y reciben recordatorios sin pasar por personal humano. Reducen el ausentismo (no-shows) hasta 30%. **Caso 3 — Reportes a gerencia con Power BI + IA.** Lo que era reporte mensual armado a mano es hoy dashboard vivo con narrativa ejecutiva automática.

## LOPDP-Ecuador 2021: los datos clínicos son sensibles

La IA administrativa toca datos clínicos sensibles: nombre del paciente, número de historia clínica, diagnóstico facturado, monto cobrado al IESS. La LOPDP-Ecuador 2021 los clasifica como datos sensibles, con el nivel más alto de protección. Esto se traduce en prácticas operativas concretas: no subir datos identificables a IA pública sin anonimización previa, configurar las cuentas IA para que no entrenen con datos, documentar el uso de IA en cada documento administrativo emitido, dejar siempre la firma final en una persona humana titular del proceso.

## Cierre: las 5 reglas de oro del uso administrativo de IA

Las 5 reglas que internalizan en esta sesión son el seguro profesional del rol: (1) la firma administrativa siempre es humana; (2) verificación obligatoria de cifras, códigos CIE-10, tarifas MSP y citas regulatorias del SRI; (3) anonimización antes de subir a IA pública con la regla de pluralización; (4) documentación del uso IA en el proceso administrativo; (5) consentimiento del paciente cuando aplique en chatbots y encuestas. Estas reglas convertidas en checklist viven en el campus y se firman al cierre de esta primera sesión.`,

    exercise_md: `# Ejercicio Sesión 1 — Mapa de tareas + compromiso LOPDP firmado

## Objetivo
Aterrizar los conceptos del rol administrativo hospitalario y las 5 reglas de oro a tu realidad concreta antes de la sesión 2.

## Pasos

1. **Lista de 10 tareas administrativas.** Listá 10 tareas administrativas que hacés (Gisela: en tu rol actual; Josselin: las que viste en pasantía o esperás tener al graduarte de ESPOCH). Para cada tarea marcá: frecuencia (diaria, semanal, mensual), tiempo actual aproximado en minutos, si involucra datos clínicos sensibles (Sí/No).

2. **Identificación de las 3 prioritarias.** De las 10, marcá con asterisco las 3 que más tiempo te consumen al mes (producto frecuencia × tiempo). Esas son tus candidatas iniciales a automatizar con IA.

3. **Compromiso personal LOPDP firmado.** Escribí en una página tu compromiso personal de uso administrativo de IA. Debe incluir las 5 reglas de oro adaptadas a tu rol: firma humana, verificación de cifras y códigos, anonimización con regla de pluralización, documentación del uso IA, consentimiento del paciente cuando aplique. Firmá y fechá. Este documento sirve como evidencia profesional ante tu jefa o coordinadora.

4. **Subida al campus.** Subí el archivo en formato PDF o Word al campus, en la sesión 1. Antes del miércoles 11 jun 8:00 PM.

## Rúbrica de evaluación (sobre 10)

| Criterio | Puntos |
|----------|--------|
| Lista de 10 tareas con frecuencia + tiempo + sensibilidad LOPDP completa | 3 |
| 3 tareas prioritarias correctamente identificadas con justificación cuantitativa | 2 |
| Compromiso personal firmado con las 5 reglas adaptadas a tu rol específico | 3 |
| Calidad de redacción profesional, sin errores ortográficos, tono ecuatoriano | 1 |
| Entrega puntual al campus antes del cierre | 1 |

Aprobación mínima: 7/10. Si querés feedback escrito de Héctor, subí antes del lunes 9 jun.`,

    quiz_json: [
      {
        id: 'q1',
        question: '¿Cuál es la diferencia clave entre IA clínica e IA administrativa hospitalaria?',
        options: {
          a: 'La IA clínica apoya diagnóstico y tratamiento médico; la administrativa apoya facturación, agenda, reportes y atención no clínica.',
          b: 'La IA clínica es más cara que la IA administrativa.',
          c: 'La IA administrativa solo se usa en hospitales públicos.',
          d: 'No hay diferencia, son lo mismo con otro nombre.',
        },
        correct: 'a',
        rationale: 'Son dos categorías distintas. La IA administrativa apoya el rol operativo que hace funcionar al hospital sin involucrarse en decisiones clínicas.',
      },
      {
        id: 'q2',
        question: 'Según PwC Ecuador 2026, ¿qué porcentaje de instituciones de salud planifica integrar IA y qué porcentaje tiene personal capacitado?',
        options: {
          a: '41% planifica, 9% tiene personal capacitado.',
          b: '50% planifica, 50% tiene personal capacitado.',
          c: '20% planifica, 70% tiene personal capacitado.',
          d: '9% planifica, 41% tiene personal capacitado.',
        },
        correct: 'a',
        rationale: 'La brecha 41% vs 9% es la oportunidad que aprovecha el rol administrativo formado en IA.',
      },
      {
        id: 'q3',
        question: 'Según la LOPDP-Ecuador 2021, los datos clínicos administrativos (nombre del paciente, historia clínica, diagnóstico facturado) se clasifican como:',
        options: {
          a: 'Datos públicos.',
          b: 'Datos personales comunes.',
          c: 'Datos sensibles con el nivel más alto de protección.',
          d: 'Datos comerciales.',
        },
        correct: 'c',
        rationale: 'Por ser datos sensibles requieren prácticas operativas estrictas: anonimización antes de IA pública, configuración de privacidad y documentación de uso.',
      },
      {
        id: 'q4',
        question: '¿Cuál es la regla 1 de las 5 reglas de oro del uso administrativo de IA con datos clínicos?',
        options: {
          a: 'La firma administrativa siempre es humana.',
          b: 'La IA decide por sí sola sin revisión.',
          c: 'Nunca usar IA con datos administrativos.',
          d: 'Solo usar IA en horario laboral.',
        },
        correct: 'a',
        rationale: 'La IA prepara el borrador o sugiere el código, pero la emisión final de factura, oficio o decisión administrativa pasa por una persona con responsabilidad institucional.',
      },
      {
        id: 'q5',
        question: '¿En qué consiste la "regla de pluralización" para anonimizar datos antes de subir a IA pública?',
        options: {
          a: 'Repetir el dato varias veces para que la IA lo entienda mejor.',
          b: 'Reemplazar datos identificables (nombre, cédula, diagnóstico específico) por categorías generales (paciente masculino aproximadamente 45 años con enfermedad crónica metabólica).',
          c: 'Traducir el dato al inglés antes de pegarlo en ChatGPT.',
          d: 'Usar mayúsculas en todos los datos personales.',
        },
        correct: 'b',
        rationale: 'La pluralización mantiene la utilidad administrativa del dato y elimina el 95% del riesgo LOPDP en menos de 5 segundos.',
      },
    ],

    resources_json: [
      { title: 'LOPDP-Ecuador 2021 — texto oficial Asamblea Nacional', url: 'https://www.asambleanacional.gob.ec/es/leyes-aprobadas', type: 'normativa' },
      { title: 'PwC Ecuador — Reporte Salud Digital 2026 (resumen ejecutivo)', url: 'https://www.pwc.com/ec/es.html', type: 'reporte' },
      { title: 'MSP Ecuador — Red Pública Integral de Salud (RPIS)', url: 'https://www.salud.gob.ec', type: 'institucional' },
      { title: 'Tabla CIE-10 oficial — OMS (consulta de códigos)', url: 'https://icd.who.int', type: 'referencia' },
      { title: 'ITSEIA — Plantilla compromiso personal LOPDP administrativo (campus)', url: 'https://tecnologico.itseia.ai/cursos-pro/admin-salud/recursos', type: 'plantilla' },
    ],

    ailab_config_json: {
      suggested_prompt: `Sos consultora senior en transformación digital de hospitales privados ecuatorianos con 15 años de experiencia.

CONTEXTO: Soy administrativa del área de salud en Ecuador. Mi rol incluye [describí en 3-5 frases tus responsabilidades concretas o las que esperás tener al graduarte].

TAREA:
1. Listá las 5 tareas administrativas de mi rol donde la IA aporta más ahorro de tiempo y reducción de error.
2. Para cada una, indicá la herramienta IA recomendada (ChatGPT, Claude, Gemini, Copilot, Canva IA, NotebookLM, Perplexity Pro).
3. Estimá ahorro semanal en horas.
4. Marcá el nivel de sensibilidad LOPDP de los datos involucrados (alto/medio/bajo).
5. Priorizá las 5 por impacto/esfuerzo en una tabla.

VERIFICACIÓN: Marcá explícitamente qué afirmaciones requieren confirmación humana antes de actuar.`,
      context: 'Sesión 1 — Fundamentos de IA aplicada a la administración del área de salud + LOPDP Ecuador. Sector salud privado ecuatoriano: clínicas pequeñas-medianas, hospitales privados, casos IESS/SOAT/seguros privados (Salud S.A., Ecuasanitas, Saludsa).',
      model_recommendation: 'Claude Sonnet 4.6 (mejor reconocimiento de incertidumbre) o ChatGPT 5.5 con GPT personalizado.',
    },
  },

  // ------------------------------------------------------------
  // SESIÓN 2 — ChatGPT y Claude Pro — Parte 1 (M2, 60min)
  // ------------------------------------------------------------
  {
    num: 2,
    theory_md: `# Sesión 2 — ChatGPT 5.5 y Claude Pro para administración hospitalaria (Parte 1)

## ChatGPT Plus nivel profesional administrativo

ChatGPT 5.5 con plan Plus (USD 20 mensuales) entrega cuatro capacidades indispensables para el rol administrativo de salud: modelo más potente, archivos como input (Excel, PDF, imagen escaneada de factura), Advanced Data Analysis para análisis estadístico de datos del servicio y los GPTs personalizados con instrucciones permanentes. El GPT personalizado es la herramienta clave: una vez configurado, deja de ser asistente genérico y se convierte en facturadora especialista en IESS, redactora de oficios hospitalarios o coordinadora de comunicación con paciente. La configuración inicial toma 30-45 minutos por GPT y se reutiliza para siempre.

## Los 3 GPTs administrativos hospitalarios de máximo impacto

**GPT 1 — Facturador SOAT / IESS / Seguros-Ecuador.** Instrucciones permanentes: rol de asistente administrativa de facturación médica, validación del convenio aplicable (SOAT, IESS, seguro privado, particular), sugerencia de código CIE-10 con marca \`[VERIFICAR EN TABLA OFICIAL]\`, cálculo de retenciones SRI y monto neto. La administrativa pega los datos crudos del procedimiento y recibe propuesta de facturación lista para revisar antes de emitir la factura electrónica. **GPT 2 — Redactor de oficios y certificados hospitalarios.** Estructura institucional ecuatoriana: encabezado, asunto, contenido, cierre formal, espacio para firma. Oficios y certificados que antes tomaban 20-30 minutos se resuelven en 2-3 minutos. **GPT 3 — Comunicador con paciente no clínico.** Mensajes administrativos al paciente en lenguaje claro, respetuoso, sin tecnicismos médicos, adaptados al contexto ecuatoriano.

## Por qué Claude Sonnet 4.6 complementa a ChatGPT

Claude Sonnet 4.6 (Anthropic, USD 20 mensuales Pro) es la herramienta preferida cuando se trabaja con documentos largos y regulatorios. Su ventana de contexto (200K tokens estándar, 1M en beta) significa que puede leer manuales del IESS de 80 páginas, reformas tributarias del SRI de 60 páginas o NIIF aplicadas a salud privada en una sola conversación. ChatGPT también lo hace, pero con mayor tasa de alucinación según benchmarks publicados. Para Gisela y Josselin, la regla práctica es: **ChatGPT para velocidad y volumen administrativo diario; Claude para profundidad y documentos largos regulatorios o financieros**.

## Advanced Data Analysis y la función Projects

Advanced Data Analysis de ChatGPT permite subir un Excel del servicio (anonimizado) y pedir análisis, gráficos, detección de outliers y reporte ejecutivo. Para el reporte mensual a gerencia, el ahorro es de 5-7 horas mensuales. La función Projects de Claude permite mantener una conversación viva sobre un proceso administrativo sostenido (por ejemplo, migración a tarifario actualizado del MSP), con archivos cargados que Claude vuelve a leer en cada consulta. Sirve como memoria de proyecto con cerebro.

## Configuración de privacidad: paso crítico antes de empezar

Antes de usar ChatGPT con datos administrativos hospitalarios reales, asegurar que la cuenta no entrena con los datos: Settings > Data Controls > "Improve the model for everyone" debe quedar **OFF**. Claude Pro ya no entrena con datos de usuarios Pro por política. Esta configuración es parte de cumplir la regla 3 de oro (anonimización antes de IA pública) del marco LOPDP de la sesión 1.`,

    exercise_md: `# Ejercicio Sesión 2 — Configurar el GPT Facturador SOAT/IESS

## Objetivo
Construir tu primer GPT personalizado administrativo y probarlo con casos reales anonimizados.

## Pasos

1. **Activá ChatGPT Plus** (USD 20 mensuales). Para Josselin en plan gratuito: usá la versión gratuita aplicando manualmente las instrucciones del GPT como prompt sistema en cada conversación.

2. **Crear el GPT Facturador.** En ChatGPT, ir a "Explore GPTs" > "Create". Cargá las instrucciones permanentes del GPT 1 (rol, validación de convenio, sugerencia CIE-10 marcada con \`[VERIFICAR EN TABLA OFICIAL]\`, cálculo de retenciones SRI, regla de no incluir datos identificables del paciente).

3. **Cargá como referencia** 3 ejemplos de facturas correctas emitidas a IESS / SOAT / seguro privado (anonimizadas: sin nombre, cédula, número de historia). El GPT aprende del patrón.

4. **Probálo con 5 casos reales** de esta semana, todos anonimizados con la regla de pluralización ("paciente masculino aproximadamente 45 años con enfermedad crónica metabólica"). Documentá: tiempo antes (sin GPT) vs tiempo después (con GPT), errores detectados, calidad subjetiva 1-10.

5. **Configurá la privacidad.** Settings > Data Controls > "Improve the model for everyone" = OFF. Captura de pantalla como evidencia.

6. **Subí al campus**: configuración del GPT (texto de las instrucciones), 5 casos procesados con tiempos, captura de configuración de privacidad. Antes del viernes 13 jun 8:00 PM.

## Rúbrica de evaluación (sobre 10)

| Criterio | Puntos |
|----------|--------|
| GPT configurado correctamente con las 5 reglas no negociables | 3 |
| 5 casos procesados con datos anonimizados (regla de pluralización aplicada) | 3 |
| Documentación de tiempos antes/después con cálculo de ahorro semanal | 2 |
| Captura de configuración de privacidad OFF | 1 |
| Entrega puntual al campus | 1 |

Aprobación mínima: 7/10. La evidencia subida es la base de tu hoja de vida.`,

    quiz_json: [
      {
        id: 'q1',
        question: '¿Cuáles son los 3 GPTs administrativos hospitalarios de máximo impacto?',
        options: {
          a: 'GPT Diagnóstico, GPT Tratamiento, GPT Cirugía.',
          b: 'GPT Facturador SOAT/IESS, GPT Redactor de oficios, GPT Comunicador con paciente no clínico.',
          c: 'GPT Marketing, GPT Ventas, GPT RRHH.',
          d: 'GPT Inglés, GPT Español, GPT Quichua.',
        },
        correct: 'b',
        rationale: 'Los 3 GPTs cubren las funciones administrativas de máximo volumen: facturación, documentación formal y comunicación con paciente.',
      },
      {
        id: 'q2',
        question: '¿Por qué Claude Sonnet 4.6 es preferido para documentos largos como el Manual del Prestador IESS?',
        options: {
          a: 'Porque es gratuito.',
          b: 'Porque tiene ventana de contexto de 200K-1M tokens y menor tasa de alucinación reconociendo incertidumbre.',
          c: 'Porque solo funciona en español.',
          d: 'Porque integra con Microsoft Excel directamente.',
        },
        correct: 'b',
        rationale: 'La ventana grande permite cargar el manual completo y conversar con él. Claude además reconoce incertidumbre cuando se le pide.',
      },
      {
        id: 'q3',
        question: '¿Cuál es la regla práctica de distribución entre ChatGPT y Claude para Gisela y Josselin?',
        options: {
          a: 'Usar solo ChatGPT siempre.',
          b: 'Usar solo Claude siempre.',
          c: 'ChatGPT para velocidad y volumen administrativo diario; Claude para profundidad y documentos largos regulatorios o financieros.',
          d: 'Alternar al azar entre los dos.',
        },
        correct: 'c',
        rationale: 'Cada herramienta tiene fortalezas distintas. La distribución optimiza tiempo y reduce el riesgo de alucinaciones en cifras críticas.',
      },
      {
        id: 'q4',
        question: '¿Qué configuración crítica de privacidad debe activarse en ChatGPT Plus antes de trabajar con datos administrativos hospitalarios?',
        options: {
          a: 'Activar "Improve the model for everyone" en ON.',
          b: 'Desactivar "Improve the model for everyone" en Settings > Data Controls.',
          c: 'Cambiar el idioma a inglés.',
          d: 'Borrar el historial cada hora.',
        },
        correct: 'b',
        rationale: 'Mantenerlo OFF asegura que los datos administrativos no se usen para entrenar el modelo, cumpliendo la regla 3 de oro LOPDP.',
      },
      {
        id: 'q5',
        question: '¿Para qué sirve la función "Projects" de Claude en un proceso administrativo sostenido?',
        options: {
          a: 'Para grabar audio de reuniones.',
          b: 'Para mantener una conversación viva sobre un proceso con archivos cargados que Claude vuelve a leer en cada consulta — memoria de proyecto.',
          c: 'Para emitir facturas electrónicas directamente al SRI.',
          d: 'Para diseñar slides en Canva.',
        },
        correct: 'b',
        rationale: 'Projects es ideal para procesos sostenidos como migración a tarifario actualizado o seguimiento de implementación regulatoria.',
      },
    ],

    resources_json: [
      { title: 'OpenAI — Documentación oficial de GPTs Builder', url: 'https://platform.openai.com/docs/guides/customizing-gpts', type: 'documentacion' },
      { title: 'Anthropic Claude — Guía Pro y Projects', url: 'https://docs.anthropic.com', type: 'documentacion' },
      { title: 'SRI Ecuador — Reglamento de facturación electrónica', url: 'https://www.sri.gob.ec', type: 'normativa' },
      { title: 'IESS — Manual del prestador de salud', url: 'https://www.iess.gob.ec', type: 'normativa' },
      { title: 'ITSEIA — PROMPTS_LISTOS.md (35 prompts administrativos del Express)', url: 'https://tecnologico.itseia.ai/cursos-pro/admin-salud/recursos', type: 'plantilla' },
    ],

    ailab_config_json: {
      suggested_prompt: `[GPT Personalizado: Facturador SOAT/IESS/Seguros-Ecuador]

ROL: Asistente administrativa senior de facturación médica en Ecuador con 15 años de experiencia en convenios IESS, SOAT y seguros privados (Salud S.A., Ecuasanitas, Saludsa).

CONTEXTO: Soy administrativa junior en clínica privada de segundo nivel en Quito/Riobamba. Acabo de recibir los datos de un procedimiento atendido: [pegá datos anonimizados con regla de pluralización].

TAREA:
1. Identificá el tipo de convenio aplicable: SOAT, IESS, seguro privado, particular.
2. Sugerí código CIE-10 con marca [VERIFICAR EN TABLA OFICIAL].
3. Sugerí código CPT o tarifario MSP con [VERIFICAR EN TARIFARIO VIGENTE].
4. Calculá monto bruto, retenciones SRI aplicables, monto neto a facturar.
5. Devolvé tabla estructurada lista para revisar antes de emitir factura electrónica.

REGLAS NO NEGOCIABLES:
- Nunca inventar códigos ni tarifas sin marca [VERIFICAR EN FUENTE PRIMARIA].
- Nunca incluir datos identificables del paciente (solo rango de edad, sexo, condición general).
- Si faltan datos críticos, pedí aclaración antes de calcular.
- La emisión final de la factura electrónica y la firma son humanas.

FORMATO: Tabla en markdown + sección "verificaciones pendientes" al final.`,
      context: 'Sesión 2 (Parte 1 del Módulo 2) — Configuración de GPTs personalizados para facturación SOAT/IESS/seguros privados ecuatorianos. Aplicación del método ITSEIA de prompt en 5 bloques.',
      model_recommendation: 'ChatGPT 5.5 (GPT personalizado con instrucciones permanentes) para volumen diario; Claude Sonnet 4.6 cuando el caso requiere análisis de contrato del seguro privado largo.',
    },
  },

  // ------------------------------------------------------------
  // SESIÓN 3 — Gemini + Copilot + Canva IA (M2 cierre, 120min)
  // ------------------------------------------------------------
  {
    num: 3,
    theory_md: `# Sesión 3 — Gemini + Copilot Excel + Canva IA: cierre del stack profesional

## Copilot en Excel resuelve la fuga del reporte mensual a gerencia

Microsoft Copilot dentro de Excel (Copilot Pro USD 20 individual o M365 Copilot USD 30 institucional) resuelve la fuga administrativa mensual más común del rol hospitalario: el reporte de indicadores del servicio a gerencia. Sin IA, el flujo típico ocupa un día completo: descargar datos del sistema institucional, normalizar columnas, hacer tablas dinámicas, comparar con mes anterior, redactar hallazgos, armar gráficos, exportar a PDF. Con Copilot Excel, en lenguaje natural se pide "Compará estos dos meses, identificá los 3 cambios significativos por servicio (consulta externa, hospitalización, emergencia), generá gráficos de barras y de líneas, calculá tasa de ocupación, marcá outliers de tiempo de espera, devolveme resumen ejecutivo de 5 bullets en español ecuatoriano". Tiempo: 15-20 minutos.

## Los 3 flujos donde Copilot Excel brilla en administración hospitalaria

**Flujo 1 — Reporte mensual del servicio a gerencia.** Conteos de procedimientos por especialidad, tasa de ocupación de consultorios, indicadores de calidad (estancia media, tasa de readmisión, satisfacción), comparativa con mes anterior y propuestas accionables. Output listo para presentar. **Flujo 2 — Análisis financiero del cobro a seguros.** Lista de facturas emitidas, cobradas, pendientes, glosadas. Identificación de glosas recurrentes por convenio (Salud S.A., IESS, SOAT). Propuestas de mejora en proceso de facturación. **Flujo 3 — Análisis de inventario farmacéutico.** Consumos anómalos, stocks mínimos, tendencia, propuestas de reorden, alertas de medicamentos próximos a vencer (cumplimiento ARCSA). Reducción de pérdida por vencimientos de hasta 40%.

## Canva IA para material al paciente con identidad institucional

Canva IA (Magic Studio, USD 14.99 mensuales Pro) resuelve la otra fuga del rol: la comunicación con paciente y la papelería institucional. Generación de infografías, instructivos post-consulta, encuestas de satisfacción, brochures de servicios. Con plantillas institucionales personalizadas con la marca de la clínica, una administrativa puede generar 5-10 piezas semanales en menos tiempo del que tomaba hacer una sola pieza manualmente. Tres usos clave: infografía A4 con instructivo post-consulta (qué hacer en casa, banderas rojas, próxima cita, contactos), brochure de servicios del hospital para sala de espera y material educativo institucional (campañas de vacunación, control prenatal, salud mental).

## Gemini y NotebookLM: cuándo cada uno

Gemini 2.5 (Google AI Pro USD 19.99 mensuales) es la herramienta multimodal rápida: lectura de imágenes de facturas escaneadas, análisis de fotos de documentos, integración nativa con Google Workspace (Docs, Sheets, Calendar, Drive). NotebookLM (gratuito, Plus incluido en Google AI Pro) convierte un conjunto de documentos (Manual del Prestador IESS, Reglamento de Facturación Electrónica del SRI, NIIF aplicadas, reglamentos internos) en una fuente conversacional con citas. Lo importante: NotebookLM responde basándose únicamente en los documentos cargados, no en su entrenamiento general. Esto reduce drásticamente las alucinaciones porque la fuente es verificable.

## Stack profesional consolidado: 3 capas + 2 complementarias

La recomendación equilibrada para Gisela y Josselin es consolidar el stack en 3 capas con roles claros: **Capa 1** ChatGPT Plus (60% del tiempo, motor general con los 3 GPTs personalizados); **Capa 2** Claude Pro (20% del tiempo, motor profundo para documentos largos regulatorios); **Capa 3** Copilot M365 o Pro (20% del tiempo, motor productividad Excel + PowerPoint + Outlook institucional). Gemini queda como recurso secundario para tareas multimodales rápidas y Canva IA como complementaria para diseño visual. Costo total mensual: USD 40-60. Recuperación: 8-12 horas semanales = USD 130-180 mensuales en tiempo equivalente al costo-hora administrativo Ecuador.`,

    exercise_md: `# Ejercicio Sesión 3 — Reporte mensual con Copilot + 1 pieza con Canva IA

## Objetivo
Cerrar el módulo 2 con un entregable real que demuestre dominio del stack profesional administrativo hospitalario.

## Pasos

1. **Reporte mensual del servicio con Copilot Excel.** Tomá datos anonimizados de un mes del servicio (o usá los datos sintéticos del campus si todavía no tenés autorización institucional). Subí el Excel a Copilot y pedí: comparación mes vs mes anterior, top 3 cambios por servicio, gráficos de barras y líneas, tasa de ocupación, outliers de tiempo de espera, resumen ejecutivo de 5 bullets en español ecuatoriano. Documentá tiempo invertido.

2. **Pieza de comunicación con paciente en Canva IA.** Generá una infografía A4 con instructivo post-consulta para una especialidad concreta (consulta externa de medicina general o de odontología, por ejemplo). Estructura: encabezado institucional, qué hacer en casa, banderas rojas para volver a urgencias, próxima cita, contactos. Si todavía no tenés identidad institucional propia, usá paleta ITSEIA (Navy #1F2F58, Gold #FBBC0C, Sky #73B8E7).

3. **NotebookLM piloto.** Creá un notebook en NotebookLM (gratuito) y cargá 3 fuentes regulatorias: Manual del Prestador IESS, Reglamento de Facturación Electrónica del SRI, una norma ARCSA aplicable. Hacé 3 preguntas reales y guardá las respuestas con sus citas.

4. **Subida al campus.** Reporte Copilot (PDF), pieza Canva (PDF o PNG), capturas del NotebookLM con las 3 preguntas y respuestas. Antes del miércoles 18 jun 8:00 PM.

## Rúbrica de evaluación (sobre 10)

| Criterio | Puntos |
|----------|--------|
| Reporte Copilot con comparativa, gráficos y resumen ejecutivo en 5 bullets | 3 |
| Pieza Canva IA con identidad coherente, lenguaje claro y estructura completa | 3 |
| NotebookLM con 3 fuentes cargadas y 3 preguntas con citas verificables | 2 |
| Documentación de tiempos antes/después y cálculo de ahorro | 1 |
| Entrega puntual al campus | 1 |

Aprobación mínima: 7/10.`,

    quiz_json: [
      {
        id: 'q1',
        question: '¿Cuánto tiempo toma el reporte mensual a gerencia con Copilot Excel vs hacerlo manualmente?',
        options: {
          a: 'Mismo tiempo, no hay diferencia.',
          b: 'Copilot: 15-20 minutos vs manual: 1 día completo.',
          c: 'Copilot: 5 días vs manual: 1 hora.',
          d: 'Copilot: 1 mes vs manual: 1 semana.',
        },
        correct: 'b',
        rationale: 'La diferencia es el ahorro clave que justifica la inversión mensual en Copilot Pro o M365.',
      },
      {
        id: 'q2',
        question: '¿Cuáles son los 3 flujos donde Copilot Excel brilla en administración hospitalaria?',
        options: {
          a: 'Diagnóstico, tratamiento, cirugía.',
          b: 'Marketing, ventas, RRHH.',
          c: 'Reporte mensual del servicio a gerencia, análisis financiero del cobro a seguros, análisis de inventario farmacéutico.',
          d: 'Cocina, limpieza, mantenimiento.',
        },
        correct: 'c',
        rationale: 'Estos 3 flujos cubren las funciones de mayor volumen administrativo que ocupan horas semanales.',
      },
      {
        id: 'q3',
        question: '¿Por qué NotebookLM reduce drásticamente las alucinaciones comparado con ChatGPT general?',
        options: {
          a: 'Porque solo responde basándose en los documentos cargados, no en su entrenamiento general.',
          b: 'Porque es más caro.',
          c: 'Porque solo funciona en inglés.',
          d: 'Porque tiene una pantalla más grande.',
        },
        correct: 'a',
        rationale: 'Al restringir la fuente a documentos verificables, NotebookLM cita página exacta del Manual IESS, Reglamento SRI o NIIF cargada.',
      },
      {
        id: 'q4',
        question: '¿Cuál es la distribución recomendada del stack profesional administrativo hospitalario (3 capas)?',
        options: {
          a: '100% ChatGPT.',
          b: 'ChatGPT Plus 60% (motor general), Claude Pro 20% (documentos largos), Copilot 20% (Excel/PowerPoint).',
          c: '33% cada una sin orden.',
          d: 'Solo herramientas gratuitas.',
        },
        correct: 'b',
        rationale: 'Cada capa tiene rol definido: velocidad diaria, profundidad regulatoria y productividad Office.',
      },
      {
        id: 'q5',
        question: '¿Cuál es la inversión mensual del stack mínimo profesional y la recuperación esperada de tiempo?',
        options: {
          a: 'USD 500 mes, sin recuperación.',
          b: 'USD 40-60 mes; recuperación de 8-12 horas semanales (USD 130-180 mensuales en tiempo equivalente).',
          c: 'USD 0 mes, recuperación de 100 horas semanales.',
          d: 'USD 1000 mes, recuperación de 1 hora mensual.',
        },
        correct: 'b',
        rationale: 'El ROI es 10x desde la primera semana de aplicación correcta, manteniendo la disciplina del uso.',
      },
    ],

    resources_json: [
      { title: 'Microsoft 365 Copilot — planes y precios oficiales', url: 'https://www.microsoft.com/microsoft-365/copilot', type: 'producto' },
      { title: 'Canva IA (Magic Studio) — tutoriales oficiales', url: 'https://www.canva.com/learn/magic-studio/', type: 'tutorial' },
      { title: 'NotebookLM — Google AI', url: 'https://notebooklm.google.com', type: 'herramienta' },
      { title: 'ITSEIA — Plantilla de reporte mensual del servicio (Excel)', url: 'https://tecnologico.itseia.ai/cursos-pro/admin-salud/recursos', type: 'plantilla' },
      { title: 'Manual de identidad ITSEIA (paleta y tipografías para piezas Canva)', url: 'https://tecnologico.itseia.ai/cursos-pro/admin-salud/recursos', type: 'plantilla' },
    ],

    ailab_config_json: {
      suggested_prompt: `Sos analista senior de datos administrativos hospitalarios con experiencia en clínicas privadas ecuatorianas.

CONTEXTO: Subí Excel anonimizado con datos del servicio del mes [mes/año]. Columnas: fecha, especialidad, tipo de atención, convenio, tiempo de espera, tiempo de atención, monto facturado, estado de cobro.

TAREA:
1. Resumen ejecutivo en 5 bullets de los hallazgos del mes.
2. Top 3 indicadores que merecen atención urgente.
3. Comparación con el mes anterior si los datos están disponibles.
4. Outliers o anomalías administrativas (glosas recurrentes, tiempo de espera fuera de norma).
5. Gráficos sugeridos para presentar a gerencia (barras, líneas, mapa de calor).
6. 3 propuestas accionables para mejorar 1 indicador clave.

FORMATO: Reporte ejecutivo profesional en español ecuatoriano, máximo 600 palabras + gráficos.

VERIFICACIÓN: Marcá [VERIFICAR] toda cifra específica que dependa de tarifario, retención SRI o regulación vigente.`,
      context: 'Sesión 3 (Cierre del Módulo 2) — Stack profesional administrativo hospitalario: Copilot Excel para reportes, Canva IA para material a paciente, NotebookLM para regulatorio consultable.',
      model_recommendation: 'ChatGPT 5.5 con Advanced Data Analysis (subir Excel directo) o Copilot Excel integrado en Microsoft 365.',
    },
  },

  // ------------------------------------------------------------
  // SESIÓN 4 — Gestión Hospitalaria con IA — Parte 1 (M3, 60min)
  // ------------------------------------------------------------
  {
    num: 4,
    theory_md: `# Sesión 4 — Gestión de citas y agenda clínica con IA (Parte 1 M3)

## El ausentismo (no-shows) destruye la rentabilidad de la clínica

El ausentismo (no-shows) es una de las fugas más caras de cualquier clínica u hospital privado. Cuando un paciente no asiste a su cita programada, el hospital pierde el tiempo del profesional, el espacio del consultorio y la oportunidad de atender a otro paciente. En clínicas privadas pequeñas y medianas de Ecuador, los reportes muestran tasas de no-show entre 15% y 25%. Para una clínica que gana USD 20-30 por consulta, 10 no-shows mensuales evitados son USD 200-300 mensuales adicionales de flujo directo. Reducir el no-show a 5-10% es ahorro directo a la rentabilidad institucional sin gastar un dólar adicional en marketing.

## Los 4 frentes donde la IA cambia la gestión de citas

**Frente 1 — Confirmación inteligente.** En lugar de que la administrativa llame uno por uno a confirmar (10-15 minutos por cita), un GPT genera el mensaje WhatsApp personalizado: fecha, hora, profesional, dirección, indicaciones específicas (ayuno si aplica, documentos a traer), opciones de respuesta (confirmar, reagendar, cancelar). **Frente 2 — Recordatorios escalonados.** 48h antes (informativo), 24h antes (invitante), 2h antes (confirmatorio). Reducción reportada de no-shows: 25-40%. **Frente 3 — Reagendamiento inteligente.** Cuando el paciente quiere cambiar, el GPT consulta la agenda (Google Calendar conectado) y propone 3 opciones ajustadas a sus preferencias previas. **Frente 4 — Encuesta post-consulta automática.** 24 horas después de la cita, encuesta de 5 preguntas que alimenta el indicador de calidad del servicio del reporte mensual a gerencia.

## El GPT Gestor de Agenda: tu segundo activo profesional

El GPT Gestor de Agenda es el segundo GPT personalizado (después del Facturador de la sesión 2). Instrucciones permanentes: rol de coordinadora de agenda clínica con experiencia en Ecuador, generación de los 4 mensajes (confirmación, recordatorio 24h, recordatorio 2h, encuesta post-consulta) en español ecuatoriano profesional cercano sin tecnicismos médicos, máximo 80 palabras por mensaje. Para hospitales con sistema institucional propio, el GPT genera los textos y la administrativa los pega en el sistema. Para clínicas pequeñas sin sistema, GPT + WhatsApp Business + Google Calendar resuelve el 80% del flujo con costo USD 0 adicional.

## Cuidado con WhatsApp Business y Meta

El envío automatizado de WhatsApp masivo tiene restricciones de Meta. Para volumen pequeño (hasta 100 mensajes diarios), se puede hacer desde WhatsApp Business con plantillas pre-aprobadas. Para volumen mayor, se necesita WhatsApp Business API con proveedor verificado (Twilio, Wati, 360dialog). Esta sesión enseña el flujo manual primero (administrativa envía con WhatsApp Business desde el celular institucional) y deja la automatización como evolución natural en el M3 sesión 5.

## ROI esperado de implementar el flujo

Para una clínica que gestiona 50-100 citas mensuales, la implementación del flujo entrega: 5-10 horas semanales recuperadas de la administrativa, reducción de no-shows de 30% (10 citas no perdidas mensualmente = USD 200-300 adicionales), aumento de la satisfacción del paciente (medida en encuestas), datos sistemáticos para el reporte mensual a gerencia que muestra el aporte del rol. La administrativa se convierte en la persona que mejora la rentabilidad del consultorio, no solo la que atiende el teléfono.`,

    exercise_md: `# Ejercicio Sesión 4 — GPT Gestor de Agenda + 5 citas piloto

## Objetivo
Construir el segundo GPT personalizado y aplicarlo a casos reales de la semana.

## Pasos

1. **Configurar el GPT Gestor de Agenda.** En ChatGPT, "Explore GPTs" > "Create". Pegar las instrucciones permanentes: rol de coordinadora de agenda clínica ecuatoriana, generación de los 4 mensajes (confirmación inicial, recordatorio 24h antes, recordatorio 2h antes, encuesta post-consulta de 5 preguntas), todo en español ecuatoriano profesional cercano, máximo 80 palabras por mensaje, sin tecnicismos médicos.

2. **Probarlo con 5 citas reales** anonimizadas de la semana próxima (Gisela) o ficticias verosímiles (Josselin). Para cada cita, generar los 4 mensajes correspondientes. Total: 20 mensajes generados.

3. **Validación de tono.** Releé los mensajes generados con criterio de paciente: ¿son claros? ¿son respetuosos? ¿no usan tecnicismo médico innecesario? ¿se sienten ecuatorianos? Hacé los ajustes necesarios en las instrucciones del GPT.

4. **Plan de despliegue.** Escribí 1 página: cuándo vas a empezar a enviar estos mensajes a pacientes reales (semana del 23 jun, en paralelo con el proyecto final), qué métricas vas a medir (tasa de confirmación, tasa de no-shows, satisfacción), cuál es la línea base actual de no-shows en tu institución (si la conocés).

5. **Subida al campus.** Instrucciones del GPT, los 20 mensajes generados, plan de despliegue. Antes del viernes 20 jun 8:00 PM.

## Rúbrica de evaluación (sobre 10)

| Criterio | Puntos |
|----------|--------|
| GPT configurado con las 5 reglas operativas (tono, longitud, sin tecnicismo, formato) | 3 |
| 20 mensajes generados (5 citas × 4 mensajes) con calidad consistente | 3 |
| Plan de despliegue con métricas y línea base prevista | 2 |
| Validación de tono ecuatoriano sin errores ortográficos | 1 |
| Entrega puntual al campus | 1 |

Aprobación mínima: 7/10.`,

    quiz_json: [
      {
        id: 'q1',
        question: '¿Cuál es la tasa típica de no-shows en clínicas privadas pequeñas y medianas de Ecuador?',
        options: {
          a: '1-2%.',
          b: '15-25%.',
          c: '50-60%.',
          d: '90-100%.',
        },
        correct: 'b',
        rationale: 'Reducir esto a 5-10% con IA es ahorro directo a la rentabilidad institucional sin marketing adicional.',
      },
      {
        id: 'q2',
        question: '¿Cuáles son los 4 frentes donde la IA cambia la gestión de citas?',
        options: {
          a: 'Cirugía, hospitalización, emergencia, consulta.',
          b: 'Confirmación inteligente, recordatorios escalonados, reagendamiento inteligente, encuesta post-consulta automática.',
          c: 'Marketing, ventas, RRHH, finanzas.',
          d: 'Mañana, tarde, noche, madrugada.',
        },
        correct: 'b',
        rationale: 'Estos 4 frentes cubren el ciclo completo de gestión de una cita desde programación hasta evaluación de satisfacción.',
      },
      {
        id: 'q3',
        question: '¿Cuál es la reducción reportada de no-shows con recordatorios escalonados (48h + 24h + 2h)?',
        options: {
          a: '25-40%.',
          b: '0-5%.',
          c: '100% siempre.',
          d: 'Aumenta los no-shows.',
        },
        correct: 'a',
        rationale: 'Cada recordatorio con tono distinto (informativo, invitante, confirmatorio) baja la tasa de ausentismo significativamente.',
      },
      {
        id: 'q4',
        question: '¿Cuál es el cuidado importante con el envío automatizado de WhatsApp masivo?',
        options: {
          a: 'No hay cuidado, se envía libremente.',
          b: 'Meta restringe envíos masivos: hasta 100 mensajes diarios desde WhatsApp Business con plantillas pre-aprobadas; volumen mayor requiere API con proveedor verificado.',
          c: 'Solo se puede enviar los lunes.',
          d: 'Solo se puede enviar a pacientes mayores de edad.',
        },
        correct: 'b',
        rationale: 'El cumplimiento de las políticas de Meta evita que el número institucional sea baneado o restringido.',
      },
      {
        id: 'q5',
        question: 'Para una clínica con 50-100 citas mensuales, ¿cuál es el ROI esperado del flujo de gestión de citas con IA?',
        options: {
          a: 'No hay ROI.',
          b: '5-10 horas semanales recuperadas + USD 200-300 adicionales mensuales por no-shows evitados + mayor satisfacción del paciente.',
          c: 'USD 100,000 mensuales adicionales.',
          d: 'Solo ROI emocional.',
        },
        correct: 'b',
        rationale: 'La combinación de ahorro de tiempo y recuperación de ingresos por no-shows evitados hace que el flujo se pague solo en la primera semana.',
      },
    ],

    resources_json: [
      { title: 'WhatsApp Business — políticas oficiales de mensajería', url: 'https://business.whatsapp.com', type: 'normativa' },
      { title: 'Google Calendar API — documentación de integración', url: 'https://developers.google.com/calendar/api/guides/overview', type: 'documentacion' },
      { title: 'Twilio WhatsApp Business API (proveedor verificado)', url: 'https://www.twilio.com/whatsapp', type: 'producto' },
      { title: 'ITSEIA — Plantilla GPT Gestor de Agenda (instrucciones permanentes)', url: 'https://tecnologico.itseia.ai/cursos-pro/admin-salud/recursos', type: 'plantilla' },
      { title: 'Caso ImagemIA — reducción de inasistencias en imagenología (público)', url: 'https://imagemia.com', type: 'caso' },
    ],

    ailab_config_json: {
      suggested_prompt: `[GPT Personalizado: Gestor de Agenda Clínica-Ecuador]

ROL: Coordinadora senior de agenda clínica con 15 años de experiencia en clínicas privadas ecuatorianas. Conocedora de las prácticas de comunicación con paciente en Quito, Riobamba y otras ciudades de Ecuador.

CONTEXTO: Soy administrativa de agenda en clínica privada. Te paso datos de una cita programada (paciente anonimizado con regla de pluralización, fecha, hora, profesional, motivo de consulta, indicaciones específicas).

TAREA — Devolveme estos 4 mensajes en español ecuatoriano profesional cercano:

1. CONFIRMACIÓN INICIAL (al programar la cita): saludo cordial, datos de la cita, indicaciones especiales (ayuno, documentos a traer), opciones de respuesta breve.

2. RECORDATORIO 24H ANTES: tono invitante, recordatorio cordial con datos clave.

3. RECORDATORIO 2H ANTES: confirmación final, dirección con link Google Maps si aplica, contacto rápido si requiere reagendar.

4. ENCUESTA POST-CONSULTA (24h después): 5 preguntas cortas (atención del profesional, tiempo de espera, claridad de indicaciones, ambiente del consultorio, recomendación 1-10) + agradecimiento.

REGLAS:
- Máximo 80 palabras por mensaje.
- Sin tecnicismos médicos innecesarios.
- Nunca incluir nombre del paciente identificable en plantilla genérica.
- Tono ecuatoriano cercano pero profesional (no "tú", usar "usted" si es paciente adulto).`,
      context: 'Sesión 4 (Parte 1 del Módulo 3) — Gestión de citas y agenda clínica con IA. Reducción de no-shows del 15-25% al 5-10% con flujo automatizado de confirmación + recordatorios + encuesta.',
      model_recommendation: 'ChatGPT 5.5 con GPT personalizado Gestor de Agenda. Para integración con Google Calendar usar Make (Integromat) o Zapier desde la sesión 5.',
    },
  },

  // ------------------------------------------------------------
  // SESIÓN 5 — Gestión Hospitalaria — Cierre M3 (M3, 120min)
  // ------------------------------------------------------------
  {
    num: 5,
    theory_md: `# Sesión 5 — Documentación administrativa + Chatbots + NotebookLM (Cierre M3)

## Los 4 tipos de documentación administrativa hospitalaria recurrente

La administración hospitalaria genera 4 tipos de documentación recurrente que ocupan horas semanales sin IA y minutos con GPTs especializados: **Tipo 1 — Oficios formales** (comunicación con MSP, MDT, SRI, otras instituciones). Estructura ecuatoriana estándar: encabezado institucional, número de oficio, asunto, contenido formal, cierre, firma. **Tipo 2 — Certificados administrativos no clínicos**: certificados de atención, constancias de hospitalización, constancias de procedimiento realizado. **Tipo 3 — Cartas a aseguradoras**: reclamos de glosa, solicitudes de autorización previa, respuestas a observaciones de auditoría médica de Salud S.A., Ecuasanitas o Saludsa. **Tipo 4 — Informes a coordinación o gerencia**: síntesis ejecutiva semanal o mensual.

## Chatbots no-code: montar un asistente de turnos en una tarde

Hace 5 años, montar un chatbot de turnos requería contratar a un programador. Hoy se monta sin código en una tarde con plataformas como ManyChat, WATI o Chatfuel (USD 15-40 mensuales según volumen), Make o Zapier para automatización general (USD 9-30 mensuales), o Voiceflow/Botpress para flujos complejos. Para Gisela y Josselin, la recomendación es empezar con ManyChat o WATI por simplicidad. El flujo típico de un chatbot de turnos hospitalario: paciente saluda al WhatsApp institucional, bot responde con menú (pedir cita, confirmar, reagendar, cancelar, FAQs, hablar con persona), si elige pedir cita consulta agenda y propone 3 horarios, si elige FAQs responde preguntas frecuentes (horarios, dirección, parqueo, formas de pago, preparación para examen), si no encuentra respuesta deriva a humano.

## El KPI principal del chatbot

La administrativa que monta y opera el chatbot monitorea semanalmente: **porcentaje de conversaciones resueltas por el bot sin intervención humana** (KPI principal: 60-75% es excelente para clínica pequeña-mediana), tiempo promedio de resolución, tasa de derivación a humano, satisfacción del paciente con el bot (con 1 pregunta al cierre). Una nota crítica de cumplimiento LOPDP: el chatbot toca datos sensibles. La política de privacidad del bot debe declarar uso de datos al inicio de la conversación. El paciente debe poder pedir derivación a humano en cualquier momento. Los logs del bot se borran después de N días según política institucional.

## NotebookLM como manual hospitalario consultable: cero alucinación

NotebookLM (Google, gratuito; Plus incluido en Google AI Pro USD 19.99 mensuales) convierte un conjunto de documentos en una fuente conversacional. Cargás PDFs, links, notas y videos, y podés chatear con esos documentos como si fueran una sola enciclopedia hospitalaria. Lo crítico: NotebookLM responde basándose únicamente en los documentos cargados, no en su entrenamiento general. Esto reduce drásticamente las alucinaciones porque la fuente es verificable y citada. El manual hospitalario recomendado se construye con 5 grupos de fuentes: regulatorios SRI/IESS/MSP/ARCSA, reglamentos internos de la institución, tarifarios y catálogos (tarifario MSP, CIE-10), NIIF aplicables a entidades de salud privada y protocolos administrativos específicos.

## Compliance LOPDP aplicado al rol completo

LOPDP-Ecuador no es un curso aparte. Es cada decisión administrativa del día. Las 5 prácticas operativas que cierran el M3: (1) configuración de privacidad en las 4 cuentas IA (ChatGPT Settings > Data Controls = OFF, Claude Pro ya cumple por política, Gemini en my.activity.google.com = OFF, Copilot M365 tenant institucional cerrado); (2) anonimización en 5 segundos con regla de pluralización; (3) consentimiento para chatbots y encuestas; (4) documentación del uso IA en cada proceso administrativo con la fórmula "documento elaborado con asistencia IA y revisado por [nombre]"; (5) auditoría semanal de 5 documentos generados con IA. Sanciones por violación grave LOPDP alcanzan al 1% de la facturación anual de la institución o hasta USD 200.000 a personas naturales.`,

    exercise_md: `# Ejercicio Sesión 5 — 4 GPTs de documentación + 1 chatbot piloto + NotebookLM completo

## Objetivo
Cerrar el M3 con los 3 activos profesionales: librería de plantillas administrativas, chatbot piloto funcionando y manual hospitalario consultable.

## Pasos

1. **Configurar los 4 GPTs de documentación administrativa** (Oficios, Certificados Administrativos, Cartas a Aseguradoras, Informes a Coordinación). Cada GPT con instrucciones permanentes específicas a su tipo de documento. Probar cada uno con 1 caso real anonimizado de la semana. Total: 4 documentos generados.

2. **Construir un chatbot piloto en ManyChat o WATI** (versión gratuita ambas plataformas tienen plan free). Flujo básico con menú principal (pedir cita, confirmar, reagendar, cancelar, FAQs, hablar con persona) + submenús para cada opción + 10 FAQs más comunes (horarios, dirección, parqueo, formas de pago, preparación para examen, política de devoluciones, contactos de emergencia). No es necesario conectarlo al sistema institucional real para el ejercicio.

3. **Notebook hospitalario completo en NotebookLM** con 10 fuentes prioritarias: 3 regulatorios (Manual del Prestador IESS, Reglamento Facturación Electrónica del SRI, una norma ARCSA), 2 reglamentos internos (con autorización institucional o ficticios), 2 tarifarios (tarifario MSP o CIE-10), 1 NIIF aplicada, 2 protocolos administrativos. Hacer 5 preguntas reales y guardar respuestas con sus citas.

4. **Auditoría LOPDP de la semana.** Configuración de privacidad ON en las 4 cuentas IA con captura. Aplicación de regla de pluralización a 5 textos administrativos reales con antes/después.

5. **Subida al campus.** Instrucciones de los 4 GPTs + 4 documentos generados + captura del flujo del chatbot + captura del notebook con 5 preguntas + 4 capturas de configuración LOPDP + 5 ejemplos de pluralización. Antes del miércoles 25 jun 8:00 PM.

## Rúbrica de evaluación (sobre 10)

| Criterio | Puntos |
|----------|--------|
| 4 GPTs configurados con instrucciones específicas + 4 documentos generados | 3 |
| Chatbot piloto funcional con menú + 10 FAQs | 2 |
| NotebookLM con 10 fuentes + 5 preguntas con citas verificables | 2 |
| Auditoría LOPDP: 4 capturas de privacidad + 5 textos pluralizados | 2 |
| Entrega puntual al campus | 1 |

Aprobación mínima: 7/10. Este ejercicio queda como evidencia profesional concreta para hoja de vida y LinkedIn.`,

    quiz_json: [
      {
        id: 'q1',
        question: '¿Cuáles son los 4 tipos de documentación administrativa hospitalaria más frecuentes?',
        options: {
          a: 'Oficios formales, certificados administrativos no clínicos, cartas a aseguradoras, informes a coordinación o gerencia.',
          b: 'Recetas médicas, historias clínicas, epicrisis, partes operatorios.',
          c: 'Email, WhatsApp, SMS, llamada.',
          d: 'Word, Excel, PowerPoint, PDF.',
        },
        correct: 'a',
        rationale: 'Son los 4 tipos administrativos no clínicos que ocupan horas semanales y se resuelven con GPTs personalizados.',
      },
      {
        id: 'q2',
        question: '¿Cuál es el KPI principal del chatbot de turnos hospitalario y qué porcentaje es excelente?',
        options: {
          a: 'Número de palabras por mensaje; excelente >100.',
          b: 'Porcentaje de conversaciones resueltas por el bot sin intervención humana; 60-75% es excelente para clínica pequeña-mediana.',
          c: 'Cantidad de emojis usados; excelente >50.',
          d: 'Velocidad de Internet; excelente >1Gb.',
        },
        correct: 'b',
        rationale: 'Este KPI mide la verdadera utilidad del bot. Si menos del 60% se resuelve solo, el bot no aporta.',
      },
      {
        id: 'q3',
        question: '¿Cuáles son los 5 grupos de fuentes del manual hospitalario consultable en NotebookLM?',
        options: {
          a: 'Regulatorios SRI/IESS/MSP/ARCSA, reglamentos internos, tarifarios y catálogos, NIIF aplicables, protocolos administrativos específicos.',
          b: 'Periódicos, revistas, libros, podcasts, videos.',
          c: 'Facebook, Instagram, TikTok, LinkedIn, X.',
          d: 'Inglés, español, francés, alemán, portugués.',
        },
        correct: 'a',
        rationale: 'Estos 5 grupos cubren las fuentes regulatorias y operativas que la administrativa consulta a diario.',
      },
      {
        id: 'q4',
        question: '¿Cómo se configura la privacidad en ChatGPT Plus para cumplir LOPDP?',
        options: {
          a: 'Settings > Data Controls > "Improve the model for everyone" = OFF.',
          b: 'Settings > Account > Delete.',
          c: 'Settings > Theme > Dark.',
          d: 'No hace falta configurar nada.',
        },
        correct: 'a',
        rationale: 'Mantenerlo OFF asegura que los datos administrativos no se usen para entrenar el modelo. Es parte de las 5 prácticas operativas LOPDP del M3.',
      },
      {
        id: 'q5',
        question: '¿Cuál es la sanción máxima que enfrenta una persona natural por violación grave LOPDP-Ecuador?',
        options: {
          a: 'Multa de USD 10.',
          b: 'Hasta USD 200.000.',
          c: 'Solo una advertencia verbal.',
          d: 'Cárcel obligatoria.',
        },
        correct: 'b',
        rationale: 'A esto se suma el daño reputacional y la pérdida de empleo, que son irreparables. Las 5 prácticas operativas son el seguro profesional.',
      },
    ],

    resources_json: [
      { title: 'ManyChat — plataforma chatbot WhatsApp (plan gratuito)', url: 'https://manychat.com', type: 'producto' },
      { title: 'WATI — chatbot WhatsApp Business API', url: 'https://www.wati.io', type: 'producto' },
      { title: 'NotebookLM — Google AI', url: 'https://notebooklm.google.com', type: 'herramienta' },
      { title: 'Superintendencia de Protección de Datos del Ecuador — guía oficial', url: 'https://www.gob.ec/spdp', type: 'normativa' },
      { title: 'ITSEIA — Plantillas de los 4 GPTs de documentación (campus)', url: 'https://tecnologico.itseia.ai/cursos-pro/admin-salud/recursos', type: 'plantilla' },
    ],

    ailab_config_json: {
      suggested_prompt: `Según las fuentes cargadas en este notebook hospitalario (regulatorios SRI/IESS/MSP/ARCSA, reglamentos internos, tarifarios, NIIF, protocolos), respondé:

PREGUNTA: [pegar pregunta administrativa concreta, por ejemplo: "Según el Reglamento de Facturación Electrónica del SRI, ¿cuál es el plazo para emitir una nota de crédito por anulación de un procedimiento médico facturado?"]

REGLAS:
- Respondé únicamente con base en las fuentes cargadas.
- Si la información no está en las fuentes, decilo explícitamente y no inventes.
- Citá página específica y nombre del documento fuente.

ESTRUCTURA DE RESPUESTA:
1. Respuesta directa en 3-5 oraciones.
2. Cita exacta de la fuente con página específica.
3. Notas de aplicabilidad: ¿esto aplica para mi institución? ¿desde cuándo?
4. Limitaciones o vacíos en las fuentes cargadas que requieren verificación adicional.`,
      context: 'Sesión 5 (Cierre del Módulo 3) — Documentación administrativa con 4 GPTs, chatbot piloto no-code, NotebookLM como manual hospitalario consultable y compliance LOPDP aplicado a la rutina diaria.',
      model_recommendation: 'NotebookLM para consultas regulatorias con fuente verificable. Claude Sonnet 4.6 para cartas a aseguradoras (Projects por aseguradora). ChatGPT 5.5 para los 4 GPTs de documentación.',
    },
  },

  // ------------------------------------------------------------
  // SESIÓN 6 — Facturación + Tributario — Parte 1 (M4, 60min)
  // ------------------------------------------------------------
  {
    num: 6,
    theory_md: `# Sesión 6 — Facturación médica automatizada al SOAT/IESS/seguros (Parte 1 M4)

## Los 4 convenios principales y sus reglas distintas

La facturación médica en Ecuador opera con 4 convenios principales que tienen reglas distintas: **Convenio 1 — SOAT** (Seguro Obligatorio de Accidentes de Tránsito): facturación por accidente con cobertura por evento, códigos específicos para emergencia, plazos de presentación estrictos. **Convenio 2 — IESS**: convenio de prestación con tarifario nacional, retenciones específicas, plazos. Las glosas frecuentes son por código CIE-10 inadecuado, falta de justificación clínica documentada o falta de orden médica. **Convenio 3 — Seguros privados** (Salud S.A., Ecuasanitas, Saludsa y otros): cada uno con su contrato, tarifario, exclusiones y proceso de autorización previa. Las administrativas que dominan esto son las más valoradas en hospitales privados grandes. **Convenio 4 — Particular**: el paciente paga directo, factura electrónica al SRI con datos del comprador, retenciones SRI según el caso.

## El flujo automatizado de 6 pasos con IA

**Paso 1 — Captura del procedimiento atendido**: datos del paciente (anonimizado para IA), procedimiento realizado, profesional tratante, fecha, monto base. **Paso 2 — Identificación del convenio aplicable**: el GPT Facturador de la sesión 2 identifica si va a SOAT, IESS, seguro privado o particular según los datos. **Paso 3 — Sugerencia de códigos**: CIE-10 (diagnóstico) y CPT o tarifario MSP (procedimiento), siempre con marca \`[VERIFICAR EN TABLA OFICIAL]\`. **Paso 4 — Cálculo de retenciones SRI y monto neto** según el tipo de cliente. **Paso 5 — Validación pre-envío con checklist**: ¿el código CIE-10 está en la lista de cobertura del convenio? ¿el monto coincide con el tarifario? ¿la retención es correcta? ¿la documentación clínica de respaldo está completa? **Paso 6 — Emisión y registro**: la administrativa emite la factura electrónica con firma electrónica institucional. El sistema queda con trazabilidad del uso IA.

## Vic.ai y el equivalente accesible

Vic.ai es una herramienta especializada en automatización de procesamiento de facturas (OCR + IA + reglas configurables + detección de duplicados y anomalías). En Ecuador, la adopción está en etapa temprana, pero hospitales privados grandes ya pilotan. Para Gisela en clínica pequeña-mediana, el equivalente accesible es ChatGPT con upload de imagen (foto de factura escaneada) + GPT Facturador. Para Josselin en su futuro empleo, conocer Vic.ai la posiciona para una oportunidad mejor en hospital grande.

## ROI esperado en facturación: el caso de la clínica que emite 200-400 facturas mensuales

Una clínica que emite 200-400 facturas mensuales implementando este flujo recibe: reducción del 60-70% del tiempo de facturación, reducción de glosas en 30-50% (porque se detectan antes del envío al IESS o seguro), aceleración del cobro al IESS y seguros (porque la facturación llega correcta y sin observaciones). Para una clínica con USD 30.000-50.000 mensuales en facturación, esto se traduce en USD 3.000-7.500 mensuales adicionales de flujo de caja. La administrativa que monta este flujo entrega valor visible y medible.

## Las 3 causas más comunes de glosa del IESS y cómo evitarlas

Las 3 causas más comunes de glosa del IESS son: (1) código CIE-10 inadecuado para el procedimiento facturado (no hay coherencia clínica entre diagnóstico y procedimiento); (2) falta de justificación clínica documentada en la historia (no hay evolución que respalde el procedimiento); (3) falta de orden médica firmada por el profesional tratante (documento ausente o ilegible). El paso 5 del flujo (validación pre-envío con checklist generado por el GPT) detecta estas 3 causas antes de enviar al IESS, evitando el rechazo y el ciclo de reproceso que congela el cobro 30-60 días.`,

    exercise_md: `# Ejercicio Sesión 6 — Flujo de 6 pasos aplicado a 5 facturas reales

## Objetivo
Aplicar el flujo automatizado de facturación al rol real con métricas antes/después.

## Pasos

1. **Selección de 5 facturas reales** de la semana, anonimizadas con regla de pluralización. Mezclá convenios: al menos 1 SOAT, 2 IESS, 1 seguro privado, 1 particular.

2. **Procesamiento con el flujo de 6 pasos** usando el GPT Facturador de la sesión 2. Documentá para cada factura: tiempo invertido en cada paso, código CIE-10 sugerido con verificación contra tabla oficial OMS, código tarifario contra tabla MSP, monto bruto y retenciones SRI calculadas, glosas potenciales detectadas en el paso 5.

3. **Comparativa antes/después**. Para 2 de las 5 facturas, hacé la facturación primero "a la antigua" (manual, sin GPT) y registrá tiempo. Después hacé las mismas con el flujo. Tiempo manual vs tiempo con IA, errores detectados en cada modo, calidad subjetiva 1-10.

4. **Auditoría con IA en el AI Lab.** Tomá 1 de las facturas procesadas y pasala por el prompt del AI Lab de validación previa al envío. ¿La IA detecta riesgos de glosa que vos no viste? ¿Sugiere documentación de respaldo adicional?

5. **Subida al campus.** Tabla comparativa de las 5 facturas con tiempos, códigos sugeridos, glosas detectadas, ahorro estimado mensual proyectado. Antes del viernes 27 jun (cierre del proyecto final).

## Rúbrica de evaluación (sobre 10)

| Criterio | Puntos |
|----------|--------|
| 5 facturas procesadas con flujo de 6 pasos y datos anonimizados | 3 |
| Comparativa cuantitativa antes/después en 2 facturas con tiempo y errores | 3 |
| Auditoría con AI Lab que identifica al menos 2 riesgos de glosa | 2 |
| Cálculo de ahorro mensual proyectado para 200-400 facturas | 1 |
| Entrega puntual al campus | 1 |

Aprobación mínima: 7/10. Este ejercicio es opción válida para el proyecto final del M5.`,

    quiz_json: [
      {
        id: 'q1',
        question: '¿Cuáles son los 4 convenios principales de facturación médica en Ecuador?',
        options: {
          a: 'SOAT, IESS, seguros privados (Salud S.A., Ecuasanitas, Saludsa), particular.',
          b: 'Visa, Mastercard, American Express, Diners.',
          c: 'Quito, Guayaquil, Cuenca, Riobamba.',
          d: 'Enero, abril, julio, octubre.',
        },
        correct: 'a',
        rationale: 'Cada convenio tiene reglas distintas de cobertura, tarifario, retenciones y plazos que la administrativa debe dominar.',
      },
      {
        id: 'q2',
        question: '¿Cuáles son los 6 pasos del flujo automatizado de facturación médica con IA?',
        options: {
          a: 'Sentarse, abrir Excel, escribir, guardar, imprimir, archivar.',
          b: 'Captura del procedimiento, identificación del convenio, sugerencia de códigos CIE-10/CPT, cálculo de retenciones y neto, validación pre-envío con checklist, emisión y registro.',
          c: 'Llamar al médico, consultar al paciente, esperar respuesta, decidir, facturar, cobrar.',
          d: 'No hay flujo definido.',
        },
        correct: 'b',
        rationale: 'Estos 6 pasos cubren el ciclo completo desde el procedimiento atendido hasta la emisión con trazabilidad del uso IA.',
      },
      {
        id: 'q3',
        question: '¿Cuáles son las 3 causas más comunes de glosa del IESS que el paso 5 (validación pre-envío) detecta?',
        options: {
          a: 'Código CIE-10 inadecuado, falta de justificación clínica documentada, falta de orden médica firmada.',
          b: 'Mal humor del auditor, color del papel, tipografía usada.',
          c: 'Hora de envío, día de la semana, fase lunar.',
          d: 'No hay causas comunes, son aleatorias.',
        },
        correct: 'a',
        rationale: 'El checklist del paso 5 generado por el GPT chequea las 3 causas antes de enviar, evitando rechazo y reproceso de 30-60 días.',
      },
      {
        id: 'q4',
        question: 'Para una clínica que emite 200-400 facturas mensuales, ¿cuál es el ROI esperado del flujo?',
        options: {
          a: 'Reducción del 60-70% del tiempo de facturación + reducción de glosas en 30-50% + USD 3.000-7.500 mensuales adicionales de flujo de caja.',
          b: 'Solo ROI emocional.',
          c: 'No hay ROI.',
          d: 'USD 1 mensual adicional.',
        },
        correct: 'a',
        rationale: 'La combinación de tiempo recuperado + cobro acelerado al IESS y seguros + reducción de reproceso por glosas hace que el flujo se pague desde el primer mes.',
      },
      {
        id: 'q5',
        question: '¿Qué es Vic.ai y cuándo se justifica su adopción?',
        options: {
          a: 'Una herramienta especializada en automatización de procesamiento de facturas (OCR + IA + reglas + detección de duplicados); se justifica en hospitales privados grandes con volumen alto.',
          b: 'Un GPT gratuito.',
          c: 'Una red social.',
          d: 'Un sistema operativo.',
        },
        correct: 'a',
        rationale: 'Para clínica pequeña-mediana, el equivalente accesible es ChatGPT con upload de imagen + GPT Facturador. Conocer Vic.ai posiciona para oportunidades mejores.',
      },
    ],

    resources_json: [
      { title: 'Vic.ai — automatización de facturación con IA', url: 'https://www.vic.ai', type: 'producto' },
      { title: 'SRI — Reglamento de facturación electrónica vigente', url: 'https://www.sri.gob.ec', type: 'normativa' },
      { title: 'IESS — Manual del prestador de salud (PDF completo)', url: 'https://www.iess.gob.ec', type: 'normativa' },
      { title: 'Tarifario nacional MSP Ecuador', url: 'https://www.salud.gob.ec', type: 'referencia' },
      { title: 'Tabla CIE-10 oficial OMS — consulta de códigos', url: 'https://icd.who.int', type: 'referencia' },
    ],

    ailab_config_json: {
      suggested_prompt: `Sos auditora senior de facturación médica con 15 años de experiencia en IESS, SOAT y seguros privados ecuatorianos (Salud S.A., Ecuasanitas, Saludsa).

CONTEXTO: Te paso datos de una factura preparada para envío al convenio:
- Procedimiento atendido: [descripción]
- Convenio sugerido: [SOAT/IESS/seguro privado/particular]
- Código CIE-10 propuesto: [código]
- Código tarifario propuesto: [código]
- Monto bruto: USD [X]
- Retenciones SRI calculadas: [X%]
- Monto neto: USD [Y]

TAREA:
1. Validá si el código CIE-10 sugerido es coherente con el procedimiento atendido. Marcá [VERIFICAR EN TABLA OFICIAL OMS].
2. Validá si el código tarifario está vigente y si el monto coincide con tarifario nacional MSP. Marcá [VERIFICAR EN TARIFARIO VIGENTE].
3. Identificá hasta 3 riesgos de glosa específicos del convenio (las 3 causas más comunes: CIE-10 inadecuado, falta justificación clínica, falta orden médica).
4. Sugerí documentación de respaldo que debe acompañar la factura (historia clínica, evolución, orden médica firmada).
5. Devolveme veredicto final: APTA PARA ENVÍO / REVISAR ANTES DE ENVIAR / RECHAZAR Y CORREGIR, con justificación de 3-4 oraciones.

VERIFICACIÓN: Marcá explícitamente qué afirmaciones requieren confirmación en fuente primaria (tarifario, tabla CIE-10, contrato del seguro privado) antes de proceder.`,
      context: 'Sesión 6 (Parte 1 del Módulo 4) — Flujo automatizado de facturación médica con IA al SOAT/IESS/seguros privados ecuatorianos. Detección de glosas antes del envío.',
      model_recommendation: 'ChatGPT 5.5 con GPT Facturador SOAT/IESS/Seguros configurado en la sesión 2. Claude Sonnet 4.6 cuando el caso requiere lectura de contrato largo de seguro privado.',
    },
  },

  // ------------------------------------------------------------
  // SESIÓN 7 — KPIs e indicadores (M4 cierre, 120min)
  // ------------------------------------------------------------
  {
    num: 7,
    theory_md: `# Sesión 7 — Power BI con IA + Perplexity Pro + Elicit (Cierre M4)

## Power BI con IA: el dashboard que la gerencia quería desde hace años

Power BI con IA es la solución que la gerencia hospitalaria viene pidiendo desde hace años: dashboards vivos con KPIs actualizados, narrativa ejecutiva en español ecuatoriano que explica los números, capacidad de preguntar en lenguaje natural sobre los datos. Power BI Desktop es gratuito para Windows. Power BI Pro (USD 14 mensuales) permite compartir dashboards en equipo. Power BI Premium per User (USD 24 mensuales) agrega capacidades de IA avanzadas. Para Gisela y Josselin, empezar con Power BI Desktop (gratis) más Pro (USD 14 mensuales) cubre el 90% del uso individual.

## Las 3 capacidades IA dentro de Power BI que cambian la conversación con gerencia

**Capacidad 1 — Smart Narrative**: genera narrativa ejecutiva automática a partir de los datos del dashboard. Lo que era "la jefa pide que escriba 2 párrafos explicando los gráficos cada mes" se convierte en "Power BI lo hace solo y yo edito". Las narrativas explican tendencias, comparativas y outliers en español. **Capacidad 2 — Q&A en lenguaje natural**: la gerencia puede preguntar al dashboard "¿cuál fue la especialidad con más procedimientos este mes?" o "¿qué convenio tuvo más glosas?" y Power BI responde con gráfico y narrativa. Esto elimina la dependencia de la administrativa para preguntas exploratorias. **Capacidad 3 — Detección automática de insights**: Power BI escanea los datos y resalta los hallazgos más relevantes: especialidad con mayor crecimiento, día con más ausentismo, paciente con más reagendamientos.

## Los 10 KPIs estándar de salud que toda administrativa junior debe poder armar

(1) Número total de procedimientos del mes por especialidad. (2) Tasa de ocupación de consultorios (atendidos / capacidad teórica). (3) Tasa de ausentismo (no-show rate) por especialidad. (4) Tiempo promedio de espera por consulta (desde llegada hasta atención). (5) Facturación emitida vs cobrada vs glosada por convenio. (6) Top 10 diagnósticos CIE-10 del mes. (7) Satisfacción del paciente (de encuestas de la sesión 4) por servicio. (8) Estancia media para hospitalizados. (9) Tasa de readmisión a 30 días. (10) Costo promedio por procedimiento por especialidad. El ejercicio de esta sesión es construir un dashboard piloto con 5 de estos 10 KPIs.

## Perplexity Pro para búsqueda regulatoria SRI/MSP/ARCSA con citas verificables

Perplexity Pro (USD 20 mensuales) es la herramienta de búsqueda con IA que entrega cada respuesta con links a las fuentes originales. A diferencia de ChatGPT que puede inventar la fuente, Perplexity está conectada a la web en tiempo real. Casos donde es la herramienta correcta para una administrativa de salud: búsqueda regulatoria de cambio reciente ("¿Cambió el porcentaje de retención del SRI para servicios médicos en 2026? Citá la resolución oficial"), comparativa de seguros privados, actualización de tarifario MSP. Tiempo: 30 segundos vs 1 hora buscando manualmente en el SRI.

## Elicit para protocolos basados en evidencia académica

Elicit (USD 12 mensuales Pro, plan gratuito disponible) es la herramienta de búsqueda académica con extracción estructurada. Para protocolos administrativos basados en evidencia, es la fuente correcta: estrategias de reducción de no-shows con mejor evidencia publicada, prácticas administrativas que reducen tasa de glosa, intervenciones que elevan satisfacción del paciente sin costo significativo. El flujo combinado en una propuesta administrativa: Perplexity Pro valida el marco regulatorio aplicable (qué dice el SRI, qué exige el MSP), Elicit aporta las mejores prácticas internacionales basadas en evidencia, Claude sintetiza en un protocolo institucional para proponer a la jefa. Resultado: propuesta con respaldo regulatorio + respaldo académico, lista para presentar a gerencia. Esto eleva el perfil profesional de "operativa" a "aporta propuestas estratégicas".`,

    exercise_md: `# Ejercicio Sesión 7 — Dashboard Power BI piloto + 1 propuesta evidence-based para gerencia

## Objetivo
Cerrar el M4 con un dashboard funcional de KPIs hospitalarios y una propuesta de mejora con respaldo regulatorio y de evidencia.

## Pasos

1. **Instalar Power BI Desktop** (gratuito, Windows). Si trabajás en Mac, usar Power BI online o solicitar acceso vía la institución.

2. **Construir dashboard piloto con 5 de los 10 KPIs estándar.** Usar datos sintéticos del campus (se descargan en formato Excel) o datos reales anonimizados de tu institución con autorización. Activar Smart Narrative para la narrativa ejecutiva en español ecuatoriano. Configurar 1 alerta automática de desviación (por ejemplo, alerta si tasa de no-show supera 20% en una especialidad).

3. **Búsqueda regulatoria con Perplexity Pro.** Hacé 3 búsquedas regulatorias reales aplicables a tu rol: una sobre cambio reciente del SRI, una sobre tarifario MSP actualizado, una sobre norma ARCSA aplicable. Guardá las respuestas con links a las fuentes originales.

4. **Búsqueda evidence-based con Elicit.** Hacé 1 búsqueda académica sobre una mejora administrativa que quieras proponer (reducción de no-shows, reducción de glosas, mejora de satisfacción). Filtrá por revisiones sistemáticas y metaanálisis de últimos 5 años. Extraé hallazgos cuantitativos de los 5 papers más relevantes.

5. **Propuesta de 1 página para gerencia** sintetizada en Claude: marco regulatorio (de Perplexity) + evidencia académica (de Elicit) + propuesta institucional adaptada a clínica privada ecuatoriana + ROI estimado. Esta propuesta es activo profesional concreto.

6. **Subida al campus.** Captura del dashboard Power BI con 5 KPIs + Smart Narrative + alerta configurada, 3 búsquedas Perplexity con links, 1 búsqueda Elicit con tabla extraída, propuesta de 1 página. Antes del viernes 27 jun (cierre del proyecto final).

## Rúbrica de evaluación (sobre 10)

| Criterio | Puntos |
|----------|--------|
| Dashboard Power BI con 5 KPIs + Smart Narrative + 1 alerta automática | 4 |
| 3 búsquedas Perplexity Pro con respuestas + links a fuentes oficiales | 2 |
| 1 búsqueda Elicit con tabla de 5 papers y hallazgos cuantitativos | 2 |
| Propuesta de 1 página integrada (regulatorio + evidencia + ROI) | 1 |
| Entrega puntual al campus | 1 |

Aprobación mínima: 7/10. Este dashboard + propuesta es opción válida para el proyecto final del M5.`,

    quiz_json: [
      {
        id: 'q1',
        question: '¿Cuáles son las 3 capacidades IA dentro de Power BI que cambian la conversación con gerencia?',
        options: {
          a: 'Smart Narrative, Q&A en lenguaje natural, detección automática de insights.',
          b: 'Tabla, gráfico, color.',
          c: 'Guardar, imprimir, exportar.',
          d: 'Iniciar sesión, cerrar sesión, reiniciar.',
        },
        correct: 'a',
        rationale: 'Estas 3 capacidades convierten el dashboard estático en una conversación viva entre gerencia y los datos del servicio.',
      },
      {
        id: 'q2',
        question: '¿Qué entrega Perplexity Pro que ChatGPT general no entrega de forma confiable?',
        options: {
          a: 'Cada respuesta con links a las fuentes originales verificables y conexión a la web en tiempo real.',
          b: 'Imágenes generadas.',
          c: 'Música.',
          d: 'Videos.',
        },
        correct: 'a',
        rationale: 'Perplexity está conectada a la web en tiempo real. ChatGPT puede inventar la fuente; Perplexity cita el link oficial del SRI, MSP o ARCSA.',
      },
      {
        id: 'q3',
        question: '¿Qué entrega Elicit que Perplexity no entrega?',
        options: {
          a: 'Búsqueda académica con extracción estructurada de revisiones sistemáticas, metaanálisis y papers cuantitativos.',
          b: 'Recetas de cocina.',
          c: 'Pronóstico del clima.',
          d: 'Resultados deportivos.',
        },
        correct: 'a',
        rationale: 'Elicit es la fuente académica con extracción estructurada de hallazgos, ideal para protocolos administrativos basados en evidencia.',
      },
      {
        id: 'q4',
        question: '¿Cuáles son los 10 KPIs estándar de salud que una administrativa junior debe poder armar?',
        options: {
          a: 'Procedimientos por especialidad, ocupación, no-show rate, tiempo de espera, facturación emitida vs cobrada vs glosada, top 10 CIE-10, satisfacción, estancia media, readmisión 30 días, costo promedio.',
          b: 'Color de paredes, marca de café, número de plantas, temperatura ambiente.',
          c: 'Likes en Facebook, seguidores Instagram, vistas YouTube.',
          d: 'No hay KPIs estándar.',
        },
        correct: 'a',
        rationale: 'Estos 10 KPIs cubren las dimensiones operativa, financiera y de calidad que la gerencia hospitalaria valora.',
      },
      {
        id: 'q5',
        question: '¿Cuál es el flujo combinado Perplexity + Elicit + Claude para una propuesta administrativa con respaldo doble?',
        options: {
          a: 'Perplexity Pro valida marco regulatorio + Elicit aporta evidencia académica + Claude sintetiza en protocolo institucional para gerencia.',
          b: 'Solo Perplexity, sin más.',
          c: 'Solo Elicit, sin más.',
          d: 'No hay flujo combinado.',
        },
        correct: 'a',
        rationale: 'El flujo combinado entrega propuesta con respaldo regulatorio + respaldo académico. Esto eleva el perfil profesional de operativa a estratégica.',
      },
    ],

    resources_json: [
      { title: 'Power BI Desktop (gratuito) — descarga oficial', url: 'https://powerbi.microsoft.com/desktop', type: 'producto' },
      { title: 'Power BI Pro y Premium per User — precios', url: 'https://powerbi.microsoft.com/pricing', type: 'producto' },
      { title: 'Perplexity Pro — búsqueda con citas verificables', url: 'https://www.perplexity.ai/pro', type: 'producto' },
      { title: 'Elicit — búsqueda académica con extracción estructurada', url: 'https://elicit.com', type: 'producto' },
      { title: 'ITSEIA — Datos sintéticos hospitalarios para dashboard piloto (Excel)', url: 'https://tecnologico.itseia.ai/cursos-pro/admin-salud/recursos', type: 'plantilla' },
    ],

    ailab_config_json: {
      suggested_prompt: `Sos consultora senior en BI hospitalaria con experiencia en Power BI aplicado a clínicas privadas ecuatorianas.

CONTEXTO: Soy administrativa junior. Quiero construir mi primer dashboard de KPIs para gerencia con los datos del servicio del mes [mes/año]. Mi clínica tiene [tamaño] y atiende [especialidades].

TAREA:
1. Diseñá la estructura del dashboard: páginas, secciones, navegación.
2. Listá las 5 visualizaciones prioritarias con su tipo (tabla, barras, mapa de calor, línea de tendencia, KPI card).
3. Para cada visualización, indicá los campos de la base que debo usar y la fórmula DAX si requiere cálculo.
4. Sugerí 3 alertas automáticas de desviación importantes (por ejemplo, no-show >20%, tiempo de espera >45 min, glosas >10%).
5. Diseñá la narrativa ejecutiva que Smart Narrative debe generar al inicio del dashboard (en español ecuatoriano profesional).
6. Plan de actualización mensual con preguntas tipo Q&A que la gerencia hará.

VERIFICACIÓN: Si alguna fórmula DAX o referencia depende de versión específica de Power BI, marcalo con [VERIFICAR EN VERSIÓN VIGENTE].`,
      context: 'Sesión 7 (Cierre del Módulo 4) — Power BI con IA para KPIs hospitalarios + Perplexity Pro para regulatorio SRI/MSP/ARCSA + Elicit para evidencia académica. Construcción de propuesta administrativa con respaldo doble.',
      model_recommendation: 'Power BI Desktop con Smart Narrative para construir dashboard. Perplexity Pro para regulatorio. Elicit Pro para evidencia. Claude Sonnet 4.6 para sintetizar la propuesta final.',
    },
  },

  // ------------------------------------------------------------
  // SESIÓN 8 — Proyecto Final con Héctor (M5, 60min) — sesión de cierre
  // ------------------------------------------------------------
  {
    num: 8,
    theory_md: `# Sesión 8 — Cierre del Curso Express con Héctor Velasco

## La sesión 8 es presencial vía Google Meet del campus

Esta sesión es la sesión de cierre del Curso Profesional Express IA Aplicada a Administración del Área de Salud. Se transmite vía Google Meet del campus el viernes 27 de junio a las 20:00 EC. Las 2 alumnas matriculadas (Gisela Inca y Josselin Montero) deben conectarse puntuales a las 19:55 EC. Tiene 4 bloques de aproximadamente 15 minutos cada uno (sesión total 60 minutos) más extensión flexible para asesoría 1:1.

## Bloque 1 — Recorrido de las 4 semanas (15 minutos)

Héctor Velasco hace un recorrido por los 5 módulos cubiertos, resaltando los hitos del aprendizaje colectivo: M1 fundamentos + LOPDP, M2 stack profesional ChatGPT + Claude + Copilot, M3 gestión hospitalaria con GPTs de documentación + chatbot piloto + NotebookLM, M4 facturación + tributario + KPIs en Power BI + Perplexity + Elicit, M5 proyecto final aplicado al rol real. Las 2 alumnas comparten brevemente la transformación profesional percibida durante las 4 semanas: qué saben hacer ahora que antes no, qué herramientas integraron a la rutina diaria, qué temor inicial superaron.

## Bloque 2 — Presentaciones de los proyectos finales (15 minutos)

Las 2 alumnas presentan 5-7 minutos cada una su proyecto final integrador (opción A facturación automatizada, opción B dashboard Power BI, opción C análisis de costeo, opción D chatbot piloto). Estructura de presentación: contexto del rol, opción elegida, línea base sin IA, metodología aplicada, resultados con las 4 dimensiones (tiempo, calidad, volumen, ROI), conclusiones y propuesta de escalamiento institucional. Héctor y la compañera hacen preguntas y feedback constructivo. Esta práctica de comunicación ejecutiva es valiosa profesionalmente.

## Bloque 3 — Asesoría 1:1 con Héctor — la hora del fundador (15 minutos cada una)

Cada alumna tiene 15 minutos de asesoría privada con Héctor Velasco como parte de esta sesión, y otros 15-30 minutos quedan agendados para las primeras 2 semanas post-Express. En esta primera asesoría, Héctor revisa el proyecto final, da feedback estratégico para la carrera de la alumna, identifica oportunidades de próximo paso (nueva certificación, próximo curso Profesional Estándar $197 o Completo $297, carrera de tercer nivel en IA de ITSEIA, oportunidad B2B con su institución, ajustes para perfil LinkedIn). Para Gisela: cómo posicionarse para coordinación administrativa o consultoría externa. Para Josselin: cómo presentar el certificado y el proyecto al postular a primer empleo formal al graduarse de ESPOCH.

## Bloque 4 — Entrega de credenciales + comunidad ITSEIA Salud (15 minutos)

Héctor entrega digitalmente: certificado MDT del Ministerio del Trabajo del Ecuador a cada alumna que aprobó el proyecto final (todas las que entregaron informe completo con métricas reales aprueban automáticamente); carta de recomendación personalizada firmada por Héctor Velasco como CEO y fundador de ITSEIA. La carta incluye: identificación de la alumna, período del curso (4 al 27 de junio 2026), contenido completado, proyecto final desarrollado y resultados clave en 3 bullets, calificación de desempeño, recomendación para futuros empleadores. Las 2 alumnas son sumadas a la comunidad WhatsApp de egresadas ITSEIA Salud, mantienen acceso al campus por 3 meses (hasta 27 septiembre 2026) y reciben descuento en próximos cursos ITSEIA.

## Cierre emocional con la frase ancla

La sesión cierra con la frase ancla ITSEIA: **"Donde el talento ecuatoriano se vuelve la Inteligencia Artificial que las empresas necesitan."** Y la frase de generación: **"Y tú eres la generación que la hace real."** Estas son las frases que las 2 alumnas pueden citar en LinkedIn, en hoja de vida y en su próxima conversación con un empleador o coordinadora.`,

    exercise_md: `# Ejercicio Sesión 8 — Entregable final + presentación de cierre

## Objetivo
Cerrar el Curso Express con un entregable profesional completo y una presentación a Héctor de 5-7 minutos.

## Pasos

1. **Informe ejecutivo del proyecto final (5-8 páginas).** Estructura obligatoria:
   - Portada con título, autora, cohorte (junio 2026), fecha.
   - Resumen ejecutivo en 1 página.
   - Contexto: institución, rol, opción de proyecto elegida (A/B/C/D).
   - Línea base sin IA (con tabla de métricas iniciales).
   - Metodología aplicada (herramientas, GPTs configurados, flujo de pasos).
   - Resultados con IA: 4 tablas comparativas (tiempo, calidad, volumen, ROI) y 4 gráficos.
   - Conclusiones: 3 conclusiones accionables.
   - Propuesta de escalamiento institucional.
   - Anexos: prompts usados, capturas, evidencia.

2. **Carta de implementación para gerencia (1 página).** Dirigida a tu jefa, coordinadora o gerente (opcional para Josselin como estudiante; recomendada para Gisela). Estructura: contexto del Express ITSEIA, proyecto realizado, resultados clave en 5 bullets, propuesta de adopción institucional, costo del stack y ROI esperado, próximo paso solicitado.

3. **Plan de continuidad post-Express (1 página).** Hábito diario de uso de los GPTs configurados, rutina semanal de aplicación, mantenimiento mensual del NotebookLM y del stack, métricas a seguir registrando, próximo proyecto a implementar.

4. **Presentación de 5-7 minutos para la sesión de cierre.** Slides en Gamma o PowerPoint (5-7 slides): portada, contexto, línea base, metodología, resultados con números, conclusiones, próximo paso. Practicá la presentación una vez en voz alta antes del viernes 27 jun.

5. **Conexión puntual a Google Meet del campus.** Viernes 27 jun, 19:55 EC. Cámara prendida, micrófono claro, conexión a Internet estable.

## Rúbrica de evaluación (sobre 10)

| Criterio | Puntos |
|----------|--------|
| Informe ejecutivo 5-8 páginas con estructura completa y 4 tablas comparativas | 4 |
| Carta de implementación para gerencia (Gisela) o reflexión profesional (Josselin) | 2 |
| Plan de continuidad post-Express con rutinas y métricas | 2 |
| Presentación 5-7 minutos clara, profesional, dentro del tiempo | 1 |
| Asistencia y participación activa en la sesión de cierre | 1 |

Aprobación del Express: 7/10. Quien apruebe recibe certificado MDT + carta de recomendación firmada por Héctor + acceso al campus 3 meses + comunidad ITSEIA Salud.`,

    quiz_json: [
      {
        id: 'q1',
        question: '¿Cuáles son los 4 bloques de la sesión de cierre del viernes 27 jun?',
        options: {
          a: 'Recorrido de las 4 semanas, presentaciones de proyectos finales, asesoría 1:1 con Héctor, entrega de credenciales y comunidad.',
          b: 'Desayuno, almuerzo, merienda, cena.',
          c: 'Inglés, matemática, ciencias, historia.',
          d: 'No hay bloques definidos.',
        },
        correct: 'a',
        rationale: 'La sesión 8 está estructurada para cerrar el aprendizaje, exhibir los proyectos, dar feedback personal y entregar credenciales formales.',
      },
      {
        id: 'q2',
        question: '¿Cuáles son los 3 componentes obligatorios del entregable final del Express?',
        options: {
          a: 'Informe ejecutivo 5-8 páginas, carta de implementación para gerencia, plan de continuidad post-Express.',
          b: 'Selfie, video TikTok, post Instagram.',
          c: 'CV, foto, video.',
          d: 'No hay componentes obligatorios.',
        },
        correct: 'a',
        rationale: 'Estos 3 componentes convierten el aprendizaje en evidencia profesional medible y plan de continuidad que sostiene el ahorro de tiempo.',
      },
      {
        id: 'q3',
        question: '¿Qué credenciales formales recibe cada alumna que aprueba el proyecto final?',
        options: {
          a: 'Certificado MDT del Ministerio del Trabajo del Ecuador + carta de recomendación personalizada firmada por Héctor Velasco como CEO y fundador de ITSEIA.',
          b: 'Diploma de la ONU.',
          c: 'Solo un mensaje de felicitaciones por WhatsApp.',
          d: 'No hay credenciales.',
        },
        correct: 'a',
        rationale: 'El certificado MDT es oficial y la carta firmada por Héctor pesa fuerte en hoja de vida y procesos de promoción interna.',
      },
      {
        id: 'q4',
        question: '¿Qué acceso post-Express reciben las 2 alumnas al aprobar?',
        options: {
          a: 'Acceso al campus tecnologico.itseia.ai por 3 meses + comunidad WhatsApp ITSEIA Salud + descuento en próximos cursos ITSEIA + 1 asesoría adicional con Héctor.',
          b: 'Solo acceso al campus por 1 día.',
          c: 'Acceso ilimitado a Netflix.',
          d: 'No hay acceso post-Express.',
        },
        correct: 'a',
        rationale: 'Los 3 meses + comunidad + asesoría adicional sostienen el aprendizaje y mantienen viva la red profesional construida durante el Express.',
      },
      {
        id: 'q5',
        question: '¿Cuáles son las dos frases ancla con las que cierra la sesión 8 del Express?',
        options: {
          a: '"Donde el talento ecuatoriano se vuelve la Inteligencia Artificial que las empresas necesitan" y "Y tú eres la generación que la hace real".',
          b: '"Buena suerte" y "Que les vaya bien".',
          c: '"Goodbye" y "See you".',
          d: 'No hay frases ancla.',
        },
        correct: 'a',
        rationale: 'Estas son la tagline oficial ITSEIA y la frase de generación. Las alumnas pueden citarlas en LinkedIn, hoja de vida y conversación profesional.',
      },
    ],

    resources_json: [
      { title: 'Campus tecnologico.itseia.ai — acceso 3 meses post-cierre', url: 'https://tecnologico.itseia.ai', type: 'plataforma' },
      { title: 'Comunidad WhatsApp ITSEIA Salud (link al aprobar)', url: 'https://chat.whatsapp.com/itseia-salud', type: 'comunidad' },
      { title: 'Próximos cursos ITSEIA — Profesional Estándar $197 y Completo $297', url: 'https://itseia.ai/cursos', type: 'producto' },
      { title: 'Carrera tercer nivel IA en ITSEIA — siguiente paso formativo', url: 'https://carreras.itseia.ai', type: 'producto' },
      { title: 'Contacto institucional ITSEIA — WhatsApp +593 99 070 9009', url: 'https://wa.me/593990709009', type: 'contacto' },
    ],

    ailab_config_json: {
      suggested_prompt: `Sos coach de transición profesional con experiencia en sector salud Ecuador.

CONTEXTO: Soy egresada del Curso Profesional Express IA Aplicada a Administración del Área de Salud de ITSEIA. Aprobé el proyecto final integrador opción [A/B/C/D]. Tengo certificado MDT + carta de recomendación firmada por Héctor Velasco como CEO de ITSEIA.

TAREA:
1. Diseñame post LinkedIn de 200 palabras para anunciar la finalización del curso, mencionando el certificado MDT, el proyecto final y las herramientas dominadas (ChatGPT 5.5, Claude Sonnet 4.6, Power BI con IA, Perplexity Pro, NotebookLM). Tono profesional cercano ecuatoriano.
2. Sugerí 3 tipos de vacantes donde aplicar mi nuevo perfil (sin nombrar empresas específicas).
3. Construime párrafo para hoja de vida que describa el aprendizaje, las herramientas y el proyecto final con métricas concretas.
4. Plan de aplicación de los siguientes 30 días post-Express: hábito diario, métricas a registrar, próximo activo profesional a construir.
5. Próximo paso de carrera ITSEIA: ¿Curso Profesional Estándar $197? ¿Completo $297? ¿Carrera de tercer nivel en IA? ¿Cuál tiene más sentido para mi rol y momento?

FORMATO: Respuesta estructurada en 5 secciones numeradas, español ecuatoriano profesional, sin emojis innecesarios.`,
      context: 'Sesión 8 (Cierre del Curso Express) — Sesión de cierre con Héctor Velasco. Entrega de certificado MDT + carta de recomendación + acceso al campus 3 meses + comunidad WhatsApp ITSEIA Salud. Asesoría 1:1 con el fundador.',
      model_recommendation: 'Claude Sonnet 4.6 para redacción profesional del post LinkedIn y la carta de presentación. ChatGPT 5.5 para iteraciones rápidas del CV.',
    },
  },
];

// ============================================================
// EJECUCIÓN
// ============================================================

async function getSessionId(num) {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/cursos_pro_sessions?course_id=eq.${COURSE_ID}&num=eq.${num}&select=id,title`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const d = await r.json();
  if (!Array.isArray(d) || d.length === 0) {
    throw new Error(`No se encontró sesión num=${num} para curso ${COURSE_ID}`);
  }
  return { id: d[0].id, title: d[0].title };
}

async function updateSession(sessionId, body) {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/cursos_pro_sessions?id=eq.${sessionId}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    }
  );
  const text = await r.text();
  if (!r.ok) {
    throw new Error(`UPDATE falló (HTTP ${r.status}): ${text}`);
  }
  return JSON.parse(text);
}

async function main() {
  console.log(`\n=== Carga de contenido curso admin-salud (${COURSE_ID}) ===`);
  console.log(`Sesiones a actualizar: ${sessions.length}\n`);

  const results = [];

  for (const s of sessions) {
    try {
      const { id, title } = await getSessionId(s.num);
      console.log(`-> Sesión ${s.num}: ${title}`);
      console.log(`   id=${id}`);

      const payload = {
        theory_md: s.theory_md,
        exercise_md: s.exercise_md,
        quiz_json: s.quiz_json,
        resources_json: s.resources_json,
        ailab_config_json: s.ailab_config_json,
        // video_url y slides_url quedan en null por ahora (no hay video grabado;
        // Gamma se crea en vivo durante la sesión)
        updated_at: new Date().toISOString(),
      };

      await updateSession(id, payload);

      const sizes = {
        theory_chars: s.theory_md.length,
        exercise_chars: s.exercise_md.length,
        quiz_items: s.quiz_json.length,
        resources_items: s.resources_json.length,
        ailab_keys: Object.keys(s.ailab_config_json).length,
      };

      console.log(
        `   OK | theory=${sizes.theory_chars}ch | exercise=${sizes.exercise_chars}ch | ` +
          `quiz=${sizes.quiz_items} | resources=${sizes.resources_items} | ailab=${sizes.ailab_keys}`
      );

      results.push({ num: s.num, title, ...sizes });
    } catch (err) {
      console.error(`   ERROR en sesión ${s.num}:`, err.message);
      results.push({ num: s.num, error: err.message });
    }
  }

  console.log('\n=== Verificación post-carga ===');
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/cursos_pro_sessions?course_id=eq.${COURSE_ID}&select=num,title,theory_md,exercise_md,quiz_json,resources_json,ailab_config_json&order=num`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const all = await r.json();
  for (const s of all) {
    const ok =
      !!s.theory_md &&
      !!s.exercise_md &&
      Array.isArray(s.quiz_json) &&
      s.quiz_json.length === 5 &&
      Array.isArray(s.resources_json) &&
      s.resources_json.length >= 3 &&
      s.ailab_config_json &&
      typeof s.ailab_config_json === 'object' &&
      Object.keys(s.ailab_config_json).length > 0;
    console.log(
      `   Sesión ${s.num} ${ok ? 'OK' : 'INCOMPLETA'}: ${s.title} | ` +
        `theory=${s.theory_md ? 'sí' : 'no'} exercise=${s.exercise_md ? 'sí' : 'no'} ` +
        `quiz=${(s.quiz_json || []).length} resources=${(s.resources_json || []).length}`
    );
  }

  console.log('\n=== Resumen final ===');
  console.table(results);
  console.log('\nLISTO. Contenido cargado en cursos_pro_sessions.');
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
