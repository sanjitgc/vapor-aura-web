"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { FaApplePay, FaCcMastercard, FaCcVisa, FaGooglePay } from "react-icons/fa6";

interface CartItem {
    product: string;
    brand: string;
    flavor: string;
    quantity: number;
    unitPrice?: number;
}

type PaymentMethod = "card" | "apple" | "google";
type DeliveryMethod = "standard" | "express";

interface ConfirmationState {
    orderNumber: string;
    deliveryAddress: string;
    estimatedDelivery: string;
}

const CART_STORAGE_KEY = "vapor-aura-cart";
const TAX_RATE = 0.0825;
const UNIT_PRICE = 24.99;
const DELIVERY_FEES: Record<DeliveryMethod, number> = {
    standard: 4.99,
    express: 9.99,
};

function toCurrency(value: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function estimateDeliveryTime(method: DeliveryMethod) {
    const leadMinutes = method === "express" ? 25 : 45;
    const target = new Date(Date.now() + leadMinutes * 60 * 1000);
    return target.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function isDeliveryZipAvailable(zip: string) {
    const clean = zip.replace(/\D/g, "");
    if (clean.length < 5) return true;
    return clean.startsWith("75") || clean.startsWith("76");
}

export default function CheckoutPage() {
    const isCheckoutMaintenance = true;
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
    const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null);
    const [error, setError] = useState("");

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [apartment, setApartment] = useState("");
    const [city, setCity] = useState("");
    const [stateRegion, setStateRegion] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [orderNotes, setOrderNotes] = useState("");
    const [deliveryUnavailable, setDeliveryUnavailable] = useState(false);

    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardName, setCardName] = useState("");

    useEffect(() => {
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
                          unitPrice: typeof item.unitPrice === "number" && item.unitPrice > 0 ? item.unitPrice : UNIT_PRICE,
                      }))
                : [];
            setCartItems(normalized);
        } catch {
            setCartItems([]);
        }
    }, []);

    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity * (item.unitPrice ?? UNIT_PRICE), 0), [cartItems]);
    const deliveryFee = useMemo(() => DELIVERY_FEES[deliveryMethod], [deliveryMethod]);
    const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
    const total = useMemo(() => subtotal + deliveryFee + tax, [subtotal, deliveryFee, tax]);

    function placeOrder() {
        if (isCheckoutMaintenance) {
            setError("Checkout is temporarily unavailable while online payments are under maintenance.");
            return;
        }

        setError("");

        if (cartItems.length === 0) {
            setError("Your cart is empty. Add items before checkout.");
            return;
        }

        if (
            !fullName.trim() ||
            !email.trim() ||
            !phone.trim() ||
            !streetAddress.trim() ||
            !city.trim() ||
            !stateRegion.trim() ||
            !zipCode.trim()
        ) {
            setError("Please complete all required delivery details.");
            return;
        }

        if (!isDeliveryZipAvailable(zipCode)) {
            setError("Sorry, delivery is not available in your area yet.");
            return;
        }

        if (paymentMethod === "card") {
            if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim() || !cardName.trim()) {
                setError("Please complete all card fields.");
                return;
            }
        }

        const orderNumber = `VA-${Math.floor(Date.now() / 1000).toString(36).toUpperCase()}`;
        const estimatedDelivery = estimateDeliveryTime(deliveryMethod);
        const aptPart = apartment.trim() ? `, Apt/Suite ${apartment.trim()}` : "";
        const deliveryAddress = `${streetAddress.trim()}${aptPart}, ${city.trim()}, ${stateRegion.trim()} ${zipCode.trim()}`;

        setConfirmation({
            orderNumber,
            deliveryAddress,
            estimatedDelivery,
        });

        window.localStorage.removeItem(CART_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent("vapor-aura-cart-updated"));
    }

    const stepCheckoutClass = confirmation ? styles.stepDone : styles.stepActive;
    const stepConfirmationClass = confirmation ? styles.stepActive : "";

    return (
        <main className={styles.main}>
            <section className={styles.checkoutWrap}>
                <div className={styles.stepper}>
                    <span className={`${styles.step} ${styles.stepDone}`}>Cart</span>
                    <span className={styles.stepDivider}>→</span>
                    <span className={`${styles.step} ${stepCheckoutClass}`}>Checkout</span>
                    <span className={styles.stepDivider}>→</span>
                    <span className={`${styles.step} ${stepConfirmationClass}`}>Confirmation</span>
                </div>

                {!confirmation ? (
                    <div className={styles.grid}>
                        <section className={styles.card}>
                            <h1 className={styles.title}>Checkout</h1>
                            <p className={styles.subtitle}>Complete your details and payment preference to place your order.</p>

                            <div className={styles.formGrid}>
                                <label>
                                    Full Name
                                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                </label>
                                <label>
                                    Email Address
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </label>
                                <label>
                                    Phone Number
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                </label>
                                <label>
                                    Street Address
                                    <input value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} required />
                                </label>
                                <label>
                                    Apartment / Suite (optional)
                                    <input value={apartment} onChange={(e) => setApartment(e.target.value)} />
                                </label>
                                <label>
                                    City
                                    <input value={city} onChange={(e) => setCity(e.target.value)} required />
                                </label>
                                <label>
                                    State
                                    <input value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} required />
                                </label>
                                <label>
                                    ZIP Code
                                    <input
                                        value={zipCode}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setZipCode(value);
                                            setDeliveryUnavailable(!isDeliveryZipAvailable(value));
                                        }}
                                        placeholder="75000"
                                        required
                                    />
                                </label>
                                <label>
                                    Delivery Instructions (optional)
                                    <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} rows={3} />
                                </label>
                            </div>
                            {deliveryUnavailable && (
                                <p className={styles.error}>Sorry, delivery is not available in your area yet.</p>
                            )}

                            <h2 className={styles.sectionHeading}>Delivery Method</h2>
                            <div className={styles.paymentMethods}>
                                <button type="button" className={`${styles.payBtn} ${deliveryMethod === "standard" ? styles.payBtnActive : ""}`} onClick={() => setDeliveryMethod("standard")}>
                                    Standard Delivery (30-60 minutes)
                                </button>
                                <button type="button" className={`${styles.payBtn} ${deliveryMethod === "express" ? styles.payBtnActive : ""}`} onClick={() => setDeliveryMethod("express")}>
                                    Express Delivery (priority)
                                </button>
                            </div>
                            <p className={styles.subtitle}>Estimated delivery by {estimateDeliveryTime(deliveryMethod)}</p>

                            <h2 className={styles.sectionHeading}>Payment Method</h2>
                            <div className={styles.paymentMethods}>
                                <button type="button" className={`${styles.payBtn} ${paymentMethod === "card" ? styles.payBtnActive : ""}`} onClick={() => setPaymentMethod("card")}>
                                    <FaCcVisa /> <FaCcMastercard /> Credit / Debit Card
                                </button>
                                <button type="button" className={`${styles.payBtn} ${paymentMethod === "apple" ? styles.payBtnActive : ""}`} onClick={() => setPaymentMethod("apple")}>
                                    <FaApplePay /> Apple Pay
                                </button>
                                <button type="button" className={`${styles.payBtn} ${paymentMethod === "google" ? styles.payBtnActive : ""}`} onClick={() => setPaymentMethod("google")}>
                                    <FaGooglePay /> Google Pay
                                </button>
                            </div>

                            {paymentMethod === "card" && (
                                <div className={styles.cardFields}>
                                    <label>
                                        Card Number
                                        <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" />
                                    </label>
                                    <label>
                                        Expiration Date
                                        <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" />
                                    </label>
                                    <label>
                                        CVV
                                        <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="123" />
                                    </label>
                                    <label>
                                        Name on Card
                                        <input value={cardName} onChange={(e) => setCardName(e.target.value)} />
                                    </label>
                                </div>
                            )}

                            {error && <p className={styles.error}>{error}</p>}
                        </section>

                        <aside className={styles.summaryCard}>
                            <h2 className={styles.sectionHeading}>Order Summary</h2>
                            <div className={styles.summaryItems}>
                                {cartItems.length === 0 ? (
                                    <p className={styles.empty}>No items in cart.</p>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <article key={`${item.brand}-${item.flavor}-${index}`} className={styles.summaryItem}>
                                            <p className={styles.summaryTitle}>{item.product}</p>
                                            <p>Brand: {item.brand}</p>
                                            <p>Flavor: {item.flavor}</p>
                                            <p>Qty: {item.quantity}</p>
                                        </article>
                                    ))
                                )}
                            </div>

                            <div className={styles.totals}>
                                <p><span>Subtotal</span><span>{toCurrency(subtotal)}</span></p>
                                <p><span>Delivery Fee</span><span>{toCurrency(deliveryFee)}</span></p>
                                <p><span>Tax</span><span>{toCurrency(tax)}</span></p>
                                <p className={styles.totalLine}><span>Total</span><span>{toCurrency(total)}</span></p>
                            </div>

                            <button
                                type="button"
                                className={`${styles.placeOrderBtn} ${isCheckoutMaintenance ? styles.placeOrderBtnDisabled : ""}`}
                                onClick={placeOrder}
                                disabled={isCheckoutMaintenance}
                            >
                                Place Order
                            </button>
                        </aside>
                    </div>
                ) : (
                    <section className={`${styles.card} ${styles.confirmationCard}`}>
                        <h1 className={styles.title}>Order Confirmed</h1>
                        <p className={styles.confirmationText}>
                            Thank you for your order. Your delivery is on the way.
                        </p>
                        <div className={styles.confirmationMeta}>
                            <p><strong>Order Number:</strong> {confirmation.orderNumber}</p>
                            <p><strong>Delivery Address:</strong> {confirmation.deliveryAddress}</p>
                            <p><strong>Estimated Delivery:</strong> {confirmation.estimatedDelivery}</p>
                        </div>
                        <Link href="/#home" className={styles.backHomeBtn}>
                            Return Home
                        </Link>
                    </section>
                )}
            </section>
            {isCheckoutMaintenance && (
                <div className={styles.maintenanceModal} role="dialog" aria-modal="true" aria-labelledby="maintenance-title">
                    <div className={styles.maintenanceBox}>
                        <h2 id="maintenance-title">Checkout Temporarily Unavailable</h2>
                        <p>
                            Online payments are currently under maintenance.
                            <br />
                            Please do not complete payment at this time.
                            <br />
                            Our ordering system will be available soon.
                        </p>
                        <button type="button" onClick={() => { window.location.href = "/"; }}>
                            Return to Home
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
