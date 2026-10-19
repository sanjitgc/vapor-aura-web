import Image from "next/image";
import styles from "./Hero.module.css";
import Button from "@/components/ui/Button";
import StoreStatus from "./StoreStatus";
import AuraFigure from "./AuraFigure";

export default function Hero() {
    return (
        <section className={styles.hero} aria-labelledby="hero-title">
            <Image
                src="/home-hero-leaf-clean.webp"
                alt=""
                width={520}
                height={687}
                className={styles.leaf}
                sizes="(max-width: 640px) 140px, 260px"
                aria-hidden="true"
            />

            <div className={styles.inner}>
                <div className={styles.copy}>
                    <h1 id="hero-title" className={styles.title}>
                        <span className={styles.line}>
                            <span>Vape &amp; smoke shop</span>
                        </span>
                        <span className={styles.line}>
                            <span>in Sachse &amp; Irving</span>
                        </span>
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
                </div>

                <AuraFigure />
            </div>

            <div className={styles.stores}>
                <StoreStatus />
            </div>
        </section>
    );
}
