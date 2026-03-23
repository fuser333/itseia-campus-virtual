// ============================================================
// ITSEIA Academy — Clasificacion de presencia en clases sincronicas
// Feature: 007-attendance-tracking
//
// Reglas (FR-004):
//   >= 60% de duracion planificada  → present
//   >= 10% de duracion planificada  → partial
//   <  10% de duracion planificada  → absent
//
// Default institucional: 90 minutos (5400 segundos) si la duracion
// planificada no esta registrada en la BD.
// ============================================================

import type { AttendanceStatus } from "@/types/database";

/** Duracion institucional default si planned_duration_minutes es null (90 min) */
const DEFAULT_PLANNED_SECONDS = 5400;

const THRESHOLD_PRESENT = 0.6;
const THRESHOLD_PARTIAL  = 0.1;

/**
 * Clasifica la presencia de un estudiante en una sesion sincronica.
 *
 * @param durationSeconds       Segundos totales que el estudiante estuvo en la sala
 * @param plannedDurationSeconds Duracion planificada de la clase en segundos.
 *                               Si es null/0 se usa el default institucional de 5400s.
 * @returns AttendanceStatus: 'present' | 'partial' | 'absent'
 */
export function classifyAttendance(
  durationSeconds: number,
  plannedDurationSeconds: number | null | undefined
): AttendanceStatus {
  const planned = plannedDurationSeconds && plannedDurationSeconds > 0
    ? plannedDurationSeconds
    : DEFAULT_PLANNED_SECONDS;

  const ratio = durationSeconds / planned;

  if (ratio >= THRESHOLD_PRESENT) return "present";
  if (ratio >= THRESHOLD_PARTIAL) return "partial";
  return "absent";
}

/**
 * Convierte minutos planificados a segundos para uso con classifyAttendance.
 */
export function minutesToSeconds(minutes: number | null | undefined): number {
  if (!minutes || minutes <= 0) return DEFAULT_PLANNED_SECONDS;
  return minutes * 60;
}
