"use client";

/**
 * TeacherAttendancePanel — Asistencia de la sesión cursos-pro.
 * Lista alumnos matriculados activos al curso, permite marcar presente/ausente
 * y guarda en cursos_pro_attendance (si existe) o como JSON en sesión.
 *
 * MVP simple: lectura desde profiles + cursos_pro_enrollments,
 * persistencia local en localStorage por sesión (futuro: tabla dedicada).
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  sessionId: string;
  courseId: string;
}

interface Student {
  id: string;
  full_name: string;
  email: string;
  present: boolean;
}

export default function TeacherAttendancePanel({ sessionId, courseId }: Props) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: enrolls } = await supabase
        .from("cursos_pro_enrollments")
        .select("profile_id")
        .eq("course_id", courseId)
        .eq("status", "active");
      const profileIds = ((enrolls as { profile_id: string }[] | null) ?? []).map(
        (r) => r.profile_id
      );
      if (profileIds.length === 0) {
        setLoading(false);
        return;
      }
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", profileIds);

      const stored = typeof window !== "undefined"
        ? window.localStorage.getItem(`attendance:${sessionId}`)
        : null;
      const presentSet: Set<string> = stored ? new Set(JSON.parse(stored)) : new Set();

      const list: Student[] = ((profiles as { id: string; full_name?: string; email?: string }[] | null) ?? []).map(
        (p) => ({
          id: p.id,
          full_name: p.full_name || p.email || "Sin nombre",
          email: p.email || "",
          present: presentSet.has(p.id),
        })
      );
      setStudents(list);
      setLoading(false);
    })();
  }, [sessionId, courseId]);

  function togglePresent(id: string) {
    setStudents((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, present: !s.present } : s
      );
      const presentIds = next.filter((s) => s.present).map((s) => s.id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `attendance:${sessionId}`,
          JSON.stringify(presentIds)
        );
      }
      return next;
    });
  }

  function markAll(present: boolean) {
    setStudents((prev) => {
      const next = prev.map((s) => ({ ...s, present }));
      const presentIds = next.filter((s) => s.present).map((s) => s.id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `attendance:${sessionId}`,
          JSON.stringify(presentIds)
        );
      }
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="size-6 animate-spin text-[#FBBC0C]" />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="p-6 text-center">
        <Users className="mx-auto size-10 text-white/30" />
        <p className="mt-3 text-sm text-white/60">
          No hay alumnos matriculados activos en este curso aún.
        </p>
      </div>
    );
  }

  const presentCount = students.filter((s) => s.present).length;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Asistencia</h3>
          <p className="text-xs text-white/60">
            {presentCount} de {students.length} marcados presentes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAll(true)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Marcar todos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAll(false)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Limpiar
          </Button>
        </div>
      </div>

      <ul className="space-y-2">
        {students.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => togglePresent(s.id)}
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition ${
                s.present
                  ? "bg-[#FBBC0C]/15 border-[#FBBC0C]/40"
                  : "bg-white/5 border-white/10 hover:border-white/30"
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-white">
                  {s.full_name}
                </span>
                <span className="text-xs text-white/50">{s.email}</span>
              </div>
              {s.present ? (
                <CheckCircle2 className="size-5 text-[#FBBC0C]" />
              ) : (
                <Circle className="size-5 text-white/30" />
              )}
            </button>
          </li>
        ))}
      </ul>

      <p className="text-[10px] text-white/40 text-center pt-2">
        Asistencia guardada en este navegador. Migración a base de datos
        planificada para próxima iteración.
      </p>
    </div>
  );
}
