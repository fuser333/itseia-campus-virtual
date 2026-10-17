import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsPDF } from "jspdf";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacher_id");

  if (!teacherId) {
    return NextResponse.json({ error: "teacher_id required" }, { status: 400 });
  }

  const supabase = await createClient();

  // Verify authenticated user is the teacher or admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  const isAdmin = ["super_admin", "admin", "coordinacion"].includes(
    profile?.role ?? ""
  );
  if (!isAdmin && user.id !== teacherId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // Get teacher profile
  const { data: teacherProfile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", teacherId)
    .single();

  if (!teacherProfile) {
    return NextResponse.json({ error: "Docente no encontrado" }, { status: 404 });
  }

  // Calculate total hours
  const { data: progressRows } = await supabase
    .from("teacher_training_progress")
    .select("hours_credited")
    .eq("teacher_id", teacherId);

  const { data: externalRows } = await supabase
    .from("teacher_external_hours")
    .select("hours")
    .eq("teacher_id", teacherId);

  const internalHours = (progressRows || []).reduce(
    (sum, r) => sum + Number(r.hours_credited),
    0
  );
  const externalHours = (externalRows || []).reduce(
    (sum, r) => sum + Number(r.hours),
    0
  );
  const totalHours = internalHours + externalHours;

  if (totalHours < 120) {
    return NextResponse.json(
      { error: `Horas insuficientes: ${totalHours.toFixed(1)}/120h` },
      { status: 400 }
    );
  }

  // Get or create certificate record
  const { data: existingCert } = await supabase
    .from("teacher_certificates")
    .select("certified_at")
    .eq("teacher_id", teacherId)
    .maybeSingle();

  const certifiedAt = existingCert?.certified_at
    ? new Date(existingCert.certified_at)
    : new Date();

  // Ensure certificate record exists
  if (!existingCert) {
    await supabase.from("teacher_certificates").upsert({
      teacher_id: teacherId,
      total_hours: totalHours,
      is_valid: true,
      certified_at: certifiedAt.toISOString(),
    }, { onConflict: "teacher_id" });
  }

  // Generate PDF with jspdf
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const W = 297;
  const H = 210;

  // ── Background ──────────────────────────────────────────
  // Navy gradient (simulated with filled rect)
  doc.setFillColor(31, 47, 88); // #1F2F58
  doc.rect(0, 0, W, H, "F");

  // Top accent bar
  doc.setFillColor(251, 188, 12); // #FBBC0C
  doc.rect(0, 0, W, 6, "F");
  doc.rect(0, H - 6, W, 6, "F");

  // Left accent strip
  doc.setFillColor(115, 184, 231); // #73B8E7
  doc.rect(0, 0, 4, H, "F");
  doc.rect(W - 4, 0, 4, H, "F");

  // Inner white card
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, 18, W - 40, H - 36, 4, 4, "F");

  // ── Content ──────────────────────────────────────────────
  const cx = W / 2;

  // Institution name
  doc.setTextColor(31, 47, 88);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("INSTITUTO ECUATORIANO DE INTELIGENCIA ARTIFICIAL — ITSEIA", cx, 32, { align: "center" });

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Quito, Ecuador  |  administracion@itseia.ai", cx, 37, { align: "center" });

  // Divider
  doc.setDrawColor(251, 188, 12);
  doc.setLineWidth(0.5);
  doc.line(40, 41, W - 40, 41);

  // Certificate title
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 47, 88);
  doc.text("CERTIFICADO DE CAPACITACION DOCENTE", cx, 58, { align: "center" });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Docencia Virtual Efectiva en Modalidad en Linea", cx, 67, { align: "center" });

  // Certifies that
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text("Se certifica que", cx, 82, { align: "center" });

  // Teacher name
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 47, 88);
  doc.text(teacherProfile.full_name.toUpperCase(), cx, 96, { align: "center" });

  // Name underline
  doc.setDrawColor(251, 188, 12);
  doc.setLineWidth(0.8);
  const nameW = doc.getTextWidth(teacherProfile.full_name.toUpperCase()) * (24 / 72) * 25.4;
  doc.line(cx - nameW / 2 - 10, 99, cx + nameW / 2 + 10, 99);

  // Body text
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(
    "ha completado satisfactoriamente el programa de capacitacion en docencia virtual,",
    cx, 109, { align: "center" }
  );
  doc.text(
    "acreditando las horas requeridas por el Art. 61 del Reglamento de Regimen Academico (RRA) 2022.",
    cx, 115, { align: "center" }
  );

  // Hours badge
  doc.setFillColor(31, 47, 88);
  doc.roundedRect(cx - 30, 121, 60, 18, 3, 3, "F");
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(251, 188, 12);
  doc.text(`${totalHours.toFixed(0)} HORAS`, cx, 133, { align: "center" });

  // Program name
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(80, 80, 80);
  doc.text("Programa: Docencia Virtual Efectiva — Campus ITSEIA", cx, 146, { align: "center" });

  // Footer info
  const issuedStr = certifiedAt.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(`Quito, ${issuedStr}`, 40, 162);
  doc.text(`Docente: ${teacherProfile.email}`, 40, 167);

  // Signature line
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(W - 100, 158, W - 35, 158);
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("Coordinacion Academica", W - 67, 163, { align: "center" });
  doc.text("ITSEIA", W - 67, 168, { align: "center" });

  // Reference
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Este certificado acredita el cumplimiento del Art. 61 RRA 2022 para docencia en modalidad en linea.",
    cx, 176, { align: "center" }
  );

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificado-docencia-virtual-itseia.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
