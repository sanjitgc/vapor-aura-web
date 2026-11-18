// Shared by the chat assistant's browser code and its server route: limits, the request check
// and how replies are turned into links. Pure functions, so they can be tested.

export const ASSISTANT_LIMITS = {
    // Messages in one chat, both sides counted. After that the chat points to the phone.
    maxMessages: 16,
    // Characters in one question
    maxQuestionChars: 500,
    // Characters in an earlier reply sent back for context
    maxReplyChars: 2000,
    // Upper bound on the length of a reply (a token is roughly four characters)
    replyTokens: 400,
};

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export type ChatCheck = { ok: true; messages: ChatMessage[] } | { ok: false; error: string };

const OUT_OF_ORDER = "Something went wrong with this chat. Tap Start over and try again.";

// Checks a chat sent to /api/chat: questions and replies take turns, starting and ending with a
// question, within the limits above. Returns the messages with spaces trimmed.
export function checkChat(body: unknown): ChatCheck {
    const messages = typeof body === "object" && body !== null ? (body as { messages?: unknown }).messages : undefined;
    if (!Array.isArray(messages) || messages.length === 0) return { ok: false, error: "Type a question first." };
    if (messages.length > ASSISTANT_LIMITS.maxMessages) {
        return { ok: false, error: "This chat is full. Tap Start over to ask more." };
    }
    // Odd count: it starts and ends with a question
    if (messages.length % 2 === 0) return { ok: false, error: OUT_OF_ORDER };

    const clean: ChatMessage[] = [];
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i] as Partial<ChatMessage> | null;
        const role = i % 2 === 0 ? "user" : "assistant";
        if (!message || message.role !== role || typeof message.content !== "string") return { ok: false, error: OUT_OF_ORDER };
        const content = message.content.trim();
        if (!content) return { ok: false, error: role === "user" ? "Type a question first." : OUT_OF_ORDER };
        if (role === "user" && content.length > ASSISTANT_LIMITS.maxQuestionChars) {
            return { ok: false, error: `Keep questions under ${ASSISTANT_LIMITS.maxQuestionChars} characters.` };
        }
        if (role === "assistant" && content.length > ASSISTANT_LIMITS.maxReplyChars) return { ok: false, error: OUT_OF_ORDER };
        clean.push({ role, content });
    }
    return { ok: true, messages: clean };
}

export interface ChatToken {
    kind: "text" | "page" | "phone" | "link";
    text: string;
    href?: string;
}

// Web addresses in a reply become links only on these sites; anything else stays plain text
const LINK_HOSTS = ["vaporauratx.com", "doordash.com", "instagram.com", "facebook.com", "google.com"];

function trustedUrl(raw: string): string | null {
    try {
        const url = new URL(raw);
        if (url.protocol !== "https:") return null;
        const host = url.hostname.toLowerCase();
        return LINK_HOSTS.some((h) => host === h || host.endsWith(`.${h}`)) ? url.toString() : null;
    } catch {
        return null;
    }
}

// Tried left to right: [label](target), a web address, a phone number like (214) 272-8395,
// and a site path like /irving after a space or bracket. (No lookbehind: older iPhones lack it.)
const PATTERN =
    /\[([^\]\n]{1,80})\]\(([^)\s]{1,200})\)|(https:\/\/[^\s<>()]+)|(\(\d{3}\) \d{3}-\d{4})|(^|[\s(])(\/[a-z0-9-]+(?:\/[a-z0-9-]+)*)/gi;

// Splits a reply into plain text and links. Site paths become links only if the site has that
// page; web addresses only on the trusted sites above.
export function chatTokens(text: string, sitePaths: ReadonlySet<string>): ChatToken[] {
    const tokens: ChatToken[] = [];
    const plain = (value: string) => {
        if (!value) return;
        const last = tokens[tokens.length - 1];
        if (last?.kind === "text") last.text += value;
        else tokens.push({ kind: "text", text: value });
    };
    // The assistant is asked for plain text; drop bold markers if it adds them anyway
    const source = text.replace(/\*\*(.+?)\*\*/g, "$1");

    let at = 0;
    for (const match of source.matchAll(PATTERN)) {
        const index = match.index ?? 0;
        plain(source.slice(at, index));
        at = index + match[0].length;
        const [whole, label, target, url, phone, before, path] = match;

        if (label !== undefined && target !== undefined) {
            const href = target.startsWith("/") ? (sitePaths.has(target) ? target : null) : trustedUrl(target);
            if (href) tokens.push({ kind: href.startsWith("/") ? "page" : "link", text: label, href });
            else plain(label);
        } else if (url !== undefined) {
            // A sentence's closing punctuation isn't part of the address
            const trimmed = url.replace(/[.,;:!?]+$/, "");
            const href = trustedUrl(trimmed);
            if (href) tokens.push({ kind: "link", text: trimmed, href });
            else plain(trimmed);
            plain(url.slice(trimmed.length));
        } else if (phone !== undefined) {
            tokens.push({ kind: "phone", text: phone, href: `tel:+1${phone.replace(/\D/g, "")}` });
        } else if (path !== undefined) {
            plain(before ?? "");
            if (sitePaths.has(path)) tokens.push({ kind: "page", text: path, href: path });
            else plain(path);
        } else {
            plain(whole);
        }
    }
    plain(source.slice(at));
    return tokens;
}
