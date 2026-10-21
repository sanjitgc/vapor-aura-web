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
        description: "Disposables, pod systems and devices from Geek Bar, Foger, Fifty Bar and more.",
        image: "/products/vape.webp",
        alt: "Geek Bar, Juicy Bar and RAZ disposable vapes",
    },
    {
        name: "Glass",
        description: "Water pipes, bubblers, hand pipes and rigs, plus bowls and cleaners.",
        image: "/products/glass.webp",
        alt: "Three glass beaker bongs",
    },
    {
        name: "Vaporizer",
        description: "Dry herb and concentrate vaporizers, from pens to premium portables.",
        image: "/products/vaporizer.webp",
        alt: "DaVinci, Crafty, Mighty and Firefly vaporizers",
    },
    {
        name: "Kratom",
        description: "Kratom capsules, powders, tablets and shots from established brands.",
        image: "/products/kratom-leaf.webp",
        alt: "Kratom leaves",
    },
    {
        name: "CBD",
        description: "Tinctures, gummies, capsules and topicals in a range of strengths.",
        image: "/products/cbd.webp",
        alt: "CBD oil dropper bottles",
    },
    {
        name: "Hookah",
        description: "Hookahs, bowls, hoses, coals and shisha, plus spare parts.",
        image: "/products/hookah.webp",
        alt: "Hookah with a braided hose",
    },
];

const moreCategories: ProductCategory[] = [
    {
        name: "E-Juices",
        description: "Freebase and nicotine salt e-liquids from Naked and more.",
        image: "/products/e-liquid.webp",
        alt: "Three e-liquid bottles, including Juice Head and Naked",
    },
    {
        name: "Mushroom",
        description: "Mushroom gummies and more in a variety of flavors.",
        image: "/products/mushroom.webp",
        alt: "Float mushroom gummies pack",
    },
    {
        name: "Edibles",
        description: "Hemp-derived gummies, chocolates and treats.",
        image: "/products/edibles.webp",
        alt: "Assorted hemp edible packs",
    },
    {
        name: "Coils / Pods",
        description: "Replacement coils and pods for SMOK, GeekVape and more.",
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
                        What you&apos;ll find in our Sachse and Irving stores. Not sure what fits you? Ask our staff,
                        and call ahead if you&apos;re after something specific.
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
