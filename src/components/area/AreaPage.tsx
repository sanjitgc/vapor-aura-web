import Image from "next/image";
import type { CSSProperties } from "react";
import Link from "next/link";
import { FaArrowRight, FaDiamondTurnRight, FaLocationDot, FaPhone } from "react-icons/fa6";
import NicotineWarning from "@/components/common/NicotineWarning";
import LiveStatus from "@/components/common/LiveStatus";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import JsonLd from "@/components/common/JsonLd";
import { areasNear, type AreaPageCopy } from "@/lib/areaPages";
import { CATEGORY_PAGES } from "@/lib/categoryPages";
import { reviewsFor } from "@/lib/reviews";
import { STORE_PHOTOS } from "@/lib/storePhotos";
import { getStore, mapsListingUrl, weeklyHours } from "@/lib/stores";
import loc from "@/components/location/LocationPage.module.css";
import styles from "./AreaPage.module.css";

// A page for one city near a store. It says plainly that the store is in the next city over,
// then gives what someone coming from there needs: directions from their city, hours, and
// what's on the shelves.
export default function AreaPage({ copy }: { copy: AreaPageCopy }) {
    const store = getStore(copy.store);
    const photo = STORE_PHOTOS[store.slug]?.storefront;
    const reviews = reviewsFor(store.slug).slice(0, 2);
    const others = areasNear(store.slug).filter((page) => page.slug !== copy.slug);
    const crumbs = [
        { name: "Home", path: "/" },
        { name: "Locations", path: "/locations" },
        { name: `Near ${copy.place}`, path: copy.path },
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
    const frameStyle = photo?.hero
        ? ({
              "--focus-wide": photo.hero.wide,
              "--focus-tablet": photo.hero.tablet,
              "--focus-phone": photo.hero.phone,
          } as CSSProperties)
        : undefined;

    return (
        <main className={loc.main} data-store={store.slug}>
            <JsonLd data={faqSchema} />
            <NicotineWarning />

            <div className={loc.page}>
                <Breadcrumbs crumbs={crumbs} />

                <header className={photo ? `${loc.hero} ${loc.heroWithPhoto}` : loc.hero}>
                    <p className={loc.kicker}>Closest store: Vapor Aura {store.city}</p>
                    <h1 className={loc.title}>{copy.h1}</h1>
                    {photo && (
                        <figure className={loc.heroPhoto}>
                            <div className={loc.heroFrame} style={frameStyle}>
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    fill
                                    preload
                                    placeholder="blur"
                                    sizes="(max-width: 899px) calc(100vw - 2rem), 440px"
                                    className={loc.heroImage}
                                />
                            </div>
                            <figcaption className={loc.heroCaption}>
                                <FaLocationDot aria-hidden="true" />
                                <span>
                                    Vapor Aura {store.city}. {photo.caption}
                                </span>
                            </figcaption>
                        </figure>
                    )}
                    <p className={loc.lead}>{copy.intro}</p>
                    <div className={loc.heroActions}>
                        <a
                            href={copy.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${loc.button} ${loc.buttonPrimary}`}
                        >
                            <FaDiamondTurnRight aria-hidden="true" /> Directions from {copy.place}
                        </a>
                        <a href={store.tel} className={loc.button}>
                            <FaPhone aria-hidden="true" /> Call {store.phone}
                        </a>
                    </div>
                </header>

                <section className={loc.section} aria-labelledby="store-title">
                    <h2 id="store-title" className={loc.sectionTitle}>
                        The store closest to {copy.place}
                    </h2>
                    <div className={styles.store}>
                        <div>
                            <div className={styles.storeTop}>
                                <h3 className={styles.storeName}>
                                    <Link href={store.path}>Vapor Aura {store.city}</Link>
                                </h3>
                                <LiveStatus slug={store.slug} />
                            </div>
                            <address className={styles.address}>
                                {store.street}
                                <br />
                                {store.city}, TX {store.zip}
                            </address>
                            <p className={styles.phone}>
                                <a href={store.tel}>{store.phone}</a>
                            </p>
                            <Link href={store.path} className={styles.more}>
                                Map, photos and reviews of the {store.city} store <FaArrowRight aria-hidden="true" />
                            </Link>
                        </div>
                        <table className={loc.hours}>
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
                    </div>
                </section>

                <section className={loc.section} aria-labelledby="carry-title">
                    <h2 id="carry-title" className={loc.sectionTitle}>
                        What we carry
                    </h2>
                    <ul className={styles.pills}>
                        {CATEGORY_PAGES.map((page) => (
                            <li key={page.slug}>
                                <Link href={`/products/${page.slug}`}>{page.name}</Link>
                            </li>
                        ))}
                    </ul>
                    <p className={loc.sectionNote}>
                        Geek Bar, Foger, RAZ and Lost Mary disposables, ZYN, e-liquid, glass, Afzal shisha, kratom
                        and more. See <Link href="/products">everything we carry</Link>.
                    </p>
                </section>

                {reviews.length > 0 && (
                    <section className={loc.section} aria-labelledby="reviews-title">
                        <h2 id="reviews-title" className={loc.sectionTitle}>
                            What customers say about the {store.city} store
                        </h2>
                        <ul className={loc.reviews}>
                            {reviews.map((review) => (
                                <li key={review.name} className={loc.review}>
                                    <span className={loc.stars} role="img" aria-label="5 out of 5 stars">
                                        ★★★★★
                                    </span>
                                    <blockquote>
                                        <p>{review.text}</p>
                                    </blockquote>
                                    <p className={loc.reviewMeta}>{review.name} · Google review</p>
                                </li>
                            ))}
                        </ul>
                        <div className={loc.reviewActions}>
                            <a href={mapsListingUrl(store)} target="_blank" rel="noopener noreferrer" className={loc.button}>
                                Read all reviews on Google
                            </a>
                        </div>
                    </section>
                )}

                <section className={loc.section} aria-labelledby="faq-title">
                    <h2 id="faq-title" className={loc.sectionTitle}>
                        Coming from {copy.place}
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

                {others.length > 0 && (
                    <nav className={loc.section} aria-labelledby="others-title">
                        <h2 id="others-title" className={loc.sectionTitle}>
                            Also near the {store.city} store
                        </h2>
                        <ul className={styles.pills}>
                            {others.map((page) => (
                                <li key={page.slug}>
                                    <Link href={page.path}>{page.place}</Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/locations">Both stores</Link>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </main>
    );
}
