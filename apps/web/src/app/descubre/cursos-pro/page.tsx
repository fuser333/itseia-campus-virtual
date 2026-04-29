"use client";

import BackButton from "@/components/descubre/BackButton";

// ─── Constantes ───────────────────────────────────────────────────────────────

const WA_LINK = "https://wa.me/593990709009?text=Hola%2C%20me%20interesan%20los%20Cursos%20Profesionales%20de%20ITSEIA.%20%C2%BFPodr%C3%ADan%20darme%20m%C3%A1s%20informaci%C3%B3n%3F";

const PROFESIONES = [
  { nombre: "Médicos y profesionales de salud", color: "#F0846D" },
  { nombre: "Abogados y área legal",            color: "#FBBC0C" },
  { nombre: "Contadores y financieros",         color: "#73B8E7" },
  { nombre: "Ingenieros y técnicos",            color: "#F0846D" },
  { nombre: "Docentes y educadores",            color: "#FBBC0C" },
  { nombre: "Marketing y ventas",               color: "#73B8E7" },
  { nombre: "Administradores y gerentes",       color: "#F0846D" },
  { nombre: "Emprendedores",                    color: "#FBBC0C" },
];

const PLANES = [
  { nombre: "Express",    precio: "$99",  horas: "8 horas",  desc: "Introducción práctica a IA en tu profesión" },
  { nombre: "Estándar",   precio: "$197", horas: "20 horas", desc: "Curso completo con proyecto personalizado" },
  { nombre: "Intensivo",  precio: "$297", horas: "40 horas", desc: "Programa avanzado con asesoría de Héctor" },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DescubreCursosProPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white overflow-x-hidden">

      {/* Gradientes de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-[#F0846D]/[0.04] blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FBBC0C]/[0.03] blur-3xl" />
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
          <span className="inline-flex items-center gap-2 bg-[#F0846D]/10 border border-[#F0846D]/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0846D] animate-pulse" />
            <span className="text-[#F0846D] text-xs font-semibold tracking-wide uppercase">IA personalizada a tu profesión · Desde $99</span>
          </span>
        </div>

        {/* ── Título ── */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Cursos Profesionales —{" "}
            <span style={{
              background: "linear-gradient(135deg, #F0846D 0%, #FBBC0C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              IA a la medida de tu carrera
            </span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            No importa tu profesión: médico, abogado, contador, ingeniero o emprendedor.
            Aprende a usar la IA específicamente para lo que ya haces, en semanas, no años.
          </p>
        </div>

        {/* ── Video principal ── */}
        <div className="mb-14">
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/wc7PvS558RM?autoplay=0&rel=0&modestbranding=1"
              title="Cursos Profesionales — ITSEIA"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            { value: "100%", label: "Personalizado a tu perfil" },
            { value: "$99",  label: "Desde — sin mensualidades" },
            { value: "8–40h", label: "Duración flexible" },
            { value: "1:1",  label: "Asesoría con Héctor" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 text-center">
              <div
                className="text-3xl font-extrabold mb-1"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  background: "linear-gradient(135deg, #F0846D, #FBBC0C)",
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

        {/* ── Para quién es ── */}
        <section className="mb-14">
          <h2
            className="text-2xl font-extrabold text-white mb-6 text-center"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            ¿Para quién es este curso?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PROFESIONES.map((p) => (
              <div
                key={p.nombre}
                className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-center hover:bg-white/[0.06] transition-colors"
              >
                <div
                  className="inline-block w-2 h-2 rounded-full mb-2"
                  style={{ background: p.color }}
                />
                <p className="text-white/75 text-xs leading-snug">{p.nombre}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Metodología ── */}
        <section className="mb-14">
          <div className="rounded-2xl border border-[#F0846D]/20 p-8" style={{ background: "linear-gradient(145deg, rgba(240,132,109,0.06) 0%, rgba(31,47,88,0.25) 100%)", backdropFilter: "blur(12px)" }}>
            <h2
              className="text-2xl font-extrabold text-white mb-6 text-center"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Cómo funciona
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { paso: "01", título: "Diagnóstico gratuito", desc: "Héctor evalúa tu perfil profesional y define qué herramientas de IA te dan el mayor impacto." },
                { paso: "02", título: "Curso a la medida",    desc: "Contenido diseñado para tu profesión específica. Nada genérico: casos reales de tu industria." },
                { paso: "03", título: "Práctica con proyectos", desc: "Aplicas directamente en tu trabajo real desde la primera sesión. No teoría — acción." },
                { paso: "04", título: "Asesoría 1:1",         desc: "Sesiones con Héctor para resolver dudas específicas y escalar tu uso de la IA." },
              ].map((item) => (
                <div key={item.paso} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-extrabold text-[#0A1628] text-sm"
                    style={{ background: "#F0846D", fontFamily: "var(--font-space-grotesk)" }}
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

        {/* ── Planes ── */}
        <section className="mb-14">
          <h2
            className="text-2xl font-extrabold text-white mb-6 text-center"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Planes disponibles
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PLANES.map((p) => (
              <div
                key={p.nombre}
                className="rounded-2xl border border-[#F0846D]/25 p-7 text-center"
                style={{ background: "linear-gradient(145deg, rgba(240,132,109,0.07) 0%, rgba(31,47,88,0.25) 100%)", backdropFilter: "blur(12px)" }}
              >
                <div className="inline-flex items-center gap-2 bg-[#F0846D]/10 border border-[#F0846D]/20 rounded-full px-3 py-1.5 mb-4">
                  <span className="text-[#F0846D] text-xs font-bold uppercase tracking-wider">{p.nombre}</span>
                </div>
                <div className="text-4xl font-extrabold text-white mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{p.precio}</div>
                <div className="text-white/40 text-xs mb-2">{p.horas}</div>
                <div className="text-white/55 text-sm mb-5">{p.desc}</div>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full py-2.5 rounded-lg bg-[#F0846D] text-[#0A1628] font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Empezar ahora
                </a>
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
              La IA no reemplaza tu profesión.
              <br />
              <span className="text-[#F0846D]">Te hace imparable en ella.</span>
            </h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              Agenda tu diagnóstico gratuito. Héctor te dice exactamente qué herramientas de IA debes dominar.
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
                href={WA_LINK}
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
