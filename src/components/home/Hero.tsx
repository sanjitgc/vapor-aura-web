import Image from "next/image";
import { SiDoordash } from "react-icons/si";
import styles from "./Hero.module.css";
import Button from "@/components/ui/Button";
import StoreStatus from "./StoreStatus";
import AuraFigure from "./AuraFigure";
import { DOORDASH_URL } from "@/lib/stores";

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
                        <Button href={DOORDASH_URL} variant="primary" size="lg" target="_blank">
                            <SiDoordash aria-hidden="true" className={styles.ddIcon} />
                            Order on DoorDash
                        </Button>
                        <Button href="/#locations" variant="outline" size="lg">
                            Find a store
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
