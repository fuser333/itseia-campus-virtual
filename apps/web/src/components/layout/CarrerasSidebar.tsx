"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  TrendingUp,
  Calendar,
  BookOpen,
  Brain,
  Code2,
  BarChart2,
  FolderKanban,
  MessageCircle,
  CalendarDays,
  BookMarked,
  Rocket,
  Building2,
  ExternalLink,
  Download,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Wrench,
  Award,
  Lightbulb,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  external?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// ─── Static materias (hardcoded until dynamic enrollment is wired) ────────────

const MATERIAS_SEMESTRE: NavItem[] = [
  { href: "/carreras/materias/fundamentos-ia",      label: "Fundamentos de IA",       icon: Brain },
  { href: "/carreras/materias/matematicas-ia",      label: "Matemáticas para IA",     icon: BarChart2 },
  { href: "/carreras/materias/programacion-python", label: "Programación Python",      icon: Code2 },
  { href: "/carreras/materias/estadistica-aplicada",label: "Estadística Aplicada",     icon: TrendingUp },
  { href: "/carreras/materias/proyecto-integrador", label: "Proyecto Integrador I",   icon: FolderKanban },
];

// ─── Menu definition ──────────────────────────────────────────────────────────

const SECTIONS: NavSection[] = [
  {
    label: "MI CARRERA",
    items: [
      { href: "/carreras",           label: "Dashboard Carrera",   icon: LayoutDashboard },
      { href: "/carreras/progreso",  label: "Mi Progreso General", icon: TrendingUp },
      { href: "/carreras/semestre",  label: "Semestre Actual",     icon: Calendar },
      { href: "/carreras/malla",     label: "Malla Curricular",    icon: BookOpen },
    ],
  },
  {
    label: "MI SEMESTRE",
    items: MATERIAS_SEMESTRE,
  },
  {
    label: "COMUNIDAD",
    items: [
      {
        href: "https://wa.me/593959892034?text=Hola%2C%20necesito%20soporte%20con%20mi%20carrera",
        label: "Chat de Soporte",
        icon: MessageCircle,
        external: true,
      },
      { href: "/carreras/calendario", label: "Calendario Académico", icon: CalendarDays },
    ],
  },
  {
    label: "DESCUBRE ITSEIA",
    items: [
      { href: "/descubre/cursos-mdt",       label: "Cursos MDT (15)",         icon: BookMarked, badge: "15" },
      { href: "/descubre/cursos-pro",       label: "Cursos Profesionales",    icon: Wrench },
      { href: "/descubre/bootcamp",         label: "Bootcamp 120h",           icon: Rocket },
      { href: "/descubre/certificaciones",  label: "Certificaciones",         icon: Award },
      { href: "/descubre/preuniversitario", label: "Preuniversitario IGNITE", icon: Lightbulb },
      { href: "/b2b",                       label: "B2B Empresas",            icon: Building2 },
      {
        href: "https://h3l.ai",
        label: "H3L Diagnóstico IA",
        icon: ExternalLink,
        external: true,
      },
    ],
  },
  {
    label: "CUENTA",
    items: [
      { href: "/carreras/certificados", label: "Descargar Certificados", icon: Download },
      { href: "/payments",              label: "Mis Pagos",              icon: CreditCard },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Items in DESCUBRE ITSEIA get the sky-blue accent colour instead of gold. */
const DESCUBRE_LABEL = "DESCUBRE ITSEIA";

// ─── Component ────────────────────────────────────────────────────────────────

interface CarrerasSidebarProps {
  userName?: string;
  userEmail?: string;
}

export default function CarrerasSidebar({
  userName,
  userEmail,
}: CarrerasSidebarProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login?module=carrera");
    router.refresh();
  }

  function isActive(href: string): boolean {
    if (href.startsWith("http")) return false;
    if (href === "/carreras") return pathname === "/carreras";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "??";

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-[#0D1B30] border-r border-white/[0.06] transition-all duration-300 flex-shrink-0 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06] flex-shrink-0">
        <Link
          href="/carreras"
          className="flex items-center gap-2.5 group overflow-hidden"
        >
          {collapsed ? (
            <div className="w-9 h-9 rounded-lg bg-[#FBBC0C] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <BookOpen className="w-5 h-5 text-[#0A1628]" />
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
        {SECTIONS.map((section, sectionIndex) => {
          const isDescubre = section.label === DESCUBRE_LABEL;

          return (
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

                  // Descubre ITSEIA uses sky-blue tint; everything else uses gold.
                  const activeTextColor  = isDescubre ? "text-[#73B8E7]" : "text-[#FBBC0C]";
                  const activeBgColor    = isDescubre ? "bg-[#73B8E7]/[0.10]" : "bg-[#FBBC0C]/[0.12]";
                  const activeIconColor  = isDescubre ? "text-[#73B8E7]" : "text-[#FBBC0C]";
                  const activeDotColor   = isDescubre ? "bg-[#73B8E7]" : "bg-[#FBBC0C]";
                  const badgeBgColor     = isDescubre ? "bg-[#73B8E7]/15 text-[#73B8E7]" : "bg-[#FBBC0C]/15 text-[#FBBC0C]";

                  return (
                    <Link
                      key={`${item.href}-${item.label}`}
                      {...linkProps}
                      title={collapsed ? item.label : undefined}
                      className={`group flex items-center gap-3 rounded-lg transition-all duration-200 ${
                        collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
                      } ${
                        active
                          ? `${activeBgColor} ${activeTextColor}`
                          : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                          active
                            ? activeIconColor
                            : "text-white/50 group-hover:text-white/80"
                        }`}
                      />
                      {!collapsed && (
                        <span className="text-sm font-medium truncate flex-1 leading-none">
                          {item.label}
                        </span>
                      )}
                      {!collapsed && item.badge && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badgeBgColor} flex-shrink-0`}>
                          {item.badge}
                        </span>
                      )}
                      {!collapsed && item.external && (
                        <ExternalLink className="w-3 h-3 text-white/30 flex-shrink-0" />
                      )}
                      {active && !collapsed && (
                        <div className={`h-1.5 w-1.5 rounded-full ${activeDotColor} flex-shrink-0`} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
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
                {userName || userEmail || "Estudiante"}
              </p>
              <p className="text-[10px] text-white/40 truncate leading-tight mt-0.5">
                Carrera IA
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
