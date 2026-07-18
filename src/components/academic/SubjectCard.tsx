"use client";

import Link from "next/link";
import { Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  name: string;
  slug: string;
  hoursTotal: number;
  hoursDocencia: number;
  hoursPractica: number;
  hoursAutonomo: number;
  tools: string[];
  progress: number; // 0-100
  sessionsCompleted: number;
  sessionsTotal: number;
  careerSlug: string;
  className?: string;
}

export default function SubjectCard({
  name,
  slug,
  hoursTotal,
  hoursDocencia,
  hoursPractica,
  hoursAutonomo,
  tools,
  progress,
  sessionsCompleted,
  sessionsTotal,
  careerSlug,
  className,
}: SubjectCardProps) {
  const isComplete = progress === 100;

  return (
    <Link
      href={`/carreras/${careerSlug}/materia/${slug}`}
      className={cn(
        "group flex flex-col rounded-xl border p-3.5 transition-all hover:shadow-md hover:-translate-y-0.5",
        isComplete
          ? "border-emerald-200 bg-emerald-50/50"
          : "border-[#1F2F58]/8 bg-white hover:border-[#73B8E7]/30",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-[#0A1628] line-clamp-2 leading-snug">
          {name}
        </h3>
        {isComplete && (
          <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
        )}
      </div>

      {/* Hours breakdown */}
      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#1F2F58]/40">
        <Clock className="size-3" />
        <span>{hoursTotal}h total</span>
        <span className="text-[#1F2F58]/15">|</span>
        <span>{hoursDocencia}D</span>
        <span className="text-[#1F2F58]/15">/</span>
        <span>{hoursPractica}P</span>
        <span className="text-[#1F2F58]/15">/</span>
        <span>{hoursAutonomo}A</span>
      </div>

      {/* Tools */}
      {tools.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tools.slice(0, 3).map((tool) => (
            <span
              key={tool}
              className="inline-flex rounded-md bg-[#73B8E7]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#73B8E7]"
            >
              {tool}
            </span>
          ))}
          {tools.length > 3 && (
            <span className="text-[10px] text-[#1F2F58]/30">
              +{tools.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="mt-auto pt-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#1F2F58]/40">
            {sessionsCompleted}/{sessionsTotal} sesiones
          </span>
          <span
            className={cn(
              "text-[10px] font-semibold",
              isComplete ? "text-emerald-500" : "text-[#1F2F58]/50"
            )}
          >
            {progress}%
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#1F2F58]/5">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isComplete
                ? "bg-emerald-400"
                : progress > 0
                ? "bg-[#FBBC0C]"
                : "bg-transparent"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Hover arrow */}
      <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-[#73B8E7] opacity-0 transition-opacity group-hover:opacity-100">
        Ver materia
        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
