import styles from "./Reviews.module.css";

// Real 5-star Google reviews of Vapor Aura Irving, copied word for word (Oct 2026).
// Only add reviews from the Google listings; never write or edit one.
const REVIEWS = [
    {
        name: "Srikanth S.",
        text: "Great smoke shop with excellent customer service! Maria was incredibly friendly, welcoming, and knowledgeable. She took the time to answer my questions and helped me find exactly what I needed. I'll definitely be coming back. Highly recommend!",
    },
    {
        name: "Wagish P.",
        text: "Excellent customer service and great prices. The shop is clean, well stocked, and the staff really know their stuff. Will definitely be back!",
    },
    {
        name: "Jonathan",
        text: "Good local shop. Good selection and fair prices. Workers are very helpful and are willing to let you see the product and answer any questions you might have. Would recommend",
    },
    {
        name: "Tristan Y.",
        text: "Great store. Came from Florida just to buy a vape from KACY. KACY DID A GREAT JOB! :)",
    },
    {
        name: "Benjamin D.",
        text: "They had everything i needed. And very helpful. I will be recommending them to my friends and family.",
    },
    {
        name: "Alexis M.",
        text: "Great and fast service! There’s also a great selection no matter what you’re looking for. Will definitely be coming back!",
    },
];

// Vapor Aura Irving on Google Maps (reviews and "Write a review" live there).
const IRVING_GOOGLE_URL = "https://maps.google.com/?cid=3903298981477223268";

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
                        Reviews from our Irving store on Google, in our customers&apos; own words.
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
                                <span className={styles.source}>Google review, Irving</span>
                            </p>
                        </li>
                    ))}
                </ul>

                <div className={styles.actions}>
                    <a href={IRVING_GOOGLE_URL} target="_blank" rel="noopener noreferrer" className={styles.button}>
                        Read more reviews on Google
                    </a>
                    <a href={IRVING_GOOGLE_URL} target="_blank" rel="noopener noreferrer" className={styles.buttonOutline}>
                        Leave us a review
                    </a>
                </div>
            </div>
        </section>
    );
}
