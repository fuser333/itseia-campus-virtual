#!/usr/bin/env node
/**
 * quizzes_express_remaining.js
 * ─────────────────────────────────────────────────────────────────
 * Creates quizzes for the 7 sessions of "Curso Express: IA para
 * Profesionales" that still have no quiz after complete_curso_express.js.
 *
 * Target sessions (subject code → topic):
 *   CONT-T03  Seguridad y Privacidad de Datos Financieros
 *   CONT-T04  Evaluacion Critica de Resultados de IA (Contadores)
 *   CONT-F03  Excel + IA: Copilot y Automatizacion
 *   MED-S02   Documentacion Clinica Automatizada
 *   MED-S04   Analisis de Imagenes Medicas con IA
 *   JUR-T03   Seguridad y Confidencialidad de Datos
 *   JUR-J02   Redaccion y Revision de Contratos con IA
 *
 * Run:  node content/quizzes_express_remaining.js
 */

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';

const H  = { apikey: SKEY, Authorization: 'Bearer ' + SKEY, 'Content-Type': 'application/json', Prefer: 'return=representation' };
const Hm = { apikey: SKEY, Authorization: 'Bearer ' + SKEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' };

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

function opts(a, b, c, d, correct) {
  return JSON.stringify([
    { id: 'a', text: a, is_correct: correct === 'a' },
    { id: 'b', text: b, is_correct: correct === 'b' },
    { id: 'c', text: c, is_correct: correct === 'c' },
    { id: 'd', text: d, is_correct: correct === 'd' },
  ]);
}

async function get(path) {
  const r = await fetch(BASE + path, { headers: H });
  const data = await r.json();
  if (r.status >= 400) throw new Error(`GET ${path} -> ${r.status}: ${JSON.stringify(data).substring(0, 300)}`);
  return data;
}

async function post(table, body) {
  const r = await fetch(`${BASE}/${table}`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (r.status !== 201) throw new Error(`POST ${table} -> ${r.status}: ${JSON.stringify(data).substring(0, 300)}`);
  return Array.isArray(data) ? data[0] : data;
}

async function postMin(table, body) {
  const r = await fetch(`${BASE}/${table}`, {
    method: 'POST',
    headers: Hm,
    body: JSON.stringify(body),
  });
  if (r.status !== 201) {
    const t = await r.text();
    throw new Error(`POST ${table} -> ${r.status}: ${t.substring(0, 300)}`);
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─────────────────────────────────────────────────────────────────
// QUIZ DEFINITIONS — 7 missing sessions, 5 questions each
// options field is a JSON STRING (required by DB schema)
// ─────────────────────────────────────────────────────────────────

const QUIZ_MAP = {

  // ══════════════════════════════════════════════════════════════
  // CONTADORES
  // ══════════════════════════════════════════════════════════════

  'CONT-T03': {
    title: 'Quiz: Seguridad y Privacidad de Datos Financieros',
    questions: [
      {
        q: '¿Qué riesgo principal existe al ingresar datos financieros reales de clientes en ChatGPT versión gratuita?',
        o: opts(
          'Que la respuesta sea demasiado larga',
          'Que OpenAI use esos datos para entrenar futuros modelos y se expongan a terceros',
          'Que la IA no entienda los números',
          'Que la sesión expire y se pierdan los datos'
        ),
        exp: 'En el plan gratuito de ChatGPT, las conversaciones pueden usarse para entrenamiento. Nunca ingreses datos reales de clientes sin desactivar el historial o usar planes empresariales.'
      },
      {
        q: '¿Cuál es la solución correcta para usar IA con información financiera sensible?',
        o: opts(
          'Usar cualquier IA pública sin restricciones',
          'Anonimizar o generalizar los datos antes de procesarlos con IA, o usar planes enterprise con garantías contractuales',
          'Solo usar IA para cálculos simples sin datos reales',
          'Publicar los datos en foros de contabilidad antes de usar la IA'
        ),
        exp: 'La anonimización (reemplazar nombres y RUC por "Empresa X") y los planes enterprise (ChatGPT Team, Claude for Work) son las dos vías seguras.'
      },
      {
        q: 'En Ecuador, ¿qué normativa obliga al contador a proteger los datos financieros de sus clientes?',
        o: opts(
          'Solo el Código de Trabajo',
          'La LOPDP (Ley Orgánica de Protección de Datos Personales) y el Código de Ética del Contador',
          'Únicamente el Código Tributario',
          'No existe normativa específica en Ecuador'
        ),
        exp: 'La LOPDP establece obligaciones de protección de datos para cualquier tratamiento, incluido el uso de herramientas de IA. El Código de Ética del Contador añade el deber de confidencialidad profesional.'
      },
      {
        q: '¿Qué significa "cifrado en tránsito" en el contexto de herramientas de IA?',
        o: opts(
          'Que los datos se cifran cuando el contador viaja con su laptop',
          'Que la comunicación entre tu dispositivo y el servidor de la IA usa HTTPS/TLS para proteger los datos',
          'Un tipo de compresión de archivos Excel',
          'Que la IA solo responde de noche'
        ),
        exp: 'El cifrado TLS/HTTPS protege los datos mientras viajan por internet. Es el mínimo estándar de cualquier herramienta profesional de IA.'
      },
      {
        q: '¿Cuál de estas prácticas representa el mayor riesgo de seguridad al usar IA para contabilidad?',
        o: opts(
          'Usar la IA para generar plantillas de reportes genéricas',
          'Copiar y pegar un balance con nombres reales, RUC y valores en un chat de IA público no empresarial',
          'Pedirle a la IA que explique un concepto NIIF',
          'Usar la IA para redactar un correo interno sobre procedimientos'
        ),
        exp: 'Compartir datos identificables (RUC, nombre empresa, cifras reales) en IA pública viola la LOPDP y el secreto profesional. Siempre anonimiza primero.'
      },
    ]
  },

  'CONT-T04': {
    title: 'Quiz: Evaluacion Critica de Resultados de IA',
    questions: [
      {
        q: '¿Qué es una "alucinacion" de la IA en un contexto contable?',
        o: opts(
          'Cuando la IA responde muy rapido sin pensar',
          'Cuando la IA genera cifras, articulos tributarios o normativa que parecen reales pero son inventados',
          'Cuando la IA no puede conectarse a internet',
          'Cuando la IA usa terminologia en ingles'
        ),
        exp: 'Las alucinaciones son el mayor riesgo para el contador: la IA puede inventar articulos del Codigo Tributario, tasas impositivas o referencias NIIF completamente falsas.'
      },
      {
        q: '¿Cuál es el criterio correcto para aceptar un calculo financiero generado por IA?',
        o: opts(
          'Si la IA lo expresa con seguridad, está correcto',
          'Solo si el resultado ha sido verificado contra los datos fuente y la normativa vigente',
          'Si el calculo tiene mas de 3 decimales, es preciso',
          'Si la respuesta llego en menos de 5 segundos'
        ),
        exp: 'La IA puede equivocarse incluso con seguridad aparente. Todo calculo critico debe conciliarse con los documentos fuente y la normativa oficial del SRI o la SCVS.'
      },
      {
        q: 'Al recibir un analisis de variacion presupuestaria generado por IA, ¿que verificas primero?',
        o: opts(
          'Que el formato sea estetico y bien presentado',
          'Que las cifras base correspondan exactamente a los datos del sistema contable y el periodo es correcto',
          'Que use colores corporativos',
          'Que la respuesta sea larga y detallada'
        ),
        exp: 'Las cifras base son el punto critico: si la IA trabajo con datos incorrectos o del periodo equivocado, todo el analisis es invalido.'
      },
      {
        q: '¿Que tecnica ayuda a reducir alucinaciones al pedirle a la IA analisis tributarios?',
        o: opts(
          'Escribir el prompt en mayusculas',
          'Pegar el texto del articulo tributario relevante directamente en el prompt para que la IA trabaje sobre el texto real',
          'Usar el plan de pago mas caro',
          'Repetir la pregunta cinco veces'
        ),
        exp: 'Proporcionar el texto normativo real (pegar el articulo del Codigo Tributario o la NIIF) en el prompt ancla a la IA en la realidad y elimina la necesidad de que "recuerde" articulos.'
      },
      {
        q: '¿Cuando es obligatorio que un contador revise personalmente el output de la IA antes de firmar un documento?',
        o: opts(
          'Solo cuando el cliente lo solicita explicitamente',
          'Siempre: el contador es el responsable legal y profesional de cualquier documento que firma, independientemente de si uso IA',
          'Solo en declaraciones al SRI, no en reportes internos',
          'Solo si el monto supera $10.000'
        ),
        exp: 'El Codigo de Etica del Contador y la normativa ecuatoriana establecen que la responsabilidad profesional es irrenunciable. La IA es una herramienta, no el responsable.'
      },
    ]
  },

  'CONT-F03': {
    title: 'Quiz: Excel + IA — Copilot y Automatizacion',
    questions: [
      {
        q: '¿Qué es Microsoft Copilot en Excel y qué requiere para funcionar?',
        o: opts(
          'Un add-in gratuito para cualquier version de Excel',
          'Una IA integrada en Microsoft 365 que requiere suscripcion Microsoft 365 Business o superior',
          'Un plugin de terceros sin costo',
          'Una funcion nueva de Excel disponible desde Excel 2010'
        ),
        exp: 'Copilot en Excel es parte de Microsoft 365 Copilot, disponible en planes Business Standard o superior. Requiere suscripcion activa y datos en formato de tabla.'
      },
      {
        q: '¿Cuál es la forma correcta de preparar datos en Excel para que Copilot funcione mejor?',
        o: opts(
          'Datos en celdas sueltas sin estructura definida',
          'Datos organizados en tablas con encabezados claros (Ctrl+T para convertir en tabla oficial de Excel)',
          'Combinar celdas para que se vea mas ordenado',
          'Guardar el archivo en formato .xls antiguo'
        ),
        exp: 'Copilot trabaja sobre tablas estructuradas de Excel. Encabezados descriptivos y datos limpios en formato tabla son el requisito basico para obtener buenos resultados.'
      },
      {
        q: '¿Para qué tarea contable especifica es más util Copilot en Excel hoy?',
        o: opts(
          'Para firmar digitalmente declaraciones al SRI',
          'Para generar formulas complejas, crear tablas dinamicas y resumir datos con lenguaje natural',
          'Para acceder directamente al sistema de la SCVS',
          'Para reemplazar al software contable (Monica, Safi, etc.)'
        ),
        exp: 'Copilot sobresale en generacion de formulas (incluyendo BUSCARV, SUMAR.SI, etc.), tablas dinamicas y analisis de datos mediante preguntas en lenguaje natural.'
      },
      {
        q: '¿Qué alternativa gratuita permite usar IA con Excel sin pagar Microsoft 365 Copilot?',
        o: opts(
          'No existe ninguna alternativa',
          'Exportar datos anonimizados a CSV y analizarlos con ChatGPT o Claude pegando el contenido en el chat',
          'Usar Google Maps para analizar datos',
          'Esperar a que Microsoft lo haga gratuito en 2027'
        ),
        exp: 'Exportar el CSV con datos anonimizados y pegarlo en ChatGPT o Claude es una alternativa efectiva y gratuita para analisis y generacion de formulas complejas.'
      },
      {
        q: '¿Qué limitacion importante tiene Copilot en Excel respecto a normativa contable ecuatoriana?',
        o: opts(
          'No puede leer numeros con decimales',
          'No conoce automaticamente las tasas del SRI, codigos de formularios 104 o 101, ni normativa NIIF-PYMES ecuatoriana sin que se le proporcione el contexto',
          'Solo funciona con datos en dolares estadounidenses',
          'No puede crear graficos'
        ),
        exp: 'Copilot es un modelo de lenguaje generico; para aplicaciones tributarias ecuatorianas debes proporcionarle el contexto normativo o usar prompts especificos con la informacion del SRI.'
      },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // MEDICOS
  // ══════════════════════════════════════════════════════════════

  'MED-S02': {
    title: 'Quiz: Documentacion Clinica Automatizada',
    questions: [
      {
        q: '¿Qué es una nota SOAP automatizada con IA y cual es su principal beneficio?',
        o: opts(
          'Un tipo de antivirus para sistemas hospitalarios',
          'Una nota clinica (Subjetivo-Objetivo-Analisis-Plan) generada por IA a partir de la conversacion con el paciente, reduciendo tiempo de documentacion',
          'Un software de facturacion medica',
          'Un sistema de citas online'
        ),
        exp: 'La IA puede generar notas SOAP estructuradas en segundos a partir de dictado o resumen verbal, liberando al medico de hasta 2 horas diarias de documentacion.'
      },
      {
        q: '¿Qué herramienta de IA esta disenada especificamente para documentacion clinica por voz?',
        o: opts(
          'TikTok para medicos',
          'DAX Copilot (Microsoft) y Nabla: herramientas clinicas que transcriben y estructuran la consulta medica',
          'Google Translate medico',
          'Excel con macros de voz'
        ),
        exp: 'DAX Copilot (integrado con Epic/Dragon) y Nabla son plataformas clinicas especializadas en documentacion SOAP automatizada con cumplimiento HIPAA.'
      },
      {
        q: '¿Qué riesgo etico existe al usar IA para documentar conversaciones con pacientes?',
        o: opts(
          'Que la nota sea demasiado larga',
          'Que el paciente no haya dado consentimiento informado para que su conversacion sea procesada por una plataforma de IA',
          'Que la IA use terminologia muy tecnica',
          'Que la IA no pueda escribir en espanol'
        ),
        exp: 'El consentimiento informado del paciente es obligatorio antes de usar cualquier IA que procese datos de la consulta. Esto protege al medico y respeta la autonomia del paciente.'
      },
      {
        q: '¿Como debe validar el medico una nota SOAP generada por IA antes de incluirla en la historia clinica?',
        o: opts(
          'Firmarla directamente para ahorrar tiempo',
          'Revisarla completamente: verificar que los datos subjetivos, hallazgos objetivos, diagnostico y plan correspondan exactamente a lo ocurrido en la consulta',
          'Solo revisar el diagnostico final',
          'Pedirle al paciente que la revise'
        ),
        exp: 'El medico es el responsable legal y clinico de la historia. La nota generada por IA es un borrador; la revision completa antes de la firma es irrenunciable.'
      },
      {
        q: '¿Que informacion NO debe incluirse al enviar datos de consulta a una IA publica sin cuenta empresarial?',
        o: opts(
          'El tipo de sintoma de forma generica',
          'Nombre completo, cedula, fecha de nacimiento, diagnostico especifico y cualquier dato que identifique al paciente',
          'La especializacion medica del doctor',
          'El tipo de consulta (primera vez o seguimiento)'
        ),
        exp: 'Los datos de salud son datos sensibles bajo la LOPDP. Enviar informacion identificable del paciente a IA publica viola la normativa y el secreto medico.'
      },
    ]
  },

  'MED-S04': {
    title: 'Quiz: Analisis de Imagenes Medicas con IA',
    questions: [
      {
        q: '¿Que tipo de IA se usa especificamente para analizar imagenes medicas (radiografias, TAC, resonancias)?',
        o: opts(
          'Modelos de lenguaje (LLM) como ChatGPT',
          'Redes neuronales convolucionales (CNN) entrenadas en millones de imagenes medicas anotadas',
          'Hojas de calculo con macros visuales',
          'Camaras de alta resolucion sin procesamiento'
        ),
        exp: 'Las CNN son la arquitectura dominante en vision por computadora medica. Modelos como CheXNet (radiologia) usan CNN entrenadas en grandes datasets de imagenes clinicas.'
      },
      {
        q: '¿En qué especialidad medica ha demostrado mayor precision la IA en analisis de imagenes?',
        o: opts(
          'Psiquiatria',
          'Oftalmologia (retinopatia diabetica) y radiologia (deteccion de nodulos pulmonares y cancer de mama)',
          'Odontologia estetica',
          'Medicina general sin imagen'
        ),
        exp: 'IA para retinopatia diabetica (Google DeepMind) y nodulos pulmonares (Lung-RADS con IA) han alcanzado precision equivalente o superior a especialistas en tareas especificas.'
      },
      {
        q: '¿Que significa que una IA de imagenes medicas tenga alta sensibilidad pero baja especificidad?',
        o: opts(
          'Que la IA es rapida pero costosa',
          'Que detecta casi todos los casos positivos reales pero tambien genera muchos falsos positivos (alarmas falsas)',
          'Que solo funciona con imagenes de alta resolucion',
          'Que requiere muchos datos para funcionar'
        ),
        exp: 'Alta sensibilidad = pocos falsos negativos (no se pierde casi ningun caso real). Baja especificidad = muchos falsos positivos. El balance depende del contexto clinico y consecuencias del error.'
      },
      {
        q: '¿Puede el medico en Ecuador usar IA de imagenes como unico criterio diagnostico?',
        o: opts(
          'Si, si la IA tiene certificacion de la FDA',
          'No. La IA es una herramienta de apoyo; el diagnostico final requiere criterio clinico del medico y es su responsabilidad legal',
          'Si, para condiciones de baja gravedad',
          'Solo en telemedicina rural'
        ),
        exp: 'El Codigo de Etica Medica y la normativa del MSP establecen que el medico es el responsable del diagnostico. La IA es apoyo diagnostico, no reemplaza el criterio clinico.'
      },
      {
        q: '¿Qué herramienta de IA multimodal permite analizar imagenes medicas con lenguaje natural hoy?',
        o: opts(
          'Excel con filtros de color',
          'GPT-4o y Gemini 1.5 Pro, que pueden describir hallazgos en imagenes medicas aunque no estan certificados como dispositivos medicos',
          'WhatsApp con stickers medicos',
          'Google Street View medico'
        ),
        exp: 'GPT-4o y Gemini son capaces de analizar imagenes medicas en contexto educativo o de apoyo, pero no estan certificados como dispositivos medicos (no son FDA/CE cleared para diagnostico clinico).'
      },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // ABOGADOS
  // ══════════════════════════════════════════════════════════════

  'JUR-T03': {
    title: 'Quiz: Seguridad y Confidencialidad de Datos en Derecho',
    questions: [
      {
        q: '¿Que obliga el secreto profesional del abogado en relacion al uso de IA?',
        o: opts(
          'Usar solo IA ecuatoriana',
          'No compartir informacion identificable del cliente (nombre, cedula, hechos del caso) con plataformas de IA publica sin garantias contractuales',
          'Documentar todo uso de IA ante el Foro de Abogados',
          'Solo usar IA para comunicaciones internas'
        ),
        exp: 'El Codigo de Etica del Foro de Abogados del Ecuador extiende el deber de confidencialidad al entorno digital. Datos del cliente en IA publica puede constituir violacion del secreto profesional.'
      },
      {
        q: '¿Cual es la diferencia entre ChatGPT gratuito y ChatGPT Enterprise respecto a la confidencialidad?',
        o: opts(
          'Son identicos en politicas de privacidad',
          'Enterprise garantiza contractualmente que los datos no se usan para entrenar modelos y ofrece mayor aislamiento de datos',
          'El gratuito es mas seguro porque no guarda historial',
          'Enterprise solo es util para empresas grandes, no para despachos'
        ),
        exp: 'ChatGPT Enterprise y Team tienen DPA (Data Processing Agreement) que prohibe el uso de los datos para entrenamiento. Critico para despachos que manejan informacion privilegiada.'
      },
      {
        q: '¿Como anonimizas correctamente un expediente antes de analizarlo con IA publica?',
        o: opts(
          'Cambiar el tipo de letra del documento',
          'Reemplazar nombres de partes, cedulas, fechas especificas y cualquier dato identificable por placeholders genericos como "Parte A", "Empresa X", "Fecha 1"',
          'Solo borrar la primera pagina con el nombre',
          'Convertir el PDF a Word antes de subir'
        ),
        exp: 'La anonimizacion efectiva elimina todos los identificadores directos e indirectos. El analisis juridico del fondo del asunto puede hacerse sin revelar quien es el cliente.'
      },
      {
        q: '¿Que establece la LOPDP respecto al tratamiento de datos en herramientas digitales externas?',
        o: opts(
          'Que cualquier uso de herramientas digitales es libre para profesionales',
          'Que el responsable del tratamiento debe garantizar que los encargados externos (incluidas plataformas de IA) cumplan con las obligaciones de proteccion de datos',
          'Que solo aplica a datos de salud, no a datos juridicos',
          'Que los abogados tienen exencion especial en la LOPDP'
        ),
        exp: 'El abogado como responsable del tratamiento debe verificar que las plataformas de IA que usa cumplan con la LOPDP, incluyendo medidas de seguridad y politicas de uso de datos.'
      },
      {
        q: '¿Que debe hacer el abogado si detecta que una IA ha memorizado y podria repetir informacion de un cliente anterior?',
        o: opts(
          'No hacer nada, es responsabilidad de la empresa de IA',
          'Dejar de usar esa sesion, reportarlo al proveedor si aplica, y revisar si hubo violacion al deber de confidencialidad',
          'Solo preocuparse si el cliente se entera',
          'Cambiar el nombre del despacho'
        ),
        exp: 'Los modelos con memoria (como ChatGPT con memoria activada) pueden retener datos entre sesiones. Desactivar la memoria o usar sesiones aisladas es una practica de seguridad obligatoria.'
      },
    ]
  },

  'JUR-J02': {
    title: 'Quiz: Redaccion y Revision de Contratos con IA',
    questions: [
      {
        q: '¿Cual es el uso mas efectivo de la IA en la redaccion inicial de contratos?',
        o: opts(
          'Generar el contrato final listo para firmar sin revision',
          'Crear un borrador estructurado con las clausulas principales que el abogado revisa, adapta y completa segun el caso especifico',
          'Reemplazar al abogado en negociaciones contractuales',
          'Firmar el contrato de forma electronica automatica'
        ),
        exp: 'La IA acelera la creacion del borrador estructural. El abogado aporta el analisis del riesgo especifico, la adaptacion al contexto ecuatoriano y la validacion juridica final.'
      },
      {
        q: '¿Como debe formularse el prompt para que la IA genere un contrato de arrendamiento ecuatoriano?',
        o: opts(
          'Solo: "hazme un contrato de arrendamiento"',
          'Especificando: tipo de contrato, partes (anonimizadas), bien objeto, plazo, valor, normativa aplicable (Codigo Civil ecuatoriano, Ley de Inquilinato) y clausulas especificas requeridas',
          'Pegando un contrato anterior y pidiendo que lo copie',
          'Preguntando primero si la IA conoce el derecho ecuatoriano'
        ),
        exp: 'Un prompt detallado con contexto normativo ecuatoriano produce un borrador mucho mas util y reduce el tiempo de revision del abogado.'
      },
      {
        q: '¿Que clausulas debe revisar con mayor cuidado el abogado en un contrato generado por IA para Ecuador?',
        o: opts(
          'Solo el encabezado y el cierre',
          'Clausulas de resolucion de conflictos (jurisdiccion, arbitraje), penalidades, limitaciones de responsabilidad y referencias a normativa especifica ecuatoriana',
          'Solo las clausulas de precio',
          'Solo la firma y el lugar de firma'
        ),
        exp: 'La IA puede usar clausulas de arbitraje internacionales no aplicables en Ecuador, o referenciar normativa derogada. Estas secciones requieren revision experta obligatoria.'
      },
      {
        q: '¿Que herramienta de IA es mas adecuada para revisar un contrato de 60 paginas en busca de riesgos?',
        o: opts(
          'ChatGPT gratuito con limite de 4.000 tokens',
          'Claude con ventana de contexto de 200.000 tokens, que permite procesar el contrato completo en una sola sesion',
          'Google Translate con modo juridico',
          'Un buscador de palabras clave sin IA'
        ),
        exp: 'Claude es el lider en ventana de contexto larga. Puede analizar contratos extensos de forma coherente, identificando inconsistencias entre clausulas distantes en el documento.'
      },
      {
        q: '¿Cuál es la responsabilidad del abogado respecto a un contrato que uso IA para redactar?',
        o: opts(
          'La responsabilidad es de la empresa de IA si el contrato tiene errores',
          'El abogado es el unico responsable legal y profesional del contrato que firma o avala, independientemente de las herramientas usadas en su elaboracion',
          'La responsabilidad se comparte entre el abogado y el cliente al 50/50',
          'No hay responsabilidad si el contrato fue aprobado por ambas partes'
        ),
        exp: 'El uso de IA no transfiere ni reduce la responsabilidad profesional del abogado. El codigo de etica y el derecho ecuatoriano no reconocen a la IA como co-responsable.'
      },
    ]
  },

};

// ─────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(65));
  console.log('ITSEIA — Quizzes Express: 7 Remaining Sessions');
  console.log('='.repeat(65));

  // ── 1. Get program ──────────────────────────────────────────
  const programs = await get('/programs?slug=eq.ia-profesionales-express&select=id,name,slug');
  const programId = programs.length
    ? programs[0].id
    : 'be7e6b1e-d8f9-4c97-9b29-bacb73925579';
  console.log(`Program: ${programId}`);

  // ── 2. Get all semesters ────────────────────────────────────
  const semesters = await get(`/semesters?program_id=eq.${programId}&select=id,number,name&order=number.asc`);
  console.log(`Semesters: ${semesters.length}`);

  // ── 3. Get all subjects ─────────────────────────────────────
  const semIds = semesters.map(s => s.id).join(',');
  const subjects = await get(`/subjects?semester_id=in.(${semIds})&select=id,code,name,semester_id&order=order_index.asc`);
  console.log(`Subjects: ${subjects.length}`);

  // ── 4. Get all sessions ─────────────────────────────────────
  const subIds = subjects.map(s => s.id).join(',');
  const sessions = await get(`/sessions?subject_id=in.(${subIds})&select=id,number,title,subject_id&order=order_index.asc`);
  console.log(`Sessions: ${sessions.length}`);

  // ── 5. Check existing quizzes ───────────────────────────────
  const sesIds = sessions.map(s => s.id).join(',');
  const existingQuizzes = await get(`/quizzes?session_id=in.(${sesIds})&select=id,session_id,title`);
  console.log(`Existing quizzes: ${existingQuizzes.length}`);

  const quizBySession = {};
  existingQuizzes.forEach(q => { quizBySession[q.session_id] = q; });

  const subjectById = {};
  subjects.forEach(s => { subjectById[s.id] = s; });

  // ── 6. Identify target sessions (codes in QUIZ_MAP) ────────
  const targetCodes = new Set(Object.keys(QUIZ_MAP));
  const targetSessions = sessions.filter(s => {
    const code = subjectById[s.subject_id]?.code;
    return targetCodes.has(code);
  });

  console.log(`\nTarget sessions (${targetSessions.length}):`);
  for (const s of targetSessions) {
    const code = subjectById[s.subject_id]?.code;
    const hasQuiz = !!quizBySession[s.id];
    console.log(`  [${code}] ${s.title} — quiz: ${hasQuiz ? 'EXISTS (will skip)' : 'MISSING'}`);
  }

  // ── 7. Create missing quizzes ───────────────────────────────
  console.log('\n' + '─'.repeat(65));
  let quizCreated = 0;
  let questionsCreated = 0;
  let skipped = 0;
  let errors = 0;

  for (const session of targetSessions) {
    const code = subjectById[session.subject_id]?.code;
    const quizDef = QUIZ_MAP[code];
    const hasQuiz = !!quizBySession[session.id];

    console.log(`\n[${code}] ${session.title}`);
    console.log(`  Session ID: ${session.id}`);

    if (hasQuiz) {
      console.log(`  [SKIP] Quiz already exists: ${quizBySession[session.id].id}`);
      skipped++;
      continue;
    }

    if (!quizDef) {
      console.log(`  [SKIP] No quiz definition found for code: ${code}`);
      skipped++;
      continue;
    }

    try {
      // Insert quiz
      const quiz = await post('quizzes', {
        session_id: session.id,
        title: quizDef.title,
        pass_percentage: 70,
        max_attempts: 3,
        is_active: true,
      });
      console.log(`  [OK] Quiz created: ${quiz.id}`);
      quizCreated++;

      // Insert 5 questions
      for (let i = 0; i < quizDef.questions.length; i++) {
        const qd = quizDef.questions[i];
        await postMin('quiz_questions', {
          quiz_id: quiz.id,
          question_text: qd.q,
          question_type: 'multiple_choice',
          options: qd.o,        // JSON string — required format
          explanation: qd.exp,
          points: 1,
          order_index: i + 1,
        });
        questionsCreated++;
      }
      console.log(`  [OK] ${quizDef.questions.length} questions inserted`);

    } catch (e) {
      console.error(`  [ERR] ${e.message}`);
      errors++;
    }

    await sleep(200); // throttle to avoid rate limits
  }

  // ── 8. Verification ─────────────────────────────────────────
  console.log('\n' + '='.repeat(65));
  console.log('VERIFICATION');
  console.log('='.repeat(65));

  const quizzesV = await get(`/quizzes?session_id=in.(${sesIds})&select=id,session_id,title`);
  const quizMapV = {};
  quizzesV.forEach(q => { quizMapV[q.session_id] = q; });

  let stillMissing = 0;
  for (const s of targetSessions) {
    const code = subjectById[s.subject_id]?.code;
    const hasQuiz = !!quizMapV[s.id];
    const status = hasQuiz ? '[OK]   ' : '[MISS] ';
    console.log(`  ${status} [${code}] ${s.title}`);
    if (!hasQuiz) stillMissing++;
  }

  console.log('\n' + '─'.repeat(65));
  console.log(`Target sessions:    ${targetSessions.length}`);
  console.log(`Quizzes created:    ${quizCreated}  (errors: ${errors})`);
  console.log(`Questions inserted: ${questionsCreated}`);
  console.log(`Skipped (existed):  ${skipped}`);
  console.log(`Still missing:      ${stillMissing}`);

  if (stillMissing === 0) {
    console.log('\n  ALL 7 TARGET SESSIONS NOW HAVE QUIZZES');
  } else {
    console.log(`\n  ${stillMissing} session(s) still missing quiz — check errors above`);
  }
  console.log('='.repeat(65));
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
