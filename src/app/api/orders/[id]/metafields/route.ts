import { NextRequest } from "next/server";

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
  const body = await req.json();
  const token = await getAdminAccessToken();

  const res = await fetch(
    `https://${SHOP}/admin/api/2026-04/orders/${id}/metafields.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ metafield: body }),
    }
  );

  const data = await res.json();
  if (!res.ok) return Response.json({ error: data?.errors }, { status: res.status });
  return Response.json(data);
}