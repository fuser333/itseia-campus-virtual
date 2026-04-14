"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Brain,
  BarChart2,
  BrainCircuit,
  Sparkles,
  Bot,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Users,
  Award,
} from "lucide-react";

type DemoUser = {
  email: string;
  name: string;
  loggedAt: number;
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  disabled?: boolean;
};

type NavSection = { label: string; items: NavItem[] };

const MENU: NavSection[] = [
  {
    label: "MI PREUNIVERSITARIO",
    items: [
      { href: "/demo/aula", label: "Dashboard", icon: LayoutDashboard },
      { href: "/demo/aula/semana-1", label: "Semana 1: Ignición", icon: Brain },
      { href: "/demo/aula/semana-2", label: "Semana 2: Construcción", icon: BarChart2 },
      { href: "/demo/aula/semana-3", label: "Semana 3: Automatización", icon: BrainCircuit },
      { href: "/demo/aula/semana-4", label: "Semana 4: Lanzamiento", icon: Sparkles },
    ],
  },
  {
    label: "HERRAMIENTAS",
    items: [
      { href: "#ai-lab", label: "AI Lab", icon: Bot, disabled: true },
      { href: "#biblioteca", label: "Biblioteca", icon: BookOpen, disabled: true },
    ],
  },
  {
    label: "COMUNIDAD",
    items: [
      { href: "#foro", label: "Foros", icon: MessageSquare, disabled: true },
      { href: "#cohorte", label: "Mi cohorte", icon: Users, disabled: true },
      { href: "#certificado", label: "Certificados", icon: Award, disabled: true },
    ],
  },
];

export default function DemoSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<DemoUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("itseia_demo_user");
      if (!raw) {
        router.replace("/demo");
        return;
      }
      setUser(JSON.parse(raw));
    } catch {
      router.replace("/demo");
    }
  }, [router]);

  function handleLogout() {
    try {
      window.localStorage.removeItem("itseia_demo_user");
    } catch {}
    router.replace("/demo-info");
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F6E7] text-[#1F2F58] flex items-center justify-center">
        <div className="text-sm text-[#1F2F58]/50">Cargando demo...</div>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sidebarWidth = collapsed ? "w-20" : "w-72";

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#F9F6E7] text-[#1F2F58]"
      style={{ color: "#1F2F58" }}
    >
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1F2F58] border border-white/10 text-white"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen ${sidebarWidth} shrink-0 bg-[#0A1628] text-white border-r border-white/[0.06] flex flex-col z-40 transition-all duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="px-4 py-5 border-b border-white/[0.06] flex items-center justify-between">
          <Link
            href="/demo/aula"
            className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
          >
            <div
              className="shrink-0 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(255,255,255,0.95)", padding: "4px 6px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo_itseia.svg" alt="ITSEIA" className="h-6 w-auto" />
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-bold">ITSEIA</div>
                <div className="text-[10px] text-[#73B8E7] uppercase tracking-widest">
                  Academy · Demo
                </div>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="hidden lg:block p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {MENU.map((section) => (
            <div key={section.label} className="mb-6">
              {!collapsed && (
                <div className="px-3 mb-2 text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
                  {section.label}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.disabled ? "#" : item.href}
                      onClick={(e) => {
                        if (item.disabled) {
                          e.preventDefault();
                        } else {
                          setMobileOpen(false);
                        }
                      }}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        active
                          ? "bg-[#FBBC0C]/10 text-[#FBBC0C] border border-[#FBBC0C]/20"
                          : item.disabled
                            ? "text-white/25 cursor-not-allowed"
                            : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.disabled && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/40 font-semibold uppercase tracking-wider">
                              soon
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/[0.06] p-4">
          <div
            className={`flex items-center gap-3 px-2 py-2 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[#FBBC0C] text-[#0A1628] flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-[#73B8E7] truncate">
                    {user.email}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-white/40 hover:text-[#F0846D] hover:bg-[#F0846D]/10 transition-colors"
                  aria-label="Salir del demo"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main content — matches /preuni layout exactly */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ color: "#1F2F58" }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
