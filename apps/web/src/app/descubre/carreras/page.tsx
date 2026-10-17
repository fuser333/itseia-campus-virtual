"use client";

import BackButton from "@/components/descubre/BackButton";

// ─── Constantes ───────────────────────────────────────────────────────────────

const WA_LINK = "https://wa.me/593990709009?text=Hola%2C%20me%20interesa%20inscribirme%20en%20una%20Carrera%20de%20IA%20en%20ITSEIA.%20%C2%BFPodr%C3%ADan%20darme%20m%C3%A1s%20informaci%C3%B3n%3F";

const WA_INFO = "https://wa.me/593990709009?text=Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20las%20Carreras%20de%20IA%20de%20ITSEIA";

const CAREERS = [
  {
    abbr: "IA",
    color: "#FBBC0C",
    borderColor: "rgba(251,188,12,0.25)",
    glowColor: "rgba(251,188,12,0.06)",
    name: "Inteligencia Artificial",
    desc: "Diseña y despliega sistemas inteligentes: machine learning, deep learning, visión por computadora y LLMs en proyectos reales.",
    topics: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "MLOps", "LLMs"],
  },
  {
    abbr: "CD",
    color: "#73B8E7",
    borderColor: "rgba(115,184,231,0.25)",
    glowColor: "rgba(115,184,231,0.06)",
    name: "Ciencia de Datos",
    desc: "Convierte datos en decisiones estratégicas con Python, estadística avanzada, análisis predictivo y visualización.",
    topics: ["Python", "Estadística", "Pandas", "Visualización", "Modelos Predictivos", "A/B Testing"],
  },
  {
    abbr: "BD",
    color: "#F0846D",
    borderColor: "rgba(240,132,109,0.25)",
    glowColor: "rgba(240,132,109,0.06)",
    name: "Big Data e Inteligencia de Negocio",
    desc: "Maneja datos a gran escala con SQL, procesamiento distribuido, dashboards y toma de decisiones basada en datos.",
    topics: ["SQL Avanzado", "Apache Spark", "Power BI", "Data Warehouse", "ETL", "Cloud Data"],
  },
];

const BENEFICIOS = [
  "Título de Tecnólogo legalmente reconocido (3 años)",
  "Horario vespertino 17:30–21:30 o 100% online",
  "AI Lab: ChatGPT + Claude + Gemini incluidos y pagados",
  "Certificaciones cloud: AWS, Azure y Google",
  "Pipeline de empleo en H3L, ImagemIA y Strata",
  "Tutorías personalizadas con docentes especializados",
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DescubreCarrerasPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white overflow-x-hidden">

      {/* Gradientes de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#FBBC0C]/[0.03] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#73B8E7]/[0.04] blur-3xl" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#0D1B30]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <BackButton />
          <img src="/logo_itseia.svg" alt="ITSEIA" className="h-7 w-auto" />
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FBBC0C] text-[#0A1628] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#E5AB00] transition-colors"
          >
            Inscribirme
          </a>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-5 py-12">

        {/* ── Badge ── */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] animate-pulse" />
            <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">Matrículas abiertas — Inicio junio 2026</span>
          </span>
        </div>

        {/* ── Título ── */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Carreras de{" "}
            <span style={{
              background: "linear-gradient(135deg, #FBBC0C 0%, #F0846D 60%, #73B8E7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Inteligencia Artificial
            </span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            3 años de formación con título legalmente reconocido, certificaciones AWS + Google incluidas
            y acceso directo al pipeline de empleo en empresas de IA reales.
          </p>
        </div>

        {/* ── Layout 2 columnas: info + video ── */}
        <div className="grid lg:grid-cols-2 gap-10 mb-14 items-start">

          {/* Columna izquierda — descripción y beneficios */}
          <div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 mb-6">
              <p className="text-white/70 leading-relaxed text-base mb-6">
                La primera carrera técnica de Inteligencia Artificial del Ecuador.
                Formación práctica, vespertina o 100% online, con herramientas
                reales como Claude, GPT y Gemini desde el primer día.
              </p>
              <div className="grid gap-3">
                {BENEFICIOS.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-white/80 text-sm">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FBBC0C"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 shrink-0 mt-0.5"
                    >
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing card */}
            <div
              className="rounded-2xl border border-[#FBBC0C]/30 p-7"
              style={{
                background:
                  "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(31,47,88,0.25) 100%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {/* Online */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-[#73B8E7]/10 border border-[#73B8E7]/20 rounded-full px-3 py-1 mb-2">
                    <span className="text-[#73B8E7] text-xs font-bold uppercase tracking-wider">NEXUS Online</span>
                  </div>
                  <div className="text-white/35 text-xs line-through mb-0.5">Antes $300/mes</div>
                  <div className="text-[#73B8E7] text-4xl font-extrabold" style={{ fontFamily: "var(--font-space-grotesk)" }}>$99</div>
                  <div className="text-white/50 text-xs">/mes · 3 años</div>
                  <div className="text-white/35 text-xs mt-1">+ Inscripción $49</div>
                </div>
                {/* Presencial */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-3 py-1 mb-2">
                    <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wider">TITAN Quito</span>
                  </div>
                  <div className="text-white/35 text-xs line-through mb-0.5">Antes $300/mes</div>
                  <div className="text-[#FBBC0C] text-4xl font-extrabold" style={{ fontFamily: "var(--font-space-grotesk)" }}>$149</div>
                  <div className="text-white/50 text-xs">/mes · 3 años</div>
                  <div className="text-white/35 text-xs mt-1">+ Inscripción $99</div>
                </div>
              </div>
              <p className="text-center text-white/35 text-xs mb-5">Beca Corporativa H3L · 30 cupos · Inicio junio 2026</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-lg shadow-[#FBBC0C]/25"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  Inscribirme ahora
                </a>
                <a
                  href={WA_INFO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/80 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/[0.05] transition-all"
                >
                  Más información
                </a>
              </div>
            </div>
          </div>

          {/* Columna derecha — video */}
          <div className="flex flex-col gap-6">
            <div
              className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                src="https://www.youtube.com/embed/Rlc81jPt5sE?autoplay=0&rel=0&modestbranding=1"
                title="Carreras de IA — ITSEIA"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Stats rápidos */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "3",      label: "carreras a elegir" },
                { value: "85–92%", label: "empleabilidad" },
                { value: "6",      label: "semestres" },
                { value: "$99",    label: "desde /mes online" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center"
                >
                  <div
                    className="text-2xl font-extrabold mb-1"
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
                  <div className="text-white/45 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3 Carreras ── */}
        <section className="mb-14">
          <h2
            className="text-2xl font-extrabold text-white mb-6 text-center"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Elige tu especialidad
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {CAREERS.map((c) => (
              <div
                key={c.abbr}
                className="rounded-2xl border p-6"
                style={{
                  borderColor: c.borderColor,
                  background: `linear-gradient(145deg, ${c.glowColor} 0%, rgba(31,47,88,0.25) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4 font-extrabold text-[#0A1628] text-base"
                  style={{ background: c.color, fontFamily: "var(--font-space-grotesk)" }}
                >
                  {c.abbr}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">{c.name}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-4">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.topics.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}20` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="text-center">
          <div className="rounded-2xl border border-[#FBBC0C]/25 p-10" style={{ background: "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(10,22,40,0.9) 100%)", backdropFilter: "blur(16px)" }}>
            <h2
              className="text-3xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              Habla directamente con nuestro equipo. Te respondemos en menos de 2 horas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Hablar con Héctor ahora
              </a>
              <a
                href={WA_INFO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/80 px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/[0.05] transition-all"
              >
                Quiero más información
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
