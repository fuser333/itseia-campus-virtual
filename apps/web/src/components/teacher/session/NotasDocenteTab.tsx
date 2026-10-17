"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Trash2, StickyNote, Check } from "lucide-react";

interface Props {
  sessionId: string;
}

export default function NotasDocenteTab({ sessionId }: Props) {
  const [loading, setLoading] = useState(true);
  const [nota, setNota] = useState("");
  const [original, setOriginal] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/teacher/notes/${sessionId}`);
        const json = await res.json();
        if (!alive) return;
        if (res.ok) {
          const md = json.nota?.nota_md ?? "";
          setNota(md);
          setOriginal(md);
        } else {
          setError(json.error ?? "Error cargando notas");
        }
      } catch (e) {
        if (alive) setError((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [sessionId]);

  const dirty = nota !== original;

  const handleSave = async () => {
    if (!nota.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/teacher/notes/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nota_md: nota }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error guardando");
      setOriginal(nota);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Borrar tus notas de esta sesión? Esta acción es definitiva.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/teacher/notes/${sessionId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error borrando");
      setNota("");
      setOriginal("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="size-5 text-[#73B8E7]" />
          <h3 className="text-base font-bold text-[#73B8E7]">Tus notas privadas</h3>
        </div>
        <span className="text-xs text-white/65">
          Solo tú las ves. Markdown permitido.
        </span>
      </div>

      <textarea
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        placeholder="Apunta aquí lo que quieras recordar de esta sesión: anécdotas que funcionan, preguntas frecuentes, ajustes para el próximo grupo, links a recursos extra…"
        rows={14}
        className="w-full rounded-lg border border-white/25 bg-[#0A1628]/80 p-3 font-mono text-sm leading-relaxed focus:border-[#73B8E7] focus:outline-none focus:ring-2 focus:ring-[#73B8E7]/30"
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleSave}
          disabled={!dirty || saving || !nota.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1F2F58] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2A3F6E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saved ? "Guardado" : "Guardar"}
          {saved && <Check className="size-4" />}
        </button>

        {original && (
          <button
            onClick={handleDelete}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-[#0A1628]/80 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            Borrar
          </button>
        )}

        {dirty && <span className="text-xs italic text-amber-600">Cambios sin guardar</span>}
      </div>
    </div>
  );
}
