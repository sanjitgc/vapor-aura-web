import { NextResponse } from "next/server";
import { createCart, addToCart, getCart } from "@/lib/shopify";

export const runtime = "nodejs";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const cartId = searchParams.get("cartId");

        if (!cartId) {
            return NextResponse.json(
                { success: false, message: "Cart ID required" },
                { status: 400 }
            );
        }

        const cart = await getCart(cartId);
        return NextResponse.json({ success: true, data: cart });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch cart" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { cartId, items } = await request.json();

        let cart;
        if (cartId) {
            cart = await addToCart(cartId, items);
        } else {
            cart = await createCart(items);
        }

        return NextResponse.json({ success: true, data: cart });
    } catch (error) {
        console.error("Cart API error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to process cart" },
            { status: 500 }
        );
    }
}