// ============================================================
// ITSEIA Academy — PayPal Integration Utilities
// Sandbox & Production support via PAYPAL_MODE env var
// ============================================================

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;
const PAYPAL_MODE = process.env.PAYPAL_MODE || "sandbox";

const PAYPAL_BASE_URL =
  PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

/**
 * Get an OAuth 2.0 access token from PayPal.
 * Tokens are short-lived (~9 hours) so we fetch a fresh one per request.
 */
export async function getPayPalAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal OAuth error:", response.status, errorText);
    throw new Error("Error obteniendo token de PayPal");
  }

  const data = await response.json();
  return data.access_token as string;
}

/**
 * Create a PayPal order for checkout.
 * Returns the full PayPal order object including the order ID.
 */
export async function createOrder(
  amount: number,
  currency: string = "USD",
  description: string = "ITSEIA Academy"
): Promise<{ id: string; status: string }> {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description,
        },
      ],
      application_context: {
        brand_name: "ITSEIA Academy",
        locale: "es-EC",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal create order error:", response.status, errorText);
    throw new Error("Error creando orden en PayPal");
  }

  const data = await response.json();
  return { id: data.id, status: data.status };
}

/**
 * Capture a previously approved PayPal order.
 * Returns capture details including payer email and capture ID.
 */
export async function captureOrder(orderId: string): Promise<{
  id: string;
  status: string;
  captureId: string;
  payerEmail: string;
  amount: string;
  currency: string;
}> {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal capture error:", response.status, errorText);
    throw new Error("Error capturando pago en PayPal");
  }

  const data = await response.json();

  const capture =
    data.purchase_units?.[0]?.payments?.captures?.[0];
  const payerEmail =
    data.payer?.email_address || "";

  return {
    id: data.id,
    status: data.status,
    captureId: capture?.id || "",
    payerEmail,
    amount: capture?.amount?.value || "0",
    currency: capture?.amount?.currency_code || "USD",
  };
}
