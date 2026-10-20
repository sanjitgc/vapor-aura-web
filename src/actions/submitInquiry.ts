"use server";

import connectToDatabase from "@/lib/db";
import { buildAutoReply, buildShopAlert, sendEmail } from "@/lib/inquiryEmails";
import { validateInquiryFormData } from "@/lib/inquiryValidation";
import { checkAutoReplyRateLimit, checkInquiryRateLimit } from "@/lib/rateLimit";
import Inquiry from "@/models/Inquiry";

const SENT = "Message sent. We'll get back to you soon.";

export async function submitInquiry(formData: FormData) {
    try {
        const validation = validateInquiryFormData(formData);
        if (!validation.ok) {
            return { success: false, message: validation.message };
        }

        // Bots that fill the hidden field get a normal-looking reply and nothing is stored or sent.
        if (validation.spam) {
            return { success: true, message: SENT };
        }

        const data = validation.data;

        const rateLimitResult = await checkInquiryRateLimit(data.email);
        if (!rateLimitResult.allowed) {
            return {
                success: false,
                message: "Too many requests. Please wait a few minutes before trying again.",
            };
        }

        // Save a copy in the database (when it's reachable) and email the shop.
        // Either one is enough for the message not to get lost.
        let saved = false;
        const connection = await connectToDatabase();
        if (connection) {
            try {
                await Inquiry.create(data);
                saved = true;
            } catch (error) {
                console.error("Saving inquiry failed:", error);
            }
        }

        const autoReply = buildAutoReply(data);
        const replyAllowed = autoReply ? await checkAutoReplyRateLimit(data.email) : false;
        const [alerted] = await Promise.all([
            sendEmail(buildShopAlert(data)),
            autoReply && replyAllowed ? sendEmail(autoReply) : Promise.resolve(false),
        ]);

        if (!saved && !alerted) {
            return {
                success: false,
                message: "We couldn't send your message right now. Please call the store or try again later.",
            };
        }

        return { success: true, message: SENT };
    } catch (error) {
        console.error("Submission error:", error);
        return { success: false, message: "Something went wrong. Please try again." };
    }
}
