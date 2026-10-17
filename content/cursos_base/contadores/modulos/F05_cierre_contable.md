# F-05: Caso Practico — Cierre Contable Asistido por IA

**Tipo:** Caso Practico Integrador
**Duracion estimada:** 45 minutos
**Semana:** 4 (Modulo Final)
**Herramientas:** ChatGPT Plus o Claude + Excel
**Nivel de dificultad:** Intermedio

---

## Sobre este caso

Este es el modulo final del curso. Aqui aplicas todo lo que aprendiste: usar la IA para analizar datos financieros reales, detectar anomalias, redactar notas y preparar un informe ejecutivo. El caso esta basado en una empresa ecuatoriana ficticia con datos numericos que representan situaciones reales del mercado.

**No hay una sola respuesta correcta.** Lo que se evalua es tu proceso: si usas la IA de manera efectiva, si aplicas criterio profesional para validar sus outputs y si produces los entregables solicitados con calidad profesional.

---

## Escenario

**Empresa:** Distribuidora Andina S.A.
**Sector:** Comercio al por mayor — productos de consumo masivo
**Ubicacion:** Quito, Ecuador
**RUC (ficticio):** 1792847361001
**Ejercicio fiscal:** Enero — Marzo 2026 (Primer Trimestre)
**Tipo de cliente:** Empresa familiar, 45 empleados, ventas anuales aproximadas de $3.2M

**Contexto:**
Eres el contador externo de Distribuidora Andina S.A. La empresa tiene su contabilidad registrada en el software Monica y el gerente general, el Sr. Rodrigo Caicedo, te ha pedido el cierre del Q1 2026 para presentarlo al directorio el proximo lunes. Durante la revision previa, notaste que los numeros "no cuadran del todo" en algunas cuentas. Tienes que entregar: (1) el estado de resultados Q1 2026 revisado, (2) una nota de hallazgos para la gerencia, y (3) el listado de ajustes contables recomendados.

**Tu herramienta principal para este cierre:** ChatGPT Plus o Claude.

---

## Datos del Caso: Balance de Sumas y Saldos Q1 2026

Distribuidora Andina S.A. — Balance de Sumas y Saldos al 31 de Marzo de 2026
(En dolares americanos — USD)

### ACTIVOS

| Codigo | Cuenta | Saldo Inicial (Ene 1) | Debitos Q1 | Creditos Q1 | Saldo Final (Mar 31) |
|--------|--------|-----------------------|------------|-------------|----------------------|
| 1.1.01 | Caja y Bancos | 48,250.00 | 892,340.00 | 851,920.00 | 88,670.00 |
| 1.1.02 | Cuentas por Cobrar Clientes | 215,400.00 | 687,500.00 | 612,300.00 | 290,600.00 |
| 1.1.03 | Provision Cuentas Incobrables | (12,800.00) | 0.00 | 0.00 | (12,800.00) |
| 1.1.04 | Anticipo a Proveedores | 8,500.00 | 45,200.00 | 48,700.00 | 5,000.00 |
| 1.1.05 | Credito Tributario IVA | 18,300.00 | 92,450.00 | 87,200.00 | 23,550.00 |
| 1.1.06 | Credito Tributario Renta | 4,200.00 | 0.00 | 0.00 | 4,200.00 |
| 1.2.01 | Inventario Mercaderias | 325,600.00 | 498,200.00 | 512,750.00 | 311,050.00 |
| 1.3.01 | Propiedad, Planta y Equipo | 285,000.00 | 0.00 | 0.00 | 285,000.00 |
| 1.3.02 | Depreciacion Acumulada PPE | (98,500.00) | 0.00 | 8,550.00 | (107,050.00) |
| 1.4.01 | Intangibles (Software Monica) | 3,600.00 | 0.00 | 900.00 | 2,700.00 |

**TOTAL ACTIVOS: 891,920.00**

### PASIVOS

| Codigo | Cuenta | Saldo Inicial (Ene 1) | Debitos Q1 | Creditos Q1 | Saldo Final (Mar 31) |
|--------|--------|-----------------------|------------|-------------|----------------------|
| 2.1.01 | Cuentas por Pagar Proveedores | 145,200.00 | 498,700.00 | 521,840.00 | 168,340.00 |
| 2.1.02 | IVA por Pagar | 3,400.00 | 87,200.00 | 92,450.00 | 8,650.00 |
| 2.1.03 | Retenciones por Pagar | 8,900.00 | 34,500.00 | 38,200.00 | 12,600.00 |
| 2.1.04 | IESS por Pagar | 12,300.00 | 18,450.00 | 19,800.00 | 13,650.00 |
| 2.1.05 | Provision Beneficios Sociales | 18,500.00 | 0.00 | 0.00 | 18,500.00 |
| 2.1.06 | Impuesto a la Renta por Pagar | 22,400.00 | 22,400.00 | 0.00 | 0.00 |
| 2.2.01 | Prestamo Bancario LP | 180,000.00 | 15,000.00 | 0.00 | 165,000.00 |
| 2.2.02 | Provision Jubilacion Patronal | 28,600.00 | 0.00 | 0.00 | 28,600.00 |

**TOTAL PASIVOS: 415,340.00**

### PATRIMONIO

| Codigo | Cuenta | Saldo Inicial (Ene 1) | Debitos Q1 | Creditos Q1 | Saldo Final (Mar 31) |
|--------|--------|-----------------------|------------|-------------|----------------------|
| 3.1.01 | Capital Social | 200,000.00 | 0.00 | 0.00 | 200,000.00 |
| 3.1.02 | Reserva Legal | 42,500.00 | 0.00 | 0.00 | 42,500.00 |
| 3.1.03 | Utilidades Retenidas | 195,600.00 | 0.00 | 0.00 | 195,600.00 |
| 3.1.04 | Utilidad del Ejercicio Actual | 0.00 | 0.00 | 38,480.00 | 38,480.00 |

**TOTAL PATRIMONIO: 476,580.00**

**VERIFICACION: TOTAL PASIVOS + PATRIMONIO = $891,920.00**

### INGRESOS Y GASTOS (Q1 2026)

| Codigo | Cuenta | Debitos | Creditos | Saldo |
|--------|--------|---------|----------|-------|
| 4.1.01 | Ventas Netas | 0.00 | 687,500.00 | 687,500.00 (CR) |
| 4.1.02 | Descuentos en Ventas | 8,400.00 | 0.00 | 8,400.00 (DB) |
| 4.2.01 | Ingresos Financieros | 0.00 | 1,200.00 | 1,200.00 (CR) |
| 5.1.01 | Costo de Ventas | 512,750.00 | 0.00 | 512,750.00 (DB) |
| 6.1.01 | Sueldos y Salarios Admin | 48,600.00 | 0.00 | 48,600.00 (DB) |
| 6.1.02 | Beneficios Sociales Admin | 11,800.00 | 0.00 | 11,800.00 (DB) |
| 6.1.03 | Aporte Patronal IESS Admin | 5,910.00 | 0.00 | 5,910.00 (DB) |
| 6.1.04 | Depreciaciones | 8,550.00 | 0.00 | 8,550.00 (DB) |
| 6.1.05 | Amortizacion Intangibles | 900.00 | 0.00 | 900.00 (DB) |
| 6.1.06 | Arrendamiento Oficinas | 7,200.00 | 0.00 | 7,200.00 (DB) |
| 6.1.07 | Servicios Basicos | 2,850.00 | 0.00 | 2,850.00 (DB) |
| 6.1.08 | Mantenimiento y Reparaciones | 3,400.00 | 0.00 | 3,400.00 (DB) |
| 6.2.01 | Sueldos y Salarios Ventas | 32,400.00 | 0.00 | 32,400.00 (DB) |
| 6.2.02 | Comisiones Vendedores | 13,750.00 | 0.00 | 13,750.00 (DB) |
| 6.2.03 | Gastos Publicidad | 4,200.00 | 0.00 | 4,200.00 (DB) |
| 6.2.04 | Transporte y Flete | 8,600.00 | 0.00 | 8,600.00 (DB) |
| 6.3.01 | Gastos Financieros (Intereses) | 9,810.00 | 0.00 | 9,810.00 (DB) |

---

## Las Tres Anomalias Plantadas

El caso tiene tres irregularidades ocultas en los datos. Parte del ejercicio es que las identifiques usando la IA. Despues de completar el caso, puedes verificar tus hallazgos con las respuestas al final de este documento.

**Pista 1:** Revisa la cuenta de Provision Cuentas Incobrables en relacion con el saldo de Cuentas por Cobrar.
**Pista 2:** Revisa la cuenta de Provision Beneficios Sociales en relacion con la nomina del trimestre.
**Pista 3:** Revisa los Gastos Financieros en relacion con el saldo del Prestamo Bancario y las condiciones de mercado.

---

## Instrucciones: 6 Pasos del Cierre

Sigue estos pasos en orden. Cada paso tiene la herramienta de IA recomendada y el prompt sugerido. Puedes usar los prompts exactamente o adaptarlos.

---

### Paso 1: Cargar y verificar el balance (Herramienta: ChatGPT Plus o Claude)

**Tiempo estimado: 5 minutos**

Copia la tabla de Balance de Sumas y Saldos completa y usa el siguiente prompt:

```
Soy contador externo de Distribuidora Andina S.A., empresa ecuatoriana de
distribución de productos de consumo masivo. Adjunto el Balance de Sumas y
Saldos del Q1 2026 (enero-marzo).

Por favor:
1. Verifica que el balance cuadre: Activo Total debe ser igual a Pasivo + Patrimonio.
   Calcula los totales e indica si cuadra o hay diferencia.
2. Construye el Estado de Resultados del Q1 2026 con el formato:
   Ventas Netas → Margen Bruto → Utilidad Operacional → Utilidad antes de
   impuestos → (calculame el 15% participacion trabajadores y el 25% IR) →
   Utilidad Neta
3. Calcula los siguientes ratios: margen bruto %, margen operacional %,
   margen neto %, liquidez corriente, endeudamiento total.
4. Señala cualquier cuenta que te parezca inusual o que requiera atencion especial.

[PEGA AQUI EL BALANCE DE SUMAS Y SALDOS]
```

**Entregable del Paso 1:** Estado de Resultados Q1 2026 generado por IA (para revisar y ajustar).

---

### Paso 2: Deteccion de anomalias (Herramienta: ChatGPT Plus o Claude)

**Tiempo estimado: 10 minutos**

```
Con el balance de Distribuidora Andina S.A. que te pase, actua como auditor
senior y analiza en profundidad las siguientes cuentas:

1. PROVISION CUENTAS INCOBRABLES (1.1.03): El saldo es de $12,800 sobre una
   cartera total de $290,600 al cierre. ¿Es razonable esta provision?
   Bajo NIIF 9 (o NIIF PYMES Seccion 11), ¿como se deberia calcular?
   Si la empresa tiene el siguiente analisis de cartera:
   - Corriente (0-30 dias): $145,200
   - Vencida 31-60 dias: $87,400
   - Vencida 61-90 dias: $38,000
   - Vencida mas de 90 dias: $20,000
   Con tasas historicas de incobro: 0.5% / 2% / 8% / 25% respectivamente,
   ¿cual deberia ser la provision correcta?

2. PROVISION BENEFICIOS SOCIALES (2.1.05): El saldo es $18,500 y no tuvo
   movimiento en el trimestre. La nomina total del trimestre fue $93,510
   (sueldos + comisiones). ¿Es razonable que la provision no haya cambiado?
   ¿Que beneficios sociales deberian estar provisionados mensualmente en Ecuador?
   Calcula una estimacion de la provision correcta.

3. GASTOS FINANCIEROS (6.3.01): Los intereses del trimestre son $9,810 sobre
   un prestamo promedio de $172,500 (promedio entre $180,000 inicial y $165,000
   final). ¿Que tasa de interes anual implica ese gasto? ¿Es razonable para un
   prestamo comercial en Ecuador en 2026?

Para cada punto, dame: (a) tu analisis, (b) si hay una posible anomalia,
(c) el ajuste contable recomendado en formato Cuenta Debito / Cuenta Credito / Monto.
```

**Entregable del Paso 2:** Lista de anomalias identificadas con analisis de causa.

---

### Paso 3: Construccion de los ajustes contables (Herramienta: ChatGPT Plus o Claude + Excel)

**Tiempo estimado: 8 minutos**

Con las anomalias identificadas en el Paso 2, pide a la IA que te ayude a estructurar los asientos de ajuste:

```
Con base en el analisis de anomalias de Distribuidora Andina S.A., necesito
los asientos contables de ajuste en formato formal para el cierre del Q1 2026.

Para cada ajuste, dame:
- Numero de asiento: AJ-Q1-001, AJ-Q1-002, etc.
- Fecha: 31 de marzo de 2026
- Cuenta debitada: codigo + nombre + monto
- Cuenta acreditada: codigo + nombre + monto
- Descripcion: concepto claro para auditoria
- Referencia normativa: NIIF o normativa que sustenta el ajuste

Incluye los 3 ajustes que identificaste mas cualquier otro que consideres
necesario para que los estados financieros presenten razonablemente la
situacion de la empresa.
```

**Entregable del Paso 3:** Asientos de ajuste numerados listos para registro.

---

### Paso 4: Estado de Resultados ajustado (Herramienta: Excel)

**Tiempo estimado: 5 minutos**

En Excel, toma el Estado de Resultados del Paso 1 y aplica los ajustes del Paso 3. Recalcula manualmente (no delegues este calculo a la IA):

1. Ajusta la provision de cuentas incobrables al monto correcto
2. Ajusta la provision de beneficios sociales con el gasto faltante
3. Verifica que los gastos financieros son consistentes con la tasa de mercado

Recalcula la Utilidad Neta con los ajustes aplicados.

**Entregable del Paso 4:** Estado de Resultados Q1 2026 ajustado en Excel.

---

### Paso 5: Nota de hallazgos para gerencia (Herramienta: Claude o ChatGPT)

**Tiempo estimado: 7 minutos**

```
Soy el contador externo de Distribuidora Andina S.A. Durante el cierre del Q1
2026 encontre las siguientes situaciones que requieren atencion:

[DESCRIBE AQUI LAS ANOMALIAS QUE ENCONTRASTE Y LOS AJUSTES PROPUESTOS]

Redacta una nota formal para el Gerente General (Sr. Rodrigo Caicedo) que:
1. Explique las situaciones encontradas en lenguaje claro (no solo contable)
2. Indique el impacto de cada ajuste en la utilidad del trimestre
3. Recomiende 3 controles internos especificos para prevenir que se repitan
4. Sea profesional pero directo — el gerente necesita tomar decisiones

Formato: carta formal con membrete en blanco, fecha 31 de marzo de 2026,
firma del Contador. Maximo 400 palabras.
```

**Entregable del Paso 5:** Nota formal de hallazgos para gerencia.

---

### Paso 6: Checklist de cierre auditado (Herramienta: Claude o ChatGPT)

**Tiempo estimado: 5 minutos**

```
Para el cierre del Q1 2026 de Distribuidora Andina S.A., empresa comercial
ecuatoriana bajo NIIF para PYMES, ayudame a verificar que el cierre esta
completo. Revisa los siguientes puntos e indica para cada uno si esta OK,
si requiere atencion o si falta informacion para determinar:

1. Balance de sumas y saldos cuadra (Activo = Pasivo + Patrimonio)
2. Depreciaciones del periodo registradas correctamente
3. Provisiones de beneficios sociales al dia (decimo tercero, decimo cuarto,
   vacaciones, fondos de reserva — para Ecuador)
4. Impuestos corrientes calculados y registrados
5. Cuentas incobrables provisionadas segun analisis de cartera
6. Gastos financieros devengados correctamente
7. Inventario conciliado con el conteo fisico del cierre
8. Retenciones en la fuente correctamente registradas y pagadas al SRI
9. IESS del mes de marzo liquidado y pagado
10. ATS del trimestre preparado y listo para presentacion

Para los puntos donde hay problemas conocidos del caso, indica el ajuste que
se hizo. Para los puntos que no puedes verificar con los datos disponibles,
indica que informacion adicional necesitarias.
```

**Entregable del Paso 6:** Checklist de cierre completo con estado de cada punto.

---

## Checklist de Entregables

Al finalizar el caso, debes tener:

- [ ] **Entregable 1:** Estado de Resultados Q1 2026 version inicial (output del Paso 1)
- [ ] **Entregable 2:** Lista de 3 anomalias identificadas con analisis de causa (output del Paso 2)
- [ ] **Entregable 3:** Asientos de ajuste AJ-Q1-001, AJ-Q1-002, AJ-Q1-003 (output del Paso 3)
- [ ] **Entregable 4:** Estado de Resultados Q1 2026 ajustado con Utilidad Neta correcta (output del Paso 4)
- [ ] **Entregable 5:** Nota de hallazgos para la gerencia firmada (output del Paso 5)

El Paso 6 (checklist) es un verificador de tu trabajo, no un entregable separado.

---

## Criterios de Auto-evaluacion

Usa estos tres criterios para evaluar la calidad de tu trabajo:

### Criterio 1: Precision tecnica (0-40 puntos)

Evalua si identificaste correctamente las tres anomalias y si los ajustes propuestos son tecnicamente correctos segun NIIF.

- 35-40 pts: Las 3 anomalias identificadas, ajustes correctos con referencia normativa correcta
- 25-34 pts: 2 de 3 anomalias identificadas, ajustes mayormente correctos
- 15-24 pts: 1 de 3 anomalias identificadas o ajustes con errores tecnicos
- 0-14 pts: No se identificaron anomalias o los ajustes son incorrectos

### Criterio 2: Uso efectivo de la IA (0-35 puntos)

Evalua si usaste la IA como herramienta de amplificacion profesional o solo como busqueda de respuestas.

- 30-35 pts: Prompts bien estructurados, outputs revisados critica mente, errores de IA corregidos, calculos verificados manualmente en Excel
- 20-29 pts: Buen uso de IA pero algunos outputs aceptados sin verificacion suficiente
- 10-19 pts: Uso basico de IA, sin adaptacion de prompts al contexto especifico
- 0-9 pts: Outputs de IA usados directamente sin revision profesional

### Criterio 3: Comunicacion profesional (0-25 puntos)

Evalua la calidad de la nota de hallazgos para gerencia.

- 22-25 pts: Nota clara, hallazgos bien explicados, impacto cuantificado, recomendaciones especificas y accionables
- 15-21 pts: Nota comprensible pero con jerga tecnica excesiva o recomendaciones vagas
- 8-14 pts: Nota incompleta o con informacion incorrecta sobre el caso
- 0-7 pts: Nota no entregada o con errores graves

**Puntaje maximo: 100 puntos. Aprobado: 70 puntos o mas.**

---

## Respuestas: Las Tres Anomalias

*(Lee esto solo despues de completar el caso)*

### Anomalia 1: Provision de Cuentas Incobrables insuficiente

Con el analisis de cartera por antiguedad y las tasas historicas de incobro:
- Corriente: $145,200 x 0.5% = $726
- 31-60 dias: $87,400 x 2% = $1,748
- 61-90 dias: $38,000 x 8% = $3,040
- Mas de 90 dias: $20,000 x 25% = $5,000
- **Provision correcta: $10,514**

El saldo actual es $12,800, que es MAYOR a la provision calculada. En este caso, la empresa tiene una provision superior a la que calcula el modelo. No hay que ajustar al alza — hay que verificar si la politica de provision historica justifica el monto o si hay exceso.

Esta anomalia tiene segunda lectura: el saldo de provision no cambio en todo el trimestre aunque las cuentas por cobrar aumentaron $75,200. Si la politica es registrar la provision mensualmente, deberia haber movimiento en el trimestre. El contador debe revisar si hay un asiento mensual que se omitio o si la empresa aplica provision solo al cierre del ejercicio anual.

**Asiento posible si la provision se aplica trimestralmente:**
Dependera del calculo que haga el alumno con los datos del analisis de cartera. El ejercicio es el proceso, no el numero exacto.

### Anomalia 2: Provision de Beneficios Sociales sin movimiento

La nomina del trimestre fue $93,510 (sueldos admin $48,600 + sueldos ventas $32,400 + comisiones $13,750 = $94,750 — hay una diferencia menor que el alumno puede investigar).

En Ecuador, los empleadores deben provisionar mensualmente:
- Decimo tercero: 8.33% del salario mensual
- Decimo cuarto: proporcional (varia segun region)
- Vacaciones: 4.17% del salario mensual

Provision minima estimada del trimestre: ~$11,400 - $13,200 (dependiendo de calculos especificos del alumno).

El hecho de que la provision no tenga movimiento en 3 meses es una señal clara de que no se ha registrado el devengamiento. Este es uno de los errores mas comunes en empresas medianas ecuatorianas.

**Asiento de ajuste:**
- Debito: Gasto Beneficios Sociales / Monto calculado
- Credito: Provision Beneficios Sociales / Monto calculado

### Anomalia 3: Tasa de interes inusualmente alta

Calculo de la tasa implicita:
- Intereses del trimestre: $9,810
- Saldo promedio del prestamo: ($180,000 + $165,000) / 2 = $172,500
- Tasa trimestral: $9,810 / $172,500 = 5.69% trimestral
- Tasa anual: 5.69% x 4 = 22.75% anual

La tasa activa maxima referencial del BCE para prestamos comerciales en Ecuador para Q1 2026 es de aproximadamente 10-12% anual. Una tasa del 22.75% es mas del doble del maximo comercial referencial.

Posibles causas: (a) prestamo no bancario con tasa usuraria — revisar el contrato, (b) error en el registro de intereses (puede incluir capital amortizado), (c) comisiones o seguros incluidos en los gastos financieros que deberian desagregarse.

Esta anomalia requiere revision del contrato de prestamo, no un ajuste contable inmediato, sino una investigacion del origen del gasto.

---

## Nota Final del Instructor

Este caso refleja situaciones reales que se presentan en cierres de empresas medianas ecuatorianas. Los tres tipos de anomalia (provision insuficiente, gasto devengado no registrado, gasto inusual) aparecen con frecuencia en auditorias de firmas locales.

La IA es la herramienta que acelera el analisis, pero el criterio para identificar el problema, investigar la causa y proponer el ajuste correcto sigue siendo del contador. Eso es exactamente lo que este curso buscaba demostrar.
