import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Users,
  ArrowLeft,
  Mail,
  MessageCircle,
  GraduationCap,
  BookOpen,
  ArrowRight,
  UserPlus,
  Settings,
  BarChart2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Mi Equipo | ITSEIA Academy Corporativo",
  description: "Gestion de equipo corporativo en ITSEIA Academy.",
};

export default async function B2BTeamPage() {
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

  // Fetch active enrollments for context
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, programs(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false });

  const list        = enrollments ?? [];
  const firstName   = (profile.full_name ?? user.email?.split("@")[0] ?? "").split(" ")[0];
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

        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#73B8E7]/10">
            <Users className="size-6 text-[#73B8E7]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A1628]">
              Mi Equipo
            </h1>
            <p className="text-sm text-[#1F2F58]/50">
              Gestion de miembros y accesos para {companyName}
            </p>
          </div>
        </div>
      </div>

      {/* ── Current status card ───────────────────────────────────────────── */}
      <Card className="border-none bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#FBBC0C]/10">
              <UserPlus className="size-6 text-[#FBBC0C]" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-[#0A1628]">
                Agrega mas miembros a tu equipo
              </h2>
              <p className="mt-1 text-sm text-[#1F2F58]/60 leading-relaxed max-w-xl">
                La gestion autonoma de miembros estara disponible proximmamente. Por ahora,
                contacta a administracion para agregar empleados, asignar cursos y gestionar
                accesos de forma inmediata.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <a
                  href={`mailto:administracion@itseia.ai?subject=Agregar%20equipo%20corporativo%20-%20${encodeURIComponent(companyName)}&body=Hola%2C%20somos%20${encodeURIComponent(companyName)}%20y%20queremos%20agregar%20a%20los%20siguientes%20miembros%3A%0A%0A1.%20Nombre%20-%20Email%0A2.%20Nombre%20-%20Email%0A%0APrograma%20a%20asignar%3A`}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1F2F58] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A1628] transition-colors"
                >
                  <Mail className="size-4" />
                  Solicitar por Email
                </a>
                <a
                  href="https://wa.me/593959892034?text=Hola%2C%20soy%20empresa%20cliente%20ITSEIA%20y%20quiero%20agregar%20nuevos%20miembros%20a%20mi%20equipo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-4 py-2 text-sm font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 transition-colors"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Current account enrollments ───────────────────────────────────── */}
      {list.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-bold text-[#0A1628] flex items-center gap-2">
            <GraduationCap className="size-4 text-[#1F2F58]" />
            Capacitaciones de la cuenta
          </h2>
          <p className="mb-4 text-xs text-[#1F2F58]/50">
            Programas activos asociados a este usuario corporativo.
          </p>
          <div className="space-y-2">
            {list.map((enrollment) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const program = enrollment.programs as any;
              const typeLabel =
                program?.type === "carrera"
                  ? "Carrera"
                  : program?.type === "curso"
                  ? "Curso"
                  : program?.type === "bootcamp"
                  ? "Bootcamp"
                  : program?.type === "preuni"
                  ? "Preuniversitario"
                  : "Programa";

              return (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/8 bg-white p-4"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1F2F58]/8">
                    <BookOpen className="size-4 text-[#1F2F58]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0A1628] truncate">
                      {program?.name ?? "Programa"}
                    </p>
                    <p className="text-xs text-[#1F2F58]/50">
                      {program?.duration_months
                        ? `${program.duration_months} meses`
                        : typeLabel}
                    </p>
                  </div>
                  <Badge className="border-none bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider shrink-0">
                    Activo
                  </Badge>
                  <Link
                    href="/b2b/capacitacion"
                    className="shrink-0 p-1.5 rounded-lg text-[#1F2F58]/30 hover:text-[#1F2F58]/70 hover:bg-[#1F2F58]/5 transition-colors"
                    aria-label="Ver programa"
                  >
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="mt-3">
            <Link
              href="/b2b/capacitacion"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F2F58] hover:text-[#0A1628] transition-colors"
            >
              Ver todos los programas
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Roadmap: what's coming ────────────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-base font-bold text-[#0A1628]">
          Funciones proximas
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: UserPlus,
              title: "Invitar Miembros",
              description:
                "Envia invitaciones directamente desde el panel a cualquier empleado de tu empresa.",
              accent: "#73B8E7",
            },
            {
              icon: Settings,
              title: "Asignar Cursos",
              description:
                "Asigna programas especificos a cada miembro segun su rol y necesidades de capacitacion.",
              accent: "#FBBC0C",
            },
            {
              icon: BarChart2,
              title: "Progreso Individual",
              description:
                "Visualiza el avance de cada persona del equipo en tiempo real con reportes detallados.",
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
    </div>
  );
}
