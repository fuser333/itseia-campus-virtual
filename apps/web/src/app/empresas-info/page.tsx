"use client";

import { useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";

// ─────────────────────────────────────────────
// /empresas-info — Sales landing for B2B corporate training
// ─────────────────────────────────────────────

// EmailJS config
const EMAILJS_SERVICE = "service_yqv4dts";
const EMAILJS_TEMPLATE = "template_mallas";
const EMAILJS_KEY = "A7cQPi8jRCDyLrHQr";

function ContactoB2BForm({ producto }: { producto: string }) {
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
            mensaje: `Nueva solicitud B2B desde tecnologico.itseia.ai — Producto: ${producto}`,
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
        <p className="text-white/55 text-sm">Te enviamos una propuesta en menos de 24 horas. Tambien puedes escribirnos por WhatsApp.</p>
        <a href="https://wa.me/593959892034?text=Hola%2C%20quiero%20una%20propuesta%20corporativa%20de%20ITSEIA" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#25D366] text-sm font-semibold hover:underline">Escribir por WhatsApp →</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#FBBC0C]/25 p-8" style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}>
      <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-6">
        <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Solicitar propuesta corporativa</span>
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
        <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-1.5">Email empresarial</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@empresa.com"
          required
          className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FBBC0C]/50 transition-colors"
        />
      </div>
      <input type="hidden" value={producto} />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-[#FBBC0C] text-[#0A1628] py-3.5 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-[#FBBC0C]/20 mb-4"
      >
        {status === "sending" ? "Enviando..." : "Solicitar propuesta en 24h"}
      </button>

      {status === "error" && <p className="text-red-400 text-xs text-center mb-3">Error al enviar. Escribe por WhatsApp directamente.</p>}

      <div className="flex items-center justify-center gap-4 pt-2">
        <a href="https://wa.me/593959892034?text=Hola%2C%20quiero%20una%20propuesta%20corporativa%20de%20ITSEIA" target="_blank" rel="noopener noreferrer" className="text-[#25D366] text-sm font-semibold hover:underline">WhatsApp: +593 95 989 2034</a>
        <span className="text-white/20">|</span>
        <a href="mailto:administracion@itseia.ai?subject=Propuesta%20Corporativa%20ITSEIA" className="text-[#73B8E7] text-sm hover:underline">administracion@itseia.ai</a>
      </div>
    </form>
  );
}

const COMPANIES = [
  {
    name: "H3L",
    url: "h3l.ai",
    tagline: "Auditoria operativa con IA",
    color: "#FBBC0C",
    borderColor: "rgba(251,188,12,0.25)",
    glowColor: "rgba(251,188,12,0.06)",
    desc: "Identifica $150K–$800K de capacidad atrapada en tu operacion. Implementaciones en 7 paises. Los egresados ITSEIA tienen acceso directo al pipeline de proyectos H3L.",
    stats: [
      { value: "7", label: "paises" },
      { value: "$800K", label: "capacidad max." },
      { value: "90 dias", label: "plazo tipico" },
    ],
  },
  {
    name: "ImagemIA",
    url: "imagemia.com",
    tagline: "IA predictiva en imagenologia medica",
    color: "#73B8E7",
    borderColor: "rgba(115,184,231,0.25)",
    glowColor: "rgba(115,184,231,0.06)",
    desc: "Reduce inasistencias en diagnosticos hasta un 30% con prediccion inteligente. Apoya al radiologo con analisis automatizado de imagenes medicas. Compatible con DICOM.",
    stats: [
      { value: "30%", label: "menos inasistencias" },
      { value: "24/7", label: "disponible" },
      { value: "DICOM", label: "compatible" },
    ],
  },
  {
    name: "Strata",
    url: "strata.h3l.ai",
    tagline: "Tu cerebro digital profesional",
    color: "#F0846D",
    borderColor: "rgba(240,132,109,0.25)",
    glowColor: "rgba(240,132,109,0.06)",
    desc: "9,000+ documentos, 19 paises, disponible desde $19.99/mes. Centraliza el conocimiento de tu empresa y consultalo con IA en segundos.",
    stats: [
      { value: "9K+", label: "documentos" },
      { value: "19", label: "paises" },
      { value: "$19.99", label: "desde/mes" },
    ],
  },
];

const PLANS_B2B = [
  {
    name: "Equipo Pequeño",
    range: "5 – 10 personas",
    discount: "10% descuento",
    color: "#FBBC0C",
    features: [
      "Acceso individual a la plataforma ITSEIA",
      "Dashboard corporativo de progreso",
      "Certificados del equipo",
      "Soporte por email dedicado",
      "Reporte mensual de avance",
    ],
  },
  {
    name: "Equipo Mediano",
    range: "11 – 25 personas",
    discount: "20% descuento",
    color: "#73B8E7",
    isPopular: true,
    features: [
      "Todo lo de Equipo Pequeño",
      "Ruta de aprendizaje por cargo/funcion",
      "Sesiones de mentoría grupal",
      "Integracion con HR/LMS corporativo",
      "Acceso al AI Lab para todo el equipo",
      "Convenios de practicas preprofesionales",
    ],
  },
  {
    name: "Corporativo",
    range: "25+ personas",
    discount: "Precio a medida",
    color: "#F0846D",
    features: [
      "Todo lo de Equipo Mediano",
      "Contenido personalizado por empresa",
      "Instructor dedicado a tu empresa",
      "Integración H3L, ImagemIA o Strata",
      "ROI y metricas de impacto",
      "SLA de soporte prioritario",
    ],
  },
];

const FAQS = [
  {
    q: "¿Cuanto cuesta capacitar a mi equipo?",
    a: "Los planes corporativos empiezan desde $2,000 para equipos de 5-10 personas. El precio final depende del numero de personas, la profundidad del programa y si incluye mentoria dedicada. Solicita una propuesta personalizada por WhatsApp.",
  },
  {
    q: "¿Los egresados de ITSEIA tienen pipeline de empleo en las empresas del ecosistema?",
    a: "Si. Los mejores alumnos de cada cohorte reciben referidos directos a H3L, ImagemIA y Strata. El ecosistema de empresas fue diseñado desde el inicio para absorber talento ITSEIA.",
  },
  {
    q: "¿Como funciona el dashboard corporativo?",
    a: "El representante de la empresa accede a un panel donde ve el progreso individual y grupal del equipo: modulos completados, tiempo en plataforma, notas de quizzes y certificados obtenidos.",
  },
];

export default function EmpresasInfoPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] font-sans overflow-x-hidden">

      {/* WhatsApp float */}
      <a
        href="https://wa.me/593959892034?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20capacitacion%20corporativa%20en%20ITSEIA"
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
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#FBBC0C]/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#F0846D]/[0.04] blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#F0846D]/10 border border-[#F0846D]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0846D] animate-pulse" />
            <span className="text-[#F0846D] text-xs font-semibold tracking-wide uppercase">Programas corporativos — Desde $2,000</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Capacita tu equipo en IA
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #FBBC0C 0%, #F0846D 60%, #73B8E7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Programas corporativos
            </span>
            <br className="hidden md:block" />
            {" "}desde $2,000
          </h1>

          <p className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            El mismo ecosistema de empresas que opera en 19 paises te capacita a ti y a tu equipo.
            <br />
            <span className="text-[#FBBC0C]">Dashboard corporativo · ROI medible · Certificados incluidos.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#inscripcion"
              className="bg-[#FBBC0C] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
            >
              Solicitar propuesta corporativa
            </a>
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20quiero%20solicitar%20una%20propuesta%20corporativa%20de%20ITSEIA"
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
              { value: "3", label: "Empresas del ecosistema" },
              { value: "19", label: "Paises de presencia" },
              { value: "85%", label: "Empleabilidad egresados" },
              { value: "$2K", label: "Desde por equipo" },
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

      {/* ── ECOSYSTEM ── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              El ecosistema ITSEIA
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">
              No es solo una escuela. Es un ecosistema de empresas reales que opera en IA a nivel global.
              Los egresados ITSEIA tienen pipeline directo a estas organizaciones.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {COMPANIES.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl border p-7 overflow-hidden relative"
                style={{
                  borderColor: c.borderColor,
                  background: `linear-gradient(145deg, ${c.glowColor} 0%, rgba(31,47,88,0.3) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
                  style={{ background: c.glowColor }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-extrabold text-[#0A1628]"
                      style={{ background: c.color, fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {c.name}
                    </div>
                    <a
                      href={`https://${c.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/35 text-xs hover:text-white/60 transition-colors"
                    >
                      {c.url}
                    </a>
                  </div>

                  <p className="text-white/70 font-semibold text-sm mb-3">{c.tagline}</p>
                  <p className="text-white/45 text-sm leading-relaxed mb-6">{c.desc}</p>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {c.stats.map((s) => (
                      <div key={s.label} className="text-center">
                        <p
                          className="font-extrabold text-lg"
                          style={{ fontFamily: "var(--font-space-grotesk)", color: c.color }}
                        >
                          {s.value}
                        </p>
                        <p className="text-white/35 text-xs">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <a
                    href={`https://${c.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                    style={{ color: c.color }}
                  >
                    Visitar sitio →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORPORATE PLANS ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Planes corporativos
            </h2>
            <p className="text-white/45 max-w-lg mx-auto">
              Descuentos por volumen y dashboards de progreso para tu equipo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS_B2B.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-7 ${plan.isPopular ? "ring-2 ring-[#73B8E7]/50" : ""}`}
                style={{
                  borderColor: `${plan.color}25`,
                  background: `linear-gradient(145deg, ${plan.color}08 0%, rgba(31,47,88,0.3) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                {plan.isPopular && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#0A1628]"
                    style={{ background: plan.color }}
                  >
                    Mas elegido
                  </div>
                )}

                <div
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: plan.color }}
                >
                  {plan.name}
                </div>
                <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {plan.range}
                </p>
                <p
                  className="text-sm font-semibold mb-6 inline-block px-3 py-1 rounded-full"
                  style={{ color: plan.color, background: `${plan.color}15`, border: `1px solid ${plan.color}25` }}
                >
                  {plan.discount}
                </p>

                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-white/65 text-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 mt-0.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#inscripcion"
                  className="block w-full py-3 rounded-xl font-bold text-sm text-center transition-all hover:scale-[1.02]"
                  style={{
                    background: plan.isPopular ? plan.color : `${plan.color}20`,
                    color: plan.isPopular ? "#0A1628" : plan.color,
                    border: plan.isPopular ? "none" : `1px solid ${plan.color}30`,
                  }}
                >
                  Solicitar propuesta
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORPORATE DASHBOARD ── */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl border border-[#73B8E7]/20 p-8 md:p-12"
            style={{
              background: "linear-gradient(145deg, rgba(115,184,231,0.06) 0%, rgba(10,22,40,0.9) 100%)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#73B8E7]/10 border border-[#73B8E7]/20 rounded-full px-4 py-1.5 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#73B8E7]" />
                  <span className="text-[#73B8E7] text-xs font-semibold tracking-wide uppercase">Dashboard Corporativo</span>
                </div>
                <h2
                  className="text-2xl md:text-3xl font-extrabold text-white mb-4"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Visibilidad total del progreso de tu equipo
                </h2>
                <p className="text-white/55 leading-relaxed mb-6">
                  Un solo panel para ver como avanza cada persona en tu equipo: modulos completados,
                  tiempo de estudio, certificados obtenidos y ROI del programa.
                </p>
                <a
                  href="#inscripcion"
                  className="inline-flex items-center gap-2 bg-[#73B8E7] text-[#0A1628] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#5AA8D8] transition-all"
                >
                  Solicitar propuesta corporativa
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              <div className="space-y-3">
                {[
                  "Progreso individual por persona",
                  "Ranking interno del equipo",
                  "Certificados obtenidos automaticamente",
                  "Tiempo invertido en plataforma",
                  "Alertas de rezago para RRHH",
                  "Exporta reportes en PDF",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#73B8E7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
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

      {/* ── FAQ ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
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

      {/* ── FOOTER CTA + PROPUESTA ── */}
      <section id="inscripcion" className="py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Tu equipo con IA
            <br />
            <span className="text-[#FBBC0C]">es tu ventaja competitiva.</span>
          </h2>
          <p className="text-white/45 mb-8">
            Solicita una propuesta en menos de 24 horas.
          </p>
          <ContactoB2BForm producto="empresa-corporativo" />
        </div>
      </section>
    </div>
  );
}
