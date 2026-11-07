// Real photos of each store, shown on the home page and on the store's own page.
// Every photo was taken in that store. Labels and captions describe only what the photo shows.
// Source files live in src/assets/stores/<store>/: sRGB WebP, metadata stripped, up to 2400px wide.
// Keep this file out of anything the tests import: the image imports only resolve inside Next.
import type { StaticImageData } from "next/image";
import type { Store } from "./stores";
import irvingStorefront from "@/assets/stores/irving/storefront-night.webp";
import irvingSalesFloor from "@/assets/stores/irving/sales-floor.webp";
import irvingEliquid from "@/assets/stores/irving/e-liquid-wall.webp";
import irvingDisposables from "@/assets/stores/irving/disposables-case.webp";
import irvingGrinders from "@/assets/stores/irving/grinders-case.webp";
import irvingAccessories from "@/assets/stores/irving/accessories-shelves.webp";
import sachseStorefront from "@/assets/stores/sachse/storefront-day.webp";
import sachseSalesFloor from "@/assets/stores/sachse/sales-floor.webp";
import sachseDisposables from "@/assets/stores/sachse/disposables-case.webp";
import sachseGlass from "@/assets/stores/sachse/glass-case.webp";

export interface StorePhoto {
    id: string;
    src: StaticImageData;
    // Short name shown on the photo
    label: string;
    // One line under the photo in the large view
    caption: string;
    alt: string;
    // The part of the photo to keep when a tile crops it (a CSS object-position)
    focus?: string;
    // Storefronts only: the part to keep in the store page's top photo, which is tall beside
    // the heading on wide screens and wide above the intro on tablets and phones
    hero?: { wide: string; tablet: string; phone: string };
}

export interface StorePhotoSet {
    // Outside the store, as customers see it when they arrive
    storefront: StorePhoto;
    // Inside the store, in the order they're shown
    inside: StorePhoto[];
}

export const STORE_PHOTOS: Partial<Record<Store["slug"], StorePhotoSet>> = {
    sachse: {
        storefront: {
            id: "sachse-storefront",
            src: sachseStorefront,
            label: "Storefront",
            caption: "Suite 108 on State Highway 78, under the Vapor Aura sign.",
            alt: "Vapor Aura Sachse in daylight: the Vapor Aura sign above two blue awnings, with Open and Vape neon signs in the windows",
            // The sign runs almost to the right edge: tall tiles trim the left side instead
            focus: "100% 5%",
            // Keep the sign at the top; the pavement is the first thing to go
            hero: { wide: "50% 0%", tablet: "50% 6%", phone: "50% 6%" },
        },
        inside: [
            {
                id: "sachse-sales-floor",
                src: sachseSalesFloor,
                label: "Sales floor",
                caption: "Glass cases down both sides of the aisle, and stocked shelves along the walls.",
                alt: "Inside Vapor Aura Sachse: a long aisle between lit glass cases, with fully stocked shelves along both walls",
                focus: "50% 65%",
            },
            {
                id: "sachse-disposables",
                src: sachseDisposables,
                label: "Disposables",
                caption: "Foger and Off-Stamp disposables in the case.",
                alt: "A lit glass case of disposable vapes at Vapor Aura Sachse: rows of Foger boxes, with Off-Stamp boxes in the lower corner",
                focus: "72% 50%",
            },
            {
                id: "sachse-glass",
                src: sachseGlass,
                label: "Glass",
                caption: "Rows of hand pipes, from clear striped glass to solid colors.",
                alt: "A glass case at Vapor Aura Sachse with rows of striped and solid-color glass hand pipes",
                focus: "65% 50%",
            },
        ],
    },
    irving: {
        storefront: {
            id: "irving-storefront",
            src: irvingStorefront,
            label: "Storefront",
            caption: "Suite 140 on West Royal Lane, under the Vapor Aura sign.",
            alt: "Vapor Aura Irving at night: the lit Vapor Aura sign above the store, with Open, Smoke Shop and Hookah neon signs in the windows",
            // The sign sits right of centre in this photo
            focus: "70% 40%",
            // Tablets and phones: the sign and the neon in the windows
            hero: { wide: "50% 50%", tablet: "50% 34%", phone: "50% 46%" },
        },
        inside: [
            {
                id: "irving-sales-floor",
                src: irvingSalesFloor,
                label: "Sales floor",
                caption: "Puffco and Ooze vaporizers in the center case, with glass on the back wall.",
                alt: "Inside Vapor Aura Irving: a lit glass case of vaporizers in the middle of the store, with stocked shelves and green plant walls all around",
                focus: "50% 70%",
            },
            {
                id: "irving-e-liquid",
                src: irvingEliquid,
                label: "E-liquid wall",
                caption: "Coastal Clouds, Pacha, Juice Head, Candy King, Jam Monster, Sad Boy and more.",
                alt: "A full wall of e-liquid boxes at Vapor Aura Irving, shelf after shelf of bright packaging under a green plant wall",
                focus: "50% 40%",
            },
            {
                id: "irving-disposables",
                src: irvingDisposables,
                label: "Disposables",
                caption: "Geek Bar disposables in the case, with RAZ on the shelf above.",
                alt: "A lit glass case filled with rows of Geek Bar disposable vapes, with RAZ disposables on the shelf above",
                focus: "50% 45%",
            },
            {
                id: "irving-grinders",
                src: irvingGrinders,
                label: "Grinders",
                caption: "A full case of metal and printed grinders.",
                alt: "A glass display case at Vapor Aura Irving filled with rows of colorful metal and printed herb grinders",
                focus: "40% 50%",
            },
            {
                id: "irving-accessories",
                src: irvingAccessories,
                label: "Butane & accessories",
                caption: "Butane, Zippo and Ronsonol lighter fluid, room sprays, incense, glass cleaner and detox drinks.",
                alt: "Shelves of butane, lighter fluid, room sprays, incense, glass cleaner and detox drinks at Vapor Aura Irving",
                focus: "45% 35%",
            },
        ],
    },
};

// Every photo of a store, storefront first (the order the large viewer and structured data use)
export function allStorePhotos(set: StorePhotoSet): StorePhoto[] {
    return [set.storefront, ...set.inside];
}
