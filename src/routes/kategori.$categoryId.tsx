import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, PenSquare } from "lucide-react";
import { ForumShell } from "@/components/forum/layout";
import { CategoryIcon } from "@/components/forum/icons";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/lib/forum/data";
import { displayName } from "@/lib/forum/names";
import { useForumStore } from "@/lib/forum/store";
import { formatCount, formatRelative } from "@/lib/utils";

export const Route = createFileRoute("/kategori/$categoryId")({
  component: CategoryPage,
});

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const cat = getCategory(categoryId);
  const names = useForumStore((s) => s.names);
  const allPosts = useForumStore((s) => s.posts);
  const threads = useForumStore((s) => s.threads)
    .filter((t) => t.categoryId === categoryId)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return +new Date(b.lastPostAt) - +new Date(a.lastPostAt);
    });
  const postCount = allPosts.filter((p) =>
    threads.some((t) => t.id === p.threadId),
  ).length;

  if (!cat) {
    throw notFound();
  }

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
              {formatCount(threads.length)} konu · {formatCount(postCount)}{" "}
              mesaj
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to="/yeni-konu" search={{ kategori: cat.id }}>
            <PenSquare className="size-3.5" />
            Yeni konu
          </Link>
        </Button>
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
                          <Link
                            to="/konu/$threadId"
                            params={{ threadId: t.id }}
                            className="font-medium text-fg hover:text-primary"
                          >
                            {t.title}
                          </Link>
                        </div>
                        <p className="mt-0.5 text-[11px] text-subtle">
                          {displayName(t.authorId, names)} ·{" "}
                          {formatRelative(t.createdAt)}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-muted">
                        {t.replies}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-muted">
                        {formatCount(t.views)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs">
                        <div className="font-medium text-fg">
                          {displayName(t.lastPosterId, names)}
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
            <p className="text-sm text-muted">
              Bu kategoride henüz konu yok.
            </p>
            <Link
              to="/yeni-konu"
              search={{ kategori: cat.id }}
              className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
            >
              İlk konuyu sen aç
            </Link>
          </div>
        )}
      </section>
    </ForumShell>
  );
}
