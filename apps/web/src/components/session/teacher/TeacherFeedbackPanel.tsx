"use client";

/**
 * TeacherFeedbackPanel — Notas y feedback de la sesión para el docente.
 * MVP: persistencia en localStorage por sessionId. Próxima iteración:
 * tabla cursos_pro_teacher_notes con texto + opcional vinculo alumno.
 */

import { useEffect, useState } from "react";
import { MessageSquareText, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  sessionId: string;
}

export default function TeacherFeedbackPanel({ sessionId }: Props) {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(`teacher-notes:${sessionId}`);
    if (stored) {
      setNotes(stored);
      setSaved(true);
    }
  }, [sessionId]);

  function handleSave() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`teacher-notes:${sessionId}`, notes);
    }
    setSaved(true);
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MessageSquareText className="size-5 text-[#FBBC0C]" />
          Feedback y notas de la sesión
        </h3>
        <p className="text-xs text-white/60 mt-1">
          Notas privadas para preparar la próxima clase: qué funcionó,
          qué no, alumnos con dudas, mejoras pendientes.
        </p>
      </div>

      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        rows={12}
        placeholder="Apuntes de la sesión, observaciones de alumnos, ajustes para próxima clase..."
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#FBBC0C]/60 focus:outline-none resize-y"
      />

      <div className="flex items-center justify-between">
        {saved ? (
          <span className="flex items-center gap-1.5 text-xs text-[#FBBC0C]">
            <CheckCircle2 className="size-4" /> Guardado
          </span>
        ) : (
          <span className="text-xs text-white/50">
            Cambios sin guardar
          </span>
        )}
        <Button
          onClick={handleSave}
          disabled={!notes.trim()}
          className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 disabled:opacity-40"
        >
          <Save className="size-4 mr-2" />
          Guardar notas
        </Button>
      </div>

      <p className="text-[10px] text-white/40 text-center pt-2">
        Notas guardadas en este navegador. Migración a base de datos
        (cursos_pro_teacher_notes) planificada para próxima iteración.
      </p>
    </div>
  );
}
