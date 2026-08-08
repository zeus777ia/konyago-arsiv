import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Plus, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { ForumShell } from "@/components/forum/layout";
import { Button } from "@/components/ui/button";
import {
  CONDITIONS,
  LISTING_CATEGORIES,
  MARKETPLACE_NOTICE,
  type ListingCategory,
} from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { cn, formatRelative } from "@/lib/utils";

export const Route = createFileRoute("/ikinci-el/")({
  component: MarketPage,
});

function MarketPage() {
  const listings = useMarketplaceStore((s) => s.listings);
  const [cat, setCat] = useState<ListingCategory | "hepsi">("hepsi");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return listings
      .filter((l) => l.status !== "kaldirildi")
      .filter((l) => cat === "hepsi" || l.category === cat)
      .filter(
        (l) =>
          !query ||
          l.title.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.district.toLowerCase().includes(query),
      )
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [listings, cat, q]);

  return (
    <ForumShell search={q} onSearch={setQ}>
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link to="/" className="hover:text-primary">
          Ana sayfa
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-fg">İkinci el</span>
      </nav>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">İkinci El Pano</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Kullanmadığın ürünü ilan et, alıcı bul. Anlaşma ve para sitede değil —
            yüz yüze / dışarıda.
          </p>
        </div>
        <Button asChild>
          <Link to="/ikinci-el/yeni">
            <Plus className="size-3.5" />
            İlan ver
          </Link>
        </Button>
      </div>

      <div className="mb-4 flex gap-2 rounded-lg border border-accent/25 bg-accent-soft px-3 py-2.5 text-xs leading-relaxed text-fg">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-accent" />
        <p>{MARKETPLACE_NOTICE}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <FilterChip
          active={cat === "hepsi"}
          onClick={() => setCat("hepsi")}
          label="Tümü"
        />
        {LISTING_CATEGORIES.map((c) => (
          <FilterChip
            key={c.id}
            active={cat === c.id}
            onClick={() => setCat(c.id)}
            label={c.label}
          />
        ))}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {filtered.map((l) => {
          const catLabel =
            LISTING_CATEGORIES.find((c) => c.id === l.category)?.label ??
            l.category;
          const condLabel =
            CONDITIONS.find((c) => c.id === l.condition)?.label ?? l.condition;
          return (
            <li key={l.id}>
              <Link
                to="/ikinci-el/$listingId"
                params={{ listingId: l.id }}
                className="block h-full overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-colors hover:border-primary/30 hover:bg-surface-hover"
              >
                {l.imageDataUrl ? (
                  <div className="aspect-[16/9] bg-bg-elevated">
                    <img src={l.imageDataUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <div className="p-4">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {catLabel}
                  </span>
                  <span className="rounded bg-badge px-1.5 py-0.5 text-[10px] font-medium text-muted">
                    {condLabel}
                  </span>
                  {l.status === "satildi" && (
                    <span className="rounded bg-subtle/20 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                      SATILDI
                    </span>
                  )}
                </div>
                <h2 className="text-sm font-semibold text-fg">{l.title}</h2>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                  {l.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-subtle">
                  <span>
                    {l.district} · {formatRelative(l.createdAt)}
                  </span>
                  <span className="font-semibold text-fg">{l.priceNote}</span>
                </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {!filtered.length && (
        <p className="rounded-lg border border-border bg-surface px-4 py-10 text-center text-sm text-muted">
          Bu filtrede ilan yok. İlk ilanı sen ver.
        </p>
      )}
    </ForumShell>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-full border px-3 text-xs font-medium transition-colors",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-surface text-muted hover:bg-surface-hover hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}
