// Words for the two store pages (/sachse, /irving). Facts only: every line here must stay true
// for that store. Hours, address and phone come from stores.ts, so they update in one place.
import { categoryById } from "./catalog";
import { categoryPagePath } from "./categoryPages";
import { fullAddress, getStore, type Store } from "./stores";

export interface StorePageCopy {
    slug: Store["slug"];
    // <title>, under 60 characters
    metaTitle: string;
    // Meta description, about 150 characters
    metaDescription: string;
    // Small line above the H1
    kicker: string;
    h1: string;
    intro: string;
    findUs: string[];
    faq: { q: string; a: string }[];
}

const ID_ANSWER =
    "Yes. We sell only to adults 21 and over, and we check a valid photo ID on every purchase, no matter how old you look.";
const DELIVERY_ANSWER =
    "You can order from Vapor Aura on DoorDash for delivery, though DoorDash carries only part of our in-store selection. For the full range, stop by the store.";

function copyFor(slug: Store["slug"]): StorePageCopy {
    const store = getStore(slug);
    const areas = store.nearbyAreas;
    const areaList = `${areas.slice(0, -1).join(", ")} and ${areas.at(-1)}`;

    if (slug === "sachse") {
        return {
            slug,
            metaTitle: "Vape & Smoke Shop in Sachse, TX | Vapor Aura Sachse",
            metaDescription: `Vapor Aura Sachse, ${store.street}: vapes, e-liquid, coils, glass and hookah. Open 7 AM–1 AM, until 2 AM Thu–Sat. Call ${store.phone}. 21+.`,
            kicker: "Vapor Aura Sachse",
            h1: "Vape & smoke shop in Sachse, TX",
            intro:
                "Vapor Aura Sachse is on State Highway 78, with vapes, e-liquid, coils, glass, hookah, vaporizers, kratom and CBD under one roof. We're open 7 AM to 1 AM Sunday through Wednesday and until 2 AM Thursday through Saturday, and our staff will help you pick the right device, flavor or coil.",
            findUs: [
                `You'll find us at ${fullAddress(store)}, on ${store.roadName}. We're an easy stop for customers from Sachse and nearby ${areaList}.`,
                "Need something after we close? Our Irving store is open 24 hours.",
            ],
            faq: [
                {
                    q: "What are the Sachse store hours?",
                    a: "We're open 7 AM to 1 AM Sunday through Wednesday, and 7 AM to 2 AM Thursday, Friday and Saturday.",
                },
                { q: "Do I need ID to shop?", a: ID_ANSWER },
                {
                    q: "Can I check if you have something before I drive over?",
                    a: `Yes. Call the Sachse store at ${store.phone} and we'll check the shelf for you.`,
                },
                { q: "Do you deliver in Sachse?", a: DELIVERY_ANSWER },
            ],
        };
    }

    return {
        slug,
        metaTitle: "24-Hour Vape & Smoke Shop in Irving, TX | Vapor Aura",
        metaDescription: `Vapor Aura Irving, ${store.street}, is open 24 hours, 7 days: vapes, e-liquid, coils, glass and hookah near Las Colinas. Call ${store.phone}. 21+.`,
        kicker: "Vapor Aura Irving",
        h1: "24-hour vape & smoke shop in Irving, TX",
        intro:
            "Vapor Aura Irving on West Royal Lane never closes. We're open 24 hours a day, 7 days a week, with vapes, e-liquid, coils, glass, hookah, vaporizers, kratom and CBD, and staff who know the products whatever time you stop by.",
        findUs: [
            `You'll find us at ${fullAddress(store)}, on ${store.roadName} in north Irving. Customers stop by from Irving and nearby ${areaList}, at any hour of the day or night.`,
        ],
        faq: [
            {
                q: "Is the Irving store really open 24 hours?",
                a: "Yes. Vapor Aura Irving is open 24 hours a day, 7 days a week.",
            },
            { q: "Do I need ID to shop?", a: ID_ANSWER },
            {
                q: "Can I check if you have something before I come in?",
                a: `Yes. Call the Irving store at ${store.phone} any time and we'll check the shelf for you.`,
            },
            { q: "Do you deliver in Irving?", a: DELIVERY_ANSWER },
        ],
    };
}

export const STORE_PAGES: Record<Store["slug"], StorePageCopy> = {
    sachse: copyFor("sachse"),
    irving: copyFor("irving"),
};

// The shelves listed on each store page, linking to the category's own page (/products/hookah) or,
// for categories without one, to its spot on /products (/products#kratom). Hemp flower, pre-rolls,
// edibles and mushroom products are left off on purpose: the federal hemp definition changes on
// December 11, 2026, so the store pages don't build search traffic around them.
const SHELVES: { id: string; label: string }[] = [
    { id: "vapes", label: "Vapes" },
    { id: "e-liquid", label: "E-liquid" },
    { id: "coils-pods", label: "Coils & pods" },
    { id: "glass", label: "Glass" },
    { id: "hookah", label: "Hookah & shisha" },
    { id: "vaporizers", label: "Vaporizers" },
    { id: "kratom", label: "Kratom" },
    { id: "cbd", label: "CBD" },
    { id: "lighters", label: "Lighters & torches" },
    { id: "candles-incense", label: "Candles & incense" },
];

export function storeShelves() {
    return SHELVES.map(({ id, label }) => {
        const category = categoryById(id);
        if (!category?.short) throw new Error(`Category ${id} needs a short description`);
        return { id, label, text: category.short, href: categoryPagePath(id) ?? `/products#${id}` };
    });
}
