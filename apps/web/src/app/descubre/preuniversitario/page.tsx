"use client";

import BackButton from "@/components/descubre/BackButton";

// ─── Constantes ───────────────────────────────────────────────────────────────

const WA_INSCRIPCION =
  "https://wa.me/593990709009?text=Hola%2C%20quiero%20info%20del%20Preuniversitario%20IGNITE%20de%20ITSEIA%20por%20%2499";

const WA_INFO =
  "https://wa.me/593990709009?text=Quiero%20m%C3%A1s%20info%20del%20Preuniversitario%20IGNITE";

// Video viral del canal ITSEIA — 180,570 views (top #1 del canal).
// "Programé una app con IA en 30 segundos — Claude Code + Codex + Cursor + Antigravity"
const YOUTUBE_ID = "dTFIUA_pfys";

const BENEFICIOS = [
  "20 días intensivos · 100% online a tu ritmo",
  "Sin saber programar · Empieza desde cero",
  "ChatGPT, Claude y Gemini incluidos en tu AI Lab",
  "Aprende Python con IA como copiloto desde el día 1",
  "Test vocacional para descubrir tu carrera ideal",
  "Certificado IGNITE descargable al graduarte",
];

const RUTA_20_DIAS = [
  { rango: "Día 1-4",   nombre: "Descubre la IA",         color: "#FBBC0C" },
  { rango: "Día 5-8",   nombre: "Herramientas IA",        color: "#73B8E7" },
  { rango: "Día 9-12",  nombre: "Tu Carrera Ideal",       color: "#F0846D" },
  { rango: "Día 13-16", nombre: "Proyecto Práctico",      color: "#FBBC0C" },
  { rango: "Día 17-20", nombre: "Evaluación Final",       color: "#73B8E7" },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DescubrePreuniversitarioPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white overflow-x-hidden">

      {/* Gradientes de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#FBBC0C]/[0.04] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#73B8E7]/[0.04] blur-3xl" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#0D1B30]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <BackButton />
          <img src="/logo_itseia.svg" alt="ITSEIA" className="h-7 w-auto" />
          <a
            href={WA_INSCRIPCION}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FBBC0C] text-[#0A1628] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#E5AB00] transition-colors"
          >
            Reclamar beca
          </a>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-5 py-12">

        {/* ── Badge ── */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] animate-pulse" />
            <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">
              Cupos limitados · Junio 2026
            </span>
          </span>
        </div>

        {/* ── Título ── */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Preuniversitario{" "}
            <span style={{
              background: "linear-gradient(135deg, #FBBC0C 0%, #F0846D 60%, #73B8E7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              IGNITE
            </span>
            {" "}— Tu primer paso al mundo de la IA
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            20 días intensivos online por $99 total. Aprende Python, ChatGPT y los
            fundamentos de IA antes de matricularte en una carrera completa.
          </p>
        </div>

        {/* ── Layout 2 columnas: info + video ── */}
        <div className="grid lg:grid-cols-2 gap-10 mb-14 items-start">

          {/* Columna izquierda — descripción y beneficios */}
          <div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 mb-6">
              <p className="text-white/70 leading-relaxed text-base mb-6">
                IGNITE es el trampolín perfecto antes de la carrera. En 20 días
                aprendes a usar las herramientas de IA más demandadas, descubres
                qué carrera te calza y te llevas un proyecto real listo para mostrar.
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
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing card */}
            <div
              className="rounded-2xl border border-[#FBBC0C]/30 p-7 text-center"
              style={{
                background:
                  "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(31,47,88,0.25) 100%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-3 py-1.5 mb-4">
                <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wider">
                  Beca H3L · pago único
                </span>
              </div>
              <div className="text-white/35 text-sm line-through mb-1">Antes $480</div>
              <div
                className="text-[#FBBC0C] text-6xl font-extrabold leading-none mb-1"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                $99
              </div>
              <div className="text-white/55 text-sm mb-5">
                Pago único · 20 días intensivos · 100% online
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={WA_INSCRIPCION}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-lg shadow-[#FBBC0C]/25"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  Reclamar mi beca
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
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=0&rel=0&modestbranding=1`}
                title="Programé una app con IA en 30 segundos — ITSEIA"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Stats rápidos */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "20",  label: "días intensivos" },
                { value: "$99", label: "pago único · todo incluido" },
                { value: "100%",label: "online a tu ritmo" },
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
                  <div className="text-white/45 text-xs leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tu ruta de 20 días ── */}
        <section className="mb-14">
          <h2
            className="text-2xl font-extrabold text-white mb-6 text-center"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Tu ruta de 20 días
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {RUTA_20_DIAS.map((bloque) => (
              <div
                key={bloque.rango}
                className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-center hover:bg-white/[0.06] transition-colors"
              >
                <div
                  className="inline-block w-2 h-2 rounded-full mb-2"
                  style={{ background: bloque.color }}
                />
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: bloque.color }}
                >
                  {bloque.rango}
                </p>
                <p className="text-white/75 text-sm leading-snug">{bloque.nombre}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="text-center">
          <div
            className="rounded-2xl border border-[#FBBC0C]/25 p-10"
            style={{
              background:
                "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(10,22,40,0.9) 100%)",
              backdropFilter: "blur(16px)",
            }}
          >
            <h2
              className="text-3xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              No esperes a la universidad para empezar.
              <br />
              <span className="text-[#FBBC0C]">Empieza HOY con $99.</span>
            </h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              En 20 días sabrás exactamente qué carrera de IA es para ti — y ya
              tendrás un proyecto real listo para mostrar.
            </p>
            <a
              href={WA_INSCRIPCION}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Reclamar mi beca por WhatsApp
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
