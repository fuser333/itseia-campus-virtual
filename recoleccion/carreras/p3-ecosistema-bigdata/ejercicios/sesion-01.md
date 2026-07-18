# Ejercicio Sesion 1: Que es Big Data — Las 5 V's con Ejemplos Ecuador

**Materia:** Ecosistema Big Data (Hadoop/Spark)
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Comprender y aplicar el framework de las 5 V's del Big Data (Volumen, Velocidad, Variedad, Veracidad, Valor) identificando ejemplos concretos de Ecuador y diferenciando cuando un problema es realmente de Big Data versus cuando basta con Pandas o Excel.

## Contexto

En Ecuador se generan millones de datos cada dia: el SRI procesa miles de facturas electronicas por hora, el CNE registra millones de votos en elecciones, el IESS gestiona registros de millones de afiliados, y el Banco Central monitorea transacciones financieras en tiempo real. Pero no todo problema es Big Data. Entender las 5 V's te permite diagnosticar correctamente si necesitas Hadoop, Spark o simplemente una buena hoja de calculo.

## Instrucciones

1. Abre Google Colab y crea `sesion01_bigdata_conceptos.ipynb`.

2. Analiza el Volumen con calculos reales:

```python
# ITSEIA - Ecosistema Big Data - Sesion 1
# Las 5 V's con ejemplos Ecuador

# ============================================================
# V1: VOLUMEN — Cuanto dato genera Ecuador
# ============================================================

# Estimaciones basadas en fuentes publicas ecuatorianas

datos_ecuador = {
    'SRI - Facturas electronicas/dia': 2_500_000,
    'CNT - Llamadas telefonicas/dia': 8_000_000,
    'Banco Central - Transacciones/hora': 450_000,
    'Redes sociales Ecuador - Posts/dia': 15_000_000,
    'IESS - Registros afiliados activos': 4_200_000,
    'INEC - Registros Censo 2022': 18_000_000,
    'MinSalud - Consultas medicas/anio': 35_000_000,
}

print("=" * 60)
print("VOLUMEN DE DATOS GENERADOS EN ECUADOR")
print("=" * 60)
for fuente, cantidad in datos_ecuador.items():
    if cantidad >= 1_000_000:
        print(f"  {fuente}:\n    {cantidad/1_000_000:.1f} millones")
    else:
        print(f"  {fuente}:\n    {cantidad:,}")

# Calcular cuanto ocupan estos datos
# Asumiendo promedio 500 bytes por registro
total_registros_dia = sum([
    datos_ecuador['SRI - Facturas electronicas/dia'],
    datos_ecuador['CNT - Llamadas telefonicas/dia'],
    datos_ecuador['Redes sociales Ecuador - Posts/dia'],
    datos_ecuador['Banco Central - Transacciones/hora'] * 24
])

bytes_dia = total_registros_dia * 500
gb_dia = bytes_dia / (1024 ** 3)
tb_anio = gb_dia * 365 / 1024

print(f"\nEstimado datos generados/dia: {total_registros_dia/1_000_000:.1f}M registros")
print(f"Almacenamiento estimado: {gb_dia:.1f} GB/dia = {tb_anio:.1f} TB/anio")
print("\n¿Esto cabe en Excel?", "NO - Excel max ~1M filas" if total_registros_dia > 1_000_000 else "Si")
print("¿Esto necesita Hadoop/Spark?", "SI" if tb_anio > 10 else "Tal vez no todavia")
```

3. Analiza la Velocidad con una simulacion de stream:

```python
# ============================================================
# V2: VELOCIDAD — Procesamiento en tiempo real
# ============================================================

import time
import random
from datetime import datetime

print("\n" + "=" * 60)
print("VELOCIDAD: Simulacion de stream de transacciones Ecuador")
print("=" * 60)

# Simular transacciones de banco ecuatoriano llegando en tiempo real
def generar_transaccion():
    bancos = ['Pichincha', 'Guayaquil', 'Produbanco', 'Pacifico', 'Internacional']
    tipos = ['Transferencia', 'Pago_TC', 'Retiro', 'Deposito', 'Pago_Servicio']
    return {
        'timestamp': datetime.now().strftime('%H:%M:%S.%f'),
        'banco': random.choice(bancos),
        'tipo': random.choice(tipos),
        'monto': round(random.uniform(1, 5000), 2),
        'ciudad': random.choice(['Quito', 'Guayaquil', 'Cuenca', 'Ambato'])
    }

# Simular 20 transacciones rapidas (como llegarian en streaming)
print("\nStream de transacciones (primeras 20):")
total_monto = 0
contador = {'Fraude_potencial': 0, 'Normal': 0}

for i in range(20):
    tx = generar_transaccion()
    total_monto += tx['monto']

    # Regla simple de deteccion en tiempo real
    alerta = ""
    if tx['monto'] > 4000:
        alerta = " <<< ALERTA FRAUDE POTENCIAL"
        contador['Fraude_potencial'] += 1
    else:
        contador['Normal'] += 1

    print(f"  [{tx['timestamp']}] {tx['banco']:12} | {tx['tipo']:17} | ${tx['monto']:8.2f} | {tx['ciudad']}{alerta}")

print(f"\nTotal procesado: ${total_monto:,.2f}")
print(f"Alertas generadas: {contador['Fraude_potencial']}")
print("\nConclusion: Este stream necesita procesamiento en milisegundos.")
print("Herramienta adecuada: Apache Kafka + Spark Streaming")
```

4. Analiza la Variedad de fuentes de datos:

```python
# ============================================================
# V3: VARIEDAD — Tipos de datos en Ecuador
# ============================================================

print("\n" + "=" * 60)
print("VARIEDAD: Tipos de datos en instituciones ecuatorianas")
print("=" * 60)

variedad_datos = {
    'Estructurados': {
        'Descripcion': 'Tablas, bases de datos relacionales',
        'Ejemplos_Ecuador': [
            'Facturas SRI (XML estructurado)',
            'Registros IESS (tablas SQL)',
            'Estadisticas INEC (CSV)',
            'Transacciones bancarias'
        ],
        'Herramienta': 'SQL, Pandas, Spark SQL'
    },
    'Semi-estructurados': {
        'Descripcion': 'JSON, XML, logs',
        'Ejemplos_Ecuador': [
            'API del Banco Central (JSON)',
            'Logs de acceso web de servicios publicos',
            'Respuestas API SENESCYT',
            'Datos GPS de flotas de transporte publico'
        ],
        'Herramienta': 'Spark, MongoDB, Elasticsearch'
    },
    'No estructurados': {
        'Descripcion': 'Texto, imagenes, audio, video',
        'Ejemplos_Ecuador': [
            'Tweets y Facebook sobre politica ecuatoriana',
            'Llamadas grabadas de call centers (audio)',
            'Videos de camaras de seguridad vial (ANT)',
            'Documentos escaneados del Registro Civil',
            'Radiografias del MSP (ImagemIA)'
        ],
        'Herramienta': 'Hadoop, Spark ML, NLP, Computer Vision'
    }
}

for tipo, info in variedad_datos.items():
    print(f"\n{tipo.upper()} ({info['Descripcion']})")
    print(f"  Herramienta: {info['Herramienta']}")
    print("  Ejemplos Ecuador:")
    for ej in info['Ejemplos_Ecuador']:
        print(f"    - {ej}")
```

5. Evalua Veracidad y Valor:

```python
# ============================================================
# V4: VERACIDAD — Calidad de datos Ecuador
# ============================================================
print("\n" + "=" * 60)
print("VERACIDAD: Problemas reales de calidad en datos ecuatorianos")
print("=" * 60)

problemas_calidad = [
    ("INEC Censo 2022", "15% de hogares requirio re-visita por datos inconsistentes"),
    ("SRI RUC", "~8% de RUCs activos corresponden a empresas fantasma o inactivas"),
    ("IESS Afiliados", "Duplicados por cambios de nombre/cedula con errores tipograficos"),
    ("Municipios GPS", "Coordenadas de propiedades con precision de 50-100m (insuficiente para catastro)"),
    ("Redes sociales", "30-40% de cuentas son bots segun estudios de elecciones Ecuador 2023"),
]

for fuente, problema in problemas_calidad:
    print(f"\n  {fuente}:")
    print(f"    Problema: {problema}")

# ============================================================
# V5: VALOR — El ROI del Big Data en Ecuador
# ============================================================
print("\n" + "=" * 60)
print("VALOR: ROI estimado de proyectos Big Data en Ecuador")
print("=" * 60)

proyectos_valor = {
    'SRI - Deteccion evasion fiscal': '$180M recuperados/anio (estimado)',
    'Banco Pichincha - Scoring crediticio IA': '35% reduccion mora',
    'CNT - Prediccion churn clientes': '$4.2M retenidos/anio',
    'MSP - Prediccion brotes epidemicos': 'Anticipa 2-3 semanas antes',
    'ANT - Deteccion infracciones camara': '60% reduccion accidentes zona piloto',
}

for proyecto, valor in proyectos_valor.items():
    print(f"  {proyecto}:\n    Valor: {valor}")

print("\n" + "=" * 60)
print("RESUMEN: ¿Cuando usar Big Data?")
print("=" * 60)
criterios = [
    ("Volumen", "> 1TB de datos o > 10M registros"),
    ("Velocidad", "Procesamiento en tiempo real o < 1 segundo"),
    ("Variedad", "Multiples fuentes de datos heterogeneos"),
    ("Veracidad", "Datos de fuentes no confiables que deben cruzarse"),
    ("Valor", "ROI claro: ahorro, ingreso o reduccion de riesgo"),
]
print("\nUsa Big Data cuando al menos 3 de estas condiciones aplican:")
for v, condicion in criterios:
    print(f"  {v}: {condicion}")
```

6. En una celda de texto, identifica un problema real de una empresa o institucion ecuatoriana que conoces y clasifícalo segun las 5 V's. Justifica si necesita Big Data o no.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Dame 3 casos de uso de Big Data en el sector bancario ecuatoriano que sean reales o muy probables. Para cada caso, indica cual de las 5 V's (Volumen, Velocidad, Variedad, Veracidad, Valor) es la mas critica y por que. Usa contexto real de Ecuador: dolares, poblacion 18M, penetracion bancaria."

Compara la respuesta con lo que encontraste en el ejercicio.

## Que aprendiste

- Las 5 V's son el framework para diagnosticar si un problema es realmente de Big Data.
- Ecuador genera Big Data en sectores clave: banca, tributario, salud, transporte y redes sociales.
- No todo problema necesita Hadoop o Spark: si cabe en memoria de un computador, usa Pandas.
- La Veracidad es el desafio mas subestimado: datos incorrectos producen decisiones incorrectas.
- El Valor es la V mas importante: el Big Data solo tiene sentido si genera resultados tangibles.

## Reto extra

Investiga el proyecto "Sistema de Informacion Nacional de Estadisticas Educativas (SINEC)" del Ministerio de Educacion del Ecuador. Clasifícalo segun las 5 V's con datos especificos (cuantos estudiantes, cuantas escuelas, cuantas variables). Concluye si el SINEC requiere tecnologia Big Data o si basta con una base de datos relacional tradicional. Escribe un parrafo tecnico de 150 palabras.
