/**
 * AI Lab embebido dentro del shell del producto · Campus v2.
 *
 * Para FASE 2 redirigimos al AI Lab global existente (`/ai-lab`) con un query
 * que indica el producto de contexto. En FASE 4 traeremos las pestañas Tutor /
 * Flash Cards / Brain como componentes embebidos.
 */

import { redirect } from 'next/navigation';
import { getProductoSafe } from '@/lib/productos/loader';

interface PageProps {
  params: Promise<{ producto: string }>;
}

export default async function AlumnoAILabPage({ params }: PageProps) {
  const { producto } = await params;
  const cfg = getProductoSafe(producto);
  if (!cfg) redirect('/ai-lab');
  // El AI Lab vive como módulo global y es compartido entre todos los productos
  redirect(`/ai-lab?producto=${cfg.producto.id}`);
}
