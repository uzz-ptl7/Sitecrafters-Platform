import { useEffect } from "react";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: string;
    noindex?: boolean;
}

const SEO = ({
    title = "SiteCrafters - Custom Web Development & Digital Solutions",
    description = "We build custom websites and digital experiences designed for performance, clarity, and business growth.",
    keywords = "web development, custom websites, UI design, responsive websites, SEO, web agency",
    canonicalUrl = "https://sitecraftersz.co/",
    ogImage = "https://sitecraftersz.co/siteCraftersLogo.jpg",
    ogType = "website",
    noindex = false,
}: SEOProps) => {
    useEffect(() => {
        document.title = title;

        const upsertMeta = (
            selector: string,
            attr: "name" | "property",
            value: string
        ) => {
            let element = document.querySelector<HTMLMetaElement>(selector);

            if (!element) {
                element = document.createElement("meta");
                element.setAttribute(attr, selector.split("=").pop() || "");
                document.head.appendChild(element);
            }

            element.setAttribute("content", value);
        };

        // Standard SEO
        upsertMeta(`meta[name="description"]`, "name", description);
        upsertMeta(`meta[name="keywords"]`, "name", keywords);

        // Robots
        upsertMeta(
            `meta[name="robots"]`,
            "name",
            noindex
                ? "noindex, nofollow"
                : "index, follow, max-image-preview:large"
        );

        // OpenGraph (IMPORTANT: property-based)
        upsertMeta(`meta[property="og:title"]`, "property", title);
        upsertMeta(`meta[property="og:description"]`, "property", description);
        upsertMeta(`meta[property="og:type"]`, "property", ogType);
        upsertMeta(`meta[property="og:url"]`, "property", canonicalUrl);
        upsertMeta(`meta[property="og:image"]`, "property", ogImage);
        upsertMeta(`meta[property="og:site_name"]`, "property", "SiteCrafters");

        // Twitter
        upsertMeta(`meta[name="twitter:card"]`, "name", "summary_large_image");
        upsertMeta(`meta[name="twitter:title"]`, "name", title);
        upsertMeta(`meta[name="twitter:description"]`, "name", description);
        upsertMeta(`meta[name="twitter:image"]`, "name", ogImage);
        upsertMeta(`meta[name="twitter:site"]`, "name", "@sitecrafters");

        // Canonical
        let canonical = document.querySelector<HTMLLinkElement>(
            'link[rel="canonical"]'
        );

        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }

        canonical.setAttribute("href", canonicalUrl);
    }, [
        title,
        description,
        keywords,
        canonicalUrl,
        ogImage,
        ogType,
        noindex,
    ]);

    return null;
};

export default SEO;