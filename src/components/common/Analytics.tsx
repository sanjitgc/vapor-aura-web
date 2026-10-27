"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { STORES } from "@/lib/stores";
import { GA_ID } from "@/lib/analytics";

// Google Analytics 4. The measurement ID comes from src/lib/analytics.ts.
// Besides page views, it records the taps that turn into store visits:
//   call_click        a phone number was tapped
//   directions_click  a Google Maps "Directions" link was tapped
//   doordash_click    an "Order on DoorDash" link was tapped
//   location_page_view  someone opened /sachse or /irving
// Each event carries `store` ("sachse", "irving" or "both") so the stores can be compared.

declare global {
    interface Window {
        dataLayer?: unknown[];
    }
}

// Google's queue: calls made before gtag.js loads wait in dataLayer and run once it arrives
function gtag(...args: unknown[]) {
    void args;
    // gtag.js reads the arguments object itself, not an array copy
    // eslint-disable-next-line prefer-rest-params
    (window.dataLayer = window.dataLayer || []).push(arguments);
}

function storeFor(link: HTMLAnchorElement, href: string): string {
    const tagged = link.closest("[data-store]")?.getAttribute("data-store");
    if (tagged) return tagged;
    const match = STORES.find(
        (s) => href.includes(s.tel.replace("tel:", "")) || href.includes(s.placeId) || href.includes(s.mapsCid),
    );
    return match?.slug ?? "both";
}

function eventFor(href: string): string | null {
    if (href.startsWith("tel:")) return "call_click";
    if (/google\.[a-z.]+\/maps\/dir/.test(href)) return "directions_click";
    if (/doordash\.com/.test(href)) return "doordash_click";
    return null;
}

let initialized = false;

export default function Analytics() {
    const pathname = usePathname();

    useEffect(() => {
        if (!GA_ID) return;
        if (!initialized) {
            initialized = true;
            gtag("js", new Date());
            gtag("config", GA_ID);
        }

        const onClick = (event: MouseEvent) => {
            const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
            if (!link) return;
            const href = link.getAttribute("href") ?? "";
            const name = eventFor(href);
            if (!name) return;
            gtag("event", name, { store: storeFor(link, href), link_url: href, page_path: window.location.pathname });
        };
        document.addEventListener("click", onClick, { capture: true });
        return () => document.removeEventListener("click", onClick, { capture: true });
    }, []);

    useEffect(() => {
        if (!GA_ID) return;
        const store = STORES.find((s) => s.path === pathname);
        if (store) gtag("event", "location_page_view", { store: store.slug });
    }, [pathname]);

    if (!GA_ID) return null;
    return <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />;
}
