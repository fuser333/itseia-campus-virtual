# Ejercicio Sesion 4: Infografias con IA — Canva y Gamma

**Materia:** Storytelling con Datos
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT + Gamma.app + Canva
**Duracion:** 50 min

## Objetivo

Disenar infografias de datos profesionales usando IA para automatizar el proceso creativo, dominar los principios de diseño visual que hacen que una infografia sea memorable, y producir piezas listas para publicacion en redes sociales, informes o presentaciones con datos reales de Ecuador.

## Contexto (Ecuador)

Una infografia bien diseñada sobre datos del INEC compartida en LinkedIn puede llegar a 50,000 profesionales ecuatorianos en 48 horas — mas que cualquier informe PDF. Las organizaciones que dominan la comunicacion visual de datos tienen una ventaja competitiva enorme. Este ejercicio produce infografias reales que puedes usar en tu portafolio profesional.

## Instrucciones

### Parte 1 — Principios de diseño de infografias de datos (10 min)

**Los 6 principios de infografias de datos que funcionan:**

1. **Jerarquia visual:** El numero mas importante es el mas grande. El ojo sigue el tamano.
2. **Maximo 3 colores:** Mas colores = menos claridad. Uno para datos positivos, uno para negativos, uno neutro.
3. **La proporcion comunica:** Un grafico de barras donde la diferencia es 3% no deberia verse igual que uno donde la diferencia es 300%.
4. **Contexto obligatorio:** Un numero sin comparacion no significa nada. "18% de ausentismo" es ambiguo. "18% vs 9% en clinicas privadas" comunica.
5. **Titulo que concluye:** El titulo debe decir la conclusion, no solo el topico. "Tasa de ausentismo en Ecuador" es un topico. "El ausentismo medico le cuesta a Ecuador $180M anuales" es una conclusion.
6. **CTA visual:** La infografia debe terminar con una instruccion clara para el lector.

Evalua estas dos infografias hipoteticas (solo por descripcion) y determina cual aplica mas principios:

**Infografia A:** "Titulo: Estadisticas de Empleo Ecuador 2024. Colores: 7 tonos de azul. Graficos: 12 charts en una pagina. Fuente: INEC."

**Infografia B:** "Titulo: 1 de cada 6 jovenes ecuatorianos no encuentra trabajo. Colores: azul marino, amarillo, blanco. Un numero gigante (17%), un grafico de barras de 4 provincias, una frase de contexto, y logo INEC."

### Parte 2 — Crear infografia con Gamma.app (20 min)

Gamma (gamma.app) puede generar infografias de datos directamente desde una descripcion:

1. Ve a gamma.app → "New" → "Presentation" (usaremos un slide como infografia).

2. Usa este prompt (con datos reales que hayas investigado):

```
PROMPT PARA GAMMA:
"Crea una infografia de datos sobre [TEMA] en Ecuador.

DATOS ESPECIFICOS:
[DATO PRINCIPAL]: [VALOR] — este es el numero mas importante, hazlo gigante
[DATO 2]: [VALOR] — comparacion o contexto
[DATO 3]: [VALOR] — desglose por region o segmento
[DATO 4]: [VALOR] — tendencia temporal

ESTRUCTURA VISUAL:
- Titulo (conclusion, no topico): [TU TITULO]
- Numero hero grande en la parte superior: [VALOR]
- Subtitulo de contexto: [FRASE]
- Grafico central: [TIPO: barras / pie / timeline / mapa]
- 3 datos adicionales como 'stat cards' en la parte inferior
- Fuente: [INEC/BCE/MSP] + año
- Logo ITSEIA pequeño en esquina inferior

PALETA DE COLORES: azul marino (#1F2F58), amarillo (#FBBC0C), blanco
ESTILO: Minimalista, moderno, profesional — similar a The Economist o Financial Times
TAMAÑO: Optimizado para LinkedIn (1200x628px) o Instagram vertical (1080x1350px)"
```

3. Itera con Gamma hasta que la infografia:
   - Tenga un titulo que concluye (no que describe)
   - Muestre el numero mas importante como el elemento visual dominante
   - Sea legible en una captura de pantalla de 600px de ancho

### Parte 3 — Infografia en Canva con template (15 min)

Para infografias mas complejas con multiples secciones, Canva es superior.

**Flujo de trabajo optimizado:**

1. Ve a canva.com → busca "infografia datos" en templates.
2. Filtra por templates con 5-7 secciones verticales (formato scrolly).
3. Elige un template con paleta oscura (comunica mas seriedad para datos).

**Usar la IA de Canva (Magic Design):**
- Haz clic en el boton de "Magic Design" o "AI Design"
- Describe: "Infografia sobre mercado tech Ecuador con datos de brecha de habilidades, empleos por ciudad y proyeccion 2026. Paleta: azul marino y dorado."

**Reemplazar el contenido del template:**
Para cada seccion del template, usa Claude para generar el texto:

```
PROMPT PARA CLAUDE (uno por seccion de la infografia):
"Escribe el texto para la SECCION 2 de una infografia sobre [TEMA].
El template tiene: un titulo de seccion, 3 bullets de datos, y 1 frase de insight.
Los datos a comunicar son: [DATOS DE TU INVESTIGACION]
Reglas:
- Titulo de seccion: maximo 6 palabras, que concluya
- Bullets: exactamente 3, con el numero primero, luego el contexto
- Insight: 1 frase de 15 palabras que conecta con la siguiente seccion
Tono: serio pero accesible"
```

4. Verifica la infografia final con el checklist:
- [ ] El titulo es una conclusion (no un topico)
- [ ] El numero mas importante es visualmente dominante
- [ ] Maximo 3 colores en toda la pieza
- [ ] Cada numero tiene su fuente
- [ ] La infografia se entiende en 8 segundos de lectura rapida
- [ ] Hay un CTA o pregunta al final

### Parte 4 — Comparacion de canales (5 min)

Para la misma infografia, adapta el formato a 3 canales distintos:

| Canal | Formato ideal | Densidad de texto | Estilo |
|---|---|---|---|
| LinkedIn (feed) | 1200x628px | Medio | Profesional, con logo |
| Instagram feed | 1080x1080px | Bajo (menos texto) | Visual-first, bold colors |
| Informe ejecutivo | A4 vertical | Alto (mas detalle) | Sobrio, con leyendas completas |
| Twitter/X | 1200x675px | Muy bajo (1 stat hero) | Impactante, minimalista |

Produce 2 versiones de tu infografia: la version LinkedIn/ejecutivo y la version Instagram. Nota las diferencias en densidad de informacion y estilo.

## Usa IA para...

- Pedirle a ChatGPT que genere los 5 titulos de infografia mas poderosos para tus datos (recordatorio: titulo = conclusion, no topico).
- Pedirle a Claude que evalue si tu infografia final cumple los 6 principios de diseño y que sugiere cambiar.
- Preguntarle que datos del INEC tendrian mayor viralidad si se convirtieran en infografias y por que.

## Que aprendiste

- Que el titulo de una infografia que comunica la conclusion tiene 3-5x mas engagement que uno que solo describe el topico.
- Que la jerarquia visual (tamaño, color, posicion) debe corresponder a la jerarquia de importancia de los datos.
- Que Gamma es mas rapido para infografias simples; Canva es mejor para layouts complejos con multiples secciones.
- Como adaptar el mismo dato a diferentes formatos y audiencias manteniendo la coherencia del mensaje.

## Reto extra

Publica tu mejor infografia de datos ecuatorianos en LinkedIn con hashtags relevantes (#DataEcuador #InteligenicaArtificial #Ecuador). Documenta las metricas despues de 48 horas: impresiones, interacciones, comentarios, y el feedback cualitativo mas valioso. Analiza que elemento de la infografia genero mas interaccion (el titulo? un numero especifico? la estetica visual?) y ajusta tu siguiente infografia basandote en ese aprendizaje.
