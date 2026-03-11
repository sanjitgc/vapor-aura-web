"use client";

import { type TouchEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import styles from "@/app/page.module.css";

interface ProductCategory {
    name: string;
    description: string;
    iconSrc: string;
    wide?: boolean;
    contain?: boolean;
    lightBg?: boolean;
    secondaryIconSrc?: string;
}

interface FlavorGroup {
    device: string;
    price: number;
    flavors: string[];
}

interface SearchTargetDetail {
    device?: string;
    flavor?: string;
    category?: string;
}

const categories: ProductCategory[] = [
    {
        name: "Vape",
        description: "Latest disposables, pod systems, and premium vape devices.",
        iconSrc: "/icons/display/vape-devices.png",
        wide: true,
    },
    {
        name: "Glass",
        description: "Clean-crafted glass pieces with standout quality and style.",
        iconSrc: "/icons/display/glass-bong.png",
        wide: true,
        contain: true,
        lightBg: true,
    },
    {
        name: "Vaporizer",
        description: "Trusted dry herb and concentrate vaporizers for every level.",
        iconSrc: "/icons/display/vaporizer-products.png",
        wide: true,
        contain: true,
    },
    {
        name: "Kratom",
        description: "Trusted kratom products with reliable quality and selection.",
        iconSrc: "/icons/display/kratom-products.png",
        wide: true,
        contain: true,
    },
    {
        name: "CBD",
        description: "Premium CBD options selected for consistency, quality, and trust.",
        iconSrc: "/icons/display/cbd-products.png",
        wide: true,
        contain: true,
    },
    {
        name: "Hookah",
        description: "Premium hookah setups, bowls, coals, and flavor essentials.",
        iconSrc: "/icons/display/hookah-product.png",
        wide: true,
        contain: true,
        lightBg: true,
    },
];

const moreCategories: ProductCategory[] = [
    {
        name: "E-Juices",
        description: "Premium vape juice flavors from trusted brands with smooth performance.",
        iconSrc: "/icons/display/e-juices.png",
        wide: true,
        contain: true,
        lightBg: false,
    },
    {
        name: "Mushroom",
        description: "Carefully sourced mushroom products with reliable quality and variety.",
        iconSrc: "/icons/display/mushroom-products-alt.png",
        wide: true,
        contain: true,
        lightBg: false,
    },
    {
        name: "Edibles",
        description: "Hemp-derived edibles crafted for consistency, flavor, and quality.",
        iconSrc: "/icons/display/edibles-products.png",
        wide: true,
        contain: true,
        lightBg: false,
    },
    {
        name: "Coils / Pods",
        description: "Replacement coils and pods compatible with popular vape devices.",
        iconSrc: "/icons/display/coils-product.png",
        secondaryIconSrc: "/icons/display/pods-product.png",
        wide: true,
        contain: true,
        lightBg: true,
    },
];

const vapeFlavorGroups: FlavorGroup[] = [
    {
        device: "GEEK BAR PULSE",
        price: 22.99,
        flavors: [
            "Watermelon Ice",
            "Strawberry B-Pop",
            "Miami Mint",
            "Blue Razz Ice",
            "Cool Mint",
            "Tropical Rainbow Blast",
            "White Gummy Ice",
            "Strawberry Mango",
            "Sour Apple Ice",
            "Strawberry Banana",
            "Pink Lemonade",
            "Mexico Mango",
            "B-Pop",
            "Juicy Peach Ice",
            "Meta Moon",
            "California Cherry",
            "Fcuking Fab",
        ],
    },
    {
        device: "GEEK BAR PULSE X",
        price: 27.99,
        flavors: [
            "Blackberry Blueberry",
            "Blackberry B-Pop",
            "Blue Rancher",
            "Cool Mint",
            "Grapefruit Refresher",
            "Miami Mint",
            "Raspberry Peach Lime",
            "Sour Mango Pineapple",
            "Sour Fcuking Fab",
            "Banana Taffy Freeze",
            "Blue Razz Ice",
            "Lemon Heads",
            "Lime Berry Orange",
            "Orange Fcuking Fab",
            "Sour Apple Ice",
            "Sour Straws",
            "Strawberry B-Pop",
            "Watermelon Ice",
            "Pepper Mintz",
            "Creamy Mintz",
        ],
    },
    {
        device: "FOGER KIT",
        price: 27.99,
        flavors: [
            "Watermelon Ice",
            "Cool Mint",
            "Strawberry Kiwi",
            "Sour Apple Ice",
            "Blue Razz Ice",
            "Strawberry Watermelon",
            "Gummy Bear",
            "Juicy Peach Ice",
            "Gum Mint",
            "Kiwi Dragon Berry",
            "Cherry Lemon",
            "Strawberry Banana",
            "Pineapple Coconut Ice",
            "Blueberry Watermelon",
            "Strawberry Ice",
            "Mexico Mango",
            "Miami Mint",
            "Coffee",
        ],
    },
    {
        device: "FOGER PODS",
        price: 22.99,
        flavors: [
            "Sour Gush",
            "Gummy Bear",
            "White Gummy",
            "Sour Blue Dust",
            "Strawberry B-Pop",
            "Watermelon Bubblegum",
            "Sour Fcuking Fab",
            "Sour Cranapple",
            "Skittles Cupcake",
        ],
    },
    {
        device: "FIFTY BAR",
        price: 27.99,
        flavors: [
            "Strawberry Cereal Donut Milk",
            "Blueberry Cereal Donut Milk",
            "Vanilla Custard Donut",
            "Cinnamon Funnel Cake",
            "Tobaccocino",
            "Blue Razzle Ice",
            "Mint",
            "Juicy Mango Melon Ice",
            "Aloe Grape Watermelon",
        ],
    },
    {
        device: "OFF STAMP CUBE",
        price: 27.99,
        flavors: [
            "Miami Mint",
            "Blue Razz Ice",
            "Dragon Strawnana",
            "Bangin Peach",
            "Rocket Popsicle",
            "Hawaiian Popsicle",
            "Florida Sherbet",
            "Bangin Watermelon",
        ],
    },
    {
        device: "OFF STAMP CUBE PODS",
        price: 19.99,
        flavors: [
            "Tropical Guava",
            "Sour Apple Ice",
            "Scary Berry",
            "Raspberry Watermelon",
            "Peach Berry",
        ],
    },
];

function toCurrency(value: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function toDeviceId(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function ProductHighlights() {
    const [isVapeCatalogOpen, setIsVapeCatalogOpen] = useState(false);
    const [openFlavorDevice, setOpenFlavorDevice] = useState<string | null>(null);
    const [recentlyAddedKey, setRecentlyAddedKey] = useState<string | null>(null);
    const [searchHighlightedKey, setSearchHighlightedKey] = useState<string | null>(null);
    const [cartToast, setCartToast] = useState<string | null>(null);
    const catalogId = useMemo(() => "vape-flavor-catalog", []);
    const CART_STORAGE_KEY = "vapor-aura-cart";
    const SEARCH_TARGET_STORAGE_KEY = "vapor-aura-search-target";

    function handleVapeCardPress() {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        if (isMobile) {
            setIsVapeCatalogOpen((prev) => !prev);
            return;
        }

        setIsVapeCatalogOpen(true);
        window.setTimeout(() => {
            const catalog = document.getElementById(catalogId);
            catalog?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
    }

    function handleVapeCardTouch(event: TouchEvent<HTMLButtonElement>) {
        event.preventDefault();
        handleVapeCardPress();
    }

    function addFlavorToCart(brand: string, flavor: string, unitPrice: number) {
        const cartEntry = {
            product: "Disposable Vape",
            brand,
            flavor,
            quantity: 1,
            unitPrice,
        };

        try {
            const raw = window.localStorage.getItem(CART_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            const list = Array.isArray(parsed) ? parsed : [];
            const existingIndex = list.findIndex(
                (item: unknown) =>
                    typeof item === "object" &&
                    item !== null &&
                    "product" in item &&
                    "brand" in item &&
                    "flavor" in item &&
                    (item as { product?: string }).product === cartEntry.product &&
                    (item as { brand?: string }).brand === cartEntry.brand &&
                    (item as { flavor?: string }).flavor === cartEntry.flavor,
            );

            if (existingIndex >= 0) {
                const currentQty =
                    typeof list[existingIndex].quantity === "number" ? list[existingIndex].quantity : 1;
                list[existingIndex] = {
                    ...list[existingIndex],
                    quantity: currentQty + 1,
                };
            } else {
                list.push(cartEntry);
            }

            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(list));
            window.dispatchEvent(new CustomEvent("vapor-aura-cart-updated"));
        } catch {
            // Keep the UI interactive even if storage is unavailable.
        }

        const actionKey = `${brand}__${flavor}`;
        setRecentlyAddedKey(actionKey);
        setCartToast(`${brand} - ${flavor} added to cart`);
        window.setTimeout(() => {
            setRecentlyAddedKey((prev) => (prev === actionKey ? null : prev));
        }, 1200);
        window.setTimeout(() => {
            setCartToast((prev) => (prev === `${brand} - ${flavor} added to cart` ? null : prev));
        }, 1700);
    }

    useEffect(() => {
        const applySearchTarget = (detail: SearchTargetDetail) => {
            if (!detail || (!detail.device && !detail.category)) return;
            setIsVapeCatalogOpen(true);
            if (!detail.device) return;

            setOpenFlavorDevice(detail.device);

            if (detail.flavor) {
                const key = `${detail.device}__${detail.flavor}`;
                setSearchHighlightedKey(key);
                window.setTimeout(() => {
                    setSearchHighlightedKey((prev) => (prev === key ? null : prev));
                }, 2200);
            }

            window.setTimeout(() => {
                const section = document.querySelector(
                    `[data-device-id="${toDeviceId(detail.device as string)}"]`,
                ) as HTMLElement | null;
                section?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 170);
        };

        const onSearchSelect = (event: Event) => {
            const custom = event as CustomEvent<SearchTargetDetail>;
            applySearchTarget(custom.detail);
        };

        window.addEventListener("vapor-aura-search-select", onSearchSelect as EventListener);

        try {
            const raw = window.sessionStorage.getItem(SEARCH_TARGET_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as SearchTargetDetail;
                applySearchTarget(parsed);
                window.sessionStorage.removeItem(SEARCH_TARGET_STORAGE_KEY);
            }
        } catch {
            // Ignore malformed targets.
        }

        return () => {
            window.removeEventListener("vapor-aura-search-select", onSearchSelect as EventListener);
        };
    }, []);

    function renderVapeCatalog({ mobile, id }: { mobile: boolean; id?: string }) {
        return (
            <div
                id={id}
                className={`${styles.vapeCatalog} ${isVapeCatalogOpen ? styles.vapeCatalogOpen : ""} ${mobile ? styles.vapeCatalogMobileOnly : styles.vapeCatalogDesktopOnly}`}
                aria-hidden={!isVapeCatalogOpen}
            >
                <div className={styles.vapeCatalogInner}>
                    {vapeFlavorGroups.map((group) => {
                        const isOpen = openFlavorDevice === group.device;
                        return (
                            <div
                                key={`${mobile ? "mobile" : "desktop"}-${group.device}`}
                                className={styles.flavorGroup}
                                {...(!mobile ? { "data-device-id": toDeviceId(group.device) } : {})}
                            >
                                <button
                                    type="button"
                                    className={styles.flavorGroupButton}
                                    onClick={() => setOpenFlavorDevice(isOpen ? null : group.device)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{group.device}</span>
                                    <span className={styles.flavorCaret} aria-hidden="true">
                                        {isOpen ? "−" : "+"}
                                    </span>
                                </button>
                                <ul
                                    className={`${styles.flavorList} ${isOpen ? styles.flavorListOpen : ""}`}
                                    aria-hidden={!isOpen}
                                >
                                    {group.flavors.map((flavor) => {
                                        const actionKey = `${group.device}__${flavor}`;
                                        const isAdded = recentlyAddedKey === actionKey;
                                        return (
                                            <li
                                                key={flavor}
                                                className={`${styles.flavorRow} ${searchHighlightedKey === actionKey ? styles.flavorRowHighlight : ""}`}
                                            >
                                                <span className={styles.flavorName}>{flavor}</span>
                                                <div className={styles.flavorActions}>
                                                    <span className={styles.flavorPrice}>{toCurrency(group.price)}</span>
                                                    <button
                                                        type="button"
                                                        className={`${styles.addToCartBtn} ${isAdded ? styles.addedToCartBtn : ""}`}
                                                        onClick={() => addFlavorToCart(group.device, flavor, group.price)}
                                                    >
                                                        {isAdded ? "Added ✓" : "Add to Cart"}
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                    {cartToast && <p className={styles.cartToast}>{cartToast}</p>}
                </div>
            </div>
        );
    }

    return (
        <>
            <section
                id="products"
                className={`${styles.productHints} ${styles.leafDecorSection}`}
                aria-labelledby="product-hints-title"
            >
                <div className={styles.container}>
                    <AnimateIn>
                        <div className={styles.productHeader}>
                            <h2 id="product-hints-title" className={styles.sectionTitle}>
                                Product Highlights
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                Explore signature categories our customers love at Vapor Aura.
                            </p>
                        </div>
                    </AnimateIn>

                    <div className={styles.productGrid}>
                        {categories.map((category, index) => {
                            const isVape = category.name === "Vape";
                            return (
                                <AnimateIn key={category.name} delay={0.1 + index * 0.08}>
                                    <div className={styles.productCard}>
                                        {isVape ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className={styles.vapeToggle}
                                                onClick={handleVapeCardPress}
                                                    onTouchEnd={handleVapeCardTouch}
                                                    aria-expanded={isVapeCatalogOpen}
                                                    aria-controls={catalogId}
                                                >
                                                    <div
                                                        className={`${styles.iconWrap} ${category.wide ? styles.iconWrapWide : ""} ${category.lightBg ? styles.iconWrapContainLight : ""}`}
                                                    >
                                                        <Image
                                                            src={category.iconSrc}
                                                            alt={category.name}
                                                            fill
                                                            sizes="(max-width: 640px) 90vw, (max-width: 980px) 42vw, 300px"
                                                            className={`${styles.iconImageWide} ${category.contain ? styles.iconImageContain : ""}`}
                                                        />
                                                    </div>
                                                    <h3 className={styles.productTitle}>{category.name}</h3>
                                                    <p className={styles.productText}>{category.description}</p>
                                                </button>
                                                {renderVapeCatalog({ mobile: true })}
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className={`${styles.iconWrap} ${category.wide ? styles.iconWrapWide : ""} ${category.lightBg ? styles.iconWrapContainLight : ""}`}
                                                >
                                                    {category.wide ? (
                                                        <Image
                                                            src={category.iconSrc}
                                                            alt={category.name}
                                                            fill
                                                            sizes="(max-width: 640px) 90vw, (max-width: 980px) 42vw, 300px"
                                                            className={`${styles.iconImageWide} ${category.contain ? styles.iconImageContain : ""}`}
                                                        />
                                                    ) : (
                                                        <Image
                                                            src={category.iconSrc}
                                                            alt={category.name}
                                                            width={116}
                                                            height={80}
                                                            className={styles.iconImage}
                                                        />
                                                    )}
                                                </div>
                                                <h3 className={styles.productTitle}>{category.name}</h3>
                                                <p className={styles.productText}>{category.description}</p>
                                            </>
                                        )}
                                    </div>
                                </AnimateIn>
                            );
                        })}
                    </div>

                    {renderVapeCatalog({ mobile: false, id: catalogId })}
                </div>
            </section>

            <section
                className={`${styles.productHints} ${styles.leafDecorSection} ${styles.moreProductSection}`}
                aria-labelledby="more-product-categories-title"
            >
                <div className={styles.container}>
                    <AnimateIn>
                        <div className={styles.productHeader}>
                            <h2 id="more-product-categories-title" className={styles.sectionTitle}>
                                More Product Categories
                            </h2>
                        </div>
                    </AnimateIn>

                    <div className={`${styles.productGrid} ${styles.productGridFour}`}>
                        {moreCategories.map((category, index) => (
                            <AnimateIn key={category.name} delay={0.08 + index * 0.08}>
                                <div className={styles.productCard}>
                                    <div
                                        className={`${styles.iconWrap} ${category.wide ? styles.iconWrapWide : ""} ${category.lightBg ? styles.iconWrapContainLight : ""}`}
                                    >
                                        {category.wide ? (
                                            category.secondaryIconSrc ? (
                                                <div className={styles.iconSplit}>
                                                    <div className={styles.iconSplitItem}>
                                                        <Image
                                                            src={category.iconSrc}
                                                            alt={`${category.name} coils`}
                                                            fill
                                                            sizes="(max-width: 640px) 42vw, (max-width: 980px) 20vw, 150px"
                                                            className={styles.iconSplitImage}
                                                        />
                                                    </div>
                                                    <div className={styles.iconSplitItem}>
                                                        <Image
                                                            src={category.secondaryIconSrc}
                                                            alt={`${category.name} pods`}
                                                            fill
                                                            sizes="(max-width: 640px) 42vw, (max-width: 980px) 20vw, 150px"
                                                            className={styles.iconSplitImage}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <Image
                                                    src={category.iconSrc}
                                                    alt={category.name}
                                                    fill
                                                    sizes="(max-width: 640px) 90vw, (max-width: 980px) 42vw, 300px"
                                                    className={`${styles.iconImageWide} ${category.contain ? styles.iconImageContain : ""}`}
                                                />
                                            )
                                        ) : (
                                            <Image
                                                src={category.iconSrc}
                                                alt={category.name}
                                                width={116}
                                                height={80}
                                                className={styles.iconImage}
                                            />
                                        )}
                                    </div>
                                    <h3 className={styles.productTitle}>{category.name}</h3>
                                    <p className={styles.productText}>{category.description}</p>
                                </div>
                            </AnimateIn>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
