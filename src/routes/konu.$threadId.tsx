import {
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  Flame,
  Lock,
  Pin,
  Quote,
  Send,
  Sparkles,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { ForumShell } from "@/components/forum/layout";
import { Avatar } from "@/components/forum/avatar";
import { UserName } from "@/components/forum/user-name";
import { FreshBadges, TagChips } from "@/components/forum/fresh-badge";
import { Button } from "@/components/ui/button";
import { getCategory, getUser } from "@/lib/forum/data";
import { displayName } from "@/lib/forum/names";
import { useForumStore } from "@/lib/forum/store";
import { formatRelative } from "@/lib/utils";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { isFounder } from "@/lib/staff/founder";
import { ReportButton } from "@/components/forum/report-button";

export const Route = createFileRoute("/konu/$threadId")({
  component: ThreadPage,
});

type QuoteDraft = {
  postId: string;
  authorName: string;
  snippet: string;
};

function ThreadPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const threads = useForumStore((s) => s.threads);
  const posts = useForumStore((s) => s.posts);
  const names = useForumStore((s) => s.names);
  const addReply = useForumStore((s) => s.addReply);
  const deleteThread = useForumStore((s) => s.deleteThread);
  const deletePost = useForumStore((s) => s.deletePost);
  const togglePin = useForumStore((s) => s.togglePin);
  const toggleLock = useForumStore((s) => s.toggleLock);
  const toggleHot = useForumStore((s) => s.toggleHot);
  const setFeaturedThread = useForumStore((s) => s.setFeaturedThread);
  const approveThread = useForumStore((s) => s.approveThread);
  const rejectThread = useForumStore((s) => s.rejectThread);
  const bumpViews = useForumStore((s) => s.bumpViews);
  const user = useCurrentUser();
  const founder = isFounder(user);
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [quote, setQuote] = useState<QuoteDraft | null>(null);
  const formStartedAtRef = useRef<number | null>(null);
  const markFormStart = () => {
    if (formStartedAtRef.current == null) formStartedAtRef.current = Date.now();
  };

  const thread = threads.find((t) => t.id === threadId);
  const category = thread ? getCategory(thread.categoryId) : undefined;
  const threadPosts = useMemo(
    () =>
      posts
        .filter((p) => p.threadId === threadId)
        .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
    [posts, threadId],
  );

  useEffect(() => {
    if (threadId) bumpViews(threadId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  if (!thread) {
    throw notFound();
  }

  const isOwner =
    !!user?.displayName && names[thread.authorId] === user.displayName;
  const canView =
    !thread.status ||
    thread.status === "approved" ||
    founder ||
    (thread.status === "pending" && isOwner);

  if (!canView) {
    throw notFound();
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Cevap yazmak için giriş yapmalısınız");
      return;
    }
    if (body.trim().length < 2) {
      toast.error("Mesaj çok kısa");
      return;
    }
    const res = addReply({
      threadId,
      body: body.trim(),
      authorName: user?.displayName ?? "Misafir",
      asFounder: founder,
      honeypot,
      formStartedAt: formStartedAtRef.current ?? Date.now(),
      quote: quote ?? undefined,
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setBody("");
    setQuote(null);
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

      {thread.status === "pending" && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Bu konu <strong>incelemede</strong>. Onaylanana kadar herkese açık
          listelerde görünmez.
        </div>
      )}
      {thread.status === "rejected" && (
        <div className="mb-3 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger">
          Bu konu reddedildi
          {thread.rejectReason ? `: ${thread.rejectReason}` : "."}
        </div>
      )}

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
          {thread.featured && (
            <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-800">
              ÖNE ÇIKAN
            </span>
          )}
          {thread.locked && (
            <span className="rounded bg-badge px-1.5 py-0.5 text-[10px] font-semibold text-muted">
              KİLİTLİ
            </span>
          )}
          {thread.status === "pending" && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
              İNCELEMEDE
            </span>
          )}
          <FreshBadges thread={thread} />
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
          {thread.title}
        </h1>
        {thread.tags && thread.tags.length > 0 && (
          <div className="mt-2">
            <TagChips tags={thread.tags} />
          </div>
        )}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <p className="flex flex-wrap items-center gap-1 text-xs text-subtle">
            <UserName name={displayName(thread.authorId, names)} size="sm" />
            <span>· {formatRelative(thread.createdAt)}</span>
            <span>
              · {thread.replies} cevap · {thread.views} görüntülenme
            </span>
          </p>
          <ReportButton targetType="thread" targetId={threadId} />
        </div>

        {founder && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
            <span className="founder-badge mr-1 inline-flex items-center self-center rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider">
              KURUCU YETKİLERİ
            </span>
            {thread.status === "pending" && (
              <>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    approveThread(threadId);
                    toast.success("Onaylandı — yazara bildirim gitti");
                  }}
                >
                  <Check className="size-3.5" />
                  Onayla
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="text-danger"
                  onClick={() => {
                    rejectThread(threadId);
                    toast.message("Reddedildi — yazara bildirim gitti");
                  }}
                >
                  <X className="size-3.5" />
                  Reddet
                </Button>
              </>
            )}
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                togglePin(threadId);
                toast.success(thread.pinned ? "Sabit kaldırıldı" : "Sabitlendi");
              }}
            >
              <Pin className="size-3.5" />
              {thread.pinned ? "Sabiti kaldır" : "Sabitle"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                toggleLock(threadId);
                toast.success(thread.locked ? "Kilit açıldı" : "Kilitlendi");
              }}
            >
              {thread.locked ? (
                <Unlock className="size-3.5" />
              ) : (
                <Lock className="size-3.5" />
              )}
              {thread.locked ? "Kilidi aç" : "Kilitle"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                toggleHot(threadId);
                toast.success(
                  thread.hot ? "Sıcak kaldırıldı" : "Sıcak işaretlendi",
                );
              }}
            >
              <Flame className="size-3.5" />
              {thread.hot ? "Sıcak kaldır" : "Sıcak yap"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setFeaturedThread(threadId);
                toast.success(
                  thread.featured
                    ? "Öne çıkan kaldırıldı"
                    : "Haftanın / öne çıkan arşive alındı",
                );
              }}
            >
              <Sparkles className="size-3.5" />
              {thread.featured ? "Öne çıkanı kaldır" : "Öne çıkar"}
            </Button>
            {!threadId.startsWith("official_") && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="border-danger/40 text-danger hover:bg-danger/10"
                onClick={() => {
                  if (!confirm("Konu ve tüm mesajlar silinsin mi?")) return;
                  deleteThread(threadId);
                  toast.success("Konu silindi");
                  void navigate({ to: "/" });
                }}
              >
                <Trash2 className="size-3.5" />
                Konuyu sil
              </Button>
            )}
          </div>
        )}
      </header>

      <div className="space-y-3">
        {threadPosts.map((post, idx) => {
          const author = getUser(post.authorId);
          const name = displayName(post.authorId, names);
          return (
            <article
              key={post.id}
              id={`p-${post.id}`}
              className="overflow-hidden rounded-lg border border-border bg-surface shadow-card"
            >
              <div className="grid sm:grid-cols-[160px_minmax(0,1fr)]">
                <aside className="border-b border-border bg-bg-elevated px-3 py-3 sm:border-r sm:border-b-0">
                  <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-2">
                    <Avatar name={name} size="lg" />
                    <div className="min-w-0">
                      <UserName name={name} size="md" />
                      {author?.title && (
                        <div className="text-[11px] text-primary">
                          {author.title}
                        </div>
                      )}
                      <div className="mt-1 text-[11px] text-subtle">
                        {author ? `${author.posts} mesaj` : "Yerel üye"}
                      </div>
                    </div>
                  </div>
                </aside>
                <div className="min-w-0 px-4 py-3">
                  <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-subtle">
                    <span>
                      #{idx + 1} · {formatRelative(post.createdAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      {user && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-primary hover:bg-primary-soft"
                          onClick={() => {
                            setQuote({
                              postId: post.id,
                              authorName: name,
                              snippet: post.body.slice(0, 280),
                            });
                            document
                              .getElementById("reply-box")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          <Quote className="size-3" />
                          Alıntıla
                        </button>
                      )}
                      <ReportButton
                        targetType="post"
                        targetId={post.id}
                        compact
                      />
                      {founder && !post.id.startsWith("official_") && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-danger hover:bg-danger/10"
                          onClick={() => {
                            if (!confirm("Bu mesaj silinsin mi?")) return;
                            deletePost(post.id);
                            toast.success("Mesaj silindi");
                          }}
                        >
                          <Trash2 className="size-3" />
                          Sil
                        </button>
                      )}
                    </div>
                  </div>
                  {post.quoteSnippet && (
                    <blockquote className="mb-3 rounded-md border-l-4 border-primary/40 bg-bg-elevated px-3 py-2 text-xs text-muted">
                      <p className="mb-0.5 font-semibold text-fg">
                        {post.quoteAuthorName ?? "Üye"} yazmış:
                      </p>
                      <p className="line-clamp-4 whitespace-pre-wrap">
                        {post.quoteSnippet}
                      </p>
                    </blockquote>
                  )}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-fg">
                    {renderBody(post.body)}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {thread.locked && !founder ? (
        <p className="mt-5 rounded-lg border border-border bg-surface px-4 py-6 text-center text-sm text-muted shadow-card">
          Bu konu kilitli; yeni cevap yazılamaz.
        </p>
      ) : thread.status === "pending" && !founder ? (
        <p className="mt-5 rounded-lg border border-border bg-surface px-4 py-6 text-center text-sm text-muted shadow-card">
          İncelemedeki konulara henüz cevap yazılamaz.
        </p>
      ) : !user ? (
        <p className="mt-5 rounded-lg border border-border bg-surface px-4 py-6 text-center text-sm text-muted shadow-card">
          Giriş yaparak cevap yazabilirsiniz.{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Giriş / Kayıt
          </Link>
        </p>
      ) : (
        <form
          id="reply-box"
          onSubmit={submit}
          className="relative mt-5 rounded-lg border border-border bg-surface p-4 shadow-card"
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
          <h2 className="mb-2 text-sm font-semibold text-fg">Cevap yaz</h2>
          {quote && (
            <div className="mb-3 rounded-md border border-primary/20 bg-primary-soft/50 px-3 py-2 text-xs">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-semibold text-primary">
                  Alıntı: {quote.authorName}
                </span>
                <button
                  type="button"
                  className="text-subtle hover:text-fg"
                  onClick={() => setQuote(null)}
                >
                  Kaldır
                </button>
              </div>
              <p className="line-clamp-3 text-muted whitespace-pre-wrap">
                {quote.snippet}
              </p>
            </div>
          )}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onFocus={markFormStart}
            rows={5}
            placeholder="Mesajınızı yazın… (küfür / +18 / yasadışı içerik engellenir)"
            className="w-full resize-y rounded-md border border-border bg-bg-elevated px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
          />
          <div className="mt-3 flex justify-end">
            <Button type="submit">
              <Send className="size-3.5" />
              Gönder
            </Button>
          </div>
        </form>
      )}
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
