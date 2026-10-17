"use client";

/**
 * Vista docente de una sesión de Cursos Pro.
 *
 * Componente CRÍTICO: contiene el botón "🔴 INICIAR CLASE CON GRABACIÓN"
 * que cumple 3 funciones cuando el docente le da clic:
 *   1. UPDATE cursos_pro_sessions SET status='live', started_at=NOW()
 *   2. window.open(meet_url, '_blank')
 *   3. muestra modal "RECUERDA GRABAR EN MEET" con instrucciones explícitas.
 *
 * Estados del botón:
 *   - scheduled → "🔴 INICIAR CLASE CON GRABACIÓN" (dorado, grande)
 *   - live      → "✅ FINALIZAR CLASE" + cronómetro contador en vivo
 *   - done      → "🎬 Ver grabación" (si recording_url) o "⏳ Procesando..."
 *
 * NOTA importante: la columna `started_at` NO existe en el schema actual.
 * Si el CEO la quiere para el cronómetro, agregar en migration 018.
 * Por ahora cronómetro usa Date.now() en cliente (se pierde si refrescas
 * la página). Aceptable para MVP — la fuente de verdad es el estado de Meet.
 */

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Circle,
  CheckCircle2,
  Video,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  X,
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  Sparkles,
  ClipboardList,
  Wand2,
  FolderOpen,
  NotebookPen,
  Film,
  BookOpen,
  Edit3,
  Save,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { CursosProSession } from "../../../../_lib/queries";

interface Props {
  session: CursosProSession;
  courseSlug: string;
  courseName: string;
  moduleLabel: string | null;
  prevHref: string | null;
  nextHref: string | null;
}

type TabId =
  | "resumen"
  | "plan"
  | "materiales"
  | "ejercicios"
  | "evaluacion"
  | "prompts"
  | "recursos"
  | "notas"
  | "grabaciones";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "resumen",     label: "Resumen",      icon: FileText },
  { id: "plan",        label: "Plan",         icon: ClipboardList },
  { id: "materiales",  label: "Materiales",   icon: FolderOpen },
  { id: "ejercicios",  label: "Ejercicios",   icon: Sparkles },
  { id: "evaluacion",  label: "Evaluación",   icon: CheckCircle2 },
  { id: "prompts",     label: "Prompts",      icon: Wand2 },
  { id: "recursos",    label: "Recursos",     icon: BookOpen },
  { id: "notas",       label: "Notas",        icon: NotebookPen },
  { id: "grabaciones", label: "Grabaciones",  icon: Film },
];

// ─── Component ────────────────────────────────────────────────────────────

export default function TeacherSessionView({
  session: initialSession,
  courseSlug,
  courseName,
  moduleLabel,
  prevHref,
  nextHref,
}: Props) {
  const [session, setSession] = useState<CursosProSession>(initialSession);
  const [activeTab, setActiveTab] = useState<TabId>("resumen");
  const [showRecordReminder, setShowRecordReminder] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Cronómetro en vivo (cuando status === 'live').
  const [liveStartedAt, setLiveStartedAt] = useState<number | null>(
    session.status === "live" ? Date.now() : null
  );
  const [elapsedMs, setElapsedMs] = useState(0);
  useEffect(() => {
    if (session.status !== "live" || !liveStartedAt) return;
    const t = setInterval(() => {
      setElapsedMs(Date.now() - liveStartedAt);
    }, 1000);
    return () => clearInterval(t);
  }, [session.status, liveStartedAt]);

  async function startClass() {
    setActionError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error, data } = await supabase
        .from("cursos_pro_sessions")
        .update({ status: "live" })
        .eq("id", session.id)
        .select()
        .single();
      if (error) {
        setActionError(`No se pudo iniciar la clase: ${error.message}`);
        return;
      }
      setSession(data as CursosProSession);
      setLiveStartedAt(Date.now());
      setElapsedMs(0);

      // Abre Google Meet en pestaña nueva.
      if (session.meet_url) {
        window.open(session.meet_url, "_blank", "noopener,noreferrer");
      }

      // Y muestra el modal con instrucciones de grabación.
      setShowRecordReminder(true);
    });
  }

  async function finishClass() {
    setActionError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error, data } = await supabase
        .from("cursos_pro_sessions")
        .update({ status: "done" })
        .eq("id", session.id)
        .select()
        .single();
      if (error) {
        setActionError(`No se pudo finalizar: ${error.message}`);
        return;
      }
      setSession(data as CursosProSession);
      setLiveStartedAt(null);
      setShowFinishConfirm(true);
    });
  }

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* ── HEADER + BOTÓN GRABAR (lo más importante) ───────────────── */}
      <section className="rounded-2xl border-2 border-[#FBBC0C]/30 bg-gradient-to-br from-[#FBBC0C]/5 to-[#0A1628]/5 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F2F58]/55">
              {courseName} {moduleLabel ? `· ${moduleLabel}` : ""}
            </p>
            <h1 className="mt-1 text-xl sm:text-2xl font-bold text-[#0A1628] leading-tight">
              Sesión {session.num} · {session.title}
            </h1>
            <p className="mt-2 text-xs text-[#1F2F58]/65 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDateTime(session.scheduled_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {session.duration_minutes} min
              </span>
            </p>
          </div>

          {/* ── EL BOTÓN ───────────────────────────────────────────── */}
          <div className="sm:max-w-sm w-full">
            <RecordButton
              status={session.status}
              recordingUrl={session.recording_url}
              meetUrl={session.meet_url}
              onStart={startClass}
              onFinish={finishClass}
              pending={pending}
              elapsedMs={elapsedMs}
            />
            {actionError && (
              <p className="mt-2 text-[11px] text-[#F0846D] text-center">
                {actionError}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Tabs ──────────────────────────────────────────────────── */}
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
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? "border-[#FBBC0C] text-[#0A1628] bg-white"
                      : "border-transparent text-[#1F2F58]/55 hover:text-[#1F2F58] hover:bg-white/50"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <TabContent
            tab={activeTab}
            session={session}
            onUpdate={(updated) => setSession(updated)}
          />
        </div>
      </div>

      {/* ── Nav prev/next ──────────────────────────────────────────── */}
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

      {/* ── Modal: RECUERDA GRABAR EN MEET ─────────────────────────── */}
      {showRecordReminder && (
        <RecordReminderModal onClose={() => setShowRecordReminder(false)} />
      )}

      {/* ── Modal: CLASE FINALIZADA ────────────────────────────────── */}
      {showFinishConfirm && (
        <FinishConfirmModal onClose={() => setShowFinishConfirm(false)} />
      )}
    </div>
  );
}

// ─── Botón GRABAR ────────────────────────────────────────────────────────

function RecordButton({
  status,
  recordingUrl,
  meetUrl,
  onStart,
  onFinish,
  pending,
  elapsedMs,
}: {
  status: "scheduled" | "live" | "done" | "cancelled";
  recordingUrl: string | null;
  meetUrl: string | null;
  onStart: () => void;
  onFinish: () => void;
  pending: boolean;
  elapsedMs: number;
}) {
  if (status === "scheduled") {
    return (
      <button
        onClick={onStart}
        disabled={pending || !meetUrl}
        className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#FBBC0C] px-5 py-4 text-base font-black text-[#0A1628] shadow-lg hover:bg-[#f5b300] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <span className="text-xl">🔴</span>
        INICIAR CLASE CON GRABACIÓN
      </button>
    );
  }

  if (status === "live") {
    return (
      <div className="space-y-2">
        <div className="rounded-lg bg-[#F0846D]/10 border border-[#F0846D]/30 px-3 py-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#F0846D] flex items-center justify-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#F0846D] animate-pulse" />
            CLASE EN VIVO
          </p>
          <p className="mt-0.5 text-base font-mono font-bold text-[#0A1628] tabular-nums">
            {formatElapsed(elapsedMs)}
          </p>
        </div>
        <button
          onClick={onFinish}
          disabled={pending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1628] px-5 py-3 text-sm font-bold text-white hover:bg-[#1F2F58] disabled:opacity-50 transition-colors"
        >
          <CheckCircle2 className="size-4" />
          FINALIZAR CLASE
        </button>
        {meetUrl && (
          <a
            href={meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-[11px] font-semibold text-[#73B8E7] hover:text-[#517CBE]"
          >
            Volver a Meet ↗
          </a>
        )}
      </div>
    );
  }

  if (status === "done") {
    if (recordingUrl) {
      return (
        <a
          href={recordingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBBC0C]/15 border border-[#FBBC0C]/50 px-5 py-3.5 text-sm font-bold text-[#0A1628] hover:bg-[#FBBC0C]/25 transition-colors"
        >
          🎬 Ver grabación
          <ExternalLink className="size-3.5" />
        </a>
      );
    }
    return (
      <div className="rounded-xl border border-dashed border-[#1F2F58]/20 bg-[#1F2F58]/5 px-5 py-4 text-center">
        <p className="text-sm font-bold text-[#1F2F58]/70">⏳ Procesando grabación...</p>
        <p className="mt-1 text-[11px] text-[#1F2F58]/55">
          Drive tarda 15-30 min en publicar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#1F2F58]/15 bg-[#1F2F58]/5 px-5 py-4 text-center">
      <p className="text-sm font-semibold text-[#1F2F58]/60">Clase cancelada</p>
    </div>
  );
}

// ─── Modal: RECUERDA GRABAR ───────────────────────────────────────────────

function RecordReminderModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-md p-1.5 text-[#1F2F58]/40 hover:bg-[#1F2F58]/5 hover:text-[#1F2F58]"
          aria-label="Cerrar"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#F0846D]/15">
            <AlertTriangle className="size-5 text-[#F0846D]" />
          </div>
          <h2 className="text-base font-black uppercase tracking-wide text-[#0A1628]">
            ¡RECUERDA GRABAR EN MEET!
          </h2>
        </div>

        <p className="text-sm text-[#1F2F58]/80 leading-relaxed mb-4">
          Acabas de abrir Google Meet. Para que la clase quede guardada,
          tienes que activar la grabación DESDE MEET.
        </p>

        <ol className="space-y-2 text-sm text-[#1F2F58]/85 mb-5">
          <li className="flex gap-2">
            <span className="font-bold text-[#FBBC0C]">1.</span>
            <span>
              En Google Meet, abajo a la derecha, haz clic en{" "}
              <code className="rounded bg-[#1F2F58]/8 px-1.5 py-0.5 text-xs font-semibold">
                ⋮ Más opciones
              </code>
              .
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-[#FBBC0C]">2.</span>
            <span>
              Selecciona{" "}
              <strong className="text-[#0A1628]">Grabar reunión</strong>.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-[#FBBC0C]">3.</span>
            <span>
              Confirma con{" "}
              <strong className="text-[#0A1628]">Iniciar</strong>.
            </span>
          </li>
        </ol>

        <div className="rounded-lg bg-[#F0846D]/10 border border-[#F0846D]/20 p-3 mb-5">
          <p className="text-xs text-[#1F2F58]/85 leading-relaxed">
            <strong className="text-[#F0846D]">Importante:</strong> si no
            grabas, no queda guardada la clase y los alumnos no podrán verla
            después.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-lg bg-[#FBBC0C] px-5 py-3 text-sm font-bold text-[#0A1628] hover:bg-[#f5b300]"
        >
          Entendido, ya le di a grabar en Meet
        </button>
      </div>
    </div>
  );
}

// ─── Modal: CLASE FINALIZADA ─────────────────────────────────────────────

function FinishConfirmModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-md p-1.5 text-[#1F2F58]/40 hover:bg-[#1F2F58]/5 hover:text-[#1F2F58]"
          aria-label="Cerrar"
        >
          <X className="size-4" />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#FBBC0C]/15">
            <CheckCircle2 className="size-5 text-[#FBBC0C]" />
          </div>
          <h2 className="text-base font-black uppercase tracking-wide text-[#0A1628]">
            Clase finalizada
          </h2>
        </div>
        <p className="text-sm text-[#1F2F58]/80 leading-relaxed">
          La grabación aparecerá automáticamente en 15-30 min cuando
          Google Drive termine de procesarla.
        </p>
        <p className="mt-2 text-xs text-[#1F2F58]/55">
          {/* TODO: cron job en cPanel que poll Drive cada 15 min para
              actualizar recording_url automáticamente. Por ahora se pega
              manual desde la pestaña Grabaciones. */}
          Mientras tanto, puedes pegar el link de la grabación manualmente
          en la pestaña <strong>Grabaciones</strong>.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-[#0A1628] px-5 py-3 text-sm font-bold text-white hover:bg-[#1F2F58]"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

// ─── Tab content (las 9 pestañas) ────────────────────────────────────────

function TabContent({
  tab,
  session,
  onUpdate,
}: {
  tab: TabId;
  session: CursosProSession;
  onUpdate: (s: CursosProSession) => void;
}) {
  if (tab === "resumen") {
    return (
      <EditableTextField
        label="Resumen / descripción"
        value={session.description ?? ""}
        sessionId={session.id}
        column="description"
        placeholder="Resumen de la sesión, objetivos pedagógicos..."
        onSaved={(val) => onUpdate({ ...session, description: val || null })}
      />
    );
  }
  if (tab === "plan") {
    return (
      <EditableTextField
        label="Plan de la sesión (markdown)"
        value={session.theory_md ?? ""}
        sessionId={session.id}
        column="theory_md"
        placeholder="Estructura, tiempos, momentos pedagógicos..."
        rows={14}
        onSaved={(val) => onUpdate({ ...session, theory_md: val || null })}
      />
    );
  }
  if (tab === "materiales") {
    return (
      <JsonbField
        label="Materiales (JSON)"
        value={session.resources_json}
        sessionId={session.id}
        column="resources_json"
        placeholder='[{"title":"Lectura prelive","url":"https://...","type":"pdf"}]'
        onSaved={(val) => onUpdate({ ...session, resources_json: val })}
      />
    );
  }
  if (tab === "ejercicios") {
    return (
      <EditableTextField
        label="Ejercicio práctico (markdown)"
        value={session.exercise_md ?? ""}
        sessionId={session.id}
        column="exercise_md"
        placeholder="Consigna paso a paso, criterios de entrega..."
        rows={14}
        onSaved={(val) => onUpdate({ ...session, exercise_md: val || null })}
      />
    );
  }
  if (tab === "evaluacion") {
    return (
      <JsonbField
        label="Quiz / evaluación (JSON)"
        value={session.quiz_json}
        sessionId={session.id}
        column="quiz_json"
        placeholder='[{"q":"¿Qué hace ChatGPT?","options":["A","B","C","D"],"answer":0}]'
        onSaved={(val) => onUpdate({ ...session, quiz_json: val })}
      />
    );
  }
  if (tab === "prompts") {
    return (
      <JsonbField
        label="Prompts de la sesión (JSON)"
        value={
          (session.ailab_config_json as { prompts?: unknown })?.prompts ?? []
        }
        sessionId={session.id}
        column="ailab_config_json"
        wrapper={(v) => ({
          ...((session.ailab_config_json as object) ?? {}),
          prompts: v,
        })}
        placeholder='["Eres un experto en ...", "Analiza este caso ..."]'
        onSaved={(val) => onUpdate({ ...session, ailab_config_json: val })}
      />
    );
  }
  if (tab === "recursos") {
    return (
      <p className="text-sm text-[#1F2F58]/55">
        Recursos extra. Para gestión avanzada de archivos usa el tab{" "}
        <strong>Materiales</strong> (mismo JSONB, mismo contrato con la
        vista alumno). Esta pestaña se reserva para futuros recursos como
        bibliografía complementaria.
      </p>
    );
  }
  if (tab === "notas") {
    return (
      <p className="text-sm text-[#1F2F58]/55">
        Las notas del docente requieren una columna nueva
        (<code>teacher_notes_md</code>) que se agregará en una migration
        futura cuando se priorice. Por ahora usa el tab{" "}
        <strong>Plan</strong> para anotaciones internas.
      </p>
    );
  }
  if (tab === "grabaciones") {
    return (
      <RecordingsTab
        session={session}
        onSaved={(url) => onUpdate({ ...session, recording_url: url || null })}
      />
    );
  }
  return null;
}

// ─── Editor genérico de texto ────────────────────────────────────────────

function EditableTextField({
  label,
  value,
  placeholder,
  rows = 8,
  sessionId,
  column,
  onSaved,
}: {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  sessionId: string;
  column: string;
  onSaved: (val: string) => void;
}) {
  const [text, setText] = useState(value);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setErr(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("cursos_pro_sessions")
        .update({ [column]: text || null })
        .eq("id", sessionId);
      if (error) {
        setErr(error.message);
        return;
      }
      setSavedAt(Date.now());
      onSaved(text);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#1F2F58]/65">
          {label}
        </label>
        <div className="flex items-center gap-2 text-[11px]">
          {savedAt && (
            <span className="text-[#FBBC0C] font-semibold">Guardado ✓</span>
          )}
          <button
            onClick={save}
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-md bg-[#0A1628] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#1F2F58] disabled:opacity-50"
          >
            <Save className="size-3" />
            {pending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-mono text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#FBBC0C]/40"
      />
      {err && <p className="mt-2 text-[11px] text-[#F0846D]">{err}</p>}
    </div>
  );
}

// ─── Editor de campos JSONB ──────────────────────────────────────────────

function JsonbField({
  label,
  value,
  placeholder,
  sessionId,
  column,
  wrapper,
  onSaved,
}: {
  label: string;
  value: unknown;
  placeholder?: string;
  sessionId: string;
  column: string;
  wrapper?: (val: unknown) => unknown;
  onSaved: (val: unknown) => void;
}) {
  const [text, setText] = useState(JSON.stringify(value ?? [], null, 2));
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setErr(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text || "null");
    } catch (e) {
      setErr(`JSON inválido: ${e instanceof Error ? e.message : "error"}`);
      return;
    }
    const finalVal = wrapper ? wrapper(parsed) : parsed;
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("cursos_pro_sessions")
        .update({ [column]: finalVal })
        .eq("id", sessionId);
      if (error) {
        setErr(error.message);
        return;
      }
      setSavedAt(Date.now());
      onSaved(finalVal);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#1F2F58]/65">
          {label}
        </label>
        <div className="flex items-center gap-2 text-[11px]">
          {savedAt && (
            <span className="text-[#FBBC0C] font-semibold">Guardado ✓</span>
          )}
          <button
            onClick={save}
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-md bg-[#0A1628] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#1F2F58] disabled:opacity-50"
          >
            <Save className="size-3" />
            {pending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={14}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-mono text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#FBBC0C]/40"
      />
      {err && <p className="mt-2 text-[11px] text-[#F0846D]">{err}</p>}
      <p className="mt-2 text-[11px] text-[#1F2F58]/45">
        Estructura mínima esperada por la vista alumno: array de objetos JSON.
      </p>
    </div>
  );
}

// ─── Pestaña Grabaciones ─────────────────────────────────────────────────

function RecordingsTab({
  session,
  onSaved,
}: {
  session: CursosProSession;
  onSaved: (url: string) => void;
}) {
  const [url, setUrl] = useState(session.recording_url ?? "");
  const [provider, setProvider] = useState(session.recording_provider ?? "drive");
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setErr(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("cursos_pro_sessions")
        .update({
          recording_url: url || null,
          recording_provider: url ? provider : null,
        })
        .eq("id", session.id);
      if (error) {
        setErr(error.message);
        return;
      }
      setSavedAt(Date.now());
      onSaved(url);
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#1F2F58]/65">
          URL de la grabación
        </label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#FBBC0C]/40"
        />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#1F2F58]/65">
          Proveedor
        </label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#FBBC0C]/40"
        >
          <option value="drive">Google Drive (Meet)</option>
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="other">Otro</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#FBBC0C] px-4 py-2 text-sm font-bold text-[#0A1628] hover:bg-[#f5b300] disabled:opacity-50"
        >
          <Save className="size-3.5" />
          {pending ? "Guardando..." : "Publicar grabación"}
        </button>
        {savedAt && (
          <span className="text-xs font-semibold text-[#FBBC0C]">Guardado ✓</span>
        )}
      </div>
      {err && <p className="text-[11px] text-[#F0846D]">{err}</p>}
      <p className="text-[11px] text-[#1F2F58]/55">
        Cuando termina la grabación en Google Meet, el archivo aparece en el
        Drive del organizador en 15-30 min. Copia el link de compartir
        (cualquier persona con el enlace) y pégalo aquí. Los alumnos lo verán
        en la pestaña <strong>Resumen + Video</strong>.
      </p>
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}
