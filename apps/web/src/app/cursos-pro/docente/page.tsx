import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  Users,
  Calendar,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import { getUserRole } from "../_lib/queries";

const ADMIN_ROLES = new Set(["super_admin", "admin", "coordinacion", "docente"]);

interface CourseRow {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  category: string | null;
  price_usd: number;
  total_modules: number;
  total_sessions: number;
  total_hours: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export default async function DocenteCursosProDashboard() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect("/login?module=cursos-pro&next=/cursos-pro/docente");

  const role = await getUserRole(user.id);
  if (!ADMIN_ROLES.has(role ?? "")) {
    redirect("/cursos-pro");
  }

  const { data: rows } = await supabaseAdmin
    .from("cursos_pro_courses")
    .select(
      "id, slug, name, subtitle, category, price_usd, total_modules, total_sessions, total_hours, start_date, end_date, is_active"
    )
    .order("start_date", { ascending: true });

  const courses = ((rows as CourseRow[] | null) ?? []).filter((c) => c.is_active);

  // Cohort counts (alumnos activos) por curso.
  const courseIds = courses.map((c) => c.id);
  const { data: enrollRows } = courseIds.length
    ? await supabaseAdmin
        .from("cursos_pro_enrollments")
        .select("course_id, status")
        .in("course_id", courseIds)
        .eq("status", "active")
    : { data: [] as { course_id: string }[] };
  type ER = { course_id: string };
  const cohortMap = new Map<string, number>();
  for (const e of (enrollRows as ER[] | null) ?? []) {
    cohortMap.set(e.course_id, (cohortMap.get(e.course_id) ?? 0) + 1);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-[#0A1628] to-[#1F2F58] p-6 sm:p-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FBBC0C] mb-1">
          PANEL DOCENTE · CURSOS PRO
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <GraduationCap className="size-7 text-[#FBBC0C]" />
          Cohortes activas
        </h1>
        <p className="mt-1 text-sm text-white/65">
          Administra contenidos, programa clases en vivo y graba sesiones.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#1F2F58]/20 bg-card p-10 text-center">
          <Sparkles className="mx-auto size-10 text-[#1F2F58]/20" />
          <p className="mt-3 text-sm font-semibold text-[#1F2F58]/70">
            Todavía no hay cursos creados en BD.
          </p>
          <p className="mt-1 text-xs text-[#1F2F58]/55">
            Corre el seed: <code>node scripts/seed-curso-gisela-josselin.mjs --commit</code>
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((c) => (
            <Link
              key={c.id}
              href={`/cursos-pro/docente/${c.slug}`}
              className="group block rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-[#FBBC0C]/40 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="rounded-md bg-[#FBBC0C]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FBBC0C]">
                  ${c.price_usd} · {c.category ?? "Curso"}
                </span>
                <ArrowRight className="size-4 text-[#1F2F58]/40 group-hover:text-[#FBBC0C] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1628] leading-tight">
                {c.name}
              </h3>
              {c.subtitle && (
                <p className="mt-1 text-xs text-[#1F2F58]/60">{c.subtitle}</p>
              )}

              <div className="mt-4 grid grid-cols-4 gap-2 text-[11px] font-semibold text-[#1F2F58]/70">
                <StatPill icon={<Users className="size-3" />} value={cohortMap.get(c.id) ?? 0} label="alumnos" />
                <StatPill icon={<Layers className="size-3" />} value={c.total_modules} label="módulos" />
                <StatPill icon={<Calendar className="size-3" />} value={c.total_sessions} label="sesiones" />
                <StatPill icon={<Clock className="size-3" />} value={c.total_hours} label="horas" />
              </div>
              <p className="mt-3 text-[11px] text-[#1F2F58]/55">
                {formatDateRange(c.start_date, c.end_date)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-md bg-[#73B8E7]/10 px-2 py-1.5 text-center">
      <div className="flex items-center justify-center gap-1 text-[#73B8E7]">
        {icon}
        <span className="text-sm font-bold text-[#0A1628]">{value}</span>
      </div>
      <p className="mt-0.5 text-[9px] uppercase tracking-wider text-[#1F2F58]/50">
        {label}
      </p>
    </div>
  );
}

function formatDateRange(s: string, e: string): string {
  const sd = new Date(s);
  const ed = new Date(e);
  const fmt = (d: Date) =>
    d.toLocaleDateString("es-EC", { day: "numeric", month: "short" });
  return `${fmt(sd)} — ${fmt(ed)}`;
}
