import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/announcements?subject_id=xxx
// Returns announcements for a subject with read status for current user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subject_id");

  if (!subjectId) {
    return NextResponse.json({ error: "subject_id required" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isTeacherOrAdmin = ["docente", "super_admin", "admin", "coordinacion"].includes(
    profile?.role ?? ""
  );

  // Fetch announcements
  let query = supabase
    .from("announcements")
    .select("*")
    .eq("subject_id", subjectId)
    .order("published_at", { ascending: false });

  if (!isTeacherOrAdmin) {
    // Students only see non-archived
    query = query.eq("is_archived", false);
  }

  const { data: announcements, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!announcements || announcements.length === 0) {
    return NextResponse.json([]);
  }

  // Get read status for current user
  const announcementIds = announcements.map((a) => a.id);
  const { data: reads } = await supabase
    .from("announcement_reads")
    .select("announcement_id")
    .eq("user_id", user.id)
    .in("announcement_id", announcementIds);

  const readSet = new Set((reads || []).map((r) => r.announcement_id));

  // If teacher: also get read counts
  let readCounts: Record<string, number> = {};
  if (isTeacherOrAdmin) {
    const { data: countRows } = await supabase
      .from("announcement_reads")
      .select("announcement_id")
      .in("announcement_id", announcementIds);

    for (const row of countRows || []) {
      readCounts[row.announcement_id] = (readCounts[row.announcement_id] || 0) + 1;
    }
  }

  const result = announcements.map((a) => ({
    ...a,
    is_read: readSet.has(a.id),
    read_count: isTeacherOrAdmin ? (readCounts[a.id] || 0) : undefined,
  }));

  return NextResponse.json(result);
}

// POST /api/announcements
// Creates a new announcement (teacher only)
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    !["docente", "super_admin", "admin", "coordinacion"].includes(profile.role)
  ) {
    return NextResponse.json({ error: "Solo docentes pueden publicar anuncios" }, { status: 403 });
  }

  let body: { subject_id: string; title: string; body_markdown: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const { subject_id, title, body_markdown } = body;
  if (!subject_id || !title?.trim() || !body_markdown?.trim()) {
    return NextResponse.json(
      { error: "subject_id, title y body_markdown son requeridos" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      teacher_id: user.id,
      subject_id,
      title: title.trim(),
      body_markdown: body_markdown.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/announcements — Archive announcement
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let body: { id: string; is_archived: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const { error } = await supabase
    .from("announcements")
    .update({ is_archived: body.is_archived })
    .eq("id", body.id)
    .eq("teacher_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
