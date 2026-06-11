"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import Image from "next/image";

const slides = [
    "/hero-1.png",
    "/hero-2.png",
    "/hero-3.png",
    "/hero-4.png",
];

export default function Hero() {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const startX = useRef(0);
    const isDragging = useRef(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setIndex((prev) => prev + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused]);

    useEffect(() => {
        if (index >= slides.length) {
            setTimeout(() => {
                setIndex(0);
            }, 700); 
                }
    }, [index]);

    function onTouchStart(e: React.TouchEvent) {
        startX.current = e.touches[0].clientX;
        isDragging.current = true;
    }

    function onTouchEnd(e: React.TouchEvent) {
        if (!isDragging.current) return;

        const endX = e.changedTouches[0].clientX;
        const diff = startX.current - endX;

        if (diff > 50) {
            setIndex((prev) => prev + 1);
        } else if (diff < -50) {
            setIndex((prev) => Math.max(prev - 1, 0)); 
        }

        isDragging.current = false;
    }

    return (
        <section
            className={styles.heroSlider}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div
                className={styles.track}
                style={{
                    transform: `translateX(-${index * 100}%)`,
                }}
            >
                {[...slides, ...slides].map((src, i) => (
                    <div key={i} className={styles.slide}>
                        <Image
                            src={src}
                            alt={`Slide ${i + 1}`}
                            fill
                            sizes="100vw"
                            className={styles.image}
                            priority={i === 0}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.progressBar}>
                <div
                    className={styles.progress}
                    key={index}
                />
            </div>
        </section>
    );
}