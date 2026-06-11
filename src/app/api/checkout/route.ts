import { NextRequest, NextResponse } from "next/server";

const STOREFRONT_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

interface CartLineInput {
    variantId: string;
    quantity: number;
}

const CREATE_CART_MUTATION = `
  mutation cartCreate($lines: [CartLineInput!]!, $buyerIdentity: CartBuyerIdentityInput) {
    cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const lines: CartLineInput[] = body.lines;
        const email: string | undefined = body.email;

        if (!Array.isArray(lines) || lines.length === 0) {
            return NextResponse.json({ error: "No items provided." }, { status: 400 });
        }

        const variables: Record<string, unknown> = {
            lines: lines.map((l) => ({
                merchandiseId: l.variantId,
                quantity: l.quantity,
            })),
        };

        if (email) {
            variables.buyerIdentity = { email };
        }

        const res = await fetch(STOREFRONT_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
            },
            body: JSON.stringify({ query: CREATE_CART_MUTATION, variables }),
        });

        const { data, errors } = await res.json();

        if (errors?.length) {
            console.error("Shopify GraphQL errors:", errors);
            return NextResponse.json({ error: errors[0].message }, { status: 500 });
        }

        const userErrors = data?.cartCreate?.userErrors;
        if (userErrors?.length) {
            return NextResponse.json({ error: userErrors[0].message }, { status: 400 });
        }

        const checkoutUrl: string = data?.cartCreate?.cart?.checkoutUrl;
        if (!checkoutUrl) {
            return NextResponse.json({ error: "Failed to create cart." }, { status: 500 });
        }

         const returnUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/?checkout_complete=1`;
        const finalUrl = `${checkoutUrl}&return_to=${encodeURIComponent(returnUrl)}`;

        return NextResponse.json({ checkoutUrl: finalUrl });
    } catch (err) {
        console.error("Checkout route error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}