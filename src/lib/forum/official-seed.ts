import type { Post, Thread } from "./data";
import { buildAnnouncementBody, buildRulesBody } from "./rules-content";

export const FOUNDER_AUTHOR_ID = "u_kurucu";
export const FOUNDER_AUTHOR_NAME = "KonyaGoArşiv";

const NOW = "2026-08-09T00:00:00.000Z";

export const OFFICIAL_THREADS: Thread[] = [
  {
    id: "official_announcement",
    categoryId: "duyurular",
    title: "Resmî duyuru: Platform açılışı ve işleyiş",
    authorId: FOUNDER_AUTHOR_ID,
    createdAt: NOW,
    lastPostAt: NOW,
    lastPosterId: FOUNDER_AUTHOR_ID,
    replies: 0,
    views: 1,
    pinned: true,
    locked: true,
    status: "approved",
  },
  {
    id: "official_rules",
    categoryId: "duyurular",
    title: "Platform Kullanım Kuralları (yürürlükteki metin)",
    authorId: FOUNDER_AUTHOR_ID,
    createdAt: NOW,
    lastPostAt: NOW,
    lastPosterId: FOUNDER_AUTHOR_ID,
    replies: 0,
    views: 1,
    pinned: true,
    locked: true,
    status: "approved",
  },
];

export const OFFICIAL_POSTS: Post[] = [
  {
    id: "official_announcement_p1",
    threadId: "official_announcement",
    authorId: FOUNDER_AUTHOR_ID,
    createdAt: NOW,
    body: buildAnnouncementBody(),
  },
  {
    id: "official_rules_p1",
    threadId: "official_rules",
    authorId: FOUNDER_AUTHOR_ID,
    createdAt: NOW,
    body: buildRulesBody(),
  },
];

export const OFFICIAL_NAMES: Record<string, string> = {
  [FOUNDER_AUTHOR_ID]: FOUNDER_AUTHOR_NAME,
};

export function ensureOfficialContent(
  threads: Thread[],
  posts: Post[],
  names: Record<string, string>,
): { threads: Thread[]; posts: Post[]; names: Record<string, string> } {
  const byId = new Map(threads.map((t) => [t.id, t]));
  for (const t of OFFICIAL_THREADS) {
    const prev = byId.get(t.id);
    byId.set(t.id, {
      ...(prev ?? t),
      ...t,
      views: prev?.views ?? t.views,
      pinned: true,
      locked: true,
      status: "approved",
    });
  }
  // official first, then others
  const officialIds = new Set(OFFICIAL_THREADS.map((t) => t.id));
  const rest = threads.filter((t) => !officialIds.has(t.id));
  const nextThreads = [
    ...OFFICIAL_THREADS.map((t) => byId.get(t.id)!),
    ...rest,
  ];

  const postById = new Map(posts.map((p) => [p.id, p]));
  for (const p of OFFICIAL_POSTS) {
    postById.set(p.id, { ...p }); // always refresh body
  }
  const nextPosts = [
    ...OFFICIAL_POSTS,
    ...posts.filter((p) => !OFFICIAL_POSTS.some((o) => o.id === p.id)),
  ];

  return {
    threads: nextThreads,
    posts: nextPosts,
    names: { ...names, ...OFFICIAL_NAMES },
  };
}
