# Ejercicio Sesion 1: Modelo Entidad-Relacion

**Materia:** Bases de Datos Relacionales
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Disenar un diagrama Entidad-Relacion (ER) completo para el sistema de registro civil del Ecuador, identificando entidades, atributos y las relaciones entre ellas antes de escribir una sola linea de SQL.

## Contexto

El Registro Civil de Ecuador administra los datos de identidad de mas de 17 millones de ciudadanos. Cada ciudadano tiene una cedula unica, puede casarse, tener hijos y cambiar su estado civil. Este sistema necesita una base de datos bien disenada para no duplicar informacion y garantizar integridad. El modelo ER es el plano arquitectonico antes de construir la base de datos.

## Instrucciones

1. Abre un editor de texto o una hoja en blanco (puede ser papel, Lucidchart, draw.io o simplemente un `.txt`).

2. Identifica las entidades principales del sistema de Registro Civil:

```
ENTIDADES A MODELAR:

1. CIUDADANO
   Atributos: cedula (PK), nombres, apellidos, fecha_nacimiento,
              sexo, nacionalidad, estado_civil

2. PROVINCIA
   Atributos: codigo_provincia (PK), nombre, region

3. CANTON
   Atributos: codigo_canton (PK), nombre, codigo_provincia (FK)

4. PARROQUIA
   Atributos: codigo_parroquia (PK), nombre, codigo_canton (FK)

5. ACTA_NACIMIENTO
   Atributos: numero_acta (PK), cedula_ciudadano (FK),
              codigo_parroquia (FK), fecha_registro, tomo, pagina

6. MATRIMONIO
   Atributos: id_matrimonio (PK), cedula_conyuge1 (FK),
              cedula_conyuge2 (FK), fecha_matrimonio,
              codigo_parroquia (FK), regimen_patrimonial

7. DEFUNCION
   Atributos: id_defuncion (PK), cedula_fallecido (FK),
              fecha_defuncion, causa, codigo_parroquia (FK)
```

3. Para cada par de entidades, define la relacion y su cardinalidad. Completa esta tabla:

```
RELACIONES:

| Entidad A      | Relacion        | Entidad B      | Cardinalidad |
|----------------|-----------------|----------------|--------------|
| CIUDADANO      | nace_en         | PARROQUIA      | N:1          |
| CIUDADANO      | tiene_acta      | ACTA_NACIMIENTO| 1:1          |
| CIUDADANO      | contrae         | MATRIMONIO     | N:M          |
| PROVINCIA      | contiene        | CANTON         | 1:N          |
| CANTON         | contiene        | PARROQUIA      | 1:N          |
| CIUDADANO      | tiene_defuncion | DEFUNCION      | 1:0..1       |

¿Que otras relaciones faltan? Identifica al menos 2 mas.
```

4. Escribe el diagrama en notacion textual (crow's foot simplificada):

```
PROVINCIA (1) ──── (N) CANTON
CANTON    (1) ──── (N) PARROQUIA
CIUDADANO (N) ──── (M) MATRIMONIO  [via tabla intermedia PARTICIPA_EN]
CIUDADANO (1) ──── (1) ACTA_NACIMIENTO
CIUDADANO (1) ──── (0..1) DEFUNCION
```

5. Identifica las claves primarias (PK) y foraneas (FK) de cada entidad. Listas en tu cuaderno o archivo cuales son PK y cuales son FK.

6. Responde por escrito:
   - ¿Por que `cedula` es una buena clave primaria para CIUDADANO?
   - ¿Que problema tendria si guardas el nombre de la provincia directamente en CIUDADANO en lugar de usar una FK?
   - ¿La relacion CIUDADANO-MATRIMONIO es N:M? ¿Por que requiere tabla intermedia?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo una base de datos para el Registro Civil de Ecuador con estas entidades: CIUDADANO, PROVINCIA, CANTON, PARROQUIA, ACTA_NACIMIENTO, MATRIMONIO, DEFUNCION. ¿Que entidades importantes me faltan? ¿Hay atributos criticos que no inclui? Revisa el modelo y sugiere mejoras."

Despues de leer la respuesta:
- Agrega al menos 1 entidad que ChatGPT sugiera y justifica por que la incluyes.
- Pregunta: "¿Cuales son los errores mas comunes al disenar un modelo ER por primera vez?"

## Que aprendiste

- Una entidad representa un objeto del mundo real con existencia propia (CIUDADANO, PROVINCIA).
- Los atributos son las propiedades de una entidad; la clave primaria (PK) identifica unicamente cada fila.
- Las relaciones describen como las entidades se conectan; la cardinalidad (1:1, 1:N, N:M) determina cuantos registros pueden relacionarse.
- Una relacion N:M siempre requiere una tabla intermedia (de asociacion) en la base de datos relacional.
- Disenar el modelo ER antes de crear tablas evita errores costosos de estructura que son dificiles de corregir despues.

## Reto extra

Extiende el modelo agregando la entidad `CAMBIO_NOMBRE` (cuando un ciudadano solicita cambio de nombre por matrimonio o correccion). Define sus atributos, cual es su PK, y como se relaciona con `CIUDADANO`. ¿Seria una relacion 1:1 o 1:N? Justifica.
