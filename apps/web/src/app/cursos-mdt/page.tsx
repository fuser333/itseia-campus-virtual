import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  BookOpen,
  TrendingUp,
  Award,
  ArrowRight,
  MessageCircle,
  GraduationCap,
  Briefcase,
  Rocket,
  Building2,
  BarChart2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CURSOS_MDT, type CursoMDT } from "./data";

export const metadata: Metadata = {
  title: "Panel Cursos MDT | ITSEIA Academy",
  description:
    "Gestiona tus cursos de Manejo de Tecnología de ITSEIA — progreso, certificados y catálogo completo.",
};

// ─── Discover ITSEIA links ────────────────────────────────────────────────────

const DESCUBRE_ITSEIA = [
  {
    href: "/carreras",
    label: "Carreras de IA",
    description: "3 años · título de tercer nivel",
    icon: GraduationCap,
    accent: "#73B8E7",
    bg: "bg-[#73B8E7]/10",
  },
  {
    href: "/catalogo",
    label: "Cursos Pro",
    description: "Express $97 · Estándar $197 · Completo $297",
    icon: BookOpen,
    accent: "#FBBC0C",
    bg: "bg-[#FBBC0C]/10",
  },
  {
    href: "/bootcamp",
    label: "Bootcamp IA",
    description: "Intensivo · resultados en semanas",
    icon: Rocket,
    accent: "#F0846D",
    bg: "bg-[#F0846D]/10",
  },
  {
    href: "/b2b",
    label: "B2B Corporativo",
    description: "Capacita a tu equipo completo",
    icon: Building2,
    accent: "#1F2F58",
    bg: "bg-[#1F2F58]/10",
  },
  {
    href: "https://h3l.ai",
    label: "H3L",
    description: "Auditoría operativa con IA",
    icon: BarChart2,
    accent: "#517CBE",
    bg: "bg-[#517CBE]/10",
    external: true,
  },
];

// ─── Simulated enrollment data (replace with real Supabase query when ready) ──

interface EnrollmentSimulado {
  cursoSlug: string;
  progreso: number; // 0-100
  estado: "activo" | "completado" | "pausado";
}

async function getEnrollmentsMDT(userId: string): Promise<EnrollmentSimulado[]> {
  // Query real: busca inscripciones a cursos MDT.
  // Por ahora devuelve un arreglo vacío hasta que la tabla cursos_mdt_enrollments exista.
  try {
    const { data } = await supabaseAdmin
      .from("cursos_mdt_enrollments")
      .select("curso_slug, progreso, estado")
      .eq("user_id", userId)
      .eq("activo", true);

    if (data && data.length > 0) {
      return data.map((row) => ({
        cursoSlug: row.curso_slug as string,
        progreso: (row.progreso as number) ?? 0,
        estado: (row.estado as "activo" | "completado" | "pausado") ?? "activo",
      }));
    }
  } catch {
    // Tabla aún no existe — retorna vacío sin romper la página
  }

  return [];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CursosMdtPage() {
  const authClient = await createClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Profile para nombre de bienvenida
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name ?? user.email?.split("@")[0] ?? "Estudiante";
  const firstName = displayName.split(" ")[0];

  // Inscripciones MDT del usuario
  const enrollments = await getEnrollmentsMDT(user.id);

  const cursosInscritos = enrollments.length;
  const cursosCompletados = enrollments.filter((e) => e.estado === "completado").length;
  const progresoPromedio =
    cursosInscritos > 0
      ? Math.round(
          enrollments.reduce((acc, e) => acc + e.progreso, 0) / cursosInscritos,
        )
      : 0;

  // Cursos activos con datos de CURSOS_MDT
  const cursosActivos = enrollments
    .filter((e) => e.estado === "activo")
    .map((e) => ({
      enrollment: e,
      curso: CURSOS_MDT.find((c) => c.slug === e.cursoSlug),
    }))
    .filter((item): item is { enrollment: EnrollmentSimulado; curso: CursoMDT } =>
      item.curso !== undefined,
    );

  return (
    <div className="space-y-10">

      {/* ── Welcome header ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
              PANEL CURSOS MDT
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bienvenido, {firstName}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Aquí gestionas tus cursos de Manejo de Tecnología de ITSEIA.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20necesito%20soporte%20con%20mis%20cursos%20MDT%20de%20ITSEIA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
            >
              <MessageCircle className="size-4" />
              Soporte WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Stats KPI cards ──────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={<BookOpen className="size-5 text-[#73B8E7]" />}
          label="Cursos Inscritos"
          value={String(cursosInscritos)}
          sub={cursosInscritos === 1 ? "curso activo" : "cursos activos"}
          accent="bg-[#73B8E7]/10"
        />
        <KpiCard
          icon={<TrendingUp className="size-5 text-[#FBBC0C]" />}
          label="Progreso Promedio"
          value={cursosInscritos > 0 ? `${progresoPromedio}%` : "—"}
          sub={cursosInscritos > 0 ? "avance en todos tus cursos" : "aún no tienes cursos"}
          accent="bg-[#FBBC0C]/10"
        />
        <KpiCard
          icon={<Award className="size-5 text-[#F0846D]" />}
          label="Certificados"
          value={String(cursosCompletados)}
          sub={cursosCompletados === 1 ? "curso completado" : "cursos completados"}
          accent="bg-[#F0846D]/10"
          href="/certificates"
        />
      </div>

      {/* ── Cursos activos con progreso ──────────────────────────────────────── */}
      {cursosActivos.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="size-5 text-[#73B8E7]" />
            Mis Cursos Activos
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cursosActivos.map(({ enrollment, curso }) => (
              <Link
                key={curso.slug}
                href={`/cursos-mdt/${curso.slug}`}
                className="group block"
              >
                <Card className="border-none bg-white shadow-sm hover:shadow-md transition-all group-hover:-translate-y-0.5">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-[#1F2F58]/8">
                        <BookOpen className="size-5 text-[#1F2F58]" />
                      </div>
                      <Badge className="border-none bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider">
                        Activo
                      </Badge>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A1628] leading-tight">
                        {curso.nombre}
                      </p>
                      <p className="text-xs text-[#1F2F58]/40 mt-0.5">
                        {curso.horas}h · {curso.precio}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#1F2F58]/50">Progreso</span>
                        <span className="text-xs font-semibold text-[#1F2F58]">
                          {enrollment.progreso}%
                        </span>
                      </div>
                      <Progress
                        value={enrollment.progreso}
                        className="h-1.5 bg-[#1F2F58]/10"
                      />
                    </div>
                    <div className="flex items-center justify-end pt-1">
                      <span className="text-xs font-semibold text-[#1F2F58]/40 flex items-center gap-1 group-hover:text-[#1F2F58]/70 group-hover:gap-1.5 transition-all">
                        Continuar
                        <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Estado vacío — si no tiene cursos inscritos ──────────────────────── */}
      {cursosInscritos === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-[#1F2F58]/15 p-10 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#FBBC0C]/10">
            <BookOpen className="size-7 text-[#FBBC0C]" />
          </div>
          <h3 className="text-lg font-bold text-[#0A1628]">
            Aún no tienes cursos MDT
          </h3>
          <p className="mt-1 text-sm text-[#1F2F58]/50">
            Explora el catálogo y elige el primero — todos desde $99.
          </p>
          <Link
            href="/cursos-mdt/catalogo"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FBBC0C] px-6 py-2.5 text-sm font-bold text-[#0A1628] hover:bg-[#f5b300] transition-colors"
          >
            Ver catálogo completo
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}

      {/* ── Descubre ITSEIA ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-1 text-xl font-bold text-foreground flex items-center gap-2">
          <Briefcase className="size-5 text-[#73B8E7]" />
          Descubre ITSEIA
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Más opciones para acelerar tu carrera en Inteligencia Artificial.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESCUBRE_ITSEIA.map((item) => {
            const Icon = item.icon;
            const inner = (
              <Card className="group cursor-pointer border-none bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="flex items-center gap-4">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${item.bg} transition-transform group-hover:scale-110`}
                  >
                    <Icon className="size-5" style={{ color: item.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0A1628]">{item.label}</p>
                    <p className="text-xs text-[#1F2F58]/50 truncate">
                      {item.description}
                    </p>
                  </div>
                  {item.external ? (
                    <ExternalLink className="ml-auto size-4 text-[#1F2F58]/20 flex-shrink-0 transition-all group-hover:text-[#1F2F58]/50" />
                  ) : (
                    <ArrowRight className="ml-auto size-4 text-[#1F2F58]/20 flex-shrink-0 transition-all group-hover:translate-x-1 group-hover:text-[#1F2F58]/50" />
                  )}
                </CardContent>
              </Card>
            );

            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {inner}
                </a>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                {inner}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── CUENTA quick actions ─────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Mi Cuenta
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <QuickAction
            href="https://wa.me/593959892034?text=Hola%2C%20necesito%20soporte%20con%20mis%20cursos%20MDT"
            icon={<MessageCircle className="size-5" />}
            title="Chat Soporte"
            description="WhatsApp directo con administración"
            color="text-[#73B8E7]"
            bg="bg-[#73B8E7]/10"
            external
          />
          <QuickAction
            href="/certificates"
            icon={<Award className="size-5" />}
            title="Descargar Certificados"
            description="Tus certificados de cursos completados"
            color="text-[#FBBC0C]"
            bg="bg-[#FBBC0C]/10"
          />
          <QuickAction
            href="/payments"
            icon={<TrendingUp className="size-5" />}
            title="Mis Pagos"
            description="Historial de pagos y facturas"
            color="text-[#F0846D]"
            bg="bg-[#F0846D]/10"
          />
        </div>
      </section>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function KpiCard({
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
  const content = (
    <CardContent className="flex items-center gap-4">
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent}`}
      >
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
          {content}
        </Card>
      </Link>
    );
  }

  return (
    <Card className="border-none bg-white shadow-sm">
      {content}
    </Card>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
  color,
  bg,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bg: string;
  external?: boolean;
}) {
  const inner = (
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
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return <Link href={href}>{inner}</Link>;
}
