// /carreras/semestre — Vista del semestre actual del estudiante.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  Calendar,
  ArrowLeft,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Semestre Actual | Carreras ITSEIA",
  description: "Materias y sesiones de tu semestre en curso.",
};

export default async function SemestreActualPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) redirect("/login?module=carrera");

  // Fetch profile (current_semester lives in profiles, not enrollments)
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("current_semester")
    .eq("id", user.id)
    .single();

  const semNumber = profile?.current_semester || 1;

  // Fetch active enrollment in a carrera
  const { data: enrollments } = await supabaseAdmin
    .from("enrollments")
    .select("program_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  let program: { id: string; name: string; slug: string } | null = null;
  let currentSemester: { id: string; number: number; name: string | null } | null = null;
  let subjects: Array<{
    id: string;
    name: string;
    slug: string;
    hours_total: number;
    tools: string[];
  }> = [];

  // Find the first active carrera enrollment
  for (const enrollment of enrollments || []) {
    const { data: prog } = await supabaseAdmin
      .from("programs")
      .select("id, name, slug, type")
      .eq("id", enrollment.program_id)
      .eq("type", "carrera")
      .single();

    if (prog) {
      program = prog;

      // Find the semester matching the student's current_semester
      const { data: sem } = await supabaseAdmin
        .from("semesters")
        .select("id, number, name")
        .eq("program_id", prog.id)
        .eq("number", semNumber)
        .single();

      if (sem) {
        currentSemester = sem;
        const { data: subs } = await supabaseAdmin
          .from("subjects")
          .select("id, name, slug, hours_total, tools")
          .eq("semester_id", sem.id)
          .order("order_index", { ascending: true });
        subjects = subs || [];
      }
      break;
    }
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
          <Calendar className="size-7 text-[#FBBC0C]" />
          Semestre Actual
        </h1>
        {program && (
          <p className="mt-2 text-sm text-[#1F2F58]/70">
            {program.name}
            {currentSemester && ` — Semestre ${currentSemester.number}`}
          </p>
        )}
      </div>

      {/* Sin matrícula */}
      {!program && (
        <Card className="border-dashed border-[#1F2F58]/20 bg-white/60">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <GraduationCap className="size-12 text-[#1F2F58]/15 mb-4" />
            <h3 className="text-base font-semibold text-[#0A1628]">
              Sin semestre activo
            </h3>
            <p className="mt-1 max-w-sm text-sm text-[#1F2F58]/60">
              No tienes una carrera activa en este momento.
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

      {/* Materias del semestre */}
      {program && currentSemester && (
        <Card className="border border-[#1F2F58]/8 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-[#0A1628]">
                {currentSemester.name || `Semestre ${currentSemester.number}`}
              </CardTitle>
              <Badge className="border-none bg-[#FBBC0C]/10 text-[#FBBC0C] text-[10px] font-semibold uppercase tracking-wider">
                {subjects.length} materias
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {subjects.length === 0 ? (
              <p className="text-sm text-[#1F2F58]/60 text-center py-8">
                Las materias de este semestre aún están en preparación.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {subjects.map((subject) => {
                  const tools: string[] = subject.tools || [];
                  return (
                    <Link
                      key={subject.id}
                      href={`/carreras/${program!.slug}/materia/${subject.slug}`}
                      className="group flex flex-col rounded-xl border border-[#1F2F58]/8 bg-white p-4 transition-all hover:border-[#73B8E7]/30 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#0A1628] line-clamp-2 leading-snug group-hover:text-[#73B8E7] transition-colors">
                          {subject.name}
                        </h3>
                        <ArrowRight className="size-4 shrink-0 text-[#1F2F58]/20 group-hover:text-[#73B8E7] transition-colors mt-0.5" />
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#1F2F58]/50">
                        <Clock className="size-3" />
                        <span>{subject.hours_total}h</span>
                      </div>

                      {tools.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tools.slice(0, 3).map((tool) => (
                            <span
                              key={tool}
                              className="inline-flex rounded-md bg-[#73B8E7]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#73B8E7]"
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
      )}

      {program && !currentSemester && (
        <Card className="border-dashed border-[#1F2F58]/20 bg-white/60">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Calendar className="size-10 text-[#1F2F58]/15 mb-3" />
            <p className="text-sm text-[#1F2F58]/60">
              La estructura de semestres aún está en preparación.
            </p>
            <Link
              href={`/carreras/${program.slug}`}
              className="mt-4 text-sm font-medium text-[#73B8E7] hover:text-[#FBBC0C] transition-colors"
            >
              Ver malla completa
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
