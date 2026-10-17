# Ejercicio Sesion 1: Que es la Nube — IaaS, PaaS, SaaS

**Materia:** Cloud Computing para IA
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Comprender y diferenciar los tres modelos de servicio cloud (IaaS, PaaS, SaaS) mapeando cada uno a empresas y servicios concretos del ecosistema ecuatoriano y latinoamericano, y decidir cual modelo conviene segun el caso de uso de IA.

## Contexto

Ecuador tiene una transformacion digital acelerada. El Banco Pichincha usa SaaS (Microsoft 365, Salesforce) para su operacion diaria, mientras su equipo de IA usa PaaS (Azure ML) para entrenar modelos. Petroecuador usa IaaS (servidores AWS) para procesar datos sismicos. CNT (Corporacion Nacional de Telecomunicaciones) ofrece servicios cloud propios a instituciones publicas ecuatorianas. Entender estos tres modelos es el mapa conceptual de todo lo que viene en este periodo.

## Instrucciones

1. Abre Google Colab y crea `sesion01_modelos_cloud.ipynb`.

2. Construye el mapa conceptual en Python:

```python
# Cloud Computing para IA - Sesion 1: IaaS, PaaS, SaaS
# ITSEIA - Periodo 3

# Mapa comparativo de modelos cloud
modelos_cloud = {
    "IaaS": {
        "nombre_completo": "Infrastructure as a Service",
        "descripcion": "Alquilas hardware virtualizado: servidores, redes, almacenamiento",
        "analogia": "Alquilar un lote vacio: construyes lo que quieras, pero pones todos los materiales",
        "tu_gestionas": ["Sistema Operativo", "Runtime", "Middleware", "Aplicaciones", "Datos"],
        "proveedor_gestiona": ["Virtualizacion", "Servidores fisicos", "Red", "Datacenter"],
        "cuando_usar_ia": [
            "Entrenar modelos muy grandes que necesitas controlar completamente",
            "Montar un cluster Spark para Big Data personalizado",
            "Configurar GPUs especificas para deep learning"
        ],
        "proveedores": {
            "Global": ["AWS EC2", "Google Compute Engine", "Azure Virtual Machines"],
            "Ecuador/Latam": ["CNT Cloud", "Telconet", "Puntonet Cloud", "Claro Cloud"]
        },
        "costo_tipico": "$0.01 - $3.50/hora segun instancia"
    },
    "PaaS": {
        "nombre_completo": "Platform as a Service",
        "descripcion": "Alquilas una plataforma completa: solo traes tu codigo y datos",
        "analogia": "Alquilar una cocina equipada: solo traes los ingredientes y cocinas",
        "tu_gestionas": ["Aplicaciones", "Datos"],
        "proveedor_gestiona": ["SO", "Runtime", "Middleware", "Servidores", "Red", "Datacenter"],
        "cuando_usar_ia": [
            "Entrenar modelos en AWS SageMaker o Google Vertex AI",
            "Desplegar una API de ML en Heroku o Railway",
            "Usar pipelines de datos en Google Cloud Dataflow"
        ],
        "proveedores": {
            "Global": ["AWS SageMaker", "Google Vertex AI", "Azure ML", "Heroku", "Railway"],
            "Ecuador/Latam": ["No hay PaaS local relevante - se usa AWS/GCP con servidores en Brasil/USA"]
        },
        "costo_tipico": "Gratis (free tier) hasta $50-$500/mes para proyectos reales"
    },
    "SaaS": {
        "nombre_completo": "Software as a Service",
        "descripcion": "Usas software terminado via navegador o API. No instalas nada.",
        "analogia": "Comer en un restaurante: no cocinas, no limpias, solo pides y consumes",
        "tu_gestionas": ["Tus datos y como usas el software"],
        "proveedor_gestiona": ["Todo: infraestructura, plataforma, aplicacion, actualizaciones"],
        "cuando_usar_ia": [
            "Usar ChatGPT API para agregar IA a tu app sin entrenar nada",
            "Google Cloud Vision para detectar objetos en imagenes",
            "Tableau o Power BI para visualizar datos sin infraestructura"
        ],
        "proveedores": {
            "Global": ["ChatGPT/OpenAI API", "Google Gemini API", "Anthropic Claude API",
                       "Salesforce Einstein", "HubSpot AI", "Canva AI"],
            "Ecuador/Latam": ["Syscom", "Defontana ERP", "Alegra (contabilidad cloud)"]
        },
        "costo_tipico": "$0 (free tier) a $20-200/mes por usuario"
    }
}

# Mostrar el mapa
for modelo, info in modelos_cloud.items():
    print(f"\n{'='*20} {modelo}: {info['nombre_completo']} {'='*20}")
    print(f"Que es: {info['descripcion']}")
    print(f"Analogia: {info['analogia']}")
    print(f"TU gestionas: {', '.join(info['tu_gestionas'])}")
    print(f"\nCuando usar para IA:")
    for uso in info['cuando_usar_ia']:
        print(f"  - {uso}")
    print(f"\nProveedores globales: {', '.join(info['proveedores']['Global'][:3])}")
    print(f"Costo tipico: {info['costo_tipico']}")
```

3. Ejercicio de clasificacion:

```python
# Clasifica cada herramienta en su modelo correcto
print("\n" + "="*65)
print("EJERCICIO: CLASIFICA CADA HERRAMIENTA")
print("="*65)

herramientas = [
    ("Google Colab", "PaaS", "Plataforma de notebooks en la nube - solo traes tu codigo"),
    ("AWS EC2 con GPU", "IaaS", "Servidor virtual con GPU que configuras desde cero"),
    ("ChatGPT Plus ($20/mes)", "SaaS", "Software terminado que usas via navegador"),
    ("OpenAI API (pago por token)", "SaaS", "Consumes un servicio de IA terminado via API"),
    ("AWS SageMaker", "PaaS", "Plataforma de ML - solo subes tu modelo y datos"),
    ("Supabase Free Tier", "PaaS", "Base de datos como servicio - no gestionas el servidor"),
    ("Servidor dedicado Telconet", "IaaS", "Hardware en datacenter ecuatoriano"),
    ("Google Analytics", "SaaS", "Software de analisis que usas sin instalar nada"),
    ("Azure Virtual Machine", "IaaS", "VM que configuras con el SO que eliges"),
    ("Streamlit Cloud", "PaaS", "Plataforma para desplegar apps Python - solo subes el codigo")
]

for herramienta, tipo, razon in herramientas:
    print(f"\n{herramienta}:")
    print(f"  Tipo: {tipo}")
    print(f"  Por que: {razon}")
```

4. Decision framework para proyectos IA:

```python
print("\n" + "="*65)
print("COMO ELEGIR EL MODELO CORRECTO PARA TU PROYECTO IA")
print("="*65)

preguntas = [
    ("¿Tienes equipo DevOps/infraestructura?", "SI -> IaaS | NO -> PaaS o SaaS"),
    ("¿Necesitas entrenar modelos propios?", "SI -> IaaS o PaaS | NO -> SaaS es suficiente"),
    ("¿El presupuesto es cero?", "SI -> Free tiers: Colab(PaaS), Supabase(PaaS), GPT free(SaaS)"),
    ("¿Datos sensibles/privados (salud, banco)?", "SI -> IaaS local o privado | NO -> cualquier modelo"),
    ("¿Velocidad de lanzamiento es prioridad?", "SI -> SaaS o PaaS | NO -> IaaS da mas control"),
    ("¿Modelo en produccion para miles de usuarios?", "SI -> PaaS (autoscaling) | prototipo -> cualquiera")
]

for pregunta, respuesta in preguntas:
    print(f"\n{pregunta}")
    print(f"  -> {respuesta}")

print("\n\nESTRATEGIA ITSEIA RECOMENDADA:")
print("  Periodo 3: Google Colab (PaaS GRATIS) para todo")
print("  Periodo 4: AWS Free Tier (IaaS+PaaS) para produccion basica")
print("  Periodo 5: SageMaker + S3 + Lambda (PaaS enterprise)")
print("  Trabajo real: segun el cliente/empresa (mezcla de los 3)")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "Una startup ecuatoriana de fintech quiere lanzar un modelo de ML para detectar fraude en pagos. Tienen 5 personas en el equipo (2 devs, 1 data scientist, 2 de negocio). Sin datacenter propio. ¿Que modelo cloud (IaaS, PaaS, SaaS) recomendarias para cada etapa: prototipo (mes 1), MVP (mes 3) y produccion (mes 12)? Justifica con costos aproximados."

Despues de leer la respuesta:
- Documenta la estrategia en una celda Markdown de tu notebook con un diagrama de texto.
- Busca si existe algun proveedor cloud ecuatoriano que compita con AWS/Google para ese caso.

## Que aprendiste

- **IaaS** da maximo control pero requiere expertise tecnico: tu gestionas el sistema operativo y todo lo que esta encima.
- **PaaS** es el modelo ideal para equipos de datos: te enfocas en el codigo/modelo, no en la infraestructura.
- **SaaS** es el mas rapido para arrancar: consumes IA ya construida (OpenAI, Google AI) via API.
- En Ecuador el cloud de proveedores locales (CNT, Telconet) es relevante para datos gubernamentales y regulacion de privacidad.
- La mayoria de proyectos reales de IA usan los tres modelos simultaneamente: SaaS para servicios externos, PaaS para el modelo propio, IaaS para almacenamiento masivo.

## Reto extra

Investiga cuanto cuesta en dolares correr el modelo Random Forest del Periodo 3 (800 filas, 5 features, 100 arboles) en: AWS EC2 t2.micro (IaaS), Google Colab Pro (PaaS) y una API de AutoML de Google (SaaS). Compara los costos para 1 semana de entrenamiento diario y reporta cual opcion es mas economica para un estudiante de ITSEIA.
