import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import StoreGallery from "@/components/common/StoreGallery";
import { STORE_PHOTOS, allStorePhotos } from "@/lib/storePhotos";
import { getStore } from "@/lib/stores";
import styles from "./InsideStore.module.css";

// Real photos of the Irving store on the home page: the storefront at night, then the inside.
// When the Sachse photos are in src/lib/storePhotos.ts, this section can show both stores.
export default function InsideStore() {
    const store = getStore("irving");
    const photos = STORE_PHOTOS.irving;
    if (!photos) return null;

    return (
        <section className={styles.section} aria-labelledby="inside-title">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 id="inside-title" className={styles.title}>
                        Inside our {store.city} store
                    </h2>
                    <div className={styles.aside}>
                        <p className={styles.subtitle}>
                            Real photos from our store on {store.roadName}, open 24 hours a day.
                        </p>
                        <Link href={store.path} className={styles.link}>
                            See the {store.city} store <FaArrowRight aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                <StoreGallery
                    photos={allStorePhotos(photos)}
                    layout="feature"
                    viewerLabel={`Photos of Vapor Aura ${store.city}`}
                />
            </div>
        </section>
    );
}
