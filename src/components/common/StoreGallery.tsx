"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { FaChevronLeft, FaChevronRight, FaExpand, FaXmark } from "react-icons/fa6";
import type { StorePhoto } from "@/lib/storePhotos";
import styles from "./StoreGallery.module.css";

type Layout = "feature" | "brick";

interface StoreGalleryProps {
    photos: StorePhoto[];
    // "feature": the first photo runs tall down the left, the rest sit two by two beside it.
    // "brick": rows of two, a wide photo and a narrow one, swapping sides each row.
    layout: Layout;
    // Names the large photo viewer for screen readers, e.g. "Photos of Vapor Aura Irving"
    viewerLabel: string;
}

// How wide each photo is drawn, so phones don't download desktop-sized photos. A tile crops
// its photo to fill it, so a photo wider than its tile is drawn wider than the tile.
function tileSizes(layout: Layout, i: number, photo: StorePhoto): string {
    const ratio = photo.src.width / photo.src.height;
    const wider = (tileRatio: number) => Math.max(1, ratio / tileRatio);
    // Phones: tiles are 86% of the screen and 4:3
    const phone = `${Math.round(86 * wider(4 / 3))}vw`;
    if (layout === "feature") {
        const first = i === 0;
        const desktop = first ? Math.round(440 * wider(0.8)) : Math.round(370 * wider(1.36));
        return `(max-width: 640px) ${phone}, (max-width: 900px) 50vw, ${desktop}px`;
    }
    const wide = i % 4 === 0 || i % 4 === 3;
    return wide
        ? `(max-width: 640px) ${phone}, (max-width: 1248px) 58vw, ${Math.round(700 * wider(1.87))}px`
        : `(max-width: 640px) ${phone}, (max-width: 1248px) 42vw, ${Math.round(500 * wider(1.34))}px`;
}

// A grid of store photos. Each photo opens a full-screen viewer: swipe, use the arrow buttons
// or the arrow keys to move between photos, and Esc or the close button to leave.
export default function StoreGallery({ photos, layout, viewerLabel }: StoreGalleryProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const frameRef = useRef(0);
    const [open, setOpen] = useState(false);
    // The photo the viewer opened on, and the one showing now
    const [start, setStart] = useState(0);
    const [index, setIndex] = useState(0);
    const last = photos.length - 1;

    function openAt(i: number, trigger: HTMLButtonElement) {
        triggerRef.current = trigger;
        setStart(i);
        setIndex(i);
        setOpen(true);
    }

    // The slides only exist while the viewer is open. Once they're rendered, open the dialog,
    // jump to the photo that was picked and stop the page behind it from scrolling.
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!open || !dialog) return;
        if (!dialog.open) dialog.showModal();
        const track = trackRef.current;
        if (track) track.scrollTo({ left: start * track.clientWidth, behavior: "instant" });
        const root = document.documentElement;
        const before = root.style.overflow;
        root.style.overflow = "hidden";
        return () => {
            root.style.overflow = before;
        };
    }, [open, start]);

    function close() {
        dialogRef.current?.close();
    }

    // Runs for every way the dialog closes, Esc included
    function handleClose() {
        setOpen(false);
        triggerRef.current?.focus();
    }

    // Buttons and arrow keys loop round from the last photo to the first, so the button
    // that has focus never switches off under the person using it
    function go(i: number) {
        const track = trackRef.current;
        if (!track) return;
        const next = (i + photos.length) % photos.length;
        track.scrollTo({ left: next * track.clientWidth, behavior: "instant" });
        setIndex(next);
    }

    // Keep the counter in step when someone swipes
    function handleScroll() {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(() => {
            const track = trackRef.current;
            if (!track || !track.clientWidth) return;
            setIndex(Math.max(0, Math.min(last, Math.round(track.scrollLeft / track.clientWidth))));
        });
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            go(index + 1);
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(index - 1);
        }
    }

    // A click on the dark space around a photo closes the viewer
    function handleSlideClick(event: MouseEvent<HTMLElement>) {
        if (event.target === event.currentTarget) close();
    }

    const current = photos[index] ?? photos[0];

    return (
        <>
            <ul className={`${styles.grid} ${styles[layout]}`}>
                {photos.map((photo, i) => (
                    <li key={photo.id} className={styles.cell}>
                        <button
                            type="button"
                            className={styles.tile}
                            onClick={(event) => openAt(i, event.currentTarget)}
                            aria-haspopup="dialog"
                            aria-label={`${photo.label}: open a larger photo`}
                        >
                            <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                sizes={tileSizes(layout, i, photo)}
                                placeholder="blur"
                                className={styles.tileImage}
                                style={photo.focus ? { objectPosition: photo.focus } : undefined}
                            />
                            <span className={styles.tileLabel}>
                                {photo.label}
                                <FaExpand aria-hidden="true" className={styles.tileIcon} />
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            <dialog
                ref={dialogRef}
                className={styles.viewer}
                aria-label={viewerLabel}
                onClose={handleClose}
                onKeyDown={handleKeyDown}
            >
                {open && (
                    <>
                        <div className={styles.viewerBar}>
                            <p className={styles.counter} aria-hidden="true">
                                {index + 1} / {photos.length}
                            </p>
                            <button type="button" className={styles.round} onClick={close} aria-label="Close photos">
                                <FaXmark aria-hidden="true" />
                            </button>
                        </div>

                        <div ref={trackRef} className={styles.track} onScroll={handleScroll}>
                            {photos.map((photo, i) => (
                                <figure key={photo.id} className={styles.slide} onClick={handleSlideClick}>
                                    <Image
                                        src={photo.src}
                                        alt={photo.alt}
                                        sizes="100vw"
                                        placeholder="blur"
                                        loading={Math.abs(i - start) <= 1 ? "eager" : "lazy"}
                                        className={styles.slideImage}
                                    />
                                    <figcaption className={styles.slideCaption}>
                                        <strong>{photo.label}</strong> {photo.caption}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>

                        {photos.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    className={`${styles.round} ${styles.step} ${styles.prev}`}
                                    onClick={() => go(index - 1)}
                                    aria-label="Previous photo"
                                >
                                    <FaChevronLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.round} ${styles.step} ${styles.next}`}
                                    onClick={() => go(index + 1)}
                                    aria-label="Next photo"
                                >
                                    <FaChevronRight aria-hidden="true" />
                                </button>
                            </>
                        )}

                        <p className="visually-hidden" aria-live="polite">
                            {`Photo ${index + 1} of ${photos.length}: ${current.label}`}
                        </p>
                    </>
                )}
            </dialog>
        </>
    );
}
