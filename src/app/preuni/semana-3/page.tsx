import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Play, CheckCircle2, Clock, ChevronRight, BrainCircuit } from "lucide-react";

const WEEK_NUMBER = 3;

export default async function PreuniSemana3() {
  const supabase = await createClient();

  // Auth guard
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 1. Fetch the preuni program
  const { data: programs } = await supabase
    .from("programs")
    .select("id, name, slug")
    .eq("type", "preuni")
    .eq("is_active", true)
    .limit(1);
  const program = programs?.[0] ?? null;

  // 2. Fetch the semester that corresponds to this week
  let semester = null;
  if (program) {
    const { data: semesters } = await supabase
      .from("semesters")
      .select("id, number, name")
      .eq("program_id", program.id)
      .eq("number", WEEK_NUMBER)
      .limit(1);
    semester = semesters?.[0] ?? null;
  }

  // 3. Fetch subjects for this semester
  let subjects: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    order_index: number;
  }> = [];
  if (semester) {
    const { data: subjectsData } = await supabase
      .from("subjects")
      .select("id, name, slug, description, order_index")
      .eq("semester_id", semester.id)
      .eq("is_active", true)
      .order("order_index", { ascending: true });
    subjects = subjectsData ?? [];
  }

  // 4. Fetch sessions for each subject
  const subjectIds = subjects.map((s) => s.id);
  let sessionsBySubject: Record<
    string,
    Array<{
      id: string;
      number: number;
      title: string;
      description: string | null;
      estimated_duration_minutes: number;
      subject_id: string;
    }>
  > = {};

  if (subjectIds.length > 0) {
    const { data: sessionsData } = await supabase
      .from("sessions")
      .select("id, number, title, description, estimated_duration_minutes, subject_id")
      .in("subject_id", subjectIds)
      .eq("is_active", true)
      .order("number", { ascending: true });

    if (sessionsData) {
      for (const session of sessionsData) {
        if (!sessionsBySubject[session.subject_id]) {
          sessionsBySubject[session.subject_id] = [];
        }
        sessionsBySubject[session.subject_id].push(session);
      }
    }
  }

  // 5. Fetch progress for current user
  const allSessionIds = Object.values(sessionsBySubject).flat().map((s) => s.id);
  let completedSessionIds = new Set<string>();
  if (allSessionIds.length > 0) {
    const { data: progressData } = await supabase
      .from("session_progress")
      .select("session_id, completed")
      .eq("user_id", user.id)
      .in("session_id", allSessionIds)
      .eq("completed", true);
    if (progressData) {
      completedSessionIds = new Set(progressData.map((p) => p.session_id));
    }
  }

  const totalSessions = allSessionIds.length;
  const completedCount = completedSessionIds.size;
  const progressPercent =
    totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

  // ─── Not found state ────────────────────────────────────────────────────
  if (!program || !semester) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[50vh] gap-4"
        style={{ color: "#1F2F58" }}
      >
        <BookOpen className="w-12 h-12 opacity-30" style={{ color: "#1F2F58" }} />
        <p className="text-base font-medium" style={{ color: "#1F2F58" }}>
          El contenido de esta semana aun no esta disponible.
        </p>
        <Link
          href="/dashboard"
          className="text-sm font-semibold px-4 py-2 rounded-lg"
          style={{ backgroundColor: "#FBBC0C", color: "#0A1628" }}
        >
          Volver al Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ color: "#1F2F58" }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "#FBBC0C22", color: "#0A1628" }}
          >
            Preuniversitario ITSEIA
          </span>
        </div>
        <div className="flex items-start gap-4 mt-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#1F2F58" }}
          >
            <BrainCircuit className="w-6 h-6" style={{ color: "#FBBC0C" }} />
          </div>
          <div className="flex-1">
            <h1
              className="text-2xl sm:text-3xl font-bold leading-tight"
              style={{ color: "#0A1628" }}
            >
              Semana {WEEK_NUMBER}: {semester.name || "ML y Aplicaciones"}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#1F2F58AA" }}>
              {subjects.length} materia{subjects.length !== 1 ? "s" : ""} &middot;{" "}
              {totalSessions} sesion{totalSessions !== 1 ? "es" : ""}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {totalSessions > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: "#1F2F5899" }}>
                Progreso de la semana
              </span>
              <span className="text-xs font-bold" style={{ color: "#1F2F58" }}>
                {completedCount}/{totalSessions} sesiones
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "#1F2F5815" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: progressPercent === 100 ? "#22c55e" : "#FBBC0C",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      {subjects.length === 0 ? (
        <div
          className="rounded-2xl border p-8 text-center"
          style={{ borderColor: "#1F2F5820", backgroundColor: "#fff" }}
        >
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: "#1F2F58" }} />
          <p className="text-sm" style={{ color: "#1F2F5880" }}>
            Las materias de esta semana aun no han sido cargadas.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {subjects.map((subject) => {
            const sessions = sessionsBySubject[subject.id] ?? [];
            return (
              <div
                key={subject.id}
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: "#1F2F5815", backgroundColor: "#fff" }}
              >
                {/* Subject header */}
                <div
                  className="px-5 py-4 border-b"
                  style={{ borderColor: "#1F2F5810", backgroundColor: "#F9F6E7" }}
                >
                  <h2 className="text-base font-bold" style={{ color: "#0A1628" }}>
                    {subject.name}
                  </h2>
                  {subject.description && (
                    <p className="mt-0.5 text-sm" style={{ color: "#1F2F5880" }}>
                      {subject.description}
                    </p>
                  )}
                </div>

                {/* Sessions list */}
                {sessions.length === 0 ? (
                  <div className="px-5 py-6 text-center">
                    <p className="text-sm" style={{ color: "#1F2F5860" }}>
                      Las sesiones de esta materia aun no estan disponibles.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y" style={{ borderColor: "#1F2F5808" }}>
                    {sessions.map((session) => {
                      const isCompleted = completedSessionIds.has(session.id);
                      const sessionUrl = program
                        ? `/carreras/${program.slug}/materia/${subject.slug}/sesion/${session.number}`
                        : "#";

                      return (
                        <li key={session.id}>
                          <Link
                            href={sessionUrl}
                            className="flex items-center gap-4 px-5 py-4 group transition-colors"
                            style={{ color: "#1F2F58" }}
                          >
                            {/* Status icon */}
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle2
                                  className="w-5 h-5"
                                  style={{ color: "#22c55e" }}
                                />
                              ) : (
                                <div
                                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                  style={{ borderColor: "#1F2F5830" }}
                                >
                                  <span
                                    className="text-[10px] font-bold"
                                    style={{ color: "#1F2F5860" }}
                                  >
                                    {session.number}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Title & description */}
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm font-semibold leading-snug truncate"
                                style={{ color: "#0A1628" }}
                              >
                                Sesion {session.number}: {session.title}
                              </p>
                              {session.description && (
                                <p
                                  className="text-xs mt-0.5 truncate"
                                  style={{ color: "#1F2F5870" }}
                                >
                                  {session.description}
                                </p>
                              )}
                            </div>

                            {/* Duration */}
                            {session.estimated_duration_minutes > 0 && (
                              <div
                                className="flex items-center gap-1 flex-shrink-0"
                                style={{ color: "#1F2F5860" }}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs">
                                  {session.estimated_duration_minutes} min
                                </span>
                              </div>
                            )}

                            {/* CTA icon */}
                            <div className="flex-shrink-0 flex items-center gap-1">
                              <span
                                className="text-xs font-semibold hidden sm:block"
                                style={{ color: "#FBBC0C" }}
                              >
                                {isCompleted ? "Revisar" : "Iniciar"}
                              </span>
                              {isCompleted ? (
                                <ChevronRight
                                  className="w-4 h-4"
                                  style={{ color: "#1F2F5840" }}
                                />
                              ) : (
                                <Play
                                  className="w-4 h-4"
                                  style={{ color: "#FBBC0C" }}
                                />
                              )}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Navigation footer ───────────────────────────────────────────────── */}
      <div className="mt-10 flex items-center justify-between">
        <Link
          href="/preuni/semana-2"
          className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors flex items-center gap-2"
          style={{ borderColor: "#1F2F5820", color: "#1F2F58" }}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Semana 2
        </Link>
        <Link
          href="/preuni/semana-4"
          className="text-sm font-semibold px-5 py-2 rounded-lg flex items-center gap-2 transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#FBBC0C", color: "#0A1628" }}
        >
          Semana 4
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
