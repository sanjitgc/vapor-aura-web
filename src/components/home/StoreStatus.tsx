"use client";

import { useEffect, useState } from "react";
import { FaLocationDot, FaPhone, FaDiamondTurnRight } from "react-icons/fa6";
import { STORES } from "@/lib/stores";
import styles from "./StoreStatus.module.css";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function toMin(hhmm: string) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

function fmt(mins: number) {
    const m = ((mins % 1440) + 1440) % 1440;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    const h12 = h % 12 || 12;
    return `${h12}${mm ? `:${String(mm).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
}

type Store = (typeof STORES)[number];

// Weekly schedule as [open, close] minutes per day; close past midnight is stored as > 1440.
function schedule(store: Store) {
    const week: ([number, number] | null)[] = Array(7).fill(null);
    for (const h of store.openingHours) {
        const open = toMin(h.opens);
        let close = toMin(h.closes);
        if (h.closes === "23:59") close = 1440;
        if (close <= open) close += 1440;
        for (const d of h.days) week[DAYS.indexOf(d)] = [open, close];
    }
    return week;
}

function status(store: Store, day: number, mins: number) {
    const week = schedule(store);
    const allDay = week.every((s) => s && s[0] === 0 && s[1] === 1440);
    if (allDay) return { open: true, text: "Open 24 hours" };
    const prev = week[(day + 6) % 7];
    if (prev && prev[1] > 1440 && mins < prev[1] - 1440) return { open: true, text: `Open until ${fmt(prev[1])}` };
    const today = week[day];
    if (today && mins >= today[0] && mins < today[1]) return { open: true, text: `Open until ${fmt(today[1])}` };
    for (let i = 0; i < 7; i++) {
        const s = week[(day + i) % 7];
        if (!s || (i === 0 && mins >= s[0])) continue;
        return { open: false, text: `Closed · opens ${i === 0 ? "" : i === 1 ? "tomorrow " : DAYS[(day + i) % 7].slice(0, 3) + " "}${fmt(s[0])}` };
    }
    return { open: false, text: "Closed" };
}

function chicagoNow() {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago", weekday: "long", hour: "numeric", minute: "numeric", hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
    return { day: DAYS.indexOf(get("weekday")), mins: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

export default function StoreStatus() {
    const [now, setNow] = useState<{ day: number; mins: number } | null>(null);

    useEffect(() => {
        const tick = () => setNow(chicagoNow());
        tick();
        const id = setInterval(tick, 60_000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className={styles.grid}>
            {STORES.map((store) => {
                const s = now ? status(store, now.day, now.mins) : null;
                const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${store.street}, ${store.city}, TX ${store.zip}`)}`;
                return (
                    <article key={store.slug} className={styles.card}>
                        <div className={styles.top}>
                            <h2 className={styles.name}>{store.city}</h2>
                            <span className={`${styles.pill} ${s ? (s.open ? styles.open : styles.closed) : ""}`}>
                                {s ? s.text : store.hoursSummary}
                            </span>
                        </div>
                        <p className={styles.address}>
                            <FaLocationDot aria-hidden="true" /> {store.street}, {store.city}, TX {store.zip}
                        </p>
                        <div className={styles.actions}>
                            <a href={store.tel} className={styles.action}>
                                <FaPhone aria-hidden="true" /> {store.phone}
                            </a>
                            <a href={directions} target="_blank" rel="noopener noreferrer" className={`${styles.action} ${styles.actionPrimary}`}>
                                <FaDiamondTurnRight aria-hidden="true" /> Directions
                            </a>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
