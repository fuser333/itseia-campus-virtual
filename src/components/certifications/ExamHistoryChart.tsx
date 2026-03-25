"use client";

// ============================================================
// ITSEIA Academy — ExamHistoryChart
// Feature: 009-industry-certifications
// Line chart of exam attempt scores over time
// ============================================================

import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExamAttempt } from "@/types/database";

interface Props {
  attempts: ExamAttempt[];
  umbralPorcentaje: number;
  className?: string;
}

export default function ExamHistoryChart({
  attempts,
  umbralPorcentaje,
  className,
}: Props) {
  if (attempts.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center",
          className
        )}
      >
        <BarChart3 className="w-8 h-8 text-white/20 mx-auto mb-2" />
        <p className="text-sm text-white/30">
          Aun no hay intentos de simulacro. Completa uno para ver tu progreso.
        </p>
      </div>
    );
  }

  const maxPct = 100;
  const minPct = 0;
  const chartHeight = 120;
  const chartWidth = 400;
  const paddingX = 32;
  const paddingY = 16;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  // Normalize percentage to chart coordinates
  function toY(pct: number): number {
    return paddingY + innerHeight - ((pct - minPct) / (maxPct - minPct)) * innerHeight;
  }

  function toX(index: number): number {
    if (attempts.length === 1) return paddingX + innerWidth / 2;
    return paddingX + (index / (attempts.length - 1)) * innerWidth;
  }

  const points = attempts.map((a, i) => ({
    x: toX(i),
    y: toY(a.percentage ?? 0),
    pct: a.percentage ?? 0,
    passed: a.aprobado ?? false,
    date: new Date(a.created_at).toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "short",
    }),
  }));

  // SVG path
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Area under curve
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${paddingY + innerHeight} L ${points[0].x} ${paddingY + innerHeight} Z`;

  // Threshold line Y
  const thresholdY = toY(umbralPorcentaje);

  // Trend
  const firstPct = points[0]?.pct ?? 0;
  const lastPct = points[points.length - 1]?.pct ?? 0;
  const trend = lastPct > firstPct ? "up" : lastPct < firstPct ? "down" : "flat";
  const latestApproved = attempts.filter((a) => a.aprobado).length;

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.02] p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">
          Historial de Simulacros
        </h3>
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span>{attempts.length} {attempts.length === 1 ? "intento" : "intentos"}</span>
          <span className="text-emerald-400 font-semibold">{latestApproved} aprobado{latestApproved !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          style={{ height: `${chartHeight}px` }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = toY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1}
                />
                <text
                  x={paddingX - 6}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={9}
                  fill="rgba(255,255,255,0.25)"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Threshold line */}
          <line
            x1={paddingX}
            y1={thresholdY}
            x2={chartWidth - paddingX}
            y2={thresholdY}
            stroke="#FBBC0C"
            strokeWidth={1.5}
            strokeDasharray="5,3"
            opacity={0.5}
          />
          <text
            x={chartWidth - paddingX + 2}
            y={thresholdY + 4}
            fontSize={9}
            fill="#FBBC0C"
            opacity={0.7}
          >
            {umbralPorcentaje}%
          </text>

          {/* Area fill */}
          <path d={areaPath} fill="rgba(115,184,231,0.06)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#73B8E7"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={5}
                fill={p.passed ? "#FBBC0C" : "#F0846D"}
                stroke="#0A1628"
                strokeWidth={2}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1 px-8">
        {points.map((p, i) => (
          <span
            key={i}
            className="text-[10px] text-white/25 text-center"
            style={{ width: `${100 / points.length}%` }}
          >
            {p.date}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
        {trend === "up" && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            Progreso positivo
          </span>
        )}
        {trend === "down" && (
          <span className="flex items-center gap-1.5 text-xs text-[#F0846D]">
            <TrendingDown className="w-3.5 h-3.5" />
            Necesitas reforzar
          </span>
        )}
        {trend === "flat" && (
          <span className="flex items-center gap-1.5 text-xs text-white/40">
            <Minus className="w-3.5 h-3.5" />
            Sin cambio
          </span>
        )}
        <span className="flex items-center gap-1.5 text-xs text-white/30">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC0C] flex-shrink-0" />
          Aprobado
        </span>
        <span className="flex items-center gap-1.5 text-xs text-white/30">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F0846D] flex-shrink-0" />
          No aprobado
        </span>
      </div>
    </div>
  );
}
