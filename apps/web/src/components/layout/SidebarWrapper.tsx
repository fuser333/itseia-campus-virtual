import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Sidebar from "@/components/layout/Sidebar";

/**
 * Server Component wrapper for Sidebar.
 * Fetches the user profile server-side (using admin client to bypass RLS)
 * and passes it as props to the client Sidebar component.
 * This guarantees the correct menu renders regardless of client-side auth state.
 */
export default async function SidebarWrapper() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) return null;

  // Use admin client to guarantee profile data (bypasses RLS)
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  let programTypes: string[] = [];
  let hasCertEnrollment = false;

  // Only fetch enrollment data for students
  if (profile?.role === "estudiante") {
    const { data: enrollments } = await supabaseAdmin
      .from("enrollments")
      .select("programs(type)")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (enrollments) {
      programTypes = enrollments
        .map((e) => {
          const prog = e.programs as unknown as { type: string } | null;
          return prog?.type ?? null;
        })
        .filter((t): t is string => t !== null);
    }

    const { data: certs } = await supabaseAdmin
      .from("certification_enrollments")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    hasCertEnrollment = !!(certs && certs.length > 0);
  }

  return (
    <Sidebar
      serverUser={{ id: user.id, email: user.email ?? "" }}
      serverProfile={profile}
      serverProgramTypes={programTypes}
      serverHasCertEnrollment={hasCertEnrollment}
    />
  );
}
