import styles from "./Marquee.module.css";

const ITEMS = [
    "Disposables",
    "Pod systems",
    "E-liquid",
    "Glass",
    "Hookah",
    "Hemp flower",
    "Pre-rolls",
    "Kratom",
    "CBD",
    "Pet CBD",
    "Vaporizers",
    "Edibles",
    "Detox",
    "Lighters & torches",
    "Candles & incense",
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
