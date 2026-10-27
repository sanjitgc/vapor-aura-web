// Every page search engines should find. The sitemap is built from this list, so a new page only
// needs a line here (and store pages are added automatically from STORES).
// `updated` = the date the page's content last really changed. Bump it when you edit a page;
// search engines learn to ignore dates that change on every deploy.
import { STORES } from "./stores";

export interface SiteRoute {
    path: string;
    updated: string;
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
    priority: number;
}

const PAGES: SiteRoute[] = [
    { path: "/", updated: "2026-10-27", changeFrequency: "weekly", priority: 1 },
    { path: "/products", updated: "2026-10-27", changeFrequency: "weekly", priority: 0.8 },
    { path: "/locations", updated: "2026-10-27", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", updated: "2026-10-27", changeFrequency: "yearly", priority: 0.5 },
    { path: "/privacy", updated: "2026-10-27", changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms", updated: "2026-10-20", changeFrequency: "yearly", priority: 0.2 },
];

const STORE_PAGES_UPDATED = "2026-10-27";

export function siteRoutes(): SiteRoute[] {
    const storeRoutes: SiteRoute[] = STORES.map((store) => ({
        path: store.path,
        updated: STORE_PAGES_UPDATED,
        changeFrequency: "weekly",
        priority: 0.9,
    }));
    // Home first, then the store pages, then everything else
    return [PAGES[0], ...storeRoutes, ...PAGES.slice(1)];
}

// Never in the sitemap and kept out of search: shopping cart, admin tools and the API
export const PRIVATE_PATHS = ["/admin", "/checkout", "/api/"];
