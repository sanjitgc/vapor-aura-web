import { createHash } from "node:crypto";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { ASSISTANT_MODEL, assistantFacts, assistantNow } from "@/lib/assistant";
import { ASSISTANT_LIMITS, checkChat } from "@/lib/chat";
import { checkChatRateLimit } from "@/lib/rateLimit";
import { STORES } from "@/lib/stores";

// The website's chat assistant, answered by Google's Gemini from the store facts in
// src/lib/assistant.ts. It's switched on by setting GEMINI_API_KEY for the deployment (without
// it, the chat button doesn't show and this route says the chat is unavailable).
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
    const apiKey = process.env.GEMINI_API_KEY;
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

    const ai = new GoogleGenAI({ apiKey });
    const stop = new AbortController();
    const encoder = new TextEncoder();
    const reply = new ReadableStream<Uint8Array>({
        async start(controller) {
            let sent = false;
            try {
                const stream = await ai.models.generateContentStream({
                    model: ASSISTANT_MODEL,
                    contents: chat.messages.map((message) => ({
                        role: message.role === "user" ? "user" : "model",
                        parts: [{ text: message.content }],
                    })),
                    config: {
                        systemInstruction: `${FACTS}\n\n${assistantNow()}`,
                        maxOutputTokens: ASSISTANT_LIMITS.replyTokens,
                        // Short factual answers: keep it steady, and skip long thinking
                        temperature: 0.3,
                        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
                        abortSignal: stop.signal,
                    },
                });
                for await (const chunk of stream) {
                    const text = chunk.text;
                    if (text) {
                        controller.enqueue(encoder.encode(text));
                        sent = true;
                    }
                }
                // Nothing came back (for example, Google's own safety filter held the reply)
                if (!sent) controller.enqueue(encoder.encode(UNAVAILABLE));
            } catch (error) {
                if (stop.signal.aborted) return;
                // Log the kind of failure only, never what the visitor wrote. 429 means the free
                // tier's daily allowance is used up.
                const status = (error as { status?: number } | null)?.status;
                console.error("Chat assistant request failed", status ?? (error as Error | null)?.name ?? "unknown");
                controller.enqueue(encoder.encode(sent ? `\n\n${UNAVAILABLE}` : UNAVAILABLE));
            }
            controller.close();
        },
        cancel() {
            stop.abort();
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
