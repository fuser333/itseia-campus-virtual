'use client';

/**
 * Sidebar del Docente · Campus v2 (Opción B · FASE 3).
 *
 * Modo "árbol":
 *  · Dashboard general → /dashboard-docente
 *  · Sección "PRODUCTOS QUE DICTO": cada producto asignado expande sus cohortes.
 *  · Cada cohorte expande: Dashboard · Sesiones · (Alumnos · Grabaciones placeholders)
 *  · Footer: Mi perfil · Switch a Admin (si role admin/super_admin) · Cerrar sesión.
 *
 * El producto activo se infiere del pathname `/[producto]/...` y se resalta
 * con el accent color del YAML (`--producto-{id}`). Las demás ramas quedan
 * colapsadas por default; el usuario las expande con click.
 *
 * Diseño Client por ser interactivo (collapse + sign-out). Las cohortes vienen
 * como prop desde el Server Component layout (que sí puede leer YAML + tablas).
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  User,
  Shield,
  Flame,
  Briefcase,
  Rocket,
  Award,
  Building2,
  GraduationCap,
  Eye,
  BookOpen,
  Calendar,
  Users,
  Video,
  Radio,
} from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ProductoSlug =
  | 'preuni'
  | 'cursos-pro'
  | 'bootcamp'
  | 'mdt'
  | 'b2b'
  | 'certificaciones'
  | 'carreras'
  | 'demo';

export interface CohorteAsignadaSidebar {
  producto: ProductoSlug;
  cohorte_slug: string;
  nombre_publico: string;
  estado: string;
  rol_en_cohorte: 'titular' | 'asistente';
}

interface Props {
  userName: string;
  userEmail?: string;
  /** Rol del usuario (para mostrar el switch Admin si aplica). */
  role: string;
  cohortes: CohorteAsignadaSidebar[];
}

// ─── Catálogo estático de productos (espejo de YAML) ──────────────────────────

type IconComponent = React.ComponentType<{
  className?: string;
  style?: React.CSSProperties;
}>;

interface ProductoMeta {
  id: ProductoSlug;
  nombre: string;
  icon: IconComponent;
  cssVar: string;
}

const PRODUCTOS: Record<ProductoSlug, ProductoMeta> = {
  preuni: {
    id: 'preuni',
    nombre: 'Preuniversitario IGNITE',
    icon: Flame,
    cssVar: '--producto-preuni',
  },
  'cursos-pro': {
    id: 'cursos-pro',
    nombre: 'Cursos Profesionales',
    icon: Briefcase,
    cssVar: '--producto-cursos-pro',
  },
  bootcamp: {
    id: 'bootcamp',
    nombre: 'Bootcamp Intensivo',
    icon: Rocket,
    cssVar: '--producto-bootcamp',
  },
  mdt: {
    id: 'mdt',
    nombre: 'Cursos MDT',
    icon: Award,
    cssVar: '--producto-mdt',
  },
  b2b: {
    id: 'b2b',
    nombre: 'Cursos B2B',
    icon: Building2,
    cssVar: '--producto-b2b',
  },
  certificaciones: {
    id: 'certificaciones',
    nombre: 'Certificaciones',
    icon: BookOpen,
    cssVar: '--producto-certificaciones',
  },
  carreras: {
    id: 'carreras',
    nombre: 'Carreras 3er Nivel',
    icon: GraduationCap,
    cssVar: '--producto-carreras',
  },
  demo: {
    id: 'demo',
    nombre: 'Demo Pública',
    icon: Eye,
    cssVar: '--producto-demo',
  },
};

const ADMIN_ROLES = new Set(['super_admin', 'admin', 'coordinacion']);

// ─── Componente ──────────────────────────────────────────────────────────────

export default function DocenteSidebar({
  userName,
  userEmail,
  role,
  cohortes,
}: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? '';

  // Agrupar cohortes por producto (mantiene orden de inserción de PRODUCTOS).
  const grupos = useMemo(() => {
    const byProducto = new Map<ProductoSlug, CohorteAsignadaSidebar[]>();
    for (const c of cohortes) {
      if (!(c.producto in PRODUCTOS)) continue;
      const arr = byProducto.get(c.producto) ?? [];
      arr.push(c);
      byProducto.set(c.producto, arr);
    }
    // Orden canónico por catálogo de productos
    return (Object.keys(PRODUCTOS) as ProductoSlug[])
      .map((id) => ({ producto: PRODUCTOS[id], cohortes: byProducto.get(id) ?? [] }))
      .filter((g) => g.cohortes.length > 0);
  }, [cohortes]);

  // Detectar producto activo y cohorte activa desde el pathname.
  const { activeProducto, activeCohorte } = useMemo(() => {
    // pathname patterns:
    //   /[producto]
    //   /[producto]/[cohorteSlug]
    //   /[producto]/[cohorteSlug]/sesion/[num]
    const segments = pathname.split('/').filter(Boolean);
    const first = segments[0] as ProductoSlug | undefined;
    const second = segments[1];
    if (first && first in PRODUCTOS) {
      return { activeProducto: first, activeCohorte: second ?? null };
    }
    return { activeProducto: null, activeCohorte: null };
  }, [pathname]);

  // Expansion state: producto activo abierto por default; resto colapsado.
  const [expanded, setExpanded] = useState<Set<ProductoSlug>>(() => {
    const initial = new Set<ProductoSlug>();
    if (activeProducto) initial.add(activeProducto);
    // Si solo hay 1 producto, lo abrimos también
    if (grupos.length === 1) initial.add(grupos[0].producto.id);
    return initial;
  });

  const [collapsed, setCollapsed] = useState(false);

  function toggleProducto(id: ProductoSlug) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  const isAdminLevel = ADMIN_ROLES.has(role);
  const dashboardActive = pathname === '/dashboard-docente';

  return (
    <aside
      className={`flex h-screen flex-col border-r transition-all ${
        collapsed ? 'w-16' : 'w-72'
      }`}
      style={{
        backgroundColor: 'var(--sidebar)',
        borderColor: 'var(--sidebar-border)',
        color: 'var(--sidebar-foreground)',
      }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between border-b px-4 py-4"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        {!collapsed && (
          <Link
            href="/dashboard-docente"
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
          >
            <span
              className="rounded-md px-2 py-1 text-xs"
              style={{
                backgroundColor: 'var(--itseia-gold)',
                color: 'var(--itseia-navy-dark)',
              }}
            >
              ITSEIA
            </span>
            <span className="opacity-80">Docente</span>
          </Link>
        )}
        <button
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          onClick={() => setCollapsed((v) => !v)}
          className="rounded p-1.5 transition hover:bg-white/5"
          style={{ color: 'var(--itseia-text)' }}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* ── Dashboard general ────────────────────────────────── */}
      <div className="px-2 pt-3">
        <Link
          href="/dashboard-docente"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition"
          style={{
            backgroundColor: dashboardActive
              ? 'rgba(251,188,12,0.12)'
              : 'transparent',
            color: dashboardActive ? 'var(--itseia-gold)' : 'var(--itseia-text)',
          }}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Dashboard general</span>}
        </Link>
      </div>

      {/* ── Productos que dicto ──────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2 pt-4">
        {!collapsed && (
          <div
            className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest opacity-50"
          >
            Productos que dicto
          </div>
        )}

        {grupos.length === 0 && !collapsed && (
          <div className="rounded-lg border border-dashed px-3 py-4 text-xs opacity-60"
               style={{ borderColor: 'var(--sidebar-border)' }}>
            Aún no tienes cohortes asignadas. Pídele a Coordinación que te
            asigne un grupo.
          </div>
        )}

        <ul className="space-y-1">
          {grupos.map(({ producto, cohortes }) => {
            const Icon = producto.icon;
            const isActive = activeProducto === producto.id;
            const isOpen = expanded.has(producto.id);
            const accent = `var(${producto.cssVar})`;

            return (
              <li key={producto.id}>
                <button
                  onClick={() => toggleProducto(producto.id)}
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/5"
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(255,255,255,0.04)'
                      : 'transparent',
                    color: isActive ? accent : 'var(--itseia-text)',
                  }}
                  aria-expanded={isOpen}
                >
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: accent }}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate font-semibold">
                        {producto.nombre}
                      </span>
                      <span className="text-[10px] opacity-50">
                        {cohortes.length}
                      </span>
                      {isOpen ? (
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                      )}
                    </>
                  )}
                </button>

                {/* Cohortes anidadas */}
                {!collapsed && isOpen && (
                  <ul
                    className="mt-1 space-y-0.5 border-l pl-3 ml-5"
                    style={{ borderColor: 'var(--sidebar-border)' }}
                  >
                    {cohortes.map((c) => (
                      <CohorteNode
                        key={`${c.producto}::${c.cohorte_slug}`}
                        cohorte={c}
                        isActive={
                          activeProducto === c.producto &&
                          activeCohorte === c.cohorte_slug
                        }
                        accentVar={producto.cssVar}
                      />
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div
        className="border-t px-2 py-3"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        {!collapsed && (
          <div className="mb-2 px-3 text-[11px] opacity-60">
            <div className="truncate font-semibold">{userName}</div>
            {userEmail && (
              <div className="truncate text-[10px] opacity-70">{userEmail}</div>
            )}
          </div>
        )}

        <ul className="space-y-0.5">
          <li>
            <Link
              href="/perfil"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition hover:bg-white/5"
            >
              <User className="h-3.5 w-3.5 shrink-0" />
              {!collapsed && <span>Mi perfil</span>}
            </Link>
          </li>

          {isAdminLevel && (
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-white/5"
                style={{ color: 'var(--itseia-sky)' }}
              >
                <Shield className="h-3.5 w-3.5 shrink-0" />
                {!collapsed && <span>Cambiar a Admin →</span>}
              </Link>
            </li>
          )}

          <li>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition hover:bg-white/5"
              style={{ color: 'var(--itseia-coral)' }}
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              {!collapsed && <span>Cerrar sesión</span>}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

// ─── Nodo de cohorte ──────────────────────────────────────────────────────────

function CohorteNode({
  cohorte,
  isActive,
  accentVar,
}: {
  cohorte: CohorteAsignadaSidebar;
  isActive: boolean;
  accentVar: string;
}) {
  const accent = `var(${accentVar})`;
  const base = `/${cohorte.producto}/${cohorte.cohorte_slug}`;

  return (
    <li>
      <Link
        href={base}
        className="flex items-center gap-2 rounded px-3 py-1.5 text-xs transition hover:bg-white/5"
        style={{
          color: isActive ? accent : 'var(--itseia-text)',
          opacity: isActive ? 1 : 0.85,
          backgroundColor: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
        }}
      >
        {cohorte.estado === 'activa' ? (
          <Radio className="h-3 w-3 shrink-0 animate-pulse" style={{ color: accent }} />
        ) : (
          <Calendar className="h-3 w-3 shrink-0 opacity-50" />
        )}
        <span className="flex-1 truncate">{cohorte.nombre_publico}</span>
        {cohorte.rol_en_cohorte === 'asistente' && (
          <span className="text-[9px] uppercase opacity-50">aux</span>
        )}
      </Link>

      {isActive && (
        <ul className="mt-0.5 space-y-0.5 border-l pl-3 ml-2"
            style={{ borderColor: 'var(--sidebar-border)' }}>
          <SubLink href={base} label="Dashboard" icon={LayoutDashboard} />
          <SubLink
            href={`${base}/sesion/1`}
            label="Sesiones"
            icon={BookOpen}
          />
          <SubLink href={`${base}#alumnos`} label="Alumnos" icon={Users} />
          <SubLink href={`${base}#grabaciones`} label="Grabaciones" icon={Video} />
        </ul>
      )}
    </li>
  );
}

function SubLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: IconComponent;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-2 rounded px-2 py-1 text-[11px] opacity-70 transition hover:bg-white/5 hover:opacity-100"
      >
        <Icon className="h-3 w-3 shrink-0" />
        <span>{label}</span>
      </Link>
    </li>
  );
}
