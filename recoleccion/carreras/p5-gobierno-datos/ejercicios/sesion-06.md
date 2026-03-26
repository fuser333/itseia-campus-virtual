# Ejercicio Sesion 6: Master Data Management (MDM)

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Implementar un sistema de Master Data Management (MDM) para el Registro Civil del Ecuador: crear el golden record del ciudadano ecuatoriano unificando fuentes heterogeneas (Registro Civil, IESS, SRI, MSP, BCE), implementar el algoritmo de match y merge con reglas de confianza por fuente, gestionar el ciclo de vida del dato maestro, y medir la calidad del MDM — cumpliendo con la LOPDP y la normativa del MINTEL.

## Contexto

El Estado ecuatoriano tiene 18 millones de ciudadanos registrados en 47 sistemas distintos: Registro Civil, IESS, SRI, MSP, BCE, SENESCYT, Ministerios, GADs, etc. Cada sistema tiene "su version" del ciudadano. El resultado: un ciudadano puede tener 3 nombres distintos en 3 sistemas (Jose Manuel vs Jose M. vs J. Manuel), 2 fechas de nacimiento diferentes (error de digitacion), y 4 direcciones distintas (cambios de residencia sin actualizar). El MDM del Estado ecuatoriano busca crear UN registro de verdad por ciudadano — el golden record — que todos los sistemas consulten.

## Instrucciones

1. Crea el archivo `sesion06_mdm_registro_civil_ecuador.py`:

```python
# Master Data Management - ITSEIA
# Gobierno de Datos y Cumplimiento
# Registro Civil Ecuador — golden record ciudadano

import re
import uuid
import hashlib
import numpy as np
import pandas as pd
from datetime import datetime, date
from collections import defaultdict
from difflib import SequenceMatcher
import warnings
warnings.filterwarnings("ignore")

print("=" * 65)
print("MASTER DATA MANAGEMENT — REGISTRO CIVIL ECUADOR")
print("18M ciudadanos | 47 sistemas | 1 golden record")
print("=" * 65)

# ================================================
# FUENTES DE DATOS Y NIVELES DE CONFIANZA
# ================================================
print("\n--- FUENTES DE DATOS Y CONFIANZA ---")

FUENTES = {
    "registro_civil": {
        "descripcion":  "Registro Civil e Identificacion del Ecuador",
        "confianza":    1.00,  # fuente autoritativa maxima
        "campos_auth":  ["cedula", "nombres", "apellidos", "fecha_nacimiento",
                         "lugar_nacimiento", "estado_civil"],
        "frecuencia":   "Tiempo real (API)",
        "cobertura":    1.00,
    },
    "iess": {
        "descripcion":  "Instituto Ecuatoriano de Seguridad Social",
        "confianza":    0.90,
        "campos_auth":  ["empleador_actual", "salario_declarado", "fecha_afiliacion"],
        "frecuencia":   "Mensual (batch)",
        "cobertura":    0.65,   # 65% de ciudadanos afiliados
    },
    "sri": {
        "descripcion":  "Servicio de Rentas Internas",
        "confianza":    0.92,
        "campos_auth":  ["ruc", "actividad_economica", "regimen_tributario",
                         "email_declarado"],
        "frecuencia":   "Diario (batch nocturno)",
        "cobertura":    0.80,
    },
    "msp": {
        "descripcion":  "Ministerio de Salud Publica — Historia Clinica Unica",
        "confianza":    0.85,
        "campos_auth":  ["grupo_sanguineo", "alergias", "condiciones_cronicas"],
        "frecuencia":   "Tiempo real (API)",
        "cobertura":    0.70,
    },
    "bce_sistema_pagos": {
        "descripcion":  "Banco Central — Sistema de Pagos SPI/SCI",
        "confianza":    0.88,
        "campos_auth":  ["cuenta_bancaria_principal", "banco_principal"],
        "frecuencia":   "Diario",
        "cobertura":    0.55,
    },
    "senescyt": {
        "descripcion":  "Secretaria de Educacion Superior",
        "confianza":    0.87,
        "campos_auth":  ["nivel_educacion", "titulo_obtenido", "institucion_educativa"],
        "frecuencia":   "Mensual",
        "cobertura":    0.45,
    },
}

print(f"\n  {'Fuente':<22} {'Confianza':>10} {'Cobertura':>10} {'Frecuencia'}")
print(f"  {'-'*62}")
for fuente, info in FUENTES.items():
    print(f"  {fuente:<22} {info['confianza']:>10.0%} {info['cobertura']:>10.0%} "
          f"{info['frecuencia']}")
print(f"\n  Fuente autoritativa: Registro Civil (confianza 100%)")

# ================================================
# REGISTRO FUENTE: REPRESENTACION DE DATOS CRUDOS
# ================================================
print("\n--- REGISTROS FUENTE (DATOS CRUDOS) ---")

# Simular registros del mismo ciudadano en distintos sistemas
# Cedula: 1712345678 — Pedro Antonio Salinas Mora

registros_fuente = [
    {
        "fuente":         "registro_civil",
        "cedula":         "1712345678",
        "nombres":        "Pedro Antonio",
        "apellidos":      "Salinas Mora",
        "fecha_nac":      "1985-06-15",
        "email":          None,
        "telefono":       "0991234567",
        "direccion":      "Av. Amazonas N34-451, Quito",
        "estado_civil":   "SOLTERO",
        "ts_fuente":      "2024-01-15",
    },
    {
        "fuente":         "iess",
        "cedula":         "1712345678",
        "nombres":        "Pedro A.",           # abreviado
        "apellidos":      "Salinas Mora",
        "fecha_nac":      "1985-06-15",
        "email":          "pedro.salinas@empresa.com",
        "telefono":       "0991234567",
        "direccion":      "Amazona N34-451 Quito",  # error tipografico
        "estado_civil":   None,
        "ts_fuente":      "2024-03-01",
    },
    {
        "fuente":         "sri",
        "cedula":         "1712345678",
        "nombres":        "PEDRO ANTONIO",     # mayusculas
        "apellidos":      "SALINAS MORA",
        "fecha_nac":      "1985-06-15",
        "email":          "p.salinas.mora@gmail.com",
        "telefono":       "+593991234567",     # con prefijo
        "direccion":      "Av Amazonas N34-451, Quito",  # sin punto
        "estado_civil":   "S",                # codigo corto
        "ts_fuente":      "2024-02-28",
    },
    {
        "fuente":         "msp",
        "cedula":         "1712345678",
        "nombres":        "Pedro",             # solo primer nombre
        "apellidos":      "Salinas",           # solo primer apellido
        "fecha_nac":      "1985-06-16",        # error 1 dia
        "email":          None,
        "telefono":       "2456789",           # convencional sin prefijo
        "direccion":      "Quito",             # muy vago
        "estado_civil":   None,
        "ts_fuente":      "2023-11-20",
    },
]

print(f"\n  Registros del mismo ciudadano en 4 fuentes:")
for r in registros_fuente:
    print(f"\n  [{r['fuente'].upper()}]")
    print(f"    Nombre:    {r['nombres']} {r['apellidos']}")
    print(f"    Fecha nac: {r['fecha_nac']} | Tel: {r['telefono']}")
    print(f"    Email:     {r['email'] or 'N/A'}")
    print(f"    Direccion: {r['direccion']}")

# ================================================
# ALGORITMO MATCH Y MERGE
# ================================================
print("\n--- ALGORITMO MATCH Y MERGE ---")

class NormalizadorDatos:
    """Normaliza campos antes de comparar y construir el golden record."""

    @staticmethod
    def nombre(texto):
        if not texto:
            return ""
        return " ".join(w.capitalize() for w in texto.strip().split())

    @staticmethod
    def telefono(tel):
        if not tel:
            return None
        digitos = re.sub(r'\D', '', tel)
        if digitos.startswith("593"):
            digitos = "0" + digitos[3:]
        if len(digitos) == 9 and not digitos.startswith("0"):
            digitos = "0" + digitos
        return digitos if len(digitos) in (9, 10) else None

    @staticmethod
    def estado_civil(valor):
        if not valor:
            return None
        mapa = {
            "S": "SOLTERO", "SOLTERO": "SOLTERO",
            "C": "CASADO",  "CASADO":  "CASADO",
            "D": "DIVORCIADO", "DIVORCIADO": "DIVORCIADO",
            "V": "VIUDO",   "VIUDO":   "VIUDO",
            "U": "UNION_LIBRE",
        }
        return mapa.get(valor.upper().strip())

    @staticmethod
    def similitud_texto(a, b):
        if not a or not b:
            return 0.0
        return SequenceMatcher(None, a.lower(), b.lower()).ratio()


class GoldenRecordBuilder:
    """Construye el golden record priorizando fuentes por confianza."""

    def __init__(self, fuentes_config):
        self.fuentes_config = fuentes_config
        self.norm = NormalizadorDatos()

    def _confianza(self, fuente):
        return self.fuentes_config.get(fuente, {}).get("confianza", 0.5)

    def _elegir_valor(self, campo, registros):
        """Elige el valor mas confiable para un campo dado."""
        candidatos = []
        for r in registros:
            valor = r.get(campo)
            if valor:
                valor_norm = valor
                if campo in ("nombres", "apellidos"):
                    valor_norm = self.norm.nombre(valor)
                elif campo == "telefono":
                    valor_norm = self.norm.telefono(valor)
                elif campo == "estado_civil":
                    valor_norm = self.norm.estado_civil(valor)

                if valor_norm:
                    candidatos.append({
                        "valor":     valor_norm,
                        "fuente":    r["fuente"],
                        "confianza": self._confianza(r["fuente"]),
                        "ts":        r.get("ts_fuente", "2000-01-01"),
                    })

        if not candidatos:
            return None, None

        # Ordenar por confianza DESC, luego por timestamp DESC
        candidatos.sort(key=lambda x: (x["confianza"], x["ts"]), reverse=True)
        mejor = candidatos[0]
        return mejor["valor"], mejor["fuente"]

    def construir(self, registros):
        """Construye el golden record a partir de multiples registros fuente."""
        campos = ["cedula", "nombres", "apellidos", "fecha_nac", "email",
                  "telefono", "direccion", "estado_civil"]

        golden = {"_meta": {"fuentes_usadas": [], "fecha_creacion": datetime.now().isoformat(),
                             "version": 1}}

        for campo in campos:
            valor, fuente = self._elegir_valor(campo, registros)
            golden[campo] = valor
            if fuente:
                golden[f"_{campo}_fuente"] = fuente
                if fuente not in golden["_meta"]["fuentes_usadas"]:
                    golden["_meta"]["fuentes_usadas"].append(fuente)

        golden["_id"] = f"GR-{hashlib.md5(str(golden['cedula']).encode()).hexdigest()[:12].upper()}"
        return golden

    def calcular_score_confianza(self, golden, registros):
        """Calcula un score de confianza global del golden record (0-1)."""
        campos_core = ["nombres", "apellidos", "fecha_nac", "telefono", "email"]
        scores = []
        for campo in campos_core:
            fuente_campo = golden.get(f"_{campo}_fuente")
            if fuente_campo:
                scores.append(self._confianza(fuente_campo))
            else:
                scores.append(0.0)  # campo vacio

        consistencia_nombre = self._verificar_consistencia_nombre(registros)
        scores.append(consistencia_nombre)

        return round(sum(scores) / len(scores), 3)

    def _verificar_consistencia_nombre(self, registros):
        """Mide consistencia del nombre completo entre fuentes."""
        nombres_norm = [
            self.norm.nombre(f"{r['nombres']} {r['apellidos']}")
            for r in registros if r.get("nombres") and r.get("apellidos")
        ]
        if len(nombres_norm) < 2:
            return 1.0
        pares_sim = []
        for i in range(len(nombres_norm)):
            for j in range(i+1, len(nombres_norm)):
                sim = NormalizadorDatos.similitud_texto(nombres_norm[i], nombres_norm[j])
                pares_sim.append(sim)
        return round(sum(pares_sim) / len(pares_sim), 3)


builder = GoldenRecordBuilder(FUENTES)
golden = builder.construir(registros_fuente)
score  = builder.calcular_score_confianza(golden, registros_fuente)

print(f"\n  GOLDEN RECORD CONSTRUIDO:")
print(f"  ID:        {golden['_id']}")
print(f"  Cedula:    {golden['cedula']} (fuente: {golden.get('_cedula_fuente','N/A')})")
print(f"  Nombre:    {golden['nombres']} {golden['apellidos']}")
print(f"             (fuente nombres: {golden.get('_nombres_fuente','N/A')})")
print(f"  Fecha nac: {golden['fecha_nac']} (fuente: {golden.get('_fecha_nac_fuente','N/A')})")
print(f"  Email:     {golden['email']} (fuente: {golden.get('_email_fuente','N/A')})")
print(f"  Telefono:  {golden['telefono']} (fuente: {golden.get('_telefono_fuente','N/A')})")
print(f"  Est. Civil:{golden['estado_civil']} (fuente: {golden.get('_estado_civil_fuente','N/A')})")
print(f"  Fuentes:   {', '.join(golden['_meta']['fuentes_usadas'])}")
print(f"  Score:     {score:.3f} / 1.000")

# ================================================
# GESTION DE DUPLICADOS Y SURVIVORSHIP
# ================================================
print("\n--- DETECCION Y RESOLUCION DE DUPLICADOS ---")

np.random.seed(42)
n = 1000

def generar_padron_con_duplicados(n):
    """Genera un padron con duplicados intencionales para practica."""
    cedulas_base = [f"17{np.random.randint(10000000, 99999999):08d}" for _ in range(int(n * 0.9))]
    nombres_base = ["Juan Carlos", "Maria Elena", "Pedro Antonio", "Ana Lucia",
                    "Carlos Eduardo", "Sofia Isabel", "Luis Miguel", "Carmen Rosa"]
    apellidos_base = ["Gonzalez", "Rodriguez", "Salinas", "Torres", "Morales",
                      "Vega", "Castro", "Jimenez"]

    rows = []
    for i in range(n):
        if i < int(n * 0.9):
            cedula = cedulas_base[i]
            nombre_real = np.random.choice(nombres_base)
            apellido_real = np.random.choice(apellidos_base)
        else:
            # Duplicado: reusar cedula existente con variacion en nombre
            cedula = np.random.choice(cedulas_base[:50])
            nombre_real = np.random.choice(nombres_base)
            apellido_real = np.random.choice(apellidos_base)

        # Introducir variaciones de calidad
        if np.random.rand() < 0.1:
            nombre_final = nombre_real.split()[0]  # solo primer nombre
        elif np.random.rand() < 0.05:
            nombre_final = nombre_real.upper()
        else:
            nombre_final = nombre_real

        rows.append({
            "cedula":       cedula,
            "nombre":       nombre_final,
            "apellido":     apellido_real,
            "fecha_nac":    f"19{np.random.randint(50, 99)}-"
                            f"{np.random.randint(1,12):02d}-"
                            f"{np.random.randint(1,28):02d}",
            "fuente":       np.random.choice(list(FUENTES.keys())),
        })
    return pd.DataFrame(rows)

df = generar_padron_con_duplicados(n)

# Detectar duplicados por cedula
duplicados = df[df.duplicated(subset=["cedula"], keep=False)]
n_cedulas_dup = duplicados["cedula"].nunique()
n_registros_dup = len(duplicados)

print(f"\n  Padron simulado: {len(df):,} registros")
print(f"  Cedulas con 2+ registros: {n_cedulas_dup:,}")
print(f"  Registros duplicados:     {n_registros_dup:,} ({n_registros_dup/len(df):.1%} del padron)")

# Regla de survivorship: para cada grupo de duplicados, quedarse con el de mayor confianza
confianza_por_fuente = {f: info["confianza"] for f, info in FUENTES.items()}
df["confianza_fuente"] = df["fuente"].map(confianza_por_fuente).fillna(0.5)

# Survivorship: primer registro por cedula ordenado por confianza DESC
df_superviviente = (df.sort_values("confianza_fuente", ascending=False)
                      .drop_duplicates(subset=["cedula"], keep="first"))

print(f"\n  Despues de survivorship:")
print(f"  Registros unicos:         {len(df_superviviente):,}")
print(f"  Duplicados eliminados:    {len(df) - len(df_superviviente):,}")
print(f"  Tasa deduplicacion:       {(len(df) - len(df_superviviente))/len(df):.1%}")

# ================================================
# CICLO DE VIDA DEL DATO MAESTRO
# ================================================
print("\n--- CICLO DE VIDA DEL DATO MAESTRO ---")

ciclo_vida = {
    "Creacion": {
        "descripcion": "Primer registro del ciudadano — nacimiento o naturalizacion",
        "fuente_auth":  "Registro Civil (acta nacimiento o naturalizacion)",
        "validaciones": ["Cedula valida (algoritmo modulo 10)", "Fecha nac coherente",
                         "Lugar nacimiento en lista INEC"],
        "estado_resultado": "ACTIVO",
    },
    "Actualizacion": {
        "descripcion": "Cambios de datos — casamiento, cambio direccion, actualizacion email",
        "fuente_auth":  "Ciudadano via gobierno.ec + validacion por fuente autoritativa",
        "validaciones": ["Autenticacion ciudadano (clave unica)", "Coherencia vs fuente auth",
                         "Audit trail del cambio"],
        "estado_resultado": "ACTIVO_ACTUALIZADO",
    },
    "Fusion": {
        "descripcion": "Dos registros detectados como el mismo ciudadano — merge",
        "fuente_auth":  "CDO autoriza fusion de duplicados confirmados",
        "validaciones": ["Match score >= 0.95", "Aprobacion steward", "Preservar historial"],
        "estado_resultado": "ACTIVO (registro superviviente)",
    },
    "Suspension": {
        "descripcion": "Cedula reportada como fraudulenta — en investigacion",
        "fuente_auth":  "Fiscalia o Registro Civil notifica",
        "validaciones": ["Numero de caso judicial", "Notificacion a sistemas consumidores"],
        "estado_resultado": "SUSPENDIDO",
    },
    "Inactivacion": {
        "descripcion": "Ciudadano fallecido o emigrado definitivamente",
        "fuente_auth":  "Registro Civil (acta defuncion o declaracion emigracion)",
        "validaciones": ["Fecha defuncion posterior a nacimiento", "Cruce con IESS (cese aportes)"],
        "estado_resultado": "INACTIVO",
    },
    "Archivado": {
        "descripcion": "Datos retenidos segun LOPDP y Codigo Civil — 10 anos post-inactivacion",
        "fuente_auth":  "CDO autoriza archivado",
        "validaciones": ["Plazo legal cumplido", "No hay litigios pendientes"],
        "estado_resultado": "ARCHIVADO",
    },
}

for fase, info in ciclo_vida.items():
    print(f"\n  [{fase.upper()}]")
    print(f"    Descripcion: {info['descripcion']}")
    print(f"    Fuente auth: {info['fuente_auth'][:60]}")
    print(f"    Estado:      {info['estado_resultado']}")

# ================================================
# METRICAS MDM
# ================================================
print("\n--- METRICAS DEL PROGRAMA MDM ---")

meses = ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"]

metricas_mdm = {
    "Total golden records":         [16_800_000, 16_820_000, 16_850_000,
                                      16_870_000, 16_890_000, 16_910_000],
    "Tasa duplicados %":            [8.2, 6.1, 4.3, 2.9, 1.8, 1.1],
    "Score confianza promedio":     [0.71, 0.74, 0.78, 0.83, 0.87, 0.90],
    "Fuentes integradas":           [2, 3, 4, 5, 5, 6],
    "Issues MDM abiertos":          [12_450, 9_230, 6_780, 4_120, 2_890, 1_540],
}

df_mdm = pd.DataFrame(metricas_mdm, index=meses)
print(f"\n{df_mdm.to_string()}")

print(f"\n  Mejoras en 6 meses:")
print(f"    Duplicados:     8.2% → 1.1% (-86%)")
print(f"    Confianza:      0.71 → 0.90 (+27%)")
print(f"    Issues MDM:     12,450 → 1,540 (-88%)")
print(f"    Fuentes:        2 → 6 sistemas integrados")

print("\n" + "=" * 65)
print("MASTER DATA MANAGEMENT — CONCEPTOS CLAVE:")
print("  Golden record:   UN registro de verdad por entidad — elimina versiones")
print("  Confianza fuente: Registro Civil 100% — SRI 92% — IESS 90%")
print("  Match y merge:   similitud + confianza + timestamp = survivorship")
print("  Ciclo de vida:   crear → actualizar → fusionar → inactivar → archivar")
print("  Deduplicacion:   cedula duplicada = error que afecta prestaciones reales")
print("  Normalizacion:   antes de comparar — mayusculas, prefijos, abreviaciones")
print("=" * 65)
```

3. Implementa el algoritmo de match probabilistico entre dos registros de fuentes distintas sin cedula comun: usa similitud de nombre (Jaro-Winkler o SequenceMatcher), fecha de nacimiento (distancia en dias), telefono normalizado y direccion — genera un score de match (0-1) y una recomendacion: MATCH_CONFIRMADO (>0.90), REVISAR_MANUAL (0.70-0.90), NO_MATCH (<0.70).

4. Agrega el generador de reporte de cobertura del MDM por provincia: para cada una de las 24 provincias del Ecuador, calcula el porcentaje de ciudadanos con golden record completo (todos los campos core poblados), el numero de duplicados detectados y el score promedio de confianza.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy el arquitecto de datos del Registro Civil del Ecuador. Estoy construyendo el MDM del Estado ecuatoriano — 18 millones de ciudadanos distribuidos en 47 sistemas. Mi problema critico: tenemos 3 sistemas con datos conflictivos para el mismo ciudadano. El caso real: Juan Carlos Vega, cedula 1712345678, aparece como SOLTERO en el Registro Civil (2019), CASADO en el IESS (2022 — se caso y lo reporto al empleador pero no actualizo Registro Civil), y con UNION LIBRE en el SRI (declaracion 2023). ¿Cual es el valor correcto para el golden record? Necesito: 1) la logica de survivorship para campos con dimension temporal (el estado civil mas reciente es el correcto), 2) el proceso para notificar al ciudadano del conflicto y darle 30 dias para corregir, 3) la politica de auditoria — cuando el registro cambia, quien cambio que y cuando. Diseña el proceso completo con diagrama de flujo."

Despues de leer la respuesta:
- Implementa el motor de reglas de survivorship para campos con dimension temporal: dado un campo y una lista de valores con timestamps por fuente, determina el valor correcto aplicando la logica temporal + confianza de fuente.
- Agrega el sistema de notificacion al ciudadano para datos conflictivos: genera el mensaje de notificacion via gobierno.ec con los datos en conflicto, el valor tentativo del golden record y el proceso para objetar.

## Que aprendiste

- El golden record no es el promedio — es el valor mas confiable segun la fuente autoritativa y el timestamp.
- La fuente autoritativa para datos de identidad es SIEMPRE el Registro Civil — no el IESS ni el SRI.
- El score de confianza del golden record permite priorizar que registros revisar manualmente.
- La deduplicacion por cedula es solo el primer paso — existen duplicados sin cedula comun (errores de digitacion).
- El ciclo de vida del dato maestro incluye inactivacion y archivado — no todo dato vive para siempre.
- Sin normalizacion previa (mayusculas, prefijos de telefono) el match produce falsos negativos.

## Reto extra

Diseña e implementa el MDM del sistema de salud ecuatoriano para el MSP: golden record del paciente unificando HCU del MSP, historia IESS, hospitales privados (via API HL7 FHIR), farmacias (ARCSA), y laboratorios clinicos. Implementa el Patient Master Index (PMI) con algoritmo de deduplicacion probabilistica que detecta al mismo paciente con cedula, nombre y fecha nacimiento ligeramente distintos (errores de digitacion en urgencias). El sistema debe cumplir HL7 FHIR R4 para interoperabilidad, LOPDP para privacidad, y generar el Patient Summary (PS-EC) estandar europeo adaptado a Ecuador que viaja con el paciente entre establecimientos.
