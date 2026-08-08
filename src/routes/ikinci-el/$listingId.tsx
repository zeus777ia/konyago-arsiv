import {
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import { ChevronRight, MapPin, ShieldAlert, Trash2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { ForumShell } from "@/components/forum/layout";
import { UserName } from "@/components/forum/user-name";
import { Button } from "@/components/ui/button";
import {
  CONDITIONS,
  LISTING_CATEGORIES,
  MARKETPLACE_NOTICE,
} from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { formatRelative } from "@/lib/utils";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { isFounder } from "@/lib/staff/founder";

export const Route = createFileRoute("/ikinci-el/$listingId")({
  component: ListingDetailPage,
});

function ListingDetailPage() {
  const { listingId } = Route.useParams();
  const navigate = useNavigate();
  const listing = useMarketplaceStore((s) =>
    s.listings.find((l) => l.id === listingId),
  );
  const markSold = useMarketplaceStore((s) => s.markSold);
  const removeListing = useMarketplaceStore((s) => s.removeListing);
  const user = useCurrentUser();
  const founder = isFounder(user);

  if (!listing) throw notFound();

  const cat =
    LISTING_CATEGORIES.find((c) => c.id === listing.category)?.label ??
    listing.category;
  const cond =
    CONDITIONS.find((c) => c.id === listing.condition)?.label ??
    listing.condition;

  return (
    <ForumShell>
      <Toaster theme="light" position="top-center" />
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link to="/" className="hover:text-primary">
          Ana sayfa
        </Link>
        <ChevronRight className="size-3" />
        <Link to="/ikinci-el" className="hover:text-primary">
          İkinci el
        </Link>
        <ChevronRight className="size-3" />
        <span className="line-clamp-1 text-fg">{listing.title}</span>
      </nav>

      <article className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <span className="rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {cat}
            </span>
            <span className="rounded bg-badge px-1.5 py-0.5 text-[10px] font-medium text-muted">
              {cond}
            </span>
            {listing.status === "satildi" && (
              <span className="rounded bg-subtle/20 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                SATILDI
              </span>
            )}
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{listing.title}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs text-subtle">
            <MapPin className="size-3.5" />
            {listing.district} · {formatRelative(listing.createdAt)} ·{" "}
            <UserName name={listing.authorName} size="sm" />
          </p>
          <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-fg">
            {listing.description}
          </p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-bg-elevated px-3 py-2">
              <dt className="text-[11px] text-subtle">Fiyat notu</dt>
              <dd className="text-sm font-semibold">{listing.priceNote}</dd>
            </div>
            <div className="rounded-lg bg-bg-elevated px-3 py-2">
              <dt className="text-[11px] text-subtle">İletişim</dt>
              <dd className="text-sm font-semibold break-all">{listing.contact}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {listing.status === "aktif" && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  markSold(listing.id);
                  toast.message("İlan satıldı olarak işaretlendi");
                }}
              >
                Satıldı işaretle
              </Button>
            )}
            {founder && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-danger"
                onClick={() => {
                  if (!confirm("İlan kalıcı silinsin mi?")) return;
                  removeListing(listing.id);
                  toast.success("İlan silindi");
                  void navigate({ to: "/ikinci-el" });
                }}
              >
                <Trash2 className="size-3.5" />
                Kurucu: sil
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2 rounded-lg border border-accent/25 bg-accent-soft px-3 py-2.5 text-xs leading-relaxed">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-accent" />
          <p>{MARKETPLACE_NOTICE}</p>
        </div>
      </article>
    </ForumShell>
  );
}
