# Ejercicio Sesion 8: Aplicacion — PCA para Reduccion de Dimensionalidad

**Materia:** Matematicas II (Algebra Lineal)
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Implementar PCA (Principal Component Analysis) paso a paso desde algebra lineal pura, aplicarlo a un dataset real de datos socioeconomicos de Ecuador, y visualizar como reduce dimensiones preservando la informacion esencial.

## Contexto

El INEC Ecuador publica datos cantonales con 8 indicadores por canton: tasa de pobreza, desempleo, analfabetismo, cobertura de salud, cobertura de agua potable, ingreso promedio, densidad poblacional y porcentaje de poblacion urbana. Son 8 dimensiones — demasiadas para visualizar. PCA las reduce a 2 dimensiones sin perder la estructura principal de los datos.

**Dataset — 10 cantones Ecuador (datos INEC 2022, simplificados):**

| Canton      | Pobreza% | Desempleo% | Analfabetismo% | Salud% | Agua% | Ingreso$ | DensPob | Urbano% |
|-------------|----------|------------|----------------|--------|-------|----------|---------|---------|
| Quito       | 12       | 4.2        | 2.1            | 92     | 95    | 850      | 450     | 78      |
| Guayaquil   | 18       | 5.8        | 3.4            | 85     | 88    | 720      | 520     | 82      |
| Cuenca      | 14       | 3.9        | 2.8            | 90     | 93    | 780      | 210     | 65      |
| Ambato      | 22       | 4.5        | 3.9            | 82     | 85    | 620      | 180     | 60      |
| Loja        | 26       | 5.1        | 4.2            | 78     | 80    | 560      | 95      | 55      |
| Machala     | 20       | 5.3        | 3.8            | 80     | 82    | 590      | 145     | 68      |
| Esmeraldas  | 38       | 7.2        | 6.5            | 65     | 62    | 420      | 75      | 52      |
| Riobamba    | 28       | 4.8        | 5.1            | 75     | 78    | 510      | 120     | 50      |
| Ibarra      | 19       | 4.1        | 3.5            | 83     | 87    | 640      | 160     | 63      |
| Portoviejo  | 31       | 6.3        | 5.8            | 70     | 68    | 470      | 100     | 58      |

## Instrucciones

**Implementa PCA paso a paso en Python:**

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler

cantones = ['Quito','Guayaquil','Cuenca','Ambato','Loja',
            'Machala','Esmeraldas','Riobamba','Ibarra','Portoviejo']

# Datos: filas = cantones, columnas = indicadores
X = np.array([
    [12,  4.2, 2.1, 92, 95, 850, 450, 78],
    [18,  5.8, 3.4, 85, 88, 720, 520, 82],
    [14,  3.9, 2.8, 90, 93, 780, 210, 65],
    [22,  4.5, 3.9, 82, 85, 620, 180, 60],
    [26,  5.1, 4.2, 78, 80, 560,  95, 55],
    [20,  5.3, 3.8, 80, 82, 590, 145, 68],
    [38,  7.2, 6.5, 65, 62, 420,  75, 52],
    [28,  4.8, 5.1, 75, 78, 510, 120, 50],
    [19,  4.1, 3.5, 83, 87, 640, 160, 63],
    [31,  6.3, 5.8, 70, 68, 470, 100, 58],
])

# PASO 1: Estandarizar (media=0, std=1) — CRITICO en PCA
scaler = StandardScaler()
X_std = scaler.fit_transform(X)
print("Datos estandarizados (primeras 3 filas):")
print(X_std[:3].round(2))

# PASO 2: Calcular matriz de covarianza
cov_matrix = np.cov(X_std.T)
print("\nForma de la matriz de covarianza:", cov_matrix.shape)

# PASO 3: Descomposicion espectral (eigenvalues y eigenvectors)
eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)

# Ordenar de mayor a menor eigenvalue
idx = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[idx].real
eigenvectors = eigenvectors[:, idx].real

# PASO 4: Varianza explicada por cada componente
varianza_explicada = eigenvalues / eigenvalues.sum() * 100
print("\nVarianza explicada por componente:")
for i, v in enumerate(varianza_explicada):
    print(f"  PC{i+1}: {v:.1f}% (acumulado: {varianza_explicada[:i+1].sum():.1f}%)")

# PASO 5: Proyectar datos en los 2 primeros componentes
W = eigenvectors[:, :2]          # Matriz de proyeccion (8 x 2)
X_pca = X_std @ W                # Datos proyectados (10 x 2)

print("\nCoordenadas en espacio PCA (PC1, PC2):")
for i, canton in enumerate(cantones):
    print(f"  {canton:12s}: PC1={X_pca[i,0]:.2f}, PC2={X_pca[i,1]:.2f}")

# PASO 6: Visualizacion
plt.figure(figsize=(10, 7))
plt.scatter(X_pca[:, 0], X_pca[:, 1], c='#1F2F58', s=100, zorder=5)
for i, canton in enumerate(cantones):
    plt.annotate(canton, (X_pca[i, 0], X_pca[i, 1]),
                 textcoords="offset points", xytext=(8, 5), fontsize=9)
plt.xlabel(f'PC1 ({varianza_explicada[0]:.1f}% varianza)')
plt.ylabel(f'PC2 ({varianza_explicada[1]:.1f}% varianza)')
plt.title('PCA — Cantones Ecuador por Desarrollo Socioeconomico')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('pca_cantones_ecuador.png', dpi=150)
plt.show()
```

**Preguntas de analisis:**

1. ¿Cuantos componentes principales necesitas para explicar el 90% de la varianza?
2. En el grafico, ¿Quito y Cuenca estan cerca o lejos de Esmeraldas? ¿Tiene sentido con los datos originales?
3. El PC1 (primer componente): ¿que variables crees que lo dominan — las de pobreza/desempleo o las de salud/ingreso?
4. ¿Por que es necesario estandarizar los datos ANTES de aplicar PCA?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Aplique PCA a un dataset de 10 cantones de Ecuador con 8 indicadores socioeconomicos del INEC. El primer componente explica [X]% de la varianza y el segundo [Y]%. ¿Como interpreto lo que representa cada componente principal? ¿Que me dice sobre el desarrollo de los cantones que estan juntos en el grafico vs los que estan separados? Ademas, ¿en que se diferencia esta implementacion manual con sklearn.decomposition.PCA?"

Luego verifica con sklearn:
```python
from sklearn.decomposition import PCA
pca = PCA(n_components=2)
X_sk = pca.fit_transform(X_std)
print("Varianza explicada (sklearn):", pca.explained_variance_ratio_ * 100)
```

## Que aprendiste

- **PCA** es algebra lineal aplicada: estandarizacion → covarianza → eigendecomposicion → proyeccion.
- Los **eigenvalues** de la covarianza miden cuanta informacion (varianza) captura cada componente.
- Los **eigenvectors** son las nuevas direcciones optimas para representar los datos con menos dimensiones.
- Reducir de 8 a 2 dimensiones con PCA conserva la estructura principal → permite visualizar clusters.
- En ML, PCA se usa para: reducir ruido, acelerar entrenamiento, evitar la maldicion de la dimensionalidad.

## Reto extra

Usa la implementacion manual de PCA (sin sklearn) para encontrar los "loadings" — los pesos que cada variable original aporta al PC1. ¿Que combinacion de indicadores define el "eje de desarrollo" principal de los cantones ecuatorianos? Grafica un "biplot" que muestre simultaneamente los cantones y los vectores de las variables originales en el espacio PCA. Busca en matplotlib como hacer flechas (plt.arrow o plt.quiver).
