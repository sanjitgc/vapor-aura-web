"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./AgeVerification.module.css";
import Button from "@/components/ui/Button";

export default function AgeVerification() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if user has already verified
        let hasVerified: string | null = "true";
        try {
            hasVerified = localStorage.getItem("vapor-aura-age-verified");
        } catch {
            // Storage blocked: show the gate every visit.
            hasVerified = null;
        }
        if (!hasVerified) {
            document.documentElement.setAttribute("data-age-gate", "open");
            // Small delay to ensure client-side rendering matches
            // and to avoid immediate state update warning if strictly interpreted
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            document.documentElement.removeAttribute("data-age-gate");
        }
    }, []);

    const isPolicyPage = pathname === "/privacy" || pathname === "/terms";
    const isOpen = isVisible && !isPolicyPage;

    // While the gate is up: keep the page behind it still and move keyboard focus into it
    // (on the card itself, so Tab goes straight to the two choices).
    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        cardRef.current?.focus({ preventScroll: true });
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    const handleVerify = () => {
        try {
            localStorage.setItem("vapor-aura-age-verified", "true");
        } catch {
            // Storage blocked: the visitor simply sees the gate again next time.
        }
        // Lets the hero's entrance animation play now that the page is visible.
        document.documentElement.removeAttribute("data-age-gate");
        setIsVisible(false);
    };

    const handleDeny = () => {
        window.location.href = "https://www.google.com";
    };

    // The policy pages linked from the gate stay readable without passing it.
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
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
                    width={280}
                    height={84}
                    className={styles.logo}
                    priority
                />
                <h2 id="age-verification-title" className={styles.title}>
                    Are you 21 or older?
                </h2>
                <p id="age-verification-text" className={styles.message}>
                    You must be 21 or older to enter this site. We check a valid photo ID on every purchase.
                </p>

                <div className={styles.actions}>
                    <Button onClick={handleVerify} variant="primary" size="lg">
                        Yes, I&apos;m 21 or older
                    </Button>
                    <Button onClick={handleDeny} variant="outline" size="lg">
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
