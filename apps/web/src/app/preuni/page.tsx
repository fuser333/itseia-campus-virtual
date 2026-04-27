import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Rocket,
  TrendingUp,
  Zap,
  Wrench,
  Target,
  FlaskConical,
  Trophy,
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard IGNITE | ITSEIA Preuniversitario",
  description:
    "Tu preuniversitario en IA — IGNITE. 20 días intensivos para descubrir el mundo de la inteligencia artificial.",
};

// Static curriculum (mirrors PreuniSidebar weeks)
const SEMANAS = [
  {
    href: "/preuni/semana-1",
    week: "Semana 1",
    days: "Día 1-4",
    title: "Descubre la IA",
    description:
      "Qué es la inteligencia artificial, herramientas básicas y tus primeros prompts.",
    icon: Zap,
    color: "#FBBC0C",
  },
  {
    href: "/preuni/semana-2",
    week: "Semana 2",
    days: "Día 5-8",
    title: "Herramientas IA",
    description:
      "Apps sin código, automatización con Bubble, Glide y workflows básicos.",
    icon: Wrench,
    color: "#73B8E7",
  },
  {
    href: "/preuni/semana-3",
    week: "Semana 3",
    days: "Día 9-12",
    title: "Tu Carrera Ideal",
    description:
      "Identifica qué carrera de IA encaja con tu perfil y descubre Make, Zapier y agentes IA.",
    icon: Target,
    color: "#F0846D",
  },
  {
    href: "/preuni/semana-4",
    week: "Semana 4",
    days: "Día 13-16",
    title: "Proyecto Práctico",
    description:
      "Construye y lanza tu primer proyecto real con IA. Pricing y marketing incluidos.",
    icon: FlaskConical,
    color: "#FBBC0C",
  },
];

export default async function PreuniDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?module=preuni");

  // Try to load preuni program for stats (best effort, page works without)
  let totalSesiones = 20;
  try {
    const { data: programs } = await supabase
      .from("programs")
      .select("id")
      .eq("type", "preuni")
      .eq("is_active", true)
      .limit(1);

    const programId = programs?.[0]?.id;
    if (programId) {
      const { data: semesters } = await supabase
        .from("semesters")
        .select("id")
        .eq("program_id", programId);

      const semesterIds = (semesters ?? []).map((s) => s.id);
      if (semesterIds.length > 0) {
        const { data: subjects } = await supabase
          .from("subjects")
          .select("id")
          .in("semester_id", semesterIds);

        const subjectIds = (subjects ?? []).map((s) => s.id);
        if (subjectIds.length > 0) {
          const { count } = await supabase
            .from("sessions")
            .select("*", { count: "exact", head: true })
            .in("subject_id", subjectIds)
            .eq("is_active", true);
          if (typeof count === "number" && count > 0) totalSesiones = count;
        }
      }
    }
  } catch {
    // Stat is decorative — fail silently
  }

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#F0846D]">
            <Rocket className="size-3.5" />
            ITSEIA IGNITE — Preuniversitario
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A1628]">
          Bienvenido a tu IGNITE
        </h1>
        <p className="mt-3 text-base text-[#1F2F58]/70 max-w-2xl leading-relaxed">
          20 días intensivos para descubrir la inteligencia artificial.
          Aprende haciendo, sin programación previa, con AI Lab incluido.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/10 bg-white shadow-sm p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#FBBC0C]/10">
            <Calendar className="size-5 text-[#FBBC0C]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
              20
            </p>
            <p className="text-xs font-medium text-[#1F2F58]/80">Días intensivos</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/10 bg-white shadow-sm p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#73B8E7]/10">
            <Clock className="size-5 text-[#73B8E7]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
              {totalSesiones}
            </p>
            <p className="text-xs font-medium text-[#1F2F58]/80">Sesiones disponibles</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/10 bg-white shadow-sm p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#F0846D]/10">
            <Sparkles className="size-5 text-[#F0846D]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
              3
            </p>
            <p className="text-xs font-medium text-[#1F2F58]/80">Modelos IA en AI Lab</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav
        aria-label="Ubicación"
        className="flex items-center gap-1.5 text-sm text-[#1F2F58]/80"
      >
        <Link href="/" className="hover:text-[#1F2F58] transition-colors">
          Inicio
        </Link>
        <span className="text-[#1F2F58]/30">/</span>
        <span className="font-medium text-[#1F2F58]">IGNITE</span>
      </nav>

      {/* Continue card */}
      <div className="rounded-2xl border border-[#FBBC0C]/30 bg-gradient-to-br from-[#FBBC0C]/[0.08] to-[#F0846D]/[0.05] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex size-14 items-center justify-center rounded-xl bg-[#FBBC0C] flex-shrink-0">
            <TrendingUp className="size-7 text-[#0A1628]" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#F0846D] mb-1">
              Continúa tu progreso
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A1628] mb-1">
              Empieza por la Semana 1: Descubre la IA
            </h2>
            <p className="text-sm text-[#1F2F58]/70">
              Tus primeros 4 días en el mundo de la inteligencia artificial.
            </p>
          </div>
          <Link
            href="/preuni/semana-1"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F2F58] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0A1628] hover:scale-[1.02] flex-shrink-0"
          >
            Ir a Semana 1
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Weeks grid */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0A1628] mb-2">
          Tu ruta de 20 días
        </h2>
        <p className="text-sm text-[#1F2F58]/70 mb-6">
          Cuatro semanas estructuradas para llevarte desde cero hasta tu primer
          proyecto IA.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {SEMANAS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-xl border border-[#1F2F58]/10 bg-white shadow-sm p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex size-11 items-center justify-center rounded-lg flex-shrink-0"
                    style={{ background: `${s.color}1A` }}
                  >
                    <Icon className="size-5" style={{ color: s.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: s.color }}
                      >
                        {s.week} · {s.days}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#0A1628] mb-1.5">
                      {s.title}
                    </h3>
                    <p className="text-sm text-[#1F2F58]/70 line-clamp-2 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-[#1F2F58]/30 transition-all group-hover:text-[#1F2F58]/70 group-hover:translate-x-0.5 flex-shrink-0 mt-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Final evaluation card */}
      <div className="rounded-xl border border-[#1F2F58]/10 bg-white shadow-sm p-5 flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-lg bg-[#FBBC0C]/10 flex-shrink-0">
          <Trophy className="size-5 text-[#FBBC0C]" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#FBBC0C] mb-1">
            Día 17-20
          </p>
          <h3 className="text-base font-bold text-[#0A1628]">
            Evaluación Final y Demo Day
          </h3>
          <p className="text-sm text-[#1F2F58]/70 mt-1">
            Presenta tu proyecto y obtén tu certificado IGNITE al completar las
            cuatro semanas.
          </p>
        </div>
      </div>
    </div>
  );
}
