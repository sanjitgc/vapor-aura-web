import type { Metadata } from "next";
import styles from "@/components/common/LegalPage.module.css";
import { STORES } from "@/lib/stores";
import { GA_ID } from "@/lib/analytics";

const CONTACT_EMAIL = "vaporaurasmokeshop@gmail.com";

// The analytics paragraphs show only when Google Analytics is switched on (src/lib/analytics.ts)
const USES_ANALYTICS = Boolean(GA_ID);

export const metadata: Metadata = {
    title: "Privacy Policy | Vapor Aura",
    description: "How Vapor Aura handles the information you share through vaporauratx.com.",
    alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
    return (
        <main className={styles.main}>
            <article className={styles.article}>
                <h1 className={styles.title}>Privacy policy</h1>
                <p className={styles.updated}>Last updated October 27, 2026</p>

                <p>
                    This policy explains what information Vapor Aura (&quot;we&quot;, &quot;us&quot;) collects through
                    vaporauratx.com, how we use it, and the choices you have. It covers this website only. Our stores
                    in Sachse and Irving, Texas, and services run by other companies (such as DoorDash) have their own
                    practices.
                </p>

                <h2>What we collect</h2>
                <ul>
                    <li>
                        <strong>Contact form messages.</strong> When you send us a message, we receive your name, email
                        address, phone number (if you give it), the store and subject you pick, and your message.
                    </li>
                    <li>
                        <strong>Information saved in your browser.</strong> The site remembers that you confirmed you
                        are 21 or older and keeps your cart in your browser&apos;s local storage. This stays on your
                        device; we don&apos;t receive it.
                    </li>
                    {USES_ANALYTICS && (
                        <li>
                            <strong>How the site is used.</strong> We use Google Analytics to understand which pages
                            people visit and when they tap to call a store, get directions or order on DoorDash. Google
                            Analytics uses cookies and collects information such as your approximate location, device
                            and browser. It doesn&apos;t give us your name or contact details. You can block it with your
                            browser&apos;s cookie settings or Google&apos;s opt-out add-on at
                            tools.google.com/dlpage/gaoptout.
                        </li>
                    )}
                    <li>
                        <strong>Basic technical data.</strong> Like most websites, our hosting provider records standard
                        server logs (such as IP address, browser type and pages requested) to keep the site running and
                        secure.
                    </li>
                </ul>

                <h2>How we use it</h2>
                <ul>
                    <li>To read and reply to your message, and to route it to the right store.</li>
                    <li>To keep the site working, prevent spam and abuse, and fix problems.</li>
                    <li>To meet legal requirements, including age restrictions on the products we sell.</li>
                </ul>
                <p>
                    We don&apos;t sell your personal information, and we don&apos;t add you to marketing emails or
                    texts from the contact form.
                </p>

                <h2>Who we share it with</h2>
                <p>We use a few service providers to run the site. They handle data only to provide their service to us:</p>
                <ul>
                    <li>Vercel, which hosts the website.</li>
                    <li>MongoDB, which stores contact form messages.</li>
                    <li>Resend, which delivers contact form messages to our inbox by email.</li>
                    <li>Upstash, which helps limit repeated or automated form submissions.</li>
                    <li>Google Maps, whose maps are embedded on our store and location pages.</li>
                    {USES_ANALYTICS && <li>Google Analytics, which measures how the site is used.</li>}
                </ul>
                <p>
                    Links to DoorDash, Instagram, Facebook and Google take you to those companies&apos; own sites, where
                    their privacy policies apply. We may also share information if the law requires it.
                </p>

                <h2>How long we keep it</h2>
                <p>
                    We keep contact form messages only as long as we need them to respond and keep reasonable records,
                    and then delete them.
                </p>

                <h2>Age requirement</h2>
                <p>
                    This website and our products are for adults 21 and older. We don&apos;t knowingly collect
                    information from anyone under 21. If you believe someone under 21 has sent us information, contact
                    us and we&apos;ll delete it.
                </p>

                <h2>Your choices</h2>
                <p>
                    You can ask us what information we have about you, or ask us to correct or delete it, by emailing{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You can clear the information saved in your
                    browser at any time through your browser settings.
                </p>

                <h2>Changes</h2>
                <p>If we change this policy, we&apos;ll post the new version here and update the date above.</p>

                <h2>Contact us</h2>
                <p>
                    Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or call{" "}
                    {STORES.map((s, i) => (
                        <span key={s.slug}>
                            {i > 0 && " or "}
                            {s.city} at <a href={s.tel}>{s.phone}</a>
                        </span>
                    ))}
                    .
                </p>
            </article>
        </main>
    );
}
