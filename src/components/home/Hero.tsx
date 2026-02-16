"use client";

import styles from "./Hero.module.css";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <Image
                src="/home-hero-leaf-transparent.png"
                alt=""
                width={520}
                height={520}
                className={styles.leafAccent}
                aria-hidden="true"
            />
            <Image
                src="/home-hero-leaf-transparent.png"
                alt=""
                width={520}
                height={520}
                className={styles.leafAccentTopRight}
                aria-hidden="true"
            />
            <div className={styles.content}>
                <div className={styles.brandBlock}>
                    <Image
                        src="/vapor-aura-logo-clean.png"
                        alt="Vapor Aura"
                        width={720}
                        height={220}
                        className={styles.heroLogo}
                        priority
                    />
                    <h1 className={styles.title}>
                        <span className={styles.gradientText}>Transcend the Ordinary</span>
                    </h1>
                </div>
                <p className={styles.subtitle}>
                    Texas&apos; premier destination for elite vapor, smoke, and lifestyle collections.
                    Experience the aura at our locations.
                </p>
                <div className={styles.actions}>
                    <Button href="/locations" variant="primary" size="lg">
                        Find A Location
                    </Button>
                    <Button href="/about-us" variant="outline" size="lg">
                        Our Story
                    </Button>
                </div>
                <div className={styles.visitCta}>
                    <Button href="/locations" variant="primary" size="lg">
                        Visit Us Today
                    </Button>
                </div>
            </div>
        </section>
    );
}
