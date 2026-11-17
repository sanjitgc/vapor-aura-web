import { createHash } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { ASSISTANT_MODEL, assistantFacts, assistantNow } from "@/lib/assistant";
import { ASSISTANT_LIMITS, checkChat } from "@/lib/chat";
import { checkChatRateLimit } from "@/lib/rateLimit";
import { STORES } from "@/lib/stores";

// The website's chat assistant. It answers from the store facts in src/lib/assistant.ts and is
// switched on by setting ANTHROPIC_API_KEY for the deployment (without it, the chat button
// doesn't show and this route says the chat is unavailable).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const CALL_US = STORES.map((store) => `${store.city} at ${store.phone}`).join(" or ");
const UNAVAILABLE = `Sorry, I can't answer right now. Please call ${CALL_US}.`;
const FACTS = assistantFacts();

function failure(status: number, error: string) {
    return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

function sameSite(request: Request): boolean {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (!origin || !host) return false;
    try {
        return new URL(origin).host === host;
    } catch {
        return false;
    }
}

export async function POST(request: Request) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return failure(503, UNAVAILABLE);

    // Only the site's own pages may use the assistant
    if (!sameSite(request)) return failure(403, "Not allowed.");

    // Limit questions per visitor, keyed on a one-way hash of their IP address
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const visitor = createHash("sha256").update(`vapor-aura-chat:${ip}`).digest("hex").slice(0, 32);
    if (!(await checkChatRateLimit(visitor))) {
        return failure(429, `That's a lot of questions in a short time. Please call ${CALL_US}.`);
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return failure(400, "Something went wrong with this chat. Tap Start over and try again.");
    }
    const chat = checkChat(body);
    if (!chat.ok) return failure(400, chat.error);

    const client = new Anthropic({ apiKey });
    const stream = client.messages.stream({
        model: ASSISTANT_MODEL,
        max_tokens: ASSISTANT_LIMITS.replyTokens,
        system: [
            // Rules and store facts don't change between requests, so they're cached
            { type: "text", text: FACTS, cache_control: { type: "ephemeral" } },
            { type: "text", text: assistantNow() },
        ],
        messages: chat.messages,
    });

    const encoder = new TextEncoder();
    const reply = new ReadableStream<Uint8Array>({
        async start(controller) {
            let sent = false;
            try {
                for await (const event of stream) {
                    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
                        controller.enqueue(encoder.encode(event.delta.text));
                        sent = true;
                    }
                }
            } catch (error) {
                // Log the kind of failure only, never what the visitor wrote
                const status = (error as { status?: number } | null)?.status;
                console.error("Chat assistant request failed", status ?? (error as Error | null)?.name ?? "unknown");
                controller.enqueue(encoder.encode(sent ? `\n\n${UNAVAILABLE}` : UNAVAILABLE));
            }
            controller.close();
        },
        cancel() {
            stream.abort();
        },
    });

    return new Response(reply, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
        },
    });
}
