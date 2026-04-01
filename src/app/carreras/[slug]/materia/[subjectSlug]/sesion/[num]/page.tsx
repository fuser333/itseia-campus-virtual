"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import Breadcrumb from "@/components/academic/Breadcrumb";
import SessionTabs, { type SessionTab } from "@/components/session/SessionTabs";
import SessionNav from "@/components/session/SessionNav";
import VideoPlayer from "@/components/session/VideoPlayer";
import SlideViewer from "@/components/session/SlideViewer";
import TheoryContent from "@/components/session/TheoryContent";
import QuizEngine from "@/components/session/QuizEngine";
import AssignmentPanel from "@/components/session/AssignmentPanel";
import AILabPanel from "@/components/session/AILabPanel";
import ResourceList from "@/components/session/ResourceList";
import LiveClassPanel from "@/components/session/LiveClassPanel";
import LibrarySuggest from "@/components/library/LibrarySuggest";

import type {
  Session,
  Subject,
  Quiz,
  Assignment,
  SessionResource,
  SessionProgress,
  UserRole,
} from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string; subjectSlug: string; num: string }>;
}

export default function SessionPage({ params }: PageProps) {
  const { slug, subjectSlug, num } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [careerName, setCareerName] = useState("");
  const [semesterNum, setSemesterNum] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [resources, setResources] = useState<SessionResource[]>([]);
  const [progress, setProgress] = useState<SessionProgress | null>(null);
  const [prevSession, setPrevSession] = useState<{ title: string; number: number } | null>(null);
  const [nextSession, setNextSession] = useState<{ title: string; number: number } | null>(null);
  const [totalSessions, setTotalSessions] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [teacherName, setTeacherName] = useState<string | undefined>(undefined);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    // ─── Grupo 1: Auth (base de todo) ───────────────────────────────────────
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);

    // ─── Grupo 2: profile + program en paralelo (ambos independientes) ──────
    const [profileResult, careersResult] = await Promise.all([
      user
        ? supabase.from("profiles").select("role").eq("id", user.id).single()
        : Promise.resolve({ data: null }),
      supabase
        .from("programs")
        .select("id, name, slug")
        .eq("slug", slug)
        .limit(1),
    ]);

    if (profileResult.data) setUserRole((profileResult.data as { role: UserRole }).role);
    const career = (careersResult as { data: { id: string; name: string; slug: string }[] | null }).data?.[0] || null;
    if (career) setCareerName(career.name);

    // ─── Grupo 3: semesters (necesita career.id) ────────────────────────────
    let subjectData = null;
    if (career) {
      const { data: semesters } = await supabase
        .from("semesters")
        .select("id")
        .eq("program_id", career.id);
      const semIds = semesters?.map(s => s.id) || [];
      if (semIds.length > 0) {
        const { data: subjects } = await supabase
          .from("subjects")
          .select("*")
          .eq("slug", subjectSlug)
          .in("semester_id", semIds)
          .limit(1);
        subjectData = subjects?.[0] || null;
      }
    }
    if (!subjectData) {
      // Fallback: try without career filter
      const { data: subjects } = await supabase
        .from("subjects")
        .select("*")
        .eq("slug", subjectSlug)
        .limit(1);
      subjectData = subjects?.[0] || null;
    }

    if (!subjectData) {
      setLoading(false);
      return;
    }
    setSubject(subjectData);

    // ─── Grupo 4: teacher + semesterNum en paralelo (ambos necesitan subjectData) ──
    const [teacherResult, semesterResult] = await Promise.all([
      subjectData.teacher_id
        ? supabase
            .from("profiles")
            .select("full_name")
            .eq("id", subjectData.teacher_id)
            .single()
        : Promise.resolve({ data: null }),
      supabase
        .from("semesters")
        .select("number, program_id")
        .eq("id", subjectData.semester_id)
        .limit(1),
    ]);

    if (teacherResult.data) setTeacherName((teacherResult.data as { full_name: string }).full_name);
    const semesterArr = (semesterResult as { data: { number: number; program_id: string }[] | null }).data;
    if (semesterArr?.[0]) setSemesterNum(semesterArr[0].number);

    // ─── Grupo 5: enrollment + session en paralelo (independientes entre si) ─
    const programId = semesterArr?.[0]?.program_id;

    const [enrollResult, sessionsResult] = await Promise.all([
      user && programId
        ? supabase
            .from("enrollments")
            .select("id", { count: "exact" })
            .eq("user_id", user.id)
            .eq("program_id", programId)
            .eq("status", "active")
        : Promise.resolve({ count: 0 }),
      supabase
        .from("sessions")
        .select("*")
        .eq("subject_id", subjectData.id)
        .eq("number", parseInt(num))
        .eq("is_active", true)
        .limit(1),
    ]);

    setIsEnrolled(((enrollResult as { count: number | null }).count || 0) > 0);

    const sessionData = (sessionsResult as { data: Session[] | null }).data?.[0] || null;
    if (!sessionData) {
      setLoading(false);
      return;
    }
    setSession(sessionData);

    // ─── Grupo 6: quiz + assignment + resources + progress + allSessions ─────
    // Todos dependen de sessionData.id o subjectData.id — todos en paralelo
    const [
      quizResult,
      assignmentResult,
      resourcesResult,
      progressResult,
      allSessionsResult,
    ] = await Promise.all([
      // Get quiz for this session (fetch array, take first — .single() fails when empty)
      supabase
        .from("quizzes")
        .select("*")
        .eq("session_id", sessionData.id)
        .eq("is_active", true)
        .limit(1),
      // Get assignment for this session (fetch array, take first — .single() fails when empty)
      supabase
        .from("assignments")
        .select("*")
        .eq("session_id", sessionData.id)
        .eq("is_active", true)
        .limit(1),
      // Get resources
      supabase
        .from("session_resources")
        .select("*")
        .eq("session_id", sessionData.id)
        .order("order_index", { ascending: true }),
      // Get progress (fetch array, take first — .single() fails when empty)
      user
        ? supabase
            .from("session_progress")
            .select("*")
            .eq("session_id", sessionData.id)
            .eq("user_id", user.id)
            .limit(1)
        : Promise.resolve({ data: null }),
      // Get all sessions for nav
      supabase
        .from("sessions")
        .select("id, number, title")
        .eq("subject_id", subjectData.id)
        .eq("is_active", true)
        .order("number", { ascending: true }),
    ]);

    setQuiz((quizResult as { data: Quiz[] | null }).data?.[0] || null);
    setAssignment((assignmentResult as { data: Assignment[] | null }).data?.[0] || null);
    setResources((resourcesResult as { data: SessionResource[] | null }).data || []);
    setProgress((progressResult as { data: SessionProgress[] | null }).data?.[0] || null);

    const allSessions = (allSessionsResult as { data: { id: string; number: number; title: string }[] | null }).data;
    if (allSessions) {
      setTotalSessions(allSessions.length);
      const currentIdx = allSessions.findIndex(
        (s) => s.number === parseInt(num)
      );
      if (currentIdx > 0) {
        setPrevSession({
          title: allSessions[currentIdx - 1].title,
          number: allSessions[currentIdx - 1].number,
        });
      }
      if (currentIdx >= 0 && currentIdx < allSessions.length - 1) {
        setNextSession({
          title: allSessions[currentIdx + 1].title,
          number: allSessions[currentIdx + 1].number,
        });
      }
    }

    setLoading(false);
  }, [slug, subjectSlug, num]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Progress update helper ───
  async function updateProgress(field: string) {
    if (!session || !userId) return;

    try {
      await fetch(`/api/sessions/${session.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: true }),
      });

      // Update local state
      setProgress((prev) =>
        prev
          ? { ...prev, [field]: true }
          : ({
              id: "",
              user_id: userId,
              session_id: session.id,
              video_watched: false,
              video_watch_seconds: 0,
              slides_viewed: false,
              theory_read: false,
              quiz_passed: false,
              assignment_submitted: false,
              ai_lab_used: false,
              completed: false,
              completed_at: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              [field]: true,
            } as SessionProgress)
      );
    } catch {
      // Silently fail on progress tracking
    }
  }

  // ─── Loading state ───
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

  // ─── Not found ───
  if (!session || !subject) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto size-12 text-[#1F2F58]/30" />
          <p className="mt-3 text-sm text-[#1F2F58]/70">
            No se encontro la sesion.
          </p>
          <Link
            href={`/carreras/${slug}/materia/${subjectSlug}`}
            className="mt-4 inline-block"
          >
            <Button variant="outline" size="sm">
              Volver a la materia
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Build tabs ───
  const sessionContext = `Materia: ${subject.name}. Sesion ${session.number}: ${session.title}. ${session.ai_lab_context || ""} ${session.theory_markdown ? `Contenido teorico: ${session.theory_markdown.substring(0, 3000)}` : ""}`;

  const tabs: SessionTab[] = [
    {
      id: "video",
      label: "Video",
      icon: "video",
      completed: progress?.video_watched || false,
      available: !!session.video_url,
      content: session.video_url ? (
        <VideoPlayer
          videoUrl={session.video_url}
          title={session.title}
          onWatched={() => updateProgress("video_watched")}
        />
      ) : null,
    },
    {
      id: "slides",
      label: "Presentacion",
      icon: "slides",
      completed: progress?.slides_viewed || false,
      available: !!session.slides_url,
      content: session.slides_url ? (
        <SlideViewer
          slidesUrl={session.slides_url}
          slidesType={session.slides_type === "google_slides" ? "google_slides" : "pdf"}
          title="Presentacion"
          onViewed={() => updateProgress("slides_viewed")}
        />
      ) : null,
    },
    {
      id: "theory",
      label: "Teoria",
      icon: "theory",
      completed: progress?.theory_read || false,
      available: !!session.theory_markdown,
      content: session.theory_markdown ? (
        <TheoryContent
          content={session.theory_markdown}
          title="Contenido teorico"
          onRead={() => updateProgress("theory_read")}
        />
      ) : null,
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: "quiz",
      completed: progress?.quiz_passed || false,
      available: !!quiz,
      content: quiz ? (
        <QuizEngine
          quizId={quiz.id}
          sessionId={session.id}
          onPassed={() => updateProgress("quiz_passed")}
        />
      ) : null,
    },
    {
      id: "assignment",
      label: "Ejercicio",
      icon: "assignment",
      completed: progress?.assignment_submitted || false,
      available: !!assignment,
      content: assignment ? (
        <AssignmentPanel
          assignmentId={assignment.id}
          sessionId={session.id}
          onSubmitted={() => updateProgress("assignment_submitted")}
        />
      ) : null,
    },
    {
      id: "ailab",
      label: "AI Lab",
      icon: "ailab",
      completed: progress?.ai_lab_used || false,
      available: true, // Always available
      content: (
        <AILabPanel
          sessionContext={sessionContext}
          suggestedPrompt={session.ai_lab_suggested_prompt || undefined}
          onFirstMessage={() => updateProgress("ai_lab_used")}
          sessionId={session.id}
          sessionTitle={session.title}
        />
      ),
    },
    {
      id: "resources",
      label: "Recursos",
      icon: "resources",
      completed: false, // Resources don't have a completion state
      available: true, // Siempre visible: puede tener recursos y/o biblioteca
      content: (
        <div className="space-y-6">
          {resources.length > 0 && (
            <ResourceList
              resources={resources.map((r) => ({
                title: r.title,
                url: r.url,
                type: r.type,
                description: r.description,
              }))}
            />
          )}
          <LibrarySuggest
            sessionContext={`${subject.name}: ${session.title}`}
          />
        </div>
      ),
    },
    {
      id: "live",
      label: "Clase en Vivo",
      icon: "live" as SessionTab["icon"],
      completed: false,
      available: true, // Always visible — muestra estado actual
      content: (
        <LiveClassPanel
          sessionId={session.id}
          subjectName={subject.name}
          teacherName={teacherName}
          userRole={userRole}
          isEnrolled={isEnrolled || ["docente", "admin", "coordinacion", "super_admin", "finanzas"].includes(userRole || "")}
        />
      ),
    },
  ];

  const subjectUrl = `/carreras/${slug}/materia/${subjectSlug}`;

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar with breadcrumb and session title */}
      <header className="flex items-center justify-between border-b border-[#1F2F58]/8 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Breadcrumb
            items={[
              { label: "Carreras", href: "/carreras" },
              { label: careerName, href: `/carreras/${slug}` },
              ...(semesterNum
                ? [
                    {
                      label: `P${semesterNum}`,
                      href: `/carreras/${slug}`,
                    },
                  ]
                : []),
              {
                label: subject.name,
                href: subjectUrl,
              },
              { label: `Sesion ${session.number}` },
            ]}
            className="hidden md:flex"
          />

          {/* Mobile: compact title */}
          <div className="md:hidden min-w-0">
            <p className="text-xs text-[#73B8E7] font-medium truncate">
              {subject.name}
            </p>
            <h1 className="text-sm font-semibold text-[#0A1628] truncate">
              {session.title}
            </h1>
          </div>
        </div>

        {/* Desktop session title */}
        <div className="hidden md:block text-right min-w-0">
          <h1 className="text-sm font-semibold text-[#0A1628] truncate">
            {session.title}
          </h1>
          <p className="text-[10px] text-[#1F2F58]/40">
            Sesion {session.number} de {totalSessions}
          </p>
        </div>
      </header>

      {/* Main content: tabs */}
      <div className="flex-1 overflow-hidden">
        <SessionTabs tabs={tabs} />
      </div>

      {/* Bottom navigation */}
      <SessionNav
        prevSession={
          prevSession
            ? {
                title: prevSession.title,
                url: `/carreras/${slug}/materia/${subjectSlug}/sesion/${prevSession.number}`,
              }
            : null
        }
        nextSession={
          nextSession
            ? {
                title: nextSession.title,
                url: `/carreras/${slug}/materia/${subjectSlug}/sesion/${nextSession.number}`,
              }
            : null
        }
        currentNum={parseInt(num)}
        totalSessions={totalSessions}
        subjectUrl={subjectUrl}
      />
    </div>
  );
}
