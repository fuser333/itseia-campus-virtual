# Base Tecnica Recomendada

## Decision general

Se recomienda una plataforma web principal construida como monorepo liviano, con una sola
aplicacion de entrada y modulos internos por dominio. La prioridad no es una arquitectura
compleja; la prioridad es velocidad de ejecucion, claridad operativa y facilidad de evolucion.

## Stack base recomendado

- Frontend y backend web: Next.js 15 con App Router
- Lenguaje: TypeScript
- UI: Tailwind CSS 4 + shadcn/ui
- Base de datos y auth: Supabase
- Storage: Supabase Storage
- Email transaccional: Resend
- Pagos: Stripe cuando el modulo financiero requiera cobro en linea
- Despliegue: Vercel + Supabase

## Estructura de repositorio

```text
apps/
  web/            # Aplicacion principal
packages/
  ui/             # Componentes reutilizables
  config/         # ESLint, TypeScript, estilos, utilidades compartidas
supabase/         # Schema, RLS, seeds, funciones y politicas
docs/             # Producto, arquitectura y operacion
specs/            # Especificaciones por feature/fase
```

## Modulos de dominio

La plataforma debe separarse por dominios, no por paginas sueltas:

- marketing y admisiones
- identidad y roles
- catalogo academico
- cohortes y matriculas
- aula virtual
- evaluaciones y notas
- finanzas
- portafolio y empleabilidad
- AI Lab
- analitica

## Reglas tecnicas iniciales

- Una sola fuente de verdad para usuarios, roles y permisos.
- Todo acceso sensible debe quedar cubierto por politicas y validaciones del servidor.
- El contenido debe estar pensado primero en espanol.
- La plataforma debe operar con contexto Ecuador y horario local.
- Cada modulo debe poder activarse por fases, sin obligar a tener todo listo desde el dia uno.

## Recomendacion importante

No conviene reconstruir desde cero todos los modulos tipo LMS o ERP academico antes de abrir el
instituto. En fases iniciales se puede:

1. construir el nucleo institucional propio
2. integrar soluciones externas para lo commodity
3. reservar el desarrollo custom para la experiencia diferencial de ITSEIA

## Primer alcance tecnico sugerido

El primer build real deberia concentrarse en:

- sitio publico
- admisiones
- roles base
- estructura academica
- panel administrativo inicial

Despues de eso se abre el portal estudiantil y docente.
