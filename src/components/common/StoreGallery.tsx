"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { FaChevronLeft, FaChevronRight, FaExpand, FaTableCellsLarge, FaXmark } from "react-icons/fa6";
import type { StorePhoto } from "@/lib/storePhotos";
import styles from "./StoreGallery.module.css";

type Layout = "feature" | "brick";

interface StoreGalleryProps {
    photos: StorePhoto[];
    // "feature": the first photo runs tall down the left, the next four sit two by two beside it.
    //   Any more open from a "See all photos" button (on phones every photo is in the swipe row).
    // "brick": rows of two, a wide photo and a narrow one swapping sides each row, with a row
    //   of three where the count needs it.
    layout: Layout;
    // Names the large photo viewer for screen readers, e.g. "Photos of Vapor Aura Irving"
    viewerLabel: string;
}

// The feature grid shows this many photos on tablets and up
const FEATURE_TILES = 5;

// How many photos sit in each row of the brick layout, so no photo is left alone in a row
const BRICK_ROWS: Record<number, number[]> = {
    1: [1],
    2: [2],
    3: [3],
    4: [2, 2],
    5: [2, 3],
    6: [2, 2, 2],
    7: [2, 3, 2],
    8: [2, 3, 3],
};

function brickRows(count: number): number[] {
    if (BRICK_ROWS[count]) return BRICK_ROWS[count];
    const rows: number[] = Array(Math.floor(count / 2)).fill(2);
    if (count % 2) rows[rows.length - 1] = 3;
    return rows;
}

// Each photo's width in the 12-column brick grid, and how many photos share its row
function brickCells(count: number): { span: number; rowSize: number }[] {
    const cells: { span: number; rowSize: number }[] = [];
    let pairs = 0;
    for (const size of brickRows(count)) {
        const spans = size === 1 ? [12] : size === 3 ? [4, 4, 4] : pairs++ % 2 === 0 ? [7, 5] : [5, 7];
        for (const span of spans) cells.push({ span, rowSize: size });
    }
    return cells;
}

// Row heights (CSS variables in the module): rows of three are a little shorter
function brickRowHeights(count: number): string {
    return brickRows(count)
        .map((size) => (size === 3 ? "var(--row-three)" : "var(--row-two)"))
        .join(" ");
}

// How wide each photo is drawn, so phones don't download desktop-sized photos. A tile crops
// its photo to fill it, so a photo wider than its tile is drawn wider than the tile.
function tileSizes(layout: Layout, i: number, photo: StorePhoto, span = 12, rowSize = 2): string {
    const ratio = photo.src.width / photo.src.height;
    const wider = (tileRatio: number) => Math.max(1, ratio / tileRatio);
    // Phones: tiles are 86% of the screen and 4:3
    const phone = `${Math.round(86 * wider(4 / 3))}vw`;
    if (layout === "feature") {
        const first = i === 0;
        const desktop = first ? Math.round(440 * wider(0.8)) : Math.round(370 * wider(1.36));
        return `(max-width: 640px) ${phone}, (max-width: 900px) 50vw, ${desktop}px`;
    }
    const width = (span / 12) * 1176;
    const factor = wider(width / (rowSize === 3 ? 300 : 370));
    return `(max-width: 640px) ${phone}, (max-width: 1248px) ${Math.round((span / 12) * 100 * factor)}vw, ${Math.round(width * factor)}px`;
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
    const cells = layout === "brick" ? brickCells(photos.length) : [];

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
            <div>
                <ul
                    className={`${styles.grid} ${styles[layout]}`}
                    style={layout === "brick" ? { gridTemplateRows: brickRowHeights(photos.length) } : undefined}
                >
                    {photos.map((photo, i) => {
                        const cell = layout === "brick" ? cells[i] : undefined;
                        return (
                            <li
                                key={photo.id}
                                className={styles.cell}
                                style={cell ? { gridColumn: `span ${cell.span}` } : undefined}
                            >
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
                                        sizes={tileSizes(layout, i, photo, cell?.span, cell?.rowSize)}
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
                        );
                    })}
                </ul>

                {layout === "feature" && photos.length > FEATURE_TILES && (
                    <button
                        type="button"
                        className={styles.showAll}
                        onClick={(event) => openAt(0, event.currentTarget)}
                        aria-haspopup="dialog"
                    >
                        <FaTableCellsLarge aria-hidden="true" />
                        See all {photos.length} photos
                    </button>
                )}
            </div>

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
