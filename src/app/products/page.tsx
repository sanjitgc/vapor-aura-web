import styles from "./page.module.css";
import Card from "@/components/ui/Card";
import Image from "next/image";

const products = [
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
    {
        name: "Vaporizer",
        description: "Trusted dry herb and concentrate vaporizers for every level.",
        iconSrc: "/icons/display/vaporizers.png",
    },
];

export default function ProductsPage() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1 className={styles.title}>Products</h1>
                <p className={styles.subtitle}>
                    Explore the categories that define the Vapor Aura experience.
                </p>
            </header>

            <section className={styles.grid}>
                {products.map((product) => (
                    <Card key={product.name} className={styles.productCard}>
                        <div className={styles.iconWrap}>
                            <Image
                                src={product.iconSrc}
                                alt={product.name}
                                width={120}
                                height={86}
                                className={styles.icon}
                            />
                        </div>
                        <h2 className={styles.name}>{product.name}</h2>
                        <p className={styles.description}>{product.description}</p>
                    </Card>
                ))}
            </section>
        </main>
    );
}
