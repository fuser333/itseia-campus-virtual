import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  FileCheck,
  BarChart3,
  GraduationCap,
  ChevronLeft,
  ClipboardCheck,
  ClipboardList,
  Award,
  Megaphone,
  Video,
  MessageSquare,
} from "lucide-react";
import { PendingSubmissionsBadge } from "@/components/teacher/PendingSubmissionsBadge";

// ─── Sections that match Sidebar MENU_DOCENTE exactly ─────────────────────────

const TEACHER_NAV_SECTIONS = [
  {
    label: "MIS MATERIAS",
    items: [
      { label: "Dashboard",    href: "/teacher",          icon: LayoutDashboard },
      { label: "Mis Materias", href: "/teacher/materias", icon: BookOpen },
    ],
  },
  {
    label: "GESTION",
    items: [
      { label: "Calificar Entregas", href: "/teacher/entregas",          icon: ClipboardCheck, withBadge: true },
      { label: "Progreso Alumnos",   href: "/teacher/progreso",          icon: BarChart3 },
      { label: "Anuncios",           href: "/teacher/comunicacion",      icon: Megaphone },
      { label: "Programar Clases",   href: "/teacher/programar-clases",  icon: Video },
      { label: "Tutorias",           href: "/teacher/tutorias",          icon: MessageSquare },
      { label: "Asistencia",         href: "/teacher/asistencia",        icon: ClipboardList },
    ],
  },
  {
    label: "CAPACITACION CES",
    items: [
      { label: "Docencia Virtual 120h", href: "/teacher/capacitacion",  icon: Award },
      { label: "Mi Certificacion",      href: "/teacher/certificacion", icon: FileCheck },
    ],
  },
];

export default async function TeacherLayout({
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

  const allowedRoles = ["super_admin", "admin", "coordinacion", "docente"];
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{ color: '#1F2F58' }}>
      {/* Teacher Sidebar */}
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-gray-200 bg-white">
        {/* Header */}
        <div className="flex h-14 items-center gap-2 border-b border-gray-200 px-4">
          <div className="flex size-7 items-center justify-center rounded-md bg-[#1F2F58]">
            <GraduationCap className="size-4 text-[#FBBC0C]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wide text-[#1F2F58]">
              ITSEIA Docente
            </span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mt-0.5">
              Panel
            </span>
          </div>
        </div>

        {/* Navigation — sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
          {TEACHER_NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 select-none">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    <item.icon className="size-4 shrink-0 text-gray-400" />
                    <span className="flex-1">{item.label}</span>
                    {"withBadge" in item && item.withBadge && <PendingSubmissionsBadge />}
                  </Link>
                ))}
              </div>
            </div>
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
