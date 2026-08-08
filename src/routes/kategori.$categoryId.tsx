import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, Lock, PenSquare } from "lucide-react";
import { ForumShell } from "@/components/forum/layout";
import { CategoryIcon } from "@/components/forum/icons";
import { UserName } from "@/components/forum/user-name";
import { Button } from "@/components/ui/button";
import { getCategory, isThreadPublic } from "@/lib/forum/data";
import { displayName } from "@/lib/forum/names";
import { filterVisibleThreads, useForumStore } from "@/lib/forum/store";
import { formatCount, formatRelative } from "@/lib/utils";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { isFounder } from "@/lib/staff/founder";
import { isCategoryLockedForUsers } from "@/lib/forum/moderation";

export const Route = createFileRoute("/kategori/$categoryId")({
  component: CategoryPage,
});

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const cat = getCategory(categoryId);
  const user = useCurrentUser();
  const founder = isFounder(user);
  const names = useForumStore((s) => s.names);
  const allPosts = useForumStore((s) => s.posts);
  const allThreads = useForumStore((s) => s.threads);
  const threads = filterVisibleThreads(
    allThreads.filter((t) => t.categoryId === categoryId),
    {
      isFounder: founder,
      authorName: user?.displayName,
      names,
      includePendingOwn: true,
    },
  ).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return +new Date(b.lastPostAt) - +new Date(a.lastPostAt);
  });
  const publicThreads = threads.filter(isThreadPublic);
  const postCount = allPosts.filter((p) =>
    publicThreads.some((t) => t.id === p.threadId),
  ).length;

  if (!cat) {
    throw notFound();
  }

  const locked = isCategoryLockedForUsers(categoryId) && !founder;

  return (
    <ForumShell>
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link to="/" className="hover:text-primary">
          Ana sayfa
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-fg">{cat.name}</span>
      </nav>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: cat.color }}
          >
            <CategoryIcon name={cat.icon} className="size-5" />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
              {cat.name}
            </h1>
            <p className="mt-0.5 text-sm text-muted">{cat.description}</p>
            <p className="mt-1 text-xs text-subtle">
              {formatCount(publicThreads.length)} konu ·{" "}
              {formatCount(postCount)} mesaj
            </p>
            {locked && (
              <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-badge px-2 py-1 text-[11px] font-medium text-muted">
                <Lock className="size-3" />
                Bu bölüme yalnızca kurucu konu açabilir
              </p>
            )}
          </div>
        </div>
        {!locked ? (
          <Button asChild>
            <Link to="/yeni-konu" search={{ kategori: cat.id }}>
              <PenSquare className="size-3.5" />
              Yeni konu
            </Link>
          </Button>
        ) : (
          <Button variant="secondary" disabled>
            <Lock className="size-3.5" />
            Konu açılamaz
          </Button>
        )}
      </div>

      <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
        <header className="border-b border-border bg-header px-3 py-2 sm:px-4">
          <h2 className="text-xs font-semibold tracking-wide text-header-fg uppercase">
            Konular
          </h2>
        </header>

        {threads.length > 0 ? (
          <>
            <div className="hidden md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-row text-[11px] tracking-wide text-subtle uppercase">
                  <tr>
                    <th className="px-4 py-2 font-medium">Konu</th>
                    <th className="px-3 py-2 text-right font-medium">Cevap</th>
                    <th className="px-3 py-2 text-right font-medium">Hit</th>
                    <th className="px-4 py-2 text-right font-medium">Son yazan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {threads.map((t, i) => (
                    <tr
                      key={t.id}
                      className={i % 2 === 0 ? "bg-row-alt" : "bg-row"}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {t.pinned && (
                            <span className="rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                              SABİT
                            </span>
                          )}
                          {t.hot && (
                            <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                              SICAK
                            </span>
                          )}
                          {t.locked && (
                            <span className="rounded bg-badge px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                              KİLİT
                            </span>
                          )}
                          {t.status === "pending" && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                              İNCELEMEDE
                            </span>
                          )}
                          <Link
                            to="/konu/$threadId"
                            params={{ threadId: t.id }}
                            className="font-medium text-fg hover:text-primary"
                          >
                            {t.title}
                          </Link>
                        </div>
                        <p className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-subtle">
                          <UserName
                            name={displayName(t.authorId, names)}
                            size="sm"
                            showBadge={false}
                          />
                          <span>· {formatRelative(t.createdAt)}</span>
                        </p>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-muted">
                        {t.replies}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-muted">
                        {formatCount(t.views)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs">
                        <div className="flex justify-end">
                          <UserName
                            name={displayName(t.lastPosterId, names)}
                            size="sm"
                            showBadge={false}
                          />
                        </div>
                        <div className="text-subtle">
                          {formatRelative(t.lastPostAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {threads.map((t) => (
                <li key={t.id} className="px-3 py-3">
                  <Link
                    to="/konu/$threadId"
                    params={{ threadId: t.id }}
                    className="text-sm font-medium text-fg hover:text-primary"
                  >
                    {t.title}
                  </Link>
                  <p className="mt-1 text-[11px] text-subtle">
                    {t.replies} cevap · {formatCount(t.views)} hit ·{" "}
                    {formatRelative(t.lastPostAt)}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-muted">Bu kategoride henüz konu yok.</p>
            {!locked && (
              <Link
                to="/yeni-konu"
                search={{ kategori: cat.id }}
                className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
              >
                İlk konuyu sen aç
              </Link>
            )}
          </div>
        )}
      </section>
    </ForumShell>
  );
}
