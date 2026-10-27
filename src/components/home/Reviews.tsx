import styles from "./Reviews.module.css";
import { REVIEWS } from "@/lib/reviews";
import { STORES, getStore, writeReviewUrl } from "@/lib/stores";

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
                                <span className={styles.source}>Google review, {getStore(review.store).city}</span>
                            </p>
                        </li>
                    ))}
                </ul>

                <div className={styles.footer}>
                    <p className={styles.ask}>Been in recently? A quick Google review helps other customers find us.</p>
                    <div className={styles.actions}>
                        {STORES.map((store, i) => (
                            <a
                                key={store.slug}
                                href={writeReviewUrl(store)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={i === 0 ? styles.button : styles.buttonOutline}
                            >
                                Review {store.city} on Google
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
