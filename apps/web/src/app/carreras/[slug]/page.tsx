import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Clock,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Breadcrumb from "@/components/academic/Breadcrumb";
import type { SemesterLevel } from "@/types/database";

// Label configuration per program type
const typeLabels: Record<string, { singular: string; plural: string; backLabel: string }> = {
  carrera: { singular: "Carrera", plural: "Carreras", backLabel: "Todas las carreras" },
  curso: { singular: "Curso Profesional", plural: "Cursos Profesionales", backLabel: "Todas las carreras" },
  preuni: { singular: "Preuniversitario", plural: "Preuniversitario", backLabel: "Todas las carreras" },
  bootcamp: { singular: "Bootcamp", plural: "Bootcamp", backLabel: "Todas las carreras" },
};

// Human-friendly descriptions (override DB jargon)
const slugDescriptions: Record<string, string> = {
  "inteligencia-artificial":
    "Aprende a crear sistemas inteligentes: machine learning, deep learning, vision por computadora y modelos de lenguaje aplicados a proyectos reales.",
  "ciencia-de-datos":
    "Convierte datos en decisiones: Python, analisis predictivo, estadistica avanzada y visualizacion de datos para empresas.",
  "big-data-inteligencia-negocio":
    "Maneja datos a gran escala: SQL, procesamiento distribuido, dashboards empresariales y toma de decisiones basada en datos.",
};

// Period label per program type
const periodLabel = (type: string): string => {
  if (type === "preuni") return "Semana";
  if (type === "bootcamp") return "Mes";
  return "Periodo";
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = supabaseAdmin;

  const { data: program } = await supabase
    .from("programs")
    .select("name, description, type")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  const typeLabel = program ? (typeLabels[program.type]?.singular || "Carrera") : "Carrera";

  return {
    title: program ? `${program.name} | ITSEIA Academy` : `${typeLabel} | ITSEIA Academy`,
    description: program?.description || `${typeLabel} en ITSEIA Academy`,
  };
}

const levelConfig: Record<string, { label: string; color: string; bg: string }> = {
  basic: { label: "Básico", color: "text-[#73B8E7]", bg: "bg-[#73B8E7]/10" },
  professional: { label: "Profesional", color: "text-[#FBBC0C]", bg: "bg-[#FBBC0C]/10" },
  integration: { label: "Integración", color: "text-[#F0846D]", bg: "bg-[#F0846D]/10" },
};

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = supabaseAdmin;

  // Fetch program (any type — not restricted to 'carrera')
  const { data: career } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!career) {
    notFound();
  }

  const pType = career.type as string;
  const labels = typeLabels[pType] || typeLabels.carrera;

  // Fetch semesters
  const { data: semesters } = await supabase
    .from("semesters")
    .select("*")
    .eq("program_id", career.id)
    .order("number", { ascending: true });

  // Fetch subjects per semester
  const semesterIds = (semesters || []).map((s) => s.id);
  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .in("semester_id", semesterIds.length > 0 ? semesterIds : ["__none__"])
    .order("order_index", { ascending: true });

  // Check if user is logged in for progress (use auth client for cookies)
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  // Get progress per subject if logged in
  let progressMap: Record<string, { completed: number; total: number }> = {};
  if (user && subjects && subjects.length > 0) {
    const subjectIds = subjects.map((s) => s.id);

    // Get sessions for all subjects
    const { data: sessions } = await supabase
      .from("sessions")
      .select("id, subject_id")
      .in("subject_id", subjectIds)
      .eq("is_active", true);

    if (sessions && sessions.length > 0) {
      // Count sessions per subject
      const sessionsBySubject: Record<string, string[]> = {};
      sessions.forEach((s) => {
        if (!sessionsBySubject[s.subject_id]) {
          sessionsBySubject[s.subject_id] = [];
        }
        sessionsBySubject[s.subject_id].push(s.id);
      });

      // Get progress for all sessions
      const sessionIds = sessions.map((s) => s.id);
      const { data: progressData } = await supabase
        .from("session_progress")
        .select("session_id, completed")
        .eq("user_id", user.id)
        .in("session_id", sessionIds)
        .eq("completed", true);

      const completedSessionIds = new Set(
        (progressData || []).map((p) => p.session_id)
      );

      // Build progress map
      subjectIds.forEach((subId) => {
        const subSessions = sessionsBySubject[subId] || [];
        const completedCount = subSessions.filter((sid) =>
          completedSessionIds.has(sid)
        ).length;
        progressMap[subId] = {
          completed: completedCount,
          total: subSessions.length,
        };
      });
    }
  }

  // Group subjects by semester
  const subjectsBySemester: Record<string, typeof subjects> = {};
  (subjects || []).forEach((sub) => {
    if (!subjectsBySemester[sub.semester_id]) {
      subjectsBySemester[sub.semester_id] = [];
    }
    subjectsBySemester[sub.semester_id]!.push(sub);
  });

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Carreras", href: "/carreras" },
          { label: career.name },
        ]}
      />

      {/* Career header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <Link
          href="/carreras"
          className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="size-3.5" />
          {labels.backLabel}
        </Link>
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex size-14 items-center justify-center rounded-xl bg-[#FBBC0C]/15">
            <GraduationCap className="size-7 text-[#FBBC0C]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {career.name}
            </h1>
            {(slugDescriptions[slug] || career.description) && (
              <p className="mt-2 text-sm text-white/80 max-w-xl leading-relaxed">
                {slugDescriptions[slug] || career.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/70">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {semesters?.length || 0} {pType === "preuni" ? "semanas" : pType === "bootcamp" ? "meses" : "periodos"}
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span>{subjects?.length || 0} materias</span>
              {career.duration_months && (
                <>
                  <span className="size-1 rounded-full bg-white/20" />
                  <span>{career.duration_months} meses</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Semesters */}
      <div className="space-y-6">
        {(semesters || []).map((semester) => {
          const semSubjects = subjectsBySemester[semester.id] || [];
          const level = semester.level as SemesterLevel;
          const config = levelConfig[level] || levelConfig.basic;

          return (
            <Card key={semester.id} className="border-none bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#1F2F58]/5">
                      <span className="text-sm font-bold text-[#1F2F58] font-[family-name:var(--font-space-grotesk)]">
                        {semester.number}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-[#0A1628]">
                        {semester.name || `${periodLabel(pType)} ${semester.number}`}
                      </CardTitle>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-[#1F2F58]/60">
                        <span className="flex items-center gap-1">
                          <BookOpen className="size-3" />
                          {semSubjects.length} materias
                        </span>
                        <span className="size-1 rounded-full bg-[#1F2F58]/30" />
                        <span>600h</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`border-none text-[10px] font-semibold uppercase tracking-wider ${config.bg} ${config.color}`}
                  >
                    {config.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {semSubjects.map((subject) => {
                    const progress = progressMap[subject.id];
                    const progressPercent =
                      progress && progress.total > 0
                        ? Math.round(
                            (progress.completed / progress.total) * 100
                          )
                        : 0;
                    const isComplete = progressPercent === 100;
                    const tools: string[] = subject.tools || [];

                    return (
                      <Link
                        key={subject.id}
                        href={`/carreras/${slug}/materia/${subject.slug}`}
                        className={`group flex flex-col rounded-xl border p-3.5 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                          isComplete
                            ? "border-emerald-200 bg-emerald-50/50"
                            : "border-[#1F2F58]/8 bg-white hover:border-[#73B8E7]/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-[#0A1628] line-clamp-2 leading-snug">
                            {subject.name}
                          </h3>
                          {isComplete && (
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#1F2F58]/60">
                          <Clock className="size-3" />
                          <span>{subject.hours_total}h</span>
                          <span className="text-[#1F2F58]/30">|</span>
                          <span>{subject.hours_docencia}D/{subject.hours_practica}P/{subject.hours_autonomo}A</span>
                        </div>

                        {tools.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {tools.slice(0, 3).map((tool) => (
                              <span
                                key={tool}
                                className="inline-flex rounded-md bg-[#73B8E7]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#73B8E7]"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}

                        {user && (
                          <div className="mt-auto pt-3 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-[#1F2F58]/60">
                                {progress?.completed || 0}/{progress?.total || 0} sesiones
                              </span>
                              <span className="text-[10px] font-semibold text-[#1F2F58]/70">
                                {progressPercent}%
                              </span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-[#1F2F58]/5">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isComplete
                                    ? "bg-emerald-400"
                                    : progressPercent > 0
                                    ? "bg-[#FBBC0C]"
                                    : ""
                                }`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {(!semesters || semesters.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="size-12 text-[#1F2F58]/10 mb-4" />
          <h3 className="text-lg font-semibold text-[#0A1628]">
            Estructura en preparación
          </h3>
          <p className="mt-1 max-w-sm text-sm text-[#1F2F58]/65">
            El contenido de esta carrera se está configurando. Estará disponible pronto.
          </p>
        </div>
      )}
    </div>
  );
}
