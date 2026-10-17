import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Video,
  ExternalLink,
  CheckCircle2,
  Circle,
  Radio,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preuniversitario IGNITE | Panel Docente ITSEIA",
};

// ─── Constantes del programa Preuni cohorte JUNIO 2026 ───────────────────────
const PREUNI_PROGRAM_ID = "958d9795-8958-450e-828a-ff24eb4b0f00";
// Meet oficial de la cohorte (acordado con Héctor)
const PREUNI_MEET_URL = "https://meet.google.com/qox-bghu-mbe";
// Día 1 = 3 jun 2026 (HOY) · 17:30 EC = 22:30 UTC
const PREUNI_DAY_ONE_ISO = "2026-06-03T22:30:00.000Z";
const SESSION_DURATION_MIN = 120;

interface SessionRow {
  id: string;
  number: number;
  title: string;
  subject_id: string;
  estimated_duration_minutes: number | null;
  is_active: boolean;
}

interface SubjectRow {
  id: string;
  name: string;
  semester_id: string;
}

interface ScheduledSession extends SessionRow {
  dayIndex: number; // 1..20
  weekLabel: string;
  scheduledAt: Date;
  status: "done" | "live" | "scheduled";
}

export default async function DocentePreuniPage() {
  const { sessions, enrolledCount } = await loadPreuniData();

  // Auto-derivar status comparando ahora con scheduledAt + duración
  const now = Date.now();
  const scheduled: ScheduledSession[] = sessions.map((s) => {
    const start = s.scheduledAt.getTime();
    const end = start + SESSION_DURATION_MIN * 60_000;
    let status: ScheduledSession["status"];
    if (now >= start && now < end) status = "live";
    else if (now >= end) status = "done";
    else status = "scheduled";
    return { ...s, status };
  });

  const liveSession = scheduled.find((s) => s.status === "live");
  const nextSession =
    liveSession ?? scheduled.find((s) => s.status === "scheduled");

  return (
    <div className="space-y-8">
      <Link
        href="/docente"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white"
      >
        <ArrowLeft className="size-3.5" />
        Panel docente
      </Link>

      {/* Header */}
      <header className="rounded-2xl bg-gradient-to-br from-[#F0846D]/20 via-[#1F2F58]/40 to-[#FBBC0C]/10 p-6 sm:p-8 border border-[#F0846D]/30">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#F0846D] mb-2">
          PREUNIVERSITARIO IGNITE · COHORTE JUNIO 2026
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight font-[family-name:var(--font-space-grotesk)]">
          Mi clase del Preuni
        </h1>
        <p className="mt-2 text-sm text-white/70 max-w-2xl">
          20 sesiones · lunes a viernes 17:30-19:30 EC · arranca 3 de junio.
          Todas las clases corren por el mismo Google Meet.
        </p>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Stat
            icon={<Users />}
            value={enrolledCount}
            label="alumnos activos"
          />
          <Stat
            icon={<Calendar />}
            value={scheduled.length}
            label="sesiones"
          />
          <Stat
            icon={<Clock />}
            value="17:30"
            label="hora EC"
          />
          <Stat
            icon={<Video />}
            value={scheduled.filter((s) => s.status === "done").length}
            label="finalizadas"
          />
        </div>
      </header>

      {/* CTA banner: próxima sesión / live */}
      {nextSession && (
        <section
          className={`rounded-2xl border-2 p-5 sm:p-6 ${
            nextSession.status === "live"
              ? "border-[#F0846D] bg-[#F0846D]/15 animate-pulse-slow"
              : "border-[#FBBC0C]/40 bg-[#FBBC0C]/8"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p
                className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
                  nextSession.status === "live"
                    ? "text-[#F0846D]"
                    : "text-[#FBBC0C]"
                }`}
              >
                {nextSession.status === "live" ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Radio className="size-3 animate-pulse" />
                    EN VIVO AHORA
                  </span>
                ) : (
                  "PRÓXIMA SESIÓN"
                )}
              </p>
              <h3 className="text-lg font-bold leading-tight">
                S{nextSession.dayIndex} — {nextSession.title}
              </h3>
              <p className="mt-1 text-xs text-white/65">
                {formatDateLong(nextSession.scheduledAt)} · {nextSession.weekLabel}
              </p>
            </div>
            <a
              href={PREUNI_MEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBBC0C] px-5 py-3 text-sm font-bold text-[#0A1628] hover:bg-[#FBBC0C]/90 transition-all"
            >
              <Video className="size-4" />
              Unirse a Google Meet
              <ExternalLink className="size-3.5 opacity-60" />
            </a>
          </div>
        </section>
      )}

      {/* Tabla de sesiones */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/70">
          20 sesiones del programa
        </h2>

        {scheduled.length === 0 ? (
          <PlaceholderEmpty />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-wider text-white/50">
                  <th className="px-4 py-3 text-left font-semibold w-16">S</th>
                  <th className="px-4 py-3 text-left font-semibold">Tema</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left font-semibold w-44">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left font-semibold w-28">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold w-44">Meet</th>
                </tr>
              </thead>
              <tbody>
                {scheduled.map((s) => (
                  <tr
                    key={s.id}
                    className={`border-b border-white/5 last:border-b-0 transition-colors hover:bg-white/[0.06] ${
                      s.status === "live" ? "bg-[#F0846D]/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3 align-top">
                      <span className="inline-flex items-center justify-center size-8 rounded-md bg-white/5 text-xs font-bold text-white/80">
                        {s.dayIndex}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Link
                        href={`/docente/preuni/sesion/${s.dayIndex}`}
                        className="block group"
                      >
                        <p className="font-medium text-white/90 leading-snug group-hover:text-[#FBBC0C] transition-colors">
                          {s.title}
                        </p>
                        <p className="mt-1 text-[10px] text-white/45 uppercase tracking-wider">
                          {s.weekLabel} · abrir material →
                        </p>
                        <p className="sm:hidden mt-1 text-[11px] text-white/55">
                          {formatDateShort(s.scheduledAt)}
                        </p>
                      </Link>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 align-top text-white/65">
                      {formatDateShort(s.scheduledAt)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <Link
                          href={`/docente/preuni/sesion/${s.dayIndex}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#FBBC0C]/40 bg-[#FBBC0C]/10 px-3 py-1.5 text-[11px] font-semibold text-[#FBBC0C] hover:bg-[#FBBC0C]/20 hover:border-[#FBBC0C] transition-all"
                        >
                          Abrir clase
                        </Link>
                        <a
                          href={PREUNI_MEET_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-white/80 hover:bg-white/10 transition-all"
                        >
                          <Video className="size-3.5" />
                          Meet
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <FooterNote />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

async function loadPreuniData(): Promise<{
  sessions: Array<SessionRow & { dayIndex: number; weekLabel: string; scheduledAt: Date }>;
  enrolledCount: number;
}> {
  // 1) Cohorte: enrollments activos en el programa Preuni
  const { count: enrolledCount } = await supabaseAdmin
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("program_id", PREUNI_PROGRAM_ID)
    .eq("status", "active");

  // 2) Estructura programs → semesters → subjects → sessions
  const { data: semesters } = await supabaseAdmin
    .from("semesters")
    .select("id, number")
    .eq("program_id", PREUNI_PROGRAM_ID);

  const semesterIds = (semesters ?? []).map((s) => s.id as string);
  if (semesterIds.length === 0) {
    return { sessions: [], enrolledCount: enrolledCount ?? 0 };
  }

  const { data: subjectsRaw } = await supabaseAdmin
    .from("subjects")
    .select("id, name, semester_id")
    .in("semester_id", semesterIds);

  const subjects = (subjectsRaw as SubjectRow[] | null) ?? [];
  if (subjects.length === 0) {
    return { sessions: [], enrolledCount: enrolledCount ?? 0 };
  }

  // Ordenar subjects por "Semana N" parseado del nombre
  subjects.sort((a, b) => weekNumberFromName(a.name) - weekNumberFromName(b.name));

  // 3) Sesiones activas por subject, ordenadas por number
  const subjectIds = subjects.map((s) => s.id);
  const { data: sessionsRaw } = await supabaseAdmin
    .from("sessions")
    .select("id, number, title, subject_id, estimated_duration_minutes, is_active")
    .in("subject_id", subjectIds)
    .eq("is_active", true)
    .order("number", { ascending: true });

  const sessionRows = (sessionsRaw as SessionRow[] | null) ?? [];

  // 4) Aplanar en orden: Semana 1 #1..5, Semana 2 #1..5, ... y asignar dayIndex 1..20
  const flat: Array<SessionRow & { dayIndex: number; weekLabel: string; scheduledAt: Date }> = [];
  let dayIdx = 0;
  for (const sub of subjects) {
    const subSessions = sessionRows
      .filter((s) => s.subject_id === sub.id)
      .sort((a, b) => a.number - b.number);
    const weekNum = weekNumberFromName(sub.name);
    for (const s of subSessions) {
      dayIdx += 1;
      flat.push({
        ...s,
        dayIndex: dayIdx,
        weekLabel: `Semana ${weekNum}`,
        scheduledAt: dateForDayIndex(dayIdx),
      });
    }
  }

  return { sessions: flat, enrolledCount: enrolledCount ?? 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// Schedule helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Para una sesión n (1..20), devuelve la fecha programada asumiendo:
 *  - Día 1 = 3 jun 2026 a las 17:30 EC (22:30 UTC)
 *  - Lunes a viernes (skip sábado/domingo)
 */
function dateForDayIndex(n: number): Date {
  const start = new Date(PREUNI_DAY_ONE_ISO);
  let count = 0;
  let current = new Date(start.getTime());
  // Avanzamos n-1 días hábiles desde el día 1
  while (count < n - 1) {
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    const day = current.getUTCDay(); // 0=Sun, 6=Sat — usamos UTC para evitar TZ drift
    // Nota: el horario lo guardamos como UTC fijo (22:30 UTC = 17:30 EC),
    // así que basta verificar el día semana en UTC.
    if (day !== 0 && day !== 6) count += 1;
  }
  return current;
}

function weekNumberFromName(name: string): number {
  const m = name.match(/Semana\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : 99;
}

function formatDateLong(d: Date): string {
  // En Ecuador (UTC-5) — mostramos en español con hora 17:30
  return d.toLocaleString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Guayaquil",
  });
}

function formatDateShort(d: Date): string {
  return d.toLocaleString("es-EC", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Guayaquil",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────────────────────

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
      <div className="flex items-center gap-1.5 text-white/60">
        <span className="size-3.5 [&>svg]:size-3.5">{icon}</span>
        <span className="text-lg font-extrabold text-white font-[family-name:var(--font-space-grotesk)]">
          {value}
        </span>
      </div>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/45">
        {label}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: "done" | "live" | "scheduled" }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
        <CheckCircle2 className="size-3" />
        Done
      </span>
    );
  }
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#F0846D]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F0846D]">
        <Radio className="size-3 animate-pulse" />
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">
      <Circle className="size-3" />
      Programada
    </span>
  );
}

function PlaceholderEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-10 text-center space-y-4">
      <p className="text-sm font-semibold text-white/80">
        No encontré sesiones del Preuniversitario en la base de datos.
      </p>
      <p className="text-xs text-white/55 max-w-md mx-auto">
        Mientras se cargan, puedes entrar directo a Google Meet para arrancar
        la clase.
      </p>
      <a
        href={PREUNI_MEET_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-[#FBBC0C] px-5 py-3 text-sm font-bold text-[#0A1628] hover:bg-[#FBBC0C]/90 transition-all"
      >
        <Video className="size-4" />
        Unirse a Google Meet
      </a>
    </div>
  );
}

function FooterNote() {
  return (
    <p className="text-[11px] text-white/40 text-center pt-4 border-t border-white/10">
      Las fechas se calculan a partir del 3 de junio (Día 1), saltando sábados
      y domingos. Si el calendario real cambia, avisa a Tecnología para
      ajustar.
    </p>
  );
}
