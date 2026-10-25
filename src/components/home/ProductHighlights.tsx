import styles from "./ProductHighlights.module.css";

interface ProductCategory {
    name: string;
    description: string;
}

// The main shelves: two rows of four on desktop.
const categories: ProductCategory[] = [
    {
        name: "Vape",
        description: "Disposables, pod systems and devices from Geek Bar, Foger, Fifty Bar and more.",
    },
    {
        name: "E-Juices",
        description: "Freebase and nicotine salt e-liquids from Naked and more.",
    },
    {
        name: "Glass",
        description: "Water pipes, bubblers, hand pipes and rigs, plus bowls and cleaners.",
    },
    {
        name: "Vaporizer",
        description: "Dry herb and concentrate vaporizers, from pens to premium portables.",
    },
    {
        name: "Hookah",
        description: "Hookahs, bowls, hoses, coals and shisha, plus spare parts.",
    },
    {
        name: "Flower & pre-rolls",
        description: "Hemp flower and pre-rolls in a range of strains, plus rolling trays.",
    },
    {
        name: "Kratom",
        description: "Kratom capsules, powders, tablets and shots from established brands.",
    },
    {
        name: "CBD",
        description: "Tinctures, gummies, capsules and topicals in a range of strengths.",
    },
];

const moreCategories: ProductCategory[] = [
    {
        name: "Edibles",
        description: "Hemp-derived gummies, chocolates and treats.",
    },
    {
        name: "Mushroom",
        description: "Mushroom gummies and more in a variety of flavors.",
    },
    {
        name: "Detox",
        description: "Detox drinks in popular flavors, plus other cleanse products.",
    },
    {
        name: "CBD for pets",
        description: "CBD treats and tinctures made just for pets.",
    },
    {
        name: "Coils / Pods",
        description: "Replacement coils and pods for SMOK, GeekVape and more.",
    },
    {
        name: "Lighters & torches",
        description: "Pocket and torch lighters, plus butane and Zippo fluid for refills.",
    },
    {
        name: "Candles & incense",
        description: "Scented candles and incense, plus air fresheners and odor eliminators.",
    },
    {
        name: "And more",
        description: "New products arrive all the time. Stop by or call either store to ask.",
    },
];

// Keep hyphenated words like "pre-rolls" and "e-liquids" on one line
function keepHyphenated(text: string) {
    return text.split(/(\S+-\S+)/g).map((part, i) =>
        i % 2 ? (
            <span key={i} className={styles.nowrap}>
                {part}
            </span>
        ) : (
            part
        ),
    );
}

// What's on the shelves in our stores. Display only; nothing here is sold online.
export default function ProductHighlights() {
    return (
        <section id="products" className={styles.section} aria-labelledby="product-hints-title">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 id="product-hints-title" className={styles.title}>
                        What we carry
                    </h2>
                    <p className={styles.subtitle}>
                        What you&apos;ll find in our Sachse and Irving stores. Not sure what fits you? Ask our staff,
                        and call ahead if you&apos;re after something specific.
                    </p>
                </div>

                <ul className={styles.list}>
                    {categories.map((category) => (
                        <li key={category.name} className={styles.item}>
                            <h3 className={styles.itemTitle}>{keepHyphenated(category.name)}</h3>
                            <p className={styles.itemText}>{keepHyphenated(category.description)}</p>
                        </li>
                    ))}
                </ul>

                <div className={styles.more}>
                    <h3 className={styles.moreTitle}>Also on the shelves</h3>
                    <ul className={`${styles.list} ${styles.listCompact}`}>
                        {moreCategories.map((category) => (
                            <li key={category.name} className={styles.item}>
                                <h4 className={styles.itemTitle}>{keepHyphenated(category.name)}</h4>
                                <p className={styles.itemText}>{keepHyphenated(category.description)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
