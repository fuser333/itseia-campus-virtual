# Ejercicio Sesion 6: Propiedad Intelectual de Productos IA

**Materia:** Emprendimiento Tecnologico
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 50 min

## Objetivo

Comprender el marco legal de propiedad intelectual aplicable a productos de IA en Ecuador, identificar que elementos de un producto IA son protegibles y como hacerlo, desarrollar estrategias para proteger la ventaja competitiva sin necesidad de patentes costosas, y entender los riesgos de PI que enfrentan los fundadores de startups IA.

## Contexto (Ecuador)

Un fundador de una startup IA en Ecuador enfrenta una paradoja: su activo mas valioso (el modelo entrenado, los datos, los prompts) casi nunca esta protegido legalmente. Mientras tanto, puede estar infringiendo sin saberlo los derechos de autor de los datos con que entreno su modelo, o los terminos de servicio de OpenAI. Este ejercicio no es teoria juridica — es proteccion practica de tu negocio.

## Instrucciones

### Parte 1 — Mapa de PI de un producto IA (15 min)

Para un producto IA tipico, identifica que elementos son protegibles y como:

| Elemento del producto IA | Tipo de proteccion disponible | Protegible en Ecuador? | Costo aproximado | Tiempo de tramite |
|---|---|---|---|---|
| Nombre de la startup (ej. LexBot) | Marca registrada (SENADI) | Si | $200-400 | 6-12 meses |
| Logo y diseno visual | Derecho de autor | Si (automatico) | $0 (registro $50) | Inmediato |
| Codigo fuente del software | Derecho de autor | Si | $0-100 | Inmediato |
| El modelo entrenado (pesos) | Secreto comercial / copyright | Gris legal | $0 (medidas internas) | N/A |
| Los prompts del sistema | Secreto comercial | Parcialmente | $0 (medidas internas) | N/A |
| Dataset propietario | Secreto comercial / copyright | Si | $0 (medidas internas) | N/A |
| Algoritmo innovador | Patente de software | Limitado en EC | $2,000-5,000 | 2-4 años |
| Nombre de dominio | Registro IANA/NiC.ec | Si | $15-50/año | 1-3 dias |

Completa las filas vacias con tu investigacion. Usa el sitio web del SENADI (senadi.gob.ec) para verificar los costos actuales.

### Parte 2 — Los 5 riesgos de PI que ningun founder de IA conoce (15 min)

Estudia cada riesgo y documenta como protegerte:

**Riesgo 1 — Datos de entrenamiento con copyright:**
OpenAI, Google y Meta enfrentan demandas millonarias por usar datos protegidos para entrenar sus modelos. Si tu startup usa datos de internet para entrenar un modelo, podrias enfrentar el mismo riesgo.
- Fuentes de datos SEGURAS para entrenar: datos del INEC (dominio publico), datos propios recolectados con consentimiento, datasets con licencia CC0 o similar.
- Usa Claude para identificar: que datasets publicos y libres de derechos existen para el sector que te interesa en Ecuador.

**Riesgo 2 — Terminos de servicio de las APIs:**
Los TOS de OpenAI dicen que no puedes usar sus outputs para entrenar modelos competidores. Anthropic tiene restricciones similares. Si construyes un modelo con salidas de GPT, podrias estar infringiendo.
- Accion: Lee completamente los TOS de cada API que uses antes de lanzar.

**Riesgo 3 — Codigo open source con licencias restrictivas:**
Si usas librerias open source con licencia GPL en tu producto comercial, toda tu base de codigo podria tener que ser abierta. Muchos founders no saben la diferencia entre MIT, Apache 2.0, GPL y AGPL.
- Accion: Revisa las licencias de tus dependencias con `pip-licenses` o equivalente.

**Riesgo 4 — Empleados que se llevan el IP:**
En Ecuador, el Codigo del Trabajo no es claro sobre a quien pertenecen las invenciones creadas por empleados fuera del horario laboral. Sin un contrato especifico, podrias perder tu tecnologia cuando un empleado se vaya.
- Accion: Incluir clausula de cesion de IP en todo contrato de trabajo o freelance.

**Riesgo 5 — Fundadores sin acuerdo entre ellos:**
La causa numero 1 de muerte de startups con mas de 1 fundador es conflicto entre socios sin reglas claras. Si no hay un acuerdo de fundadores que defina quien es dueño de que porcentaje del IP antes de levantar capital, los problemas son inevitables.
- Accion: Firmar un acuerdo de fundadores en la primera semana.

Para cada riesgo, escribe en 2 oraciones como tu startup (real o hipotetica) lo mitigaria.

### Parte 3 — Registrar tu marca en el SENADI (15 min)

Simula el proceso de registro de marca para tu startup:

1. Ve a senadi.gob.ec y busca el formulario de solicitud de marca.

2. Con Claude, genera el "Informe de Distintividad" que el SENADI requiere:

```
PROMPT PARA CLAUDE:
"Actua como un abogado especializado en propiedad intelectual ecuatoriano.
Voy a registrar la marca '[NOMBRE DE TU STARTUP]' para productos y servicios de
inteligencia artificial y software en Ecuador.

Ayudame a:
1. Identificar las clases de Niza que debo registrar (que clases de productos/servicios)
2. Verificar si el nombre tiene elementos descriptivos que el SENADI podria objetar
3. Redactar el texto de la 'descripcion de productos y servicios' para el formulario
4. Identificar 3 marcas similares que podrian oponerse al registro y como las diferencio
5. Estimar el costo total del proceso incluyendo tasas y honorarios de abogado"
```

3. Haz una busqueda de anterioridades en la base de datos del SENADI (bdinpi.senadi.gob.ec) para verificar que tu nombre no esta ya registrado.

### Parte 4 — La estrategia de proteccion sin patentes (5 min)

Las startups de IA raramente patentan — es caro, lento y revela la tecnologia. En cambio, usan estas estrategias:

- **Velocidad:** Estar 12 meses adelante de la competencia es mejor proteccion que cualquier patente.
- **Efectos de red:** Cuantos mas usuarios, mas dificil competir (los datos de uso mejoran el modelo).
- **Secreto comercial:** Nunca revelar los detalles tecnicos del modelo, los prompts o el pipeline de entrenamiento.
- **Marca fuerte:** Un nombre reconocido protege mejor que una patente en B2C.
- **Contratos:** NDAs con empleados, proveedores y beta testers.

Diseña una "estrategia de proteccion de IP" de 1 pagina para tu startup con: (1) que registraras formalmente, (2) que protegeras como secreto comercial, (3) que medidas operativas implementaras desde el dia 1.

## Usa IA para...

- Pedirle a Claude que explique la diferencia entre copyright y patente en el contexto de software IA en Ecuador, con ejemplos especificos.
- Preguntarle sobre el caso real de The New York Times vs OpenAI y que implicaciones tiene para startups de IA en Latinoamerica.
- Pedirle que redacte una clausula de cesion de IP para incluir en contratos de trabajo con desarrolladores en Ecuador.

## Que aprendiste

- Que la proteccion de IP de startups IA en Ecuador es mas una combinacion de estrategia operativa que de tramites legales costosos.
- Que el mayor riesgo de PI es el que no conocias: datos de entrenamiento y TOS de APIs.
- Como buscar anterioridades de marcas en el SENADI antes de invertir en el nombre.
- Que la velocidad y los efectos de red son la mejor "patente" para una startup de IA.

## Reto extra

Redacta el "Manual de Propiedad Intelectual" de tu startup: un documento de 2 paginas que explica a todos los miembros del equipo (tecnicos y no tecnicos) cuales son las reglas de IP de la empresa — que pueden compartir publicamente, que es confidencial, como manejar el codigo open source, y que hacer si un competidor copia su producto. Usa Claude para el borrador inicial y editalo con tus especificidades.
