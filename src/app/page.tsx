import styles from "./page.module.css";
import Hero from "@/components/home/Hero";
import AnimateIn from "@/components/ui/AnimateIn";
import Image from "next/image";
import ContactPage from "./contact/page";
import WhyChoose from "@/components/common/WhyChoose";
import ProductHighlights from "@/components/home/ProductHighlights";

const testimonials = [
    {
        name: "Bryce T.",
        review:
            "Staff is friendly, selection is strong, and every visit feels smooth and professional. Exactly the kind of premium smoke shop experience I look for.",
        stars: 5,
    },
    {
        name: "Alexis S.",
        review:
            "Great variety and helpful recommendations. The team took time to explain options clearly and made the entire visit easy and enjoyable.",
        stars: 5,
    },
    {
        name: "Jerrod H.",
        review:
            "Consistent quality and knowledgeable service every time. I always find what I need, and the atmosphere is clean, modern, and welcoming.",
        stars: 5,
    },
    {
        name: "S. Chambers",
        review:
            "Excellent customer care and reliable products. Vapor Aura delivers a polished experience from the moment you walk in to checkout.",
        stars: 5,
    },
];

export default function Home() {
    return (
        <main className={styles.main}>
            <section id="home" className={styles.scrollSection}>
                <Hero />
                <ProductHighlights />
            </section>

            <section id="why-choose" className={`${styles.scrollSection} ${styles.leafDecorSection}`}>
                <WhyChoose />
            </section>

            <section id="contact" className={styles.scrollSection}>
                <ContactPage />
            </section>

            <section id="testimonials" className={styles.scrollSection}>
                <section className={styles.testimonialsSection} aria-labelledby="testimonials-title">
                    <div className={styles.container}>
                        <AnimateIn>
                            <div className={styles.productHeader}>
                                <h2 id="testimonials-title" className={styles.sectionTitle}>
                                    Testimonials
                                </h2>
                            </div>
                        </AnimateIn>

                        <div className={styles.testimonialGrid}>
                            {testimonials.map((testimonial, index) => (
                                <AnimateIn key={testimonial.name} delay={0.08 + index * 0.08}>
                                    <article className={`${styles.productCard} ${styles.testimonialCard}`}>
                                        <div className={styles.testimonialLogoWrap}>
                                            <Image
                                                src="/vapor-aura-logo-new.png"
                                                alt=""
                                                width={64}
                                                height={64}
                                                className={styles.testimonialLogo}
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <p className={styles.testimonialText}>{testimonial.review}</p>
                                        <p className={styles.rating} aria-label={`${testimonial.stars} star rating`}>
                                            {"★".repeat(testimonial.stars)}
                                        </p>
                                        <h3 className={styles.testimonialName}>{testimonial.name}</h3>
                                    </article>
                                </AnimateIn>
                            ))}
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}
