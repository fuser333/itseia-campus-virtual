// ============================================================
// ITSEIA Academy — POST /api/payments/capture-order
// Captures a PayPal payment, creates enrollment & payment record
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { captureOrder } from "@/lib/paypal";

// Admin client for writing (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function getAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored in Server Components
          }
        },
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const supabase = await getAuthClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Debes iniciar sesion para completar el pago." },
        { status: 401 }
      );
    }

    // 2. Parse body
    const body = await request.json();
    const { orderId } = body as { orderId: string };

    if (!orderId || typeof orderId !== "string") {
      return Response.json(
        { error: "orderId es requerido." },
        { status: 400 }
      );
    }

    // 3. Verify the transaction belongs to this user
    const { data: transaction, error: txFetchError } = await supabaseAdmin
      .from("paypal_transactions")
      .select("*")
      .eq("paypal_order_id", orderId)
      .eq("user_id", user.id)
      .single();

    if (txFetchError || !transaction) {
      return Response.json(
        { error: "Transaccion no encontrada." },
        { status: 404 }
      );
    }

    if (transaction.status === "captured") {
      return Response.json(
        { error: "Este pago ya fue procesado." },
        { status: 400 }
      );
    }

    // 4. Capture PayPal payment
    const captureResult = await captureOrder(orderId);

    if (captureResult.status !== "COMPLETED") {
      // Update transaction as failed
      await supabaseAdmin
        .from("paypal_transactions")
        .update({ status: "failed" })
        .eq("paypal_order_id", orderId);

      return Response.json(
        { error: "El pago no pudo ser completado. Intenta de nuevo." },
        { status: 400 }
      );
    }

    // 5. Update paypal_transactions with capture details
    await supabaseAdmin
      .from("paypal_transactions")
      .update({
        status: "captured",
        capture_id: captureResult.captureId,
        payer_email: captureResult.payerEmail,
        captured_at: new Date().toISOString(),
      })
      .eq("paypal_order_id", orderId);

    // 6. Create or reactivate enrollment
    const programId = transaction.program_id;

    const { data: existingEnrollment } = await supabaseAdmin
      .from("enrollments")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("program_id", programId)
      .single();

    let enrollmentId: string;

    if (existingEnrollment) {
      // Reactivate if cancelled/suspended
      if (existingEnrollment.status !== "active") {
        await supabaseAdmin
          .from("enrollments")
          .update({ status: "active" })
          .eq("id", existingEnrollment.id);
      }
      enrollmentId = existingEnrollment.id;
    } else {
      // Create new enrollment
      const { data: newEnrollment, error: enrollError } = await supabaseAdmin
        .from("enrollments")
        .insert({
          user_id: user.id,
          program_id: programId,
          status: "active",
        })
        .select("id")
        .single();

      if (enrollError || !newEnrollment) {
        console.error("Error creating enrollment:", enrollError);
        return Response.json(
          { error: "Pago exitoso pero hubo un error creando tu inscripcion. Contacta soporte." },
          { status: 500 }
        );
      }
      enrollmentId = newEnrollment.id;
    }

    // 7. Create payment record in payments table
    const { error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: user.id,
        enrollment_id: enrollmentId,
        amount: Number(captureResult.amount),
        method: "paypal",
        status: "confirmed",
        reference: `PayPal ${captureResult.captureId}`,
      });

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
      // Enrollment was created, don't fail the whole flow
    }

    // 8. Return success
    return Response.json({
      success: true,
      enrollmentId,
      captureId: captureResult.captureId,
    });
  } catch (error) {
    console.error("Error in capture-order:", error);
    return Response.json(
      { error: "Error interno del servidor. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
