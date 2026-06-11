import styles from "@/styles/policy.module.css";

async function getShopifyPrivacyPolicy() {
    const shop = process.env.SHOPIFY_STORE_DOMAIN!;
    const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;

    const res = await fetch(`https://${shop}/admin/api/2026-04/graphql.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": token,
        },
        body: JSON.stringify({
            query: `{
                shop {
                    privacyPolicy {
                        title
                        body
                    }
                }
            }`,
        }),
        next: { revalidate: 3600 },
    });

    const data = await res.json();
    return data?.data?.shop?.privacyPolicy ?? null;
}

export default async function PrivacyPolicy() {
    const policy = await getShopifyPrivacyPolicy();

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <span className={styles.badge}>Legal</span>
                <h1 className={styles.title}>Privacy Policy</h1>
                <p className={styles.meta}>
                    Last updated:{" "}
                    {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>

                {policy ? (
                    <div
                        className={styles.policyBody}
                        dangerouslySetInnerHTML={{ __html: policy.body }}
                    />
                ) : (
                    <>
                        <p className={styles.intro}>
                            Your privacy matters to us. This page outlines how Vapor Aura collects,
                            uses, and protects your personal information when you shop with us.
                        </p>

                        <hr className={styles.divider} />

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Information We Collect</h2>
                            <p className={styles.sectionText}>
                                When you place an order, we collect your name, email address, shipping address,
                                and phone number. This information is used solely to fulfill your order and
                                communicate with you about it.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Payment Information</h2>
                            <p className={styles.sectionText}>
                                All payment processing is handled securely by Shopify Payments.
                                We do not store your card details on our servers at any point.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Cookies</h2>
                            <p className={styles.sectionText}>
                                We use cookies to maintain your cart session and improve your browsing experience.
                                No personal data is sold to third parties.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Shopify Platform</h2>
                            <p className={styles.sectionText}>
                                This store is built on Shopify. For full details on data handling at the
                                platform level, please review Shopify's own privacy policy.
                            </p>
                            <div className={styles.shopifyNote}>
                                <p>
                                    Read Shopify's full privacy policy at{" "}
                                    
                                     <a   className={styles.link}
                                        href="https://www.shopify.com/legal/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        shopify.com/legal/privacy
                                    </a>
                                </p>
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Contact Us</h2>
                            <p className={styles.sectionText}>
                                For any privacy-related questions, email us at{" "}
                                <a className={styles.link} href="mailto:support@vapor-aura.com">
                                    support@vapor-aura.com
                                </a>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}