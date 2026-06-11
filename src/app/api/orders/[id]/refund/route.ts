import { NextRequest } from "next/server";

const REFUND_FEE = 0.10;

const SHOP = process.env.SHOPIFY_STORE_DOMAIN!;

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAdminAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 5 * 60 * 1000) {
    return cachedToken.value;
  }

  const response = await fetch(
    `https://${SHOP}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.SHOPIFY_CLIENT_ID!,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET!,
        grant_type: "client_credentials",
      }),
    }
  );

  const data = await response.json();
  if (!data.access_token) throw new Error("Failed to obtain admin access token");

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };

  return cachedToken.value;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { fullAmount, originalTransactionId, gateway, lineItems, reason, remarks } = await req.json();

  const numericTransactionId = originalTransactionId.split("/").pop();
  const token = await getAdminAccessToken();
  const lineItemsTotal = lineItems.reduce((sum: number, item: any) => {
    const price = parseFloat(item.price ?? item.originalUnitPrice ?? "0");
    const qty = parseInt(item.quantity ?? "1", 10);
    return sum + (price * qty);
  }, 0);

  if (!lineItemsTotal || isNaN(lineItemsTotal)) {
    return Response.json({ error: "Could not calculate refund amount from line items" }, { status: 400 });
  }
  const refundAmount = (lineItemsTotal * (1 - REFUND_FEE)).toFixed(2);

  const res = await fetch(
    `https://${SHOP}/admin/api/2026-04/orders/${id}/refunds.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        refund: {
          notify: true,
          note: remarks
            ? `Refund processed with 10% handling fee deducted. Reason: ${reason}. Remarks: ${remarks}`
            : `Refund processed with 10% handling fee deducted. Reason: ${reason}`,
          refund_line_items: lineItems.map((item: any) => ({
            line_item_id: item.lineItemId.split("/").pop(),
            quantity: item.quantity,
            restock_type: "return",
            location_id: process.env.SHOPIFY_LOCATION_ID!.split("/").pop()
          })),
          transactions: [{
            parent_id: numericTransactionId,
            amount: refundAmount,
            kind: "refund",
            gateway,
          }],
        },
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) return Response.json({ error: data?.errors ?? "Refund failed" }, { status: res.status });
  return Response.json(data);
}