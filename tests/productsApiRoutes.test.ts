import assert from "node:assert/strict";
import test from "node:test";
import { GET as listProducts } from "../src/app/api/products/route";
import { GET as getProductDetail } from "../src/app/api/products/[slug]/route";

test("GET /api/products returns 400 for invalid list query", async () => {
    const request = new Request("http://localhost:3000/api/products?limit=0");
    const response = await listProducts(request);

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.success, false);
});

test("GET /api/products/[slug] returns 400 when slug is missing", async () => {
    const request = new Request("http://localhost:3000/api/products/");
    const response = await getProductDetail(request, {
        params: Promise.resolve({ slug: "   " }),
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.success, false);
});
