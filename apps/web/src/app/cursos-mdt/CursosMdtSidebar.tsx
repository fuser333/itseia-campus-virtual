"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Zap,
  Building2,
  MessageCircle,
  Download,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  Brain,
} from "lucide-react";

// ─── Nav types ────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  external?: boolean;
  /** Color override for the label text (used in DESCUBRE section) */
  labelColor?: string;
}

interface NavSection {
  sectionLabel: string;
  items: NavItem[];
}

// ─── Menu definition ──────────────────────────────────────────────────────────

const MENU: NavSection[] = [
  {
    sectionLabel: "MIS CURSOS MDT",
    items: [
      { href: "/cursos-mdt",          label: "Dashboard Cursos",   icon: LayoutDashboard },
      { href: "/cursos-mdt/progreso", label: "Mi Progreso General", icon: TrendingUp },
    ],
  },
  {
    sectionLabel: "CATÁLOGO (15 CURSOS)",
    items: [
      { href: "/cursos-mdt/c1",  label: "C1. Intro IA Aplicada",      icon: BookOpen },
      { href: "/cursos-mdt/c2",  label: "C2. Python Datos",           icon: BookOpen },
      { href: "/cursos-mdt/c3",  label: "C3. ML Negocios",            icon: BookOpen },
      { href: "/cursos-mdt/c4",  label: "C4. Big Data",               icon: BookOpen },
      { href: "/cursos-mdt/c5",  label: "C5. Gestión Proyectos IA",   icon: BookOpen },
      { href: "/cursos-mdt/c6",  label: "C6. Claude Code",            icon: BookOpen },
      { href: "/cursos-mdt/c7",  label: "C7. Codex",                  icon: BookOpen },
      { href: "/cursos-mdt/c8",  label: "C8. Antigravity",            icon: BookOpen },
      { href: "/cursos-mdt/c9",  label: "C9. Cursor",                 icon: BookOpen },
      { href: "/cursos-mdt/c10", label: "C10. Fund. IA",              icon: BookOpen },
      { href: "/cursos-mdt/c11", label: "C11. Fund. Ciencia Datos",   icon: BookOpen },
      { href: "/cursos-mdt/c12", label: "C12. Fund. Big Data",        icon: BookOpen },
      { href: "/cursos-mdt/c13", label: "C13. IA Proyectos",          icon: BookOpen },
      { href: "/cursos-mdt/c14", label: "C14. Ciencia Datos Aplicada",icon: BookOpen },
      { href: "/cursos-mdt/c15", label: "C15. Big Data Aplicada",     icon: BookOpen },
    ],
  },
  {
    sectionLabel: "DESCUBRE ITSEIA",
    items: [
      { href: "/cursos-mdt/descubre/carreras",   label: "Carreras de IA",       icon: GraduationCap, labelColor: "#73B8E7" },
      { href: "/cursos-mdt/descubre/cursos-pro", label: "Cursos Profesionales", icon: BookOpen,      labelColor: "#73B8E7" },
      { href: "/cursos-mdt/descubre/bootcamp",   label: "Bootcamp Intensivo",   icon: Zap,           labelColor: "#73B8E7" },
      { href: "/cursos-mdt/descubre/b2b",        label: "B2B Empresas",         icon: Building2,     labelColor: "#73B8E7" },
      { href: "/cursos-mdt/descubre/h3l",        label: "H3L Diagnóstico IA",   icon: Brain,         labelColor: "#F0846D" },
    ],
  },
  {
    sectionLabel: "CUENTA",
    items: [
      {
        href: "https://wa.me/593997489821",
        label: "Chat Soporte",
        icon: MessageCircle,
        external: true,
      },
      { href: "/certificates", label: "Descargar Certificados", icon: Download },
      { href: "/payments",     label: "Mis Pagos",              icon: CreditCard },
    ],
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CursosMdtSidebarProps {
  userName: string;
  userEmail: string;
  userInitials: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CursosMdtSidebar({
  userName,
  userEmail,
  userInitials,
}: CursosMdtSidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string): boolean {
    if (href.startsWith("http")) return false;
    if (href === "/cursos-mdt") return pathname === "/cursos-mdt";
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
        <Link href="/cursos-mdt" className="flex items-center gap-2.5 group overflow-hidden">
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
        {MENU.map((section, sectionIdx) => (
          <div key={section.sectionLabel} className={sectionIdx > 0 ? "mt-6" : ""}>
            {/* Section header */}
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 select-none">
                {section.sectionLabel}
              </p>
            )}
            {collapsed && sectionIdx > 0 && (
              <div className="mx-2 mb-3 border-t border-white/[0.06]" />
            )}

            {/* Items */}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon       = item.icon;
                const active     = isActive(item.href);
                const labelColor = item.labelColor;

                const linkContent = (
                  <>
                    <span
                      className={`w-[18px] h-[18px] flex-shrink-0 transition-colors flex items-center justify-center ${
                        active ? "text-[#FBBC0C]" : !labelColor ? "text-white/50 group-hover:text-white/80" : ""
                      }`}
                      style={!active && labelColor ? { color: labelColor } : undefined}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    {!collapsed && (
                      <span
                        className="text-sm font-medium truncate flex-1 leading-none"
                        style={
                          active
                            ? undefined
                            : labelColor
                            ? { color: labelColor }
                            : undefined
                        }
                      >
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
        ))}
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
                Estudiante MDT
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
