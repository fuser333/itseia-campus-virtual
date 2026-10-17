"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Course, Program } from "@/types/database";
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
import { Plus, Pencil, Trash2, Loader2, Filter } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface CourseWithProgram extends Course {
  programs: { name: string } | null;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  program_id: string;
  order_index: string;
  is_active: boolean;
}

const EMPTY_FORM: FormData = {
  name: "",
  slug: "",
  description: "",
  program_id: "",
  order_index: "0",
  is_active: true,
};

export default function CoursesPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<CourseWithProgram[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterProgram, setFilterProgram] = useState("");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const fetchPrograms = useCallback(async () => {
    const { data } = await supabase
      .from("programs")
      .select("*")
      .order("name");
    setPrograms(data || []);
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("courses")
      .select("*, programs ( name )")
      .order("order_index", { ascending: true });

    if (filterProgram) {
      query = query.eq("program_id", filterProgram);
    }

    const { data } = await query;
    setCourses((data as CourseWithProgram[]) || []);
    setLoading(false);
  }, [filterProgram]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, program_id: filterProgram });
    setErrors({});
    setDialogOpen(true);
  }

  function openEdit(course: CourseWithProgram) {
    setEditingId(course.id);
    setForm({
      name: course.name,
      slug: course.slug,
      description: course.description || "",
      program_id: course.program_id,
      order_index: course.order_index.toString(),
      is_active: course.is_active,
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
    if (!form.program_id) newErrors.program_id = "Selecciona una carrera";
    if (isNaN(Number(form.order_index)))
      newErrors.order_index = "El orden debe ser un numero";

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
      program_id: form.program_id,
      order_index: Number(form.order_index),
      is_active: form.is_active,
    };

    if (editingId) {
      await supabase.from("courses").update(payload).eq("id", editingId);
    } else {
      await supabase.from("courses").insert(payload);
    }

    setSaving(false);
    setDialogOpen(false);
    fetchCourses();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("¿Estas seguro de eliminar este curso?")) return;
    await supabase.from("courses").delete().eq("id", id);
    fetchCourses();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los cursos dentro de cada carrera
          </p>
        </div>
        <Button onClick={openCreate} size="lg">
          <Plus className="size-4" data-icon="inline-start" />
          Nuevo Curso
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="size-4 text-gray-400" />
        <select
          value={filterProgram}
          onChange={(e) => setFilterProgram(e.target.value)}
          className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Todas las carreras</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {filterProgram && (
          <button
            onClick={() => setFilterProgram("")}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Nombre</TableHead>
              <TableHead>Carrera</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Estado</TableHead>
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
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-gray-400"
                >
                  No hay cursos registrados
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {course.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        /{course.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {course.programs?.name || "—"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex size-6 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-600">
                      {course.order_index}
                    </span>
                  </TableCell>
                  <TableCell>
                    {course.is_active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                        <span className="size-1.5 rounded-full bg-gray-300" />
                        Inactivo
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(course)}
                        title="Editar"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(course.id)}
                        title="Eliminar"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Curso" : "Nuevo Curso"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="course-name">Nombre *</Label>
              <Input
                id="course-name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Fundamentos de Machine Learning"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Slug */}
            <div className="grid gap-1.5">
              <Label htmlFor="course-slug">Slug</Label>
              <Input
                id="course-slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="fundamentos-machine-learning"
              />
              {errors.slug && (
                <p className="text-xs text-red-500">{errors.slug}</p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-1.5">
              <Label htmlFor="course-desc">Descripcion</Label>
              <Textarea
                id="course-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Descripcion del curso..."
                rows={3}
              />
            </div>

            {/* Program */}
            <div className="grid gap-1.5">
              <Label htmlFor="course-program">Carrera *</Label>
              <select
                id="course-program"
                value={form.program_id}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, program_id: e.target.value }))
                }
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Seleccionar carrera...</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.program_id && (
                <p className="text-xs text-red-500">{errors.program_id}</p>
              )}
            </div>

            {/* Order + Active */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="course-order">Orden</Label>
                <Input
                  id="course-order"
                  type="number"
                  min={0}
                  value={form.order_index}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      order_index: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
                {errors.order_index && (
                  <p className="text-xs text-red-500">{errors.order_index}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="course-active">Estado</Label>
                <select
                  id="course-active"
                  value={form.is_active ? "true" : "false"}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_active: e.target.value === "true",
                    }))
                  }
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
              {editingId ? "Guardar Cambios" : "Crear Curso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
