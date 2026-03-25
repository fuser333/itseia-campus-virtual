# J-02: Redaccion y Revision de Contratos con IA

**Tipo:** Demo Interactivo
**Duracion:** 45 minutos
**Semana:** 2 de 4
**Herramientas:** ChatGPT Plus, Claude, Microsoft Copilot para Word

---

## Objetivo de Aprendizaje

Al finalizar este modulo, podras usar IA para generar borradores de contratos bajo normativa ecuatoriana, identificar clausulas de riesgo en contratos de terceros, y usar Microsoft Copilot en Word para mejorar la calidad y claridad de documentos contractuales. Reduciras el tiempo de redaccion de contratos tipo en un 60-70%.

---

## Advertencia Profesional

Los borradores generados por IA son puntos de partida, no documentos finales listos para firma. Tu revision profesional es indispensable antes de presentar cualquier contrato a un cliente. La IA puede omitir clausulas esenciales para el contexto especifico del caso, incluir clausulas inaplicables en Ecuador o interpretar mal las necesidades del cliente.

---

## Seccion 1: IA para generacion de borradores de contratos

La mayor ganancia de tiempo en redaccion contractual esta en el borrador inicial. Un abogado que parte de una pagina en blanco puede tardar 2-3 horas en un contrato de prestacion de servicios. Con IA, ese borrador inicial tarda 5 minutos y el abogado dedica su tiempo a revisar y adaptar (30-45 minutos).

### Estructura del prompt para contratos

Para obtener un borrador util de IA, el prompt debe incluir:

1. **Tipo de contrato** (compraventa, arrendamiento, prestacion de servicios, mutuo, etc.)
2. **Naturaleza de las partes** (personas naturales, juridicas, nacionales, extranjeras)
3. **Objeto y alcance** del contrato
4. **Condiciones economicas** (precio, forma de pago, plazos)
5. **Clausulas especiales** que necesitas incluir
6. **Normativa aplicable** (Codigo Civil, Codigo de Comercio, normativa sectorial)
7. **Formato requerido** (clausulas numeradas, extensidad, estilo)

### Prompt para contrato de prestacion de servicios profesionales

```
Actua como abogado especialista en derecho civil y comercial ecuatoriano.

Redacta un CONTRATO DE PRESTACION DE SERVICIOS PROFESIONALES con las siguientes caracteristicas:

PARTES:
- Contratante: empresa persona juridica (SAS) domiciliada en Quito
- Contratista: persona natural, profesional independiente

OBJETO: Servicios de consultoria financiera para elaboracion de estados financieros y proyecciones presupuestarias

CONDICIONES ECONOMICAS:
- Valor del contrato: $3,500 USD
- Forma de pago: 30% al inicio, 40% a mitad del proyecto, 30% contra entrega
- Duracion: 60 dias calendario desde la firma

CLAUSULAS QUE DEBE INCLUIR:
- Confidencialidad y no divulgacion de informacion empresarial
- Propiedad intelectual de los entregables (a favor del contratante)
- Prohibicion de subcontratacion sin autorizacion escrita
- Responsabilidad por incumplimiento (clausula penal del 10% del contrato)
- Resolucion de conflictos: primero mediacion, luego arbitraje en el Centro de Mediacion del CAP de Pichincha
- Legislacion aplicable: derecho ecuatoriano

FORMATO:
- Clausulas numeradas con titulos en negrita
- Espacios para datos que se completaran: [NOMBRE], [CI/RUC], [DIRECCION]
- Espacio para firmas y fecha al final
- Lenguaje juridico formal ecuatoriano

Redacta el contrato completo.
```

### Demo: contrato de compraventa de bien inmueble

Para un contrato de mayor complejidad como compraventa de inmueble, el prompt debe ser mas especifico:

```
Redacta las CLAUSULAS para una promesa de compraventa de bien inmueble bajo el Codigo Civil ecuatoriano con las siguientes condiciones:

INMUEBLE: [DESCRIPCION GENERICA - ej. departamento en edificio residencial, area aproximada 85m2]
PRECIO: $85,000 USD
FORMA DE PAGO:
  - $5,000 USD a la firma de esta promesa (arras)
  - $20,000 USD al momento de la protocolizacion
  - $60,000 USD financiado por prestamo hipotecario (banco a designar)

PLAZO PARA ESCRITURA: 90 dias desde la firma de la promesa

CLAUSULAS OBLIGATORIAS SEGUN EL ART. 1570 DEL CODIGO CIVIL:
- Determinacion del objeto
- Precio y forma de pago
- Condiciones del contrato definitivo
- Plazo para celebracion del contrato definitivo
- Clausula penal para caso de incumplimiento

RIESGOS A PROTEGER:
- Clausula de restitucion de arras si el vendedor incumple (doble valor)
- Clausula de perdida de arras si el comprador incumple
- Condicion suspensiva: aprobacion del credito hipotecario
- Clausula de libre de gravamenes y cargas

Incluye todas las clausulas necesarias para una promesa de compraventa valida bajo el derecho ecuatoriano.
```

---

## Seccion 2: IA para revision de contratos de terceros

Cuando tu cliente te trae un contrato redactado por la contraparte, la revision con IA acelera el proceso de identificacion de riesgos. El flujo es:

1. Anonimizar el contrato (sustituir nombres y datos identificables)
2. Cargar el contrato a Claude (mejor para documentos largos) o ChatGPT
3. Pedir el analisis desde la perspectiva de tu cliente
4. Revisar el output con criterio profesional

### Prompt para revision de contrato desde perspectiva del cliente

```
Revisa el siguiente contrato desde la perspectiva de [MI CLIENTE: EL PROVEEDOR / EL COMPRADOR / EL ARRENDATARIO / ETC.].

[PEGAR TEXTO DEL CONTRATO ANONIMIZADO]

Proporciona el siguiente analisis:

1. RESUMEN EJECUTIVO: De que trata el contrato en 5 oraciones. Para que tipo de relacion es adecuado.

2. CLAUSULAS DE RIESGO PARA MI CLIENTE:
Para cada clausula problematica:
| Clausula | Riesgo | Nivel (Alto/Medio/Bajo) | Redaccion alternativa sugerida |

3. VACIOS CRITICOS: Que clausulas importantes estan ausentes y deberian incluirse para proteger a mi cliente?

4. CLAUSULAS ABUSIVAS O ILEGALES: Hay alguna clausula que podria ser nula o impugnable bajo el Codigo Civil, Codigo de Comercio o LOPDP ecuatorianos?

5. DESEQUILIBRIO CONTRACTUAL: El contrato otorga derechos equivalentes a ambas partes o esta sesgado hacia una de ellas?

6. RECOMENDACIONES: Lista de las 5 modificaciones mas importantes a negociar antes de firmar.

Usa el marco del derecho ecuatoriano. Si identificas clausulas comunes en contratos internacionales pero cuestionables en Ecuador, marcalas especificamente.
```

### Identificacion de clausulas leoninas

En contratos de adhesion (seguros, servicios financieros, contratos de grandes empresas), es comun encontrar clausulas que concentran todos los riesgos en el cliente. La IA puede identificarlas rapidamente:

```
El siguiente es un contrato de adhesion que mi cliente debe firmar con [TIPO DE EMPRESA].
[TEXTO DEL CONTRATO]

Identifica especificamente:
1. Clausulas que limiten unilateralmente la responsabilidad de la empresa frente al cliente
2. Clausulas que permitan a la empresa modificar las condiciones sin consentimiento del cliente
3. Clausulas de renuncia a derechos que el cliente no puede renunciar valida mente bajo la Ley Organica de Defensa del Consumidor ecuatoriana
4. Clausulas de jurisdiccion que obliguen al cliente a litigar en lugar distante o inconveniente
5. Plazos de prescripcion contractuales que sean menores a los legales

Para cada clausula identificada: cita la clausula, explica por que es problematica y si podria ser impugnable.
```

---

## Seccion 3: Microsoft Copilot en Word para contratos

Si tu firma usa Microsoft 365 Business, Copilot integrado en Word ofrece una alternativa que trabaja directamente dentro de tu entorno de documentos sin necesidad de copiar y pegar.

### Capacidades de Copilot en Word para contratos

**Revisión con comentarios:**
Selecciona una clausula o el documento completo → clic derecho → "Refinar con Copilot" → "Revisar este texto"
Copilot puede sugerir mejoras de redaccion sin cambiar el contenido juridico.

**Resumir documentos largos:**
"Resume este contrato en los puntos clave para presentar a mi cliente de manera comprensible"

**Generar clausulas adicionales:**
"Agrega una clausula de confidencialidad estandar despues de la clausula de obligaciones"

**Adaptar lenguaje:**
"Reescribe esta clausula de resolusion de conflictos en lenguaje mas simple para que mi cliente pueda comprenderla sin ser abogado"

### Limitacion importante de Copilot en Word

Copilot en Word trabaja con tu documento pero no tiene conocimiento especifico de normativa ecuatoriana actualizada. Es excelente para mejoras de redaccion y estructura, pero no para validacion juridica. La revision juridica del contenido sigue siendo tu responsabilidad.

---

## Seccion 4: Tipos de contratos frecuentes en la practica ecuatoriana — prompts especializados

### Contrato laboral a plazo fijo

```
Redacta un contrato de trabajo a plazo fijo bajo el Codigo de Trabajo ecuatoriano con:
- Cargo: [CARGO]
- Plazo: [N] meses (maximo 2 anos segun art. 14 CT)
- Remuneracion: $[MONTO] USD mensuales + beneficios de ley
- Horario: [HORARIO]
- Clausula de confidencialidad laboral
- Clausula de no competencia (si aplica)
Incluye todos los elementos obligatorios del art. 20 del Codigo de Trabajo.
```

### Contrato de mutuo (prestamo)

```
Redacta un contrato de mutuo (prestamo de dinero) entre personas naturales bajo el Codigo Civil ecuatoriano:
- Prestamista: persona natural
- Prestatario: persona natural
- Monto: $[VALOR] USD
- Tasa de interes: [TASA]% anual (verificar no supere tasa maxima SB Ecuador)
- Plazo de devolucion: [N] meses
- Garantia: [TIPO DE GARANTIA O "PERSONAL"]
- Clausula de incumplimiento: vencimiento total de la deuda
Incluye tabla de amortizacion simplificada o referencia a cronograma adjunto.
```

### Contrato de sociedad de hecho

```
Redacta un acuerdo de colaboracion empresarial (joint venture) entre dos personas juridicas ecuatorianas para:
- Objeto comun: [PROYECTO]
- Duracion: [PLAZO]
- Participacion en utilidades y perdidas: 50/50 (o segun indicacion)
- Aportes de cada parte: [DESCRIPCION]
- Organo de gestion: comite de administracion con representante de cada parte
- Propiedad intelectual generada: [A QUIEN PERTENECE]
- Causales de disolucion
Bajo el Codigo Civil y Codigo de Comercio ecuatorianos.
```

---

## Resumen del Modulo

- Los borradores con IA reducen el tiempo de redaccion inicial en 60-70%, con revision profesional obligatoria posterior
- El prompt para contratos debe incluir: tipo, partes, objeto, condiciones economicas, clausulas especiales y normativa
- La revision de contratos de terceros con IA es especialmente util para identificar desequilibrios y vacios
- Microsoft Copilot en Word mejora la redaccion pero no reemplaza la validacion juridica del contenido
- La normativa de referencia para contratos ecuatorianos incluye: Codigo Civil, Codigo de Comercio, Codigo de Trabajo y LOPDP segun el tipo de contrato

---

## Ejercicio Rapido (15 minutos)

Escoge uno de estos ejercicios segun tu practica:

**Opcion A (redaccion):** Usa el prompt de contrato de prestacion de servicios y genera un borrador. Revisa el resultado e identifica: que falta, que sobra, y que tendrias que adaptar para un cliente real tuyo.

**Opcion B (revision):** Toma un contrato que tengas en tu escritorio (anonimizalo), cargalo en Claude y usa el prompt de revision desde perspectiva del cliente. Compara el output con tu propio analisis previo: la IA identifico algo que tu pasaste por alto?

---

**Siguiente modulo:** J-03 — Analisis de Riesgo Legal Automatizado
