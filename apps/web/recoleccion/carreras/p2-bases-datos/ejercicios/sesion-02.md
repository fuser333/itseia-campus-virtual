# Ejercicio Sesion 2: SQL Basico — CREATE, INSERT, SELECT

**Materia:** Bases de Datos Relacionales
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Crear tablas SQL, insertar datos reales del mercado laboral ecuatoriano y realizar consultas basicas con `SELECT`, comprendiendo tipos de datos, restricciones y la estructura fundamental de una base de datos relacional.

## Contexto

El INEC (Instituto Nacional de Estadistica y Censos) publica datos de empleo en Ecuador cada trimestre. En diciembre 2025, la tasa de empleo adecuado fue del 38.4%, el desempleo del 4.2% y el empleo informal del 57.3%. Crearemos una base de datos que modela este registro de empleo, usando datos reales del mercado ecuatoriano.

## Instrucciones

1. Abre DB Browser for SQLite (gratuito, descarga en sqlitebrowser.org) o usa el sitio web sqliteonline.com. Crea una nueva base de datos llamada `ecuador_empleo.db`.

2. Crea las tablas ejecutando este SQL:

```sql
-- Sesion 2: SQL Basico - ITSEIA Periodo 2
-- Base de datos: Registro de empleo Ecuador

-- Tabla de sectores economicos
CREATE TABLE sectores (
    id_sector     INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre        TEXT    NOT NULL UNIQUE,
    tipo          TEXT    NOT NULL CHECK(tipo IN ('primario','secundario','terciario')),
    activo        INTEGER NOT NULL DEFAULT 1
);

-- Tabla de ciudades
CREATE TABLE ciudades (
    codigo_ciudad TEXT    PRIMARY KEY,
    nombre        TEXT    NOT NULL,
    provincia     TEXT    NOT NULL,
    poblacion_2025 INTEGER NOT NULL
);

-- Tabla de trabajadores (simplificada)
CREATE TABLE trabajadores (
    cedula        TEXT    PRIMARY KEY CHECK(length(cedula) = 10),
    nombres       TEXT    NOT NULL,
    apellidos     TEXT    NOT NULL,
    edad          INTEGER NOT NULL CHECK(edad >= 15 AND edad <= 99),
    sexo          TEXT    NOT NULL CHECK(sexo IN ('M','F')),
    codigo_ciudad TEXT    NOT NULL REFERENCES ciudades(codigo_ciudad),
    id_sector     INTEGER REFERENCES sectores(id_sector),
    tipo_empleo   TEXT    NOT NULL CHECK(tipo_empleo IN ('adecuado','subempleo','desempleo','informal')),
    salario_mensual REAL  CHECK(salario_mensual >= 0 OR salario_mensual IS NULL),
    fecha_registro TEXT   NOT NULL DEFAULT (date('now'))
);
```

3. Inserta los datos de referencia:

```sql
-- Insertar sectores economicos
INSERT INTO sectores (nombre, tipo) VALUES
    ('Agricultura y ganaderia', 'primario'),
    ('Manufactura', 'secundario'),
    ('Construccion', 'secundario'),
    ('Comercio al por mayor y menor', 'terciario'),
    ('Tecnologia e Informacion', 'terciario'),
    ('Educacion', 'terciario'),
    ('Salud', 'terciario'),
    ('Administracion publica', 'terciario');

-- Insertar ciudades principales de Ecuador
INSERT INTO ciudades VALUES
    ('UIO', 'Quito',      'Pichincha',    2781641),
    ('GYE', 'Guayaquil',  'Guayas',       2644891),
    ('CUE', 'Cuenca',     'Azuay',         636996),
    ('AMB', 'Ambato',     'Tungurahua',    387309),
    ('MAN', 'Manta',      'Manabi',        254118),
    ('STO', 'Santo Domingo','Santo Domingo', 305893),
    ('IBM', 'Ibarra',     'Imbabura',      221149);

-- Insertar trabajadores con datos representativos
INSERT INTO trabajadores (cedula, nombres, apellidos, edad, sexo, codigo_ciudad, id_sector, tipo_empleo, salario_mensual) VALUES
    ('1712345678', 'Carlos Eduardo',  'Benavides Morales', 32, 'M', 'UIO', 5, 'adecuado',   1800.00),
    ('0912345679', 'Maria Fernanda',  'Torres Aguirre',    27, 'F', 'GYE', 4, 'adecuado',    950.00),
    ('0102345670', 'Pedro Antonio',   'Sanchez Vera',      45, 'M', 'CUE', 1, 'informal',    380.00),
    ('1802345671', 'Ana Lucia',       'Guerrero Ponce',    38, 'F', 'AMB', 6, 'adecuado',    750.00),
    ('1302345672', 'Jorge Luis',      'Cifuentes Ruiz',    55, 'M', 'MAN', 3, 'subempleo',   250.00),
    ('1712345673', 'Daniela Estefania','Chaves Lopez',     24, 'F', 'UIO', 5, 'adecuado',   2200.00),
    ('0912345674', 'Roberto Carlos',  'Paucar Lema',       41, 'M', 'GYE', 4, 'informal',    420.00),
    ('1712345675', 'Valentina',       'Ruiz Espinosa',     29, 'F', 'UIO', 7, 'adecuado',   1100.00),
    ('0612345676', 'Miguel Angel',    'Narvaez Castro',    19, 'M', 'STO', 2, 'desempleo',     NULL),
    ('1012345677', 'Lucia Isabel',    'Proano Vega',       33, 'F', 'IBM', 8, 'adecuado',    850.00);
```

4. Ejecuta estas consultas `SELECT` y escribe el resultado en tu cuaderno:

```sql
-- Consulta 1: Ver todos los trabajadores
SELECT * FROM trabajadores;

-- Consulta 2: Solo nombre, ciudad y salario
SELECT nombres, apellidos, codigo_ciudad, salario_mensual
FROM trabajadores;

-- Consulta 3: Solo trabajadores del sector Tecnologia
SELECT t.nombres, t.apellidos, t.salario_mensual
FROM trabajadores t
JOIN sectores s ON t.id_sector = s.id_sector
WHERE s.nombre = 'Tecnologia e Informacion';

-- Consulta 4: Cuantos trabajadores hay por tipo de empleo
SELECT tipo_empleo, COUNT(*) AS total
FROM trabajadores
GROUP BY tipo_empleo;

-- Consulta 5: Salario promedio de trabajadores con empleo adecuado
SELECT AVG(salario_mensual) AS salario_promedio
FROM trabajadores
WHERE tipo_empleo = 'adecuado';
```

5. Escribe una consulta propia que muestre el nombre completo (nombres + ' ' + apellidos) y ciudad de todos los trabajadores femeninos.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Estoy aprendiendo SQL. Tengo una tabla de trabajadores con columnas: cedula, nombres, apellidos, edad, sexo, tipo_empleo, salario_mensual. ¿Que significa cada constraint en SQL: PRIMARY KEY, NOT NULL, UNIQUE, CHECK, REFERENCES? Dame un ejemplo de cada uno."

Despues de leer la respuesta:
- Identifica en el codigo de arriba donde aparece cada constraint.
- Pregunta: "¿Que diferencia hay entre AUTOINCREMENT en SQLite y SERIAL en PostgreSQL?"

## Que aprendiste

- `CREATE TABLE` define la estructura: columnas, tipos de dato y restricciones (constraints).
- `PRIMARY KEY` identifica unicamente cada fila; `REFERENCES` crea una clave foranea que vincula tablas.
- `CHECK` permite validar valores al momento de insertar; si la condicion falla, el INSERT es rechazado.
- `INSERT INTO` agrega filas; se puede insertar multiples filas en un solo INSERT con la sintaxis de valores separados por comas.
- `SELECT` recupera datos; con `*` trae todas las columnas, con nombres especificos solo las columnas indicadas.

## Reto extra

Agrega 3 trabajadores mas usando datos reales o inventados con ciudades y sectores ya existentes. Luego escribe una consulta que muestre el total de trabajadores por ciudad, ordenado de mayor a menor cantidad.
