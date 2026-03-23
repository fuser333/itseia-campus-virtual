// ============================================================
// ITSEIA Academy — Cliente arXiv
// Feature: 004-virtual-library
// API: https://export.arxiv.org/api/query (Atom XML, sin auth)
// Cobertura excelente para IA, ML, Deep Learning
// Parseo manual de Atom XML — sin dependencias adicionales
// ============================================================

import type { PaperResult } from "@/types/database";

/** Extrae el contenido entre dos tags XML (primer match) */
function extractTag(xml: string, tag: string): string {
  const openTag = `<${tag}`;
  const closeTag = `</${tag}>`;

  const start = xml.indexOf(openTag);
  if (start === -1) return "";

  const contentStart = xml.indexOf(">", start) + 1;
  const end = xml.indexOf(closeTag, contentStart);
  if (end === -1) return "";

  return xml.slice(contentStart, end).trim();
}

/** Extrae todos los matches de un tag como array de strings */
function extractAllTags(xml: string, tag: string): string[] {
  const results: string[] = [];
  const openTag = `<${tag}`;
  const closeTag = `</${tag}>`;

  let searchFrom = 0;
  while (true) {
    const start = xml.indexOf(openTag, searchFrom);
    if (start === -1) break;

    const contentStart = xml.indexOf(">", start) + 1;
    const end = xml.indexOf(closeTag, contentStart);
    if (end === -1) break;

    results.push(xml.slice(contentStart, end).trim());
    searchFrom = end + closeTag.length;
  }

  return results;
}

/** Extrae el valor de un atributo de un tag XML */
function extractAttr(xml: string, tag: string, attr: string): string {
  const tagStart = xml.indexOf(`<${tag}`);
  if (tagStart === -1) return "";

  const tagEnd = xml.indexOf(">", tagStart);
  const tagContent = xml.slice(tagStart, tagEnd);

  const attrMatch = tagContent.match(new RegExp(`${attr}="([^"]+)"`));
  return attrMatch?.[1] || "";
}

/** Limpia CDATA y entidades HTML basicas */
function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Divide el XML en bloques <entry>...</entry> */
function splitEntries(xml: string): string[] {
  const entries: string[] = [];
  let searchFrom = 0;

  while (true) {
    const start = xml.indexOf("<entry>", searchFrom);
    if (start === -1) break;

    const end = xml.indexOf("</entry>", start);
    if (end === -1) break;

    entries.push(xml.slice(start, end + "</entry>".length));
    searchFrom = end + "</entry>".length;
  }

  return entries;
}

/**
 * Busca papers en arXiv y normaliza los resultados a PaperResult[].
 * Parsea el XML Atom de forma manual — sin dependencias externas.
 * Timeout de 2.5s.
 */
export async function searchArXiv(
  query: string,
  maxResults = 8
): Promise<PaperResult[]> {
  // arXiv usa sintaxis: all:TERM para busqueda en todos los campos
  const encodedQuery = encodeURIComponent(`all:${query}`);
  const url = `https://export.arxiv.org/api/query?search_query=${encodedQuery}&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/atom+xml" },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const entries = splitEntries(xml);

    return entries.map((entry): PaperResult => {
      // ID de arXiv: http://arxiv.org/abs/2301.12345v1 -> extraer "2301.12345"
      const rawId = extractTag(entry, "id");
      const arxivId = rawId.replace("http://arxiv.org/abs/", "").replace(/v\d+$/, "");

      const title = cleanText(extractTag(entry, "title"));
      const summary = cleanText(extractTag(entry, "summary"));

      // Autores: multiples tags <author><name>...</name></author>
      const authorBlocks = extractAllTags(entry, "author");
      const authors = authorBlocks
        .map((block) => extractTag(block, "name"))
        .filter(Boolean);

      // Fecha: 2023-01-30T00:00:00Z -> year 2023
      const published = extractTag(entry, "published");
      const year = published ? parseInt(published.slice(0, 4), 10) : null;

      // DOI: buscar link con type="text/html" o el link al abs
      const url = rawId || `https://arxiv.org/abs/${arxivId}`;

      // Journal ref (puede no existir)
      const journalRef = extractTag(entry, "arxiv:journal_ref") || null;

      return {
        id: `arxiv_${arxivId}`,
        source: "arxiv",
        title: title || "Sin titulo",
        authors,
        year: isNaN(year as number) ? null : (year as number),
        abstract: summary || null,
        url,
        doi: null, // arXiv no siempre tiene DOI en el XML
        language: "en", // arXiv es predominantemente ingles
        journal: journalRef,
      };
    });
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
