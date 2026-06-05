"use client";

/**
 * Sidebar del Area Docente · Route group (docentes) · Campus v2.
 *
 * Sidebar PROPIO del area /docentes — NO toca /teacher ni (docente).
 * Concepto "LIBRO PROFESOR": area interna de gestion, no de venta.
 *
 * Secciones:
 *  1. AREA DOCENTE: Mis cursos, Mis alumnos, Mi calendario, Mis pagos
 *  2. CURSO ACTIVO (cuando hay courseSlug en pathname): Modulos + Alumnos + Analitica
 *  3. CUENTA: Mi cuenta docente, Recursos docentes, Cerrar sesion
 *
 * Accent color: coral #F0846D (diferencia visualmente de alumno-gold y admin-blue)
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  UserCircle,
  BookOpen,
  BarChart2,
  BookMarked,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModuloSidebarInfo {
  num: number;
  name: string;
  slug: string | null;
}

interface Props {
  userName: string;
  userEmail?: string;
  totalCursos: number;
  totalAlumnos: number;
  activeCourse?: {
    slug: string;
    name: string;
    modulos: ModuloSidebarInfo[];
  } | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DocentesAreaSidebar({
  userName,
  userEmail,
  totalCursos,
  totalAlumnos,
  activeCourse,
}: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const [collapsed, setCollapsed] = useState(false);
  const [modulosOpen, setModulosOpen] = useState(true);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login?module=docentes");
    router.refresh();
  }

  function isActive(href: string): boolean {
    if (href === "/docentes") return pathname === "/docentes";
    return pathname === href || pathname.startsWith(href + "/");
  }

  // Detectar curso activo desde el pathname
  const segments = pathname.split("/").filter(Boolean);
  const activeCourseSlug =
    segments.length >= 2 && segments[0] === "docentes" ? segments[1] : null;
  const ROOT_SLUGS = new Set(["alumnos", "calendario", "pagos", "perfil", "recursos"]);
  const hasCourseActive = activeCourseSlug && !ROOT_SLUGS.has(activeCourseSlug);

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-[#0A1628] border-r border-white/[0.06] transition-all duration-300 flex-shrink-0 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06] flex-shrink-0">
        <Link href="/docentes" className="flex items-center gap-2.5 group overflow-hidden">
          {collapsed ? (
            <div className="w-9 h-9 rounded-lg bg-[#F0846D] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <BookMarked className="w-5 h-5 text-white" />
            </div>
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg bg-[#F0846D] flex items-center justify-center flex-shrink-0">
                <BookMarked className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white truncate">
                Area Docente
              </span>
            </>
          )}
        </Link>
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3 space-y-6">

        {/* Seccion 1: AREA DOCENTE */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 select-none">
              Area Docente
            </p>
          )}
          <div className="space-y-0.5">
            <NavLink
              href="/docentes"
              label="Mis cursos"
              icon={LayoutDashboard}
              badge={totalCursos > 0 ? String(totalCursos) : undefined}
              active={pathname === "/docentes"}
              collapsed={collapsed}
            />
            <NavLink
              href="/docentes/alumnos"
              label="Mis alumnos"
              icon={Users}
              badge={totalAlumnos > 0 ? String(totalAlumnos) : undefined}
              active={isActive("/docentes/alumnos")}
              collapsed={collapsed}
            />
            <NavLink
              href="/docentes/calendario"
              label="Mi calendario"
              icon={Calendar}
              active={isActive("/docentes/calendario")}
              collapsed={collapsed}
            />
            <NavLink
              href="/docentes/pagos"
              label="Mis pagos"
              icon={CreditCard}
              active={isActive("/docentes/pagos")}
              collapsed={collapsed}
            />
          </div>
        </div>

        {/* Seccion 2: CURSO ACTIVO (solo cuando hay courseSlug y no es slug raiz) */}
        {hasCourseActive && activeCourse && !collapsed && (
          <div>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#F0846D]/70 select-none truncate">
              Curso activo
            </p>
            <p className="px-3 mb-2 text-xs font-bold text-white/60 truncate">
              {activeCourse.name}
            </p>
            <div className="space-y-0.5">
              {/* Modulos acordeon */}
              <button
                onClick={() => setModulosOpen((v) => !v)}
                className="w-full group flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
              >
                <BookOpen className="w-[18px] h-[18px] flex-shrink-0 text-white/50 group-hover:text-white/80 transition-colors" />
                <span className="text-sm font-medium truncate flex-1 leading-none text-left">
                  Modulos
                </span>
                {modulosOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                )}
              </button>

              {modulosOpen && activeCourse.modulos.length > 0 && (
                <div className="mt-0.5 ml-3 pl-3 border-l border-white/[0.06] space-y-0.5">
                  {activeCourse.modulos.map((m) => {
                    const href = m.slug
                      ? `/docentes/${activeCourse.slug}/modulo/${m.slug}`
                      : `/docentes/${activeCourse.slug}`;
                    const active = isActive(href);
                    return (
                      <Link
                        key={m.num}
                        href={href}
                        className={`group flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 ${
                          active
                            ? "bg-[#F0846D]/[0.12] text-[#F0846D]"
                            : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="text-xs font-medium truncate flex-1 leading-none">
                          M{m.num}: {m.name}
                        </span>
                        {active && (
                          <div className="h-1.5 w-1.5 rounded-full bg-[#F0846D] flex-shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}

              <NavLink
                href={`/docentes/${activeCourse.slug}/alumnos`}
                label="Alumnos del curso"
                icon={Users}
                active={isActive(`/docentes/${activeCourse.slug}/alumnos`)}
                collapsed={false}
              />
              <NavLink
                href={`/docentes/${activeCourse.slug}/analitica`}
                label="Analitica del curso"
                icon={BarChart2}
                active={isActive(`/docentes/${activeCourse.slug}/analitica`)}
                collapsed={false}
              />
            </div>
          </div>
        )}

        {/* Seccion 3: CUENTA */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 select-none">
              Cuenta
            </p>
          )}
          <div className="space-y-0.5">
            <NavLink
              href="/docentes/perfil"
              label="Mi cuenta docente"
              icon={UserCircle}
              active={isActive("/docentes/perfil")}
              collapsed={collapsed}
            />
            <NavLink
              href="/docentes/recursos"
              label="Recursos docentes"
              icon={BookOpen}
              active={isActive("/docentes/recursos")}
              collapsed={collapsed}
            />
          </div>
        </div>
      </nav>

      {/* ── User footer ──────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] p-3 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#1F2F58] flex items-center justify-center flex-shrink-0 ring-2 ring-[#F0846D]/20">
              <span className="text-xs font-bold text-[#F0846D]">
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate leading-tight">
                {userName}
              </p>
              {userEmail && (
                <p className="text-[10px] text-white/40 truncate leading-tight mt-0.5">
                  {userEmail}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-white/40 hover:text-[#F0846D] hover:bg-[#F0846D]/10 transition-colors flex-shrink-0"
              aria-label="Cerrar sesion"
              title="Cerrar sesion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center mb-3">
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-white/40 hover:text-[#F0846D] hover:bg-[#F0846D]/10 transition-colors"
              aria-label="Cerrar sesion"
              title="Cerrar sesion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={`w-full flex items-center gap-2 rounded-lg py-2 text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
          aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Colapsar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

// ─── NavLink helper ───────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  icon: Icon,
  badge,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`group flex items-center gap-3 rounded-lg transition-all duration-200 ${
        collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
      } ${
        active
          ? "bg-[#F0846D]/[0.12] text-[#F0846D]"
          : "text-white/70 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <Icon
        className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
          active ? "text-[#F0846D]" : "text-white/50 group-hover:text-white/80"
        }`}
      />
      {!collapsed && (
        <span className="text-sm font-medium truncate flex-1 leading-none">
          {label}
        </span>
      )}
      {!collapsed && badge && (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#F0846D]/15 text-[#F0846D] flex-shrink-0">
          {badge}
        </span>
      )}
      {active && !collapsed && (
        <div className="h-1.5 w-1.5 rounded-full bg-[#F0846D] flex-shrink-0" />
      )}
    </Link>
  );
}
