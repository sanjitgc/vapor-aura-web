import styles from "./ProductHighlights.module.css";
import { CATEGORIES, MORE_CATEGORIES } from "@/lib/catalog";

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

interface ProductHighlightsProps {
    // "section" = a part of the home page with its own heading.
    // "page" = the body of /products, where the page already has the H1, so headings move up a level.
    variant?: "section" | "page";
}

// What's on the shelves in our stores. Display only; nothing here is sold online.
export default function ProductHighlights({ variant = "section" }: ProductHighlightsProps) {
    const isPage = variant === "page";
    const ItemHeading = isPage ? "h2" : "h3";
    const MoreHeading = isPage ? "h2" : "h3";
    const MoreItemHeading = isPage ? "h3" : "h4";

    return (
        <section
            id={isPage ? undefined : "products"}
            className={`${styles.section} ${isPage ? styles.sectionPage : ""}`}
            aria-labelledby={isPage ? undefined : "product-hints-title"}
            aria-label={isPage ? "Product categories" : undefined}
        >
            <div className={styles.container}>
                {!isPage && (
                    <div className={styles.header}>
                        <h2 id="product-hints-title" className={styles.title}>
                            What we carry
                        </h2>
                        <p className={styles.subtitle}>
                            What you&apos;ll find in our Sachse and Irving stores. Not sure what fits you? Ask our
                            staff, and call ahead if you&apos;re after something specific.
                        </p>
                    </div>
                )}

                <ul className={styles.list}>
                    {CATEGORIES.map((category) => (
                        <li key={category.id} id={isPage ? category.id : undefined} className={styles.item}>
                            <ItemHeading className={styles.itemTitle}>{keepHyphenated(category.name)}</ItemHeading>
                            <p className={styles.itemText}>{keepHyphenated(category.description)}</p>
                        </li>
                    ))}
                </ul>

                <div className={styles.more}>
                    <MoreHeading className={styles.moreTitle}>Also on the shelves</MoreHeading>
                    <ul className={`${styles.list} ${styles.listCompact}`}>
                        {MORE_CATEGORIES.map((category) => (
                            <li key={category.id} id={isPage ? category.id : undefined} className={styles.item}>
                                <MoreItemHeading className={styles.itemTitle}>
                                    {keepHyphenated(category.name)}
                                </MoreItemHeading>
                                <p className={styles.itemText}>{keepHyphenated(category.description)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
