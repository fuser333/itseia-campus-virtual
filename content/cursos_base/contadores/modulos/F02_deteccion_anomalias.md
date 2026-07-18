# F-02: Deteccion de Anomalias y Fraude con IA

**Tipo:** Leccion + Quiz
**Duracion:** 30 minutos
**Semana:** 3
**Herramientas:** ChatGPT Plus (Code Interpreter), Vic.ai (referencia), Excel + Power Query

---

## Objetivo de Aprendizaje

Al finalizar este modulo, podras usar IA para identificar patrones anomalos en libros contables, cuentas por pagar y cuentas por cobrar, aplicando tecnicas de analisis de datos que antes requerían herramientas especializadas o dias de trabajo manual. Sabras como documentar los hallazgos para un informe de auditoria.

---

## 1. El fraude en empresas ecuatorianas: el mapa del riesgo

Antes de hablar de como detectarlo, es util entender que buscar. Segun el Informe Global de Fraude Ocupacional de la ACFE (2024) y la experiencia de auditores en el mercado ecuatoriano, los esquemas de fraude mas frecuentes en empresas medianas son:

**1. Facturacion fraudulenta (35% de casos)**
- Facturas de proveedores fantasma (empresa con RUC real pero sin actividad real)
- Facturas duplicadas (misma factura cobrada dos veces con ligeras variaciones)
- Inflacion de facturas (montos superiores a los convenidos)

**2. Desviacion de activos (28% de casos)**
- Apropiacion de efectivo en el momento de cobranza (skimming)
- Pagos a empleados ficticios en nomina
- Transferencias no autorizadas a cuentas relacionadas

**3. Manipulacion de registros (22% de casos)**
- Ajuste de inventarios sin sustento
- Diferimiento de gastos para mejorar utilidades
- Reconocimiento anticipado de ingresos

**4. Robo de informacion (15% de casos)**
- Uso de datos de clientes con fines propios
- Venta de informacion confidencial a competidores

---

## 2. Como preparar tu dataset para analisis con IA

La calidad del analisis de anomalias depende directamente de la calidad del dataset que prepares. La IA no puede analizar lo que no puede ver.

### Dataset minimo para analisis de cuentas por pagar:

Exporta desde tu sistema contable una tabla con estas columnas:
- `id_transaccion`: identificador unico del asiento
- `fecha`: fecha de la transaccion
- `proveedor_id`: codigo anonimizado del proveedor (no nombre real)
- `numero_factura`: numero del comprobante
- `monto`: valor en USD
- `cuenta_cargo`: codigo de cuenta contable
- `usuario_registro`: quien registro (anonimizado como User_01, User_02, etc.)
- `fecha_registro`: cuando se registro en el sistema
- `descripcion`: concepto del asiento

### Limpieza antes de subir:
1. Reemplaza nombres de proveedores por codigos (Proveedor_001, Proveedor_002)
2. Asegurate de que los montos no tengan texto mezclado (solo numeros y punto decimal)
3. Elimina las filas de totales automaticos
4. Si hay mas de 10,000 filas, filtra por el rango de meses que quieres analizar

---

## 3. Prompts para deteccion de anomalias

### Prompt 1: Analisis general de anomalias (ChatGPT Plus con archivo adjunto)

```
Adjunto un archivo CSV/Excel con transacciones de cuentas por pagar del periodo
[mes/trimestre] de una empresa comercial ecuatoriana.

Analiza el dataset y detecta las siguientes posibles anomalias:

1. DUPLICADOS: transacciones con el mismo numero de factura, mismo proveedor
   y mismo monto (o monto muy similar) en fechas cercanas
2. MONTOS INUSUALES: transacciones que se desvian mas de 2 desviaciones estandar
   del promedio historico de ese proveedor o de esa cuenta
3. REGISTROS FUERA DE HORARIO: transacciones registradas en horarios inusuales
   (fines de semana, madrugada) si tienes la columna de fecha/hora de registro
4. NUMEROS REDONDOS SOSPECHOSOS: montos exactamente redondos en cantidades grandes
   (por ejemplo, exactamente $5,000 o $10,000 cuando el negocio tipicamente tiene
   montos variados)
5. PROVEEDOR NUEVO CON MONTO ALTO: primeras transacciones con un proveedor por
   montos inusualmente altos

Para cada hallazgo, indica: descripcion de la anomalia, registros involucrados
(ID de transaccion), nivel de riesgo estimado (Alto/Medio/Bajo) y recomendacion
de accion.
```

### Prompt 2: Prueba de Benford para deteccion de manipulacion

La Ley de Benford establece que en datos financieros naturales (facturas, montos de transacciones), el primer digito significativo sigue una distribucion especifica: el digito 1 aparece el ~30% de las veces, el 2 el ~17%, y asi decrementalmente hasta el 9 con ~4.6%. Cuando los datos son manipulados, esta distribucion se distorsiona.

```
Adjunto un dataset de transacciones financieras. Aplica la prueba de Benford:
1. Extrae el primer digito significativo de cada monto (ignorando ceros iniciales)
2. Calcula la frecuencia observada de cada digito (1-9)
3. Compara con la frecuencia esperada segun la Ley de Benford:
   1:30.1%, 2:17.6%, 3:12.5%, 4:9.7%, 5:7.9%, 6:6.7%, 7:5.8%, 8:5.1%, 9:4.6%
4. Identifica los digitos con mayor desviacion de lo esperado
5. Genera un grafico de barras comparando frecuencias observadas vs esperadas
6. Concluye si hay indicios de manipulacion o si la distribucion es normal

Nota: desviaciones significativas (mas del 5% de diferencia) merecen investigacion
adicional, especialmente en los digitos 5, 6, 7, 8 que comunmente se usan cuando
se redondean cifras artificialmente.
```

### Prompt 3: Analisis de nomina para deteccion de empleados fantasma

```
Adjunto el registro de nomina del periodo [mes/ano] (datos anonimizados).
Columnas: empleado_id, departamento, cargo, salario_base, bonificaciones,
descuentos_iess, dias_trabajados, fecha_ingreso.

Analiza para detectar:
1. Empleados con mismo salario exacto (posibles duplicados)
2. Empleados con bonificaciones que superan el 50% del salario base sin registro
   de horas extras o comisiones
3. Empleados registrados recientemente (menos de 3 meses) con salarios en el
   percentil 90 de la empresa
4. Empleados con dias trabajados menores a 15 pero con salario completo
5. Departamentos donde el total de nomina aumento mas del 20% respecto al mes
   anterior sin cambios en headcount

Presenta en tabla con: hallazgo, empleado_id involucrado(s), magnitud del
riesgo y accion recomendada.
```

---

## 4. Herramientas especializadas: Vic.ai, AppZen y MindBridge

Estas herramientas van mas alla de ChatGPT porque estan diseñadas especificamente para auditoria y deteccion de anomalias financieras. Para un auditor que trabaja con clientes medianos o grandes, vale la pena conocerlas.

### Vic.ai

Plataforma de IA para cuentas por pagar. Se integra directamente con sistemas ERP (SAP, Oracle, QuickBooks).

Capacidades relevantes:
- Lee facturas PDF y extrae datos automaticamente
- Detecta facturas duplicadas en tiempo real al momento del ingreso
- Aprende los patrones de aprobacion de tu empresa y alerta cuando una factura es inusual
- Codifica automaticamente las facturas a las cuentas contables correctas

Precio: desde $1,000/mes para empresas medianas. No es para contadores independientes, pero si para empresas que quieren automatizar sus cuentas por pagar.

### AppZen

Especializado en auditoria de gastos de viaje y representacion. Si tu empresa tiene fuerza de ventas con tarjetas corporativas, AppZen revisa el 100% de los gastos contra recibos, politica de la empresa y reglas tributarias.

### MindBridge AI Auditor

Herramienta para auditores externos. Analiza el libro mayor completo y genera un score de riesgo por transaccion. Usado por firmas medianas como alternativa a IDEA o ACL (herramientas clasicas de auditoria de datos) pero con capacidades de IA.

---

## 5. Documentacion de hallazgos para informe de auditoria

Cuando la IA identifica una anomalia, el trabajo no termina ahi. El auditor debe documentar el hallazgo, investigar la causa y redactar la observacion.

### Estructura de un hallazgo de auditoria bien documentado

Usa este prompt para redactar el hallazgo formal:

```
Basandome en el analisis de datos, encontre la siguiente anomalia:
[Describe la anomalia: tipo, montos, transacciones involucradas, periodo]

Redacta un hallazgo de auditoria en el formato estandar que incluya:

HALLAZGO: [Nombre del hallazgo]
CONDICION: Descripcion objetiva de lo que se encontro
CRITERIO: La norma, politica o control interno que deberia cumplirse
CAUSA: Analisis de la razon probable del hallazgo
EFECTO: Impacto potencial en los estados financieros y/o la empresa
RECOMENDACION: Accion correctiva especifica y medible

Contexto: empresa [tipo] ecuatoriana, auditoria [interna/externa],
periodo [fechas].
```

---

## Resumen del Modulo

- Los esquemas de fraude mas comunes en Ecuador: facturacion fraudulenta, desviacion de activos, manipulacion de registros
- Para analisis efectivo, el dataset debe estar limpio y anonimizado antes de subirlo a la IA
- ChatGPT Plus con Code Interpreter puede analizar miles de transacciones en segundos buscando duplicados, montos inusuales y patrones de riesgo
- La prueba de Benford con IA detecta manipulacion en datasets de transacciones en minutos
- Vic.ai, AppZen y MindBridge son herramientas especializadas para empresas medianas y grandes
- El hallazgo de auditoria tiene una estructura formal (condicion-criterio-causa-efecto-recomendacion) que la IA puede redactar a partir de tus datos

---

## Ejercicio Rapido

**Actividad — Analisis de dataset ficticio (20 minutos)**

Descarga el archivo de datos de practica incluido en el modulo (transactions_practice.csv). Si no esta disponible, crea en Excel una tabla de 30 transacciones ficticia con las columnas descritas en la Seccion 2.

Planta intencionalmente:
- Una factura duplicada (mismo numero, mismo proveedor, montos iguales con 2 dias de diferencia)
- Una transaccion de $10,000 exactos con un proveedor nuevo

Sube el archivo a ChatGPT Plus y usa el Prompt 1. ¿Detecto la IA las anomalias que plantaste? ¿Encontro alguna otra que no habias notado?
