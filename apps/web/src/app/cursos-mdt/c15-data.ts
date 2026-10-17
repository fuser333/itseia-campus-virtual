// ─── C15: Ciberseguridad con IA — Datos de 20 temas ───────────────────────────
// Curso C15 del programa MDT. 20 temas (scaffolding).
// Módulo 1: Amenazas y defensa con IA
// Módulo 2: Detección de anomalías con ML
// Módulo 3: Phishing y deepfakes
// Módulo 4: Compliance y respuesta a incidentes Ecuador (LOPDP, CERT-EC)

export interface QuizQuestion {
  pregunta: string;
  opciones: string[];
  respuesta: number;
  explicacion: string;
}

export interface Recurso {
  titulo: string;
  url: string;
  tipo: "documentacion" | "herramienta" | "lectura";
  descripcion?: string;
}

export interface PresentacionSlide {
  titulo: string;
  contenido: string;
}

export type GammaUrl = string;

export interface EjercicioCriterio {
  criterio: string;
  puntos: number;
}

export interface TemaC15 {
  id: number;
  titulo: string;
  modulo: string;
  moduloNum: number;
  videoEmbed: string;
  videoTitulo: string;
  videoDuracion?: string;
  slidesUrl?: GammaUrl;
  presentacionSlides: PresentacionSlide[];
  quiz: QuizQuestion[];
  ejercicio: {
    titulo?: string;
    objetivo: string;
    herramientas: string;
    datosEjemplo?: string;
    pasos: string[];
    resultado: string;
    criterios?: EjercicioCriterio[];
  };
  recursos: Recurso[];
  teoria: string;
}

export const C15_MODULOS = [
  { num: 1, nombre: "Amenazas y Defensa con IA", horas: 15, temas: 5 },
  { num: 2, nombre: "Detección de Anomalías con ML", horas: 15, temas: 5 },
  { num: 3, nombre: "Phishing y Deepfakes", horas: 15, temas: 5 },
  { num: 4, nombre: "Compliance y Respuesta a Incidentes Ecuador", horas: 15, temas: 5 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC15 => ({
  id,
  titulo,
  modulo,
  moduloNum,
  videoEmbed: "",
  videoTitulo: titulo,
  teoria: "Contenido en desarrollo — disponible próximamente.",
  presentacionSlides: [],
  quiz: [],
  ejercicio: { objetivo: "Próximamente", herramientas: "", pasos: [], resultado: "" },
  recursos: [],
});

// ─── MÓDULO 1: AMENAZAS Y DEFENSA CON IA ─────────────────────────────────────

const tema1: TemaC15 = {
  id: 1,
  titulo: "El nuevo panorama de amenazas: cuando los atacantes también usan IA",
  modulo: "Amenazas y Defensa con IA",
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "IA ofensiva vs IA defensiva: la nueva guerra cibernética",
  videoDuracion: "20 min",
  teoria: `La ciberseguridad ha entrado en una era de aceleración asimétrica. Los atacantes ahora utilizan inteligencia artificial para automatizar y escalar ataques que antes requerían semanas de trabajo manual: generación de malware polimórfico que muta su código para evadir detección, phishing hiperpersonalizado usando LLMs que analizan el perfil público de la víctima, escaneo automatizado de vulnerabilidades en cientos de miles de sistemas simultáneamente, y generación de deepfakes de voz y video para ingeniería social.

En Ecuador, el contexto de amenazas tiene características específicas. El CERT-EC (Equipo de Respuesta a Emergencias Cibernéticas de Ecuador) registró en 2023 un incremento del 340% en incidentes reportados respecto a 2022, con ransomware y phishing como los vectores más frecuentes. Las PyMEs ecuatorianas son objetivos especialmente atractivos porque tienen activos digitales valiosos (datos de clientes, acceso bancario, credenciales de SRI/IESS) pero típicamente carecen de presupuesto y personal especializado en seguridad.

Los ataques más frecuentes en empresas ecuatorianas actualmente son: (1) Business Email Compromise (BEC) — suplantación del correo del gerente para autorizar transferencias fraudulentas, con pérdidas promedio de $130.000 por incidente en LATAM; (2) Ransomware — cifrado de datos críticos con rescate, especialmente a municipios y empresas medianas; (3) Credential stuffing — uso de contraseñas filtradas de otras brechas para acceder a sistemas bancarios y del SRI; (4) Spear phishing con IA — mensajes personalizados que parecen provenir de contactos reales.

La IA defensiva responde en tres capas: detección de amenazas (modelos que identifican patrones anómalos en logs, tráfico de red y comportamiento de usuarios), respuesta automatizada (playbooks que ejecutan acciones de contención sin intervención humana cuando se detecta un ataque), y análisis predictivo (modelos que identifican vulnerabilidades antes de que sean explotadas, priorizando los parches más urgentes).

El marco MITRE ATT&CK es el estándar internacional que cataloga las técnicas y tácticas usadas por atacantes reales. Es la "biblioteca del atacante" — permite a los defensores anticipar comportamientos en lugar de solo reaccionar a indicadores conocidos.`,
  presentacionSlides: [
    {
      titulo: "La IA en manos del atacante",
      contenido:
        "Malware polimórfico autogenerado. Phishing hiperpersonalizado con LLMs. Escaneo masivo automatizado. Deepfakes de voz para ingeniería social. La automatización democratizó los ataques sofisticados.",
    },
    {
      titulo: "Ecuador: panorama de amenazas 2023-2024",
      contenido:
        "CERT-EC: +340% incidentes respecto a 2022. Vectores principales: ransomware + phishing. PyMEs: activos valiosos (SRI, banco, clientes) + seguridad mínima = objetivo ideal.",
    },
    {
      titulo: "Los 4 ataques más frecuentes en Ecuador",
      contenido:
        "1. BEC (Business Email Compromise): $130K promedio/incidente en LATAM. 2. Ransomware a municipios y PyMEs. 3. Credential stuffing en portales SRI/IESS. 4. Spear phishing con IA.",
    },
    {
      titulo: "IA defensiva: 3 capas",
      contenido:
        "1. Detección: anomalías en logs, tráfico y comportamiento. 2. Respuesta automática: playbooks sin intervención humana. 3. Predictiva: vulnerabilidades antes de ser explotadas.",
    },
    {
      titulo: "MITRE ATT&CK Framework",
      contenido:
        "Biblioteca internacional de técnicas de ataque reales. 14 tácticas (desde reconocimiento hasta impacto). Permite anticipar comportamiento atacante, no solo reaccionar a IOCs.",
    },
    {
      titulo: "Herramientas de IA defensiva open source",
      contenido:
        "Wazuh: SIEM open source con detección IA. Zeek: análisis de tráfico de red. Suricata: IDS/IPS con reglas ML. OSSEC: monitoreo de integridad de archivos.",
    },
    {
      titulo: "El costo de no estar preparado en Ecuador",
      contenido:
        "Ransomware promedio: $50K-$200K (rescate + tiempo perdido). BEC: sin seguro, sin recuperación. LOPDP: multas por brecha de datos + daño reputacional. Proveedores como el Estado exigen certificaciones.",
    },
    {
      titulo: "Postura de seguridad básica para PyMEs ecuatorianas",
      contenido:
        "MFA en todos los servicios críticos. Backup 3-2-1. Parches aplicados en <30 días. Capacitación anti-phishing trimestral. Plan de respuesta a incidentes documentado.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuánto incrementaron los incidentes cibernéticos reportados al CERT-EC en 2023 respecto a 2022?",
      opciones: ["50%", "120%", "340%", "800%"],
      respuesta: 2,
      explicacion:
        "El CERT-EC registró un incremento del 340% en incidentes en 2023, reflejando el crecimiento de amenazas potenciadas por IA y la mayor conciencia de reporte.",
    },
    {
      pregunta: "¿Qué es Business Email Compromise (BEC)?",
      opciones: [
        "Un virus que infecta el servidor de correo",
        "Suplantación del correo de un ejecutivo para autorizar transferencias o acciones fraudulentas",
        "Un ataque de denegación de servicio al servidor de email",
        "Software malicioso que roba contraseñas de correo",
      ],
      respuesta: 1,
      explicacion:
        "BEC implica suplantar la identidad de un ejecutivo (generalmente por comprometer su cuenta o spoofing) para engañar a empleados o proveedores a realizar transferencias o entregar información.",
    },
    {
      pregunta: "¿Para qué sirve el framework MITRE ATT&CK?",
      opciones: [
        "Para gestionar contraseñas de forma segura",
        "Para catalogar las técnicas y tácticas de ataque usadas por adversarios reales",
        "Para cifrar comunicaciones de red",
        "Para escanear vulnerabilidades en aplicaciones web",
      ],
      respuesta: 1,
      explicacion:
        "MITRE ATT&CK es una base de conocimiento de comportamientos adversariales observados en el mundo real, organizada en tácticas (el 'por qué') y técnicas (el 'cómo').",
    },
    {
      pregunta: "¿Cuál herramienta open source actúa como SIEM con capacidades de detección basadas en IA?",
      opciones: ["Metasploit", "Wireshark", "Wazuh", "Nmap"],
      respuesta: 2,
      explicacion:
        "Wazuh es una plataforma open source de seguridad que combina SIEM, detección de intrusiones, monitoreo de integridad y respuesta a incidentes.",
    },
    {
      pregunta: "En la postura de seguridad básica para PyMEs, ¿qué es la regla de backup 3-2-1?",
      opciones: [
        "3 contraseñas, 2 dispositivos, 1 servidor",
        "3 copias, 2 medios diferentes, 1 copia offsite",
        "3 usuarios, 2 administradores, 1 auditor",
        "Backup cada 3 días, 2 verificaciones, 1 restauración de prueba por mes",
      ],
      respuesta: 1,
      explicacion:
        "La regla 3-2-1 de backup: mantener 3 copias de los datos, en 2 tipos de medios diferentes, con al menos 1 copia offsite (fuera de las instalaciones o en la nube).",
    },
  ],
  ejercicio: {
    titulo: "Análisis de amenazas con MITRE ATT&CK Navigator",
    objetivo:
      "Mapear las amenazas más relevantes para una empresa ecuatoriana usando MITRE ATT&CK y diseñar controles de defensa prioritarios.",
    herramientas:
      "MITRE ATT&CK Navigator (web, gratuito en attack.mitre.org/resources/navigator/), Google Sheets para documentación",
    datosEjemplo:
      "Empresa: Cooperativa de ahorro y crédito en Riobamba, 3 sucursales, 200 socios, transacciones por app móvil, servidores en datacenter local.",
    pasos: [
      "Paso 1 — Perfilar la empresa objetivo: Documentar la infraestructura digital de la cooperativa: sistemas, conexiones a internet, aplicaciones, proveedores de nube, datos más críticos.",
      "Paso 2 — Identificar activos críticos: Listar los 5 activos más valiosos (ej: base de datos de socios, sistema de transacciones, portal web, correo de gerencia, acceso a Banco Central). Para cada uno, describir qué pasaría si fuera comprometido.",
      "Paso 3 — Explorar MITRE ATT&CK Navigator: Abrir attack.mitre.org/resources/navigator/. Crear una nueva capa (layer). Seleccionar las 10 técnicas de ataque más probables para una cooperativa financiera (usar el grupo de amenazas FIN7 como referencia de actores financieros).",
      "Paso 4 — Mapear controles existentes: Para cada técnica seleccionada, investigar si la cooperativa probablemente tiene algún control implementado. Clasificar cada técnica como: Sin control (rojo), Control parcial (amarillo), Control implementado (verde).",
      "Paso 5 — Priorizar brechas: Identificar las 3 técnicas de mayor riesgo sin control. Para cada una, proponer: qué herramienta o proceso implementar, costo estimado, tiempo de implementación.",
      "Paso 6 — Reporte ejecutivo: Crear un documento de 1 página con: heat map de riesgos, 3 recomendaciones priorizadas por impacto vs costo, y próximos pasos para los 30 días.",
    ],
    resultado:
      "Mapa de amenazas en MITRE ATT&CK Navigator exportado como imagen más reporte ejecutivo de 1 página con 3 recomendaciones priorizadas.",
    criterios: [
      { criterio: "Perfil de empresa con activos críticos identificados y consecuencias de compromiso", puntos: 20 },
      { criterio: "10 técnicas ATT&CK seleccionadas y justificadas para el perfil de la empresa", puntos: 25 },
      { criterio: "Mapeo de controles existentes con clasificación rojo/amarillo/verde", puntos: 20 },
      { criterio: "3 brechas prioritarias con propuesta de control, costo y tiempo", puntos: 25 },
      { criterio: "Reporte ejecutivo claro y sin jerga técnica excesiva", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "MITRE ATT&CK — Framework oficial",
      url: "https://attack.mitre.org/",
      tipo: "documentacion",
      descripcion: "Framework internacional de tácticas y técnicas de ataque cibernético",
    },
    {
      titulo: "Wazuh — SIEM open source",
      url: "https://wazuh.com/",
      tipo: "herramienta",
      descripcion: "Plataforma de seguridad open source con detección de amenazas",
    },
    {
      titulo: "CERT-EC — Equipo de Respuesta Ecuador",
      url: "https://www.cert.gob.ec/",
      tipo: "documentacion",
      descripcion: "Portal oficial del CERT-EC con alertas y estadísticas de incidentes en Ecuador",
    },
    {
      titulo: "NIST Cybersecurity Framework",
      url: "https://www.nist.gov/cyberframework",
      tipo: "lectura",
      descripcion: "Marco de ciberseguridad del NIST: Identificar, Proteger, Detectar, Responder, Recuperar",
    },
  ],
};

const tema2: TemaC15 = placeholder(2, "Vectores de ataque más frecuentes en Ecuador 2025-2026", "Amenazas y Defensa con IA", 1);
const tema3: TemaC15 = placeholder(3, "SIEM con IA: detectar antes de que ocurra", "Amenazas y Defensa con IA", 1);
const tema4: TemaC15 = placeholder(4, "Zero Trust Architecture para PyMEs", "Amenazas y Defensa con IA", 1);
const tema5: TemaC15 = placeholder(5, "Ejercicio red team vs blue team básico", "Amenazas y Defensa con IA", 1);

// ─── MÓDULO 2: DETECCIÓN DE ANOMALÍAS CON ML ─────────────────────────────────

const tema6: TemaC15 = {
  id: 6,
  titulo: "Detección de anomalías con Isolation Forest y Autoencoder",
  modulo: "Detección de Anomalías con ML",
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "ML para detectar lo que no debería estar ahí",
  videoDuracion: "25 min",
  teoria: `La detección de anomalías es el problema de identificar patrones que se desvían significativamente del comportamiento esperado. En ciberseguridad, esto significa detectar accesos inusuales, transferencias fuera del patrón normal, comandos no ejecutados habitualmente o comunicaciones a destinos desconocidos. El desafío fundamental es que los ataques son raros y heterogéneos: no hay suficientes ejemplos etiquetados de ataques para entrenar modelos supervisados, y cada ataque es potencialmente único.

Los algoritmos de detección de anomalías no supervisados son los más útiles en este contexto. Isolation Forest es uno de los más efectivos y eficientes: construye árboles aleatorios que intentan aislar cada punto de datos. Los puntos que se aíslan con pocos cortes (pocas divisiones del árbol) son anomalías, porque su valor en alguna característica es extremo o inusual. Es rápido, escala bien y funciona con alta dimensionalidad.

Los Autoencoders son redes neuronales entrenadas para comprimir y reconstruir datos normales. Cuando intentan reconstruir un dato anómalo, el error de reconstrucción es alto porque la red nunca aprendió ese patrón. Este error de reconstrucción se convierte en el score de anomalía. Son especialmente útiles para detección de anomalías en series de tiempo y logs de acceso.

En el contexto ecuatoriano, los casos de uso más directos son: (1) Fraude en cooperativas de ahorro y crédito — transacciones fuera del patrón habitual del socio (monto, hora, ubicación, frecuencia); (2) Accesos anómalos en portales gubernamentales — logins desde IPs no habituales, horarios inusuales, volumen de consultas; (3) Comportamiento de empleados en riesgo de exfiltración — descargas masivas, accesos a archivos inusuales en horarios no laborales; (4) Tráfico de red anómalo — comunicaciones a IPs en listas negras, protocolos no autorizados.

Una pipeline típica de detección de anomalías en seguridad tiene cuatro pasos: (1) Recopilación de logs (Windows Event Logs, syslog, Apache/Nginx access logs, DNS queries); (2) Feature engineering — convertir logs en vectores numéricos: usuario, hora, sistema accedido, acción, bytes transferidos; (3) Entrenamiento del modelo en datos "normales" (mínimo 30 días de histórico); (4) Scoring en tiempo real con umbral de alerta y correlación de señales.`,
  presentacionSlides: [
    {
      titulo: "El problema de detección de anomalías en seguridad",
      contenido:
        "Los ataques son raros y únicos — no hay suficientes ejemplos etiquetados. Necesitamos modelos no supervisados que aprendan 'lo normal' y detecten desviaciones.",
    },
    {
      titulo: "Isolation Forest: cómo funciona",
      contenido:
        "Árboles aleatorios que intentan aislar cada punto. Puntos aislados con pocos cortes = anomalías (valor extremo en alguna característica). Rápido, escalable, alta dimensionalidad.",
    },
    {
      titulo: "Autoencoders para anomalías",
      contenido:
        "Red neuronal: aprende a comprimir y reconstruir datos normales. Error de reconstrucción alto = dato anómalo (nunca aprendió ese patrón). Ideal para series de tiempo y logs.",
    },
    {
      titulo: "Casos de uso Ecuador",
      contenido:
        "1. Fraude cooperativas: transacciones fuera de patrón del socio. 2. Accesos anómalos portales públicos. 3. Exfiltración de empleados. 4. Tráfico de red a IPs en listas negras.",
    },
    {
      titulo: "Pipeline de detección: 4 pasos",
      contenido:
        "1. Recopilar logs (Windows Events, syslog, Apache). 2. Feature engineering (usuario, hora, sistema, bytes). 3. Entrenar con 30+ días de datos normales. 4. Scoring en tiempo real con umbral de alerta.",
    },
    {
      titulo: "Métricas de evaluación en contexto de seguridad",
      contenido:
        "Precision: de las alertas generadas, ¿cuántas son reales? Recall: de los ataques reales, ¿cuántos detectamos? En seguridad, preferimos alto recall (mejor falso positivo que ataque no detectado).",
    },
    {
      titulo: "Herramientas prácticas",
      contenido:
        "Python: scikit-learn (IsolationForest), PyOD (biblioteca completa de anomalías), TensorFlow/Keras (Autoencoders). Plataformas: Elastic SIEM, Splunk MLTK.",
    },
    {
      titulo: "Umbrales y ajuste del modelo",
      contenido:
        "El umbral (contamination en IsolationForest) define cuánto del tráfico se marca como anómalo. Demasiado bajo: muchas alertas (alert fatigue). Demasiado alto: ataques sin detectar. Ajustar con feedback del equipo SOC.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Por qué se usan algoritmos no supervisados para detección de anomalías en seguridad?",
      opciones: [
        "Porque son más rápidos que los supervisados",
        "Porque no hay suficientes ejemplos etiquetados de ataques y cada ataque puede ser único",
        "Porque los algoritmos supervisados no funcionan con datos de seguridad",
        "Porque el hardware de los SOC no soporta algoritmos supervisados",
      ],
      respuesta: 1,
      explicacion:
        "Los ataques son raros, heterogéneos y constantemente evolucionan. No hay suficientes ejemplos etiquetados de todos los tipos de ataque, y los ataques nuevos (zero-day) no tienen etiquetas.",
    },
    {
      pregunta: "En Isolation Forest, ¿cómo se identifican las anomalías?",
      opciones: [
        "Los puntos que requieren más cortes del árbol para ser aislados",
        "Los puntos que se aíslan con pocos cortes del árbol (valor extremo en alguna característica)",
        "Los puntos más cercanos al centroide del cluster",
        "Los puntos con mayor distancia euclidiana al vecino más cercano",
      ],
      respuesta: 1,
      explicacion:
        "Isolation Forest aísla anomalías más rápido (menos cortes) porque sus valores son extremos o inusuales en alguna dimensión, lo que los hace más fáciles de separar del resto.",
    },
    {
      pregunta: "En un sistema de detección de intrusiones, ¿qué métrica es más importante: precisión o recall? ¿Por qué?",
      opciones: [
        "Precisión: queremos evitar falsos positivos a toda costa",
        "Recall: preferimos falsos positivos a dejar pasar ataques reales sin detectar",
        "Ambas son exactamente iguales de importantes",
        "F1-score siempre, sin excepciones",
      ],
      respuesta: 1,
      explicacion:
        "En seguridad, el costo de un ataque no detectado (falso negativo) suele ser mucho mayor que el costo de una falsa alarma (falso positivo). Por eso se prioriza alto recall.",
    },
    {
      pregunta: "¿Cuál es el uso del parámetro 'contamination' en IsolationForest de scikit-learn?",
      opciones: [
        "Elimina registros corruptos del dataset",
        "Define la proporción esperada de anomalías en los datos",
        "Controla la profundidad máxima del árbol",
        "Filtra logs con caracteres especiales",
      ],
      respuesta: 1,
      explicacion:
        "El parámetro contamination define qué proporción del dataset se espera que sean anomalías. Esto afecta el umbral de decisión: un valor más alto marca más puntos como anómalos.",
    },
    {
      pregunta: "¿Qué librería Python proporciona una colección completa de algoritmos de detección de anomalías (no solo IsolationForest)?",
      opciones: ["Pandas", "NumPy", "PyOD", "Matplotlib"],
      respuesta: 2,
      explicacion:
        "PyOD (Python Outlier Detection) es una librería especializada que incluye 40+ algoritmos de detección de anomalías, desde estadísticos hasta deep learning.",
    },
  ],
  ejercicio: {
    titulo: "Detección de accesos anómalos con Isolation Forest",
    objetivo:
      "Implementar un detector de accesos anómalos en un dataset de logs de autenticación de una empresa ecuatoriana usando Isolation Forest.",
    herramientas: "Python 3.10+, scikit-learn, pandas, matplotlib, Jupyter Notebook o Google Colab",
    datosEjemplo:
      "Dataset: 5.000 registros de login de empleados de una empresa en Quito. Columnas: timestamp, usuario_id, hora_del_dia, dia_semana, ip_origen, intentos_fallidos, sistema_accedido, bytes_descargados.",
    pasos: [
      "Paso 1 — Cargar y explorar el dataset: Importar el CSV con pandas. Verificar tipos de datos y valores nulos. Calcular estadísticas descriptivas de cada columna numérica. Visualizar la distribución de accesos por hora del día y día de la semana.",
      "Paso 2 — Feature engineering: Convertir timestamp a features numéricas: hora_del_dia (0-23), dia_semana (0-6), es_fin_de_semana (0/1), es_horario_laboral (0/1, definir como 8-18h lunes-viernes). Convertir ip_origen a variable binaria: ip_conocida (si la IP aparece en el histórico del usuario) vs ip_nueva.",
      "Paso 3 — Entrenar Isolation Forest: Seleccionar features: hora_del_dia, dia_semana, es_fin_de_semana, es_horario_laboral, intentos_fallidos, bytes_descargados, ip_conocida. Instanciar IsolationForest con contamination=0.05 (esperamos 5% de anomalías). Entrenar con fit() en los datos.",
      "Paso 4 — Generar scores y etiquetas: Usar predict() para obtener etiquetas (-1 = anomalía, 1 = normal). Usar score_samples() para obtener el score de anomalía continuo (más negativo = más anómalo). Agregar ambas columnas al DataFrame.",
      "Paso 5 — Analizar anomalías: Filtrar los registros marcados como anómalos. Revisar las características más frecuentes: ¿Son mayormente fuera de horario laboral? ¿De IPs nuevas? ¿Con muchos intentos fallidos? Exportar los 20 casos más anómalos a un CSV.",
      "Paso 6 — Visualización y reporte: Crear scatter plot de hora_del_dia vs bytes_descargados coloreado por etiqueta (normal/anomalía). Calcular precision y recall si el dataset tiene etiquetas ground truth. Escribir conclusión: ¿qué tipo de comportamiento está detectando el modelo?",
    ],
    resultado:
      "Notebook Jupyter con el modelo entrenado, CSV de las 20 anomalías más severas y análisis descriptivo de los patrones detectados.",
    criterios: [
      { criterio: "Feature engineering correcto con al menos 6 features relevantes para seguridad", puntos: 20 },
      { criterio: "Modelo Isolation Forest implementado correctamente con contamination justificado", puntos: 25 },
      { criterio: "Análisis de los patrones en las anomalías detectadas (qué tienen en común)", puntos: 25 },
      { criterio: "Visualización clara que muestre la separación normal/anomalía", puntos: 15 },
      { criterio: "Conclusión con implicaciones de seguridad y recomendaciones", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "scikit-learn — IsolationForest documentation",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html",
      tipo: "documentacion",
      descripcion: "Documentación oficial de Isolation Forest en scikit-learn",
    },
    {
      titulo: "PyOD — Python Outlier Detection",
      url: "https://pyod.readthedocs.io/",
      tipo: "herramienta",
      descripcion: "Librería Python con 40+ algoritmos de detección de anomalías",
    },
    {
      titulo: "Elastic SIEM — Detección de amenazas",
      url: "https://www.elastic.co/security",
      tipo: "herramienta",
      descripcion: "Plataforma SIEM con ML integrado para detección de amenazas",
    },
    {
      titulo: "Anomaly Detection Tutorial — Towards Data Science",
      url: "https://towardsdatascience.com/anomaly-detection-with-isolation-forest-e41f1f55cc6",
      tipo: "lectura",
      descripcion: "Tutorial práctico de detección de anomalías con Isolation Forest",
    },
  ],
};

const tema7: TemaC15 = placeholder(7, "User and Entity Behavior Analytics (UEBA)", "Detección de Anomalías con ML", 2);
const tema8: TemaC15 = placeholder(8, "Detección de intrusiones en red con ML", "Detección de Anomalías con ML", 2);
const tema9: TemaC15 = placeholder(9, "Autoencoders para detección de malware", "Detección de Anomalías con ML", 2);
const tema10: TemaC15 = placeholder(10, "Proyecto: sistema de alertas de anomalías en tiempo real", "Detección de Anomalías con ML", 2);

// ─── MÓDULO 3: PHISHING Y DEEPFAKES ──────────────────────────────────────────

const tema11: TemaC15 = {
  id: 11,
  titulo: "Phishing con IA: reconocer y defenderse de ataques hiperpersonalizados",
  modulo: "Phishing y Deepfakes",
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Phishing en la era de los LLMs: cómo detectarlo y no caer",
  videoDuracion: "22 min",
  teoria: `El phishing es el vector de ataque más frecuente a nivel mundial y en Ecuador, responsable del 82% de los incidentes de seguridad según el CERT-EC. Lo que ha cambiado radicalmente es la sofisticación: los modelos de lenguaje grandes (LLMs) permiten generar mensajes de phishing perfectamente redactados en español ecuatoriano, sin errores ortográficos ni frases genéricas, personalizados con información pública de la víctima (nombre, empresa, cargo, eventos recientes).

El spear phishing potenciado por IA funciona así: el atacante usa herramientas de OSINT (Open Source Intelligence) para recopilar información pública de la víctima — LinkedIn, Facebook, noticias, directorio de la empresa. Luego usa un LLM para generar un mensaje que parece enviado por un contacto conocido, referencia un evento real reciente y crea urgencia. El mensaje incluye un enlace a una página de login idéntica a la real (clonada con Evilginx u otras herramientas).

Los indicadores técnicos de phishing que un sistema de detección con ML debe identificar son: dominio con typosquatting (itseia.ai → itse1a.ai, itseía.ai), certificado SSL recién emitido (días de antigüedad < 30), hosting en proveedor de bajo costo con múltiples dominios recientes, análisis de texto del mensaje (urgencia excesiva, petición de credenciales, amenaza de consecuencias), y similitud visual con páginas legítimas usando computer vision.

Los deepfakes añaden una dimensión adicional al fraude. Tecnologías como ElevenLabs permiten clonar una voz con solo 30 segundos de audio. En Ecuador se han registrado casos de fraude donde se suplanta la voz de un gerente en llamada para autorizar transferencias. Los deepfakes de video, aunque más complejos, son cada vez más accesibles con herramientas como HeyGen o Runway.

La defensa ante phishing con IA requiere múltiples capas: tecnológica (filtros de email con ML, verificación DMARC/SPF/DKIM, autenticación multifactor), procedimental (protocolo de verificación para toda transferencia o cambio de datos sensibles, nunca verificar por el mismo canal del que vino la solicitud), y humana (simulaciones de phishing trimestrales con capacitación inmediata post-clic).`,
  presentacionSlides: [
    {
      titulo: "Phishing en Ecuador: los números",
      contenido:
        "82% de incidentes de seguridad tienen phishing como vector inicial (CERT-EC). Spear phishing con IA: personalizado, sin errores, referencia eventos reales. La protección técnica sola no basta.",
    },
    {
      titulo: "Cómo funciona el spear phishing con LLMs",
      contenido:
        "1. OSINT: LinkedIn, Facebook, noticias, directorios. 2. LLM genera mensaje personalizado en español ecuatoriano. 3. Página clonada con SSL válido. 4. Urgencia + autoridad = clic.",
    },
    {
      titulo: "Indicadores técnicos de phishing para ML",
      contenido:
        "Typosquatting (itse1a.ai). SSL < 30 días. Hosting con muchos dominios recientes. Análisis de texto: urgencia + petición credenciales. Similitud visual con páginas legítimas.",
    },
    {
      titulo: "Deepfakes de voz: el nuevo fraude",
      contenido:
        "ElevenLabs: clonar voz con 30 seg de audio. Casos Ecuador: gerente suplantado por voz para autorizar transferencias. Protocolo: verificar siempre por canal diferente.",
    },
    {
      titulo: "Defensa en 3 capas",
      contenido:
        "Tecnológica: filtros ML en email, DMARC/SPF/DKIM, MFA. Procedimental: protocolo de verificación para transferencias. Humana: simulaciones phishing trimestrales + capacitación.",
    },
    {
      titulo: "Herramientas de detección de phishing con ML",
      contenido:
        "VirusTotal API: análisis de URLs. PhishTank: base de datos pública. OpenPhish: feed en tiempo real. Modelos propios: clasificador URL + análisis de texto con transformers.",
    },
    {
      titulo: "Simulaciones de phishing como herramienta de capacitación",
      contenido:
        "GoPhish (open source): lanzar campañas de phishing simulado. Reportar tasa de clic por área y usuario. Capacitación inmediata post-clic. Meta: reducir tasa de clic a <5% en 6 meses.",
    },
    {
      titulo: "El caso del CEO fraud en Ecuador",
      contenido:
        "Empresa en Guayaquil, 2023: Email del 'CEO' a finanzas solicitando transferencia urgente de $45.000 a cuenta nueva. Sin verificación por teléfono → transferencia ejecutada. Sin recuperación.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué porcentaje de incidentes de seguridad tienen phishing como vector inicial según el CERT-EC?",
      opciones: ["45%", "62%", "82%", "95%"],
      respuesta: 2,
      explicacion:
        "El CERT-EC reporta que el 82% de los incidentes de seguridad en Ecuador tienen phishing como vector de acceso inicial.",
    },
    {
      pregunta: "¿Qué es el typosquatting en el contexto del phishing?",
      opciones: [
        "Un ataque que sobrecarga un servidor con solicitudes",
        "Registrar dominios con errores tipográficos del dominio legítimo para engañar a las víctimas",
        "Un tipo de malware que se propaga por correo electrónico",
        "Técnica para robar cookies de sesión",
      ],
      respuesta: 1,
      explicacion:
        "El typosquatting consiste en registrar dominios que imitan un dominio legítimo con errores tipográficos sutiles (itse1a.ai en lugar de itseia.ai) para confundir a los usuarios.",
    },
    {
      pregunta: "¿Con cuántos segundos de audio puede ElevenLabs clonar una voz de forma convincente?",
      opciones: ["5 minutos", "30 segundos", "1 hora", "10 minutos"],
      respuesta: 1,
      explicacion:
        "ElevenLabs y herramientas similares pueden clonar una voz con tan solo 30 segundos de audio de referencia, lo que hace que los deepfakes de voz sean un riesgo real y accesible.",
    },
    {
      pregunta: "¿Qué herramienta open source permite lanzar campañas de phishing simulado para capacitar empleados?",
      opciones: ["Metasploit", "Nessus", "GoPhish", "Burp Suite"],
      respuesta: 2,
      explicacion:
        "GoPhish es una plataforma open source específicamente diseñada para crear y gestionar campañas de phishing simulado con métricas de tasa de clic por usuario y área.",
    },
    {
      pregunta: "En el protocolo de defensa contra CEO fraud, ¿cuál es la regla más importante?",
      opciones: [
        "Responder al email pidiendo más información",
        "Verificar la solicitud por el mismo canal (email) con el jefe directo",
        "Nunca verificar por el mismo canal del que vino la solicitud — usar siempre un canal diferente",
        "Aprobar solo si el email tiene el logo oficial de la empresa",
      ],
      respuesta: 2,
      explicacion:
        "La regla crítica es verificar por un canal completamente diferente al del mensaje original (ej: si llegó por email, verificar por llamada telefónica directa). Esto neutraliza el BEC y CEO fraud.",
    },
  ],
  ejercicio: {
    titulo: "Construir un clasificador de phishing URLs con ML",
    objetivo:
      "Entrenar un modelo de clasificación que detecte URLs de phishing vs legítimas usando características de la URL y metadata del dominio.",
    herramientas: "Python, scikit-learn, pandas, requests, whois (librería Python), dataset UCI Phishing URLs",
    datosEjemplo:
      "Dataset: 10.000 URLs etiquetadas (phishing/legítima) con características: longitud URL, presencia de HTTPS, antigüedad dominio, presencia de IP en URL, número de subdominios, palabras clave sospechosas.",
    pasos: [
      "Paso 1 — Cargar el dataset: Descargar el UCI Phishing Dataset (disponible en UCI ML Repository). Explorar la distribución de clases (phishing vs legítima). Verificar features disponibles y sus tipos.",
      "Paso 2 — Feature engineering adicional: Para una muestra de 100 URLs, extraer features adicionales usando Python: longitud_url, tiene_https, num_puntos, num_guiones, tiene_ip_en_url, longitud_dominio. Usar la librería whois para verificar antigüedad del dominio en al menos 20 URLs.",
      "Paso 3 — Entrenar modelo base: Dividir en train/test (80/20). Entrenar Random Forest con 100 árboles. Calcular accuracy, precision, recall y F1 en el set de test. Imprimir la confusion matrix.",
      "Paso 4 — Análisis de importancia de features: Extraer feature_importances_ del Random Forest. Visualizar con bar chart las top 10 features más importantes. ¿Cuáles características distinguen mejor el phishing?",
      "Paso 5 — Probar con URLs reales: Construir una función classify_url(url) que extraiga features de una URL nueva y retorne 'phishing' o 'legítima' con el score de confianza. Probar con 5 URLs conocidas legítimas y 5 URLs de phishing de PhishTank.",
      "Paso 6 — Evaluar limitaciones: Identificar 3 casos donde el modelo se equivocó. ¿Por qué? ¿Qué features adicionales podrían mejorar el modelo? Documentar las limitaciones en un párrafo.",
    ],
    resultado:
      "Clasificador de phishing funcional con función classify_url(), métricas de evaluación y análisis de importancia de features.",
    criterios: [
      { criterio: "Dataset cargado y explorado con distribución de clases documentada", puntos: 10 },
      { criterio: "Feature engineering con al menos 8 features relevantes", puntos: 20 },
      { criterio: "Modelo entrenado con métricas correctas (precision/recall con énfasis en recall)", puntos: 25 },
      { criterio: "Análisis de importancia de features con visualización", puntos: 20 },
      { criterio: "Función classify_url() funcional y probada con URLs reales", puntos: 15 },
      { criterio: "Análisis de limitaciones y propuesta de mejoras", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "GoPhish — Plataforma open source de simulación de phishing",
      url: "https://getgophish.com/",
      tipo: "herramienta",
      descripcion: "Herramienta para campañas de phishing simulado y capacitación de empleados",
    },
    {
      titulo: "PhishTank — Base de datos de phishing verificado",
      url: "https://phishtank.org/",
      tipo: "herramienta",
      descripcion: "Base de datos colaborativa de URLs de phishing verificadas",
    },
    {
      titulo: "UCI Phishing Websites Dataset",
      url: "https://archive.ics.uci.edu/dataset/327/phishing+websites",
      tipo: "herramienta",
      descripcion: "Dataset de 10.000+ URLs etiquetadas para entrenar modelos de detección de phishing",
    },
    {
      titulo: "Google Safe Browsing API",
      url: "https://developers.google.com/safe-browsing",
      tipo: "herramienta",
      descripcion: "API de Google para verificar URLs contra su base de datos de phishing y malware",
    },
  ],
};

const tema12: TemaC15 = placeholder(12, "Detección de deepfakes con visión computacional", "Phishing y Deepfakes", 3);
const tema13: TemaC15 = placeholder(13, "Ingeniería social con IA: casos reales Ecuador", "Phishing y Deepfakes", 3);
const tema14: TemaC15 = placeholder(14, "Análisis forense digital básico", "Phishing y Deepfakes", 3);
const tema15: TemaC15 = placeholder(15, "Simulación de ataque BEC completo y defensa", "Phishing y Deepfakes", 3);

// ─── MÓDULO 4: COMPLIANCE Y RESPUESTA A INCIDENTES ECUADOR ───────────────────

const tema16: TemaC15 = {
  id: 16,
  titulo: "LOPDP y ciberseguridad: obligaciones legales y sanciones en Ecuador",
  modulo: "Compliance y Respuesta a Incidentes Ecuador",
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "LOPDP para empresas: qué debes cumplir hoy mismo",
  videoDuracion: "20 min",
  teoria: `La Ley Orgánica de Protección de Datos Personales (LOPDP) de Ecuador, vigente desde mayo de 2023 con período de adecuación de dos años, establece el marco legal que intersecta directamente con la ciberseguridad. No es solo una ley de privacidad — es una ley que obliga a implementar medidas técnicas y organizativas de seguridad para proteger los datos personales que las empresas procesan.

Las obligaciones de seguridad más directas de la LOPDP para empresas son: (1) Implementar medidas técnicas y organizativas apropiadas para el riesgo — en la práctica esto significa: cifrado de datos en reposo y en tránsito, control de acceso basado en roles, logs de auditoría, y protección contra acceso no autorizado; (2) Notificación de brechas — si ocurre un incidente que compromete datos personales, la empresa debe notificar a la Autoridad de Protección de Datos Personales (ADPD) dentro de las 72 horas de conocer el incidente; (3) Designación de un Delegado de Protección de Datos (DPD) cuando el tratamiento de datos sea a gran escala o de categorías especiales (salud, biometría, financiero).

Las sanciones de la LOPDP se escalan por gravedad: infracciones leves (hasta el 0,1% de la facturación anual), graves (hasta el 0,7%), y muy graves (hasta el 2%). Una empresa con $2M de facturación puede recibir multas de hasta $40.000 por una brecha no notificada. Adicionalmente, el daño reputacional en un mercado pequeño como Ecuador puede ser devastador.

El Plan de Respuesta a Incidentes (PRI) es el documento central de compliance en ciberseguridad. Define qué hacer cuando ocurre un incidente: quién lo detecta, quién lo escala, quién toma decisiones, cómo se contiene la amenaza, cómo se recuperan los sistemas, cómo se notifica a reguladores y afectados, y cómo se documenta para el análisis post-incidente. El NIST Cybersecurity Framework organiza la respuesta en cinco funciones: Identificar, Proteger, Detectar, Responder, Recuperar.

En Ecuador, las instituciones del ecosistema de ciberseguridad que todo profesional debe conocer son: CERT-EC (reportar incidentes, recibir alertas), ADPD (Autoridad de Protección de Datos Personales, notificaciones de brechas), MINTEL (Ministerio de Telecomunicaciones, regulación sectorial), Fiscalía General del Estado (delitos informáticos bajo el COIP, Artículo 232-234).`,
  presentacionSlides: [
    {
      titulo: "LOPDP: más que privacidad, es seguridad",
      contenido:
        "Vigente desde mayo 2023, período adecuación 2 años. Obliga a medidas técnicas de seguridad: cifrado, control de acceso, logs de auditoría. No cumplir = multas + daño reputacional.",
    },
    {
      titulo: "Las 3 obligaciones de seguridad principales",
      contenido:
        "1. Medidas técnicas apropiadas al riesgo (cifrado, RBAC, logs). 2. Notificación de brechas en 72 horas a la ADPD. 3. Delegado de Protección de Datos (DPD) cuando aplica.",
    },
    {
      titulo: "Escala de sanciones LOPDP",
      contenido:
        "Leve: hasta 0,1% facturación. Grave: hasta 0,7%. Muy grave: hasta 2%. Empresa $2M = multa hasta $40.000. Más: daño reputacional en mercado pequeño.",
    },
    {
      titulo: "Plan de Respuesta a Incidentes (PRI)",
      contenido:
        "Documenta: quién detecta, escala, decide. Cómo contener + recuperar. Notificación a ADPD y afectados. Análisis post-incidente. Sin PRI = improvisar en la peor situación posible.",
    },
    {
      titulo: "NIST Cybersecurity Framework: 5 funciones",
      contenido:
        "IDENTIFICAR: inventario activos y riesgos. PROTEGER: controles preventivos. DETECTAR: monitoreo y alertas. RESPONDER: contención y análisis. RECUPERAR: restauración y mejoras.",
    },
    {
      titulo: "Ecosistema de ciberseguridad Ecuador",
      contenido:
        "CERT-EC: reportar incidentes + alertas. ADPD: notificaciones de brechas. MINTEL: regulación sectorial. Fiscalía: delitos informáticos (COIP Art. 232-234).",
    },
    {
      titulo: "Delitos informáticos en Ecuador (COIP)",
      contenido:
        "Art. 229: violación de datos personales (3-5 años). Art. 232: ataque a sistemas (1-3 años). Art. 234: acceso no autorizado (3-5 años). Art. 190: apropiación fraudulenta por medios electrónicos.",
    },
    {
      titulo: "Lista de verificación de compliance mínimo",
      contenido:
        "Inventario de datos personales. Política de privacidad actualizada. Proceso de notificación de brechas documentado. MFA en sistemas críticos. Cifrado en reposo y tránsito. DPD designado (si aplica).",
    },
  ],
  quiz: [
    {
      pregunta: "¿En cuántas horas debe notificarse una brecha de datos personales a la ADPD según la LOPDP de Ecuador?",
      opciones: ["24 horas", "48 horas", "72 horas", "7 días"],
      respuesta: 2,
      explicacion:
        "La LOPDP establece un plazo de 72 horas desde que la empresa conoce el incidente para notificar a la Autoridad de Protección de Datos Personales (ADPD).",
    },
    {
      pregunta: "¿Cuál es la sanción máxima por infracciones muy graves bajo la LOPDP?",
      opciones: [
        "Una multa fija de $10.000",
        "Hasta el 2% de la facturación anual",
        "Cierre definitivo de la empresa",
        "Hasta el 10% de la facturación anual",
      ],
      respuesta: 1,
      explicacion:
        "Las infracciones muy graves bajo la LOPDP pueden resultar en multas de hasta el 2% de la facturación anual global del ejercicio anterior.",
    },
    {
      pregunta: "¿Qué artículo del COIP de Ecuador tipifica el acceso no autorizado a sistemas informáticos?",
      opciones: ["Artículo 190", "Artículo 229", "Artículo 232", "Artículo 234"],
      respuesta: 3,
      explicacion:
        "El Artículo 234 del COIP tipifica el acceso no autorizado a sistemas informáticos con penas de 3 a 5 años. El Art. 232 cubre el ataque a la integridad de sistemas.",
    },
    {
      pregunta: "¿Cuál es la función 'Recuperar' en el NIST Cybersecurity Framework?",
      opciones: [
        "Identificar los activos y evaluar riesgos de la organización",
        "Restaurar los servicios afectados e implementar mejoras basadas en el incidente",
        "Detectar eventos de ciberseguridad en tiempo real",
        "Implementar controles preventivos para reducir vulnerabilidades",
      ],
      respuesta: 1,
      explicacion:
        "La función Recuperar del NIST CSF cubre la restauración de capacidades o servicios afectados por el incidente y la incorporación de lecciones aprendidas para mejorar la postura de seguridad.",
    },
    {
      pregunta: "¿Cuándo es obligatorio designar un Delegado de Protección de Datos (DPD) según la LOPDP?",
      opciones: [
        "Toda empresa con más de 10 empleados",
        "Solo empresas del sector financiero",
        "Cuando el tratamiento de datos es a gran escala o involucra categorías especiales como salud o biometría",
        "Solo empresas transnacionales con operaciones en Ecuador",
      ],
      respuesta: 2,
      explicacion:
        "La LOPDP requiere DPD principalmente cuando el tratamiento es a gran escala o involucra categorías especiales de datos (salud, biometría, datos financieros, datos de menores).",
    },
  ],
  ejercicio: {
    titulo: "Elaborar un Plan de Respuesta a Incidentes para una empresa ecuatoriana",
    objetivo:
      "Crear un Plan de Respuesta a Incidentes (PRI) completo y operativo, alineado con la LOPDP y el NIST CSF, para una empresa ecuatoriana específica.",
    herramientas: "Google Docs o Notion, plantilla de PRI proporcionada, referencia NIST CSF y LOPDP",
    datosEjemplo:
      "Empresa: Aseguradora privada en Quito, 80 empleados, 5.000 clientes activos, datos de salud y financieros, sistema de gestión en la nube (AWS), portal web para clientes.",
    pasos: [
      "Paso 1 — Inventario de activos críticos: Listar todos los sistemas, datos y procesos críticos de la aseguradora. Para cada activo, clasificar el nivel de sensibilidad (público, interno, confidencial, restringido) y el impacto de una brecha (alto/medio/bajo).",
      "Paso 2 — Equipo de Respuesta a Incidentes: Definir el equipo con roles y responsabilidades: Líder de Incidente, Analista Técnico, Comunicaciones, Legal/Compliance, Alta Dirección. Para cada rol: nombre del cargo, cuándo se activa, contacto de emergencia.",
      "Paso 3 — Clasificación de incidentes: Crear una matriz de clasificación con 4 niveles de severidad (P1: crítico — sistemas productivos caídos, datos comprometidos; P2: alto; P3: medio; P4: bajo). Para cada nivel: tiempo de respuesta inicial, equipo mínimo, acciones inmediatas.",
      "Paso 4 — Playbook para ransomware: Diseñar el procedimiento paso a paso para el escenario de ransomware: detección, contención (aislar sistemas, desconectar red), evaluación del alcance, decisión de pago vs restauración, comunicación interna, notificación ADPD/CERT-EC, recuperación desde backup.",
      "Paso 5 — Protocolo de notificación LOPDP: Documentar el proceso de notificación de brechas que cumple la LOPDP: checklist para determinar si aplica notificación obligatoria, plantilla de notificación a la ADPD (72h), plantilla de comunicación a los afectados.",
      "Paso 6 — Ejercicio de simulación: Ejecutar un tabletop exercise con el escenario: 'El viernes a las 17:00 el equipo de TI recibe alertas de que archivos en el servidor están siendo cifrados'. Documentar las decisiones tomadas en cada paso del playbook y las brechas identificadas.",
    ],
    resultado:
      "Plan de Respuesta a Incidentes completo (10-15 páginas) con playbook de ransomware, protocolo LOPDP y hallazgos del tabletop exercise.",
    criterios: [
      { criterio: "Inventario de activos con clasificación de sensibilidad e impacto", puntos: 15 },
      { criterio: "Equipo de respuesta con roles, responsabilidades y contactos de emergencia", puntos: 15 },
      { criterio: "Matriz de clasificación de severidad con tiempos de respuesta", puntos: 20 },
      { criterio: "Playbook de ransomware con pasos operacionales claros", puntos: 25 },
      { criterio: "Protocolo de notificación LOPDP con plantillas y checklist", puntos: 15 },
      { criterio: "Hallazgos del tabletop exercise con brechas identificadas", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "LOPDP Ecuador — Texto oficial",
      url: "https://www.telecomunicaciones.gob.ec/ley-organica-de-proteccion-de-datos-personales/",
      tipo: "documentacion",
      descripcion: "Ley Orgánica de Protección de Datos Personales Ecuador — texto completo",
    },
    {
      titulo: "CERT-EC — Portal oficial Ecuador",
      url: "https://www.cert.gob.ec/",
      tipo: "documentacion",
      descripcion: "Equipo de Respuesta a Emergencias Cibernéticas de Ecuador — reportes y alertas",
    },
    {
      titulo: "NIST Cybersecurity Framework 2.0",
      url: "https://www.nist.gov/cyberframework",
      tipo: "documentacion",
      descripcion: "Marco de ciberseguridad del NIST versión 2.0 — estándar internacional",
    },
    {
      titulo: "Plantilla de Plan de Respuesta a Incidentes (SANS Institute)",
      url: "https://www.sans.org/white-papers/incident-handlers-handbook/",
      tipo: "lectura",
      descripcion: "Manual de manejo de incidentes del SANS Institute — referencia de la industria",
    },
  ],
};

const tema17: TemaC15 = placeholder(17, "COIP y delitos informáticos: qué puede pasar si te hackean o hackeas", "Compliance y Respuesta a Incidentes Ecuador", 4);
const tema18: TemaC15 = placeholder(18, "Seguridad en la nube: AWS y Azure para Ecuador", "Compliance y Respuesta a Incidentes Ecuador", 4);
const tema19: TemaC15 = placeholder(19, "Seguros de ciberseguridad en Ecuador: qué cubren", "Compliance y Respuesta a Incidentes Ecuador", 4);
const tema20: TemaC15 = placeholder(20, "Proyecto final: auditoría de seguridad y plan de remediación", "Compliance y Respuesta a Incidentes Ecuador", 4);

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const C15_TEMAS: TemaC15[] = [
  tema1,  tema2,  tema3,  tema4,  tema5,
  tema6,  tema7,  tema8,  tema9,  tema10,
  tema11, tema12, tema13, tema14, tema15,
  tema16, tema17, tema18, tema19, tema20,
];
