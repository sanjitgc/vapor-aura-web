import { notFound } from "next/navigation";
import AreaPage from "@/components/area/AreaPage";
import { AREA_PAGES, areaPage } from "@/lib/areaPages";
import { pageMetadata } from "@/lib/seo";

// One page per city in areaPages.ts, built ahead of time. Any other address is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return AREA_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const copy = areaPage((await params).slug);
    if (!copy) return {};
    return pageMetadata({
        title: copy.metaTitle,
        description: copy.metaDescription,
        path: copy.path,
        image: { url: `/og/${copy.store}.jpg`, alt: `The Vapor Aura storefront closest to ${copy.place}` },
    });
}

export default async function SmokeShopNearPage({ params }: { params: Promise<{ slug: string }> }) {
    const copy = areaPage((await params).slug);
    if (!copy) notFound();
    return <AreaPage copy={copy} />;
}
