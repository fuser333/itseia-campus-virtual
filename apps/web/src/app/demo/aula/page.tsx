"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  TrendingUp,
  Clock,
  ArrowRight,
  MessageCircle,
  Sparkles,
  PlayCircle,
  Users,
} from "lucide-react";

type DemoUser = {
  email: string;
  name: string;
  loggedAt: number;
};

export default function DemoAulaDashboard() {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("itseia_demo_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "estudiante";

  return (
    <>
      {/* ── Header gradient (igual al /b2b) ───────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FBBC0C] mb-1">
              Panel del Preuniversitario
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bienvenido, {firstName}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Aquí exploras el demo del Preuniversitario ITSEIA. 3 días completos disponibles.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/593997489821?text=Hola%2C%20estoy%20probando%20el%20demo%20de%20ITSEIA%20y%20tengo%20una%20pregunta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
            >
              <MessageCircle className="size-4" />
              Soporte WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── KPI cards ───────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={<BookOpen className="size-5 text-[#73B8E7]" />}
          label="Días del Programa"
          value="20"
          sub="3 disponibles en demo"
          accent="bg-[#73B8E7]/10"
        />
        <KpiCard
          icon={<Clock className="size-5 text-[#FBBC0C]" />}
          label="Horas en vivo"
          value="40h"
          sub="clase sincrónica total"
          accent="bg-[#FBBC0C]/10"
        />
        <KpiCard
          icon={<TrendingUp className="size-5 text-[#F0846D]" />}
          label="Inicio cohorte"
          value="Junio 2026"
          sub="100% online"
          accent="bg-[#F0846D]/10"
        />
      </div>

      {/* ── Progreso del demo ────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#1F2F58]/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#FBBC0C]" />
            <p className="text-sm font-semibold text-[#0A1628]">Progreso del demo</p>
          </div>
          <p className="text-xs font-semibold text-[#1F2F58]/60">0 / 3 días</p>
        </div>
        <div className="h-2 rounded-full bg-[#1F2F58]/8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D]" style={{ width: "0%" }} />
        </div>
      </div>

      {/* ── Programa activo (cards blancos estilo /b2b) ─────────── */}
      <div>
        <h2 className="mb-1 text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="size-5 text-[#73B8E7]" />
          Programa Activo
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Los 3 primeros días del Preuniversitario IGNITE. Cada día tiene video, presentación, agenda y proyecto práctico.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DayCard num={1} title="Hoy hago una IA que habla como yo" tools="Suno · Midjourney · Lovable" duration="2h + 1h autónomo" href="/demo/aula/dia-1" active />
          <DayCard num={2} title="Mi voz habla 5 idiomas" tools="ElevenLabs · HeyGen · Gemini" duration="2h + 1h autónomo" href="/demo/aula/dia-2" />
          <DayCard num={3} title="Animé mi foto del colegio" tools="Kling · Runway · Pika Labs" duration="2h + 1h autónomo" href="/demo/aula/dia-3" />
        </div>
      </div>

      {/* ── Días futuros (lock) ──────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="size-5 text-[#73B8E7]" />
          Resto del programa
        </h2>
        <div className="rounded-2xl border border-dashed border-[#1F2F58]/15 bg-[#1F2F58]/5 p-8 text-center">
          <p className="text-sm font-semibold text-[#0A1628] mb-1">
            +17 días más se desbloquean con tu cohorte oficial
          </p>
          <p className="text-xs text-[#1F2F58]/60">
            Semana 2: Construcción · Semana 3: Automatización · Semana 4: Lanzamiento (Demo Day)
          </p>
          <Link
            href="/preuni-info"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-[#FBBC0C] hover:text-[#E5AB00] transition-colors"
          >
            Ver programa completo <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </>
  );
}

// ── KPI Card (copy exacto del /b2b) ───────────────────────────────

function KpiCard({
  icon,
  label,
  value,
  sub,
  accent,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: string;
  href?: string;
}) {
  const body = (
    <div className="rounded-2xl border border-[#1F2F58]/8 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`mb-3 inline-flex size-10 items-center justify-center rounded-lg ${accent}`}>
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#1F2F58]/50">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-[#0A1628]">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-[#1F2F58]/50">{sub}</p>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

// ── Day Card ──────────────────────────────────────────────────────

function DayCard({
  num,
  title,
  tools,
  duration,
  href,
  active,
}: {
  num: number;
  title: string;
  tools: string;
  duration: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link href={href} className="group block">
      <div className="rounded-2xl border border-[#1F2F58]/8 bg-white shadow-sm hover:shadow-md transition-all group-hover:-translate-y-0.5 overflow-hidden">
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#1F2F58]/8">
              <PlayCircle className="size-5 text-[#1F2F58]" />
            </div>
            {active && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                En curso
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1F2F58]/50 mb-1">
              Día {String(num).padStart(2, "0")}
            </p>
            <p className="font-semibold text-[#0A1628] leading-tight mb-1">
              {title}
            </p>
            <p className="text-xs text-[#1F2F58]/60 mt-0.5">{tools}</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#1F2F58]/5">
            <span className="text-xs text-[#1F2F58]/50 flex items-center gap-1">
              <Clock className="size-3" /> {duration}
            </span>
            <span className="text-xs font-semibold text-[#1F2F58]/40 flex items-center gap-1 group-hover:text-[#FBBC0C] group-hover:gap-1.5 transition-all">
              Ir al día
              <ArrowRight className="size-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
