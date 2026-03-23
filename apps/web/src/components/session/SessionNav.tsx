"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionLink {
  title: string;
  url: string;
}

interface SessionNavProps {
  prevSession: SessionLink | null;
  nextSession: SessionLink | null;
  currentNum: number;
  totalSessions: number;
  subjectUrl?: string;
  className?: string;
}

export default function SessionNav({
  prevSession,
  nextSession,
  currentNum,
  totalSessions,
  subjectUrl,
  className,
}: SessionNavProps) {
  const progressPercent =
    totalSessions > 0 ? Math.round((currentNum / totalSessions) * 100) : 0;

  return (
    <div
      className={cn(
        "border-t border-[#1F2F58]/8 bg-white px-4 py-3 shadow-[0_-1px_3px_rgba(0,0,0,0.03)]",
        className
      )}
    >
      {/* Progress bar */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex-1 h-1 overflow-hidden rounded-full bg-[#1F2F58]/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-medium text-[#1F2F58]/40">
          Sesion {currentNum} de {totalSessions}
        </span>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {/* Previous */}
        <div className="flex-1">
          {prevSession ? (
            <Link
              href={prevSession.url}
              className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#1F2F58]/50 transition-colors hover:bg-[#1F2F58]/5 hover:text-[#1F2F58]"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
              <div className="hidden min-w-0 sm:block">
                <p className="text-[10px] text-[#1F2F58]/30">Anterior</p>
                <p className="truncate max-w-[180px] font-medium">
                  {prevSession.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Back to subject */}
        {subjectUrl && (
          <Link
            href={subjectUrl}
            className="hidden sm:inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium text-[#73B8E7] transition-colors hover:bg-[#73B8E7]/5"
          >
            Ver materia
          </Link>
        )}

        {/* Next */}
        <div className="flex flex-1 justify-end">
          {nextSession ? (
            <Link
              href={nextSession.url}
              className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#1F2F58]/50 transition-colors hover:bg-[#1F2F58]/5 hover:text-[#1F2F58]"
            >
              <div className="hidden min-w-0 text-right sm:block">
                <p className="text-[10px] text-[#1F2F58]/30">Siguiente</p>
                <p className="truncate max-w-[180px] font-medium">
                  {nextSession.title}
                </p>
              </div>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : subjectUrl ? (
            <Link
              href={subjectUrl}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#73B8E7] transition-colors hover:bg-[#73B8E7]/5"
            >
              Volver a materia
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
