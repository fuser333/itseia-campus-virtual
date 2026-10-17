# Ejercicio Sesion 7: Modelos Generativos y IA Generativa

**Materia:** Machine Learning Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Comprender y aplicar modelos generativos: VAE (Variational Autoencoder) para generacion de datos sinteticos, GANs para aumentacion de datasets, y prompting avanzado de LLMs — con aplicaciones en la generacion de datos sinteticos para entrenar modelos con datos sensibles del IESS Ecuador y el BCE.

## Contexto

El IESS Ecuador no puede compartir datos de 8 millones de afiliados con investigadores externos por la LOPDP. Un VAE puede generar datos sinteticos estadisticamente identicos a los reales sin exponer informacion personal. Los GANs pueden generar imagenes medicas sinteticas para entrenar detectores de enfermedades cuando los datos reales son escasos. La IA generativa es la frontera actual del ML — y entender sus fundamentos es clave para construir soluciones innovadoras.

## Instrucciones

1. Crea el archivo `sesion07_modelos_generativos_ecuador.py`:

```python
# Modelos Generativos - ITSEIA
# Machine Learning Avanzado
# VAE + Datos sinteticos IESS Ecuador + Prompting LLM

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader
import json
import warnings
warnings.filterwarnings("ignore")

torch.manual_seed(2026)
np.random.seed(2026)

print("=" * 65)
print("MODELOS GENERATIVOS — DATOS SINTETICOS IESS ECUADOR")
print("=" * 65)

# ================================================
# CONCEPTOS: MODELOS GENERATIVOS
# ================================================
print("\n--- CONCEPTOS MODELOS GENERATIVOS ---")

comparacion = {
    "Autoencoder":    {
        "objetivo":   "Comprimir y reconstruir datos",
        "uso":        "Reduccion de dimensiones, deteccion anomalias",
        "limitacion": "No genera datos nuevos — solo reconstruye",
    },
    "VAE":            {
        "objetivo":   "Aprender distribucion latente probabilistica",
        "uso":        "Generar datos sinteticos, augmentacion de datos",
        "ventaja":    "Espacio latente continuo — interpolar entre ejemplos",
    },
    "GAN":            {
        "objetivo":   "Generador vs Discriminador — juego adversarial",
        "uso":        "Imagenes sinteticas, deepfake (legal: datos medicos)",
        "ventaja":    "Calidad de imagen superior al VAE",
        "desventaja": "Mode collapse, entrenamiento inestable",
    },
    "Diffusion":      {
        "objetivo":   "Aprender a revertir el ruido gaussiano iterativamente",
        "uso":        "DALL-E, Stable Diffusion — generacion de imagen de alta calidad",
        "ventaja":    "Estado del arte en imagen y audio",
    },
    "LLM (GPT)":      {
        "objetivo":   "Predecir el siguiente token — entrenado en todo internet",
        "uso":        "Texto, codigo, razonamiento, datos tabulares sinteticos",
        "ventaja":    "Zero-shot, few-shot, instrucciones en lenguaje natural",
    },
}

for modelo, info in comparacion.items():
    print(f"\n  [{modelo}]")
    for k, v in info.items():
        print(f"    {k:<12}: {v}")

# ================================================
# DATASET: AFILIADOS IESS (ANONIMIZADO)
# ================================================
print("\n--- DATASET REAL (ANONIMIZADO): AFILIADOS IESS ---")

N = 3_000
sectores    = ["comercio","manufactura","servicios","construccion","agricultura"]
provincias  = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua"]

df_iess_real = pd.DataFrame({
    "edad":              np.random.normal(38, 10, N).clip(18, 65),
    "ingreso_mensual":   np.random.lognormal(6.5, 0.5, N).clip(450, 10000),
    "años_aportados":    np.random.exponential(8, N).clip(0, 40),
    "n_aportes_12m":     np.random.choice(range(13), N, p=[0.05,0.05,0.05,0.05,0.05,
                                                             0.05,0.08,0.08,0.10,0.10,
                                                             0.10,0.10,0.14]),
    "sector":            np.random.choice(range(len(sectores)), N),
    "provincia":         np.random.choice(range(len(provincias)), N),
    "tiene_prestamo":    np.random.binomial(1, 0.35, N),
    "dependientes":      np.random.choice([0,1,2,3,4], N, p=[0.20,0.30,0.28,0.15,0.07]),
})

# Normalizar para el modelo
from sklearn.preprocessing import MinMaxScaler
scaler_iess = MinMaxScaler()
X_real = scaler_iess.fit_transform(df_iess_real.values).astype(np.float32)

print(f"  Dataset real: {df_iess_real.shape}")
print(f"  Ingreso prom: ${df_iess_real['ingreso_mensual'].mean():.0f}")
print(f"  Edad prom:    {df_iess_real['edad'].mean():.1f} años")
print(f"  Con prestamo: {df_iess_real['tiene_prestamo'].mean()*100:.1f}%")

# ================================================
# VAE: VARIATIONAL AUTOENCODER
# ================================================
print("\n--- VAE: VARIATIONAL AUTOENCODER ---")

class VAE(nn.Module):
    """
    VAE para generacion de datos tabulares sinteticos.
    Aprende P(z) ~ N(0,1) donde z es la representacion latente.
    """

    def __init__(self, n_features, latent_dim=4, hidden=64):
        super().__init__()
        self.n_features  = n_features
        self.latent_dim  = latent_dim

        # Encoder: X → mu, log_var
        self.encoder = nn.Sequential(
            nn.Linear(n_features, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden),     nn.ReLU(),
        )
        self.fc_mu      = nn.Linear(hidden, latent_dim)
        self.fc_log_var = nn.Linear(hidden, latent_dim)

        # Decoder: z → X reconstruido
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden),     nn.ReLU(),
            nn.Linear(hidden, n_features), nn.Sigmoid(),
        )

    def reparametrize(self, mu, log_var):
        """Reparametrization trick: z = mu + epsilon * sigma."""
        std = torch.exp(0.5 * log_var)
        eps = torch.randn_like(std)
        return mu + eps * std

    def forward(self, x):
        h       = self.encoder(x)
        mu      = self.fc_mu(h)
        log_var = self.fc_log_var(h)
        z       = self.reparametrize(mu, log_var)
        x_rec   = self.decoder(z)
        return x_rec, mu, log_var

    def loss(self, x, x_rec, mu, log_var):
        """ELBO loss = reconstruccion + KL divergence."""
        rec_loss = nn.functional.mse_loss(x_rec, x, reduction="sum")
        kl_loss  = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())
        return rec_loss + kl_loss

    def generar(self, n):
        """Genera n muestras sinteticas muestreando z ~ N(0,1)."""
        self.eval()
        with torch.no_grad():
            z    = torch.randn(n, self.latent_dim)
            data = self.decoder(z).numpy()
        return data

# Entrenar VAE
n_features = X_real.shape[1]
vae = VAE(n_features=n_features, latent_dim=6, hidden=64)
optimizador_vae = optim.Adam(vae.parameters(), lr=1e-3)

dataset_vae   = TensorDataset(torch.FloatTensor(X_real))
loader_vae    = DataLoader(dataset_vae, batch_size=128, shuffle=True)

EPOCHS_VAE = 50
losses_vae = []
for epoch in range(1, EPOCHS_VAE+1):
    vae.train()
    total_loss = 0
    for (x_batch,) in loader_vae:
        optimizador_vae.zero_grad()
        x_rec, mu, log_var = vae(x_batch)
        loss = vae.loss(x_batch, x_rec, mu, log_var)
        loss.backward()
        optimizador_vae.step()
        total_loss += loss.item()
    losses_vae.append(total_loss / len(loader_vae))

    if epoch % 10 == 0:
        print(f"  Epoch {epoch:>3}/{EPOCHS_VAE} | Loss: {losses_vae[-1]:.1f}")

# ================================================
# EVALUAR DATOS SINTETICOS
# ================================================
print("\n--- EVALUACION DATOS SINTETICOS ---")

N_SINTETICOS = 3_000
X_sintetico  = vae.generar(N_SINTETICOS)
df_sintetico = pd.DataFrame(
    scaler_iess.inverse_transform(X_sintetico),
    columns=df_iess_real.columns
)

# Comparar estadisticas
print(f"  Comparacion estadistica (Real vs Sintetico):")
print(f"\n  {'Variable':<25} {'Real Media':>12} {'Sint Media':>12} "
      f"{'Real Std':>10} {'Sint Std':>10}")
print(f"  {'-'*72}")
for col in df_iess_real.columns[:6]:
    r_mean = df_iess_real[col].mean()
    s_mean = df_sintetico[col].mean()
    r_std  = df_iess_real[col].std()
    s_std  = df_sintetico[col].std()
    print(f"  {col:<25} {r_mean:>12.2f} {s_mean:>12.2f} {r_std:>10.2f} {s_std:>10.2f}")

# ================================================
# DETECCION SINTETICO vs REAL (Train on Synth, Test on Real)
# ================================================
print("\n--- TOSTR: TRAIN ON SYNTH, TEST ON REAL ---")
print("  Metrica clave: si el modelo entrenado con sinteticos")
print("  funciona igual en datos reales — los sinteticos son utiles")

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score

# Clasificador: discriminar real (1) vs sintetico (0)
y_mix = np.array([1]*len(X_real) + [0]*len(X_sintetico))
X_mix = np.vstack([X_real, X_sintetico.astype(np.float32)])

from sklearn.model_selection import cross_val_score
auc_discriminador = cross_val_score(
    RandomForestClassifier(n_estimators=100, random_state=42),
    X_mix, y_mix, cv=5, scoring="roc_auc"
).mean()

print(f"\n  AUC discriminador (real vs sintetico): {auc_discriminador:.4f}")
print(f"  Interpretacion:")
print(f"    AUC = 0.50: perfectos — indistinguibles (ideal)")
print(f"    AUC = 0.60: buenos — diferencia pequena")
print(f"    AUC > 0.75: malos — diferencias estadisticas notables")
calidad = "Excelente" if auc_discriminador < 0.60 else ("Buena" if auc_discriminador < 0.70 else "Mejorable")
print(f"  Calidad datos sinteticos: {calidad} (AUC = {auc_discriminador:.3f})")

# ================================================
# PROMPTING AVANZADO PARA DATOS TABULARES
# ================================================
print("\n--- PROMPTING AVANZADO: GENERACION CON LLMs ---")

prompts_ejemplos = {
    "Few-shot tabular": """
  Genera 5 registros de afiliados IESS Ecuador con este formato CSV:
  edad,ingreso_mensual,años_aportados,sector,tiene_prestamo

  Ejemplos existentes:
  34,850.00,6,comercio,0
  45,1200.00,15,manufactura,1
  28,650.00,2,servicios,0

  Nuevos registros (realistas para Ecuador 2024):""",

    "Instruct para calidad": """
  Eres un generador de datos sinteticos para el IESS Ecuador.
  Reglas ESTRICTAS:
  - Ingreso: entre $450 (SBU) y $5,000 (percentil 95)
  - Edad: entre 18 y 65 años
  - Anos aportados: menor que (edad - 18)
  - Sector: solo [comercio, manufactura, servicios, construccion, agricultura]

  Genera 10 afiliados JSON que cumplan todas las reglas:""",

    "Chain of thought": """
  Necesito un afiliado IESS Ecuador tipico del sector informal urbano.
  Razona paso a paso:
  1. Sector informal: comercio ambulante o servicios personales
  2. Ingreso: cerca del SBU ($460) pero variable
  3. Edad: distribucion bimodal — jovenes o adultos maduros
  4. Aportes: irregulares — no 12/12 por trabajo inestable
  Ahora genera el registro JSON con esas caracteristicas:""",
}

print("\n  Estrategias de prompting para datos tabulares:")
for estrategia, prompt in prompts_ejemplos.items():
    print(f"\n  [{estrategia}]")
    for linea in prompt.strip().split("\n")[:4]:
        if linea.strip():
            print(f"    {linea.strip()}")

# ================================================
# PRIVACIDAD: METRICAS DE DATOS SINTETICOS
# ================================================
print("\n--- METRICAS DE PRIVACIDAD ---")

metricas_privacidad = {
    "Membership Inference Attack":
        "¿Puede un atacante saber si una persona especifica esta en el dataset original?",
    "Nearest Neighbor Distance":
        "Distancia promedio al registro real mas cercano — mayor es mas privado",
    "Attribute Disclosure":
        "¿Puede inferirse atributo sensible (ingreso) de atributos publicos?",
    "Linkage Attack":
        "¿Puede el registro sintetico vincularse a identidad real por combinacion de atributos?",
}

print("\n  Metricas de privacidad para datos sinteticos:")
for metrica, desc in metricas_privacidad.items():
    print(f"\n  {metrica}:")
    print(f"    {desc}")

# Calcular nearest neighbor distance (simplificado)
from sklearn.metrics import pairwise_distances
idx_muestra = np.random.choice(min(500, len(X_real)), 200, replace=False)
dists = pairwise_distances(
    X_sintetico[:200].astype(np.float32),
    X_real[idx_muestra]
)
nn_dist = dists.min(axis=1).mean()
print(f"\n  Nearest Neighbor Distance promedio: {nn_dist:.4f}")
print(f"  Interpretacion: valores > 0.05 indican buena privacidad")

print("\n" + "=" * 65)
print("MODELOS GENERATIVOS — CONCEPTOS CLAVE:")
print("  VAE:           encoder-decoder con espacio latente probabilistico")
print("  Reparametrize: z = mu + eps*sigma — gradiente fluye por la red")
print("  KL divergence: regulariza el espacio latente hacia N(0,1)")
print("  Discriminador: mide calidad sintetica — AUC cercano a 0.5 = bueno")
print("  TOSTR:         Train on Synthetic, Test on Real — metrica util en practica")
print("  Privacidad:    NN distance, membership inference — medir antes de publicar")
print("=" * 65)
```

3. Implementa la GAN simple (CTGAN-like) para datos tabulares: generador y discriminador con 2 capas ocultas cada uno, entrenamiento alternado, y deteccion de mode collapse con variance del output del generador.

4. Agrega la evaluacion de utilidad: entrena un Random Forest en datos sinteticos y evalua en datos reales — compara el AUC vs el modelo entrenado en datos reales.

## Usa IA para...

> Abre ChatGPT y escribe:
> "El IESS Ecuador necesita compartir datos de afiliados para investigacion academica pero la LOPDP prohibe compartir datos personales. He generado datos sinteticos con un VAE. Ahora necesito: 1) demostrar formalmente que los datos sinteticos cumplen epsilon-differential privacy (calcular epsilon con el mecanismo de Laplace), 2) el proceso de aprobacion para publicar datos sinteticos segun la normativa SENESCYT/CES Ecuador, 3) cuanto se degrada la utilidad del modelo si agrego noise para mejorar la privacidad (privacy-utility tradeoff). Dame el codigo Python para calcular el epsilon de mi VAE y el nivel de utilidad resultante."

Despues de leer la respuesta:
- Implementa la version simplificada del calculo de sensibilidad local del VAE.
- Compara la utilidad del modelo (AUC en datos reales) con y sin noise adicional.

## Que aprendiste

- Los VAEs aprenden una distribucion probabilistica del espacio latente — no solo comprimen, generan.
- El reparametrization trick permite que el gradiente fluya a traves de la muestra estocastica.
- La KL divergence regulariza el espacio latente hacia N(0,1) — permite muestrear datos nuevos.
- Los datos sinteticos son valiosos para: datos escasos, privacidad LOPDP, balanceo de clases.
- El AUC del discriminador es la metrica principal de calidad — cercano a 0.5 = sinteticos creibles.
- El privacy-utility tradeoff es inevitable: mas privacidad = menos utilidad estadistica.

## Reto extra

Construye el sistema de generacion de datos sinteticos para el censo del INEC Ecuador: VAE que genera hogares ecuatorianos completos (vivienda, composicion familiar, ingresos, educacion, acceso a servicios) con las mismas correlaciones del Censo 2022 real; evaluacion formal con 10 metricas estadisticas (KS test por variable, correlacion matrix distance, coverage); proceso de aprobacion con firma digital del responsable del INEC; portal web donde investigadores solicitan datasets sinteticos personalizados (provincia, estrato, tamano); y mecanismo de differential privacy con epsilon seleccionable segun la sensibilidad requerida.
