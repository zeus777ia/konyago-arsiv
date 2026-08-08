import { Link } from "@tanstack/react-router";
import { categoryGroups, getCategory } from "@/lib/forum/data";
import { displayName } from "@/lib/forum/names";
import { CategoryIcon } from "@/components/forum/icons";
import { formatCount, formatRelative } from "@/lib/utils";
import { useForumStore } from "@/lib/forum/store";

export function CategoryList({ filter = "" }: { filter?: string }) {
  const threads = useForumStore((s) => s.threads);
  const posts = useForumStore((s) => s.posts);
  const names = useForumStore((s) => s.names);
  const q = filter.trim().toLowerCase();
  const groups = categoryGroups()
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
              const catThreads = threads.filter((t) => t.categoryId === cat.id);
              const topicCount = catThreads.length;
              const postCount = posts.filter((p) =>
                catThreads.some((t) => t.id === p.threadId),
              ).length;
              const last = [...catThreads].sort(
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
                      {last && (
                        <p className="mt-1.5 truncate text-[11px] text-subtle sm:hidden">
                          Son: {last.title} · {formatRelative(last.lastPostAt)}
                        </p>
                      )}
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
                          <p className="mt-0.5 text-[11px] text-subtle">
                            {formatRelative(last.lastPostAt)} ·{" "}
                            {displayName(last.lastPosterId, names)}
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
  const q = filter.trim().toLowerCase();
  const list = [...threads]
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
                          {t.hot && (
                            <span className="mt-0.5 rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                              SICAK
                            </span>
                          )}
                          <div className="min-w-0">
                            <Link
                              to="/konu/$threadId"
                              params={{ threadId: t.id }}
                              className="font-medium text-fg hover:text-primary"
                            >
                              {t.title}
                            </Link>
                            <p className="text-[11px] text-subtle">
                              {displayName(t.authorId, names)} ·{" "}
                              {formatRelative(t.createdAt)}
                            </p>
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
                        <div className="text-xs font-medium text-fg">
                          {displayName(t.lastPosterId, names)}
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
                  <Link
                    to="/konu/$threadId"
                    params={{ threadId: t.id }}
                    className="text-sm font-medium text-fg hover:text-primary"
                  >
                    {t.title}
                  </Link>
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
