# F-01: Automatizacion de Reportes Financieros con IA

**Tipo:** Leccion
**Duracion:** 60 minutos
**Semana:** 2
**Herramientas:** ChatGPT Plus, Claude, Power BI con Q&A

---

## Objetivo de Aprendizaje

Al finalizar este modulo, podras construir un pipeline practico que convierte datos contables en bruto en reportes financieros completos, con notas NIIF, analisis de variaciones y formato listo para gerencia o auditoria externa, usando IA como asistente principal en cada etapa del proceso.

---

## 1. El problema con los reportes financieros actuales

Segun una encuesta de Deloitte (2024), el contador promedio dedica entre 6 y 12 horas a la preparacion de un reporte mensual completo. De ese tiempo:
- 30% es extraccion y organizacion de datos (labor mecanica)
- 25% es calculo de variaciones y ratios (labor semi-mecanica)
- 25% es redaccion de notas y analisis (labor de valor)
- 20% es revision y formato (labor de control)

La IA puede reducir dramaticamente las primeras dos categorias y asistir significativamente en la tercera. Eso significa que en lugar de 10 horas, el reporte puede estar listo en 3-4 horas con la misma o mejor calidad.

---

## 2. El pipeline completo: de datos a reporte

### Paso 1: Preparacion de datos (tu trabajo)

La IA no extrae datos de tu sistema contable automaticamente (a menos que hayas configurado integraciones especificas). Tu debes:
- Exportar el balance de comprobacion del mes desde tu software (Monica, Concar, Tella, SAP, etc.)
- Formato recomendado: Excel o CSV con columnas: Codigo, Cuenta, Saldo Anterior, Movimiento Debito, Movimiento Credito, Saldo Actual
- Limpiar datos: eliminar totales automaticos del software, verificar que no haya cuentas duplicadas

### Paso 2: Subida y analisis inicial (ChatGPT Plus — Code Interpreter)

Una vez que tienes el Excel limpio, en ChatGPT Plus:

1. Adjunta el archivo
2. Usa este prompt:

```
Adjunto el balance de comprobacion del mes [mes/ano] de [tipo de empresa anonimizada].
Por favor:
1. Identifica la estructura: activos, pasivos, patrimonio, ingresos y gastos
2. Calcula: activo total, pasivo total, patrimonio, utilidad del periodo
3. Verifica que el balance cuadre (Activo = Pasivo + Patrimonio)
4. Dame los 5 rubros con mayor variacion respecto al periodo anterior
5. Si hay alguna inconsistencia evidente en los datos, señalala

Presenta los resultados en tablas organizadas.
```

### Paso 3: Estado de Resultados estructurado

```
Con los datos del archivo adjunto, construye el Estado de Resultados del periodo
[mes/trimestre/ano] con el siguiente formato:

INGRESOS OPERACIONALES
  Ventas netas
  (-)Descuentos y devoluciones
TOTAL INGRESOS OPERACIONALES

COSTOS DE VENTAS
  Costo de mercaderia vendida
  (-)Inventario final
TOTAL COSTO DE VENTAS

UTILIDAD BRUTA
GASTOS OPERACIONALES
  Gastos administrativos
  Gastos de ventas
TOTAL GASTOS OPERACIONALES

UTILIDAD OPERACIONAL
INGRESOS/GASTOS NO OPERACIONALES
UTILIDAD ANTES DE PARTICIPACION TRABAJADORES
15% Participacion trabajadores
UTILIDAD ANTES DE IMPUESTO A LA RENTA
25% Impuesto a la Renta (o tasa aplicable)
UTILIDAD NETA DEL PERIODO

Incluye los valores en USD y el porcentaje de cada rubro sobre ingresos totales.
```

### Paso 4: Analisis de variaciones narrativo

Este es donde la IA genera el mayor ahorro de tiempo. La redaccion del analisis que antes tomaba 2 horas ahora toma 10 minutos de revision.

```
Con los datos del estado de resultados que acabas de generar, redacta el analisis
de variaciones para el informe gerencial del [mes/trimestre]. Compara con el
periodo anterior y con el presupuesto (si proporciono los datos).

El analisis debe:
- Explicar las variaciones mas importantes (mayores al 10% o significativas en monto)
- Señalar las causas probables de las variaciones (basandote en el contexto del negocio)
- Destacar 2-3 puntos de atencion que la gerencia deberia considerar
- Usar tono ejecutivo: directo, sin jerga tecnica excesiva

Contexto del negocio: [describe brevemente el tipo de empresa y sector]
```

---

## 3. Notas a los estados financieros bajo NIIF

Las notas son el componente que mas horas consume y donde la IA aporta mayor valor. A continuacion, un flujo de trabajo para las notas mas comunes.

### Nota de Politicas Contables (base para todo el juego de estados)

```
Redacta la nota de politicas contables para los estados financieros de una empresa
[tipo: comercial / industrial / servicios] ecuatoriana bajo NIIF para las PYMES
[o NIIF completas, segun aplique].

Incluye politicas para:
- Base de preparacion y cumplimiento con NIIF
- Moneda funcional y de presentacion (USD)
- Reconocimiento de ingresos
- Inventarios (metodo FIFO o promedio ponderado — especifica cual)
- Propiedad, planta y equipo (metodo de medicion y tasas de depreciacion)
- Cuentas por cobrar e incobrables
- Impuesto a la renta (corriente y diferido)

Formato: notas numeradas, redaccion formal para auditoria externa.
```

### Nota de Propiedad, Planta y Equipo

```
Con los siguientes datos de PPE, redacta la nota de revelacion bajo NIC 16
(o Seccion 17 NIIF PYMES):

[Pega aqui la tabla de activos con: descripcion, costo historico, depreciacion
acumulada al inicio, adiciones del periodo, bajas del periodo, depreciacion del
periodo, depreciacion acumulada al cierre, valor en libros al cierre]

La nota debe incluir: politica de depreciacion, vidas utiles por categoria,
movimiento del periodo en formato cuadro de evoluciones, y si hay algun activo
totalmente depreciado pero aun en uso, mencionarlo.
```

### Nota de Cuentas por Cobrar

```
Con los siguientes datos del analisis de cartera por antiguedad:

[Tabla con: 0-30 dias, 31-60 dias, 61-90 dias, 91-180 dias, mas de 180 dias,
montos por rango, clientes concentrados si aplica]

Redacta la nota de cuentas por cobrar bajo NIIF 9 (o Seccion 11 NIIF PYMES)
que incluya: politica de reconocimiento de incobrables, metodologia de provision,
movimiento de la provision del periodo, analisis de concentracion de credito.

La empresa [si tiene/no tiene] credito con el Banco [nombre anonimizado] con
garantia sobre estas cuentas — [incluir/excluir segun el caso].
```

---

## 4. Reportes para el SRI: el formulario 101 asistido por IA

El Formulario 101 (Declaracion del Impuesto a la Renta Sociedades) requiere conciliar la utilidad contable con la base imponible. La IA puede ayudar a estructurar esta conciliacion.

### Prompt para la conciliacion tributaria:

```
Necesito ayuda para estructurar la conciliacion tributaria del ejercicio 2025 para
una empresa ecuatoriana del sector comercial.

Utilidad contable segun estados financieros: $[monto]

Gastos no deducibles conocidos:
- Multas e intereses SRI: $[monto]
- Gastos sin sustento en comprobantes de venta: $[monto]
- [Otros gastos no deducibles]

Ingresos exentos:
- [Dividendos si aplica]
- [Otros]

Con estos datos, estructura la conciliacion tributaria que llega a la base imponible
para el calculo del Impuesto a la Renta. Incluye los campos del Formulario 101
en el orden correcto. Indica si hay algun rubro adicional que comunmente se olvida
en este tipo de empresa.
```

Nota importante: el resultado de la IA es un borrador que DEBES verificar articulo por articulo en el RLORTI vigente. Las reformas tributarias en Ecuador son frecuentes y el modelo puede tener informacion desactualizada.

---

## 5. Power BI con lenguaje natural: Q&A

Power BI Desktop es gratuito y tiene una funcion llamada Q&A que permite hacer preguntas a tus datos en espanol natural. Es una forma de IA mas limitada pero directamente conectada a tus datos reales sin necesidad de subirlos a plataformas externas.

### Configuracion basica:

1. Importa tu balance de comprobacion o estado de resultados a Power BI Desktop
2. En la vista de informe, selecciona "Insertar > Q&A"
3. Escribe preguntas como:
   - "Muestra las ventas por mes en grafico de barras"
   - "¿Cuales son las 10 cuentas con mayor saldo?"
   - "Compara gastos de ventas vs gastos administrativos"
   - "Tendencia de utilidad bruta de los ultimos 6 meses"

### Limitaciones de Power BI Q&A:

- Funciona mejor con datos bien estructurados y con nombres de columnas claros
- No redacta texto — solo genera visualizaciones y valores
- Requiere que los datos esten en el modelo de Power BI (no analiza Excel externo en tiempo real)

Para reportes completos, la combinacion optima es: Power BI para las visualizaciones + ChatGPT/Claude para el texto narrativo y las notas.

---

## Resumen del Modulo

- El pipeline de automatizacion tiene 4 pasos: preparacion de datos (tu), analisis inicial con IA, construccion de estados con IA, redaccion de notas y analisis narrativo con IA
- ChatGPT Plus con Code Interpreter es la mejor herramienta para procesar archivos Excel con datos financieros
- Claude es superior para redactar notas NIIF largas cuando le proporcionas el texto de la norma como referencia
- Las notas de politicas contables, PPE y cuentas por cobrar son las de mayor ahorro de tiempo con IA
- Para el Formulario 101, la IA estructura la conciliacion pero la verificacion normativa es tu responsabilidad
- Power BI Q&A es una alternativa de IA integrada a tus datos sin necesidad de plataformas externas

---

## Ejercicio Rapido

**Actividad 1 — Mini-reporte de 3 cuentas (20 minutos)**

Toma los saldos de 3 cuentas de un estado financiero real (anonimizado) o ficticio. Usa el prompt del Paso 4 (analisis de variaciones narrativo) para generar un parrafo ejecutivo sobre esas 3 cuentas. Evalua: ¿lo firmarías con revisiones minimas? ¿Que cambiarias?

**Actividad 2 — Nota NIIF en 10 minutos (10 minutos)**

Elige la nota NIIF que mas tiempo te toma redactar habitualmente. Usa los prompts de la Seccion 3 como base, adaptados a tu caso especifico. Mide el tiempo. El objetivo es que tengas un borrador del 80% listo en 10 minutos o menos.
