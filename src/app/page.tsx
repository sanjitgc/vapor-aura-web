import styles from "./page.module.css";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import ContactSection from "@/components/home/ContactSection";
import WhyChoose from "@/components/common/WhyChoose";
import Faq from "@/components/home/Faq";
import Reviews from "@/components/home/Reviews";
import ProductHighlights from "@/components/home/ProductHighlights";
import NicotineWarning from "@/components/common/NicotineWarning";
import JsonLd from "@/components/common/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/schema";

export const metadata = pageMetadata({
    title: "Vapor Aura | Vape & Smoke Shop in Sachse and Irving, TX",
    description:
        "Vapor Aura is a 21+ vape and smoke shop with stores in Sachse and Irving, TX. Vapes, e-liquid, glass, hookah, kratom and CBD. Irving is open 24 hours.",
    path: "/",
    socialTitle: "Vapor Aura | Vape & smoke shop in Sachse and Irving, TX",
});

export default function Home() {
    return (
        <main className={styles.main}>
            <JsonLd data={[organizationSchema(), websiteSchema()]} />
            <NicotineWarning />
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
                <ContactSection />
            </section>
        </main>
    );
}
