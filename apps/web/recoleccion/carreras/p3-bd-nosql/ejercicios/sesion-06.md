# Ejercicio Sesion 6: Firebase Firestore

**Materia:** Bases de Datos NoSQL
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion estimada:** 35 min

## Objetivo

Configurar Firebase Firestore, entender su modelo de datos (colecciones, documentos, subcolecciones), implementar operaciones CRUD y listeners en tiempo real, aplicados a un sistema de notificaciones para una app educativa ecuatoriana.

## Contexto

Firebase Firestore es la base de datos NoSQL de Google, diseñada para apps moviles y web que necesitan datos en tiempo real. En ITSEIA, Firestore podria potenciar una app movil donde los estudiantes ven sus notas actualizarse en tiempo real cuando el docente las ingresa, sin necesidad de recargar la pagina. Es el corazon de miles de startups en Ecuador y Latinoamerica.

## Instrucciones

1. Crea un proyecto en https://console.firebase.google.com/ (gratis).

2. En el proyecto, activa Firestore Database en modo test.

3. Instala el SDK: `pip install firebase-admin`.

4. Descarga la clave de servicio (serviceAccountKey.json) desde Configuracion del proyecto → Cuentas de servicio.

5. Crea el archivo `sesion06_firebase_firestore_ecuador.py`:

```python
# Firebase Firestore - ITSEIA Bases de Datos NoSQL
# Sistema de notificaciones y notas en tiempo real
# Plataforma educativa Ecuador

import json
from datetime import datetime, timedelta

print("=" * 65)
print("FIREBASE FIRESTORE — PLATAFORMA ITSEIA ACADEMY")
print("=" * 65)

# ================================================
# CONEXION REAL (descomenta cuando tengas Firebase)
# ================================================
# import firebase_admin
# from firebase_admin import credentials, firestore
#
# cred = credentials.Certificate("serviceAccountKey.json")
# firebase_admin.initialize_app(cred)
# db = firestore.client()
# print("Firebase conectado!")

# ================================================
# MODELO DE DATOS FIRESTORE
# ================================================
print("\n--- MODELO DE DATOS FIRESTORE ---")
print("""
  Firestore usa una estructura jerarquica:

  itseia_academy/
  ├── coleccion: estudiantes/
  │   ├── documento: EST-001/
  │   │   ├── campo: nombre, carrera, progreso
  │   │   └── subcoleccion: calificaciones/
  │   │       ├── documento: CAL-001 {materia, nota, fecha}
  │   │       └── documento: CAL-002 {materia, nota, fecha}
  │   └── documento: EST-002/ ...
  ├── coleccion: cursos/
  │   └── documento: CURSO-001/
  │       ├── campos: titulo, descripcion
  │       └── subcoleccion: modulos/ ...
  └── coleccion: notificaciones/
      └── documento: NOT-001 {mensaje, leido, timestamp}
""")

# ================================================
# ESTRUCTURA DE DOCUMENTOS FIRESTORE
# ================================================
print("--- DOCUMENTOS EJEMPLO ---")

# Documento: Estudiante
estudiante = {
    "id": "EST-001",
    "nombres": "Maria Fernanda",
    "apellidos": "Quispe Lema",
    "email": "mquispe@itseia.ai",
    "carrera": "Inteligencia Artificial",
    "periodo_actual": 1,
    "fraternidad": "Luma",
    "progreso_general_pct": 35.5,
    "ultima_conexion": datetime.now().isoformat(),
    "activo": True,
    # Timestamps especiales Firestore
    "fecha_creacion": "2026-01-20T10:00:00",
    "fecha_modificacion": datetime.now().isoformat()
}

# Subcoleccion: calificaciones del estudiante
calificaciones = [
    {"materia": "Python Avanzado",           "nota": 9.2, "tipo": "parcial1", "fecha": "2026-02-15"},
    {"materia": "Matematicas para IA",        "nota": 8.5, "tipo": "parcial1", "fecha": "2026-02-18"},
    {"materia": "Estadistica Inferencial",    "nota": 8.8, "tipo": "parcial1", "fecha": "2026-02-20"},
    {"materia": "Python Avanzado",            "nota": 9.5, "tipo": "parcial2", "fecha": "2026-03-15"},
    {"materia": "Matematicas para IA",        "nota": 7.8, "tipo": "parcial2", "fecha": "2026-03-18"},
]

print(f"Estudiante: {estudiante['nombres']} {estudiante['apellidos']}")
print(f"Carrera: {estudiante['carrera']}, Periodo: {estudiante['periodo_actual']}")
print(f"\nCalificaciones:")
for cal in calificaciones:
    print(f"  {cal['materia']:<30} | {cal['tipo']} | Nota: {cal['nota']}")

# ================================================
# CODIGO REAL FIRESTORE (con comentarios)
# ================================================
print("\n--- OPERACIONES FIRESTORE (sintaxis real) ---")

operaciones_firestore = """
import firebase_admin
from firebase_admin import credentials, firestore

# CONEXION
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# ======== CREATE ========
# Insertar estudiante con ID especifico
db.collection("estudiantes").document("EST-001").set(estudiante)

# Insertar con ID autogenerado
ref = db.collection("notificaciones").add({"mensaje": "Bienvenido", "leido": False})
print(f"Notificacion creada: {ref[1].id}")

# Subcoleccion: agregar calificacion
db.collection("estudiantes").document("EST-001") \\
  .collection("calificaciones").add(cal_doc)

# ======== READ ========
# Leer un documento por ID
doc = db.collection("estudiantes").document("EST-001").get()
if doc.exists:
    datos = doc.to_dict()

# Leer coleccion completa con filtro
estudiantes_ia = db.collection("estudiantes") \\
    .where("carrera", "==", "Inteligencia Artificial") \\
    .where("activo", "==", True) \\
    .order_by("progreso_general_pct", direction=firestore.Query.DESCENDING) \\
    .limit(10) \\
    .stream()

for est in estudiantes_ia:
    print(est.to_dict())

# ======== UPDATE ========
# Actualizar campo especifico (sin sobreescribir todo el doc)
db.collection("estudiantes").document("EST-001").update({
    "progreso_general_pct": 42.0,
    "fecha_modificacion": firestore.SERVER_TIMESTAMP
})

# Incrementar campo numerico
from google.cloud.firestore_v1 import ArrayUnion, Increment
db.collection("estudiantes").document("EST-001").update({
    "modulos_completados": Increment(1)
})

# ======== DELETE ========
# Eliminar campo
db.collection("estudiantes").document("EST-001").update({
    "campo_temporal": firestore.DELETE_FIELD
})

# Eliminar documento
db.collection("estudiantes").document("EST-BORRAR").delete()

# ======== LISTENER TIEMPO REAL ========
def on_snapshot(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        print(f"Cambio detectado: {doc.id} → {doc.to_dict()}")

# Escuchar cambios en tiempo real (para app web/movil)
doc_ref = db.collection("calificaciones_live")
watch = doc_ref.on_snapshot(on_snapshot)
"""

print(operaciones_firestore)

# ================================================
# SIMULACION: sistema de notificaciones
# ================================================
print("--- SIMULACION: SISTEMA NOTIFICACIONES TIEMPO REAL ---")

notificaciones = [
    {
        "id": "NOT-001",
        "tipo": "nota_publicada",
        "destinatario": "EST-001",
        "mensaje": "Tu nota de Python Avanzado P2 ha sido publicada: 9.5",
        "leido": False,
        "prioridad": "normal",
        "timestamp": datetime.now().isoformat()
    },
    {
        "id": "NOT-002",
        "tipo": "pago_confirmado",
        "destinatario": "EST-001",
        "mensaje": "Pension de Marzo 2026 confirmada. Gracias!",
        "leido": True,
        "prioridad": "normal",
        "timestamp": (datetime.now() - timedelta(days=2)).isoformat()
    },
    {
        "id": "NOT-003",
        "tipo": "alerta_academica",
        "destinatario": "EST-002",
        "mensaje": "Tienes 2 tareas pendientes. Fecha limite: Viernes",
        "leido": False,
        "prioridad": "alta",
        "timestamp": datetime.now().isoformat()
    }
]

print("\nNotificaciones pendientes:")
no_leidas = [n for n in notificaciones if not n["leido"]]
for n in no_leidas:
    prioridad_icon = "(!)" if n["prioridad"] == "alta" else "( )"
    print(f"  {prioridad_icon} [{n['tipo']}] {n['mensaje'][:60]}")

# ================================================
# REGLAS DE SEGURIDAD FIRESTORE
# ================================================
print("\n--- REGLAS DE SEGURIDAD (Firestore Security Rules) ---")
reglas = """
// Archivo: firestore.rules
// Solo el propio estudiante puede leer/escribir sus datos

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Estudiantes: solo el propio usuario puede leer su perfil
    match /estudiantes/{estudianteId} {
      allow read: if request.auth != null && request.auth.uid == estudianteId;
      allow write: if request.auth != null && request.auth.uid == estudianteId;
    }

    // Calificaciones: solo lectura para el estudiante, escritura solo para admin
    match /estudiantes/{estudianteId}/calificaciones/{calId} {
      allow read: if request.auth != null && request.auth.uid == estudianteId;
      allow write: if request.auth.token.role == 'admin';
    }

    // Notificaciones: lectura propia, escritura solo backend
    match /notificaciones/{notId} {
      allow read: if request.auth != null &&
                     resource.data.destinatario == request.auth.uid;
      allow write: if false; // solo el servidor puede escribir
    }
  }
}
"""
print(reglas)

print("=" * 65)
print("VENTAJAS FIREBASE FIRESTORE vs MongoDB:")
print("  + Sin servidor propio: 100% gestionado por Google")
print("  + SDK iOS/Android/Web nativo: ideal para apps moviles")
print("  + Listeners tiempo real: cambios instantaneos sin polling")
print("  + Reglas de seguridad declarativas: control de acceso fino")
print("  + Free tier generoso: 1GB almacenamiento, 50K lecturas/dia")
print("  - Precio escala: puede ser caro a grandes volumenes")
print("  - Vendor lock-in: dependencia de Google Cloud")
print("=" * 65)
```

6. Conecta con Firebase real: crea el proyecto, habilita Firestore, descarga `serviceAccountKey.json` e inserta los documentos reales.

7. Implementa un listener en tiempo real que imprima cada cambio en la coleccion `notificaciones`.

## Usa IA para...

> Abre Gemini (gemini.google.com) y escribe:
> "Soy desarrollador en Ecuador creando una app movil educativa con Firebase Firestore. ¿Como estructuro la base de datos para: estudiantes con sus cursos, progreso por modulo, calificaciones y notificaciones? Dame el esquema de colecciones y subcolecciones en formato arbol."

Despues de leer la respuesta:
- Compara el esquema sugerido por Gemini con el del ejercicio.
- Implementa los cambios que consideres mejores en el codigo.

## Que aprendiste

- Firestore usa colecciones > documentos > subcolecciones (estructura jerarquica).
- Los documentos tienen campos tipados: string, number, boolean, array, map, timestamp.
- `set()` crea o sobreescribe; `update()` modifica solo los campos especificados.
- Los listeners `.on_snapshot()` notifican cambios en tiempo real — clave para apps reactivas.
- Las Security Rules controlan quien puede leer o escribir cada documento.
- Firestore escala automaticamente sin configuracion de servidores.

## Reto extra

Implementa una funcion de "progreso en tiempo real" usando Firestore: cuando un estudiante completa un modulo, actualiza su documento con `Increment(1)` y el timestamp. Crea un dashboard HTML simple que use el SDK de JavaScript de Firebase para mostrar el progreso de todos los estudiantes activos en tiempo real, sin necesidad de recargar la pagina.
