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
            phone: validation.data.phone,
        });

        await notifyByEmail(validation.data);

        return { success: true, message: "Inquiry received. We will get back to you soon." };
    } catch (error) {
        console.error("Submission error:", error);
        return { success: false, message: "Something went wrong. Please try again." };
    }
}

// Emails each new inquiry to the shop so messages don't sit unread in the database.
// Needs RESEND_API_KEY and INQUIRY_NOTIFY_EMAIL in the Vercel environment; skipped otherwise.
async function notifyByEmail(data: { name: string; email: string; phone: string; subject: string; message: string }) {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.INQUIRY_NOTIFY_EMAIL;
    if (!apiKey || !to) return;
    try {
        await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from: process.env.INQUIRY_FROM_EMAIL || "Vapor Aura Website <onboarding@resend.dev>",
                to: to.split(",").map((addr) => addr.trim()),
                reply_to: data.email,
                subject: `Website inquiry: ${data.subject} from ${data.name}`,
                text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "(not given)"}\nSubject: ${data.subject}\n\n${data.message}`,
            }),
        });
    } catch (error) {
        console.error("Inquiry email notification failed:", error);
    }
}
