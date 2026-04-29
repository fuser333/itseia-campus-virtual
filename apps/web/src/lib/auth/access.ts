/**
 * ITSEIA — Lógica de control de acceso por track de estudiante.
 *
 * Esta capa es consumida ÚNICAMENTE por el middleware de Next.js.
 * No importar en componentes de cliente ni en Server Components: usar
 * el middleware directamente para decisiones de ruta.
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type StudentTrack =
  | "preuniversitario"
  | "carrera"
  | "curso_mdt"
  | "curso_pro"
  | "bootcamp"
  | "certificacion"
  | string; // extensible sin romper el tipado

export type PrivilegedRole = "admin" | "staff" | "super_admin" | "coordinacion" | "docente" | "finanzas";

/** Metadata proveniente de Supabase auth.user.user_metadata */
export interface UserAuthMeta {
  role?: string;
  track?: string;
}

// ─── Reglas de acceso por ruta ────────────────────────────────────────────────

/**
 * Cada regla define:
 *   match     — prefijo de ruta protegida
 *   allowed   — función que decide si el track/role tiene acceso
 *   redirect  — a dónde redirigir si NO tiene acceso
 */
export interface AccessRule {
  match: string;
  allowed: (meta: UserAuthMeta) => boolean;
  redirect: string;
}

// Tracks que implican acceso a carreras formales (3 años)
const CARRERA_TRACKS: StudentTrack[] = ["carrera"];

/** Devuelve true si el usuario tiene un rol privilegiado (admin, staff, docente…) */
export function isPrivilegedRole(meta: UserAuthMeta): boolean {
  const role = meta.role ?? "";
  const PRIVILEGED: PrivilegedRole[] = [
    "admin",
    "staff",
    "super_admin",
    "coordinacion",
    "docente",
    "finanzas",
  ];
  return (PRIVILEGED as string[]).includes(role);
}

/**
 * Tabla de reglas ordenadas de más específica a menos específica.
 *
 * Orden importante:
 *   1. /carreras/preuniversitario-ia  → abierta para preuni + carreras + privilegiados
 *   2. /carreras                       → solo carrera + privilegiados
 *   3. /cursos-mdt                     → solo curso_mdt
 *   4. /cursos-pro                     → solo curso_pro
 *   5. /bootcamp                       → solo bootcamp
 *   6. /certificaciones                → solo certificacion
 */
export const ACCESS_RULES: AccessRule[] = [
  // Módulo preuniversitario dentro de carreras — permitido a preuni y carrera
  {
    match: "/carreras/preuniversitario-ia",
    allowed: (meta) =>
      isPrivilegedRole(meta) ||
      meta.track === "preuniversitario" ||
      (CARRERA_TRACKS as string[]).includes(meta.track ?? ""),
    redirect: "/descubre/carreras",
  },

  // Sección general de carreras — solo tracks de carrera formal
  {
    match: "/carreras",
    allowed: (meta) =>
      isPrivilegedRole(meta) ||
      (CARRERA_TRACKS as string[]).includes(meta.track ?? ""),
    redirect: "/descubre/carreras",
  },

  // Cursos MDT
  {
    match: "/cursos-mdt",
    allowed: (meta) =>
      isPrivilegedRole(meta) || meta.track === "curso_mdt",
    redirect: "/descubre/cursos-mdt",
  },

  // Cursos Pro
  {
    match: "/cursos-pro",
    allowed: (meta) =>
      isPrivilegedRole(meta) || meta.track === "curso_pro",
    redirect: "/descubre/cursos-pro",
  },

  // Bootcamp
  {
    match: "/bootcamp",
    allowed: (meta) =>
      isPrivilegedRole(meta) || meta.track === "bootcamp",
    redirect: "/descubre/bootcamp",
  },

  // Certificaciones
  {
    match: "/certificaciones",
    allowed: (meta) =>
      isPrivilegedRole(meta) || meta.track === "certificacion",
    redirect: "/descubre/certificaciones",
  },
];

/**
 * Evalúa si un pathname está cubierto por alguna regla de acceso y, en ese
 * caso, si el usuario tiene permiso. Devuelve null si ninguna regla aplica
 * (ruta no restringida por track).
 *
 * @returns null si no aplica ninguna regla
 * @returns { allowed: true } si aplica y tiene acceso
 * @returns { allowed: false, redirect: string } si aplica y NO tiene acceso
 */
export function evaluateAccess(
  pathname: string,
  meta: UserAuthMeta
): { allowed: true } | { allowed: false; redirect: string } | null {
  for (const rule of ACCESS_RULES) {
    if (pathname.startsWith(rule.match)) {
      if (rule.allowed(meta)) {
        return { allowed: true };
      }
      return { allowed: false, redirect: rule.redirect };
    }
  }
  return null; // ninguna regla de track aplica
}

// ─── Rutas públicas (sin autenticación requerida) ─────────────────────────────

export const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/signup",
  "/verify",
  "/apply",
  "/pricing",
  "/programs",
  "/privacidad",
  "/error",
  "/descubre",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  // Páginas informativas públicas
  "/carreras-info",
  "/preuni-info",
  "/cursos-mdt-info",
  "/cursos-pro-info",
  "/bootcamp-info",
  "/certificaciones-info",
  "/docentes-info",
  "/empresas-info",
  "/demo-info",
  "/catalogo",
  "/preuniversitario",
];

/** Devuelve true si el pathname es una ruta pública (no requiere sesión) */
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
}

// ─── Rutas protegidas por sesión (requieren estar logueado) ───────────────────

export const PROTECTED_PATHS = [
  "/dashboard",
  "/courses",
  "/ai-lab",
  "/profile",
  "/payments",
  "/certificates",
  "/admin",
  "/teacher",
  "/biblioteca",
  "/carreras",
  "/cohorte",
  "/portfolio",
  "/flashcards",
  "/b2b",
  "/preuni",
  "/mi-curso",
  "/foros",
  "/certificaciones",
  "/calendario",
  "/cursos-mdt",
  "/cursos-pro",
  "/bootcamp",
  "/checkout",
];

/** Devuelve true si el pathname requiere sesión activa */
export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname.startsWith(p));
}
