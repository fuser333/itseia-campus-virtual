# Ejercicio Sesion 4: Web Scraping Etico

**Materia:** Procesamiento de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Implementar web scraping etico con BeautifulSoup y requests para extraer datos de sitios web publicos ecuatorianos: precios de productos, noticias economicas y estadisticas del gobierno, respetando los terminos de uso y el robots.txt.

## Contexto

El web scraping etico extrae datos publicamente disponibles respetando las reglas del sitio. En Ecuador, el BCE publica estadisticas en HTML que no tienen API; el Ministerio de Turismo publica estadisticas de visitantes en PDFs y paginas web. El scraping permite automatizar la extraccion de esos datos para incluirlos en pipelines de analisis.

## Instrucciones

1. Instala: `pip install requests beautifulsoup4 lxml`.

2. Crea el archivo `sesion04_web_scraping_ecuador.py`:

```python
# Web Scraping Etico - ITSEIA Procesamiento de Datos
# BeautifulSoup + requests
# Fuentes publicas Ecuador

import requests
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
import time
import re
from datetime import datetime

print("=" * 65)
print("WEB SCRAPING ETICO — DATOS PUBLICOS ECUADOR")
print("=" * 65)

# ================================================
# REGLAS ETICAS DEL WEB SCRAPING
# ================================================
print("\n--- REGLAS DE SCRAPING ETICO ---")
reglas = {
    "1. Revisar robots.txt":  "Verificar que el path no este bloqueado",
    "2. Respetar rate limits": "Esperar 1-3 segundos entre requests",
    "3. Identificarse":       "User-Agent descriptivo con contacto",
    "4. Solo datos publicos": "Nunca extraer datos con login/autenticacion",
    "5. Almacenar minimo":    "Solo lo necesario, no base de datos completa",
    "6. Cachear respuestas":  "No hacer la misma request repetidamente",
    "7. Verificar TOS":       "Leer Terminos de Servicio del sitio",
}
for regla, desc in reglas.items():
    print(f"  {regla:<28}: {desc}")

# ================================================
# CONFIGURACION ETICA
# ================================================
HEADERS = {
    "User-Agent": "ITSEIA DataScraper/1.0 (educacion; admin@itseia.ai)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "es-EC,es;q=0.9,en;q=0.8",
}
DELAY_SEGUNDOS = 2  # respeto al servidor

def scrape_con_respeto(url, delay=DELAY_SEGUNDOS):
    """Hace request con headers eticos y delay."""
    time.sleep(delay)
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        return resp
    except requests.RequestException as e:
        print(f"  Error al acceder {url}: {e}")
        return None

# ================================================
# SCRAPING 1: Simular extraccion de precios mercado
# ================================================
print("\n--- SIMULACION: SCRAPING PRECIOS MERCADO ---")
print("  (Simula estructura HTML de pagina de precios Ecuador)")

# HTML simulado de una pagina de precios de mercado mayorista
html_precios = """
<html>
<body>
<h1>Precios Mercado Mayorista Quito - 25 Marzo 2024</h1>
<table id="tabla-precios" class="precios-mercado">
  <thead>
    <tr><th>Producto</th><th>Unidad</th><th>Precio Min</th><th>Precio Max</th><th>Categoria</th></tr>
  </thead>
  <tbody>
    <tr><td>Arroz Diana 1kg</td><td>saco 100lb</td><td>$24.50</td><td>$26.00</td><td>Granos</td></tr>
    <tr><td>Papa Superchola</td><td>quintal 100lb</td><td>$12.00</td><td>$15.00</td><td>Tuberculos</td></tr>
    <tr><td>Tomate Rinon</td><td>caja 20kg</td><td>$8.50</td><td>$12.00</td><td>Hortalizas</td></tr>
    <tr><td>Cebolla Colorada</td><td>quintal</td><td>$18.00</td><td>$22.00</td><td>Hortalizas</td></tr>
    <tr><td>Platano Seda</td><td>caja 20kg</td><td>$6.00</td><td>$8.50</td><td>Frutas</td></tr>
    <tr><td>Naranja Valencia</td><td>caja 18kg</td><td>$7.00</td><td>$10.00</td><td>Frutas</td></tr>
    <tr><td>Pollo Entero</td><td>unidad 2.5kg</td><td>$9.50</td><td>$11.00</td><td>Carnes</td></tr>
    <tr><td>Huevo Tamanio A</td><td>cubeta 30u</td><td>$4.20</td><td>$4.80</td><td>Proteinas</td></tr>
  </tbody>
</table>
<p class="fuente">Fuente: MAGAP Ecuador | Actualizado: 2024-03-25</p>
</body>
</html>
"""

def parsear_precios_mercado(html):
    """Extrae tabla de precios del HTML."""
    soup = BeautifulSoup(html, "lxml")

    # Extraer fecha del titulo
    titulo = soup.find("h1").text
    fecha_match = re.search(r'\d{1,2} \w+ \d{4}', titulo)
    fecha = fecha_match.group() if fecha_match else "desconocida"

    # Extraer tabla
    tabla = soup.find("table", {"id": "tabla-precios"})
    if not tabla:
        return None, fecha

    filas = []
    headers = [th.text.strip() for th in tabla.find("thead").find_all("th")]

    for tr in tabla.find("tbody").find_all("tr"):
        celdas = [td.text.strip() for td in tr.find_all("td")]
        if celdas:
            fila = dict(zip(headers, celdas))
            # Parsear precios
            fila["Precio Min Num"] = float(fila["Precio Min"].replace("$",""))
            fila["Precio Max Num"] = float(fila["Precio Max"].replace("$",""))
            fila["Precio Medio"]   = round((fila["Precio Min Num"] + fila["Precio Max Num"]) / 2, 2)
            fila["Fecha"]          = "2024-03-25"
            fila["Fuente"]         = "Mercado Mayorista Quito"
            filas.append(fila)

    return pd.DataFrame(filas), fecha

df_precios, fecha = parsear_precios_mercado(html_precios)
print(f"  Datos extraidos: {len(df_precios)} productos | Fecha: {fecha}")
print(df_precios[["Producto","Categoria","Precio Min","Precio Max","Precio Medio"]].to_string(index=False))

# ================================================
# SCRAPING 2: Extraer noticias economicas (RSS)
# ================================================
print("\n--- SIMULACION: PARSING RSS NOTICIAS BCE ---")

rss_simulado = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Noticias BCE Ecuador</title>
    <item>
      <title>Inflacion anual Ecuador marzo 2024: 1.82%</title>
      <link>https://www.bce.fin.ec/noticia/inflacion-marzo-2024</link>
      <pubDate>Mon, 25 Mar 2024 10:00:00 +0000</pubDate>
      <description>El Banco Central del Ecuador publica el dato de inflacion...</description>
    </item>
    <item>
      <title>Exportaciones Ecuador crecen 8.5% en 2024</title>
      <link>https://www.bce.fin.ec/noticia/exportaciones-2024</link>
      <pubDate>Fri, 22 Mar 2024 14:30:00 +0000</pubDate>
      <description>Las exportaciones totales registraron un incremento...</description>
    </item>
    <item>
      <title>Remesas 2024: $1,210 millones en primer trimestre</title>
      <link>https://www.bce.fin.ec/noticia/remesas-q1-2024</link>
      <pubDate>Wed, 20 Mar 2024 09:00:00 +0000</pubDate>
      <description>Las remesas de migrantes ecuatorianos muestran incremento...</description>
    </item>
  </channel>
</rss>"""

soup_rss = BeautifulSoup(rss_simulado, "xml")
noticias = []
for item in soup_rss.find_all("item"):
    noticias.append({
        "titulo":      item.find("title").text,
        "url":         item.find("link").text,
        "fecha":       item.find("pubDate").text[:25],
        "descripcion": item.find("description").text[:80] + "..."
    })
df_noticias = pd.DataFrame(noticias)
print(f"  Noticias extraidas: {len(df_noticias)}")
for _, n in df_noticias.iterrows():
    print(f"  [{n['fecha'][:11]}] {n['titulo']}")

# ================================================
# SCRAPING 3: Extraer indicadores con CSS selectors
# ================================================
print("\n--- SELECTORES CSS AVANZADOS ---")

html_dashboard = """
<div class="dashboard-economico">
  <div class="indicador" data-tipo="inflacion">
    <span class="nombre">Inflacion Anual</span>
    <span class="valor positivo">1.82%</span>
    <span class="variacion">+0.12pp vs feb</span>
  </div>
  <div class="indicador" data-tipo="pib">
    <span class="nombre">PIB Real (var.)</span>
    <span class="valor positivo">+2.4%</span>
    <span class="variacion">proyeccion 2024</span>
  </div>
  <div class="indicador" data-tipo="desempleo">
    <span class="nombre">Tasa Desempleo</span>
    <span class="valor negativo">3.9%</span>
    <span class="variacion">-0.3pp vs 2023</span>
  </div>
  <div class="indicador" data-tipo="remesas">
    <span class="nombre">Remesas Q1</span>
    <span class="valor positivo">$1,210M</span>
    <span class="variacion">+4.2% vs Q1 2023</span>
  </div>
</div>
"""

soup_dash = BeautifulSoup(html_dashboard, "lxml")
indicadores = []
for div in soup_dash.select("div.indicador"):
    indicadores.append({
        "tipo":      div["data-tipo"],
        "nombre":    div.select_one("span.nombre").text,
        "valor":     div.select_one("span.valor").text,
        "tendencia": "positivo" if "positivo" in div.select_one("span.valor").get("class",[]) else "negativo",
        "variacion": div.select_one("span.variacion").text
    })
df_indicadores = pd.DataFrame(indicadores)
print("  Indicadores extraidos con CSS selectors:")
print(df_indicadores.to_string(index=False))

# ================================================
# GUARDAR RESULTADOS
# ================================================
df_precios.to_csv("precios_mercado_scraping.csv", index=False)
df_indicadores.to_csv("indicadores_bce_scraping.csv", index=False)
print(f"\n  Guardado: precios_mercado_scraping.csv")
print(f"  Guardado: indicadores_bce_scraping.csv")

print("\n" + "=" * 65)
print("CHECKLIST SCRAPING ETICO COMPLETADO:")
print("  [OK] User-Agent identificado")
print("  [OK] Delay entre requests")
print("  [OK] Solo datos publicamente disponibles")
print("  [OK] Datos mínimos extraidos")
print("=" * 65)
```

3. Ahora practica con un sitio real: ve a `https://www.ecuadorencifras.gob.ec` y extrae la pagina de publicaciones. Lista los ultimos 5 documentos publicados con su titulo y fecha.

4. Verifica el robots.txt de dos sitios ecuatorianos: `https://www.bce.fin.ec/robots.txt` y `https://www.ecuadorencifras.gob.ec/robots.txt`.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Quiero hacer scraping de la pagina de precios del mercado mayorista de Quito (sitio MAGAP Ecuador). ¿Como estructuro el codigo con BeautifulSoup para: 1) respetar el robots.txt, 2) manejar errores de red, 3) cachear resultados para no hacer requests repetidos? Dame el codigo completo."

Despues de leer la respuesta:
- Implementa el sistema de cache con un archivo JSON local.
- Agrega manejo de errores con reintentos (max 3 intentos con backoff exponencial).

## Que aprendiste

- `BeautifulSoup(html, "lxml")` parsea HTML para extraer elementos.
- `.find("tag", attrs)` busca el primer elemento; `.find_all()` encuentra todos.
- `.select("css_selector")` usa selectores CSS avanzados — mas potente que find.
- El atributo `data-*` en HTML es accesible como `elemento["data-tipo"]`.
- Siempre verificar `robots.txt` antes de hacer scraping: `{sitio}/robots.txt`.
- `time.sleep(2)` entre requests es el minimo respeto para no sobrecargar el servidor.

## Reto extra

Construye un scraper que monitoree los precios de canasta basica del INEC Ecuador cada semana y los compare con la semana anterior. Si algun producto sube mas del 5%, genera una alerta. Guarda el historial en SQLite para calcular la tendencia de precios de los ultimos 3 meses.
