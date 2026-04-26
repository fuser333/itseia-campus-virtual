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
import { CURSOS_MDT } from "../data";
import { C1_TEMAS, C1_MODULOS } from "../c1-data";
import type { TemaC1 } from "../c1-data";

// ─── Slug → índice en CURSOS_MDT (c1=índice 0, c2=índice 1, ...) ─────────────

const SLUG_INDEX: Record<string, number> = {
  c1: 0,
  c2: 1,
  c3: 2,
  c4: 3,
  c5: 4,
  c6: 5,
  c7: 6,
  c8: 7,
  c9: 8,
  c10: 9,
  c11: 10,
  c12: 11,
  c13: 12,
  c14: 13,
  c15: 14,
};

// ─── YouTube video IDs por slug ───────────────────────────────────────────────

const VIDEO_IDS: Record<string, string> = {
  c1:  "b3C-JRtY-24",
  c2:  "4vnxNZXqLDk",
  c3:  "7eD6nDNS_0c",
  c4:  "nRspdfdiliU",
  c5:  "KBPi9oTdgjY",
  c6:  "GWqRRq3iqFU",
  c7:  "cryYB59frSU",
  c8:  "iba0bQmGWjc",
  c9:  "Nfb4xGl62sY",
  c10: "Rlc81jPt5sE",
  c11: "SC5q9tX7ZFc",
  c12: "PXKl2yaSFvk",
  c13: "otfykJ_vFLg",
  c14: "tD_DvxcvZ_s",
  c15: "zRUSO7o-X-U",
};

// ─── Etiqueta de número de curso ──────────────────────────────────────────────

const COURSE_LABELS: Record<string, string> = {
  c1:  "C1",  c2:  "C2",  c3:  "C3",  c4:  "C4",  c5:  "C5",
  c6:  "C6",  c7:  "C7",  c8:  "C8",  c9:  "C9",  c10: "C10",
  c11: "C11", c12: "C12", c13: "C13", c14: "C14", c15: "C15",
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
  { id: "recursos",     label: "Recursos",      icon: <FolderOpen className="size-3.5" />,   color: "#517CBE" },
];

// ─── Componente: pestañas de sesión ──────────────────────────────────────────

function SesionTabs({ sesionNumero, sesionTitulo, temaData }: { sesionNumero: number; sesionTitulo: string; temaData?: TemaC1 }) {
  const [activeTab, setActiveTab] = useState("video");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const hasContent = temaData && temaData.videoEmbed !== "";

  function renderTabContent() {
    if (!hasContent || !temaData) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#1F2F58]/5">
            <Brain className="size-6 text-[#1F2F58]/20" />
          </div>
          <p className="text-sm text-[#1F2F58]/50">Contenido próximamente</p>
        </div>
      );
    }

    switch (activeTab) {
      case "video":
        return (
          <div>
            <h4 className="text-sm font-bold text-[#0A1628] mb-3">{temaData.videoTitulo}</h4>
            <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <iframe src={temaData.videoEmbed} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        );
      case "presentacion":
        return (
          <div>
            <h4 className="text-sm font-bold text-[#0A1628] mb-2">Presentación — {sesionTitulo}</h4>
            <p className="text-sm text-[#1F2F58]/70 mb-4">Presentación interactiva de 10+ slides con los conceptos clave de este tema.</p>
            <a href="https://gamma.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#FBBC0C] text-[#0A1628] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#E5AB00]">
              <FileText className="size-4" /> Abrir en Gamma
            </a>
          </div>
        );
      case "teoria":
        return (
          <div>
            <h4 className="text-sm font-bold text-[#0A1628] mb-3">Teoría — {sesionTitulo}</h4>
            <div className="prose prose-sm max-w-none text-[#1F2F58] leading-relaxed whitespace-pre-line">{temaData.teoria}</div>
          </div>
        );
      case "quiz":
        return (
          <div>
            <h4 className="text-sm font-bold text-[#0A1628] mb-4">Quiz — {temaData.quiz.length} preguntas</h4>
            {temaData.quiz.map((q, qi) => (
              <div key={qi} className="mb-6 p-4 rounded-lg bg-[#F9F6E7]/80 border border-[#1F2F58]/10">
                <p className="text-sm font-semibold text-[#0A1628] mb-3">{qi + 1}. {q.pregunta}</p>
                {q.opciones.map((op, oi) => {
                  const selected = quizAnswers[qi] === oi;
                  const isCorrect = showResults && oi === q.respuesta;
                  const isWrong = showResults && selected && oi !== q.respuesta;
                  return (
                    <button key={oi} onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                      className={`block w-full text-left px-3 py-2 mb-1.5 rounded-lg text-sm transition-all border ${
                        isCorrect ? "bg-green-50 border-green-400 text-green-800" :
                        isWrong ? "bg-red-50 border-red-400 text-red-800" :
                        selected ? "bg-[#FBBC0C]/10 border-[#FBBC0C] text-[#0A1628]" :
                        "bg-white border-[#1F2F58]/10 text-[#1F2F58] hover:bg-[#F9F6E7]"
                      }`}>
                      {op}
                    </button>
                  );
                })}
                {showResults && <p className="mt-2 text-xs text-[#1F2F58]/60 italic">{q.explicacion}</p>}
              </div>
            ))}
            <button onClick={() => setShowResults(!showResults)}
              className="bg-[#FBBC0C] text-[#0A1628] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#E5AB00]">
              {showResults ? "Ocultar respuestas" : "Ver respuestas"}
            </button>
          </div>
        );
      case "ejercicio":
        return (
          <div>
            <h4 className="text-sm font-bold text-[#0A1628] mb-2">Ejercicio Práctico</h4>
            <p className="text-sm text-[#1F2F58]/70 mb-1"><strong>Objetivo:</strong> {temaData.ejercicio.objetivo}</p>
            <p className="text-sm text-[#1F2F58]/70 mb-3"><strong>Herramientas:</strong> {temaData.ejercicio.herramientas}</p>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              {temaData.ejercicio.pasos.map((p, i) => (
                <li key={i} className="text-sm text-[#1F2F58]">{p}</li>
              ))}
            </ol>
            <div className="p-3 rounded-lg bg-[#FBBC0C]/10 border border-[#FBBC0C]/30">
              <p className="text-xs font-semibold text-[#0A1628]">Resultado esperado:</p>
              <p className="text-xs text-[#1F2F58]">{temaData.ejercicio.resultado}</p>
            </div>
          </div>
        );
      case "ailab":
        return (
          <div className="text-center py-6">
            <FlaskConical className="size-10 text-[#73B8E7] mx-auto mb-3" />
            <h4 className="text-sm font-bold text-[#0A1628] mb-2">AI Lab</h4>
            <p className="text-sm text-[#1F2F58]/60 mb-4">Practica con IA en vivo — ChatGPT, Claude y Gemini incluidos.</p>
            <Link href="/ai-lab" className="inline-flex items-center gap-2 bg-[#73B8E7] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#5BA0D0]">
              Abrir AI Lab
            </Link>
          </div>
        );
      case "recursos":
        return (
          <div>
            <h4 className="text-sm font-bold text-[#0A1628] mb-3">Recursos Complementarios</h4>
            {temaData.recursos.map((r, ri) => (
              <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 mb-2 rounded-lg bg-white border border-[#1F2F58]/10 hover:border-[#73B8E7]/40 transition-all">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  r.tipo === "documentacion" ? "bg-[#73B8E7]/10 text-[#73B8E7]" :
                  r.tipo === "herramienta" ? "bg-[#FBBC0C]/10 text-[#0A1628]" :
                  "bg-[#F0846D]/10 text-[#F0846D]"
                }`}>{r.tipo}</span>
                <span className="text-sm text-[#1F2F58] font-medium">{r.titulo}</span>
              </a>
            ))}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="mt-3 border border-[#1F2F58]/10 rounded-xl overflow-hidden bg-white">
      <div className="flex overflow-x-auto border-b border-[#1F2F58]/10 bg-[#F9F6E7]/60">
        {SESSION_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const hasData = hasContent && (tab.id !== "presentacion" || true);
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                isActive ? "border-[#FBBC0C] text-[#0A1628] bg-white" : "border-transparent text-[#1F2F58]/50 hover:text-[#1F2F58]/80 hover:bg-white/60"
              }`}>
              <span style={{ color: isActive ? tab.color : undefined }}>{tab.icon}</span>
              {tab.label}
              {hasData && <span className="size-1.5 rounded-full bg-green-400" />}
            </button>
          );
        })}
      </div>
      <div className="p-6">{renderTabContent()}</div>
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
}: {
  numero: number;
  titulo: string;
  isExpanded: boolean;
  onToggle: () => void;
  temaData?: TemaC1;
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
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
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
          <h3 className="text-sm font-semibold text-[#0A1628] leading-snug">
            {titulo}
          </h3>
          {!isExpanded && (
            <p className="mt-0.5 text-[10px] text-[#1F2F58]/40">
              7 pestañas: Video · Presentación · Teoría · Quiz · Ejercicio · AI Lab · Recursos
            </p>
          )}
        </div>

        {/* Chevron */}
        <div className="shrink-0 text-[#1F2F58]/30">
          {isExpanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <SesionTabs sesionNumero={numero} sesionTitulo={titulo} temaData={temaData} />
        </div>
      )}
    </div>
  );
}

// ─── Componente: cards de otros cursos (propaganda) ──────────────────────────

function OtrosCursosSection({ currentSlug }: { currentSlug: string }) {
  // Todos los slugs excepto el actual
  const todosLosSlugs = Object.keys(SLUG_INDEX).filter((s) => s !== currentSlug);

  // Tomar 4 aleatoriamente (pero determinista — usar índices fijos en base al slug actual)
  const currentIdx = SLUG_INDEX[currentSlug] ?? 0;
  const seleccionados = [
    todosLosSlugs[(currentIdx + 1) % todosLosSlugs.length],
    todosLosSlugs[(currentIdx + 3) % todosLosSlugs.length],
    todosLosSlugs[(currentIdx + 6) % todosLosSlugs.length],
    todosLosSlugs[(currentIdx + 9) % todosLosSlugs.length],
  ];

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
          Otros Cursos MDT
        </h2>
        <p className="mt-1 text-sm text-[#1F2F58]/60">
          Amplía tus habilidades con más cursos del catálogo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {seleccionados.map((s) => {
          const idx = SLUG_INDEX[s];
          if (idx === undefined) return null;
          const curso = CURSOS_MDT[idx];
          if (!curso) return null;
          const label = COURSE_LABELS[s] ?? s.toUpperCase();

          return (
            <Link
              key={s}
              href={`/cursos-mdt/${s}`}
              className="group flex flex-col rounded-xl border border-[#1F2F58]/8 bg-white p-4 transition-all hover:border-[#73B8E7]/40 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Label badge */}
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex rounded-md bg-[#1F2F58]/5 px-2 py-0.5 text-[10px] font-bold text-[#1F2F58]/50">
                  {label}
                </span>
                <span className="text-[10px] text-[#FBBC0C] font-semibold">
                  {curso.precio}
                </span>
              </div>

              <h3 className="flex-1 text-sm font-bold text-[#0A1628] leading-snug group-hover:text-[#1F2F58] transition-colors line-clamp-2">
                {curso.nombre}
              </h3>

              <div className="mt-3 flex items-center gap-2 text-[10px] text-[#1F2F58]/40">
                <Clock className="size-3" />
                <span>{curso.horas}h</span>
                <span className="size-0.5 rounded-full bg-[#1F2F58]/20" />
                <span className="inline-flex rounded-full bg-[#73B8E7]/10 px-1.5 py-0.5 text-[#73B8E7] font-medium">
                  {curso.categoria}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA WhatsApp */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6">
        <div>
          <p className="text-sm font-bold text-white">¿Quieres adquirir este u otro curso?</p>
          <p className="text-xs text-white/60 mt-0.5">
            Escríbenos y te asesoramos sin compromiso.
          </p>
        </div>
        <a
          href="https://wa.me/593959892034?text=Hola%2C%20quiero%20información%20sobre%20los%20cursos%20MDT%20de%20ITSEIA"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#FBBC0C] px-5 py-2.5 text-sm font-bold text-[#0A1628] transition-colors hover:bg-[#f5b300] shrink-0"
        >
          <MessageCircle className="size-4" />
          Contactar por WhatsApp
        </a>
      </div>
    </section>
  );
}

// ─── Page principal ───────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CursoMdtPage({ params }: PageProps) {
  const { slug } = use(params);

  // Validar slug
  const cursoIdx = SLUG_INDEX[slug];
  if (cursoIdx === undefined) {
    notFound();
  }

  const curso = CURSOS_MDT[cursoIdx];
  if (!curso) {
    notFound();
  }

  const videoId = VIDEO_IDS[slug];
  const courseLabel = COURSE_LABELS[slug] ?? slug.toUpperCase();

  // Estado: qué sesión está expandida (null = ninguna)
  const [expandedSesion, setExpandedSesion] = useState<number | null>(null);

  function toggleSesion(num: number) {
    setExpandedSesion((prev) => (prev === num ? null : num));
  }

  return (
    <div className="space-y-8">

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-xs text-[#1F2F58]/50">
        <Link
          href="/cursos-mdt"
          className="hover:text-[#1F2F58] transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="size-3" />
          Cursos MDT
        </Link>
        <span>/</span>
        <span className="text-[#0A1628] font-medium">{courseLabel}. {curso.nombre}</span>
      </nav>

      {/* ── Header del curso ─────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex items-start gap-4">
          {/* Número badge */}
          <div className="hidden sm:flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#FBBC0C]/15">
            <span className="text-xl font-black text-[#FBBC0C] font-[family-name:var(--font-space-grotesk)]">
              {courseLabel}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#73B8E7] uppercase tracking-wider">
                {curso.categoria}
              </span>
              <span className="inline-flex rounded-md bg-[#FBBC0C]/15 px-2 py-0.5 text-[10px] font-bold text-[#FBBC0C]">
                {curso.precio}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-space-grotesk)]">
              {curso.nombre}
            </h1>

            <p className="mt-2 text-sm text-white/70 max-w-xl leading-relaxed">
              {curso.descripcion}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {curso.horas} horas
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1">
                <BookOpen className="size-3" />
                {curso.sesiones.length} sesiones
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span>Nivel: Profesional</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Video YouTube ─────────────────────────────────────────────────── */}
      {videoId && (
        <div>
          <h2 className="mb-3 text-lg font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
            Video del Curso
          </h2>
          <div
            className="w-full overflow-hidden rounded-xl shadow-md"
            style={{ aspectRatio: "16/9" }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={curso.nombre}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="size-full border-0"
            />
          </div>
        </div>
      )}

      {/* ── Sesiones del curso ────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
            Sesiones de clase ({curso.sesiones.length})
          </h2>
          <span className="text-xs text-[#1F2F58]/40">
            Haz clic en una sesión para ver las 7 pestañas
          </span>
        </div>

        <div className="space-y-2">
          {curso.sesiones.map((sesion) => {
            const temaData = slug === "c1" ? C1_TEMAS[sesion.numero - 1] : undefined;
            return (
              <SesionCard
                key={sesion.numero}
                numero={sesion.numero}
                titulo={sesion.titulo}
                isExpanded={expandedSesion === sesion.numero}
                onToggle={() => toggleSesion(sesion.numero)}
                temaData={temaData}
              />
            );
          })}
        </div>
      </section>

      {/* ── Otros Cursos MDT ─────────────────────────────────────────────── */}
      <OtrosCursosSection currentSlug={slug} />
    </div>
  );
}
