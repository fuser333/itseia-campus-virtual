# Ejercicio Sesion 7: Storytelling Ejecutivo con Datos

**Materia:** Inteligencia de Negocio y Reporting
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Aplicar los principios de storytelling con datos para transformar graficos genéricos en narrativas visuales que comuniquen insights accionables a audiencias ejecutivas ecuatorianas, usando el framework SCR (Situacion-Complicacion-Resolucion).

## Contexto

Datos sin historia son ruido. Un analista de datos que presenta numeros en tablas pierde a la audiencia en 2 minutos. Un analista que cuenta una historia — "vendimos 15% menos este trimestre porque perdimos 3 clientes grandes en Guayas; aqui el plan de recuperacion" — captura la atencion del CEO en 10 segundos. Este ejercicio transforma datos en narrativa ejecutiva.

## Instrucciones

1. Crea el archivo `sesion07_storytelling_datos_ecuador.py`:

```python
# Storytelling con Datos - ITSEIA BI
# Framework SCR: Situacion - Complicacion - Resolucion
# Caso: empresa exportadora flores Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from datetime import datetime

np.random.seed(2026)
print("=" * 65)
print("STORYTELLING EJECUTIVO — EXPORTADORA FLORES ECUADOR")
print("Framework SCR: Situacion-Complicacion-Resolucion")
print("=" * 65)

# ================================================
# DATOS: exportadora de flores Ecuador 2024
# ================================================
trimestres = ["Q1 2023","Q2 2023","Q3 2023","Q4 2023",
              "Q1 2024","Q2 2024","Q3 2024","Q4 2024"]

# Exportaciones por mercado
exportaciones = pd.DataFrame({
    "trimestre": trimestres * 4,
    "mercado":   (["EEUU"]*8 + ["Europa"]*8 + ["Asia"]*8 + ["Resto"]*8),
    "toneladas": [
        # EEUU: crecimiento estable hasta caida en Q3 2024
        120, 135, 145, 160, 165, 170, 95, 110,
        # Europa: crecimiento
        80, 85, 90, 95, 100, 108, 115, 120,
        # Asia: nuevo mercado, crecimiento rapido
        10, 12, 15, 20, 28, 35, 45, 52,
        # Resto: estable
        15, 18, 16, 20, 19, 22, 20, 25,
    ],
    "precio_kg": [
        # EEUU: bajada de precios en 2024
        3.20,3.25,3.30,3.35, 3.40,3.35,2.90,3.10,
        # Europa: precios estables
        3.80,3.85,3.90,3.95, 4.00,4.05,4.10,4.15,
        # Asia: precios altos (nicho premium)
        5.50,5.60,5.70,5.80, 5.90,6.00,6.20,6.35,
        # Resto
        2.80,2.85,2.90,2.95, 3.00,3.05,3.10,3.15,
    ]
})
exportaciones["revenue"] = exportaciones["toneladas"] * exportaciones["precio_kg"] * 1000

# Problema especifico: plaga en Q3 2024
exportaciones.loc[(exportaciones["trimestre"]=="Q3 2024") &
                  (exportaciones["mercado"]=="EEUU"), "toneladas"] = 95

# Calcular totales
total_q = exportaciones.groupby("trimestre")["revenue"].sum().reset_index()
total_q.columns = ["trimestre","revenue_total"]
total_q["revenue_m"] = total_q["revenue_total"] / 1e6

# ================================================
# PRINCIPIOS DE STORYTELLING CON DATOS
# ================================================
print("\n--- 5 PRINCIPIOS COLE NUSSBAUMER KNAFLIC ---")
principios = {
    "1. Contexto": "Quien es tu audiencia? CEO, analistas, inversores? Adapta la complejidad.",
    "2. Tipo de grafico": "Lineas para tendencias, barras para comparacion, scatter para correlacion.",
    "3. Eliminar ruido": "Quita grids, bordes, colores innecesarios. Menos es mas.",
    "4. Atencion selectiva": "Usa color/grosor para resaltar EL punto mas importante.",
    "5. Narrativa": "Titulo que dice la conclusion, no el tipo de grafico.",
}
for principio, descripcion in principios.items():
    print(f"  {principio:<20}: {descripcion}")

# ================================================
# COMPARACION: grafico generico vs storytelling
# ================================================
fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.patch.set_facecolor("white")

# --- GRAFICO MALO: generico ---
ax_malo = axes[0, 0]
ax_malo.set_title("Exportaciones por Mercado y Trimestre\n(grafico generico — MAL)",
                   fontsize=10, color="#666666")
for mercado in exportaciones["mercado"].unique():
    datos_m = exportaciones[exportaciones["mercado"]==mercado]
    ax_malo.plot(datos_m["trimestre"], datos_m["toneladas"],
                 marker="o", label=mercado)
ax_malo.legend()
ax_malo.tick_params(axis="x", rotation=45, labelsize=7)
ax_malo.set_ylabel("Toneladas")
ax_malo.grid(True, alpha=0.3)
# Problema: colores iguales, titulo descriptivo, no dice el insight

# --- GRAFICO BUENO: storytelling ---
ax_bueno = axes[0, 1]
ax_bueno.set_title("EEUU cayo 44% en Q3 por plaga — Asia compensa el gap",
                    fontsize=10, fontweight="bold", color="#1F2F58")

# Paleta de storytelling: resaltar el problema (EEUU) y la solucion (Asia)
colores_st = {"EEUU":"#D32F2F","Europa":"#BBBBBB","Asia":"#388E3C","Resto":"#BBBBBB"}
grosores   = {"EEUU":3,"Europa":1,"Asia":3,"Resto":1}

for mercado in ["Resto","Europa","Asia","EEUU"]:  # orden: grises primero
    datos_m = exportaciones[exportaciones["mercado"]==mercado]
    ax_bueno.plot(datos_m["trimestre"], datos_m["toneladas"],
                  marker="o",
                  color=colores_st[mercado],
                  linewidth=grosores[mercado],
                  label=mercado,
                  zorder=3 if mercado in ["EEUU","Asia"] else 1,
                  alpha=1.0 if mercado in ["EEUU","Asia"] else 0.4)

# Anotacion del problema
ax_bueno.annotate("Plaga botrytis\n-44% volumen",
                   xy=(6, 95), xytext=(5.5, 60),
                   fontsize=8, color="#D32F2F",
                   arrowprops=dict(arrowstyle="->", color="#D32F2F"))
ax_bueno.annotate("Asia crece\n+480% en 2 años",
                   xy=(7, 52), xytext=(6.5, 65),
                   fontsize=8, color="#388E3C",
                   arrowprops=dict(arrowstyle="->", color="#388E3C"))

ax_bueno.tick_params(axis="x", rotation=45, labelsize=7)
ax_bueno.set_ylabel("Toneladas")
ax_bueno.spines["top"].set_visible(False)
ax_bueno.spines["right"].set_visible(False)
ax_bueno.legend(fontsize=8)

# --- REVENUE TOTAL: antes/despues ---
ax_rev = axes[1, 0]
colores_bar = ["#1F2F58"]*6 + ["#D32F2F"] + ["#73B8E7"]  # Q3 2024 rojo, Q4 celeste
ax_rev.bar(total_q["trimestre"], total_q["revenue_m"],
           color=colores_bar, edgecolor="white")
ax_rev.set_title("Revenue trimestral muestra recuperacion en Q4",
                  fontsize=10, fontweight="bold", color="#1F2F58")
ax_rev.set_ylabel("Millones USD")
ax_rev.tick_params(axis="x", rotation=45, labelsize=7)
ax_rev.spines["top"].set_visible(False)
ax_rev.spines["right"].set_visible(False)

# Anotacion Q3 caida
q3_rev = total_q[total_q["trimestre"]=="Q3 2024"]["revenue_m"].values[0]
ax_rev.text(6, q3_rev + 0.05, f"${q3_rev:.2f}M\n(minimo)", ha="center",
            fontsize=7, color="#D32F2F")

# --- CUADRO SCR: narrativa ejecutiva ---
ax_texto = axes[1, 1]
ax_texto.axis("off")
ax_texto.set_facecolor("#F9F6E7")
ax_texto.set_xlim(0, 1)
ax_texto.set_ylim(0, 1)

narrativa_scr = {
    "SITUACION:": "Florexport SA exporta a 4 mercados. El mercado de EEUU\nrepresenta el 45% de ingresos.",
    "COMPLICACION:": "En Q3 2024, una plaga de botrytis redujo el volumen\nexportado a EEUU en un 44%, causando una caida de\n$2.1M en revenue trimestral.",
    "RESOLUCION:": "El mercado Asia (China+Japon) crecio 480% en 2 años.\nPropuesta: redirigir 30% de produccion a Asia donde\nel precio es 85% superior. ROI esperado: +$1.8M/ano.",
}
colores_scr = {"SITUACION:":"#1F2F58","COMPLICACION:":"#D32F2F","RESOLUCION:":"#388E3C"}
y_pos = 0.85
for titulo, texto in narrativa_scr.items():
    ax_texto.text(0.05, y_pos, titulo, fontsize=10, fontweight="bold",
                  color=colores_scr[titulo], va="top")
    ax_texto.text(0.05, y_pos - 0.08, texto, fontsize=8, color="#333333",
                  va="top", wrap=True)
    y_pos -= 0.32

ax_texto.set_title("NARRATIVA EJECUTIVA (Framework SCR)",
                    fontsize=9, fontweight="bold")

plt.tight_layout()
plt.savefig("sesion07_storytelling.png", dpi=150, bbox_inches="tight")
plt.show()
print("\nStorytelling guardado: sesion07_storytelling.png")

# ================================================
# CHECKLIST DE STORYTELLING
# ================================================
print("\n--- CHECKLIST ANTES DE PRESENTAR ---")
checklist = [
    ("Titulo dice la CONCLUSION (no tipo de grafico)",  True),
    ("Elimine gridlines innecesarias",                   True),
    ("Uso 2-3 colores maximo, el resto gris",            True),
    ("Resalto UN punto con anotacion",                   True),
    ("Tengo contexto: benchmark o periodo anterior",     True),
    ("El insight es accionable (propone algo)",          True),
    ("Audiencia puede entenderlo en < 30 segundos",      True),
    ("Fuente de datos visible y fechada",                False),
]
for item, ok in checklist:
    icon = "[OK]" if ok else "[--]"
    print(f"  {icon} {item}")

print("\n" + "=" * 65)
```

2. Ejecuta el codigo y compara el grafico "malo" con el de storytelling.

3. Toma cualquier grafico anterior de los ejercicios y redisenialo aplicando los 5 principios.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo datos de exportaciones de flores Ecuador. El revenue cayo 18% en Q3 2024 por una plaga. Asia crece 480% pero representa solo el 12% de nuestras exportaciones. Escribe una narrativa ejecutiva de 5 oraciones (formato SCR) que presentaria al CEO para proponer un pivote estrategico hacia Asia."

Despues de leer la respuesta:
- Compara la narrativa de ChatGPT con el cuadro SCR del ejercicio.
- Incorpora las mejoras de redaccion en el grafico de texto.

## Que aprendiste

- El framework SCR (Situacion-Complicacion-Resolucion) estructura cualquier presentacion de datos.
- Un buen titulo de grafico dice la conclusion, no "Ventas por Trimestre".
- El color debe guiar la atencion: usa rojo para el problema, verde para la solucion, gris para el fondo.
- Las anotaciones directas en el grafico eliminan la necesidad de que el lector interprete.
- Reducir a 2-3 colores y eliminar ruido visual aumenta el impacto del mensaje principal.
- La audiencia ejecutiva necesita el insight y la accion recomendada, no los detalles tecnicos.

## Reto extra

Aplica storytelling a los datos del INEC Ecuador: elige una estadistica importante (desempleo, pobreza, inflacion) del ultimo informe publicado. Construye un grafico de storytelling con titulo de conclusion, anotaciones clave, y escribe la narrativa SCR completa de 2 paginas. Presenta el resultado como si fuera para el Ministro de Economia.
