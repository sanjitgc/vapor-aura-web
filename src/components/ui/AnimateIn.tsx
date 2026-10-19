"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";

interface AnimateInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

export default function AnimateIn({
    children,
    className = "",
    delay = 0,
    direction = "up"
}: AnimateInProps) {
    const reduceMotion = useReducedMotion();
    const distance = reduceMotion ? 0 : 18;

    const variants: Variants = {
        hidden: {
            opacity: reduceMotion ? 1 : 0,
            y: direction === "up" ? distance : direction === "down" ? -distance : 0,
            x: direction === "left" ? distance : direction === "right" ? -distance : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1], delay: reduceMotion ? 0 : delay },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
