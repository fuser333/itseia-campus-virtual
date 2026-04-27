"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Play,
  FileText,
  Brain,
  ClipboardList,
  Pencil,
  FlaskConical,
  FolderOpen,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import SlideViewer from "@/components/session/SlideViewer";
import {
  STEVEEN_TEMAS,
  STEVEEN_MODULOS,
  type TemaProSteveen,
} from "../_data/steveen-data";

// ─── Catálogo Cursos Pro ─────────────────────────────────────────────────────
// Hoy publicamos un solo curso ($197). Más cursos se sumarán cuando se produzcan.

interface CursoProMeta {
  slug: string;
  titulo: string;
  cursoLabel: string;
  precio: string;
  categoria: string;
  descripcion: string;
  horas: number;
  modulos: typeof STEVEEN_MODULOS;
  temas: TemaProSteveen[];
}

const CURSOS_PRO_META: Record<string, CursoProMeta> = {
  "steveen-pinchao": {
    slug: "steveen-pinchao",
    titulo: "IA Aplicada para Ingeniería Industrial",
    cursoLabel: "PRO",
    precio: "$197",
    categoria: "Ingeniería Industrial",
    descripcion:
      "Domina ChatGPT, Claude y Copilot Excel aplicados a producción, mantenimiento predictivo, control de calidad y cadena de suministro. 8 módulos · 40 temas · 60 horas.",
    horas: 60,
    modulos: STEVEEN_MODULOS,
    temas: STEVEEN_TEMAS,
  },
  // Alias por si alguien usa solo "steveen"
  steveen: {
    slug: "steveen-pinchao",
    titulo: "IA Aplicada para Ingeniería Industrial",
    cursoLabel: "PRO",
    precio: "$197",
    categoria: "Ingeniería Industrial",
    descripcion:
      "Domina ChatGPT, Claude y Copilot Excel aplicados a producción, mantenimiento predictivo, control de calidad y cadena de suministro. 8 módulos · 40 temas · 60 horas.",
    horas: 60,
    modulos: STEVEEN_MODULOS,
    temas: STEVEEN_TEMAS,
  },
};

// ─── Las 7 pestañas de cada sesión ───────────────────────────────────────────

interface TabDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const SESSION_TABS: TabDef[] = [
  { id: "video",        label: "Video",         icon: <Play className="size-3.5" />,          color: "#73B8E7" },
  { id: "presentacion", label: "Presentación",  icon: <FileText className="size-3.5" />,      color: "#517CBE" },
  { id: "teoria",       label: "Teoría",        icon: <BookOpen className="size-3.5" />,      color: "#1F2F58" },
  { id: "quiz",         label: "Quiz",          icon: <ClipboardList className="size-3.5" />, color: "#FBBC0C" },
  { id: "ejercicio",    label: "Ejercicio",     icon: <Pencil className="size-3.5" />,        color: "#F0846D" },
  { id: "ailab",        label: "AI Lab",        icon: <FlaskConical className="size-3.5" />,  color: "#73B8E7" },
  { id: "recursos",     label: "Recursos",      icon: <FolderOpen className="size-3.5" />,    color: "#517CBE" },
];

// ─── Componente: contenido de sesión (formato Julio Cruz) ───────────────────
// Tab principal arriba muestra el contenido activo. Debajo de "MÁS CONTENIDO"
// aparecen acordeones con LAS OTRAS pestañas (no la activa). Mismo patrón que
// cursos-mdt — el estudiante puede ver Video grande arriba Y expandir Teoría/
// Quiz debajo sin perder el video.

function SesionContent({ temaData }: { temaData?: TemaProSteveen }) {
  const [activeTab, setActiveTab] = useState<string>("video");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  // Un tema tiene contenido si tiene video, slidesUrl con valor, o teoría real
  const hasContent =
    !!temaData &&
    (temaData.videoEmbed !== "" ||
      (temaData.slidesUrl && temaData.slidesUrl !== "") ||
      (temaData.teoria && temaData.teoria !== "Contenido en desarrollo — disponible próximamente."));

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!hasContent || !temaData) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#1F2F58]/5">
          <Brain className="size-6 text-[#1F2F58]/20" />
        </div>
        <p className="text-sm font-semibold text-[#0A1628]">Contenido próximamente</p>
        <p className="mt-1 text-xs text-[#1F2F58]/50 max-w-sm">
          Este tema está en producción. Te avisaremos por WhatsApp cuando esté disponible.
        </p>
      </div>
    );
  }

  // ── Video content ──
  const videoContent = (
    <div>
      <h4 className="text-sm font-bold text-[#0A1628] mb-1">{temaData.videoTitulo}</h4>
      {temaData.videoDuracion && (
        <p className="text-xs text-[#1F2F58]/50 mb-3">{temaData.videoDuracion}</p>
      )}
      {temaData.videoEmbed ? (
        <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={temaData.videoEmbed}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          className="rounded-xl border-2 border-dashed border-[#1F2F58]/15 bg-[#F9F6E7]/40 flex flex-col items-center justify-center text-center px-4"
          style={{ aspectRatio: "16/9" }}
        >
          <Play className="size-8 text-[#1F2F58]/20 mb-2" />
          <p className="text-sm font-semibold text-[#0A1628]">Video en producción</p>
          <p className="mt-1 text-xs text-[#1F2F58]/50 max-w-sm">
            Mientras tanto puedes avanzar con la teoría, presentación y ejercicio.
          </p>
        </div>
      )}
    </div>
  );

  // ── Presentación content ──
  // Preferido: presentación generada en Gamma (slidesUrl).
  // Fallback: slider inline con presentacionSlides (sin Gamma).
  const presentacionContent = (() => {
    if (temaData.slidesUrl && temaData.slidesUrl !== "") {
      return (
        <SlideViewer
          slidesUrl={temaData.slidesUrl}
          slidesType="google_slides"
          title={`Presentación — ${temaData.titulo}`}
        />
      );
    }
    const slides = temaData.presentacionSlides;
    if (!slides || slides.length === 0) {
      return <p className="text-sm text-[#1F2F58]/50">Presentación próximamente</p>;
    }
    const safeIndex = Math.min(slideIndex, slides.length - 1);
    const currentSlide = slides[safeIndex] ?? slides[0];
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#1F2F58]/50">{slides.length} slides (vista previa)</span>
          <span className="text-xs font-semibold text-[#517CBE] bg-[#517CBE]/10 px-2 py-0.5 rounded-full">
            {safeIndex + 1} / {slides.length}
          </span>
        </div>
        <div className="rounded-xl border-2 border-[#1F2F58]/10 bg-gradient-to-b from-[#F9F6E7]/60 to-white overflow-hidden">
          <div className="bg-[#1F2F58] px-5 py-3">
            <p className="text-xs font-semibold text-[#FBBC0C] tracking-wide uppercase">Slide {safeIndex + 1}</p>
            <h5 className="text-base font-bold text-white mt-0.5">{currentSlide.titulo}</h5>
          </div>
          <div className="px-5 py-4">
            <div className="text-sm text-[#1F2F58] leading-relaxed whitespace-pre-line">
              {currentSlide.contenido}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setSlideIndex(Math.max(0, safeIndex - 1))}
            disabled={safeIndex === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#1F2F58]/5 text-[#1F2F58] hover:bg-[#1F2F58]/10"
          >
            <ChevronUp className="size-3.5 -rotate-90" /> Anterior
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`size-2 rounded-full transition-all ${
                  i === safeIndex ? "bg-[#FBBC0C] scale-125" : "bg-[#1F2F58]/15 hover:bg-[#1F2F58]/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setSlideIndex(Math.min(slides.length - 1, safeIndex + 1))}
            disabled={safeIndex === slides.length - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#FBBC0C]/10 text-[#0A1628] hover:bg-[#FBBC0C]/20"
          >
            Siguiente <ChevronDown className="size-3.5 -rotate-90" />
          </button>
        </div>
      </div>
    );
  })();

  // ── Teoría content ──
  const teoriaContent = (
    <div className="prose prose-sm max-w-none text-[#1F2F58] leading-relaxed whitespace-pre-line">
      {temaData.teoria}
    </div>
  );

  // ── Quiz content ──
  const quizContent =
    temaData.quiz.length === 0 ? (
      <p className="text-sm text-[#1F2F58]/50">Quiz próximamente</p>
    ) : (
      <div>
        <p className="text-xs text-[#1F2F58]/50 mb-4">{temaData.quiz.length} preguntas</p>
        {temaData.quiz.map((q, qi) => (
          <div key={qi} className="mb-5 p-4 rounded-lg bg-[#F9F6E7]/80 border border-[#1F2F58]/10">
            <p className="text-sm font-semibold text-[#0A1628] mb-3">
              {qi + 1}. {q.pregunta}
            </p>
            {q.opciones.map((op, oi) => {
              const selected = quizAnswers[qi] === oi;
              const isCorrect = showResults && oi === q.respuesta;
              const isWrong = showResults && selected && oi !== q.respuesta;
              return (
                <button
                  key={oi}
                  onClick={() => setQuizAnswers((prev) => ({ ...prev, [qi]: oi }))}
                  className={`block w-full text-left px-3 py-2 mb-1.5 rounded-lg text-sm transition-all border ${
                    isCorrect
                      ? "bg-green-50 border-green-400 text-green-800"
                      : isWrong
                      ? "bg-red-50 border-red-400 text-red-800"
                      : selected
                      ? "bg-[#FBBC0C]/10 border-[#FBBC0C] text-[#0A1628]"
                      : "bg-white border-[#1F2F58]/10 text-[#1F2F58] hover:bg-[#F9F6E7]"
                  }`}
                >
                  {op}
                </button>
              );
            })}
            {showResults && (
              <p className="mt-2 text-xs text-[#1F2F58]/60 italic">{q.explicacion}</p>
            )}
          </div>
        ))}
        <button
          onClick={() => setShowResults(!showResults)}
          className="bg-[#FBBC0C] text-[#0A1628] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#E5AB00]"
        >
          {showResults ? "Ocultar respuestas" : "Ver respuestas"}
        </button>
      </div>
    );

  // ── Ejercicio content ──
  const ejercicioContent =
    temaData.ejercicio.pasos.length === 0 ? (
      <p className="text-sm text-[#1F2F58]/50">Ejercicio próximamente</p>
    ) : (
      <div>
        <p className="text-sm font-semibold text-[#0A1628] mb-1">
          {temaData.ejercicio.titulo || "Ejercicio Práctico"}
        </p>
        <p className="text-sm text-[#1F2F58]/70 mb-1">
          <strong>Objetivo:</strong> {temaData.ejercicio.objetivo}
        </p>
        <p className="text-sm text-[#1F2F58]/70 mb-3">
          <strong>Herramientas:</strong> {temaData.ejercicio.herramientas}
        </p>
        {temaData.ejercicio.datosEjemplo && (
          <div className="p-3 rounded-lg bg-[#73B8E7]/5 border border-[#73B8E7]/20 mb-4">
            <p className="text-xs font-semibold text-[#517CBE] mb-1.5">Datos de ejemplo</p>
            <div className="text-xs text-[#1F2F58]/70 whitespace-pre-line">
              {temaData.ejercicio.datosEjemplo}
            </div>
          </div>
        )}
        <p className="text-xs font-semibold text-[#0A1628] mb-2">Pasos a seguir:</p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          {temaData.ejercicio.pasos.map((p, i) => (
            <li key={i} className="text-sm text-[#1F2F58]">
              {p}
            </li>
          ))}
        </ol>
        <div className="p-3 rounded-lg bg-[#FBBC0C]/10 border border-[#FBBC0C]/30 mb-4">
          <p className="text-xs font-semibold text-[#0A1628]">Resultado esperado:</p>
          <p className="text-xs text-[#1F2F58]">{temaData.ejercicio.resultado}</p>
        </div>
        {temaData.ejercicio.criterios && temaData.ejercicio.criterios.length > 0 && (
          <div className="p-3 rounded-lg bg-[#1F2F58]/[0.03] border border-[#1F2F58]/10">
            <p className="text-xs font-semibold text-[#0A1628] mb-2">
              Criterios de evaluación (/100 puntos)
            </p>
            <div className="space-y-1.5">
              {temaData.ejercicio.criterios.map((c, ci) => (
                <div key={ci} className="flex items-center justify-between">
                  <span className="text-xs text-[#1F2F58]">{c.criterio}</span>
                  <span className="text-xs font-bold text-[#FBBC0C] ml-2 shrink-0">
                    {c.puntos} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

  // ── AI Lab content ──
  const ailabContent = (
    <div className="text-center py-4">
      <FlaskConical className="size-8 text-[#73B8E7] mx-auto mb-2" />
      <p className="text-sm text-[#1F2F58]/60 mb-3">
        Practica con IA en vivo — ChatGPT, Claude y Gemini incluidos.
      </p>
      <Link
        href="/ai-lab"
        className="inline-flex items-center gap-2 bg-[#73B8E7] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#5BA0D0]"
      >
        Abrir AI Lab
      </Link>
    </div>
  );

  // ── Recursos content ──
  const recursosContent =
    temaData.recursos.length === 0 ? (
      <p className="text-sm text-[#1F2F58]/50">Recursos próximamente</p>
    ) : (
      <div>
        <p className="text-xs text-[#1F2F58]/50 mb-3">
          {temaData.recursos.length} recursos seleccionados
        </p>
        {temaData.recursos.map((r, ri) => (
          <a
            key={ri}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 mb-2 rounded-lg bg-white border border-[#1F2F58]/10 hover:border-[#73B8E7]/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  r.tipo === "documentacion"
                    ? "bg-[#73B8E7]/10 text-[#73B8E7]"
                    : r.tipo === "herramienta"
                    ? "bg-[#FBBC0C]/10 text-[#0A1628]"
                    : "bg-[#F0846D]/10 text-[#F0846D]"
                }`}
              >
                {r.tipo}
              </span>
              <span className="text-sm text-[#1F2F58] font-medium group-hover:text-[#517CBE] transition-colors">
                {r.titulo}
              </span>
            </div>
            {r.descripcion && (
              <p className="mt-1.5 ml-[calc(0.75rem+4px)] text-xs text-[#1F2F58]/50 leading-relaxed">
                {r.descripcion}
              </p>
            )}
          </a>
        ))}
      </div>
    );

  // ── Mapa de contenidos por tab id ──
  const contentMap: Record<string, React.ReactNode> = {
    video: videoContent,
    presentacion: presentacionContent,
    teoria: teoriaContent,
    quiz: quizContent,
    ejercicio: ejercicioContent,
    ailab: ailabContent,
    recursos: recursosContent,
  };

  // ── Las "otras" tabs (no la activa) van como acordeones abajo ──
  const otherTabs = SESSION_TABS.filter((t) => t.id !== activeTab);

  return (
    <div className="mt-3 border border-[#1F2F58]/10 rounded-xl overflow-hidden bg-white">
      {/* ── Tab bar — clic cambia el contenido principal ── */}
      <div className="flex overflow-x-auto border-b border-[#1F2F58]/10 bg-[#F9F6E7]/60">
        {SESSION_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? "border-[#FBBC0C] text-[#0A1628] bg-white"
                  : "border-transparent text-[#1F2F58]/50 hover:text-[#1F2F58]/80 hover:bg-white/60"
              }`}
            >
              <span style={{ color: isActive ? tab.color : undefined }}>{tab.icon}</span>
              {tab.label}
              <span className="size-1.5 rounded-full bg-green-400" />
            </button>
          );
        })}
      </div>

      {/* ── Contenido principal — corresponde a la pestaña activa ── */}
      <div className="p-5">{contentMap[activeTab]}</div>

      {/* ── MÁS CONTENIDO divider ── */}
      <div className="flex items-center gap-3 px-5 py-2 bg-[#F9F6E7]/40 border-t border-[#1F2F58]/8">
        <div className="flex-1 border-t border-[#1F2F58]/8" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#1F2F58]/30 select-none">
          Más contenido
        </span>
        <div className="flex-1 border-t border-[#1F2F58]/8" />
      </div>

      {/* ── Acordeones — las OTRAS pestañas (no la activa) ── */}
      {otherTabs.map((tab) => {
        const isOpen = expandedSections.has(tab.id);
        return (
          <div key={tab.id} className="border-t border-[#1F2F58]/8 first:border-t-0">
            <button
              onClick={() => toggleSection(tab.id)}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[#F9F6E7]/40 transition-colors"
            >
              <span style={{ color: tab.color }} className="shrink-0">
                {tab.icon}
              </span>
              <span className="text-sm font-semibold text-[#0A1628] flex-1">{tab.label}</span>
              {isOpen ? (
                <ChevronUp className="size-4 text-[#1F2F58]/30" />
              ) : (
                <ChevronDown className="size-4 text-[#1F2F58]/30" />
              )}
            </button>
            {isOpen && <div className="px-5 pb-5">{contentMap[tab.id]}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Componente: card de sesión con accordion ─────────────────────────────────

function SesionCard({
  numero,
  titulo,
  isExpanded,
  onToggle,
  temaData,
  sesionLabel,
}: {
  numero: number;
  titulo: string;
  isExpanded: boolean;
  onToggle: () => void;
  temaData?: TemaProSteveen;
  sesionLabel?: string;
}) {
  return (
    <div
      className={`rounded-xl border transition-all ${
        isExpanded
          ? "border-[#73B8E7]/40 bg-[#F9F6E7]/60 shadow-sm"
          : "border-[#1F2F58]/8 bg-white hover:border-[#73B8E7]/30 hover:shadow-sm"
      }`}
    >
      {/* Header — clickable */}
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-4 text-left">
        {/* Number badge */}
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
            isExpanded ? "bg-[#1F2F58] text-white" : "bg-[#1F2F58]/5"
          }`}
        >
          {isExpanded ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <span className="text-sm font-bold text-[#1F2F58]/60 font-[family-name:var(--font-space-grotesk)]">
              {numero}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#0A1628] leading-snug">{titulo}</h3>
          {!isExpanded && (
            <p className="mt-0.5 text-[10px] text-[#1F2F58]/40">
              Video · Presentación · Teoría · Quiz · Ejercicio · AI Lab · Recursos
            </p>
          )}
          {sesionLabel && !isExpanded && (
            <p className="mt-0.5 text-[10px] text-[#73B8E7] font-medium">{sesionLabel}</p>
          )}
        </div>

        {/* Chevron */}
        <div className="shrink-0 text-[#1F2F58]/30">
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <SesionContent temaData={temaData} />
        </div>
      )}
    </div>
  );
}

// ─── Page principal ───────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CursoProPage({ params }: PageProps) {
  const { slug } = use(params);

  // Validar slug
  const meta = CURSOS_PRO_META[slug];
  if (!meta) {
    notFound();
  }

  // Estado: qué tema está expandido (null = ninguno)
  const [expandedTema, setExpandedTema] = useState<number | null>(null);
  // Estado: qué módulos están expandidos (por defecto el M1)
  const [expandedModulos, setExpandedModulos] = useState<Set<number>>(new Set([1]));

  function toggleTema(num: number) {
    setExpandedTema((prev) => (prev === num ? null : num));
  }

  function toggleModulo(num: number) {
    setExpandedModulos((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }

  const temas = meta.temas;
  const modulos = meta.modulos;

  // Buscar en qué módulo está el tema expandido (para breadcrumb)
  const temaExpandido = expandedTema ? temas.find((t) => t.id === expandedTema) : null;
  const moduloExpandidoInfo = temaExpandido
    ? modulos.find((m) => m.num === temaExpandido.moduloNum)
    : null;

  return (
    <div className="space-y-8">

      {/* ── Breadcrumb (con contexto de módulo) ─────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-xs text-[#1F2F58]/50 flex-wrap">
        <Link
          href="/cursos-pro"
          className="hover:text-[#1F2F58] transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="size-3" />
          Cursos Pro
        </Link>
        <span>/</span>
        {moduloExpandidoInfo ? (
          <>
            <button
              onClick={() => setExpandedTema(null)}
              className="hover:text-[#1F2F58] transition-colors"
            >
              {meta.titulo}
            </button>
            <span>/</span>
            <span className="text-[#73B8E7] font-medium">M{moduloExpandidoInfo.num}</span>
            <span>/</span>
            <span className="text-[#0A1628] font-medium truncate max-w-[200px]">
              {temaExpandido?.titulo}
            </span>
          </>
        ) : (
          <span className="text-[#0A1628] font-medium">{meta.titulo}</span>
        )}
      </nav>

      {/* ── Header del curso ─────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex items-start gap-4">
          {/* Badge */}
          <div className="hidden sm:flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#FBBC0C]/15">
            <span className="text-base font-black text-[#FBBC0C] font-[family-name:var(--font-space-grotesk)]">
              {meta.cursoLabel}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#73B8E7] uppercase tracking-wider">
                {meta.categoria}
              </span>
              <span className="inline-flex rounded-md bg-[#FBBC0C]/15 px-2 py-0.5 text-[10px] font-bold text-[#FBBC0C]">
                {meta.precio}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-space-grotesk)]">
              {meta.titulo}
            </h1>

            <p className="mt-2 text-sm text-white/70 max-w-xl leading-relaxed">
              {meta.descripcion}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {meta.horas} horas
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1">
                <BookOpen className="size-3" />
                {temas.length} temas · {modulos.length} módulos
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span>Nivel: Profesional</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenido del curso (módulos colapsables) ──────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
            Contenido del curso ({temas.length} temas · {modulos.length} módulos)
          </h2>
          <span className="text-xs text-[#1F2F58]/40 hidden sm:inline">
            Haz clic en un tema para ver las 7 pestañas
          </span>
        </div>

        <div className="space-y-4">
          {modulos.map((modulo) => {
            const isModuloOpen = expandedModulos.has(modulo.num);
            const temasDelModulo = temas.filter((t) => t.moduloNum === modulo.num);
            const temasDisponibles = temasDelModulo.filter(
              (t) =>
                t.videoEmbed !== "" ||
                (t.slidesUrl && t.slidesUrl !== "") ||
                (t.teoria &&
                  t.teoria !== "Contenido en desarrollo — disponible próximamente."),
            ).length;

            return (
              <div
                key={modulo.num}
                className="rounded-2xl border border-[#1F2F58]/10 overflow-hidden bg-white"
              >
                {/* ── Header del módulo ── */}
                <button
                  onClick={() => toggleModulo(modulo.num)}
                  className="w-full flex items-center gap-4 p-4 sm:p-5 text-left bg-gradient-to-r from-[#F9F6E7]/60 to-white hover:from-[#F9F6E7] transition-all"
                >
                  {/* Badge M1, M2... */}
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isModuloOpen ? "bg-[#1F2F58] text-white" : "bg-[#1F2F58]/5"
                    }`}
                  >
                    <span
                      className={`text-sm font-black font-[family-name:var(--font-space-grotesk)] ${
                        isModuloOpen ? "text-[#FBBC0C]" : "text-[#1F2F58]/50"
                      }`}
                    >
                      M{modulo.num}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-[#0A1628] leading-snug">
                      {modulo.nombre}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#1F2F58]/40">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {modulo.horas}h
                      </span>
                      <span className="size-0.5 rounded-full bg-[#1F2F58]/20" />
                      <span>{modulo.temas} temas × 1.5h</span>
                      <span className="size-0.5 rounded-full bg-[#1F2F58]/20" />
                      <span
                        className={
                          temasDisponibles === modulo.temas
                            ? "text-green-500 font-semibold"
                            : ""
                        }
                      >
                        {temasDisponibles}/{modulo.temas} disponibles
                      </span>
                    </div>
                  </div>

                  {/* Progress bar mini */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <div className="w-16 h-1.5 rounded-full bg-[#1F2F58]/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#FBBC0C] transition-all"
                        style={{
                          width: `${(temasDisponibles / modulo.temas) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="shrink-0 text-[#1F2F58]/30">
                    {isModuloOpen ? (
                      <ChevronUp className="size-5" />
                    ) : (
                      <ChevronDown className="size-5" />
                    )}
                  </div>
                </button>

                {/* ── Temas del módulo ── */}
                {isModuloOpen && (
                  <div className="px-4 pb-4 space-y-2">
                    {temasDelModulo.map((tema, idx) => (
                      <SesionCard
                        key={tema.id}
                        numero={tema.id}
                        titulo={tema.titulo}
                        isExpanded={expandedTema === tema.id}
                        onToggle={() => toggleTema(tema.id)}
                        temaData={tema}
                        sesionLabel={`Sesión ${idx + 1} de ${modulo.temas}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA WhatsApp ─────────────────────────────────────────────────── */}
      <section className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6">
        <div>
          <p className="text-sm font-bold text-white">
            ¿Preguntas sobre el curso o pago?
          </p>
          <p className="text-xs text-white/60 mt-0.5">
            Escríbenos por WhatsApp y te asesoramos sin compromiso.
          </p>
        </div>
        <a
          href="https://wa.me/593959892034?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20el%20curso%20IA%20Aplicada%20para%20Ingenier%C3%ADa%20Industrial"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#FBBC0C] px-5 py-2.5 text-sm font-bold text-[#0A1628] transition-colors hover:bg-[#f5b300] shrink-0"
        >
          <MessageCircle className="size-4" />
          Contactar por WhatsApp
        </a>
      </section>
    </div>
  );
}
