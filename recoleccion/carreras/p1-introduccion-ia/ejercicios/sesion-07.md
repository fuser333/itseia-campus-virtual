# Ejercicio Sesion 7: Herramientas de IA Gratuitas — Arsenal del Tecnologo

**Materia:** Introduccion a la Inteligencia Artificial
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT + Claude + Gemini
**Duracion estimada:** 45 min

## Objetivo

Construir y dominar un arsenal personal de herramientas de IA gratuitas o freemium categorizadas por tipo de tarea, probando al menos 6 herramientas con casos reales de trabajo ecuatoriano.

## Contexto

Un profesional en Ecuador que domina las herramientas de IA gratuitas puede competir con equipos de 5 personas. Las herramientas correctas pueden reemplazar: un disenador grafico ($600/mes), un redactor de contenidos ($400/mes), un analista de datos ($800/mes), y un programador junior ($700/mes). Total potencial ahorro/productividad: **$2,500/mes** usando herramientas con costo total de **$0 a $50/mes**.

Este ejercicio construye tu caja de herramientas real.

## Instrucciones

### Parte A — Categorias de herramientas de IA

Investiga y agrega al menos 2 herramientas por categoria. Para cada una: nombre, URL, plan gratuito (si/no y limite), mejor caso de uso.

**1. Modelos de Lenguaje / Chat**

| Herramienta | URL | Gratuito | Limite gratuito | Mejor para |
|-------------|-----|---------|-----------------|------------|
| ChatGPT | chat.openai.com | Si | GPT-3.5 ilimitado, GPT-4o limitado | Escritura, codigo, analisis |
| Claude | claude.ai | Si | 50 mensajes/dia aprox | Textos largos, razonamiento |
| Gemini | gemini.google.com | Si | Gemini 1.5 Flash | Busqueda + IA integrada |
| [Investiga 2 mas] | | | | |

**2. Generacion de Imagenes**

| Herramienta | URL | Gratuito | Limite | Mejor para |
|-------------|-----|---------|--------|------------|
| DALL-E 3 | via ChatGPT | Si | 15 img/dia | Marketing, diseño rapido |
| Ideogram | ideogram.ai | Si | 10 img/dia | Texto en imagenes |
| [Investiga 2 mas] | | | | |

**3. Productividad y Automatizacion**

| Herramienta | URL | Gratuito | Limite | Mejor para |
|-------------|-----|---------|--------|------------|
| Notion AI | notion.so | Parcial | 20 usos gratis | Organizacion, notas IA |
| Zapier | zapier.com | Si | 100 tareas/mes | Automatizacion sin codigo |
| [Investiga 2 mas] | | | | |

**4. Analisis de Datos y Codigo**

| Herramienta | URL | Gratuito | Limite | Mejor para |
|-------------|-----|---------|--------|------------|
| Google Colab | colab.research.google.com | Si | GPU limitada | Python, ML, notebooks |
| Julius AI | julius.ai | Si | 10 analisis/mes | Excel + IA conversacional |
| [Investiga 2 mas] | | | | |

**5. Video y Audio**

| Herramienta | URL | Gratuito | Limite | Mejor para |
|-------------|-----|---------|--------|------------|
| Suno | suno.com | Si | 50 canciones/dia | Musica generada por IA |
| ElevenLabs | elevenlabs.io | Si | 10K chars/mes | Voz humana realista |
| [Investiga 2 mas] | | | | |

### Parte B — Prueba practica: 6 tareas en 30 minutos

Ejecuta exactamente estas 6 tareas usando las herramientas que acabas de inventariar:

**Tarea 1 — ChatGPT:** Genera un correo de prospeccion de ventas para ofrecer consultoria de IA a una empresa agricola de Cayambe. Tono: profesional pero cercano. Longitud: 150 palabras max.

**Tarea 2 — Claude:** Analiza este texto y dame las 5 ideas principales en vineteas: [copia cualquier articulo de El Comercio o El Universo sobre economia ecuatoriana]

**Tarea 3 — Gemini:** Pregunta: "¿Cuales son las empresas ecuatorianas que cotizan en la Bolsa de Valores de Quito en el sector tecnologico?" (Gemini tiene busqueda web en tiempo real, los otros no)

**Tarea 4 — DALL-E (via ChatGPT):** Genera una imagen para redes sociales de una empresa de IA en Ecuador. Prompt: "Professional tech company logo, Andean mountains background, modern AI aesthetic, blue and yellow colors, Ecuador inspired, 4K, corporate style"

**Tarea 5 — Google Colab:** Abre un notebook nuevo. Escribe en la primera celda:
```python
import pandas as pd
datos = {'Ciudad': ['Quito','Guayaquil','Cuenca','Ambato','Manta'],
         'Poblacion': [2781641, 2698077, 636996, 387309, 277628]}
df = pd.DataFrame(datos)
print(df)
print(f"\nCiudad mas grande: {df.loc[df['Poblacion'].idxmax(), 'Ciudad']}")
```
Ejecuta y documenta el resultado.

**Tarea 6 — ElevenLabs:** Genera un audio de 30 segundos con la voz de un "asesor educativo" leyendo: "ITSEIA es el primer instituto especializado en Inteligencia Artificial del Ecuador. En 2.5 años, nuestros graduados tienen empleabilidad del 92%." Descarga el MP3.

### Parte C — Mapa de flujos de trabajo

Dibuja un diagrama de como encadenarias 3 herramientas para completar esta tarea de negocio real:

**Tarea:** Crear una presentacion de ventas para un cliente potencial en Ecuador.
- Paso 1: Usar [herramienta] para investigar el sector del cliente
- Paso 2: Usar [herramienta] para generar el contenido de las diapositivas
- Paso 3: Usar [herramienta] para crear las imagenes
- Resultado: presentacion completa lista en 45 minutos

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy tecnologo en IA recien graduado en Ecuador buscando mi primer empleo. Dame las 10 herramientas de IA que DEBO dominar en 2024 para ser el candidato mas competitivo del mercado laboral ecuatoriano. Para cada herramienta: nombre, por que la pide el mercado, nivel de dificultad para aprender (1-5), y si existe certificacion oficial disponible. Ordena la lista de mas a menos demandada por empleadores ecuatorianos."

## Que aprendiste

- Las herramientas de IA gratuitas ya tienen **nivel profesional**: no necesitas pagar para empezar a producir valor.
- El **encadenamiento de herramientas** (AI workflow) multiplica el impacto de cada una individualmente.
- Cada herramienta tiene su **punto fuerte**: Gemini tiene busqueda web real, Claude razona mejor en textos largos, ChatGPT tiene mas integraciones.
- **Google Colab** es la puerta de entrada al ML sin instalar nada: es gratuito, tiene GPU y corre Python en el navegador.
- Las herramientas de IA son **temporales**: nuevas herramientas superan a las actuales cada 6 meses. Lo que no cambia es saber **que tipo de herramienta necesitas para que tarea**.

## Reto extra

Disenate un **"Stack de IA Personal"** documentado: las 8-10 herramientas que usaras semana a semana para estudiar, trabajar y emprender. Para cada una: frecuencia de uso estimada, caso de uso especifico tuyo, y cuanto te cuesta al mes (objetivo: menos de $30 total). Comparte tu stack con la clase la proxima semana.
