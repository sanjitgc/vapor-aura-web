"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";

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

function toCurrency(value: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function CategoryPage() {
    const params = useParams();
    const category = params.category as string;
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cartToast, setCartToast] = useState<string | null>(null);
    const CART_STORAGE_KEY = "vapor-aura-cart";

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetch(`/api/products?category=${category}`);
                const data = await res.json();
                setProducts(data?.data ?? []);
            } catch {
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        }
        loadProducts();
    }, [category]);

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
        } catch { }

        setCartToast(`${product.title} added to cart`);
        window.setTimeout(() => setCartToast(null), 1700);
    }

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </h1>
                <p className={styles.subtitle}>
                    Browse our selection of {category} products
                </p>
            </div>

            {isLoading ? (
                <p className={styles.loading}>Loading products...</p>
            ) : products.length === 0 ? (
                <p className={styles.empty}>No products found in this category.</p>
            ) : (
                <div className={styles.grid}>
                    {products.map((product) => {
                        const variant = product.variants.edges[0]?.node;
                        const price = parseFloat(variant?.price?.amount ?? "0");
                        const image = product.images.edges[0]?.node?.url;
                        const inStock = variant?.availableForSale ?? false;

                        return (
                            <Link href={`/products/slug/${product.handle}`} key={product.id}>
                            <div className={styles.productCard}>
                                <div className={styles.imageWrap}>
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={product.title}
                                            className={styles.productImage}
                                        />
                                    ) : (
                                        <div className={styles.noImage}>No Image</div>
                                    )}
                                </div>
                                <div className={styles.productInfo}>
                                    <h2 className={styles.productTitle}>{product.title}</h2>
                                    {product.descriptionHtml && (
                                        <div
                                            className={styles.productDescription}
                                            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                                        />
                                    )}
                                    <div className={styles.productFooter}>
                                        <span className={styles.price}>{toCurrency(price)}</span>
                                        <button
                                            type="button"
                                            className={`${styles.cartBtn} ${!inStock ? styles.cartBtnDisabled : ""}`}
                                            onClick={() => addToCart(product)}
                                            disabled={!inStock}
                                        >
                                            {inStock ? "Add to Cart" : "Out of Stock"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {cartToast && <p className={styles.toast}>{cartToast}</p>}
        </main>
    );
}