import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  isPublicPath,
  isProtectedPath,
  isPrivilegedRole,
  evaluateAccess,
  type UserAuthMeta,
} from "@/lib/auth/access";

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
    // Aún así refrescamos la sesión si existe (SSR cookie sync)
    await supabase.auth.getUser();
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

  // ── 5. Admin/staff: bypass completo de restricciones por track ────────────
  if (isPrivilegedRole(meta)) {
    // Redirigir lejos de login/register si ya están autenticados
    if (pathname === "/login" || pathname === "/register") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Admin routes: verificar role en DB (doble check para /admin)
    if (pathname.startsWith("/admin")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (
        !profile ||
        !["super_admin", "admin", "coordinacion"].includes(profile.role as string)
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }

    // Teacher routes: verificar role en DB
    if (pathname.startsWith("/teacher") || pathname.startsWith("/docente")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (
        !profile ||
        !["super_admin", "admin", "coordinacion", "docente"].includes(
          profile.role as string
        )
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  }

  // ── 6. Usuarios autenticados fuera de login/register ─────────────────────
  if (pathname === "/login" || pathname === "/register") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // ── 7. Evaluación de acceso por track ─────────────────────────────────────
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
