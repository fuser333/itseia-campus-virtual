"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Layers,
  FileText,
  Megaphone,
  HelpCircle,
  ClipboardCheck,
  BookMarked,
  BarChart3,
  MessageCircle,
  CalendarDays,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { PendingSubmissionsBadge } from "@/components/teacher/PendingSubmissionsBadge";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: "pending_submissions";
  external?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// ─── Menu definition ──────────────────────────────────────────────────────────
//
// Las rutas se definen como sufijos relativos al `basePath` que recibe el
// componente. Default = "/teacher" (mantiene compatibilidad con el sidebar
// que YA usa Héctor para clases en vivo de preuni). Cuando se monte en el
// shell nuevo /docente/preuni, se pasa basePath="/docente/preuni".
//
// Las páginas globales del docente (configuración / capacitación / etc.)
// usan path absoluto fuera del basePath cuando aplique.

interface SectionDef {
  label: string;
  items: Array<{
    suffix: string;            // sufijo relativo al basePath ("" = root)
    isGlobal?: boolean;        // true → usa globalsBase en lugar de basePath
    absolutePath?: string;     // si se setea, ignora basePath/globalsBase
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: "pending_submissions";
    external?: boolean;
  }>;
}

const SECTION_DEFS: SectionDef[] = [
  {
    label: "PANEL DOCENTE",
    items: [
      { suffix: "",          label: "Dashboard Docente",    icon: LayoutDashboard },
      { suffix: "/materias", label: "Mis Cursos Asignados", icon: BookOpen },
      { suffix: "/progreso", label: "Mis Estudiantes",      icon: Users },
    ],
  },
  {
    label: "CONTENIDO",
    items: [
      { suffix: "/materias",     label: "Gestionar Módulos",  icon: Layers },
      { suffix: "/material",     label: "Material del Curso", icon: FileText },
      { suffix: "/comunicacion", label: "Anuncios",           icon: Megaphone },
    ],
  },
  {
    label: "EVALUACIONES",
    items: [
      { suffix: "/banco-preguntas", label: "Banco de Preguntas",  icon: HelpCircle },
      { suffix: "/quiz",            label: "Crear Quiz / Examen", icon: ClipboardCheck },
      { suffix: "/entregas",        label: "Calificaciones",      icon: BookMarked, badge: "pending_submissions" },
    ],
  },
  {
    label: "SEGUIMIENTO",
    items: [
      { suffix: "/asistencia", label: "Libro de Calificaciones", icon: BookMarked },
      { suffix: "/analytics",  label: "Analytics Estudiantes",   icon: BarChart3 },
    ],
  },
  {
    label: "CUENTA",
    items: [
      {
        suffix: "",
        absolutePath: "https://wa.me/593959892034?text=Hola%2C%20necesito%20soporte%20docente",
        label: "Chat Soporte",
        icon: MessageCircle,
        external: true,
      },
      { suffix: "/programar-clases", label: "Mi Calendario",   icon: CalendarDays },
      { suffix: "/configuracion",    label: "Configuración",   icon: Settings, isGlobal: true },
    ],
  },
];

/**
 * Deriva el path raíz para items globales del docente (configuración, etc.).
 * - basePath "/teacher" → globalsBase "/teacher" (legacy, mantenemos todo bajo /teacher)
 * - basePath "/docente/preuni" → globalsBase "/docente" (items globales van fuera del curso)
 */
function deriveGlobalsBase(basePath: string): string {
  if (basePath === "/teacher") return "/teacher";
  // strip último segmento: /docente/preuni → /docente
  const parts = basePath.split("/").filter(Boolean);
  if (parts.length > 1) return "/" + parts.slice(0, -1).join("/");
  return basePath;
}

function buildSections(basePath: string): NavSection[] {
  const globalsBase = deriveGlobalsBase(basePath);
  return SECTION_DEFS.map((s) => ({
    label: s.label,
    items: s.items.map((it) => {
      const root = it.isGlobal ? globalsBase : basePath;
      return {
        href: it.absolutePath || `${root}${it.suffix}`,
        label: it.label,
        icon: it.icon,
        badge: it.badge,
        external: it.external,
      };
    }),
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface DocentesSidebarProps {
  userName?: string;
  userRole?: string;
  /**
   * Prefijo de rutas a generar (por defecto `/teacher` para compat con la
   * vista legacy). Cuando se monte en `/docente/preuni`, pasarlo aquí para
   * que cada item del menú apunte a la versión nueva sin duplicar componente.
   */
  basePath?: string;
}

export default function DocentesSidebar({
  userName,
  userRole = "Docente",
  basePath = "/teacher",
}: DocentesSidebarProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Sections con basePath aplicado (memoizable trivial; basePath es estable
  // para la vida del shell)
  const SECTIONS: NavSection[] = buildSections(basePath);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string): boolean {
    if (href.startsWith("http")) return false;
    if (href === basePath) return pathname === basePath;
    return pathname === href || pathname.startsWith(href + "/");
  }

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DO";

  const displayRole = userRole
    ? userRole.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Docente";

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-[#0D1B30] border-r border-white/[0.06] transition-all duration-300 flex-shrink-0 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06] flex-shrink-0">
        <Link
          href={basePath}
          className="flex items-center gap-2.5 group overflow-hidden"
        >
          {collapsed ? (
            <div className="w-9 h-9 rounded-lg bg-[#FBBC0C] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <GraduationCap className="w-5 h-5 text-[#0A1628]" />
            </div>
          ) : (
            <img
              src="/logo_itseia.svg"
              alt="ITSEIA"
              className="h-8 w-auto"
            />
          )}
        </Link>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3">
        {SECTIONS.map((section, sectionIndex) => (
          <div
            key={`${section.label}-${sectionIndex}`}
            className={sectionIndex > 0 ? "mt-6" : ""}
          >
            {/* Section header */}
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 select-none">
                {section.label}
              </p>
            )}
            {collapsed && sectionIndex > 0 && (
              <div className="mx-2 mb-3 border-t border-white/[0.06]" />
            )}

            {/* Items */}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon   = item.icon;
                const active = isActive(item.href);

                const linkProps = item.external
                  ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                  : { href: item.href };

                return (
                  <Link
                    key={`${item.href}-${item.label}`}
                    {...linkProps}
                    title={collapsed ? item.label : undefined}
                    className={`group flex items-center gap-3 rounded-lg transition-all duration-200 ${
                      collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
                    } ${
                      active
                        ? "bg-[#FBBC0C]/[0.12] text-[#FBBC0C]"
                        : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                        active
                          ? "text-[#FBBC0C]"
                          : "text-white/50 group-hover:text-white/80"
                      }`}
                    />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate flex-1 leading-none">
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge === "pending_submissions" && (
                      <PendingSubmissionsBadge />
                    )}
                    {!collapsed && item.external && (
                      <ExternalLink className="w-3 h-3 text-white/30 flex-shrink-0" />
                    )}
                    {active && !collapsed && (
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FBBC0C] flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User & collapse toggle ──────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] p-3 flex-shrink-0">

        {/* Expanded: name + role + logout */}
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#1F2F58] flex items-center justify-center flex-shrink-0 ring-2 ring-[#FBBC0C]/20">
              <span className="text-xs font-bold text-[#FBBC0C]">
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate leading-tight">
                {userName || "Docente"}
              </p>
              <p className="text-[10px] text-white/40 truncate leading-tight mt-0.5">
                {displayRole}
              </p>
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

        {/* Collapsed: only logout icon */}
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

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
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
