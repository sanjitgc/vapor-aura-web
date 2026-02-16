import styles from "./page.module.css";
import Hero from "@/components/home/Hero";
import AnimateIn from "@/components/ui/AnimateIn";
import Image from "next/image";
import LocationsPage from "./locations/page";
import AboutUsPage from "./about-us/page";
import ProductsPage from "./products/page";
import ContactPage from "./contact/page";
import WhyChoose from "@/components/common/WhyChoose";

const categories = [
    {
        name: "Vape",
        description: "Latest disposables, pod systems, and premium vape devices.",
        iconSrc: "/icons/display/vapes.png",
    },
    {
        name: "Glass",
        description: "Clean-crafted glass pieces with standout quality and style.",
        iconSrc: "/icons/display/glass.png",
    },
    {
        name: "Vaporizer",
        description: "Trusted dry herb and concentrate vaporizers for every level.",
        iconSrc: "/icons/display/vaporizers.png",
        tall: true,
    },
    {
        name: "Kratom",
        description: "Trusted kratom products with reliable quality and selection.",
        iconSrc: "/icons/display/kratom.svg",
    },
    {
        name: "CBD",
        description: "Premium CBD options selected for consistency, quality, and trust.",
        iconSrc: "/icons/display/cbd.svg",
    },
    {
        name: "Hookah",
        description: "Premium hookah setups, bowls, coals, and flavor essentials.",
        iconSrc: "/icons/display/hookah.png",
    },
];

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

                <section className={styles.productHints} aria-labelledby="product-hints-title">
                    <div className={styles.container}>
                        <AnimateIn>
                            <div className={styles.productHeader}>
                                <h2 id="product-hints-title" className={styles.sectionTitle}>
                                    Product Highlights
                                </h2>
                                <p className={styles.sectionSubtitle}>
                                    Explore signature categories our customers love at Vapor Aura.
                                </p>
                            </div>
                        </AnimateIn>

                        <div className={styles.productGrid}>
                            {categories.map((category, index) => (
                                <AnimateIn key={category.name} delay={0.1 + index * 0.08}>
                                    <div className={styles.productCard}>
                                        <div className={styles.iconWrap}>
                                            <Image
                                                src={category.iconSrc}
                                                alt={category.name}
                                                width={116}
                                                height={80}
                                                className={`${styles.iconImage} ${category.tall ? styles.iconImageTall : ""}`}
                                            />
                                        </div>
                                        <h3 className={styles.productTitle}>{category.name}</h3>
                                        <p className={styles.productText}>{category.description}</p>
                                    </div>
                                </AnimateIn>
                            ))}
                        </div>
                    </div>
                </section>
            </section>

            <section id="why-choose" className={styles.scrollSection}>
                <WhyChoose />
            </section>

            <section id="locations" className={styles.scrollSection}>
                <LocationsPage />
            </section>

            <section id="about" className={styles.scrollSection}>
                <AboutUsPage />
            </section>

            <section id="products" className={styles.scrollSection}>
                <ProductsPage />
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
                                                src="/vapor-aura-logo-clean.png"
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
