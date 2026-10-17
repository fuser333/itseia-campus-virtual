# Ejercicio Sesion 3: AWS Free Tier — Crear Cuenta y Primeros Pasos

**Materia:** Cloud Computing para IA
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Crear una cuenta AWS Free Tier, navegar la consola, lanzar una instancia EC2 gratuita (t2.micro), conectarse por SSH y ejecutar un script Python de ML, documentando los limites del free tier para no generar costos.

## Contexto

Amazon Web Services (AWS) es el lider mundial de cloud con el 32% del mercado. En Ecuador, empresas como Banco del Pacifico, DeUna y varias fintechs usan AWS para sus sistemas. El Free Tier de AWS ofrece 750 horas/mes de EC2 t2.micro durante 12 meses: eso es suficiente para desplegar un modelo de ML en produccion sin pagar un solo centavo. La certificacion AWS Cloud Practitioner (incluida en el curriculum ITSEIA) es el titulo mas solicitado en ofertas de trabajo de tecnologia en Ecuador.

## Instrucciones

### Parte 1: Crear la cuenta AWS (hacer ANTES del ejercicio de codigo)

1. Ve a `aws.amazon.com` -> "Crear una cuenta gratuita".
2. Ingresa email, nombre de cuenta, contrasena.
3. Tipo de cuenta: **Personal** (no empresarial).
4. Requiere tarjeta de credito/debito para verificacion (NO cobra si te mantienes en free tier).
5. Verifica el telefono con SMS o llamada.
6. Selecciona plan **Basico (Gratuito)**.
7. Accede a la Consola de AWS: `console.aws.amazon.com`.

**ALERTA DE COSTOS:** Antes de crear cualquier recurso, configura una alarma de facturacion:
- Billing -> Budgets -> Create budget -> $1 USD -> Alert: 80% del presupuesto.

### Parte 2: Codigo de referencia (ejecutar en Google Colab mientras configuras AWS)

```python
# Cloud Computing para IA - Sesion 3: AWS Free Tier
# ITSEIA - Periodo 3
# NOTA: Este notebook documenta el proceso y las configuraciones clave

# GUIA COMPLETA DE RECURSOS FREE TIER AWS (12 meses)
recursos_free_tier = {
    "EC2 t2.micro": {
        "descripcion": "Servidor virtual: 1 vCPU, 1 GB RAM",
        "limite_free": "750 horas/mes (suficiente para 1 instancia 24/7)",
        "cuando_expira": "12 meses desde creacion de cuenta",
        "uso_ia": "Desplegar APIs de ML simples, FastAPI, Flask",
        "costo_post_free": "$0.0116/hora (~$8.35/mes si corres 24/7)"
    },
    "S3 Standard": {
        "descripcion": "Almacenamiento de objetos (archivos, datasets, modelos)",
        "limite_free": "5 GB storage, 20,000 GET, 2,000 PUT requests/mes",
        "cuando_expira": "12 meses",
        "uso_ia": "Guardar datasets INEC, modelos .pkl, resultados de analisis",
        "costo_post_free": "$0.023/GB/mes"
    },
    "Lambda": {
        "descripcion": "Funciones serverless: corres codigo sin servidor",
        "limite_free": "1 millon de invocaciones/mes (SIEMPRE GRATIS, no expira)",
        "cuando_expira": "Nunca (permanente)",
        "uso_ia": "APIs de prediccion en tiempo real, webhooks",
        "costo_post_free": "$0.20 por millon de invocaciones adicionales"
    },
    "RDS (MySQL/PostgreSQL)": {
        "descripcion": "Base de datos relacional gestionada",
        "limite_free": "750 horas/mes instancia db.t2.micro, 20 GB storage",
        "cuando_expira": "12 meses",
        "uso_ia": "Guardar predicciones, logs de modelos, datos de clientes",
        "costo_post_free": "Desde $15/mes"
    },
    "SageMaker": {
        "descripcion": "Plataforma ML completa de AWS",
        "limite_free": "250 horas Studio notebooks t3.medium, 50h entrenamiento",
        "cuando_expira": "2 meses desde activacion del free tier",
        "uso_ia": "Entrenar y desplegar modelos con AutoML",
        "costo_post_free": "$0.058/hora notebook, variable por entrenamiento"
    }
}

print("RECURSOS AWS FREE TIER PARA PROYECTOS IA:")
print("="*60)
for recurso, info in recursos_free_tier.items():
    print(f"\n{recurso}")
    print(f"  Que es: {info['descripcion']}")
    print(f"  Gratis hasta: {info['limite_free']}")
    print(f"  Cuando expira: {info['cuando_expira']}")
    print(f"  Uso IA: {info['uso_ia']}")
```

3. Instala y configura boto3 (SDK de Python para AWS):

```python
# CONFIGURAR BOTO3 EN COLAB (SDK Python para AWS)
!pip install -q boto3

import boto3

# IMPORTANTE: NUNCA hardcodees credenciales AWS en el codigo
# Usa los secretos de Colab: Tools -> Secrets -> AWS_ACCESS_KEY, AWS_SECRET_KEY

# Forma correcta de configurar credenciales:
# from google.colab import userdata
# aws_access = userdata.get('AWS_ACCESS_KEY_ID')
# aws_secret = userdata.get('AWS_SECRET_ACCESS_KEY')

# Para este ejercicio, configuramos con variables (reemplaza con tus credenciales reales)
print("COMO OBTENER TUS CREDENCIALES AWS:")
print("1. Accede a console.aws.amazon.com")
print("2. Click en tu nombre (arriba derecha) -> Security Credentials")
print("3. Access Keys -> Create Access Key")
print("4. Guarda el Access Key ID y Secret Access Key")
print("5. En Colab: Tools -> Secrets -> agrega AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY")
print()
print("NUNCA compartas ni comitees tus keys de AWS")
print("SIEMPRE usa secretos de Colab, variables de entorno o IAM roles")
```

4. Lista de comandos clave para EC2:

```python
# COMANDOS DE REFERENCIA PARA EC2
comandos_ec2 = """
# ============================================
# GUIA RAPIDA EC2 FREE TIER - ITSEIA P3
# ============================================

# 1. Lanzar instancia EC2 (en AWS Console):
#    - EC2 -> Launch Instance
#    - Name: itseia-ml-server
#    - AMI: Amazon Linux 2023 (gratis)
#    - Instance type: t2.micro (Free Tier eligible)
#    - Key pair: crear nuevo, descargar .pem
#    - Security group: permitir SSH (22) + HTTP (80) + 8000

# 2. Conectarse por SSH desde tu terminal:
#    chmod 400 mi-key.pem
#    ssh -i "mi-key.pem" ec2-user@TU-IP-PUBLICA

# 3. Instalar Python y dependencias en EC2:
#    sudo dnf update -y
#    sudo dnf install python3 python3-pip -y
#    pip3 install pandas scikit-learn joblib flask

# 4. Subir archivo Python a EC2 (desde local):
#    scp -i "mi-key.pem" mi_modelo.py ec2-user@TU-IP:/home/ec2-user/

# 5. Ejecutar script en background (no se cierra al cerrar SSH):
#    nohup python3 mi_modelo.py > output.log 2>&1 &
#    cat output.log  # ver logs

# 6. APAGAR LA INSTANCIA cuando termines (evita costos):
#    En Console: EC2 -> Instances -> Stop Instance
#    O: aws ec2 stop-instances --instance-ids TU-INSTANCE-ID

# ============================================
# COSTO ESTIMADO MENSUAL (FREE TIER):
# t2.micro 8h/dia 30 dias = 240 horas/mes = $0 (libre hasta 750h)
# t2.micro 24h/dia 30 dias = 720 horas = $0 (libre hasta 750h)
# t2.micro 24h/dia 31 dias = 744 horas = $0 (libre hasta 750h)
# t2.micro 2 instancias 24/7 = $0.0116 * 720 = $8.35/mes
# ============================================
"""
print(comandos_ec2)

# CHECKLIST DE SEGURIDAD AWS
print("\nCHECKLIST DE SEGURIDAD (critico para no tener sorpresas):")
checklist = [
    ("Configurar billing alarm a $1 USD", "Evita cargos inesperados"),
    ("Nunca usar root account para trabajo diario", "Crear usuario IAM con permisos minimos"),
    ("Cerrar/terminar instancias EC2 cuando no las uses", "750h/mes se agotan rapido con 2+ instancias"),
    ("Revisar AWS Cost Explorer mensualmente", "Ver cuanto llevas gastado"),
    ("Habilitar MFA en la cuenta root", "Seguridad basica obligatoria"),
    ("NO hardcodear credenciales en codigo", "Usar variables de entorno o IAM roles")
]
for item, razon in checklist:
    print(f"  [ ] {item}")
    print(f"       Por que: {razon}")
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Soy estudiante de Cloud Computing en Ecuador. Acabo de crear mi cuenta AWS Free Tier. Quiero desplegar un modelo Random Forest de scikit-learn como API REST usando Flask en EC2 t2.micro. Dame los pasos exactos con comandos. Que necesito instalar? Como configuro el Security Group para que sea accesible desde internet?"

Despues de leer la respuesta:
- Documenta el proceso en tu notebook como una guia paso a paso en Markdown.
- Calcula cuantas horas podrias correr tu EC2 este mes sin salir del free tier.

## Que aprendiste

- El **Free Tier de AWS** ofrece 750h/mes de EC2 t2.micro durante 12 meses: suficiente para un servidor de ML basico.
- **boto3** es el SDK oficial de Python para interactuar con AWS desde codigo: crear buckets S3, lanzar instancias, invocar Lambda.
- Las **credenciales AWS** nunca van en el codigo fuente: usa variables de entorno, secretos de Colab o IAM roles.
- **Lambda** tiene free tier permanente (1M invocaciones/mes): ideal para APIs de prediccion de bajo trafico.
- La **Security Group** en EC2 es el firewall virtual: controla que puertos son accesibles desde internet (solo abrir lo necesario).

## Reto extra

Configura una **alarma de facturacion** en AWS Budgets con alerta al 80% de $1 USD. Luego crea un usuario IAM con permisos solo para S3 y EC2 (principio de minimos privilegios). Documenta en tu notebook el ARN del usuario, los permisos asignados y por que es mas seguro que usar el usuario root para tareas diarias.
