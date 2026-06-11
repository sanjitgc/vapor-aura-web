"use client";

import styles from "./Footer.module.css";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
    const ref = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return (
        <footer  ref={ref}
            className={`${styles.footer} ${visible ? styles.footerVisible : styles.footerHidden}`}
        >
            <div className={styles.policies}>
    <a href="/refund-policy">Refund Policy</a>
    <a href="/privacy-policy">Privacy Policy</a>
</div>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <Image
                        src="/vapor-aura-logo-new.png"
                        alt="Vapor Aura"
                        width={280}
                        height={84}
                        className={styles.logo}
                    />
                    <p className={styles.tagline}>Premium Smoke & Lifestyle</p>
                </div>

                <div className={styles.links} aria-label="Social media links">
                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Vapor Aura on Instagram"
                    >
                        <FaInstagram aria-hidden="true" />
                    </a>
                    <a
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Vapor Aura on Facebook"
                    >
                        <FaFacebookF aria-hidden="true" />
                    </a>
                    <a
                        href="https://www.tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Vapor Aura on TikTok"
                    >
                        <FaTiktok aria-hidden="true" />
                    </a>
                    <a
                        href="https://x.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Vapor Aura on X"
                    >
                        <FaXTwitter aria-hidden="true" />
                    </a>
                </div>

                <div className={styles.copy}>
                    &copy; {new Date().getFullYear()} Vapor Aura. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
