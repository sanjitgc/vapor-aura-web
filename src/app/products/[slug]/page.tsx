import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPage from "@/components/category/CategoryPage";
import { CATEGORY_PAGES, getCategoryPage } from "@/lib/categoryPages";
import { pageMetadata } from "@/lib/seo";

// One static page per category in src/lib/categoryPages.ts; any other /products/<slug> is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return CATEGORY_PAGES.map((page) => ({ slug: page.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const copy = getCategoryPage((await params).slug);
    if (!copy) return {};
    return pageMetadata({ title: copy.metaTitle, description: copy.metaDescription, path: copy.path });
}

export default async function ProductCategoryPage({ params }: Props) {
    const copy = getCategoryPage((await params).slug);
    if (!copy) notFound();
    return <CategoryPage copy={copy} />;
}
