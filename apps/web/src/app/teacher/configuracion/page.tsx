import type { Metadata } from "next";
import ConfiguracionClient from "./ConfiguracionClient";

export const metadata: Metadata = {
  title: "Configuración | ITSEIA Academy",
  description:
    "Perfil docente, foto, biografía, materias asignadas y horario de tutorías.",
};

export default function ConfiguracionPage() {
  return <ConfiguracionClient />;
}
