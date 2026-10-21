import styles from "./page.module.css";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import ContactPage from "./contact/page";
import WhyChoose from "@/components/common/WhyChoose";
import Faq from "@/components/home/Faq";
import Reviews from "@/components/home/Reviews";
import ProductHighlights from "@/components/home/ProductHighlights";

export default function Home() {
    return (
        <main className={styles.main}>
            <section id="home" className={styles.scrollSection}>
                <Hero />
                <Marquee />
                <ProductHighlights />
            </section>

            <section id="why-choose" className={styles.scrollSection}>
                <WhyChoose />
            </section>

            <section id="reviews" className={styles.scrollSection}>
                <Reviews />
            </section>

            <section id="faq" className={styles.scrollSection}>
                <Faq />
            </section>

            <section id="contact" className={styles.scrollSection}>
                <ContactPage />
            </section>
        </main>
    );
}
