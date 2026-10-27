import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import styles from "./page.module.css";
import StoreStatus from "@/components/home/StoreStatus";
import NicotineWarning from "@/components/common/NicotineWarning";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { STORES, mapEmbedUrl } from "@/lib/stores";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    title: "Store Locations in Sachse & Irving, TX | Vapor Aura",
    description:
        "Vapor Aura's two stores: Sachse at 5848 S State Hwy 78, open until 1–2 AM, and Irving at 825 W Royal Ln, open 24 hours. Hours, phones and directions.",
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
                    <h1 className={styles.title}>Our stores</h1>
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
            </div>
        </main>
    );
}
