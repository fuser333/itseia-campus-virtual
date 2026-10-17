# Ejercicio Sesion 6: LOPDP Ecuador — Compliance en Datos Personales

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 55 min

## Objetivo

Implementar los requisitos de compliance de la Ley Organica de Proteccion de Datos Personales (LOPDP) del Ecuador: clasificar datos por nivel de sensibilidad, aplicar tecnicas de proteccion (hash, cifrado, enmascaramiento, generalizacion), construir el Registro de Actividades de Tratamiento (RAT) y evaluar el impacto en privacidad (DPIA) para un proceso de alto riesgo.

## Contexto

La LOPDP entro en vigor el 26 de mayo de 2021 en Ecuador y otorgo 2 años de plazo para cumplimiento. El IESS maneja datos sensibles de 8 millones de afiliados: historial medico, salarios, biometria, condicion familiar. Sin compliance LOPDP, el IESS se expone a multas de hasta el 2% de su facturacion anual (equivalente a decenas de millones de dolares) y responsabilidad penal del Director General. La LOPDP ecuatoriana sigue el modelo GDPR europeo pero con particularidades locales que todo profesional de datos en Ecuador debe dominar. No es opcional: el plazo de cumplimiento ya vencio.

## Instrucciones

1. Abre Google Colab y crea `sesion06_lopdp_compliance.ipynb`.

2. Primero instala la dependencia necesaria para cifrado:

```python
# !pip install cryptography -q
```

3. Implementa la clasificacion de datos y las tecnicas de proteccion:

```python
# Gobierno de Datos - Sesion 6: LOPDP Compliance
# ITSEIA - Periodo 5
# Estudiante: [Tu nombre]

import hashlib
import re
import pandas as pd
import numpy as np
from datetime import datetime, date
from cryptography.fernet import Fernet
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# PARTE 1: Clasificacion de Datos Personales segun LOPDP
# ============================================================

print("CLASIFICACION DE DATOS PERSONALES — LOPDP Ecuador 2021")
print("=" * 65)

clasificacion = {
    "Dato personal ordinario (Art. 4)": {
        "definicion":  "Cualquier informacion que identifica o hace identificable a una persona natural",
        "ejemplos":    ["Nombre", "Apellido", "Email", "Telefono", "Direccion", "IP"],
        "base_legal":  "Consentimiento libre e informado o interes legitimo",
        "retencion":   "Minimo necesario segun la finalidad declarada",
        "iess_campos": ["nombre_afiliado", "email", "telefono_contacto", "direccion_domicilio"],
        "multa_riesgo": "Hasta 1% facturacion anual",
    },
    "Dato personal sensible (Art. 5)": {
        "definicion":  "Categoria especial que requiere mayor proteccion",
        "ejemplos":    ["Estado de salud", "Biometria", "Opinion politica",
                        "Orientacion sexual", "Etnia", "Religion", "Antecedentes penales"],
        "base_legal":  "Consentimiento EXPLICITO, por escrito, especifico y documentado",
        "retencion":   "Minimo necesario — eliminar cuando finalidad se cumpla",
        "iess_campos": ["diagnostico_medico", "historial_clinico", "huella_dactilar",
                        "tipo_sangre", "porcentaje_discapacidad"],
        "multa_riesgo": "Hasta 2% facturacion anual + posible responsabilidad penal",
    },
    "Dato anonimizado (Art. 4, par. 6)": {
        "definicion":  "Dato que NO puede re-identificar a persona natural de ninguna forma",
        "ejemplos":    ["Estadistica agregada por provincia", "Datos sinteticos"],
        "base_legal":  "No aplica LOPDP — no es dato personal si es verdaderamente anonimo",
        "retencion":   "Sin restriccion temporal",
        "iess_campos": ["n_afiliados_por_provincia", "tasa_ocupacion_hospitalaria"],
        "multa_riesgo": "Sin riesgo (si la anonimizacion es correcta)",
    },
    "Dato seudonimizado (Art. 4, par. 7)": {
        "definicion":  "Identificadores reemplazados — re-identificable con tabla de clave",
        "ejemplos":    ["Hash de cedula", "Token de paciente", "ID pseudonimo"],
        "base_legal":  "Reduccion de riesgo pero SIGUE siendo dato personal",
        "retencion":   "Igual que el dato original correspondiente",
        "iess_campos": ["hash_cedula_afiliado", "token_paciente_HCU"],
        "multa_riesgo": "Reducido pero no eliminado",
    },
}

for tipo, info in clasificacion.items():
    print(f"\n  [{tipo}]")
    print(f"    Definicion : {info['definicion'][:70]}")
    print(f"    Base legal : {info['base_legal'][:70]}")
    print(f"    Multa      : {info['multa_riesgo']}")
    print(f"    IESS uses  : {', '.join(info['iess_campos'][:3])}")
```

4. Implementa y aplica las cuatro tecnicas de proteccion de privacidad:

```python
# ============================================================
# PARTE 2: Tecnicas de Proteccion — Aplicadas al IESS
# ============================================================

# Generar dataset IESS con PII
N = 500
DIAGNOSTICOS = ["E11.9", "I10", "J06.9", "Z00.0", "K35.9", "M54.5", "F41.1"]
PROVINCIAS    = ["Pichincha", "Guayas", "Azuay", "Manabi", "Tungurahua"]

df_pii = pd.DataFrame({
    "cedula":          [f"17{i:08d}" for i in range(N)],
    "nombre":          [f"Afiliado_{i:04d}" for i in range(N)],
    "email":           [f"afil{i}@gmail.com" for i in range(N)],
    "telefono":        [f"09{np.random.randint(10000000, 99999999)}" for _ in range(N)],
    "fecha_nacimiento":[date(np.random.randint(1960, 2000),
                             np.random.randint(1, 13),
                             np.random.randint(1, 28)).isoformat() for _ in range(N)],
    "salario_mensual": np.random.lognormal(6.5, 0.5, N).round(2),
    "diagnostico":     np.random.choice(DIAGNOSTICOS, N),   # DATO SENSIBLE
    "huella_template": [f"BIOM{np.random.randint(10000, 99999)}" for _ in range(N)],  # SENSIBLE
    "provincia":       np.random.choice(PROVINCIAS, N),
    "años_aportados":  np.random.exponential(8, N).clip(0, 40).round(1),
})

print(f"Dataset IESS generado: {df_pii.shape[0]} registros, {df_pii.shape[1]} columnas")
print(f"Campos PII       : cedula, nombre, email, telefono, fecha_nacimiento, salario")
print(f"Campos SENSIBLES : diagnostico, huella_template")

# --- TECNICA 1: Hashing irreversible (para joins anonimos) ---
def hash_campo(valor, salt="iess_salt_2025"):
    """SHA-256 con salt. NO reversible. Permite joins sin exponer el dato."""
    return hashlib.sha256(f"{salt}{valor}".encode()).hexdigest()[:32]

# --- TECNICA 2: Cifrado simetrico (para datos que deben descifrarse) ---
clave_fernet = Fernet.generate_key()
fernet       = Fernet(clave_fernet)

def cifrar(dato):
    return fernet.encrypt(str(dato).encode()).decode()

def descifrar(dato_cifrado):
    return fernet.decrypt(dato_cifrado.encode()).decode()

# --- TECNICA 3: Enmascaramiento (para visualizacion parcial) ---
def enmascarar_cedula(cedula):
    return str(cedula)[:3] + "****" + str(cedula)[-2:]

def enmascarar_email(email):
    if "@" not in str(email):
        return "***@***.com"
    user, domain = str(email).split("@", 1)
    return user[:2] + "***@" + domain

# --- TECNICA 4: Generalizacion / k-anonimato ---
def generalizar_edad(fecha_nacimiento):
    fnac = datetime.strptime(str(fecha_nacimiento), "%Y-%m-%d").date()
    edad = (date.today() - fnac).days // 365
    if edad < 30:    return "18-29"
    elif edad < 45:  return "30-44"
    elif edad < 60:  return "45-59"
    else:            return "60+"

def generalizar_salario(salario):
    if salario < 600:    return "< $600"
    elif salario < 1000: return "$600-$999"
    elif salario < 2000: return "$1,000-$1,999"
    else:                return ">= $2,000"

# Aplicar tecnicas al dataset
df_protegido = df_pii.copy()
df_protegido["cedula_hash"]        = df_pii["cedula"].apply(hash_campo)
df_protegido["cedula_mask"]        = df_pii["cedula"].apply(enmascarar_cedula)
df_protegido["email_mask"]         = df_pii["email"].apply(enmascarar_email)
df_protegido["diagnostico_cifrado"]= df_pii["diagnostico"].apply(cifrar)
df_protegido["rango_edad"]         = df_pii["fecha_nacimiento"].apply(generalizar_edad)
df_protegido["rango_salario"]      = df_pii["salario_mensual"].apply(generalizar_salario)

# Dataset de analitica: sin PII ni datos sensibles en claro
df_analitica = df_protegido[[
    "cedula_hash", "cedula_mask", "email_mask",
    "diagnostico_cifrado", "rango_edad", "rango_salario",
    "provincia", "años_aportados"
]]

print(f"\nDataset original (con PII)   : {df_pii.shape[1]} columnas")
print(f"Dataset de analitica (sin PII): {df_analitica.shape[1]} columnas")
print(f"\nEjemplo fila 0 — transformaciones aplicadas:")
print(f"  cedula_hash        : {df_protegido['cedula_hash'].iloc[0]}")
print(f"  cedula_mask        : {df_protegido['cedula_mask'].iloc[0]}")
print(f"  email_mask         : {df_protegido['email_mask'].iloc[0]}")
print(f"  diagnostico cifrado: {df_protegido['diagnostico_cifrado'].iloc[0][:30]}...")
print(f"  rango_edad         : {df_protegido['rango_edad'].iloc[0]}")
print(f"  rango_salario      : {df_protegido['rango_salario'].iloc[0]}")

# Verificar que descifrado funciona
diag_cifrado   = df_protegido['diagnostico_cifrado'].iloc[0]
diag_descifrado = descifrar(diag_cifrado)
diag_original  = df_pii['diagnostico'].iloc[0]
print(f"\nVerificacion cifrado:")
print(f"  Original: {diag_original} | Descifrado: {diag_descifrado} | OK: {diag_original == diag_descifrado}")
```

5. Construye el Registro de Actividades de Tratamiento (RAT) y una DPIA:

```python
# ============================================================
# PARTE 3: RAT y DPIA (obligatorios bajo LOPDP)
# ============================================================

# Registro de Actividades de Tratamiento (RAT)
# LOPDP Art. 37 — obligatorio para responsables que traten datos a escala
rat_iess = [
    {
        "proceso":          "Gestion de afiliaciones y aportes",
        "finalidad":        "Administrar relacion laboral y calculo de prestaciones",
        "datos_tratados":   ["nombre", "cedula", "salario", "historial_aportes"],
        "base_legal":       "Obligacion legal (LOPDP Art. 7.e) — mandato IESS",
        "datos_sensibles":  False,
        "destinatarios":    ["SRI", "Ministerio del Trabajo"],
        "retencion":        "70 años (vida laboral + jubilacion)",
        "medidas_seguridad": "AES-256, acceso rol-based, auditoria completa",
        "transferencias_internacionales": "No",
    },
    {
        "proceso":          "Historia Clinica Unica (HCU) digital",
        "finalidad":        "Prestacion de servicios de salud al afiliado",
        "datos_tratados":   ["cedula", "diagnostico", "medicacion", "resultados_lab", "imagenes"],
        "base_legal":       "Consentimiento explicito + obligacion legal salud (Art. 7.f)",
        "datos_sensibles":  True,  # Datos de salud = SENSIBLES
        "destinatarios":    ["MSP", "prestadores privados autorizados"],
        "retencion":        "25 años minimo (normativa MSP)",
        "medidas_seguridad": "AES-256, cifrado en transito TLS 1.3, acceso medico tratante",
        "transferencias_internacionales": "No (salvo emergencias con consentimiento)",
    },
    {
        "proceso":          "Sistema biometrico control de acceso",
        "finalidad":        "Verificar identidad de afiliados en ventanillas",
        "datos_tratados":   ["huella_dactilar", "reconocimiento_facial"],
        "base_legal":       "Consentimiento EXPLICITO por escrito (dato biometrico = sensible)",
        "datos_sensibles":  True,
        "destinatarios":    ["Sistema interno IESS solamente"],
        "retencion":        "Solo durante vigencia de afiliacion + 5 años",
        "medidas_seguridad": "Templates cifrados, no imagen cruda, HSM para claves",
        "transferencias_internacionales": "Prohibido",
    },
]

print("REGISTRO DE ACTIVIDADES DE TRATAMIENTO (RAT) — IESS Ecuador")
print("Exigido por LOPDP Art. 37 para responsables de tratamiento masivo")
print("=" * 65)
for actividad in rat_iess:
    print(f"\n  Proceso   : {actividad['proceso']}")
    print(f"  Base legal: {actividad['base_legal'][:60]}")
    print(f"  Sensible  : {'SI — requiere DPIA' if actividad['datos_sensibles'] else 'No'}")
    print(f"  Retencion : {actividad['retencion']}")

# DPIA (Evaluacion de Impacto en Privacidad)
# Obligatoria cuando el tratamiento implica datos sensibles a escala (Art. 38 LOPDP)
print("\n\nEVALUACION DE IMPACTO EN PRIVACIDAD (DPIA)")
print("Proceso evaluado: Sistema biometrico control de acceso IESS")
print("=" * 65)

riesgos_dpia = [
    {
        "riesgo":        "Fuga de base de datos de huellas dactilares",
        "probabilidad":  "Media",
        "impacto":       "Muy Alto",
        "nivel":         "CRITICO",
        "mitigacion":    "Almacenar solo templates matematicos, nunca imagen cruda; HSM",
    },
    {
        "riesgo":        "Uso de datos biometricos para finalidad distinta (mision creep)",
        "probabilidad":  "Baja",
        "impacto":       "Alto",
        "nivel":         "ALTO",
        "mitigacion":    "Contrato tecnico limitando uso a verificacion identidad en ventanilla",
    },
    {
        "riesgo":        "Afiliado no puede acceder al servicio si sistema falla",
        "probabilidad":  "Alta",
        "impacto":       "Medio",
        "nivel":         "MEDIO",
        "mitigacion":    "Proceso alternativo manual con cedula fisica como backup",
    },
]

for r in riesgos_dpia:
    print(f"\n  [{r['nivel']}] {r['riesgo']}")
    print(f"    Probabilidad: {r['probabilidad']} | Impacto: {r['impacto']}")
    print(f"    Mitigacion  : {r['mitigacion'][:70]}")

# Derechos ARCO con plazos legales
print("\n\nDERECHOS ARCO — LOPDP Art. 18-26 (plazos obligatorios)")
print("=" * 65)
derechos = [
    ("Acceso",        "Art. 18", "15 dias habiles", "Entregar copia de todos los datos del titular"),
    ("Rectificacion", "Art. 19", "15 dias habiles", "Corregir datos incorrectos con evidencia"),
    ("Cancelacion",   "Art. 22", "15 dias habiles", "Derecho al olvido — excepto obligacion legal"),
    ("Oposicion",     "Art. 23", "Inmediato (marketing)", "Suspender tratamiento para finalidad especifica"),
    ("Portabilidad",  "Art. 24", "15 dias habiles", "Exportar datos en formato estandar (JSON/CSV)"),
]
for nombre, articulo, plazo, descripcion in derechos:
    print(f"  {nombre:<14} ({articulo}): {plazo:<25} | {descripcion[:50]}")
```

6. Genera el dashboard de compliance:

```python
# ============================================================
# PARTE 4: Dashboard de Compliance LOPDP
# ============================================================

fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Panel 1: Estado de compliance por area
areas = ['Consentimientos', 'Registro RAT', 'DPIA realizadas',
         'Derechos ARCO', 'DPD nombrado', 'Seguridad datos']
compliance_scores = [0.72, 0.90, 0.55, 0.80, 1.00, 0.85]
cols = ['#F0846D' if s < 0.70 else '#FBBC0C' if s < 0.85 else '#73B8E7' for s in compliance_scores]
bars = axes[0].barh(areas, compliance_scores, color=cols, height=0.5)
axes[0].axvline(0.85, color='#1F2F58', linestyle='--', lw=1.5, label='Meta 85%')
for b, s in zip(bars, compliance_scores):
    axes[0].text(s + 0.01, b.get_y() + b.get_height()/2,
                 f'{s:.0%}', va='center', fontsize=9, fontweight='bold')
axes[0].set_xlim(0, 1.15)
axes[0].set_title('Estado Compliance LOPDP — IESS')
axes[0].legend(fontsize=8)
axes[0].grid(True, alpha=0.3, axis='x')

# Panel 2: Clasificacion del dataset por tipo de dato
tipos_datos = ['Datos personales\nordinarios', 'Datos\nsensibles',
               'Datos\nanonimizados', 'Datos\nseudonimizados']
conteos = [6, 2, 2, 2]  # columnas por tipo en el dataset
axes[1].bar(tipos_datos, conteos, color=['#73B8E7', '#F0846D', '#1F2F58', '#FBBC0C'])
axes[1].set_ylabel('Numero de campos')
axes[1].set_title('Clasificacion de Campos por Tipo LOPDP')
axes[1].grid(True, alpha=0.3, axis='y')
for i, v in enumerate(conteos):
    axes[1].text(i, v + 0.05, str(v), ha='center', fontsize=11, fontweight='bold')

# Panel 3: Distribucion de rango de edad (k-anonimato)
rango_counts = df_protegido['rango_edad'].value_counts()
axes[2].pie(rango_counts.values, labels=rango_counts.index, autopct='%1.0f%%',
            colors=['#1F2F58', '#FBBC0C', '#73B8E7', '#F0846D'])
axes[2].set_title('Distribucion por Rango de Edad\n(Dato generalizado — k-anonimato)')

plt.suptitle('Dashboard Compliance LOPDP — IESS Ecuador | ITSEIA P5', color='gray')
plt.tight_layout()
plt.show()

# Resumen de riesgo
score_compliance = np.mean(compliance_scores)
print(f"\nSCORE COMPLIANCE LOPDP: {score_compliance:.1%}")
nivel_comp = "ALTO RIESGO" if score_compliance < 0.70 else "RIESGO MEDIO" if score_compliance < 0.85 else "COMPLIANT"
print(f"Nivel de riesgo         : {nivel_comp}")
print(f"\nMulta potencial maxima  : 2% facturacion anual")
print(f"Acciones inmediatas     : completar DPIA para biometricos, actualizar consentimientos")
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Soy el Delegado de Proteccion de Datos (DPD) del IESS Ecuador. Tenemos tres situaciones concretas: (1) el IESS quiere compartir datos anonimizados de diagnosticos con la PAHO para estadisticas regionales — ¿es suficiente la anonimizacion que hacemos (eliminar nombre y cedula) para que deje de ser dato personal bajo LOPDP? ¿Como evaluamos el riesgo de re-identificacion?, (2) un afiliado ejercio derecho de cancelacion sobre su historial medico del 2015 — ¿puedo negarme basandome en la normativa de salud que exige retener 25 años? Cita el articulo especifico de LOPDP y el reglamento de salud, (3) tenemos datos biometricos de 3 millones de afiliados desde 2018 sin consentimiento explicito — ¿como legalizamos este tratamiento historico?"

Despues de leer la respuesta:
- Agrega una celda markdown con el dictamen juridico sintetizado para cada uno de los 3 casos.
- Implementa la funcion `evaluar_base_legal(tipo_tratamiento, tipo_dato, finalidad)` que devuelva la base legal LOPDP aplicable.

## Que aprendiste

- La **LOPDP ecuatoriana** distingue datos personales ordinarios y sensibles — los sensibles requieren consentimiento EXPLICITO por escrito.
- **Hash es irreversible** (para joins anonimos); **cifrado es reversible** (para datos que el DPD necesita descifrar); enmascaramiento es para visualizacion.
- El **RAT** (Registro de Actividades de Tratamiento) es obligatorio bajo LOPDP Art. 37 para toda entidad que trate datos a escala.
- La **DPIA** (Evaluacion de Impacto en Privacidad) es obligatoria cuando el tratamiento involucra datos sensibles, biometria o vigilancia masiva.
- Los **derechos ARCO** tienen plazos de 15 dias habiles — incumplir genera infraccion administrativa desde el primer dia de retraso.

## Reto extra

Construye el Programa de Compliance LOPDP completo para una empresa fintech ecuatoriana (como Kushki o PayPhone): inventario de 30 tratamientos clasificados por riesgo, DPIA para los 3 de mayor riesgo (scoring crediticio con IA, biometria facial, analisis de comportamiento transaccional), generador automatico de avisos de privacidad en espanol simple, y tracker de solicitudes ARCO con alertas cuando el plazo de 15 dias se este venciendo. El programa debe incluir el calculo de multas potenciales en dolares basado en la facturacion declarada de la empresa.
