// /carreras/malla — Malla curricular completa de la carrera del estudiante.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  BookOpen,
  ArrowLeft,
  GraduationCap,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Malla Curricular | Carreras ITSEIA",
  description: "Plan de estudios completo de tu carrera tecnológica en ITSEIA.",
};

const levelConfig: Record<string, { label: string; color: string; bg: string }> = {
  basic: { label: "Básico", color: "text-[#73B8E7]", bg: "bg-[#73B8E7]/10" },
  professional: { label: "Profesional", color: "text-[#FBBC0C]", bg: "bg-[#FBBC0C]/10" },
  integration: { label: "Integración", color: "text-[#F0846D]", bg: "bg-[#F0846D]/10" },
};

export default async function MallaPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) redirect("/login?module=carrera");

  // current_semester lives in profiles, not enrollments
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("current_semester")
    .eq("id", user.id)
    .single();

  const enrolledSemester = profile?.current_semester || 1;

  // Fetch active carrera enrollment
  const { data: enrollments } = await supabaseAdmin
    .from("enrollments")
    .select("program_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  let program: { id: string; name: string; slug: string } | null = null;

  for (const enrollment of enrollments || []) {
    const { data: prog } = await supabaseAdmin
      .from("programs")
      .select("id, name, slug, type")
      .eq("id", enrollment.program_id)
      .eq("type", "carrera")
      .single();
    if (prog) {
      program = prog;
      break;
    }
  }

  // Fetch semesters + subjects
  let semesters: Array<{
    id: string;
    number: number;
    name: string | null;
    level: string | null;
    subjects: Array<{ id: string; name: string; slug: string; hours_total: number; tools: string[] }>;
  }> = [];

  if (program) {
    const { data: sems } = await supabaseAdmin
      .from("semesters")
      .select("*")
      .eq("program_id", program.id)
      .order("number", { ascending: true });

    semesters = await Promise.all(
      (sems || []).map(async (sem) => {
        const { data: subs } = await supabaseAdmin
          .from("subjects")
          .select("id, name, slug, hours_total, tools")
          .eq("semester_id", sem.id)
          .order("order_index", { ascending: true });
        return { ...sem, subjects: subs || [] };
      })
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/carreras"
          className="inline-flex items-center gap-1.5 text-xs text-[#1F2F58]/60 hover:text-[#1F2F58] mb-4 transition-colors"
        >
          <ArrowLeft className="size-3" />
          Volver al panel
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1628] flex items-center gap-3">
          <BookOpen className="size-7 text-[#FBBC0C]" />
          Malla Curricular
        </h1>
        {program && (
          <p className="mt-2 text-sm text-[#1F2F58]/70">{program.name}</p>
        )}
      </div>

      {/* Sin matrícula */}
      {!program && (
        <Card className="border-dashed border-[#1F2F58]/20 bg-white/60">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <GraduationCap className="size-12 text-[#1F2F58]/15 mb-4" />
            <h3 className="text-base font-semibold text-[#0A1628]">
              Sin carrera activa
            </h3>
            <p className="mt-1 max-w-sm text-sm text-[#1F2F58]/60">
              Explora las carreras disponibles para ver su malla curricular.
            </p>
            <Link
              href="/carreras"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1F2F58] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0A1628] transition-colors"
            >
              <BookOpen className="size-4" />
              Ver carreras disponibles
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Malla por semestres */}
      {program && semesters.length === 0 && (
        <Card className="border-dashed border-[#1F2F58]/20 bg-white/60">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <BookOpen className="size-10 text-[#1F2F58]/15 mb-3" />
            <p className="text-sm text-[#1F2F58]/60">
              La malla curricular está en preparación.
            </p>
            <Link
              href={`/carreras/${program.slug}`}
              className="mt-4 text-sm font-medium text-[#73B8E7] hover:text-[#FBBC0C] transition-colors"
            >
              Ver carrera completa
            </Link>
          </CardContent>
        </Card>
      )}

      {program && semesters.length > 0 && (
        <div className="space-y-6">
          {semesters.map((semester) => {
            const isCurrentSemester = semester.number === enrolledSemester;
            const level = semester.level || "basic";
            const config = levelConfig[level] || levelConfig.basic;

            return (
              <Card
                key={semester.id}
                className={`border bg-white shadow-sm ${
                  isCurrentSemester
                    ? "border-[#FBBC0C]/40 ring-1 ring-[#FBBC0C]/20"
                    : "border-[#1F2F58]/8"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-10 items-center justify-center rounded-lg ${
                          isCurrentSemester ? "bg-[#FBBC0C]/15" : "bg-[#1F2F58]/5"
                        }`}
                      >
                        <span
                          className={`text-sm font-bold font-[family-name:var(--font-space-grotesk)] ${
                            isCurrentSemester ? "text-[#FBBC0C]" : "text-[#1F2F58]"
                          }`}
                        >
                          {semester.number}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-[#0A1628]">
                          {semester.name || `Semestre ${semester.number}`}
                        </CardTitle>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-[#1F2F58]/50">
                          <span className="flex items-center gap-1">
                            <BookOpen className="size-3" />
                            {semester.subjects.length} materias
                          </span>
                          {isCurrentSemester && (
                            <span className="rounded-full bg-[#FBBC0C]/15 px-2 py-0.5 text-[10px] font-semibold text-[#FBBC0C]">
                              Semestre actual
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={`border-none text-[10px] font-semibold uppercase tracking-wider ${config.bg} ${config.color}`}
                    >
                      {config.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {semester.subjects.length === 0 ? (
                    <p className="text-xs text-[#1F2F58]/40 py-3">
                      Materias en preparación.
                    </p>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {semester.subjects.map((subject) => {
                        const tools: string[] = subject.tools || [];
                        return (
                          <Link
                            key={subject.id}
                            href={`/carreras/${program!.slug}/materia/${subject.slug}`}
                            className="group flex flex-col rounded-lg border border-[#1F2F58]/8 bg-white p-3 transition-all hover:border-[#73B8E7]/30 hover:shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <h3 className="text-xs font-semibold text-[#0A1628] line-clamp-2 group-hover:text-[#73B8E7] transition-colors">
                                {subject.name}
                              </h3>
                              <ArrowRight className="size-3 shrink-0 text-[#1F2F58]/20 group-hover:text-[#73B8E7] transition-colors mt-0.5" />
                            </div>
                            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#1F2F58]/40">
                              <Clock className="size-2.5" />
                              <span>{subject.hours_total}h</span>
                            </div>
                            {tools.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {tools.slice(0, 2).map((tool) => (
                                  <span
                                    key={tool}
                                    className="inline-flex rounded bg-[#73B8E7]/10 px-1 py-0.5 text-[9px] font-medium text-[#73B8E7]"
                                  >
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
