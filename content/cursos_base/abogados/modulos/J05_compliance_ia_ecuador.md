# J-05: Compliance — Marco Legal de la IA en Ecuador

**Tipo:** Leccion
**Duracion:** 30 minutos
**Semana:** 4 de 4
**Herramientas:** ChatGPT Plus, Perplexity AI (para investigacion de normativa actualizada)

---

## Objetivo de Aprendizaje

Al finalizar este modulo, conoceras el estado actual del marco normativo sobre inteligencia artificial en Ecuador y America Latina, las implicaciones de la LOPDP para el uso de IA en la practica juridica, los riesgos de responsabilidad profesional al usar IA, y estara preparado para asesorar a clientes empresariales sobre compliance en IA.

---

## Advertencia sobre Actualizacion

Este es probablemente el modulo que mas rapido envejece del curso. El marco regulatorio de la IA evoluciona mes a mes. La informacion aqui presentada es valida a marzo de 2026, pero te recomendamos verificar el estado de los proyectos de ley con Perplexity AI o el buscador del SATJE antes de asesorar a clientes en esta materia.

---

## Seccion 1: El vacio regulatorio de la IA en Ecuador — Estado actual

A diferencia de la Union Europea, que en 2024 aprobo el AI Act (primera ley integral sobre IA del mundo), Ecuador carece a la fecha de 2026 de una ley especifica sobre inteligencia artificial. Esto tiene implicaciones directas para los abogados:

**Lo que NO existe en Ecuador:**
- Ley de Inteligencia Artificial (no aprobada, hay anteproyectos en discusion)
- Reglamento especifico sobre uso de IA en servicios profesionales
- Marco regulatorio sobre sistemas de IA de alto riesgo
- Obligaciones especificas de transparencia para empresas que usan IA

**Lo que SI existe y aplica por analogia o directamente:**
- Ley Organica de Proteccion de Datos Personales (LOPDP, 2021) — aplica plenamente
- Codigo de Comercio — regula contratos electronicos y firmas digitales
- Ley de Comercio Electronico — aplica a servicios digitales
- Constitucion 2008, art. 66 — derechos digitales y privacidad
- Codigo Organico Integral Penal (COIP) — tipos penales aplicables a conductas con IA
- Ley de Propiedad Intelectual — derechos de autor sobre outputs de IA

### La posicion del Ecuador frente a la IA en 2026

Ecuador ha adoptado una postura de "regulacion blanda" similar a la mayoria de America Latina, priorizando la adopcion de tecnologia sobre la restriccion. El Ministerio de Telecomunicaciones y de la Sociedad de la Informacion (MINTEL) ha publicado documentos de politica publica sobre transformacion digital que mencionan la IA, pero sin fuerza normativa vinculante.

La Superintendencia de Bancos ha comenzado a exigir a entidades financieras que documenten el uso de algoritmos en decision de credito, lo que es un primer paso hacia regulacion sectorial.

---

## Seccion 2: La LOPDP y el uso de IA con datos de clientes — Profundizacion

Ya introdujimos la LOPDP en el modulo T-03. En este modulo exploramos sus implicaciones especificas para el ejercicio juridico con IA.

### Toma de decisiones automatizada (art. 24 LOPDP)

El articulo 24 de la LOPDP establece que las personas tienen derecho a no ser objeto de decisiones basadas unicamente en tratamiento automatizado de datos que les produzcan efectos juridicos significativos.

**Implicacion para abogados:** Si un bufete usara IA para tomar decisiones automaticas sobre si aceptar un caso, calcular honorarios o calificar el riesgo de un cliente sin revision humana, podria estar vulnerando este articulo. La IA como herramienta de apoyo a la decision humana es compatible con la ley; la IA como tomadora autonoma de decisiones que afectan al cliente, no.

### Transferencia internacional de datos (art. 55-60 LOPDP)

Cuando ingresas datos de un cliente ecuatoriano en ChatGPT (servidores en EE.UU.) o Claude (servidores AWS), estas realizando una "transferencia internacional de datos". La LOPDP requiere que estas transferencias cuenten con:
- Garantias adecuadas (contrato con clausulas de proteccion de datos) O
- Que el pais receptor tenga nivel de proteccion equivalente al ecuatoriano O
- Consentimiento explicito del titular

En la practica, OpenAI y Anthropic tienen politicas de privacidad que incluyen clausulas de proteccion de datos (DPA — Data Processing Addendum) disponibles en sus versiones empresariales. Para la version consumer (ChatGPT Plus, Claude Pro), el nivel de cumplimiento es inferior.

**Recomendacion practica:** Para clientes cuyos datos son especialmente sensibles, obtener consentimiento escrito informado antes de usar herramientas de IA externas, o usar exclusivamente herramientas enterprise con DPA firmado.

### Notificacion de violaciones de seguridad

Si tu firma usa IA y ocurre una brecha de seguridad que exponga datos de clientes (incluido un acceso no autorizado a conversaciones de IA), la LOPDP obliga a notificar a la Autoridad de Proteccion de Datos (Superintendencia de Proteccion de Datos cuando este operativa) y a los titulares afectados en un plazo de 72 horas desde el conocimiento del incidente.

---

## Seccion 3: Derechos de autor y propiedad intelectual en outputs de IA

Esta es una area juridica en plena construccion en Ecuador y en el mundo. Las preguntas son relevantes para abogados tanto en su practica propia como para asesorar a clientes.

### Quien es el autor de un texto generado por IA?

La Ley de Propiedad Intelectual ecuatoriana (Codificacion 2006, art. 5) define al autor como la persona fisica que crea la obra. Los outputs de IA presentan el problema de que no existe creador humano en el sentido tradicional.

**Estado actual en Ecuador:** No hay pronunciamiento oficial de la autoridad competente (SENADI — Servicio Nacional de Derechos Intelectuales). La tendencia doctrinal emergente es que:
- Los outputs de IA no tienen proteccion de derechos de autor si son generados autonomamente
- Si el usuario agrega un nivel significativo de creatividad (seleccion, edicion, curaduria), puede reclamar autoria sobre el resultado final editado
- Los contratos y documentos juridicos tienen baja creatividad y alta funcionalidad, por lo que la cuestion de autoria es menos relevante para documentos procesales

**Implicacion practica:** Los documentos juridicos que generas con IA (contratos, escritos) y que luego revisas y adaptas, pueden considerarse tu obra profesional como abogado para efectos practicos. Pero si un cliente te pregunta si puedes garantizar que el contrato no viola derechos de alguien, la respuesta honesta es que el marco juridico ecuatoriano aun no es definitivo en esta materia.

### Outputs de IA como prueba en juicio

Una pregunta emergente: puede un output de ChatGPT o Claude usarse como prueba en un proceso ecuatoriano?

**Marco aplicable:** El COGEP no tiene disposicion especifica sobre IA como medio probatorio. Sin embargo:
- Los documentos electronicos son admisibles bajo art. 194 COGEP con verificacion de autenticidad
- Un output de IA podria admitirse como un documento creado por el abogado que lo usa (similar a un informe de investigacion)
- La parte contraria podria impugnar la confiabilidad de la fuente IA

**Recomendacion:** Nunca presentes un output de IA directamente como "prueba de X". Usalo como insumo para construir tu argumento, que debe sustentarse en fuentes verificables.

---

## Seccion 4: Responsabilidad profesional del abogado al usar IA

Esta seccion toca el nervio mas sensible del tema: cuando la IA genera un error que causa danho a un cliente, quien responde?

### El principio de responsabilidad profesional no cambia

El Codigo de Etica del Foro de la Abogacia ecuatoriana establece que el abogado responde por su diligencia profesional. Ninguna ley ni reglamento actual en Ecuador contemplan la IA como circunstancia que modifique esta responsabilidad. Si presentas una demanda con citas legales incorrectas porque las tomo de ChatGPT sin verificar, la responsabilidad es tuya.

### Escenarios de riesgo disciplinario

**Escenario 1:** Presentas un escrito con una sentencia inventada por IA. El juez lo detecta. Ademas de la sancion del tribunal, el cliente puede demandarte por responsabilidad civil profesional.

**Escenario 2:** Usas IA para redactar un contrato con una clausula que resulta nula bajo el Codigo Civil (la IA la tomo de normativa de otro pais). El cliente sufre un perjuicio. Eres responsable.

**Escenario 3:** Ingresas datos confidenciales de un cliente en una herramienta de IA publica. La informacion es eventualmente accedida por terceros. Ademas de la responsabilidad por violacion de secreto profesional, podrias enfrentar responsabilidad bajo la LOPDP.

### Protocolo de uso responsable de IA — Para incorporar a la firma

Si tu bufete usa IA, considera formalizar estas practicas:

1. **Politica de uso de IA:** documento interno que define que herramientas estan autorizadas, para que tareas, y con que controles
2. **Procedimiento de verificacion:** todo documento con contenido generado por IA es revisado por un abogado responsable antes de salir del bufete
3. **Registro de uso:** cuando se usa IA para tareas de alto valor (demandas, contratos importantes), se deja registro de que fue generado con IA y por quien fue revisado
4. **Consentimiento del cliente:** en clientes que pueden ser conservadores o que lo soliciten, informar que se usan herramientas tecnologicas de IA como parte del proceso de trabajo

---

## Seccion 5: Como asesorar a clientes empresariales sobre compliance en IA

Tus clientes empresariales que usan IA en sus operaciones necesitaran asesoria juridica en esta area. Aunque la regulacion ecuatoriana es aun incipiente, hay obligaciones actuales y riesgos emergentes que debes conocer.

### Obligaciones actuales para empresas que usan IA en Ecuador

**Bajo la LOPDP:**
- Si la IA procesa datos personales de clientes, empleados o usuarios, deben cumplir con los principios del art. 10 (licitud, lealtad, transparencia, minimizacion, calidad)
- Deben tener base legal para el tratamiento (consentimiento o interes legitimo documentado)
- Si toman decisiones automatizadas sobre personas, deben garantizar el derecho del art. 24 (revision humana)

**Bajo el Codigo de Trabajo:**
- Si la empresa usa IA para vigilar a empleados (monitoreo de productividad, analisis de correos), hay riesgos de vulneracion del derecho a la intimidad del trabajador
- Las decisiones de despido basadas unicamente en analisis de IA son juridicamente riesgosas

**Bajo el Codigo de Comercio y normas de competencia:**
- Si la empresa usa IA para fijar precios, existe riesgo de conductas anticompetitivas si el algoritmo coordina precios con competidores indirectamente

### Lista de verificacion de compliance IA para empresas

Cuando un cliente te pida asesorar sobre cumplimiento en IA, estas son las preguntas clave:

```
1. INVENTARIO DE IA: Que sistemas de IA usa la empresa? Para que procesos?
2. DATOS PERSONALES: Los sistemas de IA procesan datos de clientes, empleados o usuarios?
3. BASE LEGAL: Hay consentimiento o base legal documentada para ese tratamiento?
4. DECISIONES AUTOMATIZADAS: La IA toma decisiones que afectan a personas sin revision humana?
5. CONTRATOS CON PROVEEDORES IA: Los contratos con proveedores incluyen clausulas de proteccion de datos?
6. TRANSFERENCIAS INTERNACIONALES: Datos ecuatorianos son procesados en servidores extranjeros?
7. RIESGOS LABORALES: La IA se usa para monitorear o evaluar empleados?
8. PROPIEDAD INTELECTUAL: Los outputs de IA son comercializados? Hay riesgo de infraccion?
9. TRANSPARENCIA: La empresa informa a sus usuarios que usa IA en sus servicios?
10. INCIDENTES: Hay protocolo de respuesta ante brechas de seguridad de sistemas IA?
```

---

## Resumen del Modulo

- Ecuador no tiene ley especifica de IA en 2026, pero la LOPDP, el COIP, la Ley de PI y el Codigo de Comercio aplican
- La LOPDP obliga al cumplimiento de obligaciones de tratamiento de datos cada vez que se usa IA con informacion de clientes
- Los derechos de autor sobre outputs de IA son un area juridica en construccion: usar con criterio conservador
- La responsabilidad profesional del abogado no se modifica por el uso de IA: los errores siguen siendo imputables al abogado
- Los clientes empresariales necesitaran asesoría en compliance IA: esta es una nueva area de practica para abogados preparados

---

## Ejercicio Rapido (5 minutos)

Usa Perplexity AI con este prompt:

"Busca si en Ecuador existe algun proyecto de ley sobre inteligencia artificial presentado en la Asamblea Nacional en 2025 o 2026. Incluye el nombre del proyecto, el proponente y el estado actual. Cita las fuentes."

Este ejercicio te mantiene actualizado sobre la evolucion normativa, que es el mayor desafio en esta area: la ley avanza mas rapido que los cursos.

---

## Cierre del Curso

Has completado los 9 modulos del curso IA para Abogados y Profesionales Juridicos. En estas 4 semanas has:

1. Entendido como funciona la IA generativa y sus limitaciones especificas en derecho
2. Dominado los prompts para las herramientas mas utiles (ChatGPT, Claude, Copilot)
3. Aprendido el protocolo de seguridad y confidencialidad para uso responsable de IA
4. Desarrollado criterio critico para identificar errores y alucinaciones
5. Aplicado IA en investigacion jurisprudencial con SATJE y CNJ
6. Redactado y revisado contratos bajo normativa ecuatoriana con IA
7. Construido matrices de riesgo legal con apoyo de IA
8. Ejecutado el flujo completo de preparacion procesal en el caso Andrade
9. Conoces el marco regulatorio y los riesgos de responsabilidad profesional

El objetivo nunca fue convertirte en experto en tecnologia. Fue que tengas un conjunto de herramientas practicas que multipliquen tu capacidad de trabajo como abogado ecuatoriano. La IA es un asistente poderoso. El criterio juridico sigue siendo tuyo.

**El futuro no se espera. Se construye.**
— Hector Velasco, Fundador ITSEIA
