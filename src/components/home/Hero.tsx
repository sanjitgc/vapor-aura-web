"use client";

import styles from "./Hero.module.css";
import Button from "@/components/ui/Button";
import Image from "next/image";
import StoreStatus from "./StoreStatus";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <Image
                src="/home-hero-leaf-clean.png"
                alt=""
                width={520}
                height={520}
                className={styles.leafAccent}
                sizes="(max-width: 640px) 120px, 180px"
                aria-hidden="true"
            />
            <Image
                src="/home-hero-leaf-clean.png"
                alt=""
                width={520}
                height={520}
                className={styles.leafAccentTopRight}
                sizes="(max-width: 640px) 120px, 180px"
                aria-hidden="true"
            />
            <div className={styles.content}>
                <div className={styles.brandBlock}>
                    <Image
                        src="/vapor-aura-logo-new.png"
                        alt="Vapor Aura"
                        width={720}
                        height={220}
                        className={styles.heroLogo}
                        sizes="(max-width: 768px) 78vw, 460px"
                        priority
                    />
                    <p className={styles.eyebrow}>Transcend the ordinary</p>
                </div>
                <h1 className={styles.title}>
                    Vape &amp; smoke shop in <span className={styles.accentGreen}>Sachse</span> and{" "}
                    <span className={styles.accentGreen}>Irving</span>
                </h1>
                <p className={styles.subtitle}>
                    Vapes, e-liquid, glass, hookah, kratom and CBD, with staff who know their stuff.
                    Irving is open 24 hours. 21+ with valid ID.
                </p>
                <div className={styles.actions}>
                    <Button href="/#locations" variant="primary" size="lg">
                        Find a store
                    </Button>
                    <Button href="https://www.vaporauradelivery.com" variant="outline" size="lg" target="_blank">
                        Order online
                    </Button>
                </div>
                <StoreStatus />
            </div>
        </section>
    );
}
