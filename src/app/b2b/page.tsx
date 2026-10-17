import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Building2,
  Users,
  BookOpen,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Mail,
  MessageCircle,
  Brain,
  BarChart2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dashboard Corporativo | ITSEIA Academy",
  description:
    "Panel corporativo ITSEIA — gestiona la capacitacion en IA de tu equipo.",
};

// ─── Partner companies config ────────────────────────────────────────────────

const PARTNER_COMPANIES = [
  {
    name: "H3L",
    tagline: "Auditoria operativa con IA",
    description:
      "Identifica $150K–$800K de capacidad atrapada en tu empresa. Opera en 7 paises.",
    url: "https://h3l.ai",
    color: "from-[#1F2F58] to-[#0A1628]",
    accent: "#73B8E7",
    icon: Building2,
    badge: "Auditoria IA",
  },
  {
    name: "ImagemIA",
    tagline: "IA predictiva en imagenologia medica",
    description:
      "Reduce inasistencias un 30% y optimiza la agenda clinica con inteligencia artificial.",
    url: "https://imagemia.com",
    color: "from-[#0A1628] to-[#1F2F58]",
    accent: "#F0846D",
    icon: Brain,
    badge: "IA Medica",
  },
  {
    name: "Strata",
    tagline: "Cerebro digital profesional",
    description:
      "9,000 documentos indexados, 19 paises, desde $19.99/mes. Tu knowhow siempre disponible.",
    url: "https://strata.h3l.ai",
    color: "from-[#1F2F58] to-[#2A3F6E]",
    accent: "#FBBC0C",
    icon: BarChart2,
    badge: "Gestion Conocimiento",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function B2BDashboardPage() {
  const authClient = await createClient();
  const supabase   = supabaseAdmin;

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile to get company name and role
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Only B2B/finanzas role should access this page
  if (profile && profile.role !== "finanzas") {
    redirect("/dashboard");
  }

  // Fetch enrollments for this user's company (user = corporate contact)
  // In the current schema the "finanzas" user IS the empresa user.
  // We show their own enrollments + any enrollments managed by them.
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, programs(*)")
    .eq("user_id", user.id)
    .eq("status", "active");

  const activeCourses   = enrollments?.length ?? 0;
  const companyName     = profile?.full_name ?? user.email?.split("@")[0] ?? "Tu Empresa";
  const firstName       = companyName.split(" ")[0];

  // Calculate approximate investment
  const totalInvestment = (enrollments ?? []).reduce(
    (acc, e) => acc + (e.programs?.price ?? 0),
    0,
  );

  return (
    <div className="space-y-10">

      {/* ── Welcome header ──────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
              Panel Corporativo
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bienvenido, {firstName}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Aqui gestionas la capacitacion en Inteligencia Artificial de tu equipo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20soy%20empresa%20cliente%20ITSEIA%20y%20necesito%20soporte"
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

      {/* ── KPI cards ───────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={<Users className="size-5 text-[#73B8E7]" />}
          label="Miembros del Equipo"
          value="—"
          sub="Proximamente"
          accent="bg-[#73B8E7]/10"
        />
        <KpiCard
          icon={<BookOpen className="size-5 text-[#FBBC0C]" />}
          label="Capacitaciones Activas"
          value={String(activeCourses)}
          sub={activeCourses === 1 ? "programa activo" : "programas activos"}
          accent="bg-[#FBBC0C]/10"
        />
        <KpiCard
          icon={<TrendingUp className="size-5 text-[#F0846D]" />}
          label="Inversion Total"
          value={totalInvestment > 0 ? `$${totalInvestment.toLocaleString()}` : "—"}
          sub="Ver facturacion"
          accent="bg-[#F0846D]/10"
          href="/payments"
        />
      </div>

      {/* ── Active programs ──────────────────────────────────────────────── */}
      {(enrollments ?? []).length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="size-5 text-[#73B8E7]" />
            Capacitacion Activa
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(enrollments ?? []).map((enrollment) => {
              const prog = enrollment.programs as { id?: string; slug?: string; name?: string; type?: string; duration_months?: number } | null;
              const courseLink = prog?.slug
                ? `/carreras/${prog.slug}`
                : `/b2b/curso/${prog?.id ?? enrollment.program_id}`;

              return (
                <Link
                  key={enrollment.id}
                  href={courseLink}
                  className="group block"
                >
                  <Card className="border-none bg-white shadow-sm hover:shadow-md transition-all group-hover:-translate-y-0.5">
                    <CardContent className="p-5 space-y-3">
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
                          {prog?.name ?? "Programa"}
                        </p>
                        {prog?.duration_months && (
                          <p className="text-xs text-[#1F2F58]/40 mt-0.5">
                            {prog.duration_months} meses
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-end pt-1">
                        <span className="text-xs font-semibold text-[#1F2F58]/40 flex items-center gap-1 group-hover:text-[#1F2F58]/70 group-hover:gap-1.5 transition-all">
                          Ir al curso
                          <ArrowRight className="size-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ITSEIA Partner Companies ─────────────────────────────────────── */}
      <div>
        <h2 className="mb-1 text-xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="size-5 text-[#73B8E7]" />
          Nuestras Empresas
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          El ecosistema de empresas de IA del fundador de ITSEIA, disponibles para tu organizacion.
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {PARTNER_COMPANIES.map((company) => {
            const Icon = company.icon;
            return (
              <a
                key={company.name}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden border border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header gradient */}
                <div className={`bg-gradient-to-br ${company.color} p-5 text-white`}>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-xl"
                      style={{ background: `${company.accent}20` }}
                    >
                      <Icon className="size-5" style={{ color: company.accent }} />
                    </div>
                    <ExternalLink className="size-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <p className="text-lg font-bold">{company.name}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: company.accent }}>
                    {company.tagline}
                  </p>
                </div>
                {/* Body */}
                <div className="bg-white p-4">
                  <Badge
                    className="mb-3 border-none text-[10px] font-semibold uppercase tracking-wider"
                    style={{ background: `${company.accent}15`, color: company.accent }}
                  >
                    {company.badge}
                  </Badge>
                  <p className="text-sm text-[#1F2F58]/60 leading-relaxed">
                    {company.description}
                  </p>
                  <p
                    className="mt-3 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                    style={{ color: company.accent }}
                  >
                    Visitar sitio web
                    <ArrowRight className="size-3" />
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Quick actions ────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickAction
          href="/b2b/team"
          icon={<Users className="size-5" />}
          title="Mi Equipo"
          description="Gestiona los miembros y accesos"
          color="text-[#73B8E7]"
          bg="bg-[#73B8E7]/10"
        />
        <QuickAction
          href="/b2b/reportes"
          icon={<BarChart2 className="size-5" />}
          title="Reportes"
          description="Progreso y avance del equipo"
          color="text-[#FBBC0C]"
          bg="bg-[#FBBC0C]/10"
        />
        <QuickAction
          href={`mailto:administracion@itseia.ai?subject=Soporte%20Corporativo%20ITSEIA`}
          icon={<Mail className="size-5" />}
          title="Contactar Admin"
          description="administracion@itseia.ai"
          color="text-[#F0846D]"
          bg="bg-[#F0846D]/10"
          external
        />
      </div>
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
