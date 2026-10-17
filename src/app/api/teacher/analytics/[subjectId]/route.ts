import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { StudentAtRisk, QuizErrorRate, SessionEngagementData } from "@/types/database";

// GET /api/teacher/analytics/[subjectId]
// Returns: students_at_risk, quiz_error_rates, session_engagement
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  const { subjectId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Verify teacher owns subject or is admin
  const isAdmin = ["super_admin", "admin", "coordinacion"].includes(profile?.role ?? "");
  if (!isAdmin) {
    const { data: subject } = await supabase
      .from("subjects")
      .select("teacher_id")
      .eq("id", subjectId)
      .single();
    if (!subject || subject.teacher_id !== user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
  }

  // Run all three queries in parallel
  const [studentsAtRisk, quizErrorRates, sessionEngagement] = await Promise.all([
    getStudentsAtRisk(subjectId, supabase),
    getQuizErrorRates(subjectId, supabase),
    getSessionEngagement(subjectId, supabase),
  ]);

  return NextResponse.json({ studentsAtRisk, quizErrorRates, sessionEngagement });
}

// ── Students at Risk ──────────────────────────────────────

async function getStudentsAtRisk(subjectId: string, supabase: Awaited<ReturnType<typeof createClient>>): Promise<StudentAtRisk[]> {
  // Get sessions for this subject
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id")
    .eq("subject_id", subjectId)
    .eq("is_active", true);

  const sessionIds = (sessions || []).map((s) => s.id);
  if (sessionIds.length === 0) return [];

  // Get enrolled students in this subject's program
  const { data: subjectRow } = await supabase
    .from("subjects")
    .select("semester_id")
    .eq("id", subjectId)
    .single();

  if (!subjectRow) return [];

  const { data: semester } = await supabase
    .from("semesters")
    .select("program_id")
    .eq("id", subjectRow.semester_id)
    .single();

  if (!semester) return [];

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("user_id")
    .eq("program_id", semester.program_id)
    .eq("status", "active");

  if (!enrollments || enrollments.length === 0) return [];

  const studentIds = enrollments.map((e) => e.user_id);

  // Get session progress per student
  const { data: progressRows } = await supabase
    .from("session_progress")
    .select("user_id, session_id, completed, completed_at, updated_at")
    .in("session_id", sessionIds)
    .in("user_id", studentIds);

  // Get quiz attempts per student for this subject's quizzes
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id")
    .in("session_id", sessionIds);

  const quizIds = (quizzes || []).map((q) => q.id);

  let quizAttemptsByStudent: Record<string, { score: number; max_score: number }[]> = {};
  if (quizIds.length > 0) {
    const { data: attempts } = await supabase
      .from("quiz_attempts")
      .select("user_id, score, max_score, passed")
      .in("quiz_id", quizIds)
      .in("user_id", studentIds)
      .not("completed_at", "is", null);

    for (const attempt of attempts || []) {
      if (!quizAttemptsByStudent[attempt.user_id]) {
        quizAttemptsByStudent[attempt.user_id] = [];
      }
      quizAttemptsByStudent[attempt.user_id].push({
        score: attempt.score || 0,
        max_score: attempt.max_score || 100,
      });
    }
  }

  // Get attendance data (consecutive absences)
  const { data: liveSessions } = await supabase
    .from("live_sessions")
    .select("id, session_id, started_at")
    .in("session_id", sessionIds)
    .order("started_at", { ascending: true });

  let consecutiveAbsencesByStudent: Record<string, number> = {};
  if (liveSessions && liveSessions.length > 0) {
    const liveSessionIds = liveSessions.map((ls) => ls.id);
    const { data: attendanceRows } = await supabase
      .from("attendance")
      .select("user_id, live_session_id, was_present")
      .in("live_session_id", liveSessionIds)
      .in("user_id", studentIds);

    const attendanceMap: Record<string, Record<string, boolean>> = {};
    for (const row of attendanceRows || []) {
      if (!attendanceMap[row.user_id]) attendanceMap[row.user_id] = {};
      attendanceMap[row.user_id][row.live_session_id] = row.was_present;
    }

    for (const studentId of studentIds) {
      let maxConsecutive = 0;
      let current = 0;
      for (const ls of liveSessions) {
        const attended = attendanceMap[studentId]?.[ls.id];
        if (attended === false) {
          current++;
          maxConsecutive = Math.max(maxConsecutive, current);
        } else if (attended === true) {
          current = 0;
        }
      }
      consecutiveAbsencesByStudent[studentId] = maxConsecutive;
    }
  }

  // Get student profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", studentIds);

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

  // Get existing interventions
  const { data: interventions } = await supabase
    .from("teacher_interventions")
    .select("student_id")
    .eq("subject_id", subjectId)
    .in("student_id", studentIds);
  const interventionSet = new Set((interventions || []).map((i) => i.student_id));

  // Evaluate risk criteria per student
  const result: StudentAtRisk[] = [];
  const progressByStudent: Record<string, typeof progressRows> = {};
  for (const row of progressRows || []) {
    if (!progressByStudent[row.user_id]) progressByStudent[row.user_id] = [];
    progressByStudent[row.user_id]!.push(row);
  }

  for (const studentId of studentIds) {
    const studentProgress = progressByStudent[studentId] || [];
    const completedCount = studentProgress.filter((p) => p.completed).length;
    const sessionCompletion = sessionIds.length > 0
      ? Math.round((completedCount / sessionIds.length) * 100)
      : 100;

    const quizAttempts = quizAttemptsByStudent[studentId] || [];
    const quizAverage =
      quizAttempts.length > 0
        ? quizAttempts.reduce((sum, a) =>
            sum + (a.max_score > 0 ? (a.score / a.max_score) * 100 : 0), 0
          ) / quizAttempts.length
        : null;

    const consecutiveAbsences = consecutiveAbsencesByStudent[studentId] || 0;

    const criteria: string[] = [];
    if (sessionCompletion < 70) {
      criteria.push(`${100 - sessionCompletion}% sesiones sin completar`);
    }
    if (quizAverage !== null && quizAverage < 60) {
      criteria.push(`Promedio quiz: ${quizAverage.toFixed(0)}%`);
    }
    if (consecutiveAbsences >= 2) {
      criteria.push(`${consecutiveAbsences} inasistencias consecutivas`);
    }

    if (criteria.length === 0) continue; // Not at risk

    const lastProgress = studentProgress
      .filter((p) => p.updated_at)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

    const studentProfile = profileMap.get(studentId);
    if (!studentProfile) continue;

    result.push({
      studentId,
      studentName: studentProfile.full_name,
      studentEmail: studentProfile.email,
      criteria,
      lastAccess: lastProgress?.updated_at ?? null,
      sessionCompletion,
      quizAverage,
      consecutiveAbsences,
      hasIntervention: interventionSet.has(studentId),
    });
  }

  return result;
}

// ── Quiz Error Rates ──────────────────────────────────────

async function getQuizErrorRates(subjectId: string, supabase: Awaited<ReturnType<typeof createClient>>): Promise<QuizErrorRate[]> {
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id")
    .eq("subject_id", subjectId);

  const sessionIds = (sessions || []).map((s) => s.id);
  if (sessionIds.length === 0) return [];

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id")
    .in("session_id", sessionIds);

  const quizIds = (quizzes || []).map((q) => q.id);
  if (quizIds.length === 0) return [];

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, question_text, options")
    .in("quiz_id", quizIds);

  if (!questions || questions.length === 0) return [];

  // Get all completed attempts
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("answers, quiz_id")
    .in("quiz_id", quizIds)
    .not("completed_at", "is", null);

  // Count errors per question
  const questionErrors: Record<string, { total: number; incorrect: number }> = {};
  for (const q of questions) {
    questionErrors[q.id] = { total: 0, incorrect: 0 };
  }

  for (const attempt of attempts || []) {
    if (!attempt.answers) continue;
    const answers = attempt.answers as Record<string, unknown>;

    for (const q of questions) {
      // Find if this question is in this attempt's quiz
      const answer = answers[q.id];
      if (answer === undefined) continue;

      questionErrors[q.id].total++;

      // Check correctness based on question type
      const opts = q.options as { correct_index?: number; correct_answer?: boolean; correct_indices?: number[] };
      let isCorrect = false;

      if (opts.correct_index !== undefined) {
        isCorrect = answer === opts.correct_index;
      } else if (opts.correct_answer !== undefined) {
        isCorrect = answer === opts.correct_answer;
      } else if (opts.correct_indices !== undefined) {
        const selectedArr = Array.isArray(answer) ? answer : [];
        const correctSet = new Set(opts.correct_indices);
        const selectedSet = new Set(selectedArr);
        isCorrect =
          correctSet.size === selectedSet.size &&
          [...correctSet].every((i) => selectedSet.has(i));
      }

      if (!isCorrect) {
        questionErrors[q.id].incorrect++;
      }
    }
  }

  const result: QuizErrorRate[] = questions
    .filter((q) => questionErrors[q.id].total > 0)
    .map((q) => ({
      questionId: q.id,
      questionText: q.question_text,
      totalAttempts: questionErrors[q.id].total,
      incorrectCount: questionErrors[q.id].incorrect,
      errorRate: questionErrors[q.id].total > 0
        ? questionErrors[q.id].incorrect / questionErrors[q.id].total
        : 0,
    }))
    .sort((a, b) => b.errorRate - a.errorRate);

  return result;
}

// ── Session Engagement ─────────────────────────────────────

async function getSessionEngagement(subjectId: string, supabase: Awaited<ReturnType<typeof createClient>>): Promise<SessionEngagementData[]> {
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, number, title")
    .eq("subject_id", subjectId)
    .eq("is_active", true)
    .order("number");

  if (!sessions || sessions.length === 0) return [];

  const sessionIds = sessions.map((s) => s.id);

  const { data: progressRows } = await supabase
    .from("session_progress")
    .select("session_id, completed, completed_at, created_at")
    .in("session_id", sessionIds);

  const result: SessionEngagementData[] = sessions.map((session) => {
    const sessionProgress = (progressRows || []).filter(
      (p) => p.session_id === session.id
    );
    const totalStudents = sessionProgress.length;
    const completedCount = sessionProgress.filter((p) => p.completed).length;
    const completionRate =
      totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;

    // Estimate avg duration from created_at to completed_at (in minutes)
    const durations = sessionProgress
      .filter((p) => p.completed && p.completed_at && p.created_at)
      .map((p) => {
        const start = new Date(p.created_at).getTime();
        const end = new Date(p.completed_at!).getTime();
        return (end - start) / 60000; // to minutes
      })
      .filter((d) => d > 0 && d < 600); // exclude outliers > 10h

    const avgDuration =
      durations.length > 0
        ? durations.reduce((sum, d) => sum + d, 0) / durations.length
        : null;

    return {
      sessionId: session.id,
      sessionNumber: session.number,
      sessionTitle: session.title,
      avgDurationMinutes: avgDuration,
      completionRate,
      totalStudents,
      completedCount,
    };
  });

  return result;
}
