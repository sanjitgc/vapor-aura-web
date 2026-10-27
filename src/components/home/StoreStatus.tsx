import Link from "next/link";
import { FaLocationDot, FaPhone, FaDiamondTurnRight, FaArrowRight } from "react-icons/fa6";
import { STORES, directionsUrl, fullAddress } from "@/lib/stores";
import LiveStatus from "@/components/common/LiveStatus";
import styles from "./StoreStatus.module.css";

// Both stores at a glance: live open/closed badge, address, call and directions.
// The store name links to the store's own page, so every page that shows these cards
// also passes visitors (and search engines) to /sachse and /irving.
export default function StoreStatus({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
    const Heading = headingLevel;
    return (
        <div className={styles.wrap}>
            {headingLevel === "h3" && <h2 className="visually-hidden">Our stores</h2>}
            <div className={styles.grid}>
                {STORES.map((store) => (
                    <article key={store.slug} className={styles.card} data-store={store.slug}>
                        <div className={styles.top}>
                            <Heading className={styles.name}>
                                <Link href={store.path} className={styles.nameLink}>
                                    {store.city}
                                    <FaArrowRight aria-hidden="true" className={styles.nameArrow} />
                                    <span className="visually-hidden"> store page</span>
                                </Link>
                            </Heading>
                            <LiveStatus slug={store.slug} />
                        </div>
                        <p className={styles.address}>
                            <FaLocationDot aria-hidden="true" /> {fullAddress(store)}
                        </p>
                        <div className={styles.actions}>
                            <a href={store.tel} className={styles.action}>
                                <FaPhone aria-hidden="true" /> {store.phone}
                            </a>
                            <a
                                href={directionsUrl(store)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.action} ${styles.actionPrimary}`}
                            >
                                <FaDiamondTurnRight aria-hidden="true" /> Directions
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
