import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";

// ─────────────────────────────────────────────
// Static data — no DB queries on the public landing
// ─────────────────────────────────────────────

const WORLDS = [
  {
    id: "carreras",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    color: "#FBBC0C",
    borderColor: "rgba(251,188,12,0.25)",
    glowColor: "rgba(251,188,12,0.08)",
    badge: "TÍTULO SENESCYT",
    title: "Carreras",
    description: "3 carreras tecnológicas en IA, Ciencia de Datos y Big Data. Título oficial reconocido por SENESCYT.",
    detail: "5 semestres · Vespertino 17:30–21:30 · $220/mes",
    cta: "Ver carreras",
    href: "/carreras-info",
    isExternal: false,
  },
  {
    id: "preuniversitario",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    color: "#73B8E7",
    borderColor: "rgba(115,184,231,0.25)",
    glowColor: "rgba(115,184,231,0.08)",
    badge: "INGRESO 2026",
    title: "Preuniversitario",
    description: "Prepárate para la carrera de IA. Fundamentos de programación, matemáticas y datos. Sin requisitos previos.",
    detail: "Precio especial $399 · Acceso al AI Lab · Online/Presencial",
    cta: "Ver programa",
    href: "/preuni-info",
    isExternal: false,
  },
  {
    id: "cursos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    color: "#F0846D",
    borderColor: "rgba(240,132,109,0.25)",
    glowColor: "rgba(240,132,109,0.08)",
    badge: "DESDE $97",
    title: "Cursos Pro",
    description: "IA aplicada a tu profesión. Contadores, abogados, médicos, gerentes. Recupera la inversión en menos de 30 días.",
    detail: "Express $97 · Estándar $197 · Completo $297",
    cta: "Ver cursos",
    href: "https://itseia.ai/cursos/",
    isExternal: true,
  },
  {
    id: "certificaciones",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    color: "#FBBC0C",
    borderColor: "rgba(251,188,12,0.25)",
    glowColor: "rgba(251,188,12,0.06)",
    badge: "INDUSTRIA GLOBAL",
    title: "Certificaciones",
    description: "AWS, Google Cloud, Azure AI, Claude Code, GitHub Copilot, TensorFlow. Preparación incluida en tu matrícula.",
    detail: "Simulacros · Material oficial · Guía en español",
    cta: "Ver certificaciones",
    href: "/certificaciones-info",
    isExternal: false,
  },
  {
    id: "catalogo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
    color: "#73B8E7",
    borderColor: "rgba(115,184,231,0.25)",
    glowColor: "rgba(115,184,231,0.06)",
    badge: "TODOS LOS PROGRAMAS",
    title: "Catálogo",
    description: "Explora todos los programas: carreras, cursos profesionales, certificaciones, preuniversitario y más.",
    detail: "Carreras · Cursos · Certificaciones · Preuniversitario",
    cta: "Ver catálogo completo",
    href: "/catalogo",
    isExternal: false,
  },
  {
    id: "b2b",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    color: "#F0846D",
    borderColor: "rgba(240,132,109,0.25)",
    glowColor: "rgba(240,132,109,0.06)",
    badge: "CORPORATIVO",
    title: "Empresas",
    description: "Soluciones IA para empresas: H3L, ImagemIA y Strata. Automatización, diagnóstico médico e inteligencia operativa.",
    detail: "H3L · ImagemIA · Strata · 7 países",
    cta: "Ver empresas",
    href: "/empresas-info",
    isExternal: false,
  },
];

const STATS = [
  { value: "254", suffix: "", label: "Sesiones de contenido" },
  { value: "85", suffix: "%", label: "Empleabilidad" },
  { value: "$220", suffix: "/mes", label: "Precio Pionero" },
  { value: "3", suffix: "", label: "IAs incluidas" },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2a10 10 0 1 0 10 10"/>
        <path d="M12 6v6l3 3"/>
        <circle cx="19" cy="5" r="3" fill="currentColor" stroke="none"/>
      </svg>
    ),
    color: "#FBBC0C",
    title: "AI Lab incluido",
    desc: "ChatGPT, Claude y Gemini pagados por ITSEIA. Tu solo estudias.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2"/>
      </svg>
    ),
    color: "#73B8E7",
    title: "Videoconferencia",
    desc: "Clases en vivo con tus profesores. Grabaciones disponibles 24/7.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    color: "#F0846D",
    title: "Biblioteca científica",
    desc: "Acceso a 250M+ papers académicos y recursos técnicos.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    color: "#FBBC0C",
    title: "Certificaciones cloud",
    desc: "AWS, Google Cloud y Azure incluidas en tu programa.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    color: "#73B8E7",
    title: "Python en el navegador",
    desc: "Entorno de código interactivo. Sin instalaciones.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    color: "#F0846D",
    title: "Split-Screen Learning",
    desc: "Teoría a la izquierda, práctica con IA a la derecha.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Antes me tomaba 3 horas analizar balances. Con lo que aprendí en ITSEIA automaticé el proceso con IA y ahora me toma 20 minutos.",
    name: "María Fernanda López",
    role: "Contadora Pública",
    initials: "ML",
    color: "#FBBC0C",
  },
  {
    quote: "El AI Lab es increíble. Practiqué con modelos de IA aplicados a imagenología médica desde la primera semana. No existe otro programa así en Ecuador.",
    name: "Carlos Andrés Reyes",
    role: "Médico Radiólogo",
    initials: "CR",
    color: "#73B8E7",
  },
  {
    quote: "Invertí $197 en el curso estándar y en menos de un mes ya había implementado 3 automatizaciones en mi empresa. El ROI fue inmediato.",
    name: "Andrea Patricia Morales",
    role: "Gerente de Operaciones",
    initials: "AM",
    color: "#F0846D",
  },
];

const CERTIFICATIONS = [
  { name: "AWS Cloud Practitioner", provider: "Amazon", color: "#FF9900", abbr: "AWS" },
  { name: "Azure AI Fundamentals", provider: "Microsoft", color: "#0078D4", abbr: "AZ" },
  { name: "Google Cloud Digital Leader", provider: "Google", color: "#4285F4", abbr: "GCP" },
  { name: "Claude Code", provider: "Anthropic", color: "#D97757", abbr: "CC" },
  { name: "GitHub Copilot", provider: "GitHub", color: "#6E5494", abbr: "GH" },
  { name: "TensorFlow Developer", provider: "Google", color: "#FF6F00", abbr: "TF" },
];

const CAREERS = [
  {
    slug: "inteligencia-artificial",
    name: "Inteligencia Artificial",
    desc: "Aprende a crear sistemas inteligentes: machine learning, deep learning, visión por computadora y modelos de lenguaje aplicados a proyectos reales.",
    color: "#FBBC0C",
    abbr: "IA",
    topics: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "MLOps"],
  },
  {
    slug: "ciencia-de-datos",
    name: "Ciencia de Datos",
    desc: "Convierte datos en decisiones: Python, análisis predictivo, estadística avanzada y visualización para empresas.",
    color: "#73B8E7",
    abbr: "CD",
    topics: ["Python", "Estadística", "Pandas", "Visualización", "Modelos Predictivos"],
  },
  {
    slug: "big-data-inteligencia-negocio",
    name: "Big Data e Inteligencia de Negocio",
    desc: "Maneja datos a gran escala: SQL, procesamiento distribuido, dashboards empresariales y toma de decisiones basada en datos.",
    color: "#F0846D",
    abbr: "BD",
    topics: ["SQL", "Spark", "Power BI", "Data Warehouse", "ETL"],
  },
];

const COMPANIES = [
  {
    id: "h3l",
    name: "H3L",
    url: "h3l.ai",
    color: "#FBBC0C",
    tagline: "Auditoría operativa con IA",
    desc: "Identifica $150K–$800K de capacidad atrapada en tu operación. Implementaciones en 7 países. Transforma cuellos de botella en resultados medibles.",
    stats: [
      { value: "7", label: "países" },
      { value: "$800K", label: "capacidad max." },
      { value: "90d", label: "plazo típico" },
    ],
  },
  {
    id: "imagemia",
    name: "ImagemIA",
    url: "imagemia.com",
    color: "#73B8E7",
    tagline: "IA predictiva en imagenología médica",
    desc: "Reduce inasistencias en diagnósticos hasta un 30% con predicción inteligente. Apoya al radiólogo con análisis automatizado de imágenes médicas.",
    stats: [
      { value: "30%", label: "menos inasistencias" },
      { value: "24/7", label: "disponible" },
      { value: "DICOM", label: "compatible" },
    ],
  },
  {
    id: "strata",
    name: "Strata",
    url: "strata.h3l.ai",
    color: "#F0846D",
    tagline: "Tu cerebro digital profesional",
    desc: "9,000+ documentos, 19 países, disponible desde $19.99/mes. Centraliza el conocimiento de tu empresa y consúltalo con IA en segundos.",
    stats: [
      { value: "9K+", label: "documentos" },
      { value: "19", label: "países" },
      { value: "$19.99", label: "desde /mes" },
    ],
  },
];

// ─────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A1628] font-sans overflow-x-hidden">

      {/* ── FLOATING WHATSAPP BUTTON ──────────── */}
      <a
        href="https://wa.me/593959892034?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20ITSEIA"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE59] text-white px-4 py-3 rounded-full shadow-2xl shadow-[#25D366]/30 transition-all hover:scale-105 hover:shadow-[#25D366]/50"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
        <span className="text-sm font-semibold hidden sm:block">WhatsApp</span>
      </a>

      <PublicHeader />

      {/* ── HERO ───────────────────────────────── */}
      <section id="inicio" className="relative pt-20 pb-16 px-5 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-[#FBBC0C]/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full bg-[#73B8E7]/[0.05] blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] animate-pulse" />
              <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">Matrículas abiertas — Quito, Ecuador</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-6">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight"
              style={{fontFamily:"var(--font-space-grotesk)"}}
            >
              El primer instituto de{" "}
              <span
                className="inline-block"
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
              {" "}en Ecuador
            </h1>
          </div>

          {/* Sub */}
          <p className="text-center text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            Presencial en Quito.{" "}
            <span className="text-[#73B8E7]">100% online desde cualquier lugar.</span>
            <br />
            Título SENESCYT · AI Lab incluido · Certificaciones cloud.
          </p>

          {/* Precio pionero */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 bg-[#1F2F58]/40 border border-[#FBBC0C]/20 rounded-2xl px-5 py-3">
              <div className="text-center">
                <span className="text-white/40 text-xs line-through block">$300/mes</span>
                <span className="text-[#FBBC0C] text-2xl font-extrabold" style={{fontFamily:"var(--font-space-grotesk)"}}>$220</span>
                <span className="text-white/50 text-xs">/mes</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wide">Precio Pionero</p>
                <p className="text-white/50 text-xs">Matrículas limitadas · Cupos disponibles</p>
              </div>
            </div>
          </div>

          {/* Escoge tu camino label */}
          <p className="text-center text-white/35 text-sm mb-8 font-medium tracking-wide uppercase">
            Escoge tu camino
          </p>

          {/* ── 6 WORLD CARDS ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {WORLDS.map((w) => (
              <WorldCard key={w.id} world={w} />
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/register"
              className="bg-[#FBBC0C] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
            >
              Inscribirme ahora
            </Link>
            <a
              href="https://meet.google.com/fzx-fqns-ayc"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/15 text-white/80 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-white/[0.05] hover:border-white/25 transition-all"
            >
              Sesión informativa gratuita — Sáb 11AM
            </a>
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20ITSEIA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[#25D366]/30 text-[#25D366]/80 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-[#25D366]/[0.08] hover:border-[#25D366]/50 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────── */}
      <div className="border-y border-white/[0.06] bg-[#1F2F58]/20">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
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
                  {s.value}{s.suffix}
                </div>
                <div className="text-white/45 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRESENCIAL VS ONLINE ─────────────── */}
      <section className="py-20 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight"
              style={{fontFamily:"var(--font-space-grotesk)"}}
            >
              Dos modalidades,{" "}
              <span className="text-[#FBBC0C]">una misma formación</span>
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">
              Elige cómo quieres aprender. Ambas modalidades tienen el mismo currículo,
              los mismos docentes y acceso completo al AI Lab.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Presencial */}
            <div
              className="relative rounded-2xl border border-[#FBBC0C]/20 p-8 overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(251,188,12,0.06) 0%, rgba(31,47,88,0.25) 100%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#FBBC0C]/[0.04] rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/15 border border-[#FBBC0C]/25 rounded-full px-3 py-1.5 mb-5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wider">Presencial — Quito</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3" style={{fontFamily:"var(--font-space-grotesk)"}}>
                  Campus ITSEIA
                </h3>
                <p className="text-white/55 mb-6 leading-relaxed">
                  Aprende rodeado de compañeros en nuestros laboratorios equipados. Sesiones sabatinas,
                  interacción directa con docentes y networking real con la comunidad IA de Quito.
                </p>
                <ul className="space-y-3 mb-7">
                  {[
                    { icon: "🕔", text: "Horario vespertino: 17:30 – 21:30" },
                    { icon: "📍", text: "Quito, Ecuador — sede central" },
                    { icon: "🧪", text: "Laboratorios físicos de IA" },
                    { icon: "📅", text: "Sesiones informativas sabatinas 11AM" },
                    { icon: "🤝", text: "Networking con empresas del ecosistema" },
                    { icon: "🎓", text: "Título IST reconocido SENESCYT" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-3 text-white/65 text-sm">
                      <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://meet.google.com/fzx-fqns-ayc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-colors"
                >
                  Asistir a la sesión del sábado
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Online */}
            <div
              className="relative rounded-2xl border border-[#73B8E7]/20 p-8 overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(115,184,231,0.06) 0%, rgba(31,47,88,0.25) 100%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#73B8E7]/[0.04] rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-[#73B8E7]/15 border border-[#73B8E7]/25 rounded-full px-3 py-1.5 mb-5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#73B8E7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <span className="text-[#73B8E7] text-xs font-bold uppercase tracking-wider">Online — Desde cualquier lugar</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3" style={{fontFamily:"var(--font-space-grotesk)"}}>
                  Campus Virtual
                </h3>
                <p className="text-white/55 mb-6 leading-relaxed">
                  Accede a todo el contenido desde tu computadora o celular. Clases grabadas disponibles
                  24/7, tutor IA personalizado y la misma calidad académica que en Quito.
                </p>
                <ul className="space-y-3 mb-7">
                  {[
                    { icon: "🌐", text: "Acceso desde cualquier país" },
                    { icon: "⏱️", text: "Clases grabadas disponibles 24/7" },
                    { icon: "🤖", text: "Tutor IA personalizado incluido" },
                    { icon: "💻", text: "Python interactivo en el navegador" },
                    { icon: "📱", text: "Móvil, tablet y computadora" },
                    { icon: "🏆", text: "Mismo título y certificaciones que presencial" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-3 text-white/65 text-sm">
                      <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-[#73B8E7] text-[#0A1628] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#5AA8D8] transition-colors"
                >
                  Inscribirme online
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: CARRERAS ─────────────────── */}
      <section id="carreras" className="py-20 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C]" />
                <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">Título SENESCYT</span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
                style={{fontFamily:"var(--font-space-grotesk)"}}
              >
                3 Carreras en{" "}
                <span className="text-[#FBBC0C]">Inteligencia Artificial</span>
              </h2>
              <p className="text-white/45 mt-3 max-w-lg">
                Formación de nivel superior de 5 semestres (2.5 años) con título IST reconocido por SENESCYT.
                Horario vespertino 17:30–21:30, presencial en Quito.
              </p>
            </div>
            <div className="shrink-0">
              <div
                className="rounded-2xl border border-[#FBBC0C]/20 px-6 py-4 text-center"
                style={{ background: "rgba(251,188,12,0.06)" }}
              >
                <p className="text-white/40 text-xs line-through mb-0.5">$300/mes</p>
                <p className="text-[#FBBC0C] text-3xl font-extrabold" style={{fontFamily:"var(--font-space-grotesk)"}}>$220<span className="text-base font-normal text-white/40">/mes</span></p>
                <p className="text-[#FBBC0C] text-xs font-semibold mt-0.5">Precio Pionero</p>
                <p className="text-white/30 text-[11px] mt-0.5">+ Inscripción $180</p>
              </div>
            </div>
          </div>

          {/* Career cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {CAREERS.map((c) => (
              <div
                key={c.slug}
                className="group rounded-2xl border border-white/[0.08] p-7 hover:border-white/[0.15] transition-all duration-200"
                style={{ background: "rgba(31,47,88,0.25)", backdropFilter: "blur(12px)" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg mb-5"
                  style={{
                    background: `linear-gradient(135deg, ${c.color}25, ${c.color}10)`,
                    color: c.color,
                    border: `1px solid ${c.color}30`,
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {c.abbr}
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3" style={{fontFamily:"var(--font-space-grotesk)"}}>
                  {c.name}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {c.topics.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                      style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}20` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://itseia.ai/mallas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center transition-all border border-white/10 text-white/60 hover:text-white hover:border-white/20"
                  >
                    Ver malla
                  </a>
                  <Link
                    href="/register"
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-center transition-all"
                    style={{ background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}25` }}
                  >
                    Inscribirme
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Carreras comparison table teaser */}
          <div
            className="rounded-2xl border border-white/[0.07] p-6 md:p-8"
            style={{ background: "rgba(10,22,40,0.6)", backdropFilter: "blur(12px)" }}
          >
            <h3 className="text-lg font-bold text-white mb-4" style={{fontFamily:"var(--font-space-grotesk)"}}>
              ITSEIA vs. Universidad tradicional
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    <th className="text-left py-2 pr-4 text-white/40 font-medium text-xs uppercase tracking-wide w-1/3">Aspecto</th>
                    <th className="text-center py-2 px-4 text-[#FBBC0C] font-bold text-xs uppercase tracking-wide">ITSEIA</th>
                    <th className="text-center py-2 pl-4 text-white/40 font-medium text-xs uppercase tracking-wide">Universidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {[
                    ["Duración", "2.5 años", "4–5 años"],
                    ["Precio mensual", "$220 Pionero", "$300–$600+"],
                    ["AI Lab incluido", "Sí (ChatGPT+Claude+Gemini)", "No"],
                    ["Certificaciones cloud", "AWS+Azure+Google incluidas", "No incluidas"],
                    ["Proyectos reales", "Desde semestre 1", "Semestre 5+"],
                    ["Empleabilidad", "85–92%", "Variable"],
                  ].map(([aspect, itseia, uni]) => (
                    <tr key={aspect}>
                      <td className="py-3 pr-4 text-white/50 text-xs">{aspect}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-white/80 text-xs font-medium">{itseia}</span>
                      </td>
                      <td className="py-3 pl-4 text-center text-white/30 text-xs">{uni}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <a
                href="https://itseia.ai/mallas/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
              >
                Ver mallas curriculares
              </a>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold bg-[#FBBC0C] text-[#0A1628] hover:bg-[#E5AB00] transition-all"
              >
                Reservar mi cupo — $220/mes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: PREUNIVERSITARIO ─────────── */}
      <section id="preuniversitario" className="py-20 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#73B8E7]/10 border border-[#73B8E7]/20 rounded-full px-3 py-1 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#73B8E7] animate-pulse" />
                <span className="text-[#73B8E7] text-xs font-semibold tracking-wide uppercase">Ingreso 2026</span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight"
                style={{fontFamily:"var(--font-space-grotesk)"}}
              >
                Preuniversitario{" "}
                <span className="text-[#73B8E7]">ITSEIA</span>
              </h2>
              <p className="text-white/55 mb-6 leading-relaxed">
                ¿Todavía no tienes experiencia en programación o datos? El preuniversitario te prepara con los
                fundamentos exactos que necesitas para empezar la carrera de IA sin dificultades.
                Sin requisitos previos, online o presencial.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Fundamentos de Python y programación",
                  "Matemáticas para IA: álgebra, estadística",
                  "Introducción a Machine Learning",
                  "Primer contacto con el AI Lab",
                  "Sin requisitos previos",
                  "Modalidad online o presencial",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/65 text-sm">
                    <span className="w-4 h-4 rounded-full bg-[#73B8E7]/15 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#73B8E7]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-5 mb-8">
                <div>
                  <p className="text-white/35 text-xs line-through">$480</p>
                  <p className="text-[#73B8E7] text-4xl font-extrabold" style={{fontFamily:"var(--font-space-grotesk)"}}>$399</p>
                  <p className="text-[#73B8E7] text-xs font-semibold">Precio especial Feria</p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-white/45 text-sm">
                  Pago único<br/>
                  <span className="text-white/65 font-semibold">Acceso completo</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="flex-1 text-center bg-[#73B8E7] text-[#0A1628] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#5AA8D8] transition-colors"
                >
                  Inscribirme al Preuniversitario
                </Link>
                <a
                  href="https://wa.me/593959892034?text=Hola%2C%20me%20interesa%20el%20preuniversitario%20ITSEIA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center border border-white/15 text-white/70 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/[0.05] hover:border-white/25 transition-all"
                >
                  Consultar más info
                </a>
              </div>
            </div>

            {/* Visual card */}
            <div
              className="rounded-2xl border border-[#73B8E7]/20 p-7 overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(115,184,231,0.07) 0%, rgba(31,47,88,0.3) 100%)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#73B8E7]/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#73B8E7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Preuniversitario IA</p>
                  <p className="text-white/40 text-xs">ITSEIA 2026</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { module: "Módulo 1", name: "Python desde cero", weeks: "2 semanas", done: true },
                  { module: "Módulo 2", name: "Matemáticas para IA", weeks: "2 semanas", done: true },
                  { module: "Módulo 3", name: "Tu primer modelo ML", weeks: "2 semanas", done: false },
                  { module: "Módulo 4", name: "AI Lab: primeros prompts", weeks: "1 semana", done: false },
                  { module: "Módulo 5", name: "Proyecto final integrador", weeks: "1 semana", done: false },
                ].map((m) => (
                  <div
                    key={m.module}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${m.done ? "bg-[#73B8E7]/10 border border-[#73B8E7]/15" : "bg-white/[0.03] border border-white/[0.06]"}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${m.done ? "bg-[#73B8E7] text-[#0A1628]" : "bg-white/10 text-white/40"}`}
                    >
                      {m.done ? "✓" : m.module.split(" ")[1]}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${m.done ? "text-[#73B8E7]" : "text-white/60"}`}>{m.name}</p>
                      <p className="text-white/25 text-[10px]">{m.weeks}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 rounded-xl bg-[#73B8E7]/10 border border-[#73B8E7]/15">
                <p className="text-[#73B8E7] text-xs font-semibold mb-1">Al completar el preuniversitario</p>
                <p className="text-white/55 text-xs">Recibes un certificado y puedes inscribirte directamente a la carrera de IA con el precio Pionero de $220/mes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ──────────────────────── */}
      <section className="py-20 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight"
              style={{fontFamily:"var(--font-space-grotesk)"}}
            >
              ¿Por que{" "}
              <span className="text-[#FBBC0C]">ITSEIA?</span>
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">
              No somos otro curso online. Somos infraestructura completa para aprender IA.
            </p>
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

      {/* ── SECTION: CERTIFICACIONES ─────────── */}
      <section id="certificaciones" className="py-20 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C]" />
              <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">Industria global</span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight"
              style={{fontFamily:"var(--font-space-grotesk)"}}
            >
              Certificaciones{" "}
              <span className="text-[#FBBC0C]">internacionales incluidas</span>
            </h2>
            <p className="text-white/45 max-w-2xl mx-auto">
              Título SENESCYT + certificaciones AWS, Google y Azure = el perfil más competitivo del mercado.
              Preparación completa incluida en tu matrícula. Sin costo adicional.
            </p>
          </div>

          {/* Certification grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.name}
                className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200 group"
              >
                <div
                  className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-xs"
                  style={{ background: `${cert.color}20`, color: cert.color, border: `1px solid ${cert.color}30`, fontFamily: "var(--font-space-grotesk)" }}
                >
                  {cert.abbr}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm group-hover:text-[#FBBC0C] transition-colors">{cert.name}</p>
                  <p className="text-white/35 text-xs mt-0.5">{cert.provider}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/15 font-medium">Incluida</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/8 font-medium">Simulacros</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Value banner */}
          <div
            className="rounded-2xl border border-[#FBBC0C]/15 p-6 md:p-8 text-center"
            style={{ background: "linear-gradient(135deg, rgba(251,188,12,0.06) 0%, rgba(31,47,88,0.3) 100%)" }}
          >
            <p className="text-white/60 text-sm mb-2">
              Mientras otros pagan $300–$500 por cada preparación de certificación,
            </p>
            <p className="text-white text-xl font-bold mb-4" style={{fontFamily:"var(--font-space-grotesk)"}}>
              en ITSEIA <span className="text-[#FBBC0C]">todas están incluidas en tu mensualidad.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-block bg-[#FBBC0C] text-[#0A1628] px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-colors"
              >
                Inscribirme y acceder a certificaciones
              </Link>
              <Link
                href="/login"
                className="inline-block border border-white/15 text-white/70 px-7 py-3 rounded-xl font-semibold text-sm hover:bg-white/[0.05] hover:border-white/25 transition-all"
              >
                Ya soy alumno — ir al campus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI LAB DEMO PREVIEW ─────────────────── */}
      <section className="py-20 px-5 bg-[#1F2F58]/20 border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Copy side */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-3 py-1 mb-5">
                <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">AI Lab incluido</span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-white mb-5 leading-tight tracking-tight"
                style={{fontFamily:"var(--font-space-grotesk)"}}
              >
                ChatGPT, Claude y Gemini{" "}
                <span className="text-[#FBBC0C]">en tu matrícula</span>
              </h2>
              <p className="text-white/55 mb-8 leading-relaxed">
                Mientras otros pagan $20/mes por una sola herramienta, tú tienes acceso a los tres modelos
                más avanzados del mundo — incluidos — desde el día 1.
              </p>
              <ul className="space-y-3">
                {[
                  "Chat ilimitado con Gemini Flash",
                  "Tutor IA que se adapta a tu nivel",
                  "Prompts sugeridos en cada lección",
                  "Historial de conversaciones guardado",
                  "Python interactivo en el navegador",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/65 text-sm">
                    <span className="w-4 h-4 rounded-full bg-[#FBBC0C]/15 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock terminal / AI Lab */}
            <div
              className="rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
              style={{ background: "rgba(10,22,40,0.8)", backdropFilter: "blur(20px)" }}
            >
              {/* Title bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F0846D]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC0C]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-white/25 text-xs ml-3 font-mono">AI Lab — ITSEIA</span>
                <div className="ml-auto flex gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FBBC0C]/15 text-[#FBBC0C] font-medium">Gemini</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-medium">Claude</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-medium">GPT</span>
                </div>
              </div>
              {/* Chat */}
              <div className="p-5 space-y-4">
                <div className="flex justify-end">
                  <div className="bg-[#FBBC0C]/10 border border-[#FBBC0C]/15 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[82%]">
                    <p className="text-white/80 text-sm">
                      Explícame cómo funciona una red neuronal usando una analogía simple
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FBBC0C]/20 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-[#FBBC0C] text-[9px] font-bold">AI</span>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-white/70 text-sm leading-relaxed">
                      Imagina una red neuronal como un equipo de{" "}
                      <strong className="text-[#73B8E7]">detectores especializados</strong>.
                      Cada neurona aprende a reconocer un patrón específico — como bordes,
                      colores o formas — y pasa esa información a la siguiente capa.
                      Juntas, aprenden a reconocer cosas complejas como rostros o texto...
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    readOnly
                    placeholder="Escribe tu pregunta al tutor IA..."
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white/30 text-sm cursor-not-allowed"
                  />
                  <button className="bg-[#FBBC0C] rounded-xl px-3.5 py-2.5 flex items-center justify-center" aria-label="Enviar">
                    <svg className="w-4 h-4 text-[#0A1628]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: EMPRESAS ─────────────────── */}
      <section id="empresas" className="py-20 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#F0846D]/10 border border-[#F0846D]/20 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0846D]" />
              <span className="text-[#F0846D] text-xs font-semibold tracking-wide uppercase">Ecosistema empresarial</span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight"
              style={{fontFamily:"var(--font-space-grotesk)"}}
            >
              Las empresas detrás de{" "}
              <span className="text-[#F0846D]">ITSEIA</span>
            </h2>
            <p className="text-white/45 max-w-2xl mx-auto">
              ITSEIA no es solo una institución educativa. Es parte de un ecosistema de empresas reales
              que operan con IA en producción. Nuestros alumnos aprenden con los mismos casos de negocio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {COMPANIES.map((co) => (
              <div
                key={co.id}
                className="group rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-xl"
                style={{
                  borderColor: `${co.color}20`,
                  background: "rgba(31,47,88,0.25)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Color top bar */}
                <div className="h-1" style={{ background: `linear-gradient(90deg, ${co.color}80, ${co.color}20)` }} />

                <div className="p-7">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3
                        className="text-2xl font-extrabold"
                        style={{ color: co.color, fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {co.name}
                      </h3>
                      <p className="text-white/35 text-xs mt-0.5">{co.url}</p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${co.color}15`, color: co.color, border: `1px solid ${co.color}25` }}
                    >
                      PARTNER
                    </span>
                  </div>

                  <p className="text-white/65 text-sm font-semibold mb-2">{co.tagline}</p>
                  <p className="text-white/45 text-sm leading-relaxed mb-5">{co.desc}</p>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {co.stats.map((s) => (
                      <div
                        key={s.label}
                        className="text-center p-2.5 rounded-xl"
                        style={{ background: `${co.color}10`, border: `1px solid ${co.color}15` }}
                      >
                        <p className="font-extrabold text-sm" style={{ color: co.color, fontFamily: "var(--font-space-grotesk)" }}>
                          {s.value}
                        </p>
                        <p className="text-white/30 text-[10px]">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={`https://${co.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: `${co.color}15`,
                      color: co.color,
                      border: `1px solid ${co.color}25`,
                    }}
                  >
                    Visitar {co.name}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* B2B CTA */}
          <div
            className="rounded-2xl border border-white/[0.07] p-7 md:p-10 text-center"
            style={{ background: "linear-gradient(135deg, rgba(240,132,109,0.07) 0%, rgba(31,47,88,0.3) 100%)" }}
          >
            <h3 className="text-2xl font-extrabold text-white mb-3" style={{fontFamily:"var(--font-space-grotesk)"}}>
              ¿Tu empresa quiere capacitar su equipo en IA?
            </h3>
            <p className="text-white/50 mb-6 max-w-lg mx-auto">
              Programas corporativos a medida. Dashboard de progreso del equipo, certificados, desde $2,000.
              Implementaciones en Ecuador, Colombia, México, Perú y más.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/593959892034?text=Hola%2C%20me%20interesa%20capacitaci%C3%B3n%20B2B%20en%20IA%20para%20mi%20empresa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Hablar con ventas por WhatsApp
              </a>
              <a
                href="mailto:administracion@itseia.ai"
                className="inline-block border border-white/15 text-white/70 px-7 py-3 rounded-xl font-semibold text-sm hover:bg-white/[0.05] hover:border-white/25 transition-all"
              >
                administracion@itseia.ai
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEMO ACCESS ────────────────────────── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl border border-[#73B8E7]/20 p-8 md:p-10 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(115,184,231,0.07) 0%, rgba(31,47,88,0.3) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="inline-flex items-center gap-2 bg-[#73B8E7]/10 border border-[#73B8E7]/20 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#73B8E7] animate-pulse" />
              <span className="text-[#73B8E7] text-xs font-semibold tracking-wide uppercase">Acceso demo gratuito</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight"
              style={{fontFamily:"var(--font-space-grotesk)"}}
            >
              Prueba el campus antes de inscribirte
            </h2>
            <p className="text-white/50 mb-7 max-w-lg mx-auto">
              Explora el AI Lab, los módulos de contenido y la interfaz completa con una cuenta demo.
            </p>
            {/* Credentials display */}
            <div className="inline-flex flex-col sm:flex-row gap-3 mb-7 text-left">
              <div className="bg-[#0A1628]/60 border border-white/[0.08] rounded-xl px-5 py-3">
                <p className="text-white/35 text-xs mb-0.5 font-medium uppercase tracking-wide">Usuario</p>
                <p className="text-[#73B8E7] font-mono text-sm font-semibold">demo@itseia.ai</p>
              </div>
              <div className="bg-[#0A1628]/60 border border-white/[0.08] rounded-xl px-5 py-3">
                <p className="text-white/35 text-xs mb-0.5 font-medium uppercase tracking-wide">Contraseña</p>
                <p className="text-[#73B8E7] font-mono text-sm font-semibold">DemoITSEIA2026!</p>
              </div>
            </div>
            <div>
              <Link
                href="/login"
                className="inline-block bg-[#73B8E7] text-[#0A1628] px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#5AA8D8] transition-colors shadow-lg shadow-[#73B8E7]/20"
              >
                Probar ahora — gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────── */}
      <section className="py-20 px-5 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight"
              style={{fontFamily:"var(--font-space-grotesk)"}}
            >
              Lo que dicen nuestros{" "}
              <span className="text-[#FBBC0C]">estudiantes</span>
            </h2>
            <p className="text-white/40 max-w-md mx-auto">
              Profesionales que ya están transformando su carrera con IA.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="relative p-7 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] transition-all duration-200"
              >
                {/* Large quote mark */}
                <div
                  className="absolute top-5 right-5 text-5xl leading-none font-serif"
                  style={{ color: `${t.color}12` }}
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <p className="text-white/60 leading-relaxed mb-6 text-sm relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: `${t.color}1A`, color: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/35 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SATURDAY SESSION CTA ─────────────── */}
      <section className="py-16 px-5 bg-[#1F2F58]/20 border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl border border-[#FBBC0C]/20 p-8 md:p-10"
            style={{
              background: "linear-gradient(135deg, rgba(251,188,12,0.06) 0%, rgba(31,47,88,0.4) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-3 py-1 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] animate-pulse" />
                  <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">Todos los sábados</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3" style={{fontFamily:"var(--font-space-grotesk)"}}>
                  Sesión informativa gratuita
                </h3>
                <p className="text-white/55 leading-relaxed mb-0">
                  Cada sábado a las 11:00 AM (Ecuador) te explicamos todo sobre las carreras,
                  el AI Lab y el proceso de matrícula. Sin compromiso. Con preguntas y respuestas en vivo.
                </p>
              </div>
              <div className="shrink-0 text-center md:text-right">
                <div
                  className="inline-block rounded-2xl border border-[#FBBC0C]/25 px-6 py-4 mb-5"
                  style={{ background: "rgba(251,188,12,0.08)" }}
                >
                  <p className="text-[#FBBC0C] text-xs font-bold uppercase tracking-wider mb-1">Próxima sesión</p>
                  <p className="text-white text-2xl font-extrabold" style={{fontFamily:"var(--font-space-grotesk)"}}>Sábado</p>
                  <p className="text-white/60 text-sm">11:00 AM · Google Meet</p>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://meet.google.com/fzx-fqns-ayc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <polygon points="23 7 16 12 23 17 23 7"/>
                      <rect x="1" y="5" width="15" height="14" rx="2"/>
                    </svg>
                    Unirme este sábado
                  </a>
                  <a
                    href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20a%20la%20sesi%C3%B3n%20del%20s%C3%A1bado"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-[#25D366]/30 text-[#25D366]/80 px-7 py-3 rounded-xl font-semibold text-sm hover:bg-[#25D366]/[0.08] hover:border-[#25D366]/50 transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                    Agendar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────── */}
      <section className="py-24 px-5 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[300px] bg-[#FBBC0C]/[0.04] blur-3xl rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight"
            style={{fontFamily:"var(--font-space-grotesk)"}}
          >
            El futuro no se espera.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #FBBC0C, #F0846D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Se construye.
            </span>
          </h2>
          <p className="text-white/45 mb-10 max-w-md mx-auto leading-relaxed">
            Únete a los profesionales que ya están dominando la IA con ITSEIA.
            Sesión informativa gratuita cada sábado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-[#FBBC0C] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#E5AB00] transition-all hover:scale-[1.02] shadow-xl shadow-[#FBBC0C]/25"
            >
              Inscribirme ahora — $220/mes
            </Link>
            <a
              href="https://meet.google.com/fzx-fqns-ayc"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/15 text-white/75 px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/[0.05] hover:border-white/25 transition-all"
            >
              Sesión informativa — Sáb 11AM
            </a>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center text-white/30 text-sm">
            <a href="mailto:administracion@itseia.ai" className="hover:text-white/60 transition-colors flex items-center gap-1.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z"/>
              </svg>
              administracion@itseia.ai
            </a>
            <span className="hidden sm:block text-white/15">·</span>
            <a href="https://wa.me/593959892034" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              +593 95 989 2034
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-[#060E1C] py-10 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                  <circle cx="8" cy="16" r="3.5" fill="#FBBC0C"/>
                  <circle cx="16" cy="7" r="2.5" fill="#73B8E7"/>
                  <circle cx="16" cy="25" r="2.5" fill="#F0846D"/>
                  <circle cx="24" cy="16" r="3" fill="#FBBC0C" opacity="0.7"/>
                  <line x1="8" y1="16" x2="16" y2="7" stroke="#FBBC0C" strokeWidth="1.2" opacity="0.7"/>
                  <line x1="8" y1="16" x2="16" y2="25" stroke="#73B8E7" strokeWidth="1.2" opacity="0.7"/>
                  <line x1="16" y1="7" x2="24" y2="16" stroke="#FBBC0C" strokeWidth="1.2" opacity="0.6"/>
                  <line x1="16" y1="25" x2="24" y2="16" stroke="#F0846D" strokeWidth="1.2" opacity="0.6"/>
                </svg>
                <span className="text-white font-extrabold text-base" style={{fontFamily:"var(--font-space-grotesk)"}}>ITSEIA</span>
              </div>
              <p className="text-white/30 text-xs leading-relaxed">
                Instituto Ecuatoriano de Inteligencia Artificial.<br />
                Quito, Ecuador · 2026
              </p>
            </div>

            {/* Programas */}
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Programas</p>
              <ul className="space-y-2">
                {[
                  { label: "Carreras IST", href: "#carreras" },
                  { label: "Preuniversitario", href: "#preuniversitario" },
                  { label: "Cursos Pro", href: "https://itseia.ai/cursos/" },
                  { label: "Certificaciones", href: "#certificaciones" },
                  { label: "Empresas", href: "#empresas" },
                  { label: "Catálogo completo", href: "/catalogo" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-white/35 hover:text-white/70 text-xs transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Campus */}
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Campus</p>
              <ul className="space-y-2">
                {[
                  { label: "Iniciar sesión", href: "/login" },
                  { label: "Registrarme", href: "/register" },
                  { label: "AI Lab", href: "/ai-lab" },
                  { label: "Mallas curriculares", href: "https://itseia.ai/mallas/" },
                  { label: "Demos", href: "https://itseia.ai/demos/" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-white/35 hover:text-white/70 text-xs transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Contacto</p>
              <ul className="space-y-2">
                <li>
                  <a href="https://itseia.ai" target="_blank" rel="noopener noreferrer" className="text-white/35 hover:text-white/70 text-xs transition-colors">
                    itseia.ai
                  </a>
                </li>
                <li>
                  <a href="mailto:administracion@itseia.ai" className="text-white/35 hover:text-white/70 text-xs transition-colors">
                    administracion@itseia.ai
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/593959892034" target="_blank" rel="noopener noreferrer" className="text-white/35 hover:text-white/70 text-xs transition-colors">
                    +593 95 989 2034
                  </a>
                </li>
                <li>
                  <a
                    href="https://meet.google.com/fzx-fqns-ayc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#73B8E7]/60 hover:text-[#73B8E7] text-xs transition-colors"
                  >
                    Sesión informativa — Sáb 11AM
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-white/20 text-xs">
              © 2026 ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial. Todos los derechos reservados.
            </p>
            <a href="/privacidad" className="text-white/20 hover:text-white/40 text-xs transition-colors">
              Política de privacidad
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

// ─────────────────────────────────────────────
// WorldCard sub-component
// ─────────────────────────────────────────────

function WorldCard({ world }: { world: (typeof WORLDS)[number] }) {
  const cardContent = (
    <div
      className="group relative flex flex-col h-full p-7 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] hover:shadow-2xl"
      style={{
        borderColor: world.borderColor,
        background: `linear-gradient(145deg, ${world.glowColor} 0%, rgba(31,47,88,0.25) 100%)`,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${world.color}18 0%, transparent 65%)`,
        }}
      />

      {/* Top row: badge + icon */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <span
          className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: `${world.color}15`,
            color: world.color,
            border: `1px solid ${world.color}30`,
          }}
        >
          {world.badge}
        </span>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          style={{ backgroundColor: `${world.color}20`, color: world.color }}
        >
          {world.icon}
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-xl font-extrabold text-white mb-2.5 relative z-10"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {world.title}
      </h3>

      {/* Description */}
      <p className="text-white/55 text-sm leading-relaxed mb-4 flex-1 relative z-10">
        {world.description}
      </p>

      {/* Detail line */}
      <p
        className="text-xs mb-5 relative z-10 font-semibold"
        style={{ color: `${world.color}90` }}
      >
        {world.detail}
      </p>

      {/* CTA */}
      <div
        className="relative z-10 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-center transition-all duration-200 group-hover:shadow-lg"
        style={{
          backgroundColor: `${world.color}20`,
          color: world.color,
          border: `1px solid ${world.color}30`,
        }}
      >
        {world.cta}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  );

  if (world.isExternal) {
    return (
      <a href={world.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={world.href} className="block h-full">
      {cardContent}
    </Link>
  );
}
