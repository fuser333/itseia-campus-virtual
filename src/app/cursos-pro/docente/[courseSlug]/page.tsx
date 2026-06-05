// LEGACY · pendiente de remover post FASE 8
// Vista docente curso individual (/cursos-pro/docente/[slug]). Reemplazo en
// (docente)/docente-shell/[producto]/.... NO BORRAR hasta migrar admin-salud
// (cohorte Gisela+Josselin viernes 6 jun) al shell v2.
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Video,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  getCourseBySlug,
  getModulesForCourse,
  getSessionsForCourse,
  getUserRole,
} from "../../_lib/queries";

const ADMIN_ROLES = new Set(["super_admin", "admin", "coordinacion", "docente"]);

interface PageProps {
  params: Promise<{ courseSlug: string }>;
}

export default async function DocenteCursoPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect(`/login?module=cursos-pro&next=/cursos-pro/docente/${courseSlug}`);

  const role = await getUserRole(user.id);
  if (!ADMIN_ROLES.has(role ?? "")) redirect("/cursos-pro");

  const course = await getCourseBySlug(courseSlug);
  if (!course) notFound();

  const [modules, sessions] = await Promise.all([
    getModulesForCourse(course.id),
    getSessionsForCourse(course.id),
  ]);

  const { count: cohortCount } = await supabaseAdmin
    .from("cursos_pro_enrollments")
    .select("*", { count: "exact", head: true })
    .eq("course_id", course.id)
    .eq("status", "active");

  // Próxima sesión: la más cercana en el futuro O la que esté live.
  const now = Date.now();
  const liveSession = sessions.find((s) => s.status === "live");
  const nextSession =
    liveSession ??
    sessions
      .filter((s) => s.status === "scheduled" && new Date(s.scheduled_at).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
      )[0];

  return (
    <div className="space-y-8">
      <Link
        href="/cursos-pro/docente"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1F2F58]/60 hover:text-[#1F2F58]"
      >
        <ArrowLeft className="size-3.5" />
        Cohortes activas
      </Link>

      <div className="rounded-2xl bg-gradient-to-br from-[#0A1628] to-[#1F2F58] p-6 sm:p-8 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#FBBC0C] mb-2">
          PANEL DOCENTE · ${course.price_usd}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
          {course.name}
        </h1>
        {course.subtitle && (
          <p className="mt-1 text-sm text-white/65">{course.subtitle}</p>
        )}

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Stat icon={<Users />} value={cohortCount ?? 0} label="alumnos activos" />
          <Stat icon={<Calendar />} value={course.total_sessions} label="sesiones totales" />
          <Stat icon={<Clock />} value={`${course.total_hours}h`} label="horas curso" />
          <Stat icon={<Video />} value={sessions.filter((s) => s.status === "done").length} label="finalizadas" />
        </div>
      </div>

      {/* Próxima sesión / EN VIVO destacada */}
      {nextSession && (
        <section className={`rounded-2xl border-2 p-5 ${
          nextSession.status === "live"
            ? "border-[#F0846D] bg-[#F0846D]/8"
            : "border-[#FBBC0C]/50 bg-[#FBBC0C]/5"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${
                nextSession.status === "live" ? "text-[#F0846D]" : "text-[#FBBC0C]"
              }`}>
                {nextSession.status === "live" ? "🔴 EN VIVO AHORA" : "PRÓXIMA SESIÓN"}
              </p>
              <p className="mt-1 text-base font-bold text-[#0A1628]">
                Sesión {nextSession.num} · {nextSession.title}
              </p>
              <p className="mt-0.5 text-xs text-[#1F2F58]/60">
                {formatDateTime(nextSession.scheduled_at)} · {nextSession.duration_minutes} min
              </p>
            </div>
            <Link
              href={`/cursos-pro/docente/${courseSlug}/sesion/${nextSession.num}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FBBC0C] px-5 py-3 text-sm font-bold text-[#0A1628] hover:bg-[#f5b300] transition-colors"
            >
              {nextSession.status === "live" ? "Ir a la clase en curso" : "Preparar sesión"}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* Listado de módulos + sesiones */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Plan completo del curso
        </h2>
        <div className="space-y-6">
          {modules.map((m) => {
            const moduleSessions = sessions.filter((s) => s.module_id === m.id);
            return (
              <div
                key={m.id}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                <div className="bg-[#73B8E7]/8 px-5 py-3 border-b border-border">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#73B8E7]">
                      M{m.num}
                    </span>
                    <h3 className="text-base font-bold text-[#0A1628] flex-1">
                      {m.name}
                    </h3>
                    <span className="text-[10px] text-[#1F2F58]/50">
                      {m.hours}h
                    </span>
                  </div>
                </div>
                <ul className="divide-y divide-border">
                  {moduleSessions.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/cursos-pro/docente/${courseSlug}/sesion/${s.num}`}
                        className="group flex items-center gap-4 px-5 py-3.5 hover:bg-[#FBBC0C]/5 transition-colors"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1F2F58]/8 text-[11px] font-bold text-[#1F2F58]">
                          S{s.num}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0A1628] truncate">
                            {s.title}
                          </p>
                          <p className="text-[11px] text-[#1F2F58]/55 mt-0.5">
                            {formatDateTime(s.scheduled_at)} · {s.duration_minutes} min
                          </p>
                        </div>
                        <StatusChip status={s.status} hasRecording={!!s.recording_url} hasMeet={!!s.meet_url} />
                        <ArrowRight className="size-4 text-[#1F2F58]/30 group-hover:text-[#FBBC0C] shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2.5 border border-white/8">
      <div className="flex items-center gap-1.5 text-[#73B8E7]">
        <span className="[&>svg]:size-3.5">{icon}</span>
        <span className="text-lg font-bold text-white">{value}</span>
      </div>
      <p className="mt-0.5 text-[9px] uppercase tracking-wider text-white/50">
        {label}
      </p>
    </div>
  );
}

function StatusChip({
  status,
  hasRecording,
  hasMeet,
}: {
  status: "scheduled" | "live" | "done" | "cancelled";
  hasRecording: boolean;
  hasMeet: boolean;
}) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-[#F0846D]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F0846D]">
        <span className="size-1.5 rounded-full bg-[#F0846D] animate-pulse" />
        EN VIVO
      </span>
    );
  }
  if (status === "done") {
    if (hasRecording) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#FBBC0C]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FBBC0C]">
          <CheckCircle2 className="size-3" />
          Grabada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-[#F0846D]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F0846D]">
        <AlertCircle className="size-3" />
        Sin grabación
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="rounded-md bg-[#1F2F58]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1F2F58]/60">
        Cancelada
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
      hasMeet ? "bg-[#73B8E7]/15 text-[#517CBE]" : "bg-[#1F2F58]/10 text-[#1F2F58]/60"
    }`}>
      Programada
    </span>
  );
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
