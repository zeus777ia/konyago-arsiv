import { useEffect, useState } from "react";
import { formatDate, formatRelativeTo } from "@/lib/utils";

/** Client-upgraded relative time; first paint matches SSR absolute date. */
export function RelativeTime({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const [label, setLabel] = useState(() => formatDate(iso));
  useEffect(() => {
    const tick = () => setLabel(formatRelativeTo(iso, Date.now()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [iso]);
  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {label}
    </time>
  );
}
