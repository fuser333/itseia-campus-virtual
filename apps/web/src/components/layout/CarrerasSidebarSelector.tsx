"use client";

/**
 * CarrerasSidebarSelector
 *
 * Client component que detecta la ruta actual y renderiza el sidebar correcto
 * para cada tipo de programa dentro del área /carreras/:
 *
 *   /carreras/preuniversitario-ia/* → PreuniSidebar  (ITSEIA IGNITE)
 *   /carreras/* (cualquier otra)    → CarrerasSidebar (sidebar de carrera)
 *
 * Esto resuelve el bug donde el CEO veía "Dashboard Carrera / Semestre Actual /
 * Malla Curricular" al entrar al Preuniversitario, que pertenece a la misma
 * sección /carreras pero es un producto distinto.
 */

import { usePathname } from "next/navigation";
import CarrerasSidebar from "@/components/layout/CarrerasSidebar";
import PreuniSidebar from "@/components/layout/PreuniSidebar";

// Slugs de programas que son Preuniversitario / IGNITE
const PREUNI_SLUGS = ["preuniversitario-ia", "preuniversitario", "ignite-ia"];

interface CarrerasSidebarSelectorProps {
  userName?: string;
  userEmail?: string;
}

export default function CarrerasSidebarSelector({
  userName,
  userEmail,
}: CarrerasSidebarSelectorProps) {
  const pathname = usePathname();

  // Detectar si la ruta pertenece al Preuniversitario IGNITE
  // Ejemplos que deben mostrar PreuniSidebar:
  //   /carreras/preuniversitario-ia
  //   /carreras/preuniversitario-ia/materia/preuni-semana-1-fundamentos-ia
  //   /carreras/preuniversitario-ia/materia/preuni-semana-1/sesion/1
  const isPreuni = PREUNI_SLUGS.some((slug) => {
    const prefix = `/carreras/${slug}`;
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });

  if (isPreuni) {
    return <PreuniSidebar userName={userName} userEmail={userEmail} />;
  }

  return <CarrerasSidebar userName={userName} userEmail={userEmail} />;
}
