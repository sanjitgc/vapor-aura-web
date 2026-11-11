// What's on the shelves in both stores. This one list feeds the home page, /products and the
// store pages. Display only: nothing here is sold online.
//
// Brand names come from the owner's own list (Nov 2026) and from photos taken in the stores.
// The owner also confirmed (Nov 2026) that the stores carry the popular vape and accessory brands
// in general, so well-known names are listed; take out any the stores stop carrying. Most
// names were then checked against photos of the Irving shelves the owner sent.
// Nitrous oxide is listed as whipped cream chargers for culinary use: the stores hold the Texas
// health department permit that sale requires. 7-OH products are left off on purpose.

export interface ProductCategory {
    id: string;
    name: string;
    description: string;
    // One line for the store pages: what's on the shelf, without brand names
    short?: string;
    // The category's own page under /products/<page>, if it has one (see categoryPages.ts)
    page?: string;
    // Hemp-derived THC products. The federal rules for these change on December 11, 2026.
    // They have their own pages at the owner's request but stay off the store pages.
    // To take them and their pages off the site in one step, set SHOW_HEMP_THC to false.
    hempThc?: boolean;
}

export const SHOW_HEMP_THC = true;

const MAIN: ProductCategory[] = [
    {
        id: "vapes",
        name: "Disposable vapes",
        description:
            "Geek Bar Pulse, Pulse X, Pulse 2 and Pulse X 2, plus Foger, RAZ, Lost Mary, Fifty Bar, UNO, Crown Bar, Olit, Nexa, Adjust, Kado Bar, Flum, Breeze and hookah-style vapes.",
        short: "Disposables in a full range of flavors",
        page: "disposable-vapes",
    },
    {
        id: "e-liquid",
        name: "E-liquid",
        description:
            "Freebase and nicotine salt e-liquid from Naked, Coastal Clouds, Pacha, Juice Head, Jam Monster and more, plus SMOK, Uwell, Vaporesso, Geekvape and Voopoo pod kits.",
        short: "Freebase and nicotine salt e-liquid",
        page: "e-liquid",
    },
    {
        id: "nicotine-pouches",
        name: "ZYN & pouches",
        description: "ZYN nicotine pouches in the full flavor range.",
        short: "Nicotine pouches in the full flavor range",
        page: "nicotine-pouches",
    },
    {
        id: "hookah",
        name: "Hookah & shisha",
        description:
            "Hookah pots, Afzal shisha in every flavor and size, and the accessories: bowls, hoses, CocoNara coals and more.",
        short: "Hookah pots, shisha, bowls, hoses and coals",
        page: "hookah",
    },
    {
        id: "glass",
        name: "Glass",
        description: "Water pipes, hand pipes, bubblers and rigs, plus quartz bangers, nectar collectors, one-hitters, bowls and dugouts.",
        short: "Water pipes, hand pipes, rigs, bangers and bowls",
        page: "glass",
    },
    {
        id: "vaporizers",
        name: "Vaporizers & 510 batteries",
        description:
            "Puffco Peak and Proxy, Ooze, Yocan and Lookah vaporizers, plus 510 batteries like the Cartbox and cart pens.",
        short: "Dry herb and concentrate vaporizers, 510 batteries",
        page: "vaporizers",
    },
    {
        id: "kratom",
        name: "Kratom",
        description: "Kratom capsules, powders and shots from OPMS and Remarkable Herbs, Club13 kratom seltzers and Feel Free.",
        short: "Capsules, powders, tablets, shots and drinks",
        page: "kratom",
    },
    {
        id: "cbd",
        name: "CBD",
        description: "Tinctures, gummies, capsules and topicals in a range of strengths, plus CBD for pets.",
        short: "Tinctures, gummies, capsules and topicals",
        page: "cbd",
    },
    {
        id: "lighters",
        name: "Torches & butane",
        description: "Maven and Eagle torches, BIC, Clipper and Zippo lighters, Neon butane refills and Zippo and Ronsonol lighter fluid.",
        short: "Torch lighters, lighters, butane and lighter fluid",
        page: "torches-butane",
    },
    {
        id: "grinders",
        name: "Grinders, trays & papers",
        description: "Metal and printed grinders, rolling trays, and RAW, Zig-Zag, Elements and Blazy Susan papers and cones.",
        short: "Grinders, rolling trays, papers and cones",
        page: "grinders-trays",
    },
    {
        id: "edibles",
        name: "Gummies",
        description: "Hemp-derived gummies from Urb, Sherpa, Camino, Sivan, Mood, Snoozy, Jelly, Half Bak'd and Xite.",
        hempThc: true,
        page: "hemp-gummies",
    },
    {
        id: "drinks",
        name: "Drinks",
        description: "THC seltzers from Torch, Zour Pop, Uncle Skunks, Sherpa, Mood and Amigos, and Club13 kratom seltzers, kept cold.",
        hempThc: true,
        page: "thc-drinks",
    },
    { id: "mushroom", name: "Mushroom gummies & chocolate", description: "Mushroom gummies and mushroom chocolate bars from Road Trip and more.", page: "mushroom-gummies-chocolate" },
    {
        id: "flower",
        name: "Flower & pre-rolls",
        description: "Hemp flower and pre-rolls from Mood, Urb and more, plus pure CBD pre-rolls.",
        hempThc: true,
        page: "flower-pre-rolls",
    },
    {
        id: "cigars-wraps",
        name: "Cigars & wraps",
        description: "Backwoods, Swisher Sweets, Game, White Owl and Black & Mild cigars, and Camo, Twisted Hemp and King Palm wraps.",
        short: "Cigars, cigarillos and wraps",
        page: "cigars-wraps",
    },
    {
        id: "cream-chargers",
        name: "Whipped cream chargers",
        description: "Galaxy Gas, Infuzd, Space Gas and GoldWhip nitrous oxide whipped cream chargers and tanks, sold for culinary use only. 21+ with ID.",
        page: "whipped-cream-chargers",
    },
];

const MORE: ProductCategory[] = [
    {
        id: "coils-pods",
        name: "Coils & pods",
        description: "Replacement coils and pods for Vaporesso XROS, Uwell Caliburn, SMOK and Geekvape devices, and the kits themselves.",
        short: "Replacement coils and pods",
    },
    { id: "detox", name: "Detox", description: "QCarbo and other detox drinks and cleansing kits." },
    {
        id: "candles-incense",
        name: "Candles & incense",
        description: "Candles, incense, Blunt Effects air fresheners and odor eliminator sprays.",
        short: "Candles, incense, air fresheners and odor eliminators",
    },
    {
        id: "cleaners",
        name: "Cleaners & care",
        description: "Formula 420, Formula 710 and Ooze Resolution cleaners, and the small parts that keep your piece working.",
    },
    {
        id: "scales-storage",
        name: "Scales, jars & ashtrays",
        description: "Digital pocket scales, stash jars, silicone containers and ashtrays.",
    },
    { id: "snacks", name: "Snacks", description: "Candy bars, gum, mints, chips and playing cards for the road." },
    { id: "more", name: "And more", description: "New arrivals land often. Ask our staff what's just come in." },
];

const shown = (list: ProductCategory[]) => list.filter((category) => SHOW_HEMP_THC || !category.hempThc);

export const CATEGORIES: ProductCategory[] = shown(MAIN);
export const MORE_CATEGORIES: ProductCategory[] = shown(MORE);

export function categoryById(id: string): ProductCategory | undefined {
    return [...CATEGORIES, ...MORE_CATEGORIES].find((category) => category.id === id);
}

// Where a category's link goes: its own page if it has one, otherwise its spot on /products
export function categoryHref(category: ProductCategory): string {
    return category.page ? `/products/${category.page}` : `/products#${category.id}`;
}
