# Ejercicio Sesion 3: Data Quality y Great Expectations

**Materia:** Data Engineering Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Implementar un framework de calidad de datos con Great Expectations: expectativas, suites, checkpoint, data docs, y pipeline de validacion automatico integrado con Airflow para datos del IESS y SRI Ecuador.

## Contexto

Sin calidad de datos, los mejores modelos de ML fallan y los reportes ejecutivos son incorrectos. El IESS Ecuador tiene datos de 8 millones de afiliados con inconsistencias historicas (cedulas invalidas, fechas futuras, salarios negativos). Great Expectations permite definir "contratos de calidad" que se verifican automaticamente en cada ejecucion del pipeline — como unit tests pero para datos.

## Instrucciones

1. Instala: `pip install great-expectations`.

2. Crea el archivo `sesion03_data_quality_ecuador.py`:

```python
# Data Quality + Great Expectations - ITSEIA
# Data Engineering Avanzado
# Validacion automatica datos IESS Ecuador

import pandas as pd
import numpy as np
import json
from datetime import datetime
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("DATA QUALITY — GREAT EXPECTATIONS — IESS ECUADOR")
print("=" * 65)

# ================================================
# CONCEPTO: EXPECTATIVAS DE DATOS
# ================================================
print("\n--- FILOSOFIA DATA QUALITY ---")

pilares = {
    "Completitud":    "% de valores no nulos — cedula nunca nula, ingreso puede serlo",
    "Unicidad":       "sin duplicados — cada cedula aparece una sola vez",
    "Validez":        "valores dentro de rangos y formatos esperados",
    "Consistencia":   "salario_total = salario_base + bonificaciones",
    "Oportunidad":    "datos actualizados — aportaciones de hace < 45 dias",
    "Precision":      "redondeo correcto, unidades consistentes (USD, no centavos)",
}
for k, v in pilares.items():
    print(f"  {k:<15}: {v}")

# ================================================
# DATASET IESS CON PROBLEMAS DE CALIDAD
# ================================================
print("\n--- DATASET IESS (con problemas intencionales) ---")

n = 1000
df = pd.DataFrame({
    "cedula":           [f"17{np.random.randint(10000000,99999999):08d}"
                          if np.random.random() > 0.03 else "0000000000"  # cedulas invalidas
                          for _ in range(n)],
    "nombre":           [f"Afiliado_{i}" for i in range(n)],
    "salario":          np.where(np.random.random(n) < 0.02,
                                  -500,  # salarios negativos
                                  np.random.lognormal(6.3, 0.5, n).round(2)),
    "fecha_afiliacion": [pd.Timestamp("2010-01-01") + pd.Timedelta(days=int(d))
                          if np.random.random() > 0.01
                          else pd.Timestamp("2030-01-01")  # fecha futura
                          for d in np.random.randint(0, 5000, n)],
    "categoria":        np.random.choice(["privado","publico","autonomo","voluntario",
                                           "INVALIDO"],  # valor invalido
                                           n, p=[0.55,0.25,0.10,0.09,0.01]),
    "sector":           np.random.choice(["comercio","manufactura","servicios",None], n,
                                           p=[0.40,0.20,0.35,0.05]),  # nulos
    "num_aportes_12m":  np.random.randint(-1, 13, n),  # -1 invalido
    "empresa_ruc":      [f"17{np.random.randint(10000000,99999999):08d}001"
                          if np.random.random() > 0.04 else None  # nulos
                          for _ in range(n)],
})

print(f"  Dataset: {df.shape} | Problemas intencionales sembrados")
print(f"  Cedulas invalidas: {(df['cedula']=='0000000000').sum()}")
print(f"  Salarios negativos: {(df['salario']<0).sum()}")
print(f"  Fechas futuras: {(df['fecha_afiliacion'] > pd.Timestamp('today')).sum()}")
print(f"  Categorias invalidas: {(df['categoria']=='INVALIDO').sum()}")
print(f"  Nulos en sector: {df['sector'].isna().sum()}")

# ================================================
# EXPECTATIVAS GREAT EXPECTATIONS (simuladas)
# ================================================
print("\n--- EXPECTATIVAS (Great Expectations) ---")

class ExpectationSuite:
    """Simula una suite de Great Expectations."""

    def __init__(self, nombre):
        self.nombre = nombre
        self.resultados = []

    def expect_column_values_to_not_be_null(self, col, df, threshold=0.0):
        n_nulos = df[col].isna().sum()
        pct_nulos = n_nulos / len(df)
        passed = pct_nulos <= threshold
        self.resultados.append({
            "expectation":  f"not_null({col})",
            "passed":       passed,
            "n_unexpected": int(n_nulos),
            "pct_unexpected": round(pct_nulos*100, 2),
        })
        return passed

    def expect_column_values_to_be_in_set(self, col, df, valid_values):
        invalidos = df[~df[col].isin(valid_values) & df[col].notna()][col]
        passed = len(invalidos) == 0
        self.resultados.append({
            "expectation":  f"in_set({col})",
            "passed":       passed,
            "n_unexpected": len(invalidos),
            "ejemplos":     invalidos.unique()[:3].tolist(),
        })
        return passed

    def expect_column_values_to_be_between(self, col, df, min_val, max_val):
        fuera = df[(df[col].notna()) & ((df[col] < min_val) | (df[col] > max_val))][col]
        passed = len(fuera) == 0
        self.resultados.append({
            "expectation":  f"between({col},{min_val},{max_val})",
            "passed":       passed,
            "n_unexpected": len(fuera),
            "min_observado": float(df[col].min()) if len(df[col].dropna()) > 0 else None,
            "max_observado": float(df[col].max()) if len(df[col].dropna()) > 0 else None,
        })
        return passed

    def expect_column_values_to_match_regex(self, col, df, regex):
        import re
        invalidos = df[df[col].notna() & ~df[col].astype(str).str.match(regex)]
        passed = len(invalidos) == 0
        self.resultados.append({
            "expectation":  f"regex({col})",
            "passed":       passed,
            "n_unexpected": len(invalidos),
        })
        return passed

    def expect_column_to_be_unique(self, col, df):
        duplicados = df[df[col].duplicated(keep=False) & df[col].notna()]
        passed = len(duplicados) == 0
        self.resultados.append({
            "expectation":  f"unique({col})",
            "passed":       passed,
            "n_unexpected": len(duplicados),
        })
        return passed

    def expect_table_row_count_to_be_between(self, df, min_rows, max_rows):
        passed = min_rows <= len(df) <= max_rows
        self.resultados.append({
            "expectation":  f"row_count_between({min_rows},{max_rows})",
            "passed":       passed,
            "actual_count": len(df),
        })
        return passed

    def generar_reporte(self):
        total = len(self.resultados)
        pasaron = sum(1 for r in self.resultados if r["passed"])
        print(f"\n  === DATA DOCS: {self.nombre} ===")
        print(f"  Score calidad: {pasaron}/{total} ({pasaron/total*100:.0f}%)")
        print(f"  {'Expectativa':<45} {'Estado':<10} {'Fallidos'}")
        for r in self.resultados:
            estado = "PASS" if r["passed"] else "FAIL"
            inesperados = r.get("n_unexpected", "-")
            print(f"  {r['expectation']:<45} {estado:<10} {inesperados}")
        return {"total": total, "passed": pasaron, "score_pct": pasaron/total*100}

# Crear suite de expectativas IESS
suite = ExpectationSuite("iess_afiliados_suite")

# Ejecutar expectativas
suite.expect_table_row_count_to_be_between(df, 500, 5000)
suite.expect_column_values_to_not_be_null("cedula", df, threshold=0.0)
suite.expect_column_values_to_not_be_null("nombre", df, threshold=0.0)
suite.expect_column_values_to_not_be_null("empresa_ruc", df, threshold=0.05)
suite.expect_column_values_to_be_in_set(
    "categoria", df, ["privado","publico","autonomo","voluntario"]
)
suite.expect_column_values_to_be_between("salario", df, 0, 100000)
suite.expect_column_values_to_be_between("num_aportes_12m", df, 0, 12)
suite.expect_column_values_to_match_regex(
    "cedula", df, r"^[0-9]{10}$"
)
suite.expect_column_to_be_unique("cedula", df)

reporte = suite.generar_reporte()

# ================================================
# CHECKPOINT: BLOQUEAR PIPELINE SI FALLA
# ================================================
print("\n--- CHECKPOINT: DECISION DEL PIPELINE ---")

THRESHOLD_APROBACION = 75.0  # % minimo de expectativas que deben pasar

if reporte["score_pct"] >= THRESHOLD_APROBACION:
    print(f"  CHECKPOINT: APROBADO ({reporte['score_pct']:.0f}% >= {THRESHOLD_APROBACION}%)")
    print("  Pipeline continua a la siguiente etapa")
    continuar = True
else:
    print(f"  CHECKPOINT: BLOQUEADO ({reporte['score_pct']:.0f}% < {THRESHOLD_APROBACION}%)")
    print("  Pipeline DETENIDO — datos movidos a dead letter zone")
    continuar = False

# ================================================
# CORREGIR DATOS VALIDOS
# ================================================
print("\n--- CORRECCIONES AUTOMATICAS ---")

df_limpio = df.copy()

# Eliminar registros invalidos irreparables
df_invalidos = df_limpio[
    (df_limpio["cedula"] == "0000000000") |
    (df_limpio["salario"] < 0) |
    (df_limpio["categoria"] == "INVALIDO") |
    (df_limpio["num_aportes_12m"] < 0)
]
df_limpio = df_limpio.drop(index=df_invalidos.index)

# Corregir fechas futuras → hoy
df_limpio.loc[df_limpio["fecha_afiliacion"] > pd.Timestamp("today"),
               "fecha_afiliacion"] = pd.Timestamp("today")

# Imputar nulos en sector
moda_sector = df_limpio["sector"].mode()[0]
df_limpio["sector"] = df_limpio["sector"].fillna(moda_sector)

print(f"  Registros eliminados (invalidos): {len(df_invalidos)}")
print(f"  Registros en dataset limpio:      {len(df_limpio)}")
print(f"  Fechas futuras corregidas a hoy")
print(f"  Nulos en sector imputados con moda: '{moda_sector}'")

# Re-validar despues de limpieza
suite2 = ExpectationSuite("iess_post_limpieza")
suite2.expect_column_values_to_be_between("salario", df_limpio, 0, 100000)
suite2.expect_column_values_to_be_in_set(
    "categoria", df_limpio, ["privado","publico","autonomo","voluntario"]
)
suite2.expect_column_values_to_not_be_null("sector", df_limpio)
reporte2 = suite2.generar_reporte()

print("\n" + "=" * 65)
print("DATA QUALITY — CONCEPTOS CLAVE:")
print("  Expectativas:  contratos formales sobre el comportamiento de los datos")
print("  Suite:         coleccion de expectativas para un dataset")
print("  Checkpoint:    gate en el pipeline — bloquea si calidad < threshold")
print("  Data Docs:     documentacion HTML auto-generada con resultados")
print("  Score calidad: % expectativas que pasan — KPI del equipo de datos")
print("  Dead letter:   registros rechazados aislados para analisis posterior")
print("=" * 65)
```

3. Implementa la expectativa personalizada `expect_cedula_ecuatoriana_valida` que verifica el digito verificador de la cedula.

4. Integra las expectativas con un DAG Airflow: si el checkpoint falla, el DAG envía alerta al Slack del equipo.

## Usa IA para...

> Abre Claude y escribe:
> "Tengo un pipeline de datos del IESS Ecuador que procesa 8 millones de registros mensuales. Great Expectations tarda 45 minutos en validar todo el dataset. ¿Como acelero la validacion? Opciones: 1) validar muestra estadistica (n=10.000 con IC 99%), 2) validar solo registros nuevos del batch actual, 3) validar en paralelo con Spark. ¿Cual es estadisticamente correcto para detectar problemas sistematicos? Dame el codigo para la validacion por muestreo con calculo del intervalo de confianza."

Despues de leer la respuesta:
- Implementa la validacion por muestreo estadistico.
- Calcula el tamano de muestra necesario para detectar una tasa de error > 1% con IC 95%.

## Que aprendiste

- Las expectativas de datos son contratos formales: "la columna cedula nunca debe ser nula".
- Un checkpoint bloquea el pipeline si la calidad cae por debajo del umbral — evita propagar datos malos.
- Los "Data Docs" son la documentacion automatica de Great Expectations — visible para todo el equipo.
- Las correcciones automaticas (imputacion, eliminacion) deben ser conservadoras y auditables.
- La re-validacion post-limpieza confirma que las correcciones resolvieron los problemas.
- El score de calidad de datos es un KPI del equipo de data engineering — debe medirse por pipeline.

## Reto extra

Construye un Sistema de Gobierno de Calidad de Datos para el INEC Ecuador: define suites de expectativas para cada uno de los 5 modulos del Censo (vivienda, hogar, persona, migracion, discapacidad), implementa un dashboard de calidad en Streamlit con tendencia semanal del score por modulo, genera alertas automaticas cuando el score cae mas de 2 puntos, y crea el proceso de "data remediation" donde el equipo de campo puede corregir registros rechazados con auditoria.
