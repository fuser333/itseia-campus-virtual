import { createClient } from "@supabase/supabase-js";

// Admin client that bypasses RLS - use ONLY in server components and API routes
// Never expose this to the browser
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);
