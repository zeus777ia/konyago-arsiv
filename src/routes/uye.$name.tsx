import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, MapPin, MessageSquare, ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import { ForumShell } from "@/components/forum/layout";
import { Avatar } from "@/components/forum/avatar";
import { UserName } from "@/components/forum/user-name";
import { useForumStore } from "@/lib/forum/store";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useJobsStore } from "@/lib/jobs/store";
import {
  DEFAULT_PREFS,
  DEFAULT_PROFILE,
  useMembersStore,
} from "@/lib/members/store";
import { isFounderName } from "@/lib/staff/founder";
import { useMembersHydrated } from "@/lib/auth/use-current-user";
import { formatRelative } from "@/lib/utils";
import { RankBadge, FrameBadge } from "@/components/forum/member-badges";
import { publicMemberEmail } from "@/lib/members/privacy";
import {
  formatActiveDuration,
  getFrame,
  getRank,
  normalizeActivity,
} from "@/lib/members/ranks";

import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/uye/$name")({
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { name: raw } = Route.useParams();
  const name = decodeURIComponent(raw);
  const hydrated = useMembersHydrated();
  const names = useForumStore((s) => s.names);
  const threads = useForumStore((s) => s.threads);
  const posts = useForumStore((s) => s.posts);
  const listings = useMarketplaceStore((s) => s.listings);
  const jobs = useJobsStore((s) => s.jobs);
  const members = useMembersStore((s) => s.members);

  const knownFromForum = Object.values(names).includes(name);
  const member = members.find((m) => m.displayName === name);
  const exists = knownFromForum || !!member || isFounderName(name);

  const profile = {
    ...DEFAULT_PROFILE,
    ...(member?.profile ?? {}),
  };
  const prefs = { ...DEFAULT_PREFS, ...(member?.prefs ?? {}) };

  const stats = useMemo(() => {
    const myThreads = threads.filter(
      (t) =>
        names[t.authorId] === name &&
        (!t.status || t.status === "approved"),
    );
    const myPosts = posts.filter((p) => names[p.authorId] === name);
    const myListings = listings.filter(
      (l) => l.authorName === name && l.status === "aktif",
    );
    const myJobs = jobs.filter(
      (j) => j.authorName === name && j.status === "aktif",
    );
    return {
      myThreads: myThreads
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 12),
      threadCount: myThreads.length,
      postCount: myPosts.length,
      listingCount: myListings.length,
      jobCount: myJobs.length,
    };
  }, [threads, posts, listings, jobs, names, name]);

  if (!hydrated) {
    return (
      <ForumShell>
        <div className="flex min-h-[30vh] items-center justify-center gap-2 text-sm text-muted">
          <Loader2 className="size-5 animate-spin text-primary" />
          Profil yükleniyor…
        </div>
      </ForumShell>
    );
  }

  if (!exists) {
    return (
      <ForumShell>
        <div className="mx-auto max-w-md rounded-xl border border-border bg-surface px-5 py-10 text-center shadow-card">
          <p className="text-sm font-semibold text-fg">Üye bulunamadı</p>
          <p className="mt-1 text-xs text-muted">
            “{name}” adına kayıtlı görünür bir profil yok.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </ForumShell>
    );
  }

  return (
    <ForumShell>
      <div className="mx-auto max-w-2xl space-y-4">
        <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <div className="flex flex-wrap items-start gap-4">
            <Avatar name={name} size="xl" imageUrl={member?.avatarUrl} />
            <div className="min-w-0 flex-1">
              <UserName name={name} size="lg" link={false} />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <RankBadge activity={member?.activity} />
                <FrameBadge activity={member?.activity} />
              </div>
              {member?.activity && (
                <p className="mt-1.5 text-[11px] text-subtle">
                  Aktif süre:{" "}
                  {formatActiveDuration(
                    normalizeActivity(member.activity).totalMinutes,
                  )}
                  {" · "}
                  {getRank(normalizeActivity(member.activity).totalMinutes).label}
                  {getFrame(normalizeActivity(member.activity)).id !== "none"
                    ? ` · ${getFrame(normalizeActivity(member.activity)).label}`
                    : ""}
                </p>
              )}
              {profile.bio && (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {profile.bio}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-subtle">
                {(profile.city || profile.district) && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" />
                    {[profile.district, profile.city].filter(Boolean).join(", ")}
                  </span>
                )}
                {member && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3" />
                    Üyelik: {formatRelative(member.createdAt)}
                  </span>
                )}
              </div>
              {publicMemberEmail(member) && (
                <p className="mt-2 text-xs text-muted">
                  {publicMemberEmail(member)}
                </p>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-primary hover:underline"
                >
                  {profile.website}
                </a>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat
              icon={<MessageSquare className="size-3" />}
              label="Konu"
              value={stats.threadCount}
            />
            <Stat label="Mesaj" value={stats.postCount} />
            <Stat
              icon={<ShoppingBag className="size-3" />}
              label="İlan"
              value={stats.listingCount}
            />
            <Stat label="İş" value={stats.jobCount} />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface shadow-card">
          <header className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Son konular</h2>
          </header>
          <div className="p-4">
            {stats.myThreads.length === 0 ? (
              <p className="text-sm text-muted">Yayında konu yok.</p>
            ) : (
              <ul className="divide-y divide-border">
                {stats.myThreads.map((t) => (
                  <li key={t.id} className="py-2 first:pt-0 last:pb-0">
                    <Link
                      to="/konu/$threadId"
                      params={{ threadId: t.id }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t.title}
                    </Link>
                    <p className="text-[11px] text-subtle">
                      {formatRelative(t.createdAt)} · {t.replies} cevap
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </ForumShell>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated px-3 py-2">
      <div className="flex items-center gap-1 text-[11px] text-subtle">
        {icon}
        {label}
      </div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
