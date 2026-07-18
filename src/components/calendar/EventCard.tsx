"use client";

// ============================================================
// components/calendar/EventCard.tsx
// Pill/card de evento en la vista de calendario.
// Color por tipo: class=navy, deadline=yellow, tutoring=lightblue, exam=coral
// ============================================================

import { CALENDAR_EVENT_COLORS, CALENDAR_EVENT_LABELS } from "@/types/database";
import type { CalendarEventWithDetails, CalendarEventType } from "@/types/database";

interface EventCardProps {
  event: CalendarEventWithDetails;
  onClick: (event: CalendarEventWithDetails) => void;
  compact?: boolean;
}

const TEXT_COLORS: Record<CalendarEventType, string> = {
  class: "#FFFFFF",
  deadline: "#0A1628",
  tutoring: "#0A1628",
  exam: "#FFFFFF",
};

export function EventCard({ event, onClick, compact = false }: EventCardProps) {
  const bg = CALENDAR_EVENT_COLORS[event.type];
  const color = TEXT_COLORS[event.type];

  const startTime = new Date(event.scheduled_at);
  const timeStr = startTime.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (compact) {
    return (
      <button
        onClick={() => onClick(event)}
        title={event.title}
        style={{ backgroundColor: bg, color }}
        className="w-2.5 h-2.5 rounded-full flex-shrink-0 hover:opacity-80 transition-opacity"
        aria-label={`${CALENDAR_EVENT_LABELS[event.type]}: ${event.title}`}
      />
    );
  }

  return (
    <button
      onClick={() => onClick(event)}
      style={{ backgroundColor: bg, color }}
      className="w-full text-left rounded-md px-2 py-1 text-xs font-medium leading-snug hover:opacity-90 transition-opacity overflow-hidden"
      aria-label={`${CALENDAR_EVENT_LABELS[event.type]}: ${event.title} a las ${timeStr}`}
    >
      <span className="block truncate font-semibold">{event.title}</span>
      <span className="block opacity-80 text-[10px]">{timeStr}</span>
    </button>
  );
}
