import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as a clean, premium font
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vapor Aura | Premium Smoke Shop",
  description: "Experience the finest at Vapor Aura. Visit our locations in Texas regarding premium vape, smoke, and lifestyle products.",
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AgeVerification from "@/components/common/AgeVerification";
import WhyChoose from "@/components/common/WhyChoose";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AgeVerification />
        <Navbar />
        {children}
        <WhyChoose />
        <Footer />
      </body>
    </html>
  );
}
