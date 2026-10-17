# Ejercicio Sesion 4: Reinforcement Learning Basico

**Materia:** Machine Learning Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Comprender los fundamentos del Reinforcement Learning (RL): agente, ambiente, recompensa, politica y valor — implementando Q-Learning y Deep Q-Network (DQN) para optimizar la asignacion de recursos en el sistema de salud del MSP Ecuador y la gestion de inventarios de Supermaxi.

## Contexto

El MSP Ecuador opera 6,000 establecimientos de salud con recursos limitados: medicos, camas, medicamentos. La asignacion optima de recursos entre hospitales de segundo y tercer nivel es un problema de decision secuencial — exactamente lo que resuelve el Reinforcement Learning. Amazon usa RL para optimizar rutas de almacenes. Google usa RL para enfriar data centers (40% ahorro energia). Aprender RL abre la puerta a la optimizacion de sistemas complejos que el ML supervisado no puede resolver.

## Instrucciones

1. Crea el archivo `sesion04_reinforcement_learning_ecuador.py`:

```python
# Reinforcement Learning - ITSEIA
# Machine Learning Avanzado
# Q-Learning + DQN para optimizacion MSP Ecuador

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque
import random
import json
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
torch.manual_seed(2026)

print("=" * 65)
print("REINFORCEMENT LEARNING — OPTIMIZACION SALUD ECUADOR")
print("=" * 65)

# ================================================
# CONCEPTOS BASICOS RL
# ================================================
print("\n--- CONCEPTOS REINFORCEMENT LEARNING ---")

conceptos = {
    "Agente":     "El tomador de decisiones — algoritmo de RL",
    "Ambiente":   "El sistema con el que interactua el agente — hospital MSP",
    "Estado (s)": "Observacion actual del ambiente — camas disponibles, demanda",
    "Accion (a)": "Decision del agente — asignar recursos a hospital X",
    "Recompensa": "Senal de feedback — pacientes atendidos / recursos usados",
    "Politica π": "Funcion estado → accion — 'si hay brote, mandar mas medicos'",
    "Q(s,a)":     "Valor esperado de tomar accion a en estado s — tabla Q-learning",
    "Epsilon-greedy": "Explorar (random) vs explotar (mejor accion conocida)",
    "Replay Buffer":  "Memoria de experiencias pasadas — rompe correlacion temporal",
    "Target Network": "Red estable para calcular targets — evita divergencia en DQN",
}

for k, v in conceptos.items():
    print(f"  {k:<20}: {v}")

# ================================================
# AMBIENTE: ASIGNACION DE RECURSOS MSP
# ================================================
print("\n--- AMBIENTE: HOSPITAL MSP ECUADOR ---")

class AmbienteHospitalMSP:
    """
    Ambiente RL para asignacion de recursos en red hospitalaria del MSP Ecuador.
    Estado: [camas_disponibles, medicos_disponibles, demanda_actual, dia_semana]
    Acciones: 0=conservar, 1=reforzar_emergencia, 2=ampliar_camas, 3=llamar_especialistas
    """

    ACCIONES = {
        0: "conservar",
        1: "reforzar_emergencia",
        2: "ampliar_camas",
        3: "llamar_especialistas",
    }

    N_ACCIONES  = 4
    N_ESTADOS   = 4

    COSTO_ACCION = {0: 0, 1: 5_000, 2: 8_000, 3: 12_000}  # USD por decision

    def __init__(self, seed=42):
        self.np_rng = np.random.RandomState(seed)
        self.reset()

    def reset(self):
        self.camas_disp     = self.np_rng.randint(10, 50)
        self.medicos_disp   = self.np_rng.randint(5, 20)
        self.demanda        = self.np_rng.randint(15, 60)
        self.dia_semana     = self.np_rng.randint(0, 7)
        self.paso           = 0
        return self._estado()

    def _estado(self):
        return np.array([
            self.camas_disp / 50,
            self.medicos_disp / 20,
            self.demanda / 60,
            self.dia_semana / 6,
        ], dtype=np.float32)

    def step(self, accion):
        self.paso += 1

        # Efecto de la accion
        if accion == 1:  # reforzar emergencia
            capacidad_efectiva = self.camas_disp * 1.3
        elif accion == 2:  # ampliar camas
            self.camas_disp = min(50, self.camas_disp + 10)
            capacidad_efectiva = self.camas_disp
        elif accion == 3:  # especialistas
            capacidad_efectiva = self.camas_disp * 1.5
        else:
            capacidad_efectiva = self.camas_disp

        # Calcular recompensa
        pacientes_atendidos = min(capacidad_efectiva, self.demanda)
        pacientes_sin_atencion = max(0, self.demanda - capacidad_efectiva)
        costo = self.COSTO_ACCION[accion]

        recompensa = (
            pacientes_atendidos * 10    # recompensa por atender
            - pacientes_sin_atencion * 50  # penalizacion por no atender
            - costo / 1000              # costo economico
        )

        # Evolucionar estado
        self.demanda     = int(np.clip(self.demanda + self.np_rng.randint(-5, 8), 15, 60))
        self.dia_semana  = (self.dia_semana + 1) % 7
        if accion != 2:
            self.camas_disp = max(10, self.camas_disp + self.np_rng.randint(-3, 3))

        terminado = self.paso >= 100
        return self._estado(), recompensa, terminado, {
            "atendidos": int(pacientes_atendidos),
            "sin_atencion": int(pacientes_sin_atencion),
            "costo_usd": costo,
        }

# Probar ambiente
env = AmbienteHospitalMSP(seed=42)
estado = env.reset()
print(f"  Estado inicial: camas={estado[0]*50:.0f}, medicos={estado[1]*20:.0f}, "
      f"demanda={estado[2]*60:.0f}")

_, rew, _, info = env.step(1)
print(f"  Accion 'reforzar_emergencia': recompensa={rew:.1f} | atendidos={info['atendidos']}")

# ================================================
# Q-LEARNING (TABLA Q)
# ================================================
print("\n--- Q-LEARNING TABULAR ---")

class QLearningAgent:
    """Q-Learning con discretizacion del espacio de estados."""

    def __init__(self, n_bins=5, n_acciones=4, lr=0.1, gamma=0.95,
                 epsilon=1.0, epsilon_min=0.05, epsilon_decay=0.995):
        self.n_bins    = n_bins
        self.n_acc     = n_acciones
        self.lr        = lr
        self.gamma     = gamma
        self.epsilon   = epsilon
        self.epsilon_min = epsilon_min
        self.epsilon_decay = epsilon_decay
        # Tabla Q: (bins^4, n_acciones)
        self.Q = np.zeros([n_bins] * 4 + [n_acciones])

    def _discretizar(self, estado):
        bins = np.linspace(0, 1, self.n_bins + 1)[1:-1]
        return tuple(np.digitize(s, bins) for s in estado)

    def seleccionar_accion(self, estado):
        if np.random.random() < self.epsilon:
            return np.random.randint(self.n_acc)
        idx = self._discretizar(estado)
        return np.argmax(self.Q[idx])

    def actualizar(self, s, a, r, s_next, terminado):
        idx      = self._discretizar(s)
        idx_next = self._discretizar(s_next)
        q_actual = self.Q[idx][a]
        q_target = r if terminado else r + self.gamma * np.max(self.Q[idx_next])
        self.Q[idx][a] += self.lr * (q_target - q_actual)
        self.epsilon    = max(self.epsilon_min, self.epsilon * self.epsilon_decay)

# Entrenar Q-Learning
agente_q = QLearningAgent()
EPISODIOS = 300
recompensas_q = []

for ep in range(EPISODIOS):
    env2 = AmbienteHospitalMSP(seed=ep)
    estado = env2.reset()
    recompensa_total = 0
    terminado = False

    while not terminado:
        accion   = agente_q.seleccionar_accion(estado)
        s_next, r, terminado, _ = env2.step(accion)
        agente_q.actualizar(estado, accion, r, s_next, terminado)
        estado           = s_next
        recompensa_total += r

    recompensas_q.append(recompensa_total)

print(f"  Q-Learning entrenado: {EPISODIOS} episodios")
print(f"  Recompensa promedio (ultimos 50): {np.mean(recompensas_q[-50:]):.1f}")
print(f"  Recompensa promedio (primeros 50): {np.mean(recompensas_q[:50]):.1f}")
print(f"  Epsilon final: {agente_q.epsilon:.3f}")

# ================================================
# DQN (DEEP Q-NETWORK)
# ================================================
print("\n--- DQN: DEEP Q-NETWORK ---")

class ReplayBuffer:
    def __init__(self, capacidad=2000):
        self.buffer = deque(maxlen=capacidad)

    def agregar(self, estado, accion, recompensa, siguiente, terminado):
        self.buffer.append((estado, accion, recompensa, siguiente, terminado))

    def muestrear(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        s, a, r, s_next, done = zip(*batch)
        return (torch.FloatTensor(s), torch.LongTensor(a),
                torch.FloatTensor(r), torch.FloatTensor(s_next),
                torch.FloatTensor(done))

    def __len__(self):
        return len(self.buffer)

class RedDQN(nn.Module):
    def __init__(self, n_estados, n_acciones):
        super().__init__()
        self.red = nn.Sequential(
            nn.Linear(n_estados, 64), nn.ReLU(),
            nn.Linear(64, 64),        nn.ReLU(),
            nn.Linear(64, n_acciones),
        )

    def forward(self, x):
        return self.red(x)

class AgenteDQN:
    def __init__(self, n_estados=4, n_acciones=4, lr=1e-3, gamma=0.95,
                 epsilon=1.0, epsilon_min=0.05, epsilon_decay=0.995,
                 batch_size=32, update_target_cada=50):
        self.n_acc     = n_acciones
        self.gamma     = gamma
        self.epsilon   = epsilon
        self.epsilon_min = epsilon_min
        self.epsilon_decay = epsilon_decay
        self.batch_size = batch_size
        self.update_target = update_target_cada
        self.paso_total = 0

        self.red_principal = RedDQN(n_estados, n_acciones)
        self.red_target    = RedDQN(n_estados, n_acciones)
        self.red_target.load_state_dict(self.red_principal.state_dict())

        self.optimizador = optim.Adam(self.red_principal.parameters(), lr=lr)
        self.criterio    = nn.MSELoss()
        self.buffer      = ReplayBuffer()

    def seleccionar_accion(self, estado):
        if np.random.random() < self.epsilon:
            return np.random.randint(self.n_acc)
        with torch.no_grad():
            q_vals = self.red_principal(torch.FloatTensor(estado).unsqueeze(0))
            return q_vals.argmax().item()

    def entrenar(self):
        if len(self.buffer) < self.batch_size:
            return None

        s, a, r, s_next, done = self.buffer.muestrear(self.batch_size)

        q_actual = self.red_principal(s).gather(1, a.unsqueeze(1)).squeeze(1)

        with torch.no_grad():
            q_next = self.red_target(s_next).max(1)[0]
            q_target = r + self.gamma * q_next * (1 - done)

        loss = self.criterio(q_actual, q_target)
        self.optimizador.zero_grad()
        loss.backward()
        self.optimizador.step()

        self.paso_total += 1
        if self.paso_total % self.update_target == 0:
            self.red_target.load_state_dict(self.red_principal.state_dict())

        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)
        return loss.item()

# Entrenar DQN
agente_dqn  = AgenteDQN()
recompensas_dqn = []

for ep in range(EPISODIOS):
    env3   = AmbienteHospitalMSP(seed=ep)
    estado = env3.reset()
    total  = 0
    done   = False

    while not done:
        accion = agente_dqn.seleccionar_accion(estado)
        s_next, r, done, _ = env3.step(accion)
        agente_dqn.buffer.agregar(estado, accion, r, s_next, done)
        agente_dqn.entrenar()
        estado = s_next
        total += r

    recompensas_dqn.append(total)

print(f"  DQN entrenado: {EPISODIOS} episodios")
print(f"  Recompensa promedio (ultimos 50): {np.mean(recompensas_dqn[-50:]):.1f}")
print(f"  Recompensa promedio (primeros 50): {np.mean(recompensas_dqn[:50]):.1f}")

# Comparacion
print(f"\n  === COMPARACION: Q-Learning vs DQN ===")
print(f"  {'Algoritmo':<20} {'Rew ultimos 50':>16} {'Rew primeros 50':>16} {'Mejora':>8}")
rew_q_ini  = np.mean(recompensas_q[:50])
rew_q_fin  = np.mean(recompensas_q[-50:])
rew_dqn_ini = np.mean(recompensas_dqn[:50])
rew_dqn_fin = np.mean(recompensas_dqn[-50:])

print(f"  {'Q-Learning (tabla)':<20} {rew_q_fin:>16.1f} {rew_q_ini:>16.1f} {rew_q_fin-rew_q_ini:>+8.1f}")
print(f"  {'DQN (red neuronal)':<20} {rew_dqn_fin:>16.1f} {rew_dqn_ini:>16.1f} {rew_dqn_fin-rew_dqn_ini:>+8.1f}")

# ================================================
# APLICACIONES RL EN ECUADOR
# ================================================
print("\n--- CASOS DE USO RL EN ECUADOR ---")

casos_uso = {
    "MSP — asignacion medicos":   "Estado=demanda+disponibilidad | Accion=mover recursos | Recompensa=pacientes/costo",
    "Supermaxi — inventario":     "Estado=stock+demanda+precio | Accion=pedir_X_unidades | Recompensa=ventas-stock_muerto",
    "CNT — enrutamiento red":     "Estado=trafico+latencia | Accion=rerouting | Recompensa=latencia+throughput",
    "EMAPA — agua distribucion":  "Estado=presion+consumo | Accion=valvulas | Recompensa=cobertura-desperdicio",
    "IESS — portafolio fondos":   "Estado=mercado+riesgo | Accion=rebalanceo | Recompensa=retorno-riesgo",
}

for caso, desc in casos_uso.items():
    print(f"  {caso:<30}: {desc}")

print("\n" + "=" * 65)
print("REINFORCEMENT LEARNING — CONCEPTOS CLAVE:")
print("  Q(s,a):       valor de tomar accion a en estado s")
print("  Bellman:      Q(s,a) = r + gamma * max Q(s',a')")
print("  Epsilon:      exploration vs exploitation — decae con el tiempo")
print("  Replay Buffer: rompe correlacion temporal — muestrea experiencias pasadas")
print("  Target Network: copia estable — evita divergencia en DQN")
print("  Gamma:        factor de descuento — cuanto valoro recompensas futuras")
print("=" * 65)
```

3. Implementa el ambiente de gestion de inventarios de Supermaxi: estado=stock actual, demanda historica 7 dias; acciones=pedir 0/50/100/200 unidades; recompensa=ventas - stock muerto - costo pedido.

4. Agrega el algoritmo Policy Gradient (REINFORCE) como alternativa a DQN y compara la convergencia en el mismo ambiente hospitalario.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Estoy implementando un sistema de Reinforcement Learning para optimizar la asignacion de camas hospitalarias en el MSP Ecuador. El ambiente tiene estado continuo (4 variables) y 4 acciones discretas. He probado Q-Learning tabular y DQN. Los problemas son: 1) el DQN diverge en los primeros 100 episodios (loss explota), 2) el agente aprende a siempre elegir 'conservar' (accion 0) para evitar penalizaciones — no explora. ¿Como soluciono ambos problemas? Para la divergencia: gradient clipping, Huber loss, o ajustar LR? Para la exploracion: reward shaping, curiosidad intrinseca, o modificar epsilon? Dame el codigo con las dos soluciones."

Despues de leer la respuesta:
- Implementa el gradient clipping en el loop de entrenamiento DQN.
- Agrega reward shaping: bonus de +5 por cada paciente adicional atendido respecto al promedio historico.

## Que aprendiste

- RL resuelve problemas de decision secuencial donde no hay un dataset etiquetado — el agente aprende por ensayo y error.
- Q-Learning es tabular — funciona bien para espacios de estado discretos y pequenos.
- DQN usa una red neuronal como aproximador de Q — escala a estados continuos y de alta dimension.
- El Replay Buffer rompe la correlacion temporal de las experiencias — esencial para convergencia.
- La Target Network es una copia estable de la red — evita que los targets cambien demasiado rapido.
- Epsilon-greedy balancea explorar acciones nuevas vs explotar el conocimiento actual.

## Reto extra

Construye el sistema de optimizacion de rutas de atencion medica movil del MSP Ecuador (unidades de salud itinerante): ambiente con 22 provincias, demanda diaria variable por zona (usando datos INEC reales), 10 unidades moviles con capacidad y velocidad distinta, costo de combustible por km, recompensa = poblacion atendida / (costo + distancia). Compara Q-Learning, DQN y PPO (Proximal Policy Optimization) en 1,000 episodios. Visualiza con Folium las rutas optimas aprendidas vs las rutas actuales del MSP — calcula el ahorro potencial en cobertura y costo.
