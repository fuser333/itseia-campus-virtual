"use client";

// ============================================================
// /docente/preuni/programar-clases — Programar Sesiones Sincronicas
// Docente puede crear y gestionar clases en vivo desde aqui
// ============================================================

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Loader2,
  Video,
  CalendarDays,
  Plus,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subject } from "@/types/database";

interface SubjectRow extends Subject {
  semesters?: { number: number; programs?: { name: string } | null } | null;
}

export default function ProgramarClasesPage() {
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
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Programar Clases</h1>
          <p className="mt-1 text-sm text-white/50">
            Agenda sesiones sincronicas para tus materias. Los estudiantes las veran
            en su calendario automaticamente.
          </p>
        </div>
        <Link href="/calendario">
          <Button className="gap-2 bg-[#1F2F58] hover:bg-[#2A3F6E] text-white">
            <CalendarDays className="size-4" />
            Ver calendario global
          </Button>
        </Link>
      </div>

      {/* Info card */}
      <div className="rounded-lg border border-[#73B8E7]/30 bg-[#73B8E7]/5 p-4">
        <div className="flex items-start gap-3">
          <Video className="size-5 shrink-0 text-[#73B8E7] mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#73B8E7]">
              Clases sincronicas por materia
            </p>
            <p className="mt-0.5 text-sm text-white/75">
              Para programar una clase, accede a la materia y usa la opcion
              "Programar clase" en el editor de sesion. Las clases usan la
              sala de video conferencia integrada.
            </p>
          </div>
        </div>
      </div>

      {/* Subjects grid */}
      {subjects.length === 0 ? (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <BookOpen className="size-10 text-white/50" />
              <p className="text-sm text-white/55">
                No tienes materias asignadas para programar clases.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <h2 className="text-base font-semibold text-white">
            Selecciona una materia para programar una clase
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/docente/preuni/materias/${subject.id}`}>
                <Card className="group transition-all hover:shadow-md hover:border-[#1F2F58]/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-[#73B8E7]">
                      {subject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-white/50">
                        <span className="font-medium text-white/80">
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
                      <ArrowRight className="size-4 text-white/55 group-hover:text-[#73B8E7] transition-colors" />
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      <Plus className="size-3.5 text-[#FBBC0C]" />
                      <span className="text-xs font-medium text-[#73B8E7]">
                        Programar clase en esta materia
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
