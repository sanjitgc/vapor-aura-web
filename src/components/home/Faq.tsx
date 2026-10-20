import { DOORDASH_URL, STORES } from "@/lib/stores";
import styles from "./Faq.module.css";

const sachse = STORES.find((s) => s.slug === "sachse")!;
const irving = STORES.find((s) => s.slug === "irving")!;

// Plain-text answers double as the FAQPage data Google reads, so keep them factual.
const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
    {
        q: "Do you check ID?",
        a: "Yes. Both stores sell only to adults 21 and over, and we check a valid photo ID for every purchase, no matter how old you look.",
    },
    {
        q: "Is the Irving store really open 24 hours?",
        a: `Yes. Vapor Aura Irving at ${irving.street}, Irving, TX ${irving.zip} is open 24 hours a day, 7 days a week. Call ${irving.phone}.`,
    },
    {
        q: "What are the Sachse store hours?",
        a: `Vapor Aura Sachse at ${sachse.street}, Sachse, TX ${sachse.zip} is open ${sachse.hoursSummary}. Call ${sachse.phone}.`,
    },
    {
        q: "Which disposable vapes do you carry?",
        a: "Popular disposables and pod systems including Geek Bar Pulse, Geek Bar Pulse X, Foger, Fifty Bar and Off-Stamp, in dozens of flavors. Stock changes quickly, so call your store to check a specific flavor.",
    },
    {
        q: "Do you sell hookah, glass, kratom and CBD?",
        a: "Yes. Along with vapes and e-liquid, we carry hookahs and hookah supplies, glass, dry herb and concentrate vaporizers, kratom, CBD, hemp edibles, and replacement coils and pods.",
    },
    {
        q: "Do you deliver?",
        a: "Yes, you can order from Vapor Aura on DoorDash for delivery. What's available on DoorDash can differ from what's in the store.",
        link: { href: DOORDASH_URL, label: "Order on DoorDash" },
    },
    {
        q: "Do you offer wholesale?",
        a: "Send us a message through the contact form below and choose Wholesale as the subject. We'll get back to you.",
    },
];

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
};

export default function Faq() {
    return (
        <section className={styles.section} aria-labelledby="faq-title">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className={styles.container}>
                <div className={styles.intro}>
                    <h2 id="faq-title" className={styles.title}>
                        Questions, answered
                    </h2>
                    <p className={styles.subtitle}>
                        Vapor Aura is a vape and smoke shop with two stores in the Dallas area: one in
                        Sachse on Highway 78 and one in Irving on Royal Lane, open around the clock.
                    </p>
                </div>
                <div className={styles.list}>
                    {FAQS.map((f) => (
                        <details key={f.q} className={styles.item}>
                            <summary className={styles.question}>{f.q}</summary>
                            <div className={styles.answer}>
                                <p>{f.a}</p>
                                {f.link && (
                                    <a href={f.link.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                        {f.link.label}
                                    </a>
                                )}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
