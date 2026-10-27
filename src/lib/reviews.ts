// Real 5-star Google reviews of both stores, copied word for word (Oct 2026).
// Only add reviews from the Google listings; never write or edit one.
// Shown as quotes only: Google does not allow review markup (stars in search) for a business's own reviews.
import type { Store } from "./stores";

export interface Review {
    name: string;
    store: Store["slug"];
    text: string;
}

export const REVIEWS: Review[] = [
    {
        name: "Eduardo M.",
        store: "sachse",
        text: "Very friendly, knowledgeable staff. Nick was great. Extremely well stocked. I’ve never gone in and been told they don’t have what i need. Def would recommend.",
    },
    {
        name: "Srikanth S.",
        store: "irving",
        text: "Great smoke shop with excellent customer service! Maria was incredibly friendly, welcoming, and knowledgeable. She took the time to answer my questions and helped me find exactly what I needed. I'll definitely be coming back. Highly recommend!",
    },
    {
        name: "Chris S.",
        store: "sachse",
        text: "Came in today to grab some coils. Absolutely blown away with the amount of variety this store has. My first time stopping by but won’t be my last. Maria was very helpful and gave amazing customer service !",
    },
    {
        name: "Wagish P.",
        store: "irving",
        text: "Excellent customer service and great prices. The shop is clean, well stocked, and the staff really know their stuff. Will definitely be back!",
    },
    {
        name: "Mavis P.",
        store: "sachse",
        text: "Not from Texas, but this is the 1st Vape store/shop we saw. The attendant was very helpful and attentive to our needs/wants. I love that the options were endless. If ever we're back here we will shop here again!! Thanks for your help!! Hate I didn't get your name!!",
    },
    {
        name: "Jonathan",
        store: "irving",
        text: "Good local shop. Good selection and fair prices. Workers are very helpful and are willing to let you see the product and answer any questions you might have. Would recommend",
    },
    {
        name: "ItCouldBeJ",
        store: "sachse",
        text: "My man Nick really had me wanting to buy the whole store!! Great salesman and I love the store itself. Vibes are great. Options are abundant. Thank you again brother!",
    },
    {
        name: "Tristan Y.",
        store: "irving",
        text: "Great store. Came from Florida just to buy a vape from KACY. KACY DID A GREAT JOB! :)",
    },
];

export function reviewsFor(slug: Store["slug"]): Review[] {
    return REVIEWS.filter((r) => r.store === slug);
}
