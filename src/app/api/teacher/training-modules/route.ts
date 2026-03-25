import { NextRequest, NextResponse } from "next/server";
import { getTrainingModules } from "@/features/teacher/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacher_id");

  if (!teacherId) {
    return NextResponse.json({ error: "teacher_id required" }, { status: 400 });
  }

  try {
    const modules = await getTrainingModules(teacherId);
    return NextResponse.json(modules);
  } catch (err) {
    console.error("training-modules error:", err);
    return NextResponse.json(
      { error: "Error obteniendo modulos" },
      { status: 500 }
    );
  }
}
