import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  BarChart2,
  ArrowLeft,
  Mail,
  MessageCircle,
  Award,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Clock,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Reportes del Equipo | ITSEIA Academy Corporativo",
  description:
    "Reportes de progreso y certificaciones del equipo corporativo en ITSEIA.",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Rough estimate: 20 hours per month of program duration. */
function estimateHours(months: number | null): number {
  return months ? months * 20 : 0;
}

/** Returns a readable label for program type. */
function typeLabel(type: string | null | undefined): string {
  const map: Record<string, string> = {
    carrera: "Carrera",
    curso: "Curso",
    bootcamp: "Bootcamp",
    preuni: "Preuniversitario",
    teacher_training: "Formacion Docente",
  };
  return map[type ?? ""] ?? "Programa";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function B2BReportesPage() {
  const authClient = await createClient();
  const supabase   = supabaseAdmin;

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Guard: only finanzas (B2B) role
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "finanzas") {
    redirect("/dashboard");
  }

  // Fetch active enrollments with program data
  const { data: activeEnrollments } = await supabase
    .from("enrollments")
    .select("*, programs(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false });

  // Fetch completed enrollments
  const { data: completedEnrollments } = await supabase
    .from("enrollments")
    .select("*, programs(*)")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("enrolled_at", { ascending: false });

  // Fetch certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*, programs(name)")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  const active    = activeEnrollments ?? [];
  const completed = completedEnrollments ?? [];
  const certs     = certificates ?? [];

  const totalHours = active.reduce((acc, e) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const months = (e.programs as any)?.duration_months ?? null;
    return acc + estimateHours(months);
  }, 0);

  const companyName = profile.full_name ?? user.email?.split("@")[0] ?? "Tu Empresa";

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
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#FBBC0C]/10">
              <BarChart2 className="size-6 text-[#FBBC0C]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0A1628]">
                Reportes del Equipo
              </h1>
              <p className="text-sm text-[#1F2F58]/50">
                Progreso y avance corporativo — {companyName}
              </p>
            </div>
          </div>
          <a
            href={`mailto:administracion@itseia.ai?subject=Solicitud%20reporte%20detallado%20-%20${encodeURIComponent(companyName)}`}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors self-start sm:self-auto"
          >
            <Mail className="size-4 text-[#73B8E7]" />
            Reporte detallado
          </a>
        </div>
      </div>

      {/* ── KPI Stats ─────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#1F2F58]/8">
              <BookOpen className="size-5 text-[#1F2F58]" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#1F2F58]/50 uppercase tracking-wide">
                Activos
              </p>
              <p className="text-2xl font-bold text-[#0A1628]">{active.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#1F2F58]/50 uppercase tracking-wide">
                Completados
              </p>
              <p className="text-2xl font-bold text-[#0A1628]">{completed.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#73B8E7]/10">
              <Clock className="size-5 text-[#73B8E7]" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#1F2F58]/50 uppercase tracking-wide">
                Horas
              </p>
              <p className="text-2xl font-bold text-[#0A1628]">
                {totalHours > 0 ? `~${totalHours}h` : "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FBBC0C]/10">
              <Award className="size-5 text-[#FBBC0C]" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#1F2F58]/50 uppercase tracking-wide">
                Certificados
              </p>
              <p className="text-2xl font-bold text-[#0A1628]">{certs.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Active programs progress ──────────────────────────────────────── */}
      {active.length > 0 && (
        <div>
          <h2 className="mb-4 text-base font-bold text-[#0A1628] flex items-center gap-2">
            <TrendingUp className="size-4 text-[#73B8E7]" />
            Programas en Curso
          </h2>
          <div className="space-y-3">
            {active.map((enrollment) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const program = enrollment.programs as any;
              const months  = program?.duration_months as number | null ?? null;
              const hours   = estimateHours(months);
              const label   = typeLabel(program?.type);

              return (
                <div
                  key={enrollment.id}
                  className="rounded-xl border border-[#1F2F58]/8 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1F2F58]/8 mt-0.5">
                        <GraduationCap className="size-4 text-[#1F2F58]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0A1628] truncate">
                          {program?.name ?? "Programa"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[#1F2F58]/50">{label}</span>
                          {months && (
                            <>
                              <span className="text-[#1F2F58]/20">·</span>
                              <span className="text-xs text-[#1F2F58]/50">
                                {months} {months === 1 ? "mes" : "meses"}
                              </span>
                            </>
                          )}
                          {hours > 0 && (
                            <>
                              <span className="text-[#1F2F58]/20">·</span>
                              <span className="text-xs text-[#1F2F58]/50">~{hours}h</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className="border-none bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider">
                        Activo
                      </Badge>
                      <Link
                        href="/b2b/capacitacion"
                        className="p-1.5 rounded-lg text-[#1F2F58]/30 hover:text-[#1F2F58]/70 hover:bg-[#1F2F58]/5 transition-colors"
                        aria-label="Ver capacitacion"
                      >
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Progress bar — placeholder at 0% until real tracking is available */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium text-[#1F2F58]/50">
                        Progreso
                      </span>
                      <span className="text-[11px] font-semibold text-[#1F2F58]/60">
                        En curso
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1F2F58]/8 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#73B8E7] to-[#1F2F58]"
                        style={{ width: "15%" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Completed programs ────────────────────────────────────────────── */}
      {completed.length > 0 && (
        <div>
          <h2 className="mb-4 text-base font-bold text-[#0A1628] flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" />
            Programas Completados
          </h2>
          <div className="space-y-2">
            {completed.map((enrollment) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const program = enrollment.programs as any;
              return (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/8 bg-white p-4"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0A1628] truncate">
                      {program?.name ?? "Programa"}
                    </p>
                    <p className="text-xs text-[#1F2F58]/50">
                      {typeLabel(program?.type)}
                    </p>
                  </div>
                  <Badge className="border-none bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider shrink-0">
                    Completado
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Certificates ─────────────────────────────────────────────────── */}
      {certs.length > 0 && (
        <div>
          <h2 className="mb-4 text-base font-bold text-[#0A1628] flex items-center gap-2">
            <Award className="size-4 text-[#FBBC0C]" />
            Certificados Obtenidos
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((cert) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const program = cert.programs as any;
              const issuedAt = cert.issued_at
                ? new Date(cert.issued_at as string).toLocaleDateString("es-EC", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : null;

              return (
                <div
                  key={cert.id}
                  className="flex items-start gap-3 rounded-xl border border-[#FBBC0C]/20 bg-[#FBBC0C]/5 p-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FBBC0C]/15">
                    <Award className="size-5 text-[#FBBC0C]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0A1628] truncate">
                      {program?.name ?? "Certificado"}
                    </p>
                    {issuedAt && (
                      <p className="text-xs text-[#1F2F58]/50 mt-0.5">
                        Emitido el {issuedAt}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3">
            <Link
              href="/certificates"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F2F58] hover:text-[#0A1628] transition-colors"
            >
              Ver todos los certificados
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Empty state (no enrollments at all) ──────────────────────────── */}
      {active.length === 0 && completed.length === 0 && (
        <Card className="border-none bg-white shadow-sm">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#FBBC0C]/10">
              <BarChart2 className="size-8 text-[#FBBC0C]/60" />
            </div>
            <h2 className="text-lg font-bold text-[#0A1628]">
              Sin datos de progreso aun
            </h2>
            <p className="mt-2 max-w-md text-sm text-[#1F2F58]/50 leading-relaxed">
              Los reportes de progreso apareceran aqui una vez que tu empresa
              tenga programas activos. Contacta a administracion para inscribirte.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="mailto:administracion@itseia.ai?subject=Inscripcion%20corporativa%20ITSEIA"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1F2F58] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A1628] transition-colors"
              >
                <Mail className="size-4" />
                Contactar Admin
              </a>
              <a
                href="https://wa.me/593959892034?text=Hola%2C%20quiero%20solicitar%20un%20reporte%20de%20progreso%20de%20mi%20equipo%20en%20ITSEIA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-4 py-2 text-sm font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 transition-colors"
              >
                <MessageCircle className="size-4" />
                WhatsApp Soporte
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Coming soon: detailed reports ─────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-base font-bold text-[#0A1628]">
          Reportes detallados — Proximamente
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              title: "Progreso por Empleado",
              description:
                "Avance porcentual individual de cada miembro del equipo en sus cursos.",
              accent: "#73B8E7",
            },
            {
              icon: CheckCircle2,
              title: "Modulos Completados",
              description:
                "Registro detallado de lecciones y modulos finalizados por persona.",
              accent: "#FBBC0C",
            },
            {
              icon: Award,
              title: "Exportar Reporte",
              description:
                "Descarga un PDF con el estado completo de capacitacion de tu equipo.",
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

      {/* ── Quick links ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/b2b/capacitacion"
          className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
        >
          <GraduationCap className="size-4 text-[#1F2F58]" />
          Ver Capacitacion
        </Link>
        <Link
          href="/certificates"
          className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
        >
          <Award className="size-4 text-[#F0846D]" />
          Ver Certificados
        </Link>
        <Link
          href="/payments"
          className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
        >
          <TrendingUp className="size-4 text-[#73B8E7]" />
          Ver Facturacion
        </Link>
      </div>
    </div>
  );
}
