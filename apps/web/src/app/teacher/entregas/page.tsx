"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SubmissionsTable from "@/components/teacher/SubmissionsTable";
import type { Subject } from "@/types/database";

export default function TeacherEntregasPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);

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
        .select("*")
        .eq("is_active", true)
        .order("order_index");

      if (!userIsAdmin) {
        query = query.eq("teacher_id", user.id);
      }

      const { data } = await query;
      setSubjects(data || []);
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
        <h1 className="text-2xl font-bold text-white">Entregas</h1>
        <p className="mt-1 text-sm text-white/65">
          Revisa y califica las entregas de tus estudiantes
        </p>
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <FileCheck className="size-10 text-white/50" />
              <p className="text-sm text-white/55">
                No tienes materias asignadas.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <SubmissionsTable subjects={subjects} />
      )}
    </div>
  );
}
