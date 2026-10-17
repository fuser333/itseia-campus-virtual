'use client';

/**
 * GrabacionesTab · Vista admin de grabaciones (FASE 4 stub).
 *
 * Implementación real (FASE 5+):
 *  · Lista de grabaciones (YouTube URL, duración, fecha, status)
 *  · Pipeline Drive → YouTube (cron)
 *  · Estado de procesamiento (uploading, processed, published)
 *  · Cambiar visibilidad pública/privada
 *  · Editar título/descripción
 */

import StubCard from './_StubCard';
import type { AdminTabProps } from './types';

export default function GrabacionesTab({
  producto,
  cohorteSlug,
}: AdminTabProps) {
  return (
    <StubCard
      title="Grabaciones publicadas"
      description={`Aquí verás todas las grabaciones procesadas para ${producto}/${cohorteSlug}: YouTube URL, status del pipeline Drive → YouTube, visibilidad, edición de metadata.`}
    />
  );
}
