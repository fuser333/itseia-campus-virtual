"use client";

import { use, useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Loader2, BookOpen, ArrowLeft, Edit, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

import SessionTabs, { type SessionTab } from "@/components/session/SessionTabs";
import VideoPlayer from "@/components/session/VideoPlayer";
import SlideViewer from "@/components/session/SlideViewer";
import TheoryContent from "@/components/session/TheoryContent";
import QuizEngine from "@/components/session/QuizEngine";
import AssignmentPanel from "@/components/session/AssignmentPanel";
import AILabPanel from "@/components/session/AILabPanel";
import ResourceList from "@/components/session/ResourceList";
import LiveClassPanel from "@/components/session/LiveClassPanel";
import GrabacionesTab from "@/components/session/GrabacionesTab";

import PropositoMetodologiaTab from "@/components/teacher/session/PropositoMetodologiaTab";
import RespuestasModeloTab from "@/components/teacher/session/RespuestasModeloTab";
import NotasDocenteTab from "@/components/teacher/session/NotasDocenteTab";
import ResumenVideoTab from "@/components/teacher/session/ResumenVideoTab";

import type {
  Session,
  Subject,
  Quiz,
  Assignment,
  SessionResource,
  UserRole,
} from "@/types/database";

interface PageProps {
  params: Promise<{ id: string; num: string }>;
}

const WRITE_ROLES: UserRole[] = ["super_admin", "admin", "coordinacion"];

export default function TeacherSessionPage({ params }: PageProps) {
  const { id: subjectId, num } = use(params);

  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [resources, setResources] = useState<SessionResource[]>([]);
  const [role, setRole] = useState<UserRole | null>(null);
  const [totalSessions, setTotalSessions] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const [profileRes, subjectRes] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      supabase.from("subjects").select("*").eq("id", subjectId).single(),
    ]);

    if (profileRes.data) setRole((profileRes.data as { role: UserRole }).role);
    if (!subjectRes.data) {
      setLoading(false);
      return;
    }
    setSubject(subjectRes.data as Subject);

    const sessionNumber = parseInt(num, 10);
    const { data: sessionRow } = await supabase
      .from("sessions")
      .select("*")
      .eq("subject_id", subjectId)
      .eq("number", sessionNumber)
      .single();
    if (!sessionRow) {
      setLoading(false);
      return;
    }
    setSession(sessionRow as Session);

    const { count } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .eq("subject_id", subjectId);
    if (typeof count === "number") setTotalSessions(count);

    const sid = (sessionRow as Session).id;
    const [quizRes, assignRes, resourcesRes] = await Promise.all([
      supabase.from("quizzes").select("*").eq("session_id", sid).maybeSingle(),
      supabase.from("assignments").select("*").eq("session_id", sid).maybeSingle(),
      supabase.from("session_resources").select("*").eq("session_id", sid).order("order_index", { ascending: true }),
    ]);
    if (quizRes.data) setQuiz(quizRes.data as Quiz);
    if (assignRes.data) setAssignment(assignRes.data as Assignment);
    setResources((resourcesRes.data ?? []) as SessionResource[]);

    setLoading(false);
  }, [subjectId, num]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#FBBC0C]" />
          <p className="text-sm text-[#1F2F58]">Cargando sesion...</p>
        </div>
      </div>
    );
  }

  if (!session || !subject) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto size-12 text-[#1F2F58]/30" />
          <p className="mt-3 text-sm text-[#1F2F58]/70">No se encontro la sesion.</p>
          <Link href={`/teacher/materias/${subjectId}`} className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1 size-3" />
              Volver a la materia
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const canWrite = role !== null && WRITE_ROLES.includes(role);
  const sessionContext = `Materia: ${subject.name}. Sesion ${session.number}: ${session.title}. ${session.ai_lab_context || ""} ${session.theory_markdown ? `Contenido teorico: ${session.theory_markdown.substring(0, 3000)}` : ""}`;

  // 9 tabs espejo del alumno + 4 capas docente
  const tabs: SessionTab[] = [
    {
      id: "video",
      label: "Video",
      icon: "video",
      completed: false,
      available: !!session.video_url,
      content: session.video_url ? (
        <VideoPlayer videoUrl={session.video_url} title={session.title} />
      ) : null,
    },
    {
      id: "slides",
      label: "Presentacion",
      icon: "slides",
      completed: false,
      available: !!session.slides_url,
      content: session.slides_url ? (
        <SlideViewer
          slidesUrl={session.slides_url}
          slidesType={session.slides_type === "google_slides" ? "google_slides" : "pdf"}
          title="Presentacion"
        />
      ) : null,
    },
    {
      id: "theory",
      label: "Teoria",
      icon: "theory",
      completed: false,
      available: !!session.theory_markdown,
      content: session.theory_markdown ? (
        <TheoryContent content={session.theory_markdown} title="Contenido teorico" />
      ) : null,
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: "quiz",
      completed: false,
      available: !!quiz,
      content: quiz ? <QuizEngine quizId={quiz.id} sessionId={session.id} /> : null,
    },
    {
      id: "assignment",
      label: "Ejercicio",
      icon: "assignment",
      completed: false,
      available: !!assignment,
      content: assignment ? (
        <AssignmentPanel assignmentId={assignment.id} sessionId={session.id} />
      ) : null,
    },
    {
      id: "ailab",
      label: "AI Lab",
      icon: "ailab",
      completed: false,
      available: true,
      content: (
        <AILabPanel
          sessionContext={sessionContext}
          suggestedPrompt={session.ai_lab_suggested_prompt || undefined}
          sessionId={session.id}
          sessionTitle={session.title}
        />
      ),
    },
    {
      id: "resources",
      label: "Recursos",
      icon: "resources",
      completed: false,
      available: true,
      content: resources.length > 0 ? (
        <ResourceList
          resources={resources.map((r) => ({
            title: r.title,
            url: r.url,
            type: r.type,
            description: r.description,
          }))}
        />
      ) : (
        <p className="p-4 text-sm text-gray-500">Esta sesion no tiene recursos.</p>
      ),
    },
    {
      id: "live",
      label: "Clase en Vivo",
      icon: "live",
      completed: false,
      available: true,
      content: (
        <LiveClassPanel
          sessionId={session.id}
          subjectName={subject.name}
          userRole={role}
          isEnrolled={true}
        />
      ),
    },
    {
      id: "recordings",
      label: "Grabaciones",
      icon: "recordings",
      completed: false,
      available: true,
      content: <GrabacionesTab sessionId={session.id} />,
    },
    // ─── Capas docente ───
    {
      id: "proposito",
      label: "Proposito",
      icon: "theory",
      completed: false,
      available: true,
      content: <PropositoMetodologiaTab sessionId={session.id} />,
    },
    {
      id: "respuestas",
      label: "Respuestas",
      icon: "assignment",
      completed: false,
      available: true,
      content: <RespuestasModeloTab sessionId={session.id} />,
    },
    {
      id: "notas",
      label: "Notas",
      icon: "resources",
      completed: false,
      available: true,
      content: <NotasDocenteTab sessionId={session.id} />,
    },
    {
      id: "resumen-video",
      label: "Resumen IA",
      icon: "recordings",
      completed: false,
      available: true,
      content: <ResumenVideoTab sessionId={session.id} canGenerate={canWrite} />,
    },
  ];

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-[#1F2F58]/10 bg-white px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href={`/teacher/materias/${subjectId}`}
              className="flex-shrink-0 rounded p-1 hover:bg-gray-100"
              title="Volver a la materia"
            >
              <ArrowLeft className="size-4 text-[#1F2F58]" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#73B8E7]">
                <GraduationCap className="size-3" />
                Vista docente · {subject.name}
              </div>
              <h1 className="truncate text-sm font-semibold text-[#0A1628]">
                {session.title}
              </h1>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <span className="text-[10px] text-[#1F2F58]/50">
              Sesion {session.number}{totalSessions > 0 ? ` de ${totalSessions}` : ""}
            </span>
            {canWrite && (
              <Link
                href={`/teacher/materias/${subjectId}/sesion/${num}/edit`}
                className="inline-flex items-center gap-1 rounded-md border border-[#FBBC0C] bg-[#FBBC0C]/10 px-2 py-1 text-[11px] font-semibold text-[#1F2F58] hover:bg-[#FBBC0C]/20"
              >
                <Edit className="size-3" />
                Editar
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <SessionTabs tabs={tabs} />
      </div>
    </div>
  );
}
