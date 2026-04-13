"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Play,
  Presentation,
  BookOpen,
  HelpCircle,
  FileEdit,
  Sparkles,
  Link2,
  Video,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Home as HomeIcon,
  ChevronRight,
} from "lucide-react";

export type LessonTool = {
  name: string;
  emoji: string;
  logoColor: string;
  desc: string;
};

export type LessonBlock = {
  time: string;
  title: string;
  description: string;
};

export type LessonProps = {
  dayNum: number;
  weekName: string;
  title: string;
  subtitle: string;
  emotionalGoal: string;
  technicalGoal: string;
  duration: string;
  tools: LessonTool[];
  agenda: LessonBlock[];
  assignment: string;
  deliverable: string;
  videoEmbed?: string;
  prevDay?: { num: number; href: string };
  nextDay?: { num: number; href: string };
  children?: ReactNode;
};

type TabId = "video" | "slides" | "theory" | "quiz" | "assignment" | "ailab" | "resources" | "live";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }>; available: boolean }[] = [
  { id: "video", label: "Video", icon: Play, available: true },
  { id: "slides", label: "Presentación", icon: Presentation, available: true },
  { id: "theory", label: "Teoría", icon: BookOpen, available: true },
  { id: "quiz", label: "Quiz", icon: HelpCircle, available: false },
  { id: "assignment", label: "Ejercicio", icon: FileEdit, available: true },
  { id: "ailab", label: "AI Lab", icon: Sparkles, available: false },
  { id: "resources", label: "Recursos", icon: Link2, available: false },
  { id: "live", label: "Clase en Vivo", icon: Video, available: false },
];

export default function LessonLayout({
  dayNum,
  weekName,
  title,
  subtitle,
  emotionalGoal,
  technicalGoal,
  duration,
  tools,
  agenda,
  assignment,
  deliverable,
  videoEmbed,
  prevDay,
  nextDay,
  children,
}: LessonProps) {
  const [activeTab, setActiveTab] = useState<TabId>("video");

  return (
    <>
      {/* ── Breadcrumb ────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#1F2F58]/60">
        <Link href="/demo/aula" className="inline-flex items-center gap-1 hover:text-[#FBBC0C] transition-colors">
          <HomeIcon className="size-4" /> Inicio
        </Link>
        <ChevronRight className="size-3.5 text-[#1F2F58]/30" />
        <span>{weekName}</span>
        <ChevronRight className="size-3.5 text-[#1F2F58]/30" />
        <span className="text-[#0A1628] font-semibold">Día {dayNum}</span>
      </nav>

      {/* ── Header (gradient navy, como /b2b y /carreras/[slug]) ── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FBBC0C] mb-1">
              {weekName} · Día {String(dayNum).padStart(2, "0")}
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-2">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-3xl">{subtitle}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" /> {duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> {tools.length} herramientas
              </span>
              <span>4 créditos</span>
            </div>
          </div>
          <div className="shrink-0">
            <CircularProgress value={0} label={`0/${TABS.filter((t) => t.available).length} completadas`} />
          </div>
        </div>
      </div>

      {/* ── Tabs horizontales (estilo exacto del /b2b) ──────────── */}
      <div className="rounded-2xl border border-[#1F2F58]/8 bg-white shadow-sm overflow-hidden">
        <div className="sticky top-0 z-10 border-b border-[#1F2F58]/8 bg-white overflow-x-auto">
          <div className="flex min-w-max px-4 gap-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => tab.available && setActiveTab(tab.id)}
                  disabled={!tab.available}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "text-[#FBBC0C]"
                      : tab.available
                        ? "text-[#1F2F58]/60 hover:text-[#0A1628]"
                        : "text-[#1F2F58]/25 cursor-not-allowed"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                  {tab.available && (
                    <span className="ml-1 size-1.5 rounded-full bg-emerald-500" />
                  )}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 bg-[#FBBC0C]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 sm:p-8 min-h-[280px]">
          {activeTab === "video" && <VideoContent videoEmbed={videoEmbed} />}
          {activeTab === "slides" && <SlidesContent />}
          {activeTab === "theory" && (
            <TheoryContent emotionalGoal={emotionalGoal} technicalGoal={technicalGoal} />
          )}
          {activeTab === "assignment" && (
            <AssignmentContent assignment={assignment} deliverable={deliverable} agenda={agenda} />
          )}
          {activeTab === "quiz" && <LockedContent label="Quiz" />}
          {activeTab === "ailab" && <LockedContent label="AI Lab" />}
          {activeTab === "resources" && <LockedContent label="Recursos" />}
          {activeTab === "live" && <LockedContent label="Clase en Vivo" />}
        </div>
      </div>

      {/* ── Herramientas ─────────────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-[#0A1628] flex items-center gap-2">
          <Sparkles className="size-4 text-[#FBBC0C]" /> Herramientas de la clase
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="rounded-2xl border border-[#1F2F58]/8 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="mb-3 inline-flex size-10 items-center justify-center rounded-lg text-xl"
                style={{ background: tool.logoColor + "20", color: tool.logoColor }}
              >
                {tool.emoji}
              </div>
              <p className="font-semibold text-[#0A1628]">{tool.name}</p>
              <p className="mt-1 text-xs text-[#1F2F58]/60 leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {children}

      {/* ── Nav anterior/siguiente ───────────────────────────────── */}
      <nav className="flex items-center justify-between gap-3 pt-6 border-t border-[#1F2F58]/8">
        {prevDay ? (
          <Link
            href={prevDay.href}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#1F2F58]/70 hover:bg-[#1F2F58]/5 hover:text-[#0A1628] transition-colors"
          >
            <ArrowLeft className="size-4" /> Día {prevDay.num}
          </Link>
        ) : (
          <Link
            href="/demo/aula"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#1F2F58]/70 hover:bg-[#1F2F58]/5 hover:text-[#0A1628] transition-colors"
          >
            <ArrowLeft className="size-4" /> Volver al panel
          </Link>
        )}
        {nextDay && (
          <Link
            href={nextDay.href}
            className="inline-flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-5 py-2.5 text-sm font-bold text-[#0A1628] hover:bg-[#E5AB00] transition-colors"
          >
            Día {nextDay.num} <ArrowRight className="size-4" />
          </Link>
        )}
      </nav>
    </>
  );
}

// ── Tab contents ─────────────────────────────────────────────────

function VideoContent({ videoEmbed }: { videoEmbed?: string }) {
  if (!videoEmbed) {
    return (
      <div className="aspect-video rounded-xl bg-[#1F2F58]/5 border border-dashed border-[#1F2F58]/15 flex flex-col items-center justify-center text-[#1F2F58]/40">
        <Play className="size-10 mb-2" />
        <p className="text-sm font-semibold">Video de la clase</p>
        <p className="text-xs mt-1">Disponible cuando empiece tu cohorte</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="aspect-video rounded-xl overflow-hidden border border-[#1F2F58]/10 bg-black">
        <iframe
          src={videoEmbed}
          title="Video de la clase"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <p className="text-xs text-[#1F2F58]/50 flex items-center gap-1.5">
        <Play className="size-3" /> Grabación de la sesión · puedes verla a tu ritmo.
      </p>
    </div>
  );
}

function SlidesContent() {
  return (
    <div className="aspect-video rounded-xl bg-[#1F2F58]/5 border border-dashed border-[#1F2F58]/15 flex flex-col items-center justify-center text-[#1F2F58]/40 text-center px-6">
      <Presentation className="size-10 mb-2" />
      <p className="text-sm font-semibold text-[#1F2F58]/70">Presentación (Gamma)</p>
      <p className="text-xs mt-1 max-w-md">
        Las slides de la clase se embeben aquí cuando arranque tu cohorte. Las preparamos específicamente para tu grupo.
      </p>
    </div>
  );
}

function TheoryContent({ emotionalGoal, technicalGoal }: { emotionalGoal: string; technicalGoal: string }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#FBBC0C]/30 bg-[#FBBC0C]/5 p-5">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FBBC0C] mb-2">
            Objetivo emocional
          </p>
          <p className="text-sm text-[#0A1628] leading-relaxed">{emotionalGoal}</p>
        </div>
        <div className="rounded-xl border border-[#73B8E7]/30 bg-[#73B8E7]/5 p-5">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#73B8E7] mb-2">
            Objetivo técnico
          </p>
          <p className="text-sm text-[#0A1628] leading-relaxed">{technicalGoal}</p>
        </div>
      </div>
      <div className="rounded-xl border border-[#1F2F58]/10 bg-[#1F2F58]/[0.02] p-5">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1F2F58]/60 mb-2">
          Material teórico
        </p>
        <p className="text-sm text-[#1F2F58]/70 leading-relaxed">
          En la versión completa de la clase, aquí encontrarás la teoría escrita de la sesión:
          conceptos base, fundamentos técnicos de cada herramienta y referencias cruzadas con el
          material de apoyo. El material teórico se prepara antes del inicio de tu cohorte oficial.
        </p>
      </div>
    </div>
  );
}

function AssignmentContent({
  assignment,
  deliverable,
  agenda,
}: {
  assignment: string;
  deliverable: string;
  agenda: LessonBlock[];
}) {
  return (
    <div className="space-y-6">
      {/* Agenda */}
      <div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#1F2F58]/60 mb-3">
          Estructura de la sesión · 2 horas
        </p>
        <div className="space-y-2">
          {agenda.map((block, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-start p-3 rounded-lg bg-[#1F2F58]/[0.02] border border-[#1F2F58]/5"
            >
              <div className="shrink-0 w-20 text-right">
                <div className="text-[11px] font-mono font-bold text-[#FBBC0C]">{block.time}</div>
              </div>
              <div className="w-px h-10 bg-[#1F2F58]/10" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0A1628]">{block.title}</p>
                <p className="text-xs text-[#1F2F58]/60 mt-0.5">{block.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proyecto */}
      <div className="rounded-xl border border-[#F0846D]/30 bg-gradient-to-br from-[#F0846D]/10 to-[#FBBC0C]/5 p-5">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#F0846D] mb-3">
          <CheckCircle2 className="size-3" />
          Proyecto autónomo (1 hora)
        </div>
        <p className="text-sm text-[#0A1628] leading-relaxed mb-3">{assignment}</p>
        <div className="pt-3 border-t border-[#F0846D]/20">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FBBC0C] mb-1">
            Entregable
          </p>
          <p className="text-xs text-[#1F2F58]/70">{deliverable}</p>
        </div>
      </div>
    </div>
  );
}

function LockedContent({ label }: { label: string }) {
  return (
    <div className="rounded-xl bg-[#1F2F58]/5 border border-dashed border-[#1F2F58]/15 p-8 text-center">
      <p className="text-sm font-semibold text-[#0A1628] mb-1">{label}</p>
      <p className="text-xs text-[#1F2F58]/50 max-w-md mx-auto">
        Esta pestaña se habilita durante tu cohorte oficial con los recursos personalizados de tu grupo.
      </p>
    </div>
  );
}

// ── Circular progress ────────────────────────────────────────────

function CircularProgress({ value, label }: { value: number; label: string }) {
  const radius = 30;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3">
      <div className="relative size-[72px]">
        <svg viewBox="0 0 72 72" className="size-[72px] -rotate-90">
          <circle cx="36" cy="36" r={radius} strokeWidth={stroke} fill="none" stroke="rgba(255,255,255,0.15)" />
          <circle
            cx="36"
            cy="36"
            r={radius}
            strokeWidth={stroke}
            fill="none"
            stroke="#FBBC0C"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#FBBC0C]">
          {value}%
        </div>
      </div>
      <div className="text-left text-xs text-white/70 max-w-[100px] leading-tight">{label}</div>
    </div>
  );
}
