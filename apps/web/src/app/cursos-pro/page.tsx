import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Clock,
  Layers,
  BookOpen,
  ArrowRight,
  MessageCircle,
  Play,
  GraduationCap,
  Award,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STEVEEN_MODULOS, STEVEEN_TEMAS } from "./_data/steveen-data";

export const metadata: Metadata = {
  title: "Panel Profesional | ITSEIA Academy",
  description:
    "Dashboard del estudiante de Cursos Profesionales ITSEIA — IA Aplicada para Ingeniería Industrial.",
};

// ─── Catálogo de cursos profesionales disponibles ────────────────────────────
// Hoy publicamos un solo curso piloto ($197). Más cursos se sumarán al catálogo
// cuando estén producidos. La estructura permite expandir sin romper el panel.

interface CursoPro {
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  precio: string;
  precioNumero: number;
  horas: number;
  modulos: number;
  temas: number;
  nivel: string;
  categoria: string;
  destacado: boolean;
}

const CURSOS_PRO: CursoPro[] = [
  {
    slug: "steveen-pinchao",
    titulo: "IA Aplicada para Ingeniería Industrial",
    subtitulo: "Curso Estándar — 8 módulos · 40 temas · 60 horas",
    descripcion:
      "Domina ChatGPT, Claude y Copilot Excel aplicados a producción, mantenimiento predictivo, control de calidad y cadena de suministro. Cliente piloto: Ing. Steveen Pinchao.",
    precio: "$197",
    precioNumero: 197,
    horas: 60,
    modulos: STEVEEN_MODULOS.length,
    temas: STEVEEN_TEMAS.length,
    nivel: "Profesional",
    categoria: "Ingeniería Industrial",
    destacado: true,
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CursosProDashboardPage() {
  const authClient = await createClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile server-side (bypasses RLS) para nombre de bienvenida
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const fullName  = profile?.full_name ?? user.email?.split("@")[0] ?? "Estudiante";
  const firstName = fullName.split(" ")[0];

  // Verificar enrollment al curso piloto Steveen.
  // Schema nuevo (migration 017): cursos_pro_enrollments(profile_id, course_id, status)
  // → join con cursos_pro_courses para filtrar por slug.
  // No rompemos si la tabla aún no existe — devolvemos false y mostramos CTA "Inscríbete".
  let enrolledSteveen = false;
  try {
    const { data: enrollment } = await supabaseAdmin
      .from("cursos_pro_enrollments")
      .select("course_id, status, cursos_pro_courses!inner(slug)")
      .eq("profile_id", user.id)
      .eq("status", "active")
      .eq("cursos_pro_courses.slug", "steveen-pinchao")
      .maybeSingle();
    enrolledSteveen = Boolean(enrollment);
  } catch {
    enrolledSteveen = false;
  }

  // Fallback: también consideramos el enrollment genérico del modelo viejo
  // si tiene un programa con slug que coincida.
  if (!enrolledSteveen) {
    try {
      const { data: legacyEnrollment } = await supabaseAdmin
        .from("enrollments")
        .select("id, programs(slug)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      type ProgramRow = { slug: string };
      const rawPrograms = legacyEnrollment?.programs as unknown;
      const program: ProgramRow | null = Array.isArray(rawPrograms)
        ? (rawPrograms[0] as ProgramRow) ?? null
        : (rawPrograms as ProgramRow | null) ?? null;
      if (program?.slug === "steveen-pinchao" || program?.slug === "ia-ingenieria-industrial") {
        enrolledSteveen = true;
      }
    } catch {
      // ignorar
    }
  }

  const cursoSteveen = CURSOS_PRO[0];

  // ── Cursos comprados desde BD (cohorte real: Gisela + Josselin junio 2026) ──
  // Devolvemos sus cursos activos para mostrarlos como cards al inicio.
  type EnrolledCourse = {
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
  };
  let cursosComprados: EnrolledCourse[] = [];
  try {
    const { data: enrollmentsRows } = await supabaseAdmin
      .from("cursos_pro_enrollments")
      .select(
        "course_id, status, cursos_pro_courses!inner(slug, name, subtitle, category, price_usd, total_modules, total_sessions, total_hours, start_date, end_date, is_active)"
      )
      .eq("profile_id", user.id)
      .eq("status", "active");
    type Row = {
      cursos_pro_courses:
        | (EnrolledCourse & { is_active: boolean })
        | (EnrolledCourse & { is_active: boolean })[]
        | null;
    };
    cursosComprados = ((enrollmentsRows as Row[] | null) ?? [])
      .map((r) => {
        const c = Array.isArray(r.cursos_pro_courses)
          ? r.cursos_pro_courses[0]
          : r.cursos_pro_courses;
        return c ?? null;
      })
      .filter((c): c is EnrolledCourse & { is_active: boolean } => Boolean(c && c.is_active))
      .map(({ is_active: _ia, ...rest }) => rest);
  } catch {
    cursosComprados = [];
  }

  return (
    <div className="space-y-10">

      {/* ── Welcome header ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
              PANEL CURSOS PROFESIONALES
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bienvenido, {firstName}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              {enrolledSteveen
                ? "Continúa tu curso. Las 7 pestañas de cada tema te esperan."
                : "Explora el curso profesional disponible y empieza a aplicar IA en tu trabajo."}
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

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Layers className="size-5 text-[#73B8E7]" />}
          label="Módulos"
          value={String(cursoSteveen.modulos)}
          sub="estructurados por etapa"
          accent="bg-[#73B8E7]/10"
        />
        <StatCard
          icon={<BookOpen className="size-5 text-[#FBBC0C]" />}
          label="Temas"
          value={String(cursoSteveen.temas)}
          sub="con video, quiz y AI Lab"
          accent="bg-[#FBBC0C]/10"
        />
        <StatCard
          icon={<Clock className="size-5 text-[#F0846D]" />}
          label="Horas"
          value={String(cursoSteveen.horas)}
          sub="de aprendizaje aplicado"
          accent="bg-[#F0846D]/10"
        />
      </div>

      {/* ── Cursos comprados (BD: cohorte real) ─────────────────────────────── */}
      {cursosComprados.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-[#FBBC0C]" />
            Tus Cursos Activos
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {cursosComprados.map((c) => (
              <Link
                key={c.slug}
                href={`/cursos-pro/c/${c.slug}`}
                className="group block rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-[#FBBC0C]/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Badge className="border-none bg-[#FBBC0C]/15 text-[10px] font-semibold uppercase tracking-wider text-[#FBBC0C]">
                    Curso Activo · ${c.price_usd}
                  </Badge>
                  <ArrowRight className="size-4 text-[#1F2F58]/40 group-hover:text-[#FBBC0C] group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-[#0A1628] leading-tight">
                  {c.name}
                </h3>
                {c.subtitle && (
                  <p className="mt-1 text-xs text-[#1F2F58]/60">{c.subtitle}</p>
                )}
                <div className="mt-4 flex items-center gap-4 text-[11px] font-medium text-[#1F2F58]/55">
                  <span className="flex items-center gap-1">
                    <Layers className="size-3" /> {c.total_modules} módulos
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="size-3" /> {c.total_sessions} sesiones
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {c.total_hours}h
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Curso Steveen card ──────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <GraduationCap className="size-5 text-[#73B8E7]" />
          {enrolledSteveen ? "Tu Curso Activo" : "Curso Disponible"}
        </h2>

        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="bg-gradient-to-br from-[#1F2F58]/8 to-[#0A1628]/5 px-6 py-5 border-b border-border">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#FBBC0C]/15">
                <Sparkles className="size-6 text-[#FBBC0C]" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="border-none bg-[#FBBC0C]/15 text-[10px] font-semibold uppercase tracking-wider text-[#FBBC0C]">
                    Curso Estándar · {cursoSteveen.precio}
                  </Badge>
                  <Badge className="border-none bg-[#73B8E7]/15 text-[10px] font-semibold uppercase tracking-wider text-[#517CBE]">
                    {cursoSteveen.categoria}
                  </Badge>
                  {cursoSteveen.destacado && (
                    <Badge className="border-none bg-[#F0846D]/15 text-[10px] font-semibold uppercase tracking-wider text-[#F0846D]">
                      Piloto 2026
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0A1628] leading-tight">
                  {cursoSteveen.titulo}
                </h3>
                <p className="mt-0.5 text-xs text-[#1F2F58]/50 font-medium">
                  {cursoSteveen.subtitulo}
                </p>
                <p className="mt-2 text-sm text-[#1F2F58]/70 leading-relaxed">
                  {cursoSteveen.descripcion}
                </p>
              </div>
            </div>
          </div>

          {/* Stats inline */}
          <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
            <InlineStat label="Módulos" value={String(cursoSteveen.modulos)} icon={<Layers className="size-3.5" />} />
            <InlineStat label="Temas" value={String(cursoSteveen.temas)} icon={<BookOpen className="size-3.5" />} />
            <InlineStat label="Horas" value={String(cursoSteveen.horas)} icon={<Clock className="size-3.5" />} />
          </div>

          {/* Action buttons */}
          <div className="px-6 py-5">
            {enrolledSteveen ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href={`/cursos-pro/${cursoSteveen.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1F2F58] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0A1628] transition-colors"
                >
                  <Play className="size-3.5" />
                  Continuar curso
                </Link>
                <Link
                  href={`/cursos-pro/${cursoSteveen.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1F2F58]/15 bg-white px-5 py-2.5 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
                >
                  Ver módulos
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-[#1F2F58]/50">Acceso de por vida + certificado ITSEIA</p>
                  <p className="text-2xl font-black text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
                    {cursoSteveen.precio}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20al%20curso%20IA%20Aplicada%20para%20Ingenier%C3%ADa%20Industrial%20%24197"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FBBC0C] px-5 py-2.5 text-sm font-bold text-[#0A1628] hover:bg-[#f5b300] transition-colors"
                  >
                    Inscríbete por {cursoSteveen.precio}
                    <ArrowRight className="size-3.5" />
                  </a>
                  <Link
                    href={`/cursos-pro/${cursoSteveen.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1F2F58]/15 bg-white px-5 py-2.5 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
                  >
                    Ver contenido
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Beneficios incluidos ────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Qué incluye tu curso profesional
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<BookOpen className="size-5 text-[#73B8E7]" />}
            title="7 pestañas por tema"
            description="Video, presentación, teoría, quiz, ejercicio, AI Lab y recursos."
            bg="bg-[#73B8E7]/10"
          />
          <FeatureCard
            icon={<Award className="size-5 text-[#FBBC0C]" />}
            title="Certificado ITSEIA"
            description="Al completar el 100% recibes certificado profesional ITSEIA."
            bg="bg-[#FBBC0C]/10"
          />
          <FeatureCard
            icon={<MessageCircle className="size-5 text-[#F0846D]" />}
            title="Soporte WhatsApp"
            description="Resuelve dudas con nuestro equipo durante todo el curso."
            bg="bg-[#F0846D]/10"
          />
        </div>
      </section>
    </div>
  );
}

// ─── Helper components ───────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <Card className="border-none bg-white shadow-sm">
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
    </Card>
  );
}

function InlineStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-3 py-4 text-center">
      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[#1F2F58]/40">
        {icon}
        {label}
      </span>
      <span className="mt-1 text-lg font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
        {value}
      </span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bg: string;
}) {
  return (
    <Card className="border-none bg-white shadow-sm">
      <CardContent className="flex items-start gap-4">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
          {icon}
        </div>
        <div>
          <p className="font-semibold text-[#0A1628]">{title}</p>
          <p className="mt-0.5 text-xs text-[#1F2F58]/60 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
