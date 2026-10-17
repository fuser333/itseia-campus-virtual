/**
 * Página de módulo · Cursos Profesionales
 * URL: /cursos-pro/[courseSlug]/modulo/[moduleSlug]
 *
 * Lista las sesiones del módulo con su estado, fecha y link.
 * Espejo visual de /carreras/[slug]/materia/[subjectSlug]/page.tsx del preuni.
 */

import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  Video,
  Radio,
} from "lucide-react";
import {
  getCourseBySlug,
  getUserEnrollment,
  getModuleBySlug,
  getSessionsForModule,
  getCompletedSessionIds,
  getUserRole,
} from "@/app/cursos-pro/_lib/queries";

interface PageProps {
  params: Promise<{ courseSlug: string; moduleSlug: string }>;
}

const ADMIN_ROLES = new Set(["super_admin", "admin", "coordinacion", "docente"]);

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-EC", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ModuloPage({ params }: PageProps) {
  const { courseSlug, moduleSlug } = await params;

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) redirect(`/login?module=cursos-pro&next=/cursos-pro/${courseSlug}/modulo/${moduleSlug}`);

  const course = await getCourseBySlug(courseSlug);
  if (!course || !course.is_active) notFound();

  const role = await getUserRole(user.id);
  const isStaff = ADMIN_ROLES.has(role ?? "");
  const enrollment = await getUserEnrollment(course.id, user.id);

  if (!enrollment && !isStaff) {
    redirect(`/cursos-pro?nf=${courseSlug}`);
  }

  const modulo = await getModuleBySlug(course.id, moduleSlug);
  if (!modulo) notFound();

  const sesiones = await getSessionsForModule(modulo.id);

  const completedIds = enrollment
    ? await getCompletedSessionIds(enrollment.id)
    : new Set<string>();

  const completedCount = sesiones.filter((s) => completedIds.has(s.id)).length;
  const progressPct =
    sesiones.length > 0
      ? Math.round((completedCount / sesiones.length) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div>
        <Link
          href={`/cursos-pro/${courseSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          {course.name}
        </Link>

        {/* Header del módulo */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white border border-white/8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#FBBC0C] mb-2">
            MÓDULO {modulo.num} · CURSOS PROFESIONALES
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {modulo.name}
          </h1>
          {modulo.description && (
            <p className="mt-2 text-sm text-white/65">{modulo.description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-[#73B8E7]" />
              {modulo.hours}h
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-[#73B8E7]" />
              {sesiones.length} sesiones
            </span>
          </div>

          {/* Progress */}
          {enrollment && (
            <div className="mt-5">
              <div className="flex justify-between text-[11px] text-white/55 mb-1.5">
                <span>Progreso</span>
                <span>{completedCount}/{sesiones.length} · {progressPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de sesiones */}
      <section>
        <h2 className="text-base font-bold text-white/80 mb-3">
          Sesiones del módulo
        </h2>
        <div className="rounded-2xl border border-white/8 bg-[#1F2F58]/20 overflow-hidden">
          <ul className="divide-y divide-white/[0.06]">
            {sesiones.map((s) => {
              const numInMod = s.num_in_module ?? s.num;
              const href = `/cursos-pro/${courseSlug}/modulo/${moduleSlug}/sesion/${numInMod}`;
              const done = completedIds.has(s.id);
              const isLive = s.status === "live";
              const isDone = s.status === "done";

              return (
                <li key={s.id}>
                  <Link
                    href={href}
                    className="group flex items-center gap-4 px-5 py-4 hover:bg-[#FBBC0C]/5 transition-colors"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-bold text-white/70">
                      S{numInMod}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/90 truncate">
                        {s.title}
                      </p>
                      <p className="text-[11px] text-white/45 mt-0.5 flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDateTime(s.scheduled_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {s.duration_minutes} min
                        </span>
                        {isLive && (
                          <span className="flex items-center gap-1 text-[#F0846D] font-bold">
                            <Radio className="size-3" />
                            EN VIVO
                          </span>
                        )}
                        {isDone && s.recording_url && (
                          <span className="flex items-center gap-1 text-[#517CBE]">
                            <Video className="size-3" />
                            Grabación disponible
                          </span>
                        )}
                      </p>
                    </div>
                    {done ? (
                      <CheckCircle2 className="size-5 text-[#FBBC0C] shrink-0" />
                    ) : (
                      <Circle className="size-5 text-white/20 shrink-0" />
                    )}
                    <Play className="size-4 text-white/25 group-hover:text-[#FBBC0C] transition-colors shrink-0" />
                  </Link>
                </li>
              );
            })}
            {sesiones.length === 0 && (
              <li className="px-5 py-6 text-center text-sm text-white/40 italic">
                Sesiones en preparación.
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
