import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/validation/products";
import { uploadImageToShopify } from "@/lib/shopify";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        if (!isAdminRequest(request)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { file, filename, mimeType, fileSize } = await request.json();

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file provided" },
                { status: 400 }
            );
        }

        const base64Data = file.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const blob = new Blob([buffer], { type: mimeType });
        const fileObject = new File([blob], filename, { type: mimeType, lastModified: Date.now() });

        const imageUrl = await uploadImageToShopify(fileObject);

        return NextResponse.json({
            success: true,
            url: imageUrl
        });
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { success: false, message: "Failed to upload image" },
            { status: 500 }
        );
    }
}