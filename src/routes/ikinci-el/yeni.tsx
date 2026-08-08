import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { useRef, useState } from "react";
import { SafeMeetingChecklist } from "@/components/forum/safe-meeting";
import { toast, Toaster } from "sonner";
import { ForumShell } from "@/components/forum/layout";
import { Button } from "@/components/ui/button";
import {
  CONDITIONS,
  DISTRICTS,
  LISTING_CATEGORIES,
  MARKETPLACE_NOTICE,
  compressImageFile,
  type ListingCategory,
  type ListingCondition,
} from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { moderateContent } from "@/lib/forum/moderation";
import { recordSpamEvent, runAllSpamChecks } from "@/lib/forum/spam";

export const Route = createFileRoute("/ikinci-el/yeni")({
  component: NewListingPage,
});

function NewListingPage() {
  const navigate = useNavigate();
  const addListing = useMarketplaceStore((s) => s.addListing);
  const user = useCurrentUser();
  const formStartedAtRef = useRef<number | null>(null);
  const markFormStart = () => {
    if (formStartedAtRef.current == null) formStartedAtRef.current = Date.now();
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ListingCategory>("diger");
  const [condition, setCondition] = useState<ListingCondition>("iyi");
  const [district, setDistrict] = useState(DISTRICTS[0]!);
  const [priceNote, setPriceNote] = useState("");
  const [contact, setContact] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [imgBusy, setImgBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("İlan vermek için giriş yapın");
      void navigate({ to: "/login" });
      return;
    }
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
    const spam = runAllSpamChecks({
      kind: "listing",
      title,
      body: description,
      honeypot,
      formStartedAt: formStartedAtRef.current ?? Date.now(),
    });
    if (!spam.ok) {
      toast.error(spam.reason);
      return;
    }
    const mod = moderateContent(title, description + " " + priceNote);
    if (!mod.ok) {
      toast.error(mod.reason);
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
      authorName: user.displayName ?? "Üye",
      imageDataUrl,
    });
    recordSpamEvent("listing", title + "\n" + description);
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

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex gap-2 rounded-lg border border-accent/25 bg-accent-soft px-3 py-2.5 text-xs leading-relaxed">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-accent" />
          <p>{MARKETPLACE_NOTICE}</p>
        </div>

        <form
          onSubmit={submit}
          className="relative space-y-4 rounded-lg border border-border bg-surface p-4 shadow-card sm:p-5"
        >
          <div
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            aria-hidden
          >
            <input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>
          <h1 className="text-lg font-semibold">İkinci el ilanı</h1>
          <Field label="Başlık">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              placeholder="Ürün başlığı"
              onFocus={markFormStart}
            />
          </Field>
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
          <Field label="İlçe">
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
          <Field label="Fiyat notu">
            <input
              value={priceNote}
              onChange={(e) => setPriceNote(e.target.value)}
              className={inputCls}
              placeholder="Örn. 2.500 ₺ / pazarlık"
            />
          </Field>
          <Field label="Açıklama">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={inputCls + " h-auto py-2"}
            />
          </Field>
          <Field label="İletişim">
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={inputCls}
              placeholder="Telefon veya kullanıcı adı"
            />
          </Field>
          <Field label="Fotoğraf (isteğe bağlı, tek görsel)">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-fg"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) {
                  setImageDataUrl(undefined);
                  return;
                }
                setImgBusy(true);
                try {
                  const url = await compressImageFile(f);
                  setImageDataUrl(url);
                  toast.success("Görsel eklendi");
                } catch (err) {
                  setImageDataUrl(undefined);
                  toast.error(err instanceof Error ? err.message : "Görsel yüklenemedi");
                } finally {
                  setImgBusy(false);
                }
              }}
            />
            {imageDataUrl && (
              <img
                src={imageDataUrl}
                alt=""
                className="mt-2 max-h-40 rounded-md border border-border object-contain"
              />
            )}
            <span className="text-[11px] text-subtle">
              Otomatik sıkıştırılır; tarayıcıda saklanır (max ~400KB).
            </span>
          </Field>
          <label className="flex items-start gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Sitede ödeme olmadığını, kuralları ve yasal uyarıyı kabul ediyorum.
              Dolandırıcılığa karşı dikkatli olacağım.
            </span>
          </label>
          <Button type="submit" className="w-full" disabled={imgBusy}>
            İlanı yayınla
          </Button>
        </form>
        <SafeMeetingChecklist />
      </div>
    </ForumShell>
  );
}

const inputCls =
  "h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
