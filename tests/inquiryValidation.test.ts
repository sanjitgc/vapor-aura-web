import assert from "node:assert/strict";
import test from "node:test";
import { validateInquiryFormData } from "../src/lib/inquiryValidation";

function createFormData(overrides: Partial<Record<string, string>> = {}): FormData {
    const formData = new FormData();
    formData.set("name", overrides.name ?? "Jane Doe");
    formData.set("email", overrides.email ?? "jane@example.com");
    formData.set("subject", overrides.subject ?? "General Inquiry");
    formData.set("message", overrides.message ?? "Hello from test");
    return formData;
}

test("returns error when required fields are missing", () => {
    const formData = new FormData();
    formData.set("name", "Only Name");

    const result = validateInquiryFormData(formData);
    assert.equal(result.ok, false);
    if (!result.ok) {
        assert.equal(result.message, "All fields are required");
    }
});

test("returns error for invalid email format", () => {
    const result = validateInquiryFormData(createFormData({ email: "bad-email" }));
    assert.equal(result.ok, false);
    if (!result.ok) {
        assert.equal(result.message, "Enter a valid email address, like name@example.com.");
        assert.equal(result.field, "email");
    }
});

test("sanitizes and normalizes valid data", () => {
    const result = validateInquiryFormData(
        createFormData({
            name: "  Jane Doe  ",
            email: "  JANE@EXAMPLE.COM  ",
            subject: "  wholesale  ",
            message: "  Hello  ",
        }),
    );

    assert.equal(result.ok, true);
    if (result.ok) {
        assert.deepEqual(result.data, {
            name: "Jane Doe",
            email: "jane@example.com",
            subject: "Wholesale",
            message: "Hello",
            phone: "",
            store: "Either",
        });
        assert.equal(result.spam, false);
    }
});

test("only accepts the form's own subjects and stores", () => {
    const form = createFormData({ subject: "Buy cheap pills at spam.example" });
    form.set("store", "Plano");
    const result = validateInquiryFormData(form);
    assert.equal(result.ok, true);
    if (result.ok) {
        assert.equal(result.data.subject, "General Inquiry");
        assert.equal(result.data.store, "Either");
    }

    const irving = createFormData();
    irving.set("store", "irving");
    const picked = validateInquiryFormData(irving);
    assert.equal(picked.ok && picked.data.store, "Irving");
});

test("flags submissions that fill the hidden spam trap", () => {
    const form = createFormData();
    form.set("website", "http://spam.example");
    const result = validateInquiryFormData(form);
    assert.equal(result.ok, true);
    assert.equal(result.ok && result.spam, true);
});

test("returns error when input exceeds limits", () => {
    const tooLongMessage = "x".repeat(5001);
    const result = validateInquiryFormData(createFormData({ message: tooLongMessage }));
    assert.equal(result.ok, false);
    if (!result.ok) {
        assert.equal(result.message, "One or more fields are too long");
    }
});

test("flags common email domain typos", () => {
    const result = validateInquiryFormData(createFormData({ email: "jane@gmial.com" }));
    assert.equal(result.ok, false);
    if (!result.ok) {
        assert.equal(result.message, "Check your email. Did you mean jane@gmail.com?");
    }
});

test("accepts and formats a valid US phone number", () => {
    const formData = createFormData();
    formData.set("phone", "+1 214.501.3222");
    const result = validateInquiryFormData(formData);
    assert.equal(result.ok, true);
    if (result.ok) {
        assert.equal(result.data.phone, "(214) 501-3222");
    }
});

test("leaves phone optional", () => {
    const result = validateInquiryFormData(createFormData());
    assert.equal(result.ok, true);
    if (result.ok) {
        assert.equal(result.data.phone, "");
    }
});

test("rejects phone numbers that are not real US numbers", () => {
    for (const phone of ["12345", "(014) 501-3222", "214-501-32222", "call me", "5555555555"]) {
        const formData = createFormData();
        formData.set("phone", phone);
        const result = validateInquiryFormData(formData);
        assert.equal(result.ok, false, phone);
        if (!result.ok) {
            assert.equal(result.field, "phone");
        }
    }
});
