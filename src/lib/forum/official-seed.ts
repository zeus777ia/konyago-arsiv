import type { Post, Thread } from "./data";
import { buildAnnouncementBody, buildRulesBody } from "./rules-content";

export const FOUNDER_AUTHOR_ID = "u_kurucu";
export const FOUNDER_AUTHOR_NAME = "KonyaGoArşiv";

const NOW = "2026-08-09T00:00:00.000Z";

export const OFFICIAL_THREADS: Thread[] = [
  {
    id: "official_announcement",
    categoryId: "duyurular",
    title: "Duyuru: Site açılışı ve işleyiş",
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
    title: "Forum Kuralları (zorunlu okuyun)",
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
  const ids = new Set(threads.map((t) => t.id));
  const pids = new Set(posts.map((p) => p.id));
  const nextThreads = [...threads];
  const nextPosts = [...posts];
  for (const t of OFFICIAL_THREADS) {
    if (!ids.has(t.id)) nextThreads.unshift(t);
    else {
      // resmi konuları güncel tut (kilit/pin)
      const i = nextThreads.findIndex((x) => x.id === t.id);
      if (i >= 0) {
        nextThreads[i] = {
          ...nextThreads[i]!,
          pinned: true,
          locked: true,
          status: "approved",
          title: t.title,
        };
      }
    }
  }
  for (const p of OFFICIAL_POSTS) {
    if (!pids.has(p.id)) nextPosts.push(p);
    else {
      const i = nextPosts.findIndex((x) => x.id === p.id);
      if (i >= 0) nextPosts[i] = { ...nextPosts[i]!, body: p.body };
    }
  }
  return {
    threads: nextThreads,
    posts: nextPosts,
    names: { ...names, ...OFFICIAL_NAMES },
  };
}
