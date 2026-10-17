// ============================================================
// ITSEIA Academy — PDF Ingestion
// Feature: segundo-cerebro-mvp
//
// Extrae texto de archivos PDF usando pdf-parse.
// Limitado a 50 paginas para evitar procesos muy largos.
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

const MAX_PAGES = 50;

interface PdfResult {
  text: string;
  numPages: number;
  title: string;
}

/**
 * Extrae texto de un buffer de PDF.
 * Retorna el texto limpio, numero de paginas y titulo.
 */
export async function extractTextFromPdf(
  buffer: Buffer
): Promise<PdfResult> {
  const data = await pdfParse(buffer, {
    max: MAX_PAGES, // Limitar paginas procesadas
  });

  // Limpiar texto: remover saltos de linea excesivos
  const cleanText = data.text
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Intentar extraer titulo del metadata o del primer parrafo
  const title =
    data.info?.Title ||
    cleanText.split("\n")[0]?.slice(0, 100) ||
    "Documento PDF";

  return {
    text: cleanText,
    numPages: data.numpages,
    title: typeof title === "string" ? title : "Documento PDF",
  };
}

/**
 * Extrae texto de un PDF dado un File/Blob del formulario.
 */
export async function extractTextFromPdfFile(
  file: File
): Promise<PdfResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return extractTextFromPdf(buffer);
}
