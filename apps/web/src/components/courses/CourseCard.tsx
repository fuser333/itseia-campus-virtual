"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

interface CourseCardProps {
  id: string;
  name: string;
  description: string | null;
  programName: string;
  programType: string;
  totalLessons: number;
  completedLessons: number;
  lastLessonId?: string | null;
}

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  carrera: {
    label: "Carrera",
    className: "bg-[#1F2F58]/10 text-[#1F2F58]",
  },
  curso: {
    label: "Curso",
    className: "bg-[#73B8E7]/15 text-[#73B8E7]",
  },
  preuni: {
    label: "Preuniversitario",
    className: "bg-[#FBBC0C]/15 text-[#FBBC0C]",
  },
  bootcamp: {
    label: "Bootcamp",
    className: "bg-[#F0846D]/15 text-[#F0846D]",
  },
};

export default function CourseCard({
  id,
  name,
  description,
  programName,
  programType,
  totalLessons,
  completedLessons,
  lastLessonId,
}: CourseCardProps) {
  const percentage =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  const isCompleted = totalLessons > 0 && completedLessons >= totalLessons;
  const typeConfig = TYPE_CONFIG[programType] || TYPE_CONFIG.curso;

  const continueHref = lastLessonId
    ? `/courses/${id}/lesson/${lastLessonId}`
    : `/courses/${id}`;

  return (
    <Card className="group flex h-full flex-col border-none bg-white shadow-sm transition-all hover:shadow-md">
      <CardHeader className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#1F2F58]/5">
            {isCompleted ? (
              <CheckCircle2 className="size-5 text-emerald-500" />
            ) : (
              <BookOpen className="size-5 text-[#1F2F58]" />
            )}
          </div>
          <Badge
            className={`shrink-0 border-none text-[10px] font-semibold uppercase tracking-wider ${typeConfig.className}`}
          >
            {typeConfig.label}
          </Badge>
        </div>

        <CardTitle className="mt-3 line-clamp-2 text-[#0A1628]">
          {name}
        </CardTitle>

        <p className="text-xs font-medium text-[#73B8E7]">{programName}</p>

        {description && (
          <CardDescription className="mt-1 line-clamp-2 text-[#1F2F58]/50">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#1F2F58]/50">
                {completedLessons} / {totalLessons} lecciones
              </span>
              <span className="font-semibold text-[#1F2F58]">
                {percentage}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#1F2F58]/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-[#FBBC0C] to-[#F0846D]"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Link href={`/courses/${id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-[#1F2F58]/10 text-[#1F2F58]/70 hover:border-[#1F2F58]/20 hover:text-[#1F2F58]"
              >
                Ver contenido
              </Button>
            </Link>
            <Link href={continueHref}>
              <Button
                size="sm"
                className="bg-[#FBBC0C] font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90"
              >
                {isCompleted ? "Repasar" : "Continuar"}
                <ArrowRight className="ml-1 size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
