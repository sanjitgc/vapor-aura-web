import { notFound } from "next/navigation";
import CategoryPage from "@/components/category/CategoryPage";
import { CATEGORY_PAGES, categoryPage } from "@/lib/categoryPages";
import { existsSync } from "node:fs";
import path from "node:path";
import { pageMetadata } from "@/lib/seo";

// One page per entry in categoryPages.ts, built ahead of time. Any other address is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return CATEGORY_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const copy = categoryPage((await params).slug);
    if (!copy) return {};
    const image = `og/products/${copy.slug}.jpg`;
    return pageMetadata({
        title: copy.metaTitle,
        description: copy.metaDescription,
        path: `/products/${copy.slug}`,
        // Each category's own share picture, if one has been made (public/og/products/<slug>.jpg)
        image: existsSync(path.join(process.cwd(), "public", image))
            ? { url: `/${image}`, alt: `${copy.name} at Vapor Aura` }
            : undefined,
    });
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const copy = categoryPage((await params).slug);
    if (!copy) notFound();
    return <CategoryPage copy={copy} />;
}
