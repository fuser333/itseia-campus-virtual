"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Loader2,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subject } from "@/types/database";

interface SubjectRow extends Subject {
  semesters?: { number: number; programs?: { name: string } | null } | null;
}

export default function TeacherMateriasPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);

  useEffect(() => {
    async function fetchSubjects() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const adminRoles = ["super_admin", "admin", "coordinacion"];
      const userIsAdmin = profile ? adminRoles.includes(profile.role) : false;

      let query = supabase
        .from("subjects")
        .select("*, semesters ( number, programs ( name ) )")
        .eq("is_active", true)
        .order("order_index");

      if (!userIsAdmin) {
        query = query.eq("teacher_id", user.id);
      }

      const { data } = await query;
      setSubjects((data || []) as SubjectRow[]);
      setLoading(false);
    }

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mis Materias</h1>
        <p className="mt-1 text-sm text-white/70">
          Gestiona el contenido de tus materias asignadas
        </p>
      </div>

      {subjects.length === 0 ? (
        <Card className="border-white/20 bg-[#0A1628]/80">
          <CardContent>
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <BookOpen className="size-10 text-white/40" />
              <p className="text-sm text-white/60">
                No tienes materias asignadas.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/teacher/materias/${subject.id}`}>
              <Card className="border-white/20 bg-[#0A1628]/80 transition-all hover:border-[#FBBC0C]/60 hover:bg-[#1F2F58]/80 hover:shadow-lg hover:shadow-[#FBBC0C]/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold leading-snug text-white">
                    {subject.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-white/80">
                      <span className="rounded bg-[#FBBC0C]/25 px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#FBBC0C]">
                        {subject.code}
                      </span>
                      {subject.semesters && (
                        <span className="font-medium text-white/90">
                          Periodo {subject.semesters.number}
                        </span>
                      )}
                      {subject.semesters?.programs && (
                        <span className="text-white/70">
                          &middot; {subject.semesters.programs.name}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-[#73B8E7]" />
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-white/75">
                    <span>
                      <span className="font-semibold text-[#73B8E7]">{subject.hours_docencia}h</span> docencia
                    </span>
                    <span className="text-white/40">&middot;</span>
                    <span>
                      <span className="font-semibold text-[#73B8E7]">{subject.hours_practica}h</span> practica
                    </span>
                    <span className="text-white/40">&middot;</span>
                    <span>
                      <span className="font-semibold text-[#FBBC0C]">{subject.hours_total}h</span> total
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
