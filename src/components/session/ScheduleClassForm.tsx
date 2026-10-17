"use client";

// ============================================================
// ITSEIA Academy — ScheduleClassForm
// Formulario para programar clases sincronicas en el calendario
// Solo visible para docentes, coordinacion y admins
// ============================================================

import { useState } from "react";
import { CalendarPlus, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ScheduledClass } from "@/types/database";

interface ScheduleClassFormProps {
  subjectId: string;
  sessionId?: string;
  onScheduled?: (scheduledClass: ScheduledClass) => void;
  onCancel?: () => void;
}

export default function ScheduleClassForm({
  subjectId,
  sessionId,
  onScheduled,
  onCancel,
}: ScheduleClassFormProps) {
  // Valor inicial: proxima hora en punto (Ecuador UTC-5)
  function getDefaultDateTime(): string {
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    // Formato para datetime-local: YYYY-MM-DDTHH:MM
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:00`;
  }

  const [scheduledAt, setScheduledAt] = useState(getDefaultDateTime());
  const [durationMinutes, setDurationMinutes] = useState("90");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          sessionId: sessionId || undefined,
          scheduledAt: new Date(scheduledAt).toISOString(),
          durationMinutes: parseInt(durationMinutes, 10) || 90,
          title: title.trim() || undefined,
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json() as { scheduledClass?: ScheduledClass; error?: string };

      if (!res.ok) {
        setError(data.error || "Error al programar la clase.");
        return;
      }

      if (data.scheduledClass) {
        setSuccess(true);
        onScheduled?.(data.scheduledClass);
        setTimeout(() => setSuccess(false), 3000);
        // Reset form
        setScheduledAt(getDefaultDateTime());
        setTitle("");
        setDescription("");
      }
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarPlus className="size-4 text-[#FBBC0C]" />
          <h3 className="text-sm font-semibold text-[#1F2F58]">
            Programar Clase Sincronica
          </h3>
        </div>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="ghost"
            size="icon-sm"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Fecha y hora */}
        <div className="grid gap-1.5">
          <Label htmlFor="scheduled-at">Fecha y hora (Ecuador UTC-5)</Label>
          <Input
            id="scheduled-at"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        {/* Duracion */}
        <div className="grid gap-1.5">
          <Label htmlFor="duration">Duracion (minutos)</Label>
          <Input
            id="duration"
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            min={30}
            max={240}
            step={15}
          />
        </div>
      </div>

      {/* Titulo opcional */}
      <div className="grid gap-1.5">
        <Label htmlFor="class-title">
          Titulo <span className="text-xs text-gray-400">(opcional)</span>
        </Label>
        <Input
          id="class-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Repaso Unidad 3 — Redes Neuronales"
          maxLength={200}
        />
      </div>

      {/* Descripcion opcional */}
      <div className="grid gap-1.5">
        <Label htmlFor="class-description">
          Descripcion <span className="text-xs text-gray-400">(opcional)</span>
        </Label>
        <Textarea
          id="class-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Temas que se trataran en la clase..."
          className="min-h-[80px] text-sm"
          maxLength={500}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Boton */}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline" size="sm">
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading || !scheduledAt}
          size="sm"
          className="gap-2 bg-[#1F2F58] text-white hover:bg-[#2A3F6E]"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : success ? (
            <CheckCircle2 className="size-4 text-emerald-300" />
          ) : (
            <CalendarPlus className="size-4" />
          )}
          {loading ? "Programando..." : success ? "Clase programada" : "Programar Clase"}
        </Button>
      </div>
    </form>
  );
}
