import { cn, initials } from "@/lib/utils";
import { isFounderName } from "@/lib/staff/founder";

const COLORS = [
  "bg-primary/15 text-primary",
  "bg-accent-soft text-accent",
  "bg-sky-100 text-sky-800",
  "bg-amber-100 text-amber-900",
  "bg-violet-100 text-violet-800",
  "bg-rose-100 text-rose-800",
];

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const founder = isFounderName(name);
  const color = COLORS[name.charCodeAt(0) % COLORS.length];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        size === "sm" && "size-7 text-[10px]",
        size === "md" && "size-9 text-xs",
        size === "lg" && "size-12 text-sm",
        founder ? "founder-avatar" : color,
        className,
      )}
      aria-hidden
    >
      {founder ? "★" : initials(name)}
    </span>
  );
}
