"use client";

import { useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";

// ─────────────────────────────────────────────
// /demo-info — Sales landing for the free Demo (IGNITE Preuni)
// Patrón visual idéntico a /carreras-info
// ─────────────────────────────────────────────

// EmailJS config
const EMAILJS_SERVICE = "service_yqv4dts";
const EMAILJS_TEMPLATE = "template_mallas";
const EMAILJS_KEY = "A7cQPi8jRCDyLrHQr";

function InscripcionForm({ producto }: { producto: string }) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre || !whatsapp || !email) return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE,
          template_id: EMAILJS_TEMPLATE,
          user_id: EMAILJS_KEY,
          template_params: {
            nombre,
            whatsapp,
            email,
            producto,
            mensaje: `Solicitud de cohorte completa desde tecnologico.itseia.ai — Producto: ${producto}`,
          },
        }),
      });
      if (res.ok) {
        setStatus("ok");
        setNombre(""); setWhatsapp(""); setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-[#FBBC0C]/30 p-8 text-center" style={{ background: "rgba(251,188,12,0.06)" }}>
        <div className="w-12 h-12 rounded-full bg-[#FBBC0C]/20 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <p className="text-white font-bold mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Solicitud recibida</p>
        <p className="text-white/55 text-sm">Te contactamos en menos de 24 horas con el enlace para reservar tu cupo en la cohorte completa de IGNITE.</p>
        <a href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20en%20la%20cohorte%20IGNITE%20de%20ITSEIA" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#25D366] text-sm font-semibold hover:underline">Confirmar por WhatsApp →</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#FBBC0C]/25 p-8" style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}>
      <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
        <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Reserva tu cupo en IGNITE — Junio 2026</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-1.5">Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Tu nombre"
            required
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FBBC0C]/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-1.5">WhatsApp</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="+593 99 999 9999"
            required
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FBBC0C]/50 transition-colors"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FBBC0C]/50 transition-colors"
        />
      </div>
      <input type="hidden" value={producto} />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-[#FBBC0C] text-[#0A1628] py-3.5 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-[#FBBC0C]/20 mb-5"
      >
        {status === "sending" ? "Enviando..." : "Quiero la cohorte completa"}
      </button>

      {status === "error" && <p className="text-red-400 text-xs text-center mb-4">Error al enviar. Escribe por WhatsApp directamente.</p>}

      {/* Datos de pago */}
      <div className="border-t border-white/[0.08] pt-5 space-y-3">
        <p className="text-white/40 text-xs uppercase tracking-wider font-bold text-center mb-3">Datos para depósito / transferencia</p>
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <div>
            <p className="text-white text-sm font-semibold">Produbanco — Cta. Corriente</p>
            <p className="text-[#FBBC0C] text-sm font-bold tracking-widest">27059145711</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 text-[#25D366]">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
          <div>
            <p className="text-white text-sm font-semibold">WhatsApp</p>
            <a href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20en%20la%20cohorte%20IGNITE%20de%20ITSEIA" target="_blank" rel="noopener noreferrer" className="text-[#25D366] text-sm font-bold hover:underline">+593 95 989 2034</a>
          </div>
        </div>
      </div>
    </form>
  );
}

const DEMO_DAYS = [
  {
    abbr: "D1",
    color: "#FBBC0C",
    borderColor: "rgba(251,188,12,0.25)",
    glowColor: "rgba(251,188,12,0.06)",
    name: "Hoy hago una IA que habla como yo",
    desc: "Tu primera canción, tu avatar anime y tu app funcional en las primeras 2 horas. Sin programar, sin instalar nada, sin frustración.",
    topics: ["Suno", "Midjourney", "Lovable", "Onboarding", "Cohorte", "Ignición"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
  },
  {
    abbr: "D2",
    color: "#73B8E7",
    borderColor: "rgba(115,184,231,0.25)",
    glowColor: "rgba(115,184,231,0.06)",
    name: "Mi voz habla 5 idiomas",
    desc: "Clonas tu voz en 30 segundos. Generas un avatar tuyo presentando en chino, árabe y japonés. Aprendes prompting con Gemini.",
    topics: ["ElevenLabs", "HeyGen", "Gemini", "Voice Clone", "Avatar IA", "Prompting"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
      </svg>
    ),
  },
  {
    abbr: "D3",
    color: "#F0846D",
    borderColor: "rgba(240,132,109,0.25)",
    glowColor: "rgba(240,132,109,0.06)",
    name: "Animé mi foto del colegio",
    desc: "Tu foto se convierte en video cinematográfico. La IA genera física, luz, cámara y movimiento. Tu primer corto en 90 minutos.",
    topics: ["Kling", "Runway", "Pika Labs", "Video IA", "Animación", "Storytelling"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
  },
];

const COMPARATIVA = [
  { feature: "Días de contenido completos", demo: "5 días (Semana 1)", cohorte: "20 días (4 semanas)" },
  { feature: "Sesiones en vivo con docente", demo: "0 (grabadas)", cohorte: "20 sesiones de 2h" },
  { feature: "AI Lab (ChatGPT, Claude, Gemini)", demo: "Lectura", cohorte: "Acceso completo" },
  { feature: "Herramientas pagadas incluidas", demo: "Demo gratuito", cohorte: "Suno, ElevenLabs, HeyGen, Kling" },
  { feature: "Tutor IA personalizado", demo: "—", cohorte: "Incluido 24/7" },
  { feature: "Foros y cohorte", demo: "Vista previa", cohorte: "Cohorte real con compañeros" },
  { feature: "Certificado de finalización", demo: "—", cohorte: "Incluido" },
  { feature: "Pase a NEXUS o TITAN", demo: "—", cohorte: "Beca H3L activa" },
];

const FAQS = [
  {
    q: "¿El demo realmente es gratis?",
    a: "Sí. Es 100% gratis. Solo necesitas las credenciales demo@itseia.ai / demo2026. No te pedimos tarjeta, ni datos bancarios, ni firma de nada. Entras, exploras la primera semana de IGNITE y decides si quieres la cohorte completa.",
  },
  {
    q: "¿Por qué solo dan acceso a la primera semana?",
    a: "Porque la primera semana es la más representativa: muestra el ritmo, la calidad de los videos, el AI Lab, los ejercicios y el panel del estudiante. Si la primera semana te convence, las otras 3 semanas tienen el mismo estándar.",
  },
  {
    q: "¿Puedo terminar la primera semana sin pagar?",
    a: "Sí. Los 5 días de la Semana 1 están completos en el demo: video, agenda, ejercicios y herramientas. Lo que no incluye el demo son las sesiones en vivo de la cohorte real ni las herramientas pagadas (Suno Pro, ElevenLabs, HeyGen, Kling).",
  },
  {
    q: "Si me gusta el demo, ¿cómo me inscribo en la cohorte completa?",
    a: "Llenas el formulario al final de esta página o nos escribes por WhatsApp al +593 95 989 2034. La cohorte IGNITE inicia en junio 2026 y son 30 cupos. Pago único de $99 por los 20 días completos.",
  },
];

export default function DemoInfoPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] font-sans overflow-x-hidden">

      {/* WhatsApp float */}
      <a
        href="https://wa.me/593959892034?text=Hola%2C%20probé%20el%20demo%20gratis%20y%20quiero%20información%20de%20IGNITE"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE59] text-white px-4 py-3 rounded-full shadow-2xl shadow-[#25D366]/30 transition-all hover:scale-105"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
        <span className="text-sm font-semibold hidden sm:block">WhatsApp</span>
      </a>

      <PublicHeader />
        {/* Login access — prominent banner */}
        <div className="text-center py-4 px-4 bg-gradient-to-r from-[#FBBC0C]/10 via-[#FBBC0C]/15 to-[#FBBC0C]/10 border-b border-[#FBBC0C]/20">
          <a href="/login?module=demo" className="inline-flex items-center gap-3 group">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FBBC0C]/20 group-hover:bg-[#FBBC0C]/30 transition-colors">
              <svg className="w-4 h-4 text-[#FBBC0C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v7" /></svg>
            </span>
            <span className="text-white font-semibold text-sm sm:text-base">¿Quieres acceder al demo gratis?</span>
            <span className="text-[#FBBC0C] font-bold text-sm sm:text-base group-hover:underline">Entra al demo →</span>
          </a>
        </div>


      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 px-5 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#FBBC0C]/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#73B8E7]/[0.05] blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] animate-pulse" />
            <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">Demo gratuito · Sin tarjeta · Sin compromiso</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Demo gratis de{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FBBC0C 0%, #F0846D 60%, #73B8E7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              IGNITE Preuni
            </span>
            <br className="hidden md:block" />
            {" "}vive la primera semana sin pagar
          </h1>

          <p className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Explora 5 días reales del Preuniversitario antes de matricularte.
            <br />
            <span className="text-[#73B8E7]">Videos de clase · AI Lab · Ejercicios prácticos · Cero registros.</span>
          </p>

          {/* Price block */}
          <div className="inline-flex items-center gap-4 bg-[#1F2F58]/40 border border-[#FBBC0C]/25 rounded-2xl px-6 py-4 mb-8">
            <div className="text-center">
              <span className="text-white/40 text-xs line-through block">Cohorte completa: $99</span>
              <span
                className="text-[#FBBC0C] text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              ><span className="block text-3xl md:text-4xl">GRATIS<span className="text-base font-normal">/semana 1</span></span></span>
              <span className="text-white/50 text-xs">acceso inmediato</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-left">
              <p className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Credenciales del demo</p>
              <p className="text-white/60 text-xs font-mono">demo@itseia.ai</p>
              <p className="text-white/60 text-xs font-mono">demo2026</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/login?module=demo"
              className="bg-[#FBBC0C] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
            >
              Entrar al demo ahora
            </a>
            <a
              href="#cohorte"
              className="border border-white/15 text-white/80 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-white/[0.05] transition-all"
            >
              Ver cohorte completa de IGNITE
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="border-y border-white/[0.06] bg-[#1F2F58]/20">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "5", label: "días completos de muestra" },
              { value: "20", label: "días totales en IGNITE" },
              { value: "12+", label: "Herramientas IA reales" },
              { value: "$0", label: "Costo del demo" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl font-extrabold mb-1"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    background: "linear-gradient(135deg, #FBBC0C, #F0846D)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.value}
                </div>
                <div className="text-white/45 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3 DEMO DAYS CARDS ── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Qué incluye el demo
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">
              La Semana 1 completa de IGNITE: 5 días con video de clase, AI Lab, ejercicios y proyectos.
              Aquí abajo te mostramos los primeros 3 días en detalle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {DEMO_DAYS.map((c) => (
              <div
                key={c.abbr}
                className="relative rounded-2xl border p-7 overflow-hidden group hover:scale-[1.01] transition-transform duration-200"
                style={{
                  borderColor: c.borderColor,
                  background: `linear-gradient(145deg, ${c.glowColor} 0%, rgba(31,47,88,0.25) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
                  style={{ background: c.glowColor }}
                />
                <div className="relative z-10">
                  {/* Abbr badge */}
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 font-extrabold text-[#0A1628] text-lg"
                    style={{ background: c.color, fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {c.abbr}
                  </div>

                  <h3
                    className="text-xl font-extrabold text-white mb-3 leading-tight"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {c.name}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed mb-5">{c.desc}</p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {c.topics.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md text-xs font-medium"
                        style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}20` }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <a
                      href="/login?module=demo"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#73B8E7] hover:text-[#FBBC0C] transition-colors"
                    >
                      Ver este día →
                    </a>
                    <a
                      href="#cohorte"
                      className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                      style={{ color: c.color }}
                    >
                      Cohorte completa →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUIÉN ES EL DEMO ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Para quién es el demo
            </h2>
            <p className="text-white/45 max-w-lg mx-auto">
              Si te identificas con alguno de estos perfiles, el demo de IGNITE te va a servir para tomar la decisión.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Estudiante curioso */}
            <div
              className="rounded-2xl border border-[#FBBC0C]/20 p-7"
              style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.06) 0%, rgba(31,47,88,0.25) 100%)", backdropFilter: "blur(12px)" }}
            >
              <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/15 border border-[#FBBC0C]/25 rounded-full px-3 py-1.5 mb-5">
                <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wider">Estudiante 16-22 años</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Quieres entrar a la universidad pero todavía no decides carrera",
                  "Te llama la atención la IA y quieres probar antes de pagar",
                  "Necesitas ver con tus propios ojos cómo funciona el campus",
                  "Tu familia quiere comprobar la calidad del programa",
                  "Buscas una alternativa práctica al curso de nivelación tradicional",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/65 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Profesional/padre */}
            <div
              className="rounded-2xl border border-[#73B8E7]/20 p-7"
              style={{ background: "linear-gradient(145deg, rgba(115,184,231,0.06) 0%, rgba(31,47,88,0.25) 100%)", backdropFilter: "blur(12px)" }}
            >
              <div className="inline-flex items-center gap-2 bg-[#73B8E7]/15 border border-[#73B8E7]/25 rounded-full px-3 py-1.5 mb-5">
                <span className="text-[#73B8E7] text-xs font-bold uppercase tracking-wider">Profesional o padre/madre</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Quieres validar la calidad antes de inscribir a tu hijo o hija",
                  "Buscas reconvertirte profesionalmente en IA aplicada",
                  "Necesitas un primer contacto guiado con herramientas reales",
                  "Quieres comparar IGNITE con otros preuniversitarios online",
                  "Te interesan las carreras NEXUS o TITAN como siguiente paso",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/65 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#73B8E7] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI LAB FEATURE ── */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl border border-[#FBBC0C]/20 p-8 md:p-12 text-center"
            style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(10,22,40,0.9) 100%)", backdropFilter: "blur(16px)" }}
          >
            <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] animate-pulse" />
              <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">Visible en el demo</span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              AI Lab — herramientas reales, no capturas
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto mb-8 leading-relaxed">
              En el demo ves la lista completa de las 12+ herramientas que usamos en IGNITE.
              Cuando te matriculas en la cohorte completa, las usas todas pagadas por ITSEIA.
              Tú solo estudias y aplicas.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { name: "Suno + ElevenLabs", provider: "Audio IA", color: "#FBBC0C" },
                { name: "HeyGen + Kling", provider: "Video IA", color: "#73B8E7" },
                { name: "Midjourney + Lovable", provider: "Imagen + Apps", color: "#F0846D" },
              ].map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-xl border p-4 text-center"
                  style={{ borderColor: `${tool.color}25`, background: `${tool.color}08` }}
                >
                  <p className="font-bold text-white text-sm mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{tool.name}</p>
                  <p className="text-white/40 text-xs">{tool.provider}</p>
                </div>
              ))}
            </div>
            <a
              href="/login?module=demo"
              className="inline-flex items-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-all"
            >
              Entrar al AI Lab del demo
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── COMPARATIVA DEMO vs COHORTE ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Comparativa: Demo vs Cohorte completa
            </h2>
            <p className="text-white/45 max-w-lg mx-auto">
              El demo es la primera semana. La cohorte completa son 4 semanas con docente en vivo, AI Lab pleno y certificación.
            </p>
          </div>

          <div
            className="rounded-2xl border border-white/[0.08] overflow-hidden"
            style={{ background: "rgba(31,47,88,0.25)", backdropFilter: "blur(12px)" }}
          >
            <div className="grid grid-cols-3 bg-[#0A1628] border-b border-white/[0.08] px-5 py-4 text-xs uppercase tracking-wider font-bold">
              <div className="text-white/50">Característica</div>
              <div className="text-[#73B8E7] text-center">Demo gratis</div>
              <div className="text-[#FBBC0C] text-center">Cohorte completa</div>
            </div>
            {COMPARATIVA.map((row, idx) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 px-5 py-4 text-sm ${idx % 2 === 0 ? "bg-white/[0.01]" : ""} ${idx !== COMPARATIVA.length - 1 ? "border-b border-white/[0.05]" : ""}`}
              >
                <div className="text-white/70 font-medium">{row.feature}</div>
                <div className="text-white/55 text-center">{row.demo}</div>
                <div className="text-[#FBBC0C] text-center font-semibold">{row.cohorte}</div>
              </div>
            ))}
          </div>

          <p className="text-white/40 text-xs text-center mt-6">
            Inicio de cohorte: junio 2026 · 30 cupos · Pago único de $99 vía Produbanco 27059145711
          </p>
        </div>
      </section>

      {/* ── PRECIOS + INSCRIPCION COHORTE ── */}
      <section id="cohorte" className="py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Inversión transparente
          </h2>
          <p className="text-white/45 mb-10">El demo es gratis. La cohorte completa es un pago único.</p>

          <div
            className="rounded-2xl border border-[#FBBC0C]/25 p-8 mb-8"
            style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}
          >
            <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">IGNITE Preuni — Cohorte Junio 2026</span>
            </div>

            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-white/35 text-xl line-through">Precio regular: $300</span>
              <span
                className="text-[#FBBC0C] text-5xl font-extrabold"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              ><span className="block text-4xl md:text-5xl">$99<span className="text-base font-normal"> total</span></span></span>
            </div>
            <p className="text-white/40 text-sm mb-8">Pago único · 20 días online · 30 cupos</p>

            <ul className="space-y-3 text-left mb-6">
              {[
                "20 días de Preuniversitario online (4 semanas)",
                "20 sesiones en vivo de 2 horas con docente",
                "AI Lab: Suno, ElevenLabs, HeyGen, Kling, Midjourney y más",
                "ChatGPT + Claude + Gemini incluidos durante el programa",
                "Tutor IA personalizado disponible 24/7",
                "Cohorte real con compañeros de toda la región",
                "Certificado de finalización ITSEIA",
                "Pase a NEXUS ($99/mes) o TITAN ($149/mes) con Beca H3L",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/65 text-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 mt-0.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/30 text-xs mb-2">Cupos limitados · Inicio junio 2026 · Pago Produbanco 27059145711</p>
          </div>

          <InscripcionForm producto="ignite-preuni" />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl font-extrabold text-white text-center mb-10"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-white/[0.08] p-6"
                style={{ background: "rgba(31,47,88,0.2)", backdropFilter: "blur(12px)" }}
              >
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Pruébalo antes de pagar.
            <br />
            <span className="text-[#FBBC0C]">Es gratis. Es real. Es tu decisión.</span>
          </h2>
          <p className="text-white/45 mb-8">
            Entra al demo con demo@itseia.ai / demo2026 · Si te convence, te esperamos en la cohorte de junio 2026.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/login?module=demo"
              className="bg-[#FBBC0C] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
            >
              Entrar al demo gratis
            </a>
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20probé%20el%20demo%20gratis%20y%20quiero%20información%20de%20IGNITE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#25D366]/30 text-[#25D366]/80 px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#25D366]/[0.08] transition-all"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
