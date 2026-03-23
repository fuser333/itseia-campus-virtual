"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ChatPanel from "@/components/ai-lab/ChatPanel";
import XPToast from "@/components/gamification/XPToast";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileDown,
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  Clock,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson, Module, Course } from "@/types/database";

interface LessonNavItem {
  id: string;
  title: string;
  moduleId: string;
  moduleName: string;
}

interface XPToastState {
  show: boolean;
  xp: number;
  label: string;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [moduleName, setModuleName] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [prevLesson, setPrevLesson] = useState<LessonNavItem | null>(null);
  const [nextLesson, setNextLesson] = useState<LessonNavItem | null>(null);
  const [showChat, setShowChat] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [xpToast, setXpToast] = useState<XPToastState>({
    show: false,
    xp: 0,
    label: "",
  });

  // Load lesson data
  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }
    setUserId(user.id);

    // Get lesson
    const { data: lessonData } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single();

    if (!lessonData) {
      router.push(`/courses/${courseId}`);
      return;
    }
    setLesson(lessonData);

    // Get module info
    const { data: moduleData } = await supabase
      .from("modules")
      .select("*")
      .eq("id", lessonData.module_id)
      .single();

    if (moduleData) {
      setModuleName(moduleData.name);
    }

    // Get course info
    const { data: courseData } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseData) {
      setCourse(courseData);
    }

    // Check completion status
    const { data: progress } = await supabase
      .from("progress")
      .select("completed")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId)
      .single();

    setIsCompleted(progress?.completed || false);

    // Build navigation: get all lessons in this course ordered
    const { data: courseModules } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (courseModules && courseModules.length > 0) {
      const moduleIds = courseModules.map((m) => m.id);

      const { data: allLessons } = await supabase
        .from("lessons")
        .select("*")
        .in("module_id", moduleIds)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (allLessons) {
        // Sort lessons by module order then lesson order
        const moduleOrderMap = new Map(
          courseModules.map((m, i) => [m.id, i])
        );
        const moduleNameMap = new Map(
          courseModules.map((m) => [m.id, m.name])
        );

        const sortedLessons = [...allLessons].sort((a, b) => {
          const modOrderA = moduleOrderMap.get(a.module_id) ?? 0;
          const modOrderB = moduleOrderMap.get(b.module_id) ?? 0;
          if (modOrderA !== modOrderB) return modOrderA - modOrderB;
          return a.order_index - b.order_index;
        });

        const currentIndex = sortedLessons.findIndex(
          (l) => l.id === lessonId
        );

        if (currentIndex > 0) {
          const prev = sortedLessons[currentIndex - 1];
          setPrevLesson({
            id: prev.id,
            title: prev.title,
            moduleId: prev.module_id,
            moduleName: moduleNameMap.get(prev.module_id) || "",
          });
        } else {
          setPrevLesson(null);
        }

        if (currentIndex < sortedLessons.length - 1) {
          const next = sortedLessons[currentIndex + 1];
          setNextLesson({
            id: next.id,
            title: next.title,
            moduleId: next.module_id,
            moduleName: moduleNameMap.get(next.module_id) || "",
          });
        } else {
          setNextLesson(null);
        }
      }
    }

    setLoading(false);
  }, [courseId, lessonId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Award XP via the API
  async function awardXP(eventType: string) {
    try {
      const response = await fetch("/api/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          metadata: { lessonId, courseId },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setXpToast({
          show: true,
          xp: data.xpAwarded,
          label: data.eventLabel,
        });
      }
    } catch {
      // XP award failure should not block the UX
      console.error("Error awarding XP");
    }
  }

  // Mark lesson as completed
  async function handleMarkComplete() {
    if (!userId || isMarking) return;

    setIsMarking(true);
    const supabase = createClient();

    if (isCompleted) {
      // Unmark
      await supabase
        .from("progress")
        .delete()
        .eq("user_id", userId)
        .eq("lesson_id", lessonId);
      setIsCompleted(false);
    } else {
      // Mark as completed (upsert)
      await supabase.from("progress").upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,lesson_id",
        }
      );
      setIsCompleted(true);

      // Award XP for lesson completion
      await awardXP("lesson_complete");
    }

    setIsMarking(false);
  }

  // Extract YouTube video ID
  function getYouTubeEmbedUrl(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0`;
      }
    }
    return url; // Return as-is if it's already an embed URL
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#FBBC0C]" />
          <p className="text-sm text-[#1F2F58]/50">Cargando leccion...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto size-12 text-[#1F2F58]/20" />
          <p className="mt-3 text-sm text-[#1F2F58]/50">
            No se encontro la leccion.
          </p>
          <Link href={`/courses/${courseId}`} className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              Volver al curso
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* XP Toast */}
      {xpToast.show && (
        <XPToast
          xp={xpToast.xp}
          label={xpToast.label}
          onDismiss={() => setXpToast({ show: false, xp: 0, label: "" })}
        />
      )}

      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-[#1F2F58]/8 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-[#1F2F58]/50 transition-colors hover:bg-[#1F2F58]/5 hover:text-[#1F2F58]"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">{course?.name || "Curso"}</span>
          </Link>

          <div className="h-4 w-px bg-[#1F2F58]/10" />

          <div className="min-w-0">
            <p className="text-xs text-[#73B8E7] font-medium truncate">
              {moduleName}
            </p>
            <h1 className="text-sm font-semibold text-[#0A1628] truncate">
              {lesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lesson.duration_minutes && (
            <Badge
              variant="secondary"
              className="hidden gap-1 border-none bg-[#1F2F58]/5 text-[#1F2F58]/50 sm:flex"
            >
              <Clock className="size-3" />
              {lesson.duration_minutes} min
            </Badge>
          )}

          <button
            onClick={() => setShowChat(!showChat)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-[#1F2F58]/50 transition-colors hover:bg-[#1F2F58]/5 hover:text-[#1F2F58]"
            title={showChat ? "Ocultar AI Lab" : "Mostrar AI Lab"}
          >
            {showChat ? (
              <PanelRightClose className="size-4" />
            ) : (
              <PanelRightOpen className="size-4" />
            )}
            <span className="hidden sm:inline text-xs">AI Lab</span>
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* LEFT: Lesson content */}
        <div
          className={cn(
            "flex flex-col overflow-hidden transition-all duration-300",
            showChat ? "lg:w-[60%] h-[60%] lg:h-full" : "w-full h-full"
          )}
        >
          <div className="flex-1 overflow-y-auto">
            <article className="mx-auto max-w-3xl px-8 py-8 lg:px-12">
              {/* Lesson title */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-[#0A1628] lg:text-3xl">
                  {lesson.title}
                </h1>
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-sm text-[#73B8E7] font-medium">
                    {moduleName}
                  </span>
                  {lesson.duration_minutes && (
                    <span className="flex items-center gap-1 text-sm text-[#1F2F58]/40">
                      <Clock className="size-3.5" />
                      {lesson.duration_minutes} minutos
                    </span>
                  )}
                  <span
                    className={cn(
                      "flex items-center gap-1 text-sm",
                      isCompleted ? "text-emerald-500" : "text-[#1F2F58]/30"
                    )}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="size-3.5" />
                        Completada
                      </>
                    ) : (
                      <>
                        <Circle className="size-3.5" />
                        Pendiente
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Video embed */}
              {lesson.video_url && (
                <div className="mb-8 overflow-hidden rounded-xl bg-black shadow-lg">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={getYouTubeEmbedUrl(lesson.video_url) || ""}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={lesson.title}
                    />
                  </div>
                </div>
              )}

              {/* PDF link */}
              {lesson.pdf_url && (
                <div className="mb-8">
                  <a
                    href={lesson.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-xl border border-[#F0846D]/20 bg-[#F0846D]/5 px-5 py-3.5 text-sm font-medium text-[#F0846D] transition-colors hover:bg-[#F0846D]/10"
                  >
                    <FileDown className="size-5" />
                    <div>
                      <p className="font-semibold">Material complementario</p>
                      <p className="text-xs text-[#F0846D]/60">
                        Descargar PDF de la leccion
                      </p>
                    </div>
                  </a>
                </div>
              )}

              {/* Markdown content */}
              {lesson.content_markdown && (
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#0A1628] prose-p:text-[#1F2F58]/70 prose-p:leading-relaxed prose-a:text-[#73B8E7] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#0A1628] prose-code:rounded-md prose-code:bg-[#1F2F58]/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#F0846D] prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-[#1F2F58]/10 prose-pre:bg-[#0A1628] prose-pre:text-white/80 prose-img:rounded-xl prose-blockquote:border-l-[#FBBC0C] prose-blockquote:bg-[#FBBC0C]/5 prose-blockquote:py-1 prose-blockquote:text-[#1F2F58]/60 prose-li:text-[#1F2F58]/70 prose-table:text-sm prose-th:bg-[#1F2F58]/5 prose-th:text-[#0A1628] prose-td:text-[#1F2F58]/70 prose-hr:border-[#1F2F58]/10">
                  <ReactMarkdown>{lesson.content_markdown}</ReactMarkdown>
                </div>
              )}

              {/* AI suggested prompt */}
              {lesson.ai_prompt_suggested && (
                <div className="mt-10 rounded-xl border border-[#FBBC0C]/20 bg-[#FBBC0C]/5 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkle className="size-4 text-[#FBBC0C]" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#FBBC0C]">
                      Practica con IA
                    </p>
                  </div>
                  <p className="text-sm text-[#1F2F58]/70">
                    {lesson.ai_prompt_suggested}
                  </p>
                  {!showChat && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowChat(true)}
                      className="mt-3 border-[#FBBC0C]/30 text-[#FBBC0C] hover:bg-[#FBBC0C]/10"
                    >
                      Abrir AI Lab
                      <ArrowRight className="ml-1 size-3.5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Spacer before bottom nav */}
              <div className="h-8" />
            </article>
          </div>

          {/* Bottom navigation bar */}
          <div className="flex items-center justify-between border-t border-[#1F2F58]/8 bg-white px-6 py-3 shadow-[0_-1px_3px_rgba(0,0,0,0.03)]">
            {/* Previous lesson */}
            <div className="flex-1">
              {prevLesson ? (
                <Link
                  href={`/courses/${courseId}/lesson/${prevLesson.id}`}
                  className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#1F2F58]/50 transition-colors hover:bg-[#1F2F58]/5 hover:text-[#1F2F58]"
                >
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                  <div className="hidden min-w-0 sm:block">
                    <p className="text-[10px] text-[#1F2F58]/30">Anterior</p>
                    <p className="truncate font-medium">{prevLesson.title}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>

            {/* Mark as completed button */}
            <Button
              onClick={handleMarkComplete}
              disabled={isMarking}
              className={cn(
                "gap-2 font-semibold transition-all",
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                  : "bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 shadow-md shadow-[#FBBC0C]/20"
              )}
            >
              {isMarking ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isCompleted ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Circle className="size-4" />
              )}
              {isCompleted ? "Completada" : "Marcar como completada"}
            </Button>

            {/* Next lesson */}
            <div className="flex flex-1 justify-end">
              {nextLesson ? (
                <Link
                  href={`/courses/${courseId}/lesson/${nextLesson.id}`}
                  className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#1F2F58]/50 transition-colors hover:bg-[#1F2F58]/5 hover:text-[#1F2F58]"
                >
                  <div className="hidden min-w-0 text-right sm:block">
                    <p className="text-[10px] text-[#1F2F58]/30">Siguiente</p>
                    <p className="truncate font-medium">{nextLesson.title}</p>
                  </div>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <Link
                  href={`/courses/${courseId}`}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#73B8E7] transition-colors hover:bg-[#73B8E7]/5"
                >
                  Volver al curso
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: AI Chat Panel */}
        {showChat && (
          <div className="lg:w-[40%] h-[40%] lg:h-full border-t lg:border-t-0 lg:border-l border-[#1F2F58]/10">
            <ChatPanel
              suggestedPrompt={lesson.ai_prompt_suggested || undefined}
              context={`Curso: ${course?.name || ""}. Modulo: ${moduleName}. Leccion: ${lesson.title}. ${lesson.content_markdown ? `Contenido de la leccion: ${lesson.content_markdown.substring(0, 2000)}` : ""}`}
              className="h-full rounded-none border-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Small sparkle icon inline
function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  );
}
