// ============================================================
// ITSEIA Academy — URL Content Ingestion
// Feature: segundo-cerebro-mvp
//
// Scrapes texto de URLs usando fetch + parsing HTML basico.
// No dependencia externa — usa solo APIs nativas.
// ============================================================

interface UrlResult {
  text: string;
  title: string;
  url: string;
}

/**
 * Extrae el contenido de texto de una URL.
 * Hace fetch, limpia HTML tags, y retorna texto limpio.
 */
export async function extractTextFromUrl(url: string): Promise<UrlResult> {
  // Validar URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("URL invalida: " + url);
  }

  // Fetch el contenido
  const response = await fetch(parsedUrl.href, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ITSEIA-Brain/1.0; +https://itseia.ai)",
      Accept: "text/html,application/xhtml+xml,text/plain",
    },
    signal: AbortSignal.timeout(15000), // 15s timeout
  });

  if (!response.ok) {
    throw new Error(
      `Error obteniendo URL: ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();

  // Extraer titulo
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : parsedUrl.hostname;

  // Limpiar HTML → texto plano
  const text = htmlToText(html);

  if (!text || text.length < 50) {
    throw new Error("No se pudo extraer suficiente texto de la URL");
  }

  return {
    text,
    title,
    url: parsedUrl.href,
  };
}

/**
 * Convierte HTML a texto plano removiendo tags,
 * scripts, styles, y normalizando espacios.
 */
function htmlToText(html: string): string {
  let text = html;

  // Remover scripts y styles completamente
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");

  // Remover nav, header, footer (generalmente no son contenido)
  text = text.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");

  // Convertir <br>, <p>, <div>, <h*>, <li> a saltos de linea
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, "\n\n");
  text = text.replace(/<(p|div|h[1-6]|li|tr|blockquote)[^>]*>/gi, "");

  // Remover todas las tags HTML restantes
  text = text.replace(/<[^>]+>/g, "");

  // Decodificar entidades HTML comunes
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Normalizar espacios y lineas vacias
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  // Limitar a ~50K caracteres (aprox 12K tokens)
  if (text.length > 50000) {
    text = text.slice(0, 50000);
  }

  return text;
}
