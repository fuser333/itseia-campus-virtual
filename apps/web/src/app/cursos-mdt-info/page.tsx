"use client";

import { useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import { CURSOS_MDT } from "@/app/cursos-mdt/data";

// ─────────────────────────────────────────────
// /cursos-mdt-info — Sales landing for Cursos MDT (Ministerio del Trabajo)
// ─────────────────────────────────────────────

// EmailJS config
const EMAILJS_SERVICE = "service_yqv4dts";
const EMAILJS_TEMPLATE = "template_mallas";
const EMAILJS_KEY = "A7cQPi8jRCDyLrHQr";

function InscripcionForm({ producto }: { producto: string }) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [cursoInteres, setCursoInteres] = useState("Fundamentos de IA Práctica");
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
            producto: `${producto} — ${cursoInteres}`,
            mensaje: `Nueva inscripción desde tecnologico.itseia.ai — Producto: ${producto} (${cursoInteres})`,
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
        <p className="text-white font-bold mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Inscripción recibida</p>
        <p className="text-white/55 text-sm">Te contactamos en menos de 24 horas. Envía tu comprobante de pago por WhatsApp.</p>
        <a href="https://wa.me/593997489821?text=Hola%2C%20quiero%20inscribirme%20en%20un%20curso%20MDT%20de%20ITSEIA" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#25D366] text-sm font-semibold hover:underline">Enviar comprobante por WhatsApp →</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#FBBC0C]/25 p-8" style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}>
      <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
        <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Inscripción directa — Cursos MDT certificados</span>
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
      <div className="mb-6">
        <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-1.5">Curso de interés</label>
        <select
          value={cursoInteres}
          onChange={e => setCursoInteres(e.target.value)}
          className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FBBC0C]/50 transition-colors"
        >
          {CURSOS_MDT.map((c) => (
            <option key={c.slug} value={c.nombre} className="bg-[#0A1628]">
              {c.nombre} ({c.horas}h)
            </option>
          ))}
        </select>
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
            <a href="https://wa.me/593997489821?text=Hola%2C%20quiero%20inscribirme%20en%20un%20curso%20MDT%20de%20ITSEIA" target="_blank" rel="noopener noreferrer" className="text-[#25D366] text-sm font-bold hover:underline">+593 99 748 9821</a>
          </div>
        </div>
      </div>
    </form>
  );
}

const BENEFITS_MDT = [
  {
    title: "Certificado oficial MDT",
    desc: "Certificado avalado por el Ministerio del Trabajo del Ecuador. Validez nacional reconocida por empleadores y entidades del Estado.",
    color: "#FBBC0C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    title: "Modalidad 100% online",
    desc: "Estudia desde cualquier lugar del Ecuador. Plataforma propia ITSEIA con video, presentación, quiz y ejercicio en cada sesión.",
    color: "#73B8E7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    title: "A tu propio ritmo",
    desc: "Sin horarios fijos. Avanza cuando puedas, accede 24/7 al contenido. Ideal para profesionales que trabajan a tiempo completo.",
    color: "#F0846D",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: "Instructor real ITSEIA",
    desc: "Cada curso tiene un instructor con experiencia profesional verificable. Soporte por WhatsApp y revisión de ejercicios.",
    color: "#FBBC0C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    title: "AI Lab incluido",
    desc: "Acceso a ChatGPT, Claude y Gemini durante el curso. Practica con las tres herramientas más potentes del mercado, pagadas por ITSEIA.",
    color: "#73B8E7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2a10 10 0 1 0 10 10"/>
        <path d="M12 6v6l4 2"/>
        <circle cx="19" cy="5" r="3" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: "¿El certificado es realmente del Ministerio del Trabajo?",
    a: "Sí. ITSEIA opera como Operadora de Capacitación registrada ante el Ministerio del Trabajo del Ecuador. Al completar el curso recibes un certificado avalado por el MDT con validez nacional para concursos públicos, ascensos y procesos de selección.",
  },
  {
    q: "¿Cuánto tiempo tengo para completar un curso?",
    a: "Tienes acceso completo al curso por 6 meses desde tu inscripción. La mayoría de estudiantes lo completa en 2 a 4 semanas dedicando 4 a 6 horas semanales. Puedes avanzar a tu ritmo.",
  },
  {
    q: "¿Necesito conocimientos previos?",
    a: "No para los cursos de fundamentos. Los cursos avanzados (Python, SQL, Power BI) tienen prerrequisitos indicados en cada uno, pero la mayoría parten desde cero.",
  },
  {
    q: "¿Puedo tomar varios cursos al mismo tiempo?",
    a: "Sí. Cada curso es independiente. Si tomas 3 cursos a la vez recibes 3 certificados MDT separados al completar cada uno. Consulta por descuentos en paquetes por WhatsApp.",
  },
  {
    q: "¿Cómo pago?",
    a: "Por transferencia o depósito a Produbanco Cta. 27059145711 a nombre de MERKANOVA CIA. LTDA. Envías el comprobante por WhatsApp y activamos tu acceso en menos de 24 horas.",
  },
];

// Color rotativo por curso para visual variety
const COURSE_COLORS = ["#FBBC0C", "#73B8E7", "#F0846D"];

export default function CursosMdtInfoPage() {
  const totalHoras = CURSOS_MDT.reduce((acc, c) => acc + c.horas, 0);

  return (
    <div className="min-h-screen bg-[#0A1628] font-sans overflow-x-hidden">

      {/* WhatsApp float */}
      <a
        href="https://wa.me/593997489821?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20cursos%20MDT%20de%20ITSEIA"
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
        <a href="/login?from=cursos-mdt" className="inline-flex items-center gap-3 group">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FBBC0C]/20 group-hover:bg-[#FBBC0C]/30 transition-colors">
            <svg className="w-4 h-4 text-[#FBBC0C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v7" /></svg>
          </span>
          <span className="text-white font-semibold text-sm sm:text-base">¿Ya eres estudiante MDT?</span>
          <span className="text-[#FBBC0C] font-bold text-sm sm:text-base group-hover:underline">Accede a tus cursos →</span>
        </a>
      </div>

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 px-5 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#FBBC0C]/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#73B8E7]/[0.05] blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] animate-pulse" />
            <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">Avalado por el Ministerio del Trabajo del Ecuador</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            15 cursos certificados{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FBBC0C 0%, #F0846D 60%, #73B8E7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MDT desde $99
            </span>
            <br className="hidden md:block" />
            {" "}100% online a tu ritmo
          </h1>

          <p className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Certificación oficial del Ministerio del Trabajo del Ecuador en{" "}
            {CURSOS_MDT.length} cursos profesionales de IA, datos, automatización y productividad.
            <br />
            <span className="text-[#73B8E7]">Inscríbete hoy. Empieza cuando quieras.</span>
          </p>

          {/* Price block */}
          <div className="inline-flex items-center gap-4 bg-[#1F2F58]/40 border border-[#FBBC0C]/25 rounded-2xl px-6 py-4 mb-8">
            <div className="text-center">
              <span
                className="text-[#FBBC0C] text-3xl font-extrabold block"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Desde $99
              </span>
              <span className="text-white/50 text-xs">por curso · pago único</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-left">
              <p className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Certificado MDT</p>
              <p className="text-white/50 text-xs">Validez nacional reconocida</p>
              <p className="text-white/50 text-xs">Acceso por 6 meses</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#inscripcion"
              className="bg-[#FBBC0C] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
            >
              Inscribirme ahora
            </a>
            <a
              href="https://wa.me/593997489821?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20cursos%20MDT%20de%20ITSEIA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#25D366]/30 text-[#25D366]/80 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-[#25D366]/[0.08] transition-all"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="border-y border-white/[0.06] bg-[#1F2F58]/20">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: `${CURSOS_MDT.length}`, label: "Cursos certificados MDT" },
              { value: `${totalHoras}+`, label: "Horas totales de formación" },
              { value: "100%", label: "Modalidad online" },
              { value: "$99", label: "Precio inicial por curso" },
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

      {/* ── BENEFITS ── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              ¿Qué incluye cada curso MDT?
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">
              No es un PDF descargable. Es una experiencia completa con instructor, herramientas y certificación oficial.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS_MDT.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border p-6 hover:scale-[1.01] transition-transform duration-200"
                style={{
                  borderColor: `${b.color}22`,
                  background: `linear-gradient(145deg, ${b.color}08 0%, rgba(31,47,88,0.25) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${b.color}20`, color: b.color }}
                >
                  {b.icon}
                </div>
                <h3
                  className="text-white font-extrabold text-lg mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {b.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 15 CURSOS LISTADO ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Los {CURSOS_MDT.length} cursos del catálogo
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">
              Cada curso es certificado independiente del MDT. Elige uno o combina varios para construir tu ruta profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CURSOS_MDT.map((curso, idx) => {
              const color = COURSE_COLORS[idx % COURSE_COLORS.length];
              const codigo = `C${idx + 1}`;
              return (
                <div
                  key={curso.slug}
                  className="rounded-2xl border p-6 flex flex-col"
                  style={{
                    borderColor: `${color}22`,
                    background: `linear-gradient(145deg, ${color}06 0%, rgba(31,47,88,0.25) 100%)`,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-extrabold text-[#0A1628] text-sm"
                      style={{ background: color, fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {codigo}
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-md"
                      style={{ color: color, background: `${color}15`, border: `1px solid ${color}25` }}
                    >
                      {curso.categoria}
                    </span>
                  </div>
                  <h3
                    className="text-white font-extrabold text-base mb-2 leading-tight"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {curso.nombre}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4 flex-1">{curso.descripcion}</p>
                  <div className="flex items-center justify-between border-t border-white/[0.08] pt-3 mt-auto">
                    <span className="text-white/45 text-xs">
                      {curso.horas}h · {curso.sesiones.length} sesiones
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: color }}
                    >
                      {curso.precio}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ¿POR QUÉ UN CURSO MDT? ── */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl border border-[#FBBC0C]/20 p-8 md:p-12"
            style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(10,22,40,0.9) 100%)", backdropFilter: "blur(16px)" }}
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">¿Por qué un curso MDT?</span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Validez nacional + empleabilidad real
              </h2>
              <p className="text-white/55 max-w-2xl mx-auto leading-relaxed">
                El certificado MDT es uno de los documentos más valorados por empleadores ecuatorianos.
                Acredita formación verificable y suma puntos en concursos públicos, ascensos y procesos de selección.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  title: "Validez nacional",
                  desc: "Reconocido por entidades del sector público y privado en todo el Ecuador. Acreditación verificable ante el MDT.",
                  color: "#FBBC0C",
                },
                {
                  title: "Suma en concursos",
                  desc: "Los certificados MDT puntúan en concursos de méritos del sector público, ascensos y procesos de contratación.",
                  color: "#73B8E7",
                },
                {
                  title: "Demanda laboral 2026",
                  desc: "Ecuador necesita 12.000+ profesionales con habilidades de IA. Los cursos MDT te posicionan en ese mercado.",
                  color: "#F0846D",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border p-5"
                  style={{ borderColor: `${item.color}25`, background: `${item.color}06` }}
                >
                  <p className="font-bold text-white text-base mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {item.title}
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <a
                href="#inscripcion"
                className="inline-flex items-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-all"
              >
                Inscribirme en un curso MDT
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRECIOS + INSCRIPCION ── */}
      <section id="inscripcion" className="py-20 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Inscríbete en tu curso MDT
          </h2>
          <p className="text-white/45 mb-10">Sin letras pequeñas. Sin costos ocultos. Certificado al completar.</p>

          <div
            className="rounded-2xl border border-[#FBBC0C]/25 p-8 mb-8"
            style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}
          >
            <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Pago único — Acceso 6 meses</span>
            </div>

            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span
                className="text-[#FBBC0C] text-5xl font-extrabold"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                $99
              </span>
              <span className="text-white/50 text-lg">/ curso</span>
            </div>
            <p className="text-white/40 text-sm mb-8">Precio inicial · cursos avanzados pueden variar — consulta por WhatsApp</p>

            <ul className="space-y-3 text-left mb-6">
              {[
                "Certificado oficial Ministerio del Trabajo (MDT)",
                "Acceso completo por 6 meses al curso",
                "AI Lab: ChatGPT + Claude + Gemini incluidos",
                "Soporte por WhatsApp con instructor real",
                "Plataforma propia ITSEIA (no depende de terceros)",
                "Quiz, ejercicios prácticos y proyecto final",
                "Validez nacional para concursos y ascensos",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/65 text-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 mt-0.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/30 text-xs mb-2">Inscripciones abiertas todo el año</p>
          </div>

          <InscripcionForm producto="cursos-mdt" />
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

      {/* ── FOOTER CTA ── */}
      <section className="py-20 px-5 bg-[#1F2F58]/15 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Tu certificado MDT te espera.
            <br />
            <span className="text-[#FBBC0C]">Empieza hoy desde $99.</span>
          </h2>
          <p className="text-white/45 mb-8">
            15 cursos certificados · 100% online · Acceso por 6 meses · Soporte real
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#inscripcion"
              className="bg-[#FBBC0C] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
            >
              Inscribirme ahora
            </a>
            <a
              href="/login?from=cursos-mdt"
              className="border border-white/15 text-white/80 px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/[0.05] transition-all"
            >
              Ya soy estudiante — Acceder
            </a>
            <a
              href="https://wa.me/593997489821?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20cursos%20MDT%20de%20ITSEIA"
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
