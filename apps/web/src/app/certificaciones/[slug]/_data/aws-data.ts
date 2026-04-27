// ─────────────────────────────────────────────────────────────────────────────
// AWS Cloud Practitioner (CLF-C02) — datos estáticos
// ----------------------------------------------------------------------------
// Fuente de verdad: contenido textual del programa para la página
//   /certificaciones/aws-cloud-practitioner
// Este archivo es complementario al seed SQL (Supabase) y permite renderizar
// las lecciones, videos y simulacro en el frontend SIN consultar al cliente
// por cada item. Las preguntas con respuesta_correcta se exponen aquí solo
// para uso del simulacro local (la lista canónica vive en Supabase y el
// servidor decide qué incluir vía /api/certifications/exam/start).
//
// Compatible con la página existente apps/web/src/app/certificaciones/[slug]/page.tsx
// que ya consume CertificationProgramWithDomains desde /api/certifications/detail.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CertificationLevel,
  CertificationStatus,
  ExamQuestionOption,
} from "@/types/database";

// ── Tipos públicos ──────────────────────────────────────────────────────────

export interface LeccionTeorica {
  id: string;
  orden: number;
  titulo: string;
  contenidoMarkdown: string;
  duracionLecturaMin: number;
}

export interface VideoCurado {
  url: string | null;            // null si la URL aún no está validada
  titulo: string;
  duracionMin: number;
  canal: string | null;
  pendiente: boolean;            // true mientras "GRABACIÓN PROPIA NECESARIA"
  notas: string | null;
}

export interface PreguntaSimulacro {
  id: string;
  enunciado: string;
  opciones: ExamQuestionOption[];
  respuestaCorrecta: number;     // 0-3
  explicacion: string;
}

export interface DominioData {
  orden: number;
  nombre: string;
  descripcion: string;
  porcentajeEnExamen: number;
  lecciones: LeccionTeorica[];
  video: VideoCurado;
  preguntasPractica: PreguntaSimulacro[];
  preguntasSimulacro: PreguntaSimulacro[];
}

export interface CertificacionData {
  slug: string;
  nombre: string;
  proveedor: string;
  logoUrl: string;
  nivelDificultad: CertificationLevel;
  costoExamenUsd: number;
  duracionHorasEstimada: number;
  umbralAprobacionPorcentaje: number;
  idiomaExamen: string;
  descripcion: string;
  estado: CertificationStatus;
  examOficialCodigo: string;
  totalPreguntasSimulacro: number;
  duracionSimulacroMin: number;
  dominios: DominioData[];
}

// ── Helpers de construcción de preguntas ────────────────────────────────────

function q(
  id: string,
  enunciado: string,
  opciones: [string, string, string, string],
  respuestaCorrecta: number,
  explicacion: string
): PreguntaSimulacro {
  return {
    id,
    enunciado,
    opciones: opciones.map((text, idx) => ({
      text,
      is_correct: idx === respuestaCorrecta,
    })),
    respuestaCorrecta,
    explicacion,
  };
}

// ── Datos: AWS Cloud Practitioner ───────────────────────────────────────────

export const awsCloudPractitionerData: CertificacionData = {
  slug: "aws-cloud-practitioner",
  nombre: "AWS Cloud Practitioner",
  proveedor: "AWS",
  logoUrl: "/logos/aws-cloud-practitioner.svg",
  nivelDificultad: "basico",
  costoExamenUsd: 100,
  duracionHorasEstimada: 40,
  umbralAprobacionPorcentaje: 70,
  idiomaExamen: "español",
  descripcion:
    "Domina los fundamentos de la nube de Amazon. Examen CLF-C02 reconocido mundialmente. Valida conocimientos básicos en arquitectura, seguridad, servicios y facturación de AWS.",
  estado: "activa",
  examOficialCodigo: "CLF-C02",
  totalPreguntasSimulacro: 65,
  duracionSimulacroMin: 90,
  dominios: [
    // ── DOMINIO 1 ──────────────────────────────────────────────────────────
    {
      orden: 1,
      nombre: "Cloud Concepts",
      descripcion:
        "Fundamentos de cloud computing, propuesta de valor de AWS, principios de diseño en la nube y migración.",
      porcentajeEnExamen: 24,
      video: {
        url: "https://www.youtube.com/watch?v=SOTamWNgDKc",
        titulo: "AWS Cloud Practitioner Essentials — Conceptos de la Nube (español)",
        duracionMin: 52,
        canal: "AWS en Español",
        pendiente: false,
        notas:
          "Validar duración y calidad antes de publicar. Si no cumple, marcar como GRABACIÓN PROPIA NECESARIA.",
      },
      lecciones: [
        {
          id: "1.1",
          orden: 1,
          titulo: "¿Qué es Cloud Computing?",
          duracionLecturaMin: 6,
          contenidoMarkdown: `Cloud computing es la entrega bajo demanda de potencia de cómputo, bases de datos, almacenamiento, aplicaciones y otros recursos de TI a través de internet, con un modelo de pago por uso.

Los **seis beneficios clave** de la nube según AWS son: (1) cambiar gasto fijo por gasto variable, (2) economías de escala masivas, (3) dejar de adivinar la capacidad, (4) aumentar velocidad y agilidad, (5) dejar de gastar en data centers, y (6) volverse global en minutos.

Los **tres modelos de servicio** son IaaS (EC2), PaaS (Elastic Beanstalk) y SaaS (WorkMail). Los **modelos de despliegue** son nube pública, nube híbrida y on-premise/privada.`,
        },
        {
          id: "1.2",
          orden: 2,
          titulo: "Los 6 Pilares del Well-Architected Framework",
          duracionLecturaMin: 7,
          contenidoMarkdown: `El AWS Well-Architected Framework define seis pilares: **Excelencia operacional, Seguridad, Confiabilidad, Eficiencia del rendimiento, Optimización de costos** y **Sostenibilidad** (añadido en 2021).

Memoriza la sigla **OS-CRES**. En el examen es común que pregunten "¿qué pilar aborda este escenario?" — el error más común es confundir Confiabilidad (recuperarse de fallos) con Eficiencia del rendimiento (elegir el recurso correcto).`,
        },
        {
          id: "1.3",
          orden: 3,
          titulo: "Modelo de Responsabilidad Compartida y Migración",
          duracionLecturaMin: 7,
          contenidoMarkdown: `AWS opera bajo el **Modelo de Responsabilidad Compartida**: AWS protege la **seguridad DE la nube** (hardware, red global, edificios físicos) y el cliente protege la **seguridad EN la nube** (datos, configuración del SO, IAM, encriptación).

Para migración a la nube, AWS propone las **6 R's**: Rehost, Replatform, Repurchase, Refactor, Retire, Retain. El **Cloud Adoption Framework (CAF)** organiza la migración en 6 perspectivas.

Conceptos finales: alta disponibilidad, tolerancia a fallos, escalabilidad vertical/horizontal y elasticidad. Acoplamiento débil con SQS y SNS es el patrón estándar.`,
        },
      ],
      preguntasPractica: [
        q("1.1", "¿Cuál es el principal beneficio económico de mover una carga de trabajo a la nube de AWS?",
          [
            "Eliminar por completo todos los costos operativos.",
            "Cambiar gastos de capital (CapEx) por gastos operativos (OpEx) variables.",
            "Garantizar que los precios bajarán cada año automáticamente.",
            "Dejar de necesitar personal técnico.",
          ], 1,
          "AWS permite pagar solo por lo que se consume, transformando CapEx en OpEx."),
        q("1.2", "Una empresa quiere garantizar que su aplicación pueda recuperarse rápidamente de fallos en infraestructura. ¿Qué pilar del Well-Architected Framework aborda principalmente esta necesidad?",
          ["Excelencia operacional", "Eficiencia del rendimiento", "Confiabilidad", "Sostenibilidad"], 2,
          "El pilar de Confiabilidad cubre recuperación ante fallos, redundancia y diseño Multi-AZ."),
        q("1.3", "En el modelo de responsabilidad compartida, ¿quién es responsable de aplicar los parches del SO invitado en una instancia EC2?",
          ["AWS, automáticamente.", "El cliente.", "AWS, solo si paga soporte Enterprise.", "Nadie, EC2 no requiere parches."], 1,
          "EC2 es IaaS: AWS gestiona el hipervisor; el cliente gestiona el SO invitado, incluidos los parches."),
        q("1.4", "¿Qué tipo de escalado consiste en añadir más instancias en lugar de aumentar el tamaño de una existente?",
          ["Escalado vertical", "Escalado horizontal", "Escalado piramidal", "Escalado regional"], 1,
          "Horizontal = más instancias (scale out). Vertical = instancias más grandes (scale up)."),
        q("1.5", "Una startup necesita lanzar un MVP en menos de un mes. ¿Cuál de los seis beneficios de la nube se evidencia más?",
          ["Economías de escala", "Aumento de velocidad y agilidad", "Eliminar gasto en data centers", "Volverse global en minutos"], 1,
          "Lanzar un producto en poco tiempo se asocia directamente al beneficio de velocidad y agilidad."),
        q("1.6", "¿Cuál de las siguientes es una característica de la elasticidad en la nube?",
          ["Pagar tarifa fija mensual sin importar el uso.", "Escalar recursos automáticamente según la demanda.", "Mantener siempre el mismo número de servidores.", "Migrar manualmente entre regiones."], 1,
          "Elasticidad = escalado automático y dinámico según demanda real."),
        q("1.7", "¿Qué estrategia de migración consiste en reemplazar una aplicación on-premise por una solución SaaS equivalente?",
          ["Rehost", "Replatform", "Repurchase", "Retire"], 2,
          "Repurchase (drop and shop) significa cambiar por SaaS comercial."),
        q("1.8", "¿Cuál es el modelo de servicio donde el cliente solo se preocupa por el código y AWS gestiona toda la infraestructura?",
          ["IaaS", "PaaS", "SaaS", "DaaS"], 1,
          "PaaS — ej. Elastic Beanstalk — gestiona la infraestructura por el cliente."),
        q("1.9", "¿Qué pilar del Well-Architected Framework fue añadido en 2021 para abordar el impacto ambiental?",
          ["Optimización de costos", "Excelencia operacional", "Sostenibilidad", "Confiabilidad"], 2,
          "Sostenibilidad fue el sexto pilar incorporado en 2021."),
        q("1.10", "Una empresa quiere mantener parte de su carga on-premise y otra parte en AWS. ¿Qué modelo de despliegue describe este escenario?",
          ["Nube pública pura", "Nube híbrida", "Nube privada", "Multi-cloud"], 1,
          "Nube híbrida combina on-premise con nube pública usando VPN o Direct Connect."),
      ],
      preguntasSimulacro: [], // se llena abajo con las 16 finales
    },

    // ── DOMINIO 2 ──────────────────────────────────────────────────────────
    {
      orden: 2,
      nombre: "Security and Compliance",
      descripcion:
        "Modelo de responsabilidad compartida, IAM, servicios de seguridad y cumplimiento normativo.",
      porcentajeEnExamen: 30,
      video: {
        url: null,
        titulo: "AWS CLF-C02 — Seguridad y Cumplimiento desde cero",
        duracionMin: 55,
        canal: null,
        pendiente: true,
        notas:
          "GRABACIÓN PROPIA NECESARIA. No se ha encontrado un video en español de calidad consistente con duración 50-60 min y cobertura completa de IAM + WAF/Shield + Macie/GuardDuty + Artifact.",
      },
      lecciones: [
        {
          id: "2.1",
          orden: 1,
          titulo: "IAM: Identity and Access Management",
          duracionLecturaMin: 7,
          contenidoMarkdown: `IAM es el servicio gratuito y global de AWS para gestionar **quién puede hacer qué**. Componentes: Usuarios, Grupos, Roles y Políticas (JSON con Effect, Action, Resource, Condition).

Mejores prácticas: no usar root para tareas diarias, activar MFA, principio de menor privilegio, rotar credenciales, usar Roles en lugar de access keys, asignar permisos vía grupos, y habilitar CloudTrail.

IAM es **global** y **gratuito**. Por defecto niega todo (implicit deny); un deny explícito siempre gana sobre un allow. **AWS Organizations + SCP** limitan permisos máximos en cuentas miembro.`,
        },
        {
          id: "2.2",
          orden: 2,
          titulo: "Servicios de Seguridad y Detección",
          duracionLecturaMin: 8,
          contenidoMarkdown: `**Protección:** AWS WAF (SQLi/XSS), Shield Standard (gratis, DDoS L3/L4), Shield Advanced ($3,000/mes con DRT), Security Groups (stateful) y NACLs (stateless).

**Detección:** GuardDuty (ML sobre VPC Flow Logs/CloudTrail/DNS), Inspector (vulnerabilidades EC2/ECR/Lambda), Macie (PII en S3), Security Hub (agregador), CloudTrail (audit API), Config (cumplimiento), Trusted Advisor (5 categorías).

**Encriptación:** KMS, CloudHSM (FIPS 140-2 nivel 3), ACM (certificados TLS gratis), Secrets Manager (rotación nativa para RDS).`,
        },
        {
          id: "2.3",
          orden: 3,
          titulo: "Cumplimiento Normativo y AWS Artifact",
          duracionLecturaMin: 6,
          contenidoMarkdown: `AWS opera bajo SOC 1/2/3, ISO 27001/27017/27018, PCI DSS, HIPAA, GDPR, FedRAMP, CSA STAR, NIST y ENS.

**AWS Artifact** es el portal de autoservicio para descargar reportes de auditoría (SOC, ISO, PCI) y acuerdos legales (BAA para HIPAA, DPA para GDPR).

**AWS Audit Manager** automatiza la recolección de evidencia. La soberanía de datos se respeta porque el cliente elige la región: AWS no mueve datos entre regiones sin permiso.`,
        },
        {
          id: "2.4",
          orden: 4,
          titulo: "Encriptación, Federación y Seguridad de Datos",
          duracionLecturaMin: 7,
          contenidoMarkdown: `**Encriptación en reposo:** SSE-S3, SSE-KMS, SSE-C en S3; AES-256 en EBS; KMS nativo en RDS. **En tránsito:** TLS/SSL con ACM gratis para CloudFront y ALB.

**Identidades federadas:** SAML 2.0 para AD/Okta, OIDC para Google/Microsoft Entra. Cognito para apps móviles/web. Directory Service para AD administrado.

**Seguridad práctica para el examen:** Role IAM para EC2 → S3 (nunca hardcode keys); CloudHSM para FIPS 140-2; Secrets Manager para rotar credenciales RDS; Macie para detectar PII en S3.`,
        },
      ],
      preguntasPractica: [
        q("2.1", "¿Cuál es la mejor práctica recomendada por AWS para usar la cuenta raíz (root)?",
          ["Usarla a diario para todas las operaciones administrativas.", "Compartirla con todo el equipo de DevOps.", "Reservarla solo para tareas que la requieran y proteger con MFA.", "Eliminarla después de crear el primer usuario IAM."], 2,
          "La cuenta root tiene privilegios totales. AWS recomienda reservarla solo para tareas que la requieran y proteger con MFA."),
        q("2.2", "Una aplicación EC2 necesita leer objetos de un bucket S3. ¿Cuál es la forma MÁS segura de otorgar este acceso?",
          ["Hardcodear access keys en el código.", "Asignar un Role IAM a la instancia EC2.", "Crear un usuario IAM y compartir credenciales.", "Hacer público el bucket S3."], 1,
          "Los Roles IAM otorgan credenciales temporales rotadas automáticamente."),
        q("2.3", "¿Qué servicio AWS protege aplicaciones web contra ataques de inyección SQL y XSS?",
          ["AWS Shield Standard", "AWS WAF", "Amazon GuardDuty", "AWS Config"], 1,
          "WAF filtra tráfico HTTP/HTTPS contra reglas para detener inyecciones SQL y XSS."),
        q("2.4", "¿Cuál es el servicio de AWS para descargar reportes de cumplimiento como SOC 2, ISO 27001 y PCI DSS?",
          ["AWS Trusted Advisor", "AWS Config", "AWS Artifact", "AWS Inspector"], 2,
          "Artifact es el portal de autoservicio para reportes de auditoría."),
        q("2.5", "Una empresa necesita detectar de forma automática datos personales (PII) en S3. ¿Qué servicio debe usar?",
          ["Amazon GuardDuty", "AWS Inspector", "Amazon Macie", "AWS Shield"], 2,
          "Macie usa machine learning para descubrir y proteger datos sensibles en S3."),
        q("2.6", "En el modelo de responsabilidad compartida, ¿quién es responsable de la seguridad física de los data centers?",
          ["El cliente", "AWS", "Compartido 50/50", "Ninguno"], 1,
          "AWS es responsable de la seguridad DE la nube: hardware, red global y edificios físicos."),
        q("2.7", "¿Qué servicio analiza CloudTrail, VPC Flow Logs y DNS logs con ML para detectar amenazas?",
          ["AWS Inspector", "Amazon GuardDuty", "AWS WAF", "Amazon Macie"], 1,
          "GuardDuty es el servicio de detección inteligente de amenazas basado en ML."),
        q("2.8", "¿Cuál de los siguientes elementos NO es un componente de IAM?",
          ["Usuarios", "Grupos", "Roles", "Subredes"], 3,
          "Las subredes (subnets) pertenecen a VPC, no a IAM."),
        q("2.9", "¿Qué servicio gestiona claves criptográficas integradas con S3, EBS y RDS, con auditoría en CloudTrail?",
          ["AWS Certificate Manager", "AWS KMS", "AWS Secrets Manager", "AWS CloudHSM"], 1,
          "KMS es el servicio gestionado de cifrado integrado con la mayoría de servicios AWS."),
        q("2.10", "Una compañía requiere FIPS 140-2 nivel 3 con HSM dedicado. ¿Qué servicio elegir?",
          ["AWS KMS", "AWS Secrets Manager", "AWS CloudHSM", "ACM"], 2,
          "CloudHSM ofrece HSM dedicados con cumplimiento FIPS 140-2 nivel 3."),
      ],
      preguntasSimulacro: [],
    },

    // ── DOMINIO 3 ──────────────────────────────────────────────────────────
    {
      orden: 3,
      nombre: "Cloud Technology and Services",
      descripcion:
        "Cómputo, almacenamiento, bases de datos, redes y servicios principales de AWS. El dominio con mayor peso.",
      porcentajeEnExamen: 34,
      video: {
        url: "https://www.youtube.com/watch?v=ulprqHHWlng",
        titulo: "AWS Cloud Practitioner — Servicios Core en Español (EC2, S3, VPC, RDS)",
        duracionMin: 58,
        canal: "Cloud con Carlos",
        pendiente: false,
        notas:
          "Validar duración y autoría del canal antes de publicar.",
      },
      lecciones: [
        {
          id: "3.1",
          orden: 1,
          titulo: "Infraestructura Global y Cómputo",
          duracionLecturaMin: 8,
          contenidoMarkdown: `Infraestructura: **Regiones** (>33), **AZ** (>=3 por región), **Edge Locations** (>600 para CloudFront/Route 53), **Local Zones / Wavelength**.

**EC2** — VMs con familias T, M, C, R, I, G/P. Compra: On-Demand, Reserved (hasta 72 % desc.), Savings Plans, Spot (hasta 90 %), Dedicated Hosts.

**Lambda** — serverless, hasta 15 min y 10 GB RAM. **Elastic Beanstalk** — PaaS. **ECS/EKS/Fargate** — contenedores; Fargate es serverless. **AWS Batch** y **Outposts** completan el portafolio.`,
        },
        {
          id: "3.2",
          orden: 2,
          titulo: "Almacenamiento",
          duracionLecturaMin: 7,
          contenidoMarkdown: `**Objetos — S3:** durabilidad 99.999999999 % (11 nueves). Clases: Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant/Flexible, Glacier Deep Archive (más barato, 12h).

**Bloques — EBS:** gp3, io2, st1, sc1. Específico de UNA AZ. Snapshots a S3.

**Archivos — EFS** (NFS multi-AZ Linux), **FSx for Windows/Lustre**, **Storage Gateway**.

**Migración masiva:** Snowcone (8 TB), Snowball Edge (80 TB), Snowmobile (100 PB), DataSync.`,
        },
        {
          id: "3.3",
          orden: 3,
          titulo: "Bases de Datos y Analítica",
          duracionLecturaMin: 8,
          contenidoMarkdown: `**Relacionales (RDS):** MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora. Multi-AZ y Read Replicas. **Aurora** = propietario, hasta 5x más rápido, 6 copias en 3 AZ.

**NoSQL — DynamoDB:** key-value/documentos, ms latencia, serverless. DAX = caché. Global Tables = multi-región activo-activo.

**Especializadas:** ElastiCache, Neptune, DocumentDB, Keyspaces, Timestream, QLDB, Redshift (data warehouse PB).

**Migración:** DMS y SCT. **Analítica:** Athena, EMR, Glue, Kinesis, QuickSight, Lake Formation.`,
        },
        {
          id: "3.4",
          orden: 4,
          titulo: "Redes, Mensajería e Integración",
          duracionLecturaMin: 8,
          contenidoMarkdown: `**VPC:** subredes, IGW, NAT Gateway, Route Tables, SG, NACL, Peering, Transit Gateway, VPC Endpoints (Gateway gratis para S3/DynamoDB).

**Híbrido:** Direct Connect, Site-to-Site VPN, Client VPN.

**DNS/CDN:** Route 53, CloudFront, Global Accelerator. **Balanceo:** ALB (L7), NLB (L4), GLB. Auto Scaling Groups.

**Mensajería:** SQS, SNS, EventBridge, Step Functions, Amazon MQ.

**ML/IA:** SageMaker, Rekognition, Polly, Transcribe, Comprehend, Translate, Lex, Bedrock.`,
        },
      ],
      preguntasPractica: [
        q("3.1", "Una empresa quiere ejecutar una carga batch que tolera interrupciones para minimizar costo. ¿Qué tipo de instancia EC2 debe elegir?",
          ["On-Demand", "Reserved Instance de 3 años", "Spot Instance", "Dedicated Host"], 2,
          "Spot ofrece hasta 90 % de descuento, ideal para cargas tolerantes a interrupciones."),
        q("3.2", "¿Qué servicio AWS es serverless y permite ejecutar código sin gestionar servidores?",
          ["Amazon EC2", "AWS Lambda", "Amazon ECS", "Elastic Beanstalk"], 1,
          "Lambda es la solución serverless de AWS por excelencia."),
        q("3.3", "¿Cuál es la durabilidad de Amazon S3 Standard?",
          ["99.9 %", "99.99 %", "99.999999999 % (11 nueves)", "100 %"], 2,
          "S3 Standard ofrece durabilidad de 11 nueves a través de replicación entre múltiples AZ."),
        q("3.4", "Una empresa necesita archivar datos por 10 años con costo mínimo y recuperación 12h. ¿Qué clase S3 usar?",
          ["S3 Standard", "S3 Standard-IA", "S3 Glacier Deep Archive", "S3 Intelligent-Tiering"], 2,
          "Deep Archive es la clase más económica para retención legal a largo plazo."),
        q("3.5", "¿Qué servicio AWS es una BD NoSQL key-value totalmente serverless con latencia ms?",
          ["Amazon RDS MySQL", "Amazon Aurora", "Amazon DynamoDB", "Amazon Redshift"], 2,
          "DynamoDB es NoSQL key-value gestionado, serverless, latencia de milisegundos."),
        q("3.6", "¿Qué servicio se usa para conectar privadamente un data center on-premise con AWS evitando internet pública?",
          ["Site-to-Site VPN", "AWS Direct Connect", "NAT Gateway", "Internet Gateway"], 1,
          "Direct Connect ofrece conexión privada dedicada con mayor SLA y menor latencia que VPN."),
        q("3.7", "¿Qué servicio es un CDN global con +600 edge locations integrado con WAF y ACM?",
          ["Amazon Route 53", "Amazon CloudFront", "AWS Global Accelerator", "AWS Direct Connect"], 1,
          "CloudFront es el CDN de AWS con red global de edge locations."),
        q("3.8", "Una aplicación necesita desacoplar productor-consumidor con cola persistente hasta 14 días. ¿Qué servicio?",
          ["Amazon SNS", "Amazon SQS", "Amazon Kinesis", "Amazon EventBridge"], 1,
          "SQS es la cola gestionada con retención hasta 14 días."),
        q("3.9", "¿Qué servicio permite consultar datos en S3 con SQL sin cargar a una BD?",
          ["Amazon Redshift", "Amazon Athena", "Amazon RDS", "Amazon EMR"], 1,
          "Athena es serverless y consulta directamente S3 con SQL estándar."),
        q("3.10", "¿Qué servicio AWS sirve para ejecutar contenedores sin gestionar las instancias EC2 subyacentes?",
          ["Amazon ECS con EC2 launch type", "Amazon EKS con node groups", "AWS Fargate", "Amazon EC2 con Docker"], 2,
          "Fargate es el motor serverless de contenedores."),
      ],
      preguntasSimulacro: [],
    },

    // ── DOMINIO 4 ──────────────────────────────────────────────────────────
    {
      orden: 4,
      nombre: "Billing, Pricing and Support",
      descripcion:
        "Modelos de precios, herramientas de gestión de costos y planes de soporte AWS.",
      porcentajeEnExamen: 12,
      video: {
        url: null,
        titulo: "AWS CLF-C02 — Facturación, precios y soporte",
        duracionMin: 38,
        canal: null,
        pendiente: true,
        notas:
          "GRABACIÓN PROPIA NECESARIA. Los videos en español sobre billing AWS suelen ser fragmentados (<20 min) o cubren solo 1-2 herramientas. Conviene grabar uno propio que cubra Free Tier, modelos EC2, Cost Explorer, Budgets, Pricing Calculator y planes de soporte.",
      },
      lecciones: [
        {
          id: "4.1",
          orden: 1,
          titulo: "Modelos de Precios y Capa Gratuita",
          duracionLecturaMin: 7,
          contenidoMarkdown: `Tres principios: pago por uso, paga menos cuando reservas (RI/Savings Plans), paga menos por más uso (tiered).

**Free Tier:** Always Free (1M Lambda req/mes, 25 GB DynamoDB), 12 meses gratis (750h EC2 t2/t3.micro, 5 GB S3, 750h RDS), Trials.

**Modelos EC2:** On-Demand, Reserved (hasta 72 %), Savings Plans (Compute o EC2 Instance), Spot (hasta 90 %), Dedicated Hosts (BYOL), Dedicated Instances, Capacity Reservations.

Transferencia: ingress gratis, egress se cobra. Entre AZ se cobra; misma AZ con IP privada gratis.`,
        },
        {
          id: "4.2",
          orden: 2,
          titulo: "Herramientas de Gestión de Costos",
          duracionLecturaMin: 6,
          contenidoMarkdown: `**Cost Explorer:** histórico 13 m (extendible 38 m), forecast 12 m. **Budgets:** alertas por costo, uso, RI, Savings Plans. **CUR:** reporte detallado a S3.

**Pricing Calculator:** estima ANTES de desplegar. **Billing Conductor:** facturas para resellers. **Cost Anomaly Detection:** ML para gastos anómalos. **Compute Optimizer:** right-sizing. **Trusted Advisor — Cost Optimization.**

**Organizations + Consolidated Billing:** una factura, descuentos por volumen agregados, sharing de RI. Cost Allocation Tags desglosan por proyecto.`,
        },
        {
          id: "4.3",
          orden: 3,
          titulo: "Planes de Soporte y Recursos",
          duracionLecturaMin: 6,
          contenidoMarkdown: `Cinco planes: **Basic** (gratis, solo billing), **Developer** ($29 o 3 %, SLA 24h workflow), **Business** ($100 o 3-10 %, SLA 1h crítica), **Enterprise On-Ramp** ($5,500 o 10 %, SLA 30 min, pool TAM), **Enterprise** ($15,000 o 3-10 %, SLA 15 min, **TAM dedicado**).

Trusted Advisor completo desde Business. Concierge Billing solo en On-Ramp y Enterprise. IEM en On-Ramp (extra) y Enterprise (incluido).

Recursos: Knowledge Center, re:Post, Marketplace, APN, Professional Services, Training and Certification.`,
        },
      ],
      preguntasPractica: [
        q("4.1", "¿Qué herramienta permite estimar el costo de una arquitectura ANTES de desplegarla?",
          ["AWS Cost Explorer", "AWS Budgets", "AWS Pricing Calculator", "AWS Cost and Usage Report"], 2,
          "Pricing Calculator estima costos previos al despliegue."),
        q("4.2", "Una empresa quiere recibir alertas cuando el gasto mensual supere los $5,000. ¿Qué servicio configurar?",
          ["AWS Cost Explorer", "AWS Budgets", "AWS Trusted Advisor", "AWS Pricing Calculator"], 1,
          "Budgets permite crear presupuestos con alertas por SNS/email."),
        q("4.3", "¿Cuál de los siguientes planes de soporte AWS incluye un TAM dedicado?",
          ["Developer", "Business", "Enterprise On-Ramp", "Enterprise"], 3,
          "Solo el plan Enterprise asigna un TAM dedicado."),
        q("4.4", "¿Cuál es el SLA de respuesta para un caso crítico en el plan Business?",
          ["15 minutos", "30 minutos", "1 hora", "4 horas"], 2,
          "Business tiene SLA de 1h para casos críticos."),
        q("4.5", "¿Cuál de los siguientes NO es un beneficio de AWS Organizations con Consolidated Billing?",
          ["Una sola factura para todas las cuentas.", "Descuentos por volumen agregados.", "Compartir Reserved Instances entre cuentas.", "Acceso automático a soporte Enterprise."], 3,
          "Organizations no incluye soporte; el plan se contrata por cuenta de pago."),
        q("4.6", "¿Qué tipo de transferencia generalmente NO se cobra en AWS?",
          ["Salida de EC2 hacia internet", "Transferencia entre regiones", "Entrada de datos hacia AWS desde internet", "Salida de S3 hacia internet"], 2,
          "Ingress (entrada) a AWS suele ser gratis; egress se cobra."),
        q("4.7", "¿Qué modelo de compra EC2 ofrece el mayor descuento (hasta 90 %) a cambio de que AWS pueda terminar la instancia?",
          ["Reserved Instance de 3 años", "Spot Instance", "Savings Plan", "Dedicated Host"], 1,
          "Spot ofrece hasta 90 % descuento pero AWS puede terminar con 2 min de aviso."),
        q("4.8", "¿Qué herramienta visualiza histórico hasta 13 meses con forecast a 12 meses?",
          ["AWS Cost Explorer", "AWS Budgets", "AWS Pricing Calculator", "AWS Trusted Advisor"], 0,
          "Cost Explorer ofrece histórico y forecasting de costos."),
        q("4.9", "¿Cuál de los siguientes planes de soporte AWS es gratuito para todos los clientes?",
          ["Developer", "Basic", "Business", "Enterprise"], 1,
          "Basic es el plan gratuito que incluye documentación, foros y casos de billing."),
        q("4.10", "Una empresa con cuenta nueva quiere maximizar el aprovechamiento de la capa gratuita. ¿Cuál se incluye en los 12 meses gratis?",
          ["100 GB de S3 Standard", "750 horas/mes de EC2 t2.micro o t3.micro", "1 TB de transferencia desde EC2 a internet", "Reserved Instance de 1 año gratis"], 1,
          "Free Tier incluye 750 hrs/mes en EC2 t2/t3.micro durante 12 meses."),
      ],
      preguntasSimulacro: [],
    },
  ],
};

// ── Construcción del banco de simulacro (16/19/22/8 = 65) ───────────────────
//
// Reutilizamos las preguntas de práctica y añadimos las extras del plan
// (S1.11-S1.16, S2.11-S2.19, S3.11-S3.22). Para D4 tomamos las primeras 8
// de práctica como subset del simulacro.

const D1_EXTRAS: PreguntaSimulacro[] = [
  q("S1.11", "¿Cuál de los siguientes servicios de AWS es global y NO requiere selección de región?",
    ["Amazon EC2", "Amazon RDS", "Amazon CloudFront", "Amazon EBS"], 2,
    "CloudFront, IAM, Route 53 y WAF (CloudFront mode) son globales."),
  q("S1.12", "¿Qué pilar del Well-Architected Framework cubre la automatización de cambios y la observabilidad?",
    ["Confiabilidad", "Excelencia operacional", "Seguridad", "Sostenibilidad"], 1,
    "Excelencia operacional cubre automatización, despliegues, observabilidad y mejora continua."),
  q("S1.13", "Una empresa migra una aplicación legacy sin modificar código a una EC2 equivalente. ¿Qué estrategia es?",
    ["Replatform", "Refactor", "Rehost (lift-and-shift)", "Repurchase"], 2,
    "Rehost mueve la carga sin modificar el código."),
  q("S1.14", "¿Qué término describe la capacidad de añadir o quitar recursos automáticamente según la demanda?",
    ["Alta disponibilidad", "Tolerancia a fallos", "Elasticidad", "Durabilidad"], 2,
    "Elasticidad = escalar automáticamente con la demanda."),
  q("S1.15", "¿Cuántas Zonas de Disponibilidad como mínimo tiene una región estándar de AWS?",
    ["1", "2", "3", "6"], 2,
    "Una región estándar tiene al menos 3 AZ físicamente separadas."),
  q("S1.16", "¿Cuál opción describe correctamente una Edge Location?",
    ["Un centro de datos completo de AWS.", "Una réplica de toda una región.", "Un punto de presencia que cachea contenido para CloudFront y Route 53.", "Un servidor on-premise del cliente."], 2,
    "Edge Locations son puntos de presencia globales para CDN y DNS."),
];

const D2_EXTRAS: PreguntaSimulacro[] = [
  q("S2.11", "¿Qué servicio centraliza hallazgos de GuardDuty, Inspector y Macie en un solo dashboard?",
    ["AWS CloudTrail", "AWS Security Hub", "AWS Trusted Advisor", "AWS Config"], 1,
    "Security Hub agrega hallazgos de servicios de seguridad."),
  q("S2.12", "¿Cuál es la diferencia principal entre un Security Group y una Network ACL?",
    ["SG es global; NACL es regional.", "SG es stateful (instancia); NACL es stateless (subred).", "SG bloquea; NACL solo registra.", "No hay diferencia."], 1,
    "SG es stateful y se aplica a instancias; NACL es stateless y se aplica a subredes."),
  q("S2.13", "¿Qué servicio gratuito y automático protege todas las cuentas AWS contra DDoS L3/L4?",
    ["AWS Shield Standard", "AWS Shield Advanced", "AWS WAF", "AWS GuardDuty"], 0,
    "Shield Standard es gratis y automático para todos los clientes."),
  q("S2.14", "¿Cómo se llama el documento JSON que define qué acciones puede ejecutar una identidad IAM?",
    ["Rol", "Grupo", "Política (Policy)", "Perfil"], 2,
    "Las políticas IAM son documentos JSON con Effect, Action, Resource y Condition."),
  q("S2.15", "Una organización con múltiples cuentas necesita restricciones que NINGÚN usuario IAM pueda superar. ¿Qué usar?",
    ["IAM Policies", "Service Control Policies (SCP) en AWS Organizations", "Network ACLs", "Trust Policies"], 1,
    "Las SCP en AWS Organizations limitan los permisos máximos posibles."),
  q("S2.16", "¿Qué servicio audita y registra TODAS las llamadas API en una cuenta AWS?",
    ["Amazon CloudWatch", "AWS Config", "AWS CloudTrail", "Amazon Inspector"], 2,
    "CloudTrail registra quién, qué, cuándo y desde dónde se invocaron las APIs."),
  q("S2.17", "¿Qué servicio evalúa vulnerabilidades en EC2, contenedores ECR y funciones Lambda?",
    ["Amazon Inspector", "Amazon Macie", "AWS WAF", "AWS Config"], 0,
    "Inspector evalúa vulnerabilidades CVE en EC2, ECR y Lambda."),
  q("S2.18", "¿Cuál es el servicio recomendado para almacenar y rotar automáticamente credenciales de RDS?",
    ["AWS KMS", "AWS Secrets Manager", "Parameter Store sin SecureString", "Amazon S3"], 1,
    "Secrets Manager soporta rotación nativa para RDS, Redshift y DocumentDB."),
  q("S2.19", "¿Cómo puede un cliente verificar la conformidad SOC 2 de AWS para presentar a sus auditores?",
    ["Solicitar visita al data center.", "Descargar el reporte SOC 2 desde AWS Artifact.", "Comprar suscripción Enterprise.", "Pedir llamada al equipo de ventas."], 1,
    "AWS Artifact ofrece descarga gratuita de reportes SOC, ISO y PCI."),
];

const D3_EXTRAS: PreguntaSimulacro[] = [
  q("S3.11", "¿Qué servicio AWS gestiona Kubernetes administrado?",
    ["Amazon ECS", "Amazon EKS", "AWS Lambda", "AWS Batch"], 1,
    "EKS = Elastic Kubernetes Service, Kubernetes administrado por AWS."),
  q("S3.12", "¿Qué clase de almacenamiento S3 mueve objetos automáticamente entre tiers según patrones de acceso?",
    ["S3 Standard", "S3 One Zone-IA", "S3 Intelligent-Tiering", "S3 Glacier Deep Archive"], 2,
    "Intelligent-Tiering optimiza costos automáticamente."),
  q("S3.13", "Una aplicación necesita compartir un sistema de archivos NFS entre múltiples EC2 Linux. ¿Qué servicio?",
    ["Amazon EBS", "Amazon EFS", "Amazon S3", "FSx for Windows"], 1,
    "EFS es NFS administrado, multi-AZ y multi-instancia para Linux."),
  q("S3.14", "¿Qué servicio RDS-compatible es propietario de AWS y replica almacenamiento entre 3 AZ?",
    ["Amazon Aurora", "Amazon DynamoDB", "Amazon DocumentDB", "Amazon Redshift"], 0,
    "Aurora es la BD propietaria de AWS, hasta 5x más rápida que MySQL."),
  q("S3.15", "¿Qué servicio se usa para data warehousing a escala de petabytes?",
    ["Amazon RDS", "Amazon Redshift", "Amazon Athena", "Amazon ElastiCache"], 1,
    "Redshift es el data warehouse columnar petabyte-scale."),
  q("S3.16", "¿Qué servicio permite migrar 80 TB de un data center on-premise a AWS por envío físico?",
    ["AWS DataSync", "AWS Snowball Edge", "AWS Direct Connect", "AWS Storage Gateway"], 1,
    "Snowball Edge soporta hasta 80 TB para migración física."),
  q("S3.17", "¿Qué tipo de Load Balancer opera en capa 7 (HTTP/HTTPS) y permite routing por path o host?",
    ["NLB", "ALB", "GLB", "Classic Load Balancer"], 1,
    "ALB opera en capa 7 con routing por path/host."),
  q("S3.18", "¿Qué servicio usar para enviar notificaciones pub/sub a múltiples destinos (SQS, Lambda, email, SMS)?",
    ["Amazon SQS", "Amazon SNS", "AWS Step Functions", "AWS Batch"], 1,
    "SNS es pub/sub gestionado con fan-out."),
  q("S3.19", "¿Qué servicio orquesta workflows de múltiples pasos con state machines?",
    ["Amazon EventBridge", "Amazon SQS", "AWS Step Functions", "AWS Lambda"], 2,
    "Step Functions usa state machines para orquestar flujos serverless."),
  q("S3.20", "¿Qué servicio AWS ofrece reconocimiento de imágenes y video con ML pre-entrenado?",
    ["Amazon Comprehend", "Amazon Polly", "Amazon Rekognition", "Amazon Lex"], 2,
    "Rekognition ofrece detección de objetos, caras y moderación."),
  q("S3.21", "¿Qué servicio permite ejecutar tareas en lotes a gran escala con orquestación gestionada?",
    ["AWS Lambda", "AWS Batch", "Amazon ECS", "AWS Glue"], 1,
    "AWS Batch orquesta jobs batch usando Fargate o EC2."),
  q("S3.22", "¿Qué tipo de VPC Endpoint se usa SIN costo adicional y aplica routing privado a S3 y DynamoDB?",
    ["Interface Endpoint (PrivateLink)", "Gateway Endpoint", "NAT Gateway", "Internet Gateway"], 1,
    "Gateway Endpoint es gratuito y solo aplica a S3 y DynamoDB."),
];

// Llenar simulacro: 10 práctica + 6 extras = 16 D1; 10 + 9 = 19 D2; 10 + 12 = 22 D3; primeras 8 práctica = 8 D4.
awsCloudPractitionerData.dominios[0].preguntasSimulacro = [
  ...awsCloudPractitionerData.dominios[0].preguntasPractica,
  ...D1_EXTRAS,
];
awsCloudPractitionerData.dominios[1].preguntasSimulacro = [
  ...awsCloudPractitionerData.dominios[1].preguntasPractica,
  ...D2_EXTRAS,
];
awsCloudPractitionerData.dominios[2].preguntasSimulacro = [
  ...awsCloudPractitionerData.dominios[2].preguntasPractica,
  ...D3_EXTRAS,
];
awsCloudPractitionerData.dominios[3].preguntasSimulacro =
  awsCloudPractitionerData.dominios[3].preguntasPractica.slice(0, 8);

// ── Lookup por slug ─────────────────────────────────────────────────────────

export const certificacionesData: Record<string, CertificacionData> = {
  "aws-cloud-practitioner": awsCloudPractitionerData,
};

export function getCertificacionData(slug: string): CertificacionData | null {
  return certificacionesData[slug] ?? null;
}
