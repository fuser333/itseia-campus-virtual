'use client';

/**
 * SessionTabsDocente · 9 pestañas docente de una sesión · Campus v2 (FASE 3).
 *
 * Análogo a `components/core/SessionTabs.tsx` (FASE 2 alumno), pero específico
 * para la vista docente con 9 pestañas: Resumen, PlanClase, MaterialesEditar,
 * EjerciciosEditar, EvaluacionEditar, Prompts, Recursos, NotasPrivadas,
 * Grabaciones.
 *
 * El YAML del producto declara `docente.pestañas_sesion` con los IDs activos.
 * Si una pestaña no está en el array, no se renderiza (configurable por
 * producto).
 */

import { useState } from 'react';
import type { ReactNode } from 'react';

import ResumenTab from './tabs/ResumenTab';
import PlanClaseTab from './tabs/PlanClaseTab';
import MaterialesEditarTab from './tabs/MaterialesEditarTab';
import EjerciciosEditarTab from './tabs/EjerciciosEditarTab';
import EvaluacionEditarTab from './tabs/EvaluacionEditarTab';
import PromptsTab from './tabs/PromptsTab';
import RecursosTab from './tabs/RecursosTab';
import NotasPrivadasTab from './tabs/NotasPrivadasTab';
import GrabacionesTab from './tabs/GrabacionesTab';
import type { SesionDocenteData, TabDocenteProps } from './tabs/types';

// ─── Tipos públicos ──────────────────────────────────────────────────────────

interface Props {
  producto: string;
  cohorteSlug: string;
  /** IDs de pestañas declaradas en el YAML (`docente.pestañas_sesion`). */
  pestañas: string[];
  sesionData: SesionDocenteData;
}

// ─── Registry ────────────────────────────────────────────────────────────────

const PESTAÑAS_REGISTRY: Record<
  string,
  { label: string; Component: React.ComponentType<TabDocenteProps> }
> = {
  resumen: { label: 'Resumen', Component: ResumenTab },
  plan_clase: { label: 'Plan de clase', Component: PlanClaseTab },
  materiales_editar: {
    label: 'Materiales',
    Component: MaterialesEditarTab,
  },
  ejercicios_editar: {
    label: 'Ejercicios',
    Component: EjerciciosEditarTab,
  },
  evaluacion_editar: {
    label: 'Evaluación',
    Component: EvaluacionEditarTab,
  },
  prompts: { label: 'Prompts', Component: PromptsTab },
  recursos: { label: 'Recursos', Component: RecursosTab },
  notas_privadas: { label: 'Notas privadas', Component: NotasPrivadasTab },
  grabaciones: { label: 'Grabaciones', Component: GrabacionesTab },
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function SessionTabsDocente({
  producto,
  cohorteSlug,
  pestañas,
  sesionData,
}: Props) {
  const valid = pestañas.filter((p) => PESTAÑAS_REGISTRY[p] !== undefined);
  const [activeId, setActiveId] = useState<string>(valid[0] ?? '');

  if (valid.length === 0) {
    return (
      <div className="opacity-70 text-sm">
        Esta sesión no tiene pestañas configuradas para el docente.
      </div>
    );
  }

  const Active = PESTAÑAS_REGISTRY[activeId]?.Component;
  const accentVar = `var(--producto-${producto})`;

  return (
    <div>
      {/* ── Header de tabs (scroll horizontal en mobile) ──────── */}
      <div
        className="-mx-1 flex gap-1 overflow-x-auto border-b scrollbar-hide"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        {valid.map((id) => {
          const isActive = id === activeId;
          return (
            <button
              key={id}
              onClick={() => setActiveId(id)}
              className="shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition"
              style={{
                color: isActive ? accentVar : 'var(--itseia-text)',
                borderBottom: isActive
                  ? `2px solid ${accentVar}`
                  : '2px solid transparent',
                opacity: isActive ? 1 : 0.7,
              }}
            >
              {PESTAÑAS_REGISTRY[id].label}
            </button>
          );
        })}
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="pt-6">
        {Active && (
          <TabBody>
            <Active
              producto={producto}
              cohorteSlug={cohorteSlug}
              sesionData={sesionData}
            />
          </TabBody>
        )}
      </div>
    </div>
  );
}

function TabBody({ children }: { children: ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
