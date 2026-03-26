# Ejercicio Sesion 8: Proyecto Programa Gobierno de Datos Empresarial

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 90 min

## Objetivo

Disenar e implementar el programa completo de Gobierno de Datos para Corporacion La Favorita (supermercados Supermaxi, Megamaxi, Santa Maria): arquitectura de gobierno, catalogo de datos empresarial, sistema de calidad con SLA, programa de stewardship por dominio, cumplimiento LOPDP para datos de 5 millones de clientes, MDM de clientes y proveedores, y dashboard ejecutivo — integrando todos los conceptos de la materia en un sistema operativo real.

## Contexto

Corporacion La Favorita es la empresa de retail mas grande de Ecuador: 82 tiendas, 15,000 empleados, 5 millones de clientes registrados en la tarjeta Mi Favorita, 1,200 proveedores, $3,500 millones en ventas anuales. Sus datos estan distribuidos en: SAP (ERP), Oracle (financiero), sistema de tarjeta de lealtad, e-commerce, WMS (bodegas), TMS (transporte), y 82 sistemas POS. Sin gobierno de datos, la empresa toma decisiones con datos inconsistentes — el mismo proveedor tiene 3 RUC distintos en 3 sistemas, el mismo producto tiene 2 precios diferentes. El programa de gobierno busca crear una unica version de la verdad para toda la organizacion.

## Instrucciones

1. Crea el archivo `sesion08_gobierno_datos_favorita.py`:

```python
# Proyecto Integrador: Gobierno de Datos Empresarial - ITSEIA
# Gobierno de Datos y Cumplimiento
# Corporacion La Favorita — programa completo

import re
import uuid
import hashlib
import numpy as np
import pandas as pd
from datetime import datetime, date, timedelta
from collections import defaultdict, deque
from enum import Enum
import warnings
warnings.filterwarnings("ignore")

print("=" * 70)
print("PROGRAMA GOBIERNO DE DATOS — CORPORACION LA FAVORITA")
print("82 tiendas | 5M clientes | 1,200 proveedores | $3,500M ventas")
print("=" * 70)

# ================================================
# ARQUITECTURA DE GOBIERNO: DOMINIOS Y STEWARDS
# ================================================
print("\n--- ARQUITECTURA DE GOBIERNO ---")

DOMINIOS_FAVORITA = {
    "Clientes": {
        "steward_lider":  "Gerente Tarjeta Mi Favorita",
        "sistemas":       ["CRM Salesforce", "App MiFavorita", "Portal e-commerce",
                           "POS 82 tiendas"],
        "volumen_est":    5_000_000,
        "criticidad":     "CRITICA",
        "sla_calidad":    0.96,
        "regulacion":     "LOPDP — datos PII masivos",
        "kpi_negocio":    "Tasa retencion clientes activos",
    },
    "Productos": {
        "steward_lider":  "Jefe de Categoria y Surtido",
        "sistemas":       ["SAP MM", "WMS Bodegas", "POS tiendas", "E-commerce"],
        "volumen_est":    180_000,
        "criticidad":     "ALTA",
        "sla_calidad":    0.98,
        "regulacion":     "ARCSA (alimentos) — trazabilidad obligatoria",
        "kpi_negocio":    "Fill rate y rotacion de inventario",
    },
    "Proveedores": {
        "steward_lider":  "Gerente de Compras Corporativo",
        "sistemas":       ["SAP MM", "Portal proveedores", "Oracle AP"],
        "volumen_est":    1_200,
        "criticidad":     "ALTA",
        "sla_calidad":    0.97,
        "regulacion":     "SRI — RUC valido, facturas electronicas",
        "kpi_negocio":    "On-time delivery y calidad de producto",
    },
    "Transacciones": {
        "steward_lider":  "Gerente de Finanzas",
        "sistemas":       ["SAP FI", "Oracle GL", "POS tiendas", "E-commerce"],
        "volumen_est":    350_000_000,  # tickets anuales estimados
        "criticidad":     "CRITICA",
        "sla_calidad":    0.999,
        "regulacion":     "SRI — facturacion electronica, NIIF",
        "kpi_negocio":    "Ticket promedio, ventas por m2",
    },
    "Empleados": {
        "steward_lider":  "Gerente de RRHH",
        "sistemas":       ["SAP HCM", "Portal RRHH", "IESS reportes"],
        "volumen_est":    15_000,
        "criticidad":     "MEDIA",
        "sla_calidad":    0.95,
        "regulacion":     "LOPDP — datos laborales sensibles",
        "kpi_negocio":    "Rotacion, ausentismo, productividad",
    },
    "Logistica": {
        "steward_lider":  "Gerente de Cadena de Suministro",
        "sistemas":       ["WMS", "TMS", "SAP SD", "GPS flota"],
        "volumen_est":    2_400_000,   # ordenes logisticas anuales
        "criticidad":     "ALTA",
        "sla_calidad":    0.96,
        "regulacion":     "ARCSA — trazabilidad frio",
        "kpi_negocio":    "OTIF (on-time in-full), costo por km",
    },
}

print(f"\n  {'Dominio':<16} {'Criticidad':<10} {'Volumen':>14} {'SLA':>6} {'Steward'}")
print(f"  {'-'*72}")
for dominio, info in DOMINIOS_FAVORITA.items():
    print(f"  {dominio:<16} {info['criticidad']:<10} {info['volumen_est']:>14,} "
          f"{info['sla_calidad']:>6.1%} {info['steward_lider'][:28]}")

# ================================================
# CATALOGO DE DATOS EMPRESARIAL
# ================================================
print("\n--- CATALOGO DE DATOS FAVORITA ---")

class EntradaCatalogo:
    """Activo de datos en el catalogo empresarial."""

    def __init__(self, nombre, dominio, sistema, descripcion,
                 campos_clave, clasificacion_lopdp, sla_calidad, dueno):
        self.id                 = f"DA-{uuid.uuid4().hex[:6].upper()}"
        self.nombre             = nombre
        self.dominio            = dominio
        self.sistema            = sistema
        self.descripcion        = descripcion
        self.campos_clave       = campos_clave
        self.clasificacion_lopdp= clasificacion_lopdp
        self.sla_calidad        = sla_calidad
        self.dueno              = dueno
        self.fecha_registro     = date.today()
        self.ultima_auditoria   = None
        self.score_calidad      = None
        self.tags               = []

    def agregar_tag(self, tag):
        self.tags.append(tag)

    def registrar_auditoria(self, score):
        self.score_calidad    = score
        self.ultima_auditoria = date.today()

    def estado_calidad(self):
        if self.score_calidad is None:
            return "SIN AUDITAR"
        if self.score_calidad >= self.sla_calidad:
            return "CUMPLE"
        elif self.score_calidad >= self.sla_calidad - 0.05:
            return "EN RIESGO"
        return "INCUMPLE"


class CatalogoEmpresarial:
    """Catalogo central de activos de datos de La Favorita."""

    def __init__(self, empresa):
        self.empresa    = empresa
        self.activos    = {}
        self.por_dominio= defaultdict(list)

    def registrar(self, entrada):
        self.activos[entrada.id] = entrada
        self.por_dominio[entrada.dominio].append(entrada.id)
        return entrada.id

    def buscar(self, termino):
        """Busqueda full-text simple en nombre y descripcion."""
        termino = termino.lower()
        return [a for a in self.activos.values()
                if termino in a.nombre.lower() or termino in a.descripcion.lower()]

    def cobertura_por_dominio(self):
        total = len(self.activos)
        auditados = sum(1 for a in self.activos.values()
                        if a.score_calidad is not None)
        print(f"\n  Cobertura del catalogo: {total} activos, {auditados} auditados "
              f"({auditados/total:.0%})")
        print(f"\n  {'Dominio':<16} {'Activos':>8} {'Auditados':>10} "
              f"{'Score Prom':>12} {'Estado'}")
        print(f"  {'-'*56}")
        for dominio in DOMINIOS_FAVORITA:
            ids = self.por_dominio.get(dominio, [])
            entradas = [self.activos[i] for i in ids]
            auditadas_d = [e for e in entradas if e.score_calidad is not None]
            score_prom = (sum(e.score_calidad for e in auditadas_d) / len(auditadas_d)
                          if auditadas_d else None)
            score_str = f"{score_prom:.1%}" if score_prom else "N/A"
            incumple = sum(1 for e in auditadas_d if e.estado_calidad() == "INCUMPLE")
            estado = "OK" if incumple == 0 else f"{incumple} INCUMPLE"
            print(f"  {dominio:<16} {len(entradas):>8} {len(auditadas_d):>10} "
                  f"{score_str:>12} {estado}")


# Construir catalogo
catalogo = CatalogoEmpresarial("Corporacion La Favorita")
np.random.seed(42)

activos_definidos = [
    EntradaCatalogo("clientes_mi_favorita", "Clientes", "CRM Salesforce",
        "5M clientes con tarjeta de lealtad — historial compras, puntos, preferencias",
        ["id_cliente", "cedula_hash", "email", "telefono", "segmento"],
        "PII — datos ordinarios", 0.96, "Gerente Tarjeta Mi Favorita"),
    EntradaCatalogo("transacciones_pos", "Transacciones", "POS 82 tiendas",
        "Tickets de venta de 82 tiendas — 350M+ transacciones anuales",
        ["id_ticket", "id_tienda", "id_cajero", "monto_total", "fecha_hora"],
        "No personal", 0.999, "Gerente de Finanzas"),
    EntradaCatalogo("maestro_productos", "Productos", "SAP MM",
        "Catalogo de 180,000 SKUs activos con precios, imagenes y trazabilidad ARCSA",
        ["sku", "ean", "nombre_producto", "categoria", "precio_pvp", "lote"],
        "No personal", 0.98, "Jefe de Categoria y Surtido"),
    EntradaCatalogo("proveedores_activos", "Proveedores", "SAP MM",
        "1,200 proveedores activos con RUC, condiciones pago y certificaciones",
        ["id_proveedor", "ruc", "razon_social", "categoria", "certificaciones"],
        "No personal", 0.97, "Gerente de Compras Corporativo"),
    EntradaCatalogo("empleados_nomina", "Empleados", "SAP HCM",
        "15,000 empleados activos con datos laborales y de nomina",
        ["id_empleado", "cedula_hash", "cargo", "tienda", "salario_band"],
        "PII — datos laborales sensibles", 0.95, "Gerente de RRHH"),
    EntradaCatalogo("inventario_bodegas", "Logistica", "WMS",
        "Stock en tiempo real de 8 centros de distribucion y 82 tiendas",
        ["sku", "bodega_id", "unidades_disponibles", "fecha_vencimiento"],
        "No personal", 0.96, "Gerente de Cadena de Suministro"),
    EntradaCatalogo("historial_compras_cliente", "Clientes", "CRM Salesforce",
        "Historial completo de compras por cliente — base para personalizacion",
        ["id_cliente", "id_ticket", "sku", "cantidad", "monto", "fecha"],
        "PII — dato de comportamiento", 0.96, "Gerente Tarjeta Mi Favorita"),
    EntradaCatalogo("rutas_logisticas", "Logistica", "TMS",
        "Rutas de distribucion de flota — GPS tracking y KPIs OTIF",
        ["id_ruta", "placa", "origen", "destino", "gps_coords", "estado"],
        "No personal", 0.96, "Gerente de Cadena de Suministro"),
]

for activo in activos_definidos:
    iid = catalogo.registrar(activo)
    # Simular auditoria con score aleatorio
    score = np.random.uniform(0.88, 0.999)
    activo.registrar_auditoria(round(score, 3))
    if "cliente" in activo.nombre.lower() or "empleado" in activo.nombre.lower():
        activo.agregar_tag("PII")
    if "CRITICA" == DOMINIOS_FAVORITA.get(activo.dominio, {}).get("criticidad"):
        activo.agregar_tag("CRITICO")

# Forzar un activo con incumplimiento para demo
activos_definidos[4].registrar_auditoria(0.887)  # empleados bajo SLA

print(f"\n  Activos registrados en catalogo: {len(catalogo.activos)}")
catalogo.cobertura_por_dominio()

# ================================================
# SISTEMA DE CALIDAD DE DATOS — MULTI-DOMINIO
# ================================================
print("\n--- SISTEMA DE CALIDAD DE DATOS ---")

np.random.seed(7)
n_clientes = 2000

# Dataset clientes con issues de calidad intencionales
df_clientes = pd.DataFrame({
    "id_cliente":    [f"CL{i:07d}" for i in range(n_clientes)],
    "cedula":        [f"17{np.random.randint(10000000, 99999999)}" for _ in range(n_clientes)],
    "email":         [f"cliente{i}@{'gmail' if i%3==0 else 'hotmail' if i%3==1 else 'yahoo'}.com"
                      for i in range(n_clientes)],
    "telefono":      [f"09{np.random.randint(10000000, 99999999)}" if np.random.rand() > 0.08
                      else None for _ in range(n_clientes)],
    "fecha_registro":[f"202{np.random.randint(0,5)}-{np.random.randint(1,12):02d}-"
                      f"{np.random.randint(1,28):02d}" for _ in range(n_clientes)],
    "segmento":      np.random.choice(["ORO", "PLATA", "BRONCE", None, "INVALIDO"],
                                       n_clientes, p=[0.1, 0.3, 0.5, 0.05, 0.05]),
    "puntos_acum":   [np.random.randint(-100, 50000) for _ in range(n_clientes)],
    "provincia":     np.random.choice(
                        ["Pichincha","Guayas","Azuay","Manabi","Tungurahua",None],
                        n_clientes, p=[0.35, 0.30, 0.10, 0.08, 0.07, 0.10]),
})

# Introducir cedulas duplicadas
for i in range(50):
    df_clientes.loc[n_clientes - 1 - i, "cedula"] = df_clientes.loc[i, "cedula"]

class PerfiladorFavorita:
    """Perfilador de calidad para datasets de La Favorita."""

    def __init__(self, df, nombre_dataset):
        self.df      = df
        self.nombre  = nombre_dataset
        self.scores  = {}

    def medir_completitud(self, campos_obligatorios):
        scores = {}
        for campo in campos_obligatorios:
            nulos   = self.df[campo].isna().sum()
            score   = 1 - nulos / len(self.df)
            scores[campo] = round(score, 4)
        self.scores["completitud"] = round(sum(scores.values()) / len(scores), 4)
        return scores

    def medir_unicidad(self, campo_clave):
        n_total = len(self.df)
        n_unicos = self.df[campo_clave].nunique()
        n_dup    = n_total - n_unicos
        score    = n_unicos / n_total
        self.scores["unicidad"] = round(score, 4)
        return {"duplicados": n_dup, "score": round(score, 4)}

    def medir_validez_segmento(self):
        valores_validos = {"ORO", "PLATA", "BRONCE"}
        invalidos = self.df["segmento"].notna() & ~self.df["segmento"].isin(valores_validos)
        score = 1 - invalidos.sum() / len(self.df)
        self.scores["validez_segmento"] = round(score, 4)
        return {"invalidos": int(invalidos.sum()), "score": round(score, 4)}

    def medir_validez_puntos(self):
        negativos = (self.df["puntos_acum"] < 0).sum()
        score = 1 - negativos / len(self.df)
        self.scores["validez_puntos"] = round(score, 4)
        return {"puntos_negativos": int(negativos), "score": round(score, 4)}

    def score_global(self):
        if not self.scores:
            return 0.0
        return round(sum(self.scores.values()) / len(self.scores), 4)

    def reporte(self, sla_target):
        print(f"\n  Perfil de calidad: {self.nombre}")
        print(f"  Registros:   {len(self.df):,}")
        for metrica, score in self.scores.items():
            cumple = "OK" if score >= sla_target else "FALLO"
            barra  = "#" * int(score * 20)
            print(f"    {metrica:<25}: {score:.1%} [{barra:<20}] {cumple}")
        global_score = self.score_global()
        estado = "CUMPLE SLA" if global_score >= sla_target else "INCUMPLE SLA"
        print(f"  Score global: {global_score:.1%} — {estado} (target {sla_target:.0%})")
        return global_score


perfilador = PerfiladorFavorita(df_clientes, "clientes_mi_favorita")
perfilador.medir_completitud(["id_cliente", "cedula", "email", "telefono", "provincia"])
perfilador.medir_unicidad("cedula")
perfilador.medir_validez_segmento()
perfilador.medir_validez_puntos()
score_real = perfilador.reporte(sla_target=0.96)

# ================================================
# MDM PROVEEDOR: DEDUPLICACION Y GOLDEN RECORD
# ================================================
print("\n--- MDM PROVEEDORES: DEDUPLICACION ---")

np.random.seed(15)
proveedores_raw = [
    {"fuente": "SAP",     "ruc": "1790012345001", "nombre": "PRONACA S.A.",
     "contacto": "ventas@pronaca.com",      "telefono": "022456789"},
    {"fuente": "Oracle",  "ruc": "1790012345001", "nombre": "PRONACA SA",
     "contacto": "facturacion@pronaca.com", "telefono": "022456789"},
    {"fuente": "Portal",  "ruc": "1790012345001", "nombre": "Pronaca S.A.",
     "contacto": "logistica@pronaca.com",   "telefono": "+593 2 2456789"},
    {"fuente": "SAP",     "ruc": "1790234567001", "nombre": "CORPORACION NOBOA",
     "contacto": "compras@noboa.com",       "telefono": "042456123"},
    {"fuente": "Oracle",  "ruc": "1790234567001", "nombre": "Corp. Noboa",
     "contacto": "facturacion@noboa.com",   "telefono": "042456123"},
    {"fuente": "SAP",     "ruc": "1790345678001", "nombre": "NESTLE ECUADOR S.A.",
     "contacto": "customer@nestle.ec",      "telefono": "022789456"},
]

df_prov = pd.DataFrame(proveedores_raw)

# Agrupar por RUC — survivorship: SAP como fuente autoritativa
def golden_proveedor(grupo):
    prioridad = {"SAP": 3, "Oracle": 2, "Portal": 1}
    grupo_sorted = grupo.sort_values("fuente",
                       key=lambda x: x.map(prioridad).fillna(0), ascending=False)
    golden = {
        "ruc":      grupo_sorted.iloc[0]["ruc"],
        "nombre":   grupo_sorted.iloc[0]["nombre"],
        "emails":   list(grupo["contacto"].dropna().unique()),
        "telefono": grupo_sorted.iloc[0]["telefono"],
        "fuentes":  list(grupo["fuente"].unique()),
        "n_registros_merged": len(grupo),
        "_id": f"GP-{hashlib.md5(grupo_sorted.iloc[0]['ruc'].encode()).hexdigest()[:8].upper()}",
    }
    return pd.Series(golden)

golden_proveedores = df_prov.groupby("ruc", group_keys=False).apply(golden_proveedor)
golden_proveedores = golden_proveedores.reset_index(drop=True)

print(f"\n  Registros fuente: {len(df_prov)}")
print(f"  Golden records:   {len(golden_proveedores)}")
print(f"  Deduplicacion:    {len(df_prov) - len(golden_proveedores)} registros mergeados")
print(f"\n  Golden records construidos:")
for _, row in golden_proveedores.iterrows():
    print(f"\n  [{row['_id']}] RUC: {row['ruc']}")
    print(f"    Nombre:   {row['nombre']}")
    print(f"    Emails:   {row['emails']}")
    print(f"    Fuentes:  {row['fuentes']} ({row['n_registros_merged']} registros mergeados)")

# ================================================
# CUMPLIMIENTO LOPDP: INVENTARIO PII
# ================================================
print("\n--- INVENTARIO PII FAVORITA (LOPDP) ---")

inventario_pii = [
    {"sistema": "CRM Salesforce",  "campo": "cedula/pasaporte",
     "categoria": "Identificador",  "sensibilidad": "ORDINARIO",
     "proposito": "Identificacion unica cliente",
     "base_legal": "Ejecucion contrato (tarjeta Mi Favorita)",
     "retencion": "Vigencia relacion + 5 anos", "cifrado": True},
    {"sistema": "CRM Salesforce",  "campo": "historial_compras",
     "categoria": "Comportamiento", "sensibilidad": "ORDINARIO",
     "proposito": "Personalizacion ofertas y puntos",
     "base_legal": "Consentimiento explicito al registrarse",
     "retencion": "5 anos desde ultima compra", "cifrado": False},
    {"sistema": "App MiFavorita",  "campo": "ubicacion_gps",
     "categoria": "Datos de ubicacion", "sensibilidad": "ORDINARIO",
     "proposito": "Tienda mas cercana y delivery",
     "base_legal": "Consentimiento granular (opt-in en app)",
     "retencion": "30 dias", "cifrado": True},
    {"sistema": "SAP HCM",         "campo": "datos_medicos_empleados",
     "categoria": "Salud",          "sensibilidad": "SENSIBLE",
     "proposito": "Gestion ausencias y licencias medicas",
     "base_legal": "Obligacion legal (Codigo Trabajo)",
     "retencion": "10 anos post-desvinculacion", "cifrado": True},
    {"sistema": "SAP HCM",         "campo": "salarios_nomina",
     "categoria": "Financiero personal", "sensibilidad": "SENSIBLE",
     "proposito": "Pago de nomina",
     "base_legal": "Ejecucion contrato laboral",
     "retencion": "7 anos (tributario)", "cifrado": True},
    {"sistema": "Camaras tiendas", "campo": "video_vigilancia",
     "categoria": "Biometrico/video", "sensibilidad": "SENSIBLE",
     "proposito": "Seguridad instalaciones",
     "base_legal": "Interes legitimo + aviso visible",
     "retencion": "30 dias", "cifrado": False},
]

df_pii = pd.DataFrame(inventario_pii)
print(f"\n  {'Sistema':<20} {'Campo':<28} {'Sensibilidad':<12} {'Cifrado'}")
print(f"  {'-'*72}")
for _, row in df_pii.iterrows():
    cifrado_str = "SI" if row["cifrado"] else "NO [REVISAR]"
    print(f"  {row['sistema']:<20} {row['campo']:<28} "
          f"{row['sensibilidad']:<12} {cifrado_str}")

sin_cifrar = df_pii[~df_pii["cifrado"]]
print(f"\n  Activos PII sin cifrado: {len(sin_cifrar)}")
for _, row in sin_cifrar.iterrows():
    print(f"  ACCION REQUERIDA: Cifrar '{row['campo']}' en {row['sistema']}")

# ================================================
# DASHBOARD EJECUTIVO PROGRAMA GOBIERNO
# ================================================
print("\n--- DASHBOARD EJECUTIVO — GOBIERNO DE DATOS ---")

np.random.seed(99)
trimestres = ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024"]

programa = {
    "madurez_global":        [1.4, 1.7, 2.1, 2.4, 2.7],
    "score_calidad_global":  [0.79, 0.83, 0.87, 0.91, 0.93],
    "issues_abiertos":       [187, 142, 98, 63, 41],
    "activos_catalogados":   [120, 210, 340, 480, 580],
    "sla_cumplimiento":      [0.55, 0.65, 0.74, 0.82, 0.89],
    "costo_datos_malos_mk":  [2.1, 1.8, 1.4, 1.0, 0.7],  # millones USD
}

df_prog = pd.DataFrame(programa, index=trimestres)

print(f"\n  {df_prog.to_string()}")

print(f"\n  Impacto del programa (Q1 2023 → Q1 2024):")
print(f"    Madurez:      1.4 → 2.7 (Nivel 1 Ad-Hoc → Nivel 3 Proactivo)")
print(f"    Calidad:      79% → 93% (+14 puntos)")
print(f"    Issues:       187 → 41 abiertos (-78%)")
print(f"    Catalogo:     120 → 580 activos documentados (+383%)")
print(f"    Costo datos malos: $2.1M → $0.7M/trimestre (-67%, ahorro $5.6M/ano)")

roi_inversion  = 450_000   # USD — costo del programa 12 meses
roi_ahorro_ano = 5_600_000  # USD — ahorro anual por mejora calidad
roi_ratio      = roi_ahorro_ano / roi_inversion
print(f"\n  ROI del programa:")
print(f"    Inversion 12 meses:  ${roi_inversion:,}")
print(f"    Ahorro anual:        ${roi_ahorro_ano:,}")
print(f"    ROI:                 {roi_ratio:.1f}x ({roi_ratio*100-100:.0f}%)")
print(f"    Payback:             {12/roi_ratio:.1f} meses")

# ================================================
# OBSERVABILIDAD DEL PROGRAMA
# ================================================
print("\n--- OBSERVABILIDAD DEL PROGRAMA ---")

observabilidad = {
    "gobierno": {
        "nivel_madurez":        2.7,
        "meta_q2_2024":         3.0,
        "comites_celebrados":   5,
        "politicas_activas":    14,
        "stewards_certificados": 8,
    },
    "calidad": {
        "score_global":          score_real,
        "sla_target":            0.96,
        "dominios_en_sla":       sum(1 for d in DOMINIOS_FAVORITA.values()
                                     if d["sla_calidad"] <= 0.97),
        "issues_criticos":       2,
        "tiempo_resolucion_h":   31,
    },
    "catalogo": {
        "total_activos":         len(catalogo.activos),
        "auditados":             len([a for a in catalogo.activos.values()
                                      if a.score_calidad is not None]),
        "con_tag_pii":           len([a for a in catalogo.activos.values()
                                      if "PII" in a.tags]),
        "cobertura_criticos":    "87.5%",
    },
    "privacidad": {
        "activos_pii_inventariados": len(inventario_pii),
        "activos_sin_cifrar":         len(sin_cifrar),
        "dpo_nombrado":               True,
        "dpias_completados":          3,
        "solicitudes_arco_ytd":       127,
        "tasa_sla_arco":              0.89,
    },
    "mdm": {
        "golden_records_clientes": 4_987_234,
        "tasa_duplicados":         0.008,
        "golden_records_proveedores": len(golden_proveedores),
        "fuentes_integradas":      4,
        "score_confianza_prom":    0.912,
    },
}

for categoria, metricas in observabilidad.items():
    print(f"\n  [{categoria.upper()}]")
    for k, v in metricas.items():
        print(f"    {k:<35}: {v}")

print("\n" + "=" * 70)
print("GOBIERNO DE DATOS EMPRESARIAL — LOGROS DEL PROYECTO:")
print("  Arquitectura: 6 dominios, 8 stewards, comite gobierno activo")
print("  Catalogo:     8 activos criticos documentados con score de calidad")
print("  Calidad:      score 79% → 93% en 4 trimestres")
print("  MDM:          deduplicacion proveedores — 6 registros → 3 golden records")
print("  Privacidad:   inventario PII completo, 2 activos identificados sin cifrar")
print("  ROI:          12.4x — payback en 1 mes (ahorro $5.6M/ano)")
print("  LOPDP:        DPO nombrado, 3 DPIAs, tasa ARCO 89%")
print("=" * 70)
```

2. Implementa el modulo de alertas de gobierno: detecta automaticamente activos que caen por debajo de su SLA de calidad, notifica al steward lider con el detalle del incumplimiento y genera el plan de accion en formato ejecutivo para el CDO con prioridades y responsables.

3. Agrega el generador de informe ejecutivo trimestral completo: dado el estado del programa, genera el documento de presentacion para el Directorio de La Favorita con: resumen ejecutivo (3 bullet points), estado de cumplimiento regulatorio (LOPDP, SRI, ARCSA), KPIs del programa con tendencia, top 3 logros del trimestre, top 3 riesgos con mitigacion, y plan de trabajo del siguiente trimestre.

## Usa IA para...

> Abre Gemini y escribe:
> "Soy el CDO de Corporacion La Favorita. Tenemos 5 millones de clientes en nuestra tarjeta de lealtad Mi Favorita. Quiero usar esos datos para: 1) personalizar ofertas por cliente en tiempo real (que producto ofrecerle cuando entra a la tienda segun su historial), 2) predecir que clientes van a desertar en los proximos 3 meses para retenerlos, 3) optimizar el surtido de cada tienda basado en el perfil demografico del barrio. El problema legal: la LOPDP me pide que solo use los datos para el proposito para el que el cliente dio su consentimiento (comprar con puntos). ¿Puedo hacer estas 3 cosas con los datos actuales? Si no, ¿que consentimientos adicionales necesito y como los capturo sin perder clientes? ¿Como implemento 'Privacy by Design' en el sistema de recomendaciones para que nunca use datos sin base legal?"

Despues de leer la respuesta:
- Implementa el motor de verificacion de base legal: antes de usar cualquier dato de cliente en un proceso analitico, verifica que existe base legal documentada para ese proposito especifico y rechaza el proceso si no la hay.
- Agrega el sistema de gestion de consentimientos: permite registrar, actualizar y revocar consentimientos por tipo de uso, y genera el reporte de cobertura de consentimientos por segmento de cliente.

## Que aprendiste

- El gobierno de datos empresarial no es un proyecto puntual — es un programa continuo con madurez creciente.
- El catalogo de datos sin auditoria de calidad es solo un inventario — la calidad con SLA lo convierte en gobierno real.
- El MDM de proveedores es tan critico como el de clientes — un RUC duplicado genera pagos dobles.
- La LOPDP no solo regula que datos tener sino para que usarlos — la base legal es por proposito, no por dato.
- El ROI del gobierno de datos es medible: costo datos malos ($2.1M/trimestre) vs inversion programa ($450K/ano).
- El dashboard ejecutivo convierte tecnica en negocio — el Directorio necesita ROI y riesgos, no scores tecnicos.

## Reto extra

Diseña e implementa el programa de gobierno de datos para el Municipio de Quito (MDMQ): 8 empresas municipales (EMASEO, EPMAPS, EPMMOP, EMT, MetroQuito, Patronato, Zoo, Quitumbe), catalogo de 500+ datasets de servicios ciudadanos, modelo de calidad para datos de ciudadanos con 2.8 millones de registros, MDM del ciudadano de Quito unificando registros de todas las empresas municipales, cumplimiento con LOPDP y transparencia (datos abiertos), sistema de gobierno de datos geoespaciales para la ciudad (SIG, catastro, rutas), y un portal de datos abiertos compatible con datos.quito.gob.ec y el estandar DCAT-AP con 100 datasets certificados de calidad para publicacion al ciudadano.
