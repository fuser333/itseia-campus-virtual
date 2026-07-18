# Ejercicio Sesion 1: Marco de Gobierno de Datos

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Disenar e implementar un Marco de Gobierno de Datos para una institucion publica ecuatoriana: estructura organizacional, politicas, procesos, metricas de madurez y plan de implementacion — siguiendo los frameworks DAMA-DMBOK y el Esquema Gubernamental de Seguridad de la Informacion (EGSI) del Ecuador.

## Contexto

El Ministerio de Salud Publica del Ecuador maneja datos de 18 millones de ecuatorianos en su Historia Clinica Unica (HCU). Sin un Marco de Gobierno de Datos, estos datos son inconsistentes entre provincias, no hay un responsable claro de la calidad, y la integracion con el IESS y el sector privado es un caos. El DAMA-DMBOK es el estandar global de gobierno de datos — adaptarlo al contexto ecuatoriano con el EGSI garantiza cumplimiento regulatorio y mejora la calidad de los datos de salud.

## Instrucciones

1. Crea el archivo `sesion01_marco_gobierno_datos_ecuador.py`:

```python
# Marco de Gobierno de Datos - ITSEIA
# Gobierno de Datos y Cumplimiento
# MSP Ecuador — DAMA-DMBOK + EGSI

import json
import numpy as np
import pandas as pd
from datetime import datetime
import warnings
warnings.filterwarnings("ignore")

print("=" * 65)
print("MARCO DE GOBIERNO DE DATOS — MSP ECUADOR")
print("DAMA-DMBOK + EGSI")
print("=" * 65)

# ================================================
# DAMA-DMBOK: 11 AREAS DE CONOCIMIENTO
# ================================================
print("\n--- DAMA-DMBOK: 11 AREAS DE CONOCIMIENTO ---")

dama_areas = {
    "Data Governance":        {
        "descripcion": "Organizacion, politicas, procesos y metricas para el gobierno",
        "rol_lider":   "Chief Data Officer (CDO)",
        "entregables": ["Politica de datos", "Comite de gobierno", "RACI"],
    },
    "Data Architecture":      {
        "descripcion": "Modelo arquitectonico de datos: diagramas, estandares, roadmap",
        "rol_lider":   "Chief Data Architect",
        "entregables": ["Modelo entidad-relacion", "Arquitectura referencia", "Estandares"],
    },
    "Data Modeling & Design": {
        "descripcion": "Modelado logico y fisico, patrones de diseno de BD",
        "rol_lider":   "Data Modeler",
        "entregables": ["Modelos ER", "Diccionario de datos", "Ontologias"],
    },
    "Data Storage & Ops":     {
        "descripcion": "Administracion de bases de datos, performance, backup",
        "rol_lider":   "Database Administrator",
        "entregables": ["SLAs de disponibilidad", "Plan backup/recovery"],
    },
    "Data Security":          {
        "descripcion": "Clasificacion de datos, acceso, cifrado, auditoria",
        "rol_lider":   "Chief Information Security Officer",
        "entregables": ["Clasificacion de datos", "Politica acceso", "Audit log"],
    },
    "Data Integration":       {
        "descripcion": "ETL/ELT, APIs, interoperabilidad entre sistemas",
        "rol_lider":   "Data Integration Architect",
        "entregables": ["Mapa de integraciones", "API standards", "MDM"],
    },
    "Data Quality":           {
        "descripcion": "Perfiles de calidad, reglas, limpieza, monitoreo",
        "rol_lider":   "Data Quality Manager",
        "entregables": ["Reglas de calidad", "Dashboard calidad", "SLA calidad"],
    },
    "Master & Reference Data":{
        "descripcion": "Datos maestros: paciente unico, proveedor unico, etc.",
        "rol_lider":   "MDM Steward",
        "entregables": ["Golden record", "Catálogos de referencia"],
    },
    "Data Warehousing & BI":  {
        "descripcion": "DW, data marts, reportes, dashboards para decision",
        "rol_lider":   "BI Manager",
        "entregables": ["DW HCU", "Dashboards MSP", "Reportes SENESCYT"],
    },
    "Metadata Management":    {
        "descripcion": "Catalogo de datos, lineage, glosario de negocio",
        "rol_lider":   "Data Catalog Manager",
        "entregables": ["Catalogo datos.gob.ec", "Glosario HCU", "Lineage"],
    },
    "Document & Content Mgmt":{
        "descripcion": "Gestion documental, imagenes medicas, informes",
        "rol_lider":   "Records Manager",
        "entregables": ["Politica retencion", "Sistema GED", "PACS imagenes"],
    },
}

for area, info in dama_areas.items():
    print(f"\n  [{area}]")
    print(f"    Descripcion: {info['descripcion']}")
    print(f"    Lider:       {info['rol_lider']}")

# ================================================
# MODELO DE MADUREZ: CMMI-DMM
# ================================================
print("\n--- MODELO DE MADUREZ DE DATOS (CMM-DM) ---")

niveles_madurez = {
    1: {
        "nombre": "Ad Hoc",
        "descripcion": "Sin procesos formales — cada area hace lo suyo",
        "sintomas": ["Datos en Excel personales","Sin dueno de dato","Calidad desconocida"],
        "MSP_actual": True,
    },
    2: {
        "nombre": "Consciente",
        "descripcion": "Algunos procesos documentados, pero no estandarizados",
        "sintomas": ["Politica de datos basica","Pocos data stewards","Catalogo parcial"],
        "MSP_actual": False,
    },
    3: {
        "nombre": "Proactivo",
        "descripcion": "Procesos estandarizados, CDO nombrado, metricas de calidad",
        "sintomas": ["CDO activo","Catalogo completo","SLA calidad cumplido"],
        "MSP_actual": False,
    },
    4: {
        "nombre": "Gestionado",
        "descripcion": "Gobierno basado en metricas, mejora continua",
        "sintomas": ["KPIs gobierno","Automatizacion calidad","MDM maduro"],
        "MSP_actual": False,
    },
    5: {
        "nombre": "Optimizado",
        "descripcion": "Datos como activo estrategico, IA sobre datos gobernados",
        "sintomas": ["Data monetization","IA/ML sobre datos limpios","Benchmarking"],
        "MSP_actual": False,
    },
}

print(f"\n  {'Nivel':>6} {'Nombre':<16} {'Descripcion':<45} {'MSP Actual'}")
print(f"  {'-'*75}")
for nivel, info in niveles_madurez.items():
    actual = "<-- AQUI" if info["MSP_actual"] else ""
    print(f"  {nivel:>6} {info['nombre']:<16} {info['descripcion']:<45} {actual}")

print(f"\n  Target MSP 2026: Nivel 3 (Proactivo)")
print(f"  Meta 2028:       Nivel 4 (Gestionado)")

# ================================================
# ESTRUCTURA ORGANIZACIONAL: COMITE DE GOBIERNO
# ================================================
print("\n--- ESTRUCTURA ORGANIZACIONAL ---")

comite_gobierno = {
    "Consejo de Datos (Estratégico)": {
        "miembros":     ["Ministro MSP (Patrocinador)","CDO MSP","CIO MSP",
                         "Director Finanzas","Director RRHH","Director Planificacion"],
        "frecuencia":   "Trimestral",
        "decisiones":   ["Presupuesto gobierno datos","Prioridades estrategicas",
                         "Aprobacion politicas maestras"],
    },
    "Comite de Calidad de Datos (Tactico)": {
        "miembros":     ["CDO (Presidente)","Data Quality Manager","Data Stewards zonales",
                         "Representantes provinciales (22)"],
        "frecuencia":   "Mensual",
        "decisiones":   ["Metricas de calidad","Resoluciones de conflicto de datos",
                         "Aprobacion reglas de negocio"],
    },
    "Grupo de Data Stewards (Operativo)": {
        "miembros":     ["Data Stewards por dominio (Salud, RRHH, Finanzas, Infraestructura)",
                         "Coordinadores TI provinciales"],
        "frecuencia":   "Semanal",
        "decisiones":   ["Limpieza de datos","Resoluciones tecnicas","Documentacion"],
    },
}

for organo, info in comite_gobierno.items():
    print(f"\n  [{organo}]")
    print(f"    Frecuencia: {info['frecuencia']}")
    print(f"    Decisiones: {', '.join(info['decisiones'][:2])}...")

# ================================================
# EVALUACION DE MADUREZ ACTUAL: MSP ECUADOR
# ================================================
print("\n--- EVALUACION MADUREZ ACTUAL: MSP ---")

criterios_evaluacion = {
    "Estrategia y liderazgo":       {"score": 1.5, "peso": 0.20},
    "Arquitectura de datos":        {"score": 1.0, "peso": 0.15},
    "Calidad de datos":             {"score": 1.5, "peso": 0.20},
    "Seguridad y privacidad":       {"score": 2.0, "peso": 0.15},
    "Catalogo y metadata":          {"score": 1.0, "peso": 0.10},
    "Datos maestros":               {"score": 1.5, "peso": 0.10},
    "Procesos y politicas":         {"score": 1.5, "peso": 0.10},
}

score_total = sum(c["score"] * c["peso"] for c in criterios_evaluacion.values())

print(f"\n  {'Criterio':<35} {'Score':>6} {'Peso':>6} {'Contribucion':>14}")
print(f"  {'-'*65}")
for criterio, datos in criterios_evaluacion.items():
    contrib = datos["score"] * datos["peso"]
    barra   = "#" * int(datos["score"] * 4)
    print(f"  {criterio:<35} {datos['score']:>6.1f} {datos['peso']:>6.0%} "
          f"{contrib:>14.3f}")

print(f"\n  Score global MSP:        {score_total:.2f} / 5.00")
print(f"  Nivel de madurez:        {int(score_total)} (Nivel {int(score_total)} - {list(niveles_madurez.values())[int(score_total)-1]['nombre']})")

# ================================================
# ROADMAP DE IMPLEMENTACION
# ================================================
print("\n--- ROADMAP DE IMPLEMENTACION (18 MESES) ---")

roadmap = {
    "Fase 1 (0-3 meses)": {
        "objetivo":    "Fundacion — quienes somos en datos",
        "hitos": [
            "Nombrar CDO del MSP",
            "Inventario de activos de datos (350+ datasets)",
            "Clasificacion inicial de datos por sensibilidad",
            "Conformar Comite de Gobierno de Datos",
        ],
        "inversion_k": 120,
        "equipo":      "2 consultores + 1 CDO interno",
    },
    "Fase 2 (3-9 meses)": {
        "objetivo":    "Visibilidad — saber donde estan y como estan",
        "hitos": [
            "Catalogo de datos HCU (20,000+ elementos documentados)",
            "Perfiles de calidad automaticos en 50 datasets criticos",
            "Glosario de negocio HCU (500+ terminos)",
            "Data Lineage de reportes criticos PAHO",
        ],
        "inversion_k": 280,
        "equipo":      "5 data stewards + herramienta catalogo",
    },
    "Fase 3 (9-18 meses)": {
        "objetivo":    "Control — mejorar y mantener",
        "hitos": [
            "Dashboard calidad con SLA > 95% para datos criticos",
            "MDM para paciente unico (golden record HCU)",
            "Politica de privacidad LOPDP implementada",
            "Reporte trimestral de gobierno al Directorio",
        ],
        "inversion_k": 420,
        "equipo":      "8 data stewards + MDM software",
    },
}

for fase, info in roadmap.items():
    print(f"\n  [{fase}]")
    print(f"    Objetivo:    {info['objetivo']}")
    print(f"    Inversion:   ${info['inversion_k']}K USD")
    for hito in info["hitos"][:2]:
        print(f"    - {hito}")

inversion_total = sum(f["inversion_k"] for f in roadmap.values())
print(f"\n  Inversion total 18 meses: ${inversion_total}K USD")
print(f"  ROI estimado: reduccion 40% en errores de datos = ahorro $2.5M/ano")

print("\n" + "=" * 65)
print("GOBIERNO DE DATOS — CONCEPTOS CLAVE:")
print("  DAMA-DMBOK:    11 areas de conocimiento — estandar global")
print("  Madurez CMM:   5 niveles — de ad-hoc a optimizado")
print("  CDO:           Chief Data Officer — lider del programa")
print("  Data Steward:  guardian del dominio — responsable de calidad")
print("  Comite:        estructura de decision — estrategico/tactico/operativo")
print("  Roadmap:       3 fases — fundacion → visibilidad → control")
print("=" * 65)
```

3. Implementa el inventario de activos de datos del MSP: para cada dataset, registra dueno, clasificacion, calidad estimada y cobertura provincial — generando un "mapa de activos" visual en texto.

4. Agrega la matriz RACI para el proceso "Actualizar datos del paciente": quien es Responsible, Accountable, Consulted e Informed para cada rol del MSP.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy el CDO del Ministerio de Salud Publica del Ecuador. Necesito presentarle al Ministro la propuesta de programa de Gobierno de Datos en 90 dias. El Ministro es medico, no technólogo. ¿Como traduzco los conceptos de DAMA-DMBOK al lenguaje del Ministro? Especificamente: 1) ¿como le explico por que 'inconsistencia de datos' le cuesta $15M al ano en medicamentos comprados en exceso?, 2) ¿cual es el caso de negocio mas poderoso para justificar contratar un CDO y 8 data stewards a $35K/ano cada uno?, 3) ¿como presento el roadmap de 18 meses en una diapositiva que el Ministro recuerde? Dame el script de la presentacion de 10 minutos al Directorio del MSP."

Despues de leer la respuesta:
- Implementa el calculo del costo de los datos malos para el MSP Ecuador.
- Genera el caso de negocio en un formato estructurado con ROI calculado.

## Que aprendiste

- DAMA-DMBOK es el estandar global con 11 areas de conocimiento — el gobierno de datos no es solo calidad.
- El modelo de madurez CMM-DM tiene 5 niveles — la mayoria de instituciones ecuatorianas estan en nivel 1-2.
- El CDO es el lider ejecutivo del programa — sin patrocinio del Ministro/CEO, el programa fracasa.
- Los data stewards son los guardianes de dominio — no tecnologos, son responsables de negocio con conocimiento de datos.
- El roadmap en 3 fases (fundacion → visibilidad → control) permite mostrar valor incremental.
- El costo de los datos malos ($10-30M/ano en una institucion mediana) es el argumento de inversion mas poderoso.

## Reto extra

Diseña e implementa el Programa de Gobierno de Datos para el IESS Ecuador: inventario de 500+ activos de datos (prestamos, afiliaciones, salud, jubilaciones), evaluacion de madurez con 40 criterios especificos del sector seguridad social, estructura de gobierno con CDO + 12 data stewards + comite de 25 personas, roadmap 24 meses con 8 hitos verificables, calculo de ROI con 5 casos de uso (Golden Record afiliado, calidad reportes SBS, eliminacion duplicados, MDM empleadores, dashboard actuarial). El programa debe cumplir con la normativa de la Superintendencia de Bancos y ser auditado anualmente.
