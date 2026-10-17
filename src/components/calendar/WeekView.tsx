"use client";

// ============================================================
// components/calendar/WeekView.tsx
// Vista semanal: 7 columnas x horas (8:00 - 22:00)
// Eventos posicionados con CSS Grid por hora
// Indicador de hora actual (linea roja)
// Mobile: 3 dias centrados en el dia activo
// ============================================================

import { useEffect, useRef, useState } from "react";
import { EventCard } from "./EventCard";
import type { CalendarEventWithDetails } from "@/types/database";

const HOUR_START = 8;
const HOUR_END = 22;
const TOTAL_HOURS = HOUR_END - HOUR_START; // 14 horas
const SLOT_HEIGHT = 56; // px por hora

const DAYS_ES = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const DAYS_FULL_ES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

interface WeekViewProps {
  weekStart: Date; // Lunes de la semana activa
  events: CalendarEventWithDetails[];
  onEventClick: (event: CalendarEventWithDetails) => void;
  onCellClick?: (date: Date) => void;
  isMobile?: boolean;
}

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
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
  return events.filter((e) => {
    const d = new Date(e.scheduled_at);
    return isSameDay(d, day) && !e.is_cancelled;
  });
}

/**
 * Calcula posicion vertical en la grilla (top, height) en px
 */
function getEventStyle(event: CalendarEventWithDetails): {
  top: number;
  height: number;
} {
  const d = new Date(event.scheduled_at);
  const hours = d.getHours() + d.getMinutes() / 60;
  const clampedStart = Math.max(hours, HOUR_START);
  const endHours = hours + event.duration_minutes / 60;
  const clampedEnd = Math.min(endHours, HOUR_END);

  const top = (clampedStart - HOUR_START) * SLOT_HEIGHT;
  const height = Math.max((clampedEnd - clampedStart) * SLOT_HEIGHT, 20);

  return { top, height };
}

/**
 * Detecta colisiones: devuelve columnas para eventos en el mismo slot
 */
function resolveColumns(
  events: CalendarEventWithDetails[]
): Map<string, { col: number; total: number }> {
  const map = new Map<string, { col: number; total: number }>();

  // Agrupar eventos que se solapan
  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  );

  const groups: CalendarEventWithDetails[][] = [];

  for (const event of sorted) {
    const eventStart = new Date(event.scheduled_at).getTime();
    const eventEnd = eventStart + event.duration_minutes * 60 * 1000;

    let placed = false;
    for (const group of groups) {
      const lastInGroup = group[group.length - 1];
      const lastEnd =
        new Date(lastInGroup.scheduled_at).getTime() +
        lastInGroup.duration_minutes * 60 * 1000;

      if (eventStart < lastEnd) {
        group.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) {
      groups.push([event]);
    }
  }

  for (const group of groups) {
    group.forEach((event, idx) => {
      map.set(event.id, { col: idx, total: group.length });
    });
  }

  return map;
}

export function WeekView({
  weekStart,
  events,
  onEventClick,
  onCellClick,
  isMobile = false,
}: WeekViewProps) {
  const days = getWeekDays(weekStart);
  const today = new Date();
  const gridRef = useRef<HTMLDivElement>(null);
  const [currentTimeTop, setCurrentTimeTop] = useState<number | null>(null);

  // Calcular posicion de la linea de hora actual
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const hours = now.getHours() + now.getMinutes() / 60;
      if (hours >= HOUR_START && hours <= HOUR_END) {
        setCurrentTimeTop((hours - HOUR_START) * SLOT_HEIGHT);
      } else {
        setCurrentTimeTop(null);
      }
    }

    updateTime();
    const interval = setInterval(updateTime, 60 * 1000); // actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  // En mobile mostrar 3 dias (ayer, hoy, manana) o centrados en weekStart
  const visibleDays = isMobile ? days.slice(0, 3) : days;

  // Scroll a la hora actual al montar
  useEffect(() => {
    if (gridRef.current && currentTimeTop !== null) {
      const scrollTarget = Math.max(currentTimeTop - 80, 0);
      gridRef.current.scrollTop = scrollTarget;
    } else if (gridRef.current) {
      // Si no hay hora actual visible, scroll a las 8 AM
      gridRef.current.scrollTop = (9 - HOUR_START) * SLOT_HEIGHT;
    }
  }, [currentTimeTop]);

  const showsToday = days.some((d) => isSameDay(d, today));

  return (
    <div className="flex flex-col h-full">
      {/* Header de dias */}
      <div
        className="grid border-b border-gray-100"
        style={{
          gridTemplateColumns: `48px repeat(${visibleDays.length}, 1fr)`,
        }}
      >
        <div className="h-12" /> {/* Placeholder columna horas */}
        {visibleDays.map((day) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={day.toISOString()}
              className="flex flex-col items-center justify-center h-12 border-l border-gray-100 gap-0.5"
            >
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#1F2F58]/40">
                {DAYS_ES[day.getDay()]}
              </span>
              <span
                className={`text-sm font-bold leading-none w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday
                    ? "bg-[#FBBC0C] text-[#0A1628]"
                    : "text-[#0A1628]"
                }`}
              >
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Grid de horas + eventos */}
      <div
        ref={gridRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ maxHeight: "calc(100vh - 280px)" }}
      >
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: `48px repeat(${visibleDays.length}, 1fr)`,
            height: `${TOTAL_HOURS * SLOT_HEIGHT}px`,
          }}
        >
          {/* Columna de horas */}
          <div className="relative">
            {Array.from({ length: TOTAL_HOURS }, (_, i) => (
              <div
                key={i}
                className="absolute w-full flex items-start justify-end pr-2"
                style={{ top: `${i * SLOT_HEIGHT}px`, height: `${SLOT_HEIGHT}px` }}
              >
                <span className="text-[10px] text-[#1F2F58]/30 font-medium -mt-2.5">
                  {String(HOUR_START + i).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Columnas de dias */}
          {visibleDays.map((day) => {
            const dayEvents = getEventsForDay(events, day);
            const columns = resolveColumns(dayEvents);
            const isToday = isSameDay(day, today);

            return (
              <div
                key={day.toISOString()}
                className={`relative border-l border-gray-100 ${
                  isToday ? "bg-[#FBBC0C]/[0.02]" : ""
                }`}
                style={{ height: `${TOTAL_HOURS * SLOT_HEIGHT}px` }}
              >
                {/* Lineas de hora */}
                {Array.from({ length: TOTAL_HOURS }, (_, i) => (
                  <div
                    key={i}
                    className="absolute inset-x-0 border-t border-gray-100"
                    style={{ top: `${i * SLOT_HEIGHT}px` }}
                  />
                ))}

                {/* Celda clickeable para crear evento */}
                {onCellClick && (
                  <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={(e) => {
                      // Solo disparar si click fue en el fondo, no en un evento
                      if (e.target === e.currentTarget) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const relY = e.clientY - rect.top;
                        const hour = Math.floor(relY / SLOT_HEIGHT) + HOUR_START;
                        const clickedDate = new Date(day);
                        clickedDate.setHours(hour, 0, 0, 0);
                        onCellClick(clickedDate);
                      }
                    }}
                  />
                )}

                {/* Indicador de hora actual */}
                {isToday && showsToday && currentTimeTop !== null && (
                  <div
                    className="absolute inset-x-0 z-20 pointer-events-none"
                    style={{ top: `${currentTimeTop}px` }}
                  >
                    <div className="relative flex items-center">
                      <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-full h-0.5 bg-red-500 ml-1.5" />
                    </div>
                  </div>
                )}

                {/* Eventos */}
                {dayEvents.map((event) => {
                  const { top, height } = getEventStyle(event);
                  const colInfo = columns.get(event.id) || { col: 0, total: 1 };
                  const widthPct = 100 / colInfo.total;
                  const leftPct = colInfo.col * widthPct;

                  return (
                    <div
                      key={event.id}
                      className="absolute z-10 px-0.5"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        width: `${widthPct}%`,
                        left: `${leftPct}%`,
                      }}
                    >
                      <EventCard
                        event={event}
                        onClick={onEventClick}
                        compact={height < 32}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {isMobile && (
        <div className="pt-2 text-center">
          <p className="text-[10px] text-[#1F2F58]/30">
            {DAYS_FULL_ES[visibleDays[0].getDay()]} —{" "}
            {DAYS_FULL_ES[visibleDays[visibleDays.length - 1].getDay()]}
          </p>
        </div>
      )}
    </div>
  );
}
