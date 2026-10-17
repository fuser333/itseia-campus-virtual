"use client";

// ============================================================
// ITSEIA Academy — Biblioteca Virtual (Pagina Principal)
// Feature: 004-virtual-library
// /biblioteca — busqueda + favoritos con tabs
// ?context=SESSION_CONTEXT — auto-carga sugerencias Gemini
// Cumple Art. 61 RRA 2022
// ============================================================

import { useState, useEffect, useCallback, Suspense } from "react";
import {
  BookOpen,
  Bookmark,
  Search,
  Sparkles,
  Loader2,
  Info,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import LibrarySearch from "@/components/library/LibrarySearch";
import SavedPapers from "@/components/library/SavedPapers";
import type { PaperResult, SavedPaper } from "@/types/database";
import { toast } from "sonner";

type TabId = "search" | "saved";

// ── Inner component que usa useSearchParams (requiere Suspense) ──
function BibliotecaContent() {
  const searchParams = useSearchParams();
  const sessionContext = searchParams.get("context") || "";

  const [activeTab, setActiveTab] = useState<TabId>("search");
  const [savedPapers, setSavedPapers] = useState<SavedPaper[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const loadSaved = useCallback(async () => {
    setSavedLoading(true);
    try {
      const res = await fetch("/api/library/saved");
      if (res.ok) {
        const data = await res.json();
        const papers: SavedPaper[] = data.papers || [];
        setSavedPapers(papers);
        const ids = new Set(
          papers.map((p) => `${p.source}_${p.external_id}`)
        );
        setSavedIds(ids);
      }
    } catch {
      // No bloquear UI si falla
    } finally {
      setSavedLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  async function handleSave(paper: PaperResult) {
    const res = await fetch("/api/library/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paper),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Error al guardar el paper.");
      throw new Error(data.error);
    }

    const data = await res.json();
    if (data.paper) {
      setSavedPapers((prev) => [data.paper, ...prev]);
    }
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.add(`${paper.source}_${paper.id}`);
      return next;
    });

    toast.success("Paper guardado en favoritos.");
  }

  async function handleUnsave(paper: PaperResult) {
    const res = await fetch("/api/library/save", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: paper.source, external_id: paper.id }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Error al eliminar el paper.");
      throw new Error(data.error);
    }

    setSavedPapers((prev) =>
      prev.filter(
        (p) => !(p.source === paper.source && p.external_id === paper.id)
      )
    );
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(`${paper.source}_${paper.id}`);
      return next;
    });

    toast.success("Paper eliminado de favoritos.");
  }

  async function handleRemoveSaved(paper: SavedPaper) {
    const res = await fetch("/api/library/save", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: paper.source, external_id: paper.external_id }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Error al eliminar el paper.");
      throw new Error(data.error);
    }

    setSavedPapers((prev) => prev.filter((p) => p.id !== paper.id));
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(`${paper.source}_${paper.external_id}`);
      return next;
    });

    toast.success("Paper eliminado de favoritos.");
  }

  const tabs = [
    { id: "search" as TabId, label: "Buscar Papers", icon: Search },
    {
      id: "saved" as TabId,
      label: `Favoritos${savedPapers.length > 0 ? ` (${savedPapers.length})` : ""}`,
      icon: Bookmark,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#1F2F58]/[0.08]">
            <BookOpen className="size-5 text-[#1F2F58]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Biblioteca Virtual
            </h1>
            <p className="text-xs text-gray-500">
              Acceso a mas de 250 millones de papers academicos de acceso abierto
            </p>
          </div>
        </div>

        {/* Contexto de sesion activo */}
        {sessionContext && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#73B8E7]/30 bg-[#73B8E7]/5 px-3 py-2">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-[#73B8E7]" />
            <p className="text-xs text-[#1F2F58]">
              Mostrando sugerencias para:{" "}
              <span className="font-semibold">{sessionContext}</span>
            </p>
          </div>
        )}

        {/* Nota de compliance CES */}
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
          <Info className="mt-0.5 size-3.5 shrink-0 text-gray-400" />
          <p className="text-[11px] text-gray-500 leading-relaxed">
            <span className="font-semibold">Art. 61 RRA 2022 —</span> Esta
            biblioteca cumple el requisito de acceso a recursos bibliograficos
            actualizados para modalidad en linea. Fuentes:{" "}
            <span className="font-medium">OpenAlex</span>,{" "}
            <span className="font-medium">arXiv</span> y{" "}
            <span className="font-medium">Scielo</span> (acceso abierto, costo $0).
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-white text-[#1F2F58] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.id === "saved" && savedLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Icon className="size-4" />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "search" && (
        <LibrarySearch
          initialQuery={sessionContext}
          savedIds={savedIds}
          onSave={handleSave}
          onUnsave={handleUnsave}
        />
      )}

      {activeTab === "saved" && (
        <SavedPapers papers={savedPapers} onRemove={handleRemoveSaved} />
      )}
    </div>
  );
}

// ── Loading fallback ──
function BibliotecaLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="size-10 rounded-xl bg-gray-100 animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-5 w-40 rounded bg-gray-100 animate-pulse" />
          <div className="h-3 w-64 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
      <div className="h-10 rounded-xl bg-gray-100 animate-pulse mb-5" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// ── Pagina principal — envuelve en Suspense por useSearchParams ──
export default function BibliotecaPage() {
  return (
    <Suspense fallback={<BibliotecaLoading />}>
      <BibliotecaContent />
    </Suspense>
  );
}
