import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbSchema, type Crumb } from "@/lib/schema";
import styles from "./Breadcrumbs.module.css";

// Visible breadcrumb trail plus the matching BreadcrumbList structured data.
// The last crumb is the current page.
export default function Breadcrumbs({ crumbs, className = "" }: { crumbs: Crumb[]; className?: string }) {
    return (
        <nav aria-label="Breadcrumb" className={`${styles.crumbs} ${className}`}>
            <JsonLd data={breadcrumbSchema(crumbs)} />
            <ol>
                {crumbs.map((crumb, i) => (
                    <li key={crumb.path}>
                        {i < crumbs.length - 1 ? (
                            <Link href={crumb.path}>{crumb.name}</Link>
                        ) : (
                            <span aria-current="page">{crumb.name}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
