export const INQUIRY_SUBJECTS = [
    "General Inquiry",
    "Store Experience",
    "Product Request",
    "Wholesale",
    "Careers",
] as const;

export const INQUIRY_STORES = ["Either", "Sachse", "Irving"] as const;
export type InquiryStore = (typeof INQUIRY_STORES)[number];

// Hidden field real visitors never see; bots that fill every input fill this one too.
export const HONEYPOT_FIELD = "website";

export interface SanitizedInquiryInput {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone: string;
    store: InquiryStore;
}

const LIMITS = {
    name: 100,
    email: 255,
    subject: 120,
    message: 5000,
    phone: 25,
};

type ValidationResult =
    | { ok: true; data: SanitizedInquiryInput; spam: boolean }
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
    const rawPhone = formData.get("phone");
    const safePhone = typeof rawPhone === "string" ? rawPhone.trim() : "";

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
        safeMessage.length > LIMITS.message ||
        safePhone.length > LIMITS.phone
    ) {
        return { ok: false, message: "One or more fields are too long" };
    }

    // Only the form's own choices are accepted, so nothing odd ends up in email subjects.
    const knownSubject = (INQUIRY_SUBJECTS as readonly string[]).find(
        (option) => option.toLowerCase() === safeSubject.toLowerCase(),
    );
    const rawStore = formData.get("store");
    const store =
        INQUIRY_STORES.find((option) => typeof rawStore === "string" && option.toLowerCase() === rawStore.trim().toLowerCase()) ??
        "Either";
    const trap = formData.get(HONEYPOT_FIELD);

    return {
        ok: true,
        data: {
            name: safeName,
            email: safeEmail,
            subject: knownSubject ?? "General Inquiry",
            message: safeMessage,
            phone: safePhone,
            store,
        },
        spam: typeof trap === "string" && trap.trim() !== "",
    };
}
