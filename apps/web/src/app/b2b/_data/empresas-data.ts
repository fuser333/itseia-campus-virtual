// ─────────────────────────────────────────────────────────────────────────────
// ITSEIA Academy — Datos demo para el módulo B2B
// Contexto: clientes corporativos reales que ya han contratado capacitación.
// Uso: páginas /b2b/** cuando no hay datos en Supabase (modo demo/presentación).
// ─────────────────────────────────────────────────────────────────────────────

export interface EstudianteB2B {
  id: string;
  nombre: string;
  email: string;
  cargo: string;
  ultimo_acceso: string; // ISO date string
  progreso: number;      // 0–100
  sesiones_completadas: number;
  sesiones_total: number;
}

export interface CursoB2B {
  id: string;
  nombre: string;
  descripcion: string;
  horas: number;          // duración total del curso
  completado_pct: number; // 0–100
  instructor: string;
  inicio: string;         // ISO date string
  estado: "activo" | "completado" | "pausado";
  modulos: number;
  sesiones: number;
}

export interface ReporteB2B {
  id: string;
  tipo: "mensual" | "trimestral" | "final";
  titulo: string;
  periodo: string;
  generado_en: string; // ISO date string
  url_descarga: string | null;
}

export interface EmpresaB2B {
  id: string;
  nombre: string;
  sector: string;
  logo_inicial: string;  // letra o sigla para avatar
  color_accent: string;
  contacto_nombre: string;
  contacto_email: string;
  contacto_cargo: string;
  estudiantes_total: number;
  cursos_activos: number;
  progreso_promedio: number; // 0–100
  inversion_total: number;   // USD
  inicio_contrato: string;   // ISO date string
  cursos: CursoB2B[];
  estudiantes: EstudianteB2B[];
  reportes: ReporteB2B[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Empresa 1 — Armada del Ecuador
// ─────────────────────────────────────────────────────────────────────────────

const ARMADA_ESTUDIANTES: EstudianteB2B[] = [
  {
    id: "arm-001",
    nombre: "Capitán de Fragata Luis Moreno",
    email: "l.moreno@armada.mil.ec",
    cargo: "Oficial de Operaciones",
    ultimo_acceso: "2026-04-26T18:30:00Z",
    progreso: 72,
    sesiones_completadas: 18,
    sesiones_total: 25,
  },
  {
    id: "arm-002",
    nombre: "Teniente de Navío Andrea Vásquez",
    email: "a.vasquez@armada.mil.ec",
    cargo: "Analista de Inteligencia",
    ultimo_acceso: "2026-04-25T20:15:00Z",
    progreso: 88,
    sesiones_completadas: 22,
    sesiones_total: 25,
  },
  {
    id: "arm-003",
    nombre: "Subteniente Marco Páez",
    email: "m.paez@armada.mil.ec",
    cargo: "Oficial Técnico",
    ultimo_acceso: "2026-04-27T07:00:00Z",
    progreso: 56,
    sesiones_completadas: 14,
    sesiones_total: 25,
  },
  {
    id: "arm-004",
    nombre: "Capitán de Corbeta Rosa Intriago",
    email: "r.intriago@armada.mil.ec",
    cargo: "Jefa de Comunicaciones",
    ultimo_acceso: "2026-04-24T19:45:00Z",
    progreso: 64,
    sesiones_completadas: 16,
    sesiones_total: 25,
  },
  {
    id: "arm-005",
    nombre: "Suboficial Mayor José Alvarado",
    email: "j.alvarado@armada.mil.ec",
    cargo: "Especialista en Sistemas",
    ultimo_acceso: "2026-04-26T21:00:00Z",
    progreso: 80,
    sesiones_completadas: 20,
    sesiones_total: 25,
  },
];

const ARMADA_CURSOS: CursoB2B[] = [
  {
    id: "arm-curso-001",
    nombre: "IA Aplicada para Fuerzas Armadas",
    descripcion:
      "Fundamentos de inteligencia artificial, análisis de datos con Python y automatización de procesos operativos para el sector defensa.",
    horas: 40,
    completado_pct: 68,
    instructor: "Héctor Velasco",
    inicio: "2026-03-10T00:00:00Z",
    estado: "activo",
    modulos: 5,
    sesiones: 25,
  },
];

const ARMADA_REPORTES: ReporteB2B[] = [
  {
    id: "arm-rep-001",
    tipo: "mensual",
    titulo: "Reporte Marzo 2026 — Armada del Ecuador",
    periodo: "Marzo 2026",
    generado_en: "2026-04-01T08:00:00Z",
    url_descarga: null,
  },
  {
    id: "arm-rep-002",
    tipo: "mensual",
    titulo: "Reporte Abril 2026 — Armada del Ecuador",
    periodo: "Abril 2026",
    generado_en: "2026-05-01T08:00:00Z",
    url_descarga: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Empresa 2 — IDCE — Julio Cruz
// ─────────────────────────────────────────────────────────────────────────────

const IDCE_ESTUDIANTES: EstudianteB2B[] = [
  {
    id: "idce-001",
    nombre: "Julio Cruz",
    email: "julio.cruz@idce.edu.ec",
    cargo: "Director General",
    ultimo_acceso: "2026-04-27T09:30:00Z",
    progreso: 45,
    sesiones_completadas: 14,
    sesiones_total: 32,
  },
];

const IDCE_CURSOS: CursoB2B[] = [
  {
    id: "idce-curso-001",
    nombre: "Big Data para Gestión Institucional",
    descripcion:
      "Análisis masivo de datos educativos, dashboards ejecutivos con Power BI, modelos predictivos de matrícula y tendencias con Python.",
    horas: 60,
    completado_pct: 45,
    instructor: "Héctor Velasco",
    inicio: "2026-02-17T00:00:00Z",
    estado: "activo",
    modulos: 6,
    sesiones: 32,
  },
];

const IDCE_REPORTES: ReporteB2B[] = [
  {
    id: "idce-rep-001",
    tipo: "mensual",
    titulo: "Reporte Febrero 2026 — IDCE",
    periodo: "Febrero 2026",
    generado_en: "2026-03-01T08:00:00Z",
    url_descarga: null,
  },
  {
    id: "idce-rep-002",
    tipo: "mensual",
    titulo: "Reporte Marzo 2026 — IDCE",
    periodo: "Marzo 2026",
    generado_en: "2026-04-01T08:00:00Z",
    url_descarga: null,
  },
  {
    id: "idce-rep-003",
    tipo: "trimestral",
    titulo: "Reporte Trimestral Q1 2026 — IDCE",
    periodo: "Enero–Marzo 2026",
    generado_en: "2026-04-05T08:00:00Z",
    url_descarga: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Empresa 3 — Demo (placeholder para demos y presentaciones)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_ESTUDIANTES: EstudianteB2B[] = [
  {
    id: "demo-001",
    nombre: "María García",
    email: "m.garcia@empresa-demo.com",
    cargo: "Gerente de Operaciones",
    ultimo_acceso: "2026-04-27T10:00:00Z",
    progreso: 30,
    sesiones_completadas: 5,
    sesiones_total: 16,
  },
  {
    id: "demo-002",
    nombre: "Carlos Rodríguez",
    email: "c.rodriguez@empresa-demo.com",
    cargo: "Analista de Datos",
    ultimo_acceso: "2026-04-26T15:30:00Z",
    progreso: 50,
    sesiones_completadas: 8,
    sesiones_total: 16,
  },
  {
    id: "demo-003",
    nombre: "Ana López",
    email: "a.lopez@empresa-demo.com",
    cargo: "Coordinadora de RRHH",
    ultimo_acceso: "2026-04-25T11:00:00Z",
    progreso: 12,
    sesiones_completadas: 2,
    sesiones_total: 16,
  },
];

const DEMO_CURSOS: CursoB2B[] = [
  {
    id: "demo-curso-001",
    nombre: "Introducción a la IA para Empresas",
    descripcion:
      "Panorama general de la inteligencia artificial, casos de uso empresariales, herramientas sin código y automatización básica de tareas.",
    horas: 8,
    completado_pct: 30,
    instructor: "Por confirmar",
    inicio: "2026-04-01T00:00:00Z",
    estado: "activo",
    modulos: 2,
    sesiones: 16,
  },
];

const DEMO_REPORTES: ReporteB2B[] = [
  {
    id: "demo-rep-001",
    tipo: "mensual",
    titulo: "Reporte Abril 2026 — Empresa Demo",
    periodo: "Abril 2026",
    generado_en: "2026-05-01T08:00:00Z",
    url_descarga: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Exportación principal
// ─────────────────────────────────────────────────────────────────────────────

export const EMPRESAS_B2B_DEMO: EmpresaB2B[] = [
  {
    id: "armada-ecuador",
    nombre: "Armada del Ecuador",
    sector: "Defensa y Seguridad",
    logo_inicial: "AE",
    color_accent: "#1F2F58",
    contacto_nombre: "Capitán de Fragata Luis Moreno",
    contacto_email: "l.moreno@armada.mil.ec",
    contacto_cargo: "Oficial de Operaciones",
    estudiantes_total: 25,
    cursos_activos: 1,
    progreso_promedio: 68,
    inversion_total: 6250,  // 25 estudiantes x $250/persona
    inicio_contrato: "2026-03-01T00:00:00Z",
    cursos: ARMADA_CURSOS,
    estudiantes: ARMADA_ESTUDIANTES,
    reportes: ARMADA_REPORTES,
  },
  {
    id: "idce-julio-cruz",
    nombre: "IDCE — Julio Cruz",
    sector: "Educación Superior",
    logo_inicial: "IDCE",
    color_accent: "#73B8E7",
    contacto_nombre: "Julio Cruz",
    contacto_email: "julio.cruz@idce.edu.ec",
    contacto_cargo: "Director General",
    estudiantes_total: 1,
    cursos_activos: 1,
    progreso_promedio: 45,
    inversion_total: 250,   // 1 estudiante x $250/persona
    inicio_contrato: "2026-02-10T00:00:00Z",
    cursos: IDCE_CURSOS,
    estudiantes: IDCE_ESTUDIANTES,
    reportes: IDCE_REPORTES,
  },
  {
    id: "empresa-demo",
    nombre: "Empresa Demo",
    sector: "Empresa Genérica",
    logo_inicial: "ED",
    color_accent: "#FBBC0C",
    contacto_nombre: "María García",
    contacto_email: "contacto@empresa-demo.com",
    contacto_cargo: "Gerente General",
    estudiantes_total: 10,
    cursos_activos: 1,
    progreso_promedio: 30,
    inversion_total: 2500,  // 10 estudiantes x $250/persona
    inicio_contrato: "2026-04-01T00:00:00Z",
    cursos: DEMO_CURSOS,
    estudiantes: DEMO_ESTUDIANTES,
    reportes: DEMO_REPORTES,
  },
];

/** Busca una empresa por su id. Retorna undefined si no existe. */
export function getEmpresaById(id: string): EmpresaB2B | undefined {
  return EMPRESAS_B2B_DEMO.find((e) => e.id === id);
}

/** Estadísticas agregadas del portfolio B2B completo. */
export const STATS_B2B_GLOBAL = {
  empresas_activas: EMPRESAS_B2B_DEMO.length,
  estudiantes_total: EMPRESAS_B2B_DEMO.reduce((acc, e) => acc + e.estudiantes_total, 0),
  cursos_activos: EMPRESAS_B2B_DEMO.reduce((acc, e) => acc + e.cursos_activos, 0),
  inversion_total: EMPRESAS_B2B_DEMO.reduce((acc, e) => acc + e.inversion_total, 0),
  progreso_promedio: Math.round(
    EMPRESAS_B2B_DEMO.reduce((acc, e) => acc + e.progreso_promedio, 0) /
      EMPRESAS_B2B_DEMO.length
  ),
} as const;
