import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import {
    buildProductListQuery,
    isAdminRequest,
    validateProductPayload,
    validateProductsQuery,
} from "@/lib/validation/products";

export const runtime = "nodejs";

export async function GET(request: Request) {
    try {
        const validation = validateProductsQuery(new URL(request.url).searchParams);
        if (!validation.ok) {
            return NextResponse.json({ success: false, message: validation.message }, { status: 400 });
        }
        if (validation.data.includeInactive && !isAdminRequest(request)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const connection = await connectToDatabase();
        if (!connection) {
            return NextResponse.json(
                { success: false, message: "Service is temporarily unavailable. Please try again later." },
                { status: 503 },
            );
        }

        const query = buildProductListQuery(validation.data);

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort({ sortOrder: 1, name: 1 })
                .skip(validation.data.skip)
                .limit(validation.data.limit)
                .lean(),
            Product.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                page: validation.data.page,
                limit: validation.data.limit,
                total,
                totalPages: Math.ceil(total / validation.data.limit),
            },
        });
    } catch (error) {
        console.error("Products API GET error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch products." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!isAdminRequest(request)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const payload = await request.json();
        const validation = validateProductPayload(payload);

        if (!validation.ok) {
            return NextResponse.json({ success: false, message: validation.message }, { status: 400 });
        }

        const connection = await connectToDatabase();
        if (!connection) {
            return NextResponse.json(
                { success: false, message: "Service is temporarily unavailable. Please try again later." },
                { status: 503 },
            );
        }

        const created = await Product.create(validation.data);
        return NextResponse.json({ success: true, data: created }, { status: 201 });
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            return NextResponse.json({ success: false, message: "A product with this slug already exists." }, { status: 409 });
        }

        console.error("Products API POST error:", error);
        return NextResponse.json({ success: false, message: "Failed to create product." }, { status: 500 });
    }
}
