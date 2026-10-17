"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SemesterProgress {
  number: number;
  name: string;
  level: string;
  subjectCount: number;
  completedSubjects: number;
  progress: number; // 0-100
}

interface CareerOverviewProps {
  name: string;
  slug: string;
  description?: string | null;
  totalSemesters: number;
  totalHours?: number;
  semesters: SemesterProgress[];
  overallProgress?: number; // 0-100
  className?: string;
}

export default function CareerOverview({
  name,
  slug,
  description,
  totalSemesters,
  totalHours,
  semesters,
  overallProgress = 0,
  className,
}: CareerOverviewProps) {
  return (
    <Card
      className={cn(
        "group border-none bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#1F2F58]/5">
            <GraduationCap className="size-5 text-[#1F2F58]" />
          </div>
          <Badge className="border-none bg-[#1F2F58]/10 text-[10px] font-semibold uppercase tracking-wider text-[#1F2F58]">
            Carrera
          </Badge>
        </div>
        <CardTitle className="mt-3 text-lg font-bold text-[#0A1628]">
          {name}
        </CardTitle>
        {description && (
          <p className="mt-1 text-sm text-[#1F2F58]/50 line-clamp-2">
            {description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-[#1F2F58]/40">
          <span>{totalSemesters} semestres</span>
          {totalHours && (
            <>
              <span className="size-1 rounded-full bg-[#1F2F58]/20" />
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {totalHours.toLocaleString()} horas
              </span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Overall progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#1F2F58]/50">Progreso general</span>
            <span className="font-semibold text-[#1F2F58]">
              {overallProgress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#1F2F58]/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Semester bars */}
        <div className="space-y-2 pt-2">
          {semesters.map((sem) => (
            <div key={sem.number} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-[10px] font-medium text-[#1F2F58]/40 truncate">
                P{sem.number}
              </span>
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-[#1F2F58]/5">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    sem.progress > 0
                      ? "bg-[#73B8E7]"
                      : "bg-transparent"
                  )}
                  style={{ width: `${sem.progress}%` }}
                />
              </div>
              <span className="w-8 text-right text-[10px] text-[#1F2F58]/30">
                {sem.progress}%
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/carreras/${slug}`}
          className="group/link mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#1F2F58] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0A1628]"
        >
          Ver carrera
          <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
