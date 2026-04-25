"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  TrendingUp,
  Zap,
  Wrench,
  Target,
  FlaskConical,
  Trophy,
  GraduationCap,
  BookMarked,
  BookOpen,
  Rocket,
  Building2,
  Stethoscope,
  MessageCircle,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  external?: boolean;
  highlight?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// ─── Menu definition ──────────────────────────────────────────────────────────

const SECTIONS: NavSection[] = [
  {
    label: "ITSEIA IGNITE",
    items: [
      { href: "/preuni",          label: "Dashboard Ignite", icon: LayoutDashboard },
      { href: "/preuni/progreso", label: "Mi Progreso",      icon: TrendingUp },
    ],
  },
  {
    label: "MÓDULOS (20 DÍAS)",
    items: [
      { href: "/preuni/semana-1", label: "Día 1-4: Descubre la IA",     icon: Zap },
      { href: "/preuni/semana-2", label: "Día 5-8: Herramientas IA",    icon: Wrench },
      { href: "/preuni/semana-3", label: "Día 9-12: Tu Carrera Ideal",  icon: Target },
      { href: "/preuni/semana-4", label: "Día 13-16: Proyecto Práctico", icon: FlaskConical },
      { href: "/preuni/evaluacion", label: "Día 17-20: Evaluación Final", icon: Trophy },
    ],
  },
  {
    label: "DESCUBRE ITSEIA",
    items: [
      {
        href: "/carreras",
        label: "Carreras de IA",
        icon: GraduationCap,
        highlight: true,
      },
      { href: "/cursos-mdt",          label: "Cursos MDT (15)",       icon: BookMarked, badge: "15" },
      { href: "/cursos-pro",          label: "Cursos Profesionales",  icon: BookOpen },
      { href: "/bootcamp",            label: "Bootcamp Intensivo",    icon: Rocket },
      { href: "/b2b",                 label: "B2B Empresas",          icon: Building2 },
      {
        href: "https://h3l.ai",
        label: "H3L Diagnóstico IA",
        icon: Stethoscope,
        external: true,
      },
    ],
  },
  {
    label: "CUENTA",
    items: [
      {
        href: "https://wa.me/593959892034?text=Hola%2C%20necesito%20soporte%20con%20ITSEIA%20Ignite",
        label: "Chat Soporte",
        icon: MessageCircle,
        external: true,
      },
      { href: "/payments", label: "Mis Pagos", icon: CreditCard },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface PreuniSidebarProps {
  userName?: string;
  userEmail?: string;
}

export default function PreuniSidebar({
  userName,
  userEmail,
}: PreuniSidebarProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string): boolean {
    if (href.startsWith("http")) return false;
    if (href === "/preuni") return pathname === "/preuni";
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
          href="/preuni"
          className="flex items-center gap-2.5 group overflow-hidden"
        >
          {collapsed ? (
            <div className="w-9 h-9 rounded-lg bg-[#FBBC0C] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              {/* ITSEIA logomark: I letter */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <rect x="10" y="4" width="4" height="16" rx="1" fill="#0A1628" />
                <rect x="6"  y="4" width="12" height="3"  rx="1" fill="#0A1628" />
                <rect x="6"  y="17" width="12" height="3" rx="1" fill="#0A1628" />
              </svg>
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
                const Icon    = item.icon;
                const active  = isActive(item.href);
                const linkProps = item.external
                  ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                  : { href: item.href };

                // Highlighted CTA (Carreras de IA — yellow background)
                if (item.highlight && !collapsed) {
                  return (
                    <Link
                      key={`${item.href}-${item.label}`}
                      {...linkProps}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 bg-[#FBBC0C]/[0.15] border border-[#FBBC0C]/30 text-[#FBBC0C] hover:bg-[#FBBC0C]/[0.25]"
                    >
                      <Icon className="w-[18px] h-[18px] flex-shrink-0 text-[#FBBC0C]" />
                      <span className="text-sm font-semibold truncate flex-1 leading-none">
                        {item.label}
                      </span>
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FBBC0C] flex-shrink-0 animate-pulse" />
                    </Link>
                  );
                }

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
                {userName || userEmail || "Estudiante"}
              </p>
              <p className="text-[10px] text-white/40 truncate leading-tight mt-0.5">
                IGNITE
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

        {/* Collapsed: only logout icon */}
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

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
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
