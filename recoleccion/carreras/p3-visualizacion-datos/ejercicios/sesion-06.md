# Ejercicio Sesion 6: Power BI Basico con Datos Ecuador

**Materia:** Visualizacion de Datos
**Nivel:** Intermedio
**Herramienta IA:** Copilot (integrado en Power BI)
**Duracion estimada:** 50 min

## Objetivo

Construir un reporte interactivo en Power BI Desktop usando datos reales del Ecuador, aplicando transformaciones en Power Query, creando medidas DAX basicas y disenando un layout profesional con segmentadores de datos (slicers).

## Contexto

El 80% de empresas medianas en Ecuador usan Excel para sus reportes. Power BI es el siguiente paso: convierte esas mismas hojas de calculo en dashboards interactivos que cualquier gerente puede explorar sin saber programacion. Como analista de datos en ITSEIA o en una empresa ecuatoriana, dominar Power BI te diferencia inmediatamente del 95% de candidatos en el mercado laboral local.

## Instrucciones

1. Descarga e instala **Power BI Desktop** (gratuito) desde powerbi.microsoft.com. Solo disponible para Windows. Si usas Mac, ejecutalo en una maquina virtual Windows o usa Power BI en la web (app.powerbi.com con cuenta gratuita).

2. Prepara el archivo de datos. Crea en Google Colab el archivo CSV que usaras:

```python
# ITSEIA - Visualizacion de Datos - Sesion 6
# Generar dataset para Power BI con datos Ecuador

import pandas as pd
import numpy as np

np.random.seed(2024)

# Datos de ventas de una empresa importadora ecuatoriana (ficticia)
# Representa una empresa mediana con 3 años de operacion

provincias = {
    'Pichincha': 0.28, 'Guayas': 0.32, 'Azuay': 0.10,
    'Manabi': 0.08, 'Tungurahua': 0.06, 'El Oro': 0.05,
    'Imbabura': 0.05, 'Otras': 0.06
}

categorias = ['Tecnologia', 'Electrohogar', 'Celulares', 'Audio-Video', 'Computacion']
vendedores = ['Ana Ortega', 'Carlos Perez', 'Maria Loja', 'Diego Vega', 'Sofia Torres']

filas = []
fechas = pd.date_range('2022-01-01', '2024-12-31', freq='D')

for _ in range(2000):
    fecha = np.random.choice(fechas)
    prov = np.random.choice(list(provincias.keys()), p=list(provincias.values()))
    cat = np.random.choice(categorias)
    vend = np.random.choice(vendedores)

    precio_base = {'Tecnologia': 800, 'Electrohogar': 350, 'Celulares': 450,
                   'Audio-Video': 250, 'Computacion': 650}[cat]

    cantidad = np.random.randint(1, 8)
    precio = round(precio_base * np.random.uniform(0.85, 1.25), 2)
    costo = round(precio * np.random.uniform(0.55, 0.70), 2)

    filas.append({
        'Fecha': fecha.strftime('%Y-%m-%d'),
        'Anio': fecha.year,
        'Mes': fecha.month,
        'Mes_Nombre': fecha.strftime('%b'),
        'Trimestre': f"Q{fecha.quarter}",
        'Provincia': prov,
        'Region': 'Sierra' if prov in ['Pichincha','Azuay','Tungurahua','Imbabura'] else 'Costa',
        'Categoria': cat,
        'Vendedor': vend,
        'Cantidad': cantidad,
        'Precio_Unitario': precio,
        'Costo_Unitario': costo,
        'Venta_Total': round(precio * cantidad, 2),
        'Costo_Total': round(costo * cantidad, 2)
    })

df_ventas = pd.DataFrame(filas)
df_ventas['Utilidad'] = df_ventas['Venta_Total'] - df_ventas['Costo_Total']
df_ventas['Margen_pct'] = (df_ventas['Utilidad'] / df_ventas['Venta_Total'] * 100).round(1)

df_ventas.to_csv('ventas_ecuador_2022_2024.csv', index=False, encoding='utf-8-sig')
print(f"CSV generado: {len(df_ventas)} filas")
print(df_ventas.head())
print(f"\nVenta total: ${df_ventas['Venta_Total'].sum():,.0f}")
```

3. En Power BI Desktop, sigue estos pasos:

**Paso A: Cargar datos**
- Inicio > Obtener datos > Texto/CSV
- Selecciona `ventas_ecuador_2022_2024.csv`
- En la vista previa, verifica que la columna `Fecha` sea tipo Fecha (no texto)
- Clic en "Transformar datos" (abre Power Query)

**Paso B: Transformar en Power Query**
- Selecciona la columna `Fecha` > Tipo > Fecha
- Verifica que `Venta_Total`, `Costo_Total`, `Utilidad` sean tipo Numero decimal
- Verifica que `Anio` y `Mes` sean tipo Numero entero
- Crea una columna personalizada: Columna > Columna personalizada
  - Nombre: `Precio_Rango`
  - Formula: `if [Precio_Unitario] < 300 then "Economico" else if [Precio_Unitario] < 700 then "Medio" else "Premium"`
- Clic en "Cerrar y aplicar"

**Paso C: Crear medidas DAX**

En la vista Datos, selecciona la tabla y crea estas medidas (clic derecho > Nueva medida):

```dax
// Medida 1: Ventas totales
Ventas Totales = SUM(ventas_ecuador_2022_2024[Venta_Total])

// Medida 2: Utilidad total
Utilidad Total = SUM(ventas_ecuador_2022_2024[Utilidad])

// Medida 3: Margen promedio
Margen Promedio % = AVERAGE(ventas_ecuador_2022_2024[Margen_pct])

// Medida 4: Ventas anio anterior (para comparacion)
Ventas Anio Anterior = CALCULATE(
    [Ventas Totales],
    SAMEPERIODLASTYEAR(ventas_ecuador_2022_2024[Fecha])
)

// Medida 5: Crecimiento YoY
Crecimiento YoY % = DIVIDE(
    [Ventas Totales] - [Ventas Anio Anterior],
    [Ventas Anio Anterior],
    0
) * 100
```

**Paso D: Diseno del reporte**

Crea una pagina llamada "Resumen Ejecutivo" con estos elementos:

- **4 tarjetas (cards):** Ventas Totales | Utilidad Total | Margen Promedio | Crecimiento YoY
- **Grafico de barras apiladas:** Ventas por Provincia, coloreado por Categoria
- **Grafico de lineas:** Ventas mensuales 2022-2024, una linea por Anio
- **Treemap:** Ventas por Vendedor
- **Segmentador (slicer) horizontal:** Anio
- **Segmentador vertical:** Region (Sierra/Costa)
- **Tabla:** Provincia | Ventas Totales | Utilidad Total | Margen Promedio (ordenado por Ventas desc)

**Paso E: Formato**
- Fondo de pagina: color #1F2F58
- Tarjetas: fondo blanco, borde #FBBC0C
- Titulo del reporte: "Dashboard Ventas — Ecuador 2022-2024"

4. Guarda el archivo como `dashboard_ventas_ecuador.pbix`.

5. Exporta la pagina como PDF: Archivo > Exportar > Exportar a PDF.

## Usa IA para...

En Power BI Desktop, usa el boton "Copilot" (si tienes licencia Pro) o accede a copilot.microsoft.com y escribe:

> "Soy analista de datos en Ecuador. Tengo un dataset de ventas con columnas: Fecha, Provincia, Categoria, Vendedor, Venta_Total, Utilidad. Necesito una formula DAX para calcular las ventas acumuladas del mes actual comparadas con el mismo mes del anio pasado. Dame la formula con comentarios explicativos."

Si no tienes Copilot disponible, usa Claude con el mismo prompt.

## Que aprendiste

- Power Query transforma y limpia datos antes de cargarlos al modelo, separando ETL del analisis.
- Las medidas DAX son formulas calculadas dinamicamente segun los filtros activos del reporte.
- `CALCULATE()` modifica el contexto de filtro, es la funcion mas poderosa de DAX.
- `SAMEPERIODLASTYEAR()` es una funcion de inteligencia de tiempo que compara periodos automaticamente.
- Los slicers permiten al usuario final filtrar el reporte sin saber nada de datos.

## Reto extra

Agrega una segunda pagina al reporte llamada "Analisis de Vendedores". Debe mostrar: ranking de vendedores por utilidad (no por ventas), tasa de conversion (utilidad/venta) por vendedor, y una tabla de detalle con las 10 ventas mas grandes de cada vendedor. Usa un slicer de Categoria para filtrar toda la pagina.
