"use client";

import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Brain,
  PlayCircle,
  Clock,
  MessageCircle,
  Sparkles,
  Zap,
  Users,
  Trophy,
} from "lucide-react";
import { IGNITE_WEEKS } from "./_data/ignite";

// ── Stats del demo ──────────────────────────────────────────────────────────

const DEMO_STATS = [
  { icon: Zap,    value: "20",   label: "días de programa",   color: "#FBBC0C" },
  { icon: Users,  value: "120h", label: "de contenido real",  color: "#73B8E7" },
  { icon: Trophy, value: "$99",  label: "precio total",       color: "#F0846D" },
  { icon: Brain,  value: "3",    label: "días gratis hoy",    color: "#22c55e" },
];

// ── WhatsApp Sofía ──────────────────────────────────────────────────────────

const WA_SOFIA = "https://wa.me/593990709009?text=Hola+Sof%C3%ADa%2C+acabo+de+probar+el+demo+de+ITSEIA+Ignite+y+quiero+reclamar+mi+beca+de+%2499";

export default function DemoAulaDashboard() {
  const allSessions  = IGNITE_WEEKS.flatMap((w) => w.subjects.flatMap((s) => s.sessions));
  const totalSessions   = allSessions.length;
  const availableCount  = allSessions.filter((s) => s.status === "available").length;

  return (
    <div style={{ color: "#1F2F58" }}>

      {/* ── Hero banner ────────────────────────────────────────────────────── */}
      <div
        className="mb-8 rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1F2F58 0%, #0A1628 100%)",
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(251,188,12,0.15) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 80%, rgba(115,184,231,0.10) 0%, transparent 55%)
            `,
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#FBBC0C]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FBBC0C]">
              Demo gratuito · 3 días de acceso
            </span>
          </div>

          <h1
            className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-3"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            Prueba ITSEIA{" "}
            <span className="text-[#FBBC0C]">gratis</span>
          </h1>
          <p className="text-sm sm:text-base text-white/65 max-w-lg mb-6">
            Estos son los 3 primeros días del preuniversitario de 20 días. Sin tarjeta, sin registro. Experimenta lo que hacen los estudiantes de ITSEIA todos los días.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={WA_SOFIA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FBBC0C] text-[#0A1628] text-sm font-bold hover:bg-[#FBBC0C]/90 transition-colors shadow-lg shadow-[#FBBC0C]/25"
            >
              <MessageCircle className="w-4 h-4" />
              Hablar con Sofía y reclamar mi beca
            </a>
            <Link
              href="/demo/aula/sesion/1"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              Empezar ahora — Día 1
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats demo ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {DEMO_STATS.map(({ icon: Icon, value, label, color }) => (
          <div
            key={label}
            className="rounded-2xl border p-4"
            style={{ borderColor: "#1F2F5815", backgroundColor: "#fff" }}
          >
            <Icon className="w-5 h-5 mb-2" style={{ color }} />
            <p className="text-2xl font-bold" style={{ color: "#0A1628" }}>
              {value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#1F2F5870" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── CTA WhatsApp Sofía inline ──────────────────────────────────────── */}
      <div
        className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
        style={{ borderColor: "#FBBC0C40", backgroundColor: "#FBBC0C08" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#FBBC0C20" }}
          >
            <MessageCircle className="w-5 h-5" style={{ color: "#FBBC0C" }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>
              ¿Dudas sobre el programa o el precio?
            </p>
            <p className="text-xs" style={{ color: "#1F2F5880" }}>
              Sofía responde en menos de 10 minutos · WhatsApp +593 99 070 9009
            </p>
          </div>
        </div>
        <a
          href={WA_SOFIA}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#FBBC0C", color: "#0A1628" }}
        >
          Hablar con Sofía
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      {/* ── Header de secciones ─────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#0A1628" }}>
            Los 20 días del programa
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#1F2F5880" }}>
            {availableCount} de {totalSessions} días disponibles en el demo
          </p>
        </div>
        <div
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "#22c55e22", color: "#16a34a" }}
        >
          {availableCount} gratis
        </div>
      </div>

      {/* ── Lista de semanas ──────────────────────────────────────────────── */}
      <div className="space-y-6">
        {IGNITE_WEEKS.map((week) => {
          const weekSessions  = week.subjects.flatMap((s) => s.sessions);
          const weekAvailable = weekSessions.filter((s) => s.status === "available").length;
          const isOpen        = weekAvailable > 0;

          return (
            <div
              key={week.number}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "#1F2F5815", backgroundColor: "#fff" }}
            >
              {/* Week header */}
              <div
                className="px-5 py-4 border-b flex items-center justify-between gap-3"
                style={{ borderColor: "#1F2F5810", backgroundColor: "#F9F6E7" }}
              >
                <div>
                  <h3 className="text-base font-bold" style={{ color: "#0A1628" }}>
                    Semana {week.number}: {week.name}
                  </h3>
                  <p className="mt-0.5 text-sm" style={{ color: "#1F2F5880" }}>
                    {week.tagline}
                  </p>
                </div>
                {isOpen ? (
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "#22c55e22", color: "#16a34a" }}
                  >
                    Demo activo
                  </span>
                ) : (
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "#1F2F5810", color: "#1F2F58AA" }}
                  >
                    Cohorte oficial
                  </span>
                )}
              </div>

              {/* Sessions */}
              <ul className="divide-y" style={{ borderColor: "#1F2F5808" }}>
                {weekSessions.map((session) => {
                  const isAvailable = session.status === "available";
                  const sessionUrl  = isAvailable
                    ? `/demo/aula/sesion/${session.number}`
                    : "#";

                  const Row = (
                    <div
                      className="flex items-center gap-4 px-5 py-4 transition-colors"
                      style={{ color: "#1F2F58", opacity: isAvailable ? 1 : 0.55 }}
                    >
                      {/* Number circle */}
                      <div className="flex-shrink-0">
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: "#1F2F5830" }}
                        >
                          <span className="text-[10px] font-bold" style={{ color: "#1F2F5860" }}>
                            {session.number}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-snug truncate" style={{ color: "#0A1628" }}>
                          Día {session.number}: {session.title}
                        </p>
                        <p className="text-xs mt-0.5 truncate" style={{ color: "#1F2F5870" }}>
                          {session.description}
                        </p>
                      </div>

                      {/* Duration */}
                      {session.durationMinutes > 0 && (
                        <div className="hidden sm:flex items-center gap-1 flex-shrink-0" style={{ color: "#1F2F5860" }}>
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">{session.durationMinutes} min</span>
                        </div>
                      )}

                      {/* CTA */}
                      <div className="flex-shrink-0 flex items-center gap-1">
                        {isAvailable ? (
                          <>
                            <span className="text-xs font-semibold hidden sm:block" style={{ color: "#FBBC0C" }}>
                              Iniciar
                            </span>
                            <PlayCircle className="w-4 h-4" style={{ color: "#FBBC0C" }} />
                          </>
                        ) : (
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                            style={{ backgroundColor: "#1F2F5810", color: "#1F2F58AA" }}
                          >
                            Cohorte
                          </span>
                        )}
                      </div>
                    </div>
                  );

                  return (
                    <li key={session.number}>
                      {isAvailable ? (
                        <Link href={sessionUrl} className="block hover:bg-[#FBBC0C]/5 transition-colors">
                          {Row}
                        </Link>
                      ) : (
                        Row
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Link semana completa */}
              <div className="px-5 py-3 border-t flex items-center justify-end" style={{ borderColor: "#1F2F5808" }}>
                <Link
                  href={`/demo/aula/semana-${week.number}`}
                  className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                  style={{ color: "#1F2F58" }}
                >
                  Ver semana completa
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer CTA ────────────────────────────────────────────────────── */}
      <div
        className="mt-10 rounded-2xl border p-6 text-center"
        style={{ borderColor: "#FBBC0C40", backgroundColor: "#FBBC0C08" }}
      >
        <h3 className="text-lg font-bold" style={{ color: "#0A1628" }}>
          ¿Listo para los 20 días completos?
        </h3>
        <p className="mt-1.5 text-sm" style={{ color: "#1F2F58AA" }}>
          El programa completo cuesta $99 — pago único, incluye todas las semanas, clases en vivo con Héctor Velasco y certificado ITSEIA.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
          <a
            href={WA_SOFIA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FBBC0C] text-[#0A1628] text-sm font-bold hover:bg-[#FBBC0C]/90 transition-colors shadow-lg shadow-[#FBBC0C]/20"
          >
            <MessageCircle className="w-4 h-4" />
            Hablar con Sofía y reclamar mi beca
          </a>
          <Link
            href="/preuni-info"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ borderColor: "#1F2F5830", color: "#0A1628" }}
          >
            Ver programa completo
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
