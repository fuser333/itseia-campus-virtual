# Ejercicio Sesion 6: Daily Standups y Retrospectivas

**Materia:** Metodologias Agiles
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Dominar la estructura y facilitacion de Daily Standups efectivos y Sprint Retrospectivas productivas, identificar antipatrones comunes en equipos de datos ecuatorianos, y generar planes de mejora concretos usando las principales dinamicas de retrospectiva (4Ls, Start/Stop/Continue, Sailboat).

## Contexto

Un equipo de analytics en una empresa de telecomunicaciones de Ecuador termino su Sprint 3. Los dailies se convirtieron en reuniones de status de 45 minutos donde el gerente pregunta por cada tarea. Las retrospectivas de los sprints 1 y 2 generaron listas de problemas pero nadie implemento ninguna mejora. Este ejercicio te ensenara a facilitar estas dos ceremonias de forma que generen valor real.

## Instrucciones

1. Crea el archivo `S06_Standups_Retros_[tu_nombre].md`.

### PARTE A: DAILY STANDUP

2. Analiza estos 5 standups (identifica si son efectivos o tienen antipatrones):

```
EVALUACION DE DAILY STANDUPS

Standup A (20 minutos):
Ana: "Ayer trabaje en el modelo de churn. Hoy voy a seguir con eso.
      No tengo bloqueos."
Diego: "Ayer estuve en reuniones todo el dia. Hoy voy a ponerme al dia."
Sofia: "Ayer termine el EDA. Hoy voy a presentarle al gerente los resultados
        del EDA y necesito que me confirmen si el dataset del IESS esta
        disponible."
Gerente: "Sofia, ¿ya revisaste si el modelo usa todas las variables que te
          mande en el email? Tambien necesito que me hagas un reporte de
          las 10 mejores variables..."
[El equipo empieza a discutir la metodologia del modelo]

¿Este standup es efectivo? ___________
Antipatrones identificados (lista al menos 3):
1. ___________
2. ___________
3. ___________
¿Cuanto deberia durar este standup con 4 personas? ___________
Como Scrum Master, ¿que dices para cortar la discusion del modelo? ___________

---

Standup B (12 minutos):
[09:00:00 - todos de pie, pantallas apagadas]
Pedro: "Ayer: termine el pipeline de ingesta. Hoy: voy a conectar con la API
        del BCE. Bloqueo: ninguno."
Ana: "Ayer: modelo baseline con 82% de accuracy. Hoy: optimizar
      hiperparametros. Bloqueo: necesito que Pedro conecte la API para
      tener datos actualizados."
Diego: "Ayer: no pude avanzar, tuve que apagar un incidente en produccion.
        Hoy: retomar el dashboard. Bloqueo: ninguno."
Scrum Master: "Tenemos una dependencia: Ana necesita la API de Pedro.
               Pedro y Ana, quedense 5 min despues para coordinarse.
               ¿Algun otro tema critico? No. Perfecto, 9:12, todos a trabajar."

¿Este standup es efectivo? ___________
¿Que hizo bien el Scrum Master? ___________
```

3. Escribe el guion completo de un Daily Standup de 15 minutos para el equipo de analytics de CNT Ecuador (4 personas, Sprint 2 dia 6):

```
DAILY STANDUP — CNT Ecuador Analytics Team
Sprint 2, Dia 6 | Martes 9:00 AM

Contexto del equipo:
- Sofia Torres (Data Scientist): trabajando en modelo de prediccion de churn
- Diego Vasquez (Data Engineer): construyendo pipeline de datos de uso de red
- Ana Loja (BI Analyst): dashboard de indicadores de red por region
- Pedro Ortega (MLOps): configurando ambiente de produccion en AWS

Escribe el dialogo completo (10-15 lineas) incluyendo:
- Actualizacion de las 3 preguntas por cada persona
- Un bloqueo real que debe ser resuelto
- Un impedimento que el Scrum Master debe gestionar offline
- Cierre efectivo del Scrum Master en menos de 15 minutos

[Tu dialogo aqui]
```

### PARTE B: SPRINT RETROSPECTIVA

4. Facilita una Retrospectiva con la dinamica 4Ls:

```
RETROSPECTIVA SPRINT 3 — CNT Ecuador Analytics
Duracion: 60 minutos | Facilitador: [Tu nombre como SM]
Dinamica: 4Ls (Liked, Learned, Lacked, Longed for)

ESTRUCTURA DE LA SESION:
00-05 min: Crear ambiente seguro (regla: critica al proceso, no a personas)
05-20 min: Lluvia de ideas individual (post-its digitales en Miro/FigJam)
20-35 min: Agrupacion y votacion (dot voting: 3 votos por persona)
35-50 min: Discusion de top 3 temas priorizados
50-60 min: Compromisos de mejora SMART

RESULTADOS SIMULADOS (completa las celdas vacias con ideas realistas):

LIKED (Que salio bien):
1. "La daily de 15 min nos mantiene alineados sin perder tiempo"
2. "El pair programming entre Sofia y Ana acelero el dashboard 3 dias"
3. "___________" [Agrega 2 mas realistas para un equipo de datos]
4. "___________"

LEARNED (Que aprendimos):
1. "Los datos del IESS tienen errores en el 8% de cedulas — necesitamos validacion al inicio"
2. "El modelo de churn necesita datos de al menos 18 meses, no 12 como pensabamos"
3. "___________" [Agrega 2 mas]
4. "___________"

LACKED (Que nos falto):
1. "No tuvimos criterios de aceptacion claros para el modelo — el PO cambio la metrica objetivo"
2. "El ambiente de staging no estuvo listo hasta el dia 8 del sprint"
3. "___________" [Agrega 2 mas]
4. "___________"

LONGED FOR (Que desearíamos para el futuro):
1. "Tener acceso directo a la API del BCE sin depender de TI"
2. "Un ambiente de ML con GPU para entrenar modelos mas rapido"
3. "___________" [Agrega 2 mas]
4. "___________"

COMPROMISOS DE MEJORA (top 3, formato SMART):
1. Especifico: "Revisar y documentar el schema completo de datos del IESS"
   Responsable: Diego Vasquez
   Fecha: Dia 3 del Sprint 4
   Como medirlo: "Pull request con documento de schema en GitHub antes del dia 3"

2. Especifico: "___________"
   Responsable: ___________
   Fecha: ___________
   Como medirlo: ___________

3. Especifico: "___________"
   Responsable: ___________
   Fecha: ___________
   Como medirlo: ___________
```

5. Documenta los antipatrones de retrospectiva y como corregirlos:

```
ANTIPATRONES COMUNES EN RETROSPECTIVAS ECUADOR

Antipatron 1: "La lista de problemas que nadie implementa"
Descripcion: En cada retro se listan 20 problemas pero en el siguiente sprint
             siguen exactamente igual.
Causa raiz: ___________
Correccion: ___________

Antipatron 2: "La reunion de quejas"
Descripcion: La retro se convierte en una sesion de catarsis donde todos
             se quejan del gerente y de la empresa pero sin propuestas.
Causa raiz: ___________
Correccion: ___________

Antipatron 3: "Solo participa el Scrum Master"
Descripcion: El SM habla el 80% del tiempo, el equipo responde con monosilabos.
Causa raiz: ___________
Correccion: ___________

[Agrega un 4to antipatron que hayas observado en tu experiencia]
```

## Usa IA para...

> Abre Claude y escribe:
> "Soy Scrum Master de un equipo de 5 data scientists en Ecuador. Llevamos 4 sprints usando siempre la misma dinamica de retrospectiva (Start/Stop/Continue) y el equipo ya no participa con entusiasmo. Dame 3 dinamicas de retrospectiva alternativas y creativas que no haya usado, explicando paso a paso como facilitarlas en 60 minutos para un equipo tecnico de datos. Incluye materiales necesarios."

Elige la dinamica que mas te guste y escribe como la aplicarías para el equipo de CNT Ecuador del ejercicio.

## Que aprendiste

- Un Daily Standup efectivo dura 15 minutos maximo, de pie, con las 3 preguntas y sin discusiones tecnicas.
- El Scrum Master no es un reportero: su rol es detectar y eliminar impedimentos, no recopilar status.
- Las retrospectivas generan valor solo si los compromisos de mejora son SMART y se revisan al inicio del siguiente sprint.
- El formato 4Ls (Liked, Learned, Lacked, Longed for) es mas rico que Start/Stop/Continue por capturar aprendizajes explicitos.
- Crear un ambiente seguro (sin critica a personas) es prerequisito para que el equipo sea honesto en las retrospectivas.

## Reto extra

Crea una retrospectiva con la dinamica "Sailboat" (Barco de vela): el barco es el equipo, el viento son las cosas que nos impulsan, el ancla son lo que nos frena, las rocas son los riesgos, y la isla es el objetivo del proyecto. Dibujala (digitalmente o en papel y fotografia) aplicandola al Sprint 3 del equipo de CNT Ecuador con al menos 3 items por cuadrante. Presenta el resultado en clase como si fueras el Scrum Master facilitando la sesion.
