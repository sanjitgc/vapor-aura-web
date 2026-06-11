"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    descriptionHtml: string;
    tags: string[];
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
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
                title: string;
                price: {
                    amount: string;
                    currencyCode: string;
                };
                availableForSale: boolean;
            };
        }[];
    };
}

function toCurrency(value: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
function RelatedProducts({ currentHandle, tags }: { currentHandle: string; tags: string[] }) {
    const [related, setRelated] = useState<ShopifyProduct[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/products?limit=8");
                const data = await res.json();
                const all: ShopifyProduct[] = data?.data ?? [];
                const filtered = all
                    .filter((p: ShopifyProduct) => p.handle !== currentHandle)
                    .slice(0, 4);
                setRelated(filtered);
            } catch { }
        }
        load();
    }, [currentHandle]);

    if (related.length === 0) return null;

    return (
        <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>You Might Also Like</h2>
            <div className={styles.relatedGrid}>
                {related.map(p => {
                    const img = p.images.edges[0]?.node;
                    const price = parseFloat(p.variants.edges[0]?.node.price.amount ?? "0");
                    const inStock = p.variants.edges[0]?.node.availableForSale ?? false;
                    return (
                        <button
                            key={p.id}
                            type="button"
                            className={styles.relatedCard}
                            onClick={() => router.push(`/products/slug/${p.handle}`)}
                        >
                            <div className={styles.relatedImageWrap}>
                                {img ? (
                                    <img src={img.url} alt={img.altText || p.title} className={styles.relatedImage} />
                                ) : (
                                    <div className={styles.relatedNoImage}>No Image</div>
                                )}
                                {!inStock && (
                                    <span className={styles.relatedOutOfStock}>Out of Stock</span>
                                )}
                            </div>
                            <div className={styles.relatedInfo}>
                                <p className={styles.relatedName}>{p.title}</p>
                                <p className={styles.relatedPrice}>{toCurrency(price)}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [product, setProduct] = useState<ShopifyProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState<string | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);

    const CART_STORAGE_KEY = "vapor-aura-cart";

    useEffect(() => {
        async function loadProduct() {
            try {
                const res = await fetch(`/api/products/${slug}`);
                const data = await res.json();
                setProduct(data?.data ?? null);
            } catch {
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        }
        loadProduct();
    }, [slug]);

    async function addToCart() {
        if (!product) return;
        const variant = product.variants.edges[0]?.node;
        if (!variant) return;

        const cartEntry = {
            product: product.title,
            variantId: variant.id,
            quantity,
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
                list[existingIndex].quantity += quantity;
            } else {
                list.push(cartEntry);
            }
            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(list));
            window.dispatchEvent(new CustomEvent("vapor-aura-cart-updated"));
        } catch { }

        try {
            const existingCartId = window.localStorage.getItem('shopify-cart-id');

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartId: existingCartId || null,
                    items: [{ variantId: variant.id, quantity }]
                }),
            });

            const data = await response.json();
            if (data.success) {
                window.localStorage.setItem('shopify-cart-id', data.data.id);
                window.localStorage.setItem('shopify-checkout-url', data.data.checkoutUrl);
            }
        } catch { }

        setAddedToCart(true);
        setToast(`${product.title} added to cart!`);
        window.setTimeout(() => {
            setToast(null);
            setAddedToCart(false);
        }, 2000);
    }

    async function buyNow() {
        if (!product) return;
        const variant = product.variants.edges[0]?.node;
        if (!variant || !variant.availableForSale) return;

        try {
            setToast("Preparing checkout...");

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [{
                        variantId: variant.id,
                        quantity,
                    }]
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setToast("Failed to start checkout");
                return;
            }

            window.location.href = data.data.checkoutUrl;

        } catch {
            setToast("Something went wrong");
        }
    }

    if (isLoading) {
        return (
            <main className={styles.main}>
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner} />
                    <p>Loading product...</p>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className={styles.main}>
                <div className={styles.notFound}>
                    <h1>Product not found</h1>
                    <p>This product may have been removed or is unavailable.</p>
                    <button onClick={() => router.back()} className={styles.backBtn}>
                        ← Go Back
                    </button>
                </div>
            </main>
        );
    }

    const images = product.images.edges.map(e => e.node);
    const variant = product.variants.edges[0]?.node;
    const price = parseFloat(variant?.price?.amount ?? "0");
    const inStock = variant?.availableForSale ?? false;

    return (
        <main className={styles.main}>
            <button onClick={() => router.back()} className={styles.backBtn}>
                ← Back
            </button>

            <div className={styles.grid}>

                <div className={styles.imageSection}>
                    <div className={styles.mainImageWrap}>
                        {images[selectedImage] ? (
                            <img
                                src={images[selectedImage].url}
                                alt={images[selectedImage].altText || product.title}
                                className={styles.mainImage}
                            />
                        ) : (
                            <div className={styles.noImage}>No Image</div>
                        )}
                        {!inStock && (
                            <div className={styles.outOfStockBadge}>Out of Stock</div>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className={styles.thumbnails}>
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`${styles.thumbnail} ${selectedImage === i ? styles.thumbnailActive : ""}`}
                                    onClick={() => setSelectedImage(i)}
                                >
                                    <img src={img.url} alt={img.altText || product.title} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.infoSection}>

                    <div className={styles.tags}>
                        {product.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                    </div>

                    <h1 className={styles.title}>{product.title}</h1>

                    <p className={styles.price}>{toCurrency(price)}</p>

                    <div className={styles.stockStatus}>
                        <span className={`${styles.stockDot} ${inStock ? styles.inStockDot : styles.outOfStockDot}`} />
                        <span className={inStock ? styles.inStockText : styles.outOfStockText}>
                            {inStock ? "In Stock" : "Out of Stock"}
                        </span>
                    </div>

                    <div className={styles.deliveryBox}>
                        <span className={styles.deliveryIcon}>🛵</span>
                        <div>
                            <p className={styles.deliveryLabel}>Estimated Delivery</p>
                            <p className={styles.deliveryTime}>Today within 4–8 hours</p>
                            <p className={styles.deliveryNote}>Local delivery · Same day</p>
                        </div>
                    </div>

                    <div className={styles.quantityRow}>
                        <span className={styles.quantityLabel}>Quantity</span>
                        <div className={styles.quantityControl}>
                            <button
                                type="button"
                                className={styles.qtyBtn}
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                            >
                                −
                            </button>
                            <span className={styles.qtyValue}>{quantity}</span>
                            <button
                                type="button"
                                className={styles.qtyBtn}
                                onClick={() => setQuantity(q => q + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={`${styles.addToCartBtn} ${addedToCart ? styles.addedBtn : ""}`}
                            onClick={addToCart}
                            disabled={!inStock}
                        >
                            {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
                        </button>
                        <button
                            type="button"
                            className={styles.buyNowBtn}
                            onClick={buyNow}
                            disabled={!inStock}
                        >
                            Buy Now
                        </button>
                    </div>

                    <hr className={styles.divider} />

                    {product.descriptionHtml && (
                        <div className={styles.description}>
                            <h3 className={styles.descriptionTitle}>Product Details</h3>
                            <div
                                className={styles.descriptionContent}
                                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                            />
                        </div>
                    )}

                    <div className={styles.badges}>
                        <div className={styles.badge}>
                            <span>🔒</span>
                            <span>Secure Checkout</span>
                        </div>
                        <div className={styles.badge}>
                            <span>⚡</span>
                            <span>Fast Delivery</span>
                        </div>
                        <div className={styles.badge}>
                            <span>✅</span>
                            <span>Quality Guaranteed</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.refundStrip}>
                <span className={styles.refundStripIcon}>↩</span>
                <div>
                    <p className={styles.refundStripTitle}>Return & Refund Policy</p>
                    <p className={styles.refundStripText}>
                        <a href="/refund-policy" className={styles.refundStripLink}>
                            Learn more →
                        </a>
                    </p>
                </div>
            </div>

            <RelatedProducts currentHandle={slug} tags={product.tags} />
            {toast && <div className={styles.toast}>{toast}</div>}
        </main>
    );
}