import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateCertificatePDF } from "@/lib/pdf-certificate";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
  try {
    const { certificateId } = await request.json();

    if (!certificateId) {
      return NextResponse.json({ error: "certificateId required" }, { status: 400 });
    }

    // Fetch certificate with related data
    const { data: cert, error } = await supabaseAdmin
      .from("certificates")
      .select("*, profiles(full_name, email), programs(name, type)")
      .eq("id", certificateId)
      .single();

    if (error || !cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const studentName = cert.profiles?.full_name || "Estudiante";
    const programName = cert.programs?.name || "Programa ITSEIA";
    const programType = cert.programs?.type || "curso";
    const issueDate = new Date(cert.issued_at).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const pdfBytes = generateCertificatePDF({
      studentName,
      programName,
      programType,
      issueDate,
      verificationCode: cert.code,
      verifyUrl: `https://tecnologico.itseia.ai/verify/${cert.code}`,
    });

    return new Response(pdfBytes as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificado-${cert.code}.pdf"`,
      },
    });
  } catch (e) {
    console.error("Certificate generation error:", e);
    return NextResponse.json({ error: "Error generating certificate" }, { status: 500 });
  }
}
