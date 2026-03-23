import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Clock,
  BookOpen,
  ArrowRight,
  Brain,
  BarChart3,
  Database,
  Rocket,
  Zap,
  Briefcase,
  Cpu,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Carreras | ITSEIA Academy",
  description:
    "Explora todas las carreras de ITSEIA: Carreras Tecnologicas, Preuniversitario, Bootcamp, Cursos Profesionales y Capacitacion B2B.",
};

// Icons by slug (known careers)
const slugIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "inteligencia-artificial": Brain,
  "ciencia-de-datos": BarChart3,
  "big-data-inteligencia-negocio": Database,
};

// Icons by program type (fallback)
const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  carrera: GraduationCap,
  curso: Cpu,
  preuni: Rocket,
  bootcamp: Zap,
};

// Group configuration
const groupConfig: Record<
  string,
  { label: string; description: string; icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; order: number }
> = {
  carrera: {
    label: "Carreras Tecnologicas",
    description: "Formacion tecnologica de nivel superior con titulo avalado. 5 semestres, AI Lab integrado y proyectos reales.",
    icon: GraduationCap,
    color: "text-[#FBBC0C]",
    bgColor: "bg-[#FBBC0C]/10",
    order: 1,
  },
  preuni: {
    label: "Preuniversitario",
    description: "Carrera intensiva de 4 semanas para iniciar tu camino en Inteligencia Artificial desde cero.",
    icon: Rocket,
    color: "text-[#73B8E7]",
    bgColor: "bg-[#73B8E7]/10",
    order: 2,
  },
  bootcamp: {
    label: "Bootcamp IA",
    description: "3 meses intensivos de IA practica con proyectos reales, mentoria y acceso completo al AI Lab.",
    icon: Zap,
    color: "text-[#F0846D]",
    bgColor: "bg-[#F0846D]/10",
    order: 3,
  },
  curso: {
    label: "Cursos Profesionales",
    description: "Cursos especializados de IA adaptados a tu profesion. Aprende a aplicar IA en tu campo laboral.",
    icon: Cpu,
    color: "text-[#73B8E7]",
    bgColor: "bg-[#73B8E7]/10",
    order: 4,
  },
};

// Period label per program type
const periodLabel = (type: string): string => {
  if (type === "preuni") return "semanas";
  if (type === "bootcamp") return "meses";
  return "semestres";
};

export default async function ProgramasPage() {
  // Fetch ALL active programs
  const { data: programs } = await supabaseAdmin
    .from("programs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  // For each program, get semester count and subject count
  const programsWithStats = await Promise.all(
    (programs || []).map(async (program) => {
      const { count: semesterCount } = await supabaseAdmin
        .from("semesters")
        .select("*", { count: "exact", head: true })
        .eq("program_id", program.id);

      const { data: semesters } = await supabaseAdmin
        .from("semesters")
        .select("id")
        .eq("program_id", program.id);

      let subjectCount = 0;
      if (semesters && semesters.length > 0) {
        const semesterIds = semesters.map((s) => s.id);
        const { count } = await supabaseAdmin
          .from("subjects")
          .select("*", { count: "exact", head: true })
          .in("semester_id", semesterIds);
        subjectCount = count || 0;
      }

      return {
        ...program,
        semesterCount: semesterCount || 0,
        subjectCount,
      };
    })
  );

  // Group programs by type
  const grouped: Record<string, typeof programsWithStats> = {};
  for (const p of programsWithStats) {
    if (!grouped[p.type]) grouped[p.type] = [];
    grouped[p.type].push(p);
  }

  // Sort groups by configured order
  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
    const orderA = groupConfig[a]?.order ?? 99;
    const orderB = groupConfig[b]?.order ?? 99;
    return orderA - orderB;
  });

  // Check if user is logged in
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  // Total counts
  const totalPrograms = programsWithStats.length;
  const totalSubjects = programsWithStats.reduce((acc, p) => acc + p.subjectCount, 0);
  const totalTypes = Object.keys(grouped).length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0A1628]">
          Carreras Academicas
        </h1>
        <p className="mt-2 text-base text-[#1F2F58]/60 max-w-2xl">
          Todas las carreras de formacion de ITSEIA: desde el preuniversitario hasta carreras
          tecnologicas con titulo avalado. Cada carrera incluye AI Lab integrado.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/8 bg-white p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#FBBC0C]/10">
            <GraduationCap className="size-5 text-[#FBBC0C]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
              {totalPrograms}
            </p>
            <p className="text-xs text-[#1F2F58]/40">Carreras</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/8 bg-white p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#73B8E7]/10">
            <BookOpen className="size-5 text-[#73B8E7]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
              {totalSubjects}
            </p>
            <p className="text-xs text-[#1F2F58]/40">Materias en total</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/8 bg-white p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#F0846D]/10">
            <Briefcase className="size-5 text-[#F0846D]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
              {totalTypes}
            </p>
            <p className="text-xs text-[#1F2F58]/40">Tipos de carrera</p>
          </div>
        </div>
      </div>

      {/* Program groups */}
      {sortedGroups.map(([type, typePrograms]) => {
        const config = groupConfig[type] || {
          label: type,
          description: "",
          icon: GraduationCap,
          color: "text-[#FBBC0C]",
          bgColor: "bg-[#FBBC0C]/10",
          order: 99,
        };
        const GroupIcon = config.icon;

        return (
          <section key={type} id={type} className="scroll-mt-8">
            {/* Group header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`flex size-10 items-center justify-center rounded-xl ${config.bgColor}`}>
                  <GroupIcon className={`size-5 ${config.color}`} />
                </div>
                <h2 className="text-xl font-bold text-[#0A1628]">
                  {config.label}
                </h2>
                <Badge className="border-none bg-[#1F2F58]/10 text-[10px] font-semibold uppercase tracking-wider text-[#1F2F58]">
                  {typePrograms.length} {typePrograms.length === 1 ? "carrera" : "carreras"}
                </Badge>
              </div>
              {config.description && (
                <p className="text-sm text-[#1F2F58]/50 max-w-2xl ml-[52px]">
                  {config.description}
                </p>
              )}
            </div>

            {/* Program cards */}
            <div className={`grid gap-6 ${typePrograms.length >= 3 ? "md:grid-cols-3" : typePrograms.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1 max-w-lg"}`}>
              {typePrograms.map((program) => {
                const Icon = slugIcons[program.slug] || typeIcons[program.type] || GraduationCap;

                return (
                  <Card
                    key={program.id}
                    className="group border-none bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1F2F58] to-[#0A1628]">
                          <Icon className={`size-6 ${config.color}`} />
                        </div>
                        <Badge className={`border-none ${config.bgColor} text-[10px] font-semibold uppercase tracking-wider ${config.color}`}>
                          {program.semesterCount} {periodLabel(program.type)}
                        </Badge>
                      </div>
                      <CardTitle className="mt-4 text-lg font-bold text-[#0A1628]">
                        {program.name}
                      </CardTitle>
                      {program.description && (
                        <p className="mt-1 text-sm text-[#1F2F58]/50 line-clamp-3">
                          {program.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-xs text-[#1F2F58]/40">
                        <span className="flex items-center gap-1">
                          <BookOpen className="size-3" />
                          {program.subjectCount} materias
                        </span>
                        {program.duration_months && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {program.duration_months} meses
                          </span>
                        )}
                        {program.price > 0 && (
                          <span className="font-semibold text-[#0A1628]">
                            ${program.price}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/carreras/${program.slug}`}
                        className="group/link flex items-center justify-center gap-2 rounded-lg bg-[#1F2F58] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0A1628]"
                      >
                        {user ? "Ver mi progreso" : "Explorar carrera"}
                        <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Empty state */}
      {programsWithStats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GraduationCap className="size-12 text-[#1F2F58]/10 mb-4" />
          <h3 className="text-lg font-semibold text-[#0A1628]">
            Carreras en preparacion
          </h3>
          <p className="mt-1 max-w-sm text-sm text-[#1F2F58]/50">
            Las carreras estaran disponibles una vez que se configure la
            estructura academica.
          </p>
        </div>
      )}
    </div>
  );
}
