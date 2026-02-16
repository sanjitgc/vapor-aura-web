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
        assert.equal(result.message, "Please provide a valid email address");
    }
});

test("sanitizes and normalizes valid data", () => {
    const result = validateInquiryFormData(
        createFormData({
            name: "  Jane Doe  ",
            email: "  JANE@EXAMPLE.COM  ",
            subject: "  Support  ",
            message: "  Hello  ",
        }),
    );

    assert.equal(result.ok, true);
    if (result.ok) {
        assert.deepEqual(result.data, {
            name: "Jane Doe",
            email: "jane@example.com",
            subject: "Support",
            message: "Hello",
        });
    }
});

test("returns error when input exceeds limits", () => {
    const tooLongMessage = "x".repeat(5001);
    const result = validateInquiryFormData(createFormData({ message: tooLongMessage }));
    assert.equal(result.ok, false);
    if (!result.ok) {
        assert.equal(result.message, "One or more fields are too long");
    }
});
