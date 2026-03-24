import { redirect } from "next/navigation";

// /courses is the old V1 system — redirect to the current V3 careers page
export default async function CoursesPage() {
  redirect("/carreras");
}
