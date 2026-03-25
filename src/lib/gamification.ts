// ============================================================
// ITSEIA Academy — XP Gamification System
// Niveles, eventos XP, calculo de progreso
// ============================================================

export const XP_EVENTS = {
  lesson_complete: { xp: 10, label: "Leccion completada" },
  module_complete: { xp: 50, label: "Modulo completado" },
  course_complete: { xp: 200, label: "Curso completado" },
  first_ai_chat: { xp: 20, label: "Primera consulta IA" },
  daily_login: { xp: 5, label: "Login diario" },
  badge_earned: { xp: 15, label: "Insignia desbloqueada" },
} as const;

export type XPEventType = keyof typeof XP_EVENTS;

export interface LevelInfo {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  progress: number;
}

const LEVELS = [
  { level: 1, name: "Aspirante", minXP: 0, maxXP: 499 },
  { level: 2, name: "Practicante", minXP: 500, maxXP: 1999 },
  { level: 3, name: "Especialista", minXP: 2000, maxXP: 4999 },
  { level: 4, name: "Maestro IA", minXP: 5000, maxXP: Infinity },
] as const;

/**
 * Calcula el nivel actual y progreso basado en XP total.
 */
export function getLevelInfo(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    const lvl = LEVELS[i];
    if (xp >= lvl.minXP) {
      const rangeSize =
        lvl.maxXP === Infinity ? 5000 : lvl.maxXP - lvl.minXP + 1;
      const xpInLevel = xp - lvl.minXP;
      const progress =
        lvl.maxXP === Infinity
          ? Math.min((xpInLevel / rangeSize) * 100, 100)
          : Math.min((xpInLevel / rangeSize) * 100, 100);

      return {
        level: lvl.level,
        name: lvl.name,
        minXP: lvl.minXP,
        maxXP: lvl.maxXP === Infinity ? lvl.minXP + 5000 : lvl.maxXP,
        progress: Math.round(progress * 10) / 10,
      };
    }
  }

  // Fallback (should never reach here)
  return {
    level: 1,
    name: "Aspirante",
    minXP: 0,
    maxXP: 499,
    progress: 0,
  };
}

/**
 * Determina si hay un level up al ganar XP.
 */
export function checkLevelUp(
  oldXP: number,
  newXP: number
): { leveledUp: boolean; newLevel?: LevelInfo } {
  const oldLevel = getLevelInfo(oldXP);
  const newLevel = getLevelInfo(newXP);

  if (newLevel.level > oldLevel.level) {
    return { leveledUp: true, newLevel };
  }

  return { leveledUp: false };
}

/**
 * Valida que un string sea un event type valido.
 */
export function isValidXPEvent(event: string): event is XPEventType {
  return event in XP_EVENTS;
}

/**
 * Retorna el icono del nivel.
 */
export function getLevelIcon(level: number): string {
  switch (level) {
    case 1:
      return "\uD83C\uDF31"; // seedling
    case 2:
      return "\uD83D\uDD25"; // fire
    case 3:
      return "\u2B50"; // star
    case 4:
      return "\uD83D\uDC8E"; // gem
    default:
      return "\uD83C\uDF31";
  }
}

/**
 * Retorna el color del nivel (usando paleta ITSEIA).
 */
export function getLevelColor(level: number): string {
  switch (level) {
    case 1:
      return "#73B8E7"; // Light Blue
    case 2:
      return "#FBBC0C"; // Yellow
    case 3:
      return "#F0846D"; // Coral
    case 4:
      return "#FBBC0C"; // Yellow (gold for master)
    default:
      return "#73B8E7";
  }
}
