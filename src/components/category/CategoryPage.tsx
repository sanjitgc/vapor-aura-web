import Link from "next/link";
import { FaArrowRight, FaArrowDown } from "react-icons/fa6";
import NicotineWarning from "@/components/common/NicotineWarning";
import JsonLd from "@/components/common/JsonLd";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import StoreStatus from "@/components/home/StoreStatus";
import { CATEGORY_PAGES, nearestStoreLine, type CategoryPageCopy } from "@/lib/categoryPages";
import { categoryPageSchema } from "@/lib/schema";
// Shares the store pages' layout (hero, sections, FAQ) so the two kinds of page look like one site
import layout from "@/components/location/LocationPage.module.css";
import styles from "./CategoryPage.module.css";

// One product category for both stores (/products/hookah and so on). Built for "[category] near me"
// searches: where to buy it comes right after the intro, then what's on the shelf, how to choose,
// and common questions. Words live in src/lib/categoryPages.ts.
export default function CategoryPage({ copy }: { copy: CategoryPageCopy }) {
    const crumbs = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: copy.name, path: copy.path },
    ];
    const others = CATEGORY_PAGES.filter((page) => page.slug !== copy.slug);

    return (
        <main className={layout.main}>
            <JsonLd data={categoryPageSchema(copy)} />
            {copy.nicotine && <NicotineWarning />}

            <div className={layout.page}>
                <Breadcrumbs crumbs={crumbs} />

                <header className={layout.hero}>
                    <p className={layout.kicker}>Vapor Aura · Sachse &amp; Irving</p>
                    <h1 className={styles.title}>
                        <span className={styles.titleMain}>{copy.h1[0]}</span>{" "}
                        <span className={styles.titlePlace}>{copy.h1[1]}</span>
                    </h1>
                    <p className={layout.lead}>{copy.intro}</p>
                    <div className={layout.heroActions}>
                        <a href="#where-to-buy" className={`${layout.button} ${layout.buttonPrimary}`}>
                            <FaArrowDown aria-hidden="true" /> Find a store near you
                        </a>
                    </div>
                </header>

                <section id="where-to-buy" className={styles.where} aria-labelledby="where-title">
                    <h2 id="where-title" className={layout.sectionTitle}>
                        Where to buy {copy.topic} near you
                    </h2>
                    <StoreStatus headingLevel="h3" hiddenTitle={false} />
                    <p className={layout.sectionNote}>
                        {nearestStoreLine()} Stock changes quickly, so call ahead if you&apos;re after something
                        specific.
                    </p>
                </section>

                <section className={layout.section} aria-labelledby="shelf-title">
                    <h2 id="shelf-title" className={layout.sectionTitle}>
                        {copy.shelfTitle}
                    </h2>
                    {/* One row on wide screens, however many items the shelf has */}
                    <ul className={styles.shelf} style={{ "--shelf-cols": copy.shelf.length } as React.CSSProperties}>
                        {copy.shelf.map((item) => (
                            <li key={item.name} className={styles.shelfItem}>
                                <h3 className={styles.shelfName}>{item.name}</h3>
                                <p className={styles.shelfText}>{item.text}</p>
                            </li>
                        ))}
                    </ul>
                    {copy.shelfNote && <p className={layout.sectionNote}>{copy.shelfNote}</p>}
                </section>

                <section className={layout.section} aria-labelledby="tips-title">
                    <h2 id="tips-title" className={layout.sectionTitle}>
                        {copy.tipsTitle}
                    </h2>
                    <ol className={styles.tips}>
                        {copy.tips.map((tip, i) => (
                            <li key={tip.title} className={styles.tip}>
                                <span className={styles.tipNumber} aria-hidden="true">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div>
                                    <h3 className={styles.tipTitle}>{tip.title}</h3>
                                    <p className={styles.tipText}>{tip.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className={layout.section} aria-labelledby="faq-title">
                    <h2 id="faq-title" className={layout.sectionTitle}>
                        Questions about {copy.topic}
                    </h2>
                    <div className={layout.faq}>
                        {copy.faq.map((item) => (
                            <details key={item.q} className={layout.faqItem}>
                                <summary className={layout.faqQuestion}>{item.q}</summary>
                                <p className={layout.faqAnswer}>{item.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                <nav className={styles.related} aria-labelledby="related-title">
                    <h2 id="related-title" className={styles.relatedTitle}>
                        More on our shelves
                    </h2>
                    <ul className={styles.relatedList}>
                        {others.map((page) => (
                            <li key={page.slug}>
                                <Link href={page.path} className={styles.relatedLink}>
                                    {page.name} <FaArrowRight aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link href="/products" className={styles.relatedLink}>
                                Everything we carry <FaArrowRight aria-hidden="true" />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </main>
    );
}
