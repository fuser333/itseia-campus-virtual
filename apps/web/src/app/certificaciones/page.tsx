// ── /certificaciones ─────────────────────────────────────
// Catalog of available industry certifications.
// Server component — fetches data then renders client card grid.

import type { Metadata } from "next";
import { Award } from "lucide-react";
import { getCatalog } from "@/features/certifications/queries";
import CertificationCard from "@/components/certifications/CertificationCard";

export const metadata: Metadata = {
  title: "Certificaciones de Industria | ITSEIA Academy",
  description:
    "Prepara y obtiene certificaciones internacionales — AWS, Google, Azure, GitHub — dentro de tu campus ITSEIA.",
};

export default async function CertificationsPage() {
  const programs = await getCatalog();

  // Group by provider
  const byProvider = programs.reduce<Record<string, typeof programs>>(
    (acc, p) => {
      (acc[p.proveedor] = acc[p.proveedor] || []).push(p);
      return acc;
    },
    {}
  );

  const providers = Object.keys(byProvider).sort();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#FBBC0C]/20 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-[#FBBC0C]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Certificaciones de Industria
          </h1>
          <p className="mt-1 text-white/40 text-sm max-w-2xl">
            Titulo legalmente reconocido + certificaciones AWS, Google y Azure = perfil imbatible en el mercado laboral. Estudia con la misma estructura pedagogica de tus materias formales.
          </p>
        </div>
      </div>

      {/* Value proposition banner */}
      <div className="rounded-2xl border border-[#FBBC0C]/20 bg-[#FBBC0C]/5 px-5 py-4 flex flex-wrap items-center gap-4">
        {[
          { label: "Incluido en tu mensualidad", sub: "Sin costo adicional" },
          { label: "Misma estructura 7 tabs", sub: "Video, Teoria, Quiz, AI Lab..." },
          { label: "Simulacro cronometrado", sub: "Igual que el examen oficial" },
          { label: "Badge en tu portafolio", sub: "Visible para empleadores" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 min-w-[140px]">
            <div className="w-2 h-2 rounded-full bg-[#FBBC0C] flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[#FBBC0C]">{item.label}</p>
              <p className="text-[10px] text-white/40">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Programs by provider */}
      {programs.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] py-16 text-center">
          <Award className="w-12 h-12 text-white/10 mx-auto mb-3" />
          <p className="text-white/30">
            Las certificaciones se cargaran pronto. Vuelve a consultar en los proximos dias.
          </p>
        </div>
      ) : (
        <>
          {providers.map((provider) => (
            <section key={provider}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4 px-1">
                {provider}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {byProvider[provider].map((program) => (
                  <CertificationCard key={program.id} program={program} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
