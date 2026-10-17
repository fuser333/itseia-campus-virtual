#!/usr/bin/env node
/**
 * Load Corporate B2B programs into ITSEIA Academy
 * Program 1: "Capacitacion IA para Equipos" ($3,000) — 1 semester, 4 subjects, 8 sessions
 * Program 2: "Transformacion Digital con IA" ($8,000) — 1 semester, 6 subjects, 18 sessions
 * Run: node content/load_corporate.js
 */

const BASE = "https://wqlselfapnggxxeziruo.supabase.co/rest/v1";
const SKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc";
const H = {"apikey":SKEY,"Authorization":"Bearer "+SKEY,"Content-Type":"application/json","Prefer":"return=representation"};
const Hm = {"apikey":SKEY,"Authorization":"Bearer "+SKEY,"Content-Type":"application/json","Prefer":"return=minimal"};

async function post(url, body) {
  const r = await fetch(url, {method:"POST",headers:H,body:JSON.stringify(body)});
  const data = await r.json();
  if (r.status !== 201) throw new Error("POST failed ("+r.status+"): "+JSON.stringify(data).substring(0,200));
  return Array.isArray(data) ? data[0] : data;
}

async function postMin(url, body) {
  const r = await fetch(url, {method:"POST",headers:Hm,body:JSON.stringify(body)});
  if (r.status !== 201) { const t = await r.text(); throw new Error("POST failed ("+r.status+"): "+t.substring(0,200)); }
}

// ============================================
// PROGRAM 1: Capacitacion IA para Equipos ($3,000)
// ============================================

const PROGRAM_TEAM = {
  name: "Capacitacion IA para Equipos",
  slug: "capacitacion-ia-equipos",
  description: "Programa ejecutivo de 1 mes para equipos corporativos. Transforma la productividad de tu equipo con IA aplicada a decision making, automatizacion, datos y estrategia de implementacion.",
  price: 3000,
  duration_months: 1,
  semester: { name: "Programa Ejecutivo", level: "professional" },
  subjects: [
    {
      code: "CORP-DEC1", name: "IA para Decision Making", slug: "corp-ia-decision-making",
      description: "Usa IA como copiloto para tomar mejores decisiones empresariales",
      sessions: [
        { title: "IA como herramienta de decision ejecutiva",
          theory: "# IA para Decision Making Ejecutivo\n\nLa IA no reemplaza la intuicion empresarial, la potencia con datos.\n\n## Tipos de decisiones asistidas por IA\n- **Operativas:** que inventario pedir, a quien cobrar primero\n- **Tacticas:** donde invertir el presupuesto de marketing\n- **Estrategicas:** en que mercado expandirse\n\n## Herramientas clave\n- **ChatGPT/Claude:** analisis de escenarios, pros/contras, frameworks\n- **Power BI + AI:** dashboards predictivos\n- **Scenario Planning:** pedir a la IA simular 3 escenarios\n\n## Framework de decision con IA\n1. Definir la pregunta claramente\n2. Alimentar contexto relevante a la IA\n3. Pedir multiples perspectivas\n4. Validar con datos reales\n5. Decidir (el humano siempre decide)\n\n## Ejemplo\n\"Deberiamos lanzar producto X en el mercado ecuatoriano?\"\n→ Prompt: analiza tamano de mercado, competencia, regulacion, riesgos. Da recomendacion con nivel de confianza.\n\nLa IA reduce tiempo de analisis de dias a horas. La decision final siempre es humana.",
          quiz: [{q:"Quien toma la decision final cuando se usa IA?",a:"La IA",b:"El humano",c:"Ambos por igual",correct:"b",exp:"La IA asiste, el humano decide."},
                 {q:"Que tipo de decision es 'en que mercado expandirse'?",a:"Operativa",b:"Tactica",c:"Estrategica",correct:"c",exp:"Expansion de mercado es una decision estrategica."},
                 {q:"Primer paso del framework de decision con IA?",a:"Pedir respuesta",b:"Definir la pregunta claramente",c:"Validar datos",correct:"b",exp:"Sin pregunta clara, la IA genera respuestas vagas."}]
        },
        { title: "Casos de uso: dashboards y analisis predictivo",
          theory: "# Dashboards y Analisis Predictivo con IA\n\n## Power BI + IA\n```\n1. Conectar fuentes de datos (ERP, CRM, hojas)\n2. AI Insights: deteccion automatica de tendencias\n3. Q&A: preguntar en lenguaje natural\n4. Forecasting: proyecciones con un clic\n```\n\n## ChatGPT para analisis\n```\nPrompt: \"Tengo datos de ventas mensuales por region [pegar tabla]. \nIdentifica: tendencias, anomalias, top 3 regiones con mayor crecimiento, \ny predice el proximo trimestre con 3 escenarios.\"\n```\n\n## Casos reales en LATAM\n- **Retail:** prediccion de demanda → reduccion de inventario muerto 25%\n- **Banca:** scoring crediticio con ML → 40% menos morosidad\n- **Logistica:** optimizacion de rutas → 15% ahorro en combustible\n- **RRHH:** prediccion de rotacion → intervenir antes de la renuncia\n\n## ROI tipico\nEmpresas que adoptan IA para decisiones reportan 20-35% mejora en velocidad de decision y 15-25% mejora en resultados.\n\nEl ROI de IA no se mide solo en dinero, tambien en tiempo de decision.",
          quiz: [{q:"Power BI Q&A permite?",a:"Solo graficos",b:"Preguntar en lenguaje natural",c:"Solo tablas",correct:"b",exp:"Q&A interpreta preguntas naturales y genera visualizaciones."},
                 {q:"Reduccion tipica de inventario muerto con IA en retail?",a:"5%",b:"25%",c:"50%",correct:"b",exp:"Prediccion de demanda reduce exceso en ~25%."},
                 {q:"Mejora tipica en velocidad de decision con IA?",a:"5-10%",b:"20-35%",c:"50-70%",correct:"b",exp:"20-35% mas rapido en analisis y decision."}]
        }
      ]
    },
    {
      code: "CORP-AUT1", name: "Automatizacion con IA", slug: "corp-automatizacion-ia",
      description: "Automatiza procesos repetitivos del equipo con herramientas de IA",
      sessions: [
        { title: "Identificar procesos automatizables",
          theory: "# Identificar Procesos Automatizables\n\nNo todo se debe automatizar. Hay que priorizar.\n\n## Matriz de priorizacion\n| Criterio | Alto | Bajo |\n|----------|------|------|\n| Volumen | +100 veces/mes | <10 veces/mes |\n| Reglas claras | Si/No binario | Juicio experto |\n| Tiempo por tarea | >15 min | <2 min |\n| Riesgo de error | Alto y costoso | Bajo impacto |\n\n## Procesos ideales para IA\n- Emails de respuesta a clientes frecuentes\n- Generacion de reportes periodicos\n- Clasificacion de documentos\n- Extraccion de datos de facturas/contratos\n- Resumir reuniones y generar actas\n\n## Framework de evaluacion\n1. Listar 20 procesos del equipo\n2. Medir tiempo actual de cada uno\n3. Clasificar: automatizable (total/parcial/no)\n4. Calcular ahorro potencial en horas/mes\n5. Priorizar por ROI (ahorro / esfuerzo)\n\n## Regla 80/20\nEl 20% de los procesos consumen 80% del tiempo. Empieza por esos.\n\nAutomatizar lo incorrecto es peor que no automatizar nada.",
          quiz: [{q:"Que criterio hace a un proceso ideal para automatizar?",a:"Poco volumen",b:"Alto volumen + reglas claras",c:"Solo lo complejo",correct:"b",exp:"Alto volumen con reglas claras = maximo ROI."},
                 {q:"Regla 80/20 aplicada a procesos dice?",a:"Automatizar todo",b:"20% de procesos consumen 80% del tiempo",c:"80% es automatizable",correct:"b",exp:"Enfocarse en el 20% de mayor consumo de tiempo."},
                 {q:"Que riesgo tiene automatizar lo incorrecto?",a:"Ninguno",b:"Peor que no automatizar",c:"Solo pierde tiempo",correct:"b",exp:"Automatizar mal genera errores sistematicos a escala."}]
        },
        { title: "Herramientas de automatizacion: Zapier, Make, Power Automate",
          theory: "# Herramientas de Automatizacion con IA\n\n## Zapier + IA\n```\nTrigger: Nuevo email en Gmail\nAction 1: ChatGPT analiza contenido y clasifica\nAction 2: Si es urgente → Slack al equipo\nAction 3: Si es cotizacion → CRM + respuesta automatica\n```\n\n## Microsoft Power Automate\n```\nTrigger: Archivo nuevo en SharePoint\nAction: AI Builder extrae datos de factura\nAction: Crear registro en sistema contable\nAction: Notificar a contabilidad\n```\n\n## Make (Integromat)\nMas flexible que Zapier para flujos complejos.\nConecta: Gmail, Slack, HubSpot, Notion, GPT, hojas de calculo.\n\n## ChatGPT Custom GPTs\nCrear asistentes especializados para el equipo:\n- GPT de onboarding: responde preguntas de nuevos empleados\n- GPT de ventas: genera propuestas personalizadas\n- GPT legal: revisa contratos con checklist\n\n## Costos\n- Zapier Pro: $29.99/mes\n- Make Pro: $16/mes\n- Power Automate: incluido en Microsoft 365\n\nEmpieza con 1 automatizacion, mide impacto, luego escala.",
          quiz: [{q:"Que ventaja tiene Make sobre Zapier?",a:"Es gratis",b:"Mas flexible para flujos complejos",c:"Mas rapido",correct:"b",exp:"Make permite flujos con bifurcaciones y logica compleja."},
                 {q:"Custom GPTs sirven para?",a:"Entrenar modelos",b:"Crear asistentes especializados sin codigo",c:"Reemplazar empleados",correct:"b",exp:"GPTs personalizados para tareas especificas del equipo."},
                 {q:"Cual herramienta esta incluida en Microsoft 365?",a:"Zapier",b:"Make",c:"Power Automate",correct:"c",exp:"Power Automate viene con licencias de Microsoft 365."}]
        }
      ]
    },
    {
      code: "CORP-DAT1", name: "Datos y Analytics", slug: "corp-datos-analytics",
      description: "Cultura de datos y analytics para equipos no tecnicos",
      sessions: [
        { title: "Cultura data-driven para equipos",
          theory: "# Cultura Data-Driven\n\nNo se trata de tecnologia, se trata de cultura.\n\n## Los 4 niveles de madurez analitica\n1. **Descriptivo:** Que paso? (reportes, dashboards)\n2. **Diagnostico:** Por que paso? (drill-down, analisis)\n3. **Predictivo:** Que va a pasar? (ML, forecasting)\n4. **Prescriptivo:** Que debemos hacer? (optimizacion, recomendaciones)\n\n## La mayoria de empresas estan en nivel 1-2. El salto a 3-4 es donde la IA transforma.\n\n## Barreras comunes\n- Datos en silos (cada area tiene sus propios datos)\n- No confiar en los datos (\"yo se mejor\")\n- Falta de KPIs claros\n- Analisis paralisis (demasiados datos, poca accion)\n\n## Como construir cultura data-driven\n1. Definir 3-5 KPIs por area\n2. Dashboard visible para todos\n3. Reuniones semanales con datos (no opiniones)\n4. Celebrar decisiones basadas en datos\n5. Capacitar al equipo en herramientas basicas\n\nCambiar cultura toma 6-12 meses. La tecnologia se instala en semanas, el habito toma meses.",
          quiz: [{q:"En que nivel analitico esta la mayoria de empresas?",a:"1-2 (descriptivo/diagnostico)",b:"3-4 (predictivo/prescriptivo)",c:"Todos los niveles",correct:"a",exp:"La mayoria solo hace reportes y analisis basicos."},
                 {q:"Mayor barrera para ser data-driven?",a:"Tecnologia",b:"Cultura (datos en silos, no confiar)",c:"Presupuesto",correct:"b",exp:"La cultura organizacional es la principal barrera."},
                 {q:"Cuanto toma cambiar cultura data-driven?",a:"1 semana",b:"1 mes",c:"6-12 meses",correct:"c",exp:"Los habitos organizacionales cambian lentamente."}]
        },
        { title: "KPIs, metricas y visualizacion ejecutiva",
          theory: "# KPIs y Visualizacion Ejecutiva\n\n## Definir buenos KPIs\nUn buen KPI es:\n- **Especifico:** no \"mejorar ventas\" sino \"incrementar MRR 15%\"\n- **Medible:** tiene numero y fuente de datos\n- **Accionable:** el equipo puede influir en el\n- **Relevante:** conectado a objetivos de negocio\n- **Temporal:** con fecha limite\n\n## KPIs por area\n- **Ventas:** MRR, CAC, LTV, conversion rate, pipeline\n- **Marketing:** CPL, CTR, ROAS, engagement rate\n- **Operaciones:** lead time, eficiencia, downtime\n- **RRHH:** rotacion, NPS empleado, tiempo contratacion\n- **Finanzas:** margen bruto, EBITDA, burn rate\n\n## Dashboard ejecutivo ideal\n- Maximo 6-8 metricas en pantalla principal\n- Colores: verde (bien), amarillo (atencion), rojo (accion)\n- Tendencia (vs mes anterior, vs meta)\n- Drill-down disponible pero no visible\n\n## Herramientas\n- Google Looker Studio (gratis)\n- Power BI (Microsoft)\n- Tableau (enterprise)\n\nSi tu dashboard necesita explicacion, esta mal disenado.",
          quiz: [{q:"Cuantas metricas maximo en dashboard ejecutivo?",a:"3-4",b:"6-8",c:"15-20",correct:"b",exp:"6-8 metricas mantienen foco sin sobrecargar."},
                 {q:"Que significa que un KPI sea 'accionable'?",a:"Es automatico",b:"El equipo puede influir en el",c:"Se mide solo",correct:"b",exp:"Si nadie puede cambiar el KPI, no es util."},
                 {q:"Si un dashboard necesita explicacion?",a:"Es completo",b:"Esta bien",c:"Esta mal disenado",correct:"c",exp:"Un buen dashboard se entiende en 5 segundos."}]
        }
      ]
    },
    {
      code: "CORP-IMP1", name: "Implementacion IA en la Empresa", slug: "corp-implementacion-ia",
      description: "Plan de accion para implementar IA en tu organizacion",
      sessions: [
        { title: "Roadmap de implementacion de IA",
          theory: "# Roadmap de Implementacion de IA\n\n## Fase 1: Quick Wins (Semana 1-2)\n- Adoptar ChatGPT/Claude para tareas individuales\n- Automatizar 1 proceso con Zapier/Make\n- Crear 1 Custom GPT para el equipo\n- Medir: horas ahorradas por persona\n\n## Fase 2: Equipos (Mes 1-2)\n- Dashboard con IA insights (Power BI)\n- Automatizar 3-5 procesos criticos\n- Entrenar al 80% del equipo en herramientas IA\n- Medir: productividad por area\n\n## Fase 3: Organizacion (Mes 3-6)\n- Integrar IA en procesos core del negocio\n- Desarrollar o comprar modelos ML especificos\n- Governance de datos y IA (politicas de uso)\n- Medir: impacto en P&L\n\n## Presupuesto referencial\n| Item | Costo mensual |\n|------|---------------|\n| ChatGPT Team (10 usuarios) | $250 |\n| Zapier Pro | $30 |\n| Power BI Pro (10 licencias) | $100 |\n| Capacitacion (ITSEIA) | Variable |\n| **Total** | **~$380/mes** |\n\nROI tipico: 5-10x la inversion en el primer ano.\n\nEmpieza pequeno, mide todo, escala lo que funciona.",
          quiz: [{q:"Que hacer en la primera semana de implementacion?",a:"Comprar software costoso",b:"Quick wins: ChatGPT + 1 automatizacion",c:"Contratar equipo de datos",correct:"b",exp:"Quick wins generan momentum y buy-in del equipo."},
                 {q:"ROI tipico de IA en empresas en el primer ano?",a:"1-2x",b:"5-10x",c:"20-50x",correct:"b",exp:"5-10x sobre la inversion es comun en el primer ano."},
                 {q:"Cual es la regla principal de implementacion?",a:"Implementar todo de una vez",b:"Empezar pequeno, medir, escalar",c:"Solo tecnologia",correct:"b",exp:"Iteracion medida evita fracasos costosos."}]
        },
        { title: "Gobierno de IA y politicas de uso responsable",
          theory: "# Gobierno de IA en la Empresa\n\n## Por que es necesario\n- Riesgo de filtrar datos confidenciales a IAs publicas\n- Sesgos en decisiones automatizadas\n- Cumplimiento regulatorio (LOPDP Ecuador)\n- Reputacion de la empresa\n\n## Politica de uso de IA (template)\n1. **Datos permitidos:** NO compartir datos personales, financieros sensibles o secretos comerciales con IAs publicas\n2. **Revision humana:** toda decision critica asistida por IA requiere aprobacion humana\n3. **Transparencia:** informar cuando contenido fue generado por IA\n4. **Auditoria:** registrar uso de IA en procesos criticos\n5. **Capacitacion:** todo empleado recibe formacion antes de usar IA\n\n## LOPDP Ecuador\n- Ley Organica de Proteccion de Datos Personales\n- Consentimiento para procesar datos personales\n- Derecho de los individuos a saber si IA tomo decisiones sobre ellos\n- Multas: hasta 1% del ingreso anual\n\n## Roles recomendados\n- **AI Champion:** lider interno de adopcion\n- **Data Steward:** responsable de calidad de datos\n- **Comite de IA:** revisa casos de uso nuevos\n\nGobierno de IA no frena la innovacion, la hace sostenible.",
          quiz: [{q:"Mayor riesgo de usar IAs publicas sin politica?",a:"Costo alto",b:"Filtrar datos confidenciales",c:"Perder tiempo",correct:"b",exp:"Empleados pueden compartir datos sensibles sin saberlo."},
                 {q:"Multa maxima por LOPDP Ecuador?",a:"$10,000",b:"1% del ingreso anual",c:"$1 millon",correct:"b",exp:"La LOPDP establece multas proporcionales al ingreso."},
                 {q:"Gobierno de IA frena la innovacion?",a:"Si, siempre",b:"No, la hace sostenible",c:"No es necesario",correct:"b",exp:"Politicas claras permiten innovar con confianza."}]
        }
      ]
    }
  ]
};

// ============================================
// PROGRAM 2: Transformacion Digital con IA ($8,000)
// ============================================

const PROGRAM_ENTERPRISE = {
  name: "Transformacion Digital con IA",
  slug: "transformacion-digital-ia",
  description: "Programa enterprise de 3 meses para liderar la transformacion digital de tu organizacion con IA. Estrategia, gobierno de datos, ML aplicado, automatizacion de procesos, gestion del cambio y proyecto real de transformacion.",
  price: 8000,
  duration_months: 3,
  semester: { name: "Programa Enterprise", level: "professional" },
  subjects: [
    {
      code: "ENT-EST1", name: "Estrategia IA", slug: "ent-estrategia-ia",
      description: "Disenar la estrategia de IA alineada con objetivos de negocio",
      sessions: [
        { title: "Analisis de madurez digital y oportunidades",
          theory: "# Analisis de Madurez Digital\n\nAntes de implementar IA, evalua donde estas.\n\n## Framework de Madurez (5 niveles)\n1. **Ad-hoc:** sin procesos digitales formales\n2. **Emergente:** Excel, email, herramientas basicas\n3. **Definido:** CRM, ERP, procesos documentados\n4. **Gestionado:** datos centralizados, dashboards, KPIs\n5. **Optimizado:** IA integrada, decisiones data-driven, automatizacion\n\n## Evaluacion rapida (10 preguntas)\n- Tienen CRM? ERP? Base de datos centralizada?\n- Cuanto tiempo toma generar un reporte?\n- Cuantos procesos son manuales vs automatizados?\n- El equipo usa herramientas de IA regularmente?\n- Existe presupuesto para tecnologia?\n\n## Mapa de oportunidades\nPor cada area de la empresa:\n1. Listar procesos principales\n2. Clasificar: manual/semi-auto/automatizado\n3. Identificar dolor (tiempo, errores, costo)\n4. Evaluar factibilidad de IA (datos disponibles, complejidad)\n5. Priorizar por impacto vs esfuerzo\n\nLa mayoria de empresas ecuatorianas estan en nivel 2-3. El salto a nivel 4-5 es donde ITSEIA aporta.",
          quiz: [{q:"Nivel de madurez donde la mayoria de empresas ecuatorianas estan?",a:"1-2",b:"2-3",c:"4-5",correct:"b",exp:"Usan Excel y herramientas basicas, pero sin IA integrada."},
                 {q:"Que evaluar primero antes de implementar IA?",a:"Que modelo usar",b:"Nivel de madurez digital actual",c:"Presupuesto de IA",correct:"b",exp:"Sin diagnostico, la solucion puede no encajar."},
                 {q:"Como priorizar oportunidades de IA?",a:"Lo mas nuevo",b:"Impacto vs esfuerzo",c:"Lo mas barato",correct:"b",exp:"Matriz de impacto vs esfuerzo optimiza recursos."}]
        },
        { title: "Caso de negocio y ROI de IA",
          theory: "# Caso de Negocio y ROI de IA\n\n## Construir el business case\n```\nROI = (Beneficio - Costo) / Costo x 100\n```\n\n## Beneficios cuantificables\n- Horas ahorradas x costo por hora\n- Errores evitados x costo por error\n- Revenue incremental por mejor conversion\n- Churn reducido x LTV del cliente\n\n## Ejemplo: Automatizar atencion al cliente\n| Metrica | Antes | Con IA | Ahorro |\n|---------|-------|--------|--------|\n| Tickets/mes | 2,000 | 2,000 | - |\n| Resueltos por IA | 0 | 1,200 (60%) | - |\n| Tiempo promedio | 15 min | 2 min (IA) | 13 min |\n| Costo agente | $5/hora | $5/hora | - |\n| Ahorro mensual | - | - | $3,250 |\n| Costo herramienta | - | $200/mes | - |\n| **ROI mensual** | - | - | **1,525%** |\n\n## Costos tipicos\n- Herramientas IA: $200-2,000/mes\n- Capacitacion: $3,000-10,000 (una vez)\n- Integracion: $5,000-20,000\n- Mantenimiento: 15-20% del costo inicial/ano\n\nSiempre presentar ROI en terminos que el CFO entienda: dolares ahorrados, no metricas tecnicas.",
          quiz: [{q:"Como calcular ROI?",a:"Beneficio / Costo",b:"(Beneficio - Costo) / Costo x 100",c:"Costo / Beneficio",correct:"b",exp:"ROI = ganancia neta sobre inversion, en porcentaje."},
                 {q:"A quien presentar el business case?",a:"Solo IT",b:"CFO y liderazgo en lenguaje financiero",c:"Solo operaciones",correct:"b",exp:"El CFO aprueba presupuesto, necesita ROI en dolares."},
                 {q:"Costo de mantenimiento anual tipico?",a:"5%",b:"15-20%",c:"50%",correct:"b",exp:"15-20% del costo inicial para mantenimiento anual."}]
        },
        { title: "Benchmarking y tendencias IA 2026",
          theory: "# Benchmarking y Tendencias IA 2026\n\n## Adopcion de IA en LATAM\n- 35% de empresas grandes usan IA (vs 55% global)\n- Sectores lideres: banca, retail, telecomunicaciones\n- Sectores rezagados: manufactura, agricultura, gobierno\n- Ecuador esta 3-5 anos detras de Colombia, Chile, Mexico\n\n## Tendencias clave 2026\n1. **IA Generativa en produccion:** de jugar con ChatGPT a integrarlo en workflows\n2. **Agentes IA:** sistemas autonomos que ejecutan tareas multi-paso\n3. **IA on-device:** modelos corriendo en telefono/laptop (privacidad)\n4. **Multimodal:** IA que entiende texto + imagen + audio + video\n5. **Regulacion:** UE AI Act inspirando legislacion en LATAM\n\n## Que hacen los lideres diferente\n- Presupuesto dedicado a IA (2-5% de revenue)\n- Chief AI Officer o equivalente\n- Equipos mixtos: negocio + datos + IA\n- Experimentacion rapida (fail fast)\n- Gobierno de datos antes de gobierno de IA\n\nLas empresas que no adopten IA en los proximos 2 anos perderan competitividad irreversiblemente.",
          quiz: [{q:"Que porcentaje de empresas grandes en LATAM usan IA?",a:"15%",b:"35%",c:"55%",correct:"b",exp:"35% en LATAM vs 55% globalmente."},
                 {q:"Que tendencia va mas alla de chatear con IA?",a:"IA Generativa",b:"Agentes IA autonomos",c:"Chatbots",correct:"b",exp:"Agentes ejecutan tareas multi-paso sin intervencion."},
                 {q:"Presupuesto de IA recomendado?",a:"0.5% revenue",b:"2-5% revenue",c:"10% revenue",correct:"b",exp:"2-5% es el benchmark de empresas lideres."}]
        }
      ]
    },
    {
      code: "ENT-GOB1", name: "Gobierno de Datos", slug: "ent-gobierno-datos",
      description: "Establecer gobierno de datos como base para la IA",
      sessions: [
        { title: "Fundamentos de gobierno de datos",
          theory: "# Gobierno de Datos\n\nSin datos de calidad, la IA es inutil. Basura entra, basura sale.\n\n## Pilares del gobierno de datos\n1. **Calidad:** datos correctos, completos, consistentes\n2. **Seguridad:** quien accede a que datos\n3. **Privacidad:** cumplimiento LOPDP\n4. **Disponibilidad:** datos accesibles cuando se necesitan\n5. **Linaje:** de donde vienen los datos, que transformaciones sufrieron\n\n## Roles clave\n- **Data Owner:** dueno de negocio de los datos (VP, Director)\n- **Data Steward:** responsable operativo de calidad\n- **Data Engineer:** construye pipelines y mantiene infraestructura\n- **DPO:** Oficial de Proteccion de Datos (LOPDP)\n\n## Problemas comunes\n- Datos duplicados entre sistemas\n- Sin single source of truth\n- Excel como base de datos\n- No hay catalogo de datos\n- Nadie sabe que datos existen\n\n## Quick Start\n1. Inventario de fuentes de datos\n2. Definir owner para cada dataset critico\n3. Reglas de calidad basicas (no nulls en campos clave)\n4. Diccionario de datos (que significa cada campo)\n\nInvertir en gobierno de datos antes de IA ahorra 10x en reprocesos.",
          quiz: [{q:"Sin datos de calidad, la IA es?",a:"Mas lenta",b:"Inutil",c:"Mas barata",correct:"b",exp:"GIGO: modelos con datos malos producen resultados malos."},
                 {q:"Quien es el Data Owner?",a:"IT",b:"Lider de negocio responsable de los datos",c:"El CEO",correct:"b",exp:"Data Owner es el VP o Director del area que genera/usa los datos."},
                 {q:"Primer paso del gobierno de datos?",a:"Comprar herramienta",b:"Inventario de fuentes",c:"Contratar DPO",correct:"b",exp:"No puedes gobernar lo que no conoces."}]
        },
        { title: "Data quality y catalogo de datos",
          theory: "# Data Quality y Catalogo de Datos\n\n## Dimensiones de calidad\n- **Completitud:** % de campos con valor (target: >95%)\n- **Exactitud:** datos correctos vs realidad\n- **Consistencia:** mismo dato, mismo valor en todos los sistemas\n- **Oportunidad:** datos actualizados a tiempo\n- **Unicidad:** sin duplicados\n\n## Reglas de calidad automatizadas\n```sql\n-- Emails invalidos\nSELECT COUNT(*) FROM clientes WHERE email NOT LIKE '%@%.%';\n\n-- Duplicados\nSELECT nombre, cedula, COUNT(*) \nFROM clientes \nGROUP BY nombre, cedula \nHAVING COUNT(*) > 1;\n\n-- Nulos en campos criticos\nSELECT COUNT(*) FROM pedidos WHERE monto IS NULL;\n```\n\n## Catalogo de datos\nDocumento vivo que lista:\n- Nombre del dataset\n- Descripcion\n- Owner\n- Frecuencia de actualizacion\n- Campos clave con definiciones\n- Sensibilidad (publico/interno/confidencial/secreto)\n\n## Herramientas\n- Google Data Catalog (gratis con GCP)\n- Apache Atlas (open source)\n- Excel/Notion (para empezar)\n\nUn catalogo de datos es el Google de tu empresa: saber que datos existen y donde estan.",
          quiz: [{q:"Target de completitud de datos?",a:">80%",b:">95%",c:"100%",correct:"b",exp:">95% es el objetivo practico de completitud."},
                 {q:"Para que sirve el catalogo de datos?",a:"Almacenar datos",b:"Documentar que datos existen y donde",c:"Proteger datos",correct:"b",exp:"Es el inventario centralizado de todos los datasets."},
                 {q:"Herramienta simple para empezar catalogo?",a:"Solo software caro",b:"Excel o Notion",c:"No existe simple",correct:"b",exp:"Excel/Notion funciona para empezar, luego migrar."}]
        },
        { title: "Cumplimiento LOPDP y etica de datos",
          theory: "# LOPDP Ecuador y Etica de Datos\n\n## LOPDP (Ley Organica de Proteccion de Datos Personales)\nVigente desde mayo 2023.\n\n## Principios clave\n1. **Legalidad:** base legal para procesar datos\n2. **Consentimiento:** informado, libre, especifico\n3. **Finalidad:** usar datos solo para lo declarado\n4. **Minimizacion:** recoger solo lo necesario\n5. **Exactitud:** datos correctos y actualizados\n6. **Conservacion:** no retener mas tiempo del necesario\n\n## Derechos ARCO+\n- **Acceso:** ver mis datos\n- **Rectificacion:** corregir errores\n- **Cancelacion:** eliminar mis datos\n- **Oposicion:** negar uso para ciertos fines\n- **Portabilidad:** llevar mis datos a otra empresa\n\n## Sanciones\n- Leve: hasta 0.1% ingreso anual\n- Grave: hasta 0.5% ingreso anual\n- Muy grave: hasta 1% ingreso anual\n\n## Para IA en la empresa\n- Informar si IA toma decisiones sobre personas\n- Derecho a explicacion de decisiones automatizadas\n- Evaluacion de impacto en proteccion de datos\n- No perfilar sin consentimiento\n\nCumplir LOPDP no es opcional. Las multas son proporcionales al ingreso.",
          quiz: [{q:"Desde cuando esta vigente la LOPDP?",a:"2020",b:"2023",c:"2025",correct:"b",exp:"La LOPDP entro en vigencia en mayo 2023."},
                 {q:"Que son derechos ARCO+?",a:"Tipo de cifrado",b:"Acceso, Rectificacion, Cancelacion, Oposicion, Portabilidad",c:"Formato de datos",correct:"b",exp:"Derechos fundamentales del titular de datos personales."},
                 {q:"Multa maxima por infraccion muy grave?",a:"$100,000",b:"1% del ingreso anual",c:"Cierre de empresa",correct:"b",exp:"Hasta 1% del ingreso anual bruto de la empresa."}]
        }
      ]
    },
    {
      code: "ENT-ML1", name: "ML para Negocios", slug: "ent-ml-negocios",
      description: "Aplicaciones practicas de Machine Learning en entornos corporativos",
      sessions: [
        { title: "Prediccion de churn y retencion de clientes",
          theory: "# Prediccion de Churn con ML\n\nRetener un cliente cuesta 5x menos que adquirir uno nuevo.\n\n## Que es churn prediction\nIdentificar clientes con alta probabilidad de cancelar para intervenir antes.\n\n## Variables predictoras comunes\n- Frecuencia de uso (disminuyendo = riesgo)\n- Tickets de soporte (aumentando = insatisfaccion)\n- Tiempo desde ultima compra/interaccion\n- Cambios en patron de pago\n- NPS o encuestas de satisfaccion\n\n## Modelo tipico\n```\n1. Definir churn: no compra en 90 dias? Cancelo suscripcion?\n2. Features: ultimos 6 meses de actividad\n3. Modelo: XGBoost o Random Forest\n4. Output: probabilidad de churn por cliente\n5. Accion: top 20% de riesgo → llamada del account manager\n```\n\n## ROI real\n- Empresa SaaS de 1,000 clientes, LTV $2,000\n- Churn rate actual: 5% mensual = 50 clientes = $100K perdidos\n- Modelo reduce churn a 3% = 20 clientes salvados = $40K\n- Costo del modelo: $5K implementacion\n- ROI: 700% en el primer mes\n\nChurn prediction es el caso de uso de ML con ROI mas inmediato.",
          quiz: [{q:"Cuanto mas cuesta adquirir vs retener un cliente?",a:"2x",b:"5x",c:"10x",correct:"b",exp:"Retener cuesta 5x menos que adquirir."},
                 {q:"Que variable indica alto riesgo de churn?",a:"Uso aumentando",b:"Frecuencia de uso disminuyendo",c:"Muchas compras",correct:"b",exp:"Uso decreciente es la senal mas fuerte de churn."},
                 {q:"Que hacer con clientes de alto riesgo?",a:"Esperar",b:"Intervencion proactiva",c:"Descontarlos",correct:"b",exp:"Contactar antes de que cancelen para retener."}]
        },
        { title: "Forecasting de ventas y demanda",
          theory: "# Forecasting con ML\n\nPredecir demanda futura para optimizar operaciones.\n\n## Metodos\n- **Series temporales:** Prophet (Facebook), ARIMA, Exponential Smoothing\n- **ML:** XGBoost con features temporales\n- **Deep Learning:** LSTM para patrones complejos\n\n## Prophet (recomendado para empresas)\n```python\nfrom prophet import Prophet\n\ndf = pd.DataFrame({'ds': fechas, 'y': ventas})\nmodel = Prophet(yearly_seasonality=True)\nmodel.fit(df)\n\nfuture = model.make_future_dataframe(periods=90)\nforecast = model.predict(future)\nmodel.plot(forecast)\n```\n\n## Features para mejorar forecast\n- Dia de semana, mes, trimestre\n- Feriados nacionales Ecuador\n- Eventos especiales (Black Friday, Dia de la Madre)\n- Promociones activas\n- Clima (para ciertos sectores)\n\n## Impacto\n- Inventario: -20% sobrestock\n- Personal: planificar turnos con anticipacion\n- Cash flow: proyecciones financieras mas precisas\n- Compras: negociar mejor con proveedores\n\nUn forecast 10% mas preciso puede ahorrar millones en inventario mal gestionado.",
          quiz: [{q:"Que herramienta de Facebook es popular para forecasting?",a:"ARIMA",b:"Prophet",c:"LSTM",correct:"b",exp:"Prophet fue creado por Facebook para series temporales."},
                 {q:"Que feature mejora predicciones en Ecuador?",a:"Solo historico",b:"Feriados nacionales",c:"Solo tendencia",correct:"b",exp:"Feriados causan picos de demanda predecibles."},
                 {q:"Cuanto puede reducir el sobrestock un buen forecast?",a:"5%",b:"20%",c:"50%",correct:"b",exp:"~20% menos inventario muerto con prediccion precisa."}]
        },
        { title: "Sistemas de recomendacion y personalizacion",
          theory: "# Sistemas de Recomendacion\n\nEl 35% de revenue de Amazon viene de recomendaciones.\n\n## Tipos\n1. **Filtrado colaborativo:** \"usuarios similares a ti compraron...\"\n2. **Basado en contenido:** \"porque compraste X, te gustara Y\"\n3. **Hibrido:** combina ambos (estado del arte)\n\n## Implementacion simple\n```python\nfrom sklearn.metrics.pairwise import cosine_similarity\n\n# Matriz usuario-producto\nuser_product = df.pivot_table(index='user_id', columns='product_id', values='rating')\n\n# Similitud entre productos\nsimilarity = cosine_similarity(user_product.fillna(0).T)\n\n# Recomendar: productos similares a los que el usuario ya compro\n```\n\n## Aplicaciones corporativas\n- E-commerce: productos recomendados\n- Contenido: articulos, cursos, videos\n- B2B: cross-sell de servicios\n- RRHH: candidatos similares a top performers\n- Educacion: siguiente modulo recomendado\n\n## Metricas\n- Precision@K: de K recomendaciones, cuantas son relevantes\n- Recall@K: de items relevantes, cuantos estan en top K\n- NDCG: calidad del ranking\n\nUn buen recomendador puede incrementar conversion 15-30%.",
          quiz: [{q:"Que porcentaje de revenue de Amazon viene de recomendaciones?",a:"10%",b:"35%",c:"60%",correct:"b",exp:"35% del revenue de Amazon es por recomendaciones."},
                 {q:"Filtrado colaborativo se basa en?",a:"Caracteristicas del producto",b:"Comportamiento de usuarios similares",c:"Popularidad",correct:"b",exp:"Usuarios con gustos similares predeciran gustos futuros."},
                 {q:"Incremento de conversion con buen recomendador?",a:"5%",b:"15-30%",c:"50%+",correct:"b",exp:"15-30% es el rango tipico de mejora en conversion."}]
        }
      ]
    },
    {
      code: "ENT-AUT1", name: "Automatizacion Procesos", slug: "ent-automatizacion-procesos",
      description: "Automatizacion avanzada de procesos empresariales con IA",
      sessions: [
        { title: "RPA + IA: automatizacion inteligente",
          theory: "# RPA + IA: Automatizacion Inteligente\n\n## RPA (Robotic Process Automation)\nBots que replican acciones humanas en interfaces.\n\n## RPA tradicional vs RPA + IA\n| Aspecto | RPA Solo | RPA + IA |\n|---------|----------|----------|\n| Reglas | Fijas | Adaptativas |\n| Datos | Estructurados | Estructurados + no estructurados |\n| Excepciones | Falla | Maneja con ML |\n| Ejemplo | Copiar datos A→B | Leer factura, extraer datos, clasificar |\n\n## Herramientas\n- **UiPath:** lider de mercado, AI Center integrado\n- **Automation Anywhere:** fuerte en IQ Bot (OCR+IA)\n- **Power Automate + AI Builder:** ecosistema Microsoft\n- **n8n:** open source, autohosteable\n\n## Proceso de automatizacion\n1. Mapear proceso actual (as-is)\n2. Identificar pasos automatizables\n3. Disenar flujo automatizado (to-be)\n4. Desarrollar y testear\n5. Piloto con grupo reducido\n6. Rollout gradual\n\n## Metricas\n- FTE ahorrados (Full Time Equivalent)\n- Tiempo de procesamiento reducido\n- Tasa de error reducida\n- Satisfaccion del empleado (liberar de tareas repetitivas)\n\nRPA + IA maneja el 80% de excepciones que RPA solo no puede.",
          quiz: [{q:"Que agrega IA al RPA tradicional?",a:"Velocidad",b:"Capacidad de manejar datos no estructurados y excepciones",c:"Menor costo",correct:"b",exp:"IA permite procesar documentos complejos y tomar decisiones."},
                 {q:"Que herramienta de RPA es open source?",a:"UiPath",b:"n8n",c:"Power Automate",correct:"b",exp:"n8n es open source y autohosteable."},
                 {q:"Que mide FTE ahorrados?",a:"Dinero",b:"Equivalente de empleados a tiempo completo liberados",c:"Tiempo",correct:"b",exp:"FTE = cuantos empleados full-time equivale la automatizacion."}]
        },
        { title: "Document AI: extraccion inteligente de documentos",
          theory: "# Document AI\n\nExtraer informacion de documentos automaticamente.\n\n## Tipos de documentos procesables\n- Facturas y notas de credito\n- Contratos y acuerdos\n- Formularios y solicitudes\n- Reportes financieros\n- Historias clinicas\n- Documentos de identidad\n\n## Tecnologias\n- **OCR:** reconocimiento optico de caracteres (texto de imagen)\n- **NER:** reconocimiento de entidades (nombres, fechas, montos)\n- **Document Understanding:** comprender estructura del documento\n\n## Herramientas\n```\nGoogle Document AI → $1.50/1000 paginas\nAWS Textract → $1.50/1000 paginas\nAzure Form Recognizer → $1/1000 paginas\nPaddleOCR → gratis, open source\n```\n\n## Pipeline tipico\n1. Recibir documento (email, upload, scanner)\n2. OCR: extraer texto\n3. Clasificar tipo de documento\n4. Extraer campos clave (NER)\n5. Validar contra reglas de negocio\n6. Ingresar a sistema (ERP, CRM)\n7. Flag excepciones para revision humana\n\nEmpresas gastan 20-30% del tiempo de empleados procesando documentos manualmente.",
          quiz: [{q:"Que porcentaje de tiempo gastan empleados en procesar documentos?",a:"5-10%",b:"20-30%",c:"50%+",correct:"b",exp:"20-30% del tiempo es procesamiento manual de documentos."},
                 {q:"Que hace OCR?",a:"Clasifica documentos",b:"Extrae texto de imagenes",c:"Firma documentos",correct:"b",exp:"OCR convierte imagen de texto a texto digital."},
                 {q:"Cual herramienta de Document AI es gratuita?",a:"AWS Textract",b:"Google Document AI",c:"PaddleOCR",correct:"c",exp:"PaddleOCR es open source y gratuito."}]
        },
        { title: "Chatbots empresariales con RAG",
          theory: "# Chatbots Empresariales con RAG\n\nRAG = Retrieval-Augmented Generation. El chatbot busca informacion interna antes de responder.\n\n## Arquitectura RAG\n```\nPregunta usuario\n  → Buscar en base de conocimiento (embeddings)\n  → Recuperar documentos relevantes (top 5)\n  → Enviar pregunta + contexto al LLM\n  → LLM genera respuesta con fuentes\n```\n\n## Implementacion\n```python\nfrom langchain.vectorstores import Chroma\nfrom langchain.embeddings import OpenAIEmbeddings\nfrom langchain.chat_models import ChatOpenAI\nfrom langchain.chains import RetrievalQA\n\n# 1. Cargar documentos\ndocs = load_documents('manuales/')\n\n# 2. Crear vector store\nvectorstore = Chroma.from_documents(docs, OpenAIEmbeddings())\n\n# 3. Crear chain\nqa = RetrievalQA.from_chain_type(\n    llm=ChatOpenAI(model='gpt-4'),\n    retriever=vectorstore.as_retriever()\n)\n\n# 4. Preguntar\nqa.run('Cual es la politica de devolucion?')\n```\n\n## Casos de uso corporativos\n- Soporte interno: preguntas de RRHH, IT, politicas\n- Soporte cliente: resolver FAQs con documentos reales\n- Ventas: asistente que conoce todo el catalogo\n- Legal: buscar en contratos y regulaciones\n\nRAG elimina alucinaciones porque el LLM responde SOLO con informacion de tu empresa.",
          quiz: [{q:"Que significa RAG?",a:"Random Automated Generation",b:"Retrieval-Augmented Generation",c:"Real AI Generator",correct:"b",exp:"Retrieval-Augmented Generation: buscar + generar."},
                 {q:"Por que RAG reduce alucinaciones?",a:"Usa mejor modelo",b:"Responde solo con informacion recuperada",c:"Es mas lento",correct:"b",exp:"El LLM se basa en documentos reales, no en conocimiento general."},
                 {q:"Caso de uso interno ideal para RAG?",a:"Generar codigo",b:"Responder preguntas de politicas y RRHH",c:"Predecir ventas",correct:"b",exp:"Documentos internos como base de conocimiento del chatbot."}]
        }
      ]
    },
    {
      code: "ENT-CHG1", name: "Change Management", slug: "ent-change-management",
      description: "Gestion del cambio para adopcion exitosa de IA",
      sessions: [
        { title: "Psicologia del cambio y resistencia organizacional",
          theory: "# Psicologia del Cambio\n\nEl 70% de las transformaciones digitales fallan. La razon principal no es tecnologia, es resistencia al cambio.\n\n## Curva de cambio (Kubler-Ross adaptada)\n1. **Shock:** \"Nos van a reemplazar con IA?\"\n2. **Negacion:** \"Esto no aplica a mi trabajo\"\n3. **Frustracion:** \"No funciona, era mejor antes\"\n4. **Depresion:** \"Es demasiado complicado\"\n5. **Experimentacion:** \"Tal vez puedo intentar esto...\"\n6. **Decision:** \"Ok, si funciona para X\"\n7. **Integracion:** \"No puedo creer que no usaba esto antes\"\n\n## Tipo de resistentes\n- **Champions (15%):** adoptan rapidamente, son aliados\n- **Pragmaticos (60%):** esperan ver resultados, luego adoptan\n- **Resistentes (20%):** necesitan tiempo y evidencia\n- **Saboteadores (5%):** se oponen activamente\n\n## Estrategias\n- Champions: empoderarlos como embajadores\n- Pragmaticos: mostrar quick wins con datos\n- Resistentes: one-on-one, entender sus miedos\n- Saboteadores: decision de liderazgo\n\nNo intentes convencer a todos a la vez. Gana a los champions, ellos convenceran a los pragmaticos.",
          quiz: [{q:"Que porcentaje de transformaciones digitales fallan?",a:"30%",b:"50%",c:"70%",correct:"c",exp:"70% falla, principalmente por resistencia al cambio."},
                 {q:"Que porcentaje del equipo son champions naturales?",a:"5%",b:"15%",c:"40%",correct:"b",exp:"~15% adopta rapidamente y puede evangelizar."},
                 {q:"Estrategia para pragmaticos (60% del equipo)?",a:"Obligar",b:"Mostrar quick wins con datos",c:"Ignorar",correct:"b",exp:"Pragmaticos necesitan evidencia de que funciona."}]
        },
        { title: "Plan de comunicacion y capacitacion",
          theory: "# Plan de Comunicacion y Capacitacion\n\n## Plan de comunicacion (5 fases)\n\n### Fase 1: Awareness (Semana 1)\n- Email del CEO: vision de IA en la empresa\n- Town hall: por que, que cambia, que NO cambia\n- FAQ: responder las 10 preguntas mas comunes\n\n### Fase 2: Comprension (Semana 2-3)\n- Demos de herramientas en cada departamento\n- Casos de exito de empresas similares\n- \"Un dia con IA\": sesion practica de 2 horas\n\n### Fase 3: Adopcion (Mes 1-2)\n- Capacitacion por rol (no generica)\n- Buddy system: champion + 3 pragmaticos\n- Concurso de mejores usos de IA\n\n### Fase 4: Normalizacion (Mes 3-4)\n- IA en procesos diarios\n- Metricas de uso y ahorro\n- Reconocimiento publico de early adopters\n\n### Fase 5: Optimizacion (Mes 5+)\n- Feedback loop continuo\n- Identificar nuevos casos de uso\n- Escalar lo que funciona\n\n## Reglas de capacitacion\n- Por rol, no generica (el contador no necesita saber Python)\n- Practica > teoria (80% hands-on)\n- En horario laboral (no \"extra\")\n- Certificacion interna como incentivo\n\nLa comunicacion transparente reduce resistencia 40%.",
          quiz: [{q:"Primera accion del plan de comunicacion?",a:"Capacitacion tecnica",b:"Email del CEO con vision",c:"Comprar herramientas",correct:"b",exp:"El liderazgo visible genera confianza y urgencia."},
                 {q:"Que es el buddy system?",a:"IA como companero",b:"Champion emparejado con pragmaticos",c:"Equipo de soporte",correct:"b",exp:"Un champion guia a 3 pragmaticos en la adopcion."},
                 {q:"Capacitacion debe ser?",a:"Generica para todos",b:"Por rol, 80% practica",c:"Solo online",correct:"b",exp:"Cada rol necesita herramientas y casos distintos."}]
        },
        { title: "Metricas de adopcion y mejora continua",
          theory: "# Metricas de Adopcion\n\nLo que no se mide no se mejora.\n\n## KPIs de adopcion de IA\n\n### Uso\n- % de empleados usando herramientas IA semanalmente\n- Numero de consultas a IA por semana\n- Automatizaciones activas por departamento\n\n### Impacto\n- Horas ahorradas por empleado por semana\n- Reduccion de errores (%)\n- Velocidad de procesos (antes vs despues)\n- Satisfaccion del empleado (encuesta)\n\n### Negocio\n- Revenue impactado por IA\n- Costos reducidos\n- Time-to-market de productos/decisiones\n- NPS de clientes\n\n## Dashboard de adopcion\n```\nSemana | Usuarios activos | Horas ahorradas | Errores evitados\n  1    |     15 (12%)     |      23         |       8\n  4    |     45 (35%)     |      112        |       32\n  8    |     78 (60%)     |      289        |       67\n  12   |     98 (76%)     |      445        |       89\n```\n\n## Mejora continua\n- Retrospectiva mensual: que funciona, que no\n- Identificar nuevos quick wins cada mes\n- Actualizar capacitacion con nuevas herramientas\n- Benchmark: comparar con trimestre anterior\n\nMeta: 80% de empleados usando IA semanalmente en 6 meses.",
          quiz: [{q:"Meta de adopcion de IA a 6 meses?",a:"50%",b:"80%",c:"100%",correct:"b",exp:"80% de empleados usando IA semanalmente es realista."},
                 {q:"Que mide 'horas ahorradas por empleado'?",a:"Productividad de la IA",b:"Impacto directo en tiempo del equipo",c:"Costo de la IA",correct:"b",exp:"Metrica tangible de valor para cada persona."},
                 {q:"Frecuencia de retrospectiva recomendada?",a:"Semanal",b:"Mensual",c:"Trimestral",correct:"b",exp:"Mensual balancea frecuencia con datos suficientes."}]
        }
      ]
    },
    {
      code: "ENT-PRO1", name: "Proyecto de Transformacion", slug: "ent-proyecto-transformacion",
      description: "Proyecto real de transformacion digital en tu empresa",
      sessions: [
        { title: "Definicion del proyecto de transformacion",
          theory: "# Proyecto de Transformacion: Definicion\n\nCada equipo corporativo define un proyecto real para su empresa.\n\n## Framework de definicion\n1. **Problema de negocio:** que proceso es ineficiente, costoso o propenso a errores?\n2. **Impacto esperado:** cuanto se ahorraria en tiempo/dinero/errores?\n3. **Datos disponibles:** que datos existen para alimentar la solucion?\n4. **Stakeholders:** quienes se ven afectados? Quien aprueba?\n5. **Timeline:** que se puede lograr en 4 semanas?\n\n## Tipos de proyectos sugeridos\n- Chatbot interno con RAG para preguntas frecuentes\n- Dashboard predictivo de ventas/churn\n- Automatizacion de procesamiento de documentos\n- Sistema de recomendacion para productos/servicios\n- Pipeline de generacion de reportes automaticos\n\n## Entregable de esta sesion\nDocumento de 2 paginas:\n- Problema y contexto\n- Solucion propuesta con tecnologia\n- ROI estimado\n- Plan de 4 semanas\n- Riesgos y mitigaciones\n\n## Criterios de evaluacion\n- Claridad del problema (20%)\n- Factibilidad tecnica (20%)\n- ROI estimado (20%)\n- Plan de ejecucion (20%)\n- Presentacion (20%)\n\nEste proyecto es la prueba de que la capacitacion genera valor real.",
          quiz: [{q:"Que debe tener el documento de definicion?",a:"Solo la idea",b:"Problema, solucion, ROI, plan, riesgos",c:"Solo tecnologia",correct:"b",exp:"Un business case completo con 5 secciones clave."},
                 {q:"Cuanto tiempo hay para el proyecto?",a:"2 semanas",b:"4 semanas",c:"3 meses",correct:"b",exp:"4 semanas es suficiente para un MVP con impacto."},
                 {q:"Que porcentaje vale la presentacion?",a:"10%",b:"20%",c:"40%",correct:"b",exp:"20% — comunicar resultados es parte del exito."}]
        },
        { title: "Desarrollo y piloto del proyecto",
          theory: "# Desarrollo y Piloto\n\n## Sprint 1 (Semana 1-2): MVP\n- Configurar herramientas necesarias\n- Implementar funcionalidad core\n- Probar con datos reales (muestra)\n- Iterar basado en primeros resultados\n\n## Sprint 2 (Semana 3): Piloto\n- Grupo piloto: 5-10 usuarios\n- Recopilar feedback estructurado\n- Medir metricas baseline vs piloto\n- Documentar problemas y soluciones\n\n## Template de feedback\n```\n1. En escala 1-5, que tan util fue? ___\n2. Que funciono bien? ___\n3. Que no funciono? ___\n4. Que le cambiarias? ___\n5. Lo usarias diariamente? Si/No. Por que? ___\n```\n\n## Errores comunes en pilotos\n- Grupo piloto demasiado grande (max 10)\n- No medir baseline antes\n- No recopilar feedback formal\n- Intentar que sea perfecto antes de probar\n- No tener champion en el grupo piloto\n\n## Documentar todo\n- Screenshots de antes y despues\n- Metricas cuantitativas\n- Testimonios de usuarios piloto\n- Lecciones aprendidas\n\nEl piloto es la evidencia que convence al liderazgo de escalar.",
          quiz: [{q:"Tamano ideal del grupo piloto?",a:"1-2",b:"5-10",c:"50+",correct:"b",exp:"5-10 es suficiente para feedback sin complejidad excesiva."},
                 {q:"Que medir ANTES del piloto?",a:"Solo despues",b:"Metricas baseline actuales",c:"Solo satisfaccion",correct:"b",exp:"Sin baseline no puedes demostrar mejora."},
                 {q:"Error comun en pilotos?",a:"Probar demasiado rapido",b:"Esperar perfeccion antes de probar",c:"Grupo muy pequeno",correct:"b",exp:"Perfeccionismo retrasa el aprendizaje del piloto."}]
        },
        { title: "Presentacion ejecutiva y plan de escalamiento",
          theory: "# Presentacion Ejecutiva\n\nEl proyecto culmina con presentacion al liderazgo.\n\n## Estructura (15 minutos)\n1. **Problema** (2 min): dolor actual con numeros\n2. **Solucion** (3 min): que construimos y como funciona\n3. **Demo** (3 min): mostrar la solucion funcionando\n4. **Resultados del piloto** (3 min): metricas antes vs despues\n5. **Plan de escalamiento** (2 min): como llevar a toda la empresa\n6. **Inversion necesaria** (2 min): costo vs ROI proyectado\n\n## Plan de escalamiento\n```\nMes 1: Piloto exitoso (completado)\nMes 2: Departamento completo\nMes 3: 3 departamentos\nMes 6: Toda la empresa\nMes 12: Version 2.0 con ML avanzado\n```\n\n## Pedir presupuesto\n- Costo de herramientas mensual\n- Costo de capacitacion adicional\n- Horas internas de implementacion\n- ROI proyectado a 12 meses\n\n## Despues de la presentacion\n- Enviar resumen ejecutivo de 1 pagina\n- Calendario de proximos pasos\n- Responsables definidos\n- Fecha de siguiente checkpoint\n\nUna buena presentacion no informa, VENDE la transformacion.",
          quiz: [{q:"Cuanto debe durar la presentacion ejecutiva?",a:"5 minutos",b:"15 minutos",c:"30 minutos",correct:"b",exp:"15 minutos es el sweet spot para atencion ejecutiva."},
                 {q:"Que es lo mas importante de la presentacion?",a:"Detalles tecnicos",b:"Demo + resultados del piloto",c:"Diapositivas bonitas",correct:"b",exp:"Ver la solucion funcionando con datos reales convence."},
                 {q:"Que enviar despues de la presentacion?",a:"Nada",b:"Resumen 1 pagina + proximos pasos",c:"Solo el PPT",correct:"b",exp:"Follow-up con resumen y calendario mantiene momentum."}]
        }
      ]
    }
  ]
};

// ============================================
// MAIN EXECUTION
// ============================================

let stats = { programs: 0, semesters: 0, subjects: 0, sessions: 0, quizzes: 0, questions: 0, errors: 0 };

async function loadProgram(config) {
  console.log("\n--- Programa: " + config.name + " ($" + config.price + ") ---\n");

  // 1. Create program
  let program;
  try {
    program = await post(BASE + "/programs", {
      name: config.name,
      slug: config.slug,
      description: config.description,
      type: "bootcamp",
      price: config.price,
      duration_months: config.duration_months,
      is_active: true,
      total_semesters: 1
    });
    stats.programs++;
    console.log("  Programa: " + program.id);
  } catch (e) {
    console.log("  ERROR programa: " + e.message);
    stats.errors++;
    return;
  }

  // 2. Create semester
  let semester;
  try {
    semester = await post(BASE + "/semesters", {
      program_id: program.id,
      number: 1,
      name: config.semester.name,
      level: config.semester.level,
      is_active: true
    });
    stats.semesters++;
    console.log("  Semester: " + semester.id);
  } catch (e) {
    console.log("  ERROR semester: " + e.message);
    stats.errors++;
    return;
  }

  // 3. Subjects and sessions
  for (let si = 0; si < config.subjects.length; si++) {
    const subj = config.subjects[si];
    let subject;
    try {
      subject = await post(BASE + "/subjects", {
        semester_id: semester.id,
        code: subj.code,
        name: subj.name,
        slug: subj.slug,
        description: subj.description,
        credit_hours: 2,
        hours_docencia: 8,
        hours_practica: 8,
        hours_autonomo: 4,
        hours_total: 20,
        order_index: si + 1,
        is_active: true
      });
      stats.subjects++;
      console.log("  Materia: " + subj.name);
    } catch (e) {
      console.log("  ERROR subject " + subj.name + ": " + e.message.substring(0,80));
      stats.errors++;
      continue;
    }

    for (let sei = 0; sei < subj.sessions.length; sei++) {
      const sess = subj.sessions[sei];
      try {
        const session = await post(BASE + "/sessions", {
          subject_id: subject.id,
          number: sei + 1,
          title: sess.title,
          theory_markdown: sess.theory,
          estimated_duration_minutes: 120,
          order_index: sei + 1,
          is_active: true
        });
        stats.sessions++;

        if (sess.quiz && sess.quiz.length > 0) {
          const quiz = await post(BASE + "/quizzes", {
            session_id: session.id,
            title: "Quiz - " + sess.title,
            pass_percentage: 70,
            max_attempts: 3,
            is_active: true
          });
          stats.quizzes++;

          for (let qi = 0; qi < sess.quiz.length; qi++) {
            const q = sess.quiz[qi];
            await postMin(BASE + "/quiz_questions", {
              quiz_id: quiz.id,
              question_text: q.q,
              question_type: "multiple_choice",
              options: JSON.stringify([
                {id:"a",text:q.a,is_correct:q.correct==="a"},
                {id:"b",text:q.b,is_correct:q.correct==="b"},
                {id:"c",text:q.c,is_correct:q.correct==="c"}
              ]),
              explanation: q.exp,
              points: 1,
              order_index: qi + 1
            });
            stats.questions++;
          }
        }
        console.log("    S" + (sei+1) + " " + sess.title.substring(0,45) + " OK | Q:" + (sess.quiz ? sess.quiz.length : 0));
      } catch (e) {
        console.log("    ERR S" + (sei+1) + ": " + e.message.substring(0,80));
        stats.errors++;
      }
    }
  }
}

async function main() {
  console.log("=== CORPORATE B2B — Cargando a Supabase ===");

  await loadProgram(PROGRAM_TEAM);
  await loadProgram(PROGRAM_ENTERPRISE);

  console.log("\n=== CORPORATE B2B COMPLETADO ===");
  console.log("Programas: " + stats.programs);
  console.log("Semestres: " + stats.semesters);
  console.log("Materias:  " + stats.subjects);
  console.log("Sesiones:  " + stats.sessions);
  console.log("Quizzes:   " + stats.quizzes);
  console.log("Preguntas: " + stats.questions);
  console.log("Errores:   " + stats.errors);
}

main().catch(e => console.error("FATAL:", e));
