# Ejercicio Sesion 7: Data Mesh — Introduccion y Principios

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 50 min

## Objetivo

Comprender la arquitectura Data Mesh como evolucion del Data Warehouse y Data Lake centralizados, implementar los cuatro principios del Data Mesh (ownership descentralizado, datos como producto, infraestructura self-serve y gobernanza federada), y disenar un prototipo de dominio de datos para una empresa ecuatoriana.

## Contexto

El Banco Pichincha con 17 unidades de negocio distintas, o el Ministerio de Salud con 22 provincias y 50 hospitales de referencia, tienen el mismo problema: sus datos estan en silos, el equipo central de datos es un cuello de botella, y los proyectos de analitica tardan meses en entregarse porque todo pasa por el mismo equipo. Data Mesh, concepto de Zhamak Dehghani (2019), propone un cambio de paradigma: los datos los gobiernan quienes los generan (los dominios de negocio), tratandolos como productos con SLAs, con infraestructura self-serve y con gobernanza federada que garantiza estandares comunes. En Ecuador, este enfoque es especialmente relevante para organismos del Estado con multiples dependencias autonomas.

## Instrucciones

1. Abre Google Colab y crea `sesion07_data_mesh.ipynb`.

2. Mapea los cuatro principios del Data Mesh con implementacion practica:

```python
# Gobierno de Datos - Sesion 7: Data Mesh
# ITSEIA - Periodo 5
# Estudiante: [Tu nombre]

import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

# ============================================================
# PARTE 1: Los 4 Principios del Data Mesh
# ============================================================

principios_data_mesh = {
    "1. Ownership Descentralizado por Dominio": {
        "problema_que_resuelve": "El equipo central de datos es cuello de botella: todos esperan al mismo equipo",
        "concepto": "Cada dominio de negocio es responsable de sus propios datos",
        "analogia": "Como microservicios para datos: cada equipo dueno de su API de datos",
        "caso_ecuador": "Banco Pichincha: dominio Cuentas, dominio Creditos, dominio Seguros — cada uno dueno de sus datos",
        "roles_clave": ["Domain Data Owner", "Data Product Manager", "Domain Data Engineer"],
        "anti_patron": "Un unico equipo de data engineering para toda la empresa",
    },
    "2. Datos como Producto (Data Product)": {
        "problema_que_resuelve": "Los datos son outputs internos sin calidad garantizada, documentacion ni SLA",
        "concepto": "Cada dominio publica sus datos como productos con calidad, documentacion y SLA garantizados",
        "analogia": "Como una API productiva: tiene contrato, versionado, SLA, documentation",
        "caso_ecuador": "Dominio 'Transacciones' en Produbanco: tabla transactions con SLA 99.9%, freshness < 1h, schema documentado",
        "roles_clave": ["Data Product Owner", "Data Product Engineer"],
        "anti_patron": "Tablas en el DW sin dueno conocido, sin documentacion, que nadie sabe si estan actualizadas",
    },
    "3. Infraestructura Self-Serve": {
        "problema_que_resuelve": "Los dominios dependen del equipo central para infraestructura (pipelines, storage, governance)",
        "concepto": "Plataforma de datos que permite a los dominios publicar y consumir datos sin dependencia central",
        "analogia": "Como AWS/Azure: el negocio usa la plataforma sin pedir al equipo de infra que configure todo",
        "caso_ecuador": "Plataforma comun del MIDUVI: cada direccion publica sus datos usando templates estandar",
        "herramientas": ["DataHub (metadata)", "dbt (transformaciones)", "Airflow (pipelines)", "Delta Lake (storage)"],
        "anti_patron": "Cada nuevo pipeline requiere ticket al equipo central y 3 semanas de espera",
    },
    "4. Gobernanza Federada y Computacional": {
        "problema_que_resuelve": "Sin estandares globales, cada dominio hace lo suyo: incompatibilidad entre dominios",
        "concepto": "Estandares globales aplicados automaticamente (no por humanos): schema, calidad, seguridad, lineage",
        "analogia": "Como un contrato de API: el dominio tiene libertad de implementacion pero debe cumplir el contrato",
        "caso_ecuador": "SRI: todos los dominios deben usar el tipo de dato 'cedula_ec' (10 digitos, validado), aunque cada sistema sea autonomo",
        "mecanismos": ["Schema Registry", "Data Quality SLA automaticos", "Policy as Code"],
        "anti_patron": "Reglas de gobierno solo en documentos Word que nadie lee ni cumple",
    },
}

print("LOS 4 PRINCIPIOS DEL DATA MESH")
print("Concepto de Zhamak Dehghani, ThoughtWorks, 2019")
print("=" * 65)

for principio, info in principios_data_mesh.items():
    print(f"\n{'='*10} {principio} {'='*10}")
    print(f"Problema: {info['problema_que_resuelve'][:70]}")
    print(f"Concepto: {info['concepto'][:70]}")
    print(f"Ecuador : {info['caso_ecuador'][:70]}")
```

3. Implementa el modelo de un Data Product con su contrato:

```python
# ============================================================
# PARTE 2: Data Product Contract — El Concepto Central
# ============================================================

class DataProduct:
    """
    Representa un Data Product con contrato formal.
    Un Data Product es la unidad basica del Data Mesh:
    datos + SLA + documentacion + dueno.
    """

    def __init__(self, nombre, dominio, dueno_equipo):
        self.nombre        = nombre
        self.dominio       = dominio
        self.dueno         = dueno_equipo
        self.version       = "1.0.0"
        self.schema        = {}
        self.sla           = {}
        self.tags          = []
        self._metricas     = {}
        self.creado_en     = datetime.now()

    def definir_schema(self, campos):
        """
        Define el schema del data product.
        Los consumidores pueden confiar en este contrato.
        """
        self.schema = campos
        return self

    def definir_sla(self, freshness_horas, uptime_pct, quality_score_min):
        """
        SLA del data product — promesa al consumidor.
        """
        self.sla = {
            'freshness_horas':     freshness_horas,
            'uptime_pct':          uptime_pct,
            'quality_score_min':   quality_score_min,
            'medido_cada':         '15 minutos',
        }
        return self

    def registrar_metrica(self, nombre_metrica, valor):
        self._metricas[nombre_metrica] = {
            'valor': valor, 'timestamp': datetime.now().isoformat()
        }
        return self

    def evaluar_sla(self):
        """Evalua si el data product esta cumpliendo sus SLAs."""
        resultados = {}

        # Freshness: simular ultima actualizacion
        ultima_actualizacion = datetime.now() - timedelta(minutes=np.random.randint(10, 90))
        horas_desde_update   = (datetime.now() - ultima_actualizacion).seconds / 3600
        freshness_ok         = horas_desde_update <= self.sla['freshness_horas']

        # Quality score simulado
        quality_actual = round(np.random.uniform(0.88, 0.99), 4)
        quality_ok     = quality_actual >= self.sla['quality_score_min']

        # Uptime simulado
        uptime_actual  = round(np.random.uniform(0.980, 0.999), 4)
        uptime_ok      = uptime_actual >= (self.sla['uptime_pct'] / 100)

        resultados = {
            'freshness': {'actual_horas': round(horas_desde_update, 2),
                          'limite': self.sla['freshness_horas'],
                          'ok': freshness_ok},
            'quality':   {'actual': quality_actual,
                          'limite': self.sla['quality_score_min'],
                          'ok': quality_ok},
            'uptime':    {'actual': uptime_actual,
                          'limite': self.sla['uptime_pct'] / 100,
                          'ok': uptime_ok},
        }

        sla_ok = all(v['ok'] for v in resultados.values())
        return sla_ok, resultados

    def catalogo_entry(self):
        """Entrada en el catalogo de datos para otros dominios."""
        return {
            'nombre':   self.nombre,
            'dominio':  self.dominio,
            'dueno':    self.dueno,
            'version':  self.version,
            'schema':   self.schema,
            'sla':      self.sla,
            'tags':     self.tags,
            'creado':   self.creado_en.isoformat()
        }

# ============================================================
# PARTE 3: Data Mesh del Banco Pichincha Ecuador
# ============================================================

print("DATA MESH — Banco Pichincha Ecuador")
print("Dominios de negocio y sus Data Products")
print("=" * 65)

# Dominio 1: Transacciones
dp_transacciones = DataProduct(
    nombre       = "transactions_v2",
    dominio      = "Transacciones",
    dueno_equipo = "squad-transacciones@pichincha.com"
)
dp_transacciones.definir_schema({
    "transaction_id":    {"tipo": "UUID",    "nullable": False, "descripcion": "ID unico de transaccion"},
    "cedula_hash":       {"tipo": "STRING",  "nullable": False, "descripcion": "Cedula hasheada SHA-256"},
    "monto_usd":         {"tipo": "DECIMAL", "nullable": False, "descripcion": "Monto en USD"},
    "tipo_transaccion":  {"tipo": "ENUM",    "nullable": False, "valores": ["DEBITO","CREDITO","TRANSFERENCIA"]},
    "canal":             {"tipo": "ENUM",    "nullable": False, "valores": ["APP","WEB","ATM","AGENCIA"]},
    "timestamp_utc":     {"tipo": "DATETIME","nullable": False, "descripcion": "UTC — convertir a ECT para reportes"},
    "codigo_comercio":   {"tipo": "STRING",  "nullable": True,  "descripcion": "MCC del comercio destino"},
})
dp_transacciones.definir_sla(freshness_horas=1, uptime_pct=99.9, quality_score_min=0.98)
dp_transacciones.tags = ["financiero", "PII-hash", "tiempo-real", "regulado-SBS"]

# Dominio 2: Clientes
dp_clientes = DataProduct(
    nombre       = "customer_360_v1",
    dominio      = "Clientes",
    dueno_equipo = "squad-clientes@pichincha.com"
)
dp_clientes.definir_schema({
    "customer_id":   {"tipo": "UUID",   "nullable": False, "descripcion": "Golden record ID del cliente"},
    "segmento":      {"tipo": "ENUM",   "nullable": False, "valores": ["PERSONAL","PYME","CORPORATIVO"]},
    "riesgo_crediticio": {"tipo": "ENUM", "nullable": True, "valores": ["BAJO","MEDIO","ALTO"]},
    "antiguedad_años": {"tipo": "FLOAT", "nullable": False, "descripcion": "Anos como cliente"},
    "nps_score":     {"tipo": "INTEGER","nullable": True,  "descripcion": "Ultimo NPS medido"},
    "fecha_actualizacion": {"tipo": "DATE", "nullable": False},
})
dp_clientes.definir_sla(freshness_horas=24, uptime_pct=99.5, quality_score_min=0.95)
dp_clientes.tags = ["cliente", "MDM", "CRM", "PII-minimal"]

# Dominio 3: Creditos
dp_creditos = DataProduct(
    nombre       = "loan_portfolio_v3",
    dominio      = "Creditos",
    dueno_equipo = "squad-creditos@pichincha.com"
)
dp_creditos.definir_schema({
    "loan_id":         {"tipo": "UUID",   "nullable": False},
    "customer_id":     {"tipo": "UUID",   "nullable": False, "referencia": "customer_360_v1.customer_id"},
    "monto_original":  {"tipo": "DECIMAL","nullable": False},
    "saldo_pendiente": {"tipo": "DECIMAL","nullable": False},
    "dias_mora":       {"tipo": "INTEGER","nullable": False},
    "estado":          {"tipo": "ENUM",   "nullable": False, "valores": ["VIGENTE","MORA","CANCELADO","VENCIDO"]},
    "tasa_anual":      {"tipo": "DECIMAL","nullable": False},
})
dp_creditos.definir_sla(freshness_horas=4, uptime_pct=99.8, quality_score_min=0.99)
dp_creditos.tags = ["credito", "regulado-SBS", "riesgo", "financiero"]

# Evaluar SLAs de todos los data products
data_products = [dp_transacciones, dp_clientes, dp_creditos]

print("\nEVALUACION DE SLAs — Estado actual")
print(f"{'Data Product':<25} {'Freshness':>12} {'Quality':>10} {'Uptime':>10} {'Estado':>10}")
print("-" * 75)

for dp in data_products:
    sla_ok, resultado = dp.evaluar_sla()
    freshness_str = f"{resultado['freshness']['actual_horas']:.2f}h/{dp.sla['freshness_horas']}h"
    quality_str   = f"{resultado['quality']['actual']:.3f}"
    uptime_str    = f"{resultado['uptime']['actual']:.3f}"
    estado        = "OK" if sla_ok else "ALERTA"
    print(f"  {dp.nombre:<23} {freshness_str:>12} {quality_str:>10} {uptime_str:>10} {estado:>10}")

# Catalogo del mesh
print("\n\nCATALOGO DE DATA PRODUCTS — Data Mesh Pichincha")
print("=" * 65)
for dp in data_products:
    entrada = dp.catalogo_entry()
    print(f"\n  {entrada['nombre']} (v{entrada['version']})")
    print(f"    Dominio  : {entrada['dominio']}")
    print(f"    Dueno    : {entrada['dueno']}")
    print(f"    Campos   : {len(entrada['schema'])}")
    print(f"    SLA      : freshness {entrada['sla']['freshness_horas']}h, uptime {entrada['sla']['uptime_pct']}%")
    print(f"    Tags     : {', '.join(entrada['tags'])}")
```

4. Compara las arquitecturas y visualiza el modelo:

```python
# ============================================================
# PARTE 4: Data Warehouse vs Data Lake vs Data Mesh
# ============================================================

print("\nCOMPARACION DE ARQUITECTURAS")
print("=" * 65)

comparacion = pd.DataFrame({
    'Caracteristica': [
        'Quien gobierna los datos',
        'Equipo responsable',
        'Latencia para nuevo dato',
        'Cuello de botella',
        'Calidad garantizada',
        'Escalabilidad organizacional',
        'Curva de aprendizaje',
        'Apto para Ecuador (PYME)',
        'Apto para Ecuador (empresa grande)',
    ],
    'Data Warehouse': [
        'Equipo central BI',
        '5-15 personas central',
        'Semanas (ETL batch)',
        'Equipo ETL central',
        'Alta (schema rigido)',
        'Baja (cuello de botella)',
        'Media',
        'Si',
        'No (no escala)',
    ],
    'Data Lake': [
        'Equipo central data eng.',
        '10-30 personas central',
        'Horas (pipelines)',
        'Equipo data eng.',
        'Variable (data swamp)',
        'Baja (mismo problema)',
        'Alta',
        'No',
        'Parcialmente',
    ],
    'Data Mesh': [
        'Cada dominio de negocio',
        'Squads distribuidos',
        'Horas a dias (por dominio)',
        'Plataforma self-serve',
        'Alta (SLA por contrato)',
        'Alta (descentralizado)',
        'Muy Alta',
        'No (requiere madurez)',
        'Si (para 10+ dominios)',
    ],
})

print(comparacion.to_string(index=False))

# Visualizacion: cuando usar cada arquitectura
fig, axes = plt.subplots(1, 2, figsize=(13, 5))

# Radar de caracteristicas
categorias_vis = ['Escalabilidad', 'Calidad\nDatos', 'Autonomia\nDominios',
                  'Facilidad\nImplementacion', 'Consistencia\nGlobal']
arquitecturas_vis = {
    'Data Warehouse': [0.3, 0.8, 0.2, 0.9, 0.9],
    'Data Lake':      [0.5, 0.5, 0.4, 0.6, 0.6],
    'Data Mesh':      [0.9, 0.85, 0.95, 0.3, 0.8],
}

x_pos = np.arange(len(categorias_vis))
width = 0.25
colores_arq = ['#1F2F58', '#FBBC0C', '#73B8E7']

for idx, (nombre, vals) in enumerate(arquitecturas_vis.items()):
    axes[0].bar(x_pos + idx * width, vals, width, label=nombre,
                color=colores_arq[idx], alpha=0.85)

axes[0].set_xticks(x_pos + width)
axes[0].set_xticklabels(categorias_vis, fontsize=8)
axes[0].set_ylabel('Score (0-1)')
axes[0].set_title('Comparacion de Arquitecturas')
axes[0].legend(fontsize=8)
axes[0].set_ylim(0, 1.2)
axes[0].grid(True, alpha=0.3, axis='y')

# SLA dashboard de los 3 data products
nombres_dp = [dp.nombre for dp in data_products]
sla_scores  = []
for dp in data_products:
    _, resultado = dp.evaluar_sla()
    score = np.mean([1 if v['ok'] else 0 for v in resultado.values()])
    sla_scores.append(score)

cols_sla = ['#73B8E7' if s >= 0.99 else '#FBBC0C' if s >= 0.66 else '#F0846D' for s in sla_scores]
bars_sla = axes[1].bar(nombres_dp, sla_scores, color=cols_sla, width=0.5)
for b, s in zip(bars_sla, sla_scores):
    axes[1].text(b.get_x() + b.get_width()/2, b.get_height() + 0.01,
                 f'{s:.0%}', ha='center', fontsize=10, fontweight='bold')
axes[1].set_title('Cumplimiento SLA por Data Product')
axes[1].set_ylabel('% SLAs cumplidos')
axes[1].set_ylim(0, 1.25)
axes[1].tick_params(axis='x', rotation=15)
axes[1].grid(True, alpha=0.3, axis='y')

plt.suptitle('Data Mesh — Banco Pichincha Ecuador | ITSEIA P5', color='gray')
plt.tight_layout()
plt.show()
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Soy el Chief Data Officer del Ministerio de Salud del Ecuador. Tenemos 22 provincias, 50 hospitales de referencia y 1,200 unidades de salud. Cada uno tiene sus propios sistemas y nadie comparte datos con nadie. El equipo central de datos tiene 8 personas y es un cuello de botella total — los proyectos de analitica tardan 6 meses. El ministro me pide que en 12 meses mejore la disponibilidad de datos para decision. ¿Data Mesh es la solucion correcta? ¿Cuales son los prerrequisitos organizacionales que debo tener antes de implementar Data Mesh? ¿Que seria un Data Product concreto para el dominio 'Historia Clinica Unica' y cuales serian sus SLAs razonables para Ecuador?"

Despues de leer la respuesta:
- Diseña en una celda markdown el Data Product Contract para "historia_clinica_provincia" con schema, SLA, dueno y politica de acceso.
- Define cuales dominios podrian existir en el MSP Ecuador y que data products publicaria cada uno.

## Que aprendiste

- **Data Mesh** es una respuesta organizacional al cuello de botella del equipo central de datos, no una tecnologia especifica.
- El **Data Product Contract** es el elemento central: schema versionado + SLA de calidad/freshness/uptime + dueno responsable.
- La **gobernanza federada** establece los estandares que todos deben cumplir (tipo de cedula, formato de fecha, clasificacion de datos), pero deja libertad de implementacion a cada dominio.
- La infraestructura **self-serve** es el habilitador tecnico: sin ella, los dominios no pueden ser autonomos porque dependen del equipo central para cada pipeline.
- Data Mesh **no es para todos**: requiere mas de 5-8 dominios, equipos maduros, y cultura data-driven establecida. Para PYMEs ecuatorianas, un Data Warehouse bien gobernado es mas apropiado.

## Reto extra

Implementa un simulador de "Data Mesh Health Check" que evalua periodicamente el estado del mesh completo: para cada data product verifica freshness (la ultima actualizacion no supera el SLA), quality score (medido con el framework DQS de la sesion anterior), y contrato vigente (schema version no ha cambiado sin notificacion). Genera una alerta automatica cuando cualquier SLA se viola, incluyendo el nombre del equipo dueno y el tiempo que lleva violado. Simula 24 horas de operacion con eventos aleatorios de degradacion y recuperacion.
