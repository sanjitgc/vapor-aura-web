import { STORE_PHOTOS, allStorePhotos } from "@/lib/storePhotos";
import { STORES } from "@/lib/stores";
import InsideStoreView, { type StoreWithPhotos } from "./InsideStoreView";
import styles from "./InsideStore.module.css";

// Real photos of our stores on the home page, in the same store order as the rest of the site.
// A store shows up here as soon as it has photos in src/lib/storePhotos.ts.
export default function InsideStore() {
    const stores: StoreWithPhotos[] = STORES.flatMap((store) => {
        const set = STORE_PHOTOS[store.slug];
        if (!set) return [];
        return [{ slug: store.slug, city: store.city, path: store.path, roadName: store.roadName, photos: allStorePhotos(set) }];
    });
    if (stores.length === 0) return null;

    return (
        <section className={styles.section} aria-labelledby="inside-title">
            <div className={styles.container}>
                <InsideStoreView stores={stores} />
            </div>
        </section>
    );
}
