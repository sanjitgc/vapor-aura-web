"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaArrowRight, FaArrowUp, FaClock, FaCloud, FaFire, FaLocationDot, FaPhone, FaXmark } from "react-icons/fa6";
import LiveStatus from "@/components/common/LiveStatus";
import avatar from "@/assets/brand/aura-avatar.webp";
import { ASSISTANT_LIMITS, chatTokens, type ChatMessage } from "@/lib/chat";
import { siteRoutes } from "@/lib/routes";
import { STORES } from "@/lib/stores";
import { GA_ID } from "@/lib/analytics";
import { gtag } from "@/lib/gtag";
import styles from "./Chat.module.css";

const SUGGESTIONS: { text: string; Icon: IconType }[] = [
    { text: "Are you open right now?", Icon: FaClock },
    { text: "Which store is closest to Coppell?", Icon: FaLocationDot },
    { text: "Do you carry Geek Bar Pulse X?", Icon: FaCloud },
    { text: "Do you sell hookah coals?", Icon: FaFire },
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

// A reply from the assistant
function BotMessage({ children }: { children: ReactNode }) {
    return <p className={`${styles.bubble} ${styles.bot}`}>{children}</p>;
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

    // Follow the conversation as it grows (but start at the top, with the greeting in view)
    useEffect(() => {
        const log = logRef.current;
        if (log && messages.length > 0) log.scrollTop = log.scrollHeight;
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
                <div className={styles.identity}>
                    <span className={styles.avatar} aria-hidden="true">
                        <Image src={avatar} alt="" width={34} height={34} />
                    </span>
                    <div className={styles.identityText}>
                        <h2 id="chat-title" className={styles.title}>
                            Ask Vapor Aura
                        </h2>
                        <p id="chat-about" className={styles.sub}>
                            AI assistant for both stores
                        </p>
                    </div>
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
                <ul className={styles.status} aria-label="Open right now">
                    {STORES.map((store) => (
                        <li key={store.slug} className={styles.statusItem}>
                            <span className={styles.statusCity}>{store.city}</span>
                            <LiveStatus slug={store.slug} className={styles.statusPill} />
                        </li>
                    ))}
                </ul>
            </div>

            <div ref={logRef} className={styles.log} role="log" aria-live="polite" aria-busy={busy}>
                <BotMessage>
                    Hi! Ask me about our hours, how to find us or what we carry. For a specific flavor or
                    price, it&apos;s best to call the store.
                </BotMessage>
                {messages.length === 0 && (
                    <div className={styles.suggestions}>
                        <p className={styles.suggestionsTitle}>Try asking</p>
                        <ul>
                            {SUGGESTIONS.map(({ text, Icon }) => (
                                <li key={text}>
                                    <button type="button" className={styles.suggestion} onClick={() => void ask(text)}>
                                        <span className={styles.suggestionIcon} aria-hidden="true">
                                            <Icon />
                                        </span>
                                        <span className={styles.suggestionText}>{text}</span>
                                        <FaArrowRight className={styles.suggestionArrow} aria-hidden="true" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {messages.map((message, i) =>
                    message.role === "user" ? (
                        <p key={i} className={`${styles.bubble} ${styles.me}`}>
                            {message.content}
                        </p>
                    ) : (
                        <BotMessage key={i}>
                            {message.content ? (
                                <>
                                    <Reply text={message.content} />
                                    {busy && i === messages.length - 1 && (
                                        <span className={styles.caret} aria-hidden="true" />
                                    )}
                                </>
                            ) : (
                                <span className={styles.typing} role="img" aria-label="Writing a reply">
                                    <i />
                                    <i />
                                    <i />
                                </span>
                            )}
                        </BotMessage>
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
                <div className={styles.composer}>
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
                    <button
                        type="submit"
                        className={styles.send}
                        disabled={busy || full || !draft.trim()}
                        aria-label="Send"
                    >
                        <FaArrowUp aria-hidden="true" />
                    </button>
                </div>
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
