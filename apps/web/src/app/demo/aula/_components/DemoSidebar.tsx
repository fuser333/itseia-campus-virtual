"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Zap,
  Wrench,
  Target,
  FlaskConical,
  Trophy,
  GraduationCap,
  BookMarked,
  Rocket,
  Award,
  Building2,
  Stethoscope,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

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

// ─── Secciones del menú (replica PreuniSidebar para el demo público) ──────────

const SECTIONS: NavSection[] = [
  {
    label: "ITSEIA IGNITE DEMO",
    items: [
      { href: "/demo/aula", label: "Dashboard Demo", icon: LayoutDashboard },
    ],
  },
  {
    label: "MÓDULOS (20 DÍAS)",
    items: [
      { href: "/demo/aula/semana-1", label: "Día 1-4: Descubre la IA",      icon: Zap },
      { href: "/demo/aula/semana-2", label: "Día 5-8: Herramientas IA",     icon: Wrench },
      { href: "/demo/aula/semana-3", label: "Día 9-12: Tu Carrera Ideal",   icon: Target },
      { href: "/demo/aula/semana-4", label: "Día 13-20: Lanzamiento",       icon: FlaskConical },
    ],
  },
  {
    label: "DESCUBRE ITSEIA",
    items: [
      {
        href: "/descubre/carreras",
        label: "Carreras de IA (3)",
        icon: GraduationCap,
        highlight: true,
      },
      { href: "/descubre/cursos-mdt",      label: "Cursos MDT (15)",         icon: BookMarked, badge: "15" },
      { href: "/descubre/bootcamp",        label: "Bootcamp 120h",           icon: Rocket },
      { href: "/descubre/certificaciones", label: "Certificaciones",         icon: Award },
      { href: "/descubre/b2b",             label: "B2B Empresas",            icon: Building2 },
      {
        href: "https://h3l.ai",
        label: "H3L Diagnóstico IA",
        icon: Stethoscope,
        external: true,
      },
    ],
  },
  {
    label: "SOPORTE",
    items: [
      {
        href: "https://wa.me/593990709009?text=Hola%2C+quiero+saber+m%C3%A1s+sobre+el+preuniversitario+ITSEIA+Ignite",
        label: "Hablar con Sofía",
        icon: MessageCircle,
        external: true,
      },
    ],
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DemoSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string): boolean {
    if (href.startsWith("http")) return false;
    if (href === "/demo/aula") return pathname === "/demo/aula";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9F6E7] text-[#1F2F58]">

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1F2F58] border border-white/10 text-white"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:sticky top-0 h-screen shrink-0 bg-[#0D1B30] text-white border-r border-white/[0.06] flex flex-col z-40 transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* ── Logo ── */}
        <div className="h-16 flex items-center px-4 border-b border-white/[0.06] flex-shrink-0">
          <Link
            href="/demo/aula"
            className="flex items-center gap-2.5 group overflow-hidden"
          >
            {collapsed ? (
              <div className="w-9 h-9 rounded-lg bg-[#FBBC0C] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                  <rect x="10" y="4" width="4" height="16" rx="1" fill="#0A1628" />
                  <rect x="6"  y="4" width="12" height="3"  rx="1" fill="#0A1628" />
                  <rect x="6"  y="17" width="12" height="3" rx="1" fill="#0A1628" />
                </svg>
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src="/logo_itseia.svg" alt="ITSEIA Academy" className="h-8 w-auto" />
            )}
          </Link>
          {!collapsed && (
            <div className="ml-auto flex items-center gap-1">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#FBBC0C]/70 bg-[#FBBC0C]/10 px-1.5 py-0.5 rounded-full">
                DEMO
              </span>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
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

                  // Highlighted CTA (Carreras de IA)
                  if (item.highlight && !collapsed) {
                    return (
                      <Link
                        key={`${item.href}-${item.label}`}
                        {...linkProps}
                        onClick={() => setMobileOpen(false)}
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
                      onClick={() => setMobileOpen(false)}
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

        {/* ── CTA inscripción + collapse toggle ── */}
        <div className="border-t border-white/[0.06] p-3 flex-shrink-0 space-y-3">
          {/* CTA grande — Inscríbete por $99 */}
          {!collapsed && (
            <a
              href="https://wa.me/593990709009?text=Hola%2C+quiero+inscribirme+al+preuniversitario+ITSEIA+Ignite+por+%2499"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#FBBC0C] text-[#0A1628] text-sm font-bold hover:bg-[#FBBC0C]/90 transition-colors shadow-lg shadow-[#FBBC0C]/20"
            >
              <MessageCircle className="w-4 h-4" />
              Inscríbete por $99
            </a>
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

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto" style={{ color: "#1F2F58" }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
