import type { Metadata } from "next";
import QuizListClient from "./QuizListClient";

export const metadata: Metadata = {
  title: "Crear Quiz / Examen | ITSEIA Academy",
  description:
    "Lista de quizzes y exámenes que has creado. Edita o crea uno nuevo desde una sesión.",
};

export default function QuizListPage() {
  return <QuizListClient />;
}
