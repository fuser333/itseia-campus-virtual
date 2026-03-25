"use client";

import { useState } from "react";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";

// ─────────────────────────────────────────────
// /docentes-info — Sales landing for teacher portal
// ─────────────────────────────────────────────

// EmailJS config
const EMAILJS_SERVICE = "service_yqv4dts";
const EMAILJS_TEMPLATE = "template_mallas";
const EMAILJS_KEY = "A7cQPi8jRCDyLrHQr";

function PostulacionForm({ producto }: { producto: string }) {
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
            mensaje: `Nueva postulacion docente desde tecnologico.itseia.ai — Producto: ${producto}`,
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
        <p className="text-white font-bold mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Postulacion recibida</p>
        <p className="text-white/55 text-sm">El equipo academico se pondra en contacto contigo en menos de 48 horas.</p>
        <a href="https://wa.me/593959892034?text=Hola%2C%20me%20postule%20como%20docente%20en%20ITSEIA" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#25D366] text-sm font-semibold hover:underline">Escribir por WhatsApp →</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#73B8E7]/25 p-8" style={{ background: "linear-gradient(145deg, rgba(115,184,231,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}>
      <div className="inline-flex items-center gap-2 bg-[#73B8E7]/10 border border-[#73B8E7]/20 rounded-full px-4 py-1.5 mb-6">
        <span className="text-[#73B8E7] text-xs font-bold uppercase tracking-wide">Postulacion docente ITSEIA</span>
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
        className="w-full bg-[#73B8E7] text-[#0A1628] py-3.5 rounded-xl font-bold text-sm hover:bg-[#5AA8D8] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-[#73B8E7]/20 mb-3"
      >
        {status === "sending" ? "Enviando..." : "Enviar postulacion"}
      </button>
      <p className="text-white/30 text-xs text-center">O envia tu CV directamente a <a href="mailto:administracion@itseia.ai?subject=DOCENTE" className="text-[#73B8E7] hover:underline">administracion@itseia.ai</a> con asunto DOCENTE</p>

      {status === "error" && <p className="text-red-400 text-xs text-center mt-3">Error al enviar. Escribe por email directamente.</p>}
    </form>
  );
}

const TOOLS = [
  {
    color: "#FBBC0C",
    borderColor: "rgba(251,188,12,0.2)",
    title: "Editor de contenido",
    desc: "Crea y edita sesiones directamente en la plataforma. Sube videos, documentos, presentaciones y ejerce control total sobre tu materia.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  {
    color: "#73B8E7",
    borderColor: "rgba(115,184,231,0.2)",
    title: "Quiz Builder con anti-fraude IA",
    desc: "Diseña examenes con preguntas de opcion multiple, abiertas y de codigo. La IA detecta copia y generacion automatica de respuestas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    color: "#F0846D",
    borderColor: "rgba(240,132,109,0.2)",
    title: "Seguimiento de progreso en tiempo real",
    desc: "Dashboard con el avance de cada alumno: sesiones completadas, tiempo en plataforma, notas y participacion en foros.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    color: "#FBBC0C",
    borderColor: "rgba(251,188,12,0.2)",
    title: "Registro de asistencia automatico",
    desc: "El sistema registra la asistencia a clases en vivo automaticamente. Genera reportes de asistencia con un clic.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    color: "#73B8E7",
    borderColor: "rgba(115,184,231,0.2)",
    title: "Videoconferencia integrada",
    desc: "Clases en vivo con Daily.co integrado en la plataforma. Grabacion automatica disponible para alumnos que no pudieron asistir.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2"/>
      </svg>
    ),
  },
  {
    color: "#F0846D",
    borderColor: "rgba(240,132,109,0.2)",
    title: "Anuncios y comunicacion directa",
    desc: "Envia anuncios a todos tus alumnos o grupos especificos. Notificaciones por plataforma y email automaticamente.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: "¿Que es la capacitacion de 120 horas del CES?",
    a: "El Consejo de Educacion Superior (CES) exige que todos los docentes de institutos superiores completen una capacitacion de 120 horas en docencia virtual. ITSEIA te incluye este programa sin costo adicional como parte de tu vinculacion como docente.",
  },
  {
    q: "¿Necesito instalar algun software para usar el portal docente?",
    a: "No. Todo funciona desde el navegador. El editor de contenido, el Quiz Builder, el dashboard de alumnos y la videoconferencia estan integrados en la plataforma web sin instalaciones.",
  },
  {
    q: "¿Como me uno al equipo docente de ITSEIA?",
    a: "El proceso de vinculacion es directo: envias tu CV a administracion@itseia.ai con el asunto DOCENTE, pasas por una entrevista con el director academico y te asignan las materias segun tu especialidad.",
  },
];

export default function DocentesInfoPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] font-sans overflow-x-hidden">

      {/* WhatsApp float */}
      <a
        href="https://wa.me/593959892034?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20Portal%20Docente%20de%20ITSEIA"
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
            <span className="text-[#73B8E7] text-xs font-semibold tracking-wide uppercase">Portal exclusivo para docentes ITSEIA</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Portal Docente ITSEIA
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #73B8E7 0%, #FBBC0C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Herramientas para ensenar IA
            </span>
            <br className="hidden md:block" />
            {" "}de clase mundial
          </h1>

          <p className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Todo lo que necesitas para ensenar, evaluar y hacer seguimiento.
            <br />
            <span className="text-[#FBBC0C]">Capacitacion CES 120h incluida sin costo adicional.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#postulacion"
              className="bg-[#73B8E7] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#5AA8D8] transition-all hover:scale-[1.02] shadow-xl shadow-[#73B8E7]/25"
            >
              Postularme como docente
            </a>
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20quiero%20postularme%20como%20docente%20en%20ITSEIA"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/15 text-white/80 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-white/[0.05] transition-all"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="border-y border-white/[0.06] bg-[#1F2F58]/20">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "120h", label: "Capacitacion CES incluida" },
              { value: "7", label: "Herramientas integradas" },
              { value: "0", label: "Instalaciones requeridas" },
              { value: "Real-time", label: "Seguimiento de alumnos" },
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

      {/* ── CES HIGHLIGHT ── */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl border border-[#FBBC0C]/25 p-8 md:p-12"
            style={{
              background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(10,22,40,0.9) 100%)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C]" />
                  <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">CES — Obligatorio para docentes IST</span>
                </div>
                <h2
                  className="text-2xl md:text-3xl font-extrabold text-white mb-4"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Capacitacion 120h en Docencia Virtual
                </h2>
                <p className="text-white/55 leading-relaxed mb-6">
                  El Consejo de Educacion Superior exige esta capacitacion a todo docente de instituto superior.
                  ITSEIA te la provee completa, en plataforma, a tu ritmo y sin costo adicional.
                </p>
                <a
                  href="#postulacion"
                  className="inline-flex items-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-all"
                >
                  Postularme para acceder a CES
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              <div className="space-y-3">
                {[
                  "Fundamentos de educacion virtual",
                  "Diseno instruccional para plataformas LMS",
                  "Evaluacion en entornos online",
                  "Gestion de aula virtual",
                  "Herramientas digitales para docencia",
                  "Certificacion CES emitida al completar",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span className="text-white/65 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS GRID ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Herramientas incluidas
            </h2>
            <p className="text-white/45 max-w-lg mx-auto">
              Todo integrado en una sola plataforma. Sin apps externas, sin configuraciones complicadas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {TOOLS.map((tool) => (
              <div
                key={tool.title}
                className="rounded-2xl border p-6"
                style={{
                  borderColor: tool.borderColor,
                  background: `linear-gradient(145deg, ${tool.color}06 0%, rgba(31,47,88,0.2) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${tool.color}20`, color: tool.color }}
                >
                  {tool.icon}
                </div>
                <h3
                  className="text-white font-bold mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {tool.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{tool.desc}</p>
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

      {/* ── FOOTER CTA + POSTULACION ── */}
      <section id="postulacion" className="py-20 px-5 bg-[#1F2F58]/15 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Ensena IA con las mejores
            <br />
            <span className="text-[#73B8E7]">herramientas del mundo.</span>
          </h2>
          <p className="text-white/45 mb-8">
            Vinculacion abierta. Completa el formulario y te contactamos en 48 horas.
          </p>
          <PostulacionForm producto="docente" />
        </div>
      </section>
    </div>
  );
}
