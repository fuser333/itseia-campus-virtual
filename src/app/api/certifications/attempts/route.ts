// ── GET /api/certifications/attempts?certification_id=xxx ───
// Returns exam attempt history for the authenticated user.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getExamHistory } from "@/features/certifications/queries";

export async function GET(req: NextRequest) {
  const certificationId = req.nextUrl.searchParams.get("certification_id");
  if (!certificationId) {
    return NextResponse.json(
      { error: "certification_id requerido" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ attempts: [] });
  }

  const attempts = await getExamHistory(user.id, certificationId);
  return NextResponse.json({ attempts });
}
