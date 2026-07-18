"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile, UserRole } from "@/types/database";
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  Calendar,
  Video,
  MessageSquare,
  Bot,
  BookOpen,
  Layers,
  CreditCard,
  User,
  FileCheck,
  Briefcase,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Brain,
  Users,
  FileText,
  BrainCircuit,
  DollarSign,
  Sparkles,
  Settings,
  CalendarDays,
  School,
  ClipboardCheck,
  ShieldCheck,
  ExternalLink,
  ClipboardList,
  BarChart2,
  Megaphone,
  Building2,
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

// ─── Menu definitions ─────────────────────────────────────────────────────────

/** 1. ALUMNO — carrera formal (role: estudiante, program type: carrera) */
const MENU_ALUMNO: NavSection[] = [
  {
    label: "MI APRENDIZAJE",
    items: [
      { href: "/dashboard",        label: "Dashboard",       icon: LayoutDashboard },
      { href: "/carreras",         label: "Mi Carrera",      icon: GraduationCap },
      { href: "/calendario",       label: "Calendario",      icon: Calendar },
      { href: "/cohorte",          label: "Clases en Vivo",  icon: Video },
      { href: "/foros",            label: "Foros",           icon: MessageSquare },
    ],
  },
  {
    label: "HERRAMIENTAS",
    items: [
      { href: "/ai-lab",      label: "AI Lab",     icon: Bot,      badge: "Beta" },
      { href: "/biblioteca",  label: "Biblioteca", icon: BookOpen },
      { href: "/flashcards",  label: "Flashcards", icon: Layers },
    ],
  },
  {
    label: "MI CUENTA",
    items: [
      { href: "/payments",      label: "Pagos",        icon: CreditCard },
      { href: "/profile",       label: "Perfil",       icon: User },
      { href: "/certificates",  label: "Certificados", icon: FileCheck },
    ],
  },
];

/** 2. PREUNIVERSITARIO — (role: estudiante, program type: preuni) */
const MENU_PREUNI: NavSection[] = [
  {
    label: "MI PREUNIVERSITARIO",
    items: [
      { href: "/dashboard",           label: "Dashboard",              icon: LayoutDashboard },
      { href: "/preuni/semana-1",     label: "Semana 1: Fundamentos IA", icon: Brain },
      { href: "/preuni/semana-2",     label: "Semana 2: Datos con IA", icon: BarChart2 },
      { href: "/preuni/semana-3",     label: "Semana 3: ML y Apps",    icon: BrainCircuit },
      { href: "/preuni/semana-4",     label: "Semana 4: Proyecto Final", icon: Sparkles },
    ],
  },
  {
    label: "HERRAMIENTAS",
    items: [
      { href: "/ai-lab",     label: "AI Lab",     icon: Bot,     badge: "Beta" },
      { href: "/biblioteca", label: "Biblioteca", icon: BookOpen },
    ],
  },
  {
    label: "MI CUENTA",
    items: [
      { href: "/payments",     label: "Pagos",        icon: CreditCard },
      { href: "/profile",      label: "Perfil",       icon: User },
      { href: "/certificates", label: "Certificado",  icon: FileCheck },
    ],
  },
];

/** 3. BOOTCAMP — (role: estudiante, program type: bootcamp) */
const MENU_BOOTCAMP: NavSection[] = [
  {
    label: "MI BOOTCAMP",
    items: [
      { href: "/dashboard",   label: "Dashboard",       icon: LayoutDashboard },
      { href: "/carreras",    label: "Mi Bootcamp",     icon: GraduationCap },
      { href: "/cohorte",     label: "Clases en Vivo",  icon: Video },
      { href: "/foros",       label: "Foros",           icon: MessageSquare },
    ],
  },
  {
    label: "HERRAMIENTAS",
    items: [
      { href: "/ai-lab",      label: "AI Lab",     icon: Bot,      badge: "Beta" },
      { href: "/biblioteca",  label: "Biblioteca", icon: BookOpen },
      { href: "/flashcards",  label: "Flashcards", icon: Layers },
    ],
  },
  {
    label: "MI CUENTA",
    items: [
      { href: "/payments",      label: "Pagos",        icon: CreditCard },
      { href: "/profile",       label: "Perfil",       icon: User },
      { href: "/certificates",  label: "Certificado",  icon: FileCheck },
    ],
  },
];

/** 4. CURSOS PRO — (role: estudiante, program type: curso) */
const MENU_CURSOS_PRO: NavSection[] = [
  {
    label: "MI CURSO",
    items: [
      { href: "/dashboard",  label: "Dashboard",          icon: LayoutDashboard },
      { href: "/mi-curso",   label: "Mi Curso",           icon: GraduationCap },
      {
        href: "https://itseia.ai/demos/",
        label: "Demos Interactivos",
        icon: FlaskConical,
        external: true,
      },
    ],
  },
  {
    label: "HERRAMIENTAS",
    items: [
      { href: "/ai-lab",     label: "AI Lab",     icon: Bot,     badge: "Beta" },
      { href: "/biblioteca", label: "Biblioteca", icon: BookOpen },
    ],
  },
  {
    label: "MI CUENTA",
    items: [
      { href: "/payments",     label: "Pagos",       icon: CreditCard },
      { href: "/profile",      label: "Perfil",      icon: User },
      { href: "/certificates", label: "Certificado", icon: FileCheck },
    ],
  },
];

/**
 * DESCUBRE ITSEIA section — injected into all student menus so users can
 * discover other programs through the public /descubre/* landing pages.
 * Each link goes to a promo page with video + info + WhatsApp CTA.
 */
const SECTION_EXPLORAR: NavSection = {
  label: "DESCUBRE ITSEIA",
  items: [
    { href: "/descubre/carreras",        label: "Carreras de IA (3)",     icon: GraduationCap },
    { href: "/descubre/cursos-mdt",      label: "Cursos MDT (15)",        icon: BookOpen },
    { href: "/descubre/cursos-pro",      label: "Cursos Profesionales",   icon: Sparkles },
    { href: "/descubre/bootcamp",        label: "Bootcamp 120h",          icon: FlaskConical },
    { href: "/descubre/certificaciones", label: "Certificaciones",        icon: Award },
    { href: "/descubre/b2b",              label: "B2B Empresas",           icon: Building2 },
    {
      href: "https://h3l.ai",
      label: "H3L Diagnóstico IA",
      icon: ExternalLink,
      external: true,
    },
  ],
};

/**
 * CERTIFICACIONES section — injected into any student menu when the user
 * has at least one active certification enrollment.
 */
const SECTION_CERTIFICACIONES: NavSection = {
  label: "MIS CERTIFICACIONES",
  items: [
    { href: "/certificaciones",            label: "Dashboard Certificaciones", icon: Award, badge: "Nuevo" },
    { href: "/certificaciones/simulacros", label: "Simulacros de Examen",      icon: ShieldCheck },
  ],
};

/** 3. DOCENTE */
const MENU_DOCENTE: NavSection[] = [
  {
    label: "MIS MATERIAS",
    items: [
      { href: "/teacher",           label: "Dashboard",    icon: LayoutDashboard },
      { href: "/teacher/materias",  label: "Mis Materias", icon: BookOpen },
    ],
  },
  {
    label: "GESTION",
    items: [
      { href: "/teacher/entregas",    label: "Calificar Entregas",  icon: ClipboardCheck },
      { href: "/teacher/progreso",    label: "Progreso Alumnos",    icon: BarChart2 },
      { href: "/teacher/comunicacion", label: "Anuncios",           icon: Megaphone },
      { href: "/teacher/programar-clases", label: "Programar Clases",    icon: Video },
      { href: "/teacher/tutorias",          label: "Tutorias",            icon: MessageSquare },
      { href: "/teacher/asistencia",        label: "Asistencia",          icon: ClipboardList },
    ],
  },
  {
    label: "CAPACITACION CES",
    items: [
      { href: "/teacher/capacitacion",  label: "Docencia Virtual 120h", icon: GraduationCap },
      { href: "/teacher/certificacion", label: "Mi Certificacion",      icon: FileCheck },
    ],
  },
];

/** 4. ADMIN / COORDINACION / SUPER_ADMIN — keep existing sections */
const MENU_ADMIN: NavSection[] = [
  {
    label: "PRINCIPAL",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/ai-lab",    label: "AI Lab",    icon: FlaskConical, badge: "Beta" },
    ],
  },
  {
    label: "PANEL DOCENTE",
    items: [
      { href: "/admin/courses",   label: "Gestionar Cursos",    icon: FileText },
      { href: "/admin/lessons",   label: "Gestionar Lecciones", icon: GraduationCap },
      { href: "/admin/sesiones",  label: "Gestionar Sesiones",  icon: BookOpen },
      { href: "/admin/entregas",  label: "Revisar Entregas",    icon: ClipboardCheck },
    ],
  },
  {
    label: "ADMINISTRACION",
    items: [
      { href: "/admin/calendario",  label: "Calendario Global",  icon: CalendarDays },
      { href: "/admin/users",       label: "Usuarios",           icon: Users },
      { href: "/admin/programs",    label: "Carreras (Admin)",   icon: BrainCircuit },
      { href: "/admin/carreras",    label: "Carreras (Acad.)",   icon: School },
      { href: "/admin/enrollments", label: "Matriculas",         icon: GraduationCap },
      { href: "/admin/payments",    label: "Pagos",              icon: DollarSign },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      { href: "/admin/ai-usage", label: "Uso de IA",    icon: Sparkles },
      { href: "/admin",          label: "Panel Admin",  icon: Settings },
    ],
  },
];

/** 5. FINANZAS */
const MENU_FINANZAS: NavSection[] = [
  {
    label: "FINANZAS",
    items: [
      { href: "/dashboard",       label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/payments",  label: "Pagos",     icon: DollarSign },
      { href: "/admin/enrollments", label: "Reportes", icon: BarChart2 },
    ],
  },
  {
    label: "MI CUENTA",
    items: [
      { href: "/profile", label: "Perfil", icon: User },
    ],
  },
];

/** 6. B2B / CORPORATIVO */
const MENU_B2B: NavSection[] = [
  {
    label: "MI EMPRESA",
    items: [
      { href: "/b2b",                  label: "Dashboard Corporativo", icon: LayoutDashboard },
      { href: "/b2b/team",         label: "Mi Equipo",             icon: Users },
      { href: "/b2b/capacitacion",     label: "Capacitacion Activa",   icon: GraduationCap },
    ],
  },
  {
    label: "NUESTRAS EMPRESAS",
    items: [
      { href: "https://h3l.ai",        label: "H3L",      icon: Building2,   external: true },
      { href: "https://imagemia.com",  label: "ImagemIA", icon: Brain,       external: true },
      { href: "https://strata.h3l.ai", label: "Strata",   icon: BrainCircuit, external: true },
    ],
  },
  {
    label: "REPORTES",
    items: [
      { href: "/b2b/reportes", label: "Progreso del Equipo", icon: BarChart2 },
      { href: "/certificates", label: "Certificados Equipo", icon: Award },
      { href: "/payments",     label: "Facturacion",         icon: CreditCard },
    ],
  },
];

// ─── Enrollment type detection ────────────────────────────────────────────────

/**
 * Priority order for students enrolled in multiple programs:
 *   carrera > bootcamp > preuni > curso
 *
 * The highest-priority program determines the main menu. Certification
 * enrollments are handled separately and add SECTION_CERTIFICACIONES.
 */
type MenuType = "alumno" | "bootcamp" | "preuni" | "cursos_pro" | "docente" | "admin" | "b2b";

function getMenuType(role: UserRole, programTypes: string[]): MenuType {
  if (role === "super_admin" || role === "admin" || role === "coordinacion") return "admin";
  // finanzas role = B2B/empresa user (placeholder until 'empresa' role exists)
  if (role === "finanzas") return "b2b";
  if (role === "docente") return "docente";
  if (role === "estudiante") {
    if (programTypes.includes("carrera"))   return "alumno";
    if (programTypes.includes("bootcamp"))  return "bootcamp";
    if (programTypes.includes("preuni"))    return "preuni";
    if (programTypes.includes("curso"))     return "cursos_pro";
    // Enrolled but type not matched or no enrollments yet → default alumno view
    return "alumno";
  }
  return "alumno";
}

function getSectionsForMenuType(
  type: MenuType,
  hasCertEnrollment: boolean,
): NavSection[] {
  let base: NavSection[];
  switch (type) {
    case "alumno":     base = MENU_ALUMNO;     break;
    case "bootcamp":   base = MENU_BOOTCAMP;   break;
    case "preuni":     base = MENU_PREUNI;     break;
    case "cursos_pro": base = MENU_CURSOS_PRO; break;
    case "docente":    return MENU_DOCENTE;
    case "admin":      return MENU_ADMIN;

    case "b2b":        return MENU_B2B;
  }

  // Inject EXPLORAR section before MI CUENTA (last section).
  // Inject CERTIFICACIONES section after EXPLORAR when the user has cert enrollment.
  const last = base[base.length - 1];
  const middle = base.slice(0, -1);

  if (hasCertEnrollment) {
    return [...middle, SECTION_EXPLORAR, SECTION_CERTIFICACIONES, last];
  }
  return [...middle, SECTION_EXPLORAR, last];
}

// ─── Role display labels ──────────────────────────────────────────────────────

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Administrador",
  coordinacion: "Coordinacion",
  docente: "Docente",
  estudiante: "Estudiante",
  finanzas: "Empresa", // B2B/corporate user
};

// ─── Component ────────────────────────────────────────────────────────────────

interface SidebarProps {
  serverUser?: { id: string; email: string } | null;
  serverProfile?: Profile | null;
  serverProgramTypes?: string[];
  serverHasCertEnrollment?: boolean;
}

export default function Sidebar({
  serverUser,
  serverProfile,
  serverProgramTypes = [],
  serverHasCertEnrollment = false,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Use server-fetched data as initial state (authoritative)
  const [user, setUser]                   = useState<{ id: string; email: string } | null>(serverUser ?? null);
  const [profile, setProfile]             = useState<Profile | null>((serverProfile as Profile) ?? null);
  const [programTypes, setProgramTypes]   = useState<string[]>(serverProgramTypes);
  const [hasCertEnrollment, setHasCert]   = useState(serverHasCertEnrollment);
  const [collapsed, setCollapsed]         = useState(false);
  // If server data is available, skip loading state entirely
  const [loading, setLoading]             = useState(!serverUser);

  useEffect(() => {
    // Skip client-side fetch if server already provided the data
    if (serverUser) return;

    const supabase = createClient();

    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }

      setUser({ id: authUser.id, email: authUser.email ?? "" });

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      // For estudiante role: fetch ALL active program enrollments + cert enrollments
      if (profileData?.role === "estudiante") {
        // 1. All active program enrollments (may be multiple)
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("programs(type)")
          .eq("user_id", authUser.id)
          .eq("status", "active");

        if (enrollments) {
          const types = enrollments
            .map((e) => {
              const prog = e.programs as unknown as { type: string } | null;
              return prog?.type ?? null;
            })
            .filter((t): t is string => t !== null);
          setProgramTypes(types);
        }

        // 2. Check for any certification enrollment
        const { data: certEnrollments } = await supabase
          .from("certification_enrollments")
          .select("id")
          .eq("user_id", authUser.id)
          .limit(1);

        setHasCert(!!(certEnrollments && certEnrollments.length > 0));
      }

      setLoading(false);
    }

    loadUser();
  }, [serverUser]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string): boolean {
    if (href.startsWith("http")) return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/descubre/b2b") return pathname === "/descubre/b2b";
    if (href === "/admin" && pathname !== "/admin") return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  const role: UserRole = profile?.role ?? "estudiante";
  const menuType   = getMenuType(role, programTypes);
  const sections   = getSectionsForMenuType(menuType, hasCertEnrollment);
  const roleLabel  = ROLE_LABELS[role] ?? role;

  // ─── Loading skeleton ────────────────────────────────────────────────────

  if (loading) {
    return (
      <aside
        className={`hidden lg:flex flex-col h-screen bg-[#0D1B30] border-r border-white/[0.06] transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        <div className="h-16 flex items-center px-4 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-lg bg-yellow-400/20 animate-pulse" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-9 rounded-lg bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      </aside>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-[#0D1B30] border-r border-white/[0.06] transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06] flex-shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group overflow-hidden"
        >
          {collapsed ? (
            <div className="w-9 h-9 rounded-lg bg-[#FBBC0C] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Brain className="w-5 h-5 text-[#0A1628]" />
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

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3">
        {sections.map((section, sectionIndex) => (
          <div key={`${section.label}-${sectionIndex}`} className={sectionIndex > 0 ? "mt-6" : ""}>

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

      {/* ── XP bar (students only) ───────────────────────────────────────── */}
      {!collapsed && profile && (role === "estudiante") && (
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40 select-none">
                Nivel XP
              </span>
              <span className="text-xs font-bold text-[#FBBC0C] font-[family-name:var(--font-space-grotesk)]">
                {profile.nivel_xp ?? 0}
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] rounded-full transition-all duration-500"
                style={{ width: `${Math.min((profile.nivel_xp ?? 0) % 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── User & collapse toggle ───────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] p-3 flex-shrink-0">

        {/* Expanded: name + role + logout */}
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
              <p className="text-sm font-medium text-white truncate leading-tight">
                {profile?.full_name || user.email}
              </p>
              <p className="text-[10px] text-white/40 truncate leading-tight mt-0.5">
                {roleLabel}
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
