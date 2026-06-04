'use client';

/**
 * Sidebar del Admin · Campus v2 (Opción B · FASE 4).
 *
 * Modo "panel maestro":
 *  · Panel Admin → /panel-admin
 *  · Sección "PRODUCTOS" (8 cards): cada uno abre /[producto]
 *  · Sección "OPERACIÓN": Finanzas · Usuarios · Marketing/Leads
 *  · Sección "HERRAMIENTAS": ai-usage · Integridad · Configuración
 *  · Footer: Mi perfil · Switch a Docente (super_admin/admin) · Cerrar sesión
 *
 * El sidebar es Client por interactividad (collapse + sign-out). La auth + role
 * se valida en el Server Component layout que lo monta.
 *
 * COEXISTENCIA: Mientras la ruta legacy `app/admin/` exista, las URLs duplicadas
 * (`/admin/users`, `/admin/payments`) las sigue sirviendo el shell legacy.
 * El sidebar v2 apunta a esas mismas URLs cuando aún no hay versión v2 (las
 * etiquetas internas viven en route group `(admin)` con URLs nuevas).
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  GraduationCap,
  Flame,
  Briefcase,
  Rocket,
  Award,
  Building2,
  BookOpen,
  Eye,
  DollarSign,
  Users,
  Megaphone,
  BrainCircuit,
  ShieldCheck,
  Settings,
  Presentation,
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

interface Props {
  userName: string;
  userEmail?: string;
  /** Rol del usuario (para mostrar el switch Docente si aplica). */
  role: string;
}

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

// Catálogo estático espejo de YAML (orden canónico del SPEC §7).
const PRODUCTOS: ProductoMeta[] = [
  { id: 'preuni', nombre: 'Preuniversitario', icon: Flame, cssVar: '--producto-preuni' },
  { id: 'cursos-pro', nombre: 'Cursos Profesionales', icon: Briefcase, cssVar: '--producto-cursos-pro' },
  { id: 'bootcamp', nombre: 'Bootcamp', icon: Rocket, cssVar: '--producto-bootcamp' },
  { id: 'mdt', nombre: 'Cursos MDT', icon: Award, cssVar: '--producto-mdt' },
  { id: 'b2b', nombre: 'Cursos B2B', icon: Building2, cssVar: '--producto-b2b' },
  { id: 'certificaciones', nombre: 'Certificaciones', icon: BookOpen, cssVar: '--producto-certificaciones' },
  { id: 'carreras', nombre: 'Carreras 3er Nivel', icon: GraduationCap, cssVar: '--producto-carreras' },
  { id: 'demo', nombre: 'Demo Pública', icon: Eye, cssVar: '--producto-demo' },
];

const DOCENTE_ROLES = new Set(['super_admin', 'admin']);

// ─── Componente ──────────────────────────────────────────────────────────────

export default function AdminSidebar({ userName, userEmail, role }: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const [collapsed, setCollapsed] = useState(false);

  const isDashboardActive = pathname === '/panel-admin';

  // Detectar producto activo desde el pathname `/panel-admin/[producto]/...`.
  const activeProducto = useMemo<ProductoSlug | null>(() => {
    const segments = pathname.split('/').filter(Boolean);
    // Esperamos: ['panel-admin', '<producto>', ...]
    if (segments[0] !== 'panel-admin') return null;
    const slug = segments[1];
    const match = PRODUCTOS.find((p) => p.id === slug);
    return match?.id ?? null;
  }, [pathname]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  const showSwitchDocente = DOCENTE_ROLES.has(role);

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
            href="/panel-admin"
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
            <span className="opacity-80">Admin</span>
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

      {/* ── Panel admin (dashboard general) ───────────────────── */}
      <div className="px-2 pt-3">
        <Link
          href="/panel-admin"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition"
          style={{
            backgroundColor: isDashboardActive
              ? 'rgba(251,188,12,0.12)'
              : 'transparent',
            color: isDashboardActive
              ? 'var(--itseia-gold)'
              : 'var(--itseia-text)',
          }}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Panel admin</span>}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pt-4">
        {/* ── Productos ─────────────────────────────────────── */}
        {!collapsed && (
          <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest opacity-50">
            Productos
          </div>
        )}

        <ul className="space-y-0.5">
          {PRODUCTOS.map((producto) => {
            const Icon = producto.icon;
            const isActive = activeProducto === producto.id;
            const accent = `var(${producto.cssVar})`;

            return (
              <li key={producto.id}>
                <Link
                  href={`/panel-admin/${producto.id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5"
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(255,255,255,0.04)'
                      : 'transparent',
                    color: isActive ? accent : 'var(--itseia-text)',
                  }}
                >
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: accent }}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate font-medium">
                      {producto.nombre}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Operación ──────────────────────────────────────── */}
        {!collapsed && (
          <div className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-widest opacity-50">
            Operación
          </div>
        )}

        <ul className="space-y-0.5">
          <SidebarLink
            href="/admin/payments"
            label="Finanzas"
            icon={DollarSign}
            collapsed={collapsed}
            active={pathname.startsWith('/admin/payments')}
          />
          <SidebarLink
            href="/admin/users"
            label="Usuarios"
            icon={Users}
            collapsed={collapsed}
            active={pathname.startsWith('/admin/users')}
          />
          <SidebarLink
            href="/admin/enrollments"
            label="Marketing y leads"
            icon={Megaphone}
            collapsed={collapsed}
            active={pathname.startsWith('/admin/enrollments')}
          />
        </ul>

        {/* ── Herramientas ───────────────────────────────────── */}
        {!collapsed && (
          <div className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-widest opacity-50">
            Herramientas
          </div>
        )}

        <ul className="space-y-0.5">
          <SidebarLink
            href="/admin/ai-usage"
            label="Uso de IA"
            icon={BrainCircuit}
            collapsed={collapsed}
            active={pathname.startsWith('/admin/ai-usage')}
          />
          <SidebarLink
            href="/admin/integridad"
            label="Integridad académica"
            icon={ShieldCheck}
            collapsed={collapsed}
            active={pathname.startsWith('/admin/integridad')}
          />
          <SidebarLink
            href="/admin/programs"
            label="Programas"
            icon={Presentation}
            collapsed={collapsed}
            active={pathname.startsWith('/admin/programs')}
          />
          <SidebarLink
            href="/admin"
            label="Vista clásica"
            icon={Settings}
            collapsed={collapsed}
            active={pathname === '/admin'}
          />
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

          {showSwitchDocente && (
            <li>
              <Link
                href="/dashboard-docente"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-white/5"
                style={{ color: 'var(--itseia-sky)' }}
              >
                <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                {!collapsed && <span>Cambiar a Docente →</span>}
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SidebarLink({
  href,
  label,
  icon: Icon,
  collapsed,
  active,
}: {
  href: string;
  label: string;
  icon: IconComponent;
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5"
        style={{
          backgroundColor: active ? 'rgba(255,255,255,0.04)' : 'transparent',
          color: active ? 'var(--itseia-gold)' : 'var(--itseia-text)',
        }}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="flex-1 truncate">{label}</span>}
      </Link>
    </li>
  );
}
