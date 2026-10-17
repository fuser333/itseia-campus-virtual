"use client";

/**
 * GrabacionesTab · Pestaña de grabaciones de sesion.
 *
 * Muestra las grabaciones disponibles para una sesion.
 * Si aun no hay grabaciones, muestra un estado vacio.
 *
 * @param sessionId - ID de la sesion para buscar grabaciones.
 */

interface Props {
  sessionId: string;
}

export default function GrabacionesTab({ sessionId: _sessionId }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div className="h-12 w-12 rounded-full bg-[#1F2F58]/20 flex items-center justify-center">
        <svg
          className="h-6 w-6 text-[#1F2F58]/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#0A1628]">
          Grabacion no disponible aun
        </p>
        <p className="text-xs text-[#1F2F58]/50 mt-1 max-w-xs">
          La grabacion de esta sesion estara disponible poco despues de que
          termine la clase en vivo.
        </p>
      </div>
    </div>
  );
}
