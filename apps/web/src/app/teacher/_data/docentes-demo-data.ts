// ─────────────────────────────────────────────────────────────────────────────
// ITSEIA Academy — Datos demo para el módulo Teacher
// Uso: seeds visuales, pruebas de UI y presentaciones cuando Supabase
//      aún no tiene registros cargados.
// ─────────────────────────────────────────────────────────────────────────────

export interface MateriaDocente {
  id: string;
  code: string;
  nombre: string;
  carrera: string;
  periodo: number;         // semestre 1–6
  horas_docencia: number;
  horas_practica: number;
  horas_total: number;
  sesiones_total: number;
  estudiantes_activos: number;
  progreso_promedio: number; // 0–100
  entregas_pendientes: number;
}

export interface DisponibilidadTutoria {
  dia: string;
  hora: string;
  disponible: boolean;
}

export interface DocenteDemo {
  id: string;
  nombre_completo: string;
  email: string;
  cargo: string;
  bio_corta: string;
  foto_url: string | null;
  materias: MateriaDocente[];
  disponibilidad_tutorias: DisponibilidadTutoria[];
  horas_capacitacion_completadas: number;
  horas_capacitacion_total: number;
  tiene_certificado_ces: boolean;
  stats: {
    materias_asignadas: number;
    estudiantes_total: number;
    entregas_pendientes: number;
    sesiones_publicadas: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Materias demo asignadas a Héctor Velasco
// Carrera 1: IA Aplicada / Carrera 2: Ciencia de Datos / Carrera 3: Big Data
// ─────────────────────────────────────────────────────────────────────────────

const MATERIAS_HECTOR: MateriaDocente[] = [
  // ── Carrera: Ingeniería en IA ──────────────────────────────────────────────
  {
    id: "mat-ia-001",
    code: "IA-101",
    nombre: "Fundamentos de Inteligencia Artificial",
    carrera: "Ingeniería en IA Aplicada",
    periodo: 1,
    horas_docencia: 32,
    horas_practica: 64,
    horas_total: 96,
    sesiones_total: 16,
    estudiantes_activos: 18,
    progreso_promedio: 62,
    entregas_pendientes: 3,
  },
  // ── Carrera: Ciencia de Datos ──────────────────────────────────────────────
  {
    id: "mat-cd-001",
    code: "CD-201",
    nombre: "Python para Ciencia de Datos",
    carrera: "Ciencia de Datos",
    periodo: 2,
    horas_docencia: 32,
    horas_practica: 64,
    horas_total: 96,
    sesiones_total: 16,
    estudiantes_activos: 12,
    progreso_promedio: 48,
    entregas_pendientes: 5,
  },
  // ── Carrera: Big Data ──────────────────────────────────────────────────────
  {
    id: "mat-bd-001",
    code: "BD-301",
    nombre: "Arquitecturas de Big Data",
    carrera: "Big Data e Ingeniería de Datos",
    periodo: 3,
    horas_docencia: 32,
    horas_practica: 64,
    horas_total: 96,
    sesiones_total: 16,
    estudiantes_activos: 9,
    progreso_promedio: 35,
    entregas_pendientes: 2,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Docente principal — Héctor Velasco
// ─────────────────────────────────────────────────────────────────────────────

export const DOCENTE_HECTOR_VELASCO: DocenteDemo = {
  id: "docente-hector-velasco",
  nombre_completo: "Héctor Velasco Alvarez",
  email: "hector@itseia.ai",
  cargo: "Fundador y Docente Principal",
  bio_corta:
    "MBA por Silicon Valley, +1.500 horas estudiando IA, 20 años emprendiendo. " +
    "Fundador de H3L, ImagemIA, Strata e ITSEIA. Autor de 'El Emprendedor Ecuatoriano'.",
  foto_url: null,
  materias: MATERIAS_HECTOR,
  disponibilidad_tutorias: [
    { dia: "Lunes",    hora: "15:00 – 17:00", disponible: true  },
    { dia: "Miércoles", hora: "15:00 – 17:00", disponible: true  },
    { dia: "Viernes",  hora: "15:00 – 17:00", disponible: true  },
    { dia: "Sábado",   hora: "10:00 – 12:00", disponible: false },
  ],
  horas_capacitacion_completadas: 85,
  horas_capacitacion_total: 120,
  tiene_certificado_ces: false,
  stats: {
    materias_asignadas: MATERIAS_HECTOR.length,
    estudiantes_total: MATERIAS_HECTOR.reduce(
      (acc, m) => acc + m.estudiantes_activos,
      0
    ),
    entregas_pendientes: MATERIAS_HECTOR.reduce(
      (acc, m) => acc + m.entregas_pendientes,
      0
    ),
    sesiones_publicadas: MATERIAS_HECTOR.reduce(
      (acc, m) => acc + m.sesiones_total,
      0
    ),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Exportación general (array para cuando hay múltiples docentes)
// ─────────────────────────────────────────────────────────────────────────────

export const DOCENTES_DEMO: DocenteDemo[] = [DOCENTE_HECTOR_VELASCO];

/** Busca un docente demo por su id. Retorna undefined si no existe. */
export function getDocenteById(id: string): DocenteDemo | undefined {
  return DOCENTES_DEMO.find((d) => d.id === id);
}
