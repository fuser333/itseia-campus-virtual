# Ejercicio Sesion 2: Hadoop — HDFS Conceptos y Arquitectura

**Materia:** Ecosistema Big Data (Hadoop/Spark)
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Comprender la arquitectura de Hadoop HDFS (Sistema de Archivos Distribuido) y el modelo maestro-esclavo (NameNode/DataNode), simular el proceso de distribucion y replicacion de bloques, y evaluar cuando HDFS es la solucion correcta para problemas de datos ecuatorianos.

## Contexto

El SRI de Ecuador recibe y procesa millones de comprobantes electronicos diariamente. Un archivo CSV con todas las facturas del 2024 tendria mas de 5 GB. HDFS resuelve el problema de almacenar y leer archivos tan grandes distribuyendolos en bloques de 128MB a traves de multiples servidores. En este ejercicio entenderemos la arquitectura sin necesitar un cluster real: lo simulamos en Python para visualizar como funciona el corazon de Hadoop.

## Instrucciones

1. Abre Google Colab y crea `sesion02_hadoop_hdfs.ipynb`.

2. Simula la arquitectura HDFS con Python:

```python
# ITSEIA - Ecosistema Big Data - Sesion 2
# Hadoop HDFS: arquitectura y simulacion

import math
import random
from dataclasses import dataclass, field
from typing import List, Dict

# ============================================================
# COMPONENTES HDFS
# ============================================================

@dataclass
class DataNode:
    """Nodo trabajador: almacena bloques de datos"""
    node_id: str
    capacidad_gb: float
    usado_gb: float = 0.0
    bloques: List[str] = field(default_factory=list)
    activo: bool = True

    @property
    def espacio_libre_gb(self):
        return self.capacidad_gb - self.usado_gb

    @property
    def uso_pct(self):
        return (self.usado_gb / self.capacidad_gb) * 100

    def __repr__(self):
        estado = "OK" if self.activo else "FALLA"
        return (f"DataNode {self.node_id} [{estado}] "
                f"{self.usado_gb:.1f}/{self.capacidad_gb}GB "
                f"({self.uso_pct:.0f}%) | {len(self.bloques)} bloques")


@dataclass
class Bloque:
    """Unidad de almacenamiento HDFS (128MB por defecto)"""
    bloque_id: str
    archivo: str
    numero: int
    tamano_mb: float
    replicas_en: List[str] = field(default_factory=list)  # node_ids

    def __repr__(self):
        return (f"Bloque {self.bloque_id} ({self.tamano_mb:.1f}MB) "
                f"de [{self.archivo}] -> Replicas en: {self.replicas_en}")


class NameNode:
    """Nodo maestro: gestiona metadata y ubicacion de bloques"""
    BLOCK_SIZE_MB = 128
    REPLICATION_FACTOR = 3

    def __init__(self):
        self.namespace: Dict[str, List[str]] = {}   # archivo -> [bloque_ids]
        self.bloques: Dict[str, Bloque] = {}         # bloque_id -> Bloque
        self.data_nodes: Dict[str, DataNode] = {}
        self._contador_bloques = 0

    def agregar_data_node(self, node: DataNode):
        self.data_nodes[node.node_id] = node
        print(f"  [NameNode] DataNode registrado: {node}")

    def subir_archivo(self, nombre_archivo: str, tamano_mb: float) -> bool:
        """Simula la escritura de un archivo en HDFS"""
        if len(self.data_nodes) < self.REPLICATION_FACTOR:
            print(f"  [ERROR] Se necesitan al menos {self.REPLICATION_FACTOR} DataNodes activos.")
            return False

        nodos_activos = [n for n in self.data_nodes.values() if n.activo]
        if len(nodos_activos) < self.REPLICATION_FACTOR:
            print(f"  [ERROR] Solo {len(nodos_activos)} nodos activos. Minimo: {self.REPLICATION_FACTOR}")
            return False

        # Calcular cuantos bloques necesita
        num_bloques = math.ceil(tamano_mb / self.BLOCK_SIZE_MB)
        ultimo_bloque_mb = tamano_mb - (num_bloques - 1) * self.BLOCK_SIZE_MB
        print(f"\n  [HDFS] Subiendo: {nombre_archivo} ({tamano_mb:.0f} MB)")
        print(f"  [HDFS] Bloques necesarios: {num_bloques} x {self.BLOCK_SIZE_MB}MB "
              f"(ultimo: {ultimo_bloque_mb:.1f}MB)")

        bloque_ids = []
        for i in range(num_bloques):
            self._contador_bloques += 1
            bloque_id = f"blk_{self._contador_bloques:05d}"
            tam = self.BLOCK_SIZE_MB if i < num_bloques - 1 else ultimo_bloque_mb

            # Seleccionar nodos para replicas (sin repetir)
            nodos_elegidos = random.sample(nodos_activos,
                                           min(self.REPLICATION_FACTOR, len(nodos_activos)))
            replica_ids = [n.node_id for n in nodos_elegidos]

            # Guardar bloque en metadata
            bloque = Bloque(bloque_id, nombre_archivo, i+1, tam, replica_ids)
            self.bloques[bloque_id] = bloque
            bloque_ids.append(bloque_id)

            # Actualizar DataNodes
            for nodo in nodos_elegidos:
                nodo.bloques.append(bloque_id)
                nodo.usado_gb += tam / 1024

            print(f"  [HDFS] Bloque {i+1}/{num_bloques}: {bloque_id} ({tam:.1f}MB) -> {replica_ids}")

        self.namespace[nombre_archivo] = bloque_ids
        print(f"  [HDFS] Escritura exitosa. {num_bloques} bloques, {self.REPLICATION_FACTOR}x replicados.")
        return True

    def estado_cluster(self):
        print("\n" + "=" * 65)
        print("ESTADO DEL CLUSTER HDFS")
        print("=" * 65)
        total_cap = sum(n.capacidad_gb for n in self.data_nodes.values())
        total_usado = sum(n.usado_gb for n in self.data_nodes.values())
        print(f"Total DataNodes: {len(self.data_nodes)}")
        print(f"Archivos en HDFS: {len(self.namespace)}")
        print(f"Total bloques: {len(self.bloques)}")
        print(f"Capacidad total: {total_cap:.0f} GB")
        print(f"Usado: {total_usado:.1f} GB ({total_usado/total_cap*100:.1f}%)")
        print("\nEstado por DataNode:")
        for nodo in self.data_nodes.values():
            print(f"  {nodo}")
```

3. Levanta un cluster simulado y sube archivos del SRI Ecuador:

```python
# ============================================================
# CREAR CLUSTER HDFS SIMULADO
# ============================================================

print("Inicializando cluster Hadoop HDFS...")
namenode = NameNode()

# Crear 5 DataNodes (servidores de datos)
for i in range(1, 6):
    nodo = DataNode(
        node_id=f"dn-{i:02d}",
        capacidad_gb=random.choice([500, 1000, 2000])
    )
    namenode.agregar_data_node(nodo)

print("\n" + "=" * 65)
print("SUBIENDO ARCHIVOS DEL SRI ECUADOR")
print("=" * 65)

# Archivos reales que el SRI procesaria
archivos_sri = [
    ("facturas_2024_Q1.csv",    1240),  # 1.24 GB
    ("facturas_2024_Q2.csv",    1380),  # 1.38 GB
    ("retenciones_2024.csv",     320),  # 320 MB
    ("declaraciones_iva_2024.csv", 890), # 890 MB
    ("contribuyentes_ruc.csv",   450),  # 450 MB
    ("log_transacciones_dic.json", 2100), # 2.1 GB
]

for nombre, tamano_mb in archivos_sri:
    namenode.subir_archivo(nombre, tamano_mb)

namenode.estado_cluster()
```

4. Simula la falla de un DataNode y la recuperacion:

```python
# ============================================================
# SIMULACION: FALLA DE DATANODE
# ============================================================
print("\n" + "=" * 65)
print("SIMULANDO FALLA DE DataNode dn-03")
print("=" * 65)

# El NameNode detecta que dn-03 dejo de responder
namenode.data_nodes['dn-03'].activo = False
print("  [NameNode] ALERTA: dn-03 no responde. Verificando replicas...")

# Verificar que archivos tienen bloques en ese nodo
bloques_en_riesgo = []
for bloque_id, bloque in namenode.bloques.items():
    if 'dn-03' in bloque.replicas_en:
        replicas_restantes = [r for r in bloque.replicas_en if r != 'dn-03']
        bloques_en_riesgo.append((bloque_id, replicas_restantes))

print(f"  Bloques afectados: {len(bloques_en_riesgo)}")
print("  Re-replicacion automatica iniciada...")

for bloque_id, restantes in bloques_en_riesgo[:5]:  # Mostrar primeros 5
    nodos_disponibles = [n for n in namenode.data_nodes.values()
                         if n.activo and n.node_id not in restantes]
    if nodos_disponibles:
        nuevo_nodo = random.choice(nodos_disponibles)
        namenode.bloques[bloque_id].replicas_en.append(nuevo_nodo.node_id)
        print(f"  Bloque {bloque_id}: replicado de {restantes} -> +{nuevo_nodo.node_id}")

print("\n  [NameNode] Re-replicacion completada. Factor de replicacion restaurado: 3x")
print("  Conclusion: HDFS sobrevive a la falla de nodos sin perder datos.")
```

5. En una celda de texto responde:
   - ¿Por que HDFS usa bloques de 128MB y no de 1MB?
   - ¿Que pasaria si el NameNode falla? ¿Como resuelve Hadoop esto con HDFS HA?
   - ¿Por que el factor de replicacion es 3 por defecto?

## Usa IA para...

> Abre Claude y escribe:
> "Explica con una analogia simple (sin terminos tecnicos) como funciona HDFS para alguien que nunca ha escuchado de Big Data. Luego explica la diferencia entre HDFS y Google Drive para almacenar archivos grandes. ¿Cual es mejor para cada caso de uso?"

Compara la analogia de Claude con la simulacion que hiciste. ¿Coincide con la realidad tecnica?

## Que aprendiste

- HDFS divide archivos grandes en bloques de 128MB y los distribuye en multiples servidores.
- El NameNode guarda solo metadata (donde esta cada bloque), no los datos reales.
- El factor de replicacion 3x garantiza tolerancia a fallas: si 2 servidores fallan simultaneamente, los datos sobreviven.
- HDFS es "write once, read many": optimo para analytics pero NO para actualizaciones frecuentes.
- La re-replicacion automatica es una de las caracteristicas mas valiosas de Hadoop.

## Reto extra

Modifica la clase `NameNode` para agregar un metodo `leer_archivo(nombre)` que retorne la lista de bloques y en que DataNodes esta cada replica, simulando como HDFS decide de cual replica leer (eligiendo el nodo mas cercano o el menos cargado). Implementa la logica de "nodo menos cargado" comparando `uso_pct` de los DataNodes disponibles.
