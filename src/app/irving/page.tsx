import LocationPage from "@/components/location/LocationPage";
import { pageMetadata } from "@/lib/seo";
import { STORE_PAGES } from "@/lib/storePages";

const copy = STORE_PAGES.irving;

export const metadata = pageMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/irving",
    socialTitle: "Vapor Aura Irving: open 24 hours on Royal Lane",
});

export default function IrvingPage() {
    return <LocationPage slug="irving" />;
}
