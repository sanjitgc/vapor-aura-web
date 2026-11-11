import type { Metadata } from "next";
import { SITE_NAME } from "./stores";

const OG_IMAGE = {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "Vapor Aura, vape and smoke shop in Sachse and Irving, TX",
};

interface PageSeo {
    // Under 60 characters so Google shows it whole
    title: string;
    // About 140–160 characters
    description: string;
    // Path on this site, e.g. "/sachse". Becomes the page's canonical URL.
    path: string;
    // Shorter or friendlier title for link previews, if different
    socialTitle?: string;
    // The picture for link previews (1200×630, in /public). Defaults to the brand image.
    image?: { url: string; alt: string };
}

// Every page gets its own title, description and self-referencing canonical from here, so no page
// inherits another page's canonical by accident.
export function pageMetadata({ title, description, path, socialTitle, image }: PageSeo): Metadata {
    const ogImage = image ? { ...OG_IMAGE, ...image } : OG_IMAGE;
    return {
        title: { absolute: title },
        description,
        alternates: { canonical: path },
        openGraph: {
            type: "website",
            url: path,
            siteName: SITE_NAME,
            title: socialTitle ?? title,
            description,
            images: [ogImage],
        },
        twitter: {
            card: "summary_large_image",
            title: socialTitle ?? title,
            description,
            images: [ogImage.url],
        },
    };
}
