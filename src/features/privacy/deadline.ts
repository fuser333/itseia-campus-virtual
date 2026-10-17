// ============================================
// ITSEIA Academy - Deadline Calculator (LOPDP)
// Plazo legal: 15 dias habiles (Art. 19 LOPDP)
// Feriados Ecuador 2026 hardcodeados
// ============================================

// Feriados nacionales Ecuador 2026 (YYYY-MM-DD)
const FERIADOS_ECUADOR_2026: string[] = [
  "2026-01-01", // Año Nuevo
  "2026-02-16", // Carnaval
  "2026-02-17", // Carnaval
  "2026-04-03", // Viernes Santo
  "2026-05-01", // Dia del Trabajo
  "2026-05-24", // Batalla de Pichincha
  "2026-08-10", // Primer Grito de Independencia
  "2026-10-09", // Independencia de Guayaquil
  "2026-11-02", // Dia de los Difuntos
  "2026-11-03", // Fundacion de Cuenca
  "2026-12-25", // Navidad
];

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // domingo o sabado
}

function isFeriado(date: Date): boolean {
  return FERIADOS_ECUADOR_2026.includes(toDateStr(date));
}

function isHabil(date: Date): boolean {
  return !isWeekend(date) && !isFeriado(date);
}

/**
 * Calcula la fecha limite legal sumando 15 dias habiles
 * excluyendo fines de semana y feriados nacionales de Ecuador.
 */
export function calculateDeadline(requestedAt: Date): Date {
  let diasHabiles = 0;
  const cursor = new Date(requestedAt);

  while (diasHabiles < 15) {
    cursor.setDate(cursor.getDate() + 1);
    if (isHabil(cursor)) {
      diasHabiles++;
    }
  }

  return cursor;
}

/**
 * Retorna los dias habiles restantes desde HOY hasta el plazo legal.
 * Valor negativo indica que el plazo ya vencio.
 */
export function getDaysUntilDeadline(requestedAt: Date): number {
  const deadline = calculateDeadline(requestedAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let days = 0;
  const cursor = new Date(today);

  if (deadline <= today) {
    // Contar dias habiles vencidos (negativo)
    const deadlineCopy = new Date(deadline);
    deadlineCopy.setHours(0, 0, 0, 0);
    let overdueDays = 0;
    const c2 = new Date(deadlineCopy);
    while (c2 < today) {
      c2.setDate(c2.getDate() + 1);
      if (isHabil(c2)) overdueDays++;
    }
    return -overdueDays;
  }

  // Contar dias habiles restantes
  while (cursor < deadline) {
    cursor.setDate(cursor.getDate() + 1);
    if (isHabil(cursor)) {
      days++;
    }
  }

  return days;
}
