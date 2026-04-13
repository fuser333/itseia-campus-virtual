#!/usr/bin/env node
/**
 * generate_idce_presentations.js
 *
 * Generates 16 presentations for the IDCE B2B course via Gamma API v1.0,
 * and updates each session's slides_url in Supabase.
 *
 * Run: node content/generate_idce_presentations.js
 */

const GAMMA_KEY  = 'sk-gamma-i1QpwB075C7XJzrB37YkUOCybMnM6FswKcmxbpH8g';
const GAMMA_BASE = 'https://public-api.gamma.app/v1.0';

const SUPA_BASE  = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SUPA_KEY   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';

const SUPA_HEADERS = {
  apikey: SUPA_KEY,
  Authorization: 'Bearer ' + SUPA_KEY,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal'
};

const GAMMA_HEADERS = {
  'X-API-KEY': GAMMA_KEY,
  'Content-Type': 'application/json'
};

// ── 16 IDCE Presentations ────────────────────────────────────────────────────

const PRESENTATIONS = [
  {
    sessionId: '1e9b788f-cabe-422d-aed9-f9bfdc692060',
    title: 'El Mapa Estrategico de IA en Banca Global y Ecuador',
    inputText: `
# El Mapa Estrategico de IA en Banca Global y Ecuador
## IA Aplicada para Banca — IDCE | Sesion 1

### Slide 1: La IA en Banca Ya No Es Futuro
- 78% de instituciones bancarias globales usan IA (McKinsey 2025)
- ROI de 300-500% en el primer ano de implementacion
- JPMorgan: $150M ahorrados con IA en compliance
- DBS Bank: 90% automatizacion procesos back-office

### Slide 2: El Estado de IA en Ecuador
- Madurez IA Ecuador: 20/100 (BCG)
- 2do ecosistema fintech mas innovador de LATAM 2025
- SBS desarrollando marco regulatorio para IA
- Morosidad promedio sistema: 3.2%
- Oportunidad: primeros en moverse ganan la ventaja

### Slide 3: 5 Tendencias de IA que Transforman la Banca
- Credit Scoring con IA: decision en 30 segundos vs 5 dias
- Fraude: deteccion en tiempo real reduce falsos positivos 60%
- Chatbots financieros: 24/7, 80% consultas resueltas sin humano
- Reporteria automatica: informes regulatorios en minutos
- Analisis predictivo: anticipar morosidad antes de que ocurra

### Slide 4: El Caso para Microempresas Financieras
- IDCE: 5-10 empleados, ya usa ChatGPT y Power BI
- Las herramientas IA son accesibles para empresas pequenas
- Presupuesto mensual IA: $100-$300 genera impacto significativo
- Ventaja competitiva frente a bancos lentos en innovar

### Slide 5: Radar de Oportunidades para IDCE
- Quick Wins: automatizacion reportes, asistente compliance
- Proyectos 3 meses: scoring crediticio, dashboards predictivos
- Proyectos 6 meses: centro de inteligencia, automatizacion total
- Criterios: impacto × factibilidad × inversion

### Slide 6: De Donde Viene el Retorno de Inversion
- Horas-hombre liberadas por automatizacion
- Reduccion errores en procesos manuales
- Decisiones mas rapidas = mas operaciones cerradas
- Cumplimiento regulatorio sin costo adicional
- Mejor servicio al cliente = retencion

### Slide 7: Ecosistema de Herramientas IA para Banca
- ChatGPT / Claude: analisis, redaccion, compliance
- Power BI + Copilot: dashboards inteligentes
- Make / Zapier: automatizacion de flujos
- Google Sheets + Apps Script: integraciones ligeras
- Perplexity: investigacion regulatoria actualizada

### Slide 8: Regulaciones y Compliance
- SBS Ecuador: normativa tecnologica en desarrollo
- Basilea III/IV: requerimientos de gestion de riesgo
- Ley LOPDP Ecuador: proteccion de datos personales
- La IA debe cumplir: transparencia, auditabilidad, no-discriminacion

### Slide 9: Hoja de Ruta del Programa IDCE
- 8 modulos, 16 sesiones, 32 horas en 4 semanas
- Semana 1: Estrategia + Herramientas IA
- Semana 2: Automatizacion + Analytics
- Semana 3: Casos Practicos aplicados a IDCE
- Semana 4: Plan de 90 dias + Certificacion

### Slide 10: Ejercicio de Hoy
- Construir el "Radar de Oportunidades IA para IDCE"
- Usar Perplexity para investigar el sector bancario ecuatoriano
- Usar Claude para analisis estrategico personalizado
- Resultado: mapa visual con 10 oportunidades clasificadas
    `.trim()
  },
  {
    sessionId: '9bd3bde1-b4b2-4efd-9aca-63b4d440cc49',
    title: 'Benchmarking IA — IDCE vs El Sector Financiero',
    inputText: `
# Benchmarking IA — IDCE vs El Sector Financiero
## IA Aplicada para Banca — IDCE | Sesion 2

### Slide 1: Por Que Hacer Benchmarking de Madurez IA
- No puedes mejorar lo que no mides
- Linea base para evaluar progreso en 90 dias
- Identificar brechas criticas vs el mercado
- Priorizar inversiones donde mas importa

### Slide 2: Ecuador vs LATAM vs Global
- Ecuador madurez IA: 20/100 | Chile: 45/100 | Global: 75/100
- % procesos con IA: Ecuador 8-12% | LATAM lider 25-35% | Global 55-70%
- Inversion IA/ingresos: Ecuador 0.5-1% | LATAM 2-4% | Global 5-10%
- Skills IA empleados: Ecuador 10-15% | LATAM 30-40% | Global 60-80%

### Slide 3: Los 5 Niveles de Madurez IA
- Nivel 1 Exploratorio: conoce IA pero no la usa
- Nivel 2 Experimental: usa ChatGPT de forma individual
- Nivel 3 Operacional: IA integrada en 2-3 flujos
- Nivel 4 Estrategico: IA impulsa decisiones de negocio
- Nivel 5 Transformacional: modelo de negocio basado en IA

### Slide 4: Las 8 Areas a Evaluar en IDCE
- Analisis de datos y toma de decisiones
- Reporteria y documentacion
- Atencion al cliente
- Compliance y regulatorio
- Gestion de riesgo crediticio
- Productos y servicios financieros
- Operaciones internas
- Innovacion y desarrollo

### Slide 5: Donde Esta IDCE Hoy
- IDCE ya usa ChatGPT, Claude, Power BI, Tableau
- Nivel estimado: 2 (Experimental) en la mayoria de areas
- Fortaleza: disposicion al cambio, equipo pequeno y agil
- Debilidad: procesos no estandarizados, datos dispersos

### Slide 6: Que Hacen los Lideres del Sector
- Banco Pichincha: analytics predictivo operacional
- Produbanco: automatizacion compliance
- Cooperativa JEP: scoring crediticio con ML
- Fintech ecuatorianas: APIs + IA desde el dia 1

### Slide 7: El Costo de No Actuar
- Cada mes sin IA = horas-hombre desperdiciadas
- Competidores captan los mejores clientes
- Reguladores pediran reportes mas complejos
- El talento IA prefiere empresas innovadoras
- En 3 anos: la brecha sera irreversible

### Slide 8: Plan de Salto: De Nivel 2 a Nivel 3 en 90 Dias
- Mes 1: Quick wins — automatizar 3 procesos repetitivos
- Mes 2: Integrar IA en flujo de decisiones crediticias
- Mes 3: Dashboard predictivo + reporteria automatica
- Meta: 3 flujos con IA integrada permanentemente

### Slide 9: KPIs de Exito
- Horas-hombre liberadas por automatizacion (meta: 40h/mes)
- Tiempo de generacion de reportes (meta: -70%)
- Precision scoring crediticio (meta: +15%)
- Satisfaccion del equipo con herramientas (meta: 8/10)

### Slide 10: Ejercicio de Hoy
- Autodiagnostico: cada participante evalua su area
- Matriz 8 areas × 5 niveles con ChatGPT
- Consolidar resultados con Claude
- Generar reporte ejecutivo de madurez IA de IDCE
    `.trim()
  },
  {
    sessionId: '7729420f-07eb-47e8-8d01-95e8d43fb40a',
    title: 'APIs y Custom GPTs para Flujos Financieros',
    inputText: `
# APIs y Custom GPTs para Flujos Financieros
## IA Aplicada para Banca — IDCE | Sesion 3

### Slide 1: De Uso Individual a Integracion en Flujos
- Chatear con ChatGPT es solo el nivel 1
- El verdadero poder: conectar IA a tus procesos
- Custom GPTs: asistentes especializados sin codigo
- APIs: automatizacion directa en tus sistemas

### Slide 2: Que Es un Custom GPT
- Asistente IA entrenado para una tarea especifica
- Instrucciones de sistema + documentos de referencia
- Ejemplo: GPT que analiza estados financieros de IDCE
- Se crea en 15 minutos, se usa todos los dias

### Slide 3: 3 GPTs que IDCE Necesita
- GPT Analista Financiero: evalua solicitudes de credito
- Claude Project Compliance: revisa normativa SBS
- GPT Atencion Consultas: responde preguntas frecuentes de clientes

### Slide 4: APIs de IA — Conceptos Clave
- API = interfaz para conectar sistemas automaticamente
- OpenAI API: $0.01-0.03 por consulta tipica
- Anthropic Claude API: similar precio, mejor en documentos largos
- Google Gemini API: tier gratuito generoso

### Slide 5: Seguridad en APIs Financieras
- Nunca enviar datos de clientes reales sin anonimizar
- Usar API keys seguras, no compartir en codigo publico
- Cumplir LOPDP Ecuador y normativa SBS
- Logs de uso para auditoria

### Slide 6: Caso Practico — GPT Analista Financiero
- Prompt de sistema: "Eres analista crediticio senior de Ecuador..."
- Documentos: politica de credito IDCE, tablas SBS
- Input: datos del solicitante (anonimizados)
- Output: evaluacion estructurada con recomendacion

### Slide 7: Caso Practico — Claude Compliance
- Sube normativa SBS completa como documento
- Pregunta: "Esta operacion cumple con la resolucion X?"
- Claude analiza el documento y da respuesta fundamentada
- Ahorro: horas de revision legal manual

### Slide 8: Costos Reales para IDCE
- ChatGPT Plus: $20/mes por usuario
- Claude Pro: $20/mes por usuario
- API OpenAI uso moderado: $15-30/mes
- API Claude uso moderado: $15-30/mes
- Inversion total equipo 5 personas: ~$150/mes

### Slide 9: Limitaciones Importantes
- La IA puede alucinar datos financieros
- Siempre verificar con fuentes primarias
- No usar para decisiones regulatorias finales sin revision humana
- Documentar todo uso de IA para auditoria

### Slide 10: Ejercicio de Hoy
- Crear 3 asistentes especializados
- A) Custom GPT Analista Financiero en OpenAI
- B) Claude Project para Compliance SBS
- C) Custom GPT para consultas de clientes
- Probar cada uno con un caso real de IDCE
    `.trim()
  },
  {
    sessionId: '26feba3d-c2cc-4f67-97b3-38370347ba76',
    title: 'Cadenas de Prompts y Workflows para Banca',
    inputText: `
# Cadenas de Prompts y Workflows Inteligentes para Banca
## IA Aplicada para Banca — IDCE | Sesion 4

### Slide 1: El Poder de las Cadenas de Prompts
- Un prompt = una tarea simple
- Una cadena = proceso completo automatizado
- Ejemplo: evaluar credito en 5 pasos automaticos
- Output de un prompt alimenta el siguiente

### Slide 2: Arquitectura de una Cadena de 5 Prompts
- Prompt 1: Extraccion de datos del solicitante
- Prompt 2: Analisis de capacidad de pago
- Prompt 3: Evaluacion cualitativa y riesgos
- Prompt 4: Decision integrada con score
- Prompt 5: Generacion de documento formal

### Slide 3: Principios de Diseno
- Cada prompt tiene una sola tarea clara
- Output estructurado (JSON o tabla) para el siguiente
- Human-in-the-loop en puntos criticos de decision
- Logs de cada paso para auditoria

### Slide 4: Ejemplo Real — Evaluacion Crediticia
- Solicitud: Juan Perez, $15,000, 24 meses, microempresa
- Prompt 1 extrae: ingresos, gastos, historial, garantias
- Prompt 2 calcula: ratio deuda/ingreso, scoring
- Prompt 3 evalua: sector, experiencia, riesgos cualitativos
- Prompt 4: APROBAR con condiciones (garantia adicional)

### Slide 5: Herramientas para Workflows
- Manual: copiar/pegar entre prompts (nivel basico)
- Google Sheets + Apps Script (nivel intermedio)
- Make / Zapier con modulos OpenAI (nivel avanzado)
- LangChain / LlamaIndex (nivel programador)

### Slide 6: Workflow de Reporteria Automatica
- Trigger: viernes 8:00 AM
- Paso 1: Leer datos de Google Sheets (cartera, KPIs)
- Paso 2: Enviar a OpenAI para analisis narrativo
- Paso 3: Generar documento Google Docs formateado
- Paso 4: Enviar por email al equipo

### Slide 7: Estimacion de Costos API
- 1 cadena de 5 prompts ≈ $0.05-0.15 por ejecucion
- 100 evaluaciones crediticias/mes = $5-15
- Reportes semanales automaticos = $2-4/mes
- Total workflows IDCE: $20-50/mes maximo

### Slide 8: Errores Comunes
- Cadenas demasiado largas (max 5-7 pasos)
- No validar output antes del siguiente paso
- Olvidar human-in-the-loop en decisiones criticas
- No guardar logs para auditoria regulatoria

### Slide 9: Mejores Practicas
- Empezar simple: 2-3 pasos, luego escalar
- Probar con datos ficticios antes de produccion
- Documentar cada cadena como un SOP
- Revisar y optimizar prompts cada 30 dias
- Medir: tiempo antes vs despues de automatizar

### Slide 10: Ejercicio de Hoy
- Disenar pipeline de evaluacion crediticia de 5 prompts
- Probar con 3 solicitudes simuladas
- Documentar toda la cadena en formato reutilizable
- Medir tiempo: manual vs automatizado
    `.trim()
  },
  { sessionId: '1fdb29f8-40df-477c-a11b-9a75d8ec0fe4', title: 'Mapa de Automatizacion Procesos Bancarios', inputText: `# Mapa de Automatizacion — Procesos Bancarios de IDCE\n## IA Aplicada para Banca — IDCE | Sesion 5\n\n### Slide 1: La Automatizacion Inteligente en Banca\n- 30-40% del tiempo en tareas repetitivas (Gartner)\n- Automatizar no es eliminar empleos: es liberar talento\n- RPA + IA = automatizacion cognitiva\n- Para IDCE: liberar 40+ horas/mes\n\n### Slide 2: Los 20 Procesos Tipicos de una Microfinanciera\n- Conciliacion bancaria, reportes SBS, scoring crediticio\n- Generacion de contratos, cobranzas, atencion consultas\n- Registro contable, declaraciones tributarias\n- Cada proceso: frecuencia × tiempo × costo = prioridad\n\n### Slide 3: Matriz de Priorizacion 4 Cuadrantes\n- Quick Win: alto impacto, baja complejidad → hacer primero\n- Estrategico: alto impacto, alta complejidad → planificar\n- Incremental: bajo impacto, baja complejidad → delegar\n- Diferir: bajo impacto, alta complejidad → posponer\n\n### Slide 4: Top 5 Quick Wins para IDCE\n- 1. Reportes semanales de gestion (4h → 30min)\n- 2. Minutas de comites (2h → 20min)\n- 3. Conciliacion bancaria basica (3h → 45min)\n- 4. Respuestas a consultas frecuentes (2h/dia → 30min/dia)\n- 5. Resumen de regulaciones nuevas (4h → 1h)\n\n### Slide 5: Herramientas por Tipo de Automatizacion\n- Make/Zapier: flujos entre aplicaciones\n- Google Apps Script: automatizacion Google Workspace\n- Power Automate: ecosistema Microsoft\n- ChatGPT/Claude APIs: procesamiento inteligente\n- Otter.ai/Fireflies: transcripcion reuniones\n\n### Slide 6: ROI de Automatizar\n- 40 horas/mes liberadas × $8/hora = $320/mes ahorro\n- Inversion herramientas: $100-150/mes\n- ROI neto: $170-220/mes = $2,040-2,640/ano\n- Beneficio intangible: menos errores, mas analisis\n\n### Slide 7: Fases de Implementacion\n- Fase 1 (Mes 1): Top 3 Quick Wins operativos\n- Fase 2 (Mes 2): Integrar IA en decisiones crediticias\n- Fase 3 (Mes 3): Automatizacion reporteria completa\n- Revision trimestral: que mas se puede automatizar?\n\n### Slide 8: Riesgos y Mitigacion\n- Riesgo: depender de herramientas de terceros\n- Mitigacion: documentar procesos, tener plan B manual\n- Riesgo: errores de IA en procesos criticos\n- Mitigacion: human-in-the-loop en decisiones finales\n\n### Slide 9: Metricas de Exito\n- Horas liberadas por automatizacion (meta: 40h/mes)\n- Errores reducidos (meta: -50%)\n- Tiempo de respuesta a clientes (meta: -60%)\n- Satisfaccion del equipo (encuesta trimestral)\n\n### Slide 10: Ejercicio de Hoy\n- Mapear 20 procesos de IDCE en la matriz 4 cuadrantes\n- Para cada uno: frecuencia, tiempo, costo, impacto\n- Seleccionar top 5 para automatizar primero\n- Crear plan de implementacion de 90 dias`.trim() },
  { sessionId: '5f65e9b9-999e-4de5-ba95-bbb5f4553e50', title: 'Make + IA para Reporteria Bancaria', inputText: `# Automatizacion Practica — Make + IA para Reporteria\n## IA Aplicada para Banca — IDCE | Sesion 6\n\n### Slide 1: Make (Integromat) para Empresas Pequenas\n- Plataforma visual de automatizacion sin codigo\n- Conecta 1,500+ aplicaciones\n- Plan gratuito: 1,000 operaciones/mes\n- Plan Pro: $9/mes, 10,000 operaciones\n\n### Slide 2: Anatomia de un Flow en Make\n- Trigger: que inicia el flujo (horario, webhook, email)\n- Modulos: pasos del proceso (leer datos, transformar, enviar)\n- Router: bifurcar segun condiciones\n- Error Handler: que hacer si algo falla\n\n### Slide 3: Flow 1 — Reporte Semanal Automatico\n- Trigger: Schedule cada viernes 8 AM\n- Paso 1: Leer Google Sheets (cartera + KPIs)\n- Paso 2: Enviar datos a OpenAI para analisis\n- Paso 3: Crear Google Doc con formato\n- Paso 4: Enviar email al equipo\n\n### Slide 4: Flow 2 — Alerta de Morosidad\n- Trigger: cada dia a las 7 AM\n- Paso 1: Revisar cartera en Google Sheets\n- Paso 2: Filtrar creditos con mora > 30 dias\n- Paso 3: Generar resumen con IA\n- Paso 4: Notificar por Slack/email al responsable\n\n### Slide 5: Flow 3 — Minutas Automaticas\n- Reuniones IDCE generan actas de comite\n- Otter.ai/Fireflies graba y transcribe\n- Make recibe transcripcion via webhook\n- OpenAI estructura en formato acta oficial\n- Google Docs guarda con fecha y asistentes\n\n### Slide 6: Integracion Make + OpenAI\n- Modulo HTTP Make → API OpenAI\n- Enviar contexto + datos\n- Recibir analisis narrativo\n- Costo: ~$0.05 por ejecucion\n- 4 reportes/semana = $0.80/mes\n\n### Slide 7: Buenas Practicas\n- Siempre incluir Error Handler\n- Nombrar cada modulo descriptivamente\n- Probar con datos ficticios primero\n- Guardar logs de cada ejecucion\n- Revisar flujos mensualmente\n\n### Slide 8: Errores Comunes\n- Garbage in, garbage out: datos sucios = reportes malos\n- No manejar excepciones (el flow se detiene)\n- Tokens excesivos: enviar demasiado texto a la IA\n- No documentar el flujo para el equipo\n\n### Slide 9: ROI Especifico para IDCE\n- 4 reportes semanales manuales: 8 horas/semana\n- Con Make + IA: 30 minutos revision/semana\n- Ahorro: 30 horas/mes\n- Costo Make Pro: $9/mes + API $5/mes = $14/mes\n- ROI: 214:1\n\n### Slide 10: Ejercicio de Hoy\n- Crear tu primer flow en Make (9 pasos)\n- Schedule → Google Sheets → OpenAI → Google Docs → Email\n- Usar dataset de practica: cartera 10 creditos + KPIs\n- Generar el primer reporte automatico de IDCE`.trim() },
  { sessionId: '5b0e1712-9889-424e-92b5-15449158db53', title: 'Power BI + IA Generativa — Dashboards que Piensan', inputText: `# Power BI + IA Generativa — Dashboards que Piensan\n## IA Aplicada para Banca — IDCE | Sesion 7\n\n### Slide 1: De Dashboards Descriptivos a Prescriptivos\n- Descriptivo: que paso (historico)\n- Diagnostico: por que paso (analisis)\n- Predictivo: que va a pasar (ML)\n- Prescriptivo: que deberia hacer (IA generativa)\n- IDCE: saltar de descriptivo a prescriptivo\n\n### Slide 2: Power BI + Copilot\n- Microsoft Copilot integrado en Power BI\n- Pregunta en lenguaje natural: "Muestra creditos en mora por sector"\n- Genera visualizaciones automaticamente\n- Explica tendencias y anomalias\n\n### Slide 3: Dashboard de Cartera IDCE\n- Metricas clave: total cartera, % morosidad, provision\n- Distribucion por calificacion SBS (A, B, C, D, E)\n- Evolucion mensual de morosidad\n- Top 10 clientes por monto\n- Alertas automaticas de deterioro\n\n### Slide 4: Integrando Claude con Power BI\n- Exportar datos de Power BI (CSV)\n- Enviar a Claude para analisis narrativo\n- Claude genera: insights, riesgos, recomendaciones\n- Reimportar predicciones como nueva tabla\n- Resultado: dashboard + narrativa inteligente\n\n### Slide 5: Dataset de Practica IDCE\n- 15 creditos con datos reales simulados\n- Campos: cedula, monto, plazo, tasa, garantia, estado\n- Calificacion SBS, ratio deuda/ingreso\n- Incluye: vigentes, vencidos y castigados\n- Distribucion realista del mercado ecuatoriano\n\n### Slide 6: DAX + IA — Formulas Inteligentes\n- Copilot genera medidas DAX automaticamente\n- "Calcula la morosidad promedio ponderada por monto"\n- No necesitas memorizar formulas complejas\n- La IA explica cada formula paso a paso\n\n### Slide 7: Visualizaciones Efectivas\n- KPI Cards: metricas clave arriba\n- Treemap: composicion de cartera\n- Line Chart: tendencia de morosidad\n- Table: detalle por credito\n- Slicer: filtros por periodo, tipo, estado\n\n### Slide 8: Alertas y Automatizacion\n- Power Automate: notificar cuando morosidad > umbral\n- Refresh automatico: datos actualizados cada hora\n- Compartir con equipo via workspace\n- Version mobile: acceso desde el celular\n\n### Slide 9: Limitaciones y Precauciones\n- Con portafolios pequenos (15 creditos): cuidado con significancia\n- Power BI Copilot requiere licencia premium\n- Alternativa gratuita: Claude + Google Sheets\n- Siempre human-in-the-loop para decisiones crediticias\n\n### Slide 10: Ejercicio de Hoy\n- Construir dashboard Power BI con dataset 15 creditos\n- Exportar datos y analizar con Claude\n- Claude genera risk scores y predicciones\n- Reimportar predicciones al dashboard`.trim() },
  { sessionId: '1b5090c4-9144-43c2-8f9c-add4f912d44e', title: 'Tableau + IA y Analisis de Riesgo', inputText: `# Tableau + IA y Analisis de Riesgo Automatizado\n## IA Aplicada para Banca — IDCE | Sesion 8\n\n### Slide 1: Tableau para Analisis de Riesgo\n- Herramienta lider en visualizacion de datos\n- Einstein Discovery: IA predictiva integrada\n- Drag-and-drop: sin codigo necesario\n- Conexion directa a Excel, Google Sheets, CSV\n\n### Slide 2: Dataset de 200 Registros Crediticios\n- Generado con ChatGPT para practica realista\n- Distribucion Ecuador: 82% Vigentes, 14% Vencidos, 4% Castigados\n- Variables: monto, tasa, plazo, ingreso, sector, garantia, calificacion\n- Datos ficticios pero estadisticamente representativos\n\n### Slide 3: 4 Worksheets del Dashboard\n- Vista General: KPIs + distribucion cartera\n- Analisis de Riesgo: morosidad por variables\n- Stress Testing: escenarios pesimistas\n- Reporte Regulatorio: formato SBS listo para enviar\n\n### Slide 4: Einstein Discovery — Predicciones\n- "Que creditos tienen mayor probabilidad de mora?"\n- Variables predictoras: ratio deuda/ingreso, sector, historial\n- Score de riesgo 0-100 para cada credito\n- Recomendaciones automaticas de gestion\n\n### Slide 5: Stress Testing con IA\n- Escenario 1: morosidad sube 5 puntos\n- Escenario 2: tasa de interes sube 3%\n- Escenario 3: caida 20% ingresos sector vulnerable\n- Claude analiza cada escenario y genera recomendaciones\n- El comite de credito toma decisiones informadas\n\n### Slide 6: Reporte Regulatorio SBS\n- Formato oficial de la Superintendencia de Bancos\n- Clasificacion de cartera por calificacion\n- Provisiones requeridas calculadas automaticamente\n- Narrativa generada por Claude con datos reales\n- Validacion humana obligatoria antes de enviar\n\n### Slide 7: Tableau Public — Opcion Gratuita\n- Publicar dashboards en la nube gratis\n- Ideal para practica y prototipos\n- Limitacion: datos son publicos\n- Para produccion: Tableau Desktop o Server\n\n### Slide 8: Integrando Todo: Tableau + Claude\n- Tableau maneja la visualizacion\n- Claude maneja el analisis narrativo\n- Exportar datos → Claude → insights → reimportar\n- Resultado: dashboard inteligente con narrativa\n\n### Slide 9: Mejores Practicas en Riesgo con IA\n- Scoring multivariable > scoring simple\n- Actualizar modelos cada 3 meses minimo\n- Validar predicciones vs resultados reales\n- Documentar metodologia para auditores\n- Cumplir Basilea III/IV en gestion de riesgo\n\n### Slide 10: Ejercicio de Hoy\n- Generar dataset 200 registros con ChatGPT\n- Crear dashboard Tableau con 4 worksheets\n- Ejecutar stress testing con Claude\n- Generar reporte regulatorio formato SBS`.trim() },
  { sessionId: 'c85d45de-1e1c-4cae-8185-b70c58b332bd', title: 'Diagnostico — Decisiones Lentas en IDCE', inputText: `# Diagnostico: Por Que las Decisiones Son Lentas en IDCE\n## IA Aplicada para Banca — IDCE | Sesion 9\n\n### Slide 1: El Costo Invisible de las Decisiones Lentas\n- Cada dia de demora en una decision crediticia = dinero perdido\n- Informacion dispersa en 5+ sistemas/archivos\n- Key-person dependency: solo 1-2 personas saben todo\n- Promedio empresa pequena: 3-5 dias para decision que podria tomar horas\n\n### Slide 2: Anatomia de una Decision en IDCE\n- Paso 1: Recopilar informacion (manual, 2-3 horas)\n- Paso 2: Consultar precedentes (memoria individual)\n- Paso 3: Analizar (Excel, calculadora)\n- Paso 4: Reunirse para decidir (agenda, demoras)\n- Paso 5: Documentar decision (otro documento mas)\n\n### Slide 3: El Diagnostico 360\n- Cada participante diagnostica su area\n- 10 preguntas guiadas con Claude\n- Tiempo por diagnostico: 30 minutos\n- Areas: operaciones, credito, compliance, finanzas, innovacion\n\n### Slide 4: Resultados Tipicos del Diagnostico\n- 40-50% del tiempo productivo en buscar informacion\n- 3+ versiones de la "verdad" en diferentes archivos\n- Decisiones basadas en quien grita mas fuerte\n- Retrasos por vacaciones/ausencias de personas clave\n\n### Slide 5: La Solucion — Centro de Inteligencia\n- Un lugar donde toda la informacion esta disponible\n- 3 Capas: Datos Unificados + Analisis IA + Alertas\n- Google Sheets como base (simple, colaborativo)\n- IA que analiza y recomienda automaticamente\n\n### Slide 6: Capa 1 — Datos Unificados\n- Google Sheet central con pestanas organizadas\n- Cartera, KPIs, transacciones, insights, historico\n- Todos acceden, todos ven lo mismo\n- Actualizacion en tiempo real\n\n### Slide 7: Capa 2 — Analisis IA Automatico\n- Apps Script conecta Google Sheets con OpenAI API\n- Cada semana: analisis automatico de la cartera\n- Genera insights narrativos y alertas\n- "La morosidad subio 2% — los creditos del sector X son el 80% del problema"\n\n### Slide 8: Capa 3 — Alertas y Recomendaciones\n- Email automatico con resumen semanal\n- Alertas inmediatas si morosidad supera umbral\n- Recomendaciones de accion priorizadas\n- Historial de decisiones para aprendizaje\n\n### Slide 9: De 3 Dias a 3 Horas\n- Con el Centro de Inteligencia:\n- Informacion disponible al instante\n- Analisis IA listo antes de la reunion\n- Decision informada en la primera sesion\n- Documentacion automatica de la decision\n\n### Slide 10: Ejercicio de Hoy\n- Cada participante diagnostica su area con Claude\n- Consolidar 5 diagnosticos con ChatGPT\n- Cuantificar el costo mensual de decisiones lentas\n- Disenar la arquitectura del Centro de Inteligencia IDCE`.trim() },
  { sessionId: '9dc44f70-452c-4e42-ae1a-2961f6139e90', title: 'Centro de Inteligencia de IDCE', inputText: `# Construyendo el Centro de Inteligencia de IDCE\n## IA Aplicada para Banca — IDCE | Sesion 10\n\n### Slide 1: Arquitectura del Centro de Inteligencia\n- Google Sheets: base de datos central (gratis, colaborativo)\n- Apps Script: automatizacion y conexiones API\n- OpenAI API: analisis inteligente semanal\n- Email/Slack: distribucion de insights\n- Costo total: ~$20/mes\n\n### Slide 2: Las 5 Pestanas del Google Sheet\n- Cartera: todos los creditos activos con estado\n- KPIs: metricas clave con formulas automaticas\n- Transacciones: movimientos del periodo\n- Insights IA: analisis generados automaticamente\n- Historico: registro de decisiones y tendencias\n\n### Slide 3: Apps Script — Tu Robot Personal\n- Google Apps Script = JavaScript dentro de Google\n- Puede leer/escribir Google Sheets\n- Puede llamar APIs externas (OpenAI, Claude)\n- Puede enviar emails automaticos\n- Se programa con triggers (semanal, diario)\n\n### Slide 4: El Script de Analisis Semanal\n- Trigger: cada lunes a las 7 AM\n- Lee datos de la pestana Cartera\n- Envia a OpenAI con prompt especializado\n- Recibe analisis narrativo + alertas\n- Guarda en pestana Insights IA + enviar email\n\n### Slide 5: El Prompt de Analisis\n- "Analiza esta cartera crediticia de IDCE Ecuador"\n- Incluye: datos actuales, datos semana anterior\n- Pide: tendencias, alertas, top 3 riesgos, recomendaciones\n- Formato: markdown estructurado para facil lectura\n\n### Slide 6: Parametros Importantes\n- Temperature: 0.3 (precision > creatividad para datos financieros)\n- Max tokens: 2000 (suficiente para analisis completo)\n- Model: gpt-4o-mini (balance costo/calidad)\n- Costo por analisis: ~$0.05\n\n### Slide 7: Validacion y Control de Calidad\n- La IA genera borrador, humano valida\n- Checklist: numeros coherentes, tendencias logicas\n- Comparar con datos fuente (el Sheet)\n- Flag de confianza: verde/amarillo/rojo\n\n### Slide 8: Escalabilidad\n- Semana 1: solo cartera crediticia\n- Mes 2: agregar cobranzas y flujo de caja\n- Mes 3: incluir metricas de satisfaccion cliente\n- Mes 6: dashboard completo de gestion con historico\n\n### Slide 9: Beneficios Tangibles\n- Informacion centralizada: 0 minutos buscando datos\n- Analisis semanal automatico: ahorro 4h/semana\n- Decisiones basadas en datos, no en intuicion\n- Historial para auditorias y reguladores\n- Equipo alineado con la misma informacion\n\n### Slide 10: Ejercicio de Hoy\n- Crear Google Sheet con 5 pestanas\n- Poblar con datos de practica (reusa dataset sesion 7)\n- Escribir Apps Script que conecta a OpenAI API\n- Generar el primer analisis automatico de cartera IDCE`.trim() },
  { sessionId: 'a3fc80a7-ee64-422e-94a7-96f77ff5a5ad', title: 'Diagnostico de Reporteria IDCE', inputText: `# Diagnostico de Reporteria y Documentacion en IDCE\n## IA Aplicada para Banca — IDCE | Sesion 11\n\n### Slide 1: El Peso de la Reporteria Manual\n- Empresas financieras generan 20-40 reportes/mes\n- 60-80% del tiempo es formato, no analisis\n- Cada reporte manual = riesgo de error humano\n- IDCE: oportunidad de liberar 20+ horas/mes\n\n### Slide 2: 4 Categorias de Reportes\n- Regulatorios: SBS, SRI, UAFE (obligatorios)\n- Internos: comite credito, gerencia, directorio\n- Operativos: diarios de caja, conciliaciones\n- Presentaciones: clientes, socios, auditores\n\n### Slide 3: La Auditoria — El Equipo Lidera\n- Sesion liderada por los participantes (instructor facilita)\n- Cada persona inventaria los reportes de su area\n- Cuantificar: tiempo, frecuencia, destinatario\n- Clasificar nivel de automatizacion posible\n\n### Slide 4: Los 4 Niveles de Automatizacion\n- Nivel 1: Templates (plantillas pre-formateadas)\n- Nivel 2: Semi-automatico (datos auto, narrativa manual)\n- Nivel 3: Automatico supervisado (IA genera, humano revisa)\n- Nivel 4: Conversacional (pedir reporte por chat)\n\n### Slide 5: Costo Real de Reporteria Manual\n- Ejemplo IDCE: 25 reportes/mes\n- Tiempo promedio: 2 horas/reporte\n- 50 horas/mes = 6+ dias laborables completos\n- A $8/hora = $400/mes en solo reportes\n- Sin contar errores, retrasos, retrabajo\n\n### Slide 6: Que Se Puede Automatizar Ya\n- Informes de gestion semanal → Make + OpenAI\n- Minutas de comite → Otter.ai + Claude\n- Reporte cartera SBS → Claude con template\n- Resumen regulatorio → Perplexity + Claude\n\n### Slide 7: Que Requiere Mas Trabajo\n- Estados financieros auditados (requieren firma)\n- Informes para SRI con datos fiscales precisos\n- Reportes UAFE (antilavado) con validacion legal\n- Estos se pueden semi-automatizar (IA prepara borrador)\n\n### Slide 8: Criterios de Seleccion Top 3\n- Mayor frecuencia × mayor tiempo = mayor impacto\n- Menor riesgo regulatorio = implementacion mas rapida\n- Menor dependencia de datos externos = mas factible\n- Top 3 = los que implementamos manana\n\n### Slide 9: Plan de Automatizacion 30 Dias\n- Semana 1: Implementar reporte semanal automatico\n- Semana 2: Implementar minutas automaticas\n- Semana 3: Implementar reporte cartera SBS borrador\n- Semana 4: Medir resultados, ajustar, documentar\n\n### Slide 10: Ejercicio de Hoy\n- Inventariar TODOS los reportes de IDCE (4 categorias)\n- Cuantificar costo mensual de reporteria manual\n- Clasificar cada reporte por nivel automatizacion (1-4)\n- Seleccionar top 3 para automatizar en el sprint`.trim() },
  { sessionId: 'b31d5e95-7739-49eb-a761-dd66ee348f58', title: 'Implementacion Reporteria Automatizada', inputText: `# Implementacion de Reporteria Automatizada\n## IA Aplicada para Banca — IDCE | Sesion 12\n\n### Slide 1: Sprint de Implementacion\n- Sesion 90% practica, 10% teoria\n- 3 reportes automatizados en 60 minutos\n- Herramientas: Make, Otter.ai, Claude\n- Cada participante sale con algo funcionando\n\n### Slide 2: Reporte 1 — Informe Semanal de Gestion\n- Herramienta: Make + OpenAI\n- Trigger: viernes 8 AM automatico\n- Input: Google Sheets con cartera + KPIs\n- Output: Google Doc formateado + email al equipo\n- Tiempo antes: 4 horas | Despues: 15 min revision\n\n### Slide 3: Reporte 2 — Minutas Comite de Credito\n- Herramienta: Otter.ai/Fireflies + Claude\n- Grabar reunion con transcripcion automatica\n- Claude estructura en formato Acta oficial\n- Campos: fecha, asistentes, temas, decisiones, responsables\n- Tiempo antes: 2 horas | Despues: 10 min revision\n\n### Slide 4: Reporte 3 — Reporte Cartera SBS\n- Herramienta: Claude con template regulatorio\n- Datos de Google Sheets → prompt estructurado\n- Claude genera borrador en formato SBS oficial\n- Checklist de validacion humana obligatoria\n- Tiempo antes: 6 horas | Despues: 1 hora revision\n\n### Slide 5: Template — Informe Semanal\n- Encabezado: IDCE S.A., periodo, preparado por\n- Seccion 1: Resumen Ejecutivo (3 parrafos)\n- Seccion 2: KPIs vs metas\n- Seccion 3: Cartera — estado y alertas\n- Seccion 4: Acciones recomendadas\n\n### Slide 6: Template — Acta del Comite\n- Encabezado: Acta No., fecha, hora inicio/fin\n- Asistentes con cargo\n- Orden del dia\n- Desarrollo de cada punto\n- Decisiones tomadas con responsables y plazos\n\n### Slide 7: Checklist de Validacion Humana\n- Los numeros coinciden con la fuente?\n- La narrativa es coherente con los datos?\n- Hay alucinaciones (datos inventados)?\n- El formato cumple con el regulador?\n- Firma del responsable antes de enviar\n\n### Slide 8: Ahorro Total Calculado\n- Reporte semanal: 3.5h × 4 = 14h/mes ahorradas\n- Minutas: 1.5h × 4 = 6h/mes ahorradas\n- Reporte SBS: 5h × 1 = 5h/mes ahorradas\n- Total: 25 horas/mes liberadas = 3+ dias laborables\n- Costo herramientas: ~$30/mes | Ahorro: ~$200/mes\n\n### Slide 9: Escalabilidad Futura\n- Mes 2: agregar reporte tributario semi-automatico\n- Mes 3: dashboard de reportes generados\n- Mes 6: sistema completo de documentacion IA\n- Futuro: chatbot interno "genera el reporte de X"\n\n### Slide 10: Ejercicio de Hoy\n- Implementar los 3 reportes en 60 minutos\n- Cada participante responsable de 1 reporte\n- Probar con datos reales (anonimizados)\n- Validar con checklist y corregir`.trim() },
  { sessionId: '08f2e9b1-dd11-410b-bfc2-89c3e861000c', title: 'Auditoria IA — Quick Wins y Proyectos Estrategicos', inputText: `# Auditoria Completa IA de IDCE\n## IA Aplicada para Banca — IDCE | Sesion 13\n\n### Slide 1: De Entrenamiento a Implementacion\n- Las primeras 12 sesiones: aprender herramientas\n- Sesiones 13-16: crear el plan real para IDCE\n- Hoy: auditoria 360 + identificar proyectos\n- Resultado: roadmap de implementacion con presupuesto\n\n### Slide 2: Auditoria por Areas — Cada Participante Lidera\n- Participante 1: Operaciones\n- Participante 2: Reporteria y Documentacion\n- Participante 3: Analisis y Decisiones\n- Participante 4: Compliance y Regulatorio\n- Participante 5: Innovacion y Desarrollo\n\n### Slide 3: Metodologia de Auditoria\n- Inventariar todos los procesos del area (10-15 por area)\n- Para cada proceso: tiempo actual, herramienta, frecuencia\n- Evaluar: se puede automatizar con IA? (Si/Parcial/No)\n- Estimar ROI: ahorro tiempo × valor hora\n- Clasificar: Quick Win / Estrategico / Diferir\n\n### Slide 4: Consolidacion — La Vista 360\n- 5 auditorias individuales → 1 mapa consolidado\n- Tabla maestra: proceso, area, tipo, ROI, prioridad\n- Ordenar por impacto × factibilidad\n- Top 10 proyectos para los proximos 90 dias\n\n### Slide 5: Presupuesto Realista — $204/mes\n- ChatGPT Plus (2 cuentas): $40\n- Claude Pro (1 cuenta): $20\n- Make Pro: $9\n- APIs (OpenAI + Claude): $35\n- Herramientas adicionales: $100\n- Total: $204/mes para todo el equipo\n\n### Slide 6: Quick Wins (Implementar Semana 1-2)\n- Reportes semanales automaticos (ya aprendido)\n- Custom GPTs para consultas frecuentes\n- Minutas automaticas de reuniones\n- Template de evaluacion crediticia con IA\n\n### Slide 7: Proyectos Mes 1-2\n- Centro de Inteligencia Financiera (sesion 10)\n- Dashboard predictivo Power BI + Claude\n- Sistema de alertas automaticas de morosidad\n- Automatizacion conciliacion bancaria\n\n### Slide 8: Proyectos Mes 2-3\n- Scoring crediticio con IA\n- Chatbot interno para consultas del equipo\n- Reporteria regulatoria semi-automatizada\n- Portal de autoservicio para clientes basicos\n\n### Slide 9: KPIs del Plan de 90 Dias\n- Horas liberadas: meta 40h/mes\n- Reportes automatizados: meta 80% del total\n- Tiempo decision crediticia: meta -60%\n- Satisfaccion equipo: meta 8/10\n- ROI herramientas: meta 3:1 minimo\n\n### Slide 10: Ejercicio de Hoy\n- Cada participante audita su area (30 min)\n- Consolidar las 5 auditorias (20 min)\n- Construir tabla de presupuesto detallada\n- Priorizar top 10 proyectos para 90 dias`.trim() },
  { sessionId: '585b728e-66fd-4a46-b1b0-ee233aa4f20e', title: 'Plan de 90 Dias + Gestion del Cambio', inputText: `# Plan de 90 Dias + Gestion del Cambio en IDCE\n## IA Aplicada para Banca — IDCE | Sesion 14\n\n### Slide 1: Plan sin Gestion del Cambio = Papel Bonito\n- 70% de transformaciones digitales fallan (McKinsey)\n- #1 razon de fracaso: resistencia al cambio\n- La tecnologia es facil — las personas son el reto\n- Este plan incluye ambos: tecnologia + personas\n\n### Slide 2: Estructura del Documento Final\n- 1. Resumen Ejecutivo\n- 2. Diagnostico de Madurez (sesion 2)\n- 3. Mapa de Oportunidades (sesion 13)\n- 4. Plan de 90 Dias (3 fases)\n- 5. Presupuesto ($204/mes)\n- 6. KPIs de Exito\n- 7. Gestion de Riesgos\n- 8. Plan Post-90-Dias\n\n### Slide 3: Fase 1 — Quick Wins (Dias 1-30)\n- Implementar 3-4 automatizaciones inmediatas\n- Reportes, minutas, evaluacion crediticia basica\n- Meta: el equipo ve resultados rapidos y se motiva\n- Inversion: $204/mes + 10h configuracion\n\n### Slide 4: Fase 2 — Integracion (Dias 31-60)\n- Centro de Inteligencia operativo\n- Dashboard predictivo en produccion\n- Scoring crediticio con IA piloto\n- Meta: IA integrada en flujos diarios\n\n### Slide 5: Fase 3 — Optimizacion (Dias 61-90)\n- Medir KPIs vs linea base\n- Ajustar y escalar lo que funciona\n- Documentar procesos para sostenibilidad\n- Preparar plan de expansion post-90-dias\n\n### Slide 6: Las 5 Reglas de Gestion del Cambio\n- 1. Liderazgo visible: Julio debe ser el champion IA\n- 2. Comunicacion constante: por que hacemos esto?\n- 3. Wins tempranos: mostrar resultados en semana 1\n- 4. Capacitacion continua: no solo este curso\n- 5. Medir y celebrar: compartir logros del equipo\n\n### Slide 7: El Rol del Champion IA\n- Una persona del equipo es el "champion"\n- Evangeliza las herramientas IA internamente\n- Primera linea de soporte para el equipo\n- Reporta avances a gerencia mensualmente\n- Identifica nuevas oportunidades de automatizacion\n\n### Slide 8: Gestion de Riesgos\n- Riesgo 1: Resistencia del equipo → training + quick wins\n- Riesgo 2: Dependencia de herramientas → documentar procesos\n- Riesgo 3: Errores de IA → human-in-the-loop siempre\n- Riesgo 4: Costos crecen → techo presupuestario $300/mes\n- Riesgo 5: Regulador cuestiona → documentacion completa\n\n### Slide 9: ROI Proyectado a 12 Meses\n- Mes 1-3: inversion neta $612 + tiempo configuracion\n- Mes 4-12: ahorro neto $200-300/mes\n- Ahorro anual estimado: $2,400-3,600\n- Beneficios intangibles: velocidad, precision, moral equipo\n- ROI total: 4-6x la inversion\n\n### Slide 10: Ejercicio de Hoy\n- Generar documento profesional completo con Claude\n- 8 secciones del plan con datos reales de IDCE\n- Agregar seccion de Gestion del Cambio\n- Validar con instructor antes de finalizar`.trim() },
  { sessionId: '954f71cb-64a7-418a-ac71-3d28c7f3ff19', title: 'Examen Teorico + Preparacion Presentaciones', inputText: `# Examen Teorico + Preparacion de Presentaciones\n## IA Aplicada para Banca — IDCE | Sesion 15\n\n### Slide 1: Estructura de la Sesion\n- Parte 1 (60 min): Examen teorico — 30 preguntas\n- Parte 2 (60 min): Preparacion de presentacion final\n- El examen vale 40% de la nota final\n- La presentacion vale 40% de la nota final\n\n### Slide 2: Formato del Examen\n- 30 preguntas opcion multiple\n- Modulos 1-2: 8 preguntas (estrategia, herramientas)\n- Modulos 3-4: 7 preguntas (automatizacion, analytics)\n- Modulos 5-6: 8 preguntas (casos practicos)\n- Modulos 7-8: 7 preguntas (plan, implementacion)\n\n### Slide 3: Temas Clave a Repasar\n- Niveles de madurez IA (5 niveles)\n- Herramientas: cuando usar ChatGPT vs Claude vs Perplexity\n- ROI de automatizacion: como calcularlo\n- Regulaciones: SBS, LOPDP, Basilea\n- Human-in-the-loop: por que es obligatorio\n\n### Slide 4: Estructura de la Presentacion Final\n- 10 minutos por participante\n- 8 slides recomendadas\n- Foco: tu proyecto IA aplicado a IDCE\n- Debe incluir: problema, solucion, demo, resultados, ROI\n\n### Slide 5: Template de 8 Slides\n- Slide 1: El Problema (que duele en tu area)\n- Slide 2: La Solucion IA (que herramienta, como)\n- Slide 3: Demo en Vivo (mostrar funcionando)\n- Slide 4: Resultados Obtenidos (datos concretos)\n- Slide 5: ROI Calculado (numeros reales)\n\n### Slide 6: Template (continuacion)\n- Slide 6: Lecciones Aprendidas (que salio bien/mal)\n- Slide 7: Proximos Pasos (escalabilidad)\n- Slide 8: Preguntas y Discusion\n- Tiempo: 8 min presentacion + 2 min preguntas\n\n### Slide 7: Rubrica de Evaluacion\n- Claridad del problema (20%)\n- Calidad de la solucion IA (25%)\n- Demo funcional (20%)\n- Impacto y ROI (20%)\n- Presentacion y comunicacion (15%)\n\n### Slide 8: Tips para la Presentacion\n- Empieza con el impacto, no con la tecnologia\n- Muestra numeros: antes vs despues\n- La demo en vivo impresiona mas que screenshots\n- Si la demo falla, ten backup en screenshots\n- Habla de lo que aprendiste, no solo de lo que hiciste\n\n### Slide 9: Storytelling con Datos\n- "Antes tardaba 4 horas, ahora tarda 15 minutos"\n- "Detectamos 3 creditos de riesgo que no veiamos"\n- "El equipo paso de Excel manual a dashboard predictivo"\n- Los datos cuentan la historia — tu la narras\n\n### Slide 10: Preparacion — Empieza Ahora\n- Elige tu mejor proyecto del curso\n- Crea las 8 slides con Gamma o PowerPoint\n- Practica 2-3 veces con cronometro\n- Pide feedback a un companero\n- Manana: presentaciones finales + certificacion`.trim() },
  { sessionId: 'c5061819-462f-4e7d-938b-b66e72019885', title: 'Presentaciones Finales + Certificacion', inputText: `# Presentaciones Finales + Certificacion + Cierre\n## IA Aplicada para Banca — IDCE | Sesion 16\n\n### Slide 1: La Sesion Final\n- 5 presentaciones individuales (10 min cada una)\n- Presentacion grupal del Plan de 90 Dias\n- Calculo de nota final\n- Entrega de certificados ITSEIA\n- Recursos post-programa\n\n### Slide 2: Orden de Presentaciones\n- Cada participante presenta su proyecto IA\n- Evaluacion: instructor + pares (rubrica definida)\n- Preguntas del equipo despues de cada presentacion\n- Feedback constructivo inmediato\n- El equipo IDCE se convierte en equipo IA\n\n### Slide 3: Evaluacion por Pares\n- Cada participante evalua a los otros 4\n- Rubrica de 5 criterios (claridad, solucion, demo, ROI, comunicacion)\n- Puntuacion 1-5 por criterio\n- Promedio de pares = 20% de la nota\n\n### Slide 4: Presentacion Grupal — Plan 90 Dias\n- El equipo completo presenta el plan a gerencia (Julio)\n- 15 minutos + 10 preguntas\n- Estructura: diagnostico, quick wins, timeline, presupuesto, KPIs\n- Este plan se implementa a partir de manana\n\n### Slide 5: Calculo de Nota Final\n- 40% Examen teorico (sesion 15)\n- 40% Proyecto individual (presentacion + demo)\n- 20% Plan grupal de 90 dias\n- Aprobacion minima: 70/100\n- Todos los participantes que aprueben reciben certificado\n\n### Slide 6: Lo Que IDCE Logro en 4 Semanas\n- De nivel 2 (experimental) a nivel 3 (operacional)\n- 3+ automatizaciones funcionando\n- Centro de Inteligencia operativo\n- Plan de 90 dias documentado y aprobado\n- 5 profesionales capacitados en IA aplicada a banca\n\n### Slide 7: Certificado ITSEIA\n- "IA Aplicada para Banca — IDCE"\n- 32 horas de capacitacion\n- Certificado digital con QR verificable\n- Emitido por ITSEIA Academy\n- Validez: permanente\n\n### Slide 8: Recursos Post-Programa\n- Acceso permanente al campus virtual ITSEIA\n- Comunidad alumni ITSEIA (WhatsApp/Slack)\n- Actualizaciones trimestrales de contenido\n- Soporte tecnico 30 dias post-programa\n- Descuento 20% en futuros cursos ITSEIA\n\n### Slide 9: Que Sigue para IDCE\n- Semana 1-2: Implementar quick wins del plan\n- Mes 1: Revisar KPIs iniciales\n- Mes 3: Evaluacion completa del plan de 90 dias\n- Mes 6: Considerar expansion a nivel 4 (estrategico)\n- ITSEIA disponible para soporte y consultoria\n\n### Slide 10: Gracias y Adelante\n- IDCE: de los primeros en Ecuador en capacitar su equipo en IA\n- El futuro de la banca es inteligente — ustedes ya lo son\n- "El futuro no se espera. Se construye." — Hector Velasco\n- Contacto ITSEIA: administracion@itseia.ai\n- WhatsApp: +593 95 989 2034`.trim() }
];

// ── Gamma API helpers ────────────────────────────────────────────────────────

async function gammaCreate(inputText) {
  const body = {
    inputText,
    textMode: 'preserve',
    format: 'presentation',
    numCards: 10,
    exportAs: 'pdf',
    textOptions: {
      tone: 'professional, educational, clear, data-driven',
      amount: 'medium',
      language: 'es-419'
    },
    imageOptions: {
      source: 'pictographic'
    }
  };

  const res = await fetch(GAMMA_BASE + '/generations', {
    method: 'POST',
    headers: GAMMA_HEADERS,
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Gamma POST failed (${res.status}): ${JSON.stringify(data).substring(0, 300)}`);
  return data;
}

async function gammaPoll(generationId, maxWaitMs = 300000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await sleep(8000);
    const res = await fetch(`${GAMMA_BASE}/generations/${generationId}`, { headers: GAMMA_HEADERS });
    const data = await res.json();
    if (!res.ok) throw new Error(`Gamma poll failed (${res.status})`);

    const status = data.status || data.generation?.status;
    const exportUrl = data.exportUrl || data.generation?.exportUrl;
    const gammaUrl = data.gammaUrl || data.generation?.gammaUrl || data.url || data.generation?.url;

    console.log(`    Polling... status=${status}`);
    if (status === 'completed' || status === 'complete') return { exportUrl, gammaUrl };
    if (status === 'failed' || status === 'error') throw new Error(`Gamma generation failed`);
  }
  throw new Error(`Gamma generation timed out`);
}

async function updateSupabaseSession(sessionId, slidesUrl) {
  const res = await fetch(`${SUPA_BASE}/sessions?id=eq.${sessionId}`, {
    method: 'PATCH',
    headers: SUPA_HEADERS,
    body: JSON.stringify({ slides_url: slidesUrl, slides_type: 'pdf' })
  });
  if (!res.ok) throw new Error(`Supabase PATCH failed (${res.status})`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== ITSEIA — Generando 16 Presentaciones IDCE ===');
  console.log(`Inicio: ${new Date().toISOString()}\n`);

  let ok = 0, errors = 0;

  for (let i = 0; i < PRESENTATIONS.length; i++) {
    const p = PRESENTATIONS[i];
    const idx = String(i + 1).padStart(2, '0');
    console.log(`[${idx}/16] ${p.title}`);

    try {
      const created = await gammaCreate(p.inputText);
      const genId = created.id || created.generationId || created.generation?.id;
      if (!genId) throw new Error(`No generationId: ${JSON.stringify(created).substring(0, 200)}`);

      console.log(`    Generation ID: ${genId}`);
      const result = await gammaPoll(genId);
      const slidesUrl = result.exportUrl || result.gammaUrl;

      console.log(`    URL: ${slidesUrl}`);
      await updateSupabaseSession(p.sessionId, slidesUrl);
      console.log(`    DB actualizada OK\n`);
      ok++;
    } catch (err) {
      console.error(`    ERROR: ${err.message}\n`);
      errors++;
    }

    if (i < PRESENTATIONS.length - 1) await sleep(3000);
  }

  console.log(`\n=== RESULTADO: ${ok} exitosas, ${errors} errores ===`);
  if (errors > 0) process.exit(1);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
