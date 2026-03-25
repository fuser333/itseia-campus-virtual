"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SemesterLevel } from "@/types/database";
import SubjectCard from "./SubjectCard";

interface SubjectInfo {
  id: string;
  name: string;
  slug: string;
  hoursTotal: number;
  hoursDocencia: number;
  hoursPractica: number;
  hoursAutonomo: number;
  credits: number;
  tools: string[];
  progress: number; // 0-100
  sessionsCompleted: number;
  sessionsTotal: number;
}

interface SemesterCardProps {
  number: number;
  name: string;
  level: SemesterLevel;
  totalHours: number;
  subjects: SubjectInfo[];
  careerSlug: string;
  className?: string;
}

const levelConfig: Record<
  SemesterLevel,
  { label: string; color: string; bg: string }
> = {
  basic: {
    label: "Basico",
    color: "text-[#73B8E7]",
    bg: "bg-[#73B8E7]/10",
  },
  professional: {
    label: "Profesional",
    color: "text-[#FBBC0C]",
    bg: "bg-[#FBBC0C]/10",
  },
  integration: {
    label: "Integracion",
    color: "text-[#F0846D]",
    bg: "bg-[#F0846D]/10",
  },
};

export default function SemesterCard({
  number,
  name,
  level,
  totalHours,
  subjects,
  careerSlug,
  className,
}: SemesterCardProps) {
  const config = levelConfig[level] || levelConfig.basic;

  const completedSubjects = subjects.filter((s) => s.progress === 100).length;
  const overallProgress =
    subjects.length > 0
      ? Math.round(
          subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length
        )
      : 0;

  return (
    <Card
      className={cn("border-none bg-white shadow-sm", className)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#1F2F58]/5">
              <span className="text-sm font-bold text-[#1F2F58] font-[family-name:var(--font-space-grotesk)]">
                {number}
              </span>
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[#0A1628]">
                {name || `Periodo ${number}`}
              </CardTitle>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-[#1F2F58]/40">
                <span className="flex items-center gap-1">
                  <BookOpen className="size-3" />
                  {subjects.length} materias
                </span>
                <span className="size-1 rounded-full bg-[#1F2F58]/20" />
                <span>{totalHours}h</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "border-none text-[10px] font-semibold uppercase tracking-wider",
                config.bg,
                config.color
              )}
            >
              {config.label}
            </Badge>
          </div>
        </div>

        {/* Semester progress bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-[#1F2F58]/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-[#1F2F58]/50">
            {completedSubjects}/{subjects.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              name={subject.name}
              slug={subject.slug}
              hoursTotal={subject.hoursTotal}
              hoursDocencia={subject.hoursDocencia}
              hoursPractica={subject.hoursPractica}
              hoursAutonomo={subject.hoursAutonomo}
              tools={subject.tools}
              progress={subject.progress}
              sessionsCompleted={subject.sessionsCompleted}
              sessionsTotal={subject.sessionsTotal}
              careerSlug={careerSlug}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
