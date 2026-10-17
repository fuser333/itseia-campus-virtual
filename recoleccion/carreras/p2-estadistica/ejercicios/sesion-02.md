# Ejercicio Sesion 2: Prueba de Hipotesis — Z-test y T-test

**Materia:** Estadistica Inferencial
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Formular y ejecutar pruebas de hipotesis (z-test y t-test) con datos reales de Ecuador, interpretar p-valores y tomar decisiones estadisticamente informadas, aplicando el mismo proceso que se usa para validar modelos de ML.

## Contexto

**Caso 1 — Z-test:** El SENESCYT afirma que el promedio nacional de notas de bachilleres en el Ser Bachiller es 800 puntos. La Camara de Educacion del Guayas toma una muestra de 64 estudiantes y obtiene una media de 812 puntos, con desviacion estandar poblacional conocida σ = 96 puntos. ¿Hay evidencia de que los estudiantes del Guayas obtienen calificaciones diferentes al promedio nacional?

**Caso 2 — T-test:** Un emprendedor tech en Quito implementa capacitacion en IA en su equipo de 12 desarrolladores. Antes de la capacitacion, la productividad promedio era 45 tareas/semana. Despues: [48, 52, 47, 51, 53, 49, 46, 54, 50, 52, 48, 51]. ¿La capacitacion mejoró significativamente la productividad?

## Instrucciones

**Parte 1 — Z-test (Caso SENESCYT)**

Paso 1: Formula las hipotesis
- H0: μ = 800 (la media del Guayas es igual al promedio nacional)
- H1: μ ≠ 800 (diferente, prueba bilateral)

Paso 2: Calcula el estadistico z
```
z = (x̄ - μ0) / (σ / sqrt(n))
z = (812 - 800) / (96 / sqrt(64))
z = 12 / (96/8)
z = 12 / 12 = ?
```

Paso 3: Determina el valor critico
- Nivel de significancia α = 0.05 (bilateral)
- z_critico = ±1.96
- ¿El z calculado supera el valor critico? ¿Rechazas H0?

**Parte 2 — T-test (Caso Capacitacion IA)**

```python
import numpy as np
from scipy import stats

# Productividad ANTES (media historica conocida)
mu0 = 45

# Productividad DESPUES (muestra n=12)
despues = [48, 52, 47, 51, 53, 49, 46, 54, 50, 52, 48, 51]

# T-test de una muestra (one-sample t-test)
t_stat, p_value = stats.ttest_1samp(despues, mu0)

print(f"Media despues: {np.mean(despues):.2f}")
print(f"Estadistico t: {t_stat:.4f}")
print(f"P-valor: {p_value:.6f}")
print(f"Grados de libertad: {len(despues)-1}")

# Decision
alpha = 0.05
if p_value < alpha:
    print(f"\nSe RECHAZA H0 (p={p_value:.4f} < α={alpha})")
    print("La capacitacion SI mejoro significativamente la productividad.")
else:
    print(f"\nNo se rechaza H0 (p={p_value:.4f} >= α={alpha})")
    print("No hay evidencia suficiente de mejora significativa.")
```

**Parte 3 — Interpretacion del P-valor**

- ¿Que significa p < 0.05 en palabras simples?
- ¿Si p = 0.049, es muy diferente a p = 0.051? ¿Por que si o no?
- ¿Un resultado estadisticamente significativo siempre es practicamente importante?
- Calcula el "effect size" (tamano del efecto) para el t-test:
  ```
  Cohen's d = (media_despues - media_antes) / desv_std_despues
  ```
  ¿Es un efecto pequeno (d<0.2), mediano (d≈0.5) o grande (d>0.8)?

**Parte 4 — Conexion con ML**

En ML, las pruebas de hipotesis se usan para:
- Comparar si modelo A es estadisticamente mejor que modelo B
- Verificar si una nueva feature mejora significativamente el accuracy
- A/B testing de algoritmos en produccion

## Usa IA para...

> Abre Claude y escribe:
> "En Ecuador, el SENESCYT reporta una media de 800 en el Ser Bachiller. Una muestra de 64 estudiantes del Guayas da media=812, con sigma=96. Realiza un z-test bilateral a α=0.05 explicando: (1) por que se usan hipotesis nula y alternativa, (2) que significa el p-valor exactamente, (3) por que p < 0.05 no significa que el efecto sea importante. Incluye el concepto de error tipo I y error tipo II."

Pregunta adicional:
> "¿Cuales son los supuestos del t-test que debo verificar antes de usarlo? ¿Que hago si los datos no son normales?"

## Que aprendiste

- **H0** es la hipotesis de que "nada cambia" — la rechazamos si los datos son muy improbables bajo H0.
- El **p-valor** es la probabilidad de obtener un resultado igual o mas extremo si H0 fuera verdadera — NO es la probabilidad de que H0 sea verdadera.
- **Z-test** se usa cuando conocemos σ y/o n > 30; **t-test** cuando s es estimado de la muestra y n es pequeno.
- **Significancia estadistica ≠ importancia practica.** Siempre reportar el tamano del efecto.
- En ML: el A/B testing de modelos usa estos mismos principios para decidir si deployar un nuevo modelo.

## Reto extra

Descarga de datos.gob.ec los resultados del Ser Bachiller por provincia del Ecuador. Compara Quito (Pichincha) vs Guayaquil (Guayas) con un **t-test de dos muestras independientes** (scipy.stats.ttest_ind). ¿Existe una diferencia estadisticamente significativa en el rendimiento academico? Reporta el p-valor, el tamano del efecto y tu conclusion en 3 oraciones.
