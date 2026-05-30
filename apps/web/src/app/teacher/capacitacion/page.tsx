"use client";

// ============================================================
// /teacher/capacitacion — Curso "Docencia Virtual Efectiva" 120h
// CES: Art. 61 RRA 2022 - formacion docente en modalidad online
// ============================================================

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Loader2,
  GraduationCap,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Download,
  ArrowLeft,
  BookOpen,
  Clock,
  Award,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { completeModule } from "@/features/teacher/actions";
import type { TrainingProgressSummary, TrainingModuleUI } from "@/types/database";

const HOURS_TOTAL = 120;

export default function CapacitacionPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [progress, setProgress] = useState<TrainingProgressSummary | null>(null);
  const [modules, setModules] = useState<TrainingModuleUI[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [certMessage, setCertMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);

    // Load progress and modules in parallel
    const [progressRes, modulesRes] = await Promise.all([
      fetch(`/api/teacher/training-progress?teacher_id=${user.id}`),
      fetch(`/api/teacher/training-modules?teacher_id=${user.id}`),
    ]);

    if (progressRes.ok) setProgress(await progressRes.json());
    if (modulesRes.ok) setModules(await modulesRes.json());
    setLoading(false);
  }

  async function handleCompleteSession(sessionId: string) {
    setCompleting(sessionId);
    const result = await completeModule(sessionId);
    if (result.success) {
      // Reload data to show updated progress
      await loadData();
      if (result.certificateGenerated) {
        setCertMessage("¡Felicitaciones! Has completado las 120 horas. Tu certificado esta listo.");
      }
    }
    setCompleting(null);
  }

  async function handleDownloadCertificate() {
    if (!userId) return;
    setDownloadingCert(true);
    try {
      const res = await fetch(`/api/teacher/certificate?teacher_id=${userId}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificado-docencia-virtual-itseia.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        setCertMessage(data.error || "Error generando certificado");
      }
    } catch {
      setCertMessage("Error de red generando certificado");
    } finally {
      setDownloadingCert(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  const hoursCompleted = progress?.hoursCompleted ?? 0;
  const percentage = Math.min(Math.round((hoursCompleted / HOURS_TOTAL) * 100), 100);
  const hasCertificate = progress?.hasCertificate ?? false;
  const completedSessionIds = new Set(progress?.completedSessionIds ?? []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/teacher">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="size-4" data-icon="inline-start" />
            Volver al panel
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Mi Capacitacion Docente</h1>
        <p className="mt-1 text-sm text-gray-300">
          Requisito Art. 61 RRA 2022 — Certificacion en docencia virtual (120 horas)
        </p>
      </div>

      {/* Certificate message */}
      {certMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {certMessage}
        </div>
      )}

      {/* Progress card */}
      <Card className="border-[#1F2F58]/10 bg-gradient-to-br from-[#1F2F58]/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#1F2F58]">
                  {hoursCompleted.toFixed(1)}
                </p>
                <p className="text-xs text-gray-300">horas completadas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-400">{HOURS_TOTAL}</p>
                <p className="text-xs text-gray-300">horas totales</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#FBBC0C]">
                  {modules.filter((m) => m.isCompleted).length}
                </p>
                <p className="text-xs text-gray-300">modulos completos</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-200">Progreso general</span>
                <span className="font-bold text-[#1F2F58]">{percentage}%</span>
              </div>
              <div className="h-4 w-full rounded-full bg-gray-200">
                <div
                  className={`h-4 rounded-full transition-all duration-700 ${
                    hasCertificate ? "bg-emerald-500" : "bg-[#1F2F58]"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {!hasCertificate && (
                <p className="mt-1 text-xs text-gray-400">
                  Faltan {(HOURS_TOTAL - hoursCompleted).toFixed(1)} horas para obtener tu certificado
                </p>
              )}
            </div>

            {/* Certificate button */}
            <div className="shrink-0">
              {hasCertificate ? (
                <Button
                  onClick={handleDownloadCertificate}
                  disabled={downloadingCert}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {downloadingCert ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Award className="size-4" />
                  )}
                  Descargar Certificado
                </Button>
              ) : (
                <Button disabled variant="outline" className="gap-2 opacity-50">
                  <Download className="size-4" />
                  Certificado (al completar)
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#1F2F58]/10">
              <BookOpen className="size-4 text-[#1F2F58]" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{modules.length}</p>
              <p className="text-xs text-gray-300">Modulos totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#FBBC0C]/20">
              <Clock className="size-4 text-[#FBBC0C]" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {(HOURS_TOTAL - hoursCompleted).toFixed(0)}h
              </p>
              <p className="text-xs text-gray-300">Horas restantes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className={`flex size-9 items-center justify-center rounded-lg ${hasCertificate ? "bg-emerald-100" : "bg-gray-100"}`}>
              <GraduationCap className={`size-4 ${hasCertificate ? "text-emerald-600" : "text-gray-400"}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${hasCertificate ? "text-emerald-600" : "text-gray-300"}`}>
                {hasCertificate ? "Certificado" : "En progreso"}
              </p>
              <p className="text-xs text-gray-300">Estado de certificacion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules list */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">
          Módulos del Curso — Docencia Virtual Efectiva
        </h2>

        {modules.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <GraduationCap className="mx-auto size-10 text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">
                El programa de capacitacion esta siendo configurado. Contacta al coordinador.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {modules.map((mod) => {
              const isExpanded = expandedModule === mod.subjectId;
              const modPercentage =
                mod.sessions.length > 0
                  ? Math.round((mod.completedSessions / mod.sessions.length) * 100)
                  : 0;

              return (
                <Card
                  key={mod.subjectId}
                  className={`transition-all ${mod.isCompleted ? "border-emerald-200 bg-emerald-50/30" : ""}`}
                >
                  <CardHeader className="pb-0">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedModule(isExpanded ? null : mod.subjectId)
                      }
                      className="flex w-full items-center gap-3 text-left"
                    >
                      {/* Status icon */}
                      <div className="shrink-0">
                        {mod.isCompleted ? (
                          <CheckCircle2 className="size-6 text-emerald-500" />
                        ) : mod.completedSessions > 0 ? (
                          <div className="relative size-6">
                            <Circle className="size-6 text-[#FBBC0C]" />
                            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#FBBC0C]">
                              {modPercentage}%
                            </span>
                          </div>
                        ) : (
                          <Circle className="size-6 text-gray-300" />
                        )}
                      </div>

                      {/* Module info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                            {mod.code}
                          </span>
                          <span className="text-[10px] font-medium text-gray-400">
                            Modulo {mod.order}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#73B8E7]/20 px-1.5 py-0.5 text-[10px] font-medium text-[#1F2F58]">
                            <Clock className="size-2.5" />
                            {mod.hours}h
                          </span>
                        </div>
                        <CardTitle className="text-sm mt-0.5 font-semibold text-white">
                          {mod.name}
                        </CardTitle>
                        <div className="mt-1.5 h-1.5 w-full max-w-xs rounded-full bg-gray-200">
                          <div
                            className={`h-1.5 rounded-full transition-all ${mod.isCompleted ? "bg-emerald-500" : "bg-[#1F2F58]"}`}
                            style={{ width: `${modPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Expand icon */}
                      <div className="shrink-0 text-gray-400">
                        {isExpanded ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </div>
                    </button>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-3">
                      {mod.description && (
                        <p className="mb-3 text-sm text-gray-600 leading-relaxed">
                          {mod.description}
                        </p>
                      )}

                      <div className="space-y-2">
                        {mod.sessions.map((sess) => {
                          const isSessionCompleted = completedSessionIds.has(sess.id);
                          const isCurrentlyCompleting = completing === sess.id;

                          return (
                            <div
                              key={sess.id}
                              className={`flex items-center gap-3 rounded-lg border p-3 ${
                                isSessionCompleted
                                  ? "border-emerald-200 bg-emerald-50"
                                  : "border-gray-200 bg-white"
                              }`}
                            >
                              {isSessionCompleted ? (
                                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                              ) : (
                                <PlayCircle className="size-4 shrink-0 text-gray-300" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  Sesion {sess.number}: {sess.title}
                                </p>
                                {sess.description && (
                                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                                    {sess.description}
                                  </p>
                                )}
                                {isSessionCompleted && sess.completedAt && (
                                  <p className="text-[10px] text-emerald-600 mt-0.5">
                                    Completada el{" "}
                                    {new Date(sess.completedAt).toLocaleDateString("es-EC", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                )}
                              </div>
                              {!isSessionCompleted && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={isCurrentlyCompleting}
                                  onClick={() => handleCompleteSession(sess.id)}
                                  className="shrink-0 text-xs"
                                >
                                  {isCurrentlyCompleting ? (
                                    <Loader2 className="size-3 animate-spin" />
                                  ) : (
                                    "Marcar completada"
                                  )}
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* CES note */}
      <Card className="border-[#73B8E7]/20 bg-[#73B8E7]/5">
        <CardContent className="py-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold text-[#1F2F58]">Requisito CES:</span> El Art. 61
            del Reglamento de Regimen Academico (RRA) 2022 establece que los docentes de
            modalidad en linea deben acreditar al menos{" "}
            <span className="font-semibold">120 horas de capacitacion</span> en docencia
            virtual. Este certificado sera parte del expediente ITSEIA presentado a SENESCYT.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
