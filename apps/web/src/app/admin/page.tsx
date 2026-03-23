import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  Users,
  UserCheck,
  DollarSign,
  BrainCircuit,
  GraduationCap,
  BookOpen,
  FileText,
  CreditCard,
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  TrendingUp,
  Sparkles,
  School,
  MessagesSquare,
  AlertCircle,
  Download,
  BookMarked,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getForumMetricsAll } from "@/features/forums/queries";

export default async function AdminDashboard() {
  const supabase = supabaseAdmin;

  // Total alumnos (rol = estudiante)
  const { count: totalStudents } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "estudiante");

  // Matriculas activas
  const { count: activeEnrollments } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // Ingresos del mes (pagos confirmados del mes actual)
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString();
  const { data: monthPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "confirmed")
    .gte("created_at", firstOfMonth);

  const monthlyRevenue = monthPayments?.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  ) ?? 0;

  // Uso AI Lab del mes
  const { data: aiUsageMonth } = await supabase
    .from("ai_usage_logs")
    .select("cost_usd")
    .gte("created_at", firstOfMonth);

  const aiCostMonth = aiUsageMonth?.reduce(
    (sum, l) => sum + (l.cost_usd || 0),
    0
  ) ?? 0;

  const aiRequestsMonth = aiUsageMonth?.length ?? 0;

  // Recent enrollments (last 10)
  const { data: recentEnrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      status,
      enrolled_at,
      profiles!enrollments_user_id_fkey ( full_name, email ),
      programs!enrollments_program_id_fkey ( name )
    `)
    .order("enrolled_at", { ascending: false })
    .limit(10);

  // Recent payments (last 10)
  const { data: recentPayments } = await supabase
    .from("payments")
    .select(`
      id,
      amount,
      method,
      status,
      created_at,
      profiles!payments_user_id_fkey ( full_name, email )
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  // ── Analytics: Completion rates per career ──
  const { data: careerPrograms } = await supabase
    .from("programs")
    .select("id, name, career_code")
    .eq("type", "carrera")
    .eq("is_active", true);

  const careerCompletionRates: { name: string; code: string; completed: number; total: number; percent: number }[] = [];

  if (careerPrograms) {
    for (const career of careerPrograms) {
      // Get total sessions for this career
      const { data: semesters } = await supabase
        .from("semesters")
        .select("id")
        .eq("program_id", career.id);

      let totalSessions = 0;
      let completedSessions = 0;

      if (semesters && semesters.length > 0) {
        const semesterIds = semesters.map((s) => s.id);

        const { data: subjects } = await supabase
          .from("subjects")
          .select("id")
          .in("semester_id", semesterIds);

        if (subjects && subjects.length > 0) {
          const subjectIds = subjects.map((s) => s.id);

          const { count: sessCount } = await supabase
            .from("sessions")
            .select("*", { count: "exact", head: true })
            .in("subject_id", subjectIds)
            .eq("is_active", true);

          totalSessions = sessCount || 0;

          // Get completed session_progress for this career
          const { data: sessions } = await supabase
            .from("sessions")
            .select("id")
            .in("subject_id", subjectIds)
            .eq("is_active", true);

          if (sessions && sessions.length > 0) {
            const sessionIds = sessions.map((s) => s.id);
            const { count: compCount } = await supabase
              .from("session_progress")
              .select("*", { count: "exact", head: true })
              .in("session_id", sessionIds)
              .eq("completed", true);

            completedSessions = compCount || 0;
          }
        }
      }

      careerCompletionRates.push({
        name: career.name,
        code: career.career_code || "N/A",
        completed: completedSessions,
        total: totalSessions,
        percent: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
      });
    }
  }

  // ── Analytics: Quiz pass rates ──
  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("passed")
    .not("passed", "is", null);

  const totalQuizAttempts = quizAttempts?.length ?? 0;
  const passedQuizAttempts = quizAttempts?.filter((a) => a.passed).length ?? 0;
  const quizPassRate = totalQuizAttempts > 0
    ? Math.round((passedQuizAttempts / totalQuizAttempts) * 100)
    : 0;

  // ── Analytics: Submissions pending ──
  const { count: pendingSubmissions } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "submitted");

  // ── Analytics: Popular subjects (by session completions) ──
  const { data: sessionProgressAll } = await supabase
    .from("session_progress")
    .select("session_id")
    .eq("completed", true);

  const sessionCountMap = new Map<string, number>();
  if (sessionProgressAll) {
    for (const sp of sessionProgressAll) {
      sessionCountMap.set(sp.session_id, (sessionCountMap.get(sp.session_id) || 0) + 1);
    }
  }

  // Get unique session IDs and their subjects
  const topSessionIds = Array.from(sessionCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([id]) => id);

  let popularSubjects: { name: string; code: string; completions: number }[] = [];

  if (topSessionIds.length > 0) {
    const { data: sessionsWithSubjects } = await supabase
      .from("sessions")
      .select("id, subject_id, subjects(name, code)")
      .in("id", topSessionIds);

    if (sessionsWithSubjects) {
      const subjectCompletions = new Map<string, { name: string; code: string; completions: number }>();

      for (const session of sessionsWithSubjects) {
        const subject = session.subjects as unknown as { name: string; code: string } | null;
        if (!subject) continue;

        const count = sessionCountMap.get(session.id) || 0;
        const existing = subjectCompletions.get(session.subject_id);

        if (existing) {
          existing.completions += count;
        } else {
          subjectCompletions.set(session.subject_id, {
            name: subject.name,
            code: subject.code,
            completions: count,
          });
        }
      }

      popularSubjects = Array.from(subjectCompletions.values())
        .sort((a, b) => b.completions - a.completions)
        .slice(0, 5);
    }
  }

  // ── Forum metrics (Phase C) ──
  const forumMetrics = await getForumMetricsAll();

  // ── Biblioteca Virtual metrics (004-virtual-library) ──
  const { count: totalLibrarySearches } = await supabase
    .from("library_searches")
    .select("*", { count: "exact", head: true });

  const { count: totalSavedPapers } = await supabase
    .from("saved_papers")
    .select("*", { count: "exact", head: true });

  // Top 10 terminos mas buscados
  const { data: allSearches } = await supabase
    .from("library_searches")
    .select("query")
    .order("created_at", { ascending: false })
    .limit(200);

  const queryCount = new Map<string, number>();
  for (const s of allSearches || []) {
    const q = s.query.toLowerCase().trim();
    queryCount.set(q, (queryCount.get(q) || 0) + 1);
  }
  const topQueries = Array.from(queryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));

  // ── Analytics: Student growth ──
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const { count: newStudentsWeek } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "estudiante")
    .gte("created_at", oneWeekAgo);

  const { count: newStudentsMonth } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "estudiante")
    .gte("created_at", firstOfMonth);

  const stats = [
    {
      label: "Total Alumnos",
      value: totalStudents ?? 0,
      icon: Users,
      color: "text-[#1F2F58]",
      bg: "bg-[#1F2F58]/10",
      href: "/admin/users",
    },
    {
      label: "Matriculas Activas",
      value: activeEnrollments ?? 0,
      icon: UserCheck,
      color: "text-[#73B8E7]",
      bg: "bg-[#73B8E7]/10",
      href: "/admin/enrollments",
    },
    {
      label: "Ingresos del Mes",
      value: `$${monthlyRevenue.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/admin/payments",
    },
    {
      label: "AI Lab (Mes)",
      value: `${aiRequestsMonth} req · $${aiCostMonth.toFixed(2)}`,
      icon: BrainCircuit,
      color: "text-[#F0846D]",
      bg: "bg-[#F0846D]/10",
      href: "/admin/ai-usage",
    },
  ];

  const quickLinks = [
    { label: "Carreras", href: "/admin/programs", icon: GraduationCap },
    { label: "Cursos", href: "/admin/courses", icon: BookOpen },
    { label: "Lecciones", href: "/admin/lessons", icon: FileText },
    { label: "Matriculas", href: "/admin/enrollments", icon: UserCheck },
    { label: "Pagos", href: "/admin/payments", icon: CreditCard },
    { label: "Usuarios", href: "/admin/users", icon: Users },
    { label: "Uso AI Lab", href: "/admin/ai-usage", icon: BrainCircuit },
  ];

  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    completed: "bg-blue-100 text-blue-700",
    suspended: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    active: "Activa",
    completed: "Completada",
    suspended: "Suspendida",
    cancelled: "Cancelada",
    pending: "Pendiente",
    confirmed: "Confirmado",
    rejected: "Rechazado",
  };

  const methodLabels: Record<string, string> = {
    transfer: "Transferencia",
    stripe: "Stripe",
    cash: "Efectivo",
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Panel de Administracion
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Vista general de ITSEIA Academy
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="truncate text-lg font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-gray-700">
            Accesos Rapidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-[#1F2F58]/20 hover:bg-[#1F2F58]/5 hover:text-[#1F2F58]"
              >
                <link.icon className="size-3.5" />
                {link.label}
                <ArrowRight className="size-3 text-gray-400" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two-column tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Matriculas Recientes
            </CardTitle>
            <Link
              href="/admin/enrollments"
              className="text-xs font-medium text-[#1F2F58] hover:underline"
            >
              Ver todas
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium text-gray-500">
                    <th className="pb-2 pr-3">Alumno</th>
                    <th className="pb-2 pr-3">Carrera</th>
                    <th className="pb-2 pr-3">Estado</th>
                    <th className="pb-2">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentEnrollments && recentEnrollments.length > 0 ? (
                    recentEnrollments.map((enrollment: Record<string, unknown>) => {
                      const profile = enrollment.profiles as Record<string, string> | null;
                      const program = enrollment.programs as Record<string, string> | null;
                      return (
                        <tr key={enrollment.id as string} className="text-gray-700">
                          <td className="py-2 pr-3">
                            <div className="font-medium">
                              {profile?.full_name || profile?.email || "—"}
                            </div>
                          </td>
                          <td className="py-2 pr-3 text-gray-500">
                            {program?.name || "—"}
                          </td>
                          <td className="py-2 pr-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[(enrollment.status as string) || ""] || "bg-gray-100 text-gray-600"}`}
                            >
                              {statusLabels[(enrollment.status as string) || ""] || (enrollment.status as string)}
                            </span>
                          </td>
                          <td className="py-2 text-xs text-gray-400">
                            {new Date(enrollment.enrolled_at as string).toLocaleDateString(
                              "es-EC",
                              { day: "2-digit", month: "short" }
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-gray-400"
                      >
                        Sin matriculas recientes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Pagos Recientes
            </CardTitle>
            <Link
              href="/admin/payments"
              className="text-xs font-medium text-[#1F2F58] hover:underline"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium text-gray-500">
                    <th className="pb-2 pr-3">Alumno</th>
                    <th className="pb-2 pr-3">Monto</th>
                    <th className="pb-2 pr-3">Metodo</th>
                    <th className="pb-2 pr-3">Estado</th>
                    <th className="pb-2">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentPayments && recentPayments.length > 0 ? (
                    recentPayments.map((payment: Record<string, unknown>) => {
                      const profile = payment.profiles as Record<string, string> | null;
                      return (
                        <tr key={payment.id as string} className="text-gray-700">
                          <td className="py-2 pr-3">
                            <div className="font-medium">
                              {profile?.full_name || profile?.email || "—"}
                            </div>
                          </td>
                          <td className="py-2 pr-3 font-medium">
                            ${(payment.amount as number)?.toFixed(2)}
                          </td>
                          <td className="py-2 pr-3 text-gray-500">
                            {methodLabels[(payment.method as string) || ""] || (payment.method as string)}
                          </td>
                          <td className="py-2 pr-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[(payment.status as string) || ""] || "bg-gray-100 text-gray-600"}`}
                            >
                              {statusLabels[(payment.status as string) || ""] || (payment.status as string)}
                            </span>
                          </td>
                          <td className="py-2 text-xs text-gray-400">
                            {new Date(payment.created_at as string).toLocaleDateString(
                              "es-EC",
                              { day: "2-digit", month: "short" }
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-gray-400"
                      >
                        Sin pagos recientes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Analytics Section ── */}
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="size-5 text-[#1F2F58]" />
          Analytics Academico
        </h2>

        {/* Row 1: Summary stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#73B8E7]/10">
                <ClipboardCheck className="size-5 text-[#73B8E7]" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Entregas Pendientes
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {pendingSubmissions ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <BarChart3 className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Tasa Aprobacion Quiz
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {quizPassRate}%
                  <span className="text-xs font-normal text-gray-400 ml-1">
                    ({passedQuizAttempts}/{totalQuizAttempts})
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FBBC0C]/10">
                <TrendingUp className="size-5 text-[#FBBC0C]" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Nuevos Esta Semana
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {newStudentsWeek ?? 0}
                  <span className="text-xs font-normal text-gray-400 ml-1">
                    / {newStudentsMonth ?? 0} mes
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F0846D]/10">
                <Sparkles className="size-5 text-[#F0846D]" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  AI Lab Costo/Mes
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ${aiCostMonth.toFixed(2)}
                  <span className="text-xs font-normal text-gray-400 ml-1">
                    ({aiRequestsMonth} req)
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Career completion + Popular subjects */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Completion rates per career */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <School className="size-4" />
                Completacion por Carrera
              </CardTitle>
            </CardHeader>
            <CardContent>
              {careerCompletionRates.length > 0 ? (
                <div className="space-y-4">
                  {careerCompletionRates.map((career) => (
                    <div key={career.code}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Badge className="border-none bg-[#1F2F58]/10 text-[#1F2F58] text-[10px]">
                            {career.code}
                          </Badge>
                          <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                            {career.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {career.completed}/{career.total} sesiones
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#1F2F58] to-[#73B8E7] transition-all duration-500"
                          style={{ width: `${career.percent}%` }}
                        />
                      </div>
                      <p className="text-right text-[10px] text-gray-400 mt-0.5">
                        {career.percent}%
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">
                  No hay carreras con datos de progreso
                </p>
              )}
            </CardContent>
          </Card>

          {/* Popular subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen className="size-4" />
                Top 5 Materias (por sesiones completadas)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {popularSubjects.length > 0 ? (
                <div className="space-y-3">
                  {popularSubjects.map((subject, idx) => {
                    const maxCompletions = popularSubjects[0].completions;
                    const barPercent = maxCompletions > 0
                      ? Math.round((subject.completions / maxCompletions) * 100)
                      : 0;
                    const colors = [
                      "from-[#FBBC0C] to-[#F0846D]",
                      "from-[#73B8E7] to-[#1F2F58]",
                      "from-emerald-400 to-emerald-600",
                      "from-[#F0846D] to-rose-600",
                      "from-purple-400 to-purple-600",
                    ];
                    return (
                      <div key={subject.code}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="flex size-5 items-center justify-center rounded text-[10px] font-bold bg-gray-100 text-gray-500">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-gray-700 truncate max-w-[200px]">
                              {subject.name}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-gray-500">
                            {subject.completions}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${colors[idx] || colors[0]} transition-all duration-500`}
                            style={{ width: `${barPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">
                  No hay datos de sesiones completadas
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Biblioteca Virtual ── */}
        <div className="mt-6">
          <h3 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2">
            <BookMarked className="size-4 text-[#1F2F58]" />
            Biblioteca Virtual — Uso y Auditoria SENESCYT
          </h3>
          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#1F2F58]/10">
                  <BookMarked className="size-5 text-[#1F2F58]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Busquedas</p>
                  <p className="text-lg font-bold text-gray-900">{totalLibrarySearches ?? 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#73B8E7]/10">
                  <BookOpen className="size-5 text-[#73B8E7]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Papers Guardados</p>
                  <p className="text-lg font-bold text-gray-900">{totalSavedPapers ?? 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <Download className="size-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Costo Infraestructura</p>
                  <p className="text-lg font-bold text-emerald-700">$0.00</p>
                  <p className="text-[10px] text-gray-400">APIs Open Access</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Top 10 Terminos Buscados (Evidencia SENESCYT)
              </CardTitle>
              <span className="text-[10px] text-gray-400 bg-gray-100 rounded px-2 py-0.5">
                Art. 61 RRA 2022
              </span>
            </CardHeader>
            <CardContent>
              {topQueries.length > 0 ? (
                <div className="space-y-2">
                  {topQueries.map(({ query, count }, idx) => (
                    <div key={query} className="flex items-center gap-3">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold bg-[#1F2F58]/8 text-[#1F2F58]">
                        {idx + 1}
                      </span>
                      <span className="flex-1 truncate text-sm text-gray-700">
                        {query}
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-gray-500">
                        {count}x
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">
                  Sin busquedas registradas aun. Los datos apareceran cuando los estudiantes usen la biblioteca.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Revenue summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <DollarSign className="size-4" />
              Resumen de Ingresos (Mes Actual)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-emerald-50 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-700">
                  ${monthlyRevenue.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-emerald-600/60 mt-1">
                  Confirmados
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 text-center">
                <p className="text-2xl font-bold text-amber-700">
                  {monthPayments?.length ?? 0}
                </p>
                <p className="text-xs text-amber-600/60 mt-1">
                  Pagos del mes
                </p>
              </div>
              <div className="rounded-xl bg-[#F0846D]/10 p-4 text-center">
                <p className="text-2xl font-bold text-[#F0846D]">
                  ${aiCostMonth.toFixed(2)}
                </p>
                <p className="text-xs text-[#F0846D]/60 mt-1">
                  Costo AI Lab
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Foros de Discusion — Participacion CES Art. 61 ── */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessagesSquare className="size-5 text-[#73B8E7]" />
            Participacion en Foros (CES Art. 61)
          </h2>
          <ForumExportButton metrics={forumMetrics} />
        </div>

        {forumMetrics.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-gray-400">
              No hay materias activas con datos de foro todavia.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                      <th className="px-4 py-3">Materia</th>
                      <th className="px-4 py-3 text-center">Posts</th>
                      <th className="px-4 py-3 text-center">Respuestas</th>
                      <th className="px-4 py-3 text-center">Autores</th>
                      <th className="px-4 py-3 text-center">Participacion</th>
                      <th className="px-4 py-3 text-center">Ultimo mensaje</th>
                      <th className="px-4 py-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {forumMetrics.map((m) => (
                      <tr key={m.subject_id} className="text-gray-700 hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#0A1628]">{m.subject_name}</div>
                          <div className="text-[10px] text-gray-400">{m.subject_code}</div>
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-[#1F2F58]">
                          {m.total_posts}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-500">
                          {m.total_replies}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-500">
                          {m.unique_authors}
                          {m.total_enrolled > 0 && (
                            <span className="text-[10px] text-gray-400">/{m.total_enrolled}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#73B8E7] to-[#1F2F58]"
                                style={{ width: `${m.participation_rate}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-[#1F2F58]">
                              {m.participation_rate}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-gray-400">
                          {m.last_post_at
                            ? new Date(m.last_post_at).toLocaleDateString("es-EC", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Sin actividad"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {m.is_inactive ? (
                            <Badge className="border-none bg-amber-100 text-amber-700 gap-1 text-[10px]">
                              <AlertCircle className="size-3" />
                              Inactivo
                            </Badge>
                          ) : (
                            <Badge className="border-none bg-emerald-100 text-emerald-700 text-[10px]">
                              Activo
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── ForumExportButton — anchor CSV generado en servidor ──
function ForumExportButton({
  metrics,
}: {
  metrics: {
    subject_code: string;
    subject_name: string;
    total_posts: number;
    total_replies: number;
    unique_authors: number;
    total_enrolled: number;
    participation_rate: number;
    last_post_at: string | null;
    is_inactive: boolean;
  }[];
}) {
  const header = [
    "Codigo",
    "Materia",
    "Posts",
    "Respuestas",
    "Autores_Unicos",
    "Total_Matriculados",
    "Tasa_Participacion_%",
    "Ultimo_Post",
    "Estado",
  ];
  const rows = metrics.map((m) => [
    m.subject_code,
    `"${m.subject_name.replace(/"/g, '""')}"`,
    String(m.total_posts),
    String(m.total_replies),
    String(m.unique_authors),
    String(m.total_enrolled),
    String(m.participation_rate),
    m.last_post_at
      ? new Date(m.last_post_at).toLocaleDateString("es-EC")
      : "Sin actividad",
    m.is_inactive ? "Inactivo" : "Activo",
  ]);
  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const href = `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(csv)}`;
  const today = new Date().toISOString().split("T")[0];

  return (
    <a
      href={href}
      download={`foros_participacion_${today}.csv`}
      className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-[#1F2F58]/20 hover:bg-[#1F2F58]/5 hover:text-[#1F2F58]"
    >
      <Download className="size-3.5" />
      Exportar CSV
    </a>
  );
}
