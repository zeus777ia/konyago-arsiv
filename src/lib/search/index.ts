import type { Thread, Post } from "@/lib/forum/data";
import type { MarketplaceListing } from "@/lib/marketplace/data";
import type { JobListing } from "@/lib/jobs/data";

export type SearchHit =
  | {
      kind: "thread";
      id: string;
      title: string;
      snippet: string;
      href: string;
      score: number;
      at: string;
    }
  | {
      kind: "listing";
      id: string;
      title: string;
      snippet: string;
      href: string;
      score: number;
      at: string;
    }
  | {
      kind: "job";
      id: string;
      title: string;
      snippet: string;
      href: string;
      score: number;
      at: string;
    };

function scoreText(q: string, ...parts: string[]): number {
  const hay = parts.join(" ").toLocaleLowerCase("tr");
  const terms = q
    .toLocaleLowerCase("tr")
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  if (!terms.length) return 0;
  let s = 0;
  for (const t of terms) {
    if (hay.includes(t)) s += 2;
    if (parts[0]?.toLocaleLowerCase("tr").includes(t)) s += 3;
  }
  return s;
}

export function unifiedSearch(input: {
  q: string;
  threads: Thread[];
  posts: Post[];
  names: Record<string, string>;
  listings: MarketplaceListing[];
  jobs: JobListing[];
}): SearchHit[] {
  const q = input.q.trim();
  if (q.length < 2) return [];

  const hits: SearchHit[] = [];

  for (const t of input.threads) {
    if (t.status && t.status !== "approved") continue;
    const first = input.posts.find((p) => p.threadId === t.id);
    const tags = (t.tags ?? []).join(" ");
    const sc = scoreText(
      q,
      t.title,
      first?.body ?? "",
      tags,
      input.names[t.authorId] ?? "",
    );
    if (sc <= 0) continue;
    hits.push({
      kind: "thread",
      id: t.id,
      title: t.title,
      snippet: (first?.body ?? "").slice(0, 140),
      href: `/konu/${t.id}`,
      score: sc + (t.hot ? 1 : 0) + (t.pinned ? 1 : 0),
      at: t.lastPostAt,
    });
  }

  for (const l of input.listings) {
    if (l.status === "satildi" || l.status === "kaldirildi") continue;
    const sc = scoreText(q, l.title, l.description, l.district, l.category);
    if (sc <= 0) continue;
    hits.push({
      kind: "listing",
      id: l.id,
      title: l.title,
      snippet: l.description.slice(0, 140),
      href: `/ikinci-el/${l.id}`,
      score: sc,
      at: l.createdAt,
    });
  }

  for (const j of input.jobs) {
    if (j.status === "kapandi") continue;
    const sc = scoreText(
      q,
      j.title,
      j.description,
      j.district,
      j.companyOrPerson,
    );
    if (sc <= 0) continue;
    hits.push({
      kind: "job",
      id: j.id,
      title: j.title,
      snippet: j.description.slice(0, 140),
      href: `/is-ilani/${j.id}`,
      score: sc,
      at: j.createdAt,
    });
  }

  return hits.sort(
    (a, b) => b.score - a.score || +new Date(b.at) - +new Date(a.at),
  );
}
