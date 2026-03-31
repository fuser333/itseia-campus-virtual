# Ejercicio Sesion 6: Infraestructura como Codigo (IaC)

**Materia:** Data Engineering Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Aplicar Infrastructure as Code (IaC) para el ecosistema de datos: Terraform para provisionar AWS (S3, Glue, Redshift, IAM), Docker Compose para desarrollo local, y GitOps para despliegue automatico de pipelines de datos en Ecuador.

## Contexto

Un data engineer en 2024 no configura servidores manualmente — usa codigo para definir la infraestructura. Cuando el IESS necesita un nuevo ambiente de datos, un solo `terraform apply` crea todos los recursos: S3 buckets, IAM roles, Glue jobs, y Redshift cluster — en 5 minutos y reproducible en cualquier region. IaC es la diferencia entre "funciona en mi cuenta" y "infraestructura auditada y reproducible".

## Instrucciones

1. Crea el archivo `sesion06_iac_terraform_ecuador.py`:

```python
# IaC + Terraform - ITSEIA
# Data Engineering Avanzado
# Infraestructura data lake Ecuador como codigo

import json
import os
from datetime import datetime
import warnings
warnings.filterwarnings("ignore")

print("=" * 65)
print("INFRASTRUCTURE AS CODE — DATA LAKE ECUADOR")
print("=" * 65)

# ================================================
# COMPARACION: MANUAL vs IaC
# ================================================
print("\n--- MANUAL vs INFRASTRUCTURE AS CODE ---")

comparacion = {
    "Configuracion manual": {
        "tiempo":    "8+ horas por ambiente",
        "errores":   "Alta — human error, pasos omitidos",
        "reproducir":"Imposible — 'funciona en mi cuenta'",
        "auditar":   "Sin trazabilidad — quien hizo que y cuando",
        "rollback":  "Manual y riesgoso",
        "escala":    "No escala — cuello de botella humano",
    },
    "IaC (Terraform)": {
        "tiempo":    "5 min por ambiente (terraform apply)",
        "errores":   "Baja — codigo revisado en PR",
        "reproducir":"Identico en dev/stg/prod con variables",
        "auditar":   "Git history — cada cambio con autor y razon",
        "rollback":  "terraform destroy o revert del PR",
        "escala":    "1 engineer maneja N ambientes",
    },
}

for tipo, info in comparacion.items():
    print(f"\n  [{tipo}]")
    for k, v in info.items():
        print(f"    {k:<12}: {v}")

# ================================================
# TERRAFORM: CODIGO GENERADO (Python → HCL)
# ================================================
print("\n--- GENERADOR DE TERRAFORM HCL ---")

class TerraformGenerator:
    """Genera archivos Terraform HCL para data lake Ecuador."""

    def __init__(self, nombre_proyecto, ambiente, region="us-east-1"):
        self.proyecto = nombre_proyecto
        self.ambiente = ambiente
        self.region = region
        self.recursos = {}

    def agregar_s3_bucket(self, nombre_bucket, zonas=["raw","curated","analytics"]):
        """Genera recurso S3 bucket con lifecycle policies."""
        self.recursos[f"s3_{nombre_bucket}"] = f"""
resource "aws_s3_bucket" "{nombre_bucket}_{self.ambiente}" {{
  bucket = "{nombre_bucket}-{self.ambiente}"

  tags = {{
    Project     = "{self.proyecto}"
    Environment = "{self.ambiente}"
    ManagedBy   = "Terraform"
    Owner       = "data-team@itseia.ai"
  }}
}}

resource "aws_s3_bucket_versioning" "{nombre_bucket}_{self.ambiente}" {{
  bucket = aws_s3_bucket.{nombre_bucket}_{self.ambiente}.id
  versioning_configuration {{
    status = "Enabled"
  }}
}}

resource "aws_s3_bucket_lifecycle_configuration" "{nombre_bucket}_{self.ambiente}" {{
  bucket = aws_s3_bucket.{nombre_bucket}_{self.ambiente}.id

  rule {{
    id = "raw-transition"
    filter {{ prefix = "raw/" }}
    status = "Enabled"
    transition {{
      days          = 30
      storage_class = "STANDARD_IA"
    }}
    transition {{
      days          = 365
      storage_class = "GLACIER"
    }}
    expiration {{
      days = 2555  # 7 años (retención SRI Ecuador)
    }}
  }}

  rule {{
    id = "analytics-expiration"
    filter {{ prefix = "analytics/" }}
    status = "Enabled"
    expiration {{ days = 730 }}  # 2 años
  }}
}}
"""
        return self

    def agregar_iam_role(self, nombre_role, politicas):
        """Genera IAM role con politicas minimo privilegio."""
        self.recursos[f"iam_{nombre_role}"] = f"""
resource "aws_iam_role" "{nombre_role}" {{
  name = "{nombre_role}-{self.ambiente}"

  assume_role_policy = jsonencode({{
    Version = "2012-10-17"
    Statement = [{{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {{
        Service = "glue.amazonaws.com"
      }}
    }}]
  }})

  tags = {{
    Environment = "{self.ambiente}"
    ManagedBy   = "Terraform"
  }}
}}

{chr(10).join([f'''resource "aws_iam_role_policy_attachment" "{nombre_role}_{p.replace('/', '_')}" {{
  role       = aws_iam_role.{nombre_role}.name
  policy_arn = "arn:aws:iam::aws:policy/{p}"
}}''' for p in politicas])}
"""
        return self

    def agregar_glue_job(self, nombre_job, script_s3_path, workers=2):
        """Genera Glue ETL Job."""
        self.recursos[f"glue_{nombre_job}"] = f"""
resource "aws_glue_job" "{nombre_job}_{self.ambiente}" {{
  name         = "{nombre_job}-{self.ambiente}"
  role_arn     = aws_iam_role.glue_role_{self.ambiente}.arn
  glue_version = "4.0"

  command {{
    script_location = "{script_s3_path}"
    python_version  = "3"
  }}

  default_arguments = {{
    "--job-language"      = "python"
    "--enable-metrics"    = "true"
    "--enable-spark-ui"   = "true"
    "--environment"       = "{self.ambiente}"
    "--TempDir"           = "s3://ecuador-datalake-{self.ambiente}/tmp/"
  }}

  number_of_workers = {workers}
  worker_type       = "G.1X"

  tags = {{
    Environment = "{self.ambiente}"
    ManagedBy   = "Terraform"
  }}
}}
"""
        return self

    def generar_variables_tf(self):
        """Genera variables.tf para parametrizacion."""
        return f"""
# variables.tf — Data Lake Ecuador
variable "ambiente" {{
  description = "Ambiente de despliegue"
  type        = string
  default     = "{self.ambiente}"
  validation {{
    condition     = contains(["dev","stg","prod"], var.ambiente)
    error_message = "Ambiente debe ser dev, stg o prod."
  }}
}}

variable "proyecto" {{
  type    = string
  default = "{self.proyecto}"
}}

variable "region_aws" {{
  type    = string
  default = "{self.region}"
}}

variable "equipo_email" {{
  type    = string
  default = "data-team@itseia.ai"
  sensitive = true
}}
"""

    def generar_outputs_tf(self, nombre_bucket):
        return f"""
# outputs.tf
output "s3_bucket_arn" {{
  value = aws_s3_bucket.{nombre_bucket}_{self.ambiente}.arn
}}

output "s3_bucket_url" {{
  value = "s3://${{aws_s3_bucket.{nombre_bucket}_{self.ambiente}.id}}/"
}}

output "glue_job_name" {{
  value = aws_glue_job.etl_ventas_{self.ambiente}.name
}}
"""

    def generar(self):
        """Genera todos los archivos Terraform."""
        archivos = {
            "main.tf":      "\n".join(self.recursos.values()),
            "variables.tf": self.generar_variables_tf(),
            "outputs.tf":   self.generar_outputs_tf("ecuador_datalake"),
        }
        return archivos


# Generar para ambiente de produccion
gen = TerraformGenerator("iess-datalake-ecuador", "prod")
gen.agregar_s3_bucket("ecuador-datalake") \
   .agregar_iam_role("glue_role", ["service-role/AWSGlueServiceRole",
                                    "AmazonS3FullAccess"]) \
   .agregar_glue_job("etl_ventas",
                      "s3://ecuador-datalake-prod/scripts/etl_ventas.py",
                      workers=4)

archivos_tf = gen.generar()

print("  Archivos Terraform generados:")
for archivo, contenido in archivos_tf.items():
    lineas = len(contenido.split("\n"))
    print(f"  {archivo:<20}: {lineas} lineas")

print(f"\n  Ejemplo main.tf (primeras 30 lineas):")
main_preview = archivos_tf["main.tf"].split("\n")[:30]
for l in main_preview:
    print(f"    {l}")

# ================================================
# DOCKER COMPOSE: AMBIENTE LOCAL
# ================================================
print("\n--- DOCKER COMPOSE: DESARROLLO LOCAL ---")

docker_compose = """
version: '3.8'

services:
  # Simular S3 localmente
  minio:
    image: minio/minio
    ports: ["9000:9000", "9001:9001"]
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: ecuador2024
    command: server /data --console-address ":9001"
    volumes: ["./data/minio:/data"]

  # PostgreSQL como DW local
  postgres_dw:
    image: postgres:15
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: ecuador_dwh
      POSTGRES_USER: data_engineer
      POSTGRES_PASSWORD: itseia_2024
    volumes: ["./data/postgres:/var/lib/postgresql/data"]

  # Apache Airflow para orquestacion
  airflow:
    image: apache/airflow:2.8.0
    depends_on: [postgres_dw]
    ports: ["8080:8080"]
    environment:
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://data_engineer:itseia_2024@postgres_dw/ecuador_dwh
    volumes: ["./dags:/opt/airflow/dags"]

  # Jupyter para desarrollo
  jupyter:
    image: jupyter/scipy-notebook
    ports: ["8888:8888"]
    volumes: ["./notebooks:/home/jovyan/work"]
    environment:
      JUPYTER_ENABLE_LAB: "yes"

  # Redis para cache
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
"""
print(docker_compose)

# ================================================
# GITOPS: PIPELINE CI/CD
# ================================================
print("--- GITOPS: PIPELINE CI/CD PARA DATOS ---")

github_actions = """
# .github/workflows/data-pipeline-deploy.yml

name: Deploy Data Pipeline Ecuador

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        run: terraform init
        working-directory: ./infra/

      - name: Terraform Validate
        run: terraform validate
        working-directory: ./infra/

      - name: Terraform Plan
        run: terraform plan -var="ambiente=stg"
        working-directory: ./infra/
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Run dbt tests
        run: dbt test --profiles-dir ./dbt/
        env:
          DBT_TARGET: stg

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Terraform Apply
        run: terraform apply -auto-approve -var="ambiente=prod"
        working-directory: ./infra/
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Deploy dbt models
        run: dbt run --profiles-dir ./dbt/ --target prod

      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: "Pipeline Ecuador desplegado exitosamente en PROD"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
"""
print(github_actions)

print("\n" + "=" * 65)
print("IaC — CONCEPTOS CLAVE:")
print("  Terraform:   provisionar AWS/GCP/Azure con codigo HCL declarativo")
print("  Variables:   parametrizar por ambiente (dev/stg/prod)")
print("  Docker Compose: ambiente local identico al de produccion")
print("  GitOps:      infraestructura en git — PR para aprobar cambios")
print("  CI/CD:       validar + desplegar automaticamente en cada push a main")
print("  Modulos TF:  reutilizar codigo de infra (como funciones)")
print("=" * 65)
```

3. Escribe el modulo Terraform `modules/data-lake` que encapsula S3 + IAM + Glue y puede reutilizarse para distintos proyectos.

4. Implementa el `terraform.tfvars` para 3 ambientes (dev/stg/prod) con distintos tamanos de Redshift cluster.

## Usa IA para...

> Abre Claude y escribe:
> "Soy data engineer en el Ministerio de Salud de Ecuador. Necesito migrar la infraestructura de datos de manual (clicks en la consola AWS) a Terraform. Tenemos: 15 buckets S3, 8 Glue jobs, 2 clusters Redshift, 25 IAM roles y 3 VPCs. ¿Como hago el import de los recursos existentes a Terraform sin destruirlos? Dame el proceso paso a paso: 1) generar el terraform import para cada recurso, 2) ajustar el estado con terraform state mv, 3) verificar que el plan no destruye nada. Incluye el comando para MSP-Ecuador con recursos reales de ejemplo."

## Que aprendiste

- IaC permite crear infraestructura reproducible en minutos — dev/stg/prod identicos con variables.
- Terraform usa HCL declarativo: defines el estado deseado, Terraform calcula los cambios necesarios.
- Docker Compose replica el stack de produccion localmente — elimina el "funciona en mi maquina".
- GitOps trata la infraestructura como codigo: cada cambio pasa por PR, revision y CI/CD.
- Las lifecycle policies en S3 automatizan la retencion de datos — cumplimiento SRI sin intervencion manual.
- El `terraform plan` muestra los cambios antes de aplicarlos — revision obligatoria antes de `terraform apply`.

## Reto extra

Construye el modulo Terraform completo para el Data Lake del IESS Ecuador: S3 multi-zona con lifecycle policies de 7 anos (cumplimiento legal), Glue con 5 jobs parametrizados, Redshift Serverless para el DW, IAM roles con minimo privilegio, CloudWatch alarms para costo mensual, y Pipeline CI/CD con GitHub Actions que despliega en dev/stg con auto-aprobacion y en prod requiere aprobacion manual del Tech Lead. Toda la infra en git, zero-click deployment.
