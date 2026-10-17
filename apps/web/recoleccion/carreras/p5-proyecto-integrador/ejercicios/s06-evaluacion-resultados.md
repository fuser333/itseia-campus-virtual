# Ejercicio Sesion 6: Evaluacion y Resultados

**Materia:** Proyecto Integrador (Titulacion)
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 55 min

## Objetivo

Evaluar el modelo final de forma rigurosa y completa: analisis de la curva ROC, matriz de confusion interpretada en contexto real, analisis de errores, evaluacion de equidad (fairness) por subgrupos, y traduccion de los resultados tecnicos a impacto medible para el usuario final ecuatoriano.

## Contexto (Ecuador)

En investigacion responsable, los resultados no terminan en "AUC = 0.82". Terminan cuando puedes responder: cuantos ausentismos reales evitaria este modelo si se usara en todos los centros de salud del MSP? Cuanto ahorro en recursos del sistema publico? Hay grupos de pacientes donde el modelo es sistematicamente peor? Estas son las preguntas que distinguen un trabajo de titulacion de calidad de uno mediocre.

## Instrucciones

### Parte 1 — Analisis completo de la curva ROC (15 min)

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from sklearn.metrics import (
    roc_auc_score, roc_curve, precision_recall_curve,
    confusion_matrix, ConfusionMatrixDisplay,
    average_precision_score, classification_report
)
from sklearn.calibration import calibration_curve

def analisis_completo_modelo(y_test, y_pred, y_proba, nombre_modelo="Modelo"):
    """
    Analisis completo de evaluacion para el capitulo de resultados.
    Genera 6 graficos estandar de reportes de ML.
    """
    fig = plt.figure(figsize=(18, 12))
    gs = gridspec.GridSpec(2, 3, figure=fig, hspace=0.4, wspace=0.35)
    fig.suptitle(f"Evaluacion Completa — {nombre_modelo}", fontsize=16, y=0.98)

    # GRAFICO 1: Curva ROC
    ax1 = fig.add_subplot(gs[0, 0])
    fpr, tpr, thresholds = roc_curve(y_test, y_proba)
    auc = roc_auc_score(y_test, y_proba)
    ax1.plot(fpr, tpr, color="#1F2F58", lw=2, label=f"AUC = {auc:.4f}")
    ax1.plot([0, 1], [0, 1], "k--", lw=1, label="Random classifier")
    ax1.fill_between(fpr, tpr, alpha=0.1, color="#1F2F58")
    ax1.set_xlabel("Tasa de Falsos Positivos")
    ax1.set_ylabel("Tasa de Verdaderos Positivos")
    ax1.set_title("Curva ROC")
    ax1.legend(loc="lower right")

    # GRAFICO 2: Curva Precision-Recall (mejor para datos desbalanceados)
    ax2 = fig.add_subplot(gs[0, 1])
    precision, recall, _ = precision_recall_curve(y_test, y_proba)
    ap = average_precision_score(y_test, y_proba)
    ax2.plot(recall, precision, color="#FBBC0C", lw=2, label=f"AP = {ap:.4f}")
    baseline = y_test.mean()
    ax2.axhline(y=baseline, color="gray", linestyle="--", label=f"Baseline = {baseline:.3f}")
    ax2.set_xlabel("Recall")
    ax2.set_ylabel("Precision")
    ax2.set_title("Curva Precision-Recall")
    ax2.legend()

    # GRAFICO 3: Matriz de confusion normalizada
    ax3 = fig.add_subplot(gs[0, 2])
    cm = confusion_matrix(y_test, y_pred)
    disp = ConfusionMatrixDisplay(cm, display_labels=["No asistio", "Si asistio"])
    disp.plot(ax=ax3, colorbar=False, cmap="Blues")
    ax3.set_title("Matriz de Confusion")

    # GRAFICO 4: Distribucion de probabilidades predichas
    ax4 = fig.add_subplot(gs[1, 0])
    ax4.hist(y_proba[y_test == 0], bins=30, alpha=0.7, color="#e74c3c",
              label="No asistio (real)", density=True)
    ax4.hist(y_proba[y_test == 1], bins=30, alpha=0.7, color="#2ecc71",
              label="Si asistio (real)", density=True)
    ax4.set_xlabel("Probabilidad predicha")
    ax4.set_ylabel("Densidad")
    ax4.set_title("Distribucion de Probabilidades")
    ax4.legend()

    # GRAFICO 5: Curva de calibracion
    ax5 = fig.add_subplot(gs[1, 1])
    prob_true, prob_pred = calibration_curve(y_test, y_proba, n_bins=10)
    ax5.plot(prob_pred, prob_true, "s-", color="#9b59b6", label="Modelo")
    ax5.plot([0, 1], [0, 1], "k--", label="Calibracion perfecta")
    ax5.set_xlabel("Probabilidad predicha media")
    ax5.set_ylabel("Fraccion de positivos reales")
    ax5.set_title("Curva de Calibracion")
    ax5.legend()

    # GRAFICO 6: Analisis de umbral optimo
    ax6 = fig.add_subplot(gs[1, 2])
    umbrales = np.linspace(0.1, 0.9, 81)
    f1s = []
    precisiones = []
    recalls = []
    for u in umbrales:
        pred_u = (y_proba >= u).astype(int)
        from sklearn.metrics import f1_score, precision_score, recall_score
        f1s.append(f1_score(y_test, pred_u, zero_division=0))
        precisiones.append(precision_score(y_test, pred_u, zero_division=0))
        recalls.append(recall_score(y_test, pred_u, zero_division=0))
    ax6.plot(umbrales, f1s, label="F1", color="#e74c3c")
    ax6.plot(umbrales, precisiones, label="Precision", color="#3498db")
    ax6.plot(umbrales, recalls, label="Recall", color="#2ecc71")
    umbral_optimo = umbrales[np.argmax(f1s)]
    ax6.axvline(x=umbral_optimo, color="gray", linestyle="--",
                label=f"Umbral optimo = {umbral_optimo:.2f}")
    ax6.set_xlabel("Umbral de decision")
    ax6.set_ylabel("Metrica")
    ax6.set_title("Metricas por Umbral")
    ax6.legend(fontsize=8)

    plt.savefig(f"evaluacion_completa_{nombre_modelo.replace(' ', '_')}.png",
                dpi=150, bbox_inches="tight")
    print(f"Evaluacion guardada en imagen.")

    return {
        "auc_roc": auc,
        "average_precision": ap,
        "umbral_optimo": umbral_optimo,
        "matriz_confusion": cm.tolist()
    }
```

### Parte 2 — Analisis de equidad por subgrupos (20 min)

Este es el componente que distingue una investigacion responsable de una superficial:

```python
def analizar_equidad_subgrupos(df_test, y_test, y_pred, y_proba, subgrupos):
    """
    Evalua el rendimiento del modelo en subgrupos demograficos.
    Detecta si el modelo es sistematicamente peor para algun grupo.
    """
    resultados_equidad = []

    print("ANALISIS DE EQUIDAD POR SUBGRUPOS")
    print("="*70)

    for variable, grupos in subgrupos.items():
        print(f"\nVariable: {variable}")
        for nombre_grupo, mascara in grupos.items():
            n_grupo = mascara.sum()
            if n_grupo < 50:  # Minimo estadistico
                continue

            auc_grupo = roc_auc_score(y_test[mascara], y_proba[mascara])
            f1_grupo = f1_score(y_test[mascara], y_pred[mascara])

            # Tasa de falsos positivos (FPR) y falsos negativos (FNR)
            cm_grupo = confusion_matrix(y_test[mascara], y_pred[mascara])
            if cm_grupo.shape == (2, 2):
                tn, fp, fn, tp = cm_grupo.ravel()
                fpr_grupo = fp / max(fp + tn, 1)
                fnr_grupo = fn / max(fn + tp, 1)
            else:
                fpr_grupo = fnr_grupo = None

            resultado = {
                "variable": variable,
                "grupo": nombre_grupo,
                "n": n_grupo,
                "auc": round(auc_grupo, 4),
                "f1": round(f1_grupo, 4),
                "fpr": round(fpr_grupo, 4) if fpr_grupo else None,
                "fnr": round(fnr_grupo, 4) if fnr_grupo else None
            }
            resultados_equidad.append(resultado)
            print(f"  {nombre_grupo}: n={n_grupo} | AUC={auc_grupo:.4f} | F1={f1_grupo:.4f} | FPR={fpr_grupo:.4f} | FNR={fnr_grupo:.4f}")

    # Detectar disparidades
    df_eq = pd.DataFrame(resultados_equidad)
    print("\nDISPARIDADES DETECTADAS (diferencia AUC > 0.05):")
    for variable in df_eq["variable"].unique():
        subset = df_eq[df_eq["variable"] == variable]
        if len(subset) > 1:
            rango = subset["auc"].max() - subset["auc"].min()
            if rango > 0.05:
                mejor = subset.loc[subset["auc"].idxmax(), "grupo"]
                peor = subset.loc[subset["auc"].idxmin(), "grupo"]
                print(f"  ALERTA: {variable} — Diferencia AUC de {rango:.4f}")
                print(f"    Mejor subgrupo: {mejor} ({subset['auc'].max():.4f})")
                print(f"    Peor subgrupo: {peor} ({subset['auc'].min():.4f})")

    return df_eq

# Ejemplo de uso (ajusta con tu dataset real)
# df_test contiene las features del test set con sus valores originales
# subgrupos_analizar = {
#     "genero": {
#         "Masculino": (df_test["genero"] == "M").values,
#         "Femenino": (df_test["genero"] == "F").values,
#     },
#     "grupo_edad": {
#         "Joven (15-30)": ((df_test["edad"] >= 15) & (df_test["edad"] < 30)).values,
#         "Adulto (30-60)": ((df_test["edad"] >= 30) & (df_test["edad"] < 60)).values,
#         "Mayor (60+)": (df_test["edad"] >= 60).values,
#     },
#     "region": {
#         "Costa": df_test["provincia"].isin(["Guayas", "Manabi", "El Oro", "Esmeraldas"]).values,
#         "Sierra": df_test["provincia"].isin(["Pichincha", "Azuay", "Loja", "Imbabura"]).values,
#     }
# }
```

### Parte 3 — Traduccion a impacto real (15 min)

Convierte los numeros tecnicos en impacto medible para Ecuador:

```python
def calcular_impacto_real(cm, contexto_ecuador):
    """
    Traduce la matriz de confusion a impacto economico y operacional real.
    """
    tn, fp, fn, tp = cm[0][0], cm[0][1], cm[1][0], cm[1][1]

    n_total = tn + fp + fn + tp
    escala = contexto_ecuador["citas_anuales_msp"] / n_total

    # Citas correctamente identificadas como ausentismo
    ausentismos_detectados = tp * escala
    # Citas incorrectamente marcadas como ausentismo (falsos positivos)
    falsos_positivos = fp * escala
    # Ausentismos no detectados (falsos negativos)
    ausentismos_perdidos = fn * escala

    costo_cita = contexto_ecuador["costo_cita_usd"]
    costo_llamada_recordatorio = contexto_ecuador["costo_llamada_usd"]

    # Ahorro anual si se usa el modelo para llamar a los identificados como ausentismo
    ahorro_bruto = ausentismos_detectados * costo_cita
    costo_intervenciones = (ausentismos_detectados + falsos_positivos) * costo_llamada_recordatorio
    ahorro_neto = ahorro_bruto - costo_intervenciones

    print("IMPACTO POTENCIAL DEL MODELO — SISTEMA MSP ECUADOR")
    print("="*60)
    print(f"Escala: {contexto_ecuador['citas_anuales_msp']:,} citas/año MSP")
    print(f"\nAUSENTISMOS IDENTIFICADOS: {ausentismos_detectados:,.0f}/año")
    print(f"FALSOS ALARMAS: {falsos_positivos:,.0f}/año")
    print(f"AUSENTISMOS NO DETECTADOS: {ausentismos_perdidos:,.0f}/año")
    print(f"\nCosto de cita no atendida: ${costo_cita} USD")
    print(f"Costo de llamada recordatoria: ${costo_llamada_recordatorio} USD")
    print(f"\nAHORRO BRUTO POTENCIAL: ${ahorro_bruto:,.0f}/año")
    print(f"COSTO DE INTERVENCIONES: ${costo_intervenciones:,.0f}/año")
    print(f"AHORRO NETO ESTIMADO: ${ahorro_neto:,.0f}/año")

    tasa_ausentismo_base = contexto_ecuador["tasa_ausentismo_base"]
    tasa_ausentismo_con_modelo = (ausentismos_perdidos / (contexto_ecuador["citas_anuales_msp"] * tasa_ausentismo_base))
    reduccion = (1 - tasa_ausentismo_con_modelo) * 100

    print(f"\nREDUCCION DE AUSENTISMO: {reduccion:.1f}% de los ausentismos evitables")
    return ahorro_neto

# Contexto real MSP Ecuador (investigar valores reales)
contexto = {
    "citas_anuales_msp": 12_000_000,  # Aprox citas/año MSP Ecuador
    "tasa_ausentismo_base": 0.25,       # 25% de tasa de ausentismo
    "costo_cita_usd": 15,               # Costo promedio por cita no atendida (incluye personal, infraestructura)
    "costo_llamada_usd": 0.50           # Costo de llamada recordatoria automatizada
}

# cm_final = [[tn, fp], [fn, tp]]  <- de tu modelo entrenado
# calcular_impacto_real(cm_final, contexto)
```

### Parte 4 — Tabla de resultados para el paper (5 min)

Genera la tabla estandar de comparacion de modelos lista para incluir en el documento de titulacion:

```python
def generar_tabla_resultados_latex(resultados_todos_modelos):
    """
    Genera tabla LaTeX/Markdown lista para incluir en el documento.
    """
    print("\n### Tabla de Resultados (para incluir en el documento)\n")
    print("| Modelo | AUC-ROC | Precision | Recall | F1-Score | Tiempo (ms) |")
    print("|--------|---------|-----------|--------|----------|-------------|")

    for modelo, metricas in sorted(
        resultados_todos_modelos.items(),
        key=lambda x: x[1]["auc"], reverse=True
    ):
        mejor = " **" if metricas.get("mejor", False) else ""
        print(
            f"| {modelo}{mejor} | {metricas['auc']:.4f} | "
            f"{metricas['precision']:.4f} | {metricas['recall']:.4f} | "
            f"{metricas['f1']:.4f} | {metricas['tiempo_ms']:.1f} |"
        )

    print("\n*Negrita indica el modelo seleccionado para produccion.*")
    print("*Todos los resultados son en el conjunto de prueba (20% holdout).*")
    print("*Evaluacion con 5-fold stratified cross-validation sobre el conjunto de entrenamiento.*")
```

## Usa IA para...

- Pedirle a Claude que redacte el parrafo de "Discusion de Resultados" (200 palabras) comparando tus resultados con los papers revisados en la Sesion 2.
- Preguntarle como interpretar una disparidad de AUC de 0.08 entre hombres y mujeres — es significativa? Que la podria causar? Que se debe hacer?
- Pedirle que traduzca el ahorro estimado a terminos comprensibles para un director de hospital del MSP que no conoce ML.

## Que aprendiste

- Que la curva precision-recall es mas informativa que la ROC para datasets desbalanceados.
- Que el analisis de equidad por subgrupos es una responsabilidad etica, no un extra opcional.
- Que el umbral de decision optimo no siempre es 0.5 — depende del costo relativo de cada tipo de error.
- Como traducir AUC y F1 en dolares de ahorro real y vidas impactadas: eso es lo que importa al tomador de decisiones.

## Reto extra

Implementa un sistema de monitoreo de drift del modelo: simula que el modelo se despliega en produccion y despues de 6 meses los datos cambian (nueva pandemia, cambio de politica del MSP). Usa la libreria `evidently` para detectar automaticamente cuando el rendimiento del modelo cae por debajo del umbral aceptable y deberia ser reentrenado.
