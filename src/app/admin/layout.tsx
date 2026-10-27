import type { Metadata } from "next";

// Staff-only tools: kept out of search. The product data itself is protected by the admin key
// (every write to /api/products checks the x-admin-key header).
export const metadata: Metadata = {
    title: { absolute: "Admin | Vapor Aura" },
    robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return children;
}
