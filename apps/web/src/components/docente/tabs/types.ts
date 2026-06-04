/**
 * Tipos compartidos por las pestañas docente · Campus v2 (FASE 3).
 */

export interface SesionDocenteData {
  numero: number;
  titulo: string;
  fecha_programada?: string | null;
  duracion_minutos?: number;
  meet_url?: string | null;
  recording_url?: string | null;
  status?: string;
  contenido_path?: string | null;
}

export interface TabDocenteProps {
  sesionData: SesionDocenteData;
  /** ID del producto (para CSS var accent). */
  producto: string;
  /** Slug de cohorte (para keys de API). */
  cohorteSlug: string;
}
