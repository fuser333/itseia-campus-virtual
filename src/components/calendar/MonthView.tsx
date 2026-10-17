"use client";

// ============================================================
// components/calendar/MonthView.tsx
// Vista mensual: grid 7 columnas x semanas del mes
// Eventos como pills por dia, "+N mas" con popup
// ============================================================

import { useState } from "react";
import { EventCard } from "./EventCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CalendarEventWithDetails } from "@/types/database";

const DAYS_ES_SHORT = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

interface MonthViewProps {
  year: number;
  month: number; // 0-indexed
  events: CalendarEventWithDetails[];
  onEventClick: (event: CalendarEventWithDetails) => void;
  onDayClick?: (date: Date) => void;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Ajustar para que la semana empiece el lunes (ISO week)
  // getDay() = 0 (Dom)...6 (Sab); queremos 0=Lun...6=Dom
  const startDow = (firstDay.getDay() + 6) % 7;

  // Dias del mes anterior para completar la primera semana
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(firstDay);
    d.setDate(firstDay.getDate() - (i + 1));
    days.push(d);
  }

  // Dias del mes actual
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Dias del mes siguiente para completar la ultima semana
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }

  return days;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getEventsForDay(
  events: CalendarEventWithDetails[],
  day: Date
): CalendarEventWithDetails[] {
  return events.filter(
    (e) => isSameDay(new Date(e.scheduled_at), day) && !e.is_cancelled
  );
}

const MAX_VISIBLE_EVENTS = 3;

export function MonthView({
  year,
  month,
  events,
  onEventClick,
  onDayClick,
}: MonthViewProps) {
  const days = getDaysInMonth(year, month);
  const today = new Date();

  const [overflowDay, setOverflowDay] = useState<Date | null>(null);
  const [overflowEvents, setOverflowEvents] = useState<
    CalendarEventWithDetails[]
  >([]);

  function handleMoreClick(day: Date, dayEvents: CalendarEventWithDetails[]) {
    setOverflowDay(day);
    setOverflowEvents(dayEvents);
  }

  return (
    <div className="flex flex-col">
      {/* Header de dias de la semana */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DAYS_ES_SHORT.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[#1F2F58]/40"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 flex-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === month;
          const isToday = isSameDay(day, today);
          const dayEvents = getEventsForDay(events, day);
          const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
          const hiddenCount = dayEvents.length - visibleEvents.length;

          return (
            <div
              key={index}
              onClick={() => onDayClick?.(day)}
              className={`min-h-[80px] border-b border-r border-gray-100 p-1.5 transition-colors ${
                isCurrentMonth
                  ? "bg-white cursor-pointer hover:bg-gray-50/80"
                  : "bg-gray-50/40"
              }`}
            >
              {/* Numero del dia */}
              <div className="flex justify-end mb-1">
                <span
                  className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday
                      ? "bg-[#FBBC0C] text-[#0A1628]"
                      : isCurrentMonth
                      ? "text-[#0A1628]"
                      : "text-[#1F2F58]/25"
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* Eventos del dia */}
              <div className="space-y-0.5">
                {visibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={onEventClick}
                  />
                ))}

                {hiddenCount > 0 && (
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      handleMoreClick(day, dayEvents);
                    }}
                    className="w-full text-left text-[10px] font-medium text-[#73B8E7] hover:text-[#1F2F58] transition-colors px-1"
                  >
                    +{hiddenCount} mas
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog para dias con muchos eventos */}
      <Dialog
        open={overflowDay !== null}
        onOpenChange={() => setOverflowDay(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#0A1628]">
              {overflowDay
                ? `${overflowDay.getDate()} de ${MONTHS_ES[overflowDay.getMonth()]}`
                : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {overflowEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  setOverflowDay(null);
                  onEventClick(event);
                }}
              >
                <EventCard event={event} onClick={onEventClick} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
