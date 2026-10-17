# Ejercicio Sesion 4: ANOVA — Comparacion de Multiples Grupos

**Materia:** Estadistica Inferencial
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Aplicar ANOVA de un factor para comparar medias de tres o mas grupos simultaneamente, sin inflar el error tipo I como ocurriria con multiples t-tests, usando datos reales de rendimiento en plataformas educativas de Ecuador.

## Contexto

ITSEIA evalua tres metodologias de ensenanza en su campus virtual para el curso de Python:
- **Grupo A (Video + Quiz):** 15 estudiantes, aprendizaje tradicional online
- **Grupo B (Proyecto Real):** 15 estudiantes, construyen un proyecto desde semana 1
- **Grupo C (Pair Programming):** 15 estudiantes, programan en parejas con feedback inmediato

Al final del modulo, se evaluan con el mismo examen (nota sobre 100).

**Resultados por grupo:**

```
Grupo A (Video+Quiz): [72, 68, 75, 71, 69, 74, 70, 73, 67, 76, 72, 68, 71, 73, 70]
Grupo B (Proyecto):   [81, 85, 79, 87, 83, 84, 80, 88, 82, 86, 81, 85, 83, 87, 84]
Grupo C (Pair Prog.): [78, 82, 76, 80, 84, 79, 83, 77, 81, 85, 78, 82, 80, 76, 83]
```

## Instrucciones

**Parte 1 — Por que no usar multiples t-tests**

Si compararas los 3 grupos con t-tests individuales necesitarias 3 comparaciones: A vs B, A vs C, B vs C.
- Con α = 0.05 en cada test, la probabilidad de cometer al menos un error tipo I = 1 - (0.95)^3 = ?
- Calcula el resultado. ¿Ve el problema?
- ANOVA resuelve esto con UNA sola prueba.

**Parte 2 — Logica de ANOVA**

ANOVA compara dos tipos de variabilidad:
- **Varianza entre grupos (Between):** ¿Que tanto difieren las medias de los grupos entre si?
- **Varianza dentro de grupos (Within):** ¿Que tanto varian las notas dentro de cada grupo?

Si la varianza ENTRE es mucho mayor que la varianza DENTRO → los grupos son diferentes.
El estadistico F = Varianza_Between / Varianza_Within

**Parte 3 — ANOVA con Python**

```python
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

grupo_a = [72, 68, 75, 71, 69, 74, 70, 73, 67, 76, 72, 68, 71, 73, 70]
grupo_b = [81, 85, 79, 87, 83, 84, 80, 88, 82, 86, 81, 85, 83, 87, 84]
grupo_c = [78, 82, 76, 80, 84, 79, 83, 77, 81, 85, 78, 82, 80, 76, 83]

# Estadisticas descriptivas
for nombre, grupo in [('A-Video', grupo_a), ('B-Proyecto', grupo_b), ('C-PairProg', grupo_c)]:
    print(f"Grupo {nombre}: Media={np.mean(grupo):.2f}, SD={np.std(grupo, ddof=1):.2f}")

# ANOVA de un factor
f_stat, p_value = stats.f_oneway(grupo_a, grupo_b, grupo_c)
print(f"\nEstadistico F: {f_stat:.4f}")
print(f"P-valor: {p_value:.6f}")

if p_value < 0.05:
    print("\nHay diferencias significativas entre los grupos (p < 0.05)")
else:
    print("\nNo hay diferencias significativas entre los grupos")

# Boxplot para visualizar
fig, ax = plt.subplots(figsize=(8, 5))
ax.boxplot([grupo_a, grupo_b, grupo_c],
           labels=['A: Video+Quiz', 'B: Proyecto', 'C: Pair Prog'])
ax.set_ylabel('Nota (sobre 100)')
ax.set_title('Comparacion de Metodologias — ITSEIA Campus Virtual')
ax.axhline(y=np.mean(grupo_a + grupo_b + grupo_c),
           color='red', linestyle='--', alpha=0.5, label='Media global')
plt.tight_layout()
plt.savefig('anova_metodologias_itseia.png', dpi=150)
plt.show()
```

**Parte 4 — Post-hoc: Tukey HSD (si ANOVA es significativo)**

ANOVA dice "hay diferencias" pero no "entre quienes". El test de Tukey lo identifica:

```python
from statsmodels.stats.multicomp import pairwise_tukeyhsd
import numpy as np

datos = grupo_a + grupo_b + grupo_c
grupos = ['A']*15 + ['B']*15 + ['C']*15

resultado_tukey = pairwise_tukeyhsd(datos, grupos, alpha=0.05)
print(resultado_tukey)
```

¿Cuales pares de grupos son significativamente diferentes?

**Parte 5 — Interpretacion para ITSEIA**

- ¿Cual metodologia produce mejores resultados de aprendizaje?
- ¿Es la diferencia entre B y C estadisticamente significativa?
- ¿Que recomendacion harias a la direccion academica de ITSEIA?

## Usa IA para...

> Abre Claude y escribe:
> "ITSEIA evalua tres metodologias de aprendizaje online. Los resultados del ANOVA muestran F=[valor] y p=[valor]. El test de Tukey muestra que [grupos] son diferentes. Ayudame a redactar: (1) una interpretacion tecnica para el informe estadistico, (2) una recomendacion ejecutiva en lenguaje simple para el equipo directivo de ITSEIA. Ademas, explicame cuales son los 3 supuestos de ANOVA y como verificarlos en Python."

## Que aprendiste

- **ANOVA** compara 3+ grupos con una sola prueba, controlando el error tipo I.
- El estadistico **F** compara la varianza entre grupos vs la varianza dentro de grupos.
- Si ANOVA es significativo, el **test post-hoc** (Tukey, Bonferroni) identifica cuales pares difieren.
- Los supuestos de ANOVA: normalidad de residuos, homogeneidad de varianzas, independencia.
- En ML: ANOVA se usa para comparar el rendimiento de multiples modelos en validacion cruzada.

## Reto extra

Investiga el **ANOVA de dos factores** (two-way ANOVA). En ITSEIA hay dos factores: metodologia (A/B/C) Y fraternidad (Luma/Neo). ¿Podria haber interaccion entre ambos factores? (Quizas Luma responde mejor a proyectos y Neo a pair programming). Busca como implementar two-way ANOVA con statsmodels.formula.api en Python y aplica el concepto con datos hipoteticos de 6 grupos (3 metodologias x 2 fraternidades).
