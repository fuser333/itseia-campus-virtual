"use client";

// ============================================================
// components/calendar/EventDetail.tsx
// Dialog con detalle completo del evento al hacer click
// ============================================================

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CALENDAR_EVENT_COLORS,
  CALENDAR_EVENT_LABELS,
} from "@/types/database";
import type { CalendarEventWithDetails, CalendarEventType } from "@/types/database";
import {
  Clock,
  MapPin,
  Video,
  BookOpen,
  User,
  CalendarDays,
} from "lucide-react";

interface EventDetailProps {
  event: CalendarEventWithDetails | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEventWithDetails) => void;
  onCancel?: (event: CalendarEventWithDetails) => void;
  canEdit?: boolean;
}

const BADGE_STYLES: Record<CalendarEventType, string> = {
  class: "bg-[#1F2F58] text-white",
  deadline: "bg-[#FBBC0C] text-[#0A1628]",
  tutoring: "bg-[#73B8E7] text-[#0A1628]",
  exam: "bg-[#F0846D] text-white",
};

export function EventDetail({
  event,
  open,
  onClose,
  onEdit,
  onCancel,
  canEdit = false,
}: EventDetailProps) {
  if (!event) return null;

  const startTime = new Date(event.scheduled_at);
  const endTime = new Date(
    startTime.getTime() + event.duration_minutes * 60 * 1000
  );

  const dateStr = startTime.toLocaleDateString("es-EC", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = `${startTime.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })} — ${endTime.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;

  const accentColor = CALENDAR_EVENT_COLORS[event.type];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className="w-1 self-stretch rounded-full flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <div className="flex-1 min-w-0">
              <Badge
                className={`mb-2 text-[10px] font-semibold uppercase tracking-wider border-none ${BADGE_STYLES[event.type]}`}
              >
                {CALENDAR_EVENT_LABELS[event.type]}
              </Badge>
              <DialogTitle className="text-lg font-bold text-[#0A1628] leading-snug">
                {event.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Fecha y hora */}
          <div className="flex items-start gap-3">
            <CalendarDays className="size-4 text-[#1F2F58]/50 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#0A1628] capitalize">{dateStr}</p>
              <p className="text-xs text-[#1F2F58]/60">{timeStr} ({event.duration_minutes} min)</p>
            </div>
          </div>

          {/* Materia */}
          {event.subjects && (
            <div className="flex items-center gap-3">
              <BookOpen className="size-4 text-[#1F2F58]/50 flex-shrink-0" />
              <div>
                <p className="text-sm text-[#0A1628]">
                  <span className="font-medium">{event.subjects.name}</span>
                  <span className="ml-1.5 text-xs text-[#1F2F58]/50">
                    ({event.subjects.code})
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Docente */}
          {event.teacher && (
            <div className="flex items-center gap-3">
              <User className="size-4 text-[#1F2F58]/50 flex-shrink-0" />
              <p className="text-sm text-[#0A1628]">{event.teacher.full_name}</p>
            </div>
          )}

          {/* Duracion */}
          <div className="flex items-center gap-3">
            <Clock className="size-4 text-[#1F2F58]/50 flex-shrink-0" />
            <p className="text-sm text-[#1F2F58]/70">{event.duration_minutes} minutos</p>
          </div>

          {/* Ubicacion */}
          {event.location && (
            <div className="flex items-center gap-3">
              <MapPin className="size-4 text-[#1F2F58]/50 flex-shrink-0" />
              <p className="text-sm text-[#1F2F58]/70">{event.location}</p>
            </div>
          )}

          {/* Descripcion */}
          {event.description && (
            <div className="rounded-lg bg-[#F9F6E7] p-3">
              <p className="text-sm text-[#1F2F58]/80 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Link de videoconferencia */}
          {event.type === "class" && (
            <div className="pt-1">
              {event.videoconference_link ? (
                <a
                  href={event.videoconference_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#1F2F58] hover:bg-[#2A3F6E] text-white font-semibold">
                    <Video className="mr-2 size-4" />
                    Unirse a la clase
                  </Button>
                </a>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#1F2F58]/20 p-3">
                  <Video className="size-4 text-[#1F2F58]/30" />
                  <p className="text-xs text-[#1F2F58]/40">
                    Sala pendiente de activacion
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Acciones para docente */}
        {canEdit && (
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(event);
                }}
                className="flex-1"
              >
                Editar
              </Button>
            )}
            {onCancel && !event.is_cancelled && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onCancel(event);
                }}
                className="flex-1 text-[#F0846D] hover:text-[#F0846D] hover:bg-[#F0846D]/10 border-[#F0846D]/30"
              >
                Cancelar evento
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
