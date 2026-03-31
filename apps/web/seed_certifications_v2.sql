-- ============================================================
-- ITSEIA Academy — Certifications V2 Seed
-- Google Cloud Digital Leader + Azure AI Fundamentals AI-900
-- + 10 preguntas adicionales AWS Cloud Practitioner
-- Date: March 25, 2026
-- ============================================================

-- ============================================================
-- PART 1: Google Cloud Digital Leader (certification_programs)
-- ============================================================

INSERT INTO public.certification_programs (
  id, slug, nombre, proveedor, logo_url, nivel_dificultad, costo_examen_usd,
  duracion_horas_estimada, umbral_aprobacion_porcentaje, idioma_examen,
  descripcion, estado, dominios_count
)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'google-cloud-digital-leader',
  'Google Cloud Digital Leader',
  'Google Cloud',
  'https://itseia.ai/images/google-cloud-logo.svg',
  'basico',
  99,
  35,
  70,
  'La certificacion Cloud Digital Leader valida la capacidad de un individuo para articular las capacidades de los productos y servicios principales de Google Cloud y como benefician a las organizaciones. Ideal para profesionales de negocios y tecnologia que desean demostrar conocimiento fundamental de la nube.',
  'activa',
  4
);

-- ============================================================
-- PART 2: Google Cloud Digital Leader Domains
-- ============================================================

INSERT INTO public.certification_domains (id, certification_id, nombre, descripcion, porcentaje_en_examen, orden)
VALUES
  ('bbbbbbbb-0201-0000-0000-000000000000', 'aaaaaaaa-0002-0000-0000-000000000000', 'Digital Transformation with Google Cloud', 'Conceptos fundamentales de transformacion digital, tipos de servicios en la nube (IaaS, PaaS, SaaS), y ventajas de Google Cloud', 25, 1),
  ('bbbbbbbb-0202-0000-0000-000000000000', 'aaaaaaaa-0002-0000-0000-000000000000', 'Data and Machine Learning', 'Productos de datos de Google Cloud (BigQuery, Dataflow, Looker), conceptos de ML y AI (Vertex AI, AutoML)', 25, 2),
  ('bbbbbbbb-0203-0000-0000-000000000000', 'aaaaaaaa-0002-0000-0000-000000000000', 'Infrastructure and Application Modernization', 'Compute Engine, GKE, Cloud Run, App Engine, migracion y modernizacion de aplicaciones', 25, 3),
  ('bbbbbbbb-0204-0000-0000-000000000000', 'aaaaaaaa-0002-0000-0000-000000000000', 'Google Cloud Security and Operations', 'IAM, Cloud Armor, Security Command Center, operaciones, monitoreo y cumplimiento', 25, 4);

-- ============================================================
-- PART 3: Azure AI Fundamentals AI-900 (certification_programs)
-- ============================================================

INSERT INTO public.certification_programs (
  id, slug, nombre, proveedor, logo_url, nivel_dificultad, costo_examen_usd,
  duracion_horas_estimada, umbral_aprobacion_porcentaje, idioma_examen,
  descripcion, estado, dominios_count
)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'azure-ai-fundamentals',
  'Azure AI Fundamentals (AI-900)',
  'Microsoft Azure',
  'https://itseia.ai/images/azure-logo.svg',
  'basico',
  99,
  30,
  70,
  'La certificacion Azure AI Fundamentals demuestra conocimiento de conceptos de machine learning e inteligencia artificial, y los servicios relacionados de Microsoft Azure. Cubre ML, Computer Vision, NLP y AI generativa.',
  'activa',
  4
);

-- ============================================================
-- PART 4: Azure AI Fundamentals Domains
-- ============================================================

INSERT INTO public.certification_domains (id, certification_id, nombre, descripcion, porcentaje_en_examen, orden)
VALUES
  ('bbbbbbbb-0301-0000-0000-000000000000', 'aaaaaaaa-0003-0000-0000-000000000000', 'Describe Artificial Intelligence workloads and considerations', 'Principios de AI responsable, tipos de workloads de AI, y consideraciones eticas', 20, 1),
  ('bbbbbbbb-0302-0000-0000-000000000000', 'aaaaaaaa-0003-0000-0000-000000000000', 'Describe fundamental principles of machine learning on Azure', 'Tipos de ML (supervised, unsupervised, reinforcement), Azure Machine Learning, metricas de evaluacion', 25, 2),
  ('bbbbbbbb-0303-0000-0000-000000000000', 'aaaaaaaa-0003-0000-0000-000000000000', 'Describe features of computer vision and NLP workloads on Azure', 'Azure AI Vision, Custom Vision, Face API, Azure AI Language, Speech, Translator', 30, 3),
  ('bbbbbbbb-0304-0000-0000-000000000000', 'aaaaaaaa-0003-0000-0000-000000000000', 'Describe features of generative AI workloads on Azure', 'Azure OpenAI Service, modelos GPT, DALL-E, embeddings, prompt engineering, responsible AI con generative AI', 25, 4);

-- ============================================================
-- PART 5: Google Cloud Digital Leader Questions (30)
-- ============================================================

-- Domain 1: Digital Transformation (8 questions)

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0201-0000-0000-000000000000',
  'What is the primary benefit of using cloud computing compared to traditional on-premises infrastructure?',
  '[{"text":"Guaranteed 100% uptime","is_correct":false},{"text":"Ability to scale resources on demand and pay only for what you use","is_correct":true},{"text":"No need for any IT staff","is_correct":false},{"text":"Faster CPU speeds than any physical server","is_correct":false}]'::jsonb,
  1,
  'Cloud computing provides on-demand scalability and a pay-as-you-go pricing model, which eliminates the need for large upfront capital expenditures on hardware.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0201-0000-0000-000000000000',
  'Which cloud service model provides the most control over the underlying infrastructure, including operating systems and networking?',
  '[{"text":"Software as a Service (SaaS)","is_correct":false},{"text":"Platform as a Service (PaaS)","is_correct":false},{"text":"Infrastructure as a Service (IaaS)","is_correct":true},{"text":"Function as a Service (FaaS)","is_correct":false}]'::jsonb,
  2,
  'IaaS provides the most control, giving users access to virtual machines, storage, and networking. PaaS abstracts the OS, and SaaS abstracts almost everything.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0201-0000-0000-000000000000',
  'A company wants to use a cloud-based email and productivity suite without managing any infrastructure. Which service model best describes this?',
  '[{"text":"IaaS","is_correct":false},{"text":"PaaS","is_correct":false},{"text":"SaaS","is_correct":true},{"text":"CaaS","is_correct":false}]'::jsonb,
  2,
  'SaaS (Software as a Service) delivers fully managed applications over the internet. Google Workspace is a classic example of SaaS.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0201-0000-0000-000000000000',
  'What does "digital transformation" mean in the context of Google Cloud?',
  '[{"text":"Replacing all paper documents with PDFs","is_correct":false},{"text":"Moving all servers to a colocation facility","is_correct":false},{"text":"Using cloud technology to fundamentally change how an organization operates and delivers value","is_correct":true},{"text":"Buying new computers for all employees","is_correct":false}]'::jsonb,
  2,
  'Digital transformation is about using technology (cloud, AI, data) to fundamentally reimagine business processes, culture, and customer experiences, not just digitizing existing ones.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0201-0000-0000-000000000000',
  'Which of the following is a key advantage of a hybrid cloud approach?',
  '[{"text":"All data must reside in a single public cloud","is_correct":false},{"text":"It combines on-premises infrastructure with public cloud services for flexibility and compliance","is_correct":true},{"text":"It eliminates the need for any on-premises hardware","is_correct":false},{"text":"It requires only one cloud provider","is_correct":false}]'::jsonb,
  1,
  'Hybrid cloud allows organizations to keep sensitive workloads on-premises while leveraging the scalability and innovation of public cloud for other workloads, providing flexibility and meeting compliance requirements.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0201-0000-0000-000000000000',
  'What is Google Cloud Anthos primarily used for?',
  '[{"text":"Sending marketing emails","is_correct":false},{"text":"Managing and deploying applications across hybrid and multi-cloud environments","is_correct":true},{"text":"Creating virtual machines only on Google Cloud","is_correct":false},{"text":"Providing cloud storage for backups","is_correct":false}]'::jsonb,
  1,
  'Anthos is Google Cloud platform for managing applications in hybrid and multi-cloud environments, allowing consistent development and operations across on-premises, Google Cloud, and other clouds.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0201-0000-0000-000000000000',
  'Which Google Cloud principle ensures that customers retain ownership and control of their data?',
  '[{"text":"Data sovereignty","is_correct":false},{"text":"Google Cloud trust principle: customers own their data","is_correct":true},{"text":"Data residency","is_correct":false},{"text":"Shared responsibility model","is_correct":false}]'::jsonb,
  1,
  'Google Cloud trust principles clearly state that customer data belongs to the customer, not Google. Google does not process customer data for advertising and customers can export or delete their data at any time.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0201-0000-0000-000000000000',
  'What does Total Cost of Ownership (TCO) include when evaluating cloud migration?',
  '[{"text":"Only the monthly cloud subscription fees","is_correct":false},{"text":"Hardware costs, software licenses, maintenance, staffing, facility costs, and opportunity costs","is_correct":true},{"text":"Only the cost of virtual machines","is_correct":false},{"text":"Only the cost of data transfer","is_correct":false}]'::jsonb,
  1,
  'TCO is a comprehensive calculation that includes all direct and indirect costs: hardware, software, maintenance, staffing, training, facilities, and opportunity costs. Cloud often reduces TCO by eliminating many of these.'
);

-- Domain 2: Data and Machine Learning (8 questions)

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0202-0000-0000-000000000000',
  'What is BigQuery primarily used for?',
  '[{"text":"Real-time messaging between microservices","is_correct":false},{"text":"Large-scale data analytics and data warehousing","is_correct":true},{"text":"Container orchestration","is_correct":false},{"text":"Identity and access management","is_correct":false}]'::jsonb,
  1,
  'BigQuery is Google Cloud fully managed, serverless data warehouse designed for large-scale analytics. It can process petabytes of data using standard SQL queries.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0202-0000-0000-000000000000',
  'Which Google Cloud product enables users to build, train, and deploy machine learning models with minimal coding?',
  '[{"text":"Cloud SQL","is_correct":false},{"text":"Vertex AI","is_correct":true},{"text":"Cloud Storage","is_correct":false},{"text":"Pub/Sub","is_correct":false}]'::jsonb,
  1,
  'Vertex AI is Google Cloud unified ML platform that provides tools for building, training, and deploying ML models, including AutoML for users with limited ML expertise.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0202-0000-0000-000000000000',
  'What type of machine learning is used when you have labeled training data with known correct answers?',
  '[{"text":"Unsupervised learning","is_correct":false},{"text":"Reinforcement learning","is_correct":false},{"text":"Supervised learning","is_correct":true},{"text":"Transfer learning","is_correct":false}]'::jsonb,
  2,
  'Supervised learning uses labeled data (input-output pairs) to train models. The model learns the relationship between inputs and known outputs, then predicts outputs for new inputs.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0202-0000-0000-000000000000',
  'Which Google Cloud service is designed for real-time stream data processing?',
  '[{"text":"BigQuery","is_correct":false},{"text":"Dataflow","is_correct":true},{"text":"Cloud Storage","is_correct":false},{"text":"Compute Engine","is_correct":false}]'::jsonb,
  1,
  'Dataflow is a fully managed service for stream and batch data processing. It is based on Apache Beam and can handle real-time data pipelines at scale.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0202-0000-0000-000000000000',
  'What is Looker primarily used for in the Google Cloud ecosystem?',
  '[{"text":"Virtual machine management","is_correct":false},{"text":"Business intelligence and data visualization","is_correct":true},{"text":"Kubernetes cluster management","is_correct":false},{"text":"DNS resolution","is_correct":false}]'::jsonb,
  1,
  'Looker is Google Cloud business intelligence platform that provides data exploration, visualization, and embedded analytics. It uses a semantic modeling layer called LookML.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0202-0000-0000-000000000000',
  'A company wants to analyze customer sentiment from support tickets automatically. Which type of ML task is this?',
  '[{"text":"Image classification","is_correct":false},{"text":"Object detection","is_correct":false},{"text":"Natural Language Processing (NLP)","is_correct":true},{"text":"Time series forecasting","is_correct":false}]'::jsonb,
  2,
  'Sentiment analysis is a Natural Language Processing (NLP) task. Google Cloud offers pre-trained NLP models through the Natural Language API and custom models via Vertex AI.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0202-0000-0000-000000000000',
  'What is AutoML in the context of Google Cloud?',
  '[{"text":"An automatic server provisioning tool","is_correct":false},{"text":"A tool that enables users to train custom ML models without writing code","is_correct":true},{"text":"An automated backup solution","is_correct":false},{"text":"A CI/CD pipeline tool","is_correct":false}]'::jsonb,
  1,
  'AutoML allows users with limited ML expertise to train high-quality custom models by leveraging Google transfer learning and neural architecture search technology.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0202-0000-0000-000000000000',
  'Which Google Cloud service provides a managed environment for running Apache Spark and Apache Hadoop clusters?',
  '[{"text":"Dataproc","is_correct":true},{"text":"Dataflow","is_correct":false},{"text":"Cloud Composer","is_correct":false},{"text":"Pub/Sub","is_correct":false}]'::jsonb,
  0,
  'Dataproc is a fully managed service for running Apache Spark and Hadoop clusters. It allows fast cluster creation, easy scaling, and integrates with other Google Cloud services.'
);

-- Domain 3: Infrastructure and Application Modernization (7 questions)

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0203-0000-0000-000000000000',
  'Which Google Cloud service provides virtual machines?',
  '[{"text":"Cloud Run","is_correct":false},{"text":"App Engine","is_correct":false},{"text":"Compute Engine","is_correct":true},{"text":"Cloud Functions","is_correct":false}]'::jsonb,
  2,
  'Compute Engine is Google Cloud IaaS offering that provides virtual machines. Users have full control over the OS, networking, and storage configurations.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0203-0000-0000-000000000000',
  'What is Google Kubernetes Engine (GKE) used for?',
  '[{"text":"Relational database management","is_correct":false},{"text":"Managed environment for deploying, managing, and scaling containerized applications","is_correct":true},{"text":"Serverless function execution","is_correct":false},{"text":"DNS and domain management","is_correct":false}]'::jsonb,
  1,
  'GKE is a managed Kubernetes service that automates deployment, scaling, and management of containerized applications using Kubernetes orchestration.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0203-0000-0000-000000000000',
  'Which Google Cloud service allows you to run stateless containers without managing the underlying infrastructure?',
  '[{"text":"Compute Engine","is_correct":false},{"text":"Cloud Run","is_correct":true},{"text":"GKE","is_correct":false},{"text":"Cloud SQL","is_correct":false}]'::jsonb,
  1,
  'Cloud Run is a fully managed serverless platform that runs stateless containers. It automatically scales based on incoming requests and you pay only for the resources used during request processing.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0203-0000-0000-000000000000',
  'What is the primary benefit of using containers for application deployment?',
  '[{"text":"Containers replace the need for any testing","is_correct":false},{"text":"Containers provide consistent environments across development, testing, and production","is_correct":true},{"text":"Containers are faster than bare-metal servers","is_correct":false},{"text":"Containers eliminate the need for code","is_correct":false}]'::jsonb,
  1,
  'Containers package applications with their dependencies, ensuring consistent behavior across environments. This eliminates the \"it works on my machine\" problem and simplifies deployment.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0203-0000-0000-000000000000',
  'A company wants to modernize a legacy monolithic application. Which Google Cloud approach involves breaking the application into smaller, independently deployable services?',
  '[{"text":"Lift and shift to Compute Engine","is_correct":false},{"text":"Rewriting as a microservices architecture","is_correct":true},{"text":"Moving to Cloud Storage","is_correct":false},{"text":"Using Cloud CDN","is_correct":false}]'::jsonb,
  1,
  'Microservices architecture breaks a monolithic app into smaller, independent services that can be developed, deployed, and scaled independently. This is a key modernization pattern on Google Cloud.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0203-0000-0000-000000000000',
  'Which Google Cloud service is a fully managed Platform as a Service (PaaS) for building and deploying web applications?',
  '[{"text":"Compute Engine","is_correct":false},{"text":"GKE","is_correct":false},{"text":"App Engine","is_correct":true},{"text":"Cloud Storage","is_correct":false}]'::jsonb,
  2,
  'App Engine is Google Cloud PaaS offering. Developers focus on code while Google manages the infrastructure, including scaling, load balancing, and health checks.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0203-0000-0000-000000000000',
  'Which service would you use to run event-driven functions without managing servers on Google Cloud?',
  '[{"text":"Cloud Run","is_correct":false},{"text":"Cloud Functions","is_correct":true},{"text":"Compute Engine","is_correct":false},{"text":"GKE","is_correct":false}]'::jsonb,
  1,
  'Cloud Functions is Google Cloud serverless, event-driven compute platform. It executes code in response to events (HTTP requests, Pub/Sub messages, Cloud Storage changes) without any server management.'
);

-- Domain 4: Security and Operations (7 questions)

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0204-0000-0000-000000000000',
  'Which Google Cloud service manages user identities and access to resources?',
  '[{"text":"Cloud Armor","is_correct":false},{"text":"Cloud IAM (Identity and Access Management)","is_correct":true},{"text":"Cloud CDN","is_correct":false},{"text":"Cloud DNS","is_correct":false}]'::jsonb,
  1,
  'Cloud IAM lets administrators control who (identity) can take what action (role) on which resource. It follows the principle of least privilege.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0204-0000-0000-000000000000',
  'What is the principle of least privilege in cloud security?',
  '[{"text":"Giving all users administrator access for convenience","is_correct":false},{"text":"Granting users only the minimum permissions needed to perform their tasks","is_correct":true},{"text":"Removing all permissions from all users","is_correct":false},{"text":"Using only one service account for all applications","is_correct":false}]'::jsonb,
  1,
  'The principle of least privilege ensures users and service accounts have only the minimum permissions necessary. This reduces the attack surface and limits the impact of a compromised account.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0204-0000-0000-000000000000',
  'Which Google Cloud service protects applications from DDoS attacks and provides a web application firewall (WAF)?',
  '[{"text":"Cloud IAM","is_correct":false},{"text":"Cloud Armor","is_correct":true},{"text":"Cloud KMS","is_correct":false},{"text":"Security Command Center","is_correct":false}]'::jsonb,
  1,
  'Cloud Armor provides DDoS protection and WAF capabilities for applications behind Google Cloud load balancers. It uses Google global infrastructure to absorb and filter malicious traffic.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0204-0000-0000-000000000000',
  'Which tool provides a centralized dashboard for identifying security vulnerabilities and misconfigurations across Google Cloud resources?',
  '[{"text":"Cloud Monitoring","is_correct":false},{"text":"Cloud Logging","is_correct":false},{"text":"Security Command Center","is_correct":true},{"text":"Cloud Build","is_correct":false}]'::jsonb,
  2,
  'Security Command Center (SCC) is Google Cloud security and risk management platform. It provides visibility into cloud assets, detects misconfigurations, vulnerabilities, and threats.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0204-0000-0000-000000000000',
  'What does Google Cloud KMS (Key Management Service) provide?',
  '[{"text":"Virtual machine management","is_correct":false},{"text":"Creation and management of cryptographic keys for encrypting data","is_correct":true},{"text":"User authentication","is_correct":false},{"text":"Network load balancing","is_correct":false}]'::jsonb,
  1,
  'Cloud KMS allows you to create, import, and manage cryptographic keys and perform encryption operations. It integrates with other Google Cloud services to encrypt data at rest and in transit.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0204-0000-0000-000000000000',
  'Which Google Cloud service collects, stores, and analyzes log data from Google Cloud services and applications?',
  '[{"text":"Cloud Monitoring","is_correct":false},{"text":"Cloud Logging","is_correct":true},{"text":"Cloud Trace","is_correct":false},{"text":"Cloud Profiler","is_correct":false}]'::jsonb,
  1,
  'Cloud Logging (formerly Stackdriver Logging) collects and stores logs from Google Cloud services, applications, and on-premises resources. It enables real-time analysis and alerting on log data.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0002-0000-0000-000000000000',
  'bbbbbbbb-0204-0000-0000-000000000000',
  'Data residency requirements mandate that certain data must remain within specific geographic boundaries. How does Google Cloud help meet these requirements?',
  '[{"text":"Google Cloud does not support data residency","is_correct":false},{"text":"By allowing customers to choose specific regions for resource deployment and using organization policies","is_correct":true},{"text":"By storing all data in the United States only","is_correct":false},{"text":"By encrypting data so location does not matter","is_correct":false}]'::jsonb,
  1,
  'Google Cloud offers region selection for resources and organization policies to restrict where resources can be deployed, helping customers meet data residency and sovereignty requirements.'
);

-- ============================================================
-- PART 6: Azure AI Fundamentals Questions (30)
-- ============================================================

-- Domain 1: AI workloads and considerations (7 questions)

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0301-0000-0000-000000000000',
  'Which of the following is a core principle of responsible AI as defined by Microsoft?',
  '[{"text":"Maximizing profit from AI systems","is_correct":false},{"text":"Fairness, ensuring AI systems treat all people equitably","is_correct":true},{"text":"Making AI systems as complex as possible","is_correct":false},{"text":"Restricting AI to only large enterprises","is_correct":false}]'::jsonb,
  1,
  'Microsoft six principles of responsible AI are: Fairness, Reliability & Safety, Privacy & Security, Inclusiveness, Transparency, and Accountability. Fairness ensures AI systems do not discriminate.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0301-0000-0000-000000000000',
  'A company uses AI to screen job applications. The AI model rejects candidates from a specific demographic group at a higher rate. Which responsible AI principle is being violated?',
  '[{"text":"Transparency","is_correct":false},{"text":"Reliability","is_correct":false},{"text":"Fairness","is_correct":true},{"text":"Privacy","is_correct":false}]'::jsonb,
  2,
  'Fairness in AI means ensuring models do not discriminate against specific groups. Biased training data or biased features can lead to unfair outcomes that must be identified and mitigated.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0301-0000-0000-000000000000',
  'Which AI workload type involves predicting a numeric value, such as future sales revenue?',
  '[{"text":"Classification","is_correct":false},{"text":"Clustering","is_correct":false},{"text":"Regression","is_correct":true},{"text":"Anomaly detection","is_correct":false}]'::jsonb,
  2,
  'Regression is a supervised learning task that predicts continuous numeric values. Examples include predicting house prices, sales revenue, or temperature based on historical data.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0301-0000-0000-000000000000',
  'Which responsible AI principle requires that AI systems provide explanations for their decisions?',
  '[{"text":"Inclusiveness","is_correct":false},{"text":"Transparency","is_correct":true},{"text":"Privacy","is_correct":false},{"text":"Reliability","is_correct":false}]'::jsonb,
  1,
  'Transparency means AI systems should be understandable. Users should be able to know how decisions are made, what data was used, and the limitations of the system.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0301-0000-0000-000000000000',
  'What is anomaly detection in the context of AI workloads?',
  '[{"text":"Classifying data into predefined categories","is_correct":false},{"text":"Identifying unusual patterns or outliers in data that do not conform to expected behavior","is_correct":true},{"text":"Translating text from one language to another","is_correct":false},{"text":"Generating new images from text descriptions","is_correct":false}]'::jsonb,
  1,
  'Anomaly detection identifies data points that deviate significantly from the norm. Common uses include fraud detection, equipment failure prediction, and network intrusion detection.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0301-0000-0000-000000000000',
  'Which responsible AI principle states that AI systems should perform reliably under various conditions and handle errors gracefully?',
  '[{"text":"Fairness","is_correct":false},{"text":"Transparency","is_correct":false},{"text":"Reliability and Safety","is_correct":true},{"text":"Inclusiveness","is_correct":false}]'::jsonb,
  2,
  'Reliability and Safety ensures AI systems work as intended across different conditions. Systems should be robust, handle unexpected inputs, and minimize potential harm.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0301-0000-0000-000000000000',
  'Which of the following best describes the concept of "accountability" in responsible AI?',
  '[{"text":"AI systems should be as autonomous as possible","is_correct":false},{"text":"People should be accountable for AI systems and their outcomes","is_correct":true},{"text":"Only the AI model is responsible for its predictions","is_correct":false},{"text":"Accountability only applies to government AI projects","is_correct":false}]'::jsonb,
  1,
  'Accountability means that people who design and deploy AI systems should be accountable for how their systems operate. This includes governance frameworks, impact assessments, and human oversight.'
);

-- Domain 2: ML Fundamentals on Azure (8 questions)

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0302-0000-0000-000000000000',
  'In supervised learning, what is a "label" in the training data?',
  '[{"text":"A feature used to make predictions","is_correct":false},{"text":"The known correct answer or outcome for a training example","is_correct":true},{"text":"A hyperparameter of the model","is_correct":false},{"text":"The name of the dataset","is_correct":false}]'::jsonb,
  1,
  'In supervised learning, a label is the known output value for a given input. For example, in a spam classifier, the label would be "spam" or "not spam" for each email in the training set.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0302-0000-0000-000000000000',
  'Which type of machine learning groups similar data points together without predefined labels?',
  '[{"text":"Supervised learning","is_correct":false},{"text":"Reinforcement learning","is_correct":false},{"text":"Unsupervised learning (clustering)","is_correct":true},{"text":"Classification","is_correct":false}]'::jsonb,
  2,
  'Unsupervised learning, specifically clustering, finds natural groupings in data without labeled examples. K-means clustering is a common algorithm that groups data points based on similarity.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0302-0000-0000-000000000000',
  'What is Azure Machine Learning?',
  '[{"text":"A pre-built AI model that cannot be customized","is_correct":false},{"text":"A cloud-based platform for building, training, and deploying machine learning models","is_correct":true},{"text":"A database service for storing ML data only","is_correct":false},{"text":"A tool exclusively for data visualization","is_correct":false}]'::jsonb,
  1,
  'Azure Machine Learning is a comprehensive cloud platform that provides tools for the entire ML lifecycle: data preparation, model training, evaluation, deployment, and monitoring.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0302-0000-0000-000000000000',
  'Which metric is commonly used to evaluate a classification model performance?',
  '[{"text":"Mean Squared Error (MSE)","is_correct":false},{"text":"R-squared","is_correct":false},{"text":"Accuracy, Precision, Recall, and F1-Score","is_correct":true},{"text":"Standard deviation","is_correct":false}]'::jsonb,
  2,
  'Classification models are evaluated using accuracy (overall correctness), precision (true positives / predicted positives), recall (true positives / actual positives), and F1-score (harmonic mean of precision and recall).'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0302-0000-0000-000000000000',
  'What is the purpose of splitting data into training and validation sets?',
  '[{"text":"To make the dataset smaller","is_correct":false},{"text":"To evaluate how well the model generalizes to unseen data","is_correct":true},{"text":"To increase the training speed","is_correct":false},{"text":"To save storage space","is_correct":false}]'::jsonb,
  1,
  'Splitting data allows you to train the model on one subset and evaluate it on another (unseen) subset. This helps detect overfitting and ensures the model generalizes well to new data.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0302-0000-0000-000000000000',
  'What is "overfitting" in machine learning?',
  '[{"text":"The model performs poorly on both training and test data","is_correct":false},{"text":"The model memorizes the training data and performs poorly on new, unseen data","is_correct":true},{"text":"The model is too simple to capture patterns","is_correct":false},{"text":"The model uses too little training data","is_correct":false}]'::jsonb,
  1,
  'Overfitting occurs when a model learns the noise and specific patterns of the training data too well, resulting in high accuracy on training data but poor performance on new data.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0302-0000-0000-000000000000',
  'In Azure Machine Learning, what is a "pipeline"?',
  '[{"text":"A network connection between Azure services","is_correct":false},{"text":"A sequence of reusable steps that define an ML workflow from data preparation to model deployment","is_correct":true},{"text":"A data storage format","is_correct":false},{"text":"A type of neural network","is_correct":false}]'::jsonb,
  1,
  'An Azure ML pipeline is a workflow of reusable, modular steps (data prep, training, evaluation, deployment) that can be scheduled, versioned, and shared across teams for reproducible ML experiments.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0302-0000-0000-000000000000',
  'What does Azure Automated ML (AutoML) do?',
  '[{"text":"Automatically writes application code","is_correct":false},{"text":"Automatically selects the best algorithm and hyperparameters for a given dataset and task","is_correct":true},{"text":"Automatically collects data from the internet","is_correct":false},{"text":"Automatically deploys applications to production","is_correct":false}]'::jsonb,
  1,
  'Azure AutoML automates the process of selecting the best ML algorithm, feature engineering, and hyperparameter tuning. It tries multiple approaches and selects the best-performing model for your data.'
);

-- Domain 3: Computer Vision and NLP on Azure (8 questions)

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0303-0000-0000-000000000000',
  'Which Azure AI service can analyze an image and return a description of its content, including objects, people, and scenes?',
  '[{"text":"Azure AI Language","is_correct":false},{"text":"Azure AI Vision","is_correct":true},{"text":"Azure AI Speech","is_correct":false},{"text":"Azure AI Translator","is_correct":false}]'::jsonb,
  1,
  'Azure AI Vision (formerly Computer Vision) can analyze images to detect objects, generate captions, extract text (OCR), identify faces, and classify content.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0303-0000-0000-000000000000',
  'What is OCR (Optical Character Recognition) used for?',
  '[{"text":"Detecting objects in video streams","is_correct":false},{"text":"Extracting printed or handwritten text from images and documents","is_correct":true},{"text":"Translating speech to text","is_correct":false},{"text":"Classifying images into categories","is_correct":false}]'::jsonb,
  1,
  'OCR extracts text from images, scanned documents, and PDFs. Azure AI Vision provides OCR capabilities that can read printed and handwritten text in multiple languages.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0303-0000-0000-000000000000',
  'A retail company wants to train an AI model to identify specific products on store shelves using images. Which Azure AI service should they use?',
  '[{"text":"Azure AI Language","is_correct":false},{"text":"Custom Vision","is_correct":true},{"text":"Azure AI Speech","is_correct":false},{"text":"Azure Bot Service","is_correct":false}]'::jsonb,
  1,
  'Custom Vision allows you to build custom image classification and object detection models by uploading and tagging your own training images. It is ideal for domain-specific visual recognition tasks.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0303-0000-0000-000000000000',
  'Which Azure AI service can convert spoken language into written text in real time?',
  '[{"text":"Azure AI Vision","is_correct":false},{"text":"Azure AI Translator","is_correct":false},{"text":"Azure AI Speech (Speech-to-Text)","is_correct":true},{"text":"Azure AI Language","is_correct":false}]'::jsonb,
  2,
  'Azure AI Speech service provides Speech-to-Text (transcription) that converts audio to written text in real time. It supports multiple languages and can be customized for domain-specific vocabulary.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0303-0000-0000-000000000000',
  'What is Named Entity Recognition (NER) in NLP?',
  '[{"text":"A technique for generating text","is_correct":false},{"text":"Identifying and classifying named entities (people, places, organizations, dates) in text","is_correct":true},{"text":"Converting speech to text","is_correct":false},{"text":"Translating text between languages","is_correct":false}]'::jsonb,
  1,
  'NER identifies and categorizes key entities in text such as person names, locations, organizations, dates, and quantities. Azure AI Language provides NER as a pre-built capability.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0303-0000-0000-000000000000',
  'Which Azure AI service provides real-time translation of text between multiple languages?',
  '[{"text":"Azure AI Vision","is_correct":false},{"text":"Azure AI Speech","is_correct":false},{"text":"Azure AI Translator","is_correct":true},{"text":"Azure AI Content Safety","is_correct":false}]'::jsonb,
  2,
  'Azure AI Translator provides real-time text translation across more than 100 languages. It also supports document translation and custom translation models for domain-specific terminology.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0303-0000-0000-000000000000',
  'A customer service team wants to automatically determine whether customer emails express positive, negative, or neutral emotions. Which NLP capability should they use?',
  '[{"text":"Key phrase extraction","is_correct":false},{"text":"Sentiment analysis","is_correct":true},{"text":"Language detection","is_correct":false},{"text":"Entity linking","is_correct":false}]'::jsonb,
  1,
  'Sentiment analysis determines the emotional tone of text, classifying it as positive, negative, neutral, or mixed. Azure AI Language provides this capability as part of its pre-built NLP features.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0303-0000-0000-000000000000',
  'What is the difference between image classification and object detection?',
  '[{"text":"There is no difference; they are the same","is_correct":false},{"text":"Image classification assigns a label to the entire image, while object detection identifies and locates multiple objects with bounding boxes","is_correct":true},{"text":"Object detection only works with video, not images","is_correct":false},{"text":"Image classification requires more data than object detection","is_correct":false}]'::jsonb,
  1,
  'Image classification assigns one or more labels to the whole image. Object detection goes further by identifying individual objects within an image and drawing bounding boxes around each one with confidence scores.'
);

-- Domain 4: Generative AI on Azure (7 questions)

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0304-0000-0000-000000000000',
  'What is Azure OpenAI Service?',
  '[{"text":"A free chatbot for personal use","is_correct":false},{"text":"An Azure service that provides access to OpenAI models like GPT and DALL-E with enterprise security and compliance","is_correct":true},{"text":"A database service for storing AI models","is_correct":false},{"text":"A tool for creating virtual machines","is_correct":false}]'::jsonb,
  1,
  'Azure OpenAI Service provides REST API access to OpenAI powerful models (GPT-4, GPT-3.5, DALL-E, Whisper) with Azure enterprise-grade security, compliance, and regional availability.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0304-0000-0000-000000000000',
  'What is "prompt engineering" in the context of generative AI?',
  '[{"text":"Building physical hardware for AI systems","is_correct":false},{"text":"The practice of crafting effective input prompts to get desired outputs from AI models","is_correct":true},{"text":"Training a new AI model from scratch","is_correct":false},{"text":"Debugging code in AI applications","is_correct":false}]'::jsonb,
  1,
  'Prompt engineering is the art and science of designing input prompts that guide generative AI models to produce desired outputs. Techniques include providing context, examples (few-shot), and specific instructions.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0304-0000-0000-000000000000',
  'Which OpenAI model available through Azure is designed to generate images from text descriptions?',
  '[{"text":"GPT-4","is_correct":false},{"text":"Whisper","is_correct":false},{"text":"DALL-E","is_correct":true},{"text":"Codex","is_correct":false}]'::jsonb,
  2,
  'DALL-E is an image generation model that creates original images from natural language text descriptions. It is available through Azure OpenAI Service for enterprise use cases.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0304-0000-0000-000000000000',
  'What are "embeddings" in the context of generative AI?',
  '[{"text":"Physical components of AI hardware","is_correct":false},{"text":"Numerical vector representations of text that capture semantic meaning","is_correct":true},{"text":"Encrypted versions of training data","is_correct":false},{"text":"User interface components","is_correct":false}]'::jsonb,
  1,
  'Embeddings are dense vector representations of text where semantically similar content has similar vectors. They are used for semantic search, recommendation systems, and as input to other AI models.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0304-0000-0000-000000000000',
  'What is a potential risk of generative AI that organizations must consider?',
  '[{"text":"AI models always produce perfectly accurate outputs","is_correct":false},{"text":"Generative AI can produce plausible but factually incorrect content (hallucinations)","is_correct":true},{"text":"Generative AI cannot generate text in multiple languages","is_correct":false},{"text":"Generative AI requires no computational resources","is_correct":false}]'::jsonb,
  1,
  'Hallucination is a well-known risk where generative AI produces confident but factually incorrect or fabricated information. Organizations must implement validation, grounding, and human review processes.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0304-0000-0000-000000000000',
  'What is Retrieval-Augmented Generation (RAG) used for?',
  '[{"text":"Training new AI models from scratch","is_correct":false},{"text":"Enhancing generative AI responses by retrieving relevant information from external knowledge sources before generating answers","is_correct":true},{"text":"Compressing AI models for mobile devices","is_correct":false},{"text":"Generating random test data","is_correct":false}]'::jsonb,
  1,
  'RAG combines retrieval of relevant documents from a knowledge base with generative AI to produce more accurate, grounded, and up-to-date responses. It helps reduce hallucinations by providing factual context.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0003-0000-0000-000000000000',
  'bbbbbbbb-0304-0000-0000-000000000000',
  'Which technique involves providing a few examples in the prompt to guide the AI model behavior?',
  '[{"text":"Zero-shot learning","is_correct":false},{"text":"Transfer learning","is_correct":false},{"text":"Few-shot learning","is_correct":true},{"text":"Reinforcement learning","is_correct":false}]'::jsonb,
  2,
  'Few-shot learning (or few-shot prompting) involves including a small number of examples in the prompt to demonstrate the desired format or behavior. This helps the model understand the task without fine-tuning.'
);

-- ============================================================
-- PART 7: Additional AWS Cloud Practitioner Questions (10)
-- ============================================================

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'bbbbbbbb-0001-0000-0000-000000000000',
  'Which of the following is NOT a benefit of cloud computing according to AWS?',
  '[{"text":"Trade capital expense for variable expense","is_correct":false},{"text":"Benefit from massive economies of scale","is_correct":false},{"text":"Guaranteed zero downtime for all services","is_correct":true},{"text":"Increase speed and agility","is_correct":false}]'::jsonb,
  2,
  'AWS lists six advantages of cloud computing, but guaranteed zero downtime is NOT one of them. While AWS provides high availability, no cloud provider can guarantee 100% uptime for all services.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'bbbbbbbb-0001-0000-0000-000000000000',
  'What does the concept of "high availability" mean in cloud computing?',
  '[{"text":"The system is available only during business hours","is_correct":false},{"text":"The system is designed to minimize downtime and continue operating even when components fail","is_correct":true},{"text":"The system has unlimited storage capacity","is_correct":false},{"text":"The system uses the latest hardware","is_correct":false}]'::jsonb,
  1,
  'High availability means designing systems that continue to function even when individual components fail. AWS achieves this through redundancy across multiple Availability Zones within a Region.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'bbbbbbbb-0001-0000-0000-000000000000',
  'What is an AWS Region?',
  '[{"text":"A single data center","is_correct":false},{"text":"A geographical area with multiple isolated Availability Zones","is_correct":true},{"text":"A virtual private network","is_correct":false},{"text":"A type of EC2 instance","is_correct":false}]'::jsonb,
  1,
  'An AWS Region is a physical geographic area consisting of two or more Availability Zones (AZs). Each AZ consists of one or more discrete data centers with redundant power, networking, and connectivity.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'bbbbbbbb-0002-0000-0000-000000000000',
  'What is AWS CloudTrail used for?',
  '[{"text":"Monitoring application performance","is_correct":false},{"text":"Recording API calls and user activity for auditing and compliance","is_correct":true},{"text":"Distributing content globally","is_correct":false},{"text":"Managing DNS records","is_correct":false}]'::jsonb,
  1,
  'AWS CloudTrail records API calls made in your AWS account, providing a history of AWS API calls for auditing, security analysis, resource change tracking, and compliance.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'bbbbbbbb-0002-0000-0000-000000000000',
  'Which AWS service helps you assess whether your AWS environment follows security best practices?',
  '[{"text":"AWS Config","is_correct":false},{"text":"AWS Trusted Advisor","is_correct":true},{"text":"Amazon Inspector","is_correct":false},{"text":"AWS CloudFormation","is_correct":false}]'::jsonb,
  1,
  'AWS Trusted Advisor provides real-time guidance to help provision resources following AWS best practices across five categories: cost optimization, performance, security, fault tolerance, and service limits.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'bbbbbbbb-0002-0000-0000-000000000000',
  'What is multi-factor authentication (MFA) in the context of AWS security?',
  '[{"text":"Using multiple passwords for the same account","is_correct":false},{"text":"A security mechanism that requires two or more verification methods: something you know and something you have","is_correct":true},{"text":"Encrypting data with multiple algorithms simultaneously","is_correct":false},{"text":"Using multiple AWS accounts for the same application","is_correct":false}]'::jsonb,
  1,
  'MFA adds an extra layer of security by requiring not just a password (something you know) but also a code from a device (something you have). AWS strongly recommends enabling MFA for the root account and IAM users.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'bbbbbbbb-0003-0000-0000-000000000000',
  'Which AWS service provides a content delivery network (CDN) to deliver content with low latency globally?',
  '[{"text":"Amazon S3","is_correct":false},{"text":"Amazon CloudFront","is_correct":true},{"text":"Amazon Route 53","is_correct":false},{"text":"AWS Direct Connect","is_correct":false}]'::jsonb,
  1,
  'Amazon CloudFront is a CDN that distributes content from edge locations worldwide, reducing latency by serving content from the location closest to the user.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'bbbbbbbb-0003-0000-0000-000000000000',
  'What is Amazon SageMaker used for?',
  '[{"text":"Managing relational databases","is_correct":false},{"text":"Building, training, and deploying machine learning models","is_correct":true},{"text":"Sending email notifications","is_correct":false},{"text":"Managing container clusters","is_correct":false}]'::jsonb,
  1,
  'Amazon SageMaker is a fully managed service for building, training, and deploying ML models at scale. It provides built-in algorithms, Jupyter notebooks, and one-click deployment.'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'bbbbbbbb-0004-0000-0000-000000000000',
  'What is the AWS Free Tier?',
  '[{"text":"A permanent free plan with unlimited resources","is_correct":false},{"text":"A set of offers that allow customers to explore and try AWS services free of charge up to specified limits","is_correct":true},{"text":"A pricing model only for startups","is_correct":false},{"text":"Free technical support for all customers","is_correct":false}]'::jsonb,
  1,
  'The AWS Free Tier offers three types of free offers: Always Free (e.g., Lambda 1M requests/month), 12 Months Free (e.g., EC2 t2.micro), and Trials (short-term for specific services).'
);

INSERT INTO exam_questions (certification_id, domain_id, enunciado, opciones, respuesta_correcta, explicacion)
VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'bbbbbbbb-0004-0000-0000-000000000000',
  'Which AWS tool allows you to set custom cost budgets and receive alerts when your costs exceed thresholds?',
  '[{"text":"AWS Cost Explorer","is_correct":false},{"text":"AWS Budgets","is_correct":true},{"text":"AWS Pricing Calculator","is_correct":false},{"text":"AWS CloudWatch","is_correct":false}]'::jsonb,
  1,
  'AWS Budgets lets you set custom budgets for costs, usage, and reservations. You can configure alerts to notify you via email or SNS when actual or forecasted spending exceeds your defined thresholds.'
);

-- ============================================================
-- SUMMARY
-- ============================================================
-- Insertados:
-- 1. Google Cloud Digital Leader: 1 programa + 4 dominios + 30 preguntas
-- 2. Azure AI Fundamentals AI-900: 1 programa + 4 dominios + 30 preguntas
-- 3. AWS Cloud Practitioner: 10 preguntas adicionales
-- Total nuevos: 2 programas, 8 dominios, 70 preguntas
-- ============================================================
