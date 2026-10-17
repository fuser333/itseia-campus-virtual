"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Lock, Target, Sparkles, Clock } from "lucide-react";
import SessionTabs, { type SessionTab } from "@/components/session/SessionTabs";
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

  // Prev / next navigation
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
  ];

  return (
    <div className="flex flex-col" style={{ color: "#1F2F58" }}>
      {/* Top bar with breadcrumb and session title — mismo estilo que /carreras */}
      <header
        className="border-b bg-white px-4 py-3 shadow-sm -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 lg:-mt-12 mb-6"
        style={{ borderColor: "#1F2F5814" }}
      >
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
          <h1
            className="text-sm font-semibold truncate max-w-[70%]"
            style={{ color: "#0A1628" }}
          >
            Día {session.number}: {session.title}
          </h1>
          <p className="text-[10px] flex-shrink-0" style={{ color: "#1F2F5860" }}>
            Sesión {session.number} de {totalSessions}
          </p>
        </div>
        <div className="md:hidden mt-0.5">
          <p className="text-[10px] font-medium truncate" style={{ color: "#73B8E7" }}>
            Semana {weekNumber}: {IGNITE_WEEKS[weekNumber - 1].name}
          </p>
        </div>
      </header>

      {/* Tabs content */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <SessionTabs tabs={tabs} />
      </div>

      {/* Bottom navigation — mismo estilo que SessionNav */}
      <div className="mt-6 flex items-center justify-between gap-3">
        {prevSession && prevAvailable ? (
          <Link
            href={`/demo/aula/sesion/${prevSession.number}`}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:bg-white"
            style={{ borderColor: "#1F2F5820", color: "#1F2F58" }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="truncate max-w-[160px]">
              Día {prevSession.number}
            </span>
          </Link>
        ) : (
          <Link
            href={`/demo/aula/semana-${weekNumber}`}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:bg-white"
            style={{ borderColor: "#1F2F5820", color: "#1F2F58" }}
          >
            <ChevronLeft className="w-4 h-4" />
            Semana {weekNumber}
          </Link>
        )}

        {nextSession && nextAvailable ? (
          <Link
            href={`/demo/aula/sesion/${nextSession.number}`}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#FBBC0C", color: "#0A1628" }}
          >
            <span className="truncate max-w-[160px]">
              Día {nextSession.number}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/demo/aula"
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#FBBC0C", color: "#0A1628" }}
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
        <div
          className="aspect-video w-full rounded-2xl overflow-hidden border"
          style={{ borderColor: "#1F2F5815" }}
        >
          <iframe
            src={session.videoEmbed}
            title={session.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          className="aspect-video w-full rounded-2xl flex items-center justify-center border"
          style={{
            borderColor: "#1F2F5815",
            backgroundColor: "#F9F6E7",
          }}
        >
          <div className="text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "#FBBC0C22" }}
            >
              <Clock className="w-6 h-6" style={{ color: "#FBBC0C" }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>
              Video del Día {session.number} disponible con tu cohorte
            </p>
            <p className="text-xs mt-1" style={{ color: "#1F2F5880" }}>
              Grabación + chat en vivo con Héctor Velasco
            </p>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-base font-bold" style={{ color: "#0A1628" }}>
          {session.title}
        </h2>
        <p className="text-sm mt-1" style={{ color: "#1F2F5880" }}>
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
        <div
          className="rounded-2xl p-5 border"
          style={{
            borderColor: "#F0846D30",
            backgroundColor: "#F0846D10",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: "#F0846D" }} />
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#F0846D" }}
            >
              Objetivo emocional
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#0A1628" }}>
            {session.emotionalGoal}
          </p>
        </div>
      )}
      {session.technicalGoal && (
        <div
          className="rounded-2xl p-5 border"
          style={{
            borderColor: "#73B8E730",
            backgroundColor: "#73B8E710",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4" style={{ color: "#1F2F58" }} />
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#1F2F58" }}
            >
              Objetivo técnico
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#0A1628" }}>
            {session.technicalGoal}
          </p>
        </div>
      )}
      {session.tools.length > 0 && (
        <div>
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
            style={{ color: "#1F2F58" }}
          >
            Herramientas del día
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {session.tools.map((tool) => (
              <div
                key={tool.name}
                className="rounded-2xl p-4 border"
                style={{
                  borderColor: "#1F2F5815",
                  backgroundColor: "#fff",
                }}
              >
                <div className="text-2xl mb-2">{tool.emoji}</div>
                <p className="text-sm font-bold" style={{ color: "#0A1628" }}>
                  {tool.name}
                </p>
                <p
                  className="text-xs mt-1 leading-relaxed"
                  style={{ color: "#1F2F5880" }}
                >
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
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
            style={{ color: "#1F2F58" }}
          >
            Agenda del día · {session.durationMinutes} min
          </h3>
          <ul
            className="rounded-2xl border divide-y overflow-hidden"
            style={{ borderColor: "#1F2F5815", backgroundColor: "#fff" }}
          >
            {session.agenda.map((item, idx) => (
              <li key={idx} className="p-4 flex items-start gap-4">
                <span
                  className="text-[10px] font-bold flex-shrink-0 mt-0.5 px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: "#FBBC0C22",
                    color: "#0A1628",
                  }}
                >
                  {item.time}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#0A1628" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs mt-0.5 leading-relaxed"
                    style={{ color: "#1F2F5880" }}
                  >
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {session.assignment && (
        <div
          className="rounded-2xl p-5 border"
          style={{
            borderColor: "#FBBC0C40",
            backgroundColor: "#FBBC0C10",
          }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "#0A1628" }}
          >
            Tu proyecto del día
          </span>
          <p
            className="text-sm mt-2 leading-relaxed"
            style={{ color: "#0A1628" }}
          >
            {session.assignment}
          </p>
          {session.deliverable && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: "#FBBC0C40" }}>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#1F2F58" }}
              >
                Entregable
              </span>
              <p
                className="text-xs mt-1 leading-relaxed"
                style={{ color: "#1F2F58" }}
              >
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
      <div
        className="rounded-2xl border p-8 text-center"
        style={{ borderColor: "#1F2F5815", backgroundColor: "#fff" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: "#1F2F5810" }}
        >
          <Lock className="w-6 h-6" style={{ color: "#1F2F58" }} />
        </div>
        <h3 className="text-base font-bold" style={{ color: "#0A1628" }}>
          {title}
        </h3>
        <p
          className="text-sm mt-1 leading-relaxed max-w-md mx-auto"
          style={{ color: "#1F2F5880" }}
        >
          {description}
        </p>
        <Link
          href="/preuni-info"
          className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: "#0A1628" }}
        >
          Ver programa completo
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
