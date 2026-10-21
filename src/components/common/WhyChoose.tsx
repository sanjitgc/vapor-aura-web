import styles from "./WhyChoose.module.css";
import { STORES } from "@/lib/stores";

const sachse = STORES.find((s) => s.slug === "sachse")!;

// Specific, true points only. Update these if hours or policies change.
const reasons = [
    {
        title: "Open late, every day",
        description: `Irving is open 24 hours, 7 days a week. Sachse is open ${sachse.hoursSummary}.`,
    },
    {
        title: "Staff who know the products",
        description:
            "We'll compare devices, explain flavors and nicotine strengths, and match the right coil or pod to your device.",
    },
    {
        title: "Everything in one stop",
        description: "Vapes, e-liquid, glass, hookah, vaporizers, hemp flower, kratom, CBD, edibles, detox and more.",
    },
    {
        title: "Clean stores, fair prices",
        description: "Well-organized shops and fair prices, both mentioned often in our Google reviews.",
    },
    {
        title: "21+ only, ID checked",
        description: "We check a valid photo ID on every sale, every time.",
    },
];

export default function WhyChoose() {
    return (
        <section className={styles.section} aria-labelledby="why-choose-vapor-aura">
            <div className={styles.container}>
                <div className={styles.intro}>
                    <h2 id="why-choose-vapor-aura" className={styles.title}>
                        Why choose Vapor Aura?
                    </h2>
                    <p className={styles.subtitle}>
                        Two stores, late hours, a full range of products and people who&apos;ll help you find the
                        right thing.
                    </p>
                </div>

                <ul className={styles.list}>
                    {reasons.map((reason) => (
                        <li key={reason.title} className={styles.item}>
                            <h3 className={styles.itemTitle}>{reason.title}</h3>
                            <p className={styles.itemText}>{reason.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
