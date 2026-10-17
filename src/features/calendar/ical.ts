// ============================================================
// features/calendar/ical.ts
// Generador iCal RFC 5545 para exportacion de calendarios
// Compatible con Google Calendar, Apple Calendar, Outlook
// ============================================================

import type { CalendarEvent } from "@/types/database";

/**
 * Formatea una fecha en formato iCal: YYYYMMDDTHHMMSSZ (UTC)
 */
function formatICalDate(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    `${d.getUTCFullYear()}` +
    `${pad(d.getUTCMonth() + 1)}` +
    `${pad(d.getUTCDate())}` +
    `T` +
    `${pad(d.getUTCHours())}` +
    `${pad(d.getUTCMinutes())}` +
    `${pad(d.getUTCSeconds())}` +
    `Z`
  );
}

/**
 * Escapa texto para iCal (RFC 5545, section 3.3.11)
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

/**
 * Pliega lineas largas a 75 caracteres octetos (RFC 5545, section 3.1)
 */
function foldLine(line: string): string {
  if (line.length <= 75) return line;

  const result: string[] = [];
  let remaining = line;

  while (remaining.length > 75) {
    result.push(remaining.slice(0, 75));
    remaining = " " + remaining.slice(75);
  }
  result.push(remaining);

  return result.join("\r\n");
}

const EVENT_TYPE_DESCRIPTIONS: Record<string, string> = {
  class: "Clase Sincronica",
  deadline: "Entrega / Deadline",
  tutoring: "Tutoria",
  exam: "Evaluacion",
};

/**
 * Genera un string iCal RFC 5545 valido a partir de un array de eventos.
 * Todos los timestamps se exportan en UTC (la DB los almacena en UTC).
 */
export function generateICal(
  events: CalendarEvent[],
  calendarName = "ITSEIA Academy — Calendario Academico"
): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ITSEIA Academy//Calendario Academico//ES",
    `X-WR-CALNAME:${escapeICalText(calendarName)}`,
    "X-WR-TIMEZONE:America/Guayaquil",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const event of events) {
    if (event.is_cancelled) continue;

    const startDate = new Date(event.scheduled_at);
    const endDate = new Date(
      startDate.getTime() + event.duration_minutes * 60 * 1000
    );

    const dtStart = formatICalDate(event.scheduled_at);
    const dtEnd = formatICalDate(endDate.toISOString());
    const dtStamp = formatICalDate(event.created_at);

    const typeLabel =
      EVENT_TYPE_DESCRIPTIONS[event.type] || event.type;

    const description = [
      typeLabel,
      event.description || "",
      event.location ? `Lugar: ${event.location}` : "",
      event.videoconference_link
        ? `Link de clase: ${event.videoconference_link}`
        : "",
    ]
      .filter(Boolean)
      .join("\\n");

    const eventLines = [
      "BEGIN:VEVENT",
      `UID:${event.id}@itseia.academy`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `DTSTAMP:${dtStamp}`,
      `SUMMARY:${escapeICalText(event.title)}`,
      `DESCRIPTION:${escapeICalText(description)}`,
      `CATEGORIES:${escapeICalText(typeLabel)}`,
    ];

    if (event.location) {
      eventLines.push(`LOCATION:${escapeICalText(event.location)}`);
    }

    if (event.videoconference_link) {
      eventLines.push(`URL:${event.videoconference_link}`);
    }

    eventLines.push("END:VEVENT");

    lines.push(...eventLines);
  }

  lines.push("END:VCALENDAR");

  // Aplicar line folding y CRLF segun RFC 5545
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
