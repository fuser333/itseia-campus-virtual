"use client";

// ============================================================
// ITSEIA Academy — Banner de alertas de inasistencia
// Feature: 007-attendance-tracking
//
// Muestra lista de estudiantes en riesgo (> 30% ausencias).
// Boton "Reconocer" marca la alerta como vista.
// ============================================================

import { useState } from "react";
import { AlertTriangle, X, Loader2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AlertItem } from "@/types/database";

interface AttendanceAlertProps {
  alerts: AlertItem[];
  onAcknowledge?: (alertId: string) => void;
}

export function AttendanceAlert({ alerts, onAcknowledge }: AttendanceAlertProps) {
  const [acknowledging, setAcknowledging] = useState<string | null>(null);

  if (alerts.length === 0) return null;

  async function handleAcknowledge(alertId: string) {
    setAcknowledging(alertId);
    try {
      await fetch("/api/attendance/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id: alertId }),
      });
      onAcknowledge?.(alertId);
    } catch (err) {
      console.error("Error reconociendo alerta:", err);
    } finally {
      setAcknowledging(null);
    }
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-red-200 px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="size-4 text-red-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-red-800">
            Alertas de inasistencia activas
          </p>
          <p className="text-xs text-red-600">
            {alerts.length} estudiante{alerts.length !== 1 ? "s" : ""} con mas del 30% de ausencias
          </p>
        </div>
      </div>

      {/* Lista de alertas */}
      <ul className="divide-y divide-red-100">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="flex items-center gap-3 px-4 py-3"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <UserX className="size-4 text-red-500" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="truncate text-sm font-semibold text-gray-900">
                  {alert.student_name}
                </span>
                <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                  {alert.absence_percentage.toFixed(1)}% ausencias
                </span>
              </div>
              <div className="mt-0.5 text-xs text-gray-500">
                {alert.sessions_absent} de {alert.total_sessions} sesiones ausente &middot;{" "}
                {alert.student_email}
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              disabled={acknowledging === alert.id}
              onClick={() => handleAcknowledge(alert.id)}
              className="shrink-0 gap-1.5 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
            >
              {acknowledging === alert.id ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <X className="size-3.5" />
              )}
              Reconocer
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
