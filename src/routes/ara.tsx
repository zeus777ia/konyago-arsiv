import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, MessageSquare, Search, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ForumShell } from "@/components/forum/layout";
import { unifiedSearch } from "@/lib/search";
import { useForumStore } from "@/lib/forum/store";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useJobsStore } from "@/lib/jobs/store";
import { formatRelative } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/ara")({
  validateSearch: searchSchema,
  component: SearchPage,
});

function SearchPage() {
  const { q: initial } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(initial ?? "");
  const threads = useForumStore((s) => s.threads);
  const posts = useForumStore((s) => s.posts);
  const names = useForumStore((s) => s.names);
  const listings = useMarketplaceStore((s) => s.listings);
  const jobs = useJobsStore((s) => s.jobs);

  const hits = useMemo(
    () =>
      unifiedSearch({
        q,
        threads,
        posts,
        names,
        listings,
        jobs,
      }),
    [q, threads, posts, names, listings, jobs],
  );

  const kindIcon = {
    thread: <MessageSquare className="size-3.5 text-primary" />,
    listing: <ShoppingBag className="size-3.5 text-accent" />,
    job: <Briefcase className="size-3.5 text-sky-700" />,
  } as const;

  const kindLabel = {
    thread: "Forum",
    listing: "İkinci el",
    job: "İş",
  } as const;

  return (
    <ForumShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-xl font-semibold tracking-tight">Arama</h1>
        <p className="mb-4 text-sm text-muted">
          Konu, ikinci el ilan ve iş panosu tek yerde.
        </p>
        <form
          className="mb-5"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({ search: { q: q.trim() } });
          }}
        >
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Örn. Sille, etli ekmek, staj…"
              className="h-11 w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-10 text-sm shadow-card outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              autoFocus
            />
          </label>
        </form>

        {q.trim().length < 2 ? (
          <p className="text-sm text-muted">En az 2 karakter yazın.</p>
        ) : hits.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted shadow-card">
            “{q}” için sonuç yok.
          </p>
        ) : (
          <ul className="space-y-2">
            {hits.map((h) => (
              <li key={`${h.kind}-${h.id}`}>
                <Link
                  to={
                    h.kind === "thread"
                      ? "/konu/$threadId"
                      : h.kind === "listing"
                        ? "/ikinci-el/$listingId"
                        : "/is-ilani/$jobId"
                  }
                  params={
                    h.kind === "thread"
                      ? { threadId: h.id }
                      : h.kind === "listing"
                        ? { listingId: h.id }
                        : { jobId: h.id }
                  }
                  className="block rounded-xl border border-border bg-surface px-4 py-3 shadow-card transition-colors hover:border-primary/30 hover:bg-surface-hover"
                >
                  <div className="mb-1 flex items-center gap-2 text-[11px] text-subtle">
                    {kindIcon[h.kind]}
                    <span className="font-medium uppercase tracking-wide">
                      {kindLabel[h.kind]}
                    </span>
                    <span>· {formatRelative(h.at)}</span>
                  </div>
                  <p className="text-sm font-semibold text-fg">{h.title}</p>
                  {h.snippet && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted">
                      {h.snippet}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ForumShell>
  );
}
