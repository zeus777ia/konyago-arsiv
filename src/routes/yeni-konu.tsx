import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { ForumShell } from "@/components/forum/layout";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/forum/data";
import { useForumStore } from "@/lib/forum/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { isFounder } from "@/lib/staff/founder";
import { isCategoryLockedForUsers } from "@/lib/forum/moderation";
import { SUGGESTED_TAGS, parseTagsInput } from "@/lib/forum/tags";
import { TagChips } from "@/components/forum/fresh-badge";

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
  const formStartedAtRef = useRef<number | null>(null);
  const markFormStart = () => {
    if (formStartedAtRef.current == null) formStartedAtRef.current = Date.now();
  };

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
  const [tagsRaw, setTagsRaw] = useState("");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("konyago-draft-topic");
      if (!raw) return;
      const d = JSON.parse(raw) as { title?: string; body?: string; kategori?: string };
      if (d.title) setTitle(d.title);
      if (d.body) setBody(d.body);
      if (d.kategori && openCategories.some((c) => c.id === d.kategori)) {
        setCategoryId(d.kategori);
      }
      sessionStorage.removeItem("konyago-draft-topic");
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tags = parseTagsInput(tagsRaw);

  const toggleTag = (tag: string) => {
    const cur = parseTagsInput(tagsRaw);
    if (cur.some((t) => t.toLocaleLowerCase("tr") === tag.toLocaleLowerCase("tr"))) {
      setTagsRaw(
        cur
          .filter(
            (t) => t.toLocaleLowerCase("tr") !== tag.toLocaleLowerCase("tr"),
          )
          .join(", "),
      );
    } else if (cur.length < 5) {
      setTagsRaw([...cur, tag].join(", "));
    } else {
      toast.message("En fazla 5 etiket");
    }
  };

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
      tags,
      authorName: user.displayName ?? "Üye",
      asFounder: founder,
      honeypot,
      formStartedAt: formStartedAtRef.current ?? Date.now(),
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    if (res.status === "pending") {
      toast.message("Konu moderasyon kuyruğuna alındı", {
        description:
          "Otomatik filtre geçildi. Kurucu onayından sonra yayında görünecek. Bildirim panelinizden takip edebilirsiniz.",
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
          Üyelik zorunludur. Spam koruması ve moderasyon onayı aktiftir.
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
              <strong>Onay süreci:</strong> Gönder → Otomatik filtre → İncelemede
              → Kurucu onayı → Yayında. Sonuç bildirim paneline düşer.
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
            <input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted">Kategori</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputCls}
              disabled={!user}
            >
              {openCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted">Başlık</span>
            <input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              disabled={!user}
              maxLength={120}
              placeholder="Konu başlığı"
              onFocus={markFormStart}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted">
              Etiketler (en fazla 5)
            </span>
            <input
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              className={inputCls}
              disabled={!user}
              placeholder="Virgülle ayırın: Sille, Gezi"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGGESTED_TAGS.map((tag) => {
                const on = tags.some(
                  (t) =>
                    t.toLocaleLowerCase("tr") === tag.toLocaleLowerCase("tr"),
                );
                return (
                  <button
                    key={tag}
                    type="button"
                    disabled={!user}
                    onClick={() => toggleTag(tag)}
                    className={
                      on
                        ? "rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-fg"
                        : "rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] font-medium text-muted hover:bg-primary-soft hover:text-primary"
                    }
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
            {tags.length > 0 && (
              <div className="pt-1">
                <TagChips tags={tags} />
              </div>
            )}
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted">Mesaj</span>
            <textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className={inputCls + " h-auto py-2"}
              disabled={!user}
              placeholder="Mesajınızı yazın…"
              onFocus={markFormStart}
            />
          </label>

          <Button type="submit" className="w-full" disabled={!user}>
            Konuyu gönder
          </Button>
        </form>
      </div>
    </ForumShell>
  );
}

const inputCls =
  "h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:opacity-60";
