import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Kurucu duyuru bandı + haftanın konusu */
export type SiteMetaState = {
  bannerText: string;
  bannerHref: string;
  bannerActive: boolean;
  featuredThreadId: string | null;
  featuredLabel: string;
  setBanner: (input: {
    text: string;
    href?: string;
    active?: boolean;
  }) => void;
  setFeatured: (threadId: string | null, label?: string) => void;
};

export const useSiteMetaStore = create<SiteMetaState>()(
  persist(
    (set) => ({
      bannerText:
        "KonyaGo Arşiv’e hoş geldiniz — kuralları okuyun, güvenli paylaşın.",
      bannerHref: "/kurallar",
      bannerActive: true,
      featuredThreadId: "official_rules",
      featuredLabel: "Haftanın / öne çıkan arşiv",
      setBanner: ({ text, href, active }) =>
        set((s) => ({
          bannerText: text.trim() || s.bannerText,
          bannerHref: href ?? s.bannerHref,
          bannerActive: active ?? s.bannerActive,
        })),
      setFeatured: (threadId, label) =>
        set((s) => ({
          featuredThreadId: threadId,
          featuredLabel: label?.trim() || s.featuredLabel,
        })),
    }),
    { name: "konyago-arsiv-site-meta-v1" },
  ),
);

export const BANNER_DISMISS_KEY = "konyago-banner-dismiss-v1";
