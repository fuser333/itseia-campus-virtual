// ── /certificaciones/obtenidos ────────────────────────────────────────────────
// Página de certificados obtenidos por el estudiante.

import type { Metadata } from "next";
import Link from "next/link";
import { Award, ArrowLeft, Trophy } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStudentCertifications } from "@/features/certifications/queries";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Certificados Obtenidos | ITSEIA",
  description: "Revisa tus certificaciones internacionales obtenidas — AWS, Google y Azure.",
};

export default async function ObtenidosPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) redirect("/login");

  const studentCerts = await getStudentCertifications(user.id);
  const obtenidos = studentCerts.filter((c) => c.badge !== null);

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
          <Trophy className="size-6 text-[#FBBC0C]" />
          Certificados Obtenidos
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {obtenidos.length === 0
            ? "Aún no tienes certificados. ¡Completa un simulacro para obtener el tuyo!"
            : `Tienes ${obtenidos.length} certificado${obtenidos.length > 1 ? "s" : ""} obtenido${obtenidos.length > 1 ? "s" : ""}.`}
        </p>
      </div>

      {obtenidos.length === 0 ? (
        /* Estado vacío */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 mb-6">
            <Award className="size-10 text-[#FBBC0C]/40" />
          </div>
          <p className="text-base font-semibold text-white/60">
            Todavía no hay certificados
          </p>
          <p className="mt-2 text-sm text-white/40 max-w-sm leading-relaxed">
            Completa un simulacro con el puntaje requerido y tu badge digital
            aparecerá aquí automáticamente.
          </p>
          <Link
            href="/certificaciones"
            className="mt-6 inline-flex items-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#E5AB00] transition-colors"
          >
            <Award className="size-4" />
            Ver programas disponibles
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {obtenidos.map(({ enrollment, program, badge }) => (
            <Card
              key={enrollment.id}
              className="border-none bg-white dark:bg-white/[0.03] shadow-sm"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="flex size-10 items-center justify-center rounded-lg text-sm font-bold"
                    style={{ background: "#FBBC0C20", color: "#FBBC0C" }}
                  >
                    {program.proveedor.slice(0, 2)}
                  </div>
                  <Trophy className="size-5 text-[#FBBC0C]" />
                </div>
                <div>
                  <p className="font-semibold text-white">{program.nombre}</p>
                  <p className="text-xs text-white/50 mt-0.5">{program.proveedor}</p>
                </div>
                <Link
                  href={`/certificaciones/${program.slug}`}
                  className="block text-xs font-semibold text-[#FBBC0C] hover:underline"
                >
                  Ver detalle →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
