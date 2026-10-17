import { NextRequest, NextResponse } from "next/server";
import { getTrainingProgress } from "@/features/teacher/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacher_id");

  if (!teacherId) {
    return NextResponse.json({ error: "teacher_id required" }, { status: 400 });
  }

  try {
    const progress = await getTrainingProgress(teacherId);
    return NextResponse.json(progress);
  } catch (err) {
    console.error("training-progress error:", err);
    return NextResponse.json(
      { error: "Error obteniendo progreso de capacitacion" },
      { status: 500 }
    );
  }
}
