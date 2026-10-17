"use client";

import { useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";

// ─────────────────────────────────────────────
// /bootcamp-info — Sales landing for Bootcamp Intensivo de IA
// ─────────────────────────────────────────────

// EmailJS config
const EMAILJS_SERVICE = "service_yqv4dts";
const EMAILJS_TEMPLATE = "template_mallas";
const EMAILJS_KEY = "A7cQPi8jRCDyLrHQr";

function InscripcionForm({ producto }: { producto: string }) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("Profesional en reskilling");
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
            producto: `${producto} — ${perfil}`,
            mensaje: `Nueva inscripción Bootcamp desde tecnologico.itseia.ai — Perfil: ${perfil}`,
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
        <p className="text-white font-bold mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Inscripción recibida</p>
        <p className="text-white/55 text-sm">Te contactamos en menos de 24 horas para confirmar cohorte y enviar el contrato del bootcamp.</p>
        <a href="https://wa.me/593997489821?text=Hola%2C%20quiero%20inscribirme%20en%20el%20Bootcamp%20Intensivo%20de%20IA" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#25D366] text-sm font-semibold hover:underline">Hablar con asesor por WhatsApp →</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#73B8E7]/25 p-8" style={{ background: "linear-gradient(145deg, rgba(115,184,231,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}>
      <div className="inline-flex items-center gap-2 bg-[#73B8E7]/10 border border-[#73B8E7]/20 rounded-full px-4 py-1.5 mb-6">
        <span className="text-[#73B8E7] text-xs font-bold uppercase tracking-wide">Inscripción directa — Bootcamp Intensivo</span>
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
      <div className="mb-6">
        <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-1.5">Tu perfil</label>
        <select
          value={perfil}
          onChange={e => setPerfil(e.target.value)}
          className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#73B8E7]/50 transition-colors"
        >
          <option value="Profesional en reskilling" className="bg-[#0A1628]">Profesional en reskilling</option>
          <option value="Líder técnico / mando medio" className="bg-[#0A1628]">Líder técnico / mando medio</option>
          <option value="Emprendedor / fundador" className="bg-[#0A1628]">Emprendedor / fundador</option>
          <option value="Estudiante o recién graduado" className="bg-[#0A1628]">Estudiante o recién graduado</option>
          <option value="Equipo corporativo (B2B)" className="bg-[#0A1628]">Equipo corporativo (B2B)</option>
        </select>
      </div>
      <input type="hidden" value={producto} />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-[#73B8E7] text-[#0A1628] py-3.5 rounded-xl font-bold text-sm hover:bg-[#5FA3D5] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-[#73B8E7]/20 mb-5"
      >
        {status === "sending" ? "Enviando..." : "Reservar mi cupo en el bootcamp"}
      </button>

      {status === "error" && <p className="text-red-400 text-xs text-center mb-4">Error al enviar. Escribe por WhatsApp directamente.</p>}

      {/* Datos de pago */}
      <div className="border-t border-white/[0.08] pt-5 space-y-3">
        <p className="text-white/40 text-xs uppercase tracking-wider font-bold text-center mb-3">Datos para depósito / transferencia</p>
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
            <a href="https://wa.me/593997489821?text=Hola%2C%20quiero%20inscribirme%20en%20el%20Bootcamp%20Intensivo%20de%20IA" target="_blank" rel="noopener noreferrer" className="text-[#25D366] text-sm font-bold hover:underline">+593 99 748 9821</a>
          </div>
        </div>
      </div>
    </form>
  );
}

const BENEFITS_BOOTCAMP = [
  {
    title: "16 sesiones por mes",
    desc: "Estructura de alta intensidad: 4 módulos × 4 sesiones cada mes. Cada sesión incluye teoría, presentación, quiz, ejercicio y recursos.",
    color: "#73B8E7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    title: "Live + grabado",
    desc: "Sesiones en vivo con instructor para resolver dudas en tiempo real, más grabaciones disponibles 24/7 si no puedes asistir.",
    color: "#FBBC0C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
  },
  {
    title: "Certificado al finalizar",
    desc: "Certificado ITSEIA de Bootcamp Intensivo de IA al completar las 12 semanas y entregar el proyecto integrador final.",
    color: "#F0846D",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    title: "Partners H3L · ImagemIA · Strata",
    desc: "Acceso al pipeline de empleo de las tres empresas del ecosistema ITSEIA. Casos reales de IA en operaciones, salud y plataformas SaaS.",
    color: "#73B8E7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 21h18"/>
        <path d="M5 21V7l8-4v18"/>
        <path d="M19 21V11l-6-4"/>
      </svg>
    ),
  },
  {
    title: "Proyectos reales",
    desc: "No simulaciones. Construyes un MVP propio durante el Mes 1 (PRD + ingesta + integración + Demo Day) y lo presentas al final del bootcamp.",
    color: "#FBBC0C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    title: "AI Lab incluido",
    desc: "Acceso a ChatGPT, Claude y Gemini durante las 12 semanas. Practicas con las herramientas que realmente usan las empresas en producción.",
    color: "#F0846D",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2a10 10 0 1 0 10 10"/>
        <path d="M12 6v6l4 2"/>
        <circle cx="19" cy="5" r="3" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
];

// Mes 1 — datos extraídos directamente de mes1-data.ts (verificados)
const MES1_MODULOS = [
  {
    num: 1,
    nombre: "Fundamentos de IA",
    horas: 8,
    color: "#73B8E7",
    sesiones: [
      "Bienvenida + ¿Qué es realmente la Inteligencia Artificial?",
      "Anatomía de un LLM: cómo funcionan ChatGPT, Claude y Gemini",
      "Mapa de herramientas IA 2026: el ecosistema en una página",
      "Riesgos, ética y marco legal de la IA en Ecuador",
    ],
  },
  {
    num: 2,
    nombre: "Prompt Engineering",
    horas: 8,
    color: "#FBBC0C",
    sesiones: [
      "Anatomía del prompt: las 6 capas de un prompt profesional",
      "Técnicas avanzadas: Chain of Thought, Self-Consistency, Tree of Thoughts",
      "Prompts para tareas profesionales reales: comunicación, análisis, creatividad",
      "Bibliotecas de prompts, versionado y trabajo en equipo",
    ],
  },
  {
    num: 3,
    nombre: "Automatización con IA",
    horas: 8,
    color: "#F0846D",
    sesiones: [
      "Conceptos de automatización: triggers, acciones, flujos",
      "Make (ex-Integromat): el primer flujo end-to-end con IA",
      "Conectores avanzados: WhatsApp, Notion, Calendar, Drive",
      "Agentes de IA: cuando la automatización piensa",
    ],
  },
  {
    num: 4,
    nombre: "Proyecto Integrador del Mes",
    horas: 8,
    color: "#73B8E7",
    sesiones: [
      "Definición del proyecto: del problema al PRD de 1 página",
      "Construcción guiada del MVP, parte 1: ingesta y razonamiento",
      "Construcción guiada del MVP, parte 2: integración y publicación",
      "Demo Day del Mes 1: presentación y evaluación cruzada",
    ],
  },
];

const TARGET_AUDIENCE = [
  {
    name: "Profesionales en reskilling",
    desc: "Ya trabajas en tu industria, pero ves que la IA está cambiando todo. Necesitas actualizarte rápido y demostrarlo con un proyecto real.",
    color: "#FBBC0C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/>
      </svg>
    ),
  },
  {
    name: "Líderes técnicos y mandos medios",
    desc: "Lideras un equipo y necesitas decidir qué procesos automatizar, qué herramientas adoptar y cómo medir el retorno de la IA en tu área.",
    color: "#73B8E7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    name: "Emprendedores y fundadores",
    desc: "Quieres construir o escalar tu negocio con IA. Buscas pasar de las ideas a un MVP funcional sin contratar un equipo entero de ingenieros.",
    color: "#F0846D",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      </svg>
    ),
  },
  {
    name: "Equipos corporativos B2B",
    desc: "Tu empresa quiere capacitar 10 a 50 colaboradores en IA con un programa intensivo. Tenemos planes B2B con soporte dedicado y métricas de adopción.",
    color: "#FBBC0C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 21h18"/>
        <path d="M5 21V7l8-4v18"/>
        <path d="M19 21V11l-6-4"/>
      </svg>
    ),
  },
];

const PARTNERS = [
  {
    name: "H3L",
    url: "h3l.ai",
    tagline: "Auditoría operativa con IA",
    desc: "Identifica capacidad atrapada en empresas. Implementaciones en 7 países. Casos reales que estudiarás en el bootcamp.",
    color: "#FBBC0C",
    stat: "7 países",
  },
  {
    name: "ImagemIA",
    url: "imagemia.com",
    tagline: "IA predictiva en imagenología",
    desc: "Reduce 30% las inasistencias en clínicas con modelos predictivos. Empresa de salud + IA con vacantes activas.",
    color: "#73B8E7",
    stat: "Salud + IA",
  },
  {
    name: "Strata",
    url: "strata.h3l.ai",
    tagline: "Cerebro digital empresarial",
    desc: "9.000+ documentos en 19 países. Plataforma SaaS de IA empresarial que contrata egresados del bootcamp.",
    color: "#F0846D",
    stat: "19 países",
  },
];

const FAQS = [
  {
    q: "¿Cuánto dura el Bootcamp Intensivo?",
    a: "12 semanas en total — divididas en 3 meses de 4 semanas cada uno. Cada mes incluye 16 sesiones (4 módulos × 4 sesiones), con un proyecto integrador al final del mes y un Demo Day.",
  },
  {
    q: "¿Cuántas horas por semana debo dedicar?",
    a: "Recomendamos entre 8 y 12 horas semanales: 4 horas de sesiones live + 4 a 8 horas de práctica, ejercicios y proyecto. Es un programa intensivo de reskilling, no un curso casual.",
  },
  {
    q: "¿Qué pasa si no puedo asistir a una sesión live?",
    a: "Todas las sesiones quedan grabadas y disponibles 24/7. Puedes ver la grabación cuando puedas y enviar tus preguntas por WhatsApp al instructor. Lo importante es entregar los ejercicios y el proyecto del mes.",
  },
  {
    q: "¿El Bootcamp tiene certificación MDT?",
    a: "El certificado oficial es de ITSEIA — Bootcamp Intensivo de IA. Si necesitas certificación MDT específica, los Cursos MDT individuales sí son avalados por el Ministerio del Trabajo. Consulta por WhatsApp para combinar Bootcamp + certificación MDT.",
  },
  {
    q: "¿Hay opción B2B para empresas?",
    a: "Sí. Atendemos cohortes corporativas de 10 a 50 colaboradores con currículo adaptado a tu industria, métricas de adopción y soporte dedicado. Escríbenos por WhatsApp para una propuesta.",
  },
];

export default function BootcampInfoPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] font-sans overflow-x-hidden">

      {/* WhatsApp float */}
      <a
        href="https://wa.me/593997489821?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20Bootcamp%20Intensivo%20de%20IA%20de%20ITSEIA"
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
      {/* Login access — prominent banner */}
      <div className="text-center py-4 px-4 bg-gradient-to-r from-[#73B8E7]/10 via-[#73B8E7]/15 to-[#73B8E7]/10 border-b border-[#73B8E7]/20">
        <a href="/login?from=bootcamp" className="inline-flex items-center gap-3 group">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#73B8E7]/20 group-hover:bg-[#73B8E7]/30 transition-colors">
            <svg className="w-4 h-4 text-[#73B8E7]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v7" /></svg>
          </span>
          <span className="text-white font-semibold text-sm sm:text-base">¿Ya eres estudiante Bootcamp?</span>
          <span className="text-[#73B8E7] font-bold text-sm sm:text-base group-hover:underline">Accede a tu cohorte →</span>
        </a>
      </div>

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 px-5 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#73B8E7]/[0.05] blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FBBC0C]/[0.04] blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#73B8E7]/10 border border-[#73B8E7]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#73B8E7] animate-pulse" />
            <span className="text-[#73B8E7] text-xs font-semibold tracking-wide uppercase">Cohortes 2026 — Cupos limitados</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Bootcamp Intensivo IA
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #73B8E7 0%, #FBBC0C 60%, #F0846D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              12 semanas para reskilling completo
            </span>
          </h1>

          <p className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            48 sesiones intensivas, 3 proyectos reales, certificación ITSEIA y acceso al pipeline de empleo de H3L, ImagemIA y Strata.
            <br />
            <span className="text-[#FBBC0C]">Si necesitas transformarte profesionalmente este año, este es el camino.</span>
          </p>

          {/* Highlights bar */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-[#1F2F58]/40 border border-[#73B8E7]/25 rounded-2xl px-6 py-4 mb-8">
            <div className="text-center px-3">
              <span
                className="text-[#73B8E7] text-2xl font-extrabold block"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                12
              </span>
              <span className="text-white/50 text-xs">semanas</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center px-3">
              <span
                className="text-[#FBBC0C] text-2xl font-extrabold block"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                48
              </span>
              <span className="text-white/50 text-xs">sesiones</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center px-3">
              <span
                className="text-[#F0846D] text-2xl font-extrabold block"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                3
              </span>
              <span className="text-white/50 text-xs">proyectos</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center px-3">
              <span
                className="text-[#FBBC0C] text-2xl font-extrabold block"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                3
              </span>
              <span className="text-white/50 text-xs">partners</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#inscripcion"
              className="bg-[#73B8E7] text-[#0A1628] px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#5FA3D5] transition-all hover:scale-[1.02] shadow-xl shadow-[#73B8E7]/25"
            >
              Reservar mi cupo
            </a>
            <a
              href="https://wa.me/593997489821?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20Bootcamp%20Intensivo%20de%20IA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#25D366]/30 text-[#25D366]/80 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-[#25D366]/[0.08] transition-all"
            >
              Hablar con un asesor
            </a>
          </div>
        </div>
      </section>

      {/* ── BENEFITS BAR ── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              ¿Qué incluye el Bootcamp?
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">
              Programa completo de transformación profesional — diseñado para que en 12 semanas operes como profesional de IA.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS_BOOTCAMP.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border p-6 hover:scale-[1.01] transition-transform duration-200"
                style={{
                  borderColor: `${b.color}22`,
                  background: `linear-gradient(145deg, ${b.color}08 0%, rgba(31,47,88,0.25) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${b.color}20`, color: b.color }}
                >
                  {b.icon}
                </div>
                <h3
                  className="text-white font-extrabold text-lg mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {b.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MES 1 PREVIEW ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#73B8E7]/10 border border-[#73B8E7]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#73B8E7] text-xs font-bold uppercase tracking-wide">Preview · Mes 1</span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Mes 1 — Fundamentos hasta tu primer MVP
            </h2>
            <p className="text-white/45 max-w-2xl mx-auto">
              4 módulos · 16 sesiones · 32 horas. Terminas el primer mes con un Demo Day y tu propio MVP funcionando.
              Los meses 2 y 3 se enfocan en aplicaciones avanzadas, ML práctico y proyecto final integrador.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {MES1_MODULOS.map((m) => (
              <div
                key={m.num}
                className="rounded-2xl border p-6"
                style={{
                  borderColor: `${m.color}22`,
                  background: `linear-gradient(145deg, ${m.color}08 0%, rgba(31,47,88,0.25) 100%)`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-extrabold text-[#0A1628] text-base"
                    style={{ background: m.color, fontFamily: "var(--font-space-grotesk)" }}
                  >
                    M{m.num}
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-md"
                    style={{ color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}25` }}
                  >
                    {m.horas} horas · {m.sesiones.length} sesiones
                  </span>
                </div>
                <h3
                  className="text-white font-extrabold text-lg mb-4"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {m.nombre}
                </h3>
                <ul className="space-y-2.5">
                  {m.sesiones.map((s, i) => (
                    <li key={s} className="flex items-start gap-3 text-white/60 text-sm">
                      <span
                        className="font-bold shrink-0 mt-0.5"
                        style={{ color: m.color, fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {`${m.num}.${i + 1}`}
                      </span>
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ¿PARA QUIÉN ES? ── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              ¿Quién debería tomar este Bootcamp?
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">
              Un programa intensivo no es para todos. Estos son los perfiles donde el Bootcamp tiene mayor retorno.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {TARGET_AUDIENCE.map((p) => (
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
                <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS / EMPRESAS ── */}
      <section className="py-16 px-5 bg-[#1F2F58]/15 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Empresas que contratan a nuestros egresados
            </h2>
            <p className="text-white/45 max-w-lg mx-auto">
              Los mejores egresados del Bootcamp tienen acceso directo al pipeline de talento de las tres empresas del ecosistema ITSEIA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {PARTNERS.map((c) => (
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

      {/* ── INSCRIPCIÓN ── */}
      <section id="inscripcion" className="py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Reserva tu cupo en el Bootcamp
          </h2>
          <p className="text-white/45 mb-10">
            Cohortes intensivas de 12 semanas. Cupos limitados para mantener calidad de seguimiento.
          </p>

          <div
            className="rounded-2xl border border-[#73B8E7]/25 p-8 mb-8"
            style={{ background: "linear-gradient(145deg, rgba(115,184,231,0.08) 0%, rgba(31,47,88,0.3) 100%)", backdropFilter: "blur(12px)" }}
          >
            <div className="inline-flex items-center gap-2 bg-[#73B8E7]/10 border border-[#73B8E7]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#73B8E7] text-xs font-bold uppercase tracking-wide">12 semanas · 48 sesiones · 3 proyectos</span>
            </div>

            <ul className="space-y-3 text-left mb-6">
              {[
                "16 sesiones por mes (4 módulos × 4 sesiones)",
                "Sesiones en vivo + grabaciones disponibles 24/7",
                "AI Lab: ChatGPT + Claude + Gemini incluidos",
                "3 proyectos reales con Demo Day cada mes",
                "Acceso al pipeline de empleo H3L, ImagemIA y Strata",
                "Certificado ITSEIA Bootcamp Intensivo de IA",
                "Soporte por WhatsApp con instructores reales",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/65 text-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#73B8E7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 mt-0.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/30 text-xs">Consulta precio y formas de pago al asesor — planes individuales y B2B disponibles</p>
          </div>

          <InscripcionForm producto="bootcamp-intensivo-ia" />
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

      {/* ── FOOTER CTA ── */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            12 semanas que cambian
            <br />
            <span className="text-[#73B8E7]">tu carrera profesional.</span>
          </h2>
          <p className="text-white/45 mb-8">
            Cupos limitados por cohorte · Inicio próxima cohorte 2026 · Pregunta hoy por fechas
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#inscripcion"
              className="bg-[#73B8E7] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#5FA3D5] transition-all hover:scale-[1.02] shadow-xl shadow-[#73B8E7]/25"
            >
              Reservar mi cupo
            </a>
            <a
              href="/login?from=bootcamp"
              className="border border-white/15 text-white/80 px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/[0.05] transition-all"
            >
              Ya soy estudiante — Acceder
            </a>
            <a
              href="https://wa.me/593997489821?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20Bootcamp%20Intensivo%20de%20IA"
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
