import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import NicotineWarning from "@/components/common/NicotineWarning";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { CATEGORY_PAGES } from "@/lib/categoryPages";
import { STORE_PHOTOS } from "@/lib/storePhotos";
import { DOORDASH_URL, STORES } from "@/lib/stores";
import { pageMetadata } from "@/lib/seo";
import loc from "@/components/location/LocationPage.module.css";
import styles from "./page.module.css";

export const metadata = pageMetadata({
    title: "About Vapor Aura | Vape & Smoke Shop, Sachse & Irving",
    description:
        "Vapor Aura is a 21+ vape and smoke shop with two stores in the Dallas area: Sachse on Highway 78 and Irving on Royal Lane, open 24 hours. How we run them.",
    path: "/about",
});

const crumbs = [
    { name: "Home", path: "/" },
    { name: "About us", path: "/about" },
];

// How we run the stores. True, specific points only; update them if a policy changes.
const PROMISES = [
    {
        name: "ID on every sale",
        text: "We sell only to adults 21 and over, and we check a valid photo ID on every purchase, no matter how old you look.",
    },
    {
        name: "Help choosing",
        text: "We'll compare devices, explain flavors and nicotine strengths, and match the right coil or pod to what you already own.",
    },
    {
        name: "A straight answer by phone",
        text: "Stock moves fast. Call either store and someone will walk to the shelf and check before you drive over.",
    },
    {
        name: "We'll order it in",
        text: "If we don't have what you're after, ask. We can often order it in for you.",
    },
];

export default function AboutPage() {
    return (
        <main className={loc.main}>
            <NicotineWarning />
            <div className={loc.page}>
                <Breadcrumbs crumbs={crumbs} />

                <header className={loc.hero}>
                    <h1 className={loc.title}>About Vapor Aura</h1>
                    <p className={loc.lead}>
                        Vapor Aura is a vape and smoke shop with two stores in the Dallas area. One is in Sachse on
                        State Highway 78. The other is in Irving on West Royal Lane, and it never closes. Both
                        carry disposable vapes, e-liquid, glass, hookah, vaporizers, kratom and CBD, and both are
                        staffed by people who know the products.
                    </p>
                </header>

                <section className={loc.section} aria-labelledby="stores-title">
                    <h2 id="stores-title" className={loc.sectionTitle}>
                        Two stores
                    </h2>
                    <ul className={styles.stores}>
                        {STORES.map((store) => {
                            const photo = STORE_PHOTOS[store.slug]?.storefront;
                            return (
                                <li key={store.slug} className={styles.store} data-store={store.slug}>
                                    {photo && (
                                        <div className={styles.frame}>
                                            <Image
                                                src={photo.src}
                                                alt={photo.alt}
                                                fill
                                                placeholder="blur"
                                                sizes="(max-width: 760px) calc(100vw - 2rem), 580px"
                                                style={{ objectPosition: photo.hero?.tablet ?? photo.focus }}
                                            />
                                        </div>
                                    )}
                                    <h3 className={styles.storeName}>Vapor Aura {store.city}</h3>
                                    <p>
                                        {store.street}, {store.city}, TX {store.zip}
                                    </p>
                                    <p>{store.hoursSummary}</p>
                                    <p>
                                        <a href={store.tel}>{store.phone}</a>
                                    </p>
                                    <Link href={store.path} className={styles.storeLink}>
                                        Hours, map and photos of the {store.city} store{" "}
                                        <FaArrowRight aria-hidden="true" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className={loc.section} aria-labelledby="how-title">
                    <h2 id="how-title" className={loc.sectionTitle}>
                        How we run them
                    </h2>
                    <dl className={loc.highlights}>
                        {PROMISES.map((item) => (
                            <div key={item.name}>
                                <dt>{item.name}</dt>
                                <dd>{item.text}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <section className={loc.section} aria-labelledby="carry-title">
                    <h2 id="carry-title" className={loc.sectionTitle}>
                        What we carry
                    </h2>
                    <ul className={styles.categories}>
                        {CATEGORY_PAGES.map((page) => (
                            <li key={page.slug}>
                                <Link href={`/products/${page.slug}`}>{page.name}</Link>
                            </li>
                        ))}
                    </ul>
                    <div className={loc.prose}>
                        <p>
                            Nothing is sold through this website. You can shop in either store, or order part of
                            our range for delivery on{" "}
                            <a href={DOORDASH_URL} target="_blank" rel="noopener noreferrer">
                                DoorDash
                            </a>
                            . See <Link href="/products">everything we carry</Link>, or{" "}
                            <Link href="/contact">send us a message</Link>.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
