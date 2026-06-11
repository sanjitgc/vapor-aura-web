import { NextResponse } from "next/server";

const SHOP = process.env.SHOPIFY_STORE_DOMAIN!;
const API_KEY = process.env.SHOPIFY_CLIENT_ID!;
const API_SECRET = process.env.SHOPIFY_CLIENT_SECRET!;

async function getAdminAccessToken(): Promise<string> {
  const response = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: API_KEY,
      client_secret: API_SECRET,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

const query = `
{
  orders(first: 100, reverse: true) {
    edges {
      node {
        id
        name
        createdAt
        displayFinancialStatus
        displayFulfillmentStatus
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          displayName
          email
          phone
        }
        phone
        shippingAddress {
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          country
          phone
        }
        lineItems(first: 10) {
  edges {
    node {
      id
      title
      quantity
      originalUnitPriceSet {
        shopMoney {
          amount
        }
      }
    }
  }
}
  shippingLines(first: 5) {
  edges {
    node {
      originalPriceSet {
        shopMoney {
          amount
        }
      }
    }
  }
}
        metafields(first: 10, namespace: "vapor_aura") {
          edges {
            node {
              key
              value
              namespace
            }
          }
        }
        transactions(first: 10) {
          id
          status
          kind
          gateway
          amount
          processedAt
        }
      }
    }
  }
}`;

export async function GET() {
  try {
    const accessToken = await getAdminAccessToken();

    const response = await fetch(
      `https://${SHOP}/admin/api/2026-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { error: "Shopify GraphQL error", details: data.errors },
        { status: 500 }
      );
    }

    if (!data?.data?.orders?.edges) {
      return NextResponse.json(
        { error: "Unexpected Shopify response shape", raw: data },
        { status: 500 }
      );
    }

    return NextResponse.json(
      data.data.orders.edges.map((e: any) => e.node)
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders", details: String(error) },
      { status: 500 }
    );
  }
}