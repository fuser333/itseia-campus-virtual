import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  GraduationCap,
  ArrowLeft,
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  BarChart2,
  Layers,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Capacitacion Activa | ITSEIA Academy Corporativo",
  description:
    "Programas de capacitacion en Inteligencia Artificial activos para tu empresa.",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns label and color token for a program type. */
function getProgramTypeMeta(type: string | null | undefined): {
  label: string;
  color: string;
  bg: string;
} {
  switch (type) {
    case "carrera":
      return { label: "Carrera", color: "#1F2F58", bg: "#1F2F5815" };
    case "bootcamp":
      return { label: "Bootcamp", color: "#73B8E7", bg: "#73B8E715" };
    case "preuni":
      return { label: "Preuniversitario", color: "#FBBC0C", bg: "#FBBC0C15" };
    case "curso":
      return { label: "Curso", color: "#F0846D", bg: "#F0846D15" };
    case "teacher_training":
      return { label: "Formacion Docente", color: "#73B8E7", bg: "#73B8E715" };
    default:
      return { label: "Programa", color: "#1F2F58", bg: "#1F2F5815" };
  }
}

/** Builds the internal link for a program based on its type and slug/id. */
function getProgramLink(
  type: string | null | undefined,
  slug: string | null | undefined,
  id: string,
): string {
  // Programs with a slug → use academic view (handles all types)
  if (slug) return `/carreras/${slug}`;
  if (type === "curso") return `/mi-curso`;
  // B2B courses without slug → dedicated course view
  return `/b2b/curso/${id}`;
}

/** Estimates total hours based on duration_months (rough: 20h/month). */
function estimateHours(months: number | null): number {
  return months ? months * 20 : 0;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function B2BCapacitacionPage() {
  const authClient = await createClient();
  const supabase   = supabaseAdmin;

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Guard: only finanzas (B2B corporate) role may access this page
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "finanzas") {
    redirect("/dashboard");
  }

  // Fetch all active enrollments with full program data
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, programs(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false });

  const list = enrollments ?? [];

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalPrograms = list.length;
  const totalHours    = list.reduce((acc, e) => {
    const months = (e.programs as { duration_months?: number | null } | null)?.duration_months ?? null;
    return acc + estimateHours(months);
  }, 0);

  const firstName = (profile.full_name ?? user.email?.split("@")[0] ?? "").split(" ")[0];

  return (
    <div className="space-y-8">

      {/* ── Breadcrumb + Header ───────────────────────────────────────────── */}
      <div>
        <Link
          href="/b2b"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-3.5" />
          Dashboard Corporativo
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#1F2F58]/10">
              <GraduationCap className="size-6 text-[#1F2F58]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0A1628]">
                Capacitacion Activa
              </h1>
              <p className="text-sm text-[#1F2F58]/50">
                Programas en curso para {firstName}
              </p>
            </div>
          </div>
          {totalPrograms > 0 && (
            <Link
              href="/payments"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors self-start sm:self-auto"
            >
              <BarChart2 className="size-4 text-[#73B8E7]" />
              Ver facturacion
            </Link>
          )}
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total programs */}
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#1F2F58]/8">
              <BookOpen className="size-5 text-[#1F2F58]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1F2F58]/50">Programas Activos</p>
              <p className="text-2xl font-bold tracking-tight text-[#0A1628]">
                {totalPrograms}
              </p>
              <p className="text-xs text-[#1F2F58]/40 mt-0.5">
                {totalPrograms === 1 ? "programa en curso" : "programas en curso"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Estimated hours */}
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#73B8E7]/10">
              <Clock className="size-5 text-[#73B8E7]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1F2F58]/50">Horas Estimadas</p>
              <p className="text-2xl font-bold tracking-tight text-[#0A1628]">
                {totalHours > 0 ? `~${totalHours}h` : "—"}
              </p>
              <p className="text-xs text-[#1F2F58]/40 mt-0.5">contenido total</p>
            </div>
          </CardContent>
        </Card>

        {/* Certificates available */}
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FBBC0C]/10">
              <Award className="size-5 text-[#FBBC0C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1F2F58]/50">Certificados</p>
              <p className="text-2xl font-bold tracking-tight text-[#0A1628]">
                {totalPrograms > 0 ? totalPrograms : "—"}
              </p>
              <p className="text-xs text-[#1F2F58]/40 mt-0.5">al completar</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Program cards ─────────────────────────────────────────────────── */}
      {list.length > 0 ? (
        <div>
          <h2 className="mb-4 text-base font-bold text-[#0A1628] flex items-center gap-2">
            <Layers className="size-4 text-[#73B8E7]" />
            Tus Programas
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((enrollment) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const program = enrollment.programs as any;
              const typeMeta = getProgramTypeMeta(program?.type);
              const link     = getProgramLink(program?.type, program?.slug, program?.id ?? "");
              const months   = program?.duration_months as number | null ?? null;
              const hours    = estimateHours(months);

              return (
                <Link
                  key={enrollment.id}
                  href={link}
                  className="group block rounded-2xl bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  {/* Color top strip */}
                  <div
                    className="h-1.5 rounded-t-2xl"
                    style={{ background: typeMeta.color }}
                  />

                  <div className="p-5 space-y-4">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: typeMeta.bg }}
                      >
                        <GraduationCap
                          className="size-5"
                          style={{ color: typeMeta.color }}
                        />
                      </div>
                      <Badge
                        className="border-none text-[10px] font-semibold uppercase tracking-wider"
                        style={{
                          background: typeMeta.bg,
                          color: typeMeta.color,
                        }}
                      >
                        {typeMeta.label}
                      </Badge>
                    </div>

                    {/* Program name */}
                    <div>
                      <p className="font-semibold text-[#0A1628] leading-snug">
                        {program?.name ?? "Programa"}
                      </p>
                      {program?.description && (
                        <p className="text-xs text-[#1F2F58]/50 mt-1 leading-relaxed line-clamp-2">
                          {program.description}
                        </p>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-[#1F2F58]/50">
                      {months && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {months} {months === 1 ? "mes" : "meses"}
                        </span>
                      )}
                      {hours > 0 && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="size-3" />
                          ~{hours}h estimadas
                        </span>
                      )}
                    </div>

                    {/* Status + CTA */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#1F2F58]/6">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                        <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">
                          Activo
                        </span>
                      </div>
                      <span
                        className="text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all"
                        style={{ color: typeMeta.color }}
                      >
                        Ir al programa
                        <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── Empty state ──────────────────────────────────────────────────── */
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-5 flex size-20 items-center justify-center rounded-2xl bg-[#1F2F58]/8">
              <GraduationCap className="size-10 text-[#1F2F58]/40" />
            </div>
            <h2 className="text-xl font-bold text-[#0A1628]">
              Sin programas activos
            </h2>
            <p className="mt-2 max-w-md text-sm text-[#1F2F58]/50 leading-relaxed">
              Aun no tienes programas de capacitacion activos. Contacta a nuestro
              equipo para inscribir a tu empresa en los cursos de IA mas adecuados.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribir%20a%20mi%20empresa%20en%20un%20programa%20de%20capacitacion%20IA%20de%20ITSEIA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-5 py-2.5 text-sm font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 transition-colors"
              >
                Solicitar Capacitacion
                <ArrowRight className="size-4" />
              </a>
              <a
                href="mailto:administracion@itseia.ai?subject=Solicitud%20capacitacion%20corporativa%20IA"
                className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
              >
                Escribir por Email
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── What's included section ───────────────────────────────────────── */}
      {list.length > 0 && (
        <div>
          <h2 className="mb-4 text-base font-bold text-[#0A1628]">
            Recursos disponibles
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Material de Estudio",
                description:
                  "Accede a todo el contenido del programa: videos, PDFs, ejercicios y recursos adicionales.",
                accent: "#73B8E7",
              },
              {
                icon: GraduationCap,
                title: "AI Lab Incluido",
                description:
                  "Acceso directo a ChatGPT, Claude y Gemini para practicar con IA real durante el curso.",
                accent: "#FBBC0C",
              },
              {
                icon: Award,
                title: "Certificado ITSEIA",
                description:
                  "Al completar el programa recibes un certificado oficial emitido por ITSEIA.",
                accent: "#F0846D",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-[#1F2F58]/8 bg-white p-4"
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${item.accent}15` }}
                  >
                    <Icon className="size-5" style={{ color: item.accent }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A1628]">{item.title}</p>
                    <p className="text-xs text-[#1F2F58]/50 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Quick links ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/b2b/reportes"
          className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
        >
          <BarChart2 className="size-4 text-[#FBBC0C]" />
          Ver Reportes
        </Link>
        <Link
          href="/certificates"
          className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
        >
          <Award className="size-4 text-[#F0846D]" />
          Mis Certificados
        </Link>
        <Link
          href="/ai-lab"
          className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
        >
          <GraduationCap className="size-4 text-[#73B8E7]" />
          AI Lab
        </Link>
      </div>
    </div>
  );
}
