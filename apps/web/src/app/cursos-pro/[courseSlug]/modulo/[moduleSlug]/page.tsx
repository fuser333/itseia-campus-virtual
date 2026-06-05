"use client";

/**
 * Listado de sesiones de un módulo · Cursos Profesionales
 * URL: /cursos-pro/[courseSlug]/modulo/[moduleSlug]
 */

import { use, useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, BookOpen, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ courseSlug: string; moduleSlug: string }>;
}

interface CourseRow {
  id: string;
  slug: string;
  name: string;
}

interface ModuleRow {
  id: string;
  course_id: string;
  num: number;
  slug: string | null;
  name: string;
}

interface SessionRow {
  id: string;
  num: number;
  num_in_module: number | null;
  title: string;
  scheduled_at: string | null;
  duration_minutes: number;
  status: string;
}

const MODULE_NUM_TO_SLUG: Record<number, string> = {
  1: "m1-fundamentos-ia-lopdp",
  2: "m2-stack-profesional-ia",
  3: "m3-gestion-operativa-ia",
  4: "m4-facturacion-power-bi-cierre",
};
const MODULE_SLUG_TO_NUM: Record<string, number> = Object.fromEntries(
  Object.entries(MODULE_NUM_TO_SLUG).map(([k, v]) => [v, parseInt(k)])
);

export default function ModuloPage({ params }: PageProps) {
  const { courseSlug, moduleSlug } = use(params);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseRow | null>(null);
  const [moduleData, setModuleData] = useState<ModuleRow | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: courseData } = await supabase
      .from("cursos_pro_courses")
      .select("id, slug, name")
      .eq("slug", courseSlug)
      .limit(1);
    const courseRow = (courseData as CourseRow[] | null)?.[0];
    if (!courseRow) {
      setLoading(false);
      return;
    }
    setCourse(courseRow);

    let moduleRow: ModuleRow | null = null;
    const { data: bySlug } = await supabase
      .from("cursos_pro_modules")
      .select("id, course_id, num, slug, name")
      .eq("course_id", courseRow.id)
      .eq("slug", moduleSlug)
      .limit(1);
    moduleRow = (bySlug as ModuleRow[] | null)?.[0] || null;

    if (!moduleRow && MODULE_SLUG_TO_NUM[moduleSlug]) {
      const { data: byNum } = await supabase
        .from("cursos_pro_modules")
        .select("id, course_id, num, slug, name")
        .eq("course_id", courseRow.id)
        .eq("num", MODULE_SLUG_TO_NUM[moduleSlug])
        .limit(1);
      moduleRow = (byNum as ModuleRow[] | null)?.[0] || null;
    }

    if (!moduleRow) {
      setLoading(false);
      return;
    }
    setModuleData(moduleRow);

    const { data: sessionData } = await supabase
      .from("cursos_pro_sessions")
      .select("id, num, num_in_module, title, scheduled_at, duration_minutes, status")
      .eq("course_id", courseRow.id)
      .eq("module_id", moduleRow.id)
      .order("num", { ascending: true });

    setSessions((sessionData as SessionRow[] | null) || []);
    setLoading(false);
  }, [courseSlug, moduleSlug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#FBBC0C]" />
      </div>
    );
  }

  if (!course || !moduleData) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto size-12 text-[#1F2F58]/30" />
          <p className="mt-3 text-sm text-[#1F2F58]/70">
            Modulo no encontrado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FBBC0C]">
          {course.name} · M{moduleData.num}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[#0A1628]">
          {moduleData.name}
        </h1>
        <p className="mt-1 text-sm text-[#1F2F58]/60">
          {sessions.length} sesiones
        </p>
      </div>

      <div className="space-y-2">
        {sessions.map((s, idx) => {
          const numInModule = s.num_in_module ?? idx + 1;
          const href = `/cursos-pro/${courseSlug}/modulo/${moduleSlug}/sesion/${numInModule}`;
          return (
            <Link
              key={s.id}
              href={href}
              className="group flex items-center justify-between rounded-xl border border-[#1F2F58]/10 bg-white p-4 transition hover:border-[#FBBC0C]/40 hover:shadow-md"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-[#1F2F58]/50">
                  <span className="font-mono">Sesion {numInModule}</span>
                  {s.scheduled_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(s.scheduled_at).toLocaleDateString("es-EC", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-semibold text-[#0A1628] truncate">
                  {s.title}
                </h3>
              </div>
              <ChevronRight className="size-5 text-[#1F2F58]/30 group-hover:text-[#FBBC0C]" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
