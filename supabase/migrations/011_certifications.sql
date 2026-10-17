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
