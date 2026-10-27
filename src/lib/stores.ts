// One source of truth for both stores. The site, the structured data (schema.org) and the sitemap
// all read from here, so the name, address, phone and hours never drift apart.
// Keep every value identical to the store's Google Business Profile, character for character.

// The production address of the site. Vercel serves the site on www (vaporauratx.com redirects to it),
// so canonicals, the sitemap and structured data all point at www. Previews use the same value on
// purpose: Vercel marks preview deployments noindex, and their canonicals should name production.
export const SITE_URL = "https://www.vaporauratx.com";
export const SITE_NAME = "Vapor Aura";

export const SOCIAL = {
    instagram: "https://www.instagram.com/vaporaurasmokeshop/",
    facebook: "https://www.facebook.com/profile.php?id=61588307159610",
};

// Vapor Aura's own delivery ordering site. While it's under maintenance, "Order with us"
// shows a notice pointing to DoorDash instead (src/components/home/OrderWithUs.tsx).
export const OWN_DELIVERY_URL = "https://www.vaporauradelivery.com";

// Public DoorDash page for Vapor Aura (DoorDash business ID 25183571). Customers pick a store
// there, the same way howdyvapes.com sends people to its DoorDash business page.
// Every "Order online" button on the site uses this one link.
export const DOORDASH_URL = "https://www.doordash.com/business/vapor-aura-25183571/";

export type DayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface OpeningHours {
    days: DayName[];
    // 24-hour "HH:MM". Closing after midnight is written as the next day's time (schema.org style).
    opens: string;
    closes: string;
}

export interface Store {
    slug: "sachse" | "irving";
    // Page on this site for the store (its Google Business Profile website link should point here)
    path: string;
    name: string;
    city: string;
    street: string;
    zip: string;
    phone: string;
    tel: string;
    hoursSummary: string;
    openingHours: OpeningHours[];
    // From the store's Google Maps listing
    placeId: string;
    mapsCid: string;
    geo: { latitude: number; longitude: number };
    // How locals describe where the store is
    roadName: string;
    // Nearby places customers come from, as written on the store's page. Real places only.
    nearbyAreas: string[];
    // Cities and neighborhoods listed as areaServed in structured data
    servedPlaces: string[];
}

export const STORES: Store[] = [
    {
        slug: "sachse",
        path: "/sachse",
        name: "Vapor Aura – Sachse",
        street: "5848 S State Hwy 78 #108",
        city: "Sachse",
        zip: "75048",
        phone: "(214) 501-3222",
        tel: "tel:+12145013222",
        // Invisible no-break characters keep "7 AM–1 AM" and "Thu–Sat" from splitting across lines
        hoursSummary: "Sun⁠–⁠Wed 7 AM⁠–⁠1 AM, Thu⁠–⁠Sat 7 AM⁠–⁠2 AM",
        openingHours: [
            { days: ["Sunday", "Monday", "Tuesday", "Wednesday"], opens: "07:00", closes: "01:00" },
            { days: ["Thursday", "Friday", "Saturday"], opens: "07:00", closes: "02:00" },
        ],
        placeId: "ChIJh7JK5L4cTIYRaihQD9r8L6I",
        mapsCid: "11686837571539708010",
        geo: { latitude: 32.9755557, longitude: -96.5956142 },
        roadName: "State Highway 78",
        nearbyAreas: ["Wylie", "Murphy", "Rowlett", "Garland's Firewheel area", "Lavon"],
        servedPlaces: ["Sachse", "Wylie", "Murphy", "Rowlett", "Garland", "Lavon"],
    },
    {
        slug: "irving",
        path: "/irving",
        name: "Vapor Aura – Irving",
        street: "825 W Royal Ln Suite 140",
        city: "Irving",
        zip: "75039",
        phone: "(214) 272-8395",
        tel: "tel:+12142728395",
        hoursSummary: "Open 24 hours",
        openingHours: [
            {
                days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "00:00",
                closes: "23:59",
            },
        ],
        placeId: "ChIJSXgK3VwpTIYRZAsYO75NKzY",
        mapsCid: "3903298981477223268",
        geo: { latitude: 32.8970521, longitude: -96.9607661 },
        roadName: "West Royal Lane",
        nearbyAreas: ["Las Colinas", "Valley Ranch", "Coppell", "Farmers Branch", "the DFW Airport area"],
        servedPlaces: ["Irving", "Las Colinas", "Valley Ranch", "Coppell", "Farmers Branch"],
    },
];

export function getStore(slug: Store["slug"]): Store {
    const store = STORES.find((s) => s.slug === slug);
    if (!store) throw new Error(`Unknown store: ${slug}`);
    return store;
}

export function fullAddress(store: Store): string {
    return `${store.street}, ${store.city}, TX ${store.zip}`;
}

// The store's Google Maps listing (its Google Business Profile)
export function mapsListingUrl(store: Store): string {
    return `https://maps.google.com/?cid=${store.mapsCid}`;
}

// Opens Google's "write a review" box for the store directly
export function writeReviewUrl(store: Store): string {
    return `https://search.google.com/local/writereview?placeid=${store.placeId}`;
}

export function directionsUrl(store: Store): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress(store))}&destination_place_id=${store.placeId}`;
}

export function mapEmbedUrl(store: Store): string {
    return `https://maps.google.com/maps?q=${encodeURIComponent(`Vapor Aura, ${fullAddress(store)}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
}

// "+1-214-501-3222" for structured data
export function schemaPhone(store: Store): string {
    const digits = store.tel.replace(/\D/g, "");
    return `+${digits.slice(0, 1)}-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
}

const WEEK: DayName[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function formatTime(hhmm: string): string {
    const [h, m] = hhmm.split(":").map(Number);
    const h12 = h % 12 || 12;
    return `${h12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
}

// Monday-first list of each day's hours as people read them, e.g. "7 AM – 1 AM" or "Open 24 hours"
export function weeklyHours(store: Store): { day: DayName; time: string }[] {
    return WEEK.map((day) => {
        const block = store.openingHours.find((h) => h.days.includes(day));
        if (!block) return { day, time: "Closed" };
        if (block.opens === "00:00" && block.closes === "23:59") return { day, time: "Open 24 hours" };
        return { day, time: `${formatTime(block.opens)} – ${formatTime(block.closes)}` };
    });
}
