import type { Metadata } from "next";
import BancoPreguntasClient from "@/app/teacher/banco-preguntas/BancoPreguntasClient";

export const metadata: Metadata = {
  title: "Banco de Preguntas | ITSEIA Academy",
  description:
    "Repositorio de preguntas reutilizables para construir quizzes y exámenes.",
};

export default function BancoPreguntasPage() {
  return <BancoPreguntasClient />;
}
