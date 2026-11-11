"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./AgeVerification.module.css";
import Button from "@/components/ui/Button";

// The 21+ gate. It is part of the page's HTML from the server and is shown or hidden by CSS,
// keyed on <html data-age-gate="open">. A small script in the page head (see layout.tsx) sets
// that before the first paint and handles the two buttons, so the gate appears at once and
// works even before the rest of the page's JavaScript has loaded.
export default function AgeVerification() {
    const pathname = usePathname();
    const cardRef = useRef<HTMLDivElement>(null);
    // The policy pages linked from the gate stay readable without passing it.
    const isPolicyPage = pathname === "/privacy" || pathname === "/terms";

    // Keeps the gate right when moving between pages without a full reload, and moves keyboard
    // focus into it (on the card itself, so Tab goes straight to the two choices).
    useEffect(() => {
        let verified = false;
        try {
            verified = Boolean(localStorage.getItem("vapor-aura-age-verified"));
        } catch {
            // Storage blocked: show the gate every visit.
        }
        if (!verified && !isPolicyPage) {
            document.documentElement.setAttribute("data-age-gate", "open");
            cardRef.current?.focus({ preventScroll: true });
        } else {
            document.documentElement.removeAttribute("data-age-gate");
        }
    }, [isPolicyPage]);

    if (isPolicyPage) return null;

    return (
        // data-nosnippet: search engines never quote the gate as if it were the page
        <div className={styles.overlay} data-nosnippet>
            <div
                ref={cardRef}
                tabIndex={-1}
                className={styles.card}
                role="dialog"
                aria-modal="true"
                aria-labelledby="age-verification-title"
                aria-describedby="age-verification-text"
            >
                <Image
                    src="/vapor-aura-logo-new.png"
                    alt="Vapor Aura"
                    width={240}
                    height={72}
                    className={styles.logo}
                    priority
                />
                <h2 id="age-verification-title" className={styles.title}>
                    Are you 21 or older?
                </h2>
                <p id="age-verification-text" className={styles.message}>
                    You must be 21 or older to enter this site. We check a valid photo ID on every purchase.
                </p>

                {/* The clicks are handled by the script in the page head (data-age-answer) */}
                <div className={styles.actions}>
                    <Button data-age-answer="yes" variant="primary" size="lg">
                        Yes, I&apos;m 21 or older
                    </Button>
                    <Button data-age-answer="no" variant="outline" size="lg">
                        No, I&apos;m under 21
                    </Button>
                </div>

                <p className={styles.disclaimer}>
                    By entering, you agree to our <a href="/terms">terms of use</a> and{" "}
                    <a href="/privacy">privacy policy</a>.
                </p>
            </div>
        </div>
    );
}
