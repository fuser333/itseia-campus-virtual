'use client';

/**
 * Tab "Plan de clase" · Docente · Campus v2 (FASE 3 · stub).
 *
 * Editor de la estructura minuto-a-minuto de la clase. FASE 5 carga desde
 * `contenido_path/plan.md`. Acá solo mostramos placeholder + ejemplo de bloque.
 */

import StubCard from './_StubCard';
import type { TabDocenteProps } from './types';

const BLOQUES_EJEMPLO = [
  { rango: '00:00-00:10', titulo: 'Bienvenida y warm-up', tipo: 'apertura' },
  { rango: '00:10-00:40', titulo: 'Teoría: concepto clave', tipo: 'expo' },
  { rango: '00:40-01:20', titulo: 'Práctica guiada en vivo', tipo: 'taller' },
  { rango: '01:20-01:50', titulo: 'Ejercicio individual + feedback', tipo: 'ejercicio' },
  { rango: '01:50-02:00', titulo: 'Cierre + tarea + preview siguiente', tipo: 'cierre' },
];

export default function PlanClaseTab(_props: TabDocenteProps) {
  void _props; // FASE 3 stub: props se usan en FASE 5.
  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-50">
          Estructura de la clase (ejemplo)
        </div>
        <ul className="mt-3 divide-y" style={{ borderColor: 'var(--sidebar-border)' }}>
          {BLOQUES_EJEMPLO.map((b) => (
            <li key={b.rango} className="flex items-center gap-3 py-3">
              <span className="font-mono text-xs opacity-60 w-28">{b.rango}</span>
              <span className="flex-1 text-sm font-semibold">{b.titulo}</span>
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider opacity-80"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: 'var(--itseia-gold)',
                }}
              >
                {b.tipo}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <StubCard
        title="Editor de plan de clase"
        description="Editor drag-and-drop por bloques de tiempo. Cada bloque tiene tipo (apertura/expo/taller/ejercicio/cierre), materiales asociados y prompts. Se carga desde plan.md."
      />
    </div>
  );
}
