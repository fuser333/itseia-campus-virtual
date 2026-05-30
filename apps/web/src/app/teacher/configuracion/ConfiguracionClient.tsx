"use client";

// ============================================================
// /teacher/configuracion — Perfil del docente
//
// Editor del perfil + listado de materias asignadas y enlaces
// rápidos a tutorías y calendario. Persiste sobre `profiles`
// (campos seguros: full_name, avatar_url).
// ============================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  Save,
  User,
  BookOpen,
  CalendarDays,
  MessageCircle,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileForm {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  bio: string;
}

interface SubjectRow {
  id: string;
  code: string;
  name: string;
  hours_total: number;
}

export default function ConfiguracionClient() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ProfileForm | null>(null);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, role")
        .eq("id", user.id)
        .single();

      if (profile) {
        // El campo `bio` no existe en el tipo Profile actual; lo guardamos
        // localmente en el form. Si más adelante se agrega a la tabla
        // `profiles`, este componente ya lo expone.
        setForm({
          id: profile.id,
          email: profile.email ?? "",
          full_name: profile.full_name ?? "",
          avatar_url: profile.avatar_url ?? "",
          role: profile.role ?? "docente",
          bio: "",
        });
      }

      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, code, name, hours_total")
        .eq("teacher_id", user.id)
        .eq("is_active", true)
        .order("name");

      setSubjects((subjectsData ?? []) as SubjectRow[]);
      setLoading(false);
    }

    load();
  }, []);

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setError(null);

    // Solo persistimos los campos confirmados en la tabla `profiles`.
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        avatar_url: form.avatar_url.trim() || null,
      })
      .eq("id", form.id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSavedAt(Date.now());
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  if (!form) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="mx-auto size-8 text-[#F0846D]" />
          <p className="mt-2 text-sm font-medium text-gray-200">
            No fue posible cargar tu perfil.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Recarga la página o contacta al administrador.
          </p>
        </CardContent>
      </Card>
    );
  }

  const initials = form.full_name
    ? form.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DO";

  const roleLabel = form.role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="mt-1 text-sm text-gray-300">
          Actualiza tu perfil docente, biografía y revisa tus materias asignadas.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna izquierda: avatar + identidad */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-200">
              Identidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              {form.avatar_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={form.avatar_url}
                  alt={form.full_name}
                  className="size-24 rounded-full object-cover ring-2 ring-[#FBBC0C]/30"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-full bg-[#1F2F58] ring-2 ring-[#FBBC0C]/30">
                  <span className="text-2xl font-bold text-[#FBBC0C]">
                    {initials}
                  </span>
                </div>
              )}
              <div className="text-center">
                <p className="font-semibold text-white">
                  {form.full_name || "Docente"}
                </p>
                <p className="text-xs text-gray-300">{form.email}</p>
                <Badge className="mt-2 bg-[#1F2F58] text-white">
                  {roleLabel}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="avatar_url"
                className="text-xs font-medium text-gray-600"
              >
                <ImageIcon className="inline size-3 mr-1" />
                URL de la foto
              </Label>
              <Input
                id="avatar_url"
                type="url"
                value={form.avatar_url}
                onChange={(e) =>
                  setForm({ ...form, avatar_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Columna derecha: datos editables */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-200">
              Información del perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="full_name"
                className="text-xs font-medium text-gray-600"
              >
                <User className="inline size-3 mr-1" />
                Nombre completo
              </Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                placeholder="Nombre y apellido"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-gray-600"
              >
                Correo electrónico
              </Label>
              <Input id="email" value={form.email} disabled />
              <p className="text-[11px] text-gray-400">
                Para cambiar tu correo, contacta al administrador.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-xs font-medium text-gray-600">
                Biografía corta
              </Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                placeholder="Cuéntale a tus estudiantes sobre tu experiencia, especialidad y trayectoria..."
              />
              <p className="text-[11px] text-gray-400">
                La biografía pública se mostrará a estudiantes en tu ficha.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving || !form.full_name.trim()}
                className="gap-2 bg-[#1F2F58] text-white hover:bg-[#2A3F6E]"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Guardar cambios
              </Button>
              {savedAt && !error && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle2 className="size-3.5" />
                  Cambios guardados
                </span>
              )}
              {error && (
                <span className="inline-flex items-center gap-1 text-xs text-[#F0846D]">
                  <AlertTriangle className="size-3.5" />
                  {error}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materias asignadas */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-white flex items-center gap-2">
          <BookOpen className="size-5 text-[#1F2F58]" />
          Materias asignadas
        </h2>
        {subjects.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <BookOpen className="mx-auto size-8 text-gray-300" />
              <p className="mt-2 text-sm font-medium text-gray-300">
                Aún no tienes materias asignadas.
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Solicita la asignación a coordinación académica.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => (
              <Card key={s.id}>
                <CardContent className="space-y-1">
                  <p className="text-xs font-semibold text-[#1F2F58]">
                    {s.code}
                  </p>
                  <p className="text-sm font-medium text-white line-clamp-2">
                    {s.name}
                  </p>
                  <p className="text-[11px] text-gray-300">
                    {s.hours_total} horas totales
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Tutorías y calendario */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-white flex items-center gap-2">
          <CalendarDays className="size-5 text-[#1F2F58]" />
          Tutorías y disponibilidad
        </h2>
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-gray-600">
              Configura tu horario de tutorías sincrónicas y revisa tu
              calendario académico.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/teacher/tutorias">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <MessageCircle className="size-3.5" />
                  Configurar tutorías
                </Button>
              </Link>
              <Link href="/calendario">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <CalendarDays className="size-3.5" />
                  Ver calendario
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
