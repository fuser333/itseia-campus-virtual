"use client";

/**
 * Vista de sesión · Alumno · Cursos Profesionales
 *
 * Idéntica al preuni (carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx)
 * pero adaptada a cursos_pro_sessions:
 *  - Sidebar: AlumnoSidebar (ya lo provee el layout de /cursos-pro)
 *  - Header: breadcrumb + título sesión + contador (idéntico al preuni)
 *  - 9 pestañas: SessionTabs de @/components/session/SessionTabs
 *  - Nav inferior: SessionNav (prev/next sesión dentro del módulo)
 *
 * Mapeo de campos cursos_pro_sessions → 9 pestañas:
 *   video       → video_url
 *   slides      → slides_url (gamma iframe)
 *   theory      → theory_md
 *   quiz        → quiz_json (renderizado por QuizEngine via session_id)
 *   assignment  → exercise_md (renderizado por AssignmentPanel stub para cursos-pro)
 *   ailab       → siempre disponible
 *   resources   → resources_json
 *   live        → meet_url + scheduled_at
 *   recordings  → recording_url / tabla recordings
 *
 * Acento de color: var(--producto-cursos-pro) = gold #FBBC0C
 */

import { useCallback, useEffect, useState } from "react";

import Breadcrumb from "@/components/academic/Breadcrumb";
import SessionTabs, {
  type SessionTab,
} from "@/components/session/SessionTabs";
import SessionNav from "@/components/session/SessionNav";
import VideoPlayer from "@/components/session/VideoPlayer";
import SlideViewer from "@/components/session/SlideViewer";
import TheoryContent from "@/components/session/TheoryContent";
import ResourceList from "@/components/session/ResourceList";
import AILabPanel from "@/components/session/AILabPanel";
import GrabacionesTab from "@/components/session/GrabacionesTab";
import LibrarySuggest from "@/components/library/LibrarySuggest";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface StudentSessionData {
  id: string;
  num: number;
  num_in_module: number | null;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  meet_url: string | null;
  recording_url: string | null;
  video_url: string | null;
  slides_url: string | null;
  theory_md: string | null;
  exercise_md: string | null;
  quiz_json: unknown;
  resources_json: unknown;
  ailab_config_json: unknown;
  status: "scheduled" | "live" | "done" | "cancelled";
}

interface Props {
  session: StudentSessionData;
  courseSlug: string;
  courseName: string;
  moduleSlug: string;
  moduleName: string;
  totalSessionsInModule: number;
  prevHref: string | null;
  nextHref: string | null;
}

// ─── Helper: extraer primera URL YouTube de un bloque markdown ───────────────

function extractYouTubeUrl(md: string | null): string | null {
  if (!md) return null;
  const match = md.match(
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(?:&\S*)?/
  );
  return match ? match[0] : null;
}

// ─── Helper: ResourceItem desde resources_json ───────────────────────────────

interface ResourceItem {
  title: string;
  url: string;
  type: string;
  description?: string;
}

function parseResources(raw: unknown): ResourceItem[] {
  if (!Array.isArray(raw)) return [];
  return (raw as ResourceItem[]).filter(
    (r) => r && typeof r.title === "string" && typeof r.url === "string"
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function StudentSessionView({
  session,
  courseSlug,
  courseName,
  moduleSlug,
  moduleName,
  totalSessionsInModule,
  prevHref,
  nextHref,
}: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<Record<string, boolean>>(
    {}
  );
  const [loadingUserId, setLoadingUserId] = useState(true);

  // Obtener userId del lado cliente para tracking de progreso
  useEffect(() => {
    async function fetchUser() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) setUserId(user.id);
      } catch {
        // silently fail
      } finally {
        setLoadingUserId(false);
      }
    }
    fetchUser();
  }, []);

  const updateProgress = useCallback(
    async (field: string) => {
      if (!session.id || !userId) return;
      try {
        setProgressState((prev) => ({ ...prev, [field]: true }));
        await fetch(`/api/sessions/${session.id}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: true }),
        });
      } catch {
        // silently fail — progress tracking es best-effort
      }
    },
    [session.id, userId]
  );

  // ─── Datos derivados ─────────────────────────────────────────────────────────

  const videoUrl =
    session.video_url ?? extractYouTubeUrl(session.theory_md);

  // theory sin la URL de video si estaba embebida en theory_md
  const theoryContent = session.theory_md
    ? session.video_url
      ? session.theory_md
      : session.theory_md.replace(
          /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(?:&\S*)?/,
          ""
        ).trim()
    : null;

  const resources = parseResources(session.resources_json);

  const sessionContext = `Curso: ${courseName}. Módulo: ${moduleName}. Sesión ${session.num}: ${session.title}. ${theoryContent ? `Contenido: ${theoryContent.substring(0, 3000)}` : ""}`;

  // ─── Build tabs (idéntico al preuni, adaptado a cursos_pro_sessions) ─────────

  const tabs: SessionTab[] = [
    {
      id: "video",
      label: "Video",
      icon: "video",
      completed: progressState.video_watched ?? false,
      available: !!videoUrl,
      content: videoUrl ? (
        <VideoPlayer
          videoUrl={videoUrl}
          title={session.title}
          onWatched={() => updateProgress("video_watched")}
        />
      ) : null,
    },
    {
      id: "slides",
      label: "Presentacion",
      icon: "slides",
      completed: progressState.slides_viewed ?? false,
      available: !!session.slides_url,
      content: session.slides_url ? (
        <SlideViewer
          slidesUrl={session.slides_url}
          slidesType={
            session.slides_url.includes("google.com/presentation")
              ? "google_slides"
              : "pdf"
          }
          title="Presentacion"
          onViewed={() => updateProgress("slides_viewed")}
        />
      ) : null,
    },
    {
      id: "theory",
      label: "Teoria",
      icon: "theory",
      completed: progressState.theory_read ?? false,
      available: !!theoryContent,
      content: theoryContent ? (
        <TheoryContent
          content={theoryContent}
          title="Contenido teorico"
          onRead={() => updateProgress("theory_read")}
        />
      ) : null,
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: "quiz",
      completed: progressState.quiz_passed ?? false,
      // Quiz disponible si quiz_json tiene preguntas
      available:
        Array.isArray(session.quiz_json) &&
        (session.quiz_json as unknown[]).length > 0,
      content:
        Array.isArray(session.quiz_json) &&
        (session.quiz_json as unknown[]).length > 0 ? (
          // Usamos TheoryContent como fallback para mostrar las preguntas en texto
          // QuizEngine requiere session_id de tabla sessions (preuni) — para
          // cursos-pro usamos un renderizador inline del quiz_json
          <CursosProQuizRenderer
            questions={session.quiz_json as CursosProQuestion[]}
            onPassed={() => updateProgress("quiz_passed")}
          />
        ) : null,
    },
    {
      id: "assignment",
      label: "Ejercicio",
      icon: "assignment",
      completed: progressState.assignment_submitted ?? false,
      available: !!session.exercise_md,
      content: session.exercise_md ? (
        <TheoryContent
          content={session.exercise_md}
          title="Ejercicio practico"
          onRead={() => updateProgress("assignment_submitted")}
        />
      ) : null,
    },
    {
      id: "ailab",
      label: "AI Lab",
      icon: "ailab",
      completed: progressState.ai_lab_used ?? false,
      available: true,
      content: (
        <AILabPanel
          sessionContext={sessionContext}
          suggestedPrompt={
            session.ailab_config_json &&
            typeof session.ailab_config_json === "object" &&
            "suggested_prompt" in (session.ailab_config_json as object)
              ? ((session.ailab_config_json as { suggested_prompt?: string })
                  .suggested_prompt ?? undefined)
              : undefined
          }
          onFirstMessage={() => updateProgress("ai_lab_used")}
          sessionId={session.id}
          sessionTitle={session.title}
        />
      ),
    },
    {
      id: "resources",
      label: "Recursos",
      icon: "resources",
      completed: false,
      available: true,
      content: (
        <div className="space-y-6">
          {resources.length > 0 && (
            <ResourceList
              resources={resources.map((r) => ({
                title: r.title,
                url: r.url,
                type: r.type,
                description: r.description,
              }))}
            />
          )}
          <LibrarySuggest
            sessionContext={`${courseName}: ${session.title}`}
          />
        </div>
      ),
    },
    {
      id: "live",
      label: "Clase en Vivo",
      icon: "live" as SessionTab["icon"],
      completed: false,
      available: true,
      content: (
        <CursosProLivePanel
          meetUrl={session.meet_url}
          scheduledAt={session.scheduled_at}
          status={session.status}
        />
      ),
    },
    {
      id: "recordings",
      label: "Grabaciones",
      icon: "recordings" as SessionTab["icon"],
      completed: false,
      available: true,
      content: session.recording_url ? (
        <CursosProRecordingPanel
          recordingUrl={session.recording_url}
          title={session.title}
        />
      ) : (
        <GrabacionesTab sessionId={session.id} />
      ),
    },
  ];

  // ─── URLs para navegación ─────────────────────────────────────────────────────

  const moduleUrl = `/cursos-pro/${courseSlug}/modulo/${moduleSlug}`;
  const sessionNum = session.num_in_module ?? session.num;

  return (
    <div className="flex h-screen flex-col">
      {/* ── Header con breadcrumb + título (idéntico al preuni) ───────────── */}
      <header className="border-b border-[#1F2F58]/8 bg-white px-4 py-2 shadow-sm">
        {/* Breadcrumb row */}
        <div className="hidden md:flex items-center gap-1 mb-1">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/cursos-pro" },
              { label: courseName, href: `/cursos-pro/${courseSlug}` },
              { label: moduleName, href: moduleUrl },
            ]}
          />
        </div>
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold text-[#0A1628] truncate max-w-[70%]">
            {session.title}
          </h1>
          <p className="text-[10px] text-[#1F2F58]/40 flex-shrink-0">
            Sesion {sessionNum} de {totalSessionsInModule}
          </p>
        </div>
        {/* Mobile: compact */}
        <div className="md:hidden">
          <p className="text-[10px] text-[#FBBC0C] font-medium truncate">
            {moduleName}
          </p>
        </div>
      </header>

      {/* ── Main content: 9 pestañas ──────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <SessionTabs tabs={tabs} />
      </div>

      {/* ── Bottom navigation ──────────────────────────────────────────────── */}
      <SessionNav
        prevSession={
          prevHref
            ? {
                title: "Sesión anterior",
                url: prevHref,
              }
            : null
        }
        nextSession={
          nextHref
            ? {
                title: "Siguiente sesión",
                url: nextHref,
              }
            : null
        }
        currentNum={sessionNum}
        totalSessions={totalSessionsInModule}
        subjectUrl={moduleUrl}
      />
    </div>
  );
}

// ─── CursosProQuizRenderer ────────────────────────────────────────────────────
// Quiz inline que renderiza quiz_json directamente (sin QuizEngine que
// necesita tabla quizzes del esquema del preuni).

interface CursosProQuestion {
  question?: string;
  pregunta?: string;
  options?: string[];
  opciones?: string[];
  answer?: number;
  respuesta?: number;
  explanation?: string;
  explicacion?: string;
}

function CursosProQuizRenderer({
  questions,
  onPassed,
}: {
  questions: CursosProQuestion[];
  onPassed: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? questions.reduce((acc, q, i) => {
        const correct = q.answer ?? q.respuesta ?? 0;
        return acc + (answers[i] === correct ? 1 : 0);
      }, 0)
    : 0;

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  function handleSubmit() {
    setSubmitted(true);
    if (pct >= 70) onPassed();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-[#1F2F58]/5 px-4 py-3 text-sm text-[#1F2F58]">
        {questions.length} preguntas · Aprobacion: 70%
      </div>

      {questions.map((q, i) => {
        const text = q.question ?? q.pregunta ?? `Pregunta ${i + 1}`;
        const opts = q.options ?? q.opciones ?? [];
        const correct = q.answer ?? q.respuesta ?? 0;
        const expl = q.explanation ?? q.explicacion;

        return (
          <div key={i} className="space-y-2">
            <p className="text-sm font-semibold text-[#0A1628]">
              {i + 1}. {text}
            </p>
            <div className="space-y-1.5">
              {opts.map((opt, j) => {
                const chosen = answers[i] === j;
                const isCorrect = submitted && j === correct;
                const isWrong = submitted && chosen && j !== correct;

                return (
                  <button
                    key={j}
                    disabled={submitted}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [i]: j }))
                    }
                    className={`w-full text-left rounded-lg px-4 py-2.5 text-sm border transition-all ${
                      isCorrect
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : isWrong
                        ? "border-red-400 bg-red-50 text-red-800"
                        : chosen
                        ? "border-[#FBBC0C] bg-[#FBBC0C]/10 text-[#0A1628]"
                        : "border-[#1F2F58]/10 bg-white text-[#1F2F58] hover:border-[#FBBC0C]/50"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && expl && (
              <p className="text-xs text-[#1F2F58]/60 italic px-1">
                {expl}
              </p>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="mt-2 rounded-lg bg-[#FBBC0C] px-6 py-2.5 text-sm font-bold text-[#0A1628] hover:bg-[#FBBC0C]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Enviar respuestas
        </button>
      ) : (
        <div
          className={`rounded-xl px-5 py-4 text-center ${
            pct >= 70
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          <p className="text-lg font-bold">
            {score}/{questions.length} · {pct}%
          </p>
          <p className="text-sm mt-1">
            {pct >= 70
              ? "Aprobado. Buen trabajo."
              : "Intenta de nuevo — necesitas al menos 70%."}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── CursosProLivePanel ───────────────────────────────────────────────────────
// Panel de clase en vivo para cursos-pro (versión simplificada del preuni).

function CursosProLivePanel({
  meetUrl,
  scheduledAt,
  status,
}: {
  meetUrl: string | null;
  scheduledAt: string;
  status: string;
}) {
  const isLive = status === "live";
  const isDone = status === "done";

  const dateStr = new Date(scheduledAt).toLocaleDateString("es-EC", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#1F2F58]/10 bg-[#0A1628]/5 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#1F2F58]/50 mb-2">
          Clase en vivo
        </p>
        <p className="text-base font-semibold text-[#0A1628] capitalize">
          {dateStr}
        </p>

        {isLive && meetUrl && (
          <a
            href={meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#F0846D] px-5 py-3 text-sm font-bold text-white hover:opacity-90 transition"
          >
            <span className="size-2 rounded-full bg-white animate-pulse" />
            Unirse ahora · Google Meet
          </a>
        )}

        {!isLive && !isDone && meetUrl && (
          <a
            href={meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#FBBC0C] px-5 py-3 text-sm font-bold text-[#FBBC0C] hover:bg-[#FBBC0C]/10 transition"
          >
            Ver link de Meet
          </a>
        )}

        {isDone && !meetUrl && (
          <p className="mt-3 text-sm text-[#1F2F58]/60">
            Clase completada. Revisa la pestaña Grabaciones.
          </p>
        )}

        {!meetUrl && !isDone && (
          <p className="mt-3 text-sm text-[#1F2F58]/60">
            El link de Meet estara disponible antes de la clase.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── CursosProRecordingPanel ──────────────────────────────────────────────────

function CursosProRecordingPanel({
  recordingUrl,
  title,
}: {
  recordingUrl: string;
  title: string;
}) {
  // Detectar si es YouTube para embeber
  const ytMatch = recordingUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
  );
  const ytId = ytMatch?.[1];

  if (ytId) {
    return (
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#1F2F58]/50">
          Grabacion de la clase
        </p>
        <div className="aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#1F2F58]/10 p-6 text-center">
      <p className="text-sm text-[#1F2F58]/60 mb-3">Grabacion disponible</p>
      <a
        href={recordingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-[#1F2F58] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1F2F58]/90 transition"
      >
        Ver grabacion
      </a>
    </div>
  );
}
