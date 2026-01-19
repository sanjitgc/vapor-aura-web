import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <h2 className={styles.logo}>VAPOR AURA</h2>
                    <p className={styles.tagline}>Premium Smoke & Lifestyle</p>
                </div>

                <div className={styles.links}>
                    <Link href="/locations">Locations</Link>
                    <Link href="/about">About Us</Link>
                    <Link href="/contact">Contact</Link>
                </div>

                <div className={styles.copy}>
                    &copy; {new Date().getFullYear()} Vapor Aura. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
