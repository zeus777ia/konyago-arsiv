import { useEffect, useState } from "react";
import { isFresh, isUpdatedRecently, type Thread } from "@/lib/forum/data";

export function FreshBadges({ thread }: { thread: Thread }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  const neu = isFresh(thread.createdAt, 24);
  const upd = isUpdatedRecently(thread);
  if (!neu && !upd) return null;
  return (
    <span className="inline-flex items-center gap-1">
      {neu && (
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-emerald-800 uppercase">
          Yeni
        </span>
      )}
      {!neu && upd && (
        <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-sky-800 uppercase">
          Güncellendi
        </span>
      )}
    </span>
  );
}

export function TagChips({
  tags,
  onClick,
}: {
  tags?: string[];
  onClick?: (tag: string) => void;
}) {
  if (!tags?.length) return null;
  return (
    <span className="inline-flex flex-wrap gap-1">
      {tags.map((tag) =>
        onClick ? (
          <button
            key={tag}
            type="button"
            onClick={() => onClick(tag)}
            className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20"
          >
            #{tag}
          </button>
        ) : (
          <span
            key={tag}
            className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary"
          >
            #{tag}
          </span>
        ),
      )}
    </span>
  );
}
