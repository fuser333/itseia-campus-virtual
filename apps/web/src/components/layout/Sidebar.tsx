"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile, UserRole } from "@/types/database";
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  User,
  CreditCard,
  Award,
  Settings,
  Users,
  GraduationCap,
  FileText,
  BrainCircuit,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Brain,
  Sparkles,
  Briefcase,
  UsersRound,
  Library,
  School,
  Compass,
  Rocket,
  Zap,
  ClipboardCheck,
  BookMarked,
  CalendarDays,
  ShieldCheck,
  Layers,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: string;
}

const ALL_ROLES: UserRole[] = [
  "estudiante",
  "docente",
  "coordinacion",
  "finanzas",
  "admin",
  "super_admin",
];

const STAFF_ROLES: UserRole[] = [
  "docente",
  "coordinacion",
  "admin",
  "super_admin",
];

const ADMIN_ROLES: UserRole[] = [
  "coordinacion",
  "admin",
  "super_admin",
];

const navItems: NavItem[] = [
  // -- Principal --
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ALL_ROLES,
  },
  {
    href: "/courses",
    label: "Mis Cursos",
    icon: BookOpen,
    roles: [
      "estudiante",
      "docente",
      "coordinacion",
      "admin",
      "super_admin",
    ],
  },
  {
    href: "/carreras",
    label: "Mi Carrera",
    icon: School,
    roles: ["estudiante", ...ADMIN_ROLES],
  },
  {
    href: "/ai-lab",
    label: "AI Lab",
    icon: FlaskConical,
    roles: [
      "estudiante",
      "docente",
      "coordinacion",
      "admin",
      "super_admin",
    ],
    badge: "Beta",
  },
  {
    href: "/flashcards",
    label: "Flashcards",
    icon: Layers,
    roles: ["estudiante", ...ADMIN_ROLES],
  },
  {
    href: "/portfolio",
    label: "Mi Portafolio",
    icon: Briefcase,
    roles: ["estudiante", ...ADMIN_ROLES],
  },
  {
    href: "/cohorte",
    label: "Mi Cohorte",
    icon: UsersRound,
    roles: ["estudiante", ...ADMIN_ROLES],
    badge: "Nuevo",
  },
  {
    href: "/certificates",
    label: "Certificados",
    icon: Award,
    roles: ["estudiante", ...ADMIN_ROLES],
  },
  {
    href: "/certificaciones",
    label: "Certificaciones",
    icon: ShieldCheck,
    roles: ["estudiante", ...ADMIN_ROLES],
    badge: "Nuevo",
  },
  {
    href: "/biblioteca",
    label: "Biblioteca",
    icon: BookMarked,
    roles: [
      "estudiante",
      "docente",
      "coordinacion",
      "admin",
      "super_admin",
    ],
  },
  {
    href: "/calendario",
    label: "Calendario",
    icon: CalendarDays,
    roles: [
      "estudiante",
      "docente",
      "coordinacion",
      "admin",
      "super_admin",
    ],
  },
  {
    href: "/payments",
    label: "Mis Pagos",
    icon: CreditCard,
    roles: ["estudiante"],
  },
  {
    href: "/profile",
    label: "Mi Perfil",
    icon: User,
    roles: ALL_ROLES,
  },
  // -- Explorar --
  {
    href: "/catalogo",
    label: "Catalogo",
    icon: Library,
    roles: ALL_ROLES,
  },
  {
    href: "/carreras",
    label: "Carreras",
    icon: GraduationCap,
    roles: ALL_ROLES,
  },
  {
    href: "/preuniversitario",
    label: "Preuniversitario",
    icon: Rocket,
    roles: ALL_ROLES,
  },
  {
    href: "/bootcamp",
    label: "Bootcamp IA",
    icon: Zap,
    roles: ALL_ROLES,
  },
  {
    href: "/b2b",
    label: "B2B Empresas",
    icon: Briefcase,
    roles: ALL_ROLES,
    badge: "Nuevo",
  },
  // -- Panel Docente --
  {
    href: "/admin/courses",
    label: "Gestionar Cursos",
    icon: FileText,
    roles: STAFF_ROLES,
  },
  {
    href: "/admin/lessons",
    label: "Gestionar Lecciones",
    icon: GraduationCap,
    roles: STAFF_ROLES,
  },
  {
    href: "/admin/sesiones",
    label: "Gestionar Sesiones",
    icon: BookOpen,
    roles: STAFF_ROLES,
  },
  {
    href: "/admin/entregas",
    label: "Revisar Entregas",
    icon: ClipboardCheck,
    roles: STAFF_ROLES,
  },
  // -- Administracion --
  {
    href: "/admin/calendario",
    label: "Calendario Global",
    icon: CalendarDays,
    roles: ADMIN_ROLES,
  },
  {
    href: "/admin/users",
    label: "Usuarios",
    icon: Users,
    roles: ADMIN_ROLES,
  },
  {
    href: "/admin/programs",
    label: "Carreras (Admin)",
    icon: BrainCircuit,
    roles: ADMIN_ROLES,
  },
  {
    href: "/admin/carreras",
    label: "Carreras (Acad.)",
    icon: School,
    roles: ADMIN_ROLES,
  },
  {
    href: "/admin/enrollments",
    label: "Matriculas",
    icon: GraduationCap,
    roles: ADMIN_ROLES,
  },
  {
    href: "/admin/payments",
    label: "Pagos",
    icon: DollarSign,
    roles: ["finanzas", "admin", "super_admin"],
  },
  // -- Sistema --
  {
    href: "/admin/ai-usage",
    label: "Uso de IA",
    icon: Sparkles,
    roles: ["admin", "super_admin"],
  },
  {
    href: "/admin",
    label: "Panel Admin",
    icon: Settings,
    roles: ["admin", "super_admin"],
  },
];

// Paths that belong to Explorar section
const EXPLORAR_PATHS = ["/catalogo", "/preuniversitario", "/bootcamp", "/b2b"];
// The /carreras link in Explorar has the same href as the Principal one,
// so we deduplicate by using label check in Principal.
const EXPLORAR_LABELS = ["Catalogo", "Carreras", "Preuniversitario", "Bootcamp IA", "B2B Empresas"];

// Paths for Panel Docente
const DOCENTE_PATHS = ["/admin/courses", "/admin/lessons", "/admin/sesiones", "/admin/entregas"];

function getSections(role: UserRole) {
  const sections: { label: string; items: NavItem[] }[] = [];

  // Principal — personal navigation (exclude Explorar items)
  const principalItems = navItems.filter(
    (item) =>
      item.roles.includes(role) &&
      !item.href.startsWith("/admin") &&
      !EXPLORAR_LABELS.includes(item.label)
  );
  if (principalItems.length > 0) {
    sections.push({ label: "Principal", items: principalItems });
  }

  // Explorar — public discovery links
  const explorarItems = navItems.filter(
    (item) =>
      item.roles.includes(role) &&
      EXPLORAR_LABELS.includes(item.label)
  );
  if (explorarItems.length > 0) {
    sections.push({ label: "Explorar", items: explorarItems });
  }

  // Panel Docente — staff content management
  if (STAFF_ROLES.includes(role)) {
    const docenteItems = navItems.filter(
      (item) =>
        item.roles.includes(role) &&
        DOCENTE_PATHS.includes(item.href)
    );
    if (docenteItems.length > 0) {
      sections.push({ label: "Panel Docente", items: docenteItems });
    }
  }

  // Administracion
  if ([...ADMIN_ROLES, "finanzas" as UserRole].includes(role)) {
    const adminItems = navItems.filter(
      (item) =>
        item.roles.includes(role) &&
        item.href.startsWith("/admin") &&
        !DOCENTE_PATHS.includes(item.href) &&
        item.href !== "/admin" &&
        item.href !== "/admin/ai-usage"
    );
    if (adminItems.length > 0) {
      sections.push({ label: "Administracion", items: adminItems });
    }
  }

  // Sistema
  if (["admin", "super_admin"].includes(role)) {
    const systemItems = navItems.filter(
      (item) =>
        item.roles.includes(role) &&
        (item.href === "/admin" || item.href === "/admin/ai-usage")
    );
    if (systemItems.length > 0) {
      sections.push({ label: "Sistema", items: systemItems });
    }
  }

  return sections;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email || "" });

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profileData) {
          setProfile(profileData as Profile);
        }
      }
      setLoading(false);
    }

    getUser();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/admin" && pathname !== "/admin") return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  const role: UserRole = profile?.role || "estudiante";
  const sections = getSections(role);

  // Loading skeleton
  if (loading) {
    return (
      <aside
        className={`hidden lg:flex flex-col h-screen bg-[#0D1B30] border-r border-white/[0.06] transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        <div className="h-16 flex items-center px-4 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-lg bg-yellow/20 animate-pulse" />
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-9 rounded-lg bg-white/[0.04] animate-pulse"
              />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-[#0D1B30] border-r border-white/[0.06] transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group overflow-hidden"
        >
          <div className="w-9 h-9 rounded-lg bg-[#FBBC0C] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Brain className="w-5 h-5 text-[#0A1628]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-lg font-bold tracking-tight leading-none text-white font-[family-name:var(--font-space-grotesk)] whitespace-nowrap">
                ITSEIA
              </span>
              <span className="text-[10px] text-[#73B8E7] font-medium uppercase tracking-widest leading-none mt-0.5">
                Academy
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3">
        {sections.map((section, sectionIndex) => (
          <div key={section.label} className={sectionIndex > 0 ? "mt-6" : ""}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                {section.label}
              </p>
            )}
            {collapsed && sectionIndex > 0 && (
              <div className="mx-2 mb-3 border-t border-white/[0.06]" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`group flex items-center gap-3 rounded-lg transition-all duration-200 ${
                      collapsed
                        ? "justify-center px-0 py-2.5"
                        : "px-3 py-2.5"
                    } ${
                      active
                        ? "bg-[#FBBC0C]/[0.12] text-[#FBBC0C]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                        active
                          ? "text-[#FBBC0C]"
                          : "text-white/40 group-hover:text-white/70"
                      }`}
                    />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate flex-1">
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#73B8E7]/15 text-[#73B8E7]">
                        {item.badge}
                      </span>
                    )}
                    {active && !collapsed && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FBBC0C]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* XP bar for students */}
      {!collapsed && profile && role === "estudiante" && (
        <div className="px-4 pb-2">
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                Nivel XP
              </span>
              <span className="text-xs font-bold text-[#FBBC0C] font-[family-name:var(--font-space-grotesk)]">
                {profile.nivel_xp || 0}
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((profile.nivel_xp || 0) % 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* User & collapse */}
      <div className="border-t border-white/[0.06] p-3">
        {/* User info */}
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#1F2F58] flex items-center justify-center flex-shrink-0 ring-2 ring-[#FBBC0C]/20">
              <span className="text-xs font-bold text-[#FBBC0C] font-[family-name:var(--font-space-grotesk)]">
                {profile?.full_name
                  ? profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : user.email.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.full_name || user.email}
              </p>
              <p className="text-[10px] text-white/40 capitalize truncate">
                {role.replace("_", " ")}
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

        {collapsed && user && (
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
