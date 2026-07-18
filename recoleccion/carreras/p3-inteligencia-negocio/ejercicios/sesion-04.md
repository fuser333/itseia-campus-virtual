# Ejercicio Sesion 4: Power BI — Dashboard Completo

**Materia:** Inteligencia de Negocio y Reporting
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Construir un dashboard ejecutivo completo en Power BI con medidas DAX avanzadas, visualizaciones interactivas, drill-through y filtros dinamicos, usando datos del sector bancario ecuatoriano.

## Contexto

El area de BI del Banco Pichincha tiene un dashboard que el CEO revisa cada manana: saldo total de cartera, tasa de morosidad, captaciones vs colocaciones, y rendimiento por agencia. Este ejercicio simula ese dashboard, preparando los datos en Python y documentando las medidas DAX que necesitas implementar en Power BI.

## Instrucciones

1. Crea el archivo `sesion04_powerbi_dashboard_banco_ecuador.py`:

```python
# Power BI Dashboard - Banco Ecuador
# Preparacion datos + medidas DAX + especificacion visual
# ITSEIA - BI y Reporting

import pandas as pd
import numpy as np
from datetime import datetime, date, timedelta

np.random.seed(2026)
print("=" * 65)
print("POWER BI DASHBOARD — BANCO ECUATORIANO")
print("Cartera de Credito y Captaciones")
print("=" * 65)

# ================================================
# DATOS: banco ecuatoriano simulado
# ================================================
n_creditos = 800
agencias = {
    "Quito Centro":    ("Pichincha","Urbana","grande"),
    "Quito Norte":     ("Pichincha","Urbana","grande"),
    "Guayaquil Urdesa":("Guayas","Urbana","grande"),
    "Cuenca":          ("Azuay","Urbana","mediana"),
    "Ambato":          ("Tungurahua","Urbana","mediana"),
    "Loja":            ("Loja","Urbana","pequena"),
    "Ibarra":          ("Imbabura","Urbana","pequena"),
    "Machala":         ("El Oro","Urbana","pequena"),
}

tipos_credito = {
    "consumo":      (0.17, 500, 15000,   24, 0.04),
    "microempresa": (0.24, 1000, 50000,  48, 0.07),
    "vivienda":     (0.11, 20000, 150000, 240, 0.02),
    "comercial":    (0.13, 50000, 500000, 120, 0.03),
}

creditos = []
for i in range(n_creditos):
    agencia = np.random.choice(list(agencias.keys()))
    tipo = np.random.choice(list(tipos_credito.keys()), p=[0.45, 0.30, 0.15, 0.10])
    tasa, monto_min, monto_max, plazo_max, prob_mora = tipos_credito[tipo]

    fecha_des = date(2022, 1, 1) + timedelta(days=np.random.randint(0, 730))
    monto = np.random.uniform(monto_min, monto_max)
    plazo = np.random.randint(6, plazo_max)
    saldo = monto * np.random.uniform(0.2, 0.95)
    mora = np.random.random() < prob_mora

    creditos.append({
        "CreditoID":      f"CRE-{i+1:05d}",
        "AgenciaNombre":  agencia,
        "Provincia":      agencias[agencia][0],
        "Tipo":           tipo,
        "FechaDesembolso":fecha_des.strftime("%Y-%m-%d"),
        "MontoOriginal":  round(monto, 2),
        "SaldoActual":    round(saldo, 2),
        "Plazo":          plazo,
        "TasaAnual":      tasa,
        "EnMora":         int(mora),
        "DiasVencidos":   int(np.random.uniform(1, 180)) if mora else 0,
        "Categoria":      "C" if mora and np.random.random() > 0.5 else ("B" if mora else "A"),
    })

df_creditos = pd.DataFrame(creditos)
df_creditos["IngresoMensual"] = (df_creditos["SaldoActual"] * df_creditos["TasaAnual"] / 12).round(2)

# Captaciones (depositos)
df_captaciones = pd.DataFrame({
    "CaptacionID":    [f"CAP-{i:05d}" for i in range(500)],
    "AgenciaNombre":  np.random.choice(list(agencias.keys()), 500),
    "TipoCaptacion":  np.random.choice(["ahorro","corriente","plazo_fijo","CDAT"],
                                        p=[0.40, 0.25, 0.25, 0.10], size=500),
    "Saldo":          np.random.lognormal(7.5, 1.2, 500).clip(100, 200000).round(2),
    "TasaPasiva":     np.random.uniform(0.03, 0.09, 500).round(4),
    "FechaApertura":  pd.date_range("2022-01-01", periods=500, freq="D")[:500].strftime("%Y-%m-%d"),
})

print(f"Dataset: {len(df_creditos)} creditos, {len(df_captaciones)} captaciones")

# ================================================
# KPIs CALCULADOS
# ================================================
print("\n--- KPIs DEL DASHBOARD BANCARIO ---")

cartera_total = df_creditos["SaldoActual"].sum()
cartera_mora  = df_creditos[df_creditos["EnMora"]==1]["SaldoActual"].sum()
tasa_mora     = cartera_mora / cartera_total * 100
ingreso_mes   = df_creditos["IngresoMensual"].sum()
captaciones_total = df_captaciones["Saldo"].sum()
spread = df_creditos["TasaAnual"].mean() - df_captaciones["TasaPasiva"].mean()

print(f"  Cartera total:        ${cartera_total:,.0f}")
print(f"  Cartera en mora:      ${cartera_mora:,.0f} ({tasa_mora:.2f}%)")
print(f"  Ingreso mensual:      ${ingreso_mes:,.0f}")
print(f"  Captaciones totales:  ${captaciones_total:,.0f}")
print(f"  Spread financiero:    {spread*100:.2f}%")
print(f"  Ratio Cartera/Capta:  {cartera_total/captaciones_total:.2f}x")

# Por tipo de credito
print("\n  Por tipo de credito:")
por_tipo = df_creditos.groupby("Tipo").agg(
    creditos=("CreditoID","count"),
    cartera=("SaldoActual","sum"),
    mora_pct=("EnMora","mean")
).round(4)
por_tipo["mora_pct"] *= 100
print(por_tipo.round(2).to_string())

# Por agencia
print("\n  Por agencia (top 5):")
por_agencia = df_creditos.groupby("AgenciaNombre").agg(
    cartera=("SaldoActual","sum"),
    mora_pct=("EnMora","mean")
).sort_values("cartera", ascending=False).head(5)
por_agencia["mora_pct"] *= 100
print(por_agencia.round(2).to_string())

# ================================================
# EXPORTAR PARA POWER BI
# ================================================
with pd.ExcelWriter("datos_powerbi_banco.xlsx", engine="openpyxl") as writer:
    df_creditos.to_excel(writer, sheet_name="Creditos", index=False)
    df_captaciones.to_excel(writer, sheet_name="Captaciones", index=False)
print("\n  Exportado: datos_powerbi_banco.xlsx")

# ================================================
# ESPECIFICACION COMPLETA DEL DASHBOARD
# ================================================
print("\n--- ESPECIFICACION DASHBOARD POWER BI ---")
especificacion = """
PAGINA 1: RESUMEN EJECUTIVO
  Tarjetas KPI (fila superior):
    - Cartera Total (SUM de SaldoActual)
    - Tasa de Mora % (cartera mora / cartera total)
    - Ingreso Mensual (SUM IngresoMensual)
    - Spread Financiero (TasaActiva - TasaPasiva avg)

  Visualizaciones:
    - Grafico barras: Cartera por Tipo (consumo/micro/vivienda/comercial)
    - Grafico dona: Distribucion Cartera Sana vs Mora
    - Grafico lineas: Evolucion cartera por trimestre
    - Mapa: Cartera por Provincia

PAGINA 2: ANALISIS DE MORA
  - Tabla: creditos en mora por categoria (A/B/C)
  - Dispersión: SaldoActual vs DiasVencidos
  - Barras apiladas: Mora % por tipo de credito
  - Drill-through: al hacer click en agencia, ver creditos de esa agencia

PAGINA 3: CAPTACIONES
  - Barras: Captaciones por tipo
  - Tabla: top 10 agencias por captaciones
  - KPI: Ratio Credito/Deposito

MEDIDAS DAX REQUERIDAS:
  Cartera Total = SUM(Creditos[SaldoActual])
  Cartera Mora  = CALCULATE([Cartera Total], Creditos[EnMora]=1)
  Tasa Mora     = DIVIDE([Cartera Mora], [Cartera Total])
  Ingreso Mes   = SUM(Creditos[IngresoMensual])
  Captaciones   = SUM(Captaciones[Saldo])
  Spread        = AVERAGE(Creditos[TasaAnual]) - AVERAGE(Captaciones[TasaPasiva])
  Ratio CD      = DIVIDE([Cartera Total], [Captaciones])

COLORES (identidad bancaria):
  Primario:   #003087 (azul banco)
  Acento:     #FBBC0C (amarillo)
  Mora:       #D32F2F (rojo alerta)
  Sano:       #388E3C (verde)
"""
print(especificacion)

print("=" * 65)
```

2. Importa `datos_powerbi_banco.xlsx` en Power BI Desktop.

3. Implementa las 3 paginas del dashboard segun la especificacion.

4. Agrega un filtro de fecha por trimestre que afecte todas las visualizaciones.

## Usa IA para...

> Abre ChatGPT y escribe:
> "En Power BI tengo datos de creditos bancarios Ecuador. Necesito una medida DAX que calcule la 'Provision Requerida': creditos categoria A = 1%, B = 5%, C = 20% del saldo. ¿Como escribo esa medida DAX con SWITCH? ¿Y como agrego formato condicional para que la tasa de mora sea roja cuando supere el 5%?"

Despues de leer la respuesta:
- Implementa la medida de Provision Requerida en Power BI.
- Configura el formato condicional en la tarjeta de Tasa de Mora.

## Que aprendiste

- Un dashboard bancario requiere KPIs de cartera, mora, captaciones y spread financiero.
- La funcion DIVIDE en DAX maneja la division por cero de forma segura.
- CALCULATE permite filtrar el contexto de una medida — clave para mora y segmentaciones.
- El drill-through permite ir de un resumen a un detalle con click en Power BI.
- El formato condicional en tarjetas KPI comunica alertas de negocio visualmente.
- Separar los datos en hojas Excel distintas facilita el modelado de relaciones en Power BI.

## Reto extra

Implementa un "scorecard de agencias" en Power BI: tabla con las 8 agencias y columnas dinamicas de rendimiento: cartera, mora%, ingreso mensual, % meta cumplida y una columna de estado (VERDE/AMARILLO/ROJO) basada en reglas DAX con SWITCH. Ordena por rendimiento para que la gerencia identifique agencias problematicas en segundos.
