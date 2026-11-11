import { notFound } from "next/navigation";
import CategoryPage from "@/components/category/CategoryPage";
import { CATEGORY_PAGES, categoryPage } from "@/lib/categoryPages";
import { pageMetadata } from "@/lib/seo";

// One page per entry in categoryPages.ts, built ahead of time. Any other address is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return CATEGORY_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const copy = categoryPage((await params).slug);
    if (!copy) return {};
    return pageMetadata({
        title: copy.metaTitle,
        description: copy.metaDescription,
        path: `/products/${copy.slug}`,
    });
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const copy = categoryPage((await params).slug);
    if (!copy) notFound();
    return <CategoryPage copy={copy} />;
}
