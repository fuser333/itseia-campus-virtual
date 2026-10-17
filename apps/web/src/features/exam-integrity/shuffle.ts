// ============================================================
// ITSEIA Academy — Shuffle determinista con semilla
// Algoritmo: Fisher-Yates con PRNG mulberry32
// Garantiza reproducibilidad: mismo seed → mismo orden
// ============================================================

/**
 * PRNG mulberry32 — genera valores float en [0, 1) a partir de un seed uint32.
 * Mucho mejor distribucion que Math.random() y es seedable.
 */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0; // uint32
  return function () {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle con PRNG determinista.
 * Retorna una copia del array en orden aleatorio reproducible.
 *
 * @param array  Array original (no se muta)
 * @param seed   Semilla uint32 para el PRNG
 * @returns      Nuevo array shuffleado
 */
export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  const rand = mulberry32(seed);

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/**
 * Convierte un string a un numero uint32 (hash djb2).
 * Util para generar seeds desde strings como userId + quizId.
 */
export function stringToSeed(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // uint32
}
