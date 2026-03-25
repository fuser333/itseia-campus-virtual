# F-04: Analisis Predictivo para Presupuestos

**Tipo:** Leccion
**Duracion:** 45 minutos
**Semana:** 4
**Herramientas:** ChatGPT Plus con Code Interpreter, Power BI Desktop (gratuito), Excel con funciones de pronostico

---

## Objetivo de Aprendizaje

Al finalizar este modulo, podras usar IA para construir proyecciones financieras mas solidas, analizar tendencias de ventas, construir escenarios What-If y presentar proyecciones de manera ejecutiva a un directorio no financiero, con la herramienta que tengas disponible.

---

## 1. Por que los presupuestos tradicionales fallan

El presupuesto estatico, construido en octubre con datos del ano anterior y ajustado con un porcentaje de inflacion, tiene un problema fundamental: asume que el futuro es una extrapolacion lineal del pasado. En un entorno donde los precios cambian, el tipo de cambio fluctua y la demanda es variable, ese modelo es demasiado rigido.

El presupuesto base cero (ZBB) resuelve parte del problema pero consume semanas de trabajo. El analisis de escenarios requiere calculos complejos en Excel que muchos contadores evitan.

La IA no reemplaza el juicio del contador en la construccion del presupuesto, pero si puede:
- Analizar series de tiempo historicas y detectar estacionalidad y tendencias
- Generar automaticamente los tres escenarios (optimista, base, pesimista) con sus supuestos
- Explicar las proyecciones en lenguaje claro para directivos no financieros
- Hacer actualizaciones rapidas cuando cambian los supuestos ("y si la inflacion es 5% en vez de 3%")

---

## 2. Analisis de tendencias con ChatGPT Plus

### Preparacion del dataset historico

Para un analisis predictivo basico, necesitas al menos 12 meses de datos historicos. La estructura ideal:

| Periodo | Ventas | Costo_Ventas | Gastos_Admin | Gastos_Ventas | Utilidad_Bruta |
|---------|--------|-------------|--------------|---------------|----------------|
| Ene-24  | 95,000 | 65,000      | 18,000       | 12,000        | 30,000         |
| Feb-24  | 88,000 | 61,500      | 18,200       | 11,500        | 26,500         |
| ...     | ...    | ...         | ...          | ...           | ...            |

### Prompt para analisis de tendencias:

```
Adjunto un archivo Excel con 12 meses de datos financieros de una empresa
comercial ecuatoriana. Por favor:

1. TENDENCIAS: Identifica la tendencia general de cada variable (creciente,
   decreciente, estable) con el porcentaje de variacion promedio mensual
2. ESTACIONALIDAD: ¿Hay meses con picos o valles consistentes? Describe el
   patron estacional si existe
3. CORRELACIONES: ¿Las variaciones en ventas se correlacionan con variaciones
   en los costos? ¿El margen bruto es estable o variable?
4. PRONOSTICO BASE: Con estas tendencias, proyecta los proximos 6 meses
   asumiendo que las condiciones actuales continuan
5. PUNTOS DE ATENCION: ¿Hay algun mes historico que parece anormal? ¿Hay
   una tendencia preocupante que la gerencia deberia saber?

Genera un grafico de lineas con el historico y la proyeccion claramente diferenciados.
```

---

## 3. Construccion de escenarios con IA

El analisis de escenarios es una de las herramientas mas poderosas del contador para asesorar a la gerencia, pero requiere tiempo para construir los tres modelos y calcular los impactos. Con IA, el proceso es mucho mas rapido.

### Prompt para los tres escenarios:

```
Tengo los siguientes datos base para el presupuesto 2026 de una empresa
importadora ecuatoriana:

Datos historicos 2025:
- Ventas netas: $1,850,000
- Margen bruto: 32%
- Gastos operativos fijos: $285,000/ano
- Gastos operativos variables: 8% de ventas
- Tipo de cambio promedio compra USD/: ya dolarizado, pero tengo proveedores
  que me facturan en EUR, tipo de cambio promedio 2025: 1.08 USD/EUR

Supuestos para construir tres escenarios 2026:

ESCENARIO PESIMISTA:
- Caida de ventas del 15% por contraccion economica
- Inflacion de costos del 8%
- Gastos operativos aumentan 5%

ESCENARIO BASE:
- Crecimiento de ventas del 5%
- Inflacion de costos del 4%
- Gastos operativos aumentan 3%

ESCENARIO OPTIMISTA:
- Crecimiento de ventas del 18% por apertura de nueva linea
- Inflacion de costos del 3%
- Gastos operativos aumentan 6% (por expansion)

Para cada escenario, calcula: ventas, costo de ventas, utilidad bruta, gastos
operativos totales, EBITDA aproximado y utilidad antes de impuestos.

Presenta en tabla comparativa con los tres escenarios en columnas.
Añade una fila de "Variacion vs 2025 real" para cada indicador.
```

---

## 4. Presupuesto base cero asistido por IA

El ZBB requiere justificar cada gasto desde cero en lugar de partir del presupuesto del ano anterior. La IA puede acelerar la construccion de la justificacion de cada centro de costo.

### Prompt para justificacion de centro de costo:

```
Estoy construyendo el presupuesto base cero del departamento de contabilidad
para el ejercicio 2026. El departamento tiene:
- 1 contador senior, salario $1,800/mes
- 2 asistentes contables, salario $550/mes cada uno
- Software contable Monica: $1,200/ano
- Archivos y papeleria: estimado historico $85/mes
- Capacitacion: sin presupuesto asignado actualmente

Ayudame a:
1. Identificar las funciones esenciales que justifican cada recurso (enfoque ZBB)
2. Sugerir si hay funciones que podrian automatizarse con IA para optimizar el
   headcount a largo plazo
3. Recomendar un presupuesto de capacitacion en IA para el equipo contable (con
   justificacion de ROI)
4. Identificar gastos que podrian eliminarse o reducirse sin afectar la funcion

Formato: tabla con Recurso / Justificacion ZBB / Monto propuesto / Alternativa
de optimizacion.
```

---

## 5. Power BI para visualizar proyecciones

Power BI Desktop es gratuito y permite crear dashboards de presupuesto vs real que se actualizan automaticamente cuando los datos cambian.

### Configuracion basica de un dashboard presupuestal:

**Paso 1:** Crea dos tablas en Excel:
- `Presupuesto_2026`: Mes, Cuenta, Monto_Presupuestado
- `Real_2026`: Mes, Cuenta, Monto_Real (se actualiza cada mes)

**Paso 2:** Importa ambas tablas a Power BI Desktop. Crea una relacion por Mes y Cuenta.

**Paso 3:** Usa Power BI Q&A para crear las visualizaciones:
- "Compara presupuesto vs real por mes en grafico de columnas agrupadas"
- "Muestra la variacion porcentual por cuenta como tabla con formato condicional"
- "Crea un medidor (gauge) con el % de ejecucion presupuestal acumulada"

**Paso 4:** Publica en Power BI Service (gratuito con cuenta Microsoft) y comparte el link con gerencia para acceso en tiempo real.

---

## 6. Comunicar proyecciones a directivos no financieros

Este es un skill que la IA puede mejorar significativamente. El directorio no quiere ver tablas de 200 filas — quiere entender en 5 minutos si el negocio va bien.

### Prompt para traducir finanzas a narrativa ejecutiva:

```
Tengo los siguientes resultados del analisis presupuestal del Q1 2026:

[Pega aqui la tabla comparativa presupuesto vs real]

Redacta una presentacion narrativa de 3 parrafos para el Comite Directivo que:
- Parrafo 1: Resumen de la situacion (¿estamos bien, en alerta o en problema?)
- Parrafo 2: Las 2-3 variaciones mas importantes y su causa probable
- Parrafo 3: Recomendaciones especificas para los proximos 90 dias

Tono: ejecutivo, directo, sin jerga contable excesiva. El directorio incluye
el CEO (con perfil comercial) y dos inversionistas (perfil financiero general).
Maximo 200 palabras total.
```

---

## Resumen del Modulo

- El presupuesto estatico basado en porcentaje del ano anterior tiene limitaciones graves para tomar decisiones en entornos cambiantes
- ChatGPT Plus con Code Interpreter analiza series de tiempo historicas, detecta estacionalidad y genera proyecciones en minutos
- El analisis de tres escenarios (pesimista/base/optimista) se puede construir con IA a partir de supuestos que defines tu
- El ZBB asistido por IA justifica cada gasto desde la funcion que cumple, no desde el historico
- Power BI convierte el presupuesto vs real en un dashboard ejecutivo actualizable
- La narrativa ejecutiva — traducir los numeros a historia — es donde la IA aporta mas valor comunicativo

---

## Ejercicio Rapido

**Actividad 1 — Escenario en 15 minutos**

Toma los datos reales de ingresos de los ultimos 6 meses de cualquier empresa con la que trabajes (anonimizados). Usa el prompt de la Seccion 3 (ajustado a tu contexto) para generar los tres escenarios para los proximos 3 meses. Compara el escenario base que genera la IA con tu propio pronostico intuitivo. ¿Coinciden? ¿Donde difieren?

**Actividad 2 — Narrativa de 5 minutos**

Toma los resultados del mes mas reciente de uno de tus clientes. Usa el prompt de comunicacion ejecutiva para redactar el parrafo de presentacion a directorio. Enviaselo al cliente como parte de tu entregable mensual (con tu revision y ajustes). Mide la reaccion.
