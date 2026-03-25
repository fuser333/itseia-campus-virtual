"use client";

import { useState, useCallback } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";

interface PayPalCheckoutProps {
  programId: string;
  programName: string;
  amount: number;
  onSuccess: (data: { enrollmentId: string; captureId: string }) => void;
}

type PayPalCheckoutStatus = "idle" | "loading" | "processing" | "success" | "error";

export default function PayPalCheckout({
  programId,
  programName,
  amount,
  onSuccess,
}: PayPalCheckoutProps) {
  const [status, setStatus] = useState<PayPalCheckoutStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const paypalOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "USD",
    intent: "capture",
  };

  const handleCreateOrder = useCallback(async (): Promise<string> => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creando la orden de pago.");
      }

      setStatus("idle");
      return data.orderId;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado.";
      setErrorMessage(message);
      setStatus("error");
      throw err;
    }
  }, [programId, amount]);

  const handleApprove = useCallback(
    async (data: { orderID: string }) => {
      setStatus("processing");
      setErrorMessage("");

      try {
        const response = await fetch("/api/payments/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Error capturando el pago.");
        }

        setStatus("success");
        onSuccess({
          enrollmentId: result.enrollmentId,
          captureId: result.captureId,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error procesando el pago.";
        setErrorMessage(message);
        setStatus("error");
      }
    },
    [onSuccess]
  );

  const handleError = useCallback(() => {
    setErrorMessage("Ocurrio un error con PayPal. Intenta de nuevo.");
    setStatus("error");
  }, []);

  const handleCancel = useCallback(() => {
    setErrorMessage("");
    setStatus("idle");
  }, []);

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-center">
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-green-500/10">
          <svg
            className="size-7 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-green-400">Pago exitoso</h3>
        <p className="mt-1 text-sm text-white/60">
          Tu inscripcion a {programName} ha sido confirmada. Redirigiendo...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Processing overlay */}
      {status === "processing" && (
        <div className="rounded-2xl border border-[#FBBC0C]/20 bg-[#FBBC0C]/5 p-6 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center">
            <div className="size-8 rounded-full border-2 border-[#FBBC0C] border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-medium text-[#FBBC0C]">
            Procesando tu pago...
          </p>
          <p className="mt-1 text-xs text-white/40">
            No cierres esta ventana.
          </p>
        </div>
      )}

      {/* Error message */}
      {status === "error" && errorMessage && (
        <div className="rounded-xl border border-[#F0846D]/20 bg-[#F0846D]/5 p-4 text-center">
          <p className="text-sm text-[#F0846D]">{errorMessage}</p>
          <button
            onClick={() => { setStatus("idle"); setErrorMessage(""); }}
            className="mt-2 text-xs font-medium text-white/60 underline hover:text-white/80"
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* PayPal buttons */}
      {(status === "idle" || status === "loading" || status === "error") && (
        <PayPalScriptProvider options={paypalOptions}>
          <div className="paypal-button-container">
            <PayPalButtons
              style={{
                color: "gold",
                shape: "rect",
                label: "pay",
                height: 50,
                layout: "vertical",
              }}
              createOrder={handleCreateOrder}
              onApprove={handleApprove}
              onError={handleError}
              onCancel={handleCancel}
              disabled={status === "loading"}
            />
          </div>
        </PayPalScriptProvider>
      )}

      {/* Security note */}
      <p className="text-center text-[10px] text-white/30">
        Pago seguro procesado por PayPal. ITSEIA no almacena datos de tarjeta.
      </p>
    </div>
  );
}
