import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Program, Semester, Subject } from "@/types/database";

interface SemesterWithSubjects extends Semester {
  subjects: Subject[];
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = supabaseAdmin;

  // Fetch program by slug
  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!program) {
    notFound();
  }

  // If carrera, fetch semesters and subjects
  let semesters: SemesterWithSubjects[] = [];

  if (program.type === "carrera") {
    const { data: semestersData } = await supabase
      .from("semesters")
      .select("*")
      .eq("program_id", program.id)
      .order("number");

    if (semestersData && semestersData.length > 0) {
      // Fetch subjects for all semesters
      const semesterIds = semestersData.map((s) => s.id);
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("*")
        .in("semester_id", semesterIds)
        .order("order_index");

      // Group subjects by semester
      const subjectsBySemester = new Map<string, Subject[]>();
      (subjectsData || []).forEach((subject) => {
        const existing = subjectsBySemester.get(subject.semester_id) || [];
        existing.push(subject as Subject);
        subjectsBySemester.set(subject.semester_id, existing);
      });

      semesters = semestersData.map((sem) => ({
        ...(sem as Semester),
        subjects: subjectsBySemester.get(sem.id) || [],
      }));
    }
  }

  // If curso, fetch courses/modules
  let modules: { id: string; name: string; order_index: number }[] = [];

  if (program.type === "curso") {
    const { data: coursesData } = await supabase
      .from("courses")
      .select("id")
      .eq("program_id", program.id);

    if (coursesData && coursesData.length > 0) {
      const courseIds = coursesData.map((c) => c.id);
      const { data: modulesData } = await supabase
        .from("modules")
        .select("id, name, order_index")
        .in("course_id", courseIds)
        .order("order_index");

      modules = modulesData || [];
    }
  }

  const TYPE_LABELS: Record<string, string> = {
    carrera: "Carrera Tecnologica",
    curso: "Curso Profesional",
    preuni: "Preuniversitario",
    bootcamp: "Bootcamp",
  };

  const TYPE_BADGE_COLORS: Record<string, string> = {
    carrera: "bg-[#FBBC0C]/20 text-[#FBBC0C]",
    curso: "bg-[#73B8E7]/20 text-[#73B8E7]",
    preuni: "bg-[#F0846D]/20 text-[#F0846D]",
    bootcamp: "bg-white/20 text-white",
  };

  const LEVEL_LABELS: Record<string, string> = {
    basic: "Formacion Basica",
    professional: "Formacion Profesional",
    integration: "Integracion Curricular",
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0A1628]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBBC0C]">
              <span className="text-lg font-bold text-[#0A1628]">IT</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              ITSEIA{" "}
              <span className="text-sm font-normal text-[#73B8E7]">
                Tecnologico
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              Inicio
            </Link>
            <Link
              href="/apply"
              className="rounded-lg bg-[#FBBC0C] px-5 py-2 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#FBBC0C]/90"
            >
              Solicitar Admision
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pb-16 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-12 lg:grid-cols-3">
            {/* Left: Program info */}
            <div className="lg:col-span-2">
              {/* Badge */}
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  TYPE_BADGE_COLORS[program.type] || "bg-white/20 text-white"
                }`}
              >
                {TYPE_LABELS[program.type] || program.type}
              </span>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                {program.name}
              </h1>

              {program.description && (
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
                  {program.description}
                </p>
              )}

              {/* Quick stats */}
              <div className="mt-8 flex flex-wrap gap-6">
                {program.duration_months && (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[#FBBC0C]">
                      {program.duration_months}
                    </div>
                    <div className="text-xs text-white/50">meses</div>
                  </div>
                )}
                {program.type === "carrera" && (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[#FBBC0C]">
                      {program.total_semesters || 5}
                    </div>
                    <div className="text-xs text-white/50">semestres</div>
                  </div>
                )}
                {program.type === "carrera" && semesters.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[#73B8E7]">
                      {semesters.reduce(
                        (acc, s) => acc + s.subjects.length,
                        0
                      )}
                    </div>
                    <div className="text-xs text-white/50">materias</div>
                  </div>
                )}
                <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-[#FBBC0C]">85%</div>
                  <div className="text-xs text-white/50">empleabilidad</div>
                </div>
              </div>
            </div>

            {/* Right: Pricing card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:sticky lg:top-24">
              <div className="mb-4 text-center">
                <span className="text-sm text-white/50">
                  {program.type === "carrera"
                    ? "Pension mensual"
                    : "Inversion"}
                </span>
                <div className="mt-1 text-4xl font-extrabold text-[#FBBC0C]">
                  ${program.price}
                  {program.type === "carrera" && (
                    <span className="text-lg font-normal text-white/40">
                      /mes
                    </span>
                  )}
                </div>
                {program.type === "carrera" && (
                  <p className="mt-2 text-xs text-white/40">
                    Inscripción $49 online · $99 presencial + Pensión $99 online · $149 presencial/mes online · $149/mes presencial (Beca H3L)
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Link
                  href="/apply"
                  className="block w-full rounded-xl bg-[#FBBC0C] py-3 text-center text-sm font-bold text-[#0A1628] transition-all hover:scale-105 hover:bg-[#FBBC0C]/90"
                >
                  Solicitar Admision
                </Link>
                <a
                  href="https://wa.me/593959892034?text=Hola%2C%20me%20interesa%20la%20carrera%20de%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl border border-white/20 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-white/5"
                >
                  WhatsApp
                </a>
              </div>

              <div className="mt-4 space-y-2 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  AI Lab incluido (ChatGPT, Claude, Gemini)
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Certificacion IST reconocida por SENESCYT
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Pipeline de talento con empresas reales
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Malla Curricular (carreras) */}
      {program.type === "carrera" && semesters.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-2 text-3xl font-bold text-white">
              Malla <span className="text-[#FBBC0C]">Curricular</span>
            </h2>
            <p className="mb-12 text-white/50">
              {program.total_semesters || 5} semestres de formacion integral en{" "}
              {program.name}
            </p>

            <div className="space-y-8">
              {semesters.map((semester) => (
                <div
                  key={semester.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBBC0C] text-sm font-bold text-[#0A1628]">
                      {semester.number}
                    </span>
                    <div>
                      <h3 className="font-bold text-white">{semester.name}</h3>
                      <span className="text-xs text-white/40">
                        {LEVEL_LABELS[semester.level] || semester.level} —{" "}
                        {semester.subjects.length} materias
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {semester.subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="rounded-xl border border-white/5 bg-white/5 px-4 py-3"
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 rounded bg-[#1F2F58] px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[#73B8E7]">
                            {subject.code}
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-white">
                              {subject.name}
                            </div>
                            <div className="mt-1 flex gap-3 text-[10px] text-white/30">
                              <span>{subject.hours_total}h total</span>
                              <span>{subject.credit_hours} creditos</span>
                            </div>
                            {subject.tools && subject.tools.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {subject.tools.map((tool) => (
                                  <span
                                    key={tool}
                                    className="rounded bg-[#73B8E7]/10 px-1.5 py-0.5 text-[9px] text-[#73B8E7]"
                                  >
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Module List (cursos) */}
      {program.type === "curso" && modules.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-2 text-3xl font-bold text-white">
              Contenido del <span className="text-[#FBBC0C]">Curso</span>
            </h2>
            <p className="mb-12 text-white/50">
              {modules.length} modulos de formacion practica
            </p>

            <div className="space-y-3">
              {modules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FBBC0C]/20 text-sm font-bold text-[#FBBC0C]">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {mod.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            El futuro no se espera.
            <br />
            <span className="text-[#FBBC0C]">Se construye.</span>
          </h2>
          <p className="mt-4 text-white/50">
            Unete a los profesionales que ya estan dominando la IA con ITSEIA.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/apply"
              className="inline-block rounded-xl bg-[#FBBC0C] px-10 py-4 text-lg font-bold text-[#0A1628] shadow-lg shadow-[#FBBC0C]/20 transition-all hover:scale-105 hover:bg-[#FBBC0C]/90"
            >
              Solicitar Admision
            </Link>
            <a
              href="https://wa.me/593959892034"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl border border-white/20 px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-white/5"
            >
              Contactar por WhatsApp
            </a>
          </div>
          <p className="mt-6 text-sm text-white/30">
            administracion@itseia.ai | WhatsApp +593 95 989 2034
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-white/30">
            2026 ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial
          </div>
          <div className="flex gap-6">
            <a
              href="https://itseia.ai"
              target="_blank"
              className="text-sm text-white/30 transition-colors hover:text-white/60"
            >
              itseia.ai
            </a>
            <Link
              href="/login"
              className="text-sm text-white/30 transition-colors hover:text-white/60"
            >
              Plataforma
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
