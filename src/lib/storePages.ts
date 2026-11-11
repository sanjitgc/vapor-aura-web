// Words for the two store pages (/sachse, /irving). Facts only: every line here must stay true
// for that store. Hours, address and phone come from stores.ts, so they update in one place.
import { categoryById, categoryHref } from "./catalog";
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
    // What stands out in this store, taken from photos of it. One line each.
    highlights: { name: string; text: string }[];
    findUs: string[];
    faq: { q: string; a: string }[];
}

const ID_ANSWER =
    "Yes. We sell only to adults 21 and over, and we check a valid photo ID on every purchase, no matter how old you look.";
const BRANDS_ANSWER =
    "Yes. We carry Geek Bar Pulse, Pulse X, Pulse 2 and Pulse X 2, plus Foger, RAZ, Lost Mary, Fifty Bar, UNO, Crown Bar and Olit, in a full range of flavors.";
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
                "Vapor Aura Sachse is on State Highway 78, with disposable vapes, e-liquid, ZYN, glass, hookah, vaporizers, kratom and CBD under one roof. We're open 7 AM to 1 AM Sunday through Wednesday and until 2 AM Thursday through Saturday, and our staff will help you pick the right device, flavor or coil.",
            highlights: [
                { name: "A wall of water pipes", text: "Shelf after shelf, from small rigs to tall beakers, with GRAV and Cheech glass up top." },
                { name: "A case of hand pipes", text: "Rows of glass hand pipes, from clear striped glass to solid colors." },
                { name: "Cold drinks", text: "A two-door cooler of kratom and kava drinks, Celsius, water and more." },
                { name: "Butane and torches", text: "Butane refills, Zippo and Ronsonol lighter fluid, and torch lighters." },
            ],
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
                {
                    q: "Do you carry Geek Bar, Foger and RAZ in Sachse?",
                    a: `${BRANDS_ANSWER} Flavors sell through fast, so call ${store.phone} to check one.`,
                },
                {
                    q: "Does the Sachse store sell glass and hookah supplies?",
                    a: "Yes. The Sachse store has a full wall of water pipes and a case of hand pipes, plus bangers and bowls. For hookah we carry hookah pots, Afzal shisha in every flavor and size, coals, hoses and bowls.",
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
            "Vapor Aura Irving on West Royal Lane never closes. We're open 24 hours a day, 7 days a week, with disposable vapes, e-liquid, ZYN, glass, hookah, vaporizers, kratom and CBD, and staff who know the products whatever time you stop by.",
        highlights: [
            { name: "A full e-liquid wall", text: "Coastal Clouds, Pacha, Juice Head, Candy King, Jam Monster, Sad Boy and more." },
            { name: "A case of vaporizers", text: "Puffco Peak and Proxy, Ooze, Yocan and Lookah, side by side so you can compare them." },
            { name: "Walls of hookahs and glass", text: "A wall of hookah pots and a long wall of water pipes, plus a case of quartz bangers." },
            { name: "Cigars and wraps", text: "Backwoods, Swisher Sweets, Game and hemp wraps fill a whole wall." },
            { name: "A whole case of grinders", text: "Metal and printed grinders." },
            { name: "Geek Bar and RAZ", text: "Geek Bar disposables fill the case, with RAZ on the shelf above." },
        ],
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
            {
                q: "Which vapes can I buy in Irving in the middle of the night?",
                a: `The same ones as during the day. ${BRANDS_ANSWER.replace("Yes. ", "")} We also carry ZYN, e-liquid, coils and pods around the clock.`,
            },
            {
                q: "Does the Irving store sell hookah, shisha and butane?",
                a: "Yes. We carry hookah pots, Afzal shisha in every flavor and size, coals and hoses, along with torch lighters, butane and lighter fluid, at any hour.",
            },
            { q: "Do you deliver in Irving?", a: DELIVERY_ANSWER },
        ],
    };
}

export const STORE_PAGES: Record<Store["slug"], StorePageCopy> = {
    sachse: copyFor("sachse"),
    irving: copyFor("irving"),
};

// The shelves listed on each store page. Each links to the category's own page, or to its spot
// on /products if it has none. Hemp flower, pre-rolls, gummies, drinks and mushroom products are
// left off on purpose: the federal hemp definition changes on December 11, 2026, so the store
// pages don't build search traffic around them.
const SHELVES: { id: string; label: string }[] = [
    { id: "vapes", label: "Disposable vapes" },
    { id: "e-liquid", label: "E-liquid" },
    { id: "nicotine-pouches", label: "ZYN & pouches" },
    { id: "coils-pods", label: "Coils & pods" },
    { id: "glass", label: "Glass" },
    { id: "hookah", label: "Hookah & shisha" },
    { id: "vaporizers", label: "Vaporizers" },
    { id: "kratom", label: "Kratom" },
    { id: "cbd", label: "CBD" },
    { id: "lighters", label: "Torches & butane" },
    { id: "grinders", label: "Grinders, trays & papers" },
    { id: "cigars-wraps", label: "Cigars & wraps" },
];

export function storeShelves() {
    return SHELVES.map(({ id, label }) => {
        const category = categoryById(id);
        if (!category?.short) throw new Error(`Category ${id} needs a short description`);
        return { id, label, text: category.short, href: categoryHref(category) };
    });
}
