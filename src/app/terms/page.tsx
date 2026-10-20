import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/common/LegalPage.module.css";

const CONTACT_EMAIL = "vaporaurasmokeshop@gmail.com";

export const metadata: Metadata = {
    title: "Terms of Use | Vapor Aura",
    description: "The terms for using vaporauratx.com, including our 21+ age requirement.",
    alternates: { canonical: "/terms" },
};

export default function TermsPage() {
    return (
        <main className={styles.main}>
            <article className={styles.article}>
                <h1 className={styles.title}>Terms of Use</h1>
                <p className={styles.updated}>Last updated October 20, 2026</p>

                <p>
                    These terms apply to your use of vaporauratx.com, run by Vapor Aura. By using the site you agree to
                    them. If you don&apos;t agree, please don&apos;t use the site.
                </p>

                <h2>You must be 21 or older</h2>
                <p>
                    The site and our products are for adults 21 and older only. Confirming your age when you enter the
                    site doesn&apos;t replace ID checks: a valid photo ID is required for every purchase in our stores
                    and on delivery.
                </p>

                <h2>Product information</h2>
                <p>
                    We try to keep product, flavor, price and stock information accurate, but it can change without
                    notice and may not match what&apos;s on the shelf at a given store. Call your store to confirm before
                    you visit. Product descriptions are for general information and are not medical advice. Our products
                    are not intended to diagnose, treat, cure or prevent any disease.
                </p>

                <h2>Orders and delivery</h2>
                <p>
                    Online orders placed through DoorDash are handled by DoorDash and are subject to its terms, fees and
                    policies. Availability on DoorDash may differ from what&apos;s in our stores. Any order placed through
                    this site is subject to our confirmation, age verification and the law.
                </p>

                <h2>Using the site</h2>
                <p>
                    Please don&apos;t misuse the site, including sending spam through the contact form, trying to break
                    or overload it, or copying its content for commercial use. The Vapor Aura name, logo and site design
                    belong to us. Product names and brands belong to their owners.
                </p>

                <h2>Links to other sites</h2>
                <p>
                    The site links to services such as DoorDash, Google Maps, Instagram and Facebook. We don&apos;t
                    control those sites and aren&apos;t responsible for them.
                </p>

                <h2>No warranty</h2>
                <p>
                    The site is provided as is. We do our best to keep it accurate and available, but we don&apos;t
                    promise it will always be error-free or online. To the extent the law allows, Vapor Aura isn&apos;t
                    liable for losses that come from using the site.
                </p>

                <h2>Governing law</h2>
                <p>These terms are governed by the laws of the State of Texas.</p>

                <h2>Privacy and changes</h2>
                <p>
                    Our <Link href="/privacy">Privacy Policy</Link> explains how we handle your information. We may
                    update these terms and will post the new version here with a new date.
                </p>

                <h2>Contact us</h2>
                <p>
                    Questions? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
            </article>
        </main>
    );
}
