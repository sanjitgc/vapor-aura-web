"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface CartItem {
    product: string;
    quantity: number;
    unitPrice?: number;
    variantId?: string;
}

type DeliveryMethod = "standard" | "express";

const CART_STORAGE_KEY = "vapor-aura-cart";
const TAX_RATE = 0.0825;
const UNIT_PRICE = 24.99;
const DELIVERY_FEES: Record<DeliveryMethod, number> = {
    standard: 4.99,
    express: 9.99,
};

function toCurrency(v: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
}

function estimateDeliveryTime(method: DeliveryMethod) {
    const mins = method === "express" ? 25 : 45;
    return new Date(Date.now() + mins * 60_000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

function isZipAvailable(zip: string) {
    const c = zip.replace(/\D/g, "");
    if (c.length < 5) return true;
    return c.startsWith("75") || c.startsWith("76");
}

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [apartment, setApartment] = useState("");
    const [city, setCity] = useState("");
    const [stateRegion, setStateRegion] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [orderNotes, setOrderNotes] = useState("");

    const [zipUnavailable, setZipUnavailable] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

   useEffect(() => {
    try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        const normalized: CartItem[] = Array.isArray(parsed)
            ? parsed
                .filter((i): i is Partial<CartItem> => typeof i === "object" && i !== null)
                .map((i) => ({
                    product: typeof i.product === "string" ? i.product : "Disposable Vape",
                    quantity: typeof i.quantity === "number" && i.quantity > 0 ? i.quantity : 1,
                    unitPrice: typeof i.unitPrice === "number" && i.unitPrice > 0 ? i.unitPrice : UNIT_PRICE,
                    variantId: typeof i.variantId === "string" ? i.variantId : undefined,
                }))
            : [];

        setCartItems(normalized);
    } catch {
        setCartItems([]);
    }
}, []);

    const subtotal = useMemo(
        () => cartItems.reduce((s, i) => s + i.quantity * (i.unitPrice ?? UNIT_PRICE), 0),
        [cartItems]
    );
    const deliveryFee = DELIVERY_FEES[deliveryMethod];
    const tax = subtotal * TAX_RATE;
    const total = subtotal + deliveryFee + tax;

    async function handleCheckout() {
        setError("");

        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }
        if (!fullName.trim() || !email.trim() || !phone.trim() || !streetAddress.trim() || !city.trim() || !stateRegion.trim() || !zipCode.trim()) {
            setError("Please fill in all required delivery fields.");
            return;
        }
        if (!isZipAvailable(zipCode)) {
            setError("Sorry, delivery is not available in your area yet.");
            return;
        }

        const lines = cartItems
            .filter((i) => i.variantId)
            .map((i) => ({ variantId: i.variantId!, quantity: i.quantity }));

        if (lines.length === 0) {
            setError(
                "None of your cart items are linked to a Shopify product yet. Please contact us to complete your order."
            );
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lines, email: email.trim() }),
            });

            const data = await res.json();
            console.log("checkout response:", res.status, data);
            if (!res.ok || !data.checkoutUrl) {
                setError(data.error ?? "Failed to create checkout. Please try again.");
                return;
            }

            window.localStorage.removeItem("vapor-aura-cart");
            window.localStorage.removeItem("shopify-cart-id");
            window.localStorage.removeItem("shopify-checkout-url");
            window.dispatchEvent(new CustomEvent("vapor-aura-cart-updated"));
            await new Promise(r => setTimeout(r, 50));
            console.log("clear local storage");
            window.location.href = data.checkoutUrl;
        } catch {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className={styles.main}>
            <section className={styles.checkoutWrap}>
                <div className={styles.stepper}>
                    <span className={`${styles.step} ${styles.stepDone}`}>Cart</span>
                    <span className={styles.stepDivider}>→</span>
                    <span className={`${styles.step} ${styles.stepActive}`}>Checkout</span>
                    <span className={styles.stepDivider}>→</span>
                    <span className={styles.step}>Payment</span>
                </div>

                <div className={styles.grid}>
                    <section className={styles.card}>
                        <h1 className={styles.title}>Delivery Details</h1>
                        <p className={styles.subtitle}>
                            Fill in your details, then you'll be taken to Shopify's secure checkout to complete payment.
                        </p>

                        <div className={styles.formGrid}>
                            <label>
                                Full Name <span className={styles.req}>*</span>
                                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
                            </label>
                            <label>
                                Email Address <span className={styles.req}>*</span>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
                            </label>
                            <label>
                                Phone Number <span className={styles.req}>*</span>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(214) 555-0100" />
                            </label>
                            <label>
                                Street Address <span className={styles.req}>*</span>
                                <input value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="123 Main St" />
                            </label>
                            <label>
                                Apartment / Suite
                                <input value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="Apt 4B (optional)" />
                            </label>
                            <label>
                                City <span className={styles.req}>*</span>
                                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dallas" />
                            </label>
                            <label>
                                State <span className={styles.req}>*</span>
                                <input value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} placeholder="TX" />
                            </label>
                            <label>
                                ZIP Code <span className={styles.req}>*</span>
                                <input
                                    value={zipCode}
                                    onChange={(e) => {
                                        setZipCode(e.target.value);
                                        setZipUnavailable(!isZipAvailable(e.target.value));
                                    }}
                                    placeholder="75201"
                                />
                            </label>
                            <label className={styles.fullWidth}>
                                Delivery Instructions
                                <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} rows={3} placeholder="Leave at door, ring bell, etc." />
                            </label>
                        </div>

                        {zipUnavailable && (
                            <p className={styles.warning}>⚠ Delivery is not yet available in your area.</p>
                        )}

                        <h2 className={styles.sectionHeading}>Delivery Speed</h2>
                        <div className={styles.optionGroup}>
                            <button
                                type="button"
                                className={`${styles.optionBtn} ${deliveryMethod === "standard" ? styles.optionBtnActive : ""}`}
                                onClick={() => setDeliveryMethod("standard")}
                            >
                                <span className={styles.optionIcon}>🚚</span>
                                <span>
                                    <strong>Standard</strong>
                                    <small>30–60 min · {toCurrency(DELIVERY_FEES.standard)}</small>
                                </span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.optionBtn} ${deliveryMethod === "express" ? styles.optionBtnActive : ""}`}
                                onClick={() => setDeliveryMethod("express")}
                            >
                                <span className={styles.optionIcon}>⚡</span>
                                <span>
                                    <strong>Express</strong>
                                    <small>Priority · {toCurrency(DELIVERY_FEES.express)}</small>
                                </span>
                            </button>
                        </div>
                        <p className={styles.etaNote}>
                            Estimated delivery by <strong>{estimateDeliveryTime(deliveryMethod)}</strong>
                        </p>

                        <div className={styles.paymentNote}>
                            <span className={styles.paymentNoteIcon}>🔒</span>
                            <p>
                                Payment is processed securely by Shopify. After clicking below you'll be taken to
                                Shopify's checkout where you can pay with <strong>credit/debit card, Apple Pay, Google Pay,</strong> or <strong>Shop Pay</strong>.
                            </p>
                        </div>
                    </section>

                    <aside className={styles.summaryCard}>
                        <h2 className={styles.sectionHeading}>Order Summary</h2>

                        <div className={styles.summaryItems}>
                            {cartItems.length === 0 ? (
                                <p className={styles.empty}>No items in cart.</p>
                            ) : (
                                cartItems.map((item, i) => (
                                    <article key={`${item.product}-${i}`} className={styles.summaryItem}>
                                        <div className={styles.summaryItemLeft}>
                                            <p className={styles.summaryTitle}>{item.product}</p>
                                        </div>
                                        <div className={styles.summaryItemRight}>
                                            <p className={styles.summaryQty}>×{item.quantity}</p>
                                            <p className={styles.summaryPrice}>{toCurrency(item.quantity * (item.unitPrice ?? UNIT_PRICE))}</p>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>

                        <div className={styles.totals}>
                            <div className={styles.totalRow}><span>Subtotal</span><span>{toCurrency(subtotal)}</span></div>
                            <div className={styles.totalRow}><span>Delivery</span><span>{toCurrency(deliveryFee)}</span></div>
                            <div className={styles.totalRow}><span>Tax (8.25%)</span><span>{toCurrency(tax)}</span></div>
                            <div className={`${styles.totalRow} ${styles.totalLine}`}>
                                <span>Total</span><span>{toCurrency(total)}</span>
                            </div>
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <button
                            type="button"
                            className={styles.checkoutBtn}
                            onClick={handleCheckout}
                            disabled={loading || cartItems.length === 0}
                        >
                            {loading ? (
                                <span className={styles.btnSpinner} />
                            ) : (
                                <>Proceed to Payment →</>
                            )}
                        </button>

                        <p className={styles.secureNote}>
                            🔒 Secure checkout powered by Shopify
                        </p>

                        <Link href="/" className={styles.backLink}>← Continue Shopping</Link>
                    </aside>
                </div>
            </section>
        </main>
    );
}