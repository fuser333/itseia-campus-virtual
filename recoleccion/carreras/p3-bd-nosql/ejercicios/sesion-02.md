# Ejercicio Sesion 2: MongoDB — Intro y Documentos

**Materia:** Bases de Datos NoSQL
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 30 min

## Objetivo

Instalar y configurar MongoDB localmente o en Atlas (cloud), comprender la estructura de documentos BSON/JSON, y crear la primera base de datos con colecciones de datos ecuatorianos reales.

## Contexto

MongoDB es la base de datos NoSQL mas usada en el mundo. En lugar de tablas con filas, usa colecciones con documentos JSON. Una empresa de logistica en Quito puede almacenar un pedido completo — cliente, items, direccion, historial — en un solo documento, sin necesitar 5 tablas relacionadas. Eso es el poder de MongoDB.

## Instrucciones

1. **Opcion A — Local:** Descarga MongoDB Community desde https://www.mongodb.com/try/download/community e instala.

2. **Opcion B — Atlas (recomendada para empezar):** Crea cuenta gratuita en https://www.mongodb.com/cloud/atlas — el tier M0 es gratis y suficiente para este ejercicio.

3. Instala `pymongo`: `pip install pymongo`.

4. Crea el archivo `sesion02_mongodb_intro_ecuador.py` y ejecuta:

```python
# MongoDB Intro - ITSEIA Bases de Datos NoSQL
# Conectar, crear colecciones, insertar documentos
# Dataset: Sistema de gestion academica ITSEIA

from pymongo import MongoClient
from datetime import datetime
import json

print("=" * 65)
print("MONGODB INTRO — SISTEMA ACADEMICO ITSEIA")
print("=" * 65)

# ================================================
# CONEXION
# Opcion A - Local:
#   client = MongoClient("mongodb://localhost:27017/")
# Opcion B - Atlas (reemplaza con tu cadena de conexion):
#   client = MongoClient("mongodb+srv://usuario:password@cluster.mongodb.net/")
# ================================================
# PARA ESTE EJERCICIO: simulamos la estructura sin conexion real
# Cuando tengas MongoDB instalado, descomenta la linea de conexion
# ================================================

# Simulacion de documentos (estructura identica a lo que MongoDB almacenaria)
print("\n--- ESTRUCTURA DE UNA BASE DE DATOS MONGODB ---")
print("  Base de datos:  itseia_academico")
print("  Colecciones:")
print("    - estudiantes     (un doc por estudiante)")
print("    - materias        (un doc por materia)")
print("    - matriculas      (un doc por matricula)")
print("    - calificaciones  (un doc por registro)")

# ================================================
# DOCUMENTOS: estructura BSON/JSON
# ================================================
print("\n--- DOCUMENTO: ESTUDIANTE (equivale a una fila en SQL) ---")

estudiante_doc = {
    "_id": "EST-2026-001",                    # identificador unico MongoDB
    "cedula": "1720456789",
    "nombres": "Maria Fernanda",
    "apellidos": "Quispe Lema",
    "fecha_nacimiento": "2000-04-15",
    "contacto": {                              # OBJETO ANIDADO (imposible en SQL plano)
        "email": "mquispe@itseia.ai",
        "whatsapp": "+593 98 765 4321",
        "ciudad": "Quito",
        "sector": "La Magdalena"
    },
    "inscripcion": {
        "fecha": "2026-01-20",
        "carrera": "Tecnologia Superior en Inteligencia Artificial",
        "periodo": 1,
        "turno": "vespertino",
        "fraternidad": "Luma"
    },
    "documentos": [                            # ARRAY DE DOCUMENTOS (imposible en SQL sin JOIN)
        {"tipo": "cedula", "verificado": True, "fecha_verificacion": "2026-01-18"},
        {"tipo": "titulo_bachiller", "verificado": True, "fecha_verificacion": "2026-01-18"},
        {"tipo": "foto_carnet", "verificado": True, "fecha_verificacion": "2026-01-19"}
    ],
    "pagos": [
        {"concepto": "inscripcion", "monto": 180.00, "fecha": "2026-01-20", "metodo": "transferencia"},
        {"concepto": "pension_enero", "monto": 220.00, "fecha": "2026-01-25", "metodo": "tarjeta"}
    ],
    "activo": True,
    "fecha_creacion": datetime.now().isoformat()
}

print(json.dumps(estudiante_doc, indent=2, ensure_ascii=False))

# ================================================
# COLECCION: multiples documentos con estructura VARIABLE
# ================================================
print("\n--- FLEXIBILIDAD DE DOCUMENTOS (diferentes esquemas) ---")

estudiante_tecnico = {
    "_id": "EST-2026-002",
    "cedula": "0912345678",
    "nombres": "Diego",
    "apellidos": "Mora Beltran",
    "contacto": {"email": "dmora@itseia.ai", "ciudad": "Guayaquil"},
    "inscripcion": {"carrera": "Big Data", "periodo": 1, "fraternidad": "Neo"},
    # Este estudiante tiene titulo de tecnico (campo adicional que el primero no tiene)
    "titulo_previo": {
        "nivel": "tecnico",
        "institucion": "ITSA Guayaquil",
        "anio_graduacion": 2023
    },
    # Y viene de empresa (campo adicional)
    "empresa_actual": {
        "nombre": "Banco Pichincha",
        "cargo": "analista junior",
        "anios_experiencia": 2
    },
    "activo": True
}

print("  Estudiante 1 tiene campos: contacto.whatsapp, documentos[], pagos[]")
print("  Estudiante 2 tiene campos: titulo_previo{}, empresa_actual{}")
print("  En MongoDB: ambos coexisten en la misma coleccion SIN error")
print("  En SQL: necesitarias tablas separadas o columnas NULL para todos")

# ================================================
# CONSULTAS SIMULADAS (estructura real MongoDB)
# ================================================
print("\n--- OPERACIONES BASICAS MONGODB (sintaxis real) ---")

operaciones = {
    "Insertar un documento": 'db.estudiantes.insertOne(doc)',
    "Insertar varios":       'db.estudiantes.insertMany([doc1, doc2, ...])',
    "Buscar todos":          'db.estudiantes.find()',
    "Buscar con filtro":     'db.estudiantes.find({"inscripcion.carrera": "IA"})',
    "Buscar uno":            'db.estudiantes.findOne({"cedula": "1720456789"})',
    "Contar":                'db.estudiantes.countDocuments({"activo": true})',
    "Actualizar":            'db.estudiantes.updateOne({"_id": "..."}, {$set: {"campo": valor}})',
    "Eliminar":              'db.estudiantes.deleteOne({"_id": "..."})',
}

for operacion, sintaxis in operaciones.items():
    print(f"  {operacion:<25}: {sintaxis}")

# ================================================
# COMPARACION: mismo dato en SQL vs MongoDB
# ================================================
print("\n--- COMPARACION: PEDIDO DE DELIVERY (SQL vs MongoDB) ---")

print("\n  SQL necesita 4 tablas para un pedido:")
sql_tablas = """
  tabla pedidos:     id, cliente_id, fecha, total, estado
  tabla clientes:    id, nombre, cedula, telefono
  tabla items:       id, pedido_id, producto_id, cantidad, precio
  tabla productos:   id, nombre, descripcion, precio_unitario

  Para ver un pedido completo: JOIN entre las 4 tablas
"""
print(sql_tablas)

print("  MongoDB: UN SOLO DOCUMENTO por pedido:")
pedido_mongo = {
    "_id": "PED-2024-001234",
    "fecha": "2024-03-25T19:45:00",
    "estado": "entregado",
    "cliente": {"nombre": "Carlos Andrade", "telefono": "+593 99 123 4567",
                 "direccion": "Av. 6 de Diciembre N35-100, Quito"},
    "items": [
        {"producto": "Caldo de pata", "cantidad": 2, "precio": 4.50},
        {"producto": "Seco de pollo", "cantidad": 1, "precio": 6.00},
        {"producto": "Jugo de mora",  "cantidad": 3, "precio": 1.50}
    ],
    "total": 19.50,
    "repartidor": "Juan Perez",
    "tiempo_entrega_min": 32
}
print(json.dumps(pedido_mongo, indent=2, ensure_ascii=False))

print("\n" + "=" * 65)
print("RESUMEN: Por que MongoDB?")
print("  - Documentos JSON anidados: datos relacionados en un solo lugar")
print("  - Schema flexible: agregar campos sin alterar la estructura")
print("  - Escalabilidad horizontal: distribuye datos en multiples servidores")
print("  - Lectura rapida: un documento = un pedido, sin JOINs costosos")
print("=" * 65)
```

5. Instala MongoDB Atlas y conecta el script real (reemplaza la linea de conexion comentada).

6. Crea la base de datos `itseia_academico` e inserta los dos documentos de estudiantes.

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Soy estudiante de NoSQL. Explica la diferencia entre un documento MongoDB y una fila SQL con un ejemplo concreto de un registro de estudiante universitario. ¿Que campos tendria el documento? ¿Cuales serian las ventajas frente a SQL para ese caso?"

Despues de leer la respuesta:
- Compara la estructura que Claude sugiere con la del ejercicio.
- Agrega al documento del estudiante los campos que Claude considero importantes y tu no tenias.

## Que aprendiste

- MongoDB organiza datos en colecciones de documentos JSON/BSON.
- Un documento puede tener objetos anidados `{}` y arrays `[]` — sin tablas adicionales.
- El campo `_id` es el identificador unico obligatorio (equivale a PRIMARY KEY en SQL).
- Documentos en la misma coleccion pueden tener campos distintos (schema-less).
- `pymongo` es el driver oficial para conectar Python con MongoDB.
- MongoDB Atlas ofrece un cluster gratuito M0 en la nube para desarrollo y aprendizaje.

## Reto extra

Disena el esquema de documentos para un sistema de inventario de una farmacia ecuatoriana. Cada medicamento tiene: nombre, principio activo, presentaciones (pastilla, jarabe, inyectable), precios por presentacion, lotes con fechas de vencimiento, y stock por sucursal (Quito, Guayaquil, Cuenca). Crea al menos 3 documentos de ejemplo en Python y explica por que MongoDB es mejor que SQL para este caso.
