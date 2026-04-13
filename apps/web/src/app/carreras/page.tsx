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
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Carreras | ITSEIA Academy",
  description:
    "3 carreras tecnologicas de IA en Ecuador: Inteligencia Artificial, Ciencia de Datos y Big Data. Titulo IST, 6 semestres, AI Lab incluido.",
};

// Icons per known career slug
const slugIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "inteligencia-artificial": Brain,
  "ciencia-de-datos": BarChart3,
  "big-data-inteligencia-negocio": Database,
};

// Human-friendly descriptions per slug (override DB jargon)
const slugDescriptions: Record<string, string> = {
  "inteligencia-artificial":
    "Aprende a crear sistemas inteligentes: machine learning, deep learning, vision por computadora y modelos de lenguaje aplicados a proyectos reales.",
  "ciencia-de-datos":
    "Convierte datos en decisiones: Python, analisis predictivo, estadistica avanzada y visualizacion de datos para empresas.",
  "big-data-inteligencia-negocio":
    "Maneja datos a gran escala: SQL, procesamiento distribuido, dashboards empresariales y toma de decisiones basada en datos.",
};

// Style config for "carrera" type
const groupConfig = {
  carrera: {
    label: "Carreras Tecnologicas",
    description: "Formacion de nivel superior con titulo IST avalado por legalmente reconocido. 6 semestres, AI Lab integrado y proyectos reales con empresas.",
    icon: GraduationCap,
    color: "text-[#FBBC0C]",
    bgColor: "bg-[#FBBC0C]/10",
  },
} as const;

export default async function ProgramasPage() {
  // Fetch ONLY carrera-type programs (not preuni, bootcamp, curso, or teacher_training)
  const { data: programs } = await supabaseAdmin
    .from("programs")
    .select("*")
    .eq("is_active", true)
    .eq("type", "carrera")
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

  // All programs here are type "carrera" — no grouping needed

  // Check if user is logged in
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  // Stats: only count true "carrera" type programs
  const carrerasOnly = programsWithStats.filter((p) => p.type === "carrera");
  const totalCarreras = carrerasOnly.length;
  const totalMaterias = carrerasOnly.reduce((acc, p) => acc + p.subjectCount, 0);
  const totalEspecialidades = carrerasOnly.length; // 1 especialidad per carrera

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#1F2F58]/80">
            <GraduationCap className="size-3.5" />
            Instituto Ecuatoriano de Inteligencia Artificial
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A1628]">
          Carreras Academicas
        </h1>
        <p className="mt-3 text-base text-[#1F2F58]/70 max-w-2xl leading-relaxed">
          Formacion tecnologica real en Inteligencia Artificial, Ciencia de Datos y Big Data.
          Titulo IST reconocido, AI Lab incluido desde el primer dia.
        </p>
      </div>

      {/* Stats — only carreras */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/10 bg-white shadow-sm p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#FBBC0C]/10">
            <GraduationCap className="size-5 text-[#FBBC0C]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
              {totalCarreras}
            </p>
            <p className="text-xs font-medium text-[#1F2F58]/80">Carreras Tecnologicas</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/10 bg-white shadow-sm p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#73B8E7]/10">
            <BookOpen className="size-5 text-[#73B8E7]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
              {totalMaterias}
            </p>
            <p className="text-xs font-medium text-[#1F2F58]/80">Materias en total</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/10 bg-white shadow-sm p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#F0846D]/10">
            <Layers className="size-5 text-[#F0846D]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
              {totalEspecialidades}
            </p>
            <p className="text-xs font-medium text-[#1F2F58]/80">Especialidades</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Ubicacion" className="flex items-center gap-1.5 text-sm text-[#1F2F58]/80">
        <Link href="/" className="hover:text-[#1F2F58] transition-colors">Inicio</Link>
        <span className="text-[#1F2F58]/30">/</span>
        <span className="font-medium text-[#1F2F58]">Carreras</span>
      </nav>

      {/* Career cards — only the 3 official careers */}
      <div className={`grid gap-6 ${programsWithStats.length >= 3 ? "md:grid-cols-3" : programsWithStats.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1 max-w-lg"}`}>
        {programsWithStats.map((program) => {
          const Icon = slugIcons[program.slug] || GraduationCap;
          const displayDescription = slugDescriptions[program.slug] || program.description;
          const config = groupConfig["carrera"];

          return (
            <Card
              key={program.id}
              className="group border border-[#1F2F58]/8 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1F2F58] to-[#0A1628]">
                    <Icon className={`size-6 ${config.color}`} />
                  </div>
                  <Badge className={`border-none ${config.bgColor} text-[10px] font-semibold uppercase tracking-wider ${config.color}`}>
                    {program.semesterCount > 0
                      ? `${program.semesterCount} semestres`
                      : "6 semestres"}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-lg font-bold text-[#0A1628]">
                  {program.name}
                </CardTitle>
                {displayDescription && (
                  <p className="mt-2 text-sm text-[#1F2F58]/70 line-clamp-3 leading-relaxed">
                    {displayDescription}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-[#1F2F58]/80 font-medium">
                  {program.subjectCount > 0 && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="size-3" />
                      {program.subjectCount} materias
                    </span>
                  )}
                  {program.duration_months && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {program.duration_months} meses
                    </span>
                  )}
                  {program.price > 0 && (
                    <span className="ml-auto font-bold text-[#0A1628] text-sm">
                      ${program.price}<span className="text-[#1F2F58]/70 font-normal">/mes</span>
                    </span>
                  )}
                </div>

                <Link
                  href={`/carreras/${program.slug}`}
                  className="group/link flex items-center justify-center gap-2 rounded-lg bg-[#1F2F58] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0A1628]"
                >
                  {user ? "Ver mi progreso" : "Explorar carrera"}
                  <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {programsWithStats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GraduationCap className="size-12 text-[#1F2F58]/20 mb-4" />
          <h3 className="text-lg font-semibold text-[#0A1628]">
            Carreras en preparacion
          </h3>
          <p className="mt-1 max-w-sm text-sm text-[#1F2F58]/80">
            Las carreras estaran disponibles una vez que se configure la
            estructura academica.
          </p>
        </div>
      )}
    </div>
  );
}
