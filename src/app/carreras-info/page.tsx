"use client";

import { useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";

// ─────────────────────────────────────────────
// /carreras-info — Sales landing for degree programs
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
        <p className="text-white/55 text-sm">Te contactamos en menos de 24 horas. Puedes enviarnos tu comprobante de pago por WhatsApp.</p>
        <a href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20en%20las%20carreras%20ITSEIA" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#25D366] text-sm font-semibold hover:underline">Enviar comprobante por WhatsApp →</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#FBBC0C]/25 p-8" style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}>
      <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
        <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Inscripcion directa — Precio Pionero 2026</span>
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
            <a href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20en%20las%20carreras%20ITSEIA" target="_blank" rel="noopener noreferrer" className="text-[#25D366] text-sm font-bold hover:underline">+593 95 989 2034</a>
          </div>
        </div>
      </div>
    </form>
  );
}

const CAREERS = [
  {
    abbr: "IA",
    color: "#FBBC0C",
    borderColor: "rgba(251,188,12,0.25)",
    glowColor: "rgba(251,188,12,0.06)",
    name: "Inteligencia Artificial",
    desc: "Aprende a diseñar y desplegar sistemas inteligentes: machine learning, deep learning, visión por computadora y modelos de lenguaje en proyectos reales.",
    topics: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "MLOps", "Redes Neuronales"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2a10 10 0 1 0 10 10"/>
        <path d="M12 6v6l4 2"/>
        <circle cx="19" cy="5" r="3" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    abbr: "CD",
    color: "#73B8E7",
    borderColor: "rgba(115,184,231,0.25)",
    glowColor: "rgba(115,184,231,0.06)",
    name: "Ciencia de Datos",
    desc: "Convierte datos en decisiones estratégicas: Python, estadística avanzada, análisis predictivo y visualización para empresas de cualquier sector.",
    topics: ["Python", "Estadística Avanzada", "Pandas", "Visualización", "Modelos Predictivos", "A/B Testing"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M7 16l4-4 4 4"/>
        <path d="M15 8l-4 4"/>
      </svg>
    ),
  },
  {
    abbr: "BD",
    color: "#F0846D",
    borderColor: "rgba(240,132,109,0.25)",
    glowColor: "rgba(240,132,109,0.06)",
    name: "Big Data e Inteligencia de Negocio",
    desc: "Maneja datos a gran escala: SQL, procesamiento distribuido, dashboards empresariales y toma de decisiones basada en datos para organizaciones.",
    topics: ["SQL Avanzado", "Apache Spark", "Power BI", "Data Warehouse", "ETL", "Cloud Data"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
  },
];

const PIPELINE = [
  {
    name: "H3L",
    url: "h3l.ai",
    tagline: "Auditoría operativa IA",
    desc: "Implementaciones en 7 países. Egresados ITSEIA tienen acceso directo al pipeline de contratación.",
    color: "#FBBC0C",
    stat: "7 países",
  },
  {
    name: "ImagemIA",
    url: "imagemia.com",
    tagline: "IA en imagenología médica",
    desc: "Empresa de tecnología médica con IA predictiva. Busca constantemente talento en ciencia de datos y ML.",
    color: "#73B8E7",
    stat: "Salud + IA",
  },
  {
    name: "Strata",
    url: "strata.h3l.ai",
    tagline: "Cerebro digital empresarial",
    desc: "9,000+ documentos, 19 países. Plataforma de IA empresarial que contrata a los mejores egresados.",
    color: "#F0846D",
    stat: "19 países",
  },
];

const FAQS = [
  {
    q: "¿Necesito conocimientos previos de programación?",
    a: "No. Las carreras empiezan desde cero con fundamentos de programación en Python. Lo importante es tener disposición para aprender y compromiso con las horas de estudio.",
  },
  {
    q: "¿El título es reconocido oficialmente en Ecuador?",
    a: "Sí. ITSEIA es un Instituto Superior Tecnológico registrado ante el legalmente reconocido. El título de Tecnólogo es reconocido en Ecuador y habilita para estudios de tercer nivel.",
  },
  {
    q: "¿Puedo estudiar si vivo fuera de Quito?",
    a: "Sí. La modalidad 100% online tiene el mismo currículo, los mismos docentes y acceso completo al AI Lab. Clases grabadas disponibles 24/7 para cualquier zona horaria.",
  },
];

export default function CarrerasInfoPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] font-sans overflow-x-hidden">

      {/* WhatsApp float */}
      <a
        href="https://wa.me/593959892034?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20carreras%20de%20ITSEIA"
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
        {/* Login access */}
        <div className="text-center py-3 bg-white/[0.03] border-b border-white/[0.06]">
          <span className="text-white/50 text-sm">¿Ya tienes cuenta? </span>
          <a href="/login" className="text-[#FBBC0C] text-sm font-semibold hover:underline">Iniciar sesión →</a>
        </div>


      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 px-5 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#FBBC0C]/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#73B8E7]/[0.05] blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] animate-pulse" />
            <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">Matrículas abiertas — Ingreso 2026</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            3 carreras de{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FBBC0C 0%, #F0846D 60%, #73B8E7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Inteligencia Artificial
            </span>
            <br className="hidden md:block" />
            {" "}con título legalmente reconocido
          </h1>

          <p className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Presencial en Quito o 100% online desde cualquier lugar.
            <br />
            <span className="text-[#73B8E7]">AI Lab incluido · Certificaciones cloud · Pipeline de empleo real.</span>
          </p>

          {/* Price block */}
          <div className="inline-flex items-center gap-4 bg-[#1F2F58]/40 border border-[#FBBC0C]/25 rounded-2xl px-6 py-4 mb-8">
            <div className="text-center">
              <span className="text-white/40 text-xs line-through block">$300/mes</span>
              <span
                className="text-[#FBBC0C] text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >$220</span>
              <span className="text-white/50 text-xs">/mes</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-left">
              <p className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Precio Pionero</p>
              <p className="text-white/50 text-xs">Inscripción $180 · Cupos limitados</p>
              <p className="text-white/50 text-xs">5 semestres · 2.5 años</p>
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
              href="https://meet.google.com/fzx-fqns-ayc"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/15 text-white/80 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-white/[0.05] transition-all"
            >
              Sesion informativa gratuita — Sab 11AM
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="border-y border-white/[0.06] bg-[#1F2F58]/20">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "3", label: "Carreras tecnologicas" },
              { value: "5", label: "Semestres de formacion" },
              { value: "85%", label: "Empleabilidad" },
              { value: "3", label: "Herramientas IA incluidas" },
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

      {/* ── 3 CAREER CARDS ── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Elige tu carrera
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">
              Las tres carreras comparten el mismo AI Lab y las mismas certificaciones cloud.
              Elige tu especialidad y construye tu futuro.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CAREERS.map((c) => (
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
                      href="https://itseia.ai/mallas/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#73B8E7] hover:text-[#FBBC0C] transition-colors"
                    >
                      Ver malla completa →
                    </a>
                    <a
                      href="#inscripcion"
                      className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                      style={{ color: c.color }}
                    >
                      Inscribirme →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODALIDADES ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Presencial + 100% Online
            </h2>
            <p className="text-white/45 max-w-lg mx-auto">
              Mismo curriculo, mismos docentes, mismo AI Lab. Elige la modalidad que se adapta a tu vida.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Presencial */}
            <div
              className="rounded-2xl border border-[#FBBC0C]/20 p-7"
              style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.06) 0%, rgba(31,47,88,0.25) 100%)", backdropFilter: "blur(12px)" }}
            >
              <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/15 border border-[#FBBC0C]/25 rounded-full px-3 py-1.5 mb-5">
                <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wider">Presencial — Quito</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Horario vespertino 17:30 – 21:30",
                  "Laboratorios fisicos de IA",
                  "Networking con empresas del ecosistema",
                  "Sesiones informativas sabatinas 11AM",
                  "Titulo IST reconocido legalmente reconocido",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/65 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Online */}
            <div
              className="rounded-2xl border border-[#73B8E7]/20 p-7"
              style={{ background: "linear-gradient(145deg, rgba(115,184,231,0.06) 0%, rgba(31,47,88,0.25) 100%)", backdropFilter: "blur(12px)" }}
            >
              <div className="inline-flex items-center gap-2 bg-[#73B8E7]/15 border border-[#73B8E7]/25 rounded-full px-3 py-1.5 mb-5">
                <span className="text-[#73B8E7] text-xs font-bold uppercase tracking-wider">Online — Desde cualquier lugar</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Acceso desde cualquier pais",
                  "Clases grabadas disponibles 24/7",
                  "Tutor IA personalizado incluido",
                  "Python interactivo en el navegador",
                  "Mismo titulo y certificaciones",
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
              <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">Incluido en tu matricula</span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              AI Lab — ChatGPT, Claude y Gemini incluidos
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto mb-8 leading-relaxed">
              No existe otro programa en Ecuador donde practiques con los tres modelos de IA mas poderosos del mundo,
              todos pagados por ITSEIA. Tu solo estudias y aplicas.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { name: "ChatGPT Plus", provider: "OpenAI", color: "#10B981" },
                { name: "Claude Pro", provider: "Anthropic", color: "#D97757" },
                { name: "Gemini Advanced", provider: "Google", color: "#4285F4" },
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
              href="#inscripcion"
              className="inline-flex items-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-all"
            >
              Inscribirme para acceder al AI Lab
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── PIPELINE EMPLEO ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Pipeline de empleo real
            </h2>
            <p className="text-white/45 max-w-lg mx-auto">
              Los mejores egresados de ITSEIA tienen acceso directo a las empresas del ecosistema.
              No buscas trabajo: el trabajo te encuentra.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {PIPELINE.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl border p-6"
                style={{
                  borderColor: `${c.color}25`,
                  background: `linear-gradient(145deg, ${c.color}08 0%, rgba(31,47,88,0.25) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 text-xs font-bold uppercase tracking-wider"
                  style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}25` }}
                >
                  {c.name}
                </div>
                <p className="text-white/80 font-semibold text-sm mb-2">{c.tagline}</p>
                <p className="text-white/45 text-sm leading-relaxed mb-4">{c.desc}</p>
                <span
                  className="text-xs font-bold"
                  style={{ color: c.color }}
                >
                  {c.stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS + INSCRIPCION ── */}
      <section id="inscripcion" className="py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Inversion transparente
          </h2>
          <p className="text-white/45 mb-10">Sin letras pequeñas. Sin costos ocultos.</p>

          <div
            className="rounded-2xl border border-[#FBBC0C]/25 p-8 mb-8"
            style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}
          >
            <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Precio Pionero 2026</span>
            </div>

            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-white/35 text-xl line-through">$300</span>
              <span
                className="text-[#FBBC0C] text-5xl font-extrabold"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >$220</span>
              <span className="text-white/50 text-lg">/mes</span>
            </div>
            <p className="text-white/40 text-sm mb-8">+ Inscripcion $180 (unica vez)</p>

            <ul className="space-y-3 text-left mb-6">
              {[
                "3 carreras a elegir (IA, Ciencia de Datos, Big Data)",
                "5 semestres — 2.5 años de formacion",
                "Horario vespertino 17:30-21:30 o 100% online",
                "AI Lab: ChatGPT + Claude + Gemini incluidos",
                "Certificaciones cloud incluidas (AWS, Azure, GCP)",
                "Pipeline de empleo en H3L, ImagemIA y Strata",
                "Titulo IST reconocido por legalmente reconocido",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/65 text-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 mt-0.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/30 text-xs mb-2">Cupos limitados para el periodo 2026-1</p>
          </div>

          <InscripcionForm producto="carreras" />
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
            El futuro no se espera.
            <br />
            <span className="text-[#FBBC0C]">Se construye.</span>
          </h2>
          <p className="text-white/45 mb-8">
            Inscripciones abiertas. Sesion informativa gratuita cada sabado a las 11AM.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#inscripcion"
              className="bg-[#FBBC0C] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
            >
              Inscribirme ahora
            </a>
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20carreras%20de%20ITSEIA"
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
