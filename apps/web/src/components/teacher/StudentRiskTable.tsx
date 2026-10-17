"use client";

// ============================================================
// StudentRiskTable — Tabla de estudiantes en riesgo
// con campo de intervencion inline
// ============================================================

import { useState } from "react";
import { AlertTriangle, MessageSquare, CheckCircle2, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveIntervention } from "@/features/teacher/actions";
import type { StudentAtRisk } from "@/types/database";

interface StudentRiskTableProps {
  students: StudentAtRisk[];
  subjectId: string;
}

export function StudentRiskTable({ students, subjectId }: StudentRiskTableProps) {
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [savedStudents, setSavedStudents] = useState<Set<string>>(new Set());

  async function handleSaveIntervention(studentId: string) {
    const note = noteText[studentId]?.trim();
    if (!note) return;

    setSaving(studentId);
    const result = await saveIntervention(studentId, subjectId, note);
    if (result.success) {
      setSavedStudents((prev) => new Set([...prev, studentId]));
      setNoteText((prev) => ({ ...prev, [studentId]: "" }));
      setExpandedStudent(null);
    }
    setSaving(null);
  }

  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 py-12 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-400 mb-3" />
        <p className="text-sm font-medium text-white/85">Sin estudiantes en riesgo</p>
        <p className="text-xs text-white/55 mt-1">
          Todos los estudiantes cumplen con los criterios de progreso, quizzes y asistencia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-white/65">
        {students.length} estudiante{students.length !== 1 ? "s" : ""} requiere{students.length === 1 ? "" : "n"} atención
      </p>

      {students.map((student) => {
        const isExpanded = expandedStudent === student.studentId;
        const isSaved = savedStudents.has(student.studentId);

        return (
          <div
            key={student.studentId}
            className="rounded-xl border border-orange-200 bg-orange-50/30"
          >
            {/* Row header */}
            <div className="flex items-start gap-3 p-4">
              <AlertTriangle className="size-5 shrink-0 text-orange-500 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {student.studentName}
                    </p>
                    <p className="text-xs text-white/55">{student.studentEmail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSaved && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        <CheckCircle2 className="size-3" />
                        Intervencion registrada
                      </span>
                    )}
                    {student.hasIntervention && !isSaved && (
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                        Ya tiene intervencion
                      </span>
                    )}
                  </div>
                </div>

                {/* Risk criteria badges */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {student.criteria.map((c, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-medium text-orange-800"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="mt-2 flex gap-4 text-xs text-white/55">
                  <span>Completitud: {student.sessionCompletion}%</span>
                  {student.quizAverage !== null && (
                    <span>Quiz: {student.quizAverage.toFixed(0)}%</span>
                  )}
                  {student.consecutiveAbsences > 0 && (
                    <span>Inasistencias: {student.consecutiveAbsences}</span>
                  )}
                  {student.lastAccess && (
                    <span>
                      Ultimo acceso:{" "}
                      {new Date(student.lastAccess).toLocaleDateString("es-EC", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Expand button */}
              <button
                type="button"
                onClick={() =>
                  setExpandedStudent(isExpanded ? null : student.studentId)
                }
                className="shrink-0 flex items-center gap-1.5 rounded-lg bg-[#1F2F58]/10 hover:bg-[#1F2F58]/20 px-3 py-1.5 text-xs font-medium text-[#73B8E7] transition-colors"
              >
                <MessageSquare className="size-3.5" />
                Intervenir
                <ChevronDown
                  className={`size-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Intervention form */}
            {isExpanded && (
              <div className="border-t border-orange-200 bg-[#0A1628]/80/50 px-4 pb-4 pt-3">
                <p className="text-xs font-medium text-white/75 mb-2">
                  Nota de intervencion (privada, no visible al estudiante)
                </p>
                <Textarea
                  value={noteText[student.studentId] || ""}
                  onChange={(e) =>
                    setNoteText((prev) => ({
                      ...prev,
                      [student.studentId]: e.target.value,
                    }))
                  }
                  placeholder="Describe la accion tomada: llamada, correo, tutoria programada..."
                  className="min-h-[80px] text-sm"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    disabled={
                      saving === student.studentId ||
                      !(noteText[student.studentId]?.trim())
                    }
                    onClick={() => handleSaveIntervention(student.studentId)}
                    className="gap-2 bg-[#1F2F58] hover:bg-[#2A3F6E] text-white"
                  >
                    {saving === student.studentId ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-3.5" />
                    )}
                    Guardar intervencion
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
