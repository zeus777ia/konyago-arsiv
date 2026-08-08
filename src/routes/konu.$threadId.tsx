import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { ForumShell } from "@/components/forum/layout";
import { Avatar } from "@/components/forum/avatar";
import { Button } from "@/components/ui/button";
import { getCategory, getUser } from "@/lib/forum/data";
import { displayName } from "@/lib/forum/names";
import { useForumStore } from "@/lib/forum/store";
import { formatRelative } from "@/lib/utils";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/konu/$threadId")({
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  const threads = useForumStore((s) => s.threads);
  const posts = useForumStore((s) => s.posts);
  const names = useForumStore((s) => s.names);
  const addReply = useForumStore((s) => s.addReply);
  const user = useCurrentUser();
  const [body, setBody] = useState("");

  const thread = threads.find((t) => t.id === threadId);
  const category = thread ? getCategory(thread.categoryId) : undefined;
  const threadPosts = useMemo(
    () =>
      posts
        .filter((p) => p.threadId === threadId)
        .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
    [posts, threadId],
  );

  if (!thread) {
    throw notFound();
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      toast.error("Mesaj boş olamaz");
      return;
    }
    addReply({
      threadId,
      body: body.trim(),
      authorName: user?.displayName ?? "Misafir",
    });
    setBody("");
    toast.success("Cevabınız eklendi");
  };

  return (
    <ForumShell>
      <Toaster theme="light" position="top-center" />
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link to="/" className="hover:text-primary">
          Ana sayfa
        </Link>
        <ChevronRight className="size-3" />
        {category && (
          <>
            <Link
              to="/kategori/$categoryId"
              params={{ categoryId: category.id }}
              className="hover:text-primary"
            >
              {category.name}
            </Link>
            <ChevronRight className="size-3" />
          </>
        )}
        <span className="line-clamp-1 text-fg">{thread.title}</span>
      </nav>

      <header className="mb-4 rounded-lg border border-border bg-surface px-4 py-3 shadow-card">
        <div className="mb-1 flex flex-wrap gap-1.5">
          {thread.pinned && (
            <span className="rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              SABİT
            </span>
          )}
          {thread.hot && (
            <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">
              SICAK
            </span>
          )}
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
          {thread.title}
        </h1>
        <p className="mt-1 text-xs text-subtle">
          {displayName(thread.authorId, names)} · {formatRelative(thread.createdAt)} ·{" "}
          {thread.replies} cevap · {thread.views} görüntülenme
        </p>
      </header>

      <div className="space-y-3">
        {threadPosts.map((post, idx) => {
          const author = getUser(post.authorId);
          const name = displayName(post.authorId, names);
          return (
            <article
              key={post.id}
              className="overflow-hidden rounded-lg border border-border bg-surface shadow-card"
            >
              <div className="grid sm:grid-cols-[160px_minmax(0,1fr)]">
                <aside className="border-b border-border bg-bg-elevated px-3 py-3 sm:border-r sm:border-b-0">
                  <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-2">
                    <Avatar name={name} size="lg" />
                    <div>
                      <div className="text-sm font-semibold text-fg">{name}</div>
                      {author?.title && (
                        <div className="text-[11px] text-primary">{author.title}</div>
                      )}
                      <div className="mt-1 text-[11px] text-subtle">
                        {author ? `${author.posts} mesaj` : "Yerel üye"}
                      </div>
                    </div>
                  </div>
                </aside>
                <div className="min-w-0 px-4 py-3">
                  <div className="mb-2 text-[11px] text-subtle">
                    #{idx + 1} · {formatRelative(post.createdAt)}
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-fg">
                    {renderBody(post.body)}
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {!threadPosts.length && (
          <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
            Bu konuda henüz mesaj yok.
          </p>
        )}
      </div>

      <form
        onSubmit={submit}
        className="mt-5 rounded-lg border border-border bg-surface p-4 shadow-card"
      >
        <h2 className="mb-2 text-sm font-semibold text-fg">Cevap yaz</h2>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          placeholder="Mesajınızı yazın…"
          className="w-full resize-y rounded-md border border-border bg-bg-elevated px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
        />
        <div className="mt-3 flex justify-end">
          <Button type="submit">
            <Send className="size-3.5" />
            Gönder
          </Button>
        </div>
      </form>
    </ForumShell>
  );
}

function renderBody(body: string) {
  const parts = body.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
