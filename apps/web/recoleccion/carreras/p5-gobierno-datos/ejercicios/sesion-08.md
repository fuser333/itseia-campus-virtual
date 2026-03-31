# Ejercicio Sesion 8: Proyecto — Framework de Gobierno de Datos para Empresa Ecuatoriana

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 60 min

## Objetivo

Construir un framework de gobierno de datos end-to-end para una empresa ecuatoriana mediana, integrando: evaluacion de madurez, politicas de calidad con DQS automatizado, MDM para el dominio cliente, cumplimiento LOPDP, y roadmap de implementacion con ROI calculado — entregando un programa ejecutivo listo para presentar al Directorio.

## Contexto

Tecnicentro S.A. es una cadena ecuatoriana de talleres automotrices con 35 sucursales en 12 ciudades, 180,000 clientes registrados y 15 empleados en TI. Sus datos estan en 4 sistemas: ERP (SAP), CRM (HubSpot), sistema de citas (propio), y contabilidad (Monica). El mismo cliente puede estar en los 4 sistemas con datos diferentes. No existe un responsable formal de datos, no hay politica de privacidad publicada (LOPDP), y el CEO acaba de perder una oportunidad de venta porque no sabia cuantos clientes activos tenia con vehiculos con mas de 3 anos sin servicio — los datos eran inconsistentes entre sistemas. La Junta Directiva aprobo contratar a un CDO y tiene $80,000 para el primer ano. Eres ese CDO.

## Instrucciones

El proyecto tiene cinco componentes que debes completar en orden. Crea el notebook `proyecto_gobierno_datos_tecnicentro.ipynb`.

### Componente 1: Evaluacion de Madurez Inicial

```python
# Proyecto Gobierno de Datos — Tecnicentro S.A. Ecuador
# ITSEIA - Periodo 5 - Sesion 8 (Proyecto Final)
# Estudiante: [Tu nombre]
# Fecha: [Fecha]

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import re, hashlib
from datetime import datetime, timedelta, date
from cryptography.fernet import Fernet
from collections import defaultdict

np.random.seed(42)

print("=" * 65)
print("PROGRAMA GOBIERNO DE DATOS — TECNICENTRO S.A. ECUADOR")
print("CDO Report: Evaluacion inicial y roadmap 12 meses")
print("=" * 65)

# ============================================================
# COMPONENTE 1: Evaluacion de Madurez (DMM — 5 niveles)
# ============================================================

criterios_evaluacion = {
    "Estrategia y liderazgo datos": {
        "score": 1.0, "peso": 0.20,
        "evidencia": "No hay CDO, no hay politica de datos, datos no en agenda Directorio",
        "target_12m": 3.0
    },
    "Calidad de datos": {
        "score": 1.5, "peso": 0.20,
        "evidencia": "Sin metricas de calidad, datos duplicados conocidos, sin data stewards",
        "target_12m": 3.5
    },
    "Arquitectura e integracion": {
        "score": 2.0, "peso": 0.15,
        "evidencia": "4 sistemas sin integracion, datos maestros no sincronizados",
        "target_12m": 3.0
    },
    "Seguridad y privacidad (LOPDP)": {
        "score": 1.0, "peso": 0.20,
        "evidencia": "Sin politica privacidad, sin base legal documentada, sin DPD",
        "target_12m": 4.0
    },
    "Catalogo y metadata": {
        "score": 1.0, "peso": 0.10,
        "evidencia": "Sin diccionario de datos, sin glosario de negocio",
        "target_12m": 3.0
    },
    "Datos maestros (MDM)": {
        "score": 1.5, "peso": 0.15,
        "evidencia": "Mismo cliente en 4 sistemas, sin golden record, sin MDM",
        "target_12m": 3.5
    },
}

niveles_madurez = {1: "Ad Hoc", 2: "Consciente", 3: "Proactivo",
                   4: "Gestionado", 5: "Optimizado"}

score_actual  = sum(c["score"] * c["peso"] for c in criterios_evaluacion.values())
score_target  = sum(c["target_12m"] * c["peso"] for c in criterios_evaluacion.values())

print(f"\nEVALUACION DE MADUREZ — Tecnicentro S.A.")
print(f"{'Criterio':<35} {'Score':>6} {'Meta12m':>8} {'Brecha':>8}")
print("-" * 60)
for criterio, datos in criterios_evaluacion.items():
    brecha = datos['target_12m'] - datos['score']
    print(f"  {criterio:<33} {datos['score']:>6.1f} {datos['target_12m']:>8.1f} {brecha:>+8.1f}")

print(f"\n  SCORE ACTUAL : {score_actual:.2f} / 5.00  — Nivel {int(score_actual)} ({niveles_madurez[int(score_actual)]})")
print(f"  SCORE TARGET : {score_target:.2f} / 5.00  — Nivel {int(score_target)} ({niveles_madurez[int(score_target)]})")
print(f"  MEJORA ESPERADA: +{score_target-score_actual:.2f} puntos en 12 meses")
```

### Componente 2: DQS del Dataset de Clientes

```python
# ============================================================
# COMPONENTE 2: Medir Calidad del Dataset de Clientes
# ============================================================

# Generar dataset de clientes Tecnicentro con problemas reales
N = 1000

clientes_df = pd.DataFrame({
    "cedula":          [f"17{i:08d}" for i in range(N)],
    "nombre":          [f"Cliente_{i:04d}" for i in range(N)],
    "email":           [f"cliente{i}@gmail.com" for i in range(N)],
    "telefono":        [f"09{np.random.randint(10000000, 99999999)}" for _ in range(N)],
    "ciudad":          np.random.choice(['Quito', 'Guayaquil', 'Cuenca',
                                          'Ambato', 'Manta'], N),
    "marca_vehiculo":  np.random.choice(['Toyota', 'Chevrolet', 'Kia',
                                          'Mazda', 'Hyundai', 'Volkswagen'], N),
    "ultimo_servicio": pd.to_datetime([
        (datetime.now() - timedelta(days=np.random.randint(30, 1095))).date()
        for _ in range(N)
    ]),
    "valor_historico_usd": np.random.lognormal(5.5, 0.8, N).round(2),
})

# Introducir errores tipicos de un CRM ecuatoriano
for i in np.random.choice(N, 120, replace=False):
    clientes_df.loc[i, 'email'] = np.nan
for i in np.random.choice(N, 80, replace=False):
    clientes_df.loc[i, 'telefono'] = np.nan
for i in np.random.choice(N, 20, replace=False):
    clientes_df.loc[i, 'cedula'] = clientes_df.loc[np.random.randint(0, i+1), 'cedula']
for i in np.random.choice(N, 25, replace=False):
    clientes_df.loc[i, 'email'] = "sinArrobaEmail.ec"
for i in np.random.choice(N, 15, replace=False):
    clientes_df.loc[i, 'valor_historico_usd'] = -abs(clientes_df.loc[i, 'valor_historico_usd'])

print(f"\nDataset Clientes Tecnicentro: {len(clientes_df)} registros")

# Framework DQS (reutilizando conceptos de sesion 4)
def calcular_dqs_tecnicentro(df):
    n = len(df)
    patron_email = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

    completitud = np.mean([
        df['cedula'].notna().sum() / n,
        df['nombre'].notna().sum() / n,
        df['email'].notna().sum() / n,
        df['telefono'].notna().sum() / n,
    ])

    unicidad = df['cedula'].nunique() / n

    emails_ok = (df['email'].dropna()
                 .apply(lambda x: bool(re.match(patron_email, str(x)))).mean())
    cedulas_ok = (df['cedula'].astype(str)
                  .apply(lambda x: len(x.strip()) == 10 and x.strip().isdigit()).mean())
    validez = np.mean([emails_ok, cedulas_ok])

    exactitud = (df['valor_historico_usd'] > 0).mean()

    al_menos_contacto = (df['email'].notna() | df['telefono'].notna()).mean()
    consistencia = al_menos_contacto

    pesos = {'completitud': 0.30, 'unicidad': 0.25, 'validez': 0.20,
             'exactitud': 0.15, 'consistencia': 0.10}

    scores = {'completitud': completitud, 'unicidad': unicidad,
              'validez': validez, 'exactitud': exactitud, 'consistencia': consistencia}
    dqs = sum(pesos[d] * scores[d] for d in pesos)
    return scores, dqs

scores, dqs = calcular_dqs_tecnicentro(clientes_df)
nivel_dqs = "EXCELENTE" if dqs > 0.90 else "BUENO" if dqs > 0.80 else "ACEPTABLE" if dqs > 0.70 else "DEFICIENTE"

print(f"\nDQS CLIENTES TECNICENTRO")
print(f"{'Dimension':<15}: {'Score':>8}   {'Estado':>10}")
print("-" * 40)
for dim, s in scores.items():
    estado = "CRITICO" if s < 0.70 else "ALERTA" if s < 0.85 else "OK"
    print(f"  {dim:<15}: {s:>8.2%}   {estado:>10}")
print(f"\n  DQS GLOBAL: {dqs:.2%}  ({nivel_dqs})")
print(f"  Registros en riesgo: ~{int((1-dqs)*N)}")
```

### Componente 3: Golden Record de Clientes (MDM)

```python
# ============================================================
# COMPONENTE 3: Golden Record — MDM Clientes Tecnicentro
# ============================================================

# Simular el mismo cliente en los 4 sistemas
cliente_master = {
    'SAP_ERP': {
        'id': 'SAP-C-004521', 'cedula': '1712345678',
        'nombre': 'MARIA ELENA TORRES SALAZAR',
        'email': 'metorres@empresa.com', 'telefono': '099-456-7890',
        'ciudad': 'Quito', 'fecha_reg': '2018-03-15'
    },
    'HubSpot_CRM': {
        'id': 'HS-78432', 'cedula': '1712345678',
        'nombre': 'Maria Torres',               # Nombre incompleto
        'email': 'metorres@empresa.com', 'telefono': '0994567890',
        'ciudad': 'Quito', 'fecha_reg': '2019-07-22'
    },
    'Sistema_Citas': {
        'id': 'CIT-12901', 'cedula': '171234567 8',  # Espacio en cedula
        'nombre': 'maria elena torres s.',
        'email': None, 'telefono': '099 456 78 90',
        'ciudad': 'QUITO', 'fecha_reg': '2020-01-10'
    },
    'Monica_Contabilidad': {
        'id': 'MON-3344', 'cedula': '1712345678',
        'nombre': 'Torres Salazar Maria Elena',  # Orden invertido
        'email': 'metorres@empresa.com', 'telefono': '022345678',  # Telefono convencional
        'ciudad': 'Quito', 'fecha_reg': '2018-04-01'
    },
}

TRUST = {
    'SAP_ERP':             {'cedula': 1.0, 'nombre': 0.9, 'email': 1.0, 'telefono': 0.9, 'fecha': 1.0},
    'HubSpot_CRM':         {'cedula': 1.0, 'nombre': 0.7, 'email': 0.95,'telefono': 0.85,'fecha': 0.8},
    'Sistema_Citas':       {'cedula': 0.6, 'nombre': 0.6, 'email': 0.3, 'telefono': 0.7, 'fecha': 0.7},
    'Monica_Contabilidad': {'cedula': 1.0, 'nombre': 0.8, 'email': 0.9, 'telefono': 0.5, 'fecha': 0.9},
}

def norm_cedula(v):
    return str(v).replace(' ', '').replace('-', '').strip() if v else None

def norm_nombre(v):
    return ' '.join(str(v).upper().strip().split()) if v else None

def norm_tel(v):
    if not v: return None
    t = str(v).replace(' ','').replace('-','')
    return t if len(t) == 10 else None

golden_record = {}
campos_trust = {'cedula': 'cedula', 'nombre': 'nombre',
                'email': 'email', 'telefono': 'telefono'}

for campo, trust_key in campos_trust.items():
    candidatos = []
    for sistema, datos in cliente_master.items():
        val = datos.get(campo)
        if val:
            if campo == 'cedula':   val = norm_cedula(val)
            elif campo == 'nombre': val = norm_nombre(val)
            elif campo == 'telefono': val = norm_tel(val)
            if val:
                candidatos.append((val, TRUST[sistema][trust_key], sistema))

    if candidatos:
        mejor = max(candidatos, key=lambda x: x[1])
        golden_record[campo] = {'valor': mejor[0], 'fuente': mejor[2], 'confianza': mejor[1]}

# Fecha: tomar la mas antigua
fechas = [(datos['fecha_reg'], sistema) for sistema, datos in cliente_master.items()]
fecha_min = min(fechas, key=lambda x: x[0])
golden_record['primer_registro'] = {'valor': fecha_min[0], 'fuente': fecha_min[1], 'confianza': 0.95}

print(f"\nGOLDEN RECORD — Maria Elena Torres")
print("=" * 55)
for campo, datos in golden_record.items():
    print(f"  {campo:<20}: {datos['valor']:<35} [fuente: {datos['fuente']}, trust: {datos['confianza']:.0%}]")
```

### Componente 4: Compliance LOPDP y Presupuesto

```python
# ============================================================
# COMPONENTE 4: Compliance LOPDP + Presupuesto CDO
# ============================================================

# Estado de compliance LOPDP para Tecnicentro
compliance_items = {
    "Politica de privacidad publicada":    {'estado': 'FALTANTE', 'riesgo': 'ALTO',  'plazo_dias': 30},
    "Aviso de privacidad en formularios":  {'estado': 'FALTANTE', 'riesgo': 'ALTO',  'plazo_dias': 45},
    "DPD nombrado (Art. 28 LOPDP)":       {'estado': 'FALTANTE', 'riesgo': 'MEDIO', 'plazo_dias': 60},
    "Registro de Actividades (RAT)":       {'estado': 'FALTANTE', 'riesgo': 'ALTO',  'plazo_dias': 90},
    "Consentimientos de marketing":        {'estado': 'INCOMPLETO','riesgo': 'ALTO', 'plazo_dias': 45},
    "Proceso derechos ARCO":               {'estado': 'FALTANTE', 'riesgo': 'ALTO',  'plazo_dias': 60},
    "Medidas tecnicas seguridad (cifrado)": {'estado': 'INCOMPLETO', 'riesgo': 'MEDIO', 'plazo_dias': 120},
    "Contrato encargados de tratamiento":  {'estado': 'FALTANTE', 'riesgo': 'MEDIO', 'plazo_dias': 90},
}

# Facturacion Tecnicentro estimada: $8M/ano
# Multa max LOPDP: 2% facturacion = $160,000
facturacion_anual = 8_000_000
multa_maxima      = facturacion_anual * 0.02

print(f"\nCOMPLIANCE LOPDP — Tecnicentro S.A.")
print(f"Multa maxima potencial: ${multa_maxima:,.0f}")
print(f"{'Requisito LOPDP':<45} {'Estado':>12} {'Plazo':>10}")
print("-" * 70)

items_compliance = [
    ("Politica de privacidad publicada",      "FALTANTE",   30),
    ("Aviso privacidad en formularios web",   "FALTANTE",   45),
    ("DPD nombrado (Art. 28 LOPDP)",          "FALTANTE",   60),
    ("Registro de Actividades RAT",           "FALTANTE",   90),
    ("Consentimientos email marketing",       "INCOMPLETO", 45),
    ("Proceso de derechos ARCO",              "FALTANTE",   60),
    ("Cifrado datos sensibles",               "INCOMPLETO", 120),
    ("Contratos encargados tratamiento",      "FALTANTE",   90),
]

for req, estado, dias in items_compliance:
    icon = "CRITICO" if estado == "FALTANTE" else "ALERTA"
    print(f"  [{icon}] {req:<43} {estado:>12}   {dias} dias")

# Presupuesto CDO $80,000 / ano
print(f"\nPRESUPUESTO CDO — $80,000 primer ano")
print("-" * 50)
presupuesto = [
    ("Herramienta catalogo datos (DataHub OSS)", 0),
    ("Herramienta DQ automatica (Great Expectations)", 0),
    ("Consultoria legal LOPDP (3 meses)", 8_000),
    ("Capacitacion equipo (workshops 2)", 3_000),
    ("Salario Data Steward (12 meses)", 18_000),
    ("Herramienta MDM (Talend Community)", 0),
    ("Infraestructura (nube, pipelines)", 12_000),
    ("Auditoria LOPDP externa (1 vez)", 6_000),
    ("CDO salario propio (incluido en directivos)", 0),
    ("Contingencias (15%)", 0),
]
total_hard = sum(v for _, v in presupuesto)
contingencias = int(total_hard * 0.15)
total = total_hard + contingencias

for item, costo in presupuesto:
    if costo > 0:
        print(f"  {item:<50}: ${costo:>8,}")
print(f"  {'Contingencias (15%)':<50}: ${contingencias:>8,}")
print(f"  {'TOTAL':<50}: ${total:>8,}")
print(f"  {'Saldo disponible':<50}: ${80_000 - total:>8,}")
```

### Componente 5: Roadmap 12 Meses y ROI

```python
# ============================================================
# COMPONENTE 5: Roadmap 12 Meses + ROI + Dashboard Ejecutivo
# ============================================================

roadmap = {
    "Fase 1 — Fundacion (Meses 1-3)": {
        "presupuesto_k": 15,
        "hitos": [
            "Inventario completo de activos de datos (ERP, CRM, Citas, Contabilidad)",
            "Evaluacion DQS baseline publicada al Directorio",
            "Politica de privacidad LOPDP publicada en web",
            "DPD nombrado y notificado a la ADPP",
            "Comite de datos formado (CDO + 4 data stewards departamentales)",
        ],
        "kpi_meta": {"DQS": "Medir baseline", "LOPDP_items_ok": 3, "Duplicados_conocidos": "Mapear"}
    },
    "Fase 2 — Visibilidad (Meses 4-7)": {
        "presupuesto_k": 25,
        "hitos": [
            "Golden Record para 180,000 clientes (MDM Fase 1)",
            "DQS automatizado con alertas semanales",
            "Catalogo de datos: 50 datasets documentados",
            "Proceso ARCO operativo con SLA 15 dias habiles",
            "RAT (Registro Actividades Tratamiento) completo",
        ],
        "kpi_meta": {"DQS": "> 85%", "LOPDP_items_ok": 7, "Duplicados_conocidos": "< 2%"}
    },
    "Fase 3 — Control (Meses 8-12)": {
        "presupuesto_k": 35,
        "hitos": [
            "Integracion SAP-HubSpot-Citas: vista 360 cliente en tiempo real",
            "Dashboard ventas con datos confiables (campana reactivacion vehiculos >3 anos)",
            "Auditoria LOPDP externa superada",
            "Score de madurez = 3.5 (Proactivo)",
            "Primer informe gobierno datos al Directorio",
        ],
        "kpi_meta": {"DQS": "> 92%", "LOPDP_items_ok": 8, "Clientes_360": "100%"}
    }
}

# ROI del programa
print("\nANALISIS DE ROI — Programa Gobierno de Datos")
print("=" * 55)

beneficios_anuales = {
    "Campana reactivacion clientes (vehiculos >3 anos sin servicio)":
        {'valor': 45_000, 'descripcion': "5% de 9,000 clientes inactivos x $100 servicio promedio"},
    "Reduccion errores facturacion SAP (datos sucios)":
        {'valor': 12_000, 'descripcion': "80h/mes x $12.5/h ingeniero + multas contables evitadas"},
    "Evitar multa LOPDP (compliance preventivo)":
        {'valor': 80_000, 'descripcion': "50% del riesgo de multa maxima $160K evitado"},
    "Reduccion tiempo analitica (de 3 semanas a 3 dias)":
        {'valor': 18_000, 'descripcion': "2 analistas x 40h/mes ahorradas x $12.5/h x 12 meses"},
    "Reduccion duplicados en envios marketing":
        {'valor': 6_000, 'descripcion': "20% reduccion costo email marketing por lista limpia"},
}

total_beneficios = sum(b['valor'] for b in beneficios_anuales.values())
costo_programa   = total  # de la celda anterior

roi = (total_beneficios - costo_programa) / costo_programa * 100
payback_meses = (costo_programa / total_beneficios) * 12

print(f"{'Beneficio':<55} {'Valor USD':>10}")
print("-" * 68)
for nombre, datos in beneficios_anuales.items():
    print(f"  {nombre[:53]:<53}: ${datos['valor']:>8,}")
print(f"\n  {'TOTAL BENEFICIOS ANUALES':<53}: ${total_beneficios:>8,}")
print(f"  {'COSTO PROGRAMA':<53}: ${costo_programa:>8,}")
print(f"\n  ROI                   : {roi:.0f}%")
print(f"  Payback               : {payback_meses:.1f} meses")
print(f"  Recomendacion         : {'APROBAR' if roi > 100 else 'EVALUAR'} el programa")

# Dashboard ejecutivo final
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Panel 1: Madurez actual vs target
categorias_mad = list(criterios_evaluacion.keys())
scores_actuales = [criterios_evaluacion[c]['score'] for c in categorias_mad]
scores_target12 = [criterios_evaluacion[c]['target_12m'] for c in categorias_mad]
x = np.arange(len(categorias_mad))
w = 0.35
ax1 = axes[0][0]
ax1.bar(x - w/2, scores_actuales, w, label='Actual', color='#F0846D', alpha=0.85)
ax1.bar(x + w/2, scores_target12, w, label='Target 12m', color='#73B8E7', alpha=0.85)
ax1.set_xticks(x)
ax1.set_xticklabels([c[:15] for c in categorias_mad], rotation=25, ha='right', fontsize=7)
ax1.set_ylabel('Nivel de Madurez (1-5)')
ax1.set_title('Madurez: Actual vs Target 12 meses')
ax1.legend()
ax1.set_ylim(0, 5.5)
ax1.grid(True, alpha=0.3, axis='y')

# Panel 2: DQS por dimension
dims_vis = list(scores.keys())
sc_vis   = list(scores.values())
cols_vis = ['#F0846D' if s < 0.70 else '#FBBC0C' if s < 0.85 else '#73B8E7' for s in sc_vis]
brs = axes[0][1].barh(dims_vis, sc_vis, color=cols_vis, height=0.5)
axes[0][1].axvline(0.85, color='#1F2F58', linestyle='--', lw=1.5)
for b, s in zip(brs, sc_vis):
    axes[0][1].text(s + 0.01, b.get_y() + b.get_height()/2,
                    f'{s:.0%}', va='center', fontsize=9)
axes[0][1].set_xlim(0, 1.1)
axes[0][1].set_title(f'DQS Clientes: {dqs:.1%} ({nivel_dqs})')
axes[0][1].grid(True, alpha=0.3, axis='x')

# Panel 3: Compliance LOPDP
items_vis = [req for req, _, _ in items_compliance]
estados_vis = [1 if est == "CUMPLIDO" else 0.5 if est == "INCOMPLETO" else 0
               for _, est, _ in items_compliance]
cols_comp = ['#73B8E7' if v == 1 else '#FBBC0C' if v == 0.5 else '#F0846D' for v in estados_vis]
axes[1][0].barh([i[:30] for i in items_vis], estados_vis, color=cols_comp, height=0.5)
axes[1][0].set_xlim(0, 1.3)
axes[1][0].set_title('Estado Compliance LOPDP')
axes[1][0].axvline(1.0, color='#1F2F58', linestyle='--', lw=1.5)
axes[1][0].grid(True, alpha=0.3, axis='x')

# Panel 4: ROI waterfall
categorias_roi = list(beneficios_anuales.keys())
valores_roi    = [b['valor'] for b in beneficios_anuales.values()]
colores_roi    = ['#73B8E7'] * len(valores_roi) + ['#F0846D']
labels_roi     = [c[:20] for c in categorias_roi] + ['COSTO PROGRAMA']
vals_completos = valores_roi + [-costo_programa]
axes[1][1].barh(labels_roi, vals_completos,
                color=['#73B8E7'] * len(valores_roi) + ['#F0846D'])
axes[1][1].axvline(0, color='gray', linewidth=0.8)
axes[1][1].set_title(f'ROI Programa: {roi:.0f}% | Payback: {payback_meses:.1f} meses')
axes[1][1].set_xlabel('USD')
axes[1][1].grid(True, alpha=0.3, axis='x')

plt.suptitle('Dashboard Ejecutivo — Gobierno de Datos Tecnicentro S.A. | ITSEIA P5',
             color='gray', fontsize=11)
plt.tight_layout()
plt.show()

# Resumen ejecutivo final
print("\nRESUMEN EJECUTIVO — Para presentar al Directorio")
print("=" * 65)
print(f"Madurez actual  : {score_actual:.1f}/5 (Ad Hoc) → Target: {score_target:.1f}/5 (Proactivo) en 12 meses")
print(f"DQS clientes    : {dqs:.1%} ({nivel_dqs}) — {int((1-dqs)*N)} registros con riesgo")
print(f"LOPDP compliance: {len([i for _,e,_ in items_compliance if e=='CUMPLIDO'])}/{len(items_compliance)} items ok — multa potencial ${multa_maxima:,}")
print(f"Presupuesto 1er ano: ${total:,} (de $80,000 disponibles — ${80_000-total:,} reserva)")
print(f"ROI proyectado  : {roi:.0f}% — recuperacion en {payback_meses:.1f} meses")
print(f"\nDecision recomendada: APROBAR programa y contratar Data Steward inmediatamente")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy el CDO de Tecnicentro S.A., cadena de talleres automotrices con 35 sucursales en Ecuador. Mi programa de gobierno de datos tiene DQS inicial de [tu resultado], ROI proyectado de [tu resultado]% y necesita $[tu resultado] en presupuesto. Tengo que presentar esto al Directorio en 15 minutos. Los directores no saben de datos. Dame: (1) los 3 argumentos mas convincentes para un CEO que solo habla de ventas y margen, (2) los 3 riesgos mas concretos si NO aprueban el programa (en dolares y en clientes perdidos), (3) la diapositiva de titulo y la de 'next steps' para mi presentacion. Usa lenguaje de negocio, cero tecnicismos."

Despues de leer la respuesta:
- Agrega una celda markdown con el pitch de 2 minutos que darias al Directorio.
- Define los 3 KPIs que reportarias trimestralmente y por que esos 3 y no otros.

## Que aprendiste

- Un **programa de gobierno de datos** integra calidad (DQS), MDM (golden record), LOPDP (compliance) y arquitectura (Data Mesh) en un framework cohesivo con ROI demostrable.
- La **evaluacion de madurez** es el primer paso obligatorio: sin linea de base, no puedes demostrar mejora ni justificar inversion.
- El **ROI del gobierno de datos** en Ecuador se construye sobre tres pilares: beneficios comerciales (ventas), reduccion de riesgos (multas LOPDP), y eficiencia operativa (menos tiempo en limpieza manual).
- Un CDO en Ecuador necesita hablar el lenguaje del **CEO y del Directorio**: traduce DQS y madurez a pesos y clientes, no a metricas tecnicas.
- El **payback** del programa en una empresa mediana ecuatoriana es tipicamente de 6 a 10 meses, lo que hace el caso de inversion robusto.

## Reto extra

Extiende el proyecto para incluir un **sistema de monitoreo continuo**: cada lunes a las 6 AM, el sistema ejecuta automaticamente el DQS de los 4 datasets criticos (clientes, vehiculos, servicios, facturacion), genera un reporte de semaforo por email al CDO y data stewards, y registra el score historico en una tabla para graficar la tendencia mensual. Simula 12 semanas de operacion con mejora gradual del DQS (de 78% a 93%) e incluye 2 eventos de degradacion (un batch de datos malos) con su deteccion y recuperacion.
