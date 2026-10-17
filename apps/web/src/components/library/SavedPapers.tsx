"use client";

// ============================================================
// ITSEIA Academy — SavedPapers
// Feature: 004-virtual-library
// Lista personal de papers guardados (favoritos del usuario)
// ============================================================

import { useState } from "react";
import {
  Bookmark,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Search,
  BookmarkX,
} from "lucide-react";
import type { SavedPaper } from "@/types/database";

// Etiquetas de fuente para mostrar
const SOURCE_LABELS: Record<string, string> = {
  openalex: "OpenAlex",
  arxiv: "arXiv",
  scielo: "Scielo",
};

const SOURCE_COLORS: Record<string, string> = {
  openalex: "bg-[#1F2F58]/10 text-[#1F2F58] border-[#1F2F58]/20",
  arxiv: "bg-[#73B8E7]/10 text-[#2A6EA6] border-[#73B8E7]/30",
  scielo: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

interface SavedPapersProps {
  papers: SavedPaper[];
  onRemove?: (paper: SavedPaper) => Promise<void>;
}

export default function SavedPapers({ papers, onRemove }: SavedPapersProps) {
  const [filter, setFilter] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtrar por titulo o autores
  const filtered = papers.filter((p) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.authors.toLowerCase().includes(q)
    );
  });

  async function handleRemove(paper: SavedPaper) {
    if (removingId === paper.id) return;
    setRemovingId(paper.id);
    try {
      await onRemove?.(paper);
    } catch {
      // El padre maneja errores con toast
    } finally {
      setRemovingId(null);
    }
  }

  async function handleCopyCitation(paper: SavedPaper) {
    const citation =
      paper.apa_citation ||
      `${paper.authors}. (${paper.year || "s.f."}). ${paper.title}. ${paper.url}`;
    try {
      await navigator.clipboard.writeText(citation);
      setCopiedId(paper.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Silencioso
    }
  }

  function parseAuthors(authorsJson: string): string {
    try {
      const arr = JSON.parse(authorsJson);
      if (Array.isArray(arr)) {
        const first3 = arr.slice(0, 3).join(", ");
        return arr.length > 3 ? first3 + " et al." : first3;
      }
    } catch {
      // Si no es JSON, retornar tal cual (compatibilidad)
    }
    return authorsJson;
  }

  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-14 text-center">
        <Bookmark className="mb-3 size-10 text-gray-300" />
        <p className="text-sm font-medium text-gray-600">
          No tienes papers guardados
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Busca papers y guarda los mas relevantes para tu carrera.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de filtro */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrar por titulo o autores..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1F2F58] focus:ring-2 focus:ring-[#1F2F58]/10 transition-all"
        />
      </div>

      {/* Contador */}
      <p className="text-xs text-gray-500">
        <span className="font-semibold text-gray-700">{filtered.length}</span>{" "}
        de {papers.length} papers guardados
      </p>

      {/* Lista */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-8 text-center">
            <div>
              <BookmarkX className="mx-auto mb-2 size-8 text-gray-300" />
              <p className="text-xs text-gray-500">
                Ninguno coincide con "{filter}"
              </p>
            </div>
          </div>
        ) : (
          filtered.map((paper) => {
            const sourceColor =
              SOURCE_COLORS[paper.source] || SOURCE_COLORS.openalex;
            const sourceLabel =
              SOURCE_LABELS[paper.source] || paper.source;
            const isCopied = copiedId === paper.id;
            const isRemoving = removingId === paper.id;

            return (
              <article
                key={paper.id}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                {/* Header */}
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${sourceColor}`}
                    >
                      {sourceLabel}
                    </span>
                    {paper.year && (
                      <span className="text-xs text-gray-400">{paper.year}</span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Copiar APA */}
                    <button
                      onClick={() => handleCopyCitation(paper)}
                      title="Copiar cita APA"
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                    >
                      {isCopied ? (
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

                    {/* Eliminar */}
                    {onRemove && (
                      <button
                        onClick={() => handleRemove(paper)}
                        disabled={isRemoving}
                        title="Quitar de favoritos"
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                      >
                        <Trash2 className="size-3.5" />
                        <span className="hidden sm:inline">Quitar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Titulo */}
                <h3 className="mb-1 text-sm font-semibold leading-snug text-gray-900 line-clamp-2">
                  {paper.title}
                </h3>

                {/* Autores */}
                {paper.authors && (
                  <p className="text-xs text-gray-500">
                    {parseAuthors(paper.authors)}
                  </p>
                )}

                {/* Abstract preview */}
                {paper.abstract && (
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-2">
                    {paper.abstract}
                  </p>
                )}

                {/* Cita APA condensada */}
                {paper.apa_citation && (
                  <div className="mt-2 rounded-md bg-gray-50 px-2 py-1.5">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                      Cita APA
                    </p>
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                      {paper.apa_citation}
                    </p>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
