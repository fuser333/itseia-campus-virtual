"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Lock, Target, Sparkles, Clock } from "lucide-react";
import SessionTabs, { type SessionTab } from "@/components/session/SessionTabs";
import GrabacionesTab from "@/components/session/GrabacionesTab";
import Breadcrumb from "@/components/academic/Breadcrumb";
import {
  getSessionByNumber,
  getWeekNumberForSession,
  getTotalSessions,
  IGNITE_WEEKS,
} from "../../_data/ignite";

interface PageProps {
  params: Promise<{ num: string }>;
}

export default function DemoSessionPage({ params }: PageProps) {
  const { num } = use(params);
  const sessionNumber = parseInt(num, 10);
  const session = getSessionByNumber(sessionNumber);

  if (!session) notFound();

  const weekNumber = getWeekNumberForSession(sessionNumber);
  const totalSessions = getTotalSessions();

  const prevSession =
    sessionNumber > 1 ? getSessionByNumber(sessionNumber - 1) : null;
  const nextSession =
    sessionNumber < totalSessions
      ? getSessionByNumber(sessionNumber + 1)
      : null;

  const prevAvailable = prevSession?.status === "available";
  const nextAvailable = nextSession?.status === "available";

  const tabs: SessionTab[] = [
    {
      id: "video",
      label: "Video",
      icon: "video",
      completed: false,
      available: true,
      content: <VideoContent session={session} />,
    },
    {
      id: "theory",
      label: "Teoría",
      icon: "theory",
      completed: false,
      available: true,
      content: <TheoryContent session={session} />,
    },
    {
      id: "assignment",
      label: "Ejercicio",
      icon: "assignment",
      completed: false,
      available: true,
      content: <AssignmentContent session={session} />,
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: "quiz",
      completed: false,
      available: false,
      content: <LockedContent title="Quiz" description="Disponible en la cohorte oficial. Evaluación con 5 preguntas del día y retroalimentación automática." />,
    },
    {
      id: "ailab",
      label: "AI Lab",
      icon: "ailab",
      completed: false,
      available: false,
      content: <LockedContent title="AI Lab" description="Consola para practicar con Claude en tiempo real. Activo en la cohorte oficial." />,
    },
    {
      id: "resources",
      label: "Recursos",
      icon: "resources",
      completed: false,
      available: false,
      content: <LockedContent title="Recursos" description="Enlaces, plantillas y ejemplos adicionales. Se entregan con tu cohorte." />,
    },
    {
      id: "live",
      label: "Clase en Vivo",
      icon: "live",
      completed: false,
      available: false,
      content: <LockedContent title="Clase en Vivo" description="Zoom con Héctor Velasco + cohorte. 2h sincrónicas + 1h de proyecto autónomo." />,
    },
    {
      id: "recordings",
      label: "Grabaciones",
      icon: "recordings",
      completed: false,
      available: true,
      content: <GrabacionesTab sessionId={`demo-ignite-sesion-${sessionNumber}`} />,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Top bar with breadcrumb and session title */}
      <header className="border-b border-[#1F2F58]/20 bg-[#0D1B30] px-4 py-3 shadow-sm -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 lg:-mt-12 mb-6">
        <div className="hidden md:flex items-center gap-1 mb-1">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/demo/aula" },
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

      {/* Tabs content */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <SessionTabs tabs={tabs} />
      </div>

      {/* Bottom navigation */}
      <div className="mt-6 flex items-center justify-between gap-3">
        {prevSession && prevAvailable ? (
          <Link
            href={`/demo/aula/sesion/${prevSession.number}`}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-[#1F2F58]/30 text-[#F9F6E7] hover:bg-[#1F2F58]/20 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="truncate max-w-[160px]">
              Día {prevSession.number}
            </span>
          </Link>
        ) : (
          <Link
            href={`/demo/aula/semana-${weekNumber}`}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-[#1F2F58]/30 text-[#F9F6E7] hover:bg-[#1F2F58]/20 transition-colors"
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
          <Link
            href="/demo/aula"
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-lg bg-[#FBBC0C] text-[#0A1628] hover:opacity-80 transition-opacity"
          >
            Dashboard
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Componentes de contenido por tab ──────────────────────────────

function VideoContent({
  session,
}: {
  session: ReturnType<typeof getSessionByNumber>;
}) {
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

function TheoryContent({
  session,
}: {
  session: ReturnType<typeof getSessionByNumber>;
}) {
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
                <p className="text-sm font-bold text-[#F9F6E7]">
                  {tool.name}
                </p>
                <p className="text-xs mt-1 leading-relaxed text-[#F9F6E7]/60">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AssignmentContent({
  session,
}: {
  session: ReturnType<typeof getSessionByNumber>;
}) {
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
                  <p className="text-sm font-semibold text-[#F9F6E7]">
                    {item.title}
                  </p>
                  <p className="text-xs mt-0.5 leading-relaxed text-[#F9F6E7]/55">
                    {item.description}
                  </p>
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

function LockedContent({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-8">
      <div className="rounded-2xl border border-[#1F2F58]/40 bg-[#1F2F58]/20 p-8 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-[#1F2F58]/40">
          <Lock className="w-6 h-6 text-[#F9F6E7]/40" />
        </div>
        <h3 className="text-base font-bold text-[#F9F6E7]">
          {title}
        </h3>
        <p className="text-sm mt-1 leading-relaxed max-w-md mx-auto text-[#F9F6E7]/55">
          {description}
        </p>
        <Link
          href="/preuni-info"
          className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-[#FBBC0C] hover:text-[#73B8E7] transition-colors"
        >
          Ver programa completo
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
