"use client";

/**
 * TeacherUploadRecordingPanel — Guardar URL de grabación de la sesión.
 * Guarda en cursos_pro_sessions.recording_url + recording_provider.
 */

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Video, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  sessionId: string;
  initialUrl?: string | null;
}

export default function TeacherUploadRecordingPanel({
  sessionId,
  initialUrl,
}: Props) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [provider, setProvider] = useState("youtube");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!initialUrl);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    if (!url.trim()) {
      setError("Pega la URL de la grabación.");
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from("cursos_pro_sessions")
        .update({
          recording_url: url.trim(),
          recording_provider: provider,
        })
        .eq("id", sessionId);
      if (err) {
        setError(err.message);
      } else {
        setSaved(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Video className="size-5 text-[#FBBC0C]" />
          Subir grabación
        </h3>
        <p className="text-xs text-white/60 mt-1">
          Pega la URL del video (YouTube, Loom, Vimeo) y guárdala. Los
          alumnos verán la grabación en su pestaña "Grabaciones".
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/70 uppercase tracking-widest">
          URL de la grabación
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setSaved(false);
          }}
          placeholder="https://youtube.com/watch?v=... o https://loom.com/..."
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#FBBC0C]/60 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/70 uppercase tracking-widest">
          Plataforma
        </label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#FBBC0C]/60 focus:outline-none"
        >
          <option value="youtube">YouTube</option>
          <option value="loom">Loom</option>
          <option value="vimeo">Vimeo</option>
          <option value="drive">Google Drive</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-[#F0846D]/40 bg-[#F0846D]/10 px-4 py-3 text-sm text-white">
          {error}
        </div>
      )}

      {saved && !error && (
        <div className="flex items-center gap-2 rounded-xl border border-[#FBBC0C]/40 bg-[#FBBC0C]/10 px-4 py-3 text-sm text-white">
          <CheckCircle2 className="size-4 text-[#FBBC0C]" />
          Grabación guardada y visible para alumnos.
        </div>
      )}

      <Button
        onClick={handleSave}
        disabled={saving || !url.trim()}
        className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 disabled:opacity-40"
      >
        {saving ? (
          <>
            <Loader2 className="size-4 mr-2 animate-spin" /> Guardando...
          </>
        ) : (
          "Guardar grabación"
        )}
      </Button>
    </div>
  );
}
