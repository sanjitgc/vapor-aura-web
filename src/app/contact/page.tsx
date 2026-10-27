import ContactSection from "@/components/home/ContactSection";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
    title: "Contact Vapor Aura | Sachse & Irving, TX Smoke Shop",
    description:
        "Message Vapor Aura or call our Sachse store at (214) 501-3222 or our 24-hour Irving store at (214) 272-8395. Addresses, hours and maps for both stores.",
    path: "/contact",
});

export default function ContactPage() {
    return (
        <main className={styles.main}>
            <div className={styles.crumbsWrap}>
                <Breadcrumbs
                    crumbs={[
                        { name: "Home", path: "/" },
                        { name: "Contact", path: "/contact" },
                    ]}
                />
            </div>
            <ContactSection titleAs="h1" title="Contact Vapor Aura" />
        </main>
    );
}
