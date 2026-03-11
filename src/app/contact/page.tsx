"use client";

import styles from "./page.module.css";
import Button from "@/components/ui/Button";
import { submitInquiry } from "@/actions/submitInquiry";
import { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram, FaLocationDot, FaTiktok, FaXTwitter } from "react-icons/fa6";

const storeLocations = [
    {
        name: "Vapor Aura – Sachse",
        address: "5848 S State Hwy 78 #108",
        cityStateZip: "Sachse, TX 75048",
        phone: "+1 (214) 501-3222",
        tel: "tel:+12145013222",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=5848+S+State+Hwy+78+%23108,+Sachse,+TX+75048",
        mapUrl: "https://maps.google.com/maps?q=5848+S+State+Hwy+78+%23108,+Sachse,+TX+75048&t=&z=13&ie=UTF8&iwloc=&output=embed",
        mapsListingUrl: "https://www.google.com/maps/?q=5848+S+State+Hwy+78+Sachse+TX",
        hours: [
            { day: "Monday", time: "8 AM – 12 AM" },
            { day: "Tuesday", time: "8 AM – 12 AM" },
            { day: "Wednesday", time: "8 AM – 12 AM" },
            { day: "Thursday", time: "8 AM – 12 AM" },
            { day: "Friday", time: "8 AM – 12 AM" },
            { day: "Saturday", time: "8 AM – 12 AM" },
            { day: "Sunday", time: "8 AM – 12 AM" },
        ],
    },
    {
        name: "Vapor Aura – Irving",
        address: "825 W Royal Ln Suite 140",
        cityStateZip: "Irving, TX 75039",
        phone: "+1 (214) 272-8395",
        tel: "tel:+12142728395",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=825+W+Royal+Ln+Suite+140,+Irving,+TX+75039",
        mapUrl: "https://maps.google.com/maps?q=825+W+Royal+Ln+Suite+140,+Irving,+TX+75039&t=&z=13&ie=UTF8&iwloc=&output=embed",
        mapsListingUrl: "https://www.google.com/maps/?q=825+W+Royal+Ln+Irving+TX",
        hours: [
            { day: "Monday", time: "8 AM – 12 AM" },
            { day: "Tuesday", time: "8 AM – 12 AM" },
            { day: "Wednesday", time: "8 AM – 12 AM" },
            { day: "Thursday", time: "8 AM – 12 AM" },
            { day: "Friday", time: "8 AM – 12 AM" },
            { day: "Saturday", time: "8 AM – 12 AM" },
            { day: "Sunday", time: "8 AM – 12 AM" },
        ],
    },
];

export default function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [todayDay, setTodayDay] = useState<string | null>(null);
    const [expandedHours, setExpandedHours] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setTodayDay(new Date().toLocaleDateString("en-US", { weekday: "long" }));
    }, []);

    function toggleHours(name: string) {
        setExpandedHours((prev) => ({ ...prev, [name]: !prev[name] }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        setIsSubmitting(true);
        setStatus(null);

        const formData = new FormData(formRef.current);
        const result = await submitInquiry(formData);

        setStatus(result);
        setIsSubmitting(false);

        if (result.success) {
            formRef.current.reset();
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Get in Touch</h1>
                    <p className={styles.subtitle}>
                        Questions? Wholesale inquiries? Feedback? We want to hear from you.
                    </p>
                </div>

                <div className={styles.content}>
                    <div className={styles.formColumn}>
                        <form className={styles.form} ref={formRef} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>Name</label>
                            <input type="text" id="name" name="name" className={styles.input} placeholder="Your Name" required maxLength={100} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input type="email" id="email" name="email" className={styles.input} placeholder="your@email.com" required maxLength={255} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.label}>Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className={styles.input}
                                placeholder="(555) 123-4567"
                                maxLength={25}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="subject" className={styles.label}>Subject</label>
                            <select id="subject" name="subject" className={styles.select} required>
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Store Experience">Store Experience</option>
                                <option value="Product Request">Product Request</option>
                                <option value="Careers">Careers</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message" className={styles.label}>Message</label>
                            <textarea id="message" name="message" className={styles.textarea} rows={5} placeholder="How can we help?" required maxLength={5000}></textarea>
                        </div>

                        <Button className={styles.submitBtn} size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Message"}
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
                            <article key={location.name} className={styles.locationCard}>
                                <div className={styles.locationCardHeader}>
                                    <FaLocationDot className={styles.locationIcon} aria-hidden="true" />
                                    <h3 className={styles.locationCardTitle}>{location.name}</h3>
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
                                            Store Hours
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
                                                <strong>Today&apos;s Hours</strong>
                                                <span className={styles.todayHoursValue}>
                                                    {(todayDay && location.hours.find((h) => h.day === todayDay)?.time) ?? "—"}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className={styles.expandHoursBtn}
                                                onClick={() => toggleHours(location.name)}
                                                aria-expanded={expandedHours[location.name] ?? true}
                                            >
                                                {(expandedHours[location.name] ?? true) ? "Hide Full Hours" : "View Full Hours"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <section id="locations" className={styles.mapSection} aria-labelledby="contact-map-title">
                    <h2 id="contact-map-title" className={styles.mapTitle}>Visit Our Locations</h2>
                    <div className={styles.mapGrid}>
                        {storeLocations.map((location) => (
                            <article key={location.name} className={styles.mapCard}>
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
                                <h3 className={styles.mapCardTitle}>{location.name}</h3>
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
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit Vapor Aura on Instagram"
                        >
                            <FaInstagram aria-hidden="true" />
                        </a>
                        <a
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit Vapor Aura on Facebook"
                        >
                            <FaFacebookF aria-hidden="true" />
                        </a>
                        <a
                            href="https://www.tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit Vapor Aura on TikTok"
                        >
                            <FaTiktok aria-hidden="true" />
                        </a>
                        <a
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit Vapor Aura on X"
                        >
                            <FaXTwitter aria-hidden="true" />
                        </a>
                    </div>
                </section>
            </div>
        </main>
    );
}
