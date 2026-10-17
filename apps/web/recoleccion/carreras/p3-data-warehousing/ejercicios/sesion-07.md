# Ejercicio Sesion 7: Dimensional Modeling

**Materia:** Data Warehousing y ETL
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Aplicar las tecnicas avanzadas de modelado dimensional: SCD tipos 1, 2 y 3, degenerate dimensions, junk dimensions y role-playing dimensions, disenando un DW completo para el sector hospitalario ecuatoriano.

## Contexto

El Ministerio de Salud Publica Ecuador (MSP) tiene hospitales en las 24 provincias. Un DW del MSP necesita responder: "¿Como evolucionaron las consultas medicas por especialidad entre 2020 y 2024? ¿Que medico atendia a que tipo de paciente en cada periodo?" Esas preguntas requieren modelado dimensional avanzado con SCD para capturar como cambian los datos en el tiempo.

## Instrucciones

1. Crea el archivo `sesion07_dimensional_modeling_ecuador.py`:

```python
# Dimensional Modeling Avanzado - ITSEIA
# Data Warehouse: Sistema de Salud MSP Ecuador
# SCD tipos 1/2/3, degenerate dims, role-playing dims

import sqlite3
import pandas as pd
from datetime import datetime, date, timedelta

print("=" * 65)
print("DIMENSIONAL MODELING — DW MSP ECUADOR")
print("SCD, Degenerate Dims, Role-Playing Dims")
print("=" * 65)

conn = sqlite3.connect(":memory:")
cursor = conn.cursor()

# ================================================
# SCD TIPO 1: Sobreescribir (sin historial)
# Caso: nombre de hospital (puede cambiar por decreto)
# ================================================
print("\n--- SCD TIPO 1: Sobreescribir ---")
print("  Caso: datos del hospital que cambian sin importar el historial")

cursor.execute("""
    CREATE TABLE dim_hospital_scd1 (
        hospital_id   INTEGER PRIMARY KEY,
        codigo_msp    TEXT UNIQUE,
        nombre        TEXT,       -- se sobreescribe si cambia
        provincia     TEXT,
        tipo          TEXT,
        nivel_atencion TEXT,
        camas_totales INTEGER,    -- se sobreescribe con el valor actual
        updated_at    TEXT
    )
""")

hospitales = [
    (1,"H001","Hospital Eugenio Espejo",   "Pichincha","Publico","III",350,"2024-01-01"),
    (2,"H002","Hospital Luis Vernaza",     "Guayas",  "Publico","III",320,"2024-01-01"),
    (3,"H003","Hospital Vicente Corral",   "Azuay",   "Publico","III",240,"2024-01-01"),
    (4,"H004","Clinica Santa Cecilia",     "Pichincha","Privado","II",80, "2024-01-01"),
    (5,"H005","Hospital Regional Ambato",  "Tungurahua","Publico","II",150,"2024-01-01"),
]
cursor.executemany("INSERT INTO dim_hospital_scd1 VALUES (?,?,?,?,?,?,?,?)", hospitales)

# SCD1: actualizar camas del Eugenio Espejo (ampliacion)
print("  Hospital Eugenio Espejo amplía: 350 → 380 camas")
cursor.execute("""
    UPDATE dim_hospital_scd1
    SET camas_totales = 380, updated_at = '2024-06-01'
    WHERE codigo_msp = 'H001'
""")
print("  SCD Tipo 1: solo el valor actual, sin historial del cambio")

# ================================================
# SCD TIPO 2: Historial completo con versiones
# Caso: especializacion de un medico (puede cambiar)
# ================================================
print("\n--- SCD TIPO 2: Historial de Cambios ---")
print("  Caso: historial de especialidades del medico")

cursor.execute("""
    CREATE TABLE dim_medico_scd2 (
        medico_sk       INTEGER PRIMARY KEY,  -- surrogate key
        medico_id       TEXT,                  -- natural key (cedula)
        nombre          TEXT,
        especialidad    TEXT,                  -- CAMBIA en el tiempo
        nivel_atencion  TEXT,
        hospital_actual TEXT,
        -- Control SCD Tipo 2
        fecha_inicio    TEXT NOT NULL,
        fecha_fin       TEXT,                  -- NULL = registro activo
        es_actual       INTEGER DEFAULT 1,
        version         INTEGER DEFAULT 1
    )
""")

# Version 1: Dr. Andrade como medico general (2020)
cursor.execute("""INSERT INTO dim_medico_scd2 VALUES
    (1,'MED001','Dr. Carlos Andrade','Medicina General','Primaria','H005',
     '2020-01-15',NULL,1,1)""")

# Cambio: Dr. Andrade se especializa en cardiologia (2023)
# SCD Tipo 2: NO sobreescribimos, CERRAMOS la version anterior y creamos nueva
print("  Dr. Andrade cambia: Medicina General → Cardiologia en 2023")
cursor.execute("""
    UPDATE dim_medico_scd2
    SET fecha_fin = '2022-12-31', es_actual = 0
    WHERE medico_id = 'MED001' AND es_actual = 1
""")
cursor.execute("""INSERT INTO dim_medico_scd2 VALUES
    (2,'MED001','Dr. Carlos Andrade','Cardiologia','Terciaria','H001',
     '2023-01-01',NULL,1,2)""")

# Mas medicos (solo version actual)
cursor.executemany("INSERT INTO dim_medico_scd2 VALUES (?,?,?,?,?,?,?,?,?,?)", [
    (3,"MED002","Dra. Sofia Rios",    "Pediatria",  "Secundaria","H002","2019-03-01",None,1,1),
    (4,"MED003","Dr. Luis Mora",      "Cirugia",    "Terciaria", "H003","2021-06-15",None,1,1),
    (5,"MED004","Dra. Ana Guerrero",  "Ginecologia","Secundaria","H004","2022-09-01",None,1,1),
])

# Consultar historial Dr. Andrade
print("\n  Historial Dr. Andrade (SCD Tipo 2):")
cursor.execute("""
    SELECT version, especialidad, fecha_inicio, fecha_fin,
           CASE WHEN es_actual=1 THEN 'ACTIVO' ELSE 'HISTORICO' END as estado
    FROM dim_medico_scd2
    WHERE medico_id = 'MED001'
    ORDER BY version
""")
for row in cursor.fetchall():
    print(f"    v{row[0]}: {row[1]:<20} | {row[2]} → {row[3] or 'presente'} | {row[4]}")

# ================================================
# SCD TIPO 3: Columna de valor anterior
# Caso: categoria del paciente (cambio puntual que si queremos recordar)
# ================================================
print("\n--- SCD TIPO 3: Columna de Valor Anterior ---")
cursor.execute("""
    CREATE TABLE dim_paciente_scd3 (
        paciente_id       INTEGER PRIMARY KEY,
        cedula            TEXT,
        nombre            TEXT,
        categoria_actual  TEXT,    -- valor actual
        categoria_previa  TEXT,    -- SCD3: guarda el valor ANTERIOR
        fecha_cambio_cat  TEXT,
        edad_grupo        TEXT,
        provincia         TEXT
    )
""")

cursor.executemany("INSERT INTO dim_paciente_scd3 VALUES (?,?,?,?,?,?,?,?)", [
    (1,"1720001","Maria Quispe","frecuente",  None,       None,      "25-34","Pichincha"),
    (2,"0912345","Diego Mora",  "ocasional",  None,       None,      "35-44","Guayas"),
    (3,"1802345","Ana Torres",  "cronico",    "ocasional","2023-06-15","18-24","Azuay"),
])

# SCD3: Diego Mora cambia de 'ocasional' a 'frecuente'
print("  Diego Mora: ocasional → frecuente")
cursor.execute("""
    UPDATE dim_paciente_scd3
    SET categoria_previa = categoria_actual,
        categoria_actual = 'frecuente',
        fecha_cambio_cat = '2024-03-01'
    WHERE cedula = '0912345'
""")
print("  SCD Tipo 3: guarda SOLO el valor anterior (no toda la historia)")

# ================================================
# DEGENERATE DIMENSION: sin tabla propia
# ================================================
print("\n--- DEGENERATE DIMENSION ---")
print("  Identificadores de documentos que van directo a la tabla de hechos")
print("  Ej: numero_consulta, numero_receta, numero_ingreso")
print("  No necesitan dimension propia: son su propio contexto")

# ================================================
# ROLE-PLAYING DIMENSION
# ================================================
print("\n--- ROLE-PLAYING DIMENSION ---")
print("  Una dimension usada con distintos roles en la misma tabla de hechos")

# Una sola tabla dim_fecha, pero usada 3 veces con distintos alias
cursor.execute("""
    CREATE TABLE dim_fecha (
        fecha_id    INTEGER PRIMARY KEY,
        fecha       TEXT,
        anio        INTEGER,
        mes         INTEGER,
        dia         INTEGER,
        dia_semana  TEXT
    )
""")

for i in range(90):
    d = date(2024, 1, 1) + timedelta(days=i)
    cursor.execute("INSERT INTO dim_fecha VALUES (?,?,?,?,?,?)",
                   (i+1, d.strftime("%Y-%m-%d"), d.year, d.month, d.day,
                    ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"][d.weekday()]))

# fact_consulta usa dim_fecha 3 veces (3 roles)
cursor.execute("""
    CREATE TABLE fact_consulta_medica (
        consulta_id         INTEGER PRIMARY KEY,
        numero_consulta     TEXT,          -- DEGENERATE DIMENSION
        medico_sk           INTEGER REFERENCES dim_medico_scd2(medico_sk),
        hospital_id         INTEGER REFERENCES dim_hospital_scd1(hospital_id),
        paciente_id         INTEGER REFERENCES dim_paciente_scd3(paciente_id),
        -- ROLE-PLAYING: misma dim_fecha con 3 roles distintos
        fecha_admision_id   INTEGER REFERENCES dim_fecha(fecha_id),
        fecha_atencion_id   INTEGER REFERENCES dim_fecha(fecha_id),
        fecha_alta_id       INTEGER REFERENCES dim_fecha(fecha_id),
        -- metricas
        especialidad        TEXT,
        duracion_min        INTEGER,
        costo_usd           REAL,
        tipo_consulta       TEXT,
        resultado           TEXT
    )
""")

consultas = [
    (1,"CON-2024-001",2,1,1, 15,15,15,"Cardiologia",   45,85.00,"programada","tratamiento"),
    (2,"CON-2024-002",3,2,2, 20,21,22,"Pediatria",     30,45.00,"urgencia",  "alta_inmediata"),
    (3,"CON-2024-003",4,3,3, 25,25,30,"Cirugia",       120,450.00,"programada","cirugia_exitosa"),
    (4,"CON-2024-004",2,1,1, 50,51,53,"Cardiologia",   60,95.00,"control",   "seguimiento"),
    (5,"CON-2024-005",5,4,2, 60,60,61,"Ginecologia",   40,55.00,"control",   "normal"),
]
cursor.executemany("INSERT INTO fact_consulta_medica VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", consultas)
conn.commit()

# Query con role-playing
print("\n  Query con Role-Playing Dimension (misma tabla, 3 alias):")
cursor.execute("""
    SELECT fc.numero_consulta,
           m.nombre        as medico,
           m.especialidad,
           h.nombre        as hospital,
           fa.fecha        as fecha_admision,
           fat.fecha       as fecha_atencion,
           fal.fecha       as fecha_alta,
           fc.duracion_min,
           fc.costo_usd
    FROM fact_consulta_medica fc
    JOIN dim_medico_scd2  m   ON fc.medico_sk       = m.medico_sk
    JOIN dim_hospital_scd1 h  ON fc.hospital_id     = h.hospital_id
    JOIN dim_fecha fa          ON fc.fecha_admision_id = fa.fecha_id
    JOIN dim_fecha fat         ON fc.fecha_atencion_id = fat.fecha_id
    JOIN dim_fecha fal         ON fc.fecha_alta_id     = fal.fecha_id
    ORDER BY fc.consulta_id
""")
print(f"  {'Consulta':<16} {'Medico':<22} {'Admision':<12} {'Alta':<12} {'Costo':>8}")
for row in cursor.fetchall():
    print(f"  {row[0]:<16} {row[1]:<22} {row[2]:<12} {row[3]:<12} ${row[8]:>6.2f}")

conn.close()
print("\n" + "=" * 65)
print("TECNICAS DIMENSIONAL MODELING:")
print("  SCD Tipo 1: Sobreescribir — sin historial (camas, correcciones)")
print("  SCD Tipo 2: Versiones — historial completo (especialidades, cargos)")
print("  SCD Tipo 3: Columna prev — 1 cambio recordado (categoria cliente)")
print("  Degenerate Dim: en tabla hechos — numeros de documentos")
print("  Role-Playing Dim: misma tabla, distintos alias (fechas multiples)")
print("=" * 65)
```

3. Ejecuta y analiza el historial SCD tipo 2 del Dr. Andrade.

4. Implementa SCD tipo 2 para la dimension de precios: cuando un medicamento cambia de precio, debe quedar registro del precio historico para que los reportes pasados sean correctos.

## Usa IA para...

> Abre ChatGPT y escribe:
> "En mi DW de salud Ecuador tengo una dimension de medicos. Un medico puede cambiar de especialidad, hospital y nivel de atencion. ¿Cuando uso SCD tipo 1 vs tipo 2 vs tipo 3 para cada tipo de cambio? Da una recomendacion especifica para cada campo."

Despues de leer la respuesta:
- Aplica las recomendaciones de ChatGPT al schema del ejercicio.
- Documenta con comentarios en el codigo cual SCD se usa para cada campo y por que.

## Que aprendiste

- SCD Tipo 1: sobreescribe el valor actual — para correcciones y datos sin valor historico.
- SCD Tipo 2: crea nueva fila con fechas de vigencia — para cambios que importa rastrear en el tiempo.
- SCD Tipo 3: columna adicional para el valor anterior — para cambios puntuales con memoria de 1 paso.
- Degenerate Dimension: identificadores de documentos que van directamente en la tabla de hechos.
- Role-Playing Dimension: una misma tabla de dimension usada varias veces con distintos aliases.
- La surrogate key (SK) es clave en SCD2: permite que el mismo ID natural tenga multiples versiones.

## Reto extra

Implementa una funcion `consultar_estado_historico(cursor, medico_id, fecha)` que dado un ID de medico y una fecha, devuelva el estado del medico en ESA fecha especifica (usando SCD2). Por ejemplo: `consultar_estado_historico(cursor, "MED001", "2022-06-01")` debe devolver "Medicina General" (no "Cardiologia"). Esta es la capacidad "time travel" del DW.
