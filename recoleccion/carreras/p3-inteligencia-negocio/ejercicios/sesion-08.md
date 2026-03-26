# Ejercicio Sesion 8: Proyecto — Dashboard KPIs Empresa Ecuatoriana

**Materia:** Inteligencia de Negocio y Reporting
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 90 min

## Objetivo

Construir un sistema BI completo de principio a fin para una empresa ecuatoriana real: pipeline de datos, modelo estrella, 3 dashboards ejecutivos (gerencia, ventas, operaciones), KPIs con semaforos RAG, y reporte PDF automatico semanal.

## Contexto

Este es el proyecto integrador de la materia. Simulas ser el unico analista de BI de una cadena de clinicas privadas en Ecuador (6 sedes en 4 provincias). El directorio te pide un sistema BI que responda las 5 preguntas mas criticas del negocio cada semana. Tu decides la arquitectura, los KPIs y el diseno visual.

## Instrucciones

1. Crea el archivo `sesion08_proyecto_bi_clinicas_ecuador.py`:

```python
# PROYECTO BI COMPLETO — CLINICAS ECUADOR
# Sistema BI: datos → DW → dashboards → PDF
# ITSEIA - BI y Reporting - Sesion 8

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import sqlite3
from datetime import datetime, timedelta, date
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
plt.rcParams.update({"font.family": "DejaVu Sans", "axes.spines.top": False,
                      "axes.spines.right": False})

print("=" * 70)
print("PROYECTO BI — CLINICAS ECUADOR S.A.")
print("Sistema de Inteligencia de Negocio Completo")
print("=" * 70)

# ================================================
# DATOS MAESTROS
# ================================================
clinicas = {
    "Clinica Norte Quito":   ("Pichincha", "Quito",     "grande",   80),
    "Clinica Sur Quito":     ("Pichincha", "Quito",     "mediana",  45),
    "Clinica Guayaquil":     ("Guayas",    "Guayaquil", "grande",   90),
    "Clinica Cuenca":        ("Azuay",     "Cuenca",    "mediana",  50),
    "Clinica Ambato":        ("Tungurahua","Ambato",    "pequena",  25),
    "Clinica Manta":         ("Manabi",    "Manta",     "pequena",  20),
}
especialidades = ["Medicina General","Pediatria","Ginecologia","Cardiologia",
                   "Cirugia","Traumatologia","Dermatologia","Oftalmologia"]
medicos_por_esp = 3

# Generar medicos
medicos = []
for i, esp in enumerate(especialidades):
    for j in range(medicos_por_esp):
        clinica_asig = list(clinicas.keys())[(i * medicos_por_esp + j) % len(clinicas)]
        medicos.append({
            "MedicoID": f"MED-{i*medicos_por_esp+j+1:03d}",
            "Nombre": f"Dr(a). Apellido{i*medicos_por_esp+j+1}",
            "Especialidad": esp,
            "Clinica": clinica_asig,
            "TarifaConsulta": np.random.choice([35, 45, 55, 65, 80]),
            "MetaMensual": np.random.randint(80, 200),
        })
df_medicos = pd.DataFrame(medicos)

# ================================================
# GENERAR DATOS OPERATIVOS (2 años)
# ================================================
print("\n[DATOS] Generando 2 anos de datos operativos...")
fechas = pd.date_range("2023-01-01", "2024-12-31", freq="D")
n_consultas = 5000

consultas = []
for i in range(n_consultas):
    medico = df_medicos.sample(1).iloc[0]
    clinica = medico["Clinica"]
    fecha = np.random.choice(fechas[fechas.weekday < 6])  # L-S
    asistio = np.random.random() > 0.12   # 12% no show
    duracion = np.random.randint(15, 45)
    satisfaccion = np.random.choice([1,2,3,4,5], p=[0.02,0.05,0.13,0.40,0.40])
    consultas.append({
        "ConsultaID":    f"CON-{i+1:06d}",
        "Fecha":         fecha.strftime("%Y-%m-%d"),
        "Anio":          fecha.year,
        "Mes":           fecha.month,
        "Trimestre":     (fecha.month - 1) // 3 + 1,
        "DiaSemana":     fecha.strftime("%A"),
        "MedicoID":      medico["MedicoID"],
        "Especialidad":  medico["Especialidad"],
        "Clinica":       clinica,
        "Provincia":     clinicas[clinica][0],
        "Asistio":       int(asistio),
        "DuracionMin":   duracion if asistio else 0,
        "Tarifa":        medico["TarifaConsulta"],
        "Cobrado":       medico["TarifaConsulta"] * asistio,
        "Satisfaccion":  satisfaccion if asistio else None,
        "TipoConsulta":  np.random.choice(["primera_vez","control","urgencia"],
                                           p=[0.35, 0.50, 0.15]),
        "MetodoPago":    np.random.choice(["efectivo","tarjeta","seguro"],
                                           p=[0.40, 0.35, 0.25]),
    })

df_cons = pd.DataFrame(consultas)
df_cons["Fecha"] = pd.to_datetime(df_cons["Fecha"])
print(f"  {len(df_cons)} consultas generadas")

# ================================================
# KPIs PRINCIPALES
# ================================================
print("\n[KPIs] Calculando indicadores clave...")

# Filtrar 2024
df_2024 = df_cons[df_cons["Anio"] == 2024].copy()
df_2023 = df_cons[df_cons["Anio"] == 2023].copy()

# KPIs 2024
total_consultas = len(df_2024)
consultas_atendidas = df_2024["Asistio"].sum()
tasa_asistencia = consultas_atendidas / total_consultas * 100
revenue_total = df_2024["Cobrado"].sum()
nps_simulado = df_2024["Satisfaccion"].dropna().apply(lambda x: 1 if x >= 4 else (-1 if x <= 2 else 0)).sum() / len(df_2024) * 100
revenue_mes = df_2024.groupby("Mes")["Cobrado"].sum().mean()

# YoY
rev_2023 = df_2023["Cobrado"].sum()
yoy = (revenue_total - rev_2023) / rev_2023 * 100

print(f"\n  Consultas 2024:       {total_consultas:,}")
print(f"  Tasa asistencia:      {tasa_asistencia:.1f}%")
print(f"  Revenue total:        ${revenue_total:,.0f}")
print(f"  Revenue vs 2023:      {yoy:+.1f}%")
print(f"  NPS Score:            {nps_simulado:.0f}")

# KPIs por clinica
print("\n  KPIs por Clinica 2024:")
por_clinica = df_2024.groupby("Clinica").agg(
    consultas=("ConsultaID","count"),
    atendidas=("Asistio","sum"),
    revenue=("Cobrado","sum"),
    satisfaccion_prom=("Satisfaccion","mean"),
).round(2)
por_clinica["tasa_asist"] = (por_clinica["atendidas"] / por_clinica["consultas"] * 100).round(1)
print(por_clinica[["consultas","tasa_asist","revenue","satisfaccion_prom"]].to_string())

# ================================================
# DASHBOARD GERENCIA
# ================================================
print("\n[DASHBOARD] Generando 3 dashboards...")

fig_gerencia = plt.figure(figsize=(18, 14))
fig_gerencia.suptitle("DASHBOARD GERENCIA — CLINICAS ECUADOR S.A. | 2024",
                       fontsize=16, fontweight="bold", color="#1F2F58", y=0.98)
gs = gridspec.GridSpec(3, 3, figure=fig_gerencia, hspace=0.45, wspace=0.35)

# KPIs en texto
ax_kpis = fig_gerencia.add_subplot(gs[0, :])
ax_kpis.axis("off")
kpis_display = [
    ("CONSULTAS",        f"{total_consultas:,}",   "#1F2F58"),
    ("ASISTENCIA",       f"{tasa_asistencia:.1f}%","#2A3F6E"),
    ("REVENUE 2024",     f"${revenue_total/1000:.0f}K","#73B8E7"),
    ("vs 2023",          f"{yoy:+.1f}%",           "#FBBC0C" if yoy > 0 else "#F0846D"),
    ("NPS SCORE",        f"{nps_simulado:.0f}",     "#388E3C" if nps_simulado > 30 else "#D32F2F"),
    ("CLINICAS ACTIVAS", "6",                       "#1F2F58"),
]
for i, (label, val, color) in enumerate(kpis_display):
    x = 0.08 + i * 0.155
    ax_kpis.add_patch(plt.Rectangle((x-0.07, 0.05), 0.14, 0.90,
                     transform=ax_kpis.transAxes, color=color, alpha=0.12))
    ax_kpis.text(x, 0.72, label, ha="center", fontsize=8, color="#666666",
                transform=ax_kpis.transAxes)
    ax_kpis.text(x, 0.30, val, ha="center", fontsize=16, fontweight="bold",
                color=color, transform=ax_kpis.transAxes)

# Revenue mensual 2024 vs 2023
ax1 = fig_gerencia.add_subplot(gs[1, :2])
rev_m_24 = df_2024.groupby("Mes")["Cobrado"].sum() / 1000
rev_m_23 = df_2023.groupby("Mes")["Cobrado"].sum() / 1000
meses_str = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
x = range(1, 13)
ax1.plot([meses_str[i-1] for i in rev_m_24.index], rev_m_24.values,
         marker="o", color="#1F2F58", lw=2.5, label="2024")
ax1.plot([meses_str[i-1] for i in rev_m_23.index], rev_m_23.values,
         marker="s", color="#BBBBBB", lw=1.5, linestyle="--", label="2023")
ax1.fill_between([meses_str[i-1] for i in rev_m_24.index],
                  rev_m_24.values, rev_m_23.values,
                  alpha=0.15, color="#FBBC0C")
ax1.set_title("Revenue Mensual 2024 vs 2023 (miles $)")
ax1.legend(fontsize=9)
ax1.tick_params(axis="x", labelsize=8)

# Semaforo por clinica
ax2 = fig_gerencia.add_subplot(gs[1, 2])
ax2.axis("off")
ax2.set_title("SEMAFORO CLINICAS", fontsize=9, fontweight="bold")
for i, (clinica, row) in enumerate(por_clinica.iterrows()):
    color = "#388E3C" if row["tasa_asist"] >= 90 else ("#FBBC0C" if row["tasa_asist"] >= 80 else "#D32F2F")
    nombre_corto = clinica.replace("Clinica ","")
    ax2.add_patch(plt.Circle((0.1, 0.85 - i*0.14), 0.04,
                  transform=ax2.transAxes, color=color))
    ax2.text(0.20, 0.85 - i*0.14, f"{nombre_corto}: {row['tasa_asist']}%",
             va="center", fontsize=7, transform=ax2.transAxes)

# Distribucion por especialidad
ax3 = fig_gerencia.add_subplot(gs[2, 0])
esp_rev = df_2024.groupby("Especialidad")["Cobrado"].sum().sort_values(ascending=True).tail(6)
ax3.barh(esp_rev.index, esp_rev.values/1000, color="#73B8E7")
ax3.set_title("Revenue por Especialidad (miles $)")
ax3.tick_params(labelsize=7)

# Tipo consulta
ax4 = fig_gerencia.add_subplot(gs[2, 1])
tipo_c = df_2024.groupby("TipoConsulta")["ConsultaID"].count()
ax4.pie(tipo_c.values, labels=tipo_c.index,
        autopct="%1.0f%%", colors=["#1F2F58","#73B8E7","#F0846D"],
        textprops={"fontsize": 8})
ax4.set_title("Mix Tipo de Consulta")

# Satisfaccion distribucion
ax5 = fig_gerencia.add_subplot(gs[2, 2])
sat = df_2024["Satisfaccion"].dropna().value_counts().sort_index()
colores_sat = {1:"#D32F2F",2:"#F0846D",3:"#FBBC0C",4:"#81C784",5:"#388E3C"}
ax5.bar(sat.index, sat.values,
        color=[colores_sat[i] for i in sat.index])
ax5.set_title("Distribucion Satisfaccion")
ax5.set_xlabel("Estrellas (1-5)")

plt.savefig("dashboard_gerencia_clinicas.png", dpi=150, bbox_inches="tight")
plt.close()
print("  Dashboard gerencia: dashboard_gerencia_clinicas.png")

# ================================================
# REPORTE EJECUTIVO TEXTO
# ================================================
print("\n" + "=" * 70)
print("REPORTE EJECUTIVO — CLINICAS ECUADOR S.A. 2024")
print("=" * 70)
top_clinica = por_clinica["revenue"].idxmax()
mejor_tasa  = por_clinica["tasa_asist"].idxmax()
top_esp     = df_2024.groupby("Especialidad")["Cobrado"].sum().idxmax()

print(f"  HIGHLIGHTS:")
print(f"  + Revenue 2024: ${revenue_total:,.0f} ({yoy:+.1f}% vs 2023)")
print(f"  + Clinica lider por revenue: {top_clinica}")
print(f"  + Mejor tasa de asistencia:  {mejor_tasa} ({por_clinica.loc[mejor_tasa,'tasa_asist']:.1f}%)")
print(f"  + Especialidad mas rentable: {top_esp}")
print(f"  + NPS Score:                 {nps_simulado:.0f} ({'Bueno' if nps_simulado > 30 else 'Mejorar'})")
print(f"\n  ACCIONES RECOMENDADAS:")
clinica_baja = por_clinica["tasa_asist"].idxmin()
print(f"  1. {clinica_baja} tiene tasa de asistencia {por_clinica.loc[clinica_baja,'tasa_asist']:.1f}% — implementar recordatorios WhatsApp")
print(f"  2. Expandir Especialidad {top_esp} — mayor demanda y revenue")
print(f"  3. Meta 2025: revenue +15% = ${revenue_total*1.15:,.0f}")
print("=" * 70)
```

2. Ejecuta el proyecto completo. Analiza los KPIs y el semaforo de clinicas.

3. Crea un segundo dashboard para el area de ventas (captacion de nuevos pacientes por mes y canal).

4. Implementa el reporte PDF automatico semanal con los datos del proyecto.

## Usa IA para...

> Abre Claude y escribe:
> "Soy el analista BI de una cadena de clinicas en Ecuador. El NPS score es 42, la tasa de asistencia promedio es 88% y el revenue crecio 12% vs el anio anterior. El directorio quiere saber: ¿estas metricas son buenas para el sector salud privado en Ecuador? ¿Cuales son los 3 KPIs que deberia priorizar mejorar?"

Despues de leer la respuesta:
- Incorpora los benchmarks del sector en el semaforo RAG.
- Ajusta los umbrales del semaforo segun los benchmarks que Claude proporciona.

## Que aprendiste

- Un sistema BI completo integra: datos → transformacion → DW → dashboards → reportes automaticos.
- Los KPIs del sector salud incluyen: tasa de asistencia, revenue, NPS, ocupacion de consultorios.
- El semaforo RAG comunica el estado de cada clinica de forma instantanea al directorio.
- Los benchmarks del sector dan contexto a los numeros: sin referencia, un KPI no dice nada.
- `gridspec.GridSpec` permite disenar dashboards multi-panel complejos con control total del layout.
- Un proyecto BI exitoso responde las 5 preguntas mas frecuentes del gerente en < 30 segundos.

## Reto extra

Despliega el dashboard como aplicacion web interactiva usando Plotly Dash. Agrega: 1) filtros de fecha, clinica y especialidad, 2) drill-down al hacer click en una clinica (ver medicos de esa clinica), 3) exportar PDF del dashboard actual con un boton. Despliega en Render.com (gratis) y comparte el link con el docente.
