'use client';

/**
 * Sidebar del Alumno · Campus v2 (Opción B).
 *
 * Renderiza:
 *  · Logo ITSEIA
 *  · Producto activo (color accent del YAML del producto)
 *  · Sección "MI [PRODUCTO]": Dashboard · Mis Sesiones · Mi Progreso
 *  · Sección "AI LAB": Tutor · Flash Cards · Segundo Cerebro
 *  · Sección "RECURSOS": Materiales · Comunidad · Asesorías
 *  · Sección "DESCUBRE ITSEIA" (cross-promo de los OTROS 7 productos)
 *  · Footer: Mi Cuenta · Pagos · Cerrar sesión
 *
 * El producto activo se infiere del pathname `/[producto]/...`. Si la URL no
 * incluye un producto válido (caso: alumno recién logueado en `/`), usa el
 * primer enrollment activo.
 *
 * NUNCA muestra el producto activo en la sección DESCUBRE (regla 5 SPEC).
 *
 * Diseño hardcoded (mínimo) de los 8 productos · datos coinciden con los YAML
 * de `src/config/productos/`. Esta sidebar es CLIENT, así que NO puede leer
 * los YAML directamente (server-only). En FASE 3 podemos pasar la lista desde
 * el layout si necesitamos info más rica.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  Sparkles,
  Brain,
  Zap,
  BookOpen,
  Users,
  Headphones,
  ChevronLeft,
  ChevronRight,
  LogOut,
  CreditCard,
  User,
  Flame,
  Briefcase,
  Award,
  Building2,
  GraduationCap,
  Rocket,
  Eye,
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

interface EnrollmentInfo {
  producto: ProductoSlug;
  cohorte_slug: string;
  nombre_cohorte: string;
}

interface Props {
  userName: string;
  userEmail?: string;
  enrollments: EnrollmentInfo[];
}

// ─── Catálogo estático de productos (espejo de YAML) ──────────────────────────
// Se mantiene en sync con `src/config/productos/<id>.yaml`.

type IconComponent = React.ComponentType<{
  className?: string;
  style?: React.CSSProperties;
}>;

interface ProductoMeta {
  id: ProductoSlug;
  nombre: string;
  icon: IconComponent;
  /** Variable CSS para el accent (definida en globals.css). */
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
    icon: Award,
    cssVar: '--producto-certificaciones',
  },
  carreras: {
    id: 'carreras',
    nombre: 'Carreras de IA',
    icon: GraduationCap,
    cssVar: '--producto-carreras',
  },
  demo: {
    id: 'demo',
    nombre: 'Tour Demo',
    icon: Eye,
    cssVar: '--producto-demo',
  },
};

/**
 * Orden canónico de los 8 productos (incluye preuni).
 * El cross-promo del sidebar filtra el activo dinámicamente.
 * (Equivalente a PRODUCTO_IDS de lib/productos/types.ts).
 */
const TODOS_LOS_PRODUCTOS: ProductoSlug[] = [
  'preuni',
  'carreras',
  'cursos-pro',
  'bootcamp',
  'mdt',
  'b2b',
  'certificaciones',
  'demo',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Detecta el producto activo desde el pathname `/[producto]/...`
 * (o desde el primer enrollment si la ruta no lo incluye).
 */
function detectProductoActivo(
  pathname: string,
  enrollments: EnrollmentInfo[]
): EnrollmentInfo | null {
  const slugs = Object.keys(PRODUCTOS) as ProductoSlug[];
  for (const slug of slugs) {
    if (pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)) {
      const enrolled = enrollments.find((e) => e.producto === slug);
      if (enrolled) return enrolled;
      // Fallback: si está en /[producto]/ pero no tiene enrollment,
      // mostramos el sidebar del producto pero sin cohorte
      return {
        producto: slug,
        cohorte_slug: '',
        nombre_cohorte: PRODUCTOS[slug].nombre,
      };
    }
  }
  return enrollments[0] ?? null;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AlumnoSidebar({
  userName,
  userEmail,
  enrollments,
}: Props) {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const activo = detectProductoActivo(pathname, enrollments);

  const productoActivo: ProductoMeta = activo
    ? PRODUCTOS[activo.producto]
    : PRODUCTOS.preuni;
  const accentVar = `var(${productoActivo.cssVar})`;
  const cohorteSlug = activo?.cohorte_slug ?? '';

  // Cross-promo: los 8 productos menos el activo (regla 5 SPEC).
  const crossPromo = TODOS_LOS_PRODUCTOS.filter(
    (slug) => slug !== productoActivo.id
  );

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  function isActive(href: string): boolean {
    if (href === `/${productoActivo.id}`) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + '/');
  }

  if (collapsed) {
    return (
      <aside
        className="flex h-screen w-16 flex-col items-center border-r py-4"
        style={{
          backgroundColor: 'var(--sidebar)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          className="rounded-lg p-2 hover:bg-white/5"
          style={{ color: 'var(--itseia-text)' }}
          aria-label="Expandir sidebar"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </aside>
    );
  }

  const ActivoIcon = productoActivo.icon;

  return (
    <aside
      className="flex h-screen w-64 flex-col border-r"
      style={{
        backgroundColor: 'var(--sidebar)',
        borderColor: 'var(--sidebar-border)',
        color: 'var(--itseia-text)',
      }}
    >
      {/* ── Header ITSEIA ──────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between border-b px-4 py-4"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        <Link
          href={`/${productoActivo.id}`}
          className="flex items-center gap-2"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg font-bold"
            style={{
              backgroundColor: accentVar,
              color: 'var(--itseia-navy-dark)',
            }}
          >
            I
          </div>
          <div className="text-sm font-bold tracking-wider">ITSEIA</div>
        </Link>
        <button
          onClick={() => setCollapsed(true)}
          className="rounded-lg p-1.5 hover:bg-white/5"
          aria-label="Colapsar sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* ── Producto activo card ──────────────────────────────────────── */}
      <div
        className="border-b px-4 py-4"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        <div
          className="rounded-lg p-3"
          style={{
            backgroundColor: 'var(--itseia-navy)',
            borderLeft: `3px solid ${accentVar}`,
          }}
        >
          <div className="flex items-center gap-2">
            <ActivoIcon
              className="h-5 w-5"
              style={{ color: accentVar }}
            />
            <div className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Producto activo
            </div>
          </div>
          <div className="mt-1 text-sm font-bold leading-tight">
            {productoActivo.nombre}
          </div>
          {activo?.nombre_cohorte && activo.cohorte_slug && (
            <div className="mt-1 text-xs opacity-70 truncate">
              {activo.nombre_cohorte}
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll body ───────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* MI [PRODUCTO] */}
        <SidebarSection title={`MI ${productoActivo.nombre.toUpperCase()}`}>
          <SidebarLink
            href={`/${productoActivo.id}`}
            icon={LayoutDashboard}
            label="Dashboard"
            active={isActive(`/${productoActivo.id}`)}
            accentVar={accentVar}
          />
          {cohorteSlug && (
            <SidebarLink
              href={`/${productoActivo.id}/c/${cohorteSlug}`}
              icon={Calendar}
              label="Mis sesiones"
              active={isActive(`/${productoActivo.id}/c/${cohorteSlug}`)}
              accentVar={accentVar}
            />
          )}
          <SidebarLink
            href={`/${productoActivo.id}/progreso`}
            icon={TrendingUp}
            label="Mi progreso"
            active={isActive(`/${productoActivo.id}/progreso`)}
            accentVar={accentVar}
          />
        </SidebarSection>

        {/* AI LAB */}
        <SidebarSection title="AI LAB">
          <SidebarLink
            href="/ai-lab"
            icon={Sparkles}
            label="Tutor IA"
            active={isActive('/ai-lab')}
            accentVar={accentVar}
          />
          <SidebarLink
            href="/flashcards"
            icon={Zap}
            label="Flash Cards"
            active={isActive('/flashcards')}
            accentVar={accentVar}
          />
          <SidebarLink
            href="/biblioteca"
            icon={Brain}
            label="Segundo Cerebro"
            active={isActive('/biblioteca')}
            accentVar={accentVar}
          />
        </SidebarSection>

        {/* RECURSOS */}
        <SidebarSection title="RECURSOS">
          <SidebarLink
            href={`/${productoActivo.id}/materiales`}
            icon={BookOpen}
            label="Materiales"
            active={isActive(`/${productoActivo.id}/materiales`)}
            accentVar={accentVar}
          />
          <SidebarLink
            href="/foros"
            icon={Users}
            label="Comunidad"
            active={isActive('/foros')}
            accentVar={accentVar}
          />
          <SidebarLink
            href="/calendario"
            icon={Headphones}
            label="Asesorías"
            active={isActive('/calendario')}
            accentVar={accentVar}
          />
        </SidebarSection>

        {/* Divider */}
        <div
          className="my-3 border-t"
          style={{ borderColor: 'var(--sidebar-border)' }}
        />

        {/* DESCUBRE ITSEIA · cross-promo (sin auto-publicidad) */}
        <SidebarSection title="DESCUBRE ITSEIA">
          {crossPromo.map((slug) => {
            const meta = PRODUCTOS[slug];
            const Icon = meta.icon;
            const href = `/descubre?p=${slug}`;
            return (
              <SidebarLink
                key={slug}
                href={href}
                icon={Icon}
                label={meta.nombre}
                active={false}
                accentVar={`var(${meta.cssVar})`}
                small
              />
            );
          })}
        </SidebarSection>
      </nav>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div
        className="border-t px-3 py-3"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        <div className="mb-2 px-2 text-xs opacity-70 truncate">
          {userName}
          {userEmail && (
            <div className="text-[10px] opacity-60 truncate">{userEmail}</div>
          )}
        </div>
        <SidebarLink
          href="/profile"
          icon={User}
          label="Mi cuenta"
          active={isActive('/profile')}
          accentVar={accentVar}
        />
        <SidebarLink
          href="/payments"
          icon={CreditCard}
          label="Pagos"
          active={isActive('/payments')}
          accentVar={accentVar}
        />
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-white/5"
          style={{ color: 'var(--itseia-coral)' }}
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider opacity-50">
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  active,
  accentVar,
  small = false,
}: {
  href: string;
  icon: IconComponent;
  label: string;
  active: boolean;
  accentVar: string;
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition"
      style={{
        backgroundColor: active ? 'rgba(255,255,255,0.06)' : 'transparent',
        color: active ? accentVar : 'var(--itseia-text)',
      }}
    >
      <Icon
        className={small ? 'h-3.5 w-3.5' : 'h-4 w-4'}
        style={{ color: active ? accentVar : 'currentColor' }}
      />
      <span className={small ? 'text-xs truncate' : 'truncate'}>{label}</span>
    </Link>
  );
}
