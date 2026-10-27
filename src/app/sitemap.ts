import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/stores";
import { siteRoutes } from "@/lib/routes";

// Built from the page list in src/lib/routes.ts, so every real page is included automatically
export default function sitemap(): MetadataRoute.Sitemap {
    return siteRoutes().map((route) => ({
        url: route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`,
        lastModified: route.updated,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}
