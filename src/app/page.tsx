import styles from "./page.module.css";
import Hero from "@/components/home/Hero";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import AnimateIn from "@/components/ui/AnimateIn";

export default function Home() {
    return (
        <main className={styles.main}>
            <Hero />

            <section className={styles.features}>
                <div className={styles.container}>
                    <AnimateIn>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Why Vapor Aura?</h2>
                            <p className={styles.sectionSubtitle}>
                                More than a smoke shop. We are a lifestyle.
                            </p>
                        </div>
                    </AnimateIn>

                    <div className={styles.grid}>
                        <AnimateIn delay={0.1}>
                            <Card className={styles.featureCard}>
                                <h3 className={styles.cardTitle}>Premium Selection</h3>
                                <p className={styles.cardText}>
                                    Curated collection of top-tier vapes, glass, and lifestyle accessories.
                                </p>
                            </Card>
                        </AnimateIn>
                        <AnimateIn delay={0.2}>
                            <Card className={styles.featureCard}>
                                <h3 className={styles.cardTitle}>Expert Staff</h3>
                                <p className={styles.cardText}>
                                    Knowledgeable team ready to guide you to your perfect match.
                                </p>
                            </Card>
                        </AnimateIn>
                        <AnimateIn delay={0.3}>
                            <Card className={styles.featureCard}>
                                <h3 className={styles.cardTitle}>Two Locations</h3>
                                <p className={styles.cardText}>
                                    Conveniently located to serve the Texas community.
                                </p>
                            </Card>
                        </AnimateIn>
                    </div>

                    <AnimateIn delay={0.4} className={styles.cta}>
                        <Button href="/locations" variant="primary" size="lg">
                            Visit Us Today
                        </Button>
                    </AnimateIn>
                </div>
            </section>
        </main>
    );
}
