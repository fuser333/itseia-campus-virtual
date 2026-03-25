"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Program, Course, Module, Lesson } from "@/types/database";
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
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Filter,
  Video,
  BrainCircuit,
  Eye,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface LessonWithModule extends Lesson {
  modules: { name: string; course_id: string } | null;
}

interface FormData {
  title: string;
  content_markdown: string;
  video_url: string;
  pdf_url: string;
  ai_prompt_suggested: string;
  module_id: string;
  order_index: string;
  duration_minutes: string;
  is_active: boolean;
}

const EMPTY_FORM: FormData = {
  title: "",
  content_markdown: "",
  video_url: "",
  pdf_url: "",
  ai_prompt_suggested: "",
  module_id: "",
  order_index: "0",
  duration_minutes: "",
  is_active: true,
};

export default function LessonsPage() {
  const supabase = createClient();
  const [lessons, setLessons] = useState<LessonWithModule[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [formCourses, setFormCourses] = useState<Course[]>([]);
  const [formModules, setFormModules] = useState<Module[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [filterProgram, setFilterProgram] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterModule, setFilterModule] = useState("");

  const [formProgram, setFormProgram] = useState("");
  const [formCourse, setFormCourse] = useState("");

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Fetch base data
  useEffect(() => {
    async function fetchBase() {
      const [progs, crs, mods] = await Promise.all([
        supabase.from("programs").select("*").order("name"),
        supabase.from("courses").select("*").order("order_index"),
        supabase.from("modules").select("*").order("order_index"),
      ]);
      setPrograms(progs.data || []);
      setCourses(crs.data || []);
      setModules(mods.data || []);
    }
    fetchBase();
  }, []);

  // Filter courses by program
  useEffect(() => {
    if (filterProgram) {
      setFilteredCourses(
        courses.filter((c) => c.program_id === filterProgram)
      );
    } else {
      setFilteredCourses(courses);
    }
    setFilterCourse("");
    setFilterModule("");
  }, [filterProgram, courses]);

  // Filter modules by course
  useEffect(() => {
    if (filterCourse) {
      setFilteredModules(
        modules.filter((m) => m.course_id === filterCourse)
      );
    } else if (filterProgram) {
      const courseIds = filteredCourses.map((c) => c.id);
      setFilteredModules(modules.filter((m) => courseIds.includes(m.course_id)));
    } else {
      setFilteredModules(modules);
    }
    setFilterModule("");
  }, [filterCourse, filteredCourses, modules, filterProgram]);

  // Form: courses by program
  useEffect(() => {
    if (formProgram) {
      setFormCourses(courses.filter((c) => c.program_id === formProgram));
    } else {
      setFormCourses(courses);
    }
    setFormCourse("");
    setForm((prev) => ({ ...prev, module_id: "" }));
  }, [formProgram, courses]);

  // Form: modules by course
  useEffect(() => {
    if (formCourse) {
      setFormModules(modules.filter((m) => m.course_id === formCourse));
    } else {
      setFormModules([]);
    }
    setForm((prev) => ({ ...prev, module_id: "" }));
  }, [formCourse, modules]);

  // Fetch lessons
  const fetchLessons = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("lessons")
      .select("*, modules ( name, course_id )")
      .order("order_index", { ascending: true });

    if (filterModule) {
      query = query.eq("module_id", filterModule);
    } else if (filterCourse) {
      const moduleIds = filteredModules.map((m) => m.id);
      if (moduleIds.length > 0) {
        query = query.in("module_id", moduleIds);
      } else {
        setLessons([]);
        setLoading(false);
        return;
      }
    } else if (filterProgram) {
      const courseIds = filteredCourses.map((c) => c.id);
      const moduleIds = modules
        .filter((m) => courseIds.includes(m.course_id))
        .map((m) => m.id);
      if (moduleIds.length > 0) {
        query = query.in("module_id", moduleIds);
      } else {
        setLessons([]);
        setLoading(false);
        return;
      }
    }

    const { data } = await query.limit(100);
    setLessons((data as LessonWithModule[]) || []);
    setLoading(false);
  }, [filterProgram, filterCourse, filterModule, filteredCourses, filteredModules, modules]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormProgram(filterProgram);
    setFormCourse(filterCourse);
    if (filterModule) {
      setForm((prev) => ({ ...prev, module_id: filterModule }));
    }
    setErrors({});
    setDialogOpen(true);
  }

  function openEdit(lesson: LessonWithModule) {
    setEditingId(lesson.id);
    setForm({
      title: lesson.title,
      content_markdown: lesson.content_markdown || "",
      video_url: lesson.video_url || "",
      pdf_url: lesson.pdf_url || "",
      ai_prompt_suggested: lesson.ai_prompt_suggested || "",
      module_id: lesson.module_id,
      order_index: lesson.order_index.toString(),
      duration_minutes: lesson.duration_minutes?.toString() || "",
      is_active: lesson.is_active,
    });

    // Set form program and course from module
    const mod = modules.find((m) => m.id === lesson.module_id);
    if (mod) {
      const course = courses.find((c) => c.id === mod.course_id);
      if (course) {
        setFormProgram(course.program_id);
        setFormCourse(course.id);
      }
    }

    setErrors({});
    setDialogOpen(true);
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.title.trim()) newErrors.title = "El titulo es requerido";
    if (!form.module_id) newErrors.module_id = "Selecciona un modulo";
    if (isNaN(Number(form.order_index)))
      newErrors.order_index = "El orden debe ser un numero";
    if (
      form.duration_minutes &&
      (isNaN(Number(form.duration_minutes)) ||
        Number(form.duration_minutes) < 0)
    )
      newErrors.duration_minutes = "Duracion invalida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      content_markdown: form.content_markdown.trim() || null,
      video_url: form.video_url.trim() || null,
      pdf_url: form.pdf_url.trim() || null,
      ai_prompt_suggested: form.ai_prompt_suggested.trim() || null,
      module_id: form.module_id,
      order_index: Number(form.order_index),
      duration_minutes: form.duration_minutes
        ? Number(form.duration_minutes)
        : null,
      is_active: form.is_active,
    };

    if (editingId) {
      await supabase.from("lessons").update(payload).eq("id", editingId);
    } else {
      await supabase.from("lessons").insert(payload);
    }

    setSaving(false);
    setDialogOpen(false);
    fetchLessons();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("¿Estas seguro de eliminar esta leccion?")) return;
    await supabase.from("lessons").delete().eq("id", id);
    fetchLessons();
  }

  function openPreview(content: string) {
    setPreviewContent(content);
    setPreviewOpen(true);
  }

  function getModuleName(moduleId: string): string {
    const mod = modules.find((m) => m.id === moduleId);
    return mod?.name || "—";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lecciones</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona el contenido de cada modulo
          </p>
        </div>
        <Button onClick={openCreate} size="lg">
          <Plus className="size-4" data-icon="inline-start" />
          Nueva Leccion
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
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

        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          disabled={!filterProgram}
        >
          <option value="">Todos los cursos</option>
          {filteredCourses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filterModule}
          onChange={(e) => setFilterModule(e.target.value)}
          className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          disabled={!filterCourse}
        >
          <option value="">Todos los modulos</option>
          {filteredModules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        {(filterProgram || filterCourse || filterModule) && (
          <button
            onClick={() => {
              setFilterProgram("");
              setFilterCourse("");
              setFilterModule("");
            }}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Titulo</TableHead>
              <TableHead>Modulo</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>AI Prompt</TableHead>
              <TableHead>Duracion</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-gray-400" />
                </TableCell>
              </TableRow>
            ) : lessons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-gray-400"
                >
                  No hay lecciones registradas
                </TableCell>
              </TableRow>
            ) : (
              lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>
                    <div className="max-w-[250px]">
                      <div className="truncate font-medium text-gray-900">
                        {lesson.title}
                      </div>
                      {lesson.is_active ? (
                        <span className="text-[10px] text-emerald-500">
                          Activa
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">
                          Inactiva
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {lesson.modules?.name || getModuleName(lesson.module_id)}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex size-6 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-600">
                      {lesson.order_index}
                    </span>
                  </TableCell>
                  <TableCell>
                    {lesson.video_url ? (
                      <Video className="size-4 text-[#73B8E7]" />
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {lesson.ai_prompt_suggested ? (
                      <BrainCircuit className="size-4 text-[#F0846D]" />
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {lesson.duration_minutes
                      ? `${lesson.duration_minutes} min`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {lesson.content_markdown && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            openPreview(lesson.content_markdown || "")
                          }
                          title="Vista previa"
                        >
                          <Eye className="size-3.5 text-[#73B8E7]" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(lesson)}
                        title="Editar"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(lesson.id)}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Leccion" : "Nueva Leccion"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Title */}
            <div className="grid gap-1.5">
              <Label htmlFor="lesson-title">Titulo *</Label>
              <Input
                id="lesson-title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ej: Introduccion a Redes Neuronales"
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Module selection: Program → Course → Module */}
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1.5">
                <Label>Carrera</Label>
                <select
                  value={formProgram}
                  onChange={(e) => setFormProgram(e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Seleccionar...</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label>Curso</Label>
                <select
                  value={formCourse}
                  onChange={(e) => setFormCourse(e.target.value)}
                  disabled={!formProgram}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                >
                  <option value="">Seleccionar...</option>
                  {formCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label>Modulo *</Label>
                <select
                  value={form.module_id}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, module_id: e.target.value }))
                  }
                  disabled={!formCourse}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                >
                  <option value="">Seleccionar...</option>
                  {formModules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {errors.module_id && (
                  <p className="text-xs text-red-500">{errors.module_id}</p>
                )}
              </div>
            </div>

            {/* Content Markdown */}
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="lesson-md">Contenido (Markdown)</Label>
                {form.content_markdown && (
                  <button
                    type="button"
                    onClick={() => openPreview(form.content_markdown)}
                    className="inline-flex items-center gap-1 text-xs text-[#73B8E7] hover:underline"
                  >
                    <Eye className="size-3" />
                    Vista previa
                  </button>
                )}
              </div>
              <Textarea
                id="lesson-md"
                value={form.content_markdown}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    content_markdown: e.target.value,
                  }))
                }
                placeholder="# Titulo&#10;&#10;Contenido de la leccion en Markdown..."
                rows={8}
                className="font-mono text-xs"
              />
            </div>

            {/* Video + PDF */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="lesson-video">URL Video</Label>
                <Input
                  id="lesson-video"
                  value={form.video_url}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, video_url: e.target.value }))
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lesson-pdf">URL PDF</Label>
                <Input
                  id="lesson-pdf"
                  value={form.pdf_url}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, pdf_url: e.target.value }))
                  }
                  placeholder="https://storage.../leccion.pdf"
                />
              </div>
            </div>

            {/* AI Prompt Suggested */}
            <div className="grid gap-1.5">
              <Label htmlFor="lesson-ai">Prompt AI Sugerido</Label>
              <Textarea
                id="lesson-ai"
                value={form.ai_prompt_suggested}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    ai_prompt_suggested: e.target.value,
                  }))
                }
                placeholder="Ej: Explicame como funciona una red neuronal convolucional con un ejemplo practico..."
                rows={3}
              />
            </div>

            {/* Order + Duration + Active */}
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="lesson-order">Orden</Label>
                <Input
                  id="lesson-order"
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
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lesson-dur">Duracion (min)</Label>
                <Input
                  id="lesson-dur"
                  type="number"
                  min={0}
                  value={form.duration_minutes}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      duration_minutes: e.target.value,
                    }))
                  }
                  placeholder="Ej: 15"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lesson-active">Estado</Label>
                <select
                  id="lesson-active"
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
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
              {editingId ? "Guardar Cambios" : "Crear Leccion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Markdown Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vista Previa del Contenido</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none py-2">
            <ReactMarkdown>{previewContent}</ReactMarkdown>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
