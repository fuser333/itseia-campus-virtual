"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Nombre de la sección, para el mensaje de fallback */
  label?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Cápsula de aislamiento de fallos (modularidad).
 * Si el contenido que envuelve revienta, muestra un fallback elegante
 * en lugar de tumbar toda la página/sesión. Las demás secciones siguen vivas.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Log para diagnóstico; no rompe el resto de la app
    console.error(`[ErrorBoundary] fallo en "${this.props.label ?? "sección"}":`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-6 text-center">
          <p className="text-sm text-[#F9F6E7]/80">
            Esta sección{this.props.label ? ` (${this.props.label})` : ""} tuvo un
            problema al cargar.
          </p>
          <p className="mt-1 text-xs text-[#F9F6E7]/50">
            El resto de la clase sigue disponible — continúa en las otras pestañas.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 rounded-lg bg-[#FBBC0C] px-4 py-2 text-xs font-semibold text-[#0A1628] hover:opacity-90"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
