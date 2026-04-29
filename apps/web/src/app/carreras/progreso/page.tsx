// /carreras/progreso — Progreso general del estudiante en su carrera formal.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  TrendingUp,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Mi Progreso | Carreras ITSEIA",
  description: "Revisa tu avance general en tu carrera tecnológica de ITSEIA.",
};

export default async function ProgresoPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) redirect("/login?module=carrera");

  // Fetch active enrollments for carrera-type programs
  const { data: enrollments } = await supabaseAdmin
    .from("enrollments")
    .select("program_id, status, created_at")
    .eq("user_id", user.id)
    .eq("status", "active");

  // Get program details for each enrollment
  const programIds = (enrollments || []).map((e) => e.program_id);
  const { data: programs } = programIds.length > 0
    ? await supabaseAdmin
        .from("programs")
        .select("id, name, slug, type")
        .in("id", programIds)
        .eq("type", "carrera")
    : { data: [] };

  const carreraPrograms = programs || [];

  // For each enrolled carrera, compute progress
  const progressData = await Promise.all(
    carreraPrograms.map(async (program) => {
      // Get all sessions for this program
      const { data: semesters } = await supabaseAdmin
        .from("semesters")
        .select("id")
        .eq("program_id", program.id);
      const semIds = (semesters || []).map((s) => s.id);

      let totalSessions = 0;
      let completedSessions = 0;

      if (semIds.length > 0) {
        const { data: subjects } = await supabaseAdmin
          .from("subjects")
          .select("id")
          .in("semester_id", semIds);
        const subIds = (subjects || []).map((s) => s.id);

        if (subIds.length > 0) {
          const { count: total } = await supabaseAdmin
            .from("sessions")
            .select("*", { count: "exact", head: true })
            .in("subject_id", subIds)
            .eq("is_active", true);
          totalSessions = total || 0;

          if (totalSessions > 0) {
            const { data: sessions } = await supabaseAdmin
              .from("sessions")
              .select("id")
              .in("subject_id", subIds)
              .eq("is_active", true);
            const sessionIds = (sessions || []).map((s) => s.id);
            if (sessionIds.length > 0) {
              const { count: completed } = await supabaseAdmin
                .from("session_progress")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id)
                .in("session_id", sessionIds)
                .eq("completed", true);
              completedSessions = completed || 0;
            }
          }
        }
      }

      const percent =
        totalSessions > 0
          ? Math.round((completedSessions / totalSessions) * 100)
          : 0;

      return {
        ...program,
        totalSessions,
        completedSessions,
        percent,
      };
    })
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/carreras"
          className="inline-flex items-center gap-1.5 text-xs text-[#1F2F58]/60 hover:text-[#1F2F58] mb-4 transition-colors"
        >
          <ArrowLeft className="size-3" />
          Volver al panel de carreras
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1628] flex items-center gap-3">
          <TrendingUp className="size-7 text-[#FBBC0C]" />
          Mi Progreso General
        </h1>
        <p className="mt-2 text-sm text-[#1F2F58]/70">
          Seguimiento de tu avance en cada carrera tecnológica.
        </p>
      </div>

      {/* Sin matrícula activa */}
      {carreraPrograms.length === 0 && (
        <Card className="border-dashed border-[#1F2F58]/20 bg-white/60">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <GraduationCap className="size-12 text-[#1F2F58]/15 mb-4" />
            <h3 className="text-base font-semibold text-[#0A1628]">
              Sin matrícula activa
            </h3>
            <p className="mt-1 max-w-sm text-sm text-[#1F2F58]/60">
              Aún no tienes una carrera activa. Explora las carreras disponibles
              para comenzar tu formación.
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

      {/* Progreso por carrera */}
      {progressData.map((prog) => (
        <Card key={prog.id} className="border border-[#1F2F58]/8 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1F2F58] to-[#0A1628]">
                  <GraduationCap className="size-5 text-[#FBBC0C]" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-[#0A1628]">
                    {prog.name}
                  </CardTitle>
                  <p className="text-xs text-[#1F2F58]/50 mt-0.5">
                    {prog.completedSessions} / {prog.totalSessions} sesiones completadas
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-[#FBBC0C] font-[family-name:var(--font-space-grotesk)]">
                {prog.percent}%
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barra de progreso */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1F2F58]/8">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  prog.percent === 100
                    ? "bg-emerald-400"
                    : prog.percent > 0
                    ? "bg-[#FBBC0C]"
                    : "bg-[#1F2F58]/10"
                }`}
                style={{ width: `${prog.percent}%` }}
              />
            </div>

            {/* Estado */}
            <div className="flex items-center gap-2 text-xs">
              {prog.percent === 100 ? (
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle2 className="size-4" />
                  Carrera completada
                </span>
              ) : prog.percent > 0 ? (
                <span className="flex items-center gap-1.5 text-[#FBBC0C] font-semibold">
                  <Circle className="size-4" />
                  En progreso
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[#1F2F58]/40">
                  <Circle className="size-4" />
                  Sin comenzar
                </span>
              )}
            </div>

            <Link
              href={`/carreras/${prog.slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/15 px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
            >
              <BookOpen className="size-4" />
              Ver malla curricular
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
