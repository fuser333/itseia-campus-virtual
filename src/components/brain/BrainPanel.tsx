"use client";

// ============================================================
// ITSEIA Academy — BrainPanel (Segundo Cerebro)
// Feature: segundo-cerebro-mvp
//
// Panel principal del Segundo Cerebro. Se integra como tab
// en el AI Lab. Contiene 4 sub-secciones:
// - Mis Notas: crear/editar/listar notas
// - Agregar Fuente: ingestar PDF/URL/YouTube
// - Delta (Lo Nuevo): comparacion con IA
// - Material de Estudio: flashcards/resumenes/quizzes
// - Busqueda Semantica: buscar por significado
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  Brain,
  FileText,
  Upload,
  Zap,
  BookOpen,
  Search,
  Plus,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NoteEditor from "./NoteEditor";
import NoteList from "./NoteList";
import SourceIngester from "./SourceIngester";
import DeltaViewer from "./DeltaViewer";
import StudyMaterialGenerator from "./StudyMaterialGenerator";
import SemanticSearch from "./SemanticSearch";
import type { BrainNote } from "@/types/brain";

type BrainSection =
  | "notas"
  | "fuente"
  | "delta"
  | "material"
  | "buscar";

interface BrainPanelProps {
  sessionContext?: string;
  sessionId?: string;
  sessionTitle?: string;
  className?: string;
}

const SECTIONS: {
  id: BrainSection;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "notas",
    label: "Mis Notas",
    icon: <FileText className="w-3 h-3" />,
  },
  {
    id: "fuente",
    label: "Agregar Fuente",
    icon: <Upload className="w-3 h-3" />,
  },
  {
    id: "delta",
    label: "Lo Nuevo",
    icon: <Zap className="w-3 h-3" />,
  },
  {
    id: "material",
    label: "Material",
    icon: <BookOpen className="w-3 h-3" />,
  },
  {
    id: "buscar",
    label: "Buscar",
    icon: <Search className="w-3 h-3" />,
  },
];

export default function BrainPanel({
  sessionId,
  sessionTitle,
  className,
}: BrainPanelProps) {
  const [activeSection, setActiveSection] = useState<BrainSection>("notas");
  const [notes, setNotes] = useState<BrainNote[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [editingNote, setEditingNote] = useState<BrainNote | null>(null);
  const [creatingNote, setCreatingNote] = useState(false);
  const [lastSourceId, setLastSourceId] = useState<string | null>(null);
  const [lastSourceContent, setLastSourceContent] = useState<string | null>(null);

  // Cargar notas al montar
  const fetchNotes = useCallback(async () => {
    setLoadingNotes(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (sessionId) params.set("session_id", sessionId);

      const res = await fetch(`/api/brain/notes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (err) {
      console.error("[BrainPanel] Error cargando notas:", err);
    } finally {
      setLoadingNotes(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Guardar nota (crear o actualizar)
  async function handleSaveNote(note: {
    id?: string;
    title: string;
    content: string;
    tags: string[];
  }) {
    const isUpdate = !!note.id;
    const method = isUpdate ? "PUT" : "POST";

    const body: Record<string, unknown> = {
      title: note.title,
      content: note.content,
      tags: note.tags,
    };
    if (isUpdate) body.id = note.id;
    if (!isUpdate && sessionId) body.session_id = sessionId;

    const res = await fetch("/api/brain/notes", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error guardando nota");
    }

    // Refrescar la lista
    await fetchNotes();
    setEditingNote(null);
    setCreatingNote(false);
  }

  // Eliminar nota
  async function handleDeleteNote(noteId: string) {
    const res = await fetch(`/api/brain/notes?id=${noteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
  }

  // Cuando se ingesta una nueva fuente
  function handleSourceIngested(source: {
    id: string;
    title: string;
    source_type: string;
  }) {
    setLastSourceId(source.id);
    setLastSourceContent(null);
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="bg-[#0A1628]/80 px-3 py-2 border-b border-[#1F2F58]/30">
        <div className="flex items-center gap-1.5">
          <Brain className="w-4 h-4 text-[#FBBC0C]" />
          <span className="text-[11px] font-semibold text-[#FBBC0C] uppercase tracking-wider">
            Segundo Cerebro
          </span>
          {sessionTitle && (
            <span className="text-[9px] text-gray-600 ml-2 truncate">
              {sessionTitle}
            </span>
          )}
          <span className="text-[9px] text-gray-600 ml-auto">
            {notes.length} nota{notes.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Navegacion de secciones */}
      <div className="flex items-center gap-1 px-3 py-2 bg-[#0A1628]/50 border-b border-[#1F2F58]/20 overflow-x-auto scrollbar-hide">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSection(section.id);
              setEditingNote(null);
              setCreatingNote(false);
            }}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap",
              activeSection === section.id
                ? "bg-[#1F2F58]/50 text-white"
                : "text-gray-500 hover:text-gray-300 hover:bg-[#1F2F58]/20"
            )}
          >
            <span
              className={
                activeSection === section.id
                  ? "text-[#FBBC0C]"
                  : "text-gray-600"
              }
            >
              {section.icon}
            </span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        {/* ── SECCION: Mis Notas ── */}
        {activeSection === "notas" && (
          <>
            {editingNote ? (
              <div>
                <button
                  onClick={() => setEditingNote(null)}
                  className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 mb-3"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Volver a la lista
                </button>
                <NoteEditor
                  noteId={editingNote.id}
                  initialTitle={editingNote.title}
                  initialContent={editingNote.content}
                  initialTags={editingNote.tags}
                  sessionId={sessionId}
                  onSave={handleSaveNote}
                  onCancel={() => setEditingNote(null)}
                />
              </div>
            ) : creatingNote ? (
              <div>
                <button
                  onClick={() => setCreatingNote(false)}
                  className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 mb-3"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Volver a la lista
                </button>
                <NoteEditor
                  sessionId={sessionId}
                  onSave={handleSaveNote}
                  onCancel={() => setCreatingNote(false)}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setCreatingNote(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#FBBC0C] text-[#0A1628] rounded-lg text-xs font-semibold hover:bg-[#FBBC0C]/90 transition-all self-start"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nueva nota
                </button>
                <NoteList
                  notes={notes}
                  loading={loadingNotes}
                  onEdit={setEditingNote}
                  onDelete={handleDeleteNote}
                />
              </div>
            )}
          </>
        )}

        {/* ── SECCION: Agregar Fuente ── */}
        {activeSection === "fuente" && (
          <SourceIngester onIngested={handleSourceIngested} />
        )}

        {/* ── SECCION: Delta (Lo Nuevo) ── */}
        {activeSection === "delta" && (
          <div className="flex flex-col gap-4">
            {lastSourceId ? (
              <DeltaViewer sourceId={lastSourceId} />
            ) : lastSourceContent ? (
              <DeltaViewer content={lastSourceContent} />
            ) : (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <Zap className="w-8 h-8 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-400">
                    Primero agrega una fuente
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Ve a &quot;Agregar Fuente&quot; para ingestar un URL, video de YouTube,
                    o PDF. Luego vuelve aqui para ver la comparacion delta.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection("fuente")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#1F2F58]/40 text-[#73B8E7] rounded-lg text-xs hover:bg-[#1F2F58]/60 transition-all"
                >
                  <Upload className="w-3 h-3" />
                  Ir a Agregar Fuente
                </button>

                {/* O pegar texto directo */}
                <div className="w-full mt-4">
                  <p className="text-[10px] text-gray-600 mb-2">
                    O pega contenido directamente:
                  </p>
                  <textarea
                    placeholder="Pega aqui contenido para comparar con tu base de conocimiento..."
                    className="w-full bg-[#0A1628]/60 border border-[#1F2F58]/50 rounded-lg px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#FBBC0C]/50 min-h-[80px] resize-y"
                    onChange={(e) => {
                      if (e.target.value.length > 50) {
                        setLastSourceContent(e.target.value);
                        setLastSourceId(null);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SECCION: Material de Estudio ── */}
        {activeSection === "material" && (
          <StudyMaterialGenerator topic={sessionTitle} />
        )}

        {/* ── SECCION: Buscar ── */}
        {activeSection === "buscar" && (
          <SemanticSearch
            onSelectResult={(result) => {
              // Si el resultado es una nota, abrir para editar
              if (!result.source_type) {
                const note = notes.find((n) => n.id === result.id);
                if (note) {
                  setEditingNote(note);
                  setActiveSection("notas");
                }
              }
            }}
          />
        )}
      </div>

      {/* Footer con stats */}
      <div className="bg-[#0A1628]/80 px-3 py-1.5 border-t border-[#1F2F58]/20">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-gray-600">
            {loadingNotes ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Cargando...
              </span>
            ) : (
              `${notes.length} notas en tu cerebro`
            )}
          </span>
          <span className="text-[9px] text-gray-700">
            Powered by pgvector + Gemini + OpenAI
          </span>
        </div>
      </div>
    </div>
  );
}
