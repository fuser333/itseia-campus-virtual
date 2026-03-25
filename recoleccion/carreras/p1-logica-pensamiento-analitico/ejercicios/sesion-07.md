# Ejercicio Sesion 7: Reconocimiento de Patrones y Abstraccion con IA

**Materia:** Logica y Pensamiento Analitico
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion:** 40 min

## Objetivo
Aplicar reconocimiento de patrones y abstraccion para simplificar problemas complejos, identificando lo que es esencial y eliminando lo irrelevante en datasets y procesos ecuatorianos.

## Contexto (Ecuador)
El INEC (Instituto Nacional de Estadistica y Censos) del Ecuador publica datos del censo cada 10 anos. Cuando los analistas de datos trabajan con esos millones de registros, no ven personas individuales: buscan patrones (edades, migracion, nivel educativo) y abstraen los datos a modelos que sirven para politicas publicas. Esta es la habilidad central de cualquier profesional de IA.

## Instrucciones (paso a paso)

**Paso 1 — Reconocimiento de patrones (10 min)**
Analiza esta tabla ficticia pero realista de datos de ventas de una tienda en Guayaquil (2024):

| Mes | Ventas ($) | Temperatura promedio | Evento |
|-----|------------|---------------------|--------|
| Enero | 45,000 | 28°C | Fin de vacaciones |
| Febrero | 38,000 | 29°C | - |
| Marzo | 52,000 | 27°C | Inicio clases Costa |
| Abril | 41,000 | 26°C | - |
| Mayo | 39,000 | 25°C | - |
| Junio | 48,000 | 22°C | - |
| Julio | 55,000 | 21°C | Inicio clases Sierra |
| Agosto | 42,000 | 20°C | - |
| Septiembre | 40,000 | 21°C | - |
| Octubre | 44,000 | 22°C | - |
| Noviembre | 58,000 | 24°C | Navidad anticipada |
| Diciembre | 72,000 | 26°C | Navidad / Fiestas |

Responde:
1. Que patron de ventas identificas? (meses altos vs bajos)
2. Hay correlacion entre temperatura y ventas?
3. Que factor parece tener mayor impacto en las ventas altas?

**Paso 2 — Abstraccion (15 min)**
La abstraccion significa quedarse solo con lo esencial. Para el problema "predecir ventas del proximo mes":

a) Lista TODOS los factores que podrian afectar las ventas (al menos 10)
b) Ahora elimina los que NO son medibles o no estan disponibles como dato
c) Queda tu "modelo abstracto": los 3-4 factores clave que usarias

**Paso 3 — Valida con Claude (15 min)**
Comparte tu analisis con Claude:

```
Soy estudiante de pensamiento computacional en Ecuador. Analice esta tabla de ventas:
[describe los patrones que encontraste]
Mi modelo abstracto para predecir ventas usa estos factores: [lista tus 3-4 factores]
Por favor:
1. Son correctos los patrones que identifique?
2. Mi modelo abstracto es razonable para un negocio en Ecuador?
3. Que factor importante podria estar faltando en mis datos?
4. Si tuviera que crear una regla simple (patron) para saber cuando las ventas seran altas, como la formularias?
5. Como se relaciona este ejercicio con lo que hacen los modelos de Machine Learning?
```

## Usa IA para...
Validar los patrones que identificaste y conectar el ejercicio con los conceptos de ML que vienen en semestres superiores.

## Que aprendiste
- El reconocimiento de patrones es buscar repeticion, correlacion y anomalias en datos
- La abstraccion elimina el ruido para quedarse con las variables que realmente importan
- Un modelo de ML es basicamente un algoritmo que automatiza este proceso con millones de datos

## Reto extra
Ve al portal de datos abiertos del Ecuador (https://www.datosabiertos.gob.ec) y descarga cualquier dataset que te llame la atencion. Identifica 3 patrones y escribe el modelo abstracto (variables clave) que usarias para hacer una prediccion con esos datos.
