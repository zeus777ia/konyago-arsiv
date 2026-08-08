import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { seoHead, websiteJsonLd, SITE_NAME } from "@/lib/seo";
import appCss from "../styles.css?url";

const base = seoHead({ path: "/" });

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      ...base.meta,
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap",
      },
      ...base.links,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: websiteJsonLd(),
      },
    ],
  }),
  component: RootDocument,
});

function RegisterSw() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const id = window.setTimeout(() => {
      void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }, 1500);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}

function RootDocument() {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg antialiased">
        <AuthProvider>
          <RegisterSw />
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

// keep name available for any static refs
void SITE_NAME;
