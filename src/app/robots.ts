import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/stores";
import { PRIVATE_PATHS } from "@/lib/routes";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            // The cart, admin tools and API have nothing for searchers. Those pages also carry noindex.
            disallow: PRIVATE_PATHS,
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
