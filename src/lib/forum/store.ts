import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Post, Thread, ThreadStatus } from "./data";
import { ensureOfficialContent } from "./official-seed";
import { canPostInCategory, moderateContent } from "./moderation";
import { recordSpamEvent, runAllSpamChecks } from "./spam";
import { normalizeTags } from "./tags";
import { notifyUser } from "@/lib/notifications/store";
import { sendAppEmail } from "@/lib/email/send";
import { useMembersStore } from "@/lib/members/store";
import { useSiteMetaStore } from "@/lib/site/announcements";

export type AddThreadResult =
  | { ok: true; threadId: string; status: ThreadStatus }
  | { ok: false; error: string };

export type AddReplyResult = { ok: true } | { ok: false; error: string };

type ForumState = {
  threads: Thread[];
  posts: Post[];
  names: Record<string, string>;
  seededOfficial: boolean;
  ensureSeed: () => void;
  addThread: (input: {
    categoryId: string;
    title: string;
    body: string;
    authorName: string;
    tags?: string[];
    asFounder?: boolean;
    honeypot?: string;
    formStartedAt?: number;
  }) => AddThreadResult;
  addReply: (input: {
    threadId: string;
    body: string;
    authorName: string;
    asFounder?: boolean;
    honeypot?: string;
    formStartedAt?: number;
    quote?: {
      postId: string;
      authorName: string;
      snippet: string;
    };
  }) => AddReplyResult;
  bumpViews: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  deletePost: (postId: string) => void;
  togglePin: (threadId: string) => void;
  toggleLock: (threadId: string) => void;
  toggleHot: (threadId: string) => void;
  setFeaturedThread: (threadId: string | null) => void;
  approveThread: (threadId: string) => void;
  rejectThread: (threadId: string, reason?: string) => void;
};

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function emailForDisplayName(name: string): string | null {
  const m = useMembersStore
    .getState()
    .members.find((x) => x.displayName === name);
  return m?.email ?? null;
}

function prefersModMail(name: string): boolean {
  const m = useMembersStore
    .getState()
    .members.find((x) => x.displayName === name);
  if (!m) return false;
  return m.prefs?.notifyModeration !== false;
}

export const useForumStore = create<ForumState>()(
  persist(
    (set, get) => ({
      threads: [],
      posts: [],
      names: {},
      seededOfficial: false,
      ensureSeed: () => {
        const state = get();
        const next = ensureOfficialContent(
          state.threads,
          state.posts,
          state.names,
        );
        set({
          threads: next.threads,
          posts: next.posts,
          names: next.names,
          seededOfficial: true,
        });
      },
      addThread: ({
        categoryId,
        title,
        body,
        authorName,
        tags,
        asFounder,
        honeypot,
        formStartedAt,
      }) => {
        const catOk = canPostInCategory(categoryId, !!asFounder);
        if (!catOk.ok) return { ok: false, error: catOk.reason };

        if (!asFounder) {
          const spam = runAllSpamChecks({
            kind: "thread",
            title,
            body,
            honeypot,
            formStartedAt,
          });
          if (!spam.ok) return { ok: false, error: spam.reason };
        }

        const mod = moderateContent(title, body);
        if (!mod.ok) {
          return { ok: false, error: mod.reason };
        }

        const threadId = id("t");
        const authorId = id("u");
        const now = new Date().toISOString();
        const status: ThreadStatus = asFounder ? "approved" : "pending";
        const thread: Thread = {
          id: threadId,
          categoryId,
          title: title.trim(),
          authorId,
          createdAt: now,
          lastPostAt: now,
          lastPosterId: authorId,
          replies: 0,
          views: 1,
          status,
          locked: false,
          pinned: false,
          tags: normalizeTags(tags),
        };
        const post: Post = {
          id: id("p"),
          threadId,
          authorId,
          createdAt: now,
          body: body.trim(),
        };
        set({
          threads: [thread, ...get().threads],
          posts: [...get().posts, post],
          names: { ...get().names, [authorId]: authorName },
        });
        if (!asFounder) {
          recordSpamEvent("thread", `${title}\n${body}`);
          notifyUser(authorName, {
            kind: "system",
            title: "Konunuz incelemeye alındı",
            body: `"${title.trim().slice(0, 60)}" moderasyon kuyruğunda.`,
            href: `/konu/${threadId}`,
          });
        }
        return { ok: true, threadId, status };
      },
      addReply: ({
        threadId,
        body,
        authorName,
        asFounder,
        honeypot,
        formStartedAt,
        quote,
      }) => {
        const thread = get().threads.find((t) => t.id === threadId);
        if (!thread) return { ok: false, error: "Konu bulunamadı" };
        if (thread.locked && !asFounder) {
          return { ok: false, error: "Bu konu kilitli" };
        }
        if (thread.status === "pending" && !asFounder) {
          return {
            ok: false,
            error: "İncelemedeki konulara henüz cevap yazılamaz",
          };
        }
        if (thread.status === "rejected") {
          return { ok: false, error: "Reddedilmiş konuya cevap yazılamaz" };
        }

        if (!asFounder) {
          const spam = runAllSpamChecks({
            kind: "reply",
            body,
            honeypot,
            formStartedAt,
          });
          if (!spam.ok) return { ok: false, error: spam.reason };
        }

        const mod = moderateContent("", body);
        if (!mod.ok) return { ok: false, error: mod.reason };

        const authorId = id("u");
        const now = new Date().toISOString();
        const post: Post = {
          id: id("p"),
          threadId,
          authorId,
          createdAt: now,
          body: body.trim(),
          quotePostId: quote?.postId,
          quoteAuthorName: quote?.authorName,
          quoteSnippet: quote?.snippet?.slice(0, 280),
        };
        set({
          posts: [...get().posts, post],
          names: { ...get().names, [authorId]: authorName },
          threads: get().threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  replies: t.replies + 1,
                  lastPostAt: now,
                  lastPosterId: authorId,
                }
              : t,
          ),
        });
        if (!asFounder) recordSpamEvent("reply", body);

        const ownerName = get().names[thread.authorId];
        if (ownerName && ownerName !== authorName) {
          notifyUser(ownerName, {
            kind: "reply",
            title: "Konunuza yeni cevap",
            body: `${authorName}: ${body.trim().slice(0, 80)}`,
            href: `/konu/${threadId}`,
          });
          if (prefersModMail(ownerName)) {
            const em = emailForDisplayName(ownerName);
            if (em) {
              void sendAppEmail({
                to: em,
                subject: `[KonyaGo Arşiv] Konunuza yeni cevap: ${thread.title.slice(0, 40)}`,
                text: `Merhaba ${ownerName},\n\n"${thread.title}" konusuna ${authorName} cevap yazdı.\n\n${body.trim().slice(0, 200)}\n\nGörüntüle: https://konyagoarsiv.org/konu/${threadId}\n\n— KonyaGo Arşiv (info@konyago.com.tr)`,
              }).catch(() => undefined);
            }
          }
        }
        return { ok: true };
      },
      bumpViews: (threadId) => {
        set({
          threads: get().threads.map((t) =>
            t.id === threadId ? { ...t, views: t.views + 1 } : t,
          ),
        });
      },
      deleteThread: (threadId) => {
        if (threadId.startsWith("official_")) return;
        set({
          threads: get().threads.filter((t) => t.id !== threadId),
          posts: get().posts.filter((p) => p.threadId !== threadId),
        });
      },
      deletePost: (postId) => {
        if (postId.startsWith("official_")) return;
        const post = get().posts.find((p) => p.id === postId);
        if (!post) return;
        const remaining = get().posts.filter((p) => p.id !== postId);
        const threadPosts = remaining
          .filter((p) => p.threadId === post.threadId)
          .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
        set({
          posts: remaining,
          threads: get().threads.map((t) => {
            if (t.id !== post.threadId) return t;
            const last = threadPosts[threadPosts.length - 1];
            return {
              ...t,
              replies: Math.max(0, threadPosts.length - 1),
              lastPostAt: last?.createdAt ?? t.createdAt,
              lastPosterId: last?.authorId ?? t.authorId,
            };
          }),
        });
      },
      togglePin: (threadId) => {
        set({
          threads: get().threads.map((t) =>
            t.id === threadId ? { ...t, pinned: !t.pinned } : t,
          ),
        });
      },
      toggleLock: (threadId) => {
        set({
          threads: get().threads.map((t) =>
            t.id === threadId ? { ...t, locked: !t.locked } : t,
          ),
        });
      },
      toggleHot: (threadId) => {
        set({
          threads: get().threads.map((t) =>
            t.id === threadId ? { ...t, hot: !t.hot } : t,
          ),
        });
      },
      setFeaturedThread: (threadId) => {
        if (!threadId) {
          set({
            threads: get().threads.map((t) =>
              t.featured ? { ...t, featured: false } : t,
            ),
          });
          useSiteMetaStore.getState().setFeatured(null);
          return;
        }
        const target = get().threads.find((t) => t.id === threadId);
        if (!target) return;
        const was = !!target.featured;
        set({
          threads: get().threads.map((t) => ({
            ...t,
            featured: t.id === threadId ? !was : false,
          })),
        });
        if (!was) {
          useSiteMetaStore.getState().setFeatured(threadId);
          const name = get().names[target.authorId];
          if (name) {
            notifyUser(name, {
              kind: "featured",
              title: "Konunuz öne çıkarıldı",
              body: `"${target.title.slice(0, 60)}" arşivde öne çıktı.`,
              href: `/konu/${threadId}`,
            });
          }
        } else {
          useSiteMetaStore.getState().setFeatured(null);
        }
      },
      approveThread: (threadId) => {
        const t = get().threads.find((x) => x.id === threadId);
        set({
          threads: get().threads.map((x) =>
            x.id === threadId
              ? { ...x, status: "approved", rejectReason: undefined }
              : x,
          ),
        });
        if (t) {
          const name = get().names[t.authorId];
          if (name) {
            notifyUser(name, {
              kind: "moderation_approved",
              title: "Konunuz onaylandı",
              body: `"${t.title.slice(0, 60)}" yayında.`,
              href: `/konu/${threadId}`,
            });
            if (prefersModMail(name)) {
              const em = emailForDisplayName(name);
              if (em) {
                void sendAppEmail({
                  to: em,
                  subject: `[KonyaGo Arşiv] Konunuz onaylandı: ${t.title.slice(0, 40)}`,
                  text: `Merhaba ${name},\n\n"${t.title}" konunuz moderasyon tarafından onaylandı ve yayında.\n\nhttps://konyagoarsiv.org/konu/${threadId}\n\n— KonyaGo Arşiv (info@konyago.com.tr)`,
                }).catch(() => undefined);
              }
            }
          }
        }
      },
      rejectThread: (threadId, reason) => {
        const t = get().threads.find((x) => x.id === threadId);
        const why = reason ?? "Kurallara aykırı";
        set({
          threads: get().threads.map((x) =>
            x.id === threadId
              ? {
                  ...x,
                  status: "rejected",
                  rejectReason: why,
                  locked: true,
                }
              : x,
          ),
        });
        if (t) {
          const name = get().names[t.authorId];
          if (name) {
            notifyUser(name, {
              kind: "moderation_rejected",
              title: "Konunuz reddedildi",
              body: `"${t.title.slice(0, 50)}" — ${why}`,
              href: `/konu/${threadId}`,
            });
            if (prefersModMail(name)) {
              const em = emailForDisplayName(name);
              if (em) {
                void sendAppEmail({
                  to: em,
                  subject: `[KonyaGo Arşiv] Konu reddedildi: ${t.title.slice(0, 40)}`,
                  text: `Merhaba ${name},\n\n"${t.title}" konunuz reddedildi.\nGerekçe: ${why}\n\nKurallar: https://konyagoarsiv.org/kurallar\n\n— KonyaGo Arşiv (info@konyago.com.tr)`,
                }).catch(() => undefined);
              }
            }
          }
        }
      },
    }),
    {
      name: "konyago-arsiv-forum-v3",
      onRehydrateStorage: () => (state) => {
        state?.ensureSeed();
      },
    },
  ),
);

export function resolveName(
  userId: string,
  names: Record<string, string>,
  fallback: string,
) {
  return names[userId] ?? fallback;
}

export function filterVisibleThreads(
  threads: Thread[],
  opts: {
    isFounder?: boolean;
    authorName?: string | null;
    names?: Record<string, string>;
    includePendingOwn?: boolean;
  } = {},
): Thread[] {
  return threads.filter((t) => {
    if (!t.status || t.status === "approved") return true;
    if (t.status === "rejected") {
      return !!opts.isFounder;
    }
    if (opts.isFounder) return true;
    if (opts.includePendingOwn && opts.authorName && opts.names) {
      const name = opts.names[t.authorId];
      return name === opts.authorName;
    }
    return false;
  });
}
