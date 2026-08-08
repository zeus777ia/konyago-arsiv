import { useSyncExternalStore } from "react";
import { cn, initials } from "@/lib/utils";
import { isFounderName } from "@/lib/staff/founder";
import {
  getMemberActivityByName,
  getMemberAvatarByName,
  useMembersStore,
} from "@/lib/members/store";
import { getFrame, normalizeActivity } from "@/lib/members/ranks";

const COLORS = [
  "bg-primary/15 text-primary",
  "bg-accent-soft text-accent",
  "bg-sky-100 text-sky-800",
  "bg-amber-100 text-amber-900",
  "bg-violet-100 text-violet-800",
  "bg-rose-100 text-rose-800",
];

function subscribeMembers(cb: () => void) {
  return useMembersStore.subscribe(cb);
}

function membersSnapshot() {
  return useMembersStore.getState().members;
}

export function Avatar({
  name,
  size = "md",
  className,
  imageUrl,
  showFrame = true,
}: {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** override — yoksa üye deposundan */
  imageUrl?: string | null;
  showFrame?: boolean;
}) {
  useSyncExternalStore(subscribeMembers, membersSnapshot, () => []);

  const founder = isFounderName(name);
  const color = COLORS[Math.abs(name.charCodeAt(0)) % COLORS.length];
  const src =
    imageUrl !== undefined ? imageUrl ?? undefined : getMemberAvatarByName(name);
  const activity = getMemberActivityByName(name);
  const frame = getFrame(normalizeActivity(activity));

  const dim =
    size === "sm"
      ? "size-7 text-[10px]"
      : size === "md"
        ? "size-9 text-xs"
        : size === "lg"
          ? "size-12 text-sm"
          : "size-16 text-base";

  const framePad =
    showFrame && frame.id !== "none"
      ? size === "sm"
        ? "p-[2px]"
        : size === "md"
          ? "p-[2.5px]"
          : "p-[3px]"
      : "";

  const inner = src ? (
    <img
      src={src}
      alt=""
      className="h-full w-full rounded-full object-cover"
    />
  ) : (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full font-semibold",
        founder ? "founder-avatar" : color,
      )}
    >
      {founder ? "★" : initials(name)}
    </span>
  );

  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full",
        dim,
        showFrame && frame.id !== "none" && frame.ringClass,
        framePad,
        className,
      )}
      aria-hidden
      title={frame.id !== "none" ? `${name} · ${frame.label}` : name}
    >
      <span className="block h-full w-full overflow-hidden rounded-full bg-surface">
        {inner}
      </span>
    </span>
  );
}
