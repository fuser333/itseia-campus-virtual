/**
 * Layout de Cursos Profesionales · Campus v2.
 *
 * Usa CursosProSidebarClient (sidebar propio del producto) que muestra:
 *  · Módulos con fechas y sesiones colapsables
 *  · Cross-promo DESCUBRE ITSEIA (sin cursos-pro que es el activo)
 *  · Footer con avatar + nombre alumna + rol CURSOS PRO
 *
 * Los módulos y sesiones se cargan server-side y se pasan como props al
 * Client Component del sidebar.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import CursosProSidebarClient, {
  type ModuloInfo,
  type SesionInfo,
} from "@/components/cursos-pro/CursosProSidebarClient";

// Helper: "6 jun" format
function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-EC", { day: "numeric", month: "short" });
}

// Mapa estático fallback: num → slug (para cuando columna slug aún no existe en BD)
const MODULE_NUM_TO_SLUG: Record<number, string> = {
  1: "m1-fundamentos-ia-lopdp",
  2: "m2-stack-profesional-ia",
  3: "m3-gestion-operativa-ia",
  4: "m4-facturacion-power-bi-cierre",
};

export default async function CursosProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login?module=cursos-pro");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? "estudiante";

  if (["super_admin", "admin", "coordinacion"].includes(role)) {
    redirect("/admin");
  }
  if (role === "docente") {
    redirect("/docente");
  }

  const fullName =
    (profile?.full_name as string | undefined) ??
    (profile?.email as string | undefined)?.split("@")[0] ??
    "Estudiante";

  // ── Cargar el curso activo del alumno + módulos + sesiones ───────────────────
  // Buscar el primer enrollment activo del alumno en cursos-pro
  const { data: enrollmentRow } = await supabaseAdmin
    .from("cursos_pro_enrollments")
    .select("course_id")
    .eq("profile_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let modulos: ModuloInfo[] = [];
  let courseSlug = "";
  let courseName = "Curso Profesional";

  if (enrollmentRow?.course_id) {
    // Cargar datos del curso
    const { data: courseRow } = await supabaseAdmin
      .from("cursos_pro_courses")
      .select("slug, name")
      .eq("id", enrollmentRow.course_id)
      .maybeSingle();

    courseSlug = (courseRow?.slug as string | undefined) ?? "";
    courseName = (courseRow?.name as string | undefined) ?? "Curso Profesional";

    // Cargar módulos
    const { data: modulosRows } = await supabaseAdmin
      .from("cursos_pro_modules")
      .select("id, num, name, slug")
      .eq("course_id", enrollmentRow.course_id)
      .order("num", { ascending: true });

    if (modulosRows && modulosRows.length > 0) {
      // Cargar sesiones de todos los módulos en paralelo
      const moduloIds = modulosRows.map((m: { id: string }) => m.id);

      const { data: sesionesRows } = await supabaseAdmin
        .from("cursos_pro_sessions")
        .select("id, module_id, num, num_in_module, title, scheduled_at, status")
        .in("module_id", moduloIds)
        .order("num", { ascending: true });

      // Agrupar sesiones por módulo
      const sesionesByModulo = new Map<string, typeof sesionesRows>();
      for (const s of sesionesRows ?? []) {
        const key = (s as { module_id: string }).module_id;
        const arr = sesionesByModulo.get(key) ?? [];
        arr.push(s);
        sesionesByModulo.set(key, arr);
      }

      modulos = modulosRows.map((m: {
        id: string;
        num: number;
        name: string;
        slug: string | null;
      }) => {
        const mSesiones = sesionesByModulo.get(m.id) ?? [];

        // Calcular rango de fechas del módulo
        const fechas = mSesiones
          .map((s: { scheduled_at: string }) => s.scheduled_at)
          .filter(Boolean)
          .sort();
        const dateRange =
          fechas.length > 0
            ? `${shortDate(fechas[0])} - ${shortDate(fechas[fechas.length - 1])}`
            : "Por confirmar";

        const sesiones: SesionInfo[] = mSesiones.map((s: {
          id: string;
          num: number;
          num_in_module: number | null;
          title: string;
          scheduled_at: string;
          status: "scheduled" | "live" | "done" | "cancelled";
        }) => {
          const numInMod = s.num_in_module ?? s.num;
          const effectiveSlug = m.slug ?? MODULE_NUM_TO_SLUG[m.num];
          const href = effectiveSlug
            ? `/cursos-pro/${courseSlug}/modulo/${effectiveSlug}/sesion/${numInMod}`
            : `/cursos-pro/c/${courseSlug}/sesion/${s.num}`;
          return {
            id: s.id,
            numInModule: numInMod,
            title: s.title,
            scheduledAt: s.scheduled_at,
            status: s.status,
            href,
          };
        });

        return {
          id: m.id,
          num: m.num,
          name: m.name,
          slug: m.slug,
          dateRange,
          sesiones,
        };
      });
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A1628]">
      <CursosProSidebarClient
        courseSlug={courseSlug}
        courseName={courseName}
        modulos={modulos}
        userName={fullName}
        userEmail={user.email ?? undefined}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
