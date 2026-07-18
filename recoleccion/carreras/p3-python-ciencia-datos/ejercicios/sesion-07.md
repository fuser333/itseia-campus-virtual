# Ejercicio Sesion 7: Limpieza de Datos — Missing Values, Duplicados y Outliers

**Materia:** Python para Ciencia de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 50 min

## Objetivo

Aplicar un pipeline completo de limpieza de datos sobre un dataset de salud del MSP Ecuador: detectar y tratar valores faltantes, eliminar duplicados correctamente y manejar outliers usando metodos estadisticos, documentando cada decision de limpieza con su justificacion.

## Contexto

El Ministerio de Salud Publica (MSP) de Ecuador mantiene el Sistema de Informacion del Buen Vivir (SIBVIM) con datos de pacientes atendidos en hospitales publicos. En la realidad, estos datasets tienen hasta un 15-20% de valores faltantes, entradas duplicadas por errores del sistema y outliers causados por errores de digitacion (edad = 999, peso = 0). La calidad del dato determina la calidad del modelo: "Garbage in, Garbage out" es el principio mas citado en Ciencia de Datos.

## Instrucciones

1. Abre Google Colab y crea `sesion07_limpieza_msp_ecuador.ipynb`.

2. Crea el dataset sucio realista del MSP:

```python
# Python para Ciencia de Datos - Sesion 7: Limpieza de Datos
# ITSEIA - Periodo 3

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

np.random.seed(42)
n = 600

# Dataset SUCIO del MSP Ecuador (con errores realistas)
def crear_dataset_sucio():
    df = pd.DataFrame({
        'paciente_id': [f'EC{str(i).zfill(4)}' for i in range(1, n+1)],
        'edad': np.random.randint(1, 95, n).astype(float),
        'peso_kg': np.random.normal(68, 15, n).clip(30, 150).round(1),
        'talla_cm': np.random.normal(163, 10, n).clip(140, 200).round(1),
        'glucosa_mmolL': np.random.normal(5.8, 2.2, n).clip(2, 25).round(2),
        'presion_sistolica': np.random.normal(125, 20, n).clip(70, 220).round(0),
        'provincia': np.random.choice(
            ['Pichincha', 'Guayas', 'Azuay', 'Manabi', 'Loja', None], n,
            p=[0.25, 0.22, 0.12, 0.14, 0.10, 0.17]
        ),
        'diagnostico': np.random.choice(
            ['Diabetes', 'Hipertension', 'Obesidad', 'Sano', np.nan], n,
            p=[0.18, 0.22, 0.12, 0.40, 0.08]
        ),
        'visitas_anuales': np.random.randint(1, 20, n).astype(float)
    })

    # INTRODUCIR ERRORES REALISTAS
    # 1. Valores faltantes aleatorios
    for col, pct in [('edad', 0.06), ('peso_kg', 0.10), ('talla_cm', 0.08),
                     ('glucosa_mmolL', 0.12), ('presion_sistolica', 0.09)]:
        idx = np.random.choice(n, size=int(n * pct), replace=False)
        df.loc[idx, col] = np.nan

    # 2. Outliers por error de digitacion
    df.loc[np.random.choice(n, 8), 'edad'] = np.random.choice([0, 150, 999], 8)
    df.loc[np.random.choice(n, 5), 'peso_kg'] = np.random.choice([0, 350, 500], 5)
    df.loc[np.random.choice(n, 6), 'glucosa_mmolL'] = np.random.choice([0, 80, 100], 6)

    # 3. Duplicados (mismo paciente registrado dos veces)
    duplicados = df.sample(25, random_state=1)
    df = pd.concat([df, duplicados], ignore_index=True)

    return df

df_original = crear_dataset_sucio()
print("Dataset MSP Ecuador (ANTES DE LIMPIAR):")
print(f"Shape: {df_original.shape}")
print(df_original.head(8))
```

3. Diagnostico completo del dataset:

```python
print("\n" + "="*60)
print("DIAGNOSTICO DEL DATASET")
print("="*60)

# 1. Valores faltantes
print("\n1. VALORES FALTANTES:")
nulos = df_original.isnull().sum()
pct_nulos = (nulos / len(df_original) * 100).round(2)
diagnostico_nulos = pd.DataFrame({'Nulos': nulos, 'Porcentaje': pct_nulos})
diagnostico_nulos = diagnostico_nulos[diagnostico_nulos['Nulos'] > 0].sort_values('Porcentaje', ascending=False)
print(diagnostico_nulos)

# 2. Duplicados
print(f"\n2. DUPLICADOS:")
n_dup = df_original.duplicated().sum()
n_dup_id = df_original.duplicated(subset=['paciente_id']).sum()
print(f"   Filas completamente duplicadas: {n_dup}")
print(f"   Paciente_id duplicados: {n_dup_id}")

# 3. Outliers (visualizacion)
numericas = ['edad', 'peso_kg', 'talla_cm', 'glucosa_mmolL', 'presion_sistolica']
fig, axes = plt.subplots(1, 5, figsize=(18, 4))
for ax, col in zip(axes, numericas):
    df_original[col].dropna().plot(kind='box', ax=ax,
                                    color=dict(boxes='#1F2F58', whiskers='#1F2F58',
                                               medians='#FBBC0C', caps='#1F2F58'))
    ax.set_title(col, fontsize=9)
    ax.grid(axis='y', alpha=0.4)
plt.suptitle('Boxplots ANTES de Limpieza - MSP Ecuador | ITSEIA P3')
plt.tight_layout()
plt.show()
```

4. Pipeline de limpieza documentado:

```python
df_limpio = df_original.copy()

print("PIPELINE DE LIMPIEZA:")
print(f"Shape inicial: {df_limpio.shape}")

# PASO 1: Eliminar duplicados exactos
n_antes = len(df_limpio)
df_limpio = df_limpio.drop_duplicates()
print(f"\nPASO 1 - Duplicados eliminados: {n_antes - len(df_limpio)}")
print(f"  Shape: {df_limpio.shape}")

# PASO 2: Corregir outliers imposibles (errores de digitacion)
# Reglas de dominio del MSP: edad 1-100, peso 20-200, glucosa 2-30
reglas_outlier = {
    'edad': (1, 100),
    'peso_kg': (20, 200),
    'talla_cm': (120, 210),
    'glucosa_mmolL': (2.0, 30.0),
    'presion_sistolica': (60, 250)
}
for col, (minv, maxv) in reglas_outlier.items():
    n_outliers = ((df_limpio[col] < minv) | (df_limpio[col] > maxv)).sum()
    df_limpio.loc[(df_limpio[col] < minv) | (df_limpio[col] > maxv), col] = np.nan
    print(f"\nPASO 2 - Outliers imposibles en '{col}': {n_outliers} -> convertidos a NaN")

# PASO 3: Tratar valores faltantes
print("\nPASO 3 - Imputacion de valores faltantes:")

# Numericas: imputar con mediana (robusta a outliers)
for col in ['edad', 'peso_kg', 'talla_cm', 'glucosa_mmolL', 'presion_sistolica']:
    n_nulos = df_limpio[col].isnull().sum()
    if n_nulos > 0:
        mediana = df_limpio[col].median()
        df_limpio[col].fillna(mediana, inplace=True)
        print(f"  '{col}': {n_nulos} nulos -> imputados con mediana ({mediana:.2f})")

# Categoricas: imputar con moda
for col in ['provincia', 'diagnostico']:
    n_nulos = df_limpio[col].isnull().sum()
    if n_nulos > 0:
        moda = df_limpio[col].mode()[0]
        df_limpio[col].fillna(moda, inplace=True)
        print(f"  '{col}': {n_nulos} nulos -> imputados con moda ('{moda}')")

# PASO 4: Detectar y tratar outliers estadisticos con IQR
print("\nPASO 4 - Outliers estadisticos (metodo IQR):")
for col in ['glucosa_mmolL', 'presion_sistolica', 'visitas_anuales']:
    Q1 = df_limpio[col].quantile(0.25)
    Q3 = df_limpio[col].quantile(0.75)
    IQR = Q3 - Q1
    limite_inf = Q1 - 1.5 * IQR
    limite_sup = Q3 + 1.5 * IQR
    n_outliers = ((df_limpio[col] < limite_inf) | (df_limpio[col] > limite_sup)).sum()
    # Winsorizar en lugar de eliminar (reemplazar por los limites)
    df_limpio[col] = df_limpio[col].clip(limite_inf, limite_sup)
    print(f"  '{col}': {n_outliers} outliers estadisticos winzorizados [{limite_inf:.2f}, {limite_sup:.2f}]")

# RESUMEN FINAL
print(f"\n{'='*50}")
print(f"RESUMEN LIMPIEZA:")
print(f"  Filas originales:  {len(df_original)}")
print(f"  Filas finales:     {len(df_limpio)}")
print(f"  Filas eliminadas:  {len(df_original) - len(df_limpio)}")
print(f"  Nulos restantes:   {df_limpio.isnull().sum().sum()}")
print(f"  Dataset listo:     {'SI' if df_limpio.isnull().sum().sum() == 0 else 'NO'}")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "En limpieza de datos tengo tres estrategias para outliers: eliminar la fila, reemplazar con la mediana, o winsorizar. Cuando aplico cada una en un contexto medico (datos de pacientes del MSP Ecuador)? Dame criterios de decision con ejemplos concretos."

Despues de leer la respuesta:
- Aplica el criterio de ChatGPT para decidir si winsorizas o eliminas los outliers de glucosa_mmolL.
- Documenta tu decision con un comentario en el notebook.

## Que aprendiste

- El diagnostico de datos es el primer paso: `.isnull().sum()`, `.duplicated()` y boxplots revelan los problemas.
- Los outliers tienen dos tipos: **imposibles por dominio** (edad=999) que se convierten a NaN, y **estadisticos** (IQR) que se winzorizan o eliminan segun el contexto.
- **Imputacion con mediana** es mas robusta que la media cuando hay outliers residuales.
- La winsorizacion con `.clip()` reemplaza valores extremos por los limites del rango aceptable sin eliminar filas.
- Cada decision de limpieza debe estar documentada: modifica resultados del modelo y debe ser reproducible.

## Reto extra

Implementa una funcion `reporte_calidad(df)` que reciba cualquier DataFrame y devuelva: porcentaje de nulos por columna, numero de duplicados exactos, numero de outliers IQR por columna numerica, y una puntuacion de calidad del 0 al 100 (100 = dataset perfecto). Pruebala con el dataset antes y despues de la limpieza.
