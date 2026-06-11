"use client";
import Link from "next/link";
import { type TouchEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import styles from "@/app/page.module.css";

interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    descriptionHtml: string;
    tags: string[];
    images: {
        edges: {
            node: {
                url: string;
                altText: string;
            };
        }[];
    };
    variants: {
        edges: {
            node: {
                id: string;
                price: {
                    amount: string;
                    currencyCode: string;
                };
                availableForSale: boolean;
            };
        }[];
    };
}

interface ProductCategory {
    name: string;
    description: string;
    iconSrc: string;
    wide?: boolean;
    contain?: boolean;
    lightBg?: boolean;
    secondaryIconSrc?: string;
}

interface SearchTargetDetail {
    device?: string;
    flavor?: string;
    category?: string;
}

const categoryMeta: Record<string, Omit<ProductCategory, "name">> = {
    vape: {
        description: "Latest disposables, pod systems, and premium vape devices.",
        iconSrc: "/icons/display/vape-devices.png",
        wide: true,
    },
    glass: {
        description: "Clean-crafted glass pieces with standout quality and style.",
        iconSrc: "/icons/display/glass-bong.png",
        wide: true,
        contain: true,
        lightBg: true,
    },
    vaporizer: {
        description: "Trusted dry herb and concentrate vaporizers for every level.",
        iconSrc: "/icons/display/vaporizer-products.png",
        wide: true,
        contain: true,
    },
    kratom: {
        description: "Trusted kratom products with reliable quality and selection.",
        iconSrc: "/icons/display/kratom-products.png",
        wide: true,
        contain: true,
    },
    cbd: {
        description: "Premium CBD options selected for consistency, quality, and trust.",
        iconSrc: "/icons/display/cbd-products.png",
        wide: true,
        contain: true,
    },
    hookah: {
        description: "Premium hookah setups, bowls, coals, and flavor essentials.",
        iconSrc: "/icons/display/hookah-product.png",
        wide: true,
        contain: true,
        lightBg: true,
    },
};

const moreCategories: ProductCategory[] = [
    {
        name: "E-Juices",
        description: "Premium vape juice flavors from trusted brands with smooth performance.",
        iconSrc: "/icons/display/e-juices.png",
        wide: true,
        contain: true,
    },
    {
        name: "Mushroom",
        description: "Carefully sourced mushroom products with reliable quality and variety.",
        iconSrc: "/icons/display/mushroom-products-alt.png",
        wide: true,
        contain: true,
    },
    {
        name: "Edibles",
        description: "Hemp-derived edibles crafted for consistency, flavor, and quality.",
        iconSrc: "/icons/display/edibles-products.png",
        wide: true,
        contain: true,
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


function toDeviceId(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}


export default function ProductHighlights() {
    const [isVapeCatalogOpen, setIsVapeCatalogOpen] = useState(false);
    const [openFlavorDevice, setOpenFlavorDevice] = useState<string | null>(null);
    const [recentlyAddedKey, setRecentlyAddedKey] = useState<string | null>(null);
    const [searchHighlightedKey, setSearchHighlightedKey] = useState<string | null>(null);
    const [cartToast, setCartToast] = useState<string | null>(null);
    const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const catalogId = useMemo(() => "vape-flavor-catalog", []);
    const CART_STORAGE_KEY = "vapor-aura-cart";
    const SEARCH_TARGET_STORAGE_KEY = "vapor-aura-search-target";

    useEffect(() => {
        async function loadProducts() {
            try {
                const allStaticCategories: ProductCategory[] = Object.entries(categoryMeta).map(
                    ([key, meta]) => ({
                        name: key.charAt(0).toUpperCase() + key.slice(1),
                        ...meta,
                    })
                );
                const res = await fetch("/api/products");
                const data = await res.json();
                const products: ShopifyProduct[] = data?.data ?? [];
                setShopifyProducts(products);

                setCategories(allStaticCategories);
            } catch {
                setCategories(
                    Object.entries(categoryMeta).map(([key, meta]) => ({
                        name: key.charAt(0).toUpperCase() + key.slice(1),
                        ...meta,
                    }))
                );
            } finally {
                setIsLoading(false);
            }
        }
        loadProducts();
    }, []);

    const vapeProducts = useMemo(() => {
        return shopifyProducts.filter(p =>
            p.tags?.some(t => t.toLowerCase() === "vape")
        );
    }, [shopifyProducts]);

    function addToCart(product: ShopifyProduct) {
        const variant = product.variants.edges[0]?.node;
        if (!variant) return;

        const cartEntry = {
            product: product.title,
            variantId: variant.id,
            quantity: 1,
            unitPrice: parseFloat(variant.price.amount),
            image: product.images.edges[0]?.node.url ?? "",
        };

        try {
            const raw = window.localStorage.getItem(CART_STORAGE_KEY);
            const list = raw ? JSON.parse(raw) : [];
            const existingIndex = list.findIndex(
                (item: any) => item.variantId === cartEntry.variantId
            );

            if (existingIndex >= 0) {
                list[existingIndex].quantity += 1;
            } else {
                list.push(cartEntry);
            }

            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(list));
            window.dispatchEvent(new CustomEvent("vapor-aura-cart-updated"));
        } catch {
        }

        setCartToast(`${product.title} added to cart`);
        window.setTimeout(() => setCartToast(null), 1700);
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
                    setSearchHighlightedKey(prev => prev === key ? null : prev);
                }, 2200);
            }

            window.setTimeout(() => {
                const section = document.querySelector(
                    `[data-device-id="${toDeviceId(detail.device as string)}"]`
                ) as HTMLElement | null;
                section?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 170);
        };

        const onSearchSelect = (event: Event) => {
            applySearchTarget((event as CustomEvent<SearchTargetDetail>).detail);
        };

        window.addEventListener("vapor-aura-search-select", onSearchSelect as EventListener);

        try {
            const raw = window.sessionStorage.getItem(SEARCH_TARGET_STORAGE_KEY);
            if (raw) {
                applySearchTarget(JSON.parse(raw) as SearchTargetDetail);
                window.sessionStorage.removeItem(SEARCH_TARGET_STORAGE_KEY);
            }
        } catch { }

        return () => {
            window.removeEventListener("vapor-aura-search-select", onSearchSelect as EventListener);
        };
    }, []);

    function handleVapeCardPress() {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        if (isMobile) {
            setIsVapeCatalogOpen(prev => !prev);
            return;
        }
        setIsVapeCatalogOpen(true);
        window.setTimeout(() => {
            document.getElementById(catalogId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
    }

    function handleVapeCardTouch(event: TouchEvent<HTMLButtonElement>) {
        event.preventDefault();
        handleVapeCardPress();
    }

    // function renderVapeCatalog({ mobile, id }: { mobile: boolean; id?: string }) {
    //     return (
    //         <div
    //             id={id}
    //             className={`${styles.vapeCatalog} ${isVapeCatalogOpen ? styles.vapeCatalogOpen : ""} ${mobile ? styles.vapeCatalogMobileOnly : styles.vapeCatalogDesktopOnly}`}
    //             aria-hidden={!isVapeCatalogOpen}
    //         >
    //             <div className={styles.vapeCatalogInner}>
    //                 {vapeProducts.length === 0 && (
    //                     <p style={{ color: "#aaa", padding: "1rem" }}>No vape products available.</p>
    //                 )}
    //                 {vapeProducts.map((product) => {
    //                     const isOpen = openFlavorDevice === product.title;
    //                     const variant = product.variants.edges[0]?.node;
    //                     const price = parseFloat(variant?.price?.amount ?? "0");
    //                     const image = product.images.edges[0]?.node?.url;

    //                     return (
    //                         <div
    //                             key={product.id}
    //                             className={styles.flavorGroup}
    //                             data-device-id={toDeviceId(product.title)}
    //                         >
    //                             <button
    //                                 type="button"
    //                                 className={styles.flavorGroupButton}
    //                                 onClick={() => setOpenFlavorDevice(isOpen ? null : product.title)}
    //                                 aria-expanded={isOpen}
    //                             >
    //                                 <span>{product.title}</span>
    //                                 <span className={styles.flavorCaret} aria-hidden="true">
    //                                     {isOpen ? "−" : "+"}
    //                                 </span>
    //                             </button>

    //                             <div className={`${styles.flavorList} ${isOpen ? styles.flavorListOpen : ""}`}>
    //                                 <div className={styles.flavorRow}>
    //                                     {image && (
    //                                         <img
    //                                             src={image}
    //                                             alt={product.title}
    //                                             style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
    //                                         />
    //                                     )}
    //                                     <div>
    //                                         <p style={{ color: "#e3e3e3", fontSize: "0.85rem" }}>
    //                                             {product.descriptionHtml
    //                                                 ? <span dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
    //                                                 : "No description available."}
    //                                         </p>
    //                                     </div>
    //                                     <div className={styles.flavorActions}>
    //                                         <span className={styles.flavorPrice}>{toCurrency(price)}</span>
    //                                         <button
    //                                             type="button"
    //                                             className={styles.addToCartBtn}
    //                                             onClick={() => addToCart(product)}
    //                                             disabled={!variant?.availableForSale}
    //                                         >
    //                                             {variant?.availableForSale ? "Add to Cart" : "Out of Stock"}
    //                                         </button>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     );
    //                 })}
    //                 {cartToast && <p className={styles.cartToast}>{cartToast}</p>}
    //             </div>
    //         </div>
    //     );
    // }

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

                    {isLoading ? (
                        <p style={{ textAlign: "center", color: "#aaa" }}>Loading products...</p>
                    ) : (
                        <div className={styles.productGrid}>
                            {categories.map((category, index) => (
                                <AnimateIn key={category.name} delay={0.1 + index * 0.08}>
                                    <Link href={`/products/category/${category.name.toLowerCase()}`}>
                                        <div className={styles.productCard}>
                                            <div className={`${styles.iconWrap} ${category.wide ? styles.iconWrapWide : ""} ${category.lightBg ? styles.iconWrapContainLight : ""}`}>
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
                                        </div>
                                    </Link>
                                </AnimateIn>
                            ))}
                        </div>
                    )}

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
                                <Link href={`/products/category/${category.name.toLowerCase().replace(/\s*\/\s*/g, "-")}`}>
                                    <div className={styles.productCard}>
                                        <div className={`${styles.iconWrap} ${category.wide ? styles.iconWrapWide : ""} ${category.lightBg ? styles.iconWrapContainLight : ""}`}>
                                            {category.secondaryIconSrc ? (
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
                                            )}
                                        </div>
                                        <h3 className={styles.productTitle}>{category.name}</h3>
                                        <p className={styles.productText}>{category.description}</p>
                                    </div>
                                </Link>
                            </AnimateIn>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}