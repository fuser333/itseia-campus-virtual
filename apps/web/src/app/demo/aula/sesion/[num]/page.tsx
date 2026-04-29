"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Target,
  Sparkles,
  Clock,
  MessageCircle,
} from "lucide-react";
import SessionTabs, { type SessionTab } from "@/components/session/SessionTabs";
import GrabacionesTab from "@/components/session/GrabacionesTab";
import AILabPanel from "@/components/session/AILabPanel";
import Breadcrumb from "@/components/academic/Breadcrumb";
import {
  getSessionByNumber,
  getWeekNumberForSession,
  getTotalSessions,
  IGNITE_WEEKS,
} from "../../_data/ignite";

// ── Constantes ────────────────────────────────────────────────────────────────

/** UUID estático de sesiones demo (no existe en BD, GrabacionesTab lo maneja gracefully) */
const DEMO_SESSION_UUID = "00000000-0000-0000-0000-000000000001";

const WA_SOFIA = "https://wa.me/593990709009?text=Hola+Sof%C3%ADa%2C+acabo+de+ver+una+sesi%C3%B3n+del+demo+de+ITSEIA+Ignite+y+me+encant%C3%B3.+Quiero+reclamar+mi+beca+de+%2499";

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ num: string }>;
}

// ── Página ────────────────────────────────────────────────────────────────────

export default function DemoSessionPage({ params }: PageProps) {
  const { num }         = use(params);
  const sessionNumber   = parseInt(num, 10);
  const session         = getSessionByNumber(sessionNumber);

  if (!session) notFound();

  const weekNumber   = getWeekNumberForSession(sessionNumber);
  const totalSessions = getTotalSessions();

  const prevSession    = sessionNumber > 1 ? getSessionByNumber(sessionNumber - 1) : null;
  const nextSession    = sessionNumber < totalSessions ? getSessionByNumber(sessionNumber + 1) : null;
  const prevAvailable  = prevSession?.status === "available";
  const nextAvailable  = nextSession?.status === "available";

  // Contexto para el AI Lab
  const sessionContext = `ITSEIA Ignite — Preuniversitario demo. Día ${session.number}: ${session.title}. ${session.description}. Objetivo emocional: ${session.emotionalGoal}. Objetivo técnico: ${session.technicalGoal}. Herramientas: ${session.tools.map((t) => t.name).join(", ")}.`;

  const tabs: SessionTab[] = [
    // 1. Video
    {
      id: "video",
      label: "Video",
      icon: "video",
      completed: false,
      available: true,
      content: <VideoContent session={session} />,
    },
    // 2. Presentación (siempre visible — fallback elegante si no hay slides)
    {
      id: "slides",
      label: "Presentación",
      icon: "slides",
      completed: false,
      available: true,
      content: <PresentacionContent session={session} />,
    },
    // 3. Teoría
    {
      id: "theory",
      label: "Teoría",
      icon: "theory",
      completed: false,
      available: true,
      content: <TheoryContent session={session} />,
    },
    // 4. Quiz — bloqueado en demo
    {
      id: "quiz",
      label: "Quiz",
      icon: "quiz",
      completed: false,
      available: false,
      content: (
        <LockedContent
          title="Quiz"
          description="Evaluación con 5 preguntas del día y retroalimentación automática. Disponible en la cohorte oficial."
        />
      ),
    },
    // 5. Ejercicio
    {
      id: "assignment",
      label: "Ejercicio",
      icon: "assignment",
      completed: false,
      available: true,
      content: <AssignmentContent session={session} />,
    },
    // 6. AI Lab — DESBLOQUEADO en demo usando gemini-2.5-flash (DEFAULT_MODEL)
    {
      id: "ailab",
      label: "AI Lab",
      icon: "ailab",
      completed: false,
      available: true,
      content: (
        <AILabPanel
          sessionContext={sessionContext}
          suggestedPrompt={`Explícame el concepto principal del Día ${session.number}: "${session.title}" de una forma práctica y con un ejemplo concreto.`}
          sessionTitle={session.title}
        />
      ),
    },
    // 7. Recursos — bloqueado en demo
    {
      id: "resources",
      label: "Recursos",
      icon: "resources",
      completed: false,
      available: false,
      content: (
        <LockedContent
          title="Recursos"
          description="Enlaces, plantillas y ejemplos adicionales. Se entregan con tu cohorte oficial."
        />
      ),
    },
    // 8. Clase en Vivo — bloqueado en demo
    {
      id: "live",
      label: "Clase en Vivo",
      icon: "live",
      completed: false,
      available: false,
      content: (
        <LockedContent
          title="Clase en Vivo"
          description="Sesión Zoom con Héctor Velasco + cohorte. 2h sincrónicas + 1h de proyecto autónomo. Disponible en la cohorte oficial."
        />
      ),
    },
    // 9. Grabaciones — YouTube embed, maneja gracefully si no hay grabaciones demo
    {
      id: "recordings",
      label: "Grabaciones",
      icon: "recordings",
      completed: false,
      available: true,
      content: <GrabacionesTab sessionId={DEMO_SESSION_UUID} />,
    },
  ];

  return (
    <div className="flex flex-col">

      {/* ── Top bar con breadcrumb y título ─────────────────────────────── */}
      <header className="border-b border-[#1F2F58]/20 bg-[#0D1B30] px-4 py-3 shadow-sm -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 lg:-mt-12 mb-6">
        <div className="hidden md:flex items-center gap-1 mb-1">
          <Breadcrumb
            items={[
              { label: "Demo", href: "/demo/aula" },
              { label: `Semana ${weekNumber}`, href: `/demo/aula/semana-${weekNumber}` },
              { label: `Día ${session.number}`, href: `/demo/aula/sesion/${session.number}` },
            ]}
          />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold truncate max-w-[70%] text-[#F9F6E7]">
            Día {session.number}: {session.title}
          </h1>
          <p className="text-[10px] flex-shrink-0 text-[#F9F6E7]/40">
            Sesión {session.number} de {totalSessions}
          </p>
        </div>
        <div className="md:hidden mt-0.5">
          <p className="text-[10px] font-medium truncate text-[#73B8E7]">
            Semana {weekNumber}: {IGNITE_WEEKS[weekNumber - 1].name}
          </p>
        </div>
      </header>

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <SessionTabs tabs={tabs} />
      </div>

      {/* ── Sticky CTA banner ─────────────────────────────────────────────── */}
      <div
        className="mt-6 rounded-2xl border p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderColor: "#FBBC0C40", backgroundColor: "#FBBC0C08" }}
      >
        <div>
          <p className="text-sm font-bold" style={{ color: "#0A1628" }}>
            ¿Te gustó el Día {session.number}? Accede a los 20 días completos
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#1F2F58AA" }}>
            $99 pago único · Clases en vivo · Certificado ITSEIA · WhatsApp +593 99 070 9009
          </p>
        </div>
        <a
          href={WA_SOFIA}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FBBC0C] text-[#0A1628] text-sm font-bold hover:bg-[#FBBC0C]/90 transition-colors shadow-md shadow-[#FBBC0C]/20"
        >
          <MessageCircle className="w-4 h-4" />
          Inscríbete por $99
        </a>
      </div>

      {/* ── Navegación inferior ───────────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-between gap-3">
        {prevSession && prevAvailable ? (
          <Link
            href={`/demo/aula/sesion/${prevSession.number}`}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-[#1F2F58]/30 text-[#1F2F58] hover:bg-[#1F2F58]/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="truncate max-w-[160px]">
              Día {prevSession.number}
            </span>
          </Link>
        ) : (
          <Link
            href={`/demo/aula/semana-${weekNumber}`}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-[#1F2F58]/30 text-[#1F2F58] hover:bg-[#1F2F58]/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Semana {weekNumber}
          </Link>
        )}

        {nextSession && nextAvailable ? (
          <Link
            href={`/demo/aula/sesion/${nextSession.number}`}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-lg bg-[#FBBC0C] text-[#0A1628] hover:opacity-80 transition-opacity"
          >
            <span className="truncate max-w-[160px]">
              Día {nextSession.number}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <a
            href={WA_SOFIA}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-lg bg-[#FBBC0C] text-[#0A1628] hover:opacity-80 transition-opacity"
          >
            <MessageCircle className="w-4 h-4" />
            Inscríbete por $99
          </a>
        )}
      </div>
    </div>
  );
}

// ── Componentes de contenido por tab ──────────────────────────────────────────

type SessionType = ReturnType<typeof getSessionByNumber>;

// ── Tab Video ──

function VideoContent({ session }: { session: SessionType }) {
  if (!session) return null;
  return (
    <div className="p-4 sm:p-6 space-y-4">
      {session.videoEmbed ? (
        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#1F2F58]/30">
          <iframe
            src={session.videoEmbed}
            title={session.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video w-full rounded-2xl flex items-center justify-center border border-[#FBBC0C]/20 bg-[#1F2F58]/20">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-[#FBBC0C]/15">
              <Clock className="w-6 h-6 text-[#FBBC0C]" />
            </div>
            <p className="text-sm font-semibold text-[#F9F6E7]">
              Video del Día {session.number} disponible con tu cohorte
            </p>
            <p className="text-xs mt-1 text-[#F9F6E7]/55">
              Grabación + chat en vivo con Héctor Velasco
            </p>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-base font-bold text-[#FBBC0C]">
          {session.title}
        </h2>
        <p className="text-sm mt-1 text-[#F9F6E7]/70">
          {session.description}
        </p>
      </div>
    </div>
  );
}

// ── Tab Presentación (fallback elegante cuando no hay slides_url en demo) ──

function PresentacionContent({ session }: { session: SessionType }) {
  if (!session) return null;

  // Demo: no tenemos slides_url, mostramos el contenido del día como tarjetas
  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#73B8E7]/15 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#73B8E7]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#FBBC0C]">Resumen del Día {session.number}</p>
          <p className="text-[10px] text-[#F9F6E7]/50">Contenido visual de la sesión</p>
        </div>
      </div>

      {/* Slide 1: Título y descripción */}
      <div className="rounded-2xl border border-[#FBBC0C]/20 bg-gradient-to-br from-[#1F2F58]/80 to-[#0A1628] p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#FBBC0C]/60 mb-2">
          Día {session.number}
        </p>
        <h3 className="text-xl font-bold text-[#F9F6E7] leading-tight">
          {session.title}
        </h3>
        <p className="text-sm mt-2 text-[#F9F6E7]/70 leading-relaxed">
          {session.description}
        </p>
      </div>

      {/* Slide 2: Herramientas */}
      {session.tools.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#FBBC0C] mb-3">
            Herramientas del día
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {session.tools.map((tool) => (
              <div
                key={tool.name}
                className="rounded-2xl p-4 border border-[#1F2F58]/40 bg-[#1F2F58]/20"
              >
                <div className="text-2xl mb-2">{tool.emoji}</div>
                <p className="text-sm font-bold text-[#F9F6E7]">{tool.name}</p>
                <p className="text-xs mt-1 leading-relaxed text-[#F9F6E7]/60">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide 3: Objetivos */}
      <div className="grid sm:grid-cols-2 gap-3">
        {session.emotionalGoal && (
          <div className="rounded-2xl p-4 border border-[#F0846D]/30 bg-[#F0846D]/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#F0846D] mb-1.5">
              Lo que vas a sentir
            </p>
            <p className="text-xs leading-relaxed text-[#F9F6E7]/80">
              {session.emotionalGoal}
            </p>
          </div>
        )}
        {session.technicalGoal && (
          <div className="rounded-2xl p-4 border border-[#73B8E7]/30 bg-[#73B8E7]/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#73B8E7] mb-1.5">
              Lo que vas a aprender
            </p>
            <p className="text-xs leading-relaxed text-[#F9F6E7]/80">
              {session.technicalGoal}
            </p>
          </div>
        )}
      </div>

      {/* Info: acceso a la presentación real */}
      <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-[#1F2F58]/20 px-4 py-3">
        <Sparkles className="w-3.5 h-3.5 text-[#73B8E7] flex-shrink-0" />
        <p className="text-xs text-[#F9F6E7]/50">
          La presentación completa en Google Slides se comparte en la cohorte oficial
        </p>
      </div>
    </div>
  );
}

// ── Tab Teoría ──

function TheoryContent({ session }: { session: SessionType }) {
  if (!session) return null;
  return (
    <div className="p-4 sm:p-6 space-y-5">
      {session.emotionalGoal && (
        <div className="rounded-2xl p-5 border border-[#F0846D]/30 bg-[#F0846D]/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#F0846D]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F0846D]">
              Objetivo emocional
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#F9F6E7]">
            {session.emotionalGoal}
          </p>
        </div>
      )}
      {session.technicalGoal && (
        <div className="rounded-2xl p-5 border border-[#73B8E7]/30 bg-[#73B8E7]/10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#73B8E7]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#73B8E7]">
              Objetivo técnico
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#F9F6E7]">
            {session.technicalGoal}
          </p>
        </div>
      )}
      {session.tools.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-[#FBBC0C]">
            Herramientas del día
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {session.tools.map((tool) => (
              <div
                key={tool.name}
                className="rounded-2xl p-4 border border-[#1F2F58]/40 bg-[#1F2F58]/20"
              >
                <div className="text-2xl mb-2">{tool.emoji}</div>
                <p className="text-sm font-bold text-[#F9F6E7]">{tool.name}</p>
                <p className="text-xs mt-1 leading-relaxed text-[#F9F6E7]/60">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab Ejercicio ──

function AssignmentContent({ session }: { session: SessionType }) {
  if (!session) return null;
  return (
    <div className="p-4 sm:p-6 space-y-5">
      {session.agenda.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-[#FBBC0C]">
            Agenda del día · {session.durationMinutes} min
          </h3>
          <ul className="rounded-2xl border border-[#1F2F58]/40 divide-y divide-[#1F2F58]/30 overflow-hidden bg-[#1F2F58]/20">
            {session.agenda.map((item, idx) => (
              <li key={idx} className="p-4 flex items-start gap-4">
                <span className="text-[10px] font-bold flex-shrink-0 mt-0.5 px-2 py-1 rounded-full bg-[#FBBC0C]/20 text-[#FBBC0C]">
                  {item.time}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#F9F6E7]">{item.title}</p>
                  <p className="text-xs mt-0.5 leading-relaxed text-[#F9F6E7]/55">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {session.assignment && (
        <div className="rounded-2xl p-5 border border-[#FBBC0C]/30 bg-[#FBBC0C]/10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FBBC0C]">
            Tu proyecto del día
          </span>
          <p className="text-sm mt-2 leading-relaxed text-[#F9F6E7]">
            {session.assignment}
          </p>
          {session.deliverable && (
            <div className="mt-3 pt-3 border-t border-[#FBBC0C]/30">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#73B8E7]">
                Entregable
              </span>
              <p className="text-xs mt-1 leading-relaxed text-[#F9F6E7]/70">
                {session.deliverable}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Tab Bloqueado ──

function LockedContent({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-8">
      <div className="rounded-2xl border border-[#1F2F58]/40 bg-[#1F2F58]/20 p-8 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-[#1F2F58]/40">
          <Lock className="w-6 h-6 text-[#F9F6E7]/40" />
        </div>
        <h3 className="text-base font-bold text-[#F9F6E7]">{title}</h3>
        <p className="text-sm mt-1 leading-relaxed max-w-md mx-auto text-[#F9F6E7]/55">
          {description}
        </p>
        <a
          href={WA_SOFIA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg bg-[#FBBC0C] text-[#0A1628] text-xs font-bold hover:opacity-80 transition-opacity"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Inscríbete por $99 — Desbloquear todo
        </a>
      </div>
    </div>
  );
}
