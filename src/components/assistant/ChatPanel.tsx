"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowUp, FaPhone, FaXmark } from "react-icons/fa6";
import { ASSISTANT_LIMITS, chatTokens, type ChatMessage } from "@/lib/chat";
import { siteRoutes } from "@/lib/routes";
import { STORES } from "@/lib/stores";
import { GA_ID } from "@/lib/analytics";
import { gtag } from "@/lib/gtag";
import styles from "./Chat.module.css";

const SUGGESTIONS = [
    "Are you open right now?",
    "Which store is closest to Coppell?",
    "Do you carry Geek Bar Pulse X?",
    "Do you sell hookah coals?",
];
const CALL_US = STORES.map((store) => `${store.city} at ${store.phone}`).join(" or ");
const UNAVAILABLE = `Sorry, I can't answer right now. Please call ${CALL_US}.`;
// Links in replies only go to pages the site really has
const SITE_PATHS: ReadonlySet<string> = new Set(siteRoutes().map((route) => route.path));

function Reply({ text }: { text: string }) {
    const tokens = useMemo(() => chatTokens(text, SITE_PATHS), [text]);
    return (
        <>
            {tokens.map((token, i) => {
                if (token.kind === "page" && token.href) {
                    return (
                        <Link key={i} href={token.href}>
                            {token.text}
                        </Link>
                    );
                }
                if ((token.kind === "phone" || token.kind === "link") && token.href) {
                    const external = token.kind === "link";
                    return (
                        <a
                            key={i}
                            href={token.href}
                            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                            {token.text}
                        </a>
                    );
                }
                return <Fragment key={i}>{token.text}</Fragment>;
            })}
        </>
    );
}

// The chat itself. Questions go to /api/chat; replies stream in as they're written.
// Nothing is saved: the conversation lives in this panel until the page is closed.
export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");
    const [busy, setBusy] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const logRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<AbortController | null>(null);

    // One more question would go past the limit the server accepts
    const full = messages.length + 1 > ASSISTANT_LIMITS.maxMessages;

    useEffect(() => {
        if (!open) return;
        inputRef.current?.focus();
        // Esc closes the chat wherever focus is (a tapped suggestion disappears, taking focus with
        // it), unless a full-screen photo viewer is open on top; that one closes first
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !document.querySelector("dialog[open]")) onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    useEffect(() => {
        const log = logRef.current;
        if (log) log.scrollTop = log.scrollHeight;
    }, [messages]);

    // Stop a reply that's still arriving if the panel goes away
    useEffect(() => () => requestRef.current?.abort(), []);

    async function ask(question: string) {
        const text = question.trim();
        if (!text || busy || full) return;
        const history: ChatMessage[] = [...messages, { role: "user", content: text }];
        const show = (reply: string) => setMessages([...history, { role: "assistant", content: reply }]);
        show("");
        setDraft("");
        setBusy(true);
        inputRef.current?.focus();
        if (GA_ID) gtag("event", "chat_question", { page_path: window.location.pathname });

        const request = new AbortController();
        requestRef.current = request;
        let reply = "";
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: history.map((m) => ({
                        role: m.role,
                        content: m.content.slice(0, ASSISTANT_LIMITS.maxReplyChars),
                    })),
                }),
                signal: request.signal,
            });
            if (!response.ok || !response.body) {
                const data = (await response.json().catch(() => null)) as { error?: string } | null;
                reply = data?.error ?? UNAVAILABLE;
            } else {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                for (;;) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    reply += decoder.decode(value, { stream: true });
                    show(reply);
                }
                reply += decoder.decode();
            }
        } catch {
            if (request.signal.aborted) return;
        } finally {
            setBusy(false);
        }
        show(reply.trim() || UNAVAILABLE);
    }

    function startOver() {
        requestRef.current?.abort();
        setBusy(false);
        setMessages([]);
        setDraft("");
        inputRef.current?.focus();
    }

    return (
        <div
            id="chat-panel"
            className={styles.panel}
            role="dialog"
            aria-labelledby="chat-title"
            aria-describedby="chat-about"
            hidden={!open}
        >
            <div className={styles.head}>
                <div>
                    <h2 id="chat-title" className={styles.title}>
                        Ask Vapor Aura
                    </h2>
                    <p id="chat-about" className={styles.sub}>
                        AI assistant. Answers come from our store info.
                    </p>
                </div>
                <div className={styles.headActions}>
                    {messages.length > 0 && (
                        <button type="button" className={styles.textButton} onClick={startOver}>
                            Start over
                        </button>
                    )}
                    <button type="button" className={styles.close} onClick={onClose} aria-label="Close chat">
                        <FaXmark aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div ref={logRef} className={styles.log} role="log" aria-live="polite" aria-busy={busy}>
                <p className={`${styles.bubble} ${styles.bot}`}>
                    Hi! I&apos;m Vapor Aura&apos;s AI assistant. Ask me about our hours, how to find us or what
                    we carry. For a specific flavor or price, it&apos;s best to call the store.
                </p>
                {messages.length === 0 && (
                    <div className={styles.suggestions}>
                        {SUGGESTIONS.map((suggestion) => (
                            <button key={suggestion} type="button" onClick={() => void ask(suggestion)}>
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
                {messages.map((message, i) =>
                    message.role === "user" ? (
                        <p key={i} className={`${styles.bubble} ${styles.me}`}>
                            {message.content}
                        </p>
                    ) : (
                        <p key={i} className={`${styles.bubble} ${styles.bot}`}>
                            {message.content ? (
                                <Reply text={message.content} />
                            ) : (
                                <span className={styles.typing} role="img" aria-label="Writing a reply">
                                    <i />
                                    <i />
                                    <i />
                                </span>
                            )}
                        </p>
                    ),
                )}
                {full && !busy && (
                    <p className={styles.note}>
                        That&apos;s as far as this chat goes. For more help, call {CALL_US}, or tap Start over.
                    </p>
                )}
            </div>

            <form
                className={styles.form}
                onSubmit={(event) => {
                    event.preventDefault();
                    void ask(draft);
                }}
            >
                <label htmlFor="chat-input" className="visually-hidden">
                    Your question
                </label>
                <input
                    id="chat-input"
                    ref={inputRef}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    maxLength={ASSISTANT_LIMITS.maxQuestionChars}
                    placeholder={full ? "Tap Start over to ask more" : "Ask a question"}
                    disabled={full}
                    autoComplete="off"
                    enterKeyHint="send"
                />
                <button type="submit" className={styles.send} disabled={busy || full || !draft.trim()} aria-label="Send">
                    <FaArrowUp aria-hidden="true" />
                </button>
            </form>

            <div className={styles.foot}>
                <div className={styles.calls}>
                    {STORES.map((store) => (
                        <a key={store.slug} href={store.tel} className={styles.call} data-store={store.slug}>
                            <FaPhone aria-hidden="true" /> Call {store.city}
                        </a>
                    ))}
                </div>
                <p className={styles.fine}>
                    AI can make mistakes. Don&apos;t share personal details:{" "}
                    <Link href="/privacy">Google may review chats</Link>. 21+ only.
                </p>
            </div>
        </div>
    );
}
