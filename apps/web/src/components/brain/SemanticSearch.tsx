"use client";

// ============================================================
// ITSEIA Academy — SemanticSearch (Segundo Cerebro)
// Feature: segundo-cerebro-mvp
//
// Barra de busqueda semantica. Busca por significado,
// no por keywords exactas.
// ============================================================

import { useState, useCallback } from "react";
import { Search, Loader2, FileText, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SemanticSearchResult } from "@/types/brain";

interface SemanticSearchProps {
  onSelectResult?: (result: SemanticSearchResult) => void;
  className?: string;
}

export default function SemanticSearch({
  onSelectResult,
  className,
}: SemanticSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = useCallback(async () => {
    if (query.trim().length < 3) {
      setError("Escribe al menos 3 caracteres");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch("/api/brain/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), limit: 15 }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error en busqueda");
        setResults([]);
        return;
      }

      setResults(data.results || []);
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  }, [query]);

  function clearSearch() {
    setQuery("");
    setResults([]);
    setSearched(false);
    setError("");
  }

  function similarityLabel(sim: number): {
    text: string;
    color: string;
  } {
    if (sim >= 0.8)
      return { text: "Muy relevante", color: "text-green-400" };
    if (sim >= 0.65)
      return { text: "Relevante", color: "text-[#FBBC0C]" };
    return { text: "Parcial", color: "text-gray-500" };
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Barra de busqueda */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Busca por significado... ej: 'que se sobre redes neuronales'"
              className="w-full bg-[#0A1628]/60 border border-[#1F2F58]/50 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FBBC0C]/50"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || query.trim().length < 3}
            className="flex items-center gap-1 px-3 py-2 bg-[#FBBC0C] text-[#0A1628] rounded-lg text-xs font-semibold hover:bg-[#FBBC0C]/90 disabled:opacity-50 transition-all whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            Buscar
          </button>
        </div>
        <p className="text-[9px] text-gray-600 mt-1 px-1">
          Busqueda semantica — encuentra por significado, no por palabras exactas
        </p>
      </div>

      {error && (
        <p className="text-[11px] text-[#F0846D]">{error}</p>
      )}

      {/* Resultados */}
      {searched && !loading && results.length === 0 && (
        <div className="text-center py-6">
          <Search className="w-6 h-6 text-gray-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500">
            No se encontraron resultados para &quot;{query}&quot;
          </p>
          <p className="text-[10px] text-gray-600 mt-1">
            Intenta con diferentes palabras o agrega mas notas a tu cerebro
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
            {results.length} resultado{results.length !== 1 ? "s" : ""}
          </p>
          {results.map((result) => {
            const sim = similarityLabel(result.similarity);
            return (
              <button
                key={result.id}
                onClick={() => onSelectResult?.(result)}
                className="text-left bg-[#0A1628]/40 border border-[#1F2F58]/30 rounded-lg p-3 hover:border-[#1F2F58]/60 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText className="w-3 h-3 text-gray-500 shrink-0" />
                    <h4 className="text-xs font-medium text-white truncate">
                      {result.title}
                    </h4>
                  </div>
                  <span className={cn("text-[9px] shrink-0", sim.color)}>
                    {sim.text} ({Math.round(result.similarity * 100)}%)
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 ml-4">
                  {result.content.slice(0, 200)}
                </p>
                {result.source_type && (
                  <span className="inline-block text-[9px] px-1.5 py-0.5 bg-[#1F2F58]/30 text-[#73B8E7] rounded-full mt-1.5 ml-4">
                    {result.source_type}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
