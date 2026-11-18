"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GA_ID } from "@/lib/analytics";
import { gtag } from "@/lib/gtag";
import avatar from "@/assets/brand/aura-avatar.webp";
import styles from "./Chat.module.css";

// The panel's code loads the first time someone reaches for the button, so pages that never
// use the chat don't pay for it in speed
const loadPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(loadPanel, { ssr: false });

// The "Ask us" button, bottom right on every page. It's hidden while the 21+ gate is up.
export default function ChatLauncher() {
    const [open, setOpen] = useState(false);
    // Once opened, the panel stays mounted (just hidden), so closing it keeps the conversation
    const [started, setStarted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const wasOpen = useRef(false);

    useEffect(() => {
        // Back to the button when the panel closes, so keyboard users keep their place
        if (wasOpen.current && !open) buttonRef.current?.focus();
        wasOpen.current = open;
    }, [open]);

    const closeChat = useCallback(() => setOpen(false), []);

    function openChat() {
        setStarted(true);
        setOpen(true);
        if (GA_ID) gtag("event", "chat_open", { page_path: window.location.pathname });
    }

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                className={styles.launcher}
                onClick={openChat}
                onPointerEnter={() => void loadPanel()}
                onFocus={() => void loadPanel()}
                aria-expanded={open}
                aria-controls="chat-panel"
                hidden={open}
            >
                <span className={styles.launcherAvatar} aria-hidden="true">
                    <Image src={avatar} alt="" width={34} height={34} />
                </span>
                <span className={styles.launcherLabel}>Ask us</span>
            </button>
            {started && <ChatPanel open={open} onClose={closeChat} />}
        </>
    );
}
