// ============================================================
// ITSEIA Academy — Merge y deduplicacion de resultados
// Feature: 004-virtual-library
// Combina OpenAlex + arXiv + Scielo, deduplica por DOI
// ============================================================

import type { PaperResult } from "@/types/database";

/**
 * Normaliza un DOI para comparacion:
 * - Quita prefijo https://doi.org/
 * - Lowercase
 */
function normalizeDoi(doi: string | null | undefined): string | null {
  if (!doi) return null;
  return doi
    .replace(/^https?:\/\/doi\.org\//i, "")
    .toLowerCase()
    .trim();
}

/**
 * Normaliza un titulo para comparacion aproximada:
 * - Lowercase, quita puntuacion, colapsa espacios
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Combina resultados de multiples fuentes, elimina duplicados y ordena.
 * Prioridad de fuentes: OpenAlex > arXiv > Scielo
 * Deduplicacion: por DOI (exacto) o titulo normalizado (aproximado)
 */
export function mergeResults(
  openalexResults: PaperResult[],
  arxivResults: PaperResult[],
  scieloResults: PaperResult[]
): PaperResult[] {
  // Prioridad: OpenAlex primero, arXiv segundo, Scielo tercero
  const allResults = [...openalexResults, ...arxivResults, ...scieloResults];

  const seenDois = new Set<string>();
  const seenTitles = new Set<string>();
  const merged: PaperResult[] = [];

  for (const paper of allResults) {
    const doi = normalizeDoi(paper.doi);
    const titleNorm = normalizeTitle(paper.title);

    // Deduplicar por DOI si existe
    if (doi) {
      if (seenDois.has(doi)) continue;
      seenDois.add(doi);
    }

    // Deduplicar por titulo normalizado (captura duplicados sin DOI)
    if (seenTitles.has(titleNorm)) continue;
    seenTitles.add(titleNorm);

    merged.push(paper);
  }

  // Ordenar: papers con abstract primero, luego por ano descendente
  merged.sort((a, b) => {
    const aHasAbstract = a.abstract ? 1 : 0;
    const bHasAbstract = b.abstract ? 1 : 0;

    if (bHasAbstract !== aHasAbstract) return bHasAbstract - aHasAbstract;

    const aYear = a.year || 0;
    const bYear = b.year || 0;
    return bYear - aYear;
  });

  return merged;
}
