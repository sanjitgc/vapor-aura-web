import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import styles from "./page.module.css";
import StoreStatus from "@/components/home/StoreStatus";
import NicotineWarning from "@/components/common/NicotineWarning";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { STORES, mapEmbedUrl } from "@/lib/stores";
import { areasNear } from "@/lib/areaPages";
import loc from "@/components/location/LocationPage.module.css";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    title: "Vape & Smoke Shops in Sachse & Irving, TX | Vapor Aura",
    description:
        "Vapor Aura's two stores: Sachse on Hwy 78 and Irving on Royal Ln, open 24 hours. Serving Coppell, Carrollton, Grapevine, Wylie, Garland, Rowlett and Murphy.",
    path: "/locations",
});

const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
];

export default function Locations() {
    return (
        <main className={styles.main}>
            <NicotineWarning />
            <div className={styles.container}>
                <Breadcrumbs crumbs={crumbs} className={styles.crumbs} />

                <header className={styles.header}>
                    <h1 className={styles.title}>Our smoke shops in Sachse &amp; Irving</h1>
                    <p className={styles.subtitle}>
                        Two stores in the Dallas area. Irving is open 24 hours, and Sachse is open until 1 AM most
                        nights and 2 AM Thursday through Saturday.
                    </p>
                </header>

                <StoreStatus headingLevel="h2" />

                <div className={styles.maps}>
                    {STORES.map((store) => (
                        <div key={store.slug} className={styles.mapCard} data-store={store.slug}>
                            <div className={styles.map}>
                                <iframe
                                    src={mapEmbedUrl(store)}
                                    title={`Map of ${store.name}`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                            <Link href={store.path} className={styles.storeLink}>
                                Hours, directions and what&apos;s in the {store.city} store{" "}
                                <FaArrowRight aria-hidden="true" />
                            </Link>
                        </div>
                    ))}
                </div>

                <section className={loc.section} aria-labelledby="areas-title">
                    <h2 id="areas-title" className={loc.sectionTitle}>
                        Areas we serve
                    </h2>
                    {STORES.map((store) => (
                        <div key={store.slug} className={styles.areaGroup}>
                            <h3>
                                Near the <Link href={store.path}>{store.city} store</Link>
                            </h3>
                            <ul className={loc.areas}>
                                {areasNear(store.slug).map((area) => (
                                    <li key={area.slug}>
                                        <Link href={area.path}>{area.place}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}
