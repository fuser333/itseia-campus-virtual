-- ============================================
-- ITSEIA Academy — Migrations 011-013 (Fase 4)
-- Certificaciones + AI Lab + Docente
-- Ejecutar en Supabase SQL Editor
-- Fecha: 23 marzo 2026
-- ============================================

-- === 011_certifications.sql ===

-- ============================================================
-- ITSEIA Academy — Feature 009: Modulo de Certificaciones
-- Migration: 011_certifications.sql
-- ============================================================

-- ── 1. certification_programs ─────────────────────────────
CREATE TABLE IF NOT EXISTS certification_programs (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                        text UNIQUE NOT NULL,
  nombre                      text NOT NULL,
  proveedor                   text NOT NULL,          -- 'AWS' | 'Google' | 'Microsoft' | 'GitHub'
  logo_url                    text,
  nivel_dificultad            text NOT NULL DEFAULT 'basico'
                                CHECK (nivel_dificultad IN ('basico','intermedio','avanzado')),
  costo_examen_usd            integer NOT NULL DEFAULT 0,
  duracion_horas_estimada     integer NOT NULL DEFAULT 20,
  umbral_aprobacion_porcentaje integer NOT NULL DEFAULT 70
                                CHECK (umbral_aprobacion_porcentaje BETWEEN 0 AND 100),
  idioma_examen               text NOT NULL DEFAULT 'ingles',
  descripcion                 text,
  estado                      text NOT NULL DEFAULT 'activa'
                                CHECK (estado IN ('activa','actualizacion_pendiente','archivada')),
  dominios_count              integer GENERATED ALWAYS AS (0) STORED, -- computed via view or trigger
  created_at                  timestamptz NOT NULL DEFAULT now()
);

-- Drop the computed column and recreate without GENERATED ALWAYS (simpler, updated via trigger)
ALTER TABLE certification_programs DROP COLUMN IF EXISTS dominios_count;
ALTER TABLE certification_programs ADD COLUMN dominios_count integer NOT NULL DEFAULT 0;

-- ── 2. certification_domains ──────────────────────────────
CREATE TABLE IF NOT EXISTS certification_domains (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id     uuid NOT NULL REFERENCES certification_programs(id) ON DELETE CASCADE,
  nombre               text NOT NULL,
  descripcion          text,
  porcentaje_en_examen integer NOT NULL DEFAULT 0
                         CHECK (porcentaje_en_examen BETWEEN 0 AND 100),
  orden                integer NOT NULL DEFAULT 1,
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- ── 3. certification_sessions ─────────────────────────────
-- Links existing sessions to a certification domain
CREATE TABLE IF NOT EXISTS certification_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id        uuid NOT NULL REFERENCES certification_domains(id) ON DELETE CASCADE,
  session_id       uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  orden            integer NOT NULL DEFAULT 1,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (domain_id, session_id)
);

-- ── 4. certification_enrollments ──────────────────────────
CREATE TABLE IF NOT EXISTS certification_enrollments (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id   uuid NOT NULL REFERENCES certification_programs(id) ON DELETE CASCADE,
  started_at         timestamptz NOT NULL DEFAULT now(),
  last_accessed_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, certification_id)
);

-- ── 5. exam_questions ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_questions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id uuid NOT NULL REFERENCES certification_programs(id) ON DELETE CASCADE,
  domain_id        uuid REFERENCES certification_domains(id) ON DELETE SET NULL,
  enunciado        text NOT NULL,
  -- opciones: [{ text: string, is_correct: boolean }, ...]
  opciones         jsonb NOT NULL DEFAULT '[]',
  -- respuesta_correcta: index (0-based) of the correct option in opciones array
  respuesta_correcta integer NOT NULL DEFAULT 0,
  explicacion      text,
  idioma           text NOT NULL DEFAULT 'ingles',
  activa           boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ── 6. exam_attempts ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_attempts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid NOT NULL REFERENCES certification_programs(id) ON DELETE CASCADE,
  started_at       timestamptz NOT NULL DEFAULT now(),
  finished_at      timestamptz,
  score_total      integer,      -- preguntas correctas
  total_questions  integer,      -- total preguntas presentadas
  percentage       numeric(5,2), -- porcentaje 0.00-100.00
  aprobado         boolean,
  -- score_por_dominio: { domain_id: { correct: N, total: N } }
  score_por_dominio jsonb,
  -- respuestas: [{ question_id, selected_index, is_correct }]
  respuestas       jsonb,
  duration_seconds integer,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ── 7. certification_badges ───────────────────────────────
CREATE TABLE IF NOT EXISTS certification_badges (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid NOT NULL REFERENCES certification_programs(id) ON DELETE CASCADE,
  badge_type       text NOT NULL DEFAULT 'simulacro_aprobado'
                     CHECK (badge_type IN ('simulacro_aprobado','certificado_oficial')),
  score            numeric(5,2),     -- puntaje del simulacro que genero el badge
  issued_at        timestamptz NOT NULL DEFAULT now(),
  evidencia_url    text,             -- URL del certificado oficial subido por el estudiante
  validated_by     uuid REFERENCES auth.users(id),
  validation_date  timestamptz,
  UNIQUE (user_id, certification_id)  -- un badge por certificacion por estudiante (upsert)
);

-- ════════════════════════════════════════════════════════════
-- INDICES
-- ════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_cert_enrollments_user_cert
  ON certification_enrollments (user_id, certification_id);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_cert_date
  ON exam_attempts (user_id, certification_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_exam_questions_cert_domain_active
  ON exam_questions (certification_id, domain_id)
  WHERE activa = true;

CREATE INDEX IF NOT EXISTS idx_cert_badges_user
  ON certification_badges (user_id);

CREATE INDEX IF NOT EXISTS idx_cert_domains_cert
  ON certification_domains (certification_id, orden);

CREATE INDEX IF NOT EXISTS idx_cert_sessions_domain
  ON certification_sessions (domain_id, orden);

-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════

ALTER TABLE certification_programs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_domains     ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_badges      ENABLE ROW LEVEL SECURITY;

-- ── certification_programs: todos leen, solo admin escribe ──
CREATE POLICY "cert_programs_select_all"
  ON certification_programs FOR SELECT
  USING (true);

CREATE POLICY "cert_programs_admin_write"
  ON certification_programs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin','super_admin','coordinacion')
    )
  );

-- ── certification_domains: todos leen, solo admin escribe ──
CREATE POLICY "cert_domains_select_all"
  ON certification_domains FOR SELECT
  USING (true);

CREATE POLICY "cert_domains_admin_write"
  ON certification_domains FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin','super_admin','coordinacion')
    )
  );

-- ── certification_sessions: todos leen, solo admin escribe ──
CREATE POLICY "cert_sessions_select_all"
  ON certification_sessions FOR SELECT
  USING (true);

CREATE POLICY "cert_sessions_admin_write"
  ON certification_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin','super_admin','coordinacion','docente')
    )
  );

-- ── certification_enrollments: estudiante ve/edita los suyos, admin ve todos ──
CREATE POLICY "cert_enrollments_own"
  ON certification_enrollments FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "cert_enrollments_admin_read"
  ON certification_enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin','super_admin','coordinacion')
    )
  );

-- ── exam_questions: estudiantes matriculados leen sin respuesta_correcta (aplicado en API),
--    admin escribe. RLS aqui da acceso de lectura a matriculados. ──
CREATE POLICY "exam_questions_enrolled_read"
  ON exam_questions FOR SELECT
  USING (
    activa = true
    AND (
      -- usuario admin
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role IN ('admin','super_admin','coordinacion','docente')
      )
      OR
      -- usuario matriculado en algun enrollment activo
      EXISTS (
        SELECT 1 FROM certification_enrollments ce
        WHERE ce.user_id = auth.uid()
          AND ce.certification_id = exam_questions.certification_id
      )
    )
  );

CREATE POLICY "exam_questions_admin_write"
  ON exam_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin','super_admin','coordinacion','docente')
    )
  );

-- ── exam_attempts: estudiante ve/crea los suyos, admin ve todos ──
CREATE POLICY "exam_attempts_own"
  ON exam_attempts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "exam_attempts_admin_read"
  ON exam_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin','super_admin','coordinacion')
    )
  );

-- ── certification_badges: propio + publico para leer, solo estudiante crea, admin valida ──
CREATE POLICY "cert_badges_own_all"
  ON certification_badges FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "cert_badges_public_read"
  ON certification_badges FOR SELECT
  USING (true);  -- portfolio publico sin autenticacion

CREATE POLICY "cert_badges_admin_update"
  ON certification_badges FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin','super_admin','coordinacion')
    )
  );

-- ════════════════════════════════════════════════════════════
-- SEED: AWS Cloud Practitioner
-- ════════════════════════════════════════════════════════════

-- Programa
INSERT INTO certification_programs (
  id, slug, nombre, proveedor, nivel_dificultad,
  costo_examen_usd, duracion_horas_estimada, umbral_aprobacion_porcentaje,
  idioma_examen, descripcion, estado, dominios_count
) VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'aws-cloud-practitioner',
  'AWS Cloud Practitioner',
  'AWS',
  'basico',
  100,
  30,
  70,
  'ingles',
  'Certificacion foundational de Amazon Web Services. Valida comprension de servicios de nube AWS, facturacion, seguridad y arquitectura basica. Ideal para perfiles no tecnicos y tecnicos que inician en la nube.',
  'activa',
  6
) ON CONFLICT (slug) DO NOTHING;

-- Dominios AWS CCP (6 dominios oficiales)
INSERT INTO certification_domains (id, certification_id, nombre, descripcion, porcentaje_en_examen, orden) VALUES
  ('bbbbbbbb-0001-0000-0000-000000000000', 'aaaaaaaa-0001-0000-0000-000000000000',
   'Cloud Concepts',
   'Comprension de la nube AWS, beneficios clave, modelos de despliegue (IaaS, PaaS, SaaS) y la propuesta de valor de AWS.',
   24, 1),
  ('bbbbbbbb-0002-0000-0000-000000000000', 'aaaaaaaa-0001-0000-0000-000000000000',
   'Security and Compliance',
   'Modelo de responsabilidad compartida, servicios de seguridad AWS (IAM, Shield, WAF, KMS), cumplimiento normativo.',
   30, 2),
  ('bbbbbbbb-0003-0000-0000-000000000000', 'aaaaaaaa-0001-0000-0000-000000000000',
   'Cloud Technology and Services',
   'Servicios principales de computo (EC2, Lambda), almacenamiento (S3, EBS), bases de datos (RDS, DynamoDB) y red (VPC, Route 53).',
   34, 3),
  ('bbbbbbbb-0004-0000-0000-000000000000', 'aaaaaaaa-0001-0000-0000-000000000000',
   'Billing, Pricing and Support',
   'Modelos de precios AWS, herramientas de gestion de costos (Cost Explorer, Budgets), planes de soporte.',
   12, 4),
  ('bbbbbbbb-0005-0000-0000-000000000000', 'aaaaaaaa-0001-0000-0000-000000000000',
   'Well-Architected Framework',
   'Los seis pilares del Well-Architected Framework: operaciones excelentes, seguridad, fiabilidad, eficiencia de rendimiento, optimizacion de costos, sostenibilidad.',
   0, 5),
  ('bbbbbbbb-0006-0000-0000-000000000000', 'aaaaaaaa-0001-0000-0000-000000000000',
   'Migration and Cloud Adoption',
   'Estrategias de migracion a la nube (7 Rs), AWS Migration Hub, Cloud Adoption Framework (CAF).',
   0, 6)
ON CONFLICT DO NOTHING;

-- Preguntas de muestra (20 preguntas para el banco inicial del simulacro)
INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion, idioma) VALUES

-- Domain 1: Cloud Concepts
('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0001-0000-0000-000000000000',
 'Which of the following best describes the benefit of cloud computing known as "elasticity"?',
 '[{"text": "The ability to pay only for what you use", "is_correct": false},
   {"text": "The ability to automatically scale resources up or down based on demand", "is_correct": true},
   {"text": "The global distribution of data centers", "is_correct": false},
   {"text": "The reduction of hardware maintenance costs", "is_correct": false}]',
 1,
 'Elasticity in cloud computing refers to the ability to automatically scale resources—both up (scaling out) and down (scaling in)—based on actual demand. This is distinct from paying only for what you use (cost model) or global presence.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0001-0000-0000-000000000000',
 'What is the primary characteristic of the Infrastructure as a Service (IaaS) cloud model?',
 '[{"text": "The cloud provider manages the application and data", "is_correct": false},
   {"text": "The user manages only the application code", "is_correct": false},
   {"text": "The cloud provider manages virtualization, servers, storage, and networking", "is_correct": true},
   {"text": "The cloud provider manages the entire stack including the OS", "is_correct": false}]',
 2,
 'In IaaS, the cloud provider manages the physical infrastructure (servers, storage, networking, virtualization). The customer is responsible for the OS, middleware, runtime, data, and applications.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0001-0000-0000-000000000000',
 'A company wants to move its on-premises servers to the cloud without changing its existing applications. Which cloud deployment model is most appropriate?',
 '[{"text": "Public cloud", "is_correct": false},
   {"text": "Hybrid cloud", "is_correct": true},
   {"text": "Community cloud", "is_correct": false},
   {"text": "Multi-cloud", "is_correct": false}]',
 1,
 'A hybrid cloud model connects on-premises infrastructure with cloud resources. This allows the company to migrate gradually while keeping existing applications running on-premises during the transition.',
 'ingles'),

-- Domain 2: Security and Compliance
('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0002-0000-0000-000000000000',
 'According to the AWS Shared Responsibility Model, which of the following is the customer''s responsibility?',
 '[{"text": "Physical security of AWS data centers", "is_correct": false},
   {"text": "Patching the hypervisor", "is_correct": false},
   {"text": "Managing identity and access management (IAM) policies", "is_correct": true},
   {"text": "Replacing failed hard drives in AWS data centers", "is_correct": false}]',
 2,
 'Under the Shared Responsibility Model, customers are responsible for "security IN the cloud." This includes managing IAM users, roles, policies, encrypting data, and configuring firewalls. AWS is responsible for "security OF the cloud" (physical infrastructure).',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0002-0000-0000-000000000000',
 'Which AWS service provides centralized identity management, allowing users to control access to AWS services and resources?',
 '[{"text": "Amazon Cognito", "is_correct": false},
   {"text": "AWS Shield", "is_correct": false},
   {"text": "AWS Identity and Access Management (IAM)", "is_correct": true},
   {"text": "AWS Directory Service", "is_correct": false}]',
 2,
 'AWS IAM is the core service for managing access to AWS resources. It lets you create and manage users, groups, roles, and permissions. Amazon Cognito is for end-user authentication, not AWS resource access control.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0002-0000-0000-000000000000',
 'A company is required to encrypt all data at rest in its AWS S3 buckets to comply with internal security policies. Which service helps manage the encryption keys?',
 '[{"text": "AWS CloudTrail", "is_correct": false},
   {"text": "AWS Key Management Service (KMS)", "is_correct": true},
   {"text": "Amazon GuardDuty", "is_correct": false},
   {"text": "AWS Config", "is_correct": false}]',
 1,
 'AWS KMS is a managed service that makes it easy to create and control encryption keys used to encrypt your data. It integrates directly with S3 to enable server-side encryption with KMS-managed keys (SSE-KMS).',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0002-0000-0000-000000000000',
 'Which AWS service provides managed DDoS protection for applications running on AWS?',
 '[{"text": "AWS WAF", "is_correct": false},
   {"text": "AWS Firewall Manager", "is_correct": false},
   {"text": "Amazon Inspector", "is_correct": false},
   {"text": "AWS Shield", "is_correct": true}]',
 3,
 'AWS Shield is a managed DDoS protection service. Shield Standard is included at no extra cost for all AWS customers. Shield Advanced provides enhanced protections and 24/7 access to the AWS DDoS Response Team (DRT).',
 'ingles'),

-- Domain 3: Cloud Technology and Services
('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0003-0000-0000-000000000000',
 'Which AWS service allows you to run code without provisioning or managing servers?',
 '[{"text": "Amazon EC2", "is_correct": false},
   {"text": "AWS Lambda", "is_correct": true},
   {"text": "Amazon ECS", "is_correct": false},
   {"text": "AWS Elastic Beanstalk", "is_correct": false}]',
 1,
 'AWS Lambda is a serverless compute service. You upload code and Lambda runs it in response to events, automatically managing the underlying compute infrastructure. You pay only for the compute time consumed.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0003-0000-0000-000000000000',
 'A company needs a highly durable and scalable object storage solution to store images and videos. Which AWS service is most appropriate?',
 '[{"text": "Amazon EBS", "is_correct": false},
   {"text": "Amazon EFS", "is_correct": false},
   {"text": "Amazon S3", "is_correct": true},
   {"text": "Amazon Glacier", "is_correct": false}]',
 2,
 'Amazon S3 (Simple Storage Service) is AWS''s object storage service. It offers 99.999999999% (11 nines) durability, virtually unlimited scalability, and is ideal for storing unstructured data like images and videos.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0003-0000-0000-000000000000',
 'Which AWS service is a managed relational database that automates backups, patching, and scaling?',
 '[{"text": "Amazon DynamoDB", "is_correct": false},
   {"text": "Amazon RDS", "is_correct": true},
   {"text": "Amazon Redshift", "is_correct": false},
   {"text": "Amazon ElastiCache", "is_correct": false}]',
 1,
 'Amazon RDS (Relational Database Service) is a managed relational database service supporting MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server. It handles routine database tasks like backups, patch management, and scaling.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0003-0000-0000-000000000000',
 'What is an Amazon VPC?',
 '[{"text": "A service to monitor AWS resource usage", "is_correct": false},
   {"text": "A virtual private cloud that lets you provision a logically isolated section of AWS cloud", "is_correct": true},
   {"text": "A content delivery network service", "is_correct": false},
   {"text": "A service for running containerized applications", "is_correct": false}]',
 1,
 'Amazon VPC (Virtual Private Cloud) lets you launch AWS resources in a logically isolated virtual network you define. You have full control over your virtual networking environment, including IP address range, subnets, route tables, and network gateways.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0003-0000-0000-000000000000',
 'A company needs a NoSQL database that can handle millions of requests per second with single-digit millisecond latency. Which AWS service should they use?',
 '[{"text": "Amazon RDS", "is_correct": false},
   {"text": "Amazon Aurora", "is_correct": false},
   {"text": "Amazon Redshift", "is_correct": false},
   {"text": "Amazon DynamoDB", "is_correct": true}]',
 3,
 'Amazon DynamoDB is a fully managed NoSQL database service that delivers single-digit millisecond performance at any scale. It is serverless, automatically scales throughput capacity, and can handle millions of requests per second.',
 'ingles'),

-- Domain 4: Billing, Pricing and Support
('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0004-0000-0000-000000000000',
 'Which AWS pricing model allows customers to save up to 72% compared to On-Demand pricing by committing to a specific instance configuration for 1 or 3 years?',
 '[{"text": "Spot Instances", "is_correct": false},
   {"text": "Reserved Instances", "is_correct": true},
   {"text": "Dedicated Hosts", "is_correct": false},
   {"text": "Savings Plans", "is_correct": false}]',
 1,
 'Reserved Instances (RIs) offer significant discounts (up to 72%) compared to On-Demand pricing in exchange for a 1-year or 3-year commitment to a specific instance type. Spot Instances can be cheaper but can be interrupted by AWS.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0004-0000-0000-000000000000',
 'Which AWS tool provides an estimate of your monthly AWS bill based on your expected usage?',
 '[{"text": "AWS Cost Explorer", "is_correct": false},
   {"text": "AWS Budgets", "is_correct": false},
   {"text": "AWS Pricing Calculator", "is_correct": true},
   {"text": "AWS Trusted Advisor", "is_correct": false}]',
 2,
 'The AWS Pricing Calculator (formerly Simple Monthly Calculator) lets you explore AWS services and create an estimate of the cost of your use cases before you start using AWS. Cost Explorer analyzes existing costs; Budgets sets alerts.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0004-0000-0000-000000000000',
 'A small startup wants AWS support that includes access to a Technical Account Manager (TAM). Which support plan should they choose?',
 '[{"text": "Basic", "is_correct": false},
   {"text": "Developer", "is_correct": false},
   {"text": "Business", "is_correct": false},
   {"text": "Enterprise", "is_correct": true}]',
 3,
 'A Technical Account Manager (TAM) is available only in the Enterprise support plan. The TAM acts as your primary point of contact and provides proactive guidance to help you plan, deploy, and optimize your AWS environment.',
 'ingles'),

-- Domain 5: Well-Architected Framework
('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0005-0000-0000-000000000000',
 'Which pillar of the AWS Well-Architected Framework focuses on the ability of a system to recover from failures and meet demand?',
 '[{"text": "Security", "is_correct": false},
   {"text": "Performance Efficiency", "is_correct": false},
   {"text": "Reliability", "is_correct": true},
   {"text": "Operational Excellence", "is_correct": false}]',
 2,
 'The Reliability pillar focuses on ensuring a workload performs its intended function correctly and consistently. It includes the ability to recover from infrastructure or service disruptions, dynamically acquire computing resources to meet demand, and mitigate disruptions.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0005-0000-0000-000000000000',
 'A company wants to avoid over-provisioning resources and only pay for what they use. Which pillar of the Well-Architected Framework addresses this?',
 '[{"text": "Reliability", "is_correct": false},
   {"text": "Cost Optimization", "is_correct": true},
   {"text": "Sustainability", "is_correct": false},
   {"text": "Operational Excellence", "is_correct": false}]',
 1,
 'The Cost Optimization pillar focuses on avoiding unnecessary costs. Key topics include understanding spending over time, controlling funds allocation, selecting resources of the right type and quantity, and scaling to meet business needs without overspending.',
 'ingles'),

-- Domain 6: Migration and Cloud Adoption
('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0006-0000-0000-000000000000',
 'In the context of cloud migration strategies, what does "Rehost" (also known as "lift and shift") mean?',
 '[{"text": "Rewriting the application to use cloud-native features", "is_correct": false},
   {"text": "Moving the application to the cloud without any changes", "is_correct": true},
   {"text": "Replacing the application with a SaaS product", "is_correct": false},
   {"text": "Optimizing the application for cloud performance", "is_correct": false}]',
 1,
 '"Rehost" (Lift and Shift) means moving an application to the cloud without making any changes to the application itself. It is the quickest migration path and often used to meet tight deadlines, but it does not take advantage of cloud-native features.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0006-0000-0000-000000000000',
 'The AWS Cloud Adoption Framework (CAF) organizes guidance into six perspectives. Which perspective focuses on aligning IT strategy with business strategy?',
 '[{"text": "People Perspective", "is_correct": false},
   {"text": "Platform Perspective", "is_correct": false},
   {"text": "Business Perspective", "is_correct": true},
   {"text": "Governance Perspective", "is_correct": false}]',
 2,
 'The Business Perspective of the AWS CAF ensures that IT aligns with business needs and that IT investments link to key business results. Stakeholders from business, finance, and strategy teams typically use this perspective.',
 'ingles'),

('aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0006-0000-0000-000000000000',
 'Which AWS service helps organizations assess their readiness to migrate workloads to AWS and tracks migration progress?',
 '[{"text": "AWS Application Discovery Service", "is_correct": false},
   {"text": "AWS Migration Hub", "is_correct": true},
   {"text": "AWS DataSync", "is_correct": false},
   {"text": "AWS Transfer Family", "is_correct": false}]',
 1,
 'AWS Migration Hub provides a single location to track the progress of application migrations across multiple AWS and partner migration tools. It gives visibility into the application portfolio and provides key metrics about the migration status.',
 'ingles');

-- === 012_ai_lab_advanced.sql ===

-- ============================================================
-- ITSEIA Academy Online — Migration 012: AI Lab Avanzado
-- Feature: 010-ai-lab-advanced
-- Fecha: 2026-03-23
-- Tablas: ai_conversations, ai_favorites, code_snippets,
--         flashcards, flashcard_decks
-- RLS: user_id = auth.uid() en todas las tablas
-- ============================================================

-- ============================================================
-- ai_conversations
-- Guarda cada conversacion del AI Lab por usuario y sesion
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id    UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  model         TEXT NOT NULL DEFAULT 'gemini-2.0-flash',
  title         TEXT,
  messages      JSONB NOT NULL DEFAULT '[]'::jsonb,
  es_comparacion BOOLEAN NOT NULL DEFAULT false,
  favorito      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_conversations IS
  'Historial de conversaciones del AI Lab por estudiante';

-- ============================================================
-- ai_favorites
-- Respuestas individuales marcadas como favoritas
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_favorites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  mensaje_index   INTEGER NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, conversation_id, mensaje_index)
);

COMMENT ON TABLE public.ai_favorites IS
  'Respuestas del AI Lab marcadas como favoritas por el estudiante';

-- ============================================================
-- code_snippets
-- Codigo guardado desde el Playground
-- ============================================================

CREATE TABLE IF NOT EXISTS public.code_snippets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  language   TEXT NOT NULL DEFAULT 'python',
  code       TEXT NOT NULL,
  output     TEXT,
  title      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.code_snippets IS
  'Snippets de codigo guardados desde el Playground por el estudiante';

-- ============================================================
-- flashcards
-- Tarjetas de memoria generadas por IA desde la teoria
-- ============================================================

CREATE TABLE IF NOT EXISTS public.flashcards (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  deck_name  TEXT,
  frente     TEXT NOT NULL,
  dorso      TEXT NOT NULL,
  editada    BOOLEAN NOT NULL DEFAULT false,
  next_review TIMESTAMPTZ,
  ease_factor DECIMAL(4,2) DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.flashcards IS
  'Flashcards de estudio generadas por IA y guardadas por el estudiante';

-- ============================================================
-- flashcard_decks
-- Sesiones de repaso de flashcards
-- ============================================================

CREATE TABLE IF NOT EXISTS public.flashcard_decks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  flashcard_ids   JSONB NOT NULL DEFAULT '[]'::jsonb,
  session_id      UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  deck_name       TEXT,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  cards_revisadas INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.flashcard_decks IS
  'Mazos de flashcards y sesiones de repaso del estudiante';

-- ============================================================
-- INDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_session
  ON public.ai_conversations (user_id, session_id);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_created
  ON public.ai_conversations (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_favorites_user
  ON public.ai_favorites (user_id);

CREATE INDEX IF NOT EXISTS idx_flashcards_user_session
  ON public.flashcards (user_id, session_id);

CREATE INDEX IF NOT EXISTS idx_code_snippets_user_session
  ON public.code_snippets (user_id, session_id);

CREATE INDEX IF NOT EXISTS idx_flashcard_decks_user
  ON public.flashcard_decks (user_id, created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- ai_conversations
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_conversations_select_own" ON public.ai_conversations;
DROP POLICY IF EXISTS "ai_conversations_insert_own" ON public.ai_conversations;
DROP POLICY IF EXISTS "ai_conversations_update_own" ON public.ai_conversations;
DROP POLICY IF EXISTS "ai_conversations_delete_own" ON public.ai_conversations;

CREATE POLICY "ai_conversations_select_own"
  ON public.ai_conversations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "ai_conversations_insert_own"
  ON public.ai_conversations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "ai_conversations_update_own"
  ON public.ai_conversations FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "ai_conversations_delete_own"
  ON public.ai_conversations FOR DELETE
  USING (user_id = auth.uid());

-- ai_favorites
ALTER TABLE public.ai_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_favorites_select_own" ON public.ai_favorites;
DROP POLICY IF EXISTS "ai_favorites_insert_own" ON public.ai_favorites;
DROP POLICY IF EXISTS "ai_favorites_delete_own" ON public.ai_favorites;

CREATE POLICY "ai_favorites_select_own"
  ON public.ai_favorites FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "ai_favorites_insert_own"
  ON public.ai_favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "ai_favorites_delete_own"
  ON public.ai_favorites FOR DELETE
  USING (user_id = auth.uid());

-- code_snippets
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "code_snippets_select_own" ON public.code_snippets;
DROP POLICY IF EXISTS "code_snippets_insert_own" ON public.code_snippets;
DROP POLICY IF EXISTS "code_snippets_update_own" ON public.code_snippets;
DROP POLICY IF EXISTS "code_snippets_delete_own" ON public.code_snippets;

CREATE POLICY "code_snippets_select_own"
  ON public.code_snippets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "code_snippets_insert_own"
  ON public.code_snippets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "code_snippets_update_own"
  ON public.code_snippets FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "code_snippets_delete_own"
  ON public.code_snippets FOR DELETE
  USING (user_id = auth.uid());

-- flashcards
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "flashcards_select_own" ON public.flashcards;
DROP POLICY IF EXISTS "flashcards_insert_own" ON public.flashcards;
DROP POLICY IF EXISTS "flashcards_update_own" ON public.flashcards;
DROP POLICY IF EXISTS "flashcards_delete_own" ON public.flashcards;

CREATE POLICY "flashcards_select_own"
  ON public.flashcards FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "flashcards_insert_own"
  ON public.flashcards FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "flashcards_update_own"
  ON public.flashcards FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "flashcards_delete_own"
  ON public.flashcards FOR DELETE
  USING (user_id = auth.uid());

-- flashcard_decks
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "flashcard_decks_select_own" ON public.flashcard_decks;
DROP POLICY IF EXISTS "flashcard_decks_insert_own" ON public.flashcard_decks;
DROP POLICY IF EXISTS "flashcard_decks_update_own" ON public.flashcard_decks;
DROP POLICY IF EXISTS "flashcard_decks_delete_own" ON public.flashcard_decks;

CREATE POLICY "flashcard_decks_select_own"
  ON public.flashcard_decks FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "flashcard_decks_insert_own"
  ON public.flashcard_decks FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "flashcard_decks_update_own"
  ON public.flashcard_decks FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "flashcard_decks_delete_own"
  ON public.flashcard_decks FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- Trigger: updated_at automatico en ai_conversations
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ai_conversations_updated_at ON public.ai_conversations;
CREATE TRIGGER trg_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_code_snippets_updated_at ON public.code_snippets;
CREATE TRIGGER trg_code_snippets_updated_at
  BEFORE UPDATE ON public.code_snippets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- === 013_teacher_module.sql ===

-- ============================================================
-- ITSEIA Academy — Feature 011: Modulo Docente Completo
-- Migration 013: teacher_training, announcements, analytics
-- CES Compliance: Art. 61 RRA 2022 (120h formacion docente)
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. EXTEND programs table to support teacher_training type
-- ──────────────────────────────────────────────────────────

-- Drop and recreate the type check constraint to add 'teacher_training'
DO $$
BEGIN
  -- Drop existing check constraint on programs.type if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'programs_type_check'
      AND table_name = 'programs'
  ) THEN
    ALTER TABLE programs DROP CONSTRAINT programs_type_check;
  END IF;

  -- Add updated constraint with teacher_training
  ALTER TABLE programs
    ADD CONSTRAINT programs_type_check
    CHECK (type IN ('carrera', 'curso', 'preuni', 'bootcamp', 'teacher_training'));
END;
$$;

-- ──────────────────────────────────────────────────────────
-- 2. TEACHER TRAINING PROGRESS
--    One row per (teacher, session) in the training program.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_training_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id    uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  completed_at  timestamptz NOT NULL DEFAULT now(),
  hours_credited decimal(5,2) NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_training_progress_teacher
  ON teacher_training_progress(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_training_progress_session
  ON teacher_training_progress(session_id);

ALTER TABLE teacher_training_progress ENABLE ROW LEVEL SECURITY;

-- Docente solo puede ver/insertar sus propios registros
CREATE POLICY "teacher_training_progress_select_own"
  ON teacher_training_progress FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_training_progress_insert_own"
  ON teacher_training_progress FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "teacher_training_progress_admin_all"
  ON teacher_training_progress FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 3. TEACHER CERTIFICATES
--    One row per teacher when they reach 120h.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_certificates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_hours     decimal(6,2) NOT NULL,
  certificate_url text,
  certified_at    timestamptz NOT NULL DEFAULT now(),
  is_valid        boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (teacher_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_certificates_teacher
  ON teacher_certificates(teacher_id);

ALTER TABLE teacher_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_certificates_select"
  ON teacher_certificates FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_certificates_admin_all"
  ON teacher_certificates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 4. TEACHER EXTERNAL HOURS
--    Horas de capacitacion externas validadas manualmente.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_external_hours (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hours        decimal(5,2) NOT NULL CHECK (hours > 0),
  description  text NOT NULL,
  validated_by uuid REFERENCES profiles(id),
  validated_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_external_hours_teacher
  ON teacher_external_hours(teacher_id);

ALTER TABLE teacher_external_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_external_hours_select"
  ON teacher_external_hours FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_external_hours_admin_write"
  ON teacher_external_hours FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_external_hours_admin_update"
  ON teacher_external_hours FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 5. ASSIGNMENT RUBRICS
--    Criterios de evaluacion con pesos (sum = 100%).
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assignment_rubrics (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id  uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  criterion_name text NOT NULL,
  description    text,
  weight_percent decimal(5,2) NOT NULL CHECK (weight_percent > 0 AND weight_percent <= 100),
  order_index    int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assignment_rubrics_assignment
  ON assignment_rubrics(assignment_id);

ALTER TABLE assignment_rubrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assignment_rubrics_select"
  ON assignment_rubrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN sessions s ON s.id = a.session_id
      JOIN subjects sub ON sub.id = s.subject_id
      WHERE a.id = assignment_rubrics.assignment_id
        AND (
          sub.teacher_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
              AND role IN ('super_admin','admin','coordinacion')
          )
          OR EXISTS (
            SELECT 1 FROM enrollments e
            JOIN semesters sem ON sem.id = sub.semester_id
            WHERE e.user_id = auth.uid()
              AND e.program_id = sem.program_id
              AND e.status = 'active'
          )
        )
    )
  );

CREATE POLICY "assignment_rubrics_teacher_write"
  ON assignment_rubrics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN sessions s ON s.id = a.session_id
      JOIN subjects sub ON sub.id = s.subject_id
      WHERE a.id = assignment_rubrics.assignment_id
        AND (
          sub.teacher_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
              AND role IN ('super_admin','admin','coordinacion')
          )
        )
    )
  );

-- ──────────────────────────────────────────────────────────
-- 6. TEACHER INTERVENTIONS
--    Notas de seguimiento privadas (docente -> estudiante).
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_interventions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id  uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  note_text   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_interventions_student
  ON teacher_interventions(student_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_teacher_interventions_teacher
  ON teacher_interventions(teacher_id);

ALTER TABLE teacher_interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_interventions_select"
  ON teacher_interventions FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_interventions_insert"
  ON teacher_interventions FOR INSERT
  WITH CHECK (
    auth.uid() = teacher_id
    AND EXISTS (
      SELECT 1 FROM subjects
      WHERE id = subject_id
        AND teacher_id = auth.uid()
    )
  );

-- ──────────────────────────────────────────────────────────
-- 7. ANNOUNCEMENTS
--    Anuncios de docente para estudiantes de una materia.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id    uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title         text NOT NULL,
  body_markdown text NOT NULL,
  published_at  timestamptz NOT NULL DEFAULT now(),
  is_archived   boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_subject
  ON announcements(subject_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_teacher
  ON announcements(teacher_id);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Docente de la materia puede ver y escribir sus anuncios
CREATE POLICY "announcements_teacher_all"
  ON announcements FOR ALL
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- Estudiantes matriculados pueden leer los no archivados
CREATE POLICY "announcements_student_select"
  ON announcements FOR SELECT
  USING (
    NOT is_archived
    AND EXISTS (
      SELECT 1 FROM enrollments e
      JOIN semesters sem ON sem.id = (
        SELECT semester_id FROM subjects WHERE id = announcements.subject_id
      )
      WHERE e.user_id = auth.uid()
        AND e.program_id = sem.program_id
        AND e.status = 'active'
    )
  );

-- ──────────────────────────────────────────────────────────
-- 8. ANNOUNCEMENT READS
--    Tracking de qué estudiante leyó cada anuncio.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcement_reads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  read_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (announcement_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_reads_user
  ON announcement_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_announcement
  ON announcement_reads(announcement_id);

ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "announcement_reads_own"
  ON announcement_reads FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "announcement_reads_teacher_select"
  ON announcement_reads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM announcements a
      WHERE a.id = announcement_reads.announcement_id
        AND (
          a.teacher_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
              AND role IN ('super_admin','admin','coordinacion')
          )
        )
    )
  );

-- ──────────────────────────────────────────────────────────
-- 9. DIRECT MESSAGES
--    Mensajes privados docente <-> estudiante.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS direct_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id   uuid REFERENCES subjects(id) ON DELETE SET NULL,
  body         text NOT NULL,
  sent_at      timestamptz NOT NULL DEFAULT now(),
  read_at      timestamptz
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient
  ON direct_messages(recipient_id, read_at);
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender
  ON direct_messages(sender_id);

ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direct_messages_select"
  ON direct_messages FOR SELECT
  USING (
    auth.uid() = sender_id
    OR auth.uid() = recipient_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "direct_messages_insert"
  ON direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "direct_messages_update_read"
  ON direct_messages FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- ──────────────────────────────────────────────────────────
-- 10. SEED: Programa de Capacitacion Docente 120h
--     "Docencia Virtual Efectiva" — program_type = teacher_training
-- ──────────────────────────────────────────────────────────

DO $$
DECLARE
  v_program_id  uuid;
  v_semester_id uuid;
  subj_ids      uuid[] := ARRAY[]::uuid[];
  subj_id       uuid;
  sess_id       uuid;

  -- Module definitions: (order, code, name, hours, description)
  modules text[][] := ARRAY[
    ARRAY['1','CAP101','Fundamentos de la Educacion Virtual y el Marco CES','12',
          'Principios de la educacion en linea, marco normativo CES Ecuador, Art. 61 RRA 2022, modalidades de aprendizaje virtual y roles del docente en entornos digitales.'],
    ARRAY['2','CAP102','Uso Efectivo del LMS ITSEIA (Navegacion y Contenido)','16',
          'Navegacion completa del campus ITSEIA: crear sesiones, subir video y teoria, gestionar quizzes, revisar entregas y usar el AI Lab como docente.'],
    ARRAY['3','CAP103','Diseno de Contenido Interactivo y Evaluaciones Online','20',
          'Estrategias de diseno instruccional para entornos virtuales: microlearning, contenido multimedia, rubricas de evaluacion, quizzes adaptativos y feedback efectivo.'],
    ARRAY['4','CAP104','Facilitacion de Clases Sincronicas con Videoconferencia','14',
          'Tecnicas de facilitacion en videoconferencia: dinámicas de participacion, control del aula virtual, gestion del tiempo, grabacion de clases y seguimiento post-sesion.'],
    ARRAY['5','CAP105','Evaluacion Formativa y Retroalimentacion Efectiva','16',
          'Diseno de evaluaciones continuas, retroalimentacion constructiva por escrito, criterios de calificacion transparentes, prevencion del plagio y etica academica online.'],
    ARRAY['6','CAP106','Seguimiento del Progreso Estudiantil y Tutoria Virtual','14',
          'Uso de analytics del LMS para identificar estudiantes en riesgo, estrategias de intervencion temprana, comunicacion proactiva y documentacion de tutoria virtual.'],
    ARRAY['7','CAP107','Inteligencia Artificial como Herramienta Pedagogica','16',
          'Aplicaciones practicas de IA generativa (ChatGPT, Claude, Gemini) para preparar clases, crear ejercicios, personalizar contenido y dar retroalimentacion automatizada.'],
    ARRAY['8','CAP108','Etica, Privacidad y Normativa en la Educacion Online','12',
          'Proteccion de datos personales (LOPDP Ecuador), derechos de autor en contenido digital, accesibilidad e inclusion, etica en el uso de IA y politicas institucionales ITSEIA.']
  ];

  -- Sessions per module (3 sessions each): (order, title, description)
  sess_defs text[][][] := ARRAY[
    -- Module 1
    ARRAY[
      ARRAY['1','Paradigmas de la Educacion Virtual','Historia, modelos y evidencia de efectividad de la educacion en linea. Diferencias con modalidad presencial.'],
      ARRAY['2','Marco Normativo CES para Modalidad en Linea','Art. 57, 61, 62 RRA 2022. Requisitos de horas sincronicas, contenido y capacitacion docente.'],
      ARRAY['3','El Rol del Docente Virtual Efectivo','Competencias digitales, gestion del tiempo, comunicacion asincronica y presencia docente online.']
    ],
    -- Module 2
    ARRAY[
      ARRAY['1','Navegacion y Configuracion del Campus','Tour completo del LMS ITSEIA: dashboard, materias, sesiones, herramientas del docente.'],
      ARRAY['2','Creacion y Edicion de Sesiones Academicas','Subir video, presentacion, teoria markdown, configurar quiz y ejercicio. Indicadores de calidad CES.'],
      ARRAY['3','Gestion de Entregas y Retroalimentacion','Panel de entregas, calificacion, feedback escrito, seguimiento del progreso estudiantil en el LMS.']
    ],
    -- Module 3
    ARRAY[
      ARRAY['1','Principios de Diseno Instruccional para e-Learning','Modelo ADDIE adaptado a entornos virtuales. Objetivos de aprendizaje verificables y alineacion curricular.'],
      ARRAY['2','Creacion de Contenido Multimedia Efectivo','Video educativo de calidad, presentaciones interactivas, teoria estructurada en markdown. Estandar 1500 palabras.'],
      ARRAY['3','Evaluaciones Online y Rubricas de Calificacion','Tipos de evaluacion, diseno de quizzes anti-trampa, rubricas con criterios y pesos, feedback automatizado.']
    ],
    -- Module 4
    ARRAY[
      ARRAY['1','Configuracion Tecnica de Videoconferencia','Setup de camara, microfono, fondo virtual. Herramientas de participacion: sondeos, salas de trabajo, pizarra.'],
      ARRAY['2','Facilitacion Activa en Clase Sincronica','Tecnicas para mantener atencion, dinamicas de participacion, manejo de imprevistos tecnicos, cierre efectivo.'],
      ARRAY['3','Grabacion, Edicion y Publicacion de Clases','Flujo de trabajo: grabar, editar lo esencial, subir a YouTube privado, vincular en el LMS para clase asincronica.']
    ],
    -- Module 5
    ARRAY[
      ARRAY['1','Evaluacion Continua y Aprendizaje Formativo','Diferencia evaluacion formativa vs sumativa. Estrategias de check-in rapido: exit tickets, kahoot, quizzes cortos.'],
      ARRAY['2','Retroalimentacion Escrita de Alto Impacto','Modelo SBI (Situacion-Comportamiento-Impacto). Feedback especifico, accionable y oportuno por plataforma.'],
      ARRAY['3','Integridad Academica en Entornos Digitales','Prevencion del plagio, configuracion de deteccion en quizzes, politica de integridad ITSEIA, consecuencias.']
    ],
    -- Module 6
    ARRAY[
      ARRAY['1','Lectura de Analytics del LMS','Interpretar reportes de progreso, tasas de completitud, tiempo en sesion y patrones de acceso de los estudiantes.'],
      ARRAY['2','Identificacion Temprana de Estudiantes en Riesgo','Criterios de riesgo: 30% sesiones incompletas, quiz promedio menor 60%, 2+ inasistencias consecutivas. Protocolo de intervencion.'],
      ARRAY['3','Comunicacion y Tutoria Virtual Proactiva','Mensajes de seguimiento efectivos, frecuencia recomendada, registro de intervenciones, escalacion a coordinacion.']
    ],
    -- Module 7
    ARRAY[
      ARRAY['1','Fundamentos de IA Generativa para Docentes','Como funcionan LLMs (ChatGPT, Claude, Gemini). Prompt engineering basico aplicado a preparacion de clases.'],
      ARRAY['2','IA para Creacion de Contenido Educativo','Prompts para generar quizzes, ejercicios, resumenes, casos de estudio y retroalimentacion personalizada.'],
      ARRAY['3','IA para Personalizacion y Seguimiento','Usar IA para analizar respuestas de estudiantes, identificar patrones de error, sugerir recursos adicionales.']
    ],
    -- Module 8
    ARRAY[
      ARRAY['1','Proteccion de Datos en la Educacion Online','LOPDP Ecuador: datos que se recopilan en el LMS, derechos de los estudiantes, politica de privacidad ITSEIA.'],
      ARRAY['2','Derechos de Autor y Contenido Digital','Creative Commons, uso justo, citar correctamente, crear contenido original vs curado, politica de copyright.'],
      ARRAY['3','Accesibilidad, Inclusion y Etica Docente','Diseno universal para el aprendizaje, subtitulos en videos, texto alternativo, conducta etica en entornos digitales.']
    ]
  ];

BEGIN
  -- Check if already seeded
  IF EXISTS (
    SELECT 1 FROM programs WHERE slug = 'docencia-virtual-efectiva'
  ) THEN
    RAISE NOTICE 'Teacher training program already seeded, skipping.';
    RETURN;
  END IF;

  -- Create the training program
  INSERT INTO programs (
    id, name, slug, description, type, price, duration_months,
    is_active, total_semesters
  ) VALUES (
    gen_random_uuid(),
    'Docencia Virtual Efectiva',
    'docencia-virtual-efectiva',
    'Programa de capacitacion de 120 horas para docentes de modalidad en linea. Requisito Art. 61 RRA 2022 (CES Ecuador). Cubre fundamentos pedagogicos, uso del LMS ITSEIA, diseno de contenido, facilitacion sincronica, evaluacion, tutoria virtual e inteligencia artificial aplicada a la docencia.',
    'teacher_training',
    0,
    3,
    true,
    1
  ) RETURNING id INTO v_program_id;

  -- Create 1 semester
  INSERT INTO semesters (
    id, program_id, number, name, level, is_active
  ) VALUES (
    gen_random_uuid(),
    v_program_id,
    1,
    'Capacitacion Completa 120h',
    'professional',
    true
  ) RETURNING id INTO v_semester_id;

  -- Create 8 subjects (one per module)
  FOR i IN 1..8 LOOP
    INSERT INTO subjects (
      id, semester_id, code, name, slug,
      description, credit_hours,
      hours_docencia, hours_practica, hours_autonomo, hours_total,
      order_index, is_active
    ) VALUES (
      gen_random_uuid(),
      v_semester_id,
      modules[i][2],
      modules[i][3],
      lower(replace(replace(modules[i][3], ' ', '-'), '/', '-')),
      modules[i][5],
      0,
      modules[i][4]::int / 2,
      modules[i][4]::int / 4,
      modules[i][4]::int / 4,
      modules[i][4]::int,
      i,
      true
    ) RETURNING id INTO subj_id;

    subj_ids := array_append(subj_ids, subj_id);

    -- Create 3 sessions per module
    FOR j IN 1..3 LOOP
      INSERT INTO sessions (
        id, subject_id, number, title, description,
        theory_markdown, estimated_duration_minutes,
        order_index, is_active
      ) VALUES (
        gen_random_uuid(),
        subj_id,
        j,
        sess_defs[i][j][2],
        sess_defs[i][j][3],
        '# ' || sess_defs[i][j][2] || E'\n\n' ||
        sess_defs[i][j][3] || E'\n\n' ||
        '## Contenido en Desarrollo' || E'\n\n' ||
        'El equipo de coordinacion academica de ITSEIA esta completando el contenido de este modulo. ' ||
        'Podras acceder al material completo proximamente.' || E'\n\n' ||
        '## Objetivo de Aprendizaje' || E'\n\n' ||
        'Al completar esta sesion podras aplicar los conceptos de **' || sess_defs[i][j][2] ||
        '** en tu practica docente dentro del campus ITSEIA.' || E'\n\n' ||
        '## Actividades Sugeridas Mientras Tanto' || E'\n\n' ||
        '- Revisa la documentacion oficial del campus en la seccion de ayuda.' || E'\n' ||
        '- Explora las materias de ejemplo disponibles en tu panel docente.' || E'\n' ||
        '- Comparte dudas con el coordinador academico por WhatsApp: +593 95 989 2034',
        modules[i][4]::int * 20 / 3,
        j,
        true
      ) RETURNING id INTO sess_id;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Teacher training program seeded successfully. Program ID: %', v_program_id;
END;
$$;
