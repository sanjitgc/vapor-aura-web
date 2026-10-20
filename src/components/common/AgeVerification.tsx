"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./AgeVerification.module.css";
import Button from "@/components/ui/Button";

export default function AgeVerification() {
    const [isVisible, setIsVisible] = useState(false);

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

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="age-verification-title">
                <Image
                    src="/vapor-aura-logo-new.png"
                    alt="Vapor Aura"
                    width={280}
                    height={84}
                    className={styles.logo}
                    priority
                />
                <h2 id="age-verification-title" className={styles.title}>AGE VERIFICATION</h2>
                <p className={styles.message}>
                    You must be 21 years of age or older to enter this site.
                    <br />
                    Please verify your age to continue.
                </p>

                <div className={styles.actions}>
                    <Button onClick={handleDeny} variant="outline" size="md">
                        I am under 21
                    </Button>
                    <Button onClick={handleVerify} variant="primary" size="md">
                        I am 21+
                    </Button>
                </div>

                <p className={styles.disclaimer}>
                    By entering, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
