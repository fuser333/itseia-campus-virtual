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
  Building2,
  BarChart2,
  ExternalLink,
  Code2,
  Brain,
  Zap,
  FolderKanban,
  Calendar,
  Sparkles,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BOOTCAMP_MES1_MODULOS, BOOTCAMP_MES1_SESIONES } from "./_data/mes1-data";

export const metadata: Metadata = {
  title: "Dashboard Bootcamp | ITSEIA Academy",
  description:
    "Bootcamp Intensivo de IA — 12 semanas, 48 sesiones, 3 proyectos. Mes 1 disponible.",
};

// ─── Module visual config (color por módulo) ────────────────────────────────

const MODULO_VISUAL: Record<number, { color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  1: { color: "#73B8E7", bg: "bg-[#73B8E7]/10", icon: Brain },
  2: { color: "#FBBC0C", bg: "bg-[#FBBC0C]/10", icon: Sparkles },
  3: { color: "#F0846D", bg: "bg-[#F0846D]/10", icon: Zap },
  4: { color: "#73B8E7", bg: "bg-[#73B8E7]/10", icon: FolderKanban },
};

// ─── Discover ITSEIA links ──────────────────────────────────────────────────

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
    href: "/cursos-mdt",
    label: "Cursos MDT",
    description: "15 cursos certificados Ministerio del Trabajo",
    icon: BookOpen,
    accent: "#FBBC0C",
    bg: "bg-[#FBBC0C]/10",
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

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function BootcampPage() {
  const authClient = await createClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login?module=bootcamp");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name ?? user.email?.split("@")[0] ?? "Estudiante";
  const firstName = displayName.split(" ")[0];

  // Agrupar sesiones por módulo
  const sesionesPorModulo = BOOTCAMP_MES1_MODULOS.map((m) => ({
    ...m,
    sesiones: BOOTCAMP_MES1_SESIONES.filter((s) => s.moduloNum === m.num),
  }));

  const totalSesiones = BOOTCAMP_MES1_SESIONES.length;
  const totalHoras = BOOTCAMP_MES1_MODULOS.reduce((acc, m) => acc + m.horas, 0);
  const sesionesConSlides = BOOTCAMP_MES1_SESIONES.filter((s) => s.slidesUrl).length;

  return (
    <div className="space-y-10">
      {/* ── Welcome header ──────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
              BOOTCAMP INTENSIVO DE IA · MES 1
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bienvenido, {firstName}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              4 módulos · {totalSesiones} sesiones · {totalHoras} horas — Fundamentos hasta tu primer MVP.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20necesito%20soporte%20con%20el%20Bootcamp%20Intensivo%20de%20IA"
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

      {/* ── KPI cards ──────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={<Code2 className="size-5 text-[#73B8E7]" />}
          label="Módulos del Mes 1"
          value={String(BOOTCAMP_MES1_MODULOS.length)}
          sub="ruta completa de fundamentos a MVP"
          accent="bg-[#73B8E7]/10"
        />
        <KpiCard
          icon={<PlayCircle className="size-5 text-[#FBBC0C]" />}
          label="Sesiones Disponibles"
          value={String(totalSesiones)}
          sub={`${sesionesConSlides} con presentación Gamma`}
          accent="bg-[#FBBC0C]/10"
        />
        <KpiCard
          icon={<TrendingUp className="size-5 text-[#F0846D]" />}
          label="Horas de Contenido"
          value={`${totalHoras}h`}
          sub="teoría + presentación + quiz + ejercicio"
          accent="bg-[#F0846D]/10"
        />
      </div>

      {/* ── Módulos del Mes 1 ──────────────────────────────────────────── */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0A1628] flex items-center gap-2">
              <Calendar className="size-5 text-[#73B8E7]" />
              Mes 1 — Contenido del Bootcamp
            </h2>
            <p className="text-sm text-[#1F2F58]/70 mt-1">
              4 módulos × 4 sesiones — cada sesión tiene presentación Gamma, quiz y ejercicio práctico.
            </p>
          </div>
          <Badge className="border-none bg-[#FBBC0C]/15 text-[#FBBC0C] text-[10px] font-bold uppercase tracking-wider">
            Mes 1 activo
          </Badge>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {sesionesPorModulo.map((m) => {
            const visual = MODULO_VISUAL[m.num] ?? MODULO_VISUAL[1];
            const Icon = visual.icon;

            return (
              <Card key={m.num} className="border-none bg-white shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  {/* Header del módulo */}
                  <div className="flex items-center gap-4 p-5 border-b border-[#1F2F58]/[0.06]">
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${visual.bg}`}
                      style={{ color: visual.color }}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#1F2F58]/40">
                        Módulo {m.num} · {m.horas}h · {m.sesiones.length} sesiones
                      </p>
                      <p className="font-bold text-[#0A1628] leading-tight mt-0.5">
                        {m.nombre}
                      </p>
                    </div>
                  </div>

                  {/* Lista de sesiones */}
                  <ul className="divide-y divide-[#1F2F58]/[0.06]">
                    {m.sesiones.map((s, i) => {
                      const numero = `${m.num}.${i + 1}`;

                      return (
                        <li key={s.id}>
                          <Link href={`/bootcamp/sesion/${s.id}`} className="block">
                            <div className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[#1F2F58]/[0.03]">
                              <span
                                className="text-xs font-bold tabular-nums shrink-0 w-8"
                                style={{ color: visual.color }}
                              >
                                {numero}
                              </span>
                              <span className="flex-1 text-sm text-[#0A1628] leading-snug">
                                {s.titulo}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#1F2F58]/40 group-hover:text-[#1F2F58]/70 transition-colors">
                                Abrir sesión
                                <ArrowRight className="size-3" />
                              </span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Descubre ITSEIA ────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-1 text-xl font-bold text-[#0A1628] flex items-center gap-2">
          <Briefcase className="size-5 text-[#73B8E7]" />
          Descubre ITSEIA
        </h2>
        <p className="mb-6 text-sm text-[#1F2F58]/70">
          Más opciones para acelerar tu carrera en Inteligencia Artificial.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* ── Cuenta quick actions ───────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-[#0A1628]">
          Mi Cuenta
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <QuickAction
            href="https://wa.me/593959892034?text=Hola%2C%20necesito%20soporte%20con%20el%20Bootcamp"
            icon={<MessageCircle className="size-5" />}
            title="Chat Soporte"
            description="WhatsApp directo con instructores"
            color="text-[#73B8E7]"
            bg="bg-[#73B8E7]/10"
            external
          />
          <QuickAction
            href="/bootcamp/certificados"
            icon={<Award className="size-5" />}
            title="Certificados"
            description="Tus certificados del Bootcamp"
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

// ─── Helper components ──────────────────────────────────────────────────────

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
