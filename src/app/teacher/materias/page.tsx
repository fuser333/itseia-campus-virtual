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
        <h1 className="text-2xl font-bold text-gray-900">Mis Materias</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona el contenido de tus materias asignadas
        </p>
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <BookOpen className="size-10 text-gray-300" />
              <p className="text-sm text-gray-400">
                No tienes materias asignadas.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/teacher/materias/${subject.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-[#1F2F58]">
                    {subject.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium text-gray-700">
                        {subject.code}
                      </span>
                      {subject.semesters && (
                        <span>
                          {" "}
                          &middot; Periodo {subject.semesters.number}
                        </span>
                      )}
                      {subject.semesters?.programs && (
                        <span>
                          {" "}
                          &middot; {subject.semesters.programs.name}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="size-4 text-gray-400" />
                  </div>
                  <div className="mt-2 flex gap-2 text-[10px] text-gray-400">
                    <span>{subject.hours_docencia}h docencia</span>
                    <span>&middot;</span>
                    <span>{subject.hours_practica}h practica</span>
                    <span>&middot;</span>
                    <span>{subject.hours_total}h total</span>
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
