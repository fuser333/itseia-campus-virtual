"use client";

// ============================================================
// ITSEIA Academy — NoteList (Segundo Cerebro)
// Feature: segundo-cerebro-mvp
//
// Lista de notas del alumno con acciones de editar/eliminar.
// ============================================================

import { useState } from "react";
import {
  FileText,
  Edit3,
  Trash2,
  Clock,
  Tag,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrainNote } from "@/types/brain";

interface NoteListProps {
  notes: BrainNote[];
  loading?: boolean;
  onEdit: (note: BrainNote) => void;
  onDelete: (noteId: string) => Promise<void>;
  className?: string;
}

export default function NoteList({
  notes,
  loading,
  onEdit,
  onDelete,
  className,
}: NoteListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function handleDelete(noteId: string) {
    if (confirmDeleteId !== noteId) {
      setConfirmDeleteId(noteId);
      return;
    }

    setDeletingId(noteId);
    try {
      await onDelete(noteId);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Ahora";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHrs < 24) return `Hace ${diffHrs}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return d.toLocaleDateString("es-EC", {
      day: "numeric",
      month: "short",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 text-[#73B8E7] animate-spin" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <FileText className="w-8 h-8 text-gray-600 mb-3" />
        <p className="text-sm text-gray-500 mb-1">
          Tu Segundo Cerebro esta vacio
        </p>
        <p className="text-[11px] text-gray-600">
          Crea tu primera nota para empezar a construir tu base de conocimiento
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
          {notes.length} nota{notes.length !== 1 ? "s" : ""}
        </span>
      </div>

      {notes.map((note) => (
        <div
          key={note.id}
          className="group bg-[#0A1628]/40 border border-[#1F2F58]/30 rounded-lg p-3 hover:border-[#1F2F58]/60 transition-all cursor-pointer"
          onClick={() => onEdit(note)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">
                {note.title}
              </h4>
              <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                {note.content.slice(0, 150)}
              </p>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note);
                }}
                className="p-1 rounded hover:bg-[#1F2F58]/40 text-gray-500 hover:text-[#73B8E7] transition-colors"
                title="Editar"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(note.id);
                }}
                disabled={deletingId === note.id}
                className={cn(
                  "p-1 rounded transition-colors",
                  confirmDeleteId === note.id
                    ? "bg-[#F0846D]/15 text-[#F0846D]"
                    : "hover:bg-[#1F2F58]/40 text-gray-500 hover:text-[#F0846D]"
                )}
                title={
                  confirmDeleteId === note.id
                    ? "Click para confirmar"
                    : "Eliminar"
                }
              >
                {deletingId === note.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : confirmDeleteId === note.id ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Footer: tags + fecha */}
          <div className="flex items-center gap-2 mt-2">
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-2.5 h-2.5 text-gray-600" />
                {note.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] px-1.5 py-0.5 bg-[#1F2F58]/30 text-[#73B8E7] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="text-[9px] text-gray-600">
                    +{note.tags.length - 3}
                  </span>
                )}
              </div>
            )}
            <span className="flex items-center gap-1 text-[9px] text-gray-600 ml-auto">
              <Clock className="w-2.5 h-2.5" />
              {formatDate(note.updated_at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
