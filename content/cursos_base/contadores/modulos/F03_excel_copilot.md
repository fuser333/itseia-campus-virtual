# F-03: Excel + IA: Copilot y Automatizacion

**Tipo:** Demo Interactivo
**Duracion:** 45 minutos
**Semana:** 3
**Herramientas:** Microsoft 365 con Copilot, Excel Online, ChatGPT (alternativa para formulas)

---

## Objetivo de Aprendizaje

Al finalizar este modulo, podras usar Microsoft Copilot en Excel para realizar en minutos tareas que antes tomaban horas: reconciliaciones bancarias, tablas dinamicas, formulas complejas, graficos de variaciones y macros de automatizacion, usando instrucciones en espanol sin necesidad de memorizar sintaxis.

---

## 1. El estado actual de Excel con IA

Excel sigue siendo el software mas usado por contadores en Ecuador y en el mundo. Con la llegada de Copilot en Microsoft 365 y la capacidad de ChatGPT para generar formulas y macros, el Excel que conoces se convirtio en una herramienta significativamente mas poderosa.

Hay dos caminos dependiendo de tu acceso:

**Camino A: Tienes Microsoft 365 Business Standard o superior (con Copilot activado)**
El Copilot esta integrado directamente en Excel. Puedes escribir instrucciones en lenguaje natural y Copilot ejecuta las acciones en tu hoja de calculo en tiempo real.

**Camino B: Tienes Excel normal (sin Copilot) o acceso gratuito**
Usas ChatGPT para generar formulas, codigos VBA o instrucciones paso a paso, y las aplicas manualmente en Excel. 80% del valor con el 20% de la comodidad.

Este modulo cubre ambos caminos.

---

## 2. Copilot en Excel: activacion y primeros pasos

### Requisitos para Copilot en Excel

- Plan: Microsoft 365 Business Standard ($12.50 USD/usuario/mes) o superior
- El archivo debe estar guardado en OneDrive o SharePoint (no en disco local)
- Actualizacion de Microsoft 365 al dia
- El boton Copilot aparece en la cinta de opciones en la pestana "Inicio"

### Primera apertura

Cuando abres Copilot en Excel, aparece un panel lateral con un campo de texto. Ahi escribes tus instrucciones en espanol.

---

## 3. Casos de uso demostrados: Copilot en accion

### Demo 1: Reconciliacion bancaria automatica

Tienes dos tablas en Excel: los movimientos del libro contable y el estado de cuenta bancario del mes. La reconciliacion manual toma 2-3 horas. Con Copilot:

**Instruccion a Copilot:**
```
Tengo dos tablas en esta hoja: "Libro_Contable" con columnas fecha/descripcion/monto
y "Estado_Banco" con columnas fecha/descripcion/monto. Compara ambas tablas e
identifica las transacciones que aparecen en el libro pero no en el banco, y las
que aparecen en el banco pero no en el libro. Crea una nueva hoja llamada
"Diferencias" con los resultados organizados en dos secciones.
```

**Lo que Copilot hace:**
- Analiza ambas tablas
- Cruza los registros usando fecha y monto como clave
- Genera la hoja de diferencias con las partidas conciliatorias
- Lo que tardabas 2 horas ahora tarda 3 minutos de revision

### Demo 2: Tabla dinamica con analisis de variacion

Tienes el libro mayor del ano completo en una hoja. Quieres ver la comparacion mensual de gastos operativos por categoria.

**Instruccion a Copilot:**
```
Con los datos de la hoja "Libro_Mayor", crea una tabla dinamica que muestre
los gastos operativos por categoria (columna Cuenta) en filas y los meses
del ano en columnas. Incluye el total del ano en la ultima columna y resalta
las celdas donde el gasto aumento mas del 15% respecto al mes anterior.
```

### Demo 3: Formula compleja en lenguaje natural

Necesitas calcular el saldo vencido de cada cliente segun antiguedad de cartera.

**Instruccion a Copilot:**
```
En la columna G, crea una formula que calcule la categoria de antiguedad de
cada cuenta por cobrar basandose en la columna F (dias vencidos):
- "Corriente" si dias vencidos <= 0
- "1-30 dias" si entre 1 y 30
- "31-60 dias" si entre 31 y 60
- "61-90 dias" si entre 61 y 90
- "Mas de 90 dias" si mayor a 90
```

Lo que antes requeria memorizar la sintaxis de SI anidados, ahora es una instruccion en espanol.

---

## 4. ChatGPT para formulas Excel (el camino sin Copilot)

Si no tienes Copilot, ChatGPT genera formulas Excel de cualquier nivel de complejidad. El truco es describir exactamente lo que necesitas.

### Generacion de formulas

**Prompt:**
```
Necesito una formula Excel para la siguiente tarea:
- Los datos estan en el rango A2:F500
- Columna A: fecha de factura
- Columna B: codigo de cliente
- Columna C: monto facturado
- Columna D: monto cobrado
- Columna E: fecha de cobro

En la columna G, quiero calcular los dias transcurridos entre la fecha de factura
y la fecha de cobro. Si la columna E esta vacia (no cobrado), usar la fecha de
hoy como referencia.

Dame la formula lista para pegar en G2 y arrastrar.
```

ChatGPT respondera con algo como:
`=SI(E2="", HOY()-A2, E2-A2)`

Y si preguntas "¿Como hago para que muestre solo numeros positivos?" continuara en la misma conversacion.

### Generacion de macros VBA sin saber programar

Este es uno de los usos mas potentes para contadores. Las macros automatizan secuencias de acciones repetitivas.

**Prompt:**
```
Escribe una macro VBA de Excel que haga lo siguiente:
1. En cada hoja del libro (excepto la hoja "Resumen"), busca la columna llamada
   "Estado" y aplica formato de color de fondo verde a las celdas con valor
   "Cobrado", amarillo a "Pendiente" y rojo a "Vencido"
2. Al terminar, muestra un mensaje que diga "Formato aplicado a X hojas"

Dame el codigo completo listo para pegar en el editor VBA.
```

Para aplicar la macro: Excel → Alt + F11 → Insertar → Modulo → Pega el codigo → F5 para ejecutar.

---

## 5. Power Query con asistencia de IA

Power Query (disponible en Excel sin necesidad de Copilot) es la herramienta de transformacion de datos integrada en Excel. Para contadores que reciben datos en formatos imperfectos (que es practicamente siempre), Power Query es fundamental.

### Flujo de trabajo con IA para Power Query

Cuando no sabes como realizar una transformacion especifica en Power Query, usa ChatGPT:

**Prompt:**
```
En Power Query de Excel, necesito hacer lo siguiente con una tabla de datos:
1. La columna "RUC" tiene valores como "17923456780 01" (con espacio en el medio)
   y necesito unirlos para que queden "1792345678001" (sin espacio, 13 digitos)
2. La columna "Fecha" tiene formato dia/mes/ano como texto ("15/03/2025") y
   necesito convertirla a fecha real de Excel
3. Crear una columna nueva llamada "Trimestre" que diga Q1, Q2, Q3 o Q4
   segun el mes de la columna Fecha

Dame los pasos exactos en Power Query o el codigo M correspondiente.
```

---

## 6. Automatizacion del ATS con Excel e IA

El Anexo Transaccional Simplificado (ATS) es el reporte mensual de compras y ventas que se presenta al SRI. Muchos contadores pasan horas preparando el archivo correcto.

### Validacion del ATS con IA antes de subir al SRI

```
Adjunto el archivo CSV que voy a subir al SRI como ATS del mes [mes/ano].
Revisa el archivo y detecta:

1. RUC con formato incorrecto (deben tener 13 digitos, iniciar con 04, 05, 06, 17,
   18, 19 para personas juridicas en Ecuador)
2. Codigos de sustento tributario que no corresponden al tipo de transaccion
   (compra local con sustento 01, importacion con 16, etc.)
3. Montos de IVA que no corresponden a la base imponible segun la tarifa declarada
4. Facturas con numero de autorizacion que no tiene 10 o 49 digitos
5. Cualquier otra inconsistencia estructural del archivo

Presenta los errores en tabla: fila del error, tipo de error, valor encontrado,
valor esperado, recomendacion.
```

---

## Herramienta Descargable del Modulo

Este modulo incluye una herramienta interactiva descargable: **Calculadora de Reconciliacion Bancaria IA** (archivo HTML autocontenido).

La herramienta permite:
- Pegar datos del libro contable y del estado de cuenta en tablas
- Identificar automaticamente las partidas conciliatorias
- Generar el reporte de reconciliacion en formato exportable
- Funciona completamente offline despues de descargar

Usa el boton "Descargar herramienta" al final del modulo.

---

## Resumen del Modulo

- Microsoft Copilot en Excel requiere M365 Business Standard — permite instrucciones en espanol directamente sobre tu hoja de calculo
- Sin Copilot, ChatGPT genera formulas complejas y macros VBA a partir de descripciones en lenguaje natural
- Casos clave: reconciliacion bancaria automatica, tablas dinamicas de variaciones, clasificacion de cartera por antiguedad
- Power Query con asistencia de IA transforma datos mal formateados (RUC con espacios, fechas como texto) sin conocimientos tecnicos
- La validacion del ATS con IA antes de subirlo al SRI puede prevenir observaciones del organismo de control
- La herramienta descargable del modulo automatiza la reconciliacion bancaria

---

## Ejercicio Rapido

**Actividad 1 — Formula en 2 minutos (si tienes ChatGPT)**

Piensa en una formula Excel que necesitas pero siempre olvidas como construir (BUSCARV con columna variable, SUMAR.SI con multiples criterios, SI anidados con mas de 3 condiciones). Describela en espanol a ChatGPT y aplica la formula que te da. Comprueba que funciona.

**Actividad 2 — Prueba Copilot (si tienes M365)**

Abre un archivo Excel con datos financieros en OneDrive. Activa Copilot y prueba esta instruccion: "Resume los datos de esta hoja en 3 puntos clave y sugiere una visualizacion que seria util para presentar a gerencia." Observa el resultado.
