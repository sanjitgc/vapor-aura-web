// Pages for the cities around each store (/smoke-shop/<slug>), for people searching "smoke shop
// near Coppell". We have no store in these cities, and every page says so plainly: it names the
// closest Vapor Aura, says where that is from the city, and links to directions from there.
// Facts only. No drive times are given because none were measured; add them here if you have them.
import { fullAddress, getStore, type Store } from "./stores";

interface Area {
    slug: string;
    // Name used in headings, e.g. "Coppell" or "DFW Airport"
    place: string;
    // Start point handed to Google Maps for directions
    mapsOrigin: string;
    store: Store["slug"];
    // Where the store is from this place. Completes "Our <city> store is ..."
    where: string;
    // One more true sentence about getting there or why people from here stop by
    detail: string;
}

const AREAS: Area[] = [
    {
        slug: "coppell",
        place: "Coppell",
        mapsOrigin: "Coppell, TX",
        store: "irving",
        where: "just south of Coppell in north Irving, on West Royal Lane near Valley Ranch",
        detail: "Coppell borders north Irving, so for most of the city we're the closest smoke shop that stays open all night.",
    },
    {
        slug: "grapevine",
        place: "Grapevine",
        mapsOrigin: "Grapevine, TX",
        store: "irving",
        where: "east of Grapevine, on the other side of DFW Airport, in north Irving",
        detail: "State Highway 114 runs from Grapevine past the airport into Irving, and we're open whatever time you make the drive.",
    },
    {
        slug: "farmers-branch",
        place: "Farmers Branch",
        mapsOrigin: "Farmers Branch, TX",
        store: "irving",
        where: "west of Farmers Branch in north Irving, on West Royal Lane",
        detail: "Head west on I-635 toward Irving. Because the store never closes, it's a common stop for people in Farmers Branch after other shops have shut.",
    },
    {
        slug: "carrollton",
        place: "Carrollton",
        mapsOrigin: "Carrollton, TX",
        store: "irving",
        where: "south-west of Carrollton in north Irving, on West Royal Lane",
        detail: "The President George Bush Turnpike runs from Carrollton down into Irving, and the store is open 24 hours when you get here.",
    },
    {
        slug: "dfw-airport",
        place: "DFW Airport",
        mapsOrigin: "DFW International Airport, TX",
        store: "irving",
        where: "east of DFW Airport in north Irving, on West Royal Lane near Las Colinas",
        detail: "We're open 24 hours, so a late arrival, an early flight or a night shift at the airport all work.",
    },
    {
        slug: "wylie",
        place: "Wylie",
        mapsOrigin: "Wylie, TX",
        store: "sachse",
        where: "south-west of Wylie in Sachse, on State Highway 78",
        detail: "Highway 78 runs straight from Wylie into Sachse, and the store is right on it.",
    },
    {
        slug: "garland",
        place: "Garland",
        mapsOrigin: "Garland, TX",
        store: "sachse",
        where: "north-east of Garland in Sachse, on State Highway 78",
        detail: "Highway 78 runs from Garland up into Sachse. We're closest to the Firewheel side of the city.",
    },
    {
        slug: "rowlett",
        place: "Rowlett",
        mapsOrigin: "Rowlett, TX",
        store: "sachse",
        where: "just north of Rowlett in Sachse, on State Highway 78",
        detail: "Sachse sits right above Rowlett, and we stay open until 1 AM most nights and 2 AM Thursday through Saturday.",
    },
    {
        slug: "murphy",
        place: "Murphy",
        mapsOrigin: "Murphy, TX",
        store: "sachse",
        where: "just south of Murphy in Sachse, on State Highway 78",
        detail: "Murphy and Sachse are neighbors, and we open at 7 AM every day for the morning drive.",
    },
];

export interface AreaPageCopy extends Area {
    path: string;
    h1: string;
    // <title>, 60 characters or fewer
    metaTitle: string;
    // 160 characters or fewer
    metaDescription: string;
    intro: string;
    directionsUrl: string;
    faq: { q: string; a: string }[];
}

function build(area: Area): AreaPageCopy {
    const store = getStore(area.store);
    const hours = store.slug === "irving" ? "open 24 hours, 7 days a week" : `open ${store.hoursSummary}`;
    const name = `Vapor Aura ${store.city}`;
    return {
        ...area,
        path: `/smoke-shop/${area.slug}`,
        h1: `Vape & smoke shop near ${area.place}, TX`,
        metaTitle: `Smoke Shop near ${area.place}, TX | ${name}`,
        metaDescription: `Closest Vapor Aura to ${area.place}: our ${store.city} store, ${store.street}, ${store.slug === "irving" ? "open 24 hours" : "open until 1–2 AM"}. Vapes, ZYN, glass, hookah, kratom. ${store.phone}.`,
        intro: `We don't have a store in ${area.place} itself. The closest Vapor Aura is our ${store.city} store, ${area.where}. It's ${hours}. ${area.detail}`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(area.mapsOrigin)}&destination=${encodeURIComponent(fullAddress(store))}&destination_place_id=${store.placeId}`,
        faq: [
            {
                q: `Is there a Vapor Aura in ${area.place}?`,
                a: `No. The closest Vapor Aura to ${area.place} is ${name} at ${fullAddress(store)}, ${area.where}.`,
            },
            {
                q: `What are the hours of the closest store to ${area.place}?`,
                a: `${name} is ${hours}. Hours can change on holidays, so call ${store.phone} if you're cutting it close.`,
            },
            {
                q: `Do you deliver to ${area.place}?`,
                a: `You can order from Vapor Aura on DoorDash, which carries part of our in-store range. Enter your address in DoorDash to see whether it delivers to you in ${area.place}.`,
            },
            {
                q: "Can I check if you have something before I drive over?",
                a: `Yes. Call ${name} at ${store.phone} and we'll check the shelf for you.`,
            },
        ],
    };
}

export const AREA_PAGES: AreaPageCopy[] = AREAS.map(build);

export function areaPage(slug: string): AreaPageCopy | undefined {
    return AREA_PAGES.find((page) => page.slug === slug);
}

export function areasNear(store: Store["slug"]): AreaPageCopy[] {
    return AREA_PAGES.filter((page) => page.store === store);
}
