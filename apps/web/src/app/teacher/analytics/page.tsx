import type { Metadata } from "next";
import AnalyticsClient from "./AnalyticsClient";

export const metadata: Metadata = {
  title: "Analytics Estudiantes | ITSEIA Academy",
  description:
    "Métricas agregadas del desempeño de tus estudiantes: aprobación, participación y alertas tempranas.",
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
