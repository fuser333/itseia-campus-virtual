"use client";

// ============================================================
// ITSEIA Academy — LibrarySuggest
// Feature: 004-virtual-library
// "Papers sugeridos para esta sesion" — auto-fetch via Gemini
// Se muestra en el tab Recursos de las sesiones academicas
// ============================================================

import { useEffect, useState } from "react";
import { Sparkles, Loader2, BookOpen, AlertCircle } from "lucide-react";
import PaperCard from "./PaperCard";
import type { PaperResult } from "@/types/database";

interface SuggestResponse {
  terms: string[];
  primary_query: string;
  results: PaperResult[];
  context: string;
}

interface LibrarySuggestProps {
  /** Titulo de la sesion o contexto para Gemini */
  sessionContext: string;
  /** Papers ya guardados por el usuario */
  savedIds?: Set<string>;
  onSave?: (paper: PaperResult) => Promise<void>;
  onUnsave?: (paper: PaperResult) => Promise<void>;
}

export default function LibrarySuggest({
  sessionContext,
  savedIds = new Set(),
  onSave,
  onUnsave,
}: LibrarySuggestProps) {
  const [loading, setLoading] = useState(true);
  const [papers, setPapers] = useState<PaperResult[]>([]);
  const [terms, setTerms] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!sessionContext || sessionContext.length < 3) {
      setLoading(false);
      return;
    }

    async function fetchSuggestions() {
      try {
        const res = await fetch(
          `/api/library/suggest?context=${encodeURIComponent(sessionContext)}`,
          { method: "GET" }
        );

        if (!res.ok) {
          setError("No se pudieron cargar sugerencias.");
          return;
        }

        const data: SuggestResponse = await res.json();
        setPapers(data.results?.slice(0, 5) || []);
        setTerms(data.terms || []);
      } catch {
        setError("Error de red al cargar sugerencias.");
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [sessionContext]);

  function getSavedKey(paper: PaperResult): string {
    return `${paper.source}_${paper.id}`;
  }

  // No mostrar si esta vacio y no esta cargando
  if (!loading && papers.length === 0 && !error) return null;

  return (
    <div className="rounded-xl border border-[#73B8E7]/20 bg-gradient-to-br from-[#73B8E7]/5 to-[#1F2F58]/5">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#73B8E7]" />
          <span className="text-sm font-semibold text-[#1F2F58]">
            Papers sugeridos por IA para esta sesion
          </span>
          {!loading && papers.length > 0 && (
            <span className="rounded-full bg-[#73B8E7]/15 px-2 py-0.5 text-[10px] font-semibold text-[#1F2F58]">
              {papers.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium text-gray-400">
          {collapsed ? "Mostrar" : "Ocultar"}
        </span>
      </button>

      {/* Terminos generados */}
      {!collapsed && !loading && terms.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
          <span className="text-[10px] text-gray-400">Busqueda generada:</span>
          {terms.map((term) => (
            <span
              key={term}
              className="rounded-full border border-[#73B8E7]/30 bg-white px-2 py-0.5 text-[10px] text-[#1F2F58]"
            >
              {term}
            </span>
          ))}
        </div>
      )}

      {/* Contenido */}
      {!collapsed && (
        <div className="px-4 pb-4">
          {loading && (
            <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
              <Loader2 className="size-4 animate-spin text-[#73B8E7]" />
              Generando sugerencias con IA...
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center gap-2 py-3 text-xs text-red-500">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          {!loading && papers.length > 0 && (
            <div className="space-y-3">
              {papers.map((paper) => (
                <PaperCard
                  key={`${paper.source}_${paper.id}`}
                  paper={paper}
                  isSaved={savedIds.has(getSavedKey(paper))}
                  onSave={onSave}
                  onUnsave={onUnsave}
                />
              ))}

              {/* Link a busqueda completa en biblioteca */}
              <a
                href="/biblioteca"
                className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#73B8E7] hover:text-[#1F2F58] transition-colors"
              >
                <BookOpen className="size-3.5" />
                Buscar mas papers en la Biblioteca Virtual
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
