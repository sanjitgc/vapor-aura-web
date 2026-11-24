import { FAQS } from "@/lib/faqs";
import styles from "./Faq.module.css";

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
                <div className={styles.intro} data-reveal="">
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
                        <details key={f.q} className={styles.item} name="faq" data-typing="" data-reveal="">
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
