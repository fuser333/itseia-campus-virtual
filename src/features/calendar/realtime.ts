"use client";

// ============================================================
// features/calendar/realtime.ts
// Hook Supabase Realtime para propagacion < 5s de eventos
// ============================================================

import { useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CalendarEventWithDetails } from "@/types/database";

type RealtimePayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Record<string, unknown>;
  old: Record<string, unknown>;
};

interface UseCalendarRealtimeOptions {
  subjectIds: string[];
  onInsert: (event: CalendarEventWithDetails) => void;
  onUpdate: (event: CalendarEventWithDetails) => void;
  onDelete: (id: string) => void;
}

/**
 * Suscribe a cambios en calendar_events filtrados por subject_ids.
 * Propagacion < 5s de docente a estudiante via Supabase Realtime.
 * Fallback: el componente padre puede refrescar cada 60s como seguridad.
 */
export function useCalendarRealtime({
  subjectIds,
  onInsert,
  onUpdate,
  onDelete,
}: UseCalendarRealtimeOptions) {
  const handlePayload = useCallback(
    (payload: RealtimePayload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      if (eventType === "INSERT" && newRecord) {
        const event = newRecord as unknown as CalendarEventWithDetails;
        // Solo propagar si pertenece a una materia relevante o es un evento global
        if (
          !event.subject_id ||
          subjectIds.length === 0 ||
          subjectIds.includes(event.subject_id)
        ) {
          onInsert(event);
        }
      }

      if (eventType === "UPDATE" && newRecord) {
        const event = newRecord as unknown as CalendarEventWithDetails;
        if (
          !event.subject_id ||
          subjectIds.length === 0 ||
          subjectIds.includes(event.subject_id)
        ) {
          onUpdate(event);
        }
      }

      if (eventType === "DELETE" && oldRecord) {
        const id = oldRecord.id as string;
        if (id) {
          onDelete(id);
        }
      }
    },
    [subjectIds, onInsert, onUpdate, onDelete]
  );

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("calendar_events_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "calendar_events",
        },
        (payload) => {
          handlePayload(payload as RealtimePayload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handlePayload]);
}
