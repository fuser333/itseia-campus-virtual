"use client";

// ============================================================
// components/calendar/EventForm.tsx
// Formulario de creacion / edicion de eventos (solo docente/admin)
// ============================================================

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { CalendarEventWithDetails, CalendarEventType } from "@/types/database";
import { CALENDAR_EVENT_LABELS } from "@/types/database";

interface SubjectOption {
  id: string;
  name: string;
  code: string;
}

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (event: CalendarEventWithDetails) => void;
  editEvent?: CalendarEventWithDetails | null;
  subjects: SubjectOption[];
  defaultDate?: Date;
}

export function EventForm({
  open,
  onClose,
  onSuccess,
  editEvent,
  subjects,
  defaultDate,
}: EventFormProps) {
  const isEdit = Boolean(editEvent);

  const defaultDateTime = (() => {
    const base = defaultDate || new Date();
    // Redondear a la hora siguiente
    base.setMinutes(0, 0, 0);
    base.setHours(base.getHours() + 1);
    // Formato datetime-local: YYYY-MM-DDTHH:MM
    return base.toISOString().slice(0, 16);
  })();

  const [type, setType] = useState<CalendarEventType>("class");
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState(defaultDateTime);
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [location, setLocation] = useState("");
  const [videoconferenceLink, setVideoconferenceLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poblar formulario si es edicion
  useEffect(() => {
    if (editEvent) {
      setType(editEvent.type);
      setSubjectId(editEvent.subject_id || "");
      setTitle(editEvent.title);
      setDescription(editEvent.description || "");
      setScheduledAt(
        new Date(editEvent.scheduled_at).toISOString().slice(0, 16)
      );
      setDurationMinutes(editEvent.duration_minutes);
      setLocation(editEvent.location || "");
      setVideoconferenceLink(editEvent.videoconference_link || "");
    } else {
      // Reset para nuevo evento
      setType("class");
      setSubjectId(subjects[0]?.id || "");
      setTitle("");
      setDescription("");
      setScheduledAt(defaultDateTime);
      setDurationMinutes(90);
      setLocation("");
      setVideoconferenceLink("");
    }
    setError(null);
  }, [editEvent, open, subjects, defaultDateTime]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const body = {
        type,
        subject_id: subjectId || undefined,
        title: title.trim(),
        description: description.trim() || undefined,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_minutes: durationMinutes,
        location: location.trim() || undefined,
        videoconference_link: videoconferenceLink.trim() || undefined,
      };

      const url = isEdit
        ? `/api/calendar/events/${editEvent!.id}`
        : "/api/calendar/events";

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al guardar el evento");
        return;
      }

      onSuccess(data.event);
      onClose();
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0A1628]">
            {isEdit ? "Editar evento" : "Nueva clase / evento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Tipo de evento */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#0A1628]">
              Tipo de evento
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                Object.entries(CALENDAR_EVENT_LABELS) as [
                  CalendarEventType,
                  string
                ][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all ${
                    type === value
                      ? "border-[#1F2F58] bg-[#1F2F58] text-white"
                      : "border-gray-200 text-gray-600 hover:border-[#1F2F58]/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Materia */}
          {subjects.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-sm font-medium text-[#0A1628]">
                Materia (opcional)
              </Label>
              <select
                id="subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#1F2F58]/30"
              >
                <option value="">Evento institucional (sin materia)</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Titulo */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium text-[#0A1628]">
              Titulo <span className="text-[#F0846D]">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Sesion 5: Redes Neuronales"
              required
              className="text-sm"
            />
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="scheduled_at" className="text-sm font-medium text-[#0A1628]">
                Fecha y hora <span className="text-[#F0846D]">*</span>
              </Label>
              <input
                id="scheduled_at"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#1F2F58]/30"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="duration" className="text-sm font-medium text-[#0A1628]">
                Duracion (min)
              </Label>
              <input
                id="duration"
                type="number"
                min={15}
                max={300}
                value={durationMinutes}
                onChange={(e) =>
                  setDurationMinutes(parseInt(e.target.value, 10) || 60)
                }
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#1F2F58]/30"
              />
            </div>
          </div>

          {/* Descripcion */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium text-[#0A1628]">
              Descripcion
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripcion de la clase o evento..."
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          {/* Link de videoconferencia (solo para clase) */}
          {type === "class" && (
            <div className="space-y-1.5">
              <Label htmlFor="link" className="text-sm font-medium text-[#0A1628]">
                Link de videoconferencia
              </Label>
              <Input
                id="link"
                type="url"
                value={videoconferenceLink}
                onChange={(e) => setVideoconferenceLink(e.target.value)}
                placeholder="https://meet.google.com/... o Daily.co URL"
                className="text-sm"
              />
            </div>
          )}

          {/* Ubicacion */}
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-sm font-medium text-[#0A1628]">
              Ubicacion / Sala
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Sala 101, Zoom, Google Meet..."
              className="text-sm"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-[#F0846D]/10 border border-[#F0846D]/30 px-3 py-2">
              <p className="text-sm text-[#F0846D]">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || !title.trim() || !scheduledAt}
              className="flex-1 bg-[#1F2F58] hover:bg-[#2A3F6E] text-white font-semibold"
            >
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isEdit ? "Guardar cambios" : "Crear evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
