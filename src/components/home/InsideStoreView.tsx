"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { FaArrowRight } from "react-icons/fa6";
import StoreGallery from "@/components/common/StoreGallery";
import type { StorePhoto } from "@/lib/storePhotos";
import styles from "./InsideStore.module.css";

export interface StoreWithPhotos {
    slug: string;
    city: string;
    path: string;
    roadName: string;
    // Storefront first, then the inside
    photos: StorePhoto[];
}

// The photo section on the home page. With more than one store, a switch above the photos
// picks which store's photos show (an ARIA tab list: arrow keys, Home and End move between stores).
export default function InsideStoreView({ stores }: { stores: StoreWithPhotos[] }) {
    const [active, setActive] = useState(0);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const several = stores.length > 1;

    function select(i: number) {
        const next = (i + stores.length) % stores.length;
        setActive(next);
        tabRefs.current[next]?.focus();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        const moves: Record<string, number> = {
            ArrowRight: active + 1,
            ArrowLeft: active - 1,
            Home: 0,
            End: stores.length - 1,
        };
        if (event.key in moves) {
            event.preventDefault();
            select(moves[event.key]);
        }
    }

    const cities = stores.map((store) => store.city);
    const title = several ? "Inside our stores" : `Inside our ${cities[0]} store`;
    const subtitle = several
        ? `Real photos from our ${cities.slice(0, -1).join(", ")} and ${cities[cities.length - 1]} stores.`
        : `Real photos from our store on ${stores[0].roadName}.`;

    return (
        <>
            <div className={styles.header}>
                <h2 id="inside-title" className={styles.title}>
                    {title}
                </h2>
                <div className={styles.aside}>
                    <p className={styles.subtitle}>{subtitle}</p>
                    {several && (
                        <div role="tablist" aria-label="Choose a store" className={styles.tabs} onKeyDown={handleKeyDown}>
                            {stores.map((store, i) => (
                                <button
                                    key={store.slug}
                                    ref={(element) => {
                                        tabRefs.current[i] = element;
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`inside-tab-${store.slug}`}
                                    aria-controls={`inside-panel-${store.slug}`}
                                    aria-selected={i === active}
                                    tabIndex={i === active ? 0 : -1}
                                    className={styles.tab}
                                    onClick={() => setActive(i)}
                                >
                                    {store.city}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {stores.map((store, i) => (
                <div
                    key={store.slug}
                    id={`inside-panel-${store.slug}`}
                    role={several ? "tabpanel" : undefined}
                    aria-labelledby={several ? `inside-tab-${store.slug}` : undefined}
                    hidden={i !== active}
                >
                    <StoreGallery
                        photos={store.photos}
                        layout="feature"
                        viewerLabel={`Photos of Vapor Aura ${store.city}`}
                        footer={
                            <Link href={store.path} className={styles.link}>
                                See the {store.city} store <FaArrowRight aria-hidden="true" />
                            </Link>
                        }
                    />
                </div>
            ))}
        </>
    );
}
