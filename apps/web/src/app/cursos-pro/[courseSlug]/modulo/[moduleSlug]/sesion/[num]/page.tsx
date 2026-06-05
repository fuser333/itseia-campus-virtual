"use client";

/**
 * Sesión Cursos Profesionales · Libro Alumno
 * URL: /cursos-pro/[courseSlug]/modulo/[moduleSlug]/sesion/[num]
 *
 * Espejo literal de /carreras/[slug]/materia/[subjectSlug]/sesion/[num]
 * pero leyendo de tablas cursos_pro_* en vez de programs/subjects/sessions.
 */

import { use, useCallback, useEffect, useState } from "react";
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
import AILabPanel from "@/components/session/AILabPanel";
import ResourceList from "@/components/session/ResourceList";
import LiveClassPanel from "@/components/session/LiveClassPanel";
import GrabacionesTab from "@/components/session/GrabacionesTab";
import LibrarySuggest from "@/components/library/LibrarySuggest";

import type { UserRole } from "@/types/database";

interface PageProps {
  params: Promise<{ courseSlug: string; moduleSlug: string; num: string }>;
}

interface CursoProCourse {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  total_modules: number;
  total_sessions: number;
}

interface CursoProModule {
  id: string;
  course_id: string;
  num: number;
  slug: string | null;
  name: string;
}

interface CursoProSession {
  id: string;
  course_id: string;
  module_id: string;
  num: number;
  num_in_module: number | null;
  title: string;
  description: string | null;
  scheduled_at: string | null;
  duration_minutes: number;
  meet_url: string | null;
  recording_url: string | null;
  theory_md: string | null;
  exercise_md: string | null;
  quiz_json: unknown;
  resources_json: unknown;
  status: string;
  slides_url: string | null;
}

interface Resource {
  title: string;
  url: string;
  type?: string;
  description?: string;
}

// Mapa fallback de slug por num de módulo (si BD no tiene slug aún)
const MODULE_NUM_TO_SLUG: Record<number, string> = {
  1: "m1-fundamentos-ia-lopdp",
  2: "m2-stack-profesional-ia",
  3: "m3-gestion-operativa-ia",
  4: "m4-facturacion-power-bi-cierre",
};
const MODULE_SLUG_TO_NUM: Record<string, number> = Object.fromEntries(
  Object.entries(MODULE_NUM_TO_SLUG).map(([k, v]) => [v, parseInt(k)])
);

export default function CursoProSessionPage({ params }: PageProps) {
  const { courseSlug, moduleSlug, num } = use(params);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CursoProCourse | null>(null);
  const [moduleData, setModuleData] = useState<CursoProModule | null>(null);
  const [session, setSession] = useState<CursoProSession | null>(null);
  const [prevSession, setPrevSession] = useState<{ title: string; numInModule: number } | null>(null);
  const [nextSession, setNextSession] = useState<{ title: string; numInModule: number } | null>(null);
  const [totalSessionsModule, setTotalSessionsModule] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    // ─── Auth ──────────────────────────────────────────────────────
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);

    // ─── Profile + Course en paralelo ──────────────────────────────
    const [profileResult, courseResult] = await Promise.all([
      user
        ? supabase.from("profiles").select("role").eq("id", user.id).single()
        : Promise.resolve({ data: null }),
      supabase
        .from("cursos_pro_courses")
        .select("id, slug, name, subtitle, total_modules, total_sessions")
        .eq("slug", courseSlug)
        .limit(1),
    ]);

    if (profileResult.data) setUserRole((profileResult.data as { role: UserRole }).role);
    const courseRow =
      (courseResult as { data: CursoProCourse[] | null }).data?.[0] || null;
    if (!courseRow) {
      setLoading(false);
      return;
    }
    setCourse(courseRow);

    // ─── Module (por slug o por num del mapa fallback) ─────────────
    const moduleNumFromSlug = MODULE_SLUG_TO_NUM[moduleSlug];
    let moduleRow: CursoProModule | null = null;

    // Intento 1: por slug en BD
    const { data: bySlug } = await supabase
      .from("cursos_pro_modules")
      .select("id, course_id, num, slug, name")
      .eq("course_id", courseRow.id)
      .eq("slug", moduleSlug)
      .limit(1);
    moduleRow = (bySlug as CursoProModule[] | null)?.[0] || null;

    // Intento 2: por num del mapa fallback
    if (!moduleRow && moduleNumFromSlug) {
      const { data: byNum } = await supabase
        .from("cursos_pro_modules")
        .select("id, course_id, num, slug, name")
        .eq("course_id", courseRow.id)
        .eq("num", moduleNumFromSlug)
        .limit(1);
      moduleRow = (byNum as CursoProModule[] | null)?.[0] || null;
    }

    if (!moduleRow) {
      setLoading(false);
      return;
    }
    setModuleData(moduleRow);

    // ─── Enrollment + Session + AllSessionsOfModule en paralelo ────
    const [enrollResult, allSessionsResult] = await Promise.all([
      user
        ? supabase
            .from("cursos_pro_enrollments")
            .select("id", { count: "exact" })
            .eq("profile_id", user.id)
            .eq("course_id", courseRow.id)
            .eq("status", "active")
        : Promise.resolve({ count: 0 }),
      supabase
        .from("cursos_pro_sessions")
        .select("id, num, num_in_module, title")
        .eq("course_id", courseRow.id)
        .eq("module_id", moduleRow.id)
        .order("num", { ascending: true }),
    ]);

    setIsEnrolled(
      ((enrollResult as { count: number | null }).count || 0) > 0
    );

    const allSessions =
      (allSessionsResult as {
        data: { id: string; num: number; num_in_module: number | null; title: string }[] | null;
      }).data || [];

    // Calcular num_in_module si BD no lo tiene (fallback por orden)
    const sessionsWithNumInModule = allSessions.map((s, idx) => ({
      ...s,
      _numInModule: s.num_in_module ?? idx + 1,
    }));

    setTotalSessionsModule(sessionsWithNumInModule.length);

    const numParsed = parseInt(num);
    const currentIdx = sessionsWithNumInModule.findIndex(
      (s) => s._numInModule === numParsed
    );

    if (currentIdx < 0) {
      setLoading(false);
      return;
    }

    if (currentIdx > 0) {
      setPrevSession({
        title: sessionsWithNumInModule[currentIdx - 1].title,
        numInModule: sessionsWithNumInModule[currentIdx - 1]._numInModule,
      });
    }
    if (currentIdx < sessionsWithNumInModule.length - 1) {
      setNextSession({
        title: sessionsWithNumInModule[currentIdx + 1].title,
        numInModule: sessionsWithNumInModule[currentIdx + 1]._numInModule,
      });
    }

    // ─── Detalle de la sesión actual ────────────────────────────────
    const { data: sessionDetail } = await supabase
      .from("cursos_pro_sessions")
      .select("*")
      .eq("id", sessionsWithNumInModule[currentIdx].id)
      .limit(1);

    const sd = (sessionDetail as CursoProSession[] | null)?.[0];
    if (sd) setSession(sd);

    setLoading(false);
  }, [courseSlug, moduleSlug, num]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Loading ────────────────────────────────────────────────────
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

  // ─── Not found ──────────────────────────────────────────────────
  if (!session || !course || !moduleData) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto size-12 text-[#1F2F58]/30" />
          <p className="mt-3 text-sm text-[#1F2F58]/70">
            No se encontro la sesion.
          </p>
          <Link
            href={`/cursos-pro/${courseSlug}/modulo/${moduleSlug}`}
            className="mt-4 inline-block"
          >
            <Button variant="outline" size="sm">
              Volver al modulo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Parsear recursos ───────────────────────────────────────────
  let resources: Resource[] = [];
  if (Array.isArray(session.resources_json)) {
    resources = session.resources_json as Resource[];
  }

  // ─── Parsear quiz ───────────────────────────────────────────────
  let quizData: { questions: unknown[] } | null = null;
  if (Array.isArray(session.quiz_json) && session.quiz_json.length > 0) {
    quizData = { questions: session.quiz_json };
  } else if (
    session.quiz_json &&
    typeof session.quiz_json === "object" &&
    "preguntas" in (session.quiz_json as Record<string, unknown>)
  ) {
    const obj = session.quiz_json as { preguntas: unknown[] };
    quizData = { questions: obj.preguntas };
  }

  // ─── Build tabs ──────────────────────────────────────────────────
  const sessionContext = `Curso: ${course.name}. Modulo ${moduleData.num}: ${moduleData.name}. Sesion: ${session.title}. ${
    session.theory_md ? `Contenido teorico: ${session.theory_md.substring(0, 3000)}` : ""
  }`;

  // Extraer URL YouTube del theory_md si existe
  const youtubeMatch = session.theory_md?.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  const videoUrl = youtubeMatch
    ? `https://www.youtube.com/watch?v=${youtubeMatch[1]}`
    : null;

  const tabs: SessionTab[] = [
    {
      id: "video",
      label: "Video",
      icon: "video",
      completed: false,
      available: !!videoUrl,
      content: videoUrl ? (
        <VideoPlayer
          videoUrl={videoUrl}
          title={session.title}
          onWatched={() => {}}
        />
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
          slidesType="pdf"
          title="Presentacion"
          onViewed={() => {}}
        />
      ) : null,
    },
    {
      id: "theory",
      label: "Teoria",
      icon: "theory",
      completed: false,
      available: !!session.theory_md,
      content: session.theory_md ? (
        <TheoryContent
          content={session.theory_md}
          title="Contenido teorico"
          onRead={() => {}}
        />
      ) : null,
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: "quiz",
      completed: false,
      available: !!quizData,
      content: quizData ? (
        <div className="prose max-w-none p-6">
          <h3>Quiz de {quizData.questions.length} preguntas</h3>
          <p className="text-sm text-[#1F2F58]/70">
            Quiz embebido proximamente.
          </p>
        </div>
      ) : null,
    },
    {
      id: "assignment",
      label: "Ejercicio",
      icon: "assignment",
      completed: false,
      available: !!session.exercise_md,
      content: session.exercise_md ? (
        <TheoryContent
          content={session.exercise_md}
          title="Ejercicio"
          onRead={() => {}}
        />
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
          suggestedPrompt={undefined}
          onFirstMessage={() => {}}
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
      content: (
        <div className="space-y-6">
          {resources.length > 0 && (
            <ResourceList
              resources={resources.map((r) => {
                const validTypes = ["pdf", "link", "video", "github", "dataset", "tool"] as const;
                type ValidType = (typeof validTypes)[number];
                const rt = (r.type || "link").toLowerCase();
                const type: ValidType = (validTypes as readonly string[]).includes(rt)
                  ? (rt as ValidType)
                  : "link";
                return {
                  title: r.title,
                  url: r.url,
                  type,
                  description: r.description ?? null,
                };
              })}
            />
          )}
          <LibrarySuggest sessionContext={`${moduleData.name}: ${session.title}`} />
        </div>
      ),
    },
    {
      id: "live",
      label: "Clase en Vivo",
      icon: "live" as SessionTab["icon"],
      completed: false,
      available: true,
      content: (
        <LiveClassPanel
          sessionId={session.id}
          subjectName={moduleData.name}
          teacherName={undefined}
          userRole={userRole}
          isEnrolled={
            isEnrolled ||
            ["docente", "admin", "coordinacion", "super_admin", "finanzas"].includes(
              userRole || ""
            )
          }
        />
      ),
    },
    {
      id: "recordings",
      label: "Grabaciones",
      icon: "recordings" as SessionTab["icon"],
      completed: false,
      available: true,
      content: <GrabacionesTab sessionId={session.id} />,
    },
  ];

  const moduleUrl = `/cursos-pro/${courseSlug}/modulo/${moduleSlug}`;
  const currentNumInModule =
    session.num_in_module ?? parseInt(num);

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="border-b border-[#1F2F58]/8 bg-white px-4 py-2 shadow-sm">
        <div className="hidden md:flex items-center gap-1 mb-1">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/dashboard" },
              { label: course.name, href: `/cursos-pro/${courseSlug}` },
              { label: `M${moduleData.num}`, href: `/cursos-pro/${courseSlug}` },
              { label: moduleData.name, href: moduleUrl },
            ]}
          />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold text-[#0A1628] truncate max-w-[70%]">
            {session.title}
          </h1>
          <p className="text-[10px] text-[#1F2F58]/40 flex-shrink-0">
            Sesion {currentNumInModule} de {totalSessionsModule}
          </p>
        </div>
        <div className="md:hidden">
          <p className="text-[10px] text-[#FBBC0C] font-medium truncate">
            {moduleData.name}
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <SessionTabs tabs={tabs} />
      </div>

      {/* Bottom navigation */}
      <SessionNav
        prevSession={
          prevSession
            ? {
                title: prevSession.title,
                url: `/cursos-pro/${courseSlug}/modulo/${moduleSlug}/sesion/${prevSession.numInModule}`,
              }
            : null
        }
        nextSession={
          nextSession
            ? {
                title: nextSession.title,
                url: `/cursos-pro/${courseSlug}/modulo/${moduleSlug}/sesion/${nextSession.numInModule}`,
              }
            : null
        }
        currentNum={currentNumInModule}
        totalSessions={totalSessionsModule}
        subjectUrl={moduleUrl}
      />
    </div>
  );
}
