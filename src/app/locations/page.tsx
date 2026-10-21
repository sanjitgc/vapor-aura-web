import type { Metadata } from "next";
import styles from "./page.module.css";
import StoreStatus from "@/components/home/StoreStatus";
import { STORES } from "@/lib/stores";

export const metadata: Metadata = {
    title: "Store locations | Vapor Aura Sachse and Irving, TX",
    description:
        "Addresses, phone numbers and hours for Vapor Aura in Sachse (5848 S State Hwy 78) and Irving (825 W Royal Ln, open 24 hours).",
    alternates: { canonical: "/locations" },
};

function mapEmbed(store: (typeof STORES)[number]) {
    const q = encodeURIComponent(`${store.street}, ${store.city}, TX ${store.zip}`);
    return `https://maps.google.com/maps?q=${q}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
}

export default function Locations() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Our stores</h1>
                    <p className={styles.subtitle}>
                        Two stores in the Dallas area. Irving is open 24 hours, and Sachse is open until 1 AM most
                        nights.
                    </p>
                </header>

                <StoreStatus />

                <div className={styles.maps}>
                    {STORES.map((store) => (
                        <div key={store.slug} className={styles.map}>
                            <iframe
                                src={mapEmbed(store)}
                                title={`Map of ${store.name}`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
