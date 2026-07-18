"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Check,
  ArrowRight,
  Star,
  Zap,
  BookOpen,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

const PROGRAMS = [
  {
    id: "be7e6b1e-d8f9-4c97-9b29-bacb73925579",
    name: "Curso Express",
    subtitle: "IA para Profesionales",
    price: 97,
    badge: "Popular",
    badgeColor: "bg-[#FBBC0C] text-[#0A1628]",
    highlighted: false,
    features: [
      "7 modulos de contenido",
      "25 lecciones practicas",
      "AI Lab con Gemini (500 consultas/mes)",
      "Certificado digital verificable",
      "Proyecto final con portafolio",
      "Acceso por 6 meses",
    ],
  },
  {
    id: "765cd165-6adc-413a-9a19-9c1219681a81",
    name: "Curso Estandar",
    subtitle: "IA Aplicada",
    price: 197,
    badge: "Recomendado",
    badgeColor: "bg-[#73B8E7] text-white",
    highlighted: true,
    features: [
      "Todo lo del Express, mas:",
      "Modulos avanzados de IA",
      "AI Lab multi-modelo (3 modelos)",
      "Peer review con companeros",
      "Soporte por WhatsApp",
      "Acceso por 12 meses",
      "Actualizaciones incluidas",
    ],
  },
  {
    id: "259e324f-83c3-463e-bec4-c8b99cbecbd4",
    name: "Curso Completo",
    subtitle: "Especialista IA",
    price: 297,
    badge: "Premium",
    badgeColor: "bg-[#F0846D] text-white",
    highlighted: false,
    features: [
      "Todo lo del Estandar, mas:",
      "Mentoria 1:1 con docente",
      "Proyectos con datos reales H3L",
      "Acceso a Strata profesional",
      "Bolsa de trabajo ITSEIA",
      "Acceso de por vida",
      "Comunidad alumni exclusiva",
      "Certificacion avanzada",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FBBC0C] flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#0A1628]" />
            </div>
            <span className="text-white font-bold text-lg">ITSEIA</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/5"
              >
                Iniciar sesion
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold"
              >
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <Badge className="bg-[#FBBC0C]/10 text-[#FBBC0C] border-none mb-4">
            Precios en USD
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Invierte en tu futuro con IA
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Elige el plan que se ajuste a tus objetivos. Todos incluyen acceso
            al AI Lab con inteligencia artificial real.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PROGRAMS.map((program) => (
            <div
              key={program.id}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                program.highlighted
                  ? "bg-gradient-to-b from-[#1F2F58] to-[#0A1628] border-[#73B8E7]/30 shadow-lg shadow-[#73B8E7]/5 scale-[1.02]"
                  : "bg-white/[0.02] border-white/10"
              }`}
            >
              {/* Badge */}
              <Badge
                className={`absolute -top-3 left-6 border-none text-xs font-semibold ${program.badgeColor}`}
              >
                {program.badge}
              </Badge>

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{program.name}</h3>
                <p className="text-white/40 text-sm">{program.subtitle}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    ${program.price}
                  </span>
                  <span className="text-white/30 text-sm">USD</span>
                </div>
                <p className="text-white/30 text-xs mt-1">Pago unico</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {program.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        program.highlighted ? "text-[#73B8E7]" : "text-[#FBBC0C]"
                      }`}
                    />
                    <span className="text-white/60 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={`/checkout/${program.id}`}>
                <Button
                  className={`w-full h-12 font-semibold text-base gap-2 ${
                    program.highlighted
                      ? "bg-[#73B8E7] text-white hover:bg-[#73B8E7]/90 shadow-lg shadow-[#73B8E7]/20"
                      : "bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90"
                  }`}
                >
                  Inscribirme
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Preuniversitario */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Badge className="bg-[#FBBC0C]/10 text-[#FBBC0C] border-none mb-2">
                Bachilleres
              </Badge>
              <h3 className="text-xl font-bold text-white">
                Preuniversitario IA
              </h3>
              <p className="text-white/40 text-sm mt-1 max-w-lg">
                Preparate para estudiar inteligencia artificial. Ideal si
                acabas de terminar el colegio y quieres una ventaja antes de
                empezar la carrera.
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-white">$180</p>
              <p className="text-white/30 text-xs">USD / pago unico</p>
              <Link href="/checkout/958d9795-8958-450e-828a-ff24eb4b0f00">
                <Button className="mt-3 bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold gap-2">
                  Inscribirme
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Guarantees */}
        <div className="grid sm:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <Zap className="w-6 h-6 text-[#FBBC0C]" />,
              title: "Acceso inmediato",
              desc: "Empieza a estudiar al instante",
            },
            {
              icon: <MessageSquare className="w-6 h-6 text-[#73B8E7]" />,
              title: "AI Lab incluido",
              desc: "ChatGPT, Claude, Gemini pagados",
            },
            {
              icon: <GraduationCap className="w-6 h-6 text-[#F0846D]" />,
              title: "Certificado oficial",
              desc: "Verificable con QR",
            },
            {
              icon: <BookOpen className="w-6 h-6 text-white/60" />,
              title: "100% online",
              desc: "Estudia a tu ritmo",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                {item.icon}
              </div>
              <p className="text-white font-medium text-sm">{item.title}</p>
              <p className="text-white/30 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="text-center">
          <p className="text-white/30 text-sm">
            Preguntas? Escribenos al{" "}
            <a
              href="https://wa.me/593959892034"
              target="_blank"
              className="text-[#FBBC0C] hover:underline"
            >
              WhatsApp +593 95 989 2034
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
