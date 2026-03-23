import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileText,
  Users,
  CreditCard,
  UserCheck,
  BrainCircuit,
  ChevronLeft,
  School,
  Layers,
  ClipboardCheck,
  UsersRound,
  ShieldCheck,
  Video,
  Award,
} from "lucide-react";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Carreras (Config)", href: "/admin/programs", icon: GraduationCap },
  { label: "Carreras", href: "/admin/carreras", icon: School },
  { label: "Cursos", href: "/admin/courses", icon: BookOpen },
  { label: "Sesiones", href: "/admin/sesiones", icon: Layers },
  { label: "Asistencia CES", href: "/admin/asistencia", icon: Video },
  { label: "Entregas", href: "/admin/entregas", icon: ClipboardCheck },
  { label: "Cohortes", href: "/admin/cohortes", icon: UsersRound },
  { label: "Lecciones", href: "/admin/lessons", icon: FileText },
  { label: "Matriculas", href: "/admin/enrollments", icon: UserCheck },
  { label: "Pagos", href: "/admin/payments", icon: CreditCard },
  { label: "Usuarios", href: "/admin/users", icon: Users },
  { label: "Uso AI Lab", href: "/admin/ai-usage", icon: BrainCircuit },
  { label: "Privacidad LOPDP", href: "/admin/privacidad", icon: ShieldCheck },
  { label: "Certificaciones", href: "/admin/certificaciones", icon: Award },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const allowedRoles = ["super_admin", "admin", "coordinacion", "finanzas"];
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-gray-200 bg-white">
        {/* Header */}
        <div className="flex h-14 items-center gap-2 border-b border-gray-200 px-4">
          <div className="flex size-7 items-center justify-center rounded-md bg-[#1F2F58]">
            <GraduationCap className="size-4 text-[#FBBC0C]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wide text-[#1F2F58]">
              ITSEIA Admin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <item.icon className="size-4 shrink-0 text-gray-400" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <ChevronLeft className="size-4" />
            <span>Volver al Campus</span>
          </Link>
          <div className="mt-2 px-2.5 text-xs text-gray-400">
            {profile.full_name} &middot;{" "}
            <span className="capitalize">
              {profile.role.replace("_", " ")}
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
