import type { Metadata } from "next";
import MaterialClient from "@/app/teacher/material/MaterialClient";

export const metadata: Metadata = {
  title: "Material del Curso | ITSEIA Academy",
  description:
    "Listado de material didáctico (PDFs, videos, enlaces, datasets) que has subido a tus materias.",
};

export default function MaterialPage() {
  return <MaterialClient />;
}
