import Link from "next/link";
import {
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  ChevronRight,
  Brain,
  Lock,
} from "lucide-react";
import type { IgniteWeek } from "../_data/ignite";

// Visualmente idéntico a /preuni/semana-N/page.tsx pero con datos hardcoded.
export default function SemanaView({ week }: { week: IgniteWeek }) {
  const allSessions = week.subjects.flatMap((s) => s.sessions);
  const totalSessions = allSessions.length;
  const completedCount = 0; // demo: sin tracking
  const progressPercent = totalSessions > 0
    ? Math.round((completedCount / totalSessions) * 100)
    : 0;

  const prevWeek = week.number > 1 ? week.number - 1 : null;
  const nextWeek = week.number < 4 ? week.number + 1 : null;

  return (
    <div style={{ color: "#1F2F58" }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "#FBBC0C22", color: "#0A1628" }}
          >
            Preuniversitario ITSEIA · Demo
          </span>
        </div>
        <div className="flex items-start gap-4 mt-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#1F2F58" }}
          >
            <Brain className="w-6 h-6" style={{ color: "#FBBC0C" }} />
          </div>
          <div className="flex-1">
            <h1
              className="text-2xl sm:text-3xl font-bold leading-tight"
              style={{ color: "#0A1628" }}
            >
              Semana {week.number}: {week.name}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#1F2F58AA" }}>
              {week.subjects.length} materia{week.subjects.length !== 1 ? "s" : ""} &middot; {totalSessions} sesión{totalSessions !== 1 ? "es" : ""}
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
      {week.subjects.length === 0 ? (
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
          {week.subjects.map((subject) => (
            <div
              key={subject.slug}
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
                <p className="mt-0.5 text-sm" style={{ color: "#1F2F5880" }}>
                  {subject.description}
                </p>
              </div>

              {/* Sessions list */}
              <ul className="divide-y" style={{ borderColor: "#1F2F5808" }}>
                {subject.sessions.map((session) => {
                  const isAvailable = session.status === "available";
                  const isCompleted = false;
                  const sessionUrl = isAvailable
                    ? `/demo/aula/sesion/${session.number}`
                    : "#";

                  const Row = (
                    <div
                      className="flex items-center gap-4 px-5 py-4 group transition-colors"
                      style={{ color: "#1F2F58", opacity: isAvailable ? 1 : 0.55 }}
                    >
                      {/* Status icon */}
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2
                            className="w-5 h-5"
                            style={{ color: "#22c55e" }}
                          />
                        ) : isAvailable ? (
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
                        ) : (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#1F2F5815" }}
                          >
                            <Lock className="w-3 h-3" style={{ color: "#1F2F5860" }} />
                          </div>
                        )}
                      </div>

                      {/* Title & description */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold leading-snug truncate"
                          style={{ color: "#0A1628" }}
                        >
                          Día {session.number}: {session.title}
                        </p>
                        <p
                          className="text-xs mt-0.5 truncate"
                          style={{ color: "#1F2F5870" }}
                        >
                          {session.description}
                        </p>
                      </div>

                      {/* Duration */}
                      {session.durationMinutes > 0 && (
                        <div
                          className="hidden sm:flex items-center gap-1 flex-shrink-0"
                          style={{ color: "#1F2F5860" }}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">
                            {session.durationMinutes} min
                          </span>
                        </div>
                      )}

                      {/* CTA icon */}
                      <div className="flex-shrink-0 flex items-center gap-1">
                        {isAvailable ? (
                          <>
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
                        <Link href={sessionUrl} className="block">
                          {Row}
                        </Link>
                      ) : (
                        Row
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* ── Navigation footer ───────────────────────────────────────────────── */}
      <div className="mt-10 flex items-center justify-between">
        {prevWeek ? (
          <Link
            href={`/demo/aula/semana-${prevWeek}`}
            className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
            style={{ borderColor: "#1F2F5820", color: "#1F2F58" }}
          >
            Semana {prevWeek}
          </Link>
        ) : (
          <Link
            href="/demo/aula"
            className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
            style={{ borderColor: "#1F2F5820", color: "#1F2F58" }}
          >
            Volver al Dashboard
          </Link>
        )}
        {nextWeek && (
          <Link
            href={`/demo/aula/semana-${nextWeek}`}
            className="text-sm font-semibold px-5 py-2 rounded-lg flex items-center gap-2 transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#FBBC0C", color: "#0A1628" }}
          >
            Semana {nextWeek}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
