"use client";

// ============================================================
// SessionEngagement — Tabla de engagement por sesion
// ============================================================

import { BarChart3 } from "lucide-react";
import type { SessionEngagementData } from "@/types/database";

interface SessionEngagementProps {
  data: SessionEngagementData[];
}

export function SessionEngagement({ data }: SessionEngagementProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
        <BarChart3 className="mx-auto size-10 text-gray-200 mb-3" />
        <p className="text-sm font-medium text-gray-700">Sin datos de engagement</p>
        <p className="text-xs text-gray-400 mt-1">
          Los datos de engagement apareceran cuando los estudiantes accedan a las sesiones.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        Completitud y tiempo promedio por sesion
      </p>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left w-8">#</th>
              <th className="px-4 py-3 text-left">Sesion</th>
              <th className="px-4 py-3 text-center">Estudiantes</th>
              <th className="px-4 py-3 text-center">Completaron</th>
              <th className="px-4 py-3 text-center w-44">Completitud</th>
              <th className="px-4 py-3 text-center">T. Promedio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => {
              const barColor =
                row.completionRate >= 80
                  ? "bg-emerald-500"
                  : row.completionRate >= 50
                  ? "bg-[#FBBC0C]"
                  : "bg-red-400";

              const labelColor =
                row.completionRate >= 80
                  ? "text-emerald-600"
                  : row.completionRate >= 50
                  ? "text-[#FBBC0C]"
                  : "text-red-500";

              return (
                <tr key={row.sessionId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="inline-flex size-6 items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-500">
                      {row.sessionNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 max-w-[240px] truncate">
                      {row.sessionTitle}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    {row.totalStudents}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    {row.completedCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-gray-100">
                        <div
                          className={`h-2 rounded-full ${barColor} transition-all`}
                          style={{ width: `${row.completionRate}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${labelColor} w-10 text-right`}>
                        {row.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    {row.avgDurationMinutes !== null
                      ? `${Math.round(row.avgDurationMinutes)}m`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
