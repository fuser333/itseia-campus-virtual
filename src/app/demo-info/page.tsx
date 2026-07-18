import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import {
  Sparkles,
  ArrowRight,
  Music,
  Wand2,
  Video,
  PlayCircle,
  Mic,
  Film,
  LogIn,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Demo del Campus Virtual | ITSEIA",
  description:
    "Explora el Campus Virtual de ITSEIA antes de matricularte. 3 días de muestra del Preuniversitario con videos, presentaciones y herramientas reales.",
};

const DEMO_DAYS = [
  {
    num: "01",
    title: "Hoy hago una IA que habla como yo",
    subtitle: "Semana 1 · Ignición",
    tools: "Suno · Midjourney · Lovable",
    desc: "Tu primera canción, tu avatar anime y tu app funcional en las primeras 2 horas. Sin programar.",
    color: "#FBBC0C",
    icon: Music,
  },
  {
    num: "02",
    title: "Mi voz habla 5 idiomas",
    subtitle: "Semana 1 · Ignición",
    tools: "ElevenLabs · HeyGen · Gemini",
    desc: "Clonas tu voz en 30 segundos. Generas un avatar tuyo presentando en chino, árabe y japonés.",
    color: "#73B8E7",
    icon: Mic,
  },
  {
    num: "03",
    title: "Animé mi foto del colegio",
    subtitle: "Semana 1 · Ignición",
    tools: "Kling · Runway · Pika Labs",
    desc: "Tu foto se convierte en video cinematográfico. La IA genera física, luz y cámara.",
    color: "#F0846D",
    icon: Film,
  },
];

const STATS = [
  { value: "3", label: "días completos de muestra" },
  { value: "40h", label: "clase en vivo en el programa" },
  { value: "20", label: "días totales del Preuniversitario" },
  { value: "$99", label: "matrícula total del Preuni" },
];

export default function DemoInfoPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <PublicHeader />

      {/* Banner estudiante */}
      <div className="bg-gradient-to-r from-[#FBBC0C]/10 via-[#F0846D]/5 to-[#FBBC0C]/10 border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-3 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-white/80">
            <Sparkles className="w-4 h-4 text-[#FBBC0C]" />
            <span>¿Ya tienes acceso al demo?</span>
            <Link
              href="/demo"
              className="text-[#FBBC0C] font-bold hover:text-[#E5AB00] transition-colors inline-flex items-center gap-1"
            >
              Ingresa aquí <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Background ambient */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(251,188,12,0.10) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(115,184,231,0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#FBBC0C] animate-pulse" />
            <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">
              Acceso al demo · Sin registro
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Así se ve el{" "}
            <span className="text-[#FBBC0C]">Campus Virtual</span>{" "}
            ITSEIA.
          </h1>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-3xl">
            Explora 3 días reales del Preuniversitario antes de decidir. Videos
            de clase, presentaciones, ejercicios, herramientas de IA — todo
            funcionando. Sin registro, sin compromisos, sin fricciones.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#FBBC0C] text-[#0A1628] font-bold hover:bg-[#E5AB00] transition-all shadow-xl shadow-[#FBBC0C]/20 group"
            >
              <LogIn className="w-5 h-5" />
              Entrar al demo ahora
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/preuni-info"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white hover:bg-white/[0.04] transition-all font-semibold"
            >
              Ver Preuniversitario completo
            </Link>
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[#1F2F58]/30 border border-white/[0.06]">
            <Clock className="w-4 h-4 text-[#73B8E7]" />
            <p className="text-sm text-white/70">
              Credenciales del demo:{" "}
              <code className="mx-1 px-2 py-0.5 rounded bg-white/5 text-[#FBBC0C] font-mono text-xs">
                demo@itseia.ai
              </code>{" "}
              /{" "}
              <code className="mx-1 px-2 py-0.5 rounded bg-white/5 text-[#FBBC0C] font-mono text-xs">
                demo2026
              </code>
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative max-w-7xl mx-auto px-6 py-12 border-y border-white/[0.06]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                className="text-3xl md:text-5xl font-bold text-[#FBBC0C] mb-2"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                {s.value}
              </div>
              <div className="text-xs md:text-sm text-white/50 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lo que vas a encontrar */}
      <section className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#73B8E7] mb-4 font-bold">
              Contenido del demo
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Tres días reales del programa.
            </h2>
            <p className="text-white/60 leading-relaxed">
              Son los primeros 3 días del Preuniversitario IGNITE de 20 días.
              Cada día tiene su sesión de 2 horas en vivo, sus recursos, sus
              ejercicios y sus proyectos prácticos con herramientas reales.
            </p>
          </div>
          <div className="space-y-4">
            {DEMO_DAYS.map((day) => {
              const Icon = day.icon;
              return (
                <div
                  key={day.num}
                  className="rounded-2xl border p-6 md:p-7 transition-all"
                  style={{
                    borderColor: `${day.color}40`,
                    background: `linear-gradient(145deg, ${day.color}08 0%, rgba(31,47,88,0.3) 100%)`,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className="shrink-0 text-5xl md:text-6xl font-bold leading-none"
                      style={{
                        color: day.color,
                        fontFamily: "var(--font-space-grotesk), serif",
                        fontStyle: "italic",
                      }}
                    >
                      {day.num}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" style={{ color: day.color }} />
                        <span
                          className="text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: day.color }}
                        >
                          {day.subtitle}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                        {day.title}
                      </h3>
                      <p className="text-sm text-white/55 uppercase tracking-wide mb-3 font-mono">
                        {day.tools}
                      </p>
                      <p className="text-white/70 leading-relaxed text-sm md:text-base">
                        {day.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Qué tiene el Campus */}
      <section className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-white/[0.06]">
        <div className="max-w-3xl mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#73B8E7] mb-4 font-bold">
            Dentro del demo
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Tu panel de estudiante, como lo verás cuando te matricules.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: PlayCircle,
              title: "Videos de clase",
              desc: "Grabación completa de cada sesión en vivo, con YouTube embedded y reproducción a tu ritmo.",
            },
            {
              icon: Wand2,
              title: "Herramientas reales",
              desc: "Suno, Midjourney, Lovable, ElevenLabs, HeyGen, Kling — todas las IAs que vas a usar.",
            },
            {
              icon: Video,
              title: "Campus con menú",
              desc: "Sidebar con los 20 días del programa, herramientas, foros, cohorte, progreso y certificados.",
            },
            {
              icon: CheckCircle2,
              title: "Ejercicios prácticos",
              desc: "Cada día tiene su proyecto autónomo de 1h con entregable claro y rúbrica.",
            },
            {
              icon: Sparkles,
              title: "Agenda por sesión",
              desc: "Desglose minuto a minuto de las 2 horas de clase: qué vas a hacer y cuándo.",
            },
            {
              icon: ArrowRight,
              title: "Demo sin fricción",
              desc: "No tienes que registrarte. Con las credenciales del demo entras y ya.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl border border-white/[0.08] bg-[#1F2F58]/20 hover:border-white/[0.15] transition-all"
              >
                <Icon className="w-6 h-6 text-[#FBBC0C] mb-4" />
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F0846D]/10 border border-[#F0846D]/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-[#F0846D] text-xs font-bold uppercase tracking-wide">
            Acceso libre
          </span>
        </div>
        <h2
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
        >
          Entra y explora. <br />
          <span className="text-[#FBBC0C]">Sin compromisos.</span>
        </h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          No es una presentación de ventas, es el Campus Virtual real con los 3
          primeros días completos. Mira cómo vas a aprender IA en ITSEIA.
        </p>
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-[#FBBC0C] text-[#0A1628] font-bold text-lg hover:bg-[#E5AB00] transition-all shadow-2xl shadow-[#FBBC0C]/30 group"
        >
          <LogIn className="w-5 h-5" />
          Entrar al demo
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <p className="mt-6 text-sm text-white/40">
          Cuando termines: puedes{" "}
          <Link
            href="/preuni-info"
            className="text-[#73B8E7] hover:text-[#FBBC0C] transition-colors underline"
          >
            matricularte en el Preuniversitario completo
          </Link>{" "}
          o{" "}
          <Link
            href="/carreras-info"
            className="text-[#73B8E7] hover:text-[#FBBC0C] transition-colors underline"
          >
            ver las 3 carreras
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
