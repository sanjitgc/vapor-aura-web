import assert from "node:assert/strict";
import test from "node:test";
import { STORES, SITE_URL, getStore, weeklyHours, schemaPhone, mapsListingUrl } from "../src/lib/stores";
import { storeSchema, organizationSchema, breadcrumbSchema } from "../src/lib/schema";
import { siteRoutes, PRIVATE_PATHS } from "../src/lib/routes";
import { storeStatus } from "../src/lib/hours";
import { STORE_PAGES, storeShelves } from "../src/lib/storePages";
import { CATEGORY_PAGES, categoryPagePath } from "../src/lib/categoryPages";
import { categoryById } from "../src/lib/catalog";
import { categoryPageSchema } from "../src/lib/schema";

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
    for (const p of ["/", "/products", "/locations", "/contact"]) assert.ok(paths.includes(p), `${p} missing`);
    for (const page of CATEGORY_PAGES) assert.ok(paths.includes(page.path), `${page.path} missing`);
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
    assert.ok(!shelves.some((s) => ["flower", "edibles", "mushroom"].includes(s.id)));
});

test("category pages fit in search results and don't repeat each other", () => {
    assert.equal(CATEGORY_PAGES.length, 7);
    for (const page of CATEGORY_PAGES) {
        assert.equal(page.path, `/products/${page.slug}`);
        assert.ok(page.metaTitle.length <= 60, page.metaTitle);
        assert.ok(page.metaDescription.length >= 120 && page.metaDescription.length <= 160, page.metaDescription);
        for (const city of ["Sachse", "Irving"]) {
            assert.ok(page.metaTitle.includes(city), `${page.slug} title needs ${city}`);
            assert.ok(page.metaDescription.includes(city), `${page.slug} description needs ${city}`);
        }
        assert.ok(page.shelf.length >= 3 && page.tips.length >= 3 && page.faq.length >= 3, page.slug);
        for (const id of page.catalogIds) assert.ok(categoryById(id), `${page.slug}: unknown catalog id ${id}`);
    }
    for (const key of ["slug", "metaTitle", "metaDescription", "intro"] as const) {
        assert.equal(new Set(CATEGORY_PAGES.map((p) => p[key])).size, CATEGORY_PAGES.length, `duplicate ${key}`);
    }
    assert.equal(new Set(CATEGORY_PAGES.map((p) => p.h1.join(" "))).size, CATEGORY_PAGES.length, "duplicate H1");
});

test("category pages follow the content rules: no brands, no banned products, no health claims", () => {
    for (const page of CATEGORY_PAGES) {
        const text = JSON.stringify(page);
        // Brand names (Texas SB 2024: describe categories, not brands)
        assert.doesNotMatch(text, /Geek ?Bar|Lost Mary|Foger|Fifty Bar|Elf ?Bar|GeekVape|Puffco|Naked|Cartbox/i, page.slug);
        assert.doesNotMatch(text, /\b(RAZ|SMOK)\b/, page.slug);
        // Products the site doesn't build search traffic around
        assert.doesNotMatch(text, /delta|kratom|mushroom|cannabis|marijuana|\bweed\b|THCA|7-OH/i, page.slug);
        if (page.slug !== "cbd") assert.doesNotMatch(text, /\bTHC\b/, page.slug);
        // Health, cure or quit-smoking claims
        assert.doesNotMatch(
            text,
            /\b(cures?|cured|treatment|heal(s|ing)?|relief|relieve|anxiety|pain|sleep|insomnia|quit(ting)?|cessation|safer|healthier|wellness)\b/i,
            page.slug,
        );
    }
});

test("nicotine pages carry the FDA warning, accessories don't", () => {
    const withWarning = CATEGORY_PAGES.filter((p) => p.nicotine).map((p) => p.slug).sort();
    assert.deepEqual(withWarning, ["disposable-vapes", "e-liquid", "hookah"]);
});

test("catalog categories, store pages and store schema link to the category pages", () => {
    assert.equal(categoryPagePath("hookah"), "/products/hookah");
    assert.equal(categoryPagePath("pet-cbd"), "/products/cbd");
    assert.equal(categoryPagePath("kratom"), undefined);
    const shelves = storeShelves();
    assert.equal(shelves.find((s) => s.id === "glass")?.href, "/products/glass");
    assert.equal(shelves.find((s) => s.id === "kratom")?.href, "/products#kratom");
    for (const store of STORES) {
        const urls = storeSchema(store).hasOfferCatalog.itemListElement.map((item) => item.url);
        assert.deepEqual(urls, CATEGORY_PAGES.map((p) => `${SITE_URL}${p.path}`));
    }
    const schema = categoryPageSchema(CATEGORY_PAGES[0]);
    assert.equal(schema["@type"], "CollectionPage");
    assert.equal(schema.url, `${SITE_URL}/products/disposable-vapes`);
});
