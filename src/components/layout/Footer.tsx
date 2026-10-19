import styles from "./Footer.module.css";
import Image from "next/image";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { STORES, SOCIAL } from "@/lib/stores";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <Image src="/vapor-aura-logo-new.png" alt="Vapor Aura" width={280} height={84} className={styles.logo} />
                    <p className={styles.tagline}>Vape & smoke shop in Sachse and Irving, TX. 21+ only.</p>
                </div>

                <div className={styles.stores}>
                    {STORES.map((store) => (
                        <div key={store.slug} className={styles.store}>
                            <p className={styles.storeName}>{store.name}</p>
                            <p>{store.street}<br />{store.city}, TX {store.zip}</p>
                            <p><a href={store.tel}>{store.phone}</a> · {store.hoursSummary}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.links} aria-label="Social media links">
                    <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Vapor Aura on Instagram">
                        <FaInstagram aria-hidden="true" />
                    </a>
                    <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Vapor Aura on Facebook">
                        <FaFacebookF aria-hidden="true" />
                    </a>
                </div>
            </div>
            <div className={styles.legal}>
                <p>Sales to adults 21 and over only. Valid photo ID required.</p>
                <p>&copy; {new Date().getFullYear()} Vapor Aura. All rights reserved.</p>
            </div>
        </footer>
    );
}
