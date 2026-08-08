import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { ForumShell } from "@/components/forum/layout";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/forum/data";
import { useForumStore } from "@/lib/forum/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";

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
  const [categoryId, setCategoryId] = useState(
    kategori && CATEGORIES.some((c) => c.id === kategori)
      ? kategori
      : "genel",
  );
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 5) {
      toast.error("Başlık en az 5 karakter olmalı");
      return;
    }
    if (body.trim().length < 10) {
      toast.error("Mesaj en az 10 karakter olmalı");
      return;
    }
    const id = addThread({
      categoryId,
      title,
      body,
      authorName: user?.displayName ?? "Misafir",
    });
    toast.success("Konu açıldı");
    void navigate({ to: "/konu/$threadId", params: { threadId: id } });
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
        <p className="mb-5 text-sm text-muted">
          KonyaGo Arşiv’e katkı ekleyin. Spam ve reklama izin verilmez.
        </p>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-lg border border-border bg-surface p-4 shadow-card sm:p-5"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">
              Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            >
              {CATEGORIES.filter((c) => c.id !== "duyurular").map((c) => (
                <option key={c.id} value={c.id}>
                  {c.group} — {c.name}
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
              placeholder="Konu başlığı"
              className="h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
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
              placeholder="Deneyiminizi, sorunuzu veya arşiv notunuzu yazın…"
              className="w-full resize-y rounded-md border border-border bg-bg-elevated px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="secondary" asChild>
              <Link to="/">İptal</Link>
            </Button>
            <Button type="submit">Konuyu yayınla</Button>
          </div>
        </form>
      </div>
    </ForumShell>
  );
}
