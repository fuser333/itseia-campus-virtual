// ── /admin/certificaciones ────────────────────────────────
// Admin report: active students, simulacro pass rate, CSV export.

import { getAdminCertificationsReport } from "@/features/certifications/queries";
import AdminCertificationsClient from "./client";

export default async function AdminCertificacionesPage() {
  const reports = await getAdminCertificationsReport();
  return <AdminCertificationsClient initialReports={reports} />;
}
