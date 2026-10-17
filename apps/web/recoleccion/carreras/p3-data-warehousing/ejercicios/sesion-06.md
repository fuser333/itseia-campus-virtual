# Ejercicio Sesion 6: Data Quality y Validacion

**Materia:** Data Warehousing y ETL
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion estimada:** 35 min

## Objetivo

Implementar un framework de calidad de datos con reglas de validacion, perfiles de datos y alertas automaticas, aplicado a datos del sector financiero ecuatoriano.

## Contexto

La calidad de datos es el problema numero uno en proyectos de data warehousing. Datos incorrectos en el DW = decisiones incorrectas. El SRI Ecuador necesita que los datos de declaraciones tributarias sean exactos: un RUC invalido o un monto negativo puede significar evasion fiscal o error de captura. Un framework de calidad detecta estos problemas automaticamente antes de que lleguen al DW.

## Instrucciones

1. Instala las librerias: `pip install great_expectations pandas`.

2. Crea el archivo `sesion06_data_quality_ecuador.py`:

```python
# Data Quality y Validacion - ITSEIA
# Framework de calidad: reglas, perfiles, alertas
# Dataset: declaraciones tributarias SRI Ecuador

import pandas as pd
import numpy as np
from datetime import datetime, date
import json

np.random.seed(2026)
print("=" * 65)
print("DATA QUALITY — DECLARACIONES SRI ECUADOR")
print("Framework de validacion y perfilado")
print("=" * 65)

# ================================================
# DATASET: declaraciones IVA simuladas
# ================================================
n = 200
actividades = ["comercio","servicios","manufactura","agricultura","construccion"]
provincias  = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua","Loja"]

df = pd.DataFrame({
    "ruc":                 [f"17{str(i).zfill(8)}001" for i in range(n)],
    "razon_social":        [f"Empresa_SRI_{i}" for i in range(n)],
    "actividad_economica": np.random.choice(actividades, n),
    "provincia":           np.random.choice(provincias, n),
    "periodo_fiscal":      [f"2024-{str(m).zfill(2)}" for m in np.random.randint(1, 13, n)],
    "ventas_totales":      np.random.lognormal(8.5, 1.2, n).round(2),
    "iva_cobrado":         np.random.lognormal(7.2, 1.1, n).round(2),
    "iva_pagado":          np.random.lognormal(6.8, 1.0, n).round(2),
    "empleados":           np.random.randint(1, 150, n),
    "fecha_declaracion":   pd.date_range("2024-01-01", periods=n, freq="D")[:n],
    "forma_pago":          np.random.choice(["efectivo","transferencia","credito"], n),
})
df["iva_a_pagar"] = (df["iva_cobrado"] - df["iva_pagado"]).round(2)

# Inyectar errores de calidad
# Error 1: RUC invalido (longitud incorrecta)
df.loc[5, "ruc"] = "17001"
df.loc[12, "ruc"] = "1700000000"   # 10 digitos (debe ser 13)

# Error 2: ventas negativas (imposible)
df.loc[20, "ventas_totales"] = -5000
df.loc[35, "ventas_totales"] = -250

# Error 3: IVA > ventas (logicamente imposible: IVA 15% maximo)
df.loc[50, "iva_cobrado"] = df.loc[50, "ventas_totales"] * 1.5

# Error 4: fechas futuras
df.loc[70, "fecha_declaracion"] = pd.Timestamp("2030-01-01")

# Error 5: empleados = 0 con ventas > 100k (sospechoso)
df.loc[80, "empleados"] = 0

# Error 6: provincia invalida
df.loc[90, "provincia"] = "Atlantida"

# Error 7: periodo fiscal invalido
df.loc[100, "periodo_fiscal"] = "2024-15"

print(f"Dataset: {len(df)} declaraciones (con {7} tipos de errores inyectados)")

# ================================================
# FRAMEWORK DE CALIDAD: clase con reglas
# ================================================
class DataQualityFramework:
    def __init__(self, df, nombre_dataset):
        self.df = df.copy()
        self.nombre = nombre_dataset
        self.resultados = []
        self.timestamp = datetime.now()

    def regla(self, nombre, condicion, descripcion, severidad="ERROR"):
        """Ejecuta una regla de calidad y registra el resultado."""
        failing_rows = self.df[~condicion]
        n_fail = len(failing_rows)
        n_total = len(self.df)
        pct = n_fail / n_total * 100
        paso = n_fail == 0

        self.resultados.append({
            "regla": nombre,
            "descripcion": descripcion,
            "severidad": severidad,
            "total_filas": n_total,
            "filas_fallidas": n_fail,
            "pct_fallido": round(pct, 2),
            "paso": paso,
            "indices_fallidos": failing_rows.index.tolist()[:5]  # primeros 5
        })

        estado = "PASO" if paso else f"FALLO ({n_fail} filas, {pct:.1f}%)"
        icon = "OK" if paso else ("WARN" if severidad == "WARNING" else "ERR")
        print(f"  [{icon}] {nombre:<40} {estado}")
        return paso

    def generar_reporte(self):
        total = len(self.resultados)
        fallidas = sum(1 for r in self.resultados if not r["paso"])
        errores = sum(1 for r in self.resultados if not r["paso"] and r["severidad"] == "ERROR")
        warnings = sum(1 for r in self.resultados if not r["paso"] and r["severidad"] == "WARNING")

        print(f"\n  RESUMEN: {total} reglas | {total-fallidas} OK | {warnings} WARN | {errores} ERR")
        calidad_score = (total - errores) / total * 100
        print(f"  SCORE CALIDAD: {calidad_score:.1f}%")

        if calidad_score >= 95:
            print(f"  DECISION: APROBAR para carga al DW")
        elif calidad_score >= 85:
            print(f"  DECISION: APROBAR con registro de alertas")
        else:
            print(f"  DECISION: RECHAZAR — calidad insuficiente")

        return calidad_score

# ================================================
# EJECUTAR REGLAS DE CALIDAD
# ================================================
print("\n--- EJECUTANDO REGLAS DE CALIDAD ---")

dq = DataQualityFramework(df, "declaraciones_iva_sri_2024")

# Reglas de completitud (no nulos)
dq.regla("not_null_ruc",
         df["ruc"].notna(),
         "RUC no puede ser nulo")
dq.regla("not_null_razon_social",
         df["razon_social"].notna() & (df["razon_social"] != ""),
         "Razon social no puede ser vacia")

# Reglas de formato
dq.regla("formato_ruc_13_digitos",
         df["ruc"].str.len() == 13,
         "RUC debe tener exactamente 13 caracteres")
dq.regla("formato_periodo_fiscal",
         df["periodo_fiscal"].str.match(r"^\d{4}-(0[1-9]|1[0-2])$"),
         "Periodo fiscal: formato YYYY-MM, mes 01-12")

# Reglas de rango
dq.regla("ventas_no_negativas",
         df["ventas_totales"] >= 0,
         "Ventas totales no pueden ser negativas")
dq.regla("empleados_positivos",
         df["empleados"] >= 0,
         "Numero de empleados no puede ser negativo")
dq.regla("iva_razonable",
         df["iva_cobrado"] <= df["ventas_totales"] * 0.20,
         "IVA cobrado no debe exceder 20% de ventas",
         severidad="WARNING")

# Reglas de consistencia
dq.regla("fecha_no_futura",
         df["fecha_declaracion"] <= pd.Timestamp(date.today()),
         "Fecha de declaracion no puede ser futura")
dq.regla("provincia_valida",
         df["provincia"].isin(["Pichincha","Guayas","Azuay","Manabi",
                                "Tungurahua","Loja","El Oro","Imbabura",
                                "Chimborazo","Cotopaxi","Los Rios","Esmeraldas"]),
         "Provincia debe ser una de las 24 provincias de Ecuador")

# Reglas de negocio
dq.regla("ventas_con_empleados",
         ~((df["ventas_totales"] > 100000) & (df["empleados"] == 0)),
         "Empresa con ventas > $100K debe tener al menos 1 empleado",
         severidad="WARNING")

score = dq.generar_reporte()

# ================================================
# PERFIL DE DATOS
# ================================================
print("\n--- PERFIL DE DATOS ---")
print("  Columnas numericas:")
for col in ["ventas_totales", "iva_cobrado", "empleados"]:
    s = df[col]
    print(f"  {col:<25}: min={s.min():.0f} | Q1={s.quantile(.25):.0f} | "
          f"med={s.median():.0f} | Q3={s.quantile(.75):.0f} | max={s.max():.0f} | "
          f"nulos={s.isnull().sum()}")

print("\n  Columnas categoricas:")
for col in ["actividad_economica", "provincia", "forma_pago"]:
    uniq = df[col].nunique()
    top = df[col].value_counts().index[0]
    print(f"  {col:<25}: {uniq} valores unicos | top: '{top}'")

# ================================================
# QUARANTINE: separar registros invalidos
# ================================================
print("\n--- CUARENTENA DE REGISTROS INVALIDOS ---")

# Obtener todos los indices que fallaron en reglas ERROR
indices_invalidos = set()
for r in dq.resultados:
    if not r["paso"] and r["severidad"] == "ERROR":
        indices_invalidos.update(r["indices_fallidos"])

df_valido   = df[~df.index.isin(indices_invalidos)].copy()
df_cuarenta = df[df.index.isin(indices_invalidos)].copy()
df_cuarenta["motivo_rechazo"] = "Fallo en reglas de calidad"

print(f"  Registros validos para DW:  {len(df_valido)}")
print(f"  Registros en cuarentena:    {len(df_cuarenta)}")
print(f"  Tasa de rechazo:            {len(df_cuarenta)/len(df)*100:.1f}%")

print("\n" + "=" * 65)
print(f"  Score final calidad: {score:.1f}%")
print(f"  Registros aptos para DW: {len(df_valido)} / {len(df)}")
print("=" * 65)
```

3. Ejecuta el framework y analiza el reporte de calidad.

4. Agrega 3 reglas de calidad nuevas especificas para el contexto tributario ecuatoriano.

## Usa IA para...

> Abre Gemini y escribe:
> "Soy data engineer en Ecuador implementando calidad de datos para declaraciones del SRI. ¿Cuales son las 5 reglas de calidad mas criticas que deberia validar en datos tributarios? ¿Que es Great Expectations y como lo uso para automatizar estas validaciones en Python?"

Despues de leer la respuesta:
- Implementa las 5 reglas que Gemini sugiere en el framework del ejercicio.
- Instala Great Expectations (`pip install great-expectations`) y convierte 2 reglas al formato GX.

## Que aprendiste

- La calidad de datos tiene 6 dimensiones: completitud, unicidad, validez, consistencia, precision y puntualidad.
- Un framework DQ define reglas, las ejecuta contra el dataset y genera un reporte con score.
- El patron "quarantine" separa registros invalidos para revision manual sin detener el pipeline.
- Great Expectations es la herramienta estandar de la industria para DQ en Python.
- `df[condicion].index.tolist()` obtiene los indices de las filas que fallaron una regla.
- Un score DQ < 85% deberia bloquear la carga al DW automaticamente.

## Reto extra

Implementa un sistema de "data quality historico": cada ejecucion del framework guarda el score en una tabla `dq_historial` con: fecha, dataset, score, n_reglas, n_fallidas. Genera un grafico de tendencia del score a lo largo del tiempo. Define un umbral de alerta: si el score cae mas de 5 puntos respecto al promedio de los ultimos 7 dias, envia una alerta (simula con print).
