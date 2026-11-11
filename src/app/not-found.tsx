import Link from "next/link";
import { STORES } from "@/lib/stores";
import loc from "@/components/location/LocationPage.module.css";

export const metadata = { title: "Page not found | Vapor Aura", robots: { index: false } };

// Shown for any address that isn't a page, so a mistyped or old link still leads somewhere useful
export default function NotFound() {
    return (
        <main className={loc.main}>
            <div className={loc.page}>
                <header className={loc.hero}>
                    <h1 className={loc.title}>We can&apos;t find that page</h1>
                    <p className={loc.lead}>
                        The link may be old or mistyped. These will get you where you were going.
                    </p>
                    <div className={loc.heroActions}>
                        <Link href="/" className={`${loc.button} ${loc.buttonPrimary}`}>
                            Go to the home page
                        </Link>
                        <Link href="/products" className={loc.button}>
                            See what we carry
                        </Link>
                        {STORES.map((store) => (
                            <Link key={store.slug} href={store.path} className={loc.button}>
                                {store.city} store
                            </Link>
                        ))}
                    </div>
                </header>
            </div>
        </main>
    );
}
