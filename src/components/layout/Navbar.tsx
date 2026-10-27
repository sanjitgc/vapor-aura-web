"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";
import { SiDoordash } from "react-icons/si";
import { DOORDASH_URL } from "@/lib/stores";

// Products, Locations and Contact are real pages (so search engines can rank them). On the home page
// the menu still lights up as you scroll past the matching section ("hash" = that section's id).
const links: { href: string; label: string; hash?: string; paths?: string[] }[] = [
    { href: "/", label: "Home", hash: "#home" },
    { href: "/#why-choose", label: "About us", hash: "#why-choose" },
    { href: "/products", label: "Products", hash: "#products", paths: ["/products"] },
    { href: "/locations", label: "Locations", hash: "#locations", paths: ["/locations", "/sachse", "/irving"] },
    { href: "/contact", label: "Contact", hash: "#contact", paths: ["/contact"] },
];

function isActive(link: (typeof links)[number], pathname: string, activeHash: string) {
    if (pathname === "/") return link.hash === activeHash;
    return Boolean(link.paths?.some((p) => pathname === p || pathname.startsWith(`${p}/`)));
}

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [activeHash, setActiveHash] = useState("#home");

    useEffect(() => {
        if (pathname !== "/") {
            return;
        }

        const sectionHashes = links.flatMap((link) => (link.hash ? [link.hash] : []));
        const headerHeightRaw = getComputedStyle(document.documentElement).getPropertyValue("--header-height");
        const headerOffset = Number.parseInt(headerHeightRaw, 10) || 92;
        const sectionElements = sectionHashes
            .map((hash) => ({ hash, element: document.querySelector(hash) as HTMLElement | null }))
            .filter((entry): entry is { hash: string; element: HTMLElement } => Boolean(entry.element));

        const visibility = new Map<string, number>();
        sectionElements.forEach((entry) => visibility.set(entry.hash, 0));

        const resolveActiveHash = () => {
            let bestHash = sectionHashes[0] ?? "#home";
            let bestRatio = -1;

            for (const hash of sectionHashes) {
                const ratio = visibility.get(hash) ?? 0;
                if (ratio > bestRatio) {
                    bestRatio = ratio;
                    bestHash = hash;
                }
            }

            if (bestRatio > 0) return bestHash;

            const scrollMarker = window.scrollY + headerOffset + 24;
            let fallbackHash = sectionHashes[0] ?? "#home";
            for (const entry of sectionElements) {
                if (entry.element.offsetTop <= scrollMarker) {
                    fallbackHash = entry.hash;
                }
            }
            return fallbackHash;
        };

        const updateActiveFromView = () => {
            const nextHash = resolveActiveHash();
            setActiveHash((prev) => (prev === nextHash ? prev : nextHash));
        };

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const id = `#${entry.target.id}`;
                    visibility.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
                }
                updateActiveFromView();
            },
            {
                root: null,
                rootMargin: `-${headerOffset}px 0px -45% 0px`,
                threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.7, 1],
            },
        );

        sectionElements.forEach((entry) => observer.observe(entry.element));
        window.addEventListener("scroll", updateActiveFromView, { passive: true });
        window.addEventListener("hashchange", updateActiveFromView);
        updateActiveFromView();

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", updateActiveFromView);
            window.removeEventListener("hashchange", updateActiveFromView);
        };
    }, [pathname]);

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/vapor-aura-logo-new.png"
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
                                className={`${styles.link} ${isActive(link, pathname, activeHash) ? styles.active : ""}`}
                                aria-current={isActive(link, pathname, activeHash) && pathname !== "/" ? "page" : undefined}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className={styles.navActions}>
                    <a
                        href={DOORDASH_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.orderButton}
                        aria-label="Order online on DoorDash (opens in a new tab)"
                    >
                        <SiDoordash aria-hidden="true" />
                        <span className={styles.orderLabelLong}>Order online</span>
                        <span className={styles.orderLabelShort}>Order</span>
                    </a>
                </div>

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
                            className={`${styles.mobileLink} ${isActive(link, pathname, activeHash) ? styles.active : ""}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        href={DOORDASH_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mobileOrder}
                        onClick={() => setIsOpen(false)}
                    >
                        <SiDoordash aria-hidden="true" /> Order on DoorDash
                    </a>
                </div>
            )}

        </nav>
    );
}
