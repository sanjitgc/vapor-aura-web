import assert from "node:assert/strict";
import test from "node:test";
import { STORES, SITE_URL, getStore, weeklyHours, schemaPhone, mapsListingUrl } from "../src/lib/stores";
import { storeSchema, organizationSchema, breadcrumbSchema } from "../src/lib/schema";
import { siteRoutes, PRIVATE_PATHS } from "../src/lib/routes";
import { storeStatus } from "../src/lib/hours";
import { STORE_PAGES, storeShelves } from "../src/lib/storePages";
import { CATEGORY_PAGES } from "../src/lib/categoryPages";
import { CATEGORIES, MORE_CATEGORIES, categoryById } from "../src/lib/catalog";

test("site URL is the www host Vercel serves", () => {
    assert.equal(SITE_URL, "https://www.vaporauratx.com");
});

test("weekly hours read like the Google listing", () => {
    const sachse = weeklyHours(getStore("sachse"));
    assert.equal(sachse.length, 7);
    assert.equal(sachse[0].day, "Monday");
    assert.equal(sachse[0].time, "7 AM – 1 AM");
    assert.equal(sachse.find((d) => d.day === "Friday")?.time, "7 AM – 2 AM");
    assert.equal(sachse.find((d) => d.day === "Sunday")?.time, "7 AM – 1 AM");
    assert.ok(weeklyHours(getStore("irving")).every((d) => d.time === "Open 24 hours"));
});

test("live status handles after-midnight closing", () => {
    const sachse = getStore("sachse");
    // Saturday (6) 12:30 AM is still Friday night's shift, open until 2 AM
    assert.deepEqual(storeStatus(sachse, 6, 30), { open: true, text: "Open until 2 AM" });
    // Monday (1) 1:30 AM: Sunday night closed at 1 AM, opens at 7 AM
    assert.deepEqual(storeStatus(sachse, 1, 90), { open: false, text: "Closed until 7 AM" });
    assert.deepEqual(storeStatus(getStore("irving"), 3, 200), { open: true, text: "Open 24 hours" });
});

test("store schema carries what Google uses for a local business", () => {
    for (const store of STORES) {
        const schema = storeSchema(store);
        assert.equal(schema["@type"], "Store");
        assert.equal(schema.url, `${SITE_URL}${store.path}`);
        assert.equal(schema.telephone, schemaPhone(store));
        assert.match(schema.telephone, /^\+1-\d{3}-\d{3}-\d{4}$/);
        assert.equal(schema.hasMap, mapsListingUrl(store));
        assert.ok(schema.geo.latitude > 32 && schema.geo.latitude < 34);
        assert.ok(schema.geo.longitude < -96 && schema.geo.longitude > -98);
        assert.ok(schema.sameAs.includes(mapsListingUrl(store)));
        assert.equal(schema.parentOrganization["@id"], organizationSchema()["@id"]);
        assert.ok(schema.areaServed.some((p) => p.name === store.city));
    }
});

test("breadcrumbs use absolute URLs in order", () => {
    const crumbs = breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Sachse", path: "/sachse" },
    ]);
    assert.equal(crumbs.itemListElement[0].item, `${SITE_URL}/`);
    assert.equal(crumbs.itemListElement[1].item, `${SITE_URL}/sachse`);
    assert.equal(crumbs.itemListElement[1].position, 2);
});

test("sitemap lists every store page and no private page", () => {
    const paths = siteRoutes().map((r) => r.path);
    for (const store of STORES) assert.ok(paths.includes(store.path), `${store.path} missing`);
    for (const page of CATEGORY_PAGES) assert.ok(paths.includes(`/products/${page.slug}`), `${page.slug} missing`);
    for (const p of ["/", "/products", "/locations", "/contact", "/about"]) assert.ok(paths.includes(p), `${p} missing`);
    for (const p of paths) assert.ok(!PRIVATE_PATHS.some((priv) => p.startsWith(priv.replace(/\/$/, ""))), `${p} is private`);
    assert.equal(new Set(paths).size, paths.length, "duplicate path");
    for (const r of siteRoutes()) assert.match(r.updated, /^\d{4}-\d{2}-\d{2}$/);
});

test("store page titles and descriptions fit in search results", () => {
    for (const copy of Object.values(STORE_PAGES)) {
        assert.ok(copy.metaTitle.length <= 60, copy.metaTitle);
        assert.ok(copy.metaDescription.length <= 160, copy.metaDescription);
        assert.ok(copy.faq.length >= 3);
    }
});

test("store pages only list shelves that exist, without brand names", () => {
    const shelves = storeShelves();
    assert.ok(shelves.length >= 8);
    for (const shelf of shelves) {
        assert.ok(shelf.text.length > 0);
        assert.doesNotMatch(shelf.text, /Geek Bar|Lost Mary|RAZ|Foger|Fifty Bar/);
    }
    assert.ok(!shelves.some((s) => ["flower", "edibles", "drinks", "mushroom"].includes(s.id)));
    for (const shelf of shelves) assert.match(shelf.href, /^\/products(\/[a-z0-9-]+|#[a-z0-9-]+)$/);
});

test("category pages fit in search results and match the product list", () => {
    const slugs = CATEGORY_PAGES.map((page) => page.slug);
    assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
    for (const page of CATEGORY_PAGES) {
        assert.ok(page.metaTitle.length <= 60, `${page.metaTitle} (${page.metaTitle.length})`);
        assert.ok(page.metaDescription.length <= 160, `${page.slug} description (${page.metaDescription.length})`);
        assert.ok(page.faq.length >= 2 && page.shelf.length >= 2, page.slug);
        assert.equal(categoryById(page.categoryId)?.page, page.slug, `${page.slug} is not linked from the product list`);
        for (const related of page.related) assert.ok(slugs.includes(related), `${page.slug} links to missing ${related}`);
    }
    for (const category of [...CATEGORIES, ...MORE_CATEGORIES]) {
        if (category.page) assert.ok(slugs.includes(category.page), `${category.id} points to a missing page`);
        // Hemp THC products get no page of their own
        if (category.hempThc) assert.equal(category.page, undefined);
    }
});

test("the site does not advertise 7-OH or nitrous oxide", () => {
    const words = JSON.stringify([CATEGORIES, MORE_CATEGORIES, CATEGORY_PAGES, STORE_PAGES]);
    assert.doesNotMatch(words, /7-?oh|hydroxymitragynine|nitrous|whippet/i);
});

test("store schema lists the store's own photos when it has them", () => {
    const photos = [`${SITE_URL}/_next/static/media/storefront-night.webp`, `${SITE_URL}/_next/static/media/sales-floor.webp`];
    assert.deepEqual(storeSchema(getStore("irving"), photos).image, photos);
    // No photos yet: the brand image stands in
    assert.equal(storeSchema(getStore("sachse")).image, `${SITE_URL}/og-image.jpg`);
    assert.equal(storeSchema(getStore("sachse"), []).image, `${SITE_URL}/og-image.jpg`);
});
