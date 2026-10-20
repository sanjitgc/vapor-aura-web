import type { SanitizedInquiryInput } from "@/lib/inquiryValidation";
import { STORES } from "@/lib/stores";

// Where contact-form messages go. INQUIRY_NOTIFY_EMAIL (comma-separated) overrides it.
export const SHOP_INBOX = "vaporaurasmokeshop@gmail.com";

// Resend's shared test sender. It can only deliver to the address that owns the Resend
// account, which is fine for alerts to the shop inbox. Auto-replies to customers need
// vaporauratx.com verified in Resend and INQUIRY_FROM_EMAIL set to an address on it.
const TEST_SENDER = "Vapor Aura Website <onboarding@resend.dev>";

export interface EmailPayload {
    from: string;
    to: string[];
    reply_to: string;
    subject: string;
    text: string;
    html: string;
}

const STORE_LABEL: Record<SanitizedInquiryInput["store"], string> = {
    Either: "Either store",
    Sachse: "Sachse",
    Irving: "Irving",
};

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function shopRecipients() {
    const override = process.env.INQUIRY_NOTIFY_EMAIL;
    const list = (override || SHOP_INBOX)
        .split(",")
        .map((address) => address.trim())
        .filter(Boolean);
    return list.length ? list : [SHOP_INBOX];
}

function chicagoTime(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

// The alert the shop gets for every message. Hitting Reply answers the customer.
export function buildShopAlert(data: SanitizedInquiryInput, sentAt = new Date()): EmailPayload {
    const store = STORE_LABEL[data.store];
    const phone = data.phone || "Not given";
    const when = chicagoTime(sentAt);

    const text = [
        `New message from the vaporauratx.com contact form`,
        ``,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${phone}`,
        `Store: ${store}`,
        `Subject: ${data.subject}`,
        ``,
        data.message,
        ``,
        `Sent ${when} (Central). Reply to this email to answer ${data.name} directly.`,
    ].join("\n");

    const row = (label: string, value: string) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${label}</td>` +
        `<td style="padding:6px 0;color:#111827">${value}</td></tr>`;
    const telHref = data.phone.replace(/[^\d+]/g, "");

    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111827;max-width:560px">
<p style="margin:0 0 12px;font-size:17px"><strong>New message from the website</strong></p>
<table style="border-collapse:collapse;margin:0 0 16px">
${row("Name", escapeHtml(data.name))}
${row("Email", `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`)}
${row("Phone", data.phone ? `<a href="tel:${escapeHtml(telHref)}">${escapeHtml(data.phone)}</a>` : "Not given")}
${row("Store", escapeHtml(store))}
${row("Subject", escapeHtml(data.subject))}
</table>
<div style="padding:12px 14px;background:#f3f4f6;border-radius:8px;white-space:pre-wrap">${escapeHtml(data.message)}</div>
<p style="margin:16px 0 0;color:#6b7280;font-size:13px">Sent ${escapeHtml(when)} (Central). Reply to this email to answer ${escapeHtml(data.name)} directly.</p>
</div>`;

    return {
        from: process.env.INQUIRY_FROM_EMAIL || TEST_SENDER,
        to: shopRecipients(),
        reply_to: data.email,
        subject: `Website message: ${data.subject} from ${data.name} (${store})`,
        text,
        html,
    };
}

// First name only when it looks like a name, so the form can't be used to mail
// someone arbitrary text. The customer's own message is never echoed back.
function greetingName(name: string) {
    const first = name.trim().split(/\s+/)[0] ?? "";
    return /^[\p{L}][\p{L}'-]{0,29}$/u.test(first) ? first : "there";
}

// The confirmation the customer gets. Returns null until a verified sender is set up.
export function buildAutoReply(data: SanitizedInquiryInput): EmailPayload | null {
    const from = process.env.INQUIRY_FROM_EMAIL;
    if (!from) return null;

    const hi = greetingName(data.name);
    const storeLines = STORES.map(
        (store) => `${store.city}: ${store.phone}, ${store.street}, ${store.city}, TX. ${store.hoursSummary}.`,
    );

    const text = [
        `Hi ${hi},`,
        ``,
        `Thanks for contacting Vapor Aura. We got your message about "${data.subject}" and will get back to you soon.`,
        ``,
        `Need us sooner? Call or stop by:`,
        ...storeLines,
        ``,
        `Vapor Aura`,
        `vaporauratx.com`,
        `Sales to adults 21 and over only.`,
    ].join("\n");

    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#111827;max-width:560px">
<p style="margin:0 0 12px">Hi ${escapeHtml(hi)},</p>
<p style="margin:0 0 12px">Thanks for contacting Vapor Aura. We got your message about <strong>${escapeHtml(data.subject)}</strong> and will get back to you soon.</p>
<p style="margin:0 0 6px">Need us sooner? Call or stop by:</p>
<ul style="margin:0 0 16px;padding-left:18px">
${STORES.map(
    (store) =>
        `<li style="margin:0 0 6px"><strong>${escapeHtml(store.city)}</strong>: <a href="${escapeHtml(store.tel)}">${escapeHtml(store.phone)}</a>, ${escapeHtml(store.street)}, ${escapeHtml(store.city)}, TX. ${escapeHtml(store.hoursSummary)}.</li>`,
).join("\n")}
</ul>
<p style="margin:0;color:#6b7280;font-size:13px">Vapor Aura &middot; <a href="https://vaporauratx.com">vaporauratx.com</a><br>Sales to adults 21 and over only.</p>
</div>`;

    return {
        from,
        to: [data.email],
        reply_to: SHOP_INBOX,
        subject: "We got your message | Vapor Aura",
        text,
        html,
    };
}

// Sends through Resend's API. Never throws: a failed email shouldn't break the form.
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return false;

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) {
            console.error("Resend rejected an email:", response.status, await response.text());
            return false;
        }
        return true;
    } catch (error) {
        console.error("Sending email failed:", error);
        return false;
    }
}
