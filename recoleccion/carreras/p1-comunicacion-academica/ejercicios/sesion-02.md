# Ejercicio Sesion 2: Informes Tecnicos — Formato y Secciones Profesionales

**Materia:** Comunicacion Academica y Tecnica
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion:** 35 min

## Objetivo
Estructurar y redactar un informe tecnico completo con todas sus secciones estandar, usando como base un incidente o proyecto del contexto tecnologico ecuatoriano.

## Contexto (Ecuador)
El Ministerio de Telecomunicaciones de Ecuador (MINTEL), la Superintendencia de Telecomunicaciones (SUPERTEL) y todas las empresas que trabajan con sistemas informaticos exigen informes tecnicos estandar para auditorias, incidentes y proyectos. Saber redactar estos documentos es requisito para obtener contratos gubernamentales y certificaciones ISO.

## Instrucciones (paso a paso)

**Paso 1 — Conoce la estructura estandar (5 min)**
Un informe tecnico profesional tiene estas secciones obligatorias:

1. **Portada:** Titulo, autor, empresa, fecha, version
2. **Resumen ejecutivo:** Maximo 150 palabras, para quien no lee todo
3. **Introduccion:** Contexto, objetivo y alcance del informe
4. **Metodologia / Procedimiento:** Como se hizo el analisis o se ejecuto la tarea
5. **Resultados / Hallazgos:** Que se encontro (con datos, tablas, metricas)
6. **Analisis:** Interpretacion de los resultados
7. **Conclusiones:** Respuestas concretas al objetivo del informe
8. **Recomendaciones:** Acciones especificas y prioritizadas
9. **Anexos:** Logs, capturas, codigo, referencias (si aplica)

**Paso 2 — Redacta el informe completo (20 min)**
Usa este escenario real de Ecuador:

**Escenario:** Eres analista de datos en CNT EP (Corporacion Nacional de Telecomunicaciones). El jefe de sistemas te pide un informe tecnico sobre el siguiente incidente:

*"El 20 de marzo de 2026, entre las 14:00 y las 17:30, el portal de autogestion de CNT (autoservicio.cnt.net.ec) presento tiempos de respuesta superiores a 30 segundos para el 78% de los usuarios. El equipo identifico que el problema fue una consulta SQL no optimizada en el modulo de facturacion que se activo con la actualizacion v2.4.1 desplegada ese dia a las 13:45. Se revirtio la actualizacion a las 17:30 restableciendose el servicio normal."*

Redacta cada seccion del informe. Para secciones que requieren datos que no tienes (como el anexo de logs), escribe "[VER ANEXO A]" y describe brevemente que contendria.

**Paso 3 — Evalua con ChatGPT (10 min)**
Comparte tu informe con este prompt:

```
Soy estudiante de comunicacion tecnica. Redacte este informe tecnico de incidente para CNT Ecuador:
[pega tu informe]
Por favor:
1. Evalua cada seccion: esta completa? Es clara? Falta algo importante?
2. El resumen ejecutivo puede ser leido por alguien no tecnico (como un gerente general)?
3. Las recomendaciones son especificas y accionables o son vagas?
4. Que seccion esta mejor escrita y cual necesita mas trabajo?
5. Dame el puntaje global segun estandares de documentacion tecnica profesional
```

## Usa IA para...
Recibir una evaluacion seccion por seccion y detectar si el resumen ejecutivo es verdaderamente comprensible para un publico no tecnico.

## Que aprendiste
- El resumen ejecutivo es la parte mas importante: muchos gerentes solo leen eso
- Las recomendaciones deben ser especificas: "mejorar el sistema" no es una recomendacion, "optimizar la consulta SQL en el modulo X con indice sobre campo Y antes del 1 de abril" si lo es
- Un buen informe tecnico puede ser reproducido por otra persona sin necesidad de explicacion adicional

## Reto extra
Descarga la plantilla de informe de incidentes del portal del MINTEL o busca en Google "informe tecnico de incidente ISO 20000". Compara su estructura con la que usaste. Que secciones agregan que no estaban en tu plantilla?
