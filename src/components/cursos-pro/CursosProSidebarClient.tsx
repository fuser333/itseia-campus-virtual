"use client";

/**
 * Sidebar de Cursos Profesionales · Campus v2.
 *
 * Diseño propio del producto "Cursos Profesionales" (NO copia del preuni).
 * Muestra:
 *  · Logo ITSEIA
 *  · Sección CURSOS PROFESIONALES: Dashboard · Mi Progreso · Asesorías
 *  · Sección MÓDULOS DEL CURSO: 4 módulos con fechas y sesiones colapsables
 *  · Sección RECURSOS
 *  · Divider
 *  · Sección DESCUBRE ITSEIA (cross-promo sin el producto activo)
 *  · Sección CUENTA: Mi cuenta · Pagos · WhatsApp Soporte · Cerrar sesión
 *  · Footer: avatar + nombre + email + "CURSOS PRO"
 *
 * Los datos de módulos y sesiones se reciben como props desde el layout (SC).
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  TrendingUp,
  Headphones,
  BookOpen,
  Users,
  GraduationCap,
  BookMarked,
  Rocket,
  Award,
  Building2,
  Stethoscope,
  MessageCircle,
  CreditCard,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ModuloInfo {
  id: string;
  num: number;
  name: string;
  slug: string | null;
  /** Rango de fechas legible: "6 jun - 20 jun" */
  dateRange: string;
  sesiones: SesionInfo[];
}

export interface SesionInfo {
  id: string;
  numInModule: number;
  title: string;
  /** ISO string de la sesión programada */
  scheduledAt: string;
  status: "scheduled" | "live" | "done" | "cancelled";
  href: string;
}

interface Props {
  courseSlug: string;
  courseName: string;
  modulos: ModuloInfo[];
  userName: string;
  userEmail?: string;
}

// ─── Cross-promo: productos (SIN cursos-pro que es el activo) ─────────────────

const CROSS_PROMO = [
  {
    href: "/descubre/carreras",
    label: "Carreras de IA (3)",
    icon: GraduationCap,
    highlight: true,
  },
  {
    href: "/descubre/cursos-mdt",
    label: "Cursos MDT (15)",
    icon: BookMarked,
    badge: "15",
  },
  { href: "/descubre/bootcamp", label: "Bootcamp 120h", icon: Rocket },
  { href: "/descubre/certificaciones", label: "Certificaciones", icon: Award },
  { href: "/descubre/b2b", label: "B2B Empresas", icon: Building2 },
  {
    href: "https://h3l.ai",
    label: "H3L Diagnóstico IA",
    icon: Stethoscope,
    external: true,
  },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSessionDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-EC", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function CursosProSidebarClient({
  courseSlug,
  courseName,
  modulos,
  userName,
  userEmail,
}: Props) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [openModulos, setOpenModulos] = useState<Set<string>>(new Set());

  function isActive(href: string): boolean {
    if (href.startsWith("http")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  function toggleModulo(moduleId: string) {
    setOpenModulos((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login?module=cursos-pro");
    router.refresh();
  }

  const initials = getInitials(userName || userEmail || "GI");

  // ── Collapsed ───────────────────────────────────────────────────────────────
  if (collapsed) {
    return (
      <aside className="hidden lg:flex flex-col h-screen w-[68px] flex-shrink-0 bg-[#0D1B30] border-r border-white/[0.06]">
        <div className="h-16 flex items-center justify-center border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-lg bg-[#FBBC0C] flex items-center justify-center font-bold text-[#0A1628] text-sm">
            I
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 py-4">
          <SidebarIconButton
            icon={LayoutDashboard}
            href={`/cursos-pro`}
            active={pathname === "/cursos-pro"}
            label="Dashboard"
          />
          <SidebarIconButton
            icon={TrendingUp}
            href={`/cursos-pro/progreso`}
            active={isActive("/cursos-pro/progreso")}
            label="Mi Progreso"
          />
        </div>
        <div className="border-t border-white/[0.06] py-3 flex justify-center">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
            aria-label="Expandir menú"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // ── Expanded ─────────────────────────────────────────────────────────────────
  return (
    <aside className="hidden lg:flex flex-col h-screen w-72 flex-shrink-0 bg-[#0D1B30] border-r border-white/[0.06]">
      {/* ── Logo ───────────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06]">
        <Link href="/cursos-pro" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#FBBC0C] flex items-center justify-center font-bold text-[#0A1628] text-sm flex-shrink-0">
            I
          </div>
          <span className="text-sm font-bold tracking-wider text-white">
            ITSEIA
          </span>
        </Link>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
          aria-label="Colapsar menú"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* ── Scroll body ────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3 space-y-5">

        {/* CURSOS PROFESIONALES */}
        <div>
          <SectionLabel label="CURSOS PROFESIONALES" />
          <div className="space-y-0.5 mt-1">
            <NavLink
              href="/cursos-pro"
              icon={LayoutDashboard}
              label="Dashboard"
              active={pathname === "/cursos-pro"}
            />
            <NavLink
              href="/cursos-pro/progreso"
              icon={TrendingUp}
              label="Mi Progreso"
              active={isActive("/cursos-pro/progreso")}
            />
            <NavLink
              href="/calendario"
              icon={Headphones}
              label="Asesorías"
              active={isActive("/calendario")}
            />
          </div>
        </div>

        {/* MÓDULOS DEL CURSO */}
        <div>
          <SectionLabel label={`MÓDULOS DEL CURSO · ${modulos.length > 0 ? modulos.length : 4} módulos`} />
          <div className="space-y-1 mt-1">
            {modulos.map((modulo) => {
              const isOpen = openModulos.has(modulo.id);
              const moduleUrl = modulo.slug
                ? `/cursos-pro/${courseSlug}/modulo/${modulo.slug}`
                : `/cursos-pro/${courseSlug}`;
              const anyActive = modulo.sesiones.some((s) => isActive(s.href));

              return (
                <div key={modulo.id} className="rounded-lg overflow-hidden">
                  {/* Módulo header */}
                  <button
                    onClick={() => toggleModulo(modulo.id)}
                    className={`w-full flex items-center gap-2 px-2 py-2.5 rounded-lg transition-all text-left ${
                      anyActive
                        ? "bg-[#FBBC0C]/[0.08] text-[#FBBC0C]"
                        : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                      anyActive ? "bg-[#FBBC0C]/20 text-[#FBBC0C]" : "bg-white/10 text-white/50"
                    }`}>
                      M{modulo.num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate leading-tight">
                        {modulo.name}
                      </p>
                      <p className="text-[10px] opacity-50 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {modulo.dateRange}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 flex-shrink-0 opacity-40 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Sesiones del módulo */}
                  {isOpen && (
                    <div className="ml-2 mt-0.5 space-y-0.5 border-l border-white/[0.06] pl-2">
                      {modulo.sesiones.map((sesion) => {
                        const active = isActive(sesion.href);
                        const isDone = sesion.status === "done";
                        const isLive = sesion.status === "live";

                        return (
                          <Link
                            key={sesion.id}
                            href={sesion.href}
                            className={`flex items-start gap-2 px-2 py-1.5 rounded-lg transition-all text-xs ${
                              active
                                ? "bg-[#FBBC0C]/[0.12] text-[#FBBC0C]"
                                : "text-white/55 hover:text-white hover:bg-white/[0.04]"
                            }`}
                          >
                            {/* Estado icon */}
                            <span className="mt-0.5 flex-shrink-0">
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : isLive ? (
                                <span className="w-3.5 h-3.5 flex items-center justify-center">
                                  <span className="w-2 h-2 rounded-full bg-[#F0846D] animate-pulse" />
                                </span>
                              ) : (
                                <Circle className={`w-3.5 h-3.5 ${active ? "text-[#FBBC0C]" : "text-white/20"}`} />
                              )}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium leading-tight">
                                S{sesion.numInModule} · {sesion.title}
                              </p>
                              <p className="text-[10px] opacity-50 mt-0.5 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {formatSessionDate(sesion.scheduledAt)}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                      {modulo.sesiones.length === 0 && (
                        <p className="px-2 py-1.5 text-[10px] text-white/30 italic">
                          Sesiones por confirmar
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {modulos.length === 0 && (
              <p className="px-2 py-1.5 text-[10px] text-white/30 italic">
                Módulos por cargar...
              </p>
            )}
          </div>
        </div>

        {/* RECURSOS */}
        <div>
          <SectionLabel label="RECURSOS" />
          <div className="space-y-0.5 mt-1">
            <NavLink
              href={`/cursos-pro/${courseSlug}`}
              icon={BookOpen}
              label="Materiales"
              active={isActive(`/cursos-pro/${courseSlug}`) && !pathname.includes("/modulo/")}
            />
            <NavLink
              href="/foros"
              icon={Users}
              label="Comunidad"
              active={isActive("/foros")}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* DESCUBRE ITSEIA */}
        <div>
          <SectionLabel label="DESCUBRE ITSEIA" />
          <div className="space-y-0.5 mt-1">
            {CROSS_PROMO.map((item) => {
              const Icon = item.icon;
              const highlight = "highlight" in item && item.highlight;
              const badge = "badge" in item ? item.badge : undefined;
              const external = "external" in item && item.external;

              if (highlight) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-2 rounded-lg px-2 py-2 transition-all bg-[#FBBC0C]/[0.10] border border-[#FBBC0C]/20 text-[#FBBC0C] hover:bg-[#FBBC0C]/[0.20]"
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-semibold truncate flex-1">
                      {item.label}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] flex-shrink-0 animate-pulse" />
                  </Link>
                );
              }

              const linkProps = external
                ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
                : {};

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  {...linkProps}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-white/55 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0 text-white/40" />
                  <span className="truncate flex-1">{item.label}</span>
                  {badge && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#73B8E7]/15 text-[#73B8E7] flex-shrink-0">
                      {badge}
                    </span>
                  )}
                  {external && (
                    <ExternalLink className="w-3 h-3 text-white/25 flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* CUENTA */}
        <div>
          <SectionLabel label="CUENTA" />
          <div className="space-y-0.5 mt-1">
            <Link
              href="https://wa.me/593959892034?text=Hola%2C%20necesito%20soporte%20con%20ITSEIA%20Cursos%20Profesionales"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-white/55 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-white/40" />
              <span className="truncate flex-1">Chat Soporte</span>
              <ExternalLink className="w-3 h-3 text-white/25 flex-shrink-0" />
            </Link>
            <NavLink
              href="/profile"
              icon={User}
              label="Mi cuenta"
              active={isActive("/profile")}
            />
            <NavLink
              href="/payments"
              icon={CreditCard}
              label="Pagos"
              active={isActive("/payments")}
            />
          </div>
        </div>
      </nav>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] p-3 flex-shrink-0">
        <div className="flex items-center gap-2.5 px-1 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#1F2F58] flex items-center justify-center flex-shrink-0 ring-2 ring-[#FBBC0C]/20">
            <span className="text-xs font-bold text-[#FBBC0C]">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate leading-tight">
              {userName || userEmail || "Estudiante"}
            </p>
            {userEmail && (
              <p className="text-[10px] text-white/40 truncate leading-tight mt-0.5">
                {userEmail}
              </p>
            )}
            <p className="text-[10px] text-[#FBBC0C]/70 leading-tight font-semibold uppercase tracking-wider">
              CURSOS PRO
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
        <button
          onClick={() => setCollapsed(true)}
          className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-white/25 hover:text-white/55 hover:bg-white/[0.04] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs">Colapsar</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/25 select-none">
      {label}
    </p>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-2.5 rounded-lg px-2 py-2 transition-all ${
        active
          ? "bg-[#FBBC0C]/[0.12] text-[#FBBC0C]"
          : "text-white/65 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <Icon
        className={`w-[16px] h-[16px] flex-shrink-0 ${
          active ? "text-[#FBBC0C]" : "text-white/45 group-hover:text-white/75"
        }`}
      />
      <span className="text-sm font-medium truncate flex-1 leading-none">
        {label}
      </span>
      {active && (
        <div className="h-1.5 w-1.5 rounded-full bg-[#FBBC0C] flex-shrink-0" />
      )}
    </Link>
  );
}

function SidebarIconButton({
  icon: Icon,
  href,
  active,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
        active
          ? "bg-[#FBBC0C]/[0.12] text-[#FBBC0C]"
          : "text-white/45 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <Icon className="w-5 h-5" />
    </Link>
  );
}
