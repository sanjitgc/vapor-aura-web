"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { FaCartShopping, FaMagnifyingGlass } from "react-icons/fa6";

const links = [
    { href: "/#home", label: "Home", hash: "#home" },
    { href: "/#why-choose", label: "About Us", hash: "#why-choose" },
    { href: "/#products", label: "Products", hash: "#products" },
    { href: "/#contact", label: "Contact", hash: "#contact" },
    { href: "/#locations", label: "Locations", hash: "#locations" },
];

interface CartItem {
    product: string;
    brand: string;
    flavor: string;
    quantity: number;
}

interface SearchEntry {
    id: string;
    label: string;
    kind: "flavor" | "brand" | "category";
    device?: string;
    flavor?: string;
    category?: string;
}

interface SearchTarget {
    device?: string;
    flavor?: string;
    category?: string;
}

const CART_STORAGE_KEY = "vapor-aura-cart";
const SEARCH_TARGET_STORAGE_KEY = "vapor-aura-search-target";

const flavorGroups = [
    {
        device: "GEEK BAR PULSE",
        flavors: [
            "Watermelon Ice", "Strawberry B-Pop", "Miami Mint", "Blue Razz Ice", "Cool Mint", "Tropical Rainbow Blast",
            "White Gummy Ice", "Strawberry Mango", "Sour Apple Ice", "Strawberry Banana", "Pink Lemonade", "Mexico Mango",
            "B-Pop", "Juicy Peach Ice", "Meta Moon", "California Cherry", "Fcuking Fab",
        ],
    },
    {
        device: "GEEK BAR PULSE X",
        flavors: [
            "Blackberry Blueberry", "Blackberry B-Pop", "Blue Rancher", "Cool Mint", "Grapefruit Refresher", "Miami Mint",
            "Raspberry Peach Lime", "Sour Mango Pineapple", "Sour Fcuking Fab", "Banana Taffy Freeze", "Blue Razz Ice",
            "Lemon Heads", "Lime Berry Orange", "Orange Fcuking Fab", "Sour Apple Ice", "Sour Straws", "Strawberry B-Pop",
            "Watermelon Ice", "Pepper Mintz", "Creamy Mintz",
        ],
    },
    {
        device: "FOGER KIT",
        flavors: [
            "Watermelon Ice", "Cool Mint", "Strawberry Kiwi", "Sour Apple Ice", "Blue Razz Ice", "Strawberry Watermelon",
            "Gummy Bear", "Juicy Peach Ice", "Gum Mint", "Kiwi Dragon Berry", "Cherry Lemon", "Strawberry Banana",
            "Pineapple Coconut Ice", "Blueberry Watermelon", "Strawberry Ice", "Mexico Mango", "Miami Mint", "Coffee",
        ],
    },
    {
        device: "FOGER PODS",
        flavors: [
            "Sour Gush", "Gummy Bear", "White Gummy", "Sour Blue Dust", "Strawberry B-Pop", "Watermelon Bubblegum",
            "Sour Fcuking Fab", "Sour Cranapple", "Skittles Cupcake",
        ],
    },
    {
        device: "FIFTY BAR",
        flavors: [
            "Strawberry Cereal Donut Milk", "Blueberry Cereal Donut Milk", "Vanilla Custard Donut", "Cinnamon Funnel Cake",
            "Tobaccocino", "Blue Razzle Ice", "Mint", "Juicy Mango Melon Ice", "Aloe Grape Watermelon",
        ],
    },
    {
        device: "OFF STAMP CUBE",
        flavors: [
            "Miami Mint", "Blue Razz Ice", "Dragon Strawnana", "Bangin Peach", "Rocket Popsicle",
            "Hawaiian Popsicle", "Florida Sherbet", "Bangin Watermelon",
        ],
    },
    {
        device: "OFF STAMP CUBE PODS",
        flavors: ["Tropical Guava", "Sour Apple Ice", "Scary Berry", "Raspberry Watermelon", "Peach Berry"],
    },
] as const;

const productCategories = [
    "Vape",
    "Glass",
    "Vaporizer",
    "Kratom",
    "CBD",
    "Hookah",
    "E-Juices",
    "Mushroom",
    "Edibles",
    "Coils / Pods",
] as const;

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [activeHash, setActiveHash] = useState("#home");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isBadgeBouncing, setIsBadgeBouncing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const searchIndex: SearchEntry[] = useMemo(() => {
        const entries: SearchEntry[] = [];
        for (const group of flavorGroups) {
            entries.push({
                id: `brand-${group.device}`,
                label: group.device,
                kind: "brand",
                device: group.device,
            });
            for (const flavor of group.flavors) {
                entries.push({
                    id: `flavor-${group.device}-${flavor}`,
                    label: `${flavor} - ${group.device}`,
                    kind: "flavor",
                    device: group.device,
                    flavor,
                });
            }
        }
        for (const category of productCategories) {
            entries.push({
                id: `category-${category}`,
                label: category,
                kind: "category",
                category,
            });
        }
        return entries;
    }, []);

    const filteredSuggestions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return [];
        return searchIndex
            .filter((entry) => entry.label.toLowerCase().includes(query))
            .slice(0, 8);
    }, [searchIndex, searchQuery]);

    const cartCount = cartItems.reduce((sum, item) => sum + Math.max(1, item.quantity || 1), 0);

    useEffect(() => {
        const readCart = () => {
            try {
                const raw = window.localStorage.getItem(CART_STORAGE_KEY);
                const parsed = raw ? JSON.parse(raw) : [];
                const normalized = Array.isArray(parsed)
                    ? parsed
                          .filter((item): item is Partial<CartItem> => typeof item === "object" && item !== null)
                          .map((item) => ({
                              product: typeof item.product === "string" ? item.product : "Disposable Vape",
                              brand: typeof item.brand === "string" ? item.brand : "Unknown Brand",
                              flavor: typeof item.flavor === "string" ? item.flavor : "Unknown Flavor",
                              quantity: typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1,
                          }))
                    : [];
                setCartItems(normalized);
            } catch {
                setCartItems([]);
            }
        };

        const handleCartUpdate = () => {
            readCart();
            setIsBadgeBouncing(true);
            window.setTimeout(() => setIsBadgeBouncing(false), 420);
        };

        readCart();
        window.addEventListener("storage", handleCartUpdate);
        window.addEventListener("vapor-aura-cart-updated", handleCartUpdate as EventListener);
        return () => {
            window.removeEventListener("storage", handleCartUpdate);
            window.removeEventListener("vapor-aura-cart-updated", handleCartUpdate as EventListener);
        };
    }, []);

    function persistCart(next: CartItem[]) {
        try {
            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
            window.dispatchEvent(new CustomEvent("vapor-aura-cart-updated"));
        } catch {
            // Keep UI responsive if storage write fails.
        }
    }

    function removeCartItem(index: number) {
        const next = cartItems.filter((_, i) => i !== index);
        setCartItems(next);
        persistCart(next);
    }

    function updateItemQuantity(index: number, delta: number) {
        const next = cartItems
            .map((item, i) => (i === index ? { ...item, quantity: item.quantity + delta } : item))
            .filter((item) => item.quantity > 0);
        setCartItems(next);
        persistCart(next);
    }

    function highlightMatch(text: string, query: string) {
        const q = query.trim();
        if (!q) return text;
        const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const parts = text.split(new RegExp(`(${safe})`, "gi"));
        return parts.map((part, idx) =>
            part.toLowerCase() === q.toLowerCase() ? (
                <mark key={`${part}-${idx}`} className={styles.searchMark}>{part}</mark>
            ) : (
                <span key={`${part}-${idx}`}>{part}</span>
            ),
        );
    }

    function openSearchTarget(target: SearchTarget) {
        try {
            window.sessionStorage.setItem(SEARCH_TARGET_STORAGE_KEY, JSON.stringify(target));
        } catch {
            // Ignore storage failures and still try live dispatch.
        }

        if (pathname !== "/") {
            window.location.href = "/#products";
            return;
        }

        window.location.hash = "#products";
        window.dispatchEvent(new CustomEvent("vapor-aura-search-select", { detail: target }));
    }

    function selectSuggestion(entry: SearchEntry) {
        const target: SearchTarget = {};
        if (entry.kind === "flavor") {
            target.device = entry.device;
            target.flavor = entry.flavor;
        } else if (entry.kind === "brand") {
            target.device = entry.device;
        } else {
            target.category = entry.category;
        }

        openSearchTarget(target);
        setSearchQuery("");
        setIsSuggestionOpen(false);
        setActiveSuggestionIndex(-1);
        setIsMobileSearchOpen(false);
    }

    function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (!filteredSuggestions.length) return;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setIsSuggestionOpen(true);
            setActiveSuggestionIndex((prev) => (prev + 1) % filteredSuggestions.length);
            return;
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            setIsSuggestionOpen(true);
            setActiveSuggestionIndex((prev) =>
                prev <= 0 ? filteredSuggestions.length - 1 : prev - 1,
            );
            return;
        }
        if (event.key === "Enter") {
            event.preventDefault();
            const safeIndex =
                activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length
                    ? activeSuggestionIndex
                    : 0;
            const target = filteredSuggestions[safeIndex];
            if (target) selectSuggestion(target);
            return;
        }
        if (event.key === "Escape") {
            setIsSuggestionOpen(false);
        }
    }

    useEffect(() => {
        if (pathname !== "/") {
            return;
        }

        const sectionHashes = links.map((link) => link.hash);
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
                                className={`${styles.link} ${pathname === "/" && activeHash === link.hash ? styles.active : ""}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className={styles.navActions}>
                    <button
                        type="button"
                        className={styles.cartButton}
                        onClick={() => setIsCartOpen(true)}
                        aria-label={`Open cart with ${cartCount} items`}
                    >
                        <FaCartShopping aria-hidden="true" />
                        <span className={`${styles.cartBadge} ${isBadgeBouncing ? styles.cartBadgeBounce : ""}`}>
                            {cartCount}
                        </span>
                    </button>

                    <div className={styles.searchWrap}>
                        <button
                            type="button"
                            className={styles.searchToggle}
                            onClick={() => {
                                setIsMobileSearchOpen((prev) => !prev);
                                window.setTimeout(() => searchInputRef.current?.focus(), 0);
                            }}
                            aria-label="Open product search"
                        >
                            <FaMagnifyingGlass aria-hidden="true" />
                        </button>

                        <div className={`${styles.searchField} ${isMobileSearchOpen ? styles.searchFieldOpen : ""}`}>
                            <FaMagnifyingGlass className={styles.searchIcon} aria-hidden="true" />
                            <input
                                ref={searchInputRef}
                                value={searchQuery}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchQuery(value);
                                    setIsSuggestionOpen(Boolean(value.trim()));
                                    setActiveSuggestionIndex(0);
                                }}
                                onFocus={() => setIsSuggestionOpen(Boolean(searchQuery.trim()))}
                                onBlur={() => window.setTimeout(() => setIsSuggestionOpen(false), 120)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Search products, brands, or flavors..."
                                className={styles.searchInput}
                            />
                            {isSuggestionOpen && filteredSuggestions.length > 0 && (
                                <div className={styles.searchDropdown}>
                                    {filteredSuggestions.map((entry, index) => (
                                        <button
                                            key={entry.id}
                                            type="button"
                                            className={`${styles.searchResult} ${index === activeSuggestionIndex ? styles.searchResultActive : ""}`}
                                            onMouseEnter={() => setActiveSuggestionIndex(index)}
                                            onClick={() => selectSuggestion(entry)}
                                        >
                                            {highlightMatch(entry.label, searchQuery)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
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
                            className={`${styles.mobileLink} ${pathname === "/" && activeHash === link.hash ? styles.active : ""}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button
                        type="button"
                        className={styles.mobileCartButton}
                        onClick={() => {
                            setIsOpen(false);
                            setIsCartOpen(true);
                        }}
                    >
                        <FaCartShopping aria-hidden="true" />
                        <span>Cart</span>
                        <span className={`${styles.cartBadge} ${isBadgeBouncing ? styles.cartBadgeBounce : ""}`}>
                            {cartCount}
                        </span>
                    </button>
                </div>
            )}

            {isCartOpen && <button type="button" className={styles.cartBackdrop} onClick={() => setIsCartOpen(false)} aria-label="Close cart" />}
            <aside className={`${styles.cartPanel} ${isCartOpen ? styles.cartPanelOpen : ""}`} aria-hidden={!isCartOpen}>
                <div className={styles.cartHeader}>
                    <h3>Shopping Cart</h3>
                    <button type="button" className={styles.cartClose} onClick={() => setIsCartOpen(false)} aria-label="Close cart">
                        ×
                    </button>
                </div>
                <div className={styles.cartBody}>
                    {cartItems.length === 0 ? (
                        <p className={styles.cartEmpty}>Your cart is empty.</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <article key={`${item.brand}-${item.flavor}-${index}`} className={styles.cartItem}>
                                <p className={styles.cartItemTitle}>{item.product}</p>
                                <p className={styles.cartItemMeta}>
                                    <span>Brand: {item.brand}</span>
                                    <span>Flavor: {item.flavor}</span>
                                </p>
                                <div className={styles.qtyRow}>
                                    <span>Qty:</span>
                                    <div className={styles.qtyControls}>
                                        <button
                                            type="button"
                                            className={styles.qtyBtn}
                                            onClick={() => updateItemQuantity(index, -1)}
                                            aria-label={`Decrease quantity for ${item.flavor}`}
                                        >
                                            −
                                        </button>
                                        <span className={styles.qtyValue}>{item.quantity}</span>
                                        <button
                                            type="button"
                                            className={styles.qtyBtn}
                                            onClick={() => updateItemQuantity(index, 1)}
                                            aria-label={`Increase quantity for ${item.flavor}`}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button type="button" className={styles.removeBtn} onClick={() => removeCartItem(index)}>
                                    Remove
                                </button>
                            </article>
                        ))
                    )}
                </div>
                <div className={styles.cartFooter}>
                    <Link href="/checkout" className={styles.checkoutBtn} onClick={() => setIsCartOpen(false)}>
                        Checkout
                    </Link>
                </div>
            </aside>
        </nav>
    );
}
