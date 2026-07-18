# Ejercicio Sesion 6: Reportes Automatizados con Python

**Materia:** Inteligencia de Negocio y Reporting
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion estimada:** 40 min

## Objetivo

Construir un sistema de reportes automatizados en Python que genera PDFs ejecutivos, archivos Excel formateados y envia reportes por email de forma programada, para el area de gerencia de una empresa ecuatoriana.

## Contexto

El gerente de ventas de una distribuidora en Quito necesita un reporte PDF cada lunes a las 7am con las ventas de la semana anterior. Hacerlo manualmente toma 3 horas; con Python automatizado toma 0 minutos despues de la primera configuracion. Este ejercicio te ensena a construir ese sistema.

## Instrucciones

1. Instala: `pip install pandas reportlab openpyxl xlsxwriter matplotlib`.

2. Crea el archivo `sesion06_reportes_automatizados_ecuador.py`:

```python
# Reportes Automatizados - ITSEIA BI
# PDF ejecutivo + Excel formateado + Email scheduling
# Caso: distribuidora alimentos Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.backends.backend_pdf as pdf_backend
from datetime import datetime, timedelta, date
import os

np.random.seed(2026)
print("=" * 65)
print("REPORTES AUTOMATIZADOS — DISTRIBUIDORA ECUADOR")
print("PDF + Excel + Email Programado")
print("=" * 65)

# ================================================
# DATOS: semana actual distribuidora
# ================================================
hoy = date.today()
lunes = hoy - timedelta(days=hoy.weekday())
semana_str = f"{(lunes - timedelta(days=7)).strftime('%d/%m')} - {(lunes - timedelta(1)).strftime('%d/%m/%Y')}"

productos = ["Arroz Diana 1kg","Aceite La Favorita","Leche Toni","Azucar San Carlos",
             "Detergente Deja","Coca-Cola 2L","Pollo Pronaca","Pan Bimbo","Shampoo HS"]
vendedores = ["Carlos Andrade","Maria Quispe","Diego Mora","Ana Torres","Luis Vera"]
provincias = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua"]

# Datos semana anterior
n = 300
df_semana = pd.DataFrame({
    "fecha":     [lunes - timedelta(days=np.random.randint(1, 8)) for _ in range(n)],
    "producto":  np.random.choice(productos, n),
    "vendedor":  np.random.choice(vendedores, n),
    "provincia": np.random.choice(provincias, n),
    "cantidad":  np.random.randint(5, 100, n),
    "precio":    np.random.uniform(1.5, 12.0, n).round(2),
    "costo":     np.random.uniform(0.9, 7.5, n).round(2),
})
df_semana["monto"] = (df_semana["cantidad"] * df_semana["precio"]).round(2)
df_semana["margen"] = (df_semana["cantidad"] * (df_semana["precio"] - df_semana["costo"])).round(2)

# KPIs semana
total_ventas = df_semana["monto"].sum()
total_margen = df_semana["margen"].sum()
margen_pct   = total_margen / total_ventas * 100
total_pedidos = len(df_semana)
ticket_prom  = total_ventas / total_pedidos

# ================================================
# REPORTE 1: PDF EJECUTIVO
# ================================================
print("\n[1] Generando reporte PDF ejecutivo...")

fig = plt.figure(figsize=(8.27, 11.69))  # A4
fig.patch.set_facecolor("white")

# Header
ax_header = fig.add_axes([0, 0.88, 1, 0.12])
ax_header.set_facecolor("#1F2F58")
ax_header.axis("off")
ax_header.text(0.05, 0.65, "REPORTE EJECUTIVO SEMANAL",
               fontsize=16, fontweight="bold", color="white", va="center")
ax_header.text(0.05, 0.25, f"Semana: {semana_str}  |  Generado: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
               fontsize=9, color="#FBBC0C", va="center")
ax_header.text(0.75, 0.5, "DISTRIBUIDORA\nECUADOR S.A.",
               fontsize=11, fontweight="bold", color="white", ha="center", va="center")

# KPI Boxes
kpis_data = [
    ("VENTAS TOTALES", f"${total_ventas:,.2f}",  "#1F2F58"),
    ("MARGEN BRUTO",   f"${total_margen:,.2f}",  "#2A3F6E"),
    ("MARGEN %",       f"{margen_pct:.1f}%",     "#73B8E7"),
    ("PEDIDOS",        f"{total_pedidos:,}",     "#FBBC0C"),
]
for i, (label, val, color) in enumerate(kpis_data):
    x = 0.03 + i * 0.245
    ax_kpi = fig.add_axes([x, 0.76, 0.22, 0.10])
    ax_kpi.set_facecolor(color)
    ax_kpi.axis("off")
    ax_kpi.text(0.5, 0.65, label, ha="center", va="center",
                fontsize=7, color="white" if color != "#FBBC0C" else "#1F2F58")
    ax_kpi.text(0.5, 0.25, val, ha="center", va="center",
                fontsize=13, fontweight="bold",
                color="white" if color != "#FBBC0C" else "#1F2F58")

# Grafico 1: Ventas por dia
ax1 = fig.add_axes([0.05, 0.55, 0.42, 0.18])
ventas_dia = df_semana.groupby("fecha")["monto"].sum().sort_index()
ax1.bar([d.strftime("%a") for d in ventas_dia.index],
        ventas_dia.values / 1000, color="#1F2F58", alpha=0.85)
ax1.set_title("Ventas por Dia (miles $)", fontsize=9, fontweight="bold")
ax1.tick_params(labelsize=7)

# Grafico 2: Top vendedores
ax2 = fig.add_axes([0.55, 0.55, 0.40, 0.18])
top_vend = df_semana.groupby("vendedor")["monto"].sum().sort_values(ascending=True)
ax2.barh(top_vend.index, top_vend.values / 1000, color="#FBBC0C")
ax2.set_title("Ventas por Vendedor (miles $)", fontsize=9, fontweight="bold")
ax2.tick_params(labelsize=6)

# Grafico 3: Top productos
ax3 = fig.add_axes([0.05, 0.30, 0.42, 0.20])
top_prod = df_semana.groupby("producto")["monto"].sum().sort_values(ascending=True).tail(6)
ax3.barh(top_prod.index, top_prod.values / 1000, color="#73B8E7")
ax3.set_title("Top 6 Productos (miles $)", fontsize=9, fontweight="bold")
ax3.tick_params(labelsize=6)

# Grafico 4: Distribucion por provincia
ax4 = fig.add_axes([0.55, 0.30, 0.40, 0.20])
prov_ventas = df_semana.groupby("provincia")["monto"].sum()
ax4.pie(prov_ventas.values, labels=prov_ventas.index, autopct="%1.0f%%",
        colors=["#1F2F58","#2A3F6E","#73B8E7","#FBBC0C","#F0846D"],
        textprops={"fontsize": 7})
ax4.set_title("Ventas por Provincia", fontsize=9, fontweight="bold")

# Tabla de resumen
ax_tabla = fig.add_axes([0.03, 0.06, 0.94, 0.22])
ax_tabla.axis("off")
ax_tabla.set_title("DETALLE POR VENDEDOR", fontsize=9, fontweight="bold",
                    x=0.5, y=0.98, va="top")

tabla_vend = df_semana.groupby("vendedor").agg(
    pedidos=("fecha","count"),
    ventas=("monto","sum"),
    margen=("margen","sum"),
    ticket_prom=("monto","mean")
).round(2).sort_values("ventas", ascending=False)

tabla_data = [[v, f"{d['pedidos']}", f"${d['ventas']:,.2f}",
               f"${d['margen']:,.2f}", f"${d['ticket_prom']:.2f}"]
              for v, d in tabla_vend.iterrows()]
headers = ["VENDEDOR","PEDIDOS","VENTAS","MARGEN","TICKET PROM"]
tabla = ax_tabla.table(cellText=tabla_data, colLabels=headers,
                        cellLoc="center", loc="center",
                        bbox=[0, 0, 1, 0.9])
tabla.auto_set_font_size(False)
tabla.set_fontsize(8)
for (row, col), cell in tabla.get_celld().items():
    if row == 0:
        cell.set_facecolor("#1F2F58")
        cell.set_text_props(color="white", fontweight="bold")
    elif row % 2 == 0:
        cell.set_facecolor("#F5F5F5")

# Footer
ax_footer = fig.add_axes([0, 0, 1, 0.05])
ax_footer.set_facecolor("#F9F6E7")
ax_footer.axis("off")
ax_footer.text(0.5, 0.5, f"Reporte generado automaticamente por el Sistema BI | "
               f"Distribuidora Ecuador S.A. | {datetime.now().strftime('%Y-%m-%d %H:%M')}",
               ha="center", va="center", fontsize=7, color="#666666")

pdf_file = f"reporte_semanal_{lunes.strftime('%Y%m%d')}.pdf"
plt.savefig(pdf_file, dpi=150, bbox_inches="tight", facecolor="white")
plt.close()
print(f"  PDF generado: {pdf_file}")

# ================================================
# REPORTE 2: EXCEL FORMATEADO
# ================================================
print("\n[2] Generando Excel formateado...")

excel_file = f"reporte_semanal_{lunes.strftime('%Y%m%d')}.xlsx"
with pd.ExcelWriter(excel_file, engine="xlsxwriter") as writer:
    wb = writer.book

    # Formatos
    header_fmt = wb.add_format({"bold":True,"bg_color":"#1F2F58","font_color":"white",
                                  "border":1,"align":"center","font_size":11})
    kpi_fmt     = wb.add_format({"bold":True,"font_size":16,"align":"center","valign":"vcenter",
                                  "bg_color":"#FBBC0C","border":2})
    money_fmt   = wb.add_format({"num_format":"$#,##0.00","border":1})
    pct_fmt     = wb.add_format({"num_format":"0.0%","border":1})
    normal_fmt  = wb.add_format({"border":1})
    alt_fmt     = wb.add_format({"border":1,"bg_color":"#EEF2FF"})

    # Hoja 1: Resumen ejecutivo
    df_semana.to_excel(writer, sheet_name="Datos_Brutos", index=False)
    ws_res = wb.add_worksheet("Resumen_Ejecutivo")
    ws_res.write("A1", "REPORTE SEMANAL EJECUTIVO", header_fmt)
    ws_res.merge_range("A1:F1", "REPORTE SEMANAL EJECUTIVO", header_fmt)
    ws_res.write("A3", "VENTAS TOTALES", kpi_fmt)
    ws_res.write("B3", total_ventas, kpi_fmt)
    ws_res.write("C3", "MARGEN", kpi_fmt)
    ws_res.write("D3", margen_pct/100, pct_fmt)
    ws_res.set_column("A:F", 20)

    # Hoja 2: Ventas por vendedor
    tabla_vend_excel = tabla_vend.reset_index()
    ws_vend = wb.add_worksheet("Por_Vendedor")
    headers_v = ["Vendedor","Pedidos","Ventas","Margen","Ticket Prom"]
    for j, h in enumerate(headers_v):
        ws_vend.write(0, j, h, header_fmt)
    for i, row in enumerate(tabla_vend_excel.itertuples()):
        fmt = alt_fmt if i % 2 == 0 else normal_fmt
        ws_vend.write(i+1, 0, row.vendedor, fmt)
        ws_vend.write(i+1, 1, row.pedidos, fmt)
        ws_vend.write(i+1, 2, row.ventas, money_fmt)
        ws_vend.write(i+1, 3, row.margen, money_fmt)
        ws_vend.write(i+1, 4, row.ticket_prom, money_fmt)
    ws_vend.set_column("A:E", 18)

print(f"  Excel generado: {excel_file}")

# ================================================
# REPORTE 3: EMAIL AUTOMATICO (estructura)
# ================================================
print("\n[3] Codigo para envio de email automatico...")
email_code = """
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

def enviar_reporte_semanal(pdf_path, excel_path, destinatarios):
    # Configuracion SMTP (Gmail)
    smtp_server = "smtp.gmail.com"
    smtp_port   = 587
    remitente   = "bi@distribuidora.ec"
    password    = "tu_app_password"  # usar App Password de Gmail

    msg = MIMEMultipart()
    msg["From"]    = remitente
    msg["To"]      = ", ".join(destinatarios)
    msg["Subject"] = f"Reporte Semanal BI — Semana {semana_str}"

    cuerpo = f\"\"\"
    Estimado equipo,

    Adjunto el reporte semanal correspondiente a {semana_str}.

    KPIs CLAVE:
    - Ventas totales: ${total_ventas:,.2f}
    - Margen bruto: {margen_pct:.1f}%
    - Pedidos: {total_pedidos}

    Se adjuntan:
    1. PDF ejecutivo (para gerencia)
    2. Excel detallado (para analistas)

    El sistema genera este reporte automaticamente cada lunes a las 7:00 AM.

    Saludos,
    Sistema BI Automatizado
    \"\"\"
    msg.attach(MIMEText(cuerpo, "plain"))

    # Adjuntar PDF
    for filepath in [pdf_path, excel_path]:
        with open(filepath, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", f"attachment; filename={os.path.basename(filepath)}")
        msg.attach(part)

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(remitente, password)
        server.sendmail(remitente, destinatarios, msg.as_string())

    print(f"  Email enviado a: {destinatarios}")

# Ejecutar envio
# enviar_reporte_semanal(pdf_file, excel_file,
#     ["gerente@distribuidora.ec", "ventas@distribuidora.ec"])
"""
print(email_code)

# Scheduling con cron (Linux/Mac) o Task Scheduler (Windows)
print("--- PROGRAMAR EJECUCION AUTOMATICA ---")
print("""
  Linux/Mac (crontab -e):
  # Cada lunes a las 7:00 AM
  0 7 * * 1 /usr/bin/python3 /home/bi/sesion06_reportes_automatizados.py

  Windows (Task Scheduler):
  - Programa: python.exe
  - Argumentos: C:\\bi\\sesion06_reportes_automatizados.py
  - Frecuencia: Semanal, lunes, 07:00 AM

  Cloud (GitHub Actions o AWS Lambda):
  # .github/workflows/reporte_semanal.yml
  on:
    schedule:
      - cron: '0 12 * * 1'  # Lunes 7AM Ecuador = 12PM UTC
""")

print("=" * 65)
print(f"  Reporte PDF:    {pdf_file}")
print(f"  Reporte Excel:  {excel_file}")
print("=" * 65)
```

3. Ejecuta el codigo y abre el PDF y Excel generados.

4. Ajusta los formatos del Excel: cambia los colores a los corporativos de tu empresa ficticia.

## Usa IA para...

> Abre Gemini y escribe:
> "Tengo un reporte BI semanal en Python que genera PDF y Excel. ¿Como lo despliego en AWS Lambda para que se ejecute automaticamente cada lunes a las 7am hora Ecuador? Dame el codigo de la funcion Lambda y el evento CloudWatch Events que lo dispara."

Despues de leer la respuesta:
- Adapta el codigo del ejercicio al formato de una funcion Lambda.
- Documenta los pasos para desplegarlo en AWS.

## Que aprendiste

- `matplotlib` puede generar PDFs de alta calidad con layouts complejos usando `add_axes`.
- `xlsxwriter` permite aplicar formatos condicionales, colores y estilos al Excel generado.
- `smtplib` con App Passwords de Gmail permite enviar emails programaticamente.
- Cron jobs (Linux) y Task Scheduler (Windows) automatizan la ejecucion de scripts.
- Un reporte automatizado bien disenado elimina trabajo manual repetitivo del analista.
- Separar el reporte PDF (para gerencia) del Excel detallado (para analistas) satisface dos audiencias distintas.

## Reto extra

Implementa un sistema de reportes "por suscripcion": cada vendedor recibe solo su propio reporte (no el de los demas). El sistema lee una tabla de configuracion con emails y filtros, y envia reportes personalizados en paralelo usando `concurrent.futures.ThreadPoolExecutor`. Agrega un log de envios con timestamp, destinatario y estado (exitoso/fallido).
