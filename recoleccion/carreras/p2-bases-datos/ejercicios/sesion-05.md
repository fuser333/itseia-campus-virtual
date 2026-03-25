# Ejercicio Sesion 5: Subconsultas y Vistas

**Materia:** Bases de Datos Relacionales
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Escribir subconsultas correlacionadas y no correlacionadas, y crear vistas SQL reutilizables, aplicados a un sistema de analisis de creditos del sector bancario ecuatoriano.

## Contexto

La Superintendencia de Bancos del Ecuador (SBS) supervisa mas de 30 entidades financieras. Un banco tipico como Banco del Pacifico o Banco Internacional necesita identificar: clientes con creditos por encima del promedio, sucursales con morosidad alta, y patrones de riesgo. Estas consultas complejas se construyen con subconsultas y se encapsulan en vistas para ser reutilizadas por el equipo de riesgos sin que deban conocer el SQL complejo interno.

## Instrucciones

1. Crea la base de datos `banco_ecuador.db`:

```sql
-- Sesion 5: Subconsultas y Vistas
-- Sistema bancario Ecuador

CREATE TABLE clientes (
    id_cliente    INTEGER PRIMARY KEY AUTOINCREMENT,
    cedula        TEXT    NOT NULL UNIQUE,
    nombre        TEXT    NOT NULL,
    ciudad        TEXT    NOT NULL,
    ingreso_mensual REAL  NOT NULL,
    score_crediticio INTEGER CHECK(score_crediticio BETWEEN 300 AND 850)
);

CREATE TABLE sucursales (
    id_sucursal   INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre        TEXT    NOT NULL,
    ciudad        TEXT    NOT NULL,
    region        TEXT    NOT NULL CHECK(region IN ('sierra','costa','oriente','insular'))
);

CREATE TABLE creditos (
    id_credito    INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente    INTEGER NOT NULL REFERENCES clientes(id_cliente),
    id_sucursal   INTEGER NOT NULL REFERENCES sucursales(id_sucursal),
    tipo          TEXT    NOT NULL CHECK(tipo IN ('consumo','vivienda','microempresa','comercial')),
    monto_aprobado REAL   NOT NULL,
    saldo_pendiente REAL  NOT NULL,
    tasa_interes  REAL    NOT NULL,
    cuotas_total  INTEGER NOT NULL,
    cuotas_vencidas INTEGER NOT NULL DEFAULT 0,
    fecha_desembolso TEXT NOT NULL,
    estado        TEXT    NOT NULL CHECK(estado IN ('vigente','vencido','cancelado','castigado'))
);

-- Datos de referencia
INSERT INTO sucursales (nombre, ciudad, region) VALUES
    ('Matriz Quito Norte',   'Quito',      'sierra'),
    ('Quito Sur',            'Quito',      'sierra'),
    ('Guayaquil Centro',     'Guayaquil',  'costa'),
    ('Guayaquil Norte',      'Guayaquil',  'costa'),
    ('Cuenca',               'Cuenca',     'sierra'),
    ('Manta',                'Manta',      'costa'),
    ('Ambato',               'Ambato',     'sierra');

INSERT INTO clientes (cedula, nombre, ciudad, ingreso_mensual, score_crediticio) VALUES
    ('1712345678', 'Carlos Benavides',   'Quito',      2800, 720),
    ('0912345679', 'Maria Torres',        'Guayaquil',  1500, 650),
    ('0102345670', 'Pedro Sanchez',       'Cuenca',     3200, 780),
    ('1802345671', 'Ana Guerrero',        'Ambato',      950, 590),
    ('1302345672', 'Jorge Cifuentes',     'Manta',      1200, 480),
    ('1712345673', 'Daniela Chaves',      'Quito',      4500, 810),
    ('0912345674', 'Roberto Paucar',      'Guayaquil',   800, 420),
    ('1712345675', 'Valentina Ruiz',      'Quito',      3100, 760),
    ('0612345676', 'Miguel Narvaez',      'Quito',      2200, 680),
    ('1012345677', 'Lucia Proano',        'Cuenca',     1800, 710);

INSERT INTO creditos (id_cliente, id_sucursal, tipo, monto_aprobado, saldo_pendiente, tasa_interes, cuotas_total, cuotas_vencidas, fecha_desembolso, estado) VALUES
    (1, 1, 'consumo',      8000,  5500, 15.5, 24, 0, '2025-06-01', 'vigente'),
    (2, 3, 'microempresa', 15000, 12000, 22.0, 36, 2, '2025-03-15', 'vencido'),
    (3, 5, 'vivienda',    85000, 72000,  9.5, 180, 0, '2024-01-10', 'vigente'),
    (4, 7, 'consumo',      5000,  4200, 18.0, 18, 3, '2025-09-01', 'vencido'),
    (5, 6, 'microempresa', 8000,  8000, 25.0, 24, 8, '2025-01-20', 'castigado'),
    (6, 1, 'comercial',  120000,  98000,  8.0, 60, 0, '2024-06-15', 'vigente'),
    (7, 4, 'consumo',      3000,  3000, 20.0, 12, 5, '2025-11-01', 'vencido'),
    (8, 2, 'vivienda',    65000, 58000,  9.8, 180, 0, '2024-08-20', 'vigente'),
    (9, 1, 'consumo',     12000,  9500, 16.0, 36, 1, '2025-04-10', 'vigente'),
    (10, 5, 'microempresa', 20000, 15000, 19.0, 48, 0, '2025-02-28', 'vigente'),
    (1, 2, 'vivienda',    45000, 38000,  9.5, 120, 0, '2023-11-15', 'vigente'),
    (3, 5, 'consumo',      6000,  2000, 14.0, 24, 0, '2024-09-01', 'vigente');
```

2. Ejecuta las subconsultas:

```sql
-- ============================================
-- SUBCONSULTA en WHERE (no correlacionada)
-- ============================================
-- Clientes con saldo pendiente mayor al promedio general
SELECT c.nombre, c.ciudad, cr.tipo, cr.saldo_pendiente
FROM creditos cr
JOIN clientes c ON cr.id_cliente = c.id_cliente
WHERE cr.saldo_pendiente > (
    SELECT AVG(saldo_pendiente) FROM creditos WHERE estado != 'castigado'
)
ORDER BY cr.saldo_pendiente DESC;

-- ============================================
-- SUBCONSULTA en SELECT (escalar)
-- ============================================
-- Para cada cliente, cuantos creditos activos tiene
SELECT
    c.nombre,
    c.ciudad,
    c.ingreso_mensual,
    (SELECT COUNT(*) FROM creditos cr
     WHERE cr.id_cliente = c.id_cliente
       AND cr.estado = 'vigente') AS creditos_vigentes,
    (SELECT SUM(saldo_pendiente) FROM creditos cr
     WHERE cr.id_cliente = c.id_cliente
       AND cr.estado = 'vigente') AS deuda_total_vigente
FROM clientes c
ORDER BY deuda_total_vigente DESC NULLS LAST;

-- ============================================
-- SUBCONSULTA en FROM (tabla derivada)
-- ============================================
-- Ranking de sucursales por indice de morosidad
SELECT
    s.nombre        AS sucursal,
    s.region,
    resumen.total_creditos,
    resumen.creditos_problema,
    ROUND(resumen.creditos_problema * 100.0 / resumen.total_creditos, 1) AS morosidad_pct
FROM sucursales s
JOIN (
    SELECT
        id_sucursal,
        COUNT(*)                                    AS total_creditos,
        SUM(CASE WHEN estado IN ('vencido','castigado') THEN 1 ELSE 0 END) AS creditos_problema
    FROM creditos
    GROUP BY id_sucursal
) AS resumen ON s.id_sucursal = resumen.id_sucursal
ORDER BY morosidad_pct DESC;

-- ============================================
-- VISTAS: encapsular consultas reutilizables
-- ============================================
-- Vista 1: Cartera de creditos vigentes con datos de cliente
CREATE VIEW v_cartera_vigente AS
SELECT
    c.nombre        AS cliente,
    c.ciudad,
    c.score_crediticio,
    cr.tipo         AS tipo_credito,
    cr.monto_aprobado,
    cr.saldo_pendiente,
    cr.tasa_interes,
    cr.cuotas_vencidas,
    s.nombre        AS sucursal,
    s.region
FROM creditos cr
JOIN clientes c ON cr.id_cliente = c.id_cliente
JOIN sucursales s ON cr.id_sucursal = s.id_sucursal
WHERE cr.estado = 'vigente';

-- Vista 2: Resumen de riesgo por cliente
CREATE VIEW v_riesgo_cliente AS
SELECT
    c.id_cliente,
    c.nombre,
    c.score_crediticio,
    COUNT(cr.id_credito)        AS total_creditos,
    SUM(cr.saldo_pendiente)     AS deuda_total,
    SUM(cr.cuotas_vencidas)     AS total_cuotas_vencidas,
    CASE
        WHEN SUM(cr.cuotas_vencidas) = 0 THEN 'BAJO'
        WHEN SUM(cr.cuotas_vencidas) <= 3 THEN 'MEDIO'
        ELSE 'ALTO'
    END AS nivel_riesgo
FROM clientes c
LEFT JOIN creditos cr ON c.id_cliente = cr.id_cliente
GROUP BY c.id_cliente;

-- USAR las vistas como si fueran tablas normales
SELECT * FROM v_cartera_vigente ORDER BY saldo_pendiente DESC;

SELECT * FROM v_riesgo_cliente WHERE nivel_riesgo = 'ALTO';

-- Consulta sobre la vista: clientes de sierra con riesgo alto
SELECT vr.nombre, vr.deuda_total, vr.nivel_riesgo, vc.region
FROM v_riesgo_cliente vr
JOIN v_cartera_vigente vc ON vr.nombre = vc.cliente
WHERE vr.nivel_riesgo = 'ALTO' AND vc.region = 'sierra';
```

3. Responde por escrito: ¿que ventaja tiene usar una vista en lugar de repetir el SQL complejo cada vez?

4. Crea tu propia vista `v_clientes_premium` que incluya solo clientes con `score_crediticio >= 700` y deuda total menor a $50,000.

## Usa IA para...

> Abre Claude y escribe:
> "Tengo una base de datos bancaria en SQLite con tablas: clientes, creditos, sucursales. Necesito encontrar los 3 clientes con mayor ratio deuda/ingreso (deuda total dividida para ingreso mensual). ¿Como escribo esa subconsulta? ¿Es mejor hacerlo con una subconsulta o con una vista primero?"

Despues de leer la respuesta:
- Implementa la consulta y verifica los resultados.
- Pregunta a Claude: "¿Que son las CTEs (Common Table Expressions) y como se comparan con las subconsultas? Muestra el mismo ejemplo con CTE."

## Que aprendiste

- Una subconsulta es una consulta anidada dentro de otra; puede ir en `WHERE`, `SELECT` o `FROM`.
- Las subconsultas en `WHERE` filtran filas usando el resultado de otra consulta (ej: mayor al promedio).
- Las subconsultas en `FROM` crean tablas temporales llamadas "tablas derivadas" que se pueden usar como cualquier tabla.
- Una vista (`CREATE VIEW`) es una consulta guardada que se puede usar como tabla; no almacena datos, los calcula al momento de consultarse.
- Las vistas son fundamentales para seguridad (el analista de riesgos ve la vista, no las tablas base) y reutilizacion.

## Reto extra

Escribe una consulta usando una CTE (WITH ... AS) que calcule el indice de morosidad por region (sierra, costa, etc.) y muestre solo las regiones con indice mayor al 20%. Compara el resultado con la subconsulta en FROM que hiciste antes.
