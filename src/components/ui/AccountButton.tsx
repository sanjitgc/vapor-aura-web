"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./AccountButton.module.css";

interface Customer {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
}

export default function AccountButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [checking, setChecking] = useState(true);
    const wrapRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/auth/user")
            .then(r => r.ok ? r.json() : null)
            .then(data => setCustomer(data?.customer ?? null))
            .finally(() => setChecking(false));
    }, []);

    useEffect(() => {
        function onOutside(e: MouseEvent) {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setIsOpen(false);
        }
        document.addEventListener("mousedown", onOutside);
        return () => document.removeEventListener("mousedown", onOutside);
    }, []);

    async function handleLogout() {
        await fetch("/api/auth/logout");
        setCustomer(null);
        setIsOpen(false);
        router.push('/');
    }

    const initials = customer?.firstName
        ? (customer.firstName[0] + (customer.lastName?.[0] ?? "")).toUpperCase()
        : null;
    const displayName = customer?.firstName ?? customer?.email?.split("@")[0] ?? "Account";

    return (
        <div className={styles.wrap} ref={wrapRef}>
            <button
                className={`${styles.accountBtn} ${customer ? styles.loggedIn : ""}`}
                onClick={() => setIsOpen(v => !v)}
                aria-label="Account"
                disabled={checking}
            >
                {checking ? (
                    <span className={styles.spinner} />
                ) : initials ? (
                    <span className={styles.initials}>{initials}</span>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className={`${styles.dropdown} ${styles.dropdownVisible}`}>
                    {customer ? (
                        <>
                            <div className={styles.userInfo}>
                                <div className={styles.avatar}>{initials ?? "?"}</div>
                                <div>
                                    <p className={styles.greeting}>Hey, {displayName} 👋</p>
                                    <p className={styles.emailLine}>{customer.email}</p>
                                </div>
                            </div>
                            <div className={styles.divider} />
                            {/* <a href="/account/orders" className={styles.menuItem}><span>📦</span> My Orders</a>
                            <a href="/account/profile" className={styles.menuItem}><span>⚙️</span> Profile</a> */}
                            <div className={styles.divider} />
                            <button className={`${styles.menuItem} ${styles.danger}`} onClick={handleLogout}>
                                <span>🚪</span> Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <div className={styles.authHeader}>
                                <p className={styles.authTitle}>Vapor Aura</p>
                                <p className={styles.authSub}>Sign in to track orders &amp; manage your account</p>
                            </div>
                            <a href="/login" className={styles.primaryBtn}>Sign In</a>
                            <a href="/register" className={styles.secondaryBtn}>Create Account</a>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}