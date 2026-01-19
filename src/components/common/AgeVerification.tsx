"use client";

import { useEffect, useState } from "react";
import styles from "./AgeVerification.module.css";
import Button from "@/components/ui/Button";

export default function AgeVerification() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already verified
        const hasVerified = localStorage.getItem("vapor-aura-age-verified");
        if (!hasVerified) {
            // Small delay to ensure client-side rendering matches 
            // and to avoid immediate state update warning if strictly interpreted
            requestAnimationFrame(() => setIsVisible(true));
        }
    }, []);

    const handleVerify = () => {
        localStorage.setItem("vapor-aura-age-verified", "true");
        setIsVisible(false);
    };

    const handleDeny = () => {
        window.location.href = "https://www.google.com";
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.logo}>VAPOR AURA</div>
                <h2 className={styles.title}>AGE VERIFICATION</h2>
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
