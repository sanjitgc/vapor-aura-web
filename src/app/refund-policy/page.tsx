import styles from "@/styles/policy.module.css";

export default function RefundPolicy() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <span className={styles.badge}>Legal</span>
                <h1 className={styles.title}>Refund Policy</h1>
                <p className={styles.meta}>
                    Last updated:{" "}
                    {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>

                <p className={styles.intro}>
                    At Vapor Aura, we want you to be completely satisfied with your purchase.
                    If you are not satisfied, we are here to help. Please read this policy carefully before making a purchase.
                </p>

                <hr className={styles.divider} />

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Eligibility for Refunds</h2>
                    <p className={styles.sectionText}>
                        You may request a refund within <strong style={{ color: "#fff" }}>7 days</strong> of receiving your order.
                        To be eligible, items must be unused, unopened, and in their original packaging.
                        Any item that has been opened, used, or tampered with will not be accepted for a refund.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Non-Refundable Items & Charges</h2>
                    <p className={styles.sectionText}>The following are strictly non-refundable under any circumstances:</p>
                    <ul className={styles.list}>
                        <li><strong style={{ color: "#fff" }}>Tips</strong> — Any tip added at checkout is a voluntary gratuity and will not be refunded.</li>
                        <li><strong style={{ color: "#fff" }}>Shipping charges</strong> — The cost of shipping is non-refundable as the service has already been rendered.</li>
                        <li><strong style={{ color: "#fff" }}>Opened or used products</strong> — For health and safety reasons, we cannot accept returns on opened vape products.</li>
                        <li><strong style={{ color: "#fff" }}>Sale or clearance items</strong> — All sale items are final sale and not eligible for return or refund.</li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Handling Fee</h2>
                    <p className={styles.sectionText}>
                        All approved refunds are subject to a <strong style={{ color: "#fff" }}>10% handling fee</strong> deducted
                        from the refundable item subtotal. This covers the cost of processing, restocking, and administrative handling.
                    </p>
                    <div className={styles.highlight}>
                        <strong>Example:</strong> If your eligible item subtotal is $50.00, you would receive a refund of{" "}
                        <strong>$45.00</strong> after the 10% handling fee is deducted.
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. How to Request a Refund</h2>
                    <p className={styles.sectionText}>
                        To initiate a refund, please contact us at{" "}
                        <a className={styles.link} href="mailto:support@vapor-aura.com">support@vapor-aura.com</a>{" "}
                        with the following information:
                    </p>
                    <ul className={styles.list}>
                        <li>Your order number (e.g. #1001)</li>
                        <li>The item(s) you wish to return</li>
                        <li>The reason for your refund request</li>
                        <li>Photos of the item if it arrived damaged or incorrect</li>
                    </ul>
                    <p className={styles.sectionText} style={{ marginTop: "0.75rem" }}>
                        Our team will review your request and respond within <strong style={{ color: "#fff" }}>2–3 business days</strong>.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. Damaged or Incorrect Items</h2>
                    <p className={styles.sectionText}>
                        If you received a damaged, defective, or incorrect item, please contact us within{" "}
                        <strong style={{ color: "#fff" }}>48 hours</strong> of delivery with photos of the item and packaging.
                        In these cases, the 10% handling fee will be waived and we will either send a replacement or issue a full refund.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>6. Refund Processing Time</h2>
                    <p className={styles.sectionText}>
                        Once approved, refunds are processed within <strong style={{ color: "#fff" }}>5–7 business days</strong> back
                        to your original payment method. Depending on your bank or card issuer, it may take additional time for the
                        funds to appear in your account.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>7. Order Cancellations</h2>
                    <p className={styles.sectionText}>
                        If you wish to cancel an order, please contact us immediately. Orders that have already been fulfilled
                        or shipped cannot be cancelled and must go through the standard refund process above.
                    </p>
                </div>

                <hr className={styles.divider} />

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>8. Contact Us</h2>
                    <p className={styles.sectionText}>
                        If you have any questions about this policy, please reach out to us at{" "}
                        <a className={styles.link} href="mailto:support@vapor-aura.com">support@vapor-aura.com</a>.
                        We are happy to help and will do our best to resolve any issues promptly.
                    </p>
                </div>
            </div>
        </div>
    );
}