// ── GET /api/certifications/detail?slug=xxx ─────────────────
// Returns full certification detail with domains for the detail page.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCertification } from "@/features/certifications/queries";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug requerido" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cert = await getCertification(slug, user?.id);
  if (!cert) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json({ certification: cert });
}
