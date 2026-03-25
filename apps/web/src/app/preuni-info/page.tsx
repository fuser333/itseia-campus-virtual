"use client";

import { useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";

// ─────────────────────────────────────────────
// /preuni-info — Sales landing for Preuniversitario IA
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
      <div className="rounded-2xl border border-[#73B8E7]/30 p-8 text-center" style={{ background: "rgba(115,184,231,0.06)" }}>
        <div className="w-12 h-12 rounded-full bg-[#73B8E7]/20 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#73B8E7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <p className="text-white font-bold mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Solicitud recibida</p>
        <p className="text-white/55 text-sm">Te contactamos en menos de 24 horas. Envia tu comprobante de pago por WhatsApp.</p>
        <a href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20en%20el%20Preuniversitario%20de%20ITSEIA" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#25D366] text-sm font-semibold hover:underline">Enviar comprobante por WhatsApp →</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#73B8E7]/25 p-8" style={{ background: "linear-gradient(145deg, rgba(115,184,231,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}>
      <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-5">
        <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Paga $180 y reserva tu cupo con beca sabado</span>
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
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#73B8E7]/50 transition-colors"
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
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#73B8E7]/50 transition-colors"
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
          className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#73B8E7]/50 transition-colors"
        />
      </div>
      <input type="hidden" value={producto} />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-[#73B8E7] text-[#0A1628] py-3.5 rounded-xl font-bold text-sm hover:bg-[#5AA8D8] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-[#73B8E7]/20 mb-5"
      >
        {status === "sending" ? "Enviando..." : "Reservar mi cupo ahora"}
      </button>

      {status === "error" && <p className="text-red-400 text-xs text-center mb-4">Error al enviar. Escribe por WhatsApp directamente.</p>}

      {/* Datos de pago */}
      <div className="border-t border-white/[0.08] pt-5 space-y-3">
        <p className="text-white/40 text-xs uppercase tracking-wider font-bold text-center mb-3">Datos para deposito — $180 inscripcion</p>
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
            <a href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20en%20el%20Preuniversitario%20de%20ITSEIA" target="_blank" rel="noopener noreferrer" className="text-[#25D366] text-sm font-bold hover:underline">+593 95 989 2034</a>
          </div>
        </div>
      </div>
    </form>
  );
}

const WEEKS = [
  {
    week: "Semana 1",
    days: "Dias 1–5",
    color: "#FBBC0C",
    borderColor: "rgba(251,188,12,0.25)",
    glowColor: "rgba(251,188,12,0.06)",
    title: "Fundamentos IA",
    topics: [
      "Que es la Inteligencia Artificial y como funciona",
      "Prompt Engineering: como hablarle a la IA",
      "Productividad con IA en tu vida diaria",
      "Introduccion a Python — tu primer programa",
      "Diseño con IA: imagenes, presentaciones, videos",
    ],
  },
  {
    week: "Semana 2",
    days: "Dias 6–10",
    color: "#73B8E7",
    borderColor: "rgba(115,184,231,0.25)",
    glowColor: "rgba(115,184,231,0.06)",
    title: "Datos y Analisis",
    topics: [
      "Excel con IA: automatiza analisis en segundos",
      "Pandas: manipulacion de datos con Python",
      "Visualizacion de datos — graficos que convencen",
      "Streamlit: crea tu primera app web con datos",
      "Mini-Proyecto: analiza un dataset real",
    ],
  },
  {
    week: "Semana 3",
    days: "Dias 11–15",
    color: "#F0846D",
    borderColor: "rgba(240,132,109,0.25)",
    glowColor: "rgba(240,132,109,0.06)",
    title: "Machine Learning y Apps",
    topics: [
      "Machine Learning: tu primera prediccion",
      "Google AI Studio y Gemini avanzado",
      "Apps No-Code con IA: sin escribir codigo",
      "Replit y GitHub Copilot: IA que programa",
      "Automatizacion: flujos que trabajan por ti",
    ],
  },
  {
    week: "Semana 4",
    days: "Dias 16–20",
    color: "#FBBC0C",
    borderColor: "rgba(251,188,12,0.25)",
    glowColor: "rgba(251,188,12,0.06)",
    title: "Proyecto Final",
    topics: [
      "Definicion y planificacion del proyecto final",
      "Desarrollo con mentoría personalizada",
      "Presentacion ante panel de evaluadores",
      "Feedback y mejoras en tiempo real",
      "Certificacion ITSEIA + acceso al AI Lab",
    ],
  },
];

const FEATURES = [
  {
    color: "#FBBC0C",
    title: "Sin requisitos previos",
    desc: "No necesitas saber programar. Empezamos desde cero con una metodologia diseñada para aprender rapido.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    color: "#73B8E7",
    title: "AI Lab incluido",
    desc: "ChatGPT, Claude y Gemini disponibles desde el dia 1. Practicas con las herramientas de IA mas poderosas del mundo.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2a10 10 0 1 0 10 10"/>
        <circle cx="19" cy="5" r="3" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    color: "#F0846D",
    title: "Proyecto real al finalizar",
    desc: "No solo ves teoria. Construyes un proyecto con IA que puedes mostrar en tu CV desde el primer dia.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    color: "#FBBC0C",
    title: "Certificado ITSEIA",
    desc: "Al completar el programa recibes certificacion oficial ITSEIA valida para el mercado laboral y acceso a la carrera.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: "¿Que edad necesito para entrar al Preuniversitario?",
    a: "El programa es para jovenes desde los 15 años y adultos de cualquier edad. No hay limite superior. Lo importante es la disposicion para aprender tecnologia.",
  },
  {
    q: "¿El preuniversitario me da acceso directo a la carrera?",
    a: "Si. Al completar el Preuniversitario ITSEIA tienes acceso prioritario a cualquiera de las 3 carreras con un descuento en la inscripcion. Es el camino mas rapido para entrar.",
  },
  {
    q: "¿Es presencial u online?",
    a: "El Preuniversitario se puede tomar en ambas modalidades. Puedes asistir presencialmente en Quito o seguir todas las clases en vivo por internet con grabaciones disponibles.",
  },
];

export default function PreuniInfoPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] font-sans overflow-x-hidden">

      {/* WhatsApp float */}
      <a
        href="https://wa.me/593959892034?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20Preuniversitario%20de%20ITSEIA"
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

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 px-5 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#73B8E7]/[0.05] blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FBBC0C]/[0.04] blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#73B8E7]/10 border border-[#73B8E7]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#73B8E7] animate-pulse" />
            <span className="text-[#73B8E7] text-xs font-semibold tracking-wide uppercase">4 semanas intensivas · Sin requisitos previos</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Preuniversitario IA
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #73B8E7 0%, #FBBC0C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Tu puerta de entrada al mundo
            </span>
            <br />
            de la Inteligencia Artificial
          </h1>

          <p className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            En 4 semanas pasas de cero a crear proyectos reales con IA.
            <br />
            <span className="text-[#FBBC0C]">No necesitas saber programar. Solo trae tu laptop.</span>
          </p>

          {/* Price */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* Precio normal */}
            <div className="inline-flex items-center gap-4 bg-[#1F2F58]/40 border border-[#73B8E7]/25 rounded-2xl px-6 py-4">
              <div className="text-center">
                <span className="text-white/35 text-xs block mb-0.5">Total</span>
                <span
                  className="text-[#73B8E7] text-3xl font-extrabold"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >$480</span>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-left">
                <p className="text-[#73B8E7] text-xs font-bold uppercase tracking-wide">Precio regular</p>
                <p className="text-white/50 text-xs">$180 inscripcion + $300 pension</p>
                <p className="text-white/50 text-xs">AI Lab + Materiales + Certificado</p>
              </div>
            </div>
            {/* Precio becado (charla sabado) */}
            <div className="inline-flex items-center gap-4 bg-[#FBBC0C]/[0.08] border border-[#FBBC0C]/30 rounded-2xl px-6 py-4">
              <div className="text-center">
                <span className="text-[#FBBC0C] text-[10px] font-bold uppercase tracking-wide block mb-0.5">Becado</span>
                <span
                  className="text-[#FBBC0C] text-3xl font-extrabold"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >$400</span>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-left">
                <p className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Charla sabado</p>
                <p className="text-white/50 text-xs">$180 inscripcion + $220 pension</p>
                <p className="text-white/50 text-xs">Solo para asistentes sabado 11AM</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#inscripcion"
              className="bg-[#73B8E7] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#5AA8D8] transition-all hover:scale-[1.02] shadow-xl shadow-[#73B8E7]/25"
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

      {/* ── STATS ── */}
      <div className="border-y border-white/[0.06] bg-[#1F2F58]/20">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "20", label: "Dias de formacion" },
              { value: "4", label: "Semanas intensivas" },
              { value: "100%", label: "Practico y aplicado" },
              { value: "$480", label: "Precio regular" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl font-extrabold mb-1"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    background: "linear-gradient(135deg, #73B8E7, #FBBC0C)",
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

      {/* ── FEATURES ── */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              ¿Por que el Preuniversitario ITSEIA?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border p-6 flex gap-4"
                style={{
                  borderColor: `${f.color}20`,
                  background: `linear-gradient(145deg, ${f.color}08 0%, rgba(31,47,88,0.2) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${f.color}20`, color: f.color }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1.5" style={{ fontFamily: "var(--font-space-grotesk)" }}>{f.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM 4 WEEKS ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Programa semana a semana
            </h2>
            <p className="text-white/45 max-w-lg mx-auto">
              20 dias. Cada dia aprendes algo nuevo y aplicable al dia siguiente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {WEEKS.map((w) => (
              <div
                key={w.week}
                className="rounded-2xl border p-7"
                style={{
                  borderColor: w.borderColor,
                  background: `linear-gradient(145deg, ${w.glowColor} 0%, rgba(31,47,88,0.25) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                    style={{ background: `${w.color}20`, color: w.color, border: `1px solid ${w.color}30` }}
                  >
                    {w.week}
                  </div>
                  <span className="text-white/35 text-xs">{w.days}</span>
                </div>
                <h3
                  className="text-lg font-extrabold text-white mb-4"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {w.title}
                </h3>
                <ul className="space-y-2.5">
                  {w.topics.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-white/60 text-sm">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                        style={{ background: w.color }}
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-2xl border border-white/[0.08] p-10"
            style={{ background: "rgba(31,47,88,0.3)", backdropFilter: "blur(16px)" }}
          >
            <p className="text-white/75 text-lg leading-relaxed italic mb-6">
              "Yo nunca habia programado. En la primera semana ya tenia un chatbot funcionando con mi propio
              dataset. El Preuniversitario me abrio los ojos a lo que es posible con IA."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#73B8E7]/20 flex items-center justify-center">
                <span className="text-[#73B8E7] text-sm font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>PV</span>
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">Pedro Vasquez</p>
                <p className="text-white/40 text-xs">Egresado Preuniversitario — ahora en Carrera IA</p>
              </div>
            </div>
          </div>
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

      {/* ── FOOTER CTA + INSCRIPCION ── */}
      <section id="inscripcion" className="py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Tu primer paso en IA
            <br />
            <span className="text-[#73B8E7]">empieza hoy.</span>
          </h2>
          <p className="text-white/45 mb-8">$480 precio regular. Becado $400 si asistes el sabado. Sin requisitos previos.</p>
          <InscripcionForm producto="preuniversitario" />
        </div>
      </section>
    </div>
  );
}
