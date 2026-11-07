import { STORE_PHOTOS, allStorePhotos } from "@/lib/storePhotos";
import { STORES, type Store } from "@/lib/stores";
import InsideStoreView, { type StoreWithPhotos } from "./InsideStoreView";
import styles from "./InsideStore.module.css";

// The store whose photos show when the page opens. It sits first in the switch, so the open
// tab is always the first one; the other stores follow in the site's usual order.
const OPENS_ON: Store["slug"] = "irving";

// Real photos of our stores on the home page. A store shows up here as soon as it has photos
// in src/lib/storePhotos.ts.
export default function InsideStore() {
    const stores: StoreWithPhotos[] = STORES.flatMap((store) => {
        const set = STORE_PHOTOS[store.slug];
        if (!set) return [];
        return [{ slug: store.slug, city: store.city, path: store.path, roadName: store.roadName, photos: allStorePhotos(set) }];
    }).sort((a, b) => Number(b.slug === OPENS_ON) - Number(a.slug === OPENS_ON));
    if (stores.length === 0) return null;

    return (
        <section className={styles.section} aria-labelledby="inside-title">
            <div className={styles.container}>
                <InsideStoreView stores={stores} />
            </div>
        </section>
    );
}
