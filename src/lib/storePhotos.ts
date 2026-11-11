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
import irvingHookahs from "@/assets/stores/irving/hookah-wall.webp";
import irvingWaterPipes from "@/assets/stores/irving/water-pipes.webp";
import irvingPapers from "@/assets/stores/irving/papers-zyn-wall.webp";
import irvingPodKits from "@/assets/stores/irving/pod-kits-case.webp";
import irvingVaporizers from "@/assets/stores/irving/vaporizer-case.webp";
import irvingKratomCooler from "@/assets/stores/irving/kratom-cooler.webp";
import irvingCigars from "@/assets/stores/irving/cigars-wraps-wall.webp";
import irvingBangers from "@/assets/stores/irving/bangers-case.webp";
import irvingGummies from "@/assets/stores/irving/gummies-wall.webp";
import irvingMushroom from "@/assets/stores/irving/mushroom-chocolate-case.webp";
import irvingFlower from "@/assets/stores/irving/flower-pre-rolls-wall.webp";
import irvingThcCooler from "@/assets/stores/irving/thc-drinks-cooler.webp";
import irvingDrinkShelves from "@/assets/stores/irving/drinks-shelves.webp";
import irvingChargers from "@/assets/stores/irving/cream-chargers.webp";
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
            {
                id: "irving-hookahs",
                src: irvingHookahs,
                label: "Hookahs",
                caption: "A wall of hookahs, from small pots to tall ones, with starter kits in the box.",
                alt: "A wall of hookahs at Vapor Aura Irving: three shelves of hookah pots in different sizes and colors against a green plant wall",
                focus: "50% 50%",
            },
            {
                id: "irving-water-pipes",
                src: irvingWaterPipes,
                label: "Water pipes",
                caption: "Four shelves of water pipes: tall beakers up top, rigs and recyclers below.",
                alt: "A long wall of glass water pipes at Vapor Aura Irving, with tall beakers on the top shelf and rigs, recyclers and novelty pipes below",
                focus: "50% 50%",
            },
        ],
    },
};

// More photos from the stores, used on the category pages only (not in the store galleries)
export const MORE_PHOTOS: Partial<Record<Store["slug"], StorePhoto[]>> = {
    irving: [
        {
            id: "irving-papers",
            src: irvingPapers,
            label: "ZYN & papers",
            caption: "ZYN cans in two rows, with RAW, Zig-Zag, Elements and Blazy Susan papers and cones below and torches above.",
            alt: "Shelves at Vapor Aura Irving with rows of ZYN nicotine pouch cans, RAW and Blazy Susan papers and cones, and torch lighters",
            focus: "50% 55%",
        },
        {
            id: "irving-pod-kits",
            src: irvingPodKits,
            label: "Pod kits",
            caption: "SMOK Nord and Novo, Uwell Caliburn, Vaporesso and Geekvape kits in the case.",
            alt: "A lit glass case at Vapor Aura Irving filled with boxed SMOK, Uwell, Vaporesso and Geekvape pod kits",
            focus: "50% 50%",
        },
        {
            id: "irving-vaporizers",
            src: irvingVaporizers,
            label: "Vaporizers",
            caption: "Puffco Peak and Proxy up top, Ooze, Yocan and Lookah beside them, and pocket scales below.",
            alt: "A glass case at Vapor Aura Irving with boxed Puffco, Ooze, Yocan and Lookah vaporizers and a shelf of digital scales",
            focus: "50% 45%",
        },
        {
            id: "irving-kratom-cooler",
            src: irvingKratomCooler,
            label: "Kratom seltzers",
            caption: "Two coolers of Club13 and other kratom seltzers.",
            alt: "Two tall drinks coolers at Vapor Aura Irving, every shelf full of kratom seltzer cans",
            focus: "50% 45%",
        },
        {
            id: "irving-cigars",
            src: irvingCigars,
            label: "Cigars & wraps",
            caption: "Camo and Twisted Hemp wraps up top, then Swisher Sweets, Game and White Owl, with Backwoods along the bottom.",
            alt: "A wall of cigars and wraps at Vapor Aura Irving: hemp wraps on the top shelves, cigarillos in the middle and Backwoods on the bottom row",
            focus: "50% 50%",
        },
        {
            id: "irving-bangers",
            src: irvingBangers,
            label: "Bangers",
            caption: "Quartz bangers across the bottom shelf, nectar collectors in the middle and one-hitters up top.",
            alt: "A glass case at Vapor Aura Irving with rows of glass one-hitters, boxed nectar collectors and dozens of quartz bangers",
            focus: "50% 55%",
        },
        {
            id: "irving-gummies",
            src: irvingGummies,
            label: "Gummies",
            caption: "Jelly, Snoozy, Mood, Xite, Camino and Sivan gummies, wall to wall.",
            alt: "A wall of gummy packages at Vapor Aura Irving: rows of colorful bags on hooks above shelves of boxes and jars",
            focus: "50% 45%",
        },
        {
            id: "irving-mushroom",
            src: irvingMushroom,
            label: "Mushroom chocolate",
            caption: "Road Trip and other mushroom chocolate bars in the case.",
            alt: "A lit glass case at Vapor Aura Irving with rows of boxed mushroom chocolate bars",
            focus: "50% 50%",
        },
        {
            id: "irving-flower",
            src: irvingFlower,
            label: "Flower & pre-rolls",
            caption: "Jars of flower and boxes of pre-rolls, with glass on the top shelf.",
            alt: "Shelves at Vapor Aura Irving with jars of hemp flower and boxes of pre-rolls under a row of boxed glass water pipes",
            focus: "50% 60%",
        },
        {
            id: "irving-thc-cooler",
            src: irvingThcCooler,
            label: "THC drinks",
            caption: "Zour Pop, Uncle Skunks, Sherpa and more, cold.",
            alt: "A two-door drinks cooler at Vapor Aura Irving full of THC seltzer cans",
            focus: "50% 40%",
        },
        {
            id: "irving-drink-shelves",
            src: irvingDrinkShelves,
            label: "Drinks by the pack",
            caption: "Torch, Zour Pop and Sherpa by the pack.",
            alt: "Shelves at Vapor Aura Irving stacked with boxed packs of Torch, Zour Pop and Sherpa drinks",
            focus: "50% 45%",
        },
        {
            id: "irving-chargers",
            src: irvingChargers,
            label: "Whipped cream chargers",
            caption: "Space Gas, Infuzd, Galaxy Gas and GoldWhip tanks.",
            alt: "A long shelf at Vapor Aura Irving lined with boxed Space Gas, Infuzd, Galaxy Gas and GoldWhip whipped cream charger tanks",
            focus: "50% 40%",
        },
    ],
};

// Every photo of a store, storefront first (the order the large viewer and structured data use)
export function allStorePhotos(set: StorePhotoSet): StorePhoto[] {
    return [set.storefront, ...set.inside];
}
