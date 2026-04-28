// ─── C13: IA para el Sector Salud — Datos de 20 temas ────────────────────────
// Curso C13 del programa MDT. 20 temas (scaffolding).
// Módulo 1: IA en imagenología (referencia ImagemIA)
// Módulo 2: Análisis de historias clínicas con NLP
// Módulo 3: Predicción epidemiológica
// Módulo 4: Ética y regulación salud Ecuador (LOPDP, MSP)

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

export interface TemaC13 {
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

export const C13_MODULOS = [
  { num: 1, nombre: "IA en Imagenología", horas: 20, temas: 5 },
  { num: 2, nombre: "Análisis de Historias Clínicas con NLP", horas: 20, temas: 5 },
  { num: 3, nombre: "Predicción Epidemiológica", horas: 20, temas: 5 },
  { num: 4, nombre: "Ética y Regulación Salud Ecuador", horas: 20, temas: 5 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC13 => ({
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

// ─── MÓDULO 1: IA en Imagenología ────────────────────────────────────────────

const MOD1 = "IA en Imagenología";

const tema1: TemaC13 = {
  id: 1,
  titulo: "IA en imagenología médica — fundamentos y caso ImagemIA",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "IA en diagnóstico por imágenes médicas — Introducción en español",
  videoDuracion: "~40 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "IA en Imagenología Médica — Fundamentos y Caso ImagemIA\nC13. IA para el Sector Salud — Tema 1\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "El problema de la imagenología en Ecuador",
      contenido:
        "Ecuador: 1 radiólogo por cada 15,000 habitantes (déficit crítico)\nLista de espera para radiografía en hospitales públicos: 2-8 semanas\nTasas de inasistencia a citas de imagenología: 30-40% sin recordatorio\nErrores de diagnóstico: 30% de diagnósticos graves tienen errores según MSP\n\nImagemIA (empresa ecuatoriana): IA predictiva para imagenología médica\nReducción de inasistencias: 30% con recordatorios inteligentes\nVelocidad de análisis: radiografías en segundos vs minutos de un radiólogo",
    },
    {
      titulo: "Tipos de imágenes médicas que procesa la IA",
      contenido:
        "Radiografías (X-ray): pulmones, huesos, tórax — el más común en Ecuador\nTomografías (CT Scan): secciones 3D de órganos internos\nResonancia Magnética (MRI): tejidos blandos, cerebro, columna\nEcografías (Ultrasound): tiempo real, órganos, obstétrico\nFondos de retina: detección de retinopatía diabética\nHistopatología: análisis de biopsias en microscopio digital\n\nCada tipo requiere un modelo entrenado específicamente con ese tipo de imagen.",
    },
    {
      titulo: "Cómo funciona la IA en diagnóstico por imagen",
      contenido:
        "Arquitectura: CNN (ResNet, DenseNet, EfficientNet) + atención visual\nEntrenamiento: miles de imágenes etiquetadas por radiólogos expertos\nSalida: probabilidad de patología + heatmap de atención (¿dónde miró el modelo?)\n\nEjemplo tórax:\nInput: radiografía AP de pulmones\nOutput: {'neumonía': 0.87, 'derrame_pleural': 0.12, 'normal': 0.01}\n+ heatmap resaltando el área con infiltrado\n\nEl heatmap es crucial para que el médico verifique la decisión del modelo.",
    },
    {
      titulo: "Benchmarks — ¿supera la IA a los radiólogos?",
      contenido:
        "CheXNet (Stanford 2017): detecta neumonía mejor que radiólogos en promedio\nPero: los mejores radiólogos siguen superando el modelo\nConsenso actual (2026): IA + radiólogo > radiólogo solo\n\nVentajas de la IA:\n• Consistencia: no se cansa, trabaja 24/7 sin variabilidad\n• Velocidad: análisis en segundos\n• Costo: reduce el costo por análisis hasta 90%\n\nLimitaciones:\n• Distribución shift: modelo entrenado en EE.UU. puede fallar con pacientes ecuatorianos\n• Falta de contexto clínico: el modelo ve solo la imagen, no la historia del paciente",
    },
    {
      titulo: "ImagemIA — empresa ecuatoriana de IA en salud",
      contenido:
        "Fundada por el equipo de ITSEIA, con sede en Quito\nProducto: sistema de IA para análisis de imagenología predictiva\nFunción principal: predicción de inasistencia + análisis de imágenes\nImpacto: reducción del 30% en inasistencias a citas de imagenología\nClientes: centros de salud privados en Ecuador y expansión LATAM\n\nModelo de negocio: SaaS — el hospital paga por análisis procesado\nRegulación: cumple con LOPDP y normativa MSP para datos de salud\n\nWeb: imagemia.com",
    },
    {
      titulo: "Datasets públicos de imagenología médica",
      contenido:
        "NIH ChestX-ray14: 112,000 radiografías de tórax etiquetadas\nMIMIC-CXR (MIT): 370,000 radiografías con informes de radiólogos\nVinBigData Chest X-ray: dataset con anotaciones de múltiples radiólogos\nISIC: imágenes de dermatología para detección de melanoma\nKaggle Medical Datasets: múltiples competencias con datos médicos\n\nAcceso: la mayoría requieren acuerdo de uso por datos sensibles (DUA)\nRegla ética: NUNCA entrenar con datos de pacientes sin consentimiento explícito.",
    },
    {
      titulo: "Regulación Ecuador para IA en salud",
      contenido:
        "MSP (Ministerio de Salud Pública): establece normativas para uso de tecnología en diagnóstico\nLOPDP: datos de salud son datos sensibles — requieren consentimiento explícito y protección especial\nHIPAA (si exporta a EE.UU.): regulación estadounidense que aplica al manejar datos de pacientes americanos\nNorma ISO 13485: sistemas de gestión de calidad para dispositivos médicos (incluyendo software)\n\nPráctica: cualquier sistema de IA en salud en Ecuador necesita validación clínica antes de uso diagnóstico oficial.",
    },
    {
      titulo: "Resumen del Tema 1",
      contenido:
        "1. Ecuador tiene déficit crítico de radiólogos — IA puede democratizar el acceso\n2. ImagemIA: empresa ecuatoriana que reduce inasistencias 30% con IA predictiva\n3. CNN + heatmap de atención = modelo explicable para médicos\n4. Consenso: IA + radiólogo > radiólogo solo. La IA no reemplaza, asiste\n5. LOPDP y normativa MSP regulan el uso de datos de salud en Ecuador\n\nPróximo: Arquitecturas CNN para diagnóstico de tórax en Python",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuánto reduce ImagemIA las inasistencias a citas de imagenología?",
      opciones: ["5%", "15%", "30%", "70%"],
      respuesta: 2,
      explicacion:
        "ImagemIA, empresa ecuatoriana de IA en salud, logra reducir las inasistencias a citas de imagenología en un 30% mediante recordatorios inteligentes y predicción de inasistencia basada en datos del paciente.",
    },
    {
      pregunta: "¿Qué es un heatmap de atención en el contexto de IA en imagenología?",
      opciones: [
        "Un mapa de temperatura del hospital",
        "Una visualización que muestra qué áreas de la imagen el modelo consideró más relevantes para su diagnóstico",
        "Un gráfico de la temperatura del paciente en el tiempo",
        "Un mapa de flujo de calor en el cuerpo",
      ],
      respuesta: 1,
      explicacion:
        "El heatmap de atención (attention heatmap o Grad-CAM) resalta visualmente qué píxeles o regiones de la imagen médica el modelo de IA ponderó más para su decisión diagnóstica. Esto hace el diagnóstico explicable y verificable para el médico.",
    },
    {
      pregunta: "¿Cuál es el consenso actual sobre IA vs. radiólogos para diagnóstico por imagen?",
      opciones: [
        "La IA ya supera ampliamente a todos los radiólogos",
        "Los radiólogos siempre son mejores que la IA",
        "IA + radiólogo juntos son mejores que cualquiera de los dos solos",
        "La IA no puede ayudar en diagnóstico por imagen",
      ],
      respuesta: 2,
      explicacion:
        "El consenso de la comunidad médica en 2026 es que la combinación de IA + radiólogo supera el desempeño de cualquiera de los dos por separado. La IA aporta consistencia y velocidad; el radiólogo aporta contexto clínico, razonamiento diagnóstico complejo y responsabilidad.",
    },
    {
      pregunta: "¿Por qué los datos de salud tienen protección especial bajo la LOPDP en Ecuador?",
      opciones: [
        "Solo por razones comerciales",
        "Porque son datos sensibles que revelan información íntima de la persona y pueden causar discriminación o daño si se usan sin control",
        "Porque el MSP los clasifica como propiedad del Estado",
        "Solo aplica para datos de hospitales públicos",
      ],
      respuesta: 1,
      explicacion:
        "La LOPDP clasifica los datos de salud como datos sensibles porque revelan información íntima (enfermedades, condiciones, tratamientos) que podría usarse para discriminación laboral, negación de seguros o daño a la reputación del titular si se procesan sin su consentimiento explícito.",
    },
    {
      pregunta: "¿Cuál es el principal dataset público para entrenar modelos de IA en radiografías de tórax?",
      opciones: ["ImageNet", "COCO Dataset", "NIH ChestX-ray14 con 112,000 radiografías", "MNIST"],
      respuesta: 2,
      explicacion:
        "NIH ChestX-ray14 es el dataset más utilizado para entrenar y evaluar modelos de IA en análisis de radiografías de tórax. Contiene 112,120 imágenes con etiquetas para 14 condiciones médicas, publicado por el National Institutes of Health de EE.UU.",
    },
  ],
  ejercicio: {
    titulo: "Clasificador básico de radiografías de tórax con CNN pre-entrenada",
    objetivo:
      "Implementar un clasificador de radiografías de tórax (normal vs neumonía) usando una CNN pre-entrenada en Google Colab con datos de Kaggle, entendiendo el flujo de trabajo de IA médica",
    herramientas: "Google Colab + Python + TensorFlow/Keras + Kaggle API + matplotlib",
    datosEjemplo:
      "Dataset: Chest X-Ray Images (Pneumonia) de Kaggle\nURL: kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia\n5,863 radiografías de tórax: 1,341 normales + 3,875 con neumonía\nDividas en train, validation y test",
    pasos: [
      "Abrir Google Colab con GPU T4 activada",
      "Descargar dataset de Kaggle: !pip install kaggle; subir kaggle.json con API key; !kaggle datasets download -d paultimothymooney/chest-xray-pneumonia",
      "En ChatGPT pedir: 'Dame código Python completo para clasificar radiografías de tórax (normal vs neumonía) usando transfer learning con EfficientNetB0 pre-entrenada. Incluir: carga de datos con ImageDataGenerator, fine-tuning de las últimas 20 capas, entrenamiento 10 épocas, curvas de pérdida y precisión, visualización de grad-CAM para 3 imágenes de test'",
      "Ejecutar el código y documentar: accuracy en test, precision y recall para ambas clases",
      "Visualizar los heatmaps Grad-CAM: verificar que el modelo 'mira' las zonas correctas del pulmón",
      "Reflexión ética (200 palabras): ¿podría usarse este modelo directamente en hospitales ecuatorianos? ¿Qué validaciones adicionales necesitaría? ¿Quién sería responsable si el modelo falla?",
    ],
    resultado:
      "Clasificador de neumonía en radiografías con EfficientNetB0 con accuracy documentada, visualizaciones Grad-CAM de 3 imágenes y reflexión ética sobre uso en contexto ecuatoriano.",
    criterios: [
      { criterio: "Modelo CNN entrenando correctamente con datos de Kaggle", puntos: 30 },
      { criterio: "Métricas de evaluación completas (accuracy, precision, recall)", puntos: 25 },
      { criterio: "Visualizaciones Grad-CAM de 3 imágenes correctamente generadas", puntos: 25 },
      { criterio: "Reflexión ética sobre uso en hospitales ecuatorianos", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "NIH ChestX-ray14 Dataset",
      url: "https://nihcc.app.box.com/v/ChestXray-NIHCC",
      tipo: "documentacion",
      descripcion: "Dataset oficial de radiografías de tórax del NIH con 112,000 imágenes etiquetadas. El benchmark estándar para modelos de IA en imagenología pulmonar.",
    },
    {
      titulo: "ImagemIA — IA en salud Ecuador",
      url: "https://imagemia.com",
      tipo: "herramienta",
      descripcion: "Empresa ecuatoriana de IA predictiva en imagenología médica. Caso de uso real de IA en salud en Ecuador.",
    },
    {
      titulo: "MSP Ecuador — Normativa tecnología en salud",
      url: "https://www.salud.gob.ec/",
      tipo: "documentacion",
      descripcion: "Ministerio de Salud Pública del Ecuador. Normativas, guías y resoluciones sobre tecnología e innovación en el sistema de salud ecuatoriano.",
    },
    {
      titulo: "Kaggle — Chest X-Ray Images Pneumonia",
      url: "https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia",
      tipo: "herramienta",
      descripcion: "Dataset de 5,863 radiografías de tórax para clasificación normal vs neumonía. El punto de entrada más accesible para aprender IA en imagenología.",
    },
  ],
  teoria: `La inteligencia artificial en imagenología médica representa una de las aplicaciones más prometedoras y transformadoras de la IA en el sistema de salud. Ecuador enfrenta un déficit estructural de radiólogos: con aproximadamente 1 radiólogo por cada 15,000 habitantes (muy por debajo del estándar de la OMS de 1 por 10,000), las listas de espera para estudios de imagenología en hospitales públicos pueden extenderse entre 2 y 8 semanas. Este déficit tiene consecuencias reales en la mortalidad y morbilidad: diagnósticos tardíos de tuberculosis, cáncer pulmonar y otras condiciones que la detección temprana podría tratar exitosamente.

La IA en imagenología usa principalmente redes neuronales convolucionales (CNN) entrenadas con miles o millones de imágenes médicas etiquetadas por radiólogos expertos. Arquitecturas como ResNet, DenseNet y EfficientNet han demostrado capacidad de detectar patologías en radiografías de tórax, tomografías y resonancias magnéticas con precisión comparable o superior al promedio de radiólogos. El estudio CheXNet de Stanford (2017) fue el primero en demostrar que una CNN podía detectar neumonía en radiografías con mayor precisión que el radiólogo promedio, generando un debate intenso sobre el futuro del diagnóstico radiológico.

ImagemIA es una empresa ecuatoriana fundada por el equipo detrás de ITSEIA que desarrolla IA predictiva para el sector de salud, con foco inicial en imagenología. Su producto principal aborda dos problemas simultáneamente: la predicción de inasistencia a citas (usando datos del paciente para enviar recordatorios personalizados, reduciendo las inasistencias en un 30%) y el análisis de imágenes médicas para apoyo al diagnóstico. Este es un ejemplo concreto de cómo la IA puede mejorar la eficiencia del sistema de salud ecuatoriano sin reemplazar a los profesionales médicos.

La regulación del uso de IA en salud en Ecuador está en proceso de desarrollo. La LOPDP (Ley Orgánica de Protección de Datos Personales) clasifica los datos de salud como datos sensibles que requieren consentimiento explícito del paciente para su tratamiento. El MSP (Ministerio de Salud Pública) tiene competencia para regular el uso de tecnologías de diagnóstico, y cualquier sistema de IA que se use en contexto clínico debería pasar por un proceso de validación clínica antes de su uso oficial como herramienta diagnóstica.`,
};

const tema2: TemaC13 = placeholder(2, "CNN para diagnóstico de tórax — implementación Python", MOD1, 1);
const tema3: TemaC13 = placeholder(3, "Detección de retinopatía diabética con IA", MOD1, 1);
const tema4: TemaC13 = placeholder(4, "IA en patología digital y análisis de biopsias", MOD1, 1);
const tema5: TemaC13 = placeholder(5, "Sistemas de apoyo diagnóstico — integración clínica", MOD1, 1);

// ─── MÓDULO 2: Análisis de Historias Clínicas con NLP ───────────────────────

const MOD2 = "Análisis de Historias Clínicas con NLP";

const tema6: TemaC13 = {
  id: 6,
  titulo: "NLP para historias clínicas — extracción de información médica",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "NLP clínico — extracción de información de texto médico",
  videoDuracion: "~38 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "NLP para Historias Clínicas — Extracción de Información Médica\nC13. IA para el Sector Salud — Tema 6\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "El problema de los datos clínicos no estructurados",
      contenido:
        "80% de los datos en salud están en texto no estructurado:\n• Notas de médico en consulta\n• Informes de radiología\n• Resúmenes de alta hospitalaria\n• Anamnesis y evoluciones\n\nEcuador: el sistema HCE (Historia Clínica Electrónica) del MSP tiene millones de registros\nProblema: son texto libre en español, no campos estructurados\nOportunidad: NLP puede extraer diagnósticos, medicamentos, alergias y procedimientos automáticamente.",
    },
    {
      titulo: "Tareas de NLP clínico",
      contenido:
        "NER médico: identificar entidades — diagnósticos, medicamentos, procedimientos, laboratorios\nRelaciones: 'paciente tiene DIABETES TIPO 2 controlada con METFORMINA 850mg'\nNegación: 'NO presenta fiebre' ≠ 'presenta fiebre'\nTemporalidad: ¿el diagnóstico es actual o de historia previa?\nCo-referencia: 'el paciente... él... el Sr. García' = misma persona\n\nEjemplo Ecuador: historial de IESS con abreviaturas locales: 'HTA', 'DM2', 'EPOC', 'ERC'",
    },
    {
      titulo: "Herramientas de NLP clínico",
      contenido:
        "spaCy + medspacy: extensión para NLP clínico en inglés\nNegEx: detecta negaciones en texto médico\nMedCAT (MedCATalyst): NER médico con ontologías\nBioBERT: BERT fine-tuned en literatura biomédica\nClinicalBERT: BERT entrenado en notas clínicas del MIMIC-III\n\nPara español médico:\n• BioBERT en español + fine-tuning con notas ecuatorianas\n• BERT-base-spanish + fine-tuning con corpus médico\n• No hay un modelo de NLP clínico específico para español ecuatoriano (2026) — oportunidad de investigación",
    },
    {
      titulo: "Caso Ecuador — IESS y la HCE",
      contenido:
        "IESS Ecuador: 4+ millones de afiliados, millones de historias clínicas electrónicas\nSistema AS400 + nuevos sistemas HCE\n\nUso de NLP:\n• Extraer automáticamente CIE-10 (códigos diagnóstico) de texto libre del médico\n• Detectar pacientes con múltiples comorbilidades para programas preventivos\n• Analizar tendencias de prescripción (¿qué medicamentos se recetan más por región?)\n• Identificar pacientes que podrían beneficiarse de programas de manejo de enfermedad crónica\n\nBarrera: acceso a datos requiere convenio formal con IESS + cumplimiento LOPDP.",
    },
    {
      titulo: "Resumen del Tema 6",
      contenido:
        "1. 80% de los datos de salud son texto no estructurado — NLP los hace analizables\n2. NLP clínico: NER médico + negaciones + temporalidad + co-referencia\n3. BioBERT y ClinicalBERT son los modelos base más usados (en inglés)\n4. Para español ecuatoriano médico no hay modelo específico — oportunidad\n5. IESS tiene millones de historias clínicas que se beneficiarían de NLP\n\nPróximo: Codificación diagnóstica automática con CIE-10",
    },
  ],
  quiz: [
    {
      pregunta: "¿Por qué la detección de negaciones es crítica en NLP clínico?",
      opciones: [
        "Por razones estéticas de redacción médica",
        "Porque 'NO presenta fiebre' y 'presenta fiebre' tienen significados clínicos opuestos — confundirlos lleva a diagnósticos incorrectos",
        "Solo importa en inglés médico",
        "Los médicos ecuatorianos nunca usan negaciones en sus notas",
      ],
      respuesta: 1,
      explicacion:
        "En notas clínicas, las negaciones son frecuentes y clínicamente críticas. 'No presenta dolor torácico' descarta una condición importante. Un modelo que no detecte la negación podría extraer incorrectamente 'dolor torácico' como síntoma presente.",
    },
    {
      pregunta: "¿Qué modelo de lenguaje fue entrenado específicamente en notas clínicas del dataset MIMIC-III?",
      opciones: ["BETO", "spaCy español", "ClinicalBERT", "GPT-4o médico"],
      respuesta: 2,
      explicacion:
        "ClinicalBERT es una versión de BERT fine-tuned en notas clínicas del MIMIC-III, un dataset de registros de UCI de hospitales americanos. Tiene mejor desempeño que BERT base para tareas de NLP clínico en inglés.",
    },
    {
      pregunta: "¿Qué porcentaje de los datos en salud están en formato de texto no estructurado?",
      opciones: ["20%", "50%", "80%", "100%"],
      respuesta: 2,
      explicacion:
        "Estudios del sector salud estiman que el 80% de los datos clínicos relevantes están en formato de texto no estructurado: notas médicas, informes de radiología, evoluciones, anamnesis y resúmenes de alta. Solo el 20% está en campos estructurados.",
    },
    {
      pregunta: "¿Qué sistema de codificación diagnóstica podría automatizarse con NLP en el IESS Ecuador?",
      opciones: ["ISO 27001", "CIE-10 (Clasificación Internacional de Enfermedades)", "DSM-5", "ICD-11 solo en inglés"],
      respuesta: 1,
      explicacion:
        "El CIE-10 (Clasificación Internacional de Enfermedades, décima revisión) es el sistema de codificación diagnóstica estándar en Ecuador y LATAM. NLP puede extraer automáticamente el código CIE-10 correcto del texto libre de la nota médica, reduciendo el trabajo administrativo del médico.",
    },
    {
      pregunta: "¿Cuál es la principal barrera de acceso a las historias clínicas del IESS para investigación con NLP en Ecuador?",
      opciones: [
        "Los datos no existen en formato digital",
        "El IESS no tiene sistemas informáticos",
        "Acceder a datos requiere convenio formal con el IESS y cumplimiento estricto de la LOPDP para datos sensibles de salud",
        "NLP no puede procesar español médico",
      ],
      respuesta: 2,
      explicacion:
        "Los datos de salud del IESS son datos sensibles bajo la LOPDP. Para acceder a ellos con fines de investigación o desarrollo de IA se requiere un convenio formal con la institución, aprobación ética, y garantías de anonimización y seguridad de datos.",
    },
  ],
  ejercicio: {
    titulo: "NER médico en notas clínicas en español con spaCy",
    objetivo:
      "Implementar un sistema básico de extracción de entidades médicas (diagnósticos, medicamentos, dosis) en notas clínicas ficticias en español usando spaCy con patrones personalizados",
    herramientas: "Google Colab + Python + spaCy + pandas",
    datosEjemplo:
      "Notas clínicas ficticias en español ecuatoriano:\n1. 'Paciente masculino 58 años, DM2 de 10 años de evolución, toma Metformina 850mg BID. HbA1c 8.2%. Se ajusta dosis a 1000mg.'\n2. 'Femenina 45 años con HTA. Losartán 50mg QD bien tolerado. PA 140/90. No presenta edemas.'\n3. 'EPOC estadio III, FEV1 42%. Se indica Tiotropio 18mcg inhalado. Abstinencia tabáquica aconsejada.'",
    pasos: [
      "Instalar spaCy y modelo español: !python -m spacy download es_core_news_lg",
      "Crear patrones personalizados para entidades médicas: DIAGNOSIS (DM2, HTA, EPOC), MEDICATION (Metformina, Losartán, Tiotropio), DOSE (850mg, 50mg, 18mcg), FREQUENCY (BID, QD)",
      "Implementar EntityRuler de spaCy con los patrones creados",
      "Procesar las 3 notas clínicas y extraer entidades en tabla",
      "Detectar negaciones manualmente con regla simple: si la entidad aparece precedida por 'no' en una ventana de 3 tokens → marcar como negada",
      "Documentar precisión: ¿cuántas entidades se detectaron correctamente? ¿Cuáles se perdieron?",
    ],
    resultado:
      "Sistema NER médico básico con spaCy para 3 notas clínicas en español, con detección de diagnósticos, medicamentos y dosis, y análisis de negaciones.",
    criterios: [
      { criterio: "Patrones de EntityRuler implementados para 4 tipos de entidades", puntos: 30 },
      { criterio: "Extracción correcta de entidades en las 3 notas", puntos: 30 },
      { criterio: "Detección de negaciones implementada", puntos: 20 },
      { criterio: "Análisis de precision/recall del sistema", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "medspaCy — NLP clínico con spaCy",
      url: "https://github.com/medspacy/medspacy",
      tipo: "herramienta",
      descripcion: "Extensión de spaCy para NLP clínico. Incluye detección de negaciones, secciones de historia clínica y NER médico.",
    },
    {
      titulo: "BioBERT — BERT para biomedicina",
      url: "https://github.com/dmis-lab/biobert",
      tipo: "documentacion",
      descripcion: "BERT pre-entrenado en literatura biomédica (PubMed y PMC). Modelo base para tareas de NLP en texto médico-científico.",
    },
    {
      titulo: "MIMIC-III — Dataset clínico de MIT",
      url: "https://mimic.mit.edu/",
      tipo: "documentacion",
      descripcion: "Base de datos clínica de más de 40,000 pacientes de UCI del MIT. Requiere registro y acuerdo de uso. Estándar para investigación en NLP clínico.",
    },
  ],
  teoria: `El NLP clínico (Clinical NLP) es la aplicación del procesamiento de lenguaje natural a texto médico: notas de médico, informes de radiología, resúmenes de alta hospitalaria, prescripciones y evoluciones. Es una de las áreas de mayor potencial en la salud digital porque el 80% de los datos clínicos relevantes se encuentran en este formato de texto no estructurado, inaccesible a los sistemas de análisis convencionales.

El sistema de Historia Clínica Electrónica (HCE) del IESS Ecuador, con millones de registros de sus más de 4 millones de afiliados activos, es un tesoro de datos clínicos que actualmente se usa de forma muy limitada. Un sistema de NLP clínico podría: extraer automáticamente los códigos CIE-10 (Clasificación Internacional de Enfermedades) del texto libre del médico, eliminando el trabajo administrativo de codificación manual; identificar pacientes con comorbilidades múltiples (diabetes + hipertensión + enfermedad renal) para enrolarlos en programas de manejo integrado de enfermedades crónicas; analizar patrones de prescripción por región, grupo etario y diagnóstico para optimizar el cuadro básico de medicamentos; y detectar señales de alerta tempranas de deterioro clínico a partir de las evoluciones diarias.

Los retos técnicos del NLP clínico en español ecuatoriano son específicos y complejos. Las notas médicas usan abreviaturas locales (HTA para hipertensión arterial, DM2 para diabetes mellitus tipo 2, EPOC para enfermedad pulmonar obstructiva crónica) que los modelos genéricos no conocen. Las negaciones son críticas: "no presenta fiebre" es diagnósticamente opuesto a "presenta fiebre", y un modelo que no detecte la negación cometería un error grave. La temporalidad es igualmente importante: "antecedente de IAM hace 5 años" vs "IAM en evolución" requieren tratamiento clínico completamente diferente.

No existe en 2026 un modelo de NLP clínico específicamente entrenado en notas médicas en español ecuatoriano. Esta es una brecha de investigación y desarrollo que representa una oportunidad concreta para investigadores y empresas ecuatorianas. El camino más accesible es el fine-tuning de modelos existentes como BETO (BERT en español) o XLM-R con un corpus de notas clínicas ecuatorianas anonimizadas, en colaboración con instituciones como el IESS, el MSP o universidades médicas como la UCE o USFQ.`,
};

const tema7: TemaC13 = placeholder(7, "Codificación diagnóstica automática CIE-10", MOD2, 2);
const tema8: TemaC13 = placeholder(8, "Análisis de prescripciones con NLP", MOD2, 2);
const tema9: TemaC13 = placeholder(9, "Extracción de eventos clínicos de texto libre", MOD2, 2);
const tema10: TemaC13 = placeholder(10, "NLP para señales de farmacovigilancia", MOD2, 2);

// ─── MÓDULO 3: Predicción Epidemiológica ─────────────────────────────────────

const MOD3 = "Predicción Epidemiológica";

const tema11: TemaC13 = {
  id: 11,
  titulo: "IA para vigilancia epidemiológica en Ecuador",
  modulo: MOD3,
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Epidemiología computacional con IA — modelos predictivos en salud pública",
  videoDuracion: "~40 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "IA para Vigilancia Epidemiológica en Ecuador\nC13. IA para el Sector Salud — Tema 11\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "Epidemiología computacional — qué es y para qué sirve",
      contenido:
        "Vigilancia epidemiológica tradicional:\n• Reportes semanales de brotes de establecimientos de salud → MSP → análisis → acción\n• Tiempo de respuesta: 2-4 semanas\n\nVIgilancia con IA:\n• Datos en tiempo real: consultas médicas, búsquedas en Google, ventas de medicamentos, posts en redes\n• Modelos predictivos: detectar brotes 1-2 semanas antes\n• Tiempo de respuesta: 24-72 horas\n\nCOVID-19 en Ecuador: los modelos predictivos podrían haber alertado 2-3 semanas antes del pico de Guayaquil en marzo 2020.",
    },
    {
      titulo: "Fuentes de datos para vigilancia epidemiológica con IA",
      contenido:
        "Datos oficiales Ecuador:\n• SIVE-Alerta (MSP): sistema de información de vigilancia epidemiológica\n• IESS: consultas por diagnóstico en tiempo casi real\n• Hospitales centinela: 18 hospitales con reporte semanal\n\nDatos no convencionales (nowcasting):\n• Google Trends: búsquedas de 'síntomas dengue Ecuador', 'dolor de cabeza'\n• Ventas de farmacias: picos de ventas de antipiréticos\n• Redes sociales: menciones de síntomas con geolocalización\n• Datos meteorológicos: temperatura y humedad para enfermedades vectoriales",
    },
    {
      titulo: "Enfermedades endémicas de Ecuador — oportunidades",
      contenido:
        "DENGUE: endémico en la Costa y Amazonia. Brotes relacionados con lluvia y temperatura.\nModelo: temperatura + pluviosidad + casos previos → predicción de brote en 2 semanas\n\nMALARIA: Esmeraldas, Sucumbíos, Orellana\nModelo: datos de vector (mosquito), temperatura, lluvias, viajes\n\nCOVID-19 y variantes futuras\nINFLUENZA: estacionalidad marcada en la Sierra\n\nECUADOR MSP: el Plan Estratégico de Salud 2021-2025 incluye IA para vigilancia epidemiológica.",
    },
    {
      titulo: "Modelos epidemiológicos con ML",
      contenido:
        "Modelos SIR/SEIR aumentados con ML: clásicos epidemiológicos + datos en tiempo real\nProphet (Meta): series temporales de casos semanales con estacionalidad\nLSTM: captura patrones complejos en series largas de datos de vigilancia\nXGBoost con features temporales: buen balance velocidad/precisión para datos tabulares\n\nCaso Ecuador COVID: Universidad San Francisco de Quito usó modelos compartimentales\npara proyectar la curva de contagios en 2020 con datos del MSP.",
    },
    {
      titulo: "Resumen del Tema 11",
      contenido:
        "1. La vigilancia epidemiológica con IA reduce el tiempo de respuesta de semanas a días\n2. Fuentes no convencionales (Google Trends, farmacias) permiten nowcasting en tiempo real\n3. Ecuador tiene enfermedades endémicas prioritarias: dengue, malaria, influenza\n4. Modelos SEIR + Prophet + LSTM son los más usados en epidemiología computacional\n5. El MSP Ecuador tiene plan estratégico que incluye IA en vigilancia\n\nPróximo: Implementación de modelo de predicción de dengue con datos del MSP",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál fue el tiempo de respuesta de la vigilancia epidemiológica tradicional vs. con IA durante brotes?",
      opciones: [
        "Tradicional: 1 día / IA: 1 hora",
        "Tradicional: 2-4 semanas / IA: 24-72 horas",
        "Son iguales — 1 semana en ambos casos",
        "Tradicional es más rápida porque tiene más personal",
      ],
      respuesta: 1,
      explicacion:
        "La vigilancia tradicional basada en reportes semanales de establecimientos de salud tarda 2-4 semanas en detectar un brote emergente. Los sistemas con IA usando datos en tiempo real pueden detectar señales de alerta en 24-72 horas.",
    },
    {
      pregunta: "¿Qué datos no convencionales puede usar la IA para vigilancia epidemiológica (nowcasting)?",
      opciones: [
        "Solo los datos oficiales del MSP",
        "Google Trends, ventas en farmacias, menciones en redes sociales y datos meteorológicos",
        "Solo datos de hospitales privados",
        "Únicamente datos de laboratorio confirmados",
      ],
      respuesta: 1,
      explicacion:
        "El nowcasting epidemiológico usa fuentes no convencionales para detectar señales tempranas: Google Trends muestra aumentos en búsquedas de síntomas, las ventas de farmacias revelan automedicación, las redes sociales con geolocalización muestran distribución espacial de síntomas.",
    },
    {
      pregunta: "¿Cuáles son las enfermedades endémicas de mayor prioridad para vigilancia con IA en Ecuador?",
      opciones: [
        "Gripe común y resfriado",
        "Dengue, malaria e influenza — enfermedades vectoriales y respiratorias endémicas en zonas específicas",
        "Solo COVID-19",
        "Enfermedades que solo afectan a la Sierra ecuatoriana",
      ],
      respuesta: 1,
      explicacion:
        "El dengue es endémico en la Costa y Amazonia con brotes estacionales correlacionados con lluvia y temperatura. La malaria persiste en Esmeraldas, Sucumbíos y Orellana. La influenza tiene estacionalidad marcada en la Sierra. Los tres son prioritarios para modelos de predicción epidemiológica en Ecuador.",
    },
    {
      pregunta: "¿Cuál fue el rol de la IA en la respuesta de Ecuador ante COVID-19?",
      opciones: [
        "No se usó IA en Ecuador durante la pandemia",
        "La USFQ desarrolló modelos compartimentales para proyectar la curva de contagios con datos del MSP",
        "Solo se usó para comprar mascarillas automáticamente",
        "La IA predijo exactamente el número de fallecidos",
      ],
      respuesta: 1,
      explicacion:
        "La Universidad San Francisco de Quito (USFQ) desarrolló modelos epidemiológicos compartimentales usando datos del MSP para proyectar la curva de contagios de COVID-19 en Ecuador, siendo una de las primeras aplicaciones documentadas de modelos predictivos en epidemiología durante la pandemia en el país.",
    },
    {
      pregunta: "¿Qué modelo de series temporales es especialmente adecuado para predicción de brotes con estacionalidad múltiple?",
      opciones: [
        "Regresión lineal simple",
        "K-means clustering",
        "Prophet de Meta/Facebook",
        "PCA (Análisis de componentes principales)",
      ],
      respuesta: 2,
      explicacion:
        "Prophet fue diseñado específicamente para series temporales con estacionalidad múltiple (semanal, anual) y eventos especiales — exactamente el tipo de datos de vigilancia epidemiológica que tiene picos estacionales anuales y puede verse afectada por eventos como carnavales o días festivos.",
    },
  ],
  ejercicio: {
    titulo: "Modelo de predicción de dengue en Ecuador con datos del MSP",
    objetivo:
      "Construir un modelo predictivo de casos de dengue usando datos históricos del MSP y variables meteorológicas, simulando un sistema de alerta temprana epidemiológica",
    herramientas: "Google Colab + Python + Prophet + pandas + datos INAMHI (temperatura/pluviosidad)",
    datosEjemplo:
      "Datos simulados de casos de dengue por semana epidemiológica en Ecuador, 2018-2024, con estacionalidad (pico en febrero-marzo post-lluvias en la Costa). Datos meteorológicos correlacionados de temperatura promedio y precipitación mensual del INAMHI.",
    pasos: [
      "Crear notebook 'Prediccion_Dengue_Ecuador'",
      "Generar dataset simulado con ChatGPT: serie temporal de 52 semanas × 6 años de casos de dengue con estacionalidad epidemiológica ecuatoriana",
      "Entrenar Prophet con los datos: m = Prophet(seasonality_mode='multiplicative'); m.add_regressor('temperatura'); m.add_regressor('precipitacion')",
      "Predecir 12 semanas hacia adelante (próximo trimestre)",
      "Visualizar: serie histórica + predicción + intervalos de confianza",
      "Identificar semanas de alto riesgo (casos predichos > umbral de alerta)",
      "Reflexión (250 palabras): ¿qué acciones del MSP activaría el modelo si predice un pico? ¿Cuáles son los límites éticos de actuar en base a predicciones y no en datos confirmados?",
    ],
    resultado:
      "Modelo Prophet de predicción de dengue para Ecuador con variables meteorológicas, predicción de 12 semanas, identificación de semanas de alto riesgo y análisis de implicaciones para política pública de salud.",
    criterios: [
      { criterio: "Modelo Prophet entrenado con datos y regressores de temperatura/precipitación", puntos: 30 },
      { criterio: "Predicción de 12 semanas con intervalos de confianza visualizada", puntos: 25 },
      { criterio: "Identificación correcta de semanas de alto riesgo sobre umbral", puntos: 20 },
      { criterio: "Reflexión sobre implicaciones para política pública de salud en Ecuador", puntos: 25 },
    ],
  },
  recursos: [
    {
      titulo: "MSP Ecuador — SIVE-Alerta epidemiológica",
      url: "https://www.salud.gob.ec/gacetas-epidemiologicas/",
      tipo: "documentacion",
      descripcion: "Sistema de Información de Vigilancia Epidemiológica del MSP. Gacetas semanales con datos de enfermedades de notificación obligatoria en Ecuador.",
    },
    {
      titulo: "INAMHI Ecuador — Datos meteorológicos",
      url: "https://www.inamhi.gob.ec/",
      tipo: "documentacion",
      descripcion: "Instituto Nacional de Meteorología e Hidrología del Ecuador. Datos históricos de temperatura, precipitación e índices climáticos por estación meteorológica.",
    },
    {
      titulo: "WHO — Vigilancia epidemiológica con IA",
      url: "https://www.who.int/teams/surveillance-forecasting-response",
      tipo: "lectura",
      descripcion: "Recursos de la OMS sobre sistemas de vigilancia epidemiológica, modelos de predicción y respuesta a brotes con apoyo de inteligencia artificial.",
    },
  ],
  teoria: `La predicción epidemiológica con inteligencia artificial representa una de las aplicaciones con mayor potencial de impacto en la salud pública ecuatoriana. La pandemia de COVID-19 en 2020 demostró de forma dramática las consecuencias de una vigilancia epidemiológica que no anticipa, sino que reacciona. Guayaquil se convirtió en marzo de 2020 en una de las ciudades más afectadas del mundo, con imágenes de féretros en las calles que impactaron al planeta. Los modelos epidemiológicos con IA podrían haber alertado con 2-3 semanas de antelación sobre el crecimiento exponencial inminente, permitiendo al sistema de salud prepararse.

Ecuador tiene enfermedades endémicas con alta carga de morbilidad y mortalidad que son especialmente susceptibles de modelos predictivos. El dengue, endémico en la Costa y la Amazonia, tiene brotes estacionales correlacionados con la temperatura y la pluviosidad: después de las lluvias intensas, los criaderos de Aedes aegypti proliferan y los casos aumentan 2-4 semanas después. Esta relación meteorológica-epidemiológica es perfecta para modelos de series temporales que incluyen variables climáticas. La malaria persiste en zonas fronterizas y amazónicas, y la influenza tiene estacionalidad marcada en la Sierra con picos en los meses más fríos.

El sistema SIVE-Alerta del MSP Ecuador recopila semanalmente datos de enfermedades de notificación obligatoria de todos los establecimientos de salud del país. Aunque es una base de datos valiosa, la latencia de 1-2 semanas en la consolidación de datos limita su utilidad para respuesta temprana. Los sistemas de vigilancia basados en IA incorporan fuentes de datos en tiempo real: Google Trends (búsquedas de síntomas), ventas de antipiréticos y antihistamínicos en farmacias, menciones en redes sociales con geolocalización, y datos meteorológicos en tiempo real del INAMHI. La combinación de estas fuentes con los datos oficiales permite un nowcasting (estimación en tiempo real) que puede alertar sobre brotes emergentes días antes de que aparezcan en los reportes oficiales.

Los modelos de machine learning más utilizados en epidemiología computacional son Prophet para series temporales con estacionalidad (ideal para datos semanales con picos anuales recurrentes), LSTM para capturar dependencias temporales largas en series históricas extensas, y XGBoost con features de tiempo (semana del año, mes, temperatura, precipitación) para predicción tabular. Los modelos compartimentales clásicos como SIR (Susceptibles-Infectados-Recuperados) y SEIR pueden aumentarse con parámetros calibrados por ML para combinar la interpretabilidad de los modelos epidemiológicos con la capacidad predictiva del machine learning.`,
};

const tema12: TemaC13 = placeholder(12, "Modelos SIR/SEIR aumentados con ML", MOD3, 3);
const tema13: TemaC13 = placeholder(13, "Predicción de demanda hospitalaria con IA", MOD3, 3);
const tema14: TemaC13 = placeholder(14, "Nowcasting epidemiológico con datos de redes sociales", MOD3, 3);
const tema15: TemaC13 = placeholder(15, "Dashboard de vigilancia epidemiológica en tiempo real", MOD3, 3);

// ─── MÓDULO 4: Ética y Regulación Salud Ecuador ──────────────────────────────

const MOD4 = "Ética y Regulación Salud Ecuador";

const tema16: TemaC13 = {
  id: 16,
  titulo: "LOPDP y privacidad de datos de salud en Ecuador",
  modulo: MOD4,
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "LOPDP Ecuador — Protección de datos personales en salud",
  videoDuracion: "~35 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "LOPDP y Privacidad de Datos de Salud en Ecuador\nC13. IA para el Sector Salud — Tema 16\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "Datos de salud — por qué son ultra-sensibles",
      contenido:
        "Los datos de salud revelan:\n• Condiciones crónicas (diabetes, VIH, cáncer)\n• Salud mental\n• Historial reproductivo y sexual\n• Vulnerabilidades físicas y cognitivas\n• Información genética\n\nImpacto de una brecha:\n• Discriminación laboral (empleador rechaza candidato por condición crónica)\n• Rechazo de seguros de salud o vida\n• Daño reputacional\n• Extorsión y chantaje\n• En Ecuador: casos documentados de discriminación laboral por VIH",
    },
    {
      titulo: "LOPDP Ecuador — aspectos clave para datos de salud",
      contenido:
        "Ley Orgánica de Protección de Datos Personales (2021, en vigor desde 2023)\n\nDatos sensibles (art. 26): datos de salud requieren consentimiento EXPLÍCITO\nFinalidad limitada: solo se pueden usar para el propósito declarado al recopilar\nMinimización: recopilar SOLO los datos necesarios, no más\nDerecho al olvido: el paciente puede pedir que se eliminen sus datos\nAutoridad de control: Superintendencia de Protección de Datos Personales (SPDP)\n\nSanciones: hasta $2M o el 2% de los ingresos anuales.",
    },
    {
      titulo: "Consentimiento informado en IA de salud",
      contenido:
        "Para usar datos de salud en IA se necesita consentimiento específico:\n• 'Autorizo el uso de mis datos radiológicos para el entrenamiento de un modelo de IA que ayude en diagnósticos de neumonía'\n→ No es suficiente el consentimiento genérico de 'acepto términos y condiciones'\n\nConsentimiento dinámico: el paciente puede retirar su consentimiento en cualquier momento\nAnonimización vs pseudonimización:\n• Anonimización completa: no se puede re-identificar (exime de LOPDP)\n• Pseudonimización: reemplaza identificadores pero es reversible (aún requiere protección)",
    },
    {
      titulo: "IA explicable en salud — por qué importa más aquí",
      contenido:
        "Principio: el médico debe poder explicar al paciente por qué la IA hizo una recomendación\n\n'Caja negra' inaceptable en medicina:\n• Decisión de IA que recomienda no operar un tumor → médico debe explicar POR QUÉ\n• Seguro de salud que usa IA para negar cobertura → debe ser explicable\n\nHerramientas de explicabilidad:\n• SHAP values: importancia de cada variable en la decisión\n• Grad-CAM: qué parte de la imagen vio el modelo\n• LIME: aproximación local del modelo complejo\n\nRegulación UE (referencia): Acto de IA de la UE requiere explicabilidad en IA médica de alto riesgo.",
    },
    {
      titulo: "Resumen del Tema 16",
      contenido:
        "1. Datos de salud son ultra-sensibles — su mal uso puede causar discriminación real\n2. LOPDP Ecuador: consentimiento explícito obligatorio para datos de salud\n3. Anonimización completa libera de LOPDP; pseudonimización no\n4. La IA en medicina debe ser explicable — 'caja negra' es inaceptable\n5. Sanciones LOPDP: hasta $2M — el cumplimiento no es opcional\n\nPróximo: Responsabilidad médica y IA — quién responde cuando el modelo falla",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué tipo de consentimiento requiere la LOPDP para usar datos de salud en entrenamiento de modelos de IA?",
      opciones: [
        "Consentimiento genérico al aceptar los términos de uso del sistema",
        "Consentimiento verbal del paciente al médico",
        "Consentimiento explícito y específico para el propósito declarado (entrenamiento de IA para ese uso concreto)",
        "No se requiere consentimiento si los datos están anonimizados",
      ],
      respuesta: 2,
      explicacion:
        "La LOPDP requiere consentimiento explícito y específico para datos sensibles como datos de salud. No es válido un consentimiento genérico de 'acepto los términos'. El paciente debe saber exactamente para qué se usarán sus datos, incluyendo el entrenamiento de modelos de IA.",
    },
    {
      pregunta: "¿Cuál es la diferencia clave entre anonimización y pseudonimización bajo la LOPDP?",
      opciones: [
        "Son lo mismo — solo tienen nombres diferentes",
        "La anonimización completa hace imposible re-identificar al titular y libera de LOPDP; la pseudonimización reemplaza identificadores pero es reversible y sigue bajo LOPDP",
        "La pseudonimización es más segura que la anonimización",
        "Solo aplica a datos de salud digital, no a radiografías",
      ],
      respuesta: 1,
      explicacion:
        "La anonimización verdadera hace matemáticamente imposible re-identificar al individuo, liberando los datos del alcance de la LOPDP. La pseudonimización (como reemplazar nombre por código) es reversible — si se tiene la tabla de correspondencia, se puede re-identificar — por lo que sigue requiriendo protección bajo la LOPDP.",
    },
    {
      pregunta: "¿Qué herramienta técnica hace visible qué parte de una imagen médica consideró relevante el modelo de IA para su diagnóstico?",
      opciones: ["SHAP values", "Grad-CAM", "LIME", "PCA"],
      respuesta: 1,
      explicacion:
        "Grad-CAM (Gradient-weighted Class Activation Mapping) genera un heatmap sobre la imagen de entrada que resalta las regiones que el modelo de CNN usó más para tomar su decisión. Es fundamental en IA médica para que el médico pueda verificar que el modelo 'miró' la región correcta.",
    },
    {
      pregunta: "¿Cuáles son las sanciones máximas por incumplimiento de la LOPDP en Ecuador?",
      opciones: [
        "$10,000 máximo",
        "Solo amonestación verbal la primera vez",
        "Hasta $2 millones o el 2% de los ingresos anuales, la que sea mayor",
        "Clausura del establecimiento de salud",
      ],
      respuesta: 2,
      explicacion:
        "La LOPDP Ecuador establece sanciones económicas significativas: hasta $2 millones o el 2% de los ingresos anuales globales de la organización. Esto hace que el cumplimiento sea imperativo desde el punto de vista económico, además del ético.",
    },
    {
      pregunta: "¿Por qué la explicabilidad de la IA es especialmente crítica en el sector salud?",
      opciones: [
        "Solo por requisitos regulatorios, no tiene importancia clínica",
        "Porque el médico debe poder explicar al paciente las razones de un diagnóstico o recomendación generada por IA, y los modelos de caja negra hacen esto imposible",
        "Porque los médicos no confían en ninguna tecnología",
        "Solo importa en Ecuador, no en otros países",
      ],
      respuesta: 1,
      explicacion:
        "En medicina, toda decisión diagnóstica o terapéutica debe poder justificarse ante el paciente y la comunidad médica. Una IA de caja negra que recomienda no operar un tumor o negar una cobertura sin explicación comprensible viola principios éticos médicos fundamentales y genera responsabilidad legal.",
    },
  ],
  ejercicio: {
    titulo: "Análisis de conformidad LOPDP para un sistema de IA de salud ecuatoriano",
    objetivo:
      "Realizar un análisis de conformidad legal y ética de un sistema hipotético de IA para diagnóstico de diabetes en el IESS Ecuador, identificando riesgos de privacidad y requisitos LOPDP",
    herramientas: "Google Docs + ChatGPT + LOPDP Ecuador (pdf oficial) + Guías MSP",
    datosEjemplo:
      "Sistema hipotético: 'DiabIA IESS'\nDescripción: sistema de IA que analiza historia clínica, exámenes de laboratorio y datos demográficos de afiliados del IESS para predecir riesgo de desarrollar diabetes tipo 2 en los próximos 5 años. Los pacientes de alto riesgo reciben alertas automáticas para cita preventiva.\nDatos que procesa: nombre, cédula, edad, peso, talla, HbA1c, glucosa, triglicéridos, antecedentes familiares, medicamentos actuales.",
    pasos: [
      "Leer los artículos 26-30 de la LOPDP Ecuador sobre datos sensibles (buscar 'LOPDP Ecuador PDF oficial')",
      "En ChatGPT: 'Analiza el sistema DiabIA IESS según la LOPDP de Ecuador. Identifica: 1) qué datos son sensibles bajo la ley, 2) qué tipo de consentimiento se necesita, 3) cuál debe ser la base legal para el tratamiento, 4) qué derechos tienen los afiliados sobre sus datos, 5) qué medidas de seguridad mínimas son obligatorias'",
      "Crear en Google Docs una tabla de análisis de riesgos con: riesgo identificado, probabilidad (alta/media/baja), impacto (alto/medio/bajo), y medida de mitigación propuesta",
      "Diseñar el formulario de consentimiento informado específico que necesitaría DiabIA IESS para cumplir la LOPDP",
      "Analizar el principio de minimización de datos: de la lista de datos que procesa DiabIA, ¿cuáles son realmente necesarios para el objetivo? ¿Qué datos podrían eliminarse?",
      "Conclusión final (300 palabras): ¿puede implementarse DiabIA IESS legalmente en Ecuador? ¿Cuáles son los 3 requisitos no negociables de la LOPDP que debe cumplir?",
    ],
    resultado:
      "Análisis de conformidad LOPDP completo para DiabIA IESS: tabla de riesgos con mitigaciones, formulario de consentimiento informado diseñado, análisis de minimización de datos y conclusión ejecutiva sobre viabilidad legal.",
    criterios: [
      { criterio: "Identificación correcta de todos los datos sensibles bajo LOPDP", puntos: 25 },
      { criterio: "Tabla de riesgos completa con mitigaciones específicas", puntos: 25 },
      { criterio: "Formulario de consentimiento informado correctamente diseñado", puntos: 25 },
      { criterio: "Análisis de minimización de datos con justificación", puntos: 15 },
      { criterio: "Conclusión clara sobre viabilidad legal con requisitos identificados", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "LOPDP Ecuador — Texto oficial",
      url: "https://www.telecomunicaciones.gob.ec/ley-organica-de-proteccion-de-datos-personales/",
      tipo: "documentacion",
      descripcion: "Texto oficial de la Ley Orgánica de Protección de Datos Personales de Ecuador con todos los artículos, derechos y obligaciones.",
    },
    {
      titulo: "Superintendencia de Protección de Datos — Ecuador",
      url: "https://spdp.gob.ec/",
      tipo: "documentacion",
      descripcion: "Autoridad de control de datos personales en Ecuador. Guías, resoluciones y orientaciones para el cumplimiento de la LOPDP.",
    },
    {
      titulo: "MSP Ecuador — Plan Estratégico de Salud",
      url: "https://www.salud.gob.ec/plan-estrategico/",
      tipo: "documentacion",
      descripcion: "Plan Estratégico Institucional del MSP que incluye lineamientos sobre tecnología, innovación y uso de datos en el sistema de salud ecuatoriano.",
    },
    {
      titulo: "EU AI Act — Regulación de IA en salud (referencia)",
      url: "https://artificialintelligenceact.eu/",
      tipo: "lectura",
      descripcion: "Reglamento europeo de IA (referencia global). Clasifica los sistemas de IA en salud como de alto riesgo con requisitos estrictos de transparencia y supervisión humana.",
    },
  ],
  teoria: `La protección de datos personales en el sector salud es uno de los temas más críticos en la implementación de IA médica en Ecuador. Los datos de salud no son simplemente información técnica: revelan las vulnerabilidades más íntimas de las personas, desde condiciones crónicas que pueden afectar su empleabilidad hasta estados de salud mental, historiales reproductivos y predisposiciones genéticas. El mal uso de estos datos puede causar daños reales e irreversibles: discriminación laboral, rechazo de seguros, estigma social y en casos extremos, extorsión.

La Ley Orgánica de Protección de Datos Personales (LOPDP), aprobada en Ecuador en 2021 y en vigor completa desde 2023, clasifica los datos de salud como datos sensibles con el nivel más alto de protección. Los principios fundamentales que aplican al uso de datos de salud en IA son: consentimiento explícito (el paciente debe autorizar específicamente el uso de sus datos para el propósito declarado, no es válido un consentimiento genérico), finalidad limitada (los datos solo pueden usarse para el objetivo por el que fueron recopilados), minimización (solo se deben recopilar los datos estrictamente necesarios para el objetivo), y el derecho al olvido (el paciente puede solicitar la eliminación de sus datos).

La anonimización real de datos de salud es técnicamente compleja y es un área activa de investigación. La pseudonimización (reemplazar nombre y cédula por un código) es insuficiente porque con suficiente información auxiliar (edad, diagnóstico, región, fecha) los individuos pueden re-identificarse. Los datos de salud verdaderamente anónimos — donde la re-identificación es computacionalmente inviable — quedan fuera del alcance de la LOPDP, pero lograr ese nivel de anonimización sin perder utilidad estadística para el entrenamiento de modelos de IA es un reto técnico significativo.

La explicabilidad de la IA en medicina no es solo una preferencia técnica: es un requisito ético y, cada vez más, legal. El Reglamento Europeo de IA (EU AI Act), que está sirviendo de referencia global, clasifica los sistemas de IA para diagnóstico médico y gestión de tratamientos como de alto riesgo, requiriendo transparencia, supervisión humana, y capacidad de explicar las decisiones. En Ecuador, aunque no existe aún regulación específica de IA, los principios de responsabilidad médica del Código de Ética Médico y la LOPDP establecen que el médico es responsable de las decisiones que toma y debe poder fundamentarlas. Una IA de caja negra que toma decisiones diagnósticas sin posibilidad de explicación pone al médico en una posición de responsabilidad que no puede defender ante el paciente ni ante la justicia.`,
};

const tema17: TemaC13 = placeholder(17, "Responsabilidad médica y IA — quién responde cuando el modelo falla", MOD4, 4);
const tema18: TemaC13 = placeholder(18, "Sesgo en IA médica — riesgos para pacientes ecuatorianos", MOD4, 4);
const tema19: TemaC13 = placeholder(19, "Consentimiento informado en la era de la IA", MOD4, 4);
const tema20: TemaC13 = placeholder(20, "Proyecto integrador: propuesta de sistema IA médico cumpliendo LOPDP", MOD4, 4);

export const C13_TEMAS: TemaC13[] = [
  tema1, tema2, tema3, tema4, tema5,
  tema6, tema7, tema8, tema9, tema10,
  tema11, tema12, tema13, tema14, tema15,
  tema16, tema17, tema18, tema19, tema20,
];
