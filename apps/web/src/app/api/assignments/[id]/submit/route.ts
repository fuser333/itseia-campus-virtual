// ============================================================
// ITSEIA Academy — Assignment Submission API Route (POST)
// Auth check, receive file (FormData), upload to Supabase
// Storage bucket "submissions", insert into submissions table.
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assignmentId } = await params;

    // ── 1. Autenticar usuario ──
    const authClient = await createClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Debes iniciar sesion." },
        { status: 401 }
      );
    }

    // ── 2. Verificar que el assignment existe ──
    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from("assignments")
      .select("*")
      .eq("id", assignmentId)
      .eq("is_active", true)
      .single();

    if (assignmentError || !assignment) {
      return Response.json(
        { error: "Ejercicio no encontrado." },
        { status: 404 }
      );
    }

    // ── 3. Parsear FormData ──
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const notes = formData.get("notes") as string | null;

    if (!file) {
      return Response.json(
        { error: "Debes adjuntar un archivo." },
        { status: 400 }
      );
    }

    // ── 4. Validar tipo de archivo ──
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
    const allowedTypes: string[] = assignment.allowed_file_types || [
      "pdf",
      "zip",
      "py",
      "ipynb",
      "docx",
    ];

    if (!allowedTypes.includes(fileExtension)) {
      return Response.json(
        {
          error: `Tipo de archivo no permitido. Tipos aceptados: ${allowedTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // ── 5. Validar tamano de archivo ──
    const maxSizeBytes = (assignment.max_file_size_mb || 10) * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return Response.json(
        {
          error: `El archivo excede el tamano maximo de ${assignment.max_file_size_mb || 10}MB.`,
        },
        { status: 400 }
      );
    }

    // ── 6. Check if already submitted (allow resubmit if returned) ──
    const { data: existingSubmissions } = await supabaseAdmin
      .from("submissions")
      .select("id, status")
      .eq("assignment_id", assignmentId)
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false })
      .limit(1);

    const existingSub = existingSubmissions?.[0] ?? null;
    if (existingSub && existingSub.status === "graded") {
      return Response.json(
        { error: "Esta entrega ya fue calificada. No puedes reenviar." },
        { status: 400 }
      );
    }

    // ── 7. Upload file to Supabase Storage ──
    const timestamp = Date.now();
    const storagePath = `${user.id}/${assignmentId}/${timestamp}_${fileName}`;

    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabaseAdmin.storage
      .from("submissions")
      .upload(storagePath, fileBuffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error subiendo archivo:", uploadError);
      return Response.json(
        { error: "Error al subir el archivo. Intenta de nuevo." },
        { status: 500 }
      );
    }

    // ── 8. Get public URL ──
    const { data: urlData } = supabaseAdmin.storage
      .from("submissions")
      .getPublicUrl(storagePath);

    const fileUrl = urlData?.publicUrl || storagePath;

    // ── 9. Check due date (mark as late if applicable) ──
    let status: "submitted" | "late" = "submitted";
    if (assignment.due_date) {
      const dueDate = new Date(assignment.due_date);
      if (new Date() > dueDate) {
        status = "late";
      }
    }

    // ── 10. Insert or update submission ──
    let submission;
    if (existingSub && existingSub.status === "returned") {
      // Update existing returned submission
      const { data, error } = await supabaseAdmin
        .from("submissions")
        .update({
          file_url: fileUrl,
          file_name: fileName,
          file_size_bytes: file.size,
          notes: notes || null,
          status,
          grade: null,
          feedback: null,
          graded_by: null,
          graded_at: null,
          submitted_at: new Date().toISOString(),
        })
        .eq("id", existingSub.id)
        .select()
        .single();

      if (error) {
        console.error("Error actualizando submission:", error);
        return Response.json(
          { error: "Error al registrar la entrega." },
          { status: 500 }
        );
      }
      submission = data;
    } else if (!existingSub) {
      // Insert new submission
      const { data, error } = await supabaseAdmin
        .from("submissions")
        .insert({
          assignment_id: assignmentId,
          user_id: user.id,
          file_url: fileUrl,
          file_name: fileName,
          file_size_bytes: file.size,
          notes: notes || null,
          status,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error insertando submission:", error);
        return Response.json(
          { error: "Error al registrar la entrega." },
          { status: 500 }
        );
      }
      submission = data;
    } else {
      // Submitted but not yet graded - update in place
      const { data, error } = await supabaseAdmin
        .from("submissions")
        .update({
          file_url: fileUrl,
          file_name: fileName,
          file_size_bytes: file.size,
          notes: notes || null,
          status,
          submitted_at: new Date().toISOString(),
        })
        .eq("id", existingSub.id)
        .select()
        .single();

      if (error) {
        console.error("Error actualizando submission:", error);
        return Response.json(
          { error: "Error al registrar la entrega." },
          { status: 500 }
        );
      }
      submission = data;
    }

    // ── 11. Award XP for first submission ──
    if (!existingSub) {
      const xpToAward = 15;
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("nivel_xp")
        .eq("id", user.id)
        .single();

      if (profile) {
        await supabaseAdmin
          .from("profiles")
          .update({ nivel_xp: (profile.nivel_xp || 0) + xpToAward })
          .eq("id", user.id);
      }
    }

    return Response.json({
      submission,
      message:
        status === "late"
          ? "Entrega registrada (fuera de fecha)."
          : "Entrega registrada exitosamente.",
    });
  } catch (error) {
    console.error("Error en /api/assignments/[id]/submit:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
