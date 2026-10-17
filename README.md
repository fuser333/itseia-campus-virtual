# Plataforma Completa ITSEIA

Base de trabajo para construir la plataforma digital del Instituto Superior Tecnologico
Ecuatoriano de Inteligencia Artificial (ITSEIA) con flujo de Spec Kit, versionado propio y
desarrollo por fases.

## Objetivo del repositorio

Este proyecto organiza tres cosas:

1. La definicion del producto y sus fases.
2. La arquitectura tecnica y decisiones base.
3. La futura implementacion de la plataforma web y sus modulos.

## Estado actual

- Ya existe documentacion institucional fuente en la carpeta local `PROYECTO_ITSEIA_Marzo26/`.
- Ya se inicializo Spec Kit en `.specify/`.
- Ya existe un repositorio Git independiente para este proyecto.
- Todavia no se ha generado la aplicacion web; primero se deja el marco de producto y ejecucion.

## Resumen de producto

ITSEIA parte con tres carreras presenciales en Quito:

- Inteligencia Artificial
- Ciencia de Datos
- Big Data e Inteligencia de Negocio

La plataforma debe cubrir dos capas:

1. Operacion institucional: admisiones, carreras, cohortes, matriculas, roles, docentes,
   estudiantes, seguimiento y reportes.
2. Experiencia academica diferenciada: campus virtual, AI Lab, portafolio, comunidad y
   analitica academica.

## Estructura base

```text
.
├── .specify/               # Flujo Spec Kit
├── apps/
│   └── web/                # Futura aplicacion Next.js
├── packages/
│   ├── config/             # Configuracion compartida
│   └── ui/                 # Sistema UI reutilizable
├── supabase/               # Esquema, politicas y seeds
├── docs/
│   ├── arquitectura/
│   ├── contexto/
│   └── roadmap/
├── specs/                  # Se crea por feature/fase
├── ESTRUCTURA_COMPLETA.md  # Vision previa del producto
└── README.md
```

## Como trabajar conmigo aqui

Usa mensajes directos y operativos. Ejemplos:

- `crea el spec de admisiones`
- `arma la fase 1 del sitio publico`
- `implementa la base de Next.js`
- `revisa la arquitectura del modulo estudiante`

Flujo recomendado:

1. Definimos o ajustamos una fase o modulo en `specs/`.
2. Aterrizamos el plan tecnico.
3. Lo convertimos en tareas.
4. Implementamos por bloques pequenos verificables.

## Reglas de trabajo

- No construimos todo al mismo tiempo.
- Cada modulo debe tener objetivo, alcance y criterio de salida.
- Si una necesidad ya la cubre una integracion simple, no reconstruimos un LMS completo antes
  de tiempo.
- Los PDFs fuente se usan como contexto local; el conocimiento operativo consolidado vive en
  `docs/`.

## Siguiente paso recomendado

Crear el primer feature formal en `specs/` para el MVP fundacional:

- sitio publico institucional
- admisiones y captura de leads
- base de roles
- catalogo academico inicial
- estructura del portal administrativo
