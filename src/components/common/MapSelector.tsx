"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/Button";
import styles from "./MapSelector.module.css";
import { motion, AnimatePresence } from "framer-motion";

interface MapSelectorProps {
    address: string;
}

export default function MapSelector({ address }: MapSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dialogTitleId = useId();

    const googleUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
    const appleUrl = `https://maps.apple.com/?q=${encodeURIComponent(address)}`;

    return (
        <>
            <Button onClick={() => setIsOpen(true)} variant="primary" size="md">
                Get Directions
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
                        <motion.div
                            className={styles.modal}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={dialogTitleId}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <h3 id={dialogTitleId} className={styles.title}>Choose Map App</h3>
                            <div className={styles.options}>
                                <Button
                                    href={googleUrl}
                                    variant="secondary"
                                    size="md"
                                    target="_blank"
                                    className={styles.optionBtn}
                                >
                                    Google Maps
                                </Button>
                                <Button
                                    href={appleUrl}
                                    variant="secondary"
                                    size="md"
                                    target="_blank"
                                    className={styles.optionBtn}
                                >
                                    Apple Maps
                                </Button>
                            </div>
                            <button
                                className={styles.close}
                                onClick={() => setIsOpen(false)}
                                aria-label="Close map app selector"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
