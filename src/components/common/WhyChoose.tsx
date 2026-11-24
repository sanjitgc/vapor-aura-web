import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import styles from "./WhyChoose.module.css";
import { STORES } from "@/lib/stores";
import { STORE_PHOTOS } from "@/lib/storePhotos";

const sachse = STORES.find((s) => s.slug === "sachse")!;

// Simple line icons, drawn in the text color
const icon = (path: ReactNode) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {path}
    </svg>
);

// Specific, true points only. Update these if hours or policies change.
const reasons = [
    {
        title: "Open late, every day",
        description: `Irving is open 24 hours, 7 days a week. Sachse is open ${sachse.hoursSummary}.`,
        icon: icon(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
    },
    {
        title: "Staff who know the products",
        description:
            "We'll compare devices, explain flavors and nicotine strengths, and match the right coil or pod to your device. If we don't have what you're after, we can order it in for you.",
        icon: icon(<path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-7.5L7 20v-3.5H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5Z" />),
    },
    {
        title: "Everything in one stop",
        description: "Vapes, e-liquid, ZYN, glass, hookah, vaporizers, kratom, CBD, grinders, torches, butane and more.",
        icon: icon(<><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>),
    },
    {
        title: "Clean stores, fair prices",
        description: "Well-organized shops and fair prices, both mentioned often in our Google reviews.",
        icon: icon(<><path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.3 7.3a1 1 0 0 1-1.4 0L3.5 12.2Z" /><circle cx="8" cy="8" r="1.3" /></>),
    },
    {
        title: "21+ only, ID checked",
        description: "We check a valid photo ID on every sale, every time.",
        icon: icon(<><rect x="3" y="5.5" width="18" height="13" rx="1.8" /><circle cx="8.5" cy="11" r="2" /><path d="M5.5 15.5c.6-1.3 1.7-2 3-2s2.4.7 3 2M14 10h4M14 13.5h3" /></>),
    },
];

const storefronts = [
    { photo: STORE_PHOTOS.sachse?.storefront, caption: "Sachse, on Highway 78" },
    { photo: STORE_PHOTOS.irving?.storefront, caption: "Irving, open 24 hours" },
].filter((s) => s.photo);

export default function WhyChoose() {
    return (
        <section className={styles.section} aria-labelledby="why-choose-vapor-aura">
            <div className={styles.container}>
                <div className={styles.intro} data-reveal="">
                    <h2 id="why-choose-vapor-aura" className={styles.title}>
                        Why choose Vapor Aura?
                    </h2>
                    <p className={styles.subtitle}>
                        Two stores, late hours, a full range of products and people who&apos;ll help you find the
                        right thing.
                    </p>

                    {storefronts.length > 0 && (
                        <div className={styles.storefronts}>
                            {storefronts.map(({ photo, caption }) => (
                                <figure key={photo!.id} className={styles.storefront}>
                                    <div className={styles.frame}>
                                        <Image
                                            src={photo!.src}
                                            alt={photo!.alt}
                                            fill
                                            sizes="(max-width: 860px) 46vw, 280px"
                                            style={{ objectPosition: "50% 30%" }}
                                        />
                                    </div>
                                    <figcaption>{caption}</figcaption>
                                </figure>
                            ))}
                        </div>
                    )}
                </div>

                <ul className={styles.list}>
                    {reasons.map((reason, i) => (
                        <li key={reason.title} className={styles.item} data-rule="" data-reveal="" style={{ "--reveal-i": i % 4 } as CSSProperties}>
                            <span className={styles.icon}>{reason.icon}</span>
                            <div>
                                <h3 className={styles.itemTitle}>{reason.title}</h3>
                                <p className={styles.itemText}>{reason.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
