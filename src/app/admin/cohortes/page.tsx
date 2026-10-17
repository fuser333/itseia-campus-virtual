"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Plus,
  GraduationCap,
  Calendar,
  Sparkles,
  Brain,
  Database,
  BarChart3,
  Settings,
} from "lucide-react";

interface ProgramEnrollmentGroup {
  programId: string;
  programName: string;
  programType: string;
  count: number;
  students: { id: string; full_name: string; email: string }[];
}

interface CohortForm {
  name: string;
  startDate: string;
  endDate: string;
  program: string;
  maxStudents: number;
}

const EMPTY_COHORT_FORM: CohortForm = {
  name: "",
  startDate: "",
  endDate: "",
  program: "",
  maxStudents: 30,
};

export default function AdminCohortesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<ProgramEnrollmentGroup[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CohortForm>(EMPTY_COHORT_FORM);
  const [programs, setPrograms] = useState<
    { id: string; name: string; type: string }[]
  >([]);
  const [plannedCohorts, setPlannedCohorts] = useState<
    { name: string; startDate: string; endDate: string; program: string; maxStudents: number }[]
  >([]);

  useEffect(() => {
    async function load() {
      // Fetch all programs
      const { data: programsData } = await supabase
        .from("programs")
        .select("id, name, type")
        .eq("is_active", true)
        .order("name");

      if (programsData) {
        setPrograms(programsData);
      }

      // Fetch enrollments grouped by program
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select(
          "id, program_id, status, profiles!enrollments_user_id_fkey(id, full_name, email), programs!enrollments_program_id_fkey(id, name, type)"
        )
        .eq("status", "active");

      if (enrollments) {
        const groupMap = new Map<string, ProgramEnrollmentGroup>();

        for (const enrollment of enrollments) {
          const program = enrollment.programs as unknown as {
            id: string;
            name: string;
            type: string;
          } | null;
          const profile = enrollment.profiles as unknown as {
            id: string;
            full_name: string;
            email: string;
          } | null;

          if (!program) continue;

          if (!groupMap.has(program.id)) {
            groupMap.set(program.id, {
              programId: program.id,
              programName: program.name,
              programType: program.type,
              count: 0,
              students: [],
            });
          }

          const group = groupMap.get(program.id)!;
          group.count++;
          if (profile) {
            group.students.push({
              id: profile.id,
              full_name: profile.full_name || profile.email,
              email: profile.email,
            });
          }
        }

        setGroups(
          Array.from(groupMap.values()).sort((a, b) => b.count - a.count)
        );
      }

      setLoading(false);
    }
    load();
  }, []);

  function handleCreateCohort() {
    if (!form.name.trim()) return;

    const programName =
      programs.find((p) => p.id === form.program)?.name || form.program;

    setPlannedCohorts((prev) => [
      ...prev,
      {
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
        program: programName,
        maxStudents: form.maxStudents,
      },
    ]);
    setForm(EMPTY_COHORT_FORM);
    setDialogOpen(false);
  }

  const typeLabels: Record<string, { label: string; color: string }> = {
    carrera: { label: "Carrera", color: "bg-[#1F2F58]/10 text-[#1F2F58]" },
    curso: { label: "Curso", color: "bg-[#73B8E7]/15 text-[#73B8E7]" },
    preuni: {
      label: "Preuniversitario",
      color: "bg-[#FBBC0C]/15 text-[#FBBC0C]",
    },
    bootcamp: { label: "Bootcamp", color: "bg-[#F0846D]/15 text-[#F0846D]" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1F2F58] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion de Cohortes
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Organiza estudiantes en cohortes y gestiona generaciones
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#1F2F58] text-white hover:bg-[#1F2F58]/90 gap-2" />
            }
          >
            <Plus className="w-4 h-4" />
            Planificar Cohorte
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Planificar Nueva Cohorte</DialogTitle>
              <DialogDescription>
                Crea un plan para una nueva cohorte. Las tablas de cohorte en la
                base de datos se crearan proximamente.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <Label className="text-sm">Nombre de la Cohorte *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Cohorte Abril 2026 — Los Pioneros"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Fecha Inicio</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Fecha Fin</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Carrera</Label>
                <select
                  value={form.program}
                  onChange={(e) =>
                    setForm({ ...form, program: e.target.value })
                  }
                  className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1F2F58] focus:outline-none"
                >
                  <option value="">Seleccionar carrera...</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm">Maximo de Estudiantes</Label>
                <Input
                  type="number"
                  value={form.maxStudents}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maxStudents: parseInt(e.target.value) || 30,
                    })
                  }
                  min={1}
                  max={200}
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateCohort}
                disabled={!form.name.trim()}
                className="bg-[#1F2F58] text-white hover:bg-[#1F2F58]/90"
              >
                Crear Plan de Cohorte
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Banner */}
      <Card className="border-[#FBBC0C]/20 bg-[#FBBC0C]/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="w-10 h-10 rounded-lg bg-[#FBBC0C]/15 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#FBBC0C]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Sistema de Cohortes en Desarrollo
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Las tablas de cohorte (cohorts, cohort_members, cohort_posts) se
              crearan en la siguiente migracion. Por ahora puedes planificar
              cohortes y ver las matriculas agrupadas por carrera como
              &quot;cohortes naturales&quot;.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Planned Cohorts */}
      {plannedCohorts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1F2F58]" />
            Cohortes Planificadas
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plannedCohorts.map((cohort, idx) => (
              <Card key={idx} className="border-dashed border-[#1F2F58]/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-[#1F2F58]/10 text-[#1F2F58] border-none text-xs">
                      Planificada
                    </Badge>
                    <span className="text-xs text-gray-400">
                      Max {cohort.maxStudents}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {cohort.name}
                  </h3>
                  {cohort.program && (
                    <p className="text-xs text-gray-500 mt-1">
                      {cohort.program}
                    </p>
                  )}
                  {(cohort.startDate || cohort.endDate) && (
                    <p className="text-xs text-gray-400 mt-2">
                      {cohort.startDate &&
                        new Date(cohort.startDate).toLocaleDateString("es-EC", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      {cohort.startDate && cohort.endDate && " — "}
                      {cohort.endDate &&
                        new Date(cohort.endDate).toLocaleDateString("es-EC", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Natural Cohorts (Enrollments by Program) */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#73B8E7]" />
          Cohortes Naturales (Matriculas por Carrera)
        </h2>

        {groups.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Database className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No hay matriculas activas agrupadas por carrera.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => {
              const config = typeLabels[group.programType] || typeLabels.curso;
              return (
                <Card
                  key={group.programId}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#1F2F58]/5 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-[#1F2F58]" />
                      </div>
                      <Badge
                        className={`border-none text-[10px] uppercase tracking-wider ${config.color}`}
                      >
                        {config.label}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm text-gray-900 mt-2">
                      {group.programName}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {group.count} estudiante{group.count !== 1 ? "s" : ""}{" "}
                      activo{group.count !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Progress-style bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 mb-3">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1F2F58] to-[#73B8E7] transition-all"
                        style={{
                          width: `${Math.min((group.count / 50) * 100, 100)}%`,
                        }}
                      />
                    </div>

                    {/* Student list preview */}
                    <div className="space-y-1.5">
                      {group.students.slice(0, 4).map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center gap-2"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#1F2F58]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-[#1F2F58]">
                              {student.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 truncate">
                            {student.full_name}
                          </span>
                        </div>
                      ))}
                      {group.count > 4 && (
                        <p className="text-[10px] text-gray-400 pl-8">
                          +{group.count - 4} mas
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Roadmap de Cohortes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RoadmapItem
              step={1}
              title="Creacion de tablas en DB"
              description="Migrar cohorts, cohort_members, cohort_posts a Supabase"
              status="pendiente"
            />
            <RoadmapItem
              step={2}
              title="Asignacion automatica"
              description="Al matricularse, asignar a la cohorte correspondiente por carrera y fecha"
              status="pendiente"
            />
            <RoadmapItem
              step={3}
              title="Foro de cohorte"
              description="Espacio de discusion exclusivo para cada cohorte"
              status="pendiente"
            />
            <RoadmapItem
              step={4}
              title="Ranking y gamificacion"
              description="Leaderboard por XP dentro de cada cohorte"
              status="pendiente"
            />
            <RoadmapItem
              step={5}
              title="Peer review"
              description="Sistema de revision entre pares dentro de la cohorte"
              status="pendiente"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RoadmapItem({
  step,
  title,
  description,
  status,
}: {
  step: number;
  title: string;
  description: string;
  status: "completado" | "en_progreso" | "pendiente";
}) {
  const statusConfig = {
    completado: {
      badge: "Completado",
      color: "bg-emerald-100 text-emerald-700",
      dot: "bg-emerald-500",
    },
    en_progreso: {
      badge: "En Progreso",
      color: "bg-[#FBBC0C]/15 text-[#FBBC0C]",
      dot: "bg-[#FBBC0C]",
    },
    pendiente: {
      badge: "Pendiente",
      color: "bg-gray-100 text-gray-500",
      dot: "bg-gray-300",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            status === "pendiente"
              ? "bg-gray-100 text-gray-400"
              : status === "en_progreso"
                ? "bg-[#FBBC0C]/15 text-[#FBBC0C]"
                : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {step}
        </div>
      </div>
      <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <Badge className={`border-none text-[10px] ${config.color}`}>
            {config.badge}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
