// ============================================================
// ITSEIA Academy — Cliente Scielo
// Feature: 004-virtual-library
// API: https://search.scielo.org/ (fuente latinoamericana)
// Prioridad para terminos en espanol y papers LA
// Timeout agresivo porque la API es inestable
// ============================================================

import type { PaperResult } from "@/types/database";

interface ScieloArticle {
  id?: string;
  ti?: Record<string, string> | string;  // titulo por idioma: { _en: "...", _es: "..." }
  au?: string[];                          // autores
  da?: string;                            // fecha "2022-01-01"
  ab?: Record<string, string> | string;  // abstract por idioma
  doi?: string;
  links?: string[];
  la?: string[];                          // idiomas
  ta?: string;                            // nombre de revista
}

interface ScieloResponse {
  hits?: {
    hits?: Array<{
      _source?: ScieloArticle;
      _id?: string;
    }>;
  };
}

/** Extrae texto de campo que puede ser string o objeto por idioma */
function extractMultiLang(
  field: Record<string, string> | string | undefined | null
): string {
  if (!field) return "";
  if (typeof field === "string") return field;

  // Preferir espanol, luego ingles, luego primer valor disponible
  return field._es || field._en || Object.values(field)[0] || "";
}

/**
 * Busca papers en Scielo y normaliza los resultados a PaperResult[].
 * Timeout de 2.5s — Scielo puede ser lento.
 * Si falla, retorna array vacio (fuente terciaria).
 */
export async function searchScielo(
  query: string,
  count = 8
): Promise<PaperResult[]> {
  // Scielo tiene una API de busqueda JSON no oficial pero funcional
  const params = new URLSearchParams({
    q: query,
    count: String(count),
    output: "json",
    lang: "es,en",
  });

  const url = `https://search.scielo.org/api/v1/article/?${params.toString()}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return [];

    const data: ScieloResponse = await res.json();
    const hits = data?.hits?.hits || [];

    return hits
      .map((hit): PaperResult | null => {
        const article = hit._source;
        if (!article) return null;

        const id = hit._id || article.id || String(Math.random());
        const title = extractMultiLang(article.ti);
        const abstract = extractMultiLang(article.ab);
        const authors = Array.isArray(article.au) ? article.au : [];

        // Año desde fecha "2022-01-01"
        const year = article.da
          ? parseInt(article.da.slice(0, 4), 10)
          : null;

        // URL: preferir DOI, luego primer link
        const paperUrl =
          (article.doi ? `https://doi.org/${article.doi}` : null) ||
          (article.links?.[0] || "") ||
          `https://search.scielo.org/?q=${encodeURIComponent(title)}`;

        const languages = Array.isArray(article.la) ? article.la : [];

        return {
          id: `scielo_${id}`,
          source: "scielo",
          title: title || "Sin titulo",
          authors,
          year: isNaN(year as number) ? null : (year as number),
          abstract: abstract || null,
          url: paperUrl,
          doi: article.doi || null,
          language: languages[0] || null,
          journal: article.ta || null,
        };
      })
      .filter((p): p is PaperResult => p !== null);
  } catch {
    // Scielo es fuente terciaria — fallar silenciosamente
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
