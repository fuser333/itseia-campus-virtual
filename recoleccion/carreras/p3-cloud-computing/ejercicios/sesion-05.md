# Ejercicio Sesion 5: Bases de Datos en la Nube — Supabase y Firebase

**Materia:** Cloud Computing para IA
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Crear y consultar bases de datos en la nube con Supabase (PostgreSQL) y Firebase (NoSQL) desde Python para persistir predicciones de modelos ML, registros de estudiantes ITSEIA y datos de analisis, sin necesidad de gestionar servidores.

## Contexto

Supabase es la alternativa open-source a Firebase que usa PostgreSQL: ofrece un generoso free tier permanente (500MB, 50,000 filas) y es la base de datos que usa la plataforma del campus virtual de ITSEIA. Firebase de Google es ideal para datos en tiempo real: una app de monitoreo de cultivos en Ecuador podria actualizar el dashboard cada 5 segundos con Firebase. En Ecuador, startups como DeUna, Kushki y PagaPhone usan Supabase y Firebase para sus backends. Dominar estas herramientas permite a un Data Scientist desplegar soluciones end-to-end sin un equipo de backend.

## Instrucciones

1. Abre Google Colab y crea `sesion05_bases_datos_nube.ipynb`.

2. Configura Supabase (crea cuenta ANTES):

```python
# Cloud Computing para IA - Sesion 5: Bases de Datos Cloud
# ITSEIA - Periodo 3

# PASO 1: Crear cuenta Supabase
# 1. Ve a supabase.com -> "Start your project" (gratis)
# 2. Sign up con GitHub o email
# 3. New Project -> Organization: itseia-estudiantes
# 4. Name: itseia-ml-proyecto | Password: elige una fuerte | Region: South America (Sao Paulo)
# 5. Espera 2 minutos a que provisione

!pip install -q supabase psycopg2-binary

from supabase import create_client, Client
import pandas as pd
import numpy as np
from datetime import datetime

print("Supabase SDK instalado")
print("\nCOMO OBTENER TUS CREDENCIALES SUPABASE:")
print("1. supabase.com -> tu proyecto")
print("2. Settings -> API")
print("3. Copia: Project URL y anon public key")
print("4. En Colab: Tools -> Secrets -> agrega SUPABASE_URL y SUPABASE_KEY")
```

3. Crea tablas y registra predicciones:

```python
# CONFIGURAR CLIENTE (reemplaza con tus credenciales reales)
# from google.colab import userdata
# SUPABASE_URL = userdata.get('SUPABASE_URL')
# SUPABASE_KEY = userdata.get('SUPABASE_KEY')
# supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# SCHEMA DE LA BASE DE DATOS (ejecutar en Supabase SQL Editor)
schema_sql = """
-- Tabla de predicciones de ML
CREATE TABLE IF NOT EXISTS predicciones_ml (
    id SERIAL PRIMARY KEY,
    modelo VARCHAR(50) NOT NULL,
    fecha_prediccion TIMESTAMP DEFAULT NOW(),
    features JSONB NOT NULL,
    prediccion FLOAT NOT NULL,
    probabilidad FLOAT,
    correcto BOOLEAN DEFAULT NULL,
    contexto VARCHAR(100)
);

-- Tabla de estudiantes ITSEIA (ejemplo)
CREATE TABLE IF NOT EXISTS estudiantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    carrera VARCHAR(50),
    periodo_actual INT DEFAULT 1,
    promedio FLOAT DEFAULT 0,
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de logs de modelo en produccion
CREATE TABLE IF NOT EXISTS modelo_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT NOW(),
    endpoint VARCHAR(100),
    latencia_ms FLOAT,
    input_size INT,
    success BOOLEAN,
    error_msg TEXT DEFAULT NULL
);

-- Indices para consultas rapidas
CREATE INDEX IF NOT EXISTS idx_pred_fecha ON predicciones_ml(fecha_prediccion);
CREATE INDEX IF NOT EXISTS idx_pred_modelo ON predicciones_ml(modelo);
CREATE INDEX IF NOT EXISTS idx_est_carrera ON estudiantes(carrera);
"""
print("SCHEMA SQL PARA EJECUTAR EN SUPABASE SQL EDITOR:")
print(schema_sql)
```

4. Operaciones CRUD desde Python:

```python
# CODIGO CRUD COMPLETO PARA SUPABASE
# (Con cliente configurado, estas operaciones funcionan directamente)

codigo_supabase = """
from supabase import create_client
import pandas as pd
from datetime import datetime
import json

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ========================
# CREATE (INSERT)
# ========================

# Insertar una prediccion
nueva_prediccion = {
    'modelo': 'random_forest_desercion_v2',
    'features': json.dumps({'promedio_sem1': 7.2, 'asistencia_pct': 78.5, 'trabaja': 1}),
    'prediccion': 0.35,
    'probabilidad': 0.35,
    'contexto': 'ITSEIA-P3-batch-20240315'
}
resultado = supabase.table('predicciones_ml').insert(nueva_prediccion).execute()
print(f"Prediccion guardada: ID={resultado.data[0]['id']}")

# Insertar multiples registros (bulk insert)
estudiantes_nuevos = [
    {'nombre': 'Ana Quezada', 'email': 'ana@itseia.ai', 'carrera': 'IA', 'periodo_actual': 3},
    {'nombre': 'Luis Mora', 'email': 'luis@itseia.ai', 'carrera': 'Datos', 'periodo_actual': 3},
    {'nombre': 'Sofia Vega', 'email': 'sofia@itseia.ai', 'carrera': 'BigData', 'periodo_actual': 3}
]
resp = supabase.table('estudiantes').insert(estudiantes_nuevos).execute()
print(f"Estudiantes insertados: {len(resp.data)}")

# ========================
# READ (SELECT)
# ========================

# Todos los registros
todos = supabase.table('predicciones_ml').select('*').execute()
df = pd.DataFrame(todos.data)
print(f"Total predicciones: {len(df)}")

# Filtros (equivalente a WHERE en SQL)
alto_riesgo = (supabase.table('predicciones_ml')
               .select('*')
               .gte('prediccion', 0.6)            # prediccion >= 0.6
               .eq('modelo', 'random_forest_desercion_v2')  # modelo = '...'
               .order('fecha_prediccion', desc=True)
               .limit(10)
               .execute())
print(f"Predicciones alto riesgo: {len(alto_riesgo.data)}")

# Estudiantes de carrera IA activos
estudiantes_ia = (supabase.table('estudiantes')
                  .select('nombre, email, promedio')
                  .eq('carrera', 'IA')
                  .eq('activo', True)
                  .execute())
df_ia = pd.DataFrame(estudiantes_ia.data)
print(df_ia)

# ========================
# UPDATE
# ========================
# Actualizar promedio de un estudiante
supabase.table('estudiantes').update({'promedio': 8.5}).eq('email', 'ana@itseia.ai').execute()

# Marcar prediccion como correcta (feedback loop)
supabase.table('predicciones_ml').update({'correcto': True}).eq('id', 1).execute()

# ========================
# DELETE
# ========================
# Eliminar logs de mas de 90 dias (limpieza)
from datetime import datetime, timedelta
fecha_limite = (datetime.now() - timedelta(days=90)).isoformat()
supabase.table('modelo_logs').delete().lt('timestamp', fecha_limite).execute()

# ========================
# SQL PERSONALIZADO (cuando necesitas JOINs o consultas complejas)
# ========================
sql_query = '''
    SELECT
        modelo,
        COUNT(*) as total_predicciones,
        AVG(prediccion) as prob_media,
        AVG(CASE WHEN correcto THEN 1.0 ELSE 0.0 END) as accuracy_real
    FROM predicciones_ml
    WHERE fecha_prediccion > NOW() - INTERVAL '30 days'
    GROUP BY modelo
    ORDER BY total_predicciones DESC
'''
resultado_sql = supabase.rpc('execute_query', {'query': sql_query}).execute()
"""
print(codigo_supabase)

# SIMULACION LOCAL (sin Supabase) para practicar la logica
print("\n\nSIMULACION LOCAL (sin credenciales):")
import json

# Simular tabla de predicciones
np.random.seed(42)
n = 50
predicciones_db = pd.DataFrame({
    'id': range(1, n+1),
    'modelo': np.random.choice(['random_forest_v1', 'logistic_reg_v1'], n),
    'prediccion': np.random.uniform(0, 1, n).round(3),
    'correcto': np.random.choice([True, False, None], n, p=[0.4, 0.3, 0.3]),
    'fecha': pd.date_range('2024-01-01', periods=n, freq='12H')
})

# Consultas simuladas
print("Modelos en uso:")
print(predicciones_db.groupby('modelo').agg(
    total=('id', 'count'),
    prob_media=('prediccion', 'mean'),
    accuracy=('correcto', lambda x: x.dropna().mean())
).round(3))

print(f"\nPredicciones con etiqueta de verdad: {predicciones_db['correcto'].notna().sum()}")
print(f"Accuracy sobre las etiquetadas: {predicciones_db['correcto'].dropna().mean():.3f}")
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Tengo un modelo de ML que hace predicciones de desercion estudiantil. Quiero guardar cada prediccion en Supabase para: hacer feedback loop (cuando sabemos si la prediccion fue correcta), monitorear el modelo en produccion (detectar data drift), y generar reportes mensuales para el decano. ¿Como diseño el schema de la base de datos? ¿Que indices necesito?"

Despues de leer la respuesta:
- Agrega los campos que Claude sugiera al schema del ejercicio.
- Escribe la consulta SQL que calcule la precision del modelo por mes.

## Que aprendiste

- Supabase ofrece un **PostgreSQL gratuito** (500MB, 50k filas) con SDK Python, autenticacion, storage y Edge Functions.
- El SDK de Supabase usa una sintaxis encadenada (`table().select().eq().execute()`) que genera SQL internamente.
- El formato **JSONB** en PostgreSQL permite guardar features de modelos como columna flexible sin definir cada campo.
- Un **feedback loop** en Supabase es critico para produccion: registras cada prediccion, luego actualizas cuando sabes el resultado real, y calculas el accuracy real vs el accuracy de validacion.
- Firebase es superior para datos en tiempo real (latencia < 100ms) pero Supabase es mas potente para consultas SQL complejas y proyectos de IA.

## Reto extra

Crea en Supabase una tabla `metricas_modelo` y escribe una funcion Python que calcule y guarde automaticamente cada semana: accuracy, precision, recall y F1 del modelo de desercion (usando las predicciones con etiqueta real de `predicciones_ml`). El objetivo es detectar si el modelo se degrada con el tiempo (data drift). Programa la funcion para que corra cada lunes a las 8 AM.
