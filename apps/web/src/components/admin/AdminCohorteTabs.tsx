'use client';

/**
 * AdminCohorteTabs · Cliente.
 *
 * Renderiza la barra de pestañas + el panel de la pestaña activa. Las 7 pestañas
 * son fijas para admin (no dependen del YAML del producto, a diferencia del
 * docente que tiene `docente.pestañas_sesion` configurable).
 *
 * El state vive en URL hash (#alumnos, #sesiones, etc.) para permitir links
 * directos desde el sidebar del docente o desde notificaciones.
 *
 * FASE 4 monta los 7 stubs. FASE 5+ los reemplaza por implementaciones reales.
 */

import { useEffect, useState } from 'react';
import {
  Users,
  CalendarClock,
  DollarSign,
  CheckSquare,
  FolderOpen,
  Video,
  Settings,
} from 'lucide-react';
import type { ProductoId } from '@/lib/productos/types';
import AlumnosTab from './tabs/AlumnosTab';
import SesionesTab from './tabs/SesionesTab';
import PagosTab from './tabs/PagosTab';
import AsistenciaTab from './tabs/AsistenciaTab';
import MaterialesTab from './tabs/MaterialesTab';
import GrabacionesTab from './tabs/GrabacionesTab';
import ConfigTab from './tabs/ConfigTab';

type TabId =
  | 'alumnos'
  | 'sesiones'
  | 'pagos'
  | 'asistencia'
  | 'materiales'
  | 'grabaciones'
  | 'config';

interface Props {
  producto: ProductoId;
  cohorteSlug: string;
  cohorteId: string | null;
  accent: string;
}

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabDef[] = [
  { id: 'alumnos', label: 'Alumnos', icon: Users },
  { id: 'sesiones', label: 'Sesiones', icon: CalendarClock },
  { id: 'pagos', label: 'Pagos', icon: DollarSign },
  { id: 'asistencia', label: 'Asistencia', icon: CheckSquare },
  { id: 'materiales', label: 'Materiales', icon: FolderOpen },
  { id: 'grabaciones', label: 'Grabaciones', icon: Video },
  { id: 'config', label: 'Configuración', icon: Settings },
];

const VALID_TABS = new Set<TabId>(TABS.map((t) => t.id));

function isTabId(v: string): v is TabId {
  return VALID_TABS.has(v as TabId);
}

export default function AdminCohorteTabs({
  producto,
  cohorteSlug,
  cohorteId,
  accent,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('alumnos');

  // Lee el hash inicial y se sincroniza con cambios de URL hash.
  useEffect(() => {
    function syncFromHash() {
      const h = window.location.hash.replace(/^#/, '');
      if (isTabId(h)) setActiveTab(h);
    }
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  function handleTabClick(id: TabId) {
    setActiveTab(id);
    // Actualiza el hash sin disparar scroll.
    if (typeof window !== 'undefined') {
      history.replaceState(null, '', `#${id}`);
    }
  }

  const tabProps = { producto, cohorteSlug, cohorteId };

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div
        className="flex flex-wrap gap-1 rounded-2xl border p-1"
        style={{
          borderColor: 'rgba(255,255,255,0.10)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
        role="tablist"
        aria-label="Pestañas de la cohorte"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition"
              style={{
                backgroundColor: isActive
                  ? 'rgba(255,255,255,0.06)'
                  : 'transparent',
                color: isActive ? accent : 'var(--itseia-text)',
                opacity: isActive ? 1 : 0.7,
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      <div role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'alumnos' && <AlumnosTab {...tabProps} />}
        {activeTab === 'sesiones' && <SesionesTab {...tabProps} />}
        {activeTab === 'pagos' && <PagosTab {...tabProps} />}
        {activeTab === 'asistencia' && <AsistenciaTab {...tabProps} />}
        {activeTab === 'materiales' && <MaterialesTab {...tabProps} />}
        {activeTab === 'grabaciones' && <GrabacionesTab {...tabProps} />}
        {activeTab === 'config' && <ConfigTab {...tabProps} />}
      </div>
    </div>
  );
}
