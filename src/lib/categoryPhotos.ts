// Which store photos illustrate each category page. Every photo was taken in one of our stores.
// Keep this file out of anything the tests import: the image imports only resolve inside Next.
import { MORE_PHOTOS, STORE_PHOTOS, type StorePhoto } from "./storePhotos";
import { getStore, type Store } from "./stores";

export interface CategoryPhoto extends StorePhoto {
    // The store the photo was taken in
    city: string;
}

function pick(slug: Store["slug"], id: string): CategoryPhoto {
    const photo = [...(STORE_PHOTOS[slug]?.inside ?? []), ...(MORE_PHOTOS[slug] ?? [])].find((p) => p.id === id);
    if (!photo) throw new Error(`No photo ${id} for ${slug}`);
    return { ...photo, city: getStore(slug).city };
}

// Keyed by the category page's slug. Pages without an entry simply show no photos.
export const CATEGORY_PHOTOS: Record<string, CategoryPhoto[]> = {
    "disposable-vapes": [pick("irving", "irving-disposables"), pick("sachse", "sachse-disposables")],
    "e-liquid": [pick("irving", "irving-e-liquid"), pick("irving", "irving-pod-kits")],
    "nicotine-pouches": [pick("irving", "irving-papers")],
    hookah: [pick("irving", "irving-hookahs")],
    "cigars-wraps": [pick("irving", "irving-cigars")],
    glass: [pick("irving", "irving-water-pipes"), pick("sachse", "sachse-water-pipes"), pick("irving", "irving-bangers")],
    vaporizers: [pick("irving", "irving-vaporizers")],
    kratom: [pick("irving", "irving-kratom-cooler"), pick("sachse", "sachse-drinks")],
    "torches-butane": [pick("sachse", "sachse-butane"), pick("irving", "irving-accessories")],
    "grinders-trays": [pick("irving", "irving-grinders"), pick("irving", "irving-papers")],
};
