# Ejercicio Sesion 6: Normalizacion — 1NF, 2NF, 3NF

**Materia:** Bases de Datos Relacionales
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Identificar y corregir violaciones a las tres primeras formas normales en un sistema de facturacion electronica ecuatoriana, comprendiendo por que la normalizacion elimina anomalias de insercion, actualizacion y eliminacion.

## Contexto

Ecuador implemento la facturacion electronica obligatoria desde 2014 para todas las empresas con ingresos superiores a $100,000 anuales. El SRI gestiona millones de facturas por dia. Un diseno de base de datos mal normalizado en este sistema puede causar inconsistencias graves: un mismo cliente con dos nombres diferentes segun el periodo, o datos que desaparecen al borrar una factura. La normalizacion previene estos problemas.

## Instrucciones

1. Analiza esta tabla DESNORMALIZADA que modela un sistema de facturas muy mal disenado:

```sql
-- TABLA ORIGINAL: FACTURA_DESNORMALIZADA (NO hacer esto)
-- Esta tabla tiene MULTIPLES violaciones de normalizacion

CREATE TABLE factura_desnormalizada (
    id_factura        INTEGER,
    numero_autorizacion TEXT,
    fecha_emision     TEXT,
    -- Datos del cliente REPETIDOS en cada factura
    ruc_cliente       TEXT,
    nombre_cliente    TEXT,
    telefono_cliente  TEXT,
    email_cliente     TEXT,
    ciudad_cliente    TEXT,
    -- Datos de la empresa emisora REPETIDOS en cada factura
    ruc_emisor        TEXT,
    nombre_emisor     TEXT,
    direccion_emisor  TEXT,
    -- Multiples items en columnas separadas (VIOLACION 1NF)
    item1_codigo      TEXT,
    item1_descripcion TEXT,
    item1_cantidad    INTEGER,
    item1_precio      REAL,
    item2_codigo      TEXT,
    item2_descripcion TEXT,
    item2_cantidad    INTEGER,
    item2_precio      REAL,
    item3_codigo      TEXT,
    item3_descripcion TEXT,
    item3_cantidad    INTEGER,
    item3_precio      REAL,
    -- Totales calculados guardados (dato derivado redundante)
    subtotal          REAL,
    iva_15pct         REAL,
    total             REAL
);
```

2. Analiza los problemas en la tabla anterior:

```
PROBLEMAS IDENTIFICADOS:

VIOLACION 1NF (Primera Forma Normal):
- Grupos repetidos: item1_*, item2_*, item3_* son columnas repetidas
  para el mismo tipo de dato (item de factura).
  Si una factura tiene 10 items, ¿necesito 40 columnas?
- No hay atomicidad: cada columna debe contener un solo valor del mismo tipo.

VIOLACION 2NF (Segunda Forma Normal):
- La tabla no esta en 1NF todavia, pero tambien tendria:
  nombre_cliente, telefono, email, ciudad dependen de ruc_cliente
  (no de la factura completa).
  Si actualizo el telefono de un cliente, debo actualizar 500 filas.

VIOLACION 3NF (Tercera Forma Normal):
- ciudad_cliente podria determinar datos de la provincia/region
  (dependencia transitiva).
- iva_15pct = subtotal * 0.15 (dato calculable, no debe almacenarse).
- total = subtotal + iva (dato derivado redundante).
```

3. Crea el diseno NORMALIZADO:

```sql
-- DISENO NORMALIZADO - Sistema Facturacion Electronica Ecuador

-- PRIMERA FORMA NORMAL (1NF):
-- - Sin grupos repetidos
-- - Cada columna tiene un solo tipo de dato
-- - Existe clave primaria clara

CREATE TABLE emisores (
    ruc_emisor        TEXT    PRIMARY KEY CHECK(length(ruc_emisor) = 13),
    nombre_comercial  TEXT    NOT NULL,
    razon_social      TEXT    NOT NULL,
    direccion         TEXT    NOT NULL,
    ciudad            TEXT    NOT NULL,
    email             TEXT    NOT NULL,
    activo            INTEGER NOT NULL DEFAULT 1
);

-- SEGUNDA FORMA NORMAL (2NF):
-- Todos los atributos dependen completamente de la PK
-- (eliminar dependencias parciales)

CREATE TABLE clientes (
    ruc_cliente       TEXT    PRIMARY KEY CHECK(length(ruc_cliente) IN (10,13)),
    nombres           TEXT    NOT NULL,
    apellidos         TEXT,
    email             TEXT,
    telefono          TEXT,
    direccion         TEXT,
    ciudad            TEXT    NOT NULL,
    tipo              TEXT    NOT NULL CHECK(tipo IN ('PERSONA_NATURAL','SOCIEDAD','EXTRANJERO'))
);

CREATE TABLE productos (
    codigo_producto   TEXT    PRIMARY KEY,
    descripcion       TEXT    NOT NULL,
    unidad_medida     TEXT    NOT NULL DEFAULT 'unidad',
    precio_base       REAL    NOT NULL CHECK(precio_base >= 0),
    aplica_iva        INTEGER NOT NULL DEFAULT 1
);

-- La factura solo tiene datos propios de la transaccion
CREATE TABLE facturas (
    id_factura        INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_autorizacion TEXT   UNIQUE,
    numero_secuencial TEXT    NOT NULL,
    fecha_emision     TEXT    NOT NULL,
    ruc_emisor        TEXT    NOT NULL REFERENCES emisores(ruc_emisor),
    ruc_cliente       TEXT    NOT NULL REFERENCES clientes(ruc_cliente),
    forma_pago        TEXT    NOT NULL CHECK(forma_pago IN ('efectivo','tarjeta','transferencia','credito')),
    estado            TEXT    NOT NULL CHECK(estado IN ('emitida','anulada','devuelta'))
    -- NO guardamos subtotal, iva, total: se calculan desde items
);

-- TERCERA FORMA NORMAL (3NF):
-- Eliminar dependencias transitivas
-- (eliminar columnas que dependen de otras columnas no-PK)

CREATE TABLE items_factura (
    id_item           INTEGER PRIMARY KEY AUTOINCREMENT,
    id_factura        INTEGER NOT NULL REFERENCES facturas(id_factura),
    codigo_producto   TEXT    NOT NULL REFERENCES productos(codigo_producto),
    cantidad          REAL    NOT NULL CHECK(cantidad > 0),
    precio_unitario   REAL    NOT NULL CHECK(precio_unitario >= 0),
    descuento_pct     REAL    NOT NULL DEFAULT 0 CHECK(descuento_pct BETWEEN 0 AND 100)
    -- NO guardamos subtotal_item: se calcula como cantidad * precio_unitario * (1 - descuento_pct/100)
);

-- INSERT de ejemplo
INSERT INTO emisores VALUES (
    '1792012345001', 'Tech Solutions', 'Tech Solutions S.A.',
    'Av. Republica 456 Of. 301', 'Quito', 'facturacion@techsol.ec', 1
);

INSERT INTO clientes VALUES (
    '1712345678001', 'Carlos Eduardo', 'Benavides Morales',
    'carlos@gmail.com', '0991234567', 'Calle Ficticia 123', 'Quito', 'PERSONA_NATURAL'
);
INSERT INTO clientes VALUES (
    '0992345678001', 'Ferreteria Nacional', NULL,
    'compras@ferreteria.ec', '042345678', 'Av. 9 de Octubre 789', 'Guayaquil', 'SOCIEDAD'
);

INSERT INTO productos VALUES
    ('PROD-001', 'Laptop HP 14 Core i5',    'unidad', 620.00, 1),
    ('PROD-002', 'Mouse inalambrico Logitech','unidad', 25.00, 1),
    ('PROD-003', 'Cable HDMI 2m',           'unidad',  8.50, 1),
    ('PROD-004', 'Servicio de instalacion', 'hora',   45.00, 1);

INSERT INTO facturas (numero_autorizacion, numero_secuencial, fecha_emision, ruc_emisor, ruc_cliente, forma_pago, estado) VALUES
    ('2401202612345678901234567890123456789012345678', '001-001-000000001', '2026-03-01', '1792012345001', '1712345678001', 'tarjeta', 'emitida'),
    ('2401202698765432109876543210987654321098765432', '001-001-000000002', '2026-03-05', '1792012345001', '0992345678001', 'transferencia', 'emitida');

INSERT INTO items_factura (id_factura, codigo_producto, cantidad, precio_unitario, descuento_pct) VALUES
    (1, 'PROD-001', 1, 620.00, 0),
    (1, 'PROD-002', 2, 25.00,  5),
    (1, 'PROD-003', 1, 8.50,   0),
    (2, 'PROD-001', 5, 620.00, 10),
    (2, 'PROD-004', 3, 45.00,  0);

-- CONSULTA: calcular totales desde el modelo normalizado
SELECT
    f.numero_secuencial,
    f.fecha_emision,
    c.nombres || ' ' || COALESCE(c.apellidos, '') AS cliente,
    SUM(i.cantidad * i.precio_unitario * (1 - i.descuento_pct/100.0)) AS subtotal,
    ROUND(SUM(i.cantidad * i.precio_unitario * (1 - i.descuento_pct/100.0)) * 0.15, 2) AS iva_15,
    ROUND(SUM(i.cantidad * i.precio_unitario * (1 - i.descuento_pct/100.0)) * 1.15, 2) AS total_con_iva
FROM facturas f
JOIN clientes c ON f.ruc_cliente = c.ruc_cliente
JOIN items_factura i ON f.id_factura = i.id_factura
GROUP BY f.id_factura;
```

4. Para cada forma normal, escribe en tu cuaderno:
   - Una definicion con tus propias palabras.
   - Un ejemplo de como se viola y como se corrige.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo esta tabla desnormalizada de facturas: [id_factura, ruc_cliente, nombre_cliente, email_cliente, item1_desc, item1_precio, item2_desc, item2_precio, subtotal, iva, total]. Guiame paso a paso para llevarla a 3NF. Explica cada transformacion."

Despues de leer la respuesta:
- Compara el proceso que ChatGPT sugiere con el que seguiste en el ejercicio.
- Pregunta: "¿Existe la 4NF y la 5NF? ¿Cuando se usan en sistemas reales?"

## Que aprendiste

- **1NF:** Eliminar grupos repetidos (columnas item1, item2...) y garantizar atomicidad. Cada celda tiene un valor, no una lista.
- **2NF:** Cada columna no-clave debe depender de TODA la clave primaria (no de parte de ella). Aplica cuando la PK es compuesta.
- **3NF:** Cada columna no-clave debe depender directamente de la PK, no de otra columna no-clave (eliminar dependencias transitivas).
- Los datos calculados (subtotal, iva, total) no deben guardarse si se pueden derivar de otras columnas; ocupan espacio y pueden desincronizarse.
- Normalizar correctamente facilita el mantenimiento: actualizar el email de un cliente es cambiar 1 fila, no 10,000.

## Reto extra

Desnormaliza intencionalmente la tabla `items_factura` agregando la columna `nombre_producto` (que ya existe en la tabla `productos`). Luego inserta un item con un nombre diferente al de la tabla `productos`. Explica que tipo de anomalia acabas de crear y como la normalizacion la previene.
