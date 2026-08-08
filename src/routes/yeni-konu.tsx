import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { ForumShell } from "@/components/forum/layout";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/forum/data";
import { useForumStore } from "@/lib/forum/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { isFounder } from "@/lib/staff/founder";
import { isCategoryLockedForUsers } from "@/lib/forum/moderation";

const searchSchema = z.object({
  kategori: z.string().optional(),
});

export const Route = createFileRoute("/yeni-konu")({
  validateSearch: searchSchema,
  component: NewTopicPage,
});

function NewTopicPage() {
  const { kategori } = Route.useSearch();
  const navigate = useNavigate();
  const addThread = useForumStore((s) => s.addThread);
  const user = useCurrentUser();
  const founder = isFounder(user);
  const formStartedAt = useMemo(() => Date.now(), []);

  const openCategories = CATEGORIES.filter(
    (c) => founder || !isCategoryLockedForUsers(c.id),
  );

  const defaultCat =
    kategori && openCategories.some((c) => c.id === kategori)
      ? kategori
      : (openCategories.find((c) => c.id === "genel")?.id ??
        openCategories[0]?.id ??
        "genel");

  const [categoryId, setCategoryId] = useState(defaultCat);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Konu açmak için giriş yapmalısınız");
      void navigate({ to: "/login" });
      return;
    }
    if (title.trim().length < 5) {
      toast.error("Başlık en az 5 karakter olmalı");
      return;
    }
    if (body.trim().length < 15) {
      toast.error("Mesaj en az 15 karakter olmalı");
      return;
    }
    const res = addThread({
      categoryId,
      title,
      body,
      authorName: user.displayName ?? "Üye",
      asFounder: founder,
      honeypot,
      formStartedAt,
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    if (res.status === "pending") {
      toast.message("Konu moderasyon kuyruğuna alındı", {
        description:
          "Otomatik filtre geçildi. Kurucu onayından sonra yayında görünecek.",
      });
    } else {
      toast.success("Konu yayınlandı");
    }
    void navigate({
      to: "/konu/$threadId",
      params: { threadId: res.threadId },
    });
  };

  return (
    <ForumShell>
      <Toaster theme="light" position="top-center" />
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link to="/" className="hover:text-primary">
          Ana sayfa
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-fg">Yeni konu</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-xl font-semibold tracking-tight">Yeni konu aç</h1>
        <p className="mb-4 text-sm text-muted">
          Üyelik zorunludur. 8 katmanlı spam koruması ve moderasyon onayı aktiftir.
        </p>

        {!user && (
          <div className="mb-5 rounded-lg border border-border bg-surface px-4 py-4 text-sm shadow-card">
            <p className="text-muted">Konu açmak için hesabınıza giriş yapın.</p>
            <Button className="mt-3" asChild>
              <Link to="/login">Giriş / Kayıt</Link>
            </Button>
          </div>
        )}

        <div className="mb-5 space-y-2 rounded-lg border border-primary/20 bg-primary-soft px-3 py-2.5 text-xs leading-relaxed text-fg">
          <p className="flex gap-2">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              <strong>Onay süreci:</strong> Gönder → Otomatik filtre (spam +
              yasak içerik) → İncelemede → Kurucu onayı → Yayında.{" "}
              <Link to="/guvenlik" className="font-medium text-primary hover:underline">
                Güvenlik merkezi
              </Link>
            </span>
          </p>
        </div>

        <form
          onSubmit={submit}
          className="relative space-y-4 rounded-lg border border-border bg-surface p-4 shadow-card sm:p-5"
        >
          <div
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            aria-hidden
          >
            <label>
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">
              Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={!user}
              className="h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
            >
              {openCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.group} — {c.name}
                  {c.lockedForUsers ? " (yalnızca kurucu)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">
              Başlık
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              disabled={!user}
              placeholder="Konu başlığı"
              className="h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">
              Mesaj
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              disabled={!user}
              placeholder="İçeriğinizi yazın…"
              className="w-full resize-y rounded-md border border-border bg-bg-elevated px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="secondary" asChild>
              <Link to="/">İptal</Link>
            </Button>
            <Button type="submit" disabled={!user}>
              {founder ? "Konuyu yayınla" : "İncelemeye gönder"}
            </Button>
          </div>
        </form>
      </div>
    </ForumShell>
  );
}
