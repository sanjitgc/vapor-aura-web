"use client";

import styles from "./page.module.css";
import Button from "@/components/ui/Button";
import { submitInquiry } from "@/actions/submitInquiry";
import { useRef, useState } from "react";

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
                    <h1 className={styles.title}>GET IN TOUCH</h1>
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
                    </div>
                </div>
            </div>
        </main>
    );
}
