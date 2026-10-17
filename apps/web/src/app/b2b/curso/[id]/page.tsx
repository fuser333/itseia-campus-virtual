import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  GraduationCap,
  Clock,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Users,
  Video,
  Brain,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: program } = await supabaseAdmin
    .from("programs")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: program
      ? `${program.name} | ITSEIA Academy Corporativo`
      : "Curso | ITSEIA Academy Corporativo",
  };
}

// ─── Level config ────────────────────────────────────────────────────────────

const levelConfig: Record<string, { label: string; color: string; bg: string }> = {
  basic: { label: "Basico", color: "#73B8E7", bg: "#73B8E7" },
  professional: { label: "Profesional", color: "#FBBC0C", bg: "#FBBC0C" },
  integration: { label: "Integracion", color: "#F0846D", bg: "#F0846D" },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function B2BCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = supabaseAdmin;

  // Auth check
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) redirect("/login");

  // Guard: only finanzas role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "finanzas") {
    redirect("/dashboard");
  }

  // Fetch program
  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("id", id)
    .single();

  if (!program) notFound();

  // If program has a slug, redirect to the full academic view
  if (program.slug) {
    redirect(`/carreras/${program.slug}`);
  }

  // Fetch semesters (modules)
  const { data: semesters } = await supabase
    .from("semesters")
    .select("*")
    .eq("program_id", program.id)
    .order("number", { ascending: true });

  // Fetch subjects per semester
  const semesterIds = (semesters || []).map((s) => s.id);
  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .in("semester_id", semesterIds.length > 0 ? semesterIds : ["__none__"])
    .order("order_index", { ascending: true });

  // Count sessions per subject
  const subjectIds = (subjects || []).map((s) => s.id);
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, subject_id")
    .in("subject_id", subjectIds.length > 0 ? subjectIds : ["__none__"])
    .eq("is_active", true);

  // Get user progress
  let completedSet = new Set<string>();
  if (sessions && sessions.length > 0) {
    const sessionIds = sessions.map((s) => s.id);
    const { data: progressData } = await supabase
      .from("session_progress")
      .select("session_id")
      .eq("user_id", user.id)
      .in("session_id", sessionIds)
      .eq("completed", true);

    completedSet = new Set((progressData || []).map((p) => p.session_id));
  }

  // Build session counts per subject
  const sessionsBySubject: Record<string, string[]> = {};
  (sessions || []).forEach((s) => {
    if (!sessionsBySubject[s.subject_id]) sessionsBySubject[s.subject_id] = [];
    sessionsBySubject[s.subject_id].push(s.id);
  });

  // Group subjects by semester
  const subjectsBySemester: Record<string, typeof subjects> = {};
  (subjects || []).forEach((sub) => {
    if (!subjectsBySemester[sub.semester_id]) subjectsBySemester[sub.semester_id] = [];
    subjectsBySemester[sub.semester_id]!.push(sub);
  });

  const totalSessions = sessions?.length ?? 0;
  const completedSessions = completedSet.size;
  const progressPercent = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/b2b/capacitacion"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Capacitacion Activa
      </Link>

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-white/10 flex-shrink-0">
            <GraduationCap className="size-7 text-[#FBBC0C]" />
          </div>
          <div className="flex-1">
            <Badge className="mb-2 border-none bg-[#FBBC0C]/20 text-[#FBBC0C] text-[10px] font-semibold uppercase tracking-wider">
              Capacitacion Corporativa
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {program.name}
            </h1>
            {program.description && (
              <p className="mt-2 text-sm text-white/60 max-w-2xl leading-relaxed">
                {program.description}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {totalSessions > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">
                {completedSessions} de {totalSessions} sesiones completadas
              </span>
              <span className="text-sm font-bold text-[#FBBC0C]">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#1F2F58]/8">
              <BookOpen className="size-5 text-[#1F2F58]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1F2F58]/50">Modulos</p>
              <p className="text-2xl font-bold tracking-tight text-[#0A1628]">
                {semesters?.length ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#73B8E7]/10">
              <Video className="size-5 text-[#73B8E7]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1F2F58]/50">Sesiones</p>
              <p className="text-2xl font-bold tracking-tight text-[#0A1628]">
                {totalSessions}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FBBC0C]/10">
              <Award className="size-5 text-[#FBBC0C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1F2F58]/50">Progreso</p>
              <p className="text-2xl font-bold tracking-tight text-[#0A1628]">
                {progressPercent}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules/Semesters */}
      {(semesters || []).length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-[#0A1628] flex items-center gap-2">
            <BookOpen className="size-5 text-[#73B8E7]" />
            Contenido del Programa
          </h2>

          {(semesters || []).map((semester, idx) => {
            const semSubjects = subjectsBySemester[semester.id] || [];
            const level = levelConfig[(semester as { level?: string }).level ?? "basic"] || levelConfig.basic;

            return (
              <div
                key={semester.id}
                className="rounded-2xl bg-white shadow-sm overflow-hidden"
              >
                {/* Module header */}
                <div
                  className="px-6 py-4 border-b"
                  style={{ borderColor: `${level.color}30` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-lg"
                      style={{ background: `${level.color}15` }}
                    >
                      <span
                        className="text-sm font-bold"
                        style={{ color: level.color }}
                      >
                        {String(semester.number).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A1628]">
                        {semester.name || `Modulo ${semester.number}`}
                      </p>
                      <Badge
                        className="mt-1 border-none text-[10px] font-semibold uppercase tracking-wider"
                        style={{ background: `${level.color}15`, color: level.color }}
                      >
                        {level.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Subjects list */}
                <div className="divide-y divide-[#1F2F58]/5">
                  {semSubjects.map((subject) => {
                    const subSessions = sessionsBySubject[subject.id] || [];
                    const subCompleted = subSessions.filter((sid) => completedSet.has(sid)).length;
                    const subPercent = subSessions.length > 0 ? Math.round((subCompleted / subSessions.length) * 100) : 0;

                    return (
                      <Link
                        key={subject.id}
                        href={`/carreras/${program.slug || program.id}/materia/${subject.slug || subject.id}`}
                        className="group flex items-center gap-4 px-6 py-4 hover:bg-[#1F2F58]/3 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#0A1628] group-hover:text-[#1F2F58] transition-colors truncate">
                            {subject.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[#1F2F58]/40">
                            <span className="flex items-center gap-1">
                              <Video className="size-3" />
                              {subSessions.length} {subSessions.length === 1 ? "sesion" : "sesiones"}
                            </span>
                            {subCompleted > 0 && (
                              <span className="flex items-center gap-1 text-emerald-500">
                                <CheckCircle2 className="size-3" />
                                {subCompleted}/{subSessions.length}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mini progress */}
                        {subSessions.length > 0 && (
                          <div className="w-20 flex-shrink-0">
                            <div className="h-1.5 bg-[#1F2F58]/8 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] rounded-full transition-all"
                                style={{ width: `${subPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <ArrowRight className="size-4 text-[#1F2F58]/20 group-hover:text-[#1F2F58]/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </Link>
                    );
                  })}

                  {semSubjects.length === 0 && (
                    <div className="px-6 py-8 text-center">
                      <p className="text-sm text-[#1F2F58]/40">
                        Contenido en preparacion
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state — no modules yet */
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-5 flex size-20 items-center justify-center rounded-2xl bg-[#1F2F58]/8">
              <BookOpen className="size-10 text-[#1F2F58]/40" />
            </div>
            <h2 className="text-xl font-bold text-[#0A1628]">
              Contenido en preparacion
            </h2>
            <p className="mt-2 max-w-md text-sm text-[#1F2F58]/50 leading-relaxed">
              El equipo de ITSEIA esta preparando el contenido de este programa.
              Te notificaremos cuando este disponible.
            </p>
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20consulta%20sobre%20mi%20capacitacion%20corporativa"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-5 py-2.5 text-sm font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 transition-colors"
            >
              Consultar por WhatsApp
              <ArrowRight className="size-4" />
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
