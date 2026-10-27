"use client";

import Link from "next/link";
import styles from "./ContactSection.module.css";
import Button from "@/components/ui/Button";
import { submitInquiry } from "@/actions/submitInquiry";
import { useEffect, useRef, useState } from "react";
import { emailProblem, normalizePhone, PHONE_PROBLEM, type InquiryField } from "@/lib/inquiryValidation";
import { FaFacebookF, FaInstagram, FaLocationDot } from "react-icons/fa6";
import { SOCIAL, STORES, mapEmbedUrl, mapsListingUrl, weeklyHours } from "@/lib/stores";
import { chicagoWeekday } from "@/lib/hours";

// Both stores, from the shared store data so the address, phone and hours match every other page
const storeLocations = STORES.map((store) => ({
    slug: store.slug,
    path: store.path,
    name: store.name,
    address: store.street,
    cityStateZip: `${store.city}, TX ${store.zip}`,
    phone: store.phone,
    tel: store.tel,
    mapUrl: mapEmbedUrl(store),
    mapsListingUrl: mapsListingUrl(store),
    hoursSummary: store.hoursSummary,
    hours: weeklyHours(store),
}));

interface ContactSectionProps {
    // On /contact the section title is the page's H1; on the home page it's an H2
    titleAs?: "h1" | "h2";
    title?: string;
}

export default function ContactSection({ titleAs = "h2", title = "Get in touch" }: ContactSectionProps) {
    const Title = titleAs;
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [todayDay, setTodayDay] = useState<string | null>(null);
    const [expandedHours, setExpandedHours] = useState<Record<string, boolean>>({});
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<InquiryField, string>>>({});

    // Check one field; returns its error (if any) and shows it under the field
    function checkField(field: InquiryField, input: HTMLInputElement | null): string | undefined {
        if (!input) return undefined;
        let error: string | undefined;
        if (field === "email") {
            error = emailProblem(input.value) ?? undefined;
        } else {
            const formatted = normalizePhone(input.value);
            if (formatted === null) error = PHONE_PROBLEM;
            else if (formatted && formatted !== input.value) input.value = formatted;
        }
        setFieldErrors((prev) => ({ ...prev, [field]: error }));
        return error;
    }

    // While an error is showing, clear it as soon as the value is fixed
    function recheck(field: InquiryField, input: HTMLInputElement) {
        if (!fieldErrors[field]) return;
        const fixed = field === "email" ? !emailProblem(input.value) : normalizePhone(input.value) !== null;
        if (fixed) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Highlight today's row once the page is running in a browser (the server can't know "today")
    useEffect(() => {
        const id = requestAnimationFrame(() => setTodayDay(chicagoWeekday()));
        return () => cancelAnimationFrame(id);
    }, []);

    function toggleHours(name: string) {
        setExpandedHours((prev) => ({ ...prev, [name]: !prev[name] }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        const form = formRef.current;
        const emailInput = form.elements.namedItem("email") as HTMLInputElement | null;
        const phoneInput = form.elements.namedItem("phone") as HTMLInputElement | null;
        const emailError = checkField("email", emailInput);
        const phoneError = checkField("phone", phoneInput);
        if (emailError || phoneError) {
            setStatus(null);
            (emailError ? emailInput : phoneInput)?.focus();
            return;
        }

        setIsSubmitting(true);
        setStatus(null);

        const formData = new FormData(formRef.current);
        const result = await submitInquiry(formData);

        setIsSubmitting(false);
        if (!result.success && result.field) {
            // The server found a problem with one field: show it on that field
            setFieldErrors((prev) => ({ ...prev, [result.field as InquiryField]: result.message }));
            (form.elements.namedItem(result.field) as HTMLInputElement | null)?.focus();
            return;
        }
        setStatus(result);

        if (result.success) {
            form.reset();
            setFieldErrors({});
        }
    };

    return (
        <div className={`${styles.main} ${titleAs === "h1" ? styles.asPage : ""}`}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Title className={styles.title}>{title}</Title>
                    <p className={styles.subtitle}>
                        Questions? Feedback? We want to hear from you.
                    </p>
                </div>

                <div className={styles.content}>
                    <div className={styles.formColumn}>
                        <form className={styles.form} ref={formRef} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>Name</label>
                            <input type="text" id="name" name="name" className={styles.input} placeholder="Your name" required maxLength={100} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={styles.input}
                                placeholder="your@email.com"
                                required
                                maxLength={255}
                                autoComplete="email"
                                aria-invalid={fieldErrors.email ? true : undefined}
                                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                                onBlur={(e) => e.currentTarget.value.trim() && checkField("email", e.currentTarget)}
                                onChange={(e) => recheck("email", e.currentTarget)}
                            />
                            {fieldErrors.email && (
                                <p id="email-error" className={styles.fieldError}>
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.label}>Phone (optional)</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className={styles.input}
                                placeholder="(214) 501-3222"
                                maxLength={25}
                                autoComplete="tel"
                                inputMode="tel"
                                aria-invalid={fieldErrors.phone ? true : undefined}
                                aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                                onBlur={(e) => checkField("phone", e.currentTarget)}
                                onChange={(e) => recheck("phone", e.currentTarget)}
                            />
                            {fieldErrors.phone && (
                                <p id="phone-error" className={styles.fieldError}>
                                    {fieldErrors.phone}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="store" className={styles.label}>Which store?</label>
                            <select id="store" name="store" className={styles.select} defaultValue="Either">
                                <option value="Either">Either store</option>
                                <option value="Sachse">Sachse</option>
                                <option value="Irving">Irving</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="subject" className={styles.label}>Subject</label>
                            <select id="subject" name="subject" className={styles.select} required>
                                <option value="General Inquiry">General inquiry</option>
                                <option value="Store Experience">Store experience</option>
                                <option value="Product Request">Product request</option>
                                <option value="Careers">Careers</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message" className={styles.label}>Message</label>
                            <textarea id="message" name="message" className={styles.textarea} rows={5} placeholder="How can we help?" required maxLength={5000}></textarea>
                        </div>

                        {/* Spam trap: hidden from people, filled in by bots */}
                        <div className={styles.trap} aria-hidden="true">
                            <label htmlFor="website">Leave this field empty</label>
                            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                        </div>

                        <Button className={styles.submitBtn} size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Sending…" : "Send message"}
                        </Button>

                        {status && (
                            <p className={status.success ? styles.successMsg : styles.errorMsg}>
                                {status.message}
                            </p>
                        )}
                    </form>
                    </div>

                    <div className={styles.locationsColumn}>
                        {storeLocations.map((location) => (
                            <article key={location.slug} className={styles.locationCard} data-store={location.slug}>
                                <div className={styles.locationCardHeader}>
                                    <FaLocationDot className={styles.locationIcon} aria-hidden="true" />
                                    <h3 className={styles.locationCardTitle}>
                                        <Link href={location.path}>{location.name}</Link>
                                    </h3>
                                </div>
                                <div className={styles.locationCardBody}>
                                    <div className={styles.locationRow}>
                                        <span className={styles.locationLabel}>Address</span>
                                        <p className={styles.locationValue}>
                                            {location.address}<br />
                                            {location.cityStateZip}
                                        </p>
                                    </div>
                                    <div className={styles.locationRow}>
                                        <span className={styles.locationLabel}>Phone</span>
                                        <p className={styles.locationValue}>
                                            <a href={location.tel} className={styles.phoneLink}>{location.phone}</a>
                                        </p>
                                    </div>
                                    <div className={styles.locationRow}>
                                        <a
                                            href={location.mapsListingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.storeHoursLink}
                                        >
                                            Store hours
                                        </a>
                                        <div className={styles.hoursContainer}>
                                            <div
                                                className={`${styles.fullHours} ${(expandedHours[location.name] ?? true) ? "" : styles.fullHoursCollapsed}`}
                                                aria-hidden={!(expandedHours[location.name] ?? true)}
                                            >
                                                {location.hours.map(({ day, time }) => {
                                                    const isToday = todayDay !== null && day === todayDay;
                                                    return (
                                                        <div
                                                            key={day}
                                                            className={`${styles.hoursRow} ${isToday ? styles.hoursRowToday : ""}`}
                                                        >
                                                            <span className={styles.hoursDay}>{day}</span>
                                                            <span className={styles.hoursTime}>{time}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div
                                                className={`${styles.todayHours} ${(expandedHours[location.name] ?? true) ? styles.todayHoursHidden : ""}`}
                                                aria-hidden={expandedHours[location.name] ?? true}
                                            >
                                                <strong>Today&apos;s hours</strong>
                                                <span className={styles.todayHoursValue}>
                                                    {(todayDay && location.hours.find((h) => h.day === todayDay)?.time) ?? location.hoursSummary}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className={styles.expandHoursBtn}
                                                onClick={() => toggleHours(location.name)}
                                                aria-expanded={expandedHours[location.name] ?? true}
                                            >
                                                {(expandedHours[location.name] ?? true) ? "Hide full hours" : "View full hours"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <section id="locations" className={styles.mapSection} aria-labelledby="contact-map-title">
                    <h2 id="contact-map-title" className={styles.mapTitle}>Visit our locations</h2>
                    <div className={styles.mapGrid}>
                        {storeLocations.map((location) => (
                            <article key={location.slug} className={styles.mapCard} data-store={location.slug}>
                                <div className={styles.mapFrame}>
                                    <iframe
                                        src={location.mapUrl}
                                        title={`${location.name} map`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                                <h3 className={styles.mapCardTitle}>
                                    <Link href={location.path}>{location.name}</Link>
                                </h3>
                                <p className={styles.mapCardText}>{location.address}, {location.cityStateZip}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={styles.quickContact} aria-label="Quick contact and social links">
                    <p className={styles.quickText}>
                        Prefer a quick touchpoint? Connect with Vapor Aura on social or call us directly.
                    </p>
                    <div className={styles.socialLinks}>
                        <a
                            href={SOCIAL.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit Vapor Aura on Instagram"
                        >
                            <FaInstagram aria-hidden="true" />
                        </a>
                        <a
                            href={SOCIAL.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit Vapor Aura on Facebook"
                        >
                            <FaFacebookF aria-hidden="true" />
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
