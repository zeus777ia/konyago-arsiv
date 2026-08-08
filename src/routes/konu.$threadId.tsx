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
import { useCurrentUser, useMembersHydrated } from "@/lib/auth/use-current-user";
import { isFounder } from "@/lib/staff/founder";
import { ReportButton } from "@/components/forum/report-button";
import { Loader2 } from "lucide-react";

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
  const ensureSeed = useForumStore((s) => s.ensureSeed);
  const user = useCurrentUser();
  const founder = isFounder(user);
  const membersHydrated = useMembersHydrated();
  const [forumReady, setForumReady] = useState(false);
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [quote, setQuote] = useState<QuoteDraft | null>(null);
  const formStartedAtRef = useRef<number | null>(null);
  const markFormStart = () => {
    if (formStartedAtRef.current == null) formStartedAtRef.current = Date.now();
  };

  useEffect(() => {
    ensureSeed();
    const unsub = useForumStore.persist.onFinishHydration(() => {
      ensureSeed();
      setForumReady(true);
    });
    if (useForumStore.persist.hasHydrated()) {
      ensureSeed();
      setForumReady(true);
    }
    // client-only fallback if persist API missing timing
    const t = window.setTimeout(() => {
      ensureSeed();
      setForumReady(true);
    }, 50);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, [ensureSeed]);

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
    if (threadId && thread) bumpViews(threadId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, !!thread]);

  if (!forumReady || !membersHydrated) {
    return (
      <ForumShell>
        <div className="flex min-h-[30vh] items-center justify-center gap-2 text-sm text-muted">
          <Loader2 className="size-5 animate-spin text-primary" />
          Konu yükleniyor…
        </div>
      </ForumShell>
    );
  }

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
    toast.success("Cevabınız eklendi");
    setBody("");
    setQuote(null);
    setHoneypot("");
    formStartedAtRef.current = null;
  };

  const pending = thread.status === "pending";
  const locked = !!thread.locked || pending;

  return (
    <ForumShell>
      <Toaster theme="light" position="top-center" richColors />
      <div className="mb-3 flex flex-wrap items-center gap-1 text-xs text-subtle">
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
        <span className="truncate text-muted">{thread.title}</span>
      </div>

      <header className="mb-4 rounded-xl border border-border bg-surface p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {thread.pinned && (
            <span className="inline-flex items-center gap-1 rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">
              <Pin className="size-3" />
              Sabit
            </span>
          )}
          {thread.locked && (
            <span className="inline-flex items-center gap-1 rounded bg-badge px-1.5 py-0.5 text-[10px] font-bold text-muted uppercase">
              <Lock className="size-3" />
              Kilitli
            </span>
          )}
          {pending && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
              İncelemede
            </span>
          )}
          <FreshBadges thread={thread} />
        </div>
        <h1 className="mt-2 font-display text-xl font-semibold text-fg sm:text-2xl">
          {thread.title}
        </h1>
        {pending && (
          <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
            Bu konu incelemede. Onaylanana kadar herkese açık listelerde
            görünmez.
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-subtle">
          <UserName name={displayName(thread.authorId, names)} size="sm" />
          <span>· {formatRelative(thread.createdAt)}</span>
          <span>
            · {thread.replies} cevap · {thread.views} görüntülenme
          </span>
        </div>
        <div className="mt-2">
          <TagChips tags={thread.tags} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <ReportButton targetType="thread" targetId={thread.id} />
          {founder && (
            <>
              {pending && (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      approveThread(thread.id);
                      toast.success("Konu onaylandı");
                    }}
                  >
                    <Check className="size-3.5" />
                    Onayla
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-danger"
                    onClick={() => {
                      rejectThread(thread.id);
                      toast.success("Konu reddedildi");
                      void navigate({ to: "/" });
                    }}
                  >
                    <X className="size-3.5" />
                    Reddet
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => togglePin(thread.id)}
              >
                <Pin className="size-3.5" />
                {thread.pinned ? "Sabiti kaldır" : "Sabitle"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toggleLock(thread.id)}
              >
                {thread.locked ? (
                  <Unlock className="size-3.5" />
                ) : (
                  <Lock className="size-3.5" />
                )}
                {thread.locked ? "Kilidi aç" : "Kilitle"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toggleHot(thread.id)}
              >
                <Flame className="size-3.5" />
                {thread.hot ? "Sıcaktan çıkar" : "Sıcak"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setFeaturedThread(thread.id);
                  toast.success("Öne çıkan arşive alındı");
                }}
              >
                <Sparkles className="size-3.5" />
                Öne çıkar
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="text-danger"
                onClick={() => {
                  if (!confirm("Konu silinsin mi?")) return;
                  deleteThread(thread.id);
                  toast.success("Konu silindi");
                  void navigate({ to: "/" });
                }}
              >
                <Trash2 className="size-3.5" />
                Sil
              </Button>
            </>
          )}
        </div>
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
                      {author?.posts ? (
                        <div className="mt-1 text-[11px] text-subtle">
                          {author.posts} mesaj
                        </div>
                      ) : null}
                    </div>
                  </div>
                </aside>
                <div className="min-w-0 px-4 py-3">
                  <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-subtle">
                    <span>
                      #{idx + 1} · {formatRelative(post.createdAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      {user && !locked && (
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
                      <ReportButton targetType="post" targetId={post.id} />
                      {founder && idx > 0 && (
                        <button
                          type="button"
                          className="text-danger hover:underline"
                          onClick={() => {
                            if (!confirm("Mesaj silinsin mi?")) return;
                            deletePost(post.id);
                            toast.success("Mesaj silindi");
                          }}
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-fg">
                    {post.body}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div
        id="reply-box"
        className="mt-6 rounded-xl border border-border bg-surface p-4 shadow-card"
      >
        <h2 className="mb-3 text-sm font-semibold text-fg">Cevap yaz</h2>
        {locked ? (
          <p className="text-sm text-muted">
            {pending
              ? "İncelemedeki konulara henüz cevap yazılamaz."
              : "Bu konu kilitlidir."}
          </p>
        ) : !user ? (
          <p className="text-sm text-muted">
            Cevap yazmak için{" "}
            <Link to="/login" className="text-primary hover:underline">
              giriş yapın
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden
            />
            {quote && (
              <div className="rounded-md border border-primary/20 bg-primary-soft/50 px-3 py-2 text-xs">
                <div className="mb-1 flex justify-between">
                  <span>
                    Alıntı: <strong>{quote.authorName}</strong>
                  </span>
                  <button type="button" onClick={() => setQuote(null)}>
                    Kaldır
                  </button>
                </div>
                <p className="line-clamp-3 text-muted">{quote.snippet}</p>
              </div>
            )}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onFocus={markFormStart}
              rows={5}
              placeholder="Mesajınızı yazın…"
              className="w-full resize-y rounded-md border border-border bg-bg-elevated px-3 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
            <Button type="submit" className="gap-1.5">
              <Send className="size-3.5" />
              Gönder
            </Button>
          </form>
        )}
      </div>
    </ForumShell>
  );
}
