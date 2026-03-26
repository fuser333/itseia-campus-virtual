# Ejercicio Sesion 7: Cumplimiento Regulatorio

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Implementar un sistema integral de cumplimiento regulatorio de datos para el sector financiero ecuatoriano: mapear las regulaciones aplicables (LOPDP, Res. SBS, EGSI, BCE), construir el motor de verificacion automatica de cumplimiento por regulacion, gestionar las evidencias de auditoria, y generar los reportes regulatorios que los bancos deben presentar ante la SBS — cumpliendo con los plazos y formatos establecidos.

## Contexto

Un banco mediano ecuatoriano (como el Banco del Pacifico o el Banco Internacional) debe cumplir con al menos 8 marcos regulatorios distintos relacionados con datos: LOPDP (privacidad), Resolucion SBS-2022-1447 (gobierno de datos), EGSI (seguridad informacion), BCE (reportes financieros), UAFE (anti-lavado), FATCA (reportes EE.UU.), y normas NIIF. El incumplimiento tiene multas desde $5,000 hasta $500,000 y puede resultar en intervencion de la SBS. Este ejercicio construye el sistema que un banco usa para demostrar que cumple.

## Instrucciones

1. Crea el archivo `sesion07_cumplimiento_regulatorio_ecuador.py`:

```python
# Cumplimiento Regulatorio de Datos - ITSEIA
# Gobierno de Datos y Cumplimiento
# Sector Financiero Ecuador — SBS, LOPDP, EGSI

import json
import uuid
import hashlib
import numpy as np
import pandas as pd
from datetime import datetime, date, timedelta
from collections import defaultdict
from enum import Enum
import warnings
warnings.filterwarnings("ignore")

print("=" * 65)
print("CUMPLIMIENTO REGULATORIO — BANCO PACIFICO ECUADOR")
print("LOPDP | SBS | EGSI | BCE | UAFE | FATCA")
print("=" * 65)

# ================================================
# MARCOS REGULATORIOS APLICABLES
# ================================================
print("\n--- MARCOS REGULATORIOS APLICABLES ---")

class EstadoCumplimiento(Enum):
    CUMPLE         = "CUMPLE"
    CUMPLE_PARCIAL = "CUMPLE_PARCIAL"
    NO_CUMPLE      = "NO_CUMPLE"
    EN_REVISION    = "EN_REVISION"
    EXENTO         = "EXENTO"

MARCOS_REGULATORIOS = {
    "LOPDP": {
        "nombre_completo": "Ley Organica de Proteccion de Datos Personales",
        "entidad":         "Superintendencia de Proteccion de Datos (DINARDAP transitorio)",
        "entrada_vigencia":"2021-05-26",
        "plazo_adecuacion":"2023-05-26",
        "aplica_a":        "Toda entidad que procese datos personales de ecuatorianos",
        "multa_min_usd":   5_000,
        "multa_max_usd":   500_000,
        "articulos_clave": ["Art. 7 (bases legales)", "Art. 20 (plazos retencion)",
                            "Art. 22 (derecho olvido)", "Art. 38 (DPO obligatorio)"],
        "requisitos_banco": [
            "Nombrar DPO (Data Protection Officer)",
            "Registrar actividades de tratamiento",
            "DPIA para procesos de alto riesgo",
            "Politica de privacidad publicada",
            "Mecanismo ARCO (15 dias respuesta)",
        ],
    },
    "SBS_GOBIERNO_DATOS": {
        "nombre_completo": "Resolucion SBS-2022-1447: Gobierno y Gestion de Datos",
        "entidad":         "Superintendencia de Bancos y Seguros del Ecuador",
        "entrada_vigencia":"2022-12-01",
        "plazo_adecuacion":"2024-06-01",
        "aplica_a":        "Bancos privados, mutualistas, cooperativas SFPS",
        "multa_min_usd":   10_000,
        "multa_max_usd":   300_000,
        "articulos_clave": ["Art. 4 (CDO obligatorio)", "Art. 12 (catalogo datos)",
                            "Art. 18 (calidad datos)", "Art. 25 (reportes SBS)"],
        "requisitos_banco": [
            "CDO nombrado y reportando a Directorio",
            "Catalogo de datos con 100% activos criticos",
            "Score calidad datos criticos >= 95%",
            "Reporte trimestral gobierno datos a SBS",
            "Plan de continuidad de datos aprobado",
        ],
    },
    "EGSI": {
        "nombre_completo": "Esquema Gubernamental de Seguridad de la Informacion",
        "entidad":         "MINTEL / Secretaria de Gobierno Electronico",
        "entrada_vigencia":"2013-01-01",
        "plazo_adecuacion":"Continuo — actualizacion anual",
        "aplica_a":        "Sector publico; bancos por extension SBS",
        "multa_min_usd":   0,
        "multa_max_usd":   100_000,
        "articulos_clave": ["A.5 (politicas SI)", "A.9 (control accesos)",
                            "A.12 (operaciones SI)", "A.16 (gestion incidentes)"],
        "requisitos_banco": [
            "Politica de seguridad informacion aprobada Directorio",
            "Clasificacion de informacion implementada",
            "Control de accesos basado en roles (RBAC)",
            "Gestion de incidentes de seguridad < 4h notificacion",
            "Auditorias de seguridad anuales certificadas",
        ],
    },
    "BCE_REPORTES": {
        "nombre_completo": "Normas Banco Central Ecuador — Reportes Sistema Financiero",
        "entidad":         "Banco Central del Ecuador",
        "entrada_vigencia":"2002-01-01",
        "plazo_adecuacion":"Actualizacion permanente",
        "aplica_a":        "Bancos privados y entidades financieras",
        "multa_min_usd":   1_000,
        "multa_max_usd":   50_000,
        "articulos_clave": ["Catálogo de cuentas", "Normas SIIF", "Reportes SPI/SCI"],
        "requisitos_banco": [
            "Reporte diario posicion liquidez (T+1)",
            "Balance mensual segun catalogo BCE",
            "Reporte semanal transacciones SPI/SCI",
            "Formato datos segun Manual de Supervision",
        ],
    },
    "UAFE": {
        "nombre_completo": "Unidad de Analisis Financiero y Economico — Antilavado",
        "entidad":         "UAFE Ecuador",
        "entrada_vigencia":"2016-07-29",
        "plazo_adecuacion":"Continuo",
        "aplica_a":        "Sujetos obligados — bancos, notarios, inmobiliarias",
        "multa_min_usd":   20_000,
        "multa_max_usd":   1_000_000,
        "articulos_clave": ["Art. 9 (debida diligencia)", "Art. 12 (ROS 3 dias)",
                            "Art. 18 (capacitacion)"],
        "requisitos_banco": [
            "Sistema de monitoreo transaccional automatizado",
            "ROS (Reporte de Operacion Sospechosa) en 3 dias",
            "KYC (Know Your Customer) para todos los clientes",
            "Capacitacion antilavado 100% del personal anual",
            "Oficial de cumplimiento UAFE designado",
        ],
    },
}

print(f"\n  {'Marco':<22} {'Entidad':<12} {'Multa Max':>12} {'Vigencia'}")
print(f"  {'-'*62}")
for marco, info in MARCOS_REGULATORIOS.items():
    print(f"  {marco:<22} {info['entidad'][:12]:<12} "
          f"${info['multa_max_usd']:>10,} {info['entrada_vigencia']}")

# ================================================
# MOTOR DE VERIFICACION DE CUMPLIMIENTO
# ================================================
print("\n--- MOTOR DE VERIFICACION DE CUMPLIMIENTO ---")

class EvidenciaCumplimiento:
    """Registro de evidencia de cumplimiento de un requisito regulatorio."""

    def __init__(self, marco, requisito, estado, evidencia, fecha_verificacion,
                 responsable, proxima_revision):
        self.id                = f"EV-{uuid.uuid4().hex[:6].upper()}"
        self.marco             = marco
        self.requisito         = requisito
        self.estado            = estado
        self.evidencia         = evidencia
        self.fecha_verificacion= fecha_verificacion
        self.responsable       = responsable
        self.proxima_revision  = proxima_revision
        self.hallazgos         = []
        self.plan_accion       = None

    def agregar_hallazgo(self, hallazgo, criticidad="MEDIA"):
        self.hallazgos.append({"hallazgo": hallazgo, "criticidad": criticidad,
                               "fecha": datetime.now().isoformat()})

    def asignar_plan(self, accion, responsable, fecha_limite):
        self.plan_accion = {"accion": accion, "responsable": responsable,
                            "fecha_limite": fecha_limite, "estado": "PENDIENTE"}

    def esta_vencido(self):
        return self.proxima_revision < date.today()


class MotorCumplimiento:
    """Motor central de verificacion y tracking de cumplimiento regulatorio."""

    def __init__(self, banco):
        self.banco      = banco
        self.evidencias = defaultdict(list)   # marco -> [EvidenciaCumplimiento]
        self.alertas    = []

    def registrar_evidencia(self, evidencia):
        self.evidencias[evidencia.marco].append(evidencia)
        if evidencia.estado == EstadoCumplimiento.NO_CUMPLE:
            self.alertas.append({
                "marco":     evidencia.marco,
                "requisito": evidencia.requisito[:50],
                "severidad": "CRITICA",
                "ts":        datetime.now().isoformat(),
            })

    def score_cumplimiento(self, marco):
        """Calcula score 0-1 de cumplimiento para un marco."""
        evs = self.evidencias.get(marco, [])
        if not evs:
            return 0.0
        pesos = {
            EstadoCumplimiento.CUMPLE:         1.0,
            EstadoCumplimiento.CUMPLE_PARCIAL: 0.5,
            EstadoCumplimiento.EN_REVISION:    0.3,
            EstadoCumplimiento.NO_CUMPLE:      0.0,
            EstadoCumplimiento.EXENTO:         1.0,
        }
        total = sum(pesos[e.estado] for e in evs)
        return round(total / len(evs), 3)

    def dashboard_cumplimiento(self):
        print(f"\n  DASHBOARD CUMPLIMIENTO — {self.banco}")
        print(f"  {'Marco':<22} {'Req':<5} {'Score':>8} {'Estado':<20} {'Alertas':>8}")
        print(f"  {'-'*68}")

        score_global = []
        for marco in MARCOS_REGULATORIOS:
            evs   = self.evidencias.get(marco, [])
            score = self.score_cumplimiento(marco)
            score_global.append(score)
            n_cumple = sum(1 for e in evs if e.estado == EstadoCumplimiento.CUMPLE)
            n_alerta = sum(1 for a in self.alertas if a["marco"] == marco)

            if score >= 0.90:
                estado = "CUMPLE"
            elif score >= 0.70:
                estado = "CUMPLE PARCIAL"
            else:
                estado = "NO CUMPLE"

            print(f"  {marco:<22} {len(evs):>4}  {score:>8.1%} {estado:<20} {n_alerta:>8}")

        score_total = sum(score_global) / len(score_global) if score_global else 0
        print(f"\n  Score global cumplimiento: {score_total:.1%}")
        if score_total >= 0.90:
            print(f"  Estado ITSEIA: CUMPLIMIENTO SUSTANCIAL")
        elif score_total >= 0.75:
            print(f"  Estado ITSEIA: CUMPLIMIENTO PARCIAL — plan accion requerido")
        else:
            print(f"  Estado ITSEIA: RIESGO REGULATORIO — intervencion inmediata")

        if self.alertas:
            print(f"\n  Alertas criticas ({len(self.alertas)}):")
            for a in self.alertas[:3]:
                print(f"    [{a['marco']}] {a['requisito']}")


# Crear el motor y registrar evidencias del Banco Pacifico
motor = MotorCumplimiento("Banco del Pacifico")

# LOPDP
evs_lopdp = [
    EvidenciaCumplimiento("LOPDP", "Nombrar DPO", EstadoCumplimiento.CUMPLE,
        "Ing. Maria Salinas — DPO nombrada el 2023-05-10, certificada IAPP",
        date(2024, 1, 15), "DPO", date(2024, 7, 15)),
    EvidenciaCumplimiento("LOPDP", "Registrar actividades de tratamiento",
        EstadoCumplimiento.CUMPLE_PARCIAL,
        "70% de actividades documentadas — faltan operaciones de marketing digital",
        date(2024, 1, 20), "DPO", date(2024, 4, 20)),
    EvidenciaCumplimiento("LOPDP", "DPIA para procesos alto riesgo",
        EstadoCumplimiento.CUMPLE,
        "4 DPIAs completados: scoring credito, biometria, geoloc movil, profiling",
        date(2024, 2, 1), "DPO", date(2024, 8, 1)),
    EvidenciaCumplimiento("LOPDP", "Politica de privacidad publicada",
        EstadoCumplimiento.CUMPLE,
        "Publicada en www.bancoPacifico.com/privacidad — v3.1 actualizada marzo 2024",
        date(2024, 3, 1), "DPO", date(2025, 3, 1)),
    EvidenciaCumplimiento("LOPDP", "Mecanismo ARCO 15 dias",
        EstadoCumplimiento.NO_CUMPLE,
        "Sistema ARCO existe pero tiempo promedio respuesta es 28 dias — SLA incumplido",
        date(2024, 3, 10), "DPO", date(2024, 4, 10)),
]
evs_lopdp[-1].agregar_hallazgo("Tiempo respuesta ARCO: 28 dias vs 15 dias max LOPDP", "CRITICA")
evs_lopdp[-1].asignar_plan(
    "Automatizar flujo ARCO con notificaciones y escalamiento en dias 10 y 14",
    "Gerencia TI + DPO", "2024-05-31"
)

for ev in evs_lopdp:
    motor.registrar_evidencia(ev)

# SBS GOBIERNO DATOS
evs_sbs = [
    EvidenciaCumplimiento("SBS_GOBIERNO_DATOS", "CDO nombrado",
        EstadoCumplimiento.CUMPLE,
        "Dr. Carlos Espinoza — CDO desde 2023-08-01, reporta al Directorio trimestral",
        date(2024, 1, 10), "CDO", date(2024, 7, 10)),
    EvidenciaCumplimiento("SBS_GOBIERNO_DATOS", "Catalogo datos 100% activos criticos",
        EstadoCumplimiento.CUMPLE_PARCIAL,
        "85% activos criticos documentados — faltan 12 datasets de sucursales",
        date(2024, 2, 15), "CDO", date(2024, 5, 15)),
    EvidenciaCumplimiento("SBS_GOBIERNO_DATOS", "Score calidad datos criticos >= 95%",
        EstadoCumplimiento.EN_REVISION,
        "Score actual: 91.3% — en mejora continua con plan mes a mes",
        date(2024, 3, 1), "CDO", date(2024, 6, 1)),
    EvidenciaCumplimiento("SBS_GOBIERNO_DATOS", "Reporte trimestral a SBS",
        EstadoCumplimiento.CUMPLE,
        "Q1/Q2/Q3/Q4 2023 presentados en formato SBS. Q1 2024 enviado 2024-04-05",
        date(2024, 4, 5), "CDO", date(2024, 7, 5)),
    EvidenciaCumplimiento("SBS_GOBIERNO_DATOS", "Plan continuidad datos",
        EstadoCumplimiento.CUMPLE,
        "BCP v4.2 aprobado Directorio 2024-02-15 — RPO 4h, RTO 8h",
        date(2024, 2, 15), "CDO", date(2025, 2, 15)),
]

for ev in evs_sbs:
    motor.registrar_evidencia(ev)

# UAFE (simplificado)
evs_uafe = [
    EvidenciaCumplimiento("UAFE", "Sistema monitoreo transaccional",
        EstadoCumplimiento.CUMPLE,
        "Sistema ACTIMIZE implementado 2022 — monitorea 100% transacciones",
        date(2024, 1, 1), "Oficial Cumplimiento", date(2024, 12, 31)),
    EvidenciaCumplimiento("UAFE", "ROS en 3 dias",
        EstadoCumplimiento.CUMPLE,
        "32 ROS presentados 2023 — tiempo promedio 1.8 dias. Auditado UAFE",
        date(2024, 1, 15), "Oficial Cumplimiento", date(2024, 7, 15)),
    EvidenciaCumplimiento("UAFE", "KYC todos los clientes",
        EstadoCumplimiento.CUMPLE_PARCIAL,
        "97.3% clientes con KYC completo — 1,245 cuentas en proceso actualizacion",
        date(2024, 3, 1), "Oficial Cumplimiento", date(2024, 6, 1)),
    EvidenciaCumplimiento("UAFE", "Capacitacion antilavado 100% personal",
        EstadoCumplimiento.CUMPLE,
        "98.7% personal capacitado — 32 empleados pendientes (ingresaron en marzo)",
        date(2024, 3, 15), "RRHH", date(2024, 4, 30)),
    EvidenciaCumplimiento("UAFE", "Oficial cumplimiento UAFE",
        EstadoCumplimiento.CUMPLE,
        "Dr. Roberto Nunez — Oficial de Cumplimiento certificado CAMS",
        date(2024, 1, 1), "Directorio", date(2025, 1, 1)),
]

for ev in evs_uafe:
    motor.registrar_evidencia(ev)

motor.dashboard_cumplimiento()

# ================================================
# REPORTE REGULATORIO SBS: FORMATO OFICIAL
# ================================================
print("\n--- REPORTE TRIMESTRAL SBS — GOBIERNO DE DATOS ---")

reporte_sbs = {
    "encabezado": {
        "entidad":           "Banco del Pacifico S.A.",
        "ruc":               "0990003605001",
        "periodo":           "Q1 2024 (enero-marzo)",
        "fecha_generacion":  datetime.now().strftime("%Y-%m-%d"),
        "version_formato":   "SBS-GD-2024-v2",
        "responsable":       "Dr. Carlos Espinoza — CDO",
        "aprobado_por":      "Ing. Patricia Lima — Presidenta Ejecutiva",
    },
    "indicadores_calidad": {
        "score_global":      0.913,
        "dominios": {
            "Creditos":          0.951,
            "Captaciones":       0.944,
            "Clientes":          0.921,
            "Transacciones":     0.968,
            "Garantias":         0.887,
            "Inversiones":       0.934,
        },
        "issues_abiertos":   23,
        "issues_criticos":   2,
        "sla_cumplimiento":  0.891,
    },
    "catalogo_datos": {
        "total_activos_documentados":  1_847,
        "activos_criticos_total":      234,
        "activos_criticos_documentados": 199,
        "cobertura_criticos_pct":      0.850,
        "dcrs_aprobados_trimestre":    47,
    },
    "gobierno": {
        "reuniones_comite":     3,
        "asistencia_pct":       0.87,
        "politicas_revisadas":  5,
        "stewards_activos":     12,
        "capacitacion_horas":   156,
    },
    "privacidad_lopdp": {
        "solicitudes_arco":     34,
        "respondidas_en_sla":   21,
        "tasa_cumplimiento_sla": 0.618,   # PROBLEMA DETECTADO
        "incidentes_datos":     1,
        "incidentes_notificados_sbs": 1,
    },
    "plan_mejora_q2": [
        "Automatizar flujo ARCO — meta: 100% respuesta <= 12 dias para Q2",
        "Documentar 35 activos criticos faltantes — equipo dedicado abril-mayo",
        "Mejorar score calidad Garantias: 0.887 → 0.920 con campaña limpieza datos",
        "Contratar 2 data stewards adicionales — cobertura provinciales Guayas",
    ],
}

print(f"\n  BANCO: {reporte_sbs['encabezado']['entidad']}")
print(f"  PERIODO: {reporte_sbs['encabezado']['periodo']}")
print(f"\n  INDICADORES DE CALIDAD:")
print(f"    Score global:          {reporte_sbs['indicadores_calidad']['score_global']:.1%}")
print(f"    Issues criticos:       {reporte_sbs['indicadores_calidad']['issues_criticos']}")

print(f"\n  SCORES POR DOMINIO:")
for dominio, score in reporte_sbs["indicadores_calidad"]["dominios"].items():
    barra = "#" * int(score * 20)
    estado = "OK" if score >= 0.95 else ("ALERTA" if score >= 0.85 else "CRITICO")
    print(f"    {dominio:<16}: {score:.1%} [{barra:<20}] {estado}")

print(f"\n  PRIVACIDAD LOPDP:")
print(f"    Solicitudes ARCO:  {reporte_sbs['privacidad_lopdp']['solicitudes_arco']}")
print(f"    SLA 15 dias:       "
      f"{reporte_sbs['privacidad_lopdp']['tasa_cumplimiento_sla']:.1%} "
      f"[{'INCUMPLE' if reporte_sbs['privacidad_lopdp']['tasa_cumplimiento_sla'] < 1.0 else 'OK'}]")

print(f"\n  PLAN MEJORA Q2:")
for i, item in enumerate(reporte_sbs["plan_mejora_q2"], 1):
    print(f"    {i}. {item}")

# ================================================
# CALENDAR DE VENCIMIENTOS REGULATORIOS
# ================================================
print("\n--- CALENDARIO DE VENCIMIENTOS 2024 ---")

vencimientos = [
    ("2024-04-05", "SBS_GOBIERNO_DATOS", "Reporte Q1 2024 gobierno de datos",     "COMPLETADO"),
    ("2024-04-15", "BCE_REPORTES",       "Balance mensual marzo 2024 al BCE",      "COMPLETADO"),
    ("2024-04-30", "UAFE",               "Capacitacion antilavado nuevos empleados","PENDIENTE"),
    ("2024-05-15", "LOPDP",              "Plan mejora ARCO aprobado por DPO",       "PENDIENTE"),
    ("2024-05-31", "LOPDP",              "Automatizacion ARCO implementada",        "EN_PROGRESO"),
    ("2024-06-01", "SBS_GOBIERNO_DATOS","Score calidad >= 95% — verificacion SBS",  "PENDIENTE"),
    ("2024-06-15", "UAFE",               "Actualizacion KYC cuentas pendientes",    "EN_PROGRESO"),
    ("2024-07-05", "SBS_GOBIERNO_DATOS", "Reporte Q2 2024 gobierno de datos",       "PENDIENTE"),
    ("2024-08-01", "LOPDP",              "Revision anual DPIAs — nuevos procesos",  "PENDIENTE"),
    ("2024-12-31", "EGSI",               "Auditoria anual seguridad informacion",   "PENDIENTE"),
]

hoy = date(2024, 4, 12)
print(f"\n  {'Fecha':<12} {'Marco':<22} {'Obligacion':<45} {'Estado'}")
print(f"  {'-'*95}")
for fecha_str, marco, obligacion, estado in vencimientos:
    fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
    dias  = (fecha - hoy).days
    if estado == "COMPLETADO":
        alerta = "OK"
    elif dias < 0:
        alerta = "VENCIDO"
    elif dias <= 15:
        alerta = f"URGENTE ({dias}d)"
    else:
        alerta = f"({dias}d)"

    print(f"  {fecha_str:<12} {marco:<22} {obligacion[:43]:<45} {alerta}")

print("\n" + "=" * 65)
print("CUMPLIMIENTO REGULATORIO — CONCEPTOS CLAVE:")
print("  LOPDP:        privacidad — DPO obligatorio, ARCO 15 dias, DPIA")
print("  SBS-2022-1447:gobierno datos — CDO, catalogo, calidad >= 95%")
print("  EGSI:         seguridad — clasificacion, RBAC, incidentes 4h")
print("  UAFE:         antilavado — ROS 3 dias, KYC, monitoreo 100%")
print("  Evidencia:    sin documentacion el cumplimiento no existe en auditoria")
print("  Calendario:   anticipar vencimientos — el incumplimiento cuesta $10K-$1M")
print("=" * 65)
```

3. Implementa el simulador de auditoria regulatoria SBS: genera una muestra aleatoria de 50 evidencias del banco, evalua su completitud, calcula el score de auditoria y genera el informe de hallazgos con los puntos criticos que el auditor de la SBS comunicaria en su carta de observaciones.

4. Agrega el sistema de alertas tempranas de vencimiento regulatorio: para cada obligacion pendiente, calcula los dias restantes, clasifica el riesgo (CRITICO < 15 dias, ALTO 15-30 dias, MEDIO 30-60 dias) y genera el plan de accion con responsable y acciones especificas por regulacion.

## Usa IA para...

> Abre Claude y escribe:
> "Soy el Chief Compliance Officer de un banco ecuatoriano mediano (400 empleados, $800M activos). La SBS me acaba de notificar que tenemos 90 dias para cumplir con la Resolucion 2022-1447 de Gobierno de Datos. Los 5 requisitos que nos estan fallando son: 1) no tenemos CDO nombrado, 2) el catalogo de datos existe pero solo tiene el 60% de los activos criticos, 3) el score de calidad de datos criticos es 87% (necesita 95%), 4) no hemos presentado ningun reporte trimestral a la SBS, 5) el DPO que tenemos no esta certificado. La multa por incumplimiento es $150,000 mas $10,000 por dia. ¿Que hago primero? Dame el plan de accion de 90 dias con semana a semana, los recursos que necesito, el presupuesto estimado, y como priorizo si no puedo hacer todo a la vez. Considera que el banco tiene muy poca cultura de gobierno de datos y la alta gerencia recien esta entendiendo el riesgo."

Despues de leer la respuesta:
- Implementa el rastreador de progreso de cumplimiento: dado el plan de 90 dias, simula el avance semana a semana con alertas si una tarea critica se atrasa y genera el reporte de estado para presentar al Directorio.
- Agrega el calculador de exposicion regulatoria: dados los incumplimientos actuales, calcula la multa maxima total, la multa esperada basada en probabilidad de deteccion, y el costo-beneficio de implementar cada medida de cumplimiento.

## Que aprendiste

- El cumplimiento regulatorio de datos en Ecuador tiene 5+ marcos aplicables al sector financiero con multas combinadas de millones de dolares.
- La evidencia documentada es tan importante como el cumplimiento real — sin evidencia el auditor puede sancionar aunque se cumpla.
- El calendario de vencimientos regulatorios debe gestionarse con anticipacion — reaccionar a vencimientos genera costos y errores.
- El SLA de ARCO (15 dias LOPDP) es el incumplimiento mas comun y detectable — es el primer hallazgo de cualquier auditoria.
- El score de calidad de datos tiene umbral minimo en la normativa SBS (95%) — no es solo una meta interna.
- El CDO no es un cargo opcional en bancos ecuatorianos desde 2022 — es obligatorio por resolucion SBS.

## Reto extra

Diseña e implementa el sistema de cumplimiento regulatorio para una Cooperativa de Ahorro y Credito (COAC) del segmento 1 de la SEPS Ecuador: las COACs tienen obligaciones ante la SEPS (no la SBS), la UAFE, la LOPDP, y el BCE, pero con recursos mucho menores que un banco. Implementa el modelo de cumplimiento proporcional (principio de proporcionalidad regulatoria), la automatizacion maxima de evidencias (90% automatico, 10% manual), el reporte unificado SEPS-UAFE-BCE en un solo documento para reducir carga administrativa, y el sistema de alertas que detecta automaticamente cuando una transaccion activa una obligacion regulatoria (ej: deposito > $5,000 activa protocolo UAFE).
