// ── /certificaciones/tips ─────────────────────────────────────────────────────
// Tips y estrategias para aprobar las certificaciones.

import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb, ArrowLeft, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Tips para Certificaciones | ITSEIA",
  description: "Estrategias probadas para aprobar AWS, Google y Azure en el primer intento.",
};

const TIPS_SECTIONS = [
  {
    titulo: "Estrategia general de estudio",
    color: "#FBBC0C",
    tips: [
      "Estudia los dominios según su peso en el examen — empieza por el de mayor porcentaje.",
      "Haz al menos 3 simulacros completos antes de presentar el examen real.",
      "Revisa las explicaciones de las respuestas incorrectas, no solo las correctas.",
      "Usa el AI Lab para profundizar en conceptos que no entiendas bien.",
      "Estudia 30-45 minutos diarios en lugar de largas sesiones esporádicas.",
    ],
  },
  {
    titulo: "El día del examen",
    color: "#73B8E7",
    tips: [
      "Lee cada pregunta completa antes de ver las opciones.",
      "Marca las preguntas difíciles y vuelve a ellas al final.",
      "Elimina las opciones claramente incorrectas primero.",
      "No dejes preguntas sin responder — no hay penalización por respuesta incorrecta.",
      "Confía en tu primer instinto, pero verifica las preguntas marcadas.",
    ],
  },
  {
    titulo: "AWS Cloud Practitioner (CLF-C02)",
    color: "#FF9900",
    tips: [
      "Enfócate en el modelo de responsabilidad compartida — aparece en múltiples preguntas.",
      "Memoriza los planes de soporte: Basic, Developer, Business, Enterprise On-Ramp, Enterprise.",
      "Distingue claramente entre Security Groups (stateful) y NACLs (stateless).",
      "El dominio de Tecnología y Servicios (34%) es el más importante — priorizalo.",
      "Aprende las 6 R's de migración y los 6 pilares del Well-Architected Framework.",
    ],
  },
  {
    titulo: "Google AI Essentials",
    color: "#4285F4",
    tips: [
      "Entiende los casos de uso reales de IA generativa y cómo aplicarlos al trabajo.",
      "Practica con Gemini y las herramientas de Google Workspace AI.",
      "Estudia los principios de IA responsable de Google.",
      "Los prompts efectivos son clave — practica en el AI Lab del campus.",
      "Enfócate en cómo la IA mejora la productividad profesional.",
    ],
  },
  {
    titulo: "Azure AI Fundamentals (AI-900)",
    color: "#00A4EF",
    tips: [
      "Conoce los tipos de cargas de trabajo de IA: ML, visión por computadora, NLP.",
      "Familiarízate con Azure Machine Learning Studio y Cognitive Services.",
      "Entiende los principios de IA responsable de Microsoft.",
      "Practica identificar el servicio Azure correcto para cada escenario.",
      "El examen tiene muchas preguntas de selección de herramienta — practica escenarios.",
    ],
  },
];

export default async function TipsPage() {
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
          <Lightbulb className="size-6 text-[#FBBC0C]" />
          Tips para aprobar
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Estrategias probadas para pasar tu certificación en el primer intento.
        </p>
      </div>

      {/* Secciones de tips */}
      <div className="space-y-6">
        {TIPS_SECTIONS.map((section) => (
          <div
            key={section.titulo}
            className="rounded-2xl border border-[#1F2F58]/40 bg-[#1F2F58]/10 p-5"
          >
            <h2
              className="text-sm font-bold mb-4 flex items-center gap-2"
              style={{ color: section.color }}
            >
              <Lightbulb className="size-4" />
              {section.titulo}
            </h2>
            <ul className="space-y-2.5">
              {section.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2
                    className="size-4 mt-0.5 shrink-0"
                    style={{ color: section.color }}
                  />
                  <span className="text-sm text-white/75 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA final */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 text-center">
        <p className="text-base font-bold text-white mb-1">
          El mejor tip: practica con simulacros reales
        </p>
        <p className="text-sm text-white/55 mb-4 max-w-md mx-auto">
          Cada certificación tiene simulacros cronometrados que replican el examen oficial.
          Empieza hoy.
        </p>
        <Link
          href="/certificaciones"
          className="inline-flex items-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#E5AB00] transition-colors"
        >
          Ir a mis certificaciones
        </Link>
      </div>
    </div>
  );
}
