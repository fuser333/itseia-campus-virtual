# Ejercicio Sesion 7: Indices y Optimizacion

**Materia:** Bases de Datos Relacionales
**Nivel:** Intermedio
**Herramienta IA:** Copilot
**Duracion estimada:** 40 min

## Objetivo

Crear indices apropiados y analizar planes de ejecucion SQL para mejorar el rendimiento de consultas sobre una tabla de transacciones financieras del sistema de pagos movil ecuatoriano, midiendo el impacto real de los indices en tiempos de respuesta.

## Contexto

Deuna!, la billetera digital mas usada en Ecuador, procesa mas de 500,000 transacciones diarias. A ese volumen, una consulta sin indices puede tardar 30 segundos; con el indice correcto, 0.002 segundos. Los ingenieros de datos del Banco Central del Ecuador y del SRI trabajan diariamente optimizando consultas sobre tablas de millones de registros. Entender cuando y como indexar es una de las habilidades mas valoradas en el mercado laboral tecnico ecuatoriano.

## Instrucciones

1. Crea la base de datos `pagos_moviles_ecuador.db` con una tabla grande:

```sql
-- Sesion 7: Indices y Optimizacion
-- Sistema de pagos moviles Ecuador

CREATE TABLE transacciones (
    id_transaccion  INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha           TEXT    NOT NULL,
    hora            TEXT    NOT NULL,
    cedula_origen   TEXT    NOT NULL,
    cedula_destino  TEXT    NOT NULL,
    tipo            TEXT    NOT NULL CHECK(tipo IN ('pago','transferencia','recarga','retiro')),
    monto           REAL    NOT NULL CHECK(monto > 0),
    ciudad          TEXT    NOT NULL,
    canal           TEXT    NOT NULL CHECK(canal IN ('app','ussd','qr','pos')),
    estado          TEXT    NOT NULL CHECK(estado IN ('completada','fallida','revertida','pendiente')),
    banco_origen    TEXT    NOT NULL,
    banco_destino   TEXT
);

-- Poblar con datos de muestra (insertamos 10,000 filas con un script Python)
-- Para este ejercicio, usamos 100 filas representativas manualmente
-- y asumimos que en produccion serian millones

INSERT INTO transacciones (fecha, hora, cedula_origen, cedula_destino, tipo, monto, ciudad, canal, estado, banco_origen, banco_destino)
WITH RECURSIVE datos(n) AS (
    SELECT 1
    UNION ALL SELECT n + 1 FROM datos WHERE n < 500
)
SELECT
    date('2026-01-01', '+' || (n % 84) || ' days'),
    printf('%02d:%02d:00', (n * 7) % 24, (n * 13) % 60),
    printf('%010d', 1700000000 + (n % 50)),
    printf('%010d', 0900000000 + (n % 80)),
    CASE (n % 4) WHEN 0 THEN 'pago' WHEN 1 THEN 'transferencia' WHEN 2 THEN 'recarga' ELSE 'retiro' END,
    ROUND(5 + (n * 3.7) % 495, 2),
    CASE (n % 7) WHEN 0 THEN 'Quito' WHEN 1 THEN 'Guayaquil' WHEN 2 THEN 'Cuenca'
                 WHEN 3 THEN 'Ambato' WHEN 4 THEN 'Manta' WHEN 5 THEN 'Ibarra' ELSE 'Loja' END,
    CASE (n % 4) WHEN 0 THEN 'app' WHEN 1 THEN 'qr' WHEN 2 THEN 'ussd' ELSE 'pos' END,
    CASE (n % 10) WHEN 0 THEN 'fallida' WHEN 1 THEN 'revertida' ELSE 'completada' END,
    CASE (n % 5) WHEN 0 THEN 'Banco Pichincha' WHEN 1 THEN 'Produbanco'
                 WHEN 2 THEN 'Banco Guayaquil' WHEN 3 THEN 'Banco Internacional' ELSE 'BCE' END,
    CASE (n % 4) WHEN 0 THEN 'Banco Pichincha' WHEN 1 THEN 'Produbanco'
                 WHEN 2 THEN 'Banco Guayaquil' ELSE NULL END
FROM datos;
```

2. Analiza el rendimiento SIN indices:

```sql
-- Ver el plan de ejecucion ANTES de crear indices
-- SQLite usa EXPLAIN QUERY PLAN para esto

-- Consulta 1: buscar transacciones por cedula
EXPLAIN QUERY PLAN
SELECT * FROM transacciones
WHERE cedula_origen = '1700000010';
-- Resultado esperado: "SCAN transacciones" (escanea TODA la tabla, lento)

-- Consulta 2: buscar por fecha y tipo
EXPLAIN QUERY PLAN
SELECT COUNT(*), SUM(monto)
FROM transacciones
WHERE fecha BETWEEN '2026-02-01' AND '2026-02-28'
  AND tipo = 'pago';
-- Resultado: otro SCAN completo

-- Medir tiempo (en SQLite Online o DB Browser)
.timer ON   -- (solo en SQLite CLI)
SELECT cedula_origen, COUNT(*) as transacciones, SUM(monto) as total
FROM transacciones
WHERE estado = 'completada'
  AND ciudad = 'Quito'
GROUP BY cedula_origen
ORDER BY total DESC
LIMIT 10;
```

3. Crea indices estrategicos:

```sql
-- ============================================================
-- TIPOS DE INDICES Y CUANDO USARLOS
-- ============================================================

-- INDICE SIMPLE: columna usada frecuentemente en WHERE
CREATE INDEX idx_cedula_origen ON transacciones(cedula_origen);
CREATE INDEX idx_fecha ON transacciones(fecha);
CREATE INDEX idx_estado ON transacciones(estado);

-- INDICE COMPUESTO: cuando siempre filtramos por dos columnas juntas
-- (el orden importa: la columna mas selectiva primero)
CREATE INDEX idx_ciudad_tipo ON transacciones(ciudad, tipo);
CREATE INDEX idx_fecha_estado ON transacciones(fecha, estado);

-- INDICE UNICO: garantiza que no haya duplicados
-- (ya existe el PRIMARY KEY, pero si tuvieramos un campo como numero_autorizacion)
-- CREATE UNIQUE INDEX idx_autorizacion ON transacciones(numero_autorizacion);

-- ============================================================
-- VERIFICAR LOS INDICES CREADOS
-- ============================================================
SELECT name, tbl_name, sql
FROM sqlite_master
WHERE type = 'index'
  AND tbl_name = 'transacciones';
```

4. Analiza el rendimiento DESPUES de crear indices:

```sql
-- Verificar que ahora usa el indice (debe decir "USING INDEX")
EXPLAIN QUERY PLAN
SELECT * FROM transacciones
WHERE cedula_origen = '1700000010';
-- Resultado esperado: "SEARCH transacciones USING INDEX idx_cedula_origen"

EXPLAIN QUERY PLAN
SELECT COUNT(*), SUM(monto)
FROM transacciones
WHERE fecha BETWEEN '2026-02-01' AND '2026-02-28'
  AND tipo = 'pago';

-- ============================================================
-- ANALISIS DE NEGOCIO con indices activos
-- ============================================================

-- Reporte: top 5 usuarios por volumen de transacciones completadas
SELECT
    cedula_origen,
    COUNT(*)    AS num_transacciones,
    SUM(monto)  AS monto_total,
    AVG(monto)  AS ticket_promedio
FROM transacciones
WHERE estado = 'completada'
GROUP BY cedula_origen
ORDER BY monto_total DESC
LIMIT 5;

-- Deteccion de posible fraude: usuarios con mas de 10 transacciones fallidas
SELECT
    cedula_origen,
    COUNT(*) AS intentos_fallidos,
    MAX(fecha) AS ultimo_intento
FROM transacciones
WHERE estado = 'fallida'
GROUP BY cedula_origen
HAVING intentos_fallidos > 5
ORDER BY intentos_fallidos DESC;

-- Resumen diario para el Banco Central
SELECT
    fecha,
    tipo,
    canal,
    COUNT(*)   AS transacciones,
    SUM(monto) AS volumen_usd
FROM transacciones
WHERE estado = 'completada'
GROUP BY fecha, tipo, canal
ORDER BY fecha, volumen_usd DESC;
```

5. Escribe en tu cuaderno: ¿que diferencia viste en el EXPLAIN QUERY PLAN antes y despues de crear indices?

## Usa IA para...

> Abre GitHub Copilot Chat en VS Code y escribe:
> "Tengo una tabla 'transacciones' con 10 millones de filas y estas columnas: fecha, cedula_origen, ciudad, tipo, estado, monto. Las consultas mas frecuentes son: buscar por cedula_origen, filtrar por fecha+estado, y agrupar por ciudad+tipo. ¿Que indices exactos crearia y en que orden de columnas? ¿Que indices podrian ser contraproducentes?"

Despues de leer la respuesta:
- Compara las sugerencias de Copilot con los indices que ya creaste.
- Pregunta: "¿Cuando un indice hace la base de datos MAS lenta en lugar de mas rapida?"

## Que aprendiste

- Un indice es una estructura de datos separada (arbol B+) que permite encontrar registros sin escanear toda la tabla.
- `EXPLAIN QUERY PLAN` muestra como SQLite ejecuta una consulta: "SCAN" significa lectura completa (lento), "SEARCH USING INDEX" significa uso del indice (rapido).
- Los indices son utiles en columnas que aparecen frecuentemente en `WHERE`, `JOIN ON`, y `ORDER BY`.
- Los indices compuestos son mas eficientes que multiples indices simples cuando las columnas siempre se consultan juntas.
- Los indices tienen un costo: cada INSERT, UPDATE o DELETE debe actualizar tambien todos los indices de esa tabla; demasiados indices ralentizan las escrituras.

## Reto extra

Crea la consulta SQL para generar el reporte mensual del BCE: por cada combinacion de banco_origen y tipo de transaccion, mostrar el total de operaciones completadas, el monto promedio, minimo y maximo, solo para el mes de febrero 2026. Luego analiza con EXPLAIN QUERY PLAN si usa indices y ajusta los indices si es necesario.
