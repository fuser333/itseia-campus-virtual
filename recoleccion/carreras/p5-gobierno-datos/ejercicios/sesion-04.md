# Ejercicio Sesion 4: Calidad de Datos — Completitud, Exactitud y Consistencia

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 50 min

## Objetivo

Implementar un framework de medicion de calidad de datos con cinco dimensiones (completitud, unicidad, validez, exactitud y consistencia), calcular un Data Quality Score (DQS) ponderado y generar un reporte automatizado con plan de remediacion aplicado a datos de contribuyentes del Ecuador.

## Contexto

El Servicio de Rentas Internas del Ecuador descubrio que mas del 18% de las direcciones de contribuyentes en su base eran inexactas o incompletas, generando errores en notificaciones y perdida de recaudacion estimada en millones de dolares. El Ministerio de Salud Publica tiene padrones donde el 12% de cedulas de identidad no corresponden a personas reales. Estos no son problemas de tecnologia: son problemas de gobierno de datos. Sin procesos formales de medicion, los datos se degradan al ritmo de la operacion diaria. La regla de oro es medir antes de corregir: sin linea de base cuantitativa, no puedes demostrar mejora al siguiente trimestre ni justificar inversion en remediacion.

## Instrucciones

1. Abre Google Colab y crea `sesion04_calidad_datos_sri.ipynb`.

2. Genera el dataset con problemas de calidad deliberados que representan errores tipicos en bases gubernamentales ecuatorianas:

```python
# Gobierno de Datos - Sesion 4: Calidad de Datos
# ITSEIA - Periodo 5
# Estudiante: [Tu nombre]

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import re
from datetime import datetime

np.random.seed(42)

# ============================================================
# PARTE 1: Dataset contribuyentes SRI Ecuador con errores
# ============================================================

n = 500

def generar_cedula():
    """Cedula ecuatoriana: 10 digitos, primeros 2 = codigo de provincia (01-24)."""
    provincia = np.random.randint(1, 25)
    return f"{provincia:02d}{np.random.randint(1000000, 9999999)}"

cedulas   = [generar_cedula() for _ in range(n)]
nombres   = [f"Contribuyente_{i:04d}" for i in range(n)]
emails    = [f"persona{i}@gmail.com" for i in range(n)]
telefonos = [f"09{np.random.randint(10000000, 99999999)}" for _ in range(n)]
fechas    = pd.date_range('2020-01-01', periods=n, freq='8H').tolist()
ingresos  = np.random.lognormal(7.5, 0.8, n).round(2)

# Error tipo 1: Nulos en campos criticos — PROBLEMA DE COMPLETITUD
for i in np.random.choice(n, 60, replace=False):
    emails[i] = np.nan
for i in np.random.choice(n, 40, replace=False):
    telefonos[i] = np.nan
for i in np.random.choice(n, 25, replace=False):
    ingresos[i] = np.nan

# Error tipo 2: Cedulas duplicadas — PROBLEMA DE UNICIDAD
for i in np.random.choice(range(10, n), 20, replace=False):
    cedulas[i] = cedulas[np.random.randint(0, 10)]

# Error tipo 3: Emails con formato invalido — PROBLEMA DE VALIDEZ
for i in np.random.choice(n, 30, replace=False):
    emails[i] = "emailsinArroba.com"

# Error tipo 4: Telefonos demasiado cortos — PROBLEMA DE VALIDEZ
for i in np.random.choice(n, 15, replace=False):
    telefonos[i] = "123"

# Error tipo 5: Ingresos negativos — PROBLEMA DE EXACTITUD
for i in np.random.choice(n, 20, replace=False):
    ingresos[i] = -abs(ingresos[i])

# Error tipo 6: Fechas de registro en el futuro — PROBLEMA DE EXACTITUD
for i in np.random.choice(n, 10, replace=False):
    fechas[i] = datetime(2030, 6, 1)

df = pd.DataFrame({
    'cedula':           cedulas,
    'nombre':           nombres,
    'email':            emails,
    'telefono':         telefonos,
    'fecha_registro':   pd.to_datetime(fechas),
    'ingresos_anuales': ingresos
})

print("Base de Datos Contribuyentes SRI Ecuador — dataset con errores deliberados")
print(f"Total registros : {len(df)}")
print(f"\nNulos por columna:")
print(df.isnull().sum().to_string())
print(f"\nPrimeras 5 filas:")
print(df.head(5).to_string())
```

3. Implementa el framework de medicion con las cinco dimensiones y calcula el DQS ponderado:

```python
# ============================================================
# PARTE 2: Framework DQS — 5 Dimensiones (ISO 25012 / DAMA)
# ============================================================

class MedidorCalidadDatos:
    """
    Data Quality Score basado en ISO 25012 y DAMA DMBOK.
    Pesos calibrados para el contexto tributario ecuatoriano.
    """

    def __init__(self, df):
        self.df         = df
        self.n          = len(df)
        self.resultados = {}

    def medir_completitud(self):
        """
        ¿Que porcentaje de los valores obligatorios estan presentes?
        Campos criticos SRI: cedula, nombre, email (notificaciones), ingresos.
        """
        campos  = ['cedula', 'nombre', 'email', 'ingresos_anuales']
        detalle = {c: self.df[c].notna().sum() / self.n for c in campos}
        score   = np.mean(list(detalle.values()))
        self.resultados['completitud'] = {'score': score, 'detalle': detalle}
        return score

    def medir_unicidad(self):
        """
        ¿Que porcentaje de registros tienen cedula unica (sin duplicados)?
        Un duplicado en el SRI = doble conteo de contribuyente.
        """
        n_unicos = self.df['cedula'].nunique()
        score    = n_unicos / self.n
        self.resultados['unicidad'] = {
            'score':   score,
            'detalle': {'unicos': n_unicos, 'duplicados': self.n - n_unicos}
        }
        return score

    def medir_validez(self):
        """
        ¿Los valores cumplen las reglas de formato y dominio definidas?
        Validacion superficial (longitud y patron), no semantica.
        """
        patron_email = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        emails_ok    = (self.df['email'].dropna()
                        .apply(lambda x: bool(re.match(patron_email, str(x)))).mean())

        cedulas_ok   = (self.df['cedula'].astype(str)
                        .apply(lambda x: len(x.strip()) == 10 and x.strip().isdigit()).mean())

        tels_ok      = (self.df['telefono'].dropna()
                        .apply(lambda x: len(str(x).strip()) == 10).mean())

        detalle = {'email_formato_valido':   emails_ok,
                   'cedula_10_digitos':      cedulas_ok,
                   'telefono_10_digitos':    tels_ok}
        score = np.mean(list(detalle.values()))
        self.resultados['validez'] = {'score': score, 'detalle': detalle}
        return score

    def medir_exactitud(self):
        """
        ¿Los valores estan dentro de rangos logicos de negocio?
        Exactitud = validez semantica (no solo formato).
        """
        ing  = self.df['ingresos_anuales'].dropna()
        hoy  = datetime.now()
        detalle = {
            'ingresos_positivos':       (ing > 0).mean(),
            'ingresos_rango_logico':    ((ing > 100) & (ing < 1_000_000)).mean(),
            'fecha_registro_no_futura': (pd.to_datetime(self.df['fecha_registro']) <= hoy).mean()
        }
        score = np.mean(list(detalle.values()))
        self.resultados['exactitud'] = {'score': score, 'detalle': detalle}
        return score

    def medir_consistencia(self):
        """
        ¿Los datos son coherentes logicamente entre campos relacionados?
        """
        detalle = {
            'al_menos_un_contacto':      (self.df['email'].notna() | self.df['telefono'].notna()).mean(),
            'nombre_presente_si_cedula': (
                (self.df['cedula'].notna() & self.df['nombre'].notna()) |
                self.df['cedula'].isna()
            ).mean()
        }
        score = np.mean(list(detalle.values()))
        self.resultados['consistencia'] = {'score': score, 'detalle': detalle}
        return score

    def calcular_dqs(self):
        """
        DQS ponderado. Pesos calibrados al contexto tributario:
        completitud > unicidad > validez > exactitud > consistencia.
        """
        pesos = {'completitud': 0.30, 'unicidad': 0.25,
                 'validez': 0.20, 'exactitud': 0.15, 'consistencia': 0.10}
        for dim in pesos:
            if dim not in self.resultados:
                getattr(self, f'medir_{dim}')()
        return sum(pesos[d] * self.resultados[d]['score'] for d in pesos)


# Ejecutar todas las mediciones
medidor = MedidorCalidadDatos(df)
medidor.medir_completitud()
medidor.medir_unicidad()
medidor.medir_validez()
medidor.medir_exactitud()
medidor.medir_consistencia()
dqs = medidor.calcular_dqs()

print("REPORTE DATA QUALITY SCORE — SRI Ecuador")
print("=" * 57)
for dim, data in medidor.resultados.items():
    estado = "CRITICO" if data['score'] < 0.70 else "ALERTA" if data['score'] < 0.85 else "OK"
    print(f"  {dim:<15}: {data['score']:.2%}  [{estado}]")
    for k, v in data['detalle'].items():
        print(f"    -> {k}: {v:.2%}" if isinstance(v, float) else f"    -> {k}: {v}")

nivel = ("EXCELENTE" if dqs > 0.90 else "BUENO" if dqs > 0.80
         else "ACEPTABLE" if dqs > 0.70 else "DEFICIENTE")
print(f"\n  DQS GLOBAL   : {dqs:.2%}")
print(f"  Nivel        : {nivel}")
```

4. Genera el dashboard visual y el plan de remediacion automatico:

```python
# ============================================================
# PARTE 3: Dashboard + Plan de Remediacion Priorizado
# ============================================================

fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Panel 1: Scores por dimension con semaforo cromatico
dims  = list(medidor.resultados.keys())
sc    = [medidor.resultados[d]['score'] for d in dims]
cols  = ['#F0846D' if s < 0.70 else '#FBBC0C' if s < 0.85 else '#73B8E7' for s in sc]
brs   = axes[0].barh(dims, sc, color=cols, height=0.55)
axes[0].axvline(0.85, color='#1F2F58', linestyle='--', lw=1.5, label='Umbral bueno (85%)')
axes[0].axvline(0.70, color='#F0846D', linestyle='--', lw=1.5, label='Umbral critico (70%)')
for b, s in zip(brs, sc):
    axes[0].text(s + 0.01, b.get_y() + b.get_height()/2,
                 f'{s:.1%}', va='center', fontsize=9, fontweight='bold')
axes[0].set_xlim(0, 1.15)
axes[0].set_title(f'DQS Global: {dqs:.1%} — {nivel}')
axes[0].legend(fontsize=8)
axes[0].grid(True, alpha=0.3, axis='x')

# Panel 2: Completitud por campo
det_comp = medidor.resultados['completitud']['detalle']
cols2    = ['#73B8E7' if v >= 0.90 else '#F0846D' for v in det_comp.values()]
axes[1].bar(list(det_comp.keys()), list(det_comp.values()), color=cols2, width=0.5)
for i, (c, v) in enumerate(det_comp.items()):
    axes[1].text(i, v + 0.01, f'{v:.0%}', ha='center', fontsize=9, fontweight='bold')
axes[1].set_ylim(0, 1.15)
axes[1].set_title('Completitud por Campo Critico')
axes[1].set_ylabel('% valores presentes')
axes[1].tick_params(axis='x', rotation=15)
axes[1].grid(True, alpha=0.3, axis='y')

# Panel 3: Distribucion ingresos mostrando outliers negativos
ing = df['ingresos_anuales'].dropna()
pos = ing[ing > 0]
neg = ing[ing <= 0]
axes[2].hist(pos, bins=40, color='#73B8E7', edgecolor='white', lw=0.5,
             label=f'Validos: {len(pos)}')
axes[2].axvline(0, color='#F0846D', lw=2, linestyle='--',
                label=f'Negativos: {len(neg)} (ERROR)')
axes[2].set_xlabel('Ingresos anuales USD')
axes[2].set_ylabel('Frecuencia')
axes[2].set_title('Ingresos — Outliers detectados')
axes[2].legend(fontsize=8)
axes[2].grid(True, alpha=0.3)

plt.suptitle('Dashboard Calidad de Datos — SRI Ecuador | ITSEIA P5', color='gray')
plt.tight_layout()
plt.show()

# Plan de remediacion automatico priorizado por score
print("\nPLAN DE REMEDIACION PRIORIZADO (menor score = mayor urgencia)")
print("=" * 57)
acciones = {
    'validez':      "Agregar validacion regex de email y digito verificador en formularios web del SRI",
    'completitud':  "Campana de actualizacion de datos: SMS a contribuyentes sin email registrado",
    'exactitud':    "Restricciones en BD: CHECK (ingresos > 0), CHECK (fecha_registro <= CURRENT_DATE)",
    'unicidad':     "Job mensual de deduplicacion: cruzar cedulas y consolidar vía golden record",
    'consistencia': "Constraint: si cedula NOT NULL entonces nombre y (email OR telefono) NOT NULL",
}
alertas = sorted(
    [(d, data['score']) for d, data in medidor.resultados.items() if data['score'] < 0.85],
    key=lambda x: x[1]
)
for dim, score in alertas:
    nivel_imp = "CRITICO" if score < 0.70 else "MEDIO"
    print(f"\n[{nivel_imp}] {dim.upper():<15} Score: {score:.1%} | Gap: {(0.85-score)*100:.1f}pp")
    print(f"  Accion: {acciones.get(dim, 'Revisar con data steward')}")

print(f"\nTotal registros con riesgo estimado: ~{int((1-dqs)*len(df))}")
print(f"Esfuerzo de correccion estimado: {int((1-dqs)*len(df)*0.3)} horas-persona")
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Soy el responsable de datos del SRI Ecuador. Medi la calidad de 500 contribuyentes con este resultado: Completitud 82%, Unicidad 94%, Validez 71%, Exactitud 78%, Consistencia 88%, DQS global 83%. Los problemas son: 29% de emails invalidos y 22% de ingresos sospechosos. Necesito dos cosas especificas: (1) plan de remediacion en 3 fases con responsables y plazos para cada tipo de problema, (2) escribe la funcion Python que valide una cedula ecuatoriana usando el algoritmo oficial del digito verificador, no solo verificando que tenga 10 digitos."

Despues de leer la respuesta:
- Implementa la funcion de validacion con el algoritmo del digito verificador que Claude explique.
- Aplica la funcion a todas las cedulas del dataset y muestra cuantas pasan la validacion real vs la superficial.
- Calcula cuanto cambia el score de validez al usar el algoritmo correcto vs solo verificar longitud.

## Que aprendiste

- El **DQS ponderado** resume cinco dimensiones en un numero comparable entre periodos y equipos, permitiendo demostrar mejora cuantitativa al siguiente trimestre.
- **Completitud y unicidad** son las dimensiones mas criticas en bases tributarias: impactan directamente la capacidad de notificacion legal y la deteccion de evasion.
- La **validez** requiere reglas de dominio explicitas y documentadas: el algoritmo del digito verificador de la cedula ecuatoriana rechaza muchas mas cedulas que la validacion superficial de solo 10 digitos.
- La **exactitud** va mas alla del formato: un valor puede ser valido en estructura pero incorrecto en contenido (ingresos negativos, fechas futuras).
- Medir calidad **antes de corregir** es la regla de oro: sin linea de base cuantitativa, no puedes justificar inversion en remediacion ante el directivo.

## Reto extra

Instala `ydata-profiling` con `!pip install ydata-profiling` y genera un reporte HTML automatico: `from ydata_profiling import ProfileReport; ProfileReport(df).to_file("calidad_sri.html")`. Descarga el archivo desde Colab (panel Files > Download) y abrelo en tu navegador. Identifica 3 hallazgos que el perfil automatico detecta y que tu analisis manual no capturo. Documenta cada hallazgo en una celda markdown con: (1) que anomalia muestra, (2) que regla de negocio viola, (3) que impacto tendria en la operacion tributaria del SRI si no se corrige.
