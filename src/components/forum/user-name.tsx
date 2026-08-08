import { Link } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FOUNDER_TITLE, isFounderName } from "@/lib/staff/founder";

export function UserName({
  name,
  className,
  size = "md",
  showBadge = true,
  link = true,
}: {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  link?: boolean;
}) {
  const founder = isFounderName(name);
  const profileTo = {
    to: "/uye/$name" as const,
    params: { name: encodeURIComponent(name) },
  };

  const nameEl = founder ? (
    <span
      className={cn(
        "founder-neon font-bold tracking-wide",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        size === "lg" && "text-base",
      )}
      title="Site kurucusu"
    >
      {name}
    </span>
  ) : (
    <span
      className={cn(
        "font-medium text-fg",
        link && "hover:text-primary hover:underline",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        size === "lg" && "text-base",
      )}
    >
      {name}
    </span>
  );

  return (
    <span
      className={cn(
        "inline-flex max-w-full flex-wrap items-center gap-1.5",
        className,
      )}
    >
      {link ? (
        <Link
          {...profileTo}
          className="min-w-0 max-w-full truncate"
          onClick={(e) => e.stopPropagation()}
        >
          {nameEl}
        </Link>
      ) : (
        nameEl
      )}
      {founder && showBadge && (
        <span className="founder-badge inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase">
          <Crown className="size-2.5" aria-hidden />
          {FOUNDER_TITLE}
        </span>
      )}
    </span>
  );
}
