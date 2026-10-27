import type { Metadata } from "next";

// The cart is for shoppers already on the site, not a search result
export const metadata: Metadata = {
    title: { absolute: "Checkout | Vapor Aura" },
    robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
