import Link from "next/link";
import styles from "./page.module.css";
import ProductHighlights from "@/components/home/ProductHighlights";
import NicotineWarning from "@/components/common/NicotineWarning";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { STORES } from "@/lib/stores";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    title: "Vapes, Glass, Hookah & Kratom in Sachse & Irving, TX",
    description:
        "Geek Bar, Foger, RAZ and Lost Mary vapes, ZYN, e-liquid, glass, Afzal hookah, vaporizers, kratom and CBD at Vapor Aura in Sachse and Irving, TX. 21+.",
    path: "/products",
});

const crumbs = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
];

export default function ProductsPage() {
    return (
        <main className={styles.main}>
            <NicotineWarning />
            <div className={styles.container}>
                <Breadcrumbs crumbs={crumbs} className={styles.crumbs} />

                <header className={styles.header}>
                    <h1 className={styles.title}>Vapes, glass, hookah &amp; more</h1>
                    <p className={styles.subtitle}>
                        Everything we carry in our Sachse and Irving smoke shops. Pick a category for brands and
                        photos. Stock changes quickly, so call ahead if you&apos;re after something specific.
                    </p>
                </header>

                <ProductHighlights variant="page" />

                <section className={styles.visit} aria-labelledby="visit-title">
                    <h2 id="visit-title" className={styles.visitTitle}>
                        Shop in store
                    </h2>
                    <ul className={styles.visitList}>
                        {STORES.map((store) => (
                            <li key={store.slug} data-store={store.slug}>
                                <Link href={store.path} className={styles.visitLink}>
                                    Vapor Aura {store.city}
                                </Link>
                                <span className={styles.visitMeta}>
                                    {store.street} · {store.hoursSummary} ·{" "}
                                    <a href={store.tel}>{store.phone}</a>
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}
