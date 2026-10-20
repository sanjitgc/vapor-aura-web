import styles from "./WhyChoose.module.css";

const reasons = [
    {
        title: "Exceptional service, every time",
        description: "Fast, reliable, and attentive service designed around your convenience.",
    },
    {
        title: "Uncompromising customer satisfaction",
        description: "Your experience matters. We are committed to exceeding expectations at every visit.",
    },
    {
        title: "Expert guidance you can trust",
        description: "Our knowledgeable and experienced team helps you find the perfect products with confidence.",
    },
    {
        title: "Effortless, professional experience",
        description: "From selection to checkout, we make every interaction smooth and seamless.",
    },
    {
        title: "Premium quality at competitive prices",
        description: "Enjoy top-tier products, fair pricing, and customer care that sets a new standard.",
    },
];

export default function WhyChoose() {
    return (
        <section className={styles.section} aria-labelledby="why-choose-vapor-aura">
            <div className={styles.container}>
                <div className={styles.intro}>
                    <h2 id="why-choose-vapor-aura" className={styles.title}>
                        Why choose Vapor Aura?
                    </h2>
                    <p className={styles.subtitle}>
                        If you&apos;re looking for more than just a smoke shop, Vapor Aura delivers an elevated
                        experience built on quality, trust, and expertise.
                    </p>
                </div>

                <ul className={styles.list}>
                    {reasons.map((reason) => (
                        <li key={reason.title} className={styles.item}>
                            <h3 className={styles.itemTitle}>{reason.title}</h3>
                            <p className={styles.itemText}>{reason.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
