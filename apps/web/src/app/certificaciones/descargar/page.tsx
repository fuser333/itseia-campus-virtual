// ── /certificaciones/descargar ────────────────────────────────────────────────
// Página para descargar certificados digitales obtenidos.

import type { Metadata } from "next";
import Link from "next/link";
import { Download, ArrowLeft, Award, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStudentCertifications } from "@/features/certifications/queries";

export const metadata: Metadata = {
  title: "Descargar Certificados | ITSEIA",
  description: "Descarga tus certificados digitales y badges de certificación.",
};

const PROVIDER_ACCENT: Record<string, string> = {
  AWS: "#FF9900",
  Google: "#4285F4",
  Microsoft: "#00A4EF",
};

export default async function DescargarPage() {
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
          <Download className="size-6 text-[#73B8E7]" />
          Descargar Certificados
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Descarga o comparte tus credenciales digitales verificables.
        </p>
      </div>

      {obtenidos.length === 0 ? (
        /* Estado vacío */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-[#73B8E7]/10 border border-[#73B8E7]/20 mb-6">
            <Download className="size-10 text-[#73B8E7]/40" />
          </div>
          <p className="text-base font-semibold text-white/60">
            Sin certificados aún
          </p>
          <p className="mt-2 text-sm text-white/40 max-w-sm leading-relaxed">
            Cuando apruebes un simulacro con el puntaje requerido, tu certificado
            digital estará disponible aquí para descargar o compartir en LinkedIn.
          </p>
          <Link
            href="/certificaciones"
            className="mt-6 inline-flex items-center gap-2 bg-[#73B8E7] text-[#0A1628] px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Award className="size-4" />
            Ver programas disponibles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {obtenidos.map(({ enrollment, program, badge }) => {
            const accent = PROVIDER_ACCENT[program.proveedor] ?? "#FBBC0C";
            return (
              <div
                key={enrollment.id}
                className="rounded-2xl border border-[#1F2F58]/40 bg-[#1F2F58]/10 p-5"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <div
                    className="flex size-12 items-center justify-center rounded-xl text-sm font-bold shrink-0"
                    style={{ background: `${accent}20`, color: accent }}
                  >
                    {program.proveedor.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{program.nombre}</p>
                    <p className="text-xs text-white/50 mt-0.5">{program.proveedor}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {badge?.evidencia_url && (
                      <a
                        href={badge.evidencia_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
                        style={{
                          borderColor: `${accent}40`,
                          color: accent,
                        }}
                      >
                        <ExternalLink className="size-3" />
                        Ver badge
                      </a>
                    )}
                    <a
                      href={badge?.evidencia_url ?? "#"}
                      download
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-[#0A1628] transition-colors hover:opacity-90"
                      style={{ backgroundColor: accent }}
                    >
                      <Download className="size-3" />
                      Descargar
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Info LinkedIn */}
          <div className="rounded-xl border border-[#0A66C2]/20 bg-[#0A66C2]/5 p-4 flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#0A66C2]/15 shrink-0">
              <Award className="size-4 text-[#0A66C2]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">
                Agrega tu certificado a LinkedIn
              </p>
              <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                En LinkedIn: Perfil → Sección Licencias y certificaciones → Agregar.
                Usa el badge URL como URL de credencial.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
