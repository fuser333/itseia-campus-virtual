import { jsPDF } from "jspdf";

interface CertificateData {
  studentName: string;
  programName: string;
  programType: string;
  issueDate: string;
  verificationCode: string;
  verifyUrl: string;
}

export function generateCertificatePDF(data: CertificateData): Uint8Array {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;

  // Background color - Navy
  doc.setFillColor(10, 22, 40); // #0A1628
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Border - Yellow accent
  doc.setDrawColor(251, 188, 12); // #FBBC0C
  doc.setLineWidth(1.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner border
  doc.setDrawColor(31, 47, 88); // #1F2F58
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Corner accents
  const cornerSize = 15;
  doc.setDrawColor(251, 188, 12);
  doc.setLineWidth(2);
  // Top-left
  doc.line(10, 10, 10 + cornerSize, 10);
  doc.line(10, 10, 10, 10 + cornerSize);
  // Top-right
  doc.line(pageWidth - 10, 10, pageWidth - 10 - cornerSize, 10);
  doc.line(pageWidth - 10, 10, pageWidth - 10, 10 + cornerSize);
  // Bottom-left
  doc.line(10, pageHeight - 10, 10 + cornerSize, pageHeight - 10);
  doc.line(10, pageHeight - 10, 10, pageHeight - 10 - cornerSize);
  // Bottom-right
  doc.line(pageWidth - 10, pageHeight - 10, pageWidth - 10 - cornerSize, pageHeight - 10);
  doc.line(pageWidth - 10, pageHeight - 10, pageWidth - 10, pageHeight - 10 - cornerSize);

  // Institution name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(251, 188, 12); // Yellow
  doc.text("ITSEIA", centerX, 32, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(115, 184, 231); // Light blue
  doc.text(
    "Instituto Superior Tecnologico Ecuatoriano de Inteligencia Artificial",
    centerX,
    39,
    { align: "center" }
  );

  // Certificate title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("CERTIFICADO", centerX, 58, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(200, 200, 200);
  doc.text("Se otorga el presente certificado a:", centerX, 68, {
    align: "center",
  });

  // Student name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(251, 188, 12); // Yellow
  doc.text(data.studentName, centerX, 85, { align: "center" });

  // Decorative line under name
  const nameWidth = doc.getTextWidth(data.studentName);
  doc.setDrawColor(251, 188, 12);
  doc.setLineWidth(0.8);
  doc.line(
    centerX - nameWidth / 2 - 10,
    89,
    centerX + nameWidth / 2 + 10,
    89
  );

  // Program description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(200, 200, 200);
  doc.text("Por haber completado exitosamente el programa:", centerX, 100, {
    align: "center",
  });

  // Program name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(data.programName, centerX, 112, { align: "center" });

  // Program type badge
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(115, 184, 231);
  doc.text(
    `Tipo: ${data.programType.toUpperCase()}`,
    centerX,
    120,
    { align: "center" }
  );

  // Date
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.text(`Fecha de emision: ${data.issueDate}`, centerX, 135, {
    align: "center",
  });

  // Location
  doc.text("Quito, Ecuador", centerX, 142, { align: "center" });

  // Verification section
  doc.setDrawColor(31, 47, 88);
  doc.setLineWidth(0.3);
  doc.line(40, 155, pageWidth - 40, 155);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Codigo de verificacion: ${data.verificationCode}`,
    centerX,
    163,
    { align: "center" }
  );
  doc.text(
    `Verificar en: ${data.verifyUrl}`,
    centerX,
    169,
    { align: "center" }
  );

  // Signature lines
  const sigY = 150;
  const sigWidth = 60;

  // Left signature
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(50, sigY, 50 + sigWidth, sigY);
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text("Director Academico", 50 + sigWidth / 2, sigY + 5, {
    align: "center",
  });

  // Right signature
  doc.line(pageWidth - 50 - sigWidth, sigY, pageWidth - 50, sigY);
  doc.text("Rector", pageWidth - 50 - sigWidth / 2, sigY + 5, {
    align: "center",
  });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Este certificado es emitido por ITSEIA - Instituto Superior Tecnologico Ecuatoriano de Inteligencia Artificial",
    centerX,
    pageHeight - 16,
    { align: "center" }
  );
  doc.text("tecnologico.itseia.ai", centerX, pageHeight - 12, {
    align: "center",
  });

  return doc.output("arraybuffer") as unknown as Uint8Array;
}
