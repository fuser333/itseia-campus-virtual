# Ejercicio Sesion 3: Calidad de Datos a Escala Enterprise

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 45 min

## Objetivo

Implementar un framework de calidad de datos a escala enterprise: dimensiones de calidad (completitud, unicidad, validez, consistencia, oportunidad, precision), perfiles automaticos, reglas de negocio complejas, score de calidad y dashboard ejecutivo — aplicado al Sistema de Historia Clinica Unica (HCU) del MSP Ecuador con 18 millones de registros.

## Contexto

La Historia Clinica Unica (HCU) del MSP Ecuador concentra datos de 18 millones de pacientes pero con una calidad deplorable: 2.3 millones de cedulas duplicadas, 450,000 fechas de nacimiento incorrectas (nacidos en 2099), 1.2 millones de registros sin diagnostico. Un analisis de calidad sistematico con dimensiones DAMA permite priorizar las correcciones que tienen mayor impacto clinico — empezando por los datos que afectan la prescripcion de medicamentos y la toma de decisiones clinicas.

## Instrucciones

1. Crea el archivo `sesion03_calidad_datos_enterprise_ecuador.py`:

```python
# Calidad de Datos Enterprise - ITSEIA
# Gobierno de Datos y Cumplimiento
# HCU MSP Ecuador — 6 dimensiones de calidad

import pandas as pd
import numpy as np
import re
import json
import sqlite3
from datetime import datetime, date
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("CALIDAD DE DATOS ENTERPRISE — HCU MSP ECUADOR")
print("Historia Clinica Unica: 18 millones de pacientes")
print("=" * 65)

# ================================================
# 6 DIMENSIONES DE CALIDAD DAMA
# ================================================
print("\n--- 6 DIMENSIONES DE CALIDAD (DAMA) ---")

dimensiones = {
    "Completitud": {
        "definicion": "% de campos obligatorios con valor — cedula, nombre, fecha_nacimiento",
        "formula":    "campos_no_nulos / total_campos_obligatorios * 100",
        "umbral_sbs": ">= 99%",
        "impacto":    "Datos incompletos → decision clinica incorrecta",
    },
    "Unicidad": {
        "definicion": "Ausencia de duplicados — cada paciente aparece una sola vez",
        "formula":    "(1 - duplicados / total_registros) * 100",
        "umbral_sbs": ">= 99.5%",
        "impacto":    "Duplicados → historial medico fragmentado, doble medicacion",
    },
    "Validez": {
        "definicion": "Valores dentro de rangos y formatos aceptados",
        "formula":    "registros_validos / total_registros * 100",
        "umbral_sbs": ">= 98%",
        "impacto":    "Cedula invalida → paciente no identificable en emergencia",
    },
    "Consistencia": {
        "definicion": "Datos coherentes entre si y con otras fuentes",
        "formula":    "registros_consistentes / total_registros * 100",
        "umbral_sbs": ">= 97%",
        "impacto":    "Fecha nacimiento vs edad → calculos de dosis incorrectos",
    },
    "Oportunidad": {
        "definicion": "Datos actualizados segun la frecuencia requerida",
        "formula":    "registros_actualizados_en_sla / total * 100",
        "umbral_sbs": ">= 95% (actualizacion en 48h post-consulta)",
        "impacto":    "HCU no actualizada → medico repite examenes innecesarios",
    },
    "Precision": {
        "definicion": "Nivel de detalle y exactitud — peso en kg no en lb",
        "formula":    "registros_con_precision_requerida / total * 100",
        "umbral_sbs": ">= 95%",
        "impacto":    "Dosis medicamento en unidades incorrectas → error medico grave",
    },
}

for dim, info in dimensiones.items():
    print(f"\n  [{dim}]")
    print(f"    Definicion: {info['definicion']}")
    print(f"    Umbral SBS: {info['umbral_sbs']}")

# ================================================
# DATASET: HCU MSP ECUADOR (MUESTRA CON PROBLEMAS)
# ================================================
print("\n--- DATASET HCU (muestra 5,000 pacientes) ---")

N = 5_000
PROVINCIAS = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua","Loja",
              "Imbabura","El Oro","Chimborazo","Bolivar"]
GRUPOS_SANGRE = ["A+","A-","B+","B-","AB+","AB-","O+","O-"]
DIAGNOSTICOS  = ["J06","E11","I10","Z00","J18","K35","S92","M54","F41","Z23"]

def generar_cedula_valida():
    """Genera cedula ecuatoriana valida con digito verificador."""
    provincia = np.random.randint(1, 25)
    resto = f"{np.random.randint(0, 10000000):07d}"
    cedula_base = f"{provincia:02d}{resto}"
    # Calcular digito verificador
    coeficientes = [2,1,2,1,2,1,2,1,2]
    suma = 0
    for i, c in enumerate(coeficientes):
        prod = int(cedula_base[i]) * c
        suma += prod - 9 if prod >= 10 else prod
    digito = (10 - suma % 10) % 10
    return cedula_base + str(digito)

df_hcu = pd.DataFrame({
    "id_paciente":  [f"HCU{i:07d}" for i in range(1, N+1)],
    "cedula":       [
        generar_cedula_valida() if np.random.random() > 0.05
        else f"000{np.random.randint(10000000,99999999):08d}"  # cedula invalida
        for _ in range(N)
    ],
    "nombre":       [f"Paciente_{i}" if np.random.random() > 0.02 else None for i in range(N)],
    "apellido":     [f"Apellido_{i}" if np.random.random() > 0.01 else None for i in range(N)],
    "fecha_nacimiento": [
        (date(np.random.randint(1940, 2005),
               np.random.randint(1, 13),
               np.random.randint(1, 28)).isoformat())
        if np.random.random() > 0.025
        else (date(2099, 1, 1).isoformat())  # fecha futura invalida
        for _ in range(N)
    ],
    "genero":       np.random.choice(["M","F","M","F","X","OTRO","Masculino","Femenino"],
                                      N, p=[0.40,0.40,0.05,0.05,0.04,0.03,0.02,0.01]),
    "provincia":    np.random.choice(PROVINCIAS + [None], N, p=[0.1]*10 + [0.0]),
    "telefono":     [
        f"09{np.random.randint(10000000,99999999):08d}" if np.random.random() > 0.15 else None
        for _ in range(N)
    ],
    "grupo_sangre": np.random.choice(GRUPOS_SANGRE + [None], N,
                                      p=[0.30,0.05,0.10,0.02,0.04,0.01,0.40,0.04,0.04]),
    "diagnostico_principal": np.random.choice(DIAGNOSTICOS + [None], N,
                                                p=[0.1]*10 + [0.0]),
    "peso_kg":      [
        round(np.random.normal(68, 12), 1) if np.random.random() > 0.08 else
        round(np.random.uniform(200, 500), 1)  # peso en libras por error
        for _ in range(N)
    ],
    "ultima_visita": pd.date_range("2022-01-01", periods=N, freq="H").strftime("%Y-%m-%d"),
})

print(f"  Registros: {df_hcu.shape}")

# ================================================
# PERFILADOR DE CALIDAD
# ================================================
print("\n--- PERFILADOR AUTOMATICO DE CALIDAD ---")

class PerfiladorCalidadHCU:
    """Perfila las 6 dimensiones de calidad de la HCU."""

    HOY = datetime.now().date()

    def medir_completitud(self, df):
        campos_obligatorios = ["cedula","nombre","apellido","fecha_nacimiento","provincia"]
        completos = {}
        for campo in campos_obligatorios:
            pct = df[campo].notna().mean() * 100
            completos[campo] = round(pct, 2)
        score = np.mean(list(completos.values()))
        return {"score": round(score, 2), "por_campo": completos}

    def medir_unicidad(self, df):
        dup_cedulas = df["cedula"].duplicated().sum()
        pct_unico   = (1 - dup_cedulas / len(df)) * 100
        return {"score": round(pct_unico, 2), "duplicados": int(dup_cedulas)}

    def medir_validez(self, df):
        n = len(df)
        cedula_patron = re.compile(r'^\d{10}$')
        cedulas_validas = df["cedula"].fillna("").astype(str).str.match(cedula_patron).mean() * 100

        fechas_validas = df["fecha_nacimiento"].apply(lambda x: (
            bool(x) and
            str(x) < self.HOY.isoformat() and
            str(x) > "1900-01-01"
        ) if pd.notna(x) else False).mean() * 100

        generos_validos = df["genero"].isin(["M","F","X"]).mean() * 100
        pesos_validos   = ((df["peso_kg"] > 0) & (df["peso_kg"] < 300)).mean() * 100

        score = np.mean([cedulas_validas, fechas_validas, generos_validos, pesos_validos])
        return {
            "score":          round(score, 2),
            "cedulas_validas": round(cedulas_validas, 2),
            "fechas_validas":  round(fechas_validas, 2),
            "generos_validos": round(generos_validos, 2),
            "pesos_validos":   round(pesos_validos, 2),
        }

    def medir_consistencia(self, df):
        # Edad coherente con fecha de nacimiento
        def edad_coherente(row):
            if pd.isna(row["fecha_nacimiento"]):
                return False
            try:
                fnac = datetime.strptime(str(row["fecha_nacimiento"]), "%Y-%m-%d").date()
                edad = (self.HOY - fnac).days / 365.25
                return 0 <= edad <= 120
            except:
                return False

        pct_edad_ok = df.apply(edad_coherente, axis=1).mean() * 100
        return {"score": round(pct_edad_ok, 2), "edad_coherente_pct": round(pct_edad_ok, 2)}

    def medir_oportunidad(self, df, sla_dias=48):
        if "ultima_visita" not in df.columns:
            return {"score": 100.0}
        recientes = (pd.to_datetime(df["ultima_visita"]) >=
                      pd.Timestamp.now() - pd.Timedelta(days=180)).mean() * 100
        return {"score": round(recientes, 2), "actualizados_180d_pct": round(recientes, 2)}

    def medir_precision(self, df):
        peso_preciso = ((df["peso_kg"] >= 2) & (df["peso_kg"] <= 250) &
                         (df["peso_kg"] == df["peso_kg"].round(1))).mean() * 100
        return {"score": round(peso_preciso, 2), "peso_precision_pct": round(peso_preciso, 2)}

    def perfil_completo(self, df):
        dimensiones = {
            "Completitud":  self.medir_completitud(df),
            "Unicidad":     self.medir_unicidad(df),
            "Validez":      self.medir_validez(df),
            "Consistencia": self.medir_consistencia(df),
            "Oportunidad":  self.medir_oportunidad(df),
            "Precision":    self.medir_precision(df),
        }
        scores = [d["score"] for d in dimensiones.values()]
        return {
            "dimensiones":   dimensiones,
            "score_global":  round(np.mean(scores), 2),
            "timestamp":     datetime.now().isoformat(),
            "n_registros":   len(df),
        }


perfilador = PerfiladorCalidadHCU()
perfil = perfilador.perfil_completo(df_hcu)

print(f"\n  {'Dimension':<16} {'Score':>8} {'Estado'}")
print(f"  {'-'*40}")
umbrales = {"Completitud": 99, "Unicidad": 99.5, "Validez": 98,
            "Consistencia": 97, "Oportunidad": 95, "Precision": 95}
for dim, datos in perfil["dimensiones"].items():
    score   = datos["score"]
    umbral  = umbrales.get(dim, 95)
    estado  = "OK" if score >= umbral else "FALLO"
    barra   = "#" * int(score // 5)
    print(f"  {dim:<16} {score:>8.2f}% {estado:>6}  {barra}")

print(f"\n  Score Global HCU: {perfil['score_global']:.2f}%")
print(f"  SLA minimo MSP:   97.00%")
print(f"  Estado:           {'APROBADO' if perfil['score_global'] >= 97 else 'POR DEBAJO DEL SLA'}")

# ================================================
# PLAN DE REMEDIACION
# ================================================
print("\n--- PLAN DE REMEDIACION ---")

remediaciones = []
for dim, datos in perfil["dimensiones"].items():
    if datos["score"] < umbrales.get(dim, 95):
    	gap = umbrales.get(dim, 95) - datos["score"]
    	remediaciones.append({
    	    "dimension":   dim,
    	    "score_actual": datos["score"],
    	    "umbral":       umbrales.get(dim, 95),
    	    "gap_puntos":   round(gap, 2),
    	    "prioridad":    "ALTA" if gap > 5 else "MEDIA",
    	})

remediaciones.sort(key=lambda x: x["gap_puntos"], reverse=True)
print(f"\n  Dimensiones a remediar (ordenadas por gap):")
for r in remediaciones:
    print(f"  [{r['prioridad']}] {r['dimension']:<16}: "
          f"{r['score_actual']:.1f}% → {r['umbral']}% (gap: {r['gap_puntos']:.1f} pts)")

print("\n" + "=" * 65)
print("CALIDAD ENTERPRISE — CONCEPTOS CLAVE:")
print("  6 dimensiones:  completitud, unicidad, validez, consistencia, oportunidad, precision")
print("  SLA calidad:    porcentaje minimo por dimension — negociado con el negocio")
print("  Perfilado auto: ejecutar en cada batch, no solo cuando hay queja")
print("  Remediacion:    priorizar por gap y por impacto clinico/negocio")
print("  Score global:   promedio ponderado de dimensiones — KPI del CDO")
print("  Tendencia:      comparar score semanal — detectar degradacion gradual")
print("=" * 65)
```

3. Implementa el detector de registros duplicados fuzzy: encuentra pacientes con la misma cedula O el mismo nombre+fecha_nacimiento+provincia (para casos donde la cedula esta mal ingresada).

4. Agrega el calculo del impacto economico de los problemas de calidad: cada cedula invalida = X horas de trabajo manual para corregir × costo por hora del operativo.

## Usa IA para...

> Abre Gemini y escribe:
> "Soy el Data Quality Manager del MSP Ecuador. La HCU tiene 18 millones de registros con un score de calidad del 73% — muy por debajo del 97% requerido. Los peores problemas son: 2.3M cedulas duplicadas (13%), 450K fechas de nacimiento en el futuro (2.5%), y 1.2M registros sin diagnostico principal (6.7%). Con un equipo de 15 personas y 6 meses, ¿como priorizo la remediacion? Dame: 1) metodologia para priorizar (impacto clinico vs volumen), 2) proceso de deduplicacion para las 2.3M cedulas duplicadas (probabilistic matching con Dedupe library), 3) reglas de limpieza automatizable vs las que requieren revision humana obligatoria. ¿Como llego del 73% al 97% en 6 meses?"

Despues de leer la respuesta:
- Implementa el priorizador de remediacion basado en impacto clinico y volumen.
- Agrega la estimacion del tiempo de remediacion por tipo de problema.

## Que aprendiste

- Las 6 dimensiones DAMA son independientes — un dataset puede tener 100% completitud y 60% validez.
- El SLA de calidad debe negociarse con el negocio — no es un numero tecnico arbitrario.
- El perfilado automatico detecta degradacion gradual antes de que se convierta en crisis.
- La deduplicacion fuzzy encuentra duplicados aunque la cedula este digitada diferente en cada registro.
- El impacto economico de los datos malos convierte un problema tecnico en un argumento de negocio.
- La remediacion debe priorizarse por gap × impacto critico, no solo por volumen.

## Reto extra

Construye el Sistema de Calidad de Datos Enterprise para el Registro Civil del Ecuador (DIGERCIC): 18 millones de registros de cedulas de identidad + 3 millones de pasaportes, 6 dimensiones de calidad con SLAs diferenciados por tipo de campo (cedula 99.99% unicidad, nombre 98% validez), deduplicacion probabilistica con Dedupe, dashboard ejecutivo con tendencia semanal por dimension y por provincia, alertas automaticas cuando cualquier dimension baja del SLA, y proceso de remediacion con flujo de trabajo: deteccion automatica → asignacion a operativo → corrección → validacion → cierre. El sistema debe procesar el perfil completo en menos de 30 minutos.
