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
  Youtube,
} from "lucide-react";
import SlideViewer from "@/components/session/SlideViewer";
import GrabacionesTab from "@/components/session/GrabacionesTab";
import {
  STEVEEN_TEMAS,
  STEVEEN_MODULOS,
  type TemaProSteveen,
} from "../_data/steveen-data";

// ─── Catálogo Cursos Pro ─────────────────────────────────────────────────────

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

// ─── Componente: contenido de sesión ────────────────────────────────────────

function SesionContent({ temaData, slug }: { temaData?: TemaProSteveen; slug: string }) {
  const [activeTab, setActiveTab] = useState<string>("video");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

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

  // ── Fix 1 — estado vacío dark theme ──
  if (!hasContent || !temaData) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#1F2F58]/30">
          <Brain className="size-6 text-[#F9F6E7]/25" />
        </div>
        <p className="text-sm font-semibold text-[#F9F6E7]">Contenido próximamente</p>
        <p className="mt-1 text-xs text-[#F9F6E7]/55 max-w-sm">
          Este tema está en producción. Te avisaremos por WhatsApp cuando esté disponible.
        </p>
      </div>
    );
  }

  // ── Video content ──
  const videoContent = (
    <div>
      <h4 className="text-sm font-bold text-[#F9F6E7] mb-1">{temaData.videoTitulo}</h4>
      {temaData.videoDuracion && (
        <p className="text-xs text-[#F9F6E7]/55 mb-3">{temaData.videoDuracion}</p>
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
          className="rounded-xl border border-dashed border-[#FBBC0C]/20 bg-[#1F2F58]/20 flex flex-col items-center justify-center text-center px-4"
          style={{ aspectRatio: "16/9" }}
        >
          <Play className="size-8 text-[#F9F6E7]/20 mb-2" />
          <p className="text-sm font-semibold text-[#F9F6E7]">Video en producción</p>
          <p className="mt-1 text-xs text-[#F9F6E7]/55 max-w-sm">
            Mientras tanto puedes avanzar con la teoría, presentación y ejercicio.
          </p>
        </div>
      )}
    </div>
  );

  // ── Fix 2 — Presentación con fallback dark ──
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
    const safeIndex = Math.min(slideIndex, slides.length - 1);
    const currentSlide = slides[safeIndex] ?? slides[0];
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#F9F6E7]/50">{slides.length} slides (vista previa)</span>
          <span className="text-xs font-semibold text-[#73B8E7] bg-[#73B8E7]/15 px-2 py-0.5 rounded-full">
            {safeIndex + 1} / {slides.length}
          </span>
        </div>
        <div className="rounded-xl border border-[#1F2F58]/50 bg-[#0D1B30] overflow-hidden">
          <div className="bg-[#1F2F58] px-5 py-3">
            <p className="text-xs font-semibold text-[#FBBC0C] tracking-wide uppercase">Slide {safeIndex + 1}</p>
            <h5 className="text-base font-bold text-white mt-0.5">{currentSlide.titulo}</h5>
          </div>
          <div className="px-5 py-4">
            <div className="text-sm text-[#F9F6E7]/85 leading-relaxed whitespace-pre-line">
              {currentSlide.contenido}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setSlideIndex(Math.max(0, safeIndex - 1))}
            disabled={safeIndex === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#1F2F58]/30 text-[#F9F6E7] hover:bg-[#1F2F58]/50"
          >
            <ChevronUp className="size-3.5 -rotate-90" /> Anterior
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`size-2 rounded-full transition-all ${
                  i === safeIndex ? "bg-[#FBBC0C] scale-125" : "bg-[#F9F6E7]/15 hover:bg-[#F9F6E7]/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setSlideIndex(Math.min(slides.length - 1, safeIndex + 1))}
            disabled={safeIndex === slides.length - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#FBBC0C]/15 text-[#FBBC0C] hover:bg-[#FBBC0C]/25"
          >
            Siguiente <ChevronDown className="size-3.5 -rotate-90" />
          </button>
        </div>
      </div>
    );
  })();

  // ── Fix 1 — Teoría dark theme ──
  const teoriaContent = (
    <div className="prose prose-sm prose-invert max-w-none text-[#F9F6E7] leading-relaxed whitespace-pre-line prose-headings:text-[#FBBC0C] prose-strong:text-[#FBBC0C] prose-a:text-[#73B8E7]">
      {temaData.teoria}
    </div>
  );

  // ── Fix 1 — Quiz dark theme ──
  const quizContent =
    temaData.quiz.length === 0 ? (
      <div className="flex flex-col items-center py-6 text-center">
        <ClipboardList className="size-7 text-[#F9F6E7]/25 mb-2" />
        <p className="text-sm text-[#F9F6E7]/55">Quiz próximamente</p>
      </div>
    ) : (
      <div>
        <p className="text-xs text-[#F9F6E7]/55 mb-4">{temaData.quiz.length} preguntas</p>
        {temaData.quiz.map((q, qi) => (
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

  // ── Fix 1 — Ejercicio dark theme ──
  const ejercicioContent =
    temaData.ejercicio.pasos.length === 0 ? (
      <div className="flex flex-col items-center py-6 text-center">
        <Pencil className="size-7 text-[#F9F6E7]/25 mb-2" />
        <p className="text-sm text-[#F9F6E7]/55">Ejercicio próximamente</p>
      </div>
    ) : (
      <div>
        <p className="text-sm font-semibold text-[#FBBC0C] mb-1">
          {temaData.ejercicio.titulo || "Ejercicio Práctico"}
        </p>
        <p className="text-sm text-[#F9F6E7]/75 mb-1">
          <strong className="text-[#F9F6E7]">Objetivo:</strong> {temaData.ejercicio.objetivo}
        </p>
        <p className="text-sm text-[#F9F6E7]/75 mb-3">
          <strong className="text-[#F9F6E7]">Herramientas:</strong> {temaData.ejercicio.herramientas}
        </p>
        {temaData.ejercicio.datosEjemplo && (
          <div className="p-3 rounded-lg bg-[#73B8E7]/10 border border-[#73B8E7]/25 mb-4">
            <p className="text-xs font-semibold text-[#73B8E7] mb-1.5">Datos de ejemplo</p>
            <div className="text-xs text-[#F9F6E7]/70 whitespace-pre-line">
              {temaData.ejercicio.datosEjemplo}
            </div>
          </div>
        )}
        <p className="text-xs font-semibold text-[#F9F6E7] mb-2">Pasos a seguir:</p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          {temaData.ejercicio.pasos.map((p, i) => (
            <li key={i} className="text-sm text-[#F9F6E7]/80">
              {p}
            </li>
          ))}
        </ol>
        <div className="p-3 rounded-lg bg-[#FBBC0C]/10 border border-[#FBBC0C]/30 mb-4">
          <p className="text-xs font-semibold text-[#FBBC0C]">Resultado esperado:</p>
          <p className="text-xs text-[#F9F6E7]/80">{temaData.ejercicio.resultado}</p>
        </div>
        {temaData.ejercicio.criterios && temaData.ejercicio.criterios.length > 0 && (
          <div className="p-3 rounded-lg bg-[#1F2F58]/40 border border-[#1F2F58]/50">
            <p className="text-xs font-semibold text-[#F9F6E7] mb-2">
              Criterios de evaluación (/100 puntos)
            </p>
            <div className="space-y-1.5">
              {temaData.ejercicio.criterios.map((c, ci) => (
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
  const ailabContent = (
    <div className="text-center py-4">
      <FlaskConical className="size-8 text-[#73B8E7] mx-auto mb-2" />
      <p className="text-sm text-[#F9F6E7]/70 mb-3">
        Practica con IA en vivo — ChatGPT, Claude y Gemini incluidos.
      </p>
      <Link
        href="/ai-lab"
        className="inline-flex items-center gap-2 bg-[#73B8E7] text-[#0A1628] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#5BA0D0]"
      >
        Abrir AI Lab
      </Link>
    </div>
  );

  // ── Fix 1 — Recursos dark theme ──
  const recursosContent =
    temaData.recursos.length === 0 ? (
      <div className="flex flex-col items-center py-6 text-center">
        <FolderOpen className="size-7 text-[#F9F6E7]/25 mb-2" />
        <p className="text-sm text-[#F9F6E7]/55">Recursos próximamente</p>
      </div>
    ) : (
      <div>
        <p className="text-xs text-[#F9F6E7]/50 mb-3">
          {temaData.recursos.length} recursos seleccionados
        </p>
        {temaData.recursos.map((r, ri) => (
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

  // ── Fix 4 — Grabaciones tab ──
  const grabacionesContent = (
    <GrabacionesTab sessionId={`curso-pro-${slug}-${temaData.id}`} />
  );

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

  const otherTabs = SESSION_TABS.filter((t) => t.id !== activeTab);

  return (
    <div className="mt-3 border border-[#1F2F58]/40 rounded-xl overflow-hidden bg-[#0D1B30]">
      {/* ── Tab bar dark ── */}
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

      {/* ── Contenido principal ── */}
      <div className="p-5">{contentMap[activeTab]}</div>

      {/* ── MÁS CONTENIDO divider dark ── */}
      <div className="flex items-center gap-3 px-5 py-2 bg-[#0A1628]/60 border-t border-[#1F2F58]/30">
        <div className="flex-1 border-t border-[#1F2F58]/30" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#F9F6E7]/25 select-none">
          Más contenido
        </span>
        <div className="flex-1 border-t border-[#1F2F58]/30" />
      </div>

      {/* ── Acordeones dark ── */}
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

// ─── Componente: card de sesión ───────────────────────────────────────────────

function SesionCard({
  numero,
  titulo,
  isExpanded,
  onToggle,
  temaData,
  sesionLabel,
  slug,
}: {
  numero: number;
  titulo: string;
  isExpanded: boolean;
  onToggle: () => void;
  temaData?: TemaProSteveen;
  sesionLabel?: string;
  slug: string;
}) {
  return (
    <div
      className={`rounded-xl border transition-all ${
        isExpanded
          ? "border-[#73B8E7]/40 bg-[#1F2F58]/20 shadow-sm"
          : "border-[#1F2F58]/30 bg-[#1F2F58]/10 hover:border-[#73B8E7]/30 hover:shadow-sm"
      }`}
    >
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-4 text-left">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
            isExpanded ? "bg-[#FBBC0C]/20 text-[#FBBC0C]" : "bg-[#1F2F58]/30"
          }`}
        >
          {isExpanded ? (
            <CheckCircle2 className="size-5 text-[#FBBC0C]" />
          ) : (
            <span className="text-sm font-bold text-[#F9F6E7]/60 font-[family-name:var(--font-space-grotesk)]">
              {numero}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#F9F6E7] leading-snug">{titulo}</h3>
          {!isExpanded && (
            <p className="mt-0.5 text-[10px] text-[#F9F6E7]/40">
              Video · Presentación · Teoría · Quiz · Ejercicio · AI Lab · Recursos · Grabaciones
            </p>
          )}
          {sesionLabel && !isExpanded && (
            <p className="mt-0.5 text-[10px] text-[#73B8E7] font-medium">{sesionLabel}</p>
          )}
        </div>

        <div className="shrink-0 text-[#F9F6E7]/30">
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <SesionContent temaData={temaData} slug={slug} />
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

  const meta = CURSOS_PRO_META[slug];
  if (!meta) {
    notFound();
  }

  const [expandedTema, setExpandedTema] = useState<number | null>(null);
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

  const temaExpandido = expandedTema ? temas.find((t) => t.id === expandedTema) : null;
  const moduloExpandidoInfo = temaExpandido
    ? modulos.find((m) => m.num === temaExpandido.moduloNum)
    : null;

  return (
    <div className="space-y-8">

      {/* ── Breadcrumb dark ── */}
      <nav className="flex items-center gap-1.5 text-xs text-[#F9F6E7]/50 flex-wrap">
        <Link
          href="/cursos-pro"
          className="hover:text-[#F9F6E7] transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="size-3" />
          Cursos Pro
        </Link>
        <span>/</span>
        {moduloExpandidoInfo ? (
          <>
            <button
              onClick={() => setExpandedTema(null)}
              className="hover:text-[#F9F6E7] transition-colors"
            >
              {meta.titulo}
            </button>
            <span>/</span>
            <span className="text-[#73B8E7] font-medium">M{moduloExpandidoInfo.num}</span>
            <span>/</span>
            <span className="text-[#F9F6E7] font-medium truncate max-w-[200px]">
              {temaExpandido?.titulo}
            </span>
          </>
        ) : (
          <span className="text-[#F9F6E7] font-medium">{meta.titulo}</span>
        )}
      </nav>

      {/* ── Header del curso ── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex items-start gap-4">
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

      {/* ── Contenido del curso (módulos colapsables) ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F9F6E7] font-[family-name:var(--font-space-grotesk)]">
            Contenido del curso ({temas.length} temas · {modulos.length} módulos)
          </h2>
          <span className="text-xs text-[#F9F6E7]/40 hidden sm:inline">
            Haz clic en un tema para ver las 8 pestañas
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
                className="rounded-2xl border border-[#1F2F58]/40 overflow-hidden bg-[#0D1B30]"
              >
                {/* ── Header del módulo dark ── */}
                <button
                  onClick={() => toggleModulo(modulo.num)}
                  className="w-full flex items-center gap-4 p-4 sm:p-5 text-left bg-gradient-to-r from-[#1F2F58]/40 to-[#0D1B30] hover:from-[#1F2F58]/60 transition-all"
                >
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isModuloOpen ? "bg-[#FBBC0C]/20" : "bg-[#1F2F58]/40"
                    }`}
                  >
                    <span
                      className={`text-sm font-black font-[family-name:var(--font-space-grotesk)] ${
                        isModuloOpen ? "text-[#FBBC0C]" : "text-[#F9F6E7]/50"
                      }`}
                    >
                      M{modulo.num}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-[#F9F6E7] leading-snug">
                      {modulo.nombre}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#F9F6E7]/40">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {modulo.horas}h
                      </span>
                      <span className="size-0.5 rounded-full bg-[#F9F6E7]/20" />
                      <span>{modulo.temas} temas × 1.5h</span>
                      <span className="size-0.5 rounded-full bg-[#F9F6E7]/20" />
                      <span
                        className={
                          temasDisponibles === modulo.temas
                            ? "text-green-400 font-semibold"
                            : ""
                        }
                      >
                        {temasDisponibles}/{modulo.temas} disponibles
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <div className="w-16 h-1.5 rounded-full bg-[#1F2F58]/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#FBBC0C] transition-all"
                        style={{
                          width: `${(temasDisponibles / modulo.temas) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="shrink-0 text-[#F9F6E7]/30">
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
                        slug={slug}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA WhatsApp ── */}
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
