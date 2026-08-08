import { Link } from "@tanstack/react-router";
import { Briefcase, Flame, ShoppingBag, Users } from "lucide-react";
import { getCategory } from "@/lib/forum/data";
import { displayName } from "@/lib/forum/names";
import { useForumStore } from "@/lib/forum/store";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useJobsStore } from "@/lib/jobs/store";
import { useMembersStore } from "@/lib/members/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { formatCount, formatRelative } from "@/lib/utils";
import { UserName } from "@/components/forum/user-name";
import { isFounder } from "@/lib/staff/founder";

export function ForumSidebar() {
  const threads = useForumStore((s) => s.threads);
  const posts = useForumStore((s) => s.posts);
  const names = useForumStore((s) => s.names);
  const members = useMembersStore((s) => s.members);
  const currentUser = useCurrentUser();
  const marketN = useMarketplaceStore(
    (s) => s.listings.filter((l) => l.status === "aktif").length,
  );
  const jobN = useJobsStore(
    (s) => s.jobs.filter((j) => j.status === "aktif").length,
  );

  const hot = [...threads]
    .filter((t) => t.hot || t.replies >= 3)
    .sort((a, b) => b.replies - a.replies)
    .slice(0, 5);

  const latest = [...threads]
    .sort((a, b) => +new Date(b.lastPostAt) - +new Date(a.lastPostAt))
    .slice(0, 6);

  const newestMember =
    [...members].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    )[0]?.displayName ?? "—";

  const onlineMembers = currentUser ? 1 : 0;

  return (
    <aside className="space-y-4">
      <Widget title="Hızlı panolar">
        <div className="space-y-2">
          <Link
            to="/ikinci-el"
            className="flex items-center gap-2 rounded-md bg-bg-elevated px-2.5 py-2 text-sm font-medium text-fg hover:bg-surface-hover"
          >
            <ShoppingBag className="size-4 text-accent" />
            İkinci el
            <span className="ml-auto text-[11px] text-subtle">{marketN}</span>
          </Link>
          <Link
            to="/is-ilani"
            className="flex items-center gap-2 rounded-md bg-bg-elevated px-2.5 py-2 text-sm font-medium text-fg hover:bg-surface-hover"
          >
            <Briefcase className="size-4 text-primary" />
            İş panosu
            <span className="ml-auto text-[11px] text-subtle">{jobN}</span>
          </Link>
        </div>
      </Widget>

      <Widget title="Sıcak konular" icon={<Flame className="size-3.5 text-accent" />}>
        {hot.length ? (
          <ul className="divide-y divide-border">
            {hot.map((t) => {
              const cat = getCategory(t.categoryId);
              return (
                <li key={t.id} className="py-2.5 first:pt-0 last:pb-0">
                  <Link
                    to="/konu/$threadId"
                    params={{ threadId: t.id }}
                    className="block text-sm font-medium text-fg hover:text-primary"
                  >
                    {t.title}
                  </Link>
                  <p className="mt-0.5 text-[11px] text-subtle">
                    {cat?.name} · {t.replies} cevap
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-xs text-muted">Henüz konu yok.</p>
        )}
      </Widget>

      <Widget title="En son içerikler">
        {latest.length ? (
          <ul className="divide-y divide-border">
            {latest.map((t) => (
              <li key={t.id} className="py-2.5 first:pt-0 last:pb-0">
                <Link
                  to="/konu/$threadId"
                  params={{ threadId: t.id }}
                  className="block text-sm text-fg hover:text-primary"
                >
                  {t.title}
                </Link>
                <p className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-subtle">
                  <span>{formatRelative(t.lastPostAt)} ·</span>
                  <UserName
                    name={displayName(t.lastPosterId, names)}
                    size="sm"
                    showBadge={false}
                  />
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted">Henüz içerik yok.</p>
        )}
      </Widget>

      <Widget title="Çevrimiçi" icon={<Users className="size-3.5 text-online" />}>
        <p className="text-sm text-muted">
          Üye:{" "}
          <strong className="font-semibold text-fg">{onlineMembers}</strong>
        </p>
        {currentUser?.displayName ? (
          <div className="mt-2">
            <UserName name={currentUser.displayName} size="sm" />
          </div>
        ) : (
          <p className="mt-1 text-[11px] text-subtle">Giriş yapan üye yok.</p>
        )}
        {isFounder(currentUser) && (
          <p className="mt-2 text-[11px] font-medium text-primary">
            Kurucu yetkileri aktif.
          </p>
        )}
      </Widget>

      <Widget title="Forum istatistikleri">
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <Stat label="Konular" value={formatCount(threads.length)} />
          <Stat label="Mesajlar" value={formatCount(posts.length)} />
          <Stat label="Üyeler" value={formatCount(members.length)} />
          <Stat
            label="Son üye"
            value={newestMember}
            neon={newestMember !== "—" && true}
          />
        </dl>
      </Widget>
    </aside>
  );
}

function Widget({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <header className="flex items-center gap-1.5 border-b border-border bg-bg-elevated px-3 py-2">
        {icon}
        <h2 className="text-xs font-semibold tracking-wide text-fg uppercase">
          {title}
        </h2>
      </header>
      <div className="px-3 py-3">{children}</div>
    </section>
  );
}

function Stat({
  label,
  value,
  neon,
}: {
  label: string;
  value: string;
  neon?: boolean;
}) {
  return (
    <div className="rounded-md bg-bg-elevated px-2.5 py-2">
      <dt className="text-[11px] text-subtle">{label}</dt>
      <dd className="truncate text-sm font-semibold text-fg">
        {neon && value !== "—" ? (
          <UserName name={value} size="sm" showBadge={false} />
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
