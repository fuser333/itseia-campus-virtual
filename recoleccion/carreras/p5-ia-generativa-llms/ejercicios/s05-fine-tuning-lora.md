# Ejercicio Sesion 5: Fine-Tuning Conceptual y LoRA

**Materia:** IA Generativa y LLMs
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT (OpenAI fine-tuning) + Hugging Face
**Duracion:** 55 min

## Objetivo

Comprender cuando y por que hacer fine-tuning de un LLM, dominar el concepto de LoRA (Low-Rank Adaptation) como metodo eficiente de adaptacion, preparar un dataset de entrenamiento en formato JSONL, y evaluar el trade-off entre fine-tuning, prompt engineering y RAG para casos de uso empresariales ecuatorianos.

## Contexto (Ecuador)

Una empresa aseguradora en Ecuador quiere un modelo que responda preguntas de seguros usando exactamente el tono y terminologia de su poliza interna — no el tono generico de GPT. Una cadena de retail quiere un modelo que clasifique productos con las categorias propias de su catalogo. Estos son casos donde el fine-tuning tiene ventaja real sobre el prompt engineering. Saber cuando usarlo (y cuando NO) es una habilidad senior.

## Instrucciones

### Parte 1 — Cuando hacer fine-tuning? El arbol de decision (10 min)

Antes de tocar codigo, responde cada pregunta de este arbol de decision para los 3 casos de uso planteados:

```
CASO A: Asistente de atencion al cliente para banco ecuatoriano
CASO B: Clasificador de documentos tributarios SRI (formularios)
CASO C: Generador de contratos laborales ecuatorianos

Arbol de Decision:
1. Pueden resolverse con un buen system prompt? (si → prompt engineering primero)
2. El problema es de conocimiento especifico de dominio que no esta en el modelo base?
   (si → considerar RAG antes de fine-tuning)
3. El problema requiere cambiar el COMPORTAMIENTO y TONO del modelo, no solo el conocimiento?
   (si → fine-tuning es candidato)
4. Tienes >100 ejemplos (input, output) de alta calidad?
   (no → recolectar datos primero)
5. El costo de inference es critico y necesitas reducir tokens?
   (si → fine-tuning puede reducir el system prompt necesario)
```

Para cada caso, justifica en 3 oraciones si usarias fine-tuning, RAG o prompt engineering.

### Parte 2 — LoRA: matematica intuitiva (15 min)

LoRA es la tecnica que hace que fine-tuning sea accesible. Comprende la idea central:

**El problema del fine-tuning tradicional:**
Un modelo como Llama 3.1 8B tiene ~8 mil millones de parametros. Actualizarlos todos requiere:
- 8B parametros × 4 bytes = 32 GB de VRAM solo para almacenar el modelo
- 32 GB adicionales para gradientes durante entrenamiento
- Inaccesible para la mayoria de organizaciones

**La solucion LoRA:**
En vez de modificar la matriz de pesos W (grande), LoRA aprende dos matrices pequeñas A y B donde:
- W_nuevo = W_original + (A × B)
- A tiene dimension [d × r] y B tiene dimension [r × d]
- r es el "rank" de LoRA, tipicamente 4, 8, o 16 (vs d que puede ser 4096)

**Calculo practico:**
```python
# Cuanto parametros actualiza LoRA vs full fine-tuning?

d = 4096      # dimension tipica de una capa de atencion en Llama 7B
r = 16        # rank de LoRA
num_capas = 32  # capas de atencion en Llama 7B

# Full fine-tuning: todos los parametros de esa capa
params_full = d * d  # 4096 * 4096 = 16,777,216

# LoRA: solo las matrices A y B
params_lora = (d * r) + (r * d)  # (4096*16) + (16*4096) = 131,072

reduccion = params_full / params_lora
print(f"Parametros full fine-tuning: {params_full:,}")
print(f"Parametros LoRA (r={r}): {params_lora:,}")
print(f"Reduccion: {reduccion:.0f}x menos parametros entrenables")

# Total del modelo Llama 7B con LoRA r=16
params_total_lora = params_lora * num_capas * 4  # 4 matrices por capa (Q, K, V, O)
params_modelo_completo = 7_000_000_000
porcentaje = (params_total_lora / params_modelo_completo) * 100
print(f"\nParametros LoRA totales: {params_total_lora:,}")
print(f"Porcentaje del modelo: {porcentaje:.2f}%")
```

Ejecuta el codigo y responde: Si r=16 es 128x mas eficiente que full fine-tuning, por que no siempre usamos el rank mas bajo posible?

### Parte 3 — Preparar dataset para fine-tuning OpenAI (20 min)

OpenAI permite hacer fine-tuning de gpt-4o-mini con tus propios datos. El formato es JSONL.

**Tarea:** Prepara un dataset de 15 ejemplos para entrenar un modelo que genere descripciones de ofertas de trabajo para empresas ecuatorianas con el tono correcto.

```python
import json
import os
from pathlib import Path

# Dataset de entrenamiento — formato oficial OpenAI fine-tuning
# Cada linea es un objeto JSON con "messages"

dataset = [
    {
        "messages": [
            {"role": "system", "content": "Eres el asistente de RRHH de una empresa ecuatoriana. Generas descripciones de trabajo profesionales, atractivas y conformes al mercado local."},
            {"role": "user", "content": "Genera descripcion para: Analista de Datos Senior, empresa tech Quito, requiere Python SQL Tableau, salario $1800-2200"},
            {"role": "assistant", "content": "**Analista de Datos Senior**\n\n**Sobre el rol:**\nBuscamos un profesional apasionado por los datos para unirse a nuestro equipo de tecnologia en Quito. Trabajaras con datasets reales de nuestras operaciones para generar insights que impulsen decisiones estrategicas.\n\n**Responsabilidades:**\n- Disenar y mantener dashboards en Tableau para equipos ejecutivos\n- Desarrollar pipelines de datos en Python y SQL\n- Identificar tendencias y anomalias en datos operacionales\n- Presentar hallazgos a stakeholders no tecnicos\n\n**Requisitos:**\n- 3+ anos de experiencia en analisis de datos\n- Dominio de Python (pandas, numpy) y SQL avanzado\n- Experiencia con Tableau o Power BI\n- Pensamiento analitico y comunicacion efectiva\n\n**Ofrecemos:**\n- Salario: $1,800 - $2,200 USD mensuales\n- Beneficios de ley + seguro medico privado\n- Modalidad hibrida (3 dias presencial)\n- Capacitacion continua en herramientas de IA"}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "Eres el asistente de RRHH de una empresa ecuatoriana. Generas descripciones de trabajo profesionales, atractivas y conformes al mercado local."},
            {"role": "user", "content": "Genera descripcion para: Community Manager Junior, agencia digital Guayaquil, redes sociales contenido, salario $600-800"},
            {"role": "assistant", "content": "**Community Manager Junior**\n\n**Sobre nosotros:**\nSomos una agencia digital en crecimiento con sede en Guayaquil, trabajando con marcas ecuatorianas lideres en su transformacion digital.\n\n**Tu mision:**\nCrear contenido que conecte con audiencias reales, gestionar comunidades activas y convertir seguidores en clientes.\n\n**Que haras:**\n- Crear y programar contenido para Instagram, TikTok y Facebook\n- Responder comentarios y mensajes de comunidades activas\n- Reportar metricas de engagement semanalmente\n- Colaborar con diseno en piezas graficas\n\n**Te buscamos si:**\n- Eres nativo digital con ojo para las tendencias\n- Tienes experiencia (aunque sea personal) gestionando redes\n- Redactas bien y con creatividad\n- Estudias marketing, comunicacion o afines\n\n**Condiciones:**\n- Salario: $600 - $800 USD + bonos por resultados\n- Entrada inmediata\n- Ambiente dinamico y oportunidad de crecimiento rapido"}
        ]
    },
    # Agrega 13 ejemplos mas con diferentes roles: contador, ingeniero civil,
    # medico, docente, vendedor, etc. — todos con contexto ecuatoriano
]

# Guardar en formato JSONL
output_path = Path("dataset_ofertas_trabajo_ecuador.jsonl")
with open(output_path, "w", encoding="utf-8") as f:
    for ejemplo in dataset:
        f.write(json.dumps(ejemplo, ensure_ascii=False) + "\n")

print(f"Dataset guardado: {len(dataset)} ejemplos en {output_path}")

# Validar el formato
print("\nValidacion de formato:")
with open(output_path, "r", encoding="utf-8") as f:
    for i, linea in enumerate(f, 1):
        obj = json.loads(linea)
        assert "messages" in obj, f"Linea {i}: falta 'messages'"
        assert len(obj["messages"]) >= 2, f"Linea {i}: necesita al menos 2 mensajes"
        print(f"  Linea {i}: OK ({len(obj['messages'])} mensajes)")

print("\nDataset listo para subir a OpenAI fine-tuning API")
```

Agrega los 13 ejemplos faltantes con roles variados del mercado laboral ecuatoriano.

### Parte 4 — Comparar costos: fine-tuning vs prompting (10 min)

Calcula el costo total de ambas estrategias para este escenario real:

**Escenario:** Sistema que genera 500 descripciones de trabajo por mes para una plataforma de empleo ecuatoriana.

| Concepto | Fine-tuning | Prompt Engineering |
|---|---|---|
| Costo de entrenamiento (una vez) | $0.008/1K tokens entrenamiento | $0 |
| Costo por inferencia (por descripcion) | Sin system prompt largo: ~$0.0003 | Con system prompt 500 tokens: ~$0.0008 |
| Costo mes 1 | Entrenamiento + inferencias | Solo inferencias |
| Costo mes 6 | Solo inferencias | Solo inferencias |
| Break-even (mes) | ? | ? |

Completa la tabla con calculos reales y determina: a partir de que volumen mensual el fine-tuning se vuelve mas economico?

## Usa IA para...

- Pedirle a ChatGPT que genere los 13 ejemplos faltantes del dataset con roles del mercado ecuatoriano.
- Preguntarle sobre QLoRA (Quantized LoRA) y como permite hacer fine-tuning en una GPU de consumo de 16GB.
- Pedirle que compare LoRA vs P-tuning vs Prefix tuning en terminos de casos de uso optimos.

## Que aprendiste

- Que fine-tuning no siempre es la mejor solucion — prompt engineering y RAG suelen ser preferibles.
- Que LoRA reduce drasticamente los parametros entrenables (100x o mas) manteniendo calidad comparable.
- Como preparar un dataset JSONL valido para fine-tuning con OpenAI.
- El calculo de break-even entre fine-tuning y prompting segun el volumen de uso.

## Reto extra

Usa Hugging Face con la libreria `peft` para aplicar LoRA a un modelo pequeño (distilgpt2) y entrenarlo con 20 ejemplos de ofertas de trabajo ecuatorianas. Compara las respuestas antes y despues del fine-tuning. Documenta: cuantas epocas necesitaste, cuanto tiempo tomo en CPU, y como cambio la perplejidad del modelo.
