import { create } from "zustand";
import { persist } from "zustand/middleware";
import { POSTS, THREADS, type Post, type Thread } from "./data";

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
};

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export const useForumStore = create<ForumState>()(
  persist(
    (set, get) => ({
      threads: THREADS,
      posts: POSTS,
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
    }),
    { name: "konyago-arsiv-forum-v1" },
  ),
);

export function resolveName(
  userId: string,
  names: Record<string, string>,
  fallback: string,
) {
  return names[userId] ?? fallback;
}
