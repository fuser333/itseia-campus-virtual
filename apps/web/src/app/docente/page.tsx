import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Users,
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Docente | ITSEIA",
  description:
    "Dashboard maestro del docente: Preuniversitario, Cursos Profesionales y Carreras.",
};

// Programa Preuniversitario IGNITE — fuente de verdad
const PREUNI_PROGRAM_ID = "958d9795-8958-450e-828a-ff24eb4b0f00";

// Roles con acceso (chequeados también en layout)
const ADMIN_LEVEL_ROLES = new Set(["super_admin", "admin", "coordinacion"]);

interface CursoProRow {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
  total_sessions: number;
  start_date: string;
  end_date: string;
}

interface DashboardData {
  fullName: string;
  role: string;
  preuni: {
    enabled: boolean;
    cohortLabel: string;
    enrolledCount: number;
    startsLabel: string;
  };
  cursosPro: {
    enabled: boolean;
    courses: CursoProRow[];
    activeStudents: number;
    nextStart: string | null;
  };
  carreras: {
    enabled: boolean;
    note: string;
  };
}

export default async function DocenteDashboardPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  // Auth already validated by layout, but TypeScript needs the guard.
  if (!user) return null;

  const data = await loadDashboardData(user.id);

  // Si el docente NO tiene ninguna categoría asignada, mostramos un mensaje
  // honesto en vez de las 3 cards vacías.
  const nothing =
    !data.preuni.enabled && !data.cursosPro.enabled && !data.carreras.enabled;

  return (
    <div className="space-y-10">
      <Header fullName={data.fullName} role={data.role} />

      {nothing ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {data.preuni.enabled && (
            <PreuniCard
              cohortLabel={data.preuni.cohortLabel}
              enrolledCount={data.preuni.enrolledCount}
              startsLabel={data.preuni.startsLabel}
            />
          )}

          {data.cursosPro.enabled && (
            <CursosProCard
              courses={data.cursosPro.courses}
              activeStudents={data.cursosPro.activeStudents}
              nextStart={data.cursosPro.nextStart}
            />
          )}

          {data.carreras.enabled && (
            <CarrerasCard note={data.carreras.note} />
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data loader
// ─────────────────────────────────────────────────────────────────────────────

async function loadDashboardData(userId: string): Promise<DashboardData> {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", userId)
    .single();

  const role = (profile?.role as string | undefined) ?? "estudiante";
  const fullName =
    (profile?.full_name as string | undefined) ??
    (profile?.email as string | undefined)?.split("@")[0] ??
    "Docente";

  const isAdminLevel = ADMIN_LEVEL_ROLES.has(role);

  // ── PREUNI ────────────────────────────────────────────────────────────────
  // Para esta iteración, admin/super_admin/coordinacion siempre ven la card
  // del Preuni (saben todo). Para role=docente, mostramos el Preuni solo si
  // hay alumnos enrollados en el programa (la cohorte está activa).
  const { count: preuniEnrolledCount } = await supabaseAdmin
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("program_id", PREUNI_PROGRAM_ID)
    .eq("status", "active");

  const preuniEnabled =
    isAdminLevel || (preuniEnrolledCount ?? 0) > 0;

  // ── CURSOS PROFESIONALES ──────────────────────────────────────────────────
  // Mostramos cursos activos. Cuando exista una tabla de assignment docente,
  // se filtra ahí. Mientras tanto: admin/super_admin/coordinacion ven todos,
  // docente regular ve todos los activos.
  const { data: courseRows } = await supabaseAdmin
    .from("cursos_pro_courses")
    .select("id, slug, name, is_active, total_sessions, start_date, end_date")
    .eq("is_active", true)
    .order("start_date", { ascending: true });

  const courses = ((courseRows as CursoProRow[] | null) ?? []).filter(
    (c) => c.is_active
  );

  let activeStudents = 0;
  if (courses.length) {
    const courseIds = courses.map((c) => c.id);
    const { count } = await supabaseAdmin
      .from("cursos_pro_enrollments")
      .select("*", { count: "exact", head: true })
      .in("course_id", courseIds)
      .eq("status", "active");
    activeStudents = count ?? 0;
  }

  const nextStart =
    courses
      .map((c) => c.start_date)
      .filter(Boolean)
      .sort()[0] ?? null;

  // ── CARRERAS DE TERCER NIVEL ──────────────────────────────────────────────
  // Solo planificación curricular hasta octubre 2026. Mostramos card a admin
  // niveles + docente (porque docente puede tener materias asignadas).
  // No mostramos métricas reales porque las carreras no han arrancado.
  const carrerasEnabled = isAdminLevel || role === "docente";

  return {
    fullName,
    role,
    preuni: {
      enabled: preuniEnabled,
      cohortLabel: "Cohorte Junio 2026",
      enrolledCount: preuniEnrolledCount ?? 0,
      startsLabel: "Arranca hoy · lun-vie 17:30-19:30 EC",
    },
    cursosPro: {
      enabled: isAdminLevel || courses.length > 0,
      courses,
      activeStudents,
      nextStart,
    },
    carreras: {
      enabled: carrerasEnabled,
      note: "Las clases de carreras inician el 1 de octubre de 2026.",
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI Components
// ─────────────────────────────────────────────────────────────────────────────

function Header({ fullName, role }: { fullName: string; role: string }) {
  const roleLabel: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Administrador",
    coordinacion: "Coordinación Académica",
    docente: "Docente",
  };

  return (
    <header className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FBBC0C]">
        <Sparkles className="size-4" />
        PANEL DOCENTE
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold font-[family-name:var(--font-space-grotesk)] leading-tight">
        Hola, {fullName.split(" ")[0] ?? "Docente"}
      </h1>
      <p className="text-sm text-white/65 max-w-2xl">
        {roleLabel[role] ?? role} · Tus productos están agrupados por tipo.
        Selecciona uno para entrar a tu vista de clase.
      </p>
    </header>
  );
}

function PreuniCard({
  cohortLabel,
  enrolledCount,
  startsLabel,
}: {
  cohortLabel: string;
  enrolledCount: number;
  startsLabel: string;
}) {
  return (
    <Link
      href="/docente/preuni"
      className="group relative overflow-hidden rounded-2xl border-2 border-[#F0846D]/40 bg-gradient-to-br from-[#F0846D]/15 to-[#FBBC0C]/10 p-6 transition-all hover:border-[#FBBC0C] hover:shadow-xl hover:shadow-[#F0846D]/10"
    >
      <div className="absolute -right-6 -top-6 size-32 rounded-full bg-[#F0846D]/20 blur-2xl group-hover:bg-[#F0846D]/30 transition-all" />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F0846D]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F0846D]">
            <GraduationCap className="size-3" />
            Preuniversitario IGNITE
          </span>
          <ArrowRight className="size-4 text-white/40 group-hover:text-[#FBBC0C] group-hover:translate-x-1 transition-all" />
        </div>

        <div>
          <h3 className="text-xl font-bold leading-tight">{cohortLabel}</h3>
          <p className="mt-2 text-sm text-white/70">{startsLabel}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
          <Stat icon={<Users className="size-3.5" />} value={enrolledCount} label="alumnos" />
          <Stat icon={<Calendar className="size-3.5" />} value={20} label="sesiones" />
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FBBC0C] group-hover:underline">
            Ir a mi clase del Preuni
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CursosProCard({
  courses,
  activeStudents,
  nextStart,
}: {
  courses: CursoProRow[];
  activeStudents: number;
  nextStart: string | null;
}) {
  const subtitle =
    courses.length === 0
      ? "Sin cursos activos asignados"
      : `${courses.length} curso${courses.length === 1 ? "" : "s"} activo${
          courses.length === 1 ? "" : "s"
        } · ${activeStudents} alumno${activeStudents === 1 ? "" : "s"}${
          nextStart ? ` · arranca ${formatShortDate(nextStart)}` : ""
        }`;

  return (
    <Link
      href="/cursos-pro/docente"
      className="group relative overflow-hidden rounded-2xl border-2 border-[#73B8E7]/40 bg-gradient-to-br from-[#73B8E7]/15 to-[#FBBC0C]/10 p-6 transition-all hover:border-[#FBBC0C] hover:shadow-xl hover:shadow-[#73B8E7]/10"
    >
      <div className="absolute -right-6 -top-6 size-32 rounded-full bg-[#73B8E7]/20 blur-2xl group-hover:bg-[#73B8E7]/30 transition-all" />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#73B8E7]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#73B8E7]">
            <Briefcase className="size-3" />
            Cursos Profesionales
          </span>
          <ArrowRight className="size-4 text-white/40 group-hover:text-[#FBBC0C] group-hover:translate-x-1 transition-all" />
        </div>

        <div>
          <h3 className="text-xl font-bold leading-tight">
            {courses[0]?.name ?? "Cohortes activas"}
          </h3>
          <p className="mt-2 text-sm text-white/70">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
          <Stat
            icon={<BookOpen className="size-3.5" />}
            value={courses.length}
            label="cursos"
          />
          <Stat
            icon={<Users className="size-3.5" />}
            value={activeStudents}
            label="alumnos"
          />
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FBBC0C] group-hover:underline">
            Ir a mis cursos profesionales
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CarrerasCard({ note }: { note: string }) {
  return (
    <Link
      href="/teacher"
      className="group relative overflow-hidden rounded-2xl border-2 border-white/10 bg-white/[0.03] p-6 transition-all hover:border-white/30 hover:bg-white/[0.05]"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
            <GraduationCap className="size-3" />
            Carreras 3er Nivel
          </span>
          <ArrowRight className="size-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
        </div>

        <div>
          <h3 className="text-xl font-bold leading-tight text-white/85">
            Planificación curricular
          </h3>
          <p className="mt-2 text-sm text-white/55">
            Inicio: octubre 2026 · 3 carreras (IA, Ciencia de Datos, Big Data)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
          <Stat
            icon={<BookOpen className="size-3.5" />}
            value={3}
            label="carreras"
            muted
          />
          <Stat
            icon={<Clock className="size-3.5" />}
            value="6 sem"
            label="duración"
            muted
          />
        </div>

        <div className="pt-2 space-y-1">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 group-hover:underline">
            Ver malla y materias
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
          <p className="text-[11px] text-white/40 leading-snug">{note}</p>
        </div>
      </div>
    </Link>
  );
}

function Stat({
  icon,
  value,
  label,
  muted = false,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  muted?: boolean;
}) {
  return (
    <div className={`rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 ${muted ? "opacity-70" : ""}`}>
      <div className="flex items-center gap-1.5 text-white/60">
        {icon}
        <span className="text-lg font-extrabold text-white font-[family-name:var(--font-space-grotesk)]">
          {value}
        </span>
      </div>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/45">
        {label}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-10 text-center">
      <Sparkles className="mx-auto size-10 text-white/30" />
      <p className="mt-4 text-sm font-semibold text-white/80">
        Aún no tienes productos asignados.
      </p>
      <p className="mt-2 text-xs text-white/50 max-w-md mx-auto">
        Pídele a Coordinación Académica que te asigne un curso, una materia o
        la cohorte del Preuniversitario.
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="pt-8 border-t border-white/10">
      <p className="text-[11px] text-white/40 text-center">
        ITSEIA Academy — Panel Docente Unificado · Tres productos, una vista.
      </p>
    </footer>
  );
}

function formatShortDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-EC", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
}
