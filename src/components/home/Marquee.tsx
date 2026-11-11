import styles from "./Marquee.module.css";

const ITEMS = [
    "Disposables",
    "E-liquid",
    "ZYN",
    "Glass",
    "Hookah",
    "Shisha",
    "Kratom",
    "CBD",
    "Vaporizers",
    "510 batteries",
    "Grinders",
    "Torches & butane",
    "Gummies",
    "Drinks",
    "Pre-rolls",
    "Coils & pods",
];

// Decorative ticker of what's on the shelves. The same categories are listed in the
// products section right below, so it is hidden from screen readers.
export default function Marquee() {
    return (
        <div className={styles.marquee} aria-hidden="true">
            <div className={styles.track}>
                {[0, 1].map((copy) => (
                    <ul key={copy} className={styles.group}>
                        {ITEMS.map((item, i) => (
                            <li key={item} className={i % 2 ? styles.outline : undefined}>
                                {item}
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    );
}
