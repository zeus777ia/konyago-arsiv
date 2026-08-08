import { Megaphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BANNER_DISMISS_KEY,
  useSiteMetaStore,
} from "@/lib/site/announcements";

export function FounderBanner() {
  const active = useSiteMetaStore((s) => s.bannerActive);
  const text = useSiteMetaStore((s) => s.bannerText);
  const href = useSiteMetaStore((s) => s.bannerHref);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BANNER_DISMISS_KEY);
      setDismissed(raw === text);
    } catch {
      setDismissed(false);
    }
  }, [text]);

  if (!active || dismissed || !text) return null;

  return (
    <div className="border-b border-amber-200/80 bg-gradient-to-r from-amber-50 via-white to-emerald-50">
      <div className="mx-auto flex max-w-6xl items-start gap-2 px-3 py-2 sm:items-center sm:px-4">
        <Megaphone className="mt-0.5 size-4 shrink-0 text-amber-700 sm:mt-0" />
        <p className="min-w-0 flex-1 text-xs leading-relaxed text-fg sm:text-[13px]">
          <span className="font-semibold text-amber-900">Duyuru · </span>
          <a href={href} className="hover:underline">
            {text}
          </a>
        </p>
        <button
          type="button"
          className="shrink-0 rounded p-1 text-subtle hover:bg-black/5 hover:text-fg"
          aria-label="Duyuruyu gizle"
          onClick={() => {
            try {
              sessionStorage.setItem(BANNER_DISMISS_KEY, text);
            } catch {
              /* ignore */
            }
            setDismissed(true);
          }}
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
