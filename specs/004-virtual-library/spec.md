# Feature Specification: Biblioteca Virtual con APIs Open Access

**Feature Branch**: `004-virtual-library`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Biblioteca virtual con acceso a papers cientificos via APIs de acceso abierto y busqueda asistida por IA para cumplir Art. 61 RRA 2022

## Institutional Alignment *(mandatory)*

### Source Inputs

- `docs/ces_aprobacion/INVESTIGACION_REQUISITOS_CES_ONLINE.md` — Art. 61 RRA 2022: acceso a al menos UNA biblioteca virtual obligatorio para modalidad en linea
- `docs/ces_aprobacion/02_ARQUITECTURA_MODERNA.md` — Decision OpenAlex + Gemini como capa de busqueda inteligente
- `docs/roadmap/fases.md` — Fase 3: Campus virtual base
- `.specify/memory/constitution.md` — Principio VI (CES Compliance by Design)
- Reglamento RRA 2022 Art. 61: entorno virtual debe garantizar acceso a recursos bibliograficos actualizados

### Phase Fit

- **Roadmap Phase**: Fase 3 (Campus virtual base)
- **Why now**: El Art. 61 RRA 2022 establece que la modalidad en linea debe ofrecer acceso a al menos una biblioteca virtual. Sin este componente, el expediente de aprobacion CES queda incompleto. La ventaja de usar APIs de acceso abierto (OpenAlex, Scielo, arXiv) es que el costo es $0 y el inventario supera 250 millones de papers — imposible de igualar con una biblioteca propia.
- **Out of scope**:
  - Descarga de PDFs protegidos por derechos de autor
  - Repositorio institucional propio de ITSEIA (fase posterior)
  - Acceso a bases de datos de pago (IEEE, Springer) — no necesario con Open Access
  - Gestor de referencias bibliograficas integrado (fase 4)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Estudiante busca papers relevantes a su materia (Priority: P1)

Un estudiante autenticado accede a la seccion "Biblioteca Virtual" desde su panel, escribe
terminos de busqueda relacionados con el tema que esta estudiando (por ejemplo: "redes
neuronales convolucionales imagen medica"), y ve una lista de papers relevantes con
titulo, autores, año, resumen y enlace al texto completo. Puede guardar papers en su
lista de favoritos y exportar la cita en formato APA.

**Why this priority**: Es el flujo principal que satisface el requisito CES. Un estudiante
que puede encontrar y acceder a bibliografia academica en menos de 3 segundos cumple
con el espiritu del Art. 61 RRA 2022.

**Independent Test**: Un estudiante puede buscar un termino de IA, recibir al menos 10
papers con resumen visible, guardar uno en favoritos y copiar su cita APA — todo sin
salir de la plataforma.

**Acceptance Scenarios**:

1. **Given** estudiante autenticado en la Biblioteca Virtual, **When** escribe una
   consulta de busqueda y presiona Enter, **Then** el sistema muestra al menos 10
   resultados relevantes con titulo, autores, año, fuente y resumen en menos de 3 segundos.
2. **Given** lista de resultados visible, **When** estudiante hace click en "Guardar",
   **Then** el paper se agrega a su lista de favoritos con confirmacion visual.
3. **Given** resultado de busqueda, **When** estudiante hace click en "Citar APA",
   **Then** el sistema genera la cita en formato APA lista para copiar al portapapeles.
4. **Given** lista de resultados, **When** estudiante aplica filtro de año (ej: 2020-2025),
   **Then** los resultados se actualizan mostrando solo papers del rango seleccionado.

---

### User Story 2 — Docente recomienda papers como recursos de la sesion (Priority: P2)

Un docente, mientras prepara una sesion academica, busca papers en la biblioteca y puede
marcarlos como "Recurso recomendado" para una sesion especifica. Los estudiantes de esa
materia ven los papers recomendados directamente en la pagina de la sesion, bajo la
seccion "Lecturas recomendadas".

**Why this priority**: Vincula la biblioteca con el contenido academico de cada sesion,
creando la evidencia de uso pedagogico que el CES valora en auditorias. Sin esta
conexion, la biblioteca seria solo una herramienta independiente sin integracion curricular.

**Independent Test**: Un docente puede buscar un paper y asociarlo a una sesion, y los
estudiantes de esa materia lo ven listado en esa sesion.

**Acceptance Scenarios**:

1. **Given** docente autenticado buscando en la biblioteca, **When** hace click en
   "Recomendar para sesion" en un resultado, **Then** puede seleccionar la sesion
   destino de su materia y el paper queda vinculado a ella.
2. **Given** paper vinculado a una sesion, **When** estudiante accede a esa sesion,
   **Then** ve el paper listado en "Lecturas recomendadas" con titulo, autores y enlace.

---

### User Story 3 — IA sugiere papers relevantes segun el tema de la sesion (Priority: P3)

Cuando un estudiante o docente accede a la Biblioteca Virtual desde dentro de una sesion
activa, el sistema usa el titulo y descripcion de esa sesion para generar automaticamente
una busqueda contextual y mostrar sugerencias de papers relacionados sin que el usuario
tenga que escribir nada.

**Why this priority**: Diferenciador tecnologico que refuerza el posicionamiento de ITSEIA
como instituto de IA. Facilita el acceso a recursos y aumenta la probabilidad de que los
estudiantes efectivamente usen la biblioteca.

**Independent Test**: Al abrir la biblioteca desde una sesion titulada "Redes Neuronales",
aparecen sugerencias automaticas de papers de IA sin que el usuario escriba ninguna
consulta.

**Acceptance Scenarios**:

1. **Given** estudiante en la pagina de una sesion con titulo "Procesamiento de Lenguaje
   Natural", **When** hace click en "Buscar recursos en biblioteca", **Then** la
   biblioteca se abre con resultados pre-cargados sobre PLN sin necesidad de escribir
   ninguna consulta.
2. **Given** sugerencias automaticas visibles, **When** estudiante escribe su propia
   consulta, **Then** las sugerencias se reemplazan por los resultados de su busqueda
   manual.

---

### Edge Cases

- Busqueda sin resultados: el sistema muestra mensaje amigable con sugerencias de
  terminos alternativos.
- API de OpenAlex o Scielo no disponible temporalmente: el sistema muestra los resultados
  de la fuente disponible y notifica que una fuente esta temporalmente inaccesible.
- Paper sin resumen disponible en la API: se muestra el titulo y autores con nota
  "Resumen no disponible — ver texto completo".
- Estudiante intenta guardar mas de 500 favoritos: el sistema lo permite sin limite
  practico en esta fase.
- Consulta en español cuando los papers estan en ingles: el sistema busca en ambos
  idiomas y la IA de sugerencias traduce los terminos automaticamente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST integrar al menos dos fuentes de acceso abierto (OpenAlex
  + Scielo o arXiv) para garantizar cobertura de papers en español e ingles.
- **FR-002**: System MUST retornar resultados de busqueda en menos de 3 segundos para
  el 95% de las consultas.
- **FR-003**: System MUST mostrar para cada resultado: titulo, autores, año de
  publicacion, fuente/revista, resumen (abstract) y enlace al texto completo.
- **FR-004**: System MUST ofrecer filtros de busqueda por: año de publicacion, idioma
  (español/ingles) y area tematica.
- **FR-005**: Users MUST poder guardar papers en una lista personal de favoritos
  accesible desde su perfil.
- **FR-006**: System MUST generar cita en formato APA para cualquier paper encontrado,
  lista para copiar.
- **FR-007**: System MUST permitir al docente vincular papers como "Lecturas
  recomendadas" a sesiones especificas de su materia.
- **FR-008**: System MUST usar el contexto de la sesion actual para pre-cargar
  sugerencias de busqueda relevantes cuando el acceso proviene desde una sesion.
- **FR-009**: System MUST funcionar con costo de API $0 utilizando exclusivamente
  fuentes de acceso abierto.
- **FR-010**: System MUST registrar las busquedas realizadas (anonimizadas) para
  generar reportes de uso de la biblioteca como evidencia para SENESCYT.

### Key Entities

- **LibrarySearch**: Registro de cada busqueda realizada (query, sources_used,
  result_count, user_id, subject_id, created_at). Permite auditoria de uso.
- **SavedPaper**: Paper guardado por un usuario (user_id, paper_id, title, authors,
  year, url, apa_citation, source, saved_at). Lista personal de favoritos.

## Assumptions & Dependencies

- **A1**: OpenAlex API (api.openalex.org) es gratuita, no requiere autenticacion para
  consultas basicas y retorna resultados en <2 segundos desde servidores de ITSEIA.
- **A2**: Scielo y arXiv son fuentes secundarias de respaldo; OpenAlex cubre el 90%
  de casos de uso por volumen de papers indexados.
- **A3**: La generacion de citas APA se realiza con los metadatos del paper retornados
  por la API; no se requiere acceso al texto completo del paper.
- **A4**: Gemini API (ya disponible en la plataforma) se usa para la funcionalidad de
  sugerencias contextuales — sin costo adicional de integracion.
- **D1**: Sistema de autenticacion y roles debe estar operativo — depende de
  001-platform-foundation.
- **D2**: Modelo de sesiones academicas debe existir para vincular papers recomendados
  a sesiones especificas (depende de 001-platform-foundation).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Cualquier busqueda retorna al menos 10 resultados relevantes en menos
  de 3 segundos para el 95% de las consultas.
- **SC-002**: El costo de infraestructura de la biblioteca virtual es $0 por uso de
  APIs de acceso abierto.
- **SC-003**: El 100% de los papers encontrados tiene al menos titulo, autores y año
  visibles; el 80% tiene resumen disponible.
- **SC-004**: El reporte de uso de la biblioteca muestra datos exportables de busquedas
  y papers guardados para evidencia SENESCYT.
- **SC-005**: Un estudiante puede encontrar, guardar y citar un paper en formato APA
  en menos de 60 segundos desde el inicio de su busqueda.
