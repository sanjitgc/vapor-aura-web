"use server";

import connectToDatabase from "@/lib/db";
import { validateInquiryFormData } from "@/lib/inquiryValidation";
import { checkInquiryRateLimit } from "@/lib/rateLimit";
import Inquiry from "@/models/Inquiry";

export async function submitInquiry(formData: FormData) {
    try {
        const validation = validateInquiryFormData(formData);
        if (!validation.ok) {
            return { success: false, message: validation.message };
        }

        const rateLimitResult = await checkInquiryRateLimit(validation.data.email);
        if (!rateLimitResult.allowed) {
            return {
                success: false,
                message: "Too many requests. Please wait a few minutes before trying again.",
            };
        }

        const connection = await connectToDatabase();
        if (!connection) {
            return { success: false, message: "Service is temporarily unavailable. Please try again later." };
        }

        await Inquiry.create({
            name: validation.data.name,
            email: validation.data.email,
            subject: validation.data.subject,
            message: validation.data.message,
        });

        return { success: true, message: "Inquiry received. We will get back to you soon." };
    } catch (error) {
        console.error("Submission error:", error);
        return { success: false, message: "Something went wrong. Please try again." };
    }
}
