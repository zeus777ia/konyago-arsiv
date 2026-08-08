import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Post, Thread, ThreadStatus } from "./data";
import { ensureOfficialContent } from "./official-seed";
import { canPostInCategory, moderateContent } from "./moderation";

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
    asFounder?: boolean;
  }) => AddThreadResult;
  addReply: (input: {
    threadId: string;
    body: string;
    authorName: string;
    asFounder?: boolean;
  }) => AddReplyResult;
  bumpViews: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  deletePost: (postId: string) => void;
  togglePin: (threadId: string) => void;
  toggleLock: (threadId: string) => void;
  toggleHot: (threadId: string) => void;
  approveThread: (threadId: string) => void;
  rejectThread: (threadId: string, reason?: string) => void;
};

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
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
        if (
          state.seededOfficial &&
          state.threads.some((t) => t.id === "official_rules")
        ) {
          return;
        }
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
      addThread: ({ categoryId, title, body, authorName, asFounder }) => {
        const catOk = canPostInCategory(categoryId, !!asFounder);
        if (!catOk.ok) return { ok: false, error: catOk.reason };

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
        return { ok: true, threadId, status };
      },
      addReply: ({ threadId, body, authorName, asFounder }) => {
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
      approveThread: (threadId) => {
        set({
          threads: get().threads.map((t) =>
            t.id === threadId
              ? { ...t, status: "approved", rejectReason: undefined }
              : t,
          ),
        });
      },
      rejectThread: (threadId, reason) => {
        set({
          threads: get().threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  status: "rejected",
                  rejectReason: reason ?? "Kurallara aykırı",
                  locked: true,
                }
              : t,
          ),
        });
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
