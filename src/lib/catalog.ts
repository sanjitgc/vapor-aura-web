// What's on the shelves at both stores. Display only; nothing here is sold online.
// Each category has a stable id so other pages can link straight to it (/products#hookah).
export interface ProductCategory {
    id: string;
    name: string;
    description: string;
    // One line for store pages (no brand names)
    short?: string;
}

// The main shelves: two rows of four on desktop.
export const CATEGORIES: ProductCategory[] = [
    {
        id: "vapes",
        name: "Vape",
        description: "Disposables, pod systems and devices from Geek Bar, Lost Mary, RAZ, Foger, Fifty Bar and more.",
        short: "Disposables, pod kits and devices",
    },
    {
        id: "e-liquid",
        name: "E-Juices",
        description: "Freebase and nicotine salt e-liquids from Naked and more.",
        short: "Freebase and nicotine salt e-liquid",
    },
    {
        id: "glass",
        name: "Glass",
        description: "Water pipes, bubblers, hand pipes and rigs, plus bowls and cleaners.",
        short: "Water pipes, bubblers, hand pipes and rigs",
    },
    {
        id: "vaporizers",
        name: "Vaporizer",
        description:
            "Dry herb and concentrate vaporizers and Puffco devices, plus 510 batteries like the Cartbox and cart pens.",
        short: "Dry herb and concentrate vaporizers, 510 batteries",
    },
    {
        id: "hookah",
        name: "Hookah",
        description: "Hookahs, bowls, hoses, coals and shisha, plus spare parts.",
        short: "Hookahs, bowls, hoses, coals and shisha",
    },
    {
        id: "flower",
        name: "Flower & pre-rolls",
        description: "Hemp flower and pre-rolls in a range of strains, plus rolling trays.",
    },
    {
        id: "kratom",
        name: "Kratom",
        description: "Kratom capsules, powders, tablets and shots from established brands.",
        short: "Capsules, powders, tablets and shots",
    },
    {
        id: "cbd",
        name: "CBD",
        description: "Tinctures, gummies, capsules and topicals in a range of strengths.",
        short: "Tinctures, gummies, capsules and topicals",
    },
];

export const MORE_CATEGORIES: ProductCategory[] = [
    {
        id: "edibles",
        name: "Edibles",
        description: "Hemp-derived gummies, chocolates and treats.",
    },
    {
        id: "mushroom",
        name: "Mushroom",
        description: "Mushroom gummies and chocolates in a variety of flavors.",
    },
    {
        id: "detox",
        name: "Detox",
        description: "Detox drinks in popular flavors, plus other cleanse products.",
    },
    {
        id: "pet-cbd",
        name: "CBD for pets",
        description: "CBD treats and tinctures made just for pets.",
    },
    {
        id: "coils-pods",
        name: "Coils / Pods",
        description: "Replacement coils and pods for SMOK, GeekVape and more.",
        short: "Replacement coils and pods",
    },
    {
        id: "lighters",
        name: "Lighters & torches",
        description: "Pocket and torch lighters, plus butane and Zippo fluid for refills.",
        short: "Pocket and torch lighters, butane, lighter fluid",
    },
    {
        id: "candles-incense",
        name: "Candles & incense",
        description: "Scented candles and incense, plus air fresheners and odor eliminators.",
        short: "Candles, incense and odor eliminators",
    },
    {
        id: "more",
        name: "And more",
        description: "New products arrive all the time. Stop by or call either store to ask.",
    },
];

export function categoryById(id: string): ProductCategory | undefined {
    return [...CATEGORIES, ...MORE_CATEGORIES].find((c) => c.id === id);
}
