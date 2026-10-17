# Ejercicio Sesion 5: Master Data Management (MDM)

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 55 min

## Objetivo

Disenar e implementar un programa de Master Data Management para una empresa ecuatoriana: identificar los dominios de datos maestros, construir el proceso de golden record (registro dorado), implementar la gestion de duplicados y el modelo de hub centralizado aplicado al caso del Registro Unico de Contribuyentes del SRI.

## Contexto

El Banco Central del Ecuador descubrio que tenia al mismo proveedor registrado 47 veces con distintas variantes de nombre (Constructora Ambato S.A., Constr. Ambato SA, CONSTRUCTORA AMBATO S.A., etc.), lo que generaba pagos duplicados y problemas de conciliacion. El IESS tiene al mismo afiliado con cedulas ligeramente distintas en cinco sistemas legacy diferentes. Este es el problema central de MDM: sin un registro maestro de verdad unica, cada sistema tiene su propia version del cliente, producto o proveedor, y la integracion nunca funciona. MDM es el fundamento sobre el que se construye cualquier analitica confiable.

## Instrucciones

1. Abre Google Colab y crea `sesion05_mdm_golden_record.ipynb`.

2. Simula el problema central de MDM con datos maestros fragmentados:

```python
# Gobierno de Datos - Sesion 5: Master Data Management
# ITSEIA - Periodo 5
# Estudiante: [Tu nombre]

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from difflib import SequenceMatcher
from collections import defaultdict

np.random.seed(42)

# ============================================================
# PARTE 1: El Problema — Datos Maestros Fragmentados
# ============================================================

print("PROBLEMA MDM: Contribuyente registrado en 5 sistemas del Estado")
print("=" * 65)

# El mismo contribuyente "Carlos Alberto Mora Vega" existe en 5 sistemas
# con ligeras variaciones en cada uno (tipicos de registros manuales)
contribuyente_real = {
    'cedula':    '1712345678',
    'nombre':    'Carlos Alberto Mora Vega',
    'email':     'camora@empresa.com',
    'telefono':  '0991234567',
    'direccion': 'Av. 6 de Diciembre N35-28, Quito',
    'ruc':       '1712345678001'
}

# Como aparece en cada sistema legacy del Ecuador
sistemas_legacy = {
    'SRI_Tributario': {
        'id':        'T-001234',
        'cedula':    '1712345678',
        'nombre':    'CARLOS MORA VEGA',           # Sin segundo nombre, todo mayuscula
        'email':     'camora@empresa.com',
        'telefono':  '099-123-4567',               # Formato con guiones
        'fecha_reg': '2015-03-12',
        'estado':    'ACTIVO'
    },
    'IESS_Seguridad': {
        'id':        'AF-789456',
        'cedula':    '1712345678',
        'nombre':    'Carlos A. Mora Vega',        # Segundo nombre abreviado
        'email':     'c.mora@empresa.com',         # Email distinto
        'telefono':  '0991234567',
        'fecha_reg': '2010-07-22',
        'estado':    'AFILIADO'
    },
    'MSP_Salud': {
        'id':        'P-445566',
        'cedula':    '171234567 8',                # Espacio en la cedula
        'nombre':    'Carlos Alberto Moura Vega',  # Typo: Moura en lugar de Mora
        'email':     'camora@empresa.com',
        'telefono':  '2345678',                    # Solo numero local
        'fecha_reg': '2018-11-05',
        'estado':    'ACTIVO'
    },
    'MIES_Social': {
        'id':        'B-112233',
        'cedula':    '1712345678',
        'nombre':    'carlos mora',                # Sin mayusculas, sin apellido materno
        'email':     None,                         # Sin email
        'telefono':  '099 123 45 67',              # Formato con espacios
        'fecha_reg': '2019-02-14',
        'estado':    'BENEFICIARIO'
    },
    'ANT_Transito': {
        'id':        'L-998877',
        'cedula':    '1712345678',
        'nombre':    'Carlos Alberto Mora V.',     # Apellido materno abreviado
        'email':     'camora@empresa.com',
        'telefono':  '+593991234567',              # Con codigo de pais
        'fecha_reg': '2016-08-30',
        'estado':    'VIGENTE'
    }
}

for sistema, datos in sistemas_legacy.items():
    print(f"\n  [{sistema}]")
    print(f"    ID     : {datos['id']}")
    print(f"    Cedula : {datos['cedula']}")
    print(f"    Nombre : {datos['nombre']}")
    print(f"    Email  : {datos['email']}")
    print(f"    Tel    : {datos['telefono']}")

print(f"\nMisma persona: 5 sistemas, 5 versiones distintas de nombre y contacto")
print(f"Sin MDM: ¿cual es la version correcta?")
```

3. Implementa el proceso de construccion del Golden Record:

```python
# ============================================================
# PARTE 2: Construccion del Golden Record
# ============================================================

def normalizar_nombre(nombre):
    """Normaliza nombre: mayusculas, sin abreviaciones obvias, trim."""
    if not nombre:
        return ""
    n = str(nombre).upper().strip()
    n = ' '.join(n.split())  # eliminar espacios multiples
    return n

def normalizar_cedula(cedula):
    """Elimina espacios y guiones de la cedula."""
    if not cedula:
        return ""
    return str(cedula).replace(' ', '').replace('-', '').strip()

def normalizar_telefono(telefono):
    """Normaliza a formato Ecuador: 10 digitos comenzando con 09."""
    if not telefono:
        return None
    t = str(telefono).replace(' ', '').replace('-', '').replace('+593', '0')
    if t.startswith('593'):
        t = '0' + t[3:]
    return t if len(t) == 10 else None

def similitud_texto(a, b):
    """Similitud entre dos cadenas de texto (0 a 1)."""
    return SequenceMatcher(None, str(a).lower(), str(b).lower()).ratio()

class GoldenRecordBuilder:
    """
    Construye el Golden Record (registro dorado) a partir de
    registros duplicados en multiples sistemas.
    Estrategia: field-level trust score por sistema fuente.
    """

    # Trust scores por campo y sistema (calibrado para Ecuador)
    TRUST_SCORES = {
        'cedula':    {'SRI_Tributario': 1.0, 'IESS_Seguridad': 1.0,
                      'MSP_Salud': 0.7, 'MIES_Social': 0.9, 'ANT_Transito': 1.0},
        'nombre':    {'SRI_Tributario': 0.9, 'IESS_Seguridad': 0.85,
                      'MSP_Salud': 0.6, 'MIES_Social': 0.5, 'ANT_Transito': 0.8},
        'email':     {'SRI_Tributario': 1.0, 'IESS_Seguridad': 0.8,
                      'MSP_Salud': 0.9, 'MIES_Social': 0.0, 'ANT_Transito': 0.9},
        'telefono':  {'SRI_Tributario': 0.9, 'IESS_Seguridad': 1.0,
                      'MSP_Salud': 0.4, 'MIES_Social': 0.7, 'ANT_Transito': 0.85},
        'fecha_reg': {'SRI_Tributario': 0.9, 'IESS_Seguridad': 1.0,
                      'MSP_Salud': 0.8, 'MIES_Social': 0.7, 'ANT_Transito': 0.85},
    }

    def construir(self, registros_por_sistema):
        """
        Construye el golden record eligiendo el valor de mayor confianza
        para cada campo.
        """
        golden = {
            'fuentes': [],
            'cedula': None, 'nombre': None, 'email': None,
            'telefono': None, 'fecha_primera_registro': None,
            'confianza_global': 0.0
        }

        campos_candidatos = defaultdict(list)  # campo -> [(valor, trust_score, sistema)]

        for sistema, datos in registros_por_sistema.items():
            golden['fuentes'].append(sistema)

            # Normalizar y registrar cada campo con su trust score
            cedula_norm = normalizar_cedula(datos.get('cedula', ''))
            if cedula_norm:
                campos_candidatos['cedula'].append(
                    (cedula_norm, self.TRUST_SCORES['cedula'].get(sistema, 0.5), sistema))

            nombre_norm = normalizar_nombre(datos.get('nombre', ''))
            if nombre_norm:
                campos_candidatos['nombre'].append(
                    (nombre_norm, self.TRUST_SCORES['nombre'].get(sistema, 0.5), sistema))

            email = datos.get('email')
            if email:
                campos_candidatos['email'].append(
                    (email, self.TRUST_SCORES['email'].get(sistema, 0.5), sistema))

            tel_norm = normalizar_telefono(datos.get('telefono', ''))
            if tel_norm:
                campos_candidatos['telefono'].append(
                    (tel_norm, self.TRUST_SCORES['telefono'].get(sistema, 0.5), sistema))

            fecha = datos.get('fecha_reg')
            if fecha:
                campos_candidatos['fecha_primera_registro'].append(
                    (fecha, self.TRUST_SCORES['fecha_reg'].get(sistema, 0.5), sistema))

        # Seleccionar el valor de mayor trust score para cada campo
        confianzas = []
        for campo, candidatos in campos_candidatos.items():
            if not candidatos:
                continue
            mejor = max(candidatos, key=lambda x: x[1])
            if campo == 'fecha_primera_registro':
                # Para fecha: tomar la mas antigua (primer registro conocido)
                golden[campo] = min(c[0] for c in candidatos)
            else:
                golden[campo] = mejor[0]
            confianzas.append(mejor[1])

        golden['confianza_global'] = np.mean(confianzas) if confianzas else 0.0
        golden['n_fuentes'] = len(golden['fuentes'])
        return golden

# Construir el Golden Record del contribuyente ejemplo
builder = GoldenRecordBuilder()
golden = builder.construir(sistemas_legacy)

print("\nGOLDEN RECORD CONSTRUIDO")
print("=" * 55)
print(f"  Cedula          : {golden['cedula']}")
print(f"  Nombre          : {golden['nombre']}")
print(f"  Email           : {golden['email']}")
print(f"  Telefono        : {golden['telefono']}")
print(f"  Primer registro : {golden['fecha_primera_registro']}")
print(f"  Fuentes usadas  : {golden['n_fuentes']} sistemas")
print(f"  Confianza global: {golden['confianza_global']:.2%}")

print(f"\nComparacion con datos reales del contribuyente:")
print(f"  Nombre real : {contribuyente_real['nombre']}")
print(f"  Golden name : {golden['nombre']}")
print(f"  Similitud   : {similitud_texto(contribuyente_real['nombre'], golden['nombre']):.2%}")
```

4. Implementa deteccion y deduplicacion a escala:

```python
# ============================================================
# PARTE 3: Deteccion de Duplicados a Escala
# ============================================================

# Simular 100 contribuyentes con duplicados
n_reales = 80
n_duplicados = 20

contribuyentes_base = pd.DataFrame({
    'cedula': [f"17{i:08d}" for i in range(n_reales)],
    'nombre': [f"Contribuyente Real {i:03d}" for i in range(n_reales)],
    'email':  [f"real{i}@gmail.com" for i in range(n_reales)],
})

# Crear variantes duplicadas de algunos contribuyentes
variantes_dup = []
for _ in range(n_duplicados):
    idx = np.random.randint(0, n_reales)
    orig = contribuyentes_base.iloc[idx]
    # Variante: mismo cedula, nombre ligeramente alterado
    nombre_variante = orig['nombre']
    if np.random.random() < 0.5:
        nombre_variante = orig['nombre'].lower()  # todo minuscula
    else:
        nombre_variante = orig['nombre'].replace('Real', 'R.')  # abreviacion
    variantes_dup.append({
        'cedula': orig['cedula'],
        'nombre': nombre_variante,
        'email':  orig['email'] if np.random.random() < 0.7 else None,
    })

df_dup = pd.DataFrame(variantes_dup)
df_total = pd.concat([contribuyentes_base, df_dup], ignore_index=True)
df_total = df_total.sample(frac=1, random_state=42).reset_index(drop=True)

print(f"\nDETECCION DE DUPLICADOS — Base consolidada")
print(f"Total registros   : {len(df_total)}")
print(f"Cedulas unicas    : {df_total['cedula'].nunique()}")
print(f"Duplicados por ID : {len(df_total) - df_total['cedula'].nunique()}")

# Estrategia 1: Duplicados exactos por cedula
duplicados_exactos = df_total[df_total.duplicated(subset=['cedula'], keep=False)]
print(f"\nDuplicados por cedula identica: {len(duplicados_exactos)} registros")

# Estrategia 2: Duplicados fuzzy por nombre (para casos sin cedula o con cedula diferente)
def detectar_duplicados_fuzzy(df, campo='nombre', umbral=0.85):
    """Detecta pares de registros con nombre muy similar (posibles duplicados)."""
    pares_sospechosos = []
    nombres = df[campo].fillna('').tolist()
    for i in range(min(len(nombres), 200)):  # limitar para demo
        for j in range(i+1, min(len(nombres), 200)):
            sim = similitud_texto(nombres[i], nombres[j])
            if sim >= umbral and nombres[i] != nombres[j]:
                pares_sospechosos.append((i, j, nombres[i], nombres[j], sim))
    return pares_sospechosos

pares = detectar_duplicados_fuzzy(df_total)
print(f"Pares sospechosos por similitud de nombre (>85%): {len(pares)}")
if pares:
    print("\nEjemplos de pares detectados:")
    for i, j, n1, n2, sim in pares[:3]:
        print(f"  [{sim:.2f}] '{n1}' vs '{n2}'")
```

5. Visualiza la arquitectura MDM y metricas:

```python
# ============================================================
# PARTE 4: Arquitectura Hub y Metricas MDM
# ============================================================

fig, axes = plt.subplots(1, 2, figsize=(13, 6))

# Panel 1: Distribucion de fuentes en los registros duplicados
fuentes_count = {}
for sistema in sistemas_legacy.keys():
    fuentes_count[sistema] = np.random.randint(80, 200)

ax1 = axes[0]
bars = ax1.barh(list(fuentes_count.keys()), list(fuentes_count.values()),
                color='#73B8E7', height=0.5)
for b, v in zip(bars, fuentes_count.values()):
    ax1.text(v + 1, b.get_y() + b.get_height()/2, str(v), va='center', fontsize=9)
ax1.set_xlabel('Registros contribuidos al MDM Hub')
ax1.set_title('Contribucion por Sistema Fuente')
ax1.grid(True, alpha=0.3, axis='x')

# Panel 2: Calidad del Golden Record antes vs despues del MDM
categorias = ['Completitud', 'Unicidad', 'Consistencia', 'Confianza']
antes = [0.72, 0.81, 0.65, 0.68]
despues = [0.95, 0.99, 0.94, 0.91]

x = np.arange(len(categorias))
w = 0.35
ax2 = axes[1]
b1 = ax2.bar(x - w/2, antes, w, label='Antes MDM', color='#F0846D', alpha=0.9)
b2 = ax2.bar(x + w/2, despues, w, label='Despues MDM', color='#73B8E7', alpha=0.9)
for b, v in zip(list(b1) + list(b2), antes + despues):
    ax2.text(b.get_x() + b.get_width()/2, b.get_height() + 0.01,
             f'{v:.0%}', ha='center', fontsize=8, fontweight='bold')
ax2.set_xticks(x)
ax2.set_xticklabels(categorias)
ax2.set_ylabel('Score de Calidad')
ax2.set_title('Impacto del MDM en Calidad')
ax2.set_ylim(0, 1.15)
ax2.legend()
ax2.grid(True, alpha=0.3, axis='y')

plt.suptitle('Master Data Management — SRI Ecuador | ITSEIA P5', color='gray')
plt.tight_layout()
plt.show()

# Resumen ejecutivo MDM
print("\nRESUMEN EJECUTIVO MDM")
print("=" * 55)
print(f"Sistemas fuente integrados : {len(sistemas_legacy)}")
print(f"Golden Record construido   : 1 (registro dorado por contribuyente)")
print(f"Confianza del golden record: {golden['confianza_global']:.2%}")
print(f"Reduccion de duplicados    : {n_duplicados} registros eliminados")
print(f"\nArquitectura elegida       : MDM Hub (registro maestro centralizado)")
print(f"Alternativas evaluadas     : Registry style, Coexistence style")
print(f"Herramientas Open Source   : Apache Atlas, Talend MDM, Informatica MDM")
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Soy el Chief Data Officer del Banco del Pichincha Ecuador. Tenemos al mismo cliente en 7 sistemas: Core bancario (Temenos), CRM (Salesforce), App movil, Seguro de vida, Creditos hipotecarios, Inversiones y Tarjetas. Cada sistema tiene su propia version del cliente. Necesito implementar MDM. ¿Que arquitectura MDM me recomiendas: Hub and Spoke, Registry, Coexistence o Consolidated? ¿Cual es el riesgo del enfoque Registry cuando un cliente actualiza su direccion en el app pero el Core no se actualiza en tiempo real? ¿Como implementaria el proceso de Master Data Stewardship: quien aprueba los cambios al golden record y bajo que flujo de trabajo?"

Despues de leer la respuesta:
- Diseña en una celda markdown el flujo de trabajo de aprobacion de cambios al golden record para el Pichincha.
- Define quien es el Data Steward para el dominio "cliente" y cuales son sus responsabilidades especificas.

## Que aprendiste

- El **Golden Record** es el registro de verdad unica construido a partir de multiples fuentes, usando trust scores por campo y por sistema fuente.
- La **normalizacion** antes de comparar es critica: nombres en mayusculas, cedulas sin espacios, telefonos con formato estandar.
- El **MDM Hub** centraliza el dato maestro; los sistemas satelite deben sincronizarse con el hub, no entre si.
- La **deduplicacion fuzzy** (similitud de texto) detecta duplicados que no son identicos pero representan la misma entidad real.
- El **Data Steward de dominio** es el responsable humano que aprueba cambios al golden record: sin este rol, el MDM se degrada rapidamente.

## Reto extra

Implementa la deteccion de duplicados usando **blocking** para hacerla escalable: en lugar de comparar todos contra todos (O(n^2)), agrupa primero por los primeros 4 digitos de la cedula y solo compara dentro de cada bloque. Mide el tiempo de ejecucion con y sin blocking para 10,000 registros. Luego investiga la libreria `recordlinkage` de Python y replica el ejercicio usando su implementacion optimizada. Compara el recall (% de duplicados reales encontrados) entre tu implementacion manual y la de la libreria.
