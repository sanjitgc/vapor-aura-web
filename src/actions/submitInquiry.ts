"use server";

import connectToDatabase from "@/lib/db";
import Inquiry from "@/models/Inquiry";

export async function submitInquiry(formData: FormData) {
    try {
        const name = formData.get("name");
        const email = formData.get("email");
        const subject = formData.get("subject");
        const message = formData.get("message");

        if (!name || !email || !subject || !message) {
            return { success: false, message: "All fields are required" };
        }

        await connectToDatabase();

        await Inquiry.create({
            name,
            email,
            subject,
            message,
        });

        return { success: true, message: "Inquiry received. We will get back to you soon." };
    } catch (error) {
        console.error("Submission error:", error);
        return { success: false, message: "Something went wrong. Please try again." };
    }
}
