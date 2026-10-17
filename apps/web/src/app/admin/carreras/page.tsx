"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Program } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Loader2,
  BookOpen,
  Layers,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface CareerWithCounts extends Program {
  semesters_count: number;
  subjects_count: number;
  sessions_count: number;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  career_code: string;
  total_semesters: string;
  price: string;
  duration_months: string;
  is_active: boolean;
}

const EMPTY_FORM: FormData = {
  name: "",
  slug: "",
  description: "",
  career_code: "",
  total_semesters: "5",
  price: "",
  duration_months: "",
  is_active: true,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CarrerasPage() {
  const supabase = createClient();
  const [careers, setCareers] = useState<CareerWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const fetchCareers = useCallback(async () => {
    setLoading(true);

    // Fetch programs of type 'carrera'
    const { data: programs } = await supabase
      .from("programs")
      .select("*")
      .eq("type", "carrera")
      .order("created_at", { ascending: false });

    if (!programs || programs.length === 0) {
      setCareers([]);
      setLoading(false);
      return;
    }

    // For each career, fetch counts
    const careersWithCounts: CareerWithCounts[] = await Promise.all(
      programs.map(async (program) => {
        // Count semesters
        const { count: semestersCount } = await supabase
          .from("semesters")
          .select("*", { count: "exact", head: true })
          .eq("program_id", program.id);

        // Get semester IDs to count subjects
        const { data: semesters } = await supabase
          .from("semesters")
          .select("id")
          .eq("program_id", program.id);

        let subjectsCount = 0;
        let sessionsCount = 0;

        if (semesters && semesters.length > 0) {
          const semesterIds = semesters.map((s: { id: string }) => s.id);

          // Count subjects
          const { count: subCount } = await supabase
            .from("subjects")
            .select("*", { count: "exact", head: true })
            .in("semester_id", semesterIds);
          subjectsCount = subCount ?? 0;

          // Get subject IDs to count sessions
          const { data: subjects } = await supabase
            .from("subjects")
            .select("id")
            .in("semester_id", semesterIds);

          if (subjects && subjects.length > 0) {
            const subjectIds = subjects.map((s: { id: string }) => s.id);
            const { count: sesCount } = await supabase
              .from("sessions")
              .select("*", { count: "exact", head: true })
              .in("subject_id", subjectIds);
            sessionsCount = sesCount ?? 0;
          }
        }

        return {
          ...program,
          semesters_count: semestersCount ?? 0,
          subjects_count: subjectsCount,
          sessions_count: sessionsCount,
        };
      })
    );

    setCareers(careersWithCounts);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  function openEdit(career: CareerWithCounts) {
    setEditingId(career.id);
    setForm({
      name: career.name,
      slug: career.slug,
      description: career.description || "",
      career_code: career.career_code || "",
      total_semesters: career.total_semesters?.toString() || "5",
      price: career.price.toString(),
      duration_months: career.duration_months?.toString() || "",
      is_active: career.is_active,
    });
    setErrors({});
    setDialogOpen(true);
  }

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : slugify(name),
    }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (!form.slug.trim()) newErrors.slug = "El slug es requerido";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      newErrors.price = "Ingresa un precio valido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      type: "carrera" as const,
      career_code: form.career_code.trim() || null,
      total_semesters: form.total_semesters ? Number(form.total_semesters) : 5,
      price: Number(form.price),
      duration_months: form.duration_months ? Number(form.duration_months) : null,
      is_active: form.is_active,
    };

    if (editingId) {
      await supabase.from("programs").update(payload).eq("id", editingId);
    } else {
      await supabase.from("programs").insert(payload);
    }

    setSaving(false);
    setDialogOpen(false);
    fetchCareers();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carreras</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las 3 carreras tecnologicas de ITSEIA (tipo: carrera)
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Carrera</TableHead>
              <TableHead>Codigo</TableHead>
              <TableHead className="text-center">Semestres</TableHead>
              <TableHead className="text-center">Materias</TableHead>
              <TableHead className="text-center">Sesiones</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-gray-400" />
                </TableCell>
              </TableRow>
            ) : careers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-gray-400"
                >
                  No hay carreras registradas. Crea carreras de tipo
                  &quot;carrera&quot; desde Carreras (Config).
                </TableCell>
              </TableRow>
            ) : (
              careers.map((career) => (
                <TableRow key={career.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {career.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        /{career.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {career.career_code || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-600">
                      <CalendarDays className="size-3.5 text-gray-400" />
                      {career.semesters_count}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-600">
                      <BookOpen className="size-3.5 text-gray-400" />
                      {career.subjects_count}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-600">
                      <Layers className="size-3.5 text-gray-400" />
                      {career.sessions_count}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${career.price.toFixed(2)}/mes
                  </TableCell>
                  <TableCell>
                    {career.is_active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                        <span className="size-1.5 rounded-full bg-gray-300" />
                        Inactiva
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(career)}
                        title="Editar carrera"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Link href={`/admin/sesiones?career=${career.id}`}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Ver sesiones"
                        >
                          <ExternalLink className="size-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Carrera" : "Nueva Carrera"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="career-name">Nombre *</Label>
              <Input
                id="career-name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Inteligencia Artificial"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Slug + Code */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="career-slug">Slug</Label>
                <Input
                  id="career-slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="inteligencia-artificial"
                />
                {errors.slug && (
                  <p className="text-xs text-red-500">{errors.slug}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="career-code">Codigo Carrera</Label>
                <Input
                  id="career-code"
                  value={form.career_code}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      career_code: e.target.value,
                    }))
                  }
                  placeholder="IA, CD, BD"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-1.5">
              <Label htmlFor="career-desc">Descripcion</Label>
              <Textarea
                id="career-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Descripcion de la carrera..."
                rows={3}
              />
            </div>

            {/* Semesters + Price row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="career-semesters">Semestres</Label>
                <Input
                  id="career-semesters"
                  type="number"
                  min={1}
                  max={10}
                  value={form.total_semesters}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      total_semesters: e.target.value,
                    }))
                  }
                  placeholder="5"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="career-price">Precio (USD/mes) *</Label>
                <Input
                  id="career-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="220"
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="career-dur">Duracion (meses)</Label>
                <Input
                  id="career-dur"
                  type="number"
                  min={0}
                  value={form.duration_months}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      duration_months: e.target.value,
                    }))
                  }
                  placeholder="30"
                />
              </div>
            </div>

            {/* Active */}
            <div className="grid gap-1.5">
              <Label htmlFor="career-active">Estado</Label>
              <select
                id="career-active"
                value={form.is_active ? "true" : "false"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    is_active: e.target.value === "true",
                  }))
                }
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && (
                <Loader2
                  className="size-4 animate-spin"
                  data-icon="inline-start"
                />
              )}
              {editingId ? "Guardar Cambios" : "Crear Carrera"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
