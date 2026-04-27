"use client";

// ── /certificaciones/[slug] ───────────────────────────────
// Certification detail page.
// Para "aws-cloud-practitioner" usa los datos estáticos de _data/aws-data.ts
// (4 dominios con video, Gamma, lecciones, quiz interactivo).
// Para el resto de slugs cae al flujo legacy basado en /api/certifications/detail.

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Clock,
  DollarSign,
  Loader2,
  PlayCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Play,
  FileText,
  ClipboardList,
  Pencil,
  FlaskConical,
  FolderOpen,
  CheckCircle2,
  Languages,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import DomainList from "@/components/certifications/DomainList";
import ExamHistoryChart from "@/components/certifications/ExamHistoryChart";
import SlideViewer from "@/components/session/SlideViewer";
import { cn } from "@/lib/utils";
import type {
  CertificationProgramWithDomains,
  ExamAttempt,
} from "@/types/database";
import {
  awsCloudPractitionerData,
  type CertificacionData,
  type DominioData,
} from "./_data/aws-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// AWS Orange para acentos del proveedor (manteniendo branding ITSEIA en lo demás)
const AWS_ORANGE = "#FF9900";

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  basico: { label: "Básico", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  intermedio: { label: "Intermedio", color: "text-[#FBBC0C] bg-[#FBBC0C]/10 border-[#FBBC0C]/20" },
  avanzado: { label: "Avanzado", color: "text-[#F0846D] bg-[#F0846D]/10 border-[#F0846D]/20" },
};

// ── Pestañas de cada dominio (mismo patrón que cursos-mdt) ───────────────────
interface TabDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const DOMAIN_TABS: TabDef[] = [
  { id: "video",        label: "Video",        icon: <Play className="size-3.5" />,          color: "#73B8E7" },
  { id: "presentacion", label: "Presentación", icon: <FileText className="size-3.5" />,      color: "#517CBE" },
  { id: "teoria",       label: "Teoría",       icon: <BookOpen className="size-3.5" />,      color: "#1F2F58" },
  { id: "quiz",         label: "Quiz",         icon: <ClipboardList className="size-3.5" />, color: "#FBBC0C" },
  { id: "ejercicio",    label: "Ejercicio",    icon: <Pencil className="size-3.5" />,        color: "#F0846D" },
  { id: "ailab",        label: "AI Lab",       icon: <FlaskConical className="size-3.5" />,  color: "#73B8E7" },
  { id: "recursos",     label: "Recursos",     icon: <FolderOpen className="size-3.5" />,    color: "#517CBE" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function youtubeEmbedFromUrl(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente: contenido expandido de un dominio (7 tabs)
// ─────────────────────────────────────────────────────────────────────────────
function DominioContent({ dominio, slug }: { dominio: DominioData; slug: string }) {
  const [activeTab, setActiveTab] = useState<string>("video");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Video content ──
  const embedUrl = youtubeEmbedFromUrl(dominio.video.url);
  const videoContent = (
    <div>
      <h4 className="text-sm font-bold text-[#0A1628] mb-1">{dominio.video.titulo}</h4>
      {dominio.video.canal && (
        <p className="text-xs text-[#1F2F58]/50 mb-3">
          {dominio.video.canal} · {dominio.video.duracionMin} min
        </p>
      )}
      {embedUrl ? (
        <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="rounded-xl border border-[#FBBC0C]/30 bg-[#FBBC0C]/5 p-5 text-center">
          <AlertTriangle className="size-6 text-[#FBBC0C] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#0A1628]">Grabación propia próximamente</p>
          {dominio.video.notas && (
            <p className="mt-1 text-xs text-[#1F2F58]/60 leading-relaxed">{dominio.video.notas}</p>
          )}
        </div>
      )}
    </div>
  );

  // ── Presentación (Gamma) ──
  const presentacionContent = dominio.slidesUrl ? (
    <SlideViewer
      slidesUrl={dominio.slidesUrl}
      slidesType="google_slides"
      title={`Presentación — ${dominio.nombre}`}
    />
  ) : (
    <p className="text-sm text-[#1F2F58]/50">Presentación próximamente.</p>
  );

  // ── Teoría (lecciones) ──
  const teoriaContent = (
    <div className="space-y-4">
      {dominio.lecciones.map((leccion) => (
        <div
          key={leccion.id}
          className="rounded-lg border border-[#1F2F58]/10 bg-[#F9F6E7]/40 p-4"
        >
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <h5 className="text-sm font-bold text-[#0A1628]">
              {leccion.id} · {leccion.titulo}
            </h5>
            <span className="text-[10px] text-[#1F2F58]/50 shrink-0 flex items-center gap-1">
              <Clock className="size-3" />
              {leccion.duracionLecturaMin} min
            </span>
          </div>
          <div className="prose prose-sm max-w-none text-[#1F2F58] leading-relaxed whitespace-pre-line text-sm">
            {leccion.contenidoMarkdown}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Quiz interactivo (10 preguntasPractica) ──
  const quizContent = (
    <div>
      <p className="text-xs text-[#1F2F58]/50 mb-4">
        {dominio.preguntasPractica.length} preguntas de práctica
      </p>
      {dominio.preguntasPractica.map((preg, qi) => (
        <div
          key={preg.id}
          className="mb-5 p-4 rounded-lg bg-[#F9F6E7]/80 border border-[#1F2F58]/10"
        >
          <p className="text-sm font-semibold text-[#0A1628] mb-3">
            {qi + 1}. {preg.enunciado}
          </p>
          {preg.opciones.map((op, oi) => {
            const selected = quizAnswers[qi] === oi;
            const isCorrect = showResults && oi === preg.respuestaCorrecta;
            const isWrong =
              showResults && selected && oi !== preg.respuestaCorrecta;
            return (
              <button
                key={oi}
                onClick={() =>
                  setQuizAnswers((prev) => ({ ...prev, [qi]: oi }))
                }
                className={cn(
                  "block w-full text-left px-3 py-2 mb-1.5 rounded-lg text-sm transition-all border",
                  isCorrect && "bg-green-50 border-green-400 text-green-800",
                  isWrong && "bg-red-50 border-red-400 text-red-800",
                  !isCorrect &&
                    !isWrong &&
                    selected &&
                    "bg-[#FBBC0C]/10 border-[#FBBC0C] text-[#0A1628]",
                  !isCorrect &&
                    !isWrong &&
                    !selected &&
                    "bg-white border-[#1F2F58]/10 text-[#1F2F58] hover:bg-[#F9F6E7]"
                )}
              >
                {op.text}
              </button>
            );
          })}
          {showResults && (
            <p className="mt-2 text-xs text-[#1F2F58]/60 italic">
              {preg.explicacion}
            </p>
          )}
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowResults((prev) => !prev)}
          className="bg-[#FBBC0C] text-[#0A1628] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#E5AB00]"
        >
          {showResults ? "Ocultar respuestas" : "Ver respuestas"}
        </button>
        <button
          onClick={() => {
            setQuizAnswers({});
            setShowResults(false);
          }}
          className="bg-white border border-[#1F2F58]/15 text-[#1F2F58] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#F9F6E7]"
        >
          Reiniciar quiz
        </button>
      </div>
    </div>
  );

  // ── Ejercicio (link al examen completo) ──
  const ejercicioContent = (
    <div className="rounded-xl border border-[#FF9900]/25 bg-gradient-to-br from-[#FF9900]/5 to-white p-5">
      <p className="text-sm font-bold text-[#0A1628] mb-1">
        Practica el dominio en el simulacro completo
      </p>
      <p className="text-xs text-[#1F2F58]/65 mb-3 leading-relaxed">
        El simulacro mezcla preguntas de los 4 dominios con el peso real del examen
        CLF-C02. Tendrás 90 minutos y necesitas 70 % para aprobar.
      </p>
      <Link
        href={`/certificaciones/${slug}/examen`}
        className="inline-flex items-center gap-2 bg-[#1F2F58] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#0A1628]"
      >
        <PlayCircle className="size-4 text-[#FBBC0C]" />
        Ir al simulacro
      </Link>
    </div>
  );

  // ── AI Lab ──
  const ailabContent = (
    <div className="text-center py-4">
      <FlaskConical className="size-8 text-[#73B8E7] mx-auto mb-2" />
      <p className="text-sm text-[#1F2F58]/60 mb-3">
        Profundiza en los conceptos del dominio con IA — pega tus dudas en
        ChatGPT, Claude o Gemini desde el AI Lab integrado.
      </p>
      <Link
        href="/ai-lab"
        className="inline-flex items-center gap-2 bg-[#73B8E7] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#5BA0D0]"
      >
        Abrir AI Lab
      </Link>
    </div>
  );

  // ── Recursos ──
  const recursosContent = (
    <div className="space-y-2">
      <a
        href="https://aws.amazon.com/es/certification/certified-cloud-practitioner/"
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3 rounded-lg bg-white border border-[#1F2F58]/10 hover:border-[#FF9900]/40 transition-all"
      >
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FF9900]/10 text-[#FF9900] mr-2">
          oficial
        </span>
        <span className="text-sm font-semibold text-[#1F2F58]">
          Guía oficial del examen CLF-C02
        </span>
      </a>
      <a
        href="https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials-spanish-latin-american"
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3 rounded-lg bg-white border border-[#1F2F58]/10 hover:border-[#73B8E7]/40 transition-all"
      >
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#73B8E7]/10 text-[#73B8E7] mr-2">
          curso
        </span>
        <span className="text-sm font-semibold text-[#1F2F58]">
          AWS Cloud Practitioner Essentials (Skill Builder, español)
        </span>
      </a>
      <a
        href="https://aws.amazon.com/es/architecture/well-architected/"
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3 rounded-lg bg-white border border-[#1F2F58]/10 hover:border-[#73B8E7]/40 transition-all"
      >
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#73B8E7]/10 text-[#73B8E7] mr-2">
          documentación
        </span>
        <span className="text-sm font-semibold text-[#1F2F58]">
          AWS Well-Architected Framework
        </span>
      </a>
    </div>
  );

  const contentMap: Record<string, React.ReactNode> = {
    video: videoContent,
    presentacion: presentacionContent,
    teoria: teoriaContent,
    quiz: quizContent,
    ejercicio: ejercicioContent,
    ailab: ailabContent,
    recursos: recursosContent,
  };

  const otherTabs = DOMAIN_TABS.filter((t) => t.id !== activeTab);

  return (
    <div className="mt-3 border border-[#1F2F58]/10 rounded-xl overflow-hidden bg-white">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-[#1F2F58]/10 bg-[#F9F6E7]/60">
        {DOMAIN_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2",
                isActive
                  ? "border-[#FBBC0C] text-[#0A1628] bg-white"
                  : "border-transparent text-[#1F2F58]/50 hover:text-[#1F2F58]/80 hover:bg-white/60"
              )}
            >
              <span style={{ color: isActive ? tab.color : undefined }}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenido principal */}
      <div className="p-5">{contentMap[activeTab]}</div>

      {/* Más contenido */}
      <div className="flex items-center gap-3 px-5 py-2 bg-[#F9F6E7]/40 border-t border-[#1F2F58]/8">
        <div className="flex-1 border-t border-[#1F2F58]/10" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#1F2F58]/30 select-none">
          Más contenido
        </span>
        <div className="flex-1 border-t border-[#1F2F58]/10" />
      </div>

      {otherTabs.map((tab) => {
        const isOpen = expandedSections.has(tab.id);
        return (
          <div key={tab.id} className="border-t border-[#1F2F58]/10 first:border-t-0">
            <button
              onClick={() => toggleSection(tab.id)}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[#F9F6E7]/40 transition-colors"
            >
              <span style={{ color: tab.color }} className="shrink-0">
                {tab.icon}
              </span>
              <span className="text-sm font-semibold text-[#0A1628] flex-1">
                {tab.label}
              </span>
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

// ─────────────────────────────────────────────────────────────────────────────
// Card de dominio (acordeón)
// ─────────────────────────────────────────────────────────────────────────────
function DominioCard({
  dominio,
  isExpanded,
  onToggle,
  slug,
}: {
  dominio: DominioData;
  isExpanded: boolean;
  onToggle: () => void;
  slug: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all overflow-hidden",
        isExpanded
          ? "border-[#FF9900]/40 bg-[#F9F6E7]/40 shadow-sm"
          : "border-[#1F2F58]/10 bg-white hover:border-[#FF9900]/30 hover:shadow-sm"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left"
      >
        {/* Badge dominio */}
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors",
            isExpanded ? "bg-[#1F2F58]" : "bg-[#1F2F58]/5"
          )}
        >
          {isExpanded ? (
            <CheckCircle2 className="size-5 text-[#FF9900]" />
          ) : (
            <span
              className="text-sm font-black text-[#1F2F58]/60"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              D{dominio.orden}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-sm sm:text-base font-bold text-[#0A1628] leading-snug">
              Dominio {dominio.orden}: {dominio.nombre}
            </h3>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: `${AWS_ORANGE}1A`,
                color: AWS_ORANGE,
              }}
            >
              {dominio.porcentajeEnExamen}% del examen
            </span>
          </div>
          <p className="text-xs text-[#1F2F58]/60 leading-relaxed">
            {dominio.descripcion}
          </p>
          {!isExpanded && (
            <p className="mt-1.5 text-[10px] text-[#1F2F58]/40">
              Video · Presentación · Teoría · Quiz · Ejercicio · AI Lab · Recursos
            </p>
          )}
          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-[#1F2F58]/45">
            <span className="flex items-center gap-1">
              <BookOpen className="size-3" />
              {dominio.lecciones.length} lecciones
            </span>
            <span className="size-0.5 rounded-full bg-[#1F2F58]/20" />
            <span className="flex items-center gap-1">
              <ClipboardList className="size-3" />
              {dominio.preguntasPractica.length} práctica
            </span>
            <span className="size-0.5 rounded-full bg-[#1F2F58]/20" />
            <span>{dominio.preguntasSimulacro.length} simulacro</span>
          </div>
        </div>

        <div className="shrink-0 text-[#1F2F58]/30">
          {isExpanded ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <DominioContent dominio={dominio} slug={slug} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Vista AWS — datos estáticos
// ─────────────────────────────────────────────────────────────────────────────
function AwsCertView({ data, slug }: { data: CertificacionData; slug: string }) {
  const router = useRouter();
  const [expandedDominio, setExpandedDominio] = useState<number | null>(null);

  const totalLecciones = useMemo(
    () => data.dominios.reduce((acc, d) => acc + d.lecciones.length, 0),
    [data.dominios]
  );
  const totalPreguntas = useMemo(
    () => data.dominios.reduce((acc, d) => acc + d.preguntasSimulacro.length, 0),
    [data.dominios]
  );
  const levelConfig =
    LEVEL_LABELS[data.nivelDificultad] ?? LEVEL_LABELS.basico;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-white/40">
        <Link
          href="/certificaciones"
          className="hover:text-white/70 flex items-center gap-1"
        >
          <ChevronLeft className="w-3 h-3" />
          Certificaciones
        </Link>
        <span>/</span>
        <span className="text-white/60">{data.nombre}</span>
      </div>

      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-start gap-5 flex-wrap">
          {/* Provider badge AWS */}
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0"
            style={{
              backgroundColor: "#1F2F58",
              color: AWS_ORANGE,
            }}
          >
            AWS
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: AWS_ORANGE }}
              >
                {data.proveedor} · {data.examOficialCodigo}
              </p>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  levelConfig.color
                )}
              >
                {levelConfig.label}
              </span>
              <span className="rounded-full border border-[#FBBC0C]/30 bg-[#FBBC0C]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#FBBC0C]">
                MDT · ITSEIA
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {data.nombre}
            </h1>

            <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-3xl">
              {data.descripcion}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/65">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#73B8E7]" />
                {data.dominios.length} dominios
              </span>
              <span className="flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-[#73B8E7]" />
                {data.totalPreguntasSimulacro} preguntas simulacro
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#73B8E7]" />
                {data.umbralAprobacionPorcentaje}% aprobación
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#73B8E7]" />
                {data.duracionSimulacroMin} min simulacro
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#73B8E7]" />
                Examen oficial ${data.costoExamenUsd}
              </span>
              <span className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-[#73B8E7]" />
                Examen en {data.idiomaExamen}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#73B8E7]" />
                {totalLecciones} lecciones · {totalPreguntas} preguntas
              </span>
            </div>
          </div>

          {/* CTA simulacro */}
          <div className="flex flex-col gap-2.5 flex-shrink-0 w-full sm:w-auto">
            <Button
              onClick={() => router.push(`/certificaciones/${slug}/examen`)}
              className="text-[#0A1628] font-bold gap-2 hover:opacity-90 px-5 py-6 text-base"
              style={{ backgroundColor: AWS_ORANGE }}
            >
              <PlayCircle className="w-5 h-5" />
              Iniciar simulacro
            </Button>
            <Button
              onClick={() => router.push(`/certificaciones/${slug}/simulacros`)}
              variant="outline"
              className="border-white/15 text-white/80 hover:bg-white/5 gap-2"
            >
              <Award className="w-4 h-4 text-[#FBBC0C]" />
              Mis intentos previos
            </Button>
          </div>
        </div>
      </div>

      {/* Dominios */}
      <div>
        <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
              Dominios del examen ({data.dominios.length})
            </h2>
            <p className="text-xs text-white/40 mt-1">
              Haz clic en un dominio para abrir las 7 pestañas: video, Gamma,
              teoría, quiz, ejercicio, AI Lab y recursos.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {data.dominios.map((dominio) => (
            <DominioCard
              key={dominio.orden}
              dominio={dominio}
              isExpanded={expandedDominio === dominio.orden}
              onToggle={() =>
                setExpandedDominio((prev) =>
                  prev === dominio.orden ? null : dominio.orden
                )
              }
              slug={slug}
            />
          ))}
        </div>
      </div>

      {/* CTA final simulacro */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-base sm:text-lg font-bold text-white">
              ¿Listo para validar tu preparación?
            </p>
            <p className="text-sm text-white/65 mt-1 max-w-xl">
              Pon a prueba los 4 dominios con un simulacro cronometrado de{" "}
              {data.totalPreguntasSimulacro} preguntas en{" "}
              {data.duracionSimulacroMin} minutos. Necesitas{" "}
              {data.umbralAprobacionPorcentaje}% para aprobar — igual que el
              examen oficial CLF-C02.
            </p>
          </div>
          <Button
            onClick={() => router.push(`/certificaciones/${slug}/examen`)}
            className="text-[#0A1628] font-bold gap-2 hover:opacity-90 px-6 py-6 text-base shrink-0"
            style={{ backgroundColor: AWS_ORANGE }}
          >
            <PlayCircle className="w-5 h-5" />
            Iniciar simulacro
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Vista legacy basada en API (para slugs distintos a aws-cloud-practitioner)
// ─────────────────────────────────────────────────────────────────────────────
function LegacyApiCertView({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState<CertificationProgramWithDomains | null>(null);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id || null);

    const res = await fetch(`/api/certifications/detail?slug=${slug}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setCert(data.certification);

    if (user && data.certification?.id) {
      const attemptsRes = await fetch(
        `/api/certifications/attempts?certification_id=${data.certification.id}`
      );
      if (attemptsRes.ok) {
        const attData = await attemptsRes.json();
        setAttempts(attData.attempts || []);
      }
    }

    setLoading(false);
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleEnroll() {
    if (!cert) return;
    setEnrolling(true);
    try {
      const res = await fetch("/api/certifications/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certification_id: cert.id }),
      });
      if (res.ok) {
        await loadData();
      }
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#FBBC0C]" />
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="p-6 text-center">
        <p className="text-white/40">Certificación no encontrada.</p>
        <Link href="/certificaciones" className="mt-4 inline-block">
          <Button variant="outline" className="border-white/10 text-white/60">
            Volver al catálogo
          </Button>
        </Link>
      </div>
    );
  }

  const isEnrolled = !!cert.enrollment;
  const levelConfig =
    LEVEL_LABELS[cert.nivel_dificultad] ?? LEVEL_LABELS.basico;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-xs text-white/40">
        <Link
          href="/certificaciones"
          className="hover:text-white/70 flex items-center gap-1"
        >
          <ChevronLeft className="w-3 h-3" />
          Certificaciones
        </Link>
        <span>/</span>
        <span className="text-white/60">{cert.nombre}</span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-xl bg-[#1F2F58] flex items-center justify-center text-xl font-black text-[#FBBC0C] flex-shrink-0">
            {cert.proveedor.slice(0, 2)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#73B8E7]/70">
                {cert.proveedor}
              </p>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  levelConfig.color
                )}
              >
                {levelConfig.label}
              </span>
              {cert.estado !== "activa" && (
                <span className="flex items-center gap-1 rounded-full bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 px-2 py-0.5 text-[10px] text-[#FBBC0C]">
                  <AlertTriangle className="w-3 h-3" />
                  {cert.estado === "actualizacion_pendiente"
                    ? "Actualización pendiente"
                    : "Archivada"}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">{cert.nombre}</h1>

            {cert.descripcion && (
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                {cert.descripcion}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#73B8E7]" />
                {cert.certification_domains.length} dominios
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#73B8E7]" />
                ~{cert.duracion_horas_estimada}h de preparación
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#73B8E7]" />
                Examen oficial ${cert.costo_examen_usd}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#73B8E7]" />
                Aprobación {cert.umbral_aprobacion_porcentaje}%
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#73B8E7]" />
                Examen en {cert.idioma_examen}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 flex-shrink-0 w-full sm:w-auto">
            {isEnrolled ? (
              <Button
                onClick={() => router.push(`/certificaciones/${slug}/examen`)}
                className="bg-[#1F2F58] text-white hover:bg-[#2A3F6E] gap-2 border border-[#73B8E7]/20"
              >
                <PlayCircle className="w-4 h-4 text-[#FBBC0C]" />
                Modo Examen
              </Button>
            ) : (
              <Button
                onClick={handleEnroll}
                disabled={enrolling || !userId}
                className="bg-[#FBBC0C] text-[#0A1628] font-bold hover:bg-[#FBBC0C]/90 gap-2"
              >
                {enrolling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    Iniciar preparación
                  </>
                )}
              </Button>
            )}
            {isEnrolled && (
              <Button
                onClick={() => router.push(`/certificaciones/${slug}/examen`)}
                variant="outline"
                className="border-[#FBBC0C]/30 text-[#FBBC0C] hover:bg-[#FBBC0C]/5 gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Simulacro de examen
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4">
          Dominios del examen ({cert.certification_domains.length})
        </h2>
        <DomainList
          domains={cert.certification_domains}
          certificationSlug={slug}
        />
      </div>

      {isEnrolled && (
        <ExamHistoryChart
          attempts={attempts}
          umbralPorcentaje={cert.umbral_aprobacion_porcentaje}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────
export default function CertificationDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  if (slug === "aws-cloud-practitioner") {
    return <AwsCertView data={awsCloudPractitionerData} slug={slug} />;
  }

  return <LegacyApiCertView slug={slug} />;
}
