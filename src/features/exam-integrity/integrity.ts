// ============================================================
// ITSEIA Academy — Calculo de Integrity Score
// Ejecutado en el servidor al guardar un intento de quiz
// Score: 1.00 (perfecto) hasta 0.00 (muy sospechoso)
// ============================================================

export interface IntegrityMetrics {
  tabSwitches: number;
  timePerQuestion: Record<string, number>; // question_id -> segundos
  totalQuestions: number;
}

/**
 * Calcula el puntaje de integridad de un intento.
 *
 * Penalizaciones:
 * - Cada cambio de pestaña:                     -0.10 (max -0.50)
 * - Mas del 50% de preguntas respondidas en < 3s: -0.20
 * - Tiempo total demasiado rapido (< 5s total):   -0.30
 *
 * @returns Numero entre 0.00 y 1.00
 */
export function calculateIntegrityScore(metrics: IntegrityMetrics): number {
  let score = 1.0;

  const { tabSwitches, timePerQuestion, totalQuestions } = metrics;

  // Penalidad por cambios de pestaña (hasta -0.50)
  const tabPenalty = Math.min(tabSwitches * 0.1, 0.5);
  score -= tabPenalty;

  const times = Object.values(timePerQuestion);
  const answeredCount = times.length;

  if (answeredCount > 0) {
    // Penalidad por velocidad sospechosa (< 3s por pregunta)
    const fastAnswers = times.filter((t) => t < 3).length;
    if (fastAnswers / answeredCount > 0.5) {
      score -= 0.2;
    }

    // Penalidad por tiempo total ridiculamente corto
    const totalTime = times.reduce((a, b) => a + b, 0);
    const expectedMinTime = totalQuestions * 5; // minimo esperado: 5s por pregunta
    if (totalTime < expectedMinTime * 0.3) {
      score -= 0.3;
    }
  }

  // Clamp entre 0 y 1, redondear a 2 decimales
  return Math.round(Math.max(0, Math.min(1, score)) * 100) / 100;
}

/**
 * Genera array de flags descriptivos para el reporte de integridad.
 */
export function generateSuspiciousFlags(metrics: IntegrityMetrics): string[] {
  const flags: string[] = [];

  if (metrics.tabSwitches >= 3) {
    flags.push(`Multiples salidas de ventana detectadas (${metrics.tabSwitches})`);
  } else if (metrics.tabSwitches >= 1) {
    flags.push(`Salida de ventana detectada (${metrics.tabSwitches})`);
  }

  const times = Object.values(metrics.timePerQuestion);
  if (times.length > 0) {
    const fastAnswers = times.filter((t) => t < 3).length;
    if (fastAnswers > 0) {
      flags.push(`${fastAnswers} pregunta(s) respondida(s) en menos de 3 segundos`);
    }

    const totalTime = times.reduce((a, b) => a + b, 0);
    if (totalTime < metrics.totalQuestions * 5 * 0.3) {
      flags.push("Tiempo total de respuesta inusualmente rapido");
    }
  }

  return flags;
}

/**
 * Calcula similitud Jaccard entre dos vectores de respuestas.
 * Usado para detectar posible copia entre intentos.
 *
 * @param answersA Record<questionId, selectedIndex>
 * @param answersB Record<questionId, selectedIndex>
 * @returns Valor entre 0 (sin similitud) y 1 (identicos)
 */
export function jaccardSimilarity(
  answersA: Record<string, number>,
  answersB: Record<string, number>
): number {
  const setA = new Set(
    Object.entries(answersA).map(([q, a]) => `${q}:${a}`)
  );
  const setB = new Set(
    Object.entries(answersB).map(([q, a]) => `${q}:${a}`)
  );

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 1 : intersection / union;
}
