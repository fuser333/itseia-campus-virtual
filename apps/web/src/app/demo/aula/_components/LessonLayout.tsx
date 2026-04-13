"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  Play,
  Users,
  MessageSquare,
} from "lucide-react";
import type { ReactNode, ComponentType } from "react";

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
  return (
    <div className="space-y-10 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-white/40">
        <Link href="/demo/aula" className="hover:text-[#FBBC0C] transition-colors">
          Mi panel
        </Link>
        <span className="opacity-40">/</span>
        <span>{weekName}</span>
        <span className="opacity-40">/</span>
        <span className="text-white">Día {dayNum}</span>
      </div>

      {/* Header */}
      <header>
        <div className="flex items-start gap-6">
          <div
            className="hidden md:block shrink-0 text-7xl font-bold text-[#FBBC0C] leading-none"
            style={{ fontFamily: "var(--font-space-grotesk), serif", fontStyle: "italic" }}
          >
            {String(dayNum).padStart(2, "0")}
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 text-[#FBBC0C] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
              <Sparkles className="w-3 h-3" />
              {weekName}
            </div>
            <h1
              className="text-3xl md:text-5xl font-bold leading-tight mb-3"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              {title}
            </h1>
            <p className="text-lg text-white/60 mb-4">{subtitle}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 text-white/50">
                <Clock className="w-4 h-4" /> {duration}
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/50">
                <Target className="w-4 h-4" /> {tools.length} herramientas
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Objetivos */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-[#FBBC0C]/20 bg-[#FBBC0C]/5">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FBBC0C] mb-2">
            Objetivo emocional
          </div>
          <p className="text-white">{emotionalGoal}</p>
        </div>
        <div className="p-5 rounded-2xl border border-[#73B8E7]/20 bg-[#73B8E7]/5">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#73B8E7] mb-2">
            Objetivo técnico
          </div>
          <p className="text-white">{technicalGoal}</p>
        </div>
      </section>

      {/* Video */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Play className="w-4 h-4 text-[#FBBC0C]" />
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">
            Clase en vivo · grabación
          </h2>
        </div>
        <div className="aspect-video rounded-2xl overflow-hidden border border-white/[0.08] bg-[#1F2F58]">
          {videoEmbed ? (
            <iframe
              src={videoEmbed}
              title={`Día ${dayNum} · Clase`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
              <Play className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Video de la clase</p>
              <p className="text-xs opacity-60 mt-1">
                Disponible al inicio de la cohorte oficial
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Herramientas */}
      <section>
        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">
          Herramientas que vas a usar hoy
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="p-5 rounded-2xl border border-white/[0.08] bg-[#1F2F58]/20 hover:border-[#FBBC0C]/30 hover:bg-[#1F2F58]/40 transition-all"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                style={{
                  backgroundColor: tool.logoColor + "20",
                  color: tool.logoColor,
                }}
              >
                {tool.emoji}
              </div>
              <div className="font-bold mb-1">{tool.name}</div>
              <div className="text-sm text-white/60">{tool.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Agenda */}
      <section>
        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">
          Estructura de la sesión · 2 horas
        </h2>
        <div className="space-y-3">
          {agenda.map((block, idx) => (
            <div
              key={idx}
              className="flex gap-5 items-start p-4 rounded-xl border border-white/[0.08] bg-[#1F2F58]/20"
            >
              <div className="shrink-0 w-20 text-right">
                <div className="text-xs font-mono font-bold text-[#FBBC0C]">
                  {block.time}
                </div>
              </div>
              <div className="w-px h-14 bg-white/[0.08]" />
              <div className="flex-1 pt-0.5">
                <div className="font-bold mb-1 text-white">{block.title}</div>
                <div className="text-sm text-white/60">{block.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Proyecto */}
      <section
        className="p-6 md:p-8 rounded-3xl border border-[#F0846D]/30"
        style={{
          background:
            "linear-gradient(145deg, rgba(240,132,109,0.15) 0%, rgba(251,188,12,0.08) 100%)",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0846D]/20 text-[#F0846D] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
          <CheckCircle2 className="w-3 h-3" />
          Proyecto del día
        </div>
        <h3 className="text-xl font-bold mb-3">Tu tarea autónoma (1 hora)</h3>
        <p className="text-white mb-4">{assignment}</p>
        <div className="pt-4 border-t border-white/[0.08]">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FBBC0C] mb-2">
            Entregable
          </div>
          <p className="text-sm text-white/70">{deliverable}</p>
        </div>
      </section>

      {/* Foro / cohorte placeholder */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#1F2F58]/20">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-5 h-5 text-[#73B8E7]" />
            <h3 className="font-bold">Foro del día</h3>
          </div>
          <p className="text-sm text-white/60 mb-3">
            Comparte tu proyecto con la cohorte. Da feedback a 2 compañeros.
          </p>
          <div className="px-3 py-2 rounded-full bg-white/5 text-xs text-white/40 inline-block">
            🔒 Disponible en la cohorte oficial
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#1F2F58]/20">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-[#73B8E7]" />
            <h3 className="font-bold">Tu cohorte</h3>
          </div>
          <p className="text-sm text-white/60 mb-3">
            30 estudiantes en tu cohorte de junio. Chat de clase + foros.
          </p>
          <div className="px-3 py-2 rounded-full bg-white/5 text-xs text-white/40 inline-block">
            🔒 Disponible en la cohorte oficial
          </div>
        </div>
      </section>

      {children}

      {/* Nav */}
      <nav className="flex items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
        {prevDay ? (
          <Link
            href={prevDay.href}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-[#FBBC0C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Día {prevDay.num}
          </Link>
        ) : (
          <Link
            href="/demo/aula"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-[#FBBC0C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al panel
          </Link>
        )}
        {nextDay && (
          <Link
            href={nextDay.href}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FBBC0C] text-[#0A1628] font-bold text-sm hover:bg-[#E5AB00] transition-all"
          >
            Día {nextDay.num}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </nav>
    </div>
  );
}
