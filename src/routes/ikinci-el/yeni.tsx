import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { ForumShell } from "@/components/forum/layout";
import { Button } from "@/components/ui/button";
import {
  CONDITIONS,
  DISTRICTS,
  LISTING_CATEGORIES,
  MARKETPLACE_NOTICE,
  type ListingCategory,
  type ListingCondition,
} from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/ikinci-el/yeni")({
  component: NewListingPage,
});

function NewListingPage() {
  const navigate = useNavigate();
  const addListing = useMarketplaceStore((s) => s.addListing);
  const user = useCurrentUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ListingCategory>("diger");
  const [condition, setCondition] = useState<ListingCondition>("iyi");
  const [district, setDistrict] = useState(DISTRICTS[0]!);
  const [priceNote, setPriceNote] = useState("");
  const [contact, setContact] = useState("");
  const [accepted, setAccepted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 5) {
      toast.error("Başlık en az 5 karakter");
      return;
    }
    if (description.trim().length < 20) {
      toast.error("Açıklama en az 20 karakter");
      return;
    }
    if (!contact.trim()) {
      toast.error("İletişim bilgisi gerekli (telefon, kullanıcı adı vb.)");
      return;
    }
    if (!accepted) {
      toast.error("Kuralları onaylamanız gerekiyor");
      return;
    }
    const id = addListing({
      title,
      description,
      category,
      condition,
      district,
      priceNote: priceNote || "Fiyat görüşülür",
      contact,
      authorName: user?.displayName ?? "Misafir",
    });
    toast.success("İlan yayınlandı");
    void navigate({ to: "/ikinci-el/$listingId", params: { listingId: id } });
  };

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
        <span className="text-fg">Yeni ilan</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        <h1 className="text-xl font-semibold tracking-tight">İkinci el ilanı</h1>
        <div className="mt-3 flex gap-2 rounded-lg border border-accent/25 bg-accent-soft px-3 py-2.5 text-xs leading-relaxed">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-accent" />
          <p>{MARKETPLACE_NOTICE}</p>
        </div>

        <form
          onSubmit={submit}
          className="mt-5 space-y-4 rounded-xl border border-border bg-surface p-4 shadow-card sm:p-5"
        >
          <Field label="Başlık">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className={inputCls}
              placeholder="Örn. Çalışır bisiklet"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kategori">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ListingCategory)}
                className={inputCls}
              >
                {LISTING_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Durum">
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ListingCondition)}
                className={inputCls}
              >
                {CONDITIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Semt / bölge">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={inputCls}
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fiyat notu (sadece bilgi)">
              <input
                value={priceNote}
                onChange={(e) => setPriceNote(e.target.value)}
                className={inputCls}
                placeholder="Örn. 2.000 ₺ / teklif"
              />
            </Field>
          </div>
          <Field label="Açıklama">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={inputCls}
              placeholder="Ürünü anlat. Sitede ödeme yok; yüz yüze anlaşın."
            />
          </Field>
          <Field label="İletişim (alıcıya görünecek)">
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={inputCls}
              placeholder="Telefon, Telegram, e-posta…"
            />
          </Field>
          <label className="flex items-start gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Sitede ödeme / komisyon olmadığını, anlaşma ve teslimatın site
              dışında kendi sorumluluğumda olacağını kabul ediyorum.
            </span>
          </label>
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="secondary" asChild>
              <Link to="/ikinci-el">İptal</Link>
            </Button>
            <Button type="submit">İlanı yayınla</Button>
          </div>
        </form>
      </div>
    </ForumShell>
  );
}

const inputCls =
  "h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 min-h-10";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
