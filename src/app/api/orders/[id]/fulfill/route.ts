import { NextRequest, NextResponse } from "next/server";

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

async function adminGraphQL(query: string, variables?: object) {
  const token = await getAdminAccessToken();
  const res = await fetch(
    `https://${SHOP}/admin/api/2026-04/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  const data = await res.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data;
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params;

  try {
    const orderData = await adminGraphQL(
      `query getFulfillmentOrders($id: ID!) {
        order(id: $id) {
          fulfillmentOrders(first: 10) {
            edges {
              node {
                id
                status
              }
            }
          }
        }
      }`,
      { id: `gid://shopify/Order/${orderId}` }
    );

    const fulfillmentOrders = orderData.order.fulfillmentOrders.edges.map(
      (e: { node: { id: string; status: string } }) => e.node
    );

    const fulfillable = fulfillmentOrders.filter(
      (fo: { status: string }) =>
        fo.status === "OPEN" || fo.status === "IN_PROGRESS"
    );

    if (fulfillable.length === 0) {
      return NextResponse.json(
        { error: "Order is already fulfilled or has no fulfillable items" },
        { status: 400 }
      );
    }

    const fulfillData = await adminGraphQL(
      `mutation fulfillOrder($fulfillment: FulfillmentV2Input!) {
        fulfillmentCreateV2(fulfillment: $fulfillment) {
          fulfillment {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        fulfillment: {
          notifyCustomer: true,
          lineItemsByFulfillmentOrder: fulfillable.map(
            (fo: { id: string }) => ({ fulfillmentOrderId: fo.id })
          ),
        },
      }
    );

    const userErrors = fulfillData.fulfillmentCreateV2.userErrors;
    if (userErrors.length > 0) {
      return NextResponse.json({ error: userErrors[0].message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      fulfillment: fulfillData.fulfillmentCreateV2.fulfillment,
    });
  } catch (err) {
    console.error("Fulfill error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}