// The home page FAQ. The same answers feed the FAQPage structured data and the chat assistant,
// so keep them factual and plain.
import { DOORDASH_URL, STORES } from "./stores";

const sachse = STORES.find((s) => s.slug === "sachse")!;
const irving = STORES.find((s) => s.slug === "irving")!;

export const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
    {
        q: "Do you check ID?",
        a: "Yes. Both stores sell only to adults 21 and over, and we check a valid photo ID for every purchase, no matter how old you look.",
    },
    {
        q: "Is the Irving store really open 24 hours?",
        a: `Yes. Vapor Aura Irving at ${irving.street}, Irving, TX ${irving.zip} is open 24 hours a day, 7 days a week. Call ${irving.phone}.`,
    },
    {
        q: "What are the Sachse store hours?",
        a: `Vapor Aura Sachse at ${sachse.street}, Sachse, TX ${sachse.zip} is open ${sachse.hoursSummary}. Call ${sachse.phone}.`,
    },
    {
        q: "Which disposable vapes do you carry?",
        a: "Geek Bar Pulse, Pulse X, Pulse 2 and Pulse X 2, plus Foger, RAZ, Lost Mary, Fifty Bar, UNO, Crown Bar, Olit, Off-Stamp, Nexa, Adjust, Kado Bar, Flum and Breeze, in a full range of flavors. Stock changes quickly, so call your store to check a specific flavor.",
    },
    {
        q: "What do you carry besides vapes?",
        a: "Along with vapes and e-liquid, we carry ZYN nicotine pouches, hookahs and Afzal shisha, glass water pipes and hand pipes, vaporizers and 510 batteries, kratom, CBD (including CBD for pets), gummies, mushroom gummies and chocolate, THC and kratom seltzers, hemp flower and pre-rolls, and Backwoods, Swisher Sweets and other cigars and wraps. You'll also find grinders, rolling trays, RAW and Zig-Zag papers, whipped cream chargers, torch lighters, butane and lighter fluid, candles, incense, detox drinks, and replacement coils and pods.",
    },
    {
        q: "Do you deliver?",
        a: "Yes. Right now you can order from Vapor Aura on DoorDash for delivery, though DoorDash carries only part of our in-store selection. We're also building our own delivery service, which will offer a much wider range of products. Stay tuned.",
        link: { href: DOORDASH_URL, label: "Order on DoorDash" },
    },
];
