// scripts/seed-docente-hector.mjs
// Crea una cuenta DOCENTE PURA (no admin) para Héctor
// para que entre directo al panel docente sin caer en admin.
//
// Email: docente@itseia.ai
// Password: ItseiaDocente2026!
// Role: docente (puro, sin acceso admin)
// Asignación: docente_cohorte_assignments → preuni / cohorte-jun-2026

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Faltan envs Supabase");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const EMAIL = "docente@itseia.ai";
const PASSWORD = "ItseiaDocente2026!";
const NAME = "Héctor Velasco (Docente)";

async function main() {
  console.log("→ Creando cuenta docente pura:", EMAIL);

  // 1) ¿Existe?
  const { data: list } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  let user = list?.users?.find((u) => u.email === EMAIL);

  if (user) {
    console.log("  · ya existe, actualizo password");
    await supabase.auth.admin.updateUserById(user.id, {
      password: PASSWORD,
      email_confirm: true,
    });
  } else {
    const { data: created, error: createErr } =
      await supabase.auth.admin.createUser({
        email: EMAIL,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: NAME },
      });
    if (createErr) {
      console.error("ERROR creando:", createErr);
      process.exit(1);
    }
    user = created.user;
    console.log("  · creada con id:", user.id);
  }

  // 2) profile con role=docente (puro, NO admin)
  const { error: upsertErr } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: EMAIL,
      full_name: NAME,
      role: "docente",
    },
    { onConflict: "id" }
  );
  if (upsertErr) {
    console.error("ERROR upsert profile:", upsertErr);
    process.exit(1);
  }
  console.log("  · profile.role = docente");

  // 3) Asignar a preuni / cohorte-jun-2026
  const { error: assignPreuniErr } = await supabase
    .from("docente_cohorte_assignments")
    .upsert(
      {
        docente_id: user.id,
        producto: "preuni",
        cohorte_slug: "cohorte-jun-2026",
        rol_en_cohorte: "titular",
        activo: true,
      },
      { onConflict: "docente_id,producto,cohorte_slug" }
    );
  if (assignPreuniErr) {
    console.warn("  ⚠ assignment preuni:", assignPreuniErr.message);
  } else {
    console.log("  · asignado a preuni/cohorte-jun-2026 (titular)");
  }

  // 4) Asignar a cursos-pro / inca-gisela
  const { error: assignCursosErr } = await supabase
    .from("docente_cohorte_assignments")
    .upsert(
      {
        docente_id: user.id,
        producto: "cursos-pro",
        cohorte_slug: "inca-gisela",
        rol_en_cohorte: "titular",
        activo: true,
      },
      { onConflict: "docente_id,producto,cohorte_slug" }
    );
  if (assignCursosErr) {
    console.warn("  ⚠ assignment cursos-pro:", assignCursosErr.message);
  } else {
    console.log("  · asignado a cursos-pro/inca-gisela (titular)");
  }

  console.log("");
  console.log("════════════════════════════════════════");
  console.log("✅ CUENTA DOCENTE LISTA");
  console.log("════════════════════════════════════════");
  console.log("URL:      https://tecnologico.itseia.ai/login");
  console.log("Email:    " + EMAIL);
  console.log("Password: " + PASSWORD);
  console.log("Role:     docente (puro · NO admin)");
  console.log("════════════════════════════════════════");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
