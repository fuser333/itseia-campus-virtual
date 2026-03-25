// ============================================================
// app/calendario/page.tsx
// Pagina principal del calendario academico ITSEIA
// Server Component: carga datos iniciales
// Client: hidratacion para Realtime
// ============================================================

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getEventsForUser } from "@/features/calendar/queries";
import { AcademicCalendar } from "@/components/calendar/AcademicCalendar";

export const metadata: Metadata = {
  title: "Calendario | ITSEIA Academy",
  description: "Agenda academica con clases sincronicas, evaluaciones y tutorias",
};

export default async function CalendarioPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "estudiante";

  // Cargar eventos de la semana actual como estado inicial
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const to = new Date(from);
  to.setDate(to.getDate() + 7);

  const initialEvents = await getEventsForUser(user.id, role, from, to);

  // Obtener materias segun rol (para el formulario de creacion)
  let subjects: { id: string; name: string; code: string }[] = [];

  if (["docente", "coordinacion", "admin", "super_admin"].includes(role)) {
    let subjectQuery = supabaseAdmin
      .from("subjects")
      .select("id, name, code")
      .eq("is_active", true)
      .order("name");

    if (role === "docente") {
      subjectQuery = subjectQuery.eq("teacher_id", user.id);
    }

    const { data: subjectsData } = await subjectQuery;
    subjects = (subjectsData || []) as { id: string; name: string; code: string }[];
  }

  // Obtener subject IDs del usuario para Realtime
  let subjectIds: string[] = [];

  if (role === "docente") {
    const { data: teacherSubjects } = await supabaseAdmin
      .from("subjects")
      .select("id")
      .eq("teacher_id", user.id);
    subjectIds = (teacherSubjects || []).map((s: { id: string }) => s.id);
  } else if (role === "estudiante") {
    const { data: enrollments } = await supabaseAdmin
      .from("enrollments")
      .select("program_id")
      .eq("user_id", user.id)
      .eq("status", "active");

    const programIds = (enrollments || []).map(
      (e: { program_id: string }) => e.program_id
    );

    if (programIds.length > 0) {
      const { data: semesters } = await supabaseAdmin
        .from("semesters")
        .select("id")
        .in("program_id", programIds);

      const semesterIds = (semesters || []).map((s: { id: string }) => s.id);

      if (semesterIds.length > 0) {
        const { data: subjectsData } = await supabaseAdmin
          .from("subjects")
          .select("id")
          .in("semester_id", semesterIds);
        subjectIds = (subjectsData || []).map((s: { id: string }) => s.id);
      }
    }
  }

  const showAdminControls = ["coordinacion", "admin", "super_admin"].includes(role);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
      {/* Header de pagina */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0A1628] tracking-tight">
          Calendario Academico
        </h1>
        <p className="mt-1 text-sm text-[#1F2F58]/80">
          {role === "estudiante"
            ? "Tus clases sincronicas, evaluaciones y fechas de entrega"
            : role === "docente"
            ? "Administra y planifica las sesiones de tus materias"
            : "Vista global de todos los eventos academicos ITSEIA"}
        </p>
      </div>

      {/* Calendario interactivo */}
      <div className="flex-1 rounded-xl border border-gray-100 bg-white shadow-sm p-4">
        <AcademicCalendar
          initialEvents={initialEvents}
          subjectIds={subjectIds}
          subjects={subjects}
          userRole={role}
          userId={user.id}
          showAdminControls={showAdminControls}
        />
      </div>
    </div>
  );
}
