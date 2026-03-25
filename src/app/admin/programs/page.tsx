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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const PROGRAM_TYPES = [
  { value: "carrera", label: "Carrera" },
  { value: "curso", label: "Curso" },
  { value: "preuni", label: "Preuniversitario" },
  { value: "bootcamp", label: "Bootcamp" },
] as const;

const TYPE_COLORS: Record<string, string> = {
  carrera: "bg-[#1F2F58]/10 text-[#1F2F58]",
  curso: "bg-[#73B8E7]/15 text-[#1F2F58]",
  preuni: "bg-[#FBBC0C]/15 text-[#1F2F58]",
  bootcamp: "bg-[#F0846D]/15 text-[#1F2F58]",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  type: Program["type"];
  price: string;
  duration_months: string;
  is_active: boolean;
}

const EMPTY_FORM: FormData = {
  name: "",
  slug: "",
  description: "",
  type: "curso",
  price: "",
  duration_months: "",
  is_active: true,
};

export default function ProgramsPage() {
  const supabase = createClient();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });
    setPrograms(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setDialogOpen(true);
  }

  function openEdit(program: Program) {
    setEditingId(program.id);
    setForm({
      name: program.name,
      slug: program.slug,
      description: program.description || "",
      type: program.type,
      price: program.price.toString(),
      duration_months: program.duration_months?.toString() || "",
      is_active: program.is_active,
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
    if (
      form.duration_months &&
      (isNaN(Number(form.duration_months)) || Number(form.duration_months) < 0)
    )
      newErrors.duration_months = "Ingresa una duracion valida";

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
      type: form.type,
      price: Number(form.price),
      duration_months: form.duration_months
        ? Number(form.duration_months)
        : null,
      is_active: form.is_active,
    };

    if (editingId) {
      await supabase.from("programs").update(payload).eq("id", editingId);
    } else {
      await supabase.from("programs").insert(payload);
    }

    setSaving(false);
    setDialogOpen(false);
    fetchPrograms();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("¿Estas seguro de eliminar esta carrera?")) return;
    await supabase.from("programs").delete().eq("id", id);
    fetchPrograms();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carreras</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las carreras academicas de ITSEIA
          </p>
        </div>
        <Button onClick={openCreate} size="lg">
          <Plus className="size-4" data-icon="inline-start" />
          Nueva Carrera
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Duracion</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-gray-400" />
                </TableCell>
              </TableRow>
            ) : programs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-gray-400"
                >
                  No hay carreras registradas
                </TableCell>
              </TableRow>
            ) : (
              programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {program.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        /{program.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${TYPE_COLORS[program.type] || "bg-gray-100 text-gray-600"}`}
                    >
                      {PROGRAM_TYPES.find((t) => t.value === program.type)
                        ?.label || program.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${program.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {program.duration_months
                      ? `${program.duration_months} meses`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {program.is_active ? (
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
                        onClick={() => openEdit(program)}
                        title="Editar"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(program.id)}
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
              {editingId ? "Editar Carrera" : "Nueva Carrera"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="prog-name">Nombre *</Label>
              <Input
                id="prog-name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Inteligencia Artificial Aplicada"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Slug */}
            <div className="grid gap-1.5">
              <Label htmlFor="prog-slug">Slug</Label>
              <Input
                id="prog-slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="inteligencia-artificial-aplicada"
              />
              {errors.slug && (
                <p className="text-xs text-red-500">{errors.slug}</p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-1.5">
              <Label htmlFor="prog-desc">Descripcion</Label>
              <Textarea
                id="prog-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Descripcion de la carrera..."
                rows={3}
              />
            </div>

            {/* Type + Price row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="prog-type">Tipo *</Label>
                <select
                  id="prog-type"
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as Program["type"],
                    }))
                  }
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {PROGRAM_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="prog-price">Precio (USD) *</Label>
                <Input
                  id="prog-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Duration + Active */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="prog-dur">Duracion (meses)</Label>
                <Input
                  id="prog-dur"
                  type="number"
                  min={0}
                  value={form.duration_months}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      duration_months: e.target.value,
                    }))
                  }
                  placeholder="Ej: 6"
                />
                {errors.duration_months && (
                  <p className="text-xs text-red-500">
                    {errors.duration_months}
                  </p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="prog-active">Estado</Label>
                <select
                  id="prog-active"
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
              {editingId ? "Guardar Cambios" : "Crear Carrera"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
