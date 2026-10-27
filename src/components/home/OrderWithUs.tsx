"use client";

import { useEffect, useRef, useState } from "react";
import { SiDoordash } from "react-icons/si";
import Button from "@/components/ui/Button";
import { DOORDASH_URL } from "@/lib/stores";
import styles from "./OrderWithUs.module.css";

// "Order with us" while our own delivery site is down: explain and point to DoorDash.
// The notice is only built when someone opens it, so its "under maintenance" heading isn't part of
// the page that search engines read near the top of the home page.
// When the site is back, swap this for a plain link to OWN_DELIVERY_URL (src/lib/stores.ts).
export default function OrderWithUs() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const close = () => dialogRef.current?.close();

    useEffect(() => {
        if (isOpen && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
    }, [isOpen]);

    return (
        <>
            <Button type="button" variant="outline" size="lg" aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
                Order with us
            </Button>

            {isOpen && (
                <dialog
                    ref={dialogRef}
                    className={styles.dialog}
                    aria-labelledby="own-delivery-title"
                    aria-describedby="own-delivery-text"
                    onClose={() => setIsOpen(false)}
                    // Clicking the dimmed area around the box closes it
                    onClick={(event) => {
                        if (event.target === dialogRef.current) close();
                    }}
                >
                    <div className={styles.box}>
                        <h2 id="own-delivery-title" className={styles.title}>
                            Our delivery site is under maintenance
                        </h2>
                        <p id="own-delivery-text" className={styles.text}>
                            We&apos;re working on it and it&apos;ll be back soon. In the meantime, you can order from
                            us on DoorDash.
                        </p>
                        <div className={styles.actions}>
                            <a
                                href={DOORDASH_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.primary}
                                onClick={close}
                            >
                                <SiDoordash aria-hidden="true" /> Order on DoorDash
                            </a>
                            <button type="button" className={styles.secondary} onClick={close}>
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
}
