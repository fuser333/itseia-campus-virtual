"use client";

/**
 * Sesion de Cursos Profesionales · UI espejo de preuni con 9 pestañas.
 * URL: /cursos-pro/c/[courseSlug]/m/[moduleSlug]/sesion/[num]
 *
 * REGLAS BLINDADAS (ver AUDITORIA_CURSOS_PRO_JUN05/02_REGLAS_CLONACION.md):
 *  1. Cuelga de /cursos-pro/c/... para NO colisionar con /cursos-pro/[slug].
 *  2. Segmento literal "m/" entre courseSlug y moduleSlug — sin ambigüedad.
 *  3. "use client" + función sync + use(params). NUNCA async + await params.
 *  4. createClient cliente (anon key). NO importa shell v2.
 *  5. SessionTabs preserva mount diferido (solo activo + visitados).
 *  6. Lee de cursos_pro_courses/modules/sessions/enrollments.
 *  7. URL params: courseSlug + moduleSlug + num (num_in_module dentro del modulo).
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
  slug?: string | null;
  name: string;
}

// Fallback slug → num para cuando la BD aun NO tiene la columna slug
// (pre-migration 022). Cubre el curso admin-salud activo. Cuando la
// migration se aplique, el query por slug toma prioridad y este map
// queda dormido sin efecto.
const MODULE_SLUG_TO_NUM_FALLBACK: Record<string, number> = {
  "m1-fundamentos-ia-lopdp": 1,
  "m2-stack-profesional-ia": 2,
  "m3-gestion-operativa-ia": 3,
  "m4-facturacion-power-bi-cierre": 4,
  "m5-proyecto-final": 5,
};

interface CursoProSession {
  id: string;
  course_id: string;
  module_id: string;
  num: number;
  num_in_module?: number | null;
  title: string;
  description: string | null;
  scheduled_at: string | null;
  duration_minutes: number;
  meet_url: string | null;
  recording_url: string | null;
  video_url: string | null;
  theory_md: string | null;
  exercise_md: string | null;
  quiz_json: unknown;
  resources_json: unknown;
  status: string;
  slides_url: string | null;
}

interface ResourceRaw {
  title: string;
  url: string;
  type?: string;
  description?: string | null;
}

// Tipos validos para ResourceList (PDF/link/video/github/dataset/tool)
const VALID_RESOURCE_TYPES = ["pdf", "link", "video", "github", "dataset", "tool"] as const;
type ResourceType = (typeof VALID_RESOURCE_TYPES)[number];

export default function CursoProSessionPage({ params }: PageProps) {
  const { courseSlug, moduleSlug, num } = use(params);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CursoProCourse | null>(null);
  const [moduleData, setModuleData] = useState<CursoProModule | null>(null);
  const [session, setSession] = useState<CursoProSession | null>(null);
  const [prevSession, setPrevSession] = useState<{ title: string; numInModule: number } | null>(null);
  const [nextSession, setNextSession] = useState<{ title: string; numInModule: number } | null>(null);
  const [totalSessionsModule, setTotalSessionsModule] = useState(0);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    // ─── Grupo 1: Auth ──────────────────────────────────────────────
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ─── Grupo 2: profile + course en paralelo ──────────────────────
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

    // ─── Grupo 3: module (intento 1 por slug, intento 2 por num fallback) ──
    // Intento 1: query por slug. Falla silenciosamente si la columna no
    // existe todavía en BD (pre-migration 022).
    let moduleRow: CursoProModule | null = null;
    try {
      const { data: bySlug, error: slugErr } = await supabase
        .from("cursos_pro_modules")
        .select("id, course_id, num, name")
        .eq("course_id", courseRow.id)
        .eq("slug", moduleSlug)
        .limit(1);
      if (!slugErr) {
        moduleRow = (bySlug as CursoProModule[] | null)?.[0] || null;
      }
    } catch {
      moduleRow = null;
    }

    // Intento 2: fallback por num del mapa (mientras migration 022 no este).
    if (!moduleRow) {
      const moduleNum = MODULE_SLUG_TO_NUM_FALLBACK[moduleSlug];
      if (moduleNum) {
        const { data: byNum } = await supabase
          .from("cursos_pro_modules")
          .select("id, course_id, num, name")
          .eq("course_id", courseRow.id)
          .eq("num", moduleNum)
          .limit(1);
        moduleRow = (byNum as CursoProModule[] | null)?.[0] || null;
      }
    }

    if (!moduleRow) {
      setLoading(false);
      return;
    }
    setModuleData(moduleRow);

    // ─── Grupo 4: enrollment + sessions modulo en paralelo ──────────
    // Sesiones: NO incluimos num_in_module en select porque la columna
    // puede no existir todavía (pre-migration 022). Calculamos posición
    // intra-módulo por orden de num. Cuando la migration se aplique,
    // num_in_module estará disponible si lo queremos en el futuro.
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
        .select("id, num, title")
        .eq("course_id", courseRow.id)
        .eq("module_id", moduleRow.id)
        .order("num", { ascending: true }),
    ]);

    const enrolledNow = ((enrollResult as { count: number | null }).count || 0) > 0;
    setIsEnrolled(enrolledNow);

    // ─── Guard de acceso (Condición 2 review FASE 2) ─────────────────
    // Cursos-pro = 100% restrictivo: solo matriculados activos + roles staff.
    // Si NO enrolled y NO staff → mostrar vista "acceso denegado".
    const STAFF_ROLES = ["docente", "admin", "coordinacion", "super_admin", "finanzas"];
    const profileRole = profileResult.data
      ? ((profileResult.data as { role: UserRole }).role as string)
      : "";
    const isStaff = STAFF_ROLES.includes(profileRole);
    if (!enrolledNow && !isStaff) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    const allSessions =
      (allSessionsResult as {
        data: { id: string; num: number; title: string }[] | null;
      }).data || [];

    // num_in_module: calculamos siempre por orden del num global
    // dentro del módulo. Esto es estable sin depender de la columna BD.
    const sessionsList = allSessions.map((s, idx) => ({
      ...s,
      _numInModule: idx + 1,
    }));
    setTotalSessionsModule(sessionsList.length);

    const numParsed = parseInt(num);
    const currentIdx = sessionsList.findIndex((s) => s._numInModule === numParsed);
    if (currentIdx < 0) {
      setLoading(false);
      return;
    }

    if (currentIdx > 0) {
      setPrevSession({
        title: sessionsList[currentIdx - 1].title,
        numInModule: sessionsList[currentIdx - 1]._numInModule,
      });
    }
    if (currentIdx < sessionsList.length - 1) {
      setNextSession({
        title: sessionsList[currentIdx + 1].title,
        numInModule: sessionsList[currentIdx + 1]._numInModule,
      });
    }

    // ─── Grupo 5: detalle sesion actual ─────────────────────────────
    const { data: sessionDetail } = await supabase
      .from("cursos_pro_sessions")
      .select("*")
      .eq("id", sessionsList[currentIdx].id)
      .limit(1);

    const sd = (sessionDetail as CursoProSession[] | null)?.[0];
    if (sd) setSession(sd);

    setLoading(false);
  }, [courseSlug, moduleSlug, num]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Loading ──────────────────────────────────────────────────────
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

  // ─── Acceso denegado (no matriculado, no staff) ───────────────────
  if (accessDenied) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center max-w-md px-6">
          <BookOpen className="mx-auto size-12 text-[#F0846D]" />
          <p className="mt-3 text-base font-semibold text-[#1F2F58]">
            Curso no disponible para tu cuenta
          </p>
          <p className="mt-1 text-sm text-[#1F2F58]/60">
            No tienes una matricula activa en este curso profesional. Si crees
            que es un error, contacta a soporte.
          </p>
          <Link href="/dashboard" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              Volver al panel
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Not found ────────────────────────────────────────────────────
  if (!session || !course || !moduleData) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto size-12 text-[#1F2F58]/30" />
          <p className="mt-3 text-sm text-[#1F2F58]/70">
            No se encontro la sesion.
          </p>
          <Link
            href={`/cursos-pro/c/${courseSlug}/sesion/1`}
            className="mt-4 inline-block"
          >
            <Button variant="outline" size="sm">
              Volver al curso
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Parsear recursos (try/catch defensivo) ──────────────────────
  let resources: ResourceRaw[] = [];
  try {
    if (Array.isArray(session.resources_json)) {
      resources = session.resources_json as ResourceRaw[];
    } else if (
      session.resources_json &&
      typeof session.resources_json === "object" &&
      "recursos" in (session.resources_json as Record<string, unknown>)
    ) {
      const obj = session.resources_json as { recursos: ResourceRaw[] };
      if (Array.isArray(obj.recursos)) resources = obj.recursos;
    }
    // Validar shape mínimo: cada elem debe tener al menos title + url
    resources = resources.filter(
      (r) => r && typeof r.title === "string" && typeof r.url === "string"
    );
  } catch {
    resources = [];
  }

  // ─── Parsear quiz (try/catch defensivo) ───────────────────────────
  let quizQuestions: unknown[] | null = null;
  try {
    if (Array.isArray(session.quiz_json) && session.quiz_json.length > 0) {
      quizQuestions = session.quiz_json;
    } else if (
      session.quiz_json &&
      typeof session.quiz_json === "object" &&
      "preguntas" in (session.quiz_json as Record<string, unknown>)
    ) {
      const obj = session.quiz_json as { preguntas: unknown[] };
      if (Array.isArray(obj.preguntas) && obj.preguntas.length > 0)
        quizQuestions = obj.preguntas;
    }
  } catch {
    quizQuestions = null;
  }

  // ─── Build context AI Lab ────────────────────────────────────────
  const sessionContext = `Curso: ${course.name}. Modulo ${moduleData.num}: ${moduleData.name}. Sesion: ${session.title}. ${
    session.theory_md ? `Contenido teorico: ${session.theory_md.substring(0, 3000)}` : ""
  }`;

  // ─── Resolver video URL: prefer video_url, fallback a YouTube en theory_md ─
  let videoUrl: string | null = session.video_url || null;
  if (!videoUrl && session.theory_md) {
    const m = session.theory_md.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    if (m) videoUrl = `https://www.youtube.com/watch?v=${m[1]}`;
  }

  // ─── Tabs (9 pestañas espejo preuni) ──────────────────────────────
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
      available: !!quizQuestions,
      content: quizQuestions ? (
        <div className="prose max-w-none p-6">
          <h3>Quiz de {quizQuestions.length} preguntas</h3>
          <p className="text-sm text-[#1F2F58]/70">
            Quiz embebido proximamente. Por ahora ver enunciados en pestaña Teoria.
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
                const rt = (r.type || "link").toLowerCase();
                const type: ResourceType = (VALID_RESOURCE_TYPES as readonly string[]).includes(rt)
                  ? (rt as ResourceType)
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

  const moduleUrl = `/cursos-pro/c/${courseSlug}/m/${moduleSlug}`;
  const currentNumInModule = parseInt(num);

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="border-b border-[#1F2F58]/8 bg-white px-4 py-2 shadow-sm">
        <div className="hidden md:flex items-center gap-1 mb-1">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/dashboard" },
              { label: course.name, href: `/cursos-pro/c/${courseSlug}/sesion/1` },
              { label: `M${moduleData.num}`, href: moduleUrl },
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
                url: `/cursos-pro/c/${courseSlug}/m/${moduleSlug}/sesion/${prevSession.numInModule}`,
              }
            : null
        }
        nextSession={
          nextSession
            ? {
                title: nextSession.title,
                url: `/cursos-pro/c/${courseSlug}/m/${moduleSlug}/sesion/${nextSession.numInModule}`,
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
