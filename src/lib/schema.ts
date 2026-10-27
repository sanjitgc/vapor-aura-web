// schema.org structured data (JSON-LD). Rendered with <JsonLd> on the page each block describes.
// Note: Google does not show product rich results (prices, stars) for tobacco and vaping products,
// so there is deliberately no Product markup. These blocks describe the business and its stores.
import {
    SITE_NAME,
    SITE_URL,
    SOCIAL,
    STORES,
    fullAddress,
    mapsListingUrl,
    schemaPhone,
    type Store,
} from "./stores";
import { CATEGORY_PAGES, type CategoryPageCopy } from "./categoryPages";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_URL = `${SITE_URL}/vapor-aura-logo-new.png`;

export function storeId(store: Store): string {
    return `${SITE_URL}${store.path}#store`;
}

export function organizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: { "@type": "ImageObject", url: LOGO_URL },
        image: `${SITE_URL}/og-image.jpg`,
        description: "Vape and smoke shop with two stores in the Dallas area: Sachse and Irving, Texas. 21+ only.",
        sameAs: [SOCIAL.instagram, SOCIAL.facebook],
        // Each store is described in full on its own page
        subOrganization: STORES.map((store) => ({ "@id": storeId(store) })),
    };
}

export function websiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: "en-US",
    };
}

export function storeSchema(store: Store) {
    return {
        "@context": "https://schema.org",
        "@type": "Store",
        "@id": storeId(store),
        name: SITE_NAME,
        alternateName: store.name,
        url: `${SITE_URL}${store.path}`,
        image: `${SITE_URL}/og-image.jpg`,
        logo: LOGO_URL,
        telephone: schemaPhone(store),
        priceRange: "$$",
        currenciesAccepted: "USD",
        address: {
            "@type": "PostalAddress",
            streetAddress: store.street,
            addressLocality: store.city,
            addressRegion: "TX",
            postalCode: store.zip,
            addressCountry: "US",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: store.geo.latitude,
            longitude: store.geo.longitude,
        },
        hasMap: mapsListingUrl(store),
        openingHoursSpecification: store.openingHours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
        })),
        sameAs: [mapsListingUrl(store), SOCIAL.instagram, SOCIAL.facebook],
        parentOrganization: { "@id": ORGANIZATION_ID },
        areaServed: store.servedPlaces.map((name) => ({ "@type": "Place", name })),
        description: `Vapor Aura's ${store.city} store at ${fullAddress(store)}. Vapes, e-liquid, glass, hookah and more. 21+ only.`,
        // The categories this store carries, each with its own page. Names and links only: no Product
        // or Offer details, which Google doesn't allow for tobacco and vaping products.
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `What Vapor Aura ${store.city} carries`,
            itemListElement: CATEGORY_PAGES.map((page) => ({
                "@type": "OfferCatalog",
                name: page.name,
                url: `${SITE_URL}${page.path}`,
            })),
        },
    };
}

// A category page (/products/hookah): a collection page about one kind of product, carried at both stores
export function categoryPageSchema(copy: CategoryPageCopy) {
    const url = `${SITE_URL}${copy.path}`;
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: copy.metaTitle,
        description: copy.metaDescription,
        inLanguage: "en-US",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@type": "Thing", name: copy.h1[0] },
        mentions: STORES.map((store) => ({ "@id": storeId(store) })),
    };
}

export interface Crumb {
    name: string;
    path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: crumb.name,
            item: `${SITE_URL}${crumb.path === "/" ? "/" : crumb.path}`,
        })),
    };
}
