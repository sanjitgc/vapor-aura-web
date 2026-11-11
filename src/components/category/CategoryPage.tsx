import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaDiamondTurnRight, FaPhone } from "react-icons/fa6";
import NicotineWarning from "@/components/common/NicotineWarning";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import JsonLd from "@/components/common/JsonLd";
import { CATEGORY_PAGES, type CategoryPageCopy } from "@/lib/categoryPages";
import { CATEGORY_PHOTOS } from "@/lib/categoryPhotos";
import { STORES, directionsUrl } from "@/lib/stores";
import loc from "@/components/location/LocationPage.module.css";
import styles from "./CategoryPage.module.css";

// One product category's page: what's on the shelf, which brands, real photos from the stores,
// and where to buy it. Nothing is sold online, so every page ends at the two stores.
export default function CategoryPage({ copy }: { copy: CategoryPageCopy }) {
    const photos = CATEGORY_PHOTOS[copy.slug] ?? [];
    const related = copy.related.flatMap((slug) => CATEGORY_PAGES.filter((page) => page.slug === slug));
    const crumbs = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: copy.name, path: `/products/${copy.slug}` },
    ];
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: copy.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
    };

    return (
        <main className={loc.main}>
            <JsonLd data={faqSchema} />
            <NicotineWarning />

            <div className={loc.page}>
                <Breadcrumbs crumbs={crumbs} />

                <header className={loc.hero}>
                    <h1 className={loc.title}>{copy.h1}</h1>
                    <p className={loc.lead}>{copy.intro}</p>
                    <div className={loc.heroActions}>
                        {STORES.map((store) => (
                            <a key={store.slug} href={store.tel} className={loc.button} data-store={store.slug}>
                                <FaPhone aria-hidden="true" /> Call {store.city} {store.phone}
                            </a>
                        ))}
                    </div>
                </header>

                <div className={photos.length > 0 ? `${styles.body} ${styles.bodyWithPhotos}` : styles.body}>
                    <section className={styles.shelfSection} aria-labelledby="shelf-title">
                        <h2 id="shelf-title" className={loc.sectionTitle}>
                            On the shelf
                        </h2>
                        <dl className={styles.shelf}>
                            {copy.shelf.map((item) => (
                                <div key={item.name} className={styles.shelfItem}>
                                    <dt>{item.name}</dt>
                                    <dd>{item.text}</dd>
                                </div>
                            ))}
                        </dl>

                        {copy.brands.length > 0 && (
                            <>
                                <h3 className={styles.brandsTitle}>Brands we carry</h3>
                                <ul className={styles.brands}>
                                    {copy.brands.map((brand) => (
                                        <li key={brand}>{brand}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                        <p className={styles.note}>
                            Stock changes quickly and can differ between the two stores. Call ahead if you&apos;re
                            after something specific.
                        </p>
                    </section>

                    {photos.length > 0 && (
                        <div className={styles.photos} aria-label="Photos from our stores">
                            {photos.map((photo, i) => (
                                <figure key={photo.id} className={styles.photo}>
                                    <div className={styles.frame}>
                                        <Image
                                            src={photo.src}
                                            alt={photo.alt}
                                            fill
                                            preload={i === 0}
                                            placeholder="blur"
                                            sizes="(max-width: 899px) calc(100vw - 2rem), 520px"
                                            style={{ objectPosition: photo.focus }}
                                        />
                                    </div>
                                    <figcaption>
                                        <strong>{photo.city} store.</strong> {photo.caption}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    )}
                </div>

                <section className={loc.section} aria-labelledby="stores-title">
                    <h2 id="stores-title" className={loc.sectionTitle}>
                        Where to buy
                    </h2>
                    <ul className={styles.stores}>
                        {STORES.map((store) => (
                            <li key={store.slug} className={styles.store} data-store={store.slug}>
                                <h3 className={styles.storeName}>
                                    <Link href={store.path}>Vapor Aura {store.city}</Link>
                                </h3>
                                <p>
                                    {store.street}, {store.city}, TX {store.zip}
                                </p>
                                <p>{store.hoursSummary}</p>
                                <div className={styles.storeActions}>
                                    <a href={store.tel} className={loc.button}>
                                        <FaPhone aria-hidden="true" /> {store.phone}
                                    </a>
                                    <a
                                        href={directionsUrl(store)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={loc.button}
                                    >
                                        <FaDiamondTurnRight aria-hidden="true" /> Directions
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={loc.section} aria-labelledby="faq-title">
                    <h2 id="faq-title" className={loc.sectionTitle}>
                        {copy.name}: common questions
                    </h2>
                    <div className={loc.faq}>
                        {copy.faq.map((item) => (
                            <details key={item.q} className={loc.faqItem}>
                                <summary className={loc.faqQuestion}>{item.q}</summary>
                                <p className={loc.faqAnswer}>{item.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                <nav className={loc.section} aria-labelledby="related-title">
                    <h2 id="related-title" className={loc.sectionTitle}>
                        More from our stores
                    </h2>
                    <ul className={styles.related}>
                        {related.map((page) => (
                            <li key={page.slug}>
                                <Link href={`/products/${page.slug}`}>
                                    {page.name} <FaArrowRight aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link href="/products">
                                Everything we carry <FaArrowRight aria-hidden="true" />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </main>
    );
}
