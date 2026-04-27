-- ============================================================================
-- Seed: AWS Cloud Practitioner (CLF-C02)
-- ----------------------------------------------------------------------------
-- Carga el programa de certificación AWS Cloud Practitioner en Supabase:
--   1. 1 fila en certification_programs
--   2. 4 dominios en certification_domains (24/30/34/12)
--   3. 65 preguntas en exam_questions (16/19/22/8 por dominio)
--
-- Idempotente: usa ON CONFLICT (slug) DO UPDATE en programa, y borra dominios
-- y preguntas existentes del programa antes de re-insertar.
--
-- Tablas requeridas (ver src/types/database.ts líneas 956-1103). Si no existen,
-- se crean con CREATE TABLE IF NOT EXISTS al inicio de este archivo.
-- ============================================================================

-- ── 0. Asegurar tablas (idempotente) ────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS certification_programs (
  id                            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                          text UNIQUE NOT NULL,
  nombre                        text NOT NULL,
  proveedor                     text NOT NULL,
  logo_url                      text,
  nivel_dificultad              text NOT NULL CHECK (nivel_dificultad IN ('basico','intermedio','avanzado')),
  costo_examen_usd              integer NOT NULL DEFAULT 0,
  duracion_horas_estimada       integer NOT NULL DEFAULT 0,
  umbral_aprobacion_porcentaje  integer NOT NULL DEFAULT 70 CHECK (umbral_aprobacion_porcentaje BETWEEN 0 AND 100),
  idioma_examen                 text NOT NULL DEFAULT 'español',
  descripcion                   text,
  estado                        text NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa','actualizacion_pendiente','archivada')),
  dominios_count                integer NOT NULL DEFAULT 0,
  created_at                    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certification_domains (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id      uuid NOT NULL REFERENCES certification_programs(id) ON DELETE CASCADE,
  nombre                text NOT NULL,
  descripcion           text,
  porcentaje_en_examen  integer NOT NULL CHECK (porcentaje_en_examen BETWEEN 0 AND 100),
  orden                 integer NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (certification_id, orden)
);

CREATE TABLE IF NOT EXISTS exam_questions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id      uuid NOT NULL REFERENCES certification_programs(id) ON DELETE CASCADE,
  domain_id             uuid REFERENCES certification_domains(id) ON DELETE SET NULL,
  enunciado             text NOT NULL,
  opciones              jsonb NOT NULL,
  respuesta_correcta    integer NOT NULL CHECK (respuesta_correcta BETWEEN 0 AND 9),
  explicacion           text,
  idioma                text NOT NULL DEFAULT 'es',
  activa                boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exam_questions_cert    ON exam_questions(certification_id) WHERE activa;
CREATE INDEX IF NOT EXISTS idx_exam_questions_domain  ON exam_questions(domain_id) WHERE activa;
CREATE INDEX IF NOT EXISTS idx_certification_domains  ON certification_domains(certification_id, orden);

-- ── 1. Limpieza idempotente ─────────────────────────────────────────────────

DELETE FROM exam_questions
 WHERE certification_id IN (SELECT id FROM certification_programs WHERE slug = 'aws-cloud-practitioner');

DELETE FROM certification_domains
 WHERE certification_id IN (SELECT id FROM certification_programs WHERE slug = 'aws-cloud-practitioner');

-- ── 2. Programa ─────────────────────────────────────────────────────────────

INSERT INTO certification_programs (
  slug, nombre, proveedor, logo_url, nivel_dificultad,
  costo_examen_usd, duracion_horas_estimada, umbral_aprobacion_porcentaje,
  idioma_examen, descripcion, estado, dominios_count
) VALUES (
  'aws-cloud-practitioner',
  'AWS Cloud Practitioner',
  'AWS',
  '/logos/aws-cloud-practitioner.svg',
  'basico',
  100,
  40,
  70,
  'español',
  'Domina los fundamentos de la nube de Amazon. Examen CLF-C02 reconocido mundialmente. Valida conocimientos básicos en arquitectura, seguridad, servicios y facturación de AWS.',
  'activa',
  4
)
ON CONFLICT (slug) DO UPDATE SET
  nombre                       = EXCLUDED.nombre,
  proveedor                    = EXCLUDED.proveedor,
  logo_url                     = EXCLUDED.logo_url,
  nivel_dificultad             = EXCLUDED.nivel_dificultad,
  costo_examen_usd             = EXCLUDED.costo_examen_usd,
  duracion_horas_estimada      = EXCLUDED.duracion_horas_estimada,
  umbral_aprobacion_porcentaje = EXCLUDED.umbral_aprobacion_porcentaje,
  idioma_examen                = EXCLUDED.idioma_examen,
  descripcion                  = EXCLUDED.descripcion,
  estado                       = EXCLUDED.estado,
  dominios_count               = EXCLUDED.dominios_count;

-- ── 3. Dominios (4) ─────────────────────────────────────────────────────────

INSERT INTO certification_domains (certification_id, nombre, descripcion, porcentaje_en_examen, orden)
SELECT id, 'Cloud Concepts',
       'Fundamentos de cloud computing, propuesta de valor de AWS, principios de diseño en la nube y migración.',
       24, 1 FROM certification_programs WHERE slug = 'aws-cloud-practitioner';

INSERT INTO certification_domains (certification_id, nombre, descripcion, porcentaje_en_examen, orden)
SELECT id, 'Security and Compliance',
       'Modelo de responsabilidad compartida, IAM, servicios de seguridad y cumplimiento normativo.',
       30, 2 FROM certification_programs WHERE slug = 'aws-cloud-practitioner';

INSERT INTO certification_domains (certification_id, nombre, descripcion, porcentaje_en_examen, orden)
SELECT id, 'Cloud Technology and Services',
       'Cómputo, almacenamiento, bases de datos, redes y servicios principales de AWS.',
       34, 3 FROM certification_programs WHERE slug = 'aws-cloud-practitioner';

INSERT INTO certification_domains (certification_id, nombre, descripcion, porcentaje_en_examen, orden)
SELECT id, 'Billing, Pricing and Support',
       'Modelos de precios, herramientas de gestión de costos y planes de soporte AWS.',
       12, 4 FROM certification_programs WHERE slug = 'aws-cloud-practitioner';

-- ── 4. 65 preguntas del simulacro ───────────────────────────────────────────
--
-- Se reutilizan las 40 preguntas de práctica (10 por dominio) más 25 extras
-- (6 D1, 9 D2, 12 D3 — D4 reutiliza 8 de sus 10 prácticas marcando 2 inactivas).
-- Distribución activa final: 16 D1 + 19 D2 + 22 D3 + 8 D4 = 65 preguntas.

DO $aws_seed$
DECLARE
  v_cert_id uuid;
  v_d1      uuid;
  v_d2      uuid;
  v_d3      uuid;
  v_d4      uuid;
BEGIN
  SELECT id INTO v_cert_id FROM certification_programs WHERE slug = 'aws-cloud-practitioner';
  SELECT id INTO v_d1      FROM certification_domains  WHERE certification_id = v_cert_id AND orden = 1;
  SELECT id INTO v_d2      FROM certification_domains  WHERE certification_id = v_cert_id AND orden = 2;
  SELECT id INTO v_d3      FROM certification_domains  WHERE certification_id = v_cert_id AND orden = 3;
  SELECT id INTO v_d4      FROM certification_domains  WHERE certification_id = v_cert_id AND orden = 4;

  -- ─── DOMINIO 1 — Cloud Concepts (16 preguntas) ────────────────────────────

  INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion, idioma, activa) VALUES
  (v_cert_id, v_d1, '¿Cuál es el principal beneficio económico de mover una carga de trabajo a la nube de AWS?',
   '[{"text":"Eliminar por completo todos los costos operativos.","is_correct":false},{"text":"Cambiar gastos de capital (CapEx) por gastos operativos (OpEx) variables.","is_correct":true},{"text":"Garantizar que los precios bajarán cada año automáticamente.","is_correct":false},{"text":"Dejar de necesitar personal técnico.","is_correct":false}]'::jsonb,
   1, 'AWS permite pagar solo por lo que se consume, transformando CapEx en OpEx. No elimina costos ni personal técnico.', 'es', true),
  (v_cert_id, v_d1, 'Una empresa quiere garantizar que su aplicación pueda recuperarse rápidamente de fallos en infraestructura. ¿Qué pilar del Well-Architected Framework aborda principalmente esta necesidad?',
   '[{"text":"Excelencia operacional","is_correct":false},{"text":"Eficiencia del rendimiento","is_correct":false},{"text":"Confiabilidad","is_correct":true},{"text":"Sostenibilidad","is_correct":false}]'::jsonb,
   2, 'El pilar de Confiabilidad (Reliability) cubre recuperación ante fallos, redundancia y diseño Multi-AZ.', 'es', true),
  (v_cert_id, v_d1, 'En el modelo de responsabilidad compartida de AWS, ¿quién es responsable de aplicar los parches del sistema operativo invitado en una instancia EC2?',
   '[{"text":"AWS, automáticamente.","is_correct":false},{"text":"El cliente.","is_correct":true},{"text":"AWS, solo si el cliente paga soporte Enterprise.","is_correct":false},{"text":"Nadie, EC2 no requiere parches.","is_correct":false}]'::jsonb,
   1, 'EC2 es IaaS: AWS gestiona el hipervisor y el hardware; el cliente gestiona el SO invitado, incluidos los parches.', 'es', true),
  (v_cert_id, v_d1, '¿Qué tipo de escalado es nativo de la nube y consiste en añadir más instancias en lugar de aumentar el tamaño de una existente?',
   '[{"text":"Escalado vertical","is_correct":false},{"text":"Escalado horizontal","is_correct":true},{"text":"Escalado piramidal","is_correct":false},{"text":"Escalado regional","is_correct":false}]'::jsonb,
   1, 'Horizontal = más instancias (scale out). Vertical = instancias más grandes (scale up).', 'es', true),
  (v_cert_id, v_d1, 'Una startup necesita lanzar un MVP en menos de un mes. ¿Cuál de los seis beneficios de la nube se evidencia más en este caso?',
   '[{"text":"Economías de escala","is_correct":false},{"text":"Aumento de velocidad y agilidad","is_correct":true},{"text":"Eliminar gasto en data centers","is_correct":false},{"text":"Volverse global en minutos","is_correct":false}]'::jsonb,
   1, 'Lanzar un producto en poco tiempo se asocia directamente al beneficio de velocidad y agilidad.', 'es', true),
  (v_cert_id, v_d1, '¿Cuál de las siguientes es una característica de la elasticidad en la nube?',
   '[{"text":"Pagar una tarifa fija mensual sin importar el uso.","is_correct":false},{"text":"Escalar recursos automáticamente hacia arriba o abajo según la demanda.","is_correct":true},{"text":"Mantener siempre el mismo número de servidores.","is_correct":false},{"text":"Migrar manualmente entre regiones.","is_correct":false}]'::jsonb,
   1, 'Elasticidad = escalado automático y dinámico según demanda real.', 'es', true),
  (v_cert_id, v_d1, '¿Qué estrategia de migración consiste en reemplazar una aplicación on-premise por una solución SaaS equivalente?',
   '[{"text":"Rehost","is_correct":false},{"text":"Replatform","is_correct":false},{"text":"Repurchase","is_correct":true},{"text":"Retire","is_correct":false}]'::jsonb,
   2, 'Repurchase (drop and shop) significa cambiar por SaaS comercial.', 'es', true),
  (v_cert_id, v_d1, '¿Cuál es el modelo de servicio donde el cliente solo se preocupa por el código y AWS gestiona toda la infraestructura subyacente?',
   '[{"text":"IaaS","is_correct":false},{"text":"PaaS","is_correct":true},{"text":"SaaS","is_correct":false},{"text":"DaaS","is_correct":false}]'::jsonb,
   1, 'PaaS (Platform as a Service) — ej. Elastic Beanstalk — gestiona infraestructura por el cliente.', 'es', true),
  (v_cert_id, v_d1, '¿Qué pilar del Well-Architected Framework fue añadido en 2021 para abordar el impacto ambiental?',
   '[{"text":"Optimización de costos","is_correct":false},{"text":"Excelencia operacional","is_correct":false},{"text":"Sostenibilidad","is_correct":true},{"text":"Confiabilidad","is_correct":false}]'::jsonb,
   2, 'Sostenibilidad fue el sexto pilar incorporado en 2021.', 'es', true),
  (v_cert_id, v_d1, 'Una empresa quiere mantener parte de su carga on-premise y otra parte en AWS, conectadas de forma segura. ¿Qué modelo de despliegue describe este escenario?',
   '[{"text":"Nube pública pura","is_correct":false},{"text":"Nube híbrida","is_correct":true},{"text":"Nube privada","is_correct":false},{"text":"Multi-cloud","is_correct":false}]'::jsonb,
   1, 'Nube híbrida combina on-premise con nube pública usando VPN o Direct Connect.', 'es', true),
  (v_cert_id, v_d1, '¿Cuál de los siguientes servicios de AWS es global y NO requiere selección de región?',
   '[{"text":"Amazon EC2","is_correct":false},{"text":"Amazon RDS","is_correct":false},{"text":"Amazon CloudFront","is_correct":true},{"text":"Amazon EBS","is_correct":false}]'::jsonb,
   2, 'CloudFront, IAM, Route 53 y WAF (CloudFront mode) son globales.', 'es', true),
  (v_cert_id, v_d1, '¿Qué pilar del Well-Architected Framework cubre la automatización de cambios y la observabilidad?',
   '[{"text":"Confiabilidad","is_correct":false},{"text":"Excelencia operacional","is_correct":true},{"text":"Seguridad","is_correct":false},{"text":"Sostenibilidad","is_correct":false}]'::jsonb,
   1, 'Excelencia operacional cubre automatización, despliegues, observabilidad y mejora continua.', 'es', true),
  (v_cert_id, v_d1, 'Una empresa migra una aplicación legacy sin modificar el código a una instancia EC2 equivalente. ¿Qué estrategia de migración es?',
   '[{"text":"Replatform","is_correct":false},{"text":"Refactor","is_correct":false},{"text":"Rehost (lift-and-shift)","is_correct":true},{"text":"Repurchase","is_correct":false}]'::jsonb,
   2, 'Rehost (lift-and-shift) mueve la carga sin modificar el código.', 'es', true),
  (v_cert_id, v_d1, '¿Qué término describe la capacidad de añadir o quitar recursos automáticamente según la demanda?',
   '[{"text":"Alta disponibilidad","is_correct":false},{"text":"Tolerancia a fallos","is_correct":false},{"text":"Elasticidad","is_correct":true},{"text":"Durabilidad","is_correct":false}]'::jsonb,
   2, 'Elasticidad = escalar automáticamente con la demanda.', 'es', true),
  (v_cert_id, v_d1, '¿Cuántas Zonas de Disponibilidad como mínimo tiene una región estándar de AWS?',
   '[{"text":"1","is_correct":false},{"text":"2","is_correct":false},{"text":"3","is_correct":true},{"text":"6","is_correct":false}]'::jsonb,
   2, 'Una región estándar de AWS tiene al menos 3 Zonas de Disponibilidad físicamente separadas.', 'es', true),
  (v_cert_id, v_d1, '¿Cuál de las siguientes opciones describe correctamente una Edge Location?',
   '[{"text":"Un centro de datos completo de AWS.","is_correct":false},{"text":"Una réplica de toda una región.","is_correct":false},{"text":"Un punto de presencia que cachea contenido para CloudFront y Route 53.","is_correct":true},{"text":"Un servidor on-premise del cliente.","is_correct":false}]'::jsonb,
   2, 'Edge Locations son puntos de presencia globales para CDN (CloudFront) y DNS (Route 53).', 'es', true);

  -- ─── DOMINIO 2 — Security and Compliance (19 preguntas) ───────────────────

  INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion, idioma, activa) VALUES
  (v_cert_id, v_d2, '¿Cuál es la mejor práctica recomendada por AWS para usar la cuenta raíz (root)?',
   '[{"text":"Usarla a diario para todas las operaciones administrativas.","is_correct":false},{"text":"Compartirla con todo el equipo de DevOps.","is_correct":false},{"text":"Reservarla solo para tareas que la requieran y proteger con MFA.","is_correct":true},{"text":"Eliminarla después de crear el primer usuario IAM.","is_correct":false}]'::jsonb,
   2, 'La cuenta root tiene privilegios totales. AWS recomienda reservarla solo para tareas que la requieran y proteger con MFA.', 'es', true),
  (v_cert_id, v_d2, 'Una aplicación EC2 necesita leer objetos de un bucket S3. ¿Cuál es la forma MÁS segura de otorgar este acceso?',
   '[{"text":"Hardcodear access keys en el código de la aplicación.","is_correct":false},{"text":"Asignar un Role IAM a la instancia EC2.","is_correct":true},{"text":"Crear un usuario IAM y compartir las credenciales en un archivo de configuración.","is_correct":false},{"text":"Hacer público el bucket S3.","is_correct":false}]'::jsonb,
   1, 'Los Roles IAM otorgan credenciales temporales rotadas automáticamente, sin almacenar secretos.', 'es', true),
  (v_cert_id, v_d2, '¿Qué servicio AWS protege aplicaciones web contra ataques de inyección SQL y cross-site scripting?',
   '[{"text":"AWS Shield Standard","is_correct":false},{"text":"AWS WAF","is_correct":true},{"text":"Amazon GuardDuty","is_correct":false},{"text":"AWS Config","is_correct":false}]'::jsonb,
   1, 'WAF (Web Application Firewall) filtra tráfico HTTP/HTTPS contra reglas para detener inyecciones SQL, XSS y otros ataques web.', 'es', true),
  (v_cert_id, v_d2, '¿Cuál es el servicio de AWS para descargar reportes de cumplimiento como SOC 2, ISO 27001 y PCI DSS?',
   '[{"text":"AWS Trusted Advisor","is_correct":false},{"text":"AWS Config","is_correct":false},{"text":"AWS Artifact","is_correct":true},{"text":"AWS Inspector","is_correct":false}]'::jsonb,
   2, 'Artifact es el portal de autoservicio para reportes de auditoría y acuerdos legales.', 'es', true),
  (v_cert_id, v_d2, 'Una empresa necesita detectar de forma automática datos personales (PII) almacenados en S3. ¿Qué servicio debe usar?',
   '[{"text":"Amazon GuardDuty","is_correct":false},{"text":"AWS Inspector","is_correct":false},{"text":"Amazon Macie","is_correct":true},{"text":"AWS Shield","is_correct":false}]'::jsonb,
   2, 'Macie usa machine learning para descubrir, clasificar y proteger datos sensibles en S3.', 'es', true),
  (v_cert_id, v_d2, 'En el modelo de responsabilidad compartida, ¿quién es responsable de la seguridad física de los data centers de AWS?',
   '[{"text":"El cliente","is_correct":false},{"text":"AWS","is_correct":true},{"text":"Compartido 50/50","is_correct":false},{"text":"Ninguno, los data centers son virtuales","is_correct":false}]'::jsonb,
   1, 'AWS es responsable de la seguridad DE la nube: hardware, red global, edificios y seguridad física.', 'es', true),
  (v_cert_id, v_d2, '¿Qué servicio de AWS analiza CloudTrail, VPC Flow Logs y DNS logs con machine learning para detectar amenazas?',
   '[{"text":"AWS Inspector","is_correct":false},{"text":"Amazon GuardDuty","is_correct":true},{"text":"AWS WAF","is_correct":false},{"text":"Amazon Macie","is_correct":false}]'::jsonb,
   1, 'GuardDuty es el servicio de detección inteligente de amenazas basado en ML.', 'es', true),
  (v_cert_id, v_d2, '¿Cuál de los siguientes elementos NO es un componente de IAM?',
   '[{"text":"Usuarios","is_correct":false},{"text":"Grupos","is_correct":false},{"text":"Roles","is_correct":false},{"text":"Subredes","is_correct":true}]'::jsonb,
   3, 'Las subredes (subnets) pertenecen a VPC, no a IAM. IAM tiene Usuarios, Grupos, Roles y Políticas.', 'es', true),
  (v_cert_id, v_d2, '¿Qué servicio gestiona claves criptográficas integradas con S3, EBS y RDS, ofreciendo auditoría con CloudTrail?',
   '[{"text":"AWS Certificate Manager","is_correct":false},{"text":"AWS KMS","is_correct":true},{"text":"AWS Secrets Manager","is_correct":false},{"text":"AWS CloudHSM","is_correct":false}]'::jsonb,
   1, 'KMS (Key Management Service) es el servicio gestionado de cifrado integrado con la mayoría de servicios AWS.', 'es', true),
  (v_cert_id, v_d2, 'Una compañía requiere cumplimiento FIPS 140-2 nivel 3 con HSM dedicado de un solo tenant. ¿Qué servicio debe elegir?',
   '[{"text":"AWS KMS","is_correct":false},{"text":"AWS Secrets Manager","is_correct":false},{"text":"AWS CloudHSM","is_correct":true},{"text":"ACM","is_correct":false}]'::jsonb,
   2, 'CloudHSM ofrece HSM dedicados con cumplimiento FIPS 140-2 nivel 3 para cargas reguladas.', 'es', true),
  (v_cert_id, v_d2, '¿Qué servicio centraliza hallazgos de GuardDuty, Inspector y Macie en un solo dashboard?',
   '[{"text":"AWS CloudTrail","is_correct":false},{"text":"AWS Security Hub","is_correct":true},{"text":"AWS Trusted Advisor","is_correct":false},{"text":"AWS Config","is_correct":false}]'::jsonb,
   1, 'Security Hub agrega hallazgos de servicios de seguridad y herramientas de terceros.', 'es', true),
  (v_cert_id, v_d2, '¿Cuál es la diferencia principal entre un Security Group y una Network ACL?',
   '[{"text":"SG es global; NACL es regional.","is_correct":false},{"text":"SG es stateful (a nivel instancia); NACL es stateless (a nivel subred).","is_correct":true},{"text":"SG bloquea; NACL solo registra.","is_correct":false},{"text":"No hay diferencia.","is_correct":false}]'::jsonb,
   1, 'Security Group es stateful y se aplica a instancias; NACL es stateless y se aplica a subredes.', 'es', true),
  (v_cert_id, v_d2, '¿Qué servicio gratuito y automático protege todas las cuentas AWS contra ataques DDoS de capa 3 y 4?',
   '[{"text":"AWS Shield Standard","is_correct":true},{"text":"AWS Shield Advanced","is_correct":false},{"text":"AWS WAF","is_correct":false},{"text":"AWS GuardDuty","is_correct":false}]'::jsonb,
   0, 'Shield Standard es gratis y automático para todos los clientes; cubre DDoS L3/L4.', 'es', true),
  (v_cert_id, v_d2, '¿Cómo se llama el documento JSON que define qué acciones puede ejecutar una identidad IAM sobre qué recursos?',
   '[{"text":"Rol","is_correct":false},{"text":"Grupo","is_correct":false},{"text":"Política (Policy)","is_correct":true},{"text":"Perfil","is_correct":false}]'::jsonb,
   2, 'Las políticas IAM (Policies) son documentos JSON con Effect, Action, Resource y Condition.', 'es', true),
  (v_cert_id, v_d2, 'Una organización con múltiples cuentas necesita aplicar restricciones que NINGÚN usuario IAM pueda superar. ¿Qué debe usar?',
   '[{"text":"IAM Policies","is_correct":false},{"text":"Service Control Policies (SCP) en AWS Organizations","is_correct":true},{"text":"Network ACLs","is_correct":false},{"text":"Trust Policies","is_correct":false}]'::jsonb,
   1, 'Las SCP en AWS Organizations limitan los permisos máximos posibles en cuentas miembro.', 'es', true),
  (v_cert_id, v_d2, '¿Qué servicio audita y registra TODAS las llamadas API realizadas en una cuenta AWS?',
   '[{"text":"Amazon CloudWatch","is_correct":false},{"text":"AWS Config","is_correct":false},{"text":"AWS CloudTrail","is_correct":true},{"text":"Amazon Inspector","is_correct":false}]'::jsonb,
   2, 'CloudTrail registra quién, qué, cuándo y desde dónde se invocaron las APIs de AWS.', 'es', true),
  (v_cert_id, v_d2, '¿Qué servicio evalúa vulnerabilidades de software en instancias EC2, contenedores ECR y funciones Lambda?',
   '[{"text":"Amazon Inspector","is_correct":true},{"text":"Amazon Macie","is_correct":false},{"text":"AWS WAF","is_correct":false},{"text":"AWS Config","is_correct":false}]'::jsonb,
   0, 'Inspector evalúa vulnerabilidades CVE en EC2, ECR y Lambda.', 'es', true),
  (v_cert_id, v_d2, '¿Cuál es el servicio recomendado para almacenar y rotar automáticamente las credenciales de una base de datos RDS?',
   '[{"text":"AWS KMS","is_correct":false},{"text":"AWS Secrets Manager","is_correct":true},{"text":"AWS Systems Manager Parameter Store sin SecureString","is_correct":false},{"text":"Amazon S3","is_correct":false}]'::jsonb,
   1, 'Secrets Manager soporta rotación nativa para RDS, Redshift y DocumentDB.', 'es', true),
  (v_cert_id, v_d2, '¿Cómo puede un cliente verificar la conformidad SOC 2 de AWS para presentar a sus auditores?',
   '[{"text":"Solicitar una visita al data center.","is_correct":false},{"text":"Descargar el reporte SOC 2 desde AWS Artifact.","is_correct":true},{"text":"Comprar una suscripción Enterprise.","is_correct":false},{"text":"Pedir una llamada al equipo de ventas.","is_correct":false}]'::jsonb,
   1, 'AWS Artifact ofrece descarga gratuita de reportes SOC, ISO, PCI y otros documentos de cumplimiento.', 'es', true);

  -- ─── DOMINIO 3 — Cloud Technology and Services (22 preguntas) ─────────────

  INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion, idioma, activa) VALUES
  (v_cert_id, v_d3, 'Una empresa quiere ejecutar una carga batch que tolera interrupciones para minimizar costo. ¿Qué tipo de instancia EC2 debe elegir?',
   '[{"text":"On-Demand","is_correct":false},{"text":"Reserved Instance de 3 años","is_correct":false},{"text":"Spot Instance","is_correct":true},{"text":"Dedicated Host","is_correct":false}]'::jsonb,
   2, 'Spot ofrece hasta 90 % de descuento, ideal para cargas tolerantes a interrupciones.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio de AWS es serverless y permite ejecutar código sin gestionar servidores, pagando solo por invocación y duración?',
   '[{"text":"Amazon EC2","is_correct":false},{"text":"AWS Lambda","is_correct":true},{"text":"Amazon ECS","is_correct":false},{"text":"Elastic Beanstalk","is_correct":false}]'::jsonb,
   1, 'Lambda es la solución serverless de AWS por excelencia.', 'es', true),
  (v_cert_id, v_d3, '¿Cuál es la durabilidad anunciada de Amazon S3 Standard?',
   '[{"text":"99.9 %","is_correct":false},{"text":"99.99 %","is_correct":false},{"text":"99.999999999 % (11 nueves)","is_correct":true},{"text":"100 %","is_correct":false}]'::jsonb,
   2, 'S3 Standard ofrece durabilidad de 11 nueves a través de replicación entre múltiples AZ.', 'es', true),
  (v_cert_id, v_d3, 'Una empresa necesita archivar datos por 10 años con costo mínimo y tiempos de recuperación de hasta 12 horas aceptables. ¿Qué clase S3 debe usar?',
   '[{"text":"S3 Standard","is_correct":false},{"text":"S3 Standard-IA","is_correct":false},{"text":"S3 Glacier Deep Archive","is_correct":true},{"text":"S3 Intelligent-Tiering","is_correct":false}]'::jsonb,
   2, 'Deep Archive es la clase más económica para retención legal a largo plazo con recuperación de 12h.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio de AWS es una base de datos NoSQL key-value totalmente serverless con latencia de milisegundos?',
   '[{"text":"Amazon RDS MySQL","is_correct":false},{"text":"Amazon Aurora","is_correct":false},{"text":"Amazon DynamoDB","is_correct":true},{"text":"Amazon Redshift","is_correct":false}]'::jsonb,
   2, 'DynamoDB es NoSQL key-value gestionado, serverless, latencia de milisegundos.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio se usa para conectar privadamente un data center on-premise con AWS evitando internet pública?',
   '[{"text":"Site-to-Site VPN","is_correct":false},{"text":"AWS Direct Connect","is_correct":true},{"text":"NAT Gateway","is_correct":false},{"text":"Internet Gateway","is_correct":false}]'::jsonb,
   1, 'Direct Connect ofrece conexión privada dedicada con mayor SLA y menor latencia que VPN.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio de AWS es un CDN global con más de 600 edge locations integrado con WAF y ACM?',
   '[{"text":"Amazon Route 53","is_correct":false},{"text":"Amazon CloudFront","is_correct":true},{"text":"AWS Global Accelerator","is_correct":false},{"text":"AWS Direct Connect","is_correct":false}]'::jsonb,
   1, 'CloudFront es el CDN de AWS con red global de edge locations.', 'es', true),
  (v_cert_id, v_d3, 'Una aplicación necesita desacoplar un microservicio productor de un consumidor con cola persistente de hasta 14 días. ¿Qué servicio elegir?',
   '[{"text":"Amazon SNS","is_correct":false},{"text":"Amazon SQS","is_correct":true},{"text":"Amazon Kinesis","is_correct":false},{"text":"Amazon EventBridge","is_correct":false}]'::jsonb,
   1, 'SQS es la cola gestionada con retención hasta 14 días para desacoplar componentes.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio permite consultar datos en S3 con SQL sin necesidad de cargar los datos en una BD?',
   '[{"text":"Amazon Redshift","is_correct":false},{"text":"Amazon Athena","is_correct":true},{"text":"Amazon RDS","is_correct":false},{"text":"Amazon EMR","is_correct":false}]'::jsonb,
   1, 'Athena es serverless, paga por TB escaneado y consulta directamente S3 con SQL estándar.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio AWS sirve para ejecutar contenedores sin gestionar las instancias EC2 subyacentes?',
   '[{"text":"Amazon ECS con EC2 launch type","is_correct":false},{"text":"Amazon EKS con node groups","is_correct":false},{"text":"AWS Fargate","is_correct":true},{"text":"Amazon EC2 con Docker","is_correct":false}]'::jsonb,
   2, 'Fargate es el motor serverless de contenedores: no gestionas EC2, solo defines la tarea/pod.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio AWS gestiona Kubernetes administrado?',
   '[{"text":"Amazon ECS","is_correct":false},{"text":"Amazon EKS","is_correct":true},{"text":"AWS Lambda","is_correct":false},{"text":"AWS Batch","is_correct":false}]'::jsonb,
   1, 'EKS = Elastic Kubernetes Service, Kubernetes administrado por AWS.', 'es', true),
  (v_cert_id, v_d3, '¿Qué clase de almacenamiento S3 mueve objetos automáticamente entre tiers según patrones de acceso?',
   '[{"text":"S3 Standard","is_correct":false},{"text":"S3 One Zone-IA","is_correct":false},{"text":"S3 Intelligent-Tiering","is_correct":true},{"text":"S3 Glacier Deep Archive","is_correct":false}]'::jsonb,
   2, 'Intelligent-Tiering optimiza costos moviendo objetos automáticamente según el patrón de acceso.', 'es', true),
  (v_cert_id, v_d3, 'Una aplicación necesita compartir un sistema de archivos NFS entre múltiples instancias EC2 Linux. ¿Qué servicio elegir?',
   '[{"text":"Amazon EBS","is_correct":false},{"text":"Amazon EFS","is_correct":true},{"text":"Amazon S3","is_correct":false},{"text":"FSx for Windows","is_correct":false}]'::jsonb,
   1, 'EFS es NFS administrado, multi-AZ y multi-instancia para Linux.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio RDS-compatible es propietario de AWS, hasta 5x más rápido que MySQL estándar y replica almacenamiento entre 3 AZ?',
   '[{"text":"Amazon Aurora","is_correct":true},{"text":"Amazon DynamoDB","is_correct":false},{"text":"Amazon DocumentDB","is_correct":false},{"text":"Amazon Redshift","is_correct":false}]'::jsonb,
   0, 'Aurora es la BD propietaria de AWS, compatible MySQL/PostgreSQL, hasta 5x más rápida.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio se usa para data warehousing a escala de petabytes?',
   '[{"text":"Amazon RDS","is_correct":false},{"text":"Amazon Redshift","is_correct":true},{"text":"Amazon Athena","is_correct":false},{"text":"Amazon ElastiCache","is_correct":false}]'::jsonb,
   1, 'Redshift es el data warehouse columnar petabyte-scale de AWS.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio permite migrar 80 TB de datos de un data center on-premise a AWS por envío físico?',
   '[{"text":"AWS DataSync","is_correct":false},{"text":"AWS Snowball Edge","is_correct":true},{"text":"AWS Direct Connect","is_correct":false},{"text":"AWS Storage Gateway","is_correct":false}]'::jsonb,
   1, 'Snowball Edge soporta hasta 80 TB para migración física de datos masivos.', 'es', true),
  (v_cert_id, v_d3, '¿Qué tipo de Load Balancer opera en capa 7 (HTTP/HTTPS) y permite routing por path o host?',
   '[{"text":"NLB (Network Load Balancer)","is_correct":false},{"text":"ALB (Application Load Balancer)","is_correct":true},{"text":"GLB (Gateway Load Balancer)","is_correct":false},{"text":"Classic Load Balancer","is_correct":false}]'::jsonb,
   1, 'ALB opera en capa 7 con routing por path/host, ideal para microservicios HTTP.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio usar para enviar notificaciones pub/sub a múltiples destinos (SQS, Lambda, email, SMS)?',
   '[{"text":"Amazon SQS","is_correct":false},{"text":"Amazon SNS","is_correct":true},{"text":"AWS Step Functions","is_correct":false},{"text":"AWS Batch","is_correct":false}]'::jsonb,
   1, 'SNS es pub/sub gestionado con fan-out a múltiples suscriptores.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio orquesta workflows de múltiples pasos con state machines?',
   '[{"text":"Amazon EventBridge","is_correct":false},{"text":"Amazon SQS","is_correct":false},{"text":"AWS Step Functions","is_correct":true},{"text":"AWS Lambda","is_correct":false}]'::jsonb,
   2, 'Step Functions usa state machines para orquestar flujos serverless complejos.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio AWS ofrece reconocimiento de imágenes y video con ML pre-entrenado?',
   '[{"text":"Amazon Comprehend","is_correct":false},{"text":"Amazon Polly","is_correct":false},{"text":"Amazon Rekognition","is_correct":true},{"text":"Amazon Lex","is_correct":false}]'::jsonb,
   2, 'Rekognition ofrece visión por computador como servicio: detección de objetos, caras y moderación.', 'es', true),
  (v_cert_id, v_d3, '¿Qué servicio permite ejecutar tareas en lotes (batch jobs) a gran escala con orquestación gestionada?',
   '[{"text":"AWS Lambda","is_correct":false},{"text":"AWS Batch","is_correct":true},{"text":"Amazon ECS","is_correct":false},{"text":"AWS Glue","is_correct":false}]'::jsonb,
   1, 'AWS Batch orquesta jobs batch a gran escala usando Fargate o EC2.', 'es', true),
  (v_cert_id, v_d3, '¿Qué tipo de VPC Endpoint se usa SIN costo adicional y aplica routing privado a S3 y DynamoDB?',
   '[{"text":"Interface Endpoint (PrivateLink)","is_correct":false},{"text":"Gateway Endpoint","is_correct":true},{"text":"NAT Gateway","is_correct":false},{"text":"Internet Gateway","is_correct":false}]'::jsonb,
   1, 'Gateway Endpoint es gratuito y solo aplica a S3 y DynamoDB.', 'es', true);

  -- ─── DOMINIO 4 — Billing, Pricing and Support (8 preguntas) ───────────────

  INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion, idioma, activa) VALUES
  (v_cert_id, v_d4, '¿Qué herramienta permite estimar el costo de una arquitectura ANTES de desplegarla?',
   '[{"text":"AWS Cost Explorer","is_correct":false},{"text":"AWS Budgets","is_correct":false},{"text":"AWS Pricing Calculator","is_correct":true},{"text":"AWS Cost and Usage Report","is_correct":false}]'::jsonb,
   2, 'Pricing Calculator estima costos previos al despliegue para diseño de soluciones.', 'es', true),
  (v_cert_id, v_d4, 'Una empresa quiere recibir alertas cuando el gasto mensual supere los $5,000. ¿Qué servicio debe configurar?',
   '[{"text":"AWS Cost Explorer","is_correct":false},{"text":"AWS Budgets","is_correct":true},{"text":"AWS Trusted Advisor","is_correct":false},{"text":"AWS Pricing Calculator","is_correct":false}]'::jsonb,
   1, 'Budgets permite crear presupuestos con alertas por SNS/email cuando se rebasan umbrales.', 'es', true),
  (v_cert_id, v_d4, '¿Cuál de los siguientes planes de soporte AWS incluye un Technical Account Manager (TAM) dedicado?',
   '[{"text":"Developer","is_correct":false},{"text":"Business","is_correct":false},{"text":"Enterprise On-Ramp","is_correct":false},{"text":"Enterprise","is_correct":true}]'::jsonb,
   3, 'Solo el plan Enterprise asigna un TAM dedicado. Enterprise On-Ramp da acceso a un pool de TAMs.', 'es', true),
  (v_cert_id, v_d4, '¿Cuál es el SLA de respuesta para un caso crítico (production system down) en el plan Business?',
   '[{"text":"15 minutos","is_correct":false},{"text":"30 minutos","is_correct":false},{"text":"1 hora","is_correct":true},{"text":"4 horas","is_correct":false}]'::jsonb,
   2, 'Business tiene SLA de 1h para casos críticos; Enterprise On-Ramp 30 min; Enterprise 15 min.', 'es', true),
  (v_cert_id, v_d4, '¿Qué tipo de transferencia de datos generalmente NO se cobra en AWS?',
   '[{"text":"Salida de EC2 hacia internet","is_correct":false},{"text":"Transferencia entre regiones AWS","is_correct":false},{"text":"Entrada de datos hacia AWS desde internet","is_correct":true},{"text":"Salida de S3 hacia internet","is_correct":false}]'::jsonb,
   2, 'Ingress (entrada) a AWS suele ser gratis; egress (salida) sí se cobra.', 'es', true),
  (v_cert_id, v_d4, '¿Qué modelo de compra EC2 ofrece el mayor descuento (hasta 90 %) a cambio de que AWS pueda terminar la instancia?',
   '[{"text":"Reserved Instance de 3 años","is_correct":false},{"text":"Spot Instance","is_correct":true},{"text":"Savings Plan","is_correct":false},{"text":"Dedicated Host","is_correct":false}]'::jsonb,
   1, 'Spot ofrece hasta 90 % descuento pero AWS puede terminar con 2 min de aviso.', 'es', true),
  (v_cert_id, v_d4, '¿Qué herramienta visualiza el histórico de costos hasta 13 meses con capacidad de forecast a 12 meses?',
   '[{"text":"AWS Cost Explorer","is_correct":true},{"text":"AWS Budgets","is_correct":false},{"text":"AWS Pricing Calculator","is_correct":false},{"text":"AWS Trusted Advisor","is_correct":false}]'::jsonb,
   0, 'Cost Explorer ofrece histórico (13 meses default, 38 con activación) y forecasting a 12 meses.', 'es', true),
  (v_cert_id, v_d4, '¿Cuál de los siguientes planes de soporte de AWS es gratuito para todos los clientes?',
   '[{"text":"Developer","is_correct":false},{"text":"Basic","is_correct":true},{"text":"Business","is_correct":false},{"text":"Enterprise","is_correct":false}]'::jsonb,
   1, 'Basic es el plan gratuito que incluye documentación, foros y casos de billing.', 'es', true);

  RAISE NOTICE 'AWS Cloud Practitioner: 1 programa, 4 dominios, 65 preguntas insertadas correctamente.';
END;
$aws_seed$;

-- ── 5. Verificación final (informativa, no falla) ───────────────────────────

DO $verify$
DECLARE
  v_total integer;
  v_d1    integer;
  v_d2    integer;
  v_d3    integer;
  v_d4    integer;
BEGIN
  SELECT COUNT(*) INTO v_total
    FROM exam_questions q
    JOIN certification_programs p ON p.id = q.certification_id
   WHERE p.slug = 'aws-cloud-practitioner' AND q.activa;

  SELECT COUNT(*) INTO v_d1 FROM exam_questions q
    JOIN certification_domains d ON d.id = q.domain_id WHERE d.orden = 1
      AND q.certification_id = (SELECT id FROM certification_programs WHERE slug='aws-cloud-practitioner');
  SELECT COUNT(*) INTO v_d2 FROM exam_questions q
    JOIN certification_domains d ON d.id = q.domain_id WHERE d.orden = 2
      AND q.certification_id = (SELECT id FROM certification_programs WHERE slug='aws-cloud-practitioner');
  SELECT COUNT(*) INTO v_d3 FROM exam_questions q
    JOIN certification_domains d ON d.id = q.domain_id WHERE d.orden = 3
      AND q.certification_id = (SELECT id FROM certification_programs WHERE slug='aws-cloud-practitioner');
  SELECT COUNT(*) INTO v_d4 FROM exam_questions q
    JOIN certification_domains d ON d.id = q.domain_id WHERE d.orden = 4
      AND q.certification_id = (SELECT id FROM certification_programs WHERE slug='aws-cloud-practitioner');

  RAISE NOTICE 'AWS CLF-C02 distribución: D1=% D2=% D3=% D4=% TOTAL=%', v_d1, v_d2, v_d3, v_d4, v_total;

  IF v_total <> 65 THEN
    RAISE WARNING 'Total esperado 65, obtenido %', v_total;
  END IF;
  IF v_d1 <> 16 OR v_d2 <> 19 OR v_d3 <> 22 OR v_d4 <> 8 THEN
    RAISE WARNING 'Distribución por dominio no coincide con 16/19/22/8';
  END IF;
END;
$verify$;
