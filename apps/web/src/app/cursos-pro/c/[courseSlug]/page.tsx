import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Layers,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Play,
  Video,
} from "lucide-react";
import {
  getCourseBySlug,
  getUserEnrollment,
  getModulesForCourse,
  getSessionsForCourse,
  getCompletedSessionIds,
  getUserRole,
} from "../../_lib/queries";

interface PageProps {
  params: Promise<{ courseSlug: string }>;
}

const ADMIN_ROLES = new Set(["super_admin", "admin", "coordinacion", "docente"]);

export default async function CursoProDetailPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) redirect(`/login?module=cursos-pro&next=/cursos-pro/c/${courseSlug}`);

  const course = await getCourseBySlug(courseSlug);
  if (!course || !course.is_active) notFound();

  // Guard: solo alumnos con enrollment activo O staff.
  const role = await getUserRole(user.id);
  const isStaff = ADMIN_ROLES.has(role ?? "");
  const enrollment = await getUserEnrollment(course.id, user.id);

  if (!enrollment && !isStaff) {
    // No tiene acceso: redirigimos al dashboard /cursos-pro con un parámetro
    // para que la landing pueda mostrar mensaje "todavía no estás inscrito".
    redirect(`/cursos-pro?nf=${courseSlug}`);
  }

  const [modules, sessions] = await Promise.all([
    getModulesForCourse(course.id),
    getSessionsForCourse(course.id),
  ]);

  const completedIds = enrollment
    ? await getCompletedSessionIds(enrollment.id)
    : new Set<string>();

  const totalSessions = sessions.length;
  const completedCount = sessions.filter((s) => completedIds.has(s.id)).length;
  const progressPct = totalSessions > 0
    ? Math.round((completedCount / totalSessions) * 100)
    : 0;

  // Agrupa sesiones por módulo.
  const sessionsByModule = new Map<string, typeof sessions>();
  for (const s of sessions) {
    const key = s.module_id ?? "no-module";
    const arr = sessionsByModule.get(key) ?? [];
    arr.push(s);
    sessionsByModule.set(key, arr);
  }

  return (
    <div className="space-y-8">
      {/* ── Breadcrumb + título ────────────────────────────────────────── */}
      <div>
        <Link
          href="/cursos-pro"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1F2F58]/60 hover:text-[#1F2F58] mb-3"
        >
          <ArrowLeft className="size-3.5" />
          Mis cursos
        </Link>

        <div className="rounded-2xl bg-gradient-to-br from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#FBBC0C] mb-2">
            CURSO PROFESIONAL · ${course.price_usd}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {course.name}
          </h1>
          {course.subtitle && (
            <p className="mt-1 text-sm text-white/70">{course.subtitle}</p>
          )}
          {course.description && (
            <p className="mt-3 text-sm text-white/65 leading-relaxed max-w-3xl">
              {course.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-5 text-xs">
            <span className="flex items-center gap-1.5 text-white/80">
              <Layers className="size-3.5 text-[#73B8E7]" />
              {course.total_modules} módulos
            </span>
            <span className="flex items-center gap-1.5 text-white/80">
              <BookOpen className="size-3.5 text-[#73B8E7]" />
              {course.total_sessions} sesiones en vivo
            </span>
            <span className="flex items-center gap-1.5 text-white/80">
              <Clock className="size-3.5 text-[#73B8E7]" />
              {course.total_hours}h totales
            </span>
            <span className="flex items-center gap-1.5 text-white/80">
              <Calendar className="size-3.5 text-[#73B8E7]" />
              {formatDateRange(course.start_date, course.end_date)}
            </span>
          </div>

          {/* Progress bar (solo si tiene enrollment) */}
          {enrollment && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-[11px] font-medium text-white/65 mb-1.5">
                <span>Progreso</span>
                <span>
                  {completedCount}/{totalSessions} sesiones · {progressPct}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#FBBC0C] transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Módulos + sesiones ─────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="size-5 text-[#73B8E7]" />
          Programa del curso
        </h2>

        {modules.length === 0 && (
          <p className="text-sm text-[#1F2F58]/60">
            Aún no hay módulos configurados para este curso.
          </p>
        )}

        <div className="space-y-6">
          {modules.map((m) => {
            const moduleSessions = sessionsByModule.get(m.id) ?? [];
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
                  {m.description && (
                    <p className="mt-1 text-xs text-[#1F2F58]/60">
                      {m.description}
                    </p>
                  )}
                </div>

                <ul className="divide-y divide-border">
                  {moduleSessions.map((s) => {
                    const done = completedIds.has(s.id);
                    return (
                      <li key={s.id}>
                        <Link
                          href={`/cursos-pro/c/${courseSlug}/sesion/${s.num}`}
                          className="group flex items-center gap-4 px-5 py-3.5 hover:bg-[#FBBC0C]/5 transition-colors"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1F2F58]/8 text-[11px] font-bold text-[#1F2F58]">
                            S{s.num}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#0A1628] truncate">
                              {s.title}
                            </p>
                            <p className="text-[11px] text-[#1F2F58]/55 mt-0.5 flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {formatSessionDateTime(s.scheduled_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {s.duration_minutes} min
                              </span>
                              {s.status === "live" && (
                                <span className="flex items-center gap-1 text-[#F0846D] font-bold">
                                  <span className="size-1.5 rounded-full bg-[#F0846D] animate-pulse" />
                                  EN VIVO
                                </span>
                              )}
                              {s.status === "done" && s.recording_url && (
                                <span className="flex items-center gap-1 text-[#517CBE]">
                                  <Video className="size-3" />
                                  Grabación
                                </span>
                              )}
                            </p>
                          </div>
                          {done ? (
                            <CheckCircle2 className="size-4 text-[#FBBC0C] shrink-0" />
                          ) : (
                            <Circle className="size-4 text-[#1F2F58]/20 shrink-0" />
                          )}
                          <Play className="size-4 text-[#1F2F58]/30 group-hover:text-[#FBBC0C] transition-colors shrink-0" />
                        </Link>
                      </li>
                    );
                  })}
                  {moduleSessions.length === 0 && (
                    <li className="px-5 py-4 text-[11px] text-[#1F2F58]/45 italic">
                      No hay sesiones programadas en este módulo aún.
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Acceso docente (si aplica) ─────────────────────────────────── */}
      {isStaff && (
        <section className="rounded-2xl border-2 border-dashed border-[#FBBC0C]/40 bg-[#FBBC0C]/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#FBBC0C]">
                Vista docente
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#0A1628]">
                Entra al panel del docente para esta cohorte
              </p>
            </div>
            <Link
              href={`/cursos-pro/docente/${courseSlug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1F2F58] transition-colors"
            >
              Panel docente
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    d.toLocaleDateString("es-EC", { day: "numeric", month: "short" });
  return `${fmt(s)} — ${fmt(e)}`;
}

function formatSessionDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-EC", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
