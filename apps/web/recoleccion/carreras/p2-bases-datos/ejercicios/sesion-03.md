# Ejercicio Sesion 3: Filtros — WHERE, ORDER BY, GROUP BY

**Materia:** Bases de Datos Relacionales
**Nivel:** Basico
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Dominar los filtros y agrupaciones SQL para extraer informacion especifica de una base de datos de ventas de una cadena de supermercados ecuatoriana, respondiendo preguntas de negocio reales con consultas precisas.

## Contexto

Supermaxi y TIA son dos de las cadenas de supermercados mas grandes de Ecuador, con operaciones en mas de 20 ciudades. Sus bases de datos transaccionales registran millones de ventas al mes. El equipo de datos necesita responder preguntas como: ¿cuales productos se venden mas en Quito?, ¿que dia de la semana tiene mayores ingresos?, ¿cuales clientes gastaron mas de $500 el mes pasado? Estas preguntas se responden con `WHERE`, `ORDER BY` y `GROUP BY`.

## Instrucciones

1. Usa la base de datos del ejercicio anterior o crea una nueva `supermaxi_ventas.db`. Crea estas tablas:

```sql
-- Sesion 3: WHERE, ORDER BY, GROUP BY
-- Supermercado Ecuador

CREATE TABLE productos (
    id_producto   INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre        TEXT    NOT NULL,
    categoria     TEXT    NOT NULL,
    precio_unitario REAL  NOT NULL CHECK(precio_unitario > 0),
    origen        TEXT    NOT NULL DEFAULT 'Ecuador'
);

CREATE TABLE ventas (
    id_venta      INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha         TEXT    NOT NULL,
    ciudad        TEXT    NOT NULL,
    sucursal      TEXT    NOT NULL,
    id_producto   INTEGER NOT NULL REFERENCES productos(id_producto),
    cantidad      INTEGER NOT NULL CHECK(cantidad > 0),
    precio_venta  REAL    NOT NULL,
    metodo_pago   TEXT    NOT NULL CHECK(metodo_pago IN ('efectivo','tarjeta','transferencia','deuna'))
);

-- Insertar productos tipicos de supermercado ecuatoriano
INSERT INTO productos (nombre, categoria, precio_unitario, origen) VALUES
    ('Leche Toni 1L',           'Lacteos',       1.05, 'Ecuador'),
    ('Arroz Superior 2kg',      'Granos',        1.80, 'Ecuador'),
    ('Aceite La Favorita 1L',   'Aceites',       3.20, 'Ecuador'),
    ('Pan de molde Bimbo',      'Panaderia',     1.65, 'Mexico'),
    ('Coca Cola 2L',            'Bebidas',       1.75, 'Ecuador'),
    ('Pollo entero kg',         'Carnes',        3.80, 'Ecuador'),
    ('Papel higienico Familia', 'Higiene',       4.50, 'Ecuador'),
    ('Detergente Ariel 2kg',    'Limpieza',      8.90, 'Importado'),
    ('Yogurt Chiveria 200g',    'Lacteos',       0.85, 'Ecuador'),
    ('Atun Real 180g',          'Conservas',     1.45, 'Ecuador'),
    ('Quinua organica 500g',    'Granos',        3.60, 'Ecuador'),
    ('Cerveza Pilsener 6pack',  'Bebidas',       6.80, 'Ecuador');

-- Insertar ventas de enero-marzo 2026 (muestra representativa)
INSERT INTO ventas (fecha, ciudad, sucursal, id_producto, cantidad, precio_venta, metodo_pago) VALUES
    ('2026-01-05', 'Quito',      'CCI',        1,  24, 1.05, 'tarjeta'),
    ('2026-01-05', 'Quito',      'CCI',        2,  18, 1.80, 'efectivo'),
    ('2026-01-06', 'Guayaquil',  'Alban Borja', 5,  30, 1.75, 'deuna'),
    ('2026-01-10', 'Quito',      'Quicentro',  7,  15, 4.50, 'tarjeta'),
    ('2026-01-12', 'Cuenca',     'El Vergel',   6,  22, 3.80, 'efectivo'),
    ('2026-01-15', 'Guayaquil',  'Alban Borja',12,  40, 6.80, 'tarjeta'),
    ('2026-01-20', 'Quito',      'CCI',        3,  50, 3.20, 'efectivo'),
    ('2026-02-03', 'Ambato',     'Mall Ambato', 2,  35, 1.80, 'tarjeta'),
    ('2026-02-10', 'Quito',      'Quicentro',  8,  12, 8.90, 'transferencia'),
    ('2026-02-14', 'Guayaquil',  'Riocentro',  5,  55, 1.75, 'deuna'),
    ('2026-02-20', 'Quito',      'CCI',        11,  8, 3.60, 'tarjeta'),
    ('2026-03-01', 'Cuenca',     'El Vergel',   1,  30, 1.05, 'efectivo'),
    ('2026-03-05', 'Quito',      'Quicentro',  6,  18, 3.80, 'tarjeta'),
    ('2026-03-10', 'Manta',      'Paseo Shopping',4, 20, 1.65, 'efectivo'),
    ('2026-03-15', 'Quito',      'CCI',        9,  45, 0.85, 'deuna'),
    ('2026-03-20', 'Guayaquil',  'Alban Borja', 2,  60, 1.80, 'tarjeta'),
    ('2026-03-25', 'Quito',      'CCI',        10, 35, 1.45, 'efectivo'),
    ('2026-03-25', 'Ambato',     'Mall Ambato', 7,  22, 4.50, 'tarjeta');
```

2. Ejecuta cada consulta y anota los resultados:

```sql
-- WHERE: filtrar por condicion simple
-- 1. Ventas solo en Quito
SELECT fecha, sucursal, id_producto, cantidad, precio_venta
FROM ventas
WHERE ciudad = 'Quito';

-- 2. Ventas con monto total mayor a $50 (cantidad * precio_venta)
SELECT fecha, ciudad, id_producto,
       cantidad * precio_venta AS total_venta
FROM ventas
WHERE cantidad * precio_venta > 50;

-- 3. Ventas de marzo 2026 pagadas con tarjeta
SELECT *
FROM ventas
WHERE fecha LIKE '2026-03%'
  AND metodo_pago = 'tarjeta';

-- 4. Productos ecuatorianos con precio menor a $2
SELECT nombre, categoria, precio_unitario
FROM productos
WHERE origen = 'Ecuador'
  AND precio_unitario < 2.00;

-- ORDER BY: ordenar resultados
-- 5. Todos los productos ordenados por precio descendente
SELECT nombre, categoria, precio_unitario
FROM productos
ORDER BY precio_unitario DESC;

-- 6. Ventas de Quito ordenadas por fecha y luego por total descendente
SELECT fecha, sucursal, cantidad * precio_venta AS total
FROM ventas
WHERE ciudad = 'Quito'
ORDER BY fecha ASC, total DESC;

-- GROUP BY: agregar y resumir
-- 7. Total de ventas (en dolares) por ciudad
SELECT ciudad,
       COUNT(*)              AS num_transacciones,
       SUM(cantidad * precio_venta) AS ingresos_totales,
       AVG(cantidad * precio_venta) AS ticket_promedio
FROM ventas
GROUP BY ciudad
ORDER BY ingresos_totales DESC;

-- 8. Ingresos por metodo de pago
SELECT metodo_pago,
       COUNT(*) AS transacciones,
       SUM(cantidad * precio_venta) AS total_cobrado
FROM ventas
GROUP BY metodo_pago;

-- HAVING: filtrar grupos (como WHERE pero sobre resultados de GROUP BY)
-- 9. Ciudades con mas de $100 en ingresos totales
SELECT ciudad,
       SUM(cantidad * precio_venta) AS ingresos_totales
FROM ventas
GROUP BY ciudad
HAVING ingresos_totales > 100
ORDER BY ingresos_totales DESC;

-- 10. Categorias con precio promedio mayor a $3
SELECT categoria,
       COUNT(*) AS num_productos,
       AVG(precio_unitario) AS precio_promedio
FROM productos
GROUP BY categoria
HAVING precio_promedio > 3
ORDER BY precio_promedio DESC;
```

3. Escribe 2 consultas propias que respondan:
   - ¿Cuantas ventas se hicieron en cada mes?
   - ¿Cual es el producto mas barato de la categoria Lacteos?

## Usa IA para...

> Abre Claude y escribe:
> "Tengo una tabla 'ventas' con columnas: fecha, ciudad, id_producto, cantidad, precio_venta. Quiero saber cuales son los 3 dias con mas ingresos y cuantas transacciones hubo cada dia. ¿Como escribo esa consulta SQL? Explica cada parte."

Despues de leer la respuesta:
- Implementa la consulta en tu base de datos y verifica el resultado.
- Pregunta a Claude: "¿Cual es la diferencia entre WHERE y HAVING en SQL? ¿Por que no puedo usar una funcion de agregacion como SUM() dentro de un WHERE?"

## Que aprendiste

- `WHERE` filtra filas antes de la agregacion; acepta condiciones con `=`, `<`, `>`, `LIKE`, `AND`, `OR`, `IN`.
- `ORDER BY` ordena el resultado; `ASC` (ascendente, por defecto) o `DESC` (descendente).
- `GROUP BY` agrupa filas con el mismo valor en una columna para aplicar funciones de agregacion (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`).
- `HAVING` es como un `WHERE` pero se aplica despues de la agregacion, permitiendo filtrar grupos completos.
- Calcular columnas derivadas en el `SELECT` (como `cantidad * precio_venta AS total`) no crea datos en la tabla; es solo una proyeccion para ese resultado.

## Reto extra

Escribe una consulta que muestre el producto mas vendido (por cantidad total) de cada ciudad. Usa `GROUP BY ciudad, id_producto` y luego filtra con una subconsulta o `HAVING` para quedarte con el maximo de cada ciudad. (Pista: esta es una consulta avanzada; usa a Claude como ayuda.)
