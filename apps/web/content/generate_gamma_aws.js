#!/usr/bin/env node
/**
 * generate_gamma_aws.js
 *
 * Genera 4 presentaciones Gamma (1 por dominio) para AWS Cloud Practitioner
 * (CLF-C02). Endpoint: POST /generations -> poll GET /generations/{id} hasta
 * completed. Guarda resultados en content/aws_gamma_urls.json.
 *
 * Run: node content/generate_gamma_aws.js
 *
 * Plan fuente:
 *   /DEPARTAMENTOS/08_TECNOLOGIA_INNOVACION/ESTANDARIZACION_MODULOS/
 *     CERTIFICACIONES/AWS_CLOUD_PRACTITIONER.md
 */

const fs   = require('fs');
const path = require('path');

const GAMMA_KEY  = process.env.GAMMA_API_KEY
                 || 'sk-gamma-i1QpwB075C7XJzrB37YkUOCybMnM6FswKcmxbpH8g';
const GAMMA_BASE = 'https://public-api.gamma.app/v1.0';

const GAMMA_HEADERS = {
  'X-API-KEY':    GAMMA_KEY,
  'Content-Type': 'application/json',
};

// ── 4 presentaciones — 1 por dominio del CLF-C02 ────────────────────────────

const PRESENTATIONS = [
  {
    domainOrden: 1,
    title: 'AWS CLF-C02 Dominio 1 — Cloud Concepts',
    inputText: `# Cloud Concepts (24 % del examen CLF-C02)
## AWS Cloud Practitioner — Dominio 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás en este dominio
Al finalizar serás capaz de:
- Definir cloud computing y los seis beneficios oficiales de AWS
- Aplicar los seis pilares del AWS Well-Architected Framework
- Explicar el modelo de responsabilidad compartida
- Reconocer las 6 R's de migración a la nube
- Diferenciar IaaS, PaaS y SaaS y los modelos de despliegue

## Slide 2 — Qué es Cloud Computing
Entrega bajo demanda de cómputo, almacenamiento, bases de datos, red y aplicaciones a través de internet, con modelo de pago por uso.

En lugar de comprar servidores físicos, accedes a recursos operados por AWS en una red global de centros de datos.

Definición CLF-C02: "On-demand delivery of IT resources via internet with pay-as-you-go pricing."

## Slide 3 — Los 6 beneficios oficiales de AWS
1. Cambiar gasto fijo (CapEx) por gasto variable (OpEx)
2. Beneficiarse de economías de escala masivas
3. Dejar de adivinar la capacidad
4. Aumentar velocidad y agilidad — recursos en minutos
5. Dejar de gastar en operar y mantener data centers
6. Volverse global en minutos

Estos seis beneficios caen literal en el examen. Memorízalos.

## Slide 4 — Modelos de servicio: IaaS, PaaS, SaaS
- IaaS (Infraestructura): tú gestionas SO y aplicaciones. Ejemplo: Amazon EC2
- PaaS (Plataforma): AWS gestiona la infraestructura, tú subes el código. Ejemplo: Elastic Beanstalk
- SaaS (Software): el proveedor gestiona todo. Ejemplo: Amazon WorkMail

Modelos de despliegue: nube pública, híbrida (Direct Connect / VPN) y on-premise / privada.

## Slide 5 — Well-Architected Framework: 6 pilares
1. Excelencia operacional — automatización, observabilidad, mejora continua
2. Seguridad — IAM, CloudTrail, defensa en capas
3. Confiabilidad — recuperarse de fallos, Multi-AZ
4. Eficiencia del rendimiento — usar el recurso correcto
5. Optimización de costos — right-sizing, RI, Spot, Cost Explorer
6. Sostenibilidad (añadido en 2021) — minimizar impacto ambiental

Memoriza la sigla OS-CRES (Operacional, Seguridad, Confiabilidad, Rendimiento, Costos, Sostenibilidad).

## Slide 6 — Modelo de Responsabilidad Compartida
AWS = seguridad DE la nube: hardware, red global, virtualización, regiones, AZ, edificios físicos.

Cliente = seguridad EN la nube: datos, configuración del SO, parches del SO invitado, IAM, firewalls de aplicación, encriptación del lado del cliente.

En servicios administrados (S3, RDS, Lambda) AWS asume más responsabilidad, pero el cliente nunca pierde control sobre datos, permisos y clasificación.

## Slide 7 — Las 6 R's de migración
- Rehost — lift and shift, mover sin cambios
- Replatform — mover y optimizar levemente
- Repurchase — cambiar por SaaS comercial
- Refactor / Re-architect — rediseñar nube nativa
- Retire — apagar lo que no se usa
- Retain — dejar on-premise por ahora

AWS Cloud Adoption Framework (CAF): negocio, gente, gobernanza, plataforma, seguridad y operaciones.

## Slide 8 — Conceptos clave del examen
- Alta disponibilidad — redundancia entre AZ
- Tolerancia a fallos — el sistema sigue operando ante una falla
- Escalabilidad vertical (scale up) vs horizontal (scale out)
- Elasticidad — escalar automáticamente con la demanda
- Acoplamiento débil — SQS, SNS para sistemas resilientes

Las preguntas tipo "qué pilar aborda este escenario" son comunes. No confundas Confiabilidad con Eficiencia.

## Slide 9 — Resumen y siguiente dominio
Has completado el Dominio 1: Cloud Concepts (24 % del examen).

Próximo: Dominio 2 — Security and Compliance (30 %) — el dominio con más peso después de Servicios.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    domainOrden: 2,
    title: 'AWS CLF-C02 Dominio 2 — Security and Compliance',
    inputText: `# Security and Compliance (30 % del examen CLF-C02)
## AWS Cloud Practitioner — Dominio 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás en este dominio
- Componentes de IAM y mejores prácticas de seguridad
- Servicios de detección, monitoreo y protección de red
- Cumplimiento normativo y AWS Artifact
- Encriptación en reposo y en tránsito
- Identidades federadas y seguridad de datos

## Slide 2 — IAM: Identity and Access Management
Servicio gratuito y global. Componentes:
- Usuarios — personas o servicios con credenciales propias
- Grupos — colecciones de usuarios
- Roles — identidades temporales asumidas via STS
- Políticas — documentos JSON con Effect, Action, Resource, Condition

Por defecto IAM niega todo (implicit deny). Un deny explícito siempre gana sobre un allow.

## Slide 3 — Mejores prácticas IAM (caen en el examen)
1. No usar la cuenta raíz (root) para operaciones diarias
2. Activar MFA en root y usuarios privilegiados
3. Aplicar el principio de menor privilegio
4. Rotar credenciales regularmente
5. Usar roles en lugar de access keys en código
6. Asignar permisos vía grupos, no usuarios
7. Habilitar CloudTrail para auditar todas las llamadas API

AWS Organizations + SCP limitan permisos máximos en cuentas miembro.

## Slide 4 — Protección de red y aplicación
- AWS WAF — firewall de aplicaciones web (SQLi, XSS) en CloudFront, ALB, API Gateway
- AWS Shield Standard — gratis, automático, DDoS L3/L4
- AWS Shield Advanced — $3,000/mes, DRT y protecciones avanzadas
- Security Groups — firewall stateful a nivel de instancia
- Network ACLs — firewall stateless a nivel de subred

## Slide 5 — Detección y monitoreo
- Amazon GuardDuty — detección inteligente de amenazas con ML
- Amazon Inspector — vulnerabilidades en EC2, ECR y Lambda
- Amazon Macie — descubre PII en S3 con ML
- AWS Security Hub — agregador central de hallazgos
- AWS CloudTrail — registra TODAS las llamadas API
- AWS Config — monitorea configuración y evalúa cumplimiento
- AWS Trusted Advisor — recomendaciones en 5 categorías

## Slide 6 — Cumplimiento y AWS Artifact
AWS opera bajo SOC 1/2/3, ISO 27001, PCI DSS, HIPAA, GDPR, FedRAMP, CSA STAR, NIST.

AWS Artifact = portal de autoservicio para descargar reportes de auditoría y acuerdos legales (BAA, DPA).

AWS Audit Manager automatiza recolección de evidencia continua.

Soberanía de datos: el cliente elige la región. AWS no mueve datos entre regiones sin permiso.

## Slide 7 — Encriptación
En reposo:
- S3: SSE-S3, SSE-KMS, SSE-C
- EBS: AES-256 al activar
- RDS: nativa con KMS

En tránsito: TLS/SSL en endpoints públicos. ACM emite certificados gratis para CloudFront y ALB.

Servicios de gestión de claves:
- AWS KMS — claves gestionadas, integradas con servicios AWS
- AWS CloudHSM — HSM dedicado, FIPS 140-2 nivel 3
- AWS Secrets Manager — rotación automática de credenciales RDS

## Slide 8 — Identidades federadas
En lugar de crear usuarios IAM por empleado, federar:
- SAML 2.0 — Active Directory, Okta
- OIDC — Google Workspace, Microsoft Entra
- Amazon Cognito — User Pools (registro/login) e Identity Pools (acceso AWS)
- AWS Directory Service — AD administrado integrado con Microsoft AD

AWS Abuse Team contacta para reportar abuso desde recursos AWS (spam, phishing).

## Slide 9 — Resumen y siguiente dominio
Has completado el Dominio 2: Security and Compliance (30 % del examen).

Próximo: Dominio 3 — Cloud Technology and Services (34 %) — el dominio con mayor peso del examen.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    domainOrden: 3,
    title: 'AWS CLF-C02 Dominio 3 — Cloud Technology and Services',
    inputText: `# Cloud Technology and Services (34 % del examen CLF-C02)
## AWS Cloud Practitioner — Dominio 3
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás en este dominio
- Infraestructura global de AWS y servicios de cómputo
- Tipos de almacenamiento: objetos, bloques y archivos
- Bases de datos relacionales, NoSQL y analítica
- Redes, VPC y conectividad híbrida
- Mensajería, integración y servicios ML/IA

## Slide 2 — Infraestructura global
- Regiones — más de 33 globales, aisladas
- Zonas de Disponibilidad (AZ) — al menos 3 por región
- Edge Locations — más de 600, para CloudFront y Route 53
- Local Zones / Wavelength — ultra baja latencia y 5G

El cliente elige la región según latencia, costo y cumplimiento. Los datos NO se mueven entre regiones automáticamente.

## Slide 3 — Cómputo
- Amazon EC2 — VMs con familias T, M, C, R, I, G/P
- Modelos de compra: On-Demand, Reserved (hasta 72 % desc.), Savings Plans, Spot (hasta 90 %), Dedicated Hosts
- AWS Lambda — serverless, paga por invocación + duración, hasta 15 min
- AWS Elastic Beanstalk — PaaS para apps web
- ECS / EKS / Fargate — contenedores; Fargate = serverless
- AWS Batch — jobs batch a gran escala
- AWS Outposts — racks AWS on-premise

## Slide 4 — Almacenamiento de objetos: S3
Durabilidad 99.999999999 % (11 nueves). Disponibilidad 99.99 %.

Clases (clave para el examen):
- S3 Standard — acceso frecuente
- S3 Intelligent-Tiering — mueve entre tiers automáticamente
- S3 Standard-IA / One Zone-IA — acceso poco frecuente
- S3 Glacier Instant / Flexible Retrieval — archivos
- S3 Glacier Deep Archive — el más barato, 12h, retención legal

Lifecycle policies, Versioning, MFA Delete y Object Lock (WORM).

## Slide 5 — EBS, EFS, FSx y migración
- Amazon EBS — bloques para EC2; tipos gp3, io2, st1, sc1; específico de UNA AZ
- Amazon EFS — NFS administrado, multi-AZ, multi-instancia (Linux)
- FSx for Windows / Lustre — SMB y HPC
- AWS Storage Gateway — conecta on-premise con AWS

Migración masiva: Snowcone (8 TB), Snowball Edge (80 TB), Snowmobile (100 PB en camión). DataSync para sync online.

## Slide 6 — Bases de datos
Relacionales:
- Amazon RDS — MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora
- Multi-AZ para alta disponibilidad; Read Replicas para escalar lecturas
- Amazon Aurora — propietario, hasta 5x más rápido, 6 copias en 3 AZ

NoSQL y especializadas:
- DynamoDB — key-value, latencia ms, serverless. DAX = caché microsegundos
- ElastiCache (Redis/Memcached), Neptune (grafos), DocumentDB, Keyspaces, Timestream, QLDB
- Amazon Redshift — data warehouse petabyte-scale

Analítica: Athena (SQL sobre S3), EMR (Hadoop/Spark), Glue (ETL serverless), Kinesis (streaming), QuickSight (BI), Lake Formation.

## Slide 7 — Redes y CDN
Amazon VPC: subredes públicas/privadas, Internet Gateway, NAT Gateway, Route Tables, SG, NACL, VPC Peering, Transit Gateway, VPC Endpoints (Gateway gratis para S3/DynamoDB; Interface PrivateLink).

Conectividad híbrida: Direct Connect (privado, dedicado), Site-to-Site VPN, Client VPN.

DNS y CDN: Route 53 (DNS global con health checks), CloudFront (CDN, +600 edge locations), Global Accelerator (anycast IP).

Balanceo: ALB (HTTP/HTTPS L7), NLB (TCP/UDP L4), GLB (appliances). Auto Scaling Groups.

## Slide 8 — Mensajería, integración, IoT y ML
Mensajería:
- Amazon SQS — cola, hasta 14 días retención, FIFO o estándar
- Amazon SNS — pub/sub a SQS, Lambda, HTTP, email, SMS
- Amazon EventBridge — bus de eventos serverless
- AWS Step Functions — workflows con state machines
- Amazon MQ — RabbitMQ/ActiveMQ administrado

IoT: AWS IoT Core, Greengrass.

ML/IA: SageMaker (end-to-end), Rekognition (visión), Polly (TTS), Transcribe (STT), Comprehend (NLP), Translate, Lex (chatbots), Bedrock (LLMs gestionados).

## Slide 9 — Resumen y siguiente dominio
Has completado el Dominio 3: Cloud Technology and Services (34 % — el de mayor peso).

Próximo: Dominio 4 — Billing, Pricing and Support (12 %) — el último dominio antes del simulacro completo.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    domainOrden: 4,
    title: 'AWS CLF-C02 Dominio 4 — Billing, Pricing and Support',
    inputText: `# Billing, Pricing and Support (12 % del examen CLF-C02)
## AWS Cloud Practitioner — Dominio 4
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás en este dominio
- Tres principios fundamentales de precios de AWS
- Capa gratuita (Free Tier) y modelos de compra EC2
- Herramientas de gestión de costos y consolidated billing
- Cinco planes de soporte y sus diferencias
- Recursos adicionales del ecosistema AWS

## Slide 2 — Tres principios de precios
1. Pago por uso — sin contratos largos
2. Paga menos cuando reservas — RI y Savings Plans con descuento por compromiso (1 o 3 años)
3. Paga menos por más uso — tiered pricing en S3 y data transfer

Capa gratuita (AWS Free Tier):
- Always Free — 1M solicitudes Lambda/mes, 25 GB DynamoDB
- 12 meses gratis — 750 hrs/mes EC2 t2/t3.micro, 5 GB S3 Standard
- Trials — Inspector, Redshift y otros

## Slide 3 — Modelos de compra EC2
- On-Demand — máxima flexibilidad, paga por hora/segundo
- Reserved Instances — hasta 72 % desc., compromiso 1 o 3 años
- Savings Plans — compromiso de $/hora; Compute (EC2+Fargate+Lambda) o EC2 Instance
- Spot — hasta 90 % desc., AWS puede terminar con 2 min de aviso
- Dedicated Hosts — servidor físico exclusivo (BYOL)
- Dedicated Instances — hardware exclusivo sin acceso al servidor
- Capacity Reservations — garantizan capacidad sin descuento

## Slide 4 — Costos de transferencia de datos
- Ingress (entrada) a AWS — generalmente GRATIS
- Egress (salida) a internet — SE COBRA
- Entre AZ del mismo región — generalmente se cobra
- Entre regiones — se cobra
- Misma AZ con IP privada — generalmente gratis

Pregunta típica del examen: "¿Qué transferencia NO se cobra?" — respuesta: ingress a AWS.

## Slide 5 — Herramientas de gestión de costos
- AWS Cost Explorer — histórico 13 meses (extendible 38 m), forecast 12 meses
- AWS Budgets — alertas por costo, uso, RI, Savings Plans
- AWS Cost and Usage Report (CUR) — reporte detallado a S3
- AWS Pricing Calculator — estima ANTES de desplegar
- AWS Cost Anomaly Detection — ML detecta gastos anómalos
- AWS Compute Optimizer — recomienda right-sizing
- AWS Trusted Advisor — categoría Cost Optimization

## Slide 6 — AWS Organizations y Consolidated Billing
Una sola factura para múltiples cuentas con descuentos por volumen agregados.

Comparte RI / Savings Plans entre cuentas de la organización.

Cuenta de pago (management) y cuentas miembro (linked).

Cost Allocation Tags (activadas en Billing Console) desglosan por proyecto, departamento o aplicación. Hay tags AWS-generated y user-defined.

## Slide 7 — Cinco planes de soporte
- Basic — gratis, solo billing, sin SLA
- Developer — $29 o 3 % uso, 1 contacto, SLA 24h workflow
- Business — $100 o 3-10 %, contactos ilimitados, SLA 1h crítica
- Enterprise On-Ramp — $5,500 o 10 %, SLA 30 min, pool de TAMs
- Enterprise — $15,000 o 3-10 %, SLA 15 min, TAM dedicado

Datos clave: TAM dedicado SOLO en Enterprise. Concierge Billing en On-Ramp y Enterprise. Trusted Advisor completo solo desde Business.

## Slide 8 — Recursos del ecosistema AWS
- AWS Knowledge Center — preguntas frecuentes
- AWS re:Post — comunidad oficial (sucesor de Forums)
- AWS Marketplace — software de terceros con facturación AWS
- AWS Partner Network (APN) — Consulting Partners e ISV
- AWS Professional Services — consultoría oficial
- AWS Training and Certification — Skill Builder, certificaciones
- AWS Health Dashboard — eventos que afectan tu cuenta
- AWS Service Health Dashboard — estado público de servicios

## Slide 9 — Cierre del programa AWS Cloud Practitioner
Has completado los 4 dominios del CLF-C02:
1. Cloud Concepts (24 %)
2. Security and Compliance (30 %)
3. Cloud Technology and Services (34 %)
4. Billing, Pricing and Support (12 %)

Siguiente paso: simulacro completo — 65 preguntas, 90 min, 70 % aprobación.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function createGeneration(inputText) {
  const res = await fetch(`${GAMMA_BASE}/generations`, {
    method: 'POST',
    headers: GAMMA_HEADERS,
    body: JSON.stringify({
      inputText,
      textMode: 'preserve',
      format: 'presentation',
      numCards: 9,
      additionalInstructions:
        'Use ITSEIA brand Navy #1F2F58, Yellow #FBBC0C, AWS Orange #FF9900. ' +
        'Modern professional educational style. Spanish language. ' +
        'Highlight AWS service names in monospace where appropriate.',
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gamma POST failed: ${res.status} ${txt}`);
  }

  const data = await res.json();
  return data.generationId;
}

async function pollGeneration(generationId, maxWaitMs = 5 * 60 * 1000) {
  const start = Date.now();
  let lastStatus = '';

  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(`${GAMMA_BASE}/generations/${generationId}`, {
      headers: { 'X-API-KEY': GAMMA_KEY },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Gamma poll failed: ${res.status} ${txt}`);
    }

    const data = await res.json();
    if (data.status !== lastStatus) {
      console.log(`    status: ${data.status}`);
      lastStatus = data.status;
    }

    if (data.status === 'completed') {
      return { gammaUrl: data.gammaUrl, exportUrl: data.exportUrl };
    }
    if (data.status === 'failed') {
      throw new Error(`Gamma generation failed: ${JSON.stringify(data)}`);
    }

    await sleep(5000);
  }

  throw new Error(`Gamma generation timed out after ${maxWaitMs}ms`);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Generando 4 presentaciones Gamma — AWS Cloud Practitioner ===');
  console.log(`Inicio: ${new Date().toISOString()}\n`);

  const outputPath = path.join(__dirname, 'aws_gamma_urls.json');
  const results    = [];

  // Cargar progreso previo para idempotencia
  let prevResults = [];
  if (fs.existsSync(outputPath)) {
    try {
      prevResults = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log(`Cargados ${prevResults.length} resultados previos.\n`);
    } catch (_) { /* ignore */ }
  }

  for (let i = 0; i < PRESENTATIONS.length; i++) {
    const pres = PRESENTATIONS[i];
    console.log(`[${i + 1}/${PRESENTATIONS.length}] D${pres.domainOrden}: ${pres.title}`);

    const prev = prevResults.find(
      r => r.domainOrden === pres.domainOrden && r.gammaUrl
    );
    if (prev) {
      console.log(`    YA GENERADO. Skip. URL: ${prev.gammaUrl}\n`);
      results.push(prev);
      continue;
    }

    try {
      console.log('    POST /generations...');
      const generationId = await createGeneration(pres.inputText);
      console.log(`    generationId: ${generationId}`);

      console.log('    Esperando completacion (max 5 min)...');
      const { gammaUrl, exportUrl } = await pollGeneration(generationId);

      console.log(`    gammaUrl:  ${gammaUrl}`);
      console.log(`    exportUrl: ${exportUrl || '(no PDF)'}\n`);

      const result = {
        domainOrden:  pres.domainOrden,
        title:        pres.title,
        gammaUrl,
        exportUrl:    exportUrl || null,
        generationId,
        generatedAt:  new Date().toISOString(),
      };
      results.push(result);

      // Persistir progreso parcial
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

      if (i < PRESENTATIONS.length - 1) {
        console.log('    (Pausa 3s...)\n');
        await sleep(3000);
      }
    } catch (err) {
      console.error(`    ERROR: ${err.message}\n`);
      results.push({
        domainOrden: pres.domainOrden,
        title:       pres.title,
        error:       err.message,
      });
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    }
  }

  // ── Reporte final ─────────────────────────────────────────────────────────
  console.log('\n=== REPORTE FINAL ===');
  console.log(`Fin: ${new Date().toISOString()}\n`);

  let ok = 0, errors = 0;
  for (const r of results) {
    const mark = r.gammaUrl ? 'OK   ' : 'ERROR';
    console.log(`[${mark}] D${r.domainOrden}: ${r.title}`);
    if (r.gammaUrl) {
      console.log(`        URL: ${r.gammaUrl}`);
      ok++;
    } else {
      console.log(`        Error: ${r.error}`);
      errors++;
    }
  }

  console.log(`\nResumen: ${ok} OK, ${errors} errores`);
  console.log(`Guardado en: ${outputPath}`);

  if (errors > 0) process.exit(1);
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
