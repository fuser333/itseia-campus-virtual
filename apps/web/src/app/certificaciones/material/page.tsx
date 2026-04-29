// ── /certificaciones/material ─────────────────────────────────────────────────
// Material de estudio curado para AWS, Google y Azure.

import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowLeft, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Material de Estudio | Certificaciones ITSEIA",
  description: "Guías oficiales, libros y recursos curados para preparar tu certificación.",
};

const MATERIALES = [
  {
    categoria: "AWS Cloud Practitioner",
    accent: "#FF9900",
    recursos: [
      {
        titulo: "Guía oficial del examen CLF-C02",
        tipo: "oficial",
        href: "https://aws.amazon.com/es/certification/certified-cloud-practitioner/",
      },
      {
        titulo: "AWS Cloud Practitioner Essentials (Skill Builder, español)",
        tipo: "curso",
        href: "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials-spanish-latin-american",
      },
      {
        titulo: "AWS Well-Architected Framework",
        tipo: "documentación",
        href: "https://aws.amazon.com/es/architecture/well-architected/",
      },
    ],
  },
  {
    categoria: "Google AI Essentials",
    accent: "#4285F4",
    recursos: [
      {
        titulo: "Google AI Essentials — página oficial",
        tipo: "oficial",
        href: "https://grow.google/certificates/ai-essentials/",
      },
      {
        titulo: "Google Cloud AI Learning Path",
        tipo: "curso",
        href: "https://cloud.google.com/learn/training/machinelearning-ai",
      },
      {
        titulo: "Prácticas de IA Responsable — Google",
        tipo: "documentación",
        href: "https://ai.google/responsibility/responsible-ai-practices/",
      },
    ],
  },
  {
    categoria: "Azure AI Fundamentals",
    accent: "#00A4EF",
    recursos: [
      {
        titulo: "Guía oficial del examen AI-900",
        tipo: "oficial",
        href: "https://learn.microsoft.com/es-es/certifications/azure-ai-fundamentals/",
      },
      {
        titulo: "Ruta de aprendizaje AI-900 en Microsoft Learn",
        tipo: "curso",
        href: "https://learn.microsoft.com/es-es/training/paths/get-started-with-artificial-intelligence-on-azure/",
      },
      {
        titulo: "Azure AI Services — documentación oficial",
        tipo: "documentación",
        href: "https://azure.microsoft.com/es-es/products/ai-services/",
      },
    ],
  },
];

export default async function MaterialPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) redirect("/login");

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
          <BookOpen className="size-6 text-[#73B8E7]" />
          Material de Estudio
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Recursos oficiales y curados para preparar cada certificación.
        </p>
      </div>

      {/* Materiales por certificación */}
      <div className="space-y-8">
        {MATERIALES.map((mat) => (
          <section key={mat.categoria}>
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-3"
              style={{ color: mat.accent }}
            >
              {mat.categoria}
            </h2>
            <div className="space-y-2">
              {mat.recursos.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-[#1F2F58]/40 bg-[#1F2F58]/15 hover:border-[#1F2F58]/70 hover:bg-[#1F2F58]/25 transition-all group"
                >
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: `${mat.accent}1A`,
                      color: mat.accent,
                    }}
                  >
                    {r.tipo}
                  </span>
                  <span className="flex-1 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                    {r.titulo}
                  </span>
                  <ExternalLink className="size-3.5 text-white/25 group-hover:text-white/60 shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-[#FBBC0C]/20 bg-[#FBBC0C]/5 p-5 text-center">
        <p className="text-sm font-semibold text-[#FBBC0C] mb-1">
          ¿Quieres más recursos?
        </p>
        <p className="text-xs text-white/50 mb-4">
          Cada dominio dentro de la certificación tiene recursos específicos y material de práctica.
        </p>
        <Link
          href="/certificaciones"
          className="inline-flex items-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#E5AB00] transition-colors"
        >
          Ver mis certificaciones
        </Link>
      </div>
    </div>
  );
}
