// Open/closed logic for the live status badges. Pure functions, so they can be tested and shared.
import type { Store } from "./stores";

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

// Weekly schedule as [open, close] minutes per day (Sunday = 0); close past midnight is stored as > 1440.
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

export function storeStatus(store: Store, day: number, mins: number): { open: boolean; text: string } {
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
        const when = i === 0 ? "" : i === 1 ? "tomorrow " : `${DAYS[(day + i) % 7].slice(0, 3)} `;
        return { open: false, text: `Closed until ${when}${fmt(s[0])}` };
    }
    return { open: false, text: "Closed" };
}

// Current day and minute in the stores' time zone
export function chicagoNow(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        hourCycle: "h23",
    }).formatToParts(date);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
    return { day: DAYS.indexOf(get("weekday")), mins: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

export function chicagoWeekday(date = new Date()): string {
    return DAYS[chicagoNow(date).day];
}
