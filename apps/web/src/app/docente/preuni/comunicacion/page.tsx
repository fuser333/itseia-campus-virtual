"use client";

// ============================================================
// /docente/preuni/comunicacion — Anuncios y Mensajes Directos
// ============================================================

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Loader2,
  Megaphone,
  MessageSquare,
  ArrowLeft,
  Send,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnnouncementComposer } from "@/components/teacher/AnnouncementComposer";
import type { Subject, DirectMessage, Profile } from "@/types/database";

interface SubjectRow extends Subject {
  semesters?: { number: number; programs?: { name: string } | null } | null;
}

interface StudentThread {
  studentId: string;
  studentName: string;
  subjectName: string;
  messages: DirectMessage[];
  unreadCount: number;
}

type Tab = "anuncios" | "mensajes";

export default function ComunicacionPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("anuncios");

  // Messages state
  const [students, setStudents] = useState<
    { id: string; full_name: string; subject: string; subjectId: string }[]
  >([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [thread, setThread] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = ["super_admin", "admin", "coordinacion"].includes(profile?.role ?? "");

    let subjectsQuery = supabase
      .from("subjects")
      .select("*, semesters(number, programs(name))")
      .eq("is_active", true)
      .order("order_index");

    if (!isAdmin) {
      subjectsQuery = subjectsQuery.eq("teacher_id", user.id);
    }

    const { data: subjectsData } = await subjectsQuery;
    const mySubjects = (subjectsData || []) as SubjectRow[];
    setSubjects(mySubjects);

    // Load enrolled students for messages tab
    if (mySubjects.length > 0) {
      const subjectIds = mySubjects.map((s) => s.id);
      const semesterIds = [...new Set(mySubjects.map((s) => s.semester_id))];
      const { data: semData } = await supabase
        .from("semesters")
        .select("id, program_id")
        .in("id", semesterIds);

      const programIds = [...new Set((semData || []).map((s) => s.program_id))];
      const semesterByProgram = new Map((semData || []).map((s) => [s.program_id, s.id]));

      if (programIds.length > 0) {
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("user_id, program_id")
          .in("program_id", programIds)
          .eq("status", "active");

        const studentIds = [...new Set((enrollments || []).map((e) => e.user_id))];

        if (studentIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", studentIds);

          const studentList = (profiles || []).map((p) => {
            const enrollment = (enrollments || []).find((e) => e.user_id === p.id);
            const subject = mySubjects.find(
              (s) => semesterByProgram.get(enrollment?.program_id ?? "") === s.semester_id
            );
            return {
              id: p.id,
              full_name: p.full_name,
              subject: subject?.name ?? "",
              subjectId: subject?.id ?? "",
            };
          });

          setStudents(studentList);
        }
      }
    }

    setLoading(false);
  }

  async function loadThread(studentId: string) {
    setLoadingThread(true);
    setSelectedStudent(studentId);
    setThread([]);

    const { data } = await supabase
      .from("direct_messages")
      .select("*")
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .or(`sender_id.eq.${studentId},recipient_id.eq.${studentId}`)
      .order("sent_at", { ascending: true });

    // Filter to only messages between userId and studentId
    const filtered = (data || []).filter(
      (m) =>
        (m.sender_id === userId && m.recipient_id === studentId) ||
        (m.sender_id === studentId && m.recipient_id === userId)
    );

    setThread(filtered);

    // Mark as read
    await supabase
      .from("direct_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("sender_id", studentId)
      .eq("recipient_id", userId)
      .is("read_at", null);

    setLoadingThread(false);
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedStudent) return;
    setSending(true);

    const studentData = students.find((s) => s.id === selectedStudent);
    const { data } = await supabase
      .from("direct_messages")
      .insert({
        sender_id: userId,
        recipient_id: selectedStudent,
        subject_id: studentData?.subjectId || null,
        body: newMessage.trim(),
      })
      .select()
      .single();

    if (data) {
      setThread((prev) => [...prev, data]);
      setNewMessage("");
    }
    setSending(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/docente/preuni">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="size-4" data-icon="inline-start" />
            Volver al panel
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Comunicacion</h1>
        <p className="mt-1 text-sm text-white/65">
          Anuncios para tus materias y mensajes directos a estudiantes
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 rounded-xl border border-white/20 bg-[#0A1628]/80 p-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("anuncios")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "anuncios"
              ? "bg-[#1F2F58] text-white shadow-sm"
              : "text-white/65 hover:text-white hover:bg-white/10"
          }`}
        >
          <Megaphone className="size-3.5" />
          Anuncios
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("mensajes")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "mensajes"
              ? "bg-[#1F2F58] text-white shadow-sm"
              : "text-white/65 hover:text-white hover:bg-white/10"
          }`}
        >
          <MessageSquare className="size-3.5" />
          Mensajes directos
        </button>
      </div>

      {/* Anuncios tab */}
      {activeTab === "anuncios" && (
        <>
          {subjects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-white/55">
                  No tienes materias asignadas para publicar anuncios.
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnnouncementComposer
              subjects={subjects.map((s) => ({
                id: s.id,
                name: s.name,
                code: s.code,
              }))}
            />
          )}
        </>
      )}

      {/* Mensajes directos tab */}
      {activeTab === "mensajes" && (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* Students list */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Estudiantes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {students.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-white/55">
                  No hay estudiantes matriculados.
                </p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => loadThread(student.id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#0A1628]/60 ${
                        selectedStudent === student.id ? "bg-[#1F2F58]/5" : ""
                      }`}
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <User className="size-4 text-white/55" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {student.full_name}
                        </p>
                        <p className="truncate text-xs text-white/55">
                          {student.subject}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message thread */}
          <Card>
            {!selectedStudent ? (
              <CardContent className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="mx-auto size-10 text-white/80 mb-2" />
                  <p className="text-sm text-white/55">
                    Selecciona un estudiante para ver el hilo de mensajes
                  </p>
                </div>
              </CardContent>
            ) : loadingThread ? (
              <CardContent className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
              </CardContent>
            ) : (
              <CardContent className="flex flex-col p-0" style={{ height: "480px" }}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {thread.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-white/55">
                        No hay mensajes aun. Inicia la conversacion.
                      </p>
                    </div>
                  ) : (
                    thread.map((msg) => {
                      const isOwn = msg.sender_id === userId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                              isOwn
                                ? "bg-[#1F2F58] text-white rounded-br-none"
                                : "bg-white/10 text-white rounded-bl-none"
                            }`}
                          >
                            <p className="leading-relaxed">{msg.body}</p>
                            <p
                              className={`mt-1 text-[10px] ${
                                isOwn ? "text-white/60" : "text-white/55"
                              }`}
                            >
                              {new Date(msg.sent_at).toLocaleTimeString("es-EC", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {msg.read_at && isOwn && " ✓"}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Compose */}
                <div className="border-t border-white/20 p-3 flex items-end gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="min-h-[60px] resize-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    size="icon"
                    className="shrink-0 bg-[#1F2F58] hover:bg-[#2A3F6E] text-white"
                  >
                    {sending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
