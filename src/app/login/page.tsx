"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setError("");
        if (!email.trim() || !password.trim()) {
            setError("Please enter your email and password.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login-direct", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "login", email, password }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error ?? "Login failed."); return; }
            window.location.href = "/";

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
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.sub}>Sign in to your account</p>
                </div>

                <div className={styles.fields}>
                    <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                            className={styles.input}
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className={styles.field}>
                        <div className={styles.labelRow}>
                            <label className={styles.label}>Password</label>
                            <a href="#" className={styles.forgot}>Forgot password?</a>
                        </div>
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleLogin()}
                        />
                    </div>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button className={styles.btn} onClick={handleLogin} disabled={loading}>
                    {loading ? <span className={styles.spinner} /> : "Sign In"}
                </button>

                <p className={styles.switchText}>
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className={styles.switchLink}>Create one</Link>
                </p>
            </div>
        </main>
    );
}