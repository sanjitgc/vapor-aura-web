"use client";

import styles from "./Hero.module.css";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    TRANSCEND THE <br />
                    <span className={styles.gradientText}>ORDINARY</span>
                </h1>
                <p className={styles.subtitle}>
                    Texas&apos; premier destination for elite vapor, smoke, and lifestyle collections.
                    Experience the aura at our locations.
                </p>
                <div className={styles.actions}>
                    <Button href="/locations" variant="primary" size="lg">
                        Find A Location
                    </Button>
                    <Button href="/about" variant="outline" size="lg">
                        Our Story
                    </Button>
                </div>
            </div>
            <div className={styles.background}>
                <motion.div
                    className={styles.circle1}
                    animate={{ x: [0, 30, -30, 0], y: [0, -40, 20, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className={styles.circle2}
                    animate={{ x: [0, -40, 20, 0], y: [0, 20, -30, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
        </section>
    );
}
