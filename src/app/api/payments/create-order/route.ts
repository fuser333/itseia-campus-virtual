// ============================================================
// ITSEIA Academy — POST /api/payments/create-order
// Creates a PayPal order and saves to paypal_transactions
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createOrder } from "@/lib/paypal";

// Admin client for writing to paypal_transactions (bypasses RLS)
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
        { error: "Debes iniciar sesion para realizar un pago." },
        { status: 401 }
      );
    }

    // 2. Parse and validate body
    const body = await request.json();
    const { programId, amount } = body as {
      programId: string;
      amount: number;
    };

    if (!programId || typeof programId !== "string") {
      return Response.json(
        { error: "programId es requerido." },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return Response.json(
        { error: "amount debe ser un numero positivo." },
        { status: 400 }
      );
    }

    // 3. Validate program exists and amount matches
    const { data: program, error: programError } = await supabaseAdmin
      .from("programs")
      .select("id, name, price, is_active")
      .eq("id", programId)
      .single();

    if (programError || !program) {
      return Response.json(
        { error: "Programa no encontrado." },
        { status: 404 }
      );
    }

    if (!program.is_active) {
      return Response.json(
        { error: "Este programa no esta disponible actualmente." },
        { status: 400 }
      );
    }

    // Validate amount matches program price (allow 1 cent tolerance for rounding)
    if (Math.abs(Number(program.price) - amount) > 0.01) {
      return Response.json(
        { error: "El monto no coincide con el precio del programa." },
        { status: 400 }
      );
    }

    // 4. Check if user is already enrolled
    const { data: existingEnrollment } = await supabaseAdmin
      .from("enrollments")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("program_id", programId)
      .single();

    if (existingEnrollment?.status === "active") {
      return Response.json(
        { error: "Ya estas inscrito en este programa." },
        { status: 400 }
      );
    }

    // 5. Create PayPal order
    const description = `ITSEIA Academy - ${program.name}`;
    const paypalOrder = await createOrder(amount, "USD", description);

    // 6. Save to paypal_transactions table
    const { error: txError } = await supabaseAdmin
      .from("paypal_transactions")
      .insert({
        user_id: user.id,
        program_id: programId,
        paypal_order_id: paypalOrder.id,
        amount,
        currency: "USD",
        status: "created",
      });

    if (txError) {
      console.error("Error saving PayPal transaction:", txError);
      // Don't fail the payment flow, just log the error
    }

    // 7. Return order ID for the frontend
    return Response.json({ orderId: paypalOrder.id });
  } catch (error) {
    console.error("Error in create-order:", error);
    return Response.json(
      { error: "Error interno del servidor. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
