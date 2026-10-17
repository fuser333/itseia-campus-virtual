"use client";

// ============================================================
// ITSEIA Academy — PaperCard
// Feature: 004-virtual-library
// Card individual de paper academico con acciones save/cite
// ============================================================

import { useState } from "react";
import {
  ExternalLink,
  BookmarkPlus,
  BookmarkCheck,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { PaperResult } from "@/types/database";

// Colores de badge por fuente
const SOURCE_CONFIG = {
  openalex: {
    label: "OpenAlex",
    bg: "bg-[#1F2F58]/10",
    text: "text-[#1F2F58]",
    border: "border-[#1F2F58]/20",
  },
  arxiv: {
    label: "arXiv",
    bg: "bg-[#73B8E7]/10",
    text: "text-[#2A6EA6]",
    border: "border-[#73B8E7]/30",
  },
  scielo: {
    label: "Scielo",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
} as const;

interface PaperCardProps {
  paper: PaperResult;
  /** Si el paper ya esta guardado en favoritos del usuario */
  isSaved?: boolean;
  onSave?: (paper: PaperResult) => Promise<void>;
  onUnsave?: (paper: PaperResult) => Promise<void>;
  /** Cita APA pre-calculada (opcional, se genera si no se pasa) */
  apaCitation?: string;
}

export default function PaperCard({
  paper,
  isSaved = false,
  onSave,
  onUnsave,
  apaCitation,
}: PaperCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedState, setSavedState] = useState(isSaved);

  const sourceConfig = SOURCE_CONFIG[paper.source] || SOURCE_CONFIG.openalex;
  const hasAbstract = !!paper.abstract;
  const abstractTruncated =
    paper.abstract && paper.abstract.length > 300
      ? paper.abstract.slice(0, 300) + "..."
      : paper.abstract;
  const shouldShowExpand =
    hasAbstract && paper.abstract && paper.abstract.length > 300;

  const authorsDisplay =
    paper.authors.length > 3
      ? paper.authors.slice(0, 3).join(", ") + ` et al.`
      : paper.authors.join(", ");

  async function handleSaveToggle() {
    if (saving) return;
    setSaving(true);
    try {
      if (savedState) {
        await onUnsave?.(paper);
        setSavedState(false);
      } else {
        await onSave?.(paper);
        setSavedState(true);
      }
    } catch {
      // El componente padre maneja errores con toast
    } finally {
      setSaving(false);
    }
  }

  async function handleCopyCitation() {
    const citation = apaCitation || buildFallbackApa(paper);
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback si clipboard API no disponible
    }
  }

  return (
    <article className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Header: fuente + año */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${sourceConfig.bg} ${sourceConfig.text} ${sourceConfig.border}`}
          >
            {sourceConfig.label}
          </span>
          {paper.year && (
            <span className="text-xs text-gray-400">{paper.year}</span>
          )}
          {paper.journal && (
            <span className="hidden truncate text-xs text-gray-400 sm:inline max-w-[200px]">
              · {paper.journal}
            </span>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Copiar cita APA */}
          <button
            onClick={handleCopyCitation}
            title="Copiar cita APA"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="hidden sm:inline text-emerald-600">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span className="hidden sm:inline">APA</span>
              </>
            )}
          </button>

          {/* Guardar/desguardar */}
          {(onSave || onUnsave) && (
            <button
              onClick={handleSaveToggle}
              disabled={saving}
              title={savedState ? "Quitar de favoritos" : "Guardar en favoritos"}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                savedState
                  ? "bg-[#FBBC0C]/10 text-[#c99600] hover:bg-[#FBBC0C]/20"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#1F2F58]"
              } disabled:opacity-50`}
            >
              {savedState ? (
                <>
                  <BookmarkCheck className="size-3.5 text-[#FBBC0C]" />
                  <span className="hidden sm:inline">Guardado</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="size-3.5" />
                  <span className="hidden sm:inline">Guardar</span>
                </>
              )}
            </button>
          )}

          {/* Abrir paper */}
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir paper"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#1F2F58] transition-colors hover:bg-[#1F2F58]/5"
          >
            <ExternalLink className="size-3.5" />
            <span className="hidden sm:inline">Abrir</span>
          </a>
        </div>
      </div>

      {/* Titulo */}
      <h3 className="mb-1.5 text-sm font-semibold leading-snug text-gray-900 line-clamp-2">
        {paper.title}
      </h3>

      {/* Autores */}
      {authorsDisplay && (
        <p className="mb-2 text-xs text-gray-500">{authorsDisplay}</p>
      )}

      {/* Abstract */}
      {hasAbstract ? (
        <div>
          <p className="text-xs leading-relaxed text-gray-600">
            {expanded ? paper.abstract : abstractTruncated}
          </p>
          {shouldShowExpand && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 flex items-center gap-0.5 text-[11px] font-medium text-[#73B8E7] hover:text-[#1F2F58] transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="size-3" />
                  Ver menos
                </>
              ) : (
                <>
                  <ChevronDown className="size-3" />
                  Ver mas
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <p className="text-xs italic text-gray-400">
          Resumen no disponible — ver texto completo.
        </p>
      )}
    </article>
  );
}

/** Genera una cita APA basica si no se pasa apaCitation prop */
function buildFallbackApa(paper: PaperResult): string {
  const authors =
    paper.authors.length > 0 ? paper.authors.slice(0, 3).join(", ") : "Autor desconocido";
  const year = paper.year ? `(${paper.year})` : "(s.f.)";
  const url = paper.doi
    ? `https://doi.org/${paper.doi.replace(/^https?:\/\/doi\.org\//i, "")}`
    : paper.url;
  return `${authors}. ${year}. ${paper.title}. ${url}`;
}
