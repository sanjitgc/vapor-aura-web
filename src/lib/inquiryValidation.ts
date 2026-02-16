export interface SanitizedInquiryInput {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const LIMITS = {
    name: 100,
    email: 255,
    subject: 120,
    message: 5000,
};

type ValidationResult =
    | { ok: true; data: SanitizedInquiryInput }
    | { ok: false; message: string };

export function validateInquiryFormData(formData: FormData): ValidationResult {
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof subject !== "string" ||
        typeof message !== "string"
    ) {
        return { ok: false, message: "All fields are required" };
    }

    const safeName = name.trim();
    const safeEmail = email.trim().toLowerCase();
    const safeSubject = subject.trim();
    const safeMessage = message.trim();

    if (!safeName || !safeEmail || !safeSubject || !safeMessage) {
        return { ok: false, message: "All fields are required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(safeEmail)) {
        return { ok: false, message: "Please provide a valid email address" };
    }

    if (
        safeName.length > LIMITS.name ||
        safeEmail.length > LIMITS.email ||
        safeSubject.length > LIMITS.subject ||
        safeMessage.length > LIMITS.message
    ) {
        return { ok: false, message: "One or more fields are too long" };
    }

    return {
        ok: true,
        data: {
            name: safeName,
            email: safeEmail,
            subject: safeSubject,
            message: safeMessage,
        },
    };
}
