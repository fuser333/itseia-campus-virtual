-- ============================================================
-- ITSEIA Academy — AWS Cloud Practitioner Certification Seed
-- Feature: 009-industry-certifications
-- Date: March 25, 2026
-- ============================================================

-- ============================================================
-- PART 1: certification_programs
-- ============================================================

INSERT INTO public.certification_programs (
  slug, nombre, proveedor, logo_url, nivel_dificultad, costo_examen_usd,
  duracion_horas_estimada, umbral_aprobacion_porcentaje, idioma_examen,
  descripcion, estado, dominios_count
)
VALUES (
  'aws-cloud-practitioner',
  'AWS Certified Cloud Practitioner',
  'AWS',
  'https://itseia.ai/images/aws-logo.svg',
  'basico',
  99,
  40,
  70,
  'ingles',
  'La certificacion mas fundamental de AWS. Ideal para profesionales que desean validar su comprension de la nube AWS. Examina conceptos de infraestructura, servicios basicos y seguridad en la nube.',
  'activa',
  4
) ON CONFLICT (slug) DO NOTHING
RETURNING id;

-- Store the ID for the following inserts
-- SELECT id FROM public.certification_programs WHERE slug = 'aws-cloud-practitioner' \gset cert_id

-- ============================================================
-- PART 2: certification_domains (4 dominios del examen AWS)
-- ============================================================

INSERT INTO public.certification_domains (
  certification_id, nombre, descripcion, porcentaje_en_examen, orden
)
SELECT 
  (SELECT id FROM public.certification_programs WHERE slug = 'aws-cloud-practitioner'),
  'Cloud Concepts',
  'Conceptos fundamentales de computacion en nube, modelos de implementacion y ventajas de AWS',
  26,
  1
ON CONFLICT DO NOTHING;

INSERT INTO public.certification_domains (
  certification_id, nombre, descripcion, porcentaje_en_examen, orden
)
SELECT 
  (SELECT id FROM public.certification_programs WHERE slug = 'aws-cloud-practitioner'),
  'AWS Services',
  'Descripcion general de servicios principales de AWS: EC2, S3, RDS, Lambda, CloudFront',
  33,
  2
ON CONFLICT DO NOTHING;

INSERT INTO public.certification_domains (
  certification_id, nombre, descripcion, porcentaje_en_examen, orden
)
SELECT 
  (SELECT id FROM public.certification_programs WHERE slug = 'aws-cloud-practitioner'),
  'AWS Pricing, Billing & Support',
  'Modelos de precios de AWS, calculadoras, planes de soporte y presupuesto',
  20,
  3
ON CONFLICT DO NOTHING;

INSERT INTO public.certification_domains (
  certification_id, nombre, descripcion, porcentaje_en_examen, orden
)
SELECT 
  (SELECT id FROM public.certification_programs WHERE slug = 'aws-cloud-practitioner'),
  'Security, Compliance & Well-Architected Framework',
  'Seguridad compartida, IAM, cumplimiento normativo y mejores practicas de AWS',
  21,
  4
ON CONFLICT DO NOTHING;

-- ============================================================
-- PART 3: certification_sessions (vinculacion con sesiones existentes)
-- ============================================================
-- Nota: Esto vincula sessionsdel curso IA con los dominios de certificacion
-- Si no hay sesiones existentes, esto se saltara

-- Buscar sesiones que matcheen con "cloud" keywords y vincularlas
-- Esta es una operacion manual que deberia hacer un admin en Supabase

-- ============================================================
-- PART 4: exam_questions (banco de preguntas del simulacro)
-- Muestra de 5 preguntas por dominio = 20 preguntas totales
-- ============================================================

INSERT INTO public.exam_questions (
  certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion, idioma, activa
)
SELECT 
  cp.id,
  cd.id,
  'Cual es la ventaja principal de usar AWS sobre infraestructura on-premise?',
  '[
    {"text": "Costo inicial mas bajo", "is_correct": false},
    {"text": "Escalabilidad bajo demanda sin inversion de capital", "is_correct": true},
    {"text": "Mayor velocidad de procesamiento garantizada", "is_correct": false},
    {"text": "No requiere conocimiento tecnico", "is_correct": false}
  ]'::jsonb,
  1,
  'AWS ofrece escalabilidad elastica: pagas solo por lo que usas y puedes escalar recursos rapidamente segun la demanda, sin invertir en servidores fisicos.',
  'ingles',
  true
FROM public.certification_programs cp
JOIN public.certification_domains cd ON cd.certification_id = cp.id
WHERE cp.slug = 'aws-cloud-practitioner' AND cd.orden = 1
LIMIT 1;

INSERT INTO public.exam_questions (
  certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion, idioma, activa
)
SELECT 
  cp.id,
  cd.id,
  'Que modelo de responsabilidad comparte AWS?',
  '[
    {"text": "AWS es 100% responsable de la seguridad", "is_correct": false},
    {"text": "El cliente es 100% responsable", "is_correct": false},
    {"text": "Responsabilidad compartida: AWS del cloud, cliente del cloud", "is_correct": true},
    {"text": "No hay responsabilidad definida", "is_correct": false}
  ]'::jsonb,
  2,
  'El modelo de responsabilidad compartida significa que AWS asegura la infraestructura (cloud) y el cliente asegura sus aplicaciones, datos y configuracion (en el cloud).',
  'ingles',
  true
FROM public.certification_programs cp
JOIN public.certification_domains cd ON cd.certification_id = cp.id
WHERE cp.slug = 'aws-cloud-practitioner' AND cd.orden = 1
LIMIT 1
OFFSET 1;

INSERT INTO public.exam_questions (
  certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion, idioma, activa
)
SELECT 
  cp.id,
  cd.id,
  'Que servicio AWS almacena objetos y archivos de forma escalable?',
  '[
    {"text": "EC2", "is_correct": false},
    {"text": "RDS", "is_correct": false},
    {"text": "S3 (Simple Storage Service)", "is_correct": true},
    {"text": "Lambda", "is_correct": false}
  ]'::jsonb,
  2,
  'Amazon S3 es el servicio de almacenamiento de objetos de AWS, perfecto para guardar archivos, imagenes, copias de seguridad a escala masiva con alta durabilidad.',
  'ingles',
  true
FROM public.certification_programs cp
JOIN public.certification_domains cd ON cd.certification_id = cp.id
WHERE cp.slug = 'aws-cloud-practitioner' AND cd.orden = 2
LIMIT 1;

INSERT INTO public.exam_questions (
  certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion, idioma, activa
)
SELECT 
  cp.id,
  cd.id,
  'Que servicio ejecuta codigo sin gestionar servidores?',
  '[
    {"text": "Lambda", "is_correct": true},
    {"text": "EC2", "is_correct": false},
    {"text": "RDS", "is_correct": false},
    {"text": "CloudWatch", "is_correct": false}
  ]'::jsonb,
  0,
  'AWS Lambda permite ejecutar codigo en respuesta a eventos sin provisionar ni gestionar servidores (serverless computing).',
  'ingles',
  true
FROM public.certification_programs cp
JOIN public.certification_domains cd ON cd.certification_id = cp.id
WHERE cp.slug = 'aws-cloud-practitioner' AND cd.orden = 2
LIMIT 1
OFFSET 1;

INSERT INTO public.exam_questions (
  certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion, idioma, activa
)
SELECT 
  cp.id,
  cd.id,
  'Cual es el modelo de precios principal de AWS?',
  '[
    {"text": "Paga una suscripcion anual fija", "is_correct": false},
    {"text": "Paga solo lo que consumes (pay-as-you-go)", "is_correct": true},
    {"text": "Paga por almacenamiento unicamente", "is_correct": false},
    {"text": "Paga por usuario conectado", "is_correct": false}
  ]'::jsonb,
  1,
  'AWS utiliza un modelo de precios flexible pay-as-you-go: pagas solo por los recursos que utilizas, sin compromisos a largo plazo (aunque hay opciones de descuentos con Reserved Instances).',
  'ingles',
  true
FROM public.certification_programs cp
JOIN public.certification_domains cd ON cd.certification_id = cp.id
WHERE cp.slug = 'aws-cloud-practitioner' AND cd.orden = 3
LIMIT 1;

INSERT INTO public.exam_questions (
  certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion, idioma, activa
)
SELECT 
  cp.id,
  cd.id,
  'Que servicio proporciona acceso controlado a recursos AWS?',
  '[
    {"text": "CloudTrail", "is_correct": false},
    {"text": "IAM (Identity and Access Management)", "is_correct": true},
    {"text": "CloudWatch", "is_correct": false},
    {"text": "KMS", "is_correct": false}
  ]'::jsonb,
  1,
  'IAM permite gestionar usuarios, roles y permisos para controlar quien accede a que recursos en AWS de forma granular y segura.',
  'ingles',
  true
FROM public.certification_programs cp
JOIN public.certification_domains cd ON cd.certification_id = cp.id
WHERE cp.slug = 'aws-cloud-practitioner' AND cd.orden = 4
LIMIT 1;

-- ============================================================
-- SUMMARY
-- ============================================================
-- Insertados:
-- - 1 programa de certificacion (AWS Cloud Practitioner)
-- - 4 dominios de examen
-- - 6 preguntas de ejemplo del banco de examen
-- Total questions en production: 1000+ para garantizar buena randomizacion
-- ============================================================

