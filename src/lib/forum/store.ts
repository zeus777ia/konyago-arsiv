import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Post, Thread } from "./data";

type ForumState = {
  threads: Thread[];
  posts: Post[];
  names: Record<string, string>;
  addThread: (input: {
    categoryId: string;
    title: string;
    body: string;
    authorName: string;
  }) => string;
  addReply: (input: {
    threadId: string;
    body: string;
    authorName: string;
  }) => void;
  bumpViews: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  deletePost: (postId: string) => void;
  togglePin: (threadId: string) => void;
  toggleLock: (threadId: string) => void;
  toggleHot: (threadId: string) => void;
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
      addThread: ({ categoryId, title, body, authorName }) => {
        const threadId = id("t");
        const authorId = id("u");
        const now = new Date().toISOString();
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
        return threadId;
      },
      addReply: ({ threadId, body, authorName }) => {
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
      },
      bumpViews: (threadId) => {
        set({
          threads: get().threads.map((t) =>
            t.id === threadId ? { ...t, views: t.views + 1 } : t,
          ),
        });
      },
      deleteThread: (threadId) => {
        set({
          threads: get().threads.filter((t) => t.id !== threadId),
          posts: get().posts.filter((p) => p.threadId !== threadId),
        });
      },
      deletePost: (postId) => {
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
    }),
    { name: "konyago-arsiv-forum-v2" },
  ),
);

export function resolveName(
  userId: string,
  names: Record<string, string>,
  fallback: string,
) {
  return names[userId] ?? fallback;
}
