// Words for the category pages (/products/<slug>). Each page answers a "[category] near me" search
// for both stores at once: what's on the shelf, how to choose, where to buy and common questions.
// One page per category covers Sachse and Irving together; separate near-copies per city would read
// to Google as doorway pages.
//
// Rules for everything in this file (from the local SEO report, "The rules"):
// - Describe categories, never brands. Texas SB 2024 bans marketing vapes made in China or other
//   "foreign adversary" countries, so no disposable or device brand names here.
// - No THC vapes, delta, kratom or mushroom products, and no health or quit-smoking claims.
// - Facts only. If a line stops being true for both stores, change it.
// tests/seo.test.ts checks title and description lengths and the banned words.
import { getStore } from "./stores";

export interface CategoryPageCopy {
    slug: string;
    path: string;
    // Short name for links, breadcrumbs and the footer
    name: string;
    // How the category reads mid-sentence: "Where to buy {topic} near you"
    topic: string;
    // Catalog ids (src/lib/catalog.ts) this page covers, so /products and the store pages link here
    catalogIds: string[];
    // Shows the FDA nicotine warning: the page advertises products that contain nicotine
    nicotine: boolean;
    // <title>, under 60 characters
    metaTitle: string;
    // Meta description, 120–160 characters
    metaDescription: string;
    // The H1 in two parts: the category, then the place. Read together they make one heading.
    h1: [string, string];
    intro: string;
    shelfTitle: string;
    shelf: { name: string; text: string }[];
    // Shown under the shelf, e.g. "sold for tobacco use only"
    shelfNote?: string;
    tipsTitle: string;
    tips: { title: string; text: string }[];
    faq: { q: string; a: string }[];
}

const sachse = getStore("sachse");
const irving = getStore("irving");

const PLACE = "in Sachse & Irving, TX";

const ID_ANSWER =
    "Yes. Vapor Aura sells only to adults 21 and over, and we check a valid photo ID on every purchase, no matter how old you look.";
const CALL_AHEAD_ANSWER = `Yes. Call Sachse at ${sachse.phone} or Irving at ${irving.phone} and we'll check the shelf before you drive over.`;
const LATE_ANSWER =
    "Our Irving store on West Royal Lane is open 24 hours, 7 days a week. Sachse is open until 1 AM Sunday through Wednesday and until 2 AM Thursday through Saturday.";
const DELIVERY_ANSWER =
    "You can order from Vapor Aura on DoorDash for delivery, though DoorDash carries only part of our in-store selection. For the full range, stop by either store.";

function orList(items: string[]): string {
    return items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;
}

// Which store to visit, by where the shopper is coming from. Shown under the store cards.
export function nearestStoreLine(): string {
    return `Coming from ${orList(sachse.nearbyAreas)}? The Sachse store on ${sachse.roadName} is closest. Near ${orList(irving.nearbyAreas)}? Head to Irving on ${irving.roadName}, open 24 hours.`;
}

export const CATEGORY_PAGES: CategoryPageCopy[] = [
    {
        slug: "disposable-vapes",
        path: "/products/disposable-vapes",
        name: "Disposable vapes",
        topic: "disposable vapes",
        catalogIds: ["vapes"],
        nicotine: true,
        metaTitle: "Disposable Vapes in Sachse & Irving, TX | Vapor Aura",
        metaDescription:
            "Disposable vapes in a range of sizes, nicotine strengths and flavors at Vapor Aura in Sachse and Irving, TX. Irving is open 24 hours. 21+ with ID.",
        h1: ["Disposable vapes", PLACE],
        intro: "Both Vapor Aura stores carry a range of disposable vapes, from small, light devices to larger rechargeable ones with adjustable airflow. Tell our staff the nicotine strength and flavor style you like and they'll point you to a good match. New devices arrive often and Texas rules change, so the lineup changes too. Call ahead if you're after a particular one.",
        shelfTitle: "What's on the disposables shelf",
        shelf: [
            {
                name: "Compact disposables",
                text: "Small, light devices with nothing to refill or charge. Easy to keep in a pocket.",
            },
            {
                name: "Rechargeable disposables",
                text: "Larger devices with a USB-C port, so the battery keeps up with the e-liquid inside.",
            },
            {
                name: "Adjustable airflow and screens",
                text: "Some devices let you open or tighten the draw, and show battery and e-liquid levels on a small screen.",
            },
            {
                name: "Nicotine strengths",
                text: "Most disposables use nicotine salt, usually 5% (50 mg/mL). Some lines also come in lower strengths. Ask which we have.",
            },
        ],
        tipsTitle: "How to choose a disposable",
        tips: [
            {
                title: "Start with nicotine strength",
                text: "Strength shapes the experience more than size or flavor. Most disposables are 5% nicotine salt, and some lines come in lower strengths. Tell us what you use now and we'll compare.",
            },
            {
                title: "Treat puff counts as a rough guide",
                text: "The puff count on the box comes from lab testing. How long you draw and how open the airflow is change it a lot in real life.",
            },
            {
                title: "Go rechargeable if yours die early",
                text: "If your devices usually stop working before they run dry, pick a rechargeable one. A USB-C port lets you use every drop of e-liquid.",
            },
            {
                title: "Check it's genuine",
                text: "Counterfeit disposables are common online. Many makers print a code on the box that you can check on their website, and in a store you can see the packaging before you pay.",
            },
            {
                title: "Throw it away safely",
                text: "Disposables have a lithium battery inside. Keep used devices out of household trash and recycling bins, and take them to a battery or household hazardous waste drop-off.",
            },
        ],
        faq: [
            { q: "Do I need ID to buy a disposable vape?", a: ID_ANSWER },
            {
                q: "What nicotine strengths do you carry?",
                a: "Most disposables come in 5% (50 mg/mL) nicotine salt, and some lines come in lower strengths. Strengths vary by device, so ask our staff or call either store.",
            },
            { q: "Can I check if a disposable is in stock?", a: CALL_AHEAD_ANSWER },
            { q: "Where can I buy a disposable vape late at night?", a: LATE_ANSWER },
        ],
    },
    {
        slug: "e-liquid",
        path: "/products/e-liquid",
        name: "E-liquid",
        topic: "e-liquid",
        catalogIds: ["e-liquid"],
        nicotine: true,
        metaTitle: "Vape Juice & E-Liquid in Sachse & Irving, TX | Vapor Aura",
        metaDescription:
            "Freebase and nicotine salt e-liquid in a range of strengths and bottle sizes at Vapor Aura in Sachse and Irving, TX. Irving is open 24 hours. 21+.",
        h1: ["E-liquid & vape juice", PLACE],
        intro: "Refill your pod or tank at either Vapor Aura store. We carry freebase and nicotine salt e-liquid in a range of strengths, with tobacco and menthol flavors alongside plenty of others. Not sure which type your device needs? Bring it in and our staff will help you match it.",
        shelfTitle: "What's on the e-liquid shelf",
        shelf: [
            {
                name: "Nicotine salt",
                text: "Made for low-power pod systems and smooth at higher strengths. Usually sold in 30 mL bottles.",
            },
            {
                name: "Freebase",
                text: "The classic e-liquid for sub-ohm tanks and higher-power kits, in lower strengths and larger bottles.",
            },
            {
                name: "Strengths",
                text: "Salt nic usually comes in 20 to 50 mg/mL. Freebase usually comes in 3 to 12 mg/mL, and some lines come nicotine-free.",
            },
            {
                name: "Flavors",
                text: "Tobacco, menthol and mint, plus a range of other flavor styles. Ask our staff what's new.",
            },
        ],
        tipsTitle: "How to choose an e-liquid",
        tips: [
            {
                title: "Match it to your device",
                text: "Pods and low-power pens work best with nicotine salt. Sub-ohm tanks and high-wattage kits need freebase; salt nic at high power feels harsh.",
            },
            {
                title: "Check the VG/PG ratio",
                text: "High-VG liquids (70/30 and up) make bigger clouds and suit sub-ohm tanks. 50/50 liquids are thinner and soak into small pod coils faster.",
            },
            {
                title: "Fresh coil for a new flavor",
                text: "A coil holds on to the last flavor you used. Fit a fresh coil or pod when you switch to a very different flavor.",
            },
            {
                title: "Store it well",
                text: "Keep bottles sealed, cool, out of direct sunlight and well away from children and pets. E-liquid that has darkened a lot has usually lost some flavor.",
            },
        ],
        faq: [
            {
                q: "What's the difference between salt nic and freebase?",
                a: "Nicotine salt is smoother at high strengths and made for low-power pods. Freebase is made for higher-power tanks and comes in lower strengths. Using the wrong one in your device can feel harsh, so ask us if you're not sure.",
            },
            {
                q: "Can you help me find the right e-liquid for my device?",
                a: "Yes. Bring your pod or tank to either store and our staff will tell you which type of e-liquid it's made for.",
            },
            { q: "Do I need ID to buy e-liquid?", a: ID_ANSWER },
            { q: "Can I check if a flavor is in stock?", a: CALL_AHEAD_ANSWER },
        ],
    },
    {
        slug: "pods-and-coils",
        path: "/products/pods-and-coils",
        name: "Pods & coils",
        topic: "coils and pods",
        catalogIds: ["coils-pods"],
        // Coils, empty pods and pod kits don't contain nicotine themselves
        nicotine: false,
        metaTitle: "Vape Coils & Pods in Sachse & Irving, TX | Vapor Aura",
        metaDescription:
            "Replacement vape coils, refillable pods and pod kits at Vapor Aura in Sachse and Irving, TX. Bring your device and we'll help match the part. 21+.",
        h1: ["Vape coils & pods", PLACE],
        intro: "A burnt coil or a leaking pod can sideline a good device. Both Vapor Aura stores carry replacement coils and pods for popular pod systems and tanks, plus refillable pod kits. Bring your device in, or a photo of the pod or coil, and our staff will help you find the part that fits.",
        shelfTitle: "What's on the coils and pods shelf",
        shelf: [
            {
                name: "Replacement coils",
                text: "Mesh and standard coils in common resistances for pod systems and sub-ohm tanks.",
            },
            {
                name: "Replacement pods",
                text: "Refillable pods for popular devices, some with a built-in coil and some that take swappable coils.",
            },
            {
                name: "Refillable pod kits",
                text: "A rechargeable battery and a pod you fill with your own e-liquid.",
            },
            {
                name: "Help matching parts",
                text: "Not sure what you have? We'll identify your device and the coil or pod it takes.",
            },
        ],
        tipsTitle: "Getting the most from a coil",
        tips: [
            {
                title: "Match the part to your device",
                text: "Coils and pods are made for specific devices. The model is usually printed on the coil or the pod, so snap a photo of it before you come in.",
            },
            {
                title: "Pick the right resistance",
                text: "Coils above 1.0 ohm give a tighter, mouth-to-lung draw and suit nicotine salt. Sub-ohm coils (under 1.0 ohm) give an airier draw and suit freebase e-liquid.",
            },
            {
                title: "Prime every new coil",
                text: "Drip a few drops of e-liquid onto the exposed cotton, fill the pod or tank, then wait 5 to 10 minutes before the first puff. Firing a dry coil burns it straight away.",
            },
            {
                title: "Know when to change it",
                text: "A burnt taste, muted flavor or gurgling that won't clear usually means the coil is done. Sweeter e-liquids wear coils out faster.",
            },
        ],
        faq: [
            {
                q: "Can you tell which coil my device takes?",
                a: "Yes. Bring the device, or a photo of the pod or coil, to either store and we'll match it.",
            },
            {
                q: "How often should I change my coil?",
                a: "It depends on how much you vape and which e-liquid you use. A burnt or faded taste is the usual sign, and priming each new coil properly helps it last.",
            },
            { q: "Can I check if you have my coil before I drive over?", a: CALL_AHEAD_ANSWER },
            { q: "Do I need ID to buy pods or coils?", a: ID_ANSWER },
        ],
    },
    {
        slug: "glass",
        path: "/products/glass",
        name: "Glass",
        topic: "glass",
        catalogIds: ["glass"],
        nicotine: false,
        metaTitle: "Glass Pipes & Water Pipes in Sachse & Irving | Vapor Aura",
        metaDescription:
            "Water pipes, bubblers, hand pipes and rigs, plus replacement bowls and cleaners, at Vapor Aura in Sachse and Irving, TX. See every piece in store.",
        h1: ["Glass pipes & water pipes", PLACE],
        intro: "Glass is easier to choose in person. At Vapor Aura in Sachse and Irving you can look at the thickness, check the joint and feel the weight of water pipes (bongs), bubblers, hand pipes and rigs before you buy, then pick up replacement bowls and cleaners on the same trip.",
        shelfTitle: "What's on the glass shelf",
        shelf: [
            {
                name: "Water pipes",
                text: "Beakers and straight tubes in a range of heights, some with percolators that diffuse the smoke through the water.",
            },
            {
                name: "Bubblers",
                text: "Handheld pieces with a small water chamber: as portable as a pipe, with the smoother pull of water.",
            },
            { name: "Hand pipes", text: "Spoon pipes and other small glass pipes that fit in a pocket." },
            { name: "Rigs", text: "Compact water pipes with a small chamber, used with a nail or banger." },
            {
                name: "Bowls and cleaners",
                text: "Replacement bowls in common 14 mm and 18 mm sizes, plus cleaning solutions that cut through resin.",
            },
        ],
        shelfNote: "All glass is sold for tobacco use only.",
        tipsTitle: "How to choose a glass piece",
        tips: [
            {
                title: "Check the thickness",
                text: "Thicker borosilicate glass handles knocks better. Look closely at the base and the joint, where pieces usually break.",
            },
            {
                title: "Size it to how you'll use it",
                text: "A tall water pipe gives the smoothest pull but needs a spot on a shelf. Bubblers and hand pipes travel better.",
            },
            {
                title: "Know your joint size",
                text: "Most bowls fit 14 mm or 18 mm joints, male or female. Check the stamp near the joint, or bring your piece, before buying a new bowl.",
            },
            {
                title: "Clean it often",
                text: "Rinse with warm water after use and deep clean weekly with isopropyl alcohol and coarse salt or a glass cleaner. Clean glass tastes better and stays clear.",
            },
        ],
        faq: [
            {
                q: "Can I see the glass before I buy?",
                a: "Yes. All our glass is in store, so you can check the thickness, joint and weight before you buy. We don't sell glass online.",
            },
            {
                q: "Do you sell replacement bowls?",
                a: "Yes, in common 14 mm and 18 mm sizes. Bring your piece if you're not sure which one fits.",
            },
            {
                q: "Do both stores carry glass?",
                a: "Yes. Sachse and Irving both carry glass, and new pieces come in often. Call ahead if you're after a certain style.",
            },
            { q: "Do I need to be 21?", a: ID_ANSWER },
        ],
    },
    {
        slug: "hookah",
        path: "/products/hookah",
        name: "Hookah",
        topic: "hookah",
        catalogIds: ["hookah"],
        // Shisha is tobacco
        nicotine: true,
        metaTitle: "Hookah Store in Sachse & Irving, TX | Vapor Aura",
        metaDescription:
            "Hookahs, shisha, coals, bowls, hoses and spare parts at Vapor Aura in Sachse and Irving, TX. Irving is open 24 hours for late-night coal runs. 21+.",
        h1: ["Hookah store", PLACE],
        intro: "Setting up a session or replacing a part? Both Vapor Aura stores carry hookahs, shisha, coals, bowls, hoses and spare parts, and our staff can help you put a setup together. Out of coals at midnight? Our Irving store is open 24 hours.",
        shelfTitle: "What's on the hookah shelf",
        shelf: [
            { name: "Hookahs", text: "Complete hookahs ready to set up, in a range of sizes." },
            { name: "Shisha", text: "Hookah tobacco in a range of flavors and pack sizes." },
            { name: "Coals", text: "Natural coconut coals and quick-light coals. Ask which we have in stock." },
            {
                name: "Bowls, hoses and parts",
                text: "Replacement bowls, hoses, grommets and other spare parts to keep your hookah going.",
            },
        ],
        tipsTitle: "Hookah setup tips",
        tips: [
            {
                title: "Coconut or quick-light coals",
                text: "Natural coconut coals take 8 to 10 minutes on a stove or coal burner but last longer and don't change the flavor. Quick-light coals light in seconds with a lighter, handy when you have no burner.",
            },
            {
                title: "Pack the bowl loosely",
                text: "Fluff the shisha and fill to just below the rim. Packing it tight blocks the airflow and burns the flavor.",
            },
            {
                title: "Control the heat",
                text: "Start with fewer coals than you think and add more as the session goes. Harsh, hot smoke means too much heat.",
            },
            {
                title: "Light coals with fresh air",
                text: "Burning coals give off carbon monoxide. Light them and smoke in a well-ventilated space, never in a closed room or a car.",
            },
            {
                title: "Rinse after every session",
                text: "Rinse the base, the stem and a washable hose with warm water. Leftover residue changes the taste of your next bowl.",
            },
        ],
        faq: [
            { q: "Where can I buy hookah coals late at night?", a: LATE_ANSWER },
            {
                q: "Do you carry replacement hookah parts?",
                a: "Yes. We carry bowls, hoses and common spare parts. Bring the old part or a photo and we'll help you find one that fits.",
            },
            {
                q: "Do I need ID to buy shisha?",
                a: "Yes. Shisha is a tobacco product, so we sell it only to adults 21 and over with a valid photo ID.",
            },
            { q: "Can I check if a flavor is in stock?", a: CALL_AHEAD_ANSWER },
        ],
    },
    {
        slug: "vaporizers",
        path: "/products/vaporizers",
        name: "Vaporizers",
        topic: "vaporizers",
        catalogIds: ["vaporizers"],
        nicotine: false,
        metaTitle: "Vaporizers & 510 Batteries in Sachse & Irving | Vapor Aura",
        metaDescription:
            "Dry herb and concentrate vaporizers and 510-thread batteries at Vapor Aura in Sachse and Irving, TX. Ask our staff to show you how each one works.",
        h1: ["Vaporizers & 510 batteries", PLACE],
        intro: "Both Vapor Aura stores carry dry herb vaporizers, concentrate devices and 510-thread batteries, from simple pens to full-featured devices. Ask our staff to show you how a device loads, heats and cleans before you buy.",
        shelfTitle: "What's on the vaporizer shelf",
        shelf: [
            {
                name: "Dry herb vaporizers",
                text: "Portable devices that heat dry material without burning it, most with adjustable temperature.",
            },
            {
                name: "Concentrate devices",
                text: "Pens and electronic rigs made for concentrates, with ceramic or quartz heating chambers.",
            },
            {
                name: "510-thread batteries",
                text: "Slim pen and box-style batteries that fit standard 510-thread cartridges, many with adjustable voltage.",
            },
        ],
        shelfNote: "All devices are sold for legal use only.",
        tipsTitle: "How to choose a vaporizer",
        tips: [
            {
                title: "Conduction or convection",
                text: "Conduction devices heat the chamber walls and warm up fast. Convection devices pass hot air through the material for more even heating, usually at a higher price.",
            },
            {
                title: "Look at the battery",
                text: "Check how long a charge lasts and how the device charges. USB-C is the most convenient.",
            },
            {
                title: "Start 510 batteries low",
                text: "On a variable-voltage battery, start at the lowest setting and work up. Too much voltage can burn a cartridge.",
            },
            {
                title: "Keep it clean",
                text: "Brush out the chamber after use and wipe the mouthpiece with isopropyl alcohol each week. A clean device heats evenly and tastes better.",
            },
        ],
        faq: [
            {
                q: "Do you sell 510 batteries?",
                a: "Yes. Both stores carry 510-thread batteries in pen and box styles. Call ahead if you need a specific one.",
            },
            {
                q: "What's the difference between a dry herb and a concentrate vaporizer?",
                a: "Dry herb vaporizers heat loose plant material. Concentrate devices are built for thicker extracts and run hotter. They aren't interchangeable, so ask us which one fits what you use.",
            },
            {
                q: "Can I see how a vaporizer works before I buy?",
                a: "Yes. Ask our staff in Sachse or Irving and they'll walk you through loading, heating and cleaning it.",
            },
            { q: "Do I need to be 21?", a: ID_ANSWER },
        ],
    },
    {
        slug: "cbd",
        path: "/products/cbd",
        name: "CBD",
        topic: "CBD",
        catalogIds: ["cbd", "pet-cbd"],
        nicotine: false,
        metaTitle: "CBD Store in Sachse & Irving, TX | Vapor Aura",
        metaDescription:
            "CBD tinctures, gummies, capsules, topicals and CBD for pets at Vapor Aura in Sachse and Irving, TX. Ask our staff to help you read the lab report.",
        h1: ["CBD store", PLACE],
        intro: "Vapor Aura's Sachse and Irving stores carry CBD tinctures, gummies, capsules and topicals in a range of strengths, plus CBD treats and tinctures made for pets. Our staff can explain the differences between product types and help you read a label, including the lab report behind it.",
        shelfTitle: "What's on the CBD shelf",
        shelf: [
            { name: "Tinctures", text: "CBD oils in dropper bottles, labeled with the CBD per bottle and per serving." },
            { name: "Gummies", text: "Pre-measured CBD gummies with the amount in each piece on the label." },
            { name: "Capsules", text: "Softgels and capsules with a set amount of CBD in each." },
            { name: "Topicals", text: "Creams, balms and roll-ons you apply to the skin." },
            { name: "CBD for pets", text: "Treats and tinctures made just for pets, with their own serving guides." },
        ],
        tipsTitle: "How to choose a CBD product",
        tips: [
            {
                title: "Compare CBD per serving",
                text: "The big number on the front is often the whole container. Check the CBD per serving on the back to compare products fairly.",
            },
            {
                title: "Know the spectrum",
                text: "Full-spectrum products keep other hemp compounds, which can include trace THC. Broad-spectrum and isolate products are processed to remove THC.",
            },
            {
                title: "Read the lab report",
                text: "Good CBD products link to a certificate of analysis (COA) from an independent lab, usually through a QR code on the label. It shows the CBD and THC content.",
            },
            {
                title: "Ask about your medications",
                text: "CBD can interact with some medicines. If you take any, check with your doctor or pharmacist first.",
            },
        ],
        faq: [
            {
                q: "Do your CBD products contain THC?",
                a: "It depends on the product. Full-spectrum CBD can contain trace THC, while broad-spectrum and isolate products are processed to remove it. The lab report shows the exact amount, and we'll help you find it.",
            },
            {
                q: "Do you carry CBD for pets?",
                a: "Yes. Both stores carry CBD treats and tinctures made for pets. Follow the serving guide on the label, and check with your vet if your pet takes medication.",
            },
            { q: "Do I need to be 21 to buy CBD?", a: ID_ANSWER },
            { q: "Can I order CBD for delivery?", a: DELIVERY_ANSWER },
        ],
    },
];

export function getCategoryPage(slug: string): CategoryPageCopy | undefined {
    return CATEGORY_PAGES.find((page) => page.slug === slug);
}

// The category page for a catalog id (src/lib/catalog.ts), if there is one
export function categoryPagePath(catalogId: string): string | undefined {
    return CATEGORY_PAGES.find((page) => page.catalogIds.includes(catalogId))?.path;
}
