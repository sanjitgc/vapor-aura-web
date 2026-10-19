import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as a clean, premium font
import "./globals.css";
import { SITE_URL, STORES } from "@/lib/stores";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Vapor Aura | Vape & Smoke Shop in Sachse and Irving, TX",
  description:
    "Vapor Aura is a 21+ vape and smoke shop with stores in Sachse and Irving, TX. Vapes, e-liquid, glass, hookah, kratom and CBD. Irving is open 24 hours.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Vapor Aura",
    title: "Vapor Aura | Vape & Smoke Shop in Sachse and Irving, TX",
    description: "21+ vape and smoke shop in Sachse and Irving, TX. Irving is open 24 hours.",
    images: [{ url: "/vapor-aura-logo-new.png", alt: "Vapor Aura" }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AgeVerification from "@/components/common/AgeVerification";

const storeSchema = {
  "@context": "https://schema.org",
  "@graph": STORES.map((store) => ({
    "@type": "Store",
    "@id": `${SITE_URL}/#${store.slug}`,
    name: store.name,
    url: SITE_URL,
    telephone: store.tel.replace("tel:", ""),
    image: `${SITE_URL}/vapor-aura-logo-new.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.street,
      addressLocality: store.city,
      addressRegion: "TX",
      postalCode: store.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: store.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
        <AgeVerification />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
