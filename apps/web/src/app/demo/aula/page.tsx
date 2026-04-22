"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Brain,
  PlayCircle,
  Clock,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { IGNITE_WEEKS } from "./_data/ignite";

type DemoUser = {
  email: string;
  name: string;
  loggedAt: number;
};

export default function DemoAulaDashboard() {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("itseia_demo_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "estudiante";

  const allSessions = IGNITE_WEEKS.flatMap((w) =>
    w.subjects.flatMap((s) => s.sessions),
  );
  const totalSessions = allSessions.length;
  const availableCount = allSessions.filter(
    (s) => s.status === "available",
  ).length;

  return (
    <div style={{ color: "#1F2F58" }}>
      {/* ── Header (misma estructura que /preuni/semana-X) ────────── */}
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
              Bienvenido, {firstName}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#1F2F58AA" }}>
              4 semanas &middot; {totalSessions} sesiones &middot; {availableCount} disponibles en demo
            </p>
          </div>
        </div>

        {/* Progress bar global */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium" style={{ color: "#1F2F5899" }}>
              Progreso del demo
            </span>
            <span className="text-xs font-bold" style={{ color: "#1F2F58" }}>
              0/{availableCount} sesiones
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "#1F2F5815" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: "0%", backgroundColor: "#FBBC0C" }}
            />
          </div>
        </div>
      </div>

      {/* ── Soporte WhatsApp (equivalente al CTA /b2b) ────────────── */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
        style={{ borderColor: "#1F2F5815", backgroundColor: "#fff" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#73B8E720" }}
          >
            <MessageCircle className="w-5 h-5" style={{ color: "#73B8E7" }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>
              Dudas con el demo? Escribimos ya mismo
            </p>
            <p className="text-xs" style={{ color: "#1F2F5880" }}>
              Respuesta en menos de 2 horas, horario Ecuador
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/593997489821?text=Hola%2C%20estoy%20probando%20el%20demo%20de%20ITSEIA%20y%20tengo%20una%20pregunta"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#FBBC0C", color: "#0A1628" }}
        >
          WhatsApp
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      {/* ── Weeks list (misma forma que subjects en /preuni/semana) ─ */}
      <div className="space-y-6">
        {IGNITE_WEEKS.map((week) => {
          const weekSessions = week.subjects.flatMap((s) => s.sessions);
          const weekAvailable = weekSessions.filter(
            (s) => s.status === "available",
          ).length;
          const isOpen = weekAvailable > 0;

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
                  <h2 className="text-base font-bold" style={{ color: "#0A1628" }}>
                    Semana {week.number}: {week.name}
                  </h2>
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

              {/* Sessions summary */}
              <ul className="divide-y" style={{ borderColor: "#1F2F5808" }}>
                {weekSessions.map((session) => {
                  const isAvailable = session.status === "available";
                  const sessionUrl = isAvailable
                    ? `/demo/aula/sesion/${session.number}`
                    : "#";

                  const Row = (
                    <div
                      className="flex items-center gap-4 px-5 py-4 transition-colors"
                      style={{ color: "#1F2F58", opacity: isAvailable ? 1 : 0.6 }}
                    >
                      <div className="flex-shrink-0">
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
                      </div>

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

                      <div className="flex-shrink-0 flex items-center gap-1">
                        {isAvailable ? (
                          <>
                            <span
                              className="text-xs font-semibold hidden sm:block"
                              style={{ color: "#FBBC0C" }}
                            >
                              Iniciar
                            </span>
                            <PlayCircle
                              className="w-4 h-4"
                              style={{ color: "#FBBC0C" }}
                            />
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

              {/* CTA a la semana completa */}
              <div className="px-5 py-3 border-t flex items-center justify-end"
                style={{ borderColor: "#1F2F5808" }}
              >
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

      {/* ── Footer demo ───────────────────────────────────────────── */}
      <div className="mt-10 rounded-2xl border p-5 text-center"
        style={{
          borderColor: "#FBBC0C40",
          backgroundColor: "#FBBC0C10",
        }}
      >
        <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>
          Los 17 días restantes se desbloquean con tu cohorte oficial
        </p>
        <p className="mt-1 text-xs" style={{ color: "#1F2F58AA" }}>
          Semana 2: Construcción · Semana 3: Automatización · Semana 4: Lanzamiento
        </p>
        <Link
          href="/preuni-info"
          className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: "#0A1628" }}
        >
          Ver programa completo
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
