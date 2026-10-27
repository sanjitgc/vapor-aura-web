import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL } from "@/lib/stores";

// Fonts are self-hosted from src/app/fonts so builds never depend on Google Fonts.
const inter = localFont({
  src: "./fonts/inter-latin-wght.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

// Bricolage Grotesque, cut down to one static condensed ExtraBold (overlaps removed so
// outlined text renders cleanly).
const display = localFont({
  src: "./fonts/bricolage-grotesque-display.woff2",
  weight: "800",
  variable: "--font-display",
  display: "swap",
});

// Runs before first paint: while the 21+ gate is up, the hero figure's light-up sequence waits
// so first-time visitors actually see it. If the gate never mounts (scripts failed), release it.
const ageGateScript = `try{if(!localStorage.getItem("vapor-aura-age-verified")){var d=document.documentElement;d.setAttribute("data-age-gate","open");setTimeout(function(){if(!document.getElementById("age-verification-title"))d.removeAttribute("data-age-gate")},6000)}}catch(e){}`;

// Site-wide defaults. Each page sets its own title, description and canonical (src/lib/seo.ts),
// so nothing here may set a canonical: a layout canonical would be inherited by every page.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Vapor Aura | Vape & Smoke Shop in Sachse and Irving, TX",
  description:
    "Vapor Aura is a 21+ vape and smoke shop with stores in Sachse and Irving, TX. Vapes, e-liquid, glass, hookah, kratom and CBD. Irving is open 24 hours.",
  applicationName: "Vapor Aura",
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
import Analytics from "@/components/common/Analytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ageGateScript }} />
      </head>
      <body className={inter.className}>
        <AgeVerification />
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
