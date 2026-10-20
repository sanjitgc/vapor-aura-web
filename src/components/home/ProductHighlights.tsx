"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa6";
import AnimateIn from "@/components/ui/AnimateIn";
import styles from "./ProductHighlights.module.css";

interface ProductCategory {
    name: string;
    description: string;
    image: string;
    alt: string;
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

// Product shots are cut out so every category stands on the same lit pedestal.
const categories: ProductCategory[] = [
    {
        name: "Vape",
        description: "Latest disposables, pod systems, and premium vape devices.",
        image: "/products/vape.webp",
        alt: "Geek Bar, Juicy Bar and RAZ disposable vapes",
    },
    {
        name: "Glass",
        description: "Clean-crafted glass pieces with standout quality and style.",
        image: "/products/glass.webp",
        alt: "Three glass beaker bongs",
    },
    {
        name: "Vaporizer",
        description: "Trusted dry herb and concentrate vaporizers for every level.",
        image: "/products/vaporizer.webp",
        alt: "DaVinci, Crafty, Mighty and Firefly vaporizers",
    },
    {
        name: "Kratom",
        description: "Trusted kratom products with reliable quality and selection.",
        image: "/products/kratom.webp",
        alt: "7Tabz kratom tablet packs",
    },
    {
        name: "CBD",
        description: "Premium CBD options selected for consistency, quality, and trust.",
        image: "/products/cbd.webp",
        alt: "CBD oil dropper bottles",
    },
    {
        name: "Hookah",
        description: "Premium hookah setups, bowls, coals, and flavor essentials.",
        image: "/products/hookah.webp",
        alt: "Hookah with a braided hose",
    },
];

const moreCategories: ProductCategory[] = [
    {
        name: "E-Juices",
        description: "Premium vape juice flavors from trusted brands with smooth performance.",
        image: "/products/e-liquid.webp",
        alt: "Three e-liquid bottles, including Juice Head and Naked",
    },
    {
        name: "Mushroom",
        description: "Carefully sourced mushroom products with reliable quality and variety.",
        image: "/products/mushroom.webp",
        alt: "Float mushroom gummies pack",
    },
    {
        name: "Edibles",
        description: "Hemp-derived edibles crafted for consistency, flavor, and quality.",
        image: "/products/edibles.webp",
        alt: "Assorted hemp edible packs",
    },
    {
        name: "Coils / Pods",
        description: "Replacement coils and pods compatible with popular vape devices.",
        image: "/products/coils-pods.webp",
        alt: "GeekVape coils and SMOK replacement pods",
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

function Stage({ image, alt, sizes }: { image: string; alt: string; sizes: string }) {
    return (
        <div className={styles.stage}>
            <span className={styles.pedestal} aria-hidden="true" />
            <Image src={image} alt={alt} fill sizes={sizes} className={styles.product} />
        </div>
    );
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
        if (isVapeCatalogOpen) {
            setIsVapeCatalogOpen(false);
            return;
        }

        setIsVapeCatalogOpen(true);
        window.setTimeout(() => {
            const catalog = document.getElementById(catalogId);
            catalog?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 160);
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
        const message = `Added ${flavor} to your cart`;
        setRecentlyAddedKey(actionKey);
        setCartToast(message);
        window.setTimeout(() => {
            setRecentlyAddedKey((prev) => (prev === actionKey ? null : prev));
        }, 1200);
        window.setTimeout(() => {
            setCartToast((prev) => (prev === message ? null : prev));
        }, 2200);
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
            }, 220);
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

    return (
        <section id="products" className={styles.section} aria-labelledby="product-hints-title">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 id="product-hints-title" className={styles.title}>
                        What we carry
                    </h2>
                    <p className={styles.subtitle}>
                        Stop in for the full selection, or open Vape to browse disposable flavors and add them to
                        your cart.
                    </p>
                </div>

                <div className={styles.grid}>
                    {categories.map((category, index) => {
                        const isVape = category.name === "Vape";
                        return (
                            <AnimateIn key={category.name} delay={0.04 + index * 0.06} className={styles.cell}>
                                <article
                                    className={`${styles.tile} ${isVape ? styles.tileAction : ""} ${isVape && isVapeCatalogOpen ? styles.tileOpen : ""}`}
                                >
                                    <Stage
                                        image={category.image}
                                        alt={category.alt}
                                        sizes="(max-width: 640px) 46vw, (max-width: 980px) 44vw, 360px"
                                    />
                                    <div className={styles.body}>
                                        <h3 className={styles.tileTitle}>{category.name}</h3>
                                        <p className={styles.tileText}>{category.description}</p>
                                        {isVape && (
                                            <button
                                                type="button"
                                                className={styles.browse}
                                                onClick={handleVapeCardPress}
                                                aria-expanded={isVapeCatalogOpen}
                                                aria-controls={catalogId}
                                            >
                                                {isVapeCatalogOpen ? "Hide flavors" : "Browse flavors"}
                                                <FaChevronDown aria-hidden="true" className={styles.browseIcon} />
                                            </button>
                                        )}
                                    </div>
                                </article>
                            </AnimateIn>
                        );
                    })}
                </div>

                <div
                    id={catalogId}
                    className={`${styles.catalog} ${isVapeCatalogOpen ? styles.catalogOpen : ""}`}
                    inert={!isVapeCatalogOpen}
                >
                    <div className={styles.catalogClip}>
                        <div className={styles.catalogInner}>
                            <div className={styles.catalogHead}>
                                <h3 className={styles.catalogTitle}>Disposable flavors</h3>
                                <p className={styles.catalogNote}>
                                    Pick a device, add the flavors you want, then check out for delivery.
                                </p>
                            </div>

                            <div className={styles.groups}>
                                {vapeFlavorGroups.map((group) => {
                                    const isOpen = openFlavorDevice === group.device;
                                    const listId = `flavors-${toDeviceId(group.device)}`;
                                    return (
                                        <div
                                            key={group.device}
                                            className={`${styles.group} ${isOpen ? styles.groupOpen : ""}`}
                                            data-device-id={toDeviceId(group.device)}
                                        >
                                            <button
                                                type="button"
                                                className={styles.groupButton}
                                                onClick={() => setOpenFlavorDevice(isOpen ? null : group.device)}
                                                aria-expanded={isOpen}
                                                aria-controls={listId}
                                            >
                                                <span className={styles.groupName}>{group.device}</span>{" "}
                                                <span className={styles.groupMeta}>
                                                    <span className={styles.groupPrice}>{toCurrency(group.price)}</span>{" "}
                                                    <span className={styles.groupCount}>{group.flavors.length} flavors</span>
                                                </span>
                                                <FaChevronDown aria-hidden="true" className={styles.caret} />
                                            </button>
                                            <div
                                                className={`${styles.flavorPanel} ${isOpen ? styles.flavorPanelOpen : ""}`}
                                                inert={!isOpen}
                                            >
                                                <div className={styles.flavorClip}>
                                                    <ul id={listId} className={styles.flavorList}>
                                                        {group.flavors.map((flavor) => {
                                                            const actionKey = `${group.device}__${flavor}`;
                                                            const isAdded = recentlyAddedKey === actionKey;
                                                            return (
                                                                <li
                                                                    key={flavor}
                                                                    className={`${styles.flavorRow} ${searchHighlightedKey === actionKey ? styles.flavorRowHighlight : ""}`}
                                                                >
                                                                    <span className={styles.flavorName}>{flavor}</span>
                                                                    <button
                                                                        type="button"
                                                                        className={`${styles.addBtn} ${isAdded ? styles.addBtnDone : ""}`}
                                                                        onClick={() => addFlavorToCart(group.device, flavor, group.price)}
                                                                        aria-label={`Add ${flavor} (${group.device}) to cart`}
                                                                    >
                                                                        {isAdded ? "Added" : "Add"}
                                                                    </button>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <p className={`${styles.toast} ${cartToast ? styles.toastShow : ""}`} role="status">
                                {cartToast}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.more}>
                    <h3 className={styles.moreTitle}>Also on the shelves</h3>
                    <div className={`${styles.grid} ${styles.gridFour}`}>
                        {moreCategories.map((category, index) => (
                            <AnimateIn key={category.name} delay={0.04 + index * 0.06} className={styles.cell}>
                                <article className={`${styles.tile} ${styles.tileCompact}`}>
                                    <Stage
                                        image={category.image}
                                        alt={category.alt}
                                        sizes="(max-width: 640px) 46vw, (max-width: 980px) 44vw, 270px"
                                    />
                                    <div className={styles.body}>
                                        <h4 className={styles.tileTitle}>{category.name}</h4>
                                        <p className={styles.tileText}>{category.description}</p>
                                    </div>
                                </article>
                            </AnimateIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
