/**
 * Types del schema YAML de productos · Campus v2 (Opción B).
 *
 * Fuente de verdad: apps/web/src/config/productos/<id>.yaml
 *
 * Estos types deben coincidir EXACTAMENTE con el schema del SPEC §7.
 * Si el YAML agrega un campo nuevo, ESTOS types se actualizan primero.
 */

export type DiaSemana = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export type EstructuraCohorte =
  | 'mensual'
  | 'anual'
  | 'semestral'
  | 'unico'
  | 'por_cliente'
  | 'por_demanda';

export type ModeloPricing =
  | 'pago_unico'
  | 'mensual'
  | 'por_persona'
  | 'a_la_medida'
  | 'gratis';

export type ModoAssignment = 'manual' | 'auto_unico';

/**
 * IDs canónicos de los 8 productos del campus v2.
 * Si agregas producto nuevo, agregar acá Y crear su YAML.
 */
export type ProductoId =
  | 'preuni'
  | 'cursos-pro'
  | 'bootcamp'
  | 'mdt'
  | 'b2b'
  | 'certificaciones'
  | 'carreras'
  | 'demo';

/** Lista exhaustiva en runtime (orden default del sidebar admin). */
export const PRODUCTO_IDS: ProductoId[] = [
  'preuni',
  'cursos-pro',
  'bootcamp',
  'mdt',
  'b2b',
  'certificaciones',
  'carreras',
  'demo',
];

// ─────────────────────────────────────────────────────────────────────────────
// Pestañas (registry de IDs · el render real vive en SessionTabs.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export type PestañaAlumno =
  | 'video_resumen'
  | 'materiales'
  | 'ejercicios'
  | 'evaluacion';

export type PestañaDocente =
  | 'resumen'
  | 'plan_clase'
  | 'materiales_editar'
  | 'ejercicios_editar'
  | 'evaluacion_editar'
  | 'prompts'
  | 'recursos'
  | 'notas_privadas'
  | 'grabaciones';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductoMeta {
  id: ProductoId;
  nombre: string;
  descripcion?: string;
  color_accent: string;
  icono: string;
  url_publica?: string;
}

export interface HorarioDefault {
  inicio_ec: string;       // "17:30"
  fin_ec: string;          // "19:30"
  dias_semana: DiaSemana[];
}

export interface CohorteConfig {
  estructura: EstructuraCohorte;
  duracion_dias: number;
  horario_default: HorarioDefault;
  sesiones_totales: number;
}

export interface AlumnoConfig {
  pestañas_sesion: PestañaAlumno[];
  ai_lab: boolean;
  comunidad: boolean;
  asesorias: boolean;
}

export interface DocenteConfig {
  pestañas_sesion: PestañaDocente[];
  boton_grabar: boolean;
  asistencia: boolean;
}

export interface NivelCursoPro {
  precio_usd: number;
  horas: number;
  sesiones: number;
}

export interface PricingConfig {
  modelo: ModeloPricing;
  precio_usd: number | null;
  moneda: string;                            // 'USD'
  beca_h3l: boolean;
  precio_con_beca_h3l?: number;
  inscripcion_usd?: Record<string, number>;
  cuenta_pago?: string;
  niveles?: Record<string, NivelCursoPro>;   // cursos-pro
  total_semestres?: number;
  carreras_disponibles?: string[];
  certificacion_oficial?: boolean;
  certificador?: string;
  certificadores_partners?: string[];
  total_catalogo?: number;
  factura_empresa?: boolean;
  acceso_publico?: boolean;
}

export interface AssignmentConfig {
  modo: ModoAssignment;
}

export interface CrossPromoConfig {
  excluir_a_si_mismo: boolean;
  orden_otros: ProductoId[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema completo
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductoConfig {
  producto: ProductoMeta;
  cohorte: CohorteConfig;
  alumno: AlumnoConfig;
  docente: DocenteConfig;
  pricing: PricingConfig;
  assignment_docente: AssignmentConfig;
  cross_promo: CrossPromoConfig;
}

/** Guard runtime mínimo para validar que un YAML cargado tiene la forma esperada. */
export function isProductoConfig(value: unknown): value is ProductoConfig {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.producto === 'object' &&
    typeof v.cohorte === 'object' &&
    typeof v.alumno === 'object' &&
    typeof v.docente === 'object' &&
    typeof v.pricing === 'object' &&
    typeof v.assignment_docente === 'object' &&
    typeof v.cross_promo === 'object'
  );
}
