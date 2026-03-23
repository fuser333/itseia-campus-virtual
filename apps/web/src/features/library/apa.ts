// ============================================================
// ITSEIA Academy — Generador de citas APA 7ma edicion
// Feature: 004-virtual-library
// Genera la cita a partir de los metadatos del PaperResult
// ============================================================

import type { PaperResult } from "@/types/database";

/**
 * Formatea un nombre de autor al formato APA: "Apellido, I."
 * Si el nombre ya tiene coma (Apellido, Nombre), lo deja como esta.
 * Si el nombre es simple (sin coma), asume que el ultimo token es el apellido.
 */
function formatAuthorApa(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "";

  // Si ya tiene formato "Apellido, Nombre"
  if (trimmed.includes(",")) {
    const [apellido, rest] = trimmed.split(",").map((s) => s.trim());
    // Construir iniciales del resto
    const initials = rest
      .split(/\s+/)
      .map((n) => n.charAt(0).toUpperCase() + ".")
      .join(" ");
    return `${apellido}, ${initials}`;
  }

  // Formato "Nombre Apellido" o "Nombre Segundo Apellido"
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0];

  const apellido = parts[parts.length - 1];
  const initials = parts
    .slice(0, -1)
    .map((n) => n.charAt(0).toUpperCase() + ".")
    .join(" ");

  return `${apellido}, ${initials}`;
}

/**
 * Genera una cita en formato APA 7ma edicion.
 *
 * Formato general para articulo de revista:
 * Apellido, I., & Apellido2, I2. (Año). Titulo del articulo.
 * Nombre de la Revista. https://doi.org/xxxxx
 *
 * Si faltan datos, se omiten elegantemente.
 */
export function generateApa(paper: PaperResult): string {
  const parts: string[] = [];

  // ── Autores ──
  if (paper.authors.length > 0) {
    const formatted = paper.authors.map(formatAuthorApa).filter(Boolean);

    let authorStr = "";
    if (formatted.length === 1) {
      authorStr = formatted[0];
    } else if (formatted.length === 2) {
      authorStr = `${formatted[0]}, & ${formatted[1]}`;
    } else if (formatted.length <= 20) {
      // Hasta 20 autores: todos con & antes del ultimo
      const allButLast = formatted.slice(0, -1).join(", ");
      authorStr = `${allButLast}, & ${formatted[formatted.length - 1]}`;
    } else {
      // Mas de 20: primeros 19 + "..." + ultimo
      const first19 = formatted.slice(0, 19).join(", ");
      const last = formatted[formatted.length - 1];
      authorStr = `${first19}, ... ${last}`;
    }

    if (authorStr) parts.push(authorStr);
  }

  // ── Año ──
  if (paper.year) {
    parts.push(`(${paper.year})`);
  } else {
    parts.push("(s.f.)"); // sin fecha
  }

  // ── Titulo ──
  // En APA 7, el titulo del articulo va en cursiva implicita (no en cursiva en texto plano)
  const title = paper.title || "Sin titulo";
  parts.push(title + ".");

  // ── Revista / fuente ──
  if (paper.journal) {
    parts.push(`*${paper.journal}*`);
  }

  // ── DOI o URL ──
  const doiOrUrl =
    paper.doi
      ? `https://doi.org/${paper.doi.replace(/^https?:\/\/doi\.org\//i, "")}`
      : paper.url;

  if (doiOrUrl) {
    parts.push(doiOrUrl);
  }

  return parts.join(". ").replace(/\.\./g, ".").trim();
}
