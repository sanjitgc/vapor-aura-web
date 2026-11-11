// Words for the category pages (/products/<slug>). Facts only: brands come from the owner's own
// list (Nov 2026) and from photos taken in the stores. Nothing here promises a price or that a
// particular flavor is in stock today; the pages tell people to call and check.
import { STORES } from "./stores";

export interface CategoryPageCopy {
    slug: string;
    // The matching entry in catalog.ts
    categoryId: string;
    // Short name for breadcrumbs and links
    name: string;
    h1: string;
    // <title>, 60 characters or fewer
    metaTitle: string;
    // 160 characters or fewer
    metaDescription: string;
    intro: string;
    // What's on the shelf, in a few named groups
    shelf: { name: string; text: string }[];
    brands: string[];
    faq: { q: string; a: string }[];
    // Other category pages worth a look from this one
    related: string[];
}

const sachse = STORES.find((store) => store.slug === "sachse")!;
const irving = STORES.find((store) => store.slug === "irving")!;

const CALL = `Call Sachse at ${sachse.phone} or Irving at ${irving.phone} and we'll check the shelf for you.`;
const ID = "We sell only to adults 21 and over and check a valid photo ID on every purchase.";
const BOTH = "Yes. Both the Sachse store and the Irving store carry them, and Irving is open 24 hours.";

export const CATEGORY_PAGES: CategoryPageCopy[] = [
    {
        slug: "disposable-vapes",
        categoryId: "vapes",
        name: "Disposable vapes",
        h1: "Disposable vapes in Sachse & Irving, TX",
        metaTitle: "Disposable Vapes in Sachse & Irving, TX | Vapor Aura",
        metaDescription:
            "Geek Bar Pulse, Foger, RAZ, Lost Mary, Fifty Bar, UNO, Crown Bar and Olit disposables at Vapor Aura in Sachse and Irving, TX. Irving is open 24 hours.",
        intro:
            "Disposables fill more of our cases than anything else. Both stores carry the full Geek Bar Pulse line and the other names people ask for, in a full range of flavors. Flavors sell through fast, so call before you drive over for a specific one.",
        shelf: [
            {
                name: "Geek Bar",
                text: "Geek Bar Pulse, Pulse X, Pulse 2 and Pulse X 2 in the full flavor range, plus Geek Bar's hookah-style vapes.",
            },
            { name: "Foger", text: "Foger disposables across the flavor range." },
            { name: "RAZ", text: "RAZ disposables across the flavor range." },
            { name: "Lost Mary", text: "Lost Mary disposables across the flavor range." },
            { name: "Fifty Bar, UNO & Crown Bar", text: "All three, across the flavor range." },
            { name: "Olit & Off-Stamp", text: "Olit and Off-Stamp disposables." },
        ],
        brands: ["Geek Bar", "Foger", "RAZ", "Lost Mary", "Fifty Bar", "UNO", "Crown Bar", "Olit", "Off-Stamp"],
        faq: [
            {
                q: "Which Geek Bar models do you carry?",
                a: "Geek Bar Pulse, Pulse X, Pulse 2 and Pulse X 2, along with Geek Bar's hookah-style vapes.",
            },
            { q: "Do you have a specific flavor in stock?", a: `Flavors sell through quickly. ${CALL}` },
            { q: "Do both stores carry disposable vapes?", a: BOTH },
            { q: "Do I need ID to buy a vape?", a: `Yes. ${ID}` },
        ],
        related: ["e-liquid", "nicotine-pouches", "vaporizers"],
    },
    {
        slug: "e-liquid",
        categoryId: "e-liquid",
        name: "E-liquid",
        h1: "E-liquid & vape juice in Sachse & Irving, TX",
        metaTitle: "E-Liquid & Vape Juice in Sachse & Irving | Vapor Aura",
        metaDescription:
            "Freebase and nicotine salt e-liquid from Naked, Coastal Clouds, Pacha, Juice Head, Candy King, Jam Monster and Sad Boy at Vapor Aura in Sachse and Irving. 21+.",
        intro:
            "If you refill your own device, we keep both kinds of e-liquid: freebase for sub-ohm tanks and nicotine salt for pod systems. The Irving store has a full wall of it. Tell our staff what device you use and we'll point you to the right bottle.",
        shelf: [
            { name: "Freebase e-liquid", text: "For sub-ohm tanks and other higher-power devices." },
            { name: "Nicotine salt", text: "Salt nicotine e-liquid for pod systems and low-power devices." },
            { name: "Coils & pods", text: "Replacement coils and pods for the devices we carry, so you can pick up both in one stop." },
        ],
        brands: ["Naked", "Coastal Clouds", "Pacha", "Juice Head", "Candy King", "Jam Monster", "Sad Boy"],
        faq: [
            {
                q: "What's the difference between freebase and nicotine salt e-liquid?",
                a: "Freebase e-liquid is made for higher-power devices such as sub-ohm tanks. Nicotine salt e-liquid is made for pod systems and other low-power devices. Bring your device in and we'll match the right one.",
            },
            { q: "Do you carry coils and pods too?", a: "Yes. We carry replacement coils and pods for the devices we sell. " + CALL },
            { q: "Can I check for a flavor before I come in?", a: `Yes. ${CALL}` },
        ],
        related: ["disposable-vapes", "nicotine-pouches", "vaporizers"],
    },
    {
        slug: "nicotine-pouches",
        categoryId: "nicotine-pouches",
        name: "ZYN & nicotine pouches",
        h1: "ZYN nicotine pouches in Sachse & Irving, TX",
        metaTitle: "ZYN Nicotine Pouches in Sachse & Irving | Vapor Aura",
        metaDescription:
            "ZYN nicotine pouches in the full flavor range at Vapor Aura in Sachse and Irving, TX. The Irving store is open 24 hours. Call to check a flavor. 21+.",
        intro:
            "Both stores carry ZYN nicotine pouches in the full flavor range. Pouches are smoke-free and need no device. If you're after one flavor or strength, call first and we'll set eyes on the shelf.",
        shelf: [
            { name: "ZYN", text: "The full ZYN flavor range." },
            { name: "Open late", text: `Irving is open 24 hours. Sachse is open ${sachse.hoursSummary}.` },
        ],
        brands: ["ZYN"],
        faq: [
            { q: "Which ZYN flavors do you carry?", a: `We carry the full ZYN flavor range. Stock moves quickly, so for one flavor or strength: ${CALL}` },
            { q: "Can I buy ZYN late at night?", a: `Yes. The Irving store at ${irving.street} is open 24 hours, and the Sachse store is open ${sachse.hoursSummary}.` },
            { q: "Do I need ID to buy nicotine pouches?", a: `Yes. ${ID}` },
        ],
        related: ["disposable-vapes", "e-liquid"],
    },
    {
        slug: "hookah",
        categoryId: "hookah",
        name: "Hookah & shisha",
        h1: "Hookah, shisha & accessories in Sachse & Irving, TX",
        metaTitle: "Hookah & Shisha in Sachse & Irving, TX | Vapor Aura",
        metaDescription:
            "Hookah pots, Afzal shisha in every flavor and size, bowls, hoses and coals at Vapor Aura in Sachse and Irving, TX. The Irving store is open 24 hours. 21+.",
        intro:
            "Everything for a hookah session is in one place: the hookah itself, the shisha and the parts that wear out. We carry Afzal shisha in every flavor, in every size, at both stores.",
        shelf: [
            { name: "Hookah pots", text: "Complete hookahs, ready to set up." },
            { name: "Afzal shisha", text: "Every Afzal flavor, in every size." },
            { name: "Accessories", text: "Bowls, hoses, coals and the spare parts that keep a hookah going." },
            { name: "Hookah-style vapes", text: "Geek Bar's hookah-style vapes, if you want the flavor without the setup." },
        ],
        brands: ["Afzal"],
        faq: [
            { q: "Which shisha do you carry?", a: "Afzal shisha in every flavor and every size." },
            { q: "Do you sell hookah coals and replacement parts?", a: "Yes. We carry coals, bowls, hoses and other hookah accessories at both stores." },
            { q: "Can I buy hookah supplies late at night?", a: `Yes. The Irving store is open 24 hours, and the Sachse store is open ${sachse.hoursSummary}.` },
        ],
        related: ["torches-butane", "disposable-vapes", "glass"],
    },
    {
        slug: "glass",
        categoryId: "glass",
        name: "Glass",
        h1: "Glass water pipes & hand pipes in Sachse & Irving, TX",
        metaTitle: "Glass Water Pipes & Hand Pipes in Sachse & Irving, TX",
        metaDescription:
            "Water pipes, hand pipes, bubblers, rigs, bangers, bowls and dugouts at Vapor Aura in Sachse and Irving, TX. See photos of the glass wall. 21+.",
        intro:
            "Glass is best picked in person, so we keep a lot of it out where you can see it. The Sachse store has a full wall of water pipes and a case of hand pipes, and Irving keeps its glass along the back wall.",
        shelf: [
            { name: "Water pipes", text: "From small rigs to tall beakers, in glass and silicone." },
            { name: "Hand pipes & bubblers", text: "Rows of hand pipes, from clear striped glass to solid colors." },
            { name: "Bangers & bowls", text: "Replacement bangers and bowls when yours breaks or you want an upgrade." },
            { name: "Dugouts", text: "Pocket-size dugouts." },
            { name: "Cleaner", text: "Glass cleaner to keep a piece looking new." },
        ],
        brands: ["GRAV", "Cheech"],
        faq: [
            { q: "What kinds of glass do you carry?", a: "Water pipes, hand pipes, bubblers and rigs, plus bangers, bowls and dugouts." },
            { q: "Do you sell replacement bowls and bangers?", a: "Yes. Bring your piece or know its joint size, and we'll help you find one that fits." },
            { q: "Which store has more glass?", a: "Both stores carry glass. The photos on this page show the water pipe wall and the hand pipe case at the Sachse store." },
        ],
        related: ["grinders-trays", "torches-butane", "vaporizers"],
    },
    {
        slug: "vaporizers",
        categoryId: "vaporizers",
        name: "Vaporizers & 510 batteries",
        h1: "Vaporizers & 510 batteries in Sachse & Irving, TX",
        metaTitle: "Vaporizers & 510 Batteries in Sachse & Irving, TX",
        metaDescription:
            "Puffco and Ooze vaporizers, dry herb and concentrate devices, and 510 batteries like the Cartbox at Vapor Aura in Sachse and Irving, TX. 21+.",
        intro:
            "Vaporizers sit in the center case at the Irving store, where you can compare them side by side. We carry dry herb and concentrate devices, and 510 batteries in pen and compact styles.",
        shelf: [
            { name: "Concentrate vaporizers", text: "Puffco devices and other concentrate vaporizers." },
            { name: "Dry herb vaporizers", text: "Dry herb vaporizers." },
            { name: "510 batteries", text: "Cart pens and compact batteries like the Cartbox." },
        ],
        brands: ["Puffco", "Ooze", "Cartbox"],
        faq: [
            { q: "Do you sell 510 batteries?", a: "Yes. We carry 510 batteries in pen and compact styles, including the Cartbox." },
            { q: "Do you carry Puffco?", a: `Yes. Puffco devices are in the center case at the Irving store. For a specific model at either store: ${CALL}` },
            { q: "Can someone help me choose a vaporizer?", a: "Yes. Tell our staff whether you use dry herb or concentrates and we'll compare the options with you." },
        ],
        related: ["glass", "grinders-trays", "torches-butane"],
    },
    {
        slug: "kratom",
        categoryId: "kratom",
        name: "Kratom",
        h1: "Kratom in Sachse & Irving, TX",
        metaTitle: "Kratom in Sachse & Irving, TX | Vapor Aura",
        metaDescription:
            "Kratom capsules, powders, tablets, shots and drinks from established brands at Vapor Aura in Sachse and Irving, TX. The Irving store is open 24 hours. 21+.",
        intro:
            "Both stores carry kratom from established brands, in whichever form you prefer. The Sachse store also keeps kratom drinks cold in the cooler.",
        shelf: [
            { name: "Capsules & tablets", text: "Pre-measured capsules and tablets." },
            { name: "Powders", text: "Kratom powder." },
            { name: "Shots & drinks", text: "Kratom shots and ready-to-drink cans, kept cold." },
        ],
        brands: [],
        faq: [
            { q: "What forms of kratom do you carry?", a: "Capsules, powders, tablets, shots and ready-to-drink cans." },
            { q: "Do I need ID to buy kratom?", a: `Yes. ${ID}` },
            { q: "Can I check if you have a brand before I come in?", a: `Yes. ${CALL}` },
        ],
        related: ["cbd", "disposable-vapes"],
    },
    {
        slug: "cbd",
        categoryId: "cbd",
        name: "CBD",
        h1: "CBD in Sachse & Irving, TX",
        metaTitle: "CBD in Sachse & Irving, TX | Vapor Aura",
        metaDescription:
            "CBD tinctures, gummies, capsules and topicals in a range of strengths, plus CBD for pets, at Vapor Aura in Sachse and Irving, TX. 21+.",
        intro:
            "We carry CBD in the forms people ask for most, in a range of strengths, at both stores. Not sure where to start? Ask our staff to show you the options.",
        shelf: [
            { name: "Tinctures", text: "CBD oil tinctures in a range of strengths." },
            { name: "Gummies & capsules", text: "Pre-measured CBD gummies and capsules." },
            { name: "Topicals", text: "CBD topicals." },
            { name: "Pet CBD", text: "CBD made for pets." },
        ],
        brands: [],
        faq: [
            { q: "What kinds of CBD do you carry?", a: "Tinctures, gummies, capsules and topicals, plus CBD for pets." },
            { q: "Do you carry CBD for pets?", a: "Yes. Both stores carry CBD made for pets." },
            { q: "Can I check what's in stock?", a: `Yes. ${CALL}` },
        ],
        related: ["kratom", "vaporizers"],
    },
    {
        slug: "torches-butane",
        categoryId: "lighters",
        name: "Torches & butane",
        h1: "Torch lighters & butane in Sachse & Irving, TX",
        metaTitle: "Torch Lighters & Butane in Sachse & Irving | Vapor Aura",
        metaDescription:
            "Torch lighters, everyday lighters, butane refills and Zippo and Ronsonol lighter fluid at Vapor Aura in Sachse and Irving, TX. Irving is open 24 hours.",
        intro:
            "Out of butane at midnight? Both stores keep torch lighters and butane refills on the shelf, along with lighter fluid, and the Irving store never closes.",
        shelf: [
            { name: "Torch lighters", text: "Torch lighters in a range of styles." },
            { name: "Butane", text: "Butane refill cans." },
            { name: "Lighter fluid", text: "Zippo and Ronsonol lighter fluid." },
            { name: "Everyday lighters", text: "Pocket lighters." },
        ],
        brands: ["Zippo", "Ronsonol"],
        faq: [
            { q: "Do you sell butane?", a: "Yes. Both stores carry butane refill cans, along with Zippo and Ronsonol lighter fluid." },
            { q: "Where can I buy a torch lighter late at night?", a: `The Irving store at ${irving.street} is open 24 hours. The Sachse store is open ${sachse.hoursSummary}.` },
        ],
        related: ["glass", "hookah", "grinders-trays"],
    },
    {
        slug: "grinders-trays",
        categoryId: "grinders",
        name: "Grinders & trays",
        h1: "Grinders & rolling trays in Sachse & Irving, TX",
        metaTitle: "Grinders & Rolling Trays in Sachse & Irving | Vapor Aura",
        metaDescription:
            "Metal and printed grinders and rolling trays at Vapor Aura in Sachse and Irving, TX. See the grinder case at the Irving store. 21+.",
        intro:
            "The Irving store has a whole case of grinders, from plain metal to printed designs, and both stores carry rolling trays to go with them.",
        shelf: [
            { name: "Grinders", text: "Metal and printed grinders." },
            { name: "Rolling trays", text: "Rolling trays to go with them." },
        ],
        brands: [],
        faq: [
            { q: "Do you sell grinders?", a: "Yes. Both stores carry grinders, and the Irving store has a full case of metal and printed designs." },
            { q: "Do you sell rolling trays?", a: "Yes. Both stores carry rolling trays." },
        ],
        related: ["glass", "torches-butane", "vaporizers"],
    },
];

export function categoryPage(slug: string): CategoryPageCopy | undefined {
    return CATEGORY_PAGES.find((page) => page.slug === slug);
}
