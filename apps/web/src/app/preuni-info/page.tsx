import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";

// ─────────────────────────────────────────────
// /preuni-info — Sales landing for Preuniversitario IA
// ─────────────────────────────────────────────

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
          <div className="inline-flex items-center gap-4 bg-[#1F2F58]/40 border border-[#73B8E7]/25 rounded-2xl px-6 py-4 mb-8">
            <div className="text-center">
              <span
                className="text-[#73B8E7] text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >$180</span>
              <p className="text-white/40 text-xs">precio total</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-left">
              <p className="text-[#73B8E7] text-xs font-bold uppercase tracking-wide">Todo incluido</p>
              <p className="text-white/50 text-xs">AI Lab + Materiales + Certificado</p>
              <p className="text-white/50 text-xs">20 dias de formacion intensiva</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login?redirect=preuni"
              className="bg-[#73B8E7] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#5AA8D8] transition-all hover:scale-[1.02] shadow-xl shadow-[#73B8E7]/25"
            >
              Iniciar sesion — Preuniversitario
            </Link>
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20en%20el%20Preuniversitario%20de%20ITSEIA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#25D366]/30 text-[#25D366]/80 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-[#25D366]/[0.08] transition-all"
            >
              Inscribirme por WhatsApp
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
              { value: "$180", label: "Todo incluido" },
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

      {/* ── FOOTER CTA ── */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Tu primer paso en IA
            <br />
            <span className="text-[#73B8E7]">empieza hoy.</span>
          </h2>
          <p className="text-white/45 mb-8">Solo $180. Todo incluido. Sin requisitos previos.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login?redirect=preuni"
              className="bg-[#73B8E7] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#5AA8D8] transition-all hover:scale-[1.02] shadow-xl shadow-[#73B8E7]/25"
            >
              Iniciar sesion — Preuniversitario
            </Link>
            <a
              href="https://meet.google.com/fzx-fqns-ayc"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/15 text-white/80 px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/[0.05] transition-all"
            >
              Sesion informativa — Sab 11AM
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
