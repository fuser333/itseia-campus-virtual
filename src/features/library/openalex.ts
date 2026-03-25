// ============================================================
// ITSEIA Academy — Cliente OpenAlex
// Feature: 004-virtual-library
// API: https://api.openalex.org/works (sin autenticacion)
// 250M+ papers indexados — fuente primaria
// ============================================================

import type { PaperResult } from "@/types/database";

// OpenAlex retorna el abstract en formato invertido de indice
// Ej: { "neural": [0, 5], "network": [1] } -> reconstruir texto ordenando por posicion
function reconstructAbstract(
  invertedIndex: Record<string, number[]> | null | undefined
): string | null {
  if (!invertedIndex) return null;

  try {
    // Construir array de [posicion, palabra]
    const words: [number, string][] = [];
    for (const [word, positions] of Object.entries(invertedIndex)) {
      for (const pos of positions) {
        words.push([pos, word]);
      }
    }

    if (words.length === 0) return null;

    // Ordenar por posicion y unir
    words.sort((a, b) => a[0] - b[0]);
    return words.map(([, w]) => w).join(" ");
  } catch {
    return null;
  }
}

interface OpenAlexAuthorship {
  author?: {
    display_name?: string;
  };
}

interface OpenAlexWork {
  id?: string;
  title?: string;
  authorships?: OpenAlexAuthorship[];
  publication_year?: number;
  abstract_inverted_index?: Record<string, number[]>;
  doi?: string;
  language?: string;
  primary_location?: {
    source?: {
      display_name?: string;
    };
  };
  open_access?: {
    oa_url?: string;
  };
}

interface OpenAlexResponse {
  results?: OpenAlexWork[];
}

/**
 * Busca papers en OpenAlex y normaliza los resultados a PaperResult[].
 * Timeout de 2.5s para respetar el SLA de la spec.
 */
export async function searchOpenAlex(
  query: string,
  perPage = 15
): Promise<PaperResult[]> {
  const params = new URLSearchParams({
    search: query,
    "per-page": String(perPage),
    select:
      "id,title,authorships,publication_year,abstract_inverted_index,doi,language,primary_location,open_access",
    mailto: "administracion@itseia.ai", // Polite pool de OpenAlex
  });

  const url = `https://api.openalex.org/works?${params.toString()}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }, // Cache 5 minutos en Next.js
    });

    if (!res.ok) return [];

    const data: OpenAlexResponse = await res.json();
    const works = data.results || [];

    return works.map((work): PaperResult => {
      // Extraer autores
      const authors =
        work.authorships
          ?.map((a) => a.author?.display_name || "")
          .filter(Boolean) ?? [];

      // URL: preferir OA url, luego DOI, luego ID de OpenAlex
      const url =
        work.open_access?.oa_url ||
        (work.doi ? `https://doi.org/${work.doi.replace("https://doi.org/", "")}` : null) ||
        work.id ||
        "";

      // ID: usar el final del ID de OpenAlex (ej: W2741809807)
      const id = work.id?.split("/").pop() || work.doi || work.id || String(Math.random());

      return {
        id,
        source: "openalex",
        title: work.title || "Sin titulo",
        authors,
        year: work.publication_year || null,
        abstract: reconstructAbstract(work.abstract_inverted_index),
        url,
        doi: work.doi || null,
        language: work.language || null,
        journal: work.primary_location?.source?.display_name || null,
      };
    });
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
