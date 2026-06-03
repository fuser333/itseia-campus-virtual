import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Mismo ID del programa Preuni que /docente/preuni/page.tsx
const PREUNI_PROGRAM_ID = "958d9795-8958-450e-828a-ff24eb4b0f00";

interface SubjectRow {
  id: string;
  name: string;
  semester_id: string;
}
interface SessionRow {
  id: string;
  number: number;
  subject_id: string;
  is_active: boolean;
}

/**
 * Resuelve dayIndex (1..20) → (subject_id, session_number)
 * usando el mismo ordenamiento por "Semana N" del listado.
 * Hace redirect a la vista docente real ya construida en /teacher.
 */
export default async function DocentePreuniSesionPage({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  const dayIndex = parseInt(num, 10);

  if (Number.isNaN(dayIndex) || dayIndex < 1 || dayIndex > 20) {
    redirect("/docente/preuni");
  }

  // Semestres del programa
  const { data: semesters } = await supabaseAdmin
    .from("semesters")
    .select("id")
    .eq("program_id", PREUNI_PROGRAM_ID);

  const semesterIds = (semesters ?? []).map((s) => s.id as string);
  if (semesterIds.length === 0) redirect("/docente/preuni");

  // Materias (Semana 1..4)
  const { data: subjectsRaw } = await supabaseAdmin
    .from("subjects")
    .select("id, name, semester_id")
    .in("semester_id", semesterIds);

  const subjects = (subjectsRaw as SubjectRow[] | null) ?? [];
  if (subjects.length === 0) redirect("/docente/preuni");

  subjects.sort(
    (a, b) => weekNumberFromName(a.name) - weekNumberFromName(b.name)
  );

  const subjectIds = subjects.map((s) => s.id);
  const { data: sessionsRaw } = await supabaseAdmin
    .from("sessions")
    .select("id, number, subject_id, is_active")
    .in("subject_id", subjectIds)
    .eq("is_active", true)
    .order("number", { ascending: true });

  const sessionRows = (sessionsRaw as SessionRow[] | null) ?? [];

  // Aplanar igual que docente/preuni
  let idx = 0;
  for (const sub of subjects) {
    const subSessions = sessionRows
      .filter((s) => s.subject_id === sub.id)
      .sort((a, b) => a.number - b.number);
    for (const s of subSessions) {
      idx += 1;
      if (idx === dayIndex) {
        redirect(`/teacher/materias/${sub.id}/sesion/${s.number}`);
      }
    }
  }

  // No encontrado → volver
  redirect("/docente/preuni");
}

function weekNumberFromName(name: string): number {
  const m = name.match(/Semana\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : 99;
}
