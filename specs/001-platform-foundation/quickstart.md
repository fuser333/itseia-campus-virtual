# Quickstart: ITSEIA Platform Foundation

## Objetivo

Validar el MVP fundacional de forma manual y rapida una vez implementado.

## Precondiciones

- La aplicacion `apps/web` esta desplegada o corriendo localmente.
- Existe una conexion activa con Supabase.
- Hay al menos un usuario admin, un estudiante y un docente de prueba.

## Flujo de validacion

1. Abrir el sitio publico.
2. Navegar a la home y a las tres paginas de carrera.
3. Enviar una preinscripcion con datos validos.
4. Confirmar que el lead o postulante aparece en el panel administrativo.
5. Ingresar como admin y crear o verificar:
   - 3 carreras
   - 1 periodo academico activo
   - 1 cohorte por carrera
6. Asignar o verificar:
   - un estudiante vinculado a una cohorte
   - un docente con al menos una asignacion
7. Ingresar como estudiante y validar que solo ve su dashboard.
8. Ingresar como docente y validar que solo ve su dashboard.
9. Intentar acceso cruzado no permitido y confirmar bloqueo.

## Resultado esperado

- El sitio capta demanda.
- Administracion puede operar el catalogo minimo.
- Los dashboards base por rol funcionan.
- El control de acceso responde correctamente.
