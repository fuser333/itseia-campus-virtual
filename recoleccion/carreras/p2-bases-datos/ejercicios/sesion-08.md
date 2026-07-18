# Ejercicio Sesion 8: Proyecto — Disenar BD para Negocio Ecuatoriano

**Materia:** Bases de Datos Relacionales
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Disenar e implementar desde cero una base de datos relacional completa y normalizada para una empresa de delivery de comida en Ecuador, integrando modelo ER, normalizacion, SQL completo, vistas e indices, y respondiendo preguntas de negocio reales.

## Contexto

Ecuador tiene un mercado de delivery de comida en rapido crecimiento: Uber Eats, iFood, PedidosYa y plataformas locales compiten en las principales ciudades. Una empresa de delivery en Quito maneja: restaurantes afiliados, clientes registrados, pedidos con multiples items, repartidores, y pagos. Necesita una BD robusta que cumpla con normalizacion, sea eficiente con indices, y permita generar reportes para toma de decisiones.

## Instrucciones

1. Analiza el dominio del problema y crea el modelo en el archivo `sesion08_proyecto_delivery.db`:

```sql
-- BD para empresa de delivery ecuatoriana
-- Sesion 8: Proyecto Final - Bases de Datos Relacionales
-- ITSEIA - Periodo 2
-- Estudiante: [Tu nombre]

PRAGMA foreign_keys = ON;

-- ============================================================
-- TABLAS DE REFERENCIA (datos maestros)
-- ============================================================

CREATE TABLE ciudades (
    id_ciudad   INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL UNIQUE,
    provincia   TEXT    NOT NULL
);

CREATE TABLE categorias_restaurante (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre       TEXT   NOT NULL UNIQUE   -- Hamburguesas, Sushi, Comida tipica, etc.
);

-- ============================================================
-- ENTIDADES PRINCIPALES
-- ============================================================

CREATE TABLE restaurantes (
    id_restaurante  INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre          TEXT    NOT NULL,
    ruc             TEXT    NOT NULL UNIQUE CHECK(length(ruc) = 13),
    id_categoria    INTEGER NOT NULL REFERENCES categorias_restaurante(id_categoria),
    id_ciudad       INTEGER NOT NULL REFERENCES ciudades(id_ciudad),
    direccion       TEXT    NOT NULL,
    telefono        TEXT,
    comision_pct    REAL    NOT NULL DEFAULT 20.0,  -- % que se lleva la plataforma
    calificacion    REAL    DEFAULT 0 CHECK(calificacion BETWEEN 0 AND 5),
    activo          INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE menus (
    id_item         INTEGER PRIMARY KEY AUTOINCREMENT,
    id_restaurante  INTEGER NOT NULL REFERENCES restaurantes(id_restaurante),
    nombre          TEXT    NOT NULL,
    descripcion     TEXT,
    precio          REAL    NOT NULL CHECK(precio > 0),
    disponible      INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE clientes (
    id_cliente      INTEGER PRIMARY KEY AUTOINCREMENT,
    cedula          TEXT    NOT NULL UNIQUE CHECK(length(cedula) IN (10,13)),
    nombres         TEXT    NOT NULL,
    apellidos       TEXT    NOT NULL,
    email           TEXT    NOT NULL UNIQUE,
    telefono        TEXT    NOT NULL,
    id_ciudad       INTEGER NOT NULL REFERENCES ciudades(id_ciudad),
    fecha_registro  TEXT    NOT NULL DEFAULT (date('now')),
    activo          INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE repartidores (
    id_repartidor   INTEGER PRIMARY KEY AUTOINCREMENT,
    cedula          TEXT    NOT NULL UNIQUE CHECK(length(cedula) = 10),
    nombres         TEXT    NOT NULL,
    apellidos       TEXT    NOT NULL,
    telefono        TEXT    NOT NULL,
    id_ciudad       INTEGER NOT NULL REFERENCES ciudades(id_ciudad),
    calificacion    REAL    DEFAULT 5.0 CHECK(calificacion BETWEEN 1 AND 5),
    disponible      INTEGER NOT NULL DEFAULT 1,
    total_entregas  INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- TRANSACCIONES
-- ============================================================

CREATE TABLE pedidos (
    id_pedido       INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente      INTEGER NOT NULL REFERENCES clientes(id_cliente),
    id_restaurante  INTEGER NOT NULL REFERENCES restaurantes(id_restaurante),
    id_repartidor   INTEGER REFERENCES repartidores(id_repartidor),
    fecha_pedido    TEXT    NOT NULL DEFAULT (datetime('now')),
    direccion_entrega TEXT  NOT NULL,
    estado          TEXT    NOT NULL CHECK(estado IN ('recibido','preparando','en_camino','entregado','cancelado')),
    metodo_pago     TEXT    NOT NULL CHECK(metodo_pago IN ('efectivo','tarjeta','deuna','transfer')),
    costo_envio     REAL    NOT NULL DEFAULT 1.50,
    calificacion_entrega INTEGER CHECK(calificacion_entrega BETWEEN 1 AND 5),
    notas           TEXT
);

CREATE TABLE items_pedido (
    id_item_pedido  INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido       INTEGER NOT NULL REFERENCES pedidos(id_pedido),
    id_item         INTEGER NOT NULL REFERENCES menus(id_item),
    cantidad        INTEGER NOT NULL CHECK(cantidad > 0),
    precio_unitario REAL    NOT NULL CHECK(precio_unitario > 0),
    instrucciones   TEXT    -- "sin cebolla", "extra picante", etc.
);

-- ============================================================
-- INDICES PARA RENDIMIENTO
-- ============================================================
CREATE INDEX idx_pedidos_cliente ON pedidos(id_cliente);
CREATE INDEX idx_pedidos_restaurante ON pedidos(id_restaurante);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_pedido);
CREATE INDEX idx_items_pedido ON items_pedido(id_pedido);
CREATE INDEX idx_menu_restaurante ON menus(id_restaurante);

-- ============================================================
-- DATOS DE PRUEBA - QUITO ECUADOR
-- ============================================================
INSERT INTO ciudades (nombre, provincia) VALUES
    ('Quito', 'Pichincha'),
    ('Guayaquil', 'Guayas'),
    ('Cuenca', 'Azuay');

INSERT INTO categorias_restaurante (nombre) VALUES
    ('Comida rapida'),('Sushi'),('Comida tipica'),
    ('Pizzeria'),('Hamburguesas'),('Saludable');

INSERT INTO restaurantes (nombre, ruc, id_categoria, id_ciudad, direccion, comision_pct, calificacion) VALUES
    ('Burger House Quito',  '1792011111001', 5, 1, 'Av. Republica 123',        22.0, 4.3),
    ('Sushi Nakama',        '1792022222001', 2, 1, 'Av. 6 de Diciembre 456',   20.0, 4.7),
    ('La Choza Tradicional','1792033333001', 3, 1, 'Av. Colon 789',            18.0, 4.8),
    ('Pizza Nostra',        '1792044444001', 4, 1, 'Av. Shyris 101',           20.0, 4.5),
    ('Verde Saludable',     '1792055555001', 6, 1, 'Gonzalez Suarez 202',      20.0, 4.6);

INSERT INTO menus (id_restaurante, nombre, precio) VALUES
    (1, 'Combo Classic',       8.50), (1, 'Combo Doble',        11.50), (1, 'Papas fritas',         2.50),
    (2, 'Roll California x8',  9.00), (2, 'Sashimi Mix',        14.00), (2, 'Miso Soup',             2.00),
    (3, 'Seco de pollo',        7.50), (3, 'Caldo de pata',      5.00), (3, 'Colada morada',         2.50),
    (4, 'Pizza Margherita',   12.00), (4, 'Pizza BBQ Pollo',    14.50), (4, 'Lsasagna',             10.00),
    (5, 'Bowl proteico',        9.50), (5, 'Ensalada detox',     7.00), (5, 'Jugo verde 500ml',      3.50);

INSERT INTO clientes (cedula, nombres, apellidos, email, telefono, id_ciudad) VALUES
    ('1712345678', 'Ana', 'Guerrero',   'ana@gmail.com',   '0991111111', 1),
    ('1798765432', 'Luis', 'Cevallos',  'luis@gmail.com',  '0992222222', 1),
    ('1701234567', 'Sofia', 'Ponce',    'sofia@gmail.com', '0993333333', 1);

INSERT INTO repartidores (cedula, nombres, apellidos, telefono, id_ciudad) VALUES
    ('1711111111', 'Diego', 'Vega',    '0994444444', 1),
    ('1722222222', 'Marco', 'Castro',  '0995555555', 1);

INSERT INTO pedidos (id_cliente, id_restaurante, id_repartidor, direccion_entrega, estado, metodo_pago, costo_envio) VALUES
    (1, 1, 1, 'Av. Republica 456, Quito', 'entregado',  'deuna',    1.50),
    (2, 2, 2, 'Av. 12 de Octubre, Quito', 'entregado',  'tarjeta',  1.50),
    (1, 3, 1, 'Av. Republica 456, Quito', 'en_camino',  'efectivo', 1.50),
    (3, 4, 2, 'Gonzalez Suarez 100',      'preparando', 'tarjeta',  2.00),
    (2, 1, NULL, 'Av. 12 de Octubre',     'recibido',   'deuna',    1.50);

INSERT INTO items_pedido (id_pedido, id_item, cantidad, precio_unitario) VALUES
    (1, 1, 2, 8.50), (1, 3, 1, 2.50),
    (2, 4, 2, 9.00), (2, 6, 2, 2.00),
    (3, 7, 1, 7.50), (3, 9, 2, 2.50),
    (4,10, 1,12.00), (4,11, 1,14.50),
    (5, 2, 1,11.50), (5, 3, 2, 2.50);
```

2. Crea las vistas de negocio:

```sql
-- Vista 1: Ticket completo de cada pedido
CREATE VIEW v_ticket_pedido AS
SELECT
    p.id_pedido,
    p.fecha_pedido,
    c.nombres || ' ' || c.apellidos    AS cliente,
    r.nombre                           AS restaurante,
    rp.nombres || ' ' || rp.apellidos  AS repartidor,
    p.estado,
    p.metodo_pago,
    SUM(ip.cantidad * ip.precio_unitario) AS subtotal_items,
    p.costo_envio,
    SUM(ip.cantidad * ip.precio_unitario) + p.costo_envio AS total_pedido
FROM pedidos p
JOIN clientes c     ON p.id_cliente     = c.id_cliente
JOIN restaurantes r ON p.id_restaurante = r.id_restaurante
LEFT JOIN repartidores rp ON p.id_repartidor = rp.id_repartidor
JOIN items_pedido ip ON p.id_pedido = ip.id_pedido
GROUP BY p.id_pedido;

-- Vista 2: KPIs por restaurante
CREATE VIEW v_kpi_restaurante AS
SELECT
    r.nombre                               AS restaurante,
    cat.nombre                             AS categoria,
    COUNT(DISTINCT p.id_pedido)            AS total_pedidos,
    SUM(ip.cantidad * ip.precio_unitario)  AS ventas_brutas,
    ROUND(SUM(ip.cantidad * ip.precio_unitario) * r.comision_pct / 100, 2) AS comision_plataforma,
    AVG(ip.cantidad * ip.precio_unitario + p.costo_envio) AS ticket_promedio
FROM restaurantes r
JOIN categorias_restaurante cat ON r.id_categoria = cat.id_categoria
LEFT JOIN pedidos p  ON r.id_restaurante = p.id_restaurante AND p.estado = 'entregado'
LEFT JOIN items_pedido ip ON p.id_pedido = ip.id_pedido
GROUP BY r.id_restaurante;

-- Consultas sobre las vistas
SELECT * FROM v_ticket_pedido ORDER BY total_pedido DESC;
SELECT * FROM v_kpi_restaurante ORDER BY ventas_brutas DESC;

-- Pregunta de negocio: ¿Que cliente ha gastado mas?
SELECT cliente, COUNT(*) as pedidos, SUM(total_pedido) as gasto_total
FROM v_ticket_pedido
WHERE estado = 'entregado'
GROUP BY cliente
ORDER BY gasto_total DESC;

-- ¿Cual es el item mas vendido de toda la plataforma?
SELECT
    m.nombre AS producto,
    r.nombre AS restaurante,
    SUM(ip.cantidad) AS unidades_vendidas,
    SUM(ip.cantidad * ip.precio_unitario) AS ingresos
FROM items_pedido ip
JOIN menus m ON ip.id_item = m.id_item
JOIN pedidos p ON ip.id_pedido = p.id_pedido
JOIN restaurantes r ON p.id_restaurante = r.id_restaurante
WHERE p.estado = 'entregado'
GROUP BY ip.id_item
ORDER BY unidades_vendidas DESC
LIMIT 5;
```

3. Agrega un pedido completo nuevo (tu propio pedido imaginario) con al menos 3 items de un restaurante existente. Verifica que aparece en las vistas.

4. Responde por escrito:
   - ¿Cuantas tablas necesito para este sistema? ¿Por que esa cantidad y no mas ni menos?
   - ¿Que pasaria si guardara los items del pedido como un texto JSON en una sola columna de `pedidos`?
   - ¿En que columnas pusiste indices y por que esas especificamente?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Diseñe una base de datos para una app de delivery ecuatoriana con tablas: restaurantes, clientes, repartidores, pedidos, items_pedido, menus. ¿Que consultas SQL necesitaria el equipo de negocio para: 1) calcular ingresos por restaurante del ultimo mes, 2) detectar repartidores con baja calificacion, 3) identificar clientes que no han pedido en 30 dias? Dame las 3 consultas."

Despues de leer la respuesta:
- Implementa las 3 consultas en tu base de datos.
- Ajusta la que sea necesaria para que funcione con los datos que tienes.

## Que aprendiste

- Un sistema real requiere identificar entidades, relaciones y normalizarlas antes de escribir SQL.
- Las tablas de referencia (ciudades, categorias) evitan duplicar texto y permiten cambios centralizados.
- `PRAGMA foreign_keys = ON` activa las restricciones de integridad referencial en SQLite (por defecto estan desactivadas).
- Las vistas encapsulan logica de negocio compleja y exponen solo lo que cada rol necesita ver.
- Los indices en las columnas de JOIN y WHERE mas frecuentes son el primer paso de optimizacion.

## Reto extra

Implementa el proceso de cierre de mes: una consulta que genere el estado de cuenta de cada restaurante para marzo 2026, mostrando: nombre, total ventas brutas, comision de la plataforma (tu %), IVA de la comision (15%), y monto a pagar al restaurante (ventas - comision - iva_comision). Este es el reporte que recibirian por email cada primero del mes siguiente.
