"use client";

// ============================================================
// /teacher/material — Material didáctico por materia
//
// Lista todos los recursos (PDFs, links, videos, datasets, etc.)
// que el docente ha agregado a sus sesiones, agrupados por materia.
// La subida real se hace dentro del editor de sesión:
// /teacher/materias/[id]/sesion/[num]/edit
// ============================================================

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Video,
  Link as LinkIcon,
  Github,
  Database,
  Wrench,
  Loader2,
  Plus,
  ExternalLink,
  Filter,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ResourceType } from "@/types/database";

interface MaterialRow {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  description: string | null;
  session_id: string;
  session_title: string;
  session_number: number;
  subject_id: string;
  subject_code: string;
  subject_name: string;
  created_at: string;
}

interface SubjectLite {
  id: string;
  code: string;
  name: string;
}

const TYPE_META: Record<
  ResourceType,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  pdf: { label: "PDF", icon: FileText, color: "bg-red-100 text-red-700" },
  video: { label: "Video", icon: Video, color: "bg-purple-100 text-purple-700" },
  link: { label: "Enlace", icon: LinkIcon, color: "bg-sky-100 text-sky-700" },
  github: { label: "GitHub", icon: Github, color: "bg-white/15 text-white/85" },
  dataset: { label: "Dataset", icon: Database, color: "bg-amber-100 text-amber-700" },
  tool: { label: "Herramienta", icon: Wrench, color: "bg-emerald-100 text-emerald-700" },
};

export default function MaterialClient() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<MaterialRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectLite[]>([]);

  const [subjectFilter, setSubjectFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | ResourceType>("");

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

      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, code, name")
        .eq("teacher_id", user.id)
        .eq("is_active", true)
        .order("name");

      const mySubjects = (subjectsData ?? []) as SubjectLite[];
      setSubjects(mySubjects);

      const subjectIds = mySubjects.map((s) => s.id);
      if (subjectIds.length === 0) {
        setMaterials([]);
        setLoading(false);
        return;
      }

      const { data: sessionsData } = await supabase
        .from("sessions")
        .select("id, title, number, subject_id")
        .in("subject_id", subjectIds);

      const sessions = sessionsData ?? [];
      const sessionIds = sessions.map((s) => s.id);
      if (sessionIds.length === 0) {
        setMaterials([]);
        setLoading(false);
        return;
      }

      const { data: resourcesData } = await supabase
        .from("session_resources")
        .select("id, title, url, type, description, session_id, created_at")
        .in("session_id", sessionIds)
        .order("created_at", { ascending: false });

      const subjectById = new Map(mySubjects.map((s) => [s.id, s]));
      const sessionById = new Map(
        sessions.map((s) => [
          s.id,
          s as {
            id: string;
            title: string;
            number: number;
            subject_id: string;
          },
        ])
      );

      const rows: MaterialRow[] = [];
      for (const r of resourcesData ?? []) {
        const session = sessionById.get(r.session_id);
        if (!session) continue;
        const subject = subjectById.get(session.subject_id);
        if (!subject) continue;
        rows.push({
          id: r.id,
          title: r.title,
          url: r.url,
          type: r.type as ResourceType,
          description: r.description,
          session_id: session.id,
          session_title: session.title,
          session_number: session.number,
          subject_id: subject.id,
          subject_code: subject.code,
          subject_name: subject.name,
          created_at: r.created_at,
        });
      }

      setMaterials(rows);
      setLoading(false);
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      if (subjectFilter && m.subject_id !== subjectFilter) return false;
      if (typeFilter && m.type !== typeFilter) return false;
      return true;
    });
  }, [materials, subjectFilter, typeFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, MaterialRow[]>();
    for (const m of filtered) {
      const key = m.subject_id;
      const list = map.get(key) ?? [];
      list.push(m);
      map.set(key, list);
    }
    return Array.from(map.entries()).map(([id, items]) => ({
      subjectId: id,
      subjectCode: items[0]?.subject_code ?? "",
      subjectName: items[0]?.subject_name ?? "",
      items,
    }));
  }, [filtered]);

  const counts = useMemo(() => {
    const byType = new Map<ResourceType, number>();
    for (const m of materials) {
      byType.set(m.type, (byType.get(m.type) ?? 0) + 1);
    }
    return byType;
  }, [materials]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Material del Curso
          </h1>
          <p className="mt-1 text-sm text-white/65">
            PDFs, videos, enlaces y datasets que has compartido en tus sesiones.
          </p>
        </div>
        <Link href="/teacher/materias">
          <Button className="gap-2 bg-[#1F2F58] text-white hover:bg-[#2A3F6E]">
            <Plus className="size-4" />
            Subir material
          </Button>
        </Link>
      </div>

      {/* Tipos resumen */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(TYPE_META) as ResourceType[]).map((t) => {
          const meta = TYPE_META[t];
          const Icon = meta.icon;
          return (
            <Card key={t} size="sm">
              <CardContent className="flex items-center gap-3">
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${meta.color}`}
                >
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white leading-none">
                    {counts.get(t) ?? 0}
                  </p>
                  <p className="text-[11px] text-white/65 mt-0.5">
                    {meta.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="rounded-lg border border-white/20 bg-[#0A1628]/80 p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/65">
              <Filter className="inline size-3 mr-1" />
              Materia
            </label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="h-8 min-w-[220px] rounded-lg border border-white/20 bg-[#0A1628]/80 px-2.5 text-sm outline-none"
            >
              <option value="">Todas</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.code}] {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/65">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as "" | ResourceType)
              }
              className="h-8 min-w-[180px] rounded-lg border border-white/20 bg-[#0A1628]/80 px-2.5 text-sm outline-none"
            >
              <option value="">Todos</option>
              {(Object.keys(TYPE_META) as ResourceType[]).map((t) => (
                <option key={t} value={t}>
                  {TYPE_META[t].label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista agrupada */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
        </div>
      ) : grouped.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto size-8 text-white/50" />
            <p className="mt-2 text-sm font-medium text-white/65">
              {materials.length === 0
                ? "Aún no has subido material a tus sesiones."
                : "Ningún material coincide con los filtros."}
            </p>
            {materials.length === 0 && (
              <p className="mt-1 text-xs text-white/55">
                Ingresa al editor de una sesión para subir PDFs, videos o
                enlaces.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map((g) => (
            <div key={g.subjectId}>
              <div className="mb-2 flex items-center gap-2">
                <BookOpen className="size-4 text-[#73B8E7]" />
                <h2 className="text-sm font-semibold text-white">
                  <span className="text-[#73B8E7]">{g.subjectCode}</span>{" "}
                  {g.subjectName}
                </h2>
                <Badge variant="secondary">{g.items.length}</Badge>
              </div>
              <Card>
                <CardContent className="divide-y divide-gray-100 p-0">
                  {g.items.map((m) => {
                    const meta = TYPE_META[m.type];
                    const Icon = meta.icon;
                    return (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#0A1628]/60"
                      >
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${meta.color}`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {m.title}
                          </p>
                          <p className="text-xs text-white/65 truncate">
                            Sesión {m.session_number}: {m.session_title}
                          </p>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {meta.label}
                        </Badge>
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-lg p-1.5 text-white/55 hover:text-[#73B8E7] hover:bg-white/10"
                          aria-label="Abrir recurso"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
