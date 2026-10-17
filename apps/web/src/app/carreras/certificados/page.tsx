// /carreras/certificados — Certificados y constancias del estudiante.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  Download,
  ArrowLeft,
  Award,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Mis Certificados | Carreras ITSEIA",
  description: "Descarga tus certificados de avance y constancias académicas de ITSEIA.",
};

export default async function CertificadosPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) redirect("/login?module=carrera");

  // current_semester lives in profiles
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("current_semester")
    .eq("id", user.id)
    .single();

  const currentSemesterNum = profile?.current_semester || 1;

  // Fetch active carrera enrollments
  const { data: enrollments } = await supabaseAdmin
    .from("enrollments")
    .select("program_id, status")
    .eq("user_id", user.id)
    .eq("status", "active");

  const programs: Array<{
    id: string;
    name: string;
    slug: string;
    semestersCompleted: number;
  }> = [];

  for (const enrollment of enrollments || []) {
    const { data: prog } = await supabaseAdmin
      .from("programs")
      .select("id, name, slug, type")
      .eq("id", enrollment.program_id)
      .eq("type", "carrera")
      .single();
    if (prog) {
      programs.push({
        ...prog,
        semestersCompleted: Math.max(0, currentSemesterNum - 1),
      });
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
          <Download className="size-7 text-[#FBBC0C]" />
          Mis Certificados
        </h1>
        <p className="mt-2 text-sm text-[#1F2F58]/70">
          Constancias académicas y certificados de avance en tus carreras.
        </p>
      </div>

      {/* Sin matrícula */}
      {programs.length === 0 && (
        <Card className="border-dashed border-[#1F2F58]/20 bg-white/60">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <GraduationCap className="size-12 text-[#1F2F58]/15 mb-4" />
            <h3 className="text-base font-semibold text-[#0A1628]">
              Sin carreras activas
            </h3>
            <p className="mt-1 max-w-sm text-sm text-[#1F2F58]/60">
              Los certificados estarán disponibles cuando tengas una carrera activa.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Certificados por carrera */}
      {programs.map((prog) => (
        <div key={prog.id} className="space-y-4">
          <h2 className="text-base font-bold text-[#0A1628] flex items-center gap-2">
            <GraduationCap className="size-5 text-[#FBBC0C]" />
            {prog.name}
          </h2>

          {/* Constancia de matrícula — siempre disponible */}
          <Card className="border border-[#1F2F58]/8 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#73B8E7]/10">
                  <CheckCircle2 className="size-5 text-[#73B8E7]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0A1628]">
                    Constancia de matrícula
                  </p>
                  <p className="text-xs text-[#1F2F58]/50">
                    Disponible — solicitar por WhatsApp
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/593959892034?text=Hola%2C%20necesito%20mi%20constancia%20de%20matrícula"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-[#1F2F58] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0A1628] transition-colors shrink-0"
              >
                <MessageCircle className="size-3.5" />
                Solicitar
              </a>
            </CardContent>
          </Card>

          {/* Certificados de semestres completados */}
          {prog.semestersCompleted > 0 ? (
            Array.from({ length: prog.semestersCompleted }, (_, i) => i + 1).map((sem) => (
              <Card key={sem} className="border border-[#1F2F58]/8 bg-white shadow-sm">
                <CardContent className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#FBBC0C]/10">
                      <Award className="size-5 text-[#FBBC0C]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0A1628]">
                        Certificado — Semestre {sem}
                      </p>
                      <p className="text-xs text-[#1F2F58]/50">
                        Semestre completado
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/593959892034?text=Hola%2C%20necesito%20el%20certificado%20del%20semestre%20${sem}%20de%20mi%20carrera`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-3 py-2 text-xs font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 transition-colors shrink-0 shadow-sm"
                  >
                    <Download className="size-3.5" />
                    Solicitar
                  </a>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed border-[#1F2F58]/15 bg-white/50">
              <CardContent className="py-8 text-center">
                <Award className="size-10 text-[#1F2F58]/10 mx-auto mb-3" />
                <p className="text-sm text-[#1F2F58]/60">
                  Los certificados de semestre estarán disponibles al completar cada período académico.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
}
