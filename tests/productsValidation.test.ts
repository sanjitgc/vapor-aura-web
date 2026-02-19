import assert from "node:assert/strict";
import test from "node:test";
import {
    buildProductListQuery,
    validateProductPayload,
    validateProductsQuery,
} from "../src/lib/validation/products";

test("validateProductsQuery returns paginated defaults", () => {
    const result = validateProductsQuery(new URLSearchParams());
    assert.equal(result.ok, true);
    if (result.ok) {
        assert.equal(result.data.limit, 24);
        assert.equal(result.data.page, 1);
        assert.equal(result.data.skip, 0);
    }
});

test("validateProductsQuery rejects invalid category", () => {
    const result = validateProductsQuery(new URLSearchParams("category=Invalid"));
    assert.equal(result.ok, false);
    if (!result.ok) {
        assert.equal(result.message, "Invalid category filter");
    }
});

test("validateProductPayload sanitizes and accepts valid payload", () => {
    const result = validateProductPayload({
        name: "  Premium Vape  ",
        slug: " Premium Vape ",
        category: "Vape",
        description: "  Great product  ",
        image: "/icons/display/vapes.png",
        price: 29.99,
        inStock: true,
        isActive: true,
        sortOrder: 2,
    });

    assert.equal(result.ok, true);
    if (result.ok) {
        assert.equal(result.data.slug, "premium-vape");
        assert.equal(result.data.name, "Premium Vape");
    }
});

test("buildProductListQuery creates regex search filter", () => {
    const query = buildProductListQuery({
        limit: 24,
        page: 1,
        skip: 0,
        search: "vape+",
    });

    assert.equal(query.isActive, true);
    assert.ok("$or" in query);
});
