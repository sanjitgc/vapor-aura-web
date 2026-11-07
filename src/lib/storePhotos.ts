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
import sachseStorefront from "@/assets/stores/sachse/storefront-night.webp";
import sachseWaterPipes from "@/assets/stores/sachse/water-pipes.webp";
import sachseSalesFloor from "@/assets/stores/sachse/sales-floor.webp";
import sachseDrinks from "@/assets/stores/sachse/drinks-cooler.webp";
import sachseButane from "@/assets/stores/sachse/butane-torches.webp";
import sachseDisposables from "@/assets/stores/sachse/disposables-case.webp";
import sachseHandPipes from "@/assets/stores/sachse/glass-case.webp";

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
            alt: "Vapor Aura Sachse at night: the lit Vapor Aura sign above the store, with Open and Kratom neon signs in the windows",
            focus: "50% 18%",
            // The sign at the top, the window neon at the bottom, a dark wall between them:
            // short frames keep the whole sign and as much of the windows as fits
            hero: { wide: "50% 50%", tablet: "50% 13%", phone: "50% 20%" },
        },
        // The store page shows these in rows of two, a wide tile and a narrow one taking turns
        // (wide-narrow, narrow-wide, wide-narrow). The order puts the wide photos in wide tiles.
        inside: [
            {
                id: "sachse-water-pipes",
                src: sachseWaterPipes,
                label: "Water pipes",
                caption: "Shelf after shelf of water pipes, from small rigs to tall beakers, with GRAV and Cheech glass up top.",
                alt: "A wall of glass water pipes at Vapor Aura Sachse: four shelves of beakers, recyclers, silicone pipes and small rigs",
                focus: "50% 50%",
            },
            {
                id: "sachse-sales-floor",
                src: sachseSalesFloor,
                label: "Sales floor",
                caption: "Glass cases down both sides of the aisle, and stocked shelves along the walls.",
                alt: "Inside Vapor Aura Sachse: a long aisle between lit glass cases, with fully stocked shelves along both walls",
                focus: "50% 65%",
            },
            {
                id: "sachse-drinks",
                src: sachseDrinks,
                label: "Drinks",
                caption: "A two-door cooler of kratom and kava drinks, Celsius, water and more.",
                alt: "A two-door drinks cooler at Vapor Aura Sachse with every shelf full of cans and bottles",
                focus: "50% 60%",
            },
            {
                id: "sachse-butane",
                src: sachseButane,
                label: "Butane & torches",
                caption: "Butane refills, Zippo and Ronsonol lighter fluid, and torch lighters on the shelf below.",
                alt: "Shelves at Vapor Aura Sachse with butane cans and lighter fluid on top and torch lighters below",
                focus: "50% 50%",
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
                id: "sachse-hand-pipes",
                src: sachseHandPipes,
                label: "Hand pipes",
                caption: "Rows of glass hand pipes, from clear striped glass to solid colors.",
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
