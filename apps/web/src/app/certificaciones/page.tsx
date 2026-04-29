// ── /certificaciones ──────────────────────────────────────────────────────────
// Dashboard del estudiante: mis certificaciones, progreso y estado de programas.
// Server Component — auth guard, data fetch, render.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Award,
  TrendingUp,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Star,
  MessageCircle,
  ClipboardCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStudentCertifications } from "@/features/certifications/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CertificationProgram } from "@/types/database";

export const metadata: Metadata = {
  title: "Panel Certificaciones | ITSEIA Academy",
  description:
    "Dashboard de certificaciones ITSEIA — revisa tu progreso, certificados obtenidos y programas disponibles. AWS, Google y Azure.",
};

// ─── Certification program cards (static catalog visible to all) ───────────────

const CERT_PROGRAMS = [
  {
    slug: "aws-cloud-practitioner",
    nombre: "AWS Cloud Practitioner",
    proveedor: "AWS",
    nivel: "Fundacional",
    horas: 40,
    color: "from-[#FF9900]/20 to-[#FF9900]/5",
    accent: "#FF9900",
    description:
      "Domina los fundamentos de la nube de Amazon. Examen CLF-C02 reconocido mundialmente.",
  },
  {
    slug: "google-ai-essentials",
    nombre: "Google AI Essentials",
    proveedor: "Google",
    nivel: "Profesional",
    horas: 60,
    color: "from-[#4285F4]/20 to-[#4285F4]/5",
    accent: "#4285F4",
    description:
      "Fundamentos de IA con herramientas Google. Certificación del programa profesional de Google.",
  },
  {
    slug: "azure-ai-fundamentals",
    nombre: "Azure AI Fundamentals",
    proveedor: "Microsoft",
    nivel: "Fundacional",
    horas: 32,
    color: "from-[#00A4EF]/20 to-[#00A4EF]/5",
    accent: "#00A4EF",
    description:
      "Fundamentos de IA en la nube de Microsoft. Examen AI-900 reconocido en 190 países.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CertificacionesDashboardPage() {
  // ── Auth guard ────────────────────────────────────────────────────────────
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ── Profile ───────────────────────────────────────────────────────────────
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const firstName =
    profile?.full_name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "Estudiante";

  // ── Certification data ────────────────────────────────────────────────────
  const studentCerts = await getStudentCertifications(user.id);

  const obtained    = studentCerts.filter((c) => c.badge !== null).length;
  const inProgress  = studentCerts.filter((c) => c.badge === null).length;

  // Catalog count (programs not yet enrolled in)
  const enrolledIds = new Set(
    studentCerts.map((c) => c.program.slug)
  );
  const available = CERT_PROGRAMS.filter((p) => !enrolledIds.has(p.slug)).length;

  return (
    <div className="space-y-10">

      {/* ── Welcome header ─────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
              PANEL CERTIFICACIONES
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bienvenido, {firstName}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Certificaciones internacionales AWS, Google y Azure incluidas en tu mensualidad.
            </p>
          </div>
          <a
            href="https://wa.me/593959892034?text=Hola%2C%20necesito%20soporte%20con%20certificaciones%20ITSEIA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors self-start sm:self-center"
          >
            <MessageCircle className="size-4" />
            Soporte WhatsApp
          </a>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Award className="size-5 text-[#FBBC0C]" />}
          label="Certificados Obtenidos"
          value={String(obtained)}
          sub={obtained === 1 ? "certificado" : "certificados"}
          accent="bg-[#FBBC0C]/10"
          href="/certificaciones/obtenidos"
        />
        <StatCard
          icon={<TrendingUp className="size-5 text-[#73B8E7]" />}
          label="En Progreso"
          value={String(inProgress)}
          sub={inProgress === 1 ? "programa activo" : "programas activos"}
          accent="bg-[#73B8E7]/10"
          href="/certificaciones/progreso"
        />
        <StatCard
          icon={<Layers className="size-5 text-[#F0846D]" />}
          label="Disponibles"
          value={String(available)}
          sub="para inscribirte"
          accent="bg-[#F0846D]/10"
        />
      </div>

      {/* ── Active certifications ───────────────────────────────────────── */}
      {studentCerts.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="size-5 text-[#73B8E7]" />
            Mis Certificaciones
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studentCerts.map(({ enrollment, program, badge, lastAttempt }) => (
              <ActiveCertCard
                key={enrollment.id}
                program={program}
                hasBadge={badge !== null}
                lastScore={lastAttempt?.percentage ?? null}
                slug={program.slug}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Available programs ──────────────────────────────────────────── */}
      <section>
        <h2 className="mb-1 text-xl font-bold text-foreground flex items-center gap-2">
          <Award className="size-5 text-[#FBBC0C]" />
          Programas de Certificacion
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Incluidos en tu plan. Empieza cuando quieras — sin costo adicional.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CERT_PROGRAMS.map((prog) => {
            const enrolled = enrolledIds.has(prog.slug);
            return (
              <Link
                key={prog.slug}
                href={`/certificaciones/${prog.slug}`}
                className="group block rounded-2xl overflow-hidden border border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${prog.color} p-5`}>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-xl text-sm font-bold"
                      style={{ background: `${prog.accent}30`, color: prog.accent }}
                    >
                      {prog.proveedor.slice(0, 2)}
                    </div>
                    {enrolled && (
                      <CheckCircle2 className="size-5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-base font-bold text-foreground">{prog.nombre}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: prog.accent }}>
                    {prog.proveedor} · {prog.nivel}
                  </p>
                </div>
                {/* Body */}
                <div className="bg-white dark:bg-[#0D1B30] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      className="border-none text-[10px] font-semibold uppercase tracking-wider"
                      style={{ background: `${prog.accent}15`, color: prog.accent }}
                    >
                      {enrolled ? "Inscrito" : "Disponible"}
                    </Badge>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      {prog.horas}h
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {prog.description}
                  </p>
                  <p
                    className="mt-3 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                    style={{ color: prog.accent }}
                  >
                    {enrolled ? "Ver mi progreso" : "Comenzar programa"}
                    <ArrowRight className="size-3" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Value prop banner ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#FBBC0C]/20 bg-[#FBBC0C]/5 px-5 py-4 flex flex-wrap items-center gap-6">
        {[
          { icon: Star, label: "Incluido en tu mensualidad", sub: "Sin costo adicional" },
          { icon: ClipboardCheck, label: "Simulacros cronometrados", sub: "Igual que el examen oficial" },
          { icon: Award, label: "Badge en tu portafolio", sub: "Visible para empleadores" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3 min-w-[160px]">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#FBBC0C]/20 flex-shrink-0">
              <Icon className="size-4 text-[#FBBC0C]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#FBBC0C]">{label}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ─── Helper components ─────────────────────────────────────────────────────────

function StatCard({
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
        <p className="text-sm font-medium text-[#1F2F58]/50 dark:text-white/50">
          {label}
        </p>
        <p className="text-2xl font-bold tracking-tight text-[#0A1628] dark:text-white">
          {value}
        </p>
        <p className="text-xs text-[#1F2F58]/40 dark:text-white/40 mt-0.5">{sub}</p>
      </div>
    </CardContent>
  );

  if (href) {
    return (
      <Link href={href}>
        <Card className="border-none bg-white dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          {content}
        </Card>
      </Link>
    );
  }

  return (
    <Card className="border-none bg-white dark:bg-white/[0.03] shadow-sm">
      {content}
    </Card>
  );
}

function ActiveCertCard({
  program,
  hasBadge,
  lastScore,
  slug,
}: {
  program: CertificationProgram;
  hasBadge: boolean;
  lastScore: number | null;
  slug: string;
}) {
  const providerAccent =
    program.proveedor === "AWS"
      ? "#FF9900"
      : program.proveedor === "Google"
      ? "#4285F4"
      : program.proveedor === "Microsoft"
      ? "#00A4EF"
      : "#FBBC0C";

  return (
    <Link href={`/certificaciones/${slug}`} className="group block">
      <Card className="border-none bg-white dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-all group-hover:-translate-y-0.5">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div
              className="flex size-10 items-center justify-center rounded-lg text-sm font-bold"
              style={{ background: `${providerAccent}20`, color: providerAccent }}
            >
              {program.proveedor.slice(0, 2)}
            </div>
            {hasBadge ? (
              <Badge className="border-none bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                Obtenido
              </Badge>
            ) : (
              <Badge className="border-none bg-[#73B8E7]/10 text-[#73B8E7] text-[10px] font-semibold uppercase tracking-wider">
                En Progreso
              </Badge>
            )}
          </div>
          <div>
            <p className="font-semibold text-[#0A1628] dark:text-white leading-tight">
              {program.nombre}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {program.proveedor}
            </p>
          </div>
          {lastScore !== null && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Ultimo simulacro</span>
                <span
                  className="font-semibold"
                  style={{ color: lastScore >= program.umbral_aprobacion_porcentaje ? "#34d399" : providerAccent }}
                >
                  {lastScore}%
                </span>
              </div>
              <div className="h-1.5 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(lastScore, 100)}%`,
                    background: lastScore >= program.umbral_aprobacion_porcentaje ? "#34d399" : providerAccent,
                  }}
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-end pt-1">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 group-hover:gap-1.5 transition-all">
              Ver detalle
              <ArrowRight className="size-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
