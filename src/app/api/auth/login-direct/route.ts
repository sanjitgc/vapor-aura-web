import { NextRequest, NextResponse } from "next/server";

const STOREFRONT_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_URL}/api/2026-04/graphql.json`;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

const LOGIN_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_QUERY = `
  query getCustomer($token: String!) {
    customer(customerAccessToken: $token) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;

const REGISTER_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

async function storefrontFetch(query: string, variables: Record<string, unknown>) {
  
    const res = await fetch(STOREFRONT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
    });
      const json = await res.json(); 
    return json;
}
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { action, email, password, firstName, lastName } = body;

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (action === "register") {
        const { data } = await storefrontFetch(REGISTER_MUTATION, {
            input: { email, password, firstName, lastName },
        });

        const errors = data?.customerCreate?.customerUserErrors;
        if (errors?.length) {
            return NextResponse.json({ error: errors[0].message }, { status: 400 });
        }

    }

    const { data: loginData } = await storefrontFetch(LOGIN_MUTATION, {
        input: { email, password },
    });

    const loginErrors = loginData?.customerAccessTokenCreate?.customerUserErrors;
    if (loginErrors?.length) {
        return NextResponse.json({ error: loginErrors[0].message }, { status: 401 });
    }

    const token = loginData?.customerAccessTokenCreate?.customerAccessToken;
    if (!token) {
        return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
    }

    const { data: customerData } = await storefrontFetch(CUSTOMER_QUERY, {
        token: token.accessToken,
    });

    const customer = customerData?.customer;

    const session = {
        accessToken: token.accessToken,
        expiresAt: new Date(token.expiresAt).getTime(),
        customer: {
            id: customer?.id ?? null,
            firstName: customer?.firstName ?? null,
            lastName: customer?.lastName ?? null,
            email: customer?.email ?? null,
            phone: customer?.phone ?? null,
        },
    };
    const response = NextResponse.json({ ok: true, customer: session.customer });

    response.cookies.set("va_session", JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(session.expiresAt),
        path: "/",
    });

    return response;
}