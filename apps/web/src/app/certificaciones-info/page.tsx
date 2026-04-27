"use client";

import { useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";

// ─────────────────────────────────────────────
// /certificaciones-info — Sales landing for cloud certifications
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
            mensaje: `Nueva inscripcion desde tecnologico.itseia.ai — Producto: ${producto}`,
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
        <p className="text-white/55 text-sm">Te contactamos en menos de 24 horas. Envia tu comprobante de pago por WhatsApp.</p>
        <a href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20en%20las%20certificaciones%20ITSEIA" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#25D366] text-sm font-semibold hover:underline">Enviar comprobante por WhatsApp →</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#FBBC0C]/25 p-8" style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}>
      <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
        <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Inscripcion — Certificaciones incluidas en carrera</span>
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
        {status === "sending" ? "Enviando..." : "Reservar mi cupo ahora"}
      </button>

      {status === "error" && <p className="text-red-400 text-xs text-center mb-4">Error al enviar. Escribe por WhatsApp directamente.</p>}

      {/* Datos de pago */}
      <div className="border-t border-white/[0.08] pt-5 space-y-3">
        <p className="text-white/40 text-xs uppercase tracking-wider font-bold text-center mb-3">Datos para deposito / transferencia</p>
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
            <a href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20en%20las%20certificaciones%20ITSEIA" target="_blank" rel="noopener noreferrer" className="text-[#25D366] text-sm font-bold hover:underline">+593 95 989 2034</a>
          </div>
        </div>
      </div>
    </form>
  );
}

const CERTS = [
  {
    abbr: "AWS",
    name: "AWS Cloud Practitioner",
    provider: "Amazon Web Services",
    value: "$100",
    color: "#FF9900",
    borderColor: "rgba(255,153,0,0.25)",
    glowColor: "rgba(255,153,0,0.06)",
    status: "Disponible",
    desc: "La certificacion de entrada a la nube mas grande del mundo. Valida tus conocimientos fundamentales de AWS.",
    topics: ["Computo en nube", "S3 y almacenamiento", "EC2 y redes", "Seguridad IAM", "Costos y facturacion"],
  },
  {
    abbr: "GCP",
    name: "Google Cloud Digital Leader",
    provider: "Google Cloud",
    value: "$300",
    color: "#4285F4",
    borderColor: "rgba(66,133,244,0.25)",
    glowColor: "rgba(66,133,244,0.06)",
    status: "Disponible",
    desc: "Demuestra que entiendes los productos y servicios de Google Cloud y como impulsan la transformacion digital.",
    topics: ["BigQuery", "Vertex AI", "Cloud Run", "Data analytics", "ML con Google"],
  },
  {
    abbr: "AZ",
    name: "Azure AI Fundamentals AI-900",
    provider: "Microsoft Azure",
    value: "$165",
    color: "#0078D4",
    borderColor: "rgba(0,120,212,0.25)",
    glowColor: "rgba(0,120,212,0.06)",
    status: "Disponible",
    desc: "Certifica tu conocimiento en conceptos de IA y aprendizaje automatico en la plataforma de Microsoft.",
    topics: ["Machine Learning", "Vision Computacional", "NLP", "IA Responsable", "Azure Cognitive"],
  },
  {
    abbr: "GH",
    name: "GitHub Copilot",
    provider: "GitHub / Microsoft",
    value: "$200",
    color: "#6E5494",
    borderColor: "rgba(110,84,148,0.25)",
    glowColor: "rgba(110,84,148,0.06)",
    status: "Proximo",
    desc: "Certifica tu dominio de programacion asistida por IA. La herramienta que usan 2M+ desarrolladores.",
    topics: ["Prompt para codigo", "GitHub Actions", "Code review con IA", "Refactoring", "Testing con IA"],
  },
  {
    abbr: "TF",
    name: "TensorFlow Developer",
    provider: "Google / DeepMind",
    value: "$100",
    color: "#FF6F00",
    borderColor: "rgba(255,111,0,0.25)",
    glowColor: "rgba(255,111,0,0.06)",
    status: "Proximo",
    desc: "La certificacion de facto para desarrolladores de machine learning. Reconocida globalmente.",
    topics: ["Redes Neuronales", "CNN", "RNN / LSTM", "Transfer Learning", "Deploy con TF Serving"],
  },
  {
    abbr: "CC",
    name: "Claude Code",
    provider: "Anthropic",
    value: "$150",
    color: "#D97757",
    borderColor: "rgba(217,119,87,0.25)",
    glowColor: "rgba(217,119,87,0.06)",
    status: "Proximo",
    desc: "Certifica tu capacidad de programar con Claude como par. El asistente de codigo mas avanzado del mercado.",
    topics: ["Agentes de codigo", "MCP servers", "Automatizacion CLI", "Testing IA", "Arquitectura con IA"],
  },
];

const FAQS = [
  {
    q: "¿Las certificaciones estan realmente incluidas en la matricula?",
    a: "Si. AWS Cloud Practitioner, Google Cloud Digital Leader y Azure AI Fundamentals estan incluidas como parte del programa de carreras ITSEIA. El material de estudio, los simulacros y la guia de preparacion estan incluidos. El costo del examen oficial puede aplicar segun el proveedor.",
  },
  {
    q: "¿Los examenes son en español o ingles?",
    a: "AWS y Azure permiten tomar el examen en español. Google Cloud esta disponible en ingles y espanol segun el pais. ITSEIA incluye una Guia de Traduccion para los terminos tecnicos mas comunes en los examenes.",
  },
  {
    q: "¿Puedo tomar solo las certificaciones sin inscribirme en una carrera?",
    a: "Si. Las certificaciones estan disponibles como modulo independiente. Puedes acceder a los simulacros y materiales iniciando sesion en la plataforma.",
  },
];

export default function CertificacionesInfoPage() {
  const availableCerts = CERTS.filter((c) => c.status === "Disponible");
  const comingSoon = CERTS.filter((c) => c.status === "Proximo");
  const totalValue = 565; // AWS $100 + GCP $300 + AZ $165

  return (
    <div className="min-h-screen bg-[#0A1628] font-sans overflow-x-hidden">

      {/* WhatsApp float */}
      <a
        href="https://wa.me/593959892034?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20certificaciones%20de%20ITSEIA"
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
          <a href="/login?module=certificaciones" className="inline-flex items-center gap-3 group">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FBBC0C]/20 group-hover:bg-[#FBBC0C]/30 transition-colors">
              <svg className="w-4 h-4 text-[#FBBC0C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v7" /></svg>
            </span>
            <span className="text-white font-semibold text-sm sm:text-base">¿Ya eres estudiante ITSEIA?</span>
            <span className="text-[#FBBC0C] font-bold text-sm sm:text-base group-hover:underline">Accede a tus certificaciones →</span>
          </a>
        </div>


      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 px-5 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#FBBC0C]/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#4285F4]/[0.04] blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] animate-pulse" />
            <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">Incluidas en tu matricula</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Certificaciones{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FF9900 0%, #4285F4 50%, #0078D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AWS, Google Cloud, Azure
            </span>
            <br className="hidden md:block" />
            {" "}incluidas en tu matricula
          </h1>

          <p className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Valor de mercado: <span className="text-[#FBBC0C] font-bold">${totalValue}+ incluidos</span> en tu programa.
            <br />
            Simulacros cronometrados, material oficial y guia en español.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#inscripcion"
              className="bg-[#FBBC0C] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
            >
              Inscribirme ahora
            </a>
            <a
              href="https://itseia.ai/meet/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/15 text-white/80 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-white/[0.05] transition-all"
            >
              Sesion informativa — Sab 11AM
            </a>
          </div>
        </div>
      </section>

      {/* ── VALUE BANNER ── */}
      <div className="border-y border-white/[0.06] bg-[#1F2F58]/20">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "$565+", label: "Valor incluido" },
              { value: "6+", label: "Certificaciones" },
              { value: "100%", label: "Simulacros incluidos" },
              { value: "Esp.", label: "Guia en español" },
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

      {/* ── AVAILABLE CERTS ── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Disponibles ahora
            </h2>
            <p className="text-white/45 max-w-lg mx-auto">
              Estas 3 certificaciones estan activas en la plataforma con simulacros y material completo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {availableCerts.map((cert) => (
              <div
                key={cert.abbr}
                className="relative rounded-2xl border p-7 overflow-hidden"
                style={{
                  borderColor: cert.borderColor,
                  background: `linear-gradient(145deg, ${cert.glowColor} 0%, rgba(31,47,88,0.25) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl pointer-events-none"
                  style={{ background: cert.glowColor }}
                />

                <div className="relative z-10">
                  {/* Provider badge + value */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm text-[#0A1628]"
                      style={{ background: cert.color, fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {cert.abbr}
                    </div>
                    <div className="text-right">
                      <p className="text-white/30 text-xs">Valor de mercado</p>
                      <p
                        className="font-extrabold text-lg"
                        style={{ fontFamily: "var(--font-space-grotesk)", color: cert.color }}
                      >
                        {cert.value}
                      </p>
                    </div>
                  </div>

                  <h3
                    className="text-white font-extrabold text-base mb-1"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {cert.name}
                  </h3>
                  <p className="text-white/35 text-xs mb-3">{cert.provider}</p>
                  <p className="text-white/50 text-sm leading-relaxed mb-5">{cert.desc}</p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cert.topics.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ background: `${cert.color}15`, color: cert.color, border: `1px solid ${cert.color}20` }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${cert.color}20`, color: cert.color }}
                    >
                      Incluida
                    </span>
                    <a
                      href="#inscripcion"
                      className="text-sm font-semibold transition-colors"
                      style={{ color: cert.color }}
                    >
                      Inscribirme para acceder →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming soon */}
          <div className="text-center mb-8">
            <h3
              className="text-xl font-extrabold text-white mb-2"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Proximas certificaciones
            </h3>
            <p className="text-white/35 text-sm">En desarrollo. Disponibles en el proximo cuatrimestre.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {comingSoon.map((cert) => (
              <div
                key={cert.abbr}
                className="rounded-xl border border-white/[0.06] p-5 opacity-60"
                style={{ background: "rgba(31,47,88,0.15)", backdropFilter: "blur(8px)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-extrabold text-[#0A1628]"
                    style={{ background: cert.color, fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {cert.abbr}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{cert.name}</p>
                    <p className="text-white/30 text-xs">{cert.provider}</p>
                  </div>
                </div>
                <span className="text-xs text-white/30 border border-white/10 px-2.5 py-1 rounded-full">Proximo</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE PREPARE YOU ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Como te preparamos
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { color: "#FBBC0C", title: "Material oficial", desc: "Acceso al contenido oficial de cada proveedor cloud, en español cuando aplica." },
              { color: "#73B8E7", title: "Simulacros cronometrados", desc: "Examenes de practica con el mismo formato y tiempo que el examen real." },
              { color: "#F0846D", title: "Guia de traduccion", desc: "Glosario de terminos tecnicos para que el idioma no sea una barrera." },
              { color: "#FBBC0C", title: "Badge en portafolio", desc: "Una vez certificado, el badge aparece en tu portafolio publico ITSEIA." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border p-5 text-center"
                style={{
                  borderColor: `${item.color}20`,
                  background: `${item.color}06`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-3"
                  style={{ background: `${item.color}20`, border: `2px solid ${item.color}40` }}
                />
                <h3
                  className="text-white font-bold text-sm mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {item.title}
                </h3>
                <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-5">
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

      {/* ── FOOTER CTA + INSCRIPCION ── */}
      <section id="inscripcion" className="py-20 px-5 bg-[#1F2F58]/15 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Certificaciones que te abren puertas
            <br />
            <span className="text-[#FBBC0C]">a nivel global.</span>
          </h2>
          <p className="text-white/45 mb-8">Incluidas en tu matricula ITSEIA.</p>
          <InscripcionForm producto="certificaciones" />
        </div>
      </section>
    </div>
  );
}
