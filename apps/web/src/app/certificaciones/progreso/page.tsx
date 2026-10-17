// ── /certificaciones/progreso ─────────────────────────────────────────────────
// Vista de progreso del estudiante en todos los programas de certificación.

import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, ArrowLeft, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStudentCertifications } from "@/features/certifications/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Mi Progreso | Certificaciones ITSEIA",
  description: "Revisa tu avance en los programas de certificación AWS, Google y Azure.",
};

const PROVIDER_ACCENT: Record<string, string> = {
  AWS: "#FF9900",
  Google: "#4285F4",
  Microsoft: "#00A4EF",
};

export default async function ProgresoPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) redirect("/login");

  const studentCerts = await getStudentCertifications(user.id);
  const enProgreso = studentCerts.filter((c) => c.badge === null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/certificaciones"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 mb-4"
        >
          <ArrowLeft className="size-3" />
          Volver al panel
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="size-6 text-[#73B8E7]" />
          Mi Progreso
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {enProgreso.length === 0
            ? "No tienes programas activos. Inscríbete en uno para comenzar."
            : `${enProgreso.length} programa${enProgreso.length > 1 ? "s" : ""} en curso.`}
        </p>
      </div>

      {enProgreso.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-[#73B8E7]/10 border border-[#73B8E7]/20 mb-6">
            <TrendingUp className="size-10 text-[#73B8E7]/40" />
          </div>
          <p className="text-base font-semibold text-white/60">
            Sin programas activos
          </p>
          <p className="mt-2 text-sm text-white/40 max-w-sm leading-relaxed">
            Empieza un programa de certificación y aquí verás tu avance en simulacros y lecciones.
          </p>
          <Link
            href="/certificaciones"
            className="mt-6 inline-flex items-center gap-2 bg-[#73B8E7] text-[#0A1628] px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <TrendingUp className="size-4" />
            Ver programas disponibles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enProgreso.map(({ enrollment, program, lastAttempt }) => {
            const accent = PROVIDER_ACCENT[program.proveedor] ?? "#FBBC0C";
            const score = lastAttempt?.percentage ?? null;
            return (
              <Card
                key={enrollment.id}
                className="border-none bg-white dark:bg-white/[0.03] shadow-sm"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 flex-wrap">
                    <div
                      className="flex size-12 items-center justify-center rounded-xl text-sm font-bold shrink-0"
                      style={{ background: `${accent}20`, color: accent }}
                    >
                      {program.proveedor.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-white">{program.nombre}</p>
                        <Badge
                          className="border-none text-[10px] font-semibold uppercase tracking-wide"
                          style={{ background: `${accent}15`, color: accent }}
                        >
                          En progreso
                        </Badge>
                      </div>
                      <p className="text-xs text-white/50 mb-3">{program.proveedor}</p>
                      {score !== null && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/50">Último simulacro</span>
                            <span
                              className="font-semibold"
                              style={{
                                color:
                                  score >= program.umbral_aprobacion_porcentaje
                                    ? "#34d399"
                                    : accent,
                              }}
                            >
                              {score}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(score, 100)}%`,
                                background:
                                  score >= program.umbral_aprobacion_porcentaje
                                    ? "#34d399"
                                    : accent,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-white/35">
                            Meta: {program.umbral_aprobacion_porcentaje}% para aprobar
                          </p>
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/certificaciones/${program.slug}`}
                      className="shrink-0 text-xs font-semibold flex items-center gap-1 hover:gap-1.5 transition-all"
                      style={{ color: accent }}
                    >
                      Continuar
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
