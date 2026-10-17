import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  isPublicPath,
  isProtectedPath,
  isPrivilegedRole,
  evaluateAccess,
  type UserAuthMeta,
} from "@/lib/auth/access";

// Tipos mínimos para timeout race (evita import directo de @supabase/supabase-js
// que añade peso al bundle del middleware).
interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: { role?: string; track?: string } & Record<string, unknown>;
}
interface AuthErrorLike {
  message: string;
}

/**
 * Resuelve la "home" preferida para un role privilegiado.
 * FASE 5: super_admin/admin/coordinacion → /admin (compat) · docente → /docente.
 */
function homeForPrivilegedRole(role: string | undefined): string {
  if (role === "docente") return "/docente";
  if (role && ["super_admin", "admin", "coordinacion"].includes(role)) {
    return "/admin";
  }
  // Fallback defensivo: si es privileged por otro role (staff/finanzas) → admin.
  return "/admin";
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // ── 1. Rutas públicas: siempre pasar sin sesión ──────────────────────────
  if (isPublicPath(pathname)) {
    // FIX 4 jun 2026 — middleware timeout en /cursos-pro-info y otras públicas.
    // No refrescar sesión si no hay cookies de Supabase (visita anónima).
    // Si hay cookies, refrescamos con timeout corto para no exceder
    // los 5s de Vercel middleware budget.
    const hasSupabaseCookie = request.cookies
      .getAll()
      .some((c) => c.name.startsWith("sb-"));
    if (hasSupabaseCookie) {
      // FIX 5-jun-2026: consistencia con la rama protegida (líneas 90+) —
      // usar AbortController + clearTimeout para no dejar timers huérfanos.
      const pubAbort = new AbortController();
      const pubTimeoutId = setTimeout(() => pubAbort.abort(), 1200);
      try {
        await Promise.race([
          supabase.auth.getUser(),
          new Promise((_, reject) => {
            pubAbort.signal.addEventListener("abort", () =>
              reject(new Error("auth-timeout"))
            );
          }),
        ]);
      } catch (e) {
        // Si falla/timeout, seguimos sin sesión refrescada.
        // El próximo request retrocederá al login si la sesión expiró.
        if (process.env.NODE_ENV !== "production") {
          console.warn("[middleware] public-path auth refresh timeout/error:", e);
        }
      } finally {
        clearTimeout(pubTimeoutId);
      }
    }
    return supabaseResponse;
  }

  // ── 2. Obtener usuario (timeout 1200ms vía AbortController) ──────────────
  // FIX 5-jun-2026: sin timeout, si Supabase tarda el middleware se cuelga 40s
  // y agota workers — contagia rutas no relacionadas (/preuni, /dashboard).
  // Notas del review (REVIEW_FASE_0.md):
  //  · AbortController + clearTimeout en lugar de setTimeout bare (Edge runtime)
  //  · .catch() dentro del race para capturar throws no resolves
  //  · console.warn para visibilidad en Vercel Logs
  //  · 1200ms × 2 awaits ≤ 2400ms — deja margen ante budget 5s
  type AuthResult = { user: AuthUser | null; error: AuthErrorLike | null };
  let user: AuthUser | null = null;
  let authError: AuthErrorLike | null = null;

  const authAbort = new AbortController();
  const authTimeoutId = setTimeout(() => authAbort.abort(), 1200);
  try {
    const result = await Promise.race<AuthResult>([
      supabase.auth
        .getUser()
        .then((r): AuthResult => ({
          user: (r.data.user ?? null) as AuthUser | null,
          error: (r.error ?? null) as AuthErrorLike | null,
        }))
        .catch((e: unknown): AuthResult => ({
          user: null,
          error: { message: e instanceof Error ? e.message : "auth-failed" },
        })),
      new Promise<AuthResult>((_, reject) => {
        authAbort.signal.addEventListener("abort", () =>
          reject(new Error("auth-timeout"))
        );
      }),
    ]);
    user = result.user;
    authError = result.error;
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[middleware] auth getUser timeout/error:", e);
    }
    user = null;
    authError = { message: e instanceof Error ? e.message : "auth-timeout" };
  } finally {
    clearTimeout(authTimeoutId);
  }

  // ── 3. Sin sesión → login con redirect ────────────────────────────────────
  if (!user || authError) {
    if (isProtectedPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      // Preservar destino para redirect post-login
      url.searchParams.set("redirect", pathname);
      // Sesión vencida: añadir indicador para que el cliente muestre mensaje
      if (authError) {
        url.searchParams.set("expired", "1");
      }
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // ── 4. Construir metadata del usuario ─────────────────────────────────────
  // FIX (30 may 2026): leer profiles.role como ÚNICA fuente de verdad.
  // Antes leíamos de user_metadata.role, que solo se llena si se setea
  // explícitamente con auth.admin.updateUserById. Esa desincronización con
  // profiles.role causaba un loop infinito de redirects /admin ↔ /dashboard
  // para super_admins cuyo user_metadata.role estaba vacío.
  // Mantenemos user_metadata.role como fallback por compatibilidad.
  // Ver: DEPARTAMENTOS/08_TECNOLOGIA_INNOVACION/AUDITORIA_CAMPUS_30MAY_2026.md
  //
  // FIX 5-jun-2026: timeout 1200ms via AbortController — esta query había
  // contribuido al cuelgue masivo de /preuni /dashboard /cursos-pro al saturar
  // el pool de Supabase.
  type ProfileResult = { data: { role?: string } | null };
  let dbProfile: { role?: string } | null = null;

  const profileAbort = new AbortController();
  const profileTimeoutId = setTimeout(() => profileAbort.abort(), 1200);
  try {
    // Envolver en Promise.resolve para tener acceso a .catch (PostgrestBuilder
    // es PromiseLike sin .catch nativo).
    const profileQuery: Promise<ProfileResult> = Promise.resolve(
      supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .abortSignal(profileAbort.signal)
        .single()
    )
      .then((r): ProfileResult => ({
        data: (r.data as { role?: string } | null) ?? null,
      }))
      .catch((): ProfileResult => ({ data: null }));

    const profileResult = await Promise.race<ProfileResult>([
      profileQuery,
      new Promise<ProfileResult>((_, reject) => {
        profileAbort.signal.addEventListener("abort", () =>
          reject(new Error("profile-timeout"))
        );
      }),
    ]);
    dbProfile = profileResult.data;
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[middleware] profile timeout/error:", e);
    }
    dbProfile = null;
  } finally {
    clearTimeout(profileTimeoutId);
  }

  const meta: UserAuthMeta = {
    role:
      (dbProfile?.role as string | undefined) ??
      (user.user_metadata?.role as string | undefined) ??
      undefined,
    track: (user.user_metadata?.track as string | undefined) ?? undefined,
  };

  // ── 5. Admin/staff: bypass de restricciones por track ─────────────────────
  if (isPrivilegedRole(meta)) {
    // Redirigir lejos de login/register si ya están autenticados.
    // FASE 5: enrutar a la home del role en vez de /dashboard ciego.
    if (pathname === "/login" || pathname === "/register") {
      const url = request.nextUrl.clone();
      url.pathname = homeForPrivilegedRole(meta.role);
      return NextResponse.redirect(url);
    }

    // /admin: solo super_admin/admin/coordinacion. Docente puro → /docente.
    if (pathname.startsWith("/admin")) {
      if (
        !meta.role ||
        !["super_admin", "admin", "coordinacion"].includes(meta.role)
      ) {
        const url = request.nextUrl.clone();
        url.pathname = homeForPrivilegedRole(meta.role);
        return NextResponse.redirect(url);
      }
    }

    // /teacher | /docente: super_admin/admin/coordinacion/docente.
    if (pathname.startsWith("/teacher") || pathname.startsWith("/docente")) {
      if (
        !meta.role ||
        !["super_admin", "admin", "coordinacion", "docente"].includes(meta.role)
      ) {
        const url = request.nextUrl.clone();
        url.pathname = homeForPrivilegedRole(meta.role);
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  }

  // ── 6. Usuarios autenticados NO privileged que llegan a /login o /register
  // FASE 5: el routing inteligente (post-login-redirect) lo decide el form
  //         del lado cliente con fetch a /api/auth/post-login-redirect.
  //         Si llegan acá ya autenticados (cookie viva), los mandamos a
  //         /dashboard como fallback predecible.
  if (pathname === "/login" || pathname === "/register") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // ── 7. Bloqueo duro para estudiantes que intentan entrar a /admin /docente
  // /teacher (rutas privilegiadas). Defense in depth: los layouts (alumno)/
  // (docente) ya filtran, pero las rutas legacy /admin y /docente legacy NO
  // tienen guard universal de role en su layout.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/docente") ||
    pathname.startsWith("/teacher")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // ── 8. Evaluación de acceso por track (rutas de producto) ─────────────────
  const accessResult = evaluateAccess(pathname, meta);

  if (accessResult !== null && !accessResult.allowed) {
    const url = request.nextUrl.clone();
    url.pathname = accessResult.redirect;
    // Limpiar query params para no filtrar info sensible
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
