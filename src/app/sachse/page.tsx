import LocationPage from "@/components/location/LocationPage";
import { pageMetadata } from "@/lib/seo";
import { STORE_PAGES } from "@/lib/storePages";

const copy = STORE_PAGES.sachse;

export const metadata = pageMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/sachse",
    socialTitle: "Vapor Aura Sachse: vape & smoke shop on Hwy 78",
});

export default function SachsePage() {
    return <LocationPage slug="sachse" />;
}
