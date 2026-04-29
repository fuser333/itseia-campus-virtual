"use client";

import BackButton from "@/components/descubre/BackButton";

// ─── Constantes ───────────────────────────────────────────────────────────────

const WA_COTIZAR =
  "https://wa.me/593990709009?text=Hola%2C%20quiero%20cotizar%20una%20capacitaci%C3%B3n%20B2B%20de%20IA%20para%20mi%20empresa";

const WA_INFO =
  "https://wa.me/593990709009?text=Quiero%20info%20de%20programas%20B2B%20de%20ITSEIA";

// TODO: Reemplazar con video propio de B2B cuando esté disponible.
// Actualmente usa video Bootcamp como placeholder.
// El CEO va a generar el video con Gemini Veo y subir a YouTube.
const YOUTUBE_ID = "QVoO3cY_BPQ"; // PLACEHOLDER

const BENEFICIOS = [
  "Programa diseñado a la medida de tu empresa",
  "Casos reales de tu industria (banca, salud, retail, manufactura, gobierno)",
  "De 5 hasta 200+ personas capacitadas",
  "Certificación MDT para todo el equipo",
  "Sesiones online + live + portafolio",
  "ROI medible en 60 días",
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DescubreB2BPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white overflow-x-hidden">

      {/* Gradientes de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[#FBBC0C]/[0.03] blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#73B8E7]/[0.04] blur-3xl" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#0D1B30]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <BackButton />
          <img src="/logo_itseia.svg" alt="ITSEIA" className="h-7 w-auto" />
          <a
            href={WA_COTIZAR}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FBBC0C] text-[#0A1628] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#E5AB00] transition-colors"
          >
            Cotizar ahora
          </a>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-5 py-12">

        {/* ── Badge ── */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] animate-pulse" />
            <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">
              DESCUBRE
            </span>
          </span>
        </div>

        {/* ── Título ── */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Capacitación B2B{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #FBBC0C 0%, #F0846D 60%, #73B8E7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              · Tu equipo dominando IA
            </span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            Programas a medida para empresas que NO pueden quedarse atrás
          </p>
        </div>

        {/* ── Layout 2 columnas: info + video ── */}
        <div className="grid lg:grid-cols-2 gap-10 mb-14 items-start">

          {/* Columna izquierda — descripción y beneficios */}
          <div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 mb-6">
              <p className="text-white/70 leading-relaxed text-base mb-6">
                Diseñamos un programa de capacitación en IA específico para tu
                industria. Para 5 a 200+ personas. Casos reales de tu sector.
                Certificación MDT al graduar al equipo.
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
                  Cotización personalizada
                </span>
              </div>
              <div
                className="text-white/70 text-xl font-semibold mb-1"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Desde $3,000 por contrato
              </div>
              <div className="text-white/45 text-sm mb-5">
                Próximas cohortes mensuales · Grupos de 5 a 200+ personas
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={WA_COTIZAR}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-lg shadow-[#FBBC0C]/25"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  Cotizar para mi empresa
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
              {/* TODO: Reemplazar con video propio de B2B cuando esté disponible.
                  Actualmente usa video Bootcamp (QVoO3cY_BPQ) como placeholder.
                  El CEO va a generar el video con Gemini Veo y subir a YouTube. */}
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=0&rel=0&modestbranding=1`}
                title="Capacitación B2B en IA — ITSEIA"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Stats rápidos */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "200+", label: "personas por contrato" },
                { value: "60d",  label: "ROI medible" },
                { value: "MDT",  label: "certificación oficial" },
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

        {/* ── Sectores ── */}
        <section className="mb-14">
          <h2
            className="text-2xl font-extrabold text-white mb-6 text-center"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Sectores donde ya trabajamos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { nombre: "Banca y finanzas",   color: "#FBBC0C" },
              { nombre: "Salud e imágenes médicas", color: "#73B8E7" },
              { nombre: "Retail y logística", color: "#F0846D" },
              { nombre: "Manufactura",        color: "#FBBC0C" },
              { nombre: "Gobierno y público", color: "#73B8E7" },
              { nombre: "Educación",          color: "#F0846D" },
            ].map((s) => (
              <div
                key={s.nombre}
                className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-center hover:bg-white/[0.06] transition-colors"
              >
                <div
                  className="inline-block w-2 h-2 rounded-full mb-2"
                  style={{ background: s.color }}
                />
                <p className="text-white/75 text-xs leading-snug">{s.nombre}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cómo funciona ── */}
        <section className="mb-14">
          <div
            className="rounded-2xl border border-[#FBBC0C]/20 p-8"
            style={{
              background:
                "linear-gradient(145deg, rgba(251,188,12,0.06) 0%, rgba(31,47,88,0.25) 100%)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h2
              className="text-2xl font-extrabold text-white mb-6 text-center"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Cómo funciona
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  paso: "01",
                  título: "Diagnóstico gratuito",
                  desc: "Analizamos tu industria, el tamaño de tu equipo y los procesos donde la IA genera mayor impacto.",
                },
                {
                  paso: "02",
                  título: "Programa a la medida",
                  desc: "Diseñamos un currículo con casos reales de tu sector. Nada genérico: cada módulo aplica directamente a tu negocio.",
                },
                {
                  paso: "03",
                  título: "Implementación y seguimiento",
                  desc: "Sesiones online + live + portafolio. Acompañamos al equipo durante todo el proceso de aprendizaje.",
                },
                {
                  paso: "04",
                  título: "Certificación y ROI",
                  desc: "Todo el equipo obtiene su Certificación MDT. Medimos el impacto en productividad a los 60 días.",
                },
              ].map((item) => (
                <div key={item.paso} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-extrabold text-[#0A1628] text-sm"
                    style={{ background: "#FBBC0C", fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {item.paso}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{item.título}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
              Tu equipo no puede quedarse atrás.
              <br />
              <span className="text-[#FBBC0C]">La IA ya está transformando tu industria.</span>
            </h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              Escríbenos ahora y en menos de 24 horas te enviamos una propuesta
              personalizada para tu empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={WA_COTIZAR}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                Cotizar para mi empresa
              </a>
              <a
                href={WA_INFO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/80 px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/[0.05] transition-all"
              >
                Más información
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
