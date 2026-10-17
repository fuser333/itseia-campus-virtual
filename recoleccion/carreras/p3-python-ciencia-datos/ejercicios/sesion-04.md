# Ejercicio Sesion 4: Pandas — Merge, Join y Concatenacion

**Materia:** Python para Ciencia de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Combinar multiples fuentes de datos ecuatorianas usando merge, join y concat de Pandas para construir un dataset analítico unificado a partir de tablas separadas de clientes, transacciones y regiones del Ecuador.

## Contexto

En el mundo real, los datos de una empresa ecuatoriana nunca estan en una sola tabla. El sistema del BCE tiene tablas de sucursales, transacciones y clientes separadas. El IESS tiene tablas de afiliados, empleadores y prestaciones en bases de datos distintas. Un Analista de Datos pasa el 30-40% de su tiempo uniendo tablas (merge/join). Dominar estas operaciones es tan importante como saber machine learning: sin datos limpios y consolidados, ningun modelo funciona.

## Instrucciones

1. Abre Google Colab y crea `sesion04_merge_join_ecuador.ipynb`.

2. Crea las tres tablas base:

```python
# Python para Ciencia de Datos - Sesion 4: Merge, Join, Concat
# ITSEIA - Periodo 3

import pandas as pd
import numpy as np

# TABLA 1: Clientes banco ecuatoriano
df_clientes = pd.DataFrame({
    'cliente_id': [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010],
    'nombre': ['Ana Quezada', 'Luis Mora', 'Sofia Vega', 'Carlos Paz', 'Maria Lara',
               'Pedro Suarez', 'Elena Castro', 'Diego Rios', 'Carmen Fuentes', 'Juan Torres'],
    'provincia': ['Pichincha', 'Guayas', 'Azuay', 'Pichincha', 'Manabi',
                  'Guayas', 'Tungurahua', 'Loja', 'Pichincha', 'El Oro'],
    'segmento': ['Premium', 'Estandar', 'Premium', 'Estandar', 'Basico',
                 'Estandar', 'Premium', 'Basico', 'Estandar', 'Basico'],
    'edad': [35, 42, 28, 55, 38, 61, 29, 47, 34, 52]
})

# TABLA 2: Transacciones (solo algunos clientes tienen transacciones)
df_transacciones = pd.DataFrame({
    'transaccion_id': range(101, 116),
    'cliente_id': [1001, 1002, 1001, 1003, 1005, 1002, 1004, 1007, 1008, 1001, 1003, 1006, 1009, 1002, 1010],
    'monto': [2500, 800, 15000, 4200, 350, 1200, 9800, 3400, 560, 7800, 1100, 4500, 2200, 950, 1800],
    'tipo': ['Deposito', 'Retiro', 'Transferencia', 'Deposito', 'Pago', 'Deposito',
             'Transferencia', 'Retiro', 'Pago', 'Deposito', 'Retiro', 'Transferencia',
             'Deposito', 'Pago', 'Deposito'],
    'fecha': pd.date_range('2024-01-15', periods=15, freq='8D')
})

# TABLA 3: Informacion de provincias (INEC)
df_provincias = pd.DataFrame({
    'provincia': ['Pichincha', 'Guayas', 'Azuay', 'Manabi', 'Tungurahua',
                  'Loja', 'El Oro', 'Imbabura', 'Chimborazo'],
    'region': ['Sierra', 'Costa', 'Sierra', 'Costa', 'Sierra', 'Sierra', 'Costa', 'Sierra', 'Sierra'],
    'pib_provincial_mmusd': [21500, 18200, 4100, 3200, 2800, 1900, 2100, 1600, 1400],
    'poblacion_miles': [3228, 4351, 838, 1436, 579, 520, 637, 449, 534]
})

print("TABLA 1 - Clientes:")
print(df_clientes)
print(f"\nTABLA 2 - Transacciones: {len(df_transacciones)} registros")
print(df_transacciones.head())
print(f"\nTABLA 3 - Provincias: {len(df_provincias)} provincias")
print(df_provincias)
```

3. Aplica los cuatro tipos de merge:

```python
print("\n" + "="*65)
print("TIPOS DE MERGE - Como en SQL JOIN")
print("="*65)

# INNER JOIN: solo registros que existen en AMBAS tablas
inner = pd.merge(df_clientes, df_transacciones, on='cliente_id', how='inner')
print(f"\n1. INNER JOIN (clientes con transacciones):")
print(f"   Clientes: {len(df_clientes)} | Transacciones: {len(df_transacciones)} | Resultado: {len(inner)}")
print(inner[['nombre', 'provincia', 'tipo', 'monto']].head(5))

# LEFT JOIN: todos los clientes, con o sin transacciones
left = pd.merge(df_clientes, df_transacciones, on='cliente_id', how='left')
sin_transaccion = left[left['transaccion_id'].isna()]
print(f"\n2. LEFT JOIN (todos los clientes):")
print(f"   Resultado: {len(left)} filas | Clientes sin transacciones: {len(sin_transaccion)}")
print("   Clientes sin actividad:")
print(sin_transaccion[['nombre', 'provincia', 'segmento']].to_string(index=False))

# RIGHT JOIN
right = pd.merge(df_clientes, df_transacciones, on='cliente_id', how='right')
print(f"\n3. RIGHT JOIN (todas las transacciones): {len(right)} filas")

# OUTER JOIN: union completa
outer = pd.merge(df_clientes, df_transacciones, on='cliente_id', how='outer')
print(f"\n4. OUTER JOIN (todo + todo): {len(outer)} filas")

# MERGE CON COLUMNA DIFERENTE (provincia en clientes vs provincia en provincias)
enriquecido = pd.merge(df_clientes, df_provincias, on='provincia', how='left')
print(f"\n5. ENRIQUECER clientes con datos provinciales:")
print(enriquecido[['nombre', 'provincia', 'region', 'pib_provincial_mmusd']].head(8))
```

4. Dataset analitico final y concatenacion:

```python
# DATASET ANALITICO COMPLETO (3 tablas unidas)
df_completo = (
    df_clientes
    .merge(df_transacciones, on='cliente_id', how='left')
    .merge(df_provincias, on='provincia', how='left')
)

print("\nDATASET ANALITICO UNIFICADO:")
print(df_completo.shape)
print(df_completo.head())

# Analisis sobre el dataset unificado
print("\nMONTO PROMEDIO POR SEGMENTO:")
print(df_completo.groupby('segmento')['monto'].agg(['mean', 'sum', 'count']).round(2))

print("\nACTIVIDAD POR REGION:")
print(df_completo.groupby('region')['monto'].agg(['sum', 'count']).round(2))

# CONCATENACION: apilar DataFrames del mismo schema (ej: datos de dos periodos)
df_2023 = df_transacciones.copy()
df_2023['fecha'] = df_2023['fecha'] - pd.DateOffset(years=1)
df_2023['periodo'] = '2023'
df_2024 = df_transacciones.copy()
df_2024['periodo'] = '2024'

df_historico = pd.concat([df_2023, df_2024], ignore_index=True)
print(f"\nCONCATENACION - Historico 2023+2024:")
print(f"Shape: {df_historico.shape}")
print(df_historico.groupby('periodo')['monto'].agg(['sum', 'count']).round(2))

# Crecer el monto 12% en 2024 vs 2023
monto_2023 = df_historico[df_historico['periodo']=='2023']['monto'].sum()
monto_2024 = df_historico[df_historico['periodo']=='2024']['monto'].sum()
print(f"\nCrecimiento YoY: {(monto_2024/monto_2023 - 1)*100:.1f}%")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "En Pandas, ¿cuando uso pd.merge() vs df.join() vs pd.concat()? Explica la diferencia con un ejemplo de datos bancarios ecuatorianos. ¿Que pasa si hay valores duplicados en la columna de union?"

Despues de leer la respuesta:
- Pregunta: "¿Como detecto si un merge genero mas filas de las esperadas (explosion de filas por duplicados)? Dame un metodo para validar que el merge es correcto."
- Implementa esa validacion en tu notebook.

## Que aprendiste

- `pd.merge(left, right, on='clave', how='tipo')` une tablas igual que SQL JOIN.
- **INNER** devuelve solo las filas con coincidencia en ambos lados; **LEFT** mantiene todas las filas del lado izquierdo.
- La columna `on=` debe existir con el mismo nombre en ambas tablas; si difieren, usa `left_on=` y `right_on=`.
- `pd.concat([df1, df2])` apila DataFrames con el mismo esquema verticalmente (axis=0) u horizontalmente (axis=1).
- Un merge bien hecho preserva el numero esperado de filas: siempre verifica `df.shape` antes y despues de un merge.

## Reto extra

El IESS publica datos de afiliados por provincia y sector economico. Crea tres DataFrames simulados (afiliados, empleadores, sectores) y unelos con merges encadenados. Asegurate de que el dataset final no tenga duplicados ni registros fantasma. Usa `.duplicated()` y `.isna().sum()` para validar la integridad del resultado.
