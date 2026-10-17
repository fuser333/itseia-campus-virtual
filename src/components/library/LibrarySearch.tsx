"use client";

// ============================================================
// ITSEIA Academy — LibrarySearch
// Feature: 004-virtual-library
// Barra de busqueda + resultados + estados de carga + badges
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import { Search, Loader2, AlertTriangle, BookOpen } from "lucide-react";
import PaperCard from "./PaperCard";
import type { PaperResult } from "@/types/database";

interface SearchResponse {
  results: PaperResult[];
  total: number;
  sources_used: string[];
  failed_sources: string[];
  query: string;
}

interface LibrarySearchProps {
  /** Query inicial (puede venir de sugerencias Gemini) */
  initialQuery?: string;
  /** Papers ya guardados por el usuario (para marcar estado) */
  savedIds?: Set<string>;
  onSave?: (paper: PaperResult) => Promise<void>;
  onUnsave?: (paper: PaperResult) => Promise<void>;
}

export default function LibrarySearch({
  initialQuery = "",
  savedIds = new Set(),
  onSave,
  onUnsave,
}: LibrarySearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<PaperResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const [sourcesUsed, setSourcesUsed] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) return;

    setLoading(true);
    setError(null);
    setSearched(false);

    try {
      const res = await fetch(
        `/api/library/search?q=${encodeURIComponent(q.trim())}`,
        { method: "GET" }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al buscar. Intenta de nuevo.");
        return;
      }

      const data: SearchResponse = await res.json();
      setResults(data.results || []);
      setFailedSources(data.failed_sources || []);
      setSourcesUsed(data.sources_used || []);
    } catch {
      setError("Error de red. Verifica tu conexion e intenta de nuevo.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  // Auto-buscar si hay initialQuery
  useEffect(() => {
    if (initialQuery && initialQuery.trim().length >= 2) {
      search(initialQuery);
    }
  }, [initialQuery, search]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      search(query);
    }
  }

  // Construir key unica para saber si un paper esta guardado
  function getSavedKey(paper: PaperResult): string {
    return `${paper.source}_${paper.id}`;
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 size-4 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar papers: ej. redes neuronales convolucionales, NLP..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-28 text-sm text-gray-800 placeholder:text-gray-400 outline-none ring-0 focus:border-[#1F2F58] focus:ring-2 focus:ring-[#1F2F58]/10 transition-all"
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 flex items-center gap-1.5 rounded-lg bg-[#1F2F58] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#2A3F6E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Search className="size-3.5" />
            )}
            Buscar
          </button>
        </div>
      </form>

      {/* Estado de fuentes — advertencia si alguna fallo */}
      {!loading && searched && failedSources.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span>
            La(s) fuente(s){" "}
            <strong>{failedSources.join(", ")}</strong> no respondieron.
            Resultados de:{" "}
            <strong>{sourcesUsed.join(", ") || "ninguna"}</strong>.
          </span>
        </div>
      )}

      {/* Error global */}
      {error && !loading && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertTriangle className="size-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray-100 bg-white p-4"
            >
              <div className="mb-2 flex gap-2">
                <div className="h-4 w-16 rounded-full bg-gray-100" />
                <div className="h-4 w-10 rounded-full bg-gray-100" />
              </div>
              <div className="mb-1.5 h-4 w-3/4 rounded bg-gray-100" />
              <div className="mb-2 h-3 w-1/2 rounded bg-gray-100" />
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-5/6 rounded bg-gray-100" />
                <div className="h-3 w-4/6 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultados */}
      {!loading && searched && results.length > 0 && (
        <div className="space-y-3">
          {/* Cabecera de resultados */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-800">{results.length}</span>{" "}
              papers encontrados
              {sourcesUsed.length > 0 && (
                <span className="ml-1">
                  via{" "}
                  {sourcesUsed.map((s, i) => (
                    <span key={s}>
                      {i > 0 && ", "}
                      <span className="font-medium capitalize">{s}</span>
                    </span>
                  ))}
                </span>
              )}
            </p>
          </div>

          {/* Cards de papers */}
          {results.map((paper) => (
            <PaperCard
              key={`${paper.source}_${paper.id}`}
              paper={paper}
              isSaved={savedIds.has(getSavedKey(paper))}
              onSave={onSave}
              onUnsave={onUnsave}
            />
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {!loading && searched && results.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12 text-center">
          <BookOpen className="mb-3 size-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-600">
            No se encontraron papers para "{query}"
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Intenta con terminos en ingles o mas especificos.
            <br />
            Ejemplo: <span className="font-medium">"machine learning classification"</span>
          </p>
        </div>
      )}

      {/* Estado inicial — antes de buscar */}
      {!loading && !searched && !initialQuery && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12 text-center">
          <Search className="mb-3 size-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-600">
            Busca en mas de 250 millones de papers academicos
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Fuentes: OpenAlex, arXiv, Scielo — acceso abierto, costo $0
          </p>
        </div>
      )}
    </div>
  );
}
