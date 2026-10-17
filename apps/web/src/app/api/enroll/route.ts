import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Auto-enroll a new user in the free demo program
const FREE_PROGRAM_ID = "be7e6b1e-d8f9-4c97-9b29-bacb73925579"; // Curso Express: IA para Profesionales

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Check if already enrolled
    const { data: existing } = await supabaseAdmin
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("program_id", FREE_PROGRAM_ID)
      .single();

    if (existing) {
      return NextResponse.json({ message: "already enrolled" });
    }

    // Create enrollment
    const { error } = await supabaseAdmin.from("enrollments").insert({
      user_id: userId,
      program_id: FREE_PROGRAM_ID,
      status: "active",
    });

    if (error) {
      console.error("Auto-enroll error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "enrolled successfully" });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
