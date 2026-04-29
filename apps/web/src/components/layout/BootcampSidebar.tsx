"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  TrendingUp,
  Calendar,
  Code2,
  BarChart2,
  Brain,
  Layers,
  MoreHorizontal,
  FolderKanban,
  GraduationCap,
  BookMarked,
  BookOpen,
  Rocket,
  Building2,
  MessageCircle,
  Download,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
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
  collapsible?: boolean;
  collapsedLabel?: string;
  hiddenCount?: number;
}

// ─── Menu definition ──────────────────────────────────────────────────────────

const MODULOS_HIDDEN_COUNT = 8; // M5–M12 hidden behind "show more"

const SECTIONS: NavSection[] = [
  {
    label: "MI BOOTCAMP",
    items: [
      { href: "/bootcamp",           label: "Dashboard Bootcamp", icon: LayoutDashboard },
      { href: "/bootcamp/progreso",  label: "Mi Progreso",        icon: TrendingUp },
      { href: "/bootcamp/calendario",label: "Calendario (12 semanas)", icon: Calendar },
    ],
  },
  {
    label: "CONTENIDO (12 MÓDULOS)",
    collapsible: true,
    hiddenCount: MODULOS_HIDDEN_COUNT,
    items: [
      { href: "/bootcamp/modulos/m1",  label: "M1: Fundamentos Python",  icon: Code2 },
      { href: "/bootcamp/modulos/m2",  label: "M2: Estadística para ML", icon: BarChart2 },
      { href: "/bootcamp/modulos/m3",  label: "M3: Machine Learning",    icon: Brain },
      { href: "/bootcamp/modulos/m4",  label: "M4: Deep Learning",       icon: Layers },
      { href: "/bootcamp/modulos/m5",  label: "M5: NLP y Texto",         icon: BookOpen },
      { href: "/bootcamp/modulos/m6",  label: "M6: Visión por Computadora", icon: Brain },
      { href: "/bootcamp/modulos/m7",  label: "M7: MLOps",               icon: Rocket },
      { href: "/bootcamp/modulos/m8",  label: "M8: LLMs y Prompting",    icon: Layers },
      { href: "/bootcamp/modulos/m9",  label: "M9: Agentes de IA",       icon: Brain },
      { href: "/bootcamp/modulos/m10", label: "M10: IA Generativa",      icon: Rocket },
      { href: "/bootcamp/modulos/m11", label: "M11: IA en Producción",   icon: Code2 },
      { href: "/bootcamp/modulos/m12", label: "M12: Proyecto Final",     icon: FolderKanban },
    ],
  },
  {
    label: "PROYECTOS",
    items: [
      { href: "/bootcamp/proyectos/introductorio", label: "Proyecto 1: Introductorio", icon: FolderKanban },
      { href: "/bootcamp/proyectos/intermedio",    label: "Proyecto 2: Intermedio",    icon: FolderKanban },
      { href: "/bootcamp/proyectos/capstone",      label: "Proyecto 3: Capstone",      icon: FolderKanban },
    ],
  },
  {
    label: "DESCUBRE ITSEIA",
    items: [
      { href: "/descubre/carreras",          label: "Carreras de IA (3)",       icon: GraduationCap },
      { href: "/descubre/cursos-mdt",        label: "Cursos MDT (15)",          icon: BookMarked },
      { href: "/descubre/cursos-pro",        label: "Cursos Profesionales",     icon: Wrench },
      { href: "/descubre/preuniversitario",  label: "Preuniversitario IGNITE",  icon: Lightbulb },
      { href: "/descubre/certificaciones",   label: "Certificaciones",          icon: Award },
      { href: "/descubre/b2b",               label: "B2B Empresas",             icon: Building2 },
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
      {
        href: "https://wa.me/593959892034?text=Hola%2C%20necesito%20soporte%20con%20el%20Bootcamp",
        label: "Chat Soporte",
        icon: MessageCircle,
        external: true,
      },
      { href: "/bootcamp/certificados", label: "Descargar Certificados", icon: Download },
      { href: "/payments",              label: "Mis Pagos",              icon: CreditCard },
    ],
  },
];

// How many items to show in the CONTENIDO section before collapsing
const VISIBLE_MODULOS = 4;

// ─── Component ────────────────────────────────────────────────────────────────

interface BootcampSidebarProps {
  userName?: string;
  userEmail?: string;
}

export default function BootcampSidebar({
  userName,
  userEmail,
}: BootcampSidebarProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed]           = useState(false);
  const [modulosExpanded, setModulosExpanded] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login?module=bootcamp");
    router.refresh();
  }

  function isActive(href: string): boolean {
    if (href.startsWith("http")) return false;
    if (href === "/bootcamp") return pathname === "/bootcamp";
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
          href="/bootcamp"
          className="flex items-center gap-2.5 group overflow-hidden"
        >
          {collapsed ? (
            <div className="w-9 h-9 rounded-lg bg-[#FBBC0C] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Rocket className="w-5 h-5 text-[#0A1628]" />
            </div>
          ) : (
            <img
              src="/logo_itseia.svg"
              alt="ITSEIA Academy"
              className="h-8 w-auto"
            />
          )}
        </Link>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3">
        {SECTIONS.map((section, sectionIndex) => {
          const isModulosSection = section.collapsible === true;

          // Items to render: full list or truncated for collapsible sections
          const itemsToShow =
            isModulosSection && !modulosExpanded
              ? section.items.slice(0, VISIBLE_MODULOS)
              : section.items;

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
                {itemsToShow.map((item) => {
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
                      {!collapsed && item.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#73B8E7]/15 text-[#73B8E7] flex-shrink-0">
                          {item.badge}
                        </span>
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

                {/* "Show more / show less" toggle for CONTENIDO section */}
                {isModulosSection && !collapsed && (
                  <button
                    onClick={() => setModulosExpanded((v) => !v)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors text-sm font-medium"
                  >
                    <MoreHorizontal className="w-[18px] h-[18px] flex-shrink-0 text-white/30" />
                    <span className="truncate flex-1 leading-none">
                      {modulosExpanded
                        ? "Mostrar menos"
                        : `+ ${section.items.length - VISIBLE_MODULOS} más...`}
                    </span>
                  </button>
                )}
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
                Bootcamp
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
