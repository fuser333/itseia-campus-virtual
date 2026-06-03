'use client';

/**
 * SessionTabs · Componente unificado de pestañas de sesión · Campus v2.
 *
 * Renderiza un set de pestañas dinámico según:
 *  · El producto (cuántas y cuáles pestañas)
 *  · El rol del usuario (alumno=4 default, docente=9 default)
 *
 * El array de IDs de pestañas viene como prop desde el Server Component
 * (que las leyó del YAML del producto). Cada ID se mapea a un componente
 * de pestaña vía el `PESTAÑAS_REGISTRY`.
 *
 * Para FASE 2, las 4 pestañas del alumno son stubs simples · el contenido
 * real se carga en FASE 4 desde `content/cohortes/.../sesiones/sNN/`.
 */

import { useState } from 'react';
import type { ReactNode } from 'react';
import VideoResumenTab from './tabs/VideoResumenTab';
import MaterialesTab from './tabs/MaterialesTab';
import EjerciciosTab from './tabs/EjerciciosTab';
import EvaluacionTab from './tabs/EvaluacionTab';

// ─── Tipos públicos ──────────────────────────────────────────────────────────

export type SessionTabRol = 'alumno' | 'docente';

export interface SesionDataMinima {
  numero: number;
  titulo: string;
  fecha_programada?: string | null;
  duracion_minutos?: number;
  meet_url?: string | null;
  recording_url?: string | null;
  status?: string;
  contenido_path?: string | null;
}

interface Props {
  /** ID del producto (ej. 'preuni') · usado para CSS var accent. */
  producto: string;
  /** Rol activo · alumno=4 pestañas default. */
  rol: SessionTabRol;
  /** Array de IDs de pestañas a renderizar (en orden). Viene del YAML. */
  pestañas: string[];
  /** Datos de la sesión (pasados a cada tab). */
  sesionData: SesionDataMinima;
}

// ─── Registry ────────────────────────────────────────────────────────────────

interface TabComponentProps {
  sesionData: SesionDataMinima;
}

const PESTAÑAS_REGISTRY: Record<
  string,
  { label: string; Component: React.ComponentType<TabComponentProps> }
> = {
  // ─── Alumno (4) ─────────────────────────────────────────────────────
  video_resumen: { label: 'Video + Resumen', Component: VideoResumenTab },
  materiales: { label: 'Materiales', Component: MaterialesTab },
  ejercicios: { label: 'Ejercicios', Component: EjerciciosTab },
  evaluacion: { label: 'Evaluación', Component: EvaluacionTab },
  // ─── Docente (5 extra) · stubs FASE 5 ───────────────────────────────
  resumen: { label: 'Resumen', Component: ProximamenteTab('Resumen ejecutivo') },
  plan_clase: { label: 'Plan de clase', Component: ProximamenteTab('Plan de clase') },
  materiales_editar: {
    label: 'Materiales (editar)',
    Component: ProximamenteTab('Editor de materiales'),
  },
  ejercicios_editar: {
    label: 'Ejercicios (editar)',
    Component: ProximamenteTab('Editor de ejercicios'),
  },
  evaluacion_editar: {
    label: 'Evaluación (editar)',
    Component: ProximamenteTab('Editor de evaluación'),
  },
  prompts: { label: 'Prompts', Component: ProximamenteTab('Banco de prompts') },
  recursos: { label: 'Recursos extra', Component: ProximamenteTab('Recursos extra') },
  notas_privadas: {
    label: 'Notas privadas',
    Component: ProximamenteTab('Notas privadas del docente'),
  },
  grabaciones: {
    label: 'Grabaciones',
    Component: ProximamenteTab('Historial de grabaciones'),
  },
};

function ProximamenteTab(seccion: string) {
  const Component = ({ sesionData: _ }: TabComponentProps) => (
    <div
      className="rounded-xl border p-8 text-center"
      style={{
        backgroundColor: 'var(--itseia-navy)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      <div className="text-sm opacity-60">Próximamente</div>
      <div className="mt-1 font-heading text-lg font-semibold">{seccion}</div>
      <p className="mx-auto mt-2 max-w-md text-sm opacity-70">
        Esta sección será habilitada en la siguiente fase del Campus v2.
      </p>
    </div>
  );
  Component.displayName = `Proximamente_${seccion.replace(/\s+/g, '_')}`;
  return Component;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function SessionTabs({
  producto,
  rol: _rol,
  pestañas,
  sesionData,
}: Props) {
  const valid = pestañas.filter((p) => PESTAÑAS_REGISTRY[p] !== undefined);
  const [activeId, setActiveId] = useState<string>(valid[0] ?? '');

  if (valid.length === 0) {
    return (
      <div className="opacity-70 text-sm">
        Esta sesión no tiene pestañas configuradas.
      </div>
    );
  }

  const Active = PESTAÑAS_REGISTRY[activeId]?.Component;
  const accentVar = `var(--producto-${producto})`;

  return (
    <div>
      {/* ── Header de tabs ─────────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-1 border-b"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        {valid.map((id) => {
          const isActive = id === activeId;
          return (
            <button
              key={id}
              onClick={() => setActiveId(id)}
              className="px-4 py-2.5 text-sm font-medium transition"
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

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="pt-6">
        {Active && (
          <TabBody>
            <Active sesionData={sesionData} />
          </TabBody>
        )}
      </div>
    </div>
  );
}

function TabBody({ children }: { children: ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
