"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  TrendingUp,
  CalendarCheck,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  ChevronLeft,
  Wand2,
  Wrench,
  ClipboardList,
  GraduationCap,
  BookOpen,
  Zap,
  Building2,
  MessageCircle,
  Download,
  CreditCard,
  LogOut,
  Brain,
  ExternalLink,
} from "lucide-react";

// ─── Nav types ────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  external?: boolean;
}

interface NavSection {
  sectionLabel: string;
  items: NavItem[];
  expandable?: boolean;
  defaultOpen?: boolean;
  subItems?: NavItem[];
}

// ─── Menu definition ──────────────────────────────────────────────────────────

const MENU: NavSection[] = [
  {
    sectionLabel: "MI CURSO",
    items: [
      { href: "/cursos-pro",           label: "Dashboard",           icon: LayoutDashboard },
      { href: "/cursos-pro/progreso",  label: "Mi Progreso",         icon: TrendingUp },
      { href: "/cursos-pro/asesorias", label: "Asesorías con Héctor", icon: CalendarCheck },
    ],
  },
  {
    sectionLabel: "MI PROGRAMA",
    expandable: true,
    defaultOpen: false,
    items: [],
    subItems: [
      { href: "/cursos-pro/modulo/1", label: "Módulo 1: Fundamentos IA",    icon: Brain },
      { href: "/cursos-pro/modulo/2", label: "Módulo 2: Prompt Engineering", icon: Wand2 },
      { href: "/cursos-pro/modulo/3", label: "Módulo 3: Automatización",     icon: Wrench },
      { href: "/cursos-pro/modulo/4", label: "Módulo 4: Proyecto Final",     icon: ClipboardList },
    ],
  },
  {
    sectionLabel: "RECURSOS",
    items: [
      { href: "/cursos-pro/prompts",   label: "Prompts Especializados", icon: Wand2 },
      { href: "/cursos-pro/tools",     label: "Herramientas IA",        icon: Wrench },
      { href: "/cursos-pro/proyecto",  label: "Proyecto Final",         icon: ClipboardList },
    ],
  },
  {
    sectionLabel: "DESCUBRE ITSEIA",
    items: [
      { href: "/carreras-info",             label: "Carreras",      icon: GraduationCap },
      { href: "/cursos-pro-info",           label: "Cursos MDT",    icon: BookOpen },
      { href: "/bootcamp",                  label: "Bootcamp",      icon: Zap },
      { href: "/b2b",                       label: "B2B",           icon: Building2 },
      { href: "https://h3l.ai", label: "H3L", icon: Brain, external: true },
    ],
  },
  {
    sectionLabel: "CUENTA",
    items: [
      { href: "/cursos-pro/soporte",      label: "Chat Soporte",          icon: MessageCircle },
      { href: "/certificates",            label: "Descargar Certificados", icon: Download },
      { href: "/payments",                label: "Mis Pagos",              icon: CreditCard },
    ],
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CursosProSidebarProps {
  userName: string;
  userEmail: string;
  userInitials: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CursosProSidebar({
  userName,
  userEmail,
  userInitials,
}: CursosProSidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const [collapsed, setCollapsed]           = useState(false);
  const [programaOpen, setProgramaOpen]     = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string): boolean {
    if (href.startsWith("http")) return false;
    if (href === "/cursos-pro") return pathname === "/cursos-pro";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-[#0D1B30] border-r border-white/[0.06] transition-all duration-300 flex-shrink-0 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06] flex-shrink-0">
        <Link href="/cursos-pro" className="flex items-center gap-2.5 group overflow-hidden">
          {collapsed ? (
            <div className="w-9 h-9 rounded-lg bg-[#FBBC0C] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Brain className="w-5 h-5 text-[#0A1628]" />
            </div>
          ) : (
            <img src="/logo_itseia.svg" className="h-8 w-auto" alt="ITSEIA" />
          )}
        </Link>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3">
        {MENU.map((section, sectionIdx) => {
          // Expandable section (MI PROGRAMA)
          if (section.expandable) {
            return (
              <div key={section.sectionLabel} className={sectionIdx > 0 ? "mt-6" : ""}>
                {!collapsed && (
                  <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 select-none">
                    {section.sectionLabel}
                  </p>
                )}
                {collapsed && sectionIdx > 0 && (
                  <div className="mx-2 mb-3 border-t border-white/[0.06]" />
                )}
                {/* Toggle button */}
                <button
                  onClick={() => setProgramaOpen((v) => !v)}
                  className={`w-full group flex items-center gap-3 rounded-lg transition-all duration-200 text-white/70 hover:text-white hover:bg-white/[0.04] ${
                    collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
                  }`}
                  title={collapsed ? section.sectionLabel : undefined}
                >
                  <BookOpen className="w-[18px] h-[18px] flex-shrink-0 text-white/50 group-hover:text-white/80 transition-colors" />
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium truncate flex-1 leading-none text-left">
                        Módulos del Curso
                      </span>
                      {programaOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                      ) : (
                        <ChevronRightIcon className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                      )}
                    </>
                  )}
                </button>
                {/* Sub-items */}
                {programaOpen && !collapsed && (
                  <div className="mt-0.5 ml-3 pl-3 border-l border-white/[0.06] space-y-0.5">
                    {(section.subItems ?? []).map((item) => {
                      const Icon   = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                            active
                              ? "bg-[#FBBC0C]/[0.12] text-[#FBBC0C]"
                              : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 flex-shrink-0 transition-colors ${
                              active ? "text-[#FBBC0C]" : "text-white/40 group-hover:text-white/70"
                            }`}
                          />
                          <span className="text-xs font-medium truncate flex-1 leading-none">
                            {item.label}
                          </span>
                          {active && (
                            <div className="h-1.5 w-1.5 rounded-full bg-[#FBBC0C] flex-shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Regular section
          return (
            <div key={section.sectionLabel} className={sectionIdx > 0 ? "mt-6" : ""}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 select-none">
                  {section.sectionLabel}
                </p>
              )}
              {collapsed && sectionIdx > 0 && (
                <div className="mx-2 mb-3 border-t border-white/[0.06]" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon   = item.icon;
                  const active = isActive(item.href);

                  const linkContent = (
                    <>
                      <Icon
                        className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                          active ? "text-[#FBBC0C]" : "text-white/50 group-hover:text-white/80"
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
                    </>
                  );

                  const itemClass = `group flex items-center gap-3 rounded-lg transition-all duration-200 ${
                    collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
                  } ${
                    active
                      ? "bg-[#FBBC0C]/[0.12] text-[#FBBC0C]"
                      : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                  }`;

                  if (item.external) {
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={collapsed ? item.label : undefined}
                        className={itemClass}
                      >
                        {linkContent}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={itemClass}
                    >
                      {linkContent}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── User footer ──────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] p-3 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#1F2F58] flex items-center justify-center flex-shrink-0 ring-2 ring-[#FBBC0C]/20">
              <span className="text-xs font-bold text-[#FBBC0C]">
                {userInitials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate leading-tight">
                {userName}
              </p>
              <p className="text-[10px] text-white/40 truncate leading-tight mt-0.5">
                {userEmail}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-white/40 hover:text-[#F0846D] hover:bg-[#F0846D]/10 transition-colors flex-shrink-0"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
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
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
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
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? (
            <ChevronRightIcon className="w-4 h-4" />
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
