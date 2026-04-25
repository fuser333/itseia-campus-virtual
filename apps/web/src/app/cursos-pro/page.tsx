import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Clock,
  Layers,
  CalendarCheck,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Wand2,
  Wrench,
  ClipboardList,
  Play,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Panel Profesional | ITSEIA Academy",
  description: "Dashboard del estudiante de Cursos Profesionales ITSEIA.",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CursosProDashboardPage() {
  const authClient = await createClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name, email, nivel_xp")
    .eq("id", user.id)
    .single();

  const fullName  = profile?.full_name ?? user.email?.split("@")[0] ?? "Estudiante";
  const firstName = fullName.split(" ")[0];

  // Fetch active enrollment for "curso" type program
  const { data: enrollment } = await supabaseAdmin
    .from("enrollments")
    .select("id, enrolled_at, programs(id, name, slug, type, duration_months, description)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  type ProgramRow = {
    id: string;
    name: string;
    slug: string;
    type: string;
    duration_months: number | null;
    description: string | null;
  };

  const rawPrograms = enrollment?.programs as unknown;
  const program: ProgramRow | null = Array.isArray(rawPrograms)
    ? (rawPrograms[0] as ProgramRow) ?? null
    : (rawPrograms as ProgramRow | null) ?? null;

  // Fetch progress data for the active program
  let horasCompletadas    = 0;
  let moduloActual        = 1;
  let totalModulos        = 0;
  let overallPercent      = 0;

  if (program) {
    // Get modules via courses for this program
    const { data: courses } = await supabaseAdmin
      .from("courses")
      .select("id")
      .eq("program_id", program.id)
      .eq("is_active", true);

    const courseIds = (courses ?? []).map((c) => c.id);

    if (courseIds.length > 0) {
      const { data: modules } = await supabaseAdmin
        .from("modules")
        .select("id")
        .in("course_id", courseIds)
        .eq("is_active", true);

      const moduleIds = (modules ?? []).map((m) => m.id);
      totalModulos    = moduleIds.length;

      if (moduleIds.length > 0) {
        const { data: lessons } = await supabaseAdmin
          .from("lessons")
          .select("id, duration_minutes")
          .in("module_id", moduleIds)
          .eq("is_active", true);

        const lessonIds = (lessons ?? []).map((l) => l.id);

        if (lessonIds.length > 0) {
          const { data: progress } = await supabaseAdmin
            .from("progress")
            .select("lesson_id, completed")
            .eq("user_id", user.id)
            .in("lesson_id", lessonIds)
            .eq("completed", true);

          const completedSet = new Set((progress ?? []).map((p) => p.lesson_id));

          // Hours = sum of duration_minutes for completed lessons / 60
          const minutosCompletados = (lessons ?? [])
            .filter((l) => completedSet.has(l.id))
            .reduce((acc, l) => acc + (l.duration_minutes ?? 45), 0);

          horasCompletadas = Math.round(minutosCompletados / 60);
          overallPercent   =
            lessonIds.length > 0
              ? Math.round((completedSet.size / lessonIds.length) * 100)
              : 0;

          // Determine current module (first module with incomplete lesson)
          if (modules && modules.length > 0) {
            for (let i = 0; i < modules.length; i++) {
              const { data: mLessons } = await supabaseAdmin
                .from("lessons")
                .select("id")
                .eq("module_id", modules[i].id)
                .eq("is_active", true);

              const allCompleted = (mLessons ?? []).every((l) =>
                completedSet.has(l.id),
              );

              if (!allCompleted) {
                moduloActual = i + 1;
                break;
              }
              moduloActual = modules.length;
            }
          }
        }
      }
    }
  }

  // Fetch asesorías used (using lesson type as proxy — or just show placeholder)
  // Since there's no dedicated asesorias table, we show a static placeholder
  const asesoriasUsadas = 0;
  const asesoriasTotal  = 3;

  return (
    <div className="space-y-10">

      {/* ── Welcome header ──────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
              PANEL PROFESIONAL
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bienvenido, {firstName}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Continúa aprendiendo. Tu próxima lección te está esperando.
            </p>
          </div>
          <a
            href="https://wa.me/593959892034?text=Hola%2C%20soy%20estudiante%20de%20Cursos%20Pro%20ITSEIA%20y%20necesito%20soporte"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors self-start sm:self-auto"
          >
            <MessageCircle className="size-4" />
            Soporte WhatsApp
          </a>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Clock className="size-5 text-[#73B8E7]" />}
          label="Horas Completadas"
          value={String(horasCompletadas)}
          sub="horas de aprendizaje"
          accent="bg-[#73B8E7]/10"
        />
        <StatCard
          icon={<Layers className="size-5 text-[#FBBC0C]" />}
          label="Módulo Actual"
          value={totalModulos > 0 ? `${moduloActual} / ${totalModulos}` : "—"}
          sub={totalModulos > 0 ? `${overallPercent}% completado` : "Sin contenido aún"}
          accent="bg-[#FBBC0C]/10"
          href="/cursos-pro/progreso"
        />
        <StatCard
          icon={<CalendarCheck className="size-5 text-[#F0846D]" />}
          label="Asesorías con Héctor"
          value={`${asesoriasUsadas} / ${asesoriasTotal}`}
          sub="usadas de tu plan"
          accent="bg-[#F0846D]/10"
          href="/cursos-pro/asesorias"
        />
      </div>

      {/* ── Active course card ───────────────────────────────────────────── */}
      {program ? (
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="size-5 text-[#73B8E7]" />
            Tu Curso Activo
          </h2>
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="bg-gradient-to-br from-[#1F2F58]/8 to-[#0A1628]/5 px-6 py-5 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge className="mb-2 border-none bg-[#FBBC0C]/15 text-[10px] font-semibold uppercase tracking-wider text-[#FBBC0C]">
                    Curso Profesional
                  </Badge>
                  <h3 className="text-lg font-bold text-[#0A1628] leading-tight">
                    {program.name}
                  </h3>
                  {program.description && (
                    <p className="mt-1 text-sm text-[#1F2F58]/60 line-clamp-2">
                      {program.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="relative flex size-16 items-center justify-center">
                    <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke="rgba(31,47,88,0.08)"
                        strokeWidth="5"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke="#FBBC0C"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={`${overallPercent * 1.634} ${163.4 - overallPercent * 1.634}`}
                      />
                    </svg>
                    <span className="absolute text-sm font-bold text-[#0A1628]">
                      {overallPercent}%
                    </span>
                  </div>
                  <span className="text-[10px] text-[#1F2F58]/40">Progreso</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#1F2F58]/60">
                  Progreso general
                </span>
                <span className="text-xs font-semibold text-[#1F2F58]">
                  {overallPercent}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#1F2F58]/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all duration-700"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/mi-curso"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1F2F58] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Play className="size-3.5" />
                  Continuar Curso
                </Link>
                <Link
                  href="/cursos-pro/progreso"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/15 bg-white px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
                >
                  Ver Progreso
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <BookOpen className="mx-auto size-12 text-[#1F2F58]/20 mb-4" />
          <h3 className="text-lg font-semibold text-[#0A1628]">
            Sin curso activo
          </h3>
          <p className="mt-2 text-sm text-[#1F2F58]/60 max-w-sm mx-auto">
            Aún no tienes un curso profesional activo. Revisa los cursos disponibles o contacta a soporte.
          </p>
          <a
            href="https://itseia.ai/cursos/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-5 py-2.5 text-sm font-semibold text-[#0A1628] hover:opacity-90 transition-opacity"
          >
            Ver Cursos Disponibles
            <ArrowRight className="size-3.5" />
          </a>
        </div>
      )}

      {/* ── Quick access recursos ────────────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Acceso Rápido
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <QuickLink
            href="/cursos-pro/prompts"
            icon={<Wand2 className="size-5" />}
            title="Prompts Especializados"
            description="Colección curada para tu curso"
            color="text-[#73B8E7]"
            bg="bg-[#73B8E7]/10"
          />
          <QuickLink
            href="/cursos-pro/tools"
            icon={<Wrench className="size-5" />}
            title="Herramientas IA"
            description="Stack recomendado ITSEIA"
            color="text-[#FBBC0C]"
            bg="bg-[#FBBC0C]/10"
          />
          <QuickLink
            href="/cursos-pro/proyecto"
            icon={<ClipboardList className="size-5" />}
            title="Proyecto Final"
            description="Instrucciones y entrega"
            color="text-[#F0846D]"
            bg="bg-[#F0846D]/10"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: string;
  href?: string;
}) {
  const inner = (
    <CardContent className="flex items-center gap-4">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-[#1F2F58]/50">{label}</p>
        <p className="text-2xl font-bold tracking-tight text-[#0A1628]">{value}</p>
        <p className="text-xs text-[#1F2F58]/40 mt-0.5">{sub}</p>
      </div>
    </CardContent>
  );

  if (href) {
    return (
      <Link href={href}>
        <Card className="border-none bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          {inner}
        </Card>
      </Link>
    );
  }

  return (
    <Card className="border-none bg-white shadow-sm">
      {inner}
    </Card>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
  color,
  bg,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bg: string;
}) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer border-none bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="flex items-center gap-4">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${bg} ${color} transition-transform group-hover:scale-110`}
          >
            {icon}
          </div>
          <div>
            <p className="font-semibold text-[#0A1628]">{title}</p>
            <p className="text-xs text-[#1F2F58]/50">{description}</p>
          </div>
          <ArrowRight className="ml-auto size-4 text-[#1F2F58]/20 transition-all group-hover:translate-x-1 group-hover:text-[#1F2F58]/50" />
        </CardContent>
      </Card>
    </Link>
  );
}
