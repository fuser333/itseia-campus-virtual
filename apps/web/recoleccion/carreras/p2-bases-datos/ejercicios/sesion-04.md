# Ejercicio Sesion 4: JOINs — INNER, LEFT, RIGHT

**Materia:** Bases de Datos Relacionales
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Dominar los tres tipos de JOIN para combinar informacion de multiples tablas, aplicados a un sistema de proveedores y pedidos de una empresa de importacion ecuatoriana, entendiendo exactamente que filas incluye cada tipo de union.

## Contexto

Ecuador importa aproximadamente $26,000 millones al ano segun datos del Banco Central. Una empresa importadora en Guayaquil maneja cientos de proveedores internacionales y genera miles de pedidos mensuales. Para analizar que proveedores tienen pedidos activos, cuales nunca han sido usados, y que pedidos no tienen proveedor asignado, necesita JOINs. El tipo de JOIN equivocado puede hacer invisible informacion critica.

## Instrucciones

1. Crea la base de datos `importadora_ecuador.db` con estas tablas y datos:

```sql
-- Sesion 4: JOINs
-- Sistema de importaciones Ecuador

CREATE TABLE proveedores (
    id_proveedor  INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre        TEXT    NOT NULL,
    pais          TEXT    NOT NULL,
    calificacion  REAL    CHECK(calificacion BETWEEN 1 AND 5),
    activo        INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE categorias_producto (
    id_categoria  INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre        TEXT    NOT NULL,
    arancel_pct   REAL    NOT NULL DEFAULT 0
);

CREATE TABLE pedidos (
    id_pedido     INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_pedido  TEXT    NOT NULL,
    id_proveedor  INTEGER REFERENCES proveedores(id_proveedor),
    id_categoria  INTEGER REFERENCES categorias_producto(id_categoria),
    descripcion   TEXT,
    valor_fob_usd REAL    NOT NULL,
    estado        TEXT    NOT NULL CHECK(estado IN ('pendiente','en_transito','recibido','cancelado'))
);

-- Proveedores (algunos sin pedidos para demostrar LEFT JOIN)
INSERT INTO proveedores (nombre, pais, calificacion) VALUES
    ('Alibaba Electronics',   'China',    4.2),
    ('Samsung Trading',       'Corea',    4.8),
    ('Made in Italy SRL',     'Italia',   4.5),
    ('Techno Imports SA',     'USA',      3.9),
    ('Brasil Tech Ltda',      'Brasil',   4.1),
    ('NewVendor Inc',         'Canada',   NULL),  -- Sin calificacion aun
    ('EuroFashion GmbH',      'Alemania', 4.7),
    ('SinPedidos Corp',       'Mexico',   3.5);   -- Nunca ha tenido pedido

-- Categorias con aranceles reales de Ecuador (aproximados)
INSERT INTO categorias_producto (nombre, arancel_pct) VALUES
    ('Electronica de consumo',  15.0),
    ('Maquinaria industrial',    0.0),
    ('Textiles',                10.0),
    ('Alimentos procesados',     5.0),
    ('Vehiculos',               35.0);

-- Pedidos (algunos con id_proveedor NULL para demostrar LEFT desde pedidos)
INSERT INTO pedidos (fecha_pedido, id_proveedor, id_categoria, descripcion, valor_fob_usd, estado) VALUES
    ('2026-01-10', 1, 1, 'Smartphones 500 unidades',  45000.00, 'recibido'),
    ('2026-01-15', 2, 1, 'Televisores 200 unidades',  38000.00, 'recibido'),
    ('2026-01-20', 1, 1, 'Accesorios USB 1000 unid',   8500.00, 'en_transito'),
    ('2026-02-01', 3, 3, 'Telas jacquard 500m',       12000.00, 'recibido'),
    ('2026-02-10', 4, 2, 'Impresoras industriales x5',22000.00, 'pendiente'),
    ('2026-02-15', 5, 4, 'Cafe procesado 5 ton',      15000.00, 'en_transito'),
    ('2026-02-20', 7, 3, 'Ropa de marca europea',     31000.00, 'pendiente'),
    ('2026-03-01', 1, 1, 'Tablets educativas 300 ud', 27000.00, 'pendiente'),
    ('2026-03-05', NULL, 2, 'Tornos CNC (sin asignar)', 85000.00, 'pendiente'),
    ('2026-03-10', 4, 1, 'Monitores 4K 50 unidades',  18000.00, 'cancelado'),
    ('2026-03-15', NULL, 5, 'Camionetas (sin asignar)', 120000.00, 'pendiente');
```

2. Ejecuta y comprende cada tipo de JOIN:

```sql
-- ============================================
-- INNER JOIN: solo filas que coinciden en ambas tablas
-- ============================================
-- Pedidos con informacion completa del proveedor
-- (Excluye pedidos sin proveedor asignado)
SELECT
    p.id_pedido,
    p.fecha_pedido,
    prov.nombre         AS proveedor,
    prov.pais,
    p.descripcion,
    p.valor_fob_usd,
    p.estado
FROM pedidos p
INNER JOIN proveedores prov ON p.id_proveedor = prov.id_proveedor
ORDER BY p.fecha_pedido;

-- Pregunta: ¿cuantos pedidos aparecen? ¿Por que no aparecen todos?

-- ============================================
-- LEFT JOIN: TODAS las filas de la tabla izquierda
-- + las coincidencias de la derecha (NULL si no hay)
-- ============================================
-- Todos los pedidos, con o sin proveedor asignado
SELECT
    p.id_pedido,
    p.fecha_pedido,
    COALESCE(prov.nombre, '** SIN PROVEEDOR **') AS proveedor,
    p.descripcion,
    p.valor_fob_usd,
    p.estado
FROM pedidos p
LEFT JOIN proveedores prov ON p.id_proveedor = prov.id_proveedor
ORDER BY prov.nombre NULLS LAST;

-- Pedidos sin proveedor (critico para auditorias)
SELECT p.id_pedido, p.descripcion, p.valor_fob_usd
FROM pedidos p
LEFT JOIN proveedores prov ON p.id_proveedor = prov.id_proveedor
WHERE prov.id_proveedor IS NULL;

-- ============================================
-- LEFT JOIN inverso: proveedores SIN pedidos
-- (util para auditar proveedores inactivos)
-- ============================================
SELECT
    prov.nombre,
    prov.pais,
    prov.calificacion,
    COUNT(p.id_pedido) AS total_pedidos
FROM proveedores prov
LEFT JOIN pedidos p ON prov.id_proveedor = p.id_proveedor
GROUP BY prov.id_proveedor
ORDER BY total_pedidos DESC;

-- Proveedores que NUNCA han tenido un pedido
SELECT prov.nombre, prov.pais
FROM proveedores prov
LEFT JOIN pedidos p ON prov.id_proveedor = p.id_proveedor
WHERE p.id_pedido IS NULL;

-- ============================================
-- JOIN CON MULTIPLES TABLAS (3 tablas)
-- ============================================
-- Reporte completo: pedido + proveedor + categoria + arancel calculado
SELECT
    p.id_pedido,
    p.fecha_pedido,
    prov.nombre                              AS proveedor,
    prov.pais,
    cat.nombre                               AS categoria,
    p.valor_fob_usd,
    cat.arancel_pct,
    ROUND(p.valor_fob_usd * cat.arancel_pct / 100, 2) AS arancel_usd,
    ROUND(p.valor_fob_usd * (1 + cat.arancel_pct/100), 2) AS total_con_arancel,
    p.estado
FROM pedidos p
INNER JOIN proveedores prov ON p.id_proveedor = prov.id_proveedor
INNER JOIN categorias_producto cat ON p.id_categoria = cat.id_categoria
ORDER BY total_con_arancel DESC;

-- ============================================
-- ANALISIS DE NEGOCIO: valor total por proveedor y estado
-- ============================================
SELECT
    prov.nombre         AS proveedor,
    prov.pais,
    p.estado,
    COUNT(*)            AS num_pedidos,
    SUM(p.valor_fob_usd) AS valor_total_usd
FROM pedidos p
INNER JOIN proveedores prov ON p.id_proveedor = prov.id_proveedor
GROUP BY prov.id_proveedor, p.estado
ORDER BY prov.nombre, p.estado;
```

3. Para cada consulta, responde por escrito:
   - ¿Cuantas filas retorna?
   - ¿Que informacion adicional aporta respecto al SELECT sin JOIN?

4. Escribe una consulta que muestre el proveedor con mayor valor total de pedidos en estado `recibido`.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Explica visualmente (con texto o pseudocodigo) la diferencia entre INNER JOIN, LEFT JOIN, RIGHT JOIN y FULL OUTER JOIN en SQL. ¿En que situacion usaria cada uno en un sistema de gestion de proveedores?"

Despues de leer la respuesta:
- Dibuja en papel un diagrama de Venn para cada tipo de JOIN.
- Pregunta: "¿SQLite soporta RIGHT JOIN y FULL OUTER JOIN? Si no, como los simulo?"

## Que aprendiste

- `INNER JOIN` retorna solo las filas que tienen coincidencia en ambas tablas; si un registro no tiene pareja, desaparece del resultado.
- `LEFT JOIN` garantiza que todas las filas de la tabla izquierda aparezcan aunque no tengan coincidencia en la tabla derecha (esas columnas llegan como NULL).
- `IS NULL` despues de un LEFT JOIN es el patron clasico para encontrar registros "huerfaños" (sin relacion).
- `COALESCE(valor, alternativa)` reemplaza NULL por un texto descriptivo en la salida.
- Un JOIN de 3 o mas tablas se encadena: cada JOIN agrega la siguiente tabla a la combinacion.

## Reto extra

Crea una consulta que muestre el ranking de paises proveedores: nombre del pais, numero de proveedores, numero total de pedidos y valor total en USD. Ordena por valor total descendente. ¿Que pais domina las importaciones en esta muestra?
