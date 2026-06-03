"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Play,
  FileText,
  Video,
  CheckCircle2,
  Circle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Calendar,
  Clock,
  Download,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import VideoPlayer from "@/components/session/VideoPlayer";

// ─── Tipos ────────────────────────────────────────────────────────────────

interface QuizQ {
  q: string;
  options: string[];
  answer?: number;
  explain?: string;
}

interface Resource {
  title: string;
  url: string;
  type?: string;
  description?: string;
}

export interface StudentSession {
  id: string;
  num: number;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  meet_url: string | null;
  recording_url: string | null;
  theory_md: string | null;
  exercise_md: string | null;
  quiz_json: unknown;
  resources_json: unknown;
  status: "scheduled" | "live" | "done" | "cancelled";
}

interface Props {
  session: StudentSession;
  enrollmentId: string | null;
  prevHref: string | null;
  nextHref: string | null;
}

type TabId = "resumen" | "materiales" | "ejercicio" | "evaluacion";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "resumen",    label: "Resumen + Video", icon: Play },
  { id: "materiales", label: "Materiales",      icon: FileText },
  { id: "ejercicio",  label: "Ejercicios",      icon: Sparkles },
  { id: "evaluacion", label: "Evaluación",      icon: CheckCircle2 },
];

// ─── Component ────────────────────────────────────────────────────────────

export default function StudentSessionView({
  session,
  enrollmentId,
  prevHref,
  nextHref,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("resumen");
  const [completed, setCompleted] = useState(false);
  const [pending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const quiz = parseQuiz(session.quiz_json);
  const resources = parseResources(session.resources_json);

  async function toggleCompleted() {
    if (!enrollmentId) {
      setErrorMsg("No se puede marcar progreso: no estás inscrito.");
      return;
    }
    setErrorMsg(null);
    startTransition(async () => {
      const supabase = createClient();
      const now = new Date().toISOString();
      const newState = !completed;

      // Upsert por (enrollment_id, session_id) — UNIQUE constraint.
      const { error } = await supabase
        .from("cursos_pro_session_progress")
        .upsert(
          {
            enrollment_id: enrollmentId,
            session_id: session.id,
            watched: true,
            watched_at: now,
            completed_at: newState ? now : null,
          },
          { onConflict: "enrollment_id,session_id" }
        );

      if (error) {
        setErrorMsg(`No se pudo guardar: ${error.message}`);
        return;
      }
      setCompleted(newState);
    });
  }

  return (
    <div className="space-y-5">
      {/* ── Status / meta strip ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-[#1F2F58]/70">
            <Calendar className="size-3.5 text-[#73B8E7]" />
            {formatDate(session.scheduled_at)}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#1F2F58]/70">
            <Clock className="size-3.5 text-[#73B8E7]" />
            {session.duration_minutes} min
          </span>
          <StatusBadge status={session.status} />
          <div className="flex-1" />
          <button
            onClick={toggleCompleted}
            disabled={pending}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              completed
                ? "bg-[#FBBC0C]/15 text-[#FBBC0C] border border-[#FBBC0C]/40"
                : "bg-[#1F2F58]/5 text-[#1F2F58]/70 border border-[#1F2F58]/15 hover:bg-[#1F2F58]/10"
            }`}
          >
            {completed ? (
              <>
                <CheckCircle2 className="size-3.5" />
                Sesión completada
              </>
            ) : (
              <>
                <Circle className="size-3.5" />
                {pending ? "Guardando..." : "Marcar como completada"}
              </>
            )}
          </button>
        </div>
        {errorMsg && (
          <p className="mt-2 text-[11px] text-[#F0846D]">{errorMsg}</p>
        )}
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-[#F9F6E7]/40">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.id === activeTab;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? "border-[#FBBC0C] text-[#0A1628] bg-white"
                      : "border-transparent text-[#1F2F58]/60 hover:text-[#1F2F58] hover:bg-white/50"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab content ─────────────────────────────────────────── */}
        <div className="p-5 sm:p-6">
          {activeTab === "resumen" && (
            <ResumenTab session={session} />
          )}
          {activeTab === "materiales" && (
            <MaterialesTab resources={resources} description={session.description} />
          )}
          {activeTab === "ejercicio" && (
            <EjercicioTab exerciseMd={session.exercise_md} />
          )}
          {activeTab === "evaluacion" && (
            <EvaluacionTab quiz={quiz} />
          )}
        </div>
      </div>

      {/* ── Nav prev / next ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        {prevHref ? (
          <Link
            href={prevHref}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-[#1F2F58] hover:bg-[#FBBC0C]/5"
          >
            <ArrowLeft className="size-3.5" />
            Sesión anterior
          </Link>
        ) : <span />}
        {nextHref && (
          <Link
            href={nextHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1628] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1F2F58] ml-auto"
          >
            Siguiente sesión
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Sub-vistas ──────────────────────────────────────────────────────────

function ResumenTab({ session }: { session: StudentSession }) {
  const isFuture = new Date(session.scheduled_at).getTime() > Date.now();
  const hasRecording = !!session.recording_url;

  return (
    <div className="space-y-5">
      {session.description && (
        <div>
          <h3 className="text-sm font-bold text-[#0A1628] mb-2">
            Resumen de la sesión
          </h3>
          <p className="text-sm text-[#1F2F58]/75 leading-relaxed">
            {session.description}
          </p>
        </div>
      )}

      <div>
        {hasRecording && session.recording_url ? (
          <>
            <h3 className="text-sm font-bold text-[#0A1628] mb-3 flex items-center gap-2">
              <Video className="size-4 text-[#73B8E7]" />
              Grabación de la clase
            </h3>
            <VideoPlayer
              videoUrl={session.recording_url}
              title={session.title}
            />
          </>
        ) : session.status === "live" ? (
          <LiveJoinCard meetUrl={session.meet_url} />
        ) : isFuture ? (
          <UpcomingJoinCard
            meetUrl={session.meet_url}
            scheduledAt={session.scheduled_at}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-[#1F2F58]/20 bg-[#1F2F58]/5 p-6 text-center">
            <p className="text-sm font-semibold text-[#1F2F58]/70">
              ⏳ Procesando grabación...
            </p>
            <p className="mt-1 text-xs text-[#1F2F58]/55">
              La grabación de Google Meet se publicará aquí automáticamente cuando termine de procesarse (15-30 min).
            </p>
          </div>
        )}
      </div>

      {session.theory_md && (
        <div>
          <h3 className="text-sm font-bold text-[#0A1628] mb-2">Teoría</h3>
          <pre className="whitespace-pre-wrap text-sm text-[#1F2F58]/80 leading-relaxed font-[family-name:var(--font-inter)]">
            {session.theory_md}
          </pre>
        </div>
      )}
    </div>
  );
}

function LiveJoinCard({ meetUrl }: { meetUrl: string | null }) {
  return (
    <div className="rounded-xl border-2 border-[#F0846D]/60 bg-[#F0846D]/8 p-6 text-center">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#F0846D]">
        <span className="size-1.5 rounded-full bg-[#F0846D] animate-pulse" />
        EN VIVO AHORA
      </p>
      <p className="mt-2 text-base font-bold text-[#0A1628]">
        La clase está en marcha. Únete a Google Meet.
      </p>
      {meetUrl ? (
        <a
          href={meetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-5 py-2.5 text-sm font-bold text-[#0A1628] hover:bg-[#f5b300]"
        >
          <Video className="size-4" />
          Unirme a Google Meet
          <ExternalLink className="size-3.5" />
        </a>
      ) : (
        <p className="mt-2 text-xs text-[#1F2F58]/60">
          Esperando link de Meet del docente...
        </p>
      )}
    </div>
  );
}

function UpcomingJoinCard({
  meetUrl,
  scheduledAt,
}: {
  meetUrl: string | null;
  scheduledAt: string;
}) {
  return (
    <div className="rounded-xl border border-[#73B8E7]/40 bg-[#73B8E7]/5 p-6 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#73B8E7]">
        PRÓXIMA CLASE EN VIVO
      </p>
      <p className="mt-2 text-base font-bold text-[#0A1628]">
        {formatDate(scheduledAt)}
      </p>
      <p className="mt-1 text-xs text-[#1F2F58]/60">
        Te recomendamos entrar 5 min antes para verificar audio y video.
      </p>
      {meetUrl ? (
        <a
          href={meetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1F2F58] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0A1628]"
        >
          <Video className="size-4" />
          Unirme a Google Meet
          <ExternalLink className="size-3.5" />
        </a>
      ) : (
        <p className="mt-3 text-xs italic text-[#1F2F58]/55">
          El link de Meet aparecerá aquí poco antes de la clase.
        </p>
      )}
    </div>
  );
}

function MaterialesTab({
  resources,
  description,
}: {
  resources: Resource[];
  description: string | null;
}) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto size-10 text-[#1F2F58]/20" />
        <p className="mt-3 text-sm text-[#1F2F58]/55">
          {description
            ? "Los materiales de esta sesión se publicarán aquí pronto."
            : "Aún no hay materiales cargados."}
        </p>
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {resources.map((r, i) => (
        <li key={`${r.url}-${i}`}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:bg-[#FBBC0C]/5 hover:border-[#FBBC0C]/30"
          >
            <Download className="size-4 text-[#73B8E7] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0A1628] truncate">
                {r.title}
              </p>
              {r.description && (
                <p className="text-[11px] text-[#1F2F58]/55 truncate">
                  {r.description}
                </p>
              )}
            </div>
            <ExternalLink className="size-3.5 text-[#1F2F58]/30 group-hover:text-[#FBBC0C] shrink-0" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function EjercicioTab({ exerciseMd }: { exerciseMd: string | null }) {
  if (!exerciseMd) {
    return (
      <div className="text-center py-8">
        <Sparkles className="mx-auto size-10 text-[#1F2F58]/20" />
        <p className="mt-3 text-sm text-[#1F2F58]/55">
          El ejercicio práctico se publicará aquí después de la sesión en vivo.
        </p>
      </div>
    );
  }
  return (
    <pre className="whitespace-pre-wrap text-sm text-[#1F2F58]/80 leading-relaxed font-[family-name:var(--font-inter)]">
      {exerciseMd}
    </pre>
  );
}

function EvaluacionTab({ quiz }: { quiz: QuizQ[] }) {
  if (quiz.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="mx-auto size-10 text-[#1F2F58]/20" />
        <p className="mt-3 text-sm text-[#1F2F58]/55">
          La evaluación de esta sesión se habilitará después de la clase en vivo.
        </p>
      </div>
    );
  }
  return (
    <ol className="space-y-5">
      {quiz.map((q, i) => (
        <li key={i} className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-bold text-[#0A1628]">
            {i + 1}. {q.q}
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {q.options.map((opt, j) => (
              <li
                key={j}
                className="flex items-start gap-2 text-xs text-[#1F2F58]/75"
              >
                <span className="mt-0.5 font-semibold text-[#73B8E7]">
                  {String.fromCharCode(65 + j)}.
                </span>
                <span>{opt}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StudentSession["status"] }) {
  const map = {
    scheduled: { label: "Programada", color: "bg-[#73B8E7]/15 text-[#517CBE]" },
    live:      { label: "EN VIVO",    color: "bg-[#F0846D]/15 text-[#F0846D]" },
    done:      { label: "Finalizada", color: "bg-[#FBBC0C]/15 text-[#FBBC0C]" },
    cancelled: { label: "Cancelada",  color: "bg-[#1F2F58]/10 text-[#1F2F58]/60" },
  };
  const it = map[status];
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${it.color}`}>
      {it.label}
    </span>
  );
}

function parseQuiz(raw: unknown): QuizQ[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (q): q is QuizQ =>
      typeof q === "object" && q !== null && "q" in q && "options" in q
  );
}

function parseResources(raw: unknown): Resource[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (r): r is Resource =>
      typeof r === "object" && r !== null && "title" in r && "url" in r
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}
