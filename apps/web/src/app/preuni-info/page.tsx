import PublicHeader from "@/components/layout/PublicHeader";
import Link from "next/link";
import {
  Rocket, Zap, Brain, BookOpen, Star, Clock,
  CheckCircle2, ArrowRight, Sparkles, Calendar,
} from "lucide-react";

export const metadata = {
  title: "Preuniversitario IGNITE | ITSEIA",
  description:
    "Preuniversitario online de IA — IGNITE. 20 días intensivos por $99 pago único. Tu rampa de ingreso al mundo de la IA.",
};

export default function PreuniInfoPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] font-sans overflow-x-hidden">
      {/* WhatsApp float */}
      <a
        href="https://wa.me/593959892034?text=Hola%2C%20quiero%20información%20sobre%20IGNITE%20(Preuniversitario)"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE59] text-white px-4 py-3 rounded-full shadow-2xl shadow-[#25D366]/30 transition-all hover:scale-105"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
        <span className="text-sm font-semibold hidden sm:block">WhatsApp</span>
      </a>

      <PublicHeader />

      {/* Login access — prominent banner */}
      <div className="text-center py-4 px-4 bg-gradient-to-r from-[#FBBC0C]/10 via-[#FBBC0C]/15 to-[#FBBC0C]/10 border-b border-[#FBBC0C]/20">
        <a href="/login?module=preuni&redirect=/preuni" className="inline-flex items-center gap-3 group">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FBBC0C]/20 group-hover:bg-[#FBBC0C]/30 transition-colors">
            <Rocket className="w-4 h-4 text-[#FBBC0C]" />
          </span>
          <span className="text-white font-semibold text-sm sm:text-base">¿Ya eres estudiante de IGNITE?</span>
          <span className="text-[#FBBC0C] font-bold text-sm sm:text-base group-hover:underline">Accede a tu preuniversitario →</span>
        </a>
      </div>

      {/* HERO */}
      <section className="relative pt-24 pb-20 px-5 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#F0846D]/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FBBC0C]/[0.05] blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0846D]/15 border border-[#F0846D]/30 text-[#F0846D] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            CUPOS LIMITADOS — INICIO JUNIO 2026
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Tu primer paso en{" "}
            <span className="bg-gradient-to-r from-[#F0846D] to-[#FBBC0C] bg-clip-text text-transparent">
              Inteligencia Artificial
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-white/80 mb-3 max-w-3xl mx-auto leading-relaxed">
            <strong className="text-[#FBBC0C]">IGNITE</strong> — 20 días intensivos online para entender IA, crear tus primeros proyectos y prepararte para una carrera tech.
          </p>
          <p className="text-base text-white/50 mb-10">
            Sin requisitos. Sin programación previa. Solo ganas.
          </p>

          {/* Pricing */}
          <div className="inline-flex flex-col items-center gap-2 px-8 py-6 rounded-2xl bg-gradient-to-br from-[#FBBC0C]/15 to-[#F0846D]/10 border border-[#FBBC0C]/30 mb-8">
            <span className="text-xs font-semibold text-[#FBBC0C] uppercase tracking-wider">Pago único</span>
            <span className="text-5xl font-black text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>$99</span>
            <span className="text-xs text-white/60">20 días · 100% online · A tu ritmo</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20quiero%20información%20sobre%20IGNITE"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#FBBC0C] hover:bg-[#FFD140] text-[#0A1628] font-bold rounded-xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              Reservar mi cupo
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/login?module=preuni&redirect=/preuni"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all"
            >
              Ya soy estudiante
            </Link>
          </div>
        </div>
      </section>

      {/* QUE INCLUYE */}
      <section className="py-20 px-5 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#73B8E7] font-semibold text-sm tracking-wider uppercase">Qué aprenderás</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              20 días que transforman tu manera de pensar
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Brain, w: "Semana 1", t: "Ignición", d: "Qué es la IA, herramientas básicas, primeros prompts" },
              { icon: Zap, w: "Semana 2", t: "Construcción", d: "Apps sin código, Bubble, Glide, Softr" },
              { icon: Sparkles, w: "Semana 3", t: "Automatización", d: "Make, Zapier, agentes IA, workflows" },
              { icon: Rocket, w: "Semana 4", t: "Lanzamiento", d: "Pricing, marketing, demo day" },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#FBBC0C]/30 transition-all">
                <s.icon className="w-7 h-7 text-[#FBBC0C] mb-3" />
                <div className="text-[10px] font-semibold text-[#73B8E7] uppercase tracking-wider mb-1">{s.w}</div>
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.t}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INCLUIDO */}
      <section className="py-20 px-5 border-t border-white/[0.06] bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-12" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Todo incluido en los <span className="text-[#FBBC0C]">$99</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-3xl mx-auto">
            {[
              "20 días de contenido en video",
              "AI Lab con ChatGPT, Claude y Gemini",
              "Ejercicios prácticos guiados",
              "Foro privado de cohorte",
              "Soporte por WhatsApp",
              "Certificado de finalización",
              "Plantillas y recursos descargables",
              "Acceso al material por 6 meses",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <CheckCircle2 className="w-5 h-5 text-[#FBBC0C] flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUIEN */}
      <section className="py-20 px-5 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-12" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            ¿Para quién es IGNITE?
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { t: "Estudiantes de bachillerato", d: "Que quieren saber si la IA es lo suyo antes de elegir carrera." },
              { t: "Profesionales en transición", d: "Que ven que su trabajo va a cambiar y quieren adelantarse." },
              { t: "Curiosos sin experiencia", d: "Que oyeron de IA pero nunca se animaron a probar de verdad." },
            ].map((p, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <Star className="w-5 h-5 text-[#73B8E7] mb-3" />
                <h3 className="font-bold text-white mb-2">{p.t}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-5 border-t border-white/[0.06] bg-gradient-to-b from-transparent to-[#FBBC0C]/[0.05]">
        <div className="max-w-3xl mx-auto text-center">
          <Calendar className="w-10 h-10 text-[#FBBC0C] mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Próxima cohorte: <span className="text-[#FBBC0C]">Junio 2026</span>
          </h2>
          <p className="text-white/70 mb-8">Cupos limitados. Reserva tu lugar antes de que se llenen.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20quiero%20reservar%20mi%20cupo%20en%20IGNITE"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#FBBC0C] hover:bg-[#FFD140] text-[#0A1628] font-bold rounded-xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              Reservar mi cupo
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/demo-info"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all inline-flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Ver demo gratis
            </Link>
          </div>

          <p className="text-xs text-white/40 mt-8">
            <Clock className="w-3 h-3 inline mr-1" />
            Pago único de $99 — Sin mensualidades — Acceso por 6 meses
          </p>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="border-t border-white/[0.06] py-8 px-5 text-center">
        <p className="text-white/30 text-xs">© 2026 ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial</p>
      </footer>
    </div>
  );
}
