import styles from "./Footer.module.css";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <Image
                        src="/vapor-aura-logo-clean.png"
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
