"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function RegisterPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        setError("");
        if (!firstName.trim() || !email.trim() || !password.trim()) {
            setError("Please fill in all required fields.");
            return;
        }
        if (password.length < 5) {
            setError("Password must be at least 5 characters.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login-direct", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "register", email, password, firstName, lastName }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error ?? "Registration failed."); return; }
            router.push("/");
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.bg}>
                <div className={styles.blob1} />
                <div className={styles.blob2} />
                <div className={styles.grid} />
            </div>

            <div className={styles.card}>
                <div className={styles.logo}>
                    <span className={styles.logoMark}>VA</span>
                    <span className={styles.logoText}>Vapor Aura</span>
                </div>

                <div className={styles.header}>
                    <h1 className={styles.title}>Create account</h1>
                    <p className={styles.sub}>Join Vapor Aura today</p>
                </div>

                <div className={styles.fields}>
                    <div className={styles.nameRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>First Name <span className={styles.req}>*</span></label>
                            <input className={styles.input} placeholder="Jane" value={firstName}
                                onChange={e => setFirstName(e.target.value)} autoFocus />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Last Name</label>
                            <input className={styles.input} placeholder="Doe" value={lastName}
                                onChange={e => setLastName(e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Email <span className={styles.req}>*</span></label>
                        <input className={styles.input} type="email" placeholder="you@example.com"
                            value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Password <span className={styles.req}>*</span></label>
                        <input className={styles.input} type="password" placeholder="Min. 5 characters"
                            value={password} onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleRegister()} />
                    </div>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button className={styles.btn} onClick={handleRegister} disabled={loading}>
                    {loading ? <span className={styles.spinner} /> : "Create Account"}
                </button>

                <p className={styles.switchText}>
                    Already have an account?{" "}
                    <Link href="/login" className={styles.switchLink}>Sign in</Link>
                </p>
            </div>
        </main>
    );
}