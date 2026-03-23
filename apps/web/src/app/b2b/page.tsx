import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Clock,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Users,
  Briefcase,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/academic/Breadcrumb";

export const metadata: Metadata = {
  title: "Capacitacion B2B | ITSEIA Academy",
  description:
    "Carreras de capacitacion empresarial en Inteligencia Artificial. Formacion a medida para equipos y empresas.",
};

export default async function B2BPage() {
  // B2B programs could be stored as type 'curso' with a naming convention,
  // or as a future 'b2b' type. For now, we query any programs that have
  // 'b2b' or 'empresarial' or 'corporativ' in their name/description
  // OR a dedicated type if it exists in the future.
  const { data: b2bPrograms } = await supabaseAdmin
    .from("programs")
    .select("*")
    .eq("is_active", true)
    .or("name.ilike.%b2b%,name.ilike.%empresarial%,name.ilike.%corporativ%,description.ilike.%b2b%")
    .order("created_at", { ascending: true });

  // Get stats for programs
  const programsWithStats = await Promise.all(
    (b2bPrograms || []).map(async (program) => {
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

  // Check if user is logged in
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Carreras", href: "/carreras" },
          { label: "Capacitacion B2B" },
        ]}
      />

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <Link
          href="/carreras"
          className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-4"
        >
          <ArrowLeft className="size-3.5" />
          Todas las carreras
        </Link>
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex size-14 items-center justify-center rounded-xl bg-[#FBBC0C]/15">
            <Building2 className="size-7 text-[#FBBC0C]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Capacitacion Empresarial en IA
            </h1>
            <p className="mt-2 text-sm text-white/60 max-w-xl">
              Carreras de formacion a medida para equipos y empresas. Capacita a
              tu equipo en Inteligencia Artificial con contenido adaptado a tu industria.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/8 bg-white p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#FBBC0C]/10">
            <Users className="size-5 text-[#FBBC0C]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0A1628]">Equipos</p>
            <p className="text-xs text-[#1F2F58]/40">Desde 5 hasta 50+ personas</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/8 bg-white p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#73B8E7]/10">
            <Shield className="size-5 text-[#73B8E7]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0A1628]">A Medida</p>
            <p className="text-xs text-[#1F2F58]/40">Contenido adaptado a tu industria</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#1F2F58]/8 bg-white p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#F0846D]/10">
            <Briefcase className="size-5 text-[#F0846D]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0A1628]">$1,500 — $10,000</p>
            <p className="text-xs text-[#1F2F58]/40">Segun alcance y duracion</p>
          </div>
        </div>
      </div>

      {/* B2B Programs */}
      {programsWithStats.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {programsWithStats.map((program) => (
            <Card
              key={program.id}
              className="group border-none bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1F2F58] to-[#0A1628]">
                    <Building2 className="size-6 text-[#FBBC0C]" />
                  </div>
                  {program.semesterCount > 0 && (
                    <Badge className="border-none bg-[#1F2F58]/10 text-[10px] font-semibold uppercase tracking-wider text-[#1F2F58]">
                      {program.semesterCount} modulos
                    </Badge>
                  )}
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
                    <span className="font-semibold text-[#0A1628]">
                      ${program.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <Link
                  href={`/carreras/${program.slug}`}
                  className="group/link flex items-center justify-center gap-2 rounded-lg bg-[#1F2F58] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0A1628]"
                >
                  {user ? "Ver contenido" : "Explorar carrera"}
                  <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Coming soon state */
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-[#1F2F58]/15 bg-white/50">
          <Building2 className="size-12 text-[#1F2F58]/10 mb-4" />
          <h3 className="text-lg font-semibold text-[#0A1628]">
            Carreras B2B en preparacion
          </h3>
          <p className="mt-1 max-w-sm text-sm text-[#1F2F58]/50">
            Estamos preparando las carreras de capacitacion empresarial. Contactanos
            para soluciones a medida para tu equipo.
          </p>
          <a
            href="https://wa.me/593959892034?text=Hola%2C%20me%20interesa%20la%20capacitacion%20B2B%20en%20IA"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-6 py-2.5 text-sm font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 transition-colors"
          >
            Contactar por WhatsApp
            <ArrowRight className="size-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
