/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Card from "@/components/ui/Card";
import Image from "next/image";

const fallbackProducts = [
    {
        name: "Vape",
        description: "Latest disposables, pod systems, and premium vape devices.",
        image: "/icons/display/vapes.png",
    },
    {
        name: "Glass",
        description: "Clean-crafted glass pieces with standout quality and style.",
        image: "/icons/display/glass.png",
    },
    {
        name: "Kratom",
        description: "Trusted kratom products with reliable quality and selection.",
        image: "/icons/display/kratom.svg",
    },
    {
        name: "CBD",
        description: "Premium CBD options selected for consistency, quality, and trust.",
        image: "/icons/display/cbd.svg",
    },
    {
        name: "Hookah",
        description: "Premium hookah setups, bowls, coals, and flavor essentials.",
        image: "/icons/display/hookah.png",
    },
    {
        name: "Vaporizer",
        description: "Trusted dry herb and concentrate vaporizers for every level.",
        image: "/icons/display/vaporizers.png",
    },
];

interface ProductView {
    name: string;
    description: string;
    image: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductView[]>(fallbackProducts);

    useEffect(() => {
        const controller = new AbortController();

        async function loadProducts() {
            try {
                const response = await fetch("/api/products?limit=24", {
                    signal: controller.signal,
                    cache: "no-store",
                });
                if (!response.ok) return;

                const payload = await response.json() as {
                    success: boolean;
                    data?: ProductView[];
                };
                if (payload.success && payload.data && payload.data.length > 0) {
                    setProducts(payload.data);
                }
            } catch {
                // Keep resilient fallback UI if API is unreachable.
            }
        }

        loadProducts();
        return () => controller.abort();
    }, []);

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
                                src={product.image}
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
