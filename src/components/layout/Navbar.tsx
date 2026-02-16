"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { useState } from "react";

const links = [
    { href: "/", label: "Home" },
    { href: "/locations", label: "Locations" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/vapor-aura-logo-transparent.png"
                        alt="Vapor Aura"
                        width={240}
                        height={72}
                        className={styles.logoImage}
                        priority
                    />
                </Link>

                {/* Desktop Menu */}
                <ul className={styles.menu}>
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`${styles.link} ${pathname === link.href ? styles.active : ""
                                    }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Mobile Hamburger (Basic implementation for now) */}
                <button
                    className={styles.hamburger}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isOpen}
                    aria-controls="mobile-navigation"
                >
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div id="mobile-navigation" className={styles.mobileMenu}>
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={styles.mobileLink}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
