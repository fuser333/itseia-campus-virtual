import type { Metadata } from "next";
import DataRequestsPanel from "@/components/privacy/DataRequestsPanel";

export const metadata: Metadata = {
  title: "Privacidad LOPDP | ITSEIA Admin",
  description: "Panel de gestion de solicitudes de datos ARCO conforme a la LOPDP Ecuador.",
};

export default function AdminPrivacidadPage() {
  return <DataRequestsPanel />;
}
