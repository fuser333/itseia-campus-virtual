"use client";

// ============================================================
// AnnouncementComposer — Crear y listar anuncios por materia
// ============================================================

import { useState, useEffect } from "react";
import {
  Megaphone,
  Loader2,
  Archive,
  CheckCircle2,
  Eye,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnnouncementWithReadStatus, Subject } from "@/types/database";

interface AnnouncementComposerProps {
  subjects: Pick<Subject, "id" | "name" | "code">[];
}

export function AnnouncementComposer({ subjects }: AnnouncementComposerProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    subjects[0]?.id ?? ""
  );
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementWithReadStatus[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [archiving, setArchiving] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSubjectId) {
      loadAnnouncements(selectedSubjectId);
    }
  }, [selectedSubjectId]);

  async function loadAnnouncements(subjectId: string) {
    setLoadingList(true);
    try {
      const res = await fetch(`/api/announcements?subject_id=${subjectId}`);
      if (res.ok) {
        setAnnouncements(await res.json());
      }
    } finally {
      setLoadingList(false);
    }
  }

  async function handlePublish() {
    if (!title.trim() || !body.trim() || !selectedSubjectId) return;
    setPublishing(true);
    setMessage("");

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: selectedSubjectId,
          title: title.trim(),
          body_markdown: body.trim(),
        }),
      });

      if (res.ok) {
        setTitle("");
        setBody("");
        setMessage("Anuncio publicado correctamente.");
        await loadAnnouncements(selectedSubjectId);
      } else {
        const data = await res.json();
        setMessage(data.error || "Error publicando anuncio");
      }
    } catch {
      setMessage("Error de red");
    } finally {
      setPublishing(false);
    }
  }

  async function handleArchive(announcementId: string) {
    setArchiving(announcementId);
    try {
      const res = await fetch("/api/announcements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: announcementId, is_archived: true }),
      });
      if (res.ok) {
        await loadAnnouncements(selectedSubjectId);
      }
    } finally {
      setArchiving(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Composer form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="size-4 text-[#1F2F58]" />
            Nuevo Anuncio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject selector */}
          <div className="grid gap-1.5">
            <Label>Materia</Label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="grid gap-1.5">
            <Label htmlFor="ann-title">Titulo</Label>
            <Input
              id="ann-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cambio en la fecha de entrega del Ejercicio 3"
              maxLength={200}
            />
          </div>

          {/* Body */}
          <div className="grid gap-1.5">
            <Label htmlFor="ann-body">Mensaje</Label>
            <Textarea
              id="ann-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Escribe el mensaje para tus estudiantes..."
              className="min-h-[120px]"
            />
          </div>

          {message && (
            <div
              className={`rounded-lg p-3 text-sm ${
                message.includes("Error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handlePublish}
              disabled={publishing || !title.trim() || !body.trim()}
              className="gap-2 bg-[#1F2F58] hover:bg-[#2A3F6E] text-white"
            >
              {publishing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Publicar anuncio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Announcements history */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Anuncios publicados
        </h3>

        {loadingList ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin text-[#73B8E7]" />
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Megaphone className="mx-auto size-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">
                No hay anuncios publicados para esta materia.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {announcements.map((ann) => (
              <Card
                key={ann.id}
                className={ann.is_archived ? "opacity-50" : ""}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {ann.title}
                        </p>
                        {ann.is_archived && (
                          <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                            Archivado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(ann.published_at).toLocaleDateString("es-EC", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {ann.body_markdown}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {ann.read_count !== undefined && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <Eye className="size-3" />
                          {ann.read_count}
                        </span>
                      )}
                      {!ann.is_archived && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={archiving === ann.id}
                          onClick={() => handleArchive(ann.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Archivar anuncio"
                        >
                          {archiving === ann.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Archive className="size-3.5" />
                          )}
                        </Button>
                      )}
                      {ann.is_archived && (
                        <CheckCircle2 className="size-3.5 text-gray-300" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
