"use client";

import styles from "./page.module.css";
import Button from "@/components/ui/Button";
import { submitInquiry } from "@/actions/submitInquiry";
import { useRef, useState } from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";

const mapLocations = [
    {
        name: "Vapor Aura - Sachse",
        address: "5848 S State Hwy 78 #108, Sachse, TX 75048",
        mapUrl: "https://maps.google.com/maps?q=5848+S+State+Hwy+78+%23108,+Sachse,+TX+75048&t=&z=13&ie=UTF8&iwloc=&output=embed",
    },
    {
        name: "Vapor Aura - Irving",
        address: "825 W Royal Ln #140, Irving, TX 75039",
        mapUrl: "https://maps.google.com/maps?q=825+W+Royal+Ln+%23140,+Irving,+TX+75039&t=&z=13&ie=UTF8&iwloc=&output=embed",
    },
];

export default function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

                    <div className={styles.info}>
                        <div className={styles.infoBlock}>
                            <h3>Email Us</h3>
                            <p>contact@vaporauratx.com</p>
                        </div>
                        <div className={styles.infoBlock}>
                            <h3>Call Us</h3>
                            <p>(512) 555-0123</p>
                        </div>
                        <div className={styles.infoBlock}>
                            <h3>Socials</h3>
                            <p>@VaporAuraTX</p>
                        </div>
                        <div className={styles.infoBlock}>
                            <h3>Store Hours</h3>
                            <p>Mon-Sun: 10AM - 10PM</p>
                        </div>
                        <div className={styles.infoBlock}>
                            <h3>Store Locations</h3>
                            <p>Sachse, TX</p>
                            <p>Irving, TX</p>
                        </div>
                    </div>
                </div>

                <section className={styles.mapSection} aria-labelledby="contact-map-title">
                    <h2 id="contact-map-title" className={styles.mapTitle}>Visit Our Locations</h2>
                    <div className={styles.mapGrid}>
                        {mapLocations.map((location) => (
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
                                <p className={styles.mapCardText}>{location.address}</p>
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
