"use client";

import Link from "next/link";
import {
  PlayCircle,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Circle,
} from "lucide-react";

export default function DemoAulaDashboard() {
  const progress = 0;
  const daysCompleted = 0;
  const daysTotal = 20;

  const days = [
    { num: 1, title: "Hoy hago una IA que habla como yo", tools: "Suno · Midjourney · Lovable", duration: "2h en vivo + 1h autónomo", status: "available", href: "/demo/aula/dia-1" },
    { num: 2, title: "Mi voz habla 5 idiomas", tools: "ElevenLabs · HeyGen · Gemini", duration: "2h en vivo + 1h autónomo", status: "available", href: "/demo/aula/dia-2" },
    { num: 3, title: "Animé mi foto del colegio", tools: "Kling · Runway · Pika Labs", duration: "2h en vivo + 1h autónomo", status: "available", href: "/demo/aula/dia-3" },
    { num: 4, title: "Agentes que trabajan por mí", tools: "Cursor · n8n · APIs", duration: "2h en vivo + 1h autónomo", status: "locked" },
    { num: 5, title: "Demo Day — presenta tu proyecto", tools: "Todas + tu narrativa", duration: "Presentación final", status: "locked" },
  ] as const;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 text-[#FBBC0C] text-[10px] font-bold tracking-[0.2em] uppercase mb-5">
          <Sparkles className="w-3 h-3" />
          Bienvenido al Campus
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold leading-tight mb-3"
          style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
        >
          Hola <span className="text-[#FBBC0C]">Estudiante</span>,
          <br />
          <span className="text-[#73B8E7] text-3xl md:text-4xl">
            así se verá tu campus cuando empieces.
          </span>
        </h1>
        <p className="text-white/60 max-w-2xl leading-relaxed">
          Este es el modo demo. Tienes habilitados 3 primeros días del
          Preuniversitario IGNITE para que veas videos, presentaciones,
          ejercicios y herramientas reales funcionando. El resto se desbloquea
          cuando empiece tu cohorte oficial en junio 2026.
        </p>
      </section>

      {/* Stats */}
      <section className="grid md:grid-cols-4 gap-4">
        <StatCard icon={<Flame className="w-5 h-5" />} label="Progreso" value={`${daysCompleted} / ${daysTotal}`} caption="días completados" accent="#FBBC0C" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Esta semana" value="0h" caption="estudiado" accent="#73B8E7" />
        <StatCard icon={<PlayCircle className="w-5 h-5" />} label="Próximo inicio" value="Junio" caption="cohorte 2026" accent="#F0846D" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Proyectos" value="0 / 20" caption="entregados" accent="#FBBC0C" />
      </section>

      {/* Progress bar */}
      <section>
        <div className="flex items-center justify-between mb-2 text-xs text-white/50 uppercase tracking-widest">
          <span>Programa · 20 días</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-[#1F2F58] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Continuar con */}
      <section>
        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-4">
          Continuar con
        </h2>
        <Link
          href="/demo/aula/dia-1"
          className="group block relative overflow-hidden p-6 md:p-8 rounded-3xl border border-[#FBBC0C]/30 transition-all hover:border-[#FBBC0C]"
          style={{
            background:
              "linear-gradient(145deg, rgba(251,188,12,0.08) 0%, rgba(31,47,88,0.5) 100%)",
          }}
        >
          <div aria-hidden className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#FBBC0C]/10 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div
              className="shrink-0 text-6xl md:text-7xl font-bold text-[#FBBC0C] leading-none"
              style={{ fontFamily: "var(--font-space-grotesk), serif", fontStyle: "italic" }}
            >
              01
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold tracking-widest uppercase text-[#73B8E7] mb-2">
                Día 1 · Semana 1 · Ignición
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Hoy hago una IA que habla como yo
              </h3>
              <p className="text-white/60 mb-3 text-sm leading-relaxed">
                Tu primera sesión: canción con Suno, avatar con Midjourney, app
                funcional con Lovable. Todo en 2 horas.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-white font-mono">🎵 Suno</span>
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-white font-mono">🎨 Midjourney</span>
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-white font-mono">💻 Lovable</span>
              </div>
            </div>
            <div className="shrink-0">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FBBC0C] text-[#0A1628] font-bold text-sm group-hover:bg-[#E5AB00] transition-all">
                Empezar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Todos los días */}
      <section>
        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-4">
          Todos los días del programa
        </h2>
        <div className="space-y-2">
          {days.map((d) => (
            <DayRow key={d.num} day={d} />
          ))}
          <div className="p-6 rounded-2xl border border-dashed border-white/[0.08] text-center text-sm text-white/40">
            + 15 días más se desbloquean con tu cohorte oficial (junio 2026)
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  caption,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption: string;
  accent: string;
}) {
  return (
    <div className="relative p-5 rounded-2xl border border-white/[0.08] bg-[#1F2F58]/30 overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 blur-2xl"
        style={{ background: accent }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">
          <span style={{ color: accent }}>{icon}</span>
          {label}
        </div>
        <div
          className="text-2xl font-bold mb-0.5"
          style={{ color: accent, fontFamily: "var(--font-space-grotesk), sans-serif" }}
        >
          {value}
        </div>
        <div className="text-xs text-white/50">{caption}</div>
      </div>
    </div>
  );
}

type Day = {
  num: number;
  title: string;
  tools: string;
  duration: string;
  status: "available" | "locked";
  href?: string;
};

function DayRow({ day }: { day: Day }) {
  const body = (
    <div
      className={`group flex items-center gap-4 p-4 md:p-5 rounded-xl border transition-all ${
        day.status === "available"
          ? "border-white/[0.08] bg-[#1F2F58]/20 hover:border-[#FBBC0C]/30 hover:bg-[#1F2F58]/40"
          : "border-white/[0.04] bg-[#1F2F58]/10 opacity-60"
      }`}
    >
      <div className="shrink-0 w-12 h-12 rounded-full bg-[#0A1628] border border-[#FBBC0C]/30 flex items-center justify-center text-[#FBBC0C] font-bold text-sm">
        {String(day.num).padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm md:text-base mb-0.5 truncate">{day.title}</div>
        <div className="text-xs text-white/50 uppercase tracking-wider truncate font-mono">
          {day.tools}
        </div>
      </div>
      <div className="hidden md:block text-xs text-white/40 text-right shrink-0">
        {day.duration}
      </div>
      <div className="shrink-0">
        {day.status === "available" ? (
          <ArrowRight className="w-5 h-5 text-[#FBBC0C] group-hover:translate-x-1 transition-transform" />
        ) : (
          <Circle className="w-5 h-5 text-white/20" />
        )}
      </div>
    </div>
  );

  if (day.status === "available" && day.href) {
    return <Link href={day.href}>{body}</Link>;
  }
  return body;
}
