"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Program, Profile, Enrollment } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, Loader2, UserCheck } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "active", label: "Activa" },
  { value: "completed", label: "Completada" },
  { value: "suspended", label: "Suspendida" },
  { value: "cancelled", label: "Cancelada" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100 text-blue-700",
  suspended: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Activa",
  completed: "Completada",
  suspended: "Suspendida",
  cancelled: "Cancelada",
};

interface EnrollmentRow {
  id: string;
  user_id: string;
  program_id: string;
  status: Enrollment["status"];
  enrolled_at: string;
  profiles: { full_name: string; email: string } | null;
  programs: { name: string } | null;
}

export default function EnrollmentsPage() {
  const supabase = createClient();
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formUserId, setFormUserId] = useState("");
  const [formProgramId, setFormProgramId] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("enrollments")
      .select(
        "id, user_id, program_id, status, enrolled_at, profiles!enrollments_user_id_fkey ( full_name, email ), programs!enrollments_program_id_fkey ( name )"
      )
      .order("enrolled_at", { ascending: false });
    setEnrollments((data as unknown as EnrollmentRow[]) || []);
    setLoading(false);
  }, []);

  const fetchBase = useCallback(async () => {
    const [progs, usrs] = await Promise.all([
      supabase.from("programs").select("*").eq("is_active", true).order("name"),
      supabase.from("profiles").select("*").order("full_name"),
    ]);
    setPrograms(progs.data || []);
    setUsers(usrs.data || []);
  }, []);

  useEffect(() => {
    fetchBase();
    fetchEnrollments();
  }, [fetchBase, fetchEnrollments]);

  function openCreate() {
    setFormUserId("");
    setFormProgramId("");
    setFormErrors({});
    setDialogOpen(true);
  }

  async function handleCreate() {
    const errors: Record<string, string> = {};
    if (!formUserId) errors.user = "Selecciona un alumno";
    if (!formProgramId) errors.program = "Selecciona una carrera";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);

    // Check for existing enrollment
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", formUserId)
      .eq("program_id", formProgramId)
      .in("status", ["active", "completed"])
      .limit(1);

    if (existing && existing.length > 0) {
      setFormErrors({
        program: "Este alumno ya tiene una matricula activa en esta carrera",
      });
      setSaving(false);
      return;
    }

    await supabase.from("enrollments").insert({
      user_id: formUserId,
      program_id: formProgramId,
      status: "active",
    });

    setSaving(false);
    setDialogOpen(false);
    fetchEnrollments();
  }

  async function handleStatusChange(id: string, newStatus: Enrollment["status"]) {
    await supabase.from("enrollments").update({ status: newStatus }).eq("id", id);
    fetchEnrollments();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matriculas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las matriculas de los alumnos
          </p>
        </div>
        <Button onClick={openCreate} size="lg">
          <UserCheck className="size-4" data-icon="inline-start" />
          Matricular Alumno
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Alumno</TableHead>
              <TableHead>Carrera</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Matricula</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-gray-400" />
                </TableCell>
              </TableRow>
            ) : enrollments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-gray-400"
                >
                  No hay matriculas registradas
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {enrollment.profiles?.full_name || "—"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {enrollment.profiles?.email || "—"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {enrollment.programs?.name || "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[enrollment.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {STATUS_LABELS[enrollment.status] || enrollment.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(enrollment.enrolled_at).toLocaleDateString(
                      "es-EC",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <select
                      value={enrollment.status}
                      onChange={(e) =>
                        handleStatusChange(
                          enrollment.id,
                          e.target.value as Enrollment["status"]
                        )
                      }
                      className="h-7 rounded border border-gray-200 bg-white px-2 text-xs text-gray-600 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Matricular Alumno</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* User select */}
            <div className="grid gap-1.5">
              <Label>Alumno *</Label>
              <select
                value={formUserId}
                onChange={(e) => {
                  setFormUserId(e.target.value);
                  setFormErrors({});
                }}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Seleccionar alumno...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.email} ({u.email})
                  </option>
                ))}
              </select>
              {formErrors.user && (
                <p className="text-xs text-red-500">{formErrors.user}</p>
              )}
            </div>

            {/* Program select */}
            <div className="grid gap-1.5">
              <Label>Carrera *</Label>
              <select
                value={formProgramId}
                onChange={(e) => {
                  setFormProgramId(e.target.value);
                  setFormErrors({});
                }}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Seleccionar carrera...</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.price})
                  </option>
                ))}
              </select>
              {formErrors.program && (
                <p className="text-xs text-red-500">{formErrors.program}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleCreate} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
              Matricular
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
