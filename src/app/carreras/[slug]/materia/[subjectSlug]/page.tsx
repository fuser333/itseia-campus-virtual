import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowRight,
  Play,
  Wrench,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Breadcrumb from "@/components/academic/Breadcrumb";
import { SubjectTabs } from "@/components/forums/SubjectTabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subjectSlug: string }>;
}): Promise<Metadata> {
  const { subjectSlug } = await params;
  const supabase = supabaseAdmin;

  const { data: subjects } = await supabase
    .from("subjects")
    .select("name")
    .eq("slug", subjectSlug)
    .limit(1);

  const subject = subjects?.[0];

  return {
    title: subject
      ? `${subject.name} | ITSEIA Academy`
      : "Materia | ITSEIA Academy",
  };
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string; subjectSlug: string }>;
}) {
  const { slug, subjectSlug } = await params;
  const supabase = supabaseAdmin;

  // Fetch program (any type — not restricted to 'carrera')
  const { data: career } = await supabase
    .from("programs")
    .select("id, name, slug")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!career) notFound();

  // Fetch subject - need to join through semesters to filter by career
  const { data: subjects } = await supabase
    .from("subjects")
    .select("*, semesters!inner(program_id)")
    .eq("slug", subjectSlug)
    .eq("semesters.program_id", career.id);

  const subject = subjects?.[0];
  if (!subject) notFound();

  // Fetch semester info
  const { data: semester } = await supabase
    .from("semesters")
    .select("number, name")
    .eq("id", subject.semester_id)
    .single();

  // Fetch teacher info
  let teacherName: string | null = null;
  if (subject.teacher_id) {
    const { data: teacher } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", subject.teacher_id)
      .single();
    teacherName = teacher?.full_name || null;
  }

  // Fetch sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("subject_id", subject.id)
    .eq("is_active", true)
    .order("number", { ascending: true });

  // Get user progress (use auth client for cookies)
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  let progressMap: Record<string, boolean> = {};
  if (user && sessions && sessions.length > 0) {
    const sessionIds = sessions.map((s) => s.id);
    const { data: progressData } = await supabase
      .from("session_progress")
      .select("session_id, completed")
      .eq("user_id", user.id)
      .in("session_id", sessionIds);

    (progressData || []).forEach((p) => {
      if (p.completed) progressMap[p.session_id] = true;
    });
  }

  const completedCount = Object.values(progressMap).filter(Boolean).length;
  const totalSessions = sessions?.length || 0;
  const progressPercent =
    totalSessions > 0
      ? Math.round((completedCount / totalSessions) * 100)
      : 0;

  const tools: string[] = subject.tools || [];

  // Determinar si el usuario puede moderar el foro (docente o admin)
  let canModerate = false;
  if (user) {
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const isAdmin = ["super_admin", "admin", "coordinacion"].includes(userProfile?.role ?? "");
    const isTeacher = subject.teacher_id === user.id;
    canModerate = isAdmin || isTeacher;
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Carreras", href: "/carreras" },
          { label: career.name, href: `/carreras/${career.slug}` },
          {
            label: semester ? `Periodo ${semester.number}` : "Periodo",
            href: `/carreras/${career.slug}`,
          },
          { label: subject.name },
        ]}
      />

      {/* Subject header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
              <span>
                {career.name} / Periodo {semester?.number || "?"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {subject.name}
            </h1>
            {subject.description && (
              <p className="mt-2 text-sm text-white/60 max-w-xl">
                {subject.description}
              </p>
            )}

            {/* Info row */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {subject.hours_total}h total
              </span>
              <span>
                {subject.hours_docencia}h docencia / {subject.hours_practica}h
                practica / {subject.hours_autonomo}h autonomo
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span>{subject.credit_hours} creditos</span>
              {teacherName && (
                <>
                  <span className="size-1 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1">
                    <User className="size-3" />
                    {teacherName}
                  </span>
                </>
              )}
            </div>

            {/* Tools */}
            {tools.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-[#73B8E7]"
                  >
                    <Wrench className="size-2.5" />
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Progress circle */}
          {user && (
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="relative flex size-20 items-center justify-center rounded-full bg-white/5 ring-2 ring-white/10">
                <span className="text-xl font-bold text-[#FBBC0C] font-[family-name:var(--font-space-grotesk)]">
                  {progressPercent}%
                </span>
                {/* SVG ring progress */}
                <svg
                  className="absolute inset-0"
                  viewBox="0 0 80 80"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#FBBC0C"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(progressPercent / 100) * 226} 226`}
                    transform="rotate(-90 40 40)"
                  />
                </svg>
              </div>
              <span className="text-[10px] text-white/40">
                {completedCount}/{totalSessions} sesiones
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs: Sesiones + Foro */}
      <SubjectTabs
        subjectId={subject.id}
        currentUserId={user?.id ?? ""}
        canModerate={canModerate}
        sessionsContent={
          <div>
            <h2 className="text-lg font-bold text-[#0A1628] mb-4">
              Sesiones de clase ({totalSessions})
            </h2>

            {totalSessions > 0 ? (
              <div className="space-y-2">
                {(sessions || []).map((session) => {
                  const isCompleted = progressMap[session.id] || false;
                  const hasVideo = !!session.video_url;
                  const hasTheory = !!session.theory_markdown;

                  return (
                    <Link
                      key={session.id}
                      href={`/carreras/${slug}/materia/${subjectSlug}/sesion/${session.number}`}
                      className={`group flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                        isCompleted
                          ? "border-emerald-200 bg-emerald-50/30"
                          : "border-[#1F2F58]/8 bg-white hover:border-[#73B8E7]/30"
                      }`}
                    >
                      {/* Number */}
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                          isCompleted ? "bg-emerald-100" : "bg-[#1F2F58]/5"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="size-5 text-emerald-500" />
                        ) : (
                          <span className="text-sm font-bold text-[#1F2F58]/40 font-[family-name:var(--font-space-grotesk)]">
                            {session.number}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#0A1628] truncate group-hover:text-[#73B8E7] transition-colors">
                          {session.title}
                        </h3>
                        {session.description && (
                          <p className="mt-0.5 text-xs text-[#1F2F58]/40 line-clamp-1">
                            {session.description}
                          </p>
                        )}
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-[#1F2F58]/30">
                          {hasVideo && (
                            <span className="flex items-center gap-0.5">
                              <Play className="size-2.5" />
                              Video
                            </span>
                          )}
                          {hasTheory && (
                            <span className="flex items-center gap-0.5">
                              <BookOpen className="size-2.5" />
                              Teoria
                            </span>
                          )}
                          {session.estimated_duration_minutes > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Clock className="size-2.5" />
                              {session.estimated_duration_minutes} min
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <Badge
                        className={`border-none text-[10px] font-semibold shrink-0 ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-[#1F2F58]/5 text-[#1F2F58]/30"
                        }`}
                      >
                        {isCompleted ? "Completada" : "Pendiente"}
                      </Badge>

                      <ArrowRight className="size-4 shrink-0 text-[#1F2F58]/15 group-hover:text-[#73B8E7] transition-colors" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed border-[#1F2F58]/20 bg-white/50">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <BookOpen className="size-12 text-[#1F2F58]/10 mb-4" />
                  <h3 className="text-base font-semibold text-[#0A1628]">
                    Sesiones en preparacion
                  </h3>
                  <p className="mt-1 max-w-sm text-sm text-[#1F2F58]/80">
                    El contenido de esta materia esta siendo preparado por el equipo
                    docente. Estara disponible pronto.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        }
      />
    </div>
  );
}
