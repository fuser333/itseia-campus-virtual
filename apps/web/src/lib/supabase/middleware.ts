import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  isPublicPath,
  isProtectedPath,
  isPrivilegedRole,
  evaluateAccess,
  type UserAuthMeta,
} from "@/lib/auth/access";

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
      try {
        await Promise.race([
          supabase.auth.getUser(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("auth-timeout")), 1500)
          ),
        ]);
      } catch {
        // Si falla/timeout, seguimos sin sesión refrescada.
        // El próximo request retrocederá al login si la sesión expiró.
      }
    }
    return supabaseResponse;
  }

  // ── 2. Obtener usuario ────────────────────────────────────────────────────
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

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
  const { data: dbProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

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
