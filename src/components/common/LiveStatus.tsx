"use client";

import { useSyncExternalStore } from "react";
import { getStore, type Store } from "@/lib/stores";
import { chicagoNow, storeStatus } from "@/lib/hours";
import styles from "@/components/home/StoreStatus.module.css";

// A tiny clock shared by every badge on the page: ticks once a minute, and is null on the server
// so the HTML that search engines read always carries the store's real weekly hours.
let listeners: (() => void)[] = [];
let snapshot: string | null = null;
let timer: ReturnType<typeof setInterval> | undefined;

function read() {
    const now = chicagoNow();
    return `${now.day}:${now.mins}`;
}

function subscribe(listener: () => void) {
    listeners.push(listener);
    if (!timer) {
        snapshot = read();
        timer = setInterval(() => {
            snapshot = read();
            listeners.forEach((l) => l());
        }, 30_000);
    }
    return () => {
        listeners = listeners.filter((l) => l !== listener);
        if (!listeners.length && timer) {
            clearInterval(timer);
            timer = undefined;
        }
    };
}

function useChicagoMinute() {
    return useSyncExternalStore(
        subscribe,
        () => snapshot ?? (snapshot = read()),
        () => null,
    );
}

// "Open until 1 AM" / "Open 24 hours" / "Closed until 7 AM", live. Before scripts run it shows the
// store's hours summary instead of a placeholder.
export default function LiveStatus({ slug, className = "" }: { slug: Store["slug"]; className?: string }) {
    const store = getStore(slug);
    const minute = useChicagoMinute();
    const [day, mins] = minute ? minute.split(":").map(Number) : [];
    const status = minute ? storeStatus(store, day, mins) : null;

    return (
        <span
            className={`${styles.pill} ${status ? (status.open ? styles.open : styles.closed) : ""} ${className}`}
        >
            {status ? status.text : store.hoursSummary}
        </span>
    );
}
