import styles from "./WhyChoose.module.css";

const reasons = [
    {
        title: "Exceptional Service, Every Time",
        description:
            "Fast, reliable, and attentive service designed around your convenience.",
    },
    {
        title: "Uncompromising Customer Satisfaction",
        description:
            "Your experience matters. We are committed to exceeding expectations at every visit.",
    },
    {
        title: "Expert Guidance You Can Trust",
        description:
            "Our knowledgeable and experienced team helps you find the perfect products with confidence.",
    },
    {
        title: "Effortless, Professional Experience",
        description:
            "From selection to checkout, we make every interaction smooth and seamless.",
    },
    {
        title: "Premium Quality at Competitive Prices",
        description:
            "Enjoy top-tier products, fair pricing, and customer care that sets a new standard.",
    },
];

export default function WhyChoose() {
    return (
        <section className={styles.section} aria-labelledby="why-choose-vapor-aura">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 id="why-choose-vapor-aura" className={styles.title}>
                        Why Choose Vapor Aura?
                    </h2>
                    <p className={styles.subtitle}>
                        If you&apos;re looking for more than just a smoke shop, Vapor Aura delivers an elevated
                        experience built on quality, trust, and expertise.
                    </p>
                </div>

                <div className={styles.grid}>
                    {reasons.map((reason, index) => (
                        <article
                            key={reason.title}
                            className={`${styles.card} ${index === 4 ? styles.premiumCard : ""}`}
                        >
                            <span className={styles.badge} aria-hidden="true">
                                {index + 1}
                            </span>
                            <h3 className={styles.cardTitle}>{reason.title}</h3>
                            <p className={styles.cardText}>{reason.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
