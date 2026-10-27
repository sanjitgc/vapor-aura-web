import Link from "next/link";
import { FaLocationDot, FaPhone, FaDiamondTurnRight, FaArrowRight } from "react-icons/fa6";
import { SiDoordash } from "react-icons/si";
import NicotineWarning from "@/components/common/NicotineWarning";
import LiveStatus from "@/components/common/LiveStatus";
import JsonLd from "@/components/common/JsonLd";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import {
    DOORDASH_URL,
    STORES,
    directionsUrl,
    getStore,
    mapEmbedUrl,
    mapsListingUrl,
    weeklyHours,
    writeReviewUrl,
    type Store,
} from "@/lib/stores";
import { STORE_PAGES, storeShelves } from "@/lib/storePages";
import { reviewsFor } from "@/lib/reviews";
import { storeSchema } from "@/lib/schema";
import styles from "./LocationPage.module.css";

// One store's landing page. Each store's Google Business Profile links here, so this page is
// built to answer what a searcher needs before visiting: where, when, what's on the shelves,
// and what other customers say.
export default function LocationPage({ slug }: { slug: Store["slug"] }) {
    const store = getStore(slug);
    const copy = STORE_PAGES[slug];
    const other = STORES.find((s) => s.slug !== slug)!;
    const reviews = reviewsFor(slug);
    const crumbs = [
        { name: "Home", path: "/" },
        { name: "Locations", path: "/locations" },
        { name: store.city, path: store.path },
    ];

    return (
        <main className={styles.main} data-store={store.slug}>
            <JsonLd data={storeSchema(store)} />
            <NicotineWarning />

            <div className={styles.page}>
                <Breadcrumbs crumbs={crumbs} />

                <header className={styles.hero}>
                    <p className={styles.kicker}>{copy.kicker}</p>
                    <h1 className={styles.title}>{copy.h1}</h1>
                    <p className={styles.lead}>{copy.intro}</p>
                    <div className={styles.heroActions}>
                        <a
                            href={directionsUrl(store)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.button} ${styles.buttonPrimary}`}
                        >
                            <FaDiamondTurnRight aria-hidden="true" /> Get directions
                        </a>
                        <a href={store.tel} className={styles.button}>
                            <FaPhone aria-hidden="true" /> Call {store.phone}
                        </a>
                        <a href={DOORDASH_URL} target="_blank" rel="noopener noreferrer" className={styles.button}>
                            <SiDoordash aria-hidden="true" /> Order on DoorDash
                        </a>
                    </div>
                </header>

                <section className={styles.details} aria-labelledby="visit-title">
                    <div className={styles.card}>
                        <div className={styles.cardTop}>
                            <h2 id="visit-title" className={styles.cardTitle}>
                                Visit the {store.city} store
                            </h2>
                            <LiveStatus slug={store.slug} />
                        </div>

                        <address className={styles.address}>
                            <FaLocationDot aria-hidden="true" />
                            <span>
                                Vapor Aura
                                <br />
                                {store.street}
                                <br />
                                {store.city}, TX {store.zip}
                            </span>
                        </address>
                        <p className={styles.phone}>
                            <FaPhone aria-hidden="true" /> <a href={store.tel}>{store.phone}</a>
                        </p>

                        <h3 className={styles.hoursTitle}>Store hours</h3>
                        <table className={styles.hours}>
                            <caption className="visually-hidden">Vapor Aura {store.city} store hours</caption>
                            <tbody>
                                {weeklyHours(store).map(({ day, time }) => (
                                    <tr key={day}>
                                        <th scope="row">{day}</th>
                                        <td>{time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className={styles.note}>Hours can change on holidays. Call ahead if you&apos;re cutting it close.</p>
                    </div>

                    <div className={styles.mapCard}>
                        <div className={styles.mapFrame}>
                            <iframe
                                src={mapEmbedUrl(store)}
                                title={`Map of Vapor Aura ${store.city}, ${store.street}`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        <a href={mapsListingUrl(store)} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                            Open Vapor Aura {store.city} in Google Maps <FaArrowRight aria-hidden="true" />
                        </a>
                    </div>
                </section>

                <section className={styles.section} aria-labelledby="shelves-title">
                    <h2 id="shelves-title" className={styles.sectionTitle}>
                        What you&apos;ll find in {store.city}
                    </h2>
                    <ul className={styles.shelves}>
                        {storeShelves().map((shelf) => (
                            <li key={shelf.id}>
                                <Link href={`/products#${shelf.id}`} className={styles.shelf}>
                                    <span className={styles.shelfName}>{shelf.label}</span>
                                    <span className={styles.shelfText}>{shelf.text}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <p className={styles.sectionNote}>
                        Looking for something specific? Call <a href={store.tel}>{store.phone}</a> and we&apos;ll check.
                        See <Link href="/products">everything we carry</Link>.
                    </p>
                </section>

                <section className={styles.section} aria-labelledby="find-title">
                    <h2 id="find-title" className={styles.sectionTitle}>
                        Finding us
                    </h2>
                    <div className={styles.prose}>
                        {copy.findUs.map((line) => (
                            <p key={line}>{line}</p>
                        ))}
                    </div>
                </section>

                {reviews.length > 0 && (
                    <section className={styles.section} aria-labelledby="reviews-title">
                        <h2 id="reviews-title" className={styles.sectionTitle}>
                            What customers say
                        </h2>
                        <ul className={styles.reviews}>
                            {reviews.map((review) => (
                                <li key={review.name} className={styles.review}>
                                    <span className={styles.stars} role="img" aria-label="5 out of 5 stars">
                                        ★★★★★
                                    </span>
                                    <blockquote>
                                        <p>{review.text}</p>
                                    </blockquote>
                                    <p className={styles.reviewMeta}>
                                        {review.name} · Google review
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.reviewActions}>
                            <a
                                href={mapsListingUrl(store)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.button}
                            >
                                Read all reviews on Google
                            </a>
                            <a
                                href={writeReviewUrl(store)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.button}
                            >
                                Write a review
                            </a>
                        </div>
                    </section>
                )}

                <section className={styles.section} aria-labelledby="faq-title">
                    <h2 id="faq-title" className={styles.sectionTitle}>
                        {store.city} store questions
                    </h2>
                    <div className={styles.faq}>
                        {copy.faq.map((item) => (
                            <details key={item.q} className={styles.faqItem}>
                                <summary className={styles.faqQuestion}>{item.q}</summary>
                                <p className={styles.faqAnswer}>{item.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                <aside className={styles.other} aria-labelledby="other-title" data-store={other.slug}>
                    <div>
                        <p className={styles.kicker}>Our other store</p>
                        <h2 id="other-title" className={styles.otherTitle}>
                            Vapor Aura {other.city}
                        </h2>
                        <p className={styles.otherText}>
                            {other.street}, {other.city}, TX {other.zip} · {other.hoursSummary}
                        </p>
                    </div>
                    <Link href={other.path} className={`${styles.button} ${styles.buttonPrimary}`}>
                        See the {other.city} store <FaArrowRight aria-hidden="true" />
                    </Link>
                </aside>
            </div>
        </main>
    );
}
