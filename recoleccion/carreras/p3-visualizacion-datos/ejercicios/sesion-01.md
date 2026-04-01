# Ejercicio Sesion 1: Principios de Visualizacion de Datos

**Materia:** Visualizacion de Datos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Aplicar los principios de Edward Tufte para seleccionar el tipo de grafico correcto segun el tipo de dato, evitando el "chartjunk" y maximizando la relacion dato-tinta en graficos sobre Ecuador.

## Contexto

Ecuador genera toneladas de datos publicos: el INEC publica estadisticas de empleo, el Banco Central publica PIB mensual, el MSP publica datos de salud. El problema no es la falta de datos sino la mala visualizacion: graficos 3D sin necesidad, colores que no comunican, ejes truncados. Tufte, el padre de la visualizacion moderna, dice que un buen grafico muestra los datos con la minima tinta necesaria. En este ejercicio aplicaremos sus reglas con datos reales del Ecuador.

## Instrucciones

1. Abre un cuaderno en Google Colab y nombralo `sesion01_principios_viz.ipynb`.

2. Instala e importa las librerias necesarias:

```python
# ITSEIA - Visualizacion de Datos - Sesion 1
# Principios de visualizacion: Tufte

import matplotlib.pyplot as plt
import matplotlib as mpl
import numpy as np

# Datos reales: Tasa de desempleo Ecuador 2019-2024 (INEC)
anios = [2019, 2020, 2021, 2022, 2023, 2024]
desempleo = [3.8, 6.2, 5.8, 4.2, 3.6, 3.4]  # porcentaje

# Datos PIB Ecuador (variacion anual %, Banco Central)
pib_var = [0.1, -7.8, 4.2, 3.0, 2.4, 2.1]
```

3. Crea el mismo grafico DOS veces: primero con "chartjunk" (el estilo malo) y luego con los principios de Tufte:

```python
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# --- GRAFICO MALO (Chartjunk) ---
ax1.bar(anios, desempleo, color=['red','blue','green','orange','purple','cyan'],
        edgecolor='black', linewidth=2, width=0.6)
ax1.set_facecolor('#EEEEEE')
ax1.grid(True, linewidth=2, linestyle='--', color='white')
ax1.set_title('TASA DE DESEMPLEO ECUADOR!!!', fontsize=14, fontweight='bold', color='red')
ax1.set_xlabel('Anio', fontsize=12)
ax1.set_ylabel('Porcentaje (%)', fontsize=12)
ax1.set_ylim(0, 10)
# Leyenda innecesaria
for i, v in enumerate(desempleo):
    ax1.text(anios[i], v + 0.2, f'{v}%', ha='center', fontsize=9, color='black')

# --- GRAFICO TUFTE (Minimalista y claro) ---
# Color sobrio, sin borde, fondo blanco
color_principal = '#1F2F58'
ax2.bar(anios, desempleo, color=color_principal, width=0.5, alpha=0.85)
ax2.set_facecolor('white')

# Solo etiquetas esenciales
for i, v in enumerate(desempleo):
    ax2.text(anios[i], v + 0.1, f'{v}%', ha='center', fontsize=9, color='#444444')

# Eliminar bordes innecesarios (spine removal - principio Tufte)
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)
ax2.spines['left'].set_visible(False)
ax2.yaxis.set_visible(False)

# Titulo descriptivo y discreto
ax2.set_title('Tasa de desempleo Ecuador 2019-2024\nFuente: INEC',
              fontsize=11, color='#333333', loc='left')
ax2.set_xticks(anios)

# Linea de referencia util (promedio)
promedio = np.mean(desempleo)
ax2.axhline(promedio, color='#F0846D', linewidth=1, linestyle='--', alpha=0.7)
ax2.text(2024.1, promedio, f'Prom: {promedio:.1f}%', fontsize=8, color='#F0846D', va='center')

plt.tight_layout()
plt.savefig('comparacion_tufte.png', dpi=150, bbox_inches='tight')
plt.show()
print("Principio aplicado: data-ink ratio - solo la tinta que muestra datos importa.")
```

4. Ahora aplica el principio de "elegir el grafico correcto":

```python
# Regla: el tipo de grafico depende de QUE comparas
# - Barras: comparar categorias
# - Lineas: tendencia en el tiempo
# - Dispersion: relacion entre dos variables
# - Pastel: solo para composicion (max 5 categorias)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.suptitle('Tipos de grafico segun el proposito — Datos Ecuador',
             fontsize=13, color='#1F2F58')

# 1. LINEA: tendencia temporal (correcto para serie de tiempo)
axes[0,0].plot(anios, desempleo, marker='o', color='#1F2F58', linewidth=2)
axes[0,0].set_title('Linea: tendencia temporal (CORRECTO)', fontsize=9)
for spine in ['top','right']: axes[0,0].spines[spine].set_visible(False)

# 2. BARRA: comparacion entre anios (tambien valido)
axes[0,1].bar(anios, desempleo, color='#73B8E7', width=0.5)
axes[0,1].set_title('Barras: comparacion puntual (VALIDO)', fontsize=9)
for spine in ['top','right']: axes[0,1].spines[spine].set_visible(False)

# 3. DISPERSION: relacion desempleo vs variacion PIB
axes[1,0].scatter(pib_var, desempleo, color='#F0846D', s=80, zorder=5)
for i, anio in enumerate(anios):
    axes[1,0].annotate(str(anio), (pib_var[i], desempleo[i]),
                       textcoords="offset points", xytext=(5,3), fontsize=7)
axes[1,0].set_xlabel('Variacion PIB (%)')
axes[1,0].set_ylabel('Desempleo (%)')
axes[1,0].set_title('Dispersion: relacion entre variables', fontsize=9)
for spine in ['top','right']: axes[1,0].spines[spine].set_visible(False)

# 4. PASTEL: composicion sectores economicos Ecuador 2024
sectores = ['Petroleo', 'Agricultura', 'Manufactura', 'Servicios', 'Otros']
pcts = [12, 9, 18, 52, 9]
colors_pastel = ['#1F2F58','#73B8E7','#FBBC0C','#F0846D','#F9F6E7']
axes[1,1].pie(pcts, labels=sectores, colors=colors_pastel,
              autopct='%1.0f%%', startangle=90, textprops={'fontsize':8})
axes[1,1].set_title('Pastel: composicion sectorial PIB (max 5 cat.)', fontsize=9)

plt.tight_layout()
plt.savefig('tipos_graficos_ecuador.png', dpi=150, bbox_inches='tight')
plt.show()
```

5. Observa y responde en una celda de texto: Para los datos de desempleo 2019-2024, ¿cual es mejor, linea o barra? ¿Por que? Escribe 3 lineas justificando.

## Usa IA para...

> Abre Claude y escribe:
> "Explica los 5 principios principales de Edward Tufte para visualizacion de datos. Para cada principio, dame un ejemplo de como se viola comunmente en reportes de empresas ecuatorianas y como corregirlo."

Luego pregunta:
> "Tengo un dataset con ventas mensuales de 3 productos durante 2 años en Ecuador. ¿Que tipo de grafico me recomiendas usar y por que? Dame el codigo Python."

Compara la respuesta de Claude con lo que aprendiste en el ejercicio.

## Que aprendiste

- El principio data-ink ratio de Tufte: eliminar todo elemento que no aporte informacion.
- Chartjunk: colores innecesarios, cuadriculas gruesas, efectos 3D reducen la claridad.
- Cada tipo de grafico tiene un proposito: lineas para tendencia, barras para comparacion, dispersion para relaciones, pastel para composicion.
- Eliminar bordes (spines) y etiquetas del eje Y cuando los valores ya estan sobre las barras.
- `plt.savefig()` para exportar con alta resolucion (dpi=150 o mas).

## Reto extra

Descarga el dataset de "Exportaciones por producto Ecuador 2023" desde el Banco Central (datos.bce.fin.ec) o usa datos de la siguiente tabla aproximada: Banano $3.8B, Camaron $5.1B, Petroleo $4.2B, Rosas $1.1B, Cacao $0.9B, Otros $2.3B. Aplica estrictamente los principios de Tufte para crear un unico grafico que muestre esta composicion. Publica el PNG en el chat del grupo con el hashtag `#TufteEcuador`.
