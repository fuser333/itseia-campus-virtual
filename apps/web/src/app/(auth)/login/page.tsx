"use client";

import { Suspense, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye, EyeOff, LogIn, Loader2,
  GraduationCap, Building2, Rocket, Award, BookOpen, Users,
  Brain, Zap, TrendingUp, Shield, Star, Target,
  ChevronRight, Sparkles
} from "lucide-react";

// ============================================================
// MODULE CONFIGURATIONS — Each module gets its own spectacular login
// ============================================================
const MODULE_CONFIGS: Record<string, ModuleConfig> = {
  carreras: {
    id: "carreras",
    icon: GraduationCap,
    accentColor: "yellow",
    accentHex: "#FBBC0C",
    gradientFrom: "from-[#0A1628]",
    gradientVia: "via-[#1F2F58]",
    gradientTo: "to-[#2A3F6E]",
    headline: "Tu Carrera en IA\nComienza Aqui",
    subheadline: "3 carreras que te ponen 2.5 anos adelante del mercado",
    description: "Mientras otros estudian 5 anos de teoria, tu ya estaras trabajando con IA real. Horario vespertino para que no dejes de vivir.",
    features: [
      { icon: Brain, text: "AI Lab con herramientas reales", highlight: "ChatGPT, Claude, Gemini" },
      { icon: Zap, text: "65% practico desde el dia 1", highlight: "No solo teoria" },
      { icon: TrendingUp, text: "85-92% empleabilidad", highlight: "Datos verificables" },
    ],
    stats: [
      { value: "2.5", label: "anos", suffix: "" },
      { value: "$99", label: "al mes", suffix: "" },
      { value: "85%", label: "empleo", suffix: "+" },
    ],
    cta: "Accede a tu carrera",
    badge: "Inscripciones Abiertas 2026",
    imagePrompt: "Estudiante ecuatoriano joven usando laptop con interfaz de IA, ambiente futurista navy/dorado, estilo tech premium",
  },
  b2b: {
    id: "b2b",
    icon: Building2,
    accentColor: "light-blue",
    accentHex: "#73B8E7",
    gradientFrom: "from-[#0A1628]",
    gradientVia: "via-[#1a2a4a]",
    gradientTo: "to-[#1F3A5F]",
    headline: "Transforma tu\nEmpresa con IA",
    subheadline: "3 soluciones probadas en 7 paises",
    description: "H3L identifica $150K-$800K en capacidad atrapada. ImagemIA reduce inasistencias 30%. Strata: tu cerebro digital desde $19.99/mes.",
    features: [
      { icon: Target, text: "H3L — Auditoria operativa IA", highlight: "$150K-$800K ahorros" },
      { icon: Shield, text: "ImagemIA — IA predictiva medica", highlight: "-30% inasistencias" },
      { icon: Sparkles, text: "Strata — Cerebro digital", highlight: "Desde $19.99/mes" },
    ],
    stats: [
      { value: "7", label: "paises", suffix: "" },
      { value: "$150K", label: "ahorro min", suffix: "" },
      { value: "9K", label: "docs procesados", suffix: "+" },
    ],
    cta: "Accede al portal empresarial",
    badge: "Diagnostico Gratis",
    imagePrompt: "Ejecutivos en sala de reuniones con dashboard de IA en pantalla grande, estilo corporativo premium, tonos azul/navy",
  },
  preuni: {
    id: "preuni",
    icon: Rocket,
    accentColor: "coral",
    accentHex: "#F0846D",
    gradientFrom: "from-[#0A1628]",
    gradientVia: "via-[#2A1F3F]",
    gradientTo: "to-[#3A2048]",
    headline: "Tu Primer Paso\nen el Mundo de la IA",
    subheadline: "Preuniversitario que te prepara para dominar la tecnologia",
    description: "No necesitas saber programar. En semanas vas a entender IA, Python y machine learning. El trampolín perfecto antes de la carrera.",
    features: [
      { icon: BookOpen, text: "Desde cero, sin experiencia previa", highlight: "Para todos" },
      { icon: Zap, text: "Aprende haciendo con IA real", highlight: "100% practico" },
      { icon: Star, text: "Reserva tu cupo por solo $180", highlight: "Total: $399" },
    ],
    stats: [
      { value: "$399", label: "total", suffix: "" },
      { value: "$180", label: "reserva", suffix: "" },
      { value: "100%", label: "practico", suffix: "" },
    ],
    cta: "Accede al preuniversitario",
    badge: "Cupos Limitados",
    imagePrompt: "Joven ecuatoriano emocionado descubriendo IA en laptop, ambiente vibrante coral/morado, energia juvenil tech",
  },
  cursos: {
    id: "cursos",
    icon: Sparkles,
    accentColor: "yellow",
    accentHex: "#FBBC0C",
    gradientFrom: "from-[#0A1628]",
    gradientVia: "via-[#1F2F58]",
    gradientTo: "to-[#2A3F6E]",
    headline: "Domina la IA\nen tu Profesion",
    subheadline: "22 profesiones ya estan aprendiendo IA con nosotros",
    description: "Medicos, abogados, contadores, arquitectos — todos estan integrando IA. Tu quiz personalizado te dice exactamente que aprender.",
    features: [
      { icon: Target, text: "Quiz que personaliza tu ruta", highlight: "9 preguntas" },
      { icon: Zap, text: "Express $97 | Estandar $197", highlight: "Completo $297" },
      { icon: Award, text: "Certificado de completacion", highlight: "LinkedIn ready" },
    ],
    stats: [
      { value: "22", label: "profesiones", suffix: "" },
      { value: "$97", label: "desde", suffix: "" },
      { value: "110", label: "modulos", suffix: "" },
    ],
    cta: "Accede a tus cursos",
    badge: "Empieza Hoy",
    imagePrompt: "Profesional ecuatoriano diverso usando IA en su trabajo diario, multiples profesiones, estilo premium dorado/navy",
  },
  certificaciones: {
    id: "certificaciones",
    icon: Award,
    accentColor: "light-blue",
    accentHex: "#73B8E7",
    gradientFrom: "from-[#0A1628]",
    gradientVia: "via-[#152845]",
    gradientTo: "to-[#1A3355]",
    headline: "Certificaciones\nque el Mercado Valora",
    subheadline: "AWS, Google Cloud, Azure — las credenciales que abren puertas",
    description: "Las empresas no contratan por tu titulo. Contratan por lo que sabes hacer. Estas certificaciones lo demuestran.",
    features: [
      { icon: Shield, text: "AWS Cloud Practitioner", highlight: "Valor: $100" },
      { icon: Star, text: "Google Cloud Digital Leader", highlight: "Valor: $99" },
      { icon: Award, text: "Azure AI Fundamentals", highlight: "Valor: $99" },
    ],
    stats: [
      { value: "$298", label: "valor real", suffix: "" },
      { value: "3", label: "certificaciones", suffix: "" },
      { value: "90%", label: "aprobacion", suffix: "+" },
    ],
    cta: "Accede a certificaciones",
    badge: "Incluidas en la Carrera",
    imagePrompt: "Badges/certificaciones AWS Google Azure flotando en espacio tech, estilo 3D premium azul/dorado, profesional",
  },
  docentes: {
    id: "docentes",
    icon: Users,
    accentColor: "coral",
    accentHex: "#F0846D",
    gradientFrom: "from-[#0A1628]",
    gradientVia: "via-[#1F2F58]",
    gradientTo: "to-[#2A3F6E]",
    headline: "Panel Docente\nITSEIA",
    subheadline: "Gestiona tus cursos, estudiantes y evaluaciones",
    description: "Herramientas disenadas para que te enfoques en ensenar, no en administrar. Todo lo que necesitas en un solo lugar.",
    features: [
      { icon: BookOpen, text: "Gestion de sesiones y materias", highlight: "Todo en uno" },
      { icon: Users, text: "Seguimiento de estudiantes", highlight: "En tiempo real" },
      { icon: Brain, text: "AI Lab para preparar clases", highlight: "IA como asistente" },
    ],
    stats: [
      { value: "1,942", label: "sesiones", suffix: "" },
      { value: "10", label: "programas", suffix: "" },
      { value: "AI", label: "Lab", suffix: "" },
    ],
    cta: "Accede al panel docente",
    badge: "Panel Docente",
    imagePrompt: "Profesor ecuatoriano en aula tech moderna con estudiantes usando IA, ambiente coral/navy, educacion del futuro",
  },
  bootcamp: {
    id: "bootcamp",
    icon: Zap,
    accentColor: "yellow",
    accentHex: "#FBBC0C",
    gradientFrom: "from-[#0A1628]",
    gradientVia: "via-[#1F2F58]",
    gradientTo: "to-[#3A2048]",
    headline: "Tu Bootcamp\ncomienza aqui",
    subheadline: "12 semanas para transformarte en profesional IA",
    description: "16 sesiones por mes (live + grabado), proyectos reales con empresas partner H3L, ImagemIA y Strata. Certificado al completar.",
    features: [
      { icon: Zap, text: "Live + grabado, intensivo", highlight: "16 sesiones/mes" },
      { icon: Brain, text: "Partners reales: H3L, ImagemIA, Strata", highlight: "Casos reales" },
      { icon: Star, text: "Proyecto integrador cada mes", highlight: "Portafolio real" },
    ],
    stats: [
      { value: "12", label: "semanas", suffix: "" },
      { value: "48", label: "sesiones", suffix: "" },
      { value: "3", label: "proyectos", suffix: "" },
    ],
    cta: "Accede a tu cohorte",
    badge: "Bootcamp Intensivo",
    imagePrompt: "Bootcamp tech intensivo con jovenes profesionales aprendiendo IA en pantallas multiples, energia ambar/navy",
  },
  "cursos-mdt": {
    id: "cursos-mdt",
    icon: Award,
    accentColor: "yellow",
    accentHex: "#FBBC0C",
    gradientFrom: "from-[#0A1628]",
    gradientVia: "via-[#1F2F58]",
    gradientTo: "to-[#2A3F6E]",
    headline: "Tus cursos MDT\nte esperan",
    subheadline: "15 cursos certificados Ministerio del Trabajo",
    description: "Certificacion oficial reconocida en todo Ecuador. Modalidad online a tu ritmo. Desde $99 por curso completo con AI Lab incluido.",
    features: [
      { icon: Award, text: "Certificado MDT oficial", highlight: "Ecuador" },
      { icon: Zap, text: "100% online, a tu ritmo", highlight: "Sin horarios" },
      { icon: Brain, text: "AI Lab incluido sin costo extra", highlight: "ChatGPT, Claude" },
    ],
    stats: [
      { value: "15", label: "cursos", suffix: "" },
      { value: "$99", label: "desde", suffix: "" },
      { value: "MDT", label: "certificado", suffix: "" },
    ],
    cta: "Accede a tus cursos MDT",
    badge: "Certificacion MDT",
    imagePrompt: "Profesional ecuatoriano completando curso online con certificado digital MDT en pantalla, navy/dorado",
  },
  "cursos-pro": {
    id: "cursos-pro",
    icon: BookOpen,
    accentColor: "yellow",
    accentHex: "#FBBC0C",
    gradientFrom: "from-[#0A1628]",
    gradientVia: "via-[#1F2F58]",
    gradientTo: "to-[#2A3F6E]",
    headline: "Tus cursos\nProfesionales",
    subheadline: "Express, Estandar y Completo desde $97",
    description: "Cursos profesionales adaptados a tu industria. 40 a 80 horas con instructor real, proyecto aplicado y certificado MDT.",
    features: [
      { icon: BookOpen, text: "Express, Estandar y Completo", highlight: "$97-$297" },
      { icon: Users, text: "Instructor real con seguimiento", highlight: "1-on-1" },
      { icon: Award, text: "Certificado MDT al finalizar", highlight: "Validez nacional" },
    ],
    stats: [
      { value: "40-80", label: "horas", suffix: "" },
      { value: "$97", label: "desde", suffix: "" },
      { value: "MDT", label: "certificado", suffix: "" },
    ],
    cta: "Accede a tus cursos pro",
    badge: "Cursos Profesionales",
    imagePrompt: "Profesional ecuatoriano completando curso especializado con instructor en videollamada, estilo premium navy/dorado",
  },
  empresas: {
    // alias de b2b — para usar desde /empresas-info
    id: "empresas",
    icon: Building2,
    accentColor: "light-blue",
    accentHex: "#73B8E7",
    gradientFrom: "from-[#0A1628]",
    gradientVia: "via-[#1a2a4a]",
    gradientTo: "to-[#1F3A5F]",
    headline: "Transforma tu\nEmpresa con IA",
    subheadline: "3 soluciones probadas en 7 paises",
    description: "H3L identifica $150K-$800K en capacidad atrapada. ImagemIA reduce inasistencias 30%. Strata: tu cerebro digital desde $19.99/mes.",
    features: [
      { icon: Target, text: "H3L — Auditoria operativa IA", highlight: "$150K-$800K ahorros" },
      { icon: Shield, text: "ImagemIA — IA predictiva medica", highlight: "-30% inasistencias" },
      { icon: Sparkles, text: "Strata — Cerebro digital", highlight: "Desde $19.99/mes" },
    ],
    stats: [
      { value: "7", label: "paises", suffix: "" },
      { value: "$150K", label: "ahorro min", suffix: "" },
      { value: "9K", label: "docs", suffix: "+" },
    ],
    cta: "Accede al portal empresarial",
    badge: "Diagnostico Gratis",
    imagePrompt: "Ejecutivos en sala de reuniones con dashboard de IA en pantalla grande, estilo corporativo premium, tonos azul/navy",
  },
  demo: {
    id: "demo",
    icon: Sparkles,
    accentColor: "coral",
    accentHex: "#F0846D",
    gradientFrom: "from-[#0A1628]",
    gradientVia: "via-[#2A1F3F]",
    gradientTo: "to-[#3A2048]",
    headline: "Demo gratis\nde IGNITE",
    subheadline: "Vive la primera semana del preuniversitario sin pagar",
    description: "Acceso completo a la Semana 1 de IGNITE con videos, ejercicios y AI Lab. Las semanas 2-4 estan disponibles solo en la cohorte completa.",
    features: [
      { icon: Sparkles, text: "Semana 1 completa gratis", highlight: "5 dias" },
      { icon: Brain, text: "AI Lab incluido en demo", highlight: "ChatGPT real" },
      { icon: Rocket, text: "CTA directo a IGNITE completo", highlight: "$99 total" },
    ],
    stats: [
      { value: "5", label: "dias gratis", suffix: "" },
      { value: "$99", label: "completo", suffix: "" },
      { value: "20", label: "dias total", suffix: "" },
    ],
    cta: "Entra al demo",
    badge: "Demo Gratis",
    imagePrompt: "Joven ecuatoriano probando demo IA en laptop con interfaz limpia, ambiente coral/navy, descubrimiento",
  },
};

// Default config (generic login)
const DEFAULT_CONFIG: ModuleConfig = {
  ...MODULE_CONFIGS.carreras,
  id: "default",
  headline: "Bienvenido a\nITSEIA",
  subheadline: "Instituto Ecuatoriano de Inteligencia Artificial",
  description: "Accede a tu plataforma educativa con AI Lab, segundo cerebro y las herramientas mas avanzadas de inteligencia artificial.",
  cta: "Iniciar sesion",
  badge: "Plataforma Educativa IA",
};

interface ModuleConfig {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  accentHex: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  headline: string;
  subheadline: string;
  description: string;
  features: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; text: string; highlight: string }[];
  stats: { value: string; label: string; suffix: string }[];
  cta: string;
  badge: string;
  imagePrompt: string;
}

// Detect module from redirect path
function detectModule(redirect: string): ModuleConfig {
  if (redirect.startsWith("/b2b") || redirect.startsWith("/empresas")) return MODULE_CONFIGS.b2b;
  if (redirect.startsWith("/bootcamp")) return MODULE_CONFIGS.bootcamp;
  if (redirect.startsWith("/cursos-mdt")) return MODULE_CONFIGS["cursos-mdt"];
  if (redirect.startsWith("/cursos-pro")) return MODULE_CONFIGS["cursos-pro"];
  if (redirect.startsWith("/preuni")) return MODULE_CONFIGS.preuni;
  if (redirect.startsWith("/demo")) return MODULE_CONFIGS.demo;
  if (redirect.startsWith("/mi-curso") || redirect.startsWith("/cursos")) return MODULE_CONFIGS.cursos;
  if (redirect.startsWith("/certificaciones")) return MODULE_CONFIGS.certificaciones;
  if (redirect.startsWith("/teacher") || redirect.startsWith("/docente")) return MODULE_CONFIGS.docentes;
  if (redirect.startsWith("/dashboard") || redirect.startsWith("/courses") || redirect.startsWith("/ai-lab") || redirect.startsWith("/carreras")) return MODULE_CONFIGS.carreras;
  return DEFAULT_CONFIG;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Accept both ?module= and ?from= for module detection
  const moduleParam = searchParams.get("module") || searchParams.get("from");
  // Default landing por módulo (sobre todo para demo, que NO debe ir al dashboard general)
  const MODULE_HOME: Record<string, string> = {
    demo: "/demo/aula",
    preuni: "/preuni",
    bootcamp: "/bootcamp",
    "cursos-mdt": "/cursos-mdt",
    "cursos-pro": "/cursos-pro",
    certificaciones: "/certificaciones",
    b2b: "/b2b",
    docentes: "/docente",
    carreras: "/dashboard",
    cursos: "/dashboard",
  };
  const redirectTo =
    searchParams.get("redirect") ||
    (moduleParam && MODULE_HOME[moduleParam]) ||
    "/dashboard";
  const urlError = searchParams.get("error");

  // Determine which module to show
  const config = useMemo(() => {
    if (moduleParam && MODULE_CONFIGS[moduleParam]) return MODULE_CONFIGS[moduleParam];
    return detectModule(redirectTo);
  }, [redirectTo, moduleParam]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(urlError || "");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setLoading(false);
      if (authError.message === "Invalid login credentials") {
        setError("Credenciales incorrectas. Verifica tu email y contraseña.");
      } else if (authError.message === "Email not confirmed") {
        setError("Tu email no ha sido confirmado. Revisa tu bandeja de entrada.");
      } else {
        setError(authError.message);
      }
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen flex">
      {/* ============================================================ */}
      {/* LEFT PANEL — Module-specific spectacular branding */}
      {/* ============================================================ */}
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br ${config.gradientFrom} ${config.gradientVia} ${config.gradientTo}`}>
        {/* Animated background */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-[0.04]" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          {/* Floating orbs with module accent */}
          <div className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: config.accentHex, opacity: 0.06 }} />
          <div className="absolute bottom-1/4 right-1/6 w-56 h-56 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: config.accentHex, opacity: 0.04, animationDelay: "2s" }} />
          <div className="absolute top-2/3 left-1/3 w-40 h-40 rounded-full bg-white/[0.02] blur-2xl animate-pulse" style={{ animationDelay: "4s" }} />
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.01)_2px,rgba(255,255,255,0.01)_4px)]" />
        </div>

        <div className="relative z-10 max-w-lg px-10">
          {/* Badge */}
          <div className="mb-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase border"
              style={{ color: config.accentHex, borderColor: `${config.accentHex}33`, backgroundColor: `${config.accentHex}10` }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: config.accentHex }} />
              {config.badge}
            </span>
          </div>

          {/* Logo */}
          <a href="https://itseia.ai" className="flex items-center mb-8 no-underline group" target="_blank" rel="noopener">
            <img
              src="/logo_itseia.svg"
              alt="ITSEIA"
              className="h-8 w-auto transition-transform group-hover:scale-105"
            />
          </a>

          {/* Headline */}
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 font-[family-name:var(--font-space-grotesk)] leading-[1.1]">
            {config.headline.split("\n").map((line, i) => (
              <span key={i}>
                {i === 1 ? (
                  <span style={{ color: config.accentHex }}>{line}</span>
                ) : (
                  line
                )}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>

          <p className="text-lg text-white/70 mb-3 font-medium">
            {config.subheadline}
          </p>
          <p className="text-sm text-white/50 leading-relaxed mb-8">
            {config.description}
          </p>

          {/* Features */}
          <div className="space-y-3 mb-10">
            {config.features.map((feature, i) => {
              const FeatureIcon = feature.icon;
              return (
                <div key={i} className="flex items-start gap-3 group">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                    style={{ backgroundColor: `${config.accentHex}15` }}
                  >
                    <FeatureIcon className="w-4.5 h-4.5" style={{ color: config.accentHex }} />
                  </div>
                  <div>
                    <p className="text-sm text-white/80 font-medium">{feature.text}</p>
                    <p className="text-xs font-semibold" style={{ color: config.accentHex }}>
                      {feature.highlight}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {config.stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-xl p-4 text-center border transition-all hover:scale-105"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="text-2xl font-extrabold font-[family-name:var(--font-space-grotesk)]"
                  style={{ color: config.accentHex }}
                >
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Image placeholder area */}
          {/* PROMPT para generar imagen: {config.imagePrompt} */}
          <div
            className="mt-8 h-40 rounded-2xl border-2 border-dashed flex items-center justify-center opacity-30 hover:opacity-50 transition-opacity"
            style={{ borderColor: `${config.accentHex}30` }}
          >
            <p className="text-xs text-white/40 text-center px-8">
              Espacio para imagen del modulo
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT PANEL — Login form (same for all modules) */}
      {/* ============================================================ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile header — module-aware */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <img
              src="/logo_itseia.svg"
              alt="ITSEIA"
              className="h-10 w-auto mb-3"
            />
            <span className="text-xs text-muted-foreground mt-1">
              {config.subheadline}
            </span>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
              Iniciar sesión
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {config.cta}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-lg bg-coral/10 border border-coral/20 p-3 text-sm text-coral animate-fade-in">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                className="h-11 bg-secondary/50 border-border/60 placeholder:text-muted-foreground/50"
                style={{
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Contraseña
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs transition-colors"
                  style={{ color: config.accentHex }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 pr-10 bg-secondary/50 border-border/60 placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 font-semibold text-sm rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: config.accentHex,
                color: "#0A1628",
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              {loading ? "Ingresando..." : config.cta}
            </Button>
          </form>

          {/* Register link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              No tienes cuenta?{" "}
              <Link
                href="/register"
                className="font-medium transition-colors"
                style={{ color: config.accentHex }}
              >
                Registrate aqui
              </Link>
            </p>
          </div>

          {/* Module quick links */}
          <div className="mt-6 pt-6 border-t border-border/30">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-3 text-center">
              Otros accesos
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.values(MODULE_CONFIGS)
                .filter((m) => m.id !== config.id)
                .slice(0, 4)
                .map((m) => {
                  const MIcon = m.icon;
                  return (
                    <Link
                      key={m.id}
                      href={`/login?module=${m.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-muted-foreground hover:text-foreground transition-all border border-border/30 hover:border-border/60"
                    >
                      <MIcon className="w-3 h-3" />
                      {m.id === "b2b" ? "Empresas" : m.id === "cursos" ? "Cursos Pro" : m.id === "preuni" ? "Preuni" : m.id === "certificaciones" ? "Certificaciones" : m.id === "docentes" ? "Docentes" : "Carreras"}
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* Back to main site */}
          <div className="mt-6 text-center">
            <a
              href="https://itseia.ai"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <svg className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              Volver a itseia.ai
            </a>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground/40">
              &copy; {new Date().getFullYear()} ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
