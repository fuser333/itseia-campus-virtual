import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";

// ─────────────────────────────────────────────
// /cursos-pro-info — Sales landing for Cursos Profesionales
// ─────────────────────────────────────────────

const PROFESSIONS = [
  {
    name: "Contadores",
    color: "#FBBC0C",
    roi: "Recuperas la inversion en < 15 dias",
    benefit: "Automatiza balances y reportes. Lo que toma 3 horas ahora toma 20 minutos.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    name: "Abogados",
    color: "#73B8E7",
    roi: "Recuperas la inversion en < 10 dias",
    benefit: "Redacta contratos, analiza jurisprudencia y resume expedientes con IA.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    name: "Medicos",
    color: "#F0846D",
    roi: "Recuperas la inversion en < 7 dias",
    benefit: "Mejora diagnosticos, resume historiales clinicos y apoya decisiones medicas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    name: "Gerentes",
    color: "#FBBC0C",
    roi: "Recuperas la inversion en < 20 dias",
    benefit: "Toma decisiones con datos reales. Reportes, proyecciones y dashboards automatizados.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    name: "Arquitectos",
    color: "#73B8E7",
    roi: "Recuperas la inversion en < 30 dias",
    benefit: "Genera planos, visualizaciones 3D y documentacion de proyectos con IA generativa.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
    ),
  },
];

const PLANS = [
  {
    name: "Express",
    price: "$99",
    duration: "4 semanas",
    color: "#FBBC0C",
    borderColor: "rgba(251,188,12,0.25)",
    features: [
      "9 preguntas para personalizar tu curso",
      "Modulos T-01 a T-04 (fundamentos)",
      "Demos interactivos con IA",
      "Certificado ITSEIA al completar",
      "Soporte por email",
    ],
    cta: "Empezar con Express",
    isPopular: false,
  },
  {
    name: "Estandar",
    price: "$197",
    duration: "6 semanas",
    color: "#73B8E7",
    borderColor: "rgba(115,184,231,0.35)",
    features: [
      "Todo lo de Express",
      "Modulos T-01 a F-03 (aplicacion avanzada)",
      "AI Lab incluido por 6 semanas",
      "Proyecto practico en tu profesion",
      "Soporte por WhatsApp",
      "Acceso a grabaciones 90 dias",
    ],
    cta: "Empezar con Estandar",
    isPopular: true,
  },
  {
    name: "Completo",
    price: "$297",
    duration: "8 semanas",
    color: "#F0846D",
    borderColor: "rgba(240,132,109,0.25)",
    features: [
      "Todo lo de Estandar",
      "Modulos completos T-01 a F-05",
      "Mentoria 1:1 con especialista IA",
      "Portafolio de proyectos",
      "Acceso de por vida",
      "Referido al equipo de empleo ITSEIA",
    ],
    cta: "Empezar con Completo",
    isPopular: false,
  },
];

const FAQS = [
  {
    q: "¿Como se personaliza el curso para mi profesion?",
    a: "Antes de iniciar respondes 9 preguntas sobre tu profesion, nivel actual y objetivos. Con esas respuestas el sistema asigna los modulos mas relevantes para ti. Un contador no recibe lo mismo que un medico.",
  },
  {
    q: "¿Necesito conocimientos tecnicos previos?",
    a: "No. Los cursos empiezan desde fundamentos de IA aplicados a tu profesion. Si ya tienes experiencia con tecnologia avanzas mas rapido, pero no es un requisito.",
  },
  {
    q: "¿Que pasa si no termino el curso en el tiempo establecido?",
    a: "Puedes avanzar a tu ritmo. Los tiempos indicados son referencias para alumnos que dedican 1-2 horas diarias. Con el plan Completo tienes acceso de por vida al material.",
  },
];

export default function CursosProInfoPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] font-sans overflow-x-hidden">

      {/* WhatsApp float */}
      <a
        href="https://wa.me/593959892034?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20cursos%20profesionales%20de%20ITSEIA"
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
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#F0846D]/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FBBC0C]/[0.04] blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#F0846D]/10 border border-[#F0846D]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0846D] animate-pulse" />
            <span className="text-[#F0846D] text-xs font-semibold tracking-wide uppercase">Cursos 100% personalizados por profesion</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            IA para tu profesion
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #F0846D 0%, #FBBC0C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Cursos desde $99
            </span>
            <br className="hidden md:block" />
            {" "}que transforman tu trabajo
          </h1>

          <p className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Un contador no aprende lo mismo que un medico. Tu curso es 100% personalizado.
            <br />
            <span className="text-[#FBBC0C]">Recupera la inversion en menos de 30 dias.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://itseia.ai/cursos/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F0846D] text-white px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#E07060] transition-all hover:scale-[1.02] shadow-xl shadow-[#F0846D]/25"
            >
              Descubre tu curso ideal
            </a>
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20cursos%20profesionales"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#25D366]/30 text-[#25D366]/80 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-[#25D366]/[0.08] transition-all"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── 5 PROFESSIONS ── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Diseñado para tu profesion
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">
              5 profesiones, 5 rutas de aprendizaje completamente distintas.
              Porque la IA se aplica diferente en cada campo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROFESSIONS.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border p-6 hover:scale-[1.01] transition-transform duration-200"
                style={{
                  borderColor: `${p.color}22`,
                  background: `linear-gradient(145deg, ${p.color}08 0%, rgba(31,47,88,0.25) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${p.color}20`, color: p.color }}
                >
                  {p.icon}
                </div>
                <h3
                  className="text-white font-extrabold text-lg mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {p.name}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">{p.benefit}</p>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-md"
                  style={{ color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}20` }}
                >
                  {p.roi}
                </span>
              </div>
            ))}

            {/* Quiz CTA card */}
            <div
              className="rounded-2xl border border-[#FBBC0C]/25 p-6 flex flex-col items-center justify-center text-center bg-[#FBBC0C]/05"
              style={{ backdropFilter: "blur(12px)" }}
            >
              <div className="text-4xl mb-3">?</div>
              <h3
                className="text-white font-extrabold text-lg mb-2"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                ¿Tu profesion no esta aqui?
              </h3>
              <p className="text-white/45 text-sm mb-4">
                El quiz de 9 preguntas personaliza tu ruta sin importar tu campo.
              </p>
              <a
                href="https://itseia.ai/cursos/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FBBC0C] text-[#0A1628] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-all"
              >
                Tomar el quiz gratis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl font-extrabold text-white mb-3"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Como funciona en 3 pasos
          </h2>
          <p className="text-white/45 mb-12 max-w-lg mx-auto">
            Desde que llegas hasta que terminas con un certificado en mano.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                color: "#FBBC0C",
                title: "Respondes 9 preguntas",
                desc: "Te preguntamos tu profesion, nivel actual y objetivos. 2 minutos, sin correo requerido hasta el final.",
              },
              {
                step: "02",
                color: "#73B8E7",
                title: "Recibe tu curso personalizado",
                desc: "El sistema crea una ruta de aprendizaje con los modulos exactos que necesitas. Nada mas, nada menos.",
              },
              {
                step: "03",
                color: "#F0846D",
                title: "Practica y certifica",
                desc: "Completa los modulos con demos interactivos y recibes tu Certificado ITSEIA para mostrar en tu CV.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border p-7 text-center"
                style={{
                  borderColor: `${s.color}20`,
                  background: `linear-gradient(145deg, ${s.color}06 0%, rgba(31,47,88,0.2) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="text-4xl font-extrabold mb-4"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: s.color,
                    opacity: 0.4,
                  }}
                >
                  {s.step}
                </div>
                <h3
                  className="text-white font-bold mb-3"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {s.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Elige tu nivel
            </h2>
            <p className="text-white/45 max-w-lg mx-auto">
              Todos los planes incluyen contenido personalizado para tu profesion y certificado ITSEIA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-7 ${plan.isPopular ? "ring-2" : ""}`}
                style={{
                  borderColor: plan.borderColor,
                  background: `linear-gradient(145deg, ${plan.color}08 0%, rgba(31,47,88,0.3) 100%)`,
                  backdropFilter: "blur(12px)",
                  ...(plan.isPopular ? { ringColor: plan.color } : {}),
                }}
              >
                {plan.isPopular && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#0A1628]"
                    style={{ background: plan.color }}
                  >
                    Mas popular
                  </div>
                )}

                <div
                  className="text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ color: plan.color }}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="text-4xl font-extrabold text-white"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {plan.price}
                  </span>
                </div>
                <p className="text-white/35 text-xs mb-6">{plan.duration} de formacion</p>

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
                  href="https://itseia.ai/cursos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl font-bold text-sm text-center transition-all hover:scale-[1.02]"
                  style={{
                    background: plan.isPopular ? plan.color : `${plan.color}20`,
                    color: plan.isPopular ? "#0A1628" : plan.color,
                    border: plan.isPopular ? "none" : `1px solid ${plan.color}30`,
                  }}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
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
            9 preguntas.
            <br />
            <span className="text-[#F0846D]">Tu curso personalizado.</span>
          </h2>
          <p className="text-white/45 mb-8">Gratis hasta que eliges tu plan.</p>
          <a
            href="https://itseia.ai/cursos/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#F0846D] text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-[#E07060] transition-all hover:scale-[1.02] shadow-xl shadow-[#F0846D]/25"
          >
            Descubre tu curso ideal
          </a>
        </div>
      </section>
    </div>
  );
}
