# Ejercicio Sesion 3: Pandas — Filtrado, Agrupacion y Pivot Tables

**Materia:** Python para Ciencia de Datos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Aplicar filtrado avanzado, groupby con funciones de agregacion y pivot tables de Pandas sobre datos de ventas del mercado retail ecuatoriano para responder preguntas de negocio reales usando solo codigo Python.

## Contexto

Corporacion Favorita es el retailer mas grande de Ecuador con mas de 60 marcas (Supermaxi, Megamaxi, Mi Comisariato, TIA, Gran Aki entre otras) y 900+ tiendas. Kaggle tiene un dataset real de Favorita con millones de transacciones llamado "Store Sales - Time Series Forecasting". En este ejercicio trabajaremos con una version simplificada para practicar las operaciones de analisis mas usadas en el sector retail ecuatoriano.

## Instrucciones

1. Abre Google Colab y crea `sesion03_ventas_favorita.ipynb`.

2. Crea el dataset de ventas simulado:

```python
# Python para Ciencia de Datos - Sesion 3: Filtrado y Agrupacion
# ITSEIA - Periodo 3

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
n = 2000  # 2000 transacciones

# Simular ventas Corporacion Favorita Ecuador
tiendas = np.random.choice(['Supermaxi N26', 'Supermaxi CCI', 'Megamaxi 6 de Dic',
                             'TIA Cotocollao', 'Gran Aki Sur', 'Mi Comisariato Norte'], n)
ciudades = {
    'Supermaxi N26': 'Quito', 'Supermaxi CCI': 'Quito',
    'Megamaxi 6 de Dic': 'Quito', 'TIA Cotocollao': 'Quito',
    'Gran Aki Sur': 'Guayaquil', 'Mi Comisariato Norte': 'Guayaquil'
}
categorias = np.random.choice(
    ['Alimentos', 'Bebidas', 'Limpieza', 'Cuidado Personal', 'Electrodomesticos', 'Ropa'],
    n, p=[0.30, 0.20, 0.15, 0.15, 0.10, 0.10]
)
precios = {
    'Alimentos': (2, 25), 'Bebidas': (1, 15), 'Limpieza': (3, 20),
    'Cuidado Personal': (5, 50), 'Electrodomesticos': (50, 800), 'Ropa': (15, 120)
}
ventas_usd = np.array([
    np.random.uniform(*precios[cat]) for cat in categorias
]).round(2)
unidades = np.random.randint(1, 10, n)
fechas = pd.date_range('2024-01-01', '2024-12-31', periods=n)
descuento_pct = np.random.choice([0, 5, 10, 15, 20, 30], n, p=[0.50, 0.20, 0.15, 0.08, 0.05, 0.02])
metodo_pago = np.random.choice(['Efectivo', 'Tarjeta Credito', 'Tarjeta Debito', 'Transferencia'],
                                n, p=[0.35, 0.30, 0.25, 0.10])

df = pd.DataFrame({
    'fecha': fechas,
    'tienda': tiendas,
    'ciudad': [ciudades[t] for t in tiendas],
    'categoria': categorias,
    'precio_unitario': ventas_usd,
    'unidades': unidades,
    'descuento_pct': descuento_pct,
    'metodo_pago': metodo_pago
})
df['venta_total'] = (df['precio_unitario'] * df['unidades'] * (1 - df['descuento_pct']/100)).round(2)
df['mes'] = df['fecha'].dt.month
df['dia_semana'] = df['fecha'].dt.day_name()

print("Dataset Ventas Corporacion Favorita (simulado)")
print(f"Shape: {df.shape}")
print(df.head())
print(f"\nVenta total acumulada: ${df['venta_total'].sum():,.2f}")
```

3. Filtrado avanzado:

```python
# FILTROS SIMPLES
print("1. VENTAS SOBRE $100:")
grandes = df[df['venta_total'] > 100]
print(f"   {len(grandes)} transacciones ({len(grandes)/len(df)*100:.1f}%)")
print(f"   Total: ${grandes['venta_total'].sum():,.2f}")

print("\n2. ELECTRODOMESTICOS EN QUITO:")
electro_quito = df[(df['categoria'] == 'Electrodomesticos') & (df['ciudad'] == 'Quito')]
print(f"   {len(electro_quito)} transacciones")
print(f"   Promedio: ${electro_quito['venta_total'].mean():,.2f}")

print("\n3. COMPRAS CON DESCUENTO EN DICIEMBRE:")
dic_desc = df[(df['mes'] == 12) & (df['descuento_pct'] > 0)]
print(f"   {len(dic_desc)} transacciones con descuento en diciembre")

print("\n4. FILTRO MULTIPLE CON .isin():")
tiendas_premium = ['Supermaxi N26', 'Supermaxi CCI', 'Megamaxi 6 de Dic']
df_premium = df[df['tienda'].isin(tiendas_premium)]
print(f"   Tiendas premium: {len(df_premium)} transacciones")

print("\n5. QUERY (sintaxis alternativa mas legible):")
alto_valor = df.query("venta_total > 200 and categoria != 'Electrodomesticos'")
print(f"   Ventas >$200 sin electrodomesticos: {len(alto_valor)}")
```

4. GroupBy y pivot tables:

```python
# GROUPBY BASICO
print("\nVENTA PROMEDIO POR CATEGORIA:")
por_categoria = df.groupby('categoria')['venta_total'].agg(['mean', 'sum', 'count'])
por_categoria.columns = ['Promedio', 'Total', 'Transacciones']
por_categoria = por_categoria.sort_values('Total', ascending=False)
print(por_categoria.round(2))

print("\nVENTA TOTAL POR CIUDAD Y MES:")
por_ciudad_mes = df.groupby(['ciudad', 'mes'])['venta_total'].sum().unstack()
print(por_ciudad_mes.round(2).to_string())

print("\nAGREGACION MULTIPLE POR TIENDA:")
resumen_tienda = df.groupby('tienda').agg({
    'venta_total': ['sum', 'mean', 'count'],
    'unidades': 'sum',
    'descuento_pct': 'mean'
}).round(2)
resumen_tienda.columns = ['Venta Total', 'Ticket Promedio', 'Transacciones',
                            'Unidades Vendidas', 'Descuento Promedio %']
print(resumen_tienda.sort_values('Venta Total', ascending=False))

# PIVOT TABLE (la herramienta de reportes del Analista de Datos)
print("\nPIVOT TABLE: Venta Total por Categoria x Ciudad")
pivot = pd.pivot_table(
    df,
    values='venta_total',
    index='categoria',
    columns='ciudad',
    aggfunc='sum',
    margins=True,       # agrega fila/columna Total
    margins_name='TOTAL'
)
print(pivot.round(2))

print("\nPIVOT TABLE: Metodo de Pago mas Usado por Dia de Semana")
pivot_pago = pd.pivot_table(
    df,
    values='venta_total',
    index='dia_semana',
    columns='metodo_pago',
    aggfunc='count',
    fill_value=0
)
orden_dias = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
pivot_pago = pivot_pago.reindex([d for d in orden_dias if d in pivot_pago.index])
print(pivot_pago)

# Visualizacion
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
por_categoria['Total'].plot(kind='bar', ax=ax1, color='#1F2F58', alpha=0.85)
ax1.set_title('Venta Total por Categoria\nFavorita Ecuador 2024')
ax1.set_ylabel('USD')
ax1.tick_params(axis='x', rotation=45)
ax1.grid(axis='y', alpha=0.4)

pivot.drop('TOTAL').drop('TOTAL', axis=1).plot(kind='bar', ax=ax2,
    color=['#1F2F58', '#FBBC0C'], alpha=0.85)
ax2.set_title('Venta por Categoria y Ciudad\nFavorita Ecuador 2024')
ax2.set_ylabel('USD')
ax2.tick_params(axis='x', rotation=45)
ax2.legend(title='Ciudad')
ax2.grid(axis='y', alpha=0.4)
plt.suptitle('Analisis Ventas Retail | ITSEIA P3', color='gray')
plt.tight_layout()
plt.show()
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "En Pandas tengo un DataFrame de ventas con columnas: fecha, tienda, categoria, venta_total. Necesito calcular el crecimiento porcentual mes a mes para cada categoria. ¿Como lo hago con groupby y pct_change()? Dame el codigo completo."

Despues de leer la respuesta:
- Implementa el calculo de crecimiento mes a mes en tu dataset.
- Identifica que categoria tuvo el mayor crecimiento porcentual en el segundo semestre.

## Que aprendiste

- `df[condicion]` filtra filas; `df.query("expresion")` es una alternativa mas legible.
- `.isin()` filtra por listas de valores, equivalente a multiples condiciones `|`.
- `groupby('col').agg({'col2': ['sum', 'mean']})` permite multiples funciones de agregacion en una sola linea.
- `pd.pivot_table()` crea tablas cruzadas de resumen con `margins=True` para agregar totales automaticamente.
- El parametro `fill_value=0` en pivot_table rellena celdas vacias, critico para reportes limpios.

## Reto extra

Descarga el dataset real de Corporacion Favorita de Kaggle: `kaggle competitions download -c store-sales-time-series-forecasting`. Carga el archivo `train.csv` y responde: ¿Cual es la tienda con mayor venta total historica? ¿En que mes del año se concentra mas el 25% superior de ventas? Usa solo groupby y filtros de Pandas para responder.
