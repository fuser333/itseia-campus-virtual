"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PortfolioItem, ProjectType } from "@/types/database";
import {
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  FolderOpen,
  Briefcase,
  Sparkles,
  X,
} from "lucide-react";

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: "ai_lab", label: "AI Lab" },
  { value: "peer_review", label: "Peer Review" },
  { value: "final_project", label: "Proyecto Final" },
  { value: "custom", label: "Personal" },
];

const PROJECT_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  ai_lab: { label: "AI Lab", color: "bg-[#73B8E7]/15 text-[#73B8E7]" },
  peer_review: {
    label: "Peer Review",
    color: "bg-[#FBBC0C]/15 text-[#FBBC0C]",
  },
  final_project: {
    label: "Proyecto Final",
    color: "bg-[#F0846D]/15 text-[#F0846D]",
  },
  custom: { label: "Personal", color: "bg-[#1F2F58]/40 text-white/60" },
};

interface FormData {
  title: string;
  description: string;
  project_type: ProjectType;
  url: string;
  technologies: string;
  is_public: boolean;
}

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  project_type: "custom",
  url: "",
  technologies: "",
  is_public: true,
};

export default function PortfolioManagementPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadItems = useCallback(
    async (uid: string) => {
      const { data } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (data) {
        setItems(data as PortfolioItem[]);
      }
    },
    [supabase]
  );

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      await loadItems(user.id);
      setLoading(false);
    }
    init();
  }, [loadItems]);

  function openCreateDialog() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  }

  function openEditDialog(item: PortfolioItem) {
    setForm({
      title: item.title,
      description: item.description || "",
      project_type: item.project_type,
      url: item.url || "",
      technologies: (item.technologies || []).join(", "),
      is_public: item.is_public,
    });
    setEditingId(item.id);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!userId || !form.title.trim()) return;
    setSaving(true);

    const techArray = form.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      user_id: userId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      project_type: form.project_type,
      url: form.url.trim() || null,
      technologies: techArray.length > 0 ? techArray : null,
      is_public: form.is_public,
    };

    if (editingId) {
      await supabase
        .from("portfolio_items")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", editingId);
    } else {
      await supabase.from("portfolio_items").insert(payload);
    }

    await loadItems(userId);
    setDialogOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!userId) return;
    await supabase.from("portfolio_items").delete().eq("id", id);
    await loadItems(userId);
    setDeleteConfirm(null);
  }

  async function togglePublic(item: PortfolioItem) {
    if (!userId) return;
    await supabase
      .from("portfolio_items")
      .update({
        is_public: !item.is_public,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);
    await loadItems(userId);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#FBBC0C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-[#FBBC0C]" />
            Mi Portafolio
          </h1>
          <p className="mt-1 text-white/40 text-sm">
            Gestiona tus proyectos y muestra tu trabajo al mundo
          </p>
        </div>
        <div className="flex items-center gap-3">
          {userId && (
            <a
              href={`/portfolio/${userId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-white/10 text-white/60 hover:bg-white/5 gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Vista Publica
              </Button>
            </a>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  onClick={openCreateDialog}
                  className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold gap-2"
                />
              }
            >
              <Plus className="w-4 h-4" />
              Agregar Proyecto
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-[#0D1B30] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingId ? "Editar Proyecto" : "Nuevo Proyecto"}
                </DialogTitle>
                <DialogDescription className="text-white/40">
                  {editingId
                    ? "Actualiza la informacion de tu proyecto."
                    : "Agrega un nuevo proyecto a tu portafolio."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div>
                  <Label className="text-white/60 text-sm">Titulo *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Modelo de prediccion de ventas"
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-white/60 text-sm">Descripcion</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Describe tu proyecto, que problema resuelve y que tecnologias usaste..."
                    className="bg-white/5 border-white/10 text-white mt-1 min-h-20"
                  />
                </div>

                <div>
                  <Label className="text-white/60 text-sm">
                    Tipo de Proyecto
                  </Label>
                  <select
                    value={form.project_type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        project_type: e.target.value as ProjectType,
                      })
                    }
                    className="w-full mt-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#FBBC0C]/50 focus:outline-none"
                  >
                    {PROJECT_TYPES.map((pt) => (
                      <option
                        key={pt.value}
                        value={pt.value}
                        className="bg-[#0D1B30] text-white"
                      >
                        {pt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-white/60 text-sm">
                    URL del Proyecto
                  </Label>
                  <Input
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://github.com/tu-usuario/proyecto"
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-white/60 text-sm">
                    Tecnologias (separadas por coma)
                  </Label>
                  <Input
                    value={form.technologies}
                    onChange={(e) =>
                      setForm({ ...form, technologies: e.target.value })
                    }
                    placeholder="Python, TensorFlow, Pandas, Scikit-learn"
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({ ...form, is_public: !form.is_public })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.is_public ? "bg-[#FBBC0C]" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        form.is_public ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <Label className="text-white/60 text-sm">
                    {form.is_public
                      ? "Visible en tu portafolio publico"
                      : "Solo visible para ti"}
                  </Label>
                </div>
              </div>

              <DialogFooter className="bg-transparent border-white/10">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="border-white/10 text-white/60 hover:bg-white/5"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || !form.title.trim()}
                  className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold"
                >
                  {saving
                    ? "Guardando..."
                    : editingId
                      ? "Actualizar"
                      : "Crear Proyecto"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 flex items-center justify-center mx-auto mb-5">
              <FolderOpen className="w-8 h-8 text-[#FBBC0C]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Tu portafolio esta vacio
            </h3>
            <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
              Completa proyectos en tus cursos para agregar items
              automaticamente, o agrega proyectos personales manualmente.
            </p>
            <Button
              onClick={openCreateDialog}
              className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar tu Primer Proyecto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const typeConfig =
              PROJECT_TYPE_LABELS[item.project_type] ||
              PROJECT_TYPE_LABELS.custom;
            return (
              <Card
                key={item.id}
                className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors group"
              >
                <CardContent className="p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      className={`border-none text-xs ${typeConfig.color}`}
                    >
                      {typeConfig.label}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePublic(item)}
                        className={`p-1.5 rounded-md transition-colors ${
                          item.is_public
                            ? "text-emerald-400 hover:bg-emerald-400/10"
                            : "text-white/30 hover:bg-white/10"
                        }`}
                        title={
                          item.is_public ? "Publico" : "Privado"
                        }
                      >
                        {item.is_public ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openEditDialog(item)}
                        className="p-1.5 rounded-md text-white/30 hover:text-[#73B8E7] hover:bg-[#73B8E7]/10 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {deleteConfirm === item.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-md text-[#F0846D] bg-[#F0846D]/10 hover:bg-[#F0846D]/20 transition-colors text-xs font-semibold"
                            title="Confirmar eliminacion"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="p-1.5 rounded-md text-white/30 hover:bg-white/10 transition-colors"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="p-1.5 rounded-md text-white/30 hover:text-[#F0846D] hover:bg-[#F0846D]/10 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-semibold text-base mb-1.5">
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p className="text-white/40 text-sm line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  )}

                  {/* Technologies */}
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-[#1F2F58]/60 text-white/50 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-white/20 text-xs">
                      {new Date(item.created_at).toLocaleDateString("es-EC")}
                    </span>
                    <div className="flex items-center gap-2">
                      {!item.is_public && (
                        <span className="text-white/20 text-xs">Privado</span>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#73B8E7] text-xs hover:text-[#73B8E7]/80 transition-colors"
                        >
                          Ver
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Hint */}
      {items.length > 0 && (
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="py-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#FBBC0C] flex-shrink-0" />
            <p className="text-white/30 text-xs">
              Los proyectos publicos aparecen en tu portafolio compartible.
              Comparte tu URL con reclutadores y empresas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
