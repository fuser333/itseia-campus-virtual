# Ejercicio Sesion 7: Seguridad y Gobierno en Data Lakes

**Materia:** Cloud Computing y Data Lakes
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Implementar seguridad y gobierno de datos en cloud: enmascaramiento de datos sensibles (PII), control de acceso basado en roles (RBAC), auditoria de accesos, cifrado en reposo y en transito, y cumplimiento de la Ley Organica de Proteccion de Datos Personales (LOPDP) de Ecuador.

## Contexto

Ecuador aprobo la LOPDP en mayo 2021 — equivalente al GDPR europeo. Las empresas deben proteger datos personales bajo multas de hasta el 2% de la facturacion anual. El IESS, el MSP y los bancos ecuatorianos deben enmascarar cedulas, nombres y datos medicos antes de usarlos en analisis. La seguridad en el data lake no es opcional — es obligacion legal.

## Instrucciones

1. Crea el archivo `sesion07_seguridad_gobierno_ecuador.py`:

```python
# Seguridad y Gobierno - ITSEIA
# Cloud Computing y Data Lakes
# LOPDP Ecuador: PII, RBAC, auditoria, cifrado

import pandas as pd
import numpy as np
import hashlib
import hmac
import json
import re
import os
import base64
from datetime import datetime
from cryptography.fernet import Fernet
import warnings
warnings.filterwarnings("ignore")

# Instala: pip install cryptography

np.random.seed(2026)
print("=" * 65)
print("SEGURIDAD Y GOBIERNO — LOPDP ECUADOR")
print("=" * 65)

# ================================================
# LOPDP ECUADOR: CATEGORIAS DE DATOS
# ================================================
print("\n--- LOPDP ECUADOR: CLASIFICACION DE DATOS ---")

clasificacion_lopdp = {
    "Datos identificativos": {
        "datos": ["nombre","cedula","ruc","pasaporte","direccion"],
        "nivel": "SENSIBLE",
        "tratamiento": "Enmascarar, cifrar, minimo acceso necesario"
    },
    "Datos de contacto": {
        "datos": ["telefono","email","ciudad"],
        "nivel": "PRIVADO",
        "tratamiento": "Anonimizar para analisis estadistico"
    },
    "Datos financieros": {
        "datos": ["saldo_cuenta","deudas","historial_credito","ingresos"],
        "nivel": "CONFIDENCIAL",
        "tratamiento": "Cifrar en reposo, TLS en transito, logs de acceso"
    },
    "Datos de salud": {
        "datos": ["diagnostico","medicamentos","historial_clinico"],
        "nivel": "ESPECIALMENTE PROTEGIDO",
        "tratamiento": "Consentimiento expreso, cifrado E2E, auditoria total"
    },
    "Datos demograficos": {
        "datos": ["edad","sexo","provincia"],
        "nivel": "PUBLICO",
        "tratamiento": "Pueden usarse para estadisticas sin restriccion"
    },
}

for categoria, info in clasificacion_lopdp.items():
    print(f"\n  [{info['nivel']}] {categoria}")
    print(f"    Datos:    {', '.join(info['datos'])}")
    print(f"    Accion:   {info['tratamiento']}")

# ================================================
# DATASET: PACIENTES MSP (con datos PII)
# ================================================
print("\n--- DATASET ORIGINAL (con PII) ---")

n = 100
nombres = ["Maria","Carlos","Ana","Jose","Luis","Carmen","Pedro","Sofia",
           "Diego","Andrea","Juan","Patricia","Roberto","Elena","Miguel"]
apellidos = ["Garcia","Torres","Morales","Rodriguez","Sanchez","Lopez",
             "Perez","Martinez","Gomez","Vargas","Castro","Ortiz"]

df_original = pd.DataFrame({
    "cedula":      [f"17{np.random.randint(10000000,99999999):08d}" for _ in range(n)],
    "nombre":      [f"{np.random.choice(nombres)} {np.random.choice(apellidos)}" for _ in range(n)],
    "fecha_nac":   pd.date_range("1960-01-01", periods=n, freq="120D").strftime("%Y-%m-%d"),
    "telefono":    [f"09{np.random.randint(10000000,99999999):08d}" for _ in range(n)],
    "email":       [f"paciente{i}@gmail.com" for i in range(1, n+1)],
    "diagnostico": np.random.choice(["Diabetes","Hipertension","Asma","Sin diagnostico",
                                      "Covid-19","Gripe","Fractura"], n),
    "ingreso_mensual": np.random.lognormal(6.3, 0.5, n).round(0),
    "provincia":   np.random.choice(["Pichincha","Guayas","Azuay"], n, p=[0.4,0.4,0.2]),
    "edad":        np.random.randint(18, 80, n),
})

print(f"  Dataset original: {df_original.shape}")
print(df_original[["cedula","nombre","telefono","diagnostico","ingreso_mensual"]].head(5).to_string(index=False))

# ================================================
# TECNICAS DE PROTECCION PII
# ================================================
print("\n--- TECNICAS DE PROTECCION DE DATOS ---")

# 1. HASHING (irreversible — para identificacion sin revelar el dato)
SALT = b"itseia_ecuador_lopdp_2024"

def hash_cedula(cedula):
    """Hash HMAC-SHA256 con salt — no reversible, consistente por cedula."""
    return hmac.new(SALT, cedula.encode(), hashlib.sha256).hexdigest()[:16]

df_original["cedula_hash"] = df_original["cedula"].apply(hash_cedula)
print("\n  1. HASHING (HMAC-SHA256 + salt):")
for orig, hashed in zip(df_original["cedula"][:3], df_original["cedula_hash"][:3]):
    print(f"     {orig} → {hashed}")
print("     Mismo input → mismo hash (consistente) | No reversible")

# 2. TOKENIZACION (reversible con vault seguro)
TOKEN_VAULT = {}  # En prod: HashiCorp Vault / AWS Secrets Manager

def tokenizar(valor, vault):
    """Tokenizacion: reemplaza PII por token opaco, guarda mapeo en vault."""
    token = f"TKN-{hashlib.md5(valor.encode()).hexdigest()[:8].upper()}"
    vault[token] = valor  # En prod: guardar en vault cifrado
    return token

def detokenizar(token, vault):
    """Recupera el valor original desde el vault (solo con permisos)."""
    return vault.get(token, "ACCESO DENEGADO")

df_original["nombre_token"] = df_original["nombre"].apply(
    lambda v: tokenizar(v, TOKEN_VAULT)
)
print("\n  2. TOKENIZACION (reversible con vault):")
for orig, token in zip(df_original["nombre"][:3], df_original["nombre_token"][:3]):
    recuperado = detokenizar(token, TOKEN_VAULT)
    print(f"     '{orig}' → '{token}' → '{recuperado}' (solo con acceso al vault)")

# 3. ENMASCARAMIENTO (para visualizacion)
def enmascarar_cedula(cedula):
    return f"{cedula[:3]}*****{cedula[-2:]}"

def enmascarar_telefono(tel):
    return f"{tel[:4]}****{tel[-2:]}"

def enmascarar_email(email):
    user, domain = email.split("@")
    return f"{user[:2]}***@{domain}"

df_original["cedula_mask"]   = df_original["cedula"].apply(enmascarar_cedula)
df_original["telefono_mask"] = df_original["telefono"].apply(enmascarar_telefono)
df_original["email_mask"]    = df_original["email"].apply(enmascarar_email)

print("\n  3. ENMASCARAMIENTO (para UIs y reportes):")
print(f"     {'Cedula':<16} {'Enmascarada':<16} {'Telefono':<12} {'Enmascarado'}")
for _, r in df_original.head(4).iterrows():
    print(f"     {r['cedula']:<16} {r['cedula_mask']:<16} {r['telefono']:<12} {r['telefono_mask']}")

# 4. GENERALIZACION (k-anonimidad)
def generalizar_edad(edad):
    """Agrupa edad en rangos de 10 años."""
    return f"{(edad//10)*10}-{(edad//10)*10+9}"

def generalizar_ingreso(ingreso):
    """Agrupa ingreso en quintiles aproximados."""
    if ingreso < 500:   return "Q1 (<500)"
    elif ingreso < 900: return "Q2 (500-900)"
    elif ingreso < 1500: return "Q3 (900-1500)"
    elif ingreso < 3000: return "Q4 (1500-3000)"
    else:               return "Q5 (>3000)"

df_original["edad_rango"]      = df_original["edad"].apply(generalizar_edad)
df_original["ingreso_quintil"] = df_original["ingreso_mensual"].apply(generalizar_ingreso)

print("\n  4. GENERALIZACION (k-anonimidad):")
print(df_original[["edad","edad_rango","ingreso_mensual","ingreso_quintil"]].head(6).to_string(index=False))

# ================================================
# CIFRADO EN REPOSO CON FERNET
# ================================================
print("\n--- CIFRADO EN REPOSO (Fernet AES-128) ---")

key = Fernet.generate_key()
fernet = Fernet(key)

def cifrar_campo(valor):
    return fernet.encrypt(str(valor).encode()).decode()

def descifrar_campo(valor_cifrado, fernet_instance):
    return fernet_instance.decrypt(valor_cifrado.encode()).decode()

df_original["diagnostico_cifrado"] = df_original["diagnostico"].apply(cifrar_campo)
print("  Diagnosticos cifrados (AES-128):")
for orig, cifrado in zip(df_original["diagnostico"][:3],
                          df_original["diagnostico_cifrado"][:3]):
    descifrado = descifrar_campo(cifrado, fernet)
    print(f"  '{orig}' → '{cifrado[:40]}...' → '{descifrado}'")

# ================================================
# RBAC: CONTROL DE ACCESO BASADO EN ROLES
# ================================================
print("\n--- RBAC: CONTROL DE ACCESO ---")

ROLES_PERMISOS = {
    "analista":         ["edad_rango","ingreso_quintil","diagnostico","provincia"],
    "medico":           ["cedula_mask","nombre_token","diagnostico","edad","telefono_mask"],
    "administrador":    ["cedula","nombre","telefono","email","diagnostico","ingreso_mensual"],
    "auditor":          ["cedula_hash","nombre_token","diagnostico_cifrado","provincia"],
    "cientifico_datos": ["edad_rango","ingreso_quintil","diagnostico","provincia","edad"],
}

def get_vista_por_rol(df, rol):
    """Retorna solo las columnas permitidas para el rol."""
    cols_permitidas = ROLES_PERMISOS.get(rol, [])
    cols_disponibles = [c for c in cols_permitidas if c in df.columns]
    if not cols_disponibles:
        print(f"  ROL '{rol}': SIN ACCESO — columnas no disponibles")
        return pd.DataFrame()
    return df[cols_disponibles].copy()

print("\n  Columnas accesibles por rol:")
for rol, permisos in ROLES_PERMISOS.items():
    disponibles = [c for c in permisos if c in df_original.columns]
    print(f"  {rol:<20}: {disponibles}")

print("\n  Vista para 'analista' (no puede ver datos directos de pacientes):")
vista_analista = get_vista_por_rol(df_original, "analista")
print(vista_analista.head(5).to_string(index=False))

# ================================================
# LOG DE AUDITORIA
# ================================================
print("\n--- LOG DE AUDITORIA (LOPDP Art. 37) ---")

audit_log = []

def registrar_acceso(usuario, rol, operacion, tabla, num_registros, filtro=None):
    """Registra cada acceso a datos en el log de auditoria."""
    entrada = {
        "timestamp":      datetime.now().isoformat(),
        "usuario":        usuario,
        "rol":            rol,
        "operacion":      operacion,
        "tabla":          tabla,
        "num_registros":  num_registros,
        "filtro":         filtro,
        "ip_origen":      "10.0.1.55",  # En prod: request.client.host
        "session_id":     f"sess_{hashlib.md5(usuario.encode()).hexdigest()[:8]}",
    }
    audit_log.append(entrada)
    return entrada

# Simular accesos de distintos usuarios
registrar_acceso("ana.torres@msp.gob.ec",   "medico",         "SELECT", "pacientes", 45, "provincia=Pichincha")
registrar_acceso("luis.vera@itseia.ai",      "cientifico_datos","SELECT", "pacientes", 100, None)
registrar_acceso("admin@msp.gob.ec",         "administrador",  "EXPORT", "pacientes", 100, None)
registrar_acceso("juan.silva@auditoria.ec",  "auditor",        "SELECT", "pacientes", 100, None)

print(f"  {len(audit_log)} accesos registrados:")
for log in audit_log:
    print(f"  [{log['timestamp'][:19]}] {log['usuario']:<30} {log['operacion']:<8} "
          f"{log['num_registros']:>5} registros | filtro: {log['filtro']}")

with open("/tmp/audit_log_msp.json", "w") as f:
    json.dump(audit_log, f, indent=2)
print("\n  Audit log guardado: /tmp/audit_log_msp.json")

# ================================================
# DATASET ANONIMIZADO FINAL
# ================================================
print("\n--- DATASET ANONIMIZADO PARA ANALISIS ---")
df_anonimizado = df_original[["edad_rango","ingreso_quintil","diagnostico",
                                "provincia","cedula_hash"]].copy()
df_anonimizado = df_anonimizado.rename(columns={"cedula_hash": "id_anonimo"})

print(f"  Dataset anonimizado: {df_anonimizado.shape}")
print(df_anonimizado.head(8).to_string(index=False))
print("\n  k-anonimidad: cada combinacion (edad_rango, provincia) tiene minimo 3 registros")
k_min = df_anonimizado.groupby(["edad_rango","provincia"]).size().min()
print(f"  Verificacion k={k_min} {'OK (LOPDP compliant)' if k_min >= 3 else 'ALERTA: k insuficiente'}")

print("\n" + "=" * 65)
print("SEGURIDAD LOPDP — TECNICAS APRENDIDAS:")
print("  Hashing:        HMAC-SHA256 — identificar sin revelar")
print("  Tokenizacion:   reemplazar PII por token opaco reversible")
print("  Enmascaramiento: 170****01 — mostrar sin exponer completo")
print("  Generalizacion: k-anonimidad — grupos en lugar de valores exactos")
print("  Fernet:         cifrado AES-128 en reposo — datos medicos")
print("  RBAC:           cada rol accede solo a las columnas necesarias")
print("  Audit log:      registro inmutable de cada acceso — LOPDP Art. 37")
print("=" * 65)
```

3. Implementa la "pseudoanonimizacion" completa del dataset: reemplaza cedula → hash, nombre → token, diagnostico → cifrado, y verifica que el dataset resultante no puede re-identificar a ninguna persona sin acceso al vault y la clave de cifrado.

4. Calcula la k-anonimidad del dataset anonimizado: verifica que cada combinacion de quasi-identificadores tiene al menos k=5 registros.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy data engineer del MSP Ecuador. Necesito compartir datos de atenciones medicas con investigadores universitarios cumpliendo la LOPDP. Los datos tienen cedula, nombre, diagnostico, fecha, provincia. ¿Que nivel de anonimizacion aplico? ¿Como implemento k-anonimidad con k=5 usando la libreria Python 'anonymizer' o con pandas manual? ¿Que es l-diversidad y cuando debo usarla ademas de k-anonimidad? Dame el codigo completo."

Despues de leer la respuesta:
- Implementa k-anonimidad con k=5 para el dataset del ejercicio.
- Verifica que el dataset cumple con la l-diversidad para el atributo sensible `diagnostico`.

## Que aprendiste

- La LOPDP Ecuador (2021) obliga a proteger datos personales con multas de hasta 2% de la facturacion anual.
- El hashing HMAC con salt permite identificar registros del mismo usuario sin revelar el dato original.
- La tokenizacion reemplaza PII por tokens opacos — el mapeo real se guarda en un vault separado con acceso restringido.
- RBAC controla que columnas puede ver cada rol — el analista no necesita ver la cedula real para hacer estadisticas.
- k-anonimidad garantiza que cada individuo es indistinguible de al menos k-1 personas en el dataset.
- El log de auditoria es obligacion legal (LOPDP Art. 37): cada acceso a datos personales debe registrarse.

## Reto extra

Implementa un sistema completo de cumplimiento LOPDP para una aseguradora ecuatoriana: pipeline que procesa datos de polizas y siniestros, aplica pseudoanonimizacion automatica segun clasificacion del dato, implementa el "derecho al olvido" (eliminar todos los datos de una cedula especifica en todos los sistemas), genera el registro de actividades de tratamiento (RAT) exigido por la LOPDP, y crea un portal web donde los titulares pueden consultar que datos tiene la empresa sobre ellos.
