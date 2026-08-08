import { Link } from "@tanstack/react-router";
import { categoryGroups, getCategory, isThreadPublic } from "@/lib/forum/data";
import { displayName } from "@/lib/forum/names";
import { CategoryIcon } from "@/components/forum/icons";
import { UserName } from "@/components/forum/user-name";
import { FreshBadges, TagChips } from "@/components/forum/fresh-badge";
import { formatCount, formatRelative } from "@/lib/utils";
import { filterVisibleThreads, useForumStore } from "@/lib/forum/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { isFounder } from "@/lib/staff/founder";

/** Ana sayfada "Resmi" grubu OfficialSpotlight ile gösterilir */
const HIDDEN_HOME_GROUPS = new Set(["Resmi"]);

export function CategoryList({
  filter = "",
  hideOfficialGroup = false,
}: {
  filter?: string;
  hideOfficialGroup?: boolean;
}) {
  const threads = useForumStore((s) => s.threads);
  const posts = useForumStore((s) => s.posts);
  const names = useForumStore((s) => s.names);
  const user = useCurrentUser();
  const founder = isFounder(user);
  const q = filter.trim().toLowerCase();
  const groups = categoryGroups()
    .filter(([group]) => !(hideOfficialGroup && HIDDEN_HOME_GROUPS.has(group)))
    .map(
      ([group, cats]) =>
        [
          group,
          cats.filter(
            (c) =>
              !q ||
              c.name.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q) ||
              group.toLowerCase().includes(q),
          ),
        ] as const,
    )
    .filter(([, cats]) => cats.length > 0);

  const visible = filterVisibleThreads(threads, {
    isFounder: founder,
    authorName: user?.displayName,
    names,
    includePendingOwn: true,
  });

  return (
    <div className="space-y-4">
      {groups.map(([group, cats]) => (
        <section
          key={group}
          className="overflow-hidden rounded-lg border border-border bg-surface shadow-card"
        >
          <header className="border-b border-border bg-header px-3 py-2 sm:px-4">
            <h2 className="text-xs font-semibold tracking-wide text-header-fg uppercase">
              {group}
            </h2>
          </header>
          <ul className="divide-y divide-border">
            {cats.map((cat) => {
              const catThreads = visible.filter((t) => t.categoryId === cat.id);
              const publicOnes = catThreads.filter(isThreadPublic);
              const topicCount = publicOnes.length;
              const postCount = posts.filter((p) =>
                publicOnes.some((t) => t.id === p.threadId),
              ).length;
              const last = [...publicOnes].sort(
                (a, b) => +new Date(b.lastPostAt) - +new Date(a.lastPostAt),
              )[0];
              return (
                <li
                  key={cat.id}
                  className="grid gap-3 px-3 py-3 transition-colors hover:bg-surface-hover sm:grid-cols-[1fr_auto] sm:items-center sm:px-4"
                >
                  <div className="flex min-w-0 gap-3">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <Link
                        to="/kategori/$categoryId"
                        params={{ categoryId: cat.id }}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {cat.name}
                      </Link>
                      <p className="mt-0.5 text-xs leading-snug text-muted">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pl-[52px] sm:pl-0">
                    <div className="text-center">
                      <div className="text-sm font-semibold tabular-nums text-fg">
                        {formatCount(topicCount)}
                      </div>
                      <div className="text-[10px] tracking-wide text-subtle uppercase">
                        Konu
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold tabular-nums text-fg">
                        {formatCount(postCount)}
                      </div>
                      <div className="text-[10px] tracking-wide text-subtle uppercase">
                        Mesaj
                      </div>
                    </div>
                    <div className="hidden min-w-40 max-w-48 text-right lg:block">
                      {last ? (
                        <>
                          <Link
                            to="/konu/$threadId"
                            params={{ threadId: last.id }}
                            className="line-clamp-1 text-xs font-medium text-fg hover:text-primary"
                          >
                            {last.title}
                          </Link>
                          <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-subtle">
                            <span>{formatRelative(last.lastPostAt)} ·</span>
                            <UserName
                              name={displayName(last.lastPosterId, names)}
                              size="sm"
                              showBadge={false}
                            />
                          </p>
                        </>
                      ) : (
                        <span className="text-xs text-subtle">Henüz konu yok</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {!groups.length && (
        <div className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted shadow-card">
          Aramanızla eşleşen kategori yok.
        </div>
      )}
    </div>
  );
}

export function LatestThreadsTable({
  filter = "",
  limit = 14,
  title = "Yeni mesajlar",
  showAllLink = true,
}: {
  filter?: string;
  limit?: number;
  title?: string;
  showAllLink?: boolean;
}) {
  const threads = useForumStore((s) => s.threads);
  const names = useForumStore((s) => s.names);
  const user = useCurrentUser();
  const founder = isFounder(user);
  const q = filter.trim().toLowerCase();
  const list = filterVisibleThreads(threads, {
    isFounder: founder,
    authorName: user?.displayName,
    names,
    includePendingOwn: true,
  })
    .sort((a, b) => +new Date(b.lastPostAt) - +new Date(a.lastPostAt))
    .filter(
      (t) =>
        !q ||
        t.title.toLowerCase().includes(q) ||
        displayName(t.authorId, names).toLowerCase().includes(q) ||
        (getCategory(t.categoryId)?.name.toLowerCase().includes(q) ?? false),
    )
    .slice(0, limit);

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <header className="flex items-center justify-between border-b border-border bg-bg-elevated px-3 py-2 sm:px-4">
        <h2 className="text-xs font-semibold tracking-wide text-fg uppercase">
          {title}
        </h2>
        {showAllLink && (
          <Link
            to="/yeni-mesajlar"
            className="text-[11px] font-medium text-primary hover:underline"
          >
            Tümü
          </Link>
        )}
      </header>

      {list.length > 0 ? (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-row text-[11px] tracking-wide text-subtle uppercase">
                <tr>
                  <th className="px-4 py-2 font-medium">Konu</th>
                  <th className="px-3 py-2 font-medium">Forum</th>
                  <th className="px-3 py-2 text-right font-medium">Cevap</th>
                  <th className="px-3 py-2 text-right font-medium">Hit</th>
                  <th className="px-4 py-2 text-right font-medium">Son yazan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((t, i) => {
                  const category = getCategory(t.categoryId);
                  return (
                    <tr
                      key={t.id}
                      className={i % 2 === 0 ? "bg-row-alt" : "bg-row"}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-start gap-2">
                          {t.pinned && (
                            <span className="mt-0.5 rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                              SABİT
                            </span>
                          )}
                          {t.status === "pending" && (
                            <span className="mt-0.5 rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                              İNCELEME
                            </span>
                          )}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Link
                                to="/konu/$threadId"
                                params={{ threadId: t.id }}
                                className="font-medium text-fg hover:text-primary"
                              >
                                {t.title}
                              </Link>
                              <FreshBadges thread={t} />
                            </div>
                            <p className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-subtle">
                              <UserName
                                name={displayName(t.authorId, names)}
                                size="sm"
                              />
                              <span>· {formatRelative(t.createdAt)}</span>
                            </p>
                            {t.tags && t.tags.length > 0 && (
                              <div className="mt-1">
                                <TagChips tags={t.tags} />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted">
                        {category ? (
                          <Link
                            to="/kategori/$categoryId"
                            params={{ categoryId: category.id }}
                            className="hover:text-primary hover:underline"
                          >
                            {category.name}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-muted">
                        {t.replies}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-muted">
                        {formatCount(t.views)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end">
                          <UserName
                            name={displayName(t.lastPosterId, names)}
                            size="sm"
                          />
                        </div>
                        <div className="text-[11px] text-subtle">
                          {formatRelative(t.lastPostAt)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-border md:hidden">
            {list.map((t) => {
              const category = getCategory(t.categoryId);
              return (
                <li key={t.id} className="px-3 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                      to="/konu/$threadId"
                      params={{ threadId: t.id }}
                      className="text-sm font-medium text-fg hover:text-primary"
                    >
                      {t.title}
                    </Link>
                    <FreshBadges thread={t} />
                  </div>
                  <p className="mt-1 text-[11px] text-subtle">
                    {category?.name} · {t.replies} cevap ·{" "}
                    {formatRelative(t.lastPostAt)}
                  </p>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className="px-4 py-10 text-center">
          <p className="text-sm text-muted">Henüz konu yok.</p>
          <Link
            to="/yeni-konu"
            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
          >
            İlk konuyu sen aç
          </Link>
        </div>
      )}
    </section>
  );
}
