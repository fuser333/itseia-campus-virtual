# Ejercicio Sesion 7: Supabase como NoSQL

**Materia:** Bases de Datos NoSQL
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Usar Supabase como alternativa open-source a Firebase, aprovechando su API REST y realtime para almacenar documentos JSON en columnas JSONB de PostgreSQL, implementando un sistema de perfiles dinamicos para la plataforma ITSEIA.

## Contexto

Supabase es la alternativa open-source a Firebase, construida sobre PostgreSQL. Combina lo mejor de SQL (transacciones, JOINs, indices) con la flexibilidad de NoSQL (columnas JSONB para datos variables). ITSEIA Academy ya usa Supabase — este ejercicio te enseña a trabajar con JSONB para guardar datos heterogeneos sin sacrificar las ventajas de una base de datos relacional.

## Instrucciones

1. Crea cuenta gratuita en https://supabase.com/.

2. Instala el SDK: `pip install supabase`.

3. Obtiene tu URL y API KEY del dashboard de Supabase.

4. Crea el archivo `sesion07_supabase_nosql_ecuador.py`:

```python
# Supabase como NoSQL - ITSEIA Bases de Datos NoSQL
# JSONB en PostgreSQL: flexibilidad NoSQL con poder SQL
# Dataset: perfiles estudiantes y curriculum vitae

import json
from datetime import datetime

print("=" * 65)
print("SUPABASE + JSONB — PLATAFORMA ITSEIA")
print("=" * 65)

# ================================================
# CONEXION REAL (reemplaza con tus credenciales)
# ================================================
# from supabase import create_client, Client
#
# SUPABASE_URL = "https://tu-proyecto.supabase.co"
# SUPABASE_KEY = "tu-anon-key"
# supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ================================================
# SQL PARA CREAR TABLA CON COLUMNA JSONB
# ================================================
print("\n--- SQL PARA CREAR TABLA CON JSONB ---")
sql_crear_tabla = """
-- Ejecuta esto en el SQL Editor de Supabase:

-- Tabla principal con columna JSONB para datos variables
CREATE TABLE perfiles_estudiantes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    estudiante_id VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    carrera VARCHAR(100),
    periodo_actual INT DEFAULT 1,

    -- Columna JSONB: almacena datos variables (NoSQL dentro de PostgreSQL)
    datos_adicionales JSONB DEFAULT '{}',
    habilidades JSONB DEFAULT '[]',
    experiencia JSONB DEFAULT '[]',
    configuracion JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice JSONB para busquedas rapidas
CREATE INDEX idx_habilidades ON perfiles_estudiantes USING gin(habilidades);
CREATE INDEX idx_datos_adicionales ON perfiles_estudiantes USING gin(datos_adicionales);

-- Habilitar Row Level Security
ALTER TABLE perfiles_estudiantes ENABLE ROW LEVEL SECURITY;

-- Politica: cada estudiante ve solo su propio perfil
CREATE POLICY "estudiante_ve_su_perfil" ON perfiles_estudiantes
    FOR ALL USING (auth.uid()::text = estudiante_id);
"""
print(sql_crear_tabla)

# ================================================
# DOCUMENTOS JSONB: estructura flexible
# ================================================
print("\n--- DOCUMENTOS JSONB PARA INSERTAR ---")

perfiles = [
    {
        "estudiante_id": "EST-2026-001",
        "nombres": "Maria Fernanda",
        "apellidos": "Quispe Lema",
        "email": "mquispe@itseia.ai",
        "carrera": "Inteligencia Artificial",
        "periodo_actual": 1,
        # JSONB: datos variables (NoSQL)
        "datos_adicionales": json.dumps({
            "ciudad": "Quito",
            "sector": "La Magdalena",
            "fraternidad": "Luma",
            "beca": True,
            "modalidad_preferida": "online",
            "dispositivos": ["laptop", "tablet"]
        }),
        "habilidades": json.dumps([
            {"nombre": "Python", "nivel": "intermedio", "certificado": False},
            {"nombre": "SQL",    "nivel": "basico",     "certificado": False},
            {"nombre": "Excel",  "nivel": "avanzado",   "certificado": True}
        ]),
        "experiencia": json.dumps([]),
        "configuracion": json.dumps({
            "tema": "oscuro",
            "idioma": "es",
            "notificaciones_email": True,
            "notificaciones_whatsapp": True
        })
    },
    {
        "estudiante_id": "EST-2026-002",
        "nombres": "Diego Esteban",
        "apellidos": "Mora Beltran",
        "email": "dmora@itseia.ai",
        "carrera": "Big Data",
        "periodo_actual": 1,
        "datos_adicionales": json.dumps({
            "ciudad": "Guayaquil",
            "fraternidad": "Neo",
            "empresa_actual": "Banco Pichincha",
            "cargo": "analista junior",
            "estudia_mientras_trabaja": True
        }),
        "habilidades": json.dumps([
            {"nombre": "SQL",     "nivel": "avanzado",    "certificado": True},
            {"nombre": "Excel",   "nivel": "avanzado",    "certificado": True},
            {"nombre": "Tableau", "nivel": "intermedio",  "certificado": False},
            {"nombre": "Python",  "nivel": "principiante","certificado": False}
        ]),
        "experiencia": json.dumps([
            {
                "empresa": "Banco Pichincha",
                "cargo": "Analista de Datos Junior",
                "desde": "2024-01",
                "hasta": None,
                "descripcion": "Reportes BI en Power BI"
            }
        ]),
        "configuracion": json.dumps({
            "tema": "claro",
            "idioma": "es",
            "notificaciones_email": False,
            "notificaciones_whatsapp": True
        })
    }
]

for p in perfiles:
    habs = json.loads(p["habilidades"])
    exp = json.loads(p["experiencia"])
    print(f"\n  {p['nombres']} {p['apellidos']} ({p['carrera']})")
    print(f"  Habilidades: {[h['nombre'] for h in habs]}")
    print(f"  Experiencia: {len(exp)} registros")

# ================================================
# QUERIES JSONB AVANZADOS
# ================================================
print("\n--- QUERIES SQL CON JSONB (ejecutar en Supabase SQL Editor) ---")

queries_jsonb = {
    "Buscar por ciudad en JSONB": """
SELECT nombres, apellidos, datos_adicionales->>'ciudad' as ciudad
FROM perfiles_estudiantes
WHERE datos_adicionales->>'ciudad' = 'Quito';
    """,

    "Filtrar habilidades Python": """
SELECT nombres, apellidos
FROM perfiles_estudiantes
WHERE habilidades @> '[{"nombre": "Python"}]';
    """,

    "Buscar nivel avanzado en cualquier habilidad": """
SELECT nombres, apellidos, habilidades
FROM perfiles_estudiantes
WHERE habilidades @> '[{"nivel": "avanzado"}]';
    """,

    "Estudiantes que trabajan mientras estudian": """
SELECT nombres, apellidos,
       datos_adicionales->>'empresa_actual' as empresa
FROM perfiles_estudiantes
WHERE (datos_adicionales->>'estudia_mientras_trabaja')::boolean = true;
    """,

    "Actualizar campo dentro de JSONB": """
UPDATE perfiles_estudiantes
SET datos_adicionales = datos_adicionales || '{"nivel_ingles": "B2"}'::jsonb
WHERE estudiante_id = 'EST-2026-001';
    """,

    "Agregar habilidad al array JSONB": """
UPDATE perfiles_estudiantes
SET habilidades = habilidades || '[{"nombre": "TensorFlow", "nivel": "principiante", "certificado": false}]'::jsonb
WHERE estudiante_id = 'EST-2026-001';
    """
}

for nombre, query in queries_jsonb.items():
    print(f"\n  // {nombre}")
    print(query.strip())

# ================================================
# CODIGO PYTHON SUPABASE SDK
# ================================================
print("\n--- CODIGO SDK PYTHON SUPABASE ---")
codigo_sdk = """
# CRUD con supabase-py:

# INSERT
response = supabase.table("perfiles_estudiantes").insert(perfil_doc).execute()

# SELECT con filtro simple
response = supabase.table("perfiles_estudiantes") \\
    .select("nombres, apellidos, carrera, datos_adicionales") \\
    .eq("carrera", "Inteligencia Artificial") \\
    .execute()

# UPDATE
response = supabase.table("perfiles_estudiantes") \\
    .update({"periodo_actual": 2}) \\
    .eq("estudiante_id", "EST-2026-001") \\
    .execute()

# DELETE
response = supabase.table("perfiles_estudiantes") \\
    .delete() \\
    .eq("estudiante_id", "EST-BORRAR") \\
    .execute()

# TIEMPO REAL: escuchar cambios
channel = supabase.channel("perfiles_cambios")
channel.on("postgres_changes",
           event="*",
           schema="public",
           table="perfiles_estudiantes",
           callback=lambda payload: print(payload))
channel.subscribe()
"""
print(codigo_sdk)

# ================================================
# COMPARATIVA: Supabase vs Firebase vs MongoDB
# ================================================
print("\n--- COMPARATIVA FINAL ---")
comparativa = [
    ("Aspecto",        "Supabase",         "Firebase",         "MongoDB Atlas"),
    ("Motor BD",       "PostgreSQL",       "Firestore propio", "MongoDB"),
    ("Tipo",           "SQL + JSONB",      "NoSQL puro",       "NoSQL puro"),
    ("Open source",    "Si",               "No",               "No (Atlas)"),
    ("Free tier",      "500MB, 2 proyect", "1GB, 50K reads",   "512MB M0"),
    ("Realtime",       "WebSockets",       "Snapshots",        "Change Streams"),
    ("Auth incluida",  "Si",               "Si",               "No (aparte)"),
    ("Ideal para",     "Full-stack web",   "Apps moviles",     "Datos complejos"),
    ("Ecuador startups", "Muy comun",      "Muy comun",        "Creciendo"),
]
col = [25, 18, 18, 18]
for row in comparativa:
    linea = "  "
    for i, val in enumerate(row):
        linea += val[:col[i]].ljust(col[i])
    print(linea)

print("=" * 65)
```

5. Crea la tabla en Supabase SQL Editor con el schema del ejercicio.

6. Inserta los dos perfiles usando el SDK Python real.

7. Ejecuta al menos 3 de los queries JSONB en el SQL Editor de Supabase.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo una tabla en Supabase con una columna JSONB llamada 'habilidades' que almacena arrays de objetos [{nombre, nivel, certificado}]. ¿Como busco todos los estudiantes que tienen Python con nivel 'avanzado'? ¿Y como agrego una nueva habilidad al array sin sobreescribir las existentes? Dame el SQL y el codigo Python con supabase-py."

Despues de leer la respuesta:
- Implementa ambos queries en el SQL Editor de Supabase.
- Verifica que los resultados son correctos con los datos insertados.

## Que aprendiste

- Supabase combina PostgreSQL con una API REST autogenerada y realtime vía WebSockets.
- Las columnas JSONB de PostgreSQL permiten almacenar datos heterogeneos con indices GIN.
- El operador `->>'campo'` extrae un string de JSONB; `->` extrae el objeto.
- `@>` verifica si un JSONB contiene otro JSONB — clave para buscar en arrays.
- Row Level Security (RLS) implementa control de acceso a nivel de fila.
- `supabase.table().select().eq().execute()` es el patron basico del SDK Python.

## Reto extra

Diseña un sistema de "curriculum vitae dinamico" para graduados ITSEIA usando JSONB. Cada graduado tiene: datos personales, habilidades con niveles, proyectos realizados (con tecnologias usadas), certificaciones, y disponibilidad laboral. Crea la tabla, inserta 5 graduados y escribe un query que encuentre graduados disponibles con Python + TensorFlow + nivel universitario.
