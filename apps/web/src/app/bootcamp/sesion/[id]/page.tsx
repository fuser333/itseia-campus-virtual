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
  MessageCircle,
  Youtube,
} from "lucide-react";
import SlideViewer from "@/components/session/SlideViewer";
import AILabPanel from "@/components/session/AILabPanel";
import GrabacionesTab from "@/components/session/GrabacionesTab";
import {
  BOOTCAMP_MES1_SESIONES,
  BOOTCAMP_MES1_MODULOS,
} from "../../_data/mes1-data";
import type { SesionBootcamp } from "../../_data/mes1-data";

// ─── Las 8 pestañas de cada sesión ───────────────────────────────────────────

interface TabDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const SESSION_TABS: TabDef[] = [
  { id: "video",        label: "Video",         icon: <Play className="size-3.5" />,          color: "#73B8E7" },
  { id: "presentacion", label: "Presentación",  icon: <FileText className="size-3.5" />,      color: "#517CBE" },
  { id: "teoria",       label: "Teoría",        icon: <BookOpen className="size-3.5" />,      color: "#FBBC0C" },
  { id: "quiz",         label: "Quiz",          icon: <ClipboardList className="size-3.5" />, color: "#FBBC0C" },
  { id: "ejercicio",    label: "Ejercicio",     icon: <Pencil className="size-3.5" />,        color: "#F0846D" },
  { id: "ailab",        label: "AI Lab",        icon: <FlaskConical className="size-3.5" />,  color: "#73B8E7" },
  { id: "recursos",     label: "Recursos",      icon: <FolderOpen className="size-3.5" />,    color: "#517CBE" },
  { id: "grabaciones",  label: "Grabaciones",   icon: <Youtube className="size-3.5" />,       color: "#FBBC0C" },
];

// ─── Componente: contenido de sesión (formato Julio Cruz / Cursos MDT) ──────
// Tabs FUNCIONALES arriba: click cambia el contenido principal.
// Debajo de "MÁS CONTENIDO" hay acordeones con LAS OTRAS pestañas (no la activa).

function SesionContent({ sesionData, sesionId }: { sesionData: SesionBootcamp; sesionId: number }) {
  const [activeTab, setActiveTab] = useState<string>("video");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Video content ──
  const videoContent = (
    <div>
      <h4 className="text-sm font-bold text-[#F9F6E7] mb-1">{sesionData.videoTitulo}</h4>
      {sesionData.videoDuracion && (
        <p className="text-xs text-[#F9F6E7]/55 mb-3">{sesionData.videoDuracion}</p>
      )}
      {sesionData.videoEmbed ? (
        <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={sesionData.videoEmbed}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          className="rounded-xl border-2 border-dashed border-[#FBBC0C]/20 bg-[#1F2F58]/20 flex flex-col items-center justify-center text-center p-8"
          style={{ aspectRatio: "16/9" }}
        >
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#73B8E7]/15">
            <Play className="size-6 text-[#73B8E7]" />
          </div>
          <p className="text-sm font-semibold text-[#F9F6E7] mb-1">
            Video en producción
          </p>
          <p className="text-xs text-[#F9F6E7]/55 max-w-sm">
            Estamos grabando el video oficial de esta sesión. Mientras tanto, puedes avanzar con la
            presentación, la teoría y los ejercicios prácticos.
          </p>
        </div>
      )}
    </div>
  );

  // ── Presentación content ──
  // Preferido: presentación generada en Gamma (slidesUrl).
  // Fallback: slider inline con presentacionSlides.
  const presentacionContent = (() => {
    if (sesionData.slidesUrl) {
      return (
        <SlideViewer
          slidesUrl={sesionData.slidesUrl}
          slidesType="google_slides"
          title={`Presentación — ${sesionData.titulo}`}
        />
      );
    }
    const slides = sesionData.presentacionSlides;
    if (!slides || slides.length === 0) {
      // Fix 2 — fallback bonito cuando no hay presentación
      return (
        <div className="flex flex-col items-center gap-5 rounded-xl border border-[#FBBC0C]/25 bg-gradient-to-br from-[#1F2F58]/60 to-[#0A1628]/80 p-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#FBBC0C]/15">
            <FileText className="size-8 text-[#FBBC0C]" />
          </div>
          <div>
            <p className="font-semibold text-[#F9F6E7]">Presentación en preparación</p>
            <p className="mt-1.5 text-sm text-[#F9F6E7]/65 max-w-xs">
              Este contenido estará disponible próximamente. Mientras tanto, revisa la teoría y los ejercicios.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("teoria")}
            className="text-sm font-semibold text-[#73B8E7] hover:text-[#FBBC0C] transition-colors"
          >
            Ir a Teoría →
          </button>
        </div>
      );
    }
    const currentSlide = slides[slideIndex] ?? slides[0];
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#1F2F58]/50">{slides.length} slides (vista previa)</span>
          <span className="text-xs font-semibold text-[#517CBE] bg-[#517CBE]/10 px-2 py-0.5 rounded-full">
            {slideIndex + 1} / {slides.length}
          </span>
        </div>
        <div className="rounded-xl border-2 border-[#1F2F58]/10 bg-gradient-to-b from-[#F9F6E7]/60 to-white overflow-hidden">
          <div className="bg-[#1F2F58] px-5 py-3">
            <p className="text-xs font-semibold text-[#FBBC0C] tracking-wide uppercase">
              Slide {slideIndex + 1}
            </p>
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
            onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))}
            disabled={slideIndex === 0}
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
                  i === slideIndex ? "bg-[#FBBC0C] scale-125" : "bg-[#1F2F58]/15 hover:bg-[#1F2F58]/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setSlideIndex(Math.min(slides.length - 1, slideIndex + 1))}
            disabled={slideIndex === slides.length - 1}
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
    <div className="prose prose-sm prose-invert max-w-none text-[#F9F6E7] leading-relaxed whitespace-pre-line prose-headings:text-[#FBBC0C] prose-strong:text-[#FBBC0C] prose-a:text-[#73B8E7]">
      {sesionData.teoria}
    </div>
  );

  // ── Quiz content ──
  const quizContent = sesionData.quiz.length === 0 ? (
    <div className="flex flex-col items-center py-6 text-center">
      <Brain className="size-8 text-[#F9F6E7]/25 mb-2" />
      <p className="text-sm text-[#F9F6E7]/55">Quiz en preparación.</p>
    </div>
  ) : (
    <div>
      <p className="text-xs text-[#F9F6E7]/55 mb-4">{sesionData.quiz.length} preguntas</p>
      {sesionData.quiz.map((q, qi) => (
        <div key={qi} className="mb-5 p-4 rounded-lg bg-[#1F2F58]/30 border border-[#1F2F58]/40">
          <p className="text-sm font-semibold text-[#F9F6E7] mb-3">
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
                    ? "bg-green-900/40 border-green-500/60 text-green-300"
                    : isWrong
                    ? "bg-red-900/40 border-red-500/60 text-red-300"
                    : selected
                    ? "bg-[#FBBC0C]/15 border-[#FBBC0C]/60 text-[#FBBC0C]"
                    : "bg-[#1F2F58]/30 border-[#1F2F58]/50 text-[#F9F6E7] hover:bg-[#1F2F58]/50"
                }`}
              >
                {op}
              </button>
            );
          })}
          {showResults && (
            <p className="mt-2 text-xs text-[#F9F6E7]/55 italic">{q.explicacion}</p>
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
  const ejercicioContent = (
    <div>
      <p className="text-sm font-semibold text-[#FBBC0C] mb-1">
        {sesionData.ejercicio.titulo || "Ejercicio Práctico"}
      </p>
      <p className="text-sm text-[#F9F6E7]/75 mb-1">
        <strong className="text-[#F9F6E7]">Objetivo:</strong> {sesionData.ejercicio.objetivo}
      </p>
      <p className="text-sm text-[#F9F6E7]/75 mb-3">
        <strong className="text-[#F9F6E7]">Herramientas:</strong> {sesionData.ejercicio.herramientas}
      </p>
      {sesionData.ejercicio.datosEjemplo && (
        <div className="p-3 rounded-lg bg-[#73B8E7]/10 border border-[#73B8E7]/25 mb-4">
          <p className="text-xs font-semibold text-[#73B8E7] mb-1.5">Datos de ejemplo</p>
          <div className="text-xs text-[#F9F6E7]/70 whitespace-pre-line">
            {sesionData.ejercicio.datosEjemplo}
          </div>
        </div>
      )}
      {sesionData.ejercicio.pasos.length > 0 && (
        <>
          <p className="text-xs font-semibold text-[#F9F6E7] mb-2">Pasos a seguir:</p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            {sesionData.ejercicio.pasos.map((p, i) => (
              <li key={i} className="text-sm text-[#F9F6E7]/80">
                {p}
              </li>
            ))}
          </ol>
        </>
      )}
      {sesionData.ejercicio.resultado && (
        <div className="p-3 rounded-lg bg-[#FBBC0C]/10 border border-[#FBBC0C]/30 mb-4">
          <p className="text-xs font-semibold text-[#FBBC0C]">Resultado esperado:</p>
          <p className="text-xs text-[#F9F6E7]/80">{sesionData.ejercicio.resultado}</p>
        </div>
      )}
      {sesionData.ejercicio.criterios && sesionData.ejercicio.criterios.length > 0 && (
        <div className="p-3 rounded-lg bg-[#1F2F58]/40 border border-[#1F2F58]/50">
          <p className="text-xs font-semibold text-[#F9F6E7] mb-2">
            Criterios de evaluación (/100 puntos)
          </p>
          <div className="space-y-1.5">
            {sesionData.ejercicio.criterios.map((c, ci) => (
              <div key={ci} className="flex items-center justify-between">
                <span className="text-xs text-[#F9F6E7]/75">{c.criterio}</span>
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
  const sessionContext = `Bootcamp Intensivo de IA — Mes 1\nMódulo: ${sesionData.modulo}\nSesión: ${sesionData.titulo}\n\nTeoría:\n${sesionData.teoria}`;
  const ailabContent = (
    <div style={{ minHeight: "520px" }} className="flex flex-col">
      <AILabPanel
        sessionContext={sessionContext}
        suggestedPrompt={`Explícame con ejemplos prácticos el tema: "${sesionData.titulo}"`}
        sessionId={`bootcamp-mes1-${sesionData.id}`}
        sessionTitle={sesionData.titulo}
        className="flex-1"
      />
    </div>
  );

  // ── Recursos content ──
  const recursosContent = sesionData.recursos.length === 0 ? (
    <div className="flex flex-col items-center py-6 text-center">
      <FolderOpen className="size-8 text-[#F9F6E7]/25 mb-2" />
      <p className="text-sm text-[#F9F6E7]/55">Recursos en preparación.</p>
    </div>
  ) : (
    <div>
      <p className="text-xs text-[#F9F6E7]/50 mb-3">
        {sesionData.recursos.length} recursos seleccionados
      </p>
      {sesionData.recursos.map((r, ri) => (
        <a
          key={ri}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 mb-2 rounded-lg bg-[#1F2F58]/30 border border-[#1F2F58]/40 hover:border-[#73B8E7]/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                r.tipo === "documentacion"
                  ? "bg-[#73B8E7]/20 text-[#73B8E7]"
                  : r.tipo === "herramienta"
                  ? "bg-[#FBBC0C]/20 text-[#FBBC0C]"
                  : "bg-[#F0846D]/20 text-[#F0846D]"
              }`}
            >
              {r.tipo}
            </span>
            <span className="text-sm text-[#F9F6E7] font-medium group-hover:text-[#73B8E7] transition-colors">
              {r.titulo}
            </span>
          </div>
          {r.descripcion && (
            <p className="mt-1.5 ml-[calc(0.75rem+4px)] text-xs text-[#F9F6E7]/55 leading-relaxed">
              {r.descripcion}
            </p>
          )}
        </a>
      ))}
    </div>
  );

  // ── Grabaciones content ──
  // Para el bootcamp usamos "bootcamp-mes1-{id}" como sessionId compuesto
  // La tabla recordings filtra por session_id = este valor
  const grabacionesContent = (
    <GrabacionesTab
      sessionId={`bootcamp-mes1-${sesionId}`}
    />
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
    grabaciones: grabacionesContent,
  };

  // ── Las "otras" tabs (no la activa) van como acordeones abajo ──
  const otherTabs = SESSION_TABS.filter((t) => t.id !== activeTab);

  return (
    <div className="border border-[#1F2F58]/40 rounded-xl overflow-hidden bg-[#0D1B30]">
      {/* ── Tab bar — clic cambia el contenido principal ── */}
      <div className="flex overflow-x-auto border-b border-[#1F2F58]/40 bg-[#0A1628]/80">
        {SESSION_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? "border-[#FBBC0C] text-[#F9F6E7] bg-[#1F2F58]/30"
                  : "border-transparent text-[#F9F6E7]/45 hover:text-[#F9F6E7]/75 hover:bg-[#1F2F58]/20"
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
      <div className="flex items-center gap-3 px-5 py-2 bg-[#0A1628]/60 border-t border-[#1F2F58]/30">
        <div className="flex-1 border-t border-[#1F2F58]/30" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#F9F6E7]/25 select-none">
          Más contenido
        </span>
        <div className="flex-1 border-t border-[#1F2F58]/30" />
      </div>

      {/* ── Acordeones — las OTRAS pestañas (no la activa) ── */}
      {otherTabs.map((tab) => {
        const isOpen = expandedSections.has(tab.id);
        return (
          <div key={tab.id} className="border-t border-[#1F2F58]/30 first:border-t-0">
            <button
              onClick={() => toggleSection(tab.id)}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[#1F2F58]/20 transition-colors"
            >
              <span style={{ color: tab.color }} className="shrink-0">
                {tab.icon}
              </span>
              <span className="text-sm font-semibold text-[#F9F6E7] flex-1">{tab.label}</span>
              {isOpen ? (
                <ChevronUp className="size-4 text-[#F9F6E7]/30" />
              ) : (
                <ChevronDown className="size-4 text-[#F9F6E7]/30" />
              )}
            </button>
            {isOpen && <div className="px-5 pb-5">{contentMap[tab.id]}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page principal ───────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BootcampSesionPage({ params }: PageProps) {
  const { id } = use(params);

  const sesionId = Number.parseInt(id, 10);
  if (Number.isNaN(sesionId)) {
    notFound();
  }

  const sesion = BOOTCAMP_MES1_SESIONES.find((s) => s.id === sesionId);
  if (!sesion) {
    notFound();
  }

  const moduloInfo = BOOTCAMP_MES1_MODULOS.find((m) => m.num === sesion.moduloNum);
  // Posición de la sesión dentro de su módulo (1-indexed, sirve para "Sesión Y")
  const sesionesDelModulo = BOOTCAMP_MES1_SESIONES.filter(
    (s) => s.moduloNum === sesion.moduloNum
  );
  const posicionEnModulo = sesionesDelModulo.findIndex((s) => s.id === sesionId) + 1;
  const totalEnModulo = sesionesDelModulo.length;

  // Navegación previa / siguiente entre sesiones del Mes 1
  const idxGlobal = BOOTCAMP_MES1_SESIONES.findIndex((s) => s.id === sesionId);
  const sesionPrev = idxGlobal > 0 ? BOOTCAMP_MES1_SESIONES[idxGlobal - 1] : null;
  const sesionNext =
    idxGlobal < BOOTCAMP_MES1_SESIONES.length - 1
      ? BOOTCAMP_MES1_SESIONES[idxGlobal + 1]
      : null;

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-xs text-[#1F2F58]/50 flex-wrap">
        <Link
          href="/bootcamp"
          className="hover:text-[#1F2F58] transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="size-3" />
          Bootcamp
        </Link>
        <span>/</span>
        <span className="text-[#1F2F58]/70">Mes 1</span>
        <span>/</span>
        <span className="text-[#73B8E7] font-medium">
          M{sesion.moduloNum} · {moduloInfo?.nombre ?? sesion.modulo}
        </span>
        <span>/</span>
        <span className="text-[#0A1628] font-medium truncate max-w-[260px]">
          Sesión {posicionEnModulo}: {sesion.titulo}
        </span>
      </nav>

      {/* ── Header de la sesión ──────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex items-start gap-4">
          {/* Número badge */}
          <div className="hidden sm:flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#FBBC0C]/15">
            <span className="text-xl font-black text-[#FBBC0C] font-[family-name:var(--font-space-grotesk)]">
              {sesion.moduloNum}.{posicionEnModulo}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#73B8E7] uppercase tracking-wider">
                Mes 1 · Bootcamp Intensivo de IA
              </span>
              <span className="inline-flex rounded-md bg-[#FBBC0C]/15 px-2 py-0.5 text-[10px] font-bold text-[#FBBC0C]">
                Módulo {sesion.moduloNum}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-space-grotesk)]">
              {sesion.titulo}
            </h1>

            <p className="mt-2 text-sm text-white/70 max-w-2xl leading-relaxed">
              {moduloInfo?.nombre ?? sesion.modulo} · Sesión {posicionEnModulo} de {totalEnModulo}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                ~2 horas
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1">
                <BookOpen className="size-3" />8 pestañas
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span>Nivel: Intensivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenido (8 pestañas) ───────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F9F6E7] font-[family-name:var(--font-space-grotesk)]">
            Contenido de la sesión
          </h2>
          <span className="text-xs text-[#F9F6E7]/40">
            Haz clic en una pestaña para cambiar la vista principal
          </span>
        </div>
        <SesionContent sesionData={sesion} sesionId={sesionId} />
      </section>

      {/* ── Navegación previa / siguiente ────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-2">
        {sesionPrev ? (
          <Link
            href={`/bootcamp/sesion/${sesionPrev.id}`}
            className="group flex items-center gap-3 rounded-xl border border-[#1F2F58]/[0.08] bg-white p-4 transition-all hover:border-[#73B8E7]/40 hover:shadow-sm"
          >
            <ArrowLeft className="size-4 text-[#1F2F58]/40 group-hover:-translate-x-0.5 group-hover:text-[#73B8E7] transition-all shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#1F2F58]/40">
                Sesión anterior
              </p>
              <p className="text-sm font-semibold text-[#0A1628] truncate">
                {sesionPrev.titulo}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {sesionNext ? (
          <Link
            href={`/bootcamp/sesion/${sesionNext.id}`}
            className="group flex items-center justify-end gap-3 rounded-xl border border-[#1F2F58]/[0.08] bg-white p-4 text-right transition-all hover:border-[#73B8E7]/40 hover:shadow-sm"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#1F2F58]/40">
                Sesión siguiente
              </p>
              <p className="text-sm font-semibold text-[#0A1628] truncate">
                {sesionNext.titulo}
              </p>
            </div>
            <ChevronDown className="size-4 -rotate-90 text-[#1F2F58]/40 group-hover:translate-x-0.5 group-hover:text-[#73B8E7] transition-all shrink-0" />
          </Link>
        ) : (
          <div />
        )}
      </section>

      {/* ── CTA WhatsApp ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6">
        <div>
          <p className="text-sm font-bold text-white">¿Dudas con esta sesión?</p>
          <p className="text-xs text-white/60 mt-0.5">
            Escríbenos por WhatsApp y un instructor te apoya en minutos.
          </p>
        </div>
        <a
          href={`https://wa.me/593959892034?text=Hola%2C%20tengo%20dudas%20con%20la%20sesi%C3%B3n%20${sesion.id}%20del%20Bootcamp%20ITSEIA`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#FBBC0C] px-5 py-2.5 text-sm font-bold text-[#0A1628] transition-colors hover:bg-[#f5b300] shrink-0"
        >
          <MessageCircle className="size-4" />
          Contactar instructor
        </a>
      </div>
    </div>
  );
}
