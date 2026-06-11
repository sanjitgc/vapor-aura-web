import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { isAdminRequest, validateProductPayload } from "@/lib/validation/products";
import {
    getProductByHandle,
    updateShopifyProduct,
    deleteShopifyProduct,getAdminProductByHandle
} from "@/lib/shopify";
export const runtime = "nodejs";

interface ProductRouteContext {
    params: Promise<{ slug: string }>;
}

export async function GET(_: Request, context: ProductRouteContext) {
    try {
        const { slug } = await context.params;
        const safeSlug = slug.trim().toLowerCase();
        if (!safeSlug) {
            return NextResponse.json({ success: false, message: "Product slug is required." }, { status: 400 });
        }

        // const connection = await connectToDatabase();
        // if (!connection) {
        //     return NextResponse.json(
        //         { success: false, message: "Service is temporarily unavailable. Please try again later." },
        //         { status: 503 },
        //     );
        // }

        // const product = await Product.findOne({ slug: safeSlug, isActive: true }).lean();
        const product = await getProductByHandle(slug);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        console.error("Product detail API GET error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch product details." }, { status: 500 });
    }
}

export async function PATCH(request: Request, context: ProductRouteContext) {
    try {
        if (!isAdminRequest(request)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await context.params;
        // const currentSlug = slug.trim().toLowerCase();
        // if (!currentSlug) {
        //     return NextResponse.json({ success: false, message: "Product slug is required." }, { status: 400 });
        // }

        const payload = await request.json();
        // const validation = validateProductPayload(payload);
        // if (!validation.ok) {
        //     return NextResponse.json({ success: false, message: validation.message }, { status: 400 });
        // }

        // const connection = await connectToDatabase();
        // if (!connection) {
        //     return NextResponse.json(
        //         { success: false, message: "Service is temporarily unavailable. Please try again later." },
        //         { status: 503 },
        //     );
        // }
        const existing = await getAdminProductByHandle(slug);
        // const updated = await Product.findOneAndUpdate(
        //     { slug: currentSlug },
        //     validation.data,
        //     { new: true, runValidators: true },
        // ).lean();

        if (!existing) {
            return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
        }
        const updated = await updateShopifyProduct(existing.id, {
            title: payload.name,
            descriptionHtml: payload.description,
            tags: [payload.category?.toLowerCase()],
            price:payload.price?.toString(),
            imageUrl:payload.image || undefined
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            return NextResponse.json({ success: false, message: "A product with this slug already exists." }, { status: 409 });
        }

        console.error("Product detail API PATCH error:", error);
        return NextResponse.json({ success: false, message: "Failed to update product." }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: ProductRouteContext) {
    try {
        // if (!isAdminRequest(request)) {
        //     return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        // }

        const { slug } = await context.params;

        const existing = await getAdminProductByHandle(slug);
        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Product not found." },
                { status: 404 }
            );
        }

        await deleteShopifyProduct(existing.id);

        return NextResponse.json({ success: true, message: "Product deleted." });
    } catch (error) {
        console.error("Product detail API DELETE error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete product." },
            { status: 500 }
        );
    }
}
