import assert from "node:assert/strict";
import test from "node:test";
import { buildAutoReply, buildShopAlert, sendEmail, SHOP_INBOX } from "../src/lib/inquiryEmails";
import type { SanitizedInquiryInput } from "../src/lib/inquiryValidation";

const base: SanitizedInquiryInput = {
    name: "Jane <b>Doe</b>",
    email: "jane@example.com",
    subject: "Wholesale",
    message: "Do you carry <script>alert(1)</script> glass?",
    phone: "(214) 555-0101",
    store: "Irving",
};

function withEnv(vars: Record<string, string | undefined>, run: () => Promise<void> | void) {
    const before: Record<string, string | undefined> = {};
    for (const [key, value] of Object.entries(vars)) {
        before[key] = process.env[key];
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }
    const restore = () => {
        for (const [key, value] of Object.entries(before)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    };
    const result = run();
    if (result instanceof Promise) return result.finally(restore);
    restore();
}

test("shop alert goes to the shop inbox and replies go to the customer", () => {
    withEnv({ INQUIRY_NOTIFY_EMAIL: undefined, INQUIRY_FROM_EMAIL: undefined }, () => {
        const email = buildShopAlert(base, new Date("2026-10-20T20:00:00Z"));
        assert.deepEqual(email.to, [SHOP_INBOX]);
        assert.equal(SHOP_INBOX, "vaporaurasmokeshop@gmail.com");
        assert.equal(email.reply_to, "jane@example.com");
        assert.match(email.from, /onboarding@resend\.dev/);
        assert.match(email.subject, /Wholesale/);
        assert.match(email.subject, /Irving/);
        assert.match(email.text, /Phone: \(214\) 555-0101/);
        assert.match(email.text, /Oct 20, 2026, 3:00 PM/);
    });
});

test("shop alert escapes whatever the customer typed", () => {
    const { html } = buildShopAlert(base);
    assert.ok(!html.includes("<script>"));
    assert.ok(html.includes("&lt;script&gt;"));
    assert.ok(html.includes("Jane &lt;b&gt;Doe&lt;/b&gt;"));
});

test("INQUIRY_NOTIFY_EMAIL can list extra recipients", () => {
    withEnv({ INQUIRY_NOTIFY_EMAIL: "a@example.com, b@example.com" }, () => {
        assert.deepEqual(buildShopAlert(base).to, ["a@example.com", "b@example.com"]);
    });
});

test("auto-reply stays off until a verified sender is configured", () => {
    withEnv({ INQUIRY_FROM_EMAIL: undefined }, () => {
        assert.equal(buildAutoReply(base), null);
    });
});

test("auto-reply never echoes the customer's message and replies go to the shop", () => {
    withEnv({ INQUIRY_FROM_EMAIL: "Vapor Aura <hello@vaporauratx.com>" }, () => {
        const reply = buildAutoReply({ ...base, name: "Jane Doe" });
        assert.ok(reply);
        assert.deepEqual(reply.to, ["jane@example.com"]);
        assert.equal(reply.reply_to, SHOP_INBOX);
        assert.match(reply.text, /^Hi Jane,/);
        assert.ok(!reply.text.includes("glass"));
        assert.match(reply.text, /\(214\) 501-3222/);
        assert.match(reply.text, /\(214\) 272-8395/);
        // a "name" that isn't a name gets a plain greeting
        const odd = buildAutoReply({ ...base, name: "http://spam.example buy now" });
        assert.match(odd?.text ?? "", /^Hi there,/);
    });
});

test("sendEmail posts to Resend with the API key, and skips without one", async () => {
    const realFetch = globalThis.fetch;
    const calls: { url: string; init: RequestInit }[] = [];
    globalThis.fetch = (async (url: string, init: RequestInit) => {
        calls.push({ url, init });
        return new Response(JSON.stringify({ id: "test" }), { status: 200 });
    }) as typeof fetch;
    try {
        await withEnv({ RESEND_API_KEY: undefined }, async () => {
            assert.equal(await sendEmail(buildShopAlert(base)), false);
            assert.equal(calls.length, 0);
        });
        await withEnv({ RESEND_API_KEY: "re_test_key" }, async () => {
            assert.equal(await sendEmail(buildShopAlert(base)), true);
            assert.equal(calls[0].url, "https://api.resend.com/emails");
            assert.equal((calls[0].init.headers as Record<string, string>).Authorization, "Bearer re_test_key");
            const body = JSON.parse(String(calls[0].init.body));
            assert.deepEqual(body.to, ["vaporaurasmokeshop@gmail.com"]);
            assert.equal(body.reply_to, "jane@example.com");
        });
    } finally {
        globalThis.fetch = realFetch;
    }
});
