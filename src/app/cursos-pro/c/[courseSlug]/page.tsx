/**
 * Redirect · /cursos-pro/c/[courseSlug] → /cursos-pro/[courseSlug]
 */

import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ courseSlug: string }>;
}

export default async function LegacyCursoRedirectPage({ params }: PageProps) {
  const { courseSlug } = await params;
  redirect(`/cursos-pro/${courseSlug}`);
}
