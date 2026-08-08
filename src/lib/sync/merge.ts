import type { CloudSnapshot } from "./types";

function byId<T extends { id: string }>(items: T[]): Map<string, T> {
  const m = new Map<string, T>();
  for (const it of items) m.set(it.id, it);
  return m;
}

function newerIso(a?: string, b?: string): boolean {
  if (!a) return false;
  if (!b) return true;
  return +new Date(a) >= +new Date(b);
}

/** Last-write-wins merge by id + timestamps. Official_* threads prefer non-empty body from either side. */
export function mergeSnapshots(
  local: CloudSnapshot,
  remote: CloudSnapshot,
): CloudSnapshot {
  const threads = byId([...(remote.forum.threads ?? []), ...(local.forum.threads ?? [])]);
  // Prefer higher views/replies and later lastPostAt
  for (const t of local.forum.threads ?? []) {
    const r = threads.get(t.id);
    if (!r) {
      threads.set(t.id, t);
      continue;
    }
    const pickLocal =
      newerIso(t.lastPostAt, r.lastPostAt) ||
      (t.lastPostAt === r.lastPostAt && (t.views ?? 0) >= (r.views ?? 0));
    if (pickLocal) {
      threads.set(t.id, {
        ...r,
        ...t,
        views: Math.max(r.views ?? 0, t.views ?? 0),
        replies: Math.max(r.replies ?? 0, t.replies ?? 0),
        pinned: t.pinned || r.pinned,
        hot: t.hot || r.hot,
        featured: t.featured || r.featured,
        locked: t.locked || r.locked,
        tags: t.tags?.length ? t.tags : r.tags,
        status: t.status ?? r.status,
      });
    } else {
      threads.set(t.id, {
        ...t,
        ...r,
        views: Math.max(r.views ?? 0, t.views ?? 0),
        replies: Math.max(r.replies ?? 0, t.replies ?? 0),
        pinned: t.pinned || r.pinned,
        hot: t.hot || r.hot,
        featured: t.featured || r.featured,
        locked: t.locked || r.locked,
        tags: r.tags?.length ? r.tags : t.tags,
        status: r.status ?? t.status,
      });
    }
  }

  const posts = byId([...(remote.forum.posts ?? []), ...(local.forum.posts ?? [])]);
  for (const p of local.forum.posts ?? []) {
    const r = posts.get(p.id);
    if (!r || newerIso(p.createdAt, r.createdAt)) posts.set(p.id, p);
  }

  const names = { ...(remote.forum.names ?? {}), ...(local.forum.names ?? {}) };

  const members = byId([...(remote.members ?? []), ...(local.members ?? [])]);
  for (const m of local.members ?? []) {
    const r = members.get(m.id);
    if (!r) {
      members.set(m.id, m);
      continue;
    }
    // Same email different ids → keep newer updatedAt / lastLoginAt
    const localWins = newerIso(
      m.updatedAt ?? m.lastLoginAt ?? m.createdAt,
      r.updatedAt ?? r.lastLoginAt ?? r.createdAt,
    );
    members.set(m.id, localWins ? { ...r, ...m } : { ...m, ...r });
  }
  // Dedupe by email: keep newest
  const byEmail = new Map<string, (typeof local.members)[0]>();
  for (const m of members.values()) {
    const key = m.email.toLowerCase();
    const prev = byEmail.get(key);
    if (
      !prev ||
      newerIso(
        m.updatedAt ?? m.lastLoginAt ?? m.createdAt,
        prev.updatedAt ?? prev.lastLoginAt ?? prev.createdAt,
      )
    ) {
      byEmail.set(key, m);
    }
  }

  const listings = byId([
    ...(remote.marketplace?.listings ?? []),
    ...(local.marketplace?.listings ?? []),
  ]);
  for (const l of local.marketplace?.listings ?? []) {
    const r = listings.get(l.id);
    if (!r || newerIso(l.createdAt, r.createdAt)) listings.set(l.id, l);
    else if (l.status !== r.status) {
      // status change: prefer non-aktif if either sold
      if (l.status === "satildi" || l.status === "kaldirildi") listings.set(l.id, l);
    }
  }

  const jobs = byId([...(remote.jobs?.jobs ?? []), ...(local.jobs?.jobs ?? [])]);
  for (const j of local.jobs?.jobs ?? []) {
    const r = jobs.get(j.id);
    if (!r || newerIso(j.createdAt, r.createdAt)) jobs.set(j.id, j);
    else if (j.status === "kapandi") jobs.set(j.id, j);
  }

  const reports = byId([
    ...(remote.reports?.reports ?? []),
    ...(local.reports?.reports ?? []),
  ]);
  for (const rep of local.reports?.reports ?? []) {
    const r = reports.get(rep.id);
    if (!r) reports.set(rep.id, rep);
    else if (rep.status === "reviewed") reports.set(rep.id, rep);
  }

  const notifs = byId([
    ...(remote.notifications?.items ?? []),
    ...(local.notifications?.items ?? []),
  ]);
  for (const n of local.notifications?.items ?? []) {
    const r = notifs.get(n.id);
    if (!r) notifs.set(n.id, n);
    else if (n.read && !r.read) notifs.set(n.id, { ...r, read: true });
  }

  const localMetaTime = local.updatedAt;
  const remoteMetaTime = remote.updatedAt;
  const siteMeta = newerIso(localMetaTime, remoteMetaTime)
    ? local.siteMeta
    : remote.siteMeta;
  // Prefer non-empty banner from either
  const mergedMeta = {
    ...remote.siteMeta,
    ...local.siteMeta,
    bannerText:
      local.siteMeta?.bannerText || remote.siteMeta?.bannerText || "",
    featuredThreadId:
      local.siteMeta?.featuredThreadId ??
      remote.siteMeta?.featuredThreadId ??
      null,
  };

  return {
    v: 1,
    updatedAt: new Date(
      Math.max(+new Date(local.updatedAt || 0), +new Date(remote.updatedAt || 0)),
    ).toISOString(),
    forum: {
      threads: [...threads.values()],
      posts: [...posts.values()],
      names,
    },
    members: [...byEmail.values()],
    marketplace: { listings: [...listings.values()] },
    jobs: { jobs: [...jobs.values()] },
    reports: { reports: [...reports.values()] },
    notifications: { items: [...notifs.values()].slice(0, 200) },
    siteMeta: siteMeta ? mergedMeta : mergedMeta,
  };
}

export function emptySnapshot(): CloudSnapshot {
  return {
    v: 1,
    updatedAt: new Date(0).toISOString(),
    forum: { threads: [], posts: [], names: {} },
    members: [],
    marketplace: { listings: [] },
    jobs: { jobs: [] },
    reports: { reports: [] },
    notifications: { items: [] },
    siteMeta: {
      bannerText:
        "KonyaGo Arşiv’e hoş geldiniz — kuralları okuyun, güvenli paylaşın.",
      bannerHref: "/kurallar",
      bannerActive: true,
      featuredThreadId: "official_rules",
      featuredLabel: "Haftanın / öne çıkan arşiv",
    },
  };
}
