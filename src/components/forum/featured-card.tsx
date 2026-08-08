import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useForumStore } from "@/lib/forum/store";
import { useSiteMetaStore } from "@/lib/site/announcements";
import { formatRelative } from "@/lib/utils";
import { UserName } from "@/components/forum/user-name";
import { displayName } from "@/lib/forum/names";

export function FeaturedArchiveCard() {
  const threads = useForumStore((s) => s.threads);
  const names = useForumStore((s) => s.names);
  const featuredId = useSiteMetaStore((s) => s.featuredThreadId);
  const label = useSiteMetaStore((s) => s.featuredLabel);

  const thread =
    threads.find((t) => t.featured) ||
    (featuredId ? threads.find((t) => t.id === featuredId) : undefined) ||
    threads.find((t) => t.pinned && (!t.status || t.status === "approved"));

  if (!thread) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-primary-soft via-surface to-surface shadow-card">
      <div className="flex items-center gap-2 border-b border-primary/15 px-4 py-2.5">
        <Sparkles className="size-4 text-primary" />
        <h2 className="text-xs font-bold tracking-wide text-primary uppercase">
          {label}
        </h2>
      </div>
      <div className="px-4 py-3">
        <Link
          to="/konu/$threadId"
          params={{ threadId: thread.id }}
          className="text-sm font-semibold text-fg hover:text-primary"
        >
          {thread.title}
        </Link>
        <p className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-subtle">
          <UserName name={displayName(thread.authorId, names)} size="sm" />
          <span>· {formatRelative(thread.lastPostAt)}</span>
          <span>
            · {thread.replies} cevap · {thread.views} görüntülenme
          </span>
        </p>
      </div>
    </section>
  );
}
