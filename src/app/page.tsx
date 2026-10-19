import styles from "./page.module.css";
import Hero from "@/components/home/Hero";
import ContactPage from "./contact/page";
import WhyChoose from "@/components/common/WhyChoose";
import ProductHighlights from "@/components/home/ProductHighlights";
import NicotineWarning from "@/components/common/NicotineWarning";

export default function Home() {
    return (
        <main className={styles.main}>
            <NicotineWarning />
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
        </main>
    );
}
