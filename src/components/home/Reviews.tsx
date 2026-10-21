import styles from "./Reviews.module.css";

// Real 5-star Google reviews of both stores, copied word for word (Oct 2026).
// Only add reviews from the Google listings; never write or edit one.
type Store = "Sachse" | "Irving";

const REVIEWS: { name: string; store: Store; text: string }[] = [
    {
        name: "Eduardo M.",
        store: "Sachse",
        text: "Very friendly, knowledgeable staff. Nick was great. Extremely well stocked. I’ve never gone in and been told they don’t have what i need. Def would recommend.",
    },
    {
        name: "Srikanth S.",
        store: "Irving",
        text: "Great smoke shop with excellent customer service! Maria was incredibly friendly, welcoming, and knowledgeable. She took the time to answer my questions and helped me find exactly what I needed. I'll definitely be coming back. Highly recommend!",
    },
    {
        name: "Chris S.",
        store: "Sachse",
        text: "Came in today to grab some coils. Absolutely blown away with the amount of variety this store has. My first time stopping by but won’t be my last. Maria was very helpful and gave amazing customer service !",
    },
    {
        name: "Wagish P.",
        store: "Irving",
        text: "Excellent customer service and great prices. The shop is clean, well stocked, and the staff really know their stuff. Will definitely be back!",
    },
    {
        name: "Mavis P.",
        store: "Sachse",
        text: "Not from Texas, but this is the 1st Vape store/shop we saw. The attendant was very helpful and attentive to our needs/wants. I love that the options were endless. If ever we're back here we will shop here again!! Thanks for your help!! Hate I didn't get your name!!",
    },
    {
        name: "Jonathan",
        store: "Irving",
        text: "Good local shop. Good selection and fair prices. Workers are very helpful and are willing to let you see the product and answer any questions you might have. Would recommend",
    },
    {
        name: "ItCouldBeJ",
        store: "Sachse",
        text: "My man Nick really had me wanting to buy the whole store!! Great salesman and I love the store itself. Vibes are great. Options are abundant. Thank you again brother!",
    },
    {
        name: "Tristan Y.",
        store: "Irving",
        text: "Great store. Came from Florida just to buy a vape from KACY. KACY DID A GREAT JOB! :)",
    },
];

// Each store's Google listing, where people can read more reviews and write one.
const GOOGLE_LISTINGS: { store: Store; url: string }[] = [
    {
        store: "Sachse",
        url: "https://www.google.com/maps/search/?api=1&query=Vapor%20Aura%2C%205848%20S%20State%20Hwy%2078%20%23108%2C%20Sachse%2C%20TX%2075048",
    },
    { store: "Irving", url: "https://maps.google.com/?cid=3903298981477223268" },
];

function Stars() {
    return (
        <span className={styles.stars} role="img" aria-label="5 out of 5 stars">
            {"★★★★★"}
        </span>
    );
}

export default function Reviews() {
    return (
        <section className={styles.section} aria-labelledby="reviews-title">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 id="reviews-title" className={styles.title}>
                        What customers say
                    </h2>
                    <p className={styles.subtitle}>
                        Reviews of our Sachse and Irving stores on Google, in our customers&apos; own words.
                    </p>
                </div>

                <ul className={styles.grid}>
                    {REVIEWS.map((review) => (
                        <li key={review.name} className={styles.card}>
                            <Stars />
                            <blockquote className={styles.quote}>
                                <p>{review.text}</p>
                            </blockquote>
                            <p className={styles.meta}>
                                <span className={styles.name}>{review.name}</span>
                                <span className={styles.source}>Google review, {review.store}</span>
                            </p>
                        </li>
                    ))}
                </ul>

                <div className={styles.footer}>
                    <p className={styles.ask}>Been in recently? A quick Google review helps other customers find us.</p>
                    <div className={styles.actions}>
                        {GOOGLE_LISTINGS.map((listing, i) => (
                            <a
                                key={listing.store}
                                href={listing.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={i === 0 ? styles.button : styles.buttonOutline}
                            >
                                Review {listing.store} on Google
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
