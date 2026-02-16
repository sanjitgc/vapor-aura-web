"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";

const links = [
    { href: "/#home", label: "Home", hash: "#home" },
    { href: "/#locations", label: "Locations", hash: "#locations" },
    { href: "/#about", label: "About Us", hash: "#about" },
    { href: "/#products", label: "Products", hash: "#products" },
    { href: "/#contact", label: "Contact", hash: "#contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [activeHash, setActiveHash] = useState("#home");

    useEffect(() => {
        if (pathname !== "/") {
            setActiveHash("");
            return;
        }

        const updateActiveHash = () => {
            setActiveHash(window.location.hash || "#home");
        };

        updateActiveHash();
        window.addEventListener("hashchange", updateActiveHash);
        return () => {
            window.removeEventListener("hashchange", updateActiveHash);
        };
    }, [pathname]);

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/vapor-aura-logo-clean.png"
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
                                className={`${styles.link} ${pathname === "/" && activeHash === link.hash ? styles.active : ""}`}
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
                            className={`${styles.mobileLink} ${pathname === "/" && activeHash === link.hash ? styles.active : ""}`}
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
