# Ejercicio Sesion 5: Herramientas — Jira, Trello, Notion con IA

**Materia:** Metodologias Agiles
**Nivel:** Intermedio
**Herramienta IA:** Claude + Copilot
**Duracion estimada:** 50 min

## Objetivo

Configurar y usar las tres principales herramientas de gestion agil (Trello, Notion y Jira) para gestionar un proyecto de datos, aplicando IA integrada para automatizar la creacion de tickets, redactar historias de usuario y generar reportes de sprint.

## Contexto

En Ecuador, el 60% de empresas de tecnologia usan Trello (por ser gratuito y simple), el 25% usa Jira (startups y empresas medianas) y el 15% usa Notion (equipos de datos y consulting). Como profesional de datos, debes ser fluido en las tres. La IA integrada en estas herramientas esta cambiando radicalmente como se planifican proyectos: en 5 minutos puedes tener un backlog completo que antes tomaba 2 horas.

## Instrucciones

### PARTE A: TRELLO (30 min)

1. Crea una cuenta gratuita en trello.com si no tienes una.

2. Crea un tablero llamado `ITSEIA - Proyecto Analytics [Tu nombre]`.

3. Configura estas listas (columnas):
   - Backlog del Producto
   - Sprint 1 (14-28 Abr 2025)
   - En Progreso
   - En Revision
   - Terminado

4. Agrega las siguientes tarjetas con toda la informacion:

```
TARJETA 1:
Titulo: "Dashboard ventas por provincia - Empresa XYZ"
Lista: Sprint 1
Descripcion:
  Como gerente comercial, quiero un dashboard que muestre las ventas
  por provincia en tiempo real para identificar zonas de oportunidad.

  Criterios de aceptacion:
  - DADO que estoy en el dashboard CUANDO selecciono una provincia
    ENTONCES veo el detalle de ventas del mes actual vs mes anterior
  - El dashboard carga en menos de 3 segundos con datos reales
  - Funciona en mobile (responsive)

Etiquetas: Data Engineering, Alta Prioridad
Checklist "Definicion de Done":
  [ ] Pipeline ETL en produccion
  [ ] Dashboard en Metabase/Superset
  [ ] Code review aprobado
  [ ] Demo con cliente aprobada
  [ ] Documentacion tecnica en Notion
Fecha limite: [Ultimo dia del sprint]
Asignado a: [Tu nombre]

TARJETA 2:
Titulo: "Modelo prediccion churn clientes CNT Ecuador"
Lista: Backlog del Producto
Descripcion: [Escribe tu propia descripcion como historia de usuario]
Etiquetas: Machine Learning, Media Prioridad
Story Points: [Agrega como campo personalizado Power-Up]

[Agrega 3 tarjetas mas por tu cuenta para el proyecto]
```

5. Activa el Power-Up "Card Aging" para visualizar tarjetas que llevan mucho tiempo sin moverse (cuellos de botella visuales).

6. Usa la IA de Trello (boton "Ask AI" si tienes Trello Premium, o usa Claude externamente):

```
Prompt para Claude:
"Tengo un proyecto de analytics en Ecuador para predecir la demanda de
creditos en una cooperativa de ahorro. Necesito 8 tarjetas de Trello
con titulo, descripcion en formato historia de usuario, y checklist de
definicion de done. Dame el texto listo para copiar en Trello."
```

Crea las 8 tarjetas en tu tablero basandote en la respuesta de Claude.

---

### PARTE B: NOTION (20 min)

1. Crea una cuenta gratuita en notion.so.

2. Crea una pagina llamada `Sprint 1 — Analytics Cooperativa Ecuador`.

3. Dentro, crea una **Database (Board view)** con estas propiedades:

```
Propiedades de la base de datos:
- Nombre (titulo): texto
- Estado: select [Backlog | En Progreso | En Revision | Done]
- Prioridad: select [Alta | Media | Baja]
- Story Points: number
- Responsable: person
- Sprint: select [Sprint 1 | Sprint 2 | Backlog]
- Tipo: select [Feature | Bug | Tecnico | Investigacion]
- Fecha inicio: date
- Fecha fin: date
```

4. Crea estas 5 entradas en la base de datos:

| Nombre | Estado | Prio | SP | Sprint |
|--------|--------|------|----|--------|
| EDA dataset COAC | En Progreso | Alta | 3 | Sprint 1 |
| Modelo scoring V1 | Backlog | Alta | 8 | Sprint 1 |
| Dashboard morosidad | Backlog | Media | 5 | Sprint 1 |
| Pipeline automatico | Backlog | Alta | 8 | Sprint 1 |
| Documentacion API | Backlog | Baja | 2 | Sprint 1 |

5. Usa **Notion AI** (disponible en plan gratuito con limite):

```
Crea una nueva pagina dentro de tu base de datos para "Modelo scoring V1"
y usa Notion AI con el prompt:
"/ai Escribe las notas tecnicas de una reunion de sprint planning para
  construir un modelo de scoring crediticio para una cooperativa de Ecuador
  con 50,000 socios. El equipo tiene 2 data scientists y 1 data engineer.
  Incluye riesgos identificados y dependencias."
```

6. Cambia la vista de Board a **Timeline view** para ver el cronograma del sprint.

---

### PARTE C: COMPARACION (incluir en el documento)

```
COMPARACION DE HERRAMIENTAS

| Criterio              | Trello         | Notion         | Jira           |
|-----------------------|----------------|----------------|----------------|
| Precio basico         | Gratis         | Gratis         | Gratis (10 u.) |
| Curva de aprendizaje  | Muy baja       | Media          | Alta           |
| Personalización       | Media          | Muy alta       | Alta           |
| IA integrada          | Basica         | Buena          | Buena          |
| Reportes/metricas     | Minimos        | Medios         | Completos      |
| Integraciones         | Muchas         | Muchas         | Muchas         |
| Ideal para            | Equipos peq.   | Equipos datos  | Empresas >20p  |
| Curva empresa Ecuador | [Tu respuesta] | [Tu respuesta] | [Tu respuesta] |

¿Cual usarias para un equipo de 4 data scientists en una startup de Quito?
Respuesta: ___________
Justificacion: ___________

¿Cual usarias para gestionar el proyecto del MSP de la sesion anterior?
Respuesta: ___________
Justificacion: ___________
```

## Usa IA para...

> Abre Claude y escribe:
> "Soy lider tecnico de un equipo de datos de 4 personas en Ecuador. Usamos Notion para gestionar nuestros proyectos de analytics. Dame un template completo de Sprint Review para Notion que incluya: resumen del sprint, items completados vs comprometidos, velocidad, impedimentos encontrados, y lecciones aprendidas. Formato listo para copiar en Notion."

Implementa ese template en tu workspace de Notion y usalo para documentar el Sprint 1 simulado del ejercicio.

## Que aprendiste

- Trello es ideal para equipos pequenos que empiezan con Agile: curva de aprendizaje minima.
- Notion combina base de datos, wiki y gestion de proyectos: perfecto para equipos de datos que necesitan documentar y trackear.
- Jira tiene las metricas mas completas (burndown, velocity, control chart) pero requiere mas configuracion inicial.
- La IA integrada en estas herramientas puede generar backlogs completos, criterios de aceptacion y notas de reunion en segundos.
- En Ecuador, la adopcion de herramientas Agile esta creciendo: dominarlas te diferencia en el mercado laboral.

## Reto extra

Conecta Trello con Notion usando Zapier (plan gratuito). Configura un Zap que: cuando una tarjeta en Trello se mueva a "Terminado", cree automaticamente una entrada en una base de datos de Notion llamada "Entregables del Sprint" con el titulo y la fecha. Documenta el proceso con capturas de pantalla en un Google Doc.
