export const INQUIRY_SUBJECTS = [
    "General Inquiry",
    "Store Experience",
    "Product Request",
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

// ---------- Email and phone checks, shared by the form (as you type) and the server ----------

const EMAIL_PATTERN =
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

// Common misspellings of big email providers, so a typo doesn't send our reply nowhere
const DOMAIN_TYPOS: Record<string, string> = {
    "gmial.com": "gmail.com",
    "gmai.com": "gmail.com",
    "gamil.com": "gmail.com",
    "gmal.com": "gmail.com",
    "gnail.com": "gmail.com",
    "gmail.co": "gmail.com",
    "gmail.con": "gmail.com",
    "gmail.cm": "gmail.com",
    "yahooo.com": "yahoo.com",
    "yaho.com": "yahoo.com",
    "yahoo.con": "yahoo.com",
    "hotmial.com": "hotmail.com",
    "hotmal.com": "hotmail.com",
    "hotmail.con": "hotmail.com",
    "outlok.com": "outlook.com",
    "outlook.con": "outlook.com",
    "iclod.com": "icloud.com",
    "icloud.con": "icloud.com",
};

/** Returns a message saying what's wrong with the email, or null if it looks right. */
export function emailProblem(raw: string): string | null {
    const email = raw.trim().toLowerCase();
    if (!email) return "Enter your email address.";
    const [local = "", domain = ""] = email.split("@");
    const valid =
        email.length <= 254 &&
        EMAIL_PATTERN.test(email) &&
        local.length <= 64 &&
        !local.startsWith(".") &&
        !local.endsWith(".") &&
        !local.includes("..");
    if (!valid) return "Enter a valid email address, like name@example.com.";
    const fix = DOMAIN_TYPOS[domain];
    if (fix) return `Check your email. Did you mean ${local}@${fix}?`;
    return null;
}

/**
 * Checks a US phone number (optional field). Returns the number formatted as (214) 501-3222,
 * an empty string when left blank, or null when it isn't a real-looking US number.
 */
export function normalizePhone(raw: string): string | null {
    const value = raw.trim();
    if (!value) return "";
    if (!/^[\d\s().+-]+$/.test(value)) return null;
    let digits = value.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
    if (digits.length !== 10) return null;
    // US area codes and exchanges never start with 0 or 1
    if (!/[2-9]/.test(digits[0]) || !/[2-9]/.test(digits[3])) return null;
    if (/^(\d)\1{9}$/.test(digits)) return null;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export const PHONE_PROBLEM = "Enter a 10-digit US phone number, like (214) 501-3222.";

export type InquiryField = "email" | "phone";

type ValidationResult =
    | { ok: true; data: SanitizedInquiryInput; spam: boolean }
    | { ok: false; message: string; field?: InquiryField };

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

    const badEmail = emailProblem(safeEmail);
    if (badEmail) {
        return { ok: false, message: badEmail, field: "email" };
    }

    const formattedPhone = normalizePhone(safePhone);
    if (formattedPhone === null) {
        return { ok: false, message: PHONE_PROBLEM, field: "phone" };
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
            phone: formattedPhone,
            store,
        },
        spam: typeof trap === "string" && trap.trim() !== "",
    };
}
