"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Video,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types/database";

interface ModuleAccordionProps {
  moduleId: string;
  moduleName: string;
  moduleIndex: number;
  courseId: string;
  lessons: (Lesson & { completed: boolean })[];
  defaultOpen?: boolean;
}

export default function ModuleAccordion({
  moduleName,
  moduleIndex,
  courseId,
  lessons,
  defaultOpen = false,
}: ModuleAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const completedCount = lessons.filter((l) => l.completed).length;
  const totalCount = lessons.length;
  const isModuleCompleted = totalCount > 0 && completedCount >= totalCount;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-[#1F2F58]/8 bg-white transition-shadow hover:shadow-sm">
      {/* Module header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#F9F6E7]/50"
      >
        {/* Module number indicator */}
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors",
            isModuleCompleted
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-[#1F2F58]/5 text-[#1F2F58]"
          )}
        >
          {isModuleCompleted ? (
            <CheckCircle2 className="size-5 text-emerald-500" />
          ) : (
            <span>{String(moduleIndex + 1).padStart(2, "0")}</span>
          )}
        </div>

        {/* Module info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#0A1628] truncate">
            {moduleName}
          </h3>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-xs text-[#1F2F58]/40">
              {completedCount}/{totalCount} lecciones
            </span>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#1F2F58]/5">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  isModuleCompleted
                    ? "bg-emerald-500"
                    : "bg-[#FBBC0C]"
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-[#1F2F58]/30 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Lessons list */}
      {isOpen && (
        <div className="border-t border-[#1F2F58]/5">
          {lessons.length > 0 ? (
            <ul className="divide-y divide-[#1F2F58]/5">
              {lessons.map((lesson, index) => (
                <li key={lesson.id}>
                  <Link
                    href={`/courses/${courseId}/lesson/${lesson.id}`}
                    className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[#F9F6E7]/40"
                  >
                    {/* Completion icon */}
                    <div className="shrink-0">
                      {lesson.completed ? (
                        <CheckCircle2 className="size-[18px] text-emerald-500" />
                      ) : (
                        <Circle className="size-[18px] text-[#1F2F58]/20 transition-colors group-hover:text-[#73B8E7]" />
                      )}
                    </div>

                    {/* Lesson info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm truncate transition-colors",
                          lesson.completed
                            ? "text-[#1F2F58]/50 line-through decoration-[#1F2F58]/20"
                            : "font-medium text-[#0A1628] group-hover:text-[#1F2F58]"
                        )}
                      >
                        {lesson.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        {lesson.video_url && (
                          <span className="flex items-center gap-1 text-[10px] text-[#73B8E7]">
                            <Video className="size-3" />
                            Video
                          </span>
                        )}
                        {lesson.pdf_url && (
                          <span className="flex items-center gap-1 text-[10px] text-[#F0846D]">
                            <FileText className="size-3" />
                            PDF
                          </span>
                        )}
                        {lesson.duration_minutes && (
                          <span className="flex items-center gap-1 text-[10px] text-[#1F2F58]/30">
                            <Clock className="size-3" />
                            {lesson.duration_minutes} min
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Play button on hover */}
                    <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex size-8 items-center justify-center rounded-full bg-[#FBBC0C]/10">
                        <Play className="size-3.5 text-[#FBBC0C]" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-[#1F2F58]/40">
                No hay lecciones disponibles en este modulo.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
