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
  // Next's automatic fallback only knows Arial, which Android phones don't have, so they jumped
  // when Inter arrived. globals.css defines width-matched stand-ins for Arial and Roboto.
  adjustFontFallback: false,
  fallback: ["Vapor Body Fallback", "Vapor Body Fallback Roboto", "Arial", "sans-serif"],
});

// Bricolage Grotesque, cut down to one static condensed ExtraBold (overlaps removed so
// outlined text renders cleanly).
const display = localFont({
  src: "./fonts/bricolage-grotesque-display.woff2",
  weight: "800",
  variable: "--font-display",
  display: "swap",
  // The automatic Arial fallback is far wider than this condensed face, so headings wrapped
  // differently until the font arrived and the page jumped. A bold Arial scaled to the same
  // width (globals.css) keeps lines in place while the font loads.
  adjustFontFallback: false,
  fallback: ["Vapor Display Fallback", "Arial Narrow", "sans-serif"],
});

// Runs before first paint. If the visitor hasn't passed the 21+ gate, it marks the page so the
// gate (already in the HTML, see AgeVerification.tsx) shows straight away, without waiting for
// the rest of the JavaScript. It also handles the gate's two buttons. The policy pages linked
// from the gate stay open. With scripts off, the gate never shows.
const ageGateScript = `(function(){var d=document.documentElement,k="vapor-aura-age-verified",p=location.pathname,v=false;try{v=!!localStorage.getItem(k)}catch(e){}if(!v&&p!=="/privacy"&&p!=="/terms")d.setAttribute("data-age-gate","open");document.addEventListener("click",function(e){var t=e.target&&e.target.closest?e.target.closest("[data-age-answer]"):null;if(!t)return;if(t.getAttribute("data-age-answer")==="yes"){try{localStorage.setItem(k,"true")}catch(x){}d.removeAttribute("data-age-gate")}else{location.href="https://www.google.com"}})})()`;

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
import ChatLauncher from "@/components/assistant/ChatLauncher";
import TypingAnswers from "@/components/common/TypingAnswers";

// The chat assistant shows only once a Gemini API key is set for the deployment
const CHAT_ON = Boolean(process.env.GEMINI_API_KEY);

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
        {CHAT_ON && <ChatLauncher />}
        <TypingAnswers />
        <Analytics />
      </body>
    </html>
  );
}
