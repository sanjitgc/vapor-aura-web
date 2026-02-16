import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryRateLimiter, getInquiryRateLimitKey } from "../src/lib/rateLimit";

test("allows requests up to max limit and then blocks", () => {
    const limiter = new InMemoryRateLimiter({ windowMs: 1000, maxRequests: 2 });
    const key = getInquiryRateLimitKey("User@Example.com");
    const now = 1000;

    const first = limiter.check(key, now);
    const second = limiter.check(key, now + 1);
    const third = limiter.check(key, now + 2);

    assert.equal(first.allowed, true);
    assert.equal(second.allowed, true);
    assert.equal(third.allowed, false);
    assert.equal(third.remaining, 0);
});

test("resets after time window passes", () => {
    const limiter = new InMemoryRateLimiter({ windowMs: 1000, maxRequests: 1 });
    const key = "inquiry:test@example.com";

    const first = limiter.check(key, 1000);
    const blocked = limiter.check(key, 1001);
    const reset = limiter.check(key, 2001);

    assert.equal(first.allowed, true);
    assert.equal(blocked.allowed, false);
    assert.equal(reset.allowed, true);
});
