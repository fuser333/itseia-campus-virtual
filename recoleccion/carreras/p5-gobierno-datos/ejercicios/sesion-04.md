# Ejercicio Sesion 4: Privacidad y LOPDP Ecuador

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Implementar los requisitos de privacidad de la Ley Organica de Proteccion de Datos Personales (LOPDP) del Ecuador: clasificacion de datos personales, derechos ARCO, evaluacion de impacto (EIPD/DPIA), anonimizacion, seudonimizacion, y el rol del Delegado de Proteccion de Datos (DPD) — aplicado a las bases de datos del IESS Ecuador.

## Contexto

La LOPDP entro en vigor en mayo 2021 en Ecuador. El IESS maneja datos sensibles de 8 millones de afiliados: historial medico, salarios, biometria, condicion familiar. Sin cumplimiento LOPDP, el IESS se expone a multas de hasta el 2% de su facturacion anual y responsabilidad penal del Director. Implementar un programa de privacidad no es opcional — es un requisito legal con plazos de cumplimiento activos.

## Instrucciones

1. Crea el archivo `sesion04_privacidad_lopdp_ecuador.py`:

```python
# Privacidad LOPDP Ecuador - ITSEIA
# Gobierno de Datos y Cumplimiento
# IESS Ecuador — programa de privacidad

import hashlib
import re
import json
import pandas as pd
import numpy as np
from datetime import datetime, date
from cryptography.fernet import Fernet
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("PRIVACIDAD Y LOPDP ECUADOR — IESS")
print("Ley Organica de Proteccion de Datos Personales")
print("=" * 65)

# ================================================
# CLASIFICACION DE DATOS LOPDP
# ================================================
print("\n--- CLASIFICACION DE DATOS PERSONALES (LOPDP Art. 4-5) ---")

clasificacion_lopdp = {
    "Dato personal ordinario": {
        "definicion": "Cualquier info que identifica a persona natural",
        "ejemplos":   ["Nombre","Apellido","Email","Telefono","Direccion"],
        "base_legal": "Consentimiento o interes legitimo",
        "retencion":  "Minimo necesario segun finalidad",
        "iess_campos": ["nombre_afiliado","email","telefono_contacto","direccion"],
    },
    "Dato personal sensible": {
        "definicion": "Categoria especial — mayor proteccion LOPDP Art. 5",
        "ejemplos":   ["Salud","Biometria","Opinion politica","Orientacion sexual",
                       "Etnia","Religion","Antecedentes penales"],
        "base_legal": "Consentimiento EXPLICITO + proporcionalidad",
        "retencion":  "Minimo necesario — eliminar cuando finalidad cumpla",
        "iess_campos": ["diagnostico","historial_medico","huella_dactilar",
                         "tipo_sangre","discapacidad"],
    },
    "Dato anonimo": {
        "definicion": "Dato que NO puede re-identificar a una persona",
        "ejemplos":   ["Estadistica agregada","Datos sinteticos","Pseudonimos sin tabla"],
        "base_legal": "No aplica LOPDP (no es dato personal)",
        "retencion":  "Sin restriccion temporal",
        "iess_campos": ["n_afiliados_por_provincia","tasa_ocupacion_hospitalaria"],
    },
    "Dato seudonimizado": {
        "definicion": "Identificadores reemplazados — re-identificable con tabla clave",
        "ejemplos":   ["Hash cedula","Token paciente","ID pseudonimo"],
        "base_legal": "Proteccion reducida — sigue siendo dato personal",
        "retencion":  "Igual que el dato original",
        "iess_campos": ["id_pseudonimo_afiliado","hash_cedula"],
    },
}

for tipo, info in clasificacion_lopdp.items():
    print(f"\n  [{tipo}]")
    print(f"    Definicion: {info['definicion']}")
    print(f"    Base legal: {info['base_legal']}")
    print(f"    IESS:       {', '.join(info['iess_campos'][:3])}")

# ================================================
# DATASET IESS CON PII
# ================================================
print("\n--- DATASET IESS (PII a proteger) ---")

N = 1_000
SECTORES = ["comercio","manufactura","servicios","construccion","agricultura"]
PROV     = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua"]
DIAGNOSTICOS_ICD = ["E11.9","I10","J06.9","Z00.0","K35.9","M54.5","F41.1"]

def generar_cedula():
    prov = np.random.randint(1, 25)
    resto = f"{np.random.randint(0, 10000000):07d}"
    return f"{prov:02d}{resto}0"

df_iess_pii = pd.DataFrame({
    "cedula":           [generar_cedula() for _ in range(N)],
    "nombre":           [f"Juan_{i}" for i in range(N)],
    "apellido":         [f"Perez_{i}" for i in range(N)],
    "fecha_nacimiento": [
        date(np.random.randint(1955, 2000), np.random.randint(1,13),
              np.random.randint(1,28)).isoformat()
        for _ in range(N)
    ],
    "telefono":         [f"09{np.random.randint(10000000,99999999):08d}" for _ in range(N)],
    "email":            [f"usuario{i}@gmail.com" for i in range(N)],
    "salario_mensual":  np.random.lognormal(6.5, 0.5, N).round(2),
    "diagnostico":      np.random.choice(DIAGNOSTICOS_ICD, N),  # dato SENSIBLE
    "huella_template":  [f"BIOM{np.random.randint(10000,99999)}" for _ in range(N)],  # SENSIBLE
    "provincia":        np.random.choice(PROV, N),
    "sector":           np.random.choice(SECTORES, N),
    "anos_aportados":   np.random.exponential(8, N).clip(0, 40).round(1),
})

print(f"  Registros con PII: {df_iess_pii.shape}")
print(f"  Campos PII identificados: cedula, nombre, apellido, telefono, email")
print(f"  Campos SENSIBLES: diagnostico, huella_template")

# ================================================
# TECNICAS DE PRIVACIDAD
# ================================================
print("\n--- TECNICAS DE PROTECCION DE PRIVACIDAD ---")

# 1. HASHING: cedula no reversible
def hash_cedula(cedula, salt="iess_salt_2024"):
    return hashlib.sha256(f"{salt}{cedula}".encode()).hexdigest()[:32]

# 2. TOKENIZACION: reemplazar con token reversible (en produccion: Vault, AWS KMS)
_token_map = {}
def tokenizar(valor):
    token = f"TOK{hashlib.md5(str(valor).encode()).hexdigest()[:12].upper()}"
    _token_map[token] = valor
    return token

def detokenizar(token):
    return _token_map.get(token)

# 3. CIFRADO SIMETRICO: para datos sensibles que deben descifrarse
clave_fernet = Fernet.generate_key()
fernet       = Fernet(clave_fernet)

def cifrar(dato):
    return fernet.encrypt(str(dato).encode()).decode()

def descifrar(dato_cifrado):
    return fernet.decrypt(dato_cifrado.encode()).decode()

# 4. ENMASCARAMIENTO: para visualizacion parcial
def enmascarar_cedula(cedula):
    return cedula[:3] + "***" + cedula[-2:]

def enmascarar_email(email):
    user, domain = email.split("@")
    return user[:2] + "***@" + domain

def enmascarar_telefono(tel):
    return tel[:4] + "****" + tel[-2:]

# 5. GENERALIZACION/PERTURBACION: para analitica
def generalizar_edad(fecha_nacimiento):
    """Convierte fecha exacta en rango de edad para k-anonimato."""
    fnac = datetime.strptime(str(fecha_nacimiento), "%Y-%m-%d").date()
    edad = (date.today() - fnac).days // 365
    if edad < 30:    return "18-29"
    elif edad < 45:  return "30-44"
    elif edad < 60:  return "45-59"
    else:            return "60+"

def generalizar_salario(salario):
    """Rango de salario para k-anonimato."""
    if salario < 600:   return "< $600"
    elif salario < 1000: return "$600-$999"
    elif salario < 2000: return "$1,000-$1,999"
    else:                return ">= $2,000"

# Aplicar tecnicas al dataset
df_protegido = df_iess_pii.copy()

# Campos no necesarios para analitica: tokenizar
df_protegido["cedula_hash"]    = df_iess_pii["cedula"].apply(hash_cedula)
df_protegido["cedula_mask"]    = df_iess_pii["cedula"].apply(enmascarar_cedula)
df_protegido["email_mask"]     = df_iess_pii["email"].apply(enmascarar_email)
df_protegido["telefono_mask"]  = df_iess_pii["telefono"].apply(enmascarar_telefono)

# Datos sensibles: cifrar
df_protegido["diagnostico_cifrado"] = df_iess_pii["diagnostico"].apply(cifrar)

# Para analitica: generalizar
df_protegido["rango_edad"]     = df_iess_pii["fecha_nacimiento"].apply(generalizar_edad)
df_protegido["rango_salario"]  = df_iess_pii["salario_mensual"].apply(generalizar_salario)

# Eliminar campos originales PII del dataframe de analitica
df_analitica = df_protegido.drop(columns=[
    "cedula","nombre","apellido","telefono","email",
    "fecha_nacimiento","salario_mensual","diagnostico","huella_template"
])

print(f"\n  Dataset original (con PII):  {df_iess_pii.shape[1]} columnas")
print(f"  Dataset analitica (sin PII): {df_analitica.shape[1]} columnas")
print(f"\n  Tecnicas aplicadas:")
print(f"  cedula → hash SHA-256 (no reversible, para joins anonimos)")
print(f"  email  → enmascaramiento (us***@gmail.com)")
print(f"  diagnostico → cifrado Fernet (solo DPO puede descifrar)")
print(f"  edad/salario → generalizacion en rangos (k-anonimato)")

# Ejemplo
print(f"\n  Muestra del dataset de analitica (fila 0):")
for col in df_analitica.columns[:6]:
    print(f"    {col}: {str(df_analitica[col].iloc[0])[:50]}")

# ================================================
# DERECHOS ARCO (LOPDP)
# ================================================
print("\n--- DERECHOS ARCO (LOPDP Art. 18-26) ---")

derechos_arco = {
    "Acceso (Art. 18)": {
        "descripcion": "Titular puede solicitar copia de sus datos en el IESS",
        "plazo":       "15 dias habiles",
        "proceso":     "Solicitud autenticada → busqueda → entrega en formato legible",
        "iess_impl":   "Portal web + App IESS → descarga PDF con todos los campos",
    },
    "Rectificacion (Art. 19)": {
        "descripcion": "Corregir datos incorrectos o desactualizados",
        "plazo":       "15 dias habiles",
        "proceso":     "Solicitud con evidencia → revision DPD → correccion con auditoria",
        "iess_impl":   "Formulario online + documento respaldo + aprobacion del Data Steward",
    },
    "Cancelacion/Supresion (Art. 22)": {
        "descripcion": "Derecho al olvido — eliminar datos cuando ya no son necesarios",
        "plazo":       "15 dias habiles (puede extenderse por obligacion legal)",
        "proceso":     "Solicitud → verificar no hay obligacion legal de retencion → eliminar",
        "iess_impl":   "Solo aplica a datos voluntarios — historial salud se retiene por ley",
    },
    "Oposicion (Art. 23)": {
        "descripcion": "Oponerse al tratamiento para finalidades especificas (marketing)",
        "plazo":       "Inmediato para marketing, 15 dias para otros usos",
        "proceso":     "Solicitud → verificar base legal → suspender tratamiento",
        "iess_impl":   "Baja automatica de listas de comunicacion del IESS",
    },
    "Portabilidad (Art. 24)": {
        "descripcion": "Recibir datos en formato portable para llevar a otro proveedor",
        "plazo":       "15 dias habiles",
        "proceso":     "Solicitud → exportar en JSON/CSV/PDF → entregar de forma segura",
        "iess_impl":   "Export de historial aportes + prestamos en formato estandar",
    },
}

for derecho, info in derechos_arco.items():
    print(f"\n  [{derecho}]")
    print(f"    Plazo: {info['plazo']}")
    print(f"    IESS:  {info['iess_impl']}")

# ================================================
# EVALUACION DE IMPACTO (DPIA)
# ================================================
print("\n--- EVALUACION DE IMPACTO EN PRIVACIDAD (DPIA) ---")

dpia_sistema_nuevo = {
    "sistema":     "App IESS Move: seguimiento GPS de afiliados para deteccion fraude",
    "descripcion": "Monitoreo ubicacion en tiempo real de afiliados que cobran pension por invalidez",
    "datos_tratados": ["GPS tiempo real","Historial ubicaciones","Patrones de movimiento"],
    "base_legal_propuesta": "Interes legitimo IESS — prevencion fraude",

    "riesgos_identificados": [
        {
            "riesgo": "Vigilancia masiva de personas con discapacidad",
            "probabilidad": "Alta",
            "impacto": "Muy Alto",
            "nivel_riesgo": "CRITICO",
            "mitigacion": "Limitar GPS a verificacion puntual (no continua), anonimizar historico",
        },
        {
            "riesgo": "Fuga de datos GPS — exposicion de patrones de vida",
            "probabilidad": "Media",
            "impacto": "Alto",
            "nivel_riesgo": "ALTO",
            "mitigacion": "Cifrado AES-256, retencion maxima 30 dias, acceso solo UATH",
        },
        {
            "riesgo": "Discriminacion por patron de movimiento",
            "probabilidad": "Media",
            "impacto": "Alto",
            "nivel_riesgo": "ALTO",
            "mitigacion": "Prohibir uso de datos GPS para decision de prestacion",
        },
    ],
    "decision": "REQUIERE REVISION LEGAL — no implementar sin dictamen AUTORIDAD",
}

print(f"\n  Sistema evaluado: {dpia_sistema_nuevo['sistema']}")
print(f"  Decision DPIA:    {dpia_sistema_nuevo['decision']}")
print(f"\n  Riesgos identificados:")
for r in dpia_sistema_nuevo["riesgos_identificados"]:
    print(f"  [{r['nivel_riesgo']}] {r['riesgo'][:60]}")
    print(f"    Mitigacion: {r['mitigacion'][:60]}")

print("\n" + "=" * 65)
print("LOPDP ECUADOR — CONCEPTOS CLAVE:")
print("  Dato sensible:  salud, biometria, etnia — consentimiento EXPLICITO")
print("  Derechos ARCO:  Acceso, Rectificacion, Cancelacion, Oposicion + Portabilidad")
print("  Plazo ARCO:     15 dias habiles — incumplimiento = infraccion")
print("  DPIA:           obligatoria para tratamientos de alto riesgo")
print("  DPD:            Delegado Proteccion Datos — obligatorio para datos masivos")
print("  Hash/Cifrado:   tecnicas distintas — hash no reversible, cifrado si")
print("=" * 65)
```

3. Implementa el Registro de Actividades de Tratamiento (RAT) del IESS: para cada proceso que trata datos personales, registra la finalidad, base legal, datos tratados, y medidas de seguridad.

4. Agrega el generador de aviso de privacidad conforme a LOPDP: dado un proceso de tratamiento, genera el texto del aviso en lenguaje simple que se debe mostrar al titular.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy el DPD (Delegado de Proteccion de Datos) del IESS Ecuador. Necesito implementar el programa de cumplimiento LOPDP para los 8 millones de afiliados. Los desafios especificos son: 1) el IESS tiene bases legacy en AS400 con datos de 1990 que nunca tuvieron consentimiento — ¿como legitimo ese tratamiento historico bajo LOPDP?, 2) cuando el IESS comparte datos con el MSP para el seguro de salud y con el SRI para verificacion de ingresos — ¿necesito consentimiento separado o el interes publico cubre esto?, 3) un afiliado solicita ejercer su derecho al olvido sobre su historial de prestamos — ¿puedo negarme y bajo que base legal? Dame las respuestas fundamentadas en los articulos especificos de la LOPDP Ecuador 2021."

Despues de leer la respuesta:
- Implementa el evaluador de base legal: dado un tratamiento de datos, determina automaticamente que base legal de la LOPDP Art. 7 aplica.
- Agrega el generador de respuesta a solicitudes ARCO con los textos legales correctos.

## Que aprendiste

- La LOPDP clasifica datos en ordinarios y sensibles — los sensibles requieren consentimiento EXPLICITO.
- Los derechos ARCO tienen plazos legales de 15 dias — incumplir es infraccion administrativa.
- La DPIA es obligatoria para sistemas que traten datos sensibles a escala o con tecnologias de vigilancia.
- Hash es irreversible (para joins anonimos); cifrado es reversible (para datos que necesitan descifrarse).
- El dato anonimo verdadero no esta sujeto a LOPDP — pero la re-identificacion es el mayor riesgo.
- El DPD debe ser independiente, no puede ser el mismo responsable del tratamiento de datos.

## Reto extra

Construye el programa de cumplimiento LOPDP completo para Banco Pichincha Ecuador: inventario de 150 tratamientos de datos clasificados por riesgo, DPIA para los 5 tratamientos de mayor riesgo (scoring crediticio, biometria, analisis comportamiento), registro automatico de solicitudes ARCO con SLA tracker (15 dias habiles), portal web para afiliados ejercer sus derechos, generador de avisos de privacidad en espanol claro, y dashboard del DPD mostrando tasa de cumplimiento por derecho, tiempo promedio de respuesta y multas potenciales por incumplimiento. El programa debe pasar la auditoria de la Autoridad de Proteccion de Datos Personal (ADPP) de Ecuador.
