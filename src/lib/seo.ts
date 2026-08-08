/** Site SEO sabitleri — konyagoarsiv.org */

export const SITE_NAME = "KonyaGo Arşiv";
export const SITE_URL = "https://konyagoarsiv.org";
export const SITE_ORIGIN = "https://konyago.com.tr";
export const SITE_EMAIL = "info@konyago.com.tr";
export const SITE_LOCALE = "tr_TR";
export const SITE_LANG = "tr";

export const DEFAULT_DESCRIPTION =
  "KonyaGo Arşiv: Konya forum, semt sohbeti, ikinci el ilan panosu ve iş panosu. Ücretsiz üyelik, moderasyon ve güvenlik odaklı topluluk — konyagoarsiv.org";

export const DEFAULT_KEYWORDS = [
  "Konya forum",
  "KonyaGo Arşiv",
  "konyagoarsiv",
  "Konya ikinci el",
  "Konya iş ilanları",
  "Konya semt forumu",
  "Konya topluluk",
  "Konya sohbet",
  "konyago",
].join(", ");

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export function pageTitle(page?: string): string {
  if (!page) return `${SITE_NAME} | Konya Forum, İkinci El ve İş Panosu`;
  return `${page} | ${SITE_NAME}`;
}

export type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
  keywords?: string;
};

/** TanStack Router `head` meta/link paketi */
export function seoHead(input: SeoInput = {}) {
  const title = input.title
    ? pageTitle(input.title)
    : pageTitle();
  const description = input.description ?? DEFAULT_DESCRIPTION;
  const url = absoluteUrl(input.path ?? "/");
  const image = absoluteUrl(input.image ?? "/og.jpg");
  const robots = input.noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: input.keywords ?? DEFAULT_KEYWORDS },
      { name: "robots", content: robots },
      { name: "googlebot", content: robots },
      { name: "author", content: SITE_NAME },
      { name: "publisher", content: SITE_NAME },
      { name: "application-name", content: SITE_NAME },
      { name: "theme-color", content: "#1a3a32" },
      { name: "color-scheme", content: "light" },
      { name: "format-detection", content: "telephone=no" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: SITE_NAME },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "geo.region", content: "TR-42" },
      { name: "geo.placename", content: "Konya" },
      { name: "language", content: SITE_LANG },
      { property: "og:type", content: input.type ?? "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: SITE_LOCALE },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:alt", content: `${SITE_NAME} — Konya forum` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "tr", href: url },
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
  };
}

export function websiteJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "tr-TR",
        publisher: { "@id": `${SITE_URL}/#org` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/ara?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: SITE_URL,
        email: SITE_EMAIL,
        logo: absoluteUrl("/favicon.svg"),
        sameAs: [SITE_ORIGIN],
        areaServed: {
          "@type": "City",
          name: "Konya",
        },
        description:
          "Bağımsız Konya topluluk forumu. Resmî kamu kurumu sitesi değildir.",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: pageTitle(),
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#org` },
        description: DEFAULT_DESCRIPTION,
        inLanguage: "tr-TR",
      },
    ],
  };
  return JSON.stringify(data);
}
