'use client';

/**
 * Página 404 · Campus v2 (actualizada 04-jun-2026).
 *
 * Client Component: usa usePathname() para detectar el contexto de la URL
 * y mostrar un botón de navegación inteligente según el producto activo.
 *
 * - URL contiene /cursos-pro → "Ir a Cursos Pro" → /cursos-pro
 * - URL contiene /preuni     → "Ir a Preuni"     → /preuni
 * - URL contiene /bootcamp   → "Ir a Bootcamp"   → /bootcamp
 * - Default                  → "Ir al dashboard" → /dashboard
 *
 * NUNCA redirige a "/" (marketing público) desde dentro del campus.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContextAction {
  label: string;
  href: string;
}

function detectContextAction(pathname: string | null): ContextAction {
  if (!pathname) return { label: 'Ir al dashboard', href: '/dashboard' };

  if (pathname.includes('/cursos-pro')) {
    return { label: 'Ir a Cursos Pro', href: '/cursos-pro' };
  }
  if (pathname.includes('/preuni')) {
    return { label: 'Ir a Preuni', href: '/preuni' };
  }
  if (pathname.includes('/bootcamp')) {
    return { label: 'Ir a Bootcamp', href: '/bootcamp' };
  }
  if (pathname.includes('/carreras')) {
    return { label: 'Ir a Carreras', href: '/carreras' };
  }
  if (pathname.includes('/mdt')) {
    return { label: 'Ir a Cursos MDT', href: '/mdt' };
  }
  if (pathname.includes('/b2b')) {
    return { label: 'Ir a Cursos B2B', href: '/b2b' };
  }
  if (pathname.includes('/certificaciones')) {
    return { label: 'Ir a Certificaciones', href: '/certificaciones' };
  }
  if (pathname.includes('/admin')) {
    return { label: 'Ir al panel admin', href: '/admin' };
  }
  if (pathname.includes('/docente') || pathname.includes('/docente-shell')) {
    return { label: 'Ir al panel docente', href: '/dashboard-docente' };
  }

  return { label: 'Ir al dashboard', href: '/dashboard' };
}

export default function NotFound() {
  const pathname = usePathname();
  const action = detectContextAction(pathname);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--itseia-navy-dark)' }}
    >
      <div className="text-center max-w-md">
        <div className="relative mb-8 inline-block">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto"
            style={{
              backgroundColor: 'rgba(251,188,12,0.10)',
              border: '1px solid rgba(251,188,12,0.20)',
            }}
          >
            <Brain className="w-12 h-12" style={{ color: 'var(--itseia-gold)' }} />
          </div>
          <div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(240,132,109,0.20)',
              border: '1px solid rgba(240,132,109,0.30)',
            }}
          >
            <span
              className="font-bold text-sm"
              style={{ color: 'var(--itseia-coral)' }}
            >
              ?
            </span>
          </div>
        </div>

        <h1
          className="text-6xl font-extrabold mb-2 font-heading"
          style={{ color: 'var(--itseia-text)' }}
        >
          404
        </h1>
        <h2
          className="text-xl font-semibold mb-3"
          style={{ color: 'var(--itseia-text)', opacity: 0.8 }}
        >
          Página no encontrada
        </h2>
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: 'var(--itseia-text)', opacity: 0.4 }}
        >
          La página que buscas no existe o fue movida. Pero no te preocupes,
          la IA aún no ha conquistado todas las URLs.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={action.href}>
            <Button
              className="font-semibold gap-2"
              style={{
                backgroundColor: 'var(--itseia-gold)',
                color: 'var(--itseia-navy-dark)',
              }}
            >
              {action.label}
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="gap-2"
              style={{
                borderColor: 'rgba(255,255,255,0.10)',
                color: 'var(--itseia-text)',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Mi dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
