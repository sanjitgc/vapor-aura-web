"use client";

import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import styles from "./ProductHighlights.module.css";

interface ProductCategory {
    name: string;
    description: string;
    image: string;
    alt: string;
}

const categories: ProductCategory[] = [
    {
        name: "Vape",
        description: "Disposables, pod systems and refillable devices from brands like Geek Bar, Foger, Fifty Bar and Off-Stamp, in dozens of flavors and nicotine strengths. Not sure which one fits you? Ask us to compare.",
        image: "/products/vape.webp",
        alt: "Geek Bar, Juicy Bar and RAZ disposable vapes",
    },
    {
        name: "Glass",
        description: "Water pipes, bubblers, hand pipes and rigs, from everyday pieces to statement glass, plus bowls, downstems, ash catchers and cleaning supplies.",
        image: "/products/glass.webp",
        alt: "Three glass beaker bongs",
    },
    {
        name: "Vaporizer",
        description: "Dry herb and concentrate vaporizers, from pocket-size pens to premium portables. We'll help you pick one and show you how to use it.",
        image: "/products/vaporizer.webp",
        alt: "DaVinci, Crafty, Mighty and Firefly vaporizers",
    },
    {
        name: "Kratom",
        description: "Kratom capsules, powders, tablets and shots from established brands. Ask our staff about the options we have in stock.",
        image: "/products/kratom.webp",
        alt: "7Tabz kratom tablet packs",
    },
    {
        name: "CBD",
        description: "CBD tinctures, gummies, capsules and topicals in a range of strengths, including full-spectrum and broad-spectrum options.",
        image: "/products/cbd.webp",
        alt: "CBD oil dropper bottles",
    },
    {
        name: "Hookah",
        description: "Hookahs, bowls, hoses, coals and shisha flavors, plus the replacement parts and accessories to keep your setup running.",
        image: "/products/hookah.webp",
        alt: "Hookah with a braided hose",
    },
];

const moreCategories: ProductCategory[] = [
    {
        name: "E-Juices",
        description: "Freebase and nicotine salt e-liquids in fruit, menthol, dessert and tobacco flavors, from brands like Naked and Juice Head.",
        image: "/products/e-liquid.webp",
        alt: "Three e-liquid bottles, including Juice Head and Naked",
    },
    {
        name: "Mushroom",
        description: "Mushroom gummies and other mushroom products in a variety of flavors and formats.",
        image: "/products/mushroom.webp",
        alt: "Float mushroom gummies pack",
    },
    {
        name: "Edibles",
        description: "Hemp-derived gummies, chocolates and treats in a range of flavors and strengths.",
        image: "/products/edibles.webp",
        alt: "Assorted hemp edible packs",
    },
    {
        name: "Coils / Pods",
        description: "Replacement coils, pods and cartridges for popular devices from brands like SMOK and GeekVape. Bring your device in and we'll find the right match.",
        image: "/products/coils-pods.webp",
        alt: "GeekVape coils and SMOK replacement pods",
    },
];

function Stage({ image, alt, sizes }: { image: string; alt: string; sizes: string }) {
    return (
        <div className={styles.stage}>
            <span className={styles.pedestal} aria-hidden="true" />
            <Image src={image} alt={alt} fill sizes={sizes} className={styles.product} />
        </div>
    );
}

// What's on the shelves in our stores. Display only; nothing here is sold online.
export default function ProductHighlights() {
    return (
        <section id="products" className={styles.section} aria-labelledby="product-hints-title">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 id="product-hints-title" className={styles.title}>
                        What we carry
                    </h2>
                    <p className={styles.subtitle}>
                        A look at what you&apos;ll find in our Sachse and Irving stores. Stock changes often, so call
                        ahead if you&apos;re after something specific.
                    </p>
                </div>

                <div className={styles.grid}>
                    {categories.map((category, index) => (
                        <AnimateIn key={category.name} delay={0.04 + index * 0.06} className={styles.cell}>
                            <article className={styles.tile}>
                                <Stage
                                    image={category.image}
                                    alt={category.alt}
                                    sizes="(max-width: 640px) 46vw, (max-width: 980px) 44vw, 360px"
                                />
                                <div className={styles.body}>
                                    <h3 className={styles.tileTitle}>{category.name}</h3>
                                    <p className={styles.tileText}>{category.description}</p>
                                </div>
                            </article>
                        </AnimateIn>
                    ))}
                </div>

                <div className={styles.more}>
                    <h3 className={styles.moreTitle}>Also on the shelves</h3>
                    <div className={`${styles.grid} ${styles.gridFour}`}>
                        {moreCategories.map((category, index) => (
                            <AnimateIn key={category.name} delay={0.04 + index * 0.06} className={styles.cell}>
                                <article className={`${styles.tile} ${styles.tileCompact}`}>
                                    <Stage
                                        image={category.image}
                                        alt={category.alt}
                                        sizes="(max-width: 640px) 46vw, (max-width: 980px) 44vw, 270px"
                                    />
                                    <div className={styles.body}>
                                        <h4 className={styles.tileTitle}>{category.name}</h4>
                                        <p className={styles.tileText}>{category.description}</p>
                                    </div>
                                </article>
                            </AnimateIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
