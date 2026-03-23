"use client";

// ============================================================
// components/calendar/AcademicCalendar.tsx
// Componente raiz del calendario academico ITSEIA.
// Controla vista (week/month), navegacion, Realtime y Realtime.
// ============================================================

import { useState, useCallback, useEffect, useRef } from "react";
import { WeekView } from "./WeekView";
import { MonthView } from "./MonthView";
import { EventDetail } from "./EventDetail";
import { EventForm } from "./EventForm";
import { useCalendarRealtime } from "@/features/calendar/realtime";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Calendar,
  Plus,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type {
  CalendarEventWithDetails,
  CalendarEventType,
} from "@/types/database";
import {
  CALENDAR_EVENT_COLORS,
  CALENDAR_EVENT_LABELS,
} from "@/types/database";

type CalendarView = "week" | "month";

interface SubjectOption {
  id: string;
  name: string;
  code: string;
}

interface AcademicCalendarProps {
  initialEvents: CalendarEventWithDetails[];
  subjectIds: string[];
  subjects: SubjectOption[];
  userRole: string;
  userId: string;
  showAdminControls?: boolean;
}

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

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekLabel(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const startMonth = MONTHS_ES[weekStart.getMonth()];
  const endMonth = MONTHS_ES[weekEnd.getMonth()];
  const year = weekEnd.getFullYear();

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${startDay} - ${endDay} ${startMonth} ${year}`;
  }

  return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
}

export function AcademicCalendar({
  initialEvents,
  subjectIds,
  subjects,
  userRole,
  userId,
  showAdminControls = false,
}: AcademicCalendarProps) {
  const isMobile = useIsMobile();
  const [view, setView] = useState<CalendarView>(isMobile ? "month" : "week");
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEventWithDetails[]>(initialEvents);
  const [loading, setLoading] = useState(false);

  // Dialog estados
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventWithDetails | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEventWithDetails | null>(null);
  const [defaultFormDate, setDefaultFormDate] = useState<Date | undefined>();

  // Filtro de tipo
  const [filterType, setFilterType] = useState<CalendarEventType | "all">("all");

  const canCreate = ["docente", "coordinacion", "admin", "super_admin"].includes(userRole);

  // Calcular semana activa (lunes)
  const weekStart = getMonday(activeDate);

  // ---- Carga de eventos al cambiar periodo ----
  const loadEvents = useCallback(
    async (from: Date, to: Date) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          from: from.toISOString(),
          to: to.toISOString(),
        });
        const res = await fetch(`/api/calendar/events?${params}`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error("Error cargando eventos:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cargar eventos cuando cambia el periodo activo
  useEffect(() => {
    let from: Date;
    let to: Date;

    if (view === "week") {
      from = new Date(weekStart);
      to = new Date(weekStart);
      to.setDate(to.getDate() + 7);
    } else {
      from = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1);
      to = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0, 23, 59, 59);
    }

    loadEvents(from, to);
  }, [view, weekStart.toISOString(), activeDate.getFullYear(), activeDate.getMonth(), loadEvents]);

  // Fallback: refrescar cada 60s
  useEffect(() => {
    const interval = setInterval(() => {
      let from: Date;
      let to: Date;
      if (view === "week") {
        from = new Date(weekStart);
        to = new Date(weekStart);
        to.setDate(to.getDate() + 7);
      } else {
        from = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1);
        to = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0, 23, 59, 59);
      }
      loadEvents(from, to);
    }, 60000);

    return () => clearInterval(interval);
  }, [view, weekStart, activeDate, loadEvents]);

  // ---- Supabase Realtime ----
  useCalendarRealtime({
    subjectIds,
    onInsert: (event) => {
      setEvents((prev) => {
        if (prev.find((e) => e.id === event.id)) return prev;
        return [...prev, event].sort(
          (a, b) =>
            new Date(a.scheduled_at).getTime() -
            new Date(b.scheduled_at).getTime()
        );
      });
      toast.success(`Nuevo evento: ${event.title}`);
    },
    onUpdate: (event) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? event : e))
      );
    },
    onDelete: (id) => {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, is_cancelled: true } : e
        )
      );
    },
  });

  // ---- Navegacion ----
  function navigate(direction: "prev" | "next") {
    setActiveDate((prev) => {
      const d = new Date(prev);
      if (view === "week") {
        d.setDate(d.getDate() + (direction === "next" ? 7 : -7));
      } else {
        d.setMonth(d.getMonth() + (direction === "next" ? 1 : -1));
      }
      return d;
    });
  }

  function goToday() {
    setActiveDate(new Date());
  }

  // ---- Exportar iCal ----
  async function exportICal() {
    let from: Date;
    let to: Date;

    if (view === "week") {
      from = new Date(weekStart);
      to = new Date(weekStart);
      to.setDate(to.getDate() + 7);
    } else {
      from = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1);
      to = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0);
    }

    const params = new URLSearchParams({
      from: from.toISOString(),
      to: to.toISOString(),
    });

    const url = `/api/calendar/export?${params}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "calendario-itseia.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ---- Handlers de eventos ----
  function handleEventClick(event: CalendarEventWithDetails) {
    setSelectedEvent(event);
    setDetailOpen(true);
  }

  function handleCellClick(date: Date) {
    if (!canCreate) return;
    setDefaultFormDate(date);
    setEditingEvent(null);
    setFormOpen(true);
  }

  function handleEdit(event: CalendarEventWithDetails) {
    setEditingEvent(event);
    setFormOpen(true);
  }

  async function handleCancel(event: CalendarEventWithDetails) {
    const res = await fetch(`/api/calendar/events/${event.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, is_cancelled: true } : e
        )
      );
      toast.success("Evento cancelado");
    } else {
      toast.error("Error al cancelar el evento");
    }
  }

  function handleFormSuccess(event: CalendarEventWithDetails) {
    setEvents((prev) => {
      const exists = prev.find((e) => e.id === event.id);
      if (exists) {
        return prev.map((e) => (e.id === event.id ? event : e));
      }
      return [...prev, event].sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime()
      );
    });
    toast.success(
      editingEvent ? "Evento actualizado" : "Evento creado. Visible para tus estudiantes."
    );
  }

  // ---- Filtro por tipo ----
  const filteredEvents =
    filterType === "all"
      ? events
      : events.filter((e) => e.type === filterType);

  // ---- Label de periodo ----
  const periodLabel =
    view === "week"
      ? formatWeekLabel(weekStart)
      : `${MONTHS_ES[activeDate.getMonth()]} ${activeDate.getFullYear()}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header del calendario */}
      <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-gray-100">
        {/* Navegacion */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("prev")}
            className="h-8 w-8 p-0"
            aria-label="Semana / mes anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToday}
            className="h-8 px-3 text-xs font-medium"
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("next")}
            className="h-8 w-8 p-0"
            aria-label="Semana / mes siguiente"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Periodo activo */}
        <div className="flex items-center gap-2 min-w-0">
          {loading && <Loader2 className="size-3.5 animate-spin text-[#1F2F58]/40" />}
          <h2 className="text-sm font-semibold text-[#0A1628] capitalize truncate">
            {periodLabel}
          </h2>
        </div>

        {/* Toggle vista semana / mes */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden ml-auto">
          <button
            onClick={() => setView("week")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "week"
                ? "bg-[#1F2F58] text-white"
                : "text-[#1F2F58]/60 hover:text-[#1F2F58]"
            }`}
          >
            <CalendarDays className="size-3.5" />
            Semana
          </button>
          <button
            onClick={() => setView("month")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-l border-gray-200 ${
              view === "month"
                ? "bg-[#1F2F58] text-white"
                : "text-[#1F2F58]/60 hover:text-[#1F2F58]"
            }`}
          >
            <Calendar className="size-3.5" />
            Mes
          </button>
        </div>

        {/* Exportar iCal */}
        <Button
          variant="outline"
          size="sm"
          onClick={exportICal}
          className="h-8 gap-1.5 text-xs"
          title="Exportar calendario en formato iCal"
        >
          <Download className="size-3.5" />
          {!isMobile && "Exportar iCal"}
        </Button>

        {/* Boton crear evento (solo docente/admin) */}
        {canCreate && (
          <Button
            size="sm"
            onClick={() => {
              setEditingEvent(null);
              setDefaultFormDate(new Date());
              setFormOpen(true);
            }}
            className="h-8 gap-1.5 text-xs bg-[#1F2F58] hover:bg-[#2A3F6E] text-white"
          >
            <Plus className="size-3.5" />
            {!isMobile && "Nueva clase"}
          </Button>
        )}
      </div>

      {/* Leyenda de colores + filtros */}
      <div className="flex flex-wrap items-center gap-2 py-3">
        <button
          onClick={() => setFilterType("all")}
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
            filterType === "all"
              ? "border-[#1F2F58] bg-[#1F2F58] text-white"
              : "border-gray-200 text-[#1F2F58]/50 hover:border-[#1F2F58]/30"
          }`}
        >
          Todos
        </button>
        {(Object.entries(CALENDAR_EVENT_LABELS) as [CalendarEventType, string][]).map(
          ([type, label]) => (
            <button
              key={type}
              onClick={() => setFilterType(type === filterType ? "all" : type)}
              className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
              style={{
                borderColor: filterType === type ? CALENDAR_EVENT_COLORS[type] : undefined,
                backgroundColor: filterType === type ? CALENDAR_EVENT_COLORS[type] + "20" : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CALENDAR_EVENT_COLORS[type] }}
              />
              {label}
            </button>
          )
        )}
      </div>

      {/* Vista principal */}
      <div className="flex-1 overflow-hidden">
        {view === "week" ? (
          <WeekView
            weekStart={weekStart}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onCellClick={canCreate ? handleCellClick : undefined}
            isMobile={isMobile}
          />
        ) : (
          <MonthView
            year={activeDate.getFullYear()}
            month={activeDate.getMonth()}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onDayClick={canCreate ? handleCellClick : undefined}
          />
        )}
      </div>

      {/* Dialog detalle del evento */}
      <EventDetail
        event={selectedEvent}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedEvent(null);
        }}
        canEdit={
          canCreate &&
          (selectedEvent?.created_by === userId ||
            ["coordinacion", "admin", "super_admin"].includes(userRole))
        }
        onEdit={handleEdit}
        onCancel={handleCancel}
      />

      {/* Dialog formulario de creacion/edicion */}
      <EventForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingEvent(null);
        }}
        onSuccess={handleFormSuccess}
        editEvent={editingEvent}
        subjects={subjects}
        defaultDate={defaultFormDate}
      />
    </div>
  );
}
