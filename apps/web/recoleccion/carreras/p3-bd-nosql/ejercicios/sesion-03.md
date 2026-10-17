# Ejercicio Sesion 3: CRUD en MongoDB

**Materia:** Bases de Datos NoSQL
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion estimada:** 40 min

## Objetivo

Implementar las cuatro operaciones fundamentales de MongoDB: Create (insertar), Read (consultar), Update (actualizar) y Delete (eliminar), usando pymongo sobre una coleccion de productos de una empresa ecuatoriana.

## Contexto

CRUD es la base de cualquier sistema de informacion. En MongoDB, estas operaciones se ejecutan sobre documentos JSON en lugar de filas SQL. Una tienda virtual ecuatoriana como Supermaxi Online ejecuta miles de operaciones CRUD por hora — agregar productos al carrito, actualizar stock, marcar pedidos como entregados, eliminar productos descontinuados. Este ejercicio te enseña a construir ese backend.

## Instrucciones

1. Instala pymongo: `pip install pymongo`.

2. Configura la conexion MongoDB (Atlas M0 gratuito o local).

3. Crea el archivo `sesion03_crud_mongodb_ecuador.py`:

```python
# CRUD MongoDB - ITSEIA Bases de Datos NoSQL
# Dataset: Inventario supermercado Ecuador
# Operaciones: Create, Read, Update, Delete

from pymongo import MongoClient, ASCENDING, DESCENDING
from datetime import datetime, timedelta
import random

print("=" * 65)
print("CRUD MONGODB — INVENTARIO SUPERMAXI ECUADOR")
print("=" * 65)

# ================================================
# CONEXION (reemplaza con tu cadena de conexion)
# ================================================
# client = MongoClient("mongodb+srv://usuario:pass@cluster.mongodb.net/")
# db = client["supermaxi_ecuador"]
# productos = db["productos"]

# MODO SIMULACION: ejecutamos sin conexion real
# Todos los comandos muestran la sintaxis correcta para MongoDB
class ColeccionSimulada:
    """Simula pymongo para practicar sintaxis sin conexion."""
    def __init__(self, nombre):
        self.nombre = nombre
        self._datos = []
        self._contador = 0

    def insert_one(self, doc):
        doc["_id"] = doc.get("_id", f"id_{self._contador}")
        self._datos.append(doc.copy())
        self._contador += 1
        print(f"  [OK] insertOne: {doc.get('codigo', doc['_id'])}")
        return type("Result", (), {"inserted_id": doc["_id"]})()

    def insert_many(self, docs):
        ids = []
        for doc in docs:
            doc["_id"] = doc.get("_id", f"id_{self._contador}")
            self._datos.append(doc.copy())
            self._contador += 1
            ids.append(doc["_id"])
        print(f"  [OK] insertMany: {len(docs)} documentos insertados")
        return type("Result", (), {"inserted_ids": ids})()

    def find(self, filtro=None, proyeccion=None):
        if filtro is None:
            return list(self._datos)
        result = []
        for doc in self._datos:
            if all(doc.get(k) == v for k, v in filtro.items()
                   if not isinstance(v, dict)):
                result.append(doc)
        return result

    def find_one(self, filtro):
        for doc in self._datos:
            if all(doc.get(k) == v for k, v in filtro.items()):
                return doc
        return None

    def count_documents(self, filtro=None):
        if not filtro:
            return len(self._datos)
        return sum(1 for doc in self._datos
                   if all(doc.get(k) == v for k, v in filtro.items()))

    def update_one(self, filtro, operacion):
        for i, doc in enumerate(self._datos):
            if all(doc.get(k) == v for k, v in filtro.items()):
                if "$set" in operacion:
                    self._datos[i].update(operacion["$set"])
                if "$inc" in operacion:
                    for k, v in operacion["$inc"].items():
                        self._datos[i][k] = self._datos[i].get(k, 0) + v
                print(f"  [OK] updateOne: {filtro} → {operacion}")
                return

    def delete_one(self, filtro):
        for i, doc in enumerate(self._datos):
            if all(doc.get(k) == v for k, v in filtro.items()):
                del self._datos[i]
                print(f"  [OK] deleteOne: {filtro}")
                return

productos = ColeccionSimulada("productos")

# ================================================
# CREATE — Insertar documentos
# ================================================
print("\n[CREATE] Insertar productos al inventario")

# insertOne: un solo producto
resultado = productos.insert_one({
    "codigo": "PROD-001",
    "nombre": "Arroz Diana 1kg",
    "categoria": "abarrotes",
    "marca": "Diana",
    "precio_venta": 1.25,
    "precio_costo": 0.85,
    "stock": {
        "quito_norte": 250,
        "quito_sur":   180,
        "guayaquil":   320
    },
    "proveedor": "Pronaca SA",
    "fecha_vencimiento": (datetime.now() + timedelta(days=180)).isoformat(),
    "activo": True,
    "fecha_creacion": datetime.now().isoformat()
})

# insertMany: varios productos
lote_productos = [
    {
        "codigo": "PROD-002",
        "nombre": "Aceite La Favorita 1L",
        "categoria": "abarrotes",
        "precio_venta": 3.45,
        "precio_costo": 2.10,
        "stock": {"quito_norte": 180, "quito_sur": 120, "guayaquil": 200},
        "proveedor": "La Favorita Corp",
        "activo": True
    },
    {
        "codigo": "PROD-003",
        "nombre": "Leche Toni 1L",
        "categoria": "lacteos",
        "precio_venta": 1.15,
        "precio_costo": 0.78,
        "stock": {"quito_norte": 450, "quito_sur": 380, "guayaquil": 500},
        "proveedor": "Toni SA",
        "cadena_frio": True,          # campo extra que abarrotes no tiene
        "temperatura_max_c": 4,
        "activo": True
    },
    {
        "codigo": "PROD-004",
        "nombre": "Detergente Deja 1kg",
        "categoria": "limpieza",
        "precio_venta": 2.80,
        "precio_costo": 1.65,
        "stock": {"quito_norte": 310, "quito_sur": 240, "guayaquil": 280},
        "activo": True
    },
    {
        "codigo": "PROD-005",
        "nombre": "Camaron Congelado 1lb",
        "categoria": "mariscos",
        "precio_venta": 4.50,
        "precio_costo": 2.90,
        "stock": {"quito_norte": 85, "guayaquil": 220},
        "origen": "Guayas, Ecuador",
        "cadena_frio": True,
        "temperatura_max_c": -18,
        "activo": True
    }
]
productos.insert_many(lote_productos)
print(f"  Total productos insertados: {productos.count_documents()}")

# ================================================
# READ — Consultar documentos
# ================================================
print("\n[READ] Consultar inventario")

# find() - todos los documentos
print("\n  Todos los productos:")
for p in productos.find():
    stock_total = sum(p["stock"].values()) if isinstance(p.get("stock"), dict) else 0
    print(f"    [{p['codigo']}] {p['nombre']:<30} | ${p['precio_venta']:.2f} | stock total: {stock_total}")

# find() con filtro por categoria
print("\n  Solo abarrotes:")
abarrotes = productos.find({"categoria": "abarrotes"})
for p in abarrotes:
    print(f"    {p['nombre']} — ${p['precio_venta']}")

# findOne - buscar por codigo
print("\n  Buscar PROD-003 por codigo:")
prod = productos.find_one({"codigo": "PROD-003"})
if prod:
    print(f"    Encontrado: {prod['nombre']} | Precio: ${prod['precio_venta']}")

# count
print(f"\n  Total productos activos: {productos.count_documents({'activo': True})}")

# ================================================
# UPDATE — Actualizar documentos
# ================================================
print("\n[UPDATE] Actualizar inventario")

# $set: cambiar precio de venta
print("\n  Actualizar precio Arroz Diana:")
print("  Sintaxis MongoDB: db.productos.updateOne({codigo:'PROD-001'}, {$set:{precio_venta:1.35}})")
productos.update_one(
    {"codigo": "PROD-001"},
    {"$set": {"precio_venta": 1.35, "fecha_modificacion": datetime.now().isoformat()}}
)

# $inc: incrementar stock
print("\n  Reabastecimiento: +100 unidades Arroz en Quito Norte:")
print("  Sintaxis MongoDB: db.productos.updateOne({...}, {$inc: {'stock.quito_norte': 100}})")
# Nota: $inc en subdocumentos con pymongo usa notacion de punto
productos.update_one(
    {"codigo": "PROD-001"},
    {"$inc": {"stock_total_simulado": 100}}  # simplificado para simulacion
)

# Verificar cambio
prod_actualizado = productos.find_one({"codigo": "PROD-001"})
if prod_actualizado:
    print(f"  Precio actualizado: ${prod_actualizado.get('precio_venta', 'N/A')}")

# ================================================
# DELETE — Eliminar documentos
# ================================================
print("\n[DELETE] Eliminar productos")

# deleteOne: eliminar un producto descontinuado
print("\n  Eliminar Camaron Congelado (descontinuado por temporada):")
print("  Sintaxis MongoDB: db.productos.deleteOne({codigo: 'PROD-005'})")
antes = productos.count_documents()
productos.delete_one({"codigo": "PROD-005"})
despues = productos.count_documents()
print(f"  Productos: {antes} → {despues}")

# Buena practica: soft delete en lugar de hard delete
print("\n  MEJOR PRACTICA — Soft delete (marcar como inactivo):")
print("  db.productos.updateOne({codigo:'PROD-005'}, {$set:{activo:false, fecha_baja: new Date()}})")
print("  Ventaja: mantiene historial, permite recuperacion, auditable")

# ================================================
# RESUMEN CRUD
# ================================================
print("\n" + "=" * 65)
print("RESUMEN OPERACIONES CRUD MONGODB")
operaciones_resumen = [
    ("CREATE", "insertOne(doc)",         "Insertar 1 documento"),
    ("CREATE", "insertMany([d1, d2])",   "Insertar varios documentos"),
    ("READ",   "find(filtro)",           "Buscar multiples documentos"),
    ("READ",   "findOne(filtro)",        "Buscar un documento"),
    ("READ",   "countDocuments(filtro)", "Contar documentos"),
    ("UPDATE", "updateOne(f, {$set})",   "Actualizar campos"),
    ("UPDATE", "updateMany(f, {$set})",  "Actualizar multiples"),
    ("DELETE", "deleteOne(filtro)",      "Eliminar un documento"),
    ("DELETE", "deleteMany(filtro)",     "Eliminar multiples"),
]
for op, metodo, desc in operaciones_resumen:
    print(f"  [{op:<6}] {metodo:<30} → {desc}")
print("=" * 65)
```

4. Adapta el codigo para que use pymongo real con tu conexion Atlas.

5. Agrega una operacion `update_many` que suba el precio de todos los productos de `abarrotes` en un 5%.

## Usa IA para...

> Abre Gemini (gemini.google.com) y escribe:
> "Soy estudiante de MongoDB. Explica la diferencia entre $set, $inc, $push y $pull en operaciones updateOne. Dame un ejemplo de cada uno con un documento de producto de supermercado en Ecuador."

Despues de leer la respuesta:
- Implementa los operadores `$push` y `$pull` en el script.
- Usa `$push` para agregar una nueva sucursal al campo `stock` de un producto.

## Que aprendiste

- `insertOne()` y `insertMany()` son los operadores CREATE de MongoDB.
- `find()` devuelve cursor iterable; `findOne()` devuelve el primer documento que coincide.
- `updateOne()` con `$set` cambia campos especificos sin afectar el resto del documento.
- `$inc` incrementa valores numericos atomicamente — clave para manejar stock.
- `deleteOne()` elimina permanentemente — en produccion prefiere soft delete con `$set: {activo: false}`.
- Los filtros en MongoDB usan documentos JSON: `{"campo": "valor"}`.

## Reto extra

Implementa un sistema de "log de operaciones" para el inventario: cada vez que se actualiza un precio o stock, guarda un documento en una coleccion `auditoria` con: producto, campo_modificado, valor_anterior, valor_nuevo, usuario, timestamp. Crea la funcion `registrar_auditoria(coleccion, operacion, detalle)` y llamala desde cada UPDATE del ejercicio.
